// Run with: node tools/tests/run.mjs t297 (or node tools/tests/t297.mjs)
// v0.0.485: chat footer alignment & full-width breakdown, Roll Dialog cover buff/debuff notices,
// inline card buttons, endWhenUnthreatened on moveToken, Brace caster square, Grabbed cascade guard,
// Setup plain-text rendering after completion, and RollWindow state preservation across setupLater.
import { fileURLToPath as rootPath } from "node:url";
import fs from "node:fs";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Hooks = { on() {}, once() {} };
globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Combat = class {};
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: class {}, ItemSheetV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)) }
};
globalThis.game = { settings: { get: () => true }, user: { isGM: true, isActiveGM: true, id: "gm" } };

const CC = await import(ROOTURL + "module/chatcards.mjs");
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const SU = await import(ROOTURL + "module/setup.mjs");
const C = await import(ROOTURL + "tools/content.mjs");

console.log("--- 1. Single-target damage footer: Card button inside .cc-trow before .cc-adjrow");
const dmg = {
  name: "Basic Attack", nl: false,
  groups: [{ tier: 2, crit: false, comps: [{ pool: "B", sub: "Sl", formula: "1d8+3", total: 9, dice: [{ f: 8, v: 6 }] }], rows: [0] }],
  rows: [{ uuid: "Actor.a", name: "Orc Warrior", tier: 2, mods: [], applied: { took: { B: 9, M: 0 }, state: "bloodied", factor: 1, mods: [] } }]
};
const din = CC.damageInHtml(dmg), foot = CC.dmgFootHtml(din);
const idxUndo = foot.indexOf('data-twod12="ccUndo"'), idxCard = foot.indexOf('data-twod12="ccCard"'), idxAdj = foot.indexOf('class="cc-adjrow ondemand"');
console.log("hasCard:", din.hasCard, "| Undo < Card < adjrow:", idxUndo > 0 && idxUndo < idxCard && idxCard < idxAdj, "| single Card button:", (foot.match(/data-twod12="ccCard"/g) ?? []).length);

console.log("--- 2. Roll Dialog notices: active/na and boon/bane classes");
const inp = {
  name: "Club", freq: "atwill", versions: [{ ap: 1, cost: "1 AP", traits: [], meta: {}, tiers: { 1: { parts: [] }, 2: { parts: [] }, 3: { parts: [] } }, noTiers: false }],
  roll: { mod: 2, name: "Body" }, creatures: [{ uuid: "Actor.s", name: "Sylwen", def: "AD", dc: 14 }], chips: [],
  notices: [
    { text: "Keep Low (Sylwen): Low cover \u2192 Medium cover", active: true, tone: "bane", why: "raises cover" },
    { text: "Keep Low (Sylwen): no Cover to raise", active: false, tone: "bane", why: "no cover" },
    { text: "Find the Gap: Low cover \u2192 No cover (Orc)", active: true, tone: "boon", why: "lowers cover" }
  ]
};
const dhtml = RD.dialogHtml(inp, RD.newState(inp));
console.log("active bane:", dhtml.includes('class="rd-note active bane"'), "| na bane:", dhtml.includes('class="rd-note na bane"'), "| active boon:", dhtml.includes('class="rd-note active boon"'));
const actSrc = fs.readFileSync(ROOT + "module/actions.mjs", "utf8");
const riSrc = fs.readFileSync(ROOT + "module/rollinput.mjs", "utf8");
console.log("pushCoverChanges wired:", actSrc.includes("no Cover to raise") && actSrc.includes("no Cover to lower"), "| rollinput preserves active & tone:", riSrc.includes("active: !!n.active, tone: n.tone"));

console.log("--- 3. Inline buttons in Footwork (Hands Busy) and Basic Actions");
const fw = C.docs.find(d => d.type === "action" && d.name === "Footwork");
const hb = fw?.system?.versions?.find(v => v.mode === "Hands Busy")?.effects ?? "";
console.log("Hands Busy inline:", hb.includes("use the @Use[Interact|ap:0|label:Interact] or @Use[Reload|ap:0|label:Reload] Action"), "| no (free) tail:", !hb.includes("(free)"));

console.log("--- 4. Setup plain text after Setup movement finishes");
console.log("Circling Shot:", JSON.stringify(SU.setupFor("You @Move[evade|distance:1].", true)));
console.log("Strafe:", JSON.stringify(SU.setupFor("You @Move[advance|distance:speed]{Advance}.", true)));
console.log("Ricochet:", JSON.stringify(SU.setupFor("You must @Move[advance|distance:2|must:yes|still:yes]{Advance 2}.", true)));
console.log("Labeled:", JSON.stringify(SU.setupFor("You @Move[evade|distance:1|label:Evade 1].", true)));

console.log("--- 5. RollWindow state preserved for setupLater (forceTier), moveToken unthreatened, Grabbed cascade, Brace full 1 Emanation");
const rwSrc = fs.readFileSync(ROOT + "module/rollwindow.mjs", "utf8");
const mvSrc = fs.readFileSync(ROOT + "module/move.mjs", "utf8");
const fxSrc = fs.readFileSync(ROOT + "module/effects.mjs", "utf8");
const cdSrc = fs.readFileSync(ROOT + "module/conditions.mjs", "utf8");
const brace = C.docs.find(d => d.type === "effect" && d.name === "Brace");
console.log("rollwindow returns state:", rwSrc.includes("{ ...RD.result(this.inp, this.st), state: this.st }"));
console.log("moveToken unthreatened hook:", mvSrc.includes('Hooks.on("moveToken"') && mvSrc.includes("movement?.destination") && mvSrc.includes("checkUnthreatenedEffects(ov)"));
console.log("Grabbed cascade guard:", fxSrc.includes("twod12Cascade: true") && cdSrc.includes("options?.twod12Cascade"));
console.log("Brace includes caster square (no ring):", !brace?.system?.zone?.ring);
