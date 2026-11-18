import { TWOD12, migrateTags, npcHm, npcCv, stageOf, stageMod, rallyPointsOf } from "./config.mjs";
import { evalExpr } from "./refs.mjs";
import { migrateSettings, migrateRules, migrateZone } from "./settingsmigrate.mjs";
import { classModifiers, modOf, classTrack } from "./modifiers.mjs";

import { applySpeedMods } from "./speedmods.mjs";
import { s0Health, npcDefenseOf, rankAp, rankReactionAp, cvSteps, cvWithSteps, ROLE_PRESETS } from "./npcbudget.mjs";   // v0.0.407: the Bestiary's Stage 0 numbers
const { SchemaField, NumberField, StringField, BooleanField, ArrayField, SetField, HTMLField, ObjectField } = foundry.data.fields;
const int = (initial = 0, min = 0) => new NumberField({ required: true, nullable: false, integer: true, initial, min });
const sint = (initial = 0) => new NumberField({ required: true, nullable: false, integer: true, initial });
const str = (initial = "") => new StringField({ required: true, blank: true, initial });
const choice = (choices, initial = "") => new StringField({ required: true, blank: true, initial, choices });
const bool = (initial = false) => new BooleanField({ initial });
/** "Modifies other Actions": which Actions (a name, "category:Weapon Technique" or "trait:strike"), when, and what they add. Talents and Actions that are Talents have it. */
const modifiersField = () => new ArrayField(new SchemaField({ spec: str(), when: choice({ always: "Always", outOfTurn: "When used out of your turn" }, "always"), critical: str(), effects: str() }));
const traitsField = choices => new SetField(new StringField({ required: true, blank: false, choices }));
const traitSet = () => new SetField(new StringField({ required: true, blank: false, choices: TWOD12.traits }));
/** The traits an effect setting looks for: the traits, and the roll kinds (Check, Save, Attribute Action). */
const predSet = () => new SetField(new StringField({ required: true, blank: false, choices: { ...TWOD12.traits, ...TWOD12.rollKinds } }));
const attrSet = () => new SetField(new StringField({ required: true, blank: false, choices: TWOD12.attributes }));

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      level: int(1, 0),
      damage: new SchemaField({ bodyLethal: int(), bodyNonlethal: int(), mindLethal: int(), mindNonlethal: int() }),
      bodyWounds: int(), mindWounds: int(), rallyUsed: int(),
      health: new SchemaField({ value: int(), max: int() }),
      notes: new HTMLField(), appearance: new HTMLField(), background: new HTMLField(), gmNotes: new HTMLField(),   // the Notes tab (gmNotes: only the GM sees them)
      size: int(3, 1), exhausted: int(0, 0),
      coins: int(0, 0),   // the money it carries (v0.0.133: the Items tab's Gear line)
      // Defenses: the armor worn (its value: 0 / 1 / 2 / 3) and the Ward value (charms, holy symbols, features). Armor Defense (AD) = 11 + Armor value + bonuses;
      // Ward Defense (WD) = 11 + Power Modifier + Ward value + bonuses (v0.0.162). An NPC types both Defenses instead (NpcData armorDef, wardDef).
      armor: choice(Object.fromEntries(Object.entries(TWOD12.armors).map(([k, v]) => [k, v.label])), "unarmored"), ward: int(0, 0),
      guard: int(0, 0),   // v0.0.181: Guard N (book, Chapter 4): takes damage before the Health, the higher value kept, 0 at the end of the encounter (guard.mjs)
      dmgMods: str(""),   // v0.0.283 (pack chat-cards): "Resist 5 Fire, Weak 2 Holy, Immune Cold" (book, Chapter 1), read by the damage message
      reduceNext: int(0, 0),   // v0.0.254 (cards 4, Shield of Faith): the next damage this creature takes is reduced by this much, then it is 0
      apGuard: int(0, 0),   // v0.0.243 (pack R): the Guard of the AP kept at the end of the turn (2 / 3 / 4 each by Stage): taken first, 0 when the AP are regained
      escalation: int(1, 0),   // v0.0.243 (pack R): a level, never spent (1 to 6 since v0.0.407): 1 + the party's Momentum at the start of an encounter, +1 a round, +1 on a Critical and on the class hook once an encounter (escalation.mjs)
      // v0.0.243 (pack R; book, Health Pool): the class's high Health value goes to Vigor or to Resolve (the player's choice, Vigor by default); a species that lets
      // the player choose the side of its bigger bonus (Human +3 / +2) puts it with the high value unless speciesHigh says a side.
      healthHigh: choice({ vigor: "Vigor", resolve: "Resolve" }, "vigor"), speciesHigh: choice({ "": "With the high value", vigor: "Vigor", resolve: "Resolve" }, ""),
      tags: new SetField(new StringField({ required: true, blank: false })),   // Tags of the creature (a selection: the list is the world setting "Tags"); other rules refer to them
      // Senses beyond Sight and Hearing (see Senses): Sight Senses as switches, and other senses with a range and a condition.
      senses: new SchemaField({
        dimlight: bool(), darksight: bool(), noHeat: bool(), hearing: int(10, 0),   // Hearing range in squares (0: deaf)
        list: new ArrayField(new SchemaField({ name: str(), range: int(6, 0), gives: choice({ clear: "Clear", obscured: "Obscured", hidden: "Hidden" }, "clear"), needs: choice({ none: "Nothing", heat: "Heat", ground: "Same ground" }, "none") }))
      })
    };
  }

  static migrateData(source) {
    if (typeof source?.tags === "string") source.tags = migrateTags(source.tags);   // v0.0.105 stored text
    return super.migrateData(source);
  }

  prepareDerivedData() {
    const items = this.parent?.items ?? [];
    const species = items.find(i => i.type === "species");
    const cls = items.find(i => i.type === "class");
    const a = { body: 0, mind: 0, appeal: 0, instinct: 0 };
    if (species) {
      for (const k of Object.keys(a)) a[k] += species.system.attributes[k] ?? 0;
      if (species.system.pickTwo) for (const k of species.system.chosen) if (k in a) a[k] += 1;
    }
    if (cls) for (const k of (cls.system.chosenAttrs?.length ? cls.system.chosenAttrs : [cls.system.chosenA, cls.system.chosenB])) if (k in a) a[k] += 1;
    this.attributes = a;
    this.speciesName = species?.name ?? "None";
    this.className = cls?.name ?? "None";
    this.speed = (species?.system.speed ?? 0) + (cls?.system.speedMod ?? 0);
    this.reach = species?.system.reach ?? 1;
    this.size = species?.system.size ?? 3;
    this.steadiness = Math.max(0, Number(species?.system.steadiness) || 0);   // Features, Talents and effects that add to it: later
    this.moveSpeed = applySpeedMods(this.parent, this.speed);
    if (this.exhausted > 0) this.moveSpeed = Math.max(1, this.moveSpeed - this.exhausted);   // Exhausted: Speed - value, minimum 1
    this.wounds = this.bodyWounds + this.mindWounds;

    const lv = this.level;
    this.stage = stageOf(lv);
    // v0.0.243 (pack R; book, Chapter 4): the Health line: the class's high and low values (the player assigns them: healthHigh), the species' Vigor and
    // Resolve bonuses, the class's Stage steps, a floor of a third; the Attributes are out. A class from before pack R (no high value, a multiplier)
    // keeps the old formula until it is updated from the compendium.
    const csys = cls?.system, ssys = species?.system;
    const hl = healthLine({ high: csys?.healthHigh ?? 0, low: csys?.healthLow ?? 0, steps: { high1: csys?.stepHigh1 ?? 0, low1: csys?.stepLow1 ?? 0, high2: csys?.stepHigh2 ?? 0, low2: csys?.stepLow2 ?? 0, high3: csys?.stepHigh3 ?? 0, low3: csys?.stepLow3 ?? 0 },
      stage: this.stage, highSide: this.healthHigh === "resolve" ? "resolve" : "vigor", bonus: { v: ssys?.bodyMod ?? 0, r: ssys?.mindMod ?? 0, pick: !!ssys?.pickHealth, side: this.speciesHigh || "" } });
    let mdtFull;
    const oldClass = !!csys && !(Number(csys.healthHigh) > 0 || Number(csys.healthLow) > 0) && (Number(csys.bodyMult) > 0 || Number(csys.mindMult) > 0);
    if (!oldClass) { this.bdt = hl.vigor; mdtFull = hl.resolve; this.healthLine = hl; }
    else {
      // v0.0.181 (book before pack R): each threshold x (Level + 17) / 16, rounded up.
      const thr = (at, mult, sp) => Math.max(0, Math.ceil(((at + 2) * mult + sp) * ((Number(lv) || 0) + 17) / 16 - 1e-9));
      this.bdt = thr(a.body, csys.bodyMult ?? 0, ssys?.bodyMod ?? 0); mdtFull = thr(a.mind, csys.mindMult ?? 0, ssys?.mindMod ?? 0);
      this.healthLine = { ...hl, vigor: this.bdt, resolve: mdtFull, pool: this.bdt + mdtFull, old: true };
    }
    this.mdt = Math.max(0, mdtFull - 4 * (this.exhausted ?? 0));   // Exhausted: - 4 x value
    deriveHealth(this);

    this.rallyHeal = Math.ceil((this.bdt + mdtFull) / 4);   // Rally Points use the Health Pool before Exhausted lowers Resolve
    // v0.0.243 (pack R; book, Rally Points): the class's Rally value + 1 / 2 / 3 / 4 by Stage (v0.0.407: Stages 0 to 3).
    this.rallyMax = rallyPointsOf(csys?.rallyMod ?? 0, lv);
    this.rallyLeft = Math.max(0, this.rallyMax - this.rallyUsed);
    this.apPerTurn = TWOD12.apPerTurn;

    const cs = cls?.system;
    if (cs && (Number(cs.modHigh) > 0 || Number(cs.modLow) > 0)) {
      // v0.0.305 (pack MOD; book, Chapter 5): the class's two values, in the order the class fixes or the player chose, + the Stage steps (modifiers.mjs classTrack).
      const t = classTrack({ high: cs.modHigh, low: cs.modLow, order: cs.modOrder, lead: cs.modPriority === "power" ? "power" : "weapon", stage1: cs.modStage2, stage: this.stage, cap: TWOD12.modCap });
      this.modSource = "class"; this.modWeaponFirst = t.weaponFirst;
      this.weaponAttribute = ""; this.weaponAttrValue = 0; this.weaponMod = t.weapon;
      this.powerAttribute = ""; this.powerAttrValue = 0; this.powerMod = t.power;
      this.signatureAttribute = ""; this.signatureAttrValue = 0; this.signatureMod = t.signature; this.signatureFrom = t.from;
      this.modConflict = false;
      this.armorTraining = cs.armorTraining || "light";
      deriveDefenses(this, this.armorTraining);
      this.magicAttribute = ""; this.magicAttrValue = 0; this.magicMod = this.powerMod;
      return;
    }
    // Before pack MOD (a class copy not yet updated from the compendium): the higher of the class's two Attributes each, never the same one (modifiers.mjs).
    // A class from before v0.0.117 that has no lists keeps the Attribute that was picked for it.
    this.modSource = cs ? "attrs" : "";
    const wKeys = cs ? ([...(cs.weaponAttrs ?? [])].length ? [...cs.weaponAttrs] : [cs.chosenWeapon].filter(Boolean)) : [];
    const pKeys = cs ? ([...(cs.magicAttrs ?? [])].length ? [...cs.magicAttrs] : [cs.chosenMagic].filter(Boolean)) : [];
    const cm = classModifiers(a, wKeys, pKeys, cs?.modPriority === "power" ? "power" : "weapon");
    // v0.0.243 (book, Chapter 5, pack R): the Stage step to both, +1 at Stage 3 (level 12 since v0.0.407), never above +4; the Signature Modifier follows the higher one.
    cm.weapon.mod = stageMod(cm.weapon.mod, lv); cm.power.mod = stageMod(cm.power.mod, lv);
    cm.signature.mod = cm.signature.from === "power" ? cm.power.mod : cm.weapon.mod;
    this.weaponAttribute = cm.weapon.key; this.weaponAttrValue = cm.weapon.value; this.weaponMod = cm.weapon.mod;
    this.powerAttribute = cm.power.key; this.powerAttrValue = cm.power.value; this.powerMod = cm.power.mod;
    this.signatureAttribute = cm.signature.key; this.signatureAttrValue = cm.signature.value; this.signatureMod = cm.signature.mod; this.signatureFrom = cm.signature.from;
    this.modConflict = cm.conflict;
    // Armor Training: the class's (Light by default without a class); Unarmored is always trained. Untrained: Rolls Doomed, Actions against Armor or Ward Favored.
    this.armorTraining = cs?.armorTraining || "light";
    deriveDefenses(this, this.armorTraining);
    this.magicAttribute = this.powerAttribute; this.magicAttrValue = this.powerAttrValue; this.magicMod = this.powerMod;   // the old names (Magic is Power now)
  }
}

