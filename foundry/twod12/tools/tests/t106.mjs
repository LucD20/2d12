// Run with: node tools/tests/run.mjs (or node tools/tests/t106.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.118 (Rounds 11 and 12): Defenses (Armor and Ward = 11 + value, Vs. = 13 + half), Armor Training, the highest-bonus rule, Defense effects, the Release fix.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
const D = await import(ROOTURL + "module/defense.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const S = a => new Set(a);
const action = (traits, extra = {}) => ({ name: "A", system: { traits: S(traits), vs: "", versions: [], ...extra }, getFlag: () => undefined });
const fists = { name: "Fists", system: { traits: S(["strike", "weapon"]), vs: "", versions: [] }, getFlag: (s, k) => (k === "basic" ? "fists" : undefined) };   // v0.0.169: a Weapon Action
const mkTarget = (sys, feats = [], fx = []) => ({ name: "Goblin", system: { attributes: { body: 2, mind: 0, appeal: 1, instinct: 1 }, ...sys }, itemTypes: { feature: feats }, effects: fx });
const derive = (armor, ward = 0, training = "heavy") => { const a = TWOD12.armors[armor]; return { armor, armorValue: a.value, ward, wardValue: ward, armorUntrained: a.rank > 0 && a.rank > (TWOD12.armors[training]?.rank ?? 3) }; };
const SRC = { weapon: { kind: "weapon" }, power: { kind: "power" }, sigW: { kind: "signature", from: "weapon" }, sigP: { kind: "signature", from: "power" }, attr: { kind: "attribute" } };
console.log("--- which Defense an Action faces");
for (const [name, it, src] of [["Smite", action(["strike", "weapon"]), SRC.weapon], ["Judgment", action(["magic"]), SRC.power], ["Signature (Weapon)", action(["signature"]), SRC.sigW], ["Signature (Power)", action(["signature"]), SRC.sigP], ["Fists", fists, SRC.weapon], ["Trip (Vs. Body)", action(["body", "strike"], { vs: "body" }), SRC.attr], ["Smite with a Vs. entry", action(["weapon"], { vs: "appeal" }), SRC.weapon], ["Interact", action(["handle"]), SRC.attr]])
  console.log(name.padEnd(24), JSON.stringify(D.defenseOf(it, src)));
console.log("--- DCs against a Goblin in medium armor with Ward 1");
const gob = mkTarget(derive("medium", 1));
for (const [name, it, src] of [["Weapon", action(["weapon"]), SRC.weapon], ["Power", action(["magic"]), SRC.power], ["Vs. Body", action(["body"], { vs: "body" }), SRC.attr], ["Attribute, no Vs.", action(["handle"]), SRC.attr]]) { const r = D.computeDC(it, gob, "", src); console.log(name.padEnd(18), r.dc, "|", r.note || "(DC 13)"); }
console.log("armor table:", Object.values(TWOD12.armors).map(a => `${a.label} ${11 + a.value}`).join(", "), "| no target:", D.computeDC(action(["weapon"]), null, "", SRC.weapon).note);
console.log("--- bonuses don't add up: the highest bonus and the highest penalty");
const feat = (name, attr, bonus, tags = "") => ({ name, system: { defenses: [{ attr, bonus, tags }] } });
const fx = (name, defenses) => ({ name, disabled: false, getFlag: (s, k) => (k === "defenses" ? defenses : undefined) });
const pal = mkTarget(derive("heavy"), [feat("Bulwark", "armor", 1)], [fx("Shield of Faith", [{ kind: "all", bonus: 2 }]), fx("Aura of Protection", [{ kind: "all", bonus: 2 }]), fx("Sundered", [{ kind: "armor", bonus: -1 }]), fx("Cracked", [{ kind: "all", bonus: -2 }])]);
console.log("Armor:", D.computeDC(action(["weapon"]), pal, "", SRC.weapon).note);
console.log("Ward: ", D.computeDC(action(["magic"]), pal, "", SRC.power).note);
console.log("Vs. Body:", D.computeDC(action(["body"], { vs: "body" }), pal, "", SRC.attr).note);
console.log("+1 Armor and +1 Defense:", D.defenseBonus(mkTarget({}, [feat("Plate trick", "armor", 1)], [fx("Blessing", [{ kind: "all", bonus: 1 }])]), "armor", S([])).total, "(not 2)");
console.log("a Feature's tag still counts (+1 vs Push):", D.defenseBonus(mkTarget({}, [feat("Steady", "body", 1, "pushed")]), "body", S(["pushed"])).total, D.defenseBonus(mkTarget({}, [feat("Steady", "body", 1, "pushed")]), "body", S([])).total);
console.log("--- Armor Training");
for (const [armor, training] of [["heavy", "light"], ["medium", "medium"], ["light", "light"], ["unarmored", "light"], ["heavy", "heavy"]]) { const t = mkTarget(derive(armor, 0, training)); const r = D.computeDC(action(["weapon"]), t, "", SRC.weapon); console.log(`${armor} with ${training} training:`, r.untrained ? "untrained (Actions against it Favored, its Rolls Doomed)" : "trained", "| Vs. Body is not affected:", !D.computeDC(action(["body"], { vs: "body" }), t, "", SRC.attr).untrained); }
console.log("--- the Defense setting of an effect");
const E = await import(ROOTURL + "module/effects.mjs");
const blank = { attrs: S([]), all: S([]), any: S([]), none: S([]), from: S([]), tiers: S([]) };
const sys = { description: "", settings: [{ ...blank, type: "defense", defKind: "all", defValue: 2 }, { ...blank, type: "defense", defKind: "ward", defValue: -1 }, { ...blank, type: "defense", defKind: "armor", defValue: 0 }], expireOn: S([]), expireAll: false };
console.log("applied:", JSON.stringify(E.appliedFlags(sys, {}).defenses));
const F = await import(ROOTURL + "module/fxdetails.mjs");
console.log(sys.settings.slice(0, 2).map(x => F.settingSentence(x).replace(/<[^>]+>/g, "")).join(" | "), "| In short:", F.effectSummary(sys));
const { sourceFromFlags } = await import(ROOTURL + "module/fxsync.mjs");
console.log("rebuilt from an applied effect:", JSON.stringify(sourceFromFlags({ flags: { twod12: { defenses: [{ kind: "armor", bonus: 1 }] } }, statuses: S([]), getFlag: () => undefined }).settings.map(x => [x.type, x.defKind, x.defValue])));
console.log("--- the Release fix");
globalThis.game = { settings: { get: () => true }, user: { isActiveGM: true } };
const B = await import(ROOTURL + "module/basic.mjs");
const upd = []; const rel = ap => ({ type: "action", system: { versions: [{ ap, effects: "x" }] }, getFlag: (s, k) => (k === "basic" ? "release" : undefined), update: async u => upd.push(u["system.versions"].map(v => v.ap)) });
console.log("fixed:", await B.fixReleaseCost([{ name: "Kai", items: [rel(1)] }, { name: "Nari", items: [rel(0)] }]), JSON.stringify(upd));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- data and sheets:", src("module/data.mjs").includes('"unarmored"), ward: int(0, 0)'), src("module/data.mjs").includes('armorTraining: choice(TWOD12.armorTrainings, "light")'), src("templates/actor-sheet.hbs").includes('name="system.armor"'), src("templates/item-sheet.hbs").includes('name="system.armorTraining"'), "| compendium Paladin", JSON.parse(src("packs/_source/classes/paladin.class.json")).system.armorTraining, "Archer", JSON.parse(src("packs/_source/classes/archer.class.json")).system.armorTraining);
