// The AP ticker and its Turn Log (v0.0.200, Lucas: design M1 + L3, mockup foundry/mockups/chat-turnlog.html).
// v0.0.362: no longer posted (the Turn Breakdown dock shows the log: turndock.mjs); tickerHtml still draws the older messages. Was:
// One chat message per event (a turn start, an Action that spends AP, a movement when it ends, a Reaction): one thin line closed; opened,
// the Turn Log of that creature's turn-cycle up to that event, one line per Action, with the AP pips after it. The log is a SNAPSHOT
// in the message (flags.twod12.ticker): a message is never edited later. The running log is the combatant's flag twod12.turnLog, reset at
// the start of its turn; a Reaction in someone else's turn is the next line of the reacting creature's own turn-cycle.
import { esc } from "./util.mjs";
const F = "twod12";

export const ICON = { start: "◆", move: "➤", act: "✦", react: "↺" };   // ◆ ➤ ✦ ↺

/** Pure: a log line. kind start | move | act | react; before / after: the AP around it; max: how many pips. */
export function makeLine(kind, name, before, after, max, rap = null) {
  const b = Math.max(0, Math.round(Number(before) || 0)), a = Math.max(0, Math.round(Number(after) || 0));
  const m = Math.max(1, Math.round(Number(max) || 0), b, a);
  const spent = Math.max(0, b - a);
  // v0.0.243 (pack R): the Reaction Point on the line (rb / ra: before and after); a Reaction's cost counts what the Reaction Point paid too.
  const rb = rap ? Math.max(0, Math.round(Number(rap.b) || 0)) : undefined, ra = rap ? Math.max(0, Math.round(Number(rap.a) || 0)) : undefined;
  const rSpent = rap ? Math.max(0, rb - ra) : 0;
  const cost = kind === "start" ? `+${Math.max(0, a - b)}${rap && ra > rb ? " +R" : ""}` : (kind === "react" ? `−${spent + rSpent}R` : `−${spent} AP`);
  return { k: kind, n: String(name ?? ""), c: cost, b, a, s: kind === "start" ? 0 : spent, m, ...(rap ? { rb, ra } : {}) };
}

/** Pure: the pips of a line: filled = AP left after it, a red ring = spent on this line, grey = spent before it (or not there); then the Reaction Point as a diamond. */
export function pipsHtml(line, small = false) {
  const out = [];
  for (let i = 0; i < line.m; i++) out.push(i < line.a ? '<i class="on"></i>' : (i < line.a + line.s ? '<i class="spent"></i>' : "<i></i>"));
  if (line.ra !== undefined) out.push(`<span class="hsep"></span><i class="rap${line.ra ? " on" : ((line.rb ?? 0) > line.ra ? " spent" : "")}"></i>`);
  return `<span class="tk-pips${small ? " sm" : ""}${line.m > 5 ? " many" : ""}">${out.join("")}</span>`;
}

/** Pure: the ticker of the last line of `lines` (the snapshot), with the Turn Log of all of them inside. */
export function tickerHtml(who, lines) {
  const last = lines.at(-1);
  if (!last) return "";
  const kindCls = last.k === "move" ? "mv" : "ap";
  const logCost = l => l.c.replace(/\s*AP$/, "");
  const log = lines.map((l, i) => `<div class="tl-ln${i === lines.length - 1 ? " now" : " old"}"><span class="tl-ico ${l.k === "move" ? "mv" : "ap"}">${ICON[l.k] ?? ICON.act}</span><span class="tl-nm">${esc(l.n)}</span><span class="tl-c">${esc(logCost(l))}</span>${pipsHtml(l, true)}</div>`).join("");
  return `<div class="twod12 chat ticker"><details class="tk ${kindCls}"><summary><span class="tk-ico">${ICON[last.k] ?? ICON.act}</span><span class="tk-who">${esc(who)}</span><span class="tk-act">${esc(last.n)}</span><span class="tk-cost">${esc(last.c)}</span><span class="tk-sp">${pipsHtml(last)}<span class="tk-chev">&#9654;</span></span></summary><div class="tl">${log}</div></details></div>`;
}

/** Pure: the log after an event: a turn start begins a new one; anything else is added. */
export const nextLog = (log, line) => (line.k === "start" ? [line] : [...(log ?? []), line]);

/** v0.0.362: the turn a line happened in ("round:turn"), so the Turn Breakdown shows another creature's Reaction in the turn it was used. */
export const stamp = line => { const c = globalThis.game?.combat; return c ? { ...line, at: `${c.round ?? 0}:${c.turn ?? 0}` } : line; };

/**
 * Add an event to a combatant's Turn Log. v0.0.362 (Lucas: "it should all go into the Turn Breakdown"): the Turn Breakdown dock at the bottom
 * of the chat shows the log live (turndock.mjs), so no ticker message is posted any more; a turn's end posts one "End of X's Turn" line.
 * Writing needs an owner of the combatant. lines: the Turn Log already written with the event's own update (setAP's patch).
 */
// v0.0.462 (Lucas's console, checklist v0.0.459: "The Combat ... does not exist" from the turn log): every writer skips a combat already deleted
const combatGone = c => !!(c?.parent?.id && globalThis.game?.combats?.has && !game.combats.has(c.parent.id));
export async function logEvent(c, line, { lines: written = null } = {}) {
  if (!c) return null;
  // v0.0.277 (Lucas: "The Combat ... does not exist" when an encounter ended mid-movement): a combat already deleted gets no line
  if (c.parent?.id && globalThis.game?.combats?.has && !game.combats.has(c.parent.id)) return null;
  const lines = written ?? nextLog(c.getFlag?.(F, "turnLog") ?? [], stamp(line));
  try { if (c.isOwner && !written) await c.setFlag(F, "turnLog", lines); } catch (e) { console.warn("twod12 | turn log", e); }
  return lines;
}

/** v0.0.362: a movement starts: its line goes into the Turn Log at once, marked live (g: the squares it may move), so the dock counts it up. */
export async function logLive(c, line, granted) {
  if (!c?.isOwner || combatGone(c)) return;
  try { await c.setFlag(F, "turnLog", [...(c.getFlag?.(F, "turnLog") ?? []), { ...stamp(line), live: true, g: Number(granted) || 0 }]); } catch (e) { console.warn("twod12 | turn log", e); }
}
/** Pure: the Turn Log with its last live line replaced by the finished one (or the finished one added). */
export function finishLive(lines, done) {
  const out = [...(lines ?? [])];
  let k = -1; for (let i = out.length - 1; i >= 0; i--) if (out[i]?.live) { k = i; break; }
  if (k >= 0) out[k] = { ...done, at: out[k].at ?? done.at }; else out.push(done);
  return out;
}
/** The movement ended (or another Action comes first): its live line becomes the finished one, with the squares moved. */
export async function logMoveDone(c, line) {
  if (!c?.isOwner || combatGone(c)) return null;
  const lines = finishLive(c.getFlag?.(F, "turnLog") ?? [], stamp(line));
  try { await c.setFlag(F, "turnLog", lines); } catch (e) { console.warn("twod12 | turn log", e); }
  return lines;
}
