// Run with: node tools/tests/run.mjs (or node tools/tests/t256.mjs)
// v0.0.410 (pack F2 part 2): the Structure's rules in Foundry (Senses' two questions, a Reaction's target, Setup, Swapping Places) and the Action
// card in the book's look and Structure (actioncard.mjs, style-book.md step 5).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => false } };
const src = n => fs.readFileSync(ROOT + n, "utf8");

console.log("--- Senses: the two questions (senses.mjs youGain)");
const S = await import(ROOTURL + "module/senses.mjs");
const pairs = [["", "obscured"], ["obscured", "obscured"], ["obscured", "hidden"], ["", "hidden"], ["hidden", "unsensed"], ["hidden", "hidden"], ["obscured", ""], ["", "unsensed"]];
console.log(pairs.map(([s, m]) => `you see ${s || "clear"}, it sees you ${m || "clear"}: ${S.youGain(s, m) || "nothing"}`).join(" | "));
const ac = src("module/actions.mjs");
console.log("both paths use it:", (ac.match(/youGain\(/g) ?? []).length >= 3, "| no Foundry window for no Line of Effect / Unsensed:", !/DialogV2\.confirm\(\{ window: \{ title: item\.name \}, content: `<p>No Line of Effect/.test(ac) && !/is Unsensed: it can't be targeted\.<\/p>/.test(ac));

console.log("--- a Reaction's target (moment.mjs reactionSightWhy)");
const M = await import(ROOTURL + "module/moment.mjs");
console.log("clear:", JSON.stringify(M.reactionSightWhy({})), "| no Line of Effect:", M.reactionSightWhy({ loeTarget: false, targetName: "Nari" }), "| Hidden target is enough:", JSON.stringify(M.reactionSightWhy({ seeTarget: "hidden" })),
  "| Unsensed target:", M.reactionSightWhy({ seeTarget: "unsensed", targetName: "the goblin" }), "| Unsensed attacker:", M.reactionSightWhy({ seeSource: "unsensed", sourceName: "the orc" }));
const mo = src("module/moment.mjs"), inl = src("module/inline.mjs");
console.log("collectReactions checks it:", mo.includes("(await reactionSight(tk, target.token ?? null, ev.source?.token ?? null)) || await blockedWhy(actor, item)"), "| Taunting the attacker needs Line of Effect to it:", inl.includes("No Line of Effect to <b>${esc(tt.name)}</b>: it isn't ${esc(cfg.cond)}."));

console.log("--- Setup and Swapping Places");
console.log("the Distance after the Setup (a note, not a block):", ac.includes("const withSetup = ") && ac.includes('text: `Out of range now: the Setup first`'), "| two Setups: you choose:", ac.includes("<i>Or, instead:</i>"));
const G = await import(ROOTURL + "module/gen.mjs");
console.log("Trade Places' button:", G.convertEffects("You and the target swap squares. Each of you is moved by a Reposition."), "| the chip:", inl.includes("async function handleSwap(") && inl.includes('if (kind === "Swap") return handleSwap(cfg, ctx);'));

console.log("--- the card's pieces (actioncard.mjs)");
const A = await import(ROOTURL + "module/actioncard.mjs");
const it = (traits, extra = {}) => ({ traits: new Set(traits), versions: [{ ap: 2, noTiers: false }], ...extra });
console.log("roll lines:", JSON.stringify(A.rollLine(it(["signature", "weapon", "strike"]), "AD")), JSON.stringify(A.rollLine(it(["magic", "save"]), "Appeal Save")), JSON.stringify(A.rollLine(it(["weapon"]), "WD")), JSON.stringify(A.rollLine({ traits: new Set(), versions: [{ noTiers: true }] }, "")));
console.log("Tier lines:", JSON.stringify(A.tierLines(["Prone.", "Prone.", "No effect."], true, true).map(x => x[0])), JSON.stringify(A.tierLines(["No effect.", "Dazed.", "Dazed."], false, true).map(x => x[0])), JSON.stringify(A.tierLines(["a", "b", "c"], false, false).map(x => x[0])), JSON.stringify(A.tierLines(["x", "x", "x"], false, false).map(x => x[0])));
console.log("trait words:", A.traitWords(new Set(["divine", "strike", "weapon", "signature"])).replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"));
const th = src("tools/build-theme.mjs");
console.log("the look in both themes (the shared colors):", th.includes(".twod12-type .twod12.acard.d2.st { display: block; background: color-mix(in srgb, var(--s-gold) 5%, var(--s-pg))") && th.includes("border-top: 2px solid var(--s-gold)"), "| no Tier colors on the card:", !/acard\.d2\.st[^{]*\.t[123]\b/.test(th), "| the Flavor in the serif italic:", th.includes(".st-flavor { font: italic 400 14.5px/1.45 \"Source Serif 4\""));
