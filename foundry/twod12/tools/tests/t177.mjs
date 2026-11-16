// Run with: node tools/tests/run.mjs (or node tools/tests/t177.mjs)
// Pack CS (2026-11-03): one source for every card (book/cards/*.json). The three targets (the book, Foundry, the ruler) read the same files,
// so they cannot disagree; this test fails when a card is missing somewhere or an extra contradicts the core:
//   - module/basic-data.mjs (generated from the Basic Action cards) is up to date;
//   - every card with a Foundry key (foundry.basic) is a Basic Action and the other way round; every Basic Action card the book shows is placed
//     in its chapter with @@CARD:Name@@, and no chapter still writes a card the files have by hand;
//   - every tier reads as damage or as text, with Foundry's parser and the ruler's; every Version's ruler string parses;
//   - a Foundry extra never repeats a core field (tiers, cost, traits, Frequency).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const { loadCards, cardSystem, featureSystem, talentSystem, basicEntry, isAction } = await import(ROOTURL + "tools/cardgen.mjs");
const { actors } = await import(ROOTURL + "tools/content.mjs");
const { docs, uuidOf, CARDS, resolveRefs } = await import(ROOTURL + "tools/content.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
const S = await import(ROOTURL + "../../book/ruler/spec.mjs");

const cards = loadCards();
console.log("cards:", cards.length, "| files:", [...new Set(cards.map(c => c._file))].join(", "));

console.log("--- the generated Basic Actions");
const check = spawnSync(process.execPath, [ROOT + "tools/gen-basic.mjs", "--check"], { encoding: "utf8" });
console.log("module/basic-data.mjs up to date:", check.status === 0, (check.stdout + check.stderr).trim());
const basics = cards.filter(c => c.foundry?.basic);
console.log("Basic Action cards:", basics.length, "| keys in basic-data.mjs:", Object.keys(BASIC_ACTIONS).length, "| the same set:", JSON.stringify(basics.map(c => c.foundry.basic).sort()) === JSON.stringify(Object.keys(BASIC_ACTIONS).sort()));
console.log("every Basic Action card is a Basic Action:", basics.every(c => c.category === "Basic Action"), "| every card in basic-actions.json has a key:", cards.filter(c => c._file === "basic-actions.json").every(c => c.foundry?.basic));
console.log("the generator gives the data of the file:", basics.every(c => JSON.stringify(basicEntry(c)) === JSON.stringify(BASIC_ACTIONS[c.foundry.basic])));

console.log("--- the book places every card it shows");
const srcDir = ROOT + "../../book/rules-src/";
const chapters = fs.readdirSync(srcDir).filter(f => /^\d\d-.*\.md$/.test(f)).map(f => [f, fs.readFileSync(srcDir + f, "utf8")]);
const placed = new Map();
for (const [f, t] of chapters) for (const m of t.matchAll(/^@@CARD:(.+?)@@[ \t]*$/gm)) placed.set(m[1].trim(), [...(placed.get(m[1].trim()) ?? []), f]);
// Stage 0 into the book (2026-11-12): the cards set aside (book/cards/set-aside.txt: the Talents and Opportunity Attack) stay in the card files and in the
// system, and no chapter places them for now.
const aside = new Set(fs.readFileSync(ROOT + "../../book/cards/set-aside.txt", "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#")));
// The card Structure (2026-11-16): the book also reads book/cards/stage0/*.json (the redesigned classes), a card there taking the place of the old card of its name;
// Foundry and the ruler read only the old files until the Foundry pass.
const s0dir = ROOT + "../../book/cards/stage0/";
const stage0 = fs.existsSync(s0dir) ? fs.readdirSync(s0dir).filter(f => f.endsWith(".json")).flatMap(f => JSON.parse(fs.readFileSync(s0dir + f, "utf8")).cards.map(c => c.name)) : [];
const shown = cards.filter(c => c.book !== false && !aside.has(c.name));
console.log("set aside:", aside.size, "| each is a card:", [...aside].every(n => cards.some(c => c.name === n)), "| none is placed:", [...aside].every(n => !placed.has(n)));
console.log("shown in the book:", shown.length, "| placed once:", shown.every(c => placed.get(c.name)?.length === 1), "| markers with no card:", [...placed.keys()].filter(n => !cards.some(c => c.name === n) && !stage0.includes(n)).join(", ") || "none", "| stage0 cards, each placed once:", stage0.length, stage0.every(n => placed.get(n)?.length === 1));
const byHand = [];
for (const [f, t] of chapters) for (const m of t.matchAll(/<div class="action-head"><span>(.*?)<\/span>/g)) if (cards.some(c => c.name === m[1])) byHand.push(`${f}: ${m[1]}`);
console.log("cards of the files still written by hand in a chapter:", byHand.join(", ") || "none");
console.log("a card the book does not show (book: false):", cards.filter(c => c.book === false).map(c => c.name).join(", ") || "none");

