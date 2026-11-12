// The Bestiary's turn budget: what the calibration shares (calib.mjs, budget.mjs's numbers, ../budget.md). A design's worth in points of a turn:
// the damage-only Standard of today (Basic attack 25, 2 AP Round Special 55) scaled by d is the yardstick; a design that costs the party what the
// yardstick does at d is worth 100 × d (the Standard's budget is 100).
import { S, party, fights, mean } from "./stage0lib.mjs";
import * as B from "./budget.mjs";
export { S, B, party, fights, mean };
export const B0 = (riders = [], o = {}) => ({ acts: [{ name: "Basic", ap: 1, pts: 25, riders }, { name: "Special", ap: 2, freq: "round", pts: 55 }], ...o });
export const free = rs => rs.map(x => ({ ...x, price: 0 }));
export const team = (rank, d, k, P) => () => Array.from({ length: k }, () => B.npcBuilt(rank, typeof d === "function" ? d() : d, P));
export function fxOf(f) { const fx = {}; for (const x of f.out) for (const n of x.W.foes) for (const [a, b] of Object.entries(n.fx ?? {})) fx[a] = (fx[a] ?? 0) + b; for (const k in fx) fx[k] /= f.out.length; return fx; }
const CURVE = new Map();
/** The yardstick's cost by d at a level and on a map: a straight line through d = 0.8 / 1 / 1.2 (n fights each). */
export function curve(lv, map = "open", n = 600, enc = 4) {
  const key = `${lv}|${map}|${n}|${enc}`; if (CURVE.has(key)) return CURVE.get(key);
  const ds = [0.8, 1, 1.2], ys = ds.map(d => fights(party(lv), team("standard", B0([], { scale: d }), enc), { n, map, seed: 31 }).cost);
  const mx = mean(ds), my = mean(ys), b = ds.reduce((s, d, i) => s + (d - mx) * (ys[i] - my), 0) / ds.reduce((s, d) => s + (d - mx) ** 2, 0), a = my - b * mx;
  const c = { a, b, at1: a + b }; CURVE.set(key, c); return c;
}
/** A design's worth (points of a Standard's turn) over levels and maps: { worth, cost, fx: per fight, turns }. */
export function worth(mk, { lvls = [1, 2, 3], maps = ["open"], n = 600, enc = 4, seed = 41 } = {}) {
  const rows = [];
  for (const lv of lvls) for (const map of maps) { const c = curve(lv, map, n, enc), f = fights(party(lv), mk, { n, map, seed }); rows.push({ d: (f.cost - c.a) / c.b, cost: f.cost, down: f.down, won: f.won, fx: fxOf(f) }); }
  const fx = {}; for (const r of rows) for (const [k, v] of Object.entries(r.fx)) fx[k] = (fx[k] ?? 0) + v / rows.length;
  return { worth: 100 * mean(rows.map(r => r.d)), cost: mean(rows.map(r => r.cost)), down: mean(rows.map(r => r.down)), won: mean(rows.map(r => r.won)), fx, rows };
}
/** Points one use of something adds: (worth - 100) a turn, over its uses a turn. */
export const perUse = (w, key) => (w.worth - 100) / Math.max(1e-9, (w.fx[key] ?? 0) / Math.max(1e-9, w.fx.turns ?? 1));
