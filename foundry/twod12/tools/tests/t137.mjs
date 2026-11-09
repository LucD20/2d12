// Run with: node tools/tests/run.mjs (or node tools/tests/t137.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.166: (1) a Leaning creature's cover is counted from the point it looks from (just past its corner, as vision), not from inside its square:
// a wall that ends at that corner no longer blocks every line (Lucas's screenshot). (2) The Cover height calculation (side view): blocks, lines, cover.
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const S = 40;
globalThis.canvas = { grid: { size: S, isSquare: true }, tokens: { placeables: [] } };
const cv = await import(ROOTURL + "module/cover.mjs");
const H = await import(ROOTURL + "module/heightcover.mjs");
console.log("--- (1) Leaning past a wall that ends at your corner");
// your square: x 80..120, y 80..120; a wall along x = 120 from y = 0 down to y = 120 (it ends at your bottom-right corner); the target in the open to the right
const wall = (a, b) => { const X = 120; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 0 && y <= 120; };
const tok = (id, x, y, lean = null) => ({ id, actor: { statuses: new Set(lean ? ["leaning"] : []) }, document: { x: x * S, y: y * S, width: 1, height: 1, hidden: false, flags: lean ? { twod12: { lean: { corner: lean, home: { x: x * S, y: y * S } } } } : {} } });
const T = tok("T", 6, 2);
for (const [label, A] of [["not leaning", tok("A", 2, 2)], ["leaning to the bottom-right corner", tok("A", 2, 2, "br")], ["leaning, no corner picked (best of 4)", { ...tok("A", 2, 2), actor: { statuses: new Set(["leaning"]) } }]]) {
  const c = cv.coverBetween(A, T, { blockedFn: wall, others: [] });
  console.log(label.padEnd(40), `from (${Math.round(c.origin.x)}, ${Math.round(c.origin.y)}): ${c.blocked} blocked -> ${c.label}`);
}
console.log("--- (2) the side view (squares, y up)");
const base = { wA: 1, wT: 1, hA: 0, hT: 3, dist: 4, blocks: {}, origin: "center" };
const show = (label, st) => { const c = H.heightCover(st); console.log(label.padEnd(44), `${c.corners.map(p => p.blocked ? "red" : "green").join(" ")} | ${H.heightLabel(c)}`); };
console.log("layout:", JSON.stringify(H.sideLayout(base)));
show("open ground, target 3 up, 4 apart", base);
show("a 2-square column in front of it", { ...base, blocks: { "3,0": 2, "3,1": 2 } });
show("the same + a half square on top (the image)", { ...base, blocks: { "3,0": 2, "3,1": 2, "3,2": 1 } });
show("a wall 4 squares tall", { ...base, blocks: { "3,0": 2, "3,1": 2, "3,2": 2, "3,3": 2 } });
show("a wall 5 squares tall", { ...base, blocks: { "3,0": 2, "3,1": 2, "3,2": 2, "3,3": 2, "3,4": 2 } });
show("half wall, lines from your top front corner", { ...base, origin: "tr", blocks: { "3,0": 2, "3,1": 2, "3,2": 1 } });
show("a block right under you (doesn't count)", { ...base, blocks: { "0,-1": 2, "1,-1": 2 } });
console.log("origins:", ["center", "tl", "tr", "bl", "br"].map(k => `${k} (${H.originOf({ x: 0, y: 0, w: 1, h: 1 }, k).x},${H.originOf({ x: 0, y: 0, w: 1, h: 1 }, k).y})`).join(" "));
console.log("flat squares apart:", [[0, 0, 4, 0], [0, 0, 4, 4], [0, 0, 1, 1], [0, 0, 3, 2]].map(([a, b, c, d]) => `${H.flatSquares({ document: { x: a * S, y: b * S } }, { document: { x: c * S, y: d * S } }, S)}`).join(", "));
const html = H.heightHtml({ ...base, nameA: "Hero", nameT: "Skull", blocks: { "3,0": 2, "3,2": 1 } });
console.log("html: cells", (html.match(/data-cell=/g) ?? []).length, "| full blocks", (html.match(/hc-block full/g) ?? []).length, "| half", (html.match(/hc-block half/g) ?? []).length, "| corners", (html.match(/data-corner=/g) ?? []).length, "| lines", (html.match(/<line class="hc-line/g) ?? []).length);
const loe = fs.readFileSync(ROOT + "module/loe.mjs", "utf8");
console.log("v0.0.302: a token-controls button next to Line of Effect (not on the HUD):", loe.includes("HeightCover.open(token, targets[0])") && loe.includes('name: "twod12-height"') && loe.includes("change: () => heightShortcut()") && !loe.includes("control-icon twod12-height"));
