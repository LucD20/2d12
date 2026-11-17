// v0.0.292 (PACK ROLL-DIALOG, Lucas's design 2026-11-07, boards C2; brief: foundry/mockups/roll-dialog-brief.md): the roll dialog of an Action that
// rolls against a Defense. Pure: the model (what the dialog shows and what the roll gets) and its HTML; no Foundry here, so the tests load it.
// The window (rollwindow.mjs) keeps a state and redraws from inp + state on every click; actions.mjs builds inp and reads result().
//
// inp: {
//   name, flavor, reaction, freq ("round"), freqColor, versions: [{ ap, cost ("2 AP"), disabled, why, traits: [{ key, label, group, tip }],
//     meta: { escalation, targets, dist, vs, requirements, setup, trigger, triggerKind }, tiers: { 1: { parts: [{ pool, t, sub }], riders: [html] }, 2, 3 },
//     crit (html), effects (html), effectsFrom (2), noTiers }],
//   ap (the Version open first), roll: { mod, name ("Signature") }, multi, area: { label, placed } | null,
//   chips: [{ id, scope ("shared" | a creature's uuid), row, kind, label, n, bb ("field" | "pressure" | "support" | ""; v0.0.301), start ("on" | "off" | "na"), tip, why, rule: { uuid, label }, fx, bonusKey,
//     special ("nl" | "reload"), tiers: [1, 2, 3], tag ("+1d6 Ho"), pool ("B" | "M") }],
//   creatures: [{ uuid, name, size, def ("AD"), dc }], hideDef (the player view), designer, blocked: [reasons], rollMode, rollModes: [[key, label]], notices: [{ text, why }]
// }
// state: { ap, toggled: { id: bool }, manual: { scope: { boon, bane, plus, minus, emp, enf, fav, doom } }, fold: { "scope|row|off": bool }, open: { uuid: bool },
//   removed: [uuid], rollMode, forceTier }
import { EMPOWERED_DIE } from "./roundrules.mjs";   // v0.0.407
import { esc, vsColored } from "./util.mjs";
import { tierProbs, bbCount, bbFive, rollState, BB_NAMES, BB_LIMIT } from "./calc.mjs";

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
  emp: { row: "damage", label: () => "Empowered" },   // v0.0.407: no value
  enf: { row: "damage", label: n => `Enfeebled ${n}` },   // (gone since v0.0.407: no button makes one)
  fav: { row: "boons", label: () => "Favored" },
  doom: { row: "banes", label: () => "Doomed" }
};
/** The quick buttons: one target has them all; several targets have no Favored / Doomed in the shared panel (they are added per creature). */
// v0.0.407 (book, Chapter 8): no Enfeebled button (it is gone); Empowered is on / off
export const quickKinds = multi => (multi ? ["boon", "bane", "plus", "minus", "emp"] : ["boon", "bane", "fav", "doom", "plus", "minus", "emp"]);
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
export function stepManual(st, scope, kind) {
  const m = st.manual[scope];
  if (!m) return st;
  if (kind === "fav" || kind === "doom" || (Number(m[kind]) || 0) <= 1) delete m[kind];
  else m[kind] -= 1;
  return st;
}
/** v0.0.293 (Lucas): the × removes the chip whatever its number (a right-click is one step less: stepManual). */
export function removeManual(st, scope, kind) { const m = st.manual[scope]; if (m) delete m[kind]; return st; }
/** The manual chips of one scope. */
export function manualChips(st, scope) {
  const m = st.manual?.[scope] ?? {}, out = [];
  for (const kind of Object.keys(MANUAL)) {
    const v = m[kind];
    if (!v) continue;
    const n = v === true ? 1 : Number(v) || 0;
    out.push({ id: `man:${scope}:${kind}`, scope, row: MANUAL[kind].row, kind, n, label: MANUAL[kind].label(n), start: "on", manual: true,
      tip: kind === "fav" ? "Added by hand: roll 3d12 and keep the two highest (any pair is Doubles)" : kind === "doom" ? "Added by hand: roll 3d12 and keep the two lowest" : kind === "boon" || kind === "bane" ? "Added by hand: no name, so it always adds up" : "Added by hand" });
  }
  return out;
}
/** Every chip of a scope ("shared" or a creature's uuid): the automatic ones, then the manual ones. */
export const chipsOf = (inp, st, scope) => [...(inp.chips ?? []).filter(c => (c.scope ?? "shared") === scope), ...manualChips(st, scope)];
/** Is the chip on? n/a never; otherwise the user's toggle, else how it started. */
export const chipOn = (c, st) => (c.start === "na" ? false : (st.toggled?.[c.id] ?? c.start === "on"));
/** A chip's toggle: n/a chips can't be toggled. */
export function toggleChip(st, c) { if (c && c.start !== "na") st.toggled[c.id] = !chipOn(c, st); return st; }

/**
 * v0.0.301 (PACK BB; Ch. 1): the Boons and Banes of a tally after the limits of their names (2 of each name and side): boons, banes, and
 * capped: [{ name ("Field"), side ("Boons"), raw, kept }] for the names past their limit.
 */
