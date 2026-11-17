// Run with: node tools/tests/run.mjs (or node tools/tests/t3.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
globalThis.ui = { notifications: { warn: console.log, info: console.log, error: console.log } };
class Roll { constructor(f){ this.f=String(f).replace(/xs/g,""); } async evaluate(){ const m=this.f.match(/^(\d+)d(\d+)(?:\+(\d+))?$/); if(m){ const n=+m[1], faces=+m[2]; const res=Array.from({length:n},()=>({result:Math.ceil(faces/2)})); this.dice=[{faces,results:res}]; this.total=n*Math.ceil(faces/2)+(+m[3]||0);} else { this.dice=[]; this.total=eval(this.f);} return this; } }
globalThis.Roll = Roll;
const created = [];
globalThis.ChatMessage = { create: async d => { created.push(d); return d; }, getSpeaker: () => ({}) };
const weapon = { id: "w1", name: "Greatsword", system: { subtype: "S", damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } } } };
const inst = (o) => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", effect: "", ...o });
const version = { ap: 1, t1: [inst({ useW: true })], t2: [inst({ useW: true, dice: "1d4", subtype: "H" })], t3: [inst({ useW: true, dice: "1d8", subtype: "H" })], effects: "" };
const item = { id: "a1", name: "Paladin's Attack", system: { versions: [version] } };
const actor = { isOwner: true, items: { get: id => (id === "a1" ? item : weapon) } };
globalThis.fromUuid = async () => actor;
const { rollDamage, instanceText, versionRow } = await import(ROOTURL + "module/actions.mjs");
const msg = { getFlag: () => ({ actorUuid: "x", itemId: "a1", ap: 1, tier: 2, weaponId: "w1", attrVal: 2, isWeapon: true }), content: '<div class="dmgbtn"><button></button></div>', update: async () => {} };
await rollDamage(msg);
console.log(created[0].content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
console.log(JSON.stringify(created[0].flags.twod12.damage));
console.log(versionRow(version));
