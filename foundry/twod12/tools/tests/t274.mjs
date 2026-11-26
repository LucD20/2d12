// Run with: node tools/tests/run.mjs (or node tools/tests/t274.mjs)
// v0.0.431 (Lucas, 2026-11-18: his answers to the book audit's 40 questions, "All rest default seems good"): the book's new rules and what Foundry
// follows (archive/book-drafts/book-audit.md).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };

console.log("--- the book");
const ch2 = book("rules-src/02-turns.md"), ch3 = book("rules-src/03-movement.md"), ch8 = book("rules-src/08-conditions.md"), ch14 = book("rules-src/14-bestiary.md");
console.log("a movement you can't make: 0 squares, or disrupted with \"must\":", ch2.includes("you move 0 squares and the rest of the Action happens. If the Action says you **must** move"));
console.log("once a round = once per turn-cycle:", ch2.includes('A card that says **"once a round"** or **"once each round"** means the same: once per turn-cycle.'));
console.log("[HT] once per turn-cycle, every pattern:", ch3.includes("An [HT] area affects each creature at most once per turn-cycle") && !ch3.includes("The Movement pattern is exempt"));
console.log("Forced Movement: no Reactions from movement:", ch3.includes("- It doesn't trigger Reactions from movement. (A Reaction that triggers on the Forced Movement itself"));
console.log("halve your Speed last:", ch3.includes("Apply every other change first, then halve it"));
console.log("Prone allows Break Free; Immobilized mid-move ends the movement:", ch8.includes("[[Crawl|Crawl]], [[Stand|Stand]] and [[Break Free]]") && ch8.includes("If you become Immobilized while you are moving, your movement ends."));
console.log("ignoring a condition:", ch8.includes("**Ignoring a condition.** A creature that ignores a condition keeps it"));
console.log("a Save Action switches to Nonlethal with 1 Boon on each Save:", book("rules-src/04-health.md").includes("every creature that makes its Save gains **1 Boon** on it"));
// the Bestiary's rebuild (2026-11-25): Elite Escalation is gone (Chapter 14 rewritten; the old text: archive/book-drafts/14-bestiary-to-2026-11-25.md)
console.log("the book is silent on NPC Escalation (Lucas, 2026-11-25: \"They might have\"; Elite Escalation gone):", !/escalation/i.test(ch14) && !/NPCs? ha(ve|s) no Escalation/.test(ch2) && !ch2.includes("Elite Escalation"));
console.log("Break Free is shown in Chapter 6:", book("rules-src/06-basic-actions.md").includes("@@CARD:Break Free@@"));
const pal = book("cards/stage0/paladin.json");
console.log("Courage is an Aura 3; Brace's squares are fixed; Judge's 1 AP is clear:", pal.includes("An [[Aura]] 3 around you (1 round)") && pal.includes("The squares adjacent to you now are Difficult Terrain") && pal.includes("If another creature was Judged by you, it no longer is."));

console.log("v0.0.432: a rider happens whatever damage is dealt:", book("rules-src/01-roll.md").includes("**A rider happens whatever damage is dealt:**") && !book("rules-src/01-roll.md").includes("only if the Action deals that damage"));

console.log("--- Foundry");
const { htMayHit } = await import(ROOTURL + "module/fxrules.mjs");
console.log("[HT] Movement after an Entering hit this turn-cycle:", htMayHit("movement", [2, 1], { round: 2, turn: 2, own: 1 }), "| the next turn-cycle:", htMayHit("movement", [2, 1], { round: 3, turn: 1, own: 1 }));
const { roundKey, usedThisCycle } = await import(ROOTURL + "module/judge.mjs");
const judge = { uuid: "J" }, cb = (round, turn) => ({ started: true, id: "c", round, turn, turns: [{ actor: { uuid: "X" } }, { actor: { uuid: "J" } }, { actor: { uuid: "Y" } }] });
const at = roundKey(cb(1, 2));   // used on turn 2 of round 1 (after the judge's own turn)
console.log("Judge used after its own turn:", at, "| still that round:", usedThisCycle(cb(1, 2), judge, at), "| round 2 before its turn (same turn-cycle):", usedThisCycle(cb(2, 0), judge, at), "| its next turn:", usedThisCycle(cb(2, 1), judge, at), "| an old key (round only):", usedThisCycle(cb(1, 2), judge, "c:1"));
const sm = await import(ROOTURL + "module/speedmods.mjs");
const eff = mods => ({ getFlag: () => mods, flags: {} });
console.log("Speed 6, Hindered and -2: (6 - 2) halved =", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "floor(speed/2)" }, { mode: "add", formula: "-2" }])] }, 6),
  "| Exhausted 2 and Hindered on 6:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "floor(speed/2)" }])] }, 6, { minus: 2 }));
const A = src("module/actions.mjs");
console.log("Armor of Faith: not Judge's 0R:", A.includes('if (it.reaction && it.markKind !== "judge")'));
console.log("a Reload Shot: its own 1d6!, Empowered not spent:", A.includes("const empOn = hadEmp || !!f.reloadShot ||") && A.includes("if (empUsed && !hadEmp && !f.reloadShot)"));
console.log("Opening Shot: once per turn-cycle:", A.includes('!usedThisCycle(game.combat, actor, actor.getFlag("twod12", "openingRound"))'));
console.log("Trade Places: different Sizes refused:", src("module/inline.mjs").includes("they can't swap squares (Chapter 3, Swapping Places)"));