/**
 * Armor and Ward: their values and DCs, and whether the armor worn is beyond the creature's training.
 * The worn Armor item decides (its category, plus its bonus; its Ward adds to the creature's). Without one, a character is Unarmored
 * and an NPC uses the armor of its stat block (the Armor choice on its sheet).
 */
export function deriveDefenses(m, training) {   // exported for the tests (t135)
  const npc = m.parent?.type === "npc", B = TWOD12.defenseBase;
  const worn = npc ? null : ((m.parent?.itemTypes?.armor ?? []).find(i => i.system.worn) ?? null);   // an NPC's items are loot: its Defenses are its stat block's
  const key = worn ? worn.system.category : (npc ? m.armor : "unarmored");
  const a = TWOD12.armors[key] ?? TWOD12.armors.unarmored;
  m.armorKey = key; m.armorLabel = worn ? worn.name : a.label; m.armorItemId = worn?.id ?? "";
  const sgn = n => `${n >= 0 ? "+" : "\u2212"} ${Math.abs(n)}`;
  if (npc) {
    // The Bestiary: an NPC's Armor Defense and Ward Defense are typed values (a rating of its role's Defense table), never below 11.
    m.armorDC = Number(m.armorDef) || 0; m.wardDC = Number(m.wardDef) || 0;   // (the tables never give less than 11; a Custom number is taken as typed)
    m.armorValue = m.armorDC - B; m.wardValue = m.wardDC - B;
    m.armorParts = [`${m.armorDC}`]; m.wardParts = [`${m.wardDC}`];
    m.armorUntrained = false;
  } else {
    m.armorValue = a.value + (worn ? Number(worn.system.bonus) || 0 : 0);
    m.armorDC = B + m.armorValue;
    // Ward Defense = 11 + Power Modifier + Ward value (items and features; species give none since v0.0.162).
    const pm = Number(m.powerMod) || 0;
    m.wardValue = Math.max(0, (Number(m.ward) || 0) + (worn ? Number(worn.system.ward) || 0 : 0));
    m.wardDC = B + pm + m.wardValue;
    m.armorParts = [`${B}`, `${sgn(m.armorValue)} (${m.armorLabel})`];
    m.wardParts = [`${B}`, `${sgn(pm)} (Power Modifier)`, ...(m.wardValue ? [`${sgn(m.wardValue)} (Ward value)`] : [])];
    const need = a.rank, have = TWOD12.armors[training]?.rank ?? 3;
    m.armorUntrained = need > 0 && need > have;
  }
  // The DCs of the Saves this creature makes others roll (Saves in the rules): 11 + the Weapon, Power or Signature Modifier,
  // or 11 + (half the Attribute, rounded up, + 1). Cards write them as @Save[body|dc:@weapon.dc].
  const at = m.attributes ?? {};
  m.saveDC = { weapon: 11 + (Number(m.weaponMod) || 0), power: 11 + (Number(m.powerMod) || 0), signature: 11 + (Number(m.signatureMod) || 0),
    body: 11 + modOf(at.body), mind: 11 + modOf(at.mind), appeal: 11 + modOf(at.appeal), instinct: 11 + modOf(at.instinct) };
}

