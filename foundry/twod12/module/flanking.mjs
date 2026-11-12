// Flanking (see Flanking in the rules):
//  - A creature threatens every enemy within the NORMAL Range of its melee weapon (Reach above 1 added; a Long weapon not adjacent ones) for as long as it
//    can make a [Melee] Action that deals damage (a Melee weapon in hand, Fists only with Brawler: they are Non-threatening, or a natural attack).
//    An Unconscious creature threatens no one.
//  - Creatures that threaten the same enemy flank it. Each flanker gains 1 Field Boon on its [Melee] Actions against that enemy for each other flanker,
//    minus 1 for each ally of that enemy that threatens the flanker (never below 0), then the limit of Field Boons, 2 (v0.0.301, PACK BB: the cancels first).
import { tokenDistance } from "./light.mjs";
import { flankBoons } from "./roundrules.mjs";
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
 * v0.0.302: who threatens whom on the map, once: { live, threatens(a, b), profile(t), enemies(a, b) }. Neutral creatures are nobody's enemy; hidden tokens and
 * tokens with no creature don't count.
 */
export function threatMap(tokens = canvas.tokens?.placeables ?? []) {
  const side = t => Number(t.document?.disposition ?? 0);
  const live = tokens.filter(t => t.actor && !t.document?.hidden);
  const enemies = (a, b) => side(a) !== 0 && side(b) !== 0 && side(a) !== side(b);   // neutral creatures are nobody's enemy
  const prof = new Map(live.map(t => [t.id, threatProfile(t.actor)]));
  const threatens = (a, b) => { if (a.id === b.id || !enemies(a, b)) return false; const p = prof.get(a.id); if (!p || p.max <= 0) return false; const d = tokenDistance(a, b); return d >= p.min && d <= p.max; };
  return { live, enemies, threatens, profile: t => prof.get(t.id) ?? { min: 1, max: 0 }, side };
}

/**
 * Flanking for one attack: how many boons the attacker's [Melee] Actions gain against the target.
 * 1 Field Boon for each OTHER creature that threatens the target, minus 1 for each ally of the target that threatens the attacker (never below 0), then at
 * most 2 (the limit of Field Boons; v0.0.301). The attacker must threaten the target.
 * Returns { boons, raw (before the limit), flankers (the other creatures that threaten the target), cancelledBy (the target's allies that threaten the attacker),
 * threatenedBy (every creature that threatens the target), and the same as tokens: flankerTokens, cancelTokens }.
 */
export function flankingFor(attacker, target, tokens = canvas.tokens?.placeables ?? [], tm = null) {
  const { live, threatens } = tm ?? threatMap(tokens);
  const all = live.filter(a => threatens(a, target));
  if (!attacker || !threatens(attacker, target)) return { boons: 0, raw: 0, flankers: [], cancelledBy: [], threatenedBy: all.map(t => t.name), flankerTokens: [], cancelTokens: [], attackerThreatens: false };
  const others = all.filter(a => a.id !== attacker.id);
  const cancelledBy = live.filter(y => y.id !== target.id && threatens(y, attacker));
  const { raw, boons } = flankBoons(others.length, cancelledBy.length);   // v0.0.365 (SIM-1): the rule itself is in roundrules.mjs
  return { boons, raw, flankers: others.map(t => t.name), cancelledBy: cancelledBy.map(t => t.name), threatenedBy: all.map(t => t.name), flankerTokens: others, cancelTokens: cancelledBy, attackerThreatens: true };
}

/** Why a creature that "threatens no one" doesn't (for the overlay and the dialog): "no Melee weapon in hand", "Unconscious". */
export function noThreatWhy(actor) {
  if (!actor) return "no creature";
  if (actor.statuses?.has?.("unconscious") || actor.statuses?.has?.("dead")) return actor.statuses.has("dead") ? "dead" : "Unconscious";
  const held = activeWeapons(actor).filter(w => !hasProp(w, "barehanded"));
  if (held.some(w => hasProp(w, "melee") && !weaponThreatens(actor, w))) return "its weapon is Non-threatening";
  if (held.length) return `no Melee weapon in hand (${held.map(w => w.name).join(", ")})`;
  return "no Melee weapon in hand (Fists are Non-threatening)";
}

