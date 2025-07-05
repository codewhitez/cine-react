import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function createRedirectsPlugin() {
    return {
        name: "create-redirects",
        closeBundle() {
            const redirectsContent = `/index.html /.netlify/functions/server 200\n`;
            const outDir = path.resolve(__dirname, "dist/client");
            if (!fs.existsSync(outDir))
                fs.mkdirSync(outDir, { recursive: true });
            fs.writeFileSync(path.join(outDir, "_redirects"), redirectsContent);
        },
    };
}

function renameIndexPlugin() {
    return {
        name: "rename-index",
        closeBundle() {
            const outDir = path.resolve(__dirname, "dist/client");
            // Rename index.html to index2.html if it exists
            const indexHtml = path.join(outDir, "index.html");
            const index2Html = path.join(outDir, "index2.html");
            if (fs.existsSync(indexHtml)) {
                fs.renameSync(indexHtml, index2Html);
            }
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), createRedirectsPlugin(), renameIndexPlugin()],
});
