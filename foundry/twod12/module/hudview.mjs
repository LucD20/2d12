// v0.0.390 (PACK HUD2; Lucas, 2026-11-17: "All your picks"; the draft foundry/mockups/hud2/index.html, the brief foundry/mockups/hud2-brief.md):
// the HUD remade after Lucas's 4e module. Pure: the HTML from a model (test t254); module/hud.mjs builds the models and handles the clicks.
//   Nothing selected: the party strip (a small card per PC, Momentum at its left). One token: its bar (the portrait, the identity column, tabs by
//   kind over columns by Frequency, the side panel), or folded to one line. Several tokens: their cards.
//   The marks (book/research/ui-marks-and-state.md): AP squares, the Reaction AP a diamond, Strikes slashes, a hairline between them, the same shapes
//   on every turn (the carousel's out-of-turn diamonds of v0.0.201 are gone); a filled mark is one still there. AP above the maximum (an effect that grants AP) and a second Reaction AP add marks of the same kind.
import { esc } from "./util.mjs";

export const HUD_TABS_PC = [["act", "Actions"], ["rx", "Reactions"], ["basic", "Basic"], ["esc", "Escalation"]];
export const HUD_TABS_NPC = [["act", "Attacks"], ["rx", "Reactions"], ["basic", "Basic"]];
export const FREQ_ORDER = ["granted", "atwill", "turn", "round", "encounter", "daily", "none"];
export const FREQ_LABEL = { granted: "Granted", atwill: "At-will", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily", none: "No Frequency" };
const n0 = v => Math.max(0, Math.trunc(Number(v)) || 0);

/**
 * The marks. m = { ap, max (the AP regained this turn, Quickened and Slowed counted), slowed, rap, rapMax, strikes, strikeMax, showStrikes }.
 * Squares: max + slowed of them, the last `slowed` struck; AP above that (granted) add filled squares. Diamonds: one per Reaction AP the creature can
 * have (2 with a second one). Slashes: the turn's Strikes.
 */
export function apSquares({ ap = 0, max = 4, slowed = 0 } = {}) {
  ap = n0(ap); max = n0(max); slowed = n0(slowed);
  const room = max, n = Math.max(room + slowed, ap + slowed);
  return Array.from({ length: n }, (_, k) => (k >= n - slowed ? "x" : k < ap ? "on" : ""));
}
export function marksHtml(m = {}) {
  // a filled mark is one still there: an AP, the Reaction AP, a Strike left this turn (as the carousel always drew them)
  const sq = apSquares(m), rapMax = Math.max(1, n0(m.rapMax ?? 1), n0(m.rap)), sMax = n0(m.strikeMax ?? 3) || 3, left = Math.max(0, sMax - n0(m.strikes));
  const squares = `<span class="hm-ap">${sq.map(c => `<i${c ? ` class="${c}"` : ""}></i>`).join("")}</span>`;
  const diamonds = `<span class="hm-r">${Array.from({ length: rapMax }, (_, k) => `<i${k < n0(m.rap) ? ' class="on"' : ""}></i>`).join("")}</span>`;
  const slashes = m.showStrikes === false ? "" : `<b class="hm-sep"></b><span class="hm-sk">${Array.from({ length: sMax }, (_, k) => `<i${k < left ? ' class="on"' : ""}></i>`).join("")}</span>`;
  return `<span class="hm">${squares}<b class="hm-sep"></b>${diamonds}${slashes}</span>`;
}
/** Escalation ticks (max from the system's config: 3 today, 6 once Foundry follows the book). */
export const escHtml = (n, max) => `<span class="hm-esc">${Array.from({ length: n0(max) }, (_, k) => `<i${k < n0(n) ? ' class="on"' : ""}></i>`).join("")}</span>`;

/** One threshold's bar: what is left of it (Vigor 18/23), its Nonlethal damage hatched beside the fill. b = { name, cls ("v" | "r"), left, max, nl } */
export function barHtml(b) {
  const max = Math.max(1, n0(b.max)), left = Math.min(max, n0(b.left)), nl = Math.min(max - left, n0(b.nl));
  const pct = x => Math.round((x / max) * 1000) / 10;
  return `<div class="hb-bar ${esc(b.cls)}" title="${esc(`${b.name}: ${left} of ${n0(b.max)} left${nl ? ` (${nl} Nonlethal damage)` : ""}`)}"><i style="width:${pct(left)}%"></i>${nl ? `<u style="left:${pct(left)}%;width:${pct(nl)}%"></u>` : ""}<span><b>${left}/${n0(b.max)}</b></span></div>`;
}
const barsHtml = bars => `<div class="hb-bars">${(bars ?? []).map(barHtml).join("")}</div>`;
/** A state tag: Bloodied, Strained, or the Down state (one word, never only a tint). */
const tagHtml = t => (t ? `<span class="hb-tag ${esc(t.cls ?? "")}">${esc(t.text)}</span>` : "");

/** A party card. c = { key, name, img, ini, sub, ad, wd, speed, speedTip, rally, marks (html or ""), esc (html or ""), guard, tag, bars, cond } */
export function partyCardHtml(c) {
  const stat = (v, l, tip = "") => `<div><b${tip ? ' class="chg"' : ""}>${esc(v)}</b><small>${esc(l)}</small></div>`;
  return `<div class="hb-pc" data-hud="party" data-key="${esc(c.key)}" role="button" tabindex="0">`
    + `<div class="top">${c.img ? `<img class="av" src="${esc(c.img)}" alt="">` : `<span class="av">${esc(c.ini ?? "")}</span>`}<div><div class="nm">${esc(c.name)}</div><div class="cl">${esc(c.sub ?? "")}</div></div></div>`
    + `<div class="st">${stat(c.ad, "AD")}${stat(c.wd, "WD")}${stat(c.speed, "Speed", c.speedTip)}${stat(c.rally ?? "—", "Rally")}</div>`
    + `<div class="row">${c.marks ?? ""}${c.esc ?? ""}${tagHtml(c.tag) || (c.guard ? `<span class="hb-tag">Guard ${n0(c.guard)}</span>` : "<span></span>")}</div>`
    + `${barsHtml(c.bars)}<div class="cond">${esc(c.cond || "")}&nbsp;</div></div>`;
}
/** The party strip: Momentum at its left (v0.0.407: the party's number, 0 to 4, shown even at 0; "" leaves it out: several tokens selected), then the cards. */
export const partyStripHtml = ({ cards = [], momentum = "" } = {}) => `<div class="hb-strip">${momentum !== "" && momentum !== null ? `<div class="hb-mom" data-hud-mom="1">Momentum <b>${esc(momentum)}</b></div>` : ""}${cards.map(partyCardHtml).join("") || '<span class="hb-none">No characters yet.</span>'}</div>`;

/** A line of a column: the Action's name, its cost stamps (each a Version; struck when it can't be used), the roll or what to know under it. */
/** A cost stamp (a Version's Use button; struck when it can't be used, its reason the one hover text). l: its line; s: { ap, label, off, why } */
const stampHtml = (l, s) => (s.off
  ? `<button type="button" class="hb-st no" disabled title="${esc(s.why || "")}">${esc(s.label)}</button>`
  : `<button type="button" class="hb-st" data-hud="${l.grant ? "grant" : "use"}" data-ap="${n0(s.ap)}"${l.grant ? ` data-effect="${esc(l.grant.effect)}" data-index="${n0(l.grant.index)}"${l.grant.target ? ` data-target="${esc(l.grant.target)}"` : ""}` : ""} aria-label="${esc(`Use ${l.name}, ${s.label}`)}">${esc(s.label)}</button>`);
export function lineHtml(l) {
  const stamp = s => stampHtml(l, s);
  const cls = ["hb-ln", l.used ? "used" : "", l.pass ? "pass" : "", l.ready ? "ready" : "", l.dim ? "dim" : ""].filter(Boolean).join(" ");
  // v0.0.393 (Lucas: "difficult to see what has been used"): a used Action shows the word, not struck stamps; its name is struck through
  const stamps = l.pass ? `<span class="hb-pv">${esc(l.state ?? "")}</span>` : l.used ? '<span class="hb-pv used">used</span>' : (l.stamps ?? []).map(stamp).join("");
  return `<div class="${cls}" data-item-id="${esc(l.id ?? "")}"${l.pass ? "" : ` data-hud="line"`}><b>${esc(l.name)}</b><span class="hb-sts">${stamps}</span>${l.sub ? `<span class="r">${esc(l.sub)}</span>` : ""}</div>`;
}
/** The columns of a tab: one per Frequency that has something, its word with its small square on a rule. cols = [{ key, label, fq, lines, more }] */
export const colsHtml = cols => (cols.length
  ? `<div class="hb-cols">${cols.map(c => `<div class="hb-col" style="--fq:${esc(c.fq ?? "#b3a68e")}"><div class="hb-ch">${esc(c.label)}</div>${c.lines.map(lineHtml).join("")}${c.more ? `<button type="button" class="hb-more" data-hud="more" data-col="${esc(c.key)}">${esc(c.more)}</button>` : ""}${(c.cancels ?? []).map(x => `<button type="button" class="hb-more" data-hud="grantcancel" data-effect="${esc(x.effect)}">Cancel ${esc(x.source)}</button>`).join("")}</div>`).join("")}</div>`
  : '<div class="hb-cols"><span class="hb-none">Nothing here.</span></div>');

/** The side panel: the hands, the conditions on the creature, then a waiting Reaction (Use / Pass) or the NPC's notes. */
export function sideHtml(s = {}) {
  const hands = s.hands ? `<div class="line"><span class="k">Hands</span><b>${esc(s.hands.text)}</b>${s.hands.note ? `<span class="m">${esc(s.hands.note)}</span>` : ""}${s.hands.btn ? `<button type="button" class="hb-btn q" data-hud="hands">${esc(s.hands.btn)}</button>` : ""}</div>` : "";
  const conds = (s.conds ?? []).length ? `<div class="line cond"><span class="k">${esc(s.condLabel ?? "On you")}</span>${s.conds.map(c => `<a data-hud="effect" data-effect="${esc(c.id)}" role="button" tabindex="0">${esc(c.name)}${c.dur ? ` <small>${esc(c.dur)}</small>` : ""}</a>`).join("")}</div>` : "";
  const extra = s.resist ? `<div class="line"><span class="k">Damage</span>${esc(s.resist)}</div>` : "";
  const top = hands || conds || extra ? `<div class="hb-sb">${hands}${extra}${conds}</div>` : "";
  // v0.0.392 (Lucas: "The granted section should be more obvious, likely adding in the right corner"): the uses an Effect grants, on top, in the accent
  const gr = (s.grants ?? []).length ? `<div class="hb-gr"><div class="hb-grh">Granted${(s.cancels ?? []).length ? ` by ${esc(s.cancels.map(x => x.source).join(", "))}` : ""}${(s.cancels ?? []).map(x => `<button type="button" class="hb-btn q" data-hud="grantcancel" data-effect="${esc(x.effect)}">Cancel</button>`).join("")}</div>${s.grants.map(lineHtml).join("")}</div>` : "";
  const rx = s.rx ? `<div class="hb-info alert"><b>Reaction: ${esc(s.rx.name)}</b> (${esc(s.rx.cost)})<br>${esc(s.rx.lead)}<div class="hb-rxb"><button type="button" class="hb-btn" data-hud="rx" data-msg="${esc(s.rx.msg)}" data-row="${n0(s.rx.row)}" data-k="rxUse">Use · ${esc(s.rx.cost)}</button><button type="button" class="hb-btn q" data-hud="rx" data-msg="${esc(s.rx.msg)}" data-row="${n0(s.rx.row)}" data-k="rxPass">Pass</button></div></div>` : "";
  const notes = !rx && s.notes ? `<div class="hb-info">${esc(s.notes)}</div>` : !rx ? '<div class="hb-info"></div>' : "";
  // v0.0.396 (Lucas: "Show granted actions below the hands / on you area, so that part is static")
  // v0.0.397: a question on the map (the pick bar) asks here, under the hands, in the granted uses' place
  return `<div class="hb-side">${top}<div class="hb-ask"></div>${gr}${rx}${gr && !rx ? "" : notes}</div>`;
}

/* ------------------------------------------------------------------ v0.0.441 (pack SHEETS-HUD): the HUD of the approved mockup
   (foundry/mockups/hud3, Lucas 2026-11-18: "All recommended"): D2 the identity column in words, D4 the conditions as marks with their word
   (up to three; the marks alone past three), D1 the Basic tab as the sheet's four groups, D3 / D7 the right column: the Situational section
   (whatever asks for an answer now: a Reaction's trigger, granted uses, Prone's Stand and Crawl, a question of the map, a Setup's movement),
   the Hands, the macro bar. */
/** D4: the conditions under AP and Escalation (a row always there, so a condition never changes the HUD's height). c = [{ id, name, dur, img }] */
export function condsHtml(conds = [], { max = 3 } = {}) {
  const few = conds.length <= max;
  return `<div class="h3-conds${few ? "" : " ic"}">${conds.map(c => `<button type="button" class="h3-c" data-hud="effect" data-effect="${esc(c.id)}" aria-label="${esc(`${c.name}${c.dur ? ` (${c.dur})` : ""}: open the Effect`)}"><i>${c.img ? `<img src="${esc(c.img)}" alt="">` : esc(String(c.name ?? "?").charAt(0))}</i>${few ? `<span>${esc(c.name)}${c.dur ? ` <small>${esc(c.dur)}</small>` : ""}</span>` : (c.dur ? `<small>${esc(c.dur)}</small>` : "")}</button>`).join("")}</div>`;
}
/** D1: the Basic tab: the sheet's four groups (config.mjs basicGroups) as columns, each Basic Action one line, its cost stamps its Use buttons;
 *  what can't be used now stays in its place, dim, its stamps struck. groups = [{ label, lines: [line] }] (lineHtml's lines, with strike) */
export function basicTabHtml(groups = []) {
  const row = l => {
    const off = !l.used && (l.stamps ?? []).length && l.stamps.every(x => x.off);
    const stamps = l.used ? '<span class="hb-pv used">used</span>' : (l.stamps ?? []).map(x => stampHtml(l, x)).join("");
    return `<div class="h3-bl${off || l.used ? " off" : ""}${l.strike ? " strike" : ""}" data-item-id="${esc(l.id ?? "")}" data-hud="line" style="--fq:${esc(l.fqColor ?? "#b3a68e")}"><b>${esc(l.name)}</b><span class="hb-sts">${stamps}</span></div>`;
  };
  return groups.length ? `<div class="h3-basic">${groups.map(g => `<div class="h3-bg"><div class="h3-bh">${esc(g.label)}</div>${g.lines.map(row).join("")}</div>`).join("")}</div>` : '<div class="hb-cols"><span class="hb-none">Nothing here.</span></div>';
}
/** One thing waiting in the Situational section. it = { lead, tag, text (html), btns: [{ label, q (the quiet "no"), hud, data, off, why }] } */
export function sitItemHtml(it) {
  const btn = b => `<button type="button" class="hb-btn${b.q ? " q" : ""}"${b.hud ? ` data-hud="${esc(b.hud)}"` : ""}${Object.entries(b.data ?? {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join("")}${b.off ? ` disabled aria-label="${esc(`${b.label}: ${b.why ?? ""}`)}"` : ""}>${esc(b.label)}</button>`;
  return `<div class="h3-si"><div class="h"><b>${esc(it.lead)}</b>${it.tag ? `<span class="tg">${esc(it.tag)}</span>` : ""}</div>${it.text ? `<div class="t">${it.text}</div>` : ""}${(it.btns ?? []).length ? `<div class="bs">${it.btns.map(btn).join("")}</div>` : ""}</div>`;
}
/**
 * D3 / D7: the right column. s = { rx, grants, cancels, prone: sitItem | null, tiles: [hand tile] | null, view }
 * v0.0.446 (Lucas: the Situational section was cut by the Hands and the macro bar: "Make each a tab, but only show the 'Situational' tab when
 * there is something happening. When it happens, change tabs to the situational automatically"): three tabs, one pane shown (data-rtab on
 * .h3-side, kept by hud.mjs syncSide): Situational (only while something waits: its tab is hidden otherwise), Hands, Macros.
 */
export function rightHtml(s = {}) {
  const items = [];
  if (s.rx) items.push(sitItemHtml({ lead: s.rx.name, tag: "Reaction", text: esc(s.rx.lead), btns: [{ label: `Use \u00b7 ${s.rx.cost}`, hud: "rx", data: { msg: s.rx.msg, row: n0(s.rx.row), k: "rxUse" } }, { label: "Pass", q: true, hud: "rx", data: { msg: s.rx.msg, row: n0(s.rx.row), k: "rxPass" } }] }));
  if ((s.grants ?? []).length) items.push(`<div class="hb-gr"><div class="hb-grh">Granted${(s.cancels ?? []).length ? ` by ${esc(s.cancels.map(x => x.source).join(", "))}` : ""}${(s.cancels ?? []).map(x => `<button type="button" class="hb-btn q" data-hud="grantcancel" data-effect="${esc(x.effect)}">Cancel</button>`).join("")}</div>${s.grants.map(lineHtml).join("")}</div>`);
  if (s.prone) items.push(sitItemHtml(s.prone));
  if (s.notes) items.push(`<div class="h3-si"><div class="t">${esc(s.notes)}</div></div>`);
  const tiles = s.tiles ?? [];
  const hands = tiles.length ? `<div class="h3-hands">${tiles.map(t => `<button type="button" class="h3-hand${t.free ? " free" : ""}${t.warn ? " warn" : ""}" data-hud="hands" data-hand="${esc(t.hand ?? "")}" aria-label="${esc(t.tip ?? t.name)}"><span>${esc(t.name)}</span><b>${esc(t.grip)}</b></button>`).join("")}</div>` : "";
  // v0.0.449 (Lucas, g2-hotbar: "Hands and macro should be in the same tab still, only the situational is new"): two panes, the Hands over the
  // macro bar ("main") and Situational; the tabs show only while something waits
  const has = items.length > 0, view = has && (s.view === "sit" || !s.view) ? "sit" : "main";
  const tab = (k, label) => `<button type="button" class="h3-rt h3-rt-${k}" role="tab" data-hud="rtab" data-rtab="${k}" aria-selected="${k === view}">${label}</button>`;
  const tabs = `<div class="h3-rtabs" role="tablist">${tab("sit", "Situational")}${tab("main", hands ? "Hands" : "Macros")}</div>`;
  // the pick bar, a Forced Movement, a Setup's movement and End movement ask in .hb-ask (pickbar.mjs, move.mjs, setup.mjs: hudAskSlot)
  return `<div class="h3-side${has ? " has-sit" : ""}" data-rtab="${view}">${tabs}<div class="h3-pane h3-p-sit"><div class="h3-sit${has ? " on" : ""}">${items.join("")}<div class="hb-ask"></div></div></div>`
    + `<div class="h3-pane h3-p-main">${hands}<div class="h3-hot"></div></div></div>`;
}
/** D2: the identity column. m: the bar's model (tokenBarHtml). */
function idHtml(m) {
  const pair = (k, v, cls = "", attrs = "") => `<span class="h3-p${cls ? ` ${cls}` : ""}"${attrs}><span class="k">${esc(k)}</span><b>${esc(v)}</b></span>`;
  const d = Object.fromEntries((m.defs ?? []).filter(x => x.key).map(x => [x.key, x]));
  const attr = x => `<button type="button" class="h3-p at" data-hud="attr" data-key="${esc(x.data?.key ?? "")}" aria-label="${esc(`${x.word}: click a Check, Shift-click a Save`)}"><span class="k">${esc(x.word)}</span><b>${esc(x.value)}</b></button>`;
  const rally = m.rally ? `<span class="h3-p" data-hud="res" data-res="rally"><span class="k">Rally</span><b>${n0(m.rally.left)}/${n0(m.rally.max)}</b></span><button type="button" class="hb-btn" data-hud="steel">Steel Yourself</button>` : (m.tag ? tagHtml(m.tag) : "");
  const escIn = m.escMax ? `<span class="h3-p" data-hud="res" data-res="esc"><span class="k">Esc.</span>${escHtml(m.escN, m.escMax)}<b>${n0(m.escN)}</b></span>` : "";
  return `<div class="h3-id"><div class="nm"><b>${esc(m.name)}</b><small>${esc(m.sub ?? "")}</small></div>${barsHtml(m.bars)}`
    + `<div class="h3-l">${pair("Guard", n0(m.guard))}${rally}${m.rally && m.tag ? tagHtml(m.tag) : ""}</div>`
    + `<div class="h3-l">${m.marks ? `<span class="h3-p" data-hud="res" data-res="ap"><span class="k">AP</span>${m.marks}</span>` : '<span class="m">Out of combat</span>'}${escIn}</div>`
    + condsHtml(m.conds ?? [])
    + `<div class="h3-l rule">${["ad", "wd", "speed"].filter(k => d[k]).map(k => pair(d[k].word, d[k].value, d[k].chg ? "chg" : "")).join("")}<i class="sep"></i>${["weapon", "power"].filter(k => d[k]).map(k => pair(d[k].word, d[k].value)).join("")}</div>`
    + `<div class="h3-l">${(m.defs ?? []).filter(x => x.hud === "attr").map(attr).join("")}</div></div>`;
}

/**
 * The bar. m = { npc, name, img, sub, bars, guard, rally: { left, max } | null, marks, escN, escMax (0: none), defs: [{ k, label, value, tip, chg, hud, data }],
 * tabs: [{ k, label, count }], tab, cols, side, folded, cond (folded: one line of conditions), rxAlert (the tab pulses) }
 * v0.0.441: with m.h3 (every bar now) the approved layout: idHtml, the Basic tab's groups (m.basicGroups), rightHtml (m.right).
 */
export function tokenBarHtml(m) {
  if (m.h3 && !m.folded) {
    const por = `<div class="hb-por">${m.img ? `<img src="${esc(m.img)}" alt="">` : `<span>${esc((m.name ?? "?").slice(0, 2).toUpperCase())}</span>`}<button type="button" class="hb-fold" data-hud="fold" aria-label="Fold the HUD">&#9662;</button></div>`;
    const tabs = `<div class="hb-tabs" role="tablist">${(m.tabs ?? []).map(t => `<button type="button" class="hb-tab" role="tab" aria-selected="${t.k === m.tab}" data-hud="tab" data-tab="${esc(t.k)}">${esc(t.label)} <small>${esc(String(t.count ?? ""))}</small></button>`).join("")}</div>`;
    return `<div class="hb-bar-wrap h3-wrap">${por}${idHtml(m)}<div class="hb-mid">${tabs}${m.tab === "basic" && m.basicGroups ? basicTabHtml(m.basicGroups) : colsHtml(m.cols ?? [])}</div>${rightHtml(m.right ?? {})}</div>`;
  }
  return oldBarHtml(m);
}
/** The bar as v0.0.390 drew it (the folded line still uses it). */
function oldBarHtml(m) {
  const por = `<div class="hb-por">${m.img ? `<img src="${esc(m.img)}" alt="">` : `<span>${esc((m.name ?? "?").slice(0, 2).toUpperCase())}</span>`}<button type="button" class="hb-fold" data-hud="fold" aria-label="${m.folded ? "Unfold the HUD" : "Fold the HUD"}">${m.folded ? "&#9652;" : "&#9662;"}</button></div>`;
  const escIn = m.escMax ? `<span class="k">Esc.</span>${escHtml(m.escN, m.escMax)} <b>${n0(m.escN)}</b>` : "", esc6 = escIn ? `<span>${escIn}</span>` : "";
  if (m.folded) {
    return `<div class="hb-bar-wrap folded">${por}<div class="hb-fl"><b class="nm">${esc(m.name)}</b>${barHtml(m.bars?.[0] ?? { name: "Vigor", cls: "v", left: 0, max: 1 })}<span><span class="k">Guard</span><b>${n0(m.guard)}</b></span>${m.marks ? `<span><span class="k">AP</span>${m.marks}</span>` : ""}${esc6}${m.cond ? `<span class="m">${esc(m.cond)}</span>` : ""}</div>${sideHtml({ ...(m.side ?? {}), hands: null, conds: [], notes: "", rx: null })}</div>`;
  }
  const rally = m.rally ? `<span data-hud="res" data-res="rally"><span class="k">Rally</span><b>${n0(m.rally.left)}/${n0(m.rally.max)}</b></span><button type="button" class="hb-btn" data-hud="steel">Steel Yourself</button>` : "";
  const def = d => `<button type="button" class="hb-d${d.chg ? " chg" : ""}"${d.hud ? ` data-hud="${esc(d.hud)}"` : ""}${Object.entries(d.data ?? {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join("")}><b>${esc(d.value)}</b><small>${esc(d.label)}</small></button>`;
  const defs = (m.defs ?? []).map(d => (d.gap ? '<span class="gap"></span>' : def(d))).join("");
  const id = `<div class="hb-id"><div class="nm"><b>${esc(m.name)}</b><small>${esc(m.sub ?? "")}</small></div>${barsHtml(m.bars)}`
    + `<div class="line"><span><span class="k">Guard</span><b>${n0(m.guard)}</b></span>${rally || (m.tag ? tagHtml(m.tag) : "")}</div>`
    + `<div class="line">${m.marks ? `<span data-hud="res" data-res="ap"><span class="k">AP</span>${m.marks}</span>` : '<span class="m">Out of combat</span>'}${escIn ? `<span data-hud="res" data-res="esc">${escIn}</span>` : ""}</div>`
    + `<div class="hb-defs">${defs}</div></div>`;
  const tabs = `<div class="hb-tabs" role="tablist">${(m.tabs ?? []).map(t => `<button type="button" class="hb-tab${t.k === "rx" && m.rxAlert ? " alert" : ""}" role="tab" aria-selected="${t.k === m.tab}" data-hud="tab" data-tab="${esc(t.k)}">${esc(t.label)} <small>${esc(String(t.count ?? ""))}</small></button>`).join("")}</div>`;
  return `<div class="hb-bar-wrap${m.side?.rx || (m.side?.grants ?? []).length ? " rx" : ""}">${por}${id}<div class="hb-mid">${tabs}${colsHtml(m.cols ?? [])}</div>${sideHtml(m.side)}</div>`;
}
