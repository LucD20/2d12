// Run with: node tools/tests/run.mjs (or node tools/tests/t133.mjs)
// v0.0.159 (Archer pass 2): Save Actions. You don't roll; each target rolls the Save on the Vs. line against 11 + your Modifier, Tier 1 the worst for them,
// [Mod] on Tier 1 and 2; Vulnerable banes and Cover boons; the area remembers the Save for [HT]; the Hazardous Terrain Region behavior.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } }; globalThis.CONST = { TOKEN_DISPOSITIONS: {} }; globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null };
const I = await import(ROOTURL + "module/inline.mjs");
const G = await import(ROOTURL + "module/config.mjs");
const S = await import(ROOTURL + "module/rollsource.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const ALLDOCS = [...C.docs, ...C.OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
const get = n => ALLDOCS.find(d => d.name === n);
const sys = { attributes: { body: 1, mind: 0, appeal: 0, instinct: 3 }, weaponAttribute: "instinct", weaponMod: 3, powerAttribute: "mind", powerMod: 1 };
for (const n of ["Volley", "Rain of Arrows"]) {
  const d = get(n), it = { ...d.system, traits: new Set(d.system.traits) };
  const src = S.rollSource(sys, it), v = it.versions[0];
  const cfg = I.saveActionCfg({ uuid: "Actor.a", system: sys }, { name: n, system: it }, v, src);
  console.log(`${n}: ${G.vsText(it)} DC ${cfg.dc} | T1 ${cfg.tiers.t1} | T2 ${cfg.tiers.t2} | T3 ${cfg.tiers.t3}`);
  console.log("  parsed T1:", JSON.stringify(I.parseParts(cfg.tiers.t1)));
}
const sh = n => { const d = get(n); return { ...d.system, traits: new Set(d.system.traits) }; };
console.log("area text: Volley", JSON.stringify(G.areaConfigOf(sh("Volley"))), "| Rain", JSON.stringify(G.areaConfigOf(sh("Rain of Arrows"))));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), hz = src("module/hazard.mjs"), tpl = src("module/template.mjs"), main = src("module/twod12.mjs"), sj = JSON.parse(src("system.json")), data = src("module/data.mjs");
console.log("you don't roll a Save Action:", act.includes("if (mod !== null && !version.noTiers && !saveAct && multi)") && act.includes("} else if (mod !== null && !version.noTiers && !saveAct)"), "| a Save card for the creatures in the area:", act.includes("await postSaveFor(cfg, targets, { point, source: item.name })"), "| no automatic [Mod] on Tier 2-3:", act.includes('attrMode: saveAct ? "none" : src.attrMode'));
console.log("Save card: posted with nobody in the area", inl.includes('"no creature is in the area."'), "| Vulnerable banes and Cover boons per target", inl.includes("out.bane += v") && inl.includes("coverFromPoint(point, tokenDoc.object)"), "| start in the Save dialog", inl.includes("boons: (cfg.boon || 0) + (row.boon || 0)"));
console.log("[HT] repeats the Save:", hz.includes("await postSaveFor(ht.save, [{ uuid: tokenDoc.uuid, name: tokenDoc.name }]"), "| no double Save when it appears:", hz.includes("region.getFlag(F, \"ht\").appearHandled) return;") && tpl.includes("appearHandled: !!cfg.htSave"), "| the area knows the Save:", act.includes("save: cfg, point, hits"));
console.log("Region behavior: registered", main.includes("registerHazardBehavior();") && hz.includes("CONFIG.RegionBehavior.dataModels.hazard = HazardBehavior;"), "| declared", JSON.stringify(sj.documentTypes.RegionBehavior), "| the area has it", tpl.includes('type: "hazard", name: "Hazardous Terrain"'), "| named after the Action", tpl.includes("`${flags.twod12.ht.name} [HT: ${patternText(data.ht)}]`"), "| triggers read it", hz.includes("function hazardData(region)"));
console.log("within your weapon's range:", data.includes("`Your weapon's ${c.withinRange} range`") && act.includes('areaSet.withinRange === "normal" ? nums[0]'));
// v0.0.160: a Save card rolls each Tier's damage when it appears (once), shows it, and every creature on a Tier takes that roll
console.log("Tiers rolled when the card appears:", inl.includes("tierDmg: await prerollTiers(cfg) };   // each Tier's damage rolled once, now") && inl.includes("tierDmg: await prerollTiers(cfg) };\n"), "| shown on the card:", inl.includes("rolled ? await tierRolled(parts, rolled) : await tierSummary(parts)"), "| a creature takes its Tier's roll:", inl.includes("const shared = st.tierDmg?.[`t${chk.tier}`] ?? null;"));
