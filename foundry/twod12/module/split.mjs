// Split Actions (Round 10 of the rules): an Action with two modes, Weapon and Power, chosen each time it is used. In the chosen mode it takes the
// mode's trait (Weapon or Power) and is an Action of that mode for every rule; only its traits and damage differ (the versions marked with that
// mode); Frequency, target, trigger and Critical are shared. A version has a Mode (none, Weapon, Power): the Action's versions for the mode (and the
// ones with no mode) are the ones it offers. A Power mode with Distance "Weapon" uses Reach.
export const SPLIT_TRAIT = { weapon: "weapon", power: "magic" };
export const SPLIT_LABEL = { weapon: "Weapon mode", power: "Power mode" };

/** Which modes this Action has versions for (in the order Weapon, Power). */
export const splitModes = item => ["weapon", "power"].filter(m => (item?.system?.versions ?? []).some(v => v.mode === m));

const over = (target, extra) => new Proxy(target, {
  get(t, p) { if (typeof p === "string" && Object.hasOwn(extra, p)) return extra[p]; const v = Reflect.get(t, p, t); return typeof v === "function" ? v.bind(t) : v; }
});

/** The Action as it is in one mode: the same item (id, flags, name) with the mode's trait added and only the mode's versions. */
export function splitView(item, mode) {
  const sys = item.system;
  const traits = new Set([...sys.traits, SPLIT_TRAIT[mode]]);
  const versions = [...(sys.versions ?? [])].filter(v => !v.mode || v.mode === mode);
  const distance = mode === "power" && /^\s*weapon\s*$/i.test(sys.distance ?? "") ? "reach" : sys.distance;
  return over(item, { system: over(sys, { traits, versions, distance }), splitMode: mode });
}
