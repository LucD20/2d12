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
// v0.0.186 (pack C-a): the general settings that replaced the code that tested card names (automation.mjs).
const P = (all = [], any = [], none = []) => ({ all, any, none });
const sBoon = (boons, pred, extra = {}) => ({ type: "boonbane", boons, banes: 0, ...pred, ...extra });
const sBonus = (dmg, pool, sub, pred, extra = {}) => ({ type: "bonusdamage", dmg, dmgPool: pool, dmgSub: sub, tiers: ["t1", "t2", "t3"], text: "", fxUuid: "", ...pred, ...extra });
const sIgnore = (rule, pred, extra = {}) => ({ type: "ignore", ignoreRule: rule, ...pred, ...extra });
// v0.0.207 (editability sweep): a chat message at a moment with an Action to offer (Marked Quarry), a Starting Mastery (Sharpshooter, Bow Mastery).
const sMessage = (when, text, action = "", ap = 0, to = "owners") => ({ type: "message", msgWhen: when, text, msgAction: action, msgAp: ap, msgTo: to });
const sMastery = (trait, value) => ({ type: "mastery", mstTrait: trait, mstValue: value });
const cond = (name, img, description, settings, extra = {}) => add("conditions", "effect", name, img, { isCondition: true, duration: { type: "", rounds: 1 }, description, settings, ...extra }, null);
cond("Empowered", "icons/svg/upgrade.svg", "<p>Empowered N adds N to every die of your damage. Only the highest Empowered value applies, and the Enfeebled value is taken from it.</p>", [], { valued: true });
cond("Enfeebled", "icons/svg/degen.svg", "<p>Enfeebled N subtracts N from every die of your damage, but each die still deals at least 1. Only the highest Enfeebled value applies, and it is taken from the Empowered value.</p>", [], { valued: true });
cond("Hindered", "icons/svg/downgrade.svg", "<p>Your Speed is halved, rounded down.</p>", [speedSetting("override", "floor(speed/2)")]);
cond("Immobilized", "icons/svg/net.svg", "<p>You can't use Move Actions or Evade. Unless otherwise specified, you can remove Immobilized by using an Interact (1 AP) Action.</p>", [speedSetting("override", "0")]);
cond("Leaning", "icons/svg/eye.svg", "<p>You calculate cover from one of your corners instead of the center, and your own cover is reduced by 1 level (Total → High → Medium → Low → none: leaning out of Total cover, you can be targeted). Click a corner of your square on the map to lean toward it: your token peeks out a little past it, unless a wall is in the way. It ends at the end of your turn, or when you stop Leaning (at any time on your turn, at no cost).</p>", []);
cond("Prone", "icons/svg/falling.svg", "<p>Melee Actions against you gain 1 Boon, and Ranged Actions against you suffer 1 Bane. You can't Evade. The only [Move] Actions you can use are Crawl and Stand.</p>", [against(1, 0, ["melee"]), against(0, 1, ["ranged"])]);

add("effects", "effect", "Hindered (until Move)", "icons/svg/downgrade.svg", { duration: { type: "rounds", rounds: 1 }, expireOn: ["move"], description: "<p>For 1 round, the creature is Hindered until they use a Move Action. The effect lasts through that Move Action and ends once it is resolved.</p>", settings: [speedSetting("override", "floor(speed/2)")] }, "Conditions");
const coldSetting = (dmg, tiers, text = "", fxUuid = "") => ({ type: "bonusdamage", dmg, dmgPool: "M", dmgSub: "Co", tiers, text, fxUuid, all: ["weapon"], any: [], none: [] });
// OT (book 2026-10-30): Rimebrand is a turn buff with no roll.
add("effects", "effect", "Rimebrand", "icons/svg/frozen.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>Until the end of your turn, your [Weapon] Actions deal an extra [M] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT).</p>", settings: [coldSetting("1d4", ["t1", "t2", "t3"]), coldSetting("", ["t3"], "Hindered (EoT)", uuidOf("conditions", "Hindered"))] }, "Lesser Blessing");

const aimSetting = (n, all = ["ranged", "strike", "weapon"]) => ({ type: "boonbane", boons: n, banes: 0, all, any: [], none: [] });
for (const n of [1, 2]) add("effects", "effect", `Precise Aim (${n} Boon${n === 1 ? "" : "s"})`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "shot", "strike", "weapon"], expireAll: true, description: `<p>${n} Boon${n === 1 ? "" : "s"} on your next [Ranged, Shot, Strike, Weapon] Action.</p>`, settings: [aimSetting(n, ["ranged", "shot", "strike", "weapon"])] }, "Sharpshooter");

