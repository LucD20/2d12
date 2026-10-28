import { TWOD12, migrateTags, npcHm } from "./config.mjs";
import { migrateSettings } from "./settingsmigrate.mjs";
import { classModifiers, modOf } from "./modifiers.mjs";

import { applySpeedMods } from "./speedmods.mjs";
const { SchemaField, NumberField, StringField, BooleanField, ArrayField, SetField, HTMLField } = foundry.data.fields;
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
      escalation: int(0, 0),   // 0 to 3: gained each round after the first, spent on Escalation Actions, back to 0 after the encounter (escalation.mjs)
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
    if (cls) for (const k of [cls.system.chosenA, cls.system.chosenB]) if (k in a) a[k] += 1;
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
    const thr = (at, mult, sp) => Math.max(0, Math.ceil(((at + 2) * mult + sp) * (lv + 10) / 10));
    this.bdt = thr(a.body, cls?.system.bodyMult ?? 0, species?.system.bodyMod ?? 0);
    const mdtFull = thr(a.mind, cls?.system.mindMult ?? 0, species?.system.mindMod ?? 0);
    this.mdt = Math.max(0, mdtFull - 4 * (this.exhausted ?? 0));   // Exhausted: - 4 x value
    deriveHealth(this);

    this.rallyHeal = Math.ceil((this.bdt + mdtFull) / 4);   // Rally Points use the Health Pool before Exhausted lowers the Mind Damage Threshold
    // v0.0.176 (book, Rally Points): the class's Rally value + ceil((Body + Mind + level) / 2), Body and Mind being the Attributes.
    this.rallyMax = Math.max(0, (cls?.system.rallyMod ?? 0) + Math.ceil(((a.body ?? 0) + (a.mind ?? 0) + (Number(lv) || 0)) / 2));
    this.rallyLeft = Math.max(0, this.rallyMax - this.rallyUsed);

    // Weapon and Power Modifiers: the higher of the class's two Attributes each, never the same one (modifiers.mjs).
    // A class from before v0.0.117 that has no lists keeps the Attribute that was picked for it.
    const cs = cls?.system;
    const wKeys = cs ? ([...(cs.weaponAttrs ?? [])].length ? [...cs.weaponAttrs] : [cs.chosenWeapon].filter(Boolean)) : [];
    const pKeys = cs ? ([...(cs.magicAttrs ?? [])].length ? [...cs.magicAttrs] : [cs.chosenMagic].filter(Boolean)) : [];
    const cm = classModifiers(a, wKeys, pKeys, cs?.modPriority === "power" ? "power" : "weapon");
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
 * (custom.<attribute>, custom.bodyHealth / mindHealth, armorDef / wardDef). Level 1 tables only.
 * Returns { role, rating(key), attributes, bodyHm, mindHm, bdt, mdt, armorDef, wardDef } (hm null when custom).
 */
export function npcBuild(sys) {
  const role = TWOD12.npcRoles[sys.role] ?? TWOD12.npcRoles.standard, R = TWOD12.npcRatings;
  const rating = k => { let r = sys.ratings?.[k] || "medium"; if (r !== "custom" && !R[r]) r = "medium"; if (r === "extreme" && !role.extreme) r = "high"; return r; };
  const attributes = {};
  for (const k of Object.keys(TWOD12.attributes)) attributes[k] = rating(k) === "custom" ? (Number(sys.custom?.[k]) || 0) : role.attr + R[rating(k)].off;
  const hmOf = r => npcHm(sys.role, r, sys.level);   // v0.0.176: the level's row (levels 1 to 3)
  const health = (key, attr) => { const r = rating(`${key}Hm`); if (r === "custom") return { hm: null, v: Number(sys.custom?.[`${key}Health`]) || 0 };
    const hm = hmOf(r); return { hm, v: Math.max(0, Math.ceil((attr + 2) * hm + role.hb - 1e-9)) }; };
  const b = health("body", attributes.body), m = health("mind", attributes.mind);
  // A Custom number is used as typed, even outside the tables (the Builder tab warns); the tables' Defenses are never below 11.
  const def = (k, typed) => (rating(k) === "custom" ? (Number(typed) || 0) : Math.max(TWOD12.defenseBase, role.defense + R[rating(k)].off));
  const sr = String(sys.ratings?.speed ?? "5"), speed = sr === "custom" ? Math.max(0, Number(sys.speed) || 0) : (Number(sr) || 5);
  return { role, rating, attributes, bodyHm: b.hm, mindHm: m.hm, bdt: b.v, mdt: m.v, armorDef: def("ad", sys.armorDef), wardDef: def("wd", sys.wardDef), speed, speedCustom: sr === "custom" };
}

