// Run with: node tools/tests/run.mjs (or node tools/tests/t27.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.canvas = {};
globalThis.foundry = { applications: { api: { DialogV2: {} } }, utils: {} }; globalThis.Hooks = { on() {} };
const warns = [], msgs = []; globalThis.ui = { notifications: { warn: m => warns.push(m) } };
globalThis.ChatMessage = { create: async d => msgs.push(d.content.replace(/<button.*?<\/button>/g, "[BUTTON]").replace(/<[^>]+>/g, "")) };
const flags = { ap: 5, freeMove: 5, moveLeft: 0 };
const c = { id: "c1", name: "Orc", isOwner: true, actor: { system: { walk: 5 } }, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
globalThis.game = { combat: { started: true, combatants: { get: id => (id === "c1" ? c : null) } } };
const m = await import(ROOTURL + "module/move.mjs");
await m.chargeMovement(c, 4);
console.log("after moving 4 of 5 free:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
await m.endMovement("c1");
console.log("after End movement:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
await m.endMovement("c1"); console.log("again:", msgs.splice(0).join(""));
