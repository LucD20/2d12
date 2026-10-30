// Run with: node tools/tests/run.mjs (or node tools/tests/t156.mjs)
// v0.0.193 (Lucas's test of v0.0.192): the sheet card's Effects text flows (Twin Shot), the Bonus chip has no "None", the preview's Avg
// counts the Bonus Damage and Empowered / Enfeebled.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Combat = class {};
globalThis.game = { settings: { get: () => true }, user: {}, combat: null };
const P = await import(ROOTURL + "module/preview.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("sheet card: the Effects text in its own span:", src("module/actioncard.mjs").includes('<div class="ac-fxl"><span class="ac-fxt">') && src("styles/system.css").includes(".twod12.acard .ac-fxl > .ac-fxt { display: block;"));
console.log("Bonus chip without a type has no None:", src("module/actions.mjs").includes('text: `${b.effect}: ${b.dmg ? `+${b.dmg}${b.sub ? ` ${TWOD12.subtypes[b.sub] ?? ""}` : ""}` : b.text}'));
const gs = { system: { damage: { t3: { count: 2, die: "d6", mod: 0 } } } };
const insts = [{ useW: true, wCount: 1 }, { dice: "1d6", pool: "M" }];
const hb = { effect: "Heavy Blows", dmg: "2" }, kf = { effect: "Killer's Focus", dmg: "1d6" };
console.log("Smite Tier 3 with Heavy Blows:", JSON.stringify(P.avgExtras(insts, 3, { weapon: gs, bonusByTier: { 3: [hb] } })));
console.log("with Killer's Focus and Empowered 1 (2d6 + 1d6 + 1d6 = 4 dice):", JSON.stringify(P.avgExtras(insts, 3, { weapon: gs, bonusByTier: { 3: [kf] }, step: 1 })));
console.log("Enfeebled 1, no bonus:", JSON.stringify(P.avgExtras(insts, 3, { weapon: gs, step: -1 })), "| a Tier with no damage:", JSON.stringify(P.avgExtras([], 1, { bonusByTier: { 1: [hb] } })));
console.log("wired:", src("module/actions.mjs").includes("bonusByTier: pvBonus, step: pvStep,"));
