// Damage math for actions: average damage per tier, tier odds and expected damage.

/** Average of a dice expression such as "1d4+2", "2d6+1d4" or "3". Returns null when it cannot be read. */
export function avgFormula(f) {
  const s = String(f ?? "").replace(/\s+/g, "");
  if (!s) return 0;
  const expr = s.replace(/(\d*)d(\d+)/gi, (m, n, d) => `(${(Number(n || 1) * (Number(d) + 1)) / 2})`);
  if (!/^[0-9+\-*/().]+$/.test(expr)) return null;
  try { const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? v : null; } catch { return null; }
}

// One d12 chain: a 12 counts as 11 and is rolled again. Distribution of [first face, total].
const CHAINS = new Map();
function chain(maxDepth = 6) {
  if (CHAINS.has(maxDepth)) return CHAINS.get(maxDepth);
  const out = new Map();
  const rec = (first, total, p, depth) => {
    for (let f = 1; f <= 12; f++) {
      const q = p / 12;
      if (f === 12 && depth < maxDepth) { rec(first || 12, total + 11, q, depth + 1); continue; }
      const key = `${first || f}|${total + (f === 12 ? 11 : f)}`;
      out.set(key, (out.get(key) ?? 0) + q);
    }
  };
  rec(0, 0, 1, 0);
  const list = [...out].map(([k, p]) => { const [f, t] = k.split("|").map(Number); return { f, t, p }; });
  CHAINS.set(maxDepth, list);
  return list;
}

/* ---- v0.0.301 (PACK BB; book Ch. 1 "Boons and Banes", "Named Boons and Banes", "Five Boons or Banes", "Favored and Doomed Rolls") ---- */
/** Boons and Banes with the same name add up to 2 (each side, before cancelling). */
export const BB_LIMIT = 2;
/** The names that carry a limit. A Boon or Bane with no name (or any other word) has none: it always adds up. */
export const BB_NAMES = { field: "Field", pressure: "Pressure", support: "Support" };
export const bbKey = v => { const k = String(v ?? "").trim().toLowerCase(); return Object.hasOwn(BB_NAMES, k) ? k : ""; };
/**
 * Boons and Banes of several sources, each { boons, banes, bb } (bb: "field" | "pressure" | "support" | ""): the limit of 2 applied to each name and
 * each side, then the totals. { boons, banes, rawBoons, rawBanes, groups: { field: { boons, banes, keptBoons, keptBanes } } }. Pure.
 */
export function bbCount(list = []) {
  const groups = {};
  let boons = 0, banes = 0, rawBoons = 0, rawBanes = 0;
  for (const s of list ?? []) {
    const b = Math.max(0, Number(s?.boons) || 0), n = Math.max(0, Number(s?.banes) || 0), k = bbKey(s?.bb);
    rawBoons += b; rawBanes += n;
    if (!k) { boons += b; banes += n; continue; }
    const g = (groups[k] ??= { boons: 0, banes: 0, keptBoons: 0, keptBanes: 0 });
    g.boons += b; g.banes += n;
  }
  for (const g of Object.values(groups)) { g.keptBoons = Math.min(BB_LIMIT, g.boons); g.keptBanes = Math.min(BB_LIMIT, g.banes); boons += g.keptBoons; banes += g.keptBanes; }
  return { boons, banes, rawBoons, rawBanes, groups };
}
/** Boons and Banes cancel; 5 or more left make the roll Favored (Boons) or Doomed (Banes) instead of adding. { net, add, five }. */
export function bbFive(boons = 0, banes = 0) {
  const net = (Number(boons) || 0) - (Number(banes) || 0);
  if (net >= 5) return { net, add: 0, five: "favored" };
  if (net <= -5) return { net, add: 0, five: "doomed" };
  return { net, add: net, five: "" };
}
/** The roll's state from its own Favored / Doomed and the five b/b: Favored and Doomed together are a normal roll; never Favored (or Doomed) twice. */
export function rollState(favored = false, doomed = false, five = "") {
  const f = !!favored || five === "favored", d = !!doomed || five === "doomed";
  return f && d ? "" : f ? "favored" : d ? "doomed" : "";
}
/** The same from a state string ("favored", "doomed" or ""). */
export const mergeState = (state = "", five = "") => rollState(state === "favored", state === "doomed", five);

