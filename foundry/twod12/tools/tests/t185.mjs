// Run with: node tools/tests/run.mjs (or node tools/tests/t185.mjs)
// v0.0.246 (cards 1, Lucas's first card written his way: Smite): the general pieces the cards use. The area chips read "1 Emanation" / "2 Burst" /
// "6 Line" with the footprint icons; "[Mod]" in a chip shows the creature's number ("Guard 1d8+3"); the book's [[links]] stay links in Foundry
// (a card's link opens the compendium item, a rule's a book link); a Version's Foundry text written in full (foundry.text) and its chips after the
// damage (foundry.after: the Guard's who-picker, the Push picker); a placeholder card (Hide) is an Action with no Versions; the Smite light effects.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
globalThis.game = { socket: { emit() {}, on() {} }, user: {}, settings: { get: () => true } };
globalThis.document = { createElement: () => { const el = { classes: [], classList: { add(c) { el.classes.push(c); } }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }; return el; } };
globalThis.CONFIG = { TextEditor: { enrichers: [] } };
const I = await import(ROOTURL + "module/inline.mjs");
const { convertEffects } = await import(ROOTURL + "module/gen.mjs");
const G = await import(ROOTURL + "tools/cardgen.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");

console.log("--- convertEffects: the Guard chip and the Line areas");
console.log(convertEffects("you or one ally in the light gain @Book[Guard]{Guard} 1d8 + [Mod] (2d6 + [Mod] at Stage 2). The other creatures are Pushed 1."));
console.log(convertEffects("Guard 2d6 + 3 for 1 round; The target gains Guard equal to what one of their Rally Points heals."));
console.log(convertEffects("A Line 6 of fire, a 2 Line, Line of Effect is needed, Bright light in a 2 Emanation for 1 round, a 3 Burst."));

console.log("--- the book's links in Foundry");
console.log(G.foundryLinks("try to [[Hide]], gain [[Guard]] 1d8, use [[Evade]] or [[Straight Line|a straight line]]; [[Smite]] again"));
console.log("resolved by content.mjs:", C.resolveRefs("{{link:Hide|Hide}} {{link:Radiant Zeal|the Passive}}").replace(/Item\.\w+/g, "Item.<id>"));

console.log("--- the area chips and [Mod] as a number (inline.mjs)");
console.log("labels:", I.areaLabel("emanation", 1), "|", I.areaLabel("burst", 2), "|", I.areaLabel("line", 6), "| icons:", Object.keys(I.AREA_ICONS).join(", "), "| each an <i> masked with the shape's SVG file (v0.0.247):", Object.values(I.AREA_ICONS).every(x => /^<i class="areaic \w+"><\/i>$/.test(x)));
console.log("withMod:", I.withMod("Guard 1d8 + [Mod]", 3), "|", I.withMod("Guard 1d8 + [Mod]", null), "|", I.withMod("[Mod] to all", 2), "|", I.withMod("Pushed 1", 4));
const msg = flags => ({ documentName: "ChatMessage", getFlag: (s, k) => flags[k] });
console.log("modForDoc: an Action card", I.modForDoc(msg({ action: { attrVal: 3 } })), "| a damage card", I.modForDoc(msg({ dmgCard: { originMod: 2 } })), "| nothing", I.modForDoc(msg({})), "| no document", I.modForDoc(null));
CONFIG.TextEditor = { enrichers: [] };   // content.mjs replaces CONFIG when it loads
I.registerInline();
const enr = CONFIG.TextEditor.enrichers[0];
const chip = async (text, relativeTo = null) => { const m = [...text.matchAll(enr.pattern)][0]; const el = await enr.enricher(m, { relativeTo }); return `${el.html.replace(/<i class="areaic \w+"><\/i>/, "<icon/>")}${el.classes.length ? ` [${el.classes.join(" ")}]` : ""}${el.dataset.tooltip ? ` (${el.dataset.tooltip})` : ""}`; };
console.log("chips:", await chip("@Template[emanation|distance:2|rounds:1]"), "|", await chip("@Template[burst|distance:3]"), "|", await chip("@Template[line|distance:6]"));
console.log("Guard on an Action card (Modifier 3):", await chip("@Guard[1d8+mod]{Guard 1d8 + [Mod]}", msg({ action: { attrVal: 3 } })), "| on the sheet with no creature:", await chip("@Guard[1d8+mod]{Guard 1d8 + [Mod]}"));
console.log("a book link:", await chip("@Book[Bright]{Bright light}"), "|", await chip("@Book[Guard|doc:Core Rules]"));
const pi = (k, s) => { const c = I.parseInline(k, s); return JSON.stringify(Object.fromEntries(Object.entries(c).filter(([key]) => ["who", "area", "pick", "from", "ref", "doc", "kind", "distance", "formula"].includes(key)))); };
console.log("options:", pi("Guard", "1d8+mod|who:pick|area:2"), pi("Move", "pushed|distance:1|pick:yes|area:2|from:target"), pi("Book", "Bright|doc:Core Rules"));

