// Run with: node tools/tests/run.mjs (or node tools/tests/t109.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.124 (Round 10, part 4a): Escalation. Gained each round after the first (not Unconscious, up to 3), reset after the encounter with the effects
// it created; passives off below their minimum. v0.0.243 (pack R): a LEVEL, never spent: an Action's Escalation is a requirement; 1 at the start.
globalThis.Hooks = { on() {} };
globalThis.game = { user: { isActiveGM: true }, settings: { get: () => false, set: async () => {} } }; globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
const E = await import(ROOTURL + "module/escalation.mjs");
const S = a => new Set(a);
const pc = (name, esc, statuses = []) => { const a = { name, type: "character", system: { escalation: esc }, statuses: S(statuses), effects: [], update: async u => { a.system.escalation = u["system.escalation"]; }, deleteEmbeddedDocuments: async (t, ids) => { a.deleted = ids; } }; return a; };
const npc = { name: "Goblin", type: "npc", system: {}, statuses: S([]), effects: [] };
console.log("NPC:", E.escalationOf(npc), "| PC 2:", E.escalationOf(pc("A", 2)), "| capped:", E.escalationOf(pc("A", 7)));
const kai = pc("Kai", 0), nari = pc("Nari", 3), lonny = pc("Lonny", 1, ["unconscious"]);
const flags = {};
const combat = { started: true, round: 1, combatants: [kai, nari, lonny, npc].map(a => ({ actor: a, defeated: false })), getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; } };
await E.gainForRound(combat); console.log("round 1: Kai", kai.system.escalation, "Nari", nari.system.escalation, "Lonny", lonny.system.escalation);
combat.round = 2; await E.gainForRound(combat); console.log("round 2: Kai", kai.system.escalation, "| Nari stays at 3:", nari.system.escalation, "| Lonny (Unconscious) keeps 1:", lonny.system.escalation);
await E.gainForRound(combat); console.log("the same round again gives nothing: Kai", kai.system.escalation);
combat.round = 3; await E.gainForRound(combat); console.log("round 3: Kai", kai.system.escalation);
console.log("--- the requirement (nothing is spent)");
for (const [who, cost] of [[kai, 1], [kai, 3], [lonny, 1], [npc, 1], [kai, 0]]) console.log(`${who.name} needs ${cost}:`, JSON.stringify(E.canPayEscalation(who, cost)));
console.log("Kai after using an Escalation 2 Action:", kai.system.escalation, "| spendEscalation gone:", typeof E.spendEscalation);
console.log("--- passives (an effect with a minimum Escalation)");
const fx = (min, disabled = false) => ({ disabled, getFlag: (s, k) => (k === "minEscalation" ? min : undefined) });
const k2 = pc("K", 2), k1 = pc("K", 1);
console.log("min 2 at Escalation 2:", E.effectOff(k2, fx(2)) ? "off" : "on", "| at 1:", E.effectOff(k1, fx(2)) ? "off" : "on", "| no minimum:", E.effectOff(k1, fx(0)) ? "off" : "on", "| disabled:", E.effectOff(k2, fx(0, true)) ? "off" : "on", "| on an NPC (no Escalation):", E.effectOff(npc, fx(2)) ? "off" : "on");
console.log("--- the encounter ends");
kai.effects = [{ id: "surge", getFlag: (s, k) => (k === "fromEscalation" ? true : undefined) }, { id: "prone", getFlag: () => undefined }];
nari.system.escalation = 3; kai.system.escalation = 1;
await E.resetAfterCombat(combat); console.log("Kai", kai.system.escalation, "Nari", nari.system.escalation, "| Kai's effects removed:", JSON.stringify(kai.deleted));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const data = src("module/data.mjs"), acts = src("module/actions.mjs"), fxs = src("module/effects.mjs");
console.log("--- wiring: PC field starts at 1:", data.includes("escalation: int(1, 0),"), "| Action cost:", data.includes("escalation: int(0, 0),   // the Escalation it costs"), "| Effect minimum:", data.includes("minEscalation: int(0, 0)"), "| checked before the AP, never spent:", /canPayEscalation\(actor, escCost\)[\s\S]{0,1400}spendAP/.test(acts) && !acts.includes("spendEscalation"));
console.log("effects it applies are marked:", fxs.includes("fromEscalation: !!origin?.escalation") && acts.includes("escalation: escCost > 0,") && src("module/damage.mjs").includes("escalation: !!f.escalation"), "| the gate in rolls, damage, bonuses, Defense, Speed:", ["module/effects.mjs", "module/bonus.mjs", "module/defense.mjs", "module/speedmods.mjs"].every(f => src(f).includes("effectOff(")), "| card shows the cost:", src("module/config.mjs").includes('`<span class="esc">${Number(escalation)} Escalation</span>`'), "| sheet pips:", src("templates/actor-sheet-pc.hbs").includes('data-action="setEscalation"'), "| dropdown colors:", src("styles/system.css").includes(".twod12 multi-select option"));
nari.system.escalation = 2; kai.system.escalation = 0; await E.startAtOne(combat, { momentum: false }); console.log("an encounter starts: Nari", nari.system.escalation, "Kai", kai.system.escalation);
await E.startAtOne(combat, { momentum: true });
const el = { name: "Ogre", type: "npc", system: { useEscalation: true, escalation: 3 }, statuses: S([]), effects: [], update: async u => { el.system.escalation = u["system.escalation"]; } }; await E.startAtOne({ combatants: [{ actor: el }] }, { momentum: true });
console.log("with Momentum: Nari", nari.system.escalation, "| the NPC with Escalation on stays at 1:", el.system.escalation);
