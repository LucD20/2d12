// STYLE-1 (v0.0.369): the theme. STYLE-3 (2026-11-17, Lucas: "A", foundry/mockups/style-book.md step 4): the system follows Foundry's own
// color schemes, as dnd5e and Draw Steel do. styles/theme.css (built by tools/build-theme.mjs) puts its dark and light sets inside
// @scope (.theme-dark) / (.theme-light) to (.themed): the chat and the bars on the map follow Foundry's Interface setting, the sheets and
// windows its Applications setting (or a sheet's own theme). The system's own "Theme" setting is gone. <html> keeps .twod12-type (the
// settled type and shapes, both themes).

/** Pure: the classes <html> carries (the theme is Foundry's now; the argument is ignored, kept for old callers). */
export const themeClasses = () => ["twod12-type"];

/** Put the class on <html> and take off the old theme classes (a world that ran an earlier version). */
export function applyTheme(_theme, root = globalThis.document?.documentElement) {
  if (!root) return;
  root.classList.remove("twod12-dark", "twod12-light");
  root.classList.add(...themeClasses());
}

export function registerTheme() {
  applyTheme();
  try { Hooks.on("renderChatMessageHTML", (_msg, html) => themeChatCards(html instanceof HTMLElement ? html : html?.[0])); Hooks.once("ready", watchInterfaceTheme); } catch (e) { console.warn("twod12 | chat theme", e); }
}

/**
 * v0.0.389 (Lucas: "my foundry interface is dark but the system is light and i cant change"): Foundry draws a chat message as a light, themed
 * element of its own, so the dark set (scoped to the nearest theme) never reached the system's chat cards. Each system card in the chat log now
 * carries the Interface's theme itself (read from the class Foundry puts on <body>, or the browser's when there is none). A popped-out message
 * stays as Foundry draws it (light).
 */
export function interfaceTheme(body = globalThis.document?.body, prefersLight = () => !!globalThis.matchMedia?.("(prefers-color-scheme: light)")?.matches) {
  const c = body?.classList;
  if (c?.contains("theme-light")) return "light";
  if (c?.contains("theme-dark")) return "dark";
  return prefersLight() ? "light" : "dark";
}
export function themeChatCards(root, theme = interfaceTheme()) {
  const cards = root?.matches?.(".twod12.chat") ? [root] : [...(root?.querySelectorAll?.(".twod12.chat") ?? [])];
  for (const el of cards) {
    if (!el.closest?.(".chat-message") || el.closest?.('.chat-popout, [id^="chat-popout"]')) continue;
    el.classList.add("themed");
    el.classList.toggle("theme-dark", theme === "dark");
    el.classList.toggle("theme-light", theme === "light");
  }
}
/** The Interface setting changed (Foundry swaps <body>'s class): the cards already drawn follow. */
export function watchInterfaceTheme() {
  const body = globalThis.document?.body;
  if (!body || typeof MutationObserver === "undefined") return;
  let last = interfaceTheme(body);
  new MutationObserver(() => { const t = interfaceTheme(body); if (t !== last) { last = t; themeChatCards(globalThis.document, t); } }).observe(body, { attributes: true, attributeFilter: ["class"] });
}
