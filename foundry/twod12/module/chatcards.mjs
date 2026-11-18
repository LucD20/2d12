// v0.0.283 (pack chat-cards, Lucas's design 2026-11-07; brief: foundry/mockups/chat-cards-brief.md): the attack roll card, the Save card and the
// damage message, drawn from a model stored on the message (flags.twod12.cc). Pure: no Foundry here, so the tests load it.
// The card is drawn for each viewer (the render hook in twod12.mjs calls render with that viewer's view): the GM sees everything; a player may have
// the enemy Defenses or the target details hidden by the GM; Designer mode (a client setting) adds the odds, the Ruler line and the Mithril mark.
// The message's stored content is the GM's view without Designer mode (the fallback when the hook can't run).
import { esc, vsKind } from "./util.mjs";
import { mergeDiceLine, mergeInstances } from "./dicemerge.mjs";
/** v0.0.314 (pack AU): an AD / WD (or an Attribute's) badge in its color: the Vs. line's colors (util.mjs VS_COLORS). */
const vsk = label => { const k = vsKind(label); return k ? ` vsk-${k}` : ""; };
import { bbKey, BB_LIMIT, BB_NAMES } from "./calc.mjs";

/* ------------------------------------------------------------------ small pieces */
/** The subtypes' names and the card's ink for them (brief section 3; the others keep the system's ink). */
export const SUBS = {
  Sl: ["Slash", "#4a443b"], Bl: ["Blunt", "#4a443b"], Pi: ["Pierce", "#4a443b"], Fi: ["Fire", "#a0521a"], Ho: ["Holy", "#7d5400"], Co: ["Cold", "#2c6f8f"],
  Ac: ["Acid", "#3B6D11"], El: ["Electricity", "#7a5c00"], Fo: ["Force", "#7a24bf"], Ps: ["Psychic", "#993556"], Th: ["Thunder", "#0C447C"], Un: ["Unholy", "#4A1D63"]
};
const subInk = s => SUBS[s]?.[1] ?? "#4a443b";
export const subName = s => SUBS[s]?.[0] ?? (s || "Untyped");
/** A subtype's code in its color ("Ho"). */
export const subCode = s => (s ? `<span class="cc-sub" style="color:${subInk(s)}">${esc(s)}</span>` : "");
const POOL = { B: "Vigor", M: "Resolve", C: "Vigor or Resolve" };
/** The pool's icon: a heart for Vigor, a brain for Resolve (both for a [C] choice). */
export const poolIc = p => (p === "M" ? '<i class="fa-solid fa-brain cc-pr" aria-hidden="true"></i>'
  : p === "C" ? '<i class="fa-solid fa-heart cc-pv" aria-hidden="true"></i><i class="fa-solid fa-brain cc-pr" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-heart cc-pv" aria-hidden="true"></i>');
const poolSr = p => `<span class="cc-sr">${POOL[p] ?? "Vigor"}</span>`;
const sg = n => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);
const modCls = n => (n >= 0 ? "cc-plus" : "cc-minus");
/** A modifier written in its color: "+2 Signature" blue, "−1 Situational" red. */
export const modTxt = (v, label) => `<span class="${modCls(v)}">${sg(v)}${label ? ` ${esc(label)}` : ""}</span>`;
/** The gold divider: one diamond (above the effect text and the Trigger line) or three (above the Flavor line). */
export const divider = (n = 1) => `<div class="cc-div" aria-hidden="true"><span></span><i>${"◆".repeat(n)}</i><span></span></div>`;
const tierCls = (tier, crit) => (crit ? "crit" : `t${tier}`);
/** The values of one d12 group: a 12 counts 11 and is rolled again. */
export const dieValue = faces => (faces ?? []).reduce((a, f) => a + (f === 12 ? 11 : f), 0);
const die = (f, chain = false) => `<span class="cc-die${f === 12 ? " boom" : ""}${chain ? " chain" : ""}"><b>${f}</b></span>`;
const dieGroup = faces => `<span class="cc-dg">${(faces ?? []).map((f, i) => die(f, i > 0)).join("")}</span>`;

/** The view a user gets: view({ gm, hideDef, hideTgt, designer, author, owner }). */
export const viewOf = (o = {}) => ({ gm: !!o.gm, hideDef: !o.gm && !!o.hideDef, hideTgt: !o.gm && !!o.hideTgt, designer: !!o.designer, author: !!o.author || !!o.gm, owns: o.owns ?? (() => !!o.gm) });
export const FULL_VIEW = viewOf({ gm: true });

/* ------------------------------------------------------------------ the Tier ladder */
/** The three ranges of a DC, as totals: "≤10 · 11–17 · 18+" for DC 11. */
export const ranges = dc => [`≤${dc - 1}`, `${dc}–${dc + 6}`, `${dc + 7}+`];
/** Where the total's arrow sits on the bar (%): a 21-step scale from DC−7 to DC+13, clamped to 4%–95%. */
export const arrowPos = (total, dc) => Math.min(95, Math.max(4, ((total - (dc - 7) + 0.5) / 21) * 100));
const segMid = t => (t - 0.5) * (100 / 3);
const CRIT_MID = 95;   // the CRIT zone's middle (the last 30% of Tier 3: 90% to 100% of the ladder)
/** The base Tier of a total (before Doubles). */
export const baseTier = (total, dc) => (total < dc ? 1 : total < dc + 7 ? 2 : 3);
/**
 * The ladder's model: { segs: [{ tier, label, lit }], arrow: { pos, faded }, up: pos | null, critZone: "" | "pale" | "solid" }.
 * r: { total, dc, tier, base, crit, doubles }; hide: the enemy Defense is hidden (labels "Tier N", the arrow in the middle of its Tier).
 */
export function ladderModel(r, hide = false) {
  const dc = Number(r.dc) || 13, base = r.base ?? baseTier(r.total, dc), tier = r.tier ?? base;
  // v0.0.418 (Lucas, playtest 5, C8): a Critical from Doubles (or three of a kind) raises the roll too: its "↑" goes over the CRIT zone
  const critUp = !!r.crit && (tier > base || (!!r.doubles && base === 3)), raised = tier > base || critUp;
  const labels = hide ? ["Tier 1", "Tier 2", "Tier 3"] : ranges(dc);
  const pos = hide ? segMid(base) : arrowPos(r.total, dc);
  return {
    segs: [1, 2, 3].map(t => ({ tier: t, label: labels[t - 1], lit: t === tier })),
    arrow: { pos, faded: raised, total: r.total },
    up: critUp ? CRIT_MID : raised ? segMid(tier) : null,
    // v0.0.418 (C9): the CRIT zone only on an actual Critical (it was shown pale on every Tier 3)
    critZone: tier === 3 && r.crit ? "solid" : ""
  };
}
/** The ladder: a button (it opens the breakdown below it). thin: the small ladder of a creature's row. */
export function ladderHtml(r, { hide = false, thin = false, id = "", open = false } = {}) {
  const m = ladderModel(r, hide);
  const segs = m.segs.map(s => `<span class="cc-seg s${s.tier}${s.lit ? " lit" : ""}">${s.tier === 3 && m.critZone ? `<span class="cc-czone ${m.critZone}" aria-hidden="true">CRIT</span>` : ""}<span class="cc-sl">${esc(s.label)}</span></span>`).join("");
  const arrow = `<span class="cc-arrow${m.arrow.faded ? " faded" : ""}" style="left:${m.arrow.pos.toFixed(1)}%" aria-hidden="true"><b>${m.arrow.total}</b><i></i></span>`;
  const up = m.up !== null ? `<span class="cc-arrow up" style="left:${m.up.toFixed(1)}%" aria-hidden="true"><b>↑</b><i></i></span>` : "";
  const lbl = `Total ${r.total}, ${r.crit ? "Critical" : `Tier ${r.tier}`}${m.up !== null ? " (raised by Doubles)" : ""}. Show the roll`;
  return `<button type="button" class="cc-ladder${thin ? " thin" : ""}" data-cc-toggle="${esc(id)}" aria-expanded="${open}" aria-label="${esc(lbl)}"><span class="cc-arrows">${arrow}${up}</span><span class="cc-bar">${segs}</span></button>`;
}

/* ------------------------------------------------------------------ the Tier stamp */
export function stampHtml(r, { hide = false } = {}) {
  const raised = r.tier > (r.base ?? r.tier);
  const line = r.crit ? "Critical" : raised ? "Doubles ↑" : hide ? "" : `vs ${r.dcLabel ?? "DC"} ${r.dc}`;
  // v0.0.348 (Lucas: "doubles need to be clearer; we already have green for the Tiers and blue for a Critical: a golden outline?"): a roll with
  // Doubles has a gold outline and a "Doubles" tag on its stamp
  // v0.0.350 (Lucas: "no 'Doubles' word on the outline; the Doubles inside the Tier square with the golden background"): the outline alone, and the
  // stamp's "Doubles ↑" line in gold
  return `<div class="cc-stamp ${tierCls(r.tier, r.crit)}${r.doubles ? " dbl" : ""}"${r.doubles ? '' : ""}><small>${r.crit ? "CRIT" : "TIER"}</small><b>${r.tier}</b>${line ? `<small class="cc-stl${/Doubles/.test(line) ? " dbl" : ""}">${esc(line)}</small>` : ""}</div>`;
}
/** A small Tier pill (22px, the numeral) or a word pill ("Tier 2"). */
export const tierPill = (tier, crit = false, word = false, dbl = false) => `<span class="cc-pill ${tierCls(tier, crit)}${word ? " word" : ""}${dbl ? " dbl" : ""}"${dbl ? '' : ""}>${word ? (crit ? "Critical" : `Tier ${tier}`) : `T${tier}`}</span>`;   // v0.0.287 (Lucas): "T1", squared like the trait chips

