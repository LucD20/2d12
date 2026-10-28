// Armor items: a creature wears one at a time (wearing another takes the first off). The sheet's Wear switch and the item's Worn box both use this.
const F = "twod12";

/** Wear this armor (or take it off with worn = false); any other worn armor of its owner is taken off. */
export async function setWorn(armor, worn = true) {
  const actor = armor?.parent;
  if (!actor) return armor?.update({ "system.worn": !!worn });
  const updates = actor.itemTypes.armor.filter(a => a.id !== armor.id && a.system.worn && worn).map(a => ({ _id: a.id, "system.worn": false }));
  updates.push({ _id: armor.id, "system.worn": !!worn });
  return actor.updateEmbeddedDocuments("Item", updates);
}

export function registerArmorHooks() {
  // v0.0.139: taking a weapon in hand or putting an armor on picks it up (it is no longer Dropped), however it is changed.
  Hooks.on("preUpdateItem", (item, changes) => {
    if (!["weapon", "armor"].includes(item.type) || !item.system.dropped) return;
    const sys = changes?.system ?? {};
    if (sys.wielded === true || sys.worn === true || changes?.["system.wielded"] === true || changes?.["system.worn"] === true) foundry.utils.setProperty(changes, "system.dropped", false);
  });
  // Ticking Worn on an armor's own sheet: take the others off.
  Hooks.on("updateItem", (item, changes, options, userId) => {
    if (userId !== game.user.id || item.type !== "armor" || !item.parent || changes?.system?.worn !== true) return;
    const others = item.parent.itemTypes.armor.filter(a => a.id !== item.id && a.system.worn).map(a => ({ _id: a.id, "system.worn": false }));
    if (others.length) item.parent.updateEmbeddedDocuments("Item", others);
  });
}
export { F };