const bloodlustFrom = ["strike", "melee", "ranged", "weapon", "magic", "divine", "focus", "handle", "move"];
cond("Vulnerable", "icons/svg/hazard.svg", "<p>Actions against you gain as many Boons as the value of Vulnerable (Vulnerable 2: 2 Boons). Only the highest Vulnerable value applies.</p>", [{ ...against(1, 0, []), byValue: true }], { valued: true });
cond("Slowed", "icons/svg/stoned.svg", "<p>Slowed always has a value. You regain that many fewer AP at the start of your turn (Slowed 2: you regain 3), and your most AP is lowered by the value too. You don't lose AP when you become Slowed, only when you regain AP. Desperate, Dying and Shattered make you Slowed 1, or 1 more (to at most 3), while they last. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Quickened", "icons/svg/lightning.svg", "<p>Quickened always has a value. Your most AP, and the AP you regain at the start of your turn, rise by that much (Quickened 2: you regain 7). You don't gain AP when you become Quickened, only when you regain AP. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Imperiled", "icons/svg/hazard.svg", "<p>You barely avoided a Deadly Hazard (hanging from a ledge, at the lip of a lava pit...). All your Checks and Saves are Doomed, and you are Vulnerable 3. At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled; you are Slowed 1 for that turn. A creature can help you get to safety with the Interact Action (1 AP, Handle).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 3, valued: true }] });
cond("Squeezing", "icons/svg/net.svg", "<p>You stopped moving while squeezing through a space one rank smaller than you: you don't fit completely in the space you are in. All your Rolls are Doomed and you are Vulnerable equal to half your level (rounded up) until you move to a space where you fit completely. Each square you move while squeezing counts as Difficult Terrain. The GM applies this condition (it is not detected on the map).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 1, valued: true, mode: "halfLevel" }] });
add("effects", "effect", "Bloodlust", "icons/svg/blood.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain 2 Boons, and you take 1 Bane on Saves.</p>", settings: [
  { type: "boonbane", boons: 2, banes: 0, all: ["melee", "weapon"], any: [], none: [] },
  { type: "damagestep", empowered: 1, all: ["melee", "weapon"], any: [], none: [] },
  { type: "boonbane", boons: 0, banes: 1, all: [], any: [], none: [], from: bloodlustFrom }
] }, "Talents");

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
  versions: [noRoll(1, "Until the end of your turn, your [Weapon] Actions deal an extra [M] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT).", [uuidOf("effects", "Rimebrand")])]
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
  versions: [noRoll(1, "You gain 1 Boon on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (1 Boon)")]), noRoll(2, "You gain 2 Boons on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (2 Boons)")])]
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
// OT (book 2026-10-30): every Talent is a Talent item (Category, Level, Prerequisites, Theme as data); an Action Talent grants its Action,
// whose category is the Talent's head ("Combat Talent"), so the class window offers the Talent once.
add("actions", "action", "Aim", "icons/svg/target.svg", {
  category: "Combat Talent", level: 1, traits: ["ranged", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
  versions: [noRoll(1, "Make a @Use[Weapon Attack|boons:1|label:[Ranged] Weapon Attack (1A) with 1 Boon]. It ignores Low Cover.")]
}, "Talents");
add("actions", "action", "Opportunity Attack", "icons/svg/combat.svg", {
  category: "Combat Talent", level: 1, traits: [], frequency: "atwill", reaction: true, reactionKind: "interrupt", targets: "The triggering creature", trigger: "A creature within 3 squares would leave a square during a Move Action or uses the Stand Action.",
  versions: [noRoll(1, "You can make a Weapon Attack (1A) against the triggering creature, as long as your weapon can target them: @Use[Weapon Attack|label:Weapon Attack (1A)]. Used this way, out of your turn, it has a Critical: you disrupt the triggering Action before it happens.")]
}, "Talents");

/* ------------------------------------------------------------------ Martial Talents */
add("actions", "action", "Pummel", "icons/svg/combat.svg", {
  category: "Brawler", level: 1, traits: ["melee", "strike", "weapon"], frequency: "atwill", targets: "One creature", distance: "weapon", requirements: "You have a free hand.",
  versions: [version(1, "AtBBl", "1d4BBl", "1d6BBl")],
  weaponUse: "fists"   // Pummel uses only the Fists (v0.0.169; v0.0.207 its "Weapon used")
}, "Talents");
// OT (Lucas 2026-10-30): Leg Sweep is a kick, Kickboxer's own Action: it uses your Fists even with no free hand.
add("actions", "action", "Leg Sweep", "icons/svg/combat.svg", {
  category: "Kickboxer", level: 1, traits: ["melee", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
  versions: [version(1, "1d4BBl", "1d4BBl", '1d6BBl,"Prone."')],
  weaponUse: "kick"   // v0.0.207: its "Weapon used"
}, "Talents");
add("actions", "action", "Cut Through", "icons/svg/sword.svg", {
  category: "Mobility Talent", level: 1, traits: ["melee", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon",
  setup: "Evade 2 (@Move[evade|distance:2|terrain:ignore]). During this Evade you can move through the space of any creature (you can't end in one), and you ignore Difficult Terrain.",
  versions: [(() => { const v = version(2, "AtB", "1WB", "1WB,2B"); v.critical = "@Use[Relocate|nohandle:yes|label:Relocate (1A)] the target, ignoring the Handle trait."; return v; })()]
}, "Talents");
add("actions", "action", "Whirlwind", "icons/svg/sword.svg", {
  category: "Combat Talent", level: 1, traits: ["area", "melee", "self", "strike", "weapon"], frequency: "encounter", targets: "All creatures in the Area", areaCfg: { size: 1, shape: "emanation", within: 0, targets: "all", center: false, keep: false, rounds: 0 }, distance: "",
  versions: [version(2, "1WB,AtB", "1WB,4B", "1WB,6B")]
}, "Talents");
add("actions", "action", "Bloodlust", "icons/svg/blood.svg", {
  category: "Combat Talent", level: 1, traits: ["self"], frequency: "encounter", distance: "self",
  versions: [noRoll(1, "For 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain 2 Boons, and you take 1 Bane on Saves.", [uuidOf("effects", "Bloodlust")])]
}, "Talents");

/* ------------------------------------------------------------------ Features and Talents */
add("features", "feature", "Divine Power", "icons/svg/angel.svg", { category: "Paladin Feature", level: 1, description: "<p>When you deal Holy damage to a creature with the Profane Tag, that creature is Enfeebled 1 (EoT).</p>", settings: [{ type: "ondamage", trigSub: "Ho", trigTag: "Profane", fxUuid: uuidOf("effects", "Divine Power (Enfeebled)") }] });
add("features", "feature", "Divine Connection", "icons/svg/aura.svg", { category: "Paladin Feature", level: 1, talents: 2, description: "<p>Select 1 Talent and 1 Talent with the Divine trait. (Retired in the rules; kept here to test Talent slots.)</p>" });
add("features", "feature", "Sharpshooter", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>Choose your Hallmark Action: <b>Double Shot</b> or <b>Rolling Shot</b>. Choose one Projectile weapon, such as a bow or a crossbow: you start with <b>3 Mastery</b> with it. Your [Shot] Actions don't take the Bane for targeting a creature Engaged with a creature other than you.</p>", settings: [sIgnore("engagedTarget", P(["shot"])), sMastery("projectile", 3)] });


/* ------------------------------------------------------------------ Talents (book 16-talents.md; OT 2026-10-30): Category, Level, Prerequisites and Theme as data */
const tal = (name, img, group, sys = {}) => add("features", "talent", name, img, { category: "Talent", level: 1, group, ...sys });
const pre = (kind, name = "", value = 0) => ({ kind, name, value });
// Combat
tal("Opportunity Attack", "icons/svg/combat.svg", "combat", { description: "<p>You gain the Opportunity Attack Reaction.</p>", actions: [uuidOf("actions", "Opportunity Attack")],
  modifiers: [{ spec: "Weapon Attack", when: "outOfTurn", critical: "You disrupt the triggering Action before it happens.", effects: "" }] });
tal("Challenge", "icons/svg/combat.svg", "combat", { description: "<p>Once per round, when you deal damage to a creature with a [Melee, Strike] Action, you can challenge them: until the end of their next turn, their [Strike] Actions against creatures other than you take 1 Bane. (Apply the Challenged effect from the compendium; its Bane is a chip the attacker unticks when they attack you.)</p>" });
add("effects", "effect", "Challenged", "icons/svg/combat.svg", { duration: { type: "eot", rounds: 1 }, description: "<p>Until the end of your next turn, your [Strike] Actions against creatures other than the one who challenged you take 1 Bane (Challenge).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [] }] }, "Talents");
tal("Heavy Blows", "icons/svg/sword.svg", "combat", { theme: "Great Weapon", description: "<p>When a [Melee, Strike, Weapon] Action you make with a Two-handed weapon deals damage on a Tier 3, it deals 2 more.</p>",
  settings: [{ type: "bonusdamage", dmg: "2", dmgPool: "B", dmgSub: "", tiers: ["t3"], text: "", fxUuid: "", all: ["melee", "strike", "weapon", "__twohanded"], any: [], none: [] }] });
tal("Whirlwind", "icons/svg/sword.svg", "combat", { theme: "Great Weapon", prereqs: [pre("talent", "Heavy Blows")], actions: [uuidOf("actions", "Whirlwind")] });
tal("Bloodlust", "icons/svg/blood.svg", "combat", { actions: [uuidOf("actions", "Bloodlust")] });
tal("Brawler", "icons/svg/combat.svg", "combat", { theme: "Unarmed", description: "<p>You gain the Pummel Action. Your Fists don't have the Non-threatening property: you can flank with them.</p>", actions: [uuidOf("actions", "Pummel")], settings: [{ type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening" }] });
tal("Kickboxer", "icons/svg/combat.svg", "combat", { theme: "Unarmed", prereqs: [pre("talent", "Brawler")], description: "<p>You gain the Leg Sweep Action: a kick, so it needs no free hand. You can use it with your hands full.</p>", actions: [uuidOf("actions", "Leg Sweep")] });
tal("Aim", "icons/svg/target.svg", "combat", { theme: "Marksman", actions: [uuidOf("actions", "Aim")] });
tal("Ricochet", "icons/svg/target.svg", "combat", { theme: "Marksman", prereqs: [pre("talent", "Aim")], description: "<p>Your [Ranged, Weapon] Actions can bounce off one surface on the way. The projectile goes from the surface to the creature, and you calculate Line of Effect, Cover and Sight from the center of the surface. The distance is the total the projectile travels: if you shoot at a surface 5 squares from you and the target is within 6 squares of the surface, that is an 11-square shot. You must still perceive the creature. A bounced shot takes 1 Bane.</p>" });
tal("Long Draw", "icons/svg/target.svg", "combat", { theme: "Marksman", description: "<p>With a Projectile weapon, your far range has no Bane and your maximum range has 1 Bane instead of 2.</p>", settings: [sIgnore("rangeBane", P(["shot"]))] });
tal("Steady Nerves", "icons/svg/target.svg", "combat", { theme: "Marksman", description: "<p>Your [Ranged] Actions don't take the Banes for being Engaged.</p>", settings: [sIgnore("engagedSelf", P(["ranged"]))] });
// Mobility
tal("Battering Charge", "icons/svg/thrust.svg", "mobility", { description: "<p>When you use Charge, your Speed counts as 2 higher for its movement, and its Weapon Attack (1A) is Empowered 1.</p>" });
tal("Cut Through", "icons/svg/sword.svg", "mobility", { actions: [uuidOf("actions", "Cut Through")] });
// Magic
tal("Lesser Blessing", "icons/svg/holy-shield.svg", "magic", { theme: "Divine", traits: ["divine", "magic"], description: "<p>Pick one blessing from the list below, related to a god you follow. You gain its Action. (More blessings will be added.)</p>", choiceLabel: "Choose a blessing", choiceCount: 1, choiceOptions: [uuidOf("actions", "Rimebrand (Cold)")] });
tal("Sacred Weapon", "icons/svg/sword.svg", "magic", { theme: "Divine", prereqs: [pre("talent", "Lesser Blessing"), pre("trait", "divine")], prereqMode: "any", description: "<p>You gain the Sacred Weapon Action.</p>", actions: [uuidOf("actions", "Sacred Weapon")] });
// Class Talents
tal("Class Expertise", "icons/svg/book.svg", "combat", { level: 5, prereqs: [pre("level", "", 5)], description: "<p>Choose one Encounter or Daily Action from your class's Repertoire that you don't have. You gain it. (Drag it from the compendium onto your sheet.)</p>" });

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
// v0.0.185 (pack C2): the classes' levels as sections (module/classlevels.mjs), from the book's "by Level" tables; the class window reads them.
const U = names => names.map(n => uuidOf(/^(Font of Mercy|Divine Power|Sharpshooter|Marked Quarry|Hallowed Stance|Radiant Zeal|Mending Light|Killer's Focus|Elusive|Harrying Shots)$/.test(n) ? "features" : "actions", n));
const sec = (id, title, kind, o = {}) => ({ id, title, kind, mode: o.mode ?? "choice", pick: o.pick ?? 1, items: o.items ?? [], pairs: (o.pairs ?? []).map(([a, b]) => ({ a, b })), freq: o.freq ?? "any", category: o.category ?? "" });
// OT (book 2026-10-30): the Repertoire and Escalation lists with their options.
const PAL_PASSIVES = ["Font of Mercy", "Hallowed Stance", "Radiant Zeal", "Mending Light"], PAL_ACTIVES = ["Aura of Protection", "Divine Surge", "Shield of Faith", "Hand of Mercy"];
add("classes", "class", "Paladin", "icons/svg/angel.svg", {
  description: "<p>A holy warrior.</p>", category: "Class", flavor: "Your god's strength flows through your weapon and your hands.",
  choiceA: ["body", "appeal"], choiceB: ["mind", "instinct"], bodyMult: 4, mindMult: 4, rallyMod: 6, speedMod: 0,
  weaponAttrs: ["body", "appeal"], magicAttrs: ["mind", "appeal"], armorTraining: "heavy", features: [],
  repertoire: U(["Holy Wrath", "Word of Radiance", "Bulwark of Faith", "Consecrated Ground", "Miraculous Recovery", "Divine Intervention"]), escPassives: U(PAL_PASSIVES), escActives: U(PAL_ACTIVES),
  // Font of Mercy is in the Escalation Passives (it is one) and granted at level 1, so the Passive Escalation Pick never offers it.
  levels: [
    { sections: [sec("pal1attr", "Attribute increases", "attr", { pairs: [["body", "appeal"], ["mind", "instinct"]] }), sec("pal1core", "Core Features", "items", { mode: "granted", items: U(["Divine Power", "Font of Mercy"]) }),
      sec("pal1hall", "Hallmark Action", "items", { items: U(["Smite", "Lay On Hands"]) }), sec("pal1tal", "Talent", "talent"), sec("pal1enc", "Encounter Pick", "repertoire", { freq: "encounter" }),
      sec("pal1pass", "Passive Escalation Pick", "items", { items: U(PAL_PASSIVES) }), sec("pal1act", "Active Escalation Pick", "items", { items: U(PAL_ACTIVES) })] },
    { sections: [sec("pal2tal", "Talent", "talent")] },
    { sections: [sec("pal3daily", "Daily Pick", "repertoire", { freq: "daily" }), sec("pal3pass", "Passive Escalation Pick", "items", { items: U(PAL_PASSIVES) })] }
  ]
});
const ARC_PASSIVES = ["Killer's Focus", "Elusive", "Harrying Shots"], ARC_ACTIVES = ["Pinning Shot", "Twin Shot", "Vanish"];
add("classes", "class", "Archer", "icons/svg/target.svg", {
  description: "<p>An Archer fights from a distance.</p>", category: "Class", flavor: "You were made for the shot no one else would take.",
  choiceA: ["body", "instinct"], choiceB: ["mind", "appeal"], bodyMult: 3, mindMult: 2.5, rallyMod: 5,
  weaponAttrs: ["instinct", "body"], magicAttrs: ["mind", "appeal"], armorTraining: "medium", speedMod: 1, features: [],
  repertoire: U(["Marksman's Shot", "Volley", "Covering Fire", "Hunter's Focus", "Deadeye", "Rain of Arrows"]), escPassives: U(ARC_PASSIVES), escActives: U(ARC_ACTIVES),
  levels: [
    { sections: [sec("arc1attr", "Attribute increases", "attr", { pairs: [["body", "instinct"], ["mind", "appeal"]] }), sec("arc1core", "Core Features", "items", { mode: "granted", items: U(["Sharpshooter", "Marked Quarry"]) }),
      sec("arc1hall", "Hallmark Action", "items", { items: U(["Double Shot", "Rolling Shot"]) }), sec("arc1tal", "Talent", "talent"),
      sec("arc1pass", "Passive Escalation Pick", "items", { items: U(ARC_PASSIVES) }), sec("arc1act", "Active Escalation Pick", "items", { items: U(ARC_ACTIVES) })] },
    { sections: [sec("arc2tal", "Talent", "talent"), sec("arc2enc", "Encounter Pick", "repertoire", { freq: "encounter" })] },
    { sections: [sec("arc3daily", "Daily Pick", "repertoire", { freq: "daily" }), sec("arc3pass", "Passive Escalation Pick", "items", { items: U(ARC_PASSIVES) })] }
  ]
});

/* ------------------------------------------------------------------ NPCs (Actors, with their items inside) */
const { basicItemData, BASIC_ACTIONS, wanted } = await import("../module/basic.mjs");   // v0.0.214: no Weapon Attack or Fists Action on NPCs
const { fistsItemData } = await import("../module/fists.mjs");
const actors = [];
// v0.0.184: the id includes the type, so a weapon and its Basic attack can share a name ("Cudgel"); a duplicate id stopped the whole build.
const embedded = (actorName, type, name, img, system, flags = {}) => ({ _id: idOf("Item", type === "action" ? `${actorName}:${name}` : `${actorName}:${type}:${name}`), name, type, img, system, flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } });
const npcWeapon = (actorName, text, img) => { const w = parseWeaponText(text); if (w.problems.length) throw new Error(`${text}: ${w.problems.join("; ")}`); return embedded(actorName, "weapon", w.name, img, { ...weaponSystemData(w), wielded: true }); };
const npcAction = (actorName, name, img, system, flags = {}) => embedded(actorName, "action", name, img, system, flags);
// The Bestiary (v0.0.163): a role and ratings. By default its Weapon Attribute is High, the others Medium, Appeal Low (Appeal Medium when Appeal is its Weapon Attribute).
const npc = ({ name, img, role, weaponAttribute, powerAttribute = "mind", ratings = {}, speed = 5, extra = [] }) => {
  const r = { body: "medium", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "medium", [weaponAttribute]: "high", ...ratings };
  const basics = Object.keys(BASIC_ACTIONS).filter(k => wanted({ type: "npc" }, k)).map(k => { const d = basicItemData(k); return embedded(name, "action", d.name, d.img, d.system, d.flags); });
  // v0.0.184: the Speed is a rating (3 to 7, or Custom with system.speed), as the Builder sets it
  r.speed = [3, 4, 5, 6, 7].includes(speed) ? String(speed) : "custom";
  actors.push({ name, img, system: { level: 1, role, speed, weaponAttribute, powerAttribute, ratings: r, useEscalation: role === "elite" }, items: [...extra, ...basics, (() => { const f = fistsItemData(), e = embedded(name, "weapon", f.name, f.img, f.system, f.flags); e._id = idOf("Item", `${name}:weapon:Fists`); return e; })()] });
};
// v0.0.183 (Lucas: a complete rebuild, simple NPCs to test with): one NPC for each role, at Stage 1 (level 1). The Minion, the Standard and
// the Elite are the Bestiary's own examples (book: Example NPCs); the Grunt follows the same recipe. Damage is the book's average for the
// rating ([Mod] is added on Tier 2 and 3, as for any Weapon Action); the weapon in its hands is only what the attack looks like.
const atk = (n, w, name, img, ap, freq, t2, t3, extra = {}, effects = "") => npcAction(n, name, img, { category: "Basic attack", level: 0, traits: ["melee", "strike", "weapon"], frequency: freq, targets: "One creature", distance: "weapon", basicAttack: !extra.category, ...extra,
  versions: [version(ap, "", t2, t3, effects)] }, { twod12: { weaponId: w._id } });
{
  const n = "Goblin Sneak", knife = npcWeapon(n, "rusty knife: melee, pierce, 0/1d4/1d6", "icons/svg/dagger.svg");
  npc({ name: n, img: "icons/svg/mystery-man.svg", role: "minion", weaponAttribute: "instinct", speed: 7, ratings: { bodyHm: "low", mindHm: "low", wd: "low" },
    extra: [knife,
      atk(n, knife, "Rusty Knife", "icons/svg/dagger.svg", 1, "atwill", "1d2BPi", "1d6BPi"),
      atk(n, knife, "Dirty Trick", "icons/svg/combat.svg", 1, "round", "1d2BPi", '1d6BPi', { category: "Special Action" }, "Hindered (EoT).")] });
}
{
  const n = "Bandit Thug", club = npcWeapon(n, "cudgel: melee, blunt, 0/1d4/1d6", "icons/svg/hammer.svg");
  npc({ name: n, img: "icons/svg/mystery-man.svg", role: "grunt", weaponAttribute: "body",
    extra: [club,
      atk(n, club, "Cudgel", "icons/svg/hammer.svg", 1, "atwill", "1d3BBl", "1d6BBl"),
      atk(n, club, "Low Blow", "icons/svg/combat.svg", 2, "round", "2d6BBl", "2d10BBl", { category: "Special Action" })] });
}
{
  const n = "Orc Warrior", cleaver = npcWeapon(n, "cleaver: melee, slash, 0/1d8/2d8", "icons/svg/sword.svg");
  npc({ name: n, img: "icons/svg/mystery-man.svg", role: "standard", weaponAttribute: "body", ratings: { bodyHm: "high", mindHm: "low", wd: "low" },
    extra: [cleaver,
      atk(n, cleaver, "Cleaver", "icons/svg/sword.svg", 1, "atwill", "1d8BSl", "2d8BSl"),
      atk(n, cleaver, "Brutal Swing", "icons/svg/combat.svg", 2, "round", "2d6BSl", "2d10BSl", { category: "Special Action" }, "Prone."),
      atk(n, cleaver, "Hold the Line", "icons/svg/shield.svg", 1, "round", "2d8BSl", "3d10BSl", { category: "Special Action", reaction: true, reactionKind: "trigger", targets: "The attacker", trigger: "An ally within 2 squares is hit." })] });
}
{
  const n = "Ogre Chieftain", club = npcWeapon(n, "great club: two-handed, melee, blunt, 0/1d10/2d10", "icons/svg/hammer.svg");
  npc({ name: n, img: "icons/svg/mystery-man.svg", role: "elite", weaponAttribute: "body", speed: 4, ratings: { wd: "low" },
    extra: [club,
      atk(n, club, "Club", "icons/svg/hammer.svg", 1, "atwill", "1d10BBl", "2d10BBl"),
      npcAction(n, "Ground Slam", "icons/svg/explosion.svg", { category: "Special Action", level: 0, traits: ["area", "body", "save"], vs: "body", frequency: "encounter", targets: "All creatures in the Area",
        areaCfg: { size: 1, shape: "emanation", within: 0, targets: "all", center: true, keep: false, rounds: 0 },
        versions: [version(3, '3d10BBl,ModBBl,"Prone."', "2d8BBl,ModBBl", '"No effect."')] }),
      npcAction(n, "Rally the Tribe", "icons/svg/aura.svg", { category: "Special Action", level: 0, traits: ["focus"], frequency: "round", escalation: 1, targets: "Allies within 5 squares", distance: "5",
        versions: [noRoll(1, "Allies within 5 squares gain 1 Boon on their next [Weapon] Action.")] })] });
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
FX("Divine Vigil (Boon against Fear)", "icons/svg/aura.svg", { duration: dur(""), description: "<p>1 Boon on Saves against [Fear] Actions, while you are inside Divine Vigil's Aura.</p>", settings: [{ type: "boonbane", boons: 1, banes: 0, all: ["__save"], any: [], none: [], from: ["fear"] }] });
// P1 (v0.0.181): Divine Surge marks an enemy (the ally's extra damage is a button on the mark); Aura of Protection lasts the encounter.
FX("Divine Surge", "icons/svg/sun.svg", { duration: dur("rounds"), description: "<p>For 1 round, the next time an ally deals damage to this creature, they deal an extra @Damage[1d8[mind,holy]]{[M] 1d8 Ho} (Divine Surge). Then remove this mark.</p>", settings: [] });
FX("Aura of Protection", "icons/svg/aura.svg", { selfApplied: true, duration: dur(""), description: "<p>An Aura 2 around you until the end of the encounter: you and allies inside gain +1 Defense.</p>", settings: [{ type: "aura", auraSize: 2, auraWho: "allies", auraSelf: true, auraOutline: "#3fb68b", auraFill: "#3fb68b", fxUuid: uuidOf("effects", "Aura of Protection (+1 Defense)") }] });

// Features: the Paladin's core features, the passives of the picks, and the choices
add("features", "feature", "Font of Mercy", "icons/svg/regen.svg", { category: "Paladin Feature", level: 1, description: "<p>While your Escalation is 1 or more, when you or an ally within 5 squares of you uses a Rally Point, they heal your Power Modifier + 2 more.</p>", settings: [{ type: "rally", rallyBonus: "power + 2", rallyRange: 5, minEscalation: 1 }] });
add("features", "feature", "Radiant Zeal", "icons/svg/sun.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 1 or more, the first [Strike] Action you make each round that deals damage deals an extra [M] 1d6 Ho.</p>", settings: [{ type: "turnstart", fxUuid: uuidOf("effects", "Radiant Zeal"), minEscalation: 1 }] });
// v0.0.187 (Lucas): the Escalation passives that add damage once a round give an Effect each turn, used up by the Action (switch it off in the roll dialog).
FX("Radiant Zeal", "icons/svg/sun.svg", { selfApplied: true, duration: dur(""), minEscalation: 1, expireOn: ["strike"], description: "<p>Your next [Strike] Action that deals damage deals an extra [M] 1d6 Ho (Radiant Zeal, while your Escalation is 1 or more). Given again at the start of each of your turns.</p>", settings: [sBonus("1d6", "M", "Ho", P(["strike"]))] });
add("features", "feature", "Aegis", "icons/svg/shield.svg", { category: "Paladin Feature", level: 1, description: "<p>At the start of each encounter, choose one ally. While you are within 3 squares of them, you and they gain 1 Boon on Saves. (Not automated: choose the ally and add the Boon by hand.)</p>" });
add("features", "feature", "Mercy's Reward", "icons/svg/regen.svg", { category: "Paladin Feature", level: 1, description: "<p>When you heal an ally with Lay On Hands, your next Smite is Empowered 2. It is used up by that Smite. (Not automated.)</p>" });
add("features", "feature", "Divine Vigil", "icons/svg/aura.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, you and your allies in an Aura 3 around you gain 1 Boon on Saves against [Fear] Actions.</p>", settings: [{ type: "aura", auraSize: 3, auraWho: "allies", auraSelf: true, auraOutline: "#d4a62a", auraFill: "#d4a62a", fxUuid: uuidOf("effects", "Divine Vigil (Boon against Fear)"), minEscalation: 2 }] });
add("features", "feature", "Avenger's Oath", "icons/svg/sword.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, when an ally within 5 squares becomes Bloodied, you gain 1 Boon on your next [Strike] Action. (Not automated.)</p>" });
add("features", "feature", "Hallowed Stance", "icons/svg/statue.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, if you haven't left your square since your last turn, you and your adjacent allies take less Body damage, reduced by your Power Modifier (minimum 0). It reduces one instance of damage per Action; if the Action has several, the player chooses which one. (Not automated.)</p>" });
add("features", "feature", "Mending Light", "icons/svg/regen.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 1 or more, at the start of each of your turns, you or one ally within 5 squares of you heals your Power Modifier + 1. (Not automated: heal the creature you choose by hand.)</p>" });

// Actions: the picks
const PAL = "Paladin Feature";
add("actions", "action", "Vow of Enmity", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / one / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "Your next [Strike] Action against them gains 1 Boon, and you increase your Empowered value by 1 for that Strike."], ["1d8MH", "As Tier 2."]]),
  vt(2, [["", "No effect."], ["1d6MH", "As 1 AP."], ["1d6MH", "As Tier 2, and the target is Vulnerable 1 (EoT)."]]),
  vt(3, [["", "No effect."], ["1d6MH", "As 2 AP."], ["1d6MH", "As 2 AP."]])] }, "Paladin");
// OT (book 2026-10-30): Shield of Faith is a 0R Escalation Active (Escalation 1), 1d8 + your Power Modifier.
add("actions", "action", "Shield of Faith", "icons/svg/shield.svg", { category: "Paladin Escalation", level: 1, traits: ["divine", "focus"], frequency: "turn", escalation: 1, reaction: true, reactionKind: "interrupt", targets: "The creature the Strike would damage (you or an ally)", distance: "5", trigger: "A [Strike] Action would damage you or an ally within 5 squares.", versions: [
  noRoll(0, "The damage that Strike deals to the target is reduced by 1d8 + your Power Modifier.")] }, "Paladin");
add("actions", "action", "Rebuke", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "turn", reaction: true, reactionKind: "trigger", targets: "The triggering creature", distance: "reach", trigger: "An enemy within Reach damages an ally.", versions: [
  vt(1, [["1d4+1MH", ""], ["1d6+1MH", ""], ["1d8+1MH", ""]], "", { critical: "The target is Vulnerable 1 (EoT)." }),
  vt(2, [["1d6+1MH", "Pushed 1."], ["1d8+1MH", "Pushed 2."], ["1d10+1MH", "Pushed 3."]], "", { critical: "The target is Vulnerable 1 for 1 round." })] }, "Paladin");
add("actions", "action", "Sacred Weapon", "icons/svg/sword.svg", { category: "Magic Talent", level: 1, traits: ["divine", "focus"], frequency: "round", targets: "One / two creatures", distance: "reach", versions: [
  noRoll(1, "You touch a creature (yourself or an ally). If they are not Empowered, they become Empowered 1 for 1 round. If they are Empowered 1 (from any source), they become Empowered 2 for 1 round. If they are Empowered 2 or higher, no effect."),
  noRoll(2, "As 1 AP, but you can touch up to two creatures.")] }, "Talents");
add("actions", "action", "Champion's Challenge", "icons/svg/combat.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "1 Bane on [Strike] and [Power] Actions against anyone other than you (EoT)."], ["", "As Tier 2, but 2 Banes instead of 1."]]),
  vt(2, [["", "No effect."], ["", "As 1 AP."], ["", "As 1 AP."]])] }, "Paladin");
