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
export function weaponMove(where, hand = "") {
  if (where === "dropped") return { "system.wielded": false, "system.dropped": true };
  if (where === "1h") return { "system.wielded": true, "system.hands": 1, "system.dropped": false, ...(hand ? { "system.hand": hand } : {}) };   // v0.0.208: and the hand
  if (where === "2h") return { "system.wielded": true, "system.hands": 2, "system.dropped": false, "system.hand": "" };
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
 * The hand slots: a two-handed grip is one wide tile; otherwise the main hand and the off hand. v0.0.208 (W): a weapon remembers its hand
 * (system.hand "main" / "off"); one that doesn't say takes the first free hand, in order. An empty hand is a "Free hand" tile.
 * [{ label, hand, id?, both?, free? }]
 */
export function handSlots(weapons) {
  const held = (weapons ?? []).filter(w => !usesNoHand(w) && w.system.wielded);
  const both = held.find(w => (Number(w.system.hands) || 1) >= 2);
  if (both) return [{ label: "Both hands", hand: "both", id: both.id, both: true }];
  const main = held.find(w => w.system.hand === "main") ?? null;
  const off = held.find(w => w !== main && w.system.hand === "off") ?? null;
  const rest = held.filter(w => w !== main && w !== off);
  const inHand = { main: main ?? rest.shift() ?? null, off: off ?? rest.shift() ?? null };
  return [["Main hand", "main"], ["Off hand", "off"]].map(([label, hand]) => (inHand[hand] ? { label, hand, id: inHand[hand].id } : { label, hand, free: true }));
}

/** v0.0.208: the hand a one-handed weapon goes into when it is drawn (the main hand first), not counting the weapon itself. */
export function freeHandFor(weapons, id) {
  const slots = handSlots((weapons ?? []).filter(w => w.id !== id));
  return slots.find(s => s.free)?.hand ?? "main";
}

/** v0.0.208: the hand a weapon is in ("main", "off", "both"), or "" when it is not in hand. */
export const handOf = (weapons, id) => handSlots(weapons).find(s => s.id === id)?.hand ?? "";
export const HAND_LABEL = { main: "Main hand", off: "Off hand", both: "Both hands" };

/**
 * v0.0.208 (W, Lucas): the use buttons of a [Weapon] Action, by hand, instead of the "Which weapon?" window. fits: the ids of the weapons
 * this Action can use. A two-handed grip that fits: one wide "2H" button. Two one-handed weapons: "M" and "O", a hand whose weapon doesn't
 * fit greyed (off). Anything else (one weapon, nothing in hand): null, the usual single button. [{ hand, label, id, name, off, wide, tip }]
 */
/** v0.0.209 (Lucas, test of v0.0.208): the button of an Action tied to one weapon (a Weapon Technique): the hand that holds it; not in hand: null. */
export function handButtonsFor(weapons, id) {
  const h = handOf(weapons, id), name = (weapons ?? []).find(w => w.id === id)?.name ?? "";
  if (!h) return null;
  return [{ hand: h, label: h === "both" ? "2H" : h === "main" ? "M" : "O", id, name, off: false, wide: h === "both", tip: `${HAND_LABEL[h]}: ${name}` }];
}
/** v0.0.209: the Fists' buttons: one for each free hand (v0.0.210: none free: both hands greyed). */
export function freeHandButtons(weapons, fistsId, name = "Fists") {
  if (!fistsId) return null;
  const slots = handSlots(weapons), free = slots.filter(s => s.free);
  // v0.0.210 (Lucas): no free hand: both hands greyed, with what holds them (Release, 0 AP, frees one)
  if (!free.length) return slots[0]?.both
    ? ["main", "off"].map(h => ({ hand: h, label: h === "main" ? "M" : "O", id: fistsId, name, off: true, wide: false, tip: `${HAND_LABEL[h]}: ${(weapons ?? []).find(w => w.id === slots[0].id)?.name ?? ""} (both hands): no free hand for ${name} (Release first, 0 AP)` }))
    : slots.map(s => ({ hand: s.hand, label: s.hand === "main" ? "M" : "O", id: fistsId, name, off: true, wide: false, tip: `${HAND_LABEL[s.hand]}: ${(weapons ?? []).find(w => w.id === s.id)?.name ?? ""}: no free hand for ${name} (Release first, 0 AP)` }));
  return free.map(s => ({ hand: s.hand, label: s.hand === "main" ? "M" : "O", id: fistsId, name, off: false, wide: false, tip: `${HAND_LABEL[s.hand]} (free): ${name}` }));
}
export function useButtons(weapons, fits) {
  const slots = handSlots(weapons), name = id => (weapons ?? []).find(w => w.id === id)?.name ?? "";
  if (slots[0]?.both) return fits.has(slots[0].id) ? [{ hand: "both", label: "2H", id: slots[0].id, name: name(slots[0].id), off: false, wide: true, tip: `Both hands: ${name(slots[0].id)}` }] : null;
  if (slots.some(s => s.free)) return null;
  const out = slots.map(s => ({ hand: s.hand, label: s.hand === "main" ? "M" : "O", id: s.id, name: name(s.id), off: !fits.has(s.id), wide: false }));
  if (out.every(b => b.off)) return null;
  return out.map(b => ({ ...b, tip: b.off ? `${HAND_LABEL[b.hand]}: ${b.name} can't be used for this Action` : `${HAND_LABEL[b.hand]}: ${b.name}` }));
}

/** v0.0.141: the row's "where" buttons. Weapons: Dropped / Worn / 1H / 2H; armor: Dropped / Carried / Worn. [{ v, l, tip, on, drop }] */
const SEG = {
  weapon: [["dropped", "Dropped", "On the ground"], ["worn", "Worn", "On you, ready to draw"], ["1h", "1H", "In one hand"], ["2h", "2H", "In both hands"]],
  armor: [["dropped", "Dropped", "On the ground"], ["carried", "Carried", "In your pack"], ["worn", "Worn", "Worn: its Armor and Ward count"]]
};
export function whereButtons(kind, where) {
  return (SEG[kind] ?? []).map(([v, l, tip]) => ({ v, l, tip, on: v === where, drop: v === "dropped" }));
}
