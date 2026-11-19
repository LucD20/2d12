// Run with: node tools/tests/run.mjs (or node tools/tests/t172.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).docs, cdoc = (n, t = "action") => CDOCS.find(d => d.name === n && d.type === t);   // v0.0.230 (pack CS): the cards are data (book/cards), read from the built content
import fs from "node:fs";
// v0.0.215 (Lucas's playtest 2 notes): fixes and Foundry improvements.
class Fl { constructor(o) { this.o = o; } }
let flag = null;
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, combat: { started: true, id: "c1", round: 1, turn: 0, turns: [] } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fl, NumberField: Fl, StringField: Fl, BooleanField: Fl, ArrayField: Fl, SetField: Fl, HTMLField: Fl } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, getRoute: p => "/" + p,
    // Foundry's setFlag merges objects into what is stored: the stand-in does the same (the cause of the At-will bug).
    mergeObject: (a, b) => { const out = JSON.parse(JSON.stringify(a ?? {})); const m = (x, y) => { for (const [k, v] of Object.entries(y)) { if (v && typeof v === "object" && !Array.isArray(v) && x[k] && typeof x[k] === "object" && !Array.isArray(x[k])) m(x[k], v); else x[k] = v; } }; m(out, b); return out; } } };
const U = await import(ROOTURL + "module/usage.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const actor = { type: "npc", isOwner: true, getFlag: () => flag, setFlag: async (s, k, v) => { flag = foundry.utils.mergeObject(flag ?? {}, v); } };
const act = (id, frequency, traits = []) => ({ id, type: "action", system: { frequency, traits: new Set(traits) }, getFlag: () => null });
const club = act("club", "atwill", ["strike", "weapon"]), wa = act("wa", "atwill", ["strike", "weapon"]), slam = act("slam", "encounter", ["area"]);

console.log("--- At-will: a first use each turn has no Bane (Club, then Weapon Attack)");
await U.markUsed(actor, club); await U.markUsed(actor, wa);
console.log("turn 1, after Club and Weapon Attack: Club", U.atWillUses(actor, club), "| Weapon Attack", U.atWillUses(actor, wa));
game.combat.turn = 1;
await U.markUsed(actor, club);
console.log("turn 2, Club used once: Club", U.atWillUses(actor, club), "| Weapon Attack (not used this turn)", U.atWillUses(actor, wa), "(was 1 before v0.0.215: last turn's count stayed in the merged flag)");
console.log("--- Encounter: greyed after its use");
await U.markUsed(actor, slam);
console.log("Ground Slam:", JSON.stringify(U.isFaded(actor, slam)));

console.log("--- the rest (source checks)");
const mv = src("module/move.mjs"), cw = src("module/classwindow.mjs"), pv = src("module/preview.mjs"), gr = src("module/grants.mjs"), cf = src("module/config.mjs"), tw = src("module/twod12.mjs"), loe = src("module/loe.mjs");
const rally = src("module/rally.mjs"), tpl = src("module/template.mjs"), acts = src("module/actions.mjs"), esc = src("module/escblock.mjs"), sheet = src("templates/actor-sheet-pc.hbs"), data = src("module/data.mjs"), content = src("tools/content.mjs");
console.log("Charge disrupted: measured from the end square:", mv.includes("chargeFollowUp(c, doc, reach, go.stopTl)"));
console.log("class window keeps its scroll:", cw.includes("focus({ preventScroll: true })") && cw.includes("content.scrollTop = own"));
console.log("an Action-only Talent shows its Action:", pv.includes("export const actionOnlyTalent") && !/tal\("Aim"[^\n]*You gain the Aim Action/.test(content), "| granted Actions in full (the Feature card):", src("module/actioncard.mjs").includes('class="ap-grant"'));
console.log("a choice picked in the class window:", cw.includes("_choiceBlock(") && gr.includes("grantChoices(actor, parent, copy, preset = null)"));
console.log("Armor Training on the Loadout:", sheet.includes('class="lo-train"'));
console.log("new tokens: bars always, no rotation:", tw.includes('"prototypeToken.displayBars": bars') && tw.includes('"prototypeToken.lockRotation": true'), "| core rotation off once:", tw.includes("tokenDefaultsV215"));
console.log("Rally line (v0.0.454: sysLine, the heart):", rally.includes('sysLine("fa-heart-pulse", healLinesHtml('));
console.log("shortcuts Shift+L and Shift+H:", tw.includes('"lineOfEffect", {') && tw.includes('"coverHeight", {') && loe.includes("export function loeShortcut") && loe.includes("export function heightShortcut"));
console.log("the diamond: no hover since v0.0.420 (Lucas: the hover cards removed); what is by hand stays on the item (automationNote):", !cf.includes("By hand: ${String(note).trim()}") && data.includes("automationNote: str()"), "| notes:", (content.match(/^  "[^"]+": "/gm) ?? []).length >= 10);
console.log("Rally the Tribe (v0.0.458: the Boon a button):", (await import(ROOTURL + "tools/content.mjs")).actors.find(a => a.name === "Ogre Chieftain").items.some(i => i.name === "Rally the Tribe" && i.system.versions[0].effects.includes("gain @Boon[1|bb:support|traits:weapon]{1 Support Boon} on their next [Weapon] Action.")));
console.log("an Emanation with no Distance is around you:", cf.includes('const onSelf = a.shape === "emanation" && !a.within && !c?.withinRange;'), "| asks about yourself:", tpl.includes("label: `Apply, ${escT(centerTok?.name ?? \"you\")} too`"));
console.log("remove a target in the roll dialog:", acts.includes('class="ttx" data-rm=') && acts.includes('removed: fd.getAll("removed")'));
console.log("Escalation Passive: description on click:", sheet.includes('data-action="toggleEscPass"') && esc.includes("desc:"));
// v0.0.409 (pack F2): the redesigned Word of Radiance and Consecrated Ground have one Version (a 2 Emanation); a Version's own size stays possible
console.log("Word of Radiance and Consecrated Ground: 2 Emanation, a Version's own size possible:", data.includes('areaSize: int(0, 0)') && ["Word of Radiance", "Consecrated Ground"].every(n => cdoc(n).system.areaCfg.size === 2 && cdoc(n).system.versions.length === 1), "| the version asked before placing:", acts.includes("which version? The Area depends on it."));
const D = await import(ROOTURL + "module/data.mjs").catch(() => null);
if (D?.ActionData) {
  const d = Object.assign(Object.create(D.ActionData.prototype), { areaCfg: { size: 2, shape: "emanation", within: 5 }, versions: [{ ap: 3, areaSize: 3 }, { ap: 2, areaSize: 0 }], traits: new Set() });
  d.prepareDerivedData(); console.log("its Area text:", d.area, "|", d.areaDistance);
}
