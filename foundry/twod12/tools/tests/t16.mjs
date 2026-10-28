// Run with: node tools/tests/run.mjs (or node tools/tests/t16.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.foundry = { utils: { getRoute: p => "/" + p }, applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, dice: { terms: { OperatorTerm: class { constructor(o) { this.operator = o.operator; } } } } };
globalThis.Hooks = { on() {} };
const msgs = [];
globalThis.ChatMessage = { create: async d => msgs.push(d), getSpeaker: () => ({}) };
globalThis.game = { socket: { emit() {}, on() {} }, user: {} };
const { traitChevrons, apIcon } = await import(ROOTURL + "module/config.mjs");
console.log(traitChevrons(new Set(["weapon", "attack", "melee", "divine", "twohanded"])).replace(/ data-tooltip="[^"]*"/g, ""));
console.log(apIcon(3));
const { postDamageCard } = await import(ROOTURL + "module/dmgcard.mjs");
const dice = [{ faces: 8, results: [5] }];
await postDamageCard({ title: "Lay on Hands", subtitle: "Damage • Tier 3", comps: [{ pool: "B", sub: "H", kind: "D", formula: "1d8", total: 5, dice }, { pool: "M", sub: "", heal: true, kind: "D", formula: "1d6+2", total: 6, dice }], targets: [{ uuid: "x", name: "Orc" }] });
const html = msgs[0].content;
console.log(/Healing • Mind/.test(html), /applyHealing/.test(html), /applyDamage/.test(html), html.indexOf("applyDamage") < html.indexOf("applyHealing"), JSON.stringify(msgs[0].flags.twod12.dmgCard.comps));
await postDamageCard({ title: "Bless", subtitle: "x", comps: [{ pool: "B", sub: "", heal: true, kind: "D", formula: "1d6", total: 4, dice }] });
const h2 = msgs[1].content;
console.log("heal-only:", /applyHealing/.test(h2), !/applyDamage/.test(h2), /Healing <b>4<\/b>/.test(h2));
// combineRolls
globalThis.Roll = { fromTerms: t => ({ terms: t }) };
const { combineRolls } = await import(ROOTURL + "module/roll.mjs");
const c = combineRolls([{ terms: ["a", "b"] }, { terms: ["c"] }, null, { terms: ["d"] }]);
console.log(c.terms.map(t => t.operator ?? t).join(" "));
