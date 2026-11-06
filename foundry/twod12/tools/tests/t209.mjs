// Run with: node tools/tests/run.mjs (or node tools/tests/t209.mjs)
// v0.0.272 (pack RX, Lucas's design): the Reactions pass. The moments as settings on each Reaction, one chat message per moment with a row per
// creature and Reaction (Use / Pass for its owner), the GM's Skip all others, the auto-skip timer, the stack (last in, first out), the note when
// nobody can react, the Interrupts holding the damage (a Tier 3's half applied to it), the eight cards' moments.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
let ids = 0;
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => `id${++ids}`, escapeHTML: s => s } };
const emitted = [], created = [];
const users = [{ id: "gm", isGM: true, active: true }, { id: "p1", isGM: false, active: true }, { id: "p2", isGM: false, active: true }];
globalThis.Hooks = { on() {} };
globalThis.game = { settings: { get: (ns, k) => ({ reactionTimerOn: true, reactionTimer: 10 }[k] ?? true) }, user: users[0], users: Object.assign([...users], { get: id => users.find(u => u.id === id) }), socket: { emit: (ch, d) => emitted.push(d) }, combat: null, messages: { contents: [] } };
globalThis.ChatMessage = { create: async d => { const m = { ...d, id: `m${created.length}`, flags: d.flags, update: async u => { if (u.content) m.content = u.content; }, getFlag: (ns, k) => m.flags?.[ns]?.[k] }; created.push(m); return m; } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const M = await import(ROOTURL + "module/moment.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");

console.log("--- the moments are settings");
console.log("the moments:", Object.keys(TWOD12.moments).filter(Boolean).join(", "), "| each has its rules:", Object.keys(TWOD12.moments).filter(Boolean).every(k => M.MOMENTS[k]));
console.log("used on:", Object.keys(TWOD12.momentTargets).join(", "), "| the data model:", src("module/data.mjs").includes('momentSelf: bool(), momentTarget: choice(TWOD12.momentTargets, "subject"),'));
const hbs = src("templates/item-sheet.hbs");
console.log("the item sheet: Moment, Within, You too, Used on:", ["system.moment", "system.momentRange", "system.momentSelf", "system.momentTarget"].every(n => hbs.includes(`name="${n}"`)));

console.log("--- pure pieces");
console.log("sides: an ally", M.sideOk("ally", 1, 1, false, false), "| an enemy as an ally", M.sideOk("ally", 1, -1, false, false), "| you without You too", M.sideOk("ally", 1, 1, true, false), "| with", M.sideOk("ally", 1, 1, true, true), "| an enemy", M.sideOk("enemy", 1, -1, false, false), "| a neutral is no enemy", M.sideOk("enemy", 1, 0, false, false), "| you are never the enemy", M.sideOk("enemy", 1, -1, true, true));
console.log("a Distance in squares:", M.squaresOf("5"), M.squaresOf("weapon"), M.squaresOf(""), "| the clock:", M.clockText(600000), M.clockText(61001), M.clockText(-5));
const rows = [0, 1, 2].map(i => ({ i, state: "wait", order: 0, answerer: ["p1", "p2", "gm"][i] }));
M.answerRow(rows, 1, "use"); M.answerRow(rows, 0, "use");
console.log("Use twice (row 1 then row 0): resolves", M.stackOrder(rows).map(r => r.i).join(" then "), "| a second answer refused:", M.answerRow(rows, 1, "pass") === false, "| all answered:", M.allAnswered(rows));
const r2 = [0, 1, 2].map(i => ({ i, state: "wait", order: 0, answerer: ["p1", "gm", "p2"][i] }));
console.log("Skip all others: skipped", M.skipOthers(r2, "gm"), "| the GM's own row waits:", r2.map(r => r.state).join(","), "| the timer skips the rest:", M.skipAll(r2), r2.map(r => r.state).join(","));
const held = { B: { l: 7, n: 2 }, M: { l: 3, n: 0 } };
console.log("half of the held damage: taken off", M.halveHeld(held), JSON.stringify(held), "| came closer:", M.cameCloser([{ from: 5, to: 6 }, { from: 4, to: 3 }]), M.cameCloser([{ from: 2, to: 2 }]));

console.log("--- the message");
const st = { id: "x", hold: true, lead: "<b>Bandit</b>'s Strike would damage <b>Krysta</b>", text: "Interrupt: the <b>9</b> damage waits.", deadline: 600000, now: 0, done: false, rows: [
  { i: 0, name: "Nari", itemName: "Shield", ap: 1, kind: "interrupt", targetName: "Krysta", answerer: "p1", state: "use", order: 1, result: "" },
  { i: 1, name: "Lana", itemName: "Shot", ap: 1, kind: "interrupt", targetName: "Bandit", answerer: "p2", state: "use", order: 2, result: "" },
  { i: 2, name: "Orc", itemName: "Spite", ap: 1, kind: "trigger", targetName: "Krysta", answerer: "gm", state: "wait", order: 0, result: "" }] };
const html = M.rxCardHtml(st);
console.log("the system's card:", html.startsWith('<div class="twod12 chat action sysmsg rxmsg"'), "| title Reactions:", html.includes("<b>Reactions</b>") || html.includes(">Reactions<"), "| rows:", (html.match(/class="tline grantrow rxrow/g) ?? []).length);
console.log("the stack's places:", [...html.matchAll(/Resolves (\d\w\w)/g)].map(m => m[1]).join(", "), "| the order line:", html.match(/<div class="rx-order">[\s\S]*?<\/div>/)?.[0].replace(/<[^>]+>/g, ""));
console.log("Use / Pass only on the waiting row:", (html.match(/data-twod12="rxUse"/g) ?? []).length, (html.match(/data-twod12="rxPass"/g) ?? []).length, "| the timer:", html.match(/Auto-skip in <span class="rx-left">([^<]*)/)?.[1], "| Skip all others:", html.includes('data-twod12="rxSkip"'));
st.done = true;
const done = M.rxCardHtml(st);
console.log("answered: no buttons, no timer:", !/rxUse|rxSkip|rx-timer/.test(done), "|", done.match(/rx-done"><[^>]+><\/i> ([^<]*)/)?.[1]);

console.log("--- who is offered (tokens on the map)");
globalThis.canvas = { ready: true, grid: { size: 100, isSquare: true }, tokens: { placeables: [] } };
const mkItem = (id, name, sys) => ({ id, name, type: "action", getFlag: () => undefined, system: { reaction: true, reactionKind: "interrupt", momentRange: 0, momentSelf: false, momentTarget: "subject", distance: "", frequency: "atwill", traits: new Set(), versions: [{ ap: 1 }], ...sys } });
const mkTok = (id, name, x, disp, items, more = {}) => { const t = { id, name, document: { id, uuid: `Scene.s.Token.${id}`, x: x * 100, y: 0, width: 1, height: 1, disposition: disp, hidden: false }, setTarget() {} }; t.actor = { documentName: "Actor", uuid: `Actor.${id}`, name, type: "character", system: {}, statuses: new Set(), itemTypes: { action: items }, items: { get: i => items.find(x => x.id === i) }, getFlag: () => undefined, getActiveTokens: () => [t], testUserPermission: (u) => u.id === (more.owner ?? "gm"), ...more.actor }; return t; };
const paladin = mkTok("pal", "Nari", 2, 1, [mkItem("sof", "Shield", { moment: "strikeDamage", momentRange: 5, momentSelf: true }), mkItem("rbk", "Rebuke", { moment: "strikeAgainst", momentTarget: "source", reactionKind: "trigger", distance: "5" }), mkItem("di", "Interv", { moment: "wouldDown", momentRange: 5, momentSelf: true, frequency: "daily" })], { owner: "p1" });
const archer = mkTok("arc", "Lana", 9, 1, [mkItem("cs", "Shot", { moment: "strikeDamage", momentRange: 10, momentTarget: "source" })], { owner: "p2" });
const ally = mkTok("kry", "Krysta", 0, 1, []);
const bandit = mkTok("ban", "Bandit", 1, -1, [mkItem("bw", "Bulwark", { moment: "strikeDamage", momentRange: 5 })]);
const farBandit = mkTok("ban2", "Bandit 2", 30, -1, []);
canvas.tokens.placeables = [paladin, archer, ally, bandit, farBandit];
const P = t => ({ actor: t.actor, token: t, at: t });
let out = await M.collectReactions({ kinds: ["strikeDamage"], subjects: [P(ally)], source: P(bandit), only: "interrupt" });
console.log("a Strike would damage Krysta:", out.rows.map(r => `${r.actor.name}'s ${r.item.name} on ${r.target.token.name} (${r.dist} sq)`).join("; "), "| the enemy's own Reaction is not offered:", !out.rows.some(r => r.actor.name === "Bandit"));
out = await M.collectReactions({ kinds: ["strikeDamage"], subjects: [P(paladin)], source: P(bandit), only: "interrupt" });
console.log("a Strike would damage Nari herself: You too", out.rows.map(r => `${r.actor.name}'s ${r.item.name}`).join("; "));
out = await M.collectReactions({ kinds: ["strikeAgainst"], subjects: [P(ally)], source: P(bandit) });
console.log("a Strike against Krysta: Rebuke on", out.rows.map(r => r.target.token.name).join(", "), "| from far away (its Distance 5 sq.):", (await M.collectReactions({ kinds: ["strikeAgainst"], subjects: [P(ally)], source: P(farBandit) })).rows.length);
game.settings.get = (ns, k) => ({ reactionTimerOn: true, reactionTimer: 10 }[k] ?? true);
paladin.actor.getFlag = (ns, k) => (k === "dailyUsed" ? ["di"] : undefined);
out = await M.collectReactions({ kinds: ["wouldDown"], subjects: [P(ally)], source: null, only: "interrupt" });
console.log("Krysta would go Down, the Reaction used today: rows", out.rows.length, "| blocked:", out.blocked.map(b => `${b.item.name} (${b.why})`).join(", "));
await M.openMoment({ kinds: ["wouldDown"], subjects: [P(ally)], source: null, only: "interrupt", hold: true, plain: "<b>Krysta</b> would go Down", lead: "x" });
const note = created.at(-1);
console.log("nobody can react: one line", note.content.startsWith('<div class="twod12 chat sysline rxnote"'), "|", note.content.replace(/<[^>]+>/g, ""), "| whispered to", note.whisper.join(", "));
paladin.actor.getFlag = () => undefined;

console.log("--- the flow: answers, the stack, the held damage");
emitted.length = 0;
const wait = M.openMoment({ kinds: ["strikeDamage"], subjects: [P(ally)], source: P(bandit), only: "interrupt", hold: true, plain: "p", lead: "<b>Bandit</b>'s Strike would damage <b>Krysta</b>", text: "Interrupt" });
await new Promise(r => setTimeout(r, 20));
const msg = created.at(-1), rx = msg.flags.twod12.rx;
console.log("the message: rows", rx.rows.map(r => `${r.name}/${r.itemName}/${r.answerer}/${r.targetName}`).join(" ; "), "| the timer at 10 minutes:", Math.round((rx.deadline - Date.now()) / 60000));
await M.hostAnswer(rx.id, 1, "use", "p1");
console.log("someone else's row can't be answered: Lana's row", rx.rows[1].state);
await M.hostAnswer(rx.id, 1, "use", "p2");
M.hostAnswer(rx.id, 0, "use", "p1");   // the last answer: the stack resolves (each run waits for its owner's client)
await new Promise(r => setTimeout(r, 20));
const runs = emitted.filter(e => e.type === "rxRun");
console.log("all answered: the first to resolve is the last in:", runs.map(r => `${r.userId}:${r.data.itemId}`).join(" "), "| on", runs[0]?.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: runs[0].reqId, ok: true });
await new Promise(r => setTimeout(r, 20));
const runs2 = emitted.filter(e => e.type === "rxRun");
console.log("then the next:", runs2.slice(1).map(r => `${r.userId}:${r.data.itemId}`).join(" "), "| on", runs2[1]?.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: runs2[1].reqId, ok: true, half: { targetUuid: "Scene.s.Token.ban", source: "Shot", at: Date.now() } });
const res = await wait;
console.log("resolved:", res.used.map(u => `${u.itemId} ${u.ok ? "used" : "failed"}${u.half ? " (half)" : ""}`).join(", "), "| the message says:", msg.content.match(/rx-done"><[^>]+><\/i> ([^<]*)/)?.[1]);
// the GM's Skip all others and the Pass
const wait2 = M.openMoment({ kinds: ["strikeDamage"], subjects: [P(ally)], source: P(bandit), only: "interrupt", hold: true, plain: "p", lead: "l", text: "t" });
await new Promise(r => setTimeout(r, 20));
const rx2 = created.at(-1).flags.twod12.rx;
await M.hostAnswer(rx2.id, 0, "pass", "p1");
await M.hostAnswer(rx2.id, -1, "skipAll", "p2");
console.log("a player can't Skip all others:", rx2.rows.map(r => r.state).join(","));
await M.hostAnswer(rx2.id, -1, "skipAll", "gm");
console.log("the GM can:", rx2.rows.map(r => r.state).join(","), "| nothing used:", (await wait2).used.length);

// the damage moment itself: a Strike's damage to Krysta; the archer's Tier 3 halves the held damage
globalThis.fromUuid = async u => ({ "Actor.ban": bandit.actor }[u] ?? null);
const dm = M.damageMoment(ally.actor, { B: { l: 9, n: 0 }, M: { l: 0, n: 0 } }, { uuid: "Actor.ban", strike: true }, true);
await new Promise(r => setTimeout(r, 20));
const rx3 = created.at(-1).flags.twod12.rx;
console.log("the damage moment's message:", created.at(-1).content.match(/sm-lead">(.*?)<\/div>/)?.[1].replace(/<[^>]+>/g, ""), "|", created.at(-1).content.match(/sm-text">(.*?)<\/div>/)?.[1].replace(/<[^>]+>/g, ""));
emitted.length = 0;
await M.hostAnswer(rx3.id, 0, "pass", "p1");
M.hostAnswer(rx3.id, 1, "use", "p2");
await new Promise(r => setTimeout(r, 20));
M.onSocket({ type: "rxRunDone", reqId: emitted.find(e => e.type === "rxRun").reqId, ok: true, half: { targetUuid: "Scene.s.Token.ban", source: "Shot", at: Date.now() } });
console.log("the held damage is halved:", JSON.stringify(await dm));

console.log("--- the eight cards' moments (book texts unchanged)");
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const cards = f => JSON.parse(fs.readFileSync(ROOT + "../../book/cards/" + f, "utf8")).cards;
const all = [...cards("paladin.json"), ...cards("archer.json"), ...cards("basic-actions.json")];
const show = (name, sys) => `${name}: ${sys.moment} ${sys.momentRange ?? 0}${sys.momentSelf ? " +you" : ""}${sys.momentTarget === "source" ? " on the attacker" : ""} (${sys.reactionKind})`;
for (const n of ["Divine Intervention", "Shield of Faith", "Bulwark of Faith", "Covering Shot", "Rebuke", "Overwatch", "Opportunity Attack"]) console.log(show(n, CG.cardSystem(all.find(c => c.name === n), x => x)));
const step = CG.inlineCards(all.find(c => c.name === "Beacon")).find(c => c.name === "Beacon's Step");
console.log(show("Beacon's Step", CG.cardSystem(step, x => x)));
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
console.log("the Basic Action's data carries it:", BASIC_ACTIONS.opportunityAttack.moment, BASIC_ACTIONS.opportunityAttack.momentRange);

console.log("--- wired");
const dmg = src("module/damage.mjs"), act = src("module/actions.mjs"), tw = src("module/twod12.mjs"), mo = src("module/moment.mjs");
console.log("the damage waits for the Interrupts:", dmg.includes("const r = await M.damageMoment(actor, a, from, reachesHealth(actor, a));"), "| a Strike's damage card says so:", dmg.includes("from: { uuid: f.originUuid ?? \"\", strike: !!f.strike }"), "| the Triggers after it lands:", dmg.includes("M?.landedMoment(actor, a.B.l + a.B.n + a.M.l + a.M.n, from, downing);"), "| no second click while held:", dmg.includes("holding.has(msg.id)"));
console.log("a Strike and a Stand bring their moments:", act.includes("M.strikeMoment(actor, targets)") && act.includes("M.moveMoment(selfToken.document, null, null, { stand: true })"), "| a Reaction's step after a @Pause stays a button:", act.includes("applyAfterHtml(version, targets, selfToken, it.moment ? 1 : 0)"));
console.log("the chat and the socket:", tw.includes('["rxUse", "rxPass", "rxSkip"].includes(b.dataset.twod12)') && tw.includes('Hooks.on("renderChatMessageHTML", rxRender)') && dmg.includes('String(data.type).startsWith("rx")'), "| the settings at init:", tw.includes("registerReactionSettings();"), "| no Foundry window and no pick window in it:", !/DialogV2|pickWith|Dialog\./.test(mo));
console.log("the timer setting: on by default, 10 minutes:", /reactionTimerOn", \{[^}]*default: true/.test(mo) && /"reactionTimer", \{[^}]*default: 10/.test(mo));
