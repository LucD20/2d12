// The Weapon, Power and Signature Modifiers of a character (Round 10 of the rules).
// Each Modifier uses the higher of its class's two Attributes (÷ 2 + 1, rounded up); the two never use the same Attribute:
// when one Attribute is the higher for both, the Modifier the player gave priority keeps it and the other uses its next option.
// The Signature Modifier is the higher of the two (ties: the priority one). Pure: the tests load it.

export const modOf = v => Math.ceil((Number(v) || 0) / 2) + 1;

/**
 * attrs: { body, mind, appeal, instinct }; weaponKeys / powerKeys: the class's lists; prefer: "weapon" or "power" (which keeps a shared Attribute).
 * Returns { weapon: {key, value, mod}, power: {key, value, mod}, signature: {key, value, mod, from}, conflict }.
 * A list with nothing in it gives no key (and a Modifier from 0).
 */
export function classModifiers(attrs, weaponKeys, powerKeys, prefer = "weapon") {
  const W = [...(weaponKeys ?? [])].filter(Boolean), P = [...(powerKeys ?? [])].filter(Boolean);
  const val = k => (k ? Number(attrs?.[k]) || 0 : 0);
  const best = list => list.reduce((b, k) => (b === null || val(k) > val(b) ? k : b), null);
  let w = best(W), p = best(P), conflict = false;
  if (w && p && w === p) {
    // Both want the same Attribute: try each way and keep the one the priority asks for; if a list has only that Attribute, it stays shared.
    const otherW = best(W.filter(k => k !== w)), otherP = best(P.filter(k => k !== p));
    if (otherW || otherP) {
      conflict = true;
      if (prefer === "power") { if (otherW) w = otherW; else p = otherP; }
      else { if (otherP) p = otherP; else w = otherW; }
    }
  }
  const pack = k => ({ key: k ?? "", value: val(k), mod: modOf(val(k)) });
  const weapon = pack(w), power = pack(p);
  const fromPower = power.mod > weapon.mod || (power.mod === weapon.mod && prefer === "power" && !!power.key);
  const sig = fromPower ? power : weapon;
  return { weapon, power, signature: { ...sig, from: fromPower ? "power" : "weapon" }, conflict };
}

/**
 * Pack MOD (v0.0.305; book, Chapter 5, Weapon, Power and Signature Modifiers): the Modifiers are class values, not Attributes.
 * high / low: the class's two values (+2 and +1); order: "either" (the player chooses: lead), "weapon" or "power" (the class fixes it);
 * lead: the player's choice for an "either" class, and the side a tie of the Signature Modifier goes to; stage2: the Modifier that took
 * Stage 2's +1 ("" = the lead one); stage: 1 to 3 (Stage 2 +1 to one, Stage 3 +1 to both, never above cap).
 * Returns { weapon, power, signature, from, weaponFirst }.
 */
export function classTrack({ high = 2, low = 1, order = "either", lead = "weapon", stage2 = "", stage = 1, cap = 4 } = {}) {
  const weaponFirst = order === "weapon" || (order !== "power" && lead !== "power");
  let w = Number(weaponFirst ? high : low) || 0, p = Number(weaponFirst ? low : high) || 0;
  if (stage >= 2) { if ((stage2 || (weaponFirst ? "weapon" : "power")) === "power") p += 1; else w += 1; }
  if (stage >= 3) { w += 1; p += 1; }
  w = Math.min(cap, w); p = Math.min(cap, p);
  const from = p > w || (p === w && lead === "power") ? "power" : "weapon";
  return { weapon: w, power: p, signature: from === "power" ? p : w, from, weaponFirst };
}

/** The Bestiary (pack MOD): an NPC's Modifiers are its role's, [lead, other]; lead: "weapon" or "power". */
export function npcMods(pair, lead = "weapon") {
  const [hi, lo] = (pair ?? [2, 1]).map(n => Number(n) || 0);
  const w = lead === "power" ? lo : hi, p = lead === "power" ? hi : lo;
  const from = p > w ? "power" : "weapon";
  return { weapon: w, power: p, signature: Math.max(w, p), from };
}
