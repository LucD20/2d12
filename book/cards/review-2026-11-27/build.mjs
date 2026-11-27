// The Actions review (2026-11-27): checks that every row's "current" text is in its card (word for word) or is "(none)",
// then writes review.json (the page's data) and the same data embedded in index.html (the page's fallback when the fetch fails).
// Run: node book/cards/review-2026-11-27/build.mjs   (from the repo's root). A row whose text isn't found is listed; nothing is left out.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "../../..");
const data = JSON.parse(fs.readFileSync(path.join(HERE, "items.json"), "utf8"));

const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  let v = null;
  try {
    const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
    if (file.endsWith(".json")) v = { json: JSON.parse(raw) };
    // A rules chapter, read as the book shows it: bold marks and links taken off ([[Link|shown]] reads "shown").
    else v = { text: raw.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").replace(/\*\*/g, "") };
  } catch (e) { v = null; }
  cache.set(file, v);
  return v;
}
/** Every printed string of a card: its text fields, Tier lines, notes; not its Foundry block or the writer's notes. */
function strings(o, out = []) {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach(x => strings(x, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { if (k === "foundry" || k === "_note" || k === "flavor") continue; strings(v, out); }
  return out;
}
function found(file, card, text) {
  const f = load(file);
  if (!f) return `file not found: ${file}`;
  if (f.text != null) return f.text.includes(text) ? null : `not in ${file}`;
  const cards = f.json.cards ?? [];
  const c = cards.find(x => x.name === card);
  if (!c) return `no card named "${card}" in ${file}`;
  return strings(c).some(s => s.includes(text)) ? null : `not in the card "${card}" (${file})`;
}

const bad = [], ids = new Set();
for (const it of data.items) {
  if (ids.has(it.id)) bad.push(`${it.id}: the id is used twice`);
  ids.add(it.id);
  const labels = new Set();
  for (const r of it.rows) {
    if (labels.has(r.label)) bad.push(`${it.id}: the row label "${r.label}" is used twice`);
    labels.add(r.label);
    if (r.current === "(none)") continue;
    const why = found(r.file ?? it.file, r.card ?? it.card, r.current);
    if (why) bad.push(`${it.id} / ${r.label}: "${r.current}" ${why}`);
  }
}
const out = {
  built: new Date().toISOString().slice(0, 10),
  items: data.items.map(({ file, card, ...it }) => ({ ...it, rows: it.rows.map(({ file, card, ...r }) => r) })),
  looked: data.looked
};
const json = JSON.stringify(out, null, 1);
fs.writeFileSync(path.join(HERE, "review.json"), json);

// The fallback copy inside the page, between its two markers.
const page = path.join(HERE, "index.html"), A = "<!--EMBED-->", B = "<!--/EMBED-->";
const html = fs.readFileSync(page, "utf8"), i = html.indexOf(A), j = html.indexOf(B);
if (i < 0 || j < i) bad.push("index.html: the EMBED markers are missing");
else fs.writeFileSync(page, html.slice(0, i + A.length) + `<script type="application/json" id="embedded">${json.replace(/</g, "\\u003c")}</script>` + html.slice(j));

const by = {}; for (const it of out.items) by[`${it.group}, ${it.when}`] = (by[`${it.group}, ${it.when}`] ?? 0) + 1;
console.log(`review.json: ${out.items.length} Actions, ${out.items.reduce((s, it) => s + it.rows.length, 0)} lines`, JSON.stringify(by));
console.log(`looked at, no change proposed: ${out.looked.length} entries`);
if (bad.length) { console.log("NOT FOUND:\n" + bad.join("\n")); process.exitCode = 1; } else console.log("every current text is in its card or chapter, word for word");
