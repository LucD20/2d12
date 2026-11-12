// The Bestiary's turn budget: NPCs built on the price list (sim/budget.mjs), each doing more than damage. Used by stage0fx.mjs (stage0.md's
// sections on enemies with effects) and written into the Bestiary as its examples. A design: { label, rating (its damage), npc (npcS0's ratings),
// acts, reaction }. Riders follow the Bestiary's "how common" ladder: damage + a forced movement, damage only, damage + one other rider, ...
const R = (eff, sev, at = "hit") => ({ eff, sev, at });
export const FM1 = R("Push 1", "forced"), FM2 = R("Push 2", "moderate");

/** Four Standards with effects: the encounter "4 Standards" of the fights, one of each (5 and 6: the list again from the top). */
export const STANDARDS = [
  { label: "Raider", acts: [{ name: "Shove", ap: 1, riders: [FM1] }, { name: "Hamstring", ap: 2, freq: "round", riders: [R("Prone", "moderate")] }] },
  { label: "Hexer", npc: { power: true }, acts: [{ name: "Chill", ap: 1, power: true }, { name: "Dread", ap: 2, freq: "round", power: true, riders: [R("Slowed 1", "moderate")] }] },
  { label: "Cutter", acts: [{ name: "Slash", ap: 1 }, { name: "Open Vein", ap: 2, freq: "round", riders: [R("Bleed 1d4", "severe")] }] },
  { label: "Guard", acts: [{ name: "Bash", ap: 1, riders: [R("Pressure Bane (next roll)", "mild")] }, { name: "Shield Slam", ap: 2, freq: "round", riders: [FM2] }], reaction: { name: "Riposte", cost: 1, trigger: "struck", act: { name: "Riposte" } } },
];
/** The six Roles on the Bestiary's ratings, with what makes each one (the Soldier's Reaction, the Controller's conditions, the Leader's help). */
export const ROLES = {
  Striker: { rating: "high", npc: { vrating: "high", rrating: "low", adrating: "low", wmod: "low" }, acts: [{ name: "Smash", ap: 1, riders: [FM1] }, { name: "Crush", ap: 2, freq: "round" }] },
  Soldier: { npc: { adrating: "high", vrating: "low", rrating: "low" }, acts: [{ name: "Strike", ap: 1 }, { name: "Pin", ap: 2, freq: "round", riders: [R("Immobilized", "moderate")] }], reaction: { name: "Hold the Line", cost: 1, trigger: "allyHit", range: 2, act: { name: "Hold the Line" } } },
  Skirmisher: { npc: { speed: 7, wmod: "high", vrating: "low", rrating: "low" }, acts: [{ name: "Cut", ap: 1 }, { name: "Hit and Run", ap: 2, freq: "round", riders: [R("Hindered (EoT)", "mild")] }] },
  Artillery: { npc: { ranged: true, wmod: "high", adrating: "low" }, acts: [{ name: "Shot", ap: 1 }, { name: "Pinning Volley", ap: 2, freq: "round", riders: [R("Pressure Bane (next roll)", "mild")] }] },
  Controller: { npc: { power: true, wdrating: "high", adrating: "low" }, acts: [{ name: "Hex", ap: 1, power: true, riders: [R("Frightened (EoT)", "mild")] }, { name: "Bind", ap: 2, freq: "round", power: true, riders: [R("Dazed 1", "moderate")] }] },
  Leader: { acts: [{ name: "Strike", ap: 1 }, { name: "Command", ap: 2, freq: "round", pts: 55 - 9 }, { name: "Rally", ap: 1, freq: "round", kind: "help", buff: { boons: 1 }, pts: 9 }] },
};
/** The other ranks with effects. */
export const RANKS = {
  minion: { acts: [{ name: "Stab", ap: 1, riders: [FM1] }, { name: "Trip", ap: 1, freq: "round", riders: [R("Hindered (EoT)", "mild")] }] },
  grunt: { acts: [{ name: "Hack", ap: 1, riders: [FM1] }, { name: "Gouge", ap: 1, freq: "round", riders: [R("Vulnerable 1", "mild")] }] },
  elite: { acts: [{ name: "Maul", ap: 1, riders: [FM1] }, { name: "Rend", ap: 2, freq: "round", riders: [R("Prone", "moderate")] }, { name: "Quake", ap: 3, freq: "enc", area: { n: 3, r: 2 }, riders: [R("Slowed 1", "moderate")] }], reaction: { name: "Backhand", cost: 1, trigger: "struck", act: { name: "Backhand" } } },
};
/** The damage-only versions (the same shapes, no riders, no Reaction): what the Bestiary's table measured. */
export const plain = d => ({ ...d, label: d.label, acts: d.acts.filter(a => a.kind !== "help").map(a => ({ ...a, riders: [], pts: undefined })), reaction: undefined });