export class NpcData extends CharacterData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      attributes: new SchemaField({ body: sint(), mind: sint(), appeal: sint(), instinct: sint() }),
      speed: int(5), weaponAttribute: choice(TWOD12.attributes, "body"), powerAttribute: choice(TWOD12.attributes, "mind"),
      // The Bestiary (v0.0.163): its role and a rating for each number ("custom": the typed number below is used).
      role: choice(Object.fromEntries(Object.entries(TWOD12.npcRoles).map(([k, v]) => [k, v.label])), "standard"),
      ratings: new SchemaField(Object.fromEntries([["body", "high"], ["mind", "medium"], ["appeal", "low"], ["instinct", "medium"], ["bodyHm", "medium"], ["mindHm", "medium"], ["ad", "medium"], ["wd", "medium"]]
        .map(([k, d]) => [k, choice({ terrible: "Terrible", low: "Low", medium: "Medium", high: "High", extreme: "Extreme", custom: "Custom" }, d)])
        .concat([["speed", choice({ 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", custom: "Custom" }, "5")]]))),   // speed: Custom uses system.speed
      custom: new SchemaField({ body: sint(), mind: sint(), appeal: sint(), instinct: sint(), bodyHealth: sint(10), mindHealth: sint(10) }),
      armor: choice(Object.fromEntries(Object.entries(TWOD12.armors).map(([k, v]) => [k, v.label])), "medium"),   // its Armor type (for rules and Talents that ask); medium: a typical enemy
      armorDef: sint(13), wardDef: sint(13),   // its typed Armor Defense and Ward Defense, used when that rating is Custom (any number)
      useEscalation: bool(false),   // an NPC can have Escalation too (an elite foe): off by default
      reachBase: int(1, 1),   // the creature's Reach (most are 1; a big creature or a long-limbed one more)
      steadiness: int(0, 0)   // v0.0.169: resistance to being moved: 0 unless its description says otherwise (Builder tab: 0 to 4)
    };
  }

  prepareDerivedData() {
    // The Bestiary: Attributes, Health and Defenses come from the role and the ratings (npcBuild). AP a turn: 3 for a Minion, 5 for the others.
    const nb = npcBuild(this);
    Object.assign(this.attributes, nb.attributes);
    this.bdt = Math.max(0, nb.bdt); this.mdt = Math.max(0, nb.mdt); this.armorDef = nb.armorDef; this.wardDef = nb.wardDef; this.speed = nb.speed;
    this.bodyHm = nb.bodyHm; this.mindHm = nb.mindHm; this.roleLabel = nb.role.label; this.cv = nb.role.cv; this.apPerTurn = nb.role.ap;
    deriveHealth(this);
    this.wounds = 0;
    this.reach = Math.max(1, Number(this.reachBase) || 1);   // the stat block's Reach (edited in the sidebar)
    this.steadiness = Math.max(0, Number(this.steadiness) || 0);
    this.moveSpeed = applySpeedMods(this.parent, this.speed);
    // NPCs do not use the Dying and Shattered tables: at 0 HP they die with more lethal damage, or fall unconscious with more nonlethal.
    if (this.atZero) this.zeroState = this.lethal > this.nonlethal ? "Dead (more Lethal damage)" : (this.nonlethal > this.lethal ? "Unconscious (more Nonlethal damage)" : "Dead or Unconscious (the GM chooses)");
    this.rallyHeal = 0; this.rallyMax = 0; this.rallyLeft = 0;
    // Weapon and Power Attributes (the Bestiary): each Modifier is half the Attribute, rounded up, + 1; Signature uses the higher (Weapon on a tie).
    this.weaponAttrValue = this.attributes[this.weaponAttribute] ?? 0;
    this.weaponMod = Math.ceil(this.weaponAttrValue / 2 + 1);
    this.powerAttrValue = this.attributes[this.powerAttribute] ?? 0;
    this.powerMod = Math.ceil(this.powerAttrValue / 2 + 1);
    const sigP = this.powerMod > this.weaponMod;
    this.signatureAttribute = sigP ? this.powerAttribute : this.weaponAttribute; this.signatureAttrValue = sigP ? this.powerAttrValue : this.weaponAttrValue;
    this.signatureMod = sigP ? this.powerMod : this.weaponMod; this.signatureFrom = sigP ? "power" : "weapon";
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
      bodyMod: sint(), mindMod: sint(), speed: int(5), reach: int(1, 0), size: int(3, 1),
      steadiness: int(0, 0),   // v0.0.169: resistance to being moved (Dwarf 1, the others 0)
      chosen: attrSet()
    };
  }
}

export class ClassData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      choiceA: attrSet(), choiceB: attrSet(),
      bodyMult: new NumberField({ required: true, nullable: false, initial: 0, min: 0, step: 0.5 }), mindMult: new NumberField({ required: true, nullable: false, initial: 0, min: 0, step: 0.5 }), rallyMod: sint(), speedMod: sint(),
      weaponAttrs: attrSet(), magicAttrs: attrSet(),
      features: new ArrayField(new SchemaField({ uuid: str(), level: int(1, 0) })),
      chosenA: str(), chosenB: str(), chosenWeapon: str(), chosenMagic: str(),   // chosenWeapon / chosenMagic: only for classes from before v0.0.117
      modPriority: choice({ weapon: "Weapon Modifier", power: "Power Modifier" }, "weapon"),   // which Modifier keeps an Attribute both would use
      armorTraining: choice(TWOD12.armorTrainings, "light")
    };
  }
}

