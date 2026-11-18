// Run with: node tools/tests/run.mjs (or node tools/tests/t264.mjs)
// v0.0.420 (Lucas, 2026-11-18, the tooltip review: foundry/tooltips-inventory.md; "tooltips are too much... remove all", B and H too): the only
// hover texts left are the HP bars (A) and the reasons a button is off (C, until the mockups show them on screen). This test lists every hover
// text the system still writes: a new one changes its output (add it only if Lucas asks for it). A screen-reader name is aria-label, not here.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const files = [...fs.readdirSync(ROOT + "module").filter(f => f.endsWith(".mjs")).map(f => "module/" + f),
  ...["templates/actor-sheet-pc.hbs", "templates/item-sheet.hbs", "templates/parts/preds.hbs", "templates/parts/settings.hbs"]];
// v0.0.421 (the audit): also a title or a tooltip set by code (a ".title =" on an element, setAttribute)
const pat = /(?:data-tooltip(?:-html)?=|\btitle=|dataset\.tooltip(?:Html)?\s*=|tooltip\??\.activate|querySelector\([^)]*\)\.title\s*=|setAttribute\("(?:title|data-tooltip)")/g;
const found = [];
for (const f of files.sort()) {
  const lines = fs.readFileSync(ROOT + f, "utf8").split("\n");
  lines.forEach((l, i) => { for (const m of l.matchAll(pat)) found.push(`${f}: ${l.slice(m.index, m.index + 70).replace(/\s+/g, " ")}`); });
}
console.log(`hover texts left: ${found.length}`);
for (const x of found) console.log("  " + x);
