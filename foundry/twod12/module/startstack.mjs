// v0.0.345 (Lucas, playtest 4; book, Chapter 2, "The Start of the Encounter"): abilities that happen at the start of an encounter (Mark Quarry,
// more to come, PCs and NPCs) no longer post one message each. When the combat starts, ONE card lists them as a stack in the turn order; the GM
// drags rows to change the order (an ally going later), then clicks Resolve: the rows resolve one at a time in that order (the row's creature uses
// its Action button; the GM marks it done or skipped), and the card says when the first turn begins. Every button stays usable by hand.
// v0.0.346 (Lucas: "ugly; copy the style of the other cards... just the name, a thing to move them in the order, the button for the Action and a
// button to see the Action, like Card; see the Reactions card"): the Reactions card's look (rx2: dark head, face, grip, slabs).
// v0.0.347 (Lucas: "make Resolve automatically trigger the Actions like Reactions does"): Resolve uses each row's Action in turn, on its
// creature's answerer's client (moment.mjs runHere's way), waiting for each; Done / Skip on the row now end a wait by hand.
// The stack lives on the message's flags (twod12.startStack); the content is rebuilt from it on every change. Only the GM changes the order.
import { esc } from "./util.mjs";
const F = "twod12";
const FACE_BG = { "-1": "#8a2f22", "0": "#6b5d45", "1": "#2d5d7a", "-2": "#3a3a3a" };
const ini = name => { const w = String(name ?? "").trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] ?? "?").slice(0, 2)).toUpperCase(); };
const face = r => `<span class="rx-av rx-av-m" style="background:${FACE_BG[String(r.disp ?? 0)] ?? FACE_BG[0]}" aria-label="${esc(r.name)}"><b>${esc(ini(r.name))}</b>${r.img ? `<img src="${esc(r.img)}" alt="">` : ""}</span>`;   // as moment.mjs faceHtml
const fa = c => `<i class="${c}" aria-hidden="true"></i>`;

/* ---------------------------------------------------------------- pure */

/** A new stack. rows: [{ actorUuid, name, img, disp, source, action, ap, itemId, text }] in the turn order. */
export const newStack = rows => ({ v: 2, rows: rows.map((r, i) => ({ ...r, i, state: "wait" })), order: rows.map((r, i) => i), cur: -1, first: "" });
/** Moves a row one place up (-1) or down (+1); only before the stack resolves. */
export function moveRow(st, i, dir) {
  if (st.cur >= 0) return st;
  const o = [...st.order], k = o.indexOf(i), j = k + dir;
  if (k < 0 || j < 0 || j >= o.length) return st;
  [o[k], o[j]] = [o[j], o[k]];
  return { ...st, order: o };
}
/** A new order (the ids dragged); only before the stack resolves and only the same rows. */
export function setOrder(st, ids) {
  const list = (ids ?? []).map(Number);
  if (st.cur >= 0 || list.length !== st.order.length || !st.order.every(i => list.includes(i))) return st;
  return { ...st, order: list };
}
/** Resolve: the first row in the order is now. */
export const startResolve = st => (st.cur >= 0 || !st.order.length ? st : { ...st, cur: st.order[0], rows: st.rows.map(r => (r.i === st.order[0] ? { ...r, state: "now" } : r)) });
/** The row now is done (or skipped): the next one in the order is now; after the last, the stack is resolved (cur -2). */
export function nextRow(st, skip = false) {
  if (st.cur < 0) return st;
  const k = st.order.indexOf(st.cur), nxt = st.order[k + 1];
  const rows = st.rows.map(r => (r.i === st.cur ? { ...r, state: skip ? "skip" : "done" } : r.i === nxt ? { ...r, state: "now" } : r));
  return { ...st, rows, cur: nxt ?? -2 };
}
export const resolved = st => st.cur === -2;

