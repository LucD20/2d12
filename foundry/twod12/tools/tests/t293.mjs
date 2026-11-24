// Run with: node tools/tests/run.mjs t293 (or node tools/tests/t293.mjs)
// Concept A Flat Matte Token HP Bar, Count-Down Vigor/Resolve (negative overflow), Rim Vignette + Micro-Ribbon + Faded Dead Overlay,
// Heraldic Portrait Seal Marks, 32 BG3/Tactical Polarity Condition SVG Icons, Frightened removed, and system-gap-audit.md saved.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(ROOTURL);
const src = f => fs.readFileSync(ROOT + f, "utf8");

globalThis.Combat = class {};
globalThis.Hooks = { on() {}, once() {} };
globalThis.CONFIG = { statusEffects: [], time: {} };
globalThis.game = { user: { isGM: true }, settings: { get: () => false } };

const HB = await import(ROOTURL + "module/healthbar.mjs");
const SM = await import(ROOTURL + "module/sheetmodel.mjs");
const HV = await import(ROOTURL + "module/hudview.mjs");
const MK = await import(ROOTURL + "module/mark.mjs");

console.log("--- Concept A planHealthBar");
const mkSys = (vl, vn, rl, rn, g = 0) => ({ bdt: 10, mdt: 20, pool: 30, guard: g, apGuard: 0, damage: { bodyLethal: vl, bodyNonlethal: vn, mindLethal: rl, mindNonlethal: rn } });
const r2 = n => Math.round(n * 10) / 10;

const full = HB.planHealthBar(mkSys(0, 0, 0, 0, 6), new Set(), 120);
console.log("Full+Guard:", full.vCur, full.rCur, full.hpLeft, "vZone:", r2(full.vZone), "vFill:", r2(full.vFillW), "rFill:", r2(full.rFillW), "guardW:", r2(full.guardW), "overlay:", full.overlay);

const mixed = HB.planHealthBar(mkSys(3, 4, 2, 6, 0), new Set(), 120);
console.log("Mixed NL:", mixed.vCur, mixed.rCur, "vNlW:", r2(mixed.vNlW), "rNlW:", r2(mixed.rNlW), "frame:", mixed.frame);

const bloodied = HB.planHealthBar(mkSys(10, 0, 0, 0, 0), new Set(["bloodied"]), 120);
console.log("Bloodied (0V):", bloodied.vCur, bloodied.rCur, "frame:", bloodied.frame, "overlay:", bloodied.overlay?.label);

const strained = HB.planHealthBar(mkSys(0, 0, 14, 6, 0), new Set(["strained"]), 120);
console.log("Strained (0R):", strained.vCur, strained.rCur, "frame:", strained.frame, "overlay:", strained.overlay?.label);

const over = HB.planHealthBar(mkSys(30, 0, 0, 0, 0), new Set(["dying"]), 120);
console.log("Overflow (-20V, Dying):", over.vCur, over.rCur, "hpLeft:", over.hpLeft, "vFill:", r2(over.vFillW), "rFill:", r2(over.rFillW), "vSpillW:", r2(over.vSpillW), "overlay:", over.overlay?.label);

const unconc = HB.planHealthBar(mkSys(5, 12, 5, 8, 0), new Set(), 120);
console.log("Unconscious NL 50%+:", unconc.downState, "overlay:", unconc.overlay?.label);

const dead = HB.planHealthBar(mkSys(30, 0, 0, 0, 0), new Set(["dead"]), 120);
console.log("Dead:", dead.dead, "frame:", dead.frame, "overlay:", dead.overlay?.label, "fills:", dead.vFillW, dead.rFillW, dead.guardW);

console.log("--- Count-down Sheet & HUD bars");
console.log("sheet remaining (10 max):",
  JSON.stringify(SM.barRemainingSegments(0, 0, 10)),
  JSON.stringify(SM.barRemainingSegments(3, 2, 10)),
  JSON.stringify(SM.barRemainingSegments(10, 0, 10)),
  JSON.stringify(SM.barRemainingSegments(30, 0, 10)));
const hudNeg = HV.barHtml({ name: "Vigor", cls: "v", left: -20, max: 10, nl: 0 });
console.log("HUD negative overflow:", hudNeg.includes('class="hb-bar v neg"'), hudNeg.includes("<b>-20/10</b>"), hudNeg.includes('style="width:0%"'));

console.log("--- Heraldic Portrait Seal Marks");
const slots = MK.markSealLayout(3, 100);
console.log("3 seals on 100px token:", slots.length === 3, "step >= 2.8*r (no overlap):", slots[1].y - slots[0].y >= slots[0].r * 2.8, "judge + quarry in mark.mjs:", src("module/mark.mjs").includes('kind === "judge"') && src("module/mark.mjs").includes("markSealLayout"));

console.log("--- 32 Condition SVG Icons & Status Cleanup");
const iconDir = ROOT + "icons/conditions/";
const svgs = fs.readdirSync(iconDir).filter(f => f.endsWith(".svg")).sort();
const validSvgs = svgs.every(f => {
  const s = fs.readFileSync(iconDir + f, "utf8");
  return s.includes('xmlns="http://www.w3.org/2000/svg"') && s.includes('viewBox="0 0 64 64"');
});
const tw = src("module/twod12.mjs");
const stBlock = tw.slice(tw.indexOf("CONFIG.statusEffects = ["), tw.indexOf("].map(([id, img])"));
console.log("SVG count:", svgs.length, "all valid SVGs:", validSvgs,
  "| frightened removed from statusEffects:", !stBlock.includes('"frightened"'),
  "| called-out uses default eye:", stBlock.includes('["called-out", "icons/svg/eye.svg"]'),
  "| daunted registered:", stBlock.includes('["daunted", CI("daunted")]'),
  "| dead uses custom overlay (not giant skull):", tw.includes('overlay: false'));

console.log("--- System Gap Audit saved for later");
console.log("audit exists:", fs.existsSync(ROOT + "../system-gap-audit.md"));
