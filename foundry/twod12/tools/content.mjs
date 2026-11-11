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
const against = (boons, banes, any, bbName = "") => ({ type: "boonbane", against: true, boons, banes, bbName, all: [], any, none: [] });   // v0.0.301: bbName, the Boons' and Banes' name (Field...)
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
cond("Immobilized", "icons/svg/net.svg", "<p>You can't use Move Actions or Evade. Unless otherwise specified, you can remove Immobilized by spending 1 AP [Move]: the one Move Action you can use while Immobilized (the Break Free Basic Action).</p>", [speedSetting("override", "0")]);
cond("Leaning", "icons/svg/eye.svg", "<p>You calculate cover from one of your corners instead of the center, and your own cover is reduced by 1 level (Total → High → Medium → Low → none: leaning out of Total cover, you can be targeted). Click a corner of your square on the map to lean toward it: your token peeks out a little past it, unless a wall is in the way. It ends at the end of your turn, or when you stop Leaning (at any time on your turn, at no cost).</p>", []);
cond("Prone", "icons/svg/falling.svg", "<p>Melee Actions against you gain 1 Field Boon, and Ranged Actions against you suffer 1 Field Bane. You can't Evade. The only [Move] Actions you can use are Crawl and Stand.</p>", [against(1, 0, ["melee"], "field"), against(0, 1, ["ranged"], "field")]);

add("effects", "effect", "Hindered (until Move)", "icons/svg/downgrade.svg", { duration: { type: "rounds", rounds: 1 }, expireOn: ["move"], description: "<p>For 1 round, the creature is Hindered until they use a Move Action. The effect lasts through that Move Action and ends once it is resolved.</p>", settings: [speedSetting("override", "floor(speed/2)")] }, "Conditions");
const coldSetting = (dmg, tiers, text = "", fxUuid = "") => ({ type: "bonusdamage", dmg, dmgPool: "M", dmgSub: "Co", tiers, text, fxUuid, all: ["weapon"], any: [], none: [] });
// OT (book 2026-10-30): Rimebrand is a turn buff with no roll.
add("effects", "effect", "Rimebrand", "icons/svg/frozen.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>Until the end of your turn, your [Weapon] Actions deal an extra [R] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT).</p>", settings: [coldSetting("1d4", ["t1", "t2", "t3"]), coldSetting("", ["t3"], "Hindered (EoT)", uuidOf("conditions", "Hindered"))] }, "Lesser Blessing");

const aimSetting = (n, all = ["ranged", "strike", "weapon"]) => ({ type: "boonbane", boons: n, banes: 0, all, any: [], none: [] });
for (const n of [1, 2]) add("effects", "effect", `Precise Aim (${n} Boon${n === 1 ? "" : "s"})`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "shot", "strike", "weapon"], expireAll: true, description: `<p>${n} Boon${n === 1 ? "" : "s"} on your next [Ranged, Shot, Strike, Weapon] Action.</p>`, settings: [aimSetting(n, ["ranged", "shot", "strike", "weapon"])] }, "Sharpshooter");

const bloodlustFrom = ["strike", "melee", "ranged", "weapon", "magic", "divine", "focus", "handle", "move"];
cond("Vulnerable", "icons/svg/hazard.svg", "<p>Actions against you gain as many Boons as the value of Vulnerable (Vulnerable 2: 2 Boons). Only the highest Vulnerable value applies.</p>", [{ ...against(1, 0, []), byValue: true }], { valued: true });
cond("Slowed", "icons/svg/stoned.svg", "<p>Slowed always has a value. You regain that many fewer AP at the start of your turn (Slowed 2: you regain 2), and your most AP is lowered by the value too. You don't lose AP when you become Slowed, only when you regain AP. Slowed never changes your Reaction AP. Desperate, Dying and Shattered make you Slowed 1, or 1 more (to at most 3), while they last. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Quickened", "icons/svg/lightning.svg", "<p>Quickened always has a value. Your most AP, and the AP you regain at the start of your turn, rise by that much (Quickened 2: you regain 6). You don't gain AP when you become Quickened, only when you regain AP. Quickened never changes your Reaction AP, and the extra AP you don't spend become Guard like any other. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Imperiled", "icons/svg/hazard.svg", "<p>You barely avoided a Deadly Hazard (hanging from a ledge, at the lip of a lava pit...). All your Checks and Saves are Doomed, and you are Vulnerable 3. At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled; you are Slowed 1 for that turn. A creature can help you get to safety with the Interact Action (1 AP, Handle).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 3, valued: true }] });
cond("Squeezing", "icons/svg/net.svg", "<p>You stopped moving while squeezing through a space one rank smaller than you: you don't fit completely in the space you are in. All your Rolls are Doomed and you are Vulnerable equal to half your level (rounded up) until you move to a space where you fit completely. Each square you move while squeezing counts as Difficult Terrain. The GM applies this condition (it is not detected on the map).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 1, valued: true, mode: "halfLevel" }] });
// v0.0.314 (pack AU; book, Chapter 8, the conditions pass): the eight conditions as items, each with general rules (data.mjs EffectData):
// Frightened works only while its creature sees the origin; Taunted's Bane counts only against creatures other than the origin; Sickened N's
// Banes are on Body and Instinct Saves; Staggered blocks Reactions; Dazed N takes AP now; Grabbed brings Immobilized and ends when the holder
// goes Down; Bleed is damage at the end of each turn (a card's own dice: @Condition[bleed|dmg:1d6|pool:R|sub:Ho|attrs:mi/ap]); Blinded is
// Foundry's blind status (no sight: twod12.mjs CONFIG.specialStatusEffects).
const bb1 = (banes, extra = {}) => ({ type: "boonbane", boons: 0, banes, all: [], any: [], none: [], ...extra });
cond("Frightened", "icons/svg/terror.svg", "<p>Frightened is always <b>of</b> a source (the creature or object that applied it). While you see the source (Clear or Obscured to you), all your Rolls take 1 Bane, the Save that would end Frightened included, and every square that brings you closer to it is Difficult Terrain for you (Forced Movement ignores it). Out of your Sight (a wall, Darkness), the Bane and the Difficult Terrain stop until you see it again.</p>", [bb1(1), { type: "move", text: "closer", moveHow: "difficult" }], { whileSeen: true, originFromUser: true, hover: "" });   // v0.0.323 (PACK EFFECT-SHEET): the Movement limit is a rule now; the hover card is built from the rules (its old text was the same words)
cond("Taunted", "icons/svg/target.svg", "<p>Taunted is always <b>by</b> a creature (the one that applied it). Your Actions against any creature other than it take 1 Bane.</p>", [bb1(1, { vsOrigin: "not" })], { originFromUser: true, hover: "1 Bane on your Actions against anyone but the creature that taunted you." });
cond("Sickened", "icons/svg/poison.svg", "<p>Sickened always has a value, such as Sickened 1. Your Body and Instinct Saves take that many Banes, and you can't eat, drink or swallow anything: no potions.</p>", [bb1(1, { all: ["__save"], attrs: ["body", "instinct"], byValue: true })], { valued: true });
cond("Staggered", "icons/svg/paralysis.svg", "<p>You can't use Reactions. Your Reaction AP isn't lost: you can use it again when Staggered ends.</p>", [], { noReactions: true });
cond("Dazed", "icons/svg/daze.svg", "<p>Dazed always has a value, such as Dazed 1. When you become Dazed, you lose that many AP right away (never your Reaction AP). If you have fewer AP than the value, you lose the AP you have, and the rest is taken from the AP you regain at the start of your next turn; then Dazed ends.</p>", [], { valued: true, loseAp: true });
cond("Grabbed", "icons/svg/padlock.svg", "<p>A creature within its Reach holds you (the one that applied it): you are Immobilized, and only the holder can Force Move or Reposition you. Grabbed ends when the holder lets go (no Action), leaves your Reach, goes Down or is Unconscious, or when you end Immobilized (1 AP [Move]: Break Free). The holder can't use the hand or limb that holds you for anything else.</p>", [], { endsWithOrigin: true, originFromUser: true, linked: "Immobilized" });
cond("Blinded", "icons/svg/blind.svg", "<p>You can't see: for your Sight, everything is Darkness. Creatures you only hear are Hidden to you, so your Actions against them are Doomed, and you can't target a creature you don't perceive. Any other Roll that needs sight is Doomed. Actions with the Area trait still affect the creatures in their area.</p>", []);
cond("Bleed", "icons/svg/blood.svg", "<p><b>Bleed X (Attributes)</b> is damage that keeps coming: at the end of each of your turns, you take X damage, rolled each time. It is Vigor damage when the Attributes are Bo/In and Resolve damage when they are Mi/Ap, unless the Bleed writes its pool. You can end it with Interact (1 AP), on yourself or on a bleeding creature within your Reach: a Save with the better of the two Attributes against DC 13 (or the Bleed's DC). Tier 1: no effect. Tier 2: you take half the Bleed at the end of this turn, then it ends. Tier 3: it ends. Healing doesn't end a Bleed; the end of the encounter does.</p>", [{ type: "bleed", dmg: "1", dmgPool: "", dmgSub: "", attrs: ["body", "instinct"], bleedDc: 13 }], { hover: "Damage at the end of each of your turns; Interact (1 AP) and a Save end it." });

add("effects", "effect", "Bloodlust", "icons/svg/blood.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, your [Melee, Weapon] Actions are Empowered 1 and gain 2 Boons, and you take 1 Bane on Saves.</p>", settings: [
  { type: "boonbane", boons: 2, banes: 0, all: ["melee", "weapon"], any: [], none: [] },
  { type: "damagestep", empowered: 1, all: ["melee", "weapon"], any: [], none: [] },
  { type: "boonbane", boons: 0, banes: 1, all: [], any: [], none: [], from: bloodlustFrom }
] }, "Talents");

const grant = boons => ({ type: "grant", grantAction: "Weapon Attack", grantCount: 2, grantAp: 0, grantDistinct: true, boons, banes: 0 });
add("effects", "effect", "Double Shot (2 Attacks)", "icons/svg/combat.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>You can use Weapon Attack twice, each time against a different creature. These uses are free and don't count toward Weapon Attack's Frequency or the 3 Strikes of your turn.</p>", settings: [grant(0)] }, "Sharpshooter");

