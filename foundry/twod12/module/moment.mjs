// v0.0.261 (Lucas, cards session 5): a Reaction with a moment (system.moment) is offered by itself when the moment comes.
// v0.0.272 (pack RX, Lucas's design): the Reactions pass. When a moment comes (a damage about to land, a Strike, a movement), ONE chat message
// lists every Reaction it triggered: a row per creature and Reaction, with Use / Pass for its owner (the system's card, sysCard). The GM has
// "Skip all others"; an auto-skip timer (a world setting, on by default, 10 minutes) counts down on the message. Nothing lands until every row
// is answered or skipped. The rows used form a stack: they resolve last in, first out (the message shows the order); each is run by its owner's
// client as its card runs today, against the triggering creature. An Interrupt holds the damage until answered; a Trigger is offered after the
// moment and holds nothing. A moment that Reactions watch but none can answer (spent, no AP, Down) posts a one-line note.
// The moments are settings of each Reaction (Moment, Within, You too, Used on): no code here names a card.
import { tokenDistance } from "./light.mjs";
import { isFaded } from "./usage.mjs";
import { answererFor } from "./healwin.mjs";
import { sysCard, sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
const F = "twod12", SOCKET = "system.twod12";

/** The moments. who: the side of the creature the moment is about, seen from the Reaction's owner. */
export const MOMENTS = {
  wouldDown: { who: "ally", damage: true },
  strikeDamage: { who: "ally", damage: true },
  strikeAgainst: { who: "ally" },
  enemyCloser: { who: "enemy", move: true, closer: true },
  enemyMoves: { who: "enemy", move: true },
  allyDamage: { who: "ally", damage: true }
};

/* ------------------------------------------------------------------ pure pieces (tests) */
/** Pure: would this damage (after the Guard) take the creature to its Health Pool? */
export function wouldGoDown(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = (a?.B?.l ?? 0) + (a?.B?.n ?? 0) + (a?.M?.l ?? 0) + (a?.M?.n ?? 0);
  return pool > 0 && incoming > 0 && now < pool && now + incoming >= pool;
}
/** Pure: the damage is cut so the total stops 1 under the Pool (lethal first, then nonlethal); returns what was cut. */
export function capAtPool(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = a.B.l + a.B.n + a.M.l + a.M.n;
  let cut = Math.max(0, now + incoming - (pool - 1)), left = cut;
  for (const [p, k] of [["B", "l"], ["M", "l"], ["B", "n"], ["M", "n"]]) { const take = Math.min(a[p][k], left); a[p][k] -= take; left -= take; if (!left) break; }
  a.momentCut = cut;
  return cut;
}
/** Pure: halve the held damage (rounded up, as the Half button does); returns what was taken off. */
export function halveHeld(a) {
  let off = 0;
  for (const p of ["B", "M"]) for (const k of ["l", "n"]) { const h = Math.ceil(a[p][k] / 2); off += a[p][k] - h; a[p][k] = h; }
  return off;
}
/** Pure: is the subject on the side the moment wants, seen from the Reaction's owner? (you count only with "You too") */
export function sideOk(who, ownerDisp, subjectDisp, isSelf, self) {
  if (isSelf) return who === "ally" && !!self;
  const o = Number(ownerDisp ?? 0), s = Number(subjectDisp ?? 0);
  return who === "ally" ? o === s : o * s < 0;
}
/** Pure: a Reaction's Distance in squares ("5"), or 0 (Weapon, Reach, none: not checked here). */
export const squaresOf = d => (/^\d+$/.test(String(d ?? "").trim()) ? Number(d) : 0);
/** Pure: the order the used rows resolve in: last in, first out. */
export const stackOrder = rows => rows.filter(r => r.state === "use").sort((x, y) => y.order - x.order);
/** Pure: every row is answered (used, passed or skipped). */
export const allAnswered = rows => rows.every(r => r.state !== "wait");
/** Pure: "9:41" for the time left. */
export const clockText = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
/** Pure: Skip all others: the rows still waiting whose answerer is not the GM who clicked are skipped (the GM answers their own). */
export function skipOthers(rows, gmId) {
  let n = 0;
  for (const r of rows) if (r.state === "wait" && r.answerer !== gmId) { r.state = "skip"; n++; }
  return n;
}
/** Pure: the timer ran out: every row still waiting is skipped. */
export function skipAll(rows) { let n = 0; for (const r of rows) if (r.state === "wait") { r.state = "skip"; n++; } return n; }
/** Pure: a row is answered (Use puts it on the stack: its place is the next number). false when it can't be (not waiting). */
export function answerRow(rows, i, choice) {
  const r = rows[i];
  if (!r || r.state !== "wait") return false;
  if (choice === "use") { r.state = "use"; r.order = Math.max(0, ...rows.map(x => x.order || 0)) + 1; } else r.state = "pass";
  return true;
}

/** v0.0.273 (Lucas): pure: a used row resolves one place earlier ("up") or later ("down"): it swaps its stack number with its neighbour's. */
export function moveInStack(rows, i, dir) {
  const stack = stackOrder(rows), k = stack.findIndex(r => r.i === i), j = k + (dir === "up" ? -1 : 1);
  if (k < 0 || j < 0 || j >= stack.length) return false;
  [stack[k].order, stack[j].order] = [stack[j].order, stack[k].order];
  return true;
}
/** Pure: may this user change the order, pause the timer or resolve: the GM, or one who answers a row of the message. */
export const mayManage = (st, user) => !!user && (user.isGM || st.rows.some(r => r.answerer === user.id));
/** Pure: the time left on the message (paused: what was left when it was paused). */
export const timeLeft = (st, now = Date.now()) => (st.paused ? st.left ?? 0 : (st.deadline || 0) - now);

const STATE = { wait: "Waiting", use: "Use", pass: "Passed", skip: "Skipped" };
const ordinal = n => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;
/** Pure: the message's HTML from its state: the card, a row per creature and Reaction, the stack's order, the timer and the GM's button. */
export function rxCardHtml(st) {
  const stack = stackOrder(st.rows), place = new Map(stack.map((r, k) => [r.i, k + 1]));
  const rows = st.rows.map(r => {
    const res = r.result === "done" ? ' <i class="fa-solid fa-check"></i>' : r.result === "failed" ? " (not used)" : r.result === "run" ? ' <i class="fa-solid fa-hourglass-half"></i>' : "";
    const tag = r.state === "use" ? `Resolves ${ordinal(place.get(r.i))}${res}` : STATE[r.state] ?? r.state;
    // v0.0.273 (Lucas): the order can be changed before the stack resolves (up: sooner)
    const k = place.get(r.i), live = !st.done && !st.resolving;
    const arrows = r.state === "use" && live && stack.length > 1 ? `<span class="rx-move">${k > 1 ? `<button type="button" data-twod12="rxUp" data-row="${r.i}" data-tooltip="Resolve it sooner"><i class="fa-solid fa-chevron-up"></i></button>` : ""}${k < stack.length ? `<button type="button" data-twod12="rxDown" data-row="${r.i}" data-tooltip="Resolve it later"><i class="fa-solid fa-chevron-down"></i></button>` : ""}</span>` : "";
    const btns = r.state === "wait" && !st.done ? `<div class="gbtns"><button type="button" data-twod12="rxUse" data-row="${r.i}" data-answerer="${esc(r.answerer)}"><i class="fa-solid fa-bolt"></i> Use</button><button type="button" class="rx-pass" data-twod12="rxPass" data-row="${r.i}" data-answerer="${esc(r.answerer)}"><i class="fa-solid fa-forward"></i> Pass</button></div>` : "";
    return `<div class="tline grantrow rxrow s-${r.state}" data-row="${r.i}"><span class="apside"><i class="fa-solid ${r.kind === "interrupt" ? "fa-hand" : "fa-bolt-lightning"}"></i> <b>${esc(r.name)}</b>: <a class="rx-open" data-twod12="rxOpen" data-row="${r.i}" data-tooltip="Open the Action">${esc(r.itemName)}</a> <small>${esc(r.ap)}R · ${r.kind === "interrupt" ? "Interrupt" : "Trigger"} · on ${esc(r.targetName)}</small><span class="rx-state">${tag}</span>${arrows}</span>${btns}</div>`;
  }).join("");
  const order = stack.length > 1 ? `<div class="rx-order"><i class="fa-solid fa-layer-group"></i> ${st.ready && !st.resolving && !st.done ? "Every row is answered. Change the order if needed, then Resolve: " : "Last in, first out: "}${stack.map((r, k) => `<b>${k + 1}.</b> ${esc(r.name)}'s ${esc(r.itemName)}`).join(", ")}</div>` : "";
  // v0.0.273 (Lucas): a movement moment can take the mover back to where its movement started (its squares refunded)
  const b = st.back, back = b ? `<div class="rx-back">${b.used ? `<i class="fa-solid fa-rotate-left"></i> ${esc(b.name)} went back to where its movement started (${b.squares} sq.); its movement is refunded.` : `<button type="button" data-twod12="rxBack" data-tooltip="Back to the square it left (the trigger), the movement refunded"><i class="fa-solid fa-rotate-left"></i> Move ${esc(b.name)} back (${b.squares} sq.)</button>`}</div>` : "";
  const left = timeLeft(st, st.now ?? Date.now());
  const timer = st.deadline || st.paused ? `<span class="rx-timer${st.paused ? " paused" : ""}" data-twod12="rxPause"${st.paused ? "" : ` data-deadline="${st.deadline}"`} data-tooltip="${st.paused ? "Paused: click to go on" : "Click to pause the countdown"}"><i class="fa-regular ${st.paused ? "fa-circle-pause" : "fa-clock"}"></i> ${st.paused ? "Paused" : "Auto-skip in"} <span class="rx-left">${clockText(left)}</span></span>` : "";
  const gm = st.ready ? `<button type="button" class="rx-go" data-twod12="rxResolve"><i class="fa-solid fa-play"></i> Resolve</button>` : `<button type="button" class="rx-gm" data-twod12="rxSkip"><i class="fa-solid fa-forward-fast"></i> Skip all others</button>`;
  const foot = st.done
    ? `<div class="rx-foot rx-done"><i class="fa-solid fa-flag-checkered"></i> ${esc(st.closed || (st.hold ? "Answered: the damage lands." : "Answered."))}</div>`
    : `<div class="rx-foot">${timer}${st.resolving ? '<span class="rx-run">Resolving...</span>' : gm}</div>`;
  return sysCard({ title: "Reactions", lead: st.lead ? `<span>${st.lead}</span>` : "", text: st.text, cls: "rxmsg" }).replace(/<\/div>\s*$/, `<div class="rx">${rows}${order}${foot}${back}</div></div>`);
}

/* ------------------------------------------------------------------ the creatures and their Reactions */
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);
const tokenOf = actor => actor?.token?.object ?? actor?.getActiveTokens?.()[0] ?? null;
/** The creatures a moment is about: { actor, token, at (where it is measured from: a token, or a place) }. */
const party = (actor, at = null) => (actor ? { actor, token: tokenOf(actor), at: at ?? tokenOf(actor) } : null);

