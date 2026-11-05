// Run with: node tools/tests/run.mjs (or node tools/tests/t180.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.243 (pack R-Foundry 1; book, Chapter 4 Health Pool, Chapter 5 Stages): the Health line. The class's high and low values, assigned by the player
// (Vigor by default); the species' Vigor / Resolve bonuses (the Human chooses the side of its +3); the Stage steps; a floor of a third; the Attributes out.
// Rally Points = Rally + Stage; the Modifiers +1 at Stage 3 only, never above +4. An old class (multipliers, no high value) keeps the old formula.
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } }, utils: {} };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {};
const { healthLine, CharacterData } = await import(ROOTURL + "module/data.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const cls = n => C.docs.find(d => d.type === "class" && d.name === n).system, sp = n => C.docs.find(d => d.type === "species" && d.name === n).system;
const line = (c, s, o = {}) => healthLine({ high: c.healthHigh, low: c.healthLow, steps: { high2: c.stepHigh2, low2: c.stepLow2, high3: c.stepHigh3, low3: c.stepLow3 }, stage: o.stage ?? 1, highSide: o.high ?? "vigor", bonus: { v: s.bodyMod, r: s.mindMod, pick: !!s.pickHealth, side: o.side ?? "" } });
const show = h => `Vigor ${h.vigor} / Resolve ${h.resolve} = ${h.pool}${h.moved ? ` (floor ${h.floor}: ${h.moved} moved)` : ""}`;
console.log("--- the compendium's numbers");
for (const n of ["Paladin", "Archer"]) { const c = cls(n); console.log(`${n}: high ${c.healthHigh} / low ${c.healthLow}, Stage 2 +${c.stepHigh2} / +${c.stepLow2}, Stage 3 +${c.stepHigh3} / +${c.stepLow3}, Rally ${c.rallyMod} | old multipliers ${c.bodyMult} / ${c.mindMult}`); }
for (const n of ["Human", "Dwarf", "Elf"]) { const s = sp(n); console.log(`${n}: Vigor +${s.bodyMod}, Resolve +${s.mindMod}${s.pickHealth ? " (the player chooses the side)" : ""}`); }
console.log("--- the book's examples");
console.log("a Human Paladin, high on Vigor:", show(line(cls("Paladin"), sp("Human"))), "| at Stage 2:", show(line(cls("Paladin"), sp("Human"), { stage: 2 })), "| Stage 3:", show(line(cls("Paladin"), sp("Human"), { stage: 3 })));
console.log("Steven, an Elf Archer high on Resolve:", show(line(cls("Archer"), sp("Elf"), { high: "resolve" })), "(9 / 20 before the floor)");
console.log("a Dwarf Archer high on Resolve:", show(line(cls("Archer"), sp("Dwarf"), { high: "resolve" })), "| high on Vigor:", show(line(cls("Archer"), sp("Dwarf"))));
console.log("the Human's +3: with the high value:", show(line(cls("Archer"), sp("Human"), { high: "resolve" })), "| on Vigor by choice:", show(line(cls("Archer"), sp("Human"), { high: "resolve", side: "vigor" })));
console.log("no class yet:", show(healthLine({ bonus: { v: 3, r: 2, pick: true } })), "| nothing:", show(healthLine({})));
console.log("--- the character data (stubs)");
const mk = (type, system, name = "x") => ({ type, system, name });
const pc = (lv, o = {}) => {
  const s = Object.create(CharacterData.prototype);
  s.level = lv; s.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }; s.rallyUsed = 0; s.exhausted = o.exhausted ?? 0; s.bodyWounds = 0; s.mindWounds = 0;
  s.healthHigh = o.high ?? "vigor"; s.speciesHigh = o.side ?? "";
  const species = mk("species", { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, pickTwo: true, chosen: ["body", "appeal"], speed: 5, ...(o.species ?? sp("Human")) }, "Human");
  const klass = mk("class", { chosenA: "body", chosenB: "mind", weaponAttrs: new Set(["body", "appeal"]), magicAttrs: new Set(["mind", "appeal"]), ...(o.cls ?? cls("Paladin")) }, "Paladin");
  s.parent = { items: [species, klass] }; s.parent.itemTypes = { species: [species], class: [klass], feature: [], weapon: [], armor: [] };
  s.prepareDerivedData(); return s;
};
for (const lv of [1, 4, 5, 8]) { const s = pc(lv); console.log(`level ${lv} (Stage ${s.stage}): Vigor ${s.bdt} Resolve ${s.mdt} Pool ${s.pool} | Rally Points ${s.rallyMax} (6 + Stage), each heals ${s.rallyHeal} | Weapon Modifier ${s.weaponMod} | AP a turn ${s.apPerTurn}`); }
const hr = pc(1, { high: "resolve" }); console.log("high on Resolve:", `Vigor ${hr.bdt} Resolve ${hr.mdt}`, "| healthLine:", JSON.stringify({ highSide: hr.healthLine.highSide, bonusHighSide: hr.healthLine.bonusHighSide, moved: hr.healthLine.moved }));
const ex = pc(1, { exhausted: 2 }); console.log("Exhausted 2 lowers Resolve by 8:", `Resolve ${ex.mdt} (Rally heal still ${ex.rallyHeal})`);
const old = pc(1, { cls: { bodyMult: 4, mindMult: 4, rallyMod: 6, healthHigh: 0, healthLow: 0 } }); console.log("an old class (multipliers, no high value) keeps the old formula until updated:", `Vigor ${old.bdt} Resolve ${old.mdt}`, "| flagged old:", !!old.healthLine.old);
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- wiring: the sheet's Health line and its switches:", src("templates/actor-sheet.hbs").includes('data-action="swapHealthHigh"') && src("templates/actor-sheet.hbs").includes('data-action="speciesSide"') && src("module/actor-sheets.mjs").includes("export function healthLineCtx("), "| the class and species sheets:", src("templates/item-sheet.hbs").includes('name="system.healthHigh"') && src("templates/item-sheet.hbs").includes('name="system.pickHealth"'), "| the class window:", src("module/classwindow.mjs").includes("high ${cls.healthHigh}, low ${cls.healthLow}"));
console.log("the Stage step of the Modifiers: [0, 0, 1]:", JSON.stringify((await import(ROOTURL + "module/config.mjs")).TWOD12.stageModStep), "| Attributes out of Health:", !src("module/data.mjs").includes("thr(a.body, csys.bodyMult ?? 0, ssys?.bodyMod ?? 0); mdtFull") || src("module/data.mjs").includes("const oldClass ="));
