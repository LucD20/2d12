// Run with: node tools/tests/run.mjs (or node tools/tests/t301.mjs)
// v0.0.493 (Pass 2 playtest bug fixes): defeated tokens skipped by Reactions, Interrupt always ahead of Trigger in stack/overlay,
// Lay On Hands @Rally targets ally (not caster), Demoralize skips Cover Banes, EoT expiry hardened, strip hover cleanup,
// damage card = icon centering, Judge reduction short name in Encounter Log, Skip Defeated default ON, and dead squad members skipped in Minion picker.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id_1" }
};
globalThis.game = { system: { version: "0.0.493" }, user: { id: "gm", isGM: true, isActiveGM: true }, settings: { register() {}, get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");

// 1. moment.mjs + rxoverlay.mjs: Interrupts always before Triggers; defeated tokens skipped
const M = await import(ROOTURL + "module/moment.mjs");
const RX = await import(ROOTURL + "module/rxoverlay.mjs");
const mix = [
  { i: 0, state: "use", kind: "trigger", order: 2, itemName: "Rebuke" },
  { i: 1, state: "use", kind: "interrupt", order: 1, itemName: "Slip Away" }
];
console.log("Interrupt before Trigger in stackOrder:", M.stackOrder(mix).map(r => r.itemName).join(" -> "));
console.log("moveInStack refuses Trigger over Interrupt:", M.moveInStack(mix, 0, "up"), "| Interrupt below Trigger:", M.moveInStack(mix, 1, "down"));
console.log("setStackOrder refuses Trigger before Interrupt:", M.setStackOrder(mix, [0, 1]), "| allows Interrupt before Trigger:", M.setStackOrder(mix, [1, 0]));
console.log("rxoverlay pinNumbers keeps Interrupt #1:", JSON.stringify([...RX.pinNumbers({ rows: mix }).entries()]));
const mo = src("module/moment.mjs");
console.log("collectReactions skips defeated/down & sorts Interrupt first:",
  mo.includes("const downNow = isDown(actor) || tk.combatant?.isDefeated || tk.combatant?.defeated;") && mo.includes("if (downNow && !def.downOk) continue;")
  && mo.includes("rows.sort((x, y) => (kindRank(x) - kindRank(y)) || (x.dist - y.dist));"));

// 2. rally.mjs + damage.mjs: Lay On Hands @Rally targets card target / prompts
const R = await import(ROOTURL + "module/rally.mjs");
console.log("targetsOther:", R.targetsOther("One ally"), R.targetsOther("One creature"), R.targetsOther("Self"), R.targetsOther("You"), R.targetsOther(""));
console.log("rallyPrompt socket wired:", src("module/rally.mjs").includes('type: "rallyPrompt"') && src("module/damage.mjs").includes('data.type === "rallyPrompt"'));

// 3. actions.mjs: Demoralize skips Cover Banes while Strikes keep them
const A = await import(ROOTURL + "module/actions.mjs");
const dem = { flags: { twod12: { basic: "demoralize" } }, system: { targets: "One creature that can see or hear you" } };
const hearOther = { flags: {}, system: { targets: "One creature that can hear you" } };
const strike = { flags: {}, system: { targets: "One creature" } };
console.log("coverBanesApply:", A.coverBanesApply(dem, new Set(["appeal"])), A.coverBanesApply(hearOther, new Set(["appeal"])), A.coverBanesApply(strike, new Set(["strike", "ranged"])));

// 4. effects.mjs: EoT expires on creature's own non-frozen turn even if slotInit shifted; combatTurnChange has fallbacks
const FX = await import(ROOTURL + "module/effects.mjs");
const eotShifted = { duration: { type: "eot" }, slotInit: 14 };
console.log("EoT shifted slotInit (own non-frozen turn):", FX.durationStep(eotShifted, { id: "d", initiative: 11, shared: false, frozen: false }, { round: 2, turn: 7 }, { combatantId: "d" }),
  "| frozen swap stays:", FX.durationStep(eotShifted, { id: "d", initiative: 11, shared: false, frozen: true }, { round: 2, turn: 7 }, { combatantId: "d" }));
console.log("combatTurnChange fallbacks:", src("module/effects.mjs").includes("prior?.tokenId ? combat.combatants.find") && src("module/effects.mjs").includes("Number.isInteger(prior?.turn)"));

// 5. carousel.mjs: strip hover cleanup
const car = src("module/carousel.mjs");
console.log("carousel clears stripHovered:", car.includes("let stripHovered = null;") && car.includes("el.onmouseleave = () => { clearStripHover();") && car.includes("{ hoverOutOthers: true }"));

// 6. build-theme.mjs / theme.css: .cc-icon centered
const th = src("styles/theme.css");
console.log("cc-icon zero padding & icon margin:", th.includes(".cc-icon { padding: 0 !important; gap: 0 !important; min-width: 0; flex: 0 0 auto; }") && th.includes(".cc-icon i, .twod12-type .twod12.chat.cc .cc-dtag i { margin: 0 !important;"));

// 7. enclog.mjs: cleanEffectName applied to reducedNote
const EL = await import(ROOTURL + "module/enclog.mjs");
const dmgLine = EL.lineText({ k: "dmg", d: { target: { name: "Aveline" }, text: "5 Vigor", raw: 7, reducedBy: 2, reducedNote: "Judge (Durgan (Dwarf Paladin, Lay On Hands, level 1)) −2" } });
console.log("clean reducedNote:", dmgLine);

// 8. combat.mjs + twod12.mjs: aliveSquadRun filters dead minions & Skip Defeated defaults ON
globalThis.Combat = class {};
const CB = await import(ROOTURL + "module/combat.mjs");
const mk = (id, sq, dead = false) => ({ id, name: id, initiative: 10, defeated: dead, isDefeated: dead, flags: { twod12: { init: { squad: sq, side: "foe" } } }, actor: { system: { atZero: dead } } });
const turns = [mk("g1", "g1", true), mk("g2", "g1", false), mk("g3", "g1", false)];
console.log("aliveSquadRun skips dead g1:", CB.aliveSquadRun(turns, 0).map(c => c.id).join(","));
const oneAlive = [mk("g1", "g1", true), mk("g2", "g1", false)];
console.log("aliveSquadRun with 1 alive:", CB.aliveSquadRun(oneAlive, 0).map(c => c.id).join(","));
console.log("skipDefeated default wired:", src("module/twod12.mjs").includes("skipDefeatedDefaulted") && src("module/twod12.mjs").includes("skipDefeated: true"));