/** Why this creature can't use this Reaction now ("" when it can): spent, Down, no AP left. */
export async function blockedWhy(actor, item) {
  const f = isFaded(actor, item);
  if (f?.faded) return f.why || "spent";
  if (actor.system?.atZero || actor.statuses?.has?.("unconscious") || actor.statuses?.has?.("dead")) return "Down";
  try {
    const C = await import("./combat.mjs"), c = game.combat?.started ? C.combatantOf(actor, game.combat) : null;
    if (c) {
      const min = Math.min(...(item.system.versions ?? []).map(v => Number(v.ap) || 0));
      if (Number.isFinite(min) && C.getAP(c) + C.getRAP(c) < min) return `no AP left (it costs ${min}R)`;
    }
  } catch (e) { /* no combat module (tests) */ }
  return "";
}

/**
 * The Reactions a moment triggers. ev: { kinds, subjects: [{ actor, token, at }] (nearest first wins), source: { actor, token } | null,
 * closer: (ownerToken) => bool (an enemy that moved closer to that creature's side), only: "interrupt" | "trigger" | "" }.
 * Returns { rows: [{ actor, token, item, kind, subject, target, dist }], blocked: [the same, with why] }.
 */
export async function collectReactions(ev) {
  const rows = [], blocked = [];
  for (const tk of globalThis.canvas?.tokens?.placeables ?? []) {
    const actor = tk.actor;
    if (!actor || tk.document?.hidden) continue;
    if (ev.source?.actor && actor.uuid === ev.source.actor.uuid) continue;   // never a Reaction to your own Strike or move
    for (const item of actor.itemTypes?.action ?? []) {
      const k = item.system?.moment, def = MOMENTS[k];
      if (!def || !item.system.reaction || !ev.kinds.includes(k)) continue;
      const kind = item.system.reactionKind === "interrupt" ? "interrupt" : "trigger";
      if (ev.only && kind !== ev.only) continue;
      if (ev.filter && !ev.filter.has(`${actor.uuid}|${item.id}`)) continue;
      if (def.closer && ev.closer && !ev.closer(tk)) continue;
      const range = Number(item.system.momentRange) || 0;
      let hit = null;
      for (const sj of ev.subjects ?? []) {
        if (!sj?.actor) continue;
        const isSelf = sj.actor.uuid === actor.uuid;
        if (!sideOk(def.who, tk.document?.disposition, sj.token?.document?.disposition ?? sj.disposition, isSelf, item.system.momentSelf)) continue;
        const where = (def.move && ev.at?.[k]) || sj.at || sj.token;
        const dist = isSelf ? 0 : where ? tokenDistance(tk, where) : Infinity;
        if (range && dist > range) continue;
        if (!hit || dist < hit.dist) hit = { sj, dist };
      }
      if (!hit) continue;
      const target = item.system.momentTarget === "source" && ev.source?.actor ? ev.source : hit.sj;
      const sq = squaresOf(item.system.distance);   // a Distance in squares limits how far the target can be (Rebuke: 5 sq.)
      if (sq && target.token && target.token !== tk && tokenDistance(tk, target.token) > sq) continue;
      const row = { actor, token: tk, item, kind, moment: k, subject: hit.sj, target, dist: hit.dist };
      const why = await blockedWhy(actor, item);
      if (why) blocked.push({ ...row, why }); else rows.push(row);
    }
  }
  rows.sort((x, y) => x.dist - y.dist);
  return { rows, blocked };
}

