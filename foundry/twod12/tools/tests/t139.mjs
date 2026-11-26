// Run with: node tools/tests/run.mjs (or node tools/tests/t139.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).allDocs, cdoc = (n, t = "action") => CDOCS.find(d => d.name === n && d.type === t);   // v0.0.232 (pack CS): the cards are data (book/cards), read from the built content
import fs from "node:fs";
// v0.0.169 (F1): the Foundry system follows the book: [Ranged] Engaged banes, Fists as an ordinary weapon (Non-threatening; Brawler removes it), the Basic
// Actions (Shove with 3 versions, Relocate, the Fists card as a Weapon Action), Collision counted from the destination the origin chose, Steadiness.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
const mv = await import(ROOTURL + "module/move.mjs"), fx = await import(ROOTURL + "module/fists.mjs"), b = await import(ROOTURL + "module/basic.mjs"), cf = await import(ROOTURL + "module/config.mjs");
const { NpcData } = await import(ROOTURL + "module/data.mjs");   // the cleanup audit (2026-11-26): npcBuilderContext removed, and its Steadiness row check
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- Collision counts the squares to the destination the origin chose");
const line = n => Array.from({ length: n + 1 }, (_, k) => ({ di: k, dj: 0 }));
const none = { wallBetween: () => false, creatureAt: () => null };
const show = (label, N, opts) => { const r = mv.analyzePath(line(N), N, opts); console.log(label.padEnd(58), `moves ${r.done}, unused ${r.unused}, damage ${JSON.stringify(r.damage)}`); };
show("Pushed 4 aimed 4 squares, a wall right behind the creature", 4, { wallBetween: (a) => a.di === 0, creatureAt: () => null });
show("Pushed 4 aimed 4 squares, a creature in the 2nd square", 4, { wallBetween: () => false, creatureAt: s => (s.di === 2 ? { name: "Kai" } : null) });
show("Pushed 4 aimed only 1 square, nothing in the way (no damage)", 1, none);
show("Pushed 2 aimed 2 squares, a wall behind", 2, { wallBetween: a => a.di === 0, creatureAt: () => null });
const mvSrc = src("module/move.mjs");
console.log("the push preview uses the chosen destination:", mvSrc.includes("analyzePath(path, path.length - 1, {"), "| the old value-based call is gone:", !mvSrc.includes("repo ? path.length - 1 : N"));
console.log("--- Steadiness reduces the value (never below 0)");
console.log([[3, 1], [1, 1], [2, 4], [5, 0], [3, -2]].map(([n, s]) => `Pushed ${n} vs Steadiness ${s} = ${mv.reducedValue(n, s)}`).join(" | "));
console.log("Pushed and Reposition ask whether to apply it:", mvSrc.includes("Apply Steadiness (") && mvSrc.includes("applySteadiness(target, N0, label, opts.by?.document ? opts.by : origin, mode)"));
const mk = sys => { const m = Object.create(NpcData.prototype); Object.assign(m, { level: 1, damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, custom: { body: 0, mind: 0, appeal: 0, instinct: 0, bodyHealth: 10, mindHealth: 10 }, armorDef: 13, wardDef: 13,
  weaponAttribute: "body", powerAttribute: "mind", speed: 5, reachBase: 1, armor: "medium", bodyWounds: 0, mindWounds: 0, role: "standard", ratings: {}, steadiness: 0, parent: { type: "npc", items: [], itemTypes: { armor: [] } }, ...sys }); m.prepareDerivedData(); return m; };
console.log("an NPC's Steadiness:", [0, 1, 3, -1].map(v => `${v} -> ${mk({ steadiness: v }).steadiness}`).join(", "));
const tpl = src("templates/item-sheet.hbs"), isj = src("module/item-sheet.mjs"), content = src("tools/content.mjs");
console.log("species sheet buttons 0-4:", tpl.includes('data-action="setSteadiness"') && isj.includes("steadinessChoices: [0, 1, 2, 3, 4]"), "| Dwarf 1, the others 0:", /sp\("Dwarf"[^;]*4, 1\);/.test(content) && !/sp\("(Human|Elf)"[^;]*, 1\);/.test(content.replace(/sp\("Human"[^;]*;/, m => m.replace(/, 1\)/, ", 0)"))));
console.log("--- Fists are an ordinary weapon");
const fi = fx.fistsItemData();
console.log("the Fists item:", JSON.stringify({ traits: fi.system.traits, range: fi.system.range, damage: [fi.system.damage.t1.count, fi.system.damage.t2.mod, fi.system.damage.t3.die] }), "| a weapon property list has Non-threatening:", !!cf.TWOD12 && JSON.stringify(Object.keys(cf.TWOD12.traits ?? {})).includes("nonthreatening"));
const fa = b.BASIC_ACTIONS.fists;
console.log("the Fists card:", fa.traits.join("/"), "| distance", fa.distance, "| Tier 2 and 3 use [W]:", fa.versions[0].t2[0].useW && fa.versions[0].t3[0].useW);
console.log("Pummel uses only the Fists, Leg Sweep is a kick (Fists, no free hand: v0.0.188); Brawler removes Non-threatening:", CDOCS.filter(d => d.type === "action" && d.system.weaponUse === "fists" && !d.flags?.twod12?.basic).length === 1 && cdoc("Leg Sweep").system.weaponUse === "kick" && cdoc("Brawler", "talent").system.settings?.some(x => x.type === "weaponprop" && x.wpWhich === "fists" && x.wpProp === "nonthreatening"));
console.log("--- the Basic Actions");
const ladder = d => d.versions.map(v => `${v.ap}AP: ${[v.x1, v.x2, v.x3].map(x => (x.match(/distance:(\d)/)?.[1] ?? "0")).join("/")}`).join(" | ");
console.log("Shove  ", ladder(b.BASIC_ACTIONS.shove), "|", b.BASIC_ACTIONS.shove.traits.join("/"));
console.log("Relocate", ladder(b.BASIC_ACTIONS.relocate), "|", b.BASIC_ACTIONS.relocate.traits.join("/"), "|", b.BASIC_ACTIONS.relocate.requirements);
console.log("no old Reposition Basic Action:", !b.BASIC_ACTIONS.reposition, "| Haul (v0.0.170):", !!b.BASIC_ACTIONS.haul, "| Trip says SR:", b.BASIC_ACTIONS.trip.requirements);
console.log("Cut Through's Critical uses Relocate:", cdoc("Cut Through").system.versions[0].critical.includes("@Use[Relocate|nohandle:yes|label:Relocate (1A)]"));
console.log("--- the Engaged banes are for [Ranged] Actions");
const act = src("module/actions.mjs");
console.log('const rangedWeapon = useTraits.has("ranged"):', act.includes('const rangedWeapon = useTraits.has("ranged");'), "| Steady Nerves says [Ranged]:", cdoc("Steady Nerves", "talent").system.description.includes("Your [Ranged] Actions don't take the Banes for being Engaged."));
console.log("SR in requirements:", JSON.stringify(cf.requirementProblem({ requirements: "The target's SR is at most 1 higher than yours." }, { system: { size: 3 } }, { system: { size: 5 } })), "| the old wording still works:", JSON.stringify(cf.requirementProblem({ requirements: "The target's Size is at most 1 higher than yours." }, { system: { size: 3 } }, { system: { size: 5 } })));