/* ------------------------------------------------------------------ the roll breakdown */
/**
 * The Boons and Banes of a roll, one per line, each with its source and its name ("Boon · Flanking · Field"). v0.0.301 (PACK BB): each is +1 / -1;
 * one past the limit of its name (2) is +0 ("over the Field limit"); the ones with no source line (added by hand) have no name.
 * r: { boonFaces, baneFaces (a 1 for each that counts), sources: [{ name, boons, banes, bb }], five }.
 */
export function boonBaneLines(r) {
  const out = [];
  for (const [kind, key, faces, sign] of [["boon", "boons", r.boonFaces, 1], ["bane", "banes", r.baneFaces, -1]]) {
    const used = {};
    let kept = 0;
    for (const s of r.sources ?? []) for (let i = 0; i < (Number(s[key]) || 0); i++) {
      const k = bbKey(s.bb), over = !!k && (used[k] = (used[k] ?? 0) + 1) > BB_LIMIT;
      out.push({ kind, val: over || r.five ? 0 : sign, name: String(s.name ?? "").replace(/\s*\([^)]*\)\s*$/, ""), bb: k ? BB_NAMES[k] : "", over });
      if (!over) kept++;
    }
    if (!r.five) for (let i = kept; i < (faces ?? []).length; i++) out.push({ kind, val: sign, name: "", bb: "", over: false });
  }
  return out;
}
/** The result chips of a breakdown's Total row. */
export function resultChips(r, { save = false, hide = false } = {}) {
  if (save) return `<span class="cc-pill word ${tierCls(r.tier, false)}">Their Tier ${r.tier}</span>`;
  const base = r.base ?? r.tier;
  if (r.crit) {
    const why = r.triple ? "three of a kind" : r.doubles && base === 3 ? "Doubles" : hide ? "" : `${r.dc + 20}+`;
    return `<span class="cc-pill word crit">Tier 3 → Critical${why ? ` · ${why}` : ""}</span>`;
  }
  if (r.tier > base) return `<span class="cc-pill word ${tierCls(r.tier, false)}">Tier ${base} → Tier ${r.tier} · Doubles</span>`;
  return `<span class="cc-pill word ${tierCls(r.tier, false)}">Tier ${r.tier}${r.forced ? " (forced)" : ""}</span>`;
}
/**
 * The breakdown panel: 2d12 (the dice as rolled, explosions grouped, the Doubles pair framed), Boon · Bane (one line per die), Modifiers, Total.
 * r: a check ({ d1, d2, dropped, doubles, crit, base, tier, total, dc, dcLabel, boonFaces, baneFaces, sources, mods: [{ v, label }] }).
 */
export function breakdownHtml(r, { hide = false, save = false, id = "", open = false, applied = [] } = {}) {
  const exploded = [r.d1, r.d2].some(f => (f ?? []).length > 1);
  const dblCls = r.doubles ? (r.crit && (r.base ?? 3) === 3 ? "crit" : "up") : "";
  const pair = `${dieGroup(r.d1)}${dieGroup(r.d2)}`;
  const dice = `${r.doubles ? `<span class="cc-dbl ${dblCls}">${pair}</span>` : pair}${r.dropped ? `<span class="cc-dropped">${dieGroup(r.dropped)}</span>` : ""}`;
  const chainTxt = exploded ? `<span class="cc-muted">${[r.d1, r.d2].map(f => f.map(x => (x === 12 ? 11 : x)).join(" + ")).join(" · ")}</span>` : "";
  const dblTag = r.doubles ? `<span class="cc-tag ${dblCls}">Doubles · ${dblCls === "crit" ? "Critical" : "+1 Tier"}</span>` : "";
  const rows = [`<span class="cc-bl">2d12</span><span class="cc-bv cc-dicerow">${dice}${chainTxt}${dblTag}</span>`];
  const bb = boonBaneLines(r);
  // v0.0.301 (PACK BB): +1 / -1 each (no dice); over a name's limit: +0; 5 or more left: the roll is Favored / Doomed instead
  const five = r.five ? `<span class="cc-bbl five"><span class="cc-tag ${r.five === "favored" ? "up" : "down"}">5 or more ${r.five === "favored" ? "Boons" : "Banes"} left: ${r.five === "favored" ? "Favored" : "Doomed"} instead</span></span>` : "";
  // v0.0.347 (Lucas, playtest 4: "+1 Marked Quarry / −1 Situational, smaller, on the right, no Boon / Bane words, no triangle")
  if (bb.length) rows.push(`<span class="cc-bl">Boon · Bane</span><span class="cc-bv cc-bbv">${bb.map(x => `<span class="cc-bbl ${x.kind}${x.over ? " over" : ""}">${modTxt(x.val, "")} <span>${esc(x.name || (x.kind === "boon" ? "Boon" : "Bane"))}</span>${x.bb ? ` <small class="cc-bbn">${esc(x.bb)}</small>` : ""}${x.over ? ' <small class="cc-muted">over the limit</small>' : ""}</span>`).join("")}${five}</span>`);
  const mods = (r.mods ?? []).filter(m => m && Number(m.v));
  if (mods.length) rows.push(`<span class="cc-bl">Modifiers</span><span class="cc-bv">${mods.map(m => modTxt(Number(m.v), m.label)).join(" ")}</span>`);
  // v0.0.347: "Applied": the effects this roll's damage takes something from (Killer's Focus), each a link that opens it
  if ((applied ?? []).length) rows.push(`<span class="cc-bl">Applied</span><span class="cc-bv cc-applied">${applied.map(a => (a.uuid ? `<a class="content-link" draggable="true" data-link data-uuid="${esc(a.uuid)}" aria-label="Open ${esc(a.name)}"><i class="fa-solid fa-sparkles"></i>${esc(a.name)}</a>` : `<span>${esc(a.name)}</span>`)).join(" ")}</span>`);
  const badge = `${esc(r.dcLabel ?? "DC")}${hide && !save ? "" : ` ${r.dc}`}`;
  rows.push(`<span class="cc-btot"><b class="cc-total">${r.total}</b><small>vs</small><span class="cc-badge${vsk(r.dcLabel)}">${badge}</span><span class="cc-chips">${resultChips(r, { save, hide })}</span></span>`);
  return `<div class="cc-break${open ? " open" : ""}" data-cc-panel="${esc(id)}">${rows.join("")}</div>`;
}

/* ------------------------------------------------------------------ outcomes */
/**
 * One line per pool: "♥ 1d8 Sl · 🧠 2d6 + 1d6 Ho". parts: [{ pool, t: "2d6" | "2", sub }]; a pool with nothing is left out. Parts of the same pool
 * join with "+" (one icon); consecutive parts with the same subtype share its code.
 */
export function poolLines(parts) {
  const by = new Map();
  for (const p of parts ?? []) { if (!p || !String(p.t ?? "").trim() || String(p.t) === "0") continue; const k = p.pool || "B"; if (!by.has(k)) by.set(k, []); by.get(k).push(p); }
  return ["B", "M", "C"].filter(k => by.has(k)).map(k => {
    const ps = by.get(k), bits = [];
    ps.forEach((p, i) => { const next = ps[i + 1]; bits.push(`${esc(p.t)}${!next || next.sub !== p.sub ? (p.sub ? ` ${subCode(p.sub)}` : "") : ""}`); });
    return `<span class="cc-pl">${poolIc(k)}${poolSr(k)} ${bits.join(" + ")}</span>`;
  }).join('<span class="cc-dot" aria-hidden="true"> · </span>');
}
/**
 * v0.0.317 (Lucas: "Frightened could fit next to 'and' but goes into a new paragraph"): a rider with buttons in it is one sentence that flows on
 * from the ↳ (cc-rtext, inline, no box); a rider of plain words keeps its framed chip.
 */
export const riderHtml = h => (/<a\b|class="fxname"|data-twod12-inline/.test(h)
  ? `<div class="cc-rider cc-rflow"><span class="cc-rtext"><span class="cc-rarrow" aria-hidden="true">↳</span> ${h}</span></div>`
  : `<div class="cc-rider"><span aria-hidden="true">↳</span> <span class="cc-rchip">${h}</span></div>`);
/** The outcome of one Tier: the damage line, then each rider on its own line ("↳ Pushed 2"). o: { parts, riders: [html] } */
export function outcomeHtml(o, { none = "" } = {}) {
  const dmg = poolLines(o?.parts);
  const riders = (o?.riders ?? []).filter(Boolean).map(riderHtml).join("");
  if (!dmg && !riders) return none ? `<div class="cc-none">${esc(none)}</div>` : "";
  return `${dmg ? `<div class="cc-dmgline">${dmg}</div>` : ""}${riders}`;
}