/* ------------------------------------------------------------------ the message and the stack (the client that holds the moment) */
const live = new Map();   // moment id -> { st, msg, resolve, timer }
const pendingRuns = new Map();
export const timerMinutes = () => {
  try { if (!game.settings.get(F, "reactionTimerOn")) return 0; return Math.max(1, Number(game.settings.get(F, "reactionTimer")) || 1); } catch (e) { return 1; }
};
export function registerReactionSettings() {
  game.settings.register(F, "reactionTimerOn", { name: "Reactions: auto-skip timer", hint: "A Reactions message skips the rows nobody answered when its timer runs out (the time is counted down on the message). The GM can also click Skip all others.", scope: "world", config: true, type: Boolean, default: true });
  game.settings.register(F, "reactionTimer", { name: "Reactions: auto-skip after (minutes)", hint: "How long a Reactions message waits for its answers before it skips the rows still waiting (anyone in it can pause the countdown by clicking the clock).", scope: "world", config: true, type: Number, default: 1, range: { min: 1, max: 60, step: 1 } });
}

/** The note when Reactions watch the moment but none can answer: whispered to the GM and those Reactions' owners. */
async function postNobody(plain, blocked) {
  const users = new Set(game.users?.filter?.(u => u.isGM).map(u => u.id) ?? []);
  for (const b of blocked) for (const u of game.users?.filter?.(u => b.actor.testUserPermission?.(u, "OWNER")) ?? []) users.add(u.id);
  const why = blocked.map(b => `${esc(b.actor.name)}'s ${esc(b.item.name)}: ${esc(b.why)}`).join("; ");
  await ChatMessage.create({ content: sysLine("fa-hourglass-end", `${plain}: nobody can react (${why}).`, "rxnote"), whisper: [...users] });
}

