// v0.0.343 (Lucas, playtest 4: "the chat doesn't stay scrolled to the bottom when a card updates"): a chat log that was at its bottom stays there
// when a message grows (a card redrawn after its roll, its damage applied, an image loaded). Scrolled up to read: left where it is.
const SLACK = 48;   // px: "at the bottom" (a card's last line half hidden still counts)

/** Pure: is a scroll box at its bottom? */
export const atBottom = el => !!el && el.scrollHeight - el.scrollTop - el.clientHeight <= SLACK;

const watched = new WeakSet();
/** Keeps one chat log pinned to its bottom while it was there. */
export function pinChatLog(log) {
  if (!log || watched.has(log) || typeof ResizeObserver === "undefined") return;
  watched.add(log);
  let pinned = atBottom(log);
  log.addEventListener("scroll", () => { pinned = atBottom(log); }, { passive: true });
  const stick = () => { if (pinned && !atBottom(log)) log.scrollTop = log.scrollHeight; };
  const ro = new ResizeObserver(stick);
  const watchKids = () => { for (const li of log.children) ro.observe(li); };
  watchKids();
  new MutationObserver(() => { watchKids(); stick(); }).observe(log, { childList: true });
}

export function registerChatScroll() {
  const find = root => (root instanceof HTMLElement ? root : root?.[0] ?? document)?.querySelectorAll?.(".chat-log") ?? [];
  const pinAll = root => { for (const log of find(root)) pinChatLog(log); };
  Hooks.on("renderChatLog", (app, html) => { try { pinAll(html); } catch (e) { console.warn("twod12 | chat scroll", e); } });
  Hooks.once("ready", () => { try { pinAll(document); } catch (e) { console.warn("twod12 | chat scroll", e); } });
}
