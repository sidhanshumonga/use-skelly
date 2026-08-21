#!/usr/bin/env node
/**
 * Zero-dependency static server for the browser regression suite.
 * The core of this library is layout measurement, which only a real browser can do —
 * jsdom reports a zero-sized box for every element.
 *
 *   npm run test:browser   then open http://localhost:8123/test/regression.html
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 8123;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

http
  .createServer((req, res) => {
    const rel = decodeURIComponent((req.url || "/").split("?")[0]);
    const target = path.join(ROOT, rel === "/" ? "test/regression.html" : rel);

    // Never serve outside the repo.
    if (!target.startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }

    fs.readFile(target, (err, body) => {
      if (err) {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(target)] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(body);
    });
  })
  .listen(PORT, () => {
    console.log(`[skelly/test] http://localhost:${PORT}/test/regression.html`);
  });
