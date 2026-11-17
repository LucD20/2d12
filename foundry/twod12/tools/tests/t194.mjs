// Run with: node tools/tests/run.mjs (or node tools/tests/t194.mjs)
// v0.0.255 (Lucas's test of v0.0.254): the HUD hover card through the tooltip manager (delegated), linked conditions chained to the effect that
// brought them, the reduction on the damage line, the Guard RP chip with the number, a picker that uses the card's targets, inline Actions as Granted tickets.
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: {} }, utils: {} }; globalThis.Hooks = { on() {} }; globalThis.CONFIG = {};
const src = f => fs.readFileSync(ROOT + f, "utf8");
const Gd = await import(ROOTURL + "module/guard.mjs");
console.log("the damage line with a reduction:", Gd.guardBefore(12, 5, 7) + "0" + Gd.guardAfter(5, 3, 7, 0), "| only Guard:", Gd.guardBefore(12, 5) + "7" + Gd.guardAfter(5, 0), "| only a reduction:", Gd.guardBefore(9, 0, 9) + "no damage" + Gd.guardAfter(0, 0, 9, 0));
const ef = src("module/effects.mjs"), inl = src("module/inline.mjs"), sh = src("module/actor-sheets.mjs"), hbs = src("templates/actor-sheet-pc.hbs"), dm = src("module/damage.mjs");
console.log("the HUD card through the tooltip manager, delegated from the HUD's root:", ef.includes('root.addEventListener("pointerover", ev => {') && ef.includes('game.tooltip?.activate?.(el, { content: box, direction: "LEFT" })'));
console.log("a picker uses the card's targets first:", inl.includes("if (ctx.targets?.length && cfg.who !== \"self\" && cfg.who !== \"pick\"") && inl.includes("if (list.length) return { origin, who: list };"), "| Guard RP shows the number:", inl.includes("export function rallyForDoc(") && inl.includes("lbl.replace(/\\bRP\\b/, String(rp))"));
console.log("linked conditions chained and sorted after their effect:", sh.includes('linkedTo, linkedName: parent?.name') && sh.includes("conditions.sort((x, y) =>") && hbs.includes('<i class="fa-solid fa-link cc-link"'));
console.log("inline Actions as Granted tickets with their own icon, out of the list:", sh.includes('for (const it of actions.filter(i => i.getFlag("twod12", "inlineOf")))') && sh.includes('!i.getFlag("twod12", "inlineOf")).map(actRow)') && hbs.includes("{{#if inline}}fa-scroll{{else}}fa-gift{{/if}}"));
console.log("the reduction is reported on the damage card's line:", dm.includes("guardBefore(before, taken, mine.reduced)") && dm.includes("a.reduced = r.taken"));
const cards = JSON.parse(fs.readFileSync(ROOT + "../../book/cards/paladin.json", "utf8")).cards, by = n => cards.find(c => c.name === n);
console.log("Bulwark's chain: the Guard, then the Slid on the card's target:", by("Bulwark of Faith").versions[0].foundry.after, "| Shield's:", by("Shield of Faith").versions[0].foundry.after);
