// v0.0.292 (PACK ROLL-DIALOG, Lucas's design 2026-11-07, boards C2; brief: foundry/mockups/roll-dialog-brief.md): the roll dialog of an Action that
// rolls against a Defense. Pure: the model (what the dialog shows and what the roll gets) and its HTML; no Foundry here, so the tests load it.
// The window (rollwindow.mjs) keeps a state and redraws from inp + state on every click; actions.mjs builds inp and reads result().
//
// inp: {
//   name, flavor, reaction, freq ("round"), freqColor, versions: [{ ap, cost ("2 AP"), disabled, why, traits: [{ key, label, group, tip }],
//     meta: { escalation, targets, dist, vs, requirements, setup, trigger, triggerKind }, tiers: { 1: { parts: [{ pool, t, sub }], riders: [html] }, 2, 3 },
//     crit (html), effects (html), effectsFrom (2), noTiers }],
//   ap (the Version open first), roll: { mod, name ("Signature") }, multi, area: { label, placed } | null,
//   chips: [{ id, scope ("shared" | a creature's uuid), row, kind, label, n, start ("on" | "off" | "na"), tip, why, rule: { uuid, label }, fx, bonusKey,
//     special ("nl" | "reload"), tiers: [1, 2, 3], tag ("+1d6 Ho"), pool ("B" | "M") }],
//   creatures: [{ uuid, name, size, def ("AD"), dc }], hideDef (the player view), designer, blocked: [reasons], rollMode, rollModes: [[key, label]], notices: [{ text, why }]
// }
// state: { ap, toggled: { id: bool }, manual: { scope: { boon, bane, plus, minus, emp, enf, fav, doom } }, fold: { "scope|row|off": bool }, open: { uuid: bool },
//   removed: [uuid], rollMode, forceTier }
import { esc } from "./util.mjs";
import { tierProbs } from "./calc.mjs";

/* ------------------------------------------------------------------ chips */
/** The rows of the Modifiers panel, in their order, with their labels (the brief: Passives, Boons, Banes, Flat, Damage). */
export const ROWS = [["passives", "Passives"], ["boons", "Boons"], ["banes", "Banes"], ["flat", "Flat"], ["damage", "Damage"]];
/** A chip's kind: a buff (green outline) or a debuff (red), and its pip. */
const BUFF = new Set(["boon", "fav", "plus", "emp", "pass"]);
export const isBuff = c => BUFF.has(c.kind) || (c.special === "reload");
/** Where a manual chip goes and how it reads. */
const MANUAL = {
  boon: { row: "boons", label: n => (n > 1 ? `Situational ×${n}` : "Situational") },
  bane: { row: "banes", label: n => (n > 1 ? `Situational ×${n}` : "Situational") },
  plus: { row: "flat", label: n => `Situational +${n}` },
  minus: { row: "flat", label: n => `Situational −${n}` },
  emp: { row: "damage", label: n => `Empowered ${n}` },
  enf: { row: "damage", label: n => `Enfeebled ${n}` },
  fav: { row: "boons", label: () => "Favored" },
  doom: { row: "banes", label: () => "Doomed" }
};
/** The quick buttons: one target has them all; several targets have no Favored / Doomed in the shared panel (they are added per creature). */
export const quickKinds = multi => (multi ? ["boon", "bane", "plus", "minus", "emp", "enf"] : ["boon", "bane", "fav", "doom", "plus", "minus", "emp", "enf"]);
export const QUICK_LABEL = { boon: "Boon", bane: "Bane", fav: "Favored", doom: "Doomed", plus: "+1", minus: "−1", emp: "Empowered", enf: "Enfeebled" };

/** A new, empty state. */
export const newState = (inp, old = null) => ({ ap: old?.ap ?? inp.ap ?? inp.versions?.[0]?.ap, toggled: { ...(old?.toggled ?? {}) }, manual: JSON.parse(JSON.stringify(old?.manual ?? {})),
  fold: { ...(old?.fold ?? {}) }, open: { ...(old?.open ?? {}) }, removed: [...(old?.removed ?? [])], rollMode: old?.rollMode ?? inp.rollMode ?? "publicroll", forceTier: old?.forceTier ?? 0 });

