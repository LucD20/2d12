// The Bestiary's turn budget: the calibration (pack "The Bestiary's turn budget", 2026-11-12). It writes ../budget.md.
//   node book/ruler/sim/calib.mjs            (about 25 minutes; --quick: fewer fights, a draft)
// Every number is a worth in points of a Medium Standard's turn (its budget is 100): the yardstick is today's damage-only Standard (Basic attack 25,
// 2 AP Round Special 55) with its damage scaled; a design that costs the party (its Health with the Rally Points spent) what the yardstick does at
// d is worth 100 × d. Four of a design against the level 1, 2 and 3 parties of stage0lib.mjs (the R builds cut to Stage 0), the plan policy.
import fs from "node:fs";
import process from "node:process";
import { S, B, B0, free, team, worth, perUse, mean } from "./calibLib.mjs";
const QUICK = process.argv.includes("--quick"), N = QUICK ? 300 : 1000, NM = QUICK ? 150 : 300, t0 = Date.now();
const log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`);
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f0 = x => (Number.isFinite(x) ? Math.round(x).toString() : "-"), pc = x => `${Math.round(x * 100)}%`;
const out = [];
const W = (d, o = {}) => worth(team(o.rank ?? "standard", d, o.k ?? 4, o.P), { n: o.n ?? N, maps: o.maps ?? ["open"], lvls: o.lvls ?? [1, 2, 3], enc: o.k ?? 4 });

out.push(`# The Bestiary's turn budget: the calibration

Written by \`node book/ruler/sim/calib.mjs\`; don't edit, run it again. ${N} fights a cell, levels 1, 2 and 3 of \`stage0.md\` (no Momentum), the plan policy, on the open field unless a map is named.

**The unit:** points of a Medium Standard's turn (its budget is 100). **The yardstick** is today's damage-only Standard (Basic attack 25 points, 2 AP Round Special 55: exactly the Bestiary's table) with its damage scaled by d; a design that costs the party what the yardstick costs at d (the party's Health lost, with the Rally Points it spent) is **worth 100 × d**. A rider is measured added for free on both of the yardstick's Actions: what it adds, over how often it lands, is **its worth when it lands**; times how often an Action with it lands is **its worth on an Action** (the price).
`);

/* ---------------------------------------------------------------- 1. the yardstick */
const w0 = W(B0());
out.push(`## 1. The yardstick

Four of today's Standards: worth ${f1(w0.worth)} (should be 100: the noise of the method), the party's cost ${pc(w0.cost)}, a PC Down in ${pc(w0.down)}. A Basic attack is 25 points: Tier 2 / Tier 3 averages are points × 0.14 / × 0.22 (25 points: 1 + 1d4 / 2 + 1d6; 55: 4 + 1d6 / 8 + 1d8, the table's 2 AP Special exactly).
`);
log("yardstick");

/* ---------------------------------------------------------------- 2. conditions */
const CONDS = [
  ["mild", "Hindered (EoT)"], ["mild", "Pressure Bane (next roll)"], ["mild", "Taunted"], ["mild", "Bleed 2"],
  ["moderate", "Staggered (EoT)"], ["moderate", "Vulnerable 1"], ["moderate", "Immobilized (EoT)"], ["moderate", "Immobilized"], ["moderate", "Dazed 1"], ["moderate", "Bleed 1d4"], ["moderate", "Frightened (EoT)"],
  ["severe", "Prone"], ["severe", "Slowed 1"], ["severe", "Vulnerable 2"], ["severe", "Doomed (next roll)"], ["severe", "Blinded (EoT)"],
  ["beyond", "Slowed 2"], ["beyond", "Dazed 2"], ["beyond", "Bleed 2d6"],
];
const both = rs => ({ acts: [{ name: "Basic", ap: 1, pts: 25, riders: free(rs) }, { name: "Special", ap: 2, freq: "round", pts: 55, riders: free(rs) }] });
const CW = {};
out.push(`## 2. Conditions as riders (on a hit: Tier 2 or 3)

| Group in the Bestiary today | Condition | Lands a fight | Wasted (it had it) | Worth a turn | Worth when it lands | On an Action (the price) |
|---|---|---:|---:|---:|---:|---:|`);
for (const [sev, eff] of CONDS) {
  const w = W(both([{ eff, sev }])), land = w.fx.cond ?? 0, tried = (w.fx.cond ?? 0) + (w.fx.wasted ?? 0), uses = w.fx.uses ?? 1;
  const per = perUse(w, "cond"), onAct = per * land / uses;
  CW[eff] = { sev, per, onAct, land: land / uses };
  out.push(`| ${sev} | ${eff} | ${f1(land)} | ${f1(w.fx.wasted ?? 0)} | ${f1(w.worth - 100)} | ${f1(per)} | ${f1(onAct)} |`);
  log(eff);
}
const groupMean = g => mean(CONDS.filter(c => c[0] === g).map(c => CW[c[1]].onAct));
out.push(`\nMean price on an Action by today's group: Mild ${f1(groupMean("mild"))}, Moderate ${f1(groupMean("moderate"))}, Severe ${f1(groupMean("severe"))}, beyond ${f1(groupMean("beyond"))}. An Action lands about ${pc(mean(Object.values(CW).map(c => c.land)))} of the time (a hit on a PC that hasn't it yet).
`);

