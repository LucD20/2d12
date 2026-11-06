// Run with: node tools/tests/run.mjs (or node tools/tests/t196.mjs)
// v0.0.257 (Lucas's test of v0.0.256): the hover card on the icons of the effect panel beside the chat (both tooltip attributes, direction LEFT,
// and the card handed to the tooltip manager on hover); the card's target name centered in a tag with the retarget button at the right edge.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.fromUuidSync = u => (u === "Actor.src" ? { name: "Krysta" } : null);
const src = f => fs.readFileSync(ROOT + f, "utf8");
const cf = await import(ROOTURL + "module/config.mjs");
const fx = await import(ROOTURL + "module/effects.mjs");
const flags = { description: "<p>+1 Defense while within the Beacon.</p>", value: null };
const e = { id: "fx1", name: "Beacon (+1 Defense)", img: "icons/svg/aura.svg", origin: "Actor.src", description: "", getFlag: (ns, k) => flags[k] ?? null };
const actor = { uuid: "Actor.me", type: "character", system: { exhausted: 0 } };
const card = fx.panelCardHtml(e, actor, { dur: "3 rounds" });
console.log("the panel's card:", card);
const valued = { ...e, name: "Enfeebled 2", getFlag: (ns, k) => ({ value: 2, baseName: "Enfeebled" }[k] ?? null) };
console.log("a valued condition's card:", fx.panelCardHtml(valued, actor, { dur: "1 round" }).replace(/<div class="ft-text">[\s\S]*?<\/div>/, ""));
const s = src("module/effects.mjs");
console.log("the panel marks each icon and hands the card to the manager on hover:", s.includes("markTip(el, panelCardHtml(e, actor, { dur, note }))") && s.includes('panel.addEventListener("pointerover", ev => activateTip(ev.target.closest("[data-effect-id]")), true)') && s.includes('el.dataset.tooltipDirection = "LEFT"'));
console.log("targets row:", cf.targetsRowHtml(["Goblin, Nari"], { retarget: true }));
console.log("no target:", cf.targetsRowHtml([], { retarget: true }));
console.log("without the button:", cf.targetsRowHtml(["Goblin"]));
const css = src("styles/system.css");
console.log("the tag centered, the button at the edge:", css.includes(".twod12.chat .cardtargets { position: relative; justify-content: center;") && css.includes(".twod12.chat .cardtargets .tgt { position: absolute; right: 0;") && css.includes(".twod12.chat .cardtargets .tname {"));
