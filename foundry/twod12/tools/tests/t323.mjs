// Run with: node tools/tests/run.mjs (or node tools/tests/t323.mjs)
// v0.0.525 (the cleanup audit's open Foundry items, 2026-11-26; foundry/foundry-backlog.md, "THE CLEANUP AUDIT: WHAT FOUNDRY STILL HAS TO FOLLOW"):
// a dead creature doesn't affect movement (Chapter 3); Charge stops at the normal Range of the weapon it attacks with (B2-014); Shake Off's face,
// the book's Save line and three Tiers (B2-015); one square of Difficult Terrain always (B2-016); Point Out on any Unsensed creature (B2-030);
// Empowered's pool and subtype chosen (B2-061); a thick wall blocks Hearing (B3-077); Shifting Aim off the Archer's turn (B3-026); Judge's free
// re-Judge is a Reaction (B3-022). The pure parts; what Foundry draws and moves is Lucas's checklist.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const enrichHTML = async t => String(t ?? "");
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, user: { getFlag: () => undefined }, combat: null };
globalThis.fromUuid = async () => null;
const C = await import(ROOTURL + "tools/content.mjs");
const RR = await import(ROOTURL + "module/roundrules.mjs"), MV = await import(ROOTURL + "module/move.mjs");
const CM = await import(ROOTURL + "module/cardmodel.mjs"), { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
const asItem = (name, d, basic = "") => ({ id: name, name, type: "action", getFlag: (s, k) => (k === "basic" ? basic : undefined), system: { ...d, traits: new Set(d.traits ?? []), versions: d.versions ?? [] } });

console.log("--- 1. a dead creature is not Difficult Terrain (Chapter 3, Creatures in your way)");
console.log("creatureWay: dead", RR.creatureWay({ unwilling: true, dead: true }), "| dead, for a drifting mover", RR.creatureWay({ drifting: true, dead: true }), "| Unconscious", RR.creatureWay({ unwilling: true, down: true }), "| an enemy", RR.creatureWay({ unwilling: true }));
const tk = (disp, statuses = [], atZero = false, type = "character") => ({ document: { disposition: disp }, actor: { type, statuses: new Set(statuses), system: { atZero } } });
const me = { disposition: 1 };
for (const [label, t] of [["a dead PC ally", tk(1, ["dead"], true)], ["an Unconscious PC enemy", tk(-1, ["unconscious"], true)], ["an NPC at 0, no status", tk(-1, [], true, "npc")], ["an NPC at 0, Unconscious", tk(-1, ["unconscious"], true, "npc")], ["an NPC at 0, Dead", tk(-1, ["dead"], true, "npc")], ["a Dying PC enemy, fighting", tk(-1, ["dying"], true)]])
  console.log(`${label}:`, MV.wayKind(t, me), "| dead", MV.deadTok(t), "| Unconscious", MV.downTok(t));
const mv = src("module/move.mjs");
console.log("its space: no creature's on a path (ends there, passes):", mv.includes('!t.document?.hidden && wayKind(t, doc) !== "none");'), "| not in a Charge's way:", mv.includes('.find(t => t && wayKind(t, doc) !== "none");'), "| not a blocker on a diagonal:", mv.includes("return t && !downTok(t) && !deadTok(t) ? t : null;"));

console.log("--- 2. Charge stops at the weapon's normal Range (B2-014)");
const WR = await import(ROOTURL + "module/weaponrange.mjs");
const w = (id, name, traits, extra = {}) => ({ id, name, system: { traits: new Set(traits), ...extra } });
const sword = w("s", "Arming Sword", ["melee"], { range: "1" }), bow = w("b", "Hunting Bow", ["ranged", "projectile"], { range: "12/24/48" }), axe = w("h", "Hand Axe", ["melee", "thrown"], { range: "1", thrownRange: "5/10" }), long = w("l", "Spear", ["melee", "long"], { range: "2" });
const show = list => list.map(x => `${x.label} ${x.normal}`).join(", ");
console.log("a sword:", show(WR.chargeAttacks({ weapons: [sword] })), "| ask:", WR.chargeNeedsPick(WR.chargeAttacks({ weapons: [sword] })));
console.log("a bow:", show(WR.chargeAttacks({ weapons: [bow] })), "| a Long weapon:", show(WR.chargeAttacks({ weapons: [long] })), "| Reach 2 with the sword:", show(WR.chargeAttacks({ weapons: [sword], reach: 2 })));
console.log("a Thrown axe:", show(WR.chargeAttacks({ weapons: [axe] })), "| ask:", WR.chargeNeedsPick(WR.chargeAttacks({ weapons: [axe] })), "| a sword and a bow, ask:", WR.chargeNeedsPick(WR.chargeAttacks({ weapons: [sword, bow] })));
const orc = [{ id: "a", name: "Hamstringing Axe", system: { distance: "reach" } }, { id: "j", name: "Barbed Javelin", system: { distance: "6" } }];
console.log("an NPC's Basic attacks (first, its weapons left out):", show(WR.chargeAttacks({ weapons: [bow], npcAttacks: orc })), "| nothing in hand:", WR.chargeAttacks({ weapons: [] }).length);
console.log("the picker stops there:", mv.includes("const reach = Math.max(1, num(ch.stopRange) || num(c.actor?.system?.reach) || 1);"), "| asked with the pick bar:", mv.includes("Charge: which weapon do you attack with?"));

console.log("--- 3. Shake Off's face (B2-015): the book's Save line and three Tiers");
const so = asItem("Shake Off", B.shakeOff, "shakeOff"), m = CM.cardModel(so);
console.log("its lines:", CM.modelLabels(m).join(" | "), "| the Save line ends in its button:", /@ShakeOff\[save\]\{The target's Save\}$/.test(m.top.find(l => l.label === "Save")?.text ?? ""), "| drawn rich:", m.top.find(l => l.label === "Save")?.fmt);
console.log("the Use still makes no roll:", B.shakeOff.versions[0].noTiers, "| its Effect text kept for the older faces:", B.shakeOff.versions[0].effects.includes("@ShakeOff[save]{Save}"), "| the short card keeps the Save line:", CM.shortModel(m).top.some(l => l.label === "Save"));
console.log("Tier 2:", m.versions[0].lines.find(l => l.label === "Tier 2")?.text);
console.log("the no-roll chat card draws the Tiers:", src("module/chatcards.mjs").includes('(m.card.after ?? []).filter(l => /^Tier [123]$/.test(l.label))'), "| and not its Effect text:", src("module/actions.mjs").includes('chipCard ? "" : version.effects ?? ""'));

console.log("--- 4. one square of Difficult Terrain always (B2-016; Chapter 3's example: Mark)");
const one = (cost, entered, budget, size) => RR.oneSquareCost({ cost, entered, budget, size });
console.log("Crawl 1 into rubble (costs 2):", one(2, 1, 1, 1), "| Speed 1, Advance into rubble:", one(2, 1, 1, 1), "| Advance 3, 2 used, then rubble:", one(2, 1, 1, 3), "| two squares:", one(3, 2, 1, 1), "| no movement:", one(2, 1, 0, 0), "| Speed 5:", one(2, 1, 5, 5));
const area = oneAlways => MV.reachableCells([{ i: 0, j: 0 }], 1, () => false, 0, () => 1, oneAlways).length;
console.log("the movement area of a 1-square movement where every square costs 2: without the rule", area(false), "| with it", area(true));
console.log("Evade left out (an Evade can't enter Difficult Terrain):", JSON.stringify(MV.moveBudget({ getFlag: (s, k) => (k === "evadeMove" ? 2 : 0), actor: { system: { speed: 5 } } })), "| a granted movement:", JSON.stringify(MV.moveBudget({ getFlag: (s, k) => ({ freeMove: 1, freeSize: 1 })[k] ?? 0, actor: { system: { speed: 1 } } })), "| a new AP's Speed:", JSON.stringify(MV.moveBudget({ getFlag: () => 0, actor: { system: { speed: 1 } } })));

console.log("--- 5. Point Out on any Unsensed creature (B2-030)");
const H = await import(ROOTURL + "module/hide.mjs");
const po = o => JSON.stringify(H.pointOutStep(o));
console.log("Unsensed from Hide (its senses: Clear):", po({ hide: "unsensed", senses: "clear", mine: "clear" }));
console.log("Unsensed in Darkness (no Hide):", po({ hide: "", senses: "unsensed", mine: "obscured" }));
console.log("Unsensed from Hide and in Darkness:", po({ hide: "unsensed", senses: "unsensed", mine: "hidden" }));
console.log("Hidden from Hide, you perceive it Clear:", po({ hide: "hidden", senses: "clear", mine: "clear" }), "| you perceive it Hidden:", po({ hide: "hidden", senses: "clear", mine: "hidden" }));
console.log("Hidden by Hearing only:", po({ hide: "", senses: "hidden", mine: "clear" }));
const SN = await import(ROOTURL + "module/senses.mjs");
console.log("kept until it Hides again (v0.0.526):", SN.pointedOutHolds({ x: 100, y: 200 }), "| none:", SN.pointedOutHolds(undefined), "| Hide clears it:", src("module/hide.mjs").includes('unsetFlag(F, "pointedOut")'));
console.log("perceive reads it:", src("module/senses.mjs").includes('pointedOutHolds(t?.getFlag?.("twod12", "pointedOut")?.[observer.document.id])) best = ["hidden", "Point Out"];'), "| Point Out uses it:", src("module/actions.mjs").includes("await H.pointOut(r0.uuid, who, selfToken,"));

console.log("--- 6. Empowered's pool and subtype chosen (B2-061)");
const EX = await import(ROOTURL + "module/explode.mjs");
const comps = [{ kind: "W", pool: "B", sub: "Slash" }, { kind: "D", pool: "B", sub: "Slash", label: "Modifier" }, { kind: "D", pool: "M", sub: "Holy" }, { kind: "D", pool: "B", sub: "Fire", crit: true }];
console.log("an Action dealing two kinds:", EX.empoweredKinds(comps).map(EX.empoweredKindLabel).join(" / "), "| one kind:", EX.empoweredKinds(comps.slice(0, 2)).map(EX.empoweredKindLabel).join(" / "), "| none:", EX.empoweredKinds([]).length);
console.log("one kind takes no pick:", (await EX.chooseEmpowered(comps.slice(0, 2)))?.sub, "| the roll, a Save Action's damage and several creatures choose:", (src("module/actions.mjs").match(/chooseEmpowered\(/g) ?? []).length, (src("module/inline.mjs").match(/chooseEmpowered\(/g) ?? []).length);

console.log("--- 7. a thick wall blocks Hearing (B3-077)");
const p = (x, y) => ({ x, y });
console.log("crossing:", SN.segmentsCross(p(0, 0), p(10, 0), p(5, -5), p(5, 5)), "| not:", SN.segmentsCross(p(0, 0), p(10, 0), p(15, -5), p(15, 5)), "| touching at an end:", SN.segmentsCross(p(0, 0), p(10, 0), p(10, -5), p(10, 5)));
const walls = [{ c: [50, -100, 50, 100], thick: true }, { c: [150, -100, 150, 100], thick: false }];
console.log("a thick wall between:", SN.thickBetween(p(0, 0), p(100, 0), walls), "| a thin one only:", SN.thickBetween(p(100, 0), p(200, 0), walls), "| the flag:", SN.isThickWall({ flags: { twod12: { thick: true } } }), SN.isThickWall({ flags: {} }));
console.log("Hearing and Tremorsense read it:", src("module/senses.mjs").includes("<= hearingRange(observer.actor) && !thickWallBetween(observer, target);"), src("module/senses.mjs").includes('if (s.needs === "ground" && thickWallBetween(observer, target)) continue;'), "| the Wall settings' checkbox:", src("module/twod12.mjs").includes('Hooks.on("renderWallConfig"'));

console.log("--- 8. Shifting Aim off the Archer's turn (B3-026)");
const HK = await import(ROOTURL + "module/hooks.mjs");
const cb = { started: true, id: "C", round: 2, turn: 3 };
console.log("the turn in progress:", HK.turnNowKey(cb), "| no combat:", HK.turnNowKey(null), "| moved this turn:", HK.movedThisTurn({ key: "C:2:3", moved: true }, "C:2:3"), "| on an earlier turn:", HK.movedThisTurn({ key: "C:2:2", moved: true }, "C:2:3"), "| a Strike since:", HK.movedThisTurn({ key: "C:2:3", moved: false }, "C:2:3"));
const hs = src("module/hooks.mjs");
console.log("its chip off its turn:", hs.includes('if (!key) return movedChips;'), "| a Strike spends it on any turn:", hs.includes('await actor.setFlag(F, "moveState", { key: now, moved: false });'), "| a move marks it on any turn:", hs.includes('await actor.setFlag(F, "moveState", { key: now, moved: true });'));

console.log("--- 9. Judge's free re-Judge is a Reaction (B3-022)");
const IN = await import(ROOTURL + "module/inline.mjs"), AU = await import(ROOTURL + "module/automation.mjs");
console.log("@Use[...|asreaction:yes]:", IN.parseInline("Use", "Judge|ap:0|asreaction:yes").asReaction, "| without:", !!IN.parseInline("Use", "Judge|ap:0").asReaction);
console.log("the message's button:", AU.messageHtml({ name: "Aveline" }, { text: "{mark} went Down.", action: "Judge", ap: 0, reaction: true, source: "Judge" }, { mark: "Orc Warrior" }));
const judge = C.docs.find(d => d.name === "Judge" && d.type === "action"), md = (judge?.system?.settings ?? []).find(s => s.type === "message" && s.msgWhen === "markDown");
console.log("Judge's markDown message is a Reaction:", md?.msgReaction, "| its encounter one is not:", !!(judge?.system?.settings ?? []).find(s => s.type === "message" && s.msgWhen === "encounter")?.msgReaction);
console.log("Staggered warns for it:", src("module/actions.mjs").includes("if ((item.system?.reaction || opts.asReaction) && reactionsOff(actor)"), "| its card says 0R:", src("module/actions.mjs").includes("cost: it.reaction || opts.asReaction ?"), "| the use passes it:", src("module/freeuse.mjs").includes("asReaction: !!cfg.asReaction,"));
