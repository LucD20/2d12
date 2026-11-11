// Run with: node tools/tests/run.mjs (or node tools/tests/t245.mjs)
// v0.0.362 (Lucas: layout A of foundry/mockups/turn-breakdown.html): the Turn Breakdown dock. The timeline (the turn start, the unused AP's
// Guard with its book link, Actions, a live movement, other creatures' Reactions in this turn), what ticks at the end of the turn, every Effect
// on the creature with its rounds (Guard included, an Effect given this turn too), the "End of X's Turn" line, and the wiring.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
const txt = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const T = await import(ROOTURL + "module/ticker.mjs");
const D = await import(ROOTURL + "module/turndock.mjs");

console.log("--- the rounds left");
console.log([{ duration: { type: "rounds", rounds: 2 } }, { duration: { type: "rounds", rounds: 2 }, remaining: 1 }, { duration: { type: "eot" } }, {}].map(D.roundsLeft).map(x => x || "(until removed)").join(" | "));

console.log("--- On Kaela: every Effect (one given this turn too), then her Guard");
const on = D.onRows([{ name: "Frightened (Orc Warrior)", flags: { duration: { type: "rounds", rounds: 1 } } }, { name: "Covering Fire: +1 Defense", flags: { duration: { type: "rounds", rounds: 2 } } }, { name: "Blinded", flags: { duration: { type: "eot" } } }, { name: "Off", disabled: true, flags: {} }], { apGuard: 8, guard: 6 });
console.log(on.map(r => `${r.name}${r.why ? ` (${r.why})` : ""}${r.badge ? ` [${r.badge}]` : ""}`).join(" | "));

console.log("--- the timeline");
const start = T.makeLine("start", "Turn start", 0, 4, 4, { b: 0, a: 1 });
const mark = { ...T.makeLine("act", "Mark Quarry", 4, 3, 4), at: "3:1" };
const adv = { ...T.makeLine("move", "Advance", 3, 2, 4), live: true, g: 7, at: "3:1" };
const m = D.dockModel({ who: "Kaela", round: 3, lines: [start, mark, adv], reacts: [{ who: "Durgan", line: T.makeLine("react", "Rebuke", 1, 1, 4, { b: 1, a: 0 }) }], live: { sq: 2 },
  ticks: [{ name: "Hindered", on: "Goblin Sneak", step: "tick", rem: 1 }, { name: "Vulnerable", on: "Orc Warrior", step: "end", rem: 0 }], on, apGuard: 8, ap: 2, rap: 1, max: 4 });
console.log(m.rows.map(r => `${r.kind}: ${r.name}${r.live ? " (live)" : ""}${r.why ? ` (${r.why})` : ""}`).join(" | "));
const html = D.dockHtml(m, false);
console.log("folded by default:", !html.includes("twod12-dock open"), "| unfolded:", D.dockHtml(m, true).includes("twod12-dock open"), "| the header:", txt(html.match(/<div class="td-hd"[\s\S]*?<\/span><\/span><\/div>/)[0]));
console.log("the body:", txt(D.bodyHtml(m)));
console.log("the unused AP links to the book:", html.includes('data-twod12-book="Unspent AP"'), "| the live dot:", html.includes("td-live"), "| the pips: 2 AP left, Reaction AP ready:", (html.match(/<span class="td-pips"[^>]*>(.*?)<\/span>/)?.[1].match(/<i class="(on|r on)">/g) ?? []).length === 3);

console.log("--- the movement's line: live, then finished with its squares");
const done = { ...T.makeLine("move", "Advance", 3, 2, 4), sq: 4 };
const fin = T.finishLive([start, mark, adv], done);
console.log(fin.map(l => `${l.n}${l.live ? " (live)" : ""}${l.sq !== undefined ? ` ${l.sq}` : ""}${l.at ? ` @${l.at}` : ""}`).join(" | "), "| no live line: added at the end:", T.finishLive([start], done).length);
console.log("finished, in the dock:", D.dockModel({ who: "Kaela", lines: fin }).rows.map(r => r.name).join(" | "));

console.log("--- the End of Kaela's Turn line");
const end = D.endCardHtml(D.dockModel({ who: "Kaela", round: 3, lines: fin, ticks: m.ticks, on, apGuard: 8, ap: 0, rap: 1 }));
console.log("one line that unfolds:", end.startsWith('<details class="twod12 chat turnend"><summary>'), "| its line:", txt(end.match(/<summary>[\s\S]*?<\/summary>/)[0]));
console.log("unfolded, what happened:", txt(end.match(/When the turn ended[\s\S]*?On Kaela/)[0]));

console.log("--- reading a combat");
const flags = (o) => ({ getFlag: (s, k) => o[k] });
const kaela = { id: "k", name: "Kaela", ...flags({ turnLog: [start, mark, adv], ap: 2, rap: 1, moveLeft: 4, freeMove: 0, evadeMove: 0 }), actor: { effects: [{ name: "Frightened (Orc Warrior)", flags: { twod12: { duration: { type: "rounds", rounds: 1 } } } }], system: { apGuard: 8 } } };
const durgan = { id: "d", name: "Durgan", ...flags({ turnLog: [{ ...T.makeLine("react", "Rebuke", 1, 1, 4, { b: 1, a: 0 }), at: "3:1" }, { ...T.makeLine("react", "Old Rebuke", 1, 1, 4), at: "2:1" }] }), actor: { effects: [], system: {} } };
globalThis.game = { user: { isGM: true } };
const mm = D.modelFor({ round: 3, turn: 1, combatants: [kaela, durgan] }, kaela, { ticks: [] });
console.log("rows:", mm.rows.map(r => r.name).join(" | "), "| moved so far: 7 - 4 left =", mm.rows.find(r => r.live)?.name, "| On Kaela:", mm.on.map(r => r.name).join(", "));

console.log("--- the wiring");
const td = src("module/turndock.mjs"), fx = src("module/effects.mjs"), tw = src("module/twod12.mjs"), cb = src("module/combat.mjs"), mv = src("module/move.mjs"), tk = src("module/ticker.mjs"), css = src("styles/system.css");
console.log("Export Chat Log hidden, the Turn button in its place:", td.includes('exp.classList.add("twod12-hidden");') && td.includes("exp.before(makeTurnButton())") && td.includes("new MutationObserver("), "| v0.0.363 the dock is its own fixed element above the chat input:", td.includes('dock.id = "twod12-dock"') && td.includes("window.innerHeight - r.top + 4") && css.includes("#twod12-dock { position: fixed;"), "| Export Chat Log on the Journal tab:", td.includes('Hooks.on("renderJournalDirectory"') && td.includes("game.messages?.export"), "| per client:", td.includes('"turnDockShown", { scope: "client"') && td.includes('"turnDockOpen", { scope: "client"'));
console.log("the durations hook and the dock share one rule:", fx.includes("for (const x of pendingSteps(combat, ended, prior))") && tw.includes("registerTurnDock({ pendingSteps })"), "| the End line after the ticks:", fx.includes("await postTurnEnd(combat, ended, done.map("), "| shown bare:", tw.includes('c.firstElementChild.classList.contains("turnend")'));
console.log("no ticker message:", !tk.includes("ChatMessage.create"), "| no unused AP chat line:", !cb.includes("unused AP (${unused})"), "| the movement live from its start:", mv.includes("T.logLive(c, T.makeLine(\"move\""), "| the CSS:", css.includes(".twod12-dock .td-hd") && css.includes(".twod12.chat.turnend"));
