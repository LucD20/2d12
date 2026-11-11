// Run with: node tools/tests/run.mjs (or node tools/tests/t216.mjs)
// v0.0.297 PACK ACTION-PREVIEW (Lucas's design D2, foundry/mockups/action-preview-prototype.html): the sheet's open Action card.
// The pure pieces (module/cardview.mjs, sheetmodel.mjs versionCant) and the card built from the real Smite, Word of Radiance and Opportunity Attack
// with Frightened and Radiant Zeal on the creature, 2 AP left in a started combat.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
let designer = false;
const enrichHTML = async t => String(t ?? "")
  .replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, '<a class="content-link">$1</a>')
  .replace(/@(\w+)\[([^\]]*)\](?:\{([^}]*)\})?/g, (m, k, body, lab) => `<a class="twod12-inline" data-twod12-inline="${k}" data-cfg="${body}">${lab ?? (body.match(/label:([^|]*)/)?.[1] ?? body.split("|")[0])}</a>`);
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
const cbt = { actorId: "pal", flags: { twod12: { ap: 2, rap: 0 } }, getFlag(s, k) { return this.flags.twod12[k]; }, actor: null };
globalThis.game = { settings: { get: (s, k) => (k === "designerMode" ? designer : false) }, combat: { started: true, combatants: { find: f => [cbt].find(f), filter: f => [cbt].filter(f), contents: [cbt] } }, user: { getFlag: () => undefined } };
const V = await import(ROOTURL + "module/cardview.mjs");
const S = await import(ROOTURL + "module/sheetmodel.mjs");
const { buildActionCard } = await import(ROOTURL + "module/actioncard.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log("--- the Version buttons (one AP check with the row and the roll dialog: sheetmodel.mjs versionCant)");
const show = bs => bs.map(b => `${b.label}${b.off ? ` [struck: ${b.why}]` : ""}`).join(" | ");
console.log("Smite, 2 AP left:", show(V.versionButtons([1, 2, 3], { inCombat: true, ap: 2 })));
console.log("Smite, out of combat:", show(V.versionButtons([1, 2, 3], { inCombat: false, ap: 0 })), "| a free use:", show(V.versionButtons([3], { inCombat: true, ap: 0, free: true })));
console.log("a 1R Reaction, 0 AP and 1 Reaction AP:", show(V.versionButtons([1], { reaction: true, inCombat: true, ap: 0, rap: 1 })), "| 2R:", show(V.versionButtons([2], { reaction: true, inCombat: true, ap: 0, rap: 1 })));
console.log("payReaction kept (combat.mjs re-exports it):", JSON.stringify(S.payReaction(2, 1, 1)), src("module/combat.mjs").includes("export { payReaction };"));

console.log("--- labels, Effects lines, the ruler");
console.log("Tier labels in full:", [1, 2, 3, "crit", "all"].map(V.tierLabel).join(" | "));
console.log("ruler: Designer on:", JSON.stringify(V.rulerText("Ruler: 2 AP 1.40× · 3 AP 1.45×.", true)), "| off:", JSON.stringify(V.rulerText("Ruler: 2 AP 1.40×", false)), "| no worth:", JSON.stringify(V.rulerText("", true)));
console.log("Effects: three Versions:", JSON.stringify(V.effectLines([{ ap: 1, effects: "A" }, { ap: 2, effects: "B" }, { ap: 3, effects: "C" }]).lines.map(l => `${l.ap}${l.badge ? "*" : ""}`)),
  "| the same text twice:", JSON.stringify(V.effectLines([{ ap: 2, effects: "A" }, { ap: 3, effects: "A" }])), "| no Tiers:", V.effectLines([{ ap: 1, noTiers: true, effects: "X" }]).title);
console.log("Modifier:", V.modText("Signature Modifier", 2), "|", V.modText("Power Modifier", -1), "| the strip: Smite", V.rollsItself([{ noTiers: false }]), "a Save Action", V.rollsItself([{ noTiers: false }], new Set(["save"])), "no Tiers", V.rollsItself([{ noTiers: true }]));
console.log("reasons:", V.notThisWhy("Word of Radiance is not a Strike", "Word of Radiance"), "|", V.notThisWhy("already used this round"), "| cleanLabel:", V.cleanLabel("Flanking (Bandit, 2 Boons)", "Bandit"));

// the real cards
const load = n => JSON.parse(src("packs/_source/" + n));
const asItem = d => ({ id: d._id, name: d.name, type: d.type, getFlag: (s, k) => d.flags?.twod12?.[k],
  system: { ...d.system, traits: new Set(d.system.traits ?? []), versions: d.system.versions ?? [], areaDistance: d.system.areaCfg?.within ? String(d.system.areaCfg.within) : "", area: d.system.areaCfg ? `${d.system.areaCfg.size} / 3 Burst` : "" } });
const smite = asItem(load("actions/smite.action.json")), wor = asItem(load("actions/word-of-radiance.action.json"));
const oa = asItem(load("pcs/aveline-human-paladin-smite.pc.json").items.find(i => i.name === "Opportunity Attack"));
const blank = { attrs: [], all: [], any: [], none: [], from: [], tiers: [] };
const fx = (name, flags) => ({ id: name, name, disabled: false, statuses: new Set(), flags: { twod12: flags }, getFlag: (s, k) => flags[k] });
const actor = { id: "pal", uuid: "Actor.pal", name: "Paladin", type: "character", items: { get: () => null }, itemTypes: { weapon: [], feature: [], talent: [], action: [] }, statuses: new Set(), getFlag: () => undefined,
  effects: [fx("Frightened", { modifiers: [{ ...blank, boons: 0, banes: 1 }] }), fx("Radiant Zeal", { bonuses: [{ ...blank, all: ["strike"], dmg: "1d6", dmgPool: "M", dmgSub: "Ho", tiers: ["t1", "t2", "t3"] }] })],
  system: { attributes: { body: 2, mind: 1, appeal: 1, instinct: 0 }, weaponAttribute: "body", weaponMod: 2, powerAttribute: "mind", powerMod: 2, signatureAttribute: "body", signatureMod: 2, signatureFrom: "weapon", escalation: 1 } };
cbt.actor = actor;

console.log("--- Your roll (the roll dialog's own sources, about you only)");
const { rollStripSources } = await import(ROOTURL + "module/actioncard.mjs");
for (const it of [smite, wor]) { const r = rollStripSources(actor, it); console.log(`${it.name}:`, V.modText(r.src.chip, r.src.mod), "|", r.chips.map(c => `${c.label} (${c.kind}${c.applies ? "" : `, struck: ${c.why}`})`).join(" | ")); }
console.log("a target's chip is left out:", V.rollStripChips({ mods: [{ id: "Actor.x|e1:0", name: "Marked (Bandit)", boons: 1, match: true }, { id: "syn:cover", name: "Cover", banes: 1, match: true }] }).length === 0);

console.log("--- the card");
const at = (h, k) => h.indexOf(k);
const sm = await buildActionCard(smite, { actor });
console.log("no title bar, no Place Area button, no old badge:", !/ac-head|Place Area|ac-badge|class="flavor"/.test(sm));
console.log("trait line:", txt(sm.match(/<div class="ap-trow">[\s\S]*?<\/div>/)?.[0]));
console.log("meta:", txt(sm.match(/<div class="ap-meta">[\s\S]*?<\/div><\/div>/)?.[0]?.replace(/<\/div>\s*<div/g, "</div> / <div")));
console.log("head buttons:", (sm.match(/class="ap-vbtn"/g) ?? []).length, "live,", (sm.match(/class="ap-vbtn no"/g) ?? []).length, "struck:", sm.match(/data-tooltip="([^"]*)"><button type="button" class="ap-vbtn no"/)?.[1], "| dimmed cells:", (sm.match(/<td class="dim">/g) ?? []).length, "| struck Effects badge:", /class="ap-ap no"/.test(sm), "| a button uses its Version:", /data-action="useVersion" data-ap="2"/.test(sm));
console.log("labels:", [...sm.matchAll(/<td class="tl">([^<]*)<\/td>/g)].map(m => m[1]).join(", "));
console.log("order: traits, meta, table, Effects, Your roll, Flavor:", at(sm, "ap-trow") < at(sm, "ap-meta") && at(sm, "ap-meta") < at(sm, "ap-tt") && at(sm, "ap-tt") < at(sm, "ap-fxh") && at(sm, "ap-fxh") < at(sm, "ap-strip") && at(sm, "ap-strip") < at(sm, "ap-flav"));
console.log("strip:", txt(sm.match(/<div class="ap-strip">[\s\S]*?<\/div>/)?.[0]), "| flavor:", txt(sm.match(/<div class="ap-flav">[\s\S]*?<\/div>\s*[^<]*/)?.[0]), "| ruler (Designer off):", sm.includes("ap-ruler"));
designer = true;
const w = await buildActionCard(wor, { actor });
console.log("Word of Radiance: the Area is the chip:", txt(w.match(/<b>Area:<\/b>[\s\S]*?<\/a>/)?.[0]), /<b>Area:<\/b> <a class="twod12-inline" data-twod12-inline="Template"/.test(w), "| riders:", (w.match(/class="ap-rid"/g) ?? []).length, "| Critical row:", /<tr class="crit"><td class="tl">Critical<\/td>/.test(w), "| ruler (Designer on):", txt(w.match(/<div class="ap-ruler">[\s\S]*?<\/div>/)?.[0]));
console.log("its strip:", txt(w.match(/<div class="ap-strip">[\s\S]*?<\/div>/)?.[0]), "| Radiant Zeal struck:", /class="ap-ac na" data-tooltip="Not this Action: not a Strike"/.test(w));
designer = false;
const o = await buildActionCard(oa, { actor });
console.log("Opportunity Attack: meta:", txt(o.match(/<div class="ap-meta">[\s\S]*?<\/div><\/div>/)?.[0]?.replace(/<\/div>\s*<div/g, "</div> / <div")), "| no table, no strip, no traits:", !/ap-tt|ap-strip|ap-chip/.test(o), "| Effects:", txt(o.match(/<div class="ap-fxh">[^<]*/)?.[0]), "| no AP badge:", !/ap-ap/.test(o), "| category and Frequency:", txt(o.match(/<span class="ap-cat">[\s\S]*?<\/span><\/span>/)?.[0]));
cbt.flags.twod12.ap = 0;
const b = await buildActionCard(smite, { actor, use: false });
console.log("the Build tab (no Use): costs, not buttons:", !/ap-vbtn/.test(b) && (b.match(/class="ap-vcost"/g) ?? []).length, "| no actor (Generate Action):", !/ap-vbtn|ap-strip/.test(await buildActionCard(smite)));
game.combat.started = false;
console.log("out of combat with 0 AP: nothing struck:", !/ap-vbtn no|td class="dim"/.test(await buildActionCard(smite, { actor })));
console.log("--- the sheet");
const sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("the Version button's action:", sh.includes("useVersion: CharacterSheet.useVersion") && sh.includes("rdState: { ap: Number(target.dataset.ap) || 0 }"), "| the row's AP check shared:", sh.includes("!!versionCant(minCost, getAP(cbt)"), "| the roll dialog's too:", src("module/rollinput.mjs").includes("versionButtons([v.ap]"),
  "| CSS block:", css.includes("v0.0.297 PACK ACTION-PREVIEW") && css.includes(".twod12.sheet.pcs .ar.open > .ps-line .ps-nm"));
console.log("--- v0.0.298 (Lucas tested v0.0.297)");
const ps = src("module/pcsheet.mjs");
console.log("an NPC's cost once (costPill writes AP):", S.costPill([2, 3]), "|", !ps.includes("`${pillTxt} AP`") && !ps.includes("`${c} AP`"), "| navy head and chevron only on the Build tab:", !css.includes(".twod12.sheet.pcs .ps-row > .ps-line .ps-nm::before") && css.includes(".twod12.sheet.pcs .ps-brw > .ps-brow .ps-nm::before"),
  "| links don't break inside a word:", css.includes(".twod12.acard.d2 a.content-link, .twod12.acard.d2 a.twod12-inline.book { word-break: normal; overflow-wrap: normal; white-space: nowrap; }"));
globalThis.fromUuid = async () => null;
const { buildFeatureCard } = await import(ROOTURL + "module/actioncard.mjs");
const dp = asItem(load("pcs/aveline-human-paladin-smite.pc.json").items.find(i => i.name === "Divine Power"));
const fc = await buildFeatureCard(dp, { actor });
console.log("a Feature's card, in the Action card's look:", /acard d2 feat/.test(fc), "| heading (v0.0.299):", txt(fc.match(/<div class="ap-fxh withcat">[\s\S]*?<\/span><\/div>/)?.[0]), "| no trait line:", !fc.includes("ap-trow"), "| text:", txt(fc.match(/ap-prose">([\s\S]*?)<\/div>/)?.[1]).slice(0, 60), "| flavor last:", fc.indexOf("ap-flav") > fc.indexOf("ap-prose"), "| no title bar:", !/ahead|ac-head/.test(fc));
