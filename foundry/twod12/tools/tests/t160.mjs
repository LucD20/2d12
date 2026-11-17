// Run with: node tools/tests/run.mjs (or node tools/tests/t160.mjs)
// v0.0.199 (Lucas, mockup "D2. Plates, condensed"): the combat strip as plates: the band, the pips, Move and Swap only on the active plate,
// Swapping Initiative's rules (Core Rules, Chapter 2) on the Swap button.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} }; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1, NEUTRAL: 0 } };
const flags = new Map();
const settings = new Map([["twod12.carousel", true], ["twod12.carouselHideDead", false]]);
globalThis.game = { settings: { get: (s, k) => settings.get(`${s}.${k}`) ?? "", register() {} }, user: { isGM: false, id: "u" }, combat: null };
let html = "";
globalThis.document = { getElementById: () => el, createElement: () => el, body: { append() {} } };
const el = { id: "", set innerHTML(v) { html = v; }, get innerHTML() { return html; }, querySelectorAll: () => [], querySelector: () => null, remove() {} };
const K = await import(ROOTURL + "module/carousel.mjs");
const { swapCandidates } = await import(ROOTURL + "module/combat.mjs");
console.log("--- Swap: why not (Core Rules, Swapping Initiative)");
const ok = { mine: true, acted: false, down: false, ap: 5, candidates: 2 };
for (const [name, o] of [["allowed", {}], ["someone else's turn", { mine: false }], ["after an Action", { acted: true }], ["while Down", { down: true }], ["no AP", { ap: 0 }], ["no ally left", { candidates: 0 }], ["thawed (v0.0.205)", { thawed: true }]])
  console.log(`${name}:`, JSON.stringify(K.swapBlock({ ...ok, ...o })));
const cb = (id, name, disp, init, f = {}) => ({ id, name, initiative: init, isOwner: id === "a", isDefeated: !!f.dead, hidden: false, img: "", token: { disposition: disp, texture: { src: "" } }, actor: { type: disp === 1 ? "character" : "npc", system: { atZero: false } }, getFlag: (s, k) => ({ ap: f.ap ?? 5, ...f })[k] });
const A = cb("a", "Lana", 1, 20), B = cb("b", "Goblin", -1, 18), C = cb("c", "Kai", 1, 15), D = cb("d", "Nari", 1, 9, { dead: true }), E = cb("e", "Orc", -1, 5);
const turns = [A, B, C, D, E];
const combat = { started: true, round: 2, turn: 0, turns, combatant: A, combatants: Object.assign(turns, { get: id => turns.find(t => t.id === id) }) };
console.log("allies Lana can swap with (later, same side, not defeated):", swapCandidates(combat, A).map(c => c.name).join(", "));
combat.turn = 2; combat.combatant = C;
console.log("Kai's turn (Lana already acted this round):", swapCandidates(combat, C).map(c => c.name).join(", ") || "none");
console.log("--- the plates");
game.combat = combat; combat.turn = 0; combat.combatant = A;
A.getFlag = (s, k) => ({ ap: 4, freeMove: 3 })[k];
K.renderCarousel();
const plates = html.split('<div class="tp ').slice(1).map(p => p.slice(0, p.indexOf('data-combatant-id')).trim() + " | " + (p.match(/class="tp-band">([^<]*)</)?.[1] ?? "") + (p.includes("tp-move") ? ` | ${p.match(/class="tp-move[^"]*"[^>]*>(.*?)<\/div>/)?.[1].replace(/<[^>]+>/g, "")}` : "") + (p.includes("tp-swap") ? " | Swap" : ""));
for (const p of plates) console.log(" ", p);
console.log("Move and Swap only on the active plate:", plates.filter(p => p.includes("Move") || p.includes("Swap")).length === 1, "| End move in the bar:", html.includes('data-tc="endmove"'), "| Round in gold:", html.includes('<span class="tc-round">Round <b>2</b></span>'));
const css = fs.readFileSync(ROOT + "styles/system.css", "utf8");
console.log("pips: active in the AP color, the others teal:", css.includes("#twod12-carousel .tp.act .tp-pips i.on { background: var(--c-ap") && css.includes("#twod12-carousel .tp-pips i.on { background: var(--tp-teal); }"), "| top-aligned, scrolls sideways only:", css.includes("align-items: flex-start; gap: 5px; padding: 0 2px 4px; overflow-x: auto; overflow-y: hidden;"));
console.log("v0.0.201: no tooltip on the acting plate:", !/<div class="tp [^"]*act[^"]*"[^>]*data-tooltip/.test(html), "| pip kinds:", [...html.matchAll(/class="tp-pips (\w+)"/g)].map(m => m[1]).join(","), "| a player sees no right-click hint:", !html.includes("right-click to set it"));
console.log("v0.0.201 CSS: Cinzel names (Source Serif 4 since STYLE-3), frozen dashed rings, Reactions as diamonds:", css.includes('.tp-name { font-family: "Source Serif 4"') && css.includes(".tp-pips.frozen i { border-style: dashed;") && css.includes(".tp-pips.react i { border-radius: 1px; transform: rotate(45deg)"));
console.log("v0.0.202: the strip fits between the controls and the sidebar (placeCarousel), plates scroll:", typeof K.placeCarousel === "function" && css.includes("#twod12-carousel .tp-list { min-width: 0; max-width: 100%;") && css.includes("#twod12-carousel .tp-list > .tp { flex: none; }"));
