// Run with: node tools/tests/run.mjs (or node tools/tests/t170.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.214 (pack L): the Line area (book: Areas > Line) and Straight Line movement with the same squares (one tie side for the whole line).
class F { constructor(o) { this.o = o; } }
const GS = 100, tokens = [], walls = [], tiles = [];
// A wall test for the stand-in canvas: segment a-b crosses a wall segment (an end only touched doesn't count).
const cross = (a, b, w) => {
  const [x3, y3, x4, y4] = w, d = (b.x - a.x) * (y4 - y3) - (b.y - a.y) * (x4 - x3);
  if (!d) return false;
  const t = ((x3 - a.x) * (y4 - y3) - (y3 - a.y) * (x4 - x3)) / d, u = ((x3 - a.x) * (b.y - a.y) - (y3 - a.y) * (b.x - a.x)) / d;
  return t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9;
};
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.CONFIG = { Canvas: { polygonBackends: { sight: { testCollision: (a, b) => walls.some(w => cross(a, b, w.document.c)) } } } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, getRoute: p => "/" + p } };
globalThis.canvas = { grid: { size: GS, isSquare: true, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }) },
  tokens: { placeables: tokens }, walls: { placeables: walls }, tiles: { placeables: tiles }, scene: { grid: { distance: 5 } } };