add("actions", "action", "Word of Radiance", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["area", "divine", "magic"], frequency: "encounter", targets: "All enemies in the Area", areaCfg: { size: 2, shape: "emanation", within: 5, targets: "enemies", center: false, keep: false, rounds: 0 }, versions: [
  vt(2, [["1d10MH", ""], ["2d8MH", ""], ["3d6MH", "Prone."]]),
  vt(3, [["2d6MH", ""], ["2d10MH", ""], ["3d8MH", "Prone."]], "", { areaSize: 3 })] }, "Paladin");   // v0.0.215: "Area: 2 / 3 Emanation", no sentence
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
add("actions", "action", "Miraculous Recovery", "icons/svg/regen.svg", { category: PAL, level: 1, traits: ["divine", "focus"], frequency: "daily", targets: "One willing creature", distance: "reach", versions: [
  noRoll(2, "The target heals twice what 1 Rally Point would heal, and you end one non-permanent effect of your choice on them."),
  noRoll(3, "As 2 AP, but three times what 1 Rally Point would heal.")] }, "Paladin");
add("actions", "action", "Consecrated Ground", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "area"], frequency: "daily", targets: "All creatures in the Area", areaCfg: { size: 2, shape: "emanation", within: 10, targets: "all", center: false, keep: true, rounds: 3 }, versions: [
  noRoll(2, "For 3 rounds, enemies in the area take 1 Bane on [Weapon], [Power] and [Signature] Actions, and allies in it heal 1d4 at the start of each of their turns."),
  { ...noRoll(3, "As 2 AP, but for 5 rounds."), areaSize: 3 }] }, "Paladin");   // v0.0.215: "Area: 2 / 3 Emanation", as the book
