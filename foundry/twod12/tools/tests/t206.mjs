// Run with: node tools/tests/run.mjs (or node tools/tests/t206.mjs)
// v0.0.267 (Lucas's test of v0.0.266): a Grant's line runs by itself after the damage (its chips on the chain, gated by the Tier or the Critical);
// the hover card says what an effect does; a cover level the Action ignores is a small notice, not a chip to untick; the Boons on the granted-use notice.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u1" } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const F = await import(ROOTURL + "module/freeuse.mjs");
const I = await import(ROOTURL + "module/inline.mjs");
const U = await import(ROOTURL + "module/util.mjs");
const v = { ap: 1, noTiers: false, x1: "", x2: "", x3: "", critical: "", effects: "A shot.", after: "" };
const g = { on: "t2", does: "text", text: "The target is @Condition[hindered|rounds:eot]{Hindered (EoT)}.", on2: "crit", does2: "text", text2: "The target is also @Move[pushed|distance:2]{Pushed 2}." };
console.log("the chain:", F.withGrantLine(v, g).after);
console.log("a Tier 1 line adds no gate:", F.withGrantLine(v, { on: "t1", does: "text", text: "@Condition[prone]" }).after, "| any result:", F.withGrantLine(v, { on: "all", does: "text", text: "@Condition[prone]" }).after, "| a no-tier Version keeps no chain:", F.withGrantLine({ ...v, noTiers: true }, g).after);
console.log("tier:2 parsed:", I.parseInline("Condition", "hindered|rounds:eot|tier:2").tier, "| crit:", I.parseInline("Condition", "prone|crit:yes").crit);
const il = src("module/inline.mjs");
console.log("the chain filters its targets by the Tier and the Critical:", il.includes("if (cfg.tier || cfg.crit) { targets = (targets ?? []).filter(t => t.tier === undefined ? true : (!cfg.tier || (Number(t.tier) || 0) >= cfg.tier) && (!cfg.crit || t.crit)); if (!targets.length) continue; }"));
console.log("the hover card's what line:", U.fxTipHtml({ name: "Aim (Weapon Attack, 1 Boon)", what: "grants Weapon Attack ×1, free, 1 Boon · ignores Low cover" }));
const ac = src("module/actions.mjs");
console.log("the cover notice and the Boons on the granted-use notice:", ac.includes('coverNotices.push({ text: `${cov.label} ignored`, icon: "fa-shield-halved"') && ac.includes("...coverNotices") && ac.includes("${opts.grant.grant?.boons ? `, ${opts.grant.grant.boons} Boon"));
console.log("the hover sites pass what:", src("module/effects.mjs").includes("what: effectWhat(e)") && src("module/effects.mjs").includes("what: effectWhat(fx)") && src("module/actor-sheets.mjs").includes("what: effectWhat(e)") && ac.includes("what: effectWhat(it)"));
