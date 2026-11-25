// Run with: node tools/tests/run.mjs (or node tools/tests/t316.mjs)
// v0.0.515 (Lucas, 2026-11-25, the Hide indicator's mockup: "A but with a catch: After 5 seconds, it goes away, you must select or hover the token
// again to show it. Reducing clutter. I think this should be applied to all lines drawn"; "Whole party"): hidemark.mjs (seals on the hider's left
// edge, lines and plates to each observer on select or hover) and mapmark.mjs's 5 seconds (trackLines, showLines) on Hide's, Line of Effect's and
// Flanking's lines.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= { utils: {} };
const HM = await import(ROOTURL + "module/hidemark.mjs"), MK = await import(ROOTURL + "module/mapmark.mjs");
console.log("who sees (v0.0.518: the GM and the owner): GM", HM.hideMarksVisible(true, false), "| its owner", HM.hideMarksVisible(false, true), "| another player", HM.hideMarksVisible(false, false));
console.log("seal order:", JSON.stringify(HM.sealOrder([["o", "hidden", "Orc"], ["g", "unsensed", "Goblin"], ["x", "clear", "Archer"], ["a", "hidden", "Archer"]]).map(e => e[2])));
console.log("v0.0.516: no seals at rest:", !src("module/hidemark.mjs").includes("drawSeals") && !("hideSealLayout" in HM));
console.log("trimmed line:", JSON.stringify(HM.trimmedLine({ x: 0, y: 0 }, { x: 100, y: 0 }, 10, 20)));
console.log("5 seconds:", MK.LINE_SHOW_MS, "| shown before", MK.lineShown(Date.now() + 1000), "| after", MK.lineShown(Date.now() - 1));
console.log("tracked: Hide", src("module/hidemark.mjs").includes('MK.trackLines("hide", box)'), "| Line of Effect", src("module/loe.mjs").includes('MK.trackLines("loe", box)'), "| Flanking", src("module/flankoverlay.mjs").includes('MK.trackLines("flank", box)'),
  "| shown again on select, hover, target", /controlToken[\s\S]*hoverToken[\s\S]*targetToken/.test(src("module/mapmark.mjs")), "| registered", src("module/twod12.mjs").includes("registerHideMarks()") && src("module/twod12.mjs").includes("registerLineFade()"));
