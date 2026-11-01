// Run with: node tools/tests/run.mjs (or node tools/tests/t114.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.131 (new sheet, step 2): the Actions table's logic and the new Action card.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, combat: null, user: { getFlag: () => undefined } };
const R = await import(ROOTURL + "module/actionrows.mjs");
const { buildActionCard } = await import(ROOTURL + "module/actioncard.mjs");
const T = (...t) => new Set(t);
const blank = { attrs: [], all: [], any: [], none: [], from: [], tiers: [] };
const inst = o => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", ...o });
const ver = o => ({ ap: 1, mode: "", noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "", ...o });
const action = (id, name, sys = {}, flags = {}) => ({ id, name, type: "action", getFlag: (s, k) => flags[k], system: { traits: T(), versions: [ver()], frequency: "", reaction: false, escalation: 0, targets: "", distance: "", area: "", ...sys } });
const fx = (name, flags, extra = {}) => ({ id: name, name, disabled: false, statuses: T(), flags: { twod12: flags }, getFlag: (s, k) => flags[k], ...extra });
const feature = (name, settings) => ({ id: name, name, system: { settings, defenses: [], description: "" } });
const smite = action("smite", "Smite", { traits: T("strike", "divine", "weapon", "melee"), frequency: "round", distance: "Weapon", versions: [
  ver({ ap: 1, t1: [inst({ useW: true })], t2: [inst({ useW: true, wCount: 1 }), inst({ dice: "1d6", subtype: "Ho" })], t3: [inst({ useW: true, wCount: 2 }), inst({ dice: "1d6", subtype: "Ho" })], critical: "Dazed (EoT)." }),
  ver({ ap: 2, t1: [inst({ useW: true })], t2: [inst({ useW: true }), inst({ dice: "2d6", subtype: "Ho" })], t3: [inst({ useW: true, wCount: 2 }), inst({ dice: "2d6", subtype: "Ho" })], effects: "You regain 1 Rally Point." })
] });
const crossbow = { id: "xb", name: "Crossbow", type: "weapon", system: { wielded: true, hands: 2, traits: T("ranged", "reload"), unloaded: true, range: "10/20/40" } };
const lock = action("lock", "Lock & Loose", { traits: T("strike", "weapon", "ranged"), frequency: "round", distance: "Weapon" }, { weaponId: "xb" });
const wattack = action("wa", "Weapon Attack", { traits: T("strike", "weapon") }, { basic: "basicWeaponAttack" });
const actor = (effects = [], feats = [], sys = {}) => ({ type: "character", items: { get: id => [crossbow].find(w => w.id === id) }, itemTypes: { weapon: [crossbow], feature: feats, talent: [], action: [] }, effects, statuses: T(),
  system: { attributes: { body: 2, mind: 1, appeal: 1, instinct: 0 }, weaponAttribute: "body", weaponMod: 2, escalation: 0, ...sys } });

