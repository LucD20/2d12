// v0.0.409 (pack F2, the Paladin's passives): a Feature's small hooks (FeatureData.hooks), read where they act, while the passive works: an
// Escalation passive from its rung (escblock.mjs passiveThreshold: the class section "Escalation 2 / 4 / 6 Ability"), any other always.
//   reactionGuard (Armor of Faith): after a Reaction with these traits is used, its user gains Guard (formula: N + pow)   actions.mjs
//   apCost (Roving Judgment): an Action of this mark kind (Judge) at this AP costs `cost` AP instead                       actions.mjs
//   rapMore (Tireless Vigil): n more Reaction AP (the book: it pays only for [Divine] Reactions: by hand)                  combat.mjs rapMaxOf
//   setupAdvance (Hallowed Stance): once on your turn, an Action with these traits gains "Setup: You Advance N"            actions.mjs
import { passiveThreshold } from "./escblock.mjs";
import { escalationOf } from "./escalation.mjs";

/** Pure: does a hook's passive work at this Escalation (rung 0: always)? */
export const hookOn = (rung, escalation) => !rung || (Number(escalation) || 0) >= rung;
/** The working hooks of this kind on a creature's Features: [{ hook, item }]. */
/** v0.0.428 (the audit: the HUD and the sheet struck Judge's 1 AP and Leaning at 0 AP though Roving Judgment and Lean and Loose make them free):
 *  a Version's cost with the apCost hooks (an Action of a mark kind, or a Basic Action, at this AP costs `cost`). One rule for the HUD, the sheet
 *  and useAction. */
export function effectiveAp(actor, item, v) {
  const it = item?.system ?? {}, ap = Number(v?.ap ?? v) || 0;
  const h = activeHooks(actor, "apCost").find(x => (x.hook.markKind || x.hook.basic) && (!x.hook.markKind || x.hook.markKind === it.markKind) && (!x.hook.basic || x.hook.basic === item?.getFlag?.("twod12", "basic")) && Number(x.hook.ap) === ap);
  return h ? Math.max(0, Number(h.hook.cost) || 0) : ap;
}
export function activeHooks(actor, kind) {
  const out = [];
  if (!actor?.items) return out;
  let esc = 0; try { esc = escalationOf(actor); } catch (e) { esc = Number(actor.system?.escalation) || 0; }
  const items = actor.items?.contents ?? (typeof actor.items?.[Symbol.iterator] === "function" ? [...actor.items] : []);   // a Collection, or a list
  for (const it of items) {
    const hooks = it.system?.hooks;
    if (!Array.isArray(hooks) || !hooks.length) continue;
    const rung = it.system?.escalationPassive ? passiveThreshold(it) : 0;
    if (!hookOn(rung, esc)) continue;
    for (const h of hooks) if (h?.kind === kind) out.push({ hook: h, item: it });
  }
  return out;
}
/** Pure: does an Action's trait set have every trait of a hook? */
export const hasTraits = (traits, need = []) => (need ?? []).every(t => traits?.has?.(t) ?? (traits ?? []).includes?.(t));

