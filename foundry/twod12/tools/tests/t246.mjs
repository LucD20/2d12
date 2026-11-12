// Run with: node tools/tests/run.mjs (or node tools/tests/t246.mjs)
// v0.0.365 (SIM-1, 2026-11-12): module/roundrules.mjs, the rules of a round as pure functions shared with the automated playtest environment
// (book/ruler/sim). The functions against the book's examples (Chapter 2: Action Points, Unspent AP, Reactions, Escalation, Momentum; Chapter 3:
// Flanking, Cover, Weapon Range), that the system's own modules call them (one copy of each rule), and that the environment imports this file.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const R = await import(ROOTURL + "module/roundrules.mjs");
const j = x => JSON.stringify(x);

console.log("--- Action Points");
console.log("a turn's AP: 4, Slowed 1:", R.turnAP(4), R.turnAP(4, { slowed: 1 }), "| Quickened 1:", R.turnAP(4, { quickened: 1 }), "| a Minion:", R.turnAP(3), "| never under 0:", R.turnAP(4, { slowed: 6 }));
console.log("the Reaction AP before the first turn / after:", R.reactionAPAt(false), R.reactionAPAt(true));
console.log("paying 1R with the Reaction AP:", j(R.payReaction(1, 0, 1)), "| 2R with it and a kept AP:", j(R.payReaction(2, 1, 1)), "| 1R with a kept AP only:", j(R.payReaction(1, 2, 0)));
console.log("can pay: 1R with nothing:", R.canPayReaction(1, 0, 0), "| 1R with the Reaction AP:", R.canPayReaction(1, 0, 1), "| 2R with the Reaction AP alone:", R.canPayReaction(2, 0, 1), "| 0R:", R.canPayReaction(0, 0, 0));
console.log("Unspent AP (Drak, Stage 1, 1 AP left):", j(R.unusedApGuard(true, 1, 1)), "| Stage 2, 2 AP:", j(R.unusedApGuard(true, 2, 2)), "| Stage 3:", j(R.unusedApGuard(true, 1, 3)), "| the first turn:", j(R.unusedApGuard(false, 3, 1)));
console.log("Strikes a turn:", R.STRIKES_PER_TURN, "| At-will Banes on the 1st, 2nd, 3rd use:", [0, 1, 2].map(R.atWillBanes).join(" "));

console.log("--- Escalation");
console.log("start:", R.escalationStart(false), "| with Momentum:", R.escalationStart(true), "| Nari: round 2:", R.escalationRaised(1), "| a Critical:", R.escalationRaised(2), "| round 3 stays:", R.escalationRaised(3));
console.log("Momentum after CV 75 a PC (easy) / 100 / 76:", R.givesMomentum(75), R.givesMomentum(100), R.givesMomentum(76));
console.log("an Elite at 0 / 1 / 2 / 3: first-attack Boons", [0, 1, 2, 3].map(R.eliteFirstAttackBoons).join(" "), "| Round Specials", [0, 1, 2, 3].map(R.eliteRoundSpecials).join(" "), "| Encounter Special back", [0, 1, 2, 3].map(R.eliteEncounterBack).join(" "));

console.log("--- Position");
console.log("Flanking: two flankers:", j(R.flankBoons(1, 0)), "| three:", j(R.flankBoons(2, 0)), "| four and one cancel:", j(R.flankBoons(3, 1)), "| one and one cancel:", j(R.flankBoons(1, 1)), "| never under 0:", j(R.flankBoons(1, 3)));
console.log("Cover on an Action: none / Low / Medium / High / Total:", [0, 1, 2, 3, 4].map(l => { const c = R.coverMods(l); return c.noLoE ? "no Line of Effect" : c.doomed ? "Doomed" : `${c.banes} ${c.bb}`; }).join(" | "));
console.log("Cover on a Save: Low / Medium / High:", [1, 2, 3].map(l => { const c = R.coverMods(l, { save: true }); return c.favored ? "Favored" : `${c.boons} ${c.bb} Boons`; }).join(" | "), "| High gives no Field Banes:", R.coverMods(3).banes === 0);
console.log("Prone: melee", j(R.proneMods(false)), "| ranged", j(R.proneMods(true)), "| shooting while Engaged:", R.ENGAGED_RANGED_BANES, "| into a melee:", R.INTO_MELEE_FIELD_BANES);
console.log("Range 10 / 20 / 40 at 10, 11, 20, 21, 40, 41:", [10, 11, 20, 21, 40, 41].map(d => R.rangeBanes([10, 20, 40], d)).join(" "), "| Long Draw:", [11, 21].map(d => R.rangeBanes([10, 20, 40], d, { longDraw: true })).join(" "), "| melee 1 at 1, 2:", R.rangeBanes([1], 1), R.rangeBanes([1], 2));

console.log("--- one copy of each rule");
const C = await import(ROOTURL + "module/config.mjs");
console.log("the numbers are config.mjs's:", R.AP_PER_TURN === C.TWOD12.apPerTurn && R.REACTION_AP === C.TWOD12.reactionAp && R.ESC_MAX === C.TWOD12.escalation.max);
const sm = src("module/sheetmodel.mjs"), cb = src("module/combat.mjs"), es = src("module/escalation.mjs"), fl = src("module/flanking.mjs"), rr = src("module/roundrules.mjs");
console.log("sheetmodel.mjs takes payReaction from it:", sm.includes('import { payReaction } from "./roundrules.mjs"') && !sm.includes("export const payReaction ="));
console.log("combat.mjs takes unusedApGuard and the turn's AP from it:", cb.includes('import { unusedApGuard, turnAP } from "./roundrules.mjs"') && !cb.includes("export const unusedApGuard =") && cb.includes("turnAP(baseAP("));
console.log("escalation.mjs takes the start and the raise from it:", es.includes("export const startLevel = escalationStart") && es.includes("export const raised = escalationRaised"));
console.log("flanking.mjs takes the count from it:", fl.includes("flankBoons(others.length, cancelledBy.length)"));
console.log("pure (it imports only config, calc and guard):", [...rr.matchAll(/^import .* from "(.+)";/gm)].map(m => m[1]).join(" "), "| no Foundry global:", !/\b(game|canvas|ui|Hooks|foundry)\./.test(rr.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")));
const SM = await import(ROOTURL + "module/sheetmodel.mjs");
console.log("the old names still work: sheetmodel.payReaction:", j(SM.payReaction(2, 1, 1)));
const core = fs.readFileSync(ROOT + "../../book/ruler/sim/core.mjs", "utf8"), eng = fs.readFileSync(ROOT + "../../book/ruler/sim/engine.mjs", "utf8"), map = fs.readFileSync(ROOT + "../../book/ruler/map.mjs", "utf8");
console.log("the environment imports it: core.mjs", core.includes("module/roundrules.mjs"), "| the engine uses it:", /RR\.(unusedApGuard|reactionAPAt|canPayReaction|escalationRaised|eliteRoundSpecials)/.test(eng), "| the map uses it:", /RR\.(flankBoons|coverMods|rangeBanes)/.test(map));
