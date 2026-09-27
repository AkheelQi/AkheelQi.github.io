#!/usr/bin/env node
/**
 * Export the built app to a static GitHub Pages tree.
 *
 *   1. starts the preview server (the real built output, SSR included)
 *   2. fetches every route's rendered HTML
 *   3. writes `<out>/<route>/index.html` plus a copy of the client assets
 *
 * Run `npm run build` first. `BASE_PATH` must match the build's BASE_PATH
 * (default "/").
 *
 *   BASE_PATH=/portfolio/ node scripts/export-static.mjs
 *
 * Output: .output/gh-pages/ — what .github/workflows/deploy-pages.yml
 * uploads. Nitro's own `static` preset is not used: under the vite builder
 * its prerenderer emits empty pages (see git history).
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_PATH = process.env.BASE_PATH || "/";
const BASE = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
const ORIGIN = "http://127.0.0.1:8081";
const OUT = join(ROOT, ".output", "gh-pages");

const ROUTES = [
  "/",
  "/home",
  "/bio",
  "/bibliography",
  "/fame",
  "/activity",
  "/gear",
  "/guestbook",
  "/contact",
];

/** Client build output — vercel preset writes it here. */
const ASSETS_DIR = join(ROOT, ".vercel", "output", "static");

function preview(action) {
  const res = spawnSync(process.execPath, [join(ROOT, "scripts", "preview.mjs"), action], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (res.status !== 0) {
    throw new Error(`preview ${action} failed with status ${res.status}`);
  }
}

function fail(msg) {
  console.error(`[export] ${msg}`);
  process.exit(1);
}

if (!existsSync(ASSETS_DIR)) {
  fail(`no build found at ${ASSETS_DIR} — run \`npm run build\` first (BASE_PATH=${BASE_PATH})`);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. Static assets first; route HTML is written after so it always wins.
cpSync(ASSETS_DIR, OUT, { recursive: true });

// 2. Rendered HTML from the built server.
let previewUp = false;
try {
  console.log(`[export] BASE_PATH=${BASE} → ${OUT}`);
  preview("restart");
  previewUp = true;

  const written = [];
  for (const route of ROUTES) {
    const url = `${ORIGIN}${BASE}${route === "/" ? "" : route.slice(1)}`;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) fail(`${route} → HTTP ${res.status} (${url})`);
    const html = await res.text();
    if (!html.includes("<title")) fail(`${route} did not return HTML (${url})`);
    if (!html.includes("AKHEEL")) fail(`${route} returned unexpected content (${url})`);
    if (!html.includes(`${BASE}assets/`)) {
      fail(`${route} HTML lacks "${BASE}assets/" — was the build run with BASE_PATH=${BASE_PATH}?`);
    }
    const file =
      route === "/" ? join(OUT, "index.html") : join(OUT, route.slice(1), "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    written.push(`  ${route} → ${file.slice(OUT.length + 1)} (${html.length} B)`);
  }
  console.log(`[export] prerendered routes:\n${written.join("\n")}`);
} finally {
  if (previewUp) preview("stop");
}

// 3. GitHub Pages: never run Jekyll on the artifact (keeps __grok/ etc.).
writeFileSync(join(OUT, ".nojekyll"), "");

console.log(`[export] done — ${OUT}`);
