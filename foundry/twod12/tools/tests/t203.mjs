// Run with: node tools/tests/run.mjs (or node tools/tests/t203.mjs)
// v0.0.264 (Lucas, after v0.0.263: "On [a Tier/Critical], the target's [options] or a [line]"): the Grant's "On [a result], [what happens]":
// the line goes on the granted use's card rows (the Critical row, the Tier rows from that Tier up, the text of a no-tier Version).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u1" } };
const F = await import(ROOTURL + "module/freeuse.mjs");
const v = { ap: 1, noTiers: false, x1: "", x2: "Prone.", x3: "", critical: "", effects: "A shot." };
const show = o => JSON.stringify({ x1: o.x1, x2: o.x2, x3: o.x3, critical: o.critical, effects: o.effects });
console.log("on a Critical:", show(F.withGrantLine(v, { on: "crit", does: "text", text: "Pushed 2." })));
console.log("on a Tier 2 or more:", show(F.withGrantLine(v, { on: "t2", does: "text", text: "Pushed 2." })));
console.log("on any result:", show(F.withGrantLine(v, { on: "all", does: "text", text: "Pushed 2." })));
console.log("a no-tier Version:", show(F.withGrantLine({ ...v, noTiers: true }, { on: "t1", does: "text", text: "Pushed 2." })));
console.log("the half, or no line, leaves it:", F.withGrantLine(v, { on: "t3", does: "half", text: "x" }) === v && F.withGrantLine(v, { on: "", does: "text", text: "x" }) === v && F.withGrantLine(v, { on: "t3", does: "text", text: "" }) === v && F.withGrantLine(v, null) === v);
