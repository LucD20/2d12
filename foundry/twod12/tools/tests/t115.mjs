// Run with: node tools/tests/run.mjs (or node tools/tests/t115.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.132 (new sheet, step 3): the Features tab, the Light/Dark look, Escalation cost and chips on the Actions rows.
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } }, abstract: { TypeDataModel: class {} } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null };
globalThis.ui = { notifications: {} };
const T = (...t) => new Set(t);
const items = [];
const mk = (type, id, name, sys = {}, flags = {}) => { const it = { id, name, type, img: "i", getFlag: (s, k) => flags[k], system: { traits: T(), settings: [], actions: [], choiceOptions: [], talents: 0, description: `<p>${name} text.</p>`, hover: "", ...sys } }; items.push(it); return it; };
const ver = ap => ({ ap, t1: [], t2: [], t3: [] });
// Divine Power gives Smite; Encounter Pick is a choice (1 of 3) that chose Divine Retribution; Escalation Passive chose the Feature Divine Vigil (an Escalation passive with an Aura);
// Profane Judgment is a passive; Field Training gives a Talent slot (filled by Brawler); one Talent is an extra; Bulwark was dropped by hand.
mk("feature", "dp", "Divine Power", { actions: ["x"] }, { grantedBy: "class" });
mk("action", "smite", "Smite", { traits: T("strike", "weapon"), frequency: "round", distance: "Weapon", versions: [ver(1), ver(2), ver(3)] }, { featureId: "dp" });
mk("feature", "ep", "Paladin Encounter Pick", { choiceOptions: ["a", "b", "c"], choiceCount: 1 }, { grantedBy: "class", choices: ["a"] });
mk("action", "dr", "Divine Retribution", { reaction: true, frequency: "encounter", versions: [ver(2), ver(3)] }, { talentId: "ep", choice: true });
mk("feature", "dpk", "Paladin Daily Pick", { choiceOptions: ["d1", "d2"] }, { grantedBy: "class" });
mk("feature", "pj", "Profane Judgment", { settings: [{ type: "ondamage" }], hover: "Holy damage to a Profane creature: it is Enfeebled 1 (EoT)." }, { grantedBy: "class" });
mk("feature", "xp", "Escalation Passive", { choiceOptions: ["v", "w", "z"] }, { grantedBy: "class", choices: ["v"] });
mk("feature", "dv", "Divine Vigil", { settings: [{ type: "aura", auraSize: 3, minEscalation: 2 }] }, { grantedBy: "choice", talentId: "xp", choice: true });
mk("feature", "ft", "Field Training", { talents: 1 }, { grantedBy: "class" });
mk("talent", "br", "Brawler", { requirements: "", group: "combat" }, { slot: "ft:0" });
mk("feature", "rz", "Radiant Zeal", { category: "Paladin Escalation", settings: [{ type: "bonusdamage", minEscalation: 1 }] }, { grantedBy: "class" });   // v0.0.186: the Escalation section
mk("talent", "pa", "Patient Hunter", {}, {});
mk("feature", "bw", "Bulwark", {}, { grantedBy: "manual" });
mk("species", "hu", "Human", { attributes: { body: 1, mind: 0, appeal: 1, instinct: 0 }, speed: 5, reach: 1, size: 3, chosen: [] });
const byType = t => items.filter(i => i.type === t);
const flags = { featureOrder: ["pj", "dp"] };
const actor = { type: "character", items: Object.assign([...items], { get: id => items.find(i => i.id === id) }), itemTypes: { feature: byType("feature"), action: byType("action"), talent: byType("talent"), species: byType("species"), class: [{ id: "pal", name: "Paladin" }], weapon: [] },
  effects: [], statuses: T(), getFlag: (s, k) => flags[k], system: { level: 1, attributes: { body: 2, mind: 1, appeal: 1, instinct: 0 } } };
