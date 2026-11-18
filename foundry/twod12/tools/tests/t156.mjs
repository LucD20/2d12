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
console.log("sheet card: each labeled line in its own span (v0.0.411, the Structure's look):", src("module/actioncard.mjs").includes('<div class="st-l${cls ? ` ${cls}` : ""}"><b>${esc(label)}</b><span>${html}</span></div>') && src("tools/build-theme.mjs").includes(".twod12-type .twod12.acard.d2.st .st-l { display: grid;"));
console.log("Bonus chip without a type has no None:", src("module/actions.mjs").includes('text: `${b.effect}: ${b.dmg ? `+${b.dmg}${b.sub ? ` ${TWOD12.subtypes[b.sub === "W" ? previewWeapon?.system?.subtype ?? "" : b.sub] ?? ""}` : ""}` : b.text}'));
console.log("the old preview's Avg (avgExtras): retired with buildPreviews in v0.0.439 (CARD-ONE step 7); the roll dialog computes its own (rolldlg.mjs tierAvg)");
console.log("wired (v0.0.439: the roll dialog's chips, the old preview retired):", src("module/rollinput.mjs").includes("collectBonuses") || src("module/actions.mjs").includes("bonusSeen"));
console.log("--- v0.0.194: the Avg follows the dialog's chips");
const d = { base: 10.5, dice: 3, parts: [{ key: "Heavy Blows|2||", name: "Heavy Blows +2", avg: 2, dice: 0 }, { key: "Killer's Focus|1d6|Pi|", name: "Killer's Focus +1d6", avg: 3.5, dice: 1 }] };
const live = (on, step) => { const r = P.liveAvg(d, new Set(on), step); return `${r.avg} (${r.why.join(", ")})`; };
console.log("all ticked:", live(["Heavy Blows|2||", "Killer's Focus|1d6|Pi|"], 0), "| Heavy Blows unticked:", live(["Killer's Focus|1d6|Pi|"], 0), "| none, Empowered 1:", live([], 1), "| both, Enfeebled 1:", live(["Heavy Blows|2||", "Killer's Focus|1d6|Pi|"], -1));
console.log("wired:", src("module/actions.mjs").includes("const r = liveAvg(d, on, step);"), "| the roll dialog's Avg (rolldlg.mjs tierAvg):", src("module/rolldlg.mjs").includes("export function tierAvg("));
