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
globalThis.game = { settings: { get: (ns, k) => ({ reactionTimerOn: true, reactionTimer: 1 }[k] ?? true) }, user: users[0], users: Object.assign([...users], { get: id => users.find(u => u.id === id) }), socket: { emit: (ch, d) => emitted.push(d) }, combat: null, messages: { get contents() { return created; } } };
globalThis.ChatMessage = { create: async d => { const m = { ...d, id: `m${created.length}`, flags: d.flags, update: async u => { if (u.content) m.content = u.content; }, delete: async () => { const k = created.indexOf(m); if (k >= 0) created.splice(k, 1); m.deleted = true; }, getFlag: (ns, k) => m.flags?.[ns]?.[k] }; created.push(m); return m; } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const M = await import(ROOTURL + "module/moment.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");

console.log("--- the moments are settings");
console.log("the moments:", Object.keys(TWOD12.moments).filter(Boolean).join(", "), "| each has its rules:", Object.keys(TWOD12.moments).filter(Boolean).every(k => M.MOMENTS[k]));
console.log("used on:", Object.keys(TWOD12.momentTargets).join(", "), "| the data model:", src("module/data.mjs").includes('momentSelf: bool(), momentTarget: choice(TWOD12.momentTargets, "subject"),'));
const hbs = (src("templates/item-sheet.hbs") + src("module/actionsheet.mjs"));
console.log("the item sheet: Moment, Within, You too, Used on:", ["system.moment", "system.momentRange", "system.momentSelf", "system.momentTarget"].every(n => hbs.includes(`"${n}"`) || hbs.includes(`name="${n}"`)));

console.log("--- pure pieces");
console.log("sides: an ally", M.sideOk("ally", 1, 1, false, false), "| an enemy as an ally", M.sideOk("ally", 1, -1, false, false), "| you without You too", M.sideOk("ally", 1, 1, true, false), "| with", M.sideOk("ally", 1, 1, true, true), "| an enemy", M.sideOk("enemy", 1, -1, false, false), "| a neutral is no enemy", M.sideOk("enemy", 1, 0, false, false), "| you are never the enemy", M.sideOk("enemy", 1, -1, true, true));
console.log("a Distance in squares:", M.squaresOf("5"), M.squaresOf("weapon"), M.squaresOf(""), "| the clock:", M.clockText(600000), M.clockText(61001), M.clockText(-5));
const rows = [0, 1, 2].map(i => ({ i, state: "wait", order: 0, answerer: ["p1", "p2", "gm"][i] }));
M.answerRow(rows, 1, "use"); M.answerRow(rows, 0, "use");
console.log("Use twice (row 1 then row 0): resolves", M.stackOrder(rows).map(r => r.i).join(" then "), "| a second answer refused:", M.answerRow(rows, 1, "pass") === false, "| all answered:", M.allAnswered(rows));
const r2 = [0, 1, 2].map(i => ({ i, state: "wait", order: 0, answerer: ["p1", "gm", "p2"][i] }));
console.log("Skip all others: skipped", M.skipOthers(r2), "| the GM's own row too (v0.0.274):", r2.map(r => r.state).join(","), "| the timer has nothing left:", M.skipAll(r2));
const held = { B: { l: 7, n: 2 }, M: { l: 3, n: 0 } };
console.log("half of the held damage: taken off", M.halveHeld(held), JSON.stringify(held), "| came closer:", M.cameCloser([{ from: 5, to: 6 }, { from: 4, to: 3 }]), M.cameCloser([{ from: 2, to: 2 }]));

console.log("--- the message (v0.0.275: the stack card; details in t210)");
const st = { v: 2, id: "x", hold: true, deadline: 600000, now: 0, done: false, base: { kind: "strike", label: "Strike", face: { name: "Bandit" }, target: { name: "Krysta" }, held: 9 }, rows: [
  { i: 0, actorUuid: "A.n", name: "Nari", itemName: "Shield", ap: 1, kind: "interrupt", targetName: "Krysta", answerer: "p1", state: "use", order: 1, result: "", color: "#f0b54a" },
  { i: 1, actorUuid: "A.l", name: "Lana", itemName: "Shot", ap: 1, kind: "interrupt", targetName: "Bandit", answerer: "p2", state: "use", order: 2, result: "", color: "#5fc4c0" },
  { i: 2, actorUuid: "A.o", name: "Orc", itemName: "Spite", ap: 1, kind: "trigger", targetName: "Krysta", answerer: "gm", state: "wait", order: 0, result: "" }] };
const html = M.rxCardHtml(st);
console.log("the card:", html.startsWith('<div class="twod12 chat rx2"'), "| title Reactions:", html.includes('<span class="rx-ttl">Reactions</span>'), "| waiting rows:", (html.match(/class="rx-dl"/g) ?? []).length, "| slabs:", (html.match(/class="rx-it[ "]/g) ?? []).length);
console.log("the stack, top first:", [...html.matchAll(/<b>(Shield|Shot)<\/b>/g)].map(m => m[1]).join(", "), "| the base:", html.match(/rx-bw">(.*?)<\/span>/)?.[1].replace(/<[^>]+>/g, ""), "|", html.match(/rx-out dmg">([^<]*)/)?.[1]);
console.log("Use / Pass only on the waiting row:", (html.match(/data-twod12="rxUse"/g) ?? []).length, (html.match(/data-twod12="rxPass"/g) ?? []).length, "| the timer:", html.match(/rx-left">([^<]*)/)?.[1], "| Skip all others:", html.includes('data-twod12="rxSkip"'));
st.done = true;
const done = M.rxCardHtml(st);
console.log("answered: no buttons, no timer:", !/rxUse|rxSkip|rx-tm/.test(done), "| one line that unfolds:", done.includes('class="rx-line" data-twod12="rxFold"'));

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
game.settings.get = (ns, k) => ({ reactionTimerOn: true, reactionTimer: 1 }[k] ?? true);
paladin.actor.getFlag = (ns, k) => (k === "dailyUsed" ? ["di"] : undefined);
out = await M.collectReactions({ kinds: ["wouldDown"], subjects: [P(ally)], source: null, only: "interrupt" });
console.log("Krysta would go Down, the Reaction used today: rows", out.rows.length, "| blocked:", out.blocked.map(b => `${b.item.name} (${b.why})`).join(", "));
await M.openMoment({ kinds: ["wouldDown"], subjects: [P(ally)], source: null, only: "interrupt", hold: true, plain: "<b>Krysta</b> would go Down", lead: "x" });
const note = created.at(-1);
console.log("nobody can react: one line", note.content.startsWith('<div class="twod12 chat sysline rxnote"'), "|", note.content.replace(/<[^>]+>/g, ""), "| whispered to", note.whisper?.join(", ") ?? "nobody (v0.0.347: for everyone)");
paladin.actor.getFlag = () => undefined;

console.log("--- the flow: answers, the stack, the held damage");
emitted.length = 0;
const wait = M.openMoment({ kinds: ["strikeDamage"], subjects: [P(ally)], source: P(bandit), only: "interrupt", hold: true, plain: "p", lead: "<b>Bandit</b>'s Strike would damage <b>Krysta</b>", text: "Interrupt" });
await new Promise(r => setTimeout(r, 20));
const msg = created.at(-1), rx = msg.flags.twod12.rx;
console.log("the message: rows", rx.rows.map(r => `${r.name}/${r.itemName}/${r.answerer}/${r.targetName}`).join(" ; "), "| the timer at 1 minute:", Math.round((rx.deadline - Date.now()) / 60000));
await M.hostAnswer(rx.id, 1, "use", "p1");
console.log("someone else's row can't be answered: Lana's row", rx.rows[1].state);
await M.hostAnswer(rx.id, 1, "use", "p2");
await M.hostAnswer(rx.id, 0, "use", "p1");   // every row answered, two on the stack: it waits for Resolve (v0.0.273)
console.log("two on the stack wait for Resolve:", rx.ready, "| nothing run yet:", emitted.filter(e => e.type === "rxRun").length, "| Resolve and the grips on the message:", msg.content.includes('data-twod12="rxResolve"'), (msg.content.match(/class="rx-grip"/g) ?? []).length);
await M.hostAnswer(rx.id, 1, "up", "nobody");
console.log("one who isn't in it can't change the order: first", M.stackOrder(rx.rows)[0].itemName);
await M.hostAnswer(rx.id, 1, "up", "p2");
console.log("v0.0.275: a reactor can't change the order (the GM drags): first", M.stackOrder(rx.rows)[0].itemName);
await M.hostAnswer(rx.id, 1, "up", "gm");
console.log("the GM moved Lana's row up: first", M.stackOrder(rx.rows)[0].itemName, "| the numbers on the slabs:", [...msg.content.matchAll(/rx-num">(\d)<\/span><span class="rx-sw"[^>]*><\/span>.*?<b>(Sh\w+)<\/b>/g)].map(m => `${m[1]}.${m[2]}`).join(" "));
await M.hostAnswer(rx.id, -1, "pause", "p1");
console.log("the clock paused:", rx.paused, msg.content.includes("rx-tm paused"), "| no countdown while paused:", !/rx-tm paused" data-twod12="rxPause" data-deadline/.test(msg.content));
await M.hostAnswer(rx.id, -1, "pause", "p1");
console.log("and going on:", !rx.paused, "| about a minute left:", Math.round((rx.deadline - Date.now()) / 60000));
await M.hostAnswer(rx.id, -1, "resolve", "p1");
console.log("v0.0.275: a reactor can't Resolve:", emitted.filter(e => e.type === "rxRun").length);
M.hostAnswer(rx.id, -1, "resolve", "gm");   // the stack resolves (each run waits for its owner's client)
await new Promise(r => setTimeout(r, 20));
const runs = emitted.filter(e => e.type === "rxRun");
console.log("Resolve: the first to resolve:", runs.map(r => `${r.userId}:${r.data.itemId}`).join(" "), "| on", runs[0]?.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: runs[0].reqId, ok: true, half: { targetUuid: "Scene.s.Token.ban", source: "Shot", at: Date.now() } });
await new Promise(r => setTimeout(r, 20));
const runs2 = emitted.filter(e => e.type === "rxRun");
console.log("then the next:", runs2.slice(1).map(r => `${r.userId}:${r.data.itemId}`).join(" "), "| on", runs2[1]?.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: runs2[1].reqId, ok: true });
const res = await wait;
console.log("resolved:", res.used.map(u => `${u.itemId} ${u.ok ? "used" : "failed"}${u.half ? " (half)" : ""}`).join(", "), "| the message is resolved in place:", msg.content.includes("rx2 rx-done"));
console.log("v0.0.275: not posted again (edited in place):", created.at(-1) === msg);
// the GM's Skip all others and the Pass
const wait2 = M.openMoment({ kinds: ["strikeDamage"], subjects: [P(ally)], source: P(bandit), only: "interrupt", hold: true, plain: "p", lead: "l", text: "t" });
await new Promise(r => setTimeout(r, 20));
const rx2 = created.at(-1).flags.twod12.rx;
await M.hostAnswer(rx2.id, 0, "pass", "gm");
console.log("v0.0.274: the GM answers a player's row:", rx2.rows[0].state, "| a player can't answer another's:", (await M.hostAnswer(rx2.id, 1, "pass", "p1"), rx2.rows[1].state));
await M.hostAnswer(rx2.id, -1, "skipAll", "p2");
console.log("a player can't Skip all others:", rx2.rows.map(r => r.state).join(","));
await M.hostAnswer(rx2.id, -1, "skipAll", "gm");
console.log("the GM can:", rx2.rows.map(r => r.state).join(","), "| nothing used:", (await wait2).used.length);

// the damage moment itself: a Strike's damage to Krysta; the archer's Tier 3 halves the held damage
globalThis.fromUuid = async u => ({ "Actor.ban": bandit.actor }[u] ?? null);
const dm = M.damageMoment(ally.actor, { B: { l: 9, n: 0 }, M: { l: 0, n: 0 } }, { uuid: "Actor.ban", strike: true }, true);
await new Promise(r => setTimeout(r, 20));
const rx3 = created.at(-1).flags.twod12.rx;
console.log("the damage moment's message: the base slab", created.at(-1).content.match(/rx-bw">(.*?)<\/span><span class="rx-out dmg">([^<]*)/)?.slice(1).map(s => s.replace(/<[^>]+>/g, "")).join(" | "), "| its face:", rx3.base.face.name, "| the Interrupt tag:", created.at(-1).content.includes('Can react <span class="rx-tag">INTERRUPT</span>'));
emitted.length = 0;
await M.hostAnswer(rx3.id, 0, "pass", "p1");
M.hostAnswer(rx3.id, 1, "use", "p2");
await new Promise(r => setTimeout(r, 20));
M.onSocket({ type: "rxRunDone", reqId: emitted.find(e => e.type === "rxRun").reqId, ok: true, half: { targetUuid: "Scene.s.Token.ban", source: "Shot", at: Date.now() } });
console.log("the held damage is halved:", JSON.stringify(await dm));

console.log("--- v0.0.273: the order, the clock, Move back, the Action's link");
const rr = [{ i: 0, state: "use", order: 1 }, { i: 1, state: "use", order: 2 }, { i: 2, state: "use", order: 3 }];
console.log("resolves:", M.stackOrder(rr).map(r => r.i).join(","), "| 0 sooner:", M.moveInStack(rr, 0, "up"), M.stackOrder(rr).map(r => r.i).join(","), "| the first can't go sooner:", M.moveInStack(rr, 2, "up"), "| the last can't go later:", M.moveInStack(rr, M.stackOrder(rr).at(-1).i, "down"));
console.log("who manages:", M.mayManage({ rows: [{ answerer: "p1" }] }, { id: "p1" }), M.mayManage({ rows: [{ answerer: "p1" }] }, { id: "p2" }), M.mayManage({ rows: [] }, { id: "gm", isGM: true }), "| time left paused:", M.timeLeft({ paused: true, left: 41000 }), M.timeLeft({ deadline: 5000 }, 2000));
const bk = M.rxCardHtml({ v: 2, rows: [], deadline: 0, base: { kind: "move", squares: 4, back: { name: "Orc", squares: 4, used: false } } }), bkUsed = M.rxCardHtml({ v: 2, rows: [], deadline: 0, base: { kind: "move", squares: 4, back: { name: "Orc", squares: 4, used: true } } });
console.log("Move back (v0.0.275: on the base slab):", bk.match(/data-twod12="rxBack" data-tooltip="([^"]*)"/)?.[1], "| used:", bkUsed.match(/rx-backed" aria-label="([^"]*)"/)?.[1]);
console.log("the Action's name opens it:", html.includes('data-twod12="rxOpen" data-row="2"'), "| the item sheet's section:", hbs.includes('"A Reaction"'));
const mo2 = src("module/moment.mjs");
console.log("the move's movement kept before it (refunded on Move back):", mo2.includes("const flags = c ? { freeMove: Number(c.getFlag(F, \"freeMove\")) || 0") && mo2.includes("await doc.update({ x: to.x, y: to.y }, { twod12Forced: true, animate: true });"));
const cb = src("module/combat.mjs"), car = src("module/carousel.mjs");
console.log("v0.0.310: the Initiative button: the GM opens the Initiative window, a player rolls their own:", car.includes('if (k === "init") return rollPendingInitiative(combat);') && cb.includes("btn.addEventListener(\"click\", () => rollPendingInitiative(combat));") && cb.includes("return openInitiative(combat);") && cb.includes("return combat.rollInitiative(ids);"), "| no chip on the strip any more:", !car.includes('data-tc="initskip"'));
const MS = await import(ROOTURL + "module/moveseq.mjs");
MS.newMoveAction("c1"); const k1 = MS.moveActionOf("c1"); MS.newMoveAction("c1");
console.log("v0.0.274: a new Move Action, a new key (Opportunity Attack again after a second Advance):", k1, MS.moveActionOf("c1"), "| counted by move.mjs:", src("module/move.mjs").includes("if (spent && !useEvade) newMoveAction(c.id);") && src("module/move.mjs").includes('if (kind !== "evade") newMoveAction(c.id);'), "| the moment's key:", src("module/moment.mjs").includes("|${moveActionOf(cbt?.id)}`;"));

console.log("--- the eight cards' moments (book texts unchanged)");
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const cards = f => JSON.parse(fs.readFileSync(ROOT + "../../book/cards/" + f, "utf8")).cards;
const all = [...cards("paladin.json"), ...cards("archer.json"), ...cards("basic-actions.json")];
const show = (name, sys) => `${name}: ${sys.moment} ${sys.momentRange ?? 0}${sys.momentSelf ? " +you" : ""}${sys.momentTarget === "source" ? " on the attacker" : ""} (${sys.reactionKind})`;
for (const n of ["Divine Intervention", "Shield of Faith", "Bulwark of Faith", "Covering Shot", "Rebuke", "Overwatch", "Opportunity Attack"]) console.log(show(n, CG.cardSystem(all.find(c => c.name === n), x => x)));
const step = CG.inlineCards(all.find(c => c.name === "Beacon")).find(c => c.name === "Beacon's Step");
console.log(show("Beacon's Step", CG.cardSystem(step, x => x)));
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
const { OA, OA_IS_BASIC } = await import("./oa-card.mjs");   // v0.0.407: set aside
console.log("the card (set aside) carries it:", OA.moment, OA.momentRange, "| no longer a Basic Action:", !OA_IS_BASIC);

console.log("--- wired");
const dmg = src("module/damage.mjs"), act = src("module/actions.mjs"), tw = src("module/twod12.mjs"), mo = src("module/moment.mjs");
console.log("the damage waits for the Interrupts:", dmg.includes("const r = await M.damageMoment(actor, a, from, reachesHealth(actor, a), { shared: !!opts.shared });"), "| a Strike's damage card says so:", dmg.includes("from: { uuid: f.originUuid ?? \"\", strike: !!f.strike }"), "| the Triggers after it lands:", dmg.includes("M?.landedMoment(actor, a.B.l + a.B.n + a.M.l + a.M.n, from, downing);"), "| no second click while held:", dmg.includes("holding.has(msg.id)"));
console.log("a Strike and a Stand bring their moments:", act.includes("M.strikeMoment(actor, targets)") && act.includes("M.moveMoment(selfToken.document, null, null, { stand: true })"), "| a Reaction's step after a @Pause stays a button:", act.includes("applyAfterHtml(version, targets, selfToken, it.moment ? 1 : 0)"));
console.log("the chat and the socket:", tw.includes("else if (/^rx[A-Z]/.test(b.dataset.twod12)) await rxClick(msg, b, ev);") && tw.includes('Hooks.on("renderChatMessageHTML", rxRender)') && dmg.includes('String(data.type).startsWith("rx")'), "| the settings at init:", tw.includes("registerReactionSettings();"), "| no Foundry window and no pick window in it:", !/DialogV2|pickWith|Dialog\./.test(mo));
console.log("the timer setting: off by default (v0.0.282), 1 minute when on (v0.0.273):", /reactionTimerOn", \{[^}]*default: false/.test(mo) && /"reactionTimer", \{[^}]*default: 1,/.test(mo));
