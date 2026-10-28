// Run with: node tools/tests/run.mjs (or node tools/tests/t82.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Foundry's status toggle (what the Token HUD calls) as the one path for Exhausted: click +1, right-click (overlay) -1, and no second change.
const log = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info() {}, error() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0 }, user: { isActiveGM: true, isGM: true, id: "u1" }, keyboard: { downKeys: new Set() } };
let hudRenders = 0; globalThis.canvas = { hud: { token: { render: () => hudRenders++ } } };
const S = await import(ROOTURL + "module/sleep.mjs");
// a stand-in for Foundry's Actor: its own toggle makes or deletes an effect (with no value), which must never run for Exhausted
class FakeActor {
  constructor() { this.type = "character"; this.isOwner = true; this.name = "Kai"; this.flags = { twod12: {} }; this.system = { exhausted: 0, mdt: 8 }; this.effects = []; this.opened = []; }
  async toggleStatusEffect(id, o = {}) { log.push(`FOUNDRY toggled ${id}`); return false; }
  getFlag() {} async setFlag() {} async unsetFlag() {}
  async update(u) { if ("system.exhausted" in u) this.system.exhausted = u["system.exhausted"]; }
  async createEmbeddedDocuments(t, docs) { for (const d of docs) { const e = { ...d, statuses: new Set(d.statuses), parent: this, sheet: { render: () => this.opened.push(e.name) }, update: async u => Object.assign(e, u), delete: async () => { this.effects = this.effects.filter(x => x !== e); }, getFlag: (s, k) => d.flags?.[s]?.[k] }; this.effects.push(e); } }
}
console.log("wrapped:", S.wrapToggleStatus(FakeActor.prototype), "| again is safe:", S.wrapToggleStatus(FakeActor.prototype) === false);
const a = new FakeActor();
const state = () => `Exhausted ${a.system.exhausted}, conditions: ${a.effects.map(e => e.name).join(", ") || "none"}`;
await a.toggleStatusEffect("exhausted", {}); console.log("HUD click:", state());
await a.toggleStatusEffect("exhausted", {}); await a.toggleStatusEffect("exhausted", {}); console.log("two more clicks:", state());
await a.toggleStatusEffect("exhausted", { overlay: true }); console.log("HUD right-click (overlay):", state());
await a.toggleStatusEffect("exhausted", { overlay: true }); await a.toggleStatusEffect("exhausted", { overlay: true }); console.log("two more right-clicks:", state(), "| effects made:", a.effects.length);
await a.toggleStatusEffect("exhausted", { overlay: true }); console.log("right-click at none stays at none:", state());
// shift and ctrl, from the keys held
await a.toggleStatusEffect("exhausted", {}); await a.toggleStatusEffect("exhausted", {});
game.keyboard.downKeys.add("ShiftLeft"); await a.toggleStatusEffect("exhausted", {}); console.log("shift+click opens settings:", a.opened.join(", "), "| value unchanged:", a.system.exhausted);
game.keyboard.downKeys.clear(); game.keyboard.downKeys.add("ControlLeft"); await a.toggleStatusEffect("exhausted", {}); console.log("ctrl+click removes it:", state());
game.keyboard.downKeys.clear();
// the HUD sends active: true or false (apply or remove): for a value that means nothing, a click is +1
await a.toggleStatusEffect("exhausted", { active: true }); console.log("active: true is a click (+1):", state());
await a.toggleStatusEffect("exhausted", { active: false }); console.log("active: false is a click too (+1), it does not remove:", state());
await a.toggleStatusEffect("exhausted", { active: false, overlay: true }); console.log("a right-click with active: false is -1:", state());
await a.toggleStatusEffect("exhausted", { active: false }); await a.toggleStatusEffect("exhausted", { active: false });
game.keyboard.downKeys.add("ControlLeft"); await a.toggleStatusEffect("exhausted", { active: false }); game.keyboard.downKeys.clear(); console.log("ctrl+click removes it, whatever active says:", state());
// other conditions are Foundry's own
await a.toggleStatusEffect("prone", {}); console.log("another condition still goes to Foundry:", log.join(" | "));
const npc = new FakeActor(); npc.type = "npc"; await npc.toggleStatusEffect("exhausted", {}); console.log("an NPC's Exhausted is Foundry's:", log.at(-1));
const other = new FakeActor(); other.isOwner = false; await other.toggleStatusEffect("exhausted", {}); console.log("someone who doesn't own it changes nothing:", other.system.exhausted === 0 && other.effects.length === 0);
console.log("the HUD was redrawn after changes:", hudRenders > 0);
