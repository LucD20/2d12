// Run with: node tools/tests/run.mjs (or node tools/tests/t248.mjs)
// v0.0.369 (STYLE-1, 2026-11-13): the settled look applied. styles/theme.css is what tools/build-theme.mjs makes from system.css (so a change
// to system.css is followed by a rebuild of the theme), it is loaded after system.css, the theme setting's classes, and the small markup hooks
// the style audit lists (the pick window's text highlighted, no empty heading, a single choice is click and done; the word Guard; the Levels
// window's section and Frequency colors; Slash, Blunt and Pierce in their own tones).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: {} }, utils: { deepClone: o => structuredClone(o) } };
globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const B = await import(ROOTURL + "tools/build-theme.mjs"), TH = await import(ROOTURL + "module/theme.mjs");
const css = B.buildTheme(src("styles/system.css"));
console.log("--- the theme file");
console.log("styles/theme.css is current (run node tools/build-theme.mjs):", css === src("styles/theme.css"), "| loaded after system.css:", JSON.stringify(JSON.parse(src("system.json")).styles));
const count = re => (css.match(re) ?? []).length;
console.log("dark rules:", count(/\.twod12-dark\b/g) > 1500, "| both-theme rules:", count(/\.twod12-type\b/g) > 400, "| the shared colors:", css.includes(":root { --s-pg: #1f1c18;") && css.includes(".twod12-light { --s-pg: #f4ede0;"));
console.log("not in this pack (STYLE-2): 'On you' hidden:", css.includes(".ps-onyou { display: none"), "| the Class sheet's ruled form:", css.includes("cls-h"), "| the Immune / Resist / Weak block (built in v0.0.373, STYLE-2):", css.includes("rw-chip"));
console.log("the carousel's look B in both themes:", css.includes(".twod12-type.twod12-type #twod12-carousel .tp.act { width: 136px; }") && !css.includes(".twod12-dark #twod12-carousel"));
console.log("the yellower Tier 2 (dark / light):", css.includes("--s-t-2: #e0d65a;"), css.includes("--s-t-2: #6f6800;"), "| Guard on dark / light:", css.includes(".twod12-dark .twod12 .kw-guard"), css.includes(".twod12-type .twod12 .kw-guard"));
console.log("--- the setting");
console.log("classes: dark", TH.themeClasses("dark").join(" "), "| light", TH.themeClasses("light").join(" "), "| unknown", TH.themeClasses("x").join(" "));
const root = { classList: { set: new Set(["twod12-light", "other"]), remove(...a) { a.forEach(c => this.set.delete(c)); }, add(...a) { a.forEach(c => this.set.add(c)); } } };
TH.applyTheme("dark", root);
console.log("apply dark over light:", [...root.classList.set].sort().join(" "), "| registered in init:", src("module/twod12.mjs").includes("try { registerTheme(); }"), "| a client setting, dark by default:", /scope: "client", config: true, type: String, choices: THEMES, default: "dark"/.test(src("module/theme.mjs")));
console.log("--- the pick window");
const PW = await import(ROOTURL + "module/pickwindow.mjs");
const one = PW.pickWindowHtml({ name: "Greatsword", sub: "one hand", sections: [{ title: "", sub: "Two-handed: 3 Banes on [Strike, Weapon] Actions; 1 AP.", rows: [{ key: "one", label: "", opts: [{ k: "a", l: "Regrip" }] }] }], confirm: false });
console.log("no empty heading:", !one.includes("<h2>"), "| the text highlighted:", one.includes('<span class="kw-bane">3 Banes</span>') && one.includes('class="trgrp"') && one.includes('<span class="kw-ap">1 AP</span>'), "| no Confirm:", !one.includes("data-confirm"), "| Cancel:", one.includes("data-cancel"));
const titled = PW.pickWindowHtml({ name: "Review", sections: [{ title: "Granted", pill: "1", rows: [] }] });
console.log("a titled section keeps its heading and Confirm:", titled.includes('<h2>Granted <span class="cw-pill">1</span></h2>') && titled.includes("data-confirm"));
console.log("pickOne: click and done:", src("module/pickwindow.mjs").includes("title: o.title ?? o.name, instant: true,") && src("module/pickwindow.mjs").includes("if (this.o.instant) { this.done = true; this.o.resolve(this.o.result()); return this.close(); }"));
console.log("--- the highlighter and the subtypes");
const CFG = await import(ROOTURL + "module/config.mjs");
console.log(CFG.highlightText("You gain Guard 2 until your next turn; Guard is lost first."));
console.log("Slash, Blunt, Pierce on dark:", CFG.TWOD12.subtypeColors.Sl, CFG.TWOD12.subtypeColors.Bl, CFG.TWOD12.subtypeColors.Pi, "| on light:", CFG.TWOD12.subtypeInk.Sl, CFG.TWOD12.subtypeInk.Bl, CFG.TWOD12.subtypeInk.Pi);
console.log("--- the Levels window");
const CE = await import(ROOTURL + "module/classlevels.mjs");
const sc = (x, esc) => CE.sectionColor(x, esc);
console.log("attr", sc({ kind: "attr" }), "| talent", sc({ kind: "talent" }), "| Repertoire Round", sc({ kind: "repertoire", freq: "round" }), "| Repertoire Any", sc({ kind: "repertoire", freq: "any" }),
  "| 'Apex' items", sc({ kind: "items", title: "Apex" }), "| Escalation items", sc({ kind: "items", title: "Passives", items: ["a"] }, () => true), "| a plain list", sc({ kind: "items", title: "Features", items: ["a"] }, () => false));
const ce = src("module/classeditor.mjs");
console.log("hooks: --sc on a section", ce.includes('style="--sc:${sectionColor(x, u => !!info(u)?.escalation)}"'), "| --fq on a type line", ce.includes('<span class="ty"${tyColor(u)}>'), "| the 'Player sees' line highlighted", ce.includes("highlightText(esc(seen.text))"), "| the paragraph under Class items gone", !ce.includes("From the Details tab: the Repertoire"));
