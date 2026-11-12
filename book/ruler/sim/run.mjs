// SIM-1 (2026-11-12): one fight, written out. The party and the encounters are fights.txt's; the fight is the engine's (engine.mjs) with its log on.
//   node book/ruler/sim/run.mjs                              lists the encounters of fights.txt
//   node book/ruler/sim/run.mjs "4 Standards (normal)"       plays it once (seed 1) and prints what happened, round by round
//   node book/ruler/sim/run.mjs "2 Elites" --seed 7          another seed (the same seed gives the same fight)
//   node book/ruler/sim/run.mjs "2 Elites" --json            the log as JSON (what the viewer reads)
//   node book/ruler/sim/run.mjs "2 Elites" --playtest        the fight in the Encounter Log's playtest format (SIM-4)
// SIM-4 writes this in the Encounter Log's playtest format and draws it; this is the plain version, to read a fight and check a rule.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL("../", import.meta.url));

/** The log of a fight as lines of text. */
export function logText(log) {
  const L = [], xy = p => (p ? `(${p[0]}, ${p[1]})` : ""), n1 = x => (Math.round(x * 10) / 10).toString();
  for (const e of log) {
    if (e.type === "start") { L.push(`Start (${e.map}). Initiative: ${e.order.join(", ")}.`); for (const c of e.creatures) L.push(`  ${c.name}: Health ${c.health}${c.damage ? ` (${n1(c.damage)} damage already)` : ""} ${xy(c.pos)}`); }
    else if (e.type === "round") L.push("", `Round ${e.round}`);
    else if (e.type === "turn") L.push(`  ${e.who}${e.turn ? `: ${e.turn}` : ""}${e.escalation ? ` · Escalation ${e.escalation}` : ""}${e.ap != null ? ` · ${e.ap} AP` : ""}${e.guard ? ` · Guard ${n1(e.guard)}` : ""} ${xy(e.pos)}`);
    else if (e.type === "move") L.push(`    ${e.who}: ${e.how} ${xy(e.from)} to ${xy(e.to)}`);
    else if (e.type === "action") L.push(`    ${e.who}: ${e.action}${e.target ? ` on ${e.target}` : ""}: ${e.save ? "its Save " : ""}Tier ${e.tier}${e.damage ? `, ${n1(e.damage)} damage` : ""}`);
    else if (e.type === "attack") L.push(`    ${e.who}: ${e.kind === "special" ? "Special" : "Basic attack"} on ${e.target}: ${e.damage ? `${n1(e.damage)} [${e.pool}]` : "nothing"}`);
    else if (e.type === "reaction") L.push(`    Reaction, ${e.who}: ${e.reaction}${e.on ? ` on ${e.on}${e.protects ? `, for ${e.protects}` : ""}` : ""}${e.tier ? `: Tier ${e.tier}` : ""}${e.damage ? `, ${n1(e.damage)} damage` : ""}`);
    else if (e.type === "down") L.push(`    ${e.who} goes Down.`);
    else if (e.type === "dead") L.push(`    ${e.who} is out.`);
    else if (e.type === "end") { L.push("", `${e.won ? "The party wins" : "The party loses"} in ${e.rounds} rounds.`); for (const c of e.creatures) L.push(`  ${c.name}: ${n1(c.damage)} damage${c.out ? " (out)" : ""}`); }
  }
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  Object.assign(S.RULES, S.RULES_BOOK);
  const fights = S.parseFights(fs.readFileSync(HERE + "fights.txt", "utf8")), name = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
  const enc = name && (fights.encounters.find(e => e.name === name) ?? fights.encounters.find(e => e.name.toLowerCase().startsWith(name.toLowerCase())));
  if (!enc) { console.log("Encounters of fights.txt:\n" + fights.encounters.map(e => `  "${e.name}"`).join("\n")); process.exit(name ? 1 : 0); }
  const seed = Number(process.argv[process.argv.indexOf("--seed") + 1]) || 1;
  const party = fights.party.map(f => S.parseSpec(fs.readFileSync(`${HERE}rework/${f}.txt`, "utf8"), `rework/${f}`));
  const r = S.fight(party, enc.npcs.map(n => S.npcOf(n.role, n.rating, fights.level, n)), S.rng(seed), { log: true });
  if (process.argv.includes("--playtest")) { const { playtestText } = await import(new URL("./enclog.mjs", import.meta.url).href); console.log(`${enc.name}, seed ${seed}\n\n${playtestText(r.log)}`); }
  else console.log(process.argv.includes("--json") ? JSON.stringify(r.log) : `${enc.name}, seed ${seed}\n${logText(r.log)}`);
}
