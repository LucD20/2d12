// Run with: node tools/tests/run.mjs (or node tools/tests/t197.mjs)
// v0.0.258 (Lucas, after v0.0.257): the target line colored by side (allies green, enemies red, mixed plain) with thin rules on both sides and
// squared edges; the effect panel puts a condition another effect brought right under it, with a chain between the two icons.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const cf = await import(ROOTURL + "module/config.mjs");
const T = (n, d) => ({ name: n, disposition: d });
console.log("side: allies", cf.targetSide([T("Nari", 1), T("Lonny", 1)], 1), "| enemies", cf.targetSide([T("Goblin", -1), T("Wolf", 0)], 1), "| mixed", JSON.stringify(cf.targetSide([T("Nari", 1), T("Goblin", -1)], 1)), "| unknown", JSON.stringify(cf.targetSide([{ name: "x" }], 1)), "| none", JSON.stringify(cf.targetSide([], 1)));
console.log("enemy row:", cf.targetsRowHtml(["Goblin ×2"], { retarget: true, side: "enemy" }));
console.log("ally row:", cf.targetsRowHtml(["Nari"], { retarget: true, side: "ally" }));
console.log("no target keeps its own class:", cf.targetsRowHtml([], { retarget: true, side: "ally" }).includes('class="tname none"'));
const a = src("module/actions.mjs");
console.log("the card and the retarget pass the side:", a.includes("targetEntries(targets, selfToken?.document?.disposition ?? 1)") && a.includes("targetEntries(targets, mine)"));   // v0.0.259: as entries, each with its side
const e = src("module/effects.mjs");
console.log("the panel orders a linked condition under its effect with a chain:", e.includes('link.className = "fx-chain"') && e.includes('order.push(e, ...shown.filter(c => c.getFlag(F, "linkedTo") === e.id))'));
const css = src("styles/system.css");
console.log("the rules, the side colors, the squared tag, the chain:", css.includes(".twod12.chat .cardtargets::before, .twod12.chat .cardtargets::after { content: \"\";") && css.includes(".twod12.chat .cardtargets .tname.enemy {") && css.includes(".twod12.chat .cardtargets .tname { flex: 0 1 auto; border-radius: 2px;") && css.includes("#twod12-effects .fx-chain {"));
