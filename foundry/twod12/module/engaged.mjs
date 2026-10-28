// Engaged (see "Engaged" and "Ranged Combat" in the rules): you are Engaged if you are adjacent to an enemy and both of you can be Engaged.
// By itself it does nothing; other rules use it (a [Ranged] Action while Engaged has 2 banes, against an Engaged creature 1 bane).
import { tokenDistance } from "./light.mjs";

/** Conditions that mean "you can't be Engaged": Unconscious (a rule of the book). A dead creature is no creature to engage either. */
export const CANT_BE_ENGAGED = ["unconscious", "dead"];

export const canBeEngaged = token => {
  const a = token?.actor;
  return !!a && !CANT_BE_ENGAGED.some(s => a.statuses?.has?.(s));
};

/** Enemies: one side friendly and the other hostile (neutral creatures are nobody's enemy). */
export const areEnemies = (a, b) => {
  const x = a?.document?.disposition ?? a?.disposition ?? 0, y = b?.document?.disposition ?? b?.disposition ?? 0;
  return x !== 0 && y !== 0 && (x > 0) !== (y > 0);
};

/** The creatures this one is Engaged with: adjacent (even diagonally) enemies, when both can be Engaged. What each one can see or hear does not matter. */
export function engagedWith(token) {
  if (!token || !canBeEngaged(token)) return [];
  const id = token.document?.id ?? token.id;
  return (globalThis.canvas?.tokens?.placeables ?? []).filter(t => (t.document?.id ?? t.id) !== id && t.actor && !t.document?.hidden
    && areEnemies(token, t) && canBeEngaged(t) && tokenDistance(token, t) <= 1);
}

export const isEngaged = token => engagedWith(token).length > 0;

/** Engaged with a creature other than the one given (Ranged Combat: shooting at a creature that is Engaged with someone other than you). */
export function engagedWithOther(token, except) {
  const id = except?.document?.id ?? except?.id;
  return engagedWith(token).some(t => (t.document?.id ?? t.id) !== id);
}
