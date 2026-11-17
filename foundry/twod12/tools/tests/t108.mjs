// Run with: node tools/tests/run.mjs (or node tools/tests/t108.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
// v0.0.122 (Round 10, part 3): every weapon has a Range (melee too), Reach above 1, Long, Thrown, Distance: Weapon, threatening from the normal range.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: c => c }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Combat = class {};
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.game = { settings: { get: () => true }, combat: null, user: { id: "u", targets: new Set() }, socket: { emit() {}, on() {} } };
globalThis.canvas = { tokens: { placeables: [] }, grid: { size: 100, distance: 1 } };
const W = await import(ROOTURL + "module/weaponrange.mjs");
const S = a => new Set(a), w = (traits, sys = {}) => ({ name: "W", system: { traits: S(traits), ...sys }, getFlag: () => undefined });
const gs = w(["melee", "twohanded"], { range: "1" }), lance = w(["melee"], { range: "1/2" }), pike = w(["melee", "long", "twohanded"], { range: "3" }), old = w(["melee"], { reach: 1 }), bow = w(["ranged", "twohanded"], { range: "10/20/40" }), dag = w(["melee", "thrown"], { range: "1", thrownRange: "4/8/12" });
console.log("--- Ranges (Reach 1 | Reach 2)");
for (const [n, x] of [["greatsword", gs], ["lance", lance], ["pike (Long)", pike], ["an old weapon with extra Reach 1", old], ["crossbow", bow], ["dagger (Thrown)", dag]]) { const a = W.weaponRanges(x), b = W.weaponRanges(x, 2); console.log(n.padEnd(34), `melee ${a.melee || "-"} ranged ${a.ranged || "-"} | melee ${b.melee || "-"} ranged ${b.ranged || "-"}`); }
console.log("--- how a Weapon Action uses the weapon");
const u = r => `${r.mode || "(can't)"} ${r.range}${r.thrown ? " thrown" : ""}${r.long ? " Long" : ""}`;
console.log("Weapon Attack + greatsword:", u(W.weaponUse(gs, S(["weapon", "strike"]))), "| + crossbow:", u(W.weaponUse(bow, S(["weapon"]))));
console.log("dagger, target adjacent:", u(W.weaponUse(dag, S(["weapon"]), 1, 1)), "| 5 squares away:", u(W.weaponUse(dag, S(["weapon"]), 1, 5)), "| a [Ranged] Action:", u(W.weaponUse(dag, S(["weapon", "ranged"]))), "| a [Melee] Action:", u(W.weaponUse(dag, S(["weapon", "melee"]), 1, 5)));
console.log("a [Melee] Action with a crossbow:", u(W.weaponUse(bow, S(["weapon", "melee"]))), "| pike:", u(W.weaponUse(pike, S(["weapon"]))));
const { rangeBand } = await import(ROOTURL + "module/move.mjs");
console.log("bands: lance at 1/2/3:", [1, 2, 3].map(n => { const b = rangeBand(n, "1/2"); return b.out ? "out" : `${b.banes} bane`; }).join(", "), "| greatsword at 2:", rangeBand(2, "1").out ? "out" : "in", "| pike at 1/3/4:", [1, 3, 4].map(n => { const b = rangeBand(n, "3"); return b.out ? "out" : `${b.banes} bane`; }).join(", "), "(plus 1 bane adjacent for Long)");
console.log("--- the card's Distance");
const { distanceText } = await import(ROOTURL + "module/config.mjs");
const own = (x, reach) => ({ ...x, parent: { system: { reach } } });
console.log([[S(["weapon"]), gs, 1], [S(["weapon"]), lance, 2], [S(["weapon"]), bow, 1], [S(["weapon"]), dag, 1], [S(["weapon", "ranged"]), dag, 1], [S(["divine"]), null, 1]].map(([t, x, r]) => JSON.stringify(distanceText({ distance: "weapon", traits: t }, x ? own(x, r) : null))).join(" "), "| an old card with Reach:", JSON.stringify(distanceText({ distance: "reach", traits: S(["weapon"]) }, own(lance, 1))));
console.log("--- threatening");
const F = await import(ROOTURL + "module/flanking.mjs");
const actor = (weapons, reach = 1, extra = {}) => ({ system: { reach }, statuses: S([]), itemTypes: { weapon: weapons.map(x => ({ ...x, system: { ...x.system, wielded: true } })), action: [] }, items: [], getFlag: () => undefined, ...extra });
for (const [n, a] of [["greatsword", actor([gs])], ["lance (far range doesn't count)", actor([lance])], ["pike (Long)", actor([pike])], ["pike and a greatsword", actor([pike, gs])], ["greatsword, Reach 2", actor([gs], 2)], ["crossbow only", actor([bow])], ["unconscious", actor([gs], 1, { statuses: S(["unconscious"]) })]]) console.log(n.padEnd(34), JSON.stringify(F.threatProfile(a)));
console.log("--- the generator");
const G = await import(ROOTURL + "module/gen.mjs");
for (const t of ["lance: melee, pierce, range 1/2, 0/1d8/2d6", "dagger: melee, thrown 4/8/12, pierce, 0/1d4/1d6", "pike: two-handed, melee, long, pierce, range 3, 0/1d8/2d6", "greatsword: two-handed, melee, slash, 0/1d8/2d6", "bow: two-handed, pierce, ranges 10/20/40, 0/1d6/1d10"]) { const p = G.parseWeaponText(t), d = G.weaponSystemData(p); console.log(p.name.padEnd(11), [...p.traits].join(","), "| range", d.range || "-", "| thrown", d.thrownRange || "-", p.problems.length ? `| ${p.problems}` : ""); }
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- content: Weapon Attack uses Distance: Weapon:", BD.basicWeaponAttack.distance === "weapon", "| Trip keeps Reach:", BD.trip.distance === "reach", "| compendium Longsword (v0.0.412: the two-handed sword in the Greatsword's place) Range:", JSON.parse(src("packs/_source/weapons/longsword.weapon.json")).system.range, "| Smite:", JSON.parse(src("packs/_source/actions/smite.action.json")).system.distance);
console.log("--- v0.0.123");
const acts = src("module/actions.mjs"), tpl = src("templates/actor-sheet.hbs"), sheet = src("module/actor-sheets.mjs"), data = src("module/data.mjs");
console.log("a thrown weapon shows a notice in the roll dialog:", acts.includes('...(wUse?.thrown && wUse.mode === "ranged"') && acts.includes('<span class="rnotice"'), "| NPC Reach editable:", data.includes("reachBase: int(1, 1)") && data.includes("this.reach = Math.max(1, Number(this.reachBase) || 1)") && sheet.includes('reach: { "system.reachBase"'), "| Tags as chips:", tpl.includes('<span class="tchip">'));
