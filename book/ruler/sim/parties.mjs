// SIM-2 (areas): the party that uses the Area cards, for areas.mjs and the viewer. fights.txt's party with two builds changed: the Smite Paladin
// opens with Consecrated Ground (2 AP), then Word of Radiance (3 AP); the Double Shot Archer with Covering Fire, then Volley, then Rain of Arrows.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), rd = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8");
export function areaParty() {
  const pal = S.parseSpec(rd("paladin-smite-r1").replace(/^plan .*$/m, "turn Ground: Consecrated Ground 2, Weapon Attack, Weapon Attack\nturn Word: Word of Radiance 3\nplan Ground, Word, Main"), "rework/paladin-smite-r1 (areas)");
  const arc = S.parseSpec(rd("archer-double-r1").replace(/^plan .*$/m, "turn Cover: Covering Fire, Double Shot 2\nturn Vol: Volley, Double Shot 2\nturn Rain: Rain of Arrows, Double Shot 2\nplan Cover, Vol, Rain, Pin"), "rework/archer-double-r1 (areas)");
  return [pal, S.parseSpec(rd("paladin-hands-r1"), "rework/paladin-hands-r1"), arc, S.parseSpec(rd("archer-rolling-r1"), "rework/archer-rolling-r1")];
}
/** PC states for a fight in which the Dailies may be used. */
export const withDailies = builds => builds.map(b => { const p = S.pcState(b); p.dailyOK = true; return p; });
