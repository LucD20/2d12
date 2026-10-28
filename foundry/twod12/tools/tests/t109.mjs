// Run with: node tools/tests/run.mjs (or node tools/tests/t109.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.124 (Round 10, part 4a): Escalation. Gained each round after the first (not Unconscious, up to 3), spent on Escalation Actions,
// reset after the encounter with the effects it created; passives off below their minimum.
globalThis.Hooks = { on() {} };
globalThis.game = { user: { isActiveGM: true } };
const E = await import(ROOT + "module/escalation.mjs");
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
console.log("--- paying");
for (const [who, cost] of [[kai, 1], [kai, 3], [lonny, 1], [npc, 1], [kai, 0]]) console.log(`${who.name} pays ${cost}:`, JSON.stringify(E.canPayEscalation(who, cost)));
await E.spendEscalation(kai, 2); console.log("Kai spent 2:", kai.system.escalation);
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
console.log("--- wiring: PC field:", data.includes("escalation: int(0, 0),   // 0 to 3"), "| Action cost:", data.includes("escalation: int(0, 0),   // the Escalation it costs"), "| Effect minimum:", data.includes("minEscalation: int(0, 0)"), "| checked before the AP, spent after:", /canPayEscalation\(actor, escCost\)[\s\S]{0,200}spendAP[\s\S]{0,120}spendEscalation\(actor, escCost\)/.test(acts));
console.log("effects it applies are marked:", fxs.includes("fromEscalation: !!origin?.escalation") && acts.includes("escalation: escCost > 0,") && src("module/damage.mjs").includes("escalation: !!f.escalation"), "| the gate in rolls, damage, bonuses, Defense, Speed:", ["module/effects.mjs", "module/bonus.mjs", "module/defense.mjs", "module/speedmods.mjs"].every(f => src(f).includes("effectOff(")), "| card shows the cost:", src("module/config.mjs").includes('`<span class="esc">${Number(escalation)} Escalation</span>`'), "| sheet pips:", src("templates/actor-sheet.hbs").includes('data-action="setEscalation"'), "| dropdown colors:", src("styles/system.css").includes(".twod12 multi-select option"));
nari.system.escalation = 2; await E.startAtZero(combat); console.log("an encounter starts: Nari", nari.system.escalation);
