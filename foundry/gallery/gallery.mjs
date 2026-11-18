// Pack CARD-ONE step 1 (Lucas, 2026-11-17: "make sure in the future we don't have this problem anymore"): the card gallery. It runs the system's
// own modules in the browser (a real DOM: the inline buttons are the real enrichers' output) on the compendium's cards (data.json, written by
// tools/gallery/data.mjs) and draws every card in each face inside each surface's real markup (the sheet's open row, a chat message, the hover
// tooltip, the HUD's card), in Foundry's dark or light scheme. tools/gallery/shoot.mjs screenshots it and compares with the saved shots.
// The page reads ?theme=dark|light&wrap=sheet|chat|tooltip|hud|dialog|bar&face=full|solo|roll|result|short&from=0&to=20 (all cards when from / to are left out).
// Step 3: face=roll is the roll dialog's card (rolldlg.mjs cardHtml) and face=result the chat card of the Action's result (chatcards.mjs: the
// attack card at a Tier 2 on one target, the Save card before its roll, the no-roll card), both with the card's lines (cardlines.mjs).
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
const CL = await import("../twod12/module/cardlines.mjs");
const CFG = await import("../twod12/module/config.mjs");
let RD = null, CC = null, ACT = null, SB = null;
// v0.0.441 (pack SHEETS-HUD): the one-page NPC sheet's stat block face is retired with that sheet; face=short is the small sheets' short card
// under its Action bar (sheetmodel.mjs actionBar; actioncard.mjs buildActionCard({ short }))
if (face === "short") SB = await import("../twod12/module/sheetmodel.mjs");
if (face === "roll" || face === "result") { RD = await import("../twod12/module/rolldlg.mjs"); CC = await import("../twod12/module/chatcards.mjs"); ACT = await import("../twod12/module/actions.mjs"); }
const enrichCard = async (t, doc) => CFG.highlightText(await enrichHTML(t ?? "", doc ? { relativeTo: doc } : {}));
/** Step 3's two faces of one Version (the first), built by the real code (actions.mjs attackModelParts, the chat renderers) on a fixed result. */
async function oneVersionFace(item) {
  const it = item.system, v = (it.versions ?? [])[0];
  if (!v) return "<i>no Version</i>";
  const card = await CL.versionCardLines(item, v, { enrich: enrichCard });
  const fxn = { all: [], t1: [], t2: [], t3: [] }, cardCtx = { item, weapon: null, isWeapon: it.traits.has("weapon"), attrMode: "", attrVal: 2 };
  const mk = v.noTiers ? { outcomes: {}, effectsHtml: v.effects ? await enrichCard(v.effects, item) : "", dist: CFG.distanceText(it), areaHtml: "" } : await ACT.attackModelParts({ it, item, version: v, weapon: null, cardCtx, fxn, fxNames: () => "", areaSize: 0, chip: "Weapon" });
  const freq = CFG.effectiveFrequency(it), cost = it.reaction ? `${v.ap}R` : `${v.ap} AP`, save = it.traits.has("save");
  if (face === "roll") {
    const inp = { name: item.name, flavor: it.flavor ?? "", freqLabel: freq, freqColor: "#5F5E5A", roll: { name: "Weapon", mod: 2 }, canForce: false, chips: [], versions: [] };
    const rv = { ap: v.ap, cost, traits: [...it.traits].map(k => ({ key: k, label: CFG.TWOD12.traits[k] ?? k, group: CFG.traitGroupOf(k) })), meta: { targets: it.targets ?? "", dist: CFG.distanceText(it), vs: CFG.vsText(it, { rolls: true }) },
      tiers: mk.outcomes, crit: v.critical ? await enrichCard(v.critical, item) : "", effects: mk.effectsHtml, effectsFrom: 2, noTiers: !!v.noTiers, card };
    return `<div class="rd"><div class="rd-body rd-cardbody">${RD.cardHtml(inp, { forceTier: 0, toggled: {}, manual: {} }, rv)}</div></div>`;
  }
  const m = { name: item.name, freq, cost, traitsHtml: "", tline: { targets: it.targets ?? "", dist: mk.dist ?? "", names: ["Orc Warrior"] }, flavor: it.flavor ?? "", card };
  if (v.noTiers) return CC.cardContent({ ...m, kind: "noroll", effectHtml: mk.effectsHtml });
  if (save) return CC.cardContent({ ...m, kind: "save", saveName: "Instinct Save", dc: 13, tiers: mk.outcomes, creatures: [{ uuid: "t1", name: "Orc Warrior", result: null }] });
  const row = { name: "Orc Warrior", uuid: "t1", total: 15, dc: 15, dcLabel: "AD", d1: [6], d2: [7], boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Weapon" }], tier: 2, base: 2, crit: false, doubles: false };
  return CC.cardContent({ ...m, kind: "attack", hasDamage: true, outcomes: mk.outcomes, effectsHtml: mk.effectsHtml, effectsFrom: 2, critHtml: v.critical ? await enrichCard(v.critical, item) : "", rows: [row] });
}

// --- the surfaces, as Foundry and the system draw them around a card
const WRAP = {
  sheet: c => `<div class="application twod12 twod12-actor themed theme-${theme}"><div class="window-content"><div class="twod12 sheet pcs"><div class="ar ps-row open"><div class="ar-card">${c}</div></div></div></div></div>`,
  chat: c => `<div id="chat-log"><li class="chat-message message flexcol"><div class="message-content">${c}</div></li></div>`,
  tooltip: c => `<aside id="tooltip" class="active" role="tooltip">${c}</aside>`,
  hud: c => `<div class="twod12-hudcard"><button type="button" class="hc-x">&times;</button>${c}</div>`,
  dialog: c => `<div class="application twod12 rolldlg themed theme-${theme}"><div class="window-content">${c}</div></div>`,
  bar: (c, b) => `<div class="application twod12 twod12-actor themed theme-${theme}"><div class="window-content"><div class="twod12 sheet pcs ps2"><div class="ar ps2-oa open"><div class="ps2-bar"><span class="ps2-sts">${b.stamps.map(x => `<button type="button" class="ps2-st">${x.label}</button>`).join("")}</span><a class="ps-nm">${b.name}</a><span class="ps2-dv">${b.dist}${b.dist && b.vs ? " &middot; " : ""}${b.vs ? `<b>${b.vs}</b>` : ""}</span><span class="ps2-fq"><i class="fq-${b.fq}"></i>${b.fqWord}</span></div><div class="ar-card">${c}</div></div></div></div></div>`
};
const out = document.getElementById("cards");
const list = data.cards.slice(from, to);
for (const d of list) {
  const item = asItem(d);
  let html = "", bar = null;
  try {
    if ((face === "roll" || face === "result" || face === "short") && item.type !== "action") continue;   // a Feature has no roll, no result, no Action bar
    if (face === "short") { const it = item.system; bar = { name: item.name, ...SB.actionBar({ aps: (it.versions ?? []).map(v => v.ap), reaction: !!it.reaction, frequency: CFG.effectiveFrequency(it), escalation: Number(it.escalation) || 0, dist: SB.distanceShort(CFG.distanceText(it, null)), vs: SB.vsShort(CFG.vsText(it, {})) }) }; }
    html = face === "short" ? await AC.buildActionCard(item, { short: true }) : face === "roll" || face === "result" ? await oneVersionFace(item) : face === "solo" ? await AC.buildSoloCard(item) : item.type === "action" ? await AC.buildActionCard(item, { use: false }) : await AC.buildFeatureCard(item);
  } catch (e) { html = `<div class="gal-err">${d.name}: ${String(e.message ?? e)}</div>`; }
  const box = document.createElement("div");
  box.className = "gal-card";
  box.dataset.card = d.name;
  box.innerHTML = `<div class="gal-name">${d.name}</div>${(WRAP[wrap] ?? WRAP.sheet)(html, bar)}`;
  out.append(box);
}
// v0.0.439: a chunk with no Action in an Action-only face (the Species and Classes) still has something to shoot
if (!out.children.length) out.innerHTML = '<div class="gal-card"><div class="gal-name">(no Action in these cards)</div></div>';
// every card's box a multiple of 16 px high (the JPEG blocks): a card that grows doesn't change how the cards after it are compressed
await document.fonts.ready;
for (const el of document.querySelectorAll(".gal-card")) el.style.minHeight = `${Math.ceil(el.getBoundingClientRect().height / 16) * 16}px`;
document.body.dataset.ready = "1";
