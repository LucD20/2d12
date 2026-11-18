// Run with: node tools/tests/run.mjs (or node tools/tests/t212.mjs)
// v0.0.289 (PACK SHEET): the pure pieces of the redesigned character sheet (module/sheetmodel.mjs).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const M = await import(ROOTURL + "module/sheetmodel.mjs");

console.log("--- the section of an Action (frequency, Reaction, Apex, Granted, Basic)");
const S = a => M.actionSection(a);
console.log("Smite (Round):", S({ frequency: "round" }), "| Holy Wrath (Encounter):", S({ frequency: "encounter" }), "| a Daily Pick:", S({ frequency: "daily" }), "| a Turn Action:", S({ frequency: "turn" }));
console.log("Rebuke (Reaction, Turn):", S({ reaction: true, frequency: "turn" }), "| Final Verdict (Escalation 3, Encounter):", S({ escalation: 3, frequency: "encounter" }), "| a Technique (At-will):", S({ frequency: "atwill" }), "| no Frequency:", S({}));
console.log("Opportunity Attack (a Basic Action):", S({ basic: true, basicKey: "opportunityAttack" }), "| Weapon Attack:", S({ basic: true, basicKey: "basicWeaponAttack", frequency: "atwill" }), "| a granted use:", S({ granted: true, reaction: true }));
console.log("the order:", M.SECTION_ORDER.join(" > "), "| Daily color:", M.SHEET_FREQ.daily.color);

console.log("--- Vs. an Attribute (13 + half, rounded up) and Save DCs (11 + the Modifier)");
console.log("Body +2 Mind +1 Appeal +1 Instinct +0:", JSON.stringify(M.vsDefenses({ body: 2, mind: 1, appeal: 1, instinct: 0 })), "| -1 / 3 / -2:", M.vsAttribute(-1), M.vsAttribute(3), M.vsAttribute(-2), "| a +1 bonus on Body:", M.vsDefenses({ body: 2 }, { body: 1 }).body);
console.log("Save DCs (Weapon +2, Power +2, Signature +3):", JSON.stringify(M.saveDCs({ weapon: 2, power: 2, signature: 3 })), "| no Modifier:", M.saveDC(undefined));

console.log("--- the Strikes counter, the cost pill and the Vs. column");
console.log(M.strikesLine(2), "|", M.strikesLine(0), "|", M.strikesLine("x"));
console.log("pills:", [M.costPill([1, 2, 3]), M.costPill([3, 2]), M.costPill([1], true), M.costPill([0]), M.costPill([2, 2]), JSON.stringify(M.costPill([]))].join(" , "));
console.log("Vs.:", ["AD", "WD", "Appeal Save", "Instinct Save", "Body Save", "DC 13", "", "Body or Instinct", "AD or WD", "the attribute rolled"].map(t => JSON.stringify(M.vsShort(t))).join(" "));
console.log("distance:", M.distanceShort("5"), "|", M.distanceShort("Self"), "|", M.distanceShort(""), "|", M.distanceShort("10/20/40"));

console.log("--- why a Basic Action can't be used");
const ok = { freeHand: true, reloadWeapon: true, prone: true, immobilized: true, speed: 5, reach: 2, down: false, rallyLeft: 3 };
for (const k of ["fists", "reload", "stand", "breakFree", "charge", "haul", "rally", "crawl", "advance"]) console.log(k.padEnd(9), "can:", JSON.stringify(M.basicUnavailable(k, ok)), "| can't:", JSON.stringify(M.basicUnavailable(k, {})));
console.log("Steel Yourself while Down:", M.basicUnavailable("rally", { down: true, rallyLeft: 3 }), "| next Banes:", JSON.stringify(M.nextBanes(0)), M.nextBanes(1), "/", M.nextBanes(2));

