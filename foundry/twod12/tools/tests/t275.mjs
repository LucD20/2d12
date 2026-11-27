// Run with: node tools/tests/run.mjs (or node tools/tests/t275.mjs)
// v0.0.433 (the Bestiary audit; Lucas, 2026-11-18: "we do a bestiary audit"): what Foundry didn't do as the Bestiary says (archive/book-drafts/bestiary-audit.md).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };

console.log("--- a Minions' squad takes one turn of its side");
const { zipper } = await import(ROOTURL + "module/combat.mjs");
const mk = (name, init, disp, squad) => ({ id: name, name, initiative: init, token: { disposition: disp }, flags: { twod12: { init: { squad: squad ?? "" } } } });
console.log("three Minions at 15, PCs at 14 and 12, an Orc at 10:", zipper([mk("M1", 15, -1), mk("M2", 15, -1, "M1"), mk("M3", 15, -1, "M1"), mk("P1", 14, 1), mk("P2", 12, 1), mk("Orc", 10, -1)]).map(c => c.name).join(" "));
console.log("a member whose roll differs goes on its own:", zipper([mk("M1", 15, -1), mk("M2", 9, -1, "M1"), mk("P1", 14, 1)]).map(c => c.name).join(" "));

console.log("--- EoT and rounds in a shared slot");
const { durationStep } = await import(ROOTURL + "module/effects.mjs");
const eot = { duration: { type: "eot" }, slotInit: 15 }, rnd = { duration: { type: "rounds", rounds: 1 }, remaining: 1, anchorSlot: 15, appliedRound: 1, appliedTurn: 0 };
const end = (id, last) => ({ id, initiative: 15, shared: true, lastOfSlot: last });
console.log("EoT on M3: M1's turn ends", durationStep(eot, end("M1", false), { round: 1, turn: 0 }, { combatantId: "M3" }), "| M3's own", durationStep(eot, end("M3", true), { round: 1, turn: 2 }, { combatantId: "M3" }));
console.log("1 round from M1's turn: M3 ends round 1", durationStep(rnd, end("M3", true), { round: 1, turn: 2 }, {}), "| M1 ends round 2", durationStep(rnd, end("M1", false), { round: 2, turn: 0 }, {}), "| M3 ends round 2", durationStep(rnd, end("M3", true), { round: 2, turn: 2 }, {}));
console.log("a lone slot still ends at its own end:", durationStep({ duration: { type: "eot" }, slotInit: 12 }, { id: "P", initiative: 12, shared: false, lastOfSlot: true }, { round: 1, turn: 3 }, { combatantId: "X" }));

console.log("--- the rest");
const T = src("module/twod12.mjs");
console.log("an NPC Down on more Nonlethal falls Unconscious; equal, the GM picks:", T.includes('else if (s.nonlethal > s.lethal) want = "unconscious";') && T.includes('options: [{ k: "dead", l: "It dies" }, { k: "unconscious", l: "It falls Unconscious" }]'));
const C = await import(ROOTURL + "tools/content.mjs");
const avenge = [...C.docs, ...C.actors.flatMap(a => a.items ?? []), ...C.OLD_CLASS_DOCS].find(x => x.name === "Avenge Kin");   // the Bestiary's rebuild (2026-11-25): the old Orc Warrior's cards left the packs; OLD_CLASS_DOCS keeps them for this machinery
console.log("Avenge Kin offered by itself:", avenge?.system?.moment, avenge?.system?.momentRange);
// the Bestiary's rebuild (2026-11-25; book: "No NPC has Escalation"): the Elite rank no longer turns Escalation on
console.log("the Elite rank no longer turns Escalation on:", src("module/actor-sheets.mjs").includes('esc = was === "elite" && now !== "elite" ? { "system.useEscalation": false } : {}'));
console.log("the Builder at Stage 0: the old notes hidden, the best turn labelled:", src("templates/actor-sheet-pc.hbs").includes('{{#unless s0}}<ul class="nb-rules">') && src("module/pcsheet.mjs").includes("(damage only: riders and shares not counted)"));

