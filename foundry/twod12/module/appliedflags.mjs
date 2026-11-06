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
      from: [...(x.from ?? [])],
      oncePerRound: !!x.oncePerRound, vsMarked: !!x.vsMarked
    }));
  const bonuses = s.settings.filter(x => x.type === "bonusdamage").map(x => ({ dmg: x.dmg, dmgPool: x.dmgPool, dmgSub: x.dmgSub, tiers: [...x.tiers], text: x.text, fxUuid: x.fxUuid, all: [...x.all, ...(x.predicate ? [x.predicate] : [])], any: [...x.any], none: [...x.none], oncePerRound: !!x.oncePerRound, vsMarked: !!x.vsMarked }));
  const inlines = s.settings.filter(x => x.type === "inline" && String(x.inlineAction ?? "").trim()).map(x => String(x.inlineAction).trim());   // v0.0.249: inline Actions
  const grants = s.settings.filter(x => x.type === "grant" && x.grantAction).map(x => ({ spec: x.grantAction, count: x.grantCount, left: x.grantCount, ap: x.grantAp, boons: x.boons, banes: x.banes, distinct: x.grantDistinct, on: x.grantOn || x.halfOn || (x.halfT3 ? "t3" : ""), does: x.grantDo || "half", text: String(x.grantText ?? "").trim(), used: [] }));   // v0.0.264: "On [on], [does]"
  const speedMods = s.settings.filter(x => x.type === "speed").map(x => ({ mode: x.speedMode, formula: x.speedFormula }));
  const defenses = s.settings.filter(x => x.type === "defense" && Number(x.defValue)).map(x => ({ kind: x.defKind || "all", bonus: Math.trunc(Number(x.defValue)) || 0 }));
  const auras = s.settings.filter(x => x.type === "aura" && x.fxUuid).map(x => ({ size: Math.max(1, Math.trunc(Number(x.auraSize)) || 1), who: x.auraWho || "allies", self: !!x.auraSelf, fxUuid: x.fxUuid, outline: x.auraOutline || "", fill: x.auraFill || "" }));
  const triggers = s.settings.filter(x => x.type === "ondamage" && x.fxUuid).map(x => ({ sub: x.trigSub || "", tag: String(x.trigTag ?? "").trim(), fxUuid: x.fxUuid }));
  const ignores = s.settings.filter(x => x.type === "ignore" && x.ignoreRule).map(x => ({ rule: x.ignoreRule, all: [...(x.all ?? [])], any: [...(x.any ?? [])], none: [...(x.none ?? [])] }));   // v0.0.186
  const rallies = s.settings.filter(x => x.type === "rally" && String(x.rallyBonus ?? "").trim()).map(x => ({ bonus: String(x.rallyBonus).trim(), range: Math.max(0, Math.trunc(Number(x.rallyRange)) || 0) }));
  const turnStarts = s.settings.filter(x => x.type === "turnstart" && x.fxUuid).map(x => ({ fxUuid: x.fxUuid }));   // v0.0.187: gains this Effect at the start of each of its turns
  // v0.0.207: chat messages at a moment (Marked Quarry's reminders) and weapon properties this creature's weapons lose (Brawler).
  const messages = s.settings.filter(x => x.type === "message" && (String(x.text ?? "").trim() || String(x.msgAction ?? "").trim())).map(x => ({ when: x.msgWhen || "encounter", to: x.msgTo || "owners", text: String(x.text ?? "").trim(), action: String(x.msgAction ?? "").trim(), ap: Math.max(0, Math.trunc(Number(x.msgAp)) || 0) }));
  const propLoss = s.settings.filter(x => x.type === "weaponprop" && x.wpProp).map(x => ({ which: x.wpWhich || "fists", prop: x.wpProp }));
  // v0.0.243 (pack R): the class's Escalation hook: once an encounter, +1 Escalation when the moment happens (Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down; Thrill of the Kill: its mark goes Down).
  const escHooks = s.settings.filter(x => x.type === "eschook").map(x => ({ when: x.hookWhen || "allyState", range: Math.max(0, Math.trunc(Number(x.hookRange)) || 0) }));
  return { description: s.description, hover: s.hover ?? "", notes, modifiers, bonuses, inlines, grants, speedMods, defenses, auras, triggers, ignores, rallies, turnStarts, messages, propLoss, escHooks, minEscalation: Math.max(0, Number(s.minEscalation) || 0), expireOn: [...s.expireOn], expireAll: s.expireAll, source };
}
