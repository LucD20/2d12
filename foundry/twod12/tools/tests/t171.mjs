// Run with: node tools/tests/run.mjs (or node tools/tests/t171.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.214 (Lucas, playtest 2): NPCs have no Weapon Attack (nor the Fists Action): their Basic attack is their weapon attack.
class Fl { constructor(o) { this.o = o; } }
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fl, NumberField: Fl, StringField: Fl, BooleanField: Fl, ArrayField: Fl, SetField: Fl, HTMLField: Fl } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, getRoute: p => "/" + p } };
const b = await import(ROOTURL + "module/basic.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const mk = (type, keys) => {
  const items = keys.map((k, n) => ({ id: `i${n}`, type: "action", name: b.BASIC_ACTIONS[k].name, getFlag: (s, f) => (f === "basic" ? k : null) }));
  const log = { deleted: [], created: [] };
  return { type, items, itemTypes: { weapon: [{ getFlag: () => true, system: { traits: ["barehanded", "melee", "nonthreatening"], range: "1" } }] }, log,
    async deleteEmbeddedDocuments(t, ids) { log.deleted.push(...ids.map(id => items.find(i => i.id === id).name)); ids.forEach(id => items.splice(items.findIndex(i => i.id === id), 1)); },
    async createEmbeddedDocuments(t, data) { log.created.push(...data.map(d => d.name)); } };
};
console.log("an NPC doesn't get:", b.NPC_NO_BASIC.map(k => b.BASIC_ACTIONS[k].name).join(", "), "| a character gets all:", Object.keys(b.BASIC_ACTIONS).every(k => b.wanted({ type: "character" }, k)));
const old = mk("npc", Object.keys(b.BASIC_ACTIONS).filter(k => k !== "rally"));
console.log("an NPC made before v0.0.214 has Weapon Attack:", b.unwantedBasics(old).map(i => i.name).join(", "), "| missing anything:", b.missingBasic(old));
await b.addBasicActions(old);
console.log("adding the Basic Actions removes them:", old.log.deleted.join(", "), "| creates:", old.log.created.join(", ") || "nothing", "| left over:", b.unwantedBasics(old).length);
const pc = mk("character", Object.keys(b.BASIC_ACTIONS));
await b.addBasicActions(pc);
console.log("a character keeps them:", pc.log.deleted.length === 0, "| it still has Weapon Attack:", pc.items.some(i => i.name === "Weapon Attack"));
const bas = src("module/basic.mjs"), fu = src("module/freeuse.mjs"), content = src("tools/content.mjs");
console.log("the GM's first load updates such NPCs:", bas.includes("oldRelocate || unwantedBasics(actor).length > 0"), "| the NPC compendium:", content.includes("filter(k => wanted({ type: \"npc\" }, k))"));
console.log("a Charge (or a grant) that uses Weapon Attack uses an NPC's Basic attack:", fu.includes('list = actionsFor(actor, "category:Basic attack")'));
// The built NPC compendium (packs/_source, built by tools/build-packs.mjs).
const dir = ROOT + "packs/_source/npcs";
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    const a = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8")), acts = (a.items ?? []).filter(i => i.type === "action");
    console.log(`${a.name}: Weapon Attack ${acts.some(i => i.name === "Weapon Attack")}, Fists Action ${acts.some(i => i.name === "Fists")}, Fists weapon ${(a.items ?? []).some(i => i.type === "weapon" && i.name === "Fists")}, Basic attacks: ${acts.filter(i => i.system.category === "Basic attack").map(i => i.name).join(", ")}`);
  }
} else console.log("packs/_source/npcs not built");
