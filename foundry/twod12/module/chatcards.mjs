// v0.0.283 (pack chat-cards, Lucas's design 2026-11-07; brief: foundry/mockups/chat-cards-brief.md): the attack roll card, the Save card and the
// damage message, drawn from a model stored on the message (flags.twod12.cc). Pure: no Foundry here, so the tests load it.
// The card is drawn for each viewer (the render hook in twod12.mjs calls render with that viewer's view): the GM sees everything; a player may have
// the enemy Defenses or the target details hidden by the GM; Designer mode (a client setting) adds the odds, the Ruler line and the Mithril mark.
// The message's stored content is the GM's view without Designer mode (the fallback when the hook can't run).
import { esc } from "./util.mjs";

/* ------------------------------------------------------------------ small pieces */
/** The subtypes' names and the card's ink for them (brief section 3; the others keep the system's ink). */
export const SUBS = {
  Sl: ["Slash", "#4a443b"], Bl: ["Blunt", "#4a443b"], Pi: ["Pierce", "#4a443b"], Fi: ["Fire", "#a0521a"], Ho: ["Holy", "#7d5400"], Co: ["Cold", "#2c6f8f"],
  Ac: ["Acid", "#3B6D11"], El: ["Electricity", "#7a5c00"], Fo: ["Force", "#7a24bf"], Ps: ["Psychic", "#993556"], Th: ["Thunder", "#0C447C"], Un: ["Unholy", "#4A1D63"]
};
const subInk = s => SUBS[s]?.[1] ?? "#4a443b";
export const subName = s => SUBS[s]?.[0] ?? (s || "Untyped");
/** A subtype's code in its color ("Ho"). */
export const subCode = s => (s ? `<span class="cc-sub" style="color:${subInk(s)}" title="${esc(subName(s))}">${esc(s)}</span>` : "");
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
/** The base Tier of a total (before Doubles). */
export const baseTier = (total, dc) => (total < dc ? 1 : total < dc + 7 ? 2 : 3);
/**
 * The ladder's model: { segs: [{ tier, label, lit }], arrow: { pos, faded }, up: pos | null, critZone: "" | "pale" | "solid" }.
 * r: { total, dc, tier, base, crit, doubles }; hide: the enemy Defense is hidden (labels "Tier N", the arrow in the middle of its Tier).
 */
export function ladderModel(r, hide = false) {
  const dc = Number(r.dc) || 13, base = r.base ?? baseTier(r.total, dc), tier = r.tier ?? base, raised = tier > base;
  const labels = hide ? ["Tier 1", "Tier 2", "Tier 3"] : ranges(dc);
  const pos = hide ? segMid(base) : arrowPos(r.total, dc);
  return {
    segs: [1, 2, 3].map(t => ({ tier: t, label: labels[t - 1], lit: t === tier })),
    arrow: { pos, faded: raised, total: r.total },
    up: raised ? segMid(tier) : null,
    critZone: tier === 3 ? (r.crit ? "solid" : "pale") : ""
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
  return `<div class="cc-stamp ${tierCls(r.tier, r.crit)}"><small>${r.crit ? "CRIT" : "TIER"}</small><b>${r.tier}</b>${line ? `<small class="cc-stl">${esc(line)}</small>` : ""}</div>`;
}
/** A small Tier pill (22px, the numeral) or a word pill ("Tier 2"). */
export const tierPill = (tier, crit = false, word = false) => `<span class="cc-pill ${tierCls(tier, crit)}${word ? " word" : ""}">${word ? (crit ? "Critical" : `Tier ${tier}`) : `T${tier}`}</span>`;   // v0.0.287 (Lucas): "T1", squared like the trait chips

/* ------------------------------------------------------------------ the roll breakdown */
/** The Boon and Bane dice of a roll, one per line, each with its source ("Boon · Flanking"). r: { boonFaces, baneFaces, sources, manualBoons, manualBanes }. */
export function boonBaneLines(r) {
  const names = (kind) => {
    const out = [];
    for (const s of r.sources ?? []) for (let i = 0; i < (s[kind] ?? 0); i++) out.push(String(s.name ?? "").replace(/\s*\([^)]*\)\s*$/, ""));
    return out;
  };
  const bn = names("boons"), bb = names("banes");
  return [
    ...(r.boonFaces ?? []).map((v, i) => ({ kind: "boon", face: v + 1, val: v, name: bn[i] ?? "" })),
    ...(r.baneFaces ?? []).map((v, i) => ({ kind: "bane", face: v + 1, val: -v, name: bb[i] ?? "" }))
  ];
}
/** The result chips of a breakdown's Total row. */
export function resultChips(r, { save = false, hide = false } = {}) {
  if (save) return `<span class="cc-pill word ${tierCls(r.tier, false)}">Their Tier ${r.tier}</span>`;
  const base = r.base ?? r.tier;
  if (r.crit) {
    const why = r.doubles && base === 3 ? "Doubles" : hide ? "" : `${r.dc + 20}+`;
    return `<span class="cc-pill word crit">Tier 3 → Critical${why ? ` · ${why}` : ""}</span>`;
  }
  if (r.tier > base) return `<span class="cc-pill word ${tierCls(r.tier, false)}">Tier ${base} → Tier ${r.tier} · Doubles</span>`;
  return `<span class="cc-pill word ${tierCls(r.tier, false)}">Tier ${r.tier}${r.forced ? " (forced)" : ""}</span>`;
}
/**
 * The breakdown panel: 2d12 (the dice as rolled, explosions grouped, the Doubles pair framed), Boon · Bane (one line per die), Modifiers, Total.
 * r: a check ({ d1, d2, dropped, doubles, crit, base, tier, total, dc, dcLabel, boonFaces, baneFaces, sources, mods: [{ v, label }] }).
 */
