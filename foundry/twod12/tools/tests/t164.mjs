// Run with: node tools/tests/run.mjs (or node tools/tests/t164.mjs)
// v0.0.207 (editability sweep; Lucas's rule 2026-10-30): a card is automated with general settings anyone can see and edit on the item, never with
// code that looks for its name. This test scans module/ for the name of every card of the compendium (tools/content.mjs) written as a string in
// code. Allowed: comments, the once-per-world migrations (giveSettingsV...) and the data migrations (static migrateData), which match old copies.
// The Basic Actions, the Conditions and the Fists are the core rules, not cards: their names may appear (button labels, the Actions tab groups).
// It also checks that the cards whose rules were hidden carry them as settings or fields, and that no compendium item has hidden flags.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const { allDocs: docs0 , OLD_CLASS_DOCS } = await import(ROOTURL + "tools/content.mjs");
const docs = [...docs0, ...OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");

const core = new Set([...Object.values(BASIC_ACTIONS).map(b => b.name), "Fists"]);
const cards = [...new Set(docs.filter(d => !d.system?.isCondition && !["weapon", "armor", "species", "class"].includes(d.type)).map(d => d.name))].filter(n => !core.has(n));
console.log("cards checked:", cards.length, "| e.g.", ["Mark Quarry", "Brawler", "Pummel", "Sharpshooter", "Armor of Faith"].every(n => cards.includes(n)));

/** The source with comments blanked and the allowed regions (migrations) blanked; line numbers are kept. */
function scrub(src) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, " "));
  out = out.split("\n").map(l => l.replace(/(^|[^:"'`\\])\/\/.*$/, "$1")).join("\n");
  for (const re of [/export async function giveSettingsV\d+\s*\(/g, /static migrateData\s*\(/g, /export function paladinLeftovers\s*\(/g, /export function archerLeftovers\s*\(/g, /export function b5NamesList\s*\(/g]) {   // v0.0.409: the Paladin migration's list of old cards
    let m;
    while ((m = re.exec(out))) {
      let i = out.indexOf("{", m.index), depth = 0, j = i;
      for (; j < out.length; j++) { if (out[j] === "{") depth++; else if (out[j] === "}" && --depth === 0) break; }
      out = out.slice(0, m.index) + out.slice(m.index, j + 1).replace(/[^\n]/g, " ") + out.slice(j + 1);
    }
  }
  return out;
}
const hits = [];
for (const f of fs.readdirSync(ROOT + "module").filter(f => f.endsWith(".mjs"))) {
  const lines = scrub(fs.readFileSync(ROOT + "module/" + f, "utf8")).split("\n");
  lines.forEach((l, i) => { for (const n of cards) if ([`"${n}"`, `'${n}'`, "`" + n + "`"].some(q => l.includes(q))) hits.push(`${f}:${i + 1} ${n}`); });
}
console.log("card names in module/ code:", hits.length ? hits.join(" ; ") : "none");
const scrubbed = scrub('const a = "Brawler"; // "Pummel"\n/* "Elusive" */\nstatic migrateData(s) { if (s.x === "Sharpshooter") { s.y = 1; } return s; }\nconst b = "Elusive";');
console.log("the scan itself: a name in code is caught, in a comment or a migration it isn't:", ["Brawler", "Pummel", "Sharpshooter", "Elusive"].map(n => `${n} ${scrubbed.includes(`"${n}"`)}`).join(", "));
console.log("no name list of cards (an array of card names) left:", !fs.readdirSync(ROOT + "module").some(f => /\[\s*"(Sharpshooter|Bow Mastery|Marked Quarry|Brawler)"/.test(scrub(fs.readFileSync(ROOT + "module/" + f, "utf8")))));
console.log("archer.mjs and paladin.mjs are gone (the mark is module/mark.mjs):", !fs.existsSync(ROOT + "module/archer.mjs"), !fs.existsSync(ROOT + "module/paladin.mjs"), fs.existsSync(ROOT + "module/mark.mjs"));

console.log("--- the cards whose rules were hidden carry them on the item");
const doc = (n, t) => docs.find(d => d.name === n && (!t || d.type === t));
const types = n => (doc(n).system.settings ?? []).map(x => x.type === "message" ? `message/${x.msgWhen}/${x.msgAction}/${x.msgAp} AP` : x.type).join(", ");
for (const n of ["Mark Quarry", "Sharpshooter", "Bow Mastery", "Brawler"]) console.log((n === "Mark Quarry" ? "Marked Quarry" : n).padEnd(14), types(n));
console.log("Weapon used: Pummel", doc("Pummel", "action").system.weaponUse, "| Leg Sweep", doc("Leg Sweep", "action").system.weaponUse, "| the Fists Basic Action", BASIC_ACTIONS.fists.weaponUse);
// v0.0.334: the Basic Actions in the compendium carry only their basic key (what makes a dragged one work as the built-in Basic Action)
console.log("compendium items with hidden flags:", docs.filter(d => d.flags && Object.keys(d.flags.twod12 ?? {}).filter(k => !(k === "basic" && d.folder === "Basic Actions")).length).map(d => d.name).join(", ") || "none", "| Basic Actions with only their key:", docs.filter(d => d.folder === "Basic Actions").length);
