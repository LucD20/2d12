// Run with: node tools/tests/run.mjs (or node tools/tests/t318.mjs)
// The Bestiary's rebuild in Foundry (2026-11-25; book, Bestiary; book/bestiary-design.md): Minion ticks (the seven rules), squads of 2, the ranks'
// CV and no Elite Escalation, Resistance / Weakness / Immunity the word first, and the general settings the four playtest creatures' cards need.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };

const R = await import(ROOTURL + "module/roundrules.mjs");
console.log("--- the tick rules (roundrules.mjs)");
const T = o => R.ticksRemoved(o);
console.log("1. a Tier's ticks, once an Action:", T({ dealt: 3, tier: 1 }), T({ dealt: 3, tier: 2 }), T({ dealt: 3, tier: 3 }), "| a Tier that deals no damage:", T({ dealt: 0, tier: 3 }), "| the Action already ticked it (its own Collision):", T({ dealt: 2, tier: 0, ticked: true }), T({ dealt: 5, tier: 2, ticked: true }));
console.log("2. a Save Action, turned over: Tier 1", T({ dealt: 4, tier: 1, save: true }), "Tier 2", T({ dealt: 4, tier: 2, save: true }), "Tier 3", T({ dealt: 1, tier: 3, save: true }), "| no damage:", T({ dealt: 0, tier: 1, save: true }));
console.log("4. damage with no Tier (a Shove's Collision, a Lingering, a zone):", T({ dealt: 2 }), "| 5. a rider alone:", T({ dealt: 0 }));
console.log("6. a heal restores 1 (never past its ticks):", R.ticksAfterHeal(0, 2), R.ticksAfterHeal(1, 2), R.ticksAfterHeal(2, 2));
console.log("7. 1 tick left: by Vigor", JSON.stringify(R.minionState({ max: 2, lost: 1, by: "B" })), "| by both", JSON.stringify(R.minionState({ max: 2, lost: 1, by: "BM" })), "| full", JSON.stringify(R.minionState({ max: 2, lost: 0 })), "| no overflow, Down:", JSON.stringify(R.minionState({ max: 2, lost: 5 })));
console.log("the ticks in the damage record: [V] 4 + [R] 1, 2 ticks:", JSON.stringify(R.tickBuckets({ B: { l: 4, n: 0 }, M: { l: 1, n: 0 } }, 2)), "| Nonlethal [R]:", JSON.stringify(R.tickBuckets({ B: { l: 0, n: 0 }, M: { l: 0, n: 3 } }, 1)));
console.log("squads of", R.MINION_SQUAD, "| 4 Minions:", JSON.stringify(R.evenGroups([1, 2, 3, 4].map(i => ({ id: i }))).map(g => g.length)), "| a Minion's ticks by default:", R.MINION_TICKS);

