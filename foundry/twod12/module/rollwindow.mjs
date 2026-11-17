// v0.0.292 (PACK ROLL-DIALOG; brief foundry/mockups/roll-dialog-brief.md): the roll dialog's window. The system's own window (an ApplicationV2 like
// pickwindow.mjs), never a DialogV2. It keeps the state, redraws from rolldlg.mjs on every click, and answers:
//   the roll's data (result()), null (closed), or { restart: true, state, place } when the targets changed on the map or the area is placed again
//   (actions.mjs then runs the Action again with the same choices).
import * as RD from "./rolldlg.mjs";
const { ApplicationV2 } = foundry.applications?.api ?? {};

export class RollWindow extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "rolldlg"], window: { resizable: true }, position: { width: 580, height: "auto" } };

  /** o: { inp, state, resolve, card(), live (listen to the map's targeting) } */
  constructor(o) {
    super({ window: { title: `${o.inp.save || (o.inp.versions ?? []).every(v => v.noTiers) ? "Use" : "Roll"} \u00b7 ${o.inp.name}` } });   // v0.0.293: "Use · Opportunity Attack"
    this.o = o; this.inp = o.inp; this.st = RD.newState(o.inp, o.state); this.done = false;
  }

  async _renderHTML() {
    const div = document.createElement("div");
    div.className = "rd";
    div.innerHTML = RD.dialogHtml(this.inp, this.st);
    return div;
  }

  _replaceHTML(result, content) {
    const key = document.activeElement && content.contains(document.activeElement) ? keyOf(document.activeElement) : "", scroll = content.querySelector(".rd-body")?.scrollTop ?? 0;
    content.replaceChildren(result);
    const body = content.querySelector(".rd-body"); if (body) body.scrollTop = scroll;
    if (key) content.querySelector(key)?.focus({ preventScroll: true });
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const el = this.element;
    el.addEventListener("click", ev => this._click(ev));
    el.addEventListener("contextmenu", ev => {
      // v0.0.293 (Lucas): a right-click on a chip added by hand is one step less (Situational ×2 → Situational); its × removes it
      // v0.0.294 (Lucas): a right-click on the quick button (or an "Add here:" button) that adds a chip takes one step off it too
      // v0.0.392: "Target": Foundry's target tool on the token layer (the window is live: the creatures targeted on the map fill it)
      const tb = ev.target.closest('button[data-act="targetmode"]');
      // v0.0.398 (Lucas): Target reads the creatures targeted on the map now (none: no target); the dialog runs again with the same choices
      if (tb) { ev.preventDefault(); return this._finish({ restart: true, state: this.st }); }
      const qb = ev.target.closest('button[data-act="quick"]');
      if (qb) { ev.preventDefault(); ev.stopPropagation(); RD.stepManual(this.st, qb.dataset.scope, qb.dataset.k); this.render(); return; }
      const man = ev.target.closest("[data-manual]");
      if (man) { ev.preventDefault(); ev.stopPropagation(); const [, scope, kind] = /^man:(.*):([a-z]+)$/.exec(man.dataset.manual) ?? []; if (kind) { RD.stepManual(this.st, scope, kind); this.render(); } return; }
      const line = ev.target.closest(".rd-cbox.multi");   // v0.0.217 kept: a right-click on a creature removes it from the roll
      if (!line) return;
      ev.preventDefault(); this._untarget(line.dataset.uuid);
    });
    el.addEventListener("change", ev => { const f = ev.target.closest("[data-field]"); if (f) { this.st[f.dataset.field] = f.value; if (f.dataset.field === "noTargetDc") this.render(); } });   // v0.0.340: the odds follow the typed DC
    el.addEventListener("keydown", ev => {
      if (ev.key === "Enter" && !ev.target.closest("select, textarea") && !(ev.target.closest("button") && ev.target.closest("button").dataset.act !== "roll")) { ev.preventDefault(); this._roll(); }
      else if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); this.close(); }
    });
    // The dialog follows Foundry's targeting (no retarget button in the dialog; an area's creatures come from the area)
    if (this.o.live) this._hook = Hooks.on("targetToken", (user, token) => {
      if (user?.id !== game.user?.id || this.done) return;
      clearTimeout(this._t);
      this._t = setTimeout(() => { if (!this.done && game.user.targets.size) this._finish({ restart: true, state: this.st }); else if (!this.done) { this.inp = { ...this.inp, creatures: [] }; this.render(); } }, 250);
    });
    setTimeout(() => this.element?.querySelector(".rd-go:not([disabled])")?.focus({ preventScroll: true }), 0);
  }

  _chip(id) { return [...(this.inp.chips ?? []), ...Object.keys(this.st.manual ?? {}).flatMap(s => RD.manualChips(this.st, s))].find(c => c.id === id); }

  _untarget(uuid) {
    const left = RD.liveCreatures(this.inp, this.st).length;
    // v0.0.399 (Lucas: "it doesn't allow me to remove all targets"): the last one goes too: untargeted on the map, the dialog shows "No target"
    if (left <= 1) {
      if (this.inp.area) return ui.notifications?.warn("The area's creatures come from the area: place it again to change them.");
      try { for (const t of [...(game.user?.targets ?? [])]) t.setTarget(false, { releaseOthers: false, groupSelection: true }); } catch (e) { console.warn("twod12 | untarget", e); }
      return this._finish({ restart: true, state: this.st });
    }
    this.st.removed.push(uuid); this.render();
  }

  _click(ev) {
    // v0.0.335 (Lucas: "clicking on the tier should be anywhere in the tier"): a Tier row of the table forces that result (GM), as its name's button does
    const row = ev.target.closest("tr[data-force]");
    if (row && !ev.target.closest("button, a, [data-tooltip] button")) { ev.preventDefault(); const t = Number(row.dataset.force); this.st.forceTier = Number(this.st.forceTier) === t ? 0 : t; return this.render(); }
    const b = ev.target.closest("button[data-act]");
    if (!b || b.disabled) return;
    ev.preventDefault();
    const a = b.dataset.act, st = this.st;
    if (a === "ver") st.ap = Number(b.dataset.ap);
    else if (a === "quick") RD.addManual(st, b.dataset.scope, b.dataset.k);
    else if (a === "chip") RD.toggleChip(st, this._chip(b.dataset.id));
    else if (a === "rm") { const [, scope, kind] = /^man:(.*):([a-z]+)$/.exec(b.dataset.id) ?? []; if (kind) RD.removeManual(st, scope, kind); }
    else if (a === "fold") st.fold[b.dataset.key] = !st.fold[b.dataset.key];
    else if (a === "open") st.open[b.dataset.uuid] = !st.open[b.dataset.uuid];
    else if (a === "untarget") return this._untarget(b.dataset.uuid);
    else if (a === "force") st.forceTier = Number(st.forceTier) === Number(b.dataset.t) ? 0 : Number(b.dataset.t);
    else if (a === "rule") { fromUuid(b.dataset.uuid).then(d => d?.sheet?.render(true)).catch(() => null); return; }
    else if (a === "card") { this.o.card?.(); return; }
    else if (a === "place") return this._finish({ restart: true, place: true, state: this.st });
    else if (a === "roll") return this._roll();
    else return;
    this.render();
  }

  _roll() {
    // v0.0.397 (Lucas): an Area Action's Roll places the area first (the dialog's choices kept), then rolls
    if (!this.done && this.inp.area && !this.inp.area.placed && !this.inp.area.noPlace) return this._finish({ restart: true, place: true, rollAfter: true, state: this.st });
    if (this.done || RD.blockedReason(this.inp, this.st)) return;
    this._finish(RD.result(this.inp, this.st));
  }

  _finish(value) { if (this.done) return; this.done = true; this.o.resolve(value); this.close(); }

  async close(options) {
    if (this._hook) { Hooks.off("targetToken", this._hook); this._hook = null; }
    if (!this.done) { this.done = true; this.o.resolve(null); }
    return super.close(options);
  }
}

