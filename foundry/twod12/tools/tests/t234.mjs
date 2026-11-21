// Run with: node tools/tests/run.mjs (or node tools/tests/t234.mjs)
// v0.0.345 (playtest 4, Step 2, the rules; book first): the start-of-the-encounter stack (Ch. 2), Daunted's Difficult Terrain and its line on
// the map (Ch. 8), Marked Quarry's extra damage of the weapon's subtype ("7 + 2 Pi" on the damage card).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8"), book = n => fs.readFileSync(ROOT + "../../book/" + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };

// 1. The book
console.log("Ch. 2 has the stack:", book("rules-src/02-turns.md").includes("### The Start of the Encounter") && book("rules-src/02-turns.md").includes("each of them waits in a **stack**, in the turn order. The GM can change that order"));
console.log("Daunted:", book("rules-src/08-conditions.md").includes("every square that brings you closer to the source is [[Difficult Terrain]] for you"), "| no 'can't willingly move closer' left:", !book("rules-src/08-conditions.md").includes("can't willingly move closer"));
console.log("Mark Quarry:", book("cards/archer.json").includes("those Actions deal [V] [Mod] extra damage (the same subtype as your weapon) on a Tier 1."), "| Diamond:", /"name": "Mark Quarry"[\s\S]*?"automation": "diamond"/.test(book("cards/archer.json")));

// 2. The stack (pure)
const S = await import(ROOTURL + "module/startstack.mjs");
let st = S.newStack([{ actorUuid: "A.chris", name: "Chris", source: "Marked Quarry", html: "choose" }, { actorUuid: "A.krysta", name: "Krysta", source: "Marked Quarry", html: "choose" }, { actorUuid: "A.orc", name: "Orc", source: "Ambush", html: "x" }]);
st = S.moveRow(st, 1, -1);
console.log("Krysta moved first:", st.order.join(","), "| the top can't go up:", S.moveRow(st, 1, -1).order.join(","));
st = S.startResolve(st);
console.log("resolving: now", st.cur, "| no moving now:", S.moveRow(st, 2, -1).order.join(","));
st = S.nextRow(st); st = S.nextRow(st, true);
console.log("states:", st.rows.map(r => `${r.name}:${r.state}`).join(" "), "| cur", st.cur);
st = S.nextRow(st);
console.log("resolved:", S.resolved(st), "| the card says it:", S.stackHtml({ ...st, first: "Chris" }).includes("<b>Chris</b>'s turn begins."));
const h0 = S.stackHtml(S.newStack([{ actorUuid: "A", name: "Lana", source: "Marked Quarry", html: "choose" }]));
console.log("before: Resolve and arrows for the GM only:", h0.includes('<div class="rx-ft ss-gm"><button type="button" class="rx-btn rx-pri" data-ss="resolve">') && h0.includes('class="rx-grip ss-gm"') /* v0.0.346: the drag grip */, "| combat start posts it:", src("module/mark.mjs").includes("postStartStack(combat)"), "| @Use names its creature:", src("module/automation.mjs").includes("|actor:${actor.uuid}") && src("module/freeuse.mjs").includes("cfg.actor ? await fromUuid(cfg.actor)"));

// 3. Daunted: a Movement limit as Difficult Terrain
const R = await import(ROOTURL + "module/fxrules.mjs");
const mig = R.migrate({ settings: [{ type: "move", text: "closer", moveHow: "difficult" }] }).rules[0];
console.log("the rule:", mig.kind, mig.dirm, mig.how, "|", R.plainText(R.sentence(mig, { originName: "the Ogre" })), "| label:", R.ruleLabel(mig));
const back = R.compile([mig], {}, "effect").settings.find(x => x.type === "move");
console.log("compiled:", back.text, back.moveHow, "| the old one stays a refusal:", R.migrate({ settings: [{ type: "move", text: "closer" }] }).rules[0].how);
const { docs: docs0 , OLD_CLASS_DOCS } = await import(ROOTURL + "tools/content.mjs");
const docs = [...docs0, ...OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
const fr = docs.find(d => d.name === "Daunted");
console.log("the Daunted condition:", JSON.stringify(fr.system.settings.find(x => x.type === "move")), "|", /closer to it is Difficult Terrain/.test(fr.system.description));
const mv = src("module/move.mjs");
console.log("the cost counts it:", mv.includes('moveLimitsOf(doc).some(l => l.how === "difficult" && moveLimitBreaks('), "| no refusal for it:", mv.includes('if (l.how === "difficult") continue;'));
const FL = await import(ROOTURL + "module/fearline.mjs");
console.log("the line's label:", FL.fearLabel({ name: "Daunted", source: "Ogre Chieftain", how: "difficult", dir: "closer", seen: true }), "|", FL.fearLabel({ name: "Daunted", source: "Ogre Chieftain", how: "difficult", dir: "closer", seen: false }));

// 4. Marked Quarry: [Mod] of the weapon's subtype, shown before it
const C = await import(ROOTURL + "module/chatcards.mjs");
console.log("pool line:", C.poolBlock([{ pool: "B", sub: "Pi", total: 7 }, { pool: "B", sub: "Pi", total: 2 }]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), "| two subtypes:", C.poolBlock([{ pool: "B", sub: "Sl", total: 6 }, { pool: "B", sub: "Fi", total: 4 }]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const mq = docs.find(d => d.name === "Mark Quarry" && d.type === "action").system.settings.find(x => x.type === "bonusdamage");
console.log("Marked Quarry's damage:", mq.dmg, mq.dmgSub, "| the roll resolves W to the weapon:", src("module/actions.mjs").includes('subtype: b.sub === "W" ? (weapon?.system?.subtype ?? "") : b.sub'), "| the sheet offers it:", src("module/fxsheet.mjs").includes('["W", "The weapon\'s"]'));
