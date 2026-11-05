// What an edit of an applied effect changes on it (fxapplied.mjs uses it; kept apart so the tests can load it without the sheets).
import { appliedFlags, isValued } from "./effects.mjs";
import { isExhaustedFx } from "./sleep.mjs";
import { TWOD12 } from "./config.mjs";

const F = "twod12";

/** What changes on the applied effect when its settings change. Pure: the tests call it. */
export function appliedUpdate(fx, system, source, name, img) {
  const old = foundry.utils.deepClone(fx.flags?.[F] ?? {});
  const flags = appliedFlags(system, source);
  // A granted use keeps what was already spent, as long as it is the same Action.
  flags.grants = flags.grants.map((g, i) => {
    const o = old.grants?.[i];
    if (!o || o.spec !== g.spec) return g;
    const spent = Math.max(0, (o.count ?? g.count) - (o.left ?? o.count ?? g.count));
    return { ...g, left: Math.max(0, g.count - spent), used: o.used ?? [] };
  });
  const update = isExhaustedFx(fx) ? {} : { img };
  for (const [k, v] of Object.entries(flags)) update[`flags.${F}.${k}`] = v;
  if (isExhaustedFx(fx)) { /* "Exhausted N": the name follows its value (sleep.mjs) */ }
  else if (isValued(fx)) { update.name = `${name} ${Number(fx.getFlag(F, "value")) || 1}`; update[`flags.${F}.baseName`] = name; }
  else update.name = name;
  const d = system.duration, od = old.duration ?? {};
  if (d.type !== od.type || (d.type === "rounds" && d.rounds !== od.rounds)) {   // a new duration starts again
    update[`flags.${F}.duration`] = { type: d.type, rounds: d.rounds };
    update[`flags.${F}.remaining`] = d.rounds;
  }
  const oldC = old.source?.conditions ?? [], newC = source.conditions ?? [];
  return {
    update,
    added: newC.filter(c => c.uuid && !oldC.some(o => o.uuid === c.uuid)),
    removed: oldC.filter(o => o.uuid && !newC.some(c => c.uuid === o.uuid)),
    duration: update[`flags.${F}.duration`] ?? old.duration ?? { type: d.type, rounds: d.rounds }
  };
}


/** A blank setting with every field (the Effect item's defaults). */
const blankSetting = type => ({ type, attrs: [], title: "", text: "", bright: 0, dim: 0, color: "", lightAlpha: 0.5, lightAnim: "", lightSpeed: 5, lightIntensity: 5, boons: 0, banes: 0, empowered: 0, enfeebled: 0, byValue: false, predicate: "", all: [], any: [], none: [], from: [],
  dmg: "", dmgPool: "B", dmgSub: "", tiers: ["t1", "t2", "t3"], fxUuid: "", against: false, speedMode: "add", speedFormula: "", grantAction: "", grantCount: 1, grantAp: 0, grantDistinct: false, defKind: "all", defValue: 1, minEscalation: 0, auraSize: 1, auraWho: "allies", auraSelf: false, auraOutline: "", auraFill: "", trigSub: "", trigTag: "", oncePerRound: false, vsMarked: false, ignoreRule: "rangeBane", rallyBonus: "", rallyRange: 0 });

/**
 * The settings of an applied effect that has no copy of them (an old one, one made by hand in Foundry, or Exhausted),
 * rebuilt from what it stores for the rolls, damage, Speed, uses and notes. Light isn't stored, so it can't come back.
 * Only known traits go in the trait lists (an Effect item refuses others); the first unknown one of a modifier goes back as its old text predicate.
 */
export function sourceFromFlags(fx) {
  const f = fx.flags?.[F] ?? {};
  const known = k => k in TWOD12.traits || k in (TWOD12.rollKinds ?? {});
  const traits = a => (Array.isArray(a) ? a : []).filter(known);
  const settings = [
    ...(f.modifiers ?? []).flatMap(m => {
      const base = { all: traits(m.all), any: traits(m.any), none: traits(m.none), from: traits(m.from), predicate: (m.all ?? []).find(k => !known(k)) ?? "" };
      const emp = Number(m.empowered) || 0, enf = Number(m.enfeebled) || 0, boons = Number(m.boons) || 0, banes = Number(m.banes) || 0;
      const out = [];
      if (boons || banes || (!emp && !enf)) out.push({ ...blankSetting("boonbane"), ...base, boons, banes, byValue: !!m.byValue, against: !!m.against, oncePerRound: !!m.oncePerRound, vsMarked: !!m.vsMarked });
      if ((emp || enf) && !m.against) out.push({ ...blankSetting("damagestep"), ...base, from: [], empowered: emp, enfeebled: enf, vsMarked: !!m.vsMarked });
      return out;
    }),
    ...(f.bonuses ?? []).map(b => ({
      ...blankSetting("bonusdamage"),
      dmg: b.dmg ?? "",
      dmgPool: b.dmgPool ?? "B",
      dmgSub: b.dmgSub ?? "",
      tiers: (b.tiers ?? []).filter(t => ["t1", "t2", "t3"].includes(t)),
      text: b.text ?? "",
      fxUuid: b.fxUuid ?? "",
      all: traits(b.all),
      any: traits(b.any),
      none: traits(b.none)
    })),
    ...(f.grants ?? []).map(g => ({
      ...blankSetting("grant"),
      grantAction: g.spec ?? "",
      grantCount: Math.max(1, Number(g.count) || 1),
      grantAp: Math.max(0, Number(g.ap) || 0),
      boons: Number(g.boons) || 0,
      banes: Number(g.banes) || 0,
      grantDistinct: !!g.distinct
    })),
    ...(f.speedMods ?? []).map(m => ({
      ...blankSetting("speed"),
      speedMode: m.mode === "override" ? "override" : "add",
      speedFormula: String(m.formula ?? "")
    })),
    ...(f.auras ?? []).map(a => ({ ...blankSetting("aura"), auraSize: Math.max(1, Number(a.size) || 1), auraWho: a.who || "allies", auraSelf: !!a.self, auraOutline: a.outline ?? "", auraFill: a.fill ?? "", fxUuid: a.fxUuid ?? "" })),
    ...(f.triggers ?? []).map(t => ({ ...blankSetting("ondamage"), trigSub: t.sub ?? "", trigTag: t.tag ?? "", fxUuid: t.fxUuid ?? "" })),
    ...(f.defenses ?? []).map(d => ({ ...blankSetting("defense"), defKind: d.kind in TWOD12.defenseKinds ? d.kind : "all", defValue: Math.trunc(Number(d.bonus)) || 0 })),
    ...(f.notes ?? []).map(n => ({
      ...blankSetting("note"),
      attrs: (n.attrs ?? []).filter(a => a in TWOD12.attributes),
      title: n.title ?? "",
      text: n.text ?? ""
    }))
  ];
  const d = f.duration ?? {};
  return {
    description: f.description ?? fx.description ?? "", hover: f.hover ?? "", isCondition: !!(fx.statuses?.size), valued: isValued(fx), selfApplied: false, linked: "", conditions: [],
    duration: { type: ["", "eot", "rounds"].includes(d.type) ? d.type : "", rounds: Math.max(1, Number(d.rounds) || 1) },
    settings, expireOn: traits(f.expireOn), expireAll: !!f.expireAll
  };
}
