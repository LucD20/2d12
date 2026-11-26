// The SIM's frozen copy of the system's npcbudget.mjs (the cleanup audit, 2026-11-26): foundry/twod12/module/npcbudget.mjs as it was at v0.0.520,
// reading the frozen tables (tables.mjs) instead of the live config.mjs, so the SIM's NPCs stay as they were while the Builder's numbers move.
// Don't edit: frozen on purpose. Below, the file as it was.
// v0.0.407 (Stage 0 in Foundry; the Bestiary, "Actions: the turn budget", "Ratings", "Building an encounter"): the Bestiary's pure numbers for an
// NPC, one copy for the system's Builder and for the ruler (book/ruler/sim/budget.mjs imports these, as it imports roundrules.mjs). Nothing here
// reads Foundry: numbers in, numbers out. The price list is config.mjs npcBudget; the Stage 0 tables config.mjs npcStage0 and npcDefense.
import { TW as TWOD12 } from "./tables.mjs";   // the frozen tables (was: the system's config.mjs)

const RATINGS = ["terrible", "low", "medium", "high", "extreme"];
/** The price list (config.mjs npcBudget). */
export const PRICES = () => structuredClone(TWOD12.npcBudget);

/** An average as written damage: a flat part plus at most one small die (a d4 under 5.5, a d6 under 11.5, a d8 above), or a plain number under 2. */
export function expr(avg) {
  if (avg <= 0.25) return "0";
  if (avg < 2) return String(Math.max(1, Math.round(avg)));
  const die = avg < 5.5 ? 4 : avg < 11.5 ? 6 : 8, flat = Math.max(0, Math.round(avg - (die + 1) / 2 + 1e-9));
  return flat ? `${flat} + 1d${die}` : `1d${die}`;
}
/** Points into damage: Tier 2 and Tier 3 averages (a Medium Standard's Basic attack, 25 points, is 3.5 / 5.5). */
export const pointsAvg = (pts, P = PRICES()) => [pts * P.toDamage[0], pts * P.toDamage[1]];
/** Points into written damage (Tier 2, Tier 3), as the Bestiary's table writes it. explode: the die written with ! (it explodes). */
export const pointsExpr = (pts, P = PRICES(), explode = false) => pointsAvg(pts, P).map(expr).map(e => (explode ? e.replace(/(d\d+)$/, "$1!") : e));

const SEV = ["forced", "mild", "moderate", "severe", "extreme"];   // 2026-11-13: priced for a rider one enemy in the encounter has
/** A rider's price by its severity and where it is (Setup one size bigger, Tier 3 only one size smaller; on a hit, the normal price). */
export function riderPrice(sev, at = "hit", P = PRICES()) {
  const i = SEV.indexOf(sev); if (i < 0) throw new Error(`a rider's severity: ${sev}`);
  const j = at === "setup" ? i + 1 : at === "t3" ? i - 1 : i;
  if (j < 0) return 0;
  if (j >= SEV.length) return P.riders.extreme + P.riders.step * (j - (SEV.length - 1));   // past Extreme: each size adds a step
  return P.riders[SEV[j]];
}
/** An Action's points: the rank's points an AP (its rating), its premiums (Round, 2 AP, 3 AP), an Encounter Action double the Round one. freq: "atwill" | "round" | "enc". */
export function actionPoints(rank, ap, freq, rating = "medium", P = PRICES()) {
  const per = P.perAp[rank] * P.rating[rating], round = per * ap * (1 + (P.size[ap] ?? 0) + P.round);
  return freq === "enc" ? round * P.encounter : freq === "round" ? round : per * ap * (1 + (P.size[ap] ?? 0));
}
/** A rank's turn budget by rating. */
export const turnBudget = (rank, rating = "medium", P = PRICES()) => P.perAp[rank] * P.rating[rating] * P.turnAp[rank];
/** A rank's points an AP by rating. */
export const pointsPerAp = (rank, rating = "medium", P = PRICES()) => P.perAp[rank] * P.rating[rating];

