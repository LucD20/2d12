// Run with: node tools/tests/run.mjs (or node tools/tests/t283.mjs)
// v0.0.453 (playtest 6; Lucas, 2026-11-19, book/playtest-6.md): the Unfailing trait (Smite), an Effect line whatever the roll, the Minion squads'
// recommendation and the GM's clicks, the rewind's refund, Charge (another target, never on a creature), the HUD's stamps, the cover lines.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: {} };
globalThis.foundry = { applications: { api: {}, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => o } };
globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] }, time: {} }; globalThis.game = { settings: { get: () => false }, user: {} };
const R = await import(ROOTURL + "module/roundrules.mjs"), IM = await import(ROOTURL + "module/initmodel.mjs"), M = await import(ROOTURL + "module/moment.mjs");
const act = src("module/actions.mjs"), use = src("module/usage.mjs");
console.log("--- Unfailing");
console.log("a Keywords trait:", src("module/config.mjs").includes('traits: ["divine", "focus", "fear", "unfailing"]'), "| on Smite in the book:", JSON.parse(src("../../book/cards/stage0/paladin.json")).cards?.find?.(c => c.name === "Smite")?.traits?.includes("unfailing") ?? src("../../book/cards/stage0/paladin.json").includes('"unfailing"'),
  "| the book's rule:", src("../../book/rules-src/07-traits.md").includes("### Unfailing"));
console.log("a Tier 1 keeps its Frequency, its Strike counts:", act.includes('const unfailed = useTraits.has("unfailing")') && act.includes("await markUsed(actor, item, { keepFrequency: unfailed });") && use.includes('const f = keepFrequency ? "" : effectiveFrequency(item.system);') && use.includes('if (item.system.traits.has("strike")) {'));
console.log("--- an Effect line whatever the roll");
console.log("the card's Effects and fx.all on a Tier 1:", act.includes("const effectsOff = false;") && act.includes("...[...(version.fx?.all ?? []), ...(version.fx?.[`t${tier}`] ?? [])"), "| the chat card from Tier 1:", src("module/chatcards.mjs").includes("r.tier >= (m.effectsFrom ?? 1)"),
  "| the after-chain keeps its gate (Club's Push):", act.includes('after: f.tier >= 2 ? chainOf(f, version) : ""'));
console.log("--- Minion squads");
const mk = (n, g = {}) => Array.from({ length: n }, (_, i) => ({ id: `m${i}`, kind: "G", group: g[i] }));
console.log("sizes for 1 to 7:", [1, 2, 3, 4, 5, 6, 7].map(n => Object.values(R.minionSquads(mk(n))).map(x => x.length).join("+")).join(" | "));
console.log("the GM's: all three in one:", Object.values(R.minionSquads(mk(3, { 0: 1, 1: 1, 2: 1 }))).map(x => x.length).join("+"), "| never four in one:", Object.values(R.minionSquads(mk(4, { 0: 1, 1: 1, 2: 1, 3: 1 }))).map(x => x.length).join("+"));
const g3 = R.minionGroupOf(mk(3));
console.log("three: a click moves the lone one into the first; one of the pair into a new squad:", g3.m1.next, g3.m0.next, "| two can be split:", R.minionGroupOf(mk(2)).m0.next);
const moved = IM.squadMove([{ id: "m0", set: {} }, { id: "m1", set: {} }, { id: "m2", set: {} }], "m0", 3, g3.m0.groups);
console.log("a click fixes the others where they stand:", JSON.stringify(Object.fromEntries(Object.entries(moved).map(([k, v]) => [k, v.group]))));
console.log("--- the rewind");
console.log("an Advance bought during the drag, 2 back:", JSON.stringify(M.backRefund({ freeMove: 0, moveLeft: 0, ap: 4 }, { freeMove: 0, moveLeft: 1, ap: 3 }, 2)), "| free squares, 2 back:", JSON.stringify(M.backRefund({ freeMove: 5, moveLeft: 0, ap: 4 }, { freeMove: 1, moveLeft: 0, ap: 4 }, 2)),
  "| all the way: the AP too:", src("module/moment.mjs").includes('ap: Number(c.getFlag(F, "ap")) || 0 } : null;'));
console.log("--- Charge, the HUD, the strip, the cover lines");
const mv = src("module/move.mjs");
console.log("another enemy clicked becomes the target:", mv.includes("const other = tokenAtPoint(pos);"), "| never on a creature's space:", mv.includes("const freeBack = (cells, idx)"), "| in the Situational section:", mv.includes('bar.classList.toggle("in-side", inSide)'),
  "| its Weapon Attack chip's name uses it:", !src("module/inline.mjs").includes('if (kind === "Use" && cfg.target'));
console.log("a Large token's space around the center square:", mv.includes("at = { i: c0.i - Math.floor(h / 2), j: c0.j - Math.floor(w / 2) }"), "| the Light weapon a warning:", src("module/rollinput.mjs").includes("blocked.push(...(c.warns ?? []));"));
console.log("the HUD's struck stamps are clicked:", src("module/hudview.mjs").includes('class="hb-st${s.off ? " no" : ""}" data-hud='), "| no state tag on the strip:", src("module/carousel.mjs").includes('const htag = "";'), "| the Reaction diamond gold:", src("tools/build-theme.mjs").includes(".twod12-type.twod12-type #twod12-carousel .tp-marks .hm-r i.on { background: #d2a75a;"));
console.log("Judge on the start-of-the-encounter card:", src("module/startstack.mjs").includes('i.system?.markKind === "judge"'), "| Armor of Faith names its source:", act.includes("'s Passive, for using ${srcLink(item.name, item.uuid)}"), "| the chat's scroll box:", src("module/chatscroll.mjs").includes("export function scrollBoxOf(log)"));
