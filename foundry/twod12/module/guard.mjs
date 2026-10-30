// Guard (v0.0.181; book, Chapter 4): a buffer written Guard N. It takes damage before your Health (Body or Mind alike), after any
// damage reduction; damage it takes isn't damage you take (no thresholds, no triggers). It doesn't stack (keep the higher), can't be
// healed and ends with the encounter. Pure: the tests load it.

/**
 * Damage buckets { B: {l, n}, M: {l, n} } against a Guard value: the Guard takes from them in order (Body lethal, Body nonlethal,
 * Mind lethal, Mind nonlethal). Returns { a: what is left for the Health, taken, guard: the Guard left }.
 */
export function absorbGuard(guard, a) {
  let g = Math.max(0, Math.floor(Number(guard) || 0)), taken = 0;
  const out = { B: { ...a.B }, M: { ...a.M } };
  for (const [p, k] of [["B", "l"], ["B", "n"], ["M", "l"], ["M", "n"]]) {
    const n = Math.min(g, out[p][k] || 0);
    out[p][k] = (out[p][k] || 0) - n; g -= n; taken += n;
  }
  return { a: out, taken, guard: g };
}

/** Gaining Guard: the higher value is kept (Stacking). */
export const gainGuard = (current, value) => Math.max(Math.max(0, Number(current) || 0), Math.max(0, Math.floor(Number(value) || 0)));
