// Run with: node tools/tests/run.mjs (or node tools/tests/t9.mjs)
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
const f = { comps: [{ pool: "B", sub: "S", nl: undefined, total: 7 }, { pool: "M", sub: "H", nl: true, total: 3 }, { pool: "C", sub: "", nl: false, total: 4 }], targets: [{ uuid: "t", name: "Orc" }], name: "Test", fx: [] };
const msg = { getFlag: () => f };
const btn = { closest: () => ({ querySelector: () => ({ value: "lethal" }) }) };
await damageButton("applyDamage", btn, msg);
await damageButton("applyHalf", btn, msg);
console.log(out.map(s => s.replace(/<[^>]+>/g, "")));
const { parseParts } = await import(ROOTURL + "module/inline.mjs");
console.log(JSON.stringify(parseParts("Item.abc123,1d6[mind]")));
// template math
globalThis.canvas = { grid: { size: 100, getOffset: p => ({ i: Math.floor(p.y / 100), j: Math.floor(p.x / 100) }), getTopLeftPoint: o => ({ x: o.j * 100, y: o.i * 100 }) } };
const { emanationCells, burstCells } = await import(ROOTURL + "module/template.mjs");
const show = cells => { const is = cells.map(c => c.i), js = cells.map(c => c.j); const rows = []; for (let i = Math.min(...is); i <= Math.max(...is); i++) { let r = ""; for (let j = Math.min(...js); j <= Math.max(...js); j++) r += cells.some(c => c.i === i && c.j === j) ? "#" : "."; rows.push(r); } return rows.join("\n"); };
console.log("emanation 2:\n" + show(emanationCells([{ i: 10, j: 10 }], 2)), "\n(count", emanationCells([{ i: 10, j: 10 }], 2).length + ")");
console.log("emanation 1:\n" + show(emanationCells([{ i: 10, j: 10 }], 1)));
console.log("burst 2 at corner:\n" + show(burstCells({ x: 1000, y: 1000 }, 2)), "\n(count", burstCells({ x: 1000, y: 1000 }, 2).length + ")");
console.log("burst 2 at center:\n" + show(burstCells({ x: 1050, y: 1050 }, 2)), "\n(count", burstCells({ x: 1050, y: 1050 }, 2).length + ")");
