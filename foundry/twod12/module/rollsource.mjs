// What an Action rolls and what its damage adds (the rules' Modifier Damage [Mod]):
//   Weapon (or a check of "weapon"): the Weapon Modifier, which is also added to the weapon's damage on Tiers 2 and 3.
//   Signature: the Signature Modifier, nothing added (only a [Mod] written on the card).
//   Power (trait key "magic"): the Power Modifier, nothing added.
//   Otherwise, an Attribute Action: the Attribute Modifier of its Body, Mind, Appeal or Instinct trait (or its check), nothing added.
// [Mod] on a card is always the Modifier used on the roll (src.mod).
import { TWOD12, checkAttr } from "./config.mjs";
import { modOf } from "./modifiers.mjs";

/** s: the actor's system; it: the Action's system. { kind, attrKey, mod, label, attrMode: "all" | "t2" | "none" } (kind null: no roll). */
export function rollSource(s, it) {
  const traits = it?.traits ?? new Set(), has = k => traits.has?.(k) ?? false;
  const ca = checkAttr(it, s?.attributes ?? null);
  const L = k => TWOD12.attributes[k] ?? "?";
  if (has("signature")) return { kind: "signature", attrKey: s.signatureAttribute ?? "", mod: s.signatureAttribute ? s.signatureMod : 0, label: `Signature Modifier \u2022 ${L(s.signatureAttribute)}`, chip: "Signature Modifier", attrMode: "none", from: s.signatureFrom === "power" ? "power" : "weapon" };
  if (has("weapon")) return { kind: "weapon", attrKey: s.weaponAttribute ?? "", mod: s.weaponAttribute ? s.weaponMod : 0, label: `Weapon Modifier \u2022 ${L(s.weaponAttribute)}`, chip: "Weapon Modifier", attrMode: "t2" };
  if (has("magic")) return { kind: "power", attrKey: s.powerAttribute ?? s.magicAttribute ?? "", mod: (s.powerAttribute ?? s.magicAttribute) ? (s.powerMod ?? s.magicMod) : 0, label: `Power Modifier \u2022 ${L(s.powerAttribute ?? s.magicAttribute)}`, chip: "Power Modifier", attrMode: "none" };
  if (ca) return { kind: "attribute", attrKey: ca, mod: s?.attributes?.[ca] ?? 0, label: `${L(ca)} Check`, chip: L(ca), attrMode: "none" };
  return { kind: null, attrKey: "", mod: null, label: "", chip: "", attrMode: "none" };
}

/** The lowest Tier on which the Attribute is added to the damage (Infinity: never). Old cards and callers pass isWeapon. */
export const attrFromTier = ctx => (ctx?.attrMode === "all" ? 1 : ctx?.attrMode === "t2" ? 2 : ctx?.attrMode === "none" ? Infinity : (ctx?.isWeapon ? 2 : Infinity));

/** The traits effects see for a roll: the Action's traits, the Attribute behind its Modifier ("Body Rolls"), and what kind of roll it is. */
export const nameKey = name => `__name:${String(name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
export function rollTraits(useTraits, src, name = "") {
  const out = new Set([...useTraits, "__action"]);
  if (name) out.add(nameKey(name));   // effects can ask for an Action by name ("your next Smite")
  if (src?.attrKey) out.add(src.attrKey);
  if (src?.kind === "attribute") out.add("__attr");
  return out;
}

/** The DC of a Save an Action makes creatures roll (Saves in the rules): 11 + the Weapon, Power or Signature Modifier that sets it,
 *  11 + (half the Attribute, rounded up, + 1) for an Attribute Action, and 13 for an Action that rolls nothing. src: rollSource(). */
export function saveDcOf(src, attrs = null) {
  if (!src?.kind) return 13;
  if (src.kind === "attribute") return 11 + modOf(attrs?.[src.attrKey] ?? src.mod ?? 0);
  return 11 + (Number(src.mod) || 0);
}
