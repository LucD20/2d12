// The core rework batch 2 (Lucas, 2026-11-22; book, Chapter 2, Effect Timing): a card's Bloodied and Strained lines. Pure (the tests load it);
// ccdamage.mjs runs the lines it returns after a target's damage lands.
/** Pure (the core rework batch 2; book, Chapter 2, Effect Timing): the Bloodied / Strained lines that count for a target: written above the roll
 *  ("Before") if it already was so before this Action's damage (pre), after the Tiers if it is so now (now). Returns the lines' texts. */
export function stateLinesFor(lines, pre = {}, now = {}) {
  const L = lines ?? {}, out = [], has = k => String(L[k] ?? "").trim();
  if (has("bloodiedBefore") && pre.b) out.push(L.bloodiedBefore);
  if (has("strainedBefore") && pre.s) out.push(L.strainedBefore);
  if (has("bloodied") && now.b) out.push(L.bloodied);
  if (has("strained") && now.s) out.push(L.strained);
  return out;
}
