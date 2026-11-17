// Run with: node tools/tests/run.mjs (or node tools/tests/t182.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.243 (pack R-Foundry 1; book, Chapter 2 Escalation, Momentum; Chapter 4 Health States): Escalation as a level, never spent: 1 at the start of an
// encounter (2 with Momentum, used up), +1 a round, +1 once an encounter on a Critical and on the class hook (an "Escalation hook" setting: Kindled Wrath,
// Thrill of the Kill); at 3 a raise does nothing and isn't used up; back to 1 at the end. Bloodied / Strained announced, no Banes; the hooks read them.
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.CONST = { TOKEN_DISPOSITIONS: {} };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), hasProperty: (o, p) => p.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o) !== undefined } };
let momentum = false; const chat = [];
globalThis.game = { user: { isActiveGM: true, isGM: true }, settings: { get: (s, k) => (k === "momentum" ? momentum : false), set: async (s, k, v) => { if (k === "momentum") momentum = v; } }, combat: { id: "enc1", started: true } };
globalThis.ChatMessage = { create: async m => { chat.push(String(m.content).replace(/<[^>]+>/g, "")); }, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { warn() {}, info() {} } };
const E = await import(ROOTURL + "module/escalation.mjs"), AF = await import(ROOTURL + "module/appliedflags.mjs"), ST = await import(ROOTURL + "module/states.mjs"), FD = await import(ROOTURL + "module/fxdetails.mjs");
const S = a => new Set(a);
const pc = (name, esc, statuses = []) => { const a = { name, type: "character", system: { escalation: esc, guard: 0, apGuard: 0 }, statuses: S(statuses), effects: [], flags: {}, getFlag: (s, k) => a.flags[k], unsetFlag: async (s, k) => { delete a.flags[k]; }, itemTypes: { feature: [], talent: [] },
  update: async u => { for (const [k, v] of Object.entries(u)) { if (k === "system.escalation") a.system.escalation = v; else if (k.startsWith("system.")) a.system[k.slice(7)] = v; else if (k.startsWith("flags.twod12.escUsed.")) { a.flags.escUsed = { ...(a.flags.escUsed ?? {}), [k.split(".").at(-1)]: v }; } else if (k === "flags.twod12.-=escUsed") delete a.flags.escUsed; } }, deleteEmbeddedDocuments: async () => {} }; return a; };