console.log("--- Bloodied / Strained, to Down, the Down state");
console.log("Vigor 23 Resolve 12, damage 9 / 5:", JSON.stringify(M.healthTags({ bdt: 23, mdt: 12, bodyDamage: 9, mindDamage: 5 })), "| 23 / 12:", JSON.stringify(M.healthTags({ bdt: 23, mdt: 12, bodyDamage: 23, mindDamage: 12 })), "| threshold 0:", JSON.stringify(M.healthTags({ bdt: 0, mdt: 0, bodyDamage: 0, mindDamage: 0 })));
console.log("to Down (pool 35):", M.toDown(35, 14), M.toDown(35, 35), M.toDown(35, 40));
const D = (s, st = []) => { const r = M.downState({ pool: 35, ...s }, new Set(st)); return r.down ? `${r.state}${r.kind ? ` (${r.kind}, ${r.check} Check)` : ""}` : "not Down"; };
console.log("34 damage:", D({ totalDamage: 34, bodyDamage: 34 }));
console.log("Vigor dominant, no Nonlethal:", D({ totalDamage: 37, bodyDamage: 26, mindDamage: 11 }), "| Resolve dominant:", D({ totalDamage: 36, bodyDamage: 10, mindDamage: 26 }), "| a tie:", D({ totalDamage: 36, bodyDamage: 18, mindDamage: 18 }));
console.log("Nonlethal half or more:", D({ totalDamage: 36, bodyDamage: 18, mindDamage: 18, nonlethal: 18 }), "| some Nonlethal:", D({ totalDamage: 36, bodyDamage: 30, mindDamage: 6, nonlethal: 6 }));
console.log("the condition decides once taken: Shattered:", D({ totalDamage: 37, bodyDamage: 26, mindDamage: 11 }, ["shattered"]), "| Desperate:", D({ totalDamage: 36, nonlethal: 6, bodyDamage: 30, mindDamage: 6 }, ["desperate"]));
console.log("collapsed note:", M.downState({ pool: 35, totalDamage: 37, bodyDamage: 26 }, new Set(["dying", "unconscious"])).note);
console.log("Dominant:", M.dominantPool(26, 11), M.dominantPool(5, 9), M.dominantPool(4, 4));
console.log("bars:", JSON.stringify(M.barSegments(9, 0, 23)), JSON.stringify(M.barSegments(0, 5, 12)), JSON.stringify(M.barSegments(20, 10, 23)), JSON.stringify(M.barSegments(30, 0, 23)));

console.log("--- the strip: AP pips, Escalation rungs, the hooks");
console.log("2 AP of 3, Slowed 1:", M.apPips(2, 3, 1).map(p => p.k).join(" "), "| 4 of 4:", M.apPips(4, 4, 0).map(p => p.k).join(" "), "| 0 of 2, Slowed 2:", M.apPips(0, 2, 2).map(p => p.k).join(" "));
console.log(M.escRungs(2, { 1: ["Radiant Zeal"], 2: ["Searing Blows"], 3: ["Reckoning"] }, true).map(r => `${r.label}${r.lit ? " (lit)" : ""}`).join(" | "));
console.log("hooks:", M.hooksLeft(["Kindled Wrath"], {}).join(" · "), "| crit used:", M.hooksLeft(["Kindled Wrath"], { crit: true }).join(" · "), "| both used:", JSON.stringify(M.hooksLeft(["Kindled Wrath"], { crit: true, hook: true })));

