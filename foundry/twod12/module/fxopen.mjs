// Where a click on an applied effect goes. fxapplied.mjs registers the 2d12 editor at init; until then (and in the tests),
// and for an effect it can't edit, Foundry's own effect window opens.
let opener = null;
export function setEffectOpener(fn) { opener = fn; }
export function openEffectSheet(fx) {
  if (!fx) return;
  try { if (opener?.(fx)) return; } catch (e) { console.warn("twod12 | applied effect editor", e); }
  fx.sheet?.render(true);
}
