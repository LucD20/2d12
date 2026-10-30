// Passives (v0.0.125): a Feature or Talent can have settings, like an Effect, that work by themselves while the creature has it.
// Each setting has its own "It works...": always, or only while the creature's Escalation is at least its number (v0.0.126), so one Feature can
// hold settings that work at different moments. They are read like applied effects by the rolls (boons and banes, Empowered/Enfeebled), notes,
// Defense and Speed. v0.0.186: a passive's Bonus Damage works on every matching Action (or the first each round); granted uses still need an applied effect.
import { appliedFlags } from "./appliedflags.mjs";
const F = "twod12";

/** The passives of a creature, as objects that read like applied effects (getFlag(scope, key), name, id): one for each Escalation minimum of each Feature or Talent. */
export function passiveSources(actor) {
  const out = [];
  const list = actor?.itemTypes ? [...(actor.itemTypes.feature ?? []), ...(actor.itemTypes.talent ?? [])] : [];
  for (const it of list) {
    const groups = new Map();
    for (const st of it.system?.settings ?? []) {
      const min = Math.max(0, Math.trunc(Number(st.minEscalation)) || 0);
      if (!groups.has(min)) groups.set(min, []);
      groups.get(min).push(st);
    }
    for (const [min, settings] of groups) {
      const flags = appliedFlags({ settings, description: it.system?.description ?? "", hover: it.system?.hover ?? "", expireOn: new Set(), expireAll: false }, null);
      flags.minEscalation = min;
      flags.passive = true;
      out.push({ id: `passive-${it.id}-${min}`, name: it.name, disabled: false, statuses: new Set(), flags: { [F]: flags }, getFlag: (scope, k) => (scope === F ? flags[k] : undefined) });
    }
  }
  return out;
}

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
