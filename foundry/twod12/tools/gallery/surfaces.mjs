// v0.0.438 (pack CARD-ONE step 5): measures, for each compendium card, the computed style of every element inside the card in each surface of the gallery, and lists the
// Run: node tools/gallery/surfaces.mjs (Playwright and Chromium, about a minute). It prints each (theme/surface, property, element) that differs from
// the sheet, with how many card elements: 0 means a card looks the same wherever it is drawn (the CSS the gallery loads: the system's own).
// properties that differ from the sheet's (the surface "leaking" into the card).
import { fileURLToPath } from "node:url";
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const require = createRequire(import.meta.url); const { chromium } = require("playwright");
const REPO = fileURLToPath(new URL("../../../../", import.meta.url));
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
const srv = http.createServer((req, res) => { const p = path.join(REPO, decodeURIComponent(new URL(req.url, "http://x").pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res); }).listen(0);
const port = srv.address().port;
const PROPS = ["font-family", "font-size", "font-weight", "font-style", "line-height", "color", "background-color", "text-align", "letter-spacing", "text-transform", "padding-top", "padding-left", "margin-top", "border-top-width", "border-top-color", "border-radius", "white-space", "display", "width"];
const browser = await chromium.launch();
const out = {};
for (const theme of ["dark", "light"]) for (const wrap of ["sheet", "chat", "tooltip", "hud"]) {
  const page = await browser.newPage({ viewport: { width: 600, height: 900 } });
  await page.goto(`http://127.0.0.1:${port}/foundry/gallery/gallery.html?theme=${theme}&wrap=${wrap}&face=full&from=0&to=62`);
  await page.waitForSelector("body[data-ready]", { timeout: 120000 });
  out[`${theme}/${wrap}`] = await page.evaluate(PROPS => {
    const r = {};
    for (const box of document.querySelectorAll(".gal-card")) {
      const card = box.querySelector(".acard"); if (!card) continue;
      const els = [card, ...card.querySelectorAll("*")];
      els.forEach((el, k) => { const cs = getComputedStyle(el); const key = `${box.dataset.card}#${k}<${el.tagName.toLowerCase()}.${[...el.classList].join(".")}>`; r[key] = Object.fromEntries(PROPS.map(p => [p, cs.getPropertyValue(p)])); });
    }
    return r;
  }, PROPS);
  await page.close();
}
await browser.close(); srv.close();
const summary = {};
for (const theme of ["dark", "light"]) for (const wrap of ["chat", "tooltip", "hud"]) {
  const a = out[`${theme}/sheet`], b = out[`${theme}/${wrap}`];
  for (const k of Object.keys(b)) { if (!a[k]) continue; for (const p of Object.keys(b[k])) if (a[k][p] !== b[k][p] && p !== "width") { const cls = k.replace(/^[^#]*#\d+/, ""); const id = `${theme}/${wrap} ${p} ${cls}`; (summary[id] ??= { n: 0, sheet: a[k][p], here: b[k][p] }).n++; } }
}
const rows = Object.entries(summary).sort((x, y) => y[1].n - x[1].n);
console.log(`${rows.length} differing (surface, property, element) kinds; elements measured per surface: ${Object.keys(out["dark/sheet"]).length}`);
for (const [k, v] of rows.slice(0, 70)) console.log(String(v.n).padStart(5), k, "| sheet:", v.sheet, "| here:", v.here);
process.exitCode = 0;
