// Run with: node tools/tests/run.mjs (or node tools/tests/t296.mjs)
// v0.0.484: chat card clean Took line (only Bloodied/Strained/Down; RWI only in breakdown) + all L1 playtest PC & NPC automations.
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u", targets: new Set() }, combat: null, items: [], packs: new Map(), actors: [] };

const CC = await import(ROOTURL + "module/chatcards.mjs");
const IN = await import(ROOTURL + "module/inline.mjs");
const SL = await import(ROOTURL + "module/statelines.mjs");
const CR = await import(ROOTURL + "module/critical.mjs");
const AU = await import(ROOTURL + "module/automation.mjs");
const FR = await import(ROOTURL + "module/fxrules.mjs");
const EF = await import(ROOTURL + "module/effects.mjs");
const MV = await import(ROOTURL + "module/move.mjs");
const CF = await import(ROOTURL + "module/config.mjs");
const CN = await import(ROOTURL + "tools/content.mjs");

console.log("--- 1. Chat card Took line (only state chips; RWI in breakdown only)");
const dmgHtml = CC.damageCardHtml({
  name: "Cleaver", nl: false,
  groups: [{ tier: 2, crit: false, comps: [{ pool: "B", sub: "S", total: 12, dice: [] }], riders: [], rows: [0, 1] }],
  rows: [
    { uuid: "a", name: "Orc", g: 0, applied: { took: { B: 10, M: 0 }, mods: [{ kind: "resist", sub: "S", label: "Resist Slash", v: -2 }], state: "bloodied", factor: 1 } },
    { uuid: "b", name: "Goblin", g: 0, applied: { took: { B: 10, M: 0 }, mods: [{ kind: "weak", sub: "S", label: "Weak Slash", v: 2 }], state: "down", factor: 1 } }
  ]
});
const tooks = [...dmgHtml.matchAll(/<span class="cc-took">([\s\S]*?)<\/span>(?=<\/span>)/g)].map(m => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
console.log("took lines (no Resist/Weak tag):", tooks.join(" | "), "| Resist still in breakdown:", dmgHtml.includes("Resist Slash"));

console.log("--- 2. Dirty Trick @Boon tier rider + Circling Shot / Thwart Cut / Darting Blade inline parsing");
console.log("tierConditionChips @Boon:", JSON.stringify(IN.tierConditionChips("@Boon[-1|bb:pressure|next:roll]{1 Pressure Bane} on its next roll.")));
console.log("parseInline threaten:", IN.parseInline("Condition", "pressed|value:2|eot|threaten:yes").threaten,
  "| stow:", IN.parseInline("Move", "evade|distance:2|stow:drawn").stow,
  "| nofarther:", IN.parseInline("Move", "evade|distance:1|nofarther:target").noFarther);
console.log("tierMoveThen Circling Shot:", JSON.stringify(IN.tierMoveThen("you @Move[evade|distance:1|nofarther:target]{Evade 1} to a square.")));

console.log("--- 3. Overhead Smash Bloodied additive push (moveAddFor)");
const smashLines = { bloodied: "On a Tier 2 or 3, the target is @Move[pushed|distance:1]{Pushed 1} more." };
console.log("T1 bloodied:", SL.moveAddFor(smashLines, {}, { b: true }, 1, "pushed"),
  "| T2 unbloodied:", SL.moveAddFor(smashLines, {}, { b: false }, 2, "pushed"),
  "| T2 bloodied:", SL.moveAddFor(smashLines, {}, { b: true }, 2, "pushed"),
  "| isMoveAddLine:", SL.isMoveAddLine(smashLines.bloodied));

console.log("--- 4. Quick Shots Critical AP gain (critRowAp)");
console.log("gain 1 AP:", CR.critRowAp("You gain 1 AP."), "| Prone:", CR.critRowAp("Prone."));

console.log("--- 5. Spotter Find the Gap & Keep Low (adjustCover)");
const mkCov = (n, noLoE = false) => ({ level: n, banes: n, noLoE, label: ["No cover", "Low cover", "Medium cover", "High cover"][n] ?? "Total cover" });
console.log("lower:", [1, 2, 3].map(n => AU.adjustCover(mkCov(n), { lower: 1 }).banes).join("/"),
  "| lower Total stays noLoE:", AU.adjustCover(mkCov(4, true), { lower: 1 }).noLoE,
  "| higher:", [0, 1, 2, 3].map(n => AU.adjustCover(mkCov(n), { higher: 1 }).banes).join("/"),
  "| both on Med:", AU.adjustCover(mkCov(2), { lower: 1, higher: 1 }).banes);

console.log("--- 6. fxrules migrate/compile for coverLower, coverHigher, daunted, rangeAll");
const mig = FR.migrate({ settings: [
  { type: "ignore", ignoreRule: "rangeBane", rangeAll: true, all: ["ranged", "strike"] },
  { type: "ignore", ignoreRule: "coverLower", all: ["ranged", "strike"] },
  { type: "ignore", ignoreRule: "coverHigher", all: [] },
  { type: "ignore", ignoreRule: "daunted", all: [] }
] });
const cmp = FR.compile(mig.rules, mig.ends);
console.log("round-trip ignoreRules:", cmp.settings.map(s => `${s.ignoreRule}${s.rangeAll ? ":all" : ""}`).join(", "));

console.log("--- 7. Courage ignores Daunted modifier + Thwart Cut stillThreatens + Seizing Cut grabbed hand");
const mkFx = (id, name, statuses, flags) => ({ id, name, disabled: false, statuses: new Set(statuses), getFlag: (_f, k) => flags[k] });
const dauntFx = mkFx("e1", "Daunted (Grave Wisp)", ["daunted"], { modifiers: [{ against: false, boons: 0, banes: 1, bb: "pressure", all: [], any: [], none: [] }] });
const courageFx = mkFx("e2", "Courage (ignore Daunted)", [], { ignores: [{ rule: "daunted", all: [], any: [], none: [] }] });
const pcNoCourage = { uuid: "Actor.a", effects: [dauntFx], itemTypes: { weapon: [] }, system: {} };
const pcWithCourage = { uuid: "Actor.a", effects: [dauntFx, courageFx], itemTypes: { weapon: [] }, system: {} };
console.log("Daunted banes without/with Courage:", EF.modifierList(pcNoCourage, new Set(["strike"])).length, "/", EF.modifierList(pcWithCourage, new Set(["strike"])).length);
console.log("stillThreatens reach 1 at dist 1/2/down:", MV.stillThreatens({ min: 1, max: 1 }, 1, false), MV.stillThreatens({ min: 1, max: 1 }, 2, false), MV.stillThreatens({ min: 1, max: 1 }, 1, true));
globalThis.canvas = { tokens: { placeables: [{ id: "t2", name: "Orc", actor: { uuid: "Actor.orc", effects: [{ id: "g1", disabled: false, origin: "Actor.durgan", statuses: new Set(["grabbed"]) }] } }] } };
const durgan = { uuid: "Actor.durgan", itemTypes: { weapon: [{ id: "w1", name: "Arming Sword", system: { wielded: true, hands: 1, traits: new Set(["melee"]) } }] } };
console.log("handsUsed with 1H sword + 1 Grabbed:", CF.handsUsed(durgan));
delete globalThis.canvas;

console.log("--- 8. Compendium & NPC cards check");
const doc = n => CN.allDocs.find(d => d.name === n);
const brace = doc("Brace"), courage = doc("Courage"), rallyFx = doc("Rally the Tribe (1 Support Boon)");
console.log("Brace zone:", brace?.system?.where, brace?.system?.zone?.ring, brace?.system?.zone?.inside?.diff?.who,
  "| Courage aura:", courage?.system?.settings?.[0]?.type, courage?.system?.settings?.[0]?.auraSize,
  "| Rally fx:", rallyFx?.system?.settings?.[0]?.bbName, JSON.stringify(rallyFx?.system?.expireOn));
const npcActs = CN.actors.filter(a => ["Goblin Sneak", "Orc Warrior", "Grave Wisp", "Ogre Chieftain"].includes(a.name))
  .flatMap(a => a.items.filter(i => i.type === "action" && !i.flags?.twod12?.basic).map(i => `${i.name}:${i.system.automation}`));
console.log("playtest NPC actions:", npcActs.join(", "));
const pcGold = ["Darting Blade", "Quick Shots", "Footwork", "Spotter", "Hold the Line", "Commandment", "Circling Shot", "Seizing Cut", "Thwart Cut"]
  .map(n => `${n}:${doc(n)?.system?.automation}`);
console.log("upgraded L1 PC cards:", pcGold.join(", "));
