// Run with: node tools/tests/run.mjs (or node tools/tests/t231.mjs)
// v0.0.339 to v0.0.341 (Lucas: "run these fixes"; "just make buttons normally"): the Tier text keeps its normal buttons and the "After the damage"
// chain does the same thing by itself (no marker, no state); the per-card text overrides are gone; Open Season's Vulnerable is its chain; a
// Reaction an Aura brings reaches as far as the Aura; "only a creature you threaten" is off the Action sheet.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.foundry = { utils: {} }; globalThis.Hooks = { on() {} };
const C = await import(ROOTURL + "tools/content.mjs");
const ALLDOCS = [...C.docs, ...C.OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
const v = (n, k = 0) => ALLDOCS.find(d => d.type === "action" && d.name === n).system.versions[k];
for (const [n, f] of [["Rebuke", "x1"], ["Heartseeker", "x3"], ["Marksman's Shot", "critical"], ["Word of Radiance", "x3"], ["Bulwark of Faith", "effects"], ["Open Season", "effects"]])
  console.log(`${n} ${f}: ${v(n)[f]} | its chain: ${v(n).after}`);
const all = JSON.stringify(ALLDOCS.filter(d => d.type === "action").map(d => d.system.versions));
console.log("no chain marker left:", !all.includes("chain:yes"), "| no state module:", !fs.existsSync(ROOT + "module/chainchips.mjs"));
const cards = ["paladin", "archer", "gear"].map(f => fs.readFileSync(ROOT + `../../book/cards/${f}.json`, "utf8")).join("");
console.log("the per-card text overrides left (only Lock & Loose's: its Hindered is an Effect by Tier, not a chain):", [...cards.matchAll(/"foundry": \{\s*"(x[123]|critical)": "([^"]{0,40})/g)].map(m => `${m[1]}: ${m[2]}`).join(" | "));
const mo = fs.readFileSync(ROOT + "module/moment.mjs", "utf8"), sh = (fs.readFileSync(ROOT + "templates/item-sheet.hbs", "utf8") + fs.readFileSync(ROOT + "module/actionsheet.mjs", "utf8"));
console.log("a Reaction an Aura brings reaches as far as the Aura:", mo.includes("const range = auraOf || Number(item.system.momentRange) || 0;"), "| 'only a creature you threaten' only while on:", sh.includes('s.momentThreat ? ["Old"'));
console.log("ranks:", ["Word of Radiance", "Bulwark of Faith", "Rebuke", "Heartseeker", "Open Season"].map(n => `${n} ${ALLDOCS.find(d => d.type === "action" && d.name === n).system.automation}`).join(", "));
