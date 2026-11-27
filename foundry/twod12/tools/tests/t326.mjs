// Run with: node tools/tests/run.mjs (or node tools/tests/t326.mjs)
// v0.0.530 (Lucas's checklist on v0.0.529: 48 passed, 7 failed): the fixes. 1. sf-charge: a PC's Charge stops at its weapon's Range, never at a
// PC card's basicAttack (Drawing Light, 5 sq.: every enemy nearer than 8 squares was "too close"). 2. ox-pointout: Point Out's rows in the Hiding
// entry (removable), the ripple, Hide clearing it on the actor. 3. sf-area: a question's hover ignores the mouse on the HUD. 4. sf-forced: the text
// is a sentence of its own; outside the tab the bands stay in the box. 5. ox-shakeoff: the Save's result card, one flowing lead. 6. bst-cornered:
// an NPC's Features on its Actions tab. 7. hq-lingering: the HUD's Lingering when one is on; the Barbed Javelin's Lingering is Piercing.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.game = { settings: { get: () => undefined } };
const WR = await import(ROOTURL + "module/weaponrange.mjs"), SF = await import(ROOTURL + "module/sitframe.mjs"), H = await import(ROOTURL + "module/hide.mjs");
const HV = await import(ROOTURL + "module/hudview.mjs"), SP = await import(ROOTURL + "module/statuspal.mjs");
const CR = await import(ROOTURL + "module/condrules.mjs");

console.log("--- 1. sf-charge: the normal Range a Charge stops at");
const set = a => new Set(a);
const sword = { id: "w1", name: "Arming Sword", system: { traits: set(["melee", "slash"]), range: "", reach: 0 } };
const bow = { id: "w2", name: "Hunting Bow", system: { traits: set(["projectile", "ranged"]), range: "8/16/24" } };
const drawingLight = { id: "a1", name: "Drawing Light", system: { basicAttack: true, distance: "5" } }   // as the pregen stores it;
const durgan = { type: "character", items: [sword, drawingLight] };
const npcAtk = { id: "a2", name: "Hamstringing Axe", system: { basicAttack: true, distance: "reach", traits: set(["weapon", "melee", "strike"]) } };   // v0.0.532: the cards' traits
const orc = { type: "npc", items: [npcAtk, { id: "a3", name: "Barbed Javelin", system: { basicAttack: true, distance: "6", traits: set(["weapon", "ranged", "strike"]) } }] };
for (const [who, actor, weapons] of [["Durgan (Arming Sword, Drawing Light on his sheet)", durgan, [sword]], ["Sylwen (Hunting Bow)", { type: "character", items: [bow] }, [bow]], ["the Orc Warrior", orc, []]]) {
  const npcAttacks = WR.chargeNpcAttacks(actor), list = WR.chargeAttacks({ weapons, npcAttacks, reach: 1 });
  console.log(`${who}: its Basic attacks read ${npcAttacks.length}; ways ${JSON.stringify(list.map(x => [x.label, x.normal]))}; a pick ${WR.chargeNeedsPick(list)}`);
}
// the candidate rule of move.mjs (need = distance - stop Range, at least 3): an enemy 5 squares from Durgan
const stop = WR.chargeAttacks({ weapons: [sword], npcAttacks: WR.chargeNpcAttacks(durgan), reach: 1 })[0].normal, need = 5 - stop;
console.log(`an enemy 5 squares from Durgan: stop Range ${stop}, ${need} squares to run: ${need >= 3 ? "can Charge" : "too close"}`);
const before = WR.chargeAttacks({ weapons: [sword], npcAttacks: durgan.items.filter(i => i.system?.basicAttack), reach: 1 })[0]?.normal ?? 1;   // v0.0.532: Melee only, Drawing Light is not one
console.log(`(v0.0.525's reading, every creature's basicAttack items: stop Range ${before}, ${5 - before} squares: ${5 - before >= 3 ? "can Charge" : "too close"})`);
console.log("move.mjs reads chargeNpcAttacks:", /npcAttacks: chargeNpcAttacks\(actor\)/.test(src("module/move.mjs")));

