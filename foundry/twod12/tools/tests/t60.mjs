// Run with: node tools/tests/run.mjs (or node tools/tests/t60.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => false } };
const T = (...t) => new Set(t);
const items = { "u:oa-act": { name: "Opportunity Attack", type: "action", system: { versions: [{ ap: 1 }], reaction: true } }, "u:rime": { name: "Rimebrand (Cold)", type: "action", system: { versions: [{ ap: 1 }] } } };
globalThis.fromUuid = async u => items[u] ?? null;
const AC = await import(ROOTURL + "module/actioncard.mjs");   // v0.0.439 (CARD-ONE step 7): buildInfoCard retired: the Feature card
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const oa = await AC.buildSoloCard({ type: "talent", name: "Opportunity Attack", system: { category: "Talent", level: 1, frequency: "", traits: T(), requirements: "", description: "<p>You punish those who move near you.</p>", actions: ["u:oa-act"], choiceOptions: [], modifiers: [{ spec: "category:Weapon Technique", when: "outOfTurn", critical: "You disrupt the triggering Action before it happens.", effects: "" }] } });
console.log("OA:", strip(oa)); console.log("   the Feature card (no card color):", !oa.includes("--card-color"), "| its title:", oa.includes('class="ap-title"'));
const lb = await AC.buildSoloCard({ type: "talent", name: "Lesser Blessing", system: { category: "Talent", level: 1, frequency: "", traits: T("divine", "magic"), requirements: "", description: "<p>Pick one blessing related to a god you follow.</p>", actions: [], choiceOptions: ["u:rime"], choiceLabel: "", choiceCount: 1, modifiers: [] } });
console.log("Lesser Blessing:", strip(lb));
const dc = await AC.buildSoloCard({ type: "talent", name: "Divine Connection", system: { category: "Paladin Feature", level: 1, description: "<p>Your bond with your god.</p>", actions: [], choiceOptions: [], talents: 2 } });
console.log("Divine Connection:", strip(dc));
