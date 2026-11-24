// v0.0.362 (Lucas, 2026-11-11: mockup foundry/mockups/turn-breakdown.html, layout A): the Turn Breakdown as a dock at the bottom of the chat.
// It shows the current turn: the AP regained, the Guard of the unused AP, every Action, movement (live while it goes on) and Reaction of the
// turn with the AP pips, the Effects that tick down when this turn ends, and every Effect on the creature (with its rounds left, Guard
// included). Folded by default; each client unfolds it (a client setting); the "Turn" button that replaces Export Chat Log shows or hides it
// (Export Chat Log moves to the Journal tab). The AP tickers, the unused AP line and the duration lines are no longer chat messages: one line
// "End of X's Turn" is posted when a turn ends (it unfolds into that turn's breakdown). Past turns: the Encounter Log.
import { esc, perFrame } from "./util.mjs";
import { ICON, pipsHtml } from "./ticker.mjs";
const F = "twod12";
const num = v => Number(v) || 0;
export const UNSPENT_AP_LINK = "Unspent AP";   // the book's heading (Chapter 2), opened like the cards' book links

/** Pure: the turn's key, as the Turn Log lines carry it ("round:turn"). */
export const turnKey = combat => `${combat?.round ?? 0}:${combat?.turn ?? 0}`;

/** Pure: an effect's rounds left as a short badge: "2 rd", "EoT", or "" (until removed). */
export function roundsLeft(fl) {
  const d = fl?.duration;
  if (d?.type === "eot") return "EoT";
  if (d?.type === "rounds") { const r = num(fl.remaining ?? d.rounds); return r > 0 ? `${r} rd` : ""; }
  return "";
}

/**
 * Pure: the rows of "On <creature>": every Effect it has (given this turn too), then its Guard.
 * effects: [{ name, flags (the twod12 flags), disabled }]; system: { guard, apGuard }.
 */
export function onRows(effects, system = {}) {
  const rows = (effects ?? []).filter(e => !e.disabled).map(e => ({ name: String(e.name ?? ""), badge: roundsLeft(e.flags) }));
  if (num(system.apGuard) > 0) rows.push({ name: `Guard ${num(system.apGuard)}`, why: "unused AP", badge: "1 rd", guard: true });
  if (num(system.guard) > 0) rows.push({ name: `Guard ${num(system.guard)}`, badge: "", guard: true });
  return rows;
}

/**
 * Pure: the dock's model. lines: the current creature's Turn Log; reacts: other creatures' Reaction lines in this turn ([{ who, line }]);
 * live: a movement under way { sq } (squares moved so far) or null; ticks: [{ name, on, step: "tick" | "end", rem }];
 * on: onRows(); apGuard: the Guard of its unused AP.
 */
export function dockModel({ who = "", round = 0, lines = [], reacts = [], live = null, ticks = [], on = [], apGuard = 0, ap = null, rap = null, max = 4, rapMax = 1 }) {
  const rows = [];
  for (const l of lines ?? []) {
    rows.push({ kind: l.k, name: l.n + (l.k === "move" && (l.sq ?? null) !== null ? ` ${l.sq}` : ""), live: !!l.live, line: l, sq: l.sq });
    if (l.k === "start" && num(apGuard) > 0) rows.push({ kind: "guard", name: `Guard ${num(apGuard)}`, why: "unused AP", badge: "1 rd" });
  }
  if (live) { const r = [...rows].reverse().find(x => x.live); if (r) r.name = `${r.line.n} ${Math.round(num(live.sq) * 100) / 100}`; }
  for (const { who: w, line } of reacts ?? []) rows.push({ kind: "react", name: `${w}: ${line.n}`, line, other: true });
  return { who, round, rows, ticks: ticks ?? [], on: on ?? [], ap, rap, max, rapMax };
}