/** A click on a quick button: one more step (Boon ×2, +2, Empowered 2); Favored and Doomed once only. */
export function addManual(st, scope, kind) {
  const m = (st.manual[scope] ??= {});
  if (kind === "fav" || kind === "doom") m[kind] = true;
  else m[kind] = (Number(m[kind]) || 0) + 1;
  delete st.toggled[`man:${scope}:${kind}`];   // a manual chip added again is on
  return st;
}
/** The × of a manual chip: one step less. */
export function removeManual(st, scope, kind) {
  const m = st.manual[scope];
  if (!m) return st;
  if (kind === "fav" || kind === "doom" || (Number(m[kind]) || 0) <= 1) delete m[kind];
  else m[kind] -= 1;
  return st;
}
/** The manual chips of one scope. */
export function manualChips(st, scope) {
  const m = st.manual?.[scope] ?? {}, out = [];
  for (const kind of Object.keys(MANUAL)) {
    const v = m[kind];
    if (!v) continue;
    const n = v === true ? 1 : Number(v) || 0;
    out.push({ id: `man:${scope}:${kind}`, scope, row: MANUAL[kind].row, kind, n, label: MANUAL[kind].label(n), start: "on", manual: true,
      tip: kind === "fav" ? "Added by hand: roll 3d12 and keep the best Tier" : kind === "doom" ? "Added by hand: roll 3d12 and keep the two lowest" : "Added by hand" });
  }
  return out;
}
/** Every chip of a scope ("shared" or a creature's uuid): the automatic ones, then the manual ones. */
export const chipsOf = (inp, st, scope) => [...(inp.chips ?? []).filter(c => (c.scope ?? "shared") === scope), ...manualChips(st, scope)];
/** Is the chip on? n/a never; otherwise the user's toggle, else how it started. */
export const chipOn = (c, st) => (c.start === "na" ? false : (st.toggled?.[c.id] ?? c.start === "on"));
/** A chip's toggle: n/a chips can't be toggled. */
export function toggleChip(st, c) { if (c && c.start !== "na") st.toggled[c.id] = !chipOn(c, st); return st; }

/** The sum of the chips that are on: { boons, banes, flat, fav, doom, emp, enf, names } (Ch. 1, Ch. 8: Boons and Banes don't cancel; Empowered and Enfeebled: the highest of each). */
export function tally(chips, st) {
  const t = { boons: 0, banes: 0, flat: 0, fav: false, doom: false, emp: 0, enf: 0, boonSrc: [], baneSrc: [], flatSrc: [], favBy: [], doomBy: [], empSrc: [], enfSrc: [] };
  for (const c of chips) {
    if (!chipOn(c, st)) continue;
    const n = Number(c.n) || 0, name = c.manual ? "Situational" : c.label;
    if (c.kind === "boon") { t.boons += n; t.boonSrc.push({ name, n, scope: c.scope ?? "shared" }); }
    else if (c.kind === "bane") { t.banes += n; t.baneSrc.push({ name, n, scope: c.scope ?? "shared" }); }
    else if (c.kind === "plus") { t.flat += n; t.flatSrc.push({ name, v: n }); }
    else if (c.kind === "minus") { t.flat -= n; t.flatSrc.push({ name: c.manual ? "Situational" : (c.srcName ?? c.label), v: -n }); }
    else if (c.kind === "emp") { t.emp = Math.max(t.emp, n); t.empSrc.push({ name: c.srcName ?? c.label, n }); }
    else if (c.kind === "enf") { t.enf = Math.max(t.enf, n); t.enfSrc.push({ name: c.srcName ?? c.label, n }); }
    else if (c.kind === "fav") { t.fav = true; t.favBy.push(name === "Favored" ? "Situational" : name); if (c.special === "reload") { t.emp = Math.max(t.emp, 2); t.empSrc.push({ name, n: 2 }); } }
    else if (c.kind === "doom") { t.doom = true; t.doomBy.push(name === "Doomed" ? "Situational" : name); }
  }
  return t;
}
/** Two tallies added (the shared panel and one creature's own). */
const plus = (a, b) => ({ boons: a.boons + b.boons, banes: a.banes + b.banes, flat: a.flat + b.flat, fav: a.fav || b.fav, doom: a.doom || b.doom, emp: Math.max(a.emp, b.emp), enf: Math.max(a.enf, b.enf),
  boonSrc: [...a.boonSrc, ...b.boonSrc], baneSrc: [...a.baneSrc, ...b.baneSrc], flatSrc: [...a.flatSrc, ...b.flatSrc], favBy: [...a.favBy, ...b.favBy], doomBy: [...a.doomBy, ...b.doomBy], empSrc: [...a.empSrc, ...b.empSrc], enfSrc: [...a.enfSrc, ...b.enfSrc] });

