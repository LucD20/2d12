// v0.0.343 (Lucas, playtest 4: "the chat doesn't stay scrolled to the bottom when a card updates"): a chat log that was at its bottom stays there
// when a message grows (a card redrawn after its roll, its damage applied, an image loaded). Scrolled up to read: left where it is.
const SLACK = 48;   // px: "at the bottom" (a card's last line half hidden still counts)

/** Pure: is a scroll box at its bottom? */
export const atBottom = el => !!el && el.scrollHeight - el.scrollTop - el.clientHeight <= SLACK;

/** Pure (v0.0.418): after a scroll, is the log still pinned? At the bottom: yes; away from it: only if the user scrolled it there. */
export const scrollPinned = (was, bottom, byUser) => (bottom ? true : byUser ? false : was);

const watched = new WeakSet(), logs = new Set();
/** v0.0.421 (the audit): a scroll the system makes on purpose (the damage stamp scrolls to its roll card) unpins the logs, as the user's own does. */
export function releaseChatLogs() { for (const log of logs) log.dispatchEvent(new CustomEvent("twod12-release")); }
/** v0.0.453 (Lucas, playtest 6: "after clicking damage, then apply, it scrolls a bit and the chat didn't scroll"): the box that scrolls is the log
 *  itself, or (Foundry V13 on) the .chat-scroll around it: the first of the log and its parents whose overflow scrolls. */
export function scrollBoxOf(log) {
  for (let el = log; el && el !== document.body; el = el.parentElement) {
    let oy = ""; try { oy = getComputedStyle(el).overflowY; } catch (e) { oy = ""; }
    if (oy === "auto" || oy === "scroll") return el;
  }
  return log;
}
/** Keeps one chat log pinned to its bottom while it was there. */
export function pinChatLog(log) {
  if (!log || watched.has(log) || typeof ResizeObserver === "undefined") return;
  watched.add(log); logs.add(log);
  const box = scrollBoxOf(log);
  let pinned = atBottom(box), userAt = 0;
  // v0.0.418 (Lucas, playtest 5, C1: after Damage the card grew and the chat didn't follow): a card redrawn is removed and put back, and the scroll
  // the browser makes then (the log clamped) unpinned it. Only the user's own scrolling (the wheel, a touch, a key, the scrollbar) unpins it now;
  // reaching the bottom pins it again.
  const mark = () => { userAt = Date.now(); };
  for (const ev of ["wheel", "touchmove", "keydown"]) box.addEventListener(ev, mark, { passive: true });
  box.addEventListener("pointerdown", ev => { if (ev.target === box) mark(); }, { passive: true });
  log.addEventListener("twod12-release", () => { mark(); pinned = false; });
  box.addEventListener("scroll", () => { pinned = scrollPinned(pinned, atBottom(box), Date.now() - userAt < 600); }, { passive: true });
  // v0.0.453: twice, the second after the browser has laid out what a card's update added (its images, its enriched text)
  const stick = () => { if (pinned && !atBottom(box)) box.scrollTop = box.scrollHeight; };
  const stickSoon = () => { stick(); globalThis.requestAnimationFrame?.(() => stick()); };
  const ro = new ResizeObserver(stickSoon);
  const watchKids = () => { for (const li of log.children) ro.observe(li); };
  watchKids();
  ro.observe(log);
  new MutationObserver(() => { watchKids(); stickSoon(); }).observe(log, { childList: true, subtree: true });
}

export function registerChatScroll() {
  const find = root => (root instanceof HTMLElement ? root : root?.[0] ?? document)?.querySelectorAll?.(".chat-log") ?? [];
  const pinAll = root => { for (const log of find(root)) pinChatLog(log); };
  Hooks.on("renderChatLog", (app, html) => { try { pinAll(html); } catch (e) { console.warn("twod12 | chat scroll", e); } });
  Hooks.once("ready", () => { try { pinAll(document); } catch (e) { console.warn("twod12 | chat scroll", e); } });
}