const badge = (txt, cls = "rd") => (txt ? `<span class="td-badge ${cls}">${esc(txt)}</span>` : "");
const unspent = () => `<a class="td-link" data-twod12-book="${UNSPENT_AP_LINK}">unused AP</a>`;
/** Pure: the header's pips (AP left, then the Reaction Point). */
export function headPips(ap, rap, max, rapMax = 1) {
  if (ap === null || ap === undefined) return "";
  const m = Math.max(1, num(max), num(ap));
  const out = []; for (let i = 0; i < m; i++) out.push(`<i class="${i < num(ap) ? "on" : ""}"></i>`);
  if (rap !== null && rap !== undefined) {
    const rm = Math.max(1, num(rapMax), num(rap));
    out.push(`<b class="hsep"></b><i class="r${num(rap) >= 1 ? " on" : ""}"></i>`);   // v0.0.394: a hairline, as the HUD
    for (let i = 1; i < rm; i++) out.push(`<i class="r${i < num(rap) ? " on" : ""}"></i>`);
  }
  return `<span class="td-pips">${out.join("")}</span>`;
}
const tickBadge = t => (t.step === "end" ? badge(t.done ? "ended" : "ends", "end") : badge(t.done ? `${t.rem} rd left` : `${t.rem + 1} → ${t.rem}`, "tick"));

/** Pure: the body (the timeline, the end of the turn, the creature's Effects). done: the turn has ended (the ticks happened). */
export function bodyHtml(m, { done = false } = {}) {
  const row = r0 => {
    const r = done && r0.live ? { ...r0, live: false } : r0;   // an ended turn shows no movement "still going"
    if (r.kind === "guard") return `<div class="td-r"><span class="td-ic guard"><i class="fa-solid fa-shield-halved"></i></span><span class="td-nm"><b class="td-g">${esc(r.name)}</b> (${unspent()})</span>${badge(r.badge)}</div>`;
    const cls = r.kind === "move" ? "mv" : (r.kind === "react" ? "rx" : "ap");
    const cost = r.kind === "start" ? `<span class="td-c ap">${esc(r.line.c)}</span>` : pipsHtml(r.line, true);
    return `<div class="td-r${r.live ? " now" : ""}"><span class="td-ic ${cls}">${ICON[r.kind] ?? ICON.act}</span><span class="td-nm">${esc(r.name)}${r.kind === "move" && (r.sq !== undefined || r0.live) ? " sq" : ""}${r.live ? '<span class="td-live" aria-label="Still moving"></span>' : ""}</span>${cost}</div>`;
  };
  const tl = m.rows.length ? m.rows.map(row).join("") : `<div class="td-r td-none">Nothing yet.</div>`;
  const ticks = m.ticks.length ? `<div class="td-sep">${done ? "When the turn ended" : "At the end of this turn"}</div>${m.ticks.map(t => `<div class="td-r"><span class="td-ic">⏳</span><span class="td-nm">${esc(t.name)}${t.on ? ` <span class="td-on">on ${esc(t.on)}</span>` : ""}</span>${tickBadge({ ...t, done })}</div>`).join("")}` : "";
  const on = `<div class="td-sep">On ${esc(m.who)}</div>${m.on.length ? m.on.map(r => `<div class="td-r"><span class="td-ic${r.guard ? " guard" : ""}">${r.guard ? '<i class="fa-solid fa-shield-halved"></i>' : "●"}</span><span class="td-nm">${r.guard ? `<b class="td-g">${esc(r.name)}</b>${r.why ? ` (${unspent()})` : ""}` : esc(r.name)}</span>${badge(r.badge)}</div>`).join("") : `<div class="td-r td-none">No Effects.</div>`}`;
  return `<div class="td-tl">${tl}${ticks}${on}</div>`;
}

/** Pure: the dock. open: unfolded on this client. */
export function dockHtml(m, open = false) {
  return `<div class="twod12 twod12-dock${open ? " open" : ""}"><div class="td-hd" data-twod12-dock="fold"><span class="td-ttl">Turn</span><span class="td-who">${esc(m.who)}</span><span class="td-rd">Round ${esc(String(m.round))}</span><span class="td-sp">${headPips(m.ap, m.rap, m.max, m.rapMax)}<span class="td-chev">▲</span></span></div><div class="td-body">${bodyHtml(m)}</div></div>`;
}

/** Pure: the chat line posted when a turn ends: one line that unfolds into the turn's breakdown. */
export function endCardHtml(m) {
  const ended = m.ticks.filter(t => t.step === "end").length, ticked = m.ticks.length - ended;
  const tail = [ticked ? `${ticked} ticked` : "", ended ? `${ended} ended` : ""].filter(Boolean).join(" · ");
  return `<details class="twod12 chat turnend"><summary><span class="td-ttl">End of ${esc(m.who)}'s Turn</span>${tail ? `<span class="td-rd">${esc(tail)}</span>` : ""}<span class="td-sp">${headPips(m.ap, m.rap, m.max, m.rapMax)}<span class="td-chev">▶</span></span></summary>${bodyHtml(m, { done: true })}</details>`;
}

