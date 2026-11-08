// Effects that add to the next matching action: Bonus Damage settings and "expires after an action with trait X is used".

import { hoverOf } from "./util.mjs";
import { effectOff } from "./escalation.mjs";
import { allEffects } from "./passives.mjs";
import { onceKey, onceBlocked, isMarked } from "./automation.mjs";
const F = "twod12";

/**
 * Bonus Damage settings of the actor's effects and passives that match the action's traits and the tier rolled.
 * v0.0.186: a passive's Bonus Damage works on every matching Action (an applied effect's is used up by its "Ends" traits);
 * "once per round" ones only while unused this turn-cycle (they carry `once`), "only against my marked target" ones only with that target,
 * and "[Mod]" in the damage is the Action's Modifier (opts.mod; nothing when it is 0 or less).
 */
export function collectBonuses(actor, traits, tier, opts = {}) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    (e.getFlag(F, "bonuses") ?? []).forEach((m, i) => {
      const pred = (m.all ?? []).every(t => traits.has(t)) && (!(m.any?.length) || m.any.some(t => traits.has(t))) && !(m.none ?? []).some(t => traits.has(t));
      if (!pred) return;
      const tiers = m.tiers?.length ? m.tiers : ["t1", "t2", "t3"];
      if (!tiers.includes(`t${tier}`)) return;
      if (m.vsMarked && !isMarked(actor, opts.target ?? null)) return;
      const once = m.oncePerRound ? onceKey(e, "b", i) : "";
      if (once && onceBlocked(actor, once)) return;
      const dmg = modDamage(m.dmg || "", opts.mod);
      if (dmg === null) return;
      out.push({ effectId: e.id, effect: String(e.name ?? "").replace(/^\s*Effect:\s*/i, ""), dmg, pool: m.dmgPool || "B", sub: m.dmgSub || "", text: m.text || "", fxUuid: m.fxUuid || "", hover: hoverOf(e.getFlag(F, "hover"), e.getFlag(F, "description")), srcUuid: e.srcUuid || e.getFlag(F, "effectUuid") || e.uuid || "", ...(once ? { once } : {}) });
    });
  }
  return out;
}

/**
 * v0.0.292 (PACK ROLL-DIALOG): the Bonus Damage of the creature's effects and Passives that does NOT apply to this roll, with the reason, for the
 * roll dialog's "n/a" chips ("Not this time: Word of Radiance is not a Strike") and its "already used this round" chips (off).
 * label(k): a trait's name. [{ effect, why, used, dmg, sub, pool, tiers, srcUuid }]
 */
export function bonusesNotNow(actor, traits, { label = k => k, name = "this Action" } = {}) {
  const out = [];
  const tl = k => (k === "__twohanded" ? "Two-handed weapon" : label(k));
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    (e.getFlag(F, "bonuses") ?? []).forEach((m, i) => {
      const miss = (m.all ?? []).filter(t => !traits.has(t)), anyMiss = m.any?.length && !m.any.some(t => traits.has(t)), bad = (m.none ?? []).filter(t => traits.has(t));
      const base = { effect: String(e.name ?? "").replace(/^\s*Effect:\s*/i, ""), dmg: m.dmg || "", sub: m.dmgSub || "", pool: m.dmgPool || "B", tiers: (m.tiers?.length ? m.tiers : ["t1", "t2", "t3"]).map(t => Number(String(t).slice(1))), srcUuid: e.srcUuid || e.getFlag(F, "effectUuid") || e.uuid || "" };
      if (miss.length || anyMiss || bad.length) {
        const why = miss.includes("__twohanded") ? "it needs a Two-handed weapon"
          : miss.length ? `${name} is not ${miss.filter(t => !String(t).startsWith("__")).map(t => `a ${tl(t)}`).join(" or ") || "the right kind of Action"}`
            : anyMiss ? `${name} is not ${m.any.map(t => `a ${tl(t)}`).join(" or ")}` : `${name} is a ${bad.map(tl).join(", ")}`;
        return out.push({ ...base, why });
      }
      const once = m.oncePerRound ? onceKey(e, "b", i) : "";
      if (once && onceBlocked(actor, once)) out.push({ ...base, used: true, why: "already used this round" });
    });
  }
  return out;
}

/** "[Mod]" in a Bonus Damage is the Action's Modifier: "[Mod]" with +3 is "3", "1d6 + [Mod]" is "1d6 + 3". null: it is only [Mod] and the Modifier is 0 or less (no damage). */
export function modDamage(dmg, mod) {
  const s = String(dmg ?? "");
  if (!/\[mod\]/i.test(s)) return s;
  const m = Math.trunc(Number(mod)) || 0;
  if (/^\s*\[mod\]\s*$/i.test(s)) return m > 0 ? String(m) : null;
  return s.replace(/\[mod\]/gi, String(m)).replace(/\+\s*-/g, "- ");
}

/** "(T2/T3)" for a list of tiers; nothing when it is all of them. */

/** Delete the effects that end when an action with one of these traits is used. */
export async function expireOnUse(actor, traits, keep = new Set()) {
  const gone = [...actor.effects].filter(e => !keep.has(e.id)).filter(e => { const list = e.getFlag(F, "expireOn") ?? []; return list.length && (e.getFlag(F, "expireAll") ? list.every(t => traits.has(t)) : list.some(t => traits.has(t))); }).map(e => e.id);
  if (gone.length) await actor.deleteEmbeddedDocuments("ActiveEffect", gone);
  return gone.length;
}
