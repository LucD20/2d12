// The map notes' mockup: serves the repository, opens index.html dark and light, and saves one picture a state here:
// mapnotes-<state>-<theme>.jpg (2x).   node foundry/mockups/mapnotes/shoot.mjs   (Playwright with its Chromium; --1x, --out <dir>)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const REPO = path.resolve(fileURLToPath(new URL("../../../", import.meta.url))), HERE = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(import.meta.url)("playwright");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const p = path.join(REPO, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(REPO) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const args = process.argv.slice(2), outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : HERE;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1100 }, deviceScaleFactor: args.includes("--1x") ? 1 : 2 });
page.on("pageerror", e => console.log("PAGE ERROR", String(e.message ?? e)));
page.on("response", r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
for (const t of ["dark", "light"]) {
  await page.goto(`${BASE}/foundry/mockups/mapnotes/index.html?theme=${t}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  await page.waitForTimeout(400);
  for (const s of await page.$$(".mn-sec")) {
    const id = (await s.getAttribute("id")).replace(/^s-/, "");
    const f = path.join(outDir, `mapnotes-${id}-${t}.jpg`);
    await s.screenshot({ path: f, type: "jpeg", quality: 82, animations: "disabled" });
    console.log(f);
  }
}
await browser.close();
server.close();
