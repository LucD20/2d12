// Group 3's screenshots: serves the repository, opens index.html in dark and light, and saves one picture a section here at 2x,
// group3-<n>-<theme>.jpg (1 Aveline level 1, 2 the Stage, 3 the Level, 4 Species and Class, 5 Aveline level 3), each under 1.5 MB (the JPEG
// quality steps down from 82 until it fits).   node foundry/mockups/group3/shoot.mjs   (Playwright with its Chromium; --1x, --out <dir>,
// --full for one whole-page picture a theme too)
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
const args = process.argv.slice(2), outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : HERE, MAX = 1.5e6;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: args.includes("--1x") ? 1 : 2 });
page.on("pageerror", e => console.log("PAGE ERROR", String(e.message ?? e)));
page.on("response", r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
page.on("console", m => { if (["error", "warning"].includes(m.type())) console.log(m.type(), m.text().slice(0, 400)); });
const save = async (shoot, f) => { for (let q = 82; ; q -= 6) { const buf = await shoot(q); if (buf.length <= MAX || q <= 50) { fs.writeFileSync(f, buf); return `${f} (${Math.round(buf.length / 1024)} KB, q${q})`; } } };
for (const t of ["dark", "light"]) {
  await page.goto(`${BASE}/foundry/mockups/group3/index.html?theme=${t}`);
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  if (args.includes("--full")) console.log(await save(q => page.screenshot({ type: "jpeg", quality: q, fullPage: true }), path.join(outDir, `group3-${t}.jpg`)));
  let k = 0;
  for (const s of await page.$$(".g3-sec")) { k += 1; console.log(await save(q => s.screenshot({ type: "jpeg", quality: q }), path.join(outDir, `group3-${k}-${t}.jpg`))); }
}
await browser.close(); server.close();
