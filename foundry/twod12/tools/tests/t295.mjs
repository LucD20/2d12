// Run with: node tools/tests/run.mjs (or node tools/tests/t295.mjs)
// v0.0.480 (the core rework, batch 3; book/core-rework.md): [D] (weapon die alone), Basic Attack, Fists (Option B exploding 1d6!),
// Sworn Blade & Steady Draw (basicLine hooks on Basic Attack card + rollDamage), Drawing Light & Harrying Shot (Power Basic attacks,
// basicAttack: true, Bloodied stateLines tier gating), Paladin/Archer modOrder "either", and the reworked/new Basic Actions
// (Aid, Demoralize, Feint, Heal, Tumble, Trip, Shove, Haul, Kneel).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");   // sets up Foundry stand-ins
const EX = await import(ROOTURL + "module/explode.mjs");
const PR = await import(ROOTURL + "module/preview.mjs");
const CA = await import(ROOTURL + "module/calc.mjs");
const CR = await import(ROOTURL + "module/critical.mjs");
const SL = await import(ROOTURL + "module/statelines.mjs");
const CM = await import(ROOTURL + "module/cardmodel.mjs");
const FI = await import(ROOTURL + "module/fists.mjs");
const AC = await import(ROOTURL + "module/actions.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
const { tierTokens } = await import(ROOTURL + "tools/cardgen.mjs");
const { parseTierFull } = await import(ROOTURL + "module/gen.mjs");

console.log("--- [D] (weapon die alone): formula, preview, average, parser");
const longsword = { name: "Longsword", system: { subtype: "S", damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d4", mod: 6 }, t3: { count: 1, die: "d6", mod: 9 } } } };
const huntingBow = { name: "Hunting Bow", system: { subtype: "Pi", damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d4", mod: 1 }, t3: { count: 1, die: "d4", mod: 2 } } } };
const flatOnly = { name: "Stick", system: { subtype: "Bl", damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 0, die: "", mod: 2 }, t3: { count: 0, die: "", mod: 3 } } } };
console.log("weaponDieOnlyFormula:", EX.weaponDieOnlyFormula(longsword.system.damage.t3), "| 2x:", EX.weaponDieOnlyFormula(longsword.system.damage.t3, 2), "| bow T3:", EX.weaponDieOnlyFormula(huntingBow.system.damage.t3), "| flat:", EX.weaponDieOnlyFormula(flatOnly.system.damage.t3));
console.log("weaponDieText:", PR.weaponDieText(longsword, 3), "| bow T3:", PR.weaponDieText(huntingBow, 3), "| flat:", PR.weaponDieText(flatOnly, 3));
console.log("weaponDieAvg:", CA.weaponDieAvg(longsword, 3), "| bow T3:", CA.weaponDieAvg(huntingBow, 3), "| flat:", CA.weaponDieAvg(flatOnly, 3));
console.log("tierTokens 1[W]+1[D]+[Mod]:", tierTokens("[V] 1[W] + 1[D] + [Mod]", true, 3), "| parsed:", JSON.stringify(parseTierFull("1WB,1DB").insts.map(i => ({ w: i.useW, d: i.useD, dc: i.dCount }))));
console.log("Basic Attack rawTierLine:", [1, 2, 3].map(n => PR.rawTierLine(BASIC_ACTIONS.basicWeaponAttack.versions[0][`t${n}`], "", n >= 2).dmg).join(" / "));

console.log("--- Fists (Option B exploding 1d6!) and weapon table");
const fi = FI.fistsItemData();
console.log("Fists weapon table:", JSON.stringify(fi.system.damage));
console.log("Fists card tiers:", [1, 2, 3].map(n => PR.rawTierLine(BASIC_ACTIONS.fists.versions[0][`t${n}`], "", n >= 2).dmg).join(" / "));
console.log("NPC Fists gets Weapon Modifier on T2/T3:", src("module/actions.mjs").includes('actor.type === "npc" && item.getFlag?.("twod12", "basic") !== "fists"'));

console.log("--- Class basicLine hooks (Sworn Blade, Steady Draw)");
const docOf = (type, name) => C.docs.find(d => d.type === type && d.name === name);
const sworn = docOf("feature", "Sworn Blade"), steady = docOf("feature", "Steady Draw");
console.log("Sworn Blade hook:", JSON.stringify(sworn?.system?.hooks), "| Steady Draw hook:", JSON.stringify(steady?.system?.hooks));
const baItem = { name: BASIC_ACTIONS.basicWeaponAttack.name, system: { ...BASIC_ACTIONS.basicWeaponAttack, traits: new Set(BASIC_ACTIONS.basicWeaponAttack.traits) }, flags: { twod12: { basic: "basicWeaponAttack" } } };
const palActor = { system: { escalation: 1 }, items: [sworn] }, arcActor = { system: { escalation: 1 }, items: [steady] };
console.log("Paladin Basic Attack card lines:", CM.modelLabels(CM.cardModel(baItem, { actor: palActor })).join(" | "));
console.log("Archer Basic Attack card lines:", CM.modelLabels(CM.cardModel(baItem, { actor: arcActor })).join(" | "));
console.log("mergeBasicStateLines (Sworn Blade):", JSON.stringify(AC.mergeBasicStateLines(null, [{ hook: sworn.system.hooks[0], item: sworn }])));
console.log("strainedExtraD (Steady Draw): T3 pre-strained:", JSON.stringify(AC.strainedExtraD([{ hook: steady.system.hooks[0], item: steady }], 3, [{ uuid: "T1" }], ["T1"])),
  "| T2 pre-strained:", AC.strainedExtraD([{ hook: steady.system.hooks[0], item: steady }], 2, [{ uuid: "T1" }], ["T1"]).length,
  "| T3 not pre-strained:", AC.strainedExtraD([{ hook: steady.system.hooks[0], item: steady }], 3, [{ uuid: "T1" }], []).length);

console.log("--- Power Basic attacks (Drawing Light, Harrying Shot) and Bloodied tier gating");
const dl = docOf("action", "Drawing Light"), hs = docOf("action", "Harrying Shot");
console.log("Drawing Light: basicAttack", CR.isBasicAttack(dl.system), "| stateLines:", JSON.stringify(dl.system.stateLines));
console.log("Harrying Shot: basicAttack", CR.isBasicAttack(hs.system), "| stateLines:", JSON.stringify(hs.system.stateLines));
console.log("Harrying Shot Bloodied gating: T2", SL.stateLinesFor(hs.system.stateLines, {}, { b: true }, 2).length, "| T3", SL.stateLinesFor(hs.system.stateLines, {}, { b: true }, 3).length);
console.log("Drawing Light Bloodied gating: T2", SL.stateLinesFor(dl.system.stateLines, {}, { b: true }, 2).length, "| T3", SL.stateLinesFor(dl.system.stateLines, {}, { b: true }, 3).length);

console.log("--- Classes: modOrder either and level 1 granted items");
const pal = docOf("class", "Paladin"), arc = docOf("class", "Archer");
console.log("Paladin modOrder:", pal.system.modOrder, "| Archer modOrder:", arc.system.modOrder);
console.log("Paladin L1 granted:", pal.system.levels[0].sections.find(s => s.mode === "granted").items.length, "| Archer L1 granted:", arc.system.levels[0].sections.find(s => s.mode === "granted").items.length);

console.log("--- New & reworked Basic Actions + Kneel");
console.log("Aid:", BASIC_ACTIONS.aid.traits.join(","), "|", BASIC_ACTIONS.aid.versions[0].effects);
console.log("Demoralize:", BASIC_ACTIONS.demoralize.traits.join(","), "| vs:", BASIC_ACTIONS.demoralize.vs, "| T2:", BASIC_ACTIONS.demoralize.versions[0].x2, "| T3:", BASIC_ACTIONS.demoralize.versions[0].x3);
console.log("Feint:", BASIC_ACTIONS.feint.traits.join(","), "| vs:", BASIC_ACTIONS.feint.vs, "| orTiers:", BASIC_ACTIONS.feint.versions[0].orTiers ?? "none", "| T2:", BASIC_ACTIONS.feint.versions[0].x2, "| T3:", BASIC_ACTIONS.feint.versions[0].x3, "| Crit:", BASIC_ACTIONS.feint.versions[0].critical);
console.log("Heal:", BASIC_ACTIONS.heal.traits.join(","), "| AP:", BASIC_ACTIONS.heal.versions[0].ap, "| T2:", BASIC_ACTIONS.heal.versions[0].x2, "| T3:", BASIC_ACTIONS.heal.versions[0].x3);
console.log("Tumble:", BASIC_ACTIONS.tumble.traits.join(","), "| AP:", BASIC_ACTIONS.tumble.versions.map(v => v.ap).join("/"), "| special ends:", BASIC_ACTIONS.tumble.lines.some(l => l.text.includes("and your movement ends")));
console.log("Trip:", BASIC_ACTIONS.trip.traits.join(","), "| AP:", BASIC_ACTIONS.trip.versions.map(v => v.ap).join("/"));
console.log("Shove:", BASIC_ACTIONS.shove.traits.join(","), "| AP:", BASIC_ACTIONS.shove.versions.map(v => v.ap).join("/"));
console.log("Haul:", BASIC_ACTIONS.haul.traits.join(","), "| vs:", BASIC_ACTIONS.haul.vs);
const cmd = docOf("action", "Commandment");
const kneel = cmd.system.versions.find(v => v.mode === "Kneel");
console.log("Kneel:", "T1:", kneel?.x1, "| T2:", kneel?.x2, "| T3:", kneel?.x3);