const L = await import(ROOTURL + "module/linearea.mjs"), tp = await import(ROOTURL + "module/template.mjs"), rs = await import(ROOTURL + "module/regionshape.mjs");
const mv = await import(ROOTURL + "module/move.mjs"), cf = await import(ROOTURL + "module/config.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const P = c => `(${c.x},${c.y})`, show = cells => cells.map(P).join(" ") || "nothing";
const line = (t, side = "left", n = 10) => L.lineSquares({ x: 0, y: 0 }, t, n, side);

console.log("--- Line 10 from (0,0) (the prompt's cases)");
console.log("aim (1,0):", show(line({ x: 1, y: 0 })));
console.log("aim (1,1):", show(line({ x: 1, y: 1 })));
console.log("aim (2,1) left: ", show(line({ x: 2, y: 1 })));
console.log("aim (2,1) right:", show(line({ x: 2, y: 1 }, "right")));
console.log("aim (5,2):", show(line({ x: 5, y: 2 })), "| right is the same (no tie):", show(line({ x: 5, y: 2 }, "right")) === show(line({ x: 5, y: 2 })), "| ties:", L.lineHasTie({ x: 0, y: 0 }, { x: 5, y: 2 }, 10));
console.log("aim (-2,-5):", show(line({ x: -2, y: -5 })));
console.log("aim at the origin:", show(line({ x: 0, y: 0 })));
console.log("lengths: straight", line({ x: 1, y: 0 }).length, "| 45 degrees", line({ x: 1, y: 1 }).length, "| 2:1", line({ x: 2, y: 1 }).length, "| 5:2", line({ x: 5, y: 2 }).length);
console.log("(4,2) is (2,1):", show(line({ x: 4, y: 2 })) === show(line({ x: 2, y: 1 })), "| (6,3) right is (2,1) right:", show(line({ x: 6, y: 3 }, "right")) === show(line({ x: 2, y: 1 }, "right")));
// Mirrored and rotated: a rotation by 90 degrees (x, y) -> (-y, x) keeps the side; a mirror (x, -y) swaps it.
const rot = c => ({ x: -c.y, y: c.x }), mir = c => ({ x: c.x, y: -c.y });
const same = (a, b) => show(a) === show(b);
console.log("rotated 90:", same(line(rot({ x: 2, y: 1 })), line({ x: 2, y: 1 }).map(rot)), same(line(rot({ x: 2, y: 1 }), "right"), line({ x: 2, y: 1 }, "right").map(rot)),
  "| 180:", same(line({ x: -2, y: -1 }), line({ x: 2, y: 1 }).map(c => ({ x: -c.x, y: -c.y }))), "| mirrored swaps the side:", same(line(mir({ x: 2, y: 1 }), "right"), line({ x: 2, y: 1 }).map(mir)));
console.log("4:1 both sides the same length, not the same shape:", line({ x: 4, y: 1 }).length, line({ x: 4, y: 1 }, "right").length, "|", show(line({ x: 4, y: 1 })), "|", show(line({ x: 4, y: 1 }, "right")));
console.log("tie squares passed over (2,1) left:", line({ x: 2, y: 1 }).filter(c => c.other).map(c => P(c.other)).join(" "));
console.log("the count: (7,3) costs", L.lineCost(7, 3), "| (8,4)", L.lineCost(8, 4), "| (9,4)", L.lineCost(9, 4));

console.log("--- walls, a Large creature, height");
const cut = L.cutLine(line({ x: 1, y: 0 }), { x: 0, y: 0 }, (a, b) => b.x === 4);
console.log("a wall before (4,0) cuts it:", show(cut));
walls.push({ document: { c: [500, 0, 500, 300] } });   // a wall between columns 4 and 5, rows 0 to 2
const me = { id: "me", name: "You", document: { id: "me", x: 0, y: 0, width: 1, height: 1, elevation: 0 } };
const r = tp.lineCompute(me, 10, { x: 950, y: 50 });
console.log("Line 10 east with a wall at x=5:", r.cells.map(c => P({ x: c.j, y: c.i })).join(" "), "| stopped:", r.cut, "| side kept:", JSON.stringify(r.line));
walls.length = 0;
const big = { id: "ogre", name: "Ogre", document: { id: "ogre", x: 0, y: 0, width: 2, height: 2, elevation: 0 } };
const toSE = tp.lineCompute(big, 4, { x: 650, y: 650 }), toNE = tp.lineCompute(big, 4, { x: 650, y: 50 }), toS = tp.lineCompute(big, 3, { x: 50, y: 650 });
console.log("a Large creature aims southeast: from", P(toSE.line.origin), show(toSE.cells.map(c => ({ x: c.j, y: c.i }))));
console.log("aims east along its top row: from", P(toNE.line.origin), show(toNE.cells.map(c => ({ x: c.j, y: c.i }))), "| south from its left column:", P(toS.line.origin), show(toS.cells.map(c => ({ x: c.j, y: c.i }))));
console.log("aiming inside its own space: nothing:", tp.lineCompute(big, 4, { x: 150, y: 150 }).cells.length);
console.log("height 1: on the ground", L.inLineHeight(0, 0), "| flying 1 square up", L.inLineHeight(0, 1), "| a Large creature (2 tall) standing 1 below", L.inLineHeight(0, -1, 2), "| half a square up", L.inLineHeight(0, 0.5));

console.log("--- the region of a diagonal Line (squares touching only at corners)");
const diag = line({ x: 1, y: 1 }, "left", 4).map(c => ({ i: c.y, j: c.x })), tl = (i, j) => ({ x: j * GS, y: i * GS });
console.log("corner-only contacts:", rs.cornerOnly(diag), "| an Emanation has none:", rs.cornerOnly(tp.emanationCells([{ i: 3, j: 3 }], 2)));
console.log("diagonal Line 4:", rs.shapesForCells(diag, tl, GS).map(s => `${s.type} ${s.x},${s.y} ${s.width}x${s.height}`).join(" | "));
const steep = line({ x: 1, y: 3 }, "left", 6).map(c => ({ i: c.y, j: c.x }));
console.log("a steep Line 6 (runs down the columns):", rs.shapesForCells(steep, tl, GS).map(s => `${s.x},${s.y} ${s.width}x${s.height}`).join(" | "));
const twoOne = line({ x: 2, y: 1 }, "left", 6).map(c => ({ i: c.y, j: c.x }));
console.log("a 2:1 Line 6 (its steps touch at corners too):", rs.cornerOnly(twoOne), rs.shapesForCells(twoOne, tl, GS).map(s => s.type).join(" "));

console.log("--- Straight Line movement: one tie side for the whole movement");
console.log("A1 to G4 left: ", show(L.lineSteps({ x: 0, y: 0 }, { x: 6, y: 3 })), "| right:", show(L.lineSteps({ x: 0, y: 0 }, { x: 6, y: 3 }, "right")));
const sq = c => "ABCDEFGHIJ"[c.j] + (c.i + 1);
const runner = { id: "me", x: 0, y: 0, width: 1, height: 1, disposition: 1, actor: { system: { senses: {} } } };
console.log("Charge A1 to G4, no drag:", mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }).cells.map(sq).join(" "), mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }).side);
console.log("a drag along the lower squares takes the right side at every tie:", mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }, [{ x: 150, y: 150 }, { x: 350, y: 250 }, { x: 550, y: 350 }]).cells.map(sq).join(" "));
tokens.push({ id: "x", name: "Orc", actor: {}, document: { id: "x", x: 300, y: 200, width: 1, height: 1, disposition: -1, hidden: false } });
const blocked = mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }, [{ x: 150, y: 150 }, { x: 350, y: 250 }, { x: 550, y: 350 }]);
console.log("an Orc on D3 (a right tie square): the line goes left all the way:", blocked.cells.map(sq).join(" "), blocked.side, "| never mixed:", !blocked.cells.some(c => sq(c) === "B2"));
tokens.length = 0;
console.log("Pushed 4 east-southeast (shift 2,4): left", mv.sideShifts(2, 4).map(s => `${s.di},${s.dj}`).join(" "), "| right", mv.sideShifts(2, 4, "right").map(s => `${s.di},${s.dj}`).join(" "));
const pmap = mv.pushShifts([{ i: 0, j: 0 }], [{ i: 0, j: -1 }], 4), pkey = [...pmap.keys()].find(k => k === "2,4");
console.log("the push path to 2,4 is one side:", mv.pathTo(pmap, pkey).map(n => `${n.di},${n.dj}`).join(" "));

