// Run with: node tools/tests/run.mjs (or node tools/tests/t92.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Cut Through's Setup: an Evade that may cross creatures (never end in one) and ignores Difficult Terrain (Darkness, doubled costs).
const GS = 100, handlers = {}, warns = [], chat = [], settings = { lightDimBelow: 0.7, lightDarkBelow: 0.4, moveOutsideCombat: false };
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, Canvas: { polygonBackends: { sight: { testCollision: () => false }, move: { testCollision: () => false } } } };
globalThis.Hooks = { on: (n, f) => (handlers[n] = f), once() {} };
globalThis.ui = { notifications: { info() {}, warn: m => warns.push(m), error() {} } };
globalThis.ChatMessage = { create: async m => { chat.push(m.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); return {}; }, getSpeaker: () => ({}) };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.PIXI = { Graphics: class { constructor() { return new Proxy(this, { get: (t, k) => (k === "destroy" ? () => {} : (k in t ? t[k] : () => new Proxy({}, { get: () => () => ({}) }))) }); } } };
const tokens = [];
globalThis.canvas = { ready: true, scene: {}, grid: { size: GS, distance: 1, isSquare: true,
  getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }),
  measurePath: ([a, b]) => { const di = Math.abs(a.y - b.y) / GS, dj = Math.abs(a.x - b.x) / GS; const d = Math.max(di, dj) + Math.floor(Math.min(di, dj) / 2); return { distance: d, cost: d }; } },
  tokens: { placeables: tokens, controlled: [] }, interface: { addChild() {} }, environment: { darknessLevel: 0 }, effects: { darknessSources: [], lightSources: [] }, regions: { placeables: [] } };
