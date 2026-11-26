// v0.0.407 (Stage 0 in Foundry; book, Chapter 1, Exploding Dice; Chapter 15, Weapon Damage [W]; Chapter 8, Empowered).
//   A damage die written with ! (1d6!) explodes: on its highest face it counts one less and is rolled again (it can explode again). Every weapon's
//   die explodes. Foundry's own x modifier adds the full face, so the system registers its own modifier, xs ("explode, a step less"): Foundry
//   rolls the die again as x does, and each face that exploded counts one less (Foundry reads a result's count before its face for the total).
//   The rule itself is roundrules.mjs explodingDie (the ruler uses it); this file is the notation and Foundry's side. Empowered (no value since
//   2026-11-13): the first damage a creature deals on each of its turns adds 1d6! of the Action's pool and type (roundrules.mjs EMPOWERED_DIE).
import { EMPOWERED_DIE } from "./roundrules.mjs";
const F = "twod12";

/** The modifier the system adds to Foundry's dice for a die written with ! ("1d6!" is rolled as "1d6xs"). */
export const EXPLODE_MOD = "xs";
/** Pure: the book's notation to Foundry's: every "NdX!" becomes "NdXxs" (a die with no ! is left as it is). */
export const toFoundryDice = f => String(f ?? "").replace(/(\d*)d(\d+)!/gi, (m, n, d) => `${n || 1}d${d}${EXPLODE_MOD}`);
/** Pure: a weapon's die explodes, so its formula is written with ! ({ count, die: "d6", mod } times n: "2d6!+4"). */
export function weaponDiceFormula(d, n = 1) {
  const dice = d?.die ? (Number(d.count) || 0) * n : 0, mod = (Number(d?.mod) || 0) * n;
  if (dice > 0) return `${dice}${d.die}!` + (mod ? `${mod > 0 ? "+" : ""}${mod}` : "");
  return mod ? String(mod) : null;
}
/** Pure (core rework batch 3, [D]): the weapon's exploding die on this Tier, rolled n times, with no flat part ("1d6!", "2d4!", or null). */
export function weaponDieOnlyFormula(d, n = 1) {
  const dice = d?.die ? (Number(d.count) || 0) * n : 0;
  return dice > 0 ? `${dice}${d.die}!` : null;
}
/** Pure: a weapon's Tier as the book writes it: "0", "3", "1d4!", "3 + 1d4!" (the flat part first, then the die). */
export function weaponTierText(d) {
  const dice = d?.die && Number(d.count) ? `${d.count}${d.die}!` : "", mod = Number(d?.mod) || 0;
  if (!dice) return String(mod);
  return mod ? `${mod} ${mod > 0 ? "+" : "−"} ${dice}` : dice;
}
/** Pure: a die's results as the cards show them: the faces rolled (an exploded one included) and which faces exploded. */
export const diceOfRoll = roll => (roll?.dice ?? []).map(d => { const live = (d.results ?? []).filter(x => x.active !== false); return { faces: d.faces, results: live.map(x => x.result), ex: live.map(x => !!x.exploded) }; });

/** Foundry: register the xs modifier on its Die (in "init"). Returns whether it could. */
export function registerExplodingDice() {
  const Die = globalThis.foundry?.dice?.terms?.Die ?? globalThis.CONFIG?.Dice?.terms?.d;
  if (!Die?.MODIFIERS) return false;
  Die.MODIFIERS[EXPLODE_MOD] = async function explodeStep() {
    await this.explode("x", { recursive: true });
    for (const r of this.results) if (r.exploded && r.active !== false) r.count = Math.max(0, r.result - 1);
  };
  return true;
}
/** Foundry: a Roll of a formula in the book's notation (its ! dice explode the book's way). */
export const bookRoll = (formula, data) => new Roll(toFoundryDice(formula), data);

/* ---- Empowered (Ch. 8): the first damage a creature deals on each of its turns adds 1d6! (of the Action's pool and type) ---- */
/** Pure: the key of "this turn" for a creature (combat, round, turn), or "" when it isn't its turn in a started combat (null: no combat). */
export function turnKey(combat, actor) {
  if (!combat?.started) return null;
  const cur = combat.combatant, mine = !!cur && !!actor && (cur.actor?.uuid && actor.uuid ? cur.actor.uuid === actor.uuid : (cur.actor?.id ?? cur.actorId) === actor.id);
  if (!mine) return "";
  return `${combat.id}:${combat.round}:${combat.turn}`;
}
/** Pure: can the creature's Empowered add its die now? Outside a combat, every time; in one, only on its own turn and once in it. */
export const empoweredFree = (key, usedKey) => key === null || (key !== "" && key !== usedKey);
/** The formula of the Empowered die. */
export const EMPOWERED_FORMULA = `1d${EMPOWERED_DIE}!`;
/** Foundry: does this creature's Empowered add its die now? */
export function empoweredNow(actor) {
  try { return empoweredFree(turnKey(globalThis.game?.combat, actor), actor?.getFlag?.(F, "empoweredUsed") ?? ""); } catch (e) { return true; }
}
/** Foundry: its Empowered die was used this turn. */
export async function markEmpoweredUsed(actor) {
  const key = turnKey(globalThis.game?.combat, actor);
  if (!key) return;
  try { if (actor?.isOwner) await actor.setFlag(F, "empoweredUsed", key); } catch (e) { /* not ours */ }
}
/** Foundry: roll the Empowered die (1d6!) and return a damage component of the pool and type of the first one given (or null). v0.0.523 (Lucas,
 *  2026-11-26): it explodes for every creature (v0.0.435's exception for a Minor enemy, a Minion or a Grunt, is gone: a die explodes where it writes !). */
export async function empoweredComponent(first, rolls = []) {
  if (!first) return null;
  const formula = EMPOWERED_FORMULA;
  const r = await bookRoll(formula).evaluate();
  rolls.push(r);
  return { pool: first.pool || "B", sub: first.sub ?? "", kind: "E", formula, total: r.total, dice: diceOfRoll(r), label: "Empowered", emp: r.total };
}