/**
 * A moment comes: the message with its rows (or the note), and, once every row is answered or skipped, the stack resolved.
 * Resolves to { used: [{ moment, actorUuid, itemId, ok, half }] } when the stack is done (an Interrupt's caller waits for it; a Trigger's doesn't).
 */
export async function openMoment(ev) {
  if (!globalThis.canvas?.ready || !globalThis.game?.users) return { used: [] };
  const { rows, blocked } = await collectReactions(ev);
  if (!rows.length) { if (blocked.length) await postNobody(ev.plain ?? ev.lead, blocked); return { used: [] }; }
  const minutes = timerMinutes(), id = foundry.utils.randomID();
  const st = {
    id, host: game.user.id, hold: !!ev.hold, lead: ev.lead, text: ev.text, done: false, resolving: false, ready: false, paused: false, back: ev.back ?? null, deadline: minutes ? Date.now() + minutes * 60000 : 0,
    rows: rows.map((r, i) => ({
      i, moment: r.moment, actorUuid: r.actor.uuid, name: r.actor.name, itemId: r.item.id, itemName: r.item.name, kind: r.kind,
      ap: Math.min(...(r.item.system.versions ?? [{ ap: 0 }]).map(v => Number(v.ap) || 0)),
      targetUuid: r.target.token?.document?.uuid ?? r.target.actor.uuid, targetName: r.target.token?.name ?? r.target.actor.name,
      answerer: answererFor(r.actor)?.id ?? game.user.id, state: "wait", order: 0, result: ""
    }))
  };
  const msg = await ChatMessage.create({ content: rxCardHtml(st), flags: { [F]: { rx: st } } });
  return new Promise(resolve => {
    const L = { st, msg, resolve, timer: null };
    live.set(id, L);
    arm(L);
  });
}
async function redraw(L) {
  try { await L.msg.update({ content: rxCardHtml(L.st), [`flags.${F}.rx`]: L.st }); } catch (e) { console.warn("twod12 | Reactions message", e); }
}
/** On the holding client: an answer (Use / Pass), the GM's Skip all others, or the timer. */
export async function hostAnswer(id, i, choice, fromId) {
  const L = live.get(id);
  if (!L || L.st.done || L.st.resolving) return;
  const st = L.st, from = game.users?.get?.(fromId);
  if (choice === "timeout") skipAll(st.rows);
  else if (choice === "skipAll") { if (!from?.isGM) return; skipOthers(st.rows, fromId); }
  // v0.0.273 (Lucas): the order, the clock and the Resolve button: the GM or anyone who answers a row here
  else if (["up", "down", "pause", "resolve"].includes(choice)) {
    if (!mayManage(st, from)) return;
    if (choice === "pause") { if (st.paused) { st.paused = false; st.deadline = Date.now() + Math.max(1000, st.left ?? 0); arm(L); } else if (st.deadline) { st.paused = true; st.left = Math.max(0, st.deadline - Date.now()); if (L.timer) clearTimeout(L.timer); L.timer = null; } return redraw(L); }
    if (choice !== "resolve") { if (moveInStack(st.rows, i, choice)) await redraw(L); return; }
    if (!allAnswered(st.rows)) return;
  } else {
    const r = st.rows[i];
    if (!r) return;
    const mayAnswer = fromId === r.answerer || (from?.isGM && !game.users.get(r.answerer)?.active);   // its owner (the GM for one who left)
    if (!mayAnswer || !answerRow(st.rows, i, choice)) return;
  }
  if (!allAnswered(st.rows)) return redraw(L);
  // v0.0.273 (Lucas): with two Reactions or more on the stack, it waits for Resolve (the order can be changed first; the timer resolves it too)
  if (stackOrder(st.rows).length > 1 && !st.ready && choice !== "timeout" && choice !== "resolve") { st.ready = true; return redraw(L); }
  if (L.timer) clearTimeout(L.timer);
  await resolveStack(L);
}
function arm(L) {
  if (L.timer) clearTimeout(L.timer);
  L.timer = L.st.deadline && !L.st.paused ? setTimeout(() => hostAnswer(L.st.id, -1, "timeout", game.user.id), Math.max(0, L.st.deadline - Date.now())) : null;
}
/** Every row answered: the used ones resolve last in, first out, each on its owner's client, then the moment's caller goes on. */
async function resolveStack(L) {
  const st = L.st, used = [];
  st.resolving = true;
  const order = stackOrder(st.rows);
  for (const r of order) {
    r.result = "run"; await redraw(L);
    const data = { actorUuid: r.actorUuid, itemId: r.itemId, targetUuid: r.targetUuid, targetName: r.targetName };
    const who = game.users.get(r.answerer)?.active ? r.answerer : (answererFor(fromUuidSync(r.actorUuid))?.id ?? game.user.id);
    let res = { ok: false };
    try { res = who === game.user.id ? await runHere(data) : await runRemote(who, data); } catch (e) { console.warn("twod12 | Reaction", e); }
    r.result = res.ok ? "done" : "failed";
    used.push({ moment: r.moment, actorUuid: r.actorUuid, itemId: r.itemId, ok: !!res.ok, half: res.half ?? null });
  }
  st.resolving = false; st.done = true;
  await redraw(L);
  live.delete(st.id);
  // v0.0.273 (Lucas): the Reactions' cards pushed the message up: it is posted again under them, answered (its Move back button too)
  if (used.length) { try { await ChatMessage.create({ content: rxCardHtml(st), flags: { [F]: { rx: { ...st, again: true } } } }); } catch (e) { console.warn("twod12 | Reactions message", e); } }
  // what a Reaction set on another creature (a Guard, a reduction) comes back through the GM: a moment for it to arrive before the damage lands
  if (used.some(u => u.ok)) await new Promise(r => setTimeout(r, 500));
  L.resolve({ used });
}
function runRemote(userId, data) {
  const reqId = foundry.utils.randomID();
  return new Promise(resolve => {
    pendingRuns.set(reqId, resolve);
    game.socket.emit(SOCKET, { type: "rxRun", userId, reqId, from: game.user.id, data });
  });
}
/** On the owner's client: the Reaction is used as its card is, against the triggering creature; a Reaction whose card brings granted uses
 *  makes its first one at once (the Weapon Attack), so what it does to the held damage (a Tier 3's half) is known before it lands. */
