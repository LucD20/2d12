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
console.log("Word of Radiance:", say("Word of Radiance", 2));   // v0.0.409 (pack F2): Smite has no chain now
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
console.log("v0.0.358: a condition on a Tier 2 only is said (on:2), nothing is left:", A.writeAfter(f3.steps), f3.left.length);
console.log("v0.0.358: the Tiers as four switches:", [[1], [2], [3], [1, 2], [2, 3], [1, 3], [1, 2, 3], []].map(t => `${t.join("") || "-"}:${A.writeStep(A.setStepTiers({ kind: "Condition", head: "prone", label: "", opts: [] }, t, false)).replace("@Condition[prone", "").replace("]", "") || "(all)"}`).join(" "), "| on a Save:", [[1], [2], [1, 2], [3]].map(t => `${t.join("")}:${A.writeStep(A.setStepTiers({ kind: "Condition", head: "prone", label: "", opts: [] }, t, true)).replace("@Condition[prone", "").replace("]", "")}`).join(" "), "| a Critical:", A.writeStep(A.setStepTiers({ kind: "Condition", head: "prone", label: "", opts: [["tier", "3"]] }, [], false, true)));
console.log("  read back:", ["@Condition[prone|on:2]", "@Condition[prone|on:1,3]", "@Condition[prone|tier:2]"].map(c => A.stepTiers(A.parseAfter(c)[0], false).join("")).join(" "), "| the chain runs it only for those Tiers:", src("module/inline.mjs").includes("cfg.onTiers.includes(Number(t.tier) || 0)"), JSON.stringify(parseInline("Condition", "prone|on:1,3").onTiers), JSON.stringify(parseInline("Move", "pushed|distance:1|on:2").onTiers));
const f4 = A.fillSteps({ x1: "@Move[pushed|distance:1]", x2: "@Move[pushed|distance:1]", x3: "@Move[pushed|distance:1]" }, false);
console.log("the same Push on every Tier is one distance:", A.writeAfter(f4.steps));

