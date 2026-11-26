// What an Action rolls and what its damage adds (the rules' Modifier Damage [Mod]):
//   Weapon (or a check of "weapon"): the Weapon Modifier, which is also added to the weapon's damage on Tiers 2 and 3.
//   Signature: the Signature Modifier, nothing added (only a [Mod] written on the card).
//   Power (trait key "magic"): the Power Modifier, nothing added.
//   Otherwise, an Attribute Action: the Attribute Modifier of its Body, Mind, Appeal or Instinct trait (or its check), nothing added.
// [Mod] on a card is always the Modifier used on the roll (src.mod).
import { TWOD12, checkAttr } from "./config.mjs";

/** s: the actor's system; it: the Action's system. { kind, attrKey, mod, label, attrMode: "all" | "t2" | "none" } (kind null: no roll). */
export function rollSource(s, it, pref = "") {   // pref (v0.0.520, B2-046): the Attribute the player chose, for an Action with two
  const src = rollSourceOf(s, it, pref);
  // v0.0.426 (the audit): a Structure card writes its [Mod] where it counts (cardgen keeps it), so nothing is added by the kind of roll; an NPC's
  // damage is written whole (the Bestiary; actions.mjs rollDamage adds nothing for an NPC), so its roll dialog and card show no Modifier either
  return (it?.structure || s?.modSource === "role") && src.kind ? { ...src, attrMode: "none" } : src;
}
function rollSourceOf(s, it, pref = "") {
  const traits = it?.traits ?? new Set(), has = k => traits.has?.(k) ?? false;
  const ca = checkAttr(it, s?.attributes ?? null, pref);
  const L = k => TWOD12.attributes[k] ?? "?";
  // v0.0.305 (pack MOD): a class's or a role's Modifiers come from no Attribute (modSource "class" / "role"): no attrKey, so "Body Rolls" don't reach them.
  const vals = s?.modSource === "class" || s?.modSource === "role";
  const pAttr = s?.powerAttribute ?? s?.magicAttribute ?? "";
  const pick = (key, mod) => vals ? { attrKey: "", mod: Number(mod) || 0, tail: "" } : { attrKey: key ?? "", mod: key ? mod : 0, tail: ` • ${L(key)}` };
  if (has("signature")) { const x = pick(s.signatureAttribute, s.signatureMod); return { kind: "signature", attrKey: x.attrKey, mod: x.mod, label: `Signature Modifier${x.tail}`, chip: "Signature Modifier", attrMode: "none", from: s.signatureFrom === "power" ? "power" : "weapon" }; }
  if (has("weapon")) { const x = pick(s.weaponAttribute, s.weaponMod); return { kind: "weapon", attrKey: x.attrKey, mod: x.mod, label: `Weapon Modifier${x.tail}`, chip: "Weapon Modifier", attrMode: "t2" }; }
  if (has("magic")) { const x = pick(pAttr, s.powerMod ?? s.magicMod); return { kind: "power", attrKey: x.attrKey, mod: x.mod, label: `Power Modifier${x.tail}`, chip: "Power Modifier", attrMode: "none" }; }
  // v0.0.520 (the cleanup audit, B2-010; book, Chapter 1, Check): an Action whose roll is a Check (Break Free's "Check" line, vs. the Action DC) is a
  // Check for every effect that names Checks, not an Attribute Action
  if (ca) return { kind: "attribute", attrKey: ca, mod: s?.attributes?.[ca] ?? 0, label: `${L(ca)} Check`, chip: L(ca), attrMode: "none", ...(it?.vs === "action" ? { check: true } : {}) };
  return { kind: null, attrKey: "", mod: null, label: "", chip: "", attrMode: "none" };
}

/** The lowest Tier on which the Attribute is added to the damage (Infinity: never). Old cards and callers pass isWeapon. */
export const attrFromTier = ctx => (ctx?.attrMode === "all" ? 1 : ctx?.attrMode === "t2" ? 2 : ctx?.attrMode === "none" ? Infinity : (ctx?.isWeapon ? 2 : Infinity));

/** The traits effects see for a roll: the Action's traits, the Attribute it rolls ("Body Rolls": Checks, Saves and Attribute Actions; pack MOD: not a Weapon,
 *  Power or Signature roll, which has no attrKey), and what kind of roll it is. */
export const nameKey = name => `__name:${String(name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
export function rollTraits(useTraits, src, name = "") {
  const out = new Set([...useTraits, "__action"]);
  if (name) out.add(nameKey(name));   // effects can ask for an Action by name ("your next Smite")
  if (src?.attrKey) out.add(src.attrKey);
  if (src?.kind === "attribute") out.add(src.check ? "__check" : "__attr");
  return out;
}

/** The DC of a Save an Action makes creatures roll (Saves in the rules): 11 + the Weapon, Power or Signature Modifier that sets it,
 *  11 + (half the Attribute, rounded up, + 1) for an Attribute Action, and 13 for an Action that rolls nothing. src: rollSource(). */
export function saveDcOf(src, attrs = null) {
  if (!src?.kind) return 13;
  if (src.kind === "attribute") return 11 + (Number(attrs?.[src.attrKey] ?? src.mod) || 0);   // the core rework A7: the Attribute DC, 11 + the Attribute
  return 11 + (Number(src.mod) || 0);
}
