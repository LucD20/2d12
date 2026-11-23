// The core rework batch 2 (Lucas, 2026-11-22; book, Chapter 2, Effect Timing): a card's Bloodied and Strained lines. Pure (the tests load it);
// ccdamage.mjs runs the lines it returns after a target's damage lands.
/** Pure (the core rework batch 2; book, Chapter 2, Effect Timing): the Bloodied / Strained lines that count for a target: written above the roll
 *  ("Before") if it already was so before this Action's damage (pre), after the Tiers if it is so now (now). Returns the lines' texts. */
const tierOk = (t, tier) => {
  if (!(tier > 0)) return true;
  if (/^on a tier 3\b/i.test(t)) return tier === 3;
  if (/^on a tier 2 or 3\b/i.test(t)) return tier >= 2;
  if (/^on a tier 2\b/i.test(t)) return tier === 2;
  return true;
};
export function stateLinesFor(lines, pre = {}, now = {}, tier = 0) {
  const L = lines ?? {}, out = [], has = k => String(L[k] ?? "").trim();
  const add = k => { const t = has(k); if (t && tierOk(t, tier)) out.push(L[k]); };
  if (pre.b) add("bloodiedBefore");
  if (pre.s) add("strainedBefore");
  if (now.b) add("bloodied");
  if (now.s) add("strained");
  return out;
}
/** Pure (core rework batch 3, Drawing Light): if an active Bloodied / Strained line offers Sliding instead of Pulling (or Pushing), return "slid", else "". */
export function moveAltFor(lines, pre = {}, now = {}, tier = 0, moveKind = "") {
  if (!moveKind) return "";
  for (const t of stateLinesFor(lines, pre, now, tier)) {
    if (moveKind === "pulled" && /\bslide\b[\s\S]*\binstead of pull/i.test(t)) return "slid";
    if (moveKind === "pushed" && /\bslide\b[\s\S]*\binstead of push/i.test(t)) return "slid";
  }
  return "";
}
