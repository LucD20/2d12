// Run with: node tools/tests/run.mjs (or node tools/tests/t141.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.172 (pack Q, quick UI): the Steadiness tile always shown, a custom Steadiness in the Builder, the restyled Damage Instance dialog,
// the Cover height Snapshot, the Talent's Traits drop-down, and the Show help box of the Action and Talent sheets.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: c => c } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const { NpcData } = await import(ROOTURL + "module/data.mjs"), { npcBuilderContext } = await import(ROOTURL + "module/npcbuilder.mjs");
const hc = await import(ROOTURL + "module/heightcover.mjs");

console.log("--- the Steadiness tile");
const sheets = src("module/actor-sheets.mjs");
console.log("Movement is always 4 tiles:", sheets.includes('{ key: "move", title: "Movement", cols: 4, tiles: ['), "| Steady even at 0:", sheets.includes('tile("Steady", s.steadiness ?? 0, s.steadiness ?? 0,'), "| 4 columns of small squares:", src("styles/system.css").includes(".np-grid.n4 { grid-template-columns: repeat(4, minmax(0, 1fr));"));

console.log("--- a custom Steadiness in the Builder tab");
const mk = (sys, flags = {}) => { const m = Object.create(NpcData.prototype); Object.assign(m, { level: 1, damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, custom: { body: 0, mind: 0, appeal: 0, instinct: 0, bodyHealth: 10, mindHealth: 10 }, armorDef: 13, wardDef: 13,
  weaponAttribute: "body", powerAttribute: "mind", speed: 5, reachBase: 1, armor: "medium", bodyWounds: 0, mindWounds: 0, role: "standard", ratings: {}, steadiness: 0, parent: { type: "npc", items: [], itemTypes: { armor: [] } }, ...sys }); m.prepareDerivedData();
  return { system: m, getFlag: (s, k) => flags[k] }; };
const row = a => npcBuilderContext(a).groups.find(g => g.title === "Steadiness").rows[0];
const show = (label, a) => { const r = row(a); console.log(label.padEnd(34), `${r.chips.map(c => c.label + (c.on ? "*" : "") + (c.click === "custom" ? "(c)" : "")).join(" ")} | custom ${r.custom} | input ${JSON.stringify(r.input)} | ${r.warn || "-"} | ${r.how}`); };
show("Steadiness 2", mk({ steadiness: 2 }));
show("Steadiness 2, Custom", mk({ steadiness: 2 }, { steadyCustom: true }));
show("Steadiness 6 (typed)", mk({ steadiness: 6 }));
console.log("the button that is on switches to Custom:", sheets.includes('if (target.dataset.rating === "custom") return this.actor.setFlag("twod12", "steadyCustom", true);'), "| a number clears it:", sheets.includes('"flags.twod12.steadyCustom": false'));

console.log("--- the Damage Instance dialog");
const ver = src("module/versions.mjs");
console.log("in the item sheets' look:", ver.includes('classes: ["twod12-styled", "twod12-tierdlg"]') && ver.includes('<div class="sk tierdlg">'), "| its buttons:", src("styles/system.css").includes(".twod12-tierdlg .form-footer button"));

console.log("--- the Cover height Snapshot");
const st = { nameA: "Dave", nameT: "Goblin", hA: 0, hT: 1, wA: 1, wT: 1, dist: 3, blocks: { "1,0": 2 }, origin: "center" };
const html = hc.heightHtml(st), snap = hc.snapshotHtml("Cover height: Dave → Goblin", "<svg></svg>", st);
console.log("the window has the button:", html.includes('class="hc-snapbtn"'), "| the chat message:", snap.replace(/\s+/g, " "));

console.log("--- the Talent's Traits");
const tpl = src("templates/item-sheet.hbs");
console.log("a drop-down like the Action's:", (tpl.match(/<label>Traits \{\{formInput fields\.traits value=system\.traits name="system\.traits"\}\}<\/label>/g) ?? []).length === 2, "| the checkboxes are gone:", !tpl.includes('data-set="traits"'));

console.log("--- Show help on the Action and Talent sheets");
console.log("the box:", tpl.includes("{{#if helpable}}<label class=\"sheet-helptoggle\""), "| for Actions and Talents:", src("module/item-sheet.mjs").includes('helpable: t === "action" || t === "talent",'), "| a user setting, on by default:", /"sheetHelp", \{[^}]*default: true \}/.test(src("module/twod12.mjs")), "| hides the hints:", src("styles/system.css").includes(".twod12 section.tab.help-off .hint"));

console.log("--- v0.0.173: fixes from Lucas's test, and his rule answers");
const css = src("styles/system.css");
console.log("the tiers table ignores Foundry's row colors:", css.includes(".twod12.acard { --table-row-color-odd: transparent;") && css.includes(".application .twod12.acard table.ac-tiers tr"));
const hcs = src("module/heightcover.mjs");
console.log("the Snapshot is a picture:", hcs.includes("svgToPng(svg)") && hcs.includes('<img class="hc-snapimg"') && hcs.includes('FP.upload("data", "twod12-snapshots"'), "| with the window's colors:", hcs.includes("const SNAP_CSS"));
const mvs = src("module/move.mjs");
console.log("a diagonal between two creatures counts only between unwilling ones:", (mvs.match(/creatureAt: c => unwillingIn\(c, doc\) \}/g) ?? []).length === 3, "| Reposition doesn't pass between them:", !mvs.includes("throughCreatures: repo"));
// the ruler and the path: two allies at the corner are no Difficult Terrain; two enemies are
const GS = 100, toks = [];
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getCenterPoint: ({ i, j }) => ({ x: j * GS + 50, y: i * GS + 50 }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }) }, tokens: { placeables: toks }, walls: { placeables: [] }, tiles: { placeables: [] } };
const mv = await import(ROOTURL + "module/move.mjs");
const put = (id, i, j, disp) => toks.push({ id, name: id, actor: {}, document: { id, x: j * GS, y: i * GS, width: 1, height: 1, disposition: disp, hidden: false } });
const me = { id: "me", x: 0, y: 100, width: 1, height: 1, disposition: 1 };
put("Ally A", 0, 0, 1); put("Ally B", 1, 1, 1);
console.log("between two allies:", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }]).cornerDT);
toks.length = 0; put("Ally A", 0, 0, 1); put("Goblin", 1, 1, -1);
console.log("between an ally and a goblin:", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }]).cornerDT);
toks.length = 0; put("Goblin A", 0, 0, -1); put("Goblin B", 1, 1, -1);
console.log("between two goblins:", mv.creaturesOnPath(me, [{ x: 0, y: 100 }, { x: 100, y: 0 }]).cornerDT);