/** Favored and Doomed: either one is 3d12, both together a normal roll (Ch. 1). */
export const stateOf = (fav, doom) => (fav && doom ? "" : fav ? "favored" : doom ? "doomed" : "");
/** The creatures still in the roll. */
export const liveCreatures = (inp, st) => (inp.creatures ?? []).filter(c => !(st.removed ?? []).includes(c.uuid));
/** One creature's numbers: its Defense, its Boons and Banes (shared + its own), its Flat, Favored / Doomed, the dice it keeps. */
export function creatureCalc(inp, st, uuid) {
  const cr = (inp.creatures ?? []).find(c => c.uuid === uuid) ?? { uuid, dc: 13 };
  const sh = tally(chipsOf(inp, st, "shared"), st), own = tally(chipsOf(inp, st, uuid), st), t = plus(sh, own);
  const state = stateOf(t.fav, t.doom);
  return { ...t, uuid, name: cr.name, dc: Number(cr.dc) || 13, def: cr.def ?? "DC", state, cancel: t.fav && t.doom, mod: (Number(inp.roll?.mod) || 0) + t.flat, own };
}
/** Several targets: any creature Favored or Doomed (not both) makes it 3d12 (Ch. 1, Several Targets). */
export const anyThree = (inp, st) => liveCreatures(inp, st).some(c => creatureCalc(inp, st, c.uuid).state !== "");
/** A creature's dice label on its line (several targets). */
export function creatureDice(calc, three) {
  if (calc.cancel) return "2d12, they cancel";
  if (calc.state === "favored") return "3d12, best Tier";
  if (calc.state === "doomed") return "3d12, lowest 2";
  return three ? "first 2 d12" : "2d12";
}
/** The dice line's dice text. */
export function diceText(inp, st) {
  if (inp.multi) return anyThree(inp, st) ? { dice: "3d12", note: "3d12: a target is Favored or Doomed" } : { dice: "2d12", note: "" };
  const c = liveCreatures(inp, st)[0], calc = c ? creatureCalc(inp, st, c.uuid) : (() => { const t = tally(chipsOf(inp, st, "shared"), st); return { ...t, state: stateOf(t.fav, t.doom), cancel: t.fav && t.doom }; })();
  if (calc.cancel) return { dice: "2d12 (Favored and Doomed cancel)", note: "" };
  return { dice: calc.state === "favored" ? "3d12, best Tier" : calc.state === "doomed" ? "3d12, lowest 2" : "2d12", note: "" };
}
/** The dice line: "2d12 + 1 Signature, Flat ▲1 ▼1". One target: its own Boons and Banes count too; several: the shared ones. */
export function diceLine(inp, st) {
  const sh = tally(chipsOf(inp, st, "shared"), st), c = !inp.multi ? liveCreatures(inp, st)[0] : null;
  const t = c ? creatureCalc(inp, st, c.uuid) : sh;
  const flat = inp.multi ? sh.flat : t.flat, mod = (Number(inp.roll?.mod) || 0) + flat;
  const names = [inp.roll?.name, flat || (inp.multi ? sh : t).flatSrc.length ? "Flat" : ""].filter(Boolean);
  return { ...diceText(inp, st), mod, names, boons: t.boons, banes: t.banes };
}
/** Empowered and Enfeebled: the highest of each, then the net on every damage die (Ch. 8). line: "" when the net is 0. */
export function stepNet(inp, st) {
  const t = tally(chipsOf(inp, st, "shared"), st), net = t.emp - t.enf;
  return { emp: t.emp, enf: t.enf, net, line: net > 0 ? `Empowered ${net} on every damage die` : net < 0 ? `Enfeebled ${-net} on every damage die (at least 1 each)` : "" };
}

/* ------------------------------------------------------------------ folding */
/**
 * One row's chips as shown: the ones on, and every chip the user touched (switched off stays visible, struck through); the ones that start off fold
 * into "+N off", the n/a ones into "N n/a". { shown, off, na, offOpen, naOpen }.
 */
export function foldRow(chips, st, scope, row) {
  const list = chips.filter(c => c.row === row), offOpen = !!st.fold?.[`${scope}|${row}|off`], naOpen = !!st.fold?.[`${scope}|${row}|na`];
  const shown = [], off = [], na = [];
  for (const c of list) {
    if (c.start === "na") (naOpen ? shown : na).push(c);
    else if (chipOn(c, st) || c.id in (st.toggled ?? {}) || c.start === "on") shown.push(c);
    else (offOpen ? shown : off).push(c);
  }
  if (offOpen) off.push(...list.filter(c => c.start === "off" && !(c.id in (st.toggled ?? {}))));
  if (naOpen) na.push(...list.filter(c => c.start === "na"));
  return { shown, off, na, offOpen, naOpen };
}

