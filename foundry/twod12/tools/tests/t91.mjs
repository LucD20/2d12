// Run with: node tools/tests/run.mjs (or node tools/tests/t91.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// Distances by the 1-2-1-2 rule, the edge of a light, an Action's Setup before the roll, and the kept Emanation.
const GS = 100, settings = { lightDimBelow: 0.7, lightDarkBelow: 0.4 };
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] } }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: {} };
globalThis.game = { settings: { get: (s, k) => settings[k] }, time: { worldTime: 0 }, user: { isGM: true, id: "u1" } };
globalThis.canvas = { grid: { size: GS }, effects: { lightSources: [], darknessSources: [] }, environment: { darknessLevel: 1 } };
const L = await import(ROOTURL + "module/light.mjs");
const tok = (col, row, w = 1, h = 1) => ({ document: { x: col * GS, y: row * GS, width: w, height: h } });
console.log("--- the distance between two tokens (adjacent is 1, every second diagonal counts 2)");
const here = tok(5, 5);
const row = (label, pairs) => console.log(label.padEnd(34), pairs.map(([c, r, book]) => { const d = L.tokenDistance(here, tok(5 + c, 5 + r)); return `(${c},${r}):${d}${d === book ? "" : " <-- the book says " + book}`; }).join("  "));
row("straight", [[1, 0, 1], [2, 0, 2], [5, 0, 5], [0, -3, 3]]);
row("one diagonal", [[1, 1, 1], [-1, 1, 1]]);
row("knight steps", [[2, 1, 2], [3, 1, 3], [3, 2, 4], [4, 1, 4], [4, 3, 5]]);
row("two diagonals (1, then 2)", [[2, 2, 3], [-2, 2, 3], [-2, -2, 3]]);
row("three and four diagonals", [[3, 3, 4], [4, 4, 6]]);
console.log("a 2x2 creature and a Medium one: next to each other", L.tokenDistance(tok(5, 5, 2, 2), tok(7, 6)), "| a square apart", L.tokenDistance(tok(5, 5, 2, 2), tok(8, 6)), "| diagonal corner", L.tokenDistance(tok(5, 5, 2, 2), tok(7, 7)), "| two diagonals from its corner", L.tokenDistance(tok(5, 5, 2, 2), tok(8, 8)), "| sharing a square", L.tokenDistance(here, tok(5, 5)));
console.log("a Huge 3x3 and a Medium creature: next to it", L.tokenDistance(tok(2, 2, 3, 3), tok(5, 3)), "| 3 squares from its edge", L.tokenDistance(tok(2, 2, 3, 3), tok(7, 3)));
console.log("--- the edge of a light (Bright 2 and Dim 4 squares, the light in the middle of a square)");
const sx = 550, sy = 550;
canvas.effects.lightSources = [{ active: true, data: { x: sx, y: sy, bright: 2 * GS, dim: 4 * GS }, shape: { contains: (x, y) => Math.hypot(x - sx, y - sy) < 4 * GS - 1e-9 } }];   // a shape that leaves out its exact edge
const at = (dx, dy) => L.lightAt({ x: sx + dx * GS, y: sy + dy * GS });
console.log("2 straight out (the Bright edge):", at(2, 0), "| 4 straight out (the Dim edge):", at(4, 0), at(-4, 0), at(0, 4), at(0, -4), "| 5 out:", at(5, 0), "| 2 out and 1 to the side:", at(2, 1), "| 3 out and 3 to the side:", at(3, 3), "| 4 and 1 to the side:", at(4, 1));
let bright = 0, dim = 0, dark = 0;
for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const l = at(j, i); if (l === "bright") bright++; else if (l === "dim") dim++; else dark++; }
console.log("squares lit by the rules: Bright", bright, "(13) | Dim", dim, "(36 more)");
// ---------------------------------------------------------------- Setup
console.log("--- Setup");
const S = await import(ROOTURL + "module/setup.mjs");
const cut = "Evade up to 2 (@Move[evade|distance:2]). During this Evade you can move through the space of any creature.";
console.log("the card after the movement was made:", JSON.stringify(S.setupFor(cut, true)));
console.log("the card when it was not:", JSON.stringify(S.setupFor(cut, false) === cut));
console.log("a button without parentheses:", JSON.stringify(S.setupFor("Advance @Move[advance|distance:2] first.", true)), "| no Move at all:", JSON.stringify(S.setupFor("You shed light.", true)), "| nothing:", JSON.stringify(S.setupFor(undefined, true)));
const log = [];
const world = (pick, granted = true) => ({ handleMove: async (cfg, ctx) => { log.push(`move ${cfg.kind} ${cfg.distanceExpr ?? cfg.distance} self:${cfg.traits.includes("self")} for ${ctx.actor.name} token ${ctx.token?.id}`); return typeof granted === "function" ? granted(cfg) : granted; }, finish: async () => log.push("end the free movement"), dialog: async o => { log.push(`dialog "${o.window.title}": ${o.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`); return typeof pick === "function" ? pick() : pick; } });
const actor = { name: "Kai" }, token = { id: "t1" };
const item = setup => ({ name: "Cut Through", system: { setup } });
const run = async (label, setup, deps) => { log.length = 0; const r = await S.runSetup(actor, item(setup), token, deps); console.log(label.padEnd(40), JSON.stringify(r), "|", log.join(" | ") || "(nothing happened)"); };
await run("no Setup", "", world("go"));
await run("a Setup that is only text", "You shed light for a round.", world("go"));
await run("an Evade; Continue", cut, world("go"));
await run("an Evade; Cancel the Action", cut, world("cancel"));
await run("an Evade; the window is closed", cut, world(undefined));
await run("the movement is refused (not in combat)", cut, world("go", false));
await run("an Advance", "Advance up to 2 (@Move[advance|distance:2]).", world("go"));
await run("Charge and Pushed tags are not a Setup", "(@Move[charge|distance:6]) (@Move[pushed|2])", world("go"));
await run("two movements", "Advance up to 1 (@Move[advance|distance:1]), then Evade up to 1 (@Move[evade|distance:1]).", world("go"));
let n = 0; await run("two movements; Cancel on the second", "Advance up to 1 (@Move[advance|distance:1]), then Evade up to 1 (@Move[evade|distance:1]).", world(() => (++n === 1 ? "go" : "cancel")));
await run("the first refused, the second granted", "Advance up to 1 (@Move[advance|distance:1]), then Evade up to 1 (@Move[evade|distance:1]).", world("go", cfg => cfg.kind === "evade"));
// the order of things in useAction: the Setup comes before the Area is placed and before the roll modifiers are worked out
const code = fs.readFileSync(ROOT + "module/actions.mjs", "utf8");
const pos = k => code.indexOf(k);
console.log("in useAction: Setup before the Area:", pos("runSetup(") < pos("startTemplate("), "| before the modifiers (damageSteps; v0.0.439: buildPreviews retired):", pos("runSetup(") < pos("const steps = damageSteps("), "| after the checks of Prone and Immobilized:", pos("runSetup(") > pos("is Prone and can't Evade"), "| the card takes the movement button out:", code.includes("setupFor(it.setup, setupDone)"));
// ---------------------------------------------------------------- the kept Emanation
console.log("--- a kept Emanation");
const tpl = fs.readFileSync(ROOT + "module/template.mjs", "utf8");
console.log("no native Emanation shape any more (it used a field that is called radius, and failed every time):", !/type:\s*"emanation"/.test(tpl) && !/distance:\s*dist/.test(tpl), "| the Region is made of the placed squares:", tpl.includes("tryCreate(shapesForCells(placed.cells, cTL, size()))"));
