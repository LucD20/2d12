// Run with: node tools/tests/run.mjs (or node tools/tests/t333.mjs)
// v0.0.533 (Lucas, 2026-11-27: "Should a second diagonal on a difficult terrain be 4 squares instead of 3? I think it should be three, so difficult
// terrain simply counts as 1 more movement"; book, Chapter 3: "Each square of Difficult Terrain counts 1 more than it would normally count: 2 for a
// square, 3 for a second diagonal. A square is Difficult Terrain once, however many things make it so."): the drag's price (move.mjs hardStepCost,
// through Foundry's cost function), the movement area (reachableCells' enterCost), the move hook's extra and the grid rules (gridrules.mjs stepCost).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
const mv = await import(ROOTURL + "module/move.mjs"), GR = await import(ROOTURL + "module/gridrules.mjs");

console.log("--- one step (hardStepCost: its normal cost, what Foundry priced it, Difficult or not)");
console.log("a straight step:", mv.hardStepCost(1, 1, false), "-> Difficult:", mv.hardStepCost(1, 1, true));
console.log("a first diagonal:", mv.hardStepCost(1, 1, false), "-> Difficult:", mv.hardStepCost(1, 1, true));
console.log("a second diagonal:", mv.hardStepCost(2, 2, false), "-> Difficult:", mv.hardStepCost(2, 2, true), "(the book: 3; it was 4)");
console.log("Foundry's own terrain already priced it 2 (no stacking):", mv.hardStepCost(1, 2, true), "| a step with no length given:", mv.hardStepCost(NaN, 1, true));
console.log("on a 5-foot grid (Foundry gives feet): a straight step", mv.hardStepCost(5, 5, true, 5), "| a second diagonal", mv.hardStepCost(10, 10, true, 5));
console.log("two sources on one square (Darkness and an ally's space): the price is a yes or no, once:", mv.hardStepCost(1, 1, true || true));
console.log("the grid rules (the SIM): straight", GR.stepCost(false, 0, true), "| first diagonal", GR.stepCost(true, 0, true), "| second diagonal", GR.stepCost(true, 1, true), "| plain second diagonal", GR.stepCost(true, 1, false));

console.log("--- the movement area and the drag give the same number");
// Kaela at (0,0), Speed 3; rubble (Difficult Terrain) at (1,1) and (2,2): the area's price of each square, against the steps the drag pays
const rough = new Set(["1,1", "2,2", "0,1"]);
const enterCost = c => (rough.has(`${c.i},${c.j}`) ? 1 : 0);
const lane = new Set(["0,0", "1,1", "2,2", "0,1"]);   // the squares the area may use (walls elsewhere): the drag's own path
const reach = n => mv.reachableCells([{ i: 0, j: 0 }], n, (a, b) => !lane.has(`${b.i},${b.j}`), 0, enterCost).map(c => `${c.i},${c.j}`);
const dragCost = steps => { let par = 0, total = 0; for (const s of steps) { const diag = s.di && s.dj, step = diag ? (par ? 2 : 1) : 1; if (diag) par = 1 - par; total += mv.hardStepCost(step, step, rough.has(`${s.i},${s.j}`)); } return total; };
const diag2 = [{ i: 1, j: 1, di: 1, dj: 1 }, { i: 2, j: 2, di: 1, dj: 1 }];
console.log("two diagonals into rubble: the drag pays", dragCost(diag2), "(1 + 1, then 2 + 1) | along that path, the area with 5 has (2,2):", reach(5).includes("2,2"), "| with 4 it does not:", !reach(4).includes("2,2"));
console.log("a straight step into rubble: the drag pays", dragCost([{ i: 0, j: 1, di: 0, dj: 1 }]), "| the area with 1 doesn't have (0,1):", !reach(1).includes("0,1"), "| with 2 it does:", reach(2).includes("0,1"));
const m = src("module/move.mjs");
console.log("the move hook's own count adds 1 a hard step:", m.includes("out.extra = hardSteps.length;"), "| the area adds 1 a square:", m.includes("difficult(cell) ? (evading ? Infinity : 1)"), "| hardStep uses hardStepCost:", m.includes("return hardStepCost(step, cost, hard, globalThis.canvas?.grid?.distance"));
console.log("an Evade through an ally's space pays its 1 more when Foundry didn't count it:", m.includes("else if (!ch && evading && !ignoring) squares += extraCost({ extra: way.allyExtra ?? 0, cornerDT: 0 }, cost > dist + 1e-6);"));
console.log("Crawl (dt:ignore) and Cut Through still pay nothing more:", m.includes("if (ignoresTerrain(doc)) return Number.isFinite(step) && step > 0 ? step : cost;") && m.includes("const enterCost = cell => (ignoring ? 0 :"));
console.log("no 'double' left in the pricing:", !/Math\.max\(cost, 2 \* step\)|cost \* 2/.test(m));