/* ------------------------------------------------------------------ Actions */
// P1 (book 2026-10-29; v0.0.181): Smite and Lay On Hands are the Paladin's Hallmark Action (choose one).
// v0.0.246 (cards 1, Lucas): Smite's light is an effect the Damage button puts on the target (the card's fx): the token sheds Bright light in an
// N Emanation (Dim light for N more: the book's Light), for 1 round, with the Bane on Hide as a note (Hide isn't written: by hand). The old +1 Defense effect is gone (R-classes).
// v0.0.250 (cards 3, Hallowed Dawn): the enemies shed Bright light in a 1 Emanation for 1 round
add("effects", "effect", "Hallowed Dawn (Bright light 1)", "icons/svg/light.svg", { duration: { type: "rounds", rounds: 1 }, description: "<p>The creature sheds Bright light in a 1 Emanation (Dim light 1 more) for 1 round (Hallowed Dawn).</p>", settings: [{ type: "light", bright: 1, dim: 2, color: "#ffd27a", lightAlpha: 0.2, lightAnim: "sunburst", lightSpeed: 2, lightIntensity: 3 }] }, "Paladin");
for (const n of [1, 2]) add("effects", "effect", `Smite (Bright light ${n})`, "icons/svg/light.svg", { duration: { type: "rounds", rounds: 1 }, description: `<p>The creature sheds Bright light in a ${n} Emanation (Dim light ${n} more) and takes 1 Bane when it tries to Hide, for 1 round (Smite).</p>`, settings: [{ type: "light", bright: n, dim: 2 * n, color: "#ffd27a", lightAlpha: 0.2, lightAnim: "sunburst", lightSpeed: 2, lightIntensity: 3 }, { type: "note", title: "Smite", text: "1 Bane when it tries to Hide (by hand: Hide isn't written yet)." }] }, "Paladin");
add("effects", "effect", "Lay On Hands (Holy Strike)", "icons/svg/regen.svg", { selfApplied: true, duration: { type: "", rounds: 1 }, expireOn: ["strike"], description: "<p>Your next [Strike] Action deals an extra [R] 0/2d8/2d8 Ho (Tier 2 and 3).</p>", settings: [{ type: "bonusdamage", dmg: "2d8", dmgPool: "M", dmgSub: "Ho", tiers: ["t2", "t3"], all: ["strike"], any: [], none: [] }] }, "Paladin");
// A1 (book 2026-10-29; v0.0.181): Double Shot and Rolling Shot are the Archer's Hallmark Action (choose one).
// v0.0.261 (cards session 5, Lucas): Rolling Shot's attack is a granted use (the card's button, v0.0.260): the effect carries the grant, and at 2 / 3 AP the extra
// damage that applies only to that granted [Ranged, Shot] attack (the effect goes with the use). Covering Shot: the same, with its Boon and the Tier 3 half.
const grantOne = (boons = 0, extra = {}) => ({ type: "grant", grantAction: "Weapon Attack", grantCount: 1, grantAp: 0, grantDistinct: false, boons, banes: 0, ...extra });
add("effects", "effect", "Rolling Shot (Weapon Attack)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>One [Ranged, Shot] Weapon Attack (1A), free (Rolling Shot, 1 AP): the button on the card, or the sheet's ticket.</p>", settings: [grantOne()] }, "Archer");
for (const [n, d] of [[2, "1d6"], [3, "2d6"]]) add("effects", "effect", `Rolling Shot (+${d} Pi)`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["strike"], description: `<p>One [Ranged, Shot] Weapon Attack (1A), free, that deals an extra [V] ${d} Pi (Rolling Shot, ${n} AP): the button on the card, or the sheet's ticket.</p>`, settings: [grantOne(), { type: "bonusdamage", dmg: d, dmgPool: "B", dmgSub: "Pi", tiers: ["t2", "t3"], all: ["ranged", "shot", "strike"], any: [], none: [] }] }, "Archer");
add("effects", "effect", "Covering Shot (Weapon Attack, 1 Boon)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>One [Ranged, Shot] Weapon Attack (1A) with 1 Boon against the attacker (Covering Shot). On a Tier 3, the ally takes half of the triggering damage: the attacker's next damage card lights its Half button.</p>", settings: [grantOne(1, { grantOn: "t3", grantDo: "half" })] }, "Archer");
// v0.0.265 (Lucas: "do 1 and 3"): the cards that still had a Use button get a granted use (README rule 29): Overwatch (the Hindered and the Push as the
// Grant's line on the attack's Tier 2 and 3 rows), Deathmark (conditional: the damage card's Effects button, when the target goes Down), Open Season, Aim.
add("effects", "effect", "Overwatch (Weapon Attack)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>One [Ranged, Shot] Weapon Attack (1A) against the triggering creature (Overwatch): on a Tier 2 or 3 it is Hindered (EoT), on a Critical also Pushed 2 (the chips on the attack's rows).</p>",
  settings: [grantOne(0, { grantOn: "t2", grantDo: "text", grantText: "The target is @Condition[hindered|rounds:eot]{Hindered (EoT)}.", grantOn2: "crit", grantDo2: "text", grantText2: "The target is also @Move[pushed|distance:2]{Pushed 2}." })] }, "Archer");
