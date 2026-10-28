// Run with: node tools/tests/run.mjs (or node tools/tests/t14.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
const handlers = {};
globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
globalThis.game = { user: { isActiveGM: true } };
const mkReg = flags => ({ flags, deleted: false, getFlag(s, k) { return this.flags[k]; }, async setFlag(s, k, v) { this.flags[k] = v; }, async delete() { this.deleted = true; } });
const reg = mkReg({ duration: { type: "rounds", rounds: 1 }, remaining: 1, originCombatantId: "drak", appliedRound: 1, appliedTurn: 0 });
globalThis.canvas = { scene: { tokens: [], regions: [reg] } };
const combat = { combatants: { get: id => ({ id, actor: {} }), [Symbol.iterator]: function* () {} } };
const { registerEffectHooks } = await import(ROOTURL + "module/effects.mjs");
registerEffectHooks();
const h = handlers.combatTurnChange;
await h(combat, { combatantId: "drak", round: 1, turn: 0 });
console.log("same turn:", reg.deleted, reg.flags.remaining);
await h(combat, { combatantId: "drak", round: 2, turn: 0 });
console.log("next round end of origin turn: deleted =", reg.deleted);