export function breakdownHtml(r, { hide = false, save = false, id = "", open = false } = {}) {
  const exploded = [r.d1, r.d2].some(f => (f ?? []).length > 1);
  const dblCls = r.doubles ? (r.crit && (r.base ?? 3) === 3 ? "crit" : "up") : "";
  const pair = `${dieGroup(r.d1)}${dieGroup(r.d2)}`;
  const dice = `${r.doubles ? `<span class="cc-dbl ${dblCls}">${pair}</span>` : pair}${r.dropped ? `<span class="cc-dropped" title="Dropped die">${dieGroup(r.dropped)}</span>` : ""}`;
  const chainTxt = exploded ? `<span class="cc-muted">${[r.d1, r.d2].map(f => f.map(x => (x === 12 ? 11 : x)).join(" + ")).join(" · ")}</span>` : "";
  const dblTag = r.doubles ? `<span class="cc-tag ${dblCls}">Doubles · ${dblCls === "crit" ? "Critical" : "+1 Tier"}</span>` : "";
  const rows = [`<span class="cc-bl">2d12</span><span class="cc-bv cc-dicerow">${dice}${chainTxt}${dblTag}</span>`];
  const bb = boonBaneLines(r);
  if (bb.length) rows.push(`<span class="cc-bl">Boon · Bane</span><span class="cc-bv">${bb.map(x => `<span class="cc-bbl" title="${esc(`${x.kind === "boon" ? "Boon" : "Bane"}${x.name ? `: ${x.name}` : ""}`)}"><span class="cc-d3 ${x.kind}" aria-hidden="true"><b>${x.face}</b></span>${modTxt(x.val, "")}<span>${x.kind === "boon" ? "Boon" : "Bane"}${x.name ? ` · ${esc(x.name)}` : ""}</span></span>`).join("")}</span>`);
  const mods = (r.mods ?? []).filter(m => m && Number(m.v));
  if (mods.length) rows.push(`<span class="cc-bl">Modifiers</span><span class="cc-bv">${mods.map(m => modTxt(Number(m.v), m.label)).join(" ")}</span>`);
  const badge = `${esc(r.dcLabel ?? "DC")}${hide && !save ? "" : ` ${r.dc}`}`;
  rows.push(`<span class="cc-btot"><b class="cc-total">${r.total}</b><small>vs</small><span class="cc-badge">${badge}</span><span class="cc-chips">${resultChips(r, { save, hide })}</span></span>`);
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
/** The outcome of one Tier: the damage line, then each rider on its own line ("↳ Pushed 2"). o: { parts, riders: [html] } */
export function outcomeHtml(o, { none = "" } = {}) {
  const dmg = poolLines(o?.parts);
  const riders = (o?.riders ?? []).filter(Boolean).map(h => `<div class="cc-rider"><span aria-hidden="true">↳</span> <span class="cc-rchip">${h}</span></div>`).join("");
  if (!dmg && !riders) return none ? `<div class="cc-none">${esc(none)}</div>` : "";
  return `${dmg ? `<div class="cc-dmgline">${dmg}</div>` : ""}${riders}`;
}

/* ------------------------------------------------------------------ the header and the target line */
const FREQ = { round: "Round", encounter: "Encounter", turn: "Turn", atwill: "At-will", daily: "Daily" };
export function headHtml(m) {
  const chip = [FREQ[m.freq] ?? "", m.cost].filter(Boolean).join(" · ");
  return `<div class="cc-head"><b class="cc-name">${esc(m.name)}</b>${chip ? `<span class="cc-cost f-${esc(m.freq || "none")}">${esc(chip)}</span>` : ""}</div>${m.traitsHtml ? `<div class="cc-traits">${m.traitsHtml}</div>` : ""}`;
}
/** "Targets ✦ Distance → target", the area button first for an Area Action, the retarget button at the right. */
export function targetLineHtml(m, view = FULL_VIEW, { locked = false } = {}) {
  const t = m.tline ?? {}, star = '<span class="cc-star" aria-hidden="true">✦</span>';
  const names = t.names?.length === 1 ? esc(t.names[0]) : t.names?.length ? `${t.names.length} targets` : "No target";
  const bits = [t.area ? t.area : t.targets ? esc(t.targets) : "", t.dist ? esc(t.dist) : ""].filter(Boolean).join(` ${star} `);
  const btn = view.author && !locked && t.retarget !== false ? `<button type="button" class="cc-icon" data-twod12="${esc(t.retargetKind ?? "retargetAction")}" aria-label="Target the selected tokens" title="Target the selected tokens"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>` : "";
  return `<div class="cc-tline"><span>${bits}${bits ? " " : ""}<span aria-hidden="true">→</span> <b>${names}</b></span>${btn}</div>`;
}
/**
 * v0.0.285 (Lucas, after v0.0.284): the attack card's target goes to the bottom, beside its buttons, as on the damage message: the top keeps
 * "Targets ✦ Distance" (the area button for an Area Action); the bottom row has the retarget button, "→ the target" and Damage / Card.
 */
export function metaLineHtml(m) {
  const t = m.tline ?? {}, star = '<span class="cc-star" aria-hidden="true">\u2726</span>';
  const bits = [t.area ? t.area : t.targets ? esc(t.targets) : "", t.dist ? esc(t.dist) : ""].filter(Boolean).join(` ${star} `);
  return bits ? `<div class="cc-tline meta"><span>${bits}</span></div>` : "";
}
export function footHtml(m, view = FULL_VIEW, { damage = "rollDamage", hasDamage = m.hasDamage, locked = m.locked } = {}) {   // v0.0.287: the Save card's too
  const t = m.tline ?? {}, n = t.names ?? [];
  const names = n.length === 1 ? `<b class="cc-tname">${esc(n[0])}</b>` : n.length ? `<b class="cc-tname" title="${esc(n.join(", "))}">${n.length} targets</b>` : '<span class="cc-muted">No target</span>';
  const re = view.author && !locked && t.retarget !== false ? `<button type="button" class="cc-icon" data-twod12="${esc(t.retargetKind ?? "retargetAction")}" aria-label="Target the selected tokens" title="Target the selected tokens"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>` : "";
  const dmg = hasDamage ? `<button type="button" class="cc-btn small primary" data-twod12="${damage}"><i class="fa-solid fa-dice" aria-hidden="true"></i> Damage</button>` : "";
  return `<hr class="cc-hr"><div class="cc-foot">${re}<span class="cc-ftgt"><span aria-hidden="true">\u2192</span> ${names}</span>${dmg}<button type="button" class="cc-btn small" data-twod12="ccCard">Card</button></div>`;
}
const designerFoot = (lines, view) => (view.designer && lines.filter(Boolean).length ? `<div class="cc-designer">${lines.filter(Boolean).join("<br>")}</div>` : "");
const playerFoot = txt => `<div class="cc-pfoot">${esc(txt)}</div>`;

/* ------------------------------------------------------------------ the attack card */
/** Which dice a creature kept, under its ladder (several targets with 3d12): "Favored: keeps 7 · 7 for Doubles, Tier 2 ↑ Tier 3". */
export function keptNote(r) {
  if (!r.dropped) return "";
  const kept = `${dieValue(r.d1)} · ${dieValue(r.d2)}`;
  if (r.state === "doomed") return `Doomed: the two lowest, ${kept}, no Doubles`;
  if (r.state === "favored") return r.doubles ? `Favored: keeps ${kept} for Doubles${r.tier > r.base ? `, Tier ${r.base} ↑ Tier ${r.tier}` : ""}` : `Favored: the two highest, ${kept}`;
  return `Normal: the first two, ${kept}`;
}
const defText = (r, hide) => [hide ? "" : `${r.dcLabel ?? "DC"} ${r.dc}`, r.banes ? `${r.banes} Bane${r.banes === 1 ? "" : "s"}` : "", r.boons ? `${r.boons} Boon${r.boons === 1 ? "" : "s"}` : "", r.state === "favored" ? "Favored" : r.state === "doomed" ? "Doomed" : ""].filter(Boolean).join(" · ");
const critLine = (m, rows, hide) => {
  if (!m.critHtml || !rows.some(r => r.tier === 3)) return "";
  const any = rows.some(r => r.crit);
  if (any) return `<div class="cc-critbox"><span class="cc-critlbl on">Critical</span><span class="cc-crittxt">${m.critHtml}</span></div>`;
  const dc = rows[0]?.dc ?? 13;
  const why = hide ? "" : rows.length === 1 || rows.every(r => r.dc === dc) ? `Doubles, or ${dc + 20}+` : "Doubles, or 20 over its Defense";
  return `<div class="cc-critline"><span class="cc-critlbl">Critical</span>${why ? `<small>${why}</small>` : ""}<span class="cc-crittxt">${m.critHtml}</span></div>`;
};
export function attackCardHtml(m, view = FULL_VIEW) {
  const hide = view.hideDef, rows = m.rows ?? [], one = rows.length <= 1;
  const btns = footHtml(m, view);
  const effects = m.effectsHtml && rows.some(r => r.tier >= (m.effectsFrom ?? 2)) ? `${divider(1)}<div class="cc-effect">${m.effectsHtml}</div>` : "";
  const flavor = m.flavor ? `${divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "";
  const des = designerFoot([...(m.designer?.odds ?? []).map(o => `Odds${o.name ? ` (${esc(o.name)})` : ""}: ${esc(o.text)}`), m.designer?.ruler ? `Ruler: ${esc(m.designer.ruler)}` : "", m.designer?.mithril ? `Automation: ${esc(m.designer.mithril)}` : ""], view);
  const pf = hide ? playerFoot("Player view · enemy Defenses hidden by the GM") : "";
  const head = `${headHtml(m)}${metaLineHtml(m)}${m.setupHtml ?? ""}`;
  if (one) {
    const r = rows[0];
    const body = `<div class="cc-body">${stampHtml(r, { hide })}<div class="cc-main">${ladderHtml(r, { hide, id: "r0" })}${breakdownHtml(r, { hide, id: "r0" })}<div class="cc-outcome">${outcomeHtml(m.outcomes?.[r.tier])}</div>${critLine(m, rows, hide)}${effects}</div></div>`;
    return `<div class="cc-card cc-attack">${head}${body}${flavor}${m.extraHtml ?? ""}${btns}${des}${pf}</div>`;
  }
  // several targets: one shared roll, a row per creature, the outcome grouped by Tier
  const sh = m.shared ?? {};
  const shared = `<div class="cc-shared"><span class="cc-bl">${(sh.d ?? []).length}d12</span>${(sh.d ?? []).map(dieGroup).join("")}${sh.mod ? ` ${modTxt(sh.mod, "Modifier")}` : ""}</div>`;
  const crows = rows.map((r, i) => `<div class="cc-crow">${tierPill(r.tier, r.crit)}<span class="cc-cname">${esc(r.name)}</span><span class="cc-cdef">${hide ? "" : `<span class="cc-badge">${esc(r.dcLabel ?? "DC")} ${r.dc}</span>`}${defText(r, true) ? `<span>${esc(defText(r, true))}</span>` : ""}</span>${ladderHtml(r, { hide, thin: true, id: `r${i}` })}${keptNote(r) ? `<div class="cc-muted cc-kept">${esc(keptNote(r))}</div>` : ""}${breakdownHtml(r, { hide, id: `r${i}` })}</div>`).join("");
  const groups = [3, 2, 1].map(t => {
    const who = rows.filter(r => r.tier === t);
    if (!who.length) return "";
    const out = outcomeHtml(m.outcomes?.[t]);
    return `<div class="cc-tgroup"><div class="cc-ghd">${tierPill(t, false, true)}<span class="cc-who">${who.map(r => `<span class="cc-nchip">${esc(r.name)}</span>`).join("")}</span></div>${out}${t === 3 ? critLine(m, who, hide) : ""}</div>`;
  }).join("");
  return `<div class="cc-card cc-attack many">${head}${shared}<div class="cc-crows">${crows}</div><div class="cc-groups">${groups}</div>${effects}${flavor}${m.extraHtml ?? ""}${btns}${des}${pf}</div>`;
}

/* ------------------------------------------------------------------ the Save card */
/** The Save's three ranges, as the target's totals: Tier 3 "20+", Tier 2 "13–19", Tier 1 "≤12" for DC 13. */
export const saveRanges = dc => ({ 3: `${dc + 7}+`, 2: `${dc}–${dc + 6}`, 1: `≤${dc - 1}` });
/** The creatures of a Save card: [{ uuid, name, result, damageDone, hasDamage }] (a one-target card of v0.0.283 kept its target and result alone). */
export const saveCreatures = m => m.creatures ?? (m.target ? [{ uuid: m.target.uuid, name: m.target.name, result: m.result ?? null, damageDone: !!m.damageDone, hasDamage: !!m.hasDamage }] : []);
export function saveCardHtml(m, view = FULL_VIEW) {
  const rg = saveRanges(m.dc), cs = saveCreatures(m), one = cs.length <= 1, r = one ? cs[0]?.result ?? null : null;
  const anyRolled = cs.some(c => c.result);
  const rows = [3, 2, 1].map(t => {
    const who = cs.filter(c => c.result?.tier === t), hit = one ? !!r && r.tier === t : who.length > 0;
    const cls = `cc-srow t${t}${anyRolled ? (hit ? " hit" : " dim") : ""}${one ? "" : " many"}`;
    const names = !one && who.length ? `<span class="cc-who">${who.map(c => `<span class="cc-nchip">${esc(c.name)}</span>`).join("")}</span>` : "";
    const inner = `<span class="cc-scell"><b>T${t}</b><small>${esc(rg[t])}</small></span><span class="cc-sbody">${names}${outcomeHtml(m.tiers?.[t], { none: t === 3 ? "No effect." : "" })}</span>${one && hit ? `<span class="cc-stotal">${r.total}</span>` : ""}`;
    return one && hit ? `<button type="button" class="${cls}" data-cc-toggle="save" aria-expanded="false" aria-label="${esc(`Their Tier ${t}: total ${r.total}. Show the roll`)}">${inner}</button>${breakdownHtml(r, { save: true, id: "save" })}` : `<div class="${cls}">${inner}</div>`;
  }).join("");
  const rollBtn = i => `<button type="button" class="cc-btn${one ? " primary" : " small primary"}" data-twod12="saveRoll" data-idx="${i}">Roll ${esc(m.saveName)}</button>`;
  // v0.0.286 (Lucas: Rebuke on three targets gave the old cards): several creatures, a row each; each rolls its own Save
  const crows = one ? "" : `<div class="cc-crows">${cs.map((c, i) => `<div class="cc-crow save"><span class="cc-cname">${esc(c.name)}</span>${c.result
    ? `<button type="button" class="cc-sres t${c.result.tier}" data-cc-toggle="s${i}" aria-expanded="false" aria-label="${esc(`${c.name}: their Tier ${c.result.tier}, total ${c.result.total}. Show the roll`)}">${tierPill(c.result.tier)}<span class="cc-stotal">${c.result.total}</span></button>${breakdownHtml(c.result, { save: true, id: `s${i}` })}`
    : view.owns(c.uuid) ? rollBtn(i) : '<span class="cc-muted">Waiting\u2026</span>'}</div>`).join("")}</div>`;
  // v0.0.287 (Lucas): the target row at the bottom, with the Damage button, as on the attack card
  const saveDmg = cs.some(c => c.result && c.hasDamage && !c.damageDone);
  const action = one && !r ? (view.owns(cs[0]?.uuid) ? `<div class="cc-btns">${rollBtn(0)}</div>` : `<div class="cc-muted cc-wait">Waiting for ${esc(cs[0]?.name ?? "the target")}'s ${esc(m.saveName)}\u2026</div>`) : "";
  const trig = m.triggerHtml ? `${divider(1)}<div class="cc-trigger"><b>${esc(m.triggerLabel || "Trigger")}:</b> ${m.triggerHtml}</div>` : "";
  const flavor = m.flavor ? `${divider(3)}<div class="cc-flavor">${esc(m.flavor)}</div>` : "";
  const des = designerFoot([m.designer?.ruler ? `Ruler: ${esc(m.designer.ruler)}` : "", m.designer?.mithril ? `Automation: ${esc(m.designer.mithril)}` : ""], view);
  return `<div class="cc-card cc-save${one ? "" : " many"}">${headHtml(m)}${metaLineHtml(m)}<div class="cc-savehead"><b>${esc(m.saveName)}</b><span class="cc-rule" aria-hidden="true"></span><span class="cc-badge">DC ${m.dc}</span></div><div class="cc-srows">${rows}</div>${crows}${action}${trig}${flavor}${footHtml(m, view, { damage: "ccSaveDamage", hasDamage: saveDmg, locked: anyRolled })}${des}</div>`;
}

/* ------------------------------------------------------------------ the damage arithmetic */
/** "Resist 5 Fire, Weak 2 Holy, Immunity Holy" (names or codes; "Resist Fire 5" too) → { resist: { Fi: 5 }, weak: { Ho: 2 }, immune: ["Ho"] }. The highest of each counts. */
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
/** The damage per subtype, both pools together: { Fi: { B: 6, M: 4, total: 10 } } (untyped damage under ""). comps: [{ pool, sub, total }]. */
export function subTotals(comps) {
  const out = {};
  for (const c of comps ?? []) { const s = c.sub || "", p = c.pool === "M" ? "M" : "B"; out[s] ??= { B: 0, M: 0, total: 0 }; out[s][p] += Number(c.total) || 0; out[s].total += Number(c.total) || 0; }
  return out;
}
/**
 * What changes this damage for one creature, once per subtype per Action (Ch. 1): [{ v, label, sub, kind }] ("+2 Weak Holy", "−4 Resist Fire",
 * "Immunity Holy" with v = −all). Resist only removes what that subtype dealt (4 Fire with Resist 5 Fire is −4).
 */
export function dmgModsFor(comps, mods) {
  const st = subTotals(comps), out = [];
  for (const [s, t] of Object.entries(st)) {
    if (!s || t.total <= 0) continue;
    if (mods.immune?.includes(s)) { out.push({ v: -t.total, label: `Immunity ${subName(s)}`, sub: s, kind: "immune" }); continue; }
    const r = Math.min(t.total, mods.resist?.[s] ?? 0), w = mods.weak?.[s] ?? 0;
    if (r) out.push({ v: -r, label: `Resist ${subName(s)}`, sub: s, kind: "resist", split: t.B > 0 && t.M > 0 && r < t.total });
    if (w) out.push({ v: w, label: `Weak ${subName(s)}`, sub: s, kind: "weak" });
  }
  return out;
}
/**
 * The damage per pool after Resist / Weak / Immunity: { B, M } (the factor (Half, Double) first, rounded up). choices: { [sub]: "B" | "M" } the pool
 * the resisting creature reduces first (default: the pool with more of that subtype... Vigor on a tie); Weak's extra goes to the pool with more of it.
 */
export function afterResist(comps, mods, { factor = 1, choices = {} } = {}) {
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
      if (w) { if (M > B) M += w; else B += w; }
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
/** A rider lands when its damage does: more than 0 after Resist and Immunity (the book, Ch. 1 Riders: Guard doesn't stop a rider). */
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
      // v0.0.284: an untyped flat bonus (Heavy Blows +2) folds into the first instance of its pool
      const host = list.find(x => x.pool === (c.pool || "B") && x.sub === (c.sub || "")) ?? (!c.sub ? list.find(x => x.pool === (c.pool || "B")) : null) ?? null;
      if (host) { host.mods.push({ v: Number(c.total) || 0, label: c.label || c.src || (c.kind === "A" ? "Modifier" : "") }); host.total += Number(c.total) || 0; continue; }
    }
    const emp = Number(c.emp) || 0, flat = (Number(c.total) || 0) - dice.reduce((a, b) => a + b, 0) - emp;
    const mods = [];
    if (flat) mods.push({ v: flat, label: c.flatLabel || (dice.length ? "" : c.label || c.src || (c.kind === "A" ? "Modifier" : "")) });
    if (emp) mods.push({ v: emp, label: emp > 0 ? "Empowered" : "Enfeebled" });
    list.push({ pool: c.pool || "B", sub: c.sub || "", src: c.src || c.weapon || "", dice: c.dice ?? [], mods, total: Number(c.total) || 0, formula: c.formula ?? "" });
  }
  return list;
}
/** The pool lines: "♥ Vigor · 6 Sl + 4 Fi" → 10 (the same subtype from several sources is one number). */
export function poolBlock(comps) {
  const by = { B: {}, M: {}, C: {} };
  for (const c of comps ?? []) { const p = by[c.pool] ? c.pool : "B"; by[p][c.sub || ""] = (by[p][c.sub || ""] ?? 0) + (Number(c.total) || 0); }
  return ["B", "M", "C"].filter(p => Object.keys(by[p]).length).map(p => {
    const subs = Object.entries(by[p]), tot = subs.reduce((a, [, n]) => a + n, 0);
    return `<span class="cc-poolrow">${poolIc(p)}<span>${POOL[p]} · ${subs.map(([s, n]) => `${n}${s ? ` ${subCode(s)}` : ""}`).join(" + ")}</span><b class="cc-ptot">${tot}</b></span>`;
  }).join("");
}
const instBlock = x => `<div class="cc-inst"><div class="cc-ititle">${poolIc(x.pool)} ${POOL[x.pool] ?? "Vigor"} · <b style="color:${subInk(x.sub)}">${esc(subName(x.sub))}</b>${x.src ? ` (${esc(x.src)})` : ""}</div>`
  // v0.0.284 (Lucas): no "Dice: none" for a flat amount, and a Total only for a dice expression
  + (x.dice.some(d => (d.results ?? []).length) ? `<span class="cc-bl">Dice</span><span class="cc-bv">${x.dice.map(d => (d.results ?? []).map(v => `<span class="cc-ddie">${v}</span>`).join("")).join("")}</span>` : "")
  + (x.mods.length ? `<span class="cc-bl">Modifiers</span><span class="cc-bv">${x.mods.map(m => modTxt(m.v, m.label)).join(" ")}</span>` : "")
  + (x.dice.some(d => (d.results ?? []).length) ? `<span class="cc-bl">Total</span><span class="cc-bv"><b>${x.total}</b></span>` : "") + "</div>";
