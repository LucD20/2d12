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
}
