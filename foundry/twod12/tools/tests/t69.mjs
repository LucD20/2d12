// Run with: node tools/tests/run.mjs (or node tools/tests/t69.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { traitChevrons, TWOD12 } = await import(ROOTURL + "module/config.mjs");
// v0.0.179: chips by trait group (the group's label, then its chips), in the book's order; the color is the group's CSS variable.
const chips = t => traitChevrons(new Set(t)).split('<span class="tg tg-').slice(1).map(b => `${b.split('"')[0]}: ${[...b.matchAll(/class="tchip"[^>]*>([^<]+)</g)].map(x => x[1]).join(", ")}`).join(" | ");
console.log("Whirlwind:", chips(["strike", "weapon", "self", "melee", "area"]));
console.log("Smite:    ", chips(["weapon", "strike", "divine"]));
console.log("Trip:     ", chips(["strike", "handle", "body", "instinct"]));
console.log("Area help:", TWOD12.traitHelp.area.slice(0, 60) + "...", "| Area is a trait:", TWOD12.traits.area);
console.log("weapon properties (no color, no groups):", traitChevrons(new Set(["melee", "twohanded", "reload"]), { properties: true }).replace(/ data-tooltip="[^"]*"/g, ""));