/**
 * v0.0.243 (pack R; book, Chapter 4, Health Pool): the Health line. The class gives a high and a low value; the player puts the high one on Vigor or
 * Resolve (highSide); each grows by the class's step for its value at Stages 2 and 3; the species adds its bonus on each side (a species with pick
 * lets the player put the bigger bonus on a side: with the high value unless side says one); neither threshold may be under a third of the pool
 * (rounded up): points move from the other one. Pure (the tests load it). Returns { vigor, resolve, pool, moved, highSide, bonusHighSide, parts }.
 */
export function healthLine({ high = 0, low = 0, steps = {}, stage = 0, highSide = "vigor", bonus = {} } = {}) {
  // v0.0.407 (Stage 0 in Foundry; book, Chapter 5): Stages 0 to 3; the class's steps at Stages 1, 2 and 3, each added to the ones before
  const n = v => Math.max(0, Math.trunc(Number(v)) || 0), st = Math.min(3, Math.max(0, Math.trunc(Number(stage)) || 0));
  let hi = n(high), lo = n(low);
  if (st >= 1) { hi += n(steps.high1); lo += n(steps.low1); }
  if (st >= 2) { hi += n(steps.high2); lo += n(steps.low2); }
  if (st >= 3) { hi += n(steps.high3); lo += n(steps.low3); }
  const hv = highSide === "resolve" ? "resolve" : "vigor";
  let bv = Math.trunc(Number(bonus.v)) || 0, br = Math.trunc(Number(bonus.r)) || 0;
  // A species whose bigger bonus is the player's choice (Human +3 / +2): the typed Vigor bonus is the bigger one; its side follows the high value or the choice.
  let bonusHighSide = "";
  if (bonus.pick) {
    const big = Math.max(bv, br), small = Math.min(bv, br);
    bonusHighSide = bonus.side === "vigor" || bonus.side === "resolve" ? bonus.side : hv;
    bv = bonusHighSide === "vigor" ? big : small; br = bonusHighSide === "vigor" ? small : big;
  }
  let vigor = (hv === "vigor" ? hi : lo) + bv, resolve = (hv === "vigor" ? lo : hi) + br;
  const pool = vigor + resolve, floor = Math.ceil(pool / 3 - 1e-9);
  let moved = 0;
  if (pool > 0 && vigor < floor) { moved = Math.min(floor - vigor, resolve); vigor += moved; resolve -= moved; }
  else if (pool > 0 && resolve < floor) { moved = Math.min(floor - resolve, vigor); resolve += moved; vigor -= moved; }
  return { vigor, resolve, pool, moved, highSide: hv, bonusHighSide, floor: pool > 0 ? floor : 0, classVigor: hv === "vigor" ? hi : lo, classResolve: hv === "vigor" ? lo : hi, bonusVigor: bv, bonusResolve: br };
}

/** Health Pool values derived from the thresholds (bdt, mdt) and the recorded damage. Shared by characters and NPCs. */
function deriveHealth(m) {
  const d = m.damage;
  m.pool = m.bdt + m.mdt;
  m.bodyDamage = d.bodyLethal + d.bodyNonlethal;
  m.mindDamage = d.mindLethal + d.mindNonlethal;
  m.lethal = d.bodyLethal + d.mindLethal;
  m.nonlethal = d.bodyNonlethal + d.mindNonlethal;
  m.totalDamage = m.lethal + m.nonlethal;
  m.hpLeft = m.pool - m.totalDamage;
  m.health = { value: Math.max(0, m.hpLeft), max: m.pool };
  m.bloodied = m.bdt > 0 && m.bodyDamage >= m.bdt;   // equal or more than the threshold
  m.strained = m.mdt > 0 && m.mindDamage >= m.mdt;
  m.atZero = m.pool > 0 && m.totalDamage >= m.pool;
  m.dominant = m.bodyDamage > m.mindDamage ? "Body" : (m.mindDamage > m.bodyDamage ? "Mind" : "Tie");
  let st = "";
  if (m.atZero) {
    if (m.nonlethal >= m.pool / 2) st = "Unconscious (Nonlethal 50%+)";
    else if (m.nonlethal > 0) st = "Choose: Unconscious or Desperate";
    else if (m.dominant === "Body") st = "Dying";
    else if (m.dominant === "Mind") st = "Shattered";
    else st = "Tie: the creature going down chooses Dying or Shattered";
  }
  m.zeroState = st;
}

/**
 * The Bestiary (v0.0.163): an NPC's numbers from its role and its ratings. A rating can be "custom": then the typed number is used
 * (custom.<attribute>, custom.bodyHealth / mindHealth, armorDef / wardDef). Health uses the row of the NPC's Stage (v0.0.181).
 * Returns { role, rating(key), attributes, bodyHm, mindHm, bdt, mdt, armorDef, wardDef } (hm null when custom).
 */
export function npcBuild(sys) {
  const role = TWOD12.npcRoles[sys.role] ?? TWOD12.npcRoles.standard, R = TWOD12.npcRatings;
  const rating = k => { let r = sys.ratings?.[k] || "medium"; if (r !== "custom" && !R[r]) r = "medium"; if (r === "extreme" && !role.extreme) r = "high"; return r; };
  const attributes = {};
  for (const k of Object.keys(TWOD12.attributes)) attributes[k] = rating(k) === "custom" ? (Number(sys.custom?.[k]) || 0) : role.attr + R[rating(k)].off;
  const hmOf = r => npcHm(sys.role, r, sys.level);   // v0.0.181: the row of the level's Stage
  // v0.0.407 (Stage 0 in Foundry; the Bestiary, Health): at Stage 0 an NPC's Vigor and Resolve are each its rating's ready number (no Attribute, no
  // multiplier: hm null); the later Stages keep pack R's rows until the book writes them
  const s0 = stageOf(sys.level) === 0, rank = TWOD12.npcRoles[sys.role] ? sys.role : "standard";
  const health = (key, attr) => { const r = rating(`${key}Hm`); if (r === "custom") return { hm: null, v: Number(sys.custom?.[`${key}Health`]) || 0 };
    if (s0) return { hm: null, v: s0Health(rank, r) };
    const hm = hmOf(r); return { hm, v: Math.max(0, Math.ceil((attr + 2) * hm + role.hb - 1e-9)) }; };
  const b = health("body", attributes.body), m = health("mind", attributes.mind);
  // A Custom number is used as typed, even outside the tables (the Builder tab warns). v0.0.407 (the Bestiary, Defenses): two points a rating
  // going up, from the rank's table (config.mjs npcDefense; a Minion's one point), at every Stage
  const def = (k, typed) => (rating(k) === "custom" ? (Number(typed) || 0) : npcDefenseOf(rank, rating(k)));
  const sr = String(sys.ratings?.speed ?? "5"), speed = sr === "custom" ? Math.max(0, Number(sys.speed) || 0) : (Number(sr) || 5);
  return { role, rating, attributes, bodyHm: b.hm, mindHm: m.hm, bdt: b.v, mdt: m.v, armorDef: def("ad", sys.armorDef), wardDef: def("wd", sys.wardDef), speed, speedCustom: sr === "custom" };
}

/** Pack MOD: an NPC's lead Modifier: its modLead, or, for an NPC from before (""), the old Weapon / Power Attribute that is higher (Weapon on a tie). */
export function npcLead(sys) {
  if (sys?.modLead === "weapon" || sys?.modLead === "power") return sys.modLead;
  const at = sys?.attributes ?? {}, w = Number(at[sys?.weaponAttribute ?? "body"]) || 0, p = Number(at[sys?.powerAttribute ?? "mind"]) || 0;
  return p > w ? "power" : "weapon";
}

/** v0.0.307 (Lucas; the Bestiary): an NPC's Weapon and Power Modifier ratings. A rating left at "" is the default: the lead Modifier
 *  (npcLead) Medium, the other Low (a Standard's Medium too). Returns { weapon, power } rating keys. */
