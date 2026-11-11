// Run with: node tools/tests/run.mjs (or node tools/tests/t32.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } };
const order = [];
let dialogAnswer = { bodyLethal: "3", mindLethal: "4" };
globalThis.foundry = { applications: { api: { DialogV2: { prompt: async o => { order.push("DIALOG:" + o.window.title); return dialogAnswer; }, confirm: async () => true } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
globalThis.ui = { notifications: { warn: m => order.push("WARN " + m), info() {} } };
const cards = [];
globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => { order.push("CARD"); const c = { content: d.content, update: async u => { c.content = u.content; order.push("CARD UPDATED"); } }; cards.push(c); return c; } };
const mk = () => { const a = { name: "Paladin", isOwner: true, system: { rallyMax: 4, rallyUsed: 0, get rallyLeft() { return this.rallyMax - this.rallyUsed; }, rallyHeal: 9, damage: { bodyLethal: 12, mindLethal: 4, bodyNonlethal: 0, mindNonlethal: 0 } }, async update(u) { order.push("HEAL"); for (const [k, v] of Object.entries(u)) { const p = k.split("."); if (p[1] === "rallyUsed") a.system.rallyUsed = v; else a.system.damage[p[2]] = v; } } }; return a; };
const r = await import(ROOTURL + "module/rally.mjs");
let a = mk(); await r.useRally(a, 1, "Rally");
console.log("button flow:", order.splice(0).join(" > "), "|", cards.at(-1).content.replace(/<[^>]+>/g, ""));
a = mk(); await r.useRally(a, 1, "Rally", { announce: false });
console.log("action flow (card already posted):", order.splice(0).join(" > "), "|", cards.at(-1).content.replace(/<[^>]+>/g, ""));
// @Rally up to
globalThis.canvas = { tokens: { controlled: [] } }; globalThis.game = { user: { character: mk() } };
dialogAnswer = 2; await r.handleRally({ n: 2, upto: true }); console.log("up to 2, asked:", order.splice(0).join(" > ").slice(0, 120));
// builder: one window at a time
let opened = 0;
foundry.applications.api.DialogV2.prompt = async () => { opened++; await new Promise(r => setTimeout(r, 30)); return null; };
foundry.applications.api.ApplicationV2 = class { async render() { globalThis.__bbOpened = (globalThis.__bbOpened ?? 0) + 1; await new Promise(r => setTimeout(r, 30)); this.rendered = true; return this; } bringToFront() {} };
const b = await import(ROOTURL + "module/builder.mjs");
globalThis.TWOD12 = undefined;
await Promise.all([b.openBuilder(), b.openBuilder(), b.openBuilder()]).catch(e => console.log("builder err:", e.message.slice(0, 80)));
console.log("windows opened for 3 clicks:", globalThis.__bbOpened ?? 0);   // v0.0.356: the builder is the system's own window (ApplicationV2), still one at a time