/** The rating one step lower (a ranged attack pays a rating of damage for its range: the Bestiary, Ranged attacks; config.mjs npcRangedStep). */
export const ratingBelow = (rating, steps = TWOD12.npcRangedStep ?? 1) => RATINGS[Math.max(0, RATINGS.indexOf(rating in TWOD12.npcBudget.rating ? rating : "medium") - steps)];

/** A rating's step from Medium: Terrible -2 ... Extreme +2 (a custom or unknown one: 0). */
export const ratingStep = r => { const i = RATINGS.indexOf(r); return i < 0 ? 0 : i - 2; };
/**
 * The CV steps of an NPC's ratings (the Bestiary, Ratings): Vigor and Resolve half a step each, the damage rating (its turn budget's) a step,
 * Armor and Ward Defense half a step each, the Weapon and Power Modifiers half a step each from their defaults (Weapon Medium; Power Low, a
 * Standard's Medium). ratings: { bodyHm, mindHm, damage, ad, wd }; mods: { weapon, power }.
 */
export function cvSteps(rank, ratings = {}, mods = {}) {
  const powerDefault = rank === "standard" ? "medium" : "low";
  const half = k => ratingStep(ratings[k] ?? "medium") / 2;
  // v0.0.435 (the Bestiary audit, question 19): an Elite's Extreme Modifier is +4, the cap, as its High: it counts as High
  const modStep = r => ratingStep(rank === "elite" && r === "extreme" ? "high" : r);
  return half("bodyHm") + half("mindHm") + ratingStep(ratings.damage ?? "medium") + half("ad") + half("wd")
    + (modStep(mods.weapon ?? "medium") - ratingStep("medium")) / 2 + (modStep(mods.power ?? powerDefault) - ratingStep(powerDefault)) / 2;
}
/** An NPC's CV: its rank's (lower an earlier Stage than the party's: base) plus its steps times the rank's CV step (config.mjs npcCvStep), never under 0. */
// v0.0.436 (Lucas, 2026-11-18: "round within half a step"): half a step or less, either way, counts as none
export const cvWithSteps = (rank, base, steps) => Math.max(0, Math.round(Number(base) + (TWOD12.npcCvStep[rank] ?? 15) * (Math.abs(Number(steps) || 0) <= 0.5 ? 0 : steps)));

/** A Stage 0 table's value by rating (config.mjs npcStage0 health, npcDefense): a Minion has no Extreme (its High is the last). */
export const s0Col = (rank, rating) => { const i = RATINGS.indexOf(rating); return rank === "minion" ? Math.min(3, i < 0 ? 2 : i) : i < 0 ? 2 : i; };
/** An NPC's Vigor or Resolve at Stage 0: its rating's ready number (no Attribute, no multiplier). */
export const s0Health = (rank, rating) => (TWOD12.npcStage0[rank] ?? TWOD12.npcStage0.standard).health[s0Col(rank, rating)];
/** An NPC's Armor or Ward Defense by rating (every Stage): config.mjs npcDefense. */
export const npcDefenseOf = (rank, rating) => (TWOD12.npcDefense[rank] ?? TWOD12.npcDefense.standard)[s0Col(rank, rating)];
/** A rank's AP a turn (the Bestiary: Minions and Grunts 3, the others 4) and its Reaction Point (Minions none). */
export const rankAp = rank => TWOD12.npcBudget.turnAp[rank] ?? 4;
export const rankReactionAp = rank => (rank === "minion" ? (TWOD12.npcStage0.minion.reactionAp ?? 0) : TWOD12.reactionAp);

/**
 * The best turn's points (the Bestiary, Check its best turn): its AP, at most 3 Strikes, each Round Action once, no Encounter Action. acts:
 * [{ ap, freq: "atwill" | "round" | "enc", pts, strike }]. Returns { pts, list } (the Actions of that turn, by index).
 */
