// Passives (v0.0.125): a Feature or Talent can have settings, like an Effect, that work by themselves while the creature has it.
// Each setting has its own "It works...": always, or only while the creature's Escalation is at least its number (v0.0.126), so one Feature can
// hold settings that work at different moments. They are read like applied effects by the rolls (boons and banes, Empowered/Enfeebled), notes,
// Defense and Speed. v0.0.186: a passive's Bonus Damage works on every matching Action (or the first each round); granted uses still need an applied effect.
import { appliedFlags } from "./appliedflags.mjs";
const F = "twod12";

/**
 * v0.0.361 (PACK PERF, D33): an item's passive sources are kept until the item changes (it was rebuilt on every call: about 14 calls a roll,
 * and every measured movement step). Keyed on the item; still good only while its settings array (a new one after any update of the item)
 * and the strings read are the same, so it can't go stale. 10 µs a call on Sylwen, 0.3 µs cached.
 */
const itemCache = new WeakMap();
function itemSources(it) {
  const settings = it.system?.settings ?? [], description = it.system?.description ?? "", hover = it.system?.hover ?? "", srcUuid = it.getFlag?.(F, "sourceUuid") || it.uuid || "";
  const hit = itemCache.get(it);
  if (hit && hit.settings === settings && hit.description === description && hit.hover === hover && hit.name === it.name && hit.srcUuid === srcUuid && hit.id === it.id) return hit.out;
  const groups = new Map();
  for (const st of settings) {
    const min = Math.max(0, Math.trunc(Number(st.minEscalation)) || 0);
    if (!groups.has(min)) groups.set(min, []);
    groups.get(min).push(st);
  }
  const out = [];
  for (const [min, list] of groups) {
    const flags = appliedFlags({ settings: list, description, hover, expireOn: new Set(), expireAll: false }, null);
    flags.minEscalation = min;
    flags.passive = true;
    out.push({ id: `passive-${it.id}-${min}`, name: it.name, srcUuid, disabled: false, statuses: new Set(), flags: { [F]: flags }, getFlag: (scope, k) => (scope === F ? flags[k] : undefined) });
  }
  if (typeof it === "object" && it) itemCache.set(it, { settings, description, hover, name: it.name, srcUuid, id: it.id, out });
  return out;
}

/** The passives of a creature, as objects that read like applied effects (getFlag(scope, key), name, id): one for each Escalation minimum of each Feature or Talent. */
export function passiveSources(actor) {
  const out = [];
  // v0.0.355 (PACK ACTION-SHEET): an Action can hold rules too (Mark Quarry's Boon); most have none
  const list = actor?.itemTypes ? [...(actor.itemTypes.feature ?? []), ...(actor.itemTypes.talent ?? []), ...(actor.itemTypes.action ?? []).filter(a => a.system?.settings?.length)] : [];
  // v0.0.360 (Marked Quarry moved onto the Mark Quarry Action): a Feature or Talent that grants an Action which now holds rules of its own is not
  // read again (an old character keeps the Feature until it is removed: without this, its Boon would count twice). Told by the grant, not by a name.
  const ruled = (actor?.itemTypes?.action ?? []).filter(a => a.system?.settings?.length);
  const tookOver = it => ruled.some(a => a.getFlag?.(F, "featureId") === it.id || a.getFlag?.(F, "talentId") === it.id || (it.system?.actions ?? []).includes(a.getFlag?.(F, "sourceUuid") || "\u0000"));
  for (const it of list) {
    if (it.type !== "action" && ruled.length && tookOver(it)) continue;
    out.push(...itemSources(it));
  }
  return out;
}

// the cleanup audit (2026-11-26, Lucas: "Remove the Default ladder"): the default Elite ladder (v0.0.320: ELITE_LADDER, usesEliteLadder, its three
// settings at Escalation 2 / 4 / 6) is gone; an NPC's Escalation switch (useEscalation) still gives it an Escalation, and its own Features do the rest.
/** The applied effects and the passives of a creature, for anything that reads what changes its rolls. */
export const allEffects = actor => [...(actor?.effects ?? []), ...passiveSources(actor)];

/**
 * Part of the creature's base (v0.0.130): a passive that always works. Applied effects and Escalation passives are not:
 * the sheet shows what they change in green (better) or red (worse) against the base.
 */
export function isBaseSource(e) {
  const fl = e?.flags?.twod12 ?? {};
  const passive = fl.passive ?? e?.getFlag?.("twod12", "passive");
  const min = Number(fl.minEscalation ?? e?.getFlag?.("twod12", "minEscalation")) || 0;
  return !!passive && min <= 0;
}
