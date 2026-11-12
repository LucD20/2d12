// SIM-4 (2026-11-12): Playtest 4 replayed. The table's encounter (book/playtest-4.md: the four level 1 PCs against an Ogre Chieftain, an Orc Warrior,
// a Bandit Thug and three Goblin Sneaks; 4 rounds played) run many times in SIM, and what happened at the table set beside it.
// Writes book/ruler/playtest-4-sim.md.   node book/ruler/sim/playtest4.mjs   (about 3 minutes)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const { playtestText } = await import(new URL("./enclog.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), BOOK = fileURLToPath(new URL("../../", import.meta.url)), RUNS = process.argv.includes("--quick") ? 300 : 1500;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
const pctl = (a, q) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(q * a.length))];
Object.assign(S.RULES, S.RULES_R);
// Kaela's level 1 sheet has a Shortbow (0 / 1d6 / 1d10, Range 8 / 16 / 32; its Technique is Skirmish Shot), not the ruler build's Crossbow with Lock & Loose.
const shortbow = x => x.replace(/^weapon .*$/m, "weapon Shortbow (ranged, projectile, two-handed, range 8/16/32): 0 / 1d6 / 1d10").replace(/Lock & Loose/g, "Skirmish Shot");
const party = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"].map(f => S.parseSpec((f === "archer-rolling-r1" ? shortbow : x => x)(fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8")), `rework/${f}`));
const TURNS = [3, 3, 4, 4], NPC_TURNS = 3;   // the table stopped in round 4 after Sylwen and Kaela: the Paladins and every enemy had 3 turns
const WHO = ["Aveline (Paladin, Smite)", "Durgan (Paladin, Lay On Hands)", "Sylwen (Archer, Double Shot)", "Kaela (Archer, Rolling Shot)"], KEY = ["Aveline", "Durgan", "Sylwen", "Kaela"];
// The enemies as the compendium has them (foundry/twod12/tools/content.mjs; the Bestiary's example NPCs).
const npcs = () => [S.npcOf("elite", "medium", 1, { name: "Ogre Chieftain", speed: 4, drating: "high" }), S.npcOf("standard", "medium", 1, { name: "Orc Warrior" }), S.npcOf("grunt", "medium", 1, { name: "Bandit Thug" }),
  ...[1, 2, 3].map(() => S.npcOf("minion", "medium", 1, { name: "Goblin Sneak", speed: 7, hrating: "low" }))];
// The table (book/playtest-4.md).
const text = fs.readFileSync(BOOK + "playtest-4.md", "utf8");
const dealt = Object.fromEntries([...text.matchAll(/^\| (\w+)[^|]*\| (\d+) \|/gm)].map(m => [m[1], Number(m[2])]));
const TABLE = { dealt: KEY.map(k => dealt[k] ?? 0), ogre: dealt.Ogre ?? 31, goblin: 3, tiers: [0, 0, 0], npcTiers: [0, 0, 0],
  reactions: { Sylwen: 4, Kaela: 2, Aveline: 3, Durgan: 2 }, outByRound4: ["Goblin Sneak (1 of 3)", "Bandit Thug"], pcDown: 0, heals: 2 };
for (const line of text.split("\n").filter(l => /^- \w+:/.test(l))) {
  const actor = line.match(/^- (\w+):/)[1], isPc = KEY.includes(actor);
  for (const part of line.replace(/^- \w+:/, "").split(/[;,]/)) { const t = part.match(/\bT([123])\b/); if (!t) continue; const by = KEY.find(k => part.trim().startsWith(k)); ((by || (isPc && !/^(OC|OW|BT|GS)/.test(part.trim()))) ? TABLE.tiers : TABLE.npcTiers)[Number(t[1]) - 1]++; }
}
const share = a => { const s = a.reduce((x, y) => x + y, 0) || 1; return a.map(x => pc(x / s)).join(" / "); };

