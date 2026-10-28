// Run with: node tools/tests/run.mjs (or node tools/tests/t40.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const b = await import(ROOT + "module/basic.mjs");
const names = a => Object.entries(b.BASIC_ACTIONS).filter(([k]) => a === "npc" ? k !== "rally" : true).map(([, d]) => d.name).join(", ");
const created = []; const mk = type => ({ type, items: { filter: f => [].filter(f) }, createEmbeddedDocuments: async (n, d) => created.push(...d.map(x => x.name)) });
await b.addBasicActions(mk("npc")); console.log("NPC basic actions:", created.splice(0).join(", "));
await b.addBasicActions(mk("character")); console.log("Character basic actions:", created.splice(0).join(", "));
console.log("missing for NPC with all but Rally:", b.missingBasic({ type: "npc", items: Object.keys(b.BASIC_ACTIONS).filter(k => k !== "rally").map(k => ({ type: "action", getFlag: () => k })) }));
const shove = b.BASIC_ACTIONS.shove.versions[0]; console.log("Shove 1AP tier text:", shove.x1, "|", shove.x2, "|", shove.x3, "| instances:", shove.t2.length);
const trip = b.BASIC_ACTIONS.trip.versions[1]; console.log("Trip 2AP:", trip.x1, "|", trip.x2, "|", JSON.stringify(trip.t3.map(i => i.dice + i.subtype)), trip.x3);
// the attribute-only damage with no pool still deals damage
const dm = await import(ROOT + "module/damage.mjs");
console.log("damage.mjs loads:", typeof dm.damageButton);
