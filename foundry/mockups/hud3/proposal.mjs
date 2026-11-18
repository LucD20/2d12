// The HUD mockup (playtest 5, group D): the proposal. The marks, the Health bars and the Action lines are the system's own (hudview.mjs
// marksHtml, escHtml, barHtml, lineHtml, colsHtml); the identity column (D2), the conditions as icons (D4), the Basic tab (D1) and the right
// column (D3 / D7: the Situational section, the Hands, the macro bar) are the mockup's (hud3.css, the classes h3-*).
import { colsOf } from "./model.mjs";
const HV = await import("../../twod12/module/hudview.mjs");
const { TWOD12, FREQ_COLORS } = await import("../../twod12/module/config.mjs");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* The condition pictures. In Foundry they are the status effects' own (twod12.mjs CONFIG.statusEffects: icons/svg/falling.svg for Prone,
   icons/svg/downgrade.svg for Hindered...), which are Foundry's files and not in the repository: these stand in for them. */
const COND_ICON = {
  Prone: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="14.5" r="2.6"/><path d="M9 13h11.5a1.5 1.5 0 0 1 0 3H9zM3 19h18v1.6H3z"/></svg>',
  Hindered: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.6 5 5.8 6.9 4 12 9l5.1-5L19 5.8zM12 20l-7-6.8 1.9-1.8L12 16.4l5.1-5 1.9 1.8z"/></svg>',
  Immobilized: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h18v18H3zm2 2v4h4V5zm6 0v4h2V5zm4 0v4h4V5zM5 11v2h4v-2zm6 0v2h2v-2zm4 0v2h4v-2zM5 15v4h4v-4zm6 0v4h2v-4zm4 0v4h4v-4z"/></svg>',
  Dazed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 5.6L20 9l-4.4 3.8L17 19l-5-3.2L7 19l1.4-6.2L4 9l5.8-.4z"/></svg>',
  Lingering: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 4.6 6 7.8 6 11a6 6 0 0 1-12 0c0-3.200 2.500-6.400 6-11z"/></svg>'
};
/** D4: the conditions under AP / Esc. words: the name beside each icon while they fit (the proposal); false: icons only. */
export function condsHtml(conds = [], { words = true, max = 3 } = {}) {
  if (!conds.length) return '<div class="h3-conds"></div>';
  const few = words && conds.length <= max;
  return `<div class="h3-conds${few ? "" : " ic"}">${conds.map(c => `<button type="button" class="h3-c" aria-label="${esc(`${c.name}${c.dur ? ` (${c.dur})` : ""}: open the Effect`)}"><i>${COND_ICON[c.name] ?? COND_ICON.Dazed}</i>${few ? `<span>${esc(c.name)}${c.dur ? ` <small>${esc(c.dur)}</small>` : ""}</span>` : (c.dur ? `<small>${esc(c.dur)}</small>` : "")}</button>`).join("")}</div>`;
}

/** D2: the identity column. */
function idHtml(h, opts) {
  const s = h.s;
  const pair = (k, v, cls = "") => `<span class="h3-p${cls ? ` ${cls}` : ""}"><span class="k">${esc(k)}</span><b>${esc(v)}</b></span>`;
  const attr = x => `<button type="button" class="h3-p at" aria-label="${esc(`${x.label}: click a Check, Shift-click a Save`)}"><span class="k">${esc(x.label)}</span><b>${esc(x.value)}</b></button>`;
  return `<div class="h3-id"><div class="nm"><b>${esc(h.name)}</b><small>${esc(h.sub)}</small></div>`
    + `<div class="hb-bars">${h.bars.map(HV.barHtml).join("")}</div>`
    + `<div class="h3-l">${pair("Guard", h.guard)}${pair("Rally", `${h.rally.left}/${h.rally.max}`)}<button type="button" class="hb-btn">Steel Yourself</button></div>`
    + `<div class="h3-l">${`<span class="h3-p"><span class="k">AP</span>${HV.marksHtml(h.marks)}</span>`}<span class="h3-p"><span class="k">Esc.</span>${HV.escHtml(h.escN, h.escMax)}<b>${h.escN}</b></span></div>`
    + condsHtml(h.S.conds ?? [], opts)
    + `<div class="h3-l rule">${pair("AD", s.armorDC)}${pair("WD", s.wardDC)}${pair("Speed", h.speed, h.speed !== h.base ? "chg" : "")}<i class="sep"></i>${pair("Weapon", h.sg(s.weaponMod ?? 0))}${pair("Power", h.sg(s.powerMod ?? 0))}</div>`
    + `<div class="h3-l">${h.attrs.map(attr).join("")}</div></div>`;
}