export function npcModRatings(sys) {
  const lead = npcLead(sys), other = sys?.role === "standard" ? "medium" : "low", r = sys?.ratings ?? {};
  return { weapon: r.wmod || (lead === "weapon" ? "medium" : other), power: r.pmod || (lead === "power" ? "medium" : other) };
}
/** The Modifier of a rating for a role (the book's table; a Minion's Extreme is its High). */
export function npcModValue(roleKey, rating) {
  const role = TWOD12.npcRoles[roleKey] ?? TWOD12.npcRoles.standard, i = TWOD12.npcRatings[rating]?.i ?? 2;
  return Math.min(TWOD12.modCap, role.modBy[Math.min(i, role.modBy.length - 1)]);
}

export class NpcData extends CharacterData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      attributes: new SchemaField({ body: sint(), mind: sint(), appeal: sint(), instinct: sint() }),
      speed: int(5), weaponAttribute: choice(TWOD12.attributes, "body"), powerAttribute: choice(TWOD12.attributes, "mind"),   // before pack MOD: only read when modLead is ""
      modLead: choice({ "": "Default", weapon: "Weapon Modifier", power: "Power Modifier" }, ""),   // v0.0.307: only read for a rating left at its default   // v0.0.305 (pack MOD): which of the role's Modifiers is the higher one
      // The Bestiary (v0.0.163): its role and a rating for each number ("custom": the typed number below is used).
      // v0.0.407 (the Bestiary, Lucas 2026-11-12): "role" is the rank (Minion, Grunt, Standard, Elite; the key kept); npcRole is the new optional role,
      // a preset of ratings (Striker...: npcbudget.mjs ROLE_PRESETS), no rules of its own
      role: choice(Object.fromEntries(Object.entries(TWOD12.npcRoles).map(([k, v]) => [k, v.label])), "standard"),
      npcRole: choice({ "": "None", ...Object.fromEntries(Object.entries(ROLE_PRESETS).map(([k, v]) => [k, v.label])) }, ""),
      ratings: new SchemaField(Object.fromEntries([["body", "high"], ["mind", "medium"], ["appeal", "low"], ["instinct", "medium"], ["bodyHm", "medium"], ["mindHm", "medium"], ["ad", "medium"], ["wd", "medium"], ["damage", "medium"]]
        .map(([k, d]) => [k, choice({ terrible: "Terrible", low: "Low", medium: "Medium", high: "High", extreme: "Extreme", custom: "Custom" }, d)])
        .concat([["speed", choice({ 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", custom: "Custom" }, "5")]])
        // v0.0.307 (Lucas): the Weapon and Power Modifiers as ratings ("" = the default: npcModRatings)
        .concat(["wmod", "pmod"].map(k => [k, choice({ "": "Default", terrible: "Terrible", low: "Low", medium: "Medium", high: "High", extreme: "Extreme" }, "")])))),   // speed: Custom uses system.speed
      custom: new SchemaField({ body: sint(), mind: sint(), appeal: sint(), instinct: sint(), bodyHealth: sint(10), mindHealth: sint(10) }),
      armor: choice(Object.fromEntries(Object.entries(TWOD12.armors).map(([k, v]) => [k, v.label])), "medium"),   // its Armor type (for rules and Talents that ask); medium: a typical enemy
      armorDef: sint(13), wardDef: sint(13),   // its typed Armor Defense and Ward Defense, used when that rating is Custom (any number)
      useEscalation: bool(false),   // an NPC can have Escalation too (an elite foe): off by default
      eliteLadder: bool(true),   // v0.0.320 (pack AU part 2): with Escalation on, the Bestiary's default Elite ladder works by itself (passives.mjs); off: its entry says otherwise (its own Features)
      reachBase: int(1, 1),   // the creature's Reach (most are 1; a big creature or a long-limbed one more)
      steadiness: int(0, 0)   // v0.0.169: resistance to being moved: 0 unless its description says otherwise (Builder tab: 0 to 4)
    };
  }

  prepareDerivedData() {
    // The Bestiary: Attributes, Health and Defenses come from the role and the ratings (npcBuild). AP a turn: 3 for a Minion, 4 for the others (pack R), and the Reaction AP for every NPC.
    const nb = npcBuild(this);
    Object.assign(this.attributes, nb.attributes);
    this.bdt = Math.max(0, nb.bdt); this.mdt = Math.max(0, nb.mdt); this.armorDef = nb.armorDef; this.wardDef = nb.wardDef; this.speed = nb.speed;
    this.bodyHm = nb.bodyHm; this.mindHm = nb.mindHm; this.roleLabel = nb.role.label; this.stage = stageOf(this.level);
    // v0.0.407 (the Bestiary): a Minion's and a Grunt's 3 AP, a Minion's no Reaction AP; the CV moves with its ratings (npcbudget.mjs cvSteps)
    const rank = TWOD12.npcRoles[this.role] ? this.role : "standard";
    this.apPerTurn = rankAp(rank); this.reactionApMax = rankReactionAp(rank);
    this.cvBase = npcCv(this.role, this.level); this.cvSteps = cvSteps(rank, this.ratings ?? {}, npcModRatings(this)); this.cv = cvWithSteps(rank, this.cvBase, this.cvSteps);
    this.npcRoleLabel = ROLE_PRESETS[this.npcRole]?.label ?? "";
    deriveHealth(this);
    this.wounds = 0;
    this.reach = Math.max(1, Number(this.reachBase) || 1);   // the stat block's Reach (edited in the sidebar)
    this.steadiness = Math.max(0, Number(this.steadiness) || 0);
    this.moveSpeed = applySpeedMods(this.parent, this.speed);
    // NPCs do not use the Dying and Shattered tables: at 0 HP they die with more lethal damage, or fall unconscious with more nonlethal.
    if (this.atZero) this.zeroState = this.lethal > this.nonlethal ? "Dead (more Lethal damage)" : (this.nonlethal > this.lethal ? "Unconscious (more Nonlethal damage)" : "Dead or Unconscious (the GM chooses)");
    // v0.0.340 (Lucas; book, Rally Points: NPCs): no Rally Points, but one an Action lets it use (or measures with: Guard RP) is its Stage's amount
    this.rallyHeal = TWOD12.npcRallyHeal?.[Math.max(0, Math.min(3, Number(this.stage) || 0))] ?? 9; this.rallyMax = 0; this.rallyLeft = 0;
    // v0.0.305 (pack MOD; the Bestiary, Attributes and Modifiers): the role's two Modifiers (Minion and Grunt +2 / +1, Standard +2 / +2, Elite +3 / +2),
    // the lead one chosen (modLead; "" = the old Weapon / Power Attribute that is higher, Weapon on a tie). No Stage step; Signature: the higher.
    // v0.0.307 (Lucas): each Modifier is a rating of the role's table (npcModRatings, npcModValue).
    this.modLeadKey = npcLead(this);
    const mr = npcModRatings(this);
    this.modRatings = mr;
    this.modSource = "role";
    this.weaponAttrValue = 0; this.weaponMod = npcModValue(this.role, mr.weapon); this.powerAttrValue = 0; this.powerMod = npcModValue(this.role, mr.power);
    const sigP = this.powerMod > this.weaponMod;
    this.signatureAttribute = ""; this.signatureAttrValue = 0; this.signatureMod = sigP ? this.powerMod : this.weaponMod; this.signatureFrom = sigP ? "power" : "weapon";
    this.modConflict = false;
    this.armorTraining = "heavy";   // NPCs wear what their stat block says
    deriveDefenses(this, this.armorTraining);
    this.magicAttribute = this.powerAttribute; this.magicAttrValue = this.powerAttrValue; this.magicMod = this.powerMod;
  }
}


export class SpeciesData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      attributes: new SchemaField({ body: sint(), mind: sint(), appeal: sint(), instinct: sint() }),
      pickTwo: bool(),
      // bodyMod / mindMod: the species' Vigor and Resolve bonuses (pack R, v0.0.243: Dwarf +4 / +1, Elf +1 / +4; the keys keep their old names).
      // pickHealth: the player chooses which threshold gets the bigger bonus (Human +3 / +2): the bigger one is typed as the Vigor bonus.
      bodyMod: sint(), mindMod: sint(), pickHealth: bool(), speed: int(5), reach: int(1, 0), size: int(3, 1),
      steadiness: int(0, 0),   // v0.0.169: resistance to being moved (Dwarf 1, the others 0)
      chosen: attrSet()
    };
  }
}
/**
 * v0.0.407 (Stage 0 in Foundry; book, Chapter 5): a class copy saved before the Stages moved (Stage 1 was levels 1-4, Stage 2 5-7, Stage 3 8-10) has
 * Health steps at Stages 2 and 3 and none at Stage 1. v0.0.408 (Lucas, 2026-11-17: "0 until written"): the book hasn't written the steps of Stages 1
 * to 3 yet, so every step is 0 until it does (pack R's steps are not carried over). Only a copy with no stepHigh1 key.
 */
