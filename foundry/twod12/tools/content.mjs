// The content of the system compendiums, in one place. Run `node tools/build-packs.mjs` to write packs/_source/*.json and compile packs/*.
// Text such as "1WB,1d4BH" and "greatsword: two-handed, melee, slash, 0/1d8/2d6" is read by the same code as the Action and Weapon generators.
import crypto from "node:crypto";

// The generators read Foundry globals when they load: give them stand-ins.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
globalThis.Combat = class {};
globalThis.CONFIG = {};
globalThis.game = { settings: { get: () => true } };
const { parseTierFull, convertEffects, parseWeaponText, weaponSystemData } = await import("../module/gen.mjs");

export const SYSTEM = "twod12";
export const PACKS = {
  classes: { label: "Classes and Species", types: ["species", "class"] },
  features: { label: "Features and Talents", types: ["feature", "talent"] },
  actions: { label: "Actions", types: ["action"] },
  weapons: { label: "Weapons and Armor", types: ["weapon", "armor"] },
  effects: { label: "Effects", types: ["effect"] },
  conditions: { label: "Conditions", types: ["effect"] },
  npcs: { label: "NPCs", documentName: "Actor", types: ["npc"] },
  pcs: { label: "Player Characters", documentName: "Actor", types: ["character"] }
};

const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** A stable 16 character id from a name, so the content keeps the same ids every time it is built. */
export const idOf = (kind, name) => {
  const h = crypto.createHash("sha1").update(`${kind}:${name}`).digest();
  return Array.from({ length: 16 }, (_, i) => B62[h[i] % 62]).join("");
};
const uuidOf = (pack, name) => `Compendium.${SYSTEM}.${pack}.Item.${idOf("Item", name)}`;

const docs = [];       // { pack, type, name, img, folder, system, flags }
const folders = [];    // { pack, name }
const add = (pack, type, name, img, system, folder = null) => docs.push({ pack, type, name, img, folder, system });

