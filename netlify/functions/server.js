import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";
import serverless from "serverless-http";
import { builder } from "@netlify/functions";

const isProduction = true; // Netlify Functions are always production
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

const templateHtml = await fs.readFile("./dist/client/index.html", "utf-8");

const app = express();

const compression = (await import("compression")).default;
const sirv = (await import("sirv")).default;
app.use(compression());
app.use(base, sirv("./dist/client", { extensions: [] }));

app.use("*", async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, "");

        let template = templateHtml;
        let render = (await import("../../dist/server/entry-server.js")).render;

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

                const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

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

// Export as Netlify Function handler
export const handler = builder(serverless(app));
