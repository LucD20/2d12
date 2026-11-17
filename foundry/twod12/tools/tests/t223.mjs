// Run with: node tools/tests/run.mjs (or node tools/tests/t223.mjs)
// v0.0.322 (Lucas: the Card button's card in the new design): buildSoloCard, the sheet's new card (v0.0.297) with a title line, used by the chat's
// Card button, the Action sheet's preview, a condensed row's hover card, the class window and the older sheets' panels; and none of them uses the
// old card (buildRawCard) any more. Built from the real Smite and a Feature of the packs (build the packs first).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const enrichHTML = async t => String(t ?? "").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@(\w+)\[([^\]]*)\](?:\{([^}]*)\})?/g, (m, k, body, lab) => lab ?? body.split("|")[0]);
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, combat: null, user: { getFlag: () => undefined } };
globalThis.fromUuid = async () => null;
const { buildSoloCard, soloTitle } = await import(ROOTURL + "module/actioncard.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const asItem = d => ({ id: d._id, name: d.name, type: d.type, getFlag: (s, k) => d.flags?.twod12?.[k],
  system: { ...d.system, traits: new Set(d.system.traits ?? []), versions: d.system.versions ?? [] } });
const pack = n => fs.readdirSync(ROOT + "packs/_source/" + n).map(f => JSON.parse(src(`packs/_source/${n}/${f}`)));

console.log("--- the title line");
console.log(txt(soloTitle("Smite", "1/2/3 AP")), "|", txt(soloTitle("Lay On Hands")));

console.log("--- Smite's solo card (no creature: as written, no Use buttons)");
const smite = asItem(JSON.parse(src("packs/_source/actions/smite.action.json")));
const sm = await buildSoloCard(smite);
console.log("starts with the new card:", /^\s*<div class="twod12 acard d2/.test(sm), "| its title first:", /acard d2[^>]*>\s*<div class="ap-title"><b>Smite<\/b><span class="ap-tcost">Encounter · 2 AP<\/span>/.test(sm));
console.log("no Use buttons:", !/ap-vbtn/.test(sm), "| no \"Your roll\" strip:", !/st-live/.test(sm), "| the Tier lines (v0.0.411):", /<b>Tier 2<\/b>/.test(sm), "| the Flavor:", /st-flavor/.test(sm));

console.log("--- a Feature's solo card");
const feat = pack("features").filter(d => d.system).map(asItem).find(i => i.type === "feature" && String(i.system.description ?? "").length > 20);
const fc = await buildSoloCard(feat);
console.log(`${feat ? "a Feature" : "no Feature found"}: the feature card:`, /acard d2 st feat/.test(fc), "| titled \"Feature\":", /<span class="ap-tcost">Feature<\/span>/.test(fc));

console.log("--- where the new card is used (the old buildRawCard stays only for posting to the chat)");
for (const f of ["module/ccdamage.mjs", "module/item-sheet.mjs", "module/classwindow.mjs", "module/actor-sheets.mjs"])
  console.log(f.padEnd(26), "buildSoloCard:", (src(f).match(/buildSoloCard/g) ?? []).length, "| buildRawCard:", (src(f).match(/buildRawCard/g) ?? []).length);
