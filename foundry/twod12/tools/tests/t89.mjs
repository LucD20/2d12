// Run with: node tools/tests/run.mjs (or node tools/tests/t89.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// The Move button shows its calculated number ("Evade 2" with a calculator), and the line color of Talents and Features.
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} };
globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] } };
globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: {} };
const mkEl = tag => ({ tag, dataset: {}, classList: { add() {} }, children: [], className: "", innerHTML: "", append(...c) { this.children.push(...c); } });
globalThis.document = { createElement: mkEl };
const sp = n => ({ documentName: "Actor", name: "Kai", uuid: "Actor.kai", system: { moveSpeed: n, speed: n, walk: n }, items: [], effects: [] });
const kai = sp(5);
globalThis.fromUuidSync = u => (u === "Actor.kai" ? kai : null);
const I = await import(ROOTURL + "module/inline.mjs");
I.registerInline();
const en = CONFIG.TextEditor.enrichers.find(e => e.pattern.source.includes("Move"));
const show = async (src, doc) => {
  en.pattern.lastIndex = 0; const m = en.pattern.exec(src);
  const el = await en.enricher(m, doc === undefined ? {} : { relativeTo: doc });
  const label = el.innerHTML.replace(/<i class="[^"]*"><\/i>\s*/, "").trim();
  const calc = el.children.find(c => c.className?.includes("calculator"));
  return `${src.padEnd(52)} → "${label}"${calc ? ` + calculator (${calc.dataset.tooltip})` : ""}`;
};
const item = { documentName: "Item", parent: kai }, offItem = { documentName: "Item", parent: null };
const msg = { documentName: "ChatMessage", getFlag: (s, k) => (k === "action" ? { actorUuid: "Actor.kai" } : undefined) };
console.log("--- on a character (Speed 5)");
console.log(await show("@Move[evade|distance:floor(speed/2)]", item));
console.log(await show("@Move[advance|distance:speed]", item));
console.log(await show("@Move[evade|distance:1]", item));
console.log(await show("@Move[charge|distance:speed+2|min:3|label:Charge]", item));
console.log(await show("@Move[evade|distance:floor(speed/2)]{Slip away}", item));
console.log("--- on a chat card of that character");
console.log(await show("@Move[evade|distance:floor(speed/2)]", msg));
kai.system.moveSpeed = 8; console.log("--- after the Speed changes to 8");
console.log(await show("@Move[evade|distance:floor(speed/2)]", item));
console.log(await show("@Move[advance|distance:speed]", item));
kai.system.moveSpeed = 5;
const hind = { ...sp(3), parent: null }; hind.system.speed = 6;   // base Speed 6, Hindered: current Speed 3
console.log("--- Hindered (base Speed 6, current Speed 3)");
console.log(await show("@Move[advance|distance:speed]", { documentName: "Item", parent: hind }));
console.log(await show("@Move[evade|distance:floor(speed/2)]", { documentName: "Item", parent: hind }));
console.log("--- with no character (a compendium item, a text without a document)");
console.log(await show("@Move[evade|distance:floor(speed/2)]", offItem));
console.log(await show("@Move[evade|distance:floor(speed/2)]"));
console.log("actorOfDoc:", I.actorOfDoc(item)?.name, I.actorOfDoc(msg)?.name, I.actorOfDoc(offItem), I.actorOfDoc(null), I.actorOfDoc({ documentName: "ChatMessage", getFlag() { throw new Error("x"); } }));
// ------------------------------------------------------------------ the colored line
console.log("--- the line on the left of a row");
const C = await import(ROOTURL + "module/config.mjs");
const it = (type, system = {}) => ({ type, system: { traits: new Set(), ...system } });
for (const [label, item] of [["Action, At-will", it("action", { frequency: "atwill" })], ["Action, Round", it("action", { frequency: "round" })], ["Action, Encounter", it("action", { frequency: "encounter" })], ["Talent that is an Action, Daily", it("action", { frequency: "daily" })], ["Weapon Action with no Frequency (counts as Round)", it("action", { traits: new Set(["weapon"]) })],
  ["passive Talent", it("talent")], ["passive Feature", it("feature")], ["Feature with a Frequency (Encounter)", it("feature", { frequency: "encounter" })], ["an unknown kind", it("mystery")], ["nothing at all", null]]) console.log(label.padEnd(50), C.lineColorFor(item));