export function migrateClassSteps(source) {
  if (!source || typeof source !== "object" || "stepHigh1" in source || !("stepHigh2" in source || "stepLow2" in source)) return source;
  for (const n of [1, 2, 3]) { source[`stepHigh${n}`] = 0; source[`stepLow${n}`] = 0; }
  return source;
}

export class ClassData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      choiceA: attrSet(), choiceB: attrSet(),
      // bodyMult / mindMult: the Health multipliers of a class from before pack R (kept so an old copy still computes until it is updated).
      bodyMult: new NumberField({ required: true, nullable: false, initial: 0, min: 0, step: 0.5 }), mindMult: new NumberField({ required: true, nullable: false, initial: 0, min: 0, step: 0.5 }), rallyMod: sint(), speedMod: sint(),
      // v0.0.243 (pack R; book, Chapter 4): the class's high and low Health values and the steps each grows by at Stages 1, 2 and 3 (v0.0.407: Stages 0
      // to 3; v0.0.408: all 0 until the book writes them, Lucas 2026-11-17).
      healthHigh: int(0, 0), healthLow: int(0, 0), stepHigh1: int(0, 0), stepLow1: int(0, 0), stepHigh2: int(0, 0), stepLow2: int(0, 0), stepHigh3: int(0, 0), stepLow3: int(0, 0),
      weaponAttrs: attrSet(), magicAttrs: attrSet(),
      features: new ArrayField(new SchemaField({ uuid: str(), level: int(1, 0) })),
      chosenA: str(), chosenB: str(), chosenWeapon: str(), chosenMagic: str(),   // chosenWeapon / chosenMagic: only for classes from before v0.0.117
      modPriority: choice({ weapon: "Weapon Modifier", power: "Power Modifier" }, "weapon"),   // pack MOD: which Modifier leads (an "either" class) and takes a Signature tie; before: which kept an Attribute both would use
      // v0.0.305 (pack MOD; book, Chapter 5): the class's two Modifier values (Paladin +2 / +1 either way; Archer Weapon +2, Power +1). 0 / 0: a class
      // from before keeps the Attribute formula until it is updated from the compendium. modStage2: the Modifier the player raises at Stage 1 ("" = the lead one;
      // the key kept from pack MOD, when it was the Stage 2 pick: v0.0.407 moved it to Stage 1, level 4).
      modHigh: sint(0), modLow: sint(0), modOrder: choice({ either: "Either way (the player chooses)", weapon: "Weapon Modifier first", power: "Power Modifier first" }, "either"),
      modStage2: choice({ "": "The higher one", weapon: "Weapon Modifier", power: "Power Modifier" }, ""),
      armorTraining: choice(TWOD12.armorTrainings, "light"),
      // v0.0.185 (pack C2): the class sheet's new fields, the Repertoire and Escalation lists, and the levels as sections (classlevels.mjs).
      category: new StringField({ required: true, blank: true, initial: "Class" }), flavor: str(),
      repertoire: new ArrayField(str()), escPassives: new ArrayField(str()), escActives: new ArrayField(str()),
      levels: new ArrayField(new SchemaField({ sections: new ArrayField(new SchemaField({
        id: str(), title: str(), kind: choice({ items: "Items I drop", attr: "Attribute increase", repertoire: "From the Repertoire", talent: "Talent" }, "items"),
        mode: choice({ granted: "Granted", choice: "Choice" }, "choice"), pick: int(1, 0), items: new ArrayField(str()),
        pairs: new ArrayField(new SchemaField({ a: str(), b: str() })),
        freq: choice({ any: "Any", passive: "Passive", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily" }, "any"), category: str()
      })) })),
      chosenAttrs: new ArrayField(str())   // on a character's copy: every Attribute increase chosen in the class window, level by level
    };
  }
  static migrateData(source) { migrateClassSteps(source); return super.migrateData(source); }   // v0.0.408: an old copy's Health steps to 0 (not written yet)
}

export class FeatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(), hover: str(), flavor: str(), actions: new ArrayField(str()),
      worth: str(),   // v0.0.239: the ruler's worth of the card (book/ruler/worth.json), a tiny line on the card for the playtests
      // A choice: when the item is granted, the player picks "choiceCount" of these (Actions, Features or Talents).
      choiceLabel: str(), choiceCount: int(1, 1), choiceOptions: new ArrayField(str()),
      category: str(), level: int(1, 0),
      // How many Talents this Feature gives: each one is a Talent slot on the character sheet.
      talents: int(0, 0),
      // v0.0.187: an Escalation Passive (the Features tab shows it in its Escalation section).
      escalationPassive: bool(),
      // v0.0.409 (pack F2, the Paladin's passives): small hooks the system reads while the passive works (its rung reached: escblock.mjs passiveThreshold):
      //   { kind: "reactionGuard", traits: ["divine"], formula: "1+pow" } (Armor of Faith); { kind: "apCost", markKind: "judge", ap: 1, cost: 0 } (Roving
      //   Judgment); { kind: "rapMore", n: 1 } (Tireless Vigil); { kind: "setupAdvance", traits: ["divine"], n: 3 } (Hallowed Stance); { kind: "markSpeed", by: 2 }
      hooks: new ArrayField(new ObjectField()),
      escalationRung: int(0, 0),   // v0.0.409 (pack F2): an Escalation ability's rung (2, 4 or 6; the card's Escalation), when no class section names it
      automation: choice(TWOD12.automationRanks, ""), automationNote: str(),   // v0.0.215: what is done by hand (the diamond tooltip)
        // v0.0.189: Not implemented / Bronze / Silver / Gold
      // Defense bonuses: +bonus to the DC of actions that roll "vs" this attribute (and carry all the listed tags, e.g. "pushed").
      // A passive: settings that work by themselves while the creature has it (always, or while its Escalation is at least passiveEscalation).
      settings: settingsField(), ...rulesFields(),   // v0.0.323 (PACK EFFECT-SHEET)
      defenses: new ArrayField(new SchemaField({ attr: choice(TWOD12.defenseKinds, "body"), bonus: sint(1), tags: str() }))   // attr: what it raises (every Defense, Armor, Ward or one Vs. Attribute)
    };
  }
  static migrateData(source) {
    migrateSettings(source); migrateRules(source, "feature");   // v0.0.323
    if (source && source.escalationPassive === undefined && /escalation/i.test(String(source.category ?? ""))) source.escalationPassive = true;   // v0.0.187
    return super.migrateData(source);
  }
}

const instance = () => new SchemaField({
  pool: choice(TWOD12.pools, "B"), useW: bool(), wCount: int(1, 1), dice: str(),
  useAt: bool(), subtype: choice(TWOD12.subtypes)
});
const tier = () => new ArrayField(instance());
const fxList = () => new ArrayField(new SchemaField({ uuid: str(), mode: choice({ auto: "Automatically applied", conditional: "Conditional", down: "After the damage, when the target is Down" }, "auto") }));   // v0.0.266: down (Deathmark)