const tookTxt = t => { const bits = [t.B ? `${poolIc("B")} ${t.B}` : "", t.M ? `${poolIc("M")} ${t.M}` : ""].filter(Boolean); return bits.length ? `Took ${bits.join(" · ")}` : "Took <b>No damage</b>"; };
const stateChip = s => (s === "bloodied" ? '<span class="cc-state bloodied">Bloodied</span>' : s === "strained" ? '<span class="cc-state strained">Strained</span>' : s === "both" ? '<span class="cc-state bloodied">Bloodied</span><span class="cc-state strained">Strained</span>' : "");
/** A dice summary for a Tier's group: "3d8 Ho". */
export const diceSummary = comps => [...new Set((comps ?? []).map(c => `${c.formula ?? ""}`.replace(/\s.*$/, "")).filter(Boolean))].join(" + ");
/**
 * The damage message. m: { name, nl, srcId, groups: [{ tier, crit, comps, riders: [html], rows: [i] }], rows: [{ uuid, name, tier, mods, choice, applied }],
 * designer: { avg, atLeast } }. A row's applied: { took: { B, M }, state, factor }.
 */
export function damageCardHtml(m, view = FULL_VIEW) {
  const groups = m.groups ?? [], rows = m.rows ?? [], top = groups[0] ?? { tier: 0, comps: [] };
  const sum = cs => (cs ?? []).reduce((a, c) => a + (Number(c.total) || 0), 0);
  // v0.0.287 (Lucas: several Tiers showed only the top one): the stamp holds every Tier's total, a band each in its Tier's color
  const stamp = groups.length > 1
    ? `<button type="button" class="cc-stamp dmg multi" data-twod12="ccOpenSrc" aria-label="Open its roll card"><small class="cc-shd">DAMAGE</small>${groups.map(g => `<span class="cc-sband ${tierCls(g.tier || 1, g.crit)}"><b>${sum(g.comps)}</b><small class="cc-stl">Tier ${g.tier}</small></span>`).join("")}<small class="cc-stl cc-sarrow">\u2197</small></button>`
    : `<button type="button" class="cc-stamp dmg ${tierCls(top.tier || 1, top.crit)}" data-twod12="ccOpenSrc" aria-label="Open its roll card"><small>DAMAGE</small><b>${sum(top.comps)}</b>${top.tier ? `<small class="cc-stl">Tier ${top.tier} \u2197</small>` : ""}</button>`;
  const ht = view.hideTgt;
  const rowHtml = i => {
    const r = rows[i];
    if (!r) return "";
    if (ht) return `<div class="cc-trow"><span class="cc-cname">${esc(r.name)}</span><span class="cc-rmods">${r.applied ? stateChip(r.applied.state) : ""}</span><span class="cc-muted">${r.applied ? "✓ Applied" : "Waiting for the GM"}</span></div>`;
    if (r.applied) {
      const f = r.applied.factor ?? 1, adj = ["1", "0.5", "2"].map((k, j) => `<button type="button" class="cc-adj${String(f) === k ? " on" : ""}" data-twod12="ccAdjust" data-row="${i}" data-factor="${k}">${["Full", "Half", "Double"][j]}</button>`).join("");
      // v0.0.285 (Lucas): the applied row as compact as a pending one: "Took …" under the name, Full / Half / Double on demand
      return `<div class="cc-trow done"><span class="cc-nblk"><span class="cc-cname">${esc(r.name)}</span><span class="cc-took">${tookTxt(r.applied.took ?? {})} ${stateChip(r.applied.state)}</span></span>${view.author ? `<button type="button" class="cc-icon small" data-cc-more="${i}" aria-expanded="false" aria-label="Full, Half or Double" title="Full, Half or Double"><i class="fa-solid fa-sliders" aria-hidden="true"></i></button><button type="button" class="cc-btn small" data-twod12="ccUndo" data-row="${i}">✓ Undo</button><div class="cc-adjrow ondemand">${adj}</div>` : ""}</div>`;
    }
    const mods = (r.mods ?? []).map(x => (x.kind === "immune" ? `<span class="cc-minus">${esc(x.label)}</span>` : modTxt(x.v, x.label))).join(" ");
    const adj = view.author ? `<div class="cc-adjrow ondemand">${["1", "0.5", "2"].map((k, j) => `<button type="button" class="cc-adj${k === "1" ? " on" : ""}" data-twod12="ccApply" data-row="${i}" data-factor="${k}">${["Full", "Half", "Double"][j]}</button>`).join("")}</div>` : "";
    return `<div class="cc-trow"><span class="cc-cname">${esc(r.name)}</span><span class="cc-rmods">${mods}</span>${view.author ? `<button type="button" class="cc-icon small" data-cc-more="${i}" aria-expanded="false" aria-label="Half or Double" title="Half or Double"><i class="fa-solid fa-sliders" aria-hidden="true"></i></button><button type="button" class="cc-btn small primary" data-twod12="ccApply" data-row="${i}" data-factor="1">Apply</button>` : ""}${adj}</div>`;
  };
  const many = groups.length > 1 || rows.length > 1;
  const body = groups.map((g, gi) => {
    const insts = instancesOf(g.comps), id = `g${gi}`;
    const pools = `<button type="button" class="cc-pools" data-cc-toggle="${id}" aria-expanded="false" aria-label="Show the damage dice">${poolBlock(g.comps) || '<span class="cc-muted">No damage.</span>'}</button><div class="cc-break dmg" data-cc-panel="${id}">${insts.map(instBlock).join("")}</div>`;
    const head = many ? `<div class="cc-ghead">${tierPill(g.tier, g.crit, true)}<span>${poolLinesSummary(g.comps)}</span><b>${sum(g.comps)}</b></div>` : "";
    const riders = (g.riders ?? []).filter(Boolean).map(h => `<div class="cc-rider"><span aria-hidden="true">↳</span> <span class="cc-rchip">${h}</span></div>`).join("");
    return `<div class="cc-dgroup">${head}${pools}${riders}<div class="cc-trows">${(g.rows ?? []).map(rowHtml).join("")}</div></div>`;
  }).join("");
  const noTgt = !rows.length && view.author ? '<div class="cc-btns"><button type="button" class="cc-btn" data-twod12="ccDmgTarget"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Target the selected tokens</button></div>' : "";
  const pending = rows.filter(r => !r.applied).length;
  const all = view.author && !ht && pending > 1 ? `<div class="cc-applyall"><button type="button" class="cc-btn primary" data-twod12="ccApplyAll">Apply all</button>${rows.some(r => !r.applied && r.choice) ? '<span class="cc-muted">skips rows with a choice</span>' : ""}</div>` : "";
  const des = designerFoot([m.designer ? `Avg ${m.designer.avg} · this total or more: ${m.designer.atLeast}%` : ""], view);
  const pf = ht ? playerFoot("Player view · target details hidden by the GM") : "";
  return `<div class="cc-card cc-dmg"><div class="cc-body">${stamp}<div class="cc-main"><div class="cc-dhead"><b class="cc-name">${esc(m.name)}</b><span class="cc-dtags"><span class="cc-muted">Damage</span><span class="cc-nl${m.nl ? " on" : ""}">${m.nl ? "Nonlethal" : "Lethal"}</span></span></div>${body}${all}${noTgt}</div></div>${des}${pf}</div>`;
}
const poolLinesSummary = comps => {
  const by = new Map();
  for (const c of comps ?? []) { const p = c.pool || "B"; if (!by.has(p)) by.set(p, []); const f = String(c.formula ?? "").replace(/\s.*$/, ""); if (f && !/^\d+$/.test(f)) by.get(p).push(`${esc(f)}${c.sub ? ` ${subCode(c.sub)}` : ""}`); }
  return [...by].filter(([, l]) => l.length).map(([p, l]) => `${poolIc(p)} ${l.join(" + ")}`).join(" · ");
};

/** Draw any card model for a view. */
export function renderCard(m, view = FULL_VIEW) {
  if (!m) return "";
  if (m.kind === "attack") return attackCardHtml(m, view);
  if (m.kind === "save") return saveCardHtml(m, view);
  if (m.kind === "dmg") return damageCardHtml(m, view);
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
export const missingDice = (roll, specs) => ({
  d12: specs.some(sp => (roll.favored || sp.favored) !== (roll.doomed || sp.doomed)) && roll.dice.d.length < 3 ? 1 : 0,
  boon: Math.max(0, Math.max(0, ...specs.map(sp => sp.boons || 0)) - roll.dice.boonFaces.length),
  bane: Math.max(0, Math.max(0, ...specs.map(sp => sp.banes || 0)) - roll.dice.baneFaces.length)
});