/* ---------------------------------------------------------------- 3. placement */
out.push(`## 3. Where the effect is: Setup, a hit, Tier 3 only

The worth a turn of the condition on both Actions, by where it is.

| Condition | Setup (always) | On a hit (Tier 2 or 3) | Tier 3 only | Setup ÷ hit | Tier 3 ÷ hit |
|---|---:|---:|---:|---:|---:|`);
const PLACE = {};
for (const [sev, eff] of [["severe", "Prone"], ["moderate", "Frightened (EoT)"], ["moderate", "Vulnerable 1"], ["severe", "Slowed 1"]]) {
  const r = Object.fromEntries(["setup", "hit", "t3"].map(at => [at, W(both([{ eff, sev, at }])).worth - 100]));
  PLACE[eff] = r; out.push(`| ${eff} | ${f1(r.setup)} | ${f1(r.hit)} | ${f1(r.t3)} | ${f1(r.setup / r.hit)} | ${f1(r.t3 / r.hit)} |`); log(`placement ${eff}`);
}
out.push(`\nMean: Setup is ${f1(mean(Object.values(PLACE).map(r => r.setup / r.hit)))} times a hit, Tier 3 only ${f1(mean(Object.values(PLACE).map(r => r.t3 / r.hit)))} times.
`);

/* ---------------------------------------------------------------- 4. forced movement and Collision */
const MAPS = ["open", "pillars", "corridor", "closequarters"];
out.push(`## 4. Forced movement and Collision

A Push on both Actions, measured on the open field and on maps with walls. **The GM pushes when it hurts** (into a wall or another PC: a Collision) and otherwise leaves the PC where it is; "always" pushes every hit (a melee enemy pushing its own target away). Collision today: 2 a square not moved into a wall, 1 to each creature; higher: 4 and 2. Cells: worth a turn · Collision damage a fight · pushes a fight (${NM} fights a cell on a map).

| Rider | Collision | ${MAPS.join(" | ")} |
|---|---|${MAPS.map(() => "---").join("|")}|`);
const FM = {};
const COL0 = { ...S.TW.collision };
for (const [col, label] of [[COL0, "today (2 / 1)"], [{ wall: 4, creature: 2 }, "higher (4 / 2)"]]) for (const push of ["Push 1", "Push 2", "Push 3"]) {
  Object.assign(S.TW.collision, col);
  const cells = MAPS.map(m => { const w = W(both([{ eff: push, sev: "forced" }]), { maps: [m], n: NM }); (FM[`${push}|${label}`] ??= {})[m] = w; return `${f1(w.worth - 100)} · ${f1(w.fx.collision ?? 0)} · ${f1(w.fx.forced ?? 0)}`; });
  out.push(`| ${push} | ${label} | ${cells.join(" | ")} |`); log(`${push} ${label}`);
}
Object.assign(S.TW.collision, COL0);
S.RULES.forcedUse = "always";
const alw = MAPS.map(m => W(both([{ eff: "Push 2", sev: "forced" }]), { maps: [m], n: NM }));
out.push(`| Push 2, always | today (2 / 1) | ${alw.map(w => `${f1(w.worth - 100)} · ${f1(w.fx.collision ?? 0)} · ${f1(w.fx.forced ?? 0)}`).join(" | ")} |`);
delete S.RULES.forcedUse; log("push always");
out.push("");

