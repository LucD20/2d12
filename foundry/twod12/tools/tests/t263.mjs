// Run with: node tools/tests/run.mjs (or node tools/tests/t263.mjs)
// v0.0.419 (playtest 5, Version 2: the rules; book/playtest-5.md section 3). (1) Chapter 2, Stacking: an effect tied to the creature that gave it
// is a different effect for each (two Judges); Judge's reduction is the Paladin's choice ("you can reduce", asked). (2) Chapter 3: the creatures
// inside an area never give Cover against it. (3) The card Structure: a Special about the roll goes above the Attack line (Darting Blade, Hit and
// Run). (4) The Bestiary: a Tier 2 or 3 rider written in Tiers 2 and 3 ("Pushed N"); an NPC's melee Distance "Reach (X)".
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");

console.log("--- (1) Stacking and Judge");
// v0.0.422 (Lucas): the general per-giver rule became Judge's own line ("Two Paladins can Judge the same creature"); Chapter 2 says "A card can say otherwise".
console.log("Chapter 2:", book("rules-src/02-turns.md").includes("**A card can say otherwise.** [[Judge]] does: multiple Paladins can Judge the same creature."), "| the card:", book("cards/stage0/paladin.json").includes("Once each round, when it damages an ally within 5 squares of you, you can reduce that damage by your Power Modifier."));
const J = src("module/judge.mjs");
console.log("Foundry asks the judge's player (declined: the round's use is kept):", J.includes("if (!(await askJudge(j, src, actor, by))) continue;") && J.indexOf("askJudge(j, src, actor, by)") < J.indexOf('setFlag(F, "judgeRound", key)'),
  "| each Paladin's own mark (two Judges):", J.includes("isJudgedBy(j, src)"));

console.log("--- (2) Cover against an area");
console.log("Chapter 3:", book("rules-src/03-movement.md").includes("### Cover against an area"), "| every area's creatures give none:", src("module/template.mjs").includes("  placed.noCover = [origin?.id, ...tokensIn(placed.cells).map(t => t.id)].filter(Boolean);"),
  "| the Save card's Cover too:", src("module/inline.mjs").includes("saveRowMods(doc, point, areaIds(targets, cfg.actorUuid))"));

console.log("--- (3) A Special about the roll above the Attack line");
const L = await import(new URL("../../../../book/cards/load.mjs", import.meta.url).href);
const rb = L.readBody([{ label: "Setup", text: "s" }, { label: "Special", text: "before" }, { label: "Attack", text: "Weapon vs. Armor Defense" }, { label: "Tier 1", text: "a" }, { label: "Tier 2", text: "b" }, { label: "Tier 3", text: "c" }, { label: "Special", text: "after" }]);
console.log("the loader: before the roll a card line", JSON.stringify(rb.lines), "| after it the notes", JSON.stringify(rb.notes));
const C = await import(ROOTURL + "tools/content.mjs");
for (const n of ["Darting Blade", "Hit and Run"]) { const d = C.docs.find(x => x.name === n); console.log(n, "| lines above the roll:", JSON.stringify(d.system.lines ?? []), "| Special at the end:", JSON.stringify(d.system.special ?? "")); }

console.log("--- (4) The Bestiary");
for (const a of C.actors) for (const x of a.items ?? []) if (["Hamstringing Axe", "Club", "Overhead Smash", "Dirty Trick"].includes(x.name) && x.type === "action") { const v = x.system.versions[0]; console.log(`${a.name}: ${x.name} | Tier 2 ${v.x2} | Tier 3 ${v.x3} | Effect "${v.effects}" | after ${v.after ?? "-"}`); }
console.log("the book's bullets:", (book("rules-src/14-bestiary.md").match(/, and Pushed \d\./g) ?? []).length, "Pushed |", (book("rules-src/14-bestiary.md").match(/Reach \(1\)/g) ?? []).length, "Reach (1)");
const CF = src("module/config.mjs");
console.log("Foundry's Distance: an NPC's melee \"Reach (X)\":", CF.includes("return npcOf && !String(r.melee).includes(\"/\") ? `Reach (${r.melee})` : sp(r.melee);") && CF.includes("return a?.type === \"npc\" && n > 0 ? `Reach (${n})` : \"Reach\";"));
