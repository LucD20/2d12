// Flanking (see Flanking in the rules):
//  - A creature threatens every enemy within the NORMAL Range of its melee weapon (Reach above 1 added; a Long weapon not adjacent ones) for as long as it
//    can make a [Melee] Action that deals damage (a Melee weapon in hand, Fists only with Brawler: they are Non-threatening, or a natural attack).
//    An Unconscious creature threatens no one.
//  - Creatures that threaten the same enemy flank it. Each flanker gains 1 Field Boon on its [Melee] Actions against that enemy for each other flanker,
//    minus 1 for each ally of that enemy that threatens the flanker (never below 0), then the limit of Field Boons, 2 (v0.0.301, PACK BB: the cancels first).
import { tokenDistance } from "./light.mjs";
import { activeWeapons, hasProp, weaponThreatens } from "./fists.mjs";
import { weaponRanges, rangeEnds } from "./weaponrange.mjs";

const num = v => Number(v) || 0;

/** Does the Action deal damage on some tier of some Version? */
const dealsDamage = s => (s?.versions ?? []).some(v => [v.t1, v.t2, v.t3].some(t => t?.length));

/** The Reach of a [Melee] Action's Distance: "reach" (or nothing) is the creature's Reach, a number is that many squares. */
const actionReach = (s, base) => { const d = String(s?.distance ?? "").trim().toLowerCase(); const n = parseInt(d, 10); return !d || d === "reach" ? base : (Number.isFinite(n) && n > 0 ? n : base); };

/**
 * Which squares this creature threatens: { min, max } in squares (max 0: no one). A Melee weapon in hand threatens up to the NORMAL number of its melee
 * Range (Reach above 1 added; the far range doesn't count), and a Long weapon not adjacent creatures (min 2). Fists count only with a feature such as Brawler
 * (they are Non-threatening). A [Melee] Action of its own that deals damage (a natural attack) uses its Distance. Any source that threatens adjacent squares makes min 1.
 */
export function threatProfile(actor) {
  if (!actor || actor.statuses?.has?.("unconscious") || actor.statuses?.has?.("dead")) return { min: 1, max: 0 };
  const base = Math.max(1, num(actor.system?.reach) || 1);
  let best = 0, min = Infinity;
  for (const w of activeWeapons(actor)) {
    if (!hasProp(w, "melee") || !weaponThreatens(actor, w)) continue;   // a Non-threatening weapon doesn't threaten (Fists), unless a feature says otherwise (Brawler)
    const r = weaponRanges(w, base), n = rangeEnds(r.melee).normal;
    if (n <= 0) continue;
    best = Math.max(best, n); min = Math.min(min, r.long ? 2 : 1);
  }
  for (const it of actor.itemTypes?.action ?? []) {
    const s = it.system;
    if (!s?.traits?.has?.("melee") || s.traits.has("weapon") || !dealsDamage(s)) continue;
    best = Math.max(best, actionReach(s, base)); min = 1;
  }
  return { min: Number.isFinite(min) ? min : 1, max: best };
}

/** How far this creature threatens, in squares (0: it threatens no one). */
export function threatReach(actor) {
  return threatProfile(actor).max;
}

/**
 * Flanking for one attack: how many boons the attacker's [Melee] Actions gain against the target.
 * 1 Field Boon for each OTHER creature that threatens the target, minus 1 for each ally of the target that threatens the attacker (never below 0), then at
 * most 2 (the limit of Field Boons; v0.0.301). The attacker must threaten the target.
 * Returns { boons, flankers (the other creatures that threaten the target), cancelledBy (the target's allies that threaten the attacker), threatenedBy (every creature that threatens the target) }.
 */
export function flankingFor(attacker, target, tokens = canvas.tokens?.placeables ?? []) {
  const side = t => Number(t.document?.disposition ?? 0);
  const live = tokens.filter(t => t.actor && !t.document?.hidden);
  const enemies = (a, b) => side(a) !== 0 && side(b) !== 0 && side(a) !== side(b);   // neutral creatures are nobody's enemy
  const prof = new Map(live.map(t => [t.id, threatProfile(t.actor)]));
  const threatens = (a, b) => { if (a.id === b.id || !enemies(a, b)) return false; const p = prof.get(a.id); if (!p || p.max <= 0) return false; const d = tokenDistance(a, b); return d >= p.min && d <= p.max; };
  const all = live.filter(a => threatens(a, target));
  if (!attacker || !threatens(attacker, target)) return { boons: 0, flankers: [], cancelledBy: [], threatenedBy: all.map(t => t.name) };
  const others = all.filter(a => a.id !== attacker.id);
  const cancelledBy = live.filter(y => y.id !== target.id && threatens(y, attacker));
  return { boons: Math.min(2, Math.max(0, others.length - cancelledBy.length)), flankers: others.map(t => t.name), cancelledBy: cancelledBy.map(t => t.name), threatenedBy: all.map(t => t.name) };
}

/** The roll modifier for it (null when there is none). `tag` makes the id and the name specific to one target of a roll made at several. */
export function flankingMod(attacker, target, { tag = "" } = {}) {
  const f = flankingFor(attacker, target);
  if (!f.boons) return null;
  const n = f.boons, c = f.cancelledBy;
  return { id: tag ? `syn:flanking|${tag}` : "syn:flanking", name: `Flanking${tag ? ` (${target.name}, ` : " ("}${n} Field Boon${n === 1 ? "" : "s"})`, boons: n, banes: 0, bb: "field", match: true,
    predicate: `${target.name} is also threatened by ${f.flankers.join(", ")}: a Field Boon for each, up to 2${c.length ? `; ${c.join(", ")} ${c.length === 1 ? "is an ally" : "are allies"} of ${target.name} that threaten${c.length === 1 ? "s" : ""} you: one boon cancelled for each` : ""}` };
}
