// v0.0.346 (Lucas on v0.0.345: "Frightened still says can't move closer, and I can't move closer at all"; "the +2 is still not inside"): the
// world's copies made before v0.0.345 keep their old rules, and the compendium's new ones never reach them. Once per world (twod12.mjs), the GM's
// client brings them to the book's rules:
//   Frightened: its Movement limit is "moving closer is Difficult Terrain" (the item's rules and settings, and every Frightened on a creature);
//   Marked Quarry: its Tier 1 [Mod] is of the weapon's subtype ("W").
// Nothing else on those items changes. Also game.twod12.fixRulesV346().
const F = "twod12";
const isFrightened = n => /^frightened\b/i.test(String(n ?? "").trim());
const isQuarry = n => String(n ?? "").trim().toLowerCase() === "marked quarry";

/** Pure: an item's system data with the v0.0.345 rules, or null when nothing changes. */
export function fixedSystem(name, sys) {
  if (!sys) return null;
  const settings = foundry.utils.deepClone(sys.settings ?? []), rules = foundry.utils.deepClone(sys.rules ?? []);
  let changed = false;
  if (isFrightened(name)) {
    for (const s of settings) if (s?.type === "move" && s.moveHow !== "difficult") { s.moveHow = "difficult"; changed = true; }
    for (const r of rules) if (r?.kind === "move" && r.how !== "difficult") { r.how = "difficult"; changed = true; }
    const d = String(sys.description ?? "");
    if (/can't willingly move closer/.test(d)) { changed = true; sys = { ...sys, description: d.replace(/and you can't willingly move closer to it \(Forced Movement still can\)/, "and every square that brings you closer to it is Difficult Terrain for you (Forced Movement ignores it)").replace(/the Bane and the restriction stop/, "the Bane and the Difficult Terrain stop") }; }
  }
  if (isQuarry(name)) {
    for (const s of settings) if (s?.type === "bonusdamage" && String(s.dmg).trim() === "[Mod]" && !s.dmgSub) { s.dmgSub = "W"; changed = true; }
    for (const r of rules) for (const d of r?.dmg?.list ?? []) if (String(d.dice).trim() === "[Mod]" && !d.sub) { d.sub = "W"; changed = true; }
  }
  if (!changed) return null;
  return { ...(sys.description !== undefined ? { description: sys.description } : {}), settings, ...(sys.rules ? { rules } : {}) };
}

/** Pure: an applied Frightened's flags with "Difficult Terrain" limits, or null. */
export function fixedLimits(name, limits) {
  if (!isFrightened(name) || !Array.isArray(limits) || !limits.some(l => l?.how !== "difficult")) return null;
  return limits.map(l => ({ ...l, how: "difficult" }));
}

export async function fixRulesV346() {
  let n = 0;
  const items = [...(game.items ?? [])];
  const actors = [...(game.actors ?? [])];
  for (const sc of game.scenes ?? []) for (const t of sc.tokens ?? []) if (!t.actorLink && t.actor) actors.push(t.actor);
  for (const a of actors) items.push(...(a.items ?? []));
  for (const it of items) {
    if (!["effect", "feature"].includes(it.type)) continue;
    const sys = fixedSystem(it.name, it.system?.toObject?.() ?? it.system);
    if (!sys) continue;
    await it.update(Object.fromEntries(Object.entries(sys).map(([k, v]) => [`system.${k}`, v])));
    n++;
  }
  for (const a of actors) for (const e of [...(a.effects ?? [])]) {
    const lim = fixedLimits(e.name, e.getFlag?.(F, "moveLimits"));
    if (lim) { await e.setFlag(F, "moveLimits", lim); n++; }
  }
  if (n) console.log(`twod12 | v0.0.346: ${n} copies of Frightened / Marked Quarry brought to the v0.0.345 rules`);
  return n;
}

/**
 * v0.0.351 (Lucas: "the area's tooltip shows the enemies' part, not the allies'"): a Zone kept only one carried Effect (PACK ZONE's migration took
 * the first), so Covering Fire's allies never had their +1 Defense. Zones now carry a second; once per world, a world or creature copy of a Zone
 * Effect that has none gets the compendium's second row (by name). Returns how many were updated. Also game.twod12.fixZonesV351().
 */
export async function fixZonesV351() {
  const pack = game.packs?.get("twod12.effects");
  if (!pack) return 0;
  const src = new Map();
  for (const d of await pack.getDocuments()) { const c2 = d.system?.zone?.inside?.carry2; if (d.system?.where === "map" && c2?.fx) src.set(d.name, c2.toObject?.() ?? foundry.utils.deepClone(c2)); }
  if (!src.size) return 0;
  const items = [...(game.items ?? [])];
  for (const a of game.actors ?? []) items.push(...(a.items ?? []));
  let n = 0;
  for (const it of items) {
    const c2 = src.get(it.name);
    if (!c2 || it.type !== "effect" || it.system?.where !== "map" || it.system?.zone?.inside?.carry2?.fx) continue;
    await it.update({ "system.zone.inside.carry2": c2 });
    n++;
  }
  if (n) console.log(`twod12 | v0.0.351: ${n} Zone Effects got their second carried Effect`);
  return n;
}