export function bestTurn(acts = [], apMax = 4, strikes = 3) {
  const use = acts.map((a, i) => ({ ...a, i })).filter(a => a.freq !== "enc" && Number(a.ap) > 0);
  let best = { pts: 0, list: [] };
  const go = (k, ap, st, pts, list, usedRound) => {
    if (pts > best.pts) best = { pts, list: [...list] };
    for (let j = k; j < use.length; j++) {
      const a = use[j], s = a.strike ? 1 : 0;
      if (a.ap > ap || st + s > strikes || (a.freq === "round" && usedRound.has(a.i))) continue;
      const ur = new Set(usedRound); if (a.freq === "round") ur.add(a.i);
      go(a.freq === "round" ? j + 1 : j, ap - a.ap, st + s, pts + a.pts, [...list, a.i], ur);
    }
  };
  go(0, apMax, 0, 0, [], new Set());
  return best;
}
/** Pure: the points an Action's written damage is worth (the average of what its Tier 2 and Tier 3 averages give back; riders not counted). */
export const damagePoints = (t2avg, t3avg, P = PRICES()) => ((Number(t2avg) || 0) / P.toDamage[0] + (Number(t3avg) || 0) / P.toDamage[1]) / 2;

/** The six roles (the Bestiary, Roles): a preset of ratings; every rating not named is Medium. Speed is the Skirmisher's own. */
export const ROLE_PRESETS = {
  striker: { label: "Striker", tip: "Walks in and hits hard, and is easy to hit", ratings: { damage: "high", bodyHm: "high", mindHm: "low", ad: "low" }, mods: { weapon: "low" } },
  soldier: { label: "Soldier", tip: "Holds a line and protects its allies", ratings: { ad: "high", bodyHm: "low", mindHm: "low" } },
  skirmisher: { label: "Skirmisher", tip: "Moves, strikes and gets away (Speed 6 or 7)", ratings: { bodyHm: "low", mindHm: "low" }, mods: { weapon: "high" }, speed: 6 },
  artillery: { label: "Artillery", tip: "Attacks from far away (each ranged attack pays a rating for the range)", ratings: { ad: "low" }, mods: { weapon: "high" } },
  controller: { label: "Controller", tip: "Changes the fight with conditions and areas (often Power Actions Vs. WD)", ratings: { wd: "high", ad: "low" } },
  leader: { label: "Leader", tip: "Makes its allies better; one in a fight", ratings: {} }
};
/** Pure: the ratings a role preset sets (every Health, Defense and damage rating it doesn't name back to Medium; the Attributes are kept). */
export function presetRatings(key, rank) {
  const p = ROLE_PRESETS[key]; if (!p) return null;
  const clamp = r => (rank === "minion" && r === "extreme" ? "high" : r);
  const ratings = Object.fromEntries(["bodyHm", "mindHm", "ad", "wd", "damage"].map(k => [k, clamp(p.ratings[k] ?? "medium")]));
  const mods = { weapon: clamp(p.mods?.weapon ?? "medium"), power: rank === "standard" ? "medium" : "low" };
  return { ratings, mods, speed: p.speed ?? null };
}

/**
 * What the Builder suggests for one NPC Action at Stage 0: its points and its written damage (no riders taken off). o: { rank, rating (the NPC's
 * damage rating, or the Basic attack's own), ap, freq ("atwill" | "round" | "encounter" | "enc"), basic (the Basic attack: its die explodes on a
 * Standard or an Elite), ranged (more than 2 squares: one rating lower), explode (an exploding die paid for, 6 points) }. { pts, t2, t3, text, rating }.
 */
export function npcSuggest({ rank = "standard", rating = "medium", ap = 1, freq = "atwill", basic = false, ranged = false, explode = false } = {}, P = PRICES()) {
  const r0 = rating in P.rating ? rating : "medium", r = ranged ? ratingBelow(r0) : r0;
  const f = freq === "encounter" ? "enc" : freq === "round" || freq === "enc" ? freq : "atwill";
  const bang = (basic || explode) && rank !== "minion" && rank !== "grunt";
  const pts = actionPoints(rank, Math.max(1, Math.trunc(Number(ap)) || 1), f, r, P), dmgPts = Math.max(0, pts - (explode && !basic && bang ? P.explode : 0));
  const [t2, t3] = pointsExpr(dmgPts, P, bang);
  return { pts: Math.round(pts), t2, t3, text: `${Math.round(pts)} points: ${t2} / ${t3}`, rating: r };
}
