// Run with: node tools/tests/run.mjs (or node tools/tests/t15.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
const handlers = {};
globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
globalThis.game = { user: { isActiveGM: true } };
const mk = flags => ({ flags, deleted: false, getFlag(s, k) { return this.flags[k]; }, async setFlag(s, k, v) { this.flags[k] = v; }, async delete() { this.deleted = true; } });
// reaction: placed by Zack (origin) during Drak's turn (anchor), round 1, turn index 0
const rounds1 = mk({ duration: { type: "rounds", rounds: 1, expire: "" }, remaining: 1, originCombatantId: "zack", anchorCombatantId: "drak", appliedRound: 1, appliedTurn: 0 });
const eot = mk({ duration: { type: "eot", rounds: 0, expire: "eot" }, originCombatantId: "zack", anchorCombatantId: "drak", appliedRound: 1, appliedTurn: 0 });
globalThis.canvas = { scene: { tokens: [], regions: [rounds1, eot] } };
const combat = { combatants: { get: id => ({ id, actor: {} }), [Symbol.iterator]: function* () {} } };
const { registerEffectHooks } = await import(ROOTURL + "module/effects.mjs");
registerEffectHooks();
const h = handlers.combatTurnChange;
await h(combat, { combatantId: "drak", round: 1, turn: 0 });
console.log("end of Drak's turn (placement turn): rounds1", rounds1.deleted, "eot", eot.deleted);
await h(combat, { combatantId: "zack", round: 1, turn: 1 });
console.log("end of Zack's turn (origin): rounds1", rounds1.deleted, "eot", eot.deleted);
await h(combat, { combatantId: "drak", round: 2, turn: 0 });
console.log("end of Drak's next turn: rounds1", rounds1.deleted);
