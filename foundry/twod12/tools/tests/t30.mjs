// Run with: node tools/tests/run.mjs (or node tools/tests/t30.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.canvas = {};
const handlers = {}; globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
const warns = [], msgs = [];
globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.ChatMessage = { create: async d => msgs.push(d.content.replace(/<button.*?<\/button>/g, "[BUTTON]").replace(/<[^>]+>/g, "")) };
const flags = { ap: 5, freeMove: 0, evadeMove: 0, moveLeft: 0 };
const c = { id: "c1", name: "Orc", tokenId: "t1", isOwner: true, actor: { system: { walk: 5, level: 1, attributes: { body: 1 } } }, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
globalThis.game = { user: { id: "u1", isActiveGM: true }, socket: { on() {}, emit() {} }, combat: { started: true, combatant: c, combatants: { find: f => [c].find(f), get: () => c } },
  messages: { get: () => null } };
globalThis.canvas = { grid: { distance: 1, size: 100, getOffset: ({ x, y }) => ({ i: Math.floor(y / 100), j: Math.floor(x / 100) }), getCenterPoint: ({ i, j }) => ({ x: j * 100 + 50, y: i * 100 + 50 }), measurePath: ([a, b]) => ({ cost: Math.hypot(b.x - a.x, b.y - a.y) / 100 }) }, scene: { grid: { distance: 1 } }, tokens: { controlled: [{ actor: c.actor }] } };
globalThis.game.user.character = c.actor;
const mv = await import(ROOT + "module/move.mjs"); mv.registerMovement();
const doc = { id: "t1", x: 0, y: 0 };
// Evade half the Walk (5/2 rounds up to 3)
await mv.handleMove({ kind: "evade", distance: 0, distanceExpr: "walk/2" }, {});
console.log("grant:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
// move 2 squares: uses Evade, no AP
handlers.preMoveToken(doc, { destination: { x: 200, y: 0 }, pending: { cost: 2, distance: 2 } }, {}); await new Promise(r => setTimeout(r, 20));
console.log("evade move 2:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
// try to cross difficult terrain (cost 4 for length 2) while Evade remains
const r = handlers.preMoveToken(doc, { destination: { x: 200, y: 0 }, pending: { cost: 4, distance: 2 } }, {});
console.log("difficult terrain with Evade left -> blocked:", r === false, "|", warns.splice(0).join(""));
await mv.endMovement("c1"); console.log("after End movement:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
const r2 = handlers.preMoveToken(doc, { destination: { x: 200, y: 0 }, pending: { cost: 4, distance: 2 } }, {}); await new Promise(r => setTimeout(r, 20));
console.log("difficult terrain, no Evade -> allowed:", r2 !== false, JSON.stringify(flags), "|", msgs.splice(0).join(""));
// walk grant with plain number and Traverse-style expression
flags.ap = 5; flags.moveLeft = 0; flags.freeMove = 0;
await mv.handleMove({ kind: "walk", distance: 0, distanceExpr: "walk" }, {}); console.log("Traverse grant:", JSON.stringify(flags), "|", msgs.splice(0).join(""));
await mv.handleMove({ kind: "walk", distance: 0, distanceExpr: "banana" }, {}); console.log("bad expression:", warns.splice(0).join(""));
// basic actions
const { BASIC_ACTIONS } = await import(ROOT + "module/basic.mjs");
console.log(Object.values(BASIC_ACTIONS).map(a => `${a.name} [${a.traits.join("/")}] AP ${a.versions.map(v => v.ap).join("/")}`).join(" | "));
console.log(BASIC_ACTIONS.safeMovement.versions.map(v => v.effects).join(" || "));
const { categoryText } = await import(ROOT + "module/config.mjs");
console.log([categoryText({ category: "Paladin Feature", level: 1 }), categoryText({ category: "Basic Action", level: 0 }), categoryText({ category: "", level: 3 }), categoryText({})].map(x => JSON.stringify(x)).join(" "));