add("effects", "effect", "Deathmark (Weapon Attack)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>The target of Deathmark went Down: choose a new Marked Quarry (0R) and make one [Ranged, Shot] Weapon Attack (1A) against them, free (the sheet's ticket).</p>", settings: [grantOne()] }, "Archer");
// v0.0.343 (Lucas, playtest 4: "the allies' extra [V] 1d6 Pi automated"): on the Quarry for 1 round, Open Season's chain puts it there; the allies'
// [Strike] Actions against it (anyone but the Archer) add [V] 1d6 Pi (a rule "Rolls made against them: Extra damage", editable on the Effect)
add("effects", "effect", "Open Season (the Quarry)", "icons/svg/target.svg", { duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, [Strike] Actions the Archer's allies make against this creature deal an extra [V] 1d6 Pi (Open Season).</p>", settings: [{ type: "bonusdamage", dmg: "1d6", dmgPool: "B", dmgSub: "Pi", all: ["strike"], against: true, vsOrigin: "not", tiers: ["t1", "t2", "t3"] }] }, "Archer");
add("effects", "effect", "Open Season (Weapon Attack)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>One [Ranged, Shot] Weapon Attack (1A) against your Marked Quarry, free (Open Season): the button on the card, or the sheet's ticket.</p>", settings: [grantOne()] }, "Archer");
add("effects", "effect", "Aim (Weapon Attack, 1 Boon)", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>One [Ranged] Weapon Attack (1A) with 1 Boon, free (Aim); it ignores Low cover.</p>", settings: [grantOne(1), { type: "cover", coverLevels: ["low"], all: ["ranged"], any: [], none: [] }] }, "Talents");   // v0.0.266: Low cover ignored by [Ranged] Actions
// v0.0.265: Covering Fire is a Zone (rule 30): enemies inside take 1 Bane on [Strike] Actions, allies inside +1 Defense, the area kept 3 rounds.
add("effects", "effect", "Covering Fire (1 Bane)", "icons/svg/target.svg", { description: "<p>1 Bane on [Strike] Actions while in the Covering Fire.</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [] }] }, "Archer");
add("effects", "effect", "Covering Fire (+1 Defense)", "icons/svg/shield.svg", { description: "<p>+1 Defense while in the Covering Fire.</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] }, "Archer");
add("effects", "effect", "Covering Fire", "icons/svg/target.svg", { description: "<p>The covered ground (3 rounds): enemies in it take 1 Bane on [Strike] Actions, allies in it gain +1 Defense.</p>",
  settings: [{ type: "zone", zoneWho: "enemies", fxUuid: uuidOf("effects", "Covering Fire (1 Bane)") }, { type: "zone", zoneWho: "allies", fxUuid: uuidOf("effects", "Covering Fire (+1 Defense)") }] }, "Archer");
const wa = "@Use[Weapon Attack|label:[Ranged, Shot] Weapon Attack (1A)]";
add("actions", "action", "Precise Aim", "icons/svg/eye.svg", {
  category: "Sharpshooter", level: 1, traits: ["focus", "self"], frequency: "round", distance: "self",
  versions: [noRoll(1, "You gain 1 Boon on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (1 Boon)")]), noRoll(2, "You gain 2 Boons on your next [Ranged, Shot, Strike, Weapon] Action.", [uuidOf("effects", "Precise Aim (2 Boons)")])]
}, "Archer");
// OT (book 2026-10-30): every Talent is a Talent item (Category, Level, Prerequisites, Theme as data); an Action Talent grants its Action,
// whose category is the Talent's head ("Combat Talent"), so the class window offers the Talent once.

/* ------------------------------------------------------------------ Martial Talents */
// OT (Lucas 2026-10-30): Leg Sweep is a kick, Kickboxer's own Action: it uses your Fists even with no free hand.

/* ------------------------------------------------------------------ Features and Talents */
add("features", "feature", "Divine Connection", "icons/svg/aura.svg", { category: "Paladin Feature", level: 1, talents: 2, description: "<p>Select 1 Talent and 1 Talent with the Divine trait. (Retired in the rules; kept here to test Talent slots.)</p>" });


/* ------------------------------------------------------------------ Talents (book 16-talents.md; OT 2026-10-30): Category, Level, Prerequisites and Theme as data */
// Combat
add("effects", "effect", "Challenged", "icons/svg/combat.svg", { duration: { type: "eot", rounds: 1 }, description: "<p>Your [Strike] Actions against creatures other than the one who challenged you take 1 Bane (Challenge, EoT).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [], vsOrigin: "not" }] }, "Talents");   // v0.0.314: only against others (vsOrigin)
// Mobility
// Magic
// Class Talents

/* ------------------------------------------------------------------ Weapons */
const weapon = (text, img, actions = []) => {
  const w = parseWeaponText(text);
  if (w.problems.length) throw new Error(`${text}: ${w.problems.join("; ")}`);
  add("weapons", "weapon", w.name, img, { ...weaponSystemData(w), actions });
};
weapon("greatsword: two-handed, melee, slash, 0/1d8/2d6", "icons/svg/sword.svg");
weapon("crossbow: projectile, reload, two-handed, pierce, ranges 10/20/40, 0/1d4+2/1d10+2", "icons/svg/target.svg");
// v0.0.331 (Lucas: the four PCs "as different as you can"): the rest of the book's weapons (15-gear.md, Melee and Ranged); each gets its Weapon Technique (cardgen)
for (const [text, img] of [
  ["dagger: melee, pierce, thrown 4/8/12, 0/1d4/1d8", "icons/svg/sword.svg"], ["longsword: melee, slash, 0/1d6/1d10", "icons/svg/sword.svg"],
  ["handaxe: melee, slash, thrown 4/8/12, 0/1d4/1d8", "icons/svg/sword.svg"], ["greataxe: melee, two-handed, slash, 0/1d6/2d8", "icons/svg/sword.svg"],
  ["mace: melee, blunt, 0/1d4+1/1d8+1", "icons/svg/sword.svg"], ["maul: melee, two-handed, blunt, 0/1d4+2/1d10+2", "icons/svg/sword.svg"],
  ["spear: melee, pierce, thrown 4/8/12, 0/1d4/1d8", "icons/svg/sword.svg"], ["pike: long, melee, two-handed, pierce, range 3, 0/1d6/1d10", "icons/svg/sword.svg"],
  ["knuckle dagger: barehanded, melee, pierce, 0/1d4/1d6", "icons/svg/combat.svg"],
  ["shortbow: projectile, two-handed, pierce, ranges 8/16/32, 0/1d6/1d10", "icons/svg/target.svg"], ["longbow: projectile, two-handed, pierce, ranges 15/30/60, 0/1d4+1/1d8+1", "icons/svg/target.svg"],
  ["hand crossbow: projectile, reload, pierce, ranges 6/12/24, 0/1d4/1d8", "icons/svg/target.svg"],
  ["pistol: firearm, reload, pierce, ranges 5/10/20, 0/1d4/2d6", "icons/svg/target.svg"], ["musket: firearm, reload, two-handed, pierce, ranges 10/20/40, 0/1d4/2d8", "icons/svg/target.svg"]]) weapon(text, img);

/* ------------------------------------------------------------------ Armor (generic for now: named armors and properties are still open in the book) */
const armorDoc = (name, category, description) => add("weapons", "armor", name, "icons/svg/shield.svg", { description: `<p>${description}</p>`, category, bonus: 0, ward: 0, properties: "", worn: false }, "Armor");
armorDoc("Light Armor", "light", "Armor 12 (11 + 1). Needs Light Armor Training or better.");
armorDoc("Medium Armor", "medium", "Armor 13 (11 + 2). Needs Medium Armor Training or better.");
armorDoc("Heavy Armor", "heavy", "Armor 14 (11 + 3). Rare. Needs Heavy Armor Training.");

/* ------------------------------------------------------------------ Species, Classes, Archetypes */
// Pack R (v0.0.243; book, Species): bodyMod / mindMod are the Vigor and Resolve bonuses (Dwarf +4 / +1, Elf +1 / +4; the Human's +3 / +2 go where the player chooses: pickHealth).
const sp = (name, attrs, pickTwo, bodyMod, mindMod, speed, steadiness = 0, pickHealth = false) => add("classes", "species", name, "icons/svg/mystery-man.svg", { attributes: attrs, pickTwo, bodyMod, mindMod, pickHealth, speed, reach: 1, steadiness });   // no Ward value since v0.0.162 (Ward Defense = 11 + Power Modifier)
sp("Human", { body: 0, mind: 0, appeal: 0, instinct: 0 }, true, 3, 2, 5, 0, true);
sp("Dwarf", { body: 1, mind: 1, appeal: -1, instinct: 1 }, false, 4, 1, 4, 1);
sp("Elf", { body: -1, mind: 1, appeal: 1, instinct: 1 }, false, 1, 4, 6);
// v0.0.185 (pack C2): the classes' levels as sections (module/classlevels.mjs), from the book's "by Level" tables; the class window reads them.
const U = names => names.map(n => uuidOf(/^(Font of Mercy|Divine Power|Kindled Wrath|Sharpshooter|Marked Quarry|Hallowed Stance|Radiant Zeal|Mending Light|Divine Surge|Searing Blows|Reckoning|Killer's Focus|Thrill of the Kill|Vanish|Harrying Shots|Hunter's Edge|Sure Step|Finisher|Staggering Shot)$/.test(n) ? "features" : "actions", n));
const sec = (id, title, kind, o = {}) => ({ id, title, kind, mode: o.mode ?? "choice", pick: o.pick ?? 1, items: o.items ?? [], pairs: (o.pairs ?? []).map(([a, b]) => ({ a, b })), freq: o.freq ?? "any", category: o.category ?? "" });
// OT (book 2026-10-30): the Repertoire and Escalation lists with their options.
// Pack R-classes (book 2026-11-04): the Paladin rebuilt for pack R: a Hallmark Reaction (Shield of Faith or Bulwark of Faith), an Encounter Pick, one Escalation Passive per
// level (1, 2, 3) and an Apex (an Encounter Action that needs Escalation 3) at level 1, a Talent every level; Font of Mercy is an Escalation 1 Passive, Divine Surge too,
// Aura of Protection an Encounter Pick, Hand of Mercy a Talent. The Apexes are the class's "escActives" list (the Escalation Actions): the sheet and the class window keep working.
const PAL_PASS1 = ["Radiant Zeal", "Divine Surge", "Font of Mercy"], PAL_PASS2 = ["Searing Blows", "Mending Light"], PAL_PASS3 = ["Reckoning", "Hallowed Stance"], PAL_APEX = ["Final Verdict", "Hallowed Dawn"];
const PAL_PASSIVES = [...PAL_PASS1, ...PAL_PASS2, ...PAL_PASS3];
add("classes", "class", "Paladin", "icons/svg/angel.svg", {
  description: "<p>A holy warrior.</p>", category: "Class", flavor: "Your god's strength flows through your weapon and your hands.",
  // Pack R (v0.0.243; book, Chapter 4 and the class stat block): high 20 / low 10, Stage 2 +12 / +6, Stage 3 +14 / +7; Rally 6 (+ the Stage).
  choiceA: ["body", "appeal"], choiceB: ["mind", "instinct"], healthHigh: 20, healthLow: 10, stepHigh2: 12, stepLow2: 6, stepHigh3: 14, stepLow3: 7, bodyMult: 0, mindMult: 0, rallyMod: 6, speedMod: 0,
  // v0.0.305 (pack MOD; book, the Paladin's stat box): the Modifiers are +2 and +1, the player chooses which is the Weapon Modifier (no Attribute lists).
  modHigh: 2, modLow: 1, modOrder: "either", armorTraining: "heavy", features: [],
  repertoire: U(["Holy Wrath", "Word of Radiance", "Bulwark of Faith", "Beacon", "Consecrated Ground", "Miraculous Recovery", "Divine Intervention"]), escPassives: U(PAL_PASSIVES), escActives: U(PAL_APEX),
  levels: [
    { sections: [sec("pal1attr", "Attribute increases", "attr", { pairs: [["body", "appeal"], ["mind", "instinct"]] }), sec("pal1core", "Features", "items", { mode: "granted", items: U(["Divine Power", "Kindled Wrath"]) }),
      sec("pal1hall", "Hallmark Action", "items", { items: U(["Smite", "Lay On Hands"]) }), sec("pal1react", "Hallmark Reaction", "items", { items: U(["Shield of Faith", "Rebuke"]) }),
      sec("pal1enc", "Encounter Pick", "repertoire", { freq: "encounter" }),
      sec("pal1pass1", "Escalation 1 Passive", "items", { items: U(PAL_PASS1) }), sec("pal1pass2", "Escalation 2 Passive", "items", { items: U(PAL_PASS2) }), sec("pal1pass3", "Escalation 3 Passive", "items", { items: U(PAL_PASS3) }),
      sec("pal1apex", "Apex", "items", { items: U(PAL_APEX) }), sec("pal1tal", "Talent", "talent")] },
    { sections: [sec("pal2tal", "Talent", "talent")] },
    { sections: [sec("pal3daily", "Daily Pick", "repertoire", { freq: "daily" }), sec("pal3tal", "Talent", "talent")] },
    { sections: [sec("pal4tal", "Talent", "talent")] }
  ]
});
// Pack R-classes (book 2026-11-04): the Archer rebuilt for pack R, as the Paladin above: a Hallmark Reaction (Overwatch or Covering Shot), an Encounter Pick at level 1,
// one Escalation Passive per level and an Apex; Killer's Focus is an Escalation 1 Passive, Vanish the Passive that grants the 0R Reaction, Pinning Shot and Twin Shot Encounter Picks, Elusive is gone.
const ARC_PASS1 = ["Killer's Focus", "Vanish", "Harrying Shots"], ARC_PASS2 = ["Hunter's Edge", "Sure Step"], ARC_PASS3 = ["Finisher", "Staggering Shot"], ARC_APEX = ["Deathmark", "Open Season"];
const ARC_PASSIVES = [...ARC_PASS1, ...ARC_PASS2, ...ARC_PASS3];
add("classes", "class", "Archer", "icons/svg/target.svg", {
  description: "<p>An Archer fights from a distance.</p>", category: "Class", flavor: "You were made for the shot no one else would take.",
  // Pack R (v0.0.243): high 16 / low 8, Stage 2 +9 / +5, Stage 3 +11 / +6; Rally 5 (+ the Stage).
  choiceA: ["body", "instinct"], choiceB: ["mind", "appeal"], healthHigh: 16, healthLow: 8, stepHigh2: 9, stepLow2: 5, stepHigh3: 11, stepLow3: 6, bodyMult: 0, mindMult: 0, rallyMod: 5,
  // v0.0.305 (pack MOD; book, the Archer's stat box): Weapon +2, Power +1, fixed.
  modHigh: 2, modLow: 1, modOrder: "weapon", armorTraining: "medium", speedMod: 1, features: [],
  repertoire: U(["Marksman's Shot", "Volley", "Covering Fire", "Pinning Shot", "Twin Shot", "Hunter's Focus", "Deadeye", "Rain of Arrows"]), escPassives: U(ARC_PASSIVES), escActives: U(ARC_APEX),
  levels: [
    { sections: [sec("arc1attr", "Attribute increases", "attr", { pairs: [["body", "instinct"], ["mind", "appeal"]] }), sec("arc1core", "Features", "items", { mode: "granted", items: U(["Sharpshooter", "Marked Quarry", "Thrill of the Kill"]) }),
      sec("arc1hall", "Hallmark Action", "items", { items: U(["Double Shot", "Rolling Shot"]) }), sec("arc1react", "Hallmark Reaction", "items", { items: U(["Overwatch", "Covering Shot"]) }),
      sec("arc1enc", "Encounter Pick", "repertoire", { freq: "encounter" }),
      sec("arc1pass1", "Escalation 1 Passive", "items", { items: U(ARC_PASS1) }), sec("arc1pass2", "Escalation 2 Passive", "items", { items: U(ARC_PASS2) }), sec("arc1pass3", "Escalation 3 Passive", "items", { items: U(ARC_PASS3) }),
      sec("arc1apex", "Apex", "items", { items: U(ARC_APEX) }), sec("arc1tal", "Talent", "talent")] },
    { sections: [sec("arc2tal", "Talent", "talent")] },
    { sections: [sec("arc3daily", "Daily Pick", "repertoire", { freq: "daily" }), sec("arc3tal", "Talent", "talent")] },
    { sections: [sec("arc4tal", "Talent", "talent")] }
  ]
});

/* ------------------------------------------------------------------ NPCs (Actors, with their items inside) */
const { basicItemData, BASIC_ACTIONS, wanted } = await import("../module/basic.mjs");   // v0.0.214: no Weapon Attack or Fists Action on NPCs
// v0.0.334 (Lucas: "Basic Actions should have Actions in the compendium"): each Basic Action in the Actions compendium (folder Basic Actions), with its
// basic flag, so one dragged onto a creature works as the built-in one (a creature already has them all: this is for reading, the GM's own NPCs, a world copy)
for (const k of Object.keys(BASIC_ACTIONS)) { const d = basicItemData(k); docs.push({ pack: "actions", type: "action", name: d.name, img: d.img, folder: "Basic Actions", system: d.system, flags: d.flags }); }
const { fistsItemData } = await import("../module/fists.mjs");
const actors = [];
// v0.0.184: the id includes the type, so a weapon and its Basic attack can share a name ("Cudgel"); a duplicate id stopped the whole build.
const embedded = (actorName, type, name, img, system, flags = {}) => ({ _id: idOf("Item", type === "action" ? `${actorName}:${name}` : `${actorName}:${type}:${name}`), name, type, img, system, flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } });
const npcWeapon = (actorName, text, img) => { const w = parseWeaponText(text); if (w.problems.length) throw new Error(`${text}: ${w.problems.join("; ")}`); return embedded(actorName, "weapon", w.name, img, { ...weaponSystemData(w), wielded: true }); };
const npcAction = (actorName, name, img, system, flags = {}) => embedded(actorName, "action", name, img, system, flags);
// The Bestiary (v0.0.163): a role and ratings. By default its Weapon Attribute is High, the others Medium, Appeal Low (Appeal Medium when Appeal is its Weapon Attribute).
const npc = ({ name, img, role, weaponAttribute, powerAttribute = "mind", modLead = "weapon", ratings = {}, speed = 5, extra = [] }) => {
  const r = { body: "medium", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "medium", [weaponAttribute]: "high", ...ratings };
  const basics = Object.keys(BASIC_ACTIONS).filter(k => wanted({ type: "npc" }, k)).map(k => { const d = basicItemData(k); return embedded(name, "action", d.name, d.img, d.system, d.flags); });
  // v0.0.184: the Speed is a rating (3 to 7, or Custom with system.speed), as the Builder sets it
  r.speed = [3, 4, 5, 6, 7].includes(speed) ? String(speed) : "custom";
  actors.push({ name, img, system: { level: 1, role, speed, weaponAttribute, powerAttribute, modLead, ratings: r, useEscalation: role === "elite" }, items: [...extra, ...basics, (() => { const f = fistsItemData(), e = embedded(name, "weapon", f.name, f.img, f.system, f.flags); e._id = idOf("Item", `${name}:weapon:Fists`); return e; })()] });
};
// v0.0.333 (Lucas): the portraits (art/npcs/; the Grave Wisp has none yet).
// v0.0.183 (Lucas: a complete rebuild, simple NPCs to test with): one NPC for each role, at Stage 1 (level 1). The Minion, the Standard and
// the Elite are the Bestiary's own examples (book: Example NPCs; the Grave Wisp since pack R-bestiary); the Grunt follows the same recipe. Damage is the book's average for the
// rating ([Mod] is added on Tier 2 and 3, as for any Weapon Action); the weapon in its hands is only what the attack looks like.
{
  const n = "Goblin Sneak", knife = npcWeapon(n, "rusty knife: melee, pierce, 0/1d4/1d6", "icons/svg/dagger.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/goblin-sneak.png", role: "minion", weaponAttribute: "instinct", speed: 7, ratings: { bodyHm: "low", mindHm: "low", wd: "low" },
    extra: [knife] });
}
{
  const n = "Bandit Thug", club = npcWeapon(n, "cudgel: melee, blunt, 0/1d4/1d6", "icons/svg/hammer.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/bandit-thug.png", role: "grunt", weaponAttribute: "body",
    extra: [club] });
}
{
  const n = "Orc Warrior", cleaver = npcWeapon(n, "cleaver: melee, slash, 0/1d8/2d8", "icons/svg/sword.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/orc-warrior.png", role: "standard", weaponAttribute: "body", ratings: { bodyHm: "high", mindHm: "low", wd: "low" },
    extra: [cleaver] });
}
// v0.0.240 (pack R-bestiary): a Standard that attacks Ward Defense only (its Actions are Power Actions dealing [R]); no weapon in its hands.
{
  npc({ name: "Grave Wisp", img: "icons/svg/mystery-man.svg", role: "standard", weaponAttribute: "instinct", powerAttribute: "mind", modLead: "power",
    ratings: { body: "low", mind: "high", appeal: "medium", instinct: "medium", bodyHm: "terrible", mindHm: "high", ad: "low", wd: "high", wmod: "medium", pmod: "medium" } });
}
{
  const n = "Ogre Chieftain", club = npcWeapon(n, "great club: two-handed, melee, blunt, 0/1d10/2d10", "icons/svg/hammer.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/ogre-chieftain.png", role: "elite", weaponAttribute: "body", speed: 4, ratings: { wd: "low" },
    extra: [club] });
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
// v0.0.261 (cards session 5, Lucas): Consecrated Ground is a Zone: the placed area carries these settings; enemies inside carry the Bane while inside,
// allies inside heal 1d4 at the start of each of their turns (the roll in the chat, then their Heal window). The zone effect itself is never applied to a creature.
FX("Consecrated Ground (1 Bane)", "icons/svg/sun.svg", { description: "<p>1 Bane on [Weapon], [Power] and [Signature] Actions while in the Consecrated Ground.</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: [], any: ["weapon", "magic", "signature"], none: [] }] });
FX("Consecrated Ground", "icons/svg/sun.svg", { description: "<p>The consecrated area: enemies in it take 1 Bane on [Weapon], [Power] and [Signature] Actions, and allies in it heal 1d4 at the start of each of their turns. It lasts 3 rounds (5 at 3 AP).</p>",
  settings: [{ type: "zone", zoneWho: "enemies", fxUuid: uuidOf("effects", "Consecrated Ground (1 Bane)") }, { type: "zone", zoneWho: "allies", zoneHeal: "1d4" }] });

// Effects the Paladin's cards apply
FX("Divine Power (Enfeebled)", "icons/svg/degen.svg", { duration: dur("eot"), description: "<p>Enfeebled 1 (EoT): subtract 1 from every die of your damage.</p>", settings: [{ type: "damagestep", enfeebled: 1, ...nod }] });
FX("Beacon (+1 Defense)", "icons/svg/shield.svg", { duration: dur(""), description: "<p>+1 Defense while you are inside the Beacon's Aura.</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] });
FX("Divine Vigil (Boon against Fear)", "icons/svg/aura.svg", { duration: dur(""), description: "<p>1 Boon on Saves against [Fear] Actions, while you are inside Divine Vigil's Aura.</p>", settings: [{ type: "boonbane", boons: 1, banes: 0, all: ["__save"], any: [], none: [], from: ["fear"] }] });
// P1 (v0.0.181): Divine Surge marks an enemy (the ally's extra damage is a button on the mark); the Beacon (was Aura of Protection) lasts 3 rounds (v0.0.254).
FX("Divine Surge", "icons/svg/sun.svg", { duration: dur("rounds"), description: "<p>For 1 round, the next time an ally deals damage to this creature, they deal an extra @Damage[1d8[mind,holy]]{[R] 1d8 Ho} (Divine Surge). Then remove this mark.</p>", settings: [] });
FX("Beacon", "icons/svg/aura.svg", { selfApplied: true, duration: { type: "rounds", rounds: 3 }, description: "<p>Your Beacon: an Aura 2 around you for 3 rounds. You and allies inside gain +1 Defense, and you have Beacon's Step while it lasts (0R, Round: Evade 1 toward an ally in the Aura who takes damage).</p>", settings: [{ type: "aura", auraSize: 2, auraWho: "allies", auraSelf: true, auraOutline: "#3fb68b", auraFill: "#3fb68b", fxUuid: uuidOf("effects", "Beacon (+1 Defense)") }, { type: "inline", inlineAction: uuidOf("actions", "Beacon's Step") }] });

// Features: the Paladin's core features, the passives of the picks, and the choices
// v0.0.187 (Lucas): the Escalation passives that add damage once a round give an Effect each turn, used up by the Action (switch it off in the roll dialog).
FX("Radiant Zeal", "icons/svg/sun.svg", { selfApplied: true, duration: dur(""), minEscalation: 1, expireOn: ["strike"], description: "<p>Your next [Strike] Action that deals damage deals an extra [R] 1d6 Ho (Radiant Zeal, while your Escalation is 1 or more). Given again at the start of each of your turns.</p>", settings: [sBonus("1d6", "M", "Ho", P(["strike"]))] });
add("features", "feature", "Aegis", "icons/svg/shield.svg", { category: "Paladin Feature", level: 1, description: "<p>At the start of each encounter, choose one ally. While you are within 3 squares of them, you and they gain 1 Boon on Saves. (Not automated: choose the ally and add the Boon by hand.)</p>" });
add("features", "feature", "Mercy's Reward", "icons/svg/regen.svg", { category: "Paladin Feature", level: 1, description: "<p>When you heal an ally with Lay On Hands, your next Smite is Empowered 2. It is used up by that Smite. (Not automated.)</p>" });
add("features", "feature", "Divine Vigil", "icons/svg/aura.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, you and your allies in an Aura 3 around you gain 1 Boon on Saves against [Fear] Actions.</p>", settings: [{ type: "aura", auraSize: 3, auraWho: "allies", auraSelf: true, auraOutline: "#d4a62a", auraFill: "#d4a62a", fxUuid: uuidOf("effects", "Divine Vigil (Boon against Fear)"), minEscalation: 2 }] });
add("features", "feature", "Avenger's Oath", "icons/svg/sword.svg", { category: "Paladin Escalation", level: 1, description: "<p>While your Escalation is 2 or more, when an ally within 5 squares becomes Bloodied, you gain 1 Boon on your next [Strike] Action. (Not automated.)</p>" });

// Actions: the picks
const PAL = "Paladin Feature";
add("actions", "action", "Vow of Enmity", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / one / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "Your next [Strike] Action against them gains 1 Boon, and you increase your Empowered value by 1 for that Strike."], ["1d8MH", "As Tier 2."]]),
  vt(2, [["", "No effect."], ["1d6MH", "As 1 AP."], ["1d6MH", "As Tier 2, and the target is Vulnerable 1 (EoT)."]]),
  vt(3, [["", "No effect."], ["1d6MH", "As 2 AP."], ["1d6MH", "As 2 AP."]])] }, "Paladin");