const flags = {};
const apply = d => { for (const [p, v] of Object.entries(d)) { const k = p.replace("flags.twod12.", ""); if (k.startsWith("-=")) delete flags[k.slice(2)]; else flags[k] = v; } };
const c = { id: "c1", name: "Kai", tokenId: "t1", actorId: "a1", isOwner: true, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, unsetFlag: async (s, k) => { delete flags[k]; }, update: async d => apply(d) };
const combat = { started: true, combatant: c, combatants: Object.assign([c], { get: id => (id === "c1" ? c : undefined), find: f => [c].find(f) }) };
globalThis.game = { settings: { get: (s, k) => settings[k] }, time: { worldTime: 0 }, user: { isGM: true, isActiveGM: true, id: "u1" }, combat, socket: { on() {}, emit() {} }, i18n: { localize: s => s } };
const kai = { id: "a1", name: "Kai", isOwner: true, statuses: new Set(), system: { moveSpeed: 5, speed: 5, walk: 5, senses: {} } };
const mk = (id, name, col, row, disposition, actor) => { const doc = { id, x: col * GS, y: row * GS, width: 1, height: 1, disposition, hidden: false }; const t = { id, name, document: doc, actor, center: { x: col * GS + 50, y: row * GS + 50 } }; doc.actor = actor; tokens.push(t); return t; };
const me = mk("t1", "Kai", 0, 0, 1, kai); kai.token = { object: me }; kai.getActiveTokens = () => [me];
const orc = mk("t2", "Orc", 1, 0, -1, { name: "Orc", system: {}, statuses: new Set() });
const M = await import(ROOTURL + "module/move.mjs");
M.registerMovement();
const move = (to, pending = { distance: 2, cost: 2 }) => ({ origin: { x: 0, y: 0 }, destination: { x: to * GS, y: 0 }, pending: { waypoints: [], ...pending } });
const go = async (label, to, { ignore = false, evade = 2, ap = 5, pending, dark = false } = {}) => {
  for (const k of Object.keys(flags)) delete flags[k];
  Object.assign(flags, { ap, evadeMove: evade, freeMove: 0, moveLeft: 0 }); if (ignore) flags.ignoreTerrain = true;
  canvas.environment.darknessLevel = dark ? 1 : 0; warns.length = 0; chat.length = 0;
  const r = handlers.preMoveToken(me.document, move(to, pending), {}); await new Promise(res => setTimeout(res, 15));
  console.log(label.padEnd(58), "→", r === false ? "REFUSED" : "allowed", "|", warns[0] ? warns[0].slice(0, 90) : `Evade left ${flags.evadeMove}, AP ${flags.ap}`);
};
console.log("--- an ordinary Evade (the Orc is on the path)");
await go("Evade 2 through the Orc", 2);
tokens.splice(1, 1);
await go("Evade 2 with nobody in the way", 2);
tokens.push(orc);
console.log("--- Cut Through's Evade (terrain: ignore)");
await go("through the Orc", 2, { ignore: true });
await go("ending in the Orc's square", 1, { ignore: true, pending: { distance: 1, cost: 1 } });
canvas.environment.darknessLevel = 1; tokens.splice(1, 1);
await go("dark scene, without it", 2, { dark: true });
await go("dark scene, with it", 2, { dark: true, ignore: true });
tokens.splice(0, tokens.length, me);
await go("Difficult Terrain doubled by Foundry (cost 4), without it", 2, { pending: { distance: 2, cost: 4 } });
await go("Difficult Terrain doubled by Foundry (cost 4), with it", 2, { ignore: true, pending: { distance: 2, cost: 4 } });
tokens.push(orc);
// the ruler: a step into a square costs 1 for the creature that ignores terrain
console.log("--- the ruler");
const plain = (f, t, step) => step;
CONFIG.Token = { movement: { actions: { walk: { getCostFunction: () => plain } } } };
M.installDarknessCost();
const stepInto = (col, ignore) => { for (const k of Object.keys(flags)) delete flags[k]; if (ignore) flags.ignoreTerrain = true; return CONFIG.Token.movement.actions.walk.getCostFunction(me)({ i: 0, j: 0 }, { i: 0, j: col }, 1); };
console.log("a step into the Orc's square:", stepInto(1, false), "| for Cut Through's Evade:", stepInto(1, true));
canvas.environment.darknessLevel = 1; console.log("a step into a dark square:", stepInto(3, false), "| for Cut Through's Evade:", stepInto(3, true)); canvas.environment.darknessLevel = 0;
// the flag lives as long as the movement
console.log("--- the flag");
const inline = await import(ROOTURL + "module/inline.mjs");
const P = t => inline.parseInline("Move", t);
console.log("the tag:", P("evade|distance:2|terrain:ignore").ignoreTerrain, "| without:", P("evade|distance:2").ignoreTerrain, "| terrain:no:", P("evade|distance:2|terrain:no").ignoreTerrain, "| the distance still read:", P("evade|distance:floor(speed/2)|terrain:ignore").distanceExpr);
for (const k of Object.keys(flags)) delete flags[k]; chat.length = 0; warns.length = 0; tokens.splice(1, 1);
const cfg = P("evade|distance:2|terrain:ignore"); cfg.traits = ["self"];
console.log("the movement is granted:", await M.handleMove(cfg, { actor: kai, token: me }), "| the flag:", flags.ignoreTerrain, "| Evade squares:", flags.evadeMove, "|", chat.at(-1)?.slice(0, 150));
await M.endMovement("c1"); console.log("End movement clears it:", flags.ignoreTerrain, JSON.stringify(flags));
chat.length = 0; const plainCfg = P("evade|distance:2"); plainCfg.traits = ["self"];
console.log("an ordinary Evade:", await M.handleMove(plainCfg, { actor: kai, token: me }), "| the flag:", flags.ignoreTerrain, "|", chat.at(-1)?.slice(0, 120));
await M.endMovement("c1");
await M.handleMove(cfg, { actor: kai, token: me }); await M.evadeAsAdvance("c1"); console.log("the Evade used as an Advance loses it:", flags.ignoreTerrain, "| free squares:", flags.freeMove);
// the content
import fs from "node:fs";
const pack = JSON.parse(fs.readFileSync(ROOT + "packs/_source/actions/cut-through.action.json", "utf8").toString());
console.log("Cut Through's Setup in the compendium:", pack.system.setup.slice(0, 60));
