// Group 1's screenshots: serves the repository, opens index.html (round 1), round2.html and round3.html in dark and light, and saves
// group1-<theme>.jpg, round2-<theme>.jpg and round3-<theme>.jpg here.
//   node foundry/mockups/group1/shoot.mjs      (Playwright with its Chromium)
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
const page = await browser.newPage({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: args.includes("--1x") ? 1 : 2 });
page.on("pageerror", e => console.log("PAGE ERROR", String(e.message ?? e)));
page.on("response", r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
page.on("console", m => { if (["error", "warning"].includes(m.type())) console.log(m.type(), m.text().slice(0, 400)); });
for (const [file, name] of [["index.html", "group1"], ["round2.html", "round2"], ["round3.html", "round3"]]) for (const t of ["dark", "light"]) {
  if (args.includes("--only") && args[args.indexOf("--only") + 1] !== name) continue;
  await page.goto(`${BASE}/foundry/mockups/group1/${file}?theme=${t}`);
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  const f = path.join(outDir, `${name}-${t}.jpg`);
  await page.screenshot({ path: f, type: "jpeg", quality: 80, fullPage: true });
  console.log(f);
  if (args.includes("--parts")) { let k = 0; for (const s of await page.$$(".g1-sec")) await s.screenshot({ path: path.join(outDir, `${name}-part${++k}-${t}.jpg`), type: "jpeg", quality: 80 }); }
}
await browser.close(); server.close();
