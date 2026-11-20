// Run with: node tools/tests/run.mjs (or node tools/tests/t190.mjs)
// v0.0.251 (Lucas's test of v0.0.250): the Heal window's rows (now, after, minus and plus, what is left), the area shown for an Action with no roll
// (Hallowed Dawn) with its confirm on a bar and the windows aside, the Apply rows following a retarget, a chain's Condition going to the chain's
// targets before the card's Self, a condition's duration from its sentence ("... for 1 round"), the Mithril sheen stronger.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const H = await import(ROOTURL + "module/healwin.mjs"), G = await import(ROOTURL + "tools/cardgen.mjs");
const { convertEffects } = await import(ROOTURL + "module/gen.mjs");
// v0.0.454 (D1): the split's rows (now, after, minus and plus) once "Change the split" is open, and what is left to give
const html = H.healWinHtml({ name: "Krysta", damage: { bodyLethal: 8, bodyNonlethal: 0, mindLethal: 2, mindNonlethal: 0 }, thresholds: { vigor: 20, resolve: 10 }, partsFor: () => [[6, ""]], rally: null }, { n: 1, values: { bodyLethal: 4, mindLethal: 1 }, split: true });
console.log("the rows: now, after, minus and plus, what is left:", html.includes('<span class="was">8</span>') && html.includes('<b class="chg">4</b>') && html.includes('data-hw="step" data-k="bodyLethal" data-d="-1"') && html.includes("1 left to give"), "| Heal, no Rally Points:", html.includes('data-hw="go">Heal</button>') && !html.includes("hw2-rp"));
const ac = src("module/actions.mjs"), tp = src("module/template.mjs"), inl = src("module/inline.mjs");
console.log("the area is placed for an Action with no roll (no src.kind gate):", ac.includes("if (!deferArea && areaSet && canvas.ready && canvas.grid?.isSquare) {") && !ac.includes("canvas.grid?.isSquare && src.kind"), "| the version pick is a bar:", ac.includes('pickBar({ icon: "fa-vector-square", text: `<b>${esc(item.name)}</b>: which version?'));
console.log("the confirm is a bar, you-too from the setting first, the windows aside:", tp.includes('options: centerTok ? (data.self ? [withMe, withoutMe] : [withoutMe, withMe]) : [withoutMe]') && tp.includes("back0 = await stepAside()") && !tp.includes('window: { title: actName || "Apply Area" }'));
console.log("a retarget rebuilds the Apply rows with the targets' side:", ac.includes("const rows = applyAfterHtml({ after: f.after, noTiers: true }, targets, me)") && ac.includes("disposition: t.document.disposition }));"));
console.log("a chain's Condition goes to the chain's targets before the card's Self:", /if \(ctx\.targets\?\.length\) actors = [\s\S]{0,500}else actors = handTargetTokens\(ctx\)/.test(inl));
console.log(convertEffects("Each enemy in the Area is Pushed 2 away from you, is Enfeebled 1 and sheds Bright light in a 1 Emanation for 1 round. Vulnerable 2 (EoT) and Hindered."));
// v0.0.409 (pack F2): Hallowed Dawn left with pack R's Paladin; Reckoning is the Emanation around you now
const rk = G.loadCards().find(c => c.name === "Reckoning");
console.log("Reckoning: around you (centered):", rk.foundry.areaCfg.center === true, "| enemies only:", rk.foundry.areaCfg.targets === "enemies", "| Frightened in the chain:", G.cardSystem(rk).versions[0].after.includes("@Condition[frightened|rounds:1]"), "| its Setup's Advance:", G.cardSystem(rk).setup);
console.log("the Mithril sheen:", src("styles/system.css").includes(".autodia.auto-mithril { background: linear-gradient(135deg, #5ad7ff"), "| the Apply rows styled:", src("styles/system.css").includes(".twod12.chat .applyrow button"));
