// Run with: node tools/tests/run.mjs (or node tools/tests/t24.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = globalThis.Combat ?? class {};
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.canvas = {};
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => true } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} };
const warns = []; globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
const msgs = []; globalThis.ChatMessage = { create: async d => msgs.push(d.content.replace(/<[^>]+>/g, "").replace(/&rarr;/g, "→")) };
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
const { computeDC, actionTags, defenseBonus } = await import(ROOTURL + "module/defense.mjs");
const item = (vs, texts = []) => ({ name: "Shove", system: { vs, traits: new Set(["attack"]), versions: [{ effects: texts[0] ?? "", t1: [], t2: [{ effect: texts[1] ?? "" }], t3: [] }] } });
const orc = { name: "Orc", system: { attributes: { body: 1, mind: -1 } }, itemTypes: { feature: [{ name: "Strong Body", system: { defenses: [{ attr: "body", bonus: 1, tags: "pushed" }] } }] } };
console.log("no vs:", computeDC(item(""), orc).dc, "| vs body:", computeDC(item("body"), orc).note);
console.log("vs body + pushed action:", computeDC(item("body", ["", "@Move[pushed|distance:2]"]), orc).note);
console.log("vs mind (negative):", computeDC(item("mind"), orc).note, "| no target:", computeDC(item("body"), null).note);
console.log("tags:", [...actionTags(item("body", ["", "@Move[pushed|distance:2]"]))].join(","));
// movement charge
const { chargeMovement, shiftKey } = await import(ROOTURL + "module/move.mjs");
const flags = { ap: 5, freeMove: 0, moveLeft: 0 };
const c = { name: "Orc", actor: { system: { walk: 5 } }, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
await chargeMovement(c, 3); console.log("move 3:", JSON.stringify(flags), "|", msgs.splice(0).join(" / "));
await chargeMovement(c, 4); console.log("move 4:", JSON.stringify(flags), "|", msgs.splice(0).join(" / "));
flags.freeMove = 2; flags.moveLeft = 0; flags.ap = 5; await chargeMovement(c, 2); console.log("free 2, move 2:", JSON.stringify(flags), "|", msgs.splice(0).join(" / "));
flags.moveLeft = 0; flags.ap = 5; await chargeMovement(c, 12); console.log("move 12 (3 allotments):", JSON.stringify(flags), "|", msgs.splice(0).join(" / "));
flags.moveLeft = 0; flags.ap = 1; await chargeMovement(c, 6); console.log("not enough AP:", JSON.stringify(flags), "|", msgs.splice(0).join(" / "), "| warns:", warns.splice(0));
// basic actions
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
console.log("basic:", Object.values(BASIC_ACTIONS).map(a => `${a.name} [${a.traits.join("/")}] check=${a.check || "-"} AP ${a.versions.map(v => v.ap).join("/")}`).join(" | "));
const { actionTags: tags2 } = await import(ROOTURL + "module/defense.mjs");
const shove = BASIC_ACTIONS.shove; console.log("Shove is a pushed action:", tags2({ system: { traits: new Set(shove.traits), versions: shove.versions } }).has("pushed"));
// calc on Trip 2AP T3 and basic weapon attack for a Paladin-like actor
const { versionStats } = await import(ROOTURL + "module/calc.mjs");
const gs = { system: { damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } } } };
console.log("Basic Weapon Attack exp:", versionStats(BASIC_ACTIONS.basicWeaponAttack.versions[0], { weapon: gs, attrVal: 2, isWeapon: true, mod: 2 }).expTotal.toFixed(2), "(5.36)");
console.log("Trip 2 AP exp:", versionStats(BASIC_ACTIONS.trip.versions[1], { weapon: gs, attrVal: 2, isWeapon: false, mod: 2 }).expTotal.toFixed(2));