/* ------------------------------------------------------------------ the ladder, the odds */
/** A creature's ladder: totals against its Defense (Tier 2 from the DC, Tier 3 from DC + 7, a Critical from DC + 20; Ch. 1). */
export function ladder(dc, crit = false) {
  const d = Number(dc) || 13;
  if (!crit) return [{ k: "t1", label: `Tier 1 · ≤${d - 1}` }, { k: "t2", label: `Tier 2 · ${d}–${d + 6}` }, { k: "t3", label: `Tier 3 · ${d + 7}+` }];
  return [{ k: "t1", label: `Tier 1 · ≤${d - 1}` }, { k: "t2", label: `Tier 2 · ${d}–${d + 6}` }, { k: "t3", label: `Tier 3 · ${d + 7}–${d + 19}` }, { k: "crit", label: `Crit · ${d + 20}+` }];
}
export const LADDER_TIP = "Doubles raise one Tier; Doubles on a Tier 3 are a Critical. A Doomed roll has no Doubles.";
/** A creature's odds (Designer mode): [T1, T2, T3, Crit] in percent; the Critical only for an Action with a Critical row. */
export function oddsOf(calc, crit = false) {
  const p = tierProbs(calc.mod, calc.dc, calc.boons, calc.banes, calc.state);
  const c = crit ? tierProbs(calc.mod, calc.dc, calc.boons, calc.banes, calc.state, true)[2] : 0;
  const pct = x => Math.round(x * 100);
  return crit ? [pct(p[0]), pct(p[1]), pct(p[2] - c), pct(c)] : [pct(p[0]), pct(p[1]), pct(p[2])];
}
export const oddsLine = o => (o.length === 4 ? `T1 ${o[0]}% · T2 ${o[1]}% · T3 ${o[2]}% · Crit ${o[3]}%` : `T1 ${o[0]}% · T2 ${o[1]}% · T3 ${o[2]}%`);

/* ------------------------------------------------------------------ Versions, blocked Roll */
export const versionOf = (inp, st) => (inp.versions ?? []).find(v => Number(v.ap) === Number(st.ap)) ?? inp.versions?.[0] ?? null;
/** Why Roll can't be pressed now ("" when it can). */
export function blockedReason(inp, st) {
  const v = versionOf(inp, st);
  if (v?.disabled) return v.why || "You can't afford this Version";
  if (inp.blocked?.length) return inp.blocked[0];
  if (inp.area && !inp.area.placed) return "Place the area first";
  if (!liveCreatures(inp, st).length && !inp.self) return "No target: target a creature";
  const bad = liveCreatures(inp, st).find(c => c.blocked);
  if (bad) return `${bad.name}: ${bad.blocked}`;
  return "";
}

/* ------------------------------------------------------------------ the Tier table */
/** The Passives' tags of one Tier ("+1d6 Ho" on T1 to T3; Heavy Blows "+2" on T3), the chips that are on only. */
export const tierTags = (inp, st, n) => chipsOf(inp, st, "shared").filter(c => c.row === "passives" && c.tag && (c.tiers ?? [1, 2, 3]).includes(n) && chipOn(c, st));
/** One Tier's pool lines: [{ pool, text ("1d8 + 2 Sl"), tags: ["+2"] }]; a pool with no damage is left out (no "0" lines). */
export function poolLines(tier, tags = []) {
  const out = [];
  for (const p of tier?.parts ?? []) {
    const t = String(p.t ?? "").trim();
    if (!t || t === "0") continue;
    const pool = p.pool === "M" ? "M" : "B";
    let line = out.find(x => x.pool === pool);
    if (!line) out.push(line = { pool, segs: [], tags: [] });
    const seg = line.segs.find(s => s.sub === (p.sub ?? ""));
    if (seg) seg.t.push(t); else line.segs.push({ sub: p.sub ?? "", t: [t] });
  }
  for (const g of tags) {
    const pool = g.pool === "M" ? "M" : "B";
    let line = out.find(x => x.pool === pool);
    if (!line) out.push(line = { pool, segs: [], tags: [] });
    line.tags.push(g.tag);
  }
  return out.map(l => ({ pool: l.pool, segs: l.segs.map(s => ({ sub: s.sub, t: s.t.join(" + ") })), tags: l.tags }));
}

/* ------------------------------------------------------------------ what the roll gets */
/**
 * The dialog's answer for useAction (actions.mjs): the same fields as the old dialog (ap, fx, bonusOn, boons, banes, mod, favored, doomed, empowered,
 * enfeebled, switchNl, reloadshot, forceTier, removed, dc) and the new ones: perTarget (each creature's own Boons, Banes, Favored, Doomed, Flat),
 * rollMode and rd (the named sources for the chat card; chips that are off or n/a are not sent).
 */