/* ------------------------------------------------------------------ the header and the target line */
const FREQ = { round: "Round", encounter: "Encounter", turn: "Turn", atwill: "At-will", daily: "Daily" };
export function headHtml(m) {
  const chip = [FREQ[m.freq] ?? "", m.cost].filter(Boolean).join(" · ");
  // v0.0.303 (Lucas): the automation diamond beside the name (config.mjs autoChip; its rank and what is done by hand on hover)
  return `<div class="cc-head"><b class="cc-name">${esc(m.name)}${m.auto ?? ""}</b>${chip ? `<span class="cc-cost f-${esc(m.freq || "none")}">${esc(chip)}</span>` : ""}</div>${m.traitsHtml ? `<div class="cc-traits">${m.traitsHtml}</div>` : ""}`;
}
/** "Targets ✦ Distance → target", the area button first for an Area Action, the retarget button at the right. */
export function targetLineHtml(m, view = FULL_VIEW, { locked = false } = {}) {
  const t = m.tline ?? {}, star = '<span class="cc-star" aria-hidden="true">✦</span>';
  const names = t.names?.length === 1 ? esc(t.names[0]) : t.names?.length ? `${t.names.length} targets` : "No target";
  const bits = [t.area ? t.area : t.targets ? esc(t.targets) : "", t.dist ? esc(t.dist) : ""].filter(Boolean).join(` ${star} `);
  const btn = view.author && !locked && t.retarget !== false ? `<button type="button" class="cc-icon" data-twod12="${esc(t.retargetKind ?? "retargetAction")}" aria-label="Target the selected tokens"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>` : "";
  return `<div class="cc-tline"><span>${bits}${bits ? " " : ""}<span aria-hidden="true">→</span> <b>${names}</b></span>${btn}</div>`;
}
/**
 * v0.0.285 (Lucas, after v0.0.284): the attack card's target goes to the bottom, beside its buttons, as on the damage message: the top keeps
 * "Targets ✦ Distance" (the area button for an Area Action); the bottom row has the retarget button, "→ the target" and Damage / Card.
 */
export function metaLineHtml(m) {
  const t = m.tline ?? {}, star = '<span class="cc-star" aria-hidden="true">\u2726</span>';
  // v0.0.395 (Lucas: "It is saying 'Two creatures' only, didnt we change to always say what each element is?"): each fact named, in the card
  // Structure's order (book/cards/card-structure.md, the grid: Distance, Area, Target)
  // v0.0.396 (Lucas: "Didn't we change how this is? The ✦?"): the Structure's grid has no star: Distance and Area at the left, Target at the right
  void star;
  const left = [
    t.dist ? `<span><b class="cc-ml">Distance:</b> ${esc(t.dist)}</span>` : "",
    t.area ? `<span><b class="cc-ml">Area:</b> ${t.area}</span>` : ""
  ].filter(Boolean).join("");
  const right = !t.area && t.targets ? `<span class="cc-mlr"><b class="cc-ml">Target:</b> ${esc(t.targets)}</span>` : "";
  return left || right ? `<div class="cc-tline meta"><span class="cc-mll">${left}</span>${right}</div>` : "";
}
export function footHtml(m, view = FULL_VIEW, { damage = "rollDamage", hasDamage = m.hasDamage, locked = m.locked, target = true } = {}) {   // v0.0.287: the Save card's too
  // v0.0.296 (Lucas: "the target should be kept at the bottom"): the target and the retarget stay on the bottom row (v0.0.285 / v0.0.287); target: false = buttons only
  if (!target) return `<hr class="cc-hr"><div class="cc-foot">${hasDamage ? `<button type="button" class="cc-btn small primary" data-twod12="${damage}"><i class="fa-solid fa-dice" aria-hidden="true"></i> Damage</button>` : ""}<span class="cc-ftgt"></span><button type="button" class="cc-btn small" data-twod12="ccCard">Card</button></div>`;
  const t = m.tline ?? {}, n = t.names ?? [];
  const names = n.length === 1 ? `<b class="cc-tname">${esc(n[0])}</b>` : n.length ? `<b class="cc-tname">${n.length} targets</b>` : '<span class="cc-muted">No target</span>';
  const re = view.author && !locked && t.retarget !== false ? `<button type="button" class="cc-icon" data-twod12="${esc(t.retargetKind ?? "retargetAction")}" aria-label="Target the selected tokens"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>` : "";
  const dmg = hasDamage ? `<button type="button" class="cc-btn small primary" data-twod12="${damage}"><i class="fa-solid fa-dice" aria-hidden="true"></i> Damage</button>` : "";
  return `<hr class="cc-hr"><div class="cc-foot">${re}<span class="cc-ftgt"><span aria-hidden="true">\u2192</span> ${names}</span>${dmg}<button type="button" class="cc-btn small" data-twod12="ccCard">Card</button></div>`;
}
/** v0.0.388 (pack ONE): the bottom row of a one-target card holding its damage: the target's damage row (its name, Apply or Took and Undo, Full /
 *  Half / Double behind the sliders) in the place of "→ target" and Damage; Card at the right. No retarget once the damage is rolled. */
// v0.0.389 (Lucas: "without a target looks weird"): no target yet: the bottom row reads as before the damage ("→ No target"), the crosshair targets the
// selected tokens for the damage (the damage card's "Target the selected tokens"); no Lethal tag or wide button under the card.
const noTargetFoot = view => `${view.author ? '<button type="button" class="cc-icon" data-twod12="ccDmgTarget" aria-label="Target the selected tokens"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>' : ""}<span class="cc-ftgt"><span aria-hidden="true">\u2192</span> <span class="cc-muted">No target</span></span>`;
export const dmgFootHtml = (din, view = FULL_VIEW) => `<hr class="cc-hr"><div class="cc-foot cc-dfoot">${din.row || noTargetFoot(view)}<button type="button" class="cc-btn small" data-twod12="ccCard">Card</button></div>${din.extra ?? ""}`;
const designerFoot = (lines, view) => (view.designer && lines.filter(Boolean).length ? `<div class="cc-designer">${lines.filter(Boolean).join("<br>")}</div>` : "");
const playerFoot = txt => `<div class="cc-pfoot">${esc(txt)}</div>`;

