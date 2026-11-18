// Run with: node tools/tests/run.mjs (or node tools/tests/t39.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } }, applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } }, instances: new Map() }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { ActionData } = await import(ROOTURL + "module/data.mjs");
// 1. (removed: the old-data conversion was deleted in the stage 3 cleanup)
// 2. frequency default
const { effectiveFrequency } = await import(ROOTURL + "module/config.mjs");
const T = (...t) => new Set(t);
console.log("freq: weapon default", JSON.stringify(effectiveFrequency({ frequency: "", traits: T("weapon") })), "| weapon + None", JSON.stringify(effectiveFrequency({ frequency: "none", traits: T("weapon") })), "| weapon + Encounter", effectiveFrequency({ frequency: "encounter", traits: T("weapon") }), "| non weapon default", JSON.stringify(effectiveFrequency({ frequency: "", traits: T("magic") })), "| round", effectiveFrequency({ frequency: "round", traits: T("magic") }));
// 3. tier effect in previews and the RAW line
const pv = await import(ROOTURL + "module/preview.mjs");
const I = o => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", ...o });
const item = { name: "Trip", system: { category: "Basic Action", level: 0, frequency: "", traits: T("strike", "handle", "melee", "weapon"), targets: "One creature", check: "weapon", vs: "", versions: [{ ap: 2, noTiers: false, t1: [], t2: [I({ useW: true }), I({ dice: "1d4", subtype: "H" })], t3: [I({ dice: "1d10", subtype: "B" })], x1: "Hindered (EoT).", x2: "Prone.", x3: "Prone.", effects: "" }] } };
const { prettyDamage } = await import(ROOTURL + "module/config.mjs");
// v0.0.439 (CARD-ONE step 7: buildRawCard retired): a Version's Tier text as every card draws it (rawTierLine, then the pool icons)
const rawCells = it => it.system.versions.flatMap(v => [1, 2, 3].map(n => { const { dmg, effects } = pv.rawTierLine(v[`t${n}`] ?? [], v[`x${n}`] ?? "", n >= 2 && it.system.traits.has("weapon")); return `T${n}: ${[dmg ? prettyDamage(dmg) : "", ...effects].filter(Boolean).join("; ") || "&mdash;"}`; }));
console.log(rawCells(item).join(" | "));
// 4. usage / faded
const flags = {}; const actor = { type: "character", getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, isOwner: true };
const combat = { id: "c1", started: true, round: 1, turn: 0 }; game.combat = combat;
const mk = (id, ...traits) => ({ id, type: "action", system: { frequency: "", traits: T(...traits) } });
const us = await import(ROOTURL + "module/usage.mjs");
const wa = mk("a", "strike", "weapon"), trip = mk("b", "strike", "handle"), smite = mk("c", "strike", "weapon", "divine"), heal = mk("d", "divine"), enc = { ...mk("e", "magic"), system: { frequency: "encounter", traits: T("magic") } };
console.log("before:", [wa, trip, heal].map(x => us.isFaded(actor, x).faded).join(","));
await us.markUsed(actor, wa); console.log("after Weapon Attack (Round):", [wa, trip, smite].map(x => us.isFaded(actor, x).faded).join(","), "|", us.isFaded(actor, wa).why);
await us.markUsed(actor, trip); await us.markUsed(actor, smite);
console.log("after 3 Strikes:", [wa, trip, smite, heal].map(x => us.isFaded(actor, x).faded).join(","), "|", us.isFaded(actor, trip).why);
combat.turn = 1; console.log("next turn, same round (Round actions stay faded, Strike cap reset):", [wa, trip, smite].map(x => us.isFaded(actor, x).faded).join(","));
combat.round = 2; combat.turn = 0; console.log("next round:", [wa, trip, smite].map(x => us.isFaded(actor, x).faded).join(","));
await us.markUsed(actor, enc); combat.round = 5; console.log("Encounter action later in the same combat:", us.isFaded(actor, enc).faded); game.combat = { ...combat, id: "c2" }; console.log("new combat:", us.isFaded(actor, enc).faded);
// 5. effect item from an active effect
const dr = await import(ROOTURL + "module/drag.mjs");
const ae = { name: "Smite (3)", img: "i.svg", flags: { twod12: { modifiers: [{ boons: 1, banes: 0, all: ["strike"], any: [], none: [] }], notes: [{ attrs: ["body"], title: "T", text: "x" }], bonuses: [], description: "<p>d</p>" } } };
const e1 = dr.effectItemData(ae); console.log("effect item (fallback):", e1.type, e1.system.settings.map(s => s.type).join(","));
ae.flags.twod12.source = { description: "<p>src</p>", settings: [{ type: "light" }] }; console.log("effect item (source):", dr.effectItemData(ae).system.settings[0].type);
