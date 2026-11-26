// Run with: node tools/tests/run.mjs (or node tools/tests/t270.mjs)
// v0.0.427 (Lucas, 2026-11-18): (1) Shake Off's Tier 2 "this turn" is the current turn, even an ally's: the half is dealt at the end of the turn in
// progress, whoever's it is (conditions.mjs bleedAtTurnEnd onlyHalf); (2) "Distance: Weapon (Normal range)" on Volley's and Covering Fire's
// Burst (cardgen.mjs areaOf: placed within the weapon's normal range); (3) the book audit: its links scroll by script in any viewer, and the
// clear fixes (archive/book-drafts/book-audit.md).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const action = n => C.docs.find(x => x.name === n && x.type === "action");

console.log("--- (1) Shake Off: the current turn");
console.log("Chapter 8:", book("rules-src/08-conditions.md").includes("The [[Shake Off]] Action can end it")   /* v0.0.520: the cleanup audit left the Tiers to the card */,
  "| the card:", book("cards/basic-actions.json").includes("at the end of the current turn (whoever's turn it is)"));
const K = src("module/conditions.mjs");
console.log("at the end of any turn, a halved Lingering deals its half and ends:", K.includes("bleedAtTurnEnd(c.actor, { onlyHalf: true })") && K.includes('(!onlyHalf || e.getFlag?.("twod12", "shakeHalf"))'));

console.log("--- (2) Weapon (Normal range)");
const arch = book("cards/stage0/archer.json");
console.log("the cards write it:", (arch.match(/"distance": "Weapon \(Normal range\)"/g) ?? []).length === 2,
  "| Volley:", action("Volley").system.areaCfg?.withinRange, "| Covering Fire:", action("Covering Fire").system.areaCfg?.withinRange);

console.log("--- (3) the book");
const core = book("core-rules.html");
console.log("a link to a place in the same document scrolls by script (any viewer):", core.includes("document.addEventListener('click',e=>{") && core.includes("t.scrollIntoView({block:'start'})"));
console.log("the weapon property's own headings:", book("gear.html").includes('id="light-property"') && book("gear.html").includes('id="reload-property"'), "| the glossary links them:", core.includes('href="gear.html#light-property"'));
console.log("a Basic Action link goes to its card:", core.includes('href="#card-shake-off"'));
console.log("the audit's record:", fs.existsSync(ROOT + "../../archive/book-drafts/book-audit.md"));