/** A selector for the focused control, to give the focus back after a redraw. */
const keyOf = el => {
  const b = el.closest("[data-act], [data-field]");
  if (!b) return "";
  const at = ["data-act", "data-id", "data-ap", "data-k", "data-scope", "data-key", "data-uuid", "data-t", "data-field"].filter(k => b.hasAttribute(k)).map(k => `[${k}="${CSS.escape(b.getAttribute(k))}"]`).join("");
  return at;
};

/** Open the roll dialog and wait for its answer. The tests answer it without a window: globalThis.__twod12RollDialog(inp, RD, o). */
export const askAction = o => {
  if (typeof globalThis.__twod12RollDialog === "function") return Promise.resolve(globalThis.__twod12RollDialog(o.inp, RD, o));
  // v0.0.376 (PACK STYLE-2, the HUD's "Skip roll dialog"): roll at once with the dialog's defaults, unless something stops the roll (then the dialog shows why)
  if (o.skip) { try { const st = RD.newState(o.inp, o.state); if (!RD.blockedReason(o.inp, st)) return Promise.resolve(RD.result(o.inp, st)); } catch (e) { console.warn("twod12 | Skip roll dialog", e); } }
  return new Promise(resolve => new RollWindow({ ...o, resolve }).render({ force: true }));
};
