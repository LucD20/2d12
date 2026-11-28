// Run with: node tools/tests/run.mjs (or node tools/tests/t335.mjs)
// v0.0.541 (Lucas, 2026-11-28; book, Chapter 7, Arms and Weapon; playtest 12): the Arms Modifier is the roll (the trait Arms), the Weapon trait only
// needs a weapon; the Charge's Basic Attack no longer counts toward the At-will count; Snap Shot's Evade is its Setup; Hurled Goblin and Crushing
// Grip need no weapon; and playtest 12's Foundry bugs: Rebuke's damage on the chain's targets, the encounter's AP given before the round starts, the
// late regain, Dying Flare offered without seeing the attacker, the drag priced with the ruler's step cost, the extra die off without AP.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const { TWOD12, vsText } = await import(ROOTURL + "module/config.mjs");
const RS = await import(ROOTURL + "module/rollsource.mjs");
const C = await import(ROOTURL + "tools/content.mjs");

console.log("--- (1) Arms and Weapon");
console.log("the trait:", TWOD12.actionTraits.arms, "| groups: Roll", TWOD12.traitGroups.find(g => g.key === "roll").traits.includes("arms"), "| Requires has Weapon", TWOD12.traitGroups.find(g => g.key === "requires").traits.includes("weapon"));
const sys = { weaponMod: 2, powerMod: 1, signatureMod: 2, modSource: "class", attributes: {} };
const src0 = traits => RS.rollSource ? RS.rollSource(sys, { traits: new Set(traits) }) : null;
const show = t => { const r = src0(t); return r ? `${r.kind} ${r.mod} "${r.chip}"` : "(no rollSource export)"; };
console.log("[Arms, Melee, Strike] (Crushing Grip):", show(["arms", "melee", "strike"]), "| [Weapon] alone (a hand-made item):", show(["weapon", "strike"]), "| [Weapon, Handle] Reload-like, no roll trait:", show(["weapon", "handle"]));
console.log("Vs.: an Arms Action", vsText({ traits: new Set(["arms", "strike"]), versions: [{ noTiers: false }] }), "| a Power one", vsText({ traits: new Set(["magic", "strike"]), versions: [{ noTiers: false }] }));
const docs = [...C.docs, ...C.actors.flatMap(a => a.items ?? [])];
const card = n => docs.find(d => d.name === n && d.type === "action")?.system;
for (const n of ["Basic Attack", "Hurled Goblin", "Crushing Grip", "Great Sweep", "Smite", "Quick Shots"]) { const s = card(n); console.log(`${n}:`, s ? [...s.traits].sort().join(",") : "missing"); }
console.log("--- (2) the Charge and Snap Shot");
const BD = await import(ROOTURL + "module/basic-data.mjs");
console.log("the Charge's Basic Attack counts toward the At-will count:", BD.BASIC_DATA ? JSON.stringify(BD.BASIC_DATA.charge?.versions?.[0]?.effects ?? "").includes("atwill:yes") : src("module/basic-data.mjs").includes("atwill:yes"));
const snap = card("Snap Shot");
console.log("Snap Shot's Setup:", snap?.setup, "| its Effect line gone:", !String(snap?.versions?.[0]?.effects ?? "").includes("Evade"));
console.log("--- (3) playtest 12's bugs (the code)");
const inl = src("module/inline.mjs"), cb = src("module/combat.mjs"), mo = src("module/moment.mjs"), mv = src("module/move.mjs"), ri = src("module/rollinput.mjs");
console.log("Rebuke: a chain's @Damage goes to the chain's targets:", inl.includes("async function doDamage(cfg, ctx = {})") && inl.includes('if (kind === "Damage") return doDamage(cfg, ctx);') && inl.includes("chainT.length ? chainT.map("));
console.log("the encounter's AP before the round starts:", /async startCombat\(\) \{[\s\S]{0,500}await encounterAP\(this\)[\s\S]{0,200}return super\.startCombat\(\);/.test(cb), "| the late regain at a turn's start:", cb.includes('if (hadTurn && c.getFlag(F, "apRegained") !== c.getFlag(F, "apTurn"))'));
console.log("Dying Flare: a Down creature's own moment needs no sight of the attacker:", mo.includes("def.downOk ? null : (ev.source?.token ?? null)"));
console.log("the drag priced with the ruler's step cost when Foundry didn't:", mv.includes("canvas.grid.measurePath(pts, { cost: (from, to2, distance) => hardStep(doc, to2, distance, distance, from) })"));
console.log("the extra die's chip off without AP:", ri.includes('const apWhy = apSpare < 1 ? { start: "na"') && (ri.match(/\.\.\.apWhy/g) ?? []).length === 2, "| a pinned n/a chip stays in sight:", src("module/rolldlg.mjs").includes('(naOpen || c.pinned ? shown : na)'));
