// Pack CARD-ONE step 1 (Lucas, 2026-11-17: "make sure in the future we don't have this problem anymore"): the card gallery. It runs the system's
// own modules in the browser (a real DOM: the inline buttons are the real enrichers' output) on the compendium's cards (data.json, written by
// tools/gallery/data.mjs) and draws every card in each face inside each surface's real markup (the sheet's open row, a chat message, the hover
// tooltip, the HUD's card), in Foundry's dark or light scheme. tools/gallery/shoot.mjs screenshots it and compares with the saved shots.
// The page reads ?theme=dark|light&wrap=sheet|chat|tooltip|hud&face=full|solo&from=0&to=20 (all cards when from / to are left out).
const q = new URLSearchParams(location.search);
const theme = q.get("theme") ?? "dark", wrap = q.get("wrap") ?? "sheet", face = q.get("face") ?? "full";
const from = Number(q.get("from") ?? 0), to = Number(q.get("to") ?? 9999);
document.body.classList.add(`theme-${theme}`);

// --- Foundry, as little of it as the card needs (the tests' stubs, with a real DOM)
const deepClone = o => JSON.parse(JSON.stringify(o ?? null));
const SETTINGS = { highlightTraits: true, designerMode: false, enforceHands: true };
const enrichers = [];
async function enrichHTML(text, options = {}) {
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
  // a compendium link reads as its label
  return s.replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "<a class=\"content-link\">$1</a>");
}
globalThis.foundry = { applications: { api: { ApplicationV2: class {}, DialogV2: {}, HandlebarsApplicationMixin: c => c }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone, setProperty() {}, debounce: f => f, mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.CONFIG = { TextEditor: { enrichers }, statusEffects: [], time: {}, Canvas: {} };
globalThis.game = { settings: { get: (s, k) => SETTINGS[k] ?? false, register() {} }, user: { isGM: true, id: "u1", targets: new Set(), getFlag: () => undefined }, combat: null, items: [], actors: [], packs: new Map(), i18n: { localize: k => k } };
globalThis.Hooks = { on() {}, once() {}, call() {}, callAll() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.canvas = { tokens: { placeables: [], controlled: [] } };
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "Token", "TokenDocument"]) globalThis[n] ??= class {};

const data = await (await fetch("data.json")).json();
globalThis.fromUuid = async u => { const d = data.names[u]; return d ? asItem({ ...d, id: u.split(".").pop() }) : null; };
globalThis.fromUuidSync = u => { const d = data.names[u]; return d ? asItem({ ...d, id: u.split(".").pop() }) : null; };
function asItem(d) {
  const s = d.system ?? {};
  return { id: d.id, uuid: d.id, name: d.name, type: d.type, img: d.img, getFlag: (sc, k) => d.flags?.twod12?.[k],
    system: { ...s, traits: new Set(s.traits ?? []), versions: s.versions ?? [], actions: s.actions ?? [] } };
}

const { registerInline } = await import("../twod12/module/inline.mjs");
registerInline();
const AC = await import("../twod12/module/actioncard.mjs");

// --- the surfaces, as Foundry and the system draw them around a card
const WRAP = {
  sheet: c => `<div class="application twod12 twod12-actor themed theme-${theme}"><div class="window-content"><div class="twod12 sheet pcs"><div class="ar ps-row open"><div class="ar-card">${c}</div></div></div></div></div>`,
  chat: c => `<div id="chat-log"><li class="chat-message message flexcol"><div class="message-content">${c}</div></li></div>`,
  tooltip: c => `<aside id="tooltip" class="active" role="tooltip">${c}</aside>`,
  hud: c => `<div class="twod12-hudcard"><button type="button" class="hc-x">&times;</button>${c}</div>`
};
const out = document.getElementById("cards");
const list = data.cards.slice(from, to);
for (const d of list) {
  const item = asItem(d);
  let html = "";
  try {
    html = face === "solo" ? await AC.buildSoloCard(item) : item.type === "action" ? await AC.buildActionCard(item, { use: false }) : await AC.buildFeatureCard(item);
  } catch (e) { html = `<div class="gal-err">${d.name}: ${String(e.message ?? e)}</div>`; }
  const box = document.createElement("div");
  box.className = "gal-card";
  box.dataset.card = d.name;
  box.innerHTML = `<div class="gal-name">${d.name}</div>${(WRAP[wrap] ?? WRAP.sheet)(html)}`;
  out.append(box);
}
document.body.dataset.ready = "1";
