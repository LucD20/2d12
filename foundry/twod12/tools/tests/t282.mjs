// Run with: node tools/tests/run.mjs (or node tools/tests/t282.mjs)
// v0.0.444 (group 2; Lucas, 2026-11-19, the mockup foundry/mockups/group2: "Proposed", "make sure to make all fill a single line"; his rules):
// two held weapons that fit: the roll dialog's columns and a Roll button for each (no "Which weapon?" window, no hand buttons on the sheet);
// the HUD's hand menu above the tile; a card's weapon requirement ("Weapon needs", Darting Blade: Light); the book's Handle exception.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: {} };
globalThis.foundry = { applications: { api: {}, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => o } };
globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] }, time: {} }; globalThis.game = { settings: { get: () => false }, user: {} };
const RD = await import(ROOTURL + "module/rolldlg.mjs"), P = await import(ROOTURL + "module/pcsheet.mjs"), FI = await import(ROOTURL + "module/fists.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- the roll dialog's columns");
const tiers = (a, b) => ({ 1: { pools: [] }, 2: { pools: [{ pool: "B", text: a }] }, 3: { pools: [{ pool: "B", text: b }] } });
const inp = { name: "Weapon Attack", versions: [{ ap: 1, cost: "1 AP", tiers: tiers("x", "y") }], roll: { name: "Weapon", mod: 1 }, chips: [{ id: "syn:onehand", scope: "shared", row: "banes", kind: "bane", n: 3, label: "Two-handed weapon in one hand", start: "on" }], creatures: [],
  dual: { current: "ls", weapons: [{ id: "ls", name: "Longsword", hand: "main hand", dist: "1", out: "Orc Warrior is 4 squares away: its Range is 1", banes: [{ n: 3, text: "Two-handed weapon in one hand" }], tiers: {} },
    { id: "dg", name: "Dagger", hand: "off hand", dist: "thrown 4/8/12", thrown: true, out: "", banes: [{ n: 1, text: "Off hand (Light)" }], tiers: {} }] } };
const st = RD.newState(inp);
const d = RD.dualHtml(inp, st, inp.versions[0]);
console.log(strip(d));
console.log("a column a weapon:", d.includes('style="--n:2"'), "| the Banes on lines of their own:", (d.match(/class="rdd-bane"/g) ?? []).length === 2, "| the reason a weapon can't reach:", d.includes('class="rdd-out"'));
const full = RD.dialogHtml(inp, st);
console.log("a Roll for each weapon:", (full.match(/data-act="roll" data-weapon="/g) ?? []).length === 2, "| the thrown one says so:", full.includes("Roll · Dagger (thrown)"), "| the one out of reach struck:", full.includes('class="rd-go rd-gow out"'));
console.log("the current weapon's hand Banes leave the shared rows:", !full.includes("Two-handed weapon in one hand</") || !/rd-rows[\s\S]*Two-handed weapon in one hand/.test(full.split('class="rd-dual"')[1]?.split("</div></div>")[1] ?? ""));
console.log("one weapon: one Roll:", (RD.dialogHtml({ ...inp, dual: null }, st).match(/class="rd-go"/g) ?? []).length === 1, "| CSS: every line one line:", src("styles/system.css").includes(".twod12.rolldlg .rdd-r > * { min-width: 0; white-space: nowrap; overflow: hidden; }"));
const act = src("module/actions.mjs"), win = src("module/rollwindow.mjs");
console.log("no Which weapon? window with two held:", act.includes("opts.weaponId = ord[0].id; opts.dual = ord.map(w => w.id);"), "| the other's Roll runs it again with that weapon at once:", win.includes("return this._finish({ restart: true, rollAfter: true, weaponId, state: this.st });") && act.includes("weaponId: rdData.weaponId ?? previewWeapon?.id ?? opts.weaponId,"));
console.log("--- the hand menu");
const W = (id, name, tr, wield, hand) => ({ id, name, system: { traits: new Set(tr), wielded: wield, hand, hands: 1, worn: true } });
const ws = [W("ls", "Longsword", ["melee", "twohanded"], true, "main"), W("dg", "Dagger", ["melee", "light", "thrown"], true, "off"), W("as", "Arming Sword", ["melee"], false), W("gs", "Greatsword", ["melee", "twohanded"], false)];
const show = m => `${m.title} (${m.sub})${m.warn ? ` [${m.warn}]` : ""}: ${m.groups.map(g => g.map(r => `${r.label} = ${r.act} ${r.cost}${r.off ? ` STRUCK (${r.why})` : ""}`).join("; ")).join(" || ")}`;
console.log(show(P.handMenuModel(ws, "main", { inCombat: true, ap: 3 })));
console.log(show(P.handMenuModel(ws, "off", { inCombat: false })));
console.log(show(P.handMenuModel([W("as", "Arming Sword", ["melee"], true, "main"), W("gs", "Greatsword", ["melee", "twohanded"], false)], "off", { inCombat: true, ap: 0 })));
console.log("a one-handed weapon has no \"both hands\" row:", !P.handMenuModel([W("dg", "Dagger", ["melee"], true, "main")], "main", { inCombat: true, ap: 2 }).groups.flat().some(r => /both hands/.test(r.label)));
console.log("the HUD opens it above the tile:", src("module/hud.mjs").includes('div.style.bottom = `${Math.round(h.bottom - r.top + 4)}px`;'), "| the macro bar's look:", src("styles/system.css").includes(".twod12-hud #hotbar .slot .key, .twod12-hud #hotbar .slot .slot-key"));
console.log("--- the card's weapon requirement");
const item = { system: { traits: new Set(["weapon", "melee", "strike"]), weaponNeeds: "light" }, getFlag: () => undefined };
const actor = { itemTypes: { weapon: [W("ls", "Longsword", ["melee", "twohanded"], true, "main"), W("dg", "Dagger", ["melee", "light", "thrown"], true, "off")] }, items: { get: () => null } };
console.log("Darting Blade fits:", FI.weaponCandidates(actor, item).map(w => w.name).join(", "), "| its card sets it:", src("../../book/cards/stage0/archer.json").includes('"weaponNeeds": "light"'), "| the Action sheet edits it:", src("module/actionsheet.mjs").includes('name="system.weaponNeeds"'));
console.log("--- the book");
console.log("Handle: stowing and swapping need no free hand:", src("../../book/rules-src/07-traits.md").includes("stowing an object you hold, or swapping it for another you carry (Interact), needs no free hand"), "| Thrown stays in hand:", src("../../book/rules-src/09-glossary.md").includes("A thrown weapon stays in your hand for the rules"));
