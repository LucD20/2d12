// Run with: node tools/tests/run.mjs (or node tools/tests/t290.mjs)
// v0.0.461 (the map notes' redesign, foundry/mockups/mapnotes; Lucas's answers 2026-11-20: the attention mark B, the rest as proposed): the shared
// marks (mapmark.mjs), a Setup's text without braces, one end button on the push list, and the code that went with it.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.game = { settings: { get: () => true } };
const MK = await import(ROOTURL + "module/mapmark.mjs"), SU = await import(ROOTURL + "module/setup.mjs"), PB = await import(ROOTURL + "module/pickbar.mjs");
console.log("--- the attention ripple (B): grows from r to 1.45 r and fades over 2.4 s");
for (const t of [0, 600, 1200, 1800, 2399, 2400]) { const r = MK.rippleAt(t, 40); console.log(` t=${t}: radius ${r.radius.toFixed(1)}, alpha ${r.alpha.toFixed(2)}`); }
console.log("motion on by default:", MK.motionOn(), "| off with the client setting:", (globalThis.game = { settings: { get: (s, k) => (k === "mapMotion" ? false : true) } }, !MK.motionOn()));
console.log("--- a Setup's text (Strafe read \"You {Advance}.\")");
for (const t of ["You @Move[advance|distance:speed]{Advance}.", "You @Move[evade|distance:1].", "Advance up to 5 (@Move[advance|distance:5]) then roll"]) console.log(" ", JSON.stringify(SU.plainSetup(t)));
console.log("--- one end button (the push list's Done and Stop did the same)");
const h = PB.pickBarHtml({ text: "Pushed 1", options: [{ id: "0", label: "Goblin" }], done: "Done: the rest stay", cancel: false });
console.log("Done: the rest stay:", h.includes("Done: the rest stay"), "| no Cancel:", !h.includes('data-id="__cancel"'));
const mv = src("module/move.mjs"), rx = src("module/rxoverlay.mjs"), pb = src("module/pickbar.mjs");
console.log("--- the code");
console.log("Reaction ring:", rx.includes("attentionRing(labels, centerOf(me)"), "| its plate:", rx.includes('"Use or Pass in the HUD"'), "| picks:", pb.includes("M.attentionRing(marks, c,"),
  "| Charge: enemies first:", mv.includes("Pick the enemy to Charge"), "| confirm only by the button, Enter or the target:", mv.includes("const confirm = async () =>") && !mv.includes("if (!cur) return ui.notifications.info(\"Point at the destination"),
  "| Evade dashed:", mv.includes("if (evading) MK.dashLine(rangeGfx"), "| no pointer tip:", !mv.includes('tip.style.display = "block"'), "| Escape = Don't move it:", mv.includes("done({ ended: true }); };   // v0.0.461 (choice 5A)"),
  "| Backspace:", mv.includes('ev.key === "Backspace"'), "| Vigor collisions:", !/\$\{d\.self\} Body/.test(mv), "| Escape in a free move:", mv.includes("window.addEventListener(\"keydown\", esc_, true);"),
  "| map text in Source Sans 3:", !/fontFamily: "Signika, sans-serif"/.test(mv + rx + src("module/loe.mjs") + src("module/fearline.mjs") + src("module/flankoverlay.mjs")));
