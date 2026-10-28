// Effects that add to the next matching action: Bonus Damage settings and "expires after an action with trait X is used".

import { hoverOf } from "./util.mjs";
import { effectOff } from "./escalation.mjs";
const F = "twod12";

/** Bonus Damage settings of the actor's effects that match the action's traits and the tier rolled. */
export function collectBonuses(actor, traits, tier) {
  const out = [];
  for (const e of actor.effects) {
    if (effectOff(actor, e)) continue;
    for (const m of e.getFlag(F, "bonuses") ?? []) {
      const pred = (m.all ?? []).every(t => traits.has(t)) && (!(m.any?.length) || m.any.some(t => traits.has(t))) && !(m.none ?? []).some(t => traits.has(t));
      if (!pred) continue;
      const tiers = m.tiers?.length ? m.tiers : ["t1", "t2", "t3"];
      if (!tiers.includes(`t${tier}`)) continue;
      out.push({ effectId: e.id, effect: String(e.name ?? "").replace(/^\s*Effect:\s*/i, ""), dmg: m.dmg || "", pool: m.dmgPool || "B", sub: m.dmgSub || "", text: m.text || "", fxUuid: m.fxUuid || "", hover: hoverOf(e.getFlag(F, "hover"), e.getFlag(F, "description")) });
    }
  }
  return out;
}

/** "(T2/T3)" for a list of tiers; nothing when it is all of them. */

/** Delete the effects that end when an action with one of these traits is used. */
export async function expireOnUse(actor, traits) {
  const gone = [...actor.effects].filter(e => { const list = e.getFlag(F, "expireOn") ?? []; return list.length && (e.getFlag(F, "expireAll") ? list.every(t => traits.has(t)) : list.some(t => traits.has(t))); }).map(e => e.id);
  if (gone.length) await actor.deleteEmbeddedDocuments("ActiveEffect", gone);
  return gone.length;
}