// OT (book 2026-10-30): Shield of Faith is a 0R Escalation Active (Escalation 1), 1d8 + your Power Modifier.
add("actions", "action", "Rebuke (old)", "icons/svg/sun.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "turn", reaction: true, reactionKind: "trigger", targets: "The triggering creature", distance: "reach", trigger: "An enemy within Reach damages an ally.", versions: [
  vt(1, [["1d4+1MH", ""], ["1d6+1MH", ""], ["1d8+1MH", ""]], "", { critical: "The target is Vulnerable 1 (EoT)." }),
  vt(2, [["1d6+1MH", "Pushed 1."], ["1d8+1MH", "Pushed 2."], ["1d10+1MH", "Pushed 3."]], "", { critical: "The target is Vulnerable 1 for 1 round." })] }, "Paladin");
add("actions", "action", "Champion's Challenge", "icons/svg/combat.svg", { category: PAL, level: 1, traits: ["divine", "magic"], frequency: "round", targets: "One / two creatures", distance: "5", versions: [
  vt(1, [["", "No effect."], ["", "1 Bane on [Strike] and [Power] Actions against anyone other than you (EoT)."], ["", "As Tier 2, but 2 Banes instead of 1."]]),
  vt(2, [["", "No effect."], ["", "As 1 AP."], ["", "As 1 AP."]])] }, "Paladin");