// v0.0.407 (Stage 0 in Foundry): the 1-to-6 ladder; Momentum a number from 0 to 4 (1 + Momentum at the start), no longer used up
console.log("--- the constants:", JSON.stringify({ min: E.ESC_MIN, max: E.ESC_MAX }), "| start level: Momentum 0", E.startLevel(0), "/ 1", E.startLevel(1), "/ 4", E.startLevel(4), "/ 9 (kept to 4)", E.startLevel(9), "| raised:", [E.raised(1), E.raised(5), E.raised(6), E.raised(2, -1)].join(" "));
const nari = pc("Nari", 1), combat = { id: "enc1", started: true, combatants: [{ actor: nari, defeated: false }] };
console.log("--- a Critical raises it once an encounter");
console.log("1 -> ", await E.raiseEscalation(nari, "crit", { combat }), "| again:", await E.raiseEscalation(nari, "crit", { combat }), "(used up) | the hook still works:", await E.raiseEscalation(nari, "hook", { combat, label: "Kindled Wrath" }), "| line:", chat.at(-1));
nari.system.escalation = 6;   // v0.0.407: the top of the ladder is 6
console.log("at 6 the GM's valve does nothing:", await E.raiseEscalation(nari, "gm", { combat }), "| a new encounter clears the once:", (await E.startAtOne({ combatants: [{ actor: nari }] }, { momentum: false }), JSON.stringify({ esc: nari.system.escalation, used: nari.flags.escUsed ?? null })));
const kai = pc("Kai", 6);
console.log("a hook at 6 does nothing and isn't used up:", await E.raiseEscalation(kai, "hook", { combat }), JSON.stringify(kai.flags.escUsed ?? null));
console.log("--- Momentum: the party starts at 2 and it is used up");
momentum = 1; await E.startAtOne({ combatants: [{ actor: nari }, { actor: kai }] }); console.log("Nari", nari.system.escalation, "Kai", kai.system.escalation, "| Momentum now", momentum, "| line:", chat.at(-1));
console.log("--- the end of the encounter: back to 1, the Guards end");
nari.system.guard = 5; nari.system.apGuard = 2; kai.flags.escUsed = { crit: "enc1" };
await E.resetAfterCombat({ combatants: [{ actor: nari }, { actor: kai }] }); console.log("Nari", nari.system.escalation, "Guard", nari.system.guard, "AP Guard", nari.system.apGuard, "| Kai", kai.system.escalation, "used cleared:", kai.flags.escUsed ?? null);
console.log("--- the requirement: the Apex needs 3, nothing is spent");
console.log(JSON.stringify([E.canPayEscalation(kai, 3), E.canPayEscalation(nari, 3).why, E.canPayEscalation({ name: "Goblin", type: "npc", system: {} }, 1).why]));
console.log("--- the hook setting");
const flags = AF.appliedFlags({ settings: [{ type: "eschook", hookWhen: "allyState", hookRange: 5, attrs: new Set(), all: new Set(), any: new Set(), none: new Set(), from: new Set(), tiers: new Set() }, { type: "eschook", hookWhen: "markDown", hookRange: 0, attrs: new Set(), all: new Set(), any: new Set(), none: new Set(), from: new Set(), tiers: new Set() }], description: "", hover: "", expireOn: new Set(), expireAll: false }, null);
console.log("escHooks:", JSON.stringify(flags.escHooks), "| sentences:", FD.settingSentence?.({ type: "eschook", hookWhen: "allyState", hookRange: 5 })?.replace(/<[^>]+>/g, "") ?? "(no settingSentence export)", "|", FD.settingShort({ type: "eschook", hookWhen: "markDown" }));
const feat = { id: "f1", name: "Kindled Wrath", type: "feature", system: { settings: [{ type: "eschook", hookWhen: "allyState", hookRange: 5, minEscalation: 0, attrs: new Set(), all: new Set(), any: new Set(), none: new Set(), from: new Set(), tiers: new Set() }], description: "" }, getFlag: () => undefined, uuid: "Item.f1" };
const pal = pc("Drak", 1); pal.itemTypes = { feature: [feat], talent: [] };
console.log("the hooks a creature has:", JSON.stringify(ST.escHooksOf(pal)));
console.log("state changes:", JSON.stringify([ST.stateChanges({ bloodied: false, strained: false, down: false }, { bloodied: true, strained: false, down: false }), ST.stateChanges({ bloodied: true }, { bloodied: true, strained: true, down: true }), ST.stateChanges({ bloodied: true }, { bloodied: false })]));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- wiring: a Critical on the creature's roll raises it:", src("module/actions.mjs").includes('await raiseEscalation(actor, "crit")'), "| the mark going Down runs the markDown hook:", src("module/mark.mjs").includes('h.when === "markDown"'), "| an ally's state runs the allyState hook:", src("module/states.mjs").includes('h.when !== "allyState"') && src("module/twod12.mjs").includes("registerStateHooks()"), "| no Bloodied / Strained Banes:", !src("module/effects.mjs").includes('"syn:bloodied"'));
console.log("the Escalation block: nothing spent:", !src("module/escblock.mjs").includes("can't be spent"), "| the sheet's tooltip:", src("templates/actor-sheet.hbs").includes("a level that is never spent"), "| the Momentum setting:", src("module/escalation.mjs").includes('game.settings.register(F, "momentum"'), "| a Rest clears it:", src("module/rest.mjs").includes('momentumEvent({ rest: true }, "the party rested")'), "| the GM's valve:", src("module/twod12.mjs").includes("escalation: (delta = 1, actors = null) => escalationAll(delta, actors)"));
