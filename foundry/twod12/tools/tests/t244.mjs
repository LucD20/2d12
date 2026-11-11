// Run with: node tools/tests/run.mjs (or node tools/tests/t244.mjs)
// v0.0.361 (PACK PERF, the audit's D27 to D37 and D40): fewer redraws and smaller writes. The log-only change filter, one redraw per burst,
// one draw per frame, the logs as one flag key per line (an old array moved into keys), a turn start's single combatant write, the passives cache,
// and the wiring of the other fixes (read from the source).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => Math.random().toString(36).slice(2, 12) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
const posted = []; globalThis.ChatMessage = { create: async d => { posted.push(d); return d; }, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { warn() {}, info() {} } };
const U = await import(ROOTURL + "module/util.mjs");

console.log("--- D27 / D28 / D30: a change that is only a log line (or the old snapshot) redraws nothing");
const L = U.logOnlyChange;
console.log("a new Encounter Log line:", L({ _id: "c", flags: { twod12: { encl: { abc: { k: "act" } } } } }), "| a damage entry:", L({ flags: { twod12: { dmgl: { x: {} } } } }),
  "| the old snapshot removed:", L({ flags: { twod12: { "-=snapshot": null } } }), "| a turn:", L({ turn: 2 }), "| Momentum and a log line:", L({ flags: { twod12: { encl: {}, momentumStart: 1 } } }), "| the round and a line:", L({ round: 2, flags: { twod12: { encl: {} } } }));

console.log("--- D27: one redraw for a burst of asks");
let draws = 0; const app = { rendered: true, render() { draws++; } };
for (let k = 0; k < 8; k++) U.renderSoon(app, 20);
await new Promise(r => setTimeout(r, 60));
const closed = { rendered: false, render() { draws += 100; } }; U.renderSoon(closed, 5); await new Promise(r => setTimeout(r, 20));
console.log("8 asks in a row:", draws, "draw | a closed window is not drawn:", draws === 1);
let frames = 0; const f = U.perFrame(() => frames++); f(); f(); f(); await new Promise(r => setTimeout(r, 40)); f(); await new Promise(r => setTimeout(r, 40));
console.log("D30: three asks in a frame, then one more:", frames, "draws");

console.log("--- D28: the Encounter Log, one key per line");
const E = await import(ROOTURL + "module/enclog.mjs");
const mkCombat = flags => ({ flags: { twod12: flags }, getFlag(s, k) { return this.flags.twod12[k]; } });
const line = (id, r, t, k = "act", extra = {}) => ({ id, r, t, own: { id: "o", name: "Owen" }, k, who: { id: "w", name: "Wes" }, d: { name: `A${id}` }, ...extra });
const add = E.logUpdate([], { type: "add", entry: line("n1", 1, 0) }, false, 1000);
console.log("a new line writes only its key:", Object.keys(add).join(","), "| with its order:", add["flags.twod12.encl.n1"].s >= 1000);
const old = [line("o1", 1, 0), line("o2", 1, 1)];
const mig = E.logUpdate(old, { type: "add", entry: line("n2", 1, 1) }, true, 2000);
console.log("an old array is moved into keys with the next line:", Object.keys(mig).filter(k => k.includes("encl.")).join(","), "| and removed:", Object.keys(mig).some(k => k.includes("enclog")));
const keyed = mkCombat({ encl: { b: { ...line("b", 1, 1), s: 5 }, a: { ...line("a", 1, 0), s: 3 } } });
console.log("read in order:", E.logOf(keyed).map(e => e.id).join(","), "| an old Combat still reads its array:", E.logOf(mkCombat({ enclog: old })).map(e => e.id).join(","), "| both:", E.logOf(mkCombat({ enclog: old, encl: { b: { ...line("b", 1, 1), s: 9 } } })).map(e => e.id).join(","));
const v = E.logUpdate(E.logOf(keyed), { type: "voidTurn", r: 1, t: 1, why: "Reset Turn" });
console.log("Reset Turn strikes only that turn's lines, field by field:", JSON.stringify(v));
const p = E.logUpdate(E.logOf(keyed), { type: "patch", id: "a", changes: { txt: "edited" } });
console.log("an edited line:", JSON.stringify(p), "| nothing to change:", E.logUpdate(E.logOf(keyed), { type: "patch", id: "zz", changes: { txt: "x" } }));
const D = await import(ROOTURL + "module/damagelog.mjs");
console.log("the damage log reads the old array and the keys:", D.damageLogOf(mkCombat({ dmglog: [{ a: 3 }], dmgl: { q: { a: 4 } } })).map(e => e.a).join(","));

