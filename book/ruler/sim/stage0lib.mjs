// Stage 0 (levels 1 to 3; in the book since 2026-11-12): what stage0.mjs (the report) and stage0fit.mjs (the Bestiary's fit) share: the rules, the builds,
// the Bestiary's Stage 0 table as a function of two factors, and the fights. The class cards are not on their Stage 0 lists yet (card sessions with Lucas):
// until then the builds are the R builds of rework/*.txt cut down to book/decisions-s1.md's level lists, as the prototype did.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
export const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url));
export const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;

/* ------------------------------------------------------------------ the rules: the book today with the 1-to-6 ladder (core.mjs RULES_S0) */
export const setRules = (o = {}) => Object.assign(S.RULES, S.RULES_S0, o);
setRules();

/* ------------------------------------------------------------------ the builds: the R builds cut to Lucas's level lists */
// decisions-s1.md item 5: level 1 the Hallmark Action and Reaction and the Passive of the cards' rung 2 (at Escalation 4); level 2 the hook, an Encounter Pick
// and the Passive of the cards' rung 1 (at Escalation 2); level 3 the Passive of the cards' rung 3 (at Escalation 6). No Apex (level 4), no Talents, no Daily.
const RUNG = { "Radiant Zeal": [2, 2], "Searing Blows": [4, 1], Reckoning: [6, 3], "Font of Mercy": [2, 2], "Mending Light": [4, 1], "Hallowed Stance": [6, 3], "Killer's Focus": [2, 2], "Hunter's Edge": [4, 1], Finisher: [6, 3] };   // [Escalation, level]
export const FILES = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"];
const rd = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8");
export const XBOW = rd("archer-double-r1").match(/^weapon Crossbow.*$/m)[0];
export function build(file, level, { weapon = null } = {}) {
  let t = rd(file).replace(/^level .*$/m, `level ${level}`).replace(/^when escalation 3: .*$/m, "");
  if (level < 2) t = t.replace(/^plan .*$/m, "plan Main").replace(/^hook .*$/m, "");   // no Encounter Pick and no hook at level 1
  if (weapon) t = t.replace(/^weapon .*$/m, weapon);
  const b = S.parseSpec(t, `rework/${file} (Stage 0, level ${level}${weapon ? ", Crossbow" : ""})`);
  b.passives = b.passives.filter(p => !RUNG[p.name] || level >= RUNG[p.name][1]); for (const p of b.passives) if (RUNG[p.name]) p.escalation = RUNG[p.name][0];
  for (const a of Object.values(b.actions)) a.escalation *= 2;   // an Action's Escalation line on the 1 to 6 ladder
  return b;
}
export const party = (level, o = {}) => FILES.map(f => build(f, level, o[f] ?? o.all ?? {}));
export const allCrossbows = level => party(level, { "paladin-smite-r1": { weapon: XBOW }, "paladin-hands-r1": { weapon: XBOW } });

/* ------------------------------------------------------------------ the Bestiary's Stage 0 table from two factors over pack R's first row */
const ROLES = ["minion", "grunt", "standard", "elite"], TW = S.TW;
/** An average as written damage: a flat part plus at most one small die (a d4 under 5.5, a d6 under 11.5, a d8 above), or a plain number under 2. */
export function expr(avg) {
  if (avg < 2) return String(Math.max(1, Math.round(avg)));
  const die = avg < 5.5 ? 4 : avg < 11.5 ? 6 : 8, flat = Math.max(0, Math.round(avg - (die + 1) / 2 + 1e-9));
  return flat ? `${flat} + 1d${die}` : `1d${die}`;
}
export const exprAvg = e => S.avgDamage(S.parseDamage(e), null, 2, 0);
/** The table (config.mjs npcStage0's shape): pack R's first row (config.mjs npcRoles, hm[0] and basic[0]) with Health × h and damage × d, as ready numbers. */
export function makeTable(h, d) {
  const out = {};
  for (const role of ROLES) {
    const r = TW.npcRoles[role], x = k => TW.npcSpecial.find(s => s.key === k).x;
    const health = r.hm[0].map(m => Math.max(1, Math.round(Math.ceil((r.attr + 2) * m + r.hb - 1e-9) * h)));
    const row = k => r.basic[0].map(([a, b]) => [expr(a * d * x(k)), expr(b * d * x(k))]);
    out[role] = { health, basic: row("basic"), s1: row("s1"), s2: row("s2"), ...(role === "minion" ? {} : { s3: row("s3") }) };
  }
  return out;
}

/* ------------------------------------------------------------------ NPCs and fights */
/** An encounter's maker. row: { table } (a Stage 0 table; none = the book's, config.mjs npcStage0) or { h, d } (pack R's first row times two factors, exact averages: the fit's continuous side). */
export const npcAt = (role, row = {}, opts = {}) => {
  if (row.h == null && row.d == null) return S.npcS0(role, "medium", opts, row.table ?? TW.npcStage0);
  const n = S.npcOf(role, "medium", 1, opts), h = row.h ?? 1, d = row.d ?? 1;
  return { ...n, exact: true, pool: Math.round(n.pool * h), bodyPool: Math.round(n.bodyPool * h), mindPool: Math.round(n.mindPool * h), t2: n.t2 * d, t3: n.t3 * d };
};
export const enc = (list, row) => () => list.flatMap(([role, k]) => Array(k).fill(0).map(() => npcAt(role, row)));
export const ENC = { easy: [["standard", 3]], normal: [["standard", 4]], mixed: [["elite", 1], ["standard", 2]], grunts: [["grunt", 8]], minions: [["standard", 2], ["minion", 8]], hard: [["standard", 5]], deadly: [["standard", 6]] };
export function fights(builds, mk, { mom = 0, n = 600, seed = 17, policy = S.planPolicy, npcPolicy = S.planPolicy, map = "open" } = {}) {
  const R = S.rng(seed), out = [], M = { ...S.MAP, grid: S.MP.loadMap(map) };
  for (let k = 0; k < n; k++) { const pcs = builds.map(S.pcState); for (const p of pcs) p.startEsc = S.RR.escalationStartAt(typeof mom === "function" ? mom(k) : mom); out.push(S.fight(pcs, mk(), R, { map: M, policy, npcPolicy, maxRounds: 15 })); }
  const pool = out[0].pcs.reduce((s, p) => s + p.build.pool, 0);
  return { out, rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))),
    cost: mean(out.map(x => x.lost + x.pcs.reduce((s, p) => s + (p.st.rpSelf + p.st.rpByAlly) * p.build.rallyHeal, 0) / pool)),
    per: (i, key) => mean(out.map(x => (x.pcs[i].st[key] ?? 0) / Math.max(1, x.pcs[i].st.rounds))) };
}
export const cell = r => `${f1(r.rounds)} · ${pc(r.lost)} · ${pc(r.cost)} · ${pc(r.down)} · ${pc(r.won)}`, CELL = "rounds · Health lost · cost (with the Rally Points spent) · a PC Down · won";
export const bisect = (fn, target, lo, hi, steps = 7) => { for (let i = 0; i < steps; i++) { const mid = (lo + hi) / 2; if (fn(mid) < target) lo = mid; else hi = mid; } return (lo + hi) / 2; };