/* ------------------------------------------------------------------ helpers for Actions */
const fx0 = () => ({ all: [], t1: [], t2: [], t3: [] });
const version = (ap, t1, t2, t3, effects = "", extra = {}) => {
  const p = [t1, t2, t3].map(parseTierFull);
  return { ap, noTiers: false, t1: p[0].insts, t2: p[1].insts, t3: p[2].insts, x1: p[0].text, x2: p[1].text, x3: p[2].text, effects: convertEffects(effects), fx: fx0(), ...extra };
};
const noRoll = (ap, text, fxAll = []) => ({ ap, noTiers: true, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", effects: convertEffects(text), fx: { all: fxAll.map(u => ({ uuid: u, mode: "auto" })), t1: [], t2: [], t3: [] } });
const tiered = (v, fx) => ({ ...v, fx: { all: [], t1: [], t2: [], t3: [], ...Object.fromEntries(Object.entries(fx).map(([k, list]) => [k, list.map(u => ({ uuid: u, mode: "auto" }))])) } });

/* ------------------------------------------------------------------ Effects and Conditions */
const speedSetting = (mode, formula) => ({ type: "speed", speedMode: mode, speedFormula: formula });
const against = (boons, banes, any) => ({ type: "boonbane", against: true, boons, banes, all: [], any, none: [] });
const cond = (name, img, description, settings, extra = {}) => add("conditions", "effect", name, img, { isCondition: true, duration: { type: "", rounds: 1 }, description, settings, ...extra }, null);
cond("Empowered", "icons/svg/upgrade.svg", "<p>Empowered N adds N to every die of your damage. Only the highest Empowered value applies, and the Enfeebled value is taken from it.</p>", [], { valued: true });
cond("Enfeebled", "icons/svg/degen.svg", "<p>Enfeebled N subtracts N from every die of your damage, but each die still deals at least 1. Only the highest Enfeebled value applies, and it is taken from the Empowered value.</p>", [], { valued: true });
cond("Hindered", "icons/svg/downgrade.svg", "<p>Your Speed is halved, rounded down.</p>", [speedSetting("override", "floor(speed/2)")]);
cond("Immobilized", "icons/svg/net.svg", "<p>You can't use Move Actions or Evade. Unless otherwise specified, you can remove Immobilized by using an Interact (1 AP) Action.</p>", [speedSetting("override", "0")]);
cond("Leaning", "icons/svg/eye.svg", "<p>You calculate cover from one of your corners instead of the center, and your own cover is reduced by 1 level (Total → High → Medium → Low → none: leaning out of Total cover, you can be targeted). Click a corner of your square on the map to lean toward it: your token peeks out a little past it, unless a wall is in the way. It ends at the end of your turn, or when you stop Leaning (at any time on your turn, at no cost).</p>", []);
cond("Prone", "icons/svg/falling.svg", "<p>Melee Actions against you gain 1 boon, and Ranged Actions against you suffer 1 bane. You can't Evade. The only [Move] Actions you can use are Crawl and Stand.</p>", [against(1, 0, ["melee"]), against(0, 1, ["ranged"])]);

add("effects", "effect", "Hindered (until Move)", "icons/svg/downgrade.svg", { duration: { type: "rounds", rounds: 1 }, expireOn: ["move"], description: "<p>For 1 round, the creature is Hindered until they use a Move Action. The effect lasts through that Move Action and ends once it is resolved.</p>", settings: [speedSetting("override", "floor(speed/2)")] }, "Conditions");
const coldSetting = (dmg, tiers, text = "", fxUuid = "") => ({ type: "bonusdamage", dmg, dmgPool: "M", dmgSub: "Co", tiers, text, fxUuid, all: ["strike"], any: [], none: [] });
add("effects", "effect", "Rimebrand (1d6)", "icons/svg/frozen.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, expireOn: ["strike"], description: "<p>For 1 round, your next Strike deals +1d6 Cold.</p>", settings: [coldSetting("1d6", ["t1", "t2", "t3"])] }, "Lesser Blessing");
add("effects", "effect", "Rimebrand (1d8)", "icons/svg/frozen.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, expireOn: ["strike"], description: "<p>For 1 round, your next Strike deals +1d8 Cold and causes Hindered (EoT).</p>", settings: [coldSetting("1d8", ["t1", "t2", "t3"]), coldSetting("", ["t2", "t3"], "Hindered (EoT)", uuidOf("conditions", "Hindered"))] }, "Lesser Blessing");

const aimSetting = (n, all = ["ranged", "strike", "weapon"]) => ({ type: "boonbane", boons: n, banes: 0, all, any: [], none: [] });
for (const n of [1, 2]) add("effects", "effect", `Precise Aim (${n} Boon${n === 1 ? "" : "s"})`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "shot", "strike", "weapon"], expireAll: true, description: `<p>${n} boon${n === 1 ? "" : "s"} on your next [Ranged, Shot, Strike, Weapon] Action.</p>`, settings: [aimSetting(n, ["ranged", "shot", "strike", "weapon"])] }, "Sharpshooter");

const bloodlustFrom = ["strike", "melee", "ranged", "weapon", "magic", "divine", "focus", "handle", "move"];
cond("Vulnerable", "icons/svg/hazard.svg", "<p>Actions against you gain as many boons as the value of Vulnerable (Vulnerable 2: 2 boons). Only the highest Vulnerable value applies.</p>", [{ ...against(1, 0, []), byValue: true }], { valued: true });
cond("Slowed", "icons/svg/stoned.svg", "<p>Slowed always has a value. You regain that many fewer AP at the start of your turn (Slowed 2: you regain 3), and your most AP is lowered by the value too. You don't lose AP when you become Slowed, only when you regain AP. Desperate, Dying and Shattered make you Slowed 1, or 1 more (to at most 3), while they last. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Quickened", "icons/svg/lightning.svg", "<p>Quickened always has a value. Your most AP, and the AP you regain at the start of your turn, rise by that much (Quickened 2: you regain 7). You don't gain AP when you become Quickened, only when you regain AP. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Imperiled", "icons/svg/hazard.svg", "<p>You barely avoided a Deadly Hazard (hanging from a ledge, at the lip of a lava pit...). All your Checks and Saves are Doomed, and you are Vulnerable 3. At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled; you are Slowed 1 for that turn. A creature can help you get to safety with the Interact Action (1 AP, Handle).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 3, valued: true }] });
cond("Squeezing", "icons/svg/net.svg", "<p>You stopped moving while squeezing through a space one rank smaller than you: you don't fit completely in the space you are in. All your Rolls are Doomed and you are Vulnerable equal to half your level (rounded up) until you move to a space where you fit completely. Each square you move while squeezing counts as Difficult Terrain. The GM applies this condition (it is not detected on the map).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 1, valued: true, mode: "halfLevel" }] });
add("effects", "effect", "Bloodlust", "icons/svg/blood.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain 1 boon, and you take 1 bane on Saves.</p>", settings: [
  { type: "boonbane", boons: 1, banes: 0, all: ["melee", "weapon"], any: [], none: [] },
  { type: "damagestep", empowered: 1, all: ["melee", "weapon"], any: [], none: [] },
  { type: "boonbane", boons: 0, banes: 1, all: [], any: [], none: [], from: bloodlustFrom }
] }, "Talents");

add("effects", "effect", "Aim (1 Boon)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "strike", "weapon"], expireAll: true, description: "<p>1 boon on your next Ranged Strike Weapon Action. Without a duration, the effect lasts until the end of your turn: if you don't make that Action, it is wasted.</p>", settings: [aimSetting(1)] }, "Aim");
const grant = boons => ({ type: "grant", grantAction: "Weapon Attack", grantCount: 2, grantAp: 0, grantDistinct: true, boons, banes: 0 });
add("effects", "effect", "Double Shot (2 Attacks)", "icons/svg/combat.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>You can use Weapon Attack twice, each time against a different creature. These uses are free and don't count toward Weapon Attack's Frequency or the 3 Strikes of your turn.</p>", settings: [grant(0)] }, "Sharpshooter");

/* ------------------------------------------------------------------ Actions */
// P1 (book 2026-10-29; v0.0.181): Smite and Lay On Hands are the Paladin's Hallmark Action (choose one).
add("effects", "effect", "Smite (+1 Defense)", "icons/svg/shield.svg", { duration: { type: "rounds", rounds: 1 }, description: "<p>+1 Defense for 1 round (Smite).</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] }, "Paladin");
add("effects", "effect", "Lay On Hands (Holy Strike)", "icons/svg/regen.svg", { selfApplied: true, duration: { type: "", rounds: 1 }, expireOn: ["strike"], description: "<p>Your next [Strike] Action deals an extra [M] 0/2d8/2d8 Ho (Tier 2 and 3).</p>", settings: [{ type: "bonusdamage", dmg: "2d8", dmgPool: "M", dmgSub: "Ho", tiers: ["t2", "t3"], all: ["strike"], any: [], none: [] }] }, "Paladin");
const smiteLight = n => `The target sheds Bright light in a [${n}Emanation 1/round] and takes 1 Bane when they try to hide, for 1 round.`;
const smiteDef = `You or one ally in the light gain @Effect[${uuidOf("effects", "Smite (+1 Defense)")}]{+1 Defense for 1 round}.`;
add("actions", "action", "Smite", "icons/svg/sun.svg", {
  category: "Divine Power", level: 1, traits: ["divine", "signature", "strike", "weapon"], targets: "One creature", distance: "weapon", frequency: "round",
  versions: [
    version(1, "1WB", "1WB,1d4MH", "1WB,1d6MH", smiteLight(1)),
    version(2, "1WB,1d6MH", "1WB,1d10MH", "1WB,2d8MH", `${smiteLight(2)} ${smiteDef}`),
    version(3, "1WB,1d6MH", "1WB,1d10MH", "1WB,2d8MH", `${smiteLight(2)} ${smiteDef} You or one ally in the light gain @Guard[1d8+mod]{Guard 1d8 + [Mod]}. You choose who gains the Defense and who gains the Guard separately: the same creature or two different ones.`)
  ]
}, "Paladin");
add("actions", "action", "Lay On Hands", "icons/svg/regen.svg", {
  category: "Divine Power", level: 1, traits: ["divine", "focus"], frequency: "round", targets: "One willing creature", distance: "reach",
  versions: [noRoll(1, "The target can use 1 Rally Point."),
    noRoll(2, "As 1 AP (the target can use 1 Rally Point), and your next [Strike] Action deals an extra [M] 0/2d8/2d8 Ho.", [uuidOf("effects", "Lay On Hands (Holy Strike)")]),
    noRoll(3, "As 2 AP (your next [Strike] Action deals an extra [M] 0/2d8/2d8 Ho), but the target can use 2 Rally Points.", [uuidOf("effects", "Lay On Hands (Holy Strike)")])]
}, "Paladin");
add("actions", "action", "Rimebrand (Cold)", "icons/svg/frozen.svg", {
  category: "Lesser Blessing", level: 0, traits: ["divine", "magic", "self"], frequency: "round", distance: "self",
  versions: [tiered(version(1, "", '"For 1 round, your next Strike deals +[M] 1d6 Co."', '"For 1 round, your next Strike deals +[M] 1d8 Co and causes Hindered (EoT)."'), { t2: [uuidOf("effects", "Rimebrand (1d6)")], t3: [uuidOf("effects", "Rimebrand (1d8)")] })]
}, "Talents");
// A1 (book 2026-10-29; v0.0.181): Double Shot and Rolling Shot are the Archer's Hallmark Action (choose one).
add("actions", "action", "Double Shot", "icons/svg/combat.svg", {
  category: "Sharpshooter", level: 1, traits: ["shot", "strike"], frequency: "round", targets: "Two creatures", distance: "",
  versions: [noRoll(2, "You make two [Ranged, Shot] Weapon Attacks (1A), each against a different creature.", [uuidOf("effects", "Double Shot (2 Attacks)")]),
    noRoll(3, "@Move[evade|distance:1], then as 2 AP (two [Ranged, Shot] Weapon Attacks (1A), each against a different creature).", [uuidOf("effects", "Double Shot (2 Attacks)")])]
}, "Archer");
for (const [n, d] of [[2, "1d6"], [3, "2d6"]]) add("effects", "effect", `Rolling Shot (+${d} Pi)`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["strike"], description: `<p>Your next [Ranged, Shot] Weapon Attack this turn deals an extra [B] ${d} Pi (Rolling Shot, ${n} AP).</p>`, settings: [{ type: "bonusdamage", dmg: d, dmgPool: "B", dmgSub: "Pi", tiers: ["t2", "t3"], all: ["ranged", "shot", "strike"], any: [], none: [] }] }, "Archer");
const wa = "@Use[Weapon Attack|label:[Ranged, Shot] Weapon Attack (1A)]";
add("actions", "action", "Rolling Shot", "icons/svg/target.svg", { category: "Sharpshooter", level: 1, traits: ["ranged", "shot", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon", versions: [
  noRoll(1, `@Move[evade|distance:1], then make a ${wa}.`),
  noRoll(2, `@Move[evade|distance:2], then make a ${wa} that deals an extra [B] 1d6 Pi.`, [uuidOf("effects", "Rolling Shot (+1d6 Pi)")]),
  noRoll(3, `@Move[evade|distance:3], then make a ${wa} that deals an extra [B] 2d6 Pi.`, [uuidOf("effects", "Rolling Shot (+2d6 Pi)")])] }, "Archer");
add("actions", "action", "Precise Aim", "icons/svg/eye.svg", {
  category: "Sharpshooter", level: 1, traits: ["focus", "self"], frequency: "round", distance: "self",
  versions: [noRoll(1, "You gain 1 boon on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (1 Boon)")]), noRoll(2, "You gain 2 boons on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (2 Boons)")])]
}, "Archer");
add("actions", "action", "Reaping Sweep", "icons/svg/sword.svg", {
  category: "Weapon Technique", level: 0, traits: ["strike", "melee", "weapon"], targets: "One creature", distance: "weapon", frequency: "round",
  versions: [version(1, "AtS", '1d10S,"Cleave 1"', '2d6S,"Cleave 2"')]
}, "Weapon Techniques");
add("actions", "action", "Lock & Loose", "icons/svg/target.svg", {
  category: "Weapon Technique", level: 0, traits: ["ranged", "shot", "strike", "weapon"], targets: "One creature", distance: "weapon", frequency: "round",
  versions: [(() => {
    const v = tiered(version(1, "AtBPi", '1d4+2BPi,"x"', '1d10BPi,"Immobilized"'), { t2: [uuidOf("effects", "Hindered (until Move)")] });
    v.x2 = "For 1 round, the creature is Hindered until they use a Move Action.";   // plain text: the Effect applies it, not a Condition button
    return v;
  })()]
}, "Weapon Techniques");
add("actions", "action", "Aim", "icons/svg/target.svg", {
  frequency: "atwill",
  category: "Talent", level: 1, traits: ["focus", "self"], distance: "self",
  versions: [noRoll(1, "If your next Action is a [Ranged, Strike, Weapon], you gain a boon.", [uuidOf("effects", "Aim (1 Boon)")])]
}, "Talents");
add("actions", "action", "Ricochet", "icons/svg/target.svg", {
  frequency: "atwill",
  category: "Talent", level: 1, traits: ["focus", "self"], distance: "self",
  versions: [noRoll(1, "If your next Action is a [Ranged, Strike, Weapon], you can shoot at a creature by shooting at a surface first. The projectile then goes from the surface to the creature, and you calculate Line of Effect and Cover from the center of the surface. You calculate the total distance the projectile travels: if you shoot at a surface 5 squares from you and the target is within 6 squares of the surface, that is an 11-square shot. You must still sense the creature to target them.")]
}, "Talents");
add("actions", "action", "Opportunity Attack", "icons/svg/combat.svg", {
  category: "Talent", level: 1, traits: [], frequency: "atwill", reaction: true, reactionKind: "interrupt", targets: "The triggering creature", trigger: "A creature within 3 squares would leave a square during a Move Action or uses the Stand Action",
  modifiers: [{ spec: "Weapon Attack", when: "outOfTurn", critical: "You disrupt the triggering Action before it happens.", effects: "" }],
  versions: [noRoll(1, "You can make a Weapon Attack (1A) against the triggering creature, as long as your weapon can target them: @Use[Weapon Attack|label:Weapon Attack (1A)]")]
}, "Talents");

