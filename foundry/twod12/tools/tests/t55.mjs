// Run with: node tools/tests/run.mjs (or node tools/tests/t55.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } }, abstract: { TypeDataModel: class {} } };
globalThis.Hooks = { on() {} };
const uflags = { sheetView: "normal", sheetSort: "custom", collapsedGroups: ["Items"] };
globalThis.game = { settings: { get: () => true }, user: { getFlag: (s, k) => uflags[k], targets: new Set() }, combat: null };
const T = (...t) => new Set(t);
const mkAction = (id, name, flags, sys) => ({ id, name, img: "i", type: "action", getFlag: (s, k) => flags[k], system: { traits: T(), versions: [{ ap: 1 }], frequency: "", ...sys } });
const items = [
  mkAction("smite", "Smite", { featureId: "f" }, { traits: T("strike", "divine", "weapon"), versions: [{ ap: 1 }, { ap: 2 }, { ap: 3 }], frequency: "round" }),
  mkAction("loh", "Lay On Hands", { featureId: "f" }, { traits: T("divine", "focus"), versions: [{ ap: 1 }, { ap: 2 }] }),
  mkAction("oa", "Opportunity Attack", { talentId: "t" }, { reaction: true, frequency: "atwill" }),
  mkAction("rs", "Reaping Sweep", { weaponId: "gs" }, { traits: T("strike", "melee", "weapon") }),
  mkAction("wa", "Weapon Attack", { basic: "basicWeaponAttack" }, { traits: T("strike", "weapon"), frequency: "atwill" }),
  mkAction("ch", "Charge", { basic: "charge" }, { traits: T("move", "self"), versions: [{ ap: 2 }] }),
  mkAction("rl", "Reload", { basic: "reload" }, {}),
  mkAction("sy", "Steel Yourself", { basic: "rally" }, { versions: [{ ap: 2 }, { ap: 3 }] })
];
const weapon = { id: "gs", name: "Greatsword", img: "g", type: "weapon", getFlag: () => undefined, system: { wielded: true, hands: 1, traits: T("twohanded", "melee"), subtype: "Sl", range: "", unloaded: false, damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } } } };
const effects = [{ id: "e1", name: "Double Shot (2 Attacks)", img: "d", getFlag: (s, k) => ({ grants: [{ spec: "Weapon Attack", count: 2, left: 1, ap: 0 }], duration: { type: "eot" } })[k] }, { id: "e2", name: "Hindered (until Move)", img: "h", getFlag: (s, k) => ({ duration: { type: "rounds", rounds: 1 }, remaining: 1 })[k] }];
const actor = { type: "character", items: { get: id => items.find(i => i.id === id) }, itemTypes: { action: items, weapon: [weapon], feature: [], talent: [] }, effects, statuses: new Set(["dying", "unconscious"]),
  getFlag: (s, k) => ({ favorites: ["rs"], order: ["rs", "smite"] })[k],
  system: { damage: { bodyLethal: 8, bodyNonlethal: 2, mindLethal: 3, mindNonlethal: 1 }, bdt: 21, mdt: 15, bodyDamage: 10, mindDamage: 4, bloodied: false, strained: false, atZero: true, moveSpeed: 5, reach: 1, weaponAttribute: "body", weaponMod: 2, magicAttribute: "appeal", magicMod: 2, rallyMax: 13, rallyLeft: 11 } };