/** The card's HTML (the same for everyone; the GM's controls are removed for players when it is drawn). */
export function stackHtml(st) {
  const by = new Map(st.rows.map(r => [r.i, r])), before = st.cur === -1;
  const slabs = st.order.map((i, n) => {
    const r = by.get(i);
    const mark = r.state === "done" ? `<span class="rx-ok" aria-label="Done">${fa("fa-solid fa-check")}</span>` : r.state === "skip" ? `<span class="ss-skipped" aria-label="Skipped">${fa("fa-solid fa-forward")}</span>` : "";
    const use = r.action ? `<button type="button" class="rx-ch ss-use" data-ss="use" data-i="${i}">${esc(r.action)}${r.ap !== undefined && r.ap !== "" ? ` <span class="ss-ap">${esc(r.ap)} AP</span>` : ""}</button>` : `<span class="rx-tg">${esc(r.source)}</span>`;
    const card = r.itemId ? `<button type="button" class="rx-ib ss-card" data-ss="card" data-i="${i}" aria-label="See the card">${fa("fa-regular fa-id-card")}</button>` : "";
    const gm = r.state === "now" ? `<span class="ss-gmb ss-gm"><button type="button" class="rx-ib rx-use" data-ss="done" aria-label="Done">${fa("fa-solid fa-check")}</button><button type="button" class="rx-ib rx-pass" data-ss="skip" aria-label="Skip">${fa("fa-solid fa-forward")}</button></span>` : "";
    return `<div class="rx-it ss-it ${r.state}${n === 0 ? " top" : ""}" data-i="${i}">${before ? `<span class="rx-grip ss-gm" aria-label="Drag to change the order">${fa("fa-solid fa-grip-vertical")}</span>` : ""}<span class="rx-num">${n + 1}</span>${face(r)}<b class="ss-nm">${esc(r.name)}</b>${mark}<span class="ss-btns">${use}${card}${gm}</span></div>`;
  }).join("");
  const foot = before ? `<div class="rx-ft ss-gm"><button type="button" class="rx-btn rx-pri" data-ss="resolve">${fa("fa-solid fa-play")} Resolve</button></div>`
    : resolved(st) ? `<div class="ss-end">${fa("fa-solid fa-flag-checkered")} ${st.first ? `<b>${esc(st.first)}</b>'s turn begins.` : "The first turn begins."}</div>`
      : `<div class="rx-ft rx-busy">${fa("fa-solid fa-spinner fa-spin")} Resolving: the top row is used by its creature.</div>`;   // v0.0.347
  return `<div class="twod12 chat rx2 startstack"><div class="rx-hd"><span class="rx-ttl">Start of the Encounter</span></div><div class="rx-sec">Stack<span class="rx-sub">· ${before ? "in turn order, top first" : resolved(st) ? "resolved" : "resolving, top first"}</span></div><div class="rx-stk">${slabs}</div>${foot}</div>`;
}

/* ---------------------------------------------------------------- Foundry */

/** The combat starts: the "At the start of an encounter" messages of every combatant, in the turn order, as one stack card (none: no card). */
export async function postStartStack(combat) {
  const { messagesFor } = await import("./automation.mjs");
  const rows = [], seen = new Set();
  for (const c of combat.turns ?? [...combat.combatants]) {
    const a = c.actor;
    if (!a || seen.has(a.uuid)) continue;
    seen.add(a.uuid);
    for (const m of messagesFor(a, "encounter")) {
      const item = m.action ? a.items?.find?.(i => i.type === "action" && i.name.toLowerCase() === String(m.action).trim().toLowerCase()) : null;
      const text = String(m.text ?? "").replace(/\{name\}/g, a.name).replace(/\{mark\}/g, "?");
      rows.push({ actorUuid: a.uuid, name: String(c.name ?? a.name).replace(/\s*\([^()]*\)\s*$/, "").trim() || a.name,   // the short name ("Sylwen", not "Sylwen (Elf Archer, ...)")
         img: c.token?.texture?.src ?? c.img ?? a.img ?? "", disp: c.token?.disposition ?? (a.type === "character" ? 1 : -1),
        source: m.source ?? "", action: m.action ?? "", ap: m.action ? Number(m.ap) || 0 : "", itemId: item?.id ?? "", text });
    }
    // v0.0.453 (playtest 6: both Paladins forgot to Judge when the encounter started): Judge's 0 AP use (at the start of an encounter) is a row too
    for (const j of (a.items ?? []).filter(i => i.type === "action" && i.system?.markKind === "judge")) {
      // v0.0.462 (Lucas, checklist v0.0.459: "each Judge is triggering twice"): not when the creature's own start-of-encounter messages already have it
      if (rows.some(r => r.actorUuid === a.uuid && String(r.action).trim().toLowerCase() === j.name.toLowerCase())) continue;
      rows.push({ actorUuid: a.uuid, name: String(c.name ?? a.name).replace(/\s*\([^()]*\)\s*$/, "").trim() || a.name, img: c.token?.texture?.src ?? c.img ?? a.img ?? "",
        disp: c.token?.disposition ?? (a.type === "character" ? 1 : -1), source: j.name, action: j.name, ap: 0, itemId: j.id, text: `${a.name} can ${j.name} a creature (0 AP, at the start of the encounter).` });
    }
  }
  if (!rows.length) return null;
  const st = { ...newStack(rows), first: combat.combatant?.name ?? "" };
  return ChatMessage.create({ content: stackHtml(st), flags: { [F]: { startStack: st } } });
}

