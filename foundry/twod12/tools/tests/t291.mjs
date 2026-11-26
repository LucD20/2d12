// Run with: node tools/tests/run.mjs (or node tools/tests/t291.mjs)
// v0.0.463 (Lucas's checklist report on v0.0.462 and his notes): the HUD's Prone item under the asks, the area hover's Guard row, and the code fixes.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.game = { settings: { get: () => true }, user: {} }; globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] } };
globalThis.foundry = { applications: { api: {}, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => o } };
const HV = await import(ROOTURL + "module/hudview.mjs"), ZT = await import(ROOTURL + "module/zonetip.mjs");
const h = HV.rightHtml({ prone: { lead: "Prone", text: "Stand or Crawl", btns: [] } });
console.log("Prone after the asks:", h.indexOf('class="hb-ask"') < h.indexOf("Prone"), "| the tab shows with Prone alone:", h.includes("has-sit"));
console.log("Consecrated Ground's hover:", ZT.zoneTipLines({ rows: { diff: { on: true, who: "enemies" }, guard: { on: true, who: "allies", self: true, formula: "@origin.pow" } } }).join(" | "));
const sh = src("module/actor-sheets.mjs"), dm = src("module/damage.mjs"), cc = src("module/ccdamage.mjs"), jd = src("module/judge.mjs"), mo = src("module/moment.mjs"), pb = src("module/pickbar.mjs"), il = src("module/inline.mjs"), tp = src("module/template.mjs"), mv = src("module/move.mjs");
console.log("Guard to 0 with the kept AP's:", sh.includes('"system.apGuard": kept - fromKept'), "| Judge reduces nothing (v0.0.527):", !jd.includes("coverBetween"),
  "| a question docks in the HUD when it comes up:", pb.includes('dockHook = Hooks.on("controlToken", () => setTimeout(() => place(0), 150))') && src("module/hud.mjs").includes('const fromMiddle = [...(root.querySelectorAll(".hud-ask > .twod12-linebar")') /* v0.0.474 */, "| the breakdown gets the reductions and Guard:", dm.includes('rep.push({ kind: "reduce", label: String(actor.system.reduceFrom || "Reduction")') && cc.includes("...(report.mods ?? [])"),
  "| no Reactions message: no update:", mo.includes("if (!F2.msg?.update) continue;"), "| an unused d6 group goes:", il.includes("a Tier's group left with no"), "| the area's name capitalized:", tp.includes('"The area"'),
  "| no \"Right-click pans the map\":", !/Right-click pans the map/.test(mv + src("module/setup.mjs")), "| linked names as text in a chat line:", src("styles/system.css").includes(".twod12.chat.sysline a.content-link, .twod12.chat.sysline.sysline a.content-link"));
