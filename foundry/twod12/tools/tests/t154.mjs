// Run with: node tools/tests/run.mjs (or node tools/tests/t154.mjs)
// v0.0.189 (Lucas's test of v0.0.188): the automation chip, bonus damage named by its source, targeting mode, the swap button, a combatant
// added mid-combat, Pinning Shot and Twin Shot as granted uses, Vanish for 1 round, the four compendium PCs.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {};
const cfg = await import(ROOTURL + "module/config.mjs");
const TG = await import(ROOTURL + "module/targeting.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- the automation chip");
console.log(["gold", "silver", "bronze", "none", ""].map(r => `${r || "(none)"}: ${cfg.autoChip(r).replace(/ data-tooltip="[^"]*"/, "") || "-"}`).join(" | "));
console.log("on the card head:", cfg.cardHead("Smite", "Divine Power 1", "", "", "gold").includes('autodia auto-gold'), "| the Features tab:", src("templates/actor-sheet.hbs").includes("{{name}}</span>{{{auto}}}"), "| the item sheets' select:", (src("templates/item-sheet.hbs").match(/name="system.automation"/g) ?? []).length + (src("module/fxsheet.mjs").includes('"@automation"') ? 1 : 0));   // v0.0.323: the Effect's is in the new tab
const count = {}; for (const d of C.docs) if (d.system.automation) count[d.system.automation] = (count[d.system.automation] ?? 0) + 1;
console.log("compendium ranks:", JSON.stringify(count), "| old cards have none:", !C.docs.some(d => /old cards/.test(d.folder ?? "") && d.system.automation));
console.log("--- bonus damage named by its source");
const act = src("module/actions.mjs"), dmg = src("module/dmgcard.mjs");
console.log("the card's bonus row links its source:", act.includes("<b>${srcLink(b.effect, b.srcUuid)}</b>"), "| no None type:", act.includes('${b.sub ? ` ${esc(TWOD12.subtypes[b.sub] ?? "")}` : ""}'), "| the damage card names it (not Untyped):", dmg.includes("const name = c.src ?"), "| passives carry the item's uuid:", src("module/passives.mjs").includes('srcUuid: it.getFlag?.(F, "sourceUuid") || it.uuid'));
console.log("--- targeting mode");
const T = (targets, traits = [], area = "") => ({ targets, traits: new Set(traits), area });
console.log("needs targets:", [T("One creature"), T("Two creatures"), T("The triggering creature"), T("One creature", ["self"]), T("All creatures in the Area", [], "2 Emanation"), T("Allies within 5 squares"), T("")].map(TG.needsTargets).join(" "));
console.log(TG.bannerText("Twin Shot", 2, 1));
console.log("wired:", act.includes("const pk = await pickTargets(need, item.name);") && act.includes("dc: opts.noTargetDc ?? dcInfo.dc,"));
console.log("--- combat");
const car = src("module/carousel.mjs");
console.log("swap shown with no ally left (the click warns):", car.includes('<button type="button" class="tp-swap'), "| a creature added mid-combat is shown:", car.includes("for (const c of combat.combatants) if (!turns.includes(c)) turns.push(c);"), "| Mastery only in combat:", src("module/mastery.mjs").includes("if (!c?.started ||"));
console.log("--- cards");
const fx = n => C.docs.find(d => d.type === "effect" && d.name === n);
console.log("Pinning Shot and Twin Shot grant the Weapon Attack:", ["Pinning Shot", "Twin Shot"].map(n => fx(n).system.settings.some(x => x.type === "grant" && x.grantAction === "Weapon Attack")).join(" "), "| Vanish for 1 round:", fx("Vanish (+1 Defense)").system.description);
for (const p of C.pcs) console.log(`${p.name} (level ${p.system.level}):`, p.items.filter(i => i.flags?.twod12?.classLevel && ["feature", "talent", "action"].includes(i.type)).map(i => i.name).join(", "));
