// Run with: node tools/tests/run.mjs (or node tools/tests/t140.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.170 (pack M1, movement A): Pulled with the strict cone (the book's two figures), Haul, Corners, Squeezing, the straight-line tie rule.
class F { constructor(o) { this.o = o; } }
const GS = 100, tokens = [], walls = [], tiles = [];
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, getRoute: p => "/" + p } };
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }) },
  tokens: { placeables: tokens }, walls: { placeables: walls }, tiles: { placeables: tiles } };
const mv = await import(ROOTURL + "module/move.mjs"), co = await import(ROOTURL + "module/corners.mjs"), b = await import(ROOTURL + "module/basic.mjs"), cf = await import(ROOTURL + "module/config.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const sq = c => "ABCDEFGHIJ"[c.j] + (c.i + 1);   // the book's names: column letter, row number

console.log("--- Pulled: the book's figures (Pulled 3)");
const pullFig = (label, O, G) => {
  const map = mv.pullShifts([G], [O], 3), by = { 1: [], 2: [], 3: [] };
  for (const n of map.values()) if (n.steps) by[n.steps].push(sq({ i: G.i + n.di, j: G.j + n.dj }));
  console.log(label.padEnd(10), [1, 2, 3].map(k => by[k].sort().join(" ") || "-").join(" / "));
  return map;
};
pullFig("straight", { i: 4, j: 3 }, { i: 1, j: 3 });   // book: D3 / C4 D4 E4
pullFig("diagonal", { i: 4, j: 0 }, { i: 1, j: 3 });   // book: C3 / B3 B4 C4 / A3 A4 B5 C5
const p5 = mv.pullShifts([{ i: 0, j: 0 }], [{ i: 3, j: 0 }], 5);
console.log("Pulled 5 from 3 squares away stops next to the origin:", Math.max(...[...p5.values()].map(n => n.steps)), "steps at most | never the origin's square:", !p5.has("3,0"), "| the 45 degree edge is out (1,1):", !p5.has("1,1"));
console.log("already next to the origin: no square to go to:", mv.pullShifts([{ i: 0, j: 0 }], [{ i: 1, j: 0 }], 3).size === 1);
const into = mv.pullIntoOrigin([{ i: 1, j: 3 }], [{ i: 4, j: 3 }], { i: 4, j: 3 }, 3);
const r = mv.analyzePath(mv.lineShifts(into), 3, { wallBetween: () => false, creatureAt: s => (s.di === 3 ? { name: "You" } : null) });
console.log("aimed at the origin's square (the book's example):", `moves ${r.done}, unused ${r.unused}, damage ${JSON.stringify(r.damage)}`, "| too far to aim at:", mv.pullIntoOrigin([{ i: 0, j: 3 }], [{ i: 4, j: 3 }], { i: 4, j: 3 }, 3));
const big = mv.pullShifts([{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 1, j: 1 }], [{ i: 5, j: 0 }], 4);
console.log("a Large creature pulled 4 toward a creature 4 rows below:", [...big.values()].filter(n => n.steps).map(n => `${n.di},${n.dj}`).sort().join(" "));

console.log("--- Corners");
const W = (x0, y0, x1, y1, extra = {}) => ({ document: { c: [x0, y0, x1, y1], move: 20, door: 0, ds: 0, ...extra } });
const step = (label, a, b, opts) => console.log(label.padEnd(56), JSON.stringify(co.stepCorners(a, b, opts)));
walls.push(W(100, 100, 200, 100));   // a wall that ends at the corner point (1,1)
step("a wall ends at the corner: blocked", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
walls[0] = W(100, 100, 200, 100, { door: 1, ds: 1 });
step("the same wall is an open door: open", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
walls.length = 0;
tiles.push({ document: { x: 91, y: 91, width: 18, height: 18, getFlag: () => true } });
step("a solid pillar Tile on the corner: blocked", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
tiles[0] = { document: { x: 130, y: 130, width: 40, height: 40, getFlag: () => true } };
step("a small solid Tile in the middle of a square: open", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
tiles[0] = { document: { x: 100, y: 100, width: 100, height: 100, getFlag: () => true } };
step("a solid Tile that fills the square beside: blocked", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
tiles[0] = { document: { x: 100, y: 100, width: 100, height: 100, getFlag: () => false } };
step("the same Tile, not marked solid: open", { i: 1, j: 0 }, { i: 0, j: 1 }, { solidAt: co.solidCorner });
tiles.length = 0;
const A = { name: "A" }, B = { name: "B" };
step("two creatures at the corner: Difficult Terrain", { i: 1, j: 0 }, { i: 0, j: 1 }, { creatureAt: c => (c.i === 0 && c.j === 0 ? A : c.i === 1 && c.j === 1 ? B : null) });
step("one creature at the corner: open", { i: 1, j: 0 }, { i: 0, j: 1 }, { creatureAt: c => (c.i === 0 && c.j === 0 ? A : null) });
step("a straight step: no corner", { i: 1, j: 0 }, { i: 1, j: 1 }, { solidAt: () => true });
step("a Large creature: each square it occupies", { i: 2, j: 0 }, { i: 1, j: 1 }, { w: 2, h: 2, solidAt: c => c.i === 2 && c.j === 2 });
const cAt = (a, b) => co.stepCorners({ i: a.di, j: a.dj }, { i: b.di, j: b.dj }, { solidAt: c => c.i === 1 && c.j === 1, creatureAt: () => null });
const diag = [{ di: 0, dj: 0 }, { di: 1, dj: 1 }, { di: 2, dj: 2 }];
const rc = mv.analyzePath(diag, 2, { wallBetween: () => false, creatureAt: () => null, cornerAt: cAt });
console.log("Pushed 2 diagonally into a solid corner:", `moves ${rc.done}, unused ${rc.unused}, damage ${JSON.stringify(rc.damage)}, corner ${rc.block?.corner}`);
const two = (a, b) => co.stepCorners({ i: a.di, j: a.dj }, { i: b.di, j: b.dj }, { creatureAt: c => ((c.i === 0 && c.j === 1) ? A : (c.i === 1 && c.j === 0) ? B : null) });
const rk = mv.analyzePath(diag, 2, { wallBetween: () => false, creatureAt: () => null, cornerAt: two });
console.log("Pushed 2 diagonally between two creatures:", `moves ${rk.done}, collision with ${rk.block?.token?.name}, damage ${JSON.stringify(rk.damage)}`);
const rr = mv.analyzePath(diag, 2, { wallBetween: () => false, creatureAt: () => null, cornerAt: two, throughCreatures: true });
console.log("an ability that passes creatures (throughCreatures) goes between them:", `moves ${rr.done}, block ${rr.block}`);
tokens.push({ id: "a", name: "Goblin A", actor: {}, document: { id: "a", x: 0, y: 0, width: 1, height: 1, disposition: -1, hidden: false } },
  { id: "b", name: "Goblin B", actor: {}, document: { id: "b", x: 100, y: 100, width: 1, height: 1, disposition: -1, hidden: false } });
const me = { id: "me", x: 0, y: 100, width: 1, height: 1, disposition: 1 };
console.log("Advance diagonally between two goblins:", JSON.stringify(mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }])), "| Cut Through ignores it:", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }], { ignoring: true }).cornerDT);
console.log("it costs 1 more square (v0.0.171: nothing added when our cost is in Foundry's ruler, which now counts it):", mv.extraCost({ extra: 0, cornerDT: 1 }, false, true), mv.extraCost({ extra: 1, cornerDT: 1 }, false, false), mv.extraCost({ extra: 1, cornerDT: 1 }, true, false));
tokens.length = 0; walls.push(W(100, 0, 100, 100));
console.log("Advance diagonally past the end of a wall:", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }]).solidCorner);
game.settings.get = () => false;   // v0.0.171: the setting "Solid corners for your own movement" is off (the default)
console.log("the same with the setting off (Foundry refuses it itself):", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }]).solidCorner, "| the setting:", src("module/twod12.mjs").includes('"ownMoveCorners", {') && /ownMoveCorners[\s\S]{0,600}default: false/.test(src("module/twod12.mjs")));
game.settings.get = () => true;
walls.length = 0;

