// Builds the manual Action Builder: node book/cards/manual/build.mjs  → manual-builder.html (the file published as the Artifact; don't edit it).
// No pricing at all (Lucas, 2026-11-14): a card written by hand beside the class audit. The data: the audit (../builder/audit.json) and the PC cards as book/cards writes them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url)), CARDS = path.join(HERE, "..");
const rd = f => fs.readFileSync(f, "utf8");
const cards = [];
for (const f of ["paladin.json", "archer.json", "basic-actions.json"]) {
  let d = JSON.parse(rd(path.join(CARDS, f))); d = d.cards ?? d;
  for (const c of d) if (c && typeof c === "object" && c.name) {
    const { foundry, ruler, book, _note, notes, rules, ...keep } = c;   // only what the book prints
    if (keep.versions) keep.versions = keep.versions.map(({ foundry: _f, ruler: _r, ...v }) => v);
    if (keep.inline) keep.inline = keep.inline.map(({ automation, automationNote, moment, momentRange, foundry: _f, ...x }) => x);
    cards.push({ file: f, ...keep });
  }
}
const audit = JSON.parse(rd(path.join(CARDS, "builder", "audit.json")));
const data = { generated: new Date().toISOString().slice(0, 10), audit, cards };
const page = rd(path.join(HERE, "template.html")).replace("/*@@DATA@@*/", () => `const DATA = ${JSON.stringify(data).replace(/<\//g, "<\\/")};`).replace("/*@@BUDGET@@*/", () => rd(path.join(HERE, "budget.js")).replace(/^if \(typeof module.*$/m, ""));
fs.writeFileSync(path.join(HERE, "manual-builder.html"), page);
console.log(`manual-builder.html: ${Math.round(page.length / 1024)} KB (${cards.length} cards, ${audit.entries.length} audit entries)`);
