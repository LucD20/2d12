// Run with: node tools/tests/run.mjs (or node tools/tests/t136.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.165: the Line of Effect button (the lines cover is counted with: origin, the four corners, blocked or not, and the label at the target),
// the shield's Defense in two letters for a Vs. Attribute (Bo, Mi, Ap, In), the Strike row's red line, the sheet keeping its scroll position.
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const S = 40;
globalThis.canvas = { grid: { size: S, isSquare: true }, tokens: { placeables: [] } };
const tok = (id, x, y, w = 1, h = 1) => ({ id, document: { x: x * S, y: y * S, width: w, height: h, hidden: false } });
const cv = await import(ROOT + "module/cover.mjs");
const { loeLabel } = await import(ROOT + "module/loe.mjs");
// a wall along x = 140 px from y = 0 to y = 100: it blocks lines that cross it there
const wall = (a, b) => { const X = 140; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 0 && y <= 100; };
const A = tok("A", 0, 2);
for (const [label, T] of [["open ground (below the wall)", tok("T", 5, 4)], ["half behind the wall", tok("T", 5, 2)], ["behind the wall", tok("T", 5, 0)]]) {
  const c = cv.coverBetween(A, T, { blockedFn: wall, others: [] });
  console.log(label.padEnd(30), `origin (${c.origin.x}, ${c.origin.y}) corners ${c.corners.map(k => `(${Math.round(k.x)},${Math.round(k.y)}) ${k.blocked ? "red" : "green"}`).join(" ")} | ${loeLabel(c)}`);
}
console.log("a creature in the way:", loeLabel({ ...cv.coverBetween(A, tok("T", 5, 2), { blockedFn: () => false, others: [tok("M", 2, 2)] }) }));
console.log("no Line of Effect:", loeLabel({ blocked: 4, noLoE: true, level: 4, label: "Total cover" }), "| Leaning target:", loeLabel({ blocked: 2, level: 1, label: "Low cover", exposed: true }));
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- wiring");
const loe = src("module/loe.mjs"), act = src("module/actions.mjs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("button on the token HUD of your own token:", loe.includes('Hooks.on("renderTokenHUD"') && loe.includes("token?.isOwner"), "| registered:", src("module/twod12.mjs").includes("registerLoE();"),
  "| follows targets, moves and walls:", ["targetToken", "refreshToken", "updateWall"].every(h => loe.includes(h)), "| only on square grids:", loe.includes("canvas?.grid?.isSquare"));
console.log("shield: Vs. Attributes in two letters:", act.includes('const VS2 = { body: "Bo", mind: "Mi", appeal: "Ap", instinct: "In" }'), "| AD and WD kept:", act.includes('"armor" ? "AD"') && act.includes('"ward" ? "WD"'));
console.log("Strike rows: a red line, no gradient:", css.includes(".ar.strike { box-shadow: inset 3px 0 0 #b3261e; }") && !css.includes("linear-gradient(90deg, rgba(178, 34, 34"));
console.log("scroll kept: saved before drawing, put back after the tab is shown:", sh.includes("async _preRender(context, options)") && sh.includes("applyTab(this);\n    this._restoreScroll();") && sh.includes("requestAnimationFrame(put)"));
