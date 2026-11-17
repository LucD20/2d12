// Guard (v0.0.181; book, Chapter 4): a buffer written Guard N. It takes damage before your Health (Vigor or Resolve alike), after any
// damage reduction; damage it takes isn't damage you take (no thresholds, no triggers). It doesn't stack (keep the higher), can't be
// healed and ends with the encounter. Pure: the tests load it.
// v0.0.243 (pack R; book, Unspent AP): each AP kept at the end of a turn is Guard 2 / 3 / 4 by Stage (system.apGuard): it adds to the other
// Guard, damage takes it first, and it ends when the AP are regained (combat.mjs); a kept AP that pays a Reaction loses its Guard.
import { TWOD12 } from "./config.mjs";

/** The Guard one unspent AP gives at a Stage (0, 1, 2, 3; v0.0.407): 2 / 2 / 3 / 4. */
export const guardPerAP = stage => TWOD12.guardPerAp[Math.min(3, Math.max(0, Math.trunc(Number(stage)) || 0))];
/** The Guard of the AP kept at the end of a turn. */
export const apGuardOf = (keptAp, stage) => Math.max(0, Math.trunc(Number(keptAp)) || 0) * guardPerAP(stage);
/** A kept AP paid for a Reaction: its Guard goes (one AP's worth per AP, never under 0). */
export const apGuardAfterReaction = (apGuard, apSpent, stage) => Math.max(0, (Math.max(0, Number(apGuard) || 0)) - Math.max(0, Math.trunc(Number(apSpent)) || 0) * guardPerAP(stage));

/**
 * Damage buckets { B: {l, n}, M: {l, n} } against a Guard value: the Guard takes from them in order (Vigor lethal, Vigor nonlethal,
 * Resolve lethal, Resolve nonlethal). The Guard from unspent AP (apGuard) is taken before the other Guard.
 * Returns { a: what is left for the Health, taken (both Guards together), guard: the Guard left, apGuard: the AP Guard left, takenAp }.
 */
export function absorbGuard(guard, a, apGuard = 0, first = "B") {   // v0.0.283: first: the pool the Guard takes first (the damaged creature's choice, Ch. 4)
  let g = Math.max(0, Math.floor(Number(guard) || 0)), ag = Math.max(0, Math.floor(Number(apGuard) || 0)), taken = 0, takenAp = 0;
  const out = { B: { ...a.B }, M: { ...a.M } };
  const order = first === "M" ? [["M", "l"], ["M", "n"], ["B", "l"], ["B", "n"]] : [["B", "l"], ["B", "n"], ["M", "l"], ["M", "n"]];
  for (const [p, k] of order) {
    const fromAp = Math.min(ag, out[p][k] || 0);
    out[p][k] = (out[p][k] || 0) - fromAp; ag -= fromAp; takenAp += fromAp;
    const n = Math.min(g, out[p][k] || 0);
    out[p][k] = (out[p][k] || 0) - n; g -= n; taken += n;
  }
  return { a: out, taken: taken + takenAp, takenAp, guard: g, apGuard: ag };
}

/** Gaining Guard: the higher value is kept (Stacking). */
export const gainGuard = (current, value) => Math.max(Math.max(0, Number(current) || 0), Math.max(0, Math.floor(Number(value) || 0)));

/** v0.0.182: what the Guard did, for the damage line: "12 − Guard 5 = " before the damage, and "(Guard 3 left)" after it. */
// v0.0.255 (Lucas): a reduction (Shield of Faith) shows on the line like the Guard: "12 − reduction 7 − Guard 5 = 0"
export const guardBefore = (total, taken, reduced = 0) => (taken || reduced ? `${total}${reduced ? ` \u2212 reduction ${reduced}` : ""}${taken ? ` \u2212 Guard ${taken}` : ""} = ` : "");
export const guardAfter = (taken, left, reduced = 0, reduceLeft = 0) => (taken || reduced ? ` <small>(${[reduced ? (reduceLeft ? `reduction ${reduceLeft} left` : "the reduction is spent") : "", taken ? (left ? `Guard ${left} left` : "the Guard ends") : ""].filter(Boolean).join("; ")})</small>` : "");