/* ---------------------------------------------------------------- 5. AP and Frequency */
const P = B.PRICES();
const DESIGNS = [
  ["Basic attack only", [{ name: "Basic", ap: 1 }]],
  ["Basic + 1 AP Round", [{ name: "Basic", ap: 1 }, { name: "Jab", ap: 1, freq: "round" }]],
  ["Basic + 2 AP Round (today's shape)", [{ name: "Basic", ap: 1 }, { name: "Special", ap: 2, freq: "round" }]],
  ["Basic + 1 AP Round + 2 AP Round", [{ name: "Basic", ap: 1 }, { name: "Jab", ap: 1, freq: "round" }, { name: "Special", ap: 2, freq: "round" }]],
  ["Basic + 2 AP At-will", [{ name: "Basic", ap: 1 }, { name: "Heavy", ap: 2 }]],
  ["Basic + 3 AP Round", [{ name: "Basic", ap: 1 }, { name: "Big", ap: 3, freq: "round" }]],
  ["Two 1 AP At-will Actions (no At-will Bane between them)", [{ name: "Basic", ap: 1 }, { name: "Other", ap: 1 }]],
];
out.push(`## 5. AP and Frequency: designs on the price list

Each design is priced by the list (${P.perAp.standard} points an AP; +${pc(P.round)} for Round; +${pc(P.size[3])} for 3 AP; a 2 AP Action needs no premium: it is already better than two Basic attacks, the second of which takes the At-will Bane). Its best turn (no move) against the budget (100), and its worth.

| Design | Its Actions (points) | Best turn | Worth | Normal fight: cost · a PC Down | Deadly (6): won |
|---|---|---:|---:|---|---:|`);
const DW = {};
for (const [name, acts] of DESIGNS) {
  const d = { acts }, n = B.npcBuilt("standard", d, P), bt = B.bestTurn("standard", d, P), w = W(d), wd = W(d, { k: 6, n: Math.round(N / 2) });
  DW[name] = w; out.push(`| ${name} | ${n.acts.map(a => `${a.name} ${f0(a.pts)}`).join(", ")} | ${f0(bt.best)} | ${f1(w.worth)} | ${pc(w.cost)} · ${pc(w.down)} | ${pc(wd.won)} |`); log(name);
}
out.push(`
### The Encounter Action: double, and its pay-back

Today's shape (Basic attack, 2 AP Round Special) with an Encounter Action at double the Round price of its AP. **Pay-back, on Standards, in points:** points off every one of the creature's other Actions (Level Up A5E's rule, "for every 2 points over the budget take 1 off the other turns", would be about 20 to 30 here). Cells: worth · a PC Down in a normal fight (the plain shape: a PC Down in about 9%).

| Encounter Action | Pay-back 0 | 20 | 40 | 60 | 80 |
|---|---|---|---|---|---|`);
const ENC = {};
for (const [label, ap, extra, Px] of [["1 AP, one target", 1, {}, P], ["2 AP, one target", 2, {}, P], ["3 AP, one target", 3, {}, P], ["2 AP, an area (up to 3 PCs within 2 of the target, half each)", 2, { area: { n: 3, r: 2 } }, P], ["3 AP, an area (the same)", 3, { area: { n: 3, r: 2 } }, P], ["3 AP, one target, at 1.5 × the Round one (not double: for comparison)", 3, {}, { ...P, encounter: 1.5 }]]) {
  const cells = [0, 20, 40, 60, 80].map(pb => { const w = W({ acts: [{ name: "Basic", ap: 1 }, { name: "Special", ap: 2, freq: "round" }, { name: "Nova", ap, freq: "enc", ...extra }], payBack: pb }, { P: Px }); (ENC[label] ??= []).push(w); return `${f1(w.worth)} · ${pc(w.down)}`; });
  out.push(`| ${label} | ${cells.join(" | ")} |`); log(`encounter ${label.slice(0, 12)}`);
}
// On Elites (they are the ones with Encounter Actions; their fights are longer and the Action comes back at Escalation 6): the share every other Action loses.
{
  const { party, fights } = await import("./stage0lib.mjs");
  const two = g => { const x = fights(party(1), g, { n: NM * 2 }), y = fights(party(2), g, { n: NM * 2 }); return { cost: (x.cost + y.cost) / 2, down: (x.down + y.down) / 2, won: (x.won + y.won) / 2 }; };
  const eb = [{ name: "Basic", ap: 1 }, { name: "Special", ap: 2, freq: "round" }], bud = B.turnBudget("elite");
  const el = (enc, share) => k => () => Array.from({ length: k }, () => B.npcBuilt("elite", { acts: enc ? [...eb, enc] : eb, ...(share != null ? { payBack: share * bud } : {}) }));
  const c2 = g => { const x = two(g(2)), y = two(g(3)); return `${pc(x.cost)} · ${pc(x.down)} / ${pc(y.won)}`; };
  out.push(`
**The pay-back fitted on Elites** (the share every other Action and the Reaction lose). Cells: two Elites, cost · a PC Down / three Elites, won. An Elite with no Encounter Action: ${c2(el(null, null))}.

| Encounter Action | Share 0 | 0.1 | 0.2 | 0.25 | 0.3 | 0.5 |
|---|---|---|---|---|---|---|`);
  for (const [label, enc] of [["1 AP, one target", { name: "Nova", ap: 1, freq: "enc" }], ["2 AP, an area (up to 3 PCs within 2, half each)", { name: "Nova", ap: 2, freq: "enc", area: { n: 3, r: 2 } }], ["3 AP, an area (the same)", { name: "Nova", ap: 3, freq: "enc", area: { n: 3, r: 2 } }], ["2 AP, one target", { name: "Nova", ap: 2, freq: "enc" }]]) {
    out.push(`| ${label} | ${[0, 0.1, 0.2, 0.25, 0.3, 0.5].map(sh => c2(el(enc, sh))).join(" | ")} |`); log(`elite pay-back ${label.slice(0, 8)}`);
  }
  out.push(`\nChosen (config.mjs npcBudget.payBack): ${P.payBack.slice(1).map((x, i) => `${i + 1} AP ${x}`).join(", ")}.`);
}
out.push("");

