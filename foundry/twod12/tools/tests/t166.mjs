// Run with: node tools/tests/run.mjs (or node tools/tests/t166.mjs)
// v0.0.207: the "Weapon property" setting (Brawler: your Fists don't have Non-threatening) and the Action's "Weapon used" field (Pummel: only
// the Fists; Leg Sweep: a kick, the Fists even with both hands full). They replace the hidden flags fistsThreaten / fistsOnly / kick.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { allDocs: docs } = await import(ROOTURL + "tools/content.mjs");
const fx = await import(ROOTURL + "module/fists.mjs"), FD = await import(ROOTURL + "module/fxdetails.mjs"), AP = await import(ROOTURL + "module/appliedflags.mjs");
const T = (...t) => new Set(t);
const W = (name, traits, o = {}) => ({ name, type: "weapon", system: { traits: T(...traits), wielded: true, hands: 1, ...o }, getFlag: (s, k) => o.flags?.[k] });
const full = x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], attrs: [], minEscalation: 0, ...x });
const talent = (name, settings) => ({ id: name, name, type: "talent", system: { settings: settings.map(full) }, getFlag: () => undefined });
const actor = (weapons, { talents = [], effects = [], escalation = 0 } = {}) => ({ type: "character", system: { size: 3, speed: 5, escalation }, effects, itemTypes: { weapon: weapons, talent: talents, feature: [] } });
const fists = W("Fists", ["barehanded", "melee", "nonthreatening"], { wielded: false, flags: { fists: true } });
const whip = W("Whip", ["melee", "nonthreatening"]), sword = W("Sword", ["melee"]);
const brawler = talent("Brawler", docs.find(d => d.name === "Brawler" && d.type === "talent").system.settings);

console.log("--- Weapon property");
console.log("Brawler's settings:", JSON.stringify(brawler.system.settings.map(x => ({ type: x.type, wpWhich: x.wpWhich, wpProp: x.wpProp }))));
console.log("Fists threaten: without Brawler", fx.weaponThreatens(actor([fists]), fists), "| with Brawler", fx.weaponThreatens(actor([fists], { talents: [brawler] }), fists), "| Brawler doesn't touch a Non-threatening whip", fx.weaponThreatens(actor([whip, fists], { talents: [brawler] }), whip));
const allW = talent("Whip Master", [{ type: "weaponprop", wpWhich: "all", wpProp: "nonthreatening" }]);
console.log("made from scratch, \"weapons\": the whip threatens", fx.weaponThreatens(actor([whip, fists], { talents: [allW] }), whip), "| and the Fists", fx.weaponThreatens(actor([whip, fists], { talents: [allW] }), fists), "| lost:", [...fx.lostProps(actor([whip], { talents: [allW] }), whip)].join(","));
const late = talent("Late Brawler", [{ type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening", minEscalation: 2 }]);
console.log("with its own Escalation minimum 2: at 1", fx.weaponThreatens(actor([fists], { talents: [late], escalation: 1 }), fists), "| at 2", fx.weaponThreatens(actor([fists], { talents: [late], escalation: 2 }), fists));
const fl = AP.appliedFlags({ settings: [full({ type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening" })], description: "", expireOn: new Set(), expireAll: false }, null);
const applied = { id: "ae1", name: "Iron Knuckles", disabled: false, flags: { twod12: fl }, getFlag: (s, k) => fl[k] };
console.log("an applied Effect with it works too:", fx.weaponThreatens(actor([fists], { effects: [applied] }), fists), "| switched off:", fx.weaponThreatens(actor([fists], { effects: [{ ...applied, disabled: true }] }), fists));

console.log("--- Weapon used");
const act = use => ({ system: { weaponUse: use }, getFlag: () => undefined });
const basicFists = { system: {}, getFlag: (s, k) => (k === "basic" ? "fists" : undefined) };
const names = l => l.map(w => w.name).join(",") || "none";
const hands = [sword, fists], full2 = [W("Greatsword", ["melee", "twohanded"], { hands: 2 }), fists];
console.log("compendium: Pummel", docs.find(d => d.name === "Pummel").system.weaponUse, "| Leg Sweep", docs.find(d => d.name === "Leg Sweep").system.weaponUse);
for (const [label, it] of [["its weapon", act("")], ["only the Fists", act("fists")], ["a kick", act("kick")], ["the Fists Basic Action", basicFists]])
  console.log(label.padEnd(22), "| a sword and a free hand:", names(fx.weaponsFor(actor(hands), it)).padEnd(12), "| both hands full:", names(fx.weaponsFor(actor(full2), it)));
console.log("the old hidden flag alone does nothing now:", names(fx.weaponsFor(actor(full2), { system: {}, getFlag: (s, k) => (k === "kick" ? true : undefined) })), "(the world update turns it into the field)");

console.log("--- the editor's sentences");
for (const x of [brawler.system.settings[0], allW.system.settings[0]]) console.log(FD.settingSentence(x), "|", FD.settingShort(x));
