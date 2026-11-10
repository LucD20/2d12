// Run with: node tools/tests/run.mjs (or node tools/tests/t231.mjs)
// v0.0.339 (Lucas: "run these fixes", foundry/mockups/action-props-review.md): a Version with an "After the damage" chain keeps the book's words where
// the chain does the thing (no second button), the per-card text overrides are gone, Open Season's Vulnerable is its chain, a Reaction an Aura
// brings reaches as far as the Aura, "only a creature you threaten" is off the Action sheet.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.foundry = { utils: {} }; globalThis.Hooks = { on() {} };
const C = await import(ROOTURL + "tools/content.mjs");
const G = await import(ROOTURL + "tools/cardgen.mjs");
console.log("the chain's kinds:", [...G.chainKinds("@Move[pushed|distance:1|t1:2] @Pause[After] @Condition[frightened|rounds:1|tier:1] @Book[Push]")].join(", "));
console.log("chips the chain does become words, the others stay:", G.plainChips("You gain @Guard[1d8+mod]{Guard 1d8 + [Mod]} in a @Template[emanation|distance:2] and are @Move[pushed|distance:1]; @Condition[vulnerable|value:2|eot]. @Heal[3d6]{Heal 3d6}", new Set(["Guard", "Move", "Condition", "Heal"])));
const v = (n, k = 0) => C.docs.find(d => d.type === "action" && d.name === n).system.versions[k];
for (const [n, f] of [["Rebuke", "x1"], ["Heartseeker", "x3"], ["Marksman's Shot", "critical"], ["Word of Radiance", "x3"], ["Word of Radiance", "critical"], ["Bulwark of Faith", "effects"], ["Open Season", "effects"]])
  console.log(`${n} ${f}: ${v(n)[f]} | no button the chain does: ${![...String(v(n)[f]).matchAll(/@(\w+)\[/g)].some(m => G.chainKinds(v(n).after).has(m[1]))}`);
console.log("Open Season's chain:", v("Open Season").after, "| rank:", C.docs.find(d => d.name === "Open Season" && d.type === "action").system.automation);
const cards = ["paladin", "archer", "gear"].map(f => fs.readFileSync(ROOT + `../../book/cards/${f}.json`, "utf8")).join("");
console.log("the per-card text overrides left (only Lock & Loose's: its Hindered is an Effect by Tier, not a chain):", [...cards.matchAll(/"foundry": \{\s*"(x[123]|critical)": "([^"]{0,40})/g)].map(m => `${m[1]}: ${m[2]}`).join(" | "));
const mo = fs.readFileSync(ROOT + "module/moment.mjs", "utf8"), sh = fs.readFileSync(ROOT + "templates/item-sheet.hbs", "utf8");
console.log("a Reaction an Aura brings reaches as far as the Aura:", mo.includes("const range = auraOf || Number(item.system.momentRange) || 0;"), "| 'only a creature you threaten' only while on:", sh.includes("{{#if system.momentThreat}}<label"));