console.log("--- a Minion's damage, heal and bars");
const D = await import(ROOTURL + "module/damage.mjs");
const minion = (lost = 0, flags = {}) => ({ system: { isMinion: true, ticksLeft: 2 - lost, ticksMax: 2, pool: 2, totalDamage: lost }, getFlag: (s, k) => flags[k] });
let a = { B: { l: 6, n: 0 }, M: { l: 0, n: 0 } }, u = await D.minionTicksOf(minion(), a, { tick: { tier: 2, action: "card1" } });
console.log("a Tier 2 of 6 Vigor on a fresh Minion:", JSON.stringify(a), JSON.stringify(u));
a = { B: { l: 2, n: 0 }, M: { l: 0, n: 0 } }; u = await D.minionTicksOf(minion(1, { tickedBy: ["card1"] }), a, { tick: { action: "card1" } });
console.log("then its own Push's Collision (the same Action):", a.ticks, JSON.stringify(u));
a = { B: { l: 2, n: 0 }, M: { l: 0, n: 0 } }; u = await D.minionTicksOf(minion(1, { tickedBy: ["card1"] }), a, {});
console.log("a hazard's damage (no Tier, nothing ticked it):", a.ticks, JSON.stringify(u));
a = { B: { l: 3, n: 0 }, M: { l: 0, n: 0 } }; await D.withTickScope("card9", () => D.minionTicksOf(minion(0, { tickedBy: ["card9"] }), a, {}));
console.log("a Collision inside an Action's scope that ticked it:", a.ticks, "| the scope is restored:", JSON.stringify(D.tickScope));
console.log("the damage text:", D.summaryText({ ticks: 1, B: { l: 1, n: 0 }, M: { l: 0, n: 0 } }));
const H = await import(ROOTURL + "module/healwin.mjs");
console.log("a heal of any size, 1 tick:", JSON.stringify(H.minionHealPlan({ bodyLethal: 0, mindLethal: 2, bodyNonlethal: 1 })), "| nothing to heal:", JSON.stringify(H.minionHealPlan({})));
const HP = await import(ROOTURL + "module/hudhp.mjs");
console.log("the HUD's ticks box: -1", JSON.stringify(HP.hudTickChange("-1", {}, 2)), "| +1 from 0 left", JSON.stringify(HP.hudTickChange("+1", { bodyLethal: 1, mindLethal: 1 }, 2)), "| =2 when full:", HP.hudTickChange("2", {}, 2));
console.log("its HTML:", HP.hudHpHtml({ isMinion: true, ticksLeft: 1, ticksMax: 2 }).includes('data-twod12-pool="ticks" value="1"'));
const HB = await import(ROOTURL + "module/healthbar.mjs");
const pb = HB.planHealthBar({ isMinion: true, bdt: 2, mdt: 0, pool: 2, damage: { bodyLethal: 0, mindLethal: 1 }, bloodied: false, strained: true }, new Set(), 100);
console.log("the token bar: ticks", JSON.stringify(pb.ticks), "| Strained by its Resolve tick:", pb.strained, pb.bloodied, "| the pips drawn for everyone:", src("module/healthbar.mjs").includes("if (p.ticks && !p.dead) drawTickPips(token, w, h, p.ticks);"));
const HV = await import(ROOTURL + "module/hudview.mjs");
console.log("the HUD's bar:", HV.barHtml({ name: "Ticks", cls: "t", left: 1, max: 2, ticks: true }).includes("1/2 ticks"));
const SM = await import(ROOTURL + "module/sheetmodel.mjs");
console.log("Bloodied / Strained tags read the ticks:", JSON.stringify(SM.healthTags({ isMinion: true, bloodied: true, strained: false, bdt: 2, bodyDamage: 1 })));
const DT = src("module/data.mjs");
console.log("the data: ticks typed (2), its Pool, an object keeps its Health:", DT.includes("ticks: int(MINION_TICKS, 0), tickBy: str(\"\"),") && DT.includes("if (this.isMinion) { this.bdt = Math.max(1, Math.trunc(Number(this.ticks)) || MINION_TICKS); this.mdt = 0; }") && DT.includes("!(this.parent?.flags?.twod12?.object)"));
console.log("the damage card passes its Tier, its Save and its Action:", src("module/ccdamage.mjs").includes("const tick = { tier: Number(r.tier) || 0, save: !!s.save, action: s.srcId || \"\" };"), "| a Save card's row:", src("module/inline.mjs").includes("dealDamageEx(actor, comps, { tick: { tier: chk.tier, save: true, action: msg?.id ?? \"\" } })"), "| a Move chip from a card is its Action's:", src("module/move.mjs").includes("D.withTickScope(msgId, () => handleMoveIn(cfg, ctx))"));

console.log("--- the ranks");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
console.log("CV:", Object.entries(TWOD12.npcRoles).map(([k, v]) => `${k} ${v.cv[0]}`).join(", "), "| a Minion's Reaction Point:", TWOD12.npcStage0.minion.reactionAp, "| paid with a kept AP:", R.canPayReaction(1, 1, 0), R.canPayReaction(1, 0, 0));
console.log("no Elite Escalation by default:", !DT.includes("eliteLadder: bool"), src("tools/content.mjs").includes("useEscalation: false,"), "| the HUD:", src("module/hud.mjs").includes('has = actor.type !== "npc" || !!s.useEscalation;'));
const CC = await import(ROOTURL + "module/chatcards.mjs");
console.log("the word first:", JSON.stringify(CC.parseDmgMods("Resistance Psychic 3, Fire 5 · Weakness Holy 3 · Immunity Cold, Lingering")), "| the old writing still read:", JSON.stringify(CC.parseDmgMods("Resist 5 Fire, Weak 2 Holy, Immune Cold")));
console.log("written back:", SM.dmgModsText(CC.parseDmgMods("Resist 5 Fire, Weak 2 Holy, Immune Cold"), CC.SUBS ?? { Fi: ["Fire"], Ho: ["Holy"], Co: ["Cold"] }), "| labels:", TWOD12.rwKinds.resist, TWOD12.rwKinds.weak, TWOD12.rwKinds.immune);

