// Run with: node tools/tests/run.mjs (or node tools/tests/t132.mjs)
// v0.0.157 (card layout): three meta-lines in fixed places, the Frequency in the title bar, no Check field, [HT] in the effect text.
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
globalThis.foundry ??= { utils: {} };
const G = await import(ROOT + "module/config.mjs");
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
console.log("[HT] in the effect text: Rain of Arrows", content.includes("\"The area lasts 2 rounds [HT: Entering, Turn].\")]"), "| Covering Fire", content.includes("Lasts 2 rounds [HT: Entering]. Allies inside gain +1 Defense."));
console.log("Opportunity Attack makes a Weapon Attack:", content.includes("@Use[Weapon Attack|label:Weapon Attack (1A)]\")]\n}, \"Talents\")") && content.includes('spec: "Weapon Attack", when: "outOfTurn"'), "| Vow of Enmity 3 AP Tier 3:", content.includes('["1d6MH", "As 2 AP."]'));
// v0.0.158: "Distance:" written on the third line; the weapon is checked before an area is placed; windows step aside while placing
const act = src("module/actions.mjs"), tpl = src("module/template.mjs");
console.log("weapon checked before anything:", act.indexOf("A Weapon Action needs its weapon before anything else happens") < act.indexOf("areaConfigOf(it)"), "| windows minimized while placing, then back:", tpl.includes("const back = await stepAside();") && tpl.includes("finally { await back(); }"), "| Volley:", !content.includes("you included"));
