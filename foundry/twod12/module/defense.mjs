// Defenses. An Action against a creature rolls against one of them:
//   Armor Defense, AD (Weapon Actions, and Fists): 11 + Armor value + bonuses;  Ward Defense, WD (Power Actions): 11 + Power Modifier + Ward value + bonuses;
//   an NPC's AD and WD are typed values (the Bestiary).
//   An Attribute DC (an Action with a Vs. entry, which replaces Armor and Ward): 11 + the Attribute (the core rework A7, 2026-11-21; v0.0.307: 12 +).
// A Signature Action uses Armor or Ward by the Modifier it rolls. An Action that faces none of these has DC 13.
// Defense bonuses (Features and effects) don't add up: for each Defense, the highest bonus and the highest penalty count.
import { allEffects, isBaseSource } from "./passives.mjs";
import { effectOff, seesOrigin } from "./escalation.mjs";
import { TWOD12 } from "./config.mjs";
import { evalFormula, refValues } from "./fxrules.mjs";
/** The actor an effect came from (its origin), or null. */
const originOf = e => { try { const d = e?.origin ? globalThis.fromUuidSync?.(e.origin) : null; return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (err) { return null; } };

/** Traits of the action plus mechanics found in its text (a @Move[pushed...] button makes it a "pushed" action). */
export function actionTags(item) {
  const tags = new Set(item.system.traits);
  const texts = [];
  for (const v of item.system.versions ?? []) {
    texts.push(v.effects ?? "");
    for (const k of ["x1", "x2", "x3"]) texts.push(v[k] ?? "");
  }
  if (texts.some(t => /@Move\[\s*pushed/i.test(t))) tags.add("pushed");
  if (texts.some(t => /@Move\[\s*pulled/i.test(t))) tags.add("pulled");
  if (texts.some(t => /@Move\[\s*slid/i.test(t))) tags.add("slid");
  return tags;
}

/**
 * The Defense bonus a creature has for one Defense ("armor", "ward" or an Attribute key) against an Action with these tags.
 * Sources: its Features' Defenses and its effects' Defense settings. A bonus for "all" counts for every Defense.
 * Only the highest bonus and the highest penalty count (Stacking): { total, parts: [{ name, bonus }] }.
 * opts.baseOnly: only the creature's base (Features and always-on passives), for the sheet's green and red.
 */
export function defenseBonus(actor, kind, tags, opts = {}) {
  const found = [];
  for (const f of actor?.itemTypes?.feature ?? []) {
    for (const d of f.system.defenses ?? []) {
      if (d.attr !== kind && d.attr !== "all") continue;
      const need = String(d.tags ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
      if (!need.every(t => tags.has(t))) continue;
      found.push({ name: f.name, bonus: Number(d.bonus) || 0 });
    }
  }
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e) || (opts.baseOnly && !isBaseSource(e))) continue;
    for (const d of e.getFlag?.("twod12", "defenses") ?? e.flags?.twod12?.defenses ?? []) {
      if (d.kind !== kind && d.kind !== "all") continue;
      if (d.seen && !seesOrigin(actor, e)) continue;   // v0.0.323: its own "While they see the origin"
      const bonus = d.formula ? Math.trunc(Number(evalFormula(d.formula, { origin: refValues(originOf(e) ?? actor), target: refValues(actor) }).value) || 0) : (Number(d.bonus) || 0);   // v0.0.324: a formula
      found.push({ name: String(e.name ?? "").replace(/\s*\(.*\)\s*$/, ""), bonus, inc: d.mode === "inc", bb: d.mode === "bonus" ? (d.name || "") : "" });
    }
  }
  // v0.0.323 (PACK EFFECT-SHEET; the book's Stacking, named bonuses): bonuses with different names add, the same name keeps the highest, an unnamed bonus
  // never adds to another one (the highest unnamed counts only when it beats the named ones together); the worst penalty counts; an increase always adds.
  const pos = found.filter(x => x.bonus > 0 && !x.inc), named = new Map();
  for (const x of pos.filter(p => p.bb)) if (!named.has(x.bb) || named.get(x.bb).bonus < x.bonus) named.set(x.bb, x);
  const bestUnnamed = pos.filter(p => !p.bb).sort((a, b) => b.bonus - a.bonus)[0];
  const namedSum = [...named.values()].reduce((s, p) => s + p.bonus, 0);
  const counted = bestUnnamed && bestUnnamed.bonus >= namedSum ? [bestUnnamed] : [...named.values()];
  const worst = found.filter(x => x.bonus < 0 && !x.inc).sort((a, b) => a.bonus - b.bonus)[0];
  const parts = [...counted, worst, ...found.filter(x => x.inc)].filter(Boolean);
  return { total: parts.reduce((s, p) => s + p.bonus, 0), parts };
}


/**
 * A creature's Steadiness (v0.0.174): its own (species, NPC) plus the bonuses of Features, Talents and effects (a "Defense" setting or a Feature's
 * Defense bonus of the kind Steadiness: the highest bonus and the worst penalty, as for Defenses; "every Defense" doesn't count). Never below 0.
 * Returns { base, total, parts }.
 */
export function steadinessOf(actor) {
  const base = Math.max(0, Number(actor?.system?.steadiness) || 0), found = [];
  for (const f of actor?.itemTypes?.feature ?? []) for (const d of f.system.defenses ?? []) if (d.attr === "steadiness") found.push({ name: f.name, bonus: Number(d.bonus) || 0 });
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const d of e.getFlag?.("twod12", "defenses") ?? e.flags?.twod12?.defenses ?? []) if (d.kind === "steadiness") found.push({ name: String(e.name ?? "").replace(/\s*\(.*\)\s*$/, ""), bonus: Number(d.bonus) || 0 });
  }
  const best = found.filter(x => x.bonus > 0).sort((a, b) => b.bonus - a.bonus)[0], worst = found.filter(x => x.bonus < 0).sort((a, b) => a.bonus - b.bonus)[0];
  const parts = [best, worst].filter(Boolean);
  return { base, total: Math.max(0, base + parts.reduce((s, p) => s + p.bonus, 0)), parts };
}

