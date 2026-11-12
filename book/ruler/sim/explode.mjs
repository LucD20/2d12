// Exploding damage dice, "explode -1" as the 2d12 do (Lucas's idea, 2026-11-12; a measurement, nothing applied). Writes ../explode.md.
//   node book/ruler/sim/explode.mjs      (about 4 minutes)
// RULES.explode: a PC's weapon die; a Standard's or an Elite's Basic attack, and an Action with the trait (3 points, a Mild rider's price). Minor enemies never.
import fs from "node:fs";
import { S, party, fights, cell, pc, f1 } from "./stage0lib.mjs";
import * as B from "./budget.mjs";
import { STANDARDS, RANKS } from "./designs.mjs";
const N = 800, out = [], t0 = Date.now();
const set = v => { if (v) S.RULES.explode = v; else delete S.RULES.explode; };
const cyc = (k, f = x => x) => Array.from({ length: k }, (_, i) => B.npcBuilt("standard", f(STANDARDS[i % 4])));
const trait = d => ({ ...d, acts: d.acts.map(a => (a.freq === "round" ? { ...a, explode: true } : a)) });
out.push("# Exploding damage dice (explode -1)", "", "Written by `node book/ruler/sim/explode.mjs`. **A measurement, nothing applied.** A die that explodes counts its top face as one less and is rolled again, as a 12 does on the 2d12: every die gains exactly 0.5 on average. **Who explodes:** a PC's weapon die only (not Smite, not a Passive's extra dice); a Standard's or an Elite's Basic attack always, its other Actions only with the trait (3 points: a Mild rider's price); Minions and Grunts never. " + `${N} fights a cell, no Momentum. Cells: rounds · Health lost · cost · a PC Down · won.`, "");
// 1. turns
out.push("## 1. A PC's turn (Defense 13, Escalation 2)", "", "| Build | Level | Today | Exploding | Change |", "|---|---:|---:|---:|---:|");
for (const lv of [1, 2]) for (const b of party(lv)) { const turn = b.plan.at(-1).split("|")[0].trim(); const r = v => { set(v); const x = S.turnDamage(b, turn, 13, { escalation: 2 }).avg; set(null); return x; }; const a = r(null), e = r("all"); out.push(`| ${b.name} | ${lv} | ${f1(a)} | ${f1(e)} | +${f1(e - a)} (${pc(e / a - 1)}) |`); }
out.push("", "An enemy's turn against a level 1 Paladin (no move, no Encounter Action):", "", "| Enemy | Today | Exploding |", "|---|---:|---:|");
for (const role of ["grunt", "standard", "elite"]) { const b = party(1)[0], r = v => { set(v); const x = S.npcTurn(S.npcS0(role), b); set(null); return x; }; out.push(`| ${role} | ${f1(r(null))} | ${f1(r("all"))} |`); }
out.push("");
// 2. fights
const ENC = [["4 Standards (normal)", () => cyc(4)], ["5 Standards (hard)", () => cyc(5)], ["6 Standards (deadly)", () => cyc(6)]];
out.push("## 2. The fights, enemies with effects", "", "| Level | Dice | " + ENC.map(e => e[0]).join(" | ") + " |", "|---:|---|---|---|---|");
for (const lv of [1, 2, 3]) for (const [label, v, f] of [["today", null, null], ["exploding", "all", null], ["exploding, the trait on the 2 AP Special too", "all", trait]]) {
  set(v); out.push(`| ${lv} | ${label} | ${ENC.map(([, g], i) => cell(fights(party(lv), f ? () => cyc(4 + i, f) : g, { n: N }))).join(" | ")} |`); set(null);
  process.stderr.write(`level ${lv} ${label} (${Math.round((Date.now() - t0) / 1000)} s)\n`); }
out.push("");
// 3. who gains
out.push("## 3. Who gains (level 2)", "", "| Dice | 4 Standards | 6 Standards |", "|---|---|---|");
for (const [label, v] of [["today", null], ["only the PCs' weapon dice", "pc"], ["only the enemies' Basic attacks", "npc"], ["both", "all"]]) { set(v); out.push(`| ${label} | ${cell(fights(party(2), () => cyc(4), { n: N }))} | ${cell(fights(party(2), () => cyc(6), { n: N }))} |`); set(null); }
out.push("");
// 4. the ranks
const mkR = (role, k) => Array.from({ length: k }, () => B.npcBuilt(role, RANKS[role]));
const MIX = [["2 Elites", () => mkR("elite", 2)], ["8 Grunts", () => mkR("grunt", 8)], ["2 Standards + 8 Minions", () => [...cyc(2), ...mkR("minion", 8)]], ["3 Elites", () => mkR("elite", 3)], ["12 Grunts", () => mkR("grunt", 12)], ["4 Standards + 4 Grunts", () => [...cyc(4), ...mkR("grunt", 4)]]];
out.push("## 4. The ranks (level 2, with effects; minor enemies don't explode)", "", "| Encounter | Today | Exploding |", "|---|---|---|");
for (const [name, g] of MIX) { const r = v => { set(v); const x = cell(fights(party(2), g, { n: N })); set(null); return x; }; out.push(`| ${name} | ${r(null)} | ${r("all")} |`); process.stderr.write(`${name}\n`); }
// 5. the damage-only table
out.push("", "## 5. The damage-only Standards (the table of before; its Basic attack explodes)", "", "| Level | Dice | 4 | 6 |", "|---:|---|---|---|");
for (const lv of [1, 2, 3]) for (const [label, v] of [["today", null], ["exploding", "all"]]) { set(v); out.push(`| ${lv} | ${label} | ${cell(fights(party(lv), () => Array.from({ length: 4 }, () => S.npcS0("standard")), { n: N }))} | ${cell(fights(party(lv), () => Array.from({ length: 6 }, () => S.npcS0("standard")), { n: N }))} |`); set(null); }
fs.writeFileSync(new URL("../explode.md", import.meta.url), out.join("\n") + `\n\n(${f1((Date.now() - t0) / 60000)} minutes.)\n`);
