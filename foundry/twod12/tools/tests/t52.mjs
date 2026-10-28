// Run with: node tools/tests/run.mjs (or node tools/tests/t52.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const S = 40;
globalThis.canvas = { grid: { size: S, isSquare: true }, tokens: { placeables: [] } };
const tok = (id, x, y, w = 1, h = 1) => ({ id, document: { x: x * S, y: y * S, width: w, height: h, hidden: false } });
const cv = await import(ROOTURL + "module/cover.mjs");
// the scene of the diagram: grid unit = 100 px; wall at x=3.5 squares from y=1.5 to y=3.1... scaled from the 40px drawing (x2.5)
// attacker center (0.5, 3.0) in squares; wall x=3.0 .. use the drawing's numbers: A=(40,120), wall x=140 y 60..124, target x 220..260 (px of the drawing)
const k = S / 40;   // 1 drawing px = 2.5 px
const wall = (a, b) => { const X = 140 * k; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 60 * k && y <= 124 * k; };
// the drawing's attacker square is x 20..60, y 100..140 -> square (0.5, 2.5) in units of 40px; use tokens with a grid of 40 px
globalThis.canvas.grid.size = 40;
const A = tok("A", 0.5, 2.5), T1 = tok("T1", 5.5, 2.5), T2 = tok("T2", 5.5, 2, 2, 2);
const wall40 = (a, b) => { const X = 140; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 60 && y <= 124; };
const none = [];
let c = cv.coverBetween(A, T1, { blockedFn: wall40, others: none });
console.log("1x1 target (diagram left):", c.blocked, "blocked ->", c.label, c.banes, "banes | LoE:", !c.noLoE);
c = cv.coverBetween(A, T2, { blockedFn: wall40, others: none });
console.log("2x2 target (diagram right):", c.blocked, "blocked ->", c.label, c.banes, "banes | center line blocked:", wall40({ x: 40, y: 120 }, { x: 260, y: 120 }), "but still targetable:", !c.noLoE);
c = cv.coverBetween(A, T1, { blockedFn: () => true, others: none }); console.log("everything blocked:", c.blocked, c.label, "no LoE:", c.noLoE);
c = cv.coverBetween(A, T1, { blockedFn: () => false, others: none }); console.log("open ground:", c.blocked, c.label, c.banes);
// creatures in the way: three in a row (the image 3 case)
const mid = tok("M", 3.5, 2.5);
c = cv.coverBetween(A, T1, { blockedFn: () => false, others: [mid] }); console.log("a creature in the way:", c.label, c.banes, "banes | in the way:", c.inWay);
const off = tok("O", 3.5, 0.5);
c = cv.coverBetween(A, T1, { blockedFn: () => false, others: [off] }); console.log("a creature off the line:", c.label);
// walls give 2 and a creature is in the way: highest, no stacking
c = cv.coverBetween(A, T1, { blockedFn: wall40, others: [mid] }); console.log("2 blocked corners + a creature in the way:", c.label, c.banes);
// Large attacker picks its best square
const L = tok("L", 0.5, 1.5, 2, 2);
c = cv.coverBetween(L, T1, { blockedFn: wall40, others: none }); console.log("Large attacker (2x2) vs 1x1 target:", c.blocked, "blocked (best of its 4 squares)");
// senses
const { giveHearing } = await import(ROOTURL + "module/senses.mjs");
let updated = null; giveHearing({ prototypeToken: { toObject: () => ({ detectionModes: [{ id: "basicSight", enabled: true, range: 0 }] }) }, updateSource: u => { updated = u; } });
console.log("hearing added:", JSON.stringify(updated["prototypeToken.detectionModes"].map(m => m.id)));
const cf = await import(ROOTURL + "module/config.mjs");
console.log("Unconscious: Fireball Save always Doomed (Dying Body Save):", cf.unconsciousDoom({ statuses: new Set(["unconscious", "dying"]) }, "body", "Save"), "| Shattered Mind Check exempt:", !cf.unconsciousDoom({ statuses: new Set(["unconscious", "shattered"]) }, "mind", "Check"), "| Shattered Mind Save Doomed:", cf.unconsciousDoom({ statuses: new Set(["unconscious", "shattered"]) }, "mind", "Save"));