console.log("--- the Smite card (book/cards/paladin.json) as Foundry data");
const smite = G.loadCards().find(c => c.name === "Smite"), sys = G.cardSystem(smite);
for (const v of sys.versions) console.log(`${v.ap} AP: ${v.effects.replace(/\{\{fx:[^}]+\}\}/g, m => m)} | fx: ${v.fx.all.map(x => x.uuid).join(", ")}${v.after ? ` | after: ${v.after}` : ""}`);
console.log("the 2 and 3 AP texts are written in full (the book says As 1 AP):", smite.versions[1].effects, "|", sys.versions[1].effects.startsWith("The target sheds"), sys.versions[2].effects.startsWith("The target sheds"));
console.log("automation:", sys.automation, "|", sys.automationNote);
console.log("a card in a table cell keeps a link with a label (cells of build_rules.py):", src("../../book/build_rules.py").includes("replace('|', '\\x00')"), "| the built book links Bright light and Hide:", /sheds <a class="xref" href="[^"]*#bright">Bright light<\/a>/.test(src("../../book/paladin.html")), /href="[^"]*#card-hide">Hide<\/a>/.test(src("../../book/paladin.html")), "| every card an anchor:", src("../../book/core-rules.html").includes('id="card-weapon-attack"'));

console.log("--- the placeholder card (Hide) and the Smite light effects");
const hide = G.loadCards().find(c => c.name === "Hide"), hs = G.cardSystem(hide);
console.log("Hide: placeholder", hide.placeholder, "| an Action:", G.isAction(hide), "| versions:", hs.versions.length, "| frequency:", JSON.stringify(hs.frequency), "| text:", hs.description.replace(/<[^>]+>/g, ""));
console.log("in the Actions pack:", C.docs.filter(d => d.name === "Hide").map(d => `${d.pack}/${d.type}`).join(", "), "| placed in Chapter 6:", src("../../book/rules-src/06-basic-actions.md").includes("@@CARD:Hide@@"));
const fx = C.docs.filter(d => d.type === "effect" && d.name.startsWith("Smite"));
console.log("effects:", fx.map(d => `${d.name}: ${d.system.settings.map(s => s.type === "light" ? `light ${s.bright}/${s.dim}` : s.type).join(", ")}, ${d.system.duration.type} ${d.system.duration.rounds}`).join(" | "), "| the old +1 Defense is gone:", !C.docs.some(d => d.name === "Smite (+1 Defense)"));

console.log("--- the chain and the pickers in the code");
const mv = src("module/move.mjs"), dm = src("module/damage.mjs"), ac = src("module/actions.mjs"), dt = src("module/data.mjs"), ve = src("templates/versions-editor.hbs");
console.log("move.mjs: a Push picker (pick:yes), the card's target as the origin (from:target), the chain's targets:", mv.includes("async function pushPicker("), mv.includes('cfg.from === "target" ? targetTokens(ctx)[0]'), mv.includes("ctx?.targets ?? f?.targets"));
console.log("damage.mjs: the chain runs after the damage (single and merged cards):", dm.includes("if (f.after) await runAfterDamage(f, targets)"), dm.includes("if (f.after && done.length) await runAfterDamage(f, done)"), "| actions.mjs passes it on Tier 2+:", ac.includes("after: f.tier >= 2 ? chainOf(f, version) : \"\""));
console.log("the Version field exists and is editable:", dt.includes("after: str()"), ve.includes('data-field="after"'), "| inline.mjs: the who picker and runAfter:", src("module/inline.mjs").includes('cfg.who !== "pick"'), src("module/inline.mjs").includes("export async function runAfter("));
console.log("the chips of the chain parse:", [...smite.versions[2].foundry.after.matchAll(/@(\w+)\[([^\]]*)\]/g)].map(m => `${m[1]}:${JSON.stringify(I.parseInline(m[1], m[2])).length > 0}`).join(" "));