export class ActionData extends foundry.abstract.TypeDataModel {
  /** v0.0.186: Mark Quarry marked by its category before; now by its "Marks the target" box. */
  static migrateData(source) {
    if (source && source.marksTarget === undefined && source.category === "Marked Quarry") source.marksTarget = true;
    migrateSettings(source); migrateRules(source, "action");   // v0.0.355 (PACK ACTION-SHEET): an Action holds rules, as a Feature does
    return super.migrateData(source);
  }
  /** An Action with an Area always has the Area trait (see the Area trait). */
  prepareDerivedData() {
    super.prepareDerivedData?.();
    // The Area settings write the Area text ("1 Emanation"); with size 0 the Action has no Area. v0.0.176 (book: an Area Action has an Area line
    // and can have a Distance line): how far the area can be placed is the Distance ("10 sq.", "Your weapon's normal range"), shown on its own line.
    const c = this.areaCfg;
    if (c) {
      // v0.0.214: a Line is written "Line 10" (the value after the word) and has no Distance: it always starts from you.
      // v0.0.215: versions with their own size write them all, by AP ("2 / 3 Emanation").
      const sizes = c.size > 0 ? [...new Set([...(this.versions ?? [])].sort((a, b) => a.ap - b.ap).map(v => v.areaSize || c.size))] : [];
      const sz = sizes.length > 1 ? sizes.join(" / ") : c.size;
      this.area = c.size > 0 ? (c.shape === "line" ? `Line ${sz}` : `${sz} ${c.shape === "burst" ? "Burst" : "Emanation"}`) : "";
      this.areaDistance = c.size > 0 && c.shape !== "line" ? (c.withinRange ? `Your weapon's ${c.withinRange} range` : (c.within > 0 ? `${c.within} sq.` : "")) : "";
    }
    if (String(this.area ?? "").trim() && this.traits instanceof Set && !this.traits.has("area")) this.traits.add("area");
    // v0.0.359: a Reaction's Within written as a formula is worked out for the creature that has the Action, when it is read (its Modifiers and Stage
    // are ready by then), so every reader of momentRange gets the number. On an Action with no creature: 0 (anywhere, or the Action's Distance).
    const expr = String(this.momentRangeExpr ?? "").trim();
    if (expr) {
      const stored = this.momentRange, self = this;
      try { Object.defineProperty(this, "momentRange", { configurable: true, enumerable: true, set() { /* the formula decides */ }, get() { const actor = self.parent?.parent; if (!actor?.system) return stored; const v = evalExpr(expr, actor); return Number.isFinite(v) ? Math.max(0, Math.trunc(v)) : stored; } }); } catch (e) { /* keep the number */ }
    }
  }

  static defineSchema() {
    return {
      description: new HTMLField(),
      category: str(),
      level: int(0, 0),
      worth: str(),   // v0.0.242: the ruler's worth of the card (book/ruler/worth.json): v0.0.239 put it on Features and Talents only, so an Action dropped it on load (Lucas: "still not showing")
      traits: traitsField(TWOD12.actionTraits),
      targets: str(),
      distance: str(),
      requirements: str(),
      trigger: str(),
      reaction: bool(),
      reactionKind: choice({ interrupt: "Interrupt", trigger: "Trigger" }, "trigger"),
      // v0.0.261 (Lucas, Divine Intervention): a Reaction with a moment is offered by itself when the moment comes (within this many squares; 0: anywhere)
      momentRangeExpr: str(),   // v0.0.359 (Lucas: "the Reaction's Within is still not a formula"): Within as a formula (pow+2, stage, speed/2); empty: the number
      moment: choice(TWOD12.moments, ""), momentRange: int(0, 0), momentThreat: bool(),   // v0.0.303: only a creature you threaten (Opportunity Attack)
     
      // v0.0.272 (pack RX): the Reaction's owner counts as the creature of the moment too ("you or an ally"); whom the Reaction is used on
      momentSelf: bool(), momentTarget: choice(TWOD12.momentTargets, "subject"),
      flavor: str(),
      area: str(),
      setup: str(),
      // The Area, as the Place Area button uses it: size, shape, how far it can be placed (0 = around you), who it targets, and its options.
      areaCfg: new SchemaField({
        size: int(0, 0),
        shape: choice({ emanation: "Emanation", burst: "Burst", line: "Line" }, "emanation"),
        within: int(0, 0),
        targets: choice({ all: "All", allies: "Allies", enemies: "Enemies" }, "all"),
        center: bool(),
        keep: bool(),
        rounds: int(0, 0),
        withinRange: choice({ "": "A number of squares", normal: "The weapon's normal range", far: "The weapon's far range", maximum: "The weapon's maximum range" }, ""),   // v0.0.159
        ht: str()   // Hazardous Terrain patterns of the area it leaves ("entering+turn"; empty: none)
      }),
      prerequisites: str(),
      modifiers: modifiersField(),
      vs: choice(TWOD12.vsChoices),
      frequency: choice(TWOD12.frequencies),
      escalation: int(0, 0),   // the Escalation it costs on top of its AP (an Escalation Action); 0: none
      // v0.0.411 (pack F2, the card's look): a Structure card (book/cards/stage0): its own labeled lines before the roll (Judged, Smite dice) and its
      // Special after it; the card draws them under their labels (an old card's prose stays the description)
      structure: bool(), lines: new ArrayField(new SchemaField({ label: str(), text: str() })), special: str(),
      marksTarget: bool(), markKind: str(),   // v0.0.409 (pack F2): "judge": the mark is Judged (Judge: it counts as Profane for its marker)
      basicAttack: bool(),   // v0.0.216 (Lucas): an NPC's Basic attack: used when an Action calls for a Weapon Attack (NPCs have none)
      basicRating: choice({ terrible: "Terrible", low: "Low", medium: "Medium", high: "High", extreme: "Extreme" }, "medium"),   // v0.0.291 (PACK NPC-SHEET): the Basic attack's rating (the Bestiary's suggested average; the dice stay the GM's)
      weaponUse: choice(TWOD12.weaponUses, ""),   // v0.0.207: which weapon a Weapon Action uses (Pummel: only the Fists; Leg Sweep: a kick)
      automation: choice(TWOD12.automationRanks, ""), automationNote: str(),   // v0.0.215: what is done by hand (the diamond tooltip)
        // v0.0.189   // v0.0.186: using it marks the targeted creature (Mark Quarry); settings "only against my marked target" read the mark
      // v0.0.355 (PACK ACTION-SHEET, the audit's D17): what its owner has by itself while it has the Action (the rules list of an Effect, a Feature or a Talent)
      settings: settingsField(), ...rulesFields(),
      versions: new ArrayField(
        new SchemaField({
          ap: int(1, 0),   // 0: a 0 AP Action (only on your turn), or a 0R Reaction
          // a Split Action's versions ("weapon" / "power"); v0.0.409 (pack F2): any other text is an Art's Mode (its name), with its own traits,
          // Distance, Target and roll (empty: the Action's); "" for the others
          mode: str(), modeTraits: new ArrayField(str()), modeDistance: str(), modeTargets: str(), modeVs: str(),
          special: str(),   // v0.0.411: a Structure block's Special line (Judge's 0 AP: when it can be used)
          diceRule: str(),   // v0.0.409: "smite" (Smite's dice by Escalation, d8s against a Profane creature) or "profane" (d6s become d8s against one)
          noTiers: bool(),
          orTiers: str(),
          tiersWritten: str(), effectFirst: bool(),   // v0.0.429 (CARD-ONE step 6): the Tiers the card writes; its Effect above the roll   // v0.0.426: "23" / "12" when the card writes "Tier 2 or 3" / "Tier 1 or 2" (one line on the card)
          areaSize: int(0, 0),   // v0.0.215: this version's Area size (0: the Action's); Word of Radiance is "2 / 3 Emanation"
          areaRounds: int(0, 0),   // v0.0.261 (Consecrated Ground): this version's rounds for the kept area (0: the Action's)
          t1: tier(),
          t2: tier(),
          t3: tier(),
          x1: str(),
          x2: str(),
          x3: str(),
          critical: str(),
          effects: str(),
          after: str(),   // v0.0.246 (cards 1): chips run one after the other once the damage is applied (Smite 3 AP: the Guard's "who", then the Pushes)
          fx: new SchemaField({ all: fxList(), t1: fxList(), t2: fxList(), t3: fxList() })
        })
      )
    };
  }
}

