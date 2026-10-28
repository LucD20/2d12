// Run with: node tools/tests/run.mjs (or node tools/tests/t53.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.canvas = { grid: { size: 40, isSquare: true }, tokens: { placeables: [] } };
const cf = await import(ROOTURL + "module/config.mjs");
console.log("AP badges:", cf.apIcon(2).replace(/<[^>]+>/g, ""), cf.apIcon(1, true).replace(/<[^>]+>/g, ""), "| classes:", /apmark/.test(cf.apIcon(1)), /rmark/.test(cf.apIcon(1, true)));
// Leaning: a creature right behind a wall corner can shoot from its corner
const cv = await import(ROOTURL + "module/cover.mjs");
const tok = (id, x, y, status) => ({ id, document: { x: x * 40, y: y * 40, width: 1, height: 1, hidden: false }, actor: { statuses: new Set(status ? [status] : []) } });
// the wall: a vertical segment at x=60 from y=0 to y=100, touching the attacker's square (attacker square x 0..40... wall at x=45)
const wall = (a, b) => { const X = 45; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 125 && y <= 200; };
const T = tok("T", 4, 4);   // target at x 160..200, y 160..200
const A = tok("A", 0, 3), AL = tok("A", 0, 3, "leaning");   // attacker square x 0..40, y 120..160
const none = [];
let c = cv.coverBetween(A, T, { blockedFn: wall, others: none }); console.log("hiding behind the wall (center):", c.blocked, "blocked ->", c.label, c.banes, "banes");
c = cv.coverBetween(AL, T, { blockedFn: wall, others: none }); console.log("Leaning (best corner):", c.blocked, "blocked ->", c.label, c.banes, "banes | why:", cv.coverWhy(c));
// a Leaning target is exposed: cover reduced by 1
const TL = tok("T", 4, 4, "leaning");
c = cv.coverBetween(A, TL, { blockedFn: (a, b) => b.x > 175 && b.y < 180 || b.x > 185, others: none }); console.log("target Leaning:", c.label, "exposed:", c.exposed, "| (without leaning would be", cv.coverBetween(A, T, { blockedFn: (a, b) => b.x > 175 && b.y < 180 || b.x > 185, others: none }).label + ")");
c = cv.coverBetween(A, TL, { blockedFn: () => true, others: none }); console.log("Leaning target with no Line of Effect stays total:", c.label, c.noLoE);
// effect name -> status, and the Hindered effect ends after a Move Action
const bs = await import(ROOTURL + "module/basic.mjs");
console.log("Basic actions:", Object.values(bs.BASIC_ACTIONS).map(b => b.name).join(", "));
console.log("Leaning:", bs.BASIC_ACTIONS.leaning.traits.join(","), "|", bs.BASIC_ACTIONS.leaning.versions[0].effects.slice(-26));
const g = await import(ROOTURL + "module/gen.mjs");
const pf = g.parseTierFull('1d4+2BPi,"For 1 round, the creature is Hindered until it uses a Move Action."'); console.log("Lock & Loose T2:", JSON.stringify(pf.insts.map(i => ({ dice: i.dice, pool: i.pool, sub: i.subtype }))), "|", pf.text);