console.log("--- the order of events");
const names = Object.fromEntries(C.docs.map(d => [C.uuidOf(d.pack, d.name), d.name]));
const dmgText = l => (l ?? []).map(instanceText).filter(Boolean).join(" + ");
const ev = (n, ap) => { const d = acts.find(x => x.name === n); return A.versionEvents(d.system, d.system.versions.find(x => x.ap === ap), { names, moments: TWOD12.moments, frequencies: TWOD12.frequencies, dmgText }).map(e => `${e.title}${e.after ? "*" : ""}`).join(" > "); };
console.log("Bulwark of Faith:", ev("Bulwark of Faith", 1));   // v0.0.409 (pack F2): the old Smite 3 AP left with pack R's Paladin
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
// v0.0.409 (pack F2): Word of Radiance (a Save with Tiers and a chain) in the place of the old Smite 3 AP
const smite = acts.find(x => x.name === "Word of Radiance"), sh = actionTabHtml({ sys: JSON.parse(JSON.stringify(smite.system)), v: 0, step: 0, names, lines: {}, card: "", rulesTab: "", dmgText });
console.log("Word of Radiance: 1 Version tab:", (sh.match(/data-as="vsel"/g) ?? []).length, "| its Tier fields:", (sh.match(/data-as-dmg="t[123]"/g) ?? []).length, "| \"On a Tier 1 or 2\":", sh.includes('data-as-anchor="use">On a Tier 1 or 2'), "| 2 steps:", (sh.match(/data-as="stepsel"/g) ?? []).length, "| Fill:", sh.includes('data-as="fill"'), "| the chain isn't a text field:", !/data-as-in="v\.after"/.test(sh));
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
console.log("--- v0.0.358 (Lucas on v0.0.355 to v0.0.357)");
const I = await import(ROOTURL + "module/inline.mjs"), AS = await import(ROOTURL + "module/actionsheet.mjs"), U = await import(ROOTURL + "module/util.mjs");
const who = { system: { powerMod: 3, weaponMod: 2, signatureMod: 3, stage: 2, level: 5, moveSpeed: 6, attributes: { body: 2 } } };
console.log("number options take a formula:", ["Guard|1d8+mod|who:pick|near:pow+2", "Condition|vulnerable|value:pow|rounds:stage", "Move|pushed|distance:1|pick:yes|area:stage+1", "Guard|1d8|near:5"].map(x => { const [k, ...r] = x.split("|"), c = I.resolveExprs(parseInline(k, r.join("|")), who); return [c.near, c.value, c.rounds, c.area].filter(v => v !== undefined).join("/"); }).join(" | "));
const chips = AS.dmgChips([{ pool: "B", useW: true, wCount: 1 }, { pool: "M", dice: "1d8", subtype: "Ho" }]);
console.log("the damage line like the card:", chips.replace(/<i [^>]*><\/i>/g, "♥").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(), "| the pool's icon:", chips.includes("fa-heart") && chips.includes("fa-brain"), "| Holy in its color:", /style="color:[^"]+">Holy/.test(chips));
console.log("first names:", ["Aveline (Human Paladin, Smite, level 1)", "Ogre Chieftain", "The Herald", "The Herald of Ash", "Sylwen"].map(U.firstName).join(" | "));
console.log("a line's names:", U.shortNames("<b>Aveline (Human Paladin, Smite, level 1)</b> keeps Guard 10. <b>Ogre Chieftain</b> is Pushed 1.", ["Aveline (Human Paladin, Smite, level 1)", "Ogre Chieftain"]), "| two Ogres keep their names:", U.shortNames("<b>Ogre Chieftain</b> and <b>Ogre Brute (2)</b>", ["Ogre Chieftain", "Ogre Brute (2)"]));
const { sysLine } = await import(ROOTURL + "module/sysmsg.mjs");
globalThis.canvas = { tokens: { placeables: [{ name: "Aveline (Human Paladin, Smite, level 1)", actor: { name: "Aveline (Human Paladin, Smite, level 1)" } }] } }; globalThis.game.actors = [];
console.log("a system line uses them:", sysLine("fa-shield", "<b>Aveline (Human Paladin, Smite, level 1)</b> keeps Guard 10").replace(/<[^>]+>/g, ""), "| its message shows no header:", src("module/twod12.mjs").includes('el.classList.add("twod12-bare")') && src("styles/system.css").includes(".chat-message.twod12-bare > .message-header { display: none; }"), "| the flanking overlay shares the rule:", src("module/flankoverlay.mjs").includes('export { firstName } from "./util.mjs"'));
globalThis.canvas = {};
// v0.0.409 (pack F2): a Guard step (was Smite 3 AP's)
const sm2 = actionTabHtml({ sys: JSON.parse(JSON.stringify(acts.find(x => x.name === "Bulwark of Faith").system)), v: 0, step: 0, names, lines: {}, card: "", rulesTab: "", dmgText });
console.log("the step's buttons in its pane, not on its row:", !/as-step[^>]*>(?:(?!<\/div>)[\s\S])*as-ord/.test(sm2) && /<h4>Guard<span class="as-ord">/.test(sm2), "| four Tier switches:", (sm2.match(/data-as="tiertog"/g) ?? []).length, "| the + trait picker first:", sm2.indexOf("data-as-trait") < sm2.indexOf('data-as="untrait"'), "| no hover underline on buttons:", src("styles/system.css").includes("a.twod12-inline:hover, a.twod12-inline:hover .ti-name"), "| the area tooltip hides over a window:", src("module/zonetip.mjs").includes('document.addEventListener("pointermove"'));
console.log("--- v0.0.359 (Lucas on v0.0.358)");
const dsrc = src("module/data.mjs"), rb2 = actionTabHtml({ sys: { ...JSON.parse(JSON.stringify(acts.find(x => x.name === "Rebuke").system)), momentRangeExpr: "pow+2", momentRange: 0 }, v: 0, step: 0, names, lines: {}, card: "", rulesTab: "", dmgText });
const { evalExpr } = await import(ROOTURL + "module/refs.mjs");
console.log("a Reaction's Within takes a formula: the field:", /data-as-in="@within" value="pow\+2"/.test(rb2), "| stored beside the number:", dsrc.includes("momentRangeExpr: str()"), "| worked out for the creature when read:", dsrc.includes('Object.defineProperty(this, "momentRange"') && dsrc.includes("evalExpr(expr, actor)"), "| pow+2 with Power 3:", evalExpr("pow+2", who), "| the order of events shows it:", rb2.includes("within pow+2"));
console.log("the area tooltip asks what is under the mouse:", src("module/zonetip.mjs").includes("document.elementFromPoint(ev.clientX, ev.clientY)") && src("module/zonetip.mjs").includes("if (!overMap(ev)) return hide();"));
console.log("--- v0.0.360 (Lucas: \"fix those 3 from this pack before merging\")");
const mkq = C.docs.find(d => d.name === "Mark Quarry"), arc = C.docs.find(d => d.name === "Archer" && d.type === "class");
console.log("Mark Quarry holds the mark's rules:", mkq.type, (mkq.system.settings ?? []).map(x => x.type).join(","), "| as rules:", (mkq.system.rules ?? []).length, mkq.system.rulesOn, "| the Feature is gone from the compendium:", !C.docs.some(d => d.name === "Marked Quarry"), "| the Archer's level 1 grants the Action:", arc.system.levels[0].sections.find(x => x.id === "arc1core").items.includes(C.uuidOf("actions", "Mark Quarry")));
const sylwen = C.pcs.find(x => /^Sylwen/.test(x.name));
console.log("Sylwen has the Action with its rules and no Feature:", sylwen.items.filter(i => /Quarry/.test(i.name)).map(i => `${i.name} (${i.type}, ${i.system.settings?.length ?? 0} rules)`).join(", "), "| the card stays for the ruler only:", C.CARDS.find(c => c.name === "Marked Quarry")?.foundry === false);
const setOf = l => (l ?? []).map(x => ({ ...x, all: new Set(x.all ?? []), any: new Set(x.any ?? []), none: new Set(x.none ?? []), from: new Set(x.from ?? []), attrs: new Set(x.attrs ?? []), tiers: new Set(x.tiers ?? []) }));
const oldPc = { itemTypes: { talent: [], feature: [{ id: "f1", type: "feature", name: "Marked Quarry", uuid: "Actor.a.Item.f1", system: { settings: setOf(mkq.system.settings), actions: [C.uuidOf("actions", "Mark Quarry")] }, getFlag: () => "" }],
  action: [{ id: "a1", type: "action", name: "Mark Quarry", uuid: "Actor.a.Item.a1", system: { settings: setOf(mkq.system.settings) }, getFlag: (s, k) => ({ featureId: "f1", sourceUuid: C.uuidOf("actions", "Mark Quarry") }[k]) }] } };