console.log("--- what changes Smite right now (only temporary effects, Escalation passives and the creature's state)");
const surge = fx("Divine Surge", { bonuses: [{ ...blank, all: ["__name:smite"], dmg: "1d8", dmgPool: "M", dmgSub: "Ho", tiers: ["t2", "t3"] }] });
const weak = fx("Enfeebled 1", {}, { statuses: T("enfeebled"), getFlag: (s, k) => ({ value: 1 })[k], flags: { twod12: { value: 1 } } });
const bless = fx("Bless", { modifiers: [{ ...blank, all: ["strike"], boons: 1, banes: 0 }] });
const notMine = fx("Aim", { modifiers: [{ ...blank, all: ["ranged"], boons: 2, banes: 0 }] });
const always = feature("Weapon Focus", [{ ...blank, type: "boonbane", all: ["weapon"], boons: 1, banes: 0, minEscalation: 0 }]);
const vigil = feature("Hallowed Stance", [{ ...blank, type: "boonbane", all: ["strike"], boons: 1, banes: 0, minEscalation: 2 }]);
for (const [label, a] of [["nothing", actor()], ["Divine Surge, Enfeebled 1, Bless, Aim", actor([surge, weak, bless, notMine])], ["always-on passive", actor([], [always])], ["Escalation passive at 2", actor([], [vigil], { escalation: 2 })], ["Escalation passive at 1", actor([], [vigil], { escalation: 1 })], ["Bloodied", actor([], [], { bloodied: true })]]) {
  const ch = R.actionChanges(a, smite);
  console.log(label.padEnd(38), JSON.stringify(ch.chips.map(c => `${c.text} ${c.cls} (${c.why})`)), "| net", ch.net, "| bonus T1/T2/T3:", [1, 2, 3].map(n => ch.bonuses[n].length).join("/"));
}
console.log("--- Unloaded");
console.log("Lock & Loose (its crossbow, unloaded):", R.unloadedWeapon(actor(), lock)?.name ?? "-", "| Weapon Attack (only the crossbow in hand):", R.unloadedWeapon(actor(), wattack)?.name ?? "-", "| Smite:", R.unloadedWeapon({ ...actor(), itemTypes: { weapon: [] } }, smite)?.name ?? "-");
crossbow.system.unloaded = false;
console.log("loaded again:", R.unloadedWeapon(actor(), lock)?.name ?? "-", R.unloadedWeapon(actor(), wattack)?.name ?? "-");
crossbow.system.unloaded = true;
console.log("--- labels");
const oa = action("oa", "Divine Retribution", { reaction: true, frequency: "encounter", versions: [ver({ ap: 2 }), ver({ ap: 3 })] });
const surgeA = action("ds", "Divine Surge", { frequency: "round", escalation: 1, versions: [ver({ ap: 0 })] });
const mir = action("mr", "Miraculous Recovery", { frequency: "daily", versions: [ver({ ap: 2 }), ver({ ap: 3 })] });
for (const [it, used] of [[smite, false], [lock, false], [oa, false], [surgeA, false], [mir, false], [mir, true]]) console.log(it.name.padEnd(20), R.costText(it), "|", R.costGroup(it), "|", R.frequencyText(it, used));
console.log("--- groups and orders (custom order: Divine Surge, Smite)");
const rows = [smite, lock, oa, surgeA, mir].map(i => ({ id: i.id, name: i.name, minAp: Math.min(...i.system.versions.map(v => v.ap)), freq: i.system.frequency, cost: R.costGroup(i), source: i.id === "lock" ? "Items" : "Class" }));
for (const [groupBy, sort] of [["cost", "custom"], ["cost", "name"], ["frequency", "custom"], ["source", "cost"], ["none", "custom"], ["none", "usage"]])
  console.log(`${groupBy}/${sort}:`.padEnd(18), R.groupRows(rows, { groupBy, sort, order: ["ds", "smite"], sourceLabels: ["Class", "Talents", "Items", "Other"] }).map(g => `${g.label || "-"}: ${g.rows.map(r => r.name).join(", ")}`).join(" | "));
console.log("old saved sorts:", ["frequency", "source", "name", "nonsense"].map(R.sortKeyOf).join(", "));

console.log("--- the card");
const strip = h => h.replace(/<i [^>]*><\/i>|<img [^>]*>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("Smite, no actor:", strip(await buildActionCard(smite)));
const html = await buildActionCard(smite, { actor: actor([surge, weak]) });
console.log("Smite with Divine Surge and Enfeebled 1:", strip(html));
console.log("columns:", (html.match(/<th><span class="ac-badge">/g) || []).length, "| green bonus in Tier 2 and 3 cells:", (html.match(/class="chg up"/g) || []).length, "| red per-die:", (html.match(/class="chg down"/g) || []).length, "| subtypes colored:", html.includes("dt-ho"));
const split = action("dr", "Divine Retribution", { reaction: true, frequency: "encounter", trigger: "An enemy hits an ally within 3 squares.", reactionKind: "trigger", versions: [ver({ ap: 2, mode: "weapon", t1: [inst({ useW: true })], t2: [inst({ useW: true })], t3: [inst({ useW: true, wCount: 2 })] }), ver({ ap: 3, mode: "power", t1: [inst({ dice: "1d8", subtype: "Ho" })], t2: [inst({ dice: "2d8", subtype: "Ho" })], t3: [inst({ dice: "3d8", subtype: "Ho" })] })] });
console.log("Split Reaction:", strip(await buildActionCard(split)));
console.log("Lock & Loose with the crossbow unloaded:", strip(await buildActionCard(lock, { actor: actor() })));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs");
console.log("--- the sheet: table header:", tpl.includes('<div class="at-head"><span></span><span></span><span>Action</span><span>Cost</span><span>Range</span><span>Frequency</span><span>Use</span></div>'), "| row opens its card:", tpl.includes('data-action="toggleCard"') && sh.includes("buildActionCard(item, { actor: this.actor })"), "| Use and Reload:", tpl.includes('data-action="useAction" data-tooltip="{{#if useTip}}{{useTip}}{{else}}Use {{name}}{{/if}}"') && tpl.includes('data-action="reloadFor"'),
  "| per user:", sh.includes('getFlag("twod12", "sheetGroup")') && sh.includes('setFlag("twod12", "sheetSort"'), "| order on the creature:", sh.includes('a.getFlag("twod12", "order")'), "| Basic collapsed by default:", sh.includes('basicOpen: !!game.user.getFlag("twod12", "basicOpen")'), "| filter:", tpl.includes('class="at-filter"'));
