// SIM: the fight viewer's data. Plays the encounters of fights.txt with the engine's log on and writes one HTML file to open in a browser
// (double-click it): pick an encounter and a fight, press Play. The page is viewer-template.html with the fights put in; it loads nothing.
//   node book/ruler/sim/view.mjs                         every encounter of fights.txt, 6 fights each -> book/ruler/sim/fights.html
//   node book/ruler/sim/view.mjs "2 Elites"              only that encounter
//   node book/ruler/sim/view.mjs --seeds 12 --runs 500   more fights to watch, more fights behind each encounter's numbers
//   node book/ruler/sim/view.mjs --out my.html
// A fight is its seed: the same seed gives the same fight, here and in `run.mjs "<encounter>" --seed N`.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL("./", import.meta.url)), RULER = fileURLToPath(new URL("../", import.meta.url));
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : dflt; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

Object.assign(S.RULES, S.RULES_R);
const fights = S.parseFights(fs.readFileSync(RULER + "fights.txt", "utf8"));
const only = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2].toLowerCase() : null;
const encs = fights.encounters.filter(e => !only || e.name.toLowerCase().startsWith(only));
if (!encs.length) { console.log("Encounters of fights.txt:\n" + fights.encounters.map(e => `  "${e.name}"`).join("\n")); process.exit(1); }
const seeds = Number(arg("--seeds", 6)), runs = Number(arg("--runs", 300)), out = arg("--out", HERE + "fights.html");
const party = fights.party.map(f => S.parseSpec(fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8"), `rework/${f}`));
const data = { made: new Date().toISOString().slice(0, 10), party: party.map(b => b.name), fights: [], stats: {} };
for (const e of encs) {
  const npcs = () => e.npcs.map(n => S.npcOf(n.role, n.rating, fights.level, n));
  for (let seed = 1; seed <= seeds; seed++) data.fights.push({ enc: e.name, seed, log: S.fight(party, npcs(), S.rng(seed), { log: true }).log });
  const R = S.rng(29), res = []; for (let k = 0; k < runs; k++) res.push(S.fight(party, npcs(), R));
  data.stats[e.name] = { runs, won: mean(res.map(r => (r.won ? 1 : 0))), rounds: mean(res.map(r => r.rounds)), lost: mean(res.map(r => r.lost)), down: mean(res.map(r => (r.downs ? 1 : 0))) };
}
const html = fs.readFileSync(HERE + "viewer-template.html", "utf8").replace("/*DATA*/null/*END*/", () => JSON.stringify(data).replace(/</g, "\\u003c"));
fs.writeFileSync(out, html);
console.log(`${out}: ${encs.length} encounters, ${data.fights.length} fights, ${Math.round(html.length / 1024)} KB. Open it in a browser.`);
