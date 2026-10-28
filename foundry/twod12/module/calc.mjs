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

const CACHE = new Map();
/** Chance of Tier 1, 2 and 3 for 2d12 + mod vs a DC, with the doubles rule, boons (+1d3-1 each) and banes (-1d3+1 each). */
export function tierProbs(mod, dc = 13, boons = 0, banes = 0, state = "", wantCrit = false) {
  const key = `${mod}|${dc}|${boons}|${banes}|${state}|${wantCrit}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const c = chain();
  // distribution of the 1d3-1 pool (boons add, banes subtract); at most a few dice, convolved
  let pool = new Map([[0, 1]]);
  for (const sign of [...Array(Math.max(0, boons)).fill(1), ...Array(Math.max(0, banes)).fill(-1)]) {
    const next = new Map();
    for (const [v, p] of pool) for (let d = 0; d <= 2; d++) { const nv = v + sign * d; next.set(nv, (next.get(nv) ?? 0) + p / 3); }
    pool = next;
  }
  const res = [0, 0, 0];
  const add = (a, b, w) => {
    for (const [adj, pp] of pool) {
      const total = a.t + b.t + mod + adj;
      const base = total < dc ? 1 : (total < dc + 7 ? 2 : 3);
      const t = a.f === b.f ? Math.min(3, base + 1) : base;
      // Critical: Doubles on a result that is already Tier 3, or a total 20 or more above the DC.
      if (wantCrit) { if ((a.f === b.f && base === 3) || total >= dc + 20) res[2] += w * pp; }
      else res[t - 1] += w * pp;
    }
  };
  if (!state) {
    for (const a of c) for (const b of c) add(a, b, a.p * b.p);
  } else {
    // Three dice. Doomed: keep the two lowest totals, and there are no Doubles. Favored: keep the pair that gives the best Tier
    // (then a Critical, then the higher total), which can be a lower pair of Doubles (rolls.keepDice does the same at the table).
    const c3 = chain(2);   // three dice: two explosions deep is enough (a third 12 in a row is 1 in 1,728)
    for (const a of c3) for (const b of c3) for (const x of c3) {
      const w = a.p * b.p * x.p, trio = [a, b, x];
      for (const [adj, pp] of pool) {
        let best = null;
        for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
          const p = trio[i], q = trio[j], total = p.t + q.t + mod + adj;
          const base = total < dc ? 1 : (total < dc + 7 ? 2 : 3);
          const dbl = state === "favored" && p.f === q.f;
          const r = { tier: dbl ? Math.min(3, base + 1) : base, crit: (dbl && base === 3) || total >= dc + 20, total, low: -(p.t + q.t) };
          if (!best) { best = r; continue; }
          if (state === "doomed") { if (r.low > best.low) best = r; continue; }
          if (r.tier > best.tier || (r.tier === best.tier && (Number(r.crit) > Number(best.crit) || (r.crit === best.crit && r.total > best.total)))) best = r;
        }
        if (wantCrit) { if (best.crit) res[2] += w * pp; }
        else res[best.tier - 1] += w * pp;
      }
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
export const topStep = list => (list ?? []).reduce((m, x) => Math.max(m, Number(x.n) || 0), 0);

/** "Empowered 2", "Enfeebled 1", or "" for no step. */
export const stepLabel = n => (n > 0 ? `Empowered ${n}` : n < 0 ? `Enfeebled ${-n}` : "");

/** Chance of a Critical: Doubles on a Tier 3, or a total 20 or more above the DC. */
export const critProb = (mod, dc = 13, boons = 0, banes = 0, state = "") => tierProbs(mod, dc, boons, banes, state, true)[2];
