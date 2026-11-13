// STYLE-1 (v0.0.369; Lucas, 2026-11-12: "dark or light is a setting of the system"): the theme. styles/theme.css (built by
// tools/build-theme.mjs) is scoped by classes on <html>: .twod12-type always (the settled type and shapes, both themes), and
// .twod12-dark (the default) or .twod12-light (the chat card's parchment). A client setting: each player picks their own.
export const THEMES = { dark: "Dark", light: "Light" };

/** Pure: the classes <html> carries for a theme (an unknown value is the default, dark). */
export const themeClasses = theme => ["twod12-type", theme === "light" ? "twod12-light" : "twod12-dark"];

/** Put the theme's classes on <html> (and take the other theme's off). */
export function applyTheme(theme, root = globalThis.document?.documentElement) {
  if (!root) return;
  root.classList.remove("twod12-dark", "twod12-light");
  root.classList.add(...themeClasses(theme));
}

export function registerTheme() {
  game.settings.register("twod12", "theme", {
    name: "Theme", hint: "The look of the system's sheets, cards, chat messages and windows: Dark (the default) or Light (the parchment cards). Only for you.",
    scope: "client", config: true, type: String, choices: THEMES, default: "dark", onChange: v => applyTheme(v)
  });
  applyTheme(game.settings.get("twod12", "theme"));
}
