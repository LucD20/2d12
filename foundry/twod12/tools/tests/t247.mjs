// Run with: node tools/tests/run.mjs (or node tools/tests/t247.mjs)
// v0.0.366 (SIM-2, 2026-11-12): module/gridrules.mjs, the rules of the grid as pure functions for the automated playtest environment
// (book/ruler/sim), against Chapter 3's examples: distances, a movement's cost, Line of Effect and Cover by corners, Emanation, Burst, Collision;
// and the pure pieces it stands beside (linearea.mjs lineSquares, corners.mjs stepCorners), which the environment imports too.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const G = await import(ROOTURL + "module/gridrules.mjs"), L = await import(ROOTURL + "module/linearea.mjs"), C = await import(ROOTURL + "module/corners.mjs");
const walls = list => (ax, ay, bx, by) => list.some(([x, y]) => G.segmentHitsSquare(ax, ay, bx, by, x, y));

console.log("--- distances and movement");
console.log("distance 3 straight, 2 diagonal, 4 diagonal, a knight's move:", G.gridDistance({ x: 0, y: 0 }, { x: 3, y: 0 }), G.gridDistance({ x: 0, y: 0 }, { x: 2, y: 2 }), G.gridDistance({ x: 0, y: 0 }, { x: 4, y: 4 }), G.gridDistance({ x: 0, y: 0 }, { x: 2, y: 1 }));
console.log("step costs: straight", G.stepCost(false), "| 1st diagonal", G.stepCost(true, 0), "| 2nd", G.stepCost(true, 1), "| 3rd", G.stepCost(true, 2), "| Difficult Terrain straight", G.stepCost(false, 0, true), "| a 2nd diagonal into it", G.stepCost(true, 1, true));
console.log("--- Line of Effect and Cover");
const A = { x: 0, y: 0 }, T = { x: 4, y: 0 };
console.log("nothing between:", G.coverLevel(A, T, walls([])), "| a wall square on the line: ", G.coverLevel(A, T, walls([[2, 0]])), "| a wall beside the line (below it):", G.coverLevel(A, T, walls([[2, -1]])));
console.log("a pillar that hides the lower corners of a target up and to the right:", G.coverLevel({ x: 0, y: 0 }, { x: 3, y: 1 }, walls([[2, 0]])), "| a long wall with the target right behind its end:", G.coverLevel({ x: 0, y: 0 }, { x: 3, y: 2 }, walls([[2, 0], [2, 1]])));
console.log("a wall along the target's own edge doesn't block its corner:", G.coverLevel({ x: 0, y: 0 }, { x: 0, y: 3 }, walls([[1, 3]])), "| a line that touches a wall's corner:", G.segmentHitsSquare(0.5, 0.5, 2.5, 2.5, 1, 0) || G.segmentHitsSquare(0, 0, 2, 2, 2, 0));
console.log("--- areas");
const em = n => G.emanationSquares({ x: 0, y: 0 }, n).length;
console.log("Emanation 1 / 2 / 3 around one square:", em(1), em(2), em(3), "| 1 around a 2 x 2 space:", G.emanationSquares([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], 1).length);
console.log("Burst 1 / 2 / 3 on a corner:", [1, 2, 3].map(n => G.burstSquares({ x: 0, y: 0 }, n).length).join(" "));
const ln = (dx, dy, n) => L.lineSquares({ x: 0, y: 0 }, { x: dx, y: dy }, n).length;
console.log("Line 10 straight / 2 to 1 / diagonal:", ln(1, 0, 10), ln(2, 1, 10), ln(1, 1, 10), "| the book's Line 6 aimed 2 east 1 south:", ln(2, 1, 6));
console.log("--- corners and Collision");
console.log("a diagonal past a solid corner:", C.stepCorners({ i: 0, j: 0 }, { i: 1, j: 1 }, { solidAt: () => true }).kind, "| an open one:", JSON.stringify(C.stepCorners({ i: 0, j: 0 }, { i: 1, j: 1 }).kind), "| between two creatures:", C.stepCorners({ i: 0, j: 0 }, { i: 1, j: 1 }, { creatureAt: c => (c.i === 0 ? "a" : "b") }).kind);
console.log("Pushed 4 with a wall right behind:", G.collisionDamage(4, "wall"), "| through a creature after 1 square:", G.collisionDamage(3, "creature"), "to each | nothing in the way:", G.collisionDamage(0));
console.log("--- one copy");
const gr = fs.readFileSync(ROOT + "module/gridrules.mjs", "utf8"), map = fs.readFileSync(ROOT + "../../book/ruler/map.mjs", "utf8");
console.log("pure (it imports only config and linearea):", [...gr.matchAll(/^import .* from "(.+)";/gm)].map(m => m[1]).join(" "), "| no Foundry global:", !/\b(game|canvas|ui|Hooks|foundry)\./.test(gr.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")));
console.log("the environment's map uses it:", /GR\.(coverLevel|stepCost|collisionDamage|gridDistance)/.test(map), "| and corners.mjs:", /CO\.(stepCorners|straightCells)/.test(map));