const dr = (ap, extra) => [
  vt(ap, [["1WB,1d10MH", ""], ["1WB,1d12MH", ""], ["1WB,2d8MH", ""]], extra, { mode: "weapon", critical: "The target is Pushed 3." }),
  vt(ap, [["2d8MH", ""], ["2d10MH", ""], ["2d12MH", ""]], extra, { mode: "power", critical: "The target is Pushed 3." })];
add("actions", "action", "Divine Retribution", "icons/svg/sword.svg", { category: PAL, level: 1, traits: ["divine", "strike", "split"], frequency: "encounter", reaction: true, reactionKind: "trigger", targets: "The triggering creature", distance: "weapon", trigger: "You take damage from an enemy within the Distance of this Action.", versions: [
  ...dr(2, ""), ...dr(3, "As 2R, and every enemy in an Emanation 2 centered on you, except the triggering creature, must make an Appeal Save: [R] 1d10 Ho; Pushed 2 / [R] 1d8 Ho / 0.")] }, "Paladin");
// the Escalation Actives
const PE = "Paladin Escalation";
add("actions", "action", "Call to Arms", "icons/svg/angel.svg", { category: PE, level: 1, traits: ["divine"], frequency: "round", escalation: 1, targets: "One Down ally", distance: "3", versions: [noRoll(0, "The ally can use 1 Rally Point.")] }, "Paladin");
add("actions", "action", "Judgment", "icons/svg/sword.svg", { category: PE, level: 1, traits: ["divine", "magic"], frequency: "round", escalation: 2, targets: "One enemy", distance: "reach", versions: [vt(1, [["", "No effect."], ["2d6MH", "Hindered (EoT)"], ["2d8MH", "Hindered (EoT)"]])] }, "Paladin");
// v0.0.330 (Lucas: "create one yourself for testing purposes"): a test Action whose area deals damage, through a Zone (an Effect placed on the map).
// Not a book card: the "Testing" folder. The Effect's Hazard [HT] deals [V] 1d6 Fire to everyone who enters, the origin too; it lasts 3 rounds.
add("effects", "effect", "Fire Patch (test Zone)", "icons/svg/fire.svg", { description: "<p>Burning ground: a creature that enters it takes [V] 1d6 Fire (at most once per turn-cycle). Lasts 3 rounds. A test Zone.</p>",
  where: "map", zone: { src: "action", inside: { carry: { on: false }, ht: { on: true, who: "all", self: true, entering: true, turn: false, movement: false, list: [{ dice: "1d6", pool: "B", sub: "Fi" }] } }, show: true, outline: "#e8582a", fill: "#e8582a" },
  ends: { time: { on: true, mode: "rounds", rounds: 3 } } }, "Testing");
