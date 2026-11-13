// Run with: node tools/tests/run.mjs (or node tools/tests/t251.mjs)
// v0.0.375 (PACK STYLE-2): the one-page NPC sheet (module/statblock.mjs, the sheet class NpcStatBlockSheet): the pure stat block from a model
// (the name plate, the stat lines, the groups, an Action's header, its Tiers as three lines, its Effects, a used / locked Version), and the wiring.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const S = await import(ROOTURL + "module/statblock.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- the groups");
console.log("Basic attack:", S.sbGroupOf({ basicAttack: true }), "| a Reaction:", S.sbGroupOf({ reaction: true }), "| an Escalation Action:", S.sbGroupOf({ escalation: 2, reaction: true }), "| anything else:", S.sbGroupOf({}));
const club = { id: "a", name: "Club", traits: "Weapon, Melee, Strike", freq: "atwill", fqColor: "#3B6D11", versions: [{ ap: 1, label: "1 AP" }], meta: [["Vs.", "AD"], ["Distance", "Melee"], ["Target", "One creature"], ["Trigger", ""]], tiers: [{ label: "", cells: ["", "[V] 3 + 1d6 Bl", "[V] 5 + 1d6 Bl"] }] };
const slam = { id: "b", name: "Ground Slam", traits: "Save, Body, Area", freq: "encounter", fqColor: "#A32D2D", dim: true, usedWord: true, versions: [{ ap: 3, label: "3 AP", off: true, used: true, why: "Used this encounter" }], meta: [["Vs.", "Body Save, DC 14"]], tiers: [{ label: "", cells: ["7 + 1d6 Bl, Prone", "4 + 1d6 Bl", "0"] }] };
const rally = { id: "c", name: "Rally the Tribe", traits: "Focus", freq: "round", fqColor: "#185FA5", escalation: 2, versions: [{ ap: 1, label: "1 AP", off: true, why: "Needs Escalation 2" }], meta: [["Distance", "5 squares"]], noTiers: true, effects: "Allies gain 1 Boon." };
console.log("--- an Action");
console.log(strip(S.sbActionHtml(club)));
console.log("its stamp opens the roll dialog on that Version:", S.sbActionHtml(club).includes('data-action="useVersion" data-ap="1"'), "| the row knows its item:", S.sbActionHtml(club).includes('data-item-id="a"'), "| its frequency's color:", S.sbActionHtml(club).includes("--fq:#3B6D11"));
console.log(strip(S.sbActionHtml(slam)), "| struck, can't be clicked:", S.sbActionHtml(slam).includes('class="sb-vb no used" disabled'));
console.log(strip(S.sbActionHtml(rally)), "| no Tiers:", !S.sbActionHtml(rally).includes("sb-tiers"), "| Effects under a line:", S.sbActionHtml(rally).includes('<div class="sb-fx"><span class="fxl">Effects</span>'));
console.log("--- the sheet");
const m = { name: "Ogre Chieftain", rank: "Elite", rankKey: "elite", level: 1, stage: 1, cv: 200, hp: { now: 35, max: 130 }, vigor: [-6, 65], resolve: [41, 65], states: ["Bloodied"],
  stats: [["AD", 14, "", 1], ["WD", 12, "", 1], ["Speed", 4, "", 1], ["Reach", 1, "", 1], ["Steadiness", 0, "", 0], ["Size", "Large (4)", "", 0]], rw: [["Immune", ""], ["Resist", "5 Fire"], ["Weak", ""]],
  groups: [{ key: "basic", label: "Basic", actions: [club] }, { key: "special", label: "Special", actions: [slam] }, { key: "esc", label: "Escalation", esc: { n: 2, max: 3 }, ladder: [{ n: 1, text: "1 Boon.", lit: true }, { n: 3, text: "Back once.", lit: false }], actions: [rally] }],
  attrs: [{ key: "body", label: "Body", value: "+3", vs: 15 }], mods: [{ key: "weapon", label: "Weapon", value: "+3", dc: "DC 14" }] };
const html = S.statBlockHtml(m);
console.log(strip(S.sbPlateHtml(m)), "| the rank's color:", S.sbPlateHtml(m).includes("rk-elite"));
console.log(strip(html.slice(0, html.indexOf('<div class="sb-body">'))));
console.log("bands:", [...html.matchAll(/<div class="sb-band">([A-Za-z]+)/g)].map(x => x[1]).join(", "), "| the Elite's pips 2 of 3:", (html.match(/<i class="on"><\/i>/g) ?? []).length, "| a rung not reached is dim:", html.includes('class="sb-rung off"'), "| + Add on each:", (html.match(/data-action="newAction"/g) ?? []).length);
console.log("the Attributes roll:", html.includes('data-action="rollAttr" data-key="body"'), "| no Actions:", strip(S.statBlockHtml({ ...m, groups: [] })).includes("No Actions yet"));
console.log("--- the wiring");
const tw = src("module/twod12.mjs"), as = src("module/actor-sheets.mjs"), tpl = src("templates/actor-sheet-pc.hbs");
console.log("registered, not the default:", tw.includes('registerSheet(Actor, "twod12", NpcStatBlockSheet, { types: ["npc"], makeDefault: false'), "| a world setting for new NPCs:", tw.includes('"npcSheetDefault"') && tw.includes('"flags.core.sheetClass": "twod12.NpcStatBlockSheet"'));
console.log("Main, Build, Effects, Notes:", as.includes('tabs: [{ k: "main", l: "Main", n: 0 }, { k: "builder", l: "Build", n: 0 }, { k: "effects", l: "Effects", n: effN }, { k: "notes", l: "Notes", n: 0 }]'), "| opens on Main:", /class NpcStatBlockSheet[\s\S]*_activeTab = "main";/.test(as), "| no head, strip or side panel:", (tpl.match(/\{\{#unless pc\.statblock\}\}/g) ?? []).length >= 2);
