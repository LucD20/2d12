// Run with: node tools/tests/run.mjs (or node tools/tests/t330.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
// v0.0.532 (Lucas, playtest 11: "A target that is 'marked', like by Judge and similar, should have it on the situational tab [...] so we can remove it
// manually. And the chat card of these marks should have a 'Apply effect'"): the HUD's Marks entry (marks.mjs) and the card's Apply effect button.
globalThis.game = { settings: { get: () => undefined } };
const MK = await import(ROOTURL + "module/marks.mjs");
console.log("labels:", ["judge", "bound", "", "quarry"].map(MK.markLabel).join(", "));
const flags = { quarry: { uuid: "Scene.s.Token.gw", name: "Grave Wisp", kind: "judge" }, marks: { bound: { uuid: "Scene.s.Token.ka", name: "Kaela", kind: "bound" } } };
const durgan = { uuid: "Actor.du", getFlag: (s, k) => flags[k] };
const fx = (id, name, origin, f = {}) => ({ id, name, origin, disabled: false, getFlag: (s, k) => f[k] });
globalThis.canvas = { tokens: { placeables: [
  { name: "Ogre Chieftain", actor: { uuid: "Scene.s.Token.oc.Actor.oc", effects: [fx("e1", "Taunted (Durgan)", "Actor.du", { endsWithOrigin: true }), fx("e2", "Vulnerable 1", "Actor.du", {}), fx("e3", "Daunted", "Actor.sy", { endsWithOrigin: true })] } },
  { name: "Orc Warrior", actor: { uuid: "Scene.s.Token.ow.Actor.ow", effects: [fx("e4", "Grabbed", "Actor.du", { endsWithOrigin: true }), fx("e5", "Immobilized", "Actor.du", { endsWithOrigin: true, linkedTo: "e4" })] } },
  { name: "Durgan", actor: { uuid: "Actor.du", effects: [] } }
] } };
const inp = MK.placedOf(durgan);
console.log("read:", JSON.stringify(inp));
const m = MK.placedModel(inp);
console.log("rows:", m.rows.map(r => `${r.name}: ${r.what} (${r.key})`).join(" | "));
console.log("none:", MK.placedModel({ marks: [], conds: [] }));
const html = MK.placedHtml(m);
console.log("the entry: a title,", (html.match(/class="h3-hd-r h3-mk-r"/g) ?? []).length, "rows, a remove each:", (html.match(/data-hud="markrm"/g) ?? []).length, "| aria-label, no tooltip:", /aria-label="Remove Judged from Grave Wisp"/.test(html) && !/data-tooltip|title=/.test(html));
console.log("folded:", (MK.placedHtml({ ...m, folded: true }).match(/h3-mk-r/g) ?? []).length, "rows");
const hv = src("module/hudview.mjs"), hud = src("module/hud.mjs"), act = src("module/actions.mjs"), inl = src("module/inline.mjs"), mk = src("module/marks.mjs");
console.log("in the Situational tab after Hiding:", hv.includes("if (s.placed) avail.push(placedHtml(s.placed));"), "| the HUD builds it:", hud.includes("placed: placedMarks"), "| remove and fold:", hud.includes('kind === "markrm"') && hud.includes('kind === "markfold"'));
console.log("a remove posts a system line:", (mk.match(/sysLine\("fa-crosshairs"/g) ?? []).length === 2, "| through the GM when needed:", mk.includes('type: "deleteEffect"'), "| the owner or the GM:", mk.includes("if (!actor?.isOwner) return ui.notifications.warn("));
console.log("the card's Apply effect, also after a mark lands:", act.includes("{Apply effect}`, item)} places the mark again by hand"), "| on the targeted creature, else the card's:", inl.includes("(cardTok && !mine.has(cardTok.id) ? cardTok : null)"));