/* ------------------------------------------------------------------ Martial Talents */
add("actions", "action", "Pummel", "icons/svg/combat.svg", {
  category: "Brawler", level: 1, traits: ["melee", "strike", "weapon"], frequency: "atwill", targets: "One creature", distance: "weapon", requirements: "You have a free hand.",
  versions: [version(1, "AtBBl", "1d4BBl", "1d6BBl")]
}, "Talents");
docs[docs.length - 1].flags = { twod12: { fistsOnly: true } };   // Pummel uses only the Fists (v0.0.169)
add("actions", "action", "Leg Sweep", "icons/svg/combat.svg", {
  category: "Weapon Technique", level: 0, traits: ["melee", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon", requirements: "You have a free hand.",
  versions: [version(1, "1d4BBl", '1d6BBl,"@Use[Pummel|label:Pummel (1A)]"', '2d4BBl,"@Use[Pummel|label:Pummel (1A)]"')]
}, "Weapon Techniques");
docs[docs.length - 1].flags = { twod12: { fistsOnly: true } };
add("actions", "action", "Cut Through", "icons/svg/sword.svg", {
  category: "Talent", level: 1, traits: ["melee", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
  setup: "Evade 2 (@Move[evade|distance:2|terrain:ignore]). During this Evade you can move through the space of any creature (you can't end in one), and you ignore Difficult Terrain.",
  versions: [(() => { const v = version(2, "AtB", "1WB", "1WB,2B"); v.critical = "@Use[Relocate|nohandle:yes|label:Relocate (1A)] the target, ignoring the Handle trait."; return v; })()]
}, "Talents");
add("actions", "action", "Whirlwind", "icons/svg/sword.svg", {
  category: "Talent", level: 1, traits: ["area", "melee", "self", "strike", "weapon"], frequency: "encounter", targets: "All creatures in the Area", areaCfg: { size: 1, shape: "emanation", within: 0, targets: "all", center: false, keep: false, rounds: 0 }, distance: "",
  versions: [version(2, "AtB", "1WB,1B", "1WB,3B")]
}, "Talents");
add("actions", "action", "Bloodlust", "icons/svg/blood.svg", {
  category: "Talent", level: 1, traits: ["self"], frequency: "encounter", distance: "self",
  versions: [noRoll(1, "For 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain 1 boon, and you take 1 bane on Saves.", [uuidOf("effects", "Bloodlust")])]
}, "Talents");

/* ------------------------------------------------------------------ Features and Talents */
add("features", "feature", "Divine Power", "icons/svg/angel.svg", { category: "Paladin Feature", level: 1, description: "<p>When you deal Holy damage to a creature with the Profane Tag, that creature is Enfeebled 1 (EoT).</p>", settings: [{ type: "ondamage", trigSub: "Ho", trigTag: "Profane", fxUuid: uuidOf("effects", "Divine Power (Enfeebled)") }] });
add("features", "feature", "Divine Connection", "icons/svg/aura.svg", { category: "Paladin Feature", level: 1, talents: 2, description: "<p>Select 1 Talent and 1 Talent with the Divine trait. (Retired in the rules; kept here to test Talent slots.)</p>" });
add("features", "feature", "Sharpshooter", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>Choose your Hallmark Action: <b>Double Shot</b> or <b>Rolling Shot</b>. Choose one Projectile weapon, such as a bow or a crossbow: you start with <b>3 Mastery</b> with it. Your [Shot] Actions don't take the Bane for targeting a creature Engaged with a creature other than you.</p>" });
add("features", "talent", "Lesser Blessing", "icons/svg/holy-shield.svg", { category: "Talent", level: 1, traits: ["divine", "magic"], description: "<p>Pick one type of damage related to a god you follow. You gain the Action for that damage.</p>", choiceLabel: "Choose a blessing", choiceCount: 1, choiceOptions: [uuidOf("actions", "Rimebrand (Cold)")] });

add("features", "talent", "Heavy Blows", "icons/svg/sword.svg", { category: "Talent", level: 1, description: "<p>When a [Melee, Strike, Weapon] Action you make with a Two-handed weapon deals damage, it deals 1 more. (Not automated: add the 1 by hand.)</p>" });
add("features", "talent", "Battering Charge", "icons/svg/thrust.svg", { category: "Talent", level: 1, description: "<p>When you use Charge, your Speed counts as 2 higher for its movement, and its Weapon Attack (1A) is Empowered 1.</p>" });
add("features", "talent", "Brawler", "icons/svg/combat.svg", { category: "Talent", level: 1, description: "<p>You gain the Pummel Action. Your Fists don't have the Non-threatening property: you can flank with them.</p>", actions: [uuidOf("actions", "Pummel")] });
docs[docs.length - 1].flags = { twod12: { fistsThreaten: true } };
add("features", "talent", "Kickboxer", "icons/svg/combat.svg", { category: "Talent", level: 1, requirements: "Brawler.", description: "<p>Pummel gains a Weapon Technique: Leg Sweep.</p>", actions: [uuidOf("actions", "Leg Sweep")] });

/* ------------------------------------------------------------------ Weapons */
const weapon = (text, img, actions = []) => {
  const w = parseWeaponText(text);
  if (w.problems.length) throw new Error(`${text}: ${w.problems.join("; ")}`);
  add("weapons", "weapon", w.name, img, { ...weaponSystemData(w), actions });
};
weapon("greatsword: two-handed, melee, slash, 0/1d8/2d6", "icons/svg/sword.svg", [uuidOf("actions", "Reaping Sweep")]);
weapon("crossbow: projectile, reload, two-handed, pierce, ranges 10/20/40, 0/1d4+2/1d10+2", "icons/svg/target.svg", [uuidOf("actions", "Lock & Loose")]);

/* ------------------------------------------------------------------ Armor (generic for now: named armors and properties are still open in the book) */
const armorDoc = (name, category, description) => add("weapons", "armor", name, "icons/svg/shield.svg", { description: `<p>${description}</p>`, category, bonus: 0, ward: 0, properties: "", worn: false }, "Armor");
armorDoc("Light Armor", "light", "Armor 12 (11 + 1). Needs Light Armor Training or better.");
armorDoc("Medium Armor", "medium", "Armor 13 (11 + 2). Needs Medium Armor Training or better.");
armorDoc("Heavy Armor", "heavy", "Armor 14 (11 + 3). Rare. Needs Heavy Armor Training.");

/* ------------------------------------------------------------------ Species, Classes, Archetypes */
const sp = (name, attrs, pickTwo, bodyMod, mindMod, speed, steadiness = 0) => add("classes", "species", name, "icons/svg/mystery-man.svg", { attributes: attrs, pickTwo, bodyMod, mindMod, speed, reach: 1, steadiness });   // no Ward value since v0.0.162 (Ward Defense = 11 + Power Modifier)
sp("Human", { body: 0, mind: 0, appeal: 0, instinct: 0 }, true, 3, 4, 5);
sp("Dwarf", { body: 1, mind: 1, appeal: -1, instinct: 1 }, false, 5, 3, 4, 1);
sp("Elf", { body: -1, mind: 1, appeal: 1, instinct: 1 }, false, 1, 5, 6);
add("classes", "class", "Paladin", "icons/svg/angel.svg", {
  description: "<p>A holy warrior.</p>", choiceA: ["body", "appeal"], choiceB: ["mind", "instinct"], bodyMult: 4, mindMult: 4, rallyMod: 6, speedMod: 0,
  // P1 (v0.0.181): the book's level list in today's structure (each Feature carries its level; C2 brings the new class window).
  weaponAttrs: ["body", "appeal"], magicAttrs: ["mind", "appeal"], armorTraining: "heavy", features: ["Divine Power", "Font of Mercy", "Hallmark Action", "Talent (Level 1)", "Encounter Pick", "Escalation Passive", "Escalation Active", "Talent (Level 2)", "Daily Pick", "Escalation Passive (Level 3)"].map(n => ({ uuid: uuidOf("features", n), level: 1 }))
});
add("classes", "class", "Archer", "icons/svg/target.svg", {
  description: "<p>An Archer fights from a distance.</p>", choiceA: ["body", "instinct"], choiceB: ["mind", "appeal"], bodyMult: 3, mindMult: 2.5, rallyMod: 5,
  weaponAttrs: ["instinct", "body"], magicAttrs: ["mind", "appeal"], armorTraining: "medium", speedMod: 1,
  // A1 (v0.0.181): the book's level list in today's structure (each Feature carries its level; C2 brings the new class window).
  features: ["Sharpshooter", "Marked Quarry", "Archer Hallmark Action", "Talent (Level 1)", "Archer Escalation Passive", "Archer Escalation Active", "Talent (Level 2)", "Archer Encounter Pick", "Archer Daily Pick", "Archer Escalation Passive (Level 3)"].map(n => ({ uuid: uuidOf("features", n), level: 1 }))
});

/* ------------------------------------------------------------------ NPCs (Actors, with their items inside) */
const { basicItemData, BASIC_ACTIONS } = await import("../module/basic.mjs");
const { fistsItemData } = await import("../module/fists.mjs");
const actors = [];
const embedded = (actorName, type, name, img, system, flags = {}) => ({ _id: idOf("Item", `${actorName}:${name}`), name, type, img, system, flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } });
const npcWeapon = (actorName, text, img) => { const w = parseWeaponText(text); if (w.problems.length) throw new Error(`${text}: ${w.problems.join("; ")}`); return embedded(actorName, "weapon", w.name, img, { ...weaponSystemData(w), wielded: true }); };
const npcAction = (actorName, name, img, system, flags = {}) => embedded(actorName, "action", name, img, system, flags);
// The Bestiary (v0.0.163): a role and ratings. By default its Weapon Attribute is High, the others Medium, Appeal Low (Appeal Medium when Appeal is its Weapon Attribute).
const npc = ({ name, img, role, weaponAttribute, powerAttribute = "mind", ratings = {}, speed = 5, extra = [] }) => {
  const r = { body: "medium", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "medium", [weaponAttribute]: "high", ...ratings };
  const basics = Object.keys(BASIC_ACTIONS).filter(k => k !== "rally").map(k => { const d = basicItemData(k); return embedded(name, "action", d.name, d.img, d.system, d.flags); });
  actors.push({ name, img, system: { level: 1, role, speed, weaponAttribute, powerAttribute, ratings: r, useEscalation: role === "elite" }, items: [...extra, ...basics, (() => { const f = fistsItemData(), e = embedded(name, "weapon", f.name, f.img, f.system, f.flags); e._id = idOf("Item", `${name}:weapon:Fists`); return e; })()] });
};
const sword = "shortsword: melee, slash, 0/1d6/2d4";

{
  // Two minions that fight differently: the Archer keeps its distance, the Swordsman closes in.
  const n = "Skeleton Archer", bow = npcWeapon(n, "bone shortbow: ranged, pierce, range 8/16/32, 0/1d6/1d8", "icons/svg/target.svg");
  npc({ name: n, img: "icons/svg/skull.svg", role: "minion", weaponAttribute: "instinct",
    extra: [bow,
      npcAction(n, "Suppressing Shot", "icons/svg/target.svg", { category: "Skeleton", level: 0, traits: ["strike", "ranged", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
        versions: [(() => { const v = tiered(version(1, "AtB", "1WB", "1WB"), { t3: [uuidOf("effects", "Hindered (until Move)")] }); v.x3 = "For 1 round, the creature is Hindered until they use a Move Action."; return v; })()] }, { twod12: { weaponId: bow._id } }),
      npcAction(n, "Deadeye Shot", "icons/svg/eye.svg", { category: "Skeleton", level: 0, traits: ["strike", "ranged", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
        versions: [version(2, "AtB", "1WB,1d6BP", "1WB,2d6BP")] }, { twod12: { weaponId: bow._id } }),
      npcAction(n, "Skitter Back", "icons/svg/wing.svg", { category: "Skeleton", level: 0, traits: [], frequency: "round", reaction: true, targets: "", trigger: "A creature ends a Move Action within 1 of you.",
        versions: [noRoll(1, "You can Evade 2: @Move[evade|distance:2]")] })] });
}
{
  const n = "Skeleton Swordsman", sword = npcWeapon(n, "rusty shortsword: melee, slash, 0/1d6/2d4", "icons/svg/sword.svg");
  npc({ name: n, img: "icons/svg/skull.svg", role: "minion", weaponAttribute: "body",
    extra: [sword,
      npcAction(n, "Lunging Cut", "icons/svg/sword.svg", { category: "Skeleton", level: 0, traits: ["strike", "melee", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
        setup: "Advance up to 2 (@Move[advance|distance:2]).", versions: [version(2, "AtB", "1WB,1d6BS", "1WB,1d8BS")] }, { twod12: { weaponId: sword._id } }),
      npcAction(n, "Shield Bash", "icons/svg/shield.svg", { category: "Skeleton", level: 0, traits: ["strike", "melee", "body"], frequency: "round", targets: "One creature", distance: "reach", vs: "body",
        versions: [version(1, '"No effect."', "1d4BBl", '1d4BBl,"Pushed 1"')] }),
      npcAction(n, "Brittle Guard", "icons/svg/shield.svg", { category: "Skeleton", level: 0, traits: [], frequency: "round", reaction: true, targets: "", trigger: "A creature uses a Melee Strike against you.",
        versions: [noRoll(1, "You Evade 1 before the Action happens: @Move[evade|distance:1]")] })] });
}

npc({ name: "Goblin Skirmisher", img: "icons/svg/mystery-man.svg", role: "grunt", weaponAttribute: "instinct",
  extra: [npcWeapon("Goblin Skirmisher", "dagger: melee, pierce, 0/1d4/1d6+1", "icons/svg/dagger.svg"),
    npcAction("Goblin Skirmisher", "Nick and Slip", "icons/svg/combat.svg", { category: "Goblin", level: 0, traits: ["strike", "melee", "weapon"], targets: "One creature", distance: "weapon",
      versions: [version(1, "", "1WB", "1WB,1d4BP"), version(2, "AtB", "1WB,1d4BP", "1WB,1d6BP", "Evade 1 (T3)")] })] });

npc({ name: "Roadside Bandit", img: "icons/svg/mystery-man.svg", role: "standard", weaponAttribute: "body",
  extra: [npcWeapon("Roadside Bandit", "rusty shortsword: melee, slash, 0/1d6/2d4", "icons/svg/sword.svg"),
    npcAction("Roadside Bandit", "Ruthless Cut", "icons/svg/combat.svg", { category: "Bandit", level: 0, traits: ["strike", "melee", "weapon"], targets: "One creature", distance: "weapon",
      versions: [version(2, "AtB", "1WB,1d6BS", "1WB,2d6BS"), version(3, "AtB", "1WB,2d6BS", "1WB,3d6BS", "Hindered (T3)")] })] });

npc({ name: "Dire Boar", img: "icons/svg/pawprint.svg", role: "standard", weaponAttribute: "body",
  extra: [npcWeapon("Dire Boar", "tusks: melee, pierce, 0/1d6/2d6", "icons/svg/pawprint.svg"),
    npcAction("Dire Boar", "Gore Rush", "icons/svg/combat.svg", { category: "Boar", level: 0, traits: ["strike", "melee", "weapon"], targets: "One creature", distance: "weapon",
      versions: [version(2, "AtB", '1WB,"Pushed 1"', '1WB,1d6BB,"Pushed 2"'), version(3, "AtB", '1WB,1d6BB,"Pushed 2"', '1WB,2d6BB,"Pushed 4"')] })] });

{
  const n = "Skeleton Captain", greatsword = npcWeapon(n, "greatsword: two-handed, melee, slash, 0/1d8/2d6", "icons/svg/sword.svg");
  const sweep = docs.find(d => d.name === "Reaping Sweep");
  npc({ name: n, img: "icons/svg/skull.svg", role: "elite", weaponAttribute: "body",
    extra: [greatsword,
      npcAction(n, "Reaping Sweep", sweep.img, JSON.parse(JSON.stringify(sweep.system)), { twod12: { weaponId: greatsword._id } }),
      npcAction(n, "Bone Verdict", "icons/svg/combat.svg", { category: "Captain", level: 0, traits: ["strike", "melee", "weapon"], targets: "One creature", distance: "weapon",
        versions: [version(2, "AtB", "1WB,1d6BS", "1WB,1d10BS"), version(3, "AtB", "1WB,1d8BS", "1WB,2d8BS")] }),
      npcAction(n, "Rattle of Command", "icons/svg/aura.svg", { category: "Captain", level: 0, traits: ["focus"], frequency: "round", distance: "3", versions: [noRoll(1, "Each ally within 3 can Evade 2.")] })] });
}
actors.forEach(a => { a.system.level = 1; });

/* ------------------------------------------------------------------ The Paladin (Rounds 11 and 12 of the rules) */
// A version made from a damage text and a free text for each Tier (the damage as the card's dice, the text as its words).
const vt = (ap, tiers, effects = "", extra = {}) => {
  const p = tiers.map(([d, t]) => { const r = parseTierFull(d || ""); return { insts: r.insts, text: [r.text, t ? convertEffects(t) : ""].filter(Boolean).join(" ") }; });
  return { ap, noTiers: false, t1: p[0].insts, t2: p[1].insts, t3: p[2].insts, x1: p[0].text, x2: p[1].text, x3: p[2].text, effects: convertEffects(effects), fx: fx0(), ...extra };
};
const FX = (name, img, system) => add("effects", "effect", name, img, system, "Paladin");
const nod = { all: [], any: [], none: [] };
const dur = (type, rounds = 1) => ({ type, rounds });

// Effects the Paladin's cards apply
FX("Divine Power (Enfeebled)", "icons/svg/degen.svg", { duration: dur("eot"), description: "<p>Enfeebled 1 (EoT): subtract 1 from every die of your damage.</p>", settings: [{ type: "damagestep", enfeebled: 1, ...nod }] });
FX("Aura of Protection (+1 Defense)", "icons/svg/shield.svg", { duration: dur(""), description: "<p>+1 Defense while you are inside the Aura of Protection.</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] });
FX("Divine Vigil (Boon against Fear)", "icons/svg/aura.svg", { duration: dur(""), description: "<p>1 boon on Saves against [Fear] Actions, while you are inside Divine Vigil's Aura.</p>", settings: [{ type: "boonbane", boons: 1, banes: 0, all: ["__save"], any: [], none: [], from: ["fear"] }] });
// P1 (v0.0.181): Divine Surge marks an enemy (the ally's extra damage is a button on the mark); Aura of Protection lasts the encounter.
FX("Divine Surge", "icons/svg/sun.svg", { duration: dur("rounds"), description: "<p>For 1 round, the next time an ally deals damage to this creature, they deal an extra @Damage[1d8[mind,holy]]{[M] 1d8 Ho} (Divine Surge). Then remove this mark.</p>", settings: [] });
FX("Aura of Protection", "icons/svg/aura.svg", { selfApplied: true, duration: dur(""), description: "<p>An Aura 2 around you until the end of the encounter: you and allies inside gain +1 Defense.</p>", settings: [{ type: "aura", auraSize: 2, auraWho: "allies", auraSelf: true, auraOutline: "#3fb68b", auraFill: "#3fb68b", fxUuid: uuidOf("effects", "Aura of Protection (+1 Defense)") }] });

// Features: the Paladin's core features, the passives of the picks, and the choices
add("features", "feature", "Font of Mercy", "icons/svg/regen.svg", { category: "Paladin Feature", level: 1, description: "<p>While your Escalation is 1 or more, when you or an ally within 5 squares of you uses a Rally Point, they heal your Power Modifier + 2 more.</p>" });
add("features", "feature", "Radiant Zeal", "icons/svg/sun.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 1 or more, the first [Strike] Action you make each round that deals damage deals an extra [M] 1d6 Ho.</p>" });
add("features", "feature", "Aegis", "icons/svg/shield.svg", { category: "Paladin Feature", level: 1, description: "<p>At the start of each encounter, choose one ally. While you are within 3 squares of them, you and they gain 1 boon on Saves. (Not automated: choose the ally and add the boon by hand.)</p>" });
add("features", "feature", "Mercy's Reward", "icons/svg/regen.svg", { category: "Paladin Feature", level: 1, description: "<p>When you heal an ally with Lay On Hands, your next Smite is Empowered 2. It is used up by that Smite. (Not automated.)</p>" });
add("features", "feature", "Divine Vigil", "icons/svg/aura.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, you and your allies in an Aura 3 around you gain 1 boon on Saves against [Fear] Actions.</p>", settings: [{ type: "aura", auraSize: 3, auraWho: "allies", auraSelf: true, auraOutline: "#d4a62a", auraFill: "#d4a62a", fxUuid: uuidOf("effects", "Divine Vigil (Boon against Fear)"), minEscalation: 2 }] });
add("features", "feature", "Avenger's Oath", "icons/svg/sword.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, when an ally within 5 squares becomes Bloodied, you gain 1 boon on your next Strike. (Not automated.)</p>" });
add("features", "feature", "Hallowed Stance", "icons/svg/statue.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, if you haven't left your square since your last turn, you and your adjacent allies take less Body damage, reduced by your Power Modifier (minimum 0). It reduces one instance of damage per Action; if the Action has several, the player chooses which one. (Not automated.)</p>" });

// Actions: the picks
const PAL = "Paladin Feature";
add("actions", "action", "Vow of Enmity", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / one / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "Your next Strike against them gains 1 boon, and you increase your Empowered value by 1 for that Strike."], ["1d8MH", "As Tier 2."]]),
  vt(2, [["", "No effect."], ["1d6MH", "As 1 AP."], ["1d6MH", "As Tier 2, and the target is Vulnerable 1 (EoT)."]]),
  vt(3, [["", "No effect."], ["1d6MH", "As 2 AP."], ["1d6MH", "As 2 AP."]])] }, "Paladin");