/**
 * How Favored and Doomed keep their dice (Ch. 1): Doomed keeps the two lowest totals, no Doubles. Favored keeps the two highest totals, any two
 * matching faces of the three are Doubles (even one not kept), three of a kind a Critical whatever the total. trio: [{ f (first face), t (total) }].
 * Returns { keep: [i, j], doubles, triple }.
 */
export function keepThree(trio, state, noDoubles = false) {
  const order = trio.map((d, i) => ({ t: d.t, i })).sort((a, b) => (state === "doomed" ? a.t - b.t : b.t - a.t) || a.i - b.i);
  const keep = [order[0].i, order[1].i].sort((a, b) => a - b);
  if (state !== "favored" || noDoubles) return { keep, doubles: false, triple: false };
  const [a, b, c] = trio.map(d => d.f);
  return { keep, doubles: a === b || a === c || b === c, triple: a === b && b === c };
}
/** A total's Tier, with Doubles and three of a kind: { tier, crit, base }. */
export function tierOf(total, dc, doubles = false, triple = false) {
  const base = total < dc ? 1 : (total < dc + 7 ? 2 : 3);
  if (triple) return { base, tier: 3, crit: true };
  return { base, tier: doubles ? Math.min(3, base + 1) : base, crit: (doubles && base === 3) || total >= dc + 20 };
}

const CACHE = new Map();
/**
 * Chance of Tier 1, 2 and 3 for 2d12 + mod vs a DC, with Doubles, Boons (+1 each) and Banes (-1 each) that cancel, 5 or more left making the roll
 * Favored or Doomed instead (boons and banes are counts after the limits of their names: bbCount), and state "favored" / "doomed" / "".
 * wantCrit: [_, _, chance of a Critical].
 */