const L = ["# Playtest 4 replayed in SIM", "", "Written by `node book/ruler/sim/playtest4.mjs`; don't edit, run it again. The table: `book/playtest-4.md` (Foundry v0.0.342, 4 rounds played, not finished).", "",
  `**The encounter:** the four level 1 PCs against an Ogre Chieftain (Elite, Speed 4, a High Basic attack), an Orc Warrior (Standard), a Bandit Thug (Grunt) and three Goblin Sneaks (Minions, Low Health, Speed 7): CV 425, a little over a normal fight. **In SIM:** ${RUNS} fights a cell, stopped after round 4. **The table stopped in the middle of round 4** (only Sylwen and Kaela acted in it: 3 turns for the Paladins and for every enemy), so section 1 compares damage **a turn** and section 2 the state **after round 3**. **What is approximated:** the PCs are the ruler's four R builds, all Human (the table: Sylwen an Elf, Durgan a Dwarf), Kaela with her sheet's Shortbow and Skirmish Shot, and they follow their files' plans (the table also used Marksman's Shot, Skirmish Shot, Heartseeker, Covering Fire, Open Season, Beacon and a Shove); the NPCs use the Bestiary's Specials, not their own cards (Ground Slam, Rally the Tribe, Dirty Trick); the table's map isn't recorded (it had walls: a Push hit one), so three maps are shown.`, ""];
const CELLS = [["open field", "open", "plan"], ["pillars", "pillars", "plan"], ["close quarters", "closequarters", "plan"], ["pillars, the bigger enemies first", "pillars", "minionsLast"], ["pillars, a casual party", "pillars", "casual"]];
const res3 = {};
const res = {};
for (const [label, m, pk] of CELLS) { const map = { ...S.MAP, grid: S.MP.loadMap(m) }, R = S.rng(44), out = []; for (let k = 0; k < RUNS; k++) out.push(S.fight(party, npcs(), R, { map, maxRounds: 4, policy: S.POLICIES[pk], npcPolicy: S.planPolicy })); res[label] = out;
  const R3 = S.rng(44), o3 = []; for (let k = 0; k < RUNS; k++) o3.push(S.fight(party, npcs(), R3, { map, maxRounds: 3, policy: S.POLICIES[pk], npcPolicy: S.planPolicy })); res3[label] = o3; process.stderr.write(`${label}\n`); }
