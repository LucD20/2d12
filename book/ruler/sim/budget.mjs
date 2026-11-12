// The Bestiary's turn budget (pack "The Bestiary's turn budget", 2026-11-12; rules-backlog.md, "THE BESTIARY'S DAMAGE AS A TURN BUDGET").
// The price list (points), points into damage, and an NPC built from its Actions. The numbers are the system's (config.mjs npcBudget); a run can
// pass its own (calib.mjs tries several). Nothing here plays a fight: the engine (engine.mjs) runs an NPC's `acts` and `reaction`.
import { TW, parseDamage, npcS0, avgDamage } from "./core.mjs";

/** The price list. config.mjs npcBudget is the book's; these are its fields (see there). */
export const PRICES = () => structuredClone(TW.npcBudget);

/** An average as written damage: a flat part plus at most one small die (a d4 under 5.5, a d6 under 11.5, a d8 above), or a plain number under 2. */
export function expr(avg) {
  if (avg <= 0.25) return "0";
  if (avg < 2) return String(Math.max(1, Math.round(avg)));
  const die = avg < 5.5 ? 4 : avg < 11.5 ? 6 : 8, flat = Math.max(0, Math.round(avg - (die + 1) / 2 + 1e-9));
  return flat ? `${flat} + 1d${die}` : `1d${die}`;
}
/** Points into damage: Tier 2 and Tier 3 averages (a Medium Standard's Basic attack, 25 points, is 3.5 / 5.5). */
export const pointsAvg = (pts, P = PRICES()) => [pts * P.toDamage[0], pts * P.toDamage[1]];
/** Points into written damage (Tier 2, Tier 3), as the Bestiary's table writes it. */
export const pointsExpr = (pts, P = PRICES()) => pointsAvg(pts, P).map(expr);

const SEV = ["forced", "mild", "moderate", "severe", "beyond"];
/** A rider's price by its severity and where it is (Setup one size bigger, Tier 3 only one size smaller; on a hit, the normal price). */
export function riderPrice(sev, at = "hit", P = PRICES()) {
  const i = SEV.indexOf(sev); if (i < 0) throw new Error(`a rider's severity: ${sev}`);
  const j = at === "setup" ? i + 1 : at === "t3" ? i - 1 : i;
  if (j < 0) return 0;
  if (j >= SEV.length - 1) { const s = P.riders.severe, m = P.riders.moderate; return s + (s - m) * (j - (SEV.length - 2)); }   // past Severe: each size adds the step from Moderate to Severe
  return P.riders[SEV[j]];
}
/** An Action's points: the rank's points an AP (its rating), its premiums (Round, 2 AP, 3 AP), an Encounter Action double the Round one. */
export function actionPoints(rank, ap, freq, rating = "medium", P = PRICES()) {
  const per = P.perAp[rank] * P.rating[rating], round = per * ap * (1 + (P.size[ap] ?? 0) + P.round);
  return freq === "enc" ? round * P.encounter : freq === "round" ? round : per * ap * (1 + (P.size[ap] ?? 0));
}
/** A rank's turn budget by rating. */
export const turnBudget = (rank, rating = "medium", P = PRICES()) => P.perAp[rank] * P.rating[rating] * P.turnAp[rank];

/**
 * An Action from its design: { name, ap, freq: "atwill" | "round" | "enc", kind: "attack" | "help", riders: [{ eff: "Prone", sev: "severe",
 * at: "hit" | "t3" | "setup" }], area: { n, r }, save: "body" (a Save Action), power (Vs. WD, [R] damage), buff / heal (a help), pts (its own
 * points instead of the price) }. Its damage is what the points leave after the riders, halved when it hits several creatures.
 * opts.scale multiplies the damage (a Reaction paid from the turn), opts.exact keeps the averages as flat numbers (the fit).
 */
