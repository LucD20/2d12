// Run with: node tools/tests/run.mjs (or node tools/tests/t2.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } }, data: { fields: new Proxy({}, { get: () => class { constructor(){} } }) }, abstract: { TypeDataModel: class {} } };
const { instanceText } = await import(ROOTURL + "module/actions.mjs");
console.log(instanceText({ pool: "B", useW: true, wCount: 1, dice: "1d4", useAt: false, subtype: "H", effect: "" }));
console.log(instanceText({ pool: "B", useW: false, wCount: 1, dice: "", useAt: true, subtype: "S", effect: "" }));
console.log(instanceText({ pool: "", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", effect: "Prone" }));
const { CharacterData } = await import(ROOTURL + "module/data.mjs");
const mk = (type, system, name = "x") => ({ type, system, name });
const s = Object.create(CharacterData.prototype);
s.level = 4; s.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 };
s.parent = { items: [
  mk("species", { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, pickTwo: true, chosen: ["body", "instinct"], walk: 5, bodyMod: 3, mindMod: 4 }, "Human"),
  mk("class", { chosenA: "body", chosenB: "mind", bodyMult: 4, mindMult: 3, rallyMod: 4, chosenWeapon: "body" }, "Paladin")] };
s.prepareDerivedData();
console.log(s.attributes, s.pool, s.rallyMax, s.weaponMod);
