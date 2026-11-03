// Run with: node tools/tests/run.mjs (or node tools/tests/t132.mjs)
// v0.0.157 (card layout): three meta-lines in fixed places, the Frequency in the title bar, no Check field, [HT] in the effect text.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).docs, cdoc = (n, t = "action") => CDOCS.find(d => d.name === n && d.type === t);   // v0.0.230 (pack CS): the cards are data (book/cards), read from the built content
import fs from "node:fs";
globalThis.foundry ??= { utils: {} };
const G = await import(ROOTURL + "module/config.mjs");
const lines = h => [...h.matchAll(/<div class="trow"><span>(.*?)<\/span><\/div>/g)].map(m => m[1].replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "✦").replace(/<[^>]+>/g, "").trim());
const show = (label, o) => console.log(`${label}:`, JSON.stringify(lines(G.metaRowHtml(o))));
show("Weapon Attack", { frequency: "atwill", targetText: "One creature", distance: "Weapon", vs: "AD" });
show("Call to Arms (Escalation)", { escalation: 1, frequency: "round", targetText: "One Down ally", distance: "3 sq." });
show("Volley (a Save)", { frequency: "encounter", targetText: "All creatures in the Area, you included", distance: "Area: 2 Emanation within your weapon's normal range", vs: "Instinct Save" });
show("Rimebrand (Self)", { frequency: "round", self: true, distance: "self", vs: "DC 13" });
show("nothing", { frequency: "daily" });
console.log("title bar:", G.cardHead("Smite", "Divine Power 1", "1AP", "round").replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"), "| no Frequency:", !G.cardHead("Release", "", "0AP", "").includes("afreq"));
console.log("no Check field:", !("checks" in G.TWOD12), "| checkAttr reads only the traits:", G.checkAttr({ check: "weapon", traits: new Set(["body"]) }));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const data = src("module/data.mjs"), isheet = src("templates/item-sheet.hbs"), content = src("tools/content.mjs");
console.log("Action data has no check:", !/\n\s+check: choice\(TWOD12\.checks\)/.test(data), "| the editor has no 'Other roll':", !isheet.includes("Other roll"));
// v0.0.188 (OT): Rain of Arrows and Covering Fire have no [HT] any more (the book's cards); Covering Fire keeps its area 3 rounds.
console.log("OT: no [HT] on Rain of Arrows and Covering Fire:", !content.includes("[HT: Entering"), "| Covering Fire kept 3 rounds:", (() => { const a = cdoc("Covering Fire").system.areaCfg; return a.withinRange === "normal" && a.targets === "all" && a.keep === true && a.rounds === 3; })());
console.log("Opportunity Attack makes a Weapon Attack:", cdoc("Opportunity Attack").system.versions[0].effects.includes("@Use[Weapon Attack|label:Weapon Attack (1A)]") && cdoc("Opportunity Attack", "talent").system.modifiers?.[0]?.when === "outOfTurn", "| Vow of Enmity 3 AP Tier 3:", content.includes('["1d6MH", "As 2 AP."]'));
// v0.0.158: "Distance:" written on the third line; the weapon is checked before an area is placed; windows step aside while placing
const act = src("module/actions.mjs"), tpl = src("module/template.mjs");
console.log("weapon checked before anything:", act.indexOf("A Weapon Action needs its weapon before anything else happens") < act.indexOf("areaConfigOf(it)"), "| windows minimized while placing, then back:", tpl.includes("const back = await stepAside();") && tpl.includes("finally { await back(); }"), "| Volley:", !content.includes("you included"));
