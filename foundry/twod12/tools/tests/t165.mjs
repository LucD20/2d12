// Run with: node tools/tests/run.mjs (or node tools/tests/t165.mjs)
// v0.0.207: the "Chat message" setting (a message at a moment, to the owners or everyone, with a button for an Action). Marked Quarry's two
// reminders are two such settings now (mark.mjs posts them, nothing tests the card). Also an item made from scratch with it.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
const hooks = {};
globalThis.Hooks = { on(n, fn) { (hooks[n] ??= []).push(fn); }, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t.replace(/@Use\[([^\]]+)\]/g, (m, x) => `<a data-twod12-inline="Use">${x}</a>`) } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const posted = [];
const users = [{ id: "gm", isGM: true }, { id: "p1" }, { id: "p2" }];
globalThis.game = { settings: { get: () => true }, user: { id: "gm", isGM: true, isActiveGM: true }, users, combat: null, items: [], packs: new Map(), actors: { contents: [] } };
globalThis.ChatMessage = { create: async d => { posted.push(d); return d; }, getSpeaker: ({ actor }) => ({ alias: actor?.name }) };
globalThis.canvas = { ready: false, scene: { tokens: [] }, tokens: { placeables: [] } };
const { docs } = await import(ROOTURL + "tools/content.mjs");
globalThis.game = { settings: { get: () => true }, user: { id: "gm", isGM: true, isActiveGM: true }, users, combat: null, items: [], packs: new Map(), actors: { contents: [] } };   // (content.mjs puts its own stand-ins)
globalThis.Hooks = { on(n, fn) { (hooks[n] ??= []).push(fn); }, once() {} };
globalThis.foundry.applications.ux.TextEditor.implementation.enrichHTML = async t => t.replace(/@Use\[([^\]]+)\]/g, (m, x) => `<a data-twod12-inline="Use">${x}</a>`);   // stands for Foundry's enricher
const AU = await import(ROOTURL + "module/automation.mjs"), AP = await import(ROOTURL + "module/appliedflags.mjs"), FD = await import(ROOTURL + "module/fxdetails.mjs");
const MK = await import(ROOTURL + "module/mark.mjs");
const F = "twod12";
const full = x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], attrs: [], minEscalation: 0, ...x });
let nid = 0;
/** A creature with Features made of these settings; owner: the player id that owns it. */
function creature(name, features = [], { owner = "p1", escalation = 0 } = {}) {
  const flags = {};
  const items = features.map(([n, st]) => ({ id: `it${++nid}`, name: n, type: "feature", system: { settings: st.map(full), description: "" }, getFlag: () => undefined }));
  return {
    name, type: "character", uuid: `Actor.${name}`, isOwner: true, items, effects: [], itemTypes: { feature: items, talent: [], action: [] }, system: { escalation },
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, unsetFlag: async (s, k) => { delete flags[k]; },
    testUserPermission: u => u.isGM || u.id === owner, getActiveTokens: () => [{ document: { uuid: `Scene.s.Token.${name}` } }], flags
  };
}
const mq = docs.find(d => d.name === "Mark Quarry" && d.type === "action").system.settings;   // v0.0.360: on the Action

console.log("--- the setting becomes flags");
const fl = AP.appliedFlags({ settings: mq.map(full), description: "", expireOn: new Set(), expireAll: false }, null);
console.log(JSON.stringify(fl.messages));
console.log("an empty one (no text, no Action) is ignored:", AP.appliedFlags({ settings: [full({ type: "message", text: "", msgAction: "" })], description: "", expireOn: new Set(), expireAll: false }, null).messages.length);

console.log("--- Marked Quarry: the start of an encounter (the old reminder, now from its settings)");
const lana = creature("Lana", [["Marked Quarry", mq]]), orc = creature("Orc", [], { owner: "none" });
await lana.setFlag(F, "quarry", { uuid: "Scene.s.Token.Goblin", name: "Goblin" });
game.actors.contents = [lana, orc];
MK.registerMarkHooks();
await hooks.combatStart.at(-1)({ combatants: [{ actor: lana }, { actor: orc }] });
console.log("the old mark ended:", lana.getFlag(F, "quarry") === undefined, "| messages:", posted.length);
for (const p of posted) console.log(`  whisper ${JSON.stringify(p.whisper)} | speaker ${p.speaker?.alias ?? "-"} | flags ${JSON.stringify(p.flags)}\n  ${p.content}`);

console.log("--- the marked creature goes Down");
posted.length = 0;
const gob = { documentName: "Actor", isToken: false, getActiveTokens: () => [{ document: { uuid: "Scene.s.Token.Goblin" } }] };
await lana.setFlag(F, "quarry", { uuid: "Scene.s.Token.Goblin", name: "Goblin" });
const down = hooks.createActiveEffect.at(-1);
await down({ statuses: new Set(["prone"]), parent: gob });
console.log("Prone is not Down: nothing:", posted.length, "| still marked:", !!lana.getFlag(F, "quarry"));
await down({ statuses: new Set(["unconscious"]), parent: gob });
console.log("Unconscious: the mark ended:", lana.getFlag(F, "quarry") === undefined, "| messages:", posted.length);
for (const p of posted) console.log(`  whisper ${JSON.stringify(p.whisper)} | ${p.content}`);

console.log("--- an item made from scratch: a turn-start message to everyone, Escalation 2+, no Action");
posted.length = 0;
const own = creature("Kai", [["War Cry", [{ type: "message", msgWhen: "turn", msgTo: "all", text: "{name} roars. Allies near {name} take heart.", minEscalation: 2 }]]], { escalation: 1 });
console.log("Escalation 1:", await AU.postMessages(own, "turn"), "| Escalation 2:", (own.system.escalation = 2, await AU.postMessages(own, "turn")), "| at the start of an encounter:", await AU.postMessages(own, "encounter"));
console.log(`  whisper ${JSON.stringify(posted[0]?.whisper)} | ${posted[0]?.content}`);
console.log("HTML in the text is escaped:", AU.messageHtml({ name: "Kai" }, { text: "<script>x</script>", action: "", ap: 0 }));
console.log("an Action name with brackets can't break the button:", AU.messageHtml({ name: "Kai" }, { text: "go", action: "Strike]|ap:9", ap: 1, source: "Test" }));
const cb = (await import("node:fs")).readFileSync(ROOT + "module/combat.mjs", "utf8");
console.log("turn start wired (after the Effect each turn, not on a thaw):", cb.indexOf('await postMessages(c.actor, "turn")') > cb.indexOf("await applyTurnStartEffects(c.actor);") && cb.indexOf('await postMessages(c.actor, "turn")') > cb.indexOf("} else {"));

console.log("--- the editor's sentences");
const S = x => FD.settingSentence(full(x)), Sh = x => FD.settingShort(full(x));
for (const x of mq.filter(x => x.type === "message")) console.log(S(x), "|", Sh(x));
console.log(S({ type: "message", msgWhen: "turn", msgTo: "all", text: "roars", msgAction: "" }), "|", Sh({ type: "message", msgWhen: "turn", msgAction: "" }));
