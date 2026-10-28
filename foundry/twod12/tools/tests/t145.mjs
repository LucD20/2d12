// Run with: node tools/tests/run.mjs (or node tools/tests/t145.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.178: an area kept on the map is ONE region shape (the outline of its squares); a Region drawn by hand is put on whole squares
// (a circle becomes the area of its size: an Emanation on a square, a Burst on a corner).
const GS = 100;
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }), getCenterPoint: ({ i, j }) => ({ x: j * GS + 50, y: i * GS + 50 }) } };
const rs = await import(ROOTURL + "module/regionshape.mjs"), tp = await import(ROOTURL + "module/template.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const corner = (i, j) => `${String.fromCharCode(65 + j)}${i + 1}`;   // a grid corner named like the book's squares (its top-left)
console.log("--- the outline of an area (one polygon, its corners only)");
for (const [label, cells] of [["a 1 Emanation (3x3)", tp.emanationCells([{ i: 2, j: 2 }], 1)], ["a 2 Emanation (21 squares)", tp.emanationCells([{ i: 2, j: 2 }], 2)], ["one square", [{ i: 0, j: 0 }]], ["two separate squares", [{ i: 0, j: 0 }, { i: 0, j: 2 }]]]) {
  const loops = rs.cellsOutline(cells);
  console.log(label.padEnd(28), `${cells.length} squares, ${loops.length} loop(s):`, loops.map(l => l.map(p => corner(p.i, p.j)).join(" ")).join(" | "));
}
const tl = (i, j) => ({ x: j * GS, y: i * GS });
const one = rs.shapesForCells(tp.emanationCells([{ i: 2, j: 2 }], 2), tl, GS);
console.log("a 2 Emanation as region shapes:", one.length, "shape,", one[0].type, `${one[0].points.length / 2} points`, "| two separate squares:", rs.shapesForCells([{ i: 0, j: 0 }, { i: 0, j: 2 }], tl, GS).map(s => s.type).join(", "));
console.log("--- a Region drawn by hand, on whole squares");
const grid = { size: GS, vertex: p => ({ x: Math.round(p.x / GS) * GS, y: Math.round(p.y / GS) * GS }), cellOf: p => ({ i: Math.floor(p.y / GS), j: Math.floor(p.x / GS) }), center: c => ({ x: c.j * GS + 50, y: c.i * GS + 50 }), topLeft: tl, emanationCells: tp.emanationCells, burstCells: tp.burstCells };
const area = sh => { const out = rs.snapShape(sh, grid); return out.map(s => s.type === "polygon" ? `polygon (${s.points.length / 2} corners)` : `${s.type} ${s.x},${s.y} ${s.width}x${s.height}`).join(", "); };
const squares = sh => { const p = rs.snapShape(sh, grid)[0]; if (p.type !== "polygon") return "-"; let n = 0; for (let i = -10; i < 20; i++) for (let j = -10; j < 20; j++) { const x = j * GS + 50, y = i * GS + 50; let inside = false; for (let a = 0, b = p.points.length / 2 - 1; a < p.points.length / 2; b = a++) { const xa = p.points[2 * a], ya = p.points[2 * a + 1], xb = p.points[2 * b], yb = p.points[2 * b + 1]; if ((ya > y) !== (yb > y) && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside; } if (inside) n++; } return n; };
for (const [label, sh] of [["a circle of 2 on a square's center", { type: "circle", x: 250, y: 250, radius: 200 }], ["a circle of 2.5 (the old way)", { type: "circle", x: 250, y: 250, radius: 250 }], ["a circle of 1.8 near a square's center", { type: "circle", x: 262, y: 240, radius: 180 }], ["a circle of 2 on a corner (a Burst)", { type: "circle", x: 300, y: 300, radius: 200 }], ["a circle of 1 on a corner", { type: "circle", x: 302, y: 298, radius: 95 }]])
  console.log(label.padEnd(40), area(sh), "->", squares(sh), "squares");
console.log("a rectangle drawn at 130,140 290x170:", area({ type: "rectangle", x: 130, y: 140, width: 290, height: 170, rotation: 0 }));
console.log("a polygon:", JSON.stringify(rs.snapShape({ type: "polygon", points: [10, 20, 260, 30, 240, 290] }, grid)[0].points));
const tpl = src("module/template.mjs"), main = src("module/twod12.mjs");
console.log("the chat buttons make one shape:", tpl.includes("tryCreate(shapesForCells(placed.cells, cTL, size()))"), "| and aren't snapped again:", tpl.includes("{ twod12Area: true }"), "| drawn Regions are snapped when created:", main.includes("registerRegionSnap();"));