add("actions", "action", "Fire Patch (test)", "icons/svg/fire.svg", { category: "Testing", level: 0, traits: ["area"], frequency: "atwill", targets: "The squares of the Area", flavor: "The ground catches, and it does not go out.",
  areaCfg: { size: 1, shape: "emanation", within: 5, targets: "all", center: false, keep: true, rounds: 3 },
  versions: [noRoll(1, "You set the ground on fire for 3 rounds. A creature that enters it takes [V] 1d6 Fire (once per turn-cycle).", [uuidOf("effects", "Fire Patch (test Zone)")])] }, "Testing");
add("actions", "action", "Sanctified Ground", "icons/svg/aura.svg", { category: PE, level: 1, traits: ["divine", "area"], frequency: "round", escalation: 2, targets: "All creatures in the Area", areaCfg: { size: 1, shape: "emanation", within: 5, targets: "all", center: false, keep: true, rounds: 2 }, versions: [noRoll(1, "You fill the Emanation with Holy light for 2 rounds. Enemies in it take 1 Bane on [Strike] Actions.")] }, "Paladin");

add("effects", "effect", "Hunter's Focus", "icons/svg/eye.svg", { selfApplied: true, duration: dur(""), description: "<p>For the rest of the encounter, against your Marked Quarry: you gain 1 Boon and Empowered 1, and you take less damage from each of their Actions, reduced by your Signature Modifier (you choose which instance). The damage reduction is not automated.</p>", settings: [sBoon(1, P(), { vsMarked: true }), { type: "damagestep", empowered: 1, ...P(), vsMarked: true }] }, "Archer");
/* ------------------------------------------------------------------ The Archer (from the book's cards; Save Actions and Marked Quarry are automated in the next passes) */
add("actions", "action", "Quick Draw", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "turn", "targets": "The triggering creature", "distance": "weapon", "reaction": true, "reactionKind": "interrupt", "trigger": "An enemy within 5 squares moves closer to you.", versions: [noRoll(1, "Make a @Use[Weapon Attack|label:Weapon Attack (1A)] against the triggering creature.")] }, "Archer");
add("actions", "action", "Wing Clip", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [vt(1, [["1WB", ""], ["1WB, 1d4BPi", ""], ["1WB, 1d6BPi", "Hindered (EoT)"]], "")] }, "Archer");
add("actions", "action", "True Shot", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["focus", "self"], "frequency": "round", versions: [noRoll(1, "Your next [Strike] Action ignores Cover.")] }, "Archer");
add("actions", "action", "Suppressing Fire", "icons/svg/target.svg", {"category": "Archer Feature", "level": 1, "traits": ["ranged", "shot", "weapon"], "frequency": "round", "targets": "One creature", "distance": "weapon", versions: [noRoll(1, "Until the end of your next turn, the target takes 1 Bane on [Ranged, Strike] and [Power, Ranged] Actions against creatures other than you.")] }, "Archer");
add("actions", "action", "Steady Aim", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 1, versions: [noRoll(0, "Your next [Shot, Strike] gains 1 Boon, and all of the weapon's ranges increase by 5.")] }, "Archer");
add("effects", "effect", "Vanish (+1 Defense)", "icons/svg/invisible.svg", { selfApplied: true, duration: dur("rounds"), description: "<p>+1 Defense for 1 round (Vanish).</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] }, "Archer");
// v0.0.189 (Lucas): Pinning Shot and Twin Shot give their Weapon Attack as a granted use (the sheet's button turns blue), as Double Shot does.
const grant1 = { type: "grant", grantAction: "Weapon Attack", grantCount: 1, grantAp: 0, grantDistinct: false, boons: 0, banes: 0 };
add("effects", "effect", "Pinning Shot", "icons/svg/net.svg", { selfApplied: true, duration: dur("eot"), expireOn: ["strike"], description: "<p>Your next Weapon Attack this turn is free; on a Tier 2 or 3 the target is Immobilized (EoT) (Pinning Shot).</p>", settings: [grant1, sBonus("", "B", "", P(["strike"]), { tiers: ["t2", "t3"], text: "Immobilized (EoT)", fxUuid: uuidOf("conditions", "Immobilized") })] }, "Archer");
add("effects", "effect", "Twin Shot", "icons/svg/target.svg", { selfApplied: true, duration: dur("eot"), expireOn: ["strike"], description: "<p>Your next Weapon Attack this turn is free: target two creatures no more than 5 squares apart; it deals an extra [V] 1d6 Pi to each of them (Twin Shot).</p>", settings: [grant1, sBonus("1d6", "B", "Pi", P(["ranged", "shot", "strike"]))] }, "Archer");
add("actions", "action", "Perfect Shot", "icons/svg/target.svg", {"category": "Archer Escalation", "level": 1, "traits": ["focus", "self"], "frequency": "round", "distance": "self", "escalation": 3, versions: [noRoll(0, "Your next [Shot, Strike] is Favored and Empowered 2, and ignores Cover.")] }, "Archer");
add("features", "feature", "Bow Mastery", "icons/svg/target.svg", { category: "Archer Feature", level: 1, description: "<p>Choose one Projectile weapon, such as a bow or a crossbow. You start with **3 Mastery** with it, so its Weapon Technique is unlocked (see Mastery).</p>", settings: [sMastery("projectile", 3)] }, "Archer");
add("features", "feature", "Patient Hunter", "icons/svg/target.svg", { category: "Archer Escalation", level: 1, description: "<p>While your Escalation is 2 or more, if you have not left your square since the start of your last turn, gain 1 Boon on [Shot, Strike] Actions until you leave your square.</p>" }, "Archer");
add("effects", "effect", "Harried", "icons/svg/downgrade.svg", { duration: dur("eot"), description: "<p>1 Bane on [Strike] Actions (Harrying Shots, EoT).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, ...P(["strike"]) }] }, "Archer");
add("effects", "effect", "Killer's Focus", "icons/svg/target.svg", { selfApplied: true, duration: dur(""), minEscalation: 2, expireOn: ["shot", "strike", "weapon"], expireAll: true, description: "<p>Your next [Shot, Strike, Weapon] Action deals an extra [V] 1d6 Pi (Killer's Focus, while your Escalation is 2 or more). Given again at the start of each of your turns.</p>", settings: [sBonus("1d6", "B", "Pi", P(["shot", "strike", "weapon"]))] }, "Archer");

/* ------------------------------------------------------------------ the cards of book/cards/*.json (pack CS, 2026-11-03): one source for the book, Foundry and the ruler.
   A card with Versions is an Action item, one without is a Feature; {{fx:Name}} and {{action:Name}} in a card are the compendium uuids. The Basic Actions
   come through module/basic-data.mjs (tools/gen-basic.mjs); the Techniques (weapon) and the NPC Actions (npc) follow in CS-3. The format: book/cards/README.md. */
const { loadCards, cardSystem, featureSystem, talentSystem, isAction, inlineCards } = await import("./cardgen.mjs");
// v0.0.246: {{link:Name|label}} (a book link to a card) is Foundry's link to the compendium item, which opens it to read (an Action, else a Feature or Talent).
export const resolveRefs = s => s.replace(/\{\{fx:([^}]+)\}\}/g, (m, n) => uuidOf("effects", n)).replace(/\{\{action:([^}]+)\}\}/g, (m, n) => uuidOf("actions", n))
  .replace(/\{\{link:([^}|]+)\|([^}]+)\}\}/g, (m, n, label) => { const c = CARDS.find(x => x.name === n) ?? CARDS.flatMap(x => inlineCards(x)).find(x => x.name === n); return `@UUID[${uuidOf(c && isAction(c) ? "actions" : "features", n)}]{${label}}`; });   // v0.0.254: an inline Action links to its item too
