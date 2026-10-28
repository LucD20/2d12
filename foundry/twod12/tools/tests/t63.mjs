// Run with: node tools/tests/run.mjs (or node tools/tests/t63.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s, setProperty: (o, path, v) => { const ks = path.split('.'); let c = o; for (const k of ks.slice(0, -1)) c = c[k] ??= {}; c[ks.at(-1)] = v; } }, data: { fields: Object.fromEntries(["SchemaField","NumberField","StringField","BooleanField","ArrayField","SetField","HTMLField"].map(n => [n, class {}])) }, abstract: { TypeDataModel: class {} } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null };
globalThis.ui = { notifications: { info: m => (globalThis.__info = m), warn: m => (globalThis.__warn = m) } };
const T = (...t) => new Set(t);
const cf = await import(ROOT + "module/config.mjs");
const act = (name, category, flags = {}, extra = {}) => ({ id: name, name, type: "action", img: "i", uuid: `Compendium.x.${name}`, getFlag: (s, k) => flags[k], toObject: () => ({ name, type: "action", img: "i", system: { category, ...extra }, flags: {} }), system: { category, traits: T(), versions: [{ ap: 1 }], modifiers: [], frequency: "", ...extra } });
const aim = act("Aim", "Talent"), pummel = act("Pummel", "Brawler"), granted = act("Rimebrand", "Talent", { talentId: "t1" }), basic = act("Fists", "Basic Action", { basic: "fists" });
console.log("isTalentAction:", [aim, pummel, granted, basic].map(i => `${i.name}=${cf.isTalentAction(i)}`).join(" "));
// the sheet: slots and extras include Talent Actions
const { CharacterSheet } = await import(ROOT + "module/sheets.mjs");
const sheet = Object.create(CharacterSheet.prototype);
const feature = { id: "dc", name: "Divine Connection", system: { talents: 2 } };
const slotted = act("Opportunity Attack", "Talent", { slot: "dc:0" }), extra = act("Aim", "Talent"), talentItem = { id: "bl", name: "Battering Charge", type: "talent", img: "i", getFlag: () => undefined, system: { category: "Talent", level: 1, traits: T(), requirements: "", frequency: "" } };
Object.defineProperty(sheet, "actor", { value: { items: [], itemTypes: { feature: [feature], talent: [talentItem], action: [slotted, extra, pummel, basic] } } });
const m = sheet._talentSlots();
console.log("slot 1:", m.talentSlots[0].talent?.name, "| slot 2 empty:", m.talentSlots[1].talent === null, "| extras:", m.talents.map(t => t.name).join(", "));
console.log("group on the Actions tab:", sheet._groupOf(slotted), sheet._groupOf(pummel), sheet._groupOf(basic));
console.log("a Talent Action dropped anywhere goes to the first empty slot:", sheet._slotFor({ target: { closest: () => null } }, aim), "| a non-Talent Action gets none:", JSON.stringify(sheet._slotFor({ target: { closest: () => null } }, pummel)));
// dropping
const { handleDrop } = await import(ROOT + "module/grants.mjs");
let created = null;
const pc = { type: "character", name: "Kai", items: [], createEmbeddedDocuments: async (t, d) => { created = d; } };
await handleDrop(pc, aim, { slot: "dc:1" });
console.log("dropped on slot dc:1:", created?.[0]?.flags?.twod12?.slot, "| source kept:", !!created?.[0]?.flags?.twod12?.sourceUuid);
created = null; await handleDrop(pc, aim, { slot: "" });
console.log("dropped on the extra zone: slot flag", JSON.stringify(created?.[0]?.flags?.twod12?.slot ?? null));
created = null; await handleDrop(pc, pummel, { slot: "dc:1" });
console.log("a non-Talent Action keeps the old behavior (no slot):", JSON.stringify(created?.[0]?.flags?.twod12?.slot ?? null));
// modifiers on a Talent Action are read too
const { talentModsFor } = await import(ROOT + "module/actions.mjs");
const oa = act("Opportunity Attack", "Talent", {}, { modifiers: [{ spec: "category:Weapon Technique", when: "always", critical: "You disrupt it.", effects: "" }] });
const tech = act("Reaping Sweep", "Weapon Technique");
console.log("modifiers from a Talent Action:", talentModsFor({ itemTypes: { talent: [], action: [oa, tech] } }, tech).map(x => x.talent + ": " + x.critical).join(" | "));