/* ------------------------------------------------------------------ reading the world */

/** The Effects that tick or end when this combatant's turn ends (the same rule the durations use: effects.mjs durationStep). */
export function ticksAt(combat, c) {
  if (!combat || !c) return [];
  try {
    return pendingSteps(combat, c, { round: combat.round, turn: combat.turn, combatantId: c.id }).map(x => ({ name: x.name, on: x.on, step: x.step, rem: x.rem }));
  } catch (e) { return []; }
}
let stepper = null;   // effects.mjs pendingSteps, set by registerTurnDock (no import cycle)
const pendingSteps = (...a) => (stepper ? stepper(...a) : []);

/** The model for a combatant's turn, read from the world. ticks: given (the end card passes what happened), else what will happen. */
export function modelFor(combat, c, { ticks = null, key = null, round = null } = {}) {   // key / round: an ended turn's (the end card)
  const a = c?.actor;
  key ??= turnKey(combat);
  const lines = c?.getFlag?.(F, "turnLog") ?? [];
  const reacts = [];
  for (const o of combat?.combatants ?? []) {
    if (o.id === c?.id || (o.hidden && !game.user?.isGM)) continue;
    for (const l of o.getFlag?.(F, "turnLog") ?? []) if (l.k === "react" && l.at === key) reacts.push({ who: firstName(o.name), line: l });
  }
  let live = null;
  if (lines.some(l => l.live)) { const L = lines.findLast(l => l.live); const left = num(c.getFlag(F, "freeMove")) + num(c.getFlag(F, "evadeMove")) + num(c.getFlag(F, "moveLeft")); live = { sq: Math.max(0, num(L.g) - left) }; }
  const fx = [...(a?.effects ?? [])].map(e => ({ name: e.name, disabled: e.disabled, flags: e.flags?.[F] ?? {} }));
  const role = String(a?.system?.role ?? "");
  const baseMax = role === "minion" ? 2 : role === "boss" ? 6 : 4;
  const maxAp = Math.max(1, num(c?.getFlag?.(F, "apMax")) || baseMax, num(c?.getFlag?.(F, "ap")));
  const rapMax = Math.max(1, num(c?.getFlag?.(F, "rapMax")) || (role === "boss" ? 2 : 1), num(c?.getFlag?.(F, "rap")));
  return dockModel({ who: firstName(c?.name ?? ""), round: round ?? combat?.round ?? 0, lines, reacts, live, ticks: ticks ?? ticksAt(combat, c), on: onRows(fx, a?.system ?? {}), apGuard: a?.system?.apGuard ?? 0,
    ap: c?.getFlag?.(F, "ap") ?? null, rap: c?.getFlag?.(F, "rap") ?? null, max: maxAp, rapMax });
}
const firstName = n => String(n ?? "").replace(/\s*\(.*\)\s*$/, "");

/* ------------------------------------------------------------------ the dock in the chat, the Turn button, Export Chat Log on the Journal tab */
const shown = () => { try { return game.settings.get(F, "turnDockShown") !== false; } catch (e) { return true; } };
const opened = () => { try { return !!game.settings.get(F, "turnDockOpen"); } catch (e) { return false; } };

/**
 * v0.0.363 (Lucas: "can't click on it"; it floated over the map): the dock is an element of its own (in the body, so no Foundry layer takes its
 * clicks), placed right above the chat's input wherever V14 shows it: in the sidebar's chat tab, or floating at the bottom right (the
 * notifications area, when the sidebar is collapsed or on another tab). In the sidebar the log gets room at its bottom so no message hides under it.
 */