add("actions", "action", "Shield of Faith", "icons/svg/shield.svg", { category: PAL, level: 1, traits: ["divine", "focus"], frequency: "turn", reaction: true, reactionKind: "interrupt", targets: "The creature the Strike would damage (you or an ally)", distance: "5", trigger: "A [Strike] Action would damage you or an ally within 5 squares.", versions: [
  noRoll(1, "The damage that Strike deals to the target is reduced by 1d6 + your Power Modifier.")] }, "Paladin");
add("actions", "action", "Rebuke", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "turn", reaction: true, reactionKind: "trigger", targets: "The triggering creature", distance: "reach", trigger: "An enemy within Reach damages an ally.", versions: [
  vt(1, [["1d4+1MH", ""], ["1d6+1MH", ""], ["1d8+1MH", ""]], "", { critical: "The target is Vulnerable 1 (EoT)." }),
  vt(2, [["1d6+1MH", "Pushed 1."], ["1d8+1MH", "Pushed 2."], ["1d10+1MH", "Pushed 3."]], "", { critical: "The target is Vulnerable 1 for 1 round." })] }, "Paladin");
add("actions", "action", "Sacred Weapon", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "focus"], frequency: "round", targets: "One / two creatures", distance: "reach", versions: [
  noRoll(1, "You touch a creature (yourself or an ally). If they are not Empowered, they become Empowered 1 for 1 round. If they are Empowered 1 (from any source), they become Empowered 2 for 1 round. If they are Empowered 2 or higher, no effect."),
  noRoll(2, "As 1 AP, but you can touch up to two creatures.")] }, "Paladin");
