// The sheet mockups (playtest 5, E1 / E2 / E3 / E6): Foundry, as little of it as the system's own modules need to draw in a browser (the card
// gallery's stubs, foundry/gallery/gallery.mjs, plus the data-model stubs data.mjs needs so the real prepareDerivedData gives the numbers).
const deepClone = o => JSON.parse(JSON.stringify(o ?? null));
const SETTINGS = { highlightTraits: true, designerMode: false, enforceHands: true };
const enrichers = [];
export async function enrichHTML(text, options = {}) {
  let s = String(text ?? "");
  for (const e of enrichers) {
    const re = new RegExp(e.pattern.source, e.pattern.flags.includes("g") ? e.pattern.flags : e.pattern.flags + "g");
    const parts = [];
    let last = 0;
    for (const m of s.matchAll(re)) {
      parts.push(s.slice(last, m.index));
      try { const el = await e.enricher(m, options); parts.push(el ? (el.outerHTML ?? String(el)) : m[0]); } catch (err) { parts.push(m[0]); console.warn("enricher", err); }
      last = m.index + m[0].length;
    }
    parts.push(s.slice(last));
    s = parts.join("");
  }
  return s.replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "<a class=\"content-link\">$1</a>");
}
class Field { constructor(...a) { this.args = a; } }
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {}, HandlebarsApplicationMixin: c => c }, ux: { TextEditor: { implementation: { enrichHTML } } }, sheets: { ActorSheetV2: class {}, ItemSheetV2: class {} } },
  utils: { deepClone, setProperty() {}, debounce: f => f, mergeObject: (a, b) => ({ ...a, ...b }) },
  abstract: { TypeDataModel: class { static migrateData(s) { return s; } } },
  data: { fields: { SchemaField: Field, NumberField: Field, StringField: Field, BooleanField: Field, ArrayField: Field, SetField: Field, HTMLField: Field, ObjectField: Field } }
};
globalThis.CONFIG = { TextEditor: { enrichers }, statusEffects: [], time: {}, Canvas: {} };
globalThis.game = { settings: { get: (s, k) => SETTINGS[k] ?? false, register() {} }, user: { isGM: true, id: "u1", targets: new Set(), getFlag: () => undefined }, combat: null, items: [], actors: [], packs: new Map(), i18n: { localize: k => k }, time: { worldTime: 0 } };
globalThis.Hooks = { on() {}, once() {}, call() {}, callAll() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.canvas = { tokens: { placeables: [], controlled: [] } };
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "Token", "TokenDocument"]) globalThis[n] ??= class {};

/** An item of the compendium as the modules read one (the gallery's asItem, with its creature). */
export function asItem(d, parent = null) {
  const s = d.system ?? {};
  return { id: d.id, _id: d.id, uuid: d.id, name: d.name, type: d.type, img: d.img, flags: d.flags ?? {}, parent, actor: parent, getFlag: (sc, k) => d.flags?.[sc]?.[k],
    system: { ...s, traits: new Set(s.traits ?? []), versions: s.versions ?? [], actions: s.actions ?? [] } };
}