const visible = el => { if (!el?.getBoundingClientRect) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
function chatInput() {
  const forms = [...document.querySelectorAll(".chat-form, #chat-form")];
  const tx = document.querySelector("#chat-message");
  if (tx) forms.push(tx.closest("form, .chat-form") ?? tx.parentElement);
  return forms.find(visible) ?? null;
}
let padded = null;
function padLog(px) {
  const log = px ? (document.querySelector("#sidebar #chat .chat-scroll") ?? document.querySelector("#sidebar .chat-scroll")) : null;
  if (padded && padded !== log) { padded.style.paddingBottom = ""; padded = null; }
  if (log) { log.style.paddingBottom = `${px}px`; padded = log; }
}
export function placeDock() {
  if (typeof document === "undefined") return;
  const dock = document.getElementById("twod12-dock");
  if (!dock) return;
  // v0.0.371 (Lucas: "while the chat is collapsed, the dock appears at the top"): no dock while the sidebar is collapsed, nor when the
  // chat's input is measured somewhere absurd (an animation, a hidden floating input): it waits for the chat to open again
  const collapsed = globalThis.ui?.sidebar?.expanded === false || !!document.querySelector("#sidebar.collapsed");
  const form = dock.hidden || collapsed ? null : chatInput();
  if (!form || form.getBoundingClientRect().top < window.innerHeight / 3) { dock.style.display = "none"; padLog(0); return; }
  dock.style.display = "";
  const r = form.getBoundingClientRect();
  dock.style.left = `${Math.round(r.left)}px`;
  dock.style.width = `${Math.round(r.width)}px`;
  dock.style.bottom = `${Math.round(window.innerHeight - r.top + 4)}px`;
  padLog(form.closest("#sidebar") ? Math.ceil(dock.getBoundingClientRect().height + 8) : 0);
}
const placeSoon = perFrame(placeDock);
function dockEl() {
  let dock = document.getElementById("twod12-dock");
  if (!dock) { dock = document.createElement("div"); dock.id = "twod12-dock"; dock.className = "twod12-dockwrap"; document.body.append(dock); }
  return dock;
}
export function renderDock() {
  if (typeof document === "undefined") return;
  const dock = dockEl();
  const combat = game.combat, c = combat?.combatant;
  if (!shown() || !combat?.started || !c || (c.hidden && !game.user.isGM)) { dock.innerHTML = ""; dock.hidden = true; placeDock(); return; }
  try { dock.innerHTML = dockHtml(modelFor(combat, c), opened()); dock.hidden = false; } catch (e) { console.warn("twod12 | Turn Breakdown", e); }
  placeDock();
}
/** Console: where the dock and the Turn button went (for a screenshot that looks wrong). */
export function dockInfo() {
  const form = chatInput(), exp = document.querySelector('[data-action="export"]'), btn = document.querySelector(".twod12-turnbtn");
  const where = el => (el ? `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}.${[...el.classList].join(".")} in ${el.closest("#sidebar") ? "the sidebar" : (el.closest("#chat-notifications") ? "#chat-notifications" : el.parentElement?.id || el.parentElement?.className || "?")}` : "none");
  const info = { input: where(form), exportButton: where(exp), turnButton: where(btn), turnButtonParent: where(btn?.parentElement), dock: document.getElementById("twod12-dock")?.style.cssText ?? "none" };
  console.log("twod12 | Turn Breakdown:", info);
  return info;
}
const drawSoon = perFrame(renderDock);

/** The Turn button, where Foundry's Export Chat Log was (its button is hidden; Export Chat Log is on the Journal tab). */
/**
 * v0.0.364 (Lucas: the button sat at the very bottom and Export Chat Log stayed; dockInfo: the button was in section#chat, the floppy-disk
 * Export button in the sidebar): V14 draws the chat's buttons after the chat itself, so at that moment there was no Export button to replace.
 * Now every Export Chat Log button that appears (the sidebar's, the floating input's) gets the Turn button in its place and is hidden, whenever
 * Foundry draws it; a Turn button left anywhere else is removed.
 */
function makeTurnButton() {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "ui-control icon fa-solid fa-list-check twod12-turnbtn";
  b.setAttribute("aria-pressed", String(shown()));
  b.setAttribute("aria-label", "Turn Breakdown: show or hide");
  b.addEventListener("click", async ev => { ev.preventDefault(); ev.stopPropagation(); await game.settings.set(F, "turnDockShown", !shown()); document.querySelectorAll(".twod12-turnbtn").forEach(x => x.setAttribute("aria-pressed", String(shown()))); renderDock(); });
  return b;
}
export function ensureTurnButtons() {
  if (typeof document === "undefined") return;
  const exps = [...document.querySelectorAll('[data-action="export"]')].filter(e => e.closest("#sidebar, #chat-notifications, #chat, .chat-form"));
  for (const exp of exps) {
    exp.classList.add("twod12-hidden");
    if (!exp.previousElementSibling?.classList?.contains("twod12-turnbtn")) exp.before(makeTurnButton());
  }
  for (const b of document.querySelectorAll(".twod12-turnbtn")) if (!b.nextElementSibling?.matches?.('[data-action="export"]')) b.remove();
}
const turnButtonsSoon = perFrame(ensureTurnButtons);
/** Export Chat Log, moved to the Journal tab's footer. */
function journalExport(root) {
  if (!root?.querySelector || root.querySelector(".twod12-exportchat")) return;
  const foot = root.querySelector(".directory-footer, footer") ?? root;
  const b = document.createElement("button");
  b.type = "button"; b.className = "twod12-exportchat";
  b.innerHTML = '<i class="fa-solid fa-file-export"></i> Export Chat Log';
  b.setAttribute("aria-label", "Save the chat log as a text file");
  b.addEventListener("click", ev => { ev.preventDefault(); try { (game.messages?.export ?? (() => ui.chat?.exportLog?.())).call(game.messages); } catch (e) { console.warn("twod12 | export chat", e); } });
  foot.append(b);
}

export function registerTurnDock({ pendingSteps: ps } = {}) {
  if (ps) stepper = ps;
  game.settings.register(F, "turnDockShown", { scope: "client", config: false, type: Boolean, default: true });
  game.settings.register(F, "turnDockOpen", { scope: "client", config: false, type: Boolean, default: false });
  const el = h => (h instanceof HTMLElement ? h : h?.[0]);
  Hooks.on("renderChatLog", () => { try { turnButtonsSoon(); drawSoon(); } catch (e) { console.warn("twod12 | Turn button", e); } });
  Hooks.on("renderJournalDirectory", (app, html) => { try { journalExport(app?.element ?? el(html)); } catch (e) { console.warn("twod12 | Export Chat Log", e); } });
  // registered at ready (twod12.mjs): the chat and the Journal tab are already drawn
  if (typeof document !== "undefined") { try { ensureTurnButtons(); const j = document.querySelector("#journal"); if (j) journalExport(j); } catch (e) { /* drawn on their next render */ } drawSoon(); }
  // v0.0.363: the dock follows the chat input (the sidebar opened, closed or on another tab, the window resized)
  for (const h of ["collapseSidebar", "changeSidebarTab", "renderSidebar", "renderChatLog"]) Hooks.on(h, () => { placeSoon(); setTimeout(placeDock, 450); });
  if (typeof window !== "undefined") window.addEventListener("resize", placeSoon);
  // v0.0.364: Foundry redraws the chat's buttons on its own (a part of the chat, the input moving to the floating area): watch for them
  if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") new MutationObserver(muts => { if (muts.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && (n.matches?.('[data-action="export"]') || n.querySelector?.('[data-action="export"]'))))) turnButtonsSoon(); }).observe(document.body, { childList: true, subtree: true });
  for (const h of ["createCombat", "deleteCombat", "updateCombat", "combatStart", "combatTurnChange", "createCombatant", "updateCombatant", "deleteCombatant",
    "createActiveEffect", "updateActiveEffect", "deleteActiveEffect", "updateRegion", "deleteRegion", "canvasReady"]) Hooks.on(h, drawSoon);
  Hooks.on("updateActor", (a, ch) => { if (ch?.system && ("guard" in ch.system || "apGuard" in ch.system)) drawSoon(); });
  // the fold, per client
  if (typeof document !== "undefined") document.addEventListener("click", async ev => {
    const link = ev.target?.closest?.(".twod12-dock .td-link, .twod12.chat.turnend .td-link");
    if (link) { ev.preventDefault(); ev.stopPropagation(); const { openBook } = await import("./inline.mjs"); return openBook({ ref: link.dataset.twod12Book, doc: "Chapter 2" }); }
    const hd = ev.target?.closest?.('[data-twod12-dock="fold"]');
    if (!hd) return;
    await game.settings.set(F, "turnDockOpen", !opened());
    renderDock();
  });
}

/** GM, when a turn ends: the "End of X's Turn" line (what ticked and ended is passed by the durations hook, after it applied them). */
export async function postTurnEnd(combat, c, ticks, prior = null) {
  if (!c || !combat || typeof globalThis.ChatMessage === "undefined") return;
  const m = modelFor(combat, c, { ticks, key: prior ? `${prior.round}:${prior.turn}` : null, round: prior?.round ?? null });
  if (!m.rows.length && !ticks.length) return;
  await ChatMessage.create({ content: endCardHtml(m), flags: { [F]: { turnEnd: { combatantId: c.id, round: combat.round } } } });
}
