// 2026-11-12 (Lucas: "make sure if d8 is the real limit without unbalancing the game"): the weapon draft (book/weapons-flat.md) with bigger dice
// at the same averages. Prints a table; nothing is written.   node book/ruler/sim/weapondice.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), N = 1500;
const mean = a => a.reduce((s, x) => s + x, 0) / a.length, sd = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); }, pc = x => `${Math.round(x * 100)}%`;
Object.assign(S.RULES, S.RULES_R);
const F = S.parseFights(fs.readFileSync(RULER + "fights.txt", "utf8"));
const GS = "weapon Greatsword (melee, two-handed): ", XB = "weapon Crossbow (ranged, projectile, reload, two-handed, range 10/20/40): ";
const party = (gs, xb) => F.party.map(f => S.parseSpec(fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8").replace(/^weapon Greatsword.*$/m, GS + gs).replace(/^weapon Crossbow.*$/m, XB + xb), `rework/${f}`));
const V = [["Today", "0 / 1d8 / 2d6", "0 / 1d4+2 / 1d10+2"], ["A (same averages)", "0 / 1d6+1 / 1d6+4", "0 / 1d4+2 / 1d4+5"], ["B (d8 the biggest)", "0 / 1d6+1 / 1d8+4", "0 / 1d4+2 / 1d4+4"],
  ["B, Greatsword d10 (3 + 1d10)", "0 / 1d6+1 / 1d10+3", "0 / 1d4+2 / 1d4+4"], ["B, Greatsword d12 (2 + 1d12)", "0 / 1d8 / 1d12+2", "0 / 1d4+2 / 1d4+4"], ["B, d12 and a Crossbow on d6 / d8 (1 + 1d6 / 2 + 1d8)", "0 / 1d8 / 1d12+2", "0 / 1d6+1 / 1d8+2"]];
console.log("| Weapons | Normal (4 Standards) | Deadly (6 Standards) |\n|---|---|---|");
for (const [name, gs, xb] of V) { const p = party(gs, xb), cells = [];
  for (const en of ["4 Standards", "6 Standards"]) { const e = F.encounters.find(x => x.name.startsWith(en)), R = S.rng(53), r = []; for (let k = 0; k < N; k++) r.push(S.fight(p, e.npcs.map(n => S.npcOf(n.role, n.rating, F.level, n)), R, {}));
    cells.push(`${mean(r.map(x => x.rounds)).toFixed(2)} r (± ${sd(r.map(x => x.rounds)).toFixed(2)}) · ${pc(mean(r.map(x => x.lost)))} (± ${Math.round(sd(r.map(x => x.lost)) * 100)}) · Down ${pc(mean(r.map(x => (x.downs ? 1 : 0))))} · won ${pc(mean(r.map(x => (x.won ? 1 : 0))))}`); }
  console.log(`| ${name} | ${cells.join(" | ")} |`); }
