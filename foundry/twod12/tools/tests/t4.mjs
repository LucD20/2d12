// Run with: node tools/tests/run.mjs (or node tools/tests/t4.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: { prompt: async () => "M" } } } };
globalThis.ui = { notifications: { warn: console.log, info: console.log } };
const out = [];
globalThis.ChatMessage = { create: async d => out.push(d.content) };
const actor = { isOwner: true, system: { damage: { bodyLethal: 1, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 } }, update: async u => console.log("update", JSON.stringify(u)) };
globalThis.fromUuid = async () => ({ actor });
globalThis.game = { socket: { emit() {}, on() {} }, user: { targets: new Set() } };
const { damageButton } = await import(ROOTURL + "module/damage.mjs");
const msg = { getFlag: () => ({ amounts: { B: 7, M: 0, C: 3, N: 0 }, targets: [{ uuid: "t", name: "Orc" }], name: "Paladin's Attack" }) };
const btn = { closest: () => ({ querySelector: () => ({ value: "nonlethal" }) }) };
await damageButton("applyDamage", btn, msg);
await damageButton("applyHalf", btn, msg);
console.log(out.map(s => s.replace(/<[^>]+>/g, "")));
