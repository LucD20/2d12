// Run with: node tools/tests/run.mjs (or node tools/tests/t37b.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.Roll = class { constructor(f) { this.f = String(f).replace(/xs/g, ""); this.dice = []; } async evaluate() { this.total = Function(`return (${this.f})`)(); return this; } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { targets: [] } };
const posted = []; globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => posted.push(d) };
const insts = [{ pool: "", useW: false, wCount: 1, dice: "", useAt: true, subtype: "S", effect: "" }];
const item = { name: "Reaping Sweep", system: { versions: [{ ap: 1, t1: insts, t2: [], t3: [], fx: { all: [], t1: [], t2: [], t3: [] } }] } };
const actor = { isOwner: true, items: { get: () => item } };
globalThis.fromUuid = async () => actor;
const flags = { action: { tier: 1, actorUuid: "a", itemId: "i", ap: 1, attrVal: 2, isWeapon: true, attrLabel: "Body", targets: [{ uuid: "t", name: "Orc" }] } };
const msg = { getFlag: (s, k) => flags[k] };
const { rollDamage } = await import(ROOTURL + "module/actions.mjs");
await rollDamage(msg);
const d = posted[0]; console.log("comps stored:", JSON.stringify(d.flags.twod12.dmgCard.comps), "| targets:", d.flags.twod12.dmgCard.targets.length);
console.log("card has Damage button:", /applyDamage/.test(d.content), "| total shown:", (d.content.match(/ctotal">(\d+)/) || [])[1]);
// what the Damage button would apply
const comps = d.flags.twod12.dmgCard.comps; const b = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 }, C: { l: 0, n: 0 } };
for (const c of comps) if (b[c.pool]) b[c.pool].l += c.total; console.log("applied buckets:", JSON.stringify(b));