console.log("--- the straight line: the moving creature chooses at a tie");
const line = (a, bb) => co.straightCells(a, bb).map(c => c.alt ? `${sq(c)}|${sq(c.alt)}` : sq(c)).join(" ");
console.log("A1 to G4:", line({ i: 0, j: 0 }, { i: 3, j: 6 }));   // the book's first figure: ties at B, D and F
console.log("A1 to H4:", line({ i: 0, j: 0 }, { i: 3, j: 7 }));   // the book's second figure: no tie
console.log("A1 to G4, ties taken as the book draws them:", co.chooseLine(co.straightCells({ i: 0, j: 0 }, { i: 3, j: 6 }), { prefer: new Set(["1,1", "2,3", "3,5"]) }).map(sq).join(" "));
console.log("A1 to G4, a tie square that is not legal is avoided:", co.chooseLine(co.straightCells({ i: 0, j: 0 }, { i: 3, j: 6 }), { legal: (p, c) => !(c.i === 0 && c.j === 1) }).map(sq).join(" "));
tokens.push({ id: "x", name: "Orc", actor: {}, document: { id: "x", x: 100, y: 0, width: 1, height: 1, disposition: -1, hidden: false } });
const runner = { id: "me", x: 0, y: 0, width: 1, height: 1, disposition: 1, actor: { system: { senses: {} } } };
console.log("Charge A1 to G4 with an Orc on B1: the line uses B2:", mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }).cells.map(sq).join(" "), "| ties:", mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }).ties);
console.log("a drag through B1 (not legal) still takes the legal B2:", mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }, [{ x: 100, y: 0 }]).cells.map(sq).slice(0, 3).join(" "));
console.log("with no Orc, a drag along row 1 is honored at every tie:", (tokens.length = 0, mv.chargeLine(runner, { x: 0, y: 0 }, { x: 600, y: 300 }, [{ x: 300, y: 100 }, { x: 500, y: 200 }]).cells.map(sq).join(" ")));
// v0.0.218: the Charge picker's path: the Line's squares on one side, the first square that isn't legal, where it stops.
tokens.push({ id: "x", name: "Orc", actor: {}, document: { id: "x", x: 300, y: 200, width: 1, height: 1, disposition: -1, hidden: false } });
for (const side of ["left", "right"]) { const p = mv.chargePath(runner, { i: 0, j: 0 }, { i: 3, j: 6 }, side); console.log(`Charge picker A1 to G4, ties ${side}:`, p.cells.map(sq).join(" "), "| ties", p.ties, "| first not legal:", p.bad >= 0 ? `${sq(p.cells[p.bad])} (${p.problem})` : "none"); }
tokens.length = 0;
const mvSrc = src("module/move.mjs");
console.log("Charge checks the chosen line square by square:", mvSrc.includes("export function chargePath(doc, a, b, side") && mvSrc.includes("chargeSquareProblem(doc, prev, cur, w, h)"));   // v0.0.218: the Charge picker