export const CARDS = loadCards();
for (const c of CARDS) {
  if (c.foundry?.basic) continue;
  const img = c.foundry?.img ?? "icons/svg/sword.svg", folder = c.foundry?.folder ?? null;
  if (c.npc) {   // an NPC's Action (CS-3): embedded on its actor after the weapon in its hands, before the Basic Actions
    const actor = actors.find(a => a.name === c.npc); if (!actor) throw new Error(`${c.name}: no NPC called ${c.npc}`);
    const w = c.foundry?.npcWeapon ? actor.items.find(i => i.type === "weapon" && i.name.toLowerCase() === c.foundry.npcWeapon.toLowerCase()) : null;
    if (c.foundry?.npcWeapon && !w) throw new Error(`${c.name}: ${c.npc} has no weapon called ${c.foundry.npcWeapon}`);
    const it = npcAction(c.npc, c.name, img, cardSystem(c, resolveRefs), w ? { twod12: { weaponId: w._id } } : {});
    const at = actor.items.findIndex(i => i.flags?.twod12?.basic);
    actor.items.splice(at < 0 ? actor.items.length : at, 0, it);
    continue;
  }
  if (isAction(c)) add("actions", "action", c.name, img, cardSystem(c, resolveRefs), folder);
  if (c.talent) add("features", "talent", c.name, img, talentSystem(c, resolveRefs), null);   // a Talent (and, with Versions, the Action it grants, above)
  else if (!isAction(c)) add("features", "feature", c.name, img, featureSystem(c, resolveRefs), folder);
  if (c.weapon) { const w = docs.find(d => d.type === "weapon" && d.name.toLowerCase() === c.weapon.toLowerCase()); if (w) (w.system.actions ??= []).push(uuidOf("actions", c.name)); }   // a Technique on its weapon (when the weapon is in the compendium)
  for (const a of inlineCards(c)) add("actions", "action", a.name, a.foundry.img ?? "icons/svg/sword.svg", cardSystem(a, resolveRefs), "Inline");   // v0.0.249: the card's inline Actions (Beacon's Step)
}

// v0.0.185: the pick Features of v0.0.181 (Hallmark Action, Encounter Pick, Talent (Level 1)...) are gone: the classes have levels now.
// The cards the P1 and A1 builds left out (book/paladin-old-cards.md, book/archer-old-cards.md): kept in the compendium, in folders of their own, for the Options step.
const OLD = { "Paladin (old cards)": ["Aegis", "Mercy's Reward", "Divine Vigil", "Avenger's Oath", "Vow of Enmity", "Rebuke (old)", "Champion's Challenge", "Divine Retribution", "Call to Arms", "Judgment", "Sanctified Ground", "Divine Vigil (Boon against Fear)"],
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
const pc = ({ name, token = "", img, species, chosen, cls, attrs, picks, level = 1, lead = "weapon", weapon, armor = "", extras = [], health = "", start = "", choices = {} }) => {
  const c = docOf("class", cls), lv1 = c.system.levels[0].sections, attrSec = lv1.find(x => x.kind === "attr");
  const byLevel = typeof Object.values(picks)[0] === "string" ? { 1: picks } : picks;
  const pickedAt = L => Object.fromEntries(Object.entries(byLevel[L] ?? {}).map(([id, n]) => [id, [uuidOf(PACK_OF[docOf(lv1Type(n), n).type], n)]]));
  const classPicks = Object.fromEntries(Array.from({ length: level }, (_, i) => [i + 1, pickedAt(i + 1)]));
  const items = [copyDoc(name, "species", species, {}, chosen ? { chosen } : {}),
    copyDoc(name, "class", cls, { classPicks, classAttrs: { 1: attrs } }, { chosenA: attrs[0], chosenB: attrs[1], chosenAttrs: attrs, chosenWeapon: "", chosenMagic: "", modPriority: lead })];
  if (!attrSec) throw new Error(`${cls}: no Attribute section at level 1`);
  const give = (n, section, kind, L) => {
    const type = lv1Type(n), it = copyDoc(name, type, n, { classLevel: L, classSection: section, ...(type === "feature" ? { grantedBy: "class", level: L } : {}), ...(kind === "talent" ? { slot: `class:${L}:${section}:0` } : {}) });
    items.push(it);
    // v0.0.331: a Talent with a choice (Lesser Blessing): the chosen Action, as grants.mjs grantChoices adds it
    if (choices[n]) { const a = docOf("action", choices[n]); it.flags.twod12.choices = [uuidOf("actions", a.name)]; items.push(copyDoc(name, "action", a.name, { talentId: it._id, choice: true })); }
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
  // v0.0.331: the Mastery tab's entry for the weapon (mastery.mjs: flags twod12.mastery by kind), and a Starting Mastery already chosen (Sharpshooter: 3)
  const mkey = String(weapon).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const flags = { twod12: { mastery: { [mkey]: { name: weapon, value: start ? 3 : 0 } }, ...(start ? { startMastery: { [idOf("Item", `${name}:feature:${start}`)]: weapon } } : {}) } };
  // the class's high Health value on Vigor or Resolve (the character's healthHigh; a Human's +3 goes with it: speciesHigh "")
  pcs.push({ name, token, img, system: { level, ...(health ? { healthHigh: health, speciesHigh: "" } : {}) }, items, flags });
};
// The type of an item by its name (a Feature, a Talent or an Action), for the picks above.
// v0.0.188: a Talent before the Action it grants (Aim).
function lv1Type(n) { const d = ["talent", "feature", "action"].map(t => docs.find(x => x.name === n && x.type === t)).find(Boolean); if (!d) throw new Error(`No item called ${n}`); return d.type; }
// v0.0.331 (Lucas, with their portraits: "a paladin dwarf, a paladin human, an archer elf and an archer human, as different as you can, focused on
// optimization"): four level 4 characters (the book's last level), each Hallmark, Reaction, Pick, Escalation Passive, Apex and weapon different
// from the other of its class, the 15 Talents spread with one repeat (Aim); the reasons: docs/reference.md (v0.0.331) and the foundry-backlog.
const ART = n => `systems/twod12/art/pcs/${n}`;
// v0.0.332 (Lucas: "make level 1 versions, at least one using a shortbow and another a greatsword"): each build at level 4 and at level 1
// (its level 1 picks only: the first Talent, no Daily Pick), named "..., level 1)"; Aveline's Greatsword and Kaela's Shortbow are among them.
const pcBoth = o => { pc(o); pc({ ...o, name: o.name.replace(/\)$/, ", level 1)"), level: 1, picks: { 1: o.picks[1] } }); };
// The wrath Paladin: Smite and the Greatsword (Weapon Modifier +2), the damage ladder (Radiant Zeal, Searing Blows, Reckoning, Final Verdict),
// Holy Wrath for the opening turn, Consecrated Ground to hold a room; Heavy Blows and Whirlwind on the Greatsword, Bloodlust, Cut Through to reach the back line.
pcBoth({ name: "Aveline (Human Paladin, Smite)", token: "Aveline", img: ART("aveline.png"), species: "Human", chosen: ["body", "appeal"], cls: "Paladin", attrs: ["body", "instinct"], level: 4, lead: "weapon", health: "vigor",
  picks: { 1: { pal1hall: "Smite", pal1react: "Rebuke", pal1tal: "Heavy Blows", pal1enc: "Holy Wrath", pal1pass1: "Radiant Zeal", pal1pass2: "Searing Blows", pal1pass3: "Reckoning", pal1apex: "Final Verdict" },
    2: { pal2tal: "Whirlwind" }, 3: { pal3daily: "Consecrated Ground", pal3tal: "Bloodlust" }, 4: { pal4tal: "Cut Through" } }, weapon: "Greatsword", armor: "Heavy Armor" });
// The mercy Paladin: Lay On Hands and the Pike (Power Modifier +2: the heals, Mending Light, Hallowed Stance and the Ward Defense), Range 3 to
// guard the allies in front of him; Shield of Faith, Beacon, Divine Intervention; Challenge, Sacred Weapon, Hand of Mercy, Battering Charge (Speed 4).
pcBoth({ name: "Durgan (Dwarf Paladin, Lay On Hands)", token: "Durgan", img: ART("durgan.png"), species: "Dwarf", cls: "Paladin", attrs: ["body", "instinct"], level: 4, lead: "power", health: "vigor",
  picks: { 1: { pal1hall: "Lay On Hands", pal1react: "Shield of Faith", pal1tal: "Challenge", pal1enc: "Beacon", pal1pass1: "Font of Mercy", pal1pass2: "Mending Light", pal1pass3: "Hallowed Stance", pal1apex: "Hallowed Dawn" },
    2: { pal2tal: "Sacred Weapon" }, 3: { pal3daily: "Divine Intervention", pal3tal: "Hand of Mercy" }, 4: { pal4tal: "Battering Charge" } }, weapon: "Pike", armor: "Heavy Armor" });
// The far Archer: Double Shot and the Longbow (range 15, 30 with Long Draw and no Bane), the Quarry damage ladder (Killer's Focus, Hunter's Edge,
// Finisher, Deathmark), Overwatch, Marksman's Shot, Hunter's Focus; Aim, Ricochet, Long Draw, Lesser Blessing (Rimebrand on a Double Shot turn).
pcBoth({ name: "Sylwen (Elf Archer, Double Shot)", token: "Sylwen", img: ART("sylwen.webp"), species: "Elf", cls: "Archer", attrs: ["instinct", "mind"], level: 4, health: "vigor", start: "Sharpshooter",
  picks: { 1: { arc1hall: "Double Shot", arc1react: "Overwatch", arc1tal: "Aim", arc1enc: "Marksman's Shot", arc1pass1: "Killer's Focus", arc1pass2: "Hunter's Edge", arc1pass3: "Finisher", arc1apex: "Deathmark" },
    2: { arc2tal: "Ricochet" }, 3: { arc3daily: "Hunter's Focus", arc3tal: "Long Draw" }, 4: { arc4tal: "Lesser Blessing" } }, choices: { "Lesser Blessing": "Rimebrand (Cold)" }, weapon: "Longbow", armor: "Medium Armor" });
// The close Archer: Rolling Shot and the Shortbow (its Technique, Skirmish Shot, unlocked at 3: an Evade on a Tier 3), the mobile ladder (Vanish,
// Sure Step, Staggering Shot, Open Season), Covering Shot, Covering Fire (a Zone), Rain of Arrows; Brawler, Kickboxer, Steady Nerves, Aim.
pcBoth({ name: "Kaela (Human Archer, Rolling Shot)", token: "Kaela", img: ART("kaela.webp"), species: "Human", chosen: ["body", "instinct"], cls: "Archer", attrs: ["instinct", "appeal"], level: 4, health: "vigor", start: "Sharpshooter",
  picks: { 1: { arc1hall: "Rolling Shot", arc1react: "Covering Shot", arc1tal: "Brawler", arc1enc: "Covering Fire", arc1pass1: "Vanish", arc1pass2: "Sure Step", arc1pass3: "Staggering Shot", arc1apex: "Open Season" },
    2: { arc2tal: "Kickboxer" }, 3: { arc3daily: "Rain of Arrows", arc3tal: "Steady Nerves" }, 4: { arc4tal: "Aim" } }, weapon: "Shortbow", armor: "Medium Armor" });

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
 "Divine Connection": "Your bond with your god opens new paths.",
 "Precise Aim": "You slow your breath and let the world narrow to one point.",
  "Profane Judgment": "The profane flinch at your god's light.",
  "Aegis": "Your watchful presence protects one soul above all.",
  "Mercy's Reward": "Mercy shown is mercy returned.",
  "Divine Vigil": "Your watch does not end when the fighting starts.",
  "Avenger's Oath": "Every wound your friends take is written in the ledger.",
  "Vow of Enmity": "You name a foe, and your god listens.",
  "Rebuke (old)": "The hand that strikes the faithful is burned for its trouble.",
  "Champion's Challenge": "You call them out, and they cannot look away.",
  "Divine Retribution": "They struck you. Your god strikes back.",
  "Call to Arms": "Your voice carries further than the fight.",
  "Judgment": "The verdict is not yours to give, only to deliver.",
  "Sanctified Ground": "You make a small piece of the world your god's, and it holds."
};
FLAVOR["Precise Aim"] = "You slow your breath and let the world narrow to one point.";
FLAVOR["Quick Draw"] = "You loose before they take the second step.";
FLAVOR["Wing Clip"] = "A shot at the knee is worth two in the chest.";
FLAVOR["True Shot"] = "You see the gap in the wall, and the shot goes through it.";
FLAVOR["Suppressing Fire"] = "They keep their heads down while your friends close in.";
FLAVOR["Steady Aim"] = "Breathe in. Breathe out. Loose.";
FLAVOR["Perfect Shot"] = "The arrow has already landed. You have only to release it.";
FLAVOR["Bow Mastery"] = "One weapon has been in your hands longer than any other.";
FLAVOR["Patient Hunter"] = "The shot is worth waiting for.";
// v0.0.188 (OT): the book's Flavor lines of the new cards (Mark Quarry's is new here).

