// Run with: node tools/tests/run.mjs (or node tools/tests/t183.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.243 (pack R-Foundry 1): the compendium follows: the hook Features carry the Escalation hook setting (gold), the species and classes the Health line;
// the migration on load (decision sheet item 23): the high side asked per character (Vigor by default), Escalation 1, no AP Guard, the cards refreshed, nothing deleted.
globalThis.foundry ??= { utils: {} }; globalThis.Hooks ??= { on() {} };
const C = await import(ROOTURL + "tools/content.mjs");
const doc = (n, t) => C.docs.find(d => d.name === n && d.type === t);
for (const n of ["Kindled Wrath", "Thrill of the Kill"]) { const f = doc(n, "feature"); console.log(`${n}: automation ${f.system.automation} | settings ${JSON.stringify(f.system.settings)} | text mentions "by hand": ${/by hand/i.test(f.system.description)}`); }
console.log("the species:", C.docs.filter(d => d.type === "species").map(d => `${d.name} V+${d.system.bodyMod} R+${d.system.mindMod}${d.system.pickHealth ? " (choice)" : ""}`).join(", "));
console.log("Slowed:", doc("Slowed", "effect").system.description.replace(/<[^>]+>/g, "").slice(0, 120) + "...");
const src = n => fs.readFileSync(ROOT + n, "utf8");
// the migration: pure part and wiring
const mig = src("module/migrater.mjs"); const fn = new Function(mig.slice(mig.indexOf("export function migrationUpdate"), mig.indexOf("/** The question")).replace("export function", "return function") + ";")();
console.log("migration updates: an old character:", JSON.stringify(fn({ healthHigh: "vigor", escalation: 0, apGuard: 0 }, "vigor")), "| high on Resolve, mid-encounter 2:", JSON.stringify(fn({ healthHigh: "vigor", escalation: 2, apGuard: 3 }, "resolve")), "| already there:", JSON.stringify(fn({ healthHigh: "resolve", escalation: 1, apGuard: 0 }, "resolve")));
console.log("asked once, after a backup reminder, with the existing refresh:", mig.includes('game.settings.register(F, "migratedR"') && mig.includes("Back up your world first") && mig.includes("refreshFromCompendium({ byName: true, basics: true })") && mig.includes('label: "Later"'), "| nothing deleted:", !/delete(Embedded)?Documents/.test(mig), "| the refresh question waits for it:", src("module/refresh.mjs").includes("if (needsMigrationR()) return;"), "| registered and a console tool:", src("module/twod12.mjs").includes("registerMigrationR()") && src("module/twod12.mjs").includes("migrateR: ()"));
console.log("the schema has the new fields:", ["apGuard: int(0, 0)", 'healthHigh: choice({ vigor: "Vigor", resolve: "Resolve" }, "vigor")', "pickHealth: bool()", "healthHigh: int(0, 0), healthLow: int(0, 0), stepHigh1: int(0, 0), stepLow1: int(0, 0), stepHigh2: int(0, 0)", 'hookWhen: choice(TWOD12.escHookWhen, "allyState"), hookRange: int(5, 0)'].every(s => src("module/data.mjs").includes(s)), "| the setting type in the editor:", src("module/fxrules.mjs").includes('case "eschook": add("esc"') && src("templates/parts/settings.hbs").includes("{{#if isEscHook}}"));
console.log("the version:", JSON.parse(src("system.json")).version, "| changelog entry:", src("docs/reference.md").includes("v0.0.243"), "| the copy matches:", src("docs/reference.md") === fs.readFileSync(ROOT + "../reference.md", "utf8"));
