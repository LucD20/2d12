// Run with: node tools/tests/run.mjs (or node tools/tests/t173.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.216 (Lucas's test of v0.0.214 and v0.0.215).
class Fl { constructor(o) { this.o = o; } }
const merge = (a, b) => { const out = JSON.parse(JSON.stringify(a ?? {})); const m = (x, y) => { for (const [k, v] of Object.entries(y)) { if (v && typeof v === "object" && !Array.isArray(v) && x[k] && typeof x[k] === "object" && !Array.isArray(x[k])) m(x[k], v); else x[k] = v; } }; m(out, b); return out; };
const doc = () => { let f = null; return { isOwner: true, getFlag: () => f, setFlag: async (s, k, v) => { f = merge(f ?? {}, v); }, wipe() { f = null; } }; };
const actor = { type: "npc", ...doc() }, cmb = { tokenId: "tk", actorId: "a1", ...doc() };
actor.isToken = true; actor.token = { id: "tk" }; cmb.actor = actor;
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, combat: { started: true, id: "c1", round: 2, turn: 0, turns: [], combatants: [cmb] } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fl, NumberField: Fl, StringField: Fl, BooleanField: Fl, ArrayField: Fl, SetField: Fl, HTMLField: Fl } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: merge } };
const U = await import(ROOTURL + "module/usage.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const slam = { id: "slam", type: "action", system: { frequency: "encounter", traits: new Set() }, getFlag: () => null };
await U.markUsed(actor, slam);
console.log("Encounter use kept on the combatant too:", JSON.stringify(cmb.getFlag("twod12", "usedHere")));
actor.wipe();
console.log("the creature's own record lost (what Lucas saw after a reload): still greyed:", JSON.stringify(U.isFaded(actor, slam)));
const acts = src("module/actions.mjs"), tpl = src("module/template.mjs"), cw = src("module/classwindow.mjs"), fu = src("module/freeuse.mjs"), data = src("module/data.mjs"), sheet = src("templates/item-sheet.hbs"), content = src("tools/content.mjs"), css = src("styles/system.css");
console.log("roll dialog: a removed tile is display:none, with an undo chip:", acts.includes('tile.style.display = "none"') && acts.includes('chip.className = "trm-chip"'));
console.log("a damaging Action doesn't tick Affect yourself:", acts.includes("self: areaSet.self && !damaging"));
console.log("class window: the Talent filter before the scroll comes back:", /replaceChildren\(result\);\n\s+this\._applyFilter\(\);/.test(cw));
console.log("the Line's bar: the banner look, Left and Right buttons:", tpl.includes('data-side="left">Left</button><button type="button" data-side="right">Right</button>') && css.includes(".twod12-linebar {"));
console.log("NPC's Basic attack box:", data.includes("basicAttack: bool()") && sheet.includes('name="system.basicAttack"') && fu.includes("i.system?.basicAttack") && content.includes("basicAttack: !extra.category"));
const dir = ROOT + "packs/_source/npcs";
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) { const a = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8")); console.log(`  ${a.name}: Basic attack box on ${(a.items ?? []).filter(i => i.system?.basicAttack).map(i => i.name).join(", ")}`); }
console.log("v0.0.217: remove a target by right-click or the x (one capturing listener on the dialog):", acts.includes('root.addEventListener("contextmenu"') && acts.includes("const removeTile = tile =>"));
const mv2 = src("module/move.mjs");
console.log("v0.0.219: the Charge picker outlines its limit:", mv2.includes("outlineCells(gfx, limit, { color: 0xf1c84b"), "| no chat line when it opens:", !mv2.includes("Charges: in a straight line"), "| giving up refunds the AP and the use:", mv2.includes('setAP(c, getAP(c) + back, "Charge given up"') && src("module/usage.mjs").includes("export async function unmarkUsed") && acts.includes("apPaid: apCost"), "| a fixed-size bar:", css.includes(".twod12-linebar.twod12-chargebar { width: min(780px"));
const charge = { id: "chg", type: "action", system: { frequency: "round", traits: new Set(["move", "self"]) }, getFlag: () => null };
await U.markUsed(actor, charge);
const before = U.isFaded(actor, charge).faded;
await U.unmarkUsed(actor, charge);
console.log("a Charge given up is usable again this round:", before, "->", U.isFaded(actor, charge).faded);
console.log("v0.0.220: the Charge's messages are system cards:", mv2.includes('const postCard = (title, lead, text = "", cls = "") => ChatMessage.create({ content: sysCard(') && !mv2.includes("post(`<b>${esc(c.name)}</b> gives up the Charge"));