function bbFinish(t) {
  const n = bbCount([...t.boonSrc.map(x => ({ boons: x.n, bb: x.bb })), ...t.baneSrc.map(x => ({ banes: x.n, bb: x.bb }))]);
  t.boons = n.boons; t.banes = n.banes; t.rawBoons = n.rawBoons; t.rawBanes = n.rawBanes;
  t.capped = [];
  for (const [k, g] of Object.entries(n.groups)) {
    if (g.boons > BB_LIMIT) t.capped.push({ name: BB_NAMES[k], side: "Boons", raw: g.boons, kept: g.keptBoons });
    if (g.banes > BB_LIMIT) t.capped.push({ name: BB_NAMES[k], side: "Banes", raw: g.banes, kept: g.keptBanes });
  }
  return t;
}
/** The sum of the chips that are on: { boons, banes, flat, fav, doom, emp, enf, names } (Ch. 1: Boons and Banes cancel, named ones up to 2; Ch. 8: Empowered and Enfeebled, the highest of each). */
export function tally(chips, st) {
  const t = { boons: 0, banes: 0, flat: 0, fav: false, doom: false, emp: 0, enf: 0, boonSrc: [], baneSrc: [], flatSrc: [], favBy: [], doomBy: [], empSrc: [], enfSrc: [] };
  for (const c of chips) {
    if (!chipOn(c, st)) continue;
    const n = Number(c.n) || 0, name = c.manual ? "Situational" : c.label;
    if (c.kind === "boon") t.boonSrc.push({ name, n, scope: c.scope ?? "shared", bb: c.bb ?? "" });
    else if (c.kind === "bane") t.baneSrc.push({ name, n, scope: c.scope ?? "shared", bb: c.bb ?? "" });
    else if (c.kind === "plus") { t.flat += n; t.flatSrc.push({ name, v: n }); }
    else if (c.kind === "minus") { t.flat -= n; t.flatSrc.push({ name: c.manual ? "Situational" : (c.srcName ?? c.label), v: -n }); }
    else if (c.kind === "emp") { if (c.inc) t.empInc = (t.empInc ?? 0) + n; else t.emp = Math.max(t.emp, n); t.empSrc.push({ name: c.srcName ?? c.label, n }); }   // v0.0.323: "Increase by" adds
    else if (c.kind === "enf") { if (c.inc) t.enfInc = (t.enfInc ?? 0) + n; else t.enf = Math.max(t.enf, n); t.enfSrc.push({ name: c.srcName ?? c.label, n }); }
    else if (c.kind === "fav") { t.fav = true; t.favBy.push(name === "Favored" ? "Situational" : name); if (c.special === "reload") { t.emp = Math.max(t.emp, 1); t.empSrc.push({ name, n: 1 }); } }
    else if (c.kind === "doom") { t.doom = true; t.doomBy.push(name === "Doomed" ? "Situational" : name); }
  }
  t.emp += t.empInc ?? 0; t.enf += t.enfInc ?? 0;
  return bbFinish(t);
}
/** Two tallies added (the shared panel and one creature's own). */
const plus = (a, b) => bbFinish({ boons: 0, banes: 0, flat: a.flat + b.flat, fav: a.fav || b.fav, doom: a.doom || b.doom, emp: Math.max(a.emp, b.emp), enf: Math.max(a.enf, b.enf),
  boonSrc: [...a.boonSrc, ...b.boonSrc], baneSrc: [...a.baneSrc, ...b.baneSrc], flatSrc: [...a.flatSrc, ...b.flatSrc], favBy: [...a.favBy, ...b.favBy], doomBy: [...a.doomBy, ...b.doomBy], empSrc: [...a.empSrc, ...b.empSrc], enfSrc: [...a.enfSrc, ...b.enfSrc] });

/** Favored and Doomed: either one is 3d12, both together a normal roll (Ch. 1). */
export const stateOf = (fav, doom) => (fav && doom ? "" : fav ? "favored" : doom ? "doomed" : "");
/** The creatures still in the roll. */
export const liveCreatures = (inp, st) => (inp.creatures ?? []).filter(c => !(st.removed ?? []).includes(c.uuid))
  .map(c => (c.uuid === "none" && Number(st.noTargetDc) > 0 ? { ...c, dc: Math.trunc(Number(st.noTargetDc)) } : c));   // v0.0.340: the DC typed for "No target"
/** v0.0.301 (PACK BB): a tally's state and what its Boons and Banes add: 5 or more left make it Favored / Doomed instead (Ch. 1). */
export function bbState(t) {
  const f = bbFive(t.boons, t.banes), fav = t.fav || f.five === "favored", doom = t.doom || f.five === "doomed";
  return { state: rollState(t.fav, t.doom, f.five), five: f.five, add: f.add, cancel: fav && doom };
}
/** One creature's numbers: its Defense, its Boons and Banes (shared + its own, named ones up to 2), its Flat, Favored / Doomed (and the five), the dice it keeps. */
export function creatureCalc(inp, st, uuid) {
  const cr = (inp.creatures ?? []).find(c => c.uuid === uuid) ?? { uuid, dc: 13 };
  const sh = tally(chipsOf(inp, st, "shared"), st), own = tally(chipsOf(inp, st, uuid), st), t = plus(sh, own);
  const b = bbState(t);
  return { ...t, uuid, name: cr.name, dc: Number(cr.dc) || 13, def: cr.def ?? "DC", state: b.state, five: b.five, bbAdd: b.add, cancel: b.cancel, mod: (Number(inp.roll?.mod) || 0) + t.flat, own };
}
/** Several targets: any creature Favored or Doomed (not both) makes it 3d12 (Ch. 1, Several Targets). */
export const anyThree = (inp, st) => liveCreatures(inp, st).some(c => creatureCalc(inp, st, c.uuid).state !== "");
/** A creature's dice label on its line (several targets). */
export function creatureDice(calc, three) {
  if (calc.cancel) return "2d12, they cancel";
  if (calc.state === "favored") return "3d12, two highest";
  if (calc.state === "doomed") return "3d12, lowest 2";
  return three ? "first 2 d12" : "2d12";
}
/** The dice line's dice text. */
export function diceText(inp, st) {
  if (inp.multi) return anyThree(inp, st) ? { dice: "3d12", note: "3d12: a target is Favored or Doomed" } : { dice: "2d12", note: "" };
  const c = liveCreatures(inp, st)[0], calc = c ? creatureCalc(inp, st, c.uuid) : (() => { const t = tally(chipsOf(inp, st, "shared"), st); return { ...t, ...bbState(t) }; })();
  if (calc.cancel) return { dice: "2d12 (Favored and Doomed cancel)", note: "" };
  return { dice: calc.state === "favored" ? "3d12, two highest" : calc.state === "doomed" ? "3d12, lowest 2" : "2d12", note: "" };
}
/**
 * The dice line: "2d12 + 1 Signature, Flat ▲1 ▼1". One target: its own Boons and Banes count too; several: the shared ones.
 * v0.0.301 (PACK BB): ▲ / ▼ are the counts after the limits of their names; bbNotes: "Field Banes 3, limit 2", "5 Boons left: Favored instead".
 */
