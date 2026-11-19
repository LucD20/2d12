// Fists (v0.0.169): every creature has them, as a weapon item with the properties Barehanded, Melee and Non-threatening (Range 1).
// They are an ordinary weapon: while the creature has a free hand they count as a weapon it wields (next to any other weapon it holds),
// so every Weapon Action can use them. Non-threatening: they don't flank, unless a "Weapon property" setting says otherwise (Brawler).
import { handsUsed } from "./config.mjs";
import { allEffects } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
const F = "twod12";

export const isFists = w => !!w?.getFlag?.(F, "fists");
export const fistsOf = actor => (actor?.itemTypes?.weapon ?? []).find(isFists) ?? null;
/** Does the creature have a free hand? (Barehanded weapons use none; see handsUsed.) */
export const hasFreeHand = actor => handsUsed(actor) < 2;
/**
 * v0.0.207: the properties a creature's weapon loses from its "Weapon property" settings (Features, Talents, applied effects that work now):
 * Brawler, "Your Fists don't have the Non-threatening property". A Set of property keys.
 */
export function lostProps(actor, w) {
  const out = new Set();
  if (!actor || !w) return out;
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const p of e.getFlag?.(F, "propLoss") ?? []) if (p.which === "all" || (p.which === "fists" && isFists(w))) out.add(p.prop);
  }
  return out;
}
/** The weapons a Weapon Action can use: the wielded ones, plus Fists while there is a free hand. */
export function activeWeapons(actor) {
  const list = (actor?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !isFists(w));
  const fists = hasFreeHand(actor) ? fistsOf(actor) : null;
  return fists ? [...list, fists] : list;
}
/** The weapons ONE Action can use: its "Weapon used" (v0.0.207; Pummel: only the Fists, Leg Sweep: a kick) or the Fists Basic Action: only the Fists. */
export function weaponsFor(actor, item) {
  const use = item?.system?.weaponUse ?? "";
  if (use === "kick") { const f = fistsOf(actor); return f ? [f] : []; }   // a kick uses the Fists even with no free hand
  if (use === "fists" || item?.getFlag?.(F, "basic") === "fists") { const f = hasFreeHand(actor) ? fistsOf(actor) : null; return f ? [f] : []; }
  return activeWeapons(actor);
}
/**
 * v0.0.208: the weapons a Weapon Action can use with its traits: a [Melee] or [Ranged] Action needs that property (a Thrown weapon can be
 * thrown for [Ranged]), a [Shot] needs a Projectile weapon. The same filter as useAction (actions.mjs), for the sheet's hand buttons.
 */
export function weaponCandidates(actor, item) {
  const tr = item?.system?.traits, has = t => !!tr?.has?.(t);
  const need = has("weapon") ? ["melee", "ranged"].find(has) : null;
  let list = weaponsFor(actor, item).filter(w => !need || hasProp(w, need) || (need === "ranged" && hasProp(w, "thrown")));
  if (has("shot") && has("weapon")) list = list.filter(w => hasProp(w, "projectile"));
  if (has("gun") && has("weapon")) list = list.filter(w => hasProp(w, "firearm"));
  // v0.0.444 (Lucas, group 2): the card's own requirement counts (Darting Blade: a Light weapon)
  const needs = item?.system?.weaponNeeds;
  if (needs && has("weapon")) { const ok = list.filter(w => hasProp(w, needs)); if (ok.length) list = ok; }   // v0.0.453: none in hand: the others (the dialog warns)
  return list;
}
/** v0.0.208 (W): a weapon in hand comes before the Fists: the Fists are a choice only when no held weapon fits (the Fists Action uses them). */
export const heldFirst = list => { const held = (list ?? []).filter(w => !isFists(w)); return held.length ? held : (list ?? []); };
/** A weapon property, as the weapon's traits say. */
export const hasProp = (w, p) => !!w?.system?.traits?.has?.(p) || (isFists(w) && FISTS_TRAITS.includes(p));   // an older Fists item (before the update) has them too
/** Does this weapon threaten (flanking)? A Non-threatening weapon doesn't, unless a "Weapon property" setting of the creature removes it. */
export const weaponThreatens = (actor, w) => !hasProp(w, "nonthreatening") || lostProps(actor, w).has("nonthreatening");

/** The properties the Fists item must have (an older Fists item is brought up to date with them). */
export const FISTS_TRAITS = ["barehanded", "melee", "nonthreatening"];

/** The Fists weapon item, as embedded item data. */
export const fistsItemData = () => ({
  name: "Fists", type: "weapon", img: "icons/svg/combat.svg",
  system: { traits: [...FISTS_TRAITS], hands: 1, wielded: false, subtype: "Bl", range: "1", reach: 0,
    // v0.0.407 (Stage 0 in Foundry; book, Chapter 15; Lucas, 2026-11-12): Fists 0 / 2 / 1 + 1d4! (a weapon's die explodes)
    damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 0, die: "", mod: 2 }, t3: { count: 1, die: "d4", mod: 1 } } },
  flags: { [F]: { fists: true } }
});