console.log("--- the general settings");
const M = await import(ROOTURL + "module/moment.mjs");
console.log("new moments:", ["selfDamage", "selfDown", "allyDown", "enemyEnters"].map(k => `${k} ${JSON.stringify(M.MOMENTS[k])}`).join(" | "));
console.log("self only:", M.sideOk("self", 1, 1, true), M.sideOk("self", 1, 1, false), "| an ally (not you):", M.sideOk("ally", 1, 1, false), M.sideOk("ally", 1, 1, true, false));
const MS = src("module/moment.mjs");
console.log("a Reaction's pool, state and Tag are read:", MS.includes("if (P && !((Number(ev.pools?.[P]) || 0) > 0)) continue;") && MS.includes("if (S && !(ev.state ? ev.state[S] : actor.system?.[S])) continue;") && MS.includes("hasTag(sj?.actor, T)"),
  "| selfDown saves nothing:", MS.includes('kinds: ["wouldDown", "selfDown"]') && MS.includes('u.moment === "wouldDown"'), "| enemyEnters has no Move back:", MS.includes("const noBack = open.length > 0 && open.every(r => MOMENTS[r.moment]?.noBack);"));
console.log("the state after the damage, for 'you take damage':", src("module/damage.mjs").includes("const stateAfter = sys0.isMinion ? null : { bloodied: sys0.bdt > 0 && nowOf(\"bodyLethal\") + nowOf(\"bodyNonlethal\") >= sys0.bdt"));
const HK = await import(ROOTURL + "module/hooks.mjs");
const orc = b => ({ system: { bloodied: b }, items: [{ name: "Cornered", system: { hooks: [{ kind: "stateBoon", basic: "shove", state: "bloodied", boons: 1 }] } }] });
const shove = { getFlag: () => "shove", system: { traits: new Set(["body"]) } }, trip = { getFlag: () => "trip", system: { traits: new Set(["body"]) } };
console.log("stateBoon: Bloodied orc's Shove", JSON.stringify(HK.stateBoonChips(orc(true), shove)), "| its Trip", HK.stateBoonChips(orc(true), trip).length, "| not Bloodied", HK.stateBoonChips(orc(false), shove).length);
console.log("Drifting:", R.creatureWay({ drifting: true, unwilling: true }), "| an enemy", R.creatureWay({ unwilling: true }), "| an ally", R.creatureWay({}), "| a Down enemy", R.creatureWay({ unwilling: true, down: true }), "| read from the hook:", src("module/move.mjs").includes('(i.system?.hooks ?? []).some(h => h?.kind === "drift")'));
const FU = await import(ROOTURL + "module/freeuse.mjs");
const axe = { name: "Axe", system: { distance: "reach" } }, jav = { name: "Javelin", system: { distance: "6" } };
console.log("the Basic attack that reaches: adjacent", FU.basicReaching([axe, jav], 1, 1).map(x => x.name).join(","), "| 4 squares", FU.basicReaching([axe, jav], 4, 1).map(x => x.name).join(","), "| 9 squares", FU.basicReaching([axe, jav], 9, 1).length);
console.log("the flanking Requirement (a warning):", src("module/actions.mjs").includes("if (item.system?.reqFlank) {") && DT.includes("reqFlank: bool(),"));
const CG = await import(ROOTURL + "tools/cardgen.mjs");
console.log("a Line written the book's way:", JSON.stringify(CG.areaOf({ area: "Line 3" })?.cfg));

console.log("--- the creatures");
const C = await import(ROOTURL + "tools/content.mjs");
for (const n of ["Goblin Sneak", "Grave Wisp", "Orc Warrior", "Ogre Chieftain"]) {
  const x = C.actors.find(a => a.name === n), s = x.system;
  console.log(`${n}: ${s.role} | ratings ${s.ratings.wmod}/${s.ratings.pmod} | custom ${JSON.stringify(s.custom)} | AD ${s.armorDef} WD ${s.wardDef} | Speed ${s.speed} | ${s.ticks ? `ticks ${s.ticks}` : ""} ${s.tags ? `tags ${JSON.stringify(s.tags)}` : ""} ${s.dmgMods ? s.dmgMods : ""} ${s.reachBase ? `Reach ${s.reachBase} Steadiness ${s.steadiness} Size ${s.size}` : ""} | ${x.img.replace(/^.*\//, "")}`);
  console.log("   ", x.items.filter(i => !i.flags?.twod12?.basic && i.type !== "weapon").map(i => `${i.name}:${i.system.automation}${i.system.moment ? `(${i.system.moment})` : ""}`).join(", "));
}
console.log("the old cards out of the packs, kept as fixtures:", ["Rusty Knife", "Dirty Trick", "Chilling Touch", "Dread Whisper", "Club", "Overhead Smash", "Ground Slam", "Rally the Tribe"].every(n => !C.actors.some(a => a.items.some(i => i.name === n && i.type === "action")) && C.OLD_CLASS_DOCS.some(i => i.name === n)));
