// Free hands (v0.0.138): an Action that needs a free hand (the Handle trait, or "free hand" in its Requirements, such as Reload)
// asks to use Release first when both hands are full. With the world setting "Enforce hand requirement" off, it only warns.
import { handsUsed } from "./config.mjs";
import { esc } from "./util.mjs";

/** Does this Action need a free hand? */
export const needsFreeHand = item => !!(item?.system?.traits?.has?.("handle") || /free hand/i.test(String(item?.system?.requirements ?? "")));

/** What Release can do with the weapons in hand: a two-handed grip becomes one hand, or the weapon is dropped. */
export function releaseOptions(actor) {
  const held = (actor?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !w.system.traits?.has?.("barehanded"));
  return held.flatMap(w => [
    ...(w.system.hands >= 2 ? [{ action: `one:${w.id}`, label: `Hold ${w.name} with one hand`, icon: "fa-solid fa-hand" }] : []),
    { action: `drop:${w.id}`, label: `Drop ${w.name}`, icon: "fa-solid fa-arrow-down" }
  ]);
}

/** Apply a Release choice ("one:<id>" or "drop:<id>") and say it in the chat. */
export async function applyRelease(actor, pick) {
  const [kind, id] = String(pick).split(":"), w = actor.items.get(id);
  if (!w) return false;
  if (kind === "one") await w.update({ "system.hands": 1 }); else await w.update({ "system.wielded": false, "system.dropped": true });   // dropped on the ground (v0.0.139)
  const text = kind === "one" ? `holds <b>${esc(w.name)}</b> with one hand` : `drops <b>${esc(w.name)}</b>`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<div class="twod12 chat note"><i class="fa-solid fa-hand"></i> <b>Release</b> (0 AP): ${esc(actor.name)} ${text}.</div>` });
  return true;
}

let enforce = () => true;
/** The world setting (registered at init). */
export function registerHandSetting() {
  game.settings.register("twod12", "enforceHands", {
    name: "Enforce hand requirement", hint: "Actions that need a free hand (Handle, Reload...) can't be used with both hands full: the sheet offers to use Release first. Off: a warning only, and the Action is used anyway.",
    scope: "world", config: true, type: Boolean, default: true
  });
  enforce = () => { try { return game.settings.get("twod12", "enforceHands") !== false; } catch (e) { return true; } };
}

/**
 * Before taking a weapon in hand (the Items tab): true if it fits. With the other weapons using too many hands, offer to Release one
 * of them first (or, not enforced, only warn). need: the hands it will use.
 */
export async function ensureHandsFor(actor, weapon, need) {
  const others = (actor?.itemTypes?.weapon ?? []).filter(w => w.id !== weapon.id && w.system.wielded && !w.system.traits?.has?.("barehanded"));
  const used = others.reduce((n, w) => n + ((Number(w.system.hands) || 1) >= 2 ? 2 : 1), 0);
  if (used + need <= 2) return true;
  if (!enforce()) { ui.notifications.warn(`${actor.name} has no free hand for ${weapon.name} (the hand requirement isn't enforced: it is taken anyway).`); return true; }
  const buttons = [...releaseOptions({ itemTypes: { weapon: others } }), { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }];
  const pick = await foundry.applications.api.DialogV2.wait({
    window: { title: `${weapon.name}: no free hand` }, rejectClose: false, buttons,
    content: `<p><b>${esc(actor.name)}</b> needs ${need === 2 ? "both hands" : "a free hand"} for <b>${esc(weapon.name)}</b>.</p><p>Use the <b>Release</b> Action first (0 AP)? Pick what to let go of:</p>`
  });
  if (!pick || pick === "cancel") return false;
  await applyRelease(actor, pick);
  const after = (actor.itemTypes.weapon ?? []).filter(w => w.id !== weapon.id && w.system.wielded && !w.system.traits?.has?.("barehanded")).reduce((n, w) => n + ((Number(w.system.hands) || 1) >= 2 ? 2 : 1), 0);
  if (after + need > 2) { ui.notifications.warn(`${actor.name} still has no room for ${weapon.name}.`); return false; }
  return true;
}

/** Before an Action that needs a free hand: true to go on, false to stop. Both hands full: offer Release (or, not enforced, only warn). */
export async function ensureFreeHand(actor, item) {
  if (!needsFreeHand(item) || handsUsed(actor) < 2) return true;
  if (!enforce()) { ui.notifications.warn(`${actor.name} has no free hand for ${item.name} (the hand requirement isn't enforced: it is used anyway).`); return true; }
  const buttons = [...releaseOptions(actor), { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }];
  const pick = await foundry.applications.api.DialogV2.wait({
    window: { title: `${item.name}: no free hand` }, rejectClose: false, buttons,
    content: `<p><b>${esc(actor.name)}</b> doesn't have a free hand for <b>${esc(item.name)}</b>.</p><p>Use the <b>Release</b> Action first (0 AP)? Pick what to let go of:</p>`
  });
  if (!pick || pick === "cancel") return false;
  await applyRelease(actor, pick);
  return handsUsed(actor) < 2;
}