/** Which Defense an Action faces: { type: "vs", key } | { type: "armor" } | { type: "ward" } | null. src: rollSource() of the user. */
export function defenseOf(item, src = null, rolledAttr = "") {
  if (item.system.vs === "action") return null;   // the core rework B11: Break Free rolls against the Action DC of what holds it (actions.mjs sets it)
  const vs = item.system.vs === "roll" ? (rolledAttr || "body") : item.system.vs;
  if (vs) return { type: "vs", key: vs };
  if (!src) return null;
  if (src.kind === "weapon") return { type: "armor" };
  if (src.kind === "power") return { type: "ward" };
  // v0.0.181 (P1, the book's Smite: Vs AD): a [Signature, Weapon] Action is a Weapon Action (AD), a [Power, Signature] one a Power Action (WD);
  // only a Signature Action with neither trait faces the Defense of the Modifier it rolls.
  if (src.kind === "signature") {
    const t = item.system.traits, has = k => t?.has?.(k) ?? (Array.isArray(t) && t.includes(k));
    if (has("weapon")) return { type: "armor" };
    if (has("power") || has("magic")) return { type: "ward" };
    return { type: src.from === "power" ? "ward" : "armor" };
  }
  return null;
}

const sign = n => `${n >= 0 ? "+" : "\u2212"} ${Math.abs(n)}`;

/** DC for an action against a target actor: { dc, vs, defense, note, untrained }. */
export function computeDC(item, targetActor, rolledAttr = "", src = null) {
  const base = TWOD12.baseDC, def = defenseOf(item, src, rolledAttr);
  if (!def) return { dc: base, vs: "", defense: "", note: "" };
  const label = def.type === "vs" ? `${TWOD12.attributes[def.key]} DC` : def.type === "armor" ? "AD" : "WD";   // the core rework A7: "Body DC" (was "Vs. Body")
  if (!targetActor) return { dc: base, vs: def.type === "vs" ? def.key : "", defense: def.type, note: `${label}: no target, using DC ${base}` };
  const t = targetActor.system ?? {}, tags = actionTags(item);
  let dc, bits;
  if (def.type === "vs") {
    const attr = Math.trunc(Number(t.attributes?.[def.key]) || 0), vb = TWOD12.vsBase;   // book, Chapter 1, Attribute DCs: 11 + the Attribute
    dc = vb + attr; bits = [`${vb}`, `${sign(attr)} (${TWOD12.attributes[def.key]})`];
  } else {
    const derived = def.type === "armor" ? t.armorDC : t.wardDC;
    if (Number.isFinite(derived)) { dc = derived; bits = [...(def.type === "armor" ? t.armorParts : t.wardParts) ?? [`${derived}`]]; }   // the actor's own Defense (data.deriveDefenses)
    else {
      const value = def.type === "armor" ? (t.armorValue ?? TWOD12.armors[t.armor]?.value ?? 0) : (t.wardValue ?? t.ward ?? 0);
      const what = def.type === "armor" ? (t.armorLabel ?? TWOD12.armors[t.armor]?.label ?? "Unarmored") : "Ward value";
      dc = TWOD12.defenseBase + value; bits = [`${TWOD12.defenseBase}`, `${sign(value)} (${what})`];
    }
  }
  const bonus = defenseBonus(targetActor, def.type === "vs" ? def.key : def.type, tags);
  dc += bonus.total;
  for (const p of bonus.parts) bits.push(`${sign(p.bonus)} ${p.name}`);
  const untrained = def.type !== "vs" && !!t.armorUntrained;
  return { dc, vs: def.type === "vs" ? def.key : "", defense: def.type, untrained, note: `${label} (${targetActor.name}): ${bits.length > 1 ? `${bits.join(" ")} = ` : ""}${dc}${untrained ? " \u00b7 untrained armor: Favored" : ""}` };
}
