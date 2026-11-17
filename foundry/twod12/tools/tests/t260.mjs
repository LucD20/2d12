// Run with: node tools/tests/run.mjs (or node tools/tests/t260.mjs)
// Pack CARD-ONE (Lucas, 2026-11-17: one card for every place it shows): the card model (module/cardmodel.mjs) and the faces drawn from it.
//   1. coverage: every labeled line of an Action's model is in each face that shows the whole card (the sheet's card, the solo card of the
//      item sheet / hover / chat Send / Card button / class window): a part can't be forgotten by one face;
//   2. parity with the book: the model's lines against the book's own model (book/cards/structure.json, written by book/build_rules.py from
//      book/cards.py structure()): the same labels in the same order, or the difference is printed (the expected output keeps today's
//      differences; one that appears or goes shows as CHANGED);
//   3. the gallery's tools are in place (tools/gallery: data.mjs, shoot.mjs; foundry/gallery: the page and the saved shots).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const enrichHTML = async t => String(t ?? "").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@(\w+)\[([^\]]*)\](?:\{([^}]*)\})?/g, (m, k, body, lab) => lab ?? body.split("|")[0]);
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, combat: null, user: { getFlag: () => undefined } };
globalThis.fromUuid = async () => null;
const C = await import(ROOTURL + "tools/content.mjs");
globalThis.foundry.applications.ux = { TextEditor: { implementation: { enrichHTML } } };   // content.mjs set its own stub
const CM = await import(ROOTURL + "module/cardmodel.mjs");
const AC = await import(ROOTURL + "module/actioncard.mjs");
const asItem = d => ({ id: d.name, name: d.name, type: d.type, getFlag: (s, k) => d.flags?.twod12?.[k], system: { ...d.system, traits: new Set(d.system.traits ?? []), versions: d.system.versions ?? [] } });
const acts = C.docs.filter(d => d.type === "action").map(asItem).sort((a, b) => a.name.localeCompare(b.name));

console.log("--- 1. every face that shows the whole card has every line of the model");
const missing = [];
for (const it of acts) {
  const m = CM.cardModel(it), labels = CM.modelLabels(m).filter(l => !l.startsWith("# "));
  const faces = { sheet: await AC.buildActionCard(it, { use: false }), solo: await AC.buildSoloCard(it) };
  for (const [f, html] of Object.entries(faces)) for (const l of labels) if (!html.includes(`<b>${l}</b>`) && !(l.startsWith("Tier") && /<b>Tiers? /.test(html))) missing.push(`${it.name} (${f}): ${l}`);
  for (const v of m.versions.length > 1 ? m.versions : []) for (const [f, html] of Object.entries(faces)) if (!html.includes(`<span>${v.heading.replace(/&/g, "&amp;")}</span>`)) missing.push(`${it.name} (${f}): the block "${v.heading}"`);
}
console.log(`Actions: ${acts.length} | lines missing from a face: ${missing.length ? missing.join("; ") : "none"}`);
console.log("e.g. Smite:", CM.modelLabels(CM.cardModel(acts.find(a => a.name === "Smite"))).join(" | "));
console.log("e.g. Lantern of Faith (Modes):", CM.modelLabels(CM.cardModel(acts.find(a => a.name === "Lantern of Faith"))).join(" | "));

console.log("--- 2. the same lines as the book's card (book/cards/structure.json)");
const book = JSON.parse(fs.readFileSync(ROOT + "../../book/cards/structure.json", "utf8"));
const bookLabels = s => {
  const out = (s.body ?? []).map(l => l.label).filter(Boolean);
  if ((s.blocks ?? []).length) for (const b of s.blocks) out.push(`# ${String(b.heading).replace(/<[^>]+>/g, "").replace(/\*\*/g, "")}`, ...(b.body ?? []).map(l => l.label).filter(Boolean));
  out.push(...(s.after ?? []).map(l => l.label).filter(Boolean));
  return out;
};
// the Tiers grouped or not is a way of writing the same lines: both sides are read as their Tier lines
const norm = list => list.map(l => (/^Tiers? 1(–3| to 3)?$/.test(l) && l !== "Tier 1" ? "Tiers 1–3" : l));
let same = 0;
const diffs = [], notInBook = [];
for (const it of acts) {
  const s = book[it.name];
  if (!s) { notInBook.push(it.name); continue; }
  const a = norm(CM.modelLabels(CM.cardModel(it))), b = norm(bookLabels(s));
  if (a.join("|") === b.join("|")) same++;
  else diffs.push(`${it.name}:\n    Foundry ${a.join(" | ")}\n    book    ${b.join(" | ")}`);
}
console.log(`the same lines: ${same} of ${acts.length - notInBook.length} | not in the book: ${notInBook.join(", ") || "none"}`);
for (const d of diffs) console.log(d);

console.log("--- 3. the gallery");
const has = p => fs.existsSync(ROOT + p);
console.log("tools:", has("tools/gallery/data.mjs") && has("tools/gallery/shoot.mjs"), "| the page:", has("../gallery/gallery.html") && has("../gallery/gallery.mjs"),
  "| saved shots:", has("../gallery/shots") && fs.readdirSync(ROOT + "../gallery/shots").filter(f => f.endsWith(".jpg")).length > 0,
  "| the book writes its model and gallery:", fs.readFileSync(ROOT + "../../book/build_rules.py", "utf8").includes("'structure.json'") && has("../../book/card-gallery.html"));
