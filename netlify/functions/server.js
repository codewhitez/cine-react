import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";
import serverless from "serverless-http";
import { builder } from "@netlify/functions";
import path from "path";

const isProduction = true; // Netlify Functions are always production
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

let templateHtml;
let compression;
let sirv;
let app;

// Async setup function
async function setup() {
    templateHtml = await fs.readFile("dist/client/index.html", "utf-8");
    compression = (await import("compression")).default;
    sirv = (await import("sirv")).default;

    app = express();
    app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));

    app.use("*", async (req, res) => {
        try {
            const url = req.originalUrl.replace(base, "");
            let template = templateHtml;
            let render = (await import("./dist/server/entry-server.js")).render;

            let didError = false;

            const { pipe, abort } = render(url, {
                onShellError() {
                    res.status(500);
                    res.set({ "Content-Type": "text/html" });
                    res.send("<h1>Something went wrong</h1>");
                },
                onShellReady() {
                    res.status(didError ? 500 : 200);
                    res.set({ "Content-Type": "text/html" });

                    const transformStream = new Transform({
                        transform(chunk, encoding, callback) {
                            res.write(chunk, encoding);
                            callback();
                        },
                    });

                    const [htmlStart, htmlEnd] =
                        template.split(`<!--app-html-->`);

                    res.write(htmlStart);

                    transformStream.on("finish", () => {
                        res.end(htmlEnd);
                    });

                    pipe(transformStream);
                },
                onError(error) {
                    didError = true;
                    console.error(error);
                },
            });

            setTimeout(() => {
                abort();
            }, ABORT_DELAY);
        } catch (e) {
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });
}

// Ensure setup is run before handler is used
const setupPromise = setup();

export const handler = builder(async (event, context) => {
    await setupPromise;
    return serverless(app)(event, context);
});
