// Run with: node tools/tests/run.mjs (or node tools/tests/t189.mjs)
// v0.0.250 (cards session 3: Lay On Hands, Hallowed Dawn, Miraculous Recovery and Lucas's general asks): the Rally and Heal windows with the
// symmetrical split, the Rally chip's extra heal, the @Heal chip (rolled once, each creature's own Rally heal for rp*N, the Stage's dice), the
// @EndEffect chip and its window, the Apply buttons of a no-damage card by side, conditions with a value, rounds:eot, the Mithril rank, the durations wording.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const H = await import(ROOTURL + "module/healwin.mjs"), I = await import(ROOTURL + "module/inline.mjs"), G = await import(ROOTURL + "tools/cardgen.mjs"), C = await import(ROOTURL + "tools/content.mjs");
const { convertEffects } = await import(ROOTURL + "module/gen.mjs");
console.log("--- the symmetrical split (each damage against its own threshold, the higher share first, lethal before nonlethal)");
const thr = { vigor: 20, resolve: 10 };
console.log("Vigor 10/20, Resolve 2/10, heal 6:", JSON.stringify(H.symmetricHealing({ bodyLethal: 8, bodyNonlethal: 2, mindLethal: 2, mindNonlethal: 0 }, thr, 6)));
console.log("Vigor 4/20, Resolve 6/10, heal 5:", JSON.stringify(H.symmetricHealing({ bodyLethal: 4, bodyNonlethal: 0, mindLethal: 6, mindNonlethal: 0 }, thr, 5)));
console.log("more heal than damage:", JSON.stringify(H.symmetricHealing({ bodyLethal: 3, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 1 }, thr, 9)), "| nothing to heal:", JSON.stringify(H.symmetricHealing({}, thr, 5)));
const m = H.healModel({ name: "Krysta", damage: { bodyLethal: 8, bodyNonlethal: 0, mindLethal: 2, mindNonlethal: 0 }, thresholds: thr, total: 6, rally: { n: 1, max: 3, left: 2 } }, { values: { bodyLethal: 5, mindLethal: 1 } });
console.log("the Rally window's model:", m.name, "|", m.stats.map(([k, v]) => `${k} ${v}`).join(", "), "|", m.sections[0].pill, m.message, "|", m.confirm, "| over the heal is refused:", H.healModel({ name: "K", damage: { bodyLethal: 8 }, thresholds: thr, total: 6 }, { values: { bodyLethal: 8 } }).complete === false);
console.log("the plan caps each bucket and the total:", JSON.stringify(H.planHealing({ bodyLethal: 9, mindLethal: 5 }, { bodyLethal: 8, mindLethal: 2 }, 6)));
console.log("the effects that can be ended:", JSON.stringify(H.endableEffects({ effects: [{ id: "a", name: "Prone", getFlag: (s, k) => ({ duration: { type: "eot" } })[k] }, { id: "b", name: "Hindered", getFlag: (s, k) => ({ duration: { type: "rounds", rounds: 2 }, remaining: 2 })[k] }, { id: "c", name: "Mark", getFlag: (s, k) => ({ duration: { type: "" } })[k] }, { id: "d", name: "Harried", getFlag: (s, k) => ({ duration: { type: "rounds", rounds: 2 }, remaining: 1 })[k] }] }, "eot1").map(x => `${x.name} ${x.dur}`)), "| any:", H.endableEffects({ effects: [{ id: "b", name: "Hindered", getFlag: (s, k) => ({ duration: { type: "rounds", rounds: 2 }, remaining: 2 })[k] }, { id: "c", name: "Mark", getFlag: (s, k) => ({ duration: { type: "" } })[k] }] }, "any").length);
console.log("--- the chips");
console.log(convertEffects("The target can use 1 Rally Point, healing 1d6 + your Power Modifier more."));
console.log(convertEffects("heal 3d6 + your Power Modifier (4d6 at Stage 2, 6d6 at Stage 3) and is Enfeebled 1 and Vulnerable 2 (1 round). Bright light in a 2 Emanation (EoT)."));
console.log(convertEffects("The target heals twice what 1 Rally Point would heal. gain Guard 1d8 + [Mod] (2d6 + [Mod] at Stage 2, 2d8 + [Mod] at Stage 3)."));
const heal = I.parseInline("Heal", "3d6+pow|s2:4d6+pow|s3:6d6+pow|side:allies"), rally = I.parseInline("Rally", "1|extra:1d6+pow"), cond = I.parseInline("Condition", "enfeebled|value:1|side:enemies"), tpl = I.parseInline("Template", "emanation|distance:1|rounds:eot");
console.log("Heal:", heal.formula, JSON.stringify(heal.stages), heal.side, "| the Stage's formula:", I.stagedFormula(heal, 1), I.stagedFormula(heal, 2), I.stagedFormula(heal, 3), "| Rally extra:", rally.extra, "| Condition value and side:", cond.value, cond.side, "| rounds:eot:", tpl.expire);
console.log("texts:", I.healText("3d6+pow"), "|", I.healText("rp*2"), "|", I.healText("rp*3"), "| with Pow 3:", I.withPow("1 Rally Point (+1d6+Pow)", 3), "|", I.withPow("Heal 3d6 + Pow", 2), "| none:", I.withPow("Heal 3d6 + Pow", null));
console.log("--- the cards");
const cards = G.loadCards(), byName = n => cards.find(c => c.name === n);
const loh = G.cardSystem(byName("Lay On Hands"));
console.log("Lay On Hands:", loh.versions.map(v => `${v.ap} AP: ${v.effects}`).join(" | "), "| rank:", loh.automation);
const hd = G.cardSystem(byName("Hallowed Dawn"));
console.log("Hallowed Dawn:", hd.versions[0].effects, "| after:", hd.versions[0].after.replace(/\{\{fx:[^}]+\}\}/g, "{{fx}}"));
const mr = G.cardSystem(byName("Miraculous Recovery"));
console.log("Miraculous Recovery:", mr.versions.map(v => `${v.ap} AP: ${v.effects} || ${v.after}`).join(" | "));
console.log("Mithril cards:", cards.filter(c => c.foundry?.automation === "mithril").map(c => c.name).join(", "), "| the tracker lists them:", cards.filter(c => c.foundry?.automation === "mithril").every(c => src("../../book/cards/with-lucas.txt").includes(c.name)));
console.log("no 'until the end / start of X turn' left in the cards:", !cards.some(c => /until the (end|start) of (your|their|its) next turn|before the end of its next turn/i.test(JSON.stringify({ ...c, _note: "" }))));
console.log("the book: a heal to several creatures is rolled once:", src("../../book/rules-src/04-health.md").includes("A heal to several creatures is rolled once"), "| the light effect:", !!C.docs.find(d => d.name === "Hallowed Dawn (Bright light 1)"));
console.log("--- the code");
const ac = src("module/actions.mjs"), inl = src("module/inline.mjs"), dm = src("module/damage.mjs"), ra = src("module/rally.mjs"), cfg = src("module/config.mjs");
console.log("Apply buttons by side on a no-damage card:", ac.includes("export function applyAfterHtml(") && ac.includes('data-twod12="applyAfter" data-side="${side}"') && ac.includes("export async function applyAfter(") && src("module/twod12.mjs").includes('b.dataset.twod12 === "applyAfter"'), "| the card keeps the targets' side:", ac.includes("disposition: t.document?.disposition ?? t.disposition"));
console.log("the chain filters by side:", inl.includes("if (side && cfg.side && cfg.side !== side) continue") && inl.includes("export function sideTargets("), "| Heal rolled once, rp*N per creature, each creature prompted:", inl.includes("const perCreature = /\\brp\\b/.test(formula)") && inl.includes("await promptHeal(a, amountFor(a)"), "| the prompts reach the answerer through the socket:", dm.includes('data.type === "healPrompt"') && dm.includes('data.type === "endEffectPrompt"'));
console.log("the Rally window and no dialog left in rally.mjs:", ra.includes("await healWindow({") && !ra.includes("DialogV2"), "| the extra heal rolled to the chat:", ra.includes("extraRoll = await new Roll(f).evaluate()"), "| Mithril:", cfg.includes('mithril: "Mithril"') && src("styles/system.css").includes(".autodia.auto-mithril"));