const col = (label, fn) => fn(res[label]);
L.push("## 1. Damage dealt a turn", "", "The table's damage a turn of its own (its total over the turns it had), then SIM's mean with the middle 80% of its fights (10th to 90th percentile) and where the table falls among SIM's fights.", "", `| Creature | The table | ${CELLS.map(c => c[0]).join(" | ")} |`, `|---|---:|${CELLS.map(() => "---").join("|")}|`);
const rank = (a, v) => pc(a.filter(x => x <= v).length / a.length), show = (a, v) => `${f1(mean(a))} (${f1(pctl(a, 0.1))} to ${f1(pctl(a, 0.9))}); the table is at ${rank(a, v)}`;
WHO.forEach((w, i) => { const v = TABLE.dealt[i] / TURNS[i]; L.push(`| ${w} | ${f1(v)} (${TABLE.dealt[i]} in ${TURNS[i]} turns) | ${CELLS.map(c => col(c[0], r => show(r.map(x => x.pcs[i].st.dealt / Math.max(1, x.pcs[i].st.rounds)), v))).join(" | ")} |`); });
{ const v = TABLE.dealt.reduce((s, x) => s + x, 0) / TURNS.reduce((s, x) => s + x, 0); L.push(`| A PC, on average | ${f1(v)} | ${CELLS.map(c => col(c[0], r => show(r.map(x => x.pcs.reduce((s, p) => s + p.st.dealt, 0) / Math.max(1, x.pcs.reduce((s, p) => s + p.st.rounds, 0))), v))).join(" | ")} |`); }
const turnsOf = f => Math.max(1, (f.escTurns ?? []).reduce((s, x) => s + x, 0)), foe = (r, name) => r.map(x => mean(x.W.foes.filter(f => f.name === name).map(f => (f.dealt ?? 0) / turnsOf(f))));
L.push(`| Ogre Chieftain | ${f1(TABLE.ogre / NPC_TURNS)} (${TABLE.ogre} in ${NPC_TURNS}) | ${CELLS.map(c => col(c[0], r => show(foe(r, "Ogre Chieftain"), TABLE.ogre / NPC_TURNS))).join(" | ")} |`);
L.push(`| A Goblin Sneak | ${f1(TABLE.goblin / NPC_TURNS)} (${TABLE.goblin} in ${NPC_TURNS}) | ${CELLS.map(c => col(c[0], r => { const a = foe(r, "Goblin Sneak"); return `${f1(mean(a))} (${f1(pctl(a, 0.1))} to ${f1(pctl(a, 0.9))})`; })).join(" | ")} |`);
L.push(`| Orc Warrior | not in the table's list | ${CELLS.map(c => col(c[0], r => f1(mean(foe(r, "Orc Warrior"))))).join(" | ")} |`, "");
const col3 = (label, fn) => fn(res3[label]);
L.push("## 2. After round 3: who is out, Reactions, heals", "", `| | The table | ${CELLS.map(c => c[0]).join(" | ")} |`, `|---|---|${CELLS.map(() => "---").join("|")}|`);
const out = (r, name) => mean(r.map(x => x.W.foes.filter(f => f.name === name && f.dead).length));
L.push(`| Goblin Sneaks out (of 3) | 1 | ${CELLS.map(c => col3(c[0], r => f1(out(r, "Goblin Sneak")))).join(" | ")} |`);
for (const [n, t] of [["Bandit Thug", "yes (round 1)"], ["Orc Warrior", "no"], ["Ogre Chieftain", "no"]]) L.push(`| ${n} out | ${t} | ${CELLS.map(c => col3(c[0], r => pc(out(r, n)))).join(" | ")} |`);
L.push(`| The fight is over (every enemy out) | no | ${CELLS.map(c => col3(c[0], r => pc(mean(r.map(x => (x.won ? 1 : 0)))))).join(" | ")} |`);
L.push(`| A PC is Down | no | ${CELLS.map(c => col3(c[0], r => pc(mean(r.map(x => (x.downs ? 1 : 0)))))).join(" | ")} |`);
WHO.forEach((w, i) => L.push(`| Reactions: ${w.split(" ")[0]} | ${TABLE.reactions[KEY[i]] - (KEY[i] === "Sylwen" ? 0 : 0)} | ${CELLS.map(c => col3(c[0], r => f1(mean(r.map(x => x.pcs[i].st.reactions))))).join(" | ")} |`));
L.push(`| Rally Points Durgan's Lay On Hands spent | 2 (10 and 13 Health) | ${CELLS.map(c => col3(c[0], r => f1(mean(r.map(x => x.pcs.reduce((s, p) => s + p.st.rpByAlly + p.st.rpSelf, 0)))))).join(" | ")} |`);
L.push(`| The party's Health lost | not recorded | ${CELLS.map(c => col3(c[0], r => pc(mean(r.map(x => x.lost))))).join(" | ")} |`, "");
// 3. Tiers.
const tiers = [0, 0, 0], ntiers = [0, 0, 0];
{ const map = { ...S.MAP, grid: S.MP.loadMap("pillars") }, R = S.rng(45); for (let k = 0; k < 300; k++) for (const e of S.fight(party, npcs(), R, { map, maxRounds: 4, log: true }).log) { if (e.type === "action" && !e.save && e.tier) tiers[e.tier - 1]++; if (e.type === "reaction" && e.tier) tiers[e.tier - 1]++; if (e.type === "attack" && e.tier) ntiers[e.tier - 1]++; } }
L.push("## 3. The dice: Tier 1 / 2 / 3 of the attack rolls", "", "| | The table | SIM (pillars, 300 fights) |", "|---|---|---|",
  `| The PCs' attack rolls | ${share(TABLE.tiers)} (${TABLE.tiers.reduce((s, x) => s + x, 0)} rolls) | ${share(tiers)} |`, `| The enemies' attack rolls | ${share(TABLE.npcTiers)} (${TABLE.npcTiers.reduce((s, x) => s + x, 0)} rolls) | ${share(ntiers)} |`, "");
