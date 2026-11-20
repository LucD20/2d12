// Group 4's screenshots: serves the repository, opens index.html in dark and light, and saves one picture a part here at 2x:
// inventory-p1-<theme>.jpg ... inventory-p6-<theme>.jpg (each under about 1.5 MB).
//   node foundry/mockups/group4/shoot.mjs      (Playwright with its Chromium; --1x for small pictures, --out <dir>)
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
for (const t of ["dark", "light"]) {
  await page.goto(`${BASE}/foundry/mockups/group4/index.html?theme=${t}`);
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  for (const s of await page.$$(".g4-sec-page")) {
    const f = path.join(outDir, `inventory-${await s.getAttribute("id")}-${t}.jpg`);
    await s.screenshot({ path: f, type: "jpeg", quality: 80 });
    console.log(f, `${Math.round(fs.statSync(f).size / 1024)} KB`);
  }
}
await browser.close(); server.close();
