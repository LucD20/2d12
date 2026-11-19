// Run with: node tools/tests/run.mjs (or node tools/tests/t281.mjs)
// v0.0.443 (group 1; Lucas, 2026-11-19: the mockup foundry/mockups/group1, rounds 1 to 3): the sheet's marks are the HUD's (AP squares, the
// Reaction AP a gold diamond, Strike slashes); the combat line's two lists (hooks; the Escalation ladder with its heraldic shields), the same for a
// PC and an Elite, a Standard NPC's marks at the right; the Esc. row the HUD's ticks; the Basic Actions' strips and option A; an NPC's tiles in
// the PC's grid; the Basic attack's own damage; Slash's icon; the HUD's marks once a combat is prepared.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Hooks = { on() {}, once() {} };
const SM = await import(ROOTURL + "module/sheetmodel.mjs"), CFG = await import(ROOTURL + "module/config.mjs");
const tpl = src("templates/actor-sheet-pc.hbs"), pcs = src("module/pcsheet.mjs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), hud = src("module/hud.mjs");
const strip = h => h.replace(/<svg[\s\S]*?<\/svg>/g, "[shield]");
console.log("--- the two lists");
const pcL = SM.combatLists({ hookNames: ["Kindled Wrath"], used: { crit: true }, rungs: SM.escRungs(4, { 2: ["Roving Judgment"], 4: ["Weight of Judgment"] }, true, 6) });
console.log("a PC:", JSON.stringify(pcL.hooks), "|", pcL.ladder.map(r => `${r.n} ${r.name}${r.lit ? " (reached)" : ""}`).join(" / "));
console.log("its shields: 3 kinds, one outline:", new Set(pcL.ladder.map(r => r.sym)).size === 3 && pcL.ladder.every(r => r.sym.includes('d="M3.25 3.25H20.75V14')), "| the 2nd has a chevron, the 3rd a chief too:", pcL.ladder[1].sym.includes("M6.6 17.6") && pcL.ladder[2].sym.includes("M3.25 3.25H20.75V10H3.25Z"));
const el = SM.combatLists({ npc: true, elite: true, rungs: SM.ELITE_RUNGS.map(r => ({ ...r, lit: r.n <= 2 })), bloodied: true });
console.log("an Elite:", JSON.stringify(el.hooks), "|", el.ladder.map(r => `${r.n} ${r.name}${r.lit ? " (reached)" : ""}`).join(" / "), "| a Standard: none:", SM.combatLists({ npc: true }) === null);
console.log("--- the Basic attack's line");
console.log(SM.basicAttackLine({ t2: [{ dice: "1d4!+1" }], t3: [{ dice: "1d6!+3" }] }), "|", SM.basicAttackLine({ t2: [{ useW: true, wCount: 1, dice: "" }], t3: [{ useW: true, wCount: 1, dice: "2" }] }), "|", SM.basicAttackLine({}));
console.log("no rating word, no Boon sentence:", pcs.includes("if (npc && it.basicAttack) subs.push(basicAttackLine((it.versions ?? [])[0]));") && !pcs.includes("subs.push(\"+1 Boon on its first attack this round\")"));
console.log("--- the fit");
const fake = (lines, w = 120, h = 50) => { const l = { style: { fontSize: "" }, clientWidth: w, clientHeight: h }; const px = () => parseFloat(l.style.fontSize) || 14;
  Object.defineProperty(l, "scrollWidth", { get: () => 9 * px() }); Object.defineProperty(l, "scrollHeight", { get: () => lines * px() * 1.2 }); SM.fitList(l); return l.style.fontSize || "14px"; };
console.log("2 hooks:", fake(2), "| 3:", fake(3), "| 5:", fake(5), "| run after each render and on a resize:", sh.includes("this._fitLists();") && sh.includes('el.querySelectorAll(".ps2-combat .ps2-ls").forEach(l => fitList(l))') && sh.includes("new ResizeObserver(() => fit())"));
console.log("--- the template and the look");
console.log("the line's left: the lists partial (hooks, then the ladder: shield, number, name):", tpl.includes('{{#*inline "lists"}}') && tpl.includes("{{{sym}}}<b>{{n}}</b>{{name}}"), "| a used hook checked:", tpl.includes("{{#if used}}<i>&#10003;</i>{{/if}}"));
console.log("the Esc. row the HUD's ticks (a rung's taller):", tpl.includes('<span class="ps2-ticks">') && css.includes(".ps2-ticks a.rg { height: 16px; }"), "| no Hands on the line:", !tpl.includes("ps2-hands"));
console.log("the marks the HUD's: AP squares:", css.includes(".ps2-pips .pip { width: 12px; height: 12px; border-radius: 0;"), "| the Reaction AP gold:", css.includes(".ps2-pips .pip.rap.on { background: var(--s-gold); }"), "| Strike slashes:", css.includes(".ps2-marks .ps2-strk i { width: 5px; height: 13px; transform: skewX(-22deg);"));
console.log("the line fixed (72 px; a Standard 44 px):", css.includes(".ps2-combat.out { grid-template-columns: minmax(0, 1fr) auto; height: 72px;") && css.includes(".ps2-combat.std { height: 44px; }"));
console.log("Basic Actions: the theme's Frequency color, 4 px:", tpl.includes('style="--lnf:{{#if off}}var(--s-faint){{else}}var(--s-fq-{{fq}}){{/if}}"') && css.includes("border-left: 4px solid color-mix(in srgb, var(--lnf) 88%"), "| the cost without AP:", pcs.includes('.map(v => v.ap)).replace(/\\s*AP$/, "");'), "| the name fitted:", tpl.includes('data-fit="1"'));
console.log("an NPC's tiles in the PC's grid, named as a PC's:", css.includes(".ps2-tiles.m1, .twod12-actor .twod12.sheet.pcs.ps2 .ps2-tiles.m2 { grid-template-columns: repeat(4, minmax(0, 1fr)) 6px repeat(3, minmax(0, 1fr)); }") && pcs.includes("for (const m of mods) m.tile = m.label;"));
console.log("--- fixes");
console.log("Slash an icon in its color:", CFG.dtypeIcon("Sl") === '<i class="fa-solid fa-slash"></i>', "| the dice row's icon bright on dark:", src("module/inline.mjs").includes(";--sc-d:${TWOD12.subtypeColors?.[c.sub]"));
console.log("the HUD's marks once a combat is prepared (not only started):", /async function combatOf\(actor\) \{[\s\S]{0,400}if \(!game\.combat\) return null;/.test(hud));
console.log(strip(SM.rungSymbol(0)).length > 0, strip(SM.rungSymbol(2)));
