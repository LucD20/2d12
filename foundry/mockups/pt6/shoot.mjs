// Playtest 6's mockups: serves the repository, opens index.html in dark and light, and saves pt6-<theme>.jpg (the whole page) and one picture
// a section (d1 ... d5) here.   node foundry/mockups/pt6/shoot.mjs   (Playwright with its Chromium; --1x for small pictures, --out <dir>)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const REPO = path.resolve(fileURLToPath(new URL("../../../", import.meta.url))), HERE = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(import.meta.url)("playwright");
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp", ".hbs": "text/plain" };
const server = http.createServer((req, res) => {
  const p = path.join(REPO, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(REPO) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const args = process.argv.slice(2), outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : HERE;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: args.includes("--1x") ? 1 : 2 });
page.on("pageerror", e => console.log("PAGE ERROR", String(e.message ?? e)));
page.on("response", r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
page.on("console", m => { if (["error", "warning"].includes(m.type())) console.log(m.type(), m.text().slice(0, 600)); });
for (const t of ["dark", "light"]) {
  await page.goto(`${BASE}/foundry/mockups/pt6/index.html?theme=${t}`);
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  if (!args.includes("--parts-only")) { const f = path.join(outDir, `pt6-${t}.jpg`); await page.screenshot({ path: f, type: "jpeg", quality: 80, fullPage: true }); console.log(f); }
  for (const s of await page.$$(".p6-sec")) { const f = path.join(outDir, `${await s.getAttribute("id")}-${t}.jpg`); await s.screenshot({ path: f, type: "jpeg", quality: 82 }); console.log(f); }
}
await browser.close(); server.close();