export async function runHere(data) {
  const H = await import("./halfhint.mjs");
  const actor = actorOf(await fromUuid(data.actorUuid)), item = actor?.items?.get(data.itemId), tdoc = await fromUuid(data.targetUuid);
  if (!actor || !item) return { ok: false };
  const tok = tdoc?.object ?? tokenOf(actorOf(tdoc));
  if (tok) tok.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
  const t0 = Date.now(), before = new Set((game.messages?.contents ?? []).slice(-30).map(m => m.id));
  H.halfCtx.held = true;
  let ok = false;
  try {
    const { useAction } = await import("./actions.mjs");
    ok = (await useAction(actor, item, {})) === true;
    if (ok) {
      const card = game.messages.contents.slice(-8).reverse().find(m => !before.has(m.id) && m.getFlag?.(F, "grantCard")?.actorUuid === actor.uuid);   // the card this use just posted
      const g = card?.getFlag(F, "grantCard")?.effects?.[0];
      if (g) {
        if (tok) tok.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
        await (await import("./freeuse.mjs")).useGrant(card, g.id, g.index);
      }
    }
  } finally { H.halfCtx.held = false; }
  const half = H.halfCtx.last && H.halfCtx.last.at >= t0 ? { ...H.halfCtx.last } : null;
  return { ok, half };
}
/** The socket (damage.mjs routes the rx messages here). */
export async function onSocket(data) {
  if (data.type === "rxAnswer") return hostAnswer(data.id, data.row, data.choice, data.from);
  if (data.type === "rxBackMark") return markBack(data.msgId);
  if (data.type === "rxRun") { let res = { ok: false }; try { res = await runHere(data.data); } catch (e) { console.warn("twod12 | Reaction", e); } game.socket.emit(SOCKET, { type: "rxRunDone", userId: data.from, reqId: data.reqId, ok: res.ok, half: res.half }); return; }
  if (data.type === "rxRunDone") { const r = pendingRuns.get(data.reqId); if (r) { pendingRuns.delete(data.reqId); r({ ok: !!data.ok, half: data.half ?? null }); } }
}
/** A click on the message: Use, Pass (the row's owner), Skip all others (the GM), the order, the clock and Resolve (the GM or one who answers
 *  a row): sent to the client that holds the moment. The Action's name opens its sheet; Move back is done by the clicker. */