add("actions", "action", "Divine Intervention", "icons/svg/angel.svg", { category: PAL, level: 1, traits: ["divine"], frequency: "daily", reaction: true, reactionKind: "interrupt", targets: "One creature", distance: "5", trigger: "You or an ally within 5 squares would go Down.", versions: [
  noRoll(2, "Instead of going Down, the creature's total damage becomes 1 less than their Health Pool.")] }, "Paladin");
// the Escalation Actives
const PE = "Paladin Escalation";
add("actions", "action", "Call to Arms", "icons/svg/angel.svg", { category: PE, level: 1, traits: ["divine"], frequency: "round", escalation: 1, targets: "One Down ally", distance: "3", versions: [noRoll(0, "The ally can use 1 Rally Point.")] }, "Paladin");
add("actions", "action", "Divine Surge", "icons/svg/sun.svg", { category: PE, level: 1, traits: ["divine"], frequency: "round", escalation: 1, targets: "One enemy", distance: "5", versions: [noRoll(0, "For 1 round, the next time an ally deals damage to the target, they deal an extra [M] 1d8 Ho. You gain @Guard[2d6|self:yes]{Guard 2d6}.", [uuidOf("effects", "Divine Surge")])] }, "Paladin");
add("actions", "action", "Hand of Mercy", "icons/svg/regen.svg", { category: PE, level: 1, traits: ["divine", "focus"], frequency: "round", escalation: 1, targets: "One ally", distance: "5", versions: [
  noRoll(1, "Choose one: the ally ends one effect on them that is EoT or has 1 round left; or, if the ally is Down, they can use @Rally[1]{1 Rally Point}.")] }, "Paladin");
