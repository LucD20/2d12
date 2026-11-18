// Run with: node tools/tests/run.mjs (or node tools/tests/t276.mjs)
// v0.0.437 (pack CARD-ONE step 4; Lucas, 2026-11-18: "Start CARD-ONE step 4"): the stat block (the one-page NPC sheet) drawn from the card model;
// its printed look kept. The card gallery has its face (foundry-statblock-*), which shows every compendium card in it.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };
const C = await import(ROOTURL + "tools/content.mjs");
const SB = await import(ROOTURL + "module/statblock.mjs");
const all = [...C.docs, ...C.actors.flatMap(a => a.items ?? [])];
const item = n => { const d = all.find(x => x.name === n && x.type === "action"); return { id: n, name: d.name, getFlag: () => undefined, system: { ...d.system, traits: new Set(d.system.traits ?? []) } }; };
const enrich = async t => String(t ?? "");
const show = async n => { const m = await SB.sbActionModel(item(n), { enrich }); return `${n}: pre [${m.pre.map(x => x[0]).join(", ")}] | meta [${m.meta.map(x => x[0]).join(", ")}] | post [${m.post.map(x => x[0]).join(", ")}] | tiers ${m.tiers.map(t => `{${t.label}} ${t.rows.map(r => r.label).join(" / ")}`).join(" ; ")} | effects ${m.effects ? "yes" : "no"}`; };
for (const n of ["Rebuke", "Reckoning", "Smite", "Brutal Swing", "Avenge Kin", "Ground Slam", "Commandment", "Judge"]) console.log(await show(n));
const html = SB.sbActionHtml(await SB.sbActionModel(item("Rebuke"), { enrich }));
console.log("Rebuke's Trigger on its own row:", /<div class="sb-meta"><b>Trigger<\/b>/.test(html), "| a merged Tier line widens the labels:", html.includes('class="sb-tiers wide"'), "| \"Tier 1 or 2\":", html.includes(">Tier 1 or 2<"));
console.log("the gallery has the stat block face:", src("tools/gallery/shoot.mjs").includes('["statblock", ["statblock"]]'), "| statBlockModel uses sbActionModel:", src("module/statblock.mjs").includes("actions.push(await sbActionModel(i, { enrich, row: rows.get(i.id) ?? {}, escNow }));"));
