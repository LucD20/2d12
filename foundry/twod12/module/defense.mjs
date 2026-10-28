// Defenses. An Action against a creature rolls against one of them:
//   Armor Defense, AD (Weapon Actions, and Fists): 11 + Armor value + bonuses;  Ward Defense, WD (Power Actions): 11 + Power Modifier + Ward value + bonuses;
//   an NPC's AD and WD are typed values (the Bestiary).
//   Vs. an Attribute (an Action with a Vs. entry, which replaces Armor and Ward): 13 + half the Attribute, rounded up.
// A Signature Action uses Armor or Ward by the Modifier it rolls. An Action that faces none of these has DC 13.
// Defense bonuses (Features and effects) don't add up: for each Defense, the highest bonus and the highest penalty count.
import { allEffects, isBaseSource } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
import { TWOD12 } from "./config.mjs";

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
      found.push({ name: String(e.name ?? "").replace(/\s*\(.*\)\s*$/, ""), bonus: Number(d.bonus) || 0 });
    }
  }
  const best = found.filter(x => x.bonus > 0).sort((a, b) => b.bonus - a.bonus)[0];
  const worst = found.filter(x => x.bonus < 0).sort((a, b) => a.bonus - b.bonus)[0];
  const parts = [best, worst].filter(Boolean);
  return { total: parts.reduce((s, p) => s + p.bonus, 0), parts };
}


/** Which Defense an Action faces: { type: "vs", key } | { type: "armor" } | { type: "ward" } | null. src: rollSource() of the user. */
export function defenseOf(item, src = null, rolledAttr = "") {
  const vs = item.system.vs === "roll" ? (rolledAttr || "body") : item.system.vs;
  if (vs) return { type: "vs", key: vs };
  if (!src) return null;
  if (src.kind === "weapon") return { type: "armor" };
  if (src.kind === "power") return { type: "ward" };
  if (src.kind === "signature") return { type: src.from === "power" ? "ward" : "armor" };
  return null;
}

const sign = n => `${n >= 0 ? "+" : "\u2212"} ${Math.abs(n)}`;

/** DC for an action against a target actor: { dc, vs, defense, note, untrained }. */
export function computeDC(item, targetActor, rolledAttr = "", src = null) {
  const base = TWOD12.baseDC, def = defenseOf(item, src, rolledAttr);
  if (!def) return { dc: base, vs: "", defense: "", note: "" };
  const label = def.type === "vs" ? `Vs. ${TWOD12.attributes[def.key]}` : def.type === "armor" ? "AD" : "WD";
  if (!targetActor) return { dc: base, vs: def.type === "vs" ? def.key : "", defense: def.type, note: `${label}: no target, using DC ${base}` };
  const t = targetActor.system ?? {}, tags = actionTags(item);
  let dc, bits;
  if (def.type === "vs") {
    const attr = t.attributes?.[def.key] ?? 0, value = Math.ceil(attr / 2) || 0;   // half the Attribute, rounded up
    dc = base + value; bits = [`${base}`, `${sign(value)} (half ${TWOD12.attributes[def.key]} ${attr})`];
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
