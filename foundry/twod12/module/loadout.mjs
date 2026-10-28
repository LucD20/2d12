// The Items tab's loadout (v0.0.139): where each weapon and armor is, and the hand and armor slots shown above the lists.
//   Weapons: Dropped, Worn (on you, ready to draw), In one hand (1H), In both hands (2H). A Barehanded weapon (Fists) uses no hand.
//   Armor: Dropped, Carried (in the pack), Worn. One armor is worn at a time.
// Pure, so the tests can check it; the sheet (actor-sheets.mjs) builds its rows and slots from it.

export const WEAPON_WHERE = { dropped: "Dropped", worn: "Worn", "1h": "One hand", "2h": "Both hands" };
export const ARMOR_WHERE = { dropped: "Dropped", carried: "Carried", worn: "Worn" };

const traitsOf = it => it?.system?.traits ?? new Set();
export const usesNoHand = w => !!traitsOf(w).has?.("barehanded");

/** Where a weapon is. */
export function weaponWhere(w) {
  const s = w?.system ?? {};
  if (usesNoHand(w)) return "none";
  if (s.dropped && !s.wielded) return "dropped";
  if (s.wielded) return (Number(s.hands) || 1) >= 2 ? "2h" : "1h";
  return "worn";
}

/** Where an armor is. */
export function armorWhere(a) {
  const s = a?.system ?? {};
  if (s.worn) return "worn";
  return s.dropped ? "dropped" : "carried";
}

/** The item update that puts a weapon there. */
export function weaponMove(where) {
  if (where === "dropped") return { "system.wielded": false, "system.dropped": true };
  if (where === "1h") return { "system.wielded": true, "system.hands": 1, "system.dropped": false };
  if (where === "2h") return { "system.wielded": true, "system.hands": 2, "system.dropped": false };
  return { "system.wielded": false, "system.dropped": false };   // worn
}

/** The item update that puts an armor there (wearing it takes the others off: armor.mjs). */
export function armorMove(where) {
  if (where === "dropped") return { "system.worn": false, "system.dropped": true };
  if (where === "worn") return { "system.worn": true, "system.dropped": false };
  return { "system.worn": false, "system.dropped": false };   // carried
}

/** How many hands a weapon there takes. */
export const handsFor = where => (where === "2h" ? 2 : where === "1h" ? 1 : 0);

/** The hands the other weapons use (not this one), to see whether a move fits. */
export function otherHands(weapons, id) {
  return (weapons ?? []).filter(w => w.id !== id && !usesNoHand(w) && w.system.wielded).reduce((n, w) => n + ((Number(w.system.hands) || 1) >= 2 ? 2 : 1), 0);
}

/** The row's one-click move: Draw (2H for a Two-handed weapon), Stow, Pick up; armor Put on, Take off, Pick up. */
export function weaponAction(w) {
  const where = weaponWhere(w);
  if (where === "none") return null;
  if (where === "dropped") return { where: "worn", label: "Pick up" };
  if (where === "worn") return traitsOf(w).has?.("twohanded") ? { where: "2h", label: "Draw 2H", primary: true } : { where: "1h", label: "Draw", primary: true };
  return { where: "worn", label: "Stow" };
}
export function armorAction(a) {
  const where = armorWhere(a);
  if (where === "dropped") return { where: "carried", label: "Pick up" };
  if (where === "carried") return { where: "worn", label: "Put on", primary: true };
  return { where: "carried", label: "Take off" };
}

/** A weapon's damage as three small Tier boxes. */
export function tierBoxes(w) {
  const d = w?.system?.damage ?? {};
  const txt = x => { if (!x) return "0"; const dice = x.die ? `${x.count}${x.die}` : ""; return (dice + (x.mod ? `${dice && x.mod > 0 ? "+" : ""}${x.mod}` : "")) || "0"; };
  return [1, 2, 3].map(n => ({ l: `T${n}`, v: txt(d[`t${n}`]) }));
}

/**
 * The hand slots: a two-handed grip is one wide tile; otherwise the first weapon in hand is the main hand, the second the off hand,
 * and an empty hand is a "Free hand" tile. [{ label, id?, both?, free? }]
 */
export function handSlots(weapons) {
  const held = (weapons ?? []).filter(w => !usesNoHand(w) && w.system.wielded);
  const both = held.find(w => (Number(w.system.hands) || 1) >= 2);
  if (both) return [{ label: "Both hands", id: both.id, both: true }];
  const one = held.slice(0, 2);
  return ["Main hand", "Off hand"].map((label, k) => (one[k] ? { label, id: one[k].id } : { label, free: true }));
}

/** v0.0.141: the row's "where" buttons. Weapons: Dropped / Worn / 1H / 2H; armor: Dropped / Carried / Worn. [{ v, l, tip, on, drop }] */
const SEG = {
  weapon: [["dropped", "Dropped", "On the ground"], ["worn", "Worn", "On you, ready to draw"], ["1h", "1H", "In one hand"], ["2h", "2H", "In both hands"]],
  armor: [["dropped", "Dropped", "On the ground"], ["carried", "Carried", "In your pack"], ["worn", "Worn", "Worn: its Armor and Ward count"]]
};
export function whereButtons(kind, where) {
  return (SEG[kind] ?? []).map(([v, l, tip]) => ({ v, l, tip, on: v === where, drop: v === "dropped" }));
}
