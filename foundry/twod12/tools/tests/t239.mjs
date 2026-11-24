// Run with: node tools/tests/run.mjs (or node tools/tests/t239.mjs)
// v0.0.351 (Lucas on v0.0.350): the center line red-orange when blocked; the flanked creature's name over its label; a Zone's second carried Effect
// (Covering Fire's allies' +1 Defense, dropped since PACK ZONE) in the migration, the runtime and the tooltip; the granted uses' retarget and Cancel;
// the Alt-drag preview.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (o, k) => (k in o ? o[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };

console.log("the center line solid, red-orange and thicker when a creature is in the way; the corner lines dashed (v0.0.453):", src("module/loe.mjs").includes("AMBER = 0xff6b2b") && src("module/loe.mjs").includes("g.lineStyle(c.inWay ? 4 : 2.6, col, 0.92).moveTo(a.x, a.y).lineTo(z.x, z.y);") && src("module/loe.mjs").includes("dashed(c.origin, k, k.blocked ? RED : GREEN"));
console.log("the flanked creature's name on top:", src("module/flankoverlay.mjs").includes('const nm = label(firstName(row.target.name), "#f0c040", fsz(0.15), 0x1b2433, 0xf0c040);') /* v0.0.353: on its ring */);

// The Zone's second carried Effect
const R = await import(ROOTURL + "module/fxrules.mjs");
const lifted = R.liftZone({ rules: [{ kind: "zone", setting: { zoneWho: "enemies", fxUuid: "E.bane" } }, { kind: "zone", setting: { zoneWho: "allies", fxUuid: "E.def" } }] });
console.log("Covering Fire's two settings:", JSON.stringify([lifted.zone.inside.carry.who, lifted.zone.inside.carry.fx, lifted.zone.inside.carry2.who, lifted.zone.inside.carry2.fx]));
console.log("its sentences:", R.insideSentences(lifted.zone.inside, { names: { "E.bane": "Covering Fire (1 Bane)", "E.def": "Covering Fire (+1 Defense)" } }).map(R.plainText).join(" "));
const Z = await import(ROOTURL + "module/zone.mjs");
const zone = { cells: ["1,1", "1,2"], originDisposition: 1, originUuid: "A.kaela", rows: lifted.zone.inside };
const plan = Z.zonePlan([{ id: "r1", zone }], [{ id: "ally", disposition: 1, cells: [{ i: 1, j: 1 }] }, { id: "foe", disposition: -1, cells: [{ i: 1, j: 2 }] }]);
console.log("who carries what:", [...plan].map(([t, m]) => `${t}: ${[...m.values()].map(v => v.rule.fxUuid).join(",")}`).join(" | "));
const ZT = await import(ROOTURL + "module/zonetip.mjs");
console.log("the tooltip:", ZT.zoneTipLines({ name: "Covering Fire", rows: lifted.zone.inside }, u => ({ "E.bane": { name: "Covering Fire (1 Bane)" }, "E.def": { name: "Covering Fire (+1 Defense)" } })[u]).join(" / "));
console.log("the sheet's second row (Zones only):", src("module/fxsheet.mjs").includes('...(/zone/.test(p) ? [part(`${p}.carry2`, x.carry2.on, "Carries a second Effect"'), "| world copies fixed once:", src("module/twod12.mjs").includes('game.settings.get("twod12", "worldPassV351")') && src("module/fixrules.mjs").includes('await it.update({ "system.zone.inside.carry2": c2 });'));

// Granted uses: retarget, Cancel
const FR = await import(ROOTURL + "module/freeuse.mjs");
const actor = { effects: { get: () => ({ getFlag: () => [{ left: 2 }] }) } };
const rows = FR.grantRowsHtml(actor, { effects: [{ id: "e", index: 0, count: 2, actionName: "Weapon Attack" }], targets: [{ uuid: "T.a", name: "Goblin" }, { uuid: "T.b", name: "Orc" }] });
console.log("a Cancel button:", rows.includes('data-twod12="cancelGrant" data-effect-id="e"'), "| cancelled:", FR.grantRowsHtml(actor, { effects: [{ id: "e", index: 0, count: 2, actionName: "Weapon Attack", cancelled: true }] }).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
console.log("the retarget moves the buttons:", src("module/actions.mjs").includes('const card = { ...gc, targets: targets.map(t => ({ uuid: t.uuid, name: t.name })) };'), "| the bar's Cancel:", src("module/freeuse.mjs").includes('class="lb-give lb-gcancel"'));

// Alt-drag preview
const mv = src("module/move.mjs");
console.log("the preview while dragging with Alt:", mv.includes("if (token.isPreview) { if (game.keyboard?.isModifierActive?.(\"Alt\")) drawDragPreview(token); else clearDragPreview(); }") && mv.includes("const txt = `Forced: ${r.done} sq."));
