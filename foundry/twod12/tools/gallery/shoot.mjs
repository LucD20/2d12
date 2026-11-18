// Pack CARD-ONE step 1: the card gallery's screenshots, compared with the saved ones. Serves the repository, opens foundry/gallery/gallery.html in
// every face and surface (dark and light) and book/card-gallery.html (dark and light), screenshots them in pieces of CHUNK cards and compares each
// piece with foundry/gallery/shots/<name>.png pixel by pixel, naming the cards that changed (their boxes: <name>.json).
//   node tools/gallery/shoot.mjs            compare (exit 1 when something changed); the new shots go to foundry/gallery/shots/new/
//   node tools/gallery/shoot.mjs --update   save the new shots as the reference (after a change meant to show)
// Needs Playwright with its Chromium (this environment has both; elsewhere: npm i playwright && npx playwright install chromium).
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const REPO = path.resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const SHOTS = path.join(REPO, "foundry/gallery/shots"), NEW = path.join(SHOTS, "new");
const UPDATE = process.argv.includes("--update"), CHUNK = 16;
let chromium;
try { ({ chromium } = (await import("node:module")).createRequire(import.meta.url)("playwright")); } catch (e) { console.log("Playwright is not installed: no screenshots (npm i playwright)."); process.exit(0); }
execFileSync(process.execPath, [path.join(REPO, "foundry/twod12/tools/gallery/data.mjs")], { stdio: "inherit" });
const data = JSON.parse(fs.readFileSync(path.join(REPO, "foundry/gallery/data.json"), "utf8"));
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const p = path.join(REPO, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(REPO) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
fs.mkdirSync(NEW, { recursive: true });

const shots = [];
const N = data.cards.length, chunks = Array.from({ length: Math.ceil(N / CHUNK) }, (_, i) => [i * CHUNK, Math.min(N, (i + 1) * CHUNK)]);
for (const theme of ["dark", "light"]) {
  for (const [face, wraps] of [["full", ["sheet", "chat", "tooltip", "hud"]], ["solo", ["tooltip", "chat"]], ["roll", ["dialog"]], ["result", ["chat"]], ["statblock", ["statblock"]]]) for (const wrap of wraps)
    for (const [a, b] of chunks) shots.push({ name: `foundry-${face}-${wrap}-${theme}-${String(a).padStart(3, "0")}`, url: `${BASE}/foundry/gallery/gallery.html?theme=${theme}&wrap=${wrap}&face=${face}&from=${a}&to=${b}`, sel: "#cards" });
  shots.push({ name: `book-${theme}`, url: `${BASE}/book/card-gallery.html`, sel: "main", theme, book: true });
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 520, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", e => errors.push(String(e.message ?? e)));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
const done = [];
for (const s of shots) {
  await page.goto(s.url);
  if (s.book) {
    await page.evaluate(t => { document.documentElement.dataset.theme = t; }, s.theme);
    // the book's 145 cards in pieces too: only CHUNK of them shown at a time
    // only the cards Foundry has (the same names), so the book's shots pair with Foundry's
    await page.evaluate(names => document.querySelectorAll(".gal-card").forEach(el => { if (!names.includes(el.dataset.card)) el.remove(); }), data.cards.map(c => c.name));
    const total = await page.locator(".gal-card").count();
    for (let a = 0; a < total; a += CHUNK) {
      await page.evaluate(([a, b]) => document.querySelectorAll(".gal-card").forEach((el, i) => { el.style.display = i >= a && i < b ? "" : "none"; }), [a, a + CHUNK]);
      done.push(await shoot(`${s.name}-${String(a).padStart(3, "0")}`, s.sel));
    }
    continue;
  }
  await page.waitForSelector("body[data-ready]", { timeout: 60000 });
  done.push(await shoot(s.name, s.sel));
}
async function shoot(name, sel) {
  await page.evaluate(() => document.fonts.ready);
  const el = page.locator(sel);
  const file = path.join(NEW, `${name}.jpg`);
  await el.screenshot({ path: file, type: "jpeg", quality: 60 });   // JPEG: a few MB for every shot (the same page gives the same bytes)
  const boxes = await page.evaluate(sel => { const root = document.querySelector(sel).getBoundingClientRect(); return [...document.querySelectorAll(".gal-card")].filter(c => c.offsetParent).map(c => { const r = c.getBoundingClientRect(); return { card: c.dataset.card, y: Math.round(r.top - root.top), h: Math.round(r.height) }; }); }, sel);
  fs.writeFileSync(path.join(NEW, `${name}.json`), JSON.stringify(boxes));
  return name;
}
// compare: the pixels of each card's box, in the browser (no image library needed)
const changed = [];
for (const name of done) {
  const old = path.join(SHOTS, `${name}.jpg`);
  if (!fs.existsSync(old)) { changed.push(`${name}: new (no saved shot)`); continue; }
  const oldBoxes = JSON.parse(fs.readFileSync(path.join(SHOTS, `${name}.json`), "utf8")), newBoxes = JSON.parse(fs.readFileSync(path.join(NEW, `${name}.json`), "utf8"));
  const b64 = f => `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
  const diff = await page.evaluate(async ([a, b, oldBoxes, newBoxes]) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const px = img => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height); };
    const pa = px(ia), pb = px(ib), out = [];
    for (const nb of newBoxes) {
      const ob = oldBoxes.find(o => o.card === nb.card);
      if (!ob) { out.push(`${nb.card} (new)`); continue; }
      if (ob.h !== nb.h) { out.push(`${nb.card} (height ${ob.h} -> ${nb.h})`); continue; }
      let n = 0;
      for (let y = 0; y < nb.h; y++) for (let x = 0; x < Math.min(pa.width, pb.width); x++) {
        const i = ((ob.y + y) * pa.width + x) * 4, j = ((nb.y + y) * pb.width + x) * 4;
        if (Math.abs(pa.data[i] - pb.data[j]) + Math.abs(pa.data[i + 1] - pb.data[j + 1]) + Math.abs(pa.data[i + 2] - pb.data[j + 2]) > 60) n++;
      }
      if (n > 12) out.push(`${nb.card} (${n} px)`);
    }
    for (const ob of oldBoxes) if (!newBoxes.some(n => n.card === ob.card)) out.push(`${ob.card} (gone)`);
    return out;
  }, [b64(old), b64(path.join(NEW, `${name}.jpg`)), oldBoxes, newBoxes]);
  if (diff.length) changed.push(`${name}: ${diff.join(", ")}`);
}
await browser.close(); server.close();
if (errors.length) console.log(`page errors (${errors.length}):\n  ${[...new Set(errors)].slice(0, 12).join("\n  ")}`);
if (UPDATE) {
  for (const f of fs.readdirSync(NEW)) fs.renameSync(path.join(NEW, f), path.join(SHOTS, f));
  fs.rmSync(NEW, { recursive: true, force: true });
  console.log(`saved ${done.length} shots as the reference (foundry/gallery/shots/)`);
} else if (changed.length) {
  console.log(`CHANGED (${changed.length} of ${done.length} shots; the new ones are in foundry/gallery/shots/new/):\n  ${changed.join("\n  ")}`);
  process.exitCode = 1;
} else { fs.rmSync(NEW, { recursive: true, force: true }); console.log(`${done.length} shots: no change`); }
