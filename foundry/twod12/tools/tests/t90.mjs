// Run with: node tools/tests/run.mjs (or node tools/tests/t90.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Darkness as Difficult Terrain on a path, Release, and the editable date of the World Clock.
const GS = 100, settings = { lightDimBelow: 0.7, lightDarkBelow: 0.4 }, notes = [], dialogs = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info: m => notes.push("info: " + m), warn: m => notes.push("warn: " + m), error: m => notes.push("error: " + m) } };
let pick = null;
globalThis.foundry = { applications: { api: { DialogV2: { wait: async o => { dialogs.push(o.buttons.map(b => b.label)); return pick; }, confirm: async () => true }, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.__twod12Pick = o => { const m = o.model(); dialogs.push((m.sections ?? []).flatMap(x => (x.rows ?? []).flatMap(r => r.opts.map(y => y.l)))); return pick; };   // v0.0.415: the pick window (was DialogV2.wait)
globalThis.game = { settings: { get: (s, k) => settings[k] }, time: { worldTime: 0 }, user: { isGM: true, isActiveGM: true, id: "u1", targets: new Set() }, i18n: { localize: s => s } };
const tokens = [];
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }) }, tokens: { placeables: tokens, controlled: [] }, environment: { darknessLevel: 0 }, effects: { darknessSources: [], lightSources: [] } };
const M = await import(ROOTURL + "module/move.mjs");
const mk = (id, col, row, disp, senses = {}, w = 1) => { const actor = { name: id, system: { senses } }; const t = { name: id, actor, document: { id, x: col * GS, y: row * GS, width: w, height: w, disposition: disp, hidden: false, actor } }; tokens.push(t); return t; };
const me = mk("Kai", 0, 0, 1);
const show = (label, pts, doc = me.document) => { const r = M.creaturesOnPath(doc, pts); console.log(label.padEnd(66), `dark ${r.dark}, extra ${r.extra}${r.through.length ? ", through " + r.through.join("+") : ""}`); };
const P = (col, row) => ({ x: col * GS, y: row * GS });
console.log("--- the scene's light");
show("(a move that goes nowhere enters nothing)", [P(0, 0), P(0, 0)]);
canvas.environment.darknessLevel = 0; show("Bright scene, 3 squares", [P(0, 0), P(3, 0)]);
canvas.environment.darknessLevel = 1; show("Darkness scene, 3 squares (the 3 squares it enters)", [P(0, 0), P(3, 0)]);
show("Darkness scene, 1 square", [P(0, 0), P(1, 0)]);
me.actor.system.senses = { darksight: true }; show("Darkness scene, with Dark Sight", [P(0, 0), P(3, 0)]);
me.actor.system.senses = { dimlight: true }; show("Darkness scene, with only Dim-light Sight", [P(0, 0), P(3, 0)]);
me.actor.system.senses = {};
canvas.environment.darknessLevel = 0.5; show("Dim scene (light 0.5): Dim is not Darkness", [P(0, 0), P(3, 0)]);
console.log("--- light sources and magical darkness");
canvas.environment.darknessLevel = 1;
canvas.effects.lightSources = [{ active: true, data: { x: 150, y: 50, bright: 120, dim: 260 }, shape: { contains: () => true } }];
show("A torch at square 1: bright to 1.2 squares, dim to 2.6 (the dark scene)", [P(0, 0), P(5, 0)]);
canvas.effects.lightSources = []; canvas.environment.darknessLevel = 0;
canvas.effects.darknessSources = [{ active: true, shape: { contains: (x, y) => x > 120 && x < 330 } }];
show("Magical darkness over squares 1-2 in a bright scene (the path is 5 long)", [P(0, 0), P(5, 0)]);
me.actor.system.senses = { darksight: true }; show("... and Dark Sight sees through it", [P(0, 0), P(5, 0)]); me.actor.system.senses = {};
canvas.effects.darknessSources = [];
console.log("--- with creatures");
canvas.environment.darknessLevel = 1;
const orc = mk("Orc", 2, 0, -1); show("Dark scene, an enemy on square 2 (its square is Difficult once, not twice)", [P(0, 0), P(4, 0)]);
const friend = mk("Friend", 3, 0, 1); orc.document.disposition = 1; friend.document.disposition = 1; show("Dark scene, only friends on the way (willing)", [P(0, 0), P(4, 0)]);
tokens.splice(1);
console.log("--- a Large creature (2x2)");
const big = mk("Ogre", 0, 4, 1, {}, 2);
show("Dark scene, a 2x2 creature moves 3 squares", [P(0, 4), P(3, 4)], big.document);
canvas.environment.darknessLevel = 0; show("Bright scene, the same move", [P(0, 4), P(3, 4)], big.document);
console.log("--- if the light lookup fails, the enemy squares still count");
canvas.environment.darknessLevel = 0.9; mk("Orc", 2, 0, -1); const okGrid = canvas.grid.getCenterPoint; canvas.grid.getCenterPoint = () => { throw new Error("boom"); };
const w = console.warn; console.warn = () => {}; show("the grid fails to give a square's center: no darkness, but the enemy still counts", [P(0, 0), P(4, 0)]); console.warn = w;
canvas.grid.getCenterPoint = okGrid;
// ------------------------------------------------------------------ Difficult Terrain in Foundry's own cost (the ruler)
console.log("\n--- the cost function (the ruler)");
{
  tokens.splice(0, tokens.length, me); me.actor.system.senses = {}; canvas.environment.darknessLevel = 0;
  const plain = (f, t, step) => step;   // Foundry's own cost: the distance
  class FakeTokenDocument { constructor(actor) { this.actor = actor; } getMovementCostFunction() { return plain; } }
  CONFIG.Token = { documentClass: FakeTokenDocument, objectClass: class FakeToken {}, rulerClass: class FakeRuler { _getWaypointLabelContext() {} }, movement: { actions: { walk: { getCostFunction: () => plain }, fly: { getCostFunction: () => (cost, f, t, d) => cost }, crawl: { label: "has none" }, blink: { label: "a teleport", teleport: true } } } };
  console.log("before:", M.rulerCountsDifficult);
  const r = M.installDarknessCost(); console.log("installed:", JSON.stringify(r.installed), "| counts Difficult Terrain:", M.rulerCountsDifficult, "| the teleport action is left alone:", CONFIG.Token.movement.actions.blink.getCostFunction === undefined);
  const step = (to, token = me, step = 1, action = "walk") => CONFIG.Token.movement.actions[action].getCostFunction(token)({ i: 0, j: 0 }, to, step);
  console.log("bright scene, empty square:", step({ i: 0, j: 1 }));
  const fromAction = (to, action = "fly", base = 1, d = 1) => CONFIG.Token.movement.actions[action].getCostFunction(me)(base, { i: 0, j: 0 }, to, d);
  console.log("the other shape, (cost, from, to, distance): bright", fromAction({ i: 0, j: 1 }), "| an action with no cost function of its own:", fromAction({ i: 0, j: 1 }, "crawl"));
  canvas.environment.darknessLevel = 1;
  console.log("... in the dark:", fromAction({ i: 0, j: 1 }), "| the crawl action:", fromAction({ i: 0, j: 1 }, "crawl"), "| a base cost of 3 over a distance of 1 stays 3:", fromAction({ i: 0, j: 1 }, "fly", 3), "| distance 5, base 5:", fromAction({ i: 0, j: 1 }, "fly", 5, 5));
  console.log("dark scene:", step({ i: 0, j: 1 }), "| 5-foot squares:", step({ i: 0, j: 1 }, me, 5), "| given the document instead of the token:", step({ i: 0, j: 1 }, me.document), "| with Dark Sight:", (me.actor.system.senses = { darksight: true }, step({ i: 0, j: 1 })), "| no creature:", step({ i: 0, j: 1 }, { document: { id: "x", width: 1, height: 1 } }));
  me.actor.system.senses = {}; canvas.environment.darknessLevel = 0;
  console.log("--- unwilling creatures (the ruler counts them too)");
  const orc = mk("Orc", 2, 0, -1), pal = mk("Pal", 3, 0, 1), ghost = mk("Ghost", 4, 0, -1); ghost.document.hidden = true;
  console.log("a square with an enemy:", step({ i: 0, j: 2 }), "(as an action:", fromAction({ i: 0, j: 2 }) + ")", "| with a friend (willing):", step({ i: 0, j: 3 }), "| a hidden token:", step({ i: 0, j: 4 }), "| an empty square next to it:", step({ i: 0, j: 1 }));
  canvas.environment.darknessLevel = 1; console.log("an enemy in the dark: counts double, not four times:", step({ i: 0, j: 2 }));
  canvas.environment.darknessLevel = 0;
  // v0.0.453 (Lucas, playtest 6): Foundry gives the square of the token's center (1,2 for a 2x2 whose top left is 0,1)
  const big = mk("Ogre", 0, 6, 1, {}, 2); console.log("a 2x2 creature (v0.0.468: its steps read as Foundry gives them, the center until a drag's first step says):", step({ i: 1, j: 2 }, big, 1), "(its squares are at 0,1 and 0,2: the Orc is on 0,2)", "| one step away from it:", step({ i: 1, j: 6 }, big, 1));
  const again = M.installDarknessCost(); console.log("installing again does not wrap twice:", JSON.stringify(again.installed), "| an enemy square still costs", step({ i: 0, j: 2 }));
  console.log("a base cost that is already double stays double:", (CONFIG.Token.movement.actions.walk.getCostFunction = Object.assign(() => (f, t, s) => 2 * s, {}), M.installDarknessCost(), step({ i: 0, j: 2 })));
  // the other place: a Token or TokenDocument method that ends in CostFunction
  CONFIG.Token = { documentClass: FakeTokenDocument, objectClass: class FakeToken2 {}, movement: { actions: {} } };
  const viaDoc = M.installDarknessCost(); canvas.environment.darknessLevel = 1;
  console.log("through a TokenDocument method:", JSON.stringify(viaDoc.installed), "| a dark step costs", new FakeTokenDocument(me.actor).getMovementCostFunction()({ i: 0, j: 0 }, { i: 0, j: 1 }, 1));
  class Broken { constructor(a) { this.actor = a; } getMovementCostFunction() { return 7; } }
  CONFIG.Token = { documentClass: Broken, movement: { actions: { walk: { getCostFunction: () => 9 } } } }; M.installDarknessCost();
  console.log("a method that doesn't return a function is left alone:", new Broken(me.actor).getMovementCostFunction(), CONFIG.Token.movement.actions.walk.getCostFunction());
  console.log("--- a setting that Foundry has locked (as in your Foundry: the property is read-only)");
  {
    const dark = () => { canvas.environment.darknessLevel = 1; const v = CONFIG.Token.movement.actions.walk.getCostFunction(me)({ i: 0, j: 0 }, { i: 0, j: 1 }, 1); canvas.environment.darknessLevel = 0; return v; };
    const report = (label, r) => console.log(label.padEnd(58), "→", JSON.stringify(r.how), "| a dark step costs", dark(), "| counts:", M.rulerCountsDifficult, Object.keys(r.failed).length ? "| failed: " + JSON.stringify(r.failed) : "");
    const lockedProp = () => { const c = { label: "Walk" }; Object.defineProperty(c, "getCostFunction", { value: () => plain, writable: false, configurable: true, enumerable: true }); return c; };
    CONFIG.Token = { movement: { actions: { walk: lockedProp(), fly: { getCostFunction: () => plain } } } };
    report("the property is read-only but can be defined", M.installDarknessCost());
    CONFIG.Token = { movement: { actions: { walk: Object.freeze({ label: "Walk", getCostFunction: () => plain }), fly: { getCostFunction: () => plain } } } };
    report("the action is frozen (the other action is not)", M.installDarknessCost());
    CONFIG.Token = { movement: { actions: Object.freeze({ walk: Object.freeze({ label: "Walk", getCostFunction: () => plain }) }) } };
    report("the action and the actions are frozen", M.installDarknessCost());
    CONFIG.Token = { movement: Object.freeze({ actions: Object.freeze({ walk: Object.freeze({ label: "Walk", getCostFunction: () => plain }) }) }) };
    report("the whole movement settings are frozen", M.installDarknessCost());
    CONFIG.Token = Object.freeze({ movement: Object.freeze({ actions: Object.freeze({ walk: Object.freeze({ label: "Walk", getCostFunction: () => plain }) }) }) });
    const stuck = M.installDarknessCost(); console.log("everything frozen, even CONFIG.Token:".padEnd(58), "→ installed", JSON.stringify(stuck.installed), "| counts:", M.rulerCountsDifficult, "| failed:", JSON.stringify(stuck.failed), "| hints:", JSON.stringify(stuck.hints));
    CONFIG.Token = { movement: { actions: { walk: Object.freeze({ label: "Walk", getCostFunction: () => plain }), crawl: { label: "none" } } } };
    const mixed = M.installDarknessCost(); console.log("one action locked in the way above, one fine: both attach:", JSON.stringify(mixed.how));
  }
  console.log("--- Foundry with nothing to attach to");
  CONFIG.Token = { documentClass: class NoCost { measureThings() {} getTerrainDifficulty() {} }, objectClass: class T2 { _onDragLeftMove() {} }, rulerClass: class R { _getWaypointLabelContext() {} _getSegmentStyle() {} }, movement: { actions: { walk: { label: "Walk" } }, defaultAction: "walk" } };
  const none = M.installDarknessCost(); console.log("installed:", JSON.stringify(none.installed), "| counts:", M.rulerCountsDifficult, "| what it reports for the developer:", JSON.stringify(none.hints));
  const logs = []; const lg = console.log; console.log = (...a) => logs.push(a.join(" ")); M.rulerInfo(); console.log = lg;
  console.log("the console line is plain text to copy:", /^twod12 \| ruler \{/.test(logs.at(-1)) && JSON.parse(logs.at(-1).replace("twod12 | ruler ", "")).hints.rulerClass, "| notice:", notes.pop().slice(0, 70) + "...");
  delete CONFIG.Token;
  const way = { extra: 5 };
  console.log("squares added to the measured cost:", JSON.stringify({ "the ruler counts them": M.extraCost(way, false, true), "the ruler counts them, Foundry found terrain": M.extraCost(way, true, true), "not counted, Foundry found terrain": M.extraCost(way, true, false), "not counted, none found": M.extraCost(way, false, false) }));
  tokens.splice(1);
}
// ------------------------------------------------------------------ Release
console.log("\n--- Release");
const { handleInline } = await import(ROOTURL + "module/inline.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
const { apLabel } = await import(ROOTURL + "module/config.mjs");
const r = BASIC_ACTIONS.release;
console.log("the Basic Action:", r.name, "| traits", r.traits.join("/"), "| cost label:", apLabel([r.versions[0].ap]).replace(/<[^>]+>/g, ""), "| text:", r.versions[0].effects.replace(/@Release\[weapon\]/, "[button]").slice(0, 80) + "...", "| other costs:", apLabel([1]).replace(/<[^>]+>/g, ""), apLabel([1, 2, 3]).replace(/<[^>]+>/g, ""));
const mkW = (id, name, wielded, hands) => { const w = { id, name, system: { wielded, hands }, async update(u) { for (const [k, v] of Object.entries(u)) w.system[k.replace("system.", "")] = v; } }; return w; };
const sword = mkW("s", "Greatsword", true, 2), dagger = mkW("d", "Dagger", true, 1), bow = mkW("b", "Bow", false, 2);
const actor = { name: "Kai", isOwner: true, itemTypes: { weapon: [sword, dagger, bow] }, items: { get: id => [sword, dagger, bow].find(x => x.id === id) } };
canvas.tokens.controlled = [{ actor }];
const state = () => `${sword.name}: ${sword.system.wielded ? sword.system.hands + " hand(s)" : "not held"}, ${dagger.name}: ${dagger.system.wielded ? "held" : "not held"}`;
await handleInline("Release", {}, {}); console.log("the choices offered:", JSON.stringify(dialogs.pop()));
pick = "one:s"; await handleInline("Release", {}, {}); console.log("hold the Greatsword with one hand →", state(), "|", notes.pop());
dialogs.length = 0; await handleInline("Release", {}, {}); console.log("then the choices:", JSON.stringify(dialogs.pop()), "(the Bow, which is not held, is never offered)");
pick = "drop:d"; await handleInline("Release", {}, {}); console.log("drop the Dagger →", state(), "|", notes.pop());
pick = null; await handleInline("Release", {}, {}); console.log("closing the dialog changes nothing →", state());
sword.system.wielded = false; dagger.system.wielded = false; notes.length = 0; await handleInline("Release", {}, {}); console.log("nothing held:", notes.pop());
canvas.tokens.controlled = []; game.user.character = null; notes.length = 0; await handleInline("Release", {}, {}); console.log("no token:", notes.pop());
// ------------------------------------------------------------------ the date of the clock
console.log("\n--- Set the date");
const C = await import(ROOTURL + "module/clock.mjs");
const names = ["Deepwinter", "Claw", "Alturiak", "Ches", "Tarsakh", "Mirtul", "Kythorn", "Flamerule", "Eleasis", "Eleint", "Marpenoth", "Uktar"];
game.time.calendar = { years: { yearZero: 1490 }, months: { values: names.map(n => ({ name: n, days: 30 })) }, days: { values: [{ name: "Day" }] },
  timeToComponents: t => { const s = Math.floor(t), d = Math.floor(s / 86400), tod = s % 86400; return { year: Math.floor(d / 360), month: Math.floor((d % 360) / 30), dayOfMonth: d % 30, dayOfWeek: 0, hour: Math.floor(tod / 3600), minute: Math.floor((tod % 3600) / 60), second: tod % 60 }; },
  componentsToTime: c => ((c.year * 360 + c.month * 30 + c.dayOfMonth) * 86400) + c.hour * 3600 + c.minute * 60 + c.second };
const t0 = (3 * 360 + 4 * 30 + 6) * 86400 + 14 * 3600 + 5 * 60 + 9;
const f = C.dateFields(t0); console.log("the fields now:", JSON.stringify({ year: f.year, month: f.month, monthName: f.months[f.month], day: f.day, time: f.time, months: f.months.length }));
const back = C.timeFromFields({ year: f.year, month: f.month, day: f.day, time: f.time }); console.log("the same date gives the same time back:", back.time === t0);
console.log("1 Flamerule 1493 at 08:30:", C.timeFromFields({ year: 1493, month: 7, day: 1, time: "08:30" }).time === (3 * 360 + 7 * 30) * 86400 + 8 * 3600 + 30 * 60, "| a year later:", C.timeFromFields({ year: 1494, month: 4, day: 7, time: "14:05:09" }).time - t0 === 360 * 86400, "| a day earlier:", C.timeFromFields({ year: 1493, month: 4, day: 6, time: "14:05:09" }).time - t0 === -86400);
for (const bad of [{ year: 1493, month: 1, day: 31, time: "10:00" }, { year: 1493, month: 1, day: 0, time: "10:00" }, { year: 1493, month: 1, day: 5, time: "25:00" }, { year: 1493, month: 1, day: 5, time: "soon" }, { year: "abc", month: 1, day: 5, time: "10:00" }, { year: 1493, month: 1, day: "x", time: "10:00" }]) console.log("refused:", JSON.stringify(bad), "→", C.timeFromFields(bad).error);
delete game.time.calendar;
const g = C.dateFields(2 * 86400 + 3 * 3600 + 7 * 60 + 5); console.log("with no calendar:", JSON.stringify({ year: g.year, day: g.day, time: g.time }), "| Day 5 at 06:00 →", C.timeFromFields({ year: null, day: 5, time: "06:00" }).time === 4 * 86400 + 6 * 3600);
game.time.calendar = { years: {}, months: { values: [] }, timeToComponents: () => null }; console.log("a calendar that can't convert:", C.dateFields(100).year === null ? "falls back to days" : "?");
game.time.calendar = { years: { yearZero: 0 }, months: { values: [{ name: "M", days: 30 }] }, timeToComponents: () => ({ year: 1, month: 0, dayOfMonth: 0, hour: 0, minute: 0, second: 0 }) }; console.log("a calendar without componentsToTime:", C.timeFromFields({ year: 1, month: 0, day: 1, time: "00:00" }).error);
