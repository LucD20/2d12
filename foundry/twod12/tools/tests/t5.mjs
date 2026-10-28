// Run with: node tools/tests/run.mjs (or node tools/tests/t5.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
const handlers = {};
globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
globalThis.game = { user: { isActiveGM: true }, combat: null };
globalThis.canvas = { scene: { tokens: [] } };
const flags = { effectUuid: "E", duration: { type: "rounds", rounds: 2 }, remaining: 2, originCombatantId: "drak", appliedRound: 1, appliedTurn: 0 };
const eot = { effectUuid: "E2", duration: { type: "eot", rounds: 1 }, remaining: 1, originCombatantId: "drak", appliedRound: 1, appliedTurn: 0 };
const mkEff = (name, f) => ({ name, deleted: false, flags: f, getFlag(s, k) { return this.flags[k]; }, async setFlag(s, k, v) { this.flags[k] = v; }, async delete() { this.deleted = true; } });
const e1 = mkEff("light", flags), e2 = mkEff("hindered", eot);
const zack = { effects: [e1, e2] }, drak = { effects: [] };
const combat = { combatants: { get: id => ({ drak: { id: "drak", actor: drak }, zack: { id: "zack", actor: zack } })[id], [Symbol.iterator]: function* () { yield { id: "drak", actor: drak }; yield { id: "zack", actor: zack }; } } };
const { registerEffectHooks } = await import(ROOT + "module/effects.mjs");
registerEffectHooks();
const h = handlers.combatTurnChange;
await h(combat, { combatantId: "drak", round: 1, turn: 0 });   // applied this turn: skipped
console.log("after r1 drak", e1.flags.remaining, e1.deleted);
await h(combat, { combatantId: "zack", round: 1, turn: 1 });   // zack's turn ends: EoT expires
console.log("eot deleted", e2.deleted);
await h(combat, { combatantId: "drak", round: 2, turn: 0 });
console.log("after r2 drak", e1.flags.remaining, e1.deleted);
await h(combat, { combatantId: "drak", round: 3, turn: 0 });
console.log("after r3 drak deleted", e1.deleted);
