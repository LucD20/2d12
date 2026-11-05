// v0.0.244 (Lucas): a small window in the class window's format (classwindow.mjs, mockup granted-C2-ladder.html's look): a navy header with the
// name and the stats, sections with a pill, a sub line and segmented selections (as the class window's Attribute increases), a footer with the
// message and Cancel / Confirm. Nothing is applied before Confirm. The Species window and the Initiative window are built on it.
// A model (pure, from the window's owner) describes what is shown:
//   { name, sub, img | icon, stats: [[label, value]], sections: [{ title, pill, done, sub, rows: [{ label, key, opts: [{ k, l, on, off, tip, cls }] }], html }],
//     complete, message, confirm }
// The owner handles pick(rowKey, optKey) and input(field, value), and gives result().
import { esc } from "./util.mjs";
const { ApplicationV2 } = foundry.applications?.api ?? {};
const CHECK = '<i class="fa-solid fa-check"></i>';

/** Pure: the HTML of a segmented row. */
export function segRowHtml(row) {
  // v0.0.245 (Lucas): the names are colored (the Attributes' colors, a creature's side): the label sits in a span with the option's class, as the class window does.
  const btn = o => `<button type="button" data-key="pick:${esc(row.key)}:${esc(o.k)}" data-row="${esc(row.key)}" data-k="${esc(o.k)}" aria-pressed="${!!o.on}"${o.off ? " disabled" : ""}${o.tip ? ` data-tooltip="${esc(o.tip)}"` : ""}>${o.on ? `${CHECK} ` : ""}<span class="${esc(o.cls ?? "")}">${esc(o.l)}</span></button>`;
  return `<div class="cw-attr">${row.label ? `<span class="${esc(row.labelCls ?? "")}">${esc(row.label)}</span>` : ""}<div class="cw-seg">${row.opts.map(btn).join("")}</div></div>`;
}

/** Pure: the whole window's HTML from a model. */
export function pickWindowHtml(m) {
  const secs = (m.sections ?? []).map(x => `<section class="cw-sec"><h2>${esc(x.title)} ${x.pill !== undefined ? `<span class="cw-pill${x.done ? " done" : ""}">${esc(x.pill)}</span>` : ""}</h2>${x.sub ? `<p class="cw-sub">${esc(x.sub)}</p>` : ""}${(x.rows ?? []).map(segRowHtml).join("")}${x.html ?? ""}</section>`).join("");
  const stats = (m.stats ?? []).map(([k, v]) => `<span>${esc(k)}<b>${esc(v)}</b></span>`).join("");
  const pic = m.img ? `<img src="${esc(m.img)}" alt="">` : (m.icon ? `<span class="cw-icon"><i class="fa-solid ${esc(m.icon)}"></i></span>` : "");
  return `<header class="cw-head"><div class="cw-top"><div class="cw-ttl">${pic}<h1>${esc(m.name)}${m.sub ? ` <small>${esc(m.sub)}</small>` : ""}</h1></div></div>${stats ? `<div class="cw-stats">${stats}</div>` : ""}</header>
    <div class="cw-body"><div class="cw-col cw-slots">${secs}</div></div>
    <footer class="cw-foot"><span class="cw-msg">${esc(m.message ?? "")}</span><span class="cw-btns"><button type="button" class="cw-btn" data-key="cancel" data-cancel>Cancel</button><button type="button" class="cw-btn primary" data-key="confirm" data-confirm${m.complete === false ? " disabled" : ""}>${esc(m.confirm ?? "Confirm")}</button></span></footer>`;
}

export class PickWindow extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "classwin", "pickwin"], window: { resizable: true }, position: { width: 640, height: "auto" } };

  /** o: { title, model(), pick(row, k), input(field, value), result(), resolve } */
  constructor(o) {
    super({ window: { title: o.title } });
    this.o = o; this.done = false;
  }

  async _renderHTML() {
    const div = document.createElement("div");
    div.className = "cw";
    div.innerHTML = pickWindowHtml(this.o.model());
    return div;
  }

  _replaceHTML(result, content) {
    const key = content.querySelector(":focus")?.dataset?.key, scroll = content.querySelector(".cw-body")?.scrollTop ?? 0;
    content.replaceChildren(result);
    const body = content.querySelector(".cw-body"); if (body) body.scrollTop = scroll;
    if (key) content.querySelector(`[data-key="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this.element.addEventListener("click", ev => this._click(ev));
    this.element.addEventListener("change", ev => { const f = ev.target.closest("[data-field]"); if (f) { this.o.input?.(f.dataset.field, f.type === "checkbox" ? f.checked : f.value); } });
  }

  _click(ev) {
    const b = ev.target.closest("button");
    if (!b || b.disabled) return;
    if (b.dataset.row) this.o.pick?.(b.dataset.row, b.dataset.k);
    else if (b.hasAttribute("data-cancel")) return this.close();
    else if (b.hasAttribute("data-confirm")) {
      if (this.o.model().complete === false) return;
      this.done = true;
      this.o.resolve(this.o.result());
      return this.close();
    } else return;
    this.render();
  }

  async close(options) {
    if (!this.done) { this.done = true; this.o.resolve(null); }
    return super.close(options);
  }
}

/** Open a pick window and wait for its result (null: Cancel or closed). */
export const pickWith = o => new Promise(resolve => new PickWindow({ ...o, resolve }).render({ force: true }));
