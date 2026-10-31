// Run with: node tools/tests/run.mjs (or node tools/tests/t62.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const cf = await import(ROOTURL + "module/config.mjs");
const fx = await import(ROOTURL + "module/fists.mjs");
const mv = await import(ROOTURL + "module/move.mjs");
const T = (...t) => new Set(t);
const W = (name, traits, o = {}) => ({ name, type: "weapon", system: { traits: T(...traits), wielded: true, hands: 1, ...o }, getFlag: (s, k) => o.flags?.[k] });
const actor = (weapons, extra = {}) => ({ system: { size: 3, speed: 5, ...extra }, itemTypes: { weapon: weapons, talent: extra.talents ?? [], feature: [] } });
console.log("--- Requirements");
const trip = { requirements: "The target's SR is at most 1 higher than yours." };
const me = actor([]);
console.log("Large (4) target:", JSON.stringify(cf.requirementProblem(trip, me, { system: { size: 4 } })), "| Huge (5):", cf.requirementProblem(trip, me, { system: { size: 5 } }), "| Tiny (1):", JSON.stringify(cf.requirementProblem(trip, me, { system: { size: 1 } })));
const punch = { requirements: "You have a free hand." };
console.log("free hand, empty hands:", JSON.stringify(cf.requirementProblem(punch, actor([]))), "| greatsword in 2 hands:", cf.requirementProblem(punch, actor([W("Greatsword", ["twohanded"], { hands: 2 })])), "| a hidden blade (Barehanded) and a sword:", JSON.stringify(cf.requirementProblem(punch, actor([W("Blade", ["barehanded"], { hands: 1 }), W("Sword", [], { hands: 1 })]))));
console.log("Speed 3 uses the current Speed:", cf.requirementProblem({ requirements: "You have at least Speed 3" }, actor([], { speed: 2 })), "|", JSON.stringify(cf.requirementProblem({ requirements: "You have at least Speed 3" }, actor([], { speed: 5 }))));
console.log("--- Area");
console.log(JSON.stringify(cf.parseArea("1 Emanation")), JSON.stringify(cf.parseArea("2 Burst within 10 sq.")), cf.parseArea("a lot"));
console.log(cf.areaButton({ area: "1 Emanation" }), "|", cf.areaButton({ area: "" }) === "", "|", cf.distanceText({ area: "1 Emanation within 10 sq.", distance: "reach" }));
console.log("--- Fists");
const fists = W("Fists", ["barehanded", "melee", "nonthreatening"], { wielded: false, flags: { fists: true } });   // v0.0.169: an ordinary weapon
const sword = W("Sword", ["melee"]);
const brawler = { getFlag: (s, k) => (k === "fistsWeapon" ? true : undefined) };
console.log("no Brawler:", fx.activeWeapons(actor([sword, fists])).map(w => w.name).join(","), "| with Brawler:", fx.activeWeapons(actor([sword, fists], { talents: [brawler] })).map(w => w.name).join(","), "| Fists are Melee:", fx.hasProp(fists, "melee"), "| a sword is Ranged:", fx.hasProp(sword, "ranged"));
const twoH = W("Greatsword", ["melee", "twohanded"], { hands: 2 });
console.log("v0.0.169 Fists as a weapon: with a two-handed weapon (no free hand):", fx.activeWeapons(actor([twoH, fists])).map(w => w.name).join(",") || "(none)", "| an older Fists item still has the properties:", fx.hasProp({ ...W("Fists", ["barehanded"], { flags: { fists: true } }) }, "nonthreatening"));
const fistsCard = { getFlag: (s, k) => (k === "basic" ? "fists" : undefined) }, plainCard = { getFlag: () => undefined };
console.log("the Fists card uses only the Fists:", fx.weaponsFor(actor([sword, fists]), fistsCard).map(w => w.name).join(","), "| a Weapon Attack can use:", fx.weaponsFor(actor([sword, fists]), plainCard).map(w => w.name).join(","), "| Fists card, no free hand:", fx.weaponsFor(actor([twoH, fists]), fistsCard).length);
console.log("Fists threaten (flanking): without Brawler", fx.weaponThreatens(actor([sword, fists]), fists), "| with Brawler", fx.weaponThreatens(actor([sword, fists], { talents: [{ id: "brawler", name: "Brawler", system: { settings: [{ type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening", minEscalation: 0 }] } }] }), fists), "| the old hidden flag alone (v0.0.207: made a setting once per world)", fx.weaponThreatens(actor([sword, fists], { talents: [brawler] }), fists), "| a sword", fx.weaponThreatens(actor([sword, fists]), sword));
console.log("--- Reposition");
const cells = [{ i: 5, j: 5 }], origin = [{ i: 6, j: 5 }];   // the goblin is north of you
const m1 = mv.repositionShifts(cells, origin, 1, 1);
console.log("Reposition 1 from the north:", [...m1.keys()].filter(k => k !== "0,0").sort().join(" "), "(your own square is not offered)");
const m3 = mv.repositionShifts(cells, origin, 3, 1);
console.log("Reposition 3:", m3.size - 1, "squares | the line to (3,0):", mv.lineShifts({ di: 3, dj: 0, steps: 3 }).map(s => `${s.di},${s.dj}`).join(" "), "| a long diagonal:", mv.lineShifts({ di: 2, dj: -2, steps: 2 }).map(s => `${s.di},${s.dj}`).join(" "));
const reach2 = mv.repositionShifts(cells, origin, 3, 2);
console.log("with Reach 2 more squares qualify:", reach2.size > m3.size);
