// THE SAVE CARD REDESIGN (playtest 5, C10; Lucas: "it likely needs a redesign to fit the new system's design": quiet Tier rows, only the rolled
// one colored, the Tiers merged as the card writes them, the card's Effect line shown). The mockup: the real renderers and CSS of the system
// (the gallery's stubs), the current Save card next to the proposal, which uses the attack card's own parts (the stamp, the ladder, the Tier
// groups): no new look. ?theme=dark|light
const q = new URLSearchParams(location.search);
const theme = q.get("theme") ?? "dark";
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

const data = await (await fetch("../../gallery/data.json")).json();
globalThis.fromUuid = async u => { const d = data.names[u]; return d ? asItem({ ...d, id: u.split(".").pop() }) : null; };
globalThis.fromUuidSync = u => { const d = data.names[u]; return d ? asItem({ ...d, id: u.split(".").pop() }) : null; };
function asItem(d) {
  const s = d.system ?? {};
  return { id: d.id, uuid: d.id, name: d.name, type: d.type, img: d.img, getFlag: (sc, k) => d.flags?.twod12?.[k],
    system: { ...s, traits: new Set(s.traits ?? []), versions: s.versions ?? [], actions: s.actions ?? [] } };
}

const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();

const CL = await import("../../twod12/module/cardlines.mjs");
const CC = await import("../../twod12/module/chatcards.mjs"), ACT = await import("../../twod12/module/actions.mjs"), CFG = await import("../../twod12/module/config.mjs");
const { tierOfLabel } = await import("../../twod12/module/cardmodel.mjs");
const enrichCard = async (t, doc) => CFG.highlightText(await enrichHTML(t ?? "", doc ? { relativeTo: doc } : {}));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function modelOf(name, creatures) {
  const d = data.cards.find(c => c.name === name), item = asItem(d), it = item.system, v = it.versions[0];
  const card = await CL.versionCardLines(item, v, { enrich: enrichCard });
  const cardCtx = { item, weapon: null, isWeapon: it.traits.has("weapon"), attrMode: "", attrVal: 2 };
  const mk = await ACT.attackModelParts({ it, item, version: v, weapon: null, cardCtx, fxn: { all: [], t1: [], t2: [], t3: [] }, fxNames: () => "", areaSize: 0 });
  return { name: item.name, freq: CFG.effectiveFrequency(it), cost: it.reaction ? `${v.ap}R` : `${v.ap} AP`, traitsHtml: "", tline: { targets: it.targets ?? "", dist: mk.dist ?? "", names: creatures.map(c => c.name) },
    flavor: it.flavor ?? "", card, kind: "save", saveName: `${CFG.TWOD12.attributes[it.vs] ?? "Instinct"} Save`, dc: 13, tiers: mk.outcomes, creatures };
}
const roll = (name, total) => ({ name, uuid: name, result: { total, tier: total < 13 ? 1 : total < 20 ? 2 : 3, dc: 13, dcLabel: "DC", d1: [Math.min(12, total - 6)], d2: [6], boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 0, label: "Instinct" }], base: total < 13 ? 1 : total < 20 ? 2 : 3, crit: false, doubles: false, row: { tier: total < 13 ? 1 : total < 20 ? 2 : 3, total } } });

/** The proposal: the Tiers before the roll as the card writes them (quiet card lines, merged); after it, the attack card's stamp and ladder and
 *  only the rolled Tier's words; several creatures: a row each, then the Tiers rolled as the attack card's groups. */