const save = async (msg, st) => { if (resolved(st)) st = { ...st, first: game.combat?.combatant?.name ?? st.first }; await msg.update({ content: stackHtml(st), [`flags.${F}.startStack`]: st }); return st; };
let running = null;   // { msgId, finish(ok) }: the row now (the GM's Done / Skip end it when nobody answers)

async function gmAct(msg, what, data = {}) {
  let st = msg.getFlag(F, "startStack");
  if (!st || !game.user.isGM) return;
  if (what === "order") return save(msg, setOrder(st, data.ids));
  // v0.0.347 (Lucas: "make Resolve automatically trigger the Actions, like Reactions does"): each row in turn is used by its creature, on its
  // answerer's client (the owner, else the GM), and the next waits for it; Done / Skip on the row now end a wait by hand
  if (what === "done" || what === "skip") {
    if (running?.msgId === msg.id) return running.finish(what === "done");
    return save(msg, nextRow(st, what === "skip"));
  }
  if (what !== "resolve" || st.cur !== -1) return;
  st = await save(msg, startResolve(st));
  while (st.cur >= 0) {
    const r = st.rows.find(x => x.i === st.cur);
    const ok = await new Promise(resolve => {
      let done = false;
      const finish = v => { if (done) return; done = true; running = null; resolve(!!v); };
      running = { msgId: msg.id, finish };
      runRow(r, msg.id).then(finish, () => finish(false));
    });
    st = await save(msg, nextRow(msg.getFlag(F, "startStack") ?? st, !ok));
  }
}