// 4. Where the turns went.
const pcLines = text.split("\n").filter(l => new RegExp(`^- (${KEY.join("|")}):`).test(l)), tMoves = pcLines.reduce((s, l) => s + (l.match(/\b(Advance|Evade)\b/g) ?? []).length, 0), tTurns = TURNS.reduce((s, x) => s + x, 0);
let sRolls = 0, sTurns = 0, sMoves = 0, sDmg = 0, sEff = 0, sBig = 0, sBigRolls = 0;
{ const map = { ...S.MAP, grid: S.MP.loadMap("pillars") }, R = S.rng(46); for (let k = 0; k < 300; k++) { const f = S.fight(party, npcs(), R, { map, maxRounds: 4, log: true }), names = new Set(f.log[0].creatures.filter(c => c.side === "pc").map(c => c.name));
  sDmg += f.pcs.reduce((s, p) => s + p.st.dealt, 0); sEff += f.W.foes.reduce((s, x) => s + Math.min(x.damage, x.pool), 0);
  for (const e of f.log) if (e.type === "action" && e.tier && !e.save && names.has(e.who) && /^(Ogre|Orc)/.test(e.target ?? "")) { sBig += e.damage; sBigRolls++; }
  for (const e of f.log) { if (e.type === "turn" && names.has(e.who)) sTurns++; if ((e.type === "action" || e.type === "reaction") && e.tier && !e.save && names.has(e.who)) sRolls++; if (e.type === "move" && names.has(e.who)) sMoves++; } } }
const tRolls = TABLE.tiers.reduce((s, x) => s + x, 0), tDmg = TABLE.dealt.reduce((s, x) => s + x, 0);
L.push("## 4. Where the gap comes from", "", "| The four PCs | The table | SIM (pillars, 300 fights) | SIM over the table |", "|---|---:|---:|---:|",
  `| Damage a PC turn | ${f1(tDmg / tTurns)} | ${f1(sDmg / sTurns)} | +${Math.round(100 * (sDmg / sTurns / (tDmg / tTurns) - 1))}% |`,
  `| Attack rolls a PC turn (its Reactions' rolls too) | ${f1(tRolls / tTurns)} | ${f1(sRolls / sTurns)} | +${Math.round(100 * (sRolls / sTurns / (tRolls / tTurns) - 1))}% |`,
  `| Damage an attack roll | ${f1(tDmg / tRolls)} | ${f1(sDmg / sRolls)} | +${Math.round(100 * (sDmg / sRolls / (tDmg / tRolls) - 1))}% |`,
  `| ... counting only what an enemy's Health could take (no damage past its last point) | at most ${f1(tDmg / tRolls)} | ${f1(sEff / sRolls)} | +${Math.round(100 * (sEff / sRolls / (tDmg / tRolls) - 1))}% |`,
  `| ... a PC's own attack roll against the Ogre or the Orc | | ${f1(sBig / sBigRolls)} | |`,
  `| Moves a PC turn (an Advance or an Evade) | ${f1(tMoves / tTurns)} | ${f1(sMoves / sTurns)} | |`, "",
  `**The PCs roll as often in SIM as at the table; the gap is in the damage counted for a roll.** SIM counts every point rolled, also past an enemy's last point of Health: its PCs kill the three Goblins (5 Health each) and the Thug with whole hits and the Orc by round 3, and about a quarter of what they roll is lost that way. The table killed one Goblin and the Thug and put the rest into the Ogre and the Orc, so nearly all it rolled counted. Counted against Health, a roll is worth the same in both. What is left is real and is a decision, not a rule: against the Ogre and the Orc a SIM roll is bigger (the builds take the larger Versions and their Escalation Passives every turn: Rolling Shot at 2 AP with its extra die where Kaela used the 1 AP one), and ${tRolls} rolls are too few to say how much (one roll's damage varies by about 6: the table's average is known to about 1 either way).`, "");
// 5. One fight in the table's format.
const one = S.fight(party, npcs(), S.rng(4), { map: { ...S.MAP, grid: S.MP.loadMap("pillars") }, maxRounds: 4, log: true });
L.push("## 5. One SIM fight in the table's format (pillars, seed 4)", "", "```", playtestText(one.log), "```", "");
fs.writeFileSync(RULER + "playtest-4-sim.md", L.join("\n")); console.log(L.join("\n"));
