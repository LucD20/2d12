// Run with: node tools/tests/run.mjs (or node tools/tests/t83.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
// The Token HUD switching a condition ON applies the system's Effect (Prone's Hindered, Hindered's Speed), instead of a bare status.
const log = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info() {}, error() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0 }, user: { isActiveGM: true, isGM: true, id: "u1" }, items: [], packs: new Map(), socket: { emit() {} }, keyboard: { downKeys: new Set() } };
globalThis.canvas = {};
const E = await import(ROOT + "module/effects.mjs");
class FakeActor {
  constructor() { this.uuid = "Actor.kai"; this.type = "character"; this.isOwner = true; this.effects = []; this.statuses = new Set(); }
  async toggleStatusEffect(id, o = {}) { log.push(`Foundry's own toggle: ${id}${o.active === undefined ? "" : " active " + o.active}`); const on = o.active ?? !this.statuses.has(id); if (on) this.statuses.add(id); else this.statuses.delete(id); return on; }
}
const items = { prone: { uuid: "Item.prone" }, hindered: { uuid: "Item.hindered" } };
const applied = [];
const deps = { find: async id => items[id] ?? null, apply: async (uuids, targets, origin) => { applied.push(uuids[0]); log.push(`system Effect applied: ${uuids[0]}`); a.statuses.add(uuids[0].split(".")[1]); a.effects.push({ statuses: new Set([uuids[0].split(".")[1]]) }); } };
console.log("wrapped:", E.wrapConditions(FakeActor.prototype, deps), "| again is safe:", E.wrapConditions(FakeActor.prototype, deps) === false);
const a = new FakeActor();
await a.toggleStatusEffect("prone", { active: true }); console.log("HUD: Prone on →", log.splice(0).join(" | "));
await a.toggleStatusEffect("prone", { active: true }); console.log("Prone again (already on) →", log.splice(0).join(" | "));
await a.toggleStatusEffect("prone", { active: false }); console.log("HUD: Prone off →", log.splice(0).join(" | "));
await a.toggleStatusEffect("hindered", {}); console.log("Hindered with no active flag (a toggle) →", log.splice(0).join(" | "));
await a.toggleStatusEffect("hidden", { active: true }); console.log("a status with no Effect (Hidden) →", log.splice(0).join(" | "));
await a.toggleStatusEffect("exhausted", { active: true }); console.log("Exhausted is left to its own rule →", log.splice(0).join(" | "));
await a.toggleStatusEffect("prone", { active: true, twod12Raw: true }); console.log("a call marked raw goes straight to Foundry →", log.splice(0).join(" | "));
console.log("applied from the system:", applied.join(", "));
