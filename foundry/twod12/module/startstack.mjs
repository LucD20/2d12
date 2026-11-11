// v0.0.345 (Lucas, playtest 4; book, Chapter 2, "The Start of the Encounter"): abilities that happen at the start of an encounter (Mark Quarry,
// more to come, PCs and NPCs) no longer post one message each. When the combat starts, ONE card lists them as a stack in the turn order; the GM
// can move rows up or down (an ally going later), then clicks Resolve: the rows resolve one at a time in that order (the row's creature uses its
// button; the GM marks it Done or Skip), and the card says when the first turn begins. Every button stays usable by hand.
// The stack lives on the message's flags (twod12.startStack); the content is rebuilt from it on every change. Only the GM changes it.
import { cardHead, cardVars } from "./config.mjs";
import { SYS_COLOR } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
const F = "twod12";

/* ---------------------------------------------------------------- pure */

/** A new stack. rows: [{ actorUuid, name, source, html }] in the turn order. */
export const newStack = rows => ({ v: 1, rows: rows.map((r, i) => ({ ...r, i, state: "wait" })), order: rows.map((r, i) => i), cur: -1, first: "" });
/** Moves a row one place up (-1) or down (+1); only before the stack resolves. */
export function moveRow(st, i, dir) {
  if (st.cur >= 0) return st;
  const o = [...st.order], k = o.indexOf(i), j = k + dir;
  if (k < 0 || j < 0 || j >= o.length) return st;
  [o[k], o[j]] = [o[j], o[k]];
  return { ...st, order: o };
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
  const by = new Map(st.rows.map(r => [r.i, r]));
  const list = st.order.map((i, n) => {
    const r = by.get(i), first = n === 0, last = n === st.order.length - 1;
    const mark = { wait: "", now: '<span class="ss-st now">Now</span>', done: '<span class="ss-st done">Done</span>', skip: '<span class="ss-st skip">Skipped</span>' }[r.state] ?? "";
    const move = st.cur === -1 ? `<span class="ss-move ss-gm"><button type="button" data-ss="up" data-i="${i}"${first ? " disabled" : ""} aria-label="Move up" data-tooltip="Move up (resolves earlier)">▲</button><button type="button" data-ss="down" data-i="${i}"${last ? " disabled" : ""} aria-label="Move down" data-tooltip="Move down (resolves later)">▼</button></span>` : "";
    const ctl = r.state === "now" ? `<span class="ss-ctl ss-gm"><button type="button" data-ss="done" class="ss-pri">Done</button><button type="button" data-ss="skip">Skip</button></span>` : "";
    return `<li class="ss-row ${r.state}"><span class="ss-n">${n + 1}</span><div class="ss-body"><div class="ss-who"><b>${esc(r.name)}</b> <span class="ss-src">${esc(r.source)}</span>${mark}${move}</div><div class="ss-text">${r.html}</div>${ctl}</div></li>`;
  }).join("");
  const foot = st.cur === -1
    ? `<div class="ss-foot"><span class="ss-hint">In the turn order. The GM can move a row (an ally going later), then resolve them one at a time before the first turn.</span><button type="button" data-ss="resolve" class="ss-pri ss-gm"><i class="fa-solid fa-play"></i> Resolve</button></div>`
    : resolved(st) ? `<div class="ss-foot done"><i class="fa-solid fa-flag-checkered"></i> All resolved.${st.first ? ` <b>${esc(st.first)}</b>'s turn begins.` : " The first turn begins."}</div>`
      : `<div class="ss-foot"><span class="ss-hint">Resolving, one at a time: the row marked Now.</span></div>`;
  return `<div class="twod12 chat action sysmsg startstack" style="${cardVars(SYS_COLOR)}">${cardHead("Start of the Encounter", "", "")}<ol class="ss-list">${list}</ol>${foot}</div>`;
}

/* ---------------------------------------------------------------- Foundry */

/** The combat starts: the "At the start of an encounter" messages of every combatant, in the turn order, as one stack card (none: no card). */
export async function postStartStack(combat) {
  const { messagesFor, messageHtml } = await import("./automation.mjs");
  const TE = foundry.applications?.ux?.TextEditor?.implementation;
  const rows = [], seen = new Set();
  for (const c of combat.turns ?? [...combat.combatants]) {
    const a = c.actor;
    if (!a || seen.has(a.uuid)) continue;
    seen.add(a.uuid);
    for (const m of messagesFor(a, "encounter")) {
      const raw = messageHtml(a, m, { withActor: true }).replace(/^<b>[^<]*<\/b>:\s*/, "");   // the name is on the row
      rows.push({ actorUuid: a.uuid, name: c.name ?? a.name, source: m.source ?? "", html: TE?.enrichHTML ? await TE.enrichHTML(raw) : raw });
    }
  }
  if (!rows.length) return null;
  const st = { ...newStack(rows), first: combat.combatant?.name ?? "" };
  return ChatMessage.create({ content: stackHtml(st), flags: { [F]: { startStack: st, action: { actorUuid: rows[0].actorUuid } } } });
}

async function act(msg, what, i) {
  let st = msg.getFlag(F, "startStack");
  if (!st || !game.user.isGM) return;
  if (what === "up" || what === "down") st = moveRow(st, Number(i), what === "up" ? -1 : 1);
  else if (what === "resolve") st = startResolve(st);
  else if (what === "done" || what === "skip") st = nextRow(st, what === "skip");
  if (resolved(st)) st = { ...st, first: game.combat?.combatant?.name ?? st.first };
  await msg.update({ content: stackHtml(st), [`flags.${F}.startStack`]: st });
}

/** Draws a stack card: the GM's controls work for the GM and are removed for players. */
export function bindStartStack(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  if (!el || !msg?.getFlag?.(F, "startStack")) return;
  if (!game.user.isGM) { el.querySelectorAll(".ss-gm").forEach(b => b.remove()); return; }
  el.querySelectorAll("[data-ss]").forEach(b => b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); act(msg, b.dataset.ss, b.dataset.i).catch(e => console.warn("twod12 | start stack", e)); }));
}