export function result(inp, st) {
  const v = versionOf(inp, st), live = liveCreatures(inp, st);
  const shared = chipsOf(inp, st, "shared"), sh = tally(shared, st);
  const onIds = list => list.filter(c => chipOn(c, st));
  const multi = !!inp.multi;
  // one target: its own chips are this roll's (as before, every modifier id is applied); several: each creature's go to perTarget
  const single = !multi ? live[0] : null, ownSingle = single ? chipsOf(inp, st, single.uuid) : [];
  const all = [...shared, ...ownSingle];
  const fx = [...new Set([...onIds(all), ...(multi ? live.flatMap(c => onIds(chipsOf(inp, st, c.uuid))) : [])].filter(c => c.fx).map(c => c.fx))];
  const t = single ? tally(all, st) : sh;
  const man = list => list.filter(c => c.manual && chipOn(c, st));
  const manB = man(all).filter(c => c.kind === "boon").reduce((a, c) => a + c.n, 0), manN = man(all).filter(c => c.kind === "bane").reduce((a, c) => a + c.n, 0);
  const perTarget = {};
  for (const c of multi ? live : []) {
    const own = chipsOf(inp, st, c.uuid), ot = tally(own, st);
    perTarget[c.uuid] = { favored: ot.fav, doomed: ot.doom, boons: man(own).filter(x => x.kind === "boon").reduce((a, x) => a + x.n, 0), banes: man(own).filter(x => x.kind === "bane").reduce((a, x) => a + x.n, 0), flat: ot.flat };
  }
  const flatNames = [...new Set(t.flatSrc.map(f => f.name))].join(", ");   // the card prints the value, then these names ("−1 Exhausted 1")
  const rd = {
    v: 1, rollMode: st.rollMode,
    shared: { passives: onIds(shared).filter(c => c.row === "passives").map(c => ({ name: c.label, adds: c.tag ?? "", tiers: c.tiers ?? [] })),
      boons: sh.boonSrc, banes: sh.baneSrc, flat: sh.flatSrc, empowered: sh.emp, enfeebled: sh.enf, net: sh.emp - sh.enf, favored: sh.favBy, doomed: sh.doomBy,
      lethal: onIds(shared).some(c => c.special === "nl") ? (inp.nonlethalAction ? "lethal" : "nonlethal") : (inp.nonlethalAction ? "nonlethal" : "lethal") },
    creatures: live.map(c => { const k = creatureCalc(inp, st, c.uuid), three = multi && anyThree(inp, st); return { uuid: c.uuid, name: c.name, def: c.def, dc: k.dc,
      boons: k.own.boonSrc, banes: k.own.baneSrc, flat: k.own.flatSrc, favored: k.own.favBy, doomed: k.own.doomBy, state: k.state, dice: multi ? creatureDice(k, three) : diceText(inp, st).dice }; })
  };
  const empChip = onIds(all).some(c => c.special === "reload");
  return {
    ap: String(v?.ap ?? st.ap ?? ""), fx, bonusOn: onIds(shared).filter(c => c.bonusKey).map(c => c.bonusKey),
    boons: manB, banes: manN, mod: t.flat, adjLabel: flatNames, adjDefault: t.flat,
    dc: single?.dc ?? 13, favored: (multi ? sh.fav : t.fav) ? "on" : undefined, doomed: (multi ? sh.doom : t.doom) ? "on" : undefined,
    reloadshot: empChip ? "on" : undefined,
    empowered: t.emp, enfeebled: t.enf, switchNl: onIds(all).some(c => c.special === "nl") ? "on" : undefined,
    forceTier: st.forceTier ? String(st.forceTier) : "", removed: [...(st.removed ?? [])], perTarget, rollMode: st.rollMode, rd
  };
}