add("actions", "action", "Judgment", "icons/svg/sword.svg", { category: PE, level: 1, traits: ["divine", "magic"], frequency: "round", escalation: 2, targets: "One enemy", distance: "reach", versions: [vt(1, [["", "No effect."], ["2d6MH", "Hindered (EoT)"], ["2d8MH", "Hindered (EoT)"]])] }, "Paladin");
add("actions", "action", "Sanctified Ground", "icons/svg/aura.svg", { category: PE, level: 1, traits: ["divine", "area"], frequency: "round", escalation: 2, targets: "All creatures in the Area", areaCfg: { size: 1, shape: "emanation", within: 5, targets: "all", center: false, keep: true, rounds: 2 }, versions: [noRoll(1, "You fill the Emanation with Holy light for 2 rounds. Enemies in it take 1 Bane on [Strike] Actions.")] }, "Paladin");

add("actions", "action", "Mark Quarry", "icons/svg/target.svg", { category: "Marked Quarry", level: 1, traits: ["focus"], marksTarget: true, frequency: "turn", targets: "One creature", distance: "",
  versions: [noRoll(0, "The targeted creature becomes your Marked Quarry: at the start of an encounter, or as a 0R [Focus] when yours died or went Down."), noRoll(1, "The targeted creature becomes your Marked Quarry instead of the one you had (once per turn).")] }, "Archer");