export class FeatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(), hover: str(), flavor: str(), actions: new ArrayField(str()),
      // A choice: when the item is granted, the player picks "choiceCount" of these (Actions, Features or Talents).
      choiceLabel: str(), choiceCount: int(1, 1), choiceOptions: new ArrayField(str()),
      category: str(), level: int(1, 0),
      // How many Talents this Feature gives: each one is a Talent slot on the character sheet.
      talents: int(0, 0),
      // Defense bonuses: +bonus to the DC of actions that roll "vs" this attribute (and carry all the listed tags, e.g. "pushed").
      // A passive: settings that work by themselves while the creature has it (always, or while its Escalation is at least passiveEscalation).
      settings: settingsField(),
      defenses: new ArrayField(new SchemaField({ attr: choice(TWOD12.defenseKinds, "body"), bonus: sint(1), tags: str() }))   // attr: what it raises (every Defense, Armor, Ward or one Vs. Attribute)
    };
  }
  static migrateData(source) { migrateSettings(source); return super.migrateData(source); }
}

const instance = () => new SchemaField({
  pool: choice(TWOD12.pools, "B"), useW: bool(), wCount: int(1, 1), dice: str(),
  useAt: bool(), subtype: choice(TWOD12.subtypes)
});
const tier = () => new ArrayField(instance());
const fxList = () => new ArrayField(new SchemaField({ uuid: str(), mode: choice({ auto: "Automatically applied", conditional: "Conditional" }, "auto") }));

export class ActionData extends foundry.abstract.TypeDataModel {
  /** An Action with an Area always has the Area trait (see the Area trait). */
  prepareDerivedData() {
    super.prepareDerivedData?.();
    // The Area settings write the Area text ("1 Emanation"); with size 0 the Action has no Area. v0.0.176 (book: an Area Action has an Area line
    // and can have a Distance line): how far the area can be placed is the Distance ("10 sq.", "Your weapon's normal range"), shown on its own line.
    const c = this.areaCfg;
    if (c) {
      this.area = c.size > 0 ? `${c.size} ${c.shape === "burst" ? "Burst" : "Emanation"}` : "";
      this.areaDistance = c.size > 0 ? (c.withinRange ? `Your weapon's ${c.withinRange} range` : (c.within > 0 ? `${c.within} sq.` : "")) : "";
    }
    if (String(this.area ?? "").trim() && this.traits instanceof Set && !this.traits.has("area")) this.traits.add("area");
  }

