// SIM-2 (areas and Zones, 2026-11-12): what the Area cards do on the grid, against the number of creatures their ruler lines assume. Writes book/ruler/areas.md.
//   node book/ruler/sim/areas.mjs   (about 4 minutes)
// The party: fights.txt's, with the Smite Paladin opening on Consecrated Ground then Word of Radiance, and the Double Shot Archer on Covering Fire,
// Volley and Rain of Arrows (their Dailies allowed); Final Verdict and Hallowed Dawn are the builds' own Apex turns.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), RUNS = process.argv.includes("--quick") ? 100 : 400;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
Object.assign(S.RULES, S.RULES_R);
const { areaParty } = await import(new URL("./parties.mjs", import.meta.url).href);
const party = areaParty();
const CARDS = ["Consecrated Ground 2", "Covering Fire", "Word of Radiance 3", "Volley", "Rain of Arrows", "Final Verdict", "Hallowed Dawn"];
const COUNT = Object.fromEntries(CARDS.map(n => { const a = party.map(b => b.actions[n.toLowerCase()]).find(Boolean); return [n, a ? { area: a.area, allies: a.allies, shape: a.shape, rounds: a.rounds } : null]; }));
const ENC = [["4 Standards", 4], ["6 Standards", 6]], MAPS = ["open", ...S.MP.mapNames().slice(1)];
const run = (n, m, grid, policy = S.planPolicy) => { S.RULES.areasOnGrid = grid; const map = { ...S.MAP, grid: S.MP.loadMap(m) }, R = S.rng(31), res = [];
  for (let k = 0; k < RUNS; k++) { const pcs = party.map(S.pcState); for (const p of pcs) p.dailyOK = true; res.push(S.fight(pcs, Array(n).fill(0).map(() => S.npcOf("standard", "medium", 1)), R, { map, policy, npcPolicy: S.planPolicy })); }
  S.RULES.areasOnGrid = false; return res; };
const cell = r => `${f1(mean(r.map(x => x.rounds)))} · ${pc(mean(r.map(x => x.lost)))} · ${pc(mean(r.map(x => (x.downs ? 1 : 0))))} · ${pc(mean(r.map(x => (x.won ? 1 : 0))))}`;
const L = ["# Areas and Zones on the grid (SIM-2)", "", "Written by `node book/ruler/sim/areas.mjs`; don't edit, run it again.", "",
  `Runs: ${RUNS} fights a cell. **The party** is fights.txt's with two builds changed to use the Area cards: the Smite Paladin opens with Consecrated Ground (2 AP), then Word of Radiance (3 AP); the Double Shot Archer with Covering Fire, then Volley, then Rain of Arrows (Dailies allowed). Final Verdict and Hallowed Dawn are the Paladins' own Escalation 3 turns. **On the grid** an Area is placed where it holds the most of the creatures it is for (a damaging Area never where an ally stands; one that lasts counts allies too) and hits who stands in it, with Line of Effect from its Point of Origin; a Zone stays on its squares for its rounds. **By count** (the ruler until now, and report.md's open field): the number of creatures the card's ruler line says.`, "",
  "| Card | Its Area (the card) | The ruler line's number |", "|---|---|---|"];
for (const n of CARDS) { const c = COUNT[n]; if (c) L.push(`| ${n} | ${c.shape ? `${c.shape.n} ${c.shape.kind[0].toUpperCase()}${c.shape.kind.slice(1)}, ${c.shape.dist === "self" ? "around you" : c.shape.dist === "weapon" ? "within your weapon's normal range" : c.shape.dist === "max" ? "within its maximum range" : `within ${c.shape.dist} squares`}; ${c.shape.who === "all" ? "all creatures" : c.shape.who}${c.rounds ? `; ${c.rounds} rounds` : ""}` : "-"} | ${c.area > 1 ? `${c.area} enemies` : ""}${c.allies ? `${c.area > 1 ? ", " : ""}${c.allies} allies` : ""} |`); }
L.push("", "## 1. The fights: by count against on the grid", "", "Each cell: rounds · the party's Health lost · a PC goes Down · the party wins.", "", "| Encounter | Map | By count | On the grid | On the grid, the party holding the line |", "|---|---|---|---|---|");
const keep = {};
for (const [name, n] of ENC) for (const m of MAPS) { const g = (keep[`${name}|${m}`] = run(n, m, true)); L.push(`| ${name} | ${m} | ${m === "open" ? cell(run(n, m, false)) : "(a map is always the grid)"} | ${cell(g)} | ${cell(run(n, m, true, S.POLICIES.hold))} |`); process.stderr.write(`1. ${name} ${m}\n`); }
L.push("", "## 2. What each Area did (a use)", "", "Enemies in it when it is placed · for a Zone: enemy Strikes that took its Bane, turns an ally healed in it, enemy Strikes against an ally it defended (all over its rounds).", "");
for (const [name] of ENC) {
  L.push(`**${name}**`, "", `| Card | ${MAPS.join(" | ")} |`, `|---|${MAPS.map(() => "---").join("|")}|`);
  for (const n of CARDS) {
    const row = MAPS.map(m => { const all = keep[`${name}|${m}`].flatMap(r => r.pcs.map(p => p.st.area?.[n]).filter(Boolean)), u = all.reduce((s, x) => s + x.uses, 0); if (!u) return "-";
      const per = k => all.reduce((s, x) => s + x[k], 0) / u, z = per("baned") + per("healed") + per("defended");
      return `${f1(per("hits"))}${z ? ` · ${f1(per("baned"))} · ${f1(per("healed"))} · ${f1(per("defended"))}` : ""}`; });
    L.push(`| ${n} | ${row.join(" | ")} |`);
  }
  L.push("");
}
L.push("", "A Zone's cell: enemies in it · Strikes with its Bane · heals · Strikes defended. Hallowed Dawn's Area is for allies (its heals are counted as heals, not here).", "", "## 3. Not on the grid yet", "",
  "Covering Fire's damage to enemies that enter it and Rain of Arrows' Hazardous Terrain (their cards' text has them; their ruler lines don't), a Line, an Area that hits allies on purpose, enemies walking around a Zone, Light.", "");
fs.writeFileSync(RULER + "areas.md", L.join("\n")); console.log(L.join("\n"));
