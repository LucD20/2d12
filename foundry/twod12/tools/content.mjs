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
const { TWOD12 } = await import("../module/config.mjs");   // v0.0.407: talentsSetAside

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
const CI = id => `systems/twod12/icons/conditions/${id}.svg`;
// v0.0.407 (Stage 0 in Foundry; book, Chapter 8; Lucas, 2026-11-13): Empowered has no value; Enfeebled is gone (Divine Power and Hallowed Dawn use a Bane on [Strike] Actions)
cond("Empowered", CI("empowered"), "<p>The first time you deal damage on each of your turns, add 1d6! damage of the Action's pool and type (it explodes).</p>", []);
cond("Hindered", CI("hindered"), "<p>Your Speed is halved, rounded down.</p>", [speedSetting("override", "floor(speed/2)")]);
cond("Immobilized", CI("immobilized"), "<p>You can't use Move Actions or Evade. Unless otherwise specified, you can remove Immobilized by spending 1 AP [Move] and meeting the Action DC of the Action that Immobilized you (11 + the Modifier it used) with a Body or Instinct Check: the one Move Action you can use while Immobilized (the Break Free Basic Action).</p>", [speedSetting("override", "0")]);
cond("Leaning", CI("leaning"), "<p>You calculate cover from one of your corners instead of the center, and your own cover is reduced by 1 level (Total → High → Medium → Low → none: leaning out of Total cover, you can be targeted). Click a corner of your square on the map to lean toward it: your token peeks out a little past it, unless a wall is in the way. It ends at the end of your turn, or when you stop Leaning (at any time on your turn, at no cost).</p>", []);
cond("Prone", CI("prone"), "<p>Melee Actions against you gain 1 Field Boon, and Ranged Actions against you suffer 1 Field Bane. You can't Evade. The only [Move] Actions you can use are Crawl and Stand.</p>", [against(1, 0, ["melee"], "field"), against(0, 1, ["ranged"], "field")]);

add("effects", "effect", "Hindered (until Move)", CI("hindered"), { duration: { type: "rounds", rounds: 1 }, expireOn: ["move"], description: "<p>For 1 round, the creature is Hindered until they use a Move Action. The effect lasts through that Move Action and ends once it is resolved.</p>", settings: [speedSetting("override", "floor(speed/2)")] }, "Conditions");
const coldSetting = (dmg, tiers, text = "", fxUuid = "") => ({ type: "bonusdamage", dmg, dmgPool: "M", dmgSub: "Co", tiers, text, fxUuid, all: ["weapon"], any: [], none: [] });
// OT (book 2026-10-30): Rimebrand is a turn buff with no roll.
add("effects", "effect", "Rimebrand", "icons/svg/frozen.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, description: "<p>Until the end of your turn, your [Weapon] Actions deal an extra [R] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT).</p>", settings: [coldSetting("1d4", ["t1", "t2", "t3"]), coldSetting("", ["t3"], "Hindered (EoT)", uuidOf("conditions", "Hindered"))] }, "Lesser Blessing");

