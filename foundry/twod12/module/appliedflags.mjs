// What an Effect's settings become on a creature (the flags the rolls, damage, Defense, Speed and uses read).
// Used when an effect is applied, when an applied effect is edited, and for the passives of Features and Talents (passives.mjs). Pure.

/**
 * What an Effect item's settings become on the creature: the flags the rolls, the damage, the Speed and the uses read.
 * Used when it is applied, and again when an applied effect is edited (fxapplied.mjs); source is the item's system as plain data.
 */
export function appliedFlags(s, source) {
  const notes = s.settings.filter(x => x.type === "note").map(x => ({ attrs: [...x.attrs], title: x.title, text: x.text }));
  const modifiers = s.settings
    .filter(x => x.type === "boonbane" || x.type === "damagestep")
    .map(x => ({
      against: x.type === "boonbane" && !!x.against,
      boons: x.boons,
      banes: x.banes,
      empowered: Math.max(0, Math.trunc(Number(x.empowered)) || 0),
      enfeebled: Math.max(0, Math.trunc(Number(x.enfeebled)) || 0),
      byValue: !!x.byValue,
      all: [...x.all, ...(x.predicate ? [x.predicate] : [])],
      any: [...x.any],
      none: [...x.none],
      from: [...(x.from ?? [])]
    }));
  const bonuses = s.settings.filter(x => x.type === "bonusdamage").map(x => ({ dmg: x.dmg, dmgPool: x.dmgPool, dmgSub: x.dmgSub, tiers: [...x.tiers], text: x.text, fxUuid: x.fxUuid, all: [...x.all, ...(x.predicate ? [x.predicate] : [])], any: [...x.any], none: [...x.none] }));
  const grants = s.settings.filter(x => x.type === "grant" && x.grantAction).map(x => ({ spec: x.grantAction, count: x.grantCount, left: x.grantCount, ap: x.grantAp, boons: x.boons, banes: x.banes, distinct: x.grantDistinct, used: [] }));
  const speedMods = s.settings.filter(x => x.type === "speed").map(x => ({ mode: x.speedMode, formula: x.speedFormula }));
  const defenses = s.settings.filter(x => x.type === "defense" && Number(x.defValue)).map(x => ({ kind: x.defKind || "all", bonus: Math.trunc(Number(x.defValue)) || 0 }));
  const auras = s.settings.filter(x => x.type === "aura" && x.fxUuid).map(x => ({ size: Math.max(1, Math.trunc(Number(x.auraSize)) || 1), who: x.auraWho || "allies", self: !!x.auraSelf, fxUuid: x.fxUuid, outline: x.auraOutline || "", fill: x.auraFill || "" }));
  const triggers = s.settings.filter(x => x.type === "ondamage" && x.fxUuid).map(x => ({ sub: x.trigSub || "", tag: String(x.trigTag ?? "").trim(), fxUuid: x.fxUuid }));
  return { description: s.description, hover: s.hover ?? "", notes, modifiers, bonuses, grants, speedMods, defenses, auras, triggers, minEscalation: Math.max(0, Number(s.minEscalation) || 0), expireOn: [...s.expireOn], expireAll: s.expireAll, source };
}
