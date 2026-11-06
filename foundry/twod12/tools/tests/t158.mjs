// Run with: node tools/tests/run.mjs (or node tools/tests/t158.mjs)
// v0.0.195 (pack C-c): the class window's Talent filter bar, and movement-only Actions through the banner (no card, one line at the end).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null };
const A = await import(ROOTURL + "module/actions.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
console.log("--- movement-only Actions (the banner) and the others (their card)");
const traits = t => new Set(t);
const basic = k => ({ it: { traits: traits(BASIC_ACTIONS[k].traits) }, vs: BASIC_ACTIONS[k].versions });
for (const k of ["advance", "safeMovement", "crawl", "stand", "charge", "relocate"]) {
  const { it, vs } = basic(k);
  console.log(`${BASIC_ACTIONS[k].name}:`, vs.map(v => JSON.stringify(A.pureMove(it, v, k))).join(" | "));
}
const card = n => C.docs.find(d => d.type === "action" && d.name === n);
for (const n of ["Rolling Shot", "Double Shot"]) { const d = card(n); console.log(`${n}:`, d.system.versions.map(v => JSON.stringify(A.pureMove({ traits: traits(d.system.traits) }, v))).join(" | ")); }
const src = f => fs.readFileSync(ROOT + f, "utf8"), act = src("module/actions.mjs"), mv = src("module/move.mjs");
console.log("wired: no card when the banner takes it", act.includes("const cmsg = bannerMove ? null : await ChatMessage.create({"), "| the movement tag (v0.0.197)", mv.includes("if (cfg.banner && kind !== \"charge\") { showRange(c, n); moveBanner(c, kind, n, cfg.banner, { ap: cfg.bannerAp ?? 0 }); return true; }"),
  "| one Turn Log line when it ends (v0.0.200)", mv.includes('await logEvent(c, makeLine("move", name, after + ap, after,'), "| End, Advance instead (on the strip, v0.0.198)", src("module/carousel.mjs").includes('btn("endmove"') && src("module/carousel.mjs").includes('data-tc="evadeadv"'), "| closes on a turn change", mv.includes('on("combatTurnChange", () => finish(false));'));
console.log("--- the Talent filter bar");
const cw = src("module/classwindow.mjs"), css = src("styles/system.css");
console.log("search, Category, Only what I can take, compact list:", cw.includes('class="cw-fq"') && cw.includes('class="cw-fcat"') && cw.includes('class="cw-fok"') && cw.includes('data-key="tfview"'),
  "| checked by canTake at the level being taken:", cw.includes("const r = d?.type === \"talent\" ? canTake(who, d)") && cw.includes("level: this.o.level"),
  "| the reasons on the tile:", cw.includes("Not yet: ${tal.reasons.join"), "| filtered in place (no redraw):", cw.includes("tile.hidden = !ok;"), "| the actor reaches the window:", (cw.match(/, actor \}\);/g) ?? []).length, "| compact list CSS:", css.includes(".classwin .cw-tiles.compact .cw-view"));
console.log("--- v0.0.196: a drag is an Advance with the banner; no drag lines while it is up; the Evade key");
console.log("a drag that spends AP opens the banner (or adds to it):", mv.includes('if (spent && !useEvade && walk > 0) { if (bannerOn(c) && moveBar && !moveBar.logged()) moveBar.add(walk * spent, spent); else moveBanner(c, "walk", walk * spent, "Advance", { drag: true, ap: spent }); }'),
  "| drag lines only without a banner:", mv.includes("else if (!spent && !bannerOn(c) && logMode !== \"Charge\") await post("), "| the banner counts the Speed left of a drag:", mv.includes('(drag ? num(c.getFlag(F, "moveLeft")) : 0)'));
console.log("the Evade key (Shift+E):", src("module/twod12.mjs").includes('editable: [{ key: "KeyE", modifiers: ["Shift"] }]') && src("module/twod12.mjs").includes('m.quickBasic("safeMovement")') && act.includes("const label = v => (key === \"safeMovement\" ? `Evade ${v.ap >= 2 ? Math.floor(speed / 2) : 1} (${v.ap} AP)`"), "| no dialog for it:", act.includes("const quick = opts.quickAp != null && versions.find(v => v.ap === Number(opts.quickAp))?.noTiers;"));
console.log("--- v0.0.197: one line per movement, no AP line for it");
const MV = await import(ROOTURL + "module/move.mjs");
console.log(MV.moveLine("Kai", "walk", "Advance", 1, 7).replace(/<[^>]+>/g, ""), "|", MV.moveLine("Kai", "walk", "Advance", 1, 7, 4).replace(/<[^>]+>/g, ""), "|", MV.moveLine("Nari", "evade", "Evade", 2, 3, 3).replace(/<[^>]+>/g, ""));
console.log("AP lines kept out:", src("module/combat.mjs").includes('if (quiet || why === "edited") return;') && act.includes("spendAP(actor, apCost, item.name, { quiet: moveQuiet, reaction: !!it.reaction })") && mv.includes("{ quiet: !useEvade && walk > 0 }"), "| no tag over the token (v0.0.198):", !mv.includes("twod12-movetag"));
const sm = (f, e, l) => MV.stripMove({ getFlag: (s, k) => ({ freeMove: f, evadeMove: e, moveLeft: l })[k] });
console.log("the strip under the AP dots: Advance 4:", JSON.stringify(sm(4, 0, 0)), "| Evade 2:", JSON.stringify(sm(0, 2, 0)), "| a drag's Speed left 3:", JSON.stringify(sm(0, 0, 3)), "| nothing:", JSON.stringify(sm(0, 0, 0)), "| shown:", src("module/carousel.mjs").includes('class="tp-move'));