const { CharacterSheet } = await import(ROOTURL + "module/sheets.mjs");
const sheet = Object.create(CharacterSheet.prototype);
sheet._filter = "all"; sheet._groupLabels = ["Class", "Talents", "Items", "Other", "Basic"];
Object.defineProperty(sheet, "actor", { value: actor });
const m = await sheet._sheetModel();
console.log("groups:", m.groups.map(g => `${g.label}${g.collapsed ? "(collapsed)" : ""}: ${g.rows.map(r => r.name).join(", ")}`).join(" | "));
console.log("favorites:", m.favorites.map(r => r.name).join(", "), "| granted:", m.granted.map(g => `${g.name} ${g.left}/${g.count} from ${g.source} (${g.dur}) boxes ${g.boxes.map(b => b.on ? "#" : "o").join("")}`).join(""));
console.log("basics (Reload hidden, no Reload weapon):", m.basics.map(b => b.name).join(", "));
console.log("Smite cost:", m.groups[0].rows.find(r => r.name === "Smite").apsHtml.replace(/<[^>]+>/g, ""), "| color:", m.groups[0].rows.find(r => r.name === "Smite").fq, "| OA:", m.groups.find(g => g.label === "Talents").rows[0].apsHtml.replace(/<[^>]+>/g, ""), m.groups.find(g => g.label === "Talents").rows[0].traitShort === "");
console.log("health:", JSON.stringify({ ...m.health, tip: m.health.tip.length }), "\nconditions:", m.conditions.map(c => `${c.name} [${c.dur}]`).join(", "));
console.log("weapon:", JSON.stringify(m.weaponRows[0], null, 0).slice(0, 420));
console.log("loadout:", JSON.stringify(m.loadout.hands.map(h => `${h.label}: ${h.free ? "free" : h.name}`)), "| armor slot:", m.loadout.armor.free ? m.loadout.armor.text : m.loadout.armor.name);
console.log("panel:", m.panel.map(g => `${g.title}: ${g.tiles.map(x => `${x.label} ${x.value}${x.cls ? ` (${x.cls})` : ""}`).join(", ")}`).join(" | "));
sheet._filter = "strikes"; console.log("Strikes filter:", (await sheet._sheetModel()).groups.flatMap(g => g.rows.map(r => r.name)).join(", "));
uflags.sheetSort = "cost"; sheet._filter = "all"; const m2 = await sheet._sheetModel(); console.log("sorted by cost (flat):", m2.groups.length, m2.groups[0].label === "", m2.groups[0].rows.map(r => r.name).join(", "));
// v0.0.131: the new Actions table (Group by and Sort by per user; the custom order of the creature).
const tbl = mm => mm.actGroups.map(g => `${g.label || "(one list)"}${g.collapsed ? " (collapsed)" : ""}: ${g.rows.map(r => `${r.name} [${r.costLabel} | ${r.range} | ${r.freqText}${r.faded ? " | faded" : ""}]`).join(", ")}`).join(" || ");
for (const [gb, sb] of [["cost", "custom"], ["source", "custom"], ["frequency", "name"], ["none", "cost"], ["cost", "frequency"]]) { uflags.sheetGroup = gb; uflags.sheetSort = sb; console.log(`table, group ${gb}, sort ${sb}:`, tbl(await sheet._sheetModel())); }
uflags.basicOpen = false; const mb = await sheet._sheetModel();
console.log("Basic section:", mb.basicOpen ? "open" : "closed", "|", mb.basicRows.map(r => `${r.name} ${r.costLabel}`).join(", "), "| choices:", Object.values(mb.groupByChoices).join("/"), "·", Object.values(mb.sortByChoices).join("/"));
// v0.0.133: the Items tab: weapons and armor in the creature's order, the gear list (quantity, weight and cost × quantity), coins and the total weight.
const gearItem = (id, name, quantity, weight, cost, description = "") => ({ id, name, img: "b", type: "gear", getFlag: () => undefined, system: { quantity, weight, cost, description } });
actor.itemTypes.gear = [gearItem("rope", "Rope", 1, 2, 1, "<p>50 feet of hemp.</p>"), gearItem("tor", "Torch", 3, 0.5, 0.1), gearItem("gem", "Gem", 2, 0, 25)];
actor.itemTypes.armor = [{ id: "cm", name: "Chain Mail", img: "a", type: "armor", system: { category: "medium", bonus: 0, ward: 0, properties: "", worn: true } }, { id: "lt", name: "Leather", img: "a", type: "armor", system: { category: "light", bonus: 1, ward: 1, properties: "Quiet", worn: false } }];
const realFlag = actor.getFlag; actor.getFlag = (s, k) => (k === "itemOrder" ? ["gem", "lt", "tor"] : realFlag(s, k));
const mi = await sheet._sheetModel();
console.log("armor:", mi.armorRows.map(x => `${x.name} ${x.boxes.map(b => `${b.l} ${b.v}`).join(" ")} [${x.sub}] ${x.where} -> [${x.seg.map(b => b.on ? `*${b.l}*` : b.l).join("/")}]${x.untrained ? " UNTRAINED" : ""}`).join(" | "), "| slot:", mi.loadout.armor.name ?? mi.loadout.armor.text);
console.log("gear:", mi.gear.map(g => `${g.name} x${g.qty} weight ${g.weight} cost ${g.cost} (${g.eachTip})${g.tip ? ` "${g.tip}"` : ""}`).join(" | "), "| total weight", mi.gearWeight);
actor.getFlag = realFlag;
// v0.0.134: the Effects tab: statuses are condition chips, other effects rows (what it does, duration, source), passives from Features.
const vigil = { id: "dv", name: "Divine Vigil", img: "v", type: "feature", getFlag: () => undefined, system: { hover: "Allies in the aura gain 1 boon on Will.", description: "", settings: [{ type: "boonbane", all: [], any: [], none: [], from: [], attrs: [], tiers: [], boons: 1, banes: 0, minEscalation: 2 }] } };
actor.itemTypes.feature = [vigil]; const realGet = actor.items.get; actor.items.get = id => (id === "dv" ? vigil : realGet(id)); actor.system.escalation = 1;
effects.push({ id: "e3", name: "Prone", img: "p", statuses: new Set(["prone"]), getFlag: () => undefined, duration: { label: "None" } });
const mf = await sheet._sheetModel();
console.log("Effects tab: conditions", mf.fx.conditions.map(c => `${c.name}${c.dur ? ` [${c.dur}]` : ""}`).join(", "), "| effects", mf.fx.effects.map(e => `${e.name} [${e.dur}]${e.source ? ` ${e.source}` : ""}`).join(", "), "| passives", mf.fx.passives.map(p => `${p.name}: ${p.text} (${p.source})${p.off ? ` ${p.offText}` : ""}`).join(", "));
actor.itemTypes.feature = []; actor.items.get = realGet; actor.system.escalation = 0;
effects.pop();
