// The HUD mockup's screenshots: serves the repository, opens index.html in dark and light, and saves hud-<theme>.jpg (the whole page) and
// <state>-<theme>.jpg (each state's pair) here.
//   node foundry/mockups/hud3/shoot.mjs [--dark] [--out dir] [--1x]     (Playwright with its Chromium; actors.json: node data.mjs)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const REPO = path.resolve(fileURLToPath(new URL("../../../", import.meta.url))), HERE = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(import.meta.url)("playwright");
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const p = path.join(REPO, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(REPO) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const args = process.argv.slice(2), outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : HERE;
const themes = args.includes("--dark") ? ["dark"] : ["dark", "light"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1560, height: 1000 }, deviceScaleFactor: args.includes("--1x") ? 1 : 2 });
page.on("pageerror", e => console.log("PAGE ERROR", String(e.message ?? e)));
page.on("response", r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
page.on("console", m => { if (["error", "warning"].includes(m.type())) console.log(m.type(), m.text().slice(0, 400)); });
for (const t of themes) {
  await page.goto(`${BASE}/foundry/mockups/hud3/index.html?theme=${t}`);
  await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
  const shot = async (el, name) => { const f = path.join(outDir, name); await el.screenshot({ path: f, type: "jpeg", quality: 80 }); console.log(f); };
  await shot(await page.$("#page"), `hud-${t}.jpg`);
  for (const el of await page.$$(".mk-state, .mk-extra")) await shot(el, `${await el.getAttribute("id")}-${t}.jpg`);
}
await browser.close(); server.close();
