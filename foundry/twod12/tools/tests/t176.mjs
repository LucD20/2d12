// Run with: node tools/tests/run.mjs (or node tools/tests/t176.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
// v0.0.224 (Lucas's playtest 3 answers and fixes).
class Fl { constructor(o) { this.o = o; } }
const merge = (a, b) => { const out = JSON.parse(JSON.stringify(a ?? {})); const m = (x, y) => { for (const [k, v] of Object.entries(y)) { if (v && typeof v === "object" && !Array.isArray(v) && x[k] && typeof x[k] === "object" && !Array.isArray(x[k])) m(x[k], v); else x[k] = v; } }; m(out, b); return out; };
const doc = () => { let f = null; return { isOwner: true, getFlag: () => f, setFlag: async (s, k, v) => { f = merge(f ?? {}, { [k]: v })[k]; } }; };
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.Combat = class {};
const actor = { type: "npc", id: "oc", ...doc() };
globalThis.game = { settings: { get: () => true }, combat: { started: true, id: "c1", round: 1, turn: 0, turns: [], combatants: [] } };
globalThis.foundry = { abstract: { TypeDataModel: class {} }, data: { fields: { SchemaField: Fl, NumberField: Fl, StringField: Fl, BooleanField: Fl, ArrayField: Fl, SetField: Fl, HTMLField: Fl } }, applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: merge } };
const U = await import(ROOTURL + "module/usage.mjs"), M = await import(ROOTURL + "module/move.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const club = { id: "club", type: "action", system: { frequency: "atwill", traits: new Set(["strike", "weapon"]) }, getFlag: () => null };
await U.markAtWill(actor, club);
console.log("a Charge's Weapon Attack (Club, the Basic attack) counts toward At-will: the next Club has", U.atWillUses(actor, club), "Bane | Strikes made:", U.strikesUsed(actor));
for (let n = 0; n < 3; n++) await U.markUsed(actor, club);
console.log("after 3 Strikes: not greyed, its own marker:", JSON.stringify(U.isFaded(actor, club)), "| strikes:", U.strikesUsed(actor));
// The movement area: an Advance pays 1 more to enter Darkness / Difficult Terrain; an Evade can't enter it.
const dark = c => c.i === 0 && c.j === 2;
const area = (cost) => M.reachableCells([{ i: 0, j: 0 }], 3, () => false, 0, cost).filter(c => c.i === 0).map(c => c.j).sort((a, b) => a - b).join(",");
console.log("a row with Darkness on column 2, 3 squares: Advance reaches", area(c => (dark(c) ? 1 : 0)), "| Evade reaches", area(c => (dark(c) ? Infinity : 0)), "| nothing in the way", area(() => 0));
const mv = src("module/move.mjs"), mk = src("module/mark.mjs"), sh = src("module/actor-sheets.mjs"), st = src("module/setup.mjs"), car = src("module/carousel.mjs"), el = src("module/enclog.mjs"), tpl = src("templates/actor-sheet-pc.hbs"), co = src("tools/content.mjs"), act = src("module/actions.mjs");
console.log("Charge: a Strike that targets", JSON.stringify(BD.charge.traits) === '["move","strike"]' && BD.charge.targets === "One creature", "| its Weapon Attack counts toward At-will", BD.charge.versions[0].effects.includes("|atwill:yes|"), "| the picker goes toward the target", mv.includes("const computeTarget = () =>"), "| no End movement line", !mv.includes("ends the movement. ${left}"));
console.log("Relocate At-will", BD.relocate.frequency === "atwill", "| Break Free (1 AP, Move, only while Immobilized)", "breakFree" in BD && act.includes('basicKey === "breakFree" && !actor.statuses?.has?.("immobilized")') && co.includes("by spending 1 AP [Move]"));
console.log("the mark ends with the combat", mk.includes('Hooks.on("deleteCombat"'), "| shows the marker's portrait", mk.includes("PIXI.Sprite.from(src)"));
console.log("Remove on every Action's right-click", sh.includes("Remove for every Action, with a confirmation"), "| the Setup in the bottom bar", st.includes("export async function setupBar(o)"), "| Strike pips (v0.0.390: the HUD's marks, Strikes as slashes)", car.includes("marksHtml({ ap, max: Math.max(apMax(c), 1), slowed, rap, rapMax, strikes:"), "| the log window by its id", el.includes('instances?.get?.("twod12-encounter-log")'));
console.log("row markers: too few AP", tpl.includes("{{#if noAp}} noap{{/if}}"), "| 3 Strikes", tpl.includes("ar-capd"));
console.log("v0.0.225: a card's Evade / Advance is a bottom bar (End movement, Advance instead), no chat buttons:", mv.includes("function freeMoveBar(c, kind, text)") && !mv.includes('data-twod12="evadeAdvance" data-combatant="${c.id}"><i class="fa-solid fa-person-running"></i> Advance instead</button>`'),
  "| the Setup bar minimizes the windows:", st.includes("stepAside()"), "| a fourth Strike asks first:", act.includes('pickConfirm({ title: "3 Strikes made"'));
console.log("v0.0.226: an Evade or a Charge always moves the creature that used the Action:", mv.includes('if (["evade", "charge"].includes(cfg.kind)) return ctx?.token ?? tokenOf(contextActor(ctx))'), "| Evade instead after Advance instead:", mv.includes("export async function advanceAsEvade(combatantId, max = 0)") && mv.includes("Evade instead"));