/* ------------------------------------------------------------------ HTML */
const SUB_INK = { Fi: "#a0521a", Ho: "#7d5400", Co: "#2c6f8f" };
const poolIcon = p => (p === "M" ? '<i class="fa-solid fa-brain rd-pr" aria-hidden="true"></i><span class="rd-sr">Resolve</span>' : '<i class="fa-solid fa-heart rd-pv" aria-hidden="true"></i><span class="rd-sr">Vigor</span>');
const sgn = n => (n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`);
const pip = c => {
  if (c.kind === "boon" || c.kind === "fav" || c.special === "reload") return '<span class="rd-pip up" aria-hidden="true"></span>';
  if (c.kind === "bane" || c.kind === "doom") return '<span class="rd-pip down" aria-hidden="true"></span>';
  return `<span class="rd-pip sq ${isBuff(c) ? "plus" : "minus"}" aria-hidden="true">${isBuff(c) ? "+" : "−"}</span>`;
};
/** One chip: [pip] Label | × | i. */
export function chipHtml(c, st) {
  const on = chipOn(c, st), na = c.start === "na";
  const cls = `rd-chip ${isBuff(c) ? "buff" : "debuff"}${na ? " na" : on ? " on" : " off"}`;
  const tip = na ? `Not this time: ${c.why || "it doesn't apply"}` : (c.tip ?? "");
  const body = `<button type="button" class="rd-cbody" data-act="chip" data-id="${esc(c.id)}"${na ? ' disabled aria-disabled="true"' : ` aria-pressed="${on}"`}${tip ? ` data-tooltip="${esc(tip)}" title="${esc(tip)}"` : ""}>${pip(c)}<span class="rd-clabel">${esc(c.label)}</span></button>`;
  const x = c.manual ? `<button type="button" class="rd-cx" data-act="rm" data-id="${esc(c.id)}" aria-label="Remove ${esc(c.label)}" title="Remove one step">×</button>` : "";
  const i = c.rule?.uuid ? `<button type="button" class="rd-ci" data-act="rule" data-uuid="${esc(c.rule.uuid)}" aria-label="Open the rule: ${esc(c.rule.label ?? c.label)}" title="Open the rule: ${esc(c.rule.label ?? c.label)}">i</button>` : "";
  return `<span class="${cls}">${body}${x}${i}</span>`;
}
/** A panel's rows (the shared panel, or one creature's). */
export function rowsHtml(chips, st, scope, rows = ROWS) {
  return rows.map(([key, label]) => {
    const f = foldRow(chips, st, scope, key);
    if (!f.shown.length && !f.off.length && !f.na.length) return "";
    const offBtn = f.off.length || f.offOpen ? `<button type="button" class="rd-fold off" data-act="fold" data-key="${esc(`${scope}|${key}|off`)}" aria-expanded="${f.offOpen}">${f.offOpen ? "hide off" : `+${f.off.length} off`}</button>` : "";
    const naBtn = f.na.length || f.naOpen ? `<button type="button" class="rd-fold na" data-act="fold" data-key="${esc(`${scope}|${key}|na`)}" aria-expanded="${f.naOpen}">${f.naOpen ? "hide n/a" : `${f.na.length} n/a`}</button>` : "";
    return `<div class="rd-row"><span class="rd-rlabel">${esc(label)}</span><span class="rd-chips">${f.shown.map(c => chipHtml(c, st)).join("")}${offBtn}${naBtn}</span></div>`;
  }).join("");
}
const ladderHtml = (dc, crit) => `<div class="rd-ladder${crit ? " crit" : ""}" data-tooltip="${esc(LADDER_TIP)}" title="${esc(LADDER_TIP)}">${ladder(dc, crit).map(s => `<span class="rd-lseg ${s.k}">${esc(s.label)}</span>`).join("")}</div>`;
const defBadge = (c, hide) => `<span class="rd-def" ${hide ? 'title="Hidden by the GM"' : ""}>${esc(c.def ?? "DC")}${hide ? "" : ` ${Number(c.dc) || 13}`}</span>`;
const counts = (b, n) => `<span class="rd-cnt"><span class="up" aria-label="${b} Boons">▲${b}</span> <span class="down" aria-label="${n} Banes">▼${n}</span></span>`;

function tierTableHtml(inp, st, v) {
  if (!v || v.noTiers) return "";
  const cell = n => {
    const lines = poolLines(v.tiers?.[n], tierTags(inp, st, n).map(c => ({ pool: c.pool, tag: c.tag })));
    const dmg = lines.map(l => `<span class="rd-pool">${poolIcon(l.pool)} ${l.segs.map(s => `${esc(s.t)}${s.sub ? ` <b class="rd-sub" style="color:${SUB_INK[s.sub] ?? "#4a443b"}">${esc(s.sub)}</b>` : ""}`).join(" + ")}${l.tags.map(g => ` <span class="rd-ptag">${esc(g)}</span>`).join("")}</span>`).join('<span class="rd-dot" aria-hidden="true"> · </span>');
    const riders = (v.tiers?.[n]?.riders ?? []).map(r => `<div class="rd-rider">↳ ${r}</div>`).join("");
    return dmg || riders ? `${dmg ? `<div>${dmg}</div>` : ""}${riders}` : "&mdash;";
  };
  const rows = [1, 2, 3].map(n => `<tr class="t${n}"><th scope="row">T${n}</th><td>${cell(n)}</td></tr>`);
  if (v.crit) rows.push(`<tr class="crit"><th scope="row">Crit</th><td>${v.crit}</td></tr>`);
  if (v.effects) rows.push(`<tr class="rd-eff"><th scope="row">Effects<small>(T${v.effectsFrom ?? 2}+)</small></th><td>${v.effects}</td></tr>`);
  const net = stepNet(inp, st);
  return `<table class="rd-tiers">${rows.join("")}</table>${net.line ? `<div class="rd-step">${esc(net.line)}</div>` : ""}`;
}

function metaHtml(inp, v) {
  const m = v?.meta ?? {}, sep = '<span class="rd-star" aria-hidden="true"> ✦ </span>';
  const line = [m.targets ? `<b>Targets:</b> ${esc(m.targets)}` : "", inp.area ? `<button type="button" class="rd-area" data-act="place" title="${inp.area.placed ? "Place the area again" : "Place the area"}"><span aria-hidden="true">◇</span> ${esc(inp.area.label)}</button>` : "",
    m.dist ? (/^(weapon|reach|self)$/i.test(m.dist) ? esc(m.dist) : `Distance: ${esc(m.dist)}`) : "", m.vs ? `${/save$/i.test(m.vs) ? "" : "Vs. "}${esc(m.vs)}` : ""].filter(Boolean);
  const out = [];
  if (m.trigger) out.push(`<div class="rd-meta"><b>${m.triggerKind === "interrupt" ? "Interrupt" : "Trigger"}:</b> ${esc(m.trigger)}</div>`);
  if (Number(m.escalation) > 0) out.push(`<div class="rd-meta">${Number(m.escalation)} Escalation</div>`);
  if (line.length) out.push(`<div class="rd-meta">${line.join(sep)}</div>`);
  if (m.requirements) out.push(`<div class="rd-meta"><b>Requirements:</b> ${esc(m.requirements)}</div>`);
  if (m.setup) out.push(`<div class="rd-meta"><b>Setup:</b> ${m.setup}</div>`);
  return out.join("");
}

function traitsHtml(inp, v) {
  const groups = [];
  for (const t of v?.traits ?? []) { let g = groups.find(x => x.key === t.group); if (!g) groups.push(g = { key: t.group, label: t.groupLabel ?? t.group, list: [] }); g.list.push(t); }
  const blocks = groups.map(g => `<span class="rd-tgroup"><span class="rd-tchips">${g.list.map(t => `<span class="rd-trait tg-${esc(g.key)}"${t.tip ? ` data-tooltip="${esc(t.tip)}"` : ""}>${esc(t.label)}</span>`).join("")}</span><span class="rd-glabel">${esc(g.label)}</span></span>`);
  const freq = `<span class="rd-freq" style="background:${esc(inp.freqColor ?? "#5F5E5A")}">${esc([inp.freqLabel, v?.cost].filter(Boolean).join(" · "))}</span>`;
  return `<div class="rd-traits"><span class="rd-tlist">${blocks.join('<span class="rd-tsep" aria-hidden="true"></span>')}</span>${freq}</div>`;
}

function creaturesHtml(inp, st, v) {
  const live = liveCreatures(inp, st), crit = !!v?.crit, hide = !!inp.hideDef;
  if (!live.length) return `<div class="rd-none">${inp.area && !inp.area.placed ? "Place the area to choose the creatures." : "No target. Target a creature on the map."}</div>`;
  if (!inp.multi) {
    const c = live[0], own = chipsOf(inp, st, c.uuid);
    return `<div class="rd-cbox"><div class="rd-cname"><b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}${defBadge(c, hide)}</div>${rowsHtml(own, st, c.uuid, ROWS.filter(r => r[0] !== "passives" && r[0] !== "damage"))}${hide ? "" : ladderHtml(c.dc, crit)}</div>`;
  }
  const three = anyThree(inp, st);
  return live.map(c => {
    const k = creatureCalc(inp, st, c.uuid), open = !!st.open?.[c.uuid], own = chipsOf(inp, st, c.uuid);
    const head = `<div class="rd-cline"><button type="button" class="rd-copen" data-act="open" data-uuid="${esc(c.uuid)}" aria-expanded="${open}"><span class="rd-chev" aria-hidden="true">${open ? "▾" : "▸"}</span><b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}<span class="rd-cdice">${esc(creatureDice(k, three))}</span><span class="rd-cmod">${k.mod >= 0 ? "+" : "−"}${Math.abs(k.mod)}</span>${counts(k.boons, k.banes)}</button>${defBadge(c, hide)}<button type="button" class="rd-cx rm" data-act="untarget" data-uuid="${esc(c.uuid)}" aria-label="Remove ${esc(c.name)}" title="Remove ${esc(c.name)} from the targets (or right-click its line)">×</button></div>`;
    if (!open) return `<div class="rd-cbox multi" data-uuid="${esc(c.uuid)}">${head}</div>`;
    const add = `<div class="rd-row"><span class="rd-rlabel">Add here:</span><span class="rd-chips">${["boon", "bane", "fav", "doom"].map(kd => `<button type="button" class="rd-addhere" data-act="quick" data-scope="${esc(c.uuid)}" data-k="${kd}">${pip({ kind: kd })}${QUICK_LABEL[kd]}</button>`).join("")}</span></div>`;
    return `<div class="rd-cbox multi open" data-uuid="${esc(c.uuid)}">${head}${rowsHtml(own, st, c.uuid, ROWS.filter(r => r[0] !== "passives" && r[0] !== "damage"))}${add}${hide ? "" : ladderHtml(c.dc, crit)}</div>`;
  }).join("");
}

/** The whole dialog's inner HTML: header (fixed), body (scrolls), Designer footer, bottom bar (fixed). */
export function dialogHtml(inp, st) {
  const v = versionOf(inp, st), dl = diceLine(inp, st), why = blockedReason(inp, st);
  const vers = (inp.versions ?? []).length > 1 ? `<div class="rd-vers" role="group" aria-label="Version">${inp.versions.map(x => `<button type="button" data-act="ver" data-ap="${x.ap}" aria-pressed="${Number(x.ap) === Number(v?.ap)}"${x.disabled ? ` disabled title="${esc(x.why ?? "")}" data-tooltip="${esc(x.why ?? "")}" class="cant"` : ""}>${esc(x.cost)}</button>`).join("")}</div>` : "";
  const quick = `<div class="rd-quick">${quickKinds(inp.multi).map(k => `<button type="button" class="rd-qb" data-act="quick" data-scope="shared" data-k="${k}">${pip({ kind: k })}${QUICK_LABEL[k]}</button>`).join("")}</div>`;
  const notices = (inp.notices ?? []).length ? `<div class="rd-notes">${inp.notices.map(n => `<span class="rd-note"${n.why ? ` data-tooltip="${esc(n.why)}" title="${esc(n.why)}"` : ""}>${esc(n.text)}</span>`).join("")}</div>` : "";
  const panel = `<section class="rd-roll"><div class="rd-dice"><b class="rd-dtxt">${esc(dl.dice)}</b> <b>${sgn(dl.mod)}</b> <i class="rd-dnames">${esc(dl.names.join(", "))}</i> ${counts(dl.boons, dl.banes)}${dl.note ? ` <span class="rd-dnote">· ${esc(dl.note)}</span>` : ""}</div>
    <div class="rd-mhead"><span>${inp.multi ? "Modifiers · every target" : "Modifiers"}</span></div>${quick}${notices}${rowsHtml(chipsOf(inp, st, "shared"), st, "shared")}
    <div class="rd-creatures">${creaturesHtml(inp, st, v)}</div></section>`;
  const flavor = inp.flavor ? `<div class="rd-div" aria-hidden="true"><span></span><i>◆ ◆ ◆</i><span></span></div><p class="rd-flavor">${esc(inp.flavor)}</p>` : "";
  const designer = inp.designer && v && !v.noTiers ? `<div class="rd-designer"><div>${liveCreatures(inp, st).map(c => `<div><b>${esc(c.name)}</b>: ${oddsLine(oddsOf(creatureCalc(inp, st, c.uuid), !!v.crit))}</div>`).join("")}</div><div class="rd-force" role="group" aria-label="Force a Tier">Force a Tier: ${[1, 2, 3].map(n => `<button type="button" data-act="force" data-t="${n}" aria-pressed="${Number(st.forceTier) === n}">T${n}</button>`).join("")}</div></div>` : "";
  const modes = (inp.rollModes ?? []).length ? `<select class="rd-mode" data-field="rollMode" aria-label="Roll mode">${inp.rollModes.map(([k, l]) => `<option value="${esc(k)}"${k === st.rollMode ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>` : "";
  const bar = `<footer class="rd-bar">${modes}<button type="button" class="rd-btn2" data-act="card">Card</button><button type="button" class="rd-go" data-act="roll"${why ? ` disabled title="${esc(why)}"` : ""}>Roll</button></footer>${why ? `<div class="rd-why" role="status">${esc(why)}</div>` : ""}${inp.hideDef ? '<div class="rd-pview">Player view · enemy Defenses hidden by the GM</div>' : ""}`;
  return `<header class="rd-head"><div class="rd-nameline"><h1 class="rd-name">${esc(inp.name)}</h1>${vers}</div>${traitsHtml(inp, v)}</header>
    <div class="rd-body">${metaHtml(inp, v)}${tierTableHtml(inp, st, v)}${panel}${flavor}</div>${designer}${bar}`;
}
