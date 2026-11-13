// v0.0.244 (Lucas): a small window in the class window's format (classwindow.mjs, mockup granted-C2-ladder.html's look): a navy header with the
// name and the stats, sections with a pill, a sub line and segmented selections (as the class window's Attribute increases), a footer with the
// message and Cancel / Confirm. Nothing is applied before Confirm. The Species window and the Initiative window are built on it.
// A model (pure, from the window's owner) describes what is shown:
//   { name, sub, img | icon, stats: [[label, value]], sections: [{ title, pill, done, sub, rows: [{ label, key, opts: [{ k, l, on, off, tip, cls }] }], html }],
//     complete, message, confirm }
// The owner handles pick(rowKey, optKey) and input(field, value), and gives result().
import { esc } from "./util.mjs";
import { highlightText } from "./config.mjs";
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
  // v0.0.369 (STYLE-1, Lucas): a section with no title and no pill draws no heading (the empty one left a bar and a line); the text is highlighted
  const head = x => (x.title || x.pill !== undefined ? `<h2>${esc(x.title)} ${x.pill !== undefined ? `<span class="cw-pill${x.done ? " done" : ""}">${esc(x.pill)}</span>` : ""}</h2>` : "");
  const secs = (m.sections ?? []).map(x => `<section class="cw-sec">${head(x)}${x.sub ? `<p class="cw-sub">${highlightText(esc(x.sub))}</p>` : ""}${(x.rows ?? []).map(segRowHtml).join("")}${x.html ?? ""}</section>`).join("");
  const stats = (m.stats ?? []).map(([k, v]) => `<span>${esc(k)}<b>${esc(v)}</b></span>`).join("");
  const pic = m.img ? `<img src="${esc(m.img)}" alt="">` : (m.icon ? `<span class="cw-icon"><i class="fa-solid ${esc(m.icon)}"></i></span>` : "");
  return `<header class="cw-head"><div class="cw-top"><div class="cw-ttl">${pic}<h1>${esc(m.name)}${m.sub ? ` <small>${esc(m.sub)}</small>` : ""}</h1></div></div>${stats ? `<div class="cw-stats">${stats}</div>` : ""}</header>
    <div class="cw-body"><div class="cw-col cw-slots">${secs}</div></div>
    <footer class="cw-foot"><span class="cw-msg">${esc(m.message ?? "")}</span><span class="cw-btns"><button type="button" class="cw-btn" data-key="cancel" data-cancel>Cancel</button>${m.confirm === false ? "" : `<button type="button" class="cw-btn primary" data-key="confirm" data-confirm${m.complete === false ? " disabled" : ""}>${esc(m.confirm ?? "Confirm")}</button>`}</span></footer>`;
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
    if (b.dataset.row) {
      this.o.pick?.(b.dataset.row, b.dataset.k);
      // v0.0.369 (Lucas, 2026-11-13): a single choice is click and done
      if (this.o.instant) { this.done = true; this.o.resolve(this.o.result()); return this.close(); }
    }
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

/**
 * PACK SHEET (v0.0.289): a confirmation in the pick window's style (the standing rule: no Foundry default windows). Resolves true on Confirm,
 * false on Cancel or close. o: { title, name, sub, icon, img, text (HTML, escaped by the caller), confirm, stats }
 */
export const pickConfirm = o => pickWith({
  title: o.title ?? o.name,
  model: () => ({ name: o.name, sub: o.sub ?? "", icon: o.icon, img: o.img, stats: o.stats ?? [], sections: [{ title: o.heading ?? "", html: `<div class="cw-sub pw-text">${highlightText(o.text ?? "")}</div>` }], message: o.message ?? "", confirm: o.confirm ?? "Confirm" }),
  result: () => true
}).then(r => !!r);

/**
 * A choice in the pick window's style: one option per button. o: { title, name, sub, icon, text, options: [{ k, l, tip }] }.
 * v0.0.369 (Lucas, 2026-11-13): a click picks and closes; no Confirm, only Cancel (no caller passed a preset). Resolves the chosen key, or null.
 */
export function pickOne(o) {
  let chosen = null;
  return pickWith({
    title: o.title ?? o.name, instant: true,
    model: () => ({ name: o.name, sub: o.sub ?? "", icon: o.icon, sections: [{ title: o.heading ?? "", sub: o.text ?? "", rows: [{ key: "one", label: "", opts: o.options.map(x => ({ k: x.k, l: x.l, tip: x.tip, on: false, off: !!x.off })) }] }], message: "", confirm: false }),
    pick: (row, k) => { chosen = k; },
    result: () => chosen
  });
}

/** Several rows with Keep / Remove each (the Build tab's Review). rows: [{ key, label }]. Resolves the keys set to Remove ([]: none), or null. */
export function pickKeepRemove(o) {
  const st = Object.fromEntries(o.rows.map(r => [r.key, "keep"]));
  return pickWith({
    title: o.title ?? o.name,
    model: () => ({ name: o.name, sub: o.sub ?? "", icon: o.icon, sections: [{ title: o.heading ?? "", sub: o.text ?? "", rows: o.rows.map(r => ({ key: r.key, label: r.label, opts: [{ k: "keep", l: "Keep", on: st[r.key] === "keep" }, { k: "remove", l: "Remove", on: st[r.key] === "remove", cls: "neg" }] })) }],
      message: `${Object.values(st).filter(v => v === "remove").length} to remove`, confirm: o.confirm ?? "Apply" }),
    pick: (row, k) => { st[row] = k; },
    result: () => Object.entries(st).filter(([, v]) => v === "remove").map(([k]) => k)
  });
}
