// Fists (v0.0.169): every creature has them, as a weapon item with the properties Barehanded, Melee and Non-threatening (Range 1).
// They are an ordinary weapon: while the creature has a free hand they count as a weapon it wields (next to any other weapon it holds),
// so every Weapon Action can use them. Non-threatening: they don't flank, unless a feature says otherwise (Brawler).
import { handsUsed } from "./config.mjs";
const F = "twod12";

export const isFists = w => !!w?.getFlag?.(F, "fists");
export const fistsOf = actor => (actor?.itemTypes?.weapon ?? []).find(isFists) ?? null;
/** Does the creature have a free hand? (Barehanded weapons use none; see handsUsed.) */
export const hasFreeHand = actor => handsUsed(actor) < 2;
/** A Talent or Feature that lets Fists threaten (Brawler: "Your Fists don't have the Non-threatening property"). The old flag fistsWeapon counts too. */
export const fistsThreaten = actor => [...(actor?.itemTypes?.talent ?? []), ...(actor?.itemTypes?.feature ?? [])].some(t => t.getFlag?.(F, "fistsThreaten") || t.getFlag?.(F, "fistsWeapon"));
/** The weapons a Weapon Action can use: the wielded ones, plus Fists while there is a free hand. */
export function activeWeapons(actor) {
  const list = (actor?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !isFists(w));
  const fists = hasFreeHand(actor) ? fistsOf(actor) : null;
  return fists ? [...list, fists] : list;
}
/** The weapons ONE Action can use: a Fists Action (the Fists card, Pummel and their Techniques) uses only the Fists. */
export function weaponsFor(actor, item) {
  if (item?.getFlag?.(F, "basic") === "fists" || item?.getFlag?.(F, "fistsOnly")) { const f = hasFreeHand(actor) ? fistsOf(actor) : null; return f ? [f] : []; }
  return activeWeapons(actor);
}
/** A weapon property, as the weapon's traits say. */
export const hasProp = (w, p) => !!w?.system?.traits?.has?.(p) || (isFists(w) && FISTS_TRAITS.includes(p));   // an older Fists item (before the update) has them too
/** Does this weapon threaten (flanking)? A Non-threatening weapon doesn't, unless the creature has a feature that says otherwise. */
export const weaponThreatens = (actor, w) => !hasProp(w, "nonthreatening") || (isFists(w) && fistsThreaten(actor));

/** The properties the Fists item must have (an older Fists item is brought up to date with them). */
export const FISTS_TRAITS = ["barehanded", "melee", "nonthreatening"];

/** The Fists weapon item, as embedded item data. */
export const fistsItemData = () => ({
  name: "Fists", type: "weapon", img: "icons/svg/combat.svg",
  system: { traits: [...FISTS_TRAITS], hands: 1, wielded: false, subtype: "Bl", range: "1", reach: 0,
    damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 0, die: "", mod: 1 }, t3: { count: 1, die: "d4", mod: 0 } } },
  flags: { [F]: { fists: true } }
});
