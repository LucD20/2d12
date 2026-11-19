import { weaponRanges } from "./weaponrange.mjs";
import { vsColored } from "./util.mjs";   // v0.0.295: the Vs. value in its color
const sortObj = o => Object.fromEntries(Object.entries(o).sort((a, b) => a[1].localeCompare(b[1])));
const actionTraits = sortObj({
  area: "Area",
  appeal: "Appeal",
  body: "Body",
  divine: "Divine",
  fear: "Fear",
  focus: "Focus",
  gun: "Firearm",   // v0.0.411 (pack F3; the book, 2026-11-16): the trait is called Firearm (the key stays gun)   // v0.0.208 (D2): needs a Firearm, as Shot needs a Projectile weapon
  handle: "Handle",
  instinct: "Instinct",
  magic: "Power",   // the key stays "magic" (saved worlds and content use it); the trait is called Power since v0.0.117
  melee: "Melee",
  mind: "Mind",
  move: "Move",
  nonlethal: "Nonlethal",
  ranged: "Ranged",
  save: "Save",
  self: "Self",
  shot: "Projectile",   // v0.0.411 (pack F3; the book, 2026-11-16): the trait is called Projectile (the key stays shot)
  signature: "Signature",
  split: "Split",
  strike: "Strike",
  unfailing: "Unfailing",   // v0.0.453 (playtest 6; the book, Chapter 7): a Tier 1 doesn't spend its Frequency
  weapon: "Weapon"
});
const weaponTraits = sortObj({ barehanded: "Barehanded", firearm: "Firearm", light: "Light", long: "Long", melee: "Melee", strung: "Strung", nonthreatening: "Non-threatening", projectile: "Projectile", ranged: "Ranged", reload: "Reload", thrown: "Thrown", twohanded: "Two-handed" });

