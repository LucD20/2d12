// Run with: node tools/tests/run.mjs (or node tools/tests/t324.mjs)
// v0.0.527 (Lucas's decisions after playtests 8, 9 and 10, 2026-11-26; book/bestiary-design.md, "After playtests 8, 9 and 10"; book/rules-backlog.md,
// the top entry): PC Health +½ (the classes' high / low values), the creatures' damage about x2.36 and their Health a quarter more, Judge without its
// damage reduction, Feint's 1 / 2 Boons, no Rally Points for an NPC, and the one-time world migrations before v0.0.519 gone (F-033).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };
const C = await import(ROOTURL + "tools/content.mjs");

console.log("--- 1. PC Health +½ (the class items; the book's stat boxes and Chapter 4)");
for (const n of ["Paladin", "Archer"]) { const c = C.docs.find(d => d.type === "class" && d.name === n).system; console.log(`${n}: high ${c.healthHigh} / low ${c.healthLow} | Rally ${c.rallyMod}`); }
console.log("the book:", book("rules-src/12-paladin.md").includes("high 30, low 15"), book("rules-src/13-archer.md").includes("high 24, low 12"), book("rules-src/04-health.md").includes("Vigor 30 + 3 = **33**, Resolve 15 + 2 = **17**, Health Pool **50**"), book("rules-src/04-health.md").includes("A third of 41 is 14"));

console.log("--- 2. the creatures (book/cards/stage0/bestiary.json and the sheets)");
const npc = n => C.actors.find(a => a.name === n);
for (const n of ["Goblin Sneak", "Grave Wisp", "Orc Warrior", "Ogre Chieftain"]) {
  const a = npc(n), cu = a.system.custom ?? {};
  const dmg = list => (list ?? []).map(d => `${d.pool === "M" ? "[R]" : "[V]"} ${d.dice} ${d.subtype}`).join(" + ") || "-";
  const acts = (a.items ?? []).filter(i => i.type === "action" && !i.flags?.twod12?.basic && i.system?.versions?.length).map(i => { const v = i.system.versions[0]; return `${i.name}: ${[v.t1, v.t2, v.t3].map(dmg).join(" / ")}${v.critical ? ` | Critical ${v.critical}` : ""}${/bleed\|dmg:/.test(v.x3 ?? "") ? ` | Lingering ${String(v.x3).match(/bleed\|dmg:([^|\]]+)/)[1]}` : ""}${/@Damage\[/.test(v.effects ?? "") ? ` | Effect ${String(v.effects).match(/@Damage\[(.*?)\]\{/)[1]}` : ""}`; });
  console.log(`${n}: ${a.system.ticks ? `${a.system.ticks} ticks` : `Vigor ${cu.bodyHealth} Resolve ${cu.mindHealth} (Health ${cu.bodyHealth + cu.mindHealth})`}`);
  for (const x of acts) console.log("  ", x.slice(0, 160));
}
const ch14 = book("rules-src/14-bestiary.md");
console.log("Chapter 14: the fight lasts 3 to 4 rounds:", ch14.includes("- **It lasts 3 to 4 rounds.**"), "| the ranks' Health:", ["Health 22 (11 / 11)", "Health 45 (23 / 22)", "Health 90 (45 / 45)"].every(x => ch14.includes(x)), "| the Basic attacks:", ch14.includes("[V] 1d10 / 2 + 1d12") && ch14.includes("[V] 2 + 1d10! / 8 + 1d12!"), "| the Critical rows kept:", (ch14.match(/Critical: \[[VR]\] 1d10!/g) ?? []).length);

console.log("--- 3. Judge: no reduction (Lucas: \"I will remove the flat judged reduction\")");
const pal = JSON.parse(book("cards/stage0/paladin.json")).cards.find(c => c.name === "Judge");
console.log("the card:", pal.body[0].text, "| its Flavor:", pal.flavor);
console.log("Foundry: no reduction before the damage:", !src("module/damage.mjs").includes("judgeReductions") && !src("module/judge.mjs").includes("judgeReductions"), "| Profane kept:", src("module/judge.mjs").includes("export function isProfaneFor(source, target)"), "| Chapter 2 and 4 say nothing of it:", !book("rules-src/02-turns.md").includes("each of them can reduce its damage") && !book("rules-src/04-health.md").includes("Judge's and Shield of Faith's"));

console.log("--- 4. Feint: 1 Boon on a Tier 2, 2 Boons on a Tier 3");
const FX = await import(ROOTURL + "module/effects.mjs");
const made = [];
const pc = { uuid: "A.d", name: "Durgan", isOwner: true, effects: [], createEmbeddedDocuments: async (t, docs) => { made.push(...docs); return docs; } };
for (const tier of [2, 3]) { made.length = 0; await FX.applyFeintEffect(pc, { uuid: "A.o", name: "Orc Warrior" }, tier); const m = made[0]?.flags?.twod12?.modifiers?.[0] ?? {}; console.log(`Tier ${tier}: ${made[0]?.flags?.twod12?.description} | Boons ${m.boons} | Favored ${!!m.favored}`); }
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS.feint.versions[0];
console.log("the card:", BD.x2, "|", BD.x3);

console.log("--- 5. an NPC has no Rally Points (Lucas: \"Lets remove this rule\")");
console.log("its Rally Point heal:", src("module/data.mjs").includes("this.rallyHeal = 0; this.rallyMax = 0; this.rallyLeft = 0;"), "| refused:", src("module/rally.mjs").includes('if (actor?.type === "npc" || !s?.rallyMax)'), "| the book:", book("rules-src/04-health.md").includes("\n**NPCs** have no Rally Points.\n"));

console.log("--- 6. the one-time migrations before v0.0.519 gone (F-033)");
console.log("files gone:", ["module/migrater.mjs", "module/fxmigrate.mjs", "module/fixrules.mjs"].map(f => `${f.split("/")[1]} ${!fs.existsSync(ROOT + f)}`).join(", "));
const all = fs.readdirSync(ROOT + "module").filter(f => f.endsWith(".mjs")).map(f => src("module/" + f)).join("\n");
const gone = ["migratedR", "migratedMod", "migratedS0", "migratedF2", "migratedF3", "migratedMastery", "migratedWeapons", "migratedB5", "migratedFx", "releaseV118", "rallyV176", "settingsV186", "settingsV187", "settingsV207", "hearingAllV319", "worldPassV346", "worldPassV351", "worldPassDaunted", "projectileApplied", "weaponRoundApplied"];
console.log("settings left:", gone.filter(k => all.includes(`"${k}"`)).join(", ") || "none", `(of ${gone.length})`, "| kept: the in-memory readers", fs.existsSync(ROOT + "module/settingsmigrate.mjs"), "| the new-world defaults:", ["diagonalsApplied", "tokenDefaultsV215", "defaultSceneMade", "quickInsertOffered"].every(k => all.includes(`"${k}"`)));
console.log("the version:", JSON.parse(src("system.json")).version, "| its changelog entry:", src("docs/reference.md").includes("- **v0.0.527 (LUCAS'S DECISIONS AFTER PLAYTESTS 8, 9 AND 10"));
