// Run with: node tools/tests/run.mjs (or node tools/tests/t110.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.125: passives on Features and Talents (not effects): settings that work by themselves, always or from an Escalation.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } }; globalThis.game = { settings: { get: () => true }, user: { id: "u" }, socket: { on() {}, emit() {} } };
const S = a => new Set(a), blank = { attrs: S([]), all: S([]), any: S([]), none: S([]), from: S([]), tiers: S([]) };
const P = await import(ROOT + "module/passives.mjs");
const E = await import(ROOT + "module/effects.mjs");
const D = await import(ROOT + "module/defense.mjs");
const feat = (name, settings, min = 0, type = "feature") => ({ id: name.toLowerCase().replace(/\W+/g, ""), name, type, system: { settings: settings.map(x => ({ ...blank, minEscalation: x.minEscalation ?? min, ...x })) } });
const aegis = feat("Aegis", [{ type: "boonbane", boons: 1, from: S([]), all: S(["__save"]) }]);
const vigil = feat("Divine Vigil", [{ type: "boonbane", boons: 1, all: S(["__save"]) }], 2);
const stance = feat("Hallowed Stance", [{ type: "defense", defKind: "armor", defValue: 1 }], 2);
const nothing = feat("Divine Power", []);
const mixed = feat("Sacred Oath", [{ type: "boonbane", boons: 1, all: S(["__check"]), minEscalation: 0 }, { type: "defense", defKind: "ward", defValue: 1, minEscalation: 3 }]);
const pc = esc => ({ name: "Kai", type: "character", system: { escalation: esc, attributes: { body: 2 }, armor: "unarmored", armorValue: 0 }, effects: [], itemTypes: { feature: [aegis, vigil, stance, nothing, mixed], talent: [], weapon: [], action: [] } });
console.log("passives found:", P.passiveSources(pc(0)).map(p => `${p.name} (from Escalation ${p.getFlag("twod12", "minEscalation")})`).join(", "));
for (const esc of [0, 1, 2, 3]) {
  const a = pc(esc);
  const save = E.modifierList(a, S(["__save", "body"])).filter(m => m.match).map(m => m.name).join(" + ") || "none";
  const armor = D.computeDC({ name: "Strike", system: { traits: S(["weapon"]), vs: "", versions: [] }, getFlag: () => undefined }, a, "", { kind: "weapon" }).dc;
  console.log(`Escalation ${esc}: boons on a Save from`, save, "| Armor DC against a Weapon Action:", armor);
}
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/item-sheet.hbs"), data = src("module/data.mjs");
console.log("one Feature, two moments (Sacred Oath: a boon always, Ward +1 only at Escalation 3):", [0, 2, 3].map(e => `E${e}: boon on a Check ${E.modifierList(pc(e), S(["__check", "body"])).some(m => m.match && m.name === "Sacred Oath") ? "yes" : "no"}, Ward DC ${D.computeDC({ name: "P", system: { traits: S(["magic"]), vs: "", versions: [] }, getFlag: () => undefined }, pc(e), "", { kind: "power" }).dc}`).join(" | "));
console.log("Features and Talents have a passive:", (data.match(/settings: settingsField\(\)/g) || []).length >= 3, "| each setting has its own It works:", tpl.includes("{{#if isPassiveHost}}") && src("templates/parts/settings.hbs").includes('data-field="minEscalation"') && !tpl.includes('name="system.passiveEscalation"'), "| the settings are one shared part:", (tpl.match(/parts\/settings\.hbs/g) || []).length === 2, "| the Effect no longer offers an Escalation minimum:", !tpl.includes('name="system.minEscalation"'));
