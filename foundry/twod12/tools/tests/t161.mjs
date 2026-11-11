// Run with: node tools/tests/run.mjs (or node tools/tests/t161.mjs)
// v0.0.200 (Lucas, design M1 + L3): the AP ticker and its Turn Log: one message per event, the log a snapshot in the message's flags.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
const posted = [];
globalThis.ChatMessage = { create: async d => { posted.push(d); return d; } };
const T = await import(ROOTURL + "module/ticker.mjs");
// v0.0.362: logEvent no longer posts a message (the Turn Breakdown dock shows the log); the ticker HTML is still built for the older messages
const real = []; const ev = async (c, line) => { const before = posted.length; const lines = await T.logEvent(c, line); if (posted.length !== before) real.push(1); posted.push({ content: T.tickerHtml(c.name, lines), flags: { twod12: { ticker: { lines } } } }); };
const mk = name => { const f = {}; return { id: name, name, isOwner: true, getFlag: (s, k) => f[k], setFlag: async (s, k, v) => { f[k] = JSON.parse(JSON.stringify(v)); }, f }; };
const show = d => d.flags.twod12.ticker.lines.map(l => `${T.ICON[l.k]} ${l.n} ${l.c} [${l.b}→${l.a}, red ${l.s}, of ${l.m}]`).join(" | ");
console.log("--- Lana's turn: start, Advance, Weapon Attack");
const lana = mk("Lana"), kai = mk("Kai");
await ev(lana, T.makeLine("start", "Turn start", 0, 5, 5));
await ev(lana, T.makeLine("move", "Advance", 5, 4, 5));
await ev(lana, T.makeLine("act", "Weapon Attack", 4, 3, 5));
posted.forEach((d, i) => console.log(`message ${i + 1}:`, show(d)));
console.log("--- Kai's turn; Lana reacts in it (her own turn-cycle goes on)");
await ev(kai, T.makeLine("start", "Turn start", 0, 5, 5));
await ev(lana, T.makeLine("react", "Opportunity Attack", 3, 2, 5));
console.log("Kai:", show(posted.at(-2)), "|| Lana's Reaction:", show(posted.at(-1)));
console.log("--- Lana's next turn starts a new log; Quickened 2 (7 AP)");
await ev(lana, T.makeLine("start", "Turn start", 2, 7, 7));
await ev(lana, T.makeLine("act", "Smite", 7, 4, 7));
console.log(show(posted.at(-1)));
console.log("the snapshot is not changed by later events:", show(posted[0]));
console.log("--- the HTML");
const h = posted[2].content;
console.log("closed: one summary line with the pips", (h.match(/<summary>/g) ?? []).length === 1 && h.includes('class="tk-pips"'), "| open: the log, the clicked line highlighted, the earlier muted:", (h.match(/class="tl-ln old"/g) ?? []).length, (h.match(/class="tl-ln now"/g) ?? []).length,
  "| pips of the Weapon Attack:", (h.match(/<summary>.*?<\/summary>/s)[0].match(/<i class="(on|spent|)">/g) ?? []).map(x => x.match(/"(.*)"/)[1] || "grey").join(","), "| movement tinted:", posted[1].content.includes('class="tk mv"'), "| 7 pips (Quickened):", (posted.at(-1).content.match(/tk-pips many/g) ?? []).length > 0);
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("wired: no plain AP lines", !src("module/combat.mjs").includes("apMessage"), "| an edit posts nothing", src("module/combat.mjs").includes('const line = quiet || why === "edited" ? null :'), "| the movement's line once, when it ends", src("module/move.mjs").includes('await logMoveDone(c, { ...makeLine("move", name, after + ap, after,'), "| no message posted by logEvent:", real.length === 0, "| before another Action", src("module/combat.mjs").includes("await closeMoveLine(c);"));
