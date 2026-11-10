// Run with: node tools/tests/run.mjs (or node tools/tests/t231.mjs)
// v0.0.339 / v0.0.340 (Lucas: "run these fixes"; "let me see how it looks with the buttons aware"): a Version with an "After the damage" chain keeps
// its buttons, marked chain:yes (chainchips.mjs shows them waiting, done or by hand), the per-card text overrides are gone, Open Season's Vulnerable
// is its chain, a Reaction an Aura brings reaches as far as the Aura, "only a creature you threaten" is off the Action sheet.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.foundry = { utils: {} }; globalThis.Hooks = { on() {} };
const C = await import(ROOTURL + "tools/content.mjs");
const G = await import(ROOTURL + "tools/cardgen.mjs");
console.log("the chain's kinds:", [...G.chainKinds("@Move[pushed|distance:1|t1:2] @Pause[After] @Condition[frightened|rounds:1|tier:1] @Book[Push]")].join(", "));
console.log("the chips the chain does are marked, the others stay:", G.markChips("You gain @Guard[1d8+mod]{Guard 1d8 + [Mod]} in a @Template[emanation|distance:2] and are @Move[pushed|distance:1]; @Condition[vulnerable|value:2|eot].", new Set(["Guard", "Move", "Condition"])));
const CH = await import(ROOTURL + "module/chainchips.mjs");
const row = (applied, landed, chainDone) => ({ applied: applied ? { landed, chainDone } : null });
console.log("the states:", JSON.stringify({ noDamageYet: CH.chainStateOf([]), notApplied: CH.chainStateOf([{ rows: [row(false)] }]), chainRan: CH.chainStateOf([{ rows: [row(true, true, true), row(false)] }]), didNotLand: CH.chainStateOf([{ rows: [row(true, false, false)] }]),
  nonRollWaiting: CH.chainStateOf([], { steps: [{ k: 0 }], afterDone: [] }), nonRollDone: CH.chainStateOf([], { steps: [{ k: 0 }], afterDone: ["0|"] }) }));
const v = (n, k = 0) => C.docs.find(d => d.type === "action" && d.name === n).system.versions[k];
for (const [n, f] of [["Rebuke", "x1"], ["Heartseeker", "x3"], ["Marksman's Shot", "critical"], ["Word of Radiance", "x3"], ["Word of Radiance", "critical"], ["Bulwark of Faith", "effects"], ["Open Season", "effects"]])
  console.log(`${n} ${f}: ${v(n)[f]} | every button the chain does is marked: ${[...String(v(n)[f]).matchAll(/@(\w+)\[((?:[^\[\]]|\[[^\[\]]*\])*)\]/g)].filter(m => G.chainKinds(v(n).after).has(m[1])).every(m => m[2].includes("chain:yes"))}`);
console.log("Open Season's chain:", v("Open Season").after, "| rank:", C.docs.find(d => d.name === "Open Season" && d.type === "action").system.automation);
const cards = ["paladin", "archer", "gear"].map(f => fs.readFileSync(ROOT + `../../book/cards/${f}.json`, "utf8")).join("");
console.log("the per-card text overrides left (only Lock & Loose's: its Hindered is an Effect by Tier, not a chain):", [...cards.matchAll(/"foundry": \{\s*"(x[123]|critical)": "([^"]{0,40})/g)].map(m => `${m[1]}: ${m[2]}`).join(" | "));
const mo = fs.readFileSync(ROOT + "module/moment.mjs", "utf8"), sh = fs.readFileSync(ROOT + "templates/item-sheet.hbs", "utf8");
console.log("a Reaction an Aura brings reaches as far as the Aura:", mo.includes("const range = auraOf || Number(item.system.momentRange) || 0;"), "| 'only a creature you threaten' only while on:", sh.includes("{{#if system.momentThreat}}<label"));