const problemsEarly = [];
console.log("--- the compendium items are the cards (content.mjs reads book/cards)");
const compendium = cards.filter(c => !c.foundry?.basic && c.foundry !== false);   // v0.0.360: foundry: false = a card kept only for the ruler
const bad = [];
const same = (have, mine, what) => { const a = { ...have }, b = { ...mine }; delete a.escalationPassive; delete b.escalationPassive; for (const k of ["rules", "rulesOn", "ends", "autoHover"]) { delete a[k]; delete b[k]; }   // v0.0.323: the rules are read from the settings (content.mjs)
  if (JSON.stringify(a) !== JSON.stringify(b)) bad.push(what); };
const one = (c, type, mine) => { const have = docs.filter(d => d.name === c.name && d.type === type); if (have.length !== 1) bad.push(`${c.name}: ${have.length} ${type} items`); else same(have[0].system, mine, `${c.name}: the ${type} item differs from the card`); };
for (const c of compendium) {
  if (c.npc) { const a = actors.find(x => x.name === c.npc), it = a?.items.filter(i => i.name === c.name && i.type === "action") ?? []; if (it.length !== 1) bad.push(`${c.name}: ${it.length} on ${c.npc}`); else same(it[0].system, cardSystem(c, resolveRefs), `${c.name}: the NPC's item differs from the card`); continue; }
  if (isAction(c)) one(c, "action", cardSystem(c, resolveRefs));
  if (c.talent) one(c, "talent", talentSystem(c, resolveRefs)); else if (!isAction(c)) one(c, "feature", featureSystem(c, resolveRefs));
  if (c.weapon) { const w = docs.find(d => d.type === "weapon" && d.name.toLowerCase() === c.weapon.toLowerCase()); if (w && !(w.system.actions ?? []).includes(uuidOf("actions", c.name))) bad.push(`${c.name}: not on its weapon`); }
}
const noWeapon = cards.filter(c => c.weapon && !docs.some(d => d.type === "weapon" && d.name.toLowerCase() === c.weapon.toLowerCase())).map(c => `${c.name} (${c.weapon})`);
console.log("compendium cards:", compendium.length, "| one item each, equal to the card:", bad.length ? bad.join("; ") : "all", "| CARDS exported:", CARDS.length === cards.length);
console.log("Techniques whose weapon is not in the compendium yet (information, for pack X):", noWeapon.length, noWeapon.length ? `(${noWeapon.slice(0, 3).join(", ")}...)` : "");
if (bad.length) problemsEarly.push(...bad);
console.log("--- every card reads for Foundry and the ruler");
const problems = [...problemsEarly];
for (const c of cards) {
  try { if (isAction(c)) cardSystem(c); else featureSystem(c); if (c.talent) talentSystem(c); } catch (e) { problems.push(`${c.name}: Foundry: ${e.message}`); }
  for (const k of ["tiers", "ap", "traits", "frequency", "effects", "name", "cost"]) if (c.foundry?.[k] !== undefined) problems.push(`${c.name}: foundry.${k} repeats a core field`);
  for (const v of c.versions ?? []) for (const k of ["tiers", "ap", "effects"]) if (v.foundry?.[k] !== undefined) problems.push(`${c.name} ${v.ap} AP: foundry.${k} repeats a core field`);
}
try { const lines = S.cardLines(cards); S.parseSpec(`class X\n${lines.join("\n")}\n`, "book/cards"); console.log("ruler lines:", lines.length, "| they parse:", true); }
catch (e) { problems.push(`ruler: ${e.message}`); }
console.log("problems:", problems.length ? problems.join(" ; ") : "none");
if (problems.length || check.status !== 0 || byHand.length) throw new Error("the card files and their targets disagree (see above)");