function proposedSave(m) {
  const cs = m.creatures, one = cs.length <= 1, r = one ? cs[0]?.result : null, rolled = cs.filter(c => c.result);
  const out = t => CC.outcomeHtml(m.tiers?.[t], { none: "No effect." });
  // before the roll: each Tier as the card writes it, inline and quiet (no band, no rider box); a Tier with damage keeps its damage line
  const inline = t => { const o = m.tiers?.[t] ?? {}; return (o.parts ?? []).length ? out(t) : ((o.riders ?? []).join(" ") || "No effect."); };
  const quiet = (m.card?.tiers ?? ["Tier 1", "Tier 2", "Tier 3"]).map(l => `<div class="cc-trigger plain cc-line"><b>${esc(l)}:</b> ${inline(tierOfLabel(l))}</div>`).join("");
  let body;
  if (one && r) body = `<div class="cc-body">${CC.stampHtml({ ...r, dcLabel: "DC" })}<div class="cc-main">${CC.ladderHtml(r, { id: "s0" })}${CC.breakdownHtml(r, { save: true, id: "s0" })}<div class="cc-outcome">${out(r.tier)}</div></div></div>`;
  else if (!one && rolled.length) {
    const crows = cs.map((c, i) => `<div class="cc-crow">${c.result ? CC.tierPill(c.result.tier) : '<span class="cc-pill">&ndash;</span>'}<span class="cc-cname">${esc(c.name)}</span><span class="cc-cdef">${c.result ? `<span class="cc-stotal">${c.result.total}</span>` : '<button type="button" class="cc-btn small primary">Roll</button>'}</span></div>`).join("");
    const groups = [3, 2, 1].map(t => { const who = rolled.filter(c => c.result.tier === t); return who.length ? `<div class="cc-tgroup"><div class="cc-ghd">${CC.tierPill(t, false, true)}<span class="cc-who">${who.map(c => `<span class="cc-nchip">${esc(c.name)}</span>`).join("")}</span></div>${out(t)}</div>` : ""; }).join("");
    body = `<div class="cc-crows">${crows}</div>${groups}${rolled.length < cs.length ? quiet : ""}`;
  } else body = quiet;
  const after = m.card ? CC.cardLinesHtml(m.card.after) : "";
  const btn = one && !r ? `<div class="cc-btns"><button type="button" class="cc-btn primary">Roll ${esc(m.saveName)}</button></div>` : "";
  const flavor = m.flavor ? `${CC.divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "";
  return `<div class="cc-card cc-save cc-prop">${CC.headHtml(m)}${CC.metaLineHtml(m)}${CC.cardLinesHtml(m.card?.top)}<div class="cc-savehead"><b>${esc(m.saveName)}</b><span class="cc-rule" aria-hidden="true"></span><span class="cc-badge">DC ${m.dc}</span></div>${CC.cardLinesHtml(m.card?.before)}${body}${after}${btn}${flavor}${CC.footHtml(m, CC.FULL_VIEW, { hasDamage: false })}</div>`;
}

const chat = c => `<div id="chat-log"><li class="chat-message message flexcol"><div class="message-content">${c}</div></li></div>`;
const cases = [
  ["Rebuke, before the Save", "Rebuke", [{ name: "Orc Warrior", uuid: "o", result: null }]],
  ["Rebuke, the Orc rolled 14 (Tier 2)", "Rebuke", [roll("Orc Warrior", 14)]],
  ["Reckoning on three, two rolled", "Reckoning", [roll("Orc Warrior", 9), roll("Goblin Sneak", 21), { name: "Grave Wisp", uuid: "w", result: null }]]
];
const out = document.getElementById("grid");
for (const [title, name, cs] of cases) {
  const m = await modelOf(name, cs);
  let now = ""; try { now = CC.cardContent(m); } catch (e) { now = `<div>${e.message}</div>`; }
  const row = document.createElement("div"); row.className = "sc-row";
  row.innerHTML = `<div class="sc-cap">${esc(title)}</div><div class="sc-col"><div class="sc-h">Now</div>${chat(now)}</div><div class="sc-col"><div class="sc-h">Proposed</div>${chat(`<div class="twod12 chat cc">${proposedSave(m)}</div>`)}</div>`;
  out.append(row);
}
await document.fonts.ready;
document.body.dataset.ready = "1";