add("actions", "action", "Champion's Challenge", "icons/svg/combat.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "1 bane on [Strike] and [Power] Actions against anyone other than you (EoT)."], ["", "As Tier 2, but 2 banes instead of 1."]]),
  vt(2, [["", "No effect."], ["", "As 1 AP."], ["", "As 1 AP."]])] }, "Paladin");
add("actions", "action", "Word of Radiance", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "area", "magic"], frequency: "encounter", targets: "All enemies in the Area", areaCfg: { size: 2, shape: "emanation", within: 5, targets: "enemies", center: false, keep: false, rounds: 0 }, versions: [
  vt(2, [["1d8MH", ""], ["2d6MH", ""], ["2d8MH", "Prone."]]),
  vt(3, [["2d6MH", ""], ["2d8MH", ""], ["2d10MH", "Prone."]], "At 3 AP the Area is a 3 Emanation.")] }, "Paladin");
const dr = (ap, extra) => [
  vt(ap, [["1WB,1d10MH", ""], ["1WB,1d12MH", ""], ["1WB,2d8MH", ""]], extra, { mode: "weapon", critical: "The target is Pushed 3." }),
  vt(ap, [["2d8MH", ""], ["2d10MH", ""], ["2d12MH", ""]], extra, { mode: "power", critical: "The target is Pushed 3." })];
add("actions", "action", "Divine Retribution", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "strike", "split"], frequency: "encounter", reaction: true, reactionKind: "trigger", targets: "The triggering creature", distance: "weapon", trigger: "You take damage from an enemy within the Distance of this Action.", versions: [
  ...dr(2, ""), ...dr(3, "As 2R, and every enemy in an Emanation 2 centered on you, except the triggering creature, must make an Appeal Save: [M] 1d10 Ho; Pushed 2 / [M] 1d8 Ho / 0.")] }, "Paladin");
add("actions", "action", "Aura of Protection", "icons/svg/aura.svg", { category: "Paladin Escalation", level: 1, traits: ["area", "divine"], frequency: "encounter", escalation: 1, targets: "You and allies in the Area", distance: "Aura 2", versions: [
  noRoll(0, "Until the end of the encounter, you and allies in the Aura gain +1 Defense.", [uuidOf("effects", "Aura of Protection")])] }, "Paladin");
add("actions", "action", "Holy Wrath", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "strike", "weapon"], frequency: "encounter", targets: "One creature", distance: "weapon", versions: [
  version(2, "1WB,2d6MH", "1WB,3d8MH", "1WB,4d8MH"),
  version(3, "1WB,3d8MH", "1WB,5d8MH", "1WB,7d8MH")] }, "Paladin");
