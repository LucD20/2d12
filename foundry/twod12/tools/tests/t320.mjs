// Run with: node tools/tests/run.mjs (or node tools/tests/t320.mjs)
// v0.0.521 (Lucas's answers to the cleanup audit's held questions, 2026-11-26; book/audit-2026-11-25/applied.md, "The held questions answered"):
// (1) the Critical comes only from the card's Critical row (B1-003): every Basic attack card writes its own, an open row ("[V] 1d10!") takes one of
// the Action's damage types (v0.0.523: the default row for a ticked Basic attack is gone, Lucas 2026-11-26). (2) A Human's choices lock for a player once the first class level is
// confirmed (B2-069). (3) Lingerings of different subtypes run together, Shake Off ends one (B2-066). (4) No "Special Actions" in the NPC sense
// (B3-070). (5) Lay On Hands' "Advance 5 squares" (B2-009).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const CR = await import(ROOTURL + "module/critical.mjs"), { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
const SW = await import(ROOTURL + "module/specieswindow.mjs"), CD = await import(ROOTURL + "module/condrules.mjs"), CFG = await import(ROOTURL + "module/config.mjs");
const all = [...C.docs, ...(C.actors ?? []).flatMap(a => (a.items ?? []).map(i => ({ ...i, npc: a.name })))];
const act = n => all.find(d => d.name === n && d.type === "action");

console.log("--- 1. the Critical row on every Basic attack card");
console.log("Basic Attack:", B.basicWeaponAttack.versions[0].critical, "| Fists:", B.fists.versions[0].critical);
for (const n of ["Drawing Light", "Harrying Shot", "Hamstringing Axe", "Barbed Javelin", "Shiv", "Jeer", "Slipping Touch", "Guttering Glance", "Crushing Grip", "Roar"]) {
  const a = act(n);
  console.log(`${n}${a?.npc ? ` (${a.npc})` : ""}: basicAttack ${!!a?.system?.basicAttack} | Critical ${a?.system?.versions?.[0]?.critical ?? "(none)"} | its dice:`, JSON.stringify(CR.critRowDice(a?.system?.versions?.[0]?.critical)));
}
const missing = all.filter(d => d.type === "action" && d.system?.basicAttack && !(d.system.versions ?? []).every(v => String(v.critical ?? "").trim()));
console.log("a Basic attack in the packs with no Critical row:", missing.map(d => d.name).join(", ") || "none");
const comps = [{ pool: "B", sub: "Sl", kind: "W", total: 6 }, { pool: "B", sub: "Sl", kind: "A", total: 2 }];
console.log("the Basic Attack with a Longsword: the options", CR.critOptions("[V] 1d10!", "[V] 1d10!", comps).map(o => o.label).join(" | "), "| the die", JSON.stringify(CR.critDieFor(CR.critRowDice("[V] 1d10!")[0], CR.critKinds(comps)[0])));
console.log("with Smite's [R] Ho too: the options", CR.critOptions("[V] 1d10!", "[V] 1d10!", [...comps, { pool: "M", sub: "Ho", kind: "D", total: 4 }]).map(o => o.label).join(" | "));
console.log("Shiv's typed row is asked as it is:", CR.critOptions("[V] 1d10! Pi.", "[V] 1d10! Pi.", [{ pool: "B", sub: "Pi", kind: "D", total: 2 }]).map(o => o.label).join(" | "));
console.log("no general Basic-attack path left:", !("isBasicAttack" in CR), !src("module/actions.mjs").includes("isBasicAttack"), "| the row's dice take the kind:", src("module/actions.mjs").includes("C.critComponent(C.critDieFor(d, ans.kind), rolls)"));
console.log("v0.0.523: no default row when a Basic attack is ticked:", !("withDefaultCritRow" in CR), !("registerCriticalHooks" in CR), !("DEFAULT_CRIT_ROW" in CR), "| not registered:", !src("module/twod12.mjs").includes("registerCriticalHooks"));

console.log("--- 2. a Human's choices lock once level 1 is confirmed (a player; the GM still can)");
for (const o of [{ gm: false, hasClass: true, chooses: true }, { gm: true, hasClass: true, chooses: true }, { gm: false, hasClass: false, chooses: true }, { gm: false, hasClass: true, chooses: false }])
  console.log(JSON.stringify(o), "->", SW.speciesLockReason(o) || "(open)");
const human = C.docs.find(d => d.type === "species" && d.name === "Human");
const m = SW.speciesModel(human, { chosen: ["body", "mind"], side: "" }, { adding: false, className: "Paladin", locked: SW.speciesLockReason({ hasClass: true, chooses: true }) });
console.log("the locked window: every option off", m.sections.flatMap(s => s.rows ?? []).every(r => r.opts.every(o => o.off && o.tip)), "| chosen still shown:", m.sections[0].rows[0].opts.filter(o => o.on).map(o => o.k).join(","), "| confirm:", m.confirm, "| cancel:", m.cancel, "| message:", m.message);
console.log("editSpecies reads it and saves nothing when locked:", src("module/specieswindow.mjs").includes("if (!res || locked) return;"));

console.log("--- 3. Lingering by subtype");
console.log("Pi and Fi:", CD.sameLingeringKind({ sub: "Pi" }, { sub: "Fi" }), "| Pi and Pi:", CD.sameLingeringKind({ sub: "Pi" }, { sub: "Pi" }), "| none and none:", CD.sameLingeringKind({ sub: "" }, {}), "| none and Pi:", CD.sameLingeringKind({}, { sub: "Pi" }));
console.log("createEffect keeps another subtype's:", src("module/effects.mjs").includes("if (newBleed) olds = olds.filter(e => sameLingeringKind(bleedOf(e), newBleed));"), "| each deals its own damage at the end of the turn:", src("module/conditions.mjs").includes("for (const [e, b] of list) {"), "| Shake Off picks one:", src("module/inline.mjs").includes("has ${list.length} Lingerings. Which one?"));

console.log("--- 4. no \"Special Actions\" for an NPC's other Actions");
console.log("freqMore:", JSON.stringify(CFG.TWOD12.freqMore));
console.log("the four creatures' card categories:", [...new Set(all.filter(d => d.npc && d.type === "action").map(d => d.system?.category ?? ""))].sort().join(" | "));
console.log("Hurled Goblin:", String(act("Hurled Goblin")?.system?.versions?.[0]?.effects ?? act("Hurled Goblin")?.system?.description ?? "").replace(/<[^>]+>/g, "").slice(0, 160));

console.log("--- 5. Lay On Hands");
console.log("Setup:", act("Lay On Hands")?.system?.setup);
