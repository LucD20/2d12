// Run with: node tools/tests/run.mjs (or node tools/tests/t259.mjs)
// v0.0.414 (pack "Advance is one piece"; book, Chapter 3, Chapter 6, Chapter 8): an Advance is one piece (another Action ends it, one Interact fits
// inside the Advance Action), Bleed is renamed Lingering (the key stays bleed), and the Basic Action Shake Off ends it (a Save: Tier 3 ends it, Tier 2
// halves this turn's damage and then ends it).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1 } };
globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null };
const src = n => fs.readFileSync(ROOT + n, "utf8");
const CB = await import(ROOTURL + "module/combat.mjs");

console.log("--- an Advance is one piece");
const st = (left, own = false, interacted = false) => ({ left, own, interacted });
const show = (s, k) => JSON.stringify(CB.advanceAfterAction(s, k));
console.log("the Advance Action starts a new one (what was left is lost):", show(st(3, true), "advance"));
console.log("another Action during an Advance ends it:", show(st(3, true), ""));
console.log("one Interact inside the Advance Action:", show(st(3, true), "interact"), "| a second one ends it:", show(st(3, true, true), "interact"));
console.log("an Interact inside another Action's Advance (a Setup, a Linked Action) ends it:", show(st(3, false), "interact"));
console.log("no Advance under way: nothing:", show(st(0), ""), "| the marks are cleared:", show(st(0, true, true), ""));
const fakeC = f => ({ getFlag: (s, k) => f[k] });
console.log("the state read from the combatant:", JSON.stringify(CB.advState(fakeC({ freeMove: 2, moveLeft: 1.5, advOwn: true }))));
const combat = src("module/combat.mjs"), act = src("module/actions.mjs"), mv = src("module/move.mjs"), pc = src("module/pcsheet.mjs");
console.log("wired: spendAP (not for a Reaction):", combat.includes("if (!reaction) { const upd = advanceAfterAction(advState(c), kind);"),
  "| the Action's Basic key:", act.includes("kind: basicKey ?? \"\" })"), "| the hands' Interact:", pc.includes('spendAP(actor, 1, "Interact", { kind: "interact" })'),
  "| a drag that pays AP is the Advance Action:", mv.includes("...(spent && !useEvade ? { [`flags.${F}.advOwn`]: true, [`flags.${F}.advInteract`]: false } : {})"));

console.log("--- Lingering (the key stays bleed)");
const C = await import(ROOTURL + "tools/content.mjs");
const L = C.docs.find(d => d.name === "Lingering" && d.type === "effect");
console.log("the condition:", L ? `${L.name} | its setting: ${L.system.settings.map(x => x.type).join(", ")} | ${L.system.description.includes("Shake Off Action (1 AP)")}` : "missing", "| no Bleed item:", !C.docs.some(d => d.name === "Bleed"));
const E = await import(ROOTURL + "module/effects.mjs");
console.log("the status bleed is the condition Lingering:", JSON.stringify(E.COND_NAME), "| the status's name:", src("module/twod12.mjs").includes('const STATUS_NAME = { bleed: "Lingering" };'));
const R = await import(ROOTURL + "module/condrules.mjs");
console.log("its notation:", R.bleedText({ dmg: "1d6", pool: "M", sub: "Ho", attrs: ["mind", "appeal"] }), "|", R.bleedText({ dmg: "2", attrs: ["body", "instinct"], dc: 15 }));
const G = await import(ROOTURL + "module/gen.mjs");
console.log("a card's text:", G.convertEffects("The target gains Lingering [R] 1d6 Ho (Mi/Ap)."), "| the old word still reads:", G.convertEffects("Bleed 2 (Bo/In)."));
const ws = C.docs.find(d => d.name === "Wounding Shot");
console.log("Wounding Shot's Tiers:", JSON.stringify([ws.system.versions[0].x2, ws.system.versions[0].x3]), "|", ws.system.automation);

console.log("--- Shake Off");
const B = await import(ROOTURL + "module/basic-data.mjs");
const so = B.BASIC_ACTIONS.shakeOff;
console.log(so.name, "|", so.traits.join(","), "|", so.distance, "|", so.targets, "| AP", so.versions.map(v => v.ap).join("/"), "| its chip:", so.versions[0].effects.includes("@ShakeOff["));
const I = src("module/inline.mjs"), cond = src("module/conditions.mjs");
const IN = await import(ROOTURL + "module/inline.mjs").catch(e => ({ err: e.message }));
console.log("the Tiers:", IN.shakeOffResult ? [1, 2, 3].map(t => `${t}: ${IN.shakeOffResult(t)}`).join(" | ") : `(inline.mjs: ${IN.err})`);
console.log("the chip: a Save with the better Attribute against its DC, then ends or halves:", I.includes("async function handleShakeOff(cfg, ctx)") && I.includes('if (e.isOwner) await (what === "ends" ? e.delete() : e.setFlag("twod12", "shakeHalf", true));')   /* v0.0.426: through the GM when not the owner */ && I.includes('e.setFlag("twod12", "shakeHalf", true)'),
  "| the turn's damage halved, then it ends:", cond.includes("if (half) for (const cp of comps) cp.total = Math.floor((Number(cp.total) || 0) / 2);") && cond.includes("if (half) await e.delete();"));
console.log("on the Actions tab (Utility):", JSON.stringify(src("module/config.mjs").match(/key: "utility", label: "Utility", names: (\[[^\]]*\])/)?.[1] ?? "?"));
