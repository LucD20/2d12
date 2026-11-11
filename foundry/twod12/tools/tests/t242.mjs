// Run with: node tools/tests/run.mjs (or node tools/tests/t242.mjs)
// v0.0.356 PACK ACTION-SHEET, session 2 (Lucas's pick "B3 on top of B1", foundry/mockups/button-builder.html; the audit's section 7, D41 to D55):
// the Create Button window. Its errors fixed (a label's marks, a Save's Tiers written like the card, no button from empty fields, a Line's
// "self", the DC as a choice, Vigor / Resolve in a chip), the missing kinds, "write it" (words to buttons), two ways out (Copy, Send to chat).
// Every command the window builds is read back by the chip parser (inline.mjs parseInline).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
globalThis.foundry = deep(); globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {}, statusEffects: [] }; globalThis.game = { settings: { get: () => false }, user: {} }; globalThis.ui = {}; globalThis.canvas = {};
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "TextEditor", "Application", "Token", "TokenDocument", "Region", "RegionDocument"]) globalThis[n] ??= class {};
const B = await import(ROOTURL + "module/builder.mjs");
const { parseInline, parseParts } = await import(ROOTURL + "module/inline.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const back = cmd => { const m = cmd.match(/^@(\w+)\[([\s\S]*)\](?:\{[^}]*\})?$/); return parseInline(m[1], m[2]); };

console.log("--- the errors (D41 to D46)");
const lab = B.buildCommand({ type: "check", attr: "body", label: "Climb | the wall]" });
console.log("a label's marks:", lab, "| read back:", back(lab).label);
console.log("a Save's Tier like the card:", JSON.stringify(B.tierFromCard("[R] 1d8 Ho; Pushed 2")), JSON.stringify(B.tierFromCard("No effect.")), JSON.stringify(B.tierFromCard("[V] 1[W] + [R] 1d6 Ho")));
const sv = B.buildCommand({ type: "save", attr: "appeal", dcMode: "power", cardTiers: true, traits: ["divine"], t1: "[R] 1d8 Ho; Pushed 2", t2: "[R] 1d6 Ho; Pushed 1", t3: "No effect." });
const svb = back(sv);
console.log("Rebuke's Save as a button:", sv);
console.log("  read back: dc", svb.dcRef, "| t1", JSON.stringify(parseParts(svb.tiers.t1).damage.map(d => [d.formula, d.pool, d.sub])), JSON.stringify(parseParts(svb.tiers.t1).texts), "| t3", svb.tiers.t3);
console.log("no button from empty fields:", ["damage", "move", "rally", "template", "condition", "effect", "guard", "use"].map(t => `${t}: ${B.commandProblem({ type: t, mdistance: "", rn: 0, distance: 0, cname: "", aformula: "", uname: "" }) ? "asks" : "NO"}`).join(", "), "| a filled one:", B.commandProblem({ type: "move", mdistance: "2" }) === "");
console.log("a Line has no self:", B.buildCommand({ type: "template", shape: "line", distance: 10, self: true }), "| an Emanation keeps it:", B.buildCommand({ type: "template", shape: "emanation", distance: 2, self: true }));
console.log("the DC:", ["card", "13", "power", "weapon", "set"].map(m => `${m} -> ${B.buildCommand({ type: "check", attr: "mind", dcMode: m, dc: 15 })}`).join(" | "));
console.log("  the old form still reads (no dcMode):", B.buildCommand({ type: "check", attr: "body", dc: "14" }), B.buildCommand({ type: "check", attr: "body", dc: "13" }));
const dm = B.buildCommand({ type: "damage", f1: "1d6+2", p1: "resolve", s1: "holy", f2: "2d6", p2: "vigor", s2: "" });
console.log("Vigor / Resolve in a chip:", dm, "| read back:", JSON.stringify(back(dm).parts.damage.map(d => [d.formula, d.pool, d.sub])), "| body / mind still read:", JSON.stringify(parseParts("1d6[mind,holy],1d4[body]").damage.map(d => d.pool)));

console.log("--- the missing kinds (D52), each read back");
const kinds = [
  { type: "condition", cname: "Vulnerable", cvalue: 2, cdur: "eot" }, { type: "condition", cname: "frightened", cdur: "rounds", crounds: 1 }, { type: "effect", fxUuid: "Compendium.twod12.effects.Item.abc", fxName: "Beacon" },
  { type: "guard", aformula: "1d8 + mod", awho: "pick", anear: 5 }, { type: "heal", aformula: "2d6+pow" }, { type: "reduce", aformula: "2d6+pow", awho: "pick" }, { type: "use", uname: "Weapon Attack", uap: 0 }, { type: "rally", rn: 2 },
  { type: "move", mkind: "pushed", mdistance: "1", mfrom: "target", mpick: true, marea: 2 }
];
for (const k of kinds) { const c = B.buildCommand(k), p = back(c); console.log(" ", c, "->", [p.cond, p.value, p.dur, p.rounds, p.uuid, p.formula, p.who, p.near, p.target, p.ap, p.n, p.kind, p.distance, p.from, p.pick, p.area].filter(x => x !== undefined && x !== "").join(" ")); }

console.log("--- write it (D53)");
for (const r of B.wordsToButtons("Appeal Save, DC 15; Pushed 2; Vulnerable 2 (EoT); [R] 2d6 Ho; Body Check; Rally 1; 2 Emanation; Evade 1; blinded by the flash")) console.log(" ", r.ok ? "ok" : "??", r.words, "=>", r.cmd);
const st = { ...B.newBuilderState(), words: "Pushed 2; nonsense words here; Prone", src: "words" };
console.log("what is sent: only what was read:", B.builderOutput(st).cmd, "| nothing read:", B.builderOutput({ ...st, words: "nonsense" }).problem);
console.log("from the fields:", B.builderOutput({ ...B.newBuilderState(), type: "move", mdistance: "3" }).cmd, "| an empty kind asks:", B.builderOutput({ ...B.newBuilderState(), type: "effect" }).problem);

console.log("--- the window");
const s0 = B.newBuilderState(), h = B.builderHtml({ ...s0, type: "save", t1: "[R] 1d8 Ho; Pushed 2" }, [], { cmd: "@Save[body]", html: "", problem: "" }, ["@Move[pushed|distance:2]"]);
console.log("12 kinds:", (h.match(/data-f="type"/g) ?? []).length, "| the write-it box on top:", h.indexOf('data-bb-in="words"') < h.indexOf('class="bb-kinds"'), "| two ways out:", h.includes('data-bb="copy"') && h.includes('data-bb="send"'), "| Recent:", h.includes('data-bb="recent"'), "| the Traits grid is a + trait picker:", h.includes("data-bb-trait") && !h.includes('name="traits"'));
const area = B.builderHtml({ ...s0, type: "template" }, [], { cmd: "", html: "", problem: "" });
console.log("the Area without the old kept-area options (D49):", !/data-f="(expire|places|difficult|dfor|dtypes)"/.test(area) && area.includes('data-f="rounds"'), "| buttons off while a field is missing:", /data-bb="send" disabled/.test(B.builderHtml({ ...s0, type: "effect" }, [], { cmd: "@Effect[]", html: "", problem: "Drop an Effect on the box." })));
const bsrc = src("module/builder.mjs");
console.log("the system's window, not a Foundry default one:", !/DialogV2/.test(bsrc) && bsrc.includes("extends (ApplicationV2"), "| sent as a system card (v0.0.358):", bsrc.includes("ChatMessage.create({ content: buttonCard(cmd)") && /^<div class="twod12 chat action sysmsg btnmsg"/.test(B.buttonCard("@Move[pushed|distance:2]")) && B.buttonCard("@Check[body|dc:15] @Rally[1]").includes("@Check[body|dc:15] @Rally[1]"), "| a failed copy selects the text:", bsrc.includes("selectNodeContents"), "| it stays open:", !/_send\(\)[\s\S]{0,400}this\.close\(\)/.test(bsrc));
const dmg1 = B.builderHtml({ ...s0, type: "damage" }, [], { cmd: "", html: "", problem: "x" }), dmg3 = B.builderHtml({ ...s0, type: "damage", drows: 3 }, [], { cmd: "", html: "", problem: "x" });
console.log("v0.0.358: Damage opens with one row and \"+ Another damage\":", (dmg1.match(/data-bb-in="f\d"/g) ?? []).length, dmg1.includes('data-bb="adddmg"'), "| three after two clicks:", (dmg3.match(/data-bb-in="f\d"/g) ?? []).length, "| only the rows shown are written:", B.buildCommand({ type: "damage", drows: 1, f1: "1d6", p1: "vigor", f2: "9d9", p2: "vigor" }));
console.log("the kinds in four rows of three:", [...dmg1.matchAll(/<div class="bb-kg">([\s\S]*?)<\/div>/g)].map(m => (m[1].match(/data-f="type"/g) ?? []).length).join(","), "| the + trait picker comes first:", (() => { const h2 = B.builderHtml({ ...s0, traits: ["fear"] }, [], { cmd: "", html: "", problem: "" }); return h2.indexOf("data-bb-trait") < h2.indexOf('data-bb="untrait"'); })());
console.log("opened from the Action sheet's Effects text:", src("module/actionsheet.mjs").includes('openBuilder({ insert:'));
