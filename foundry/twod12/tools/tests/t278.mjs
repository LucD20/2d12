// Run with: node tools/tests/run.mjs (or node tools/tests/t278.mjs)
// v0.0.440 (Lucas, 2026-11-18, his checklist report on v0.0.436): the fixes and suggestions.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };
const A = src("module/actions.mjs"), CSS = src("styles/system.css"), THEME = src("styles/theme.css");

console.log("--- the automations");
console.log("a Setup runs when the dialog's Roll is pressed, then the Action again from the new square:", A.includes("if (setupLater && (!rdData.restart || rdData.rollAfter)) {") && A.includes("setupRan: true, setupDone: true, stanceRan: st.stance, noHandle: true"));
console.log("Reckoning: the on-use chain after the Save card:", A.indexOf("// A Save Action: a Save card for the creatures in the area") < A.indexOf("if ((it.moment && version.noTiers || saveNoDamage) && String(version.after"));
const I = await import(ROOTURL + "module/inline.mjs");
console.log("Seizing Cut's Tier 3, its movement then its condition:", JSON.stringify(I.tierMoveThen("@Move[slid|distance:1], then @Condition[grabbed]{Grabbed}.")), "| a self movement isn't one:", I.tierMoveThen("You @Move[evade|distance:1]."));
console.log("a click on a condition applies it (its rule on a right-click):", src("module/twod12.mjs").includes('const NAMES_ITEM = new Set(["Effect", "Use"]);'));
const H = await import(ROOTURL + "module/hud.mjs");
console.log("the HUD's Basic tab in the fixed order:", H.basicOrder([{ bkey: "stand", name: "Stand" }, { bkey: "fists", name: "Fists" }, { bkey: "advance", name: "Advance" }]).map(x => x.name).join(", "));
const Cn = await import(ROOTURL + "tools/content.mjs");
const avenge = [...Cn.actors.flatMap(a => a.items ?? []), ...Cn.OLD_CLASS_DOCS].find(x => x.name === "Avenge Kin");   // the Bestiary's rebuild (2026-11-25): kept in OLD_CLASS_DOCS
console.log("Avenge Kin aims at the attacker:", avenge?.system?.momentTarget);
const { halveComps } = await import(ROOTURL + "module/conditions.mjs");
console.log("Shake Off's half rounds up (book, Rounding): 1 →", halveComps([{ total: 1 }])[0].total, "| 7 →", halveComps([{ total: 7 }])[0].total, "| 3 + 2 →", halveComps([{ total: 3 }, { total: 2 }]).map(c => c.total).join(" + "));

console.log("--- the roll dialog and the chat");
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const pin = [{ id: "syn:reload", row: "boons", kind: "fav", special: "reload", pinned: true, label: "Reload shot", start: "off" }, { id: "x", row: "boons", kind: "boon", label: "Other", start: "off" }];
const f = RD.foldRow(pin, {}, "shared", "boons");
console.log("a pinned choice shows while off (the Reload shot, Smite's Reaction AP):", f.shown.map(c => c.label).join(", "), "| folded:", f.off.map(c => c.label).join(", "));
console.log("Smite's Reaction AP die joins the Tiers when on:", RD.tierTags({ chips: [{ id: "syn:smite", scope: "shared", row: "damage", special: "smite", tag: "+1d6! Ho", pool: "M", tiers: [1, 2, 3], start: "off" }] }, { toggled: { "syn:smite": true } }, 2).length);
console.log("the dialog's dice under the dice rule (Smite by Escalation):", A.includes("t: ruleCtx && version.diceRule && !i.source ? ruledDice(i.dice, version.diceRule, ruleCtx) : i.dice"));
const CC = await import(ROOTURL + "module/chatcards.mjs");
const inst = CC.instancesOf([{ pool: "B", sub: "Sl", kind: "W", total: 5, dice: [{ results: [5] }], weapon: "Hunting Bow" }, { pool: "B", sub: "Sl", kind: "E", total: 4, dice: [{ results: [4] }], label: "Empowered", emp: 4 }]);
console.log("the Empowered die is a named part, no '−4 Flat':", inst[1].src, JSON.stringify(inst[1].mods));
const { withMoreW } = await import(ROOTURL + "module/actions.mjs");
console.log("One More Arrow's [W] a part of its own:", JSON.stringify(withMoreW([{ pool: "B", useW: true, wCount: 1 }], 1, "One More Arrow").map(i => [i.wCount, i.source ?? ""])));
console.log("a Requirement only warns:", A.includes("if (H0.needsStayed(item.system?.requirements)) { const H = H0; if ((await H.leftThisTurn(actor)) === true && warnOnly("), "| Immobilized still stops a move:", A.includes("&& refuse(`${actor.name} is Immobilized and can't move"));
const r = { tier: 2, total: 15, dc: 13, dice: [7, 8], mod: 0, boons: 0, banes: 0 };
const save = applied => CC.saveCardHtml({ name: "Word of Radiance", saveName: "Appeal Save", dc: 13, creatures: [{ uuid: "a", name: "Orc", result: r, hasDamage: true, damageDone: applied }], tiers: { 1: { parts: [] }, 2: { parts: [] }, 3: { parts: [] } },
  dmg: { kind: "dmg", groups: [{ tier: 2, comps: [{ pool: "M", total: 5, dice: [] }], rows: [0] }], rows: [{ uuid: "a", name: "Orc", g: 0, applied: applied ? { took: { B: 0, M: 5 }, mods: [] } : null }] } });
