// Run with: node tools/tests/run.mjs (or node tools/tests/t317.mjs)
// v0.0.517 (Lucas, 2026-11-25: the HUD's Hiding entry, the mockup foundry/mockups/hide-hud, "A, and default to all others"): hide.mjs hidingModel
// (shown while the creature hides from someone or during the turn it used Hide or Sneak; Unsensed first; Add against the creatures targeted and not
// listed, all at once), flipState, setHideByHand (a chat line); hudview.mjs hidingHtml (layout A: the state is the button, a remove, Add).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const H = await import(ROOTURL + "module/hide.mjs"), V = await import(ROOTURL + "module/hudview.mjs");
const names = { g: "Goblin Sneak", o: "Orc Warrior", a: "Goblin Archer", k: "Kaela" };
const m1 = H.hidingModel({ o: "hidden", g: "unsensed" }, { names, targets: [], selfId: "k" });
console.log("two rows, Unsensed first:", JSON.stringify(m1.rows.map(r => `${r.name} ${r.state}`)), "| no target, no Add:", m1.add);
console.log("not hiding, not this turn: nothing:", H.hidingModel({}, { names }), "| this turn: the entry:", JSON.stringify(H.hidingModel({}, { names, hidThisTurn: true })));
console.log("Add against one:", JSON.stringify(H.hidingModel({ g: "unsensed" }, { names, targets: [{ id: "o", name: "Orc Warrior" }], selfId: "k" }).add));
console.log("Add against all the new ones (self and listed left out):", JSON.stringify(H.hidingModel({ g: "unsensed" }, { names, targets: [{ id: "o", name: "Orc Warrior" }, { id: "a", name: "Goblin Archer" }, { id: "g", name: "Goblin Sneak" }, { id: "k", name: "Kaela" }], selfId: "k" }).add));
console.log("flip:", H.flipState("hidden"), H.flipState("unsensed"));
const html = V.hidingHtml(H.hidingModel({ o: "hidden", g: "unsensed" }, { names, targets: [{ id: "a", name: "Goblin Archer" }], selfId: "k" }));
console.log("html: the state is the button", (html.match(/data-hud="hideflip"/g) ?? []).length, "| removes", (html.match(/data-hud="hiderm"/g) ?? []).length, "| Add buttons", (html.match(/data-hud="hideadd"/g) ?? []).length, "| aria-labels", /aria-label="Remove Orc Warrior"/.test(html), "| no tooltip", !/data-tooltip|title=/.test(html), "| no pulse", !/pulse/.test(html));
console.log("hint with no target:", /To add a creature, target one/.test(V.hidingHtml(H.hidingModel({ o: "hidden" }, { names }))));
console.log("wired: HUD model", src("module/hud.mjs").includes("H.hidingModel(map"), "| clicks", src("module/hud.mjs").includes('kind === "hideflip"'), "| chat line by hand", src("module/hide.mjs").includes("(set by hand)"), "| Hide and Sneak mark the turn", src("module/actions.mjs").includes("markHidTurn(actor)"), "| in Situational", src("module/hudview.mjs").includes("avail.push(hidingHtml(s.hiding))"));
// v0.0.518: folded to its title
const fold = V.hidingHtml({ ...H.hidingModel({ o: "hidden" }, { names }), folded: true });
console.log("folded: the title is a button", /data-hud="hidefold"/.test(fold), "| aria-expanded false", /aria-expanded="false"/.test(fold), "| no rows", !/hideflip/.test(fold), "| unfolded shows them", /hideflip/.test(V.hidingHtml(H.hidingModel({ o: "hidden" }, { names }))));