console.log("--- the Build tab: slots, the validator, the next levels");
console.log("labels:", M.slotLabel("Features"), "|", M.slotLabel("Hallmark Reaction"), "| ranks:", ["Escalation 1 Passive", "Escalation 3 Passive", "Apex", "Talent"].map(M.escSectionRank).join(" "));
const secs = { pal1core: { title: "Features", pick: 1, granted: true }, pal1react: { title: "Hallmark Reaction", pick: 1 }, pal1enc: { title: "Encounter Pick", pick: 1 }, pal1tal: { title: "Talent", pick: 1 } };
const cards = [
  { id: "dp", name: "Divine Power", kind: "feature", flags: { classLevel: 1, classSection: "pal1core", grantedBy: "class" } },
  { id: "kw", name: "Kindled Wrath", kind: "feature", flags: { classLevel: 1, classSection: "pal1core" } },
  { id: "rb", name: "Rebuke", kind: "action", flags: { classLevel: 1, classSection: "pal1react" }, createdTime: 20 },
  { id: "sf", name: "Shield of Faith", kind: "action", flags: { classLevel: 1, classSection: "pal1react" }, createdTime: 10 },
  { id: "hw", name: "Holy Wrath", kind: "action", flags: { classLevel: 1, classSection: "pal1enc" }, createdTime: 20 },
  { id: "bf", name: "Bulwark of Faith", kind: "action", flags: { classLevel: 1, classSection: "pal1enc" }, createdTime: 5 },
  { id: "hb", name: "Heavy Blows", kind: "talent", flags: { classLevel: 1, classSection: "pal1tal", slot: "class:1:pal1tal:0" } },
  { id: "ex", name: "Extra Talent (GM)", kind: "talent", flags: {} },
  { id: "wa", name: "Weapon Attack", kind: "action", flags: { basic: "basicWeaponAttack" } },
  { id: "rs", name: "Reaping Sweep", kind: "action", flags: {}, category: "Weapon Technique" },
  { id: "kid", name: "Beacon's Step", kind: "action", flags: { inlineOf: "fx1" } },
  { id: "orph", name: "Orphan", kind: "action", flags: { featureId: "gone" } },
  { id: "old", name: "Old Section Pick", kind: "action", flags: { classLevel: 1, classSection: "removed" } },
  { id: "man", name: "Dropped Feature", kind: "feature", flags: { grantedBy: "manual" } }
];
console.log("fill no slot:", M.slotless(cards, secs, id => id !== "gone").map(c => c.name).join(" · "));
const levels = [{ sections: [{ kind: "attr" }, { kind: "items", title: "Features" }, { kind: "talent", title: "Talent", pick: 1 }] }, { sections: [{ kind: "talent", title: "Talent", pick: 1 }] }, { sections: [{ kind: "repertoire", title: "Daily Pick", pick: 1 }, { kind: "talent", title: "Talent", pick: 1 }] }, { sections: [{ kind: "talent", title: "Talent", pick: 1 }] }];
console.log(M.nextLevels(1, levels, { at: 5, n: 2, health: [12, 6], guard: 3 }).map(l => `Level ${l.level} · ${l.text}`).join(" | "));
console.log("at level 6 (Stage 3 next, Modifiers +1):", M.nextLevels(6, levels, { at: 8, n: 3, health: [12, 6], guard: 4, modifiers: true }).map(l => `${l.level}: ${l.text}`).join(" | "));
console.log("enrichers on a hover line:", M.plainEnrichers("Lasts until the @Book[Escalation]{Escalation} ends; a @Check[mind|label:Mind Save] and @Condition[prone]."));

console.log("--- the template and the sheet use them");
const src = f => fs.readFileSync(ROOT + f, "utf8"), tpl = src("templates/actor-sheet-pc.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("the PC template:", sh.includes('template: "systems/twod12/templates/actor-sheet-pc.hbs"'), "| v0.0.291: the NPC uses it too:", (sh.match(/templates\/actor-sheet-pc\.hbs/g) ?? []).length === 2, "| v0.0.441: 540 x 840 and 760:", sh.includes("position: { width: 540, height: 840 }") && sh.includes("position: { width: 540, height: 760 }"));
console.log("tabs in order:", /\["actions", "Actions"\], \["effects", "Effects", [^\]]*\], \["items", "Items"\], \["build", "Build", [^\]]*\], \["mastery", "Mastery"\], \["upkeep", "Upkeep"\], \["notes", "Notes"\]/.test(src("module/pcsheet.mjs")), "| the favorites star first:", tpl.indexOf('data-tab-target="favorites"') < tpl.indexOf("{{#each pc.tabs}}"));
console.log("icon-only buttons have an aria-label:", (tpl.match(/<button[^>]*class="ps-icon"[^>]*>/g) ?? []).every(b => b.includes("aria-label")), "| disabled buttons say why:", (tpl.match(/aria-disabled="true"[^>]*/g) ?? []).every(b => /data-tooltip/.test(b)), "| focus visible:", css.includes(".twod12.sheet.pcs button:focus-visible"));
console.log("no default windows in the new code:", !/DialogV2/.test(src("module/pcsheet.mjs")) && !/DialogV2/.test(src("module/sheetmodel.mjs")) && !/DialogV2\./.test(src("module/rest.mjs").replace(/chooseRecovery[\s\S]*?\n}\n/, "")));
console.log("--- v0.0.290 (Lucas tested v0.0.289)");
console.log("the whole Action row opens its card:", tpl.includes('<div class="ps2-bar" data-action="toggleCard">'), "| Build rows expand (no hover card):", tpl.includes('<div class="ar ps-brw') && !src("module/pcsheet.mjs").includes("cardTip"), "| the Level only on the Build tab:", (tpl.match(/name="system\.level"/g) ?? []).length === 1 && tpl.indexOf('name="system.level"') > tpl.indexOf('data-tab="build"'));