console.log("--- 2. ox-pointout");
const m = H.hidingModel({ k1: "unsensed" }, { names: { k1: "Kaela", s1: "Sylwen" }, pointed: { s1: { x: 0, y: 0 } } });
console.log("rows:", JSON.stringify(m.rows));
console.log("only pointed out:", JSON.stringify(H.hidingModel({}, { names: { s1: "Sylwen" }, pointed: { s1: { x: 0, y: 0 } } })?.rows), "| nothing:", H.hidingModel({}, {}));
const html = HV.hidingHtml(m);
console.log("the Point Out row:", /<div class="h3-hd-r po">.*<span class="nm">Sylwen<\/span><span class="hb-btn q h3-hd-st h3-hd-po">Pointed out<\/span><button type="button" class="h3-hd-x" data-hud="pointrm" data-obs="s1" aria-label="End what Point Out gave Sylwen">/.test(html), "| the title:", /<span class="tg">Hide, Point Out · 2<\/span>/.test(html), "| no hover text:", !/data-tooltip|title=/.test(html));
const hud = src("module/hud.mjs"), hide = src("module/hide.mjs"), senses = src("module/senses.mjs"), gate = src("module/sightgate.mjs");
console.log("the HUD passes the flag and removes:", /pointed: actor\.getFlag\?\.\(F, "pointedOut"\)/.test(hud), /kind === "pointrm"/.test(hud) && /export async function removePointedOut/.test(hide));
console.log("Hide clears it on the actor:", /if \(actor\.getFlag\?\.\(F, "pointedOut"\)\) await actor\.unsetFlag\(F, "pointedOut"\)/.test(hide), "| not on the token:", !/me\.document\?\.getFlag\?\.\(F, "pointedOut"\)/.test(hide));
console.log("the Hearing ripple shows a pointed-out creature:", /pointedOutHolds\(actor\?\.getFlag\?\.\("twod12", "pointedOut"\)/.test(senses), "| vision refreshed on the flag:", /pointedOut\|hide/.test(gate));

console.log("--- 3. sf-area: the hover ignores the mouse off the map");
const view = { id: "board" }, ev = t => ({ nativeEvent: { target: t } });
console.log("on the map:", SF.offMap(ev(view), view), "| on #board:", SF.offMap(ev({ id: "board" }), view), "| on the HUD's Cancel:", SF.offMap(ev({ id: "", tagName: "BUTTON" }), view), "| no native event:", SF.offMap({}, view), "| PIXI's data.originalEvent:", SF.offMap({ data: { originalEvent: { target: {} } } }, view));
for (const f of ["module/template.mjs", "module/move.mjs", "module/pickbar.mjs"]) console.log(f, "uses it:", (src(f).match(/offMap\(ev, canvas\.app\?\.view\)/g) ?? []).length);

console.log("--- 4. sf-forced: a sentence of its own; the bands in the box outside the tab");
const mv = src("module/move.mjs");
console.log("the texts start with a capital:", ['slid: "In any direction', 'reposition: "Within the area', "push: `Away from", "pull: `Toward"].map(x => mv.includes(x)).join(" "));
const css = src("styles/system.css"), blk = css.slice(css.indexOf("/* ==== v0.0.530"));
for (const r of [".twod12-linebar:not(.in-side) > .lb-acts { display: flex;", ".twod12-linebar:not(.in-side) > .lb-acts > .lb-sp { display: block;", ".twod12-hud .hud-ask > .twod12-linebar.in-hud:not(.in-side) { max-height: 100%;", ".twod12-hud .hud-ask > .twod12-linebar.twod12-forcedbar.in-hud:not(.in-side) > .lb-text small { display: none; }", ".twod12-linebar.twod12-chargebar:not(.in-side) { flex-wrap: wrap; }"]) console.log(blk.includes(r), r);

console.log("--- 5. ox-shakeoff: the Save's result card");
for (const what of ["none", "half", "ends"]) console.log(JSON.stringify(CR.shakeOffCardParts({ name: "Durgan (Dwarf Paladin, Lay On Hands, level 1)", attr: "Body", total: 7, dc: 13, tier: what === "none" ? 1 : what === "half" ? 2 : 3, lingering: "Lingering [V] 1 Ac (Bo/In)", what })));
console.log("inline.mjs posts it:", /sysCard\(\{ title: "Shake Off", \.\.\.shakeOffCardParts\(/.test(src("module/inline.mjs")));
console.log("the lead flows (block), the swap card keeps its row:", blk.includes(".twod12.chat.sysmsg .sm-lead { display: block; }"), blk.includes(".twod12.chat.sysmsg.swapmsg .sm-lead { display: flex; }"));

console.log("--- 6. bst-cornered: an NPC's Features on its Actions tab");
console.log("the model:", /npcFeats: npc \? await Promise\.all\(a\.itemTypes\.feature\.map\(it => brow\(it, "Feature"\)\)\) : \[\]/.test(src("module/pcsheet.mjs")), "| the template:", /\{\{#if pc\.npcFeats\.length\}\}.*\{\{#each pc\.npcFeats\}\}\{\{> brow\}\}\{\{\/each\}\}/.test(src("templates/actor-sheet-pc.hbs")));

console.log("--- 7. hq-lingering");
console.log(JSON.stringify(SP.lingeringChoices([{ id: "e1", text: "Lingering [V] 1d10 Pi (Bo/In)" }, { id: "e2", text: "Lingering [V] 1d6 Fi (Bo/In)" }])));
console.log("the HUD asks when one is on:", /if \(id === "bleed" && on && !right\)/.test(src("module/statuspal.mjs")), "| the toggle adds another:", /\(has && !options\?\.twod12Add\)/.test(src("module/effects.mjs")));
const C = await import(ROOTURL + "tools/content.mjs");
const jav = C.actors.find(a => a.name === "Orc Warrior").items.find(i => i.name === "Barbed Javelin");
console.log("the Barbed Javelin's stored Lingering:", JSON.stringify(jav.system.versions[0]).match(/@Condition\[bleed[^\]]*\]/g));