console.log("--- D27: a turn start writes the combatant once");
globalThis.game = { combat: null, combats: { has: () => true }, user: { isGM: true, isActiveGM: true } };
const C = await import(ROOTURL + "module/combat.mjs");
const writes = [];
const fl = { ap: 1, turnLog: [{ k: "act" }] };
const actor = { system: {}, effects: [], items: [], itemTypes: {} };
const cmb = { id: "c1", name: "Owen", isOwner: true, actor, getFlag: (s, k) => fl[k], setFlag: async (s, k, v) => { writes.push(`setFlag ${k}`); fl[k] = v; },
  update: async d => { writes.push(`update ${Object.keys(d).map(k => k.replace("flags.twod12.", "")).sort().join("+")}`); for (const [k, x] of Object.entries(d)) fl[k.replace("flags.twod12.", "")] = x; } };
game.combat = { combatant: cmb };
await C.setAP(cmb, 4, "start of turn", { rap: { b: 0, a: 1 }, patch: { "flags.twod12.acted": false, "flags.twod12.rap": 1 } });
console.log("writes:", writes.join(" ; "), "| the Turn Log starts again:", fl.turnLog.length, fl.turnLog[0].k, "| no ticker message (v0.0.362: the Turn Breakdown dock):", posted.length === 0);
writes.length = 0; await C.setAP(cmb, 3, "Weapon Attack");
console.log("an Action's AP (no patch): as before:", writes.join(" ; "));
console.log("the snapshot is not a Combat flag:", !src("module/combat.mjs").includes('setFlag(F, "snapshot"'), "| Reset Turn reads it from memory:", src("module/combat.mjs").includes("const snap = turnSnapshot(combat);"), "| asked in the pick window:", src("module/combat.mjs").includes('(await import("./pickwindow.mjs")).pickConfirm'));

console.log("--- D33: the passives cache");
const P = await import(ROOTURL + "module/passives.mjs");
const settings = [{ ...P.ELITE_LADDER[0], minEscalation: 0 }];
const feat = { id: "f1", uuid: "Item.f1", name: "Keen Eye", type: "feature", system: { settings, description: "", hover: "" }, getFlag: () => "" };
const owner = { itemTypes: { feature: [feat], talent: [], action: [] } };
const a1 = P.passiveSources(owner), a2 = P.passiveSources(owner);
console.log("the same sources while the item is unchanged:", a1[0] === a2[0], "|", a1.length, "source");
feat.system = { ...feat.system, settings: [...settings, { ...P.ELITE_LADDER[0], minEscalation: 2 }] };
const a3 = P.passiveSources(owner);
console.log("an updated item (a new settings array) is read again:", a3[0] !== a1[0], "|", a3.length, "sources");
feat.name = "Keener Eye"; console.log("a renamed item too:", P.passiveSources(owner)[0].name);

console.log("--- the wiring");
const sh = src("module/actor-sheets.mjs"), car = src("module/carousel.mjs"), fx = src("module/effects.mjs"), tw = src("module/twod12.mjs"), mk = src("module/mark.mjs"), mv = src("module/move.mjs");
console.log("D27 sheets: one redraw each, none for a log:", sh.includes("if (sh?.rendered) renderSoon(sh);") && sh.includes("if (logOnlyChange(ch)) return;"), "| usage.mjs's copy gone:", !src("module/usage.mjs").includes("registerUsageHooks()") && !tw.includes("registerUsageHooks"), "| D40 createCombat asks the open windows:", sh.includes("foundry.applications.instances?.values?.()"));
console.log("D30 the strip:", car.includes("const draw = perFrame(renderCarousel);") && !car.includes("renderCarousel(); setTimeout(renderCarousel, 50);"), "| D31 one write per tick:", fx.includes("await x.doc.update({ [`flags.${F}.remaining`]: x.rem, [`flags.${F}.lastTick`]: prior.round })"), "| D32 the panel only for its creature:", fx.includes("if (panelShows(effect)) draw();"));
console.log("D34 limits kept per drag:", mv.includes("now - hit.t < 200"), "| refused moves read them fresh:", mv.includes("for (const l of readMoveLimits(doc))"), "| D35 marks cached:", mk.includes("return marksCache ??= readQuarryMarks();"), "| D36 no old chat hooks:", !/Hooks\.on\("renderChatMessage",/.test(tw));
console.log("D37 the load passes:", src("module/refresh.mjs").includes('get(F, "worthFor") !== game.system.version') && src("module/basic.mjs").includes('get(F, "releaseV118")') && !src("module/fxmigrate.mjs").includes("migrateEffects({ write: false })"),
  "| D40 Zones on x / y:", src("module/zone.mjs").includes('Hooks.on("updateToken", (doc, ch) => { if (["x", "y",'), "| the Aura hover per frame:", src("module/aura.mjs").includes("hoverDraw();"), "| the light thresholds read once:", src("module/light.mjs").includes("lightSettings.set(k, v)"));
