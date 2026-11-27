// Run with: node tools/tests/run.mjs (or node tools/tests/t181.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.243 (pack R-Foundry 1; book, Chapter 2 Action Points, Unspent AP, Reactions): 4 AP + 1 Reaction AP. The Reaction AP pays only for Reactions and
// is paid first; a kept AP can pay the rest and loses its Guard; losing or gaining AP, Slowed and Quickened touch the 4 only; each AP kept at the end of
// the turn is Guard 2 / 3 / 4 by Stage, added to the other Guard, taken first, gone when the AP are regained. NPCs 4 AP, Minions 3, every NPC the Reaction AP.
globalThis.Combat = class { setupTurns() { return this._t; } }; globalThis.CONFIG = {};
globalThis.__twod12Pick = () => true;   // v0.0.415: the pick window answers (was DialogV2.confirm)
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => true } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1 } };
const warns = []; globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
const chat = []; globalThis.ChatMessage = { create: async m => { chat.push(String(m.content).replace(/<[^>]+>/g, "")); }, getSpeaker: () => ({}) };
const cb = await import(ROOTURL + "module/combat.mjs"), G = await import(ROOTURL + "module/guard.mjs"), T = await import(ROOTURL + "module/ticker.mjs"), { TWOD12 } = await import(ROOTURL + "module/config.mjs");
console.log("--- the numbers");
console.log("AP a turn:", cb.AP_PER_TURN, "| Reaction AP:", cb.REACTION_AP, "| roles:", Object.entries(TWOD12.npcRoles).map(([k, r]) => `${k} ${r.ap}`).join(", "), "| Guard an AP by Stage:", [1, 2, 3].map(G.guardPerAP).join(" / "));
const c = sys => ({ actor: { system: sys } });
console.log("regain: healthy", cb.apPerTurn(c({})), "| Slowed 2 (conditionValue stub: none) Minion", cb.apPerTurn(c({ apPerTurn: 3 })), "| most AP", cb.apMax(c({})));
console.log("paying a Reaction (the Reaction AP first):", ["1R with RAP", cb.payReaction(1, 2, 1), "1R without", cb.payReaction(1, 2, 0), "2R with RAP", cb.payReaction(2, 2, 1), "0R", cb.payReaction(0, 0, 1)].map(x => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
console.log("Guard of kept AP: 1 AP at Stage 1 / 2 / 3:", [1, 2, 3].map(st => G.apGuardOf(1, st)).join(" / "), "| 2 AP at Stage 1:", G.apGuardOf(2, 1), "| after a 1R paid with a kept AP (Guard 4, Stage 1):", G.apGuardAfterReaction(4, 1, 1), "| never under 0:", G.apGuardAfterReaction(1, 2, 1));
console.log("--- the AP Guard is taken first (the book's example: Guard 5 from a card + 1 kept AP at Stage 1 = 7; a hit for 3)");
const r = G.absorbGuard(5, { B: { l: 3, n: 0 }, M: { l: 0, n: 0 } }, 2);
console.log(`taken ${r.taken} (${r.takenAp} from the AP Guard), AP Guard left ${r.apGuard}, other Guard left ${r.guard}, to the Health ${r.a.B.l}`);
const r2 = G.absorbGuard(5, { B: { l: 2, n: 0 }, M: { l: 8, n: 0 } }, 4); console.log("a 10 hit against 4 + 5:", `taken ${r2.taken} (AP ${r2.takenAp}), left ${r2.apGuard} / ${r2.guard}, Health takes Vigor ${r2.a.B.l} Resolve ${r2.a.M.l}`);
console.log("the old call still works:", JSON.stringify(G.absorbGuard(3, { B: { l: 5, n: 0 }, M: { l: 0, n: 0 } })));
console.log("--- the ticker's line: the Reaction AP as a diamond");
const l1 = T.makeLine("start", "Turn start", 0, 4, 4, { b: 0, a: 1 }), l2 = T.makeLine("react", "Opportunity Attack", 1, 1, 4, { b: 1, a: 0 }), l3 = T.makeLine("react", "Shield of Faith", 1, 0, 4, { b: 0, a: 0 });
console.log(JSON.stringify([l1.c, l2.c, l3.c]), "|", T.pipsHtml(l1), "|", T.pipsHtml(l2).match(/<i class="rap[^"]*"/)[0], "|", T.pipsHtml(T.makeLine("act", "Smite", 4, 2, 4)).includes("rap") ? "rap shown" : "no rap on an old line");
console.log("--- a combat (stubs): a Reaction out of turn pays with the Reaction AP, then a kept AP (v0.0.274: the Guard of the unused AP is not touched)");
const flags = { ap: 1, rap: 1, acted: false, turnLog: [] };
const actor = { name: "Drak", type: "character", isOwner: true, system: { stage: 1, apGuard: 2, apPerTurn: 4 }, update: async u => { if ("system.apGuard" in u) actor.system.apGuard = u["system.apGuard"]; } };
const cbt = { id: "c1", name: "Drak", actor, isOwner: true, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async u => { for (const [k, v] of Object.entries(u)) flags[k.replace("flags.twod12.", "")] = v; }, effects: [] };
globalThis.game = { user: { isActiveGM: true, id: "u" }, combat: { started: true, combatant: { id: "other" }, combatants: { get: () => cbt, find: () => cbt, filter: () => [cbt] }, turns: [cbt] }, socket: { emit() {} }, settings: { get: () => false } };
cb.combatantOf.toString();   // (the stub combat finds our combatant)
const ok1 = await cb.spendAP(actor, 1, "Opportunity Attack", { reaction: true }); console.log("1R:", ok1, "| AP", flags.ap, "RAP", flags.rap, "AP Guard", actor.system.apGuard, "(the Reaction AP paid: the Guard stays)");
const ok2 = await cb.spendAP(actor, 1, "Shield of Faith", { reaction: true }); console.log("another 1R:", ok2, "| AP", flags.ap, "RAP", flags.rap, "AP Guard", actor.system.apGuard, "(a kept AP paid: one AP less unused when its turn starts)");
console.log("a Reaction with nothing left asks (stub says yes):", await cb.spendAP(actor, 1, "Rebuke", { reaction: true }), "| AP", flags.ap);
console.log("--- v0.0.274 (Lucas, the book's Unspent AP): a turn that ends with AP left changes nothing; the next turn's start gives Guard for 1 round");
console.log("unusedApGuard: the first turn", JSON.stringify(cb.unusedApGuard(false, 4, 1)), "| 2 unused at Stage 1", JSON.stringify(cb.unusedApGuard(true, 2, 1)), "| 1 at Stage 3", JSON.stringify(cb.unusedApGuard(true, 1, 3)));
actor.system.apGuard = 0;
console.log("the turn starts with 2 unused:", await cb.setUnusedApGuard(cbt, true, 2), "| actor.apGuard", actor.system.apGuard, "| no chat line (v0.0.362: the Turn Breakdown shows it):", chat.at(-1) === undefined);
console.log("the next start, none unused: the Guard before ends:", await cb.setUnusedApGuard(cbt, true, 0), "| actor.apGuard", actor.system.apGuard);
const src = n => fs.readFileSync(ROOT + n, "utf8");
// v0.0.535 (the action economy, Lucas 2026-11-27): the AP are regained at the END of the turn (4 - Slowed, the ones left lost), once a turn; the start gives only Quickened's
flags.apTurn = "1:c1"; flags.ap = 1; flags.apRegained = "";
console.log("--- v0.0.535: the end of the turn regains the AP:", await cb.regainAtTurnEnd(game.combat, cbt), "| AP", flags.ap, "| a second call does nothing:", await cb.regainAtTurnEnd(game.combat, cbt), "| frozen (swapped away) regains nothing:", (flags.frozen = true, await cb.regainAtTurnEnd(game.combat, { ...cbt, getFlag: (q, k) => (k === "apRegained" ? "" : flags[k]) })), (flags.frozen = false, ""));
console.log("--- wiring: the turn's end regains the AP, then its 'ends its turn' Triggers, then the next turn starts:", /regained = await regainAtTurnEnd\(combat, ended, prior\)[\s\S]{0,400}endTurnMoment\(ended\.actor\)[\s\S]{0,200}await startTurn\(combat\);/.test(src("module/combat.mjs")), "| the start gives only Quickened's AP:", src("module/combat.mjs").includes("await setAP(c, have + q, \"start of turn\""), "| every creature starts with its AP:", src("module/combat.mjs").includes("export async function encounterAP(combat)"), "| the turn's end does nothing to the AP (v0.0.274):", !src("module/combat.mjs").includes("keepApGuard"), "| damage takes the AP Guard first:", src("module/damage.mjs").includes("absorbGuard(actor.system.guard, a, actor.system.apGuard"), "| the encounter's end drops it:", src("module/escalation.mjs").includes('g["system.apGuard"] = 0'));
console.log("the Reaction AP pip: sheet", src("templates/actor-sheet-pc.hbs").includes('class="hpip rap'), "| strip (v0.0.390: the HUD's diamond)", src("module/carousel.mjs").includes("rap, rapMax, strikes") && src("module/hudview.mjs").includes('<span class="hm-r"'), "| tracker", src("module/combat.mjs").includes('class="twod12-rap'), "| a Reaction row counts it:", src("module/actor-sheets.mjs").includes("getAP(cbt) + (it.reaction ? getRAP(cbt) : 0)"), "| Slowed / Quickened texts (4 AP, never the Reaction AP):", src("tools/content.mjs").includes("Slowed 2: you regain 2") && src("tools/content.mjs").includes("Quickened 2: you regain 6") && src("tools/content.mjs").includes("Slowed never changes your Reaction Point"));
console.log("no plain apmsg line left in combat.mjs / damage.mjs:", !src("module/combat.mjs").includes('class="twod12 chat apmsg"') && !src("module/damage.mjs").includes('class="twod12 chat apmsg"'), "| warnings:", warns.length);
