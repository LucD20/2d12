// Run with: node tools/tests/run.mjs (or node tools/tests/t60.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => false } };
const T = (...t) => new Set(t);
const items = { "u:oa-act": { name: "Opportunity Attack", type: "action", system: { versions: [{ ap: 1 }], reaction: true } }, "u:rime": { name: "Rimebrand (Cold)", type: "action", system: { versions: [{ ap: 1 }] } } };
globalThis.fromUuid = async u => items[u] ?? null;
const pv = await import(ROOT + "module/preview.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const oa = await pv.buildInfoCard({ name: "Opportunity Attack", system: { category: "Talent", level: 1, frequency: "", traits: T(), requirements: "", description: "<p>You punish those who move near you.</p>", actions: ["u:oa-act"], choiceOptions: [], modifiers: [{ spec: "category:Weapon Technique", when: "outOfTurn", critical: "You disrupt the triggering Action before it happens.", effects: "" }] } });
console.log("OA:", strip(oa)); console.log("   plain title (no card color):", !oa.includes("--card-color"), "| divider:", oa.includes("cdiv"));
const lb = await pv.buildInfoCard({ name: "Lesser Blessing", system: { category: "Talent", level: 1, frequency: "", traits: T("divine", "magic"), requirements: "", description: "<p>Pick one blessing related to a god you follow.</p>", actions: [], choiceOptions: ["u:rime"], choiceLabel: "", choiceCount: 1, modifiers: [] } });
console.log("Lesser Blessing:", strip(lb));
const dc = await pv.buildInfoCard({ name: "Divine Connection", system: { category: "Paladin Feature", level: 1, description: "<p>Your bond with your god.</p>", actions: [], choiceOptions: [], talents: 2 } });
console.log("Divine Connection:", strip(dc));
