// Run with: node tools/tests/run.mjs (or node tools/tests/t186.mjs)
// v0.0.247 (Lucas's test of v0.0.246): the pick bar (a choice on the map is a bar at the bottom in the Line bar's look, never a Foundry window:
// the Guard's "who" and the Push picker use it), the Token Light setting's intensity and animation (Smite's light was far too bright), the Push
// line naming the pusher when the origin is the target, and the area chips' icons as masked SVG files (an inline <svg> is stripped from a chat card).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: {} }, utils: {} }; globalThis.Hooks = { on() {} }; globalThis.CONFIG = {};
const P = await import(ROOTURL + "module/pickbar.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- the pick bar's HTML");
console.log(P.pickBarHtml({ icon: "fa-shield-heart", text: "Who gains <b>Guard 1d8+3</b>?", options: [{ id: "0", label: "You (Krysta)", cls: "you" }, { id: "1", label: "Lana" }] }));
console.log(P.pickBarHtml({ icon: "fa-hand", text: "Pushed 1", done: "Done", cancel: "Stop", options: [{ id: "0", label: "Goblin <Boss>", tip: "within 2" }] }));
const inl = src("module/inline.mjs"), mv = src("module/move.mjs");
console.log("the who picker and the Push picker use the bar, not DialogV2:", inl.includes('await import("./pickbar.mjs")') && !/allyRecipients[\s\S]*?DialogV2\.wait[\s\S]*?Who gains/.test(inl), mv.includes('await import("./pickbar.mjs")') && !/pushPicker[\s\S]{0,1500}DialogV2/.test(mv));
console.log("--- the light setting");
const dt = src("module/data.mjs"), ef = src("module/effects.mjs"), hb = src("templates/parts/settings.hbs"), fs_ = src("module/fxsync.mjs");
console.log("schema fields:", ["lightAlpha", "lightAnim", "lightSpeed", "lightIntensity"].map(k => `${k} ${dt.includes(`${k}:`)}`).join(", "), "| applied and restored:", ef.includes('"light.alpha": alpha') && ef.includes('"light.animation.type": light.lightAnim || null') && ef.includes("v.animation.intensity"), "| editable:", ["lightAlpha", "lightAnim", "lightSpeed", "lightIntensity"].every(k => hb.includes(`data-field="${k}"`)), "| a new setting starts at Foundry's defaults:", fs_.includes("lightAlpha: 0.5, lightAnim: \"\", lightSpeed: 5, lightIntensity: 5"));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const C = await import(ROOTURL + "tools/content.mjs");
console.log("Smite's lights:", C.docs.filter(d => d.type === "effect" && d.name.startsWith("Smite")).map(d => { const l = d.system.settings.find(s => s.type === "light"); return `${d.name}: ${l.bright}/${l.dim}, intensity ${l.lightAlpha}, ${l.lightAnim} ${l.lightSpeed}/${l.lightIntensity}`; }).join(" | "));
console.log("--- the Push line and the icons");
console.log("the line names who pushes, away from whom:", mv.includes("opts.by && opts.by.id !== origin.id ? `<b>${esc(opts.by.name)}</b>, away from <b>${esc(origin.name)}</b>,`"), "| from:target passes the user:", (mv.match(/cfg\.from === "target" \? tokenOf\(/g) ?? []).length === 2 && mv.includes("const by = cfg.from === \"target\" ? tokenOf(actor) : null;"));
console.log("icon files:", ["emanation", "burst", "line"].map(k => `${k} ${fs.existsSync(ROOT + `icons/area-${k}.svg`)}`).join(", "), "| masked in the CSS:", ["area-emanation", "area-burst", "area-line"].every(k => src("styles/system.css").includes(`mask-image: url(../icons/${k}.svg)`) || src("styles/system.css").includes(`mask: url(../icons/${k}.svg)`)));
