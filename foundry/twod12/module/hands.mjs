// Free hands (v0.0.138): an Action that needs a free hand (the Handle trait, or "free hand" in its Requirements, such as Reload)
// asks to use Release first when both hands are full. With the world setting "Enforce hand requirement" off, it only warns.
import { handsUsed } from "./config.mjs";
import { handSlots } from "./loadout.mjs";
import { esc } from "./util.mjs";

/** Does this Action need a free hand? */
export const needsFreeHand = item => !!(item?.system?.traits?.has?.("handle") || /free hand|hand free/i.test(String(item?.system?.requirements ?? "")));   // v0.0.412: "at least one hand free" (Seizing Cut)

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
  const { sysLine } = await import("./sysmsg.mjs");   // v0.0.289: the system's line (touched by the Hands tiles)
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand", `<b>Release</b> (0 AP): ${esc(actor.name)} ${text}.`) });
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
/** v0.0.415 (pack CL): a choice among { action, label } buttons in the pick window (was DialogV2.wait). Resolves the action, or null. */
export async function pickButtons(o) {
  const { pickOne } = await import("./pickwindow.mjs");
  const opts = (o.buttons ?? []).filter(b => b.action !== "cancel").map(b => {
    const act = String(b.action ?? "");
    const sub = b.sub ?? (act.startsWith("one:") ? "Keep in one hand · free the other" : act.startsWith("drop:") ? "Drops to the ground in your square" : "");
    const tag = b.tag ?? (act.startsWith("one:") || act.startsWith("drop:") ? "0 AP" : "");
    return { k: b.action, l: b.label, icon: b.icon ?? "", sub, tag, cls: b.cls ?? "" };
  });
  return pickOne({ ...o, compact: true, options: opts });
}

export async function ensureHandsFor(actor, weapon, need) {
  const others = (actor?.itemTypes?.weapon ?? []).filter(w => w.id !== weapon.id && w.system.wielded && !w.system.traits?.has?.("barehanded"));
  const used = others.reduce((n, w) => n + ((Number(w.system.hands) || 1) >= 2 ? 2 : 1), 0);
  if (used + need <= 2) return true;
  if (!enforce()) { ui.notifications.warn(`${actor.name} has no free hand for ${weapon.name} (the hand requirement isn't enforced: it is taken anyway).`); return true; }
  const pick = await pickButtons({ title: `${weapon.name}: no free hand`, name: "No free hand", sub: weapon.name, icon: "fa-hand",
    text: `${actor.name} needs ${need === 2 ? "both hands" : "a free hand"} for ${weapon.name}. Use the Release Action first (0 AP)? Pick what to let go of:`, buttons: releaseOptions({ itemTypes: { weapon: others } }) });
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
  const pick = await pickButtons({ title: `${item.name}: no free hand`, name: "No free hand", sub: item.name, icon: "fa-hand",
    text: `${actor.name} doesn't have a free hand for ${item.name}. Use the Release Action first (0 AP)? Pick what to let go of:`, buttons: releaseOptions(actor) });
  if (!pick || pick === "cancel") return false;
  await applyRelease(actor, pick);
  return handsUsed(actor) < 2;
}

/**
 * v0.0.211: what Regrip can do with these weapons (in the Items tab's order): a weapon in one hand taken in both (the other hand free),
 * a weapon moved to the free hand, the two one-handed weapons swapped. [{ action: "two:<id>" | "move:<id>" | "swap", label, icon }]
 */
export function regripOptions(weapons) {
  const slots = handSlots(weapons), name = id => (weapons ?? []).find(w => w.id === id)?.name ?? "";
  if (slots[0]?.both) return [];
  const held = slots.filter(s => !s.free), free = slots.find(s => s.free);
  const out = [];
  if (held.length === 1 && free) {
    out.push({ action: `two:${held[0].id}`, label: `Hold ${name(held[0].id)} with both hands`, icon: "fa-solid fa-hands" });
    out.push({ action: `move:${held[0].id}`, label: `Move ${name(held[0].id)} to your ${free.hand === "main" ? "main" : "off"} hand`, icon: "fa-solid fa-right-left" });
  }
  if (held.length === 2) out.push({ action: "swap", label: `Swap: ${name(held[0].id)} to the off hand, ${name(held[1].id)} to the main hand`, icon: "fa-solid fa-right-left" });
  return out;
}
/** Apply a Regrip choice (the item updates; the AP are paid by the caller). Returns the chat text or "". */
export async function applyRegrip(actor, weapons, pick) {
  const [kind, id] = String(pick).split(":"), slots = handSlots(weapons), w = id ? actor.items.get(id) : null;
  if (kind === "two" && w) { await w.update({ "system.hands": 2, "system.hand": "" }); return `holds <b>${esc(w.name)}</b> with both hands`; }
  if (kind === "move" && w) { const to = slots.find(s => s.free)?.hand ?? "main"; await w.update({ "system.hand": to }); return `moves <b>${esc(w.name)}</b> to the ${to} hand`; }
  if (kind === "swap" && slots.length === 2 && !slots.some(s => s.free)) {
    await actor.updateEmbeddedDocuments("Item", slots.map(s => ({ _id: s.id, "system.hand": s.hand === "main" ? "off" : "main" })));
    return "swaps the weapons in its hands";
  }
  return "";
}
/** Ask what to Regrip, apply it and say it in the chat. ap: the AP to spend first (0 when the Action already paid). Returns true if done. */
export async function regripPrompt(actor, weapons, { ap = 0, only = null, spend = null } = {}) {
  let buttons = regripOptions(weapons);
  if (only) buttons = buttons.filter(b => only(b.action));
  if (!buttons.length) { ui.notifications.info(`${actor.name} has nothing to Regrip.`); return false; }
  const pick = buttons.length === 1 && only ? buttons[0].action : await pickButtons({ title: `Regrip: ${actor.name}`, name: "Regrip", sub: actor.name, icon: "fa-hands", text: "Regrip (1 AP, no free hand needed): what do you do?", buttons });
  if (!pick || pick === "cancel") return false;
  if (ap && spend && !(await spend(actor, ap, "Regrip"))) return false;
  const text = await applyRegrip(actor, weapons, pick);
  if (text) { const { sysLine } = await import("./sysmsg.mjs"); await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hands", `<b>Regrip</b>${ap ? ` (${ap} AP)` : ""}: ${esc(actor.name)} ${text}.`) }); }   // v0.0.415: a sysLine
  return !!text;
}
