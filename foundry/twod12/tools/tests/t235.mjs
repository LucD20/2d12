// Run with: node tools/tests/run.mjs (or node tools/tests/t235.mjs)
// v0.0.346 (Lucas on v0.0.345): every field the compendium's settings use exists in the item data model (Foundry drops an unknown field and
// rejects a value outside a field's choices: Frightened's moveHow and Marked Quarry's dmgSub "W" were lost that way); the world pass for old
// copies; bars always shown; the stack card in the Reactions card's look; a 0 part left out of the pool line.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };

// 1. The settings' fields in the data model
const data = src("module/data.mjs"), s0 = data.indexOf("type: choice(TWOD12.effectSettings"), block = data.slice(s0, data.indexOf("}));", s0));
const { docs } = await import(ROOTURL + "tools/content.mjs");
const keys = new Set();
for (const d of docs) for (const st of d.system?.settings ?? []) for (const k of Object.keys(st)) keys.add(k);
const missing = [...keys].filter(k => !new RegExp(`(^|[\\s,{])${k}:`).test(block));
console.log("setting fields used by the compendium:", keys.size, "| missing from the data model:", missing.join(", ") || "none");
console.log("moveHow's choices:", /moveHow: choice\(\{ cant: "Not allowed", difficult: "Difficult Terrain" \}, "cant"\)/.test(block), "| dmgSub takes W:", block.includes('dmgSub: choice({ ...TWOD12.subtypes, W: "The weapon\'s" })'));

// 2. The world pass for the copies saved before: gone in v0.0.527 (F-033, Lucas: "I dont run any old world")
const main = src("module/twod12.mjs");

// 3. Bars always shown
console.log("new tokens:", main.includes("doc.updateSource({ displayBars: globalThis.CONST?.TOKEN_DISPLAY_MODES?.ALWAYS ?? 50 })"), "| the compendium's actors:", (src("tools/build-packs.mjs").match(/displayBars: 50/g) ?? []).length === 2);

// 4. The stack card
const S = await import(ROOTURL + "module/startstack.mjs");
let st = S.newStack([{ actorUuid: "A.s", name: "Sylwen", img: "", disp: 1, source: "Marked Quarry", action: "Mark Quarry", ap: 0, itemId: "i1", text: "choose a creature to mark" }, { actorUuid: "A.k", name: "Kaela", img: "", disp: 1, source: "Marked Quarry", action: "Mark Quarry", ap: 0, itemId: "i2", text: "choose" }]);
const h = S.stackHtml(st);
console.log("the Reactions card's look:", h.includes('class="twod12 chat rx2 startstack"') && h.includes('<div class="rx-hd"><span class="rx-ttl">Start of the Encounter</span></div>'), "| a grip, the Action, the Card:", h.includes('class="rx-grip ss-gm"') && h.includes('data-ss="use" data-i="0"') && h.includes('data-ss="card" data-i="0"'), "| no message text on the card:", !h.includes(">choose a creature"));
console.log("a drag order:", S.setOrder(st, [1, 0]).order.join(","), "| a wrong one is ignored:", S.setOrder(st, [1, 1]).order.join(","), "| none once resolving:", S.setOrder(S.startResolve(st), [1, 0]).order.join(","));

// 5. The pool line
const C = await import(ROOTURL + "module/chatcards.mjs");
const line = comps => C.poolBlock(comps).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log(line([{ pool: "B", sub: "Pi", total: 0 }, { pool: "B", sub: "Pi", total: 7 }, { pool: "B", sub: "Pi", total: 2 }]), "|", line([{ pool: "B", sub: "Pi", total: 0 }]));

// v0.0.347 (Lucas: "make Resolve automatically trigger the Actions like Reactions does")
const ss = src("module/startstack.mjs");
console.log("Resolve runs each row in turn:", ss.includes("while (st.cur >= 0)") && ss.includes("runRow(r, msg.id).then(finish"), "| on its answerer's client:", ss.includes('type: "ssRun", userId: who.id') && src("module/damage.mjs").includes('String(data.type).startsWith("ss")'), "| Done / Skip end a wait:", ss.includes("if (running?.msgId === msg.id) return running.finish(what === \"done\");"), "| the card while resolving:", S.stackHtml(S.startResolve(st)).includes("Resolving: the top row is used by its creature."));
