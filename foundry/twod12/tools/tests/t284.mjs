// Run with: node tools/tests/run.mjs (or node tools/tests/t284.mjs)
// v0.0.454 (playtest 6's redesigns; Lucas's answers to foundry/mockups/pt6): D1 the Rally / Heal window (B) and the heal line (A, in lines), D2 the
// breakdown as a ledger (B) with Full / Half / Double on a right-click, D3 the NPC sheet's symbols, D4 an Art's click opens its card, D5 the Minions'
// picker with pictures.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: {} };
globalThis.foundry = { applications: { api: {}, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => o } };
globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] }, time: {} }; globalThis.game = { settings: { get: () => false }, user: {} };
const HW = await import(ROOTURL + "module/healwin.mjs"), CC = await import(ROOTURL + "module/chatcards.mjs"), SS = await import(ROOTURL + "module/statsyms.mjs");
const AR = await import(ROOTURL + "module/artcard.mjs"), PB = await import(ROOTURL + "module/pickbar.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- D1");
const dmg = { bodyLethal: 9, bodyNonlethal: 2, mindLethal: 6, mindNonlethal: 0 }, thr = { vigor: 23, resolve: 12 };
const o = { name: "Durgan", damage: dmg, thresholds: thr, partsFor: n => [[9 * n, ""], [3, "Font of Mercy"]], rally: { max: 7, left: 6, top: 3 } };
const w = HW.healWinHtml(o, { n: 2, values: HW.symmetricHealing(dmg, thr, 21), split: false });
console.log(strip(w));
console.log("the count's buttons:", (w.match(/data-hw="n"/g) ?? []).length, "| two bars:", (w.match(/class="hw2-bar /g) ?? []).length, "| the link to the split:", w.includes('data-hw="split"'));
console.log("the line:", strip(HW.healLinesHtml("Durgan", { bodyLethal: 9, mindLethal: 5, bodyNonlethal: 1 }, [[9, ""], [3, "Font of Mercy"], [4, "Lay On Hands"]], { rally: { n: 1, left: 5 } })));
console.log("nothing posted before Use:", !src("module/rally.mjs").includes("Choosing the damage to remove") && src("module/rally.mjs").includes('sysLine("fa-heart-pulse", healLinesHtml('));
console.log("--- D2");
const led = CC.ledgerModel([{ pool: "B", sub: "Pi", total: 2, formula: "1d4", dice: [{ faces: 4, results: [2] }] }], [{ v: -3, label: "Shield of Faith", kind: "reduce" }]);
console.log("2 Pi, Shield of Faith 3:", led.map(b => `${b.name}: ${b.lines.map(l => `${l.label} ${l.v}`).join("; ")} = ${b.takes}`).join(" || "));
console.log("the reduction remembers its source:", src("module/inline.mjs").includes('"system.reduceFrom": from') && src("module/data.mjs").includes("reduceFrom: new StringField("), "| named in the row:", src("module/ccdamage.mjs").includes('label: String(actor?.system?.reduceFrom || "") || "Reduction", kind: "reduce"'));
console.log("the right-click menu:", src("module/twod12.mjs").includes('const b = ev.target.closest?.("[data-ctx][data-row]");') && src("module/twod12.mjs").includes('["0.5", "Apply half", "rounded up"]'), "| a Reaction's half makes Apply 'Apply half':", src("module/halfhint.mjs").includes('b.textContent = "Apply half"'));
console.log("--- D3");
console.log("symbols:", Object.keys(SS.STAT_SYM).join(", "), "| none on the Attributes:", !SS.statSym("body") && !SS.statSym("mind"), "| on both sheets (v0.0.460, Lucas):", src("module/pcsheet.mjs").includes('sym: statSym("ad")'));
console.log("--- D4");
console.log("the top line:", strip(AR.artHeadHtml("Commandment", "round", "Paladin Art")), "| the click opens it (no pick window):", src("module/actions.mjs").includes("await openArtCard(actor, item,") && !src("module/actions.mjs").includes('sub: "choose a Mode"'));
console.log("a Use button with too few AP stays, struck, and is clicked:", src("module/actioncard.mjs").includes('class="ap-vbtn st-use${b.off ? " no" : ""}" data-action="useVersion"'), "| no reason written:", !src("module/actioncard.mjs").includes('b.off && b.why ? `<span class="st-why">'));
console.log("--- D5");
console.log(PB.pickBarHtml({ options: [{ id: "a", label: "Goblin Sneak 2", img: "g.png", num: "2" }] }).match(/<button[^>]*sq[\s\S]*?<\/button>/)[0]);
console.log("the squad's question:", src("module/combat.mjs").includes('cls: "squadpick"') && src("module/combat.mjs").includes("Which one goes now?"));