const tierDamage = () => new SchemaField({
  pool: choice(TWOD12.pools, "B"), count: int(0), die: choice(TWOD12.dice, ""), mod: sint()
});

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      traits: traitsField(TWOD12.weaponTraits),
      subtype: choice(TWOD12.subtypes, "Sl"),
      range: str(), reach: int(0),   // range: every weapon's Range ("1", "1/2", "10/20/40"); reach: the old extra Reach (a melee weapon without a Range uses 1 + it)
      thrownRange: str(),   // a Thrown weapon's Range when thrown ("4/8/12")
      weaponGroup: str(),   // v0.0.343: its Weapon Group (blades, axes...; empty: from its name, the book's table)
      masteryGroup: str(),   // v0.0.154: the kind of weapon its Mastery counts for (empty: its name), so a +1 Greatsword shares the Greatsword's
      hands: int(1, 1), unloaded: bool(),
      damage: new SchemaField({ t1: tierDamage(), t2: tierDamage(), t3: tierDamage() }),
      actions: new ArrayField(str()),
      wielded: bool(),
      hand: str(),   // v0.0.208: the hand that holds it, "main" or "off" (empty: by order; a two-handed grip uses both)
      dmgMods: str(""),   // v0.0.333 (PACK RWI): Immune / Resist / Weak it gives while wielded (a shield, a warded blade)
      dropped: bool()   // v0.0.139: on the ground (not in hand, not worn); Worn = not wielded and not dropped
    };
  }
}

/** Armor (Round 12): its category gives the Armor value (Light 1, Medium 2, Heavy 3), a rare armor adds a bonus, a Warded one adds Ward. Worn: the one in use. */
export class ArmorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      category: choice({ light: "Light", medium: "Medium", heavy: "Heavy" }, "light"),
      bonus: sint(0), ward: int(0, 0),
      properties: str(),   // free text for now (Resist, Bulky, Noisy...: not automated yet)
      worn: bool(),
      dmgMods: str(""),   // v0.0.333 (PACK RWI): Immune / Resist / Weak it gives while worn ("Resist 2 Fire, Immune Cold"; the actor field's format)
      dropped: bool()   // v0.0.139: on the ground; not worn and not dropped = Carried
    };
  }
}

/** Gear and loot (v0.0.133): anything carried that is not a weapon or armor. Weight and cost are per item; the Items tab adds them up. */
export class GearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const num = () => new NumberField({ required: true, nullable: false, initial: 0, min: 0 });
    return { description: new HTMLField(), quantity: int(1, 0), weight: num(), cost: num() };
  }
}

export class TalentData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(), hover: str(), flavor: str(), category: str(), level: int(1, 0), frequency: choice(TWOD12.frequencies),
      worth: str(),   // v0.0.239: the ruler's worth of the card (book/ruler/worth.json), a tiny line on the card and the chat card for the playtests
      traits: traitsField(TWOD12.actionTraits), requirements: str(), actions: new ArrayField(str()),
      // A choice: when the item is granted, the player picks "choiceCount" of these (Actions, Features or Talents).
      choiceLabel: str(), choiceCount: int(1, 1), choiceOptions: new ArrayField(str()),
      // Talents that modify other Actions: which Actions (a name, "category:Weapon Technique" or "trait:strike"), when, and what they add.
      modifiers: modifiersField(),
      // A passive, as on a Feature.
      settings: settingsField(), ...rulesFields(),   // v0.0.323 (PACK EFFECT-SHEET)
      // v0.0.186 (pack C-a; book 16-talents.md): the Category (Combat, Mobility, Magic, Skill), the Prerequisites as data the Talent picker checks
      // (each a Talent by name, a Level, an Action with a trait, an Attribute at a value, or Other: free text, not checked; all of them, or any one),
      // and a theme tag (Unarmed, Great Weapon, Marksman, Divine) the picker can filter by. "requirements" stays as the old free text.
      group: choice(TWOD12.talentGroups, "combat"),
      prereqs: new ArrayField(new SchemaField({ kind: choice(TWOD12.prereqKinds, "talent"), name: str(), value: int(0) })),
      prereqMode: choice({ all: "all of these", any: "any one of these" }, "all"),
      automation: choice(TWOD12.automationRanks, ""), automationNote: str(),   // v0.0.215: what is done by hand (the diamond tooltip)
        // v0.0.189
      theme: str()
    };
  }
  static migrateData(source) {
    migrateSettings(source); migrateRules(source, "talent");   // v0.0.323
    // v0.0.186: "Combat Talent" in the Category becomes the Category field.
    const m = /^\s*(combat|mobility|magic|skill)\s+talent\s*$/i.exec(String(source?.category ?? ""));
    if (m && source.group === undefined) { source.group = m[1].toLowerCase(); source.category = "Talent"; }
    return super.migrateData(source);
  }
}