export function diceLine(inp, st) {
  const sh = tally(chipsOf(inp, st, "shared"), st), c = !inp.multi ? liveCreatures(inp, st)[0] : null;
  const t = c ? creatureCalc(inp, st, c.uuid) : { ...sh, ...bbState(sh) };
  const flat = inp.multi ? sh.flat : t.flat, mod = (Number(inp.roll?.mod) || 0) + flat;
  const names = [inp.roll?.name, flat || (inp.multi ? sh : t).flatSrc.length ? "Flat" : ""].filter(Boolean);
  return { ...diceText(inp, st), mod, names, boons: t.boons, banes: t.banes, bbNotes: bbNotes(t) };
}
/** The notes for the names past their limit and the five: ["Field Banes 3, limit 2", "5 Boons left: Favored instead"]. */
export const bbNotes = t => [...(t.capped ?? []).map(x => `${x.name} ${x.side} ${x.raw}, limit ${x.kept}`), ...(t.five ? [`${Math.abs((t.boons ?? 0) - (t.banes ?? 0))} ${t.five === "favored" ? "Boons" : "Banes"} left: ${t.five === "favored" ? "Favored" : "Doomed"} instead`] : [])];
/** Empowered (Ch. 8; v0.0.407: on / off, Enfeebled gone): net 1 when it is on. line: "" when it is off. */
export function stepNet(inp, st) {
  const t = tally(chipsOf(inp, st, "shared"), st);
  // v0.0.407 (book, Chapter 8): Empowered adds 1d6! to the first damage on each of your turns; Enfeebled is gone
  return { emp: t.emp, enf: 0, net: t.emp > 0 ? 1 : 0, line: t.emp > 0 ? "Empowered: +1d6! (the first damage on each of your turns)" : "" };
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
export const LADDER_TIP = "Doubles raise one Tier; Doubles on a Tier 3 are a Critical. A Favored roll: any pair of the three dice is Doubles, three of a kind a Critical. A Doomed roll has no Doubles.";
/** A creature's odds (Designer mode): [T1, T2, T3, Crit] in percent; the Critical only for an Action with a Critical row. */
export function oddsOf(calc, crit = false) {
  // v0.0.301: the state already holds the five b/b; the Boons and Banes left are a flat number
  const add = calc.bbAdd ?? ((calc.boons ?? 0) - (calc.banes ?? 0)), m = calc.mod + add;
  const p = tierProbs(m, calc.dc, 0, 0, calc.state);
  const c = crit ? tierProbs(m, calc.dc, 0, 0, calc.state, true)[2] : 0;
  const pct = x => Math.round(x * 100);
  return crit ? [pct(p[0]), pct(p[1]), pct(p[2] - c), pct(c)] : [pct(p[0]), pct(p[1]), pct(p[2])];
}
export const oddsLine = o => (o.length === 4 ? `T1 ${o[0]}% · T2 ${o[1]}% · T3 ${o[2]}% · Crit ${o[3]}%` : `T1 ${o[0]}% · T2 ${o[1]}% · T3 ${o[2]}%`);

/* ------------------------------------------------------------------ Versions, blocked Roll */
export const versionOf = (inp, st) => (inp.versions ?? []).find(v => Number(v.ap) === Number(st.ap)) ?? inp.versions?.[0] ?? null;
/** Why Roll can't be pressed now ("" when it can). */
export function blockedReason(inp, st) {
  const v = versionOf(inp, st);
  // v0.0.399 (Lucas: "with creatures targeted, Word of Radiance asks to place a burst and doesn't allow me to roll"): Roll places the area now
  // (v0.0.397), so nothing blocks it; a caller that can't place it (noPlace unknown) keeps the old rule
  if (inp.area && !inp.area.placed && inp.area.noPlace !== false && !liveCreatures(inp, st).some(c => c.uuid === "none")) return "Place the area first";   // v0.0.340: or roll against a DC
  if (v && !v.noTiers && !liveCreatures(inp, st).length && !inp.self) return "No target: target a creature";
  return "";
}
/**
 * v0.0.293 (Lucas: "allow use of actions even if they aren't normally allowed ... with just a warning"): what isn't allowed but doesn't stop
 * the Roll: a Version that costs more AP than you have, a spent Frequency, a target out of range. Shown above the bottom bar.
 */
export function warnings(inp, st) {
  const v = versionOf(inp, st), out = [];
  if (v?.disabled) out.push(v.why || "Not enough AP for this Version");
  out.push(...(inp.blocked ?? []));
  for (const c of liveCreatures(inp, st)) if (c.blocked) out.push(`${c.name}: ${c.blocked}`);
  return out;
}

/* ------------------------------------------------------------------ damage averages */
/** The average of one die with Empowered (+s) or Enfeebled (−s, each die at least 1; Ch. 8). */
export const dieAvg = (faces, s = 0) => { const m = Number(faces) || 0; if (!m) return 0; if (s >= 0) return (m + 1) / 2 + s; let t = 0; for (let k = 1; k <= m; k++) t += Math.max(1, k + s); return t / m; };
/** The average of "2d6 + 2" with a step on every die. */
export function exprAvg(expr, s = 0) {
  let total = 0;
  for (const term of String(expr ?? "").replace(/\s+/g, "").replace(/−/g, "-").match(/[+-]?[^+-]+/g) ?? []) {
    // v0.0.407: a die written with ! explodes (the book's way: every die gains 0.5 on average)
    const sign = term.startsWith("-") ? -1 : 1, body = term.replace(/^[+-]/, ""), d = /^(\d*)d(\d+)(!?)$/i.exec(body);
    if (d) total += sign * (Number(d[1] || 1) * (dieAvg(d[2], s) + (d[3] ? 0.5 : 0)));
    else if (/^\d+(\.\d+)?$/.test(body)) total += sign * Number(body);
  }
  return total;
}
/** One Tier's average damage: its parts, the Passives' tags that are on ("+1d6 Ho", "+2"), and Empowered (v0.0.407: its 1d6!, once, on a Tier that deals damage). */
export function tierAvg(tier, tags = [], net = 0) {
  let a = 0;
  for (const p of tier?.parts ?? []) a += exprAvg(p.t);
  for (const g of tags) a += exprAvg(String(g.tag ?? g).replace(/^\+/, "").split(" ")[0]);
  if (net > 0 && a > 0) a += exprAvg(`1d${EMPOWERED_DIE}!`);
  return Math.round(a * 10) / 10;
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
    smiteMore: onIds(all).some(c => c.special === "smite") ? "on" : undefined,   // v0.0.409 (Smite): the Reaction AP spent for 1 more die
    empowered: t.emp, enfeebled: t.enf, switchNl: onIds(all).some(c => c.special === "nl") ? "on" : undefined,
    forceTier: st.forceTier ? String(st.forceTier) : "", removed: [...(st.removed ?? [])], perTarget, rollMode: st.rollMode, rd
  };
}