for (const d of docs) if (["action", "talent", "feature"].includes(d.type) && FLAVOR[d.name]) d.system.flavor = FLAVOR[d.name];
// v0.0.189 (Lucas): how much Foundry does for each current card (a chip on the card). Gold: all of it; Silver: one part by hand;
// Bronze: buttons or a compendium effect, the rest by hand; Not implemented: text only. Old cards and Basic Actions have none set.
const AUTO = {
  gold: ["Rain of Arrows",
    "Steady Nerves",
    "Rimebrand", "Challenged", "Lay On Hands (Holy Strike)", "Smite (Bright light 1)", "Smite (Bright light 2)", "Vanish (+1 Defense)"],
  silver: ["Cut Through"],
  bronze: ["Harried"],
  none: ["Class Expertise"]
};
// v0.0.215 (Lucas, playtest 2): what each Bronze and Silver card still leaves to the players (the diamond's tooltip, "By hand" on the item).
const AUTO_NOTE = {
};
for (const c of CARDS) for (const d of docs) if (d.type === "effect" && d.name === c.name && c.foundry?.automation) { d.system.automation = c.foundry.automation; if (c.foundry.automationNote) d.system.automationNote = c.foundry.automationNote; }   // an Effect named like a card (Divine Surge, Pinning Shot) shows the card's rank
for (const [rank, list] of Object.entries(AUTO)) for (const d of docs) if (list.includes(d.name) && ["action", "feature", "talent", "effect"].includes(d.type) && !/old cards/.test(d.folder ?? "") && !d.system.automation) { d.system.automation = rank; if (AUTO_NOTE[d.name] && ["bronze", "silver"].includes(rank)) d.system.automationNote = AUTO_NOTE[d.name]; }
// v0.0.187: the Escalation Passives say so (the Features tab's Escalation section); a card says it with foundry.escalationPassive (Font of Mercy).
for (const d of docs) if (d.type === "feature" && (/escalation/i.test(d.system.category ?? ""))) d.system.escalationPassive = true;
for (const a of [...actors, ...pcs]) for (const it of (a.items ?? [])) if (["action", "talent", "feature"].includes(it.type) && FLAVOR[it.name]) { it.system ??= {}; it.system.flavor = FLAVOR[it.name]; }

// v0.0.323 (PACK EFFECT-SHEET): every Effect, Feature and Talent carries its rules (the Details tab's source), its Ends and the hover text built from
// them, read from its settings (fxrules.mjs migrate; the settings stay what the rolls read). The names of the dropped Effects come from the packs.
{
  const FX = await import("../module/fxrules.mjs");
  const names = Object.fromEntries(docs.map(d => [uuidOf(d.pack, d.name), d.name]));
  // the Area line as the data model writes it (data.mjs: "2 / 3 Emanation", the Versions' own sizes)
  const areaOfCfg = sy => { const c = sy?.areaCfg; if (!c?.size) return String(sy?.area ?? ""); const sizes = [...new Set([...(sy.versions ?? [])].sort((a, b) => a.ap - b.ap).map(v => v.areaSize || c.size))], sz = sizes.length > 1 ? sizes.join(" / ") : c.size; return c.shape === "line" ? `Line ${sz}` : `${sz} ${c.shape === "burst" ? "Burst" : "Emanation"}`; };
  const withRules = d => {
    if (!["effect", "feature", "talent"].includes(d.type)) return;
    const sys = (d.system ??= {});
    const ends0 = sys.ends;
    const m = FX.migrate(sys, d.type);
    sys.rules = m.rules; sys.rulesOn = true;
    if (d.type === "effect") sys.ends = m.ends;
    // v0.0.327 (PACK ZONE): an old Zone (Consecrated Ground) is the effect placed on the map
    // v0.0.330: an Effect written already on the map (Fire Patch): its Zone as written
    if (d.type === "effect" && sys.where === "map" && sys.zone) { sys.zone = FX.normZone(sys.zone); sys.ends = FX.normEnds(ends0); const act = docs.find(a => a.type === "action" && (a.system?.versions ?? []).some(v => Object.values(v.fx ?? {}).some(l => (l ?? []).some(x => x?.uuid === uuidOf(d.pack, d.name))))); sys.autoHover = `${FX.plainText(FX.zoneSentence(sys.zone, { originName: "{origin}", names, action: act ? { area: areaOfCfg(act.system) } : null }))} ${FX.zoneEndsSentence(sys.ends, { originName: "{origin}" })}`; return; }
    const z = d.type === "effect" ? FX.liftZone({ rules: sys.rules }) : null;
    if (z?.lifted) {
      // the Action that places it: its Area line and its rounds (the Version's own rounds still win when it is placed: 5 at 3 AP)
      const me = uuidOf(d.pack, d.name), act = docs.find(a => a.type === "action" && (a.system?.versions ?? []).some(v => Object.values(v.fx ?? {}).some(l => (l ?? []).some(x => x?.uuid === me))));
      const rounds = Number(act?.system?.areaCfg?.rounds) || 0;
      if (rounds && !m.ends.time.on) m.ends = FX.normEnds({ ...m.ends, time: { on: true, mode: "rounds", rounds } });
      sys.ends = m.ends;
      sys.rules = z.rules; sys.where = "map"; sys.zone = z.zone; sys.autoHover = `${FX.plainText(FX.zoneSentence(z.zone, { originName: "{origin}", names, action: act ? { area: areaOfCfg(act.system) } : null }))} ${FX.zoneEndsSentence(m.ends, { originName: "{origin}" })}`;
      return;
    }
    sys.autoHover = d.type === "effect" ? FX.hoverCardText(m.rules, m.ends, { originName: "{origin}", names, host: d.type }) : FX.hoverCardText(m.rules, {}, { originName: "its origin", names, host: d.type }).replace(/\s*Lasts until removed\.$/, "");
  };
  for (const d of docs) withRules(d);
  for (const a of [...actors, ...pcs]) for (const it of a.items ?? []) withRules(it);
}

export { docs, folders, uuidOf, actors, pcs };