console.log("--- the Action's Area setting and text");
console.log("parseArea:", JSON.stringify(cf.parseArea("Line 10")), JSON.stringify(cf.parseArea("2 Burst")));
const lineAct = { areaCfg: { size: 6, shape: "line", within: 5, targets: "enemies", center: true, withinRange: "normal" }, traits: new Set(["area"]) };
console.log("areaConfigOf a Line (no Distance, no center):", JSON.stringify(cf.areaConfigOf(lineAct)));
console.log("its button:", cf.areaButton(lineAct));
const data = src("module/data.mjs"), tpl = src("module/template.mjs"), sheet = (src("templates/item-sheet.hbs") + src("module/actionsheet.mjs")), inl = src("module/inline.mjs"), act = src("module/actions.mjs");
console.log("data: the Line shape and its text", data.includes('line: "Line" }, "emanation")') && data.includes("c.shape === \"line\" ? `Line ${sz}`"), "| no Distance line:", data.includes('c.size > 0 && c.shape !== "line"'));
console.log("sheet option", sheet.includes('["line", "Line"]'), "| chat button label", inl.includes("areaLabel(shape, cfg.distance || 1)") && inl.includes('shape === "line" ? "Line"'), "| area name", tp.areaName("line", 10), tp.areaName("burst", 2), tp.areaName("emanation", 1));
console.log("template: the tie toggle (Tab and a button), dashed passed squares, the side kept on the region", tpl.includes('ev.key === "Tab"') && (tpl.includes("lb-side") || tpl.includes(".lb-ties button")) /* v0.0.529: sitframe.mjs tiesHtml */ && tpl.includes("dashedCells(gfx, current.passed)") && tpl.includes("line: placed.line"));
console.log("creatures in the Line give no cover to each other", tpl.includes("placed.noCover = [origin?.id, ...tokensIn(placed.cells).map(t => t.id)]") && tpl.includes("...(placed?.noCover ?? [])"), "| 1 square high", tpl.includes("lineHeightOk(origin, t"));
console.log("no range Banes inside an area (a Line included)", act.includes("if (wUse?.range && selfToken && !isAreaAction)"));
