// Run with: node tools/tests/run.mjs (or node tools/tests/t79.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Exhausted: the token icon, Shift/Ctrl clicks (no message per change), and Rally Points that don't shrink with it.
const notes = [], opened = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info: m => notes.push(m), error: m => notes.push("error: " + m) } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0 }, user: { isActiveGM: true, isGM: true, id: "u1" } };
const S = await import(ROOTURL + "module/sleep.mjs");
const actor = { name: "Kai", type: "character", isOwner: true, flags: { twod12: {} }, system: { exhausted: 0, mdt: 8 }, effects: [], getFlag() {}, setFlag: async () => {}, unsetFlag: async () => {},
  update: async u => { if ("system.exhausted" in u) actor.system.exhausted = u["system.exhausted"]; },
  createEmbeddedDocuments: async (t, docs) => { for (const d of docs) { const e = { ...d, statuses: new Set(d.statuses), parent: actor, sheet: { render: () => opened.push(e.name) }, update: async u => Object.assign(e, u), delete: async () => { actor.effects = actor.effects.filter(x => x !== e); }, getFlag: (s, k) => d.flags?.[s]?.[k] }; actor.effects.push(e); } } };
await S.setExhausted(actor, 1);
const fx = actor.effects[0];
console.log("shows on the token (showIcon always):", fx.showIcon === 2);
for (let i = 0; i < 4; i++) console.log("click:", await S.exhaustedClick(actor, fx, {}), "→ Exhausted", actor.system.exhausted, `(${fx.name})`);
console.log("shift+click:", await S.exhaustedClick(actor, fx, { shift: true }), "| opened:", opened.join(", "), "| value unchanged:", actor.system.exhausted);
console.log("ctrl+click at 5:", await S.exhaustedClick(actor, fx, { ctrl: true }), "→ Exhausted", actor.system.exhausted, "| conditions left:", actor.effects.length);
console.log("a non-owner can't change it:", await S.exhaustedClick({ ...actor, isOwner: false }, fx, {}), "| messages shown for all of that:", notes.length);
// an older Exhausted effect without the icon setting is fixed on the next change
const old = { name: "Exhausted 1", statuses: new Set(["exhausted"]), showIcon: 1, flags: {}, update: async u => Object.assign(old, u), getFlag: () => undefined };
actor.effects = [old]; await S.setExhausted(actor, 2); console.log("an old effect now shows on the token:", old.showIcon === 2, "|", old.name);
// Rally Points: the real character data, with and without Exhausted
globalThis.foundry.data = { fields: new Proxy({}, { get: () => class { constructor() {} } }) }; globalThis.foundry.abstract = { TypeDataModel: class {} };
const { CharacterData } = await import(ROOTURL + "module/data.mjs");
const mk = (type, system, name = "x") => ({ type, system, name });
const make = ex => { const c = Object.create(CharacterData.prototype); c.level = 4; c.exhausted = ex; c.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }; c.bodyWounds = 0; c.mindWounds = 0; c.rallyUsed = 0;
  c.parent = { items: [mk("species", { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, pickTwo: true, chosen: ["body", "instinct"], walk: 5, speed: 5, bodyMod: 3, mindMod: 4 }, "Human"), mk("class", { chosenA: "body", chosenB: "mind", bodyMult: 4, mindMult: 3, rallyMod: 4, chosenWeapon: "body" }, "Paladin")] };
  c.prepareDerivedData(); return c; };
const a = make(0), b = make(3);
console.log("Exhausted 0: Mind Damage Threshold", a.mdt, "| Health Pool", a.pool, "| Rally heal", a.rallyHeal, "| Rally Points", a.rallyMax);
console.log("Exhausted 3: Mind Damage Threshold", b.mdt, "| Health Pool", b.pool, "| Rally heal", b.rallyHeal, "| Rally Points", b.rallyMax);
console.log("the pool shrinks, Rally stays:", b.pool < a.pool && b.rallyHeal === a.rallyHeal && b.rallyMax === a.rallyMax);
