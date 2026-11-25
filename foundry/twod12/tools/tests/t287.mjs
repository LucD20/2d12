// Run with: node tools/tests/run.mjs (or node tools/tests/t287.mjs)
// v0.0.458 (Lucas, 2026-11-19, the smaller automation gaps): Dirty Trick's and Rally the Tribe's Boons are buttons (gen.mjs convertEffects; a
// "next roll" Bane is spent by the next roll of any kind, bonus.mjs expireOnUse "__roll"), and a Save Action has the Nonlethal switch (book,
// Chapter 4: every creature gains 1 Boon on its Save).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => false }, user: {} }; globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] } };
const G = await import(ROOTURL + "module/gen.mjs");
console.log("--- the Boons as buttons");
for (const t of ["[V] 1d4 Pi; 1 Pressure Bane on its next roll.", "Allies within 5 squares gain 1 Support Boon on their next [Weapon] Action.", "2 Field Boons on your next roll.", "a Support Boon on the roll (no number: words)"]) console.log(" ", G.convertEffects(t));
const C = await import(ROOTURL + "tools/content.mjs");
// the Bestiary's rebuild (2026-11-25): the old Goblin Sneak's and Ogre Chieftain's cards left the packs; OLD_CLASS_DOCS keeps them for this machinery
const act = (npc, n) => (C.actors.find(a => a.name === npc).items.find(i => i.name === n) ?? C.OLD_CLASS_DOCS.find(i => i.name === n)).system.versions[0];
console.log("Dirty Trick, Tier 2:", act("Goblin Sneak", "Dirty Trick").x2, "| Rally the Tribe:", act("Ogre Chieftain", "Rally the Tribe").effects);
const inl = src("module/inline.mjs"), bon = src("module/bonus.mjs"), eff = src("module/effects.mjs");
console.log("next:roll read:", inl.includes('key === "next") cfg.next'), "| stored as __roll:", eff.includes('cfg.next === "roll" && !traits.length ? ["__roll"]'),
  "| spent only by a roll:", bon.includes('(rolled && list.includes("__roll"))'), "| a Save or Check spends it:", (inl.match(/expireOnUse\(actor, new Set\(\), new Set\(\), \{ rolled: true \}\)/g) ?? []).length === 3,
  "| an Action's roll:", src("module/actions.mjs").includes("kept, { rolled: !!(chk || mres), targetUuids: targetActorUuids })"), "| a Move doesn't:", src("module/move.mjs").includes('expireOnUse(c.actor, new Set(["move"])).catch'));
console.log("--- the Save Action's Nonlethal switch");
const ri = src("module/rollinput.mjs"), ac = src("module/actions.mjs");
console.log("the chip on a Save Action:", ri.includes('label: `${nl ? "Lethal" : "Nonlethal"}: +1 Boon on each Save`'), "| no Bane on the user:", ac.includes("if (nlSwitched && !saveAct) { extraMods.push("),
  "| the Save card's Boon and damage:", ac.includes("cfg.nonlethal = dealsNl;") && ac.includes("cfg.boon = (Number(cfg.boon) || 0) + 1"));
