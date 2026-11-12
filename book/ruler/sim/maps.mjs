// SIM-2 (2026-11-12): the fights on every map, and what Speed and the movement conditions are worth there. Writes book/ruler/maps.md.
//   node book/ruler/sim/maps.mjs            (about 25 minutes)      node book/ruler/sim/maps.mjs --quick   (a draft, about 9)
// The maps are book/ruler/maps/*.txt (and "open": the open field of report.md). The party and the encounters are fights.txt's.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 120 : 400, PAIRS = QUICK ? 150 : 400;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => `${Math.round(x * 100)}%`;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`);

Object.assign(S.RULES, S.RULES_R);
const fights = S.parseFights(fs.readFileSync(RULER + "fights.txt", "utf8"));
const read = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8"), build = (f, edit = x => x) => S.parseSpec(edit(read(f)), `rework/${f}`);
const party = (edit = {}) => fights.party.map(f => build(f, edit[f.startsWith("paladin") ? "paladin" : "archer"] ?? (x => x)));
const maps = S.MP.mapNames(), mapOf = m => ({ ...S.MAP, grid: S.MP.loadMap(m) });
const ENC = ["4 Standards (normal)", "3 Standards + 1 Ward attacker", "Elite + 2 Standards", "6 Standards (CV 6, deadly)"].map(n => fights.encounters.find(e => e.name === n)).filter(Boolean);
const RANGED = { name: "2 Standards + 2 ranged Standards", npcs: [{ role: "standard", rating: "medium" }, { role: "standard", rating: "medium" }, { role: "standard", rating: "medium", ranged: true }, { role: "standard", rating: "medium", ranged: true }] };
const npcs = (e, opts = {}) => e.npcs.map(n => S.npcOf(n.role, n.rating, fights.level, { ...n, ...opts }));

const L = [];
L.push("# The fights on the maps (SIM-2)", "", "Written by `node book/ruler/sim/maps.mjs`; don't edit, run it again. The maps: `book/ruler/maps/*.txt` (`open` is the open field of report.md). The party: fights.txt's (the four R builds, level 1), the rules the book's today, the decisions the plan policy's (the ruler's old ones: nobody holds a chokepoint or looks for cover on purpose; SIM-3).", "",
  `Runs: ${RUNS} fights a cell, ${PAIRS} pairs a price${QUICK ? " (--quick: a draft)" : ""}.`, "",
  "| Map | What it is | Squares | Walls | Difficult Terrain |", "|---|---|---:|---:|---:|", "| open | The open field: no walls, Cover drawn by chance on each shot (5% Medium, 15% Low) | - | - | - |");
for (const m of maps.slice(1)) { const g = S.MP.loadMap(m); L.push(`| ${m} | ${g.title} | ${g.w} × ${g.h} | ${g.walls.length - 2 * (g.w + g.h) + 4} inside | ${g.roughs.length} |`); }

// 1. The fights by map.
L.push("", "## 1. The fights by map", "", "Each cell: rounds · the party's Health lost · a PC goes Down · the party wins.", "", `| Encounter | ${maps.join(" | ")} |`, `|---|${maps.map(() => "---").join("|")}|`);
const detail = {};
for (const e of [...ENC, RANGED]) {
  const row = [];
  for (const m of maps) {
    const R = S.rng(29), res = [], P = party(), map = mapOf(m); for (let k = 0; k < RUNS; k++) res.push(S.fight(P, npcs(e), R, { map }));
    row.push(`${f1(mean(res.map(r => r.rounds)))} · ${pc(mean(res.map(r => r.lost)))} · ${pc(mean(res.map(r => (r.downs ? 1 : 0))))} · ${pc(mean(res.map(r => (r.won ? 1 : 0))))}`);
    if (e === ENC[0]) detail[m] = res;
  }
  L.push(`| ${e.name} | ${row.join(" | ")} |`); log(`1. ${e.name}`);
}
L.push("", `**What the map does to the party** (${ENC[0].name}; per PC, a fight):`, "", `| | ${maps.join(" | ")} |`, `|---|${maps.map(() => "---:").join("|")}|`);
const per = (m, cls, fn) => mean(detail[m].flatMap(r => r.pcs.filter(p => !cls || p.build.name.startsWith(cls)).map(p => fn(p.st))));
const rowOf = (label, cls, fn, d = 2) => L.push(`| ${label} | ${maps.map(m => (d === "%" ? pc(per(m, cls, fn)) : d === 1 ? f1(per(m, cls, fn)) : f2(per(m, cls, fn)))).join(" | ")} |`);
rowOf("A Paladin: AP spent moving", "Paladin", st => st.moveAP);
rowOf("A Paladin: damage dealt", "Paladin", st => st.dealt, 1);
rowOf("A Paladin: damage taken", "Paladin", st => st.taken, 1);
rowOf("An Archer: AP spent moving", "Archer", st => st.moveAP);
rowOf("An Archer: damage dealt", "Archer", st => st.dealt, 1);
rowOf("An Archer: damage taken", "Archer", st => st.taken, 1);
rowOf("An Archer: shots", "Archer", st => st.shots, 1);
rowOf("... with Cover (share of its shots)", "Archer", st => (st.shots ? st.covered / st.shots : 0), "%");
rowOf("... Banes from the map on a shot", "Archer", st => (st.shots ? st.mapBanes / st.shots : 0));
rowOf("An Archer: Actions with no target it could see or reach", "Archer", st => st.outOfReach);
rowOf("A Paladin: Actions with no target in reach", "Paladin", st => st.outOfReach);
rowOf("Reactions used (a PC)", "", st => st.reactions);
rowOf("Turns that start Engaged (an Archer)", "Archer", st => st.turnsEngaged);
rowOf("Collision damage it caused (a PC)", "", st => st.collision ?? 0, 1);