/** D1: the Basic tab: the sheet's four groups (config.mjs basicGroups), every Basic Action one line, its cost stamps the Use buttons. */
function basicHtml(h) {
  const by = new Map(h.list.filter(x => x.basic && !x.reaction).map(x => [x.name, x]));
  const stamp = (x, v) => (v.off ? `<button type="button" class="hb-st no" disabled title="${esc(v.why)}">${esc(v.label)}</button>` : `<button type="button" class="hb-st" aria-label="${esc(`Use ${x.name}, ${v.label}`)}">${esc(v.label)}</button>`);
  const row = x => `<div class="h3-bl${x.versions.every(v => v.off) ? " off" : ""}${x.strike ? " strike" : ""}" style="--fq:${esc(x.fq)}"><b>${esc(x.name)}</b><span class="hb-sts">${x.versions.every(v => v.used) ? '<span class="hb-pv used">used</span>' : x.versions.map(v => stamp(x, v)).join("")}</span></div>`;
  return `<div class="h3-basic">${TWOD12.basicGroups.map(g => `<div class="h3-bg"><div class="h3-bh">${esc(g.label)}</div>${g.names.map(n => by.get(n)).filter(Boolean).map(row).join("")}</div>`).join("")}</div>`;
}

/** D3 / D7: one thing waiting in the Situational section. it: { lead, tag, text, btns: [{ label, q (the quiet one) }], note } */
function sitItem(it) {
  const btns = (it.btns ?? []).map(b => `<button type="button" class="hb-btn${b.q ? " q" : ""}">${esc(b.label)}</button>`).join("");
  return `<div class="h3-si${it.inline ? " inline" : ""}"><div class="h"><b>${esc(it.lead)}</b>${it.tag ? `<span class="tg">${esc(it.tag)}</span>` : ""}${it.inline ? `<span class="bs">${btns}</span>` : ""}</div>${it.text ? `<div class="t">${it.text}</div>` : ""}${it.inline ? "" : `<div class="bs">${btns}</div>`}</div>`;
}
function sideHtml(h, hotbar) {
  const sit = h.S.sit ?? [];
  const hands = h.tiles.map(t => `<button type="button" class="h3-hand${t.free ? " free" : ""}" aria-label="${esc(t.tip)}"><span>${esc(t.name)}</span><b>${esc(t.grip)}</b></button>`).join("");
  return `<div class="h3-side"><div class="h3-sit${sit.length ? " on" : ""}">${sit.length ? sit.map(sitItem).join("") : '<span class="h3-none">Nothing waiting.</span>'}</div><div class="h3-hands">${hands}</div><div class="h3-hot">${hotbar}</div></div>`;
}

/** The proposed bar. */
export function proposalHtml(h, { hotbar = "", conds = {} } = {}) {
  const S = h.S, tab = S.tab ?? "act";
  const cols = tab === "rx" ? colsOf(h.rx) : tab === "esc" ? colsOf(h.escLines).map((c, i) => ({ ...c, label: i ? "" : "Escalation" })) : colsOf(h.act);
  const tabs = `<div class="hb-tabs" role="tablist">${h.tabs.map(t => `<button type="button" class="hb-tab" role="tab" aria-selected="${t.k === tab}">${esc(t.label)} <small>${esc(String(t.count ?? ""))}</small></button>`).join("")}</div>`;
  const por = `<div class="hb-por"><img src="${esc(h.img)}" alt=""><button type="button" class="hb-fold" aria-label="Fold the HUD">&#9662;</button></div>`;
  return `<div class="twod12-hud is-bar h3"><div class="h3-wrap">${por}${idHtml(h, conds)}<div class="hb-mid">${tabs}${tab === "basic" ? basicHtml(h) : HV.colsHtml(cols)}</div>${sideHtml(h, hotbar)}</div></div>`;
}
