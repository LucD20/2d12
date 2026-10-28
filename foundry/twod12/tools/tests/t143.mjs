// Run with: node tools/tests/run.mjs (or node tools/tests/t143.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.176 (pack R, the rules sync): Rally Points, the Bestiary's levels 1-3, Light, Bursts on corners, Area and Distance, Dying and Shattered, waking.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: c => c }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const cf = await import(ROOTURL + "module/config.mjs"), b = await import(ROOTURL + "module/basic.mjs"), dn = await import(ROOTURL + "module/down.mjs"), fx = await import(ROOTURL + "module/effects.mjs");

console.log("--- Rally Points: the class's Rally value + ceil((Body + Mind + level) / 2)");
const data = src("module/data.mjs"), content = src("tools/content.mjs");
console.log("the formula:", data.includes("(cls?.system.rallyMod ?? 0) + Math.ceil(((a.body ?? 0) + (a.mind ?? 0) + (Number(lv) || 0)) / 2)"), "| Paladin 6:", content.includes("rallyMod: 6, speedMod: 0,"), "| Archer 5:", content.includes("mindMult: 2.5, rallyMod: 5,"));
for (const [label, rally, body, mind, lv] of [["Paladin, Body +2, Mind +1, level 1", 6, 2, 1, 1], ["Archer, Body +1, Mind +1, level 1", 5, 1, 1, 1], ["Paladin, Body +2, Mind +1, level 3", 6, 2, 1, 3]])
  console.log(label.padEnd(38), rally + Math.ceil((body + mind + lv) / 2));
const cls = (name, rallyMod) => { const it = { type: "class", name, system: { rallyMod }, updated: null, async update(u) { this.updated = u; } }; return it; };
const world = [cls("Paladin", 4), cls("Archer", 3), cls("Paladin", 7), cls("Fighter", 4)];
console.log("old class items updated once:", await b.fixClassRally(world, []), world.map(i => `${i.name} ${i.updated?.["system.rallyMod"] ?? "kept " + i.system.rallyMod}`).join(", "));

console.log("--- the Bestiary's levels 1-3 (book/ruler/ratings.py, all 57 rows checked against it)");
for (const role of ["standard", "grunt", "minion"]) for (const lv of [1, 2, 3, 4]) {
  const base = cf.TWOD12.npcRoles[role].basic, rs = role === "minion" ? ["low", "medium", "high"] : ["low", "medium", "high", "extreme"];
  console.log(`${role.padEnd(9)} level ${lv}:`, rs.map(r => `${r} x${cf.npcHm(role, r, lv)} ${cf.npcDamage(base[0], r, lv)}/${cf.npcDamage(base[1], r, lv)}`).join(" | "));
}
console.log("the NPC's Health uses the level:", data.includes("const hmOf = r => npcHm(sys.role, r, sys.level);"), "| the Builder too:", src("module/npcbuilder.mjs").includes("const hmOf = x => npcHm(s.role, x, s.level);"));

console.log("--- Light: only the target's light; a light of size N is an N Emanation");
console.log("a Check no longer reads the light where you stand:", !src("module/inline.mjs").includes("tokenLight(token)"));
console.log("radius from the token's center (squares): size 2, one square:", fx.lightRadius(2), "| size 2, a 2x2 token:", fx.lightRadius(2, 1), "| size 0:", fx.lightRadius(0));

console.log("--- Bursts snap to a corner only");
const tpl = src("module/template.mjs");
console.log("no square center among the points:", tpl.includes("const pts = [{ x: tl.x, y: tl.y }, { x: tl.x + s, y: tl.y }, { x: tl.x, y: tl.y + s }, { x: tl.x + s, y: tl.y + s }];"));

console.log("--- Area and Distance are two lines");
const show = d => `Area "${cf.areaText(d)}" | Distance "${cf.distanceText(d)}"`;
console.log("Word of Radiance (Area settings):", show({ area: "2 Emanation", areaDistance: "5 sq.", distance: "" }));
console.log("Volley (weapon range):           ", show({ area: "2 Emanation", areaDistance: "Your weapon's normal range", distance: "" }));
console.log("an older text with 'within':     ", show({ area: "1 Emanation within 10 sq.", distance: "" }));
console.log("an Action with no Area:          ", show({ area: "", distance: "reach" }));
const row = cf.metaRowHtml({ targetText: "All enemies in the Area", distance: "5 sq.", area: "2 Emanation" });
console.log("the card:", row.replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "✦").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());

console.log("--- Dying and Shattered: the Table the first time each, in an encounter");
let flag = undefined;
const step = (kind, cid = "c1") => { const first = dn.firstTimeThisEncounter(flag, cid, kind); if (first) flag = dn.tableMark(flag, cid, kind); return `${kind} ${first ? "rolls" : "no roll"}`; };
console.log([step("dying"), step("dying"), step("shattered"), step("shattered"), step("dying", "c2")].join(" | "), "| an older flag (the combat's id):", dn.firstTimeThisEncounter("c1", "c1", "shattered") ? "rolls" : "no roll");

console.log("--- Waking with Interact (not a creature that is Down)");
const who = (st, atZero = false) => ({ statuses: new Set(st), system: { atZero } });
for (const [label, a] of [["Unconscious, not Down", who(["unconscious"])], ["Unconscious and Dying", who(["unconscious", "dying"])], ["Unconscious, damage at the Pool", who(["unconscious"], true)], ["awake", who([])]])
  console.log(label.padEnd(32), JSON.stringify(dn.wakeProblem(a)));
console.log("Interact asks:", src("module/actions.mjs").includes('if (basicKey === "interact") await offerWake(actor, [...game.user.targets]);'), "| its text follows the book:", b.BASIC_ACTIONS.interact.versions[0].effects.includes("grab objects within Reach, as many as you have free hands"));
