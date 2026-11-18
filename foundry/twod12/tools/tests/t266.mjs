// Run with: node tools/tests/run.mjs (or node tools/tests/t266.mjs)
// v0.0.422 (Lucas, 2026-11-18, the audit's two questions). (1) "Unless otherwise stated, a creature can't have the same condition twice" and
// "put on Judge 'Two Paladins can Judge the same creature'": no general rule for effects tied to their giver; Chapters 2 and 8 say "unless a card
// says otherwise", Judge's card says it, and every copy of Judge (the compendium's, the Paladin PCs') carries the line. (2) The hover card over a
// placed area: "Keep it".
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");
const LINE = "Multiple Paladins can Judge the same creature: it is Judged by each of them.";   // v0.0.423 (Lucas): "Better to say Multiple Paladins"

console.log("--- (1) Stacking: a card says when it stacks");
const ch2 = book("rules-src/02-turns.md"), ch8 = book("rules-src/08-conditions.md");
console.log("Chapter 2:", ch2.includes("Unless a card says otherwise, the same effect never stacks with itself"),
  "| Judge is the example:", ch2.includes("**A card can say otherwise.** [[Judge]] does"), "| the old general rule gone:", !ch2.includes("An effect tied to the creature that gave it"));
console.log("Chapter 8:", ch8.includes("Unless a card says otherwise, a creature can't have the same condition twice"));
console.log("the card:", book("cards/stage0/paladin.json").includes(LINE), "| card-structure.md's example:", book("cards/card-structure.md").includes(LINE),
  "| the book's structure.json:", book("cards/structure.json").includes(LINE));
const C = await import(ROOTURL + "tools/content.mjs");
const all = [...(C.docs ?? []), ...[...(C.actors ?? []), ...(C.pcs ?? [])].flatMap(a => a.items ?? [])];
const judges = all.filter(d => d?.name === "Judge" && d.type === "action");
console.log("copies of Judge in the compendium (the Action and the PCs'):", judges.length > 1,
  "| every one has the line:", judges.length > 0 && judges.every(d => JSON.stringify(d.system).includes(LINE)));
console.log("Foundry keeps each Paladin's own Judged (unchanged):", src("module/judge.mjs").includes("isJudgedBy(j, src)"));

console.log("--- (2) the area's hover card kept");
console.log("zonetip.mjs registered:", src("module/twod12.mjs").includes('import { registerZoneTip } from "./zonetip.mjs"') && fs.existsSync(ROOT + "module/zonetip.mjs"));
