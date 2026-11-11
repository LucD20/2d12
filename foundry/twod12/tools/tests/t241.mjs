// Run with: node tools/tests/run.mjs (or node tools/tests/t241.mjs)
// v0.0.355 PACK ACTION-SHEET (Lucas's mockup A2; the audit foundry/mockups/action-effects-audit.md): the Action's Details tab.
//   - aftersteps.mjs: a Version's "After the damage" chain read as steps and written back unchanged (every chain of the compendium), "On which
//     result" on a roll and on a Save, the by-Tier distances, Fill from the Tier text, the order of events;
//   - actionsheet.mjs: the tab renders for every Action of the compendium; an Action holds rules (data.mjs, passives.mjs);
//   - Stage 0 ready: Escalation and a rule's "Works" read TWOD12.escalationMax, a chip's sN: reads any Stage.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
const stub = () => { globalThis.foundry = deep(); globalThis.foundry.utils = { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) }; };
stub(); globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {}, statusEffects: [] }; globalThis.game = { settings: { get: () => false }, user: {} }; globalThis.ui = {}; globalThis.canvas = {};
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "TextEditor", "Application", "Token", "TokenDocument", "Region", "RegionDocument"]) globalThis[n] ??= class {};
const C = await import(ROOTURL + "tools/content.mjs"); stub();
const A = await import(ROOTURL + "module/aftersteps.mjs");
const { actionTabHtml } = await import(ROOTURL + "module/actionsheet.mjs");
const { instanceText } = await import(ROOTURL + "module/actions.mjs");
const { parseCardTier } = await import(ROOTURL + "module/genaction.mjs");
const { stagedFormula, parseInline } = await import(ROOTURL + "module/inline.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const FR = await import(ROOTURL + "module/fxrules.mjs"), V = await import(ROOTURL + "module/fxsheet.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const acts = C.docs.filter(d => d.type === "action");

console.log("--- the chain as steps");
let chains = 0, same = 0;
for (const d of acts) for (const v of d.system.versions ?? []) if (v.after) { chains++; if (A.writeAfter(A.parseAfter(v.after)) === v.after.trim().replace(/\s+/g, " ")) same++; }
console.log("every chain of the compendium reads and writes back unchanged:", chains > 0 && chains === same);
const one = (n, ap) => { const d = acts.find(x => x.name === n), v = d.system.versions.find(x => x.ap === ap); return { v, save: (d.system.traits ?? []).includes("save") }; };
const say = (n, ap) => { const { v, save } = one(n, ap); return A.parseAfter(v.after).map(s => A.stepSentence(s, save)).join(" "); };
console.log("Rebuke:", say("Rebuke", 1));
console.log("Smite 3 AP:", say("Smite", 3));
console.log("Marksman's Shot:", say("Marksman's Shot", 2));
const st = A.parseAfter("@Condition[vulnerable|value:2|eot|tier:3]")[0];
console.log("a bare option kept:", A.writeStep(st), "| its label:", A.stepLabel(st), "| an unknown option kept:", A.writeAfter(A.parseAfter("@Move[pushed|distance:2|terrain:ignore|foo:bar]")));
console.log("text between chips kept:", A.writeAfter(A.parseAfter("first @Pause[After the damage] then @Guard[rally|who:pick]")));

console.log("--- on which result (the audit's D13)");
const c = A.newStep("Condition");
console.log("a roll:", ["any", "t23", "t3", "crit"].map(o => `${o} -> ${A.writeStep(A.setStepOn({ ...c, opts: [] }, o, false))} lit ${A.stepTiers(A.setStepOn({ ...c, opts: [] }, o, false), false).join("")}`).join(" | "));
console.log("a Save:", ["any", "t12", "t1"].map(o => `${o} -> ${A.writeStep(A.setStepOn({ ...c, opts: [] }, o, true))} lit ${A.stepTiers(A.setStepOn({ ...c, opts: [] }, o, true), true).join("")}`).join(" | "));
console.log("read back:", A.stepOn(A.parseAfter("@Condition[prone|tier:2]")[0], false), A.stepOn(A.parseAfter("@Condition[prone|tier:2]")[0], true), A.stepOn(A.parseAfter("@Condition[prone|crit:yes]")[0], false));
const mv = A.parseAfter("@Move[pushed|distance:1|t1:2]")[0];
console.log("a by-Tier move on a Save:", A.moveByTier(mv), A.stepTiers(mv, true).map(k => `${k}=${A.tierDistance(mv, k)}`).join(" "), "|", A.stepLabel(mv, true));

console.log("--- Fill from the Tier text (D14)");
const f1 = A.fillSteps({ x1: "@Move[pushed|distance:2], and @Condition[frightened|rounds:1]{Frightened} of you for 1 round.", x2: "@Move[pushed|distance:1]", x3: "No effect." }, true);
console.log("Rebuke's words:", A.writeAfter(f1.steps), "| left:", f1.left.length);
const f2 = A.fillSteps({ x3: "@Condition[vulnerable|value:2|eot]", critical: "@Condition[blinded|eot]" }, false);
console.log("Marksman's Shot's words:", A.writeAfter(f2.steps));
const f3 = A.fillSteps({ x2: "@Condition[hindered|eot]" }, false);
console.log("a condition on a Tier 2 only, on a roll, can't be a chip:", f3.steps.length === 0 && f3.left.length === 1, "|", f3.left[0]);
const f4 = A.fillSteps({ x1: "@Move[pushed|distance:1]", x2: "@Move[pushed|distance:1]", x3: "@Move[pushed|distance:1]" }, false);
console.log("the same Push on every Tier is one distance:", A.writeAfter(f4.steps));

console.log("--- the order of events");
const names = Object.fromEntries(C.docs.map(d => [C.uuidOf(d.pack, d.name), d.name]));
const dmgText = l => (l ?? []).map(instanceText).filter(Boolean).join(" + ");
const ev = (n, ap) => { const d = acts.find(x => x.name === n); return A.versionEvents(d.system, d.system.versions.find(x => x.ap === ap), { names, moments: TWOD12.moments, frequencies: TWOD12.frequencies, dmgText }).map(e => `${e.title}${e.after ? "*" : ""}`).join(" > "); };
console.log("Smite 3 AP:", ev("Smite", 3));
console.log("Rebuke:", ev("Rebuke", 1));
console.log("Covering Fire:", ev("Covering Fire", 2));

console.log("--- the tab");
let n = 0; const bad = [];
for (const d of acts) {
  try {
    const html = actionTabHtml({ sys: JSON.parse(JSON.stringify(d.system)), v: 0, step: 0, names, lines: {}, card: "", rulesTab: V.fxTabHtml({ host: "action", name: d.name, rules: [], names: {}, items: {} }), dmgText });
    if (!html.includes("as-tab") || ((d.system.versions ?? []).length > 0) !== html.includes("as-rail")) bad.push(d.name); else n++;
  } catch (e) { bad.push(`${d.name}: ${e.message}`); }
}
console.log("renders for every Action:", n === acts.length, n, "| failures:", bad.length ? bad.join("; ") : "none");
const smite = acts.find(x => x.name === "Smite"), sh = actionTabHtml({ sys: JSON.parse(JSON.stringify(smite.system)), v: 2, step: 0, names, lines: {}, card: "", rulesTab: "", dmgText });
console.log("Smite 3 AP: 3 Version tabs:", (sh.match(/data-as="vsel"/g) ?? []).length, "| its Tier fields:", (sh.match(/data-as-dmg="t[123]"/g) ?? []).length, "| \"On a Tier 2 or 3\":", sh.includes('data-as-anchor="use">On a Tier 2 or 3'), "| 2 steps:", (sh.match(/data-as="stepsel"/g) ?? []).length, "| Fill:", sh.includes('data-as="fill"'), "| the chain isn't a text field:", !/data-as-in="v\.after"/.test(sh));
const cf = acts.find(x => x.name === "Covering Fire"), ch = actionTabHtml({ sys: JSON.parse(JSON.stringify(cf.system)), v: 0, step: 0, names, lines: {}, zoneName: "Covering Fire", card: "", rulesTab: "", dmgText });
console.log("Covering Fire: \"On use\":", ch.includes('data-as-anchor="use">On use'), "| the area's size and rounds on the Version:", ch.includes('data-f="v.@size"') && ch.includes('data-f="v.@rounds"'), "| Who set by the Zone:", ch.includes("set by the Zone"));
let tiers = 0, okT = 0; const norm = l => JSON.stringify(l.map(i => [i.pool || "B", !!i.useW, i.useW ? i.wCount || 1 : 1, i.dice || "", !!i.useAt, i.subtype || ""]));
for (const d of acts) for (const v of d.system.versions ?? []) for (const k of ["t1", "t2", "t3"]) { const l = v[k] ?? []; if (!l.length) continue; tiers++; const b = parseCardTier(dmgText(l)); if (norm(b.insts) === norm(l) && !b.text) okT++; }
console.log("every Tier's damage reads back from its text:", tiers > 0 && tiers === okT);
console.log("no Foundry default window, no Versions window:", !/DialogV2/.test(src("module/actionsheet.mjs")), !src("templates/item-sheet.hbs").includes("openVersions"), "| \"Modifies other Actions\" only while an Action has some:", src("module/item-sheet.mjs").includes('(t === "action" && s.modifiers.length > 0)'));

console.log("--- an Action holds rules (D17)");
const data = src("module/data.mjs"), a0 = data.indexOf("export class ActionData"), a1 = data.indexOf("const tierDamage");
console.log("the model:", data.slice(a0, a1).includes("settings: settingsField(), ...rulesFields()"), "| read as passives:", src("module/passives.mjs").includes("(actor.itemTypes.action ?? []).filter(a => a.system?.settings?.length)"));
const { passiveSources } = await import(ROOTURL + "module/passives.mjs");
const mq = C.docs.find(d => d.name === "Marked Quarry" || (d.name === "Mark Quarry" && d.system.settings?.length));
const fake = { itemTypes: { feature: [], talent: [], action: [{ id: "a1", name: "Mark Quarry", uuid: "Item.a1", system: { settings: (mq?.system.settings ?? []).map(s => ({ ...s, all: new Set(s.all ?? []), any: new Set(s.any ?? []), none: new Set(s.none ?? []), from: new Set(s.from ?? []), attrs: new Set(s.attrs ?? []), tiers: new Set(s.tiers ?? []) })) }, getFlag: () => "" }, { id: "a2", name: "Smite", system: { settings: [] }, getFlag: () => "" }] } };
const ps = passiveSources(fake);
console.log("an Action with settings is a source, one without isn't:", ps.length, ps[0]?.name, "| its Boon:", JSON.stringify(ps[0]?.getFlag("twod12", "bonuses")?.[0] ?? ps[0]?.flags?.twod12?.modifiers?.[0] ?? null).slice(0, 120));

console.log("--- Stage 0 ready");
console.log("escalationMax in the config:", TWOD12.escalationMax, "| the sheet reads it:", src("module/actionsheet.mjs").includes("TWOD12.escalationMax") && !/max="3"/.test(src("module/actionsheet.mjs")), "| a rule's Works too:", src("module/fxsheet.mjs").includes("TWOD12.escalationMax"), "| no fixed clamp:", src("module/fxrules.mjs").includes("T().escalationMax"));
TWOD12.escalationMax = 6;
const w6 = V.fxTabHtml({ host: "action", name: "X", rules: [FR.defaultRule("act")], names: {}, items: {} });
console.log("with 6, Works offers:", (w6.match(/data-f="minEsc"/g) ?? []).length, "choices | a rule keeps Escalation 5:", FR.normRule({ kind: "act", minEsc: 5 }).minEsc);
TWOD12.escalationMax = 3;
const g = parseInline("Guard", "1d8+mod|s2:2d6+mod|s3:2d8+mod"), g1 = parseInline("Guard", "1d6+mod|s1:1d8+mod|s3:2d8+mod");
console.log("a chip's sN: (old chips as before):", [0, 1, 2, 3].map(s => `${s}=${stagedFormula(g, s)}`).join(" "), "| with a Stage 0 base and s1:", [0, 1, 2, 3].map(s => `${s}=${stagedFormula(g1, s)}`).join(" "), "| none:", stagedFormula(parseInline("Guard", "1d8+mod"), 3));
console.log("the by-Stage row reads TWOD12.stages:", src("module/actionsheet.mjs").includes("(TWOD12.stages ?? []).map((x, j)"));