export const TWOD12 = {
  attributes: { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" },
  actionTraits,
  weaponTraits,
  // v0.0.343 (book, Chapter 15, Weapon Groups): the eight groups, and each weapon of the book's tables in its group (Mastery: 1 per group an encounter)
  // v0.0.412 (pack F3 part 2; book, Weapon Groups, 2026-11-16): Swords and Daggers in the place of Blades (an old "blades" weapon reads Swords)
  weaponGroups: { swords: "Swords", daggers: "Daggers", blades: "Swords", axes: "Axes", hammers: "Hammers", polearms: "Polearms", bows: "Bows", crossbows: "Crossbows", firearms: "Firearms", unarmed: "Unarmed" },
  weaponGroupOf: { "arming sword": "swords", dagger: "daggers", longsword: "swords", greatsword: "swords", "hunting bow": "bows", "recurve bow": "bows", handaxe: "axes", greataxe: "axes", mace: "hammers", maul: "hammers", spear: "polearms", pike: "polearms", "knuckle dagger": "unarmed", fists: "unarmed", fist: "unarmed", unarmed: "unarmed", shortbow: "bows", longbow: "bows", "hand crossbow": "crossbows", crossbow: "crossbows", pistol: "firearms", musket: "firearms" },
  traits: { ...actionTraits, ...weaponTraits },
  dice: { "": "None", d4: "d4", d6: "d6", d8: "d8", d10: "d10", d12: "d12", d20: "d20" },
  // Damage subtypes use two letters, so they never look like the pools [B] [M] [C].
  /** The one-letter shorthand of the Action Generator ("1d6MH" = 1d6, Mind, Holy): B Blunt, C Cold, H Holy, M Psychic, P Pierce, S Slash. */
  subtypeLetters: { B: "Bl", C: "Co", H: "Ho", M: "Ps", P: "Pi", S: "Sl" },
  subtypes: {
    "": "None",
    ...sortObj({
      Ac: "Acid",
      Bl: "Blunt",
      Co: "Cold",
      El: "Electricity",
      Fi: "Fire",
      Fo: "Force",
      Ho: "Holy",
      Pi: "Pierce",
      Ps: "Psychic",
      Sl: "Slash",
      Th: "Thunder",
      Un: "Unholy"
    })
  },
  // v0.0.369 (STYLE-1, Lucas, 2026-11-13): Slash steel, Blunt bronze, Pierce grey-green, in the place of one grey
  // v0.0.457 (B3/E6, Lucas 2026-11-19: "each damage type one color everywhere"): one hue a type, this its dark-surface variant and
  // subtypeInk its light one; the book's DTYPE (book/build_rules.py) is the same pair (t286)
  subtypeColors: {
    Ac: "#8bc34a",
    Bl: "#b9a58c",
    Co: "#4fc3e8",
    El: "#e3cf3b",
    Fi: "#ef6a3a",
    Fo: "#a77ce8",
    Ho: "#e0a83a",
    Pi: "#a9b8a4",
    Ps: "#e07a9e",
    Sl: "#c3c9d1",
    Th: "#6f95c8",
    Un: "#c06ac0"
  },
  frequencies: { "": "Default", none: "None", atwill: "At-will", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily" },
  // The kind of a roll, for effects (Round 10): checks and saves are marked when they are rolled, and an Action that rolls an Attribute
  // directly (not a Weapon, Power or Signature roll) is an Attribute Action. Weapon, Power and Signature rolls are their traits.
  rollKinds: { __check: "Check", __save: "Save", __attr: "Attribute Action", __twohanded: "Two-handed weapon", __attack: "Attack" },   // v0.0.320: Attack = an Action that rolls against another creature (the Elite ladder's first attack)   // v0.0.188: Two-handed weapon (Heavy Blows)
  pools: { "": "None", B: "Vigor [V]", M: "Resolve [R]", C: "Choice [C]" },   // v0.0.234 (pack R-core): the labels; the keys stay B / M
  // Damage types: one icon each (Slash also has Foundry's sword image on cards), bright colors for dark backgrounds,
  // and dark "ink" colors for the parchment cards.
  subtypeIcons: {
    Ac: "fa-solid fa-droplet",
    Bl: "fa-solid fa-hammer",
    Co: "fa-solid fa-snowflake",
    El: "fa-solid fa-bolt",
    Fi: "fa-solid fa-fire",
    Fo: "fa-solid fa-atom",
    Ho: "fa-solid fa-sun",
    Pi: "fa-solid fa-arrow-right",
    Ps: "fa-solid fa-hurricane",
    Sl: "fa-solid fa-slash",
    Th: "fa-solid fa-volume-high",
    Un: "fa-solid fa-skull"
  },
  subtypeInk: {
    Ac: "#3f7a12",
    Bl: "#5a4a36",
    Co: "#136f8f",
    El: "#7d6a00",
    Fi: "#a63a17",
    Fo: "#6a35b8",
    Ho: "#8a5a08",
    Pi: "#44513f",
    Ps: "#a3335c",
    Sl: "#4a5058",
    Th: "#1f4f8a",
    Un: "#6e2a6e"
  },
  defaultTags: [
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Holy",
    "Humanoid",
    "Ooze",
    "Plant",
    "Profane",
    "Undead",
    "Unholy"
  ], // the starting list of the world setting "Tags"
  poolNames: { B: "Vigor [V]", M: "Resolve [R]", C: "Choice [C]", "": "Damage" },
  traitHelp: {
    area: "These Actions target every creature in their area that they affect, ignoring Senses (no penalty against Obscured, Hidden or Unsensed creatures, and light doesn't change the roll). You need Line of Effect to the Point of Origin to place the area; Line of Effect and Cover are checked from the Point of Origin to each creature.",
    strike: "Extra rules: you can make at most three Strikes per turn.",
    light: "A small melee weapon held in one hand: in your off hand it takes 1 Bane instead of 2 (Hands). Some Actions need one (Darting Blade).",
    strung: "Held in one hand and drawn with the other: [Strike, Weapon] Actions with it take 3 Banes while your other hand holds something. Never the off-hand Banes.",
    nonlethal: "Deals Nonlethal damage by default. Taking a Bane makes it deal Lethal damage instead.",
    body: "Rolls Body.",
    mind: "Rolls Mind.",
    appeal: "Rolls Appeal.",
    instinct: "Rolls Instinct.",
    magic: "Power: rolls your Power Modifier. Its damage is the dice on the card: no Attribute is added, on any Tier. Needs no weapon.",
    signature: "Rolls your Signature Modifier (the higher of Weapon and Power). On every Tier, Tier 1 included, your Signature Attribute is added to the first damage instance. Never needs a weapon.",
    split: "Two modes, Weapon and Power: choose one each time you use it. In that mode it takes the mode's trait and is an Action of that mode for every rule (a Weapon Action needs a weapon; a Power Action doesn't). Frequency, target, trigger and Critical are shared; the damage and traits are the mode's.",
    fear: "No rules of its own: other features refer to it.",
    unfailing: "When its roll gets a Tier 1, that use doesn't count toward its Frequency: you can use it again. You still spend its AP, and its Tier 1 still happens.",
    focus: "Requires concentration. This is not a mechanic by itself, but some features affect your ability to concentrate.",
    weapon:
      "Requires a weapon. Rolls your Weapon Modifier. On a Tier 2 or 3, your Weapon Attribute is added to the weapon's damage.",
    handle: "You must be able to use your hands and have a hand free. Releasing an object costs no AP (Release).",
    melee: "Requires a Melee weapon. Normally uses your Reach as the Distance.",
    ranged: "Requires a Ranged weapon. The weapon defines the Distance.",
    barehanded: "Can't be disarmed and uses no hand, but you need a free hand to use it.",
    nonthreatening: "Doesn't threaten: you can't flank with it, unless a feature says otherwise (Fists have it; Brawler removes it).",
    move: "You must have a Speed of at least 1."
  },
  // v0.0.261 (Lucas, Divine Intervention): the moment a Reaction watches for by itself ("would go Down": asked before the damage lands)
  // v0.0.272 (pack RX, Lucas): the first set of moments. "Within N" is measured to the creature the moment is about (the ally, the enemy who moves).
  moments: { "": "None", wouldDown: "A creature would go Down", strikeDamage: "A Strike would damage an ally within N", strikeAgainst: "A Strike is made against an ally within N", enemyCloser: "An enemy within N moves closer (to you or an ally)", allyDamage: "An ally within N takes damage", enemyMoves: "An enemy within N moves or stands up", enemyAway: "An enemy within N moves away from you", enemyAdjacent: "An enemy within N would enter a square adjacent to you" },
  // v0.0.272: whom the Reaction is used on when its moment comes ("the triggering creature" of the card)
  momentTargets: { subject: "The creature of the moment (the ally, the enemy who moves)", source: "The creature that caused it (the attacker)" },
  // v0.0.264 (Lucas): a Grant's "On [a result], [what happens]": the result, and what happens (the target's next damage halved, or a line on the card)
  grantOnChoices: { "": "never", t1: "a Tier 1 or more", t2: "a Tier 2 or more", t3: "a Tier 3", crit: "a Critical", all: "any result" },
  grantDoChoices: { half: "the target's next damage is halved", text: "the card says" },
  coverLevels: { low: "Low", medium: "Medium", high: "High" },   // v0.0.266 (Lucas, Aim): the "Ignores cover" setting's levels
  // v0.0.301 (PACK BB; book Ch. 1, Named Boons and Banes): the names that carry a limit of 2 (none: they always add up)
  bbNames: { "": "no name", field: "Field", pressure: "Pressure", support: "Support" },
  effectSettings: { inline: "Grants an Action while active", boonbane: "Boons and Banes", damagestep: "Empowered", bonusdamage: "Bonus Damage", defense: "Defense", aura: "Aura", ondamage: "On damage", grant: "Grant Action Use", zone: "Zone (the placed area)", cover: "Ignores cover", speed: "Speed", light: "Token Light", note: "Note", ignore: "Ignore a Bane", rally: "Rally Points", turnstart: "Effect each turn", message: "Chat message", weaponprop: "Weapon property", mastery: "Starting Mastery", eschook: "Escalation hook", bleed: "Bleed (damage each turn)", resist: "Resist, Weak or Immune", freqmore: "More uses of a Frequency", move: "Movement limit", encstart: "Effect each encounter" },
  // v0.0.314 (pack AU): a Boons and Banes setting can count only against creatures other than the effect's origin (Taunted), or only against it
  vsOriginChoices: { "": "against any creature", not: "only against creatures other than its origin", only: "only against its origin" },
  // v0.0.243 (pack R): the moments a class's Escalation hook names (once an encounter, +1 Escalation): Kindled Wrath, Thrill of the Kill.
  // v0.0.320 (pack AU part 2; book, Chapter 1 Resist, Weak and Immune; Bestiary, Elite Escalation): the kinds of a Resist setting, and the extra uses
  //   a "More uses of a Frequency" setting gives (the Elite ladder's rungs 2 and 3; Special Actions: not the Basic Actions).
  rwKinds: { resist: "Resist", weak: "Weak", immune: "Immune" },
  // v0.0.340 (book, Rally Points: NPCs): what one Rally Point an NPC is given heals, by Stage. v0.0.407 (Stage 0 in Foundry): Stage 0 / 1 / 2 / 3;
  // Stage 0 heals 9 (the book); the later Stages keep pack R's rows until they are written.
  npcRallyHeal: [9, 9, 13, 17],
  freqMore: { round: "its Round Special Actions can be used twice per turn-cycle", encounter: "its Encounter Special Actions can be used a second time" },
  escHookWhen: { allyState: "An ally within N squares becomes Bloodied or goes Down", markDown: "The creature it marked goes Down", damagedDown: "An enemy it has damaged goes Down" },   // v0.0.411 (Thrill of the Kill): damagedDown
  // v0.0.198 (Lucas, 2026-10-30): the Basic Actions section of the Actions tab, 4 groups in a 2x2 grid (row 1 Attack | Control, row 2
  // Movement | Utility), each in this order. By name: the Kind traits don't separate them. The items and the compendium don't change.
  basicGroups: [
    // v0.0.289 (PACK SHEET, Lucas's design): four columns, Attack | Movement | Control | Utility; Opportunity Attack is in the Reactions section
    { key: "attack", label: "Attack", names: ["Weapon Attack", "Charge", "Fists", "Reload"] },
    { key: "movement", label: "Movement", names: ["Advance", "Evade", "Crawl", "Stand", "Break Free"] },
    { key: "control", label: "Control", names: ["Shove", "Trip", "Haul", "Relocate"] },
    { key: "utility", label: "Utility", names: ["Steel Yourself", "Interact", "Shake Off", "Regrip", "Release", "Leaning"] }
  ],
  // v0.0.189 (Lucas, after Draw Steel's Codex): how much of a card Foundry does for you, as a chip on the card. "" shows nothing.
  // v0.0.355 (PACK ACTION-SHEET; the audit's D21, D22): the highest Escalation, read by the Action sheet's Escalation field and a rule's "Works"
  // (6 since v0.0.407, Stage 0 in Foundry: the 1-to-6 ladder). Never write a fixed 1 / 2 / 3 in an editor.
  escalationMax: 6,
  // v0.0.418 (Lucas, playtest 5, A5: "none are Mithril anymore"): Mithril and Diamond are retired; every card carries Claude's Bronze / Silver / Gold
  // rating (foundry/automation-ratings.md). The two old values stay readable on old world items (shown as their old names).
  automationRanks: { "": "(not set)", none: "Not implemented", bronze: "Bronze", silver: "Silver", gold: "Gold", mithril: "Mithril (retired)", diamond: "Diamond (retired)" },   // v0.0.315 (Lucas): Diamond, a Mithril card changed since (even only its text or buttons): to revise with him   // v0.0.250 (Lucas): Mithril, a card written with him (book/cards/with-lucas.txt)
  automationHints: { diamond: "Diamond: written with Lucas (Mithril), then changed by a later pack; it needs his quick revision (book/cards/with-lucas.txt lists what changed)", none: "Not implemented: read the card and do it by hand", bronze: "Bronze: a main part of the card is by hand", silver: "Silver: it runs; one limit or a minor part is by hand", gold: "Gold: the whole card runs, every limit it states checked", mithril: "Mithril: written with Lucas, card by card; what the rules leave by hand is listed" },
  // v0.0.186 (pack OT in the book, 16-talents.md): a Talent's Category, and the kinds of Prerequisite the Talent picker can check.
  talentGroups: { combat: "Combat", mobility: "Mobility", magic: "Magic", skill: "Skill" },
  // v0.0.407 (Stage 0 in Foundry; book, Chapter 5, Talents): the Talents are set aside: the class window offers none (every Talent slot stays empty;
  // the slots and the compendium's Talent items stay, and a Talent dropped on a sheet still works). book/cards/set-aside.txt lists them.
  talentsSetAside: true,
  prereqKinds: { talent: "A Talent", level: "A Level", trait: "An Action with a trait", attribute: "An Attribute", other: "Other (not checked)" },
  // v0.0.186: the Bane rules a setting can switch off for matching Actions (the "Ignore a Bane" setting).
  // v0.0.207 (editability sweep): the general settings that replaced the last hidden card rules (automation.mjs, fists.mjs, mastery.mjs).
  messageWhen: { encounter: "At the start of an encounter", turn: "At the start of each of its turns", markDown: "When the creature it marked goes Down" },
  messageTo: { owners: "its owners (and the GM)", all: "everyone" },
  removableProps: { nonthreatening: "Non-threatening" },
  propWeapons: { fists: "Fists", all: "weapons" },
  // v0.0.444 (Lucas, group 2: a card's requirement counts when choosing the weapon): the weapon property a [Weapon] Action needs (Darting Blade: Light)
  weaponNeeds: { "": "Any weapon that fits", light: "A Light weapon", twohanded: "A Two-handed weapon", thrown: "A Thrown weapon", long: "A Long weapon" },
  weaponUses: { "": "Its weapon (any weapon it can use)", fists: "Only the Fists (needs a free hand)", kick: "The Fists, even with no free hand (a kick)" },
  ignoreRules: { rangeBane: "one of their range Banes (far range none, maximum range 1)", engagedSelf: "the Banes for a [Ranged] Action while you are Engaged", engagedTarget: "the Bane for targeting a creature Engaged with a creature other than you" },
  durationTypes: { "": "None", eot: "End of Turn (EoT)", rounds: "Rounds", encounter: "This encounter" },   // v0.0.323: This encounter (Ends: Time)
  // Trait groups (v0.0.179, the book's GROUPS in book/build_rules.py): listed in this order, a trait with no group of its own is a Keyword.
  // Their colors are CSS variables (--g-roll...), light on parchment and dark on the dark sheets (system.css). Weapon properties have no group and no color.
  traitGroups: [
    { key: "roll", label: "Roll", traits: ["appeal", "body", "instinct", "magic", "mind", "save", "signature", "split", "weapon"] },
    { key: "requires", label: "Requires", traits: ["gun", "handle", "melee", "ranged", "shot"] },
    { key: "kind", label: "Kind", traits: ["area", "move", "self", "strike"] },
    { key: "damage", label: "Damage", traits: ["nonlethal"] },
    { key: "keywords", label: "Keywords", traits: ["divine", "focus", "fear", "unfailing"] }
  ],
  // The Bestiary (book: bestiary.html; v0.0.163, refit by E3 in v0.0.181, re-fitted to pack R by R-bestiary in v0.0.240: book/ruler/bestiary-r.json): an NPC is a role plus a rating for each number.
  //   attr: the Medium Attribute; hb: the Health Base; defense: the Medium Defense; cv: the Combat Value at the party's Stage, one Stage below, two Stages below
  //   (a normal fight is CV 100 a PC); deals / takes: the book's targets (a whole turn with its Specials against AD 13, before the party's Guard and blocks; the PC turns it lasts).
  //   hm and basic: the Health Multiplier and the Basic attack averages (Tier 2 / Tier 3, [Mod] included) by Stage (1, 2, 3), one per rating
  //   (Terrible, Low, Medium, High, Extreme; a Minion has no Extreme). Exactly the book's tables: nothing is computed from them.
  npcRoles: {
    minion: { label: "Minion", mods: [2, 1], modBy: [0, 1, 2, 3], cv: [25, 20, 15], ap: 3, attr: 0, hb: 1, defense: 12, extreme: false, deals: "5", takes: "one PC hit",
      hm: [[0, 0.75, 1, 1.25], [0, 1, 1.25, 1.5], [0, 1.5, 2, 2.75]],
      basic: [[[1, 2.5], [1.5, 3.5], [2, 4], [2.5, 5]], [[1.5, 3.5], [2, 5], [3, 5.5], [3.5, 7]], [[2, 5], [3, 7], [4, 8], [5, 10]]] },
    grunt: { label: "Grunt", mods: [2, 1], modBy: [0, 1, 2, 3, 4], cv: [50, 40, 30], ap: 3, attr: 0, hb: 3, defense: 13, extreme: true, deals: "8", takes: "1 PC turn",
      hm: [[2, 3, 4.25, 5.25, 6.25], [2.5, 3.75, 4.75, 6, 7.25], [4, 6, 8, 10, 12]],
      basic: [[[2, 3], [2.5, 3.5], [3, 4], [4, 5.5], [4.5, 6.5]], [[3, 4], [3.5, 5], [4, 6.5], [5.5, 8], [6.5, 10]], [[4, 6.5], [5, 7], [6.5, 9], [8, 11], [9, 14]]] },
    standard: { label: "Standard", mods: [2, 2], modBy: [0, 1, 2, 3, 4], cv: [100, 80, 65], ap: 4, attr: 1, hb: 4, defense: 13, extreme: true, deals: "12", takes: "2 PC turns",
      hm: [[3.75, 5.75, 7.75, 9.75, 11.5], [4.5, 6.75, 9, 11.25, 13.5], [7.5, 11, 15, 18.5, 22.5]],
      basic: [[[3, 4], [3.5, 6], [4, 7.5], [5.5, 9], [6.5, 11]], [[4, 6.5], [5, 8.5], [6.5, 11.5], [8, 13.5], [10, 16.5]], [[6.5, 9], [7, 12], [9, 16.5], [11, 19], [14, 23]]] },
    elite: { label: "Elite", mods: [3, 2], modBy: [1, 2, 3, 4, 4], cv: [200, 160, 130], ap: 4, attr: 2, hb: 6, defense: 14, extreme: true, deals: "17", takes: "4 PC turns",
      hm: [[6.5, 10, 13.25, 16.5, 19.75], [7.75, 11.5, 15.5, 19.25, 23.25], [13, 19.25, 25.5, 32, 38.5]],
      basic: [[[3, 4], [4, 6.5], [5, 7.5], [6.5, 9.5], [7.5, 11]], [[4, 6.5], [6, 9], [7.5, 11.5], [9, 14], [10.5, 16]], [[6, 9], [8.5, 12.5], [10.5, 15.5], [12.5, 19.5], [15, 22.5]]] }
  },
  // Stage 0 (levels 1 to 3) in the book's Bestiary (pack "Stage 0 into the book", 2026-11-12; fitted by book/ruler/sim/stage0fit.mjs, reported in
  // book/ruler/stage0.md): ready numbers, exactly the book's tables. health: an NPC's Vigor or Resolve by rating (each has its own rating; the Health Pool
  // is the two added; no Attribute, no multiplier). basic / s1 / s2 / s3: the damage as written (Tier 2, Tier 3), a flat part plus at most one small die,
  // the Modifier already in it, for the Basic attack and the 1 AP, 2 AP and 3 AP Specials. v0.0.433 (the Bestiary audit): read by npcbudget.mjs and the
  // ruler; its damage rows are the old damage-only yardstick (the book now builds damage from the turn budget). Lucas, 2026-11-12 (after the first fit): a Minion has no Reaction AP and up to 3 Minions can share a turn slot (squad); it has 6 + 6 Health
  // (one hit to kill was tried and dropped: it was worth half its CV); a Grunt has 3 AP a turn (ap), as a Minion; a Standard's Medium 2 AP Special is half a step up (4 + 1d6 on Tier 2); the automated playtest environment reads it (book/ruler/sim/core.mjs npcS0).
  // A ranged NPC attack pays for its range with this many steps of damage rating (the Bestiary, Ranged attacks; measured: four ranged Standards at full damage are a hard fight).
  npcRangedStep: 1,
  // An NPC's CV moves by about this much for each step its Health and damage ratings sit above or below Medium in total (the Bestiary, Ratings; a Defense or a Modifier step counts half a step: npcbudget.mjs cvSteps).
  npcCvStep: { minion: 5, grunt: 10, standard: 15, elite: 30 },
  // An NPC's Armor or Ward Defense by rating (the Bestiary since 2026-11-12: two points a step going up, so a Defense rating is worth half a CV step; every Stage). Read by npcbudget.mjs.
  npcDefense: { minion: [10, 11, 12, 13], grunt: [10, 11, 13, 15, 17], standard: [10, 11, 13, 15, 17], elite: [11, 12, 14, 16, 18] },
  // The Bestiary's turn budget (pack "The Bestiary's turn budget", 2026-11-12; the book's Bestiary, "The turn budget"; calibrated by
  // book/ruler/sim/calib.mjs, reported in book/ruler/budget.md). Points are damage: toDamage turns them into Tier 2 / Tier 3 averages (a Medium
  // Standard's Basic attack is 25 points: 3.5 / 5.5). perAp: a rank's points an AP at Medium (its Basic attack), times rating; turnAp: how many AP its
  // turn budget counts; size: the premium of a 2 AP and a 3 AP Action; round: the Round premium; encounter: an Encounter Action is this times the Round
  // one; over: how far a best turn may go over the budget; riders: the flat price of a rider (Setup one size up, Tier 3 only one size down); explode: the price of an exploding die (written 1d6!) on an
  // Action that is not the Basic attack; multi: an Action that hits several creatures deals this share to each (multiEnc: an Encounter one); reaction.give: the share of a Reaction's points (a cost-AP Round Action's) that
  // comes off the creature's turn (self: a Reaction to being hit; other: to an ally or a movement; twoR: a 2R one, which keeps an AP instead);
  // payBack: by an Encounter Action's AP, the share of their points every other Action of the creature loses; help: a Boon on an ally's next attack, and a point
  // of Health healed, in points. Read by npcbudget.mjs (the Builder's points).
  npcBudget: { perAp: { minion: 18, grunt: 25, standard: 25, elite: 33 }, turnAp: { minion: 3, grunt: 3, standard: 4, elite: 4 },
    rating: { terrible: 0.65, low: 0.8, medium: 1, high: 1.2, extreme: 1.5 }, size: [0, 0, 0, 0.05], round: 0.1, encounter: 2, payBack: [0, 0.2, 0.25, 0.5], over: 0.15,
    riders: { forced: 2, mild: 3, moderate: 8, severe: 12, extreme: 18, step: 6 }, explode: 6, multi: 2 / 3, multiEnc: 0.5, toDamage: [0.14, 0.22], help: { boon: 3, health: 1 }, reaction: { self: 1 / 3, other: 0.25, twoR: 0 } },
  npcStage0: {
    minion: { reactionAp: 0, squad: 3, health: [3, 5, 6, 7],
      basic: [["1", "2"], ["1", "1d4"], ["2", "1 + 1d4"], ["1d4", "2 + 1d4"]],
      s1: [["1", "1d4"], ["2", "1 + 1d4"], ["1d4", "2 + 1d4"], ["1 + 1d4", "3 + 1d4"]],
      s2: [["2", "2 + 1d4"], ["1d4", "2 + 1d6"], ["1 + 1d4", "3 + 1d6"], ["2 + 1d4", "5 + 1d6"]] },
    grunt: { ap: 3, health: [7, 10, 13, 16, 19],
      basic: [["1", "2"], ["2", "1d4"], ["1d4", "1 + 1d4"], ["1 + 1d4", "2 + 1d4"], ["1 + 1d4", "3 + 1d4"]],
      s1: [["2", "1d4"], ["1d4", "1 + 1d4"], ["1 + 1d4", "2 + 1d4"], ["2 + 1d4", "2 + 1d6"], ["2 + 1d4", "3 + 1d6"]],
      s2: [["1 + 1d4", "2 + 1d4"], ["2 + 1d4", "2 + 1d6"], ["2 + 1d4", "3 + 1d6"], ["3 + 1d6", "6 + 1d6"], ["4 + 1d6", "7 + 1d6"]],
      s3: [["3 + 1d4", "4 + 1d6"], ["3 + 1d6", "6 + 1d6"], ["4 + 1d6", "7 + 1d6"], ["7 + 1d6", "10 + 1d8"], ["7 + 1d8", "13 + 1d8"]] },
    standard: { health: [17, 24, 30, 36, 42],
      basic: [["1d4", "1 + 1d4"], ["1d4", "2 + 1d4"], ["1 + 1d4", "2 + 1d6"], ["2 + 1d4", "3 + 1d6"], ["3 + 1d4", "5 + 1d6"]],
      s1: [["1 + 1d4", "2 + 1d4"], ["1 + 1d4", "3 + 1d6"], ["2 + 1d4", "4 + 1d6"], ["2 + 1d6", "6 + 1d6"], ["3 + 1d6", "7 + 1d8"]],
      s2: [["2 + 1d4", "3 + 1d6"], ["2 + 1d6", "6 + 1d6"], ["4 + 1d6", "8 + 1d8"], ["6 + 1d6", "10 + 1d8"], ["7 + 1d6", "14 + 1d8"]],
      s3: [["4 + 1d6", "7 + 1d6"], ["6 + 1d6", "11 + 1d8"], ["7 + 1d6", "15 + 1d8"], ["10 + 1d8", "19 + 1d8"], ["13 + 1d8", "24 + 1d8"]] },
    elite: { health: [35, 50, 65, 80, 95],
      basic: [["1d4", "1 + 1d4"], ["1 + 1d4", "3 + 1d4"], ["3 + 1d4", "3 + 1d6"], ["3 + 1d6", "5 + 1d6"], ["4 + 1d6", "6 + 1d6"]],
      s1: [["1 + 1d4", "3 + 1d4"], ["3 + 1d4", "4 + 1d6"], ["3 + 1d6", "5 + 1d6"], ["4 + 1d6", "7 + 1d6"], ["5 + 1d6", "8 + 1d8"]],
      s2: [["3 + 1d4", "4 + 1d6"], ["4 + 1d6", "7 + 1d8"], ["6 + 1d6", "10 + 1d8"], ["7 + 1d8", "13 + 1d8"], ["10 + 1d8", "16 + 1d8"]],
      s3: [["5 + 1d6", "7 + 1d8"], ["7 + 1d8", "15 + 1d8"], ["11 + 1d8", "17 + 1d8"], ["15 + 1d8", "23 + 1d8"], ["17 + 1d8", "27 + 1d8"]] }   // Lucas, 2026-11-12: the Elite strengthened to be worth its CV 200 (damage x 1.12: two Elites cost what four Standards do)
  },
  //   off: Attribute and Defense steps; score: for "the ratings average" (-2 to +2); i: the column of the role tables.
  npcRatings: {
    terrible: { label: "Terrible", off: -2, score: -2, i: 0 },
    low: { label: "Low", off: -1, score: -1, i: 1 },
    medium: { label: "Medium", off: 0, score: 0, i: 2 },
    high: { label: "High", off: 1, score: 1, i: 3 },
    extreme: { label: "Extreme", off: 2, score: 2, i: 4 }
  },
  // Stages (book, Chapter 5; v0.0.407, Stage 0 in Foundry): Stage 0 levels 1-3, Stage 1 4-7, Stage 2 8-11, Stage 3 12-15 (above 15 counts as Stage 3,
  // level 0 as Stage 0). Every table by Stage below has one entry a Stage, Stage 0 first.
  stages: [{ n: 0, from: 1, to: 3 }, { n: 1, from: 4, to: 7 }, { n: 2, from: 8, to: 11 }, { n: 3, from: 12, to: 15 }],
  // A PC's Weapon and Power Modifiers by Stage (book, Chapter 5): +1 to the one the player chooses at Stage 1 (modifiers.mjs classTrack), +1 to both at
  // Stage 3, never above +4 (NPCs: no step). stageModStep is the step to both (a class copy from before pack MOD, stageMod below).
  stageModStep: [0, 0, 0, 1], modCap: 4,
  // Rally Points (book, Chapter 5, Stages): the class's Rally value + 1 / 2 / 3 / 4 by Stage.
  rallyByStage: [1, 2, 3, 4],
  // modBy (v0.0.307, Lucas; the Bestiary, Attributes and Modifiers): an NPC's Weapon or Power Modifier by rating (Terrible to Extreme; a Minion has no Extreme).
  vsBase: 12,   // v0.0.307 (Lucas; book, Chapter 2, Defenses): Vs. an Attribute = 12 + the Attribute
  // Pack R (v0.0.243; book, Chapter 2): 4 AP a turn and 1 Reaction AP (the Reaction AP pays only for Reactions; Slowed and Quickened change the 4 only);
  // each AP kept at the end of the turn is Guard 2 / 2 / 3 / 4 by Stage (0 to 3) until the AP are regained (guard.mjs).
  apPerTurn: 4, reactionAp: 1, guardPerAp: [2, 2, 3, 4],
  // Escalation (book, Chapter 2; v0.0.407): a level from 1 to 6, never spent; 1 + the party's Momentum (0 to 4) at the start of an encounter, +1 a round,
  // +1 once an encounter on a Critical and on the class's hook. momentumMax: the party's Momentum (roundrules.mjs momentumAfter).
  escalation: { min: 1, max: 6, momentumMax: 4 },
  npcSpeeds: [3, 4, 5, 6, 7],   // the Builder's Speed choices (5 by default); any other Speed is Custom
  npcSpecial: [{ key: "basic", label: "Basic attack", sub: "1 AP, At-will", x: 1 }, { key: "s1", label: "Special, 1 AP", sub: "Round", x: 1.4 }, { key: "s2", label: "Special, 2 AP", sub: "Round", x: 2.2 }, { key: "s3", label: "Special, 3 AP", sub: "Encounter (not Minions)", x: 3.5 }],
  // A Stage 1 PC's damage a turn against a Defense (ruler: book/ruler/defense.mjs, mean of the Paladin's and the Archer's turn), for the Builder's check.
  // v0.0.181: checked against the P1 and A1 main turns (book/ruler/report.md: 24.7 / 23.1 / 21.4 at Defense 12 / 13 / 14), within 2%: kept.
  pcDamageVsDefense: { 11: 27.0, 12: 25.2, 13: 23.3, 14: 21.3, 15: 19.2, 16: 17.3 },
  cardColors: { weapon: "#d6b53f", self: "Always targets you, the origin of the Action. An [Area] Action with Self is centered on you.", default: "#9c9c9c" },
  movementActions: { walk: "Walk", fly: "Fly", swim: "Swim", climb: "Climb", crawl: "Crawl", burrow: "Burrow" },
  vsChoices: { "": "None (DC 13)", roll: "The attribute rolled (Body or Instinct...)", body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" },
  // Collision when Pushed: unused squares of the push x damage per square (Body). A wall hurts the pushed creature; a creature hurts both.
  collision: { wall: 2, creature: 1 },
  baseDC: 13,
  // Defenses (Round 11/12): Armor and Ward are 11 + their value; Vs. an Attribute is vsBase (12) + the Attribute (v0.0.307).
  defenseBase: 11,
  // The default colors of an Aura on the map by who it affects (each Aura can set its own outline and squares colors).
  auraColors: { allies: "#4a90d9", enemies: "#d94a4a", all: "#9b59b6" },
  armors: { unarmored: { label: "Unarmored", value: 0, rank: 0 }, light: { label: "Light", value: 1, rank: 1 }, medium: { label: "Medium", value: 2, rank: 2 }, heavy: { label: "Heavy", value: 3, rank: 3 } },
  armorTrainings: { light: "Light", medium: "Medium", heavy: "Heavy" },
  // What a Defense bonus (a Feature's or an effect's) raises: every Defense, Armor, Ward, or one Vs. Attribute.
  defenseKinds: { all: "every Defense", armor: "Armor Defense (AD)", ward: "Ward Defense (WD)", body: "Vs. Body", mind: "Vs. Mind", appeal: "Vs. Appeal", instinct: "Vs. Instinct", steadiness: "Steadiness (being moved)" },   // steadiness (v0.0.174): not a Defense; "every Defense" never adds to it
  basicCategory: "Basic Action",
  pushSpeed: 20, // squares per second when a token is pushed (normal movement is slower)
  // Pushed: the creature can only end in a cone (degrees either side of the line straight away from the origin).
  pushCone: 45
};

/* ------------------------------------------------------------------ Stages and the Bestiary's tables (v0.0.181, E3; book: Bestiary, Chapter 5) */
const r5 = x => Math.round(x * 2) / 2;
/** The Stage of a level (book, Chapter 5; v0.0.407): 0 (levels 1-3; level 0 too), 1 (4-7), 2 (8-11), 3 (12 and up). */
export const stageOf = lv => { const l = Math.trunc(Number(lv)) || 0; return l >= 12 ? 3 : l >= 8 ? 2 : l >= 4 ? 1 : 0; };
/** A Stage kept within 0 to 3 (a missing or odd value is Stage 0). */
export const clampStage = st => Math.max(0, Math.min(3, Math.trunc(Number(st)) || 0));
/** The row of pack R's Bestiary tables (npcRoles: three rows) a Stage reads: Stages 0 and 1 the first (Stage 0's NPCs use npcStage0), then one a Stage. */
export const npcRoleRow = st => Math.max(0, Math.min(2, clampStage(st) - 1));
/** A PC's Rally Points (book, Chapter 5): the class's Rally value + 1 / 2 / 3 / 4 by Stage. */
export const rallyPointsOf = (rally, lv) => Math.max(0, (Number(rally) || 0) + TWOD12.rallyByStage[stageOf(lv)]);
/** A PC's Modifier with its Stage's step to both (+1 at Stage 3), never raised above +4 (a higher Modifier stays as it is). */
export const stageMod = (mod, lv) => Math.max(mod, Math.min(TWOD12.modCap, mod + TWOD12.stageModStep[stageOf(lv)]));
const npcCol = (roleKey, rating) => { const role = TWOD12.npcRoles[roleKey] ?? TWOD12.npcRoles.standard; return Math.min(role.hm[0].length - 1, TWOD12.npcRatings[rating]?.i ?? 2); };
/** The Health Multiplier of a rating at the NPC's level (pack R's row of its Stage: npcRoleRow). */
export const npcHm = (roleKey, rating, lv) => (TWOD12.npcRoles[roleKey] ?? TWOD12.npcRoles.standard).hm[npcRoleRow(stageOf(lv))][npcCol(roleKey, rating)];
/** The Basic attack's average damage [Tier 2, Tier 3] of a rating at the NPC's level, times x (a Special Action), rounded to 0.5 (pack R's rows). */
export const npcDamage = (roleKey, rating, lv, x = 1) => (TWOD12.npcRoles[roleKey] ?? TWOD12.npcRoles.standard).basic[npcRoleRow(stageOf(lv))][npcCol(roleKey, rating)].map(v => r5(v * x));
/** The Combat Value of an NPC against a party: the role's CV, lower when the NPC's Stage is below the party's (one Stage x0.8, two x0.65, the book's table). */
export const npcCv = (roleKey, npcLv = 1, partyLv = npcLv) => { const cv = (TWOD12.npcRoles[roleKey] ?? TWOD12.npcRoles.standard).cv; return cv[Math.min(2, Math.max(0, stageOf(partyLv) - stageOf(npcLv)))]; };

/** CSS variables for a card color (title color and a soft gradient). */
export const cardVars = hex => {
  const n = parseInt(hex.slice(1), 16);
  return `--card-color:${hex};--card-text:#f4f4f0;--card-grad:rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},.30);--card-head:rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},.50);`;
};

/** The title bar of an Action card: name on the left, category and cost on the right. */
/** v0.0.189: the automation rank as a small chip (nothing when it isn't set). */
// v0.0.215 (Lucas, playtest 2): the diamond's tooltip also says what is not implemented yet (the item's "By hand" note), for Bronze and Silver.
export const autoChip = (rank, note = "") => (rank && TWOD12.automationRanks[rank] ? `<i class="fa-solid fa-diamond autodia auto-${rank}" aria-label="${escAttr(TWOD12.automationRanks[rank])}"></i>` : "");   // v0.0.190: a diamond (grey, bronze, silver, gold); v0.0.420: no hover (the rank is its screen-reader name; what is by hand is on the item)
export const cardHead = (name, cat, costHtml, freq = "", auto = "", autoNote = "") => `<div class="ahead"><b>${escAttr(name)}${autoChip(auto, autoNote)}</b><div class="aright"><span class="atop">${freq && TWOD12.frequencies[freq] ? `<span class="afreq">${escAttr(TWOD12.frequencies[freq])}</span>` : ""}${costHtml ? `<span class="aps">${costHtml}</span>` : ""}</span>${cat ? `<span class="acat">${escAttr(cat)}</span>` : ""}</div></div>`;
/** v0.0.234 (pack R-core): the book writes the pool keys B / M as [V] / [R]: the tag of a stored pool in the text Foundry writes. */
export const poolTag = pool => ({ B: "V", M: "R" })[pool] ?? pool;
/** Damage on cards: a filled heart for Vigor, a filled brain for Resolve, and each damage type in its own color with its icon. */
export const poolIcon = pool => pool === "M" ? '<i class="fa-solid fa-brain dt-mind"></i>'
  : pool === "C" ? '<span class="dt-choose"><i class="fa-solid fa-heart dt-body"></i><i class="fa-solid fa-brain dt-mind"></i></span>'
  : '<i class="fa-solid fa-heart dt-body"></i>';
/** A damage type's icon (on parchment cards, Slash uses Foundry's sword image). */
// v0.0.443 (Lucas's checklist, e6-blunt: "The Icon from Slash on the NPCs sheet is black, and its different colored than Blunt"): Slash was
// Foundry's sword picture, which can't take its type's color; every type is now its icon, in its color
export const dtypeIcon = k => `<i class="${TWOD12.subtypeIcons[k] ?? ""}"></i>`;
export const dtypeHtml = code => {
  const k = Object.keys(TWOD12.subtypeInk).find(x => x.toLowerCase() === String(code ?? "").toLowerCase());
  return k ? `<span class="dtype dt-${k.toLowerCase()}" style="color:${TWOD12.subtypeInk[k]};--sc-d:${TWOD12.subtypeColors?.[k] ?? TWOD12.subtypeInk[k]}">${dtypeIcon(k)} ${TWOD12.subtypes[k]}</span>` : "";
};
/** Turn "[B] 1[W] Sl" (already escaped) into the card's look: icons for [B]/[M]/[C], the damage type as a colored name. */
/** The ink of a damage type ("Co" -> its color), for the amount written before it (v0.0.137: "1d8 Cold" is all in Cold's color). */
/** v0.0.441 (E6): a damage type's bright color, for a dark surface (styles: the dark scope reads --sc-d over the parchment's inline ink). */
export const brightOf = code => { const k = Object.keys(TWOD12.subtypeColors ?? {}).find(x => x.toLowerCase() === String(code ?? "").toLowerCase()); return k ? TWOD12.subtypeColors[k] : ""; };
export const inkOf = code => { const k = Object.keys(TWOD12.subtypeInk ?? {}).find(x => x.toLowerCase() === String(code ?? "").toLowerCase()); return k ? TWOD12.subtypeInk[k] : ""; };
// v0.0.179 (the book's look): a damage expression after [B] or [M] ("[B] 1[W] + [Mod]", "[M] 1d4") is in its pool's color, the damage type in its own;
// an amount with no pool before it ("+1d6 Ho" from a bonus) keeps the type's ink as before.
// Pack R-core: [V] Vigor and [R] Resolve damage are the B and M pools (both spellings read until R-Foundry).
const POOL_CSS = { B: "b", V: "b", M: "m", R: "m" }, POOL_KEY = { B: "B", V: "B", M: "M", R: "M", C: "C" };
const POOL_EXPR = /\[(B|M|V|R)\](\s*)((?:\d+d\d+!?|\d*\[W\]|\[Mod\]|\[At\]|\d+)(?:\s*[+\-\u2212]\s*(?:\d+d\d+!?|\d*\[W\]|\[Mod\]|\[At\]|\d+))*)/g;
export const prettyDamage = html => String(html ?? "")
  .replace(POOL_EXPR, (m, p, sp, expr) => `${poolIcon(POOL_KEY[p])}${sp}<span class="pool-${POOL_CSS[p]}">${expr}</span>`)
  .replace(/(\d*\[W\]|\[At\]|\d+d\d+!?(?:[+-]\d+)?|\b\d+)(\s+)(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, (m, amt, sp, code) => (inkOf(code) ? `<span class="dtamt" style="color:${inkOf(code)};--sc-d:${brightOf(code) || inkOf(code)}">${amt}</span>${sp}${code}` : m))
  .replace(/\[(B|M|C|V|R)\]/g, (m, p) => poolIcon(POOL_KEY[p]))
  .replace(/\b(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, m => dtypeHtml(m));

/** The optional flavor line, under the title bar. */
export const flavorHtml = d => (d?.flavor ? `<div class="flavor">${escAttr(d.flavor)}</div>` : "");

/** AP cost as one of the five Action Icons (falls back to text above 5). Colored by the surrounding text color. */
/** The cost of an Action as one badge: "2AP", "1/2/3AP" when it has several Versions, or "1R" for a Reaction. */
export const apLabel = (aps, reaction = false) => {
  const list = [...new Set([].concat(aps))].sort((a, b) => a - b), txt = list.join("/");
  return reaction
    ? `<span class="rmark">${txt}R</span>`
    : (list.length === 1 && list[0] === 0 ? `<span class="apmark">0AP</span>` : `<span class="apmark">${txt}AP</span>`);
};
export const apIcon = (n, reaction = false) => apLabel([n], reaction);

const escAttr = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/** The group of a trait (v0.0.179): roll, requires, kind, damage or keywords (a trait with no group of its own). */
export const traitGroupOf = k => TWOD12.traitGroups.find(g => g.traits.includes(k))?.key ?? "keywords";
/** Trait keys in the book's order: by group (Roll, Requires, Kind, Damage, Keywords), alphabetical inside a group. */
export const orderTraits = keys => { const lab = k => String(TWOD12.traits[k] ?? k), gi = k => TWOD12.traitGroups.findIndex(g => g.key === traitGroupOf(k));
  return [...(keys ?? [])].sort((a, b) => gi(a) - gi(b) || lab(a).localeCompare(lab(b))); };
/** The trait picker's options, grouped (v0.0.179): { options: [{ value, label, group }], groups: ["Roll", ...] } for an Action's or Talent's Traits. */
export const traitPicker = () => ({
  options: orderTraits(Object.keys(TWOD12.actionTraits)).map(k => ({ value: k, label: TWOD12.actionTraits[k], group: TWOD12.traitGroups.find(g => g.key === traitGroupOf(k))?.label ?? "Keywords" })),
  groups: TWOD12.traitGroups.map(g => g.label)
});
/** The color of a trait's group, as a CSS value (for inline styles inside the system's sheets and cards). */
export const traitColor = k => `var(--g-${traitGroupOf(k)})`;

/**
 * Trait chips (v0.0.179, the book's look): a block per trait group, in the order Roll, Requires, Kind, Damage, Keywords, alphabetical inside a group,
 * each with a small uppercase label over its chips and a thin line between blocks; the chips are tinted in the group's color.
 * properties: a weapon's properties (Melee, Ranged, Thrown...): plain neutral chips, no groups and no color.
 * compact (v0.0.180, D0 option E, chat cards only): the same groups, order and colors as tight chips with no group labels and a short line
 * between groups; each chip's tooltip starts with its group's name. The sheets, the pickers and the roll dialog keep the labeled groups.
 */
export function traitChevrons(traits, { properties = false, compact = false } = {}) {
  const label = k => String(TWOD12.traits[k] ?? k), byLabel = (a, b) => label(a).localeCompare(label(b));
  const help = k => TWOD12.traitHelp[k] ?? "TBD";
  const chip = (k, cls = "", tip = help(k), style = "") => `<span class="tchip${cls}"${style ? ` style="${style}"` : ""}>${escAttr(label(k))}</span>`;
  const list = [...(traits ?? [])];
  if (properties) return list.length ? `<span class="tprops">${list.sort(byLabel).map(k => chip(k, " prop")).join("")}</span>` : "";
  if (compact) {
    const blocks = TWOD12.traitGroups.map(g => {
      const ks = list.filter(k => traitGroupOf(k) === g.key).sort(byLabel);
      return ks.map(k => chip(k, ` tc tg-${g.key}`, `${g.label} \u00b7 ${help(k)}`, `--tg:var(--g-${g.key})`)).join("");
    }).filter(Boolean);
    return blocks.length ? `<span class="tcompact">${blocks.join('<span class="tsep" aria-hidden="true"></span>')}</span>` : "";
  }
  return TWOD12.traitGroups.map(g => {
    const ks = list.filter(k => traitGroupOf(k) === g.key).sort(byLabel);
    return ks.length ? `<span class="tg tg-${g.key}" style="--tg:var(--g-${g.key})"><span class="tgl">${g.label}</span><span class="tgc">${ks.map(k => chip(k)).join("")}</span></span>` : "";
  }).join("");
}

/** The category shown at the far right of an Action title: "Paladin Feature 1" (the number is the level it is gained). */
export const categoryText = d => {
  // v0.0.186: a Talent with a Category reads like the book's head, "Combat Talent 1".
  const g = TWOD12.talentGroups[d?.group], c0 = String(d?.category ?? "").trim(), c = g && (!c0 || c0 === "Talent") ? `${g} Talent` : c0, l = Number(d?.level) || 0;
  return c ? (l > 0 ? `${c} ${l}` : c) : (l > 0 ? `Level ${l}` : "");
};

/** The card color of an Action: gold for Weapon actions, blue for Self actions. */
/** The title bar of a card is colored by its Frequency: At-will green, Round blue, Encounter red, no limit grey. */
export const FREQ_COLORS = { atwill: "#3B6D11", turn: "#0F6E6E", round: "#185FA5", encounter: "#A32D2D", daily: "#5B3FA6", "": "#5F5E5A", none: "#5F5E5A" };
export const cardColorFor = d => FREQ_COLORS[effectiveFrequency(d ?? {})] ?? FREQ_COLORS[""];

const TRAIT_WORDS = { Strike: "strike", Nonlethal: "nonlethal", Divine: "divine", Focus: "focus", Handle: "handle", Power: "magic", Signature: "signature", Melee: "melee", Ranged: "ranged", Self: "self", Weapon: "weapon", Reload: "reload", "Two-handed": "twohanded" };
const DAMAGE_WORDS = { Acid: "Ac", Blunt: "Bl", Cold: "Co", Electricity: "El", Fire: "Fi", Force: "Fo", Holy: "Ho", Pierce: "Pi", Psychic: "Ps", Slash: "Sl", Thunder: "Th", Unholy: "Un" };
const famColor = key => traitColor(key);
// v0.0.192: every trait name (as the book writes them in brackets) → its key, for "[Ranged, Shot]".
const TRAIT_KEY_OF = Object.fromEntries([...Object.entries(TWOD12.traits).map(([k, label]) => [String(label).toLowerCase(), k]), ["power", "magic"]]);
const TRAIT_KEYS = [...new Set(Object.values(TWOD12.traits).map(String))].sort((a, b) => b.length - a.length).map(l => l.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|");

/* ------------------------------------------------------------------ text colors (v0.0.179: the book's CLASS_TOKEN, book/build_rules.py) */
const ATOM = String.raw`(?:\d+d\d+!?|\d+\[W\]|\[Mod\]|\d+)`, EXPR = String.raw`${ATOM}(?:\s*[+\-\u2212/]\s*${ATOM})*`;
const TOKEN_RE = new RegExp([
  String.raw`(?<slash>${ATOM}(?:\s*/\s*${ATOM})+\s*\[(?<sp>[BMVR])\])`,    // "1d6 / 1d4 / 0 [R]": tier values with the pool after them
  String.raw`(?<tag>\[(?<tp>[BMVR])\]\s*${EXPR})`,                           // "[B] 1[W] + [Mod]", "[M] 1d6+1"
  // v0.0.451 (Lucas, g3-res: "the '!' and 'Ho' arent colored"): a damage code after a die, a number or a ] in its type's color, as the book does
  String.raw`(?<dcode>(?<=[\d\]!]\s)(?:Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b)`,
  String.raw`(?<ht>\[HT(?::[^\]]*)?\])`,                                      // "[HT: Entering, Turn]"
  // v0.0.192: a bracketed list of traits, "[Ranged, Shot]" or "[Strike]", colored as one group (each trait in its group's color).
  String.raw`(?<tgrp>\[(?:${TRAIT_KEYS})(?:,\s*(?:${TRAIT_KEYS}))*\])`,
  String.raw`(?<mod>\b(?:Weapon|Power|Signature)\s(?:Modifier|Attribute)s?\b)`,
  String.raw`\((?<apa>\d(?:/\d)*A)\)|(?<ap>\b\d(?:\s*/\s*\d)*\s?AP\b)|(?<rx>\b\d(?:/\d)*R\b)`,
  String.raw`(?<mv>\b(?:Advance|Evade|Pushed|Pulled|Slid|Reposition)\s\d+\b)`,
  String.raw`(?<neg>\b(?:Doomed|Enfeebled|Vulnerable|Down)\b(?:\s\d+\b)?)|(?<pos>\b(?:Favored|Empowered)\b(?:\s\d+\b)?)`,
  String.raw`(?<bane>\b(?:\d+\s+)?Banes?\b)|(?<boon>\b(?:\d+\s+)?Boons?\b)|(?<rally>\b(?:(?:up to )?\d+\s+)?Rally Points?\b)`,
  String.raw`(?<attr>\b(?:Body|Mind|Instinct|Appeal)\b)`,
  String.raw`(?<guard>\bGuard\b(?:\s\d+\b)?)`,   // v0.0.369 (STYLE-1, Lucas: "I like the proposed"): the word Guard in the Guard blue
  `(?<word>\\b(?:${[...Object.keys(TRAIT_WORDS), ...Object.keys(DAMAGE_WORDS)].sort((a, b) => b.length - a.length).join("|")})\\b(?!\\s+(?:Attack|Technique)))`
].join("|"), "g");
const traitTip = () => "";   // v0.0.420 (the tooltip review): no hover on a trait word
/** One colored token of text (the class names are the book's). */
function colorToken(m, g) {
  if (g.slash) return `<span class="pool-${POOL_CSS[g.sp]}">${m}</span>`;
  if (g.tag) return `<span class="pool-${POOL_CSS[g.tp]}">${m}</span>`;
  if (g.dcode) return inkOf(m) ? `<span class="dtamt dcode" style="color:${inkOf(m)};--sc-d:${brightOf(m) || inkOf(m)}">${m}</span>` : m;
  if (g.ht) return `<span class="kw-ht">${m}</span>`;
  // v0.0.261 (Lucas, Rolling Shot): a trait in a text carries its tooltip, like the chips of the Traits line
  if (g.tgrp) return `<span class="trgrp">[${m.slice(1, -1).split(/,\s*/).map(w => `<span class="trhl" style="--tc:${famColor(TRAIT_KEY_OF[w.toLowerCase()])}"${traitTip(TRAIT_KEY_OF[w.toLowerCase()])}>${w}</span>`).join(", ")}]</span>`;
  if (g.mod) return `<span class="mod-${m.split(/\s/)[0].toLowerCase()}">${m}</span>`;
  if (g.apa) return `(<span class="kw-ap">${g.apa}</span>)`;
  if (g.ap || g.rx) return `<span class="kw-ap">${m}</span>`;
  if (g.mv) return `<span class="kw-mv">${m}</span>`;
  if (g.neg) return `<span class="kw-neg">${m}</span>`;
  if (g.pos) return `<span class="kw-pos">${m}</span>`;
  if (g.bane) return `<span class="kw-bane">${m}</span>`;
  if (g.boon) return `<span class="kw-boon">${m}</span>`;
  if (g.rally) return `<span class="kw-rally">${m}</span>`;
  if (g.attr) return `<span class="at-${m.toLowerCase()}">${m}</span>`;
  if (g.guard) return `<span class="kw-guard">${m}</span>`;
  return TRAIT_WORDS[m] ? `<span class="trhl" style="--tc:${famColor(TRAIT_WORDS[m])}"${traitTip(TRAIT_WORDS[m])}>${m}</span>` : `<span class="dmgword" style="--dc:${TWOD12.subtypeInk[DAMAGE_WORDS[m]]};--sc-d:${TWOD12.subtypeColors[DAMAGE_WORDS[m]]}">${m}</span>`;
}
// Never inside: links, buttons, headings, scripts, SVG, and chips or marks that already have their own look.
const SKIP_TAG = /^(a|button|h[1-6]|script|style|svg|summary|code)$/i;
const SKIP_SPAN = /\bclass="[^"]*\b(tchip|tgl|apmark|rmark|dtype|dtamt|dmgword|trhl|pool-[bm]|at-\w+|kw-\w+|mod-\w+)\b/;

/**
 * The book's text colors (v0.0.179) in rules text on cards and sheets: the four Attributes, the Weapon, Power and Signature Modifier, Bane, Boon and
 * Rally Point with their number, the states (Doomed, Enfeebled, Vulnerable, Down in red; Favored, Empowered in blue), [HT], costs (1 AP, (1A), 1R),
 * a movement with its value (Evade 2), damage expressions in their pool's color; trait names and damage types keep their light background.
 * Only text outside tags is touched, never inside links, buttons, headings or chips. Can be turned off in the client settings.
 */
export function highlightText(html) {
  try { if (game.settings.get("twod12", "highlightTraits") === false) return html; } catch (e) { /* setting not registered yet */ }
  const stack = [];   // open elements: true when their text must stay as it is
  return String(html).split(/(<[^>]+>)/).map(part => {
    if (part.startsWith("<")) {
      const close = part.match(/^<\/(\w+)/), open = part.match(/^<(\w+)/);
      if (close) { for (let n = stack.length - 1; n >= 0; n--) if (stack[n].tag === close[1].toLowerCase()) { stack.splice(n); break; } }
      else if (open && !/\/>$/.test(part) && !/^(br|hr|img|input|meta|link|wbr)$/i.test(open[1])) {
        const tag = open[1].toLowerCase();
        stack.push({ tag, skip: SKIP_TAG.test(tag) || (tag === "span" && SKIP_SPAN.test(part)) });
      }
      return part;
    }
    if (!part || stack.some(x => x.skip)) return part;
    return part.replace(TOKEN_RE, (m, ...args) => colorToken(m, args[args.length - 1]));
  }).join("");
}

/**
 * The line under the traits: the Frequency (only when it matters) and the Target text, separated by a sparkle.
 * Then, on its own line, the tokens that are targeted.
 */
export function metaRowHtml({ distanceTip = "", frequency = "", targetText = "", distance = "", area: areaLine = "", vs = "", requirements = "", trigger = "", reactionKind = "", self = false, escalation = 0, areaHtml = "", sepHtml = "" } = {}) {
  // v0.0.297 (PACK ACTION-PREVIEW): the sheet card passes its own separator (a gold ✦) and its Area chip (the Place Area button) as areaHtml
  const sep = sepHtml || ' <i class="fa-solid fa-sparkle sep"></i> ';
  // Three lines, always in the same place (v0.0.157): 1 Escalation; 2 Targets ✦ Area; 3 Distance ✦ Vs. (a Save: "Instinct Save").
  // The Frequency is in the title bar (cardHead). The Self trait already says it targets you, so Self is left out.
  // v0.0.176: the Area (line 2, with the Targets) and the Distance (line 3) are separate; an older caller may still pass "Area: ..." as the distance.
  if (!areaLine && /^Area: /.test(distance)) { areaLine = distance.slice(6); distance = ""; }
  // v0.0.249 (Lucas): "Targets:" is labeled, and the meta texts are colored like the rules text (a [Strike] in a Trigger is a trait chip, the Attribute of "Appeal Save" has its color)
  const hl = t => { try { return highlightText(escAttr(t)); } catch (e) { return escAttr(t); } };
  const l1 = Number(escalation) > 0 ? [`<span class="esc">${Number(escalation)} Escalation</span>`] : [];
  const l2 = [(!self || areaLine) && targetText ? `<span class="tgt"><b>Targets:</b> ${hl(targetText)}</span>` : "", areaLine ? `<span class="dist"><b>Area:</b> ${areaHtml || hl(areaLine)}</span>` : ""].filter(Boolean);
  const l3 = [distance && distance.toLowerCase() !== "self" ? `<span class="dist"><b>Distance:</b> ${hl(/^\d+$/.test(String(distance).trim()) && distanceTip ? `${distance} sq.` : distance)}</span>` : "", vs ? `<span class="vs">${/save$/i.test(String(vs).trim()) ? "" : "<b>Vs.</b> "}${vsColored(vs)}</span>` : ""   /* v0.0.295 (Lucas): Vs. bold, the value colored */].filter(Boolean);
  const row = [l1, l2, l3].filter(l => l.length).map(l => `<div class="trow"><span>${l.join(sep)}</span></div>`).join("");
  const req = requirements ? `<div class="trow reqrow"><span><b>Requirements:</b> ${hl(requirements)}</span></div>` : "";
  const trg = trigger ? `<div class="trow trgrow"><span><b>${reactionKind === "interrupt" ? "Interrupt" : "Trigger"}:</b> ${hl(trigger)}</span></div>` : "";
  return trg + row + req;   // v0.0.254 (Lucas): a Reaction's Interrupt / Trigger line comes first, it is what the player reads first
}

/** The targeted tokens, shown at the bottom of an Action card (like the damage card). */
/** v0.0.258 (Lucas): the side of a card's targets, for the color of the target line: "ally" when all are on your side, "enemy" when none is, "" when mixed or unknown. */
export const targetSide = (targets, mine = 1) => {
  const ds = (targets ?? []).map(t => t?.disposition).filter(d => d !== undefined && d !== null);
  if (!ds.length) return "";
  if (ds.every(d => d === mine)) return "ally";
  if (ds.every(d => d !== mine)) return "enemy";
  return "";
};
/** v0.0.259 (Lucas): the card's targets as entries for the target line, each name once ("NPC ×2") with its side ("ally" / "enemy" / ""). */
export const targetEntries = (targets, mine = 1) => {
  const out = [];
  for (const t of targets ?? []) {
    const name = String(t?.name ?? "").trim(); if (!name) continue;
    const d = t?.disposition, side = d === undefined || d === null ? "" : d === mine ? "ally" : "enemy";
    const have = out.find(e => e.name === name && e.side === side);
    if (have) have.n++; else out.push({ name, side, n: 1 });
  }
  return out;
};
const entryOf = t => (typeof t === "string" ? { name: t, side: "", n: 1 } : { name: String(t?.name ?? ""), side: t?.side ?? "", n: Number(t?.n) || 1 });
/** The target line of a card: one target is a tag (colored by its side); several are a tag with the count and a small list under it, a dot per side. */
export const targetsRowHtml = (tokens, { retarget = false, side = "" } = {}) => {
  if (!tokens?.length && !retarget) return "";
  const es = (tokens ?? []).map(entryOf), total = es.reduce((a, e) => a + e.n, 0);
  const btn = retarget ? `<button type="button" class="tgt" data-twod12="retargetAction" aria-label="Target the selected tokens"><i class="fa-solid fa-bullseye"></i></button>` : "";
  const one = n => `${escAttr(n.name)}${n.n > 1 ? ` \u00d7${n.n}` : ""}`;
  if (!es.length) return `<div class="tline cardtargets"><span class="tname none"><i class="fa-solid fa-crosshairs"></i>No target</span>${btn}</div>`;
  const sd = side || (es.every(e => e.side === "ally") ? "ally" : es.every(e => e.side === "enemy") ? "enemy" : "");
  if (es.length === 1) return `<div class="tline cardtargets"><span class="tname${sd ? ` ${sd}` : ""}"><i class="fa-solid fa-crosshairs"></i>${one(es[0])}</span>${btn}</div>`;
  return `<div class="tline cardtargets many"><span class="tname${sd ? ` ${sd}` : ""}"><i class="fa-solid fa-crosshairs"></i>${total} targets</span>${btn}<ul class="tlist">${es.map(e => `<li${e.side ? ` class="${e.side}"` : ""}>${one(e)}</li>`).join("")}</ul></div>`;
};

/** "Speed 3" in Requirements: the creature needs at least that Speed. Returns a reason it can't, or "". */
/** Hands in use: every wielded weapon uses its hands, except Barehanded weapons (they use no hand). */
export const handsUsed = actor => (actor?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !w.system.traits?.has?.("barehanded")).reduce((n, w) => n + (w.system.hands ?? 1), 0);

/** Requirements are checked before the Action is used. Understood: "Speed 3", "free hand", "SR is at most N higher than yours" (and the old "Size is at most N higher"). */
export function requirementProblem(d, actor, target = null, opts = {}) {
  const req = String(d?.requirements ?? "");
  const m = req.match(/Speed\s*(?:of\s*)?(\d+)/i);
  if (m && (actor?.system?.moveSpeed ?? actor?.system?.speed ?? 0) < Number(m[1])) return `needs a Speed of at least ${m[1]}`;
  const sz = req.match(/(?:SR|Size) is at most (\d+) higher than yours/i);
  if (sz && target && (target.system?.size ?? 3) > (actor?.system?.size ?? 3) + Number(sz[1])) return `needs a target whose SR is at most ${sz[1]} higher than yours`;
  // Haul (v0.0.170): "Your Reach is 2 or more", "is at least 2 squares away" (opts.distance: the squares between the two creatures, when both are on the map).
  const rc = req.match(/Your Reach is (\d+) or more/i);
  if (rc && Math.max(1, Number(actor?.system?.reach) || 1) < Number(rc[1])) return `needs a Reach of ${rc[1]} or more`;
  const far = req.match(/at least (\d+) squares away/i);
  if (far && target && Number.isFinite(opts.distance) && opts.distance < Number(far[1])) return `needs a target at least ${far[1]} squares away (it is ${opts.distance})`;
  if (!opts.skipHands && /free hand/i.test(req) && handsUsed(actor) >= 2) return "needs a free hand";
  return "";
}

/** "1 Emanation within 10 sq." -> { shape, size, within }; v0.0.214: "Line 10" -> { shape: "line", size: 10, within: 0 }. */
export function parseArea(text) {
  const ln = String(text ?? "").trim().match(/^line\s+(\d+)$/i);
  if (ln) return { size: Number(ln[1]), shape: "line", within: 0 };
  const m = String(text ?? "").trim().match(/^(\d+)\s*(emanation|burst)(?:\s+within\s+(\d+)\s*sq\.?)?$/i);
  return m ? { size: Number(m[1]), shape: m[2].toLowerCase(), within: m[3] ? Number(m[3]) : 0 } : null;
}
/** The inline button that places the Area of an Action ("" when it has none). */
/** An Action's Area as the settings for placing it: { shape, distance, targets, self, keep, rounds, at }, or null without an Area. */
export function areaConfigOf(d) {
  const c = d?.areaCfg, set = c?.size > 0;
  const a = set ? { size: c.size, shape: c.shape || "emanation", within: c.within || 0 } : parseArea(d?.area);
  if (!a) return null;
  // v0.0.215 (Lucas, playtest 2): an Emanation with no Distance is always around its user (Ground Slam, not only Self Actions): shown, not placed.
  const onSelf = a.shape === "emanation" && !a.within && !c?.withinRange;
  const line = a.shape === "line";   // v0.0.214: a Line starts from you: no Distance
  return { shape: a.shape, distance: a.size, targets: c?.targets || "all", self: !!c?.center && !line, keep: !!c?.keep, rounds: c?.rounds || 0, at: onSelf ? "self" : "", withinRange: line ? "" : c?.withinRange || "", ht: c?.ht || "", ...(line ? { within: 0 } : {}) };
}

export const areaButton = d => {
  const c = d?.areaCfg, set = c?.size > 0;
  const a = set ? { size: c.size, shape: c.shape || "emanation", within: c.within || 0 } : parseArea(d?.area);
  if (!a) return "";
  // An Emanation with no "within" (no Distance) is centered on you: no placing needed (v0.0.215: not only Self Actions).
  const onSelf = a.shape === "emanation" && !a.within && !c?.withinRange;
  const opts = [a.shape, `distance:${a.size}`, `targets:${c?.targets || "all"}`, `self:${c?.center && a.shape !== "line" ? "yes" : "no"}`, c?.keep ? "keep:yes" : "", c?.rounds ? `rounds:${c.rounds}` : "", c?.ht ? `ht:${c.ht}` : "", onSelf ? "at:self" : "", set ? "quick:yes" : "", `label:${onSelf ? "Apply Area" : "Place Area"}`];
  return `@Template[${opts.filter(Boolean).join("|")}]`;
};
/** An Action that is a Talent: its category starts with "Talent" (Aim, Cut Through...). It goes in the Talents and Features tab, not only in Actions. */
export const isTalentAction = i => i?.type === "action" && /^talent/i.test(String(i.system?.category ?? "")) && !i.getFlag?.("twod12", "talentId") && !i.getFlag?.("twod12", "basic");
/** How many different creatures an Action's Target names ("Two creatures" → 2; "One creature", "All creatures in the Area" → 1). */
export function targetsNeeded(text) {
  const words = { two: 2, three: 3, four: 4, five: 5, six: 6 };
  const m = String(text ?? "").trim().match(/^(two|three|four|five|six|\d+)\s+(?:different\s+)?creatures?\b/i);
  if (!m) return 1;
  return words[m[1].toLowerCase()] ?? Math.max(1, parseInt(m[1], 10) || 1);
}

/** Size names by rank. */
export const SIZE_NAMES = ["", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];

/** The Frequency that counts: Default is Round for Weapon actions and none for the rest; "None" turns it off. */
/** The line on the left of a row: an Action, Talent or Feature with a Frequency has its color; the others a color of their kind. */
export const KIND_LINE = { talent: "#BA7517", feature: "#8a7650" };
export const lineColorFor = item => (effectiveFrequency(item?.system) ? cardColorFor(item.system) : (KIND_LINE[item?.type] ?? KIND_LINE.feature));

export const effectiveFrequency = d => {
  const f = d?.frequency ?? "";
  if (f === "none") return "";
  return f;   // the Weapon trait no longer means Round (each Action names its Frequency)
};

export const ATTR_KEYS = ["body", "mind", "appeal", "instinct"];
/** The attribute an Action rolls: its Body, Mind, Appeal or Instinct trait (the traits decide the roll). */
export const checkAttr = (d, attrs = null) => {
  const have = ATTR_KEYS.filter(k => d?.traits?.has?.(k));
  if (have.length <= 1 || !attrs) return have[0] ?? "";
  // More than one of the traits (Trip: Body and Instinct): the highest value is used.
  return have.reduce((best, k) => ((attrs[k] ?? 0) > (attrs[best] ?? 0) ? k : best), have[0]);
};

/** The Defense of an Action as text: "Body", or "Body or Instinct" when it is the attribute that was rolled. */
export function vsText(d, { src = null, fists = false, rolls = null } = {}) {
  if (d?.traits?.has?.("save") && d?.vs && d.vs !== "roll") return `${TWOD12.attributes[d.vs] ?? d.vs} Save`;   // a Save Action: "Instinct Save"
  if (d?.vs === "roll") return ATTR_KEYS.filter(k => d.traits?.has?.(k)).map(k => TWOD12.attributes[k]).join(" or ") || "the attribute rolled";
  if (d?.vs) return TWOD12.attributes[d.vs] ?? "";
  // Every Action that rolls has a Vs. entry (Versus): AD for Weapon Actions and Fists, WD for Power Actions,
  // the Defense of its Modifier for a Signature Action, and DC 13 for an Action that faces none of these.
  const rolled = rolls ?? (d?.versions ?? []).some(v => !v.noTiers);
  if (!d || !rolled) return "";
  const has = k => d.traits?.has?.(k) ?? false;
  if (has("split") && !has("weapon") && !has("magic")) return "AD (Weapon mode) or WD (Power mode)";
  if (has("handle") && !has("strike")) return "DC 13";   // handling things (Reload, Interact): no Defense to roll against
  if (String(d.distance ?? "").toLowerCase() === "self" && !has("area")) return "DC 13";   // an Action on yourself that rolls (Rimebrand): no Defense either (Whirlwind's area rolls against each creature)
  if (has("signature") && has("weapon")) return "AD";   // v0.0.181: a [Signature, Weapon] Action is a Weapon Action (the book's Smite)
  if (has("signature") && (has("power") || has("magic"))) return "WD";
  if (src?.kind === "signature") return src.from === "power" ? "WD" : "AD";
  if (has("signature")) return "AD or WD";
  if (has("weapon") || fists || src?.kind === "weapon") return "AD";
  if (has("magic") || src?.kind === "power") return "WD";
  return "DC 13";
}

/** "Body Check", "Weapon Modifier", "Power Modifier" (+ " vs. Body" when there is a Defense). */

/** Where an Action reaches: Reach, Self, the weapon's range, or any text such as "10/20/40". */
/**
 * An Action's Area line ("2 Emanation"), or "" (v0.0.176: the Area and the Distance are two lines). An older Area text written with its distance
 * ("1 Emanation within 10 sq.") gives only its shape here; distanceText gives the rest.
 */
export function areaText(d) {
  const area = String(d?.area ?? "").trim();
  return area.replace(/\s+within\s+.*$/i, "");
}

function weaponBand(v, weapon) {
  const m = String(v ?? "").trim().toLowerCase().match(/^your weapon's (normal|far|maximum) range$/);
  if (!m || !weapon?.system) return "";
  const parts = String(weaponRanges(weapon, weapon.parent?.system?.reach ?? 1).ranged ?? "").split("/").map(x => x.trim()).filter(Boolean);
  return parts[{ normal: 0, far: 1, maximum: 2 }[m[1]]] ?? "";
}
/** v0.0.334: the words a Distance stood for when distanceText read them as the weapon's number ("Your weapon's normal range"), else "": the ⓘ's tooltip. */
export function distanceNote(d, weapon = null) {
  const area = String(d?.area ?? "").trim(), within = area.match(/\s+within\s+(.*)$/i)?.[1] ?? "";
  const v = (area ? (String(d?.areaDistance ?? "").trim() || within) : "") || String(d?.distance ?? "").trim();
  return weaponBand(v, weapon) ? v.replace(/^your weapon's/i, "Your weapon's") : "";
}
export function distanceText(d, weapon = null) {
  // An Area Action's Distance (v0.0.176): how far its area can be placed (the Area settings, or an older "within" text: the limit that is enforced),
  // else its own Distance field.
  const area = String(d?.area ?? "").trim(), within = area.match(/\s+within\s+(.*)$/i)?.[1] ?? "";
  const placed = area ? (String(d?.areaDistance ?? "").trim() || within.replace(/^your weapon's/i, "Your weapon's")) : "";
  const v = placed || String(d?.distance ?? "").trim();
  if (!v) return "";
  // A Weapon Action shows the Range of the weapon it is made with (Distance: Weapon, or Reach on older cards): melee with Reach above 1 added,
  // ranged, or both for a Thrown weapon.
  const low = v.toLowerCase(), sp = t => String(t).split("/").join(" / ");
  // v0.0.334 (Lucas): "Your weapon's normal / far / maximum range" reads the weapon in use (its band of the ranged Range); distanceNote keeps the words
  const band = weaponBand(v, weapon);
  if (band) return band;
  if (weapon?.system && (low === "weapon" || (d?.traits?.has?.("weapon") && low === "reach"))) {
    const r = weaponRanges(weapon, weapon.parent?.system?.reach ?? 1);
    const wants = d?.traits?.has?.("melee") ? "melee" : d?.traits?.has?.("ranged") ? "ranged" : "";
    // v0.0.419 (Lucas, playtest 5, A4: "Distance: Reach" sent him to the sheet's Reach): an NPC's melee attack reads "Reach (X)"
    const npcOf = weapon.parent?.type === "npc" || d?.parent?.parent?.type === "npc";
    if (wants === "melee" && r.melee) return npcOf && !String(r.melee).includes("/") ? `Reach (${r.melee})` : sp(r.melee);
    if (wants === "ranged" && r.ranged) return `${sp(r.ranged)}${r.thrown ? " (thrown)" : ""}`;
    if (r.melee && r.ranged) return `${sp(r.melee)}, thrown ${sp(r.ranged)}`;
    if (r.melee || r.ranged) return sp(r.melee || r.ranged);
    if (weapon.system.range) return sp(weapon.system.range);   // a weapon with a Range but no Melee or Ranged property
  }
  if (low === "reach") { const a = d?.parent?.parent, n = Number(a?.system?.reach); return a?.type === "npc" && n > 0 ? `Reach (${n})` : "Reach"; }   // v0.0.419 (A4): an NPC's Reach (v0.0.421: NPCs only, as decided)
  if (low === "self") return "Self";
  if (low === "weapon") return "Weapon";
  return v;
}

/** Colors of the initiative groups. They follow the token disposition (Friendly PCs, Hostile NPCs, Neutral, Secret) and can be changed in the settings. */
export const GROUPS = [
  { disposition: 1, key: "friendly", label: "Friendly (PCs)", color: "#4caf50" },
  { disposition: -1, key: "hostile", label: "Hostile (NPCs)", color: "#d9534f" },
  { disposition: 0, key: "neutral", label: "Neutral (a third group)", color: "#e0b030" },
  { disposition: -2, key: "secret", label: "Secret (a fourth group)", color: "#9b6bd6" }
];
export function groupColor(combatant) {
  const d = combatant?.token?.disposition;
  const disp = d === undefined || d === null ? (combatant?.actor?.type === "character" ? 1 : -1) : d;
  const g = GROUPS.find(x => x.disposition === disp) ?? GROUPS[1];
  try { return game.settings.get("twod12", `group_${g.key}`) || g.color; } catch (e) { return g.color; }
}

/** A subtype code from a two-letter code ("Sl"), the generator's one-letter shorthand ("S") or a name ("slash"). */
export function subtypeCode(x) {
  const s = String(x ?? "").trim();
  if (!s) return "";
  const two = Object.keys(TWOD12.subtypes).find(k => k && k.toLowerCase() === s.toLowerCase());
  if (two) return two;
  if (s.length === 1) return TWOD12.subtypeLetters[s.toUpperCase()] ?? "";
  const byName = Object.entries(TWOD12.subtypes).find(([k, v]) => k && v.toLowerCase() === s.toLowerCase());
  return byName ? byName[0] : "";
}

/** The condition that makes all of a creature's Rolls Doomed ("Imperiled", "Squeezing", "Unconscious"), or "". */
export function doomStatus(actor) {
  const st = k => !!actor?.statuses?.has?.(k);
  return st("imperiled") ? "Imperiled" : st("squeezing") ? "Squeezing" : st("unconscious") ? "Unconscious" : "";
}

/** While Unconscious, Saves and Checks are Doomed, except the Body Check of a Dying creature and the Mind Check of a Shattered one. */
export function unconsciousDoom(actor, attrKey, kind = "Check") {
  if (actor?.statuses?.has?.("imperiled")) return true;   // Imperiled: all your Checks and Saves are Doomed
  if (actor?.statuses?.has?.("squeezing")) return true;   // Squeezing (v0.0.170): all your Rolls are Doomed
  if (!actor?.statuses?.has?.("unconscious")) return false;
  if (kind === "Check" && attrKey === "body" && actor.statuses.has("dying")) return false;
  if (kind === "Check" && attrKey === "mind" && actor.statuses.has("shattered")) return false;
  return true;
}

/* ------------------------------------------------------------------ Tags of a creature (a selection; the list is a world setting) */
export const tagSlug = s => String(s ?? "").trim().toLowerCase().replace(/\s+/g, "-");
/** An older creature stored its tags as text ("Undead, Beast"): the slugs of the names. */
export const migrateTags = v => [...new Set((Array.isArray(v) ? v : String(v ?? "").split(",")).map(tagSlug).filter(Boolean))];
/** The tags a creature can have, { slug: Label }, from the world setting (the starting list when it is not there). */
export function tagChoices() {
  let text = "";
  try { text = game.settings.get("twod12", "tagList"); } catch (e) { /* not registered */ }
  const names = String(text || TWOD12.defaultTags.join(", ")).split(",").map(x => x.trim()).filter(Boolean);
  return Object.fromEntries(names.map(n => [tagSlug(n), n]));
}
/** Does the creature have this tag? ("Unholy", case and spaces don't matter.) For abilities like "If the target has the Unholy tag...". */
export const hasTag = (actor, tag) => { const t = actor?.system?.tags; return !!t && (t.has ? t.has(tagSlug(tag)) : [...t].includes(tagSlug(tag))); };

/**
 * "As 1 AP", "As 2 AP, T3", "As Tier 2" at the start of a tier's text, written out: the text of the cell it points to (itself expanded),
 * then the rest ("As Tier 2, and the target is Vulnerable 1" -> "<Tier 2's text>, and the target is Vulnerable 1"). Chat cards and the roll dialog
 * show one Version, so a bare "As 1 AP." would point at a column they don't show. The sheet keeps the book's wording. Pure (the tests load it).
 */
export function expandAsText(text, versions, version, tier, depth = 0) {
  const t = String(text ?? "");
  const m = /^\s*As (?:(\d+)\s?AP(?:,\s?T(\d))?|Tier (\d))\b\s*[,.]?\s*(.*)$/is.exec(t);
  if (!m || depth > 4) return t;
  const ap = m[1] ? Number(m[1]) : version?.ap, n = m[3] ? Number(m[3]) : (m[2] ? Number(m[2]) : tier);
  const ref = (versions ?? []).find(v => v.ap === ap && (!version?.mode || !v.mode || v.mode === version.mode));
  if (!ref || (ref === version && n === tier)) return t;
  const target = expandAsText(ref[`x${n}`] ?? "", versions, ref, n, depth + 1).trim();
  if (!target || /^no effect\.?$/i.test(target)) return t;
  const rest = m[4].trim();
  if (!rest) return target;
  return `${target.replace(/[.\s]+$/, "")}, ${rest.replace(/^and\b/i, "and")}`;
}
