// The AP ticker and its Turn Log (v0.0.200, Lucas: design M1 + L3, mockup foundry/mockups/chat-turnlog.html).
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
  // v0.0.243 (pack R): the Reaction AP on the line (rb / ra: before and after); a Reaction's cost counts what the Reaction AP paid too.
  const rb = rap ? Math.max(0, Math.round(Number(rap.b) || 0)) : undefined, ra = rap ? Math.max(0, Math.round(Number(rap.a) || 0)) : undefined;
  const rSpent = rap ? Math.max(0, rb - ra) : 0;
  const cost = kind === "start" ? `+${Math.max(0, a - b)}${rap && ra > rb ? " +R" : ""}` : (kind === "react" ? `−${spent + rSpent}R` : `−${spent} AP`);
  return { k: kind, n: String(name ?? ""), c: cost, b, a, s: kind === "start" ? 0 : spent, m, ...(rap ? { rb, ra } : {}) };
}

/** Pure: the pips of a line: filled = AP left after it, a red ring = spent on this line, grey = spent before it (or not there); then the Reaction AP as a diamond. */
export function pipsHtml(line, small = false) {
  const out = [];
  for (let i = 0; i < line.m; i++) out.push(i < line.a ? '<i class="on"></i>' : (i < line.a + line.s ? '<i class="spent"></i>' : "<i></i>"));
  if (line.ra !== undefined) out.push(`<span class="hsep"></span><i class="rap${line.ra ? " on" : ((line.rb ?? 0) > line.ra ? " spent" : "")}"></i>`);
  const tip = `${line.a} AP left${line.ra !== undefined ? `, Reaction AP ${line.ra ? "ready" : "spent"}` : ""}`;
  return `<span class="tk-pips${small ? " sm" : ""}${line.m > 5 ? " many" : ""}" data-tooltip="${tip}">${out.join("")}</span>`;
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

/**
 * Add an event to a combatant's Turn Log and post its ticker (the snapshot of the log so far). Writing needs an owner of the combatant;
 * the message is posted by whoever made the event.
 */
export async function logEvent(c, line) {
  if (!c) return null;
  // v0.0.277 (Lucas: "The Combat ... does not exist" when an encounter ended mid-movement): a combat already deleted gets no line
  if (c.parent?.id && globalThis.game?.combats?.has && !game.combats.has(c.parent.id)) return null;
  const lines = nextLog(c.getFlag?.(F, "turnLog") ?? [], line);
  try { if (c.isOwner) await c.setFlag(F, "turnLog", lines); } catch (e) { console.warn("twod12 | turn log", e); }
  const speaker = c.actor && ChatMessage.getSpeaker ? ChatMessage.getSpeaker({ actor: c.actor, token: c.token }) : {};
  return ChatMessage.create({ speaker, content: tickerHtml(c.name, lines), flags: { [F]: { ticker: { combatantId: c.id, lines } } } });
}