add("actions", "action", "Bulwark of Faith", "icons/svg/shield.svg", { category: PAL, level: 1, traits: ["divine", "focus"], frequency: "encounter", reaction: true, reactionKind: "interrupt", targets: "The creature the [Strike] Action would damage (an ally)", distance: "5", trigger: "A [Strike] Action would damage an ally within 5 squares.", versions: [
  noRoll(1, "The target gains @Guard[rally]{Guard equal to what one of their Rally Points heals}, before the damage."),
  noRoll(2, "As 1R (the target gains @Guard[rally]{Guard equal to what one of their Rally Points heals}, before the damage), and the triggering creature is Slid 2.")] }, "Paladin");
add("actions", "action", "Miraculous Recovery", "icons/svg/regen.svg", { category: PAL, level: 1, traits: ["divine", "focus"], frequency: "daily", targets: "One creature", distance: "reach", versions: [
  noRoll(2, "You touch an ally. They heal twice what one of their Rally Points would heal, and you end one non-permanent effect of your choice on them."),
  noRoll(3, "As 2 AP, but three times what one Rally Point would heal.")] }, "Paladin");
add("actions", "action", "Consecrated Ground", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "area"], frequency: "daily", targets: "All creatures in the Area", areaCfg: { size: 2, shape: "emanation", within: 10, targets: "all", center: false, keep: true, rounds: 3 }, versions: [
  noRoll(2, "For 3 rounds, enemies in the area take 1 Bane on [Weapon], [Power] and [Signature] Actions, and allies in it heal 1d4 at the start of each of their turns."),
  noRoll(3, "As 2 AP, but for 5 rounds (at 3 AP the Area is a 3 Emanation).")] }, "Paladin");
add("actions", "action", "Divine Intervention", "icons/svg/angel.svg", { category: PAL, level: 1, traits: ["divine"], frequency: "daily", reaction: true, reactionKind: "interrupt", targets: "One creature", distance: "5", trigger: "You or an ally within 5 squares would go Down.", versions: [
  noRoll(1, "Instead of going Down, the creature's total damage becomes 1 less than their Health Pool, and they gain 1 boon on their next Save (EoT)."),
  noRoll(2, "As 1R, and the creature can use one Rally Point at once.")] }, "Paladin");
// the Escalation Actives
const PE = "Paladin Escalation";
add("actions", "action", "Call to Arms", "icons/svg/angel.svg", { category: PE, level: 1, traits: ["divine"], frequency: "round", escalation: 1, targets: "One Down ally", distance: "3", versions: [noRoll(0, "The ally can use one Rally Point.")] }, "Paladin");
add("actions", "action", "Divine Surge", "icons/svg/sun.svg", { category: PE, level: 1, traits: ["divine"], frequency: "round", escalation: 1, targets: "One enemy", distance: "5", versions: [noRoll(0, "For 1 round, the next time an ally deals damage to the target, they deal an extra [M] 1d8 Ho. You gain @Guard[2d6|self:yes]{Guard 2d6}.", [uuidOf("effects", "Divine Surge")])] }, "Paladin");
add("actions", "action", "Hand of Mercy", "icons/svg/regen.svg", { category: PE, level: 1, traits: ["divine", "focus"], frequency: "round", escalation: 1, targets: "One ally", distance: "reach", versions: [noRoll(1, "You touch the ally and remove one effect of your choice from them that is EoT or has 1 round left.")] }, "Paladin");
add("actions", "action", "Judgment", "icons/svg/sword.svg", { category: PE, level: 1, traits: ["divine", "magic"], frequency: "round", escalation: 2, targets: "One enemy", distance: "reach", versions: [vt(1, [["", "No effect."], ["2d6MH", "Hindered (EoT)"], ["2d8MH", "Hindered (EoT)"]])] }, "Paladin");
add("actions", "action", "Sanctified Ground", "icons/svg/aura.svg", { category: PE, level: 1, traits: ["divine", "area"], frequency: "round", escalation: 2, targets: "All creatures in the Area", areaCfg: { size: 1, shape: "emanation", within: 5, targets: "all", center: false, keep: true, rounds: 2 }, versions: [noRoll(1, "You fill the Emanation with Holy light for 2 rounds. Enemies in it take 1 bane on [Strike] Actions.")] }, "Paladin");

add("actions", "action", "Mark Quarry", "icons/svg/target.svg", { category: "Marked Quarry", level: 1, traits: ["focus"], frequency: "turn", targets: "One creature", distance: "",
  versions: [noRoll(0, "The targeted creature becomes your Marked Quarry: at the start of an encounter, or as a 0R [Focus] when yours died or went Down."), noRoll(1, "The targeted creature becomes your Marked Quarry instead of the one you had (once per turn).")] }, "Archer");
