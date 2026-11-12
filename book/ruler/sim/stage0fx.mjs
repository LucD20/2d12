// The Bestiary's turn budget (2026-11-12): stage0.md's sections on enemies that do more than damage. stage0.mjs calls it.
import { S, party, fights, cell, mean, f1, pc } from "./stage0lib.mjs";
import * as B from "./budget.mjs";
import { STANDARDS, ROLES, RANKS, plain } from "./designs.mjs";

const P0 = B.PRICES();
const mk = (rank, d, P = P0) => B.npcBuilt(rank, d, P);
const cycle = (k, list = STANDARDS, f = x => x) => Array.from({ length: k }, (_, i) => mk("standard", f(list[i % list.length])));
const s0 = (role, k, o = {}) => Array.from({ length: k }, () => S.npcS0(role, "medium", o));

export function sections(L, log, N) {
  const run = (lv, gen, n = N) => fights(party(lv), gen, { n });
  /* 9 */
  L.push("## 9. Enemies that do more than damage (the turn budget)", "",
    "The Bestiary since this pack builds an NPC's Actions on a **turn budget** (`book/ruler/budget.md`, `sim/budget.mjs`; the price list is the system's `config.mjs npcBudget`). The Standards below are four of the Bestiary's kind of creature, each built on the budget (Basic attack and 2 AP Round Special, the riders paid from their points): **Raider** (Push 1 on its Basic attack, Prone on its Special), **Hexer** (Vs. WD and [R]; Slowed 1), **Cutter** (Bleed 1d4), **Guard** (1 Pressure Bane; Push 2; a 1R Reaction that strikes back when it is hit). An encounter of 4 has one of each; 3, 5 and 6 take them in that order. **Damage only** is the Bestiary's damage table of before (the yardstick). Momentum 0. Cells: " + "rounds · Health lost · cost · a PC Down · won.", "",
    "| Level | Enemies | 3 Standards (easy) | 4 (normal) | 5 (hard) | 6 (deadly) |", "|---:|---|---|---|---|---|");
  const FX9 = {};
  for (const lv of [1, 2, 3]) for (const [name, gen] of [["damage only", k => () => s0("standard", k)], ["with effects", k => () => cycle(k)]]) {
    const cells = [3, 4, 5, 6].map(k => { const r = run(lv, gen(k)); (FX9[name] ??= {})[`${lv}|${k}`] = r; return cell(r); });
    L.push(`| ${lv} | ${name} | ${cells.join(" | ")} |`); log(`effects level ${lv} ${name}`);
  }
  L.push("");
  /* 10 */
  L.push("## 10. The four Ranks with effects", "", "Levels 1 and 2 (the mean). **With effects:** every NPC on the budget with riders (a Minion: Push 1, Hindered; a Grunt: Push 1, Vulnerable 1; a Standard: the four above in turn; an Elite: Push 1, Prone, a 3 AP Encounter area with Slowed 1 and its pay-back, a 1R Reaction). **Damage only:** the same budget with no riders and no Reaction. Cells: cost · a PC Down · won.", "",
    "| Encounter (CV) | Damage only (the table before) | Damage only, on the budget | With effects |", "|---|---|---|---|");
  const two = gen => { const a = run(1, gen), b = run(2, gen); return { cost: (a.cost + b.cost) / 2, down: (a.down + b.down) / 2, won: (a.won + b.won) / 2 }; };
  const c3 = r => `${pc(r.cost)} · ${pc(r.down)} · ${pc(r.won)}`;
  const RK = {};
  const ENCS = [["4 Standards (400)", [["standard", 4]]], ["2 Elites (400)", [["elite", 2]]], ["1 Elite + 2 Standards (400)", [["elite", 1], ["standard", 2]]], ["8 Grunts (400)", [["grunt", 8]]], ["2 Standards + 8 Minions (400)", [["standard", 2], ["minion", 8]]], ["16 Minions (400)", [["minion", 16]]], ["6 Standards (600)", [["standard", 6]]], ["3 Elites (600)", [["elite", 3]]], ["12 Grunts (600)", [["grunt", 12]]], ["4 Standards + 8 Minions (600)", [["standard", 4], ["minion", 8]]]];
  for (const [name, list] of ENCS) {
    const g = kind => () => list.flatMap(([role, k]) => (kind === "table" ? s0(role, k) : role === "standard" ? cycle(k, STANDARDS, kind === "plain" ? plain : x => x) : Array.from({ length: k }, () => mk(role, kind === "plain" ? plain(RANKS[role]) : RANKS[role]))));
    const r = ["table", "plain", "fx"].map(kind => two(g(kind))); RK[name] = r;
    L.push(`| ${name} | ${r.map(c3).join(" | ")} |`); log(`rank ${name}`);
  }
  L.push("");
  /* 11 */
  L.push("## 11. The six Roles with what makes them (level 2)", "", "Four of a Role (the Leader: one Leader with three Standards with effects, against four Standards with effects), and six for the deadly fight. Each Role has its ratings (the Bestiary's Roles table) and is built on the budget: the **Soldier** with Hold the Line (1R, Trigger: a PC's Strike hits an ally within 2: it attacks that PC) and Immobilized on its Special; the **Controller** with Frightened and Dazed 1 (Vs. WD); the **Leader** with Rally (1 AP, Round: its allies within 5 gain 1 Boon on their next attack, 9 points taken from its Special). Plain Standards with effects: the first row. Cells: cost · a PC Down · won.", "",
    "| Role | Normal (4) | Deadly (6) |", "|---|---|---|");
  const plainSet = [run(2, () => cycle(4)), run(2, () => cycle(6))];
  L.push(`| Standards with effects | ${plainSet.map(c3).join(" | ")} |`);
  const RL = {};
  for (const [name, d] of Object.entries(ROLES)) {
    const gen = k => () => (name === "Leader" ? [mk("standard", d), ...cycle(k - 1)] : Array.from({ length: k }, () => mk("standard", d)));
    const r = [run(2, gen(4)), run(2, gen(6))]; RL[name] = r; L.push(`| ${name} | ${r.map(c3).join(" | ")} |`); log(`role ${name}`);
  }
  L.push("");
  /* 12 */
  L.push("## 12. Grunts and Minions, settled on these numbers", "", "**Grunts** (with effects): today's points an AP (17), one rating up (20: candidate (a) of the backlog), Health 30 with only the Round Special one rating up (candidate (b)), and a Standard's points an AP (25). **Minions** (with effects): their points an AP (15 today, 18), and a Minion's High Defense at one point a rating (10 / 11 / 12 / 13) against today's 14. Levels 1 and 2. Cells: cost · a PC Down · won.", "",
    "| Grunts | 8 Grunts (400) | 2 Standards + 4 Grunts (400) | 12 Grunts (600) | 4 Standards + 4 Grunts (600) |", "|---|---|---|---|---|");
  const GR = {};
  const PG = x => ({ ...P0, perAp: { ...P0.perAp, grunt: x } });
  for (const [name, P, d, npc] of [["17 an AP (the table's Grunt, on the budget)", PG(17), RANKS.grunt, {}], ["(a) 20 an AP (a rating up)", PG(20), RANKS.grunt, {}], ["(b) Health 30, the Round Special a rating up", PG(17), { ...RANKS.grunt, acts: RANKS.grunt.acts.map(a => (a.freq === "round" ? { ...a, pts: B.actionPoints("grunt", 1, "round", "high", PG(17)) } : a)) }, { vrating: "high", rrating: "high" }], ["**chosen: 25 an AP (a Standard's), Health 26**", PG(25), RANKS.grunt, {}]]) {
    const gs = k => Array.from({ length: k }, () => B.npcBuilt("grunt", { ...d, npc }, P));
    const r = [two(() => gs(8)), two(() => [...cycle(2), ...gs(4)]), two(() => gs(12)), two(() => [...cycle(4), ...gs(4)])]; GR[name] = r;
    L.push(`| ${name} | ${r.map(c3).join(" | ")} |`); log(`grunt ${name}`);
  }
  L.push("", "| Minions | 16 Minions (400) | 2 Standards + 8 Minions (400) | 4 Standards + 8 Minions (600) |", "|---|---|---|---|");
  const MN = {};
  const PM = x => ({ ...P0, perAp: { ...P0.perAp, minion: x } });
  for (const [label, def, P] of [["15 an AP, Defense 12 (Medium)", 12, PM(15)], ["18 an AP, Defense 12 (Medium)", 12, PM(18)], ["18 an AP, Defense 13 (High at one point a rating)", 13, PM(18)], ["18 an AP, Defense 14 (today's High)", 14, PM(18)]]) {
    const ms = k => Array.from({ length: k }, () => { const n = B.npcBuilt("minion", RANKS.minion, P); n.ad = def; n.wd = def; return n; });
    const r = [two(() => ms(16)), two(() => [...cycle(2), ...ms(8)]), two(() => [...cycle(4), ...ms(8)])]; MN[label] = r;
    L.push(`| ${label} | ${r.map(c3).join(" | ")} |`); log(`minion ${label}`);
  }
  L.push("");
  return { FX9, RK, RL, GR, MN };
}