console.log("the Save card folds once its damage is applied:", !save(false).includes("cc-fold"), save(true).includes('<details class="cc-fold">'));

console.log("--- the looks");
console.log("a pill keeps one line:", CSS.includes(".twod12.sheet.pcs .ps-pill { width: auto; min-width: 64px;"), "| the header wraps:", CSS.includes(".twod12.sheet.pcs .ps-head { flex-wrap: wrap;"));
console.log("trait chips are plain words everywhere:", THEME.includes(".twod12-type.twod12-type .twod12 .tg .tgc .tchip, .twod12-type.twod12-type .twod12 .tprops .tchip.prop { background: none !important;"));
console.log("the dark Resolve blue lighter (v0.0.447: lighter again, less saturated):", THEME.includes("--s-res: #aec4f0"), "| the HUD's 10 defense cells:", CSS.includes(".twod12-hud .hb-defs { display: grid; grid-template-columns: repeat(5, 1fr) 6px repeat(4, 1fr);"), "| a full AP pip gold in dark:", THEME.includes(".twod12-type.twod12-type .twod12-hud .hm-ap i.on"));

console.log("--- Minion squads (book: as even as possible; the GM picks the groups and who goes next)");
const R = await import(ROOTURL + "module/roundrules.mjs");
const mk = (n, g = {}) => Array.from({ length: n }, (_, i) => ({ id: `m${i}`, kind: "G", group: g[i] }));
console.log("sizes for 1 to 7:", [1, 2, 3, 4, 5, 6, 7].map(n => Object.values(R.minionSquads(mk(n))).map(x => x.length).join("+")).join(" | "));
console.log("the GM's groups kept (m0, m1 in squad 2):", JSON.stringify(R.minionSquads(mk(4, { 0: 2, 1: 2 }))));
const C = await import(ROOTURL + "module/combat.mjs");
const cm = (name, init, disp, squad, ord) => ({ id: name, name, initiative: init, token: { disposition: disp }, flags: { twod12: { init: { squad: squad ?? "", ...(ord != null ? { sqOrder: ord } : {}) } } } });
const t = C.zipper([cm("M1", 15, -1, "", 2), cm("M2", 15, -1, "M1", 0), cm("M3", 15, -1, "M1", 1), cm("P1", 14, 1)]);
console.log("a squad in the GM's order:", t.map(c => c.name).join(" "), "| still to act after M2:", C.squadRun(t, 1).map(c => c.id).join(", "), "| M1 picked next:", C.squadOrderAfter(t, 1, "M1").join(", "));
console.log("the book:", fs.readFileSync(ROOT + "../../book/rules-src/14-bestiary.md", "utf8").includes("**The recommendation:** one squad for every 2 Minions, rounded up"));