/* ---------------------------------------------------------------- 6. Reactions */
const RX = [
  ["struck", "Trigger: a PC's Strike hits it: an attack back", { trigger: "struck" }],
  ["allyHit", "Trigger: a PC's Strike hits an ally within 2: it attacks that PC (Hold the Line)", { trigger: "allyHit", range: 2 }],
  ["allyStruck", "Interrupt: a PC makes a Strike against an ally next to it: +2 Defense against it (a shield)", { trigger: "allyStruck", range: 1, def: 2 }],
  ["approach", "Interrupt: a PC would enter a square next to it: it attacks first", { trigger: "approach" }],
];
out.push(`## 6. Reactions

The yardstick with a Reaction. Its attack has a Round Action's points of its cost (1R: ${f0(B.actionPoints("standard", 1, "round"))}; 2R: ${f0(B.actionPoints("standard", 2, "round"))}, and the creature keeps 1 AP from its turn for it). **Paid:** the turn gives up ${pc(P.reaction.self)} of the Reaction's points for one that answers its own being hit, ${pc(P.reaction.other)} for one on an ally or a movement, nothing more for a 2R one (the AP it keeps is its price). **Free:** nothing taken from the turn.

| Reaction | Cost | Fires a fight (per creature) | In what share of its rounds | Worth, free | Worth, paid |
|---|---|---:|---:|---:|---:|`);
const RW = {};
for (const [k, label, rx] of RX) for (const cost of k === "allyStruck" ? [1] : [1, 2]) {
  const r = { name: k, cost, ...rx, act: rx.def ? null : { name: `${k} attack` } };
  const wf = W({ ...B0(), reaction: { ...r, give: 0 } }), wp = W({ ...B0(), reaction: r });
  const rounds = (wf.fx.turns ?? 1) / 4, fires = (wf.fx.reactions ?? 0) / 4;
  RW[`${k}|${cost}`] = { wf, wp, share: fires / rounds };
  out.push(`| ${label} | ${cost}R | ${f1(fires)} | ${pc(fires / rounds)} | ${f1(wf.worth - 100)} | ${f1(wp.worth - 100)} |`); log(`reaction ${k} ${cost}`);
}
out.push("");