  static defineSchema() {
    return {
      description: new HTMLField(),
      category: str(),
      level: int(0, 0),
      traits: traitsField(TWOD12.actionTraits),
      targets: str(),
      distance: str(),
      requirements: str(),
      trigger: str(),
      reaction: bool(),
      reactionKind: choice({ interrupt: "Interrupt", trigger: "Trigger" }, "trigger"),
      flavor: str(),
      area: str(),
      setup: str(),
      // The Area, as the Place Area button uses it: size, shape, how far it can be placed (0 = around you), who it targets, and its options.
      areaCfg: new SchemaField({
        size: int(0, 0),
        shape: choice({ emanation: "Emanation", burst: "Burst" }, "emanation"),
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
      versions: new ArrayField(
        new SchemaField({
          ap: int(1, 0),   // 0: a 0 AP Action (only on your turn), or a 0R Reaction
          mode: choice({ weapon: "Weapon mode", power: "Power mode" }),   // a Split Action's versions: "" for the others
          noTiers: bool(),
          t1: tier(),
          t2: tier(),
          t3: tier(),
          x1: str(),
          x2: str(),
          x3: str(),
          critical: str(),
          effects: str(),
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
      masteryGroup: str(),   // v0.0.154: the kind of weapon its Mastery counts for (empty: its name), so a +1 Greatsword shares the Greatsword's
      hands: int(1, 1), unloaded: bool(),
      damage: new SchemaField({ t1: tierDamage(), t2: tierDamage(), t3: tierDamage() }),
      actions: new ArrayField(str()),
      wielded: bool(),
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
      traits: traitsField(TWOD12.actionTraits), requirements: str(), actions: new ArrayField(str()),
      // A choice: when the item is granted, the player picks "choiceCount" of these (Actions, Features or Talents).
      choiceLabel: str(), choiceCount: int(1, 1), choiceOptions: new ArrayField(str()),
      // Talents that modify other Actions: which Actions (a name, "category:Weapon Technique" or "trait:strike"), when, and what they add.
      modifiers: modifiersField(),
      // A passive, as on a Feature.
      settings: settingsField()
    };
  }
  static migrateData(source) { migrateSettings(source); return super.migrateData(source); }
}

/** The settings of an Effect (and of a Feature's or Talent's passive, v0.0.125): what it does. */
const settingsField = () => new ArrayField(new SchemaField({
        type: choice(TWOD12.effectSettings, "note"),
        attrs: attrSet(), title: str(), text: str(),
        bright: int(0), dim: int(0), color: str(),
        boons: int(0), banes: int(0), empowered: int(0), enfeebled: int(0), byValue: bool(), predicate: str(), all: predSet(), any: predSet(), none: predSet(), from: traitSet(),
        // Bonus Damage: an instance added to the damage of the next matching action, on the listed tiers (none = all).
        dmg: str(), dmgPool: choice(TWOD12.pools, "B"), dmgSub: choice(TWOD12.subtypes), tiers: new SetField(new StringField({ choices: ["t1", "t2", "t3"] })), fxUuid: str(),
        // Boons and banes that apply to rolls made AGAINST the creature with the effect (Prone).
        against: bool(),
        // Speed: "override" replaces it with the formula, "add" adds the formula to it.
        speedMode: choice({ override: "Override", add: "Add" }, "add"), speedFormula: str(),
        // Grant: lets the creature use an Action (a name, "category:Weapon Technique" or "trait:strike") a number of times, for this AP cost.
        grantAction: str(), grantCount: int(1, 1), grantAp: int(0, 0), grantDistinct: bool(),
        // Defense: +N (or -N) to every Defense, Armor, Ward or one Vs. Attribute. Bonuses don't add up: the highest bonus and the highest penalty count.
        defKind: choice(TWOD12.defenseKinds, "all"), defValue: sint(1),
        // A passive's own Escalation minimum (0: always); an Effect ignores it.
        minEscalation: int(0, 0),
        // Aura: an area around the creature that follows it; whoever is inside gains the Effect (fxUuid).
        auraSize: int(1, 1), auraWho: choice({ allies: "Allies", enemies: "Enemies", all: "Everyone" }, "allies"), auraSelf: bool(),
        auraOutline: str(), auraFill: str(),   // colors on the map ("#rrggbb"; empty: the default of who it affects)
        // On damage: when the creature deals damage of this subtype to a creature with this Tag, that creature gains the Effect (fxUuid).
        trigSub: choice(TWOD12.subtypes), trigTag: str()
      }));

export class EffectData extends foundry.abstract.TypeDataModel {
  static migrateData(source) { migrateSettings(source); return super.migrateData(source); }
  static defineSchema() {
    return {
      description: new HTMLField(),
      hover: str(),   // short text shown on the chip of this effect in a roll (empty: the start of the description)
      isCondition: bool(),
      valued: bool(),   // a condition with a value (Empowered 2): the value is kept on the effect on the creature
      selfApplied: bool(),
      minEscalation: int(0, 0),   // a passive that works only while its owner's Escalation is at least this (0: always)
      linked: str(),   // other conditions this one brings with it, by name ("Hindered"); they end when this one does
      conditions: new ArrayField(new SchemaField({ uuid: str(), name: str(), value: int(1, 0), valued: bool(), mode: choice({ set: "The highest counts", increase: "Increase the value", halfLevel: "Half the creature's level, rounded up (Squeezing)" }, "set") })),   // conditions this effect applies, each with its value; they end when this one does
      duration: new SchemaField({ type: choice(TWOD12.durationTypes, ""), rounds: int(1, 1) }),
      settings: settingsField(),
      // The effect ends after an action with any of these traits is used.
      expireOn: new SetField(new StringField({ required: true, blank: false })),   // traits, or "__name:smite" (an Action by name)
      // When on, the effect ends only after an action that has ALL the listed traits (otherwise any one of them).
      expireAll: bool()
    };
  }
}