export function tierProbs(mod, dc = 13, boons = 0, banes = 0, state = "", wantCrit = false) {
  const key = `${mod}|${dc}|${boons}|${banes}|${state}|${wantCrit}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const c = chain();
  const five = bbFive(boons, banes), st = mergeState(state, five.five), adj = five.add;
  const res = [0, 0, 0];
  if (!st) {
    for (const a of c) for (const b of c) {
      const r = tierOf(a.t + b.t + mod + adj, dc, a.f === b.f);
      if (wantCrit) { if (r.crit) res[2] += a.p * b.p; }
      else res[r.tier - 1] += a.p * b.p;
    }
  } else {
    const c3 = chain(2);   // three dice: two explosions deep is enough (a third 12 in a row is 1 in 1,728)
    for (const a of c3) for (const b of c3) for (const x of c3) {
      const w = a.p * b.p * x.p, trio = [a, b, x], k = keepThree(trio, st);
      const r = tierOf(trio[k.keep[0]].t + trio[k.keep[1]].t + mod + adj, dc, k.doubles, k.triple);
      if (wantCrit) { if (r.crit) res[2] += w; }
      else res[r.tier - 1] += w;
    }
  }
  CACHE.set(key, res);
  return res;
}

const dieSides = d => Number(String(d).replace(/\D/g, "")) || 0;
/** Average of the weapon's damage for a tier, n instances. */
export function weaponAvg(weapon, tier, n = 1) {
  const d = weapon?.system?.damage?.[`t${tier}`];
  if (!d) return 0;
  const dice = d.die ? d.count * n * (dieSides(d.die) + 1) / 2 : 0;
  return dice + d.mod * n;
}

/** Average damage of one tier of a version. */
export function tierAvg(insts, tier, { weapon = null, attrVal = 0, isWeapon = false, attrMode = "" } = {}) {
  const dmg = insts;
  if (!dmg.length) return 0;
  let total = 0;
  for (const i of dmg) {
    if (i.useW) total += weaponAvg(weapon, tier, i.wCount);
    if (i.dice) total += avgFormula(i.dice) ?? 0;
    if (i.useAt) total += attrVal;
  }
  // [Mod] added to the damage: the Weapon Modifier on Tiers 2 and 3; nothing for Power, Signature and Attribute Actions (rollsource.mjs).
  const from = attrMode === "all" ? 1 : attrMode === "t2" ? 2 : attrMode === "none" ? Infinity : (isWeapon ? 2 : Infinity);
  if (tier >= from && dmg.length && !dmg.some(i => i.useAt)) total += attrVal;
  return total;
}

/** Average and expected damage for each tier of a version. mod = attack modifier (null when unknown). */
export function versionStats(version, ctx = {}) {
  const { mod = null, dc = 13 } = ctx;
  const avg = [1, 2, 3].map(t => tierAvg(version[`t${t}`] ?? [], t, ctx));
  const probs = mod === null ? null : tierProbs(mod, dc);
  const exp = probs ? avg.map((a, i) => a * probs[i]) : null;
  return { avg, exp, probs, expTotal: exp ? exp.reduce((s, x) => s + x, 0) : null, meanAvg: avg.reduce((s, x) => s + x, 0) / 3 };
}

export const fmt = n => (n === null || n === undefined ? "\u2014" : (Math.round(n * 10) / 10).toString());

/** Odds of a damage roll: every die of every component, plus the flat part. Returns average, chance of exactly this total and of this total or more. */
export function damageOdds(comps) {
  const faces = [];
  let flat = 0, total = 0;
  for (const c of comps) {
    let diceSum = 0;
    for (const d of c.dice ?? []) { for (const r of d.results) { faces.push(d.faces); diceSum += r; } }
    flat += c.total - diceSum; total += c.total;
  }
  let dist = new Map([[0, 1]]);
  for (const f of faces) {
    const next = new Map();
    for (const [v, p] of dist) for (let x = 1; x <= f; x++) next.set(v + x, (next.get(v + x) ?? 0) + p / f);
    dist = next;
  }
  let avg = 0, exact = 0, atLeast = 0;
  for (const [v, p] of dist) { avg += (v + flat) * p; if (v + flat === total) exact += p; if (v + flat >= total) atLeast += p; }
  return { avg, exact, atLeast, hasDice: faces.length > 0 };
}

/**
 * Empowered N adds N to every die of the damage; Enfeebled N subtracts N from every die, but each die still deals at least 1 (Enfeebled is a negative step).
 * `results` are the numbers rolled on the dice; returns how much to add to the damage. Flat numbers, and damage with no dice, don't change.
 */
export function perDieDelta(results, step) {
  const k = Math.trunc(Number(step) || 0);
  if (!k) return 0;
  return k > 0 ? k * results.length : results.reduce((sum, v) => sum + Math.max(1, v + k) - v, 0);
}

/** One Empowered value and one Enfeebled value count: the highest of each (the same effect doesn't stack), and the Enfeebled value is taken from the Empowered one. Lists of { n }. */
export function netStep(empowered = [], enfeebled = []) {
  const top = list => list.reduce((m, x) => Math.max(m, Number(x.n) || 0), 0);
  return top(empowered) - top(enfeebled);
}

/** The highest value of a list of { n } (the same effect doesn't stack). */
/** Empowered / Enfeebled from several sources: the highest "Set to" (Stacking) plus every "Increase by" (v0.0.323, PACK EFFECT-SHEET: Vow of Enmity). */
export const topStep = list => (list ?? []).reduce((m, x) => (x.inc ? m : Math.max(m, Number(x.n) || 0)), 0) + (list ?? []).reduce((s, x) => s + (x.inc ? Number(x.n) || 0 : 0), 0);

/** "Empowered 2", "Enfeebled 1", or "" for no step. */
export const stepLabel = n => (n > 0 ? `Empowered ${n}` : n < 0 ? `Enfeebled ${-n}` : "");

/** Chance of a Critical: Doubles on a Tier 3, a total 20 or more above the DC, or three of a kind on a Favored roll. */
export const critProb = (mod, dc = 13, boons = 0, banes = 0, state = "") => tierProbs(mod, dc, boons, banes, state, true)[2];