/** Runs a row's Action on its answerer's client and resolves true when it was used. */
async function runRow(r, msgId) {
  const actor = await actorOfUuid(r.actorUuid);
  if (!actor || !r.action) return false;
  const { answererFor } = await import("./healwin.mjs");
  const who = answererFor(actor);
  if (!who || who.id === game.user.id) return runHere({ actorUuid: r.actorUuid, itemId: r.itemId, action: r.action, ap: r.ap, source: r.source });
  const reqId = foundry.utils.randomID();
  return new Promise(resolve => {
    pending.set(reqId, resolve);
    game.socket.emit("system.twod12", { type: "ssRun", userId: who.id, reqId, from: game.user.id, msgId, data: { actorUuid: r.actorUuid, itemId: r.itemId, action: r.action, ap: r.ap, source: r.source } });
  });
}
const pending = new Map();
async function actorOfUuid(u) { try { const d = await fromUuid(u); return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { return null; } }
/** On the answerer's client: the row's Action, used free (as its @Use button does), its roll window and target as usual. */
async function runHere(d) {
  const actor = await actorOfUuid(d.actorUuid);
  const item = actor?.items?.get(d.itemId) ?? actor?.items?.find?.(i => i.type === "action" && i.name.toLowerCase() === String(d.action).trim().toLowerCase());
  if (!item) { ui.notifications.warn(`${actor?.name ?? "This creature"} has no Action called "${d.action}".`); return false; }
  ui.notifications.info(`Start of the encounter: ${actor.name}'s ${item.name}.`);
  const { useAction } = await import("./actions.mjs");
  return !!(await useAction(actor, item, { free: true, ap: Number(d.ap) || 0, label: d.source || "Start of the encounter" }));
}
/** The socket (damage.mjs routes ss* messages addressed to this user here). */
export async function onSocket(data) {
  if (data.type === "ssRun") { let ok = false; try { ok = await runHere(data.data); } catch (e) { console.warn("twod12 | start stack", e); } game.socket.emit("system.twod12", { type: "ssRunDone", userId: data.from, reqId: data.reqId, ok }); return; }
  if (data.type === "ssRunDone") { const r = pending.get(data.reqId); if (r) { pending.delete(data.reqId); r(!!data.ok); } }
}

/** A row's Action: used by its creature (the @Use button's logic, free; its owner or the GM), or its card in a window. */
async function rowAct(msg, what, i) {
  const r = msg.getFlag(F, "startStack")?.rows?.[Number(i)];
  if (!r) return;
  if (what === "use") return (await import("./freeuse.mjs")).handleUse({ target: r.action, ap: Number(r.ap) || 0, count: 1, actor: r.actorUuid, source: r.source }, { message: msg });
  let actor = null; try { actor = await fromUuid(r.actorUuid); actor = actor?.documentName === "Actor" ? actor : actor?.actor ?? null; } catch (e) { actor = null; }
  const item = actor?.items?.get(r.itemId);
  if (!item) return ui.notifications.warn("That Action is gone.");
  return (await import("./ccdamage.mjs")).openItemCardWindow(item);
}

/** Draws a stack card: the GM's controls work for the GM and are removed for players; the Action and Card buttons work for everyone allowed. */
export function bindStartStack(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const st = msg?.getFlag?.(F, "startStack");
  if (!el || !st) return;
  if (!game.user.isGM) el.querySelectorAll(".ss-gm").forEach(b => b.remove());
  el.querySelectorAll("[data-ss]").forEach(b => b.addEventListener("click", ev => {
    ev.preventDefault(); ev.stopPropagation();
    const k = b.dataset.ss;
    (k === "use" || k === "card" ? rowAct(msg, k, b.dataset.i) : gmAct(msg, k)).catch(e => console.warn("twod12 | start stack", e));
  }));
  if (game.user.isGM && st.cur === -1) dragRows(msg, el);
}

/** The GM drags the rows (by the grip or the row) to change the order; the new order is saved on drop. */
function dragRows(msg, el) {
  const box = el.querySelector(".rx-stk");
  if (!box) return;
  const rows = () => [...box.querySelectorAll(".ss-it")], ids = () => rows().map(s => Number(s.dataset.i));
  const renumber = () => rows().forEach((s, k) => { const n = s.querySelector(".rx-num"); if (n) n.textContent = String(k + 1); s.classList.toggle("top", k === 0); });
  let dragged = null, start = "";
  for (const s of rows()) {
    s.draggable = true;
    s.addEventListener("dragstart", e => { e.stopPropagation(); dragged = s; start = ids().join(","); s.classList.add("rx-drag"); try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", "twod12-ss"); } catch (x) { /* */ } });
    s.addEventListener("dragend", e => { e.stopPropagation(); s.classList.remove("rx-drag"); dragged = null; const now = ids(); if (now.join(",") !== start) gmAct(msg, "order", { ids: now }).catch(() => {}); });
  }
  box.addEventListener("dragover", e => {
    if (!dragged) return;
    e.preventDefault(); e.stopPropagation();
    const over = e.target.closest?.(".ss-it");
    if (!over || over === dragged) return;
    const rc = over.getBoundingClientRect();
    box.insertBefore(dragged, e.clientY > rc.top + rc.height / 2 ? over.nextSibling : over);
    renumber();
  });
  box.addEventListener("drop", e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } });
}
