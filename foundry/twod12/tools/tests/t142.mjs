// Run with: node tools/tests/run.mjs (or node tools/tests/t142.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.174 (pack M2, movement B): the path tool for Slid and Reposition, Immobilized's DC, Steadiness bonuses, Relocate within Reach.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: c => c }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const mv = await import(ROOTURL + "module/move.mjs"), df = await import(ROOTURL + "module/defense.mjs"), b = await import(ROOTURL + "module/basic.mjs"), hz = await import(ROOTURL + "module/hazard.mjs");

console.log("--- the path tool: each square next to the previous one, within the value");
const path = [{ di: 0, dj: 0 }, { di: -1, dj: -1 }];
for (const [label, next, N] of [["next to the last (west)", { di: -1, dj: -2 }, 3], ["a jump of 2", { di: -1, dj: 1 }, 3], ["back on the path", { di: 0, dj: 0 }, 3], ["the value is used up", { di: -1, dj: -2 }, 1]])
  console.log(label.padEnd(26), JSON.stringify(mv.pathStepProblem(path, next, N)));
console.log("--- Slid and Reposition along a path");
const slid = [{ di: 0, dj: 0 }, { di: -1, dj: -1 }, { di: -1, dj: -2 }, { di: -1, dj: -3 }];
const none = { wallBetween: () => false, creatureAt: () => null };
const show = (label, opts) => { const r = mv.analyzePath(slid, 3, { ...none, ...opts }); console.log(label.padEnd(52), `moves ${r.done}, block ${r.block?.type ?? "-"}, unused ${r.unused}, damage ${JSON.stringify(r.damage)}`); };
show("Slid 3, nothing in the way (the book's goblin)", {});
show("Slid 3, a creature on the 3rd square", { creatureAt: s => (s.dj === -3 ? { name: "Dave" } : null) });
show("Reposition 3, the same creature: stops, no damage", { creatureAt: s => (s.dj === -3 ? { name: "Dave" } : null), damageless: true });
show("Slid 3, Line of Effect lost at the 2nd square", { loeAt: s => s.dj > -2 });
show("Slid 3, a wall before the 2nd square", { wallBetween: (a, c) => c.dj === -2 });
console.log("--- Immobilized");
for (const [label, o] of [["no roll (a Setup, a Feature)", {}], ["rolled 15 vs DC 14", { rolls: true, total: 15, dc: 14 }], ["rolled 14 vs DC 14", { rolls: true, total: 14, dc: 14 }], ["rolled 12 vs DC 14", { rolls: true, total: 12, dc: 14 }], ["a Save Action, origin rolls 16 vs 15", { save: true, saveTotal: 16, dc: 15 }], ["a Save Action, origin rolls 9 vs 15", { save: true, saveTotal: 9, dc: 15 }]])
  console.log(label.padEnd(38), JSON.stringify(mv.immobilizedOutcome(o)));
const eff = (st, dc) => ({ statuses: new Set(st), getFlag: (s, k) => (k === "immobileDc" ? dc : undefined) });
console.log("the Immobilized DC: two conditions 13 and 15:", mv.immobilizedDc({ effects: [eff(["immobilized"], 13), eff(["immobilized"], 15), eff(["prone"], 20)] }), "| one with no DC stored:", mv.immobilizedDc({ effects: [eff(["immobilized"], undefined)] }));
console.log("stored when applied (11 + the origin's Modifier, 13 without):", src("module/effects.mjs").includes('immobileDc: origin?.actorUuid && Number.isFinite(origin?.mod) ? 11 + origin.mod : TWOD12.baseDC'),
  "| the card keeps its result:", src("module/actions.mjs").includes("total: chk?.total ?? null,") && src("module/actions.mjs").includes("total: r.chk.total }))"),
  "| checked before Steadiness:", src("module/move.mjs").indexOf("immobilizedOutcome({ rolls:") < src("module/move.mjs").indexOf("await pushOne(origin, t, distanceFor(cfg, ctx, t, N), mode, { withinReach"));
