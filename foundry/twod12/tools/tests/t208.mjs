// Run with: node tools/tests/run.mjs (or node tools/tests/t208.mjs)
// v0.0.270 (Lucas's test of v0.0.269): a Zone's effect leaves with the token (the movement's destination is read, every token update and each turn
// refresh); an effect that grants a use keeps its other settings for that use only (Aim's cover on Aim's shot, not on every Weapon Attack).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u1" } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const Z = await import(ROOTURL + "module/zone.mjs");
const zone = { name: "Consecrated Ground", originDisposition: 1, cells: ["3,3", "3,4", "4,3", "4,4"], rules: [{ who: "enemies", fxUuid: "Item.bane", heal: "" }] };
const at = (i, j) => [{ i, j }];
const before = Z.zonePlan([{ id: "r1", zone }], [{ id: "orc", disposition: -1, cells: at(3, 3) }]), after = Z.zonePlan([{ id: "r1", zone }], [{ id: "orc", disposition: -1, cells: at(8, 8) }]);
console.log("in, then out:", [...(before.get("orc") ?? new Map()).keys()].join(","), "|", (after.get("orc") ?? new Map()).size);
const z = src("module/zone.mjs"), au = src("module/automation.mjs"), ac = src("module/actions.mjs");
console.log("the movement's destination is read, every token update and each turn refresh:", z.includes("landing.set(doc.id, { x: d.x, y: d.y, width: doc.width, height: doc.height, flags: doc.flags })") && z.includes("cells: tokenCells(landing.get(td.id) ?? td)") && z.includes('Hooks.on("updateToken", (doc, ch) => { if (["x", "y",') && z.includes('Hooks.on("combatTurnChange", sched);'));
console.log("a grant's other settings count for its own use only:", au.includes('if ((e.getFlag(F, "grants") ?? []).some(g => g.left > 0) && e.id !== grantEffectId) continue;') && ac.split("opts.grant?.effect?.id ?? null").length === 3);
