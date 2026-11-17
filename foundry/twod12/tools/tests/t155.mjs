// Run with: node tools/tests/run.mjs (or node tools/tests/t155.mjs)
// v0.0.190 (Lucas's test of v0.0.189): the targeting banner's buttons, the automation diamond, Update from the compendium,
// the Details tab of a locked compendium item, the compendiums unlocked once, click a portrait to roll initiative.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const R = await import(ROOTURL + "module/refresh.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- Update from the compendium: what a copy keeps");
console.log("class:", JSON.stringify(R.mergedSystem("class", { chosenA: "", rallyMod: 6, levels: [1] }, { chosenA: "body", rallyMod: 4, levels: [] })));
console.log("weapon:", JSON.stringify(R.mergedSystem("weapon", { wielded: false, damage: "new" }, { wielded: true, damage: "old" })));
console.log("talent (keeps nothing of its own system):", JSON.stringify(R.mergedSystem("talent", { group: "combat", level: 1 }, { group: "magic", level: 3 })));
const rf = src("module/refresh.mjs"), main = src("module/twod12.mjs");
console.log("matched by sourceUuid or compendium source, then by name:", rf.includes('item.getFlag?.(F, "sourceUuid") || item._stats?.compendiumSource'), "| world items first:", rf.indexOf("for (const it of game.items") < rf.indexOf("for (const a of allActors())"), "| unlinked tokens too:", rf.includes("!t.actorLink && t.actor"),
  "| asked once per version:", rf.includes('game.settings.get(F, "refreshAskedFor")'), "| settings button:", rf.includes('registerMenu(F, "refreshMenu"'), "| macro:", main.includes("refreshFromCompendium: (opts = {})"));
console.log("--- the rest");
const act = src("module/actions.mjs");   // v0.0.413: targeting.mjs (unused since v0.0.392) is in foundry/deprecated/
console.log("automation diamond:", src("module/config.mjs").includes('`<i class="fa-solid fa-diamond autodia auto-${rank}"'));
console.log("locked compendium: tabs still work:", src("module/item-sheet.mjs").includes(`if (!this.isEditable) this.element.querySelectorAll(".tabbtn, [data-action='openLinked']")`) && src("templates/item-sheet.hbs").includes('<a class="tabbtn" role="tab" data-action="switchTab" data-tab-target="details">'), "| the system compendiums unlocked by a world setting (v0.0.191):", src("module/basic.mjs").includes('cfg[p.collection] = { ...(cfg[p.collection] ?? {}), locked: false };') && src("module/twod12.mjs").includes('register("twod12", "unlockPacks"'), "| GM / Assistant edit only:", src("system.json").includes('"PLAYER": "OBSERVER"'));
const car = src("module/carousel.mjs");
console.log("click a portrait with no initiative to roll it:", car.includes("combat.rollInitiative([c.id]); return;"), "| marked:", car.includes('${noInit ? "noinit" : ""}'));