/* ---- v0.0.411 (pack F3, the Archer's passives): what a creature did this turn (actor flag strikeState), read by the roll dialog's chips ---- */
//   movedBoon (Shifting Aim): a Field Boon when it has left its square this turn since its last [Strike] Action (or since its turn began)
//   alternateBoon (Blade and Bow): once on each of its turns, 1 Boon on a [Melee, Strike] after a [Ranged, Strike] this turn (or the reverse)
//   moreW (One More Arrow): once on each of its turns, a [Strike] that deals [W] deals 1[W] more (actions.mjs rollDamage)
const F = "twod12";
/** Pure: the state of this turn (a state of another turn is a fresh one). */
export const stateNow = (st, key) => (st && st.key === key ? st : { key, moved: false, left: false, last: "", altUsed: false, moreW: false });   // left: it left its square this turn (v0.0.412, Wounding Shot)
/** Pure: the kind of a Strike for Blade and Bow ("melee", "ranged" or ""). */
export const strikeKind = traits => { const has = k => traits?.has?.(k) ?? (traits ?? []).includes?.(k); return has("strike") ? (has("melee") ? "melee" : has("ranged") ? "ranged" : "") : ""; };
/** Pure: the chips these hooks give a roll: [{ name, boons, field }]. hooks: [{ hook, item }] of movedBoon and alternateBoon; st: the turn's state. */
export function strikeChips(moved, alternate, traits, st) {
  const out = [], kind = strikeKind(traits);
  for (const h of moved) if (st.moved && hasTraits(traits, h.hook.traits ?? ["ranged", "strike"])) out.push({ name: h.item.name, boons: Math.max(1, Number(h.hook.boons) || 1), field: (h.hook.bb ?? "field") === "field", why: "you have left your square since your last Strike this turn" });
  for (const h of alternate) if (kind && st.last && st.last !== kind && !st.altUsed) out.push({ name: h.item.name, boons: Math.max(1, Number(h.hook.boons) || 1), field: false, why: `a ${kind === "melee" ? "[Melee, Strike]" : "[Ranged, Strike]"} after a ${st.last === "melee" ? "[Melee, Strike]" : "[Ranged, Strike]"} this turn (once a turn)` });
  return out;
}
async function turnOf(actor) { try { const { turnKey } = await import("./explode.mjs"); return turnKey(game.combat, actor); } catch (e) { return null; } }
/** The roll dialog's chips of these hooks for this creature and these traits (rollinput.mjs). */
export async function strikeHookChipsFor(actor, traits) {
  const moved = activeHooks(actor, "movedBoon"), alt = activeHooks(actor, "alternateBoon");
  if (!moved.length && !alt.length) return [];
  const key = await turnOf(actor);
  if (!key) return [];   // outside its turn in a started combat (or no combat): nothing to read
  return strikeChips(moved, alt, traits, stateNow(actor.getFlag?.(F, "strikeState"), key));
}
/** A Strike was used (actions.mjs): the turn's state goes on (not moved since, the kind of the last Strike, Blade and Bow spent if it applied). */
export async function noteStrike(actor, traits) {
  try {
    const kind = strikeKind(traits); if (!kind && !(traits?.has?.("strike"))) return;
    const key = await turnOf(actor); if (!key || !actor?.isOwner) return;
    const st = stateNow(actor.getFlag(F, "strikeState"), key), alt = activeHooks(actor, "alternateBoon").length && kind && st.last && st.last !== kind;
    await actor.setFlag(F, "strikeState", { ...st, moved: false, last: kind || st.last, altUsed: st.altUsed || !!alt });
  } catch (e) { console.warn("twod12 | strike state", e); }
}
/** One More Arrow: true once on each of the creature's turns (and outside a combat every time); spends it. */
export async function takeMoreW(actor) {
  const key = await turnOf(actor);
  if (key === null) return true;
  if (!key) return false;
  const st = stateNow(actor.getFlag?.(F, "strikeState"), key);
  if (st.moreW) return false;
  try { if (actor.isOwner) await actor.setFlag(F, "strikeState", { ...st, moreW: true }); } catch (e) { /* not kept */ }
  return true;
}
/** The token moved (the active GM): its creature has left its square this turn (Shifting Aim). */
export function registerStrikeState() {
  Hooks.on("moveToken", async doc => {
    try {
      if (!game.user.isActiveGM) return;
      const actor = doc?.actor;
      if (!actor || actor.type !== "character") return;   // v0.0.412: every character (Wounding Shot's Requirement reads it too)
      const key = await turnOf(actor); if (!key) return;
      const st = stateNow(actor.getFlag(F, "strikeState"), key);
      if (!st.moved || !st.left) await actor.setFlag(F, "strikeState", { ...st, moved: true, left: true });
    } catch (e) { console.warn("twod12 | Shifting Aim", e); }
  });
}

/** v0.0.412 (book, Wounding Shot: "You haven't left your square this turn"): has the creature left its square on its turn? (null: not its turn in a combat) */
export async function leftThisTurn(actor) {
  const key = await turnOf(actor);
  if (!key) return null;
  return !!stateNow(actor.getFlag?.(F, "strikeState"), key).left;
}
/** Pure: does a Requirement say "you haven't left your square this turn"? */
export const needsStayed = req => /haven.t left your square this turn/i.test(String(req ?? ""));
