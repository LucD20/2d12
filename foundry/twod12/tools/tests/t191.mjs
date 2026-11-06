// Run with: node tools/tests/run.mjs (or node tools/tests/t191.mjs)
// v0.0.252 (Lucas's test of v0.0.251): a hand-clicked chip goes to the selected tokens (else the targeted, else the card's); a duration in rounds
// counts down at the end of the slot in which the effect was applied (the book, Chapter 2); a condition's duration from its sentence is not in the
// chip's label; the Allies / Enemies rows are lists that open on a click; the Heal window's buttons and the Mithril outline styled.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true }, user: { targets: new Set() } };
globalThis.canvas = { tokens: { controlled: [] } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const I = await import(ROOTURL + "module/inline.mjs"), A = await import(ROOTURL + "module/actions.mjs");
const { convertEffects } = await import(ROOTURL + "module/gen.mjs");
const tok = (name, d) => ({ name, actor: { name }, document: { uuid: `T.${name}`, disposition: d } });
globalThis.fromUuidSync = u => ({ object: tok(u.split(".")[1], 1) });
globalThis.canvas.tokens.controlled = [tok("Sel", -1)];
console.log("hand targets: the selected first:", I.handTargetTokens({ message: { getFlag: () => ({ targets: [{ uuid: "T.Card" }] }) } }).map(t => t.name).join(","), "| then the targeted:", (() => { canvas.tokens.controlled = []; game.user.targets = new Set([tok("Tgt", -1)]); return I.handTargetTokens({}).map(t => t.name).join(","); })(), "| then the card's:", (() => { game.user.targets = new Set(); return I.handTargetTokens({ message: { getFlag: () => ({ targets: [{ uuid: "T.Card" }] }) } }).map(t => t.name).join(","); })(), "| a chain keeps its own:", I.handTargetTokens({ targets: [{ uuid: "T.Chain" }] }).map(t => t.name).join(","));
const inl = src("module/inline.mjs"), mv = src("module/move.mjs"), ef = src("module/effects.mjs");
console.log("Condition, Heal, EndEffect, Damage, the ally picker and the Push use the hand targets:", (inl.match(/handTargetTokens\(/g) ?? []).length >= 6 && mv.includes("const sel = (canvas.tokens?.controlled ?? []).filter(t => t.actor);"), "| the card's Self no longer wins a Condition:", !inl.includes("else if (f?.self && f.actorUuid) actors"));
console.log("the countdown at the applied slot (anchor), the origin's for older effects:", ef.includes('anchorCombatantId: cur?.id ?? comb?.id ?? ""') && ef.includes('const oslot = aslot !== null && aslot !== undefined ? aslot : e.getFlag(F, "originSlot");') && (ef.match(/anchorSlot: origin\?\.anchorSlot \?\? null/g) ?? []).length === 2, "| the book says so:", src("../../book/rules-src/02-turns.md").includes("counts down at the end of the slot in which the effect was applied"));
console.log(convertEffects("is Enfeebled 1 and sheds Bright light in a 1 Emanation for 1 round. Hindered (EoT)."));
const q = I.parseInline("Condition", "enfeebled|value:1|rounds:1|quiet:yes");
console.log("quiet: no duration in the label:", q.quiet === true && q.dur === "rounds" && q.rounds === 1, "| the enricher keeps it in the tooltip:", inl.includes('if (cfg.quiet && dur) el.dataset.tooltip = `${nm}${dur}`;'));
const rows = A.applyAfterHtml({ after: "@Heal[3d6+pow|side:allies] @Move[pushed|distance:2|pick:yes|side:enemies]", noTiers: true }, [{ name: "Krysta", disposition: 1 }, { name: "Goblin", disposition: -1 }, { name: "Orc", disposition: -1 }], { document: { disposition: 1 } });
console.log("the Allies / Enemies rows are lists:", rows.includes('<details class="apside"><summary>Allies <small>(1)</small></summary><ul><li>Krysta</li></ul></details>') && rows.includes("<summary>Enemies <small>(2)</small></summary><ul><li>Goblin</li><li>Orc</li></ul>") && !rows.includes("Allies: "));
console.log("the styles:", src("styles/system.css").includes(".classwin .hw-row .hw-ctl button { background: var(--cw-chosen") && src("styles/system.css").includes("-webkit-text-stroke: 1.1px #c3cbd6") && src("styles/system.css").includes(".twod12.chat .applyrow details.apside summary"));
