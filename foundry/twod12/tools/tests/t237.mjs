// Run with: node tools/tests/run.mjs (or node tools/tests/t237.mjs)
// v0.0.349 (playtest 4, Step 4): the sheet header (On you | Escalation | Hands | Action Points with the Strike pips; Senses under the name; Guard a
// numbered shield in the Health header) and the roll window (the quick buttons on one line, the Versions next to Roll, no Doubles tooltip).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const t = src("templates/actor-sheet-pc.hbs");
const strip = t.slice(t.indexOf('<div class="ps-strip v349">'), t.indexOf('{{else}}\n  <div class="ps-strip out'));
const order = ["Escalation {{pc.strip.esc.n}}", '<span class="ps-k">Hands</span>', '<span class="ps-k">Action Points</span>'].map(x => strip.indexOf(x));
console.log("the strip's order (Escalation, Hands, AP; v0.0.373: no On you):", order.every((x, i) => x >= 0 && (i === 0 || x > order[i - 1])), "| the Strike pips under the AP:", strip.indexOf('class="ps-strk sm"') > strip.indexOf("Action Points"), "| no AP text:", !strip.includes("pc.strip.ap.text"), "| no Guard cell:", !strip.includes('<span class="ps-k">Guard</span>'), "| no Senses cell:", !strip.includes('<span class="ps-k">Senses</span>'));
console.log("Senses under the name (both):", (t.match(/\{\{> senses\}\}/g) ?? []).length === 2, "| Guard's shield in the Health header:", t.includes('<div class="ps-hh"><span class="ps-k">Health {{pool}}</span><a class="ps-shield np-guardbtn'), "| no On you anywhere (v0.0.373):", !t.includes("ps-onyou"));
const deep = () => new Proxy(function () {}, { get: (o, k) => (k in o ? o[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const v = ap => ({ ap, cost: `${ap} AP`, traits: [], meta: {}, tiers: { 1: { parts: [] }, 2: { parts: [] }, 3: { parts: [] } }, crit: "", noTiers: false });
const inp = { name: "Smite", versions: [v(2), v(3)], ap: 2, chips: [], creatures: [{ uuid: "a", name: "Orc", def: "AD", dc: 14, owned: false }] };
const h = RD.dialogHtml(inp, RD.newState(inp));
console.log("the Versions in the bottom bar:", /<footer class="rd-bar">[\s\S]*class="rd-vers"[\s\S]*class="rd-go"/.test(h), "| not in the header:", !/<header class="rd-head">[\s\S]*?rd-vers[\s\S]*?<\/header>/.test(h));
console.log("quick buttons tight, +1 / −1 without a sign icon:", h.includes('class="rd-quick tight"') && !/data-k="plus"><span class="rd-pip/.test(h), "| no Doubles tooltip on the ladder:", !h.includes("Doubles raise one Tier"));