export function compileAct(rank, d, { rating = "medium", P = PRICES(), scale = 1, ranged = false, exact = false } = {}) {
  const lower = { extreme: "high", high: "medium", medium: "low", low: "terrible", terrible: "terrible" };
  const r = ranged && (d.kind ?? "attack") === "attack" ? lower[rating] : rating;   // a ranged attack pays a rating step of damage for its range
  const pts = d.pts ?? actionPoints(rank, d.ap, d.freq ?? "atwill", r, P);
  const riders = (d.riders ?? []).map(x => ({ at: "hit", ...x }));
  const riderPts = riders.reduce((s, x) => s + (x.price ?? riderPrice(x.sev, x.at, P)), 0);   // price: a rider's own price (the fit adds riders for free)
  let dmgPts = Math.max(0, pts - riderPts) * (d.area ? P.multi : 1) * scale;
  if (d.kind === "help") dmgPts = 0;
  const avg = pointsAvg(dmgPts, P);
  const dmg = dmgPts > 0.5 ? (exact ? avg.map(a => ({ w: 0, mod: 0, dice: [], flat: a, mind: null })) : avg.map(a => parseDamage(expr(a)))) : null;
  const heal = d.heal ? parseDamage(d.heal === true ? expr(pts * (P.toDamage[0] + P.toDamage[1]) / 2) : d.heal) : null;
  return { name: d.name, kind: d.kind ?? "attack", ap: d.ap, freq: d.freq ?? "atwill", pts, dmgPts, riderPts, dmg, written: dmg ? avg.map(expr) : null, riders, area: d.area ?? null, save: d.save ?? null, power: !!d.power, buff: d.buff ?? null, heal, range: d.range ?? 5 };
}
/**
 * An NPC built on the budget: a Stage 0 NPC of its rank (Health, Defenses, Modifiers: npcS0) with its own Actions. design: { rating, acts: [...],
 * reaction: { name, cost: 1 | 2, trigger: "struck" | "allyHit" | "allyStruck" | "approach", range, def, act: an Action's design (its damage
 * priced as a cost-AP Round Action) }, payBack (points off every turn's Actions: an Encounter Action's pay-back), npc (npcS0's opts) }.
 * A Reaction's share is taken from the turn: P.reaction.give of its points, spread over the turn's Actions.
 */
export function npcBuilt(rank, design, P = PRICES()) {
  const rating = design.rating ?? "medium", base = npcS0(rank, rating, design.npc ?? {});
  const budget = turnBudget(rank, rating, P);
  const rxPts = design.reaction ? actionPoints(rank, design.reaction.cost ?? 1, "round", rating, P) : 0;
  const rx = design.reaction, rxShare = !rx ? 0 : (rx.cost ?? 1) === 2 ? P.reaction.twoR : rx.trigger === "struck" ? P.reaction.self : P.reaction.other;
  const give = rx ? (rx.give ?? rxShare) * rxPts : 0;
  const enc = design.acts.filter(a => a.freq === "enc").reduce((m, a) => Math.max(m, P.payBack[a.ap] ?? 0), 0) * budget;   // an Encounter Action's pay-back: a share of the turn budget off the other Actions
  const payBack = design.payBack ?? enc;
  const scale = Math.max(0, 1 - (give + payBack) / budget) * (design.scale ?? 1);
  const ranged = !!design.npc?.ranged;
  const encScale = Math.max(0, 1 - give / budget) * (design.scale ?? 1);   // the pay-back comes off the other Actions, not the Encounter one
  const acts = design.acts.map(d => compileAct(rank, d, { rating, P, scale: d.freq === "enc" ? encScale : scale, ranged, exact: design.exact }));
  const reaction = design.reaction ? { ...design.reaction, cost: design.reaction.cost ?? 1, pts: rxPts, act: design.reaction.act ? compileAct(rank, { ap: design.reaction.cost ?? 1, freq: "round", ...design.reaction.act }, { rating, P, ranged, exact: design.exact }) : null } : null;
  return { ...base, payBack, give, acts, reaction, reactionAp: base.role === "minion" ? 0 : undefined, design: design.label ?? null, budget };
}
/** The best turn of a design (no move): the most points its AP buy with 3 Strikes at most, each Round Action once and the Encounter Action. */
export function bestTurn(rank, design, P = PRICES()) {
  const n = npcBuilt(rank, design, P), ap0 = n.apMax - (n.reaction?.cost === 2 ? 1 : 0);
  let best = 0;
  const go = (ap, strikes, used, pts) => { best = Math.max(best, pts); for (const a of n.acts) { if (a.ap > ap || (a.kind !== "help" && strikes >= 3) || (a.freq !== "atwill" && used.has(a.name))) continue; go(ap - a.ap, strikes + (a.kind === "help" ? 0 : 1), new Set([...used, a.name]), pts + a.pts); } };
  go(ap0, 0, new Set(), 0);
  return { best, budget: n.budget, over: best / n.budget - 1 };
}
export { avgDamage };