console.log("--- Haul");
const h = b.BASIC_ACTIONS.haul, lad = h.versions.map(v => `${v.ap}AP: ${[v.x1, v.x2, v.x3].map(x => (x.match(/pulled\|distance:(\d)/)?.[1] ?? "0")).join("/")}`).join(" | ");
console.log("Haul", lad, "|", h.traits.join("/"), "| vs", h.vs, "| distance", h.distance, "| round:", h.frequency === "round");
const me1 = { system: { size: 3, reach: 1 } }, me2 = { system: { size: 3, reach: 2 } }, gob = { system: { size: 3 } }, ogre = { system: { size: 5 } };
console.log("Reach 1:", cf.requirementProblem(h, me1, gob, { distance: 2 }) || "ok", "| Reach 2, target 2 away:", cf.requirementProblem(h, me2, gob, { distance: 2 }) || "ok", "| target next to you:", cf.requirementProblem(h, me2, gob, { distance: 1 }) || "ok", "| SR 5:", cf.requirementProblem(h, me2, ogre, { distance: 2 }) || "ok");
console.log("the Haul card's flavor:", b.basicItemData("haul").system.flavor);
console.log("--- @Move[pulled]");
const gen = await import(ROOTURL + "module/gen.mjs").catch(() => null);
console.log("the generator reads 'Pulled 3':", gen?.convertEffects ? gen.convertEffects("Pulled 3.") : src("module/gen.mjs").includes("(pushed|pulled|advance|walk|evade)"), "| words back:", src("module/genaction.mjs").includes("@Move\\[(pushed|pulled|slid|advance|evade|reposition)"));
console.log("the builder offers Pulled:", src("module/builder.mjs").includes('["pulled", "Pulled"]'), "| the button:", src("module/inline.mjs").includes('pulled: "Pulled"'), "| a defense tag:", src("module/defense.mjs").includes('tags.add("pulled")'), "| the flow:", mvSrc.includes('if (cfg.kind === "pulled") return pushFlow(cfg, ctx, "pull");'));

console.log("--- Squeezing");
const content = src("tools/content.mjs");
console.log("a condition with Vulnerable = half the level:", /cond\("Squeezing"[^\n]*mode: "halfLevel"/.test(content), "| the effect sets it:", src("module/effects.mjs").includes('r.mode === "halfLevel" ? Math.max(1, Math.ceil((Number(actor.system?.level) || 1) / 2))'), "| a status:", src("module/twod12.mjs").includes('["squeezing", CI("squeezing")]'));
const st = (...ids) => ({ statuses: new Set(ids) });
console.log("Doomed:", cf.unconsciousDoom(st("squeezing"), "body"), cf.doomStatus(st("squeezing")), "| levels 1-5:", [1, 2, 3, 4, 5].map(l => Math.max(1, Math.ceil(l / 2))).join(" "), "| nothing:", JSON.stringify(cf.doomStatus(st())));
console.log("--- v0.0.171: the movement label counts a diagonal between two creatures");
CONFIG.Token = { movement: { actions: { walk: { getCostFunction: () => (from, to, d) => d } } } };
console.log("installed:", mv.installDarknessCost().installed.join(", "));
tokens.push({ id: "a", name: "Goblin A", actor: {}, document: { id: "a", x: 0, y: 0, width: 1, height: 1, disposition: -1, hidden: false } },
  { id: "b", name: "Goblin B", actor: {}, document: { id: "b", x: 100, y: 100, width: 1, height: 1, disposition: -1, hidden: false } });
const walker = { id: "me", x: 0, y: 100, width: 1, height: 1, disposition: 1, actor: { system: { senses: { darkSight: true } } } };
const costFn = CONFIG.Token.movement.actions.walk.getCostFunction({ document: walker });
console.log("diagonal B1 -> A2 between the goblins:", costFn({ i: 1, j: 0 }, { i: 0, j: 1 }, 1), "| a diagonal away from them:", costFn({ i: 1, j: 0 }, { i: 2, j: 1 }, 1));
tokens.length = 0;
