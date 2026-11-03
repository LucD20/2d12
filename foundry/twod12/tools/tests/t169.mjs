// Run with: node tools/tests/run.mjs (or node tools/tests/t169.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
// v0.0.208 (W): the hands remember their weapon (main / off), and a [Weapon] Action's use button is a button per hand (2H, or M and O).
const L = await import(ROOTURL + "module/loadout.mjs");
const T = (...t) => new Set(t);
const w = (id, name, sys = {}, traits = []) => ({ id, name, system: { wielded: false, hands: 1, dropped: false, hand: "", traits: T(...traits), ...sys } });
const ls = w("ls", "Longsword", { wielded: true }, ["melee"]), hc = w("hc", "Hand Crossbow", { wielded: true }, ["ranged", "projectile", "reload"]), fi = w("fi", "Fists", {}, ["barehanded", "melee"]);
const show = b => (b ? b.map(x => `${x.label}${x.off ? "(off)" : ""}:${x.name}`).join(" ") : "single button");
console.log("by order:", JSON.stringify(L.handSlots([ls, hc, fi])));
hc.system.hand = "main";
console.log("the crossbow says main:", JSON.stringify(L.handSlots([ls, hc, fi])), "| hand of the longsword:", L.handOf([ls, hc, fi], "ls"));
console.log("Weapon Attack (both fit):", show(L.useButtons([ls, hc, fi], T("ls", "hc"))));
console.log("[Melee] Action (only the longsword):", show(L.useButtons([ls, hc, fi], T("ls"))), "| tips:", L.useButtons([ls, hc, fi], T("ls")).map(b => b.tip).join(" / "));
console.log("[Ranged] Action fits neither:", show(L.useButtons([ls, hc, fi], T())));
hc.system.wielded = false;
console.log("one weapon:", show(L.useButtons([ls, hc, fi], T("ls", "fi"))), "| drawn next goes to:", L.freeHandFor([ls, hc, fi], "hc"), "| the longsword alone would go to:", L.freeHandFor([hc, fi], "ls"));
const gs = w("gs", "Greatsword", { wielded: true, hands: 2 }, ["melee", "twohanded"]);
console.log("two-handed grip:", show(L.useButtons([gs, fi], T("gs"))), "| not fitting:", show(L.useButtons([gs, fi], T())), "| slots:", JSON.stringify(L.handSlots([gs])));
console.log("moves:", JSON.stringify(L.weaponMove("1h", "off")), JSON.stringify(L.weaponMove("1h")), JSON.stringify(L.weaponMove("2h")));
// Fists come after a held weapon (fists.mjs heldFirst), so one weapon in hand needs no "Which weapon?" window.
const src = n => fs.readFileSync(ROOT + n, "utf8");
const fists = src("module/fists.mjs"), act = src("module/actions.mjs"), sh = src("module/actor-sheets.mjs"), tpl = src("templates/actor-sheet.hbs"), data = src("module/data.mjs"), css = src("styles/system.css");
console.log("data: hand on weapons", /hand: str\(\)/.test(data), "| heldFirst and weaponCandidates", fists.includes("export const heldFirst") && fists.includes("export function weaponCandidates"));
console.log("useAction: the button's weapon is the preview and the pick", act.includes("candidates.find(w => w.id === opts.weaponId)") && act.includes("pickWeapon(actor, item, candidates, opts.weaponId)"), "| the window names the hands", act.includes("HAND_LABEL[handOf(all, w.id)]"));
console.log("sheet: useWith and swapHands", sh.includes("static async useWith(") && sh.includes("static async swapHands("), "| row buttons", tpl.includes('data-action="useWith" data-weapon-id="{{id}}"'), "| a free slot gives its hand", tpl.includes('data-slot="hand" data-hand="{{hand}}"') && sh.includes('slot.dataset.hand'), "| css", css.includes(".twod12.sheet.ns .ar-use.hand {"));
// v0.0.209 (Lucas's test of v0.0.208): a Weapon Technique shows its weapon's hand; the Fists the free hands; Swap hands is an Interact.
const ls2 = w("ls", "Longsword", { wielded: true, hand: "main" }, ["melee"]), cb = w("cb", "Crossbow", { wielded: true, hands: 2 }, ["ranged", "reload"]);
console.log("Technique of the main-hand longsword:", show(L.handButtonsFor([ls2, fi], "ls")), "| of a two-handed crossbow:", show(L.handButtonsFor([cb], "cb")), "| not in hand:", show(L.handButtonsFor([ls2], "xx")));
console.log("Fists with the off hand free:", show(L.freeHandButtons([ls2, fi], "fi")), "| both free:", show(L.freeHandButtons([fi], "fi")), "| none free:", show(L.freeHandButtons([cb, fi], "fi")), "| two one-handed:", show(L.freeHandButtons([ls2, w("dg", "Dagger", { wielded: true, hand: "off" }), fi], "fi")));
const sh2 = src("module/actor-sheets.mjs");
console.log("Swap hands spends 1 AP (Regrip)", sh2.includes('spendAP(this.actor, 1, "Regrip (swap hands)")'), "| Reload offers only Reload weapons", sh2.includes('picks.filter(w => hasProp(w, "reload"))'), "| basic rows: hands last", css.includes(".bx-rows .ar-line > .ar-hands { order: 5; }"));
console.log("v0.0.210: a row with hands can wrap its name in the Basic columns", css.includes(".bx-rows .ar.hands .ar-name { white-space: normal;") && src("templates/actor-sheet.hbs").includes("{{#if hands}} hands{{/if}}"));
// v0.0.211: Regrip (a Basic Action, no Handle): its choices; a Two-handed weapon in one hand warns; greyed buttons ask.
globalThis.CONFIG ??= {}; globalThis.Hooks ??= { on() {} }; globalThis.game ??= { settings: { get: () => true } }; globalThis.foundry ??= { applications: { api: { DialogV2: {} } } };
const H = await import(ROOTURL + "module/hands.mjs");
const gs2 = w("gs", "Greatsword", { wielded: true, hands: 1 }, ["melee", "twohanded"]);
console.log("Regrip, a two-hander in one hand:", H.regripOptions([gs2, fi]).map(o => o.action).join(" "), "| two one-handed:", H.regripOptions([ls2, w("dg", "Dagger", { wielded: true, hand: "off" }), fi]).map(o => o.action).join(" "), "| both hands on one:", H.regripOptions([cb]).length);
console.log("warn on a one-handed two-hander:", L.handButtonsFor([gs2], "gs")[0].warn, L.oneHandedTwoHander(gs2), "| not on the crossbow in both:", L.handButtonsFor([cb], "cb")[0].warn);
const tpl2 = src("templates/actor-sheet.hbs"), bas = src("module/basic-data.mjs");
console.log("greyed buttons ask", tpl2.includes('data-action="handBlocked"') && sh2.includes("static async handBlocked("), "| Regrip is a Basic Action without Handle", JSON.stringify(BD.regrip.traits) === '["self"]', "| Interact no longer grips", !bas.includes("grip a weapon with two hands; help"), "| the Items tab 1H to 2H spends Regrip", sh2.includes('spendAP(this.actor, 1, "Regrip")'));
// v0.0.212: a Two-handed weapon in one hand: its 3 Banes only on Actions with that weapon (__twohanded), not the other hand's or the Fists.
const fx = src("module/effects.mjs"), bas2 = src("module/basic-data.mjs");
console.log("one-hand Banes only with that weapon:", fx.includes('banes: 3, all: ["strike", "weapon", "__twohanded"]'), "| Interact draws, stows and swaps:", bas2.includes("draw an object you carry into a free hand; stow an object you hold"));
console.log("v0.0.213: a Technique whose weapon is not in hand can't be used:", src("module/actions.mjs").includes('techniqueState(actor, item) === "unwielded"'));