/** v0.0.323 (PACK EFFECT-SHEET): the rules list (the Details tab's source), whether it is stored (rulesOn), the hover card built from it. */
const rulesFields = () => ({ rules: new ArrayField(new ObjectField()), rulesOn: bool(), autoHover: str() });
/** The settings of an Effect (and of a Feature's or Talent's passive, v0.0.125): what it does. */
const settingsField = () => new ArrayField(new SchemaField({
        type: choice(TWOD12.effectSettings, "note"),
        attrs: attrSet(), title: str(), text: str(),
        bright: int(0), dim: int(0), color: str(),
        // v0.0.247 (Lucas: Smite's light was far too bright): the light's intensity (Foundry's alpha, 0 to 1; 0.5 is Foundry's default) and animation
        lightAlpha: new NumberField({ required: true, nullable: false, initial: 0.5, min: 0, max: 1 }), lightAnim: str(), lightSpeed: int(5, 0), lightIntensity: int(5, 0),
        boons: int(0), banes: int(0), bbName: choice({ "": "", field: "Field", pressure: "Pressure", support: "Support" }, ""), empowered: int(0), enfeebled: int(0), byValue: bool(), predicate: str(), all: predSet(), any: predSet(), none: predSet(), from: traitSet(),
        // Bonus Damage: an instance added to the damage of the next matching action, on the listed tiers (none = all).
        dmg: str(), dmgPool: choice(TWOD12.pools, "B"), dmgSub: choice({ ...TWOD12.subtypes, W: "The weapon's" }), tiers: new SetField(new StringField({ choices: ["t1", "t2", "t3"] })), fxUuid: str(),
        // Boons and banes that apply to rolls made AGAINST the creature with the effect (Prone).
        against: bool(),
        // Speed: "override" replaces it with the formula, "add" adds the formula to it.
        speedMode: choice({ override: "Override", add: "Add" }, "add"), speedFormula: str(),
        // Grant: lets the creature use an Action (a name, "category:Weapon Technique" or "trait:strike") a number of times, for this AP cost.
        grantAction: str(), grantCount: int(1, 1), grantAp: int(0, 0), grantDistinct: bool(), halfT3: bool(),   // v0.0.261 (Covering Shot): on a Tier 3, the target's next damage is halved (the Half button lit); v0.0.263: halfOn says on which result (halfT3 is read as "t3")
        // v0.0.264 (Lucas): "On [grantOn], [grantDo]": the target's next damage halved (Covering Shot), or a line (grantText) on the granted use's card for those results. halfOn: v0.0.263's field, read as grantOn.
        grantOn: choice(TWOD12.grantOnChoices, ""), grantDo: choice(TWOD12.grantDoChoices, "half"), grantText: str(), halfOn: choice(TWOD12.grantOnChoices, ""),
        grantOn2: choice(TWOD12.grantOnChoices, ""), grantDo2: choice(TWOD12.grantDoChoices, "text"), grantText2: str(),   // v0.0.266 (Lucas, Overwatch): a second "and on [a result], ..." line
        coverLevels: new SetField(new StringField({ choices: ["low", "medium", "high"] })),   // v0.0.266 (Lucas, Aim): the cover levels the creature's matching Actions ignore
        // v0.0.261 (Consecrated Ground): Zone: the placed area holds it; who is inside gains the Effect (fxUuid) while inside, or heals this at the start of each of their turns
        zoneWho: choice({ allies: "Allies", enemies: "Enemies", all: "Everyone" }, "allies"), zoneHeal: str(),
        inlineAction: str(),   // v0.0.249 (Lucas, inline Actions): the Action (a uuid or a name) the creature has while the effect lasts (Beacon's Step)
        // Defense: +N (or -N) to every Defense, Armor, Ward or one Vs. Attribute. Bonuses don't add up: the highest bonus and the highest penalty count.
        defKind: choice(TWOD12.defenseKinds, "all"), defValue: sint(1),
        // A passive's own Escalation minimum (0: always); an Effect ignores it.
        minEscalation: int(0, 0),
        // Aura: an area around the creature that follows it; whoever is inside gains the Effect (fxUuid).
        auraSize: int(1, 1), auraWho: choice({ allies: "Allies", enemies: "Enemies", all: "Everyone" }, "allies"), auraSelf: bool(),
        auraOutline: str(), auraFill: str(),   // colors on the map ("#rrggbb"; empty: the default of who it affects)
        // On damage: when the creature deals damage of this subtype to a creature with this Tag, that creature gains the Effect (fxUuid).
        trigSub: choice(TWOD12.subtypes), trigTag: str(),
        // v0.0.186 (pack C-a), general automation that replaces the code that tested a card's name:
        //   oncePerRound: Boons and Banes or Bonus Damage only on the first matching Action of each turn-cycle (Killer's Focus, Radiant Zeal, Elusive);
        //   vsMarked: only against the creature this one marked (Marked Quarry, Hunter's Focus);
        //   ignore: a Bane rule this creature ignores on matching Actions (Long Draw, Steady Nerves, Sharpshooter);
        //   rally: each Rally Point used by this creature (and its allies within rallyRange squares) heals rallyBonus more (Font of Mercy).
        oncePerRound: bool(), vsMarked: bool(),
        ignoreRule: choice(TWOD12.ignoreRules, "rangeBane"),
        rallyBonus: str(), rallyRange: int(0, 0),
        // v0.0.207 (editability sweep), more general automation:
        //   message: a chat message (text; {name} the creature, {mark} its marked creature) at a moment (msgWhen), to msgTo, with a button that
        //     uses the Action msgAction for msgAp AP (a free use: no Frequency); Marked Quarry's reminders;
        //   weaponprop: this creature's Fists (or weapons) don't have the property wpProp (Brawler: Non-threatening);
        //   mastery: choose one weapon with the trait mstTrait, it starts at mstValue Mastery (Sharpshooter, Bow Mastery).
        msgWhen: choice(TWOD12.messageWhen, "encounter"), msgTo: choice(TWOD12.messageTo, "owners"), msgAction: str(), msgAp: int(0, 0),
        wpWhich: choice(TWOD12.propWeapons, "fists"), wpProp: choice(TWOD12.removableProps, "nonthreatening"),
        mstTrait: choice(TWOD12.weaponTraits, "projectile"), mstValue: int(3, 0),
        // v0.0.243 (pack R): eschook: the class's Escalation hook: once an encounter, when hookWhen happens (an ally within hookRange squares becomes
        //   Bloodied or goes Down; the creature it marked goes Down), the creature's Escalation rises by 1 (Kindled Wrath, Thrill of the Kill).
        hookWhen: choice(TWOD12.escHookWhen, "allyState"), hookRange: int(5, 0),
        // v0.0.314 (pack AU): Boons and Banes only against creatures other than the effect's origin (Taunted), or only against it;
        //   bleed: damage at the end of each of the creature's turns (dmg, dmgPool, dmgSub; attrs: the Save's Attributes; bleedDc: its DC).
        vsOrigin: choice(TWOD12.vsOriginChoices, ""), bleedDc: int(13, 0),
        // v0.0.346 (v0.0.345's field was missing here, so Foundry dropped it): a Movement limit refuses ("cant") or is Difficult Terrain ("difficult", Frightened);
        // dmgSub "W" (above): Bonus Damage of the weapon's subtype (Marked Quarry)
        moveHow: choice({ cant: "Not allowed", difficult: "Difficult Terrain" }, "cant"),
        // v0.0.320 (pack AU part 2): resist: Resist N / Weak N / Immune of a subtype (dmgSub) while it is on the creature (the highest of each counts);
        //   freqmore: more uses of a Frequency (the Elite ladder: Round Specials twice a round, Encounter Specials a second time).
        rwKind: choice(TWOD12.rwKinds, "resist"), rwValue: int(1, 0), fmWhich: choice(TWOD12.freqMore, "round"),
        // v0.0.323 (PACK EFFECT-SHEET; fxrules.mjs compile): the rule it came from, "Next one only" (spend), its own "While they see the origin" (seen),
        //   Empowered "Increase by" (empMode), a Defense or Speed bonus's kind and name (defMode, defName), an Aura's formula size and "Shown on the map",
        //   On damage's pool (trigPool), "All range Banes" (rangeAll)
        ruleId: str(), spend: bool(), seen: bool(), empMode: choice({ set: "Set to", inc: "Increase by" }, "set"), defMode: choice({ bonus: "A bonus", inc: "An increase", set: "Set to" }, "bonus"),
        defName: str(), sizeFormula: str(), trigPool: str(), auraShow: bool(true), rangeAll: bool(),
        areaRows: new ObjectField(),   // v0.0.327 (PACK ZONE): an Aura's rows (Carries, Heals, Hazard, Difficult Terrain), each with its Who
        valFormula: str()   // v0.0.324: a Defense's or a Resist / Weak's amount as a formula (@origin.pow...), read when it counts
      }));

export class EffectData extends foundry.abstract.TypeDataModel {
  static migrateData(source) { migrateSettings(source); migrateRules(source, "effect"); migrateZone(source); return super.migrateData(source); }
  static defineSchema() {
    return {
      description: new HTMLField(),
      hover: str(),   // short text shown on the chip of this effect in a roll (empty: the start of the description)
      isCondition: bool(),
      valued: bool(),   // a condition with a value (Empowered 2): the value is kept on the effect on the creature
      selfApplied: bool(),
      automation: choice(TWOD12.automationRanks, ""), automationNote: str(),   // v0.0.215: what is done by hand (the diamond tooltip)
        // v0.0.189
      minEscalation: int(0, 0),   // a passive that works only while its owner's Escalation is at least this (0: always)
      // v0.0.314 (pack AU, the conditions as items): general rules a condition can have.
      //   whileSeen: it works only while the creature sees its origin (Frightened); noReactions: the creature can't use Reactions (Staggered);
      //   loseAp: when applied, the creature loses its value in AP (the rest from its next regain), then it ends (Dazed);
      //   endsWithOrigin: it ends when its origin goes Down or Unconscious (Grabbed).
      whileSeen: bool(), noReactions: bool(), loseAp: bool(), endsWithOrigin: bool(),
      // v0.0.316 (Lucas): its origin is the creature that used the Action (a card's chip); off, or with no Action behind it, it asks (a token on the map)
      originFromUser: bool(),
      linked: str(),   // other conditions this one brings with it, by name ("Hindered"); they end when this one does
      conditions: new ArrayField(new SchemaField({ uuid: str(), name: str(), value: int(1, 0), valued: bool(), mode: choice({ set: "The highest counts", increase: "Increase the value", halfLevel: "Half the creature's level, rounded up (Squeezing)" }, "set") })),   // conditions this effect applies, each with its value; they end when this one does
      duration: new SchemaField({ type: choice(TWOD12.durationTypes, ""), rounds: int(1, 1) }),
      settings: settingsField(),
      // v0.0.323 (PACK EFFECT-SHEET): the Details tab's rules and Ends (fxrules.mjs), the source of the settings and fields above once stored (rulesOn);
      //   autoHover: the hover card built from them ({origin} filled in when applied); saveEnd: Ends' "A Save"
      ...rulesFields(), ends: new ObjectField(), saveEnd: new ObjectField(),
      // v0.0.327 (PACK ZONE): "Where it is": on a creature (its rules) or on the map (a Zone: its area, what it does inside, its colors; fxrules.mjs normZone)
      where: choice({ creature: "On a creature", map: "On the map (a Zone)" }, "creature"), zone: new ObjectField(),
      // The effect ends after an action with any of these traits is used.
      expireOn: new SetField(new StringField({ required: true, blank: false })),   // traits, or "__name:smite" (an Action by name)
      // When on, the effect ends only after an action that has ALL the listed traits (otherwise any one of them).
      expireAll: bool()
    };
  }
}
