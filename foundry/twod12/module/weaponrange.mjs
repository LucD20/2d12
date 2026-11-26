// Weapon Range (Round 10 of the rules). Every weapon has a Range, melee weapons included: "1", "1/2", "10/20/40"
// (normal / far: 1 bane / maximum: 2 banes; a single number has no far or maximum range).
//   - A melee weapon's Range: its Range, or 1 + its old extra Reach (weapons from before v0.0.122). Reach above 1 adds to every number.
//   - A ranged weapon's Range is its Range; a Thrown weapon has a Range in hand and a thrown Range.
//   - Long: 1 bane against adjacent creatures, and it doesn't threaten them.
// Pure: the tests load it.

const has = (w, t) => !!w?.system?.traits?.has?.(t);
const nums = text => String(text ?? "").split("/").map(x => Number(String(x).trim())).filter(n => Number.isFinite(n) && n > 0);

/** "1/2" + 1 -> "2/3". */
export function addToRange(text, n) {
  const r = nums(text);
  return r.length ? r.map(x => x + (Number(n) || 0)).join("/") : "";
}

/** The Ranges of a weapon for a creature with this Reach: { melee, ranged, thrown, long }. melee/ranged are Range texts ("" if it can't be used that way). */
export function weaponRanges(weapon, reach = 1) {
  const s = weapon?.system ?? {};
  const extra = Math.max(0, (Number(reach) || 1) - 1);
  const isRanged = has(weapon, "ranged"), thrown = has(weapon, "thrown");
  const meleeBase = has(weapon, "melee") || thrown ? (isRanged ? "" : (nums(s.range).length ? s.range : String(1 + (Number(s.reach) || 0)))) : "";
  return {
    melee: meleeBase ? addToRange(meleeBase, extra) : "",
    ranged: isRanged ? (nums(s.range).length ? s.range : "") : (thrown ? (nums(s.thrownRange).length ? s.thrownRange : "") : ""),
    thrown,
    long: has(weapon, "long")
  };
}

/** The normal and longest numbers of a Range text. */
export const rangeEnds = text => { const r = nums(text); return { normal: r[0] ?? 0, max: r.length ? r[r.length - 1] : 0 }; };

/**
 * How a Weapon Action is made with this weapon: { mode: "melee" | "ranged" | "", range, thrown, long }.
 * An Action with the Melee or Ranged trait asks for that use; otherwise the weapon decides, and a Thrown weapon is used in hand
 * when the target is within its melee Range and thrown when it is farther (squares unknown: in hand).
 */
export function weaponUse(weapon, actionTraits, reach = 1, squares = null) {
  const r = weaponRanges(weapon, reach), t = actionTraits ?? new Set();
  const melee = { mode: "melee", range: r.melee, thrown: false, long: r.long };
  const ranged = { mode: "ranged", range: r.ranged, thrown: r.thrown && !has(weapon, "ranged"), long: false };
  if (t.has?.("melee")) return r.melee ? melee : { ...melee, mode: "" };
  if (t.has?.("ranged")) return r.ranged ? ranged : { ...ranged, mode: "" };
  if (r.melee && !r.ranged) return melee;
  if (r.ranged && !r.melee) return ranged;
  if (r.melee && r.ranged) return Number.isFinite(squares) && squares > rangeEnds(r.melee).max ? ranged : melee;
  return { mode: "", range: "", thrown: false, long: false };
}

/**
 * v0.0.525 (the cleanup audit, B2-014; book, Charge: "stop on the first square from which the target is within the normal Range of the weapon you
 * attack with"): the ways a Charge's Basic Attack (1A) can be made, each with the normal Range the Charge stops at (pure). weapons: the creature's
 * weapons for the Basic Attack (a Thrown one twice: in hand and thrown); npcAttacks: an NPC's Basic attacks, whose distance is "reach" or a number
 * (they come first: an NPC attacks with them). Returns [{ key, label, normal }]; none: [] (the caller falls back on the creature's Reach).
 */
export function chargeAttacks({ weapons = [], npcAttacks = [], reach = 1 } = {}) {
  const R = Math.max(1, Number(reach) || 1), out = [];
  for (const a of npcAttacks ?? []) {
    const d = String(a?.system?.distance ?? a?.distance ?? "").trim(), n = /^(reach|weapon)?$/i.test(d) ? R : (nums(d)[0] ?? R);
    out.push({ key: `a:${a?.id ?? out.length}`, label: a?.name ?? "Basic attack", normal: n });
  }
  if (out.length) return out;
  for (const w of weapons ?? []) {
    const r = weaponRanges(w, R);
    if (r.melee) out.push({ key: `m:${w?.id ?? out.length}`, label: r.thrown ? `${w.name} (in hand)` : w.name, normal: rangeEnds(r.melee).normal });
    if (r.ranged) out.push({ key: `r:${w?.id ?? out.length}`, label: r.thrown ? `${w.name} (thrown)` : w.name, normal: rangeEnds(r.ranged).normal });
  }
  return out.filter(x => x.normal > 0);
}
/** v0.0.525 (B2-014): a choice is asked only when the ways differ in their normal Range (pure). */
export const chargeNeedsPick = list => new Set((list ?? []).map(x => x.normal)).size > 1;