const aimSetting = (n, all = ["ranged", "strike", "weapon"]) => ({ type: "boonbane", boons: n, banes: 0, all, any: [], none: [] });
for (const n of [1, 2]) add("effects", "effect", `Precise Aim (${n} Boon${n === 1 ? "" : "s"})`, "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "shot", "strike", "weapon"], expireAll: true, description: `<p>${n} Boon${n === 1 ? "" : "s"} on your next [Ranged, Shot, Strike, Weapon] Action.</p>`, settings: [aimSetting(n, ["ranged", "shot", "strike", "weapon"])] }, "Sharpshooter");

const bloodlustFrom = ["strike", "melee", "ranged", "weapon", "magic", "divine", "focus", "handle", "move"];
cond("Vulnerable", CI("vulnerable"), "<p>Actions against you gain as many Boons as the value of Vulnerable (Vulnerable 2: 2 Boons). Only the highest Vulnerable value applies.</p>", [{ ...against(1, 0, []), byValue: true }], { valued: true });
cond("Slowed", CI("slowed"), "<p>Slowed always has a value. You regain that many fewer AP at the start of your turn (Slowed 2: you regain 2), and your most AP is lowered by the value too. You don't lose AP when you become Slowed, only when you regain AP. Slowed never changes your Reaction Point. Desperate, Dying and Shattered make you Slowed 1, or 1 more (to at most 3), while they last. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Quickened", CI("quickened"), "<p>Quickened always has a value. Your most AP, and the AP you regain at the start of your turn, rise by that much (Quickened 2: you regain 6). You don't gain AP when you become Quickened, only when you regain AP. Quickened never changes your Reaction Point, and the extra AP you don't spend become Guard like any other. Slowed and Quickened cancel out without changing each other's value.</p>", [], { valued: true });
cond("Imperiled", CI("imperiled"), "<p>You barely avoided a Deadly Hazard (hanging from a ledge, at the lip of a lava pit...). All your Checks and Saves are Doomed, and you are Vulnerable 3. At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled; you are Slowed 1 for that turn. A creature can help you get to safety with the Interact Action (1 AP, Handle).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 3, valued: true }] });
cond("Squeezing", CI("squeezing"), "<p>You stopped moving while squeezing through a space one rank smaller than you: you don't fit completely in the space you are in. All your Rolls are Doomed and you are Vulnerable equal to half your level (rounded up) until you move to a space where you fit completely. Each square you move while squeezing counts as Difficult Terrain. The GM applies this condition (it is not detected on the map).</p>", [], { conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 1, valued: true, mode: "halfLevel" }] });
// v0.0.314 (pack AU; book, Chapter 8, the conditions pass): the eight conditions as items, each with general rules (data.mjs EffectData):
// Daunted (Frightened until the core rework E1, 2026-11-21) works only while its creature sees the origin; Taunted's Bane counts only against creatures other than the origin; Sickened N's
// Banes are on Body and Instinct Saves; Staggered blocks Reactions; Dazed N takes AP now; Grabbed brings Immobilized and ends when the holder
// goes Down; Bleed is damage at the end of each turn (a card's own dice: @Condition[bleed|dmg:1d6|pool:R|sub:Ho|attrs:mi/ap]); Blinded is
// Foundry's blind status (no sight: twod12.mjs CONFIG.specialStatusEffects).
const bb1 = (banes, extra = {}) => ({ type: "boonbane", boons: 0, banes, all: [], any: [], none: [], ...extra });
cond("Daunted", CI("daunted"), "<p>Daunted is always <b>of</b> a source (the creature or object that applied it). While you see the source (Clear or Obscured to you), all your Rolls take 1 Bane, and every square that brings you closer to it is Difficult Terrain for you (Forced Movement ignores it). Out of your Sight (a wall, Darkness), the Bane and the Difficult Terrain stop until you see it again.</p>", [bb1(1), { type: "move", text: "closer", moveHow: "difficult" }], { whileSeen: true, originFromUser: true, endsWithOrigin: true, hover: "" });   // the core rework E2: ends when its source goes Down   // v0.0.323 (PACK EFFECT-SHEET): the Movement limit is a rule now; the hover card is built from the rules (its old text was the same words)
// v0.0.412 (pack F3 part 2, Thwart Cut; book, Chapter 8): Pressed N, N Pressure Banes on its [Strike] rolls (the Pressure Banes cap at 2 together)
cond("Pressed", CI("pressed"), "<p>Pressed always has a value, such as Pressed 1. Your [Strike] Actions take that many Pressure Banes (with your other Pressure Banes, at most 2).</p>", [bb1(1, { all: ["strike"], byValue: true, bbName: "pressure" })], { valued: true });
// v0.0.409 (pack F2, Glare; book, Chapter 8): Half-Blinded, the system's status (senses.mjs perceive: Sight gives no better than Obscured)
cond("Half-Blinded", CI("half-blinded"), "<p>Your Sight perceives no creature better than Obscured: a creature that would be Clear to you is Obscured (see Senses). Your other senses aren't affected.</p>", []);
cond("Taunted", CI("taunted"), "<p>Taunted is always <b>by</b> a creature (the one that applied it). Your Actions against any creature other than it take 1 Bane. An Action whose targets include it takes no Bane from Taunted.</p>", [bb1(1, { vsOrigin: "not" })], { originFromUser: true, endsWithOrigin: true, hover: "1 Bane on your Actions against anyone but the creature that taunted you." });
cond("Sickened", CI("sickened"), "<p>Sickened always has a value, such as Sickened 1. Your Body and Instinct Saves take that many Banes, and you can't eat, drink or swallow anything: no potions.</p>", [bb1(1, { all: ["__save"], attrs: ["body", "instinct"], byValue: true })], { valued: true });
cond("Staggered", CI("staggered"), "<p>You can't use Reactions. Your Reaction Point isn't lost: you can use it again when Staggered ends.</p>", [], { noReactions: true });
cond("Dazed", CI("dazed"), "<p>Dazed always has a value, such as Dazed 1. When you become Dazed, you lose that many AP right away (never your Reaction Point). If you have fewer AP than the value, you lose the AP you have, and the rest is taken from the AP you regain at the start of your next turn; then Dazed ends.</p>", [], { valued: true, loseAp: true });
cond("Grabbed", CI("grabbed"), "<p>A creature within its Reach holds you (the one that applied it): you are Immobilized and Vulnerable 1 (a higher Vulnerable applies instead), and only the holder can Force Move or Reposition you. Grabbed ends when the holder lets go (no Action), leaves your Reach, goes Down or is Unconscious, or when you end Immobilized (1 AP [Move]: Break Free, a Body or Instinct Check against the Action DC of the Action that grabbed you). The holder can't use the hand or limb that holds you for anything else.</p>", [], { endsWithOrigin: true, originFromUser: true, linked: "Immobilized", conditions: [{ uuid: uuidOf("conditions", "Vulnerable"), name: "Vulnerable", value: 1, valued: true }] });   // v0.0.532 (Lucas, playtest 11; book, Chapter 8): Vulnerable 1 while held, ended with it
cond("Blinded", CI("blinded"), "<p>You can't see: for your Sight, everything is Darkness. Creatures you only hear are Hidden to you, so your Actions against them are Doomed, and you can't target a creature you don't perceive. Any other Roll that needs sight is Doomed. Actions with the Area trait still affect the creatures in their area.</p>", []);
// v0.0.414 (book, Chapter 8): Bleed is renamed Lingering (any damage type lingers); its key stays bleed (the status, the setting); Shake Off ends it
cond("Lingering", CI("bleed"), "<p><b>Lingering X (Attributes)</b> is damage that keeps coming: at the end of each of your turns, you take X damage, rolled each time. It is Vigor damage when the Attributes are Bo/In and Resolve damage when they are Mi/Ap, unless the Lingering writes its pool. You can end it with the Shake Off Action (1 AP), on yourself or on a Lingering creature within your Reach: a Save with the better of the two Attributes against DC 13 (or the Lingering's DC). Tier 1: no effect. Tier 2: you take half the Lingering at the end of this turn, then it ends. Tier 3: it ends. Healing doesn't end a Lingering; the end of the encounter does.</p>", [{ type: "bleed", dmg: "1", dmgPool: "", dmgSub: "", attrs: ["body", "instinct"], bleedDc: 13 }], { hover: "Damage at the end of each of your turns; Shake Off (1 AP) and a Save end it." });

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
add("effects", "effect", "Hallowed Dawn (1 Bane)", "icons/svg/degen.svg", { duration: { type: "rounds", rounds: 1 }, description: "<p>1 Bane on [Strike] Actions for 1 round (Hallowed Dawn).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [] }] }, "Paladin");   // Lucas, 2026-11-13: in the place of Enfeebled 1
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
// v0.0.265: Covering Fire was a Zone of Banes (rule 30); v0.0.411 (pack F3; book, Covering Fire, 2026-11-16): for 2 rounds the Area is Difficult Terrain and
// Hazardous Terrain for enemies (Entering, Turn, Movement): [V] 2 + the origin's Weapon Modifier, Pierce (the bows'; another subtype by hand)
add("effects", "effect", "Covering Fire (1 Bane)", "icons/svg/target.svg", { description: "<p>1 Bane on [Strike] Actions while in the Covering Fire (the old card).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [] }] }, "Archer");
add("effects", "effect", "Covering Fire (+1 Defense)", "icons/svg/shield.svg", { description: "<p>+1 Defense while in the Covering Fire (the old card).</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] }, "Archer");
add("effects", "effect", "Covering Fire", "icons/svg/target.svg", { description: "<p>The covered ground (2 rounds): Difficult Terrain and Hazardous Terrain for enemies (Entering, Turn, Movement): [V] 2 + the origin's Weapon Modifier.</p>",
  where: "map", zone: { src: "action", inside: { carry: { on: false }, diff: { on: true, who: "enemies" }, ht: { on: true, who: "enemies", entering: true, turn: true, movement: true, list: [{ dice: "2 + @origin.wpn", pool: "B", sub: "Pi" }] } }, show: true, outline: "#c0603a", fill: "#c0603a" },
  ends: { time: { on: true, mode: "rounds", rounds: 2 } } }, "Archer");
// v0.0.411 (pack F3): the effects of Spotter's Modes
add("effects", "effect", "Called-Out", "icons/svg/eye.svg", { duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, this creature's enemies perceive it one step better: Hidden as Obscured, Obscured as Clear (Spotter, Call Out).</p>", settings: [] }, "Archer");
add("effects", "effect", "Find the Gap", "icons/svg/target.svg", { selfApplied: true, duration: { type: "eot", rounds: 1 }, expireOn: ["ranged", "strike"], expireAll: true, description: "<p>Your next [Ranged, Strike] Action this turn ignores the Banes of far and maximum range, and counts each target's Cover as one level lower, Total stays Total (Spotter, Find the Gap).</p>",
  settings: [{ type: "ignore", ignoreRule: "rangeBane", rangeAll: true, all: ["ranged", "strike"], any: [], none: [] }, { type: "ignore", ignoreRule: "coverLower", all: ["ranged", "strike"], any: [], none: [] }] }, "Archer");
add("effects", "effect", "Keep Low", "icons/svg/shield.svg", { selfApplied: true, duration: { type: "rounds", rounds: 1 }, description: "<p>For 1 round, against each creature you have Cover from, your Cover is one level higher, up to High (Spotter, Keep Low).</p>",
  settings: [{ type: "ignore", ignoreRule: "coverHigher", all: [], any: [], none: [] }] }, "Archer");
// the Bestiary's rebuild (2026-11-25): Rally the Tribe's Boon left with the old Ogre Chieftain's cards; Crack the Ground's broken floor (the Ogre
// Chieftain's Encounter Action): the Line it leaves is Difficult Terrain for every creature, the ogre too, until the encounter ends
add("effects", "effect", "Crack the Ground", "icons/svg/ice-aura.svg", { description: "<p>The cracked floor (Crack the Ground): Difficult Terrain for every creature until the encounter ends.</p>",
  where: "map", zone: { src: "action", inside: { carry: { on: false }, diff: { on: true, who: "all", self: true } } }, show: true, outline: "#8a6a3a", fill: "#8a6a3a",
  ends: { time: { on: true, mode: "encounter" } } }, "Bestiary");
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
// v0.0.407 (Stage 0 in Foundry; book, Chapter 15; archive/book-drafts/weapons-flat.md "DECIDED"): Tier 2 and Tier 3 as a flat part plus one die, which explodes (written
// 1d6! in the book: every weapon's die explodes, explode.mjs). The book's table where it has the weapon; the Greatsword, the one-handed Longsword, the
// Shortbow and the Longbow keep archive/book-drafts/weapons-flat.md's numbers until the Bows and Swords pass replaces them (foundry-backlog.md, F3).
// v0.0.412 (pack F3 part 2; book, Chapter 15, 2026-11-16): the weapon tables as the book writes them. The two Basic bows (Hunting Bow, Recurve Bow:
// Strung, one hand) replace the Shortbow and the Longbow; the Arming Sword replaces the one-handed Longsword, and the Longsword is the two-handed sword
// in the Greatsword's place; Light on the Dagger and the Handaxe. The other weapons are the book's placeholders (their numbers as written).
for (const [text, img] of [
  ["arming sword: melee, slash, 0/1d4+3/1d6+4", "icons/svg/sword.svg"], ["longsword: melee, two-handed, slash, 0/1d4+6/1d6+9", "icons/svg/sword.svg"],
  ["dagger: light, melee, pierce, thrown 4/8/12, 0/1d4+2/1d4+4", "icons/svg/sword.svg"], ["handaxe: light, melee, slash, thrown 4/8/12, 0/1d4+2/1d8+2", "icons/svg/sword.svg"],
  ["greataxe: melee, two-handed, slash, 0/1d6+4/1d8+10", "icons/svg/sword.svg"], ["mace: melee, blunt, 0/1d4+3/1d4+5", "icons/svg/sword.svg"], ["maul: melee, two-handed, blunt, 0/1d4+6/1d6+9", "icons/svg/sword.svg"],
  ["spear: melee, pierce, thrown 4/8/12, 0/1d4+2/1d4+4", "icons/svg/sword.svg"], ["pike: long, melee, two-handed, pierce, range 3, 0/1d6+4/1d8+6", "icons/svg/sword.svg"],
  ["knuckle dagger: barehanded, melee, pierce, 0/1d4+2/1d4+3", "icons/svg/combat.svg"],
  ["hunting bow: projectile, strung, pierce, ranges 8/16/24, 0/1d4+1/1d4+2", "icons/svg/target.svg"], ["recurve bow: projectile, strung, pierce, ranges 6/12/18, 0/1d4+1/1d6+1", "icons/svg/target.svg"],
  ["hand crossbow: projectile, reload, pierce, ranges 6/12/24, 0/1d4/1d4+1", "icons/svg/target.svg"], ["crossbow: projectile, reload, two-handed, pierce, ranges 10/20/40, 0/1d4+2/1d4+4", "icons/svg/target.svg"],
  ["pistol: firearm, reload, pierce, ranges 5/10/20, 0/1d4/1d8+2", "icons/svg/target.svg"], ["musket: firearm, reload, two-handed, pierce, ranges 10/20/40, 0/1d4/1d8+4", "icons/svg/target.svg"]]) weapon(text, img);

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
// v0.0.409 (pack F2): the Paladin's Stage 0 Features (book/cards/stage0/paladin.json); Reckoning is an Action now (its Escalation 6 Action)
// v0.0.411 (pack F3): the Archer's Stage 0 Features (book/cards/stage0/archer.json)
const U = names => names.map(n => uuidOf(/^(Sworn Blade|Steady Draw|Kindled Wrath|Armor of Faith|Roving Judgment|Weight of Judgment|Tireless Vigil|Hallowed Stance|Shifting Aim|Thrill of the Kill|Lean and Loose|Blade and Bow|Clear Lines|Opening Shot|One More Arrow|Fleet)$/.test(n) ? "features" : "actions", n));
const sec = (id, title, kind, o = {}) => ({ id, title, kind, mode: o.mode ?? "choice", pick: o.pick ?? 1, items: o.items ?? [], pairs: (o.pairs ?? []).map(([a, b]) => ({ a, b })), freq: o.freq ?? "any", category: o.category ?? "" });
// OT (book 2026-10-30): the Repertoire and Escalation lists with their options.
// Pack R-classes (book 2026-11-04): the Paladin rebuilt for pack R: a Hallmark Reaction (Shield of Faith or Bulwark of Faith), an Encounter Pick, one Escalation Passive per
// level (1, 2, 3) and an Apex (an Encounter Action that needs Escalation 3) at level 1, a Talent every level; Font of Mercy is an Escalation 1 Passive, Divine Surge too,
// Aura of Protection an Encounter Pick, Hand of Mercy a Talent. The Apexes are the class's "escActives" list (the Escalation Actions): the sheet and the class window keep working.
// v0.0.409 (pack F2; book, the Paladin by Level, 2026-11-16): the redesigned Paladin of Stage 0. Level 1: Judge and Smite, a Hallmark Action
// (Binding Light or Lay On Hands), a Hallmark Reaction (Shield of Faith or Rebuke), an Art (one of three, with Modes), the Escalation 2 ability, a
// Skill Talent; level 2: the Escalation hook (Kindled Wrath), an Encounter Pick, the Escalation 4 ability, a Talent; level 3: a second Art, the
// Escalation 6 ability, a Skill Talent; level 4 (not written yet): a Stage Talent. The Talent slots stay empty (Talents set aside). The rung of an
// Escalation ability is its section's title ("Escalation 2 Ability": escblock.mjs passiveThreshold). Modifiers fixed: Weapon +1, Power +2.
const PAL_ENC = ["Bulwark of Faith", "Consecrated Ground", "Word of Radiance"];
add("classes", "class", "Paladin", "icons/svg/angel.svg", {
  description: "<p>You stand in front so the others can stand back. A holy warrior who judges a foe before their god, shields the allies near them, and, when the fight has built long enough, brings all of it down in one blow.</p>", category: "Class", flavor: "Your god's strength flows through your weapon and your hands.",
  // Pack R (v0.0.243; book, Chapter 4 and the class stat block): high 20 / low 10; v0.0.527 (Lucas, 2026-11-26: "Health +½"): high 30 / low 15; v0.0.408: the Stage steps 0 until the book writes them; Rally 6 (+ 1 / 2 / 3 / 4 by Stage).
  choiceA: ["body", "appeal"], choiceB: ["mind", "instinct"], healthHigh: 30, healthLow: 15, stepHigh1: 0, stepLow1: 0, stepHigh2: 0, stepLow2: 0, stepHigh3: 0, stepLow3: 0, bodyMult: 0, mindMult: 0, rallyMod: 6, speedMod: 0,
  // core rework batch 3 (H1, book, Chapter 5): every class chooses its Modifier order (+2 / +1 either way).
  modHigh: 2, modLow: 1, modOrder: "either", armorTraining: "heavy", features: [],
  // batch 5 (Lucas, 2026-11-25): the Arts and the Escalation abilities (Passives and Reckoning) left the class; level 3 keeps only its Skill Talent.
  repertoire: U(PAL_ENC), escPassives: [], escActives: [],
  levels: [
    { sections: [sec("pal1attr", "Attribute increases", "attr", { pairs: [["body", "appeal"], ["mind", "instinct"]] }), sec("pal1core", "Features", "items", { mode: "granted", items: U(["Judge", "Smite", "Sworn Blade", "Drawing Light"]) }),
      sec("pal1hall", "Hallmark Action", "items", { items: U(["Binding Light", "Lay On Hands"]) }), sec("pal1react", "Hallmark Reaction", "items", { items: U(["Shield of Faith", "Rebuke"]) }),
      sec("pal1skill", "Skill Talent", "talent")] },
    { sections: [sec("pal2hook", "Escalation Hook", "items", { mode: "granted", items: U(["Kindled Wrath"]) }), sec("pal2enc", "Encounter Pick", "items", { items: U(PAL_ENC) }),
      sec("pal2tal", "Talent", "talent")] },
    { sections: [sec("pal3skill", "Skill Talent", "talent")] },
    { sections: [sec("pal4tal", "Stage Talent", "talent")] }   // level 4 (the Apex, Stage 1) is not written yet
  ]
});
// v0.0.411 (pack F3; book, the Archer by Level, 2026-11-16): the redesigned Archer of Stage 0, the Paladin's shape: level 1 Shifting Aim and Darting
// Blade, a Hallmark Action (Quick Shots or Strafe), a Hallmark Reaction (Slip Away or Snap Shot), an Art (Footwork, Trick Shots, Spotter), the
// Escalation 2 ability, a Skill Talent; level 2 Thrill of the Kill, an Encounter Pick (Volley, Hit and Run, Covering Fire), the Escalation 4 ability,
// a Talent; level 3 a second Art, the Escalation 6 ability, a Skill Talent. Light Armor Training (was Medium); no quarry.
const ARC_ENC = ["Volley", "Hit and Run", "Covering Fire"];
add("classes", "class", "Archer", "icons/svg/target.svg", {
  description: "<p>An Archer fights from a distance and never stands still: many small hits, a knife for the foe who gets close, and gone again.</p>", category: "Class", flavor: "You were made for the shot no one else would take.",
  // Pack R (v0.0.243): high 16 / low 8; v0.0.527 (Lucas, 2026-11-26: "Health +½"): high 24 / low 12; v0.0.408: the Stage steps 0 until the book writes them; Rally 5 (+ 1 / 2 / 3 / 4 by Stage).
  choiceA: ["body", "instinct"], choiceB: ["mind", "appeal"], healthHigh: 24, healthLow: 12, stepHigh1: 0, stepLow1: 0, stepHigh2: 0, stepLow2: 0, stepHigh3: 0, stepLow3: 0, bodyMult: 0, mindMult: 0, rallyMod: 5,
  // core rework batch 3 (H1, book, Chapter 5): every class chooses its Modifier order (+2 / +1 either way). v0.0.411: Light Armor Training.
  modHigh: 2, modLow: 1, modOrder: "either", armorTraining: "light", speedMod: 1, features: [],
  // batch 5 (Lucas, 2026-11-25): the Arts and the Escalation Passives left the class; level 3 keeps only its Skill Talent.
  repertoire: U(ARC_ENC), escPassives: [], escActives: [],
  levels: [
    { sections: [sec("arc1attr", "Attribute increases", "attr", { pairs: [["body", "instinct"], ["mind", "appeal"]] }), sec("arc1core", "Features", "items", { mode: "granted", items: U(["Shifting Aim", "Darting Blade", "Steady Draw", "Harrying Shot"]) }),
      sec("arc1hall", "Hallmark Action", "items", { items: U(["Quick Shots", "Strafe"]) }), sec("arc1react", "Hallmark Reaction", "items", { items: U(["Slip Away", "Snap Shot"]) }),
      sec("arc1skill", "Skill Talent", "talent")] },
    { sections: [sec("arc2hook", "Escalation Hook", "items", { mode: "granted", items: U(["Thrill of the Kill"]) }), sec("arc2enc", "Encounter Pick", "items", { items: U(ARC_ENC) }),
      sec("arc2tal", "Talent", "talent")] },
    { sections: [sec("arc3skill", "Skill Talent", "talent")] },
    { sections: [sec("arc4tal", "Stage Talent", "talent")] }   // level 4 (the Apex, Stage 1) is not written yet
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
const npc = ({ name, img, role, weaponAttribute, powerAttribute = "mind", modLead = "weapon", ratings = {}, speed = 5, extra = [], npcRole = "", size = 3, custom = null, armorDef = null, wardDef = null, sys = {} }) => {   // the Bestiary's rebuild: sys, more typed fields (ticks, tags, Reach, Steadiness, its damage line)
  const r = { body: "medium", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "medium", damage: "medium", [weaponAttribute]: "high", ...ratings };
  const basics = Object.keys(BASIC_ACTIONS).filter(k => wanted({ type: "npc" }, k)).map(k => { const d = basicItemData(k); return embedded(name, "action", d.name, d.img, d.system, d.flags); });
  // v0.0.184: the Speed is a rating (3 to 7, or Custom with system.speed), as the Builder sets it
  r.speed = [3, 4, 5, 6, 7].includes(speed) ? String(speed) : "custom";
  actors.push({ name, img, system: { level: 1, size, role, npcRole, speed, weaponAttribute, powerAttribute, modLead, ratings: r, useEscalation: false,   /* the Bestiary's rebuild (2026-11-25): Elite Escalation is deprecated (no NPC has Escalation) */ ...(custom ? { custom } : {}), ...(armorDef != null ? { armorDef } : {}), ...(wardDef != null ? { wardDef } : {}), ...sys }, items: [...extra, ...basics, (() => { const f = fistsItemData(), e = embedded(name, "weapon", f.name, f.img, f.system, f.flags); e._id = idOf("Item", `${name}:weapon:Fists`); return e; })()] });
};
// v0.0.333 (Lucas): the portraits (art/npcs/; the Grave Wisp's since 2026-11-25).
// v0.0.183 (Lucas: a complete rebuild, simple NPCs to test with): one NPC for each rank, at level 1. v0.0.407 (Stage 0 in Foundry): the Bestiary's
// Stage 0 examples (book: Example NPCs (Stage 0); their Actions: book/cards/bestiary.json, on the turn budget, the damage written whole); the Bandit
// Thug, a Grunt, is built the same way. The weapon in its hands is only what the attack looks like.
// The Bestiary's rebuild (2026-11-25; book, Bestiary, The playtest creatures; book/cards/goblin-sneak-redesign.md): the Goblin Sneak, the first Minion:
// 2 ticks (no Health), Armor Defense 13, Ward Defense 12, Weapon and Power +2 (typed), Instinct +2, Body 0, Mind 0, Appeal -1, Speed 6, Tag Goblin;
// 3 AP and no Reaction Point (its rank). Its cards: book/cards/stage0/bestiary.json; its old cards (Rusty Knife, Dirty Trick) left Foundry.
const TYPED = { body: "custom", mind: "custom", appeal: "custom", instinct: "custom", bodyHm: "custom", mindHm: "custom", ad: "custom", wd: "custom", wmod: "custom", pmod: "custom" };
{
  const n = "Goblin Sneak", shiv = npcWeapon(n, "shiv: melee, pierce, 0/1d4/1d6", "icons/svg/dagger.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/goblin-sneak.png", role: "minion", weaponAttribute: "instinct", speed: 6, ratings: TYPED,
    custom: { body: 0, mind: 0, appeal: -1, instinct: 2, bodyHealth: 0, mindHealth: 0, weapon: 2, power: 2 }, armorDef: 13, wardDef: 12,
    sys: { ticks: 2, tags: ["goblin"] }, extra: [shiv] });
}
{
  const n = "Bandit Thug", club = npcWeapon(n, "cudgel: melee, blunt, 0/1d4/1d6", "icons/svg/hammer.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/bandit-thug.png", role: "grunt", weaponAttribute: "body",
    extra: [club] });
}
// The Bestiary's rebuild (2026-11-25; book/bestiary-design.md, decisions 12 to 15; book/cards/orc-warrior-redesign.md): the Orc Warrior is the first
// Default Standard, built from the ground up: its numbers are typed (Custom), not read from the old tables: Health 45 since v0.0.527 (Vigor 28,
// Resolve 17; it was 36: 22 / 14, the default's 18 / 18 with 4 moved; Lucas, 2026-11-26: a quarter more staying power), Armor and Ward Defense 13, Body +2, Instinct +1, Appeal +1, Mind -1; Weapon and Power +2 (a Standard's Medium).
// Its cards: book/cards/stage0/bestiary.json (two Basic attacks, a Special, a Reaction, a Feature). The old sheet's cards (Cleaver, Brutal Swing,
// Avenge Kin) left Foundry: OLD_CLASS_DOCS keeps them for the tests of the machinery they exercised.
{
  const n = "Orc Warrior", axe = npcWeapon(n, "war axe: melee, slash, 0/1d4/1d6", "icons/svg/sword.svg"), jav = npcWeapon(n, "javelin: melee, thrown 6, pierce, 0/1d4/1d4", "icons/svg/thrust.svg");
  jav.system.wielded = false;   // on its back: the Barbed Javelin's Setup draws it
  npc({ name: n, img: "systems/twod12/art/npcs/orc-warrior.png", role: "standard", weaponAttribute: "body",
    ratings: TYPED,   // the Bestiary's rebuild: its Modifiers typed too (+2 / +2, every rank's)
    custom: { body: 2, mind: -1, appeal: 1, instinct: 1, bodyHealth: 28, mindHealth: 17, weapon: 2, power: 2 }, armorDef: 13, wardDef: 13,
    extra: [axe, jav] });
}
// The Bestiary's rebuild (2026-11-25; book/cards/grave-wisp-redesign.md): the Grave Wisp, the first Grunt: Health 22 (Vigor 8, Resolve 14; 18: 6 / 12 before v0.0.527), Armor
// Defense 12, Ward Defense 14, Weapon and Power +2, Mind +2, Instinct +1, Appeal 0, Body -1, Speed 6, Resistance Psychic 3, Weakness Holy 3,
// Immunity Cold; 3 AP and the Reaction Point (its rank); no weapon (its Actions are Power Actions). Its portrait: art/npcs/grave-wisp.png (Lucas).
{
  npc({ name: "Grave Wisp", img: "systems/twod12/art/npcs/grave-wisp.png", role: "grunt", weaponAttribute: "instinct", powerAttribute: "mind", modLead: "power", speed: 6, ratings: TYPED,
    custom: { body: -1, mind: 2, appeal: 0, instinct: 1, bodyHealth: 8, mindHealth: 14, weapon: 2, power: 2 }, armorDef: 12, wardDef: 14,
    sys: { dmgMods: "Resistance Psychic 3, Weakness Holy 3, Immunity Cold" } });
}
// The Bestiary's rebuild (2026-11-25; book/cards/ogre-chieftain-redesign.md): the Ogre Chieftain, the first Elite: Health 90 (Vigor 55, Resolve 35; 72: 44 / 28 before v0.0.527),
// Armor Defense 14, Ward Defense 12, Weapon and Power +2, Body +3, Instinct +1, Appeal +1, Mind -1, Large (4), Reach 2, Steadiness 1, Speed 5, Tag
// Ogre; 4 AP and the Reaction Point; no Escalation (Elite Escalation is deprecated); its extra is its Encounter Action, Crack the Ground. A club in
// one hand, the other free (Crushing Grip). Its old cards (Club, Overhead Smash, Ground Slam, Rally the Tribe) left Foundry.
{
  const n = "Ogre Chieftain", club = npcWeapon(n, "club: melee, blunt, 0/1d4/1d6", "icons/svg/hammer.svg");
  npc({ name: n, img: "systems/twod12/art/npcs/ogre-chieftain.png", role: "elite", weaponAttribute: "body", speed: 5, size: 4, ratings: TYPED,
    custom: { body: 3, mind: -1, appeal: 1, instinct: 1, bodyHealth: 55, mindHealth: 35, weapon: 2, power: 2 }, armorDef: 14, wardDef: 12,
    sys: { reachBase: 2, steadiness: 1, tags: ["ogre"] }, extra: [club] });
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
// v0.0.409 (pack F2; book, Consecrated Ground, 2026-11-16): the Zone, 3 rounds: Difficult Terrain for enemies; you and your allies who start a turn in it
// gain Guard equal to your Power Modifier (fxrules.mjs the "guard" row; areafx.mjs healAtTurnStart)
FX("Consecrated Ground", "icons/svg/sun.svg", { description: "<p>The consecrated ground (3 rounds): Difficult Terrain for enemies; you and your allies who start a turn in it gain Guard equal to your Power Modifier.</p>",
  where: "map", zone: { src: "action", inside: { carry: { on: false }, diff: { on: true, who: "enemies" }, guard: { on: true, who: "allies", self: true, formula: "@origin.pow" } }, show: true, outline: "#d4a62a", fill: "#d4a62a" },
  ends: { time: { on: true, mode: "rounds", rounds: 3 } } });
// v0.0.409 (pack F2): the effects of the Paladin's Arts (Lantern of Faith: Kindle, Reveal; Hold the Line: Brace; Commandment: Courage)
const lantern = n => ({ type: "light", bright: n, dim: 2 * n, color: "#ffd27a", lightAlpha: 0.2, lightAnim: "sunburst", lightSpeed: 2, lightIntensity: 3 });
FX("Kindle (Bright light 3)", "icons/svg/light.svg", { selfApplied: true, duration: dur("encounter"), description: "<p>You shed Bright light 3 (Dim light 3 more), EoE (Lantern of Faith, Kindle).</p>", settings: [lantern(3)] });
FX("Reveal (Bright light 1)", "icons/svg/light.svg", { duration: dur("rounds"), description: "<p>The creature sheds Bright light 1 (Dim light 1 more) for 1 round (Lantern of Faith, Reveal).</p>", settings: [lantern(1)] });
FX("Brace", "icons/svg/statue.svg", { description: "<p>For 1 round, the squares in a 1 Emanation around where you stood are Difficult Terrain for enemies (Hold the Line, Brace). They stay where they are if you move.</p>",
  where: "map", zone: { src: "here", shape: "emanation", size: "1", inside: { carry: { on: false }, diff: { on: true, who: "enemies" } }, show: true, outline: "#9aa3ad", fill: "#9aa3ad" },
  ends: { time: { on: true, mode: "rounds", rounds: 1 } } });
FX("Courage (ignore Daunted)", "icons/svg/aura.svg", { duration: dur(""), description: "<p>You ignore the Daunted condition while inside Courage's Aura.</p>", settings: [{ type: "ignore", ignoreRule: "daunted", all: [], any: [], none: [] }] });
FX("Courage", "icons/svg/aura.svg", { selfApplied: true, duration: dur("rounds"), description: "<p>For 1 round, an Aura 3 around you: you and your allies in it ignore the Daunted condition (Commandment, Courage).</p>",
  settings: [{ type: "aura", auraSize: 3, auraWho: "allies", auraSelf: true, auraOutline: "#d4a62a", auraFill: "#d4a62a", fxUuid: uuidOf("effects", "Courage (ignore Daunted)") }] });

// Effects the Paladin's cards apply
FX("Divine Power (1 Bane)", "icons/svg/degen.svg", { duration: dur("eot"), description: "<p>1 Bane on [Strike] Actions (EoT).</p>", settings: [{ type: "boonbane", boons: 0, banes: 1, all: ["strike"], any: [], none: [] }] });   // Lucas, 2026-11-13: Enfeebled left the game; Divine Power gives 1 Bane on its Strikes
FX("Beacon (+1 Defense)", "icons/svg/shield.svg", { duration: dur(""), description: "<p>+1 Defense while you are inside the Beacon's Aura.</p>", settings: [{ type: "defense", defKind: "all", defValue: 1 }] });
FX("Divine Vigil (Boon against Fear)", "icons/svg/aura.svg", { duration: dur(""), description: "<p>1 Boon on Saves against [Fear] Actions, while you are inside Divine Vigil's Aura.</p>", settings: [{ type: "boonbane", boons: 1, banes: 0, all: ["__save"], any: [], none: [], from: ["fear"] }] });
// P1 (v0.0.181): Divine Surge marks an enemy (the ally's extra damage is a button on the mark); the Beacon (was Aura of Protection) lasts 3 rounds (v0.0.254).
FX("Divine Surge", "icons/svg/sun.svg", { duration: dur("rounds"), description: "<p>For 1 round, the next time an ally deals damage to this creature, they deal an extra @Damage[1d8[mind,holy]]{[R] 1d8 Ho} (Divine Surge). Then remove this mark.</p>", settings: [] });
// v0.0.409 (pack F2): the Beacon effect left with the old Beacon card (its Step was the card's inline Action)

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

// pack TALENTS-PT (2026-11-20; book/cards/talents-playtest.md): Take Aim's effect: until EoT, 1 Boon and one range Bane less (the far range's) on your
// [Ranged, Strike] Actions; it ends when you leave your square (expireOn "__leave": stillness.mjs)
add("effects", "effect", "Take Aim", "icons/svg/target.svg", { selfApplied: true, duration: dur("eot"), expireOn: ["__leave"], description: "<p>Until the end of your turn (EoT), your [Ranged, Strike] Actions gain 1 Boon and take no Bane for the far range. It ends when you leave your square (Take Aim).</p>",
  settings: [sBoon(1, P(["ranged", "strike"])), sIgnore("rangeBane", P(["ranged", "strike"]))] }, "Talents (playtest)");

// pack TALENTS-PT (Rime Strike's Ice Pillar): a placed object, not a creature. Its settings are flags anyone can edit on the actor: object.solid (walls
// around its square block movement and Line of Effect: pillar.mjs), object.breakAt (one Action's damage of at least this breaks it; less does nothing:
// damage.mjs), object.saveTier (its Tier against a Save; by hand for now). Its Defenses are set to the Action DC when it is placed.
actors.push({ name: "Ice Pillar", img: "icons/svg/frozen.svg", tokenExtra: { disposition: 0, displayBars: 0 }, flags: { twod12: { object: { solid: true, breakAt: 5, saveTier: 1 } } },
  system: { level: 1, size: 3, role: "minion", npcRole: "", speed: 0, weaponAttribute: "body", powerAttribute: "mind", modLead: "weapon", reachBase: 1,
    ratings: { body: "custom", mind: "custom", appeal: "custom", instinct: "custom", bodyHm: "custom", mindHm: "custom", ad: "custom", wd: "custom", damage: "low", speed: "custom" },
    custom: { body: 0, mind: 0, appeal: 0, instinct: 0, bodyHealth: 5, mindHealth: 5 }, armorDef: 13, wardDef: 13, useEscalation: false }, items: [] });

/* ------------------------------------------------------------------ the cards of book/cards/*.json (pack CS, 2026-11-03): one source for the book, Foundry and the ruler.
   A card with Versions is an Action item, one without is a Feature; {{fx:Name}} and {{action:Name}} in a card are the compendium uuids. The Basic Actions
   come through module/basic-data.mjs (tools/gen-basic.mjs); the Techniques (weapon) and the NPC Actions (npc) follow in CS-3. The format: book/cards/README.md. */
const { loadCards, cardSystem, featureSystem, talentSystem, isAction, inlineCards } = await import("./cardgen.mjs");
// v0.0.246: {{link:Name|label}} (a book link to a card) is Foundry's link to the compendium item, which opens it to read (an Action, else a Feature or Talent).
export const resolveRefs = s => s.replace(/\{\{npc:([^}]+)\}\}/g, (m, n) => `Compendium.${SYSTEM}.npcs.Actor.${idOf("Actor", n)}`).replace(/\{\{fx:([^}]+)\}\}/g, (m, n) => uuidOf("effects", n)).replace(/\{\{action:([^}]+)\}\}/g, (m, n) => uuidOf("actions", n))
  .replace(/\{\{link:([^}|]+)\|([^}]+)\}\}/g, (m, n, label) => { const c = ALL_CARDS.find(x => x.name === n) ?? ALL_CARDS.flatMap(x => inlineCards(x)).find(x => x.name === n); return `@UUID[${uuidOf(c && isAction(c) ? "actions" : "features", n)}]{${label}}`; });   // v0.0.254: an inline Action links to its item too
// the cleanup audit (2026-11-26): the set-aside cards (book/cards/set-aside/: the placeholder weapons' Techniques, the set-aside Talents) are built
// here only into deprecatedDocs (the tests' fixtures, foundry/deprecated/); CARDS is what the live packs are built from
const { isSetAside } = await import(new URL("../../../book/cards/load.mjs", import.meta.url).href);
const ALL_CARDS = loadCards(undefined, { setAside: true });
export const CARDS = ALL_CARDS.filter(c => !isSetAside(c));
for (const c of ALL_CARDS) {
  if (c.foundry?.basic) continue;
  if (c.foundry === false) continue;   // v0.0.360: a card kept only for the ruler (Marked Quarry: the Mark Quarry Action holds its rules)
  const img = c.foundry?.img ?? "icons/svg/sword.svg", folder = c.foundry?.folder ?? null;
  if (c.npc) {   // an NPC's Action (CS-3): embedded on its actor after the weapon in its hands, before the Basic Actions
    const actor = actors.find(a => a.name === c.npc); if (!actor) throw new Error(`${c.name}: no NPC called ${c.npc}`);
    const w = c.foundry?.npcWeapon ? actor.items.find(i => i.type === "weapon" && i.name.toLowerCase() === c.foundry.npcWeapon.toLowerCase()) : null;
    if (c.foundry?.npcWeapon && !w) throw new Error(`${c.name}: ${c.npc} has no weapon called ${c.foundry.npcWeapon}`);
    // the Bestiary's rebuild (2026-11-25): an NPC's card with no Versions is its Feature (Cornered), embedded like its Actions
    const it = isAction(c) ? npcAction(c.npc, c.name, img, cardSystem(c, resolveRefs), w ? { twod12: { weaponId: w._id } } : {}) : embedded(c.npc, "feature", c.name, img, featureSystem(c, resolveRefs));
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

// v0.0.411 (pack F3): pack R's Paladin and Archer cards (book/cards/paladin.json, archer.json, which the ruler keeps), built as before but kept out
// of the packs: the tests of the machinery they exercised read them (OLD_CLASS_DOCS; the same shape as docs).
const { loadCards: loadOldFiles } = await import(new URL("../../../book/cards/load.mjs", import.meta.url).href);
// v0.0.412: and the gear cards the bows and swords replaced (Skirmish Shot, Heartseeker, Guarded Cut, Reaping Sweep: load.mjs FOUNDRY_OVERLAY's drop)
const { FOUNDRY_OVERLAY } = await import(new URL("../../../book/cards/load.mjs", import.meta.url).href);
const OLD_GEAR = new Set(Object.values(FOUNDRY_OVERLAY).flatMap(o => o.drop ?? []));
export const OLD_CLASS_DOCS = loadOldFiles(undefined, { setAside: true }).filter(c => (["paladin.json", "archer.json"].includes(c._file) || OLD_GEAR.has(c.name)) && c.foundry !== false).flatMap(c => {
  const img = c.foundry?.img ?? "icons/svg/sword.svg", out = [];
  if (isAction(c)) out.push({ pack: "actions", type: "action", name: c.name, img, folder: "old", system: cardSystem(c, resolveRefs), old: true });
  else out.push({ pack: "features", type: "feature", name: c.name, img, folder: "old", system: featureSystem(c, resolveRefs), old: true });
  for (const a of inlineCards(c)) out.push({ pack: "actions", type: "action", name: a.name, img, folder: "old", system: cardSystem(a, resolveRefs), old: true });
  return out;
});
// v0.0.185: the pick Features of v0.0.181 (Hallmark Action, Encounter Pick, Talent (Level 1)...) are gone: the classes have levels now.
// The cards the P1 and A1 builds left out (archive/book-drafts/paladin-old-cards.md, archive/book-drafts/archer-old-cards.md): kept in the compendium, in folders of their own, for the Options step.
const OLD = { "Paladin (old cards)": ["Aegis", "Mercy's Reward", "Divine Vigil", "Avenger's Oath", "Vow of Enmity", "Rebuke (old)", "Champion's Challenge", "Divine Retribution", "Call to Arms", "Judgment", "Sanctified Ground", "Divine Vigil (Boon against Fear)",
    // v0.0.409 (pack F2): the effects of the Paladin's pack R cards, out of Foundry's Paladin with them (kept for old worlds' sheets)
    "Divine Power (1 Bane)", "Beacon (+1 Defense)", "Divine Surge", "Radiant Zeal", "Lay On Hands (Holy Strike)", "Smite (Bright light 1)", "Smite (Bright light 2)", "Hallowed Dawn (1 Bane)", "Hallowed Dawn (Bright light 1)", "Consecrated Ground (1 Bane)"],
  "Archer (old cards)": ["Precise Aim", "Precise Aim (1 Boon)", "Precise Aim (2 Boons)", "Quick Draw", "Wing Clip", "True Shot", "Suppressing Fire", "Steady Aim", "Perfect Shot", "Bow Mastery", "Patient Hunter",
    // v0.0.411 (pack F3): the effects of pack R's Archer cards, out of Foundry's Archer with them (kept for old worlds' sheets)
    "Double Shot (2 Attacks)", "Rolling Shot (Weapon Attack)", "Rolling Shot (+1d6 Pi)", "Rolling Shot (+2d6 Pi)", "Covering Shot (Weapon Attack, 1 Boon)", "Overwatch (Weapon Attack)", "Deathmark (Weapon Attack)",
    "Open Season (the Quarry)", "Open Season (Weapon Attack)", "Covering Fire (1 Bane)", "Covering Fire (+1 Defense)", "Hunter's Focus", "Vanish (+1 Defense)", "Pinning Shot", "Twin Shot", "Harried", "Killer's Focus"] };
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
const pc = ({ name, token = "", img, species, chosen, cls, attrs, picks, level = 1, lead = "weapon", weapon, armor = "", extras = [], health = "", start = "", choices = {}, talents = [] }) => {
  const c = docOf("class", cls), lv1 = c.system.levels[0].sections, attrSec = lv1.find(x => x.kind === "attr");
  const byLevel0 = typeof Object.values(picks)[0] === "string" ? { 1: picks } : picks;
  // v0.0.407 (Stage 0 in Foundry; book, Chapter 5): no Daily Pick in Stage 0 and the Talents set aside: the builds keep their other picks
  const kindAt = (L, id) => c.system.levels[L - 1]?.sections?.find(x => x.id === id)?.kind;
  const byLevel = Object.fromEntries(Object.entries(byLevel0).map(([L, m]) => [L, Object.fromEntries(Object.entries(m).filter(([id]) => kindAt(Number(L), id) && !(TWOD12.talentsSetAside && kindAt(Number(L), id) === "talent")))]));
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
  // pack TALENTS-PT (book/cards/talents-playtest.md): the playtest Talent, outside the class's slots (the sheet's "Extra" row: the Talents are set
  // aside in the class window), and the Actions it gives
  for (const n of talents) { const it = copyDoc(name, "talent", n, { playtest: true }); items.push(it); for (const u of (it.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { talentId: it._id })); } }
  const w = copyDoc(name, "weapon", weapon, {}, { wielded: true });
  items.push(w);
  for (const u of (w.system.actions ?? [])) { const a = byUuid(u); if (a) items.push(copyDoc(name, "action", a.name, { weaponId: w._id })); }
  for (const k of Object.keys(BASIC_ACTIONS)) { const d = basicItemData(k); items.push({ _id: idOf("Item", `${name}:basic:${d.name}`), name: d.name, type: "action", img: d.img, system: d.system, flags: d.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  { const f = fistsItemData(); items.push({ _id: idOf("Item", `${name}:Fists`), name: f.name, type: "weapon", img: f.img, system: f.system, flags: f.flags, effects: [], folder: null, sort: 0, ownership: { default: 0 } }); }
  if (armor) items.push(copyDoc(name, "armor", armor, {}, { worn: true }));
  // v0.0.331: the Mastery tab's entry for the weapon (mastery.mjs: flags twod12.mastery by kind), and a Starting Mastery already chosen (Sharpshooter: 3)
  const mkey = String(weapon).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  // v0.0.412: the Starting Mastery its Feature's setting gives (the Archer's Shifting Aim: 5 with one Projectile weapon)
  const startValue = start ? (docOf("feature", start).system.settings ?? []).find(x => x.type === "mastery")?.mstValue ?? 0 : 0;
  const flags = { twod12: { mastery: { [mkey]: { name: weapon, value: startValue } }, ...(start ? { startMastery: { [idOf("Item", `${name}:feature:${start}`)]: weapon } } : {}) } };
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
const pcBoth = o => { pc(o); pc({ ...o, name: o.name.replace(/\)$/, ", level 1)"), level: 1, picks: { 1: o.picks[1] }, talents: [] }); };   // pack TALENTS-PT: the playtest Talent only at level 4
// The judging Paladin: Binding Light, Rebuke, Word of Radiance (v0.0.409, pack F2; batch 5, v0.0.507: no Art, no Escalation ability)
pcBoth({ name: "Aveline (Human Paladin, Smite)", token: "Aveline", img: ART("aveline.png"), species: "Human", chosen: ["body", "appeal"], cls: "Paladin", attrs: ["body", "instinct"], level: 4, lead: "power", health: "vigor",
  picks: { 1: { pal1hall: "Binding Light", pal1react: "Rebuke" },
    2: { pal2enc: "Word of Radiance" } }, weapon: "Longsword", armor: "Heavy Armor", talents: ["Cold Domain"] });
// The shield Paladin: Lay On Hands, Shield of Faith, Bulwark of Faith (v0.0.409, pack F2; batch 5, v0.0.507: no Art, no Escalation ability)
pcBoth({ name: "Durgan (Dwarf Paladin, Lay On Hands)", token: "Durgan", img: ART("durgan.png"), species: "Dwarf", cls: "Paladin", attrs: ["body", "instinct"], level: 4, lead: "power", health: "vigor",
  picks: { 1: { pal1hall: "Lay On Hands", pal1react: "Shield of Faith" },
    2: { pal2enc: "Bulwark of Faith" } }, weapon: "Arming Sword", armor: "Heavy Armor", talents: ["Shared Burden"] });
// v0.0.411 (pack F3, the redesigned Archer; no Starting Mastery Feature: the book's Starting Mastery comes with the weapons pass):
// the far Archer: Quick Shots, Snap Shot, Volley; the Hunting Bow and a Dagger (batch 5, v0.0.507: no Art, no Escalation Passive).
pcBoth({ name: "Sylwen (Elf Archer, Quick Shots)", token: "Sylwen", img: ART("sylwen.webp"), species: "Elf", cls: "Archer", attrs: ["instinct", "mind"], level: 4, health: "vigor", start: "Shifting Aim",
  picks: { 1: { arc1hall: "Quick Shots", arc1react: "Snap Shot" },
    2: { arc2enc: "Volley" } }, extras: [["weapon", "Dagger"]], weapon: "Hunting Bow", armor: "Light Armor", talents: ["Take Aim"] });
// the close Archer: Strafe, Slip Away, Hit and Run; the Recurve Bow and a Dagger (batch 5, v0.0.507: no Art, no Escalation Passive).
pcBoth({ name: "Kaela (Human Archer, Strafe)", token: "Kaela", img: ART("kaela.webp"), species: "Human", chosen: ["body", "instinct"], cls: "Archer", attrs: ["instinct", "appeal"], level: 4, health: "vigor", start: "Shifting Aim",
  picks: { 1: { arc1hall: "Strafe", arc1react: "Slip Away" },
    2: { arc2enc: "Hit and Run" } }, extras: [["weapon", "Dagger"]], weapon: "Recurve Bow", armor: "Light Armor", talents: ["Ricochet"] });

const FOLDER_OF = { species: "Species", class: "Class", feature: "Feature", talent: "Talent" };
for (const d of docs) if ((d.pack === "classes" || d.pack === "features") && !d.folder) d.folder = FOLDER_OF[d.type] ?? null;

// the cleanup audit (2026-11-26, Lucas: "Remove them"): the FLAVOR, AUTO and AUTO_NOTE lists are gone (they named only old cards: every card
// carries its own flavor and automation).
for (const c of ALL_CARDS) for (const d of docs) if (d.type === "effect" && d.name === c.name && c.foundry?.automation) { d.system.automation = c.foundry.automation; if (c.foundry.automationNote) d.system.automationNote = c.foundry.automationNote; }   // an Effect named like a card (Divine Surge, Pinning Shot) shows the card's rank
// v0.0.187: the Escalation Passives say so (the Features tab's Escalation section); a card says it with foundry.escalationPassive (Font of Mercy).
for (const d of docs) if (d.type === "feature" && (/escalation/i.test(d.system.category ?? ""))) d.system.escalationPassive = true;

// v0.0.323 (PACK EFFECT-SHEET): every Effect, Feature and Talent carries its rules (the Details tab's source), its Ends and the hover text built from
// them, read from its settings (fxrules.mjs migrate; the settings stay what the rolls read). The names of the dropped Effects come from the packs.
{
  const FX = await import("../module/fxrules.mjs");
  const names = Object.fromEntries(docs.map(d => [uuidOf(d.pack, d.name), d.name]));
  // the Area line as the data model writes it (data.mjs: "2 / 3 Emanation", the Versions' own sizes)
  const areaOfCfg = sy => { const c = sy?.areaCfg; if (!c?.size) return String(sy?.area ?? ""); const sizes = [...new Set([...(sy.versions ?? [])].sort((a, b) => a.ap - b.ap).map(v => v.areaSize || c.size))], sz = sizes.length > 1 ? sizes.join(" / ") : c.size; return c.shape === "line" ? `Line ${sz}` : `${sz} ${c.shape === "burst" ? "Burst" : "Emanation"}`; };
  const withRules = d => {
    if (!["effect", "feature", "talent"].includes(d.type) && !(d.type === "action" && d.system?.settings?.length)) return;   // v0.0.360: an Action that holds rules
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

// v0.0.413 (Lucas, 2026-11-17: "anything that we haven't done, either delete or put into a deprecated folder for future reference, including NPCs. I
// want just thing we worked on to matter"): what the redesigns didn't touch leaves the packs. Kept: the Basic Actions, the conditions, the species, the
// armor, the redesigned Paladin and Archer (their cards, effects and classes), the four designed weapons and their Techniques, the Dagger (the Archer's
// cards need a Light weapon), the Bestiary's four Stage 0 example NPCs, the pregenerated PCs. Out: pack R's class cards and their effects (the "old
// cards" folders), the Talents (set aside in the book) and what they grant, the placeholder weapons and their Techniques, the test Zone, Divine
// Connection, the Bandit Thug (not in the book). They are written to foundry/deprecated/ (tools/dump-deprecated.mjs; Foundry's own data, ready to
// import) and kept here as deprecatedDocs / deprecatedActors for the tests of the machinery they exercised.
export const REMOVED_B5 = ["Lantern of Faith", "Hold the Line", "Commandment", "Footwork", "Trick Shots", "Spotter",
  "Kindle (Bright light 3)", "Reveal (Bright light 1)", "Brace", "Courage (ignore Daunted)", "Courage",
  "Armor of Faith", "Roving Judgment", "Weight of Judgment", "Tireless Vigil", "Reckoning", "Hallowed Stance",
  "Lean and Loose", "Blade and Bow", "Clear Lines", "Opening Shot", "One More Arrow", "Fleet"];
export const DEPRECATED = {
  folders: ["Paladin (old cards)", "Archer (old cards)", "Testing", "Talents", "Lesser Blessing", "Weapon Techniques"],
  types: ["talent"],
  // batch 5 (Lucas, 2026-11-25: "Remove arts, remove escalation passives"): the six Arts, their effects, the Escalation Passives and Reckoning
  // (an Apex candidate: rules-backlog.md). Their cards stay in book/cards/stage0/ (unprinted) for a later return.
  names: [...REMOVED_B5, "Divine Connection", "Hindered (until Move)", "Handaxe", "Greataxe", "Mace", "Maul", "Spear", "Pike", "Knuckle Dagger", "Hand Crossbow", "Crossbow", "Pistol", "Musket"],
  actors: ["Bandit Thug"]
};
// pack TALENTS-PT: the playtest Talents (book/cards/stage0/talents-pt.json) stay; every other Talent is still set aside
const PT_TALENTS = new Set(CARDS.filter(c => c._file === "stage0/talents-pt.json").map(c => c.name));
const isDeprecated = d => DEPRECATED.folders.includes(d.folder) || (DEPRECATED.types.includes(d.type) && !PT_TALENTS.has(d.name)) || DEPRECATED.names.includes(d.name);
export const deprecatedDocs = docs.filter(isDeprecated);
export const deprecatedActors = actors.filter(a => DEPRECATED.actors.includes(a.name));
for (let i = docs.length - 1; i >= 0; i--) if (isDeprecated(docs[i])) docs.splice(i, 1);
for (let i = actors.length - 1; i >= 0; i--) if (DEPRECATED.actors.includes(actors[i].name)) actors.splice(i, 1);
{
  // a kept weapon loses a deprecated Technique (the Dagger's Stick and Slip), on the packs and on the pregens
  const gone0 = new Set(deprecatedDocs.map(d => uuidOf(d.pack, d.name)));
  for (const d of docs) if (d.type === "weapon" && d.system?.actions) d.system.actions = d.system.actions.filter(u => !gone0.has(u));
  for (const a of [...actors, ...pcs]) {
    a.items = (a.items ?? []).filter(i => !gone0.has(i.flags?.twod12?.sourceUuid));
    for (const i of a.items) if (i.type === "weapon" && i.system?.actions) i.system.actions = i.system.actions.filter(u => !gone0.has(u));
  }
}
{
  // nothing kept may point to what left (a weapon's Technique, an Action's effect, a class's Feature, a pregen's item)
  const gone = new Set(deprecatedDocs.map(d => uuidOf(d.pack, d.name))), keptIds = new Set(docs.map(d => uuidOf(d.pack, d.name)));
  const bad = [];
  for (const x of [...docs, ...actors, ...pcs]) for (const u of JSON.stringify(x).match(/Compendium\.twod12\.[a-z]+\.Item\.[A-Za-z0-9]{16}/g) ?? []) if (gone.has(u) && !keptIds.has(u)) bad.push(`${x.name} -> ${deprecatedDocs.find(d => uuidOf(d.pack, d.name) === u)?.name}`);
  if (bad.length) throw new Error(`Kept content points to deprecated items: ${[...new Set(bad)].join("; ")}`);
}
/** Every document, the deprecated ones too (for the tests of the machinery). */
export const allDocs = [...docs, ...deprecatedDocs];

export { docs, folders, uuidOf, actors, pcs };
