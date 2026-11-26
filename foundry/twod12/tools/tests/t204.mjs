// Run with: node tools/tests/run.mjs (or node tools/tests/t204.mjs)
// v0.0.265 (Lucas: "do 1 and 3"): the cards with a Use button become granted uses (Overwatch, Deathmark as a conditional effect, Open Season, Aim);
// Covering Fire is a Zone; a Version's fx entry can say its mode ({ uuid, mode: "conditional" }).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const cards = f => JSON.parse(fs.readFileSync(ROOT + "../../book/cards/" + f, "utf8")).cards;
const sysOf = (f, n) => CG.cardSystem(cards(f).find(c => c.name === n), x => x);
for (const [f, n] of [["archer.json", "Overwatch"], ["archer.json", "Deathmark"], ["archer.json", "Open Season"], ["set-aside/talents.json", "Aim"], ["archer.json", "Covering Fire"]]) {
  const s = sysOf(f, n), v = s.versions[0];
  console.log(`${n}: no Use button ${!v.effects.includes("@Use[")} | fx ${JSON.stringify(v.fx.all)} | rank ${s.automation}${s.areaCfg ? ` | area kept ${s.areaCfg.keep} ${s.areaCfg.rounds} rounds` : ""}`);
}
const fxFile = n => { try { return JSON.parse(fs.readFileSync(ROOT + `packs/_source/effects/${n}.effect.json`, "utf8")); } catch (e) { return null; } };
const ow = fxFile("overwatch-weapon-attack"), cf = fxFile("covering-fire"), dm = fxFile("deathmark-weapon-attack");
console.log("Overwatch's grant says its line on a Tier 2 or more:", ow ? JSON.stringify(ow.system.settings.map(x => [x.type, x.grantOn, x.grantDo, (x.grantText ?? "").slice(0, 60)])) : "(build the packs)");
console.log("Covering Fire's Zone (v0.0.411: Difficult Terrain and Hazardous Terrain for enemies):", cf ? JSON.stringify([cf.system.where, cf.system.zone?.inside?.diff?.on && cf.system.zone.inside.diff.who, cf.system.zone?.inside?.ht?.on && cf.system.zone.inside.ht.who, cf.system.zone?.inside?.ht?.list?.[0]?.dice]) : "(build the packs)", "| Deathmark's grant:", dm ? JSON.stringify(dm.system.settings.map(x => [x.type, x.grantAction, x.grantCount])) : "(build the packs)");
console.log("the two that keep a Use chip (Charge: the At-will count and Battering Charge; Cut Through: on a Critical):", sysOf("basic-actions.json", "Charge").versions[0].effects.includes("@Use[") && sysOf("set-aside/talents.json", "Cut Through").versions[0].critical.includes("@Use["));
