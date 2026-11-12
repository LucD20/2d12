// 2026-11-12 (Lucas: "How big the gap with Table B + C2?"): ranged against melee at Stage 0 with his choices so far: the weapon table's column B
// (book/weapons-flat.md), a [Ranged] Action while Engaged Doomed (C2), no basic Opportunity Attack. Prints a table.   node book/ruler/sim/gap.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), N = 1200, mean = a => a.reduce((s, x) => s + x, 0) / a.length, pc = x => `${Math.round(x * 100)}%`, f1 = x => x.toFixed(1);
const RUNG = { "Radiant Zeal": [2, 2], "Searing Blows": [4, 1], Reckoning: [6, 3], "Font of Mercy": [2, 2], "Mending Light": [4, 1], "Hallowed Stance": [6, 3], "Killer's Focus": [2, 2], "Hunter's Edge": [4, 1], Finisher: [6, 3] };
const FILES = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"];
const GS = "weapon Greatsword (melee, two-handed): ", XB = "weapon Crossbow (ranged, projectile, reload, two-handed, range 10/20/40): ";
const W = { today: { gs: GS + "0 / 1d8 / 2d6", xb: XB + "0 / 1d4+2 / 1d10+2" }, B: { gs: GS + "0 / 1d6+1 / 1d8+4", xb: XB + "0 / 1d4+2 / 1d4+4" } };
function build(file, w, allXbow, o = {}) { if (o.w) w = o.w; let t = fs.readFileSync(`${RULER}rework/${file}.txt`, "utf8").replace(/^level .*$/m, "level 2").replace(/^when escalation 3: .*$/m, "");
  t = t.replace(/^weapon Greatsword.*$/m, allXbow ? w.xb : w.gs).replace(/^weapon Crossbow.*$/m, w.xb);
  if (o.edge && !allXbow && /^weapon Greatsword/m.test(t)) t += `\npassive Melee edge: bonus ${o.edge} melee strike\n`;
  const b = S.parseSpec(t, `rework/${file}`); b.passives = b.passives.filter(p => !RUNG[p.name] || 2 >= RUNG[p.name][1]); for (const p of b.passives) if (RUNG[p.name]) p.escalation = RUNG[p.name][0];
  for (const a of Object.values(b.actions)) a.escalation *= 2; return b; }
const npc = role => { const n = S.npcOf(role, "medium", 1, {}); return { ...n, exact: true, pool: Math.round(n.pool * 0.9), bodyPool: Math.round(n.bodyPool * 0.9), mindPool: Math.round(n.mindPool * 0.9), t2: n.t2 * 0.85, t3: n.t3 * 0.85 }; };
function run(rules, w, allXbow, k, noOa, o = {}) { Object.assign(S.RULES, S.RULES_R, { escMax: 6 }, rules); const builds = FILES.map(f => build(f, w, allXbow, o)), R = S.rng(17), out = [];
  for (let i = 0; i < N; i++) { const pcs = builds.map(S.pcState); for (const p of pcs) { p.startEsc = 1 + (i % 3); if (noOa) p.noOa = true; } out.push(S.fight(pcs, Array(k).fill(0).map(() => npc("standard")), R, { maxRounds: 12 })); }
  return { cell: `${pc(mean(out.map(x => x.lost)))} · ${pc(mean(out.map(x => (x.downs ? 1 : 0))))} · ${pc(mean(out.map(x => (x.won ? 1 : 0))))}`, dealt: mean(out.map(x => x.pcs[0].st.counted / Math.max(1, x.pcs[0].st.rounds))), taken: mean(out.map(x => x.pcs[0].st.taken / Math.max(1, x.pcs[0].st.rounds))) }; }
const V = [["Today's rules and weapons", {}, W.today, false], ["Table B", {}, W.B, false], ["Table B, no Opportunity Attack", { npcOa: false }, W.B, true], ["Table B + C2, no Opportunity Attack", { npcOa: false, engagedRanged: "doomed" }, W.B, true]];
console.log("Each cell: Health lost · a PC Down · won.\n\n| Rules | Normal: as built | Normal: all Crossbows | Deadly: as built | Deadly: all Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ...taken a turn |\n|---|---|---|---|---|---|---|");
const C2 = { npcOa: false, engagedRanged: "doomed" }, LS = "weapon Longsword (melee): ";
V.push(["... and +2 damage on a melee Strike that deals damage (the earlier test)", C2, W.B, true, { edge: 2 }], ["... +4 (the earlier test)", C2, W.B, true, { edge: 4 }],
  ["**Lucas's table: Greatsword 0 / 5 + 1d6 / 8 + 1d8**, C2", C2, W.B, true, { w: { gs: GS + "0 / 1d6+5 / 1d8+8", xb: W.B.xb } }],
  ["One-handed, column B as it was: the Paladins on Longswords 0 / 1d6 / 2 + 1d6, C2", C2, W.B, true, { w: { gs: LS + "0 / 1d6 / 1d6+2", xb: W.B.xb } }],
  ["**One-handed +2: Longswords 0 / 2 + 1d6 / 4 + 1d6**, C2", C2, W.B, true, { w: { gs: LS + "0 / 1d6+2 / 1d6+4", xb: W.B.xb } }]);
for (const [name, rules, w, noOa, o] of V) { const a = run(rules, w, false, 4, noOa, o), b = run(rules, w, true, 4, noOa, o), c = run(rules, w, false, 6, noOa, o), d = run(rules, w, true, 6, noOa, o);
  console.log(`| ${name} | ${a.cell} | ${b.cell} | ${c.cell} | ${d.cell} | ${f1(a.dealt)} / ${f1(b.dealt)} | ${f1(a.taken)} / ${f1(b.taken)} |`); }
Object.assign(S.RULES, S.RULES_R);