add("effects", "effect", "Hunter's Focus", "icons/svg/eye.svg", { selfApplied: true, duration: dur(""), description: "<p>For the rest of the encounter, against your Marked Quarry: you gain 1 boon and Empowered 1, and you take less damage from each of their Actions, reduced by your Signature Modifier (you choose which instance). The damage reduction is not automated.</p>", settings: [] }, "Archer");
/* ------------------------------------------------------------------ The Archer (from the book's cards; Save Actions and Marked Quarry are automated in the next passes) */
add("actions", "action", "Quick Draw", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "turn", "targets": "The triggering creature", "distance": "weapon", "reaction": true, "reactionKind": "interrupt", "trigger": "An enemy within 5 squares moves closer to you.", versions: [noRoll(1, "Make a @Use[Weapon Attack|label:Weapon Attack (1A)] against the triggering creature.")] }, "Archer");
add("actions", "action", "Wing Clip", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [vt(1, [["1WB", ""], ["1WB, 1d4BPi", ""], ["1WB, 1d6BPi", "Hindered (EoT)"]], "")] }, "Archer");
add("actions", "action", "True Shot", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["focus", "self"], "frequency": "round", versions: [noRoll(1, "Your next Strike ignores Cover.")] }, "Archer");
add("actions", "action", "Suppressing Fire", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [noRoll(1, "Until the end of your next turn, the target takes 1 bane on [Ranged, Strike] and [Power, Ranged] Actions against creatures other than you.")] }, "Archer");
add("actions", "action", "Volley", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["area", "ranged", "save", "shot", "weapon"], "frequency": "encounter", "vs": "instinct", "targets": "All creatures in the Area", "areaCfg": {"size": 2, "shape": "emanation", "within": 0, "withinRange": "normal", "targets": "all", "center": false, "keep": false, "rounds": 0}, versions: [vt(3, [["1d10BPi, ModBPi", "Hindered (EoT)"], ["1d8BPi, ModBPi", ""], ["1d6BPi", ""]], "")] }, "Archer");
add("actions", "action", "Marksman's Shot", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "encounter", "targets": "One creature", "distance": "weapon", versions: [vt(2, [["1WB, 1d8BPi", ""], ["1WB, 3d6BPi", ""], ["1WB, 4d6BPi", "Vulnerable 2 (EoT)."]], "")] }, "Archer");
add("actions", "action", "Covering Fire", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["area", "ranged", "shot", "weapon"], "frequency": "encounter", "targets": "All creatures in the Area", "areaCfg": {"size": 2, "shape": "emanation", "within": 0, "withinRange": "normal", "targets": "all", "center": false, "keep": true, "rounds": 2, "ht": "entering"}, versions: [noRoll(2, "Lasts 2 rounds [HT: Entering]. Allies inside gain +1 Defense. Enemies it affects take [B] 1d4 Pi.")] }, "Archer");
add("actions", "action", "Rain of Arrows", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["area", "ranged", "save", "shot", "weapon"], "frequency": "daily", "vs": "instinct", "targets": "All enemies in the Area", "areaCfg": {"size": 3, "shape": "emanation", "within": 0, "withinRange": "maximum", "targets": "enemies", "center": false, "keep": true, "rounds": 2, "ht": "entering+turn"}, versions: [vt(3, [["1d8BPi, ModBPi", ""], ["1d6BPi, ModBPi", ""], ["", "No effect."]], "The area lasts 2 rounds [HT: Entering, Turn].")] }, "Archer");
add("actions", "action", "Hunter's Focus", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["focus", "self"], "frequency": "daily", versions: [noRoll(1, "For the rest of the encounter, against your Marked Quarry (a new Marked Quarry when you choose one): you gain 1 boon and Empowered 1 against them, and you take less damage from each of their Actions, reduced by your **Signature Modifier** (you choose which instance of its damage is reduced).", [uuidOf("effects", "Hunter's Focus")])] }, "Archer");
add("actions", "action", "Deadeye", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "daily", "targets": "One creature", "distance": "weapon", versions: [vt(3, [["1WB", ""], ["1WB, 2d6BPi", ""], ["1WB, 4d6BPi", "Prone"]], "")] }, "Archer");
add("actions", "action", "Steady Aim", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 1, versions: [noRoll(0, "Your next [Shot, Strike] gains 1 boon, and all of the weapon's ranges increase by 5.")] }, "Archer");
add("actions", "action", "Vanish", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["self"], "frequency": "round", "distance": "self", "escalation": 1, versions: [noRoll(1, "@Move[evade|distance:3]. The first Strike against you takes 1 bane, for 1 round.")] }, "Archer");
add("actions", "action", "Pinning Shot", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", "escalation": 2, versions: [noRoll(1, "Make a @Use[Weapon Attack|label:[Ranged] Weapon Attack (1A)]. On a Tier 2 or 3, the target is Immobilized (EoT).")] }, "Archer");
add("actions", "action", "Twin Shot", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "round", "targets": "Two creatures", "distance": "weapon", "escalation": 2, versions: [noRoll(1, "Make a single [Ranged] Weapon Technique (1A) Action with your weapon's Weapon Technique, if you have unlocked it (see Mastery), comparing the result to two different creatures that can't be more than 5 squares apart. If both creatures get the same Tier 2 or 3 result, you choose one of them to take an extra [B] 1d6 Pi. @Use[category:Weapon Technique|label:Weapon Technique (1A)]")] }, "Archer");
add("actions", "action", "Perfect Shot", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 3, versions: [noRoll(0, "Your next [Shot, Strike] is Favored and Empowered 2, and ignores Cover.")] }, "Archer");
add("features", "feature", "Marked Quarry", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>At the start of each encounter, choose one enemy as your <b>Marked Quarry</b>. You gain 1 Boon on [Shot, Strike] Actions against them, and those Actions deal [B] [Mod] on a Tier 1. When they die or go Down, you can choose a new Marked Quarry (0R [Focus]). Once per turn, you can change your Marked Quarry during an encounter by spending 1 AP [Focus].</p>", actions: [uuidOf("actions", "Mark Quarry")] }, "Archer");
add("features", "feature", "Bow Mastery", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>Choose one Projectile weapon, such as a bow or a crossbow. You start with **3 Mastery** with it, so its Weapon Technique is unlocked (see Mastery).</p>" }, "Archer");
add("features", "feature", "Long Draw", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>With a Projectile weapon, your far range has no bane and your maximum range has 1 bane instead of 2.</p>" }, "Archer");
add("features", "feature", "Patient Hunter", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, if you have not left your square since the start of your last turn, gain 1 boon on [Shot, Strike] Actions until you leave your square.</p>" }, "Archer");
add("features", "feature", "Steady Nerves", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, you don't take the normal banes for using [Ranged] Actions while Engaged.</p>" }, "Archer");
add("features", "feature", "Elusive", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 1 or more, the first [Strike] Action against you each round takes 1 Bane.</p>" }, "Archer");
add("features", "feature", "Killer's Focus", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, your first [Shot, Strike, Weapon] Action each round deals an extra [B] 1d6 Pi.</p>" }, "Archer");

// The choices of the class (P1 and A1, v0.0.181: the book's level lists; a Feature is gained at its level)
const pickOf = cat => (name, label, count, options, level = 1) => add("features", "feature", name, "icons/svg/book.svg", { category: cat, level, description: `<p>${label}.</p>`, choiceLabel: label, choiceCount: count, choiceOptions: options.map(([pack, n]) => uuidOf(pack, n)) });
const pickFeature = pickOf("Paladin Feature"), archerPick = pickOf("Archer Feature");
const A = names => names.map(n => ["actions", n]), Fe = names => names.map(n => ["features", n]);
for (const lv of [1, 2]) add("features", "feature", `Talent (Level ${lv})`, "icons/svg/book.svg", { category: "Class Feature", level: lv, talents: 1, description: `<p>Level ${lv}: you pick one Talent (the Talents document).</p>` });
pickFeature("Hallmark Action", "Choose your Hallmark Action", 1, A(["Smite", "Lay On Hands"]));
pickFeature("Encounter Pick", "Choose 1 Encounter Pick", 1, A(["Holy Wrath", "Bulwark of Faith"]));
pickFeature("Escalation Passive", "Choose 1 Passive Escalation Pick", 1, Fe(["Hallowed Stance", "Radiant Zeal"]));
pickFeature("Escalation Active", "Choose 1 Active Escalation Pick", 1, A(["Aura of Protection", "Divine Surge"]));
pickFeature("Daily Pick", "Choose 1 Daily Pick", 1, A(["Consecrated Ground"]), 3);
pickFeature("Escalation Passive (Level 3)", "Choose 1 Passive Escalation Pick", 1, Fe(["Hallowed Stance", "Radiant Zeal"]), 3);
archerPick("Archer Hallmark Action", "Choose your Hallmark Action", 1, A(["Double Shot", "Rolling Shot"]));
archerPick("Archer Escalation Passive", "Choose 1 Passive Escalation Pick", 1, Fe(["Killer's Focus", "Elusive"]));
archerPick("Archer Escalation Active", "Choose 1 Active Escalation Pick", 1, A(["Pinning Shot"]));
archerPick("Archer Encounter Pick", "Choose 1 Encounter Pick", 1, A(["Marksman's Shot"]), 2);
archerPick("Archer Daily Pick", "Choose 1 Daily Pick", 1, A(["Hunter's Focus"]), 3);
archerPick("Archer Escalation Passive (Level 3)", "Choose 1 Passive Escalation Pick", 1, Fe(["Killer's Focus", "Elusive"]), 3);
// The cards the P1 and A1 builds left out (book/paladin-old-cards.md, book/archer-old-cards.md): kept in the compendium, in folders of their own, for the Options step.
const OLD = { "Paladin (old cards)": ["Aegis", "Mercy's Reward", "Divine Vigil", "Avenger's Oath", "Vow of Enmity", "Rebuke", "Sacred Weapon", "Champion's Challenge", "Word of Radiance", "Divine Retribution", "Miraculous Recovery", "Divine Intervention", "Call to Arms", "Hand of Mercy", "Judgment", "Sanctified Ground", "Divine Vigil (Boon against Fear)"],
  "Archer (old cards)": ["Precise Aim", "Precise Aim (1 Boon)", "Precise Aim (2 Boons)", "Quick Draw", "Wing Clip", "True Shot", "Suppressing Fire", "Volley", "Covering Fire", "Rain of Arrows", "Deadeye", "Steady Aim", "Vanish", "Twin Shot", "Perfect Shot", "Bow Mastery", "Long Draw", "Patient Hunter", "Steady Nerves"] };
for (const [folder, names] of Object.entries(OLD)) for (const n of names) { const d = docs.filter(x => x.name === n); if (!d.length) throw new Error(`No item called ${n}`); d.forEach(x => { x.folder = folder; }); }

/* ------------------------------------------------------------------ Player characters: ready to play, with their weapon in hand */
const PACK_OF = { species: "classes", class: "classes", feature: "features", talent: "features", action: "actions", weapon: "weapons", armor: "weapons", effect: "effects" };
const docOf = (type, name) => { const d = docs.find(x => x.type === type && x.name === name); if (!d) throw new Error(`No ${type} called ${name}`); return d; };
const byUuid = u => docs.find(d => uuidOf(PACK_OF[d.type], d.name) === u);
const copyDoc = (who, type, name, flags = {}, extra = {}) => {
  const d = docOf(type, name);
  return { _id: idOf("Item", `${who}:${type}:${name}`), name, type, img: d.img, system: { ...JSON.parse(JSON.stringify(d.system)), ...extra }, flags: { twod12: { sourceUuid: uuidOf(PACK_OF[type], name), ...flags } }, effects: [], folder: null, sort: 0, ownership: { default: 0 } };
};
const pcs = [];
const pc = ({ name, img, species, chosen, cls, picks, features, slotFeature, weapon, armor = "", extras = [] }) => {
  const items = [copyDoc(name, "species", species, {}, chosen ? { chosen } : {}), copyDoc(name, "class", cls, {}, { chosenA: picks.a, chosenB: picks.b, chosenWeapon: "", chosenMagic: "", modPriority: picks.priority ?? "weapon" })];
  const ids = {};
  for (const f of features) {
    const it = copyDoc(name, "feature", f, { grantedBy: "class", level: 1 });
    ids[f] = it._id; items.push(it);
    for (const u of (it.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { featureId: it._id })); }
  }
  if (slotFeature && ids[slotFeature]) items.push(copyDoc(name, "action", "Opportunity Attack", { slot: `${ids[slotFeature]}:0` }));
  for (const [type, n] of extras) items.push(copyDoc(name, type, n, {}));
  const w = copyDoc(name, "weapon", weapon, {}, { wielded: true });
  items.push(w);
  for (const u of (w.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { weaponId: w._id })); }
  for (const k of Object.keys(BASIC_ACTIONS)) { const d = basicItemData(k); items.push({ _id: idOf("Item", `${name}:basic:${d.name}`), name: d.name, type: "action", img: d.img, system: d.system, flags: d.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  { const f = fistsItemData(); items.push({ _id: idOf("Item", `${name}:Fists`), name: f.name, type: "weapon", img: f.img, system: f.system, flags: f.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  if (armor) items.push(copyDoc(name, "armor", armor, {}, { worn: true }));
  pcs.push({ name, img, system: { level: 1 }, items });
};
pc({ name: "Human Paladin", img: "icons/svg/angel.svg", species: "Human", chosen: ["body", "appeal"], cls: "Paladin", picks: { a: "body", b: "mind", w: "body", m: "appeal" }, features: ["Divine Power", "Font of Mercy"], slotFeature: "", extras: [["action", "Smite"], ["action", "Holy Wrath"], ["feature", "Hallowed Stance"], ["action", "Divine Surge"], ["talent", "Heavy Blows"]], weapon: "Greatsword", armor: "Medium Armor" });
pc({ name: "Elf Archer", img: "icons/svg/target.svg", species: "Elf", cls: "Archer", picks: { a: "instinct", b: "mind", w: "instinct", m: "mind" }, features: ["Sharpshooter", "Marked Quarry"], extras: [["action", "Double Shot"], ["feature", "Killer's Focus"], ["action", "Pinning Shot"], ["action", "Aim"]], weapon: "Crossbow", armor: "Light Armor" });

const FOLDER_OF = { species: "Species", class: "Class", feature: "Feature", talent: "Talent" };
for (const d of docs) if ((d.pack === "classes" || d.pack === "features") && !d.folder) d.folder = FOLDER_OF[d.type] ?? null;

/* ------------------------------------------------------------------ Flavor lines (one per item; a Talent and its Action share it) */
const FLAVOR = {
 "Weapon Attack": "You strike with the weapon in your hands.",
 "Steel Yourself": "You grit your teeth and find a little more to give.",
 "Charge": "You close the distance in one straight, reckless line.",
 "Shove": "You put your weight behind it and drive them back.",
 "Haul": "You snag them and drag them in.",
 "Trip": "A hooked foot, a twist, and they hit the ground.",
 "Advance": "You press forward, one deliberate step at a time.",
 "Evade": "You slip through the fray without giving anyone an opening.",
 "Stand": "You get your feet back under you.",
 "Leaning": "You lean out from cover, just enough to see.",
 "Interact": "You pull the lever, open the door, grab what you need.",
 "Reload": "You work the mechanism and seat a fresh bolt.",
 "Divine Power": "Your god's strength flows through your weapon and your hands.",
 "Font of Mercy": "Where you kneel, wounds remember how to close.",
 "Holy Wrath": "For one blow, your god stops holding back.",
 "Bulwark of Faith": "You step into the blow meant for them, and your god holds the line with you.",
 "Radiant Zeal": "The longer the fight, the brighter you burn.",
 "Heavy Blows": "Every swing carries the whole weight of the steel.",
 "Elusive": "You are never quite where they aimed.",
 "Divine Connection": "Your bond with your god opens new paths.",
 "Smite": "Your weapon blazes with holy light.",
 "Lay On Hands": "Your touch carries your god's mercy.",
 "Sharpshooter": "You were made for the shot no one else would take.",
 "Double Shot": "Two shots, so close together they sound like one.",
 "Precise Aim": "You slow your breath and let the world narrow to one point.",
 "Opportunity Attack": "You punish anyone who moves carelessly near you.",
 "Lesser Blessing": "A small gift from the god you follow.",
 "Rimebrand (Cold)": "Frost creeps along your weapon, a gift from a winter god.",
 "Aim": "Patience turns a good shot into a sure one.",
 "Ricochet": "Walls, shields and stones are just more angles.",
 "Reaping Sweep": "A wide, heavy arc for anyone standing too close.",
 "Cut Through": "You drive through the line without stopping, and strike as you pass.",
 "Suppressing Shot": "An arrow thuds into the ground right where your foot would be.",
 "Deadeye Shot": "The skeleton's hollow eyes narrow, and the string sings.",
 "Skitter Back": "Bones clatter as it scurries out of reach.",
 "Lunging Cut": "The skeleton lurches forward, rusty blade first.",
 "Shield Bash": "A battered shield slams home with the weight of old bones.",
 "Brittle Guard": "Brittle bones twist out of the way at the last moment.",
 "Battering Charge": "Nothing slows you down once you start running.",
 "Bloodlust": "The red haze settles, and you stop caring about pain.",
 "Brawler": "Your hands have won more fights than any blade.",
 "Pummel": "A flurry of blows until something gives.",
 "Kickboxer": "Your legs hit as hard as your fists.",
 "Leg Sweep": "A low kick takes their legs out from under them, and you follow it up.",
 "Whirlwind": "You spin, and everything within reach feels the blade.",
 "Lock & Loose": "A bolt to the knee, and they go nowhere.",
 "Nick and Slip": "The goblin darts in, cuts, and is already out of reach.",
 "Ruthless Cut": "No honor, no warning, just the blade.",
 "Gore Rush": "Tusks first, the boar barrels through anything in its path.",
 "Bone Verdict": "The captain's blade falls like a sentence long decided.",
 "Rattle of Command": "A dry rattle from the captain, and the dead move as one.",
  "Profane Judgment": "The profane flinch at your god's light.",
  "Aegis": "Your watchful presence protects one soul above all.",
  "Mercy's Reward": "Mercy shown is mercy returned.",
  "Divine Vigil": "Your watch does not end when the fighting starts.",
  "Avenger's Oath": "Every wound your friends take is written in the ledger.",
  "Hallowed Stance": "You do not move. Neither do those beside you.",
  "Vow of Enmity": "You name a foe, and your god listens.",
  "Shield of Faith": "A shimmer of light holds steady between them and harm.",
  "Rebuke": "The hand that strikes the faithful is burned for its trouble.",
  "Sacred Weapon": "You lay a hand on the steel and bless it for what comes next.",
  "Champion's Challenge": "You call them out, and they cannot look away.",
  "Word of Radiance": "You speak a word, and light pours from your hands across everything that stands against you.",
  "Divine Retribution": "They struck you. Your god strikes back.",
  "Aura of Protection": "You plant your feet, and light rims the shoulders of everyone near you.",
  "Miraculous Recovery": "You lay both hands on the wound and call in a debt owed to your god.",
  "Consecrated Ground": "You drive your weapon into the earth, and the earth answers.",
  "Divine Intervention": "You reach out, and your god answers before you finish the prayer.",
  "Call to Arms": "Your voice carries further than the fight.",
  "Divine Surge": "You name the foe in your god's sight, and every blade that finds it burns.",
  "Hand of Mercy": "A single touch undoes what the enemy worked for.",
  "Judgment": "The verdict is not yours to give, only to deliver.",
  "Sanctified Ground": "You make a small piece of the world your god's, and it holds."
};
FLAVOR["Double Shot"] = "Two shots, so close together they sound like one.";
FLAVOR["Precise Aim"] = "You slow your breath and let the world narrow to one point.";
FLAVOR["Quick Draw"] = "You loose before they take the second step.";
FLAVOR["Rolling Shot"] = "You keep moving, and the shot rides along with the motion.";
FLAVOR["Wing Clip"] = "A shot at the knee is worth two in the chest.";
FLAVOR["True Shot"] = "You see the gap in the wall, and the shot goes through it.";
FLAVOR["Suppressing Fire"] = "They keep their heads down while your friends close in.";
FLAVOR["Volley"] = "You empty the quiver skyward, and the arrows fall together.";
FLAVOR["Marksman's Shot"] = "One shot, carefully placed. Everything after it is easier.";
FLAVOR["Covering Fire"] = "Nobody walks through that ground without paying for it.";
FLAVOR["Rain of Arrows"] = "Arrows fall from nothing, again and again, until the ground is gone.";
FLAVOR["Hunter's Focus"] = "You and the quarry, and nothing else in the world.";
FLAVOR["Deadeye"] = "You put everything into one shot, and everything into the one after.";
FLAVOR["Steady Aim"] = "Breathe in. Breathe out. Loose.";
FLAVOR["Vanish"] = "You were there a moment ago. You are not now.";
FLAVOR["Pinning Shot"] = "You pin their foot to the ground with an arrow.";
FLAVOR["Twin Shot"] = "Two arrows, one motion, two answers.";
FLAVOR["Perfect Shot"] = "The arrow has already landed. You have only to release it.";
FLAVOR["Sharpshooter"] = "You were made for the shot no one else would take.";
FLAVOR["Marked Quarry"] = "You pick the one, and the world narrows.";
FLAVOR["Bow Mastery"] = "One weapon has been in your hands longer than any other.";
FLAVOR["Long Draw"] = "You pull a little further, and the arrow flies a little truer.";
FLAVOR["Patient Hunter"] = "The shot is worth waiting for.";
FLAVOR["Steady Nerves"] = "They are in your face. You are still calm.";
FLAVOR["Killer's Focus"] = "First blood is the only blood that matters.";

for (const d of docs) if (["action", "talent", "feature"].includes(d.type) && FLAVOR[d.name]) d.system.flavor = FLAVOR[d.name];
for (const a of [...actors, ...pcs]) for (const it of (a.items ?? [])) if (["action", "talent", "feature"].includes(it.type) && FLAVOR[it.name]) { it.system ??= {}; it.system.flavor = FLAVOR[it.name]; }

export { docs, folders, uuidOf, actors, pcs };