/**
 * v0.0.302 (Lucas tested v0.0.301: "Flank is not showing up at all"): when a [Melee] Action gets no Flanking, the dialog shows why, as an n/a chip:
 * you don't threaten the target, nobody else threatens it (and who stands next to it without threatening), or the target's allies cancel every Boon.
 * Returns the reason ("" never: there is always one).
 */
export function flankingWhyNot(attacker, target, tokens = canvas.tokens?.placeables ?? []) {
  const tm = threatMap(tokens), f = flankingFor(attacker, target, tokens, tm);
  if (!f.attackerThreatens) return tm.profile(attacker).max <= 0 ? `you threaten no one: ${noThreatWhy(attacker?.actor)}` : `you don't threaten ${target.name} from where you stand`;
  if (!f.flankers.length) {
    const near = tm.live.filter(t => t.id !== attacker.id && t.id !== target.id && tm.enemies(t, target) && tokenDistance(t, target) <= 1);
    const why = near.map(t => `${t.name}: ${tm.profile(t).max <= 0 ? noThreatWhy(t.actor) : "doesn't reach it"}`);
    return `no other creature threatens ${target.name}${why.length ? ` (${why.join("; ")})` : ""}`;
  }
  return `${f.flankers.join(", ")} also threaten${f.flankers.length === 1 ? "s" : ""} ${target.name}, but ${f.cancelledBy.join(", ")} (${target.name}'s side) threaten${f.cancelledBy.length === 1 ? "s" : ""} you: every Boon cancelled`;
}

/**
 * v0.0.302 (Lucas): the "Show flanking" overlay's model, pure: for every creature threatened by two or more enemies, a line from each flanker with its Boons,
 * and a dashed line from each creature that cancels one of them; a small note under every creature that threatens no one.
 * Returns { flanked: [{ target, flankers: [{ token, boons, raw, cancels: [token] }] }], idle: [{ token, why }] }.
 */
export function flankPicture(tokens = canvas.tokens?.placeables ?? []) {
  const tm = threatMap(tokens), flanked = [], idle = [];
  for (const t of tm.live) {
    const by = tm.live.filter(a => tm.threatens(a, t));
    if (by.length >= 2) flanked.push({ target: t, flankers: by.map(a => { const f = flankingFor(a, t, tokens, tm); return { token: a, boons: f.boons, raw: f.raw, cancels: f.cancelTokens }; }) });
    if (tm.profile(t).max <= 0) idle.push({ token: t, why: noThreatWhy(t.actor) });
  }
  return { flanked, idle };
}

/**
 * The roll modifier for it (null when there is none). `tag` makes the id and the name specific to one target of a roll made at several.
 * v0.0.302: na: true gives, when there is no Flanking, an n/a chip that says why (the roll dialog folds it into "1 n/a").
 */
export function flankingMod(attacker, target, { tag = "", na = false } = {}) {
  const f = flankingFor(attacker, target);
  if (!f.boons && na) { const why = flankingWhyNot(attacker, target); return { id: tag ? `syn:flanking|${tag}` : "syn:flanking", name: tag ? `Flanking (${target.name})` : "Flanking", boons: 1, banes: 0, bb: "field", match: false, naWhy: why, predicate: `No Flanking: ${why}` }; }
  if (!f.boons) return null;
  const n = f.boons, c = f.cancelledBy;
  return { id: tag ? `syn:flanking|${tag}` : "syn:flanking", name: `Flanking ${n}${tag ? ` (${target.name})` : ""}`, boons: n,   // v0.0.303 (Lucas): "Flanking 2"; the chip's Field tag says the rest
    banes: 0, bb: "field", match: true,
    predicate: `${target.name} is also threatened by ${f.flankers.join(", ")}: a Field Boon for each, up to 2${c.length ? `; ${c.join(", ")} ${c.length === 1 ? "is an ally" : "are allies"} of ${target.name} that threaten${c.length === 1 ? "s" : ""} you: one boon cancelled for each` : ""}` };
}
