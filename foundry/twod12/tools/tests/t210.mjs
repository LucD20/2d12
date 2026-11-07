// Run with: node tools/tests/run.mjs (or node tools/tests/t210.mjs)
// v0.0.275 (pack RX-2, Lucas's design 2026-11-07): the Reactions message redesigned: the stack card (faces, a "pick one" group per creature with
// several Reactions to the same Action: one Use only, Pass removes the row), the GM's drag order and the map pins that follow it, the resolved
// message edited in place (one line that unfolds: the snapshot and the frozen stack), the result chips (blocked, tier, final damage, "never
// lands", "1R spent", "N hits"), the movement base slab with Move back, the map overlay's setting.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
let ids = 0;
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => `id${++ids}`, escapeHTML: s => s } };
const emitted = [], created = [], settings = [];
const users = [{ id: "gm", isGM: true, active: true }, { id: "p1", isGM: false, active: true }, { id: "p2", isGM: false, active: true }];
globalThis.Hooks = { on() {} };
globalThis.game = { settings: { get: (ns, k) => ({ reactionTimerOn: true, reactionTimer: 1 }[k] ?? true), register: (ns, k, d) => settings.push([k, d]) }, user: users[0], users: Object.assign([...users], { get: id => users.find(u => u.id === id) }), socket: { emit: (ch, d) => emitted.push(d) }, combat: null, messages: { get contents() { return created; } } };
let updates = 0;
globalThis.ChatMessage = { create: async d => { const m = { ...d, id: `m${created.length}`, flags: d.flags, update: async u => { updates++; if (u.content) m.content = u.content; }, delete: async () => { const k = created.indexOf(m); if (k >= 0) created.splice(k, 1); m.deleted = true; }, getFlag: (ns, k) => m.flags?.[ns]?.[k] }; created.push(m); return m; } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const M = await import(ROOTURL + "module/moment.mjs");
const O = await import(ROOTURL + "module/rxoverlay.mjs");
const tick = () => new Promise(r => setTimeout(r, 20));
const txt = h => String(h ?? "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log("--- pure pieces");
console.log("initials:", M.initials("Bandit Thug"), M.initials("Nari"), M.initials(""), "| colors in the order used:", [0, 1, 2, 3, 4].map(M.colorFor).join(" "));
const def = { who: "ally" }, en = { who: "enemy" };
console.log("roles from the Reaction's own data: a Strike", M.roleOf({ system: { traits: new Set(["strike"]) } }, def), "| used on the attacker", M.roleOf({ system: { momentTarget: "source", traits: new Set() } }, def), "| on an ally", M.roleOf({ system: { traits: new Set() } }, def), "| on an enemy (a movement)", M.roleOf({ system: { traits: new Set() } }, en), "| no side", M.roleOf({ system: {} }, null));
const pts = M.pathSquares([{ x: 0, y: 0 }, { x: 300, y: 0 }, { x: 300, y: 200 }], 100);
console.log("the path's squares:", pts.map(p => `${p.x / 100},${p.y / 100}`).join(" "), "| a big token's squares are its size:", M.pathSquares([{ x: 0, y: 0 }], 100, 2, 2)[0].w);

console.log("--- one Reaction per creature for the same Action (the book, Chapter 2): the \"pick one\" group");
const mk = () => [
  { i: 0, actorUuid: "A.pal", answerer: "p1", state: "wait", order: 0, kind: "interrupt" },
  { i: 1, actorUuid: "A.pal", answerer: "p1", state: "wait", order: 0, kind: "interrupt" },
  { i: 2, actorUuid: "A.arc", answerer: "p2", state: "wait", order: 0, kind: "interrupt" }];
let rows = mk();
console.log("groups:", M.waitingGroups(rows).map(g => g.map(r => r.i).join("+")).join(" | "));
M.answerGroup(rows, 1, "use");
console.log("Use one option: its group is answered:", rows.map(r => `${r.i}:${r.state}`).join(" "), "| the other option can't be used now:", M.answerGroup(rows, 0, "use") === false, "| its color:", rows[1].color);
rows = mk(); M.answerGroup(rows, 0, "pass");
console.log("Pass on the group passes both:", rows.map(r => r.state).join(","), "| groups left:", M.waitingGroups(rows).length);

console.log("--- the live card");
const face = (name, disp) => ({ name, ini: M.initials(name), img: "", disp, uuid: `Scene.s.Token.${name}`, actorUuid: `Actor.${name}` });
const live = (rws, extra = {}) => ({ v: 2, id: "L", hold: true, deadline: 59000, now: 0, done: false, ready: false, base: { kind: "strike", label: "Strike", face: face("Bandit Thug", -1), target: face("Character", 1), held: 9 }, rows: rws, ...extra });
const R = (i, a, name, item, extra = {}) => ({ i, actorUuid: `Actor.${a}`, name, ini: M.initials(name), img: "", disp: 1, tokenUuid: `Scene.s.Token.${a}`, itemId: item, itemName: item, kind: "interrupt", role: "protect", ap: 1, targetUuid: "Scene.s.Token.Character", targetName: "Character", answerer: a === "pal" ? "p1" : "p2", state: "wait", order: 0, result: "", color: "", ...extra });
const r3 = [R(0, "arc", "Archer 1", "Covering Shot", { role: "attack", targetName: "Bandit Thug", targetUuid: "Scene.s.Token.Bandit Thug" }), R(1, "pal", "Paladin 1", "Shield of Faith"), R(2, "pal", "Paladin 1", "Bulwark of Faith")];
let h = M.rxCardHtml(live(r3));
console.log("header: Reactions, the clock, Skip all others:", h.includes('<span class="rx-ttl">Reactions</span>'), h.match(/rx-left">([^<]*)/)?.[1], h.includes('data-twod12="rxSkip"'));
console.log("one kind tag on the section:", h.includes('Can react <span class="rx-tag">INTERRUPT</span>'), "| none on the rows:", (h.match(/rx-tag/g) ?? []).length === 1);
console.log("the Archer's row:", txt(h.match(/<div class="rx-dl"[\s\S]*?<\/div>/)?.[0]), "| no build in parentheses:", !/\(\w+\)/.test(txt(h)));
console.log("the Paladin's group:", txt(h.match(/<div class="rx-grp"[\s\S]*?<\/div><\/div>/)?.[0]), "| options:", (h.match(/class="rx-ch"/g) ?? []).length, "| a single Pass for it:", (h.match(/rx-grp[\s\S]*?data-twod12="rxPass"/g) ?? []).length === 1);
console.log("the stack: only the base slab:", (h.match(/class="rx-it[ "]/g) ?? []).length, "|", txt(h.match(/<div class="rx-it rx-base"[\s\S]*?<\/div>/)?.[0]));
r3[0].state = "use"; r3[0].order = 1; r3[0].color = M.colorFor(0);
h = M.rxCardHtml(live(r3));
console.log("Archer used: its row left Can react:", !/class="rx-dl"/.test(h), "| a slab on top, its color:", h.match(/rx-it top"[\s\S]*?rx-sw" style="background:([^"]*)"/)?.[1], "|", txt(h.match(/<div class="rx-it top"[\s\S]*?<\/div>/)?.[0]));
r3[1].state = "pass"; r3[2].state = "pass";
h = M.rxCardHtml(live(r3));
console.log("Paladin passed: gone from the card (no \"Passed\" line):", !/rx-grp|Passed/.test(h), "| no Can react section left:", !h.includes("Can react"), "| Skip all others gone once all answered:", !h.includes("rxSkip"));
const mixed = [R(0, "arc", "Archer 1", "Shot", { kind: "trigger" }), R(1, "pal", "Paladin 1", "Shield")];
console.log("mixed kinds: a tag on each row:", (M.rxCardHtml(live(mixed)).match(/rx-tag/g) ?? []).length);
console.log("who sees Use / Pass: the owner", M.answersHere({}, { answerer: "p1" }, users[1]), "| another player", M.answersHere({}, { answerer: "p1" }, users[2]), "| the GM, for a player's creature (v0.0.277: the GM picks too)", M.answersHere({}, { answerer: "p1" }, users[0]), "| the GM's own", M.answersHere({}, { answerer: "gm" }, users[0]));

console.log("--- all answered: the GM's drag and the map's pins");
const two = [R(0, "arc", "Archer 1", "Covering Shot", { state: "use", order: 1, color: "#f0b54a", role: "attack" }), R(1, "pal", "Paladin 1", "Shield of Faith", { state: "use", order: 2, color: "#5fc4c0" })];
const rs = live(two, { ready: true });
h = M.rxCardHtml(rs);
console.log("the subtitle:", h.includes("top resolves first"), "| grips:", (h.match(/class="rx-grip"/g) ?? []).length, "| numbers:", [...h.matchAll(/rx-num">(\d)/g)].map(m => m[1]).join(","), "| Resolve (GM only):", h.includes('class="rx-ft rx-gmonly"><button type="button" class="rx-btn rx-pri" data-twod12="rxResolve"'));
console.log("the pins: ", [...O.pinNumbers(rs)].map(([i, n]) => `row ${i}: ${n}`).join(", "), "| while the GM drags the Archer on top:", [...O.pinNumbers(rs, [0, 1])].map(([i, n]) => `row ${i}: ${n}`).join(", "), "| a wrong list is ignored:", [...O.pinNumbers(rs, [0, 7])].map(([i, n]) => `${i}:${n}`).join(","));
console.log("the drop: the order set", M.setStackOrder(two, [0, 1]), M.stackOrder(two).map(r => r.itemName).join(" then "), "| a wrong list refused:", M.setStackOrder(two, [0, 0]), M.setStackOrder(two, [0]));
M.registerReactionSettings();
console.log("the overlay's setting:", JSON.stringify(settings.find(s => s[0] === "reactionOverlay")), "(registered with the Reactions settings:", src("module/moment.mjs").includes("O.registerOverlaySetting()"), ")");

console.log("--- the movement moment's base slab");
const mv = { v: 2, id: "mv", deadline: 0, done: false, rows: [R(0, "pal", "Paladin 1", "Opportunity Attack", { role: "attack", kind: "interrupt" })], base: { kind: "move", face: face("Bandit Thug", -1), squares: 4, back: { name: "Bandit Thug", squares: 4, used: false, tokenUuid: "Scene.s.Token.b" } } };
h = M.rxCardHtml(mv);
console.log("the base:", txt(h.match(/<div class="rx-it rx-base"[\s\S]*?<\/div>/)?.[0]), "| Move back on it:", /rx-base"[^]*?data-twod12="rxBack"/.test(h), "| no footer button any more:", !h.includes("rx-back\""));

console.log("--- the flow on the map: answers, Resolve, the results, the message edited in place");
globalThis.canvas = { ready: true, grid: { size: 100, isSquare: true }, scene: { id: "s" }, tokens: { placeables: [] } };
const mkItem = (id, name, sys) => ({ id, name, type: "action", getFlag: () => undefined, system: { reaction: true, reactionKind: "interrupt", momentRange: 0, momentSelf: false, momentTarget: "subject", distance: "", frequency: "atwill", traits: new Set(), versions: [{ ap: 1 }], ...sys } });
const docs = {};
const mkTok = (id, name, x, disp, items, owner = "gm") => { const t = { id, name, center: { x: x * 100 + 50, y: 50 }, document: { id, uuid: `Scene.s.Token.${id}`, x: x * 100, y: 0, width: 1, height: 1, disposition: disp, hidden: false, texture: { src: `t/${id}.webp` } }, setTarget() {} }; t.document.object = t; t.actor = { documentName: "Actor", uuid: `Actor.${id}`, name, type: "character", system: {}, statuses: new Set(), itemTypes: { action: items }, items: { get: i => items.find(x => x.id === i) }, getFlag: () => undefined, getActiveTokens: () => [t], testUserPermission: u => u.id === owner }; t.document.actor = t.actor; docs[t.document.uuid] = t.document; docs[t.actor.uuid] = t.actor; return t; };
const pal = mkTok("pal", "Nari", 2, 1, [mkItem("sof", "Shield of Faith", { moment: "strikeDamage", momentRange: 5 }), mkItem("bof", "Bulwark of Faith", { moment: "strikeDamage", momentRange: 5 })], "p1");
const arc = mkTok("arc", "Lana", 6, 1, [mkItem("cs", "Covering Shot", { moment: "strikeDamage", momentRange: 10, momentTarget: "source" })], "p2");
const kry = mkTok("kry", "Krysta", 0, 1, []), ban = mkTok("ban", "Bandit", 1, -1, []);
canvas.tokens.placeables = [pal, arc, kry, ban];
globalThis.fromUuid = async u => docs[u] ?? null; globalThis.fromUuidSync = u => docs[u] ?? null;
const wait = M.damageMoment(kry.actor, { B: { l: 9, n: 0 }, M: { l: 0, n: 0 } }, { uuid: "Actor.ban", strike: true }, true);
await tick();
const msg = created.at(-1), rx = msg.flags.twod12.rx, nMsgs = created.length;
console.log("the rows:", rx.rows.map(r => `${r.name}/${r.itemName}/${r.role}`).join(" ; "), "| faces with images:", rx.rows.every(r => r.img.startsWith("t/")), "| the base:", rx.base.face.name, "->", rx.base.target.name, rx.base.held, "held");
await M.hostAnswer(rx.id, 1, "use", "p1");   // Bulwark (row 1) for Nari
console.log("Nari used Bulwark: Shield of Faith passed with it:", rx.rows.map(r => `${r.itemName}:${r.state}`).join(", "), "| a second Use refused:", (await M.hostAnswer(rx.id, 0, "use", "p1"), rx.rows[0].state));
await M.hostAnswer(rx.id, 2, "use", "p2");
console.log("all answered, two on the stack: waits for the GM:", rx.ready, "| the drag (a player's refused):", (await M.hostAnswer(rx.id, -1, "order", "p2", { ids: [1, 2] }), M.stackOrder(rx.rows).map(r => r.i).join(",")), "| the GM's:", (await M.hostAnswer(rx.id, -1, "order", "gm", { ids: [1, 2] }), M.stackOrder(rx.rows).map(r => r.i).join(",")));
emitted.length = 0;
M.hostAnswer(rx.id, -1, "resolve", "gm");
await tick();
let run = emitted.find(e => e.type === "rxRun");
console.log("first to resolve:", run.data.itemId, "on", run.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: run.reqId, ok: true, tier: 2 });
await tick();
run = emitted.filter(e => e.type === "rxRun")[1];
console.log("then:", run.data.itemId, "on", run.data.targetName);
M.onSocket({ type: "rxRunDone", reqId: run.reqId, ok: true, tier: 3, half: null });
const res = await wait;
console.log("the moment's answer:", JSON.stringify({ ...res, id: !!res.id }));
console.log("edited in place, no new message:", created.length === nMsgs, msg.content.startsWith('<div class="twod12 chat rx2 rx-done"'), "| no overlay for it any more (done):", rx.done);
await M.noteLanded(res.id, { final: 4, blocked: 5 });
const line = msg.content.match(/<div class="rx-line"[\s\S]*?<\/button><\/div>/)?.[0] ?? "";
console.log("the collapsed line:", txt(line), "| faces in resolve order:", [...line.matchAll(/data-tooltip="([^"]*)" aria-label/g)].map(m => m[1]).join(", "), "| icons (Font Awesome, v0.0.276):", [...line.matchAll(/class="rx-i (fa-\w+ fa-[\w-]+)/g)].map(m => m[1].split(" ")[1]).join(" "), "| no <svg> in the content:", !msg.content.includes("<svg"));
console.log("the result chip: struck held, final:", line.match(/rx-out dmg">(.*?)<\/span>/)?.[1]);
const full = msg.content.match(/<div class="rx-full">[\s\S]*$/)?.[0] ?? "";
console.log("unfolded: header", txt(full.match(/<div class="rx-hd">[\s\S]*?<\/div>/)?.[0]), "| the snapshot (pans the map):", full.includes('class="rx-mini" data-twod12="rxPan"'), "| its labels (drawn on each client, v0.0.276):", [...M.snapshotSvg(rx).matchAll(/font-weight="700" fill="[^"]*">([^<]*)<\/text><\/g>/g)].map(m => m[1]).filter(s => s.includes("·") || s.includes("→")).join(" ; "));
console.log("the frozen stack:", [...full.matchAll(/<div class="rx-it[^"]*"[\s\S]*?<\/div>/g)].map(m => txt(m[0])).join(" | "), "| no grips:", !full.includes("rx-grip"));

console.log("--- the edge case: the attacker drops before the rest resolve");
const wait2 = M.damageMoment(kry.actor, { B: { l: 9, n: 0 }, M: { l: 0, n: 0 } }, { uuid: "Actor.ban", strike: true }, true);
await tick();
const msg2 = created.at(-1), rx2 = msg2.flags.twod12.rx;
await M.hostAnswer(rx2.id, 0, "use", "p1"); await M.hostAnswer(rx2.id, 2, "use", "p2");
emitted.length = 0;
M.hostAnswer(rx2.id, -1, "resolve", "gm");
await tick();
run = emitted.find(e => e.type === "rxRun");
console.log("Covering Shot resolves first:", run.data.itemId);
ban.actor.system.atZero = true;   // its shot took the Bandit Down
await ChatMessage.create({ content: "the shot's roll card", flags: {} });   // a card lands under the live message (v0.0.278)
M.onSocket({ type: "rxRunDone", reqId: run.reqId, ok: true, tier: 3 });
await tick();
run = emitted.filter(e => e.type === "rxRun")[1];
console.log("Shield of Faith only pays its AP:", run.data.spend === true, run.data.itemId);
M.onSocket({ type: "rxRunDone", reqId: run.reqId, ok: true });
const res2 = await wait2;
const moved = created.find(m => m.flags?.twod12?.rx?.id === rx2.id);
console.log("v0.0.278: resolved under the card: a new message at the bottom", moved !== msg2 && created.at(-1) === moved, "| the live one deleted:", !!msg2.deleted, "| one message for the moment:", created.filter(m => m.flags?.twod12?.rx?.id === rx2.id).length);
msg2.content = moved.content;
console.log("the damage never lands:", res2.never, "| the chips:", [...msg2.content.matchAll(/rx-out (\w+)">([^<]*(?:<s>[^<]*<\/s>[^<]*)?)/g)].map(m => `${m[1]}:${txt(m[2])}`).join(" ; "), "| struck through:", (msg2.content.match(/<s>/g) ?? []).length >= 2);
const dm = src("module/damage.mjs");
console.log("damage.mjs: never lands empties the damage:", dm.includes("if (r.never) { for (const p of [\"B\", \"M\"]) for (const k of [\"l\", \"n\"]) a[p][k] = 0; await M.noteLanded(rxIds, { never: true, final: 0 }); return 0; }"), "| the final damage and the protection written back:", dm.includes("await M.noteLanded(rxIds[0], { final, blocked: Math.min(rxGained, (Number(a.reduced) || 0) + (Number(g.taken) || 0)) });"));
ban.actor.system.atZero = false;

console.log("--- result chips");
const C = (role, out, extra = {}) => M.outChip({ role, ap: 1, out, result: "done", ...extra });
console.log("blocked:", JSON.stringify(C("protect", { blocked: 5 })), "| tier:", C("attack", { tier: 2 }).text, C("attack", { tier: 1 }).text, "| Down:", C("attack", { tier: 3, down: true }).text, "| spent:", C("protect", { spent: true }).text, "| failed:", C("attack", {}, { result: "failed" }).text, "| nothing read: no chip:", C("protect", {}), C("attack", {}));
const B = (st) => JSON.stringify(M.baseChip({ rows: [], hold: false, done: true, ...st }));
console.log("base: held", B({ hold: true, base: { held: 9 } }), "| final", B({ hold: true, base: { held: 9, final: 4 } }), "| same", B({ hold: true, base: { held: 9, final: 9 } }), "| never", B({ hold: true, base: { held: 9, never: true } }));
const hits = [{ state: "use", role: "attack", out: { tier: 2 } }, { state: "use", role: "attack", out: { down: true } }, { state: "use", role: "attack", out: { tier: 1 } }, { state: "use", role: "protect", out: {} }];
console.log("movement: N hits", B({ base: { kind: "move" }, rows: hits }), "| one", B({ base: { kind: "move" }, rows: hits.slice(0, 1) }), "| a Trigger's dealt damage", B({ base: { kind: "landed", dealt: 6 } }));

console.log("--- wired");
const tw = src("module/twod12.mjs"), mo = src("module/moment.mjs"), css = src("styles/system.css");
console.log("the overlay's hooks with the moment's:", mo.includes("O.registerOverlayHooks()"), "| the message syncs it:", mo.includes("O.syncOverlay(st)"), "| the old messages keep their look:", mo.includes("if (st.v !== 2) return oldRender(st, el);"), "| the chat hooks:", tw.includes('Hooks.on("renderChatMessageHTML", rxRender)'));
console.log("no second post:", !mo.includes("again: true"), "| no Foundry window:", !/DialogV2|Dialog\./.test(mo + src("module/rxoverlay.mjs")), "| the CSS block:", css.includes("/* v0.0.275 (pack RX-2, Lucas's design 2026-11-07"), "| no explanation paragraph or \"Every row is answered\":", !mo.includes("Every row is answered") && !mo.includes("nothing waits (Foundry moves the token first"));

console.log("--- v0.0.276 (Lucas tested v0.0.275)");
console.log("names without the build:", M.cleanName("Archer 1 (Double Shot, Marksman)"), "|", M.cleanName("Bandit Thug"), "|", M.cleanName("(odd)"));
console.log("no <svg> in any card:", ![M.rxCardHtml(live(r3)), M.rxCardHtml(rs), M.rxCardHtml(mv), msg.content, msg2.content].some(h => h.includes("<svg")), "| the snapshot box is empty in the content:", msg.content.includes('<div class="rx-mini" data-twod12="rxPan" data-tooltip="Show this spot on the map"></div>'));
const oa = { v: 2, done: true, resolvedAt: 1000, hold: false, base: { kind: "move" }, rows: [{ i: 0, state: "use", role: "attack", actorUuid: "Actor.pal", targetUuid: "Scene.s.Token.ban", result: "done", out: { tier: 0 } }, { i: 1, state: "use", role: "attack", actorUuid: "Actor.arc", targetUuid: "Scene.s.Token.ban", result: "done", out: { tier: 0 } }] };
console.log("Opportunity Attack before its Weapon Attack: no chip (not \"0 hits\"):", M.baseChip(oa), "| no slab chip:", M.outChip(oa.rows[0]));
const card = (actorUuid, tier) => ({ flags: { twod12: { action: { actorUuid, tier, results: undefined } } } });
console.log("its Weapon Attack card later: answers", M.lateTier(oa, card("Actor.pal", 2), 2000).map(h => `row ${h.r.i} T${h.tier}`).join(), "| another's card:", M.lateTier(oa, card("Actor.kry", 3), 2000).length, "| a card with no tier:", M.lateTier(oa, card("Actor.pal", 0), 2000).length, "| too late (5 min):", M.lateTier(oa, card("Actor.pal", 2), 1000 + 5 * 60000 + 1).length);
oa.rows[0].out.tier = 2; oa.rows[1].out.tier = 1;
console.log("both known: the chip", JSON.stringify(M.baseChip(oa)), "| wired:", src("module/moment.mjs").includes("registerLateResults();"));

console.log("--- v0.0.277 (Lucas tested v0.0.276)");
console.log("the GM picks on every row (no \"deciding...\"):", M.answersHere({}, { answerer: "p1" }, users[0]), "| a player still only on his own:", M.answersHere({}, { answerer: "p1" }, users[2]));
// a movement that walks past the Paladin and away: start and end far from it, one square of the path next to it
const opp = mkTok("opp", "Watcher", 5, 1, [mkItem("oa", "Opportunity Attack", { moment: "enemyMoves", momentRange: 1 })], "p1");
const walker = mkTok("wlk", "Walker", 2, -1, []);
opp.document.y = 0; walker.document.y = 100;
canvas.tokens.placeables = [opp, walker];
const path = M.movePlaces([{ x: 200, y: 100 }, { x: 900, y: 100 }], 100, { width: 1, height: 1 });
console.log("the path's squares:", path.length, "| left:", path.slice(0, -1).map(p => p.x / 100).join(","));
const evMove = (left) => ({ kinds: ["enemyMoves"], subjects: [{ actor: walker.actor, token: walker, at: path.at(-1) }], source: null, at: { enemyMoves: left } });
console.log("measured only where it started: offered", (await M.collectReactions(evMove({ x: 200, y: 100, width: 1, height: 1 }))).rows.length, "| on every square it left:", (await M.collectReactions(evMove(path.slice(0, -1)))).rows.map(r => `${r.actor.name}'s ${r.item.name} (${r.dist} sq)`).join(", "));
const mm = src("module/moment.mjs");
console.log("the movement moment uses the path:", mm.includes("at: { enemyMoves: left, enemyCloser: entered }"), "| closer on any square entered:", mm.includes("to: Math.min(...entered.map(e => tokenDistance(e, s)))"), "| a split movement keeps listening:", mm.includes("if (!movement?.pending?.waypoints?.length) moving.delete(doc.id);"));
const U = await import(ROOTURL + "module/util.mjs");
console.log("removing a key: the old syntax without Foundry:", JSON.stringify(U.unset("flags.twod12.ignoreTerrain")));
globalThis.foundry.data = { operators: { ForcedDeletion: class FD {} } };
const un = U.unset("flags.twod12.ignoreTerrain");
console.log("with V14's ForcedDeletion:", Object.keys(un).join(), un["flags.twod12.ignoreTerrain"]?.constructor?.name, "| no \"-=\" left in module/:", !fs.readdirSync(ROOT + "module").filter(f => f !== "util.mjs" && f !== "mark.mjs").some(f => /-=[a-zA-Z]/.test(src("module/" + f))));
delete globalThis.foundry.data;
const T = await import(ROOTURL + "module/ticker.mjs");
game.combats = { has: id => id === "live" };
console.log("a Turn Log line for a deleted combat is skipped:", await T.logEvent({ parent: { id: "gone" }, getFlag: () => [] }, { k: "move" }), "| ticker.mjs checks it:", src("module/ticker.mjs").includes("!game.combats.has(c.parent.id)) return null;"));

console.log("--- v0.0.278 (Lucas tested v0.0.277)");
console.log("the snapshot's positions are a list (a uuid key would be split by Foundry's flags):", Array.isArray(rx.snap.pos), rx.snap.pos.map(p => p.u.split(".").at(-1)).join(","), "| drawn from it:", (M.snapshotSvg(rx).match(/<circle /g) ?? []).length, "circles");
const mo3 = src("module/moment.mjs"), ov = src("module/rxoverlay.mjs");
console.log("resolved: posted again at the bottom (the live copy deleted):", mo3.includes("L.msg = await toBottom(L.msg, st);") && mo3.includes("await msg.delete();"), "| again under a late roll card:", mo3.includes("F2.msg = await toBottom(F2.msg, F2.st);"), "| the overlay above the tokens:", ov.includes("layer.zIndex = 9000;"));