const notYet = { itemTypes: { talent: [], feature: oldPc.itemTypes.feature, action: [{ ...oldPc.itemTypes.action[0], system: { settings: [] } }] } };
console.log("an old character with the Feature and the updated Action counts the mark once:", passiveSources(oldPc).map(x => x.name).join(","), "| before its Action is updated, the Feature still works:", passiveSources(notYet).map(x => x.name).join(","));
const dmk = C.docs.find(d => d.name === "Deathmark"), lnl = C.docs.find(d => d.name === "Lock & Loose");
console.log("Deathmark's Weapon Attack is a step:", A.stepSentence(A.parseAfter(dmk.system.versions[0].after)[0], false).replace(/Compendium\.[\w.]+/, "…"), "| no Effect mode left:", JSON.stringify(dmk.system.versions[0].fx), "| the chain only runs it for a target that is Down:", src("module/inline.mjs").includes("if (cfg.down) {") && parseInline("Effect", "x|who:targets|down:yes").down === true);
console.log("Lock & Loose's Hindered is a step on a Tier 2:", A.stepTiers(A.parseAfter(lnl.system.versions[0].after)[0], false).join(""), "| no per-Tier slot left in the compendium:", C.docs.filter(d => d.type === "action").every(d => (d.system.versions ?? []).every(v => !["t1", "t2", "t3"].some(k => v.fx?.[k]?.length) && !(v.fx?.all ?? []).some(x => x.mode && x.mode !== "auto"))));
console.log("the by-Stage row reads TWOD12.stages:", src("module/actionsheet.mjs").includes("(TWOD12.stages ?? []).map((x, j)"));
