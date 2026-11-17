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
console.log("dark rules (in Foundry's dark scope since STYLE-3):", count(/:where\(:scope\)|:scope/g) > 1500, "| both-theme rules:", count(/\.twod12-type\b/g) > 400, "| the shared colors:", css.includes(":root, .theme-dark { --s-pg: #1f1c18;") && css.includes(".theme-light { --s-pg: #f4ede0;"));
console.log("not in this pack (STYLE-2): 'On you' hidden:", css.includes(".ps-onyou { display: none"), "| the Class sheet's ruled form:", css.includes("cls-h"), "| the Immune / Resist / Weak block (built in v0.0.373, STYLE-2):", css.includes("rw-chip"));
console.log("the carousel's look B in both themes:", css.includes(".twod12-type.twod12-type #twod12-carousel .tp.act { width: 136px; }") && !css.includes(".twod12-dark #twod12-carousel"));
console.log("the yellower Tier 2 (dark / light):", css.includes("--s-t-2: #e0d65a;"), css.includes("--s-t-2: #6f6800;"), "| Guard on dark / light:", css.includes(":scope .twod12 .kw-guard"), css.includes(".twod12-type .twod12 .kw-guard"));
console.log("--- the theme follows Foundry (STYLE-3, step 4 A): no system setting");
console.log("classes:", TH.themeClasses("dark").join(" "), "| any argument:", TH.themeClasses("light").join(" "));
const root = { classList: { set: new Set(["twod12-light", "other"]), remove(...a) { a.forEach(c => this.set.delete(c)); }, add(...a) { a.forEach(c => this.set.add(c)); } } };
TH.applyTheme("dark", root);
console.log("an old world's class taken off:", [...root.classList.set].sort().join(" "), "| registered in init:", src("module/twod12.mjs").includes("try { registerTheme(); }"), "| no setting:", !src("module/theme.mjs").includes("game.settings.register"));
console.log("no old scope class left in the theme:", !/\.twod12-(dark|light)\b(?!-)/.test(css), "| dark sets in Foundry's scope:", count(/@scope \(\.theme-dark\) to \(\.themed\) \{/g) > 10, "| light rules too:", css.includes("@scope (.theme-light) to (.themed) {"), "| a light window keeps its light variables:", css.includes(".theme-light { --g-roll: #1f7a73;"));
const B3 = B.foundryThemes(".twod12-dark .a .b { color: red; }\n:where(.twod12-dark) .c, .d { color: blue; }\n.twod12-dark.twod12-dark .e::before { color: green; }\n.twod12-light { --x: 1; }");
console.log("the conversion:", JSON.stringify(B3));
console.log("--- STYLE-3 (steps 2 and 3)");
const sys = src("styles/system.css");
console.log("the book's faces shipped and declared:", ["source-sans-3.woff2", "source-sans-3-italic.woff2", "source-serif-4.woff2", "source-serif-4-italic.woff2"].every(f => fs.existsSync(ROOT + "fonts/" + f)) && sys.includes('@font-face { font-family: "Source Sans 3"; src: url("../fonts/source-sans-3.woff2")') && sys.includes('@font-face { font-family: "Source Serif 4"; src: url("../fonts/source-serif-4.woff2")'),
  "| no Signika or Cinzel in a rule:", !/Signika|Cinzel/.test(sys.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@font-face[^}]*}/g, "").replace(/--font-primary: "Source Sans 3", "Signika"/, "")), "| Foundry's font variable inside the system's surfaces:", sys.includes('.twod12, .twod12-hud, .twod12-dock, #twod12-carousel, .application.twod12-styled { --font-primary: "Source Sans 3"'));
console.log("the accent is the book's bronze (dark / light):", css.includes("--s-gold: #d2a75a;"), css.includes("--s-gold: #7a5418;"), "| palette A (dark / light):", css.includes("--s-ta-1: #a8471a; --s-ta-2: #0e6e52; --s-ta-3: #2366a3; --s-ta-c: #d9a62e;"), css.includes("--s-ta-1: #b34a12; --s-ta-2: #0f7a5a; --s-ta-3: #0a64a8; --s-ta-c: #d9a62e;"));
console.log("game words in the ink:", css.includes(":is(.kw-ap, .kw-guard, .kw-bane, .kw-boon, .kw-pos, .kw-neg, .kw-rally, .kw-mv, .at-body, .at-mind, .at-instinct, .at-appeal, .mod-weapon, .mod-power, .mod-signature) { color: inherit !important; }"), "| no AP blue left with !important:", !/3b4cb8 !important|9aa7ff !important/.test(css),
  "| the frequency a small mark:", css.includes(".twod12-type .twod12.acard.d2 .ap-freq { --fqm: var(--fq); }") && src("module/actioncard.mjs").includes('style="--fq:${FREQ_CHIP[f] ?? "#5f5e5a"};background:var(--fq)"'));
console.log("the strips muted:", css.includes("inset 4px 0 0 color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to))"), "| Use outlined:", css.includes(".twod12-type .twod12.sheet.pcs .ps-use, .twod12-type .twod12.sheet.pcs .ps-use.rx { background: transparent !important; color: var(--s-ink) !important; border: 1px solid var(--s-gold) !important;"),
  "| the light pools line keeps its ink:", css.includes(".twod12-type .twod12.chat.cc .cc-pools { color: var(--s-ink); }"));
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
