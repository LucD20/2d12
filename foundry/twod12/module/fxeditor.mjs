// A "2d12" tab in an effect's own window (the one that opens from the token or the sheet): the effect's settings as JSON
// (duration, boons and banes, bonuses, grants, notes), and, for Exhausted and the conditions with a value, its value. Like the rules of an effect in PF2e.
import { isExhaustedFx, setExhausted } from "./sleep.mjs";
import { isValued, setValued, baseNameOf } from "./effects.mjs";
import { esc } from "./util.mjs";

const F = "twod12";

/** The tab's HTML (also used by the tests). */
export function fxTabHtml(fx) {
  const exh = isExhaustedFx(fx) && fx.parent?.type === "character";
  const flags = fx.flags?.[F] ?? {};
  const valued = !exh && isValued(fx);
  return `<div class="twod12-fxtab">
    ${valued ? `<div class="form-group"><label>${esc(baseNameOf(fx))} value</label><input type="number" min="1" name="twod12Value" value="${Math.max(1, Number(fx.getFlag(F, "value")) || 1)}"></div>` : ""}
    ${exh ? `<div class="form-group"><label>Exhausted value</label><input type="number" min="0" name="twod12Value" value="${Number(fx.parent.system.exhausted ?? 0)}"></div>` : ""}
    <div class="form-group stacked"><label>2d12 settings <span class="hint">JSON: duration, modifiers (Boons and Banes), bonuses, grants, notes…</span></label>
      <textarea name="twod12Json" rows="14" spellcheck="false" style="width:100%;font-family:monospace;font-size:12px">${esc(JSON.stringify(flags, null, 2))}</textarea></div>
    <button type="button" class="twod12-fxsave"><i class="fa-solid fa-floppy-disk"></i> Save 2d12 settings</button>
  </div>`;
}

/** Save: the value for Exhausted, and the JSON (keys that were removed are removed). */
export async function saveFx(fx, jsonText, value = null) {
  let parsed;
  try { parsed = JSON.parse(jsonText || "{}"); } catch (e) { throw new Error(`The JSON isn't valid: ${e.message}`); }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("The settings must be a JSON object, like { ... }");
  const update = {};
  for (const k of Object.keys(fx.flags?.[F] ?? {})) if (!(k in parsed)) update[`flags.${F}.-=${k}`] = null;
  for (const [k, v] of Object.entries(parsed)) update[`flags.${F}.${k}`] = v;
  await fx.update(update);
  if (value !== null && value !== "" && isValued(fx) && Math.trunc(Number(value)) >= 1 && Math.trunc(Number(value)) !== Number(fx.getFlag(F, "value"))) await setValued(fx, Math.trunc(Number(value)));   // a condition with a value
  if (value !== null && value !== "" && isExhaustedFx(fx) && fx.parent?.type === "character" && Number(value) !== Number(fx.parent.system.exhausted ?? 0)) await setExhausted(fx.parent, Number(value));
}

function inject(app, root) {
  const fx = app?.document ?? app?.object;
  if (!root?.querySelector || !fx || root.querySelector(".twod12-fxtab")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = fxTabHtml(fx);
  const nav = root.querySelector("nav.tabs, nav.sheet-tabs, .tabs");
  const lastTab = [...root.querySelectorAll(".tab[data-tab]")].at(-1);
  let tab;
  if (nav && lastTab) {
    const group = lastTab.dataset.group ?? nav.querySelector("[data-group]")?.dataset.group ?? "sheet";
    const link = document.createElement("a");
    link.dataset.action = "tab"; link.dataset.group = group; link.dataset.tab = "twod12";
    link.innerHTML = '<i class="fa-solid fa-dice-d20"></i> 2d12';
    nav.append(link);
    tab = document.createElement("div");
    tab.className = "tab"; tab.dataset.tab = "twod12"; tab.dataset.group = group;
  } else {
    tab = document.createElement("fieldset");   // no tabs found: a section at the end of the form
    tab.innerHTML = "<legend>2d12</legend>";
  }
  tab.append(...wrap.childNodes);
  (lastTab?.parentElement ?? root.querySelector("form") ?? root).append(tab);
  tab.querySelector(".twod12-fxsave")?.addEventListener("click", async () => {
    try {
      await saveFx(fx, tab.querySelector('[name="twod12Json"]').value, tab.querySelector('[name="twod12Value"]')?.value ?? null);
      ui.notifications.info(`${fx.name}: 2d12 settings saved.`);
    } catch (e) { ui.notifications.error(e.message ?? String(e)); }
  });
}

export function registerEffectEditor() {
  Hooks.on("renderActiveEffectConfig", (app, html) => {
    try { inject(app, app?.element ?? (typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : html?.[0])); } catch (e) { console.warn("twod12 | effect editor", e); }
  });
}