console.log("--- v0.0.434: Lucas's answers to questions 4, 7, 10 and 12");
// the Bestiary's rebuild (2026-11-25): the new Chapter 14 keeps these rules in fresh text; Pressing (Elite Escalation) is only in the archived chapter
const B = fs.readFileSync(ROOT + "../../book/rules-src/14-bestiary.md", "utf8"), B0 = fs.readFileSync(ROOT + "../../archive/book-drafts/14-bestiary-to-2026-11-25.md", "utf8");
console.log("(10) an NPC has a level; no set list of Actions:", B.includes("**Its level says which PCs it is built for.**")   /* v0.0.520: the cleanup audit's wording */ && B.includes("**An NPC has no set list of Actions:**"));
console.log("(4) a Reaction written with its Frequency:", B.includes("**written like any Action, with its Frequency** (At-will, Turn, Round or Encounter") && B.includes("**Blood for Blood** (Reaction; Round, 1R;"));
console.log("(7) every other Basic Action is theirs:", B.includes("**Every Basic Action is an NPC's too**"), "| Foundry leaves out only:", (await import(ROOTURL + "module/basic.mjs")).NPC_NO_BASIC.join(", "));
console.log("(12) Pressing on [Strike] (the archived chapter):", B0.includes("**Pressing:** 1 Boon on its first [Strike] Action each turn-cycle."));   // the cleanup audit (2026-11-26): the Foundry side (the default ladder) is removed

console.log("--- v0.0.435: question 7 (Fists) and the defaults");
const U = await import(ROOTURL + "module/usage.mjs");
console.log("(13) Relentless: a Round Special twice", U.usesAllowed("round", new Set(["round"]), true), "| a Round Reaction once", U.usesAllowed("round", new Set(["round"]), true, true), "| Second Wind on an Encounter Reaction", U.usesAllowed("encounter", new Set(["encounter"]), true, true));
const NB = await import(ROOTURL + "module/npcbudget.mjs");
console.log("(19) an Elite's Extreme Modifier counts as High:", NB.cvSteps("elite", {}, { weapon: "extreme" }) === NB.cvSteps("elite", {}, { weapon: "high" }), "| a Standard's doesn't:", NB.cvSteps("standard", {}, { weapon: "extreme" }) > NB.cvSteps("standard", {}, { weapon: "high" }));
const EX = await import(ROOTURL + "module/explode.mjs");
console.log("(11) v0.0.523: the Empowered die explodes for every creature (a Minor enemy's too):", !("minorNpc" in EX), src("module/explode.mjs").includes("const formula = EMPOWERED_FORMULA;"), EX.EMPOWERED_FORMULA, "| no rank-based explode left in the system:", !("npcDieExplodes" in (await import(ROOTURL + "module/roundrules.mjs"))), !src("module/actions.mjs").includes("minorNpc"), !src("module/inline.mjs").includes("minorNpc"));
console.log("(3) no Guard from unspent AP for an NPC (v0.0.535: for no creature):", src("module/combat.mjs").includes("  const guard = 0;"));
console.log("(8) the Ogre is Large:", C.actors.find(a => a.name === "Ogre Chieftain")?.system?.size, "| (29) Rally the Tribe's traits:", JSON.stringify(C.actors.flatMap(a => a.items ?? []).find(x => x.name === "Rally the Tribe")?.system?.traits ?? []));

console.log("--- v0.0.436: half a step or less counts as none (Lucas: \"round within half a step\")");
console.log("a Standard at -0.5:", NB.cvWithSteps("standard", 100, -0.5), "| +0.5:", NB.cvWithSteps("standard", 100, 0.5), "| -1:", NB.cvWithSteps("standard", 100, -1), "| an Elite at +1.5:", NB.cvWithSteps("elite", 200, 1.5));