const { CharacterSheet } = await import(ROOTURL + "module/sheets.mjs");
const sheet = Object.create(CharacterSheet.prototype);
Object.defineProperty(sheet, "actor", { value: actor });
sheet._groupLabels = ["Class", "Talents", "Items", "Other", "Basic"];
const feature = (id, level = 1) => ({ id, name: items.find(i => i.id === id)?.name, uuid: `u.${id}`, level, unlocked: true });
const ctx = {
  classTab: { picks: "+1 Body, +1 Appeal | Weapon Modifier: Body | Power Modifier: Mind", features: [feature("dp"), feature("ep"), feature("dpk"), feature("pj"), feature("xp"), feature("ft"), feature("rz"), { name: "Aura of Courage", uuid: "u.ac", level: 3, unlocked: false }] },
  ...sheet._talentSlots()
};
const m = await sheet._featModel(ctx);
const show = c => `${c.name} [${c.kind}${c.detail ? ` | ${c.detail}` : ""}]${c.rows.length ? ` -> ${c.rows.map(r => (r.isLabel ? `[${r.name}${r.empty ? ": nothing chosen yet" : ""}]` : `${r.name} (${r.costLabel} | ${r.range} | ${r.freqText})`)).join(", ")}` : c.text ? ` text: ${c.text.replace(/<[^>]+>/g, "").slice(0, 40)}` : ""}${c.canRemove ? " (removable)" : ""}${c.open ? "" : " (folded)"}`;
console.log(m.classTitle, "|", m.picks);
for (const c of m.classCards) console.log("  ", show(c));
console.log("species:", show(m.species));
console.log("talents:", m.talentNote, "|", m.slots.map(s => (s.card ? show(s.card) : `empty slot ${s.key} from ${s.feature}`)).join(" || "), "| extras:", m.extras.map(show).join(", "));
console.log("others:", m.others.map(show).join(", "));
console.log("v0.0.186: Escalation section:", m.escCards.map(c => `${c.name} [${c.kind} | ${c.detail} | ${c.kcls}]`).join(", "), "| Escalation now", m.escNow,
  "| Talents by Category:", m.talentGroups.map(g => `${g.label}: ${g.cards.map(c => c.name).join(", ")}`).join(" ; "), "| empty slots:", m.emptySlots.length);
sheet._openFeat = new Set(["dp"]);
console.log("opened Divine Power stays open, the others start folded:", (await sheet._featModel(ctx)).classCards.map(c => `${c.name} ${c.open ? "open" : "folded"}`).join(", "));

const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), main = src("module/twod12.mjs");
console.log("--- the sheet: tabs:", tpl.includes('data-tab-target="favorites" data-tooltip="Favorites" aria-label="Favorites"><i class="fa-regular fa-star"></i></a>'), tpl.includes('data-tab-target="class">Features</a>'),
  "| cards fold:", tpl.includes('data-action="toggleFeat"'), "| slots kept:", tpl.includes('class="tfslot talentslot" data-slot="{{key}}"') && tpl.includes('class="tfslot talentslot extra" data-slot=""'), "| feature order saved:", sh.includes(`setFlag("twod12", flag, ids)`) && tpl.includes(`data-order-flag="featureOrder"`), "| non-Action rows open their card:", sh.includes('item.type === "action" ? await buildActionCard(item, { actor: this.actor, use: !row.classList.contains("ps-brw") }) : await buildInfoCard(item)'));
console.log("v0.0.133: band and panel always dark blue:", css.includes(".application.twod12.twod12-actor { --np-hb: #1e2a3a; --np-bg: #1e2a3a;") && !css.includes("ns-dark") && !main.includes("sheetDark"), "| Foundry's own title bar:", css.includes("> .window-header { background: var(--twod12-hdr)"), "| no padding:", css.includes("padding: 0 !important;"),
  "| Species above Class:", tpl.indexOf("Species &middot; {{feat.species.name}}") < tpl.indexOf("{{feat.classTitle}}</span>"), "| Expand / Collapse all:", tpl.includes('data-action="foldAll" data-open="1"') && tpl.includes('data-action="foldAll" data-open="0"'),
  "| description before Grants:", tpl.indexOf('<div class="fc-desc">') < tpl.indexOf('<div class="fc-grants-wrap">'), "| rows show only Unloaded:", sh.includes('const chips = out ? [{ text: "Unloaded"') && !sh.includes("...ch.chips"), "| Escalation cost as a chip:", css.includes(".twod12.sheet.ns .ar-esc { display: inline-block;"));