/* ---------------------------------------------------------------- 7. helps and areas */
const mix = d => () => [B.npcBuilt("standard", d), ...[1, 2, 3].map(() => B.npcBuilt("standard", B0()))];
const WM = d => worth(mix(d), { n: N });
const plainMix = WM(B0());
out.push(`## 7. Actions with no damage, and Actions that hit several creatures

**Helps** are measured as one creature among three of the yardstick (cells: the encounter's worth, a mean of its four creatures; the four yardsticks: ${f1(plainMix.worth)}).

| Design (the help added for free, on top of the yardstick's Actions) | What it did a fight | Worth of the encounter |
|---|---|---:|`);
for (const [name, act, key] of [
  ["Rally (1 AP, Round): its allies within 5 gain 1 Boon on their next attack", { name: "Rally", ap: 1, freq: "round", kind: "help", buff: { boons: 1 } }, "buffed"],
  ["Rally (1 AP, Round): 2 Boons", { name: "Rally", ap: 1, freq: "round", kind: "help", buff: { boons: 2 } }, "buffed"],
  ["Mend (1 AP, Round): the most hurt ally heals 4 + 1d6", { name: "Mend", ap: 1, freq: "round", kind: "help", heal: "4 + 1d6" }, "healed"],
]) { const w = WM({ acts: [...B0().acts, act] }); out.push(`| ${name} | ${f1(w.fx[key] ?? 0)} ${key === "buffed" ? "allies helped" : "Health healed"} | ${f1(w.worth)} |`); log(name.slice(0, 10)); }
out.push(`
**Areas:** the yardstick's 2 AP Special as an area that hits up to 3 PCs near its target, by the share each takes.

| Area | Share each | PCs hit a use | Worth |
|---|---:|---:|---:|`);
for (const r of [1, 2]) for (const share of [0.5, 0.67]) {
  const w = W({ acts: [{ name: "Basic", ap: 1, pts: 25 }, { name: "Sweep", ap: 2, freq: "round", pts: 55, area: { n: 3, r } }] }, { P: { ...P, multi: share } });
  out.push(`| within ${r} of the target | ${pc(share)} | ${f1((w.fx.areaHits ?? 0) / Math.max(1e-9, w.fx.areaUses ?? 1))} | ${f1(w.worth)} |`); log(`area ${r} ${share}`);
}
out.push("");

/* ---------------------------------------------------------------- 8. Grunts and their Reaction AP */
const G0 = { acts: [{ name: "Basic", ap: 1, pts: 17 }, { name: "Jab", ap: 1, freq: "round", pts: 24 }] };
const wg = rx => worth(team("grunt", { ...G0, ...(rx ? { reaction: rx } : {}) }, 8), { n: N });
const g0 = wg(null), g1 = wg({ name: "struck", cost: 1, trigger: "struck", give: 0, act: { name: "back" } }), g2 = wg({ name: "struck", cost: 1, trigger: "struck", act: { name: "back" } });
out.push(`## 8. Grunts and their Reaction AP

Eight of today's Grunts (3 AP: Basic attack 17 points, 1 AP Round Special 24), measured against the yardstick's four Standards (a worth of 100 is what four Standards cost): today, no Reaction: ${f1(g0.worth)}; with a 1R Trigger (hit: an attack back), free: ${f1(g1.worth)} (it fires ${f1((g1.fx.reactions ?? 0) / 8)} times a fight a Grunt); paid as a Standard's (a third of its points off the turn): ${f1(g2.worth)}.
`);
log("grunts");

fs.writeFileSync(new URL("../budget.md", import.meta.url), `${out.join("\n")}\n\n(${Math.round((Date.now() - t0) / 60000)} minutes.)\n`);
log("done");
