// Run with: node tools/tests/run.mjs (or node tools/tests/t78.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Recognizing the Exhausted condition however it was made, and the effect window's 2d12 tab (settings JSON and the value).
const notes = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info: m => notes.push(m), error: m => notes.push("error: " + m) } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0 }, user: { isActiveGM: true, isGM: true, id: "u1" } };
const S = await import(ROOTURL + "module/sleep.mjs");
const E = await import(ROOTURL + "module/fxeditor.mjs");
const fx = (over = {}) => ({ name: "Exhausted 2", statuses: new Set(), flags: {}, getFlag(s, k) { return this.flags[s]?.[k]; }, ...over });
console.log("by status:", S.isExhaustedFx(fx({ name: "Tired", statuses: new Set(["exhausted"]) })), "| by flag:", S.isExhaustedFx(fx({ name: "Tired", flags: { twod12: { counter: "exhausted" } } })), "| by name:", S.isExhaustedFx(fx()), S.isExhaustedFx(fx({ name: "Exhausted" })), "| not Exhausted:", S.isExhaustedFx(fx({ name: "Hindered" })), S.isExhaustedFx(fx({ name: "Exhausted foe" })), S.isExhaustedFx(null));
// the effect created by setExhausted carries all three
const actor = { name: "Kai", type: "character", isOwner: true, flags: { twod12: {} }, system: { exhausted: 0, mdt: 8 }, effects: [], getFlag() {}, setFlag: async () => {}, unsetFlag: async () => {},
  update: async u => { if ("system.exhausted" in u) actor.system.exhausted = u["system.exhausted"]; }, createEmbeddedDocuments: async (t, docs) => { for (const d of docs) { const e = { ...d, statuses: new Set(d.statuses), parent: actor, update: async u => Object.assign(e, u), delete: async () => { actor.effects = actor.effects.filter(x => x !== e); }, getFlag: (s, k) => d.flags?.[s]?.[k] }; actor.effects.push(e); } } };
await S.setExhausted(actor, 2);
const made = actor.effects[0];
console.log("created:", made.name, "| status:", [...made.statuses].join(","), "| flag:", made.flags.twod12.counter);
// the tab
const html = E.fxTabHtml({ ...made, parent: actor, flags: { twod12: { duration: { type: "rounds", rounds: 3 }, modifiers: [{ boons: 1 }] } } });
console.log("tab has the Exhausted value:", html.includes('name="twod12Value" value="2"'), "| has the JSON:", html.includes("&quot;rounds&quot;: 3"), "| save button:", html.includes("twod12-fxsave"));
console.log("a plain effect has no value field:", !E.fxTabHtml({ name: "Hindered", statuses: new Set(), flags: {}, parent: actor, getFlag() {} }).includes("twod12Value"));
// saving
const target = { name: "Aim", flags: { twod12: { duration: { type: "eot" }, old: 1 } }, parent: actor, statuses: new Set(), getFlag() {}, update: async u => { target.last = u; } };
await E.saveFx(target, '{ "duration": { "type": "rounds", "rounds": 2 }, "notes": [] }');
console.log("saved keys:", Object.keys(target.last).join(" | "));
for (const bad of ["{ nope", "[1,2]", "5"]) { try { await E.saveFx(target, bad); console.log("accepted?!", bad); } catch (e) { console.log(`rejected ${JSON.stringify(bad)}:`, e.message.slice(0, 50)); } }
await E.saveFx(made, "{}", 4); console.log("Exhausted value set from the tab:", actor.system.exhausted, "| condition:", actor.effects.map(e => e.name).join(", "));
