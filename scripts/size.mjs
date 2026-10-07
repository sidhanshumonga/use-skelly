#!/usr/bin/env node
/**
 * Measures what each entry point actually costs a consumer: bundled, minified, gzipped.
 *
 *   npm run size
 *
 * The core is measured whole, since index.js pulls in learn.js. Each adapter is measured
 * with the core and its framework marked external, so the number is what that adapter
 * adds on top of the core rather than a second copy of it.
 */
import { build } from "esbuild";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "packages/skelly/dist");

const TARGETS = [
  { name: "core (use-skelly)", entry: "index.js", external: [] },
  { name: "react adapter", entry: "react.js", external: ["react", "react-dom", "./index"] },
  { name: "vue adapter", entry: "vue.js", external: ["vue", "./index"] },
  { name: "svelte adapter", entry: "svelte.js", external: ["svelte", "./index"] },
  { name: "next helper", entry: "next.js", external: ["./index"] },
  { name: "style.css", entry: "style.css", external: [] }
];

async function measure({ entry, external }) {
  const result = await build({
    entryPoints: [path.join(DIST, entry)],
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    external,
    write: false,
    logLevel: "silent"
  });

  const out = result.outputFiles[0].contents;
  return { min: out.length, gzip: gzipSync(out, { level: 9 }).length };
}

const kb = bytes => `${(bytes / 1024).toFixed(1)} kB`;

const rows = [];
for (const target of TARGETS) {
  rows.push({ name: target.name, ...(await measure(target)) });
}

const width = Math.max(...rows.map(r => r.name.length));
console.log(`\n  ${"entry".padEnd(width)}   ${"min".padStart(8)}  ${"min+gzip".padStart(9)}`);
console.log(`  ${"-".repeat(width)}   ${"-".repeat(8)}  ${"-".repeat(9)}`);
for (const row of rows) {
  console.log(`  ${row.name.padEnd(width)}   ${kb(row.min).padStart(8)}  ${kb(row.gzip).padStart(9)}`);
}
console.log();