add("effects", "effect", "Hunter's Focus", "icons/svg/eye.svg", { selfApplied: true, duration: dur(""), description: "<p>For the rest of the encounter, against your Marked Quarry: you gain 1 Boon and Empowered 1, and you take less damage from each of their Actions, reduced by your Signature Modifier (you choose which instance). The damage reduction is not automated.</p>", settings: [sBoon(1, P(), { vsMarked: true }), { type: "damagestep", empowered: 1, ...P(), vsMarked: true }] }, "Archer");
/* ------------------------------------------------------------------ The Archer (from the book's cards; Save Actions and Marked Quarry are automated in the next passes) */
add("actions", "action", "Quick Draw", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "turn", "targets": "The triggering creature", "distance": "weapon", "reaction": true, "reactionKind": "interrupt", "trigger": "An enemy within 5 squares moves closer to you.", versions: [noRoll(1, "Make a @Use[Weapon Attack|label:Weapon Attack (1A)] against the triggering creature.")] }, "Archer");
add("actions", "action", "Wing Clip", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [vt(1, [["1WB", ""], ["1WB, 1d4BPi", ""], ["1WB, 1d6BPi", "Hindered (EoT)"]], "")] }, "Archer");
add("actions", "action", "True Shot", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["focus", "self"], "frequency": "round", versions: [noRoll(1, "Your next [Strike] Action ignores Cover.")] }, "Archer");
add("actions", "action", "Suppressing Fire", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [noRoll(1, "Until the end of your next turn, the target takes 1 Bane on [Ranged, Strike] and [Power, Ranged] Actions against creatures other than you.")] }, "Archer");
add("actions", "action", "Volley", "icons/svg/target.svg", { category: "Archer Feature", level: 1, traits: ["area", "ranged", "save", "shot", "weapon"], frequency: "encounter", vs: "instinct", targets: "All creatures in the Area", areaCfg: { size: 2, shape: "emanation", within: 0, withinRange: "normal", targets: "all", center: false, keep: false, rounds: 0 }, versions: [
  vt(2, [["2d8BPi, ModBPi", "Hindered (EoT)"], ["1d10BPi, ModBPi", ""], ["1d4BPi", ""]], "")] }, "Archer");
add("actions", "action", "Marksman's Shot", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "encounter", "targets": "One creature", "distance": "weapon", versions: [vt(2, [["1WB, 1d8BPi", ""], ["1WB, 3d6BPi", ""], ["1WB, 4d6BPi", "Vulnerable 2 (EoT)."]], "")] }, "Archer");
add("actions", "action", "Covering Fire", "icons/svg/target.svg", { category: "Archer Feature", level: 1, traits: ["area", "ranged", "shot", "weapon"], frequency: "encounter", targets: "All creatures in the Area", areaCfg: { size: 2, shape: "emanation", within: 0, withinRange: "normal", targets: "all", center: false, keep: true, rounds: 3 }, versions: [
  noRoll(2, "For 3 rounds (the area doesn't move), enemies in the area take 1 Bane on [Strike] Actions, and allies in it gain +1 Defense.")] }, "Archer");
add("actions", "action", "Rain of Arrows", "icons/svg/target.svg", { category: "Archer Feature", level: 1, traits: ["area", "ranged", "save", "shot", "weapon"], frequency: "daily", vs: "instinct", targets: "All enemies in the Area", areaCfg: { size: 3, shape: "emanation", within: 0, withinRange: "maximum", targets: "enemies", center: false, keep: false, rounds: 0 }, versions: [
  vt(2, [["2d8BPi, ModBPi", "Prone"], ["2d6BPi, ModBPi", ""], ["1d6BPi", ""]], "")] }, "Archer");
add("actions", "action", "Hunter's Focus", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["focus", "self"], "frequency": "daily", versions: [noRoll(1, "For the rest of the encounter, against your Marked Quarry (a new Marked Quarry when you choose one): you gain 1 Boon and Empowered 1 against them, and you take less damage from each of their Actions, reduced by your **Signature Modifier** (you choose which instance of its damage is reduced).", [uuidOf("effects", "Hunter's Focus")])] }, "Archer");
add("actions", "action", "Deadeye", "icons/svg/target.svg", { category: "Archer Feature", level: 1, traits: ["ranged", "shot", "strike", "weapon"], frequency: "daily", targets: "One creature", distance: "weapon", versions: [
  vt(1, [["1WB", ""], ["1WB, 1d6BPi", ""], ["1WB, 2d6BPi", "Prone"]], "This Action is Favored (tick Favored in the roll dialog).")] }, "Archer");
add("actions", "action", "Steady Aim", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 1, versions: [noRoll(0, "Your next [Shot, Strike] gains 1 Boon, and all of the weapon's ranges increase by 5.")] }, "Archer");
add("effects", "effect", "Vanish (+1 Defense)", "icons/svg/invisible.svg", { selfApplied: true, duration: dur("rounds"), description: "<p>+1 Defense for 1 round (Vanish).</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] }, "Archer");
add("actions", "action", "Vanish", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, traits: ["self"], frequency: "round", distance: "self", escalation: 1, versions: [
  noRoll(0, "@Move[evade|distance:2]. You gain +1 Defense for 1 round.", [uuidOf("effects", "Vanish (+1 Defense)")])] }, "Archer");
// v0.0.189 (Lucas): Pinning Shot and Twin Shot give their Weapon Attack as a granted use (the sheet's button turns blue), as Double Shot does.
const grant1 = { type: "grant", grantAction: "Weapon Attack", grantCount: 1, grantAp: 0, grantDistinct: false, boons: 0, banes: 0 };
add("effects", "effect", "Pinning Shot", "icons/svg/net.svg", { selfApplied: true, duration: dur("eot"), expireOn: ["strike"], description: "<p>Your next Weapon Attack this turn is free; on a Tier 2 or 3 the target is Immobilized (EoT) (Pinning Shot).</p>", settings: [grant1, sBonus("", "B", "", P(["strike"]), { tiers: ["t2", "t3"], text: "Immobilized (EoT)", fxUuid: uuidOf("conditions", "Immobilized") })] }, "Archer");
add("actions", "action", "Pinning Shot", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, traits: ["ranged", "shot", "strike", "weapon"], frequency: "round", targets: "One creature", distance: "weapon", escalation: 2, versions: [
  noRoll(1, "Make a [Ranged] Weapon Attack (1A). On a Tier 2 or 3, the target is Immobilized (EoT).", [uuidOf("effects", "Pinning Shot")])] }, "Archer");
add("effects", "effect", "Twin Shot", "icons/svg/target.svg", { selfApplied: true, duration: dur("eot"), expireOn: ["strike"], description: "<p>Your next Weapon Attack this turn is free: target two creatures no more than 5 squares apart; it deals an extra [B] 1d6 Pi to each of them (Twin Shot).</p>", settings: [grant1, sBonus("1d6", "B", "Pi", P(["ranged", "shot", "strike"]))] }, "Archer");
add("actions", "action", "Twin Shot", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, traits: ["ranged", "shot", "strike", "weapon"], frequency: "round", targets: "Two creatures", distance: "weapon", escalation: 3, versions: [
  noRoll(1, "Make one [Ranged, Shot] Weapon Attack (1A) and compare its result to two different creatures no more than 5 squares apart (target both). It deals an extra [B] 1d6 Pi to each of them.", [uuidOf("effects", "Twin Shot")])] }, "Archer");
