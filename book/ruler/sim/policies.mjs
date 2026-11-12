// SIM-3 (2026-11-12): the sensitivity report. Every headline number under several decision policies, so a result that only holds under one of them
// is visible. Writes book/ruler/policies.md.   node book/ruler/sim/policies.mjs   (about 20 minutes; --quick about 6)
// The policies: sim/policy.mjs (POLICIES for the party, NPC_POLICIES for the enemies). The party and the encounters: fights.txt.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick"), RUNS = QUICK ? 100 : 300;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`);
Object.assign(S.RULES, S.RULES_R);
const fights = S.parseFights(fs.readFileSync(RULER + "fights.txt", "utf8"));
const party = fights.party.map(f => S.parseSpec(fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8"), `rework/${f}`));
const enc = n => fights.encounters.find(e => e.name.startsWith(n)), ENC = [enc("4 Standards"), enc("5 Standards"), enc("6 Standards")], MAPS = ["open", "corridor", "pillars"];
const npcs = e => e.npcs.map(n => S.npcOf(n.role, n.rating, fights.level, n));
const run = (e, m, policy, npcPolicy = S.planPolicy) => { const map = { ...S.MAP, grid: S.MP.loadMap(m) }, R = S.rng(29), res = []; for (let k = 0; k < RUNS; k++) res.push(S.fight(party, npcs(e), R, { map, policy, npcPolicy })); return res; };
const cell = r => `${f1(mean(r.map(x => x.rounds)))} · ${pc(mean(r.map(x => x.lost)))} · ${pc(mean(r.map(x => (x.downs ? 1 : 0))))} · ${pc(mean(r.map(x => (x.won ? 1 : 0))))}`;
const span = list => { const v = list.map(r => mean(r.map(x => x.lost))); return `${pc(Math.min(...v))} to ${pc(Math.max(...v))}`; };

const L = [], P = S.POLICIES, N = S.NPC_POLICIES, keep = {};
L.push("# The decisions: every headline number under several policies (SIM-3)", "", "Written by `node book/ruler/sim/policies.mjs`; don't edit, run it again. The policies are `book/ruler/sim/policy.mjs`.", "",
  `Runs: ${RUNS} fights a cell${QUICK ? " (--quick: a draft)" : ""}; two cells differ for real when they are more than about ${QUICK ? 8 : 5} points apart. Each cell: rounds · the party's Health lost · a PC goes Down · the party wins. The party: fights.txt's four R builds, level 1.`, "",
  "**The party's policies** (each is the plan policy with one decision changed, then two mixes):", "",
  "| Policy | What it decides differently |", "|---|---|",
  "| plan | The ruler's decisions so far: focus the enemy closest to dying; the melee PCs walk to the nearest enemy; an Archer moves only when its turn says so; the Encounter Action in round 1; the Reaction AP kept for the class Reaction |",
  "| hold the line | A melee PC doesn't walk to an enemy it can't reach with one Advance while melee enemies are still coming (rounds 1 and 2): it keeps its place and its AP (Guard at its next turn) |",
  "| kite | An Archer that starts its turn Engaged steps away first (1 AP), then takes what is left of its turn |",
  "| protect the back line | A melee PC walks to the enemy nearest to an Archer (within 3 squares of one), not to the one nearest to itself |",
  "| Encounter Actions in round 2 | The round 1 turn with an Encounter Action waits for round 2 (Escalation 2) |",
  "| react to the first trigger | Every Reaction on its first trigger, the Opportunity Attack too |",
  "| tactical | hold + kite + protect |",
  "| casual | No focus fire (each PC hits the enemy nearest to it), every Reaction on its first trigger |", "");
// 1. The party's policies.
L.push("## 1. The party's decisions", "");
for (const e of ENC) {
  L.push(`**${e.name}**`, "", `| Party policy | ${MAPS.join(" | ")} |`, `|---|${MAPS.map(() => "---").join("|")}|`);
  for (const [k, p] of Object.entries(P)) { const row = MAPS.map(m => (keep[`${e.name}|${m}|${k}`] = run(e, m, p))); L.push(`| ${p.name} | ${row.map(cell).join(" | ")} |`); log(`1. ${e.name}, ${p.name}`); }
  L.push(`| *Health lost, the least to the most* | ${MAPS.map(m => `*${span(Object.keys(P).map(k => keep[`${e.name}|${m}|${k}`]))}*`).join(" | ")} |`, "");
}
// 2. What each policy does (the deadly fight).
const D = ENC[2];
L.push(`## 2. What the party does under each policy (${D.name}; per PC, a fight)`, "");
for (const m of MAPS) {
  const ks = ["plan", "hold", "kite", "tactical", "casual"];
  L.push(`**${m}**`, "", `| | ${ks.map(k => P[k].name).join(" | ")} |`, `|---|${ks.map(() => "---:").join("|")}|`);
  const row = (label, fn, cls = "") => L.push(`| ${label} | ${ks.map(k => f2(mean(keep[`${D.name}|${m}|${k}`].flatMap(r => r.pcs.filter(p => !cls || p.build.name.startsWith(cls)).map(p => fn(p.st)))))).join(" | ")} |`);
  row("A Paladin: damage dealt", st => st.dealt, "Paladin"); row("A Paladin: damage taken", st => st.taken, "Paladin"); row("A Paladin: AP spent moving", st => st.moveAP, "Paladin"); row("A Paladin: turns it held its place", st => st.held ?? 0, "Paladin");
  row("An Archer: damage dealt", st => st.dealt, "Archer"); row("An Archer: damage taken", st => st.taken, "Archer"); row("An Archer: turns it started Engaged", st => st.turnsEngaged, "Archer"); row("An Archer: steps away (kite)", st => st.kited ?? 0, "Archer"); row("An Archer: shots while Engaged (2 Banes)", st => st.engagedShots, "Archer");
  row("Turn AP left unspent (a PC)", st => st.apLeft); row("Guard from them: given", st => st.apGuardGiven); row("... used", st => st.apGuardUsed); row("Reactions used (a PC)", st => st.reactions); row("... Opportunity Attacks", st => st.oaReal); row("Opportunity Attacks taken (a PC)", st => st.oaTaken);
  L.push("");
}
// 3. The enemies' policies.
L.push("## 3. The enemies' decisions (the party on the plan policy, and on the tactical one)", "",
  "| Enemy policy | What it decides |", "|---|---|", "| plan | The PC it can strike most after moving, a hurt PC a little more |", "| focus the weakest | Every NPC on the PC with the least Health left |", "| the nearest | The nearest PC, whoever it is |", "| go for the back line | The Archers first |", "");
for (const e of [ENC[0], ENC[2]]) for (const pk of ["plan", "tactical"]) {
  L.push(`**${e.name}, the party: ${P[pk].name}**`, "", `| Enemy policy | ${MAPS.join(" | ")} |`, `|---|${MAPS.map(() => "---").join("|")}|`);
  const all = MAPS.map(() => []);
  for (const [k, np] of Object.entries(N)) { const row = MAPS.map(m => (k === "plan" ? keep[`${e.name}|${m}|${pk}`] : run(e, m, P[pk], np))); row.forEach((r, i) => all[i].push(r)); L.push(`| ${k === "plan" ? "plan" : np.name} | ${row.map(cell).join(" | ")} |`); log(`3. ${e.name}, ${pk}, ${k}`); }
  L.push(`| *Health lost, the least to the most* | ${all.map(a => `*${span(a)}*`).join(" | ")} |`, "");
}
L.push(`(${f1((Date.now() - t0) / 60000)} minutes.)`, "");
fs.writeFileSync(RULER + "policies.md", L.join("\n"));
console.log(L.join("\n"));
