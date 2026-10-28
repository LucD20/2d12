// Run with: node tools/tests/run.mjs (or node tools/tests/t41.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } };
const msgs = [], warns = [];
globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => msgs.push(d.content.replace(/<[^>]+>/g, "")) };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
const handlers = {}; globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
globalThis.game = { settings: { get: () => true }, user: { id: "u", isActiveGM: true } };
globalThis.fromUuidSync = u => globalThis.__docs?.[u];
// 1. speed mods
const sm = await import(ROOTURL + "module/speedmods.mjs");
const eff = (mods, disabled = false) => ({ disabled, getFlag: () => mods });
console.log("Hindered floor(speed/2) on 5:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "floor(speed/2)" }])] }, 5), "| on 1:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "floor(speed/2)" }])] }, 1), "| add 2:", sm.applySpeedMods({ effects: [eff([{ mode: "add", formula: "2" }])] }, 5), "| Hindered then +2:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "floor(speed/2)" }]), eff([{ mode: "add", formula: "2" }])] }, 5), "| disabled:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "0" }], true)] }, 5), "| bad formula:", sm.applySpeedMods({ effects: [eff([{ mode: "override", formula: "hack()" }])] }, 5), "| -10 add:", sm.applySpeedMods({ effects: [eff([{ mode: "add", formula: "-10" }])] }, 5));
// 2. effects on the target (Prone)
const ef = await import(ROOTURL + "module/effects.mjs");
const proneFlags = { modifiers: [{ against: true, boons: 1, banes: 0, all: [], any: ["melee"], none: [] }, { against: true, boons: 0, banes: 1, all: [], any: ["ranged"], none: [] }, { against: false, boons: 0, banes: 1, all: [], any: [], none: [] }] };
const mkEffects = list => { const l = list; l.get = id => l.find(e => e.id === id); return l; };
const target = { uuid: "Actor.t", name: "Orc", effects: mkEffects([{ id: "e9", name: "Effect: Prone", getFlag: (s, k) => proneFlags[k] }]) };
globalThis.__docs = { "Actor.t": target };
const me = { uuid: "Actor.me", name: "Paladin", effects: mkEffects([]) };
const melee = ef.modifierList(me, new Set(["strike", "melee"]), [target]);
console.log("dialog chips:", melee.map(m => `${m.name} +${m.boons}/-${m.banes} match=${m.match}`).join(" | "));
console.log("resolved melee:", JSON.stringify(ef.resolveModifiers(me, melee.filter(m => m.match).map(m => m.id))));
const ranged = ef.modifierList(me, new Set(["strike", "ranged"]), [target]); console.log("ranged matches:", ranged.map(m => m.match).join(","));
// 3. check text and distance
const cf = await import(ROOTURL + "module/config.mjs");
const T = (...t) => new Set(t);
// checkTypeText was removed in the cleanup (unused)
console.log(["reach", "self", "weapon", "10/20/40", ""].map(d => JSON.stringify(cf.distanceText({ distance: d }, d === "weapon" ? { system: { range: "10/20/40" } } : null))).join(" "));
console.log(cf.metaRowHtml({ frequency: "round", check: "Weapon Modifier", targetText: "One creature", distance: "Reach", tokens: ["Orc"] }).replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "*").replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"));
console.log(JSON.stringify(cf.metaRowHtml({ self: true, distance: "Self" }).replace(/<[^>]+>/g, "")), "| none:", JSON.stringify(cf.metaRowHtml({})));
// 4. (removed: the old-data conversion was deleted in the stage 3 cleanup)