// 2. Speed and the movement conditions.
L.push("", "## 2. What Speed and the movement conditions are worth, by map", "",
  `Each price is ${PAIRS} pairs of fights with the same dice (every creature rolls its own), one with the change: ${ENC[0].name}, the NPCs don't die, the first 3 rounds. **Value = the damage the party deals more + the damage it takes less** (DE; 1 AP is about 5.8 DE). For a condition: put on every Standard at the start of round 2 (they have closed in), the value for one Standard. A value under about 0.5 is inside the noise.`, "",
  `| Change | ${maps.join(" | ")} |`, `|---|${maps.map(() => "---:").join("|")}|`);
const sp = d => x => x.replace(/^speed (\d+)/m, (m, n) => `speed ${Number(n) + d}`);
const cond = name => ({ round: 2, fn: ({ foes }) => { for (const f of foes) S.MP.applyCondition(f, name); } });
const VAR = [
  ["+1 Speed, both Paladins (5 → 6)", { edit: { paladin: sp(1) } }, 2], ["-1 Speed, both Paladins (5 → 4)", { edit: { paladin: sp(-1) } }, 2],
  ["+1 Speed, both Archers (6 → 7)", { edit: { archer: sp(1) } }, 2], ["-1 Speed, both Archers (6 → 5)", { edit: { archer: sp(-1) } }, 2],
  ["-1 Speed on every Standard (5 → 4), for one", { npc: { speed: 4 } }, 4], ["+1 Speed on every Standard (5 → 6), for one", { npc: { speed: 6 } }, 4],
  ["Hindered (EoT) on a Standard", { inject: cond("Hindered (EoT)") }, 4], ["Immobilized (EoT) on a Standard", { inject: cond("Immobilized (EoT)") }, 4],
  ["Slowed 1 on a Standard", { inject: cond("Slowed 1") }, 4], ["Prone on a Standard", { inject: cond("Prone") }, 4],
];
const total = r => r.pcs.reduce((s, p) => s + p.st.dealt - p.st.taken, 0);
for (const [name, v, div] of VAR) {
  const row = [];
  for (const m of maps) {
    const map = mapOf(m), A = party(), B = party(v.edit ?? {}), d = [];
    for (let k = 0; k < PAIRS; k++) { const a = S.fight(A, npcs(ENC[0]), S.rng(1000 + k), { map, immortal: true, maxRounds: 3, streams: true }), b = S.fight(B, npcs(ENC[0], v.npc ?? {}), S.rng(1000 + k), { map, immortal: true, maxRounds: 3, streams: true, inject: v.inject ?? null }); d.push((total(b) - total(a)) / div); }
    const sd = Math.sqrt(mean(d.map(x => (x - mean(d)) ** 2)) / d.length);
    row.push(`${f2(mean(d))} ± ${f2(sd)}`);
  }
  L.push(`| ${name} | ${row.join(" | ")} |`); log(`2. ${name}`);
}
L.push("", "A price is for one creature (the Speed rows: for one of the two PCs, or one of the four Standards). On the open field every Advance reaches whatever its length, so Speed is worth nothing there; a map gives it a price where the way is long (a corridor, rough ground) or the lines are blocked.", "",
  `(${f1((Date.now() - t0) / 60000)} minutes.)`, "");
fs.writeFileSync(RULER + "maps.md", L.join("\n"));
console.log(L.join("\n"));