/* ------------------------------------------------------------------ HTML */
const SUB_INK = { Fi: "#a0521a", Ho: "#7d5400", Co: "#2c6f8f" };
const poolIcon = p => (p === "M" ? '<i class="fa-solid fa-brain rd-pr" aria-hidden="true"></i><span class="rd-sr">Resolve</span>' : '<i class="fa-solid fa-heart rd-pv" aria-hidden="true"></i><span class="rd-sr">Vigor</span>');
const sgn = n => (n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`);
/** v0.0.293 (Lucas): Favored and Doomed are a d12 (a pentagon face) in blue / red with its letter, not the Boon / Bane triangles. */
const d12 = (cls, letter) => `<svg class="rd-pip d12 ${cls}" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1 19,7.6 15.6,18.5 4.4,18.5 1,7.6"/><text x="10" y="14.2" text-anchor="middle">${letter}</text></svg>`;
const pip = c => {
  if (c.kind === "fav" || c.special === "reload") return d12("fav", "F");
  if (c.kind === "doom") return d12("doom", "D");
  if (c.kind === "boon") return '<span class="rd-pip up" aria-hidden="true"></span>';
  if (c.kind === "bane") return '<span class="rd-pip down" aria-hidden="true"></span>';
  return `<span class="rd-pip sq ${isBuff(c) ? "plus" : "minus"}" aria-hidden="true">${isBuff(c) ? "+" : "−"}</span>`;
};
/** One chip: [pip] Label | × | i. */
export function chipHtml(c, st) {
  const on = chipOn(c, st), na = c.start === "na";
  const cls = `rd-chip ${isBuff(c) ? "buff" : "debuff"}${na ? " na" : on ? " on" : " off"}`;
  const tip = na ? `Not this time: ${c.why || "it doesn't apply"}` : [c.tip ?? "", c.manual ? "Right-click: one less" : ""].filter(Boolean).join(". ");
  const body = `<button type="button" class="rd-cbody" data-act="chip" data-id="${esc(c.id)}"${na ? ' aria-disabled="true"' : ` aria-pressed="${on}"`}${tip ? ` data-tooltip="${esc(tip)}"` : ""}>${pip(c)}<span class="rd-clabel">${esc(c.label)}</span>${c.bb && BB_NAMES[c.bb] ? `<small class="rd-bbn">${esc(BB_NAMES[c.bb])}</small>` : ""}</button>`;
  const x = c.manual ? `<button type="button" class="rd-cx" data-act="rm" data-id="${esc(c.id)}" aria-label="Remove ${esc(c.label)}" data-tooltip="Remove">×</button>` : "";
  const i = c.rule?.uuid ? `<button type="button" class="rd-ci" data-act="rule" data-uuid="${esc(c.rule.uuid)}" aria-label="Open the rule: ${esc(c.rule.label ?? c.label)}" data-tooltip="Open ${esc(c.rule.label ?? c.label)}">i</button>` : "";
  return `<span class="${cls}"${c.manual ? ` data-manual="${esc(c.id)}"` : ""}>${body}${x}${i}</span>`;
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
/** v0.0.294 (Lucas): the ladder carries the creature's chance of each Tier (when the setting shows them); the "≤" in a font that draws it well. */
// v0.0.397 (Lucas: "reduce the height of the tier ladder, putting the percentages next to the tier number"): one line ("Tier 1 · ≤13 · 28%")
// v0.0.399 (Lucas: "Need to reduce text size"): on the creature's line, smaller and "T1" for "Tier 1"
const ladderHtml = (dc, crit, odds = null, short = false) => `<div class="rd-ladder one${short ? " short" : ""}${crit ? " crit" : ""}">${ladder(dc, crit).map((s, i) => `<span class="rd-lseg ${s.k}"><span>${esc(short ? s.label.replace(/^Tier /, "T").replace(" · ", " ") : s.label).replace("≤", '<span class="rd-le">≤</span>')}${odds ? `${short ? " " : " · "}<b class="rd-lpct">${odds[i]}%</b>` : ""}</span></span>`).join("")}</div>`;
/** A creature's chances for its ladder: null when the setting hides them (or the player view hides the Defenses: no ladder then anyway). */
const ladderOdds = (inp, st, c, crit) => (inp.showOdds && !inp.hideDef && !inp.save ? oddsOf(creatureCalc(inp, st, c.uuid), crit) : null);
const defBadge = (c, hide) => `<span class="rd-def" ${hide ? 'data-tooltip="Hidden by the GM"' : ""}>${esc(c.def ?? "DC")}${hide ? "" : ` ${Number(c.dc) || 13}`}</span>`;
const counts = (b, n) => `<span class="rd-cnt"><span class="up" aria-label="${b} Boons">▲${b}</span> <span class="down" aria-label="${n} Banes">▼${n}</span></span>`;

/** v0.0.293 (Lucas): the small line under each Tier: its average damage (with everything that is on) and each creature's chance of it. */
export function tierStats(inp, st, v) {
  const net = stepNet(inp, st).net, live = liveCreatures(inp, st), crit = !!v?.crit;
  const pct = inp.showOdds && !inp.hideDef && !inp.save && !v?.noTiers;
  const odds = pct ? live.map(c => ({ name: c.name, o: oddsOf(creatureCalc(inp, st, c.uuid), crit) })) : [];
  const out = {};
  for (const n of [1, 2, 3]) out[n] = { avg: inp.showAvg ? tierAvg(v?.tiers?.[n], tierTags(inp, st, n), net) : 0, odds: odds.map(x => ({ name: x.name, p: x.o[n - 1] })) };
  out.crit = { avg: 0, odds: crit ? odds.map(x => ({ name: x.name, p: x.o[3] })) : [] };
  return out;
}
// v0.0.294: the line under each Tier is the average only; the chances moved to each creature's ladder
const statLine = x => (x.avg ? `<div class="rd-stat">Avg ${x.avg}</div>` : "");

function tierTableHtml(inp, st, v) {
  if (!v) return "";
  if (v.noTiers) return v.effects ? `<table class="rd-tiers"><tr class="rd-eff"><th scope="row">Effects</th><td>${v.effects}</td></tr></table>` : "";
  const stats = tierStats(inp, st, v);
  const cell = n => {
    const lines = poolLines(v.tiers?.[n], tierTags(inp, st, n).map(c => ({ pool: c.pool, tag: c.tag })));
    const dmg = lines.map(l => `<span class="rd-pool">${poolIcon(l.pool)} ${l.segs.map(s => `${esc(s.t)}${s.sub ? ` <b class="rd-sub" style="color:${SUB_INK[s.sub] ?? "#4a443b"}">${esc(s.sub)}</b>` : ""}`).join(" + ")}${l.tags.map(g => ` <span class="rd-ptag">${esc(g)}</span>`).join("")}</span>`).join('<span class="rd-dot" aria-hidden="true"> · </span>');
    const riders = (v.tiers?.[n]?.riders ?? []).map(r => `<div class="rd-rider">↳ ${r}</div>`).join("");
    return (dmg || riders ? `${dmg ? `<div>${dmg}</div>` : ""}${riders}` : "&mdash;") + statLine(stats[n]);
  };
  // v0.0.334 (Lucas): the GM clicks a Tier (or Critical) to make it the result (again: back to the roll); forceTier 4 = a Critical
  const th = (n, label) => (inp.canForce && !inp.save ? `<th scope="row"><button type="button" class="rd-tforce" data-act="force" data-t="${n}" aria-pressed="${Number(st.forceTier) === n}" data-tooltip="${Number(st.forceTier) === n ? "Forced: click again to roll normally" : `Make ${label} the result (GM)`}">${label}</button></th>` : `<th scope="row">${label}</th>`);
  const can = inp.canForce && !inp.save, rowAt = n => (can ? ` data-force="${n}"` : "");
  const rows = [1, 2, 3].map(n => `<tr class="t${n}${Number(st.forceTier) === n ? " forced" : ""}${can ? " rd-forcable" : ""}"${rowAt(n)}>${th(n, `Tier ${n}`)}<td>${cell(n)}</td></tr>`);
  if (v.crit) rows.push(`<tr class="crit${Number(st.forceTier) === 4 ? " forced" : ""}${can ? " rd-forcable" : ""}"${rowAt(4)}>${th(4, "Critical")}<td>${v.crit}</td></tr>`);
  if (v.effects) rows.push(`<tr class="rd-eff"><th scope="row">Effects<small>(T${v.effectsFrom ?? 2}+)</small></th><td>${v.effects}</td></tr>`);
  const net = stepNet(inp, st);
  return `<table class="rd-tiers">${rows.join("")}</table>${net.line ? `<div class="rd-step">${esc(net.line)}</div>` : ""}`;
}

function metaHtml(inp, v) {
  const m = v?.meta ?? {}, sep = '<span class="rd-star" aria-hidden="true"> ✦ </span>';
  // v0.0.294 (Lucas): the book's format (Ch. 1, Reading an Action): Targets (✦ the Area) on one line, "Distance: X ✦ Vs. X" on the next, the
  // Trigger / Interrupt after the meta lines (the chat cards' order too, brief section 12)
  const l1 = [m.targets ? `<b>Targets:</b> ${esc(m.targets)}` : "", inp.area ? `<button type="button" class="rd-area" data-act="place" data-tooltip="${inp.area.placed ? "Place the area again" : "Place the area"}"><span aria-hidden="true">◇</span> ${esc(inp.area.labels?.[v?.ap] ?? inp.area.label)}</button>` : ""].filter(Boolean);
  const l2 = [m.dist && !/^self$/i.test(m.dist) ? `<b>Distance:</b> ${esc(m.dist)}` : "", m.vs ? `${/save$/i.test(m.vs) ? "" : "<b>Vs.</b> "}${vsColored(m.vs)}` : ""].filter(Boolean);
  const out = [];
  if (Number(m.escalation) > 0) out.push(`<div class="rd-meta">${Number(m.escalation)} Escalation</div>`);
  if (l1.length) out.push(`<div class="rd-meta">${l1.join(sep)}</div>`);
  if (l2.length) out.push(`<div class="rd-meta">${l2.join(sep)}</div>`);
  if (m.requirements) out.push(`<div class="rd-meta"><b>Requirements:</b> ${esc(m.requirements)}</div>`);
  if (m.setup) out.push(`<div class="rd-meta"><b>Setup:</b> ${m.setup}</div>`);
  // v0.0.335 (Lucas): the traits in the Trigger as chips, the Action preview's look (triggerHtml: rollinput.mjs runs config.mjs highlightText)
  if (m.trigger) out.push(`<div class="rd-meta"><b>${m.triggerKind === "interrupt" ? "Interrupt" : "Trigger"}:</b> ${m.triggerHtml ?? esc(m.trigger)}</div>`);
  return out.join("");
}

function traitsHtml(inp, v) {
  const groups = [];
  for (const t of v?.traits ?? []) { let g = groups.find(x => x.key === t.group); if (!g) groups.push(g = { key: t.group, label: t.groupLabel ?? t.group, list: [] }); g.list.push(t); }
  const blocks = groups.map(g => `<span class="rd-tgroup"><span class="rd-tchips">${g.list.map(t => `<span class="rd-trait tg-${esc(g.key)}"${t.tip ? ` data-tooltip="${esc(t.tip)}"` : ""}>${esc(t.label)}</span>`).join("")}</span><span class="rd-glabel">${esc(g.label)}</span></span>`);
  const freq = `<span class="rd-freq" style="--fq:${esc(inp.freqColor ?? "#5F5E5A")};background:var(--fq)">${esc([inp.freqLabel, v?.cost].filter(Boolean).join(" · "))}</span>`;
  return `<div class="rd-traits"><span class="rd-tlist">${blocks.join('<span class="rd-tsep" aria-hidden="true"></span>')}</span>${freq}</div>`;
}

/**
 * v0.0.398 (Lucas: "Only update the targets if we click the Target button; the button needs to be there even if there are already targets, to change
 * or to remove them; if no token is targeted and you click it, it becomes without a target"): the dialog doesn't follow the map any more; Target reads
 * the creatures targeted now. Not for an area (its creatures come from the area) or a roll on yourself.
 */
const targetBtn = inp => (inp.area || inp.self ? "" : '<button type="button" class="rd-tgtbtn" data-act="targetmode" data-tooltip="Use the creatures targeted on the map now (none targeted: no target)">Target</button>');
// v0.0.370 (Lucas): the target's token image before its name (none for "No target" and "Your roll")
const cImg = c => (c.img ? `<img class="rd-cimg" src="${esc(c.img)}" alt="">` : "");
function creaturesHtml(inp, st, v) {
  const live = liveCreatures(inp, st), crit = !!v?.crit, hide = !!inp.hideDef;
  // v0.0.293: a Save Action: each creature with your Save DC (they roll; nothing of theirs to switch here)
  if (inp.save) return live.filter(c => c.uuid !== "none" && c.uuid !== "self").map(c => `<div class="rd-cbox"><div class="rd-cname">${cImg(c)}<b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}<span class="rd-def">${esc(inp.save.label)} ${inp.save.dc}</span></div></div>`).join("") || `<div class="rd-none">No target. Target a creature on the map.</div>`;
  if (!live.length) return `<div class="rd-none">${inp.area && !inp.area.placed ? "Place the area to choose the creatures." : `No target. Target a creature on the map, then press Target.${targetBtn(inp)}`}</div>`;
  // v0.0.343: several creatures for an Action that rolls nothing (Double Shot): each one named, nothing to roll against
  if (!inp.multi && live.length > 1) return live.map(c => `<div class="rd-cbox"><div class="rd-cname">${cImg(c)}<b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}</div></div>`).join("");
  if (!inp.multi) {
    const c = live[0], own = chipsOf(inp, st, c.uuid);
    // v0.0.340: "No target" (an area with no creature, an Action rolled without one): its DC typed here (13 by default)
    // v0.0.398 (Lucas: "maybe even do just one line, with: Name | Tiers | DC"): the creature, its ladder, its DC (typed for "No target") and the Target
    // button on one line; its own Boons and Banes under it
    const dcIn = c.uuid === "none" ? `<label class="rd-dcin">DC <input type="number" min="1" max="40" data-field="noTargetDc" value="${Number(c.dc) || 13}" aria-label="The DC to roll against"></label>` : defBadge(c, hide);
    return `<div class="rd-cbox one"><div class="rd-c1"><span class="rd-cname">${cImg(c)}<b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}</span>${hide ? '<span class="rd-c1sp"></span>' : ladderHtml(c.dc, crit, ladderOdds(inp, st, c, crit), true)}${dcIn}${targetBtn(inp)}</div>${rowsHtml(own, st, c.uuid, ROWS.filter(r => r[0] !== "passives" && r[0] !== "damage"))}</div>`;
  }
  const three = anyThree(inp, st);
  const tgtRow = targetBtn(inp) ? `<div class="rd-tgtrow"><span>${live.length} targets</span>${targetBtn(inp)}</div>` : "";
  return tgtRow + live.map(c => {
    const k = creatureCalc(inp, st, c.uuid), open = !!st.open?.[c.uuid], own = chipsOf(inp, st, c.uuid);
    const head = `<div class="rd-cline"><button type="button" class="rd-copen" data-act="open" data-uuid="${esc(c.uuid)}" aria-expanded="${open}"><span class="rd-chev" aria-hidden="true">${open ? "▾" : "▸"}</span>${cImg(c)}<b>${esc(c.name)}</b>${c.size ? ` <small>${esc(c.size)}</small>` : ""}<span class="rd-cdice">${esc(creatureDice(k, three))}</span><span class="rd-cmod">${k.mod >= 0 ? "+" : "−"}${Math.abs(k.mod)}</span>${counts(k.boons, k.banes)}${bbNotes(k).length ? `<span class="rd-dnote rd-bbcap">${esc(bbNotes(k).join(" · "))}</span>` : ""}</button>${defBadge(c, hide)}<button type="button" class="rd-cx rm" data-act="untarget" data-uuid="${esc(c.uuid)}" aria-label="Remove ${esc(c.name)}" data-tooltip="Remove ${esc(c.name)} from the targets (or right-click its line)">×</button></div>`;
    if (!open) return `<div class="rd-cbox multi" data-uuid="${esc(c.uuid)}">${head}</div>`;
    const add = `<div class="rd-row"><span class="rd-rlabel">Add here:</span><span class="rd-chips">${["boon", "bane", "fav", "doom"].map(kd => `<button type="button" class="rd-addhere" data-act="quick" data-scope="${esc(c.uuid)}" data-k="${kd}">${pip({ kind: kd })}${QUICK_LABEL[kd]}</button>`).join("")}</span></div>`;
    return `<div class="rd-cbox multi open" data-uuid="${esc(c.uuid)}">${head}${rowsHtml(own, st, c.uuid, ROWS.filter(r => r[0] !== "passives" && r[0] !== "damage"))}${add}${hide ? "" : ladderHtml(c.dc, crit, ladderOdds(inp, st, c, crit))}</div>`;
  }).join("");
}

/**
 * v0.0.397 (Lucas, on the mockup foundry/mockups/rolldlg-card.html: "Go, build it"): the dialog's card part in the book's card format (the Action
 * card of the style plan's step 5): the name and its cost, the Flavor, the traits as words, the grid (Distance and the Area at the left, Target at the
 * right), then labeled lines: Attack (or Save), Requirements, Setup, Trigger, Tier 1 to 3, Critical, Effects. No Tier color on the lines (the ladder
 * and the chat's stamp keep it); the bonuses keep theirs, with their source. The GM still clicks a Tier's name to force it.
 */
const DEF_NAME = { AD: "Armor Defense", WD: "Ward Defense" };
function cardHtml(inp, st, v) {
  const m = v?.meta ?? {}, cost = [inp.freqLabel, v?.cost].filter(Boolean).join(" · ");
  const head = `<div class="rdc-head"><h1 class="rd-name">${esc(inp.name)}</h1>${cost ? `<span class="rdc-cost rd-freq" style="--fq:${esc(inp.freqColor ?? "#5F5E5A")}">${esc(cost)}</span>` : ""}</div>`;
  const flavor = inp.flavor ? `<div class="rdc-flavor rd-flavor">${esc(inp.flavor)}</div>` : "";
  const words = (v?.traits ?? []).map(t => `<span class="rd-trait tg-${esc(t.group)}"${t.tip ? ` data-tooltip="${esc(t.tip)}"` : ""}>${esc(t.label)}</span>`);
  const traits = words.length ? `<div class="rdc-traits rd-traits">${words.join('<i aria-hidden="true">·</i>')}</div>` : "";
  const area = inp.area ? `<button type="button" class="rd-area" data-act="place" data-tooltip="${inp.area.placed ? "Place the area again" : "Place the area"}"><span aria-hidden="true">◇</span> ${esc(inp.area.labels?.[v?.ap] ?? inp.area.label)}</button>` : "";
  const left = [m.dist && !/^self$/i.test(m.dist) ? `<span><b>Distance:</b> ${esc(m.dist)}</span>` : "", area ? `<span><b>Area:</b> ${area}</span>` : ""].filter(Boolean).join("");
  const grid = left || m.targets ? `<div class="rdc-grid"><span class="rdc-gl">${left}</span>${m.targets ? `<span><b>Target:</b> ${esc(m.targets)}</span>` : ""}</div>` : "";
  const line = (label, html, cls = "") => `<div class="rdc-l${cls}"><b>${label}</b><span>${html}</span></div>`;
  const out = [];
  if (Number(m.escalation) > 0) out.push(line("Escalation", String(Number(m.escalation))));
  if (m.requirements) out.push(line("Requires", esc(m.requirements)));
  if (m.setup) out.push(line("Setup", m.setup));
  if (m.trigger) out.push(line(m.triggerKind === "interrupt" ? "Interrupt" : "Trigger", m.triggerHtml ?? esc(m.trigger)));
  if (m.vs) {
    const save = /save$/i.test(m.vs);
    const vsTxt = save ? esc(m.vs) : `${esc(inp.roll?.name ?? "Modifier")} ${sgn(Number(inp.roll?.mod) || 0)} vs. ${esc(String(m.vs).replace(/\b(AD|WD)\b/g, d => DEF_NAME[d]))}`;
    out.push(line(save ? "Save" : "Attack", vsTxt));
  }
  if (v && !v.noTiers) {
    const stats = tierStats(inp, st, v), can = inp.canForce && !inp.save;
    const name = (n, label) => (can ? `<button type="button" class="rd-tforce" data-act="force" data-t="${n}" aria-pressed="${Number(st.forceTier) === n}" data-tooltip="${Number(st.forceTier) === n ? "Forced: click again to roll normally" : `Make ${label} the result (GM)`}">${label}</button>` : label);
    const tierText = n => {
      const tags = tierTags(inp, st, n);
      const lines = poolLines(v.tiers?.[n], []);
      const dmg = lines.map(l => `<span class="rdc-pv ${l.pool === "M" ? "r" : "v"}">${poolIcon(l.pool)} ${l.segs.map(s => `${esc(s.t)}${s.sub ? ` <b class="rd-sub">${esc(s.sub)}</b>` : ""}`).join(" + ")}</span>`).join(" ");
      const bon = tags.map(c => ` <span class="rdc-chg">${esc(c.tag)} ${esc(c.label)}</span>`).join("");
      const riders = (v.tiers?.[n]?.riders ?? []).map(r => ` <span class="rd-rider">${r}</span>`).join("");
      const avg = stats[n]?.avg ? `<span class="rdc-avg">avg ${stats[n].avg}</span>` : "";
      return (dmg || bon || riders ? `${dmg}${bon}${riders}` : "&mdash;") + avg;
    };
    // v0.0.400 (Lucas: "Selecting a Tier in the roll dialog isn't causing that Tier"): the whole line is clickable (GM), as the table's rows were
    const fa = n => (can ? ` data-force="${n}"` : "");
    for (const n of [1, 2, 3]) out.push(`<div class="rdc-l t${n}${Number(st.forceTier) === n ? " forced" : ""}${can ? " rd-forcable" : ""}"${fa(n)}><b>${name(n, `Tier ${n}`)}</b><span>${tierText(n)}</span></div>`);
    if (v.crit) out.push(`<div class="rdc-l crit${Number(st.forceTier) === 4 ? " forced" : ""}${can ? " rd-forcable" : ""}"${fa(4)}><b>${name(4, "Critical")}</b><span>${v.crit}</span></div>`);
    if (v.effects) out.push(line(`Effects <small>(T${v.effectsFrom ?? 2}+)</small>`, v.effects));
    const net = stepNet(inp, st);
    if (net.line) out.push(`<div class="rd-step">${esc(net.line)}</div>`);
  } else if (v?.effects) out.push(line("Effects", v.effects));
  return `<div class="rd-card">${head}${flavor}${traits}${grid}${out.join("")}</div>`;
}

/** The whole dialog's inner HTML: header (fixed), body (scrolls), Designer footer, bottom bar (fixed). */
export function dialogHtml(inp, st) {
  const v = versionOf(inp, st), dl = diceLine(inp, st), why = blockedReason(inp, st), noRoll = !!v?.noTiers;
  // v0.0.293 (Lucas: allow it with a warning): a Version you can't afford is struck through but can be chosen
  const vers = (inp.versions ?? []).length > 1 ? `<div class="rd-vers" role="group" aria-label="Version">${inp.versions.map(x => `<button type="button" data-act="ver" data-ap="${x.ap}" aria-pressed="${Number(x.ap) === Number(v?.ap)}"${x.disabled ? ` data-tooltip="${esc(x.why ?? "")}" class="cant"` : ""}>${esc(x.cost)}</button>`).join("")}</div>` : "";
  // v0.0.349 (Lucas, playtest 4: "Enfeebled on the same line, tighter, no +1 / −1 on the icons"): +1 / −1 without a sign icon (the label says it)
  const quick = `<div class="rd-quick tight">${(inp.save ? ["emp"] : quickKinds(inp.multi)).map(k => `<button type="button" class="rd-qb" data-act="quick" data-scope="shared" data-k="${k}">${["plus", "minus"].includes(k) ? "" : pip({ kind: k })}${QUICK_LABEL[k]}</button>`).join("")}</div>`;
  const notices = (inp.notices ?? []).length ? `<div class="rd-notes">${inp.notices.map(n => `<span class="rd-note"${n.why ? ` data-tooltip="${esc(n.why)}"` : ""}>${esc(n.text)}</span>`).join("")}</div>` : "";
  const head = inp.save ? `<div class="rd-dice"><b class="rd-dtxt">Their roll</b> <i class="rd-dnames">${esc(inp.save.label)} vs DC ${inp.save.dc}</i> <span class="rd-dnote">· each target rolls; the Tiers are their result</span></div>`
    : `<div class="rd-dice"><b class="rd-dtxt">${esc(dl.dice)}</b> <b>${sgn(dl.mod)}</b> <i class="rd-dnames">${esc(dl.names.join(", "))}</i> ${counts(dl.boons, dl.banes)}${dl.note ? ` <span class="rd-dnote">· ${esc(dl.note)}</span>` : ""}${(dl.bbNotes ?? []).map(x => ` <span class="rd-dnote rd-bbcap">· ${esc(x)}</span>`).join("")}</div>`;
  // v0.0.293 (Lucas: Reactions and Opportunity Attack still had the old window): a Version with no roll shows the card and its targets; Use
  const named = liveCreatures(inp, st).filter(c => !["self", "none"].includes(c.uuid));
  const panel = noRoll ? (named.length ? `<div class="rd-tline">→ ${esc(named.map(c => c.name).join(", "))}</div>` : "")
    : `<section class="rd-roll">${head}
    <div class="rd-mhead"><span>${inp.multi && !inp.save ? "Modifiers · every target" : "Modifiers"}</span></div>${quick}${notices}${rowsHtml(chipsOf(inp, st, "shared"), st, "shared", inp.save ? ROWS.filter(r => ["passives", "damage"].includes(r[0])) : ROWS)}
    <div class="rd-creatures">${creaturesHtml(inp, st, v)}</div></section>`;
  // v0.0.397: the Flavor opens the card (cardHtml), as in the book
  const designer = inp.designer && v && !v.noTiers && !inp.save ? `<div class="rd-designer"><div>${inp.showOdds && !inp.hideDef ? "" : liveCreatures(inp, st).map(c => `<div>${cImg(c)}<b>${esc(c.name)}</b>: ${oddsLine(oddsOf(creatureCalc(inp, st, c.uuid), !!v.crit))}</div>`).join("")}</div><div class="rd-force" role="group" aria-label="Force a Tier">Force a Tier: ${[1, 2, 3].map(n => `<button type="button" data-act="force" data-t="${n}" aria-pressed="${Number(st.forceTier) === n}">T${n}</button>`).join("")}</div></div>` : "";
  const modes = (inp.rollModes ?? []).length ? `<select class="rd-mode" data-field="rollMode" aria-label="Roll mode">${inp.rollModes.map(([k, l]) => `<option value="${esc(k)}"${k === st.rollMode ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>` : "";
  const bar = `<footer class="rd-bar">${modes}${vers}<button type="button" class="rd-go" data-act="roll"${why ? " disabled" : ""}>${noRoll || inp.save ? "Use" : "Roll"}</button></footer>${why ? `<div class="rd-why" role="status">${esc(why)}</div>` : ""}${inp.hideDef ? '<div class="rd-pview">Player view · enemy Defenses hidden by the GM</div>' : ""}`;
  // v0.0.370 (Lucas): no yellow warning at the bottom (the struck Version and the reason on it say it); warnings() stays for the tests and callers
  const warnHtml = "";
  // v0.0.349 (Lucas, playtest 4: "the AP Version buttons at the bottom next to Roll")
  // v0.0.397: the card part in the book's format (cardHtml); the old head, meta lines and Tier table (traitsHtml, metaHtml, tierTableHtml) stay for reference
  void traitsHtml; void metaHtml; void tierTableHtml;
  return `<div class="rd-body rd-cardbody">${cardHtml(inp, st, v)}${panel}</div>${designer}${warnHtml}${bar}`;
}
