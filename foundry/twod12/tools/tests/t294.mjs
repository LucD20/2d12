// Run with: node tools/tests/run.mjs (or node tools/tests/t294.mjs)
// v0.0.477 to v0.0.479 (the core rework, batches 1 and 2; book/core-rework.md): a Favored / Doomed source counts as 5 (calc.mjs bbResolve), the
// Critical (critical.mjs: a card's Critical row, the type chosen for a row with no subtype; since v0.0.521 no Basic-attack rule), Bloodied's Steadiness below 0 (move.mjs steadyValue),
// the Bloodied / Strained lines (statelines.mjs stateLinesFor), the cards' data (Trip, Shove, the Ogre's placeholder line, Break Free, Lean).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const CA = await import(ROOTURL + "module/calc.mjs"), CR = await import(ROOTURL + "module/critical.mjs"), MV = await import(ROOTURL + "module/move.mjs");
const CC = await import(ROOTURL + "module/statelines.mjs"), { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");

console.log("--- A3: a Favored / Doomed source counts as 5 Boons / 5 Banes (bbResolve)");
for (const [b, n, f, d] of [[0, 0, false, true], [0, 2, false, true], [1, 0, false, true], [2, 0, false, true], [0, 4, false, false], [0, 5, false, false], [3, 0, true, false], [0, 0, true, true], [5, 0, false, true]])
  console.log(`${b} Boons, ${n} Banes${f ? ", Favored" : ""}${d ? ", Doomed" : ""}:`, JSON.stringify(CA.bbResolve(b, n, f, d)));
console.log("the odds follow it: Doomed + 2 Banes = Doomed:", JSON.stringify(CA.tierProbs(3, 13, 0, 2, "doomed")) === JSON.stringify(CA.tierProbs(3, 13, 0, 0, "doomed")),
  "| Doomed + 1 Boon = a normal roll at -4:", JSON.stringify(CA.tierProbs(3, 13, 1, 0, "doomed")) === JSON.stringify(CA.tierProbs(3, 13, 0, 4, "")));

console.log("--- the Critical (critical.mjs)");
// v0.0.521 (the cleanup audit, B1-003): no rule gives a Basic attack the 1d10!: each card writes its Critical row (an open one takes a type chosen)
console.log("Basic attacks' rows:", ["basicWeaponAttack", "fists"].map(k => BASIC_ACTIONS[k].versions[0].critical).join(" | "), "| open:", CR.critRowOpen("[V] 1d10!"), CR.critRowOpen("[V] 1d10! Bl."));
const comps = [{ pool: "B", sub: "Pi", kind: "W", total: 5 }, { pool: "B", sub: "Pi", kind: "A", total: 2 }, { pool: "M", sub: "Ho", kind: "D", total: 3 }, { pool: "B", sub: "Pi", kind: "E", total: 4 }, { pool: "B", sub: "Fi", kind: "D", total: 6, crit: true }];
console.log("the types it can choose:", CR.critKinds(comps).map(k => CR.kindText(k)).join(" | "));
console.log("the open row's options:", CR.critOptions("[V] 1d10!", "[V] 1d10!", comps).map(o => o.label).join(" | "), "| a typed row:", CR.critOptions("[V] 1d10! Bl.", "[V] 1d10! Bl.", comps).map(o => o.label).join(" | "), "| no damage dealt:", CR.critOptions("[V] 1d10!", "[V] 1d10!", []).map(o => o.label).join(" | "));
console.log("the open die takes the kind:", JSON.stringify(CR.critDieFor(CR.critRowDice("[V] 1d10!")[0], { pool: "M", sub: "Ho" })), "| a typed one keeps its own:", JSON.stringify(CR.critDieFor(CR.critRowDice("[R] 1d10! Ps.")[0], { pool: "B", sub: "Pi" })));
console.log("a Critical row's dice:", JSON.stringify(CR.critRowDice("[V] 1d6! Bl.")), "| none:", JSON.stringify(CR.critRowDice("@Condition[prone]")));
console.log("Trip's Critical:", BASIC_ACTIONS.trip.versions.map(v => v.critical).join(" | "), "|| Shove's:", BASIC_ACTIONS.shove.versions.map(v => v.critical).join(" | "));
console.log("wired: asked before the damage roll, a Tier with no damage too:", src("module/actions.mjs").includes("const ans = await C.askCritical({ actor, item, comps, rowText });") && src("module/actions.mjs").includes("const ans = await C.askCritical({ actor, item, rowText });") && src("module/actions.mjs").includes("C.critComponent(C.critDieFor(d, ans.kind), rolls)"));

console.log("--- Bloodied: Steadiness below 0 (move.mjs steadyValue), Speed −2 (data.mjs)");
console.log("Pushed 2 vs Steadiness 1:", MV.steadyValue(2, 1), "| vs -1:", MV.steadyValue(2, -1), "| a Reposition 2 vs -1:", MV.steadyValue(2, -1, "reposition"), "| Pushed 1 vs 2:", MV.steadyValue(1, 2));
console.log("Strained (v0.0.535: was Bloodied): Speed −2 with Exhausted's, before halving:", src("module/data.mjs").includes("minus: (this.exhausted > 0 ? this.exhausted : 0) + (this.strained ? 2 : 0)") && src("module/data.mjs").includes("minus: this.strained ? 2 : 0"),
  "| Steadiness −1 below 0:", src("module/defense.mjs").includes('if (actor?.system?.bloodied) parts.push({ name: "Bloodied", bonus: -1 });'));
console.log("v0.0.535: Strained no longer touches the Reaction AP:", src("module/combat.mjs").includes("export const rapAtRegain = c => rapMaxOf(c);"), "| a Bloodied creature's space is Difficult Terrain:", src("module/roundrules.mjs").includes('!down && unwilling && !bloodied ? "block" : "dt"'));

console.log("--- the Bloodied / Strained lines (statelines.mjs stateLinesFor)");
const L = { bloodied: "after-B", strained: "after-S", bloodiedBefore: "before-B", strainedBefore: "" };
for (const [pre, now] of [[{}, {}], [{}, { b: true }], [{ b: true }, { b: true }], [{ s: true }, { s: true }], [{ b: true }, {}]])
  console.log(`before ${JSON.stringify(pre)} now ${JSON.stringify(now)}:`, JSON.stringify(CC.stateLinesFor(L, pre, now)));
// the Bestiary's rebuild (2026-11-25): the old Ogre Chieftain's Overhead Smash left the packs; OLD_CLASS_DOCS keeps it (the line's machinery)
const smash = C.actors.find(a => a.name === "Ogre Chieftain")?.items?.find(i => i.name === "Overhead Smash") ?? C.OLD_CLASS_DOCS.find(i => i.name === "Overhead Smash");
console.log("the Ogre's Overhead Smash carries its placeholder line:", JSON.stringify(smash?.system?.stateLines ?? null));
console.log("--- batch 1's cards: Break Free, Lean, Steel Yourself");
console.log("Break Free:", BASIC_ACTIONS.breakFree.vs, BASIC_ACTIONS.breakFree.versions[0].orTiers, "| Lean:", BASIC_ACTIONS.leaning.name, "| Steel Yourself:", BASIC_ACTIONS.rally.versions.map(v => v.ap).join("/"));
