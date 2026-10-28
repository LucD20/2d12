// Run with: node tools/tests/run.mjs (or node tools/tests/t26.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } };
const handlers = {}; globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
const warns = [], msgs = [];
globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => { msgs.push(d.content.replace(/<[^>]+>/g, "").replace(/&rarr;/g, "→")); return { update: async u => { msgs[msgs.length - 1] = u.content.replace(/<[^>]+>/g, ""); } }; } };
let prompt = null;
globalThis.foundry = { applications: { api: { DialogV2: { prompt: async () => prompt, confirm: async () => true } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
const r = await import(ROOTURL + "module/rally.mjs");
console.log("default plan:", JSON.stringify(r.defaultHealing({ bodyLethal: 5, mindLethal: 0, bodyNonlethal: 6, mindNonlethal: 2 }, 9)));
console.log("plan from form (caps):", JSON.stringify(r.planHealing({ bodyLethal: 9, mindLethal: 3, bodyNonlethal: 1 }, { bodyLethal: 5, mindLethal: 2, bodyNonlethal: 6, mindNonlethal: 0 }, 6)));
const mkActor = (used, dmg) => { const a = { name: "Paladin", isOwner: true, system: { rallyMax: 4, rallyUsed: used, get rallyLeft() { return this.rallyMax - this.rallyUsed; }, rallyHeal: 9, damage: dmg }, async update(u) { for (const [k, v] of Object.entries(u)) { const p = k.split("."); if (p[1] === "rallyUsed") a.system.rallyUsed = v; else a.system.damage[p[2]] = v; } } }; return a; };
let a = mkActor(0, { bodyLethal: 5, mindLethal: 0, bodyNonlethal: 0, mindNonlethal: 0 });
console.log("use 1 (damage 5 < 9):", await r.useRally(a, 1, "Rally"), JSON.stringify(a.system.damage), "used", a.system.rallyUsed, "|", msgs.splice(0).join(""));
a = mkActor(3, { bodyLethal: 12, mindLethal: 4, bodyNonlethal: 0, mindNonlethal: 0 });
console.log("needs 2, has 1:", await r.useRally(a, 2), "|", warns.splice(0).join(""));
a = mkActor(0, { bodyLethal: 12, mindLethal: 4, bodyNonlethal: 0, mindNonlethal: 0 });
prompt = { bodyLethal: "3", mindLethal: "4" };
console.log("choose 3 body + 4 mind of 9:", await r.useRally(a, 1), JSON.stringify(a.system.damage), "|", msgs.splice(0).join(""));
prompt = null; a = mkActor(0, { bodyLethal: 12, mindLethal: 4, bodyNonlethal: 0, mindNonlethal: 0 });
await r.useRally(a, 1); console.log("dialog closed -> default (lethal first):", JSON.stringify(a.system.damage));
// inline parse + generator
const inl = await import(ROOTURL + "module/inline.mjs"); inl.registerInline();
const enr = CONFIG.TextEditor.enrichers[0];
const run = async t => { const out = []; for (const m of t.matchAll(enr.pattern)) { const el = await enr.enricher(m); out.push(el?.html); } return out; };
console.log(await run("@Rally[2] and @Rally[1|label:Use Rally] and @Move[pushed|distance:4]"));
console.log(JSON.stringify(inl.parseInline("Rally", "3")));
const gen = await import(ROOTURL + "module/gen.mjs");
console.log(gen.convertEffects("An ally uses 1 Rally Point"), "|", gen.convertEffects("You use 2 Rally Points. Pushed 3"), "|", gen.convertEffects("Bright light 2Emanation 1/round"));
const b = await import(ROOTURL + "module/builder.mjs"); console.log(b.buildCommand({ type: "rally", rn: "2" }), b.buildCommand({ type: "move", mkind: "pushed", mdistance: "3" }));
// movement hooks
const mv = await import(ROOTURL + "module/move.mjs");
globalThis.canvas = { grid: { distance: 5, size: 100, getOffset: ({ x, y }) => ({ i: Math.floor(y / 100), j: Math.floor(x / 100) }), getCenterPoint: ({ i, j }) => ({ x: j * 100 + 50, y: i * 100 + 50 }), measurePath: ([a, b]) => ({ cost: Math.hypot(b.x - a.x, b.y - a.y) / 100 * 5 }) }, scene: { grid: { distance: 5 } } };
const flags = { ap: 5, freeMove: 0, moveLeft: 0 };
const c = { id: "c1", name: "Orc", tokenId: "t1", actor: { system: { walk: 5 } }, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
globalThis.game = { user: { id: "u1", isActiveGM: true }, socket: { on() {}, emit() {} }, combat: { started: true, combatant: c } };
mv.registerMovement();
const doc = { id: "t1", x: 0, y: 0 };
handlers.preMoveToken(doc, { destination: { x: 300, y: 0 }, pending: { cost: 15 } }, {}); await new Promise(r => setTimeout(r, 20));
console.log("preMoveToken 15 units on a 5-unit grid = 3 sq:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
handlers.preMoveToken(doc, { destination: { x: 200, y: 0 }, origin: { x: 0, y: 0 }, pending: {} }, {}); await new Promise(r => setTimeout(r, 20));
console.log("pending without cost -> measured fallback 2 sq:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
handlers.preMoveToken(doc, { destination: { x: 100, y: 0 }, pending: { cost: 5 } }, { twod12Forced: true }); await new Promise(r => setTimeout(r, 20));
console.log("forced move ignored:", JSON.stringify(flags));
// fallback route: only preUpdateToken fires
flags.moveLeft = 0; flags.ap = 5; const doc2 = { id: "t1", x: 0, y: 0 };
handlers.preUpdateToken(doc2, { x: 400 }, {}, "u1"); await new Promise(r => setTimeout(r, 450));
console.log("preUpdateToken fallback 4 sq:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
// both fire for the same move -> charged once
flags.moveLeft = 0; flags.ap = 5;
handlers.preUpdateToken(doc2, { x: 300 }, {}, "u1"); handlers.preMoveToken(doc2, { destination: { x: 300, y: 0 }, pending: { cost: 15 } }, {}); await new Promise(r => setTimeout(r, 450));
console.log("both routes, charged once:", JSON.stringify(flags), "| messages:", msgs.splice(0).length);