console.log("--- Steadiness with bonuses");
const actor = (steady, feats = [], fx = []) => ({ system: { steadiness: steady }, itemTypes: { feature: feats.map(([name, bonus, attr = "steadiness"]) => ({ name, system: { defenses: [{ attr, bonus }] } })) }, effects: fx.map(([name, bonus, kind = "steadiness"]) => ({ name, getFlag: (s, k) => (k === "defenses" ? [{ kind, bonus }] : undefined) })), items: [] });
for (const [label, a] of [["Dwarf 1", actor(1)], ["Dwarf 1 + a Feature +1", actor(1, [["Rooted", 1]])], ["0 + an effect +2 and a Feature +1 (the highest)", actor(0, [["Rooted", 1]], [["Stone Skin (EoT)", 2]])], ["1 + an effect -2 (never below 0)", actor(1, [], [["Slippery", -2]])], ["0 + a bonus to every Defense (doesn't count)", actor(0, [["Shield", 1, "all"]], [["Ward", 1, "all"]])]])
  { const st = df.steadinessOf(a); console.log(label.padEnd(50), `${st.total} (base ${st.base}${st.parts.map(p => `, ${p.name} ${p.bonus}`).join("")})`); }
console.log("a Defense setting can be of the kind Steadiness:", src("module/config.mjs").includes('steadiness: "Steadiness (being moved)" }'), "| the side tile shows it:", src("module/actor-sheets.mjs").includes('tile("Steady", steadinessOf(a).total'));
console.log("--- Relocate keeps the target within your Reach; Reposition avoids Hazardous Terrain");
console.log("Relocate's buttons:", b.BASIC_ACTIONS.relocate.versions.map(v => [v.x1, v.x2, v.x3].filter(x => x.includes("@Move")).map(x => x.match(/\[(.*)\]/)[1]).join(" ")).join(" | "));
console.log("the button option reach:yes:", src("module/inline.mjs").includes('else if (key === "reach") cfg.withinReach = yes(val);'), "| older Relocate copies are replaced:", src("module/basic.mjs").includes('!JSON.stringify(i.system.versions ?? []).includes("reach:yes")'));
const region = (cells, on = true) => ({ getFlag: (s, k) => (k === "ht" ? { cells } : null), behaviors: on ? [] : [{ type: "hazard", disabled: true }] });
console.log("a square in Hazardous Terrain:", hz.hazardIn([{ i: 2, j: 3 }], { regions: [region(["2,3"])] }), "| outside it:", hz.hazardIn([{ i: 2, j: 4 }], { regions: [region(["2,3"])] }), "| a switched-off area:", hz.hazardIn([{ i: 2, j: 3 }], { regions: [region(["2,3"], false)] }));
console.log("--- @Move[slid]");
const gen = await import(ROOTURL + "module/gen.mjs");
console.log("the generator reads 'Slid 2':", gen.convertEffects("Slid 2."), "| the button:", src("module/inline.mjs").includes('slid: "Slid"'), "| the flow:", src("module/move.mjs").includes('if (cfg.kind === "slid") return pushFlow(cfg, ctx, "slid");'), "| the builder:", src("module/builder.mjs").includes('slid: "Slid (forced movement, a path)"'));
console.log("--- v0.0.175: the path is one movement, and the reachable squares are shown");
console.log("waypoints of the book's Slid (1 NW, 1 W) from (500, 300), grid 100:", JSON.stringify(mv.pathWaypoints({ x: 500, y: 300 }, [{ di: 0, dj: 0 }, { di: -1, dj: -1 }, { di: -1, dj: -2 }], 100)));
const ms = src("module/move.mjs");
console.log("one movement with waypoints (TokenDocument#move):", ms.includes('if (typeof doc.move === "function")') && ms.includes("await moveAlong(target.document, pick.path.slice(0, result.done + 1));"), "| a player's move goes to the GM in one message:", ms.includes('type: "pushPath"'), "| the area is drawn:", ms.includes("const r = analyze(path), area = reachable();"));