add("actions", "action", "Perfect Shot", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 3, versions: [noRoll(0, "Your next [Shot, Strike] is Favored and Empowered 2, and ignores Cover.")] }, "Archer");
add("features", "feature", "Marked Quarry", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>At the start of each encounter, choose one enemy as your <b>Marked Quarry</b>. You gain 1 Boon on [Shot, Strike] Actions against them, and those Actions deal [B] [Mod] on a Tier 1. When they die or go Down, you can choose a new Marked Quarry (0R [Focus]). Once per turn, you can change your Marked Quarry during an encounter by spending 1 AP [Focus].</p>", settings: [sBoon(1, P(["shot", "strike"]), { vsMarked: true }), sBonus("[Mod]", "B", "", P(["shot", "strike"]), { tiers: ["t1"], vsMarked: true }),
  sMessage("encounter", "choose a creature to mark. Target it and use your marking Action:", "Mark Quarry"),
  sMessage("markDown", "your mark, {mark}, went Down. Choose a new one: target a creature and use your marking Action:", "Mark Quarry")], actions: [uuidOf("actions", "Mark Quarry")] }, "Archer");
add("features", "feature", "Bow Mastery", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>Choose one Projectile weapon, such as a bow or a crossbow. You start with **3 Mastery** with it, so its Weapon Technique is unlocked (see Mastery).</p>", settings: [sMastery("projectile", 3)] }, "Archer");
add("features", "feature", "Patient Hunter", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, if you have not left your square since the start of your last turn, gain 1 Boon on [Shot, Strike] Actions until you leave your square.</p>" }, "Archer");
add("features", "feature", "Elusive", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 1 or more, the first [Strike] Action against you each round takes 1 Bane.</p>", settings: [{ type: "boonbane", against: true, boons: 0, banes: 1, ...P(["strike"]), oncePerRound: true, minEscalation: 1 }] }, "Archer");
add("features", "feature", "Harrying Shots", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 1 or more, the first time each round you deal damage to your Marked Quarry with a [Shot] Action, they take 1 Bane on [Strike] Actions until the end of their next turn. (Apply the Harried effect from the compendium.)</p>" }, "Archer");
add("effects", "effect", "Harried", "icons/svg/downgrade.svg", { duration: dur("eot"), description: "<p>1 Bane on [Strike] Actions until the end of your next turn (Harrying Shots).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, ...P(["strike"]) }] }, "Archer");
add("features", "feature", "Killer's Focus", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, your first [Shot, Strike, Weapon] Action each round deals an extra [B] 1d6 Pi.</p>", settings: [{ type: "turnstart", fxUuid: uuidOf("effects", "Killer's Focus"), minEscalation: 2 }] }, "Archer");
add("effects", "effect", "Killer's Focus", "icons/svg/target.svg", { selfApplied: true, duration: dur(""), minEscalation: 2, expireOn: ["shot", "strike", "weapon"], expireAll: true, description: "<p>Your next [Shot, Strike, Weapon] Action deals an extra [B] 1d6 Pi (Killer's Focus, while your Escalation is 2 or more). Given again at the start of each of your turns.</p>", settings: [sBonus("1d6", "B", "Pi", P(["shot", "strike", "weapon"]))] }, "Archer");

// v0.0.185: the pick Features of v0.0.181 (Hallmark Action, Encounter Pick, Talent (Level 1)...) are gone: the classes have levels now.
// The cards the P1 and A1 builds left out (book/paladin-old-cards.md, book/archer-old-cards.md): kept in the compendium, in folders of their own, for the Options step.
const OLD = { "Paladin (old cards)": ["Aegis", "Mercy's Reward", "Divine Vigil", "Avenger's Oath", "Vow of Enmity", "Rebuke", "Champion's Challenge", "Divine Retribution", "Call to Arms", "Judgment", "Sanctified Ground", "Divine Vigil (Boon against Fear)"],
  "Archer (old cards)": ["Precise Aim", "Precise Aim (1 Boon)", "Precise Aim (2 Boons)", "Quick Draw", "Wing Clip", "True Shot", "Suppressing Fire", "Steady Aim", "Perfect Shot", "Bow Mastery", "Patient Hunter"] };
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
// v0.0.185: built as the class window would: the class copy records the choices of level 1 (flags classPicks / classAttrs, chosenAttrs) and
// every item the class gave carries classLevel and classSection (a Talent also its slot), so levelling and re-dropping the class work on them.
// v0.0.189 (Lucas: "too similar"): picks by level ({ 1: {...}, 2: {...}, 3: {...} }), so a PC can be built at level 3 as the class window would.
const pc = ({ name, img, species, chosen, cls, attrs, picks, level = 1, weapon, armor = "", extras = [] }) => {
  const c = docOf("class", cls), lv1 = c.system.levels[0].sections, attrSec = lv1.find(x => x.kind === "attr");
  const byLevel = typeof Object.values(picks)[0] === "string" ? { 1: picks } : picks;
  const pickedAt = L => Object.fromEntries(Object.entries(byLevel[L] ?? {}).map(([id, n]) => [id, [uuidOf(PACK_OF[docOf(lv1Type(n), n).type], n)]]));
  const classPicks = Object.fromEntries(Array.from({ length: level }, (_, i) => [i + 1, pickedAt(i + 1)]));
  const items = [copyDoc(name, "species", species, {}, chosen ? { chosen } : {}),
    copyDoc(name, "class", cls, { classPicks, classAttrs: { 1: attrs } }, { chosenA: attrs[0], chosenB: attrs[1], chosenAttrs: attrs, chosenWeapon: "", chosenMagic: "", modPriority: "weapon" })];
  if (!attrSec) throw new Error(`${cls}: no Attribute section at level 1`);
  const give = (n, section, kind, L) => {
    const type = lv1Type(n), it = copyDoc(name, type, n, { classLevel: L, classSection: section, ...(type === "feature" ? { grantedBy: "class", level: L } : {}), ...(kind === "talent" ? { slot: `class:${L}:${section}:0` } : {}) });
    items.push(it);
    for (const u of (it.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { [type === "talent" ? "talentId" : "featureId"]: it._id })); }
  };
  for (let L = 1; L <= level; L++) {
    const secs = c.system.levels[L - 1]?.sections ?? [];
    for (const x of secs.filter(x => x.kind === "items" && x.mode === "granted")) for (const u of x.items) give(byUuid(u).name, x.id, x.kind, L);
    for (const [id, n] of Object.entries(byLevel[L] ?? {})) { const sec = secs.find(x => x.id === id); if (!sec) throw new Error(`${cls} level ${L}: no section ${id}`); give(n, id, sec.kind, L); }
  }
  for (const [type, n] of extras) items.push(copyDoc(name, type, n, {}));
  const w = copyDoc(name, "weapon", weapon, {}, { wielded: true });
  items.push(w);
  for (const u of (w.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { weaponId: w._id })); }
  for (const k of Object.keys(BASIC_ACTIONS)) { const d = basicItemData(k); items.push({ _id: idOf("Item", `${name}:basic:${d.name}`), name: d.name, type: "action", img: d.img, system: d.system, flags: d.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  { const f = fistsItemData(); items.push({ _id: idOf("Item", `${name}:Fists`), name: f.name, type: "weapon", img: f.img, system: f.system, flags: f.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  if (armor) items.push(copyDoc(name, "armor", armor, {}, { worn: true }));
  pcs.push({ name, img, system: { level }, items });
};
// The type of an item by its name (a Feature, a Talent or an Action), for the picks above.
// v0.0.188: a Talent before the Action it grants (Aim).
function lv1Type(n) { const d = ["talent", "feature", "action"].map(t => docs.find(x => x.name === n && x.type === t)).find(Boolean); if (!d) throw new Error(`No item called ${n}`); return d.type; }
// v0.0.183: the four level 1 builds of the ruler (book/ruler/classes: paladin-smite-1, paladin-hands-1, archer-double-1, archer-rolling-1), Humans all.
// v0.0.189 (Lucas: the compendium PCs test different cards): two builds a class, one at level 1 and one at level 3, every pick different.
pc({ name: "Paladin 1 (Smite, Heavy Blows)", img: "icons/svg/sun.svg", species: "Human", chosen: ["body", "appeal"], cls: "Paladin", attrs: ["body", "mind"],
  picks: { pal1hall: "Smite", pal1tal: "Heavy Blows", pal1enc: "Holy Wrath", pal1pass: "Radiant Zeal", pal1act: "Divine Surge" }, weapon: "Greatsword", armor: "Heavy Armor" });
pc({ name: "Paladin 3 (Lay On Hands, Protector)", img: "icons/svg/regen.svg", species: "Dwarf", cls: "Paladin", attrs: ["appeal", "mind"], level: 3,
  picks: { 1: { pal1hall: "Lay On Hands", pal1tal: "Opportunity Attack", pal1enc: "Word of Radiance", pal1pass: "Mending Light", pal1act: "Shield of Faith" },
    2: { pal2tal: "Bloodlust" }, 3: { pal3daily: "Miraculous Recovery", pal3pass: "Hallowed Stance" } }, weapon: "Greatsword", armor: "Heavy Armor" });
pc({ name: "Archer 1 (Double Shot, Marksman)", img: "icons/svg/target.svg", species: "Elf", cls: "Archer", attrs: ["instinct", "mind"],
  picks: { arc1hall: "Double Shot", arc1tal: "Aim", arc1pass: "Killer's Focus", arc1act: "Pinning Shot" }, weapon: "Crossbow", armor: "Medium Armor" });
pc({ name: "Archer 3 (Rolling Shot, Kickboxer)", img: "icons/svg/wing.svg", species: "Human", chosen: ["body", "instinct"], cls: "Archer", attrs: ["body", "appeal"], level: 3,
  picks: { 1: { arc1hall: "Rolling Shot", arc1tal: "Brawler", arc1pass: "Elusive", arc1act: "Twin Shot" },
    2: { arc2tal: "Kickboxer", arc2enc: "Volley" }, 3: { arc3daily: "Rain of Arrows", arc3pass: "Harrying Shots" } }, weapon: "Crossbow", armor: "Medium Armor" });

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
 "Rusty Knife": "A notched blade, quick and dirty.",
 "Dirty Trick": "Sand in the eyes, a heel on the toes, and the goblin is gone.",
 "Cudgel": "A heavy stick and no reason to hold back.",
 "Low Blow": "No rules in a back alley.",
 "Cleaver": "A butcher's blade, swung by someone who enjoys it.",
 "Brutal Swing": "The orc puts its whole weight behind one wild arc.",
 "Hold the Line": "Touch its kin, and the orc answers.",
 "Club": "A tree trunk with a handle.",
 "Ground Slam": "The ogre brings both fists down, and the ground jumps.",
 "Rally the Tribe": "One bellow, and the whole tribe fights harder.",
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
 "Battering Charge": "Nothing slows you down once you start running.",
 "Bloodlust": "The red haze settles, and you stop caring about pain.",
 "Brawler": "Your hands have won more fights than any blade.",
 "Pummel": "A flurry of blows until something gives.",
 "Kickboxer": "Your legs hit as hard as your fists.",
 "Leg Sweep": "A low kick takes their legs out from under them.",
 "Whirlwind": "You spin, and everything within reach feels the blade.",
 "Lock & Loose": "A bolt to the knee, and they go nowhere.",
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
// v0.0.188 (OT): the book's Flavor lines of the new cards (Mark Quarry's is new here).
FLAVOR["Challenge"] = "You call them out, and they cannot look away.";
FLAVOR["Class Expertise"] = "You have studied your craft longer than most.";
FLAVOR["Mending Light"] = "Light gathers where you stand, and the hurt are drawn to it.";
FLAVOR["Harrying Shots"] = "Every arrow says the same thing: not yet.";
FLAVOR["Mark Quarry"] = "One name, one face, and the rest of the field goes quiet.";

for (const d of docs) if (["action", "talent", "feature"].includes(d.type) && FLAVOR[d.name]) d.system.flavor = FLAVOR[d.name];
// v0.0.189 (Lucas): how much Foundry does for each current card (a chip on the card). Gold: all of it; Silver: one part by hand;
// Bronze: buttons or a compendium effect, the rest by hand; Not implemented: text only. Old cards and Basic Actions have none set.
const AUTO = {
  gold: ["Smite", "Lay On Hands", "Holy Wrath", "Word of Radiance", "Font of Mercy", "Radiant Zeal", "Divine Power", "Aura of Protection", "Double Shot", "Rolling Shot", "Marksman's Shot", "Volley", "Rain of Arrows",
    "Marked Quarry", "Mark Quarry", "Killer's Focus", "Elusive", "Pinning Shot", "Vanish", "Long Draw", "Steady Nerves", "Heavy Blows", "Whirlwind", "Bloodlust", "Brawler", "Pummel", "Kickboxer", "Leg Sweep",
    "Battering Charge", "Lesser Blessing", "Rimebrand (Cold)", "Rimebrand", "Lay On Hands (Holy Strike)", "Smite (+1 Defense)", "Vanish (+1 Defense)"],
  silver: ["Sharpshooter", "Hunter's Focus", "Twin Shot", "Deadeye", "Aim", "Opportunity Attack", "Cut Through", "Divine Surge", "Bulwark of Faith"],
  bronze: ["Covering Fire", "Consecrated Ground", "Hand of Mercy", "Harrying Shots", "Harried", "Challenge", "Challenged"],
  none: ["Shield of Faith", "Miraculous Recovery", "Divine Intervention", "Mending Light", "Hallowed Stance", "Ricochet", "Sacred Weapon", "Class Expertise"]
};
// v0.0.215 (Lucas, playtest 2): what each Bronze and Silver card still leaves to the players (the diamond's tooltip, "By hand" on the item).
const AUTO_NOTE = {
  "Hunter's Focus": "the damage reduction against your Marked Quarry (lower the damage yourself).",
  "Aim": "ignoring Low Cover (untick the Low cover chip in the roll dialog).",
  "Deadeye": "Favored (tick it in the roll dialog).",
  "Divine Surge": "the ally clicks the button on the mark for the extra [M] 1d8 Ho.",
  "Covering Fire": "the Bane and +1 Defense for creatures in the area (the area is placed and kept for 3 rounds).",
  "Consecrated Ground": "the Banes and the 1d4 healing for creatures in the area (the area is placed and kept).",
  "Hand of Mercy": "ending the effect (the Rally Point button works).",
  "Harrying Shots": "apply the Harried effect from the compendium.",
  "Challenge": "apply the Challenged effect from the compendium.",
  "Challenged": "the attacker unticks the Bane when it attacks the creature that challenged it."
};
for (const [rank, list] of Object.entries(AUTO)) for (const d of docs) if (list.includes(d.name) && ["action", "feature", "talent", "effect"].includes(d.type) && !/old cards/.test(d.folder ?? "") && !d.system.automation) { d.system.automation = rank; if (AUTO_NOTE[d.name] && ["bronze", "silver"].includes(rank)) d.system.automationNote = AUTO_NOTE[d.name]; }
// v0.0.187: the Escalation Passives say so (the Features tab's Escalation section); Font of Mercy is one too (the book).
for (const d of docs) if (d.type === "feature" && (/escalation/i.test(d.system.category ?? "") || d.name === "Font of Mercy")) d.system.escalationPassive = true;
for (const a of [...actors, ...pcs]) for (const it of (a.items ?? [])) if (["action", "talent", "feature"].includes(it.type) && FLAVOR[it.name]) { it.system ??= {}; it.system.flavor = FLAVOR[it.name]; }

export { docs, folders, uuidOf, actors, pcs };