export async function rxClick(msg, b) {
  const st = msg?.getFlag?.(F, "rx");
  if (!st) return;
  const k = b.dataset.twod12, row = Number(b.dataset.row ?? -1);
  if (k === "rxOpen") return openRowItem(st.rows[row]);
  if (k === "rxBack") return moveBack(msg, st);
  if (st.done) return;
  const choice = { rxUse: "use", rxPass: "pass", rxSkip: "skipAll", rxUp: "up", rxDown: "down", rxPause: "pause", rxResolve: "resolve" }[k];
  if (!choice) return;
  if (st.host === game.user.id) return hostAnswer(st.id, row, choice, game.user.id);
  if (!game.users.get(st.host)?.active) return ui.notifications.warn("The one who brought this moment has left: it can't be answered any more.");
  game.socket.emit(SOCKET, { type: "rxAnswer", userId: st.host, id: st.id, row, choice, from: game.user.id });
  if (b.tagName === "BUTTON") b.disabled = true;
}
/** v0.0.273 (Lucas): the Action's name on a row opens its sheet. */
async function openRowItem(r) {
  if (!r) return;
  let actor = null; try { actor = actorOf(await fromUuid(r.actorUuid)); } catch (e) { actor = null; }
  const item = actor?.items?.get(r.itemId);
  if (!item) return ui.notifications.warn("That Action is gone.");
  if (!item.testUserPermission?.(game.user, "LIMITED") && !game.user.isGM) return ui.notifications.warn(`You can't see ${actor.name}'s Actions.`);
  item.sheet.render(true);
}
/** v0.0.273 (Lucas): Move back: the mover goes back to the square its movement left (the trigger), its movement as it was before (refunded). */
async function moveBack(msg, st) {
  const b = st.back;
  if (!b || b.used) return;
  let doc = null; try { doc = await fromUuid(b.tokenUuid); } catch (e) { doc = null; }
  if (!doc) return ui.notifications.warn("That token is gone.");
  if (!doc.isOwner) return ui.notifications.warn(`Only ${doc.name}'s owner or the GM can move it back.`);
  await doc.update({ x: b.x, y: b.y }, { twod12Forced: true, animate: true });
  const c = game.combat?.combatants?.get?.(b.combatantId);
  if (c && b.flags) { try { await c.update(Object.fromEntries(Object.entries(b.flags).map(([k, v]) => [`flags.${F}.${k}`, v]))); } catch (e) { console.warn("twod12 | movement refund", e); } }
  await markBack(msg.id);
}
/** The messages of that moment (the first and the one posted again) say the mover went back: their author writes it; through the socket otherwise. */
async function markBack(msgId) {
  const st0 = game.messages?.get?.(msgId)?.getFlag?.(F, "rx");
  if (!st0?.back) return;
  const L = live.get(st0.id);
  if (L) L.st.back = { ...L.st.back, used: true };
  for (const m of game.messages?.contents?.slice(-60) ?? []) {
    const st = m.getFlag?.(F, "rx");
    if (st?.id !== st0.id || !st.back || st.back.used) continue;
    if (m.isAuthor || (game.user.isGM && !m.author?.active)) { const nst = { ...st, back: { ...st.back, used: true } }; try { await m.update({ content: rxCardHtml(nst), [`flags.${F}.rx`]: nst }); } catch (e) { /* not ours */ } }
    else if (m.author?.id) game.socket.emit(SOCKET, { type: "rxBackMark", userId: m.author.id, msgId: m.id });
  }
}
/** Chat hook: Use and Pass only for the row's owner (the GM for one who left), Skip all others only for the GM; the timer ticks. */
export function rxRender(msg, html) {
  const st = msg?.getFlag?.(F, "rx");
  if (!st) return;
  const el = html instanceof HTMLElement ? html : html?.[0];
  if (!el?.querySelectorAll) return;
  el.querySelectorAll('button[data-twod12="rxUse"], button[data-twod12="rxPass"]').forEach(b => {
    const r = st.rows[Number(b.dataset.row)], mine = r && (r.answerer === game.user.id || (game.user.isGM && !game.users.get(r.answerer)?.active));
    if (!mine) b.remove();
  });
  el.querySelectorAll(".rxrow .gbtns").forEach(g => { if (!g.children.length) g.remove(); });
  if (!game.user.isGM) el.querySelectorAll(".rx-gm").forEach(b => b.remove());
  // v0.0.273: the order, Resolve and the clock for the GM and those who answer a row; Move back for the mover's owner
  if (!mayManage(st, game.user)) { el.querySelectorAll(".rx-move, .rx-go").forEach(b => b.remove()); el.querySelectorAll(".rx-timer").forEach(t => { delete t.dataset.twod12; delete t.dataset.tooltip; }); }
  if (st.back && !st.back.used) { let doc = null; try { doc = fromUuidSync(st.back.tokenUuid); } catch (e) { doc = null; } if (!doc?.isOwner) el.querySelectorAll('[data-twod12="rxBack"]').forEach(b => b.remove()); }
  ticker();
}
let ticking = null;
function ticker() {
  if (ticking || typeof document === "undefined") return;
  ticking = setInterval(() => {
    const els = document.querySelectorAll(".rx-timer[data-deadline]");
    if (!els.length) { clearInterval(ticking); ticking = null; return; }
    els.forEach(e => { const s = e.querySelector(".rx-left"); if (s) s.textContent = clockText(Number(e.dataset.deadline) - Date.now()); });
  }, 1000);
}
/** At ready: a message this client was holding when it reloaded can't be answered any more; it is closed. */
export async function closeStale() {
  for (const m of game.messages?.contents?.slice(-60) ?? []) {
    const st = m.getFlag?.(F, "rx");
    if (!st || st.done || st.host !== game.user.id || live.has(st.id)) continue;
    skipAll(st.rows); st.done = true; st.resolving = false; st.closed = "Closed: the page was reloaded before every row was answered.";
    try { await m.update({ content: rxCardHtml(st), [`flags.${F}.rx`]: st }); } catch (e) { /* not ours */ }
  }
}

