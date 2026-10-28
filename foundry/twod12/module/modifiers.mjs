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
