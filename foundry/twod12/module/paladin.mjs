// The Paladin's automation (P1, v0.0.181), and the Archer's Elusive (A1).
//   Radiant Zeal: while your Escalation is 1 or more, the first [Strike] Action you make each round that deals damage deals an extra [M] 1d6 Ho.
//   Font of Mercy: while your Escalation is 1 or more, when you or an ally within 5 squares of you uses a Rally Point, they heal your Power Modifier + 2 more.
//   Elusive (Archer): while your Escalation is 1 or more, the first [Strike] Action against you each round takes 1 Bane.
// "Each round" is the creature's turn-cycle, as for Killer's Focus (usage.mjs).
import { turnCycleBlocked } from "./usage.mjs";
import { hasFeature } from "./archer.mjs";
const F = "twod12";
const escOf = actor => Number(actor?.system?.escalation) || 0;
const ownIndex = (c, actor) => c.turns.findIndex(x => x.actor === actor || (actor.isToken && x.tokenId === actor.token?.id));
const usedThisCycle = (actor, flag) => { const c = game.combat; return !!c?.started && turnCycleBlocked(c.round, c.turn, ownIndex(c, actor), actor.getFlag?.(F, flag)); };
const markUsed = async (actor, flag) => { const c = game.combat; if (c?.started && actor?.isOwner) await actor.setFlag(F, flag, [c.round, c.turn]); };

/** Radiant Zeal: the extra damage of your first [Strike] Action this round (a bonus like the effects' ones), or null. */
export function radiantZealBonus(actor, traits) {
  if (!hasFeature(actor, "Radiant Zeal") || escOf(actor) < 1 || !traits.has("strike") || usedThisCycle(actor, "radiantZeal")) return null;
  return { effectId: "radiantZeal", effect: "Radiant Zeal", dmg: "1d6", pool: "M", sub: "Ho", text: "", fxUuid: "" };
}
export const useRadiantZeal = actor => markUsed(actor, "radiantZeal");

/** Elusive: 1 Bane on the first [Strike] Action against the creature this round (a roll-dialog modifier), or null. */
export function elusiveMod(targetActor, traits, tag = "") {
  if (!targetActor || !hasFeature(targetActor, "Elusive") || escOf(targetActor) < 1 || !traits.has("strike") || usedThisCycle(targetActor, "elusive")) return null;
  return { id: `syn:elusive${tag ? `|${tag}` : ""}`, name: `Elusive (${targetActor.name}, 1 Bane)`, boons: 0, banes: 1, match: true, predicate: "The first [Strike] Action against an Elusive Archer each round takes 1 Bane" };
}
export const useElusive = targetActor => markUsed(targetActor, "elusive");

/** Font of Mercy: the extra healing a Rally Point of this creature gets ({ name, bonus }), or null. The highest one counts (Stacking). */
export async function fontOfMercy(actor) {
  if (typeof canvas === "undefined" || !canvas?.ready) return null;
  const { squaresBetween } = await import("./move.mjs");
  const mine = actor.getActiveTokens?.()[0] ?? null;
  let best = null;
  for (const t of canvas.tokens?.placeables ?? []) {
    const p = t.actor;
    if (!p || !hasFeature(p, "Font of Mercy") || escOf(p) < 1) continue;
    const near = p === actor || (mine && t.document?.disposition === mine.document?.disposition && squaresBetween(t, mine) <= 5);
    if (!near) continue;
    const bonus = (Number(p.system?.powerMod) || 0) + 2;
    if (!best || bonus > best.bonus) best = { name: p.name, bonus };
  }
  return best;
}