/* ------------------------------------------------------------------ the moments themselves */
const bTotal = a => a.B.l + a.B.n + a.M.l + a.M.n;
const nameOf = p => esc(p?.token?.name ?? p?.actor?.name ?? "");
async function sourceOf(from) {
  if (!from?.uuid) return null;
  let d = null; try { d = await fromUuid(from.uuid); } catch (e) { d = null; }
  return party(actorOf(d));
}
/**
 * The damage is about to land (applyToActor): "a Strike would damage an ally" (a Strike's damage card) and "an ally takes damage" (when some of
 * it would reach the Health: the Guard and a reduction are counted). The Interrupts hold it; the answer may halve it (a Tier 3's half).
 * from: { uuid (the creature dealing it), strike }. Resolves to { half: true } when it is halved.
 */
export async function damageMoment(actor, a, from, reaches) {
  const kinds = [...(from?.strike ? ["strikeDamage"] : []), ...(reaches ? ["allyDamage"] : [])];
  if (!kinds.length) return {};
  const source = await sourceOf(from), subject = party(actor);
  const plain = source ? `<b>${nameOf(source)}</b>'s ${from?.strike ? "Strike" : "damage"} would damage <b>${nameOf(subject)}</b>` : `<b>${nameOf(subject)}</b> would take damage`;
  const res = await openMoment({ kinds, subjects: [subject], source, only: "interrupt", hold: true, plain, lead: plain, text: `Interrupt: the <b>${bTotal(a)}</b> damage waits until every Reaction is answered.` });
  const half = (res.used ?? []).find(u => u.ok && u.half && (!source || !u.half.targetUuid || [source.actor.uuid, source.token?.document?.uuid].includes(u.half.targetUuid)));
  return { half: !!half, halfBy: half?.half?.source ?? "" };
}
/** The damage would take the creature to its Pool: the "would go Down" Interrupts; true when one was used (the damage stops 1 under the Pool). */
export async function downMoment(actor, a, from) {
  const source = await sourceOf(from), subject = party(actor);
  const plain = `<b>${nameOf(subject)}</b> would go Down`;
  const res = await openMoment({ kinds: ["wouldDown"], subjects: [subject], source, only: "interrupt", hold: true, plain, lead: `${plain} (${bTotal(a)} damage)`, text: "Interrupt: the damage waits until every Reaction is answered." });
  return (res.used ?? []).some(u => u.ok && u.moment === "wouldDown");
}
/** The damage landed: the Triggers of the damage moments (they hold nothing). */
export function landedMoment(actor, dealt, from, wentDown) {
  const kinds = [...(dealt > 0 && from?.strike ? ["strikeDamage"] : []), ...(dealt > 0 ? ["allyDamage"] : []), ...(wentDown ? ["wouldDown"] : [])];
  if (!kinds.length) return;
  (async () => {
    const source = await sourceOf(from), subject = party(actor);
    const plain = wentDown ? `<b>${nameOf(subject)}</b> goes Down` : `<b>${nameOf(subject)}</b> takes <b>${dealt}</b> damage${source ? ` from <b>${nameOf(source)}</b>` : ""}`;
    await openMoment({ kinds, subjects: [subject], source, only: "trigger", plain, lead: plain, text: "Trigger: it has landed; nothing waits." });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
/** A Strike was made (useAction, after its card): "a Strike is made against an ally". A Trigger: nothing waits. */
export function strikeMoment(actor, targets) {
  (async () => {
    const subjects = [];
    for (const t of targets ?? []) { let d = null; try { d = await fromUuid(t.uuid); } catch (e) { d = null; } const p = party(actorOf(d)); if (p && p.actor.uuid !== actor.uuid) subjects.push(p); }
    if (!subjects.length) return;
    const source = party(actor), plain = `<b>${nameOf(source)}</b> makes a Strike against <b>${subjects.map(nameOf).join(", ")}</b>`;
    await openMoment({ kinds: ["strikeAgainst"], subjects, source, plain, lead: plain, text: "The Strike is made: nothing waits (an Interrupt here is offered after it too)." });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
/** Pure: did the mover come closer to any of these creatures (each { from, to }: its distance before and after)? */
export const cameCloser = pairs => pairs.some(p => p.to < p.from);
const offered = new Set();   // "once per Advance": a Reaction is offered once a turn for the same mover
/** A creature moved (not an Evade, not a Forced Movement): "an enemy moves closer" and "an enemy moves (or stands up)". */
export function moveMoment(doc, origin, dest, { stand = false, before = null } = {}) {
  (async () => {
    const actor = doc?.actor;
    if (!actor || !game.combat?.started) return;
    const size = { width: doc.width, height: doc.height, elevation: doc.elevation };
    const fromAt = { ...size, x: origin?.x ?? doc.x, y: origin?.y ?? doc.y }, toAt = { ...size, x: dest?.x ?? doc.x, y: dest?.y ?? doc.y };
    const turn = `${doc.id}|${game.combat.round}|${game.combat.turn}`;
    const sideToks = disp => (canvas.tokens?.placeables ?? []).filter(t => t.actor && !t.document.hidden && Number(t.document.disposition ?? 0) === Number(disp ?? 0) && t.document.id !== doc.id);
    const ev = {
      kinds: stand ? ["enemyMoves"] : ["enemyCloser", "enemyMoves"], subjects: [party(actor, toAt)], source: null, at: { enemyMoves: fromAt, enemyCloser: toAt },
      closer: tk => cameCloser(sideToks(tk.document.disposition).map(s => ({ from: tokenDistance(fromAt, s), to: tokenDistance(toAt, s) })))
    };
    const { rows, blocked } = await collectReactions(ev);
    const fresh = r => { const k = `${turn}|${r.actor.uuid}|${r.item.id}`; if (!stand && offered.has(k)) return false; offered.add(k); return true; };
    const keep = new Set([...rows, ...blocked].filter(fresh).map(r => `${r.actor.uuid}|${r.item.id}`));
    if (!keep.size) return;
    const name = esc(doc.name ?? actor.name), plain = stand ? `<b>${name}</b> stands up` : `<b>${name}</b> moves`;
    // v0.0.273 (Lucas): Move back: to where this movement started, with the movement it had then (the squares since are refunded)
    const back = !stand && origin ? { tokenUuid: doc.uuid, x: fromAt.x, y: fromAt.y, combatantId: before?.combatantId ?? "", flags: before?.flags ?? null, squares: tokenDistance(fromAt, toAt), name: doc.name ?? actor.name, used: false } : null;
    await openMoment({ ...ev, filter: keep, back, plain, lead: plain, text: "The movement is made: nothing waits (Foundry moves the token first, so an Interrupt is made from where it stands now)." });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
const moving = new Map();   // token id -> { forced, evading }, on the client that moves it
export function registerMomentHooks() {
  Hooks.on("preMoveToken", (doc, movement, operation) => {
    try {
      if (operation?.twod12Lean || movement?.method === "undo") return;
      const c = game.combat?.combatants?.find?.(x => x.tokenId === doc.id);
      // v0.0.273: the movement it has before this move (Move back refunds it)
      const flags = c ? { freeMove: Number(c.getFlag(F, "freeMove")) || 0, evadeMove: Number(c.getFlag(F, "evadeMove")) || 0, moveLeft: Number(c.getFlag(F, "moveLeft")) || 0 } : null;
      moving.set(doc.id, { forced: !!operation?.twod12Forced, evading: Number(c?.getFlag?.(F, "evadeMove")) > 0, before: c ? { combatantId: c.id, flags } : null });
    } catch (e) { /* not tracked */ }
  });
  Hooks.on("moveToken", (doc, movement) => {
    const m = moving.get(doc.id);
    if (!m) return;   // moved by another client: that client offers the moment
    moving.delete(doc.id);
    if (m.forced || m.evading || !movement?.origin || !movement?.destination) return;
    moveMoment(doc, movement.origin, movement.destination, { before: m.before });
  });
}