/* ------------------------------------------------------------------ the attack card */
/** Which dice a creature kept, under its ladder (several targets with 3d12): "Favored: keeps 7 · 7 for Doubles, Tier 2 ↑ Tier 3". */
export function keptNote(r) {
  if (!r.dropped) return "";
  const kept = `${dieValue(r.d1)} · ${dieValue(r.d2)}`;
  if (r.state === "doomed") return `Doomed: the two lowest, ${kept}, no Doubles`;
  if (r.state === "favored") return r.triple ? `Favored: three of a kind, a Critical` : r.doubles ? `Favored: the two highest, ${kept}, and a pair: Doubles${r.tier > r.base ? `, Tier ${r.base} ↑ Tier ${r.tier}` : ""}` : `Favored: the two highest, ${kept}`;
  return `Normal: the first two, ${kept}`;
}
const defText = (r, hide) => [hide ? "" : `${r.dcLabel ?? "DC"} ${r.dc}`, r.banes ? `${r.banes} Bane${r.banes === 1 ? "" : "s"}` : "", r.boons ? `${r.boons} Boon${r.boons === 1 ? "" : "s"}` : "", r.state === "favored" ? "Favored" : r.state === "doomed" ? "Doomed" : ""].filter(Boolean).join(" · ");
const critLine = (m, rows, hide) => {
  if (!m.critHtml || !rows.some(r => r.tier === 3)) return "";
  const any = rows.some(r => r.crit);
  if (any) return `<div class="cc-critbox"><span class="cc-critlbl on">Critical</span><span class="cc-crittxt">${m.critHtml}</span></div>`;
  return "";   // v0.0.342 (Lucas: "the Critical should only show if it has been rolled"); was: the Critical's line with how to get one ("Doubles, or 33+")
};
export function attackCardHtml(m, view = FULL_VIEW) {
  const hide = view.hideDef, rows = m.rows ?? [], one = rows.length <= 1;
  // v0.0.388 (pack ONE): the damage, once rolled, is drawn on this card (m.dmg); the Damage button goes
  const din = m.dmg ? damageInHtml(m.dmg, view) : null, inMain = one && din?.compact;
  const btns = inMain ? dmgFootHtml(din, view) : footHtml(m, view, din ? { hasDamage: false, locked: true } : {});
  const dpart = din && !inMain ? din.part : "";
  // v0.0.429: an Effect the card writes above the roll is among its top lines (drawn once, there)
  const effects = m.effectsHtml && rows.some(r => r.tier >= (m.effectsFrom ?? 2)) && !(m.card?.top ?? []).some(l => l.label === "Effect") ? `${divider(1)}<div class="cc-effect">${m.effectsHtml}</div>` : "";
  const flavor = cardSpecial(m) + (m.flavor ? `${divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "");   // CARD-ONE: the card's Special before the Flavor
  const des = designerFoot([...(m.designer?.odds ?? []).map(o => `Odds${o.name ? ` (${esc(o.name)})` : ""}: ${esc(o.text)}`), m.designer?.ruler ? `Ruler: ${esc(m.designer.ruler)}` : "", m.designer?.mithril ? `Automation: ${esc(m.designer.mithril)}` : ""], view);
  const pf = hide ? playerFoot("Player view · enemy Defenses hidden by the GM") : "";
  const head = `${headHtml(m)}${metaLineHtml(m)}${m.card ? cardLinesHtml(m.card.top) + cardLinesHtml(m.card.before) : m.setupHtml ?? ""}`;
  if (one) {
    const r = rows[0];
    const body = `<div class="cc-body">${stampHtml(r, { hide })}<div class="cc-main">${ladderHtml(r, { hide, id: "r0" })}${breakdownHtml(r, { hide, id: "r0", applied: m.applied ?? [] })}${inMain ? din.main : ""}<div class="cc-outcome">${outcomeHtml(inMain ? { ...(m.outcomes?.[r.tier] ?? {}), parts: [] } : m.outcomes?.[r.tier])}</div>${critLine(m, rows, hide)}${effects}</div></div>`;
    return `<div class="cc-card cc-attack${inMain ? " withdmg" : ""}${r.uuid ? "" : " notgt"}">${head}${body}${dpart}${flavor}${m.extraHtml ?? ""}${btns}${des}${pf}</div>`;
  }
  // several targets: one shared roll, a row per creature, the outcome grouped by Tier
  const sh = m.shared ?? {};
  const shared = `<div class="cc-shared"><span class="cc-bl">${(sh.d ?? []).length}d12</span>${(sh.d ?? []).map(dieGroup).join("")}${sh.mod ? ` ${modTxt(sh.mod, "Modifier")}` : ""}${(m.applied ?? []).length ? ` <span class="cc-applied"><span class="cc-bl">Applied</span> ${m.applied.map(a => (a.uuid ? `<a class="content-link" draggable="true" data-link data-uuid="${esc(a.uuid)}"><i class="fa-solid fa-sparkles"></i>${esc(a.name)}</a>` : esc(a.name))).join(" ")}</span>` : ""}</div>`;   // v0.0.347
  const crows = rows.map((r, i) => `<div class="cc-crow">${tierPill(r.tier, r.crit, false, !!r.doubles)}<span class="cc-cname">${esc(r.name)}</span><span class="cc-cdef">${hide ? "" : `<span class="cc-badge${vsk(r.dcLabel)}">${esc(r.dcLabel ?? "DC")} ${r.dc}</span>`}${defText(r, true) ? `<span>${esc(defText(r, true))}</span>` : ""}</span>${ladderHtml(r, { hide, thin: true, id: `r${i}` })}${keptNote(r) ? `<div class="cc-muted cc-kept">${esc(keptNote(r))}</div>` : ""}${breakdownHtml(r, { hide, id: `r${i}` })}</div>`).join("");
  const groups = [3, 2, 1].map(t => {
    const who = rows.filter(r => r.tier === t);
    if (!who.length) return "";
    const out = outcomeHtml(m.outcomes?.[t]);
    return `<div class="cc-tgroup"><div class="cc-ghd">${tierPill(t, false, true)}<span class="cc-who">${who.map(r => `<span class="cc-nchip">${esc(r.name)}</span>`).join("")}</span></div>${out}${t === 3 ? critLine(m, who, hide) : ""}</div>`;
  }).join("");
  // v0.0.398 (Lucas, on foundry/mockups/multi-damage.html: "Looks good"): each Tier and each creature said once. A group a Tier: its pill, its damage
  // on the same line (the rolled pools, a click shows the dice; before the roll, the Tier's dice), Apply all for that Tier, its riders; then its
  // creatures, each once (a click on the name shows its Defense, total and ladder), with Apply / Undo when the damage is in
  if (m.dmg) {
    const d = dmgParts(m.dmg, view, { riders: false, idp: "d" });
    const tiers = [...new Set([...rows.map(r => r.tier), ...d.groups.map(g => g.tier)])].filter(t => t > 0).sort((a, b) => b - a);
    const nameBtn = (r, k) => `<button type="button" class="cc-cnbtn" data-cc-toggle="l${k}" aria-expanded="false"><span class="cc-cname">${esc(r.name)}</span></button>`;
    const ladderPanel = (r, k) => `<div class="cc-break cc-lad" data-cc-panel="l${k}"><div class="cc-ladcap">${esc(defText(r, hide))}${hide ? "" : ` · rolled ${Number(r.total) || 0}`}</div>${ladderHtml(r, { hide, id: `l${k}` })}</div>`;
    const tgroups = tiers.map(t => {
      const who = rows.map((r, k) => ({ r, k })).filter(x => x.r.tier === t);
      const gi = d.groups.findIndex(g => g.tier === t), g = gi >= 0 ? d.groups[gi] : null;
      const dline = g ? d.poolsOf(gi) : outcomeHtml(m.outcomes?.[t]).replace(/<div class="cc-dmgline">([\s\S]*?)<\/div>.*/, "$1");
      const pend = g ? (g.rows ?? []).filter(i => d.rows[i] && !d.rows[i].applied) : [];
      // (a Tier that is one "N×" line already has its Apply: no Apply all beside it)
      const oneLine = new Set(who.map(({ r }) => String(r.name ?? "").replace(/\s+\d+$/, ""))).size === 1 && who.length > 1;
      const all = view.author && !view.hideTgt && pend.length > 1 && !oneLine ? `<button type="button" class="cc-btn small primary cc-gall" data-twod12="ccApplyAll" data-group="${gi}">Apply all</button>` : "";
      const riders = (m.outcomes?.[t]?.riders ?? []).filter(Boolean).map(riderHtml).join("");
      const one = ({ r, k }) => {
        const di = d.rows.findIndex(x => (x.uuid && x.uuid === r.uuid) || (!x.uuid && x.name === r.name));
        const row = di >= 0 ? d.rowHtml(di, nameBtn(r, k)) : `<div class="cc-trow">${nameBtn(r, k)}</div>`;
        return row + ladderPanel(r, k);
      };
      // v0.0.400 (Lucas: "When there are multiple targets, instead of 'Ogre Chieftain 2', '2x Ogre Chieftain'"): the same creature twice or more in a
      // Tier is one line, "2× Ogre Chieftain", with one Apply for them all (each its own Guard); a click on the name shows each one's row
      const stem = n => String(n ?? "").replace(/\s+\d+$/, "");
      const clusters = [];
      for (const x of who) { const c = clusters.find(y => stem(y[0].r.name) === stem(x.r.name)); if (c) c.push(x); else clusters.push([x]); }
      const lines = clusters.map((cl, ci) => {
        if (cl.length === 1) return one(cl[0]);
        const idx = cl.map(({ r }) => d.rows.findIndex(x => (x.uuid && x.uuid === r.uuid) || (!x.uuid && x.name === r.name))).filter(i => i >= 0);
        const pend = idx.filter(i => !d.rows[i].applied), id = `c${t}_${ci}`;
        const act = !view.author || view.hideTgt ? "" : pend.length ? `<button type="button" class="cc-btn small primary cc-rbtn" data-twod12="ccApplyAll" data-rows="${pend.join(",")}">Apply${pend.length < idx.length ? ` (${pend.length})` : ""}</button>` : (idx.length ? '<span class="cc-muted">✓ Applied</span>' : "");
        const name = `<button type="button" class="cc-cnbtn" data-cc-toggle="${id}" aria-expanded="false"><span class="cc-cname">${cl.length}× ${esc(stem(cl[0].r.name))}</span></button>`;
        return `<div class="cc-trow cc-clus">${name}${act}</div><div class="cc-break cc-clp" data-cc-panel="${id}">${cl.map(one).join("")}</div>`;
      }).join("");
      // a creature hit by this Tier's damage with no roll row (an area's extra target): its damage row alone
      const extra = g ? (g.rows ?? []).filter(i => !rows.some(r => (d.rows[i]?.uuid && d.rows[i].uuid === r.uuid) || d.rows[i]?.name === r.name)).map(i => d.rowHtml(i)).join("") : "";
      return `<div class="cc-tg2"><div class="cc-tg2h">${tierPill(t, g?.crit ?? false, true)}<span class="cc-tg2d">${dline}</span>${all}</div>${riders}${t === 3 ? critLine(m, who.map(x => x.r), hide) : ""}<div class="cc-trows">${lines}${extra}</div></div>`;
    }).join("");
    // the pending rows in several Tiers: one Apply all for the card too, under the groups
    const pendAll = d.rows.filter(r => !r.applied), spread = d.groups.filter(g => (g.rows ?? []).some(i => d.rows[i] && !d.rows[i].applied)).length > 1;
    const allCard = view.author && !view.hideTgt && pendAll.length > 1 && spread ? `<div class="cc-applyall"><button type="button" class="cc-btn primary" data-twod12="ccApplyAll">Apply all</button>${pendAll.some(r => r.choice) ? '<span class="cc-muted">skips rows with a choice</span>' : ""}</div>` : "";
    return `<div class="cc-card cc-attack many v398">${head}${shared}<div class="cc-groups2">${tgroups}</div>${allCard}${d.note}${effects}${flavor}${m.extraHtml ?? ""}${btns}${des}${pf}</div>`;
  }
  return `<div class="cc-card cc-attack many">${head}${shared}<div class="cc-crows">${crows}</div><div class="cc-groups">${groups}</div>${effects}${dpart}${flavor}${m.extraHtml ?? ""}${btns}${des}${pf}</div>`;
}

/* ------------------------------------------------------------------ the Save card */
/** The Save's three ranges, as the target's totals: Tier 3 "20+", Tier 2 "13–19", Tier 1 "≤12" for DC 13. */
export const saveRanges = dc => ({ 3: `${dc + 7}+`, 2: `${dc}–${dc + 6}`, 1: `≤${dc - 1}` });
/** The creatures of a Save card: [{ uuid, name, result, damageDone, hasDamage }] (a one-target card of v0.0.283 kept its target and result alone). */
export const saveCreatures = m => m.creatures ?? (m.target ? [{ uuid: m.target.uuid, name: m.target.name, result: m.result ?? null, damageDone: !!m.damageDone, hasDamage: !!m.hasDamage }] : []);
export function saveCardHtml(m, view = FULL_VIEW) {
  const rg = saveRanges(m.dc), cs = saveCreatures(m), one = cs.length <= 1, r = one ? cs[0]?.result ?? null : null;
  const anyRolled = cs.some(c => c.result);
  // v0.0.335 (Lucas: "the save card tier table can look more like the Action preview's"): Tier 1, 2, 3 from the top, "Tier N" in full, the preview's look
  // v0.0.347 (Lucas, playtest 4: "after the Save is rolled, condense to show just the rolled result"): once every creature rolled, only the Tiers rolled
  const condensed = cs.length > 0 && cs.every(c => c.result);
  const rows = [1, 2, 3].map(t => {
    const who = cs.filter(c => c.result?.tier === t), hit = one ? !!r && r.tier === t : who.length > 0;
    if (condensed && !hit) return "";
    const cls = `cc-srow t${t}${anyRolled ? (hit ? " hit" : " dim") : ""}${one ? "" : " many"}`;
    const names = !one && who.length ? `<span class="cc-who">${who.map(c => `<span class="cc-nchip">${esc(c.name)}</span>`).join("")}</span>` : "";
    const inner = `<span class="cc-scell"><b>Tier ${t}</b><small>${esc(rg[t])}</small></span><span class="cc-sbody">${names}${outcomeHtml(m.tiers?.[t], { none: t === 3 ? "No effect." : "" })}</span>${one && hit ? `<span class="cc-stotal">${r.total}</span>` : ""}`;
    return one && hit ? `<button type="button" class="${cls}" data-cc-toggle="save" aria-expanded="false" aria-label="${esc(`Their Tier ${t}: total ${r.total}. Show the roll`)}">${inner}</button>${breakdownHtml(r, { save: true, id: "save" })}` : `<div class="${cls}">${inner}</div>`;
  }).join("");
  const rollBtn = i => `<button type="button" class="cc-btn${one ? " primary" : " small primary"}" data-twod12="saveRoll" data-idx="${i}">Roll ${esc(m.saveName)}</button>`;
  // v0.0.286 (Lucas: Rebuke on three targets gave the old cards): several creatures, a row each; each rolls its own Save
  const crows = one ? "" : `<div class="cc-crows">${cs.map((c, i) => `<div class="cc-crow save"><span class="cc-cname">${esc(c.name)}</span>${c.result
    ? `<button type="button" class="cc-sres t${c.result.tier}" data-cc-toggle="s${i}" aria-expanded="false" aria-label="${esc(`${c.name}: their Tier ${c.result.tier}, total ${c.result.total}. Show the roll`)}">${tierPill(c.result.tier)}<span class="cc-stotal">${c.result.total}</span></button>${breakdownHtml(c.result, { save: true, id: `s${i}` })}`
    : view.owns(c.uuid) ? rollBtn(i) : '<span class="cc-muted">Waiting\u2026</span>'}</div>`).join("")}</div>`;
  // v0.0.287 (Lucas): the target row at the bottom, with the Damage button, as on the attack card
  const saveDmg = cs.some(c => c.result && c.hasDamage && !c.damageDone);
  const action = !cs.length ? '<div class="cc-muted cc-wait">No target yet: target the creatures, then press the target button below.</div>' : one && !r ? (view.owns(cs[0]?.uuid) ? `<div class="cc-btns">${rollBtn(0)}</div>` : `<div class="cc-muted cc-wait">Waiting for ${esc(cs[0]?.name ?? "the target")}'s ${esc(m.saveName)}\u2026</div>`) : "";
  // v0.0.294 (brief section 12): the Trigger / Interrupt under the meta lines and the Save line, above the Tier rows, then one diamond
  // CARD-ONE step 3: the card's lines in its order: the top ones (the Trigger among them) above the Save, the Version's Special between it and the Tiers
  const topLines = m.card ? cardLinesHtml(m.card.top) : "", trig = m.card ? cardLinesHtml(m.card.before) : triggerLineHtml(m);
  const flavor = cardSpecial(m) + (m.flavor ? `${divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "");   // CARD-ONE: the card's Special before the Flavor
  const des = designerFoot([m.designer?.ruler ? `Ruler: ${esc(m.designer.ruler)}` : "", m.designer?.mithril ? `Automation: ${esc(m.designer.mithril)}` : ""], view);
  return `<div class="cc-card cc-save${one ? "" : " many"}">${headHtml(m)}${metaLineHtml(m)}${topLines}<div class="cc-savehead"><b>${esc(m.saveName)}</b><span class="cc-rule" aria-hidden="true"></span><span class="cc-badge">DC ${m.dc}</span></div>${trig}<div class="cc-srows">${rows}</div>${m.card ? cardLinesHtml(m.card.after) : ""}${crows}${action}${m.dmg ? dmgAsPart(m.dmg, view) : ""}${flavor}${footHtml(m, view, { damage: "ccSaveDamage", hasDamage: saveDmg, locked: anyRolled })}${des}</div>`;
}

/* ------------------------------------------------------------------ the Trigger line, the non-roll card (brief sections 12 and 13) */
/** "Trigger: …" / "Interrupt: …" in plain text, then a one-diamond divider (nothing when the Action has none). */
/**
 * Pack CARD-ONE step 3: the card's own lines (cardlines.mjs, from the card model) on a chat card, in the card's order, in the Trigger line's
 * tight look: the lines before the roll (Requirement, Prerequisite, Interrupt / Trigger, Setup, the card's own lines), a Version's Special, the
 * card's Special. A card posted before this version has no m.card: it keeps its Setup and Trigger lines.
 */
export const cardLinesHtml = list => (list ?? []).map(l => `<div class="cc-trigger plain cc-line"><b>${esc(l.label)}:</b> ${l.html}</div>`).join("");
const cardSpecial = m => (m.card?.special ? cardLinesHtml([m.card.special]) : "");
export const triggerLineHtml = m => (m.triggerHtml ? `<div class="cc-trigger plain"><b>${esc(m.triggerLabel || "Trigger")}:</b> ${m.triggerHtml}</div>${divider(1)}` : "");
/**
 * A step of a non-roll card (Bulwark of Faith: "1 · Before the damage · [Give Guard 9]", "2 · After the damage · [Slide 1]"). Pure.
 * m.steps: [{ k (the chain's step), side, label, btn }]; m.afterDone: ["k|side"]; m.afterWait: { actor, token } while the triggering damage is held.
 * { state: "done" | "ready" | "wait", why }: a step waits for the one before it, and an "After the damage" step for the damage to land.
 */
export function stepState(m, i) {
  const st = (m.steps ?? [])[i];
  if (!st) return { state: "wait", why: "No such step" };
  const done = new Set(m.afterDone ?? []), key = s => `${s.k}|${s.side ?? ""}`;
  if (done.has(key(st))) return { state: "done", why: "" };
  const prev = (m.steps ?? []).slice(0, i).filter(x => x.k < st.k);
  if (prev.length && !prev.some(x => done.has(key(x)))) return { state: "wait", why: `First: ${prev.at(-1).label || "the step before"}` };
  if (m.afterWait && /after the damage/i.test(st.label ?? "")) return { state: "wait", why: "After the damage: it hasn't been applied yet" };
  return { state: "ready", why: "" };
}
/** The next step of a non-roll card: numbered steps (their buttons wait until their moment), or the slot the granted Action's row goes in. */
function nextHtml(m, view) {
  const steps = (m.steps ?? []).map((st, i) => {
    const s = stepState(m, i), btn = s.state === "done" ? '<span class="cc-done"><i class="fa-solid fa-check" aria-hidden="true"></i> Done</span>'
      : view.author ? `<button type="button" class="cc-btn small primary" data-twod12="applyAfter" data-step="${st.k}" data-side="${esc(st.side ?? "")}"${s.state === "wait" ? ` disabled aria-disabled="true" data-tooltip="${esc(s.why)}"` : ""}>${esc(st.btn)}</button>` : "";
    return `<div class="cc-step ${s.state}"><span class="cc-snum" aria-hidden="true">${i + 1}</span><b class="cc-slabel">${esc(st.label)}</b>${btn}</div>`;
  }).join("");
  const grant = m.useHtml ? `<div class="tline grantrow cc-grant${/attack/i.test(m.useName ?? "") ? " sword" : ""}"><span class="apside sr-only">Granted Action: ${esc(m.useName ?? "")}</span><div class="gbtns">${m.useOff ? `<span class="cc-gwhy" data-tooltip="${esc(m.useOff)}"><i class="fa-solid fa-ban" aria-hidden="true"></i> ${esc(m.useName ?? "")}</span>` : m.useHtml}</div></div>` : "";
  // v0.0.347 (Lucas, playtest 4: "the Weapon Attack should be before Apply, since it happens first"): the granted Action, then the steps
  return `<div class="cc-slot">${grant}</div>${steps ? `<div class="cc-steps">${steps}</div>` : ""}`;
}
/** v0.0.294 (brief section 13): an Action that makes no roll (Opportunity Attack, Bulwark of Faith, Aim): no stamp, no ladder, no category line, no Effects box. */
export function nonRollCardHtml(m, view = FULL_VIEW) {
  const flavor = cardSpecial(m) + (m.flavor ? `${divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "");   // CARD-ONE: the card's Special before the Flavor
  const des = designerFoot([m.designer?.ruler ? `Ruler: ${esc(m.designer.ruler)}` : "", m.designer?.mithril ? `Automation: ${esc(m.designer.mithril)}` : ""], view);
  const effect = m.effectHtml ? `${m.triggerHtml ? "" : divider(1)}<div class="cc-effect full">${m.effectHtml}</div>` : "";
  return `<div class="cc-card cc-noroll">${headHtml(m)}${metaLineHtml(m)}${m.card ? cardLinesHtml(m.card.top) + cardLinesHtml(m.card.before) : triggerLineHtml(m)}${effect}${nextHtml(m, view)}${flavor}${footHtml(m, view, { hasDamage: false })}${des}</div>`;
}

/* ------------------------------------------------------------------ the damage arithmetic */
/** "Resist 5 Fire, Weak 2 Holy, Immune Holy" (names or codes; "Resist Fire 5" too) → { resist: { Fi: 5 }, weak: { Ho: 2 }, immune: ["Ho"] }. The highest of each counts. */
export function parseDmgMods(text) {
  const out = { resist: {}, weak: {}, immune: [] };
  const code = w => { const s = String(w ?? "").trim().toLowerCase(); return Object.keys(SUBS).find(k => k.toLowerCase() === s || SUBS[k][0].toLowerCase() === s) ?? ""; };
  for (const part of String(text ?? "").split(/[,;\n]+/)) {
    const p = part.trim();
    let m = p.match(/^(resist|weak)\s+(\d+)\s+([a-z]+)$/i) ?? p.match(/^(resist|weak)\s+([a-z]+)\s+(\d+)$/i);
    if (m) {
      const n = Number(/^\d+$/.test(m[2]) ? m[2] : m[3]), c = code(/^\d+$/.test(m[2]) ? m[3] : m[2]), k = m[1].toLowerCase();
      if (c) out[k][c] = Math.max(out[k][c] ?? 0, n);
      continue;
    }
    m = p.match(/^immun(?:e|ity)(?:\s+to)?\s+([a-z]+)$/i);
    if (m && code(m[1]) && !out.immune.includes(code(m[1]))) out.immune.push(code(m[1]));
  }
  return out;
}
/**
 * v0.0.320 (pack AU part 2): the creature's own line merged with what its effects, Features and Talents give ([{ kind, sub, n }]: the "Resist, Weak or
 * Immune" setting). Two of the same kind and subtype don't add up: the highest applies (Ch. 1; Stacking). Returns a new { resist, weak, immune }.
 */
export function mergeDmgMods(base, extra = []) {
  const out = { resist: { ...(base?.resist ?? {}) }, weak: { ...(base?.weak ?? {}) }, immune: [...(base?.immune ?? [])] };
  for (const m of extra ?? []) {
    if (!m?.sub || !(m.sub in SUBS)) continue;
    if (m.kind === "immune") { if (!out.immune.includes(m.sub)) out.immune.push(m.sub); continue; }
    const k = m.kind === "weak" ? "weak" : "resist", n = Math.max(0, Math.trunc(Number(m.n)) || 0);
    if (n > 0) out[k][m.sub] = Math.max(out[k][m.sub] ?? 0, n);
  }
  return out;
}
/** v0.0.320: the subtypes whose Weak extra needs the origin's choice (Ch. 1: "for Weak, the origin chooses where the extra goes"): both pools carry that subtype. */
export function weakSplits(comps, mods) {
  const st = subTotals(comps);
  return Object.entries(st).filter(([s, t]) => s && !mods.immune?.includes(s) && (mods.weak?.[s] ?? 0) > 0 && t.B > 0 && t.M > 0).map(([s]) => s);
}
/** The damage per subtype, both pools together: { Fi: { B: 6, M: 4, total: 10 } } (untyped damage under ""). comps: [{ pool, sub, total }]. */
export function subTotals(comps) {
  const out = {};
  for (const c of comps ?? []) { const s = c.sub || "", p = c.pool === "M" ? "M" : "B"; out[s] ??= { B: 0, M: 0, total: 0 }; out[s][p] += Number(c.total) || 0; out[s].total += Number(c.total) || 0; }
  return out;
}
/**
 * What changes this damage for one creature, once per subtype per Action (Ch. 1): [{ v, label, sub, kind }] ("+2 Weak Holy", "−4 Resist Fire",
 * "Immune Holy" with v = −all). Resist only removes what that subtype dealt (4 Fire with Resist 5 Fire is −4).
 */
export function dmgModsFor(comps, mods) {
  const st = subTotals(comps), out = [];
  for (const [s, t] of Object.entries(st)) {
    if (!s || t.total <= 0) continue;
    if (mods.immune?.includes(s)) { out.push({ v: -t.total, label: `Immune ${subName(s)}`, sub: s, kind: "immune" }); continue; }
    const r = Math.min(t.total, mods.resist?.[s] ?? 0), w = mods.weak?.[s] ?? 0;
    if (r) out.push({ v: -r, label: `Resist ${subName(s)}`, sub: s, kind: "resist", split: t.B > 0 && t.M > 0 && r < t.total });
    if (w) out.push({ v: w, label: `Weak ${subName(s)}`, sub: s, kind: "weak" });
  }
  return out;
}
/**
 * The damage per pool after Resist / Weak / Immune: { B, M } (the factor (Half, Double) first, rounded up). choices: { [sub]: "B" | "M" } the pool
 * the resisting creature reduces first (default: the pool with more of that subtype... Vigor on a tie); Weak's extra goes to the pool the origin chose
 * (weakTo: { [sub]: "B" | "M" }, v0.0.320), else to the pool with more of it.
 */
export function afterResist(comps, mods, { factor = 1, choices = {}, weakTo = {} } = {}) {
  const scaled = (comps ?? []).map(c => ({ ...c, total: factor === 1 ? Number(c.total) || 0 : Math.ceil((Number(c.total) || 0) * factor) }));
  const st = subTotals(scaled), out = { B: 0, M: 0 };
  for (const [s, t] of Object.entries(st)) {
    let B = t.B, M = t.M;
    if (s && mods.immune?.includes(s)) { B = 0; M = 0; }
    else if (s) {
      let r = Math.min(t.total, mods.resist?.[s] ?? 0);
      const first = choices[s] ?? (M > B ? "M" : "B");
      for (const p of [first, first === "B" ? "M" : "B"]) { const n = Math.min(r, p === "B" ? B : M); if (p === "B") B -= n; else M -= n; r -= n; }
      const w = mods.weak?.[s] ?? 0;
      if (w) { const to = weakTo[s] ?? (M > B ? "M" : "B"); if (to === "M") M += w; else B += w; }
    }
    out.B += B; out.M += M;
  }
  return out;
}
/** Does applying this damage to the creature need its choice? "guard": Guard over both pools; "resist": a Resist split across both pools (Apply all skips it). */
export function choiceOf(comps, mods, guard = 0, factor = 1) {
  if (dmgModsFor(comps, mods).some(x => x.split)) return "resist";
  const a = afterResist(comps, mods, { factor }), g = Math.max(0, Number(guard) || 0);
  if (g > 0 && a.B > 0 && a.M > 0 && g < a.B + a.M) return "guard";
  return "";
}
/** Guard over the two pools, the pool chosen first: { B, M, taken, left }. */
export function guardSplit(a, guard, first = "B") {
  let g = Math.max(0, Number(guard) || 0);
  const out = { B: a.B, M: a.M, taken: 0 };
  for (const p of [first, first === "B" ? "M" : "B"]) { const n = Math.min(g, out[p]); out[p] -= n; g -= n; out.taken += n; }
  out.left = g;
  return out;
}
/** A rider lands when its damage does: more than 0 after Resist and Immune (the book, Ch. 1 Riders: Guard doesn't stop a rider). */
export const riderLands = afterResistTotal => Number(afterResistTotal) > 0;
/** The rows Apply all applies: every row not applied yet whose damage needs no choice. */
export const applyAllRows = rows => (rows ?? []).map((r, i) => ({ r, i })).filter(({ r }) => !r.applied && !r.choice).map(({ i }) => i);

/* ------------------------------------------------------------------ the damage message */
/** The instances of a damage roll, one per source, the flat parts with no dice folded in as Modifiers of the instance of the same pool and subtype. */
export function instancesOf(comps) {
  const list = [];
  for (const c of comps ?? []) {
    const dice = (c.dice ?? []).flatMap(d => d.results ?? []);
    if (!dice.length && list.length) {
      // v0.0.284: an untyped flat bonus (Heavy Blows +2) folds into the first instance of its pool (v0.0.326: named, never a bare "+2")
      const host = list.find(x => x.pool === (c.pool || "B") && x.sub === (c.sub || "")) ?? (!c.sub ? list.find(x => x.pool === (c.pool || "B")) : null) ?? null;
      if (host) { host.mods.push({ v: Number(c.total) || 0, label: c.label || c.src || (c.kind === "A" ? "Modifier" : "Flat") }); host.total += Number(c.total) || 0; continue; }
    }
    const emp = Number(c.emp) || 0, flat = (Number(c.total) || 0) - dice.reduce((a, b) => a + b, 0) - emp;
    const mods = [];
    if (flat) mods.push({ v: flat, label: c.flatLabel || (dice.length ? "Flat" : c.label || c.src || (c.kind === "A" ? "Modifier" : "")) });   // v0.0.326 (Lucas: "+3 Empowered +2" read as +5 from Empowered): the dice's own flat part is named
    if (emp) mods.push({ v: emp, label: emp > 0 ? "Empowered" : "Enfeebled" });
    list.push({ pool: c.pool || "B", sub: c.sub || "", src: c.src || c.weapon || "", dice: c.dice ?? [], mods, total: Number(c.total) || 0, formula: c.formula ?? "" });
  }
  return list;
}
/** The pool lines: "♥ Vigor · 6 Sl + 4 Fi" → 10 (the same subtype from several sources is one number). */
export function poolBlock(comps) {
  // v0.0.345 (Lucas, playtest 4: "the +[Mod] before Pi, both are the same subtype"): each subtype lists its parts, then its code once ("7 + 2 Pi")
  const by = { B: {}, M: {}, C: {} };
  for (const c of comps ?? []) { const p = by[c.pool] ? c.pool : "B", k = c.sub || ""; (by[p][k] ??= []).push(Number(c.total) || 0); }
  return ["B", "M", "C"].filter(p => Object.keys(by[p]).length).map(p => {
    const subs = Object.entries(by[p]), tot = subs.reduce((a, [, ns]) => a + ns.reduce((x, y) => x + y, 0), 0);
    // v0.0.346 (Lucas: "0 + 7 Pi + 2"): a part that is 0 (a Tier 1's weapon dice) is left out when the subtype has another
    // v0.0.373 (STYLE-2, Lucas): one number per damage type ("Resolve · 16 Ho", not "7 + 3 + 6 Ho"); the breakdown shows the parts
    return `<span class="cc-poolrow">${poolIc(p)}<span>${POOL[p]} · ${subs.map(([s, ns]) => `${ns.reduce((x, y) => x + y, 0)}${s ? ` ${subCode(s)}` : ""}`).join(" + ")}</span><b class="cc-ptot">${tot}</b></span>`;
  }).join("");
}
const instBlock = x => `<div class="cc-inst"><div class="cc-ititle">${poolIc(x.pool)} ${POOL[x.pool] ?? "Vigor"} · <b style="color:${subInk(x.sub)}">${esc(subName(x.sub))}</b>${x.src ? ` (${esc(x.src)})` : ""}</div>`
  // v0.0.284 (Lucas): no "Dice: none" for a flat amount, and a Total only for a dice expression
  + (x.dice.some(d => (d.results ?? []).length) ? `<span class="cc-bl">Dice</span><span class="cc-bv">${x.dice.map(d => (d.results ?? []).map((v, k) => (d.ex?.[k] ? `<span class="cc-ddie ex">${v}!</span>` : `<span class="cc-ddie">${v}</span>`)).join("")).join("")}</span>` : "")
  + (x.mods.length ? `<span class="cc-bl">Modifiers</span><span class="cc-bv">${x.mods.map(m => modTxt(m.v, m.label)).join(" ")}</span>` : "")
  + (x.dice.some(d => (d.results ?? []).length) ? `<span class="cc-bl">Total</span><span class="cc-bv"><b>${x.total}</b></span>` : "") + "</div>";
/**
 * v0.0.321 (Lucas: Resist / Weak / Immune only after Apply, and not loud): a small icon per kind after "Took …", what it did in its tooltip.
 * mods: [{ kind: "resist" | "weak" | "immune", label, v }].
 */
const RWI = { weak: ["fa-fire-flame-curved", "Weak"], resist: ["fa-shield-halved", "Resist"], immune: ["fa-ban", "Immune"] };
export const rwIcons = (mods = []) => Object.entries(RWI).map(([k, [ic, word]]) => {
  const list = (mods ?? []).filter(x => x?.kind === k);
  if (!list.length) return "";
  const tip = list.map(x => (k === "immune" ? x.label : `${x.v > 0 ? "+" : "\u2212"}${Math.abs(Number(x.v) || 0)} ${x.label}`)).join(", ");
  return `<i class="fa-solid ${ic} cc-rwi ${k}" aria-label="${esc(`${word}: ${tip}`)}"></i>`;
}).join("");
const tookTxt = (t, mods = []) => { const bits = [t.B ? `${poolIc("B")} ${t.B}` : "", t.M ? `${poolIc("M")} ${t.M}` : ""].filter(Boolean); return `${bits.length ? `Took ${bits.join(" · ")}` : "Took <b>No damage</b>"}${rwIcons(mods)}`; };
const stateChip = s => (s === "bloodied" ? '<span class="cc-state bloodied">Bloodied</span>' : s === "strained" ? '<span class="cc-state strained">Strained</span>' : s === "both" ? '<span class="cc-state bloodied">Bloodied</span><span class="cc-state strained">Strained</span>' : "");
/** A dice summary for a Tier's group: "3d8 Ho". */
export const diceSummary = comps => [...new Set((comps ?? []).map(c => `${c.formula ?? ""}`.replace(/\s.*$/, "")).filter(Boolean))].join(" + ");
/**
 * The damage message. m: { name, nl, srcId, groups: [{ tier, crit, comps, riders: [html], rows: [i] }], rows: [{ uuid, name, tier, mods, choice, applied }],
 * designer: { avg, atLeast } }. A row's applied: { took: { B, M }, state, factor }.
 */
/** v0.0.388 (pack ONE): the damage's pieces, for the damage card and for an attack or Save card that holds its own damage (m.dmg). */
function dmgParts(m, view = FULL_VIEW, { riders = true, idp = "g" } = {}) {
  const groups = m.groups ?? [], rows = m.rows ?? [], top = groups[0] ?? { tier: 0, comps: [] };
  const sum = cs => (cs ?? []).reduce((a, c) => a + (Number(c.total) || 0), 0);
  const ht = view.hideTgt;
  // v0.0.288: the Lethal / Nonlethal tag (none on a Bleed's card, v0.0.315); v0.0.321 (Lucas: it made the card taller): in each row's on-demand
  // row (the sliders button), and at the bottom only on a card with no target yet
  const nlTag = m.noNl ? "" : `<span class="cc-nl${m.nl ? " on" : ""}">${m.nl ? "Nonlethal" : "Lethal"}</span>`;
  const rowHtml = (i, nameHtml = null) => {
    const r = rows[i];
    if (!r) return "";
    if (ht) return `<div class="cc-trow"><span class="cc-cname">${esc(r.name)}</span><span class="cc-rmods">${r.applied ? stateChip(r.applied.state) : ""}</span><span class="cc-muted">${r.applied ? "✓ Applied" : "Waiting for the GM"}</span></div>`;
    if (r.applied) {
      const f = r.applied.factor ?? 1, adj = ["1", "0.5", "2"].map((k, j) => `<button type="button" class="cc-adj${String(f) === k ? " on" : ""}" data-twod12="ccAdjust" data-row="${i}" data-factor="${k}">${["Full", "Half", "Double"][j]}</button>`).join("");
      // v0.0.285 (Lucas): the applied row as compact as a pending one: "Took …" under the name, Full / Half / Double on demand
      // v0.0.321 (Lucas): Undo in Apply's place (the far right, the same width); the Lethal tag in the on-demand row
      return `<div class="cc-trow done"><span class="cc-nblk">${nameHtml ?? `<span class="cc-cname">${esc(r.name)}</span>`}<span class="cc-took">${tookTxt(r.applied.took ?? {}, r.applied.mods)} ${stateChip(r.applied.state)}</span></span>${view.author ? `<button type="button" class="cc-icon small" data-cc-more="${i}" aria-expanded="false" aria-label="Full, Half or Double"><i class="fa-solid fa-sliders" aria-hidden="true"></i></button><button type="button" class="cc-btn small cc-rbtn" data-twod12="ccUndo" data-row="${i}">✓ Undo</button><div class="cc-adjrow ondemand">${adj}${nlTag}</div>` : ""}</div>`;
    }
    // v0.0.321 (Lucas): Resist / Weak / Immune show only once applied (an icon after "Took"); the Guard stays
    // v0.0.398 (Lucas: "remove the '− Guard' from all damages, this should only show in the damage breakdown when you click to see it"): in the
    // on-demand panel (the sliders button) beside Full / Half / Double
    const mods = (r.mods ?? []).filter(x => x.kind === "guard").map(x => modTxt(x.v, x.label)).join(" ");
    const adj = view.author ? `<div class="cc-adjrow ondemand">${["1", "0.5", "2"].map((k, j) => `<button type="button" class="cc-adj${k === "1" ? " on" : ""}" data-twod12="ccApply" data-row="${i}" data-factor="${k}">${["Full", "Half", "Double"][j]}</button>`).join("")}${mods ? `<span class="cc-rmods">${mods}</span>` : ""}${nlTag}</div>` : "";
    return `<div class="cc-trow">${nameHtml ?? `<span class="cc-cname">${esc(r.name)}</span>`}${view.author ? `<button type="button" class="cc-icon small" data-cc-more="${i}" aria-expanded="false" aria-label="Half or Double"><i class="fa-solid fa-sliders" aria-hidden="true"></i></button><button type="button" class="cc-btn small primary cc-rbtn" data-twod12="ccApply" data-row="${i}" data-factor="1">Apply</button>` : ""}${adj}</div>`;
  };
  const many = groups.length > 1 || rows.length > 1;
  const body = groups.map((g, gi) => {
    const insts = mergeInstances(instancesOf(g.comps)), id = `${idp}${gi}`;   // v0.0.373 (Lucas): one block per pool and damage type
    const pools = `<button type="button" class="cc-pools" data-cc-toggle="${id}" aria-expanded="false" aria-label="Show the damage dice">${poolBlock(g.comps) || '<span class="cc-muted">No damage.</span>'}</button><div class="cc-break dmg" data-cc-panel="${id}">${insts.map(instBlock).join("")}</div>`;
    const head = many ? `<div class="cc-ghead">${tierPill(g.tier, g.crit, true)}<span>${poolLinesSummary(g.comps)}</span><b>${sum(g.comps)}</b></div>` : "";
    const rid = riders ? (g.riders ?? []).filter(Boolean).map(riderHtml).join("") : "";
    return `<div class="cc-dgroup">${head}${pools}${rid}<div class="cc-trows">${(g.rows ?? []).map(i => rowHtml(i)).join("")}</div></div>`;
  }).join("");
  const noTgt = !rows.length && view.author ? '<div class="cc-btns"><button type="button" class="cc-btn" data-twod12="ccDmgTarget"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Target the selected tokens</button></div>' : "";
  const pending = rows.filter(r => !r.applied).length;
  const allBtn = view.author && !ht && pending > 1 ? `<button type="button" class="cc-btn primary" data-twod12="ccApplyAll">Apply all</button>${rows.some(r => !r.applied && r.choice) ? '<span class="cc-muted">skips rows with a choice</span>' : ""}` : "";
  const tagHere = rows.length ? "" : nlTag;
  const all = allBtn || tagHere ? `<div class="cc-applyall">${allBtn}${tagHere}</div>` : "";
  const note = m.note ? `<div class="cc-dnote">${m.note}</div>` : "";   // v0.0.315 (Lucas, Bleed's card): a short line, no ↳ box
  const poolsOf = gi => { const g = groups[gi] ?? { comps: [] }, id = `${idp}${gi}`; return `<button type="button" class="cc-pools" data-cc-toggle="${id}" aria-expanded="false" aria-label="Show the damage dice">${poolBlock(g.comps) || '<span class="cc-muted">No damage.</span>'}</button><div class="cc-break dmg" data-cc-panel="${id}">${mergeInstances(instancesOf(g.comps)).map(instBlock).join("")}</div>`; };
  return { groups, rows, top, sum, rowHtml, body, all, noTgt, note, poolsOf, nlTag };
}
export function damageCardHtml(m, view = FULL_VIEW) {
  const { groups, top, sum, body, all, noTgt, note } = dmgParts(m, view);
  // v0.0.287 (Lucas: several Tiers showed only the top one): the stamp holds every Tier's total, a band each in its Tier's color
  const stamp = groups.length > 1
    ? `<button type="button" class="cc-stamp dmg multi" data-twod12="ccOpenSrc" aria-label="Open its roll card"><small class="cc-shd">DAMAGE</small>${groups.map(g => `<span class="cc-sband ${tierCls(g.tier || 1, g.crit)}"><b>${sum(g.comps)}</b><small class="cc-stl">Tier ${g.tier}</small></span>`).join("")}<small class="cc-stl cc-sarrow">\u2197</small></button>`
    : `<button type="button" class="cc-stamp dmg ${tierCls(top.tier || 1, top.crit)}" data-twod12="ccOpenSrc" aria-label="Open its roll card"><small>DAMAGE</small><b>${sum(top.comps)}</b>${top.tier ? `<small class="cc-stl">Tier ${top.tier} \u2197</small>` : ""}</button>`;
  const ht = view.hideTgt;
  const des = designerFoot([m.designer ? `Avg ${m.designer.avg} · this total or more: ${m.designer.atLeast}%` : ""], view);
  const pf = ht ? playerFoot("Player view · target details hidden by the GM") : "";
  return `<div class="cc-card cc-dmg"><div class="cc-body">${stamp}<div class="cc-main"><div class="cc-dhead"><b class="cc-name">${esc(m.name)}</b></div>${body}${note}${all}${noTgt}</div></div>${des}${pf}</div>`;
}
/**
 * v0.0.388 (pack ONE, Lucas: "C", foundry/mockups/chatone): one message per Action. A card that holds its own damage (m.dmg, the damage message's
 * model) draws it in place of a second card. compact (one target, one Tier): "Damage N" and the pools beside the stamp, under the ladder; the
 * target's damage row (Apply, or Took and Undo) in the footer, in the Damage button's place. Otherwise a "Damage" part under the card: a group a
 * Tier with its pools and its rows, Apply all. The Tier's riders are not repeated (the card already shows the Tier's outcome).
 */
/** The Save card's damage: always a part under its rows (its rows already name each creature). */
export function dmgAsPart(d, view = FULL_VIEW) {
  const p = dmgParts(d, view, { riders: false, idp: "d" }), total = p.groups.reduce((a, g) => a + p.sum(g.comps), 0);
  return `<div class="cc-dpart"><div class="cc-dlab"><span>Damage</span><b>${total}</b></div>${p.body}${p.note}${p.all}${p.noTgt}</div>`;
}
export function damageInHtml(d, view = FULL_VIEW) {
  const p = dmgParts(d, view, { riders: false, idp: "d" });
  const compact = p.groups.length === 1 && p.rows.length <= 1;
  const total = p.groups.reduce((a, g) => a + p.sum(g.comps), 0);
  const lab = `<div class="cc-dlab"><span>Damage</span><b>${total}</b></div>`;
  // (the Tier's damage line is not repeated under it: the rolled damage stands in its place; v0.0.389)
  if (compact) return { compact, main: `${lab}${p.poolsOf(0)}`, row: p.rows.length ? p.rowHtml(0) : "", extra: p.note };
  return { compact, part: `<div class="cc-dpart">${lab}${p.body}${p.note}${p.all}${p.noTgt}</div>` };
}
const poolLinesSummary = comps => {
  const by = new Map();
  for (const c of comps ?? []) { const p = c.pool || "B"; if (!by.has(p)) by.set(p, []); const f = String(c.formula ?? "").replace(/\s.*$/, ""); if (f && !/^\d+$/.test(f)) by.get(p).push(`${f}${c.sub ? ` ${c.sub}` : ""}`); }
  // v0.0.373 (Lucas): 2d6 Ho + 1d6 Ho reads 3d6 Ho (merged as plain text, then each type's code drawn in its color)
  return [...by].filter(([, l]) => l.length).map(([p, l]) => `${poolIc(p)} ${mergeDiceLine(l.join(" + ")).split(" + ").map(t => { const m = t.match(/^(.*?)(?: ([A-Z][a-z]))?$/); return `${esc(m[1])}${m[2] ? ` ${subCode(m[2])}` : ""}`; }).join(" + ")}`).join(" · ");
};

/** Draw any card model for a view. */
export function renderCard(m, view = FULL_VIEW) {
  if (!m) return "";
  if (m.kind === "attack") return attackCardHtml(m, view);
  if (m.kind === "save") return saveCardHtml(m, view);
  if (m.kind === "dmg") return damageCardHtml(m, view);
  if (m.kind === "noroll") return nonRollCardHtml(m, view);
  return "";
}
/** The message content: the card inside the system's chat wrapper (later rows, such as granted-use buttons, can be appended after .cc-card). */
export const cardContent = (m, view = FULL_VIEW) => `<div class="twod12 chat cc">${renderCard(m, view)}</div>`;

/** Replace the drawn card inside a message's content, keeping what other modules appended after it (granted-use rows). */
export function replaceCard(content, oldModel, newModel) {
  const pre = '<div class="twod12 chat cc">', old = pre + renderCard(oldModel);
  const c = String(content ?? "");
  return c.startsWith(old) ? pre + renderCard(newModel) + c.slice(old.length) : cardContent(newModel);
}

/* ------------------------------------------------------------------ the retarget: the same dice, each creature's Tier checked again */
/**
 * specs: [{ name, uuid, dc, dcLabel, boons, banes, sources, favored, doomed }] and the roll kept on the card ({ dice, mod, adj, adjLabel, manualBoons,
 * manualBanes, favored, doomed, general, chip, forced }). The dice must already hold every die the specs need (the caller rolls the missing ones).
 */
export function recheckRows(roll, specs, resolveShared) {
  return specs.map(sp => {
    const chk = resolveShared(roll.dice, { mod: roll.mod, adj: roll.adj, adjLabel: roll.adjLabel, dc: sp.dc, boons: sp.boons, banes: sp.banes, favored: !!(roll.favored || sp.favored), doomed: !!(roll.doomed || sp.doomed), sources: sp.sources, manualBoons: roll.manualBoons, manualBanes: roll.manualBanes });
    chk.dcLabel = sp.dcLabel;
    if (roll.forced >= 1 && roll.forced <= 3) { chk.base = roll.forced; chk.tier = roll.forced; chk.doubles = false; chk.crit = false; chk.forced = true; }
    return { chk, name: sp.name, uuid: sp.uuid };
  });
}
/** The dice a set of specs needs beyond the ones kept: { d12: 0 | 1, boon: n, bane: n }. */
// v0.0.301 (PACK BB): Boons and Banes have no dice; a third d12 when a target is now Favored or Doomed (its own, or 5 b/b left)
export const missingDice = (roll, specs) => ({
  d12: specs.some(sp => { const net = (Number(sp.boons) || 0) - (Number(sp.banes) || 0), f = !!(roll.favored || sp.favored) || net >= 5, d = !!(roll.doomed || sp.doomed) || net <= -5; return f !== d; }) && roll.dice.d.length < 3 ? 1 : 0,
  boon: 0, bane: 0
});
