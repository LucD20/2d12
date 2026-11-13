// v0.0.185 (pack C2): the Levels window of a Class (the designer's side), opened by "Edit levels..." on the Class's Details tab.
// Left: the sections of the chosen level; right: the class's items (Repertoire and Escalation), to drag into a section.
import { TWOD12, FREQ_COLORS, highlightText } from "./config.mjs";
import { esc } from "./util.mjs";
import { SECTION_KINDS, SECTION_FREQS, ATTR_KEYS, newSection, alsoIn, playerSees, freqOf, sectionColor, ESC_COLOR } from "./classlevels.mjs";
import { itemInfo } from "./classwindow.mjs";
import { dragData } from "./sheet-common.mjs";
const { ApplicationV2 } = foundry.applications.api;
const TALENT_CATS = { "": "Any category", Combat: "Combat", Mobility: "Mobility", Magic: "Magic", Skill: "Skill" };
const FREQ_ORDER = ["passive", "turn", "round", "encounter", "daily"];
const editors = new Map();
export function openLevelsEditor(item) {
  let app = editors.get(item.uuid);
  if (!app) { app = new ClassLevelsEditor(item); editors.set(item.uuid, app); }
  app.render({ force: true });
  return app;
}

export class ClassLevelsEditor extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "classwin", "classed"], window: { resizable: true }, position: { width: 1040, height: 760 } };

  constructor(item) {
    super({ window: { title: `Class: ${item.name}` } });
    this.item = item; this.cur = 1; this.infos = new Map();
    this._hook = Hooks.on("updateItem", it => { if (it.uuid === this.item.uuid && this.rendered) this.render(); });
  }

  _levels() { return foundry.utils.deepClone(this.item.toObject().system.levels ?? []); }
  async _save(levels) { await this.item.update({ "system.levels": levels }); }
  _sec(levels, id) { return levels[this.cur - 1]?.sections?.find(s => s.id === id); }

  async _info(u) {
    if (!this.infos.has(u)) { let d = null; try { d = await fromUuid(u); } catch (e) { /* missing */ } this.infos.set(u, itemInfo(d)); }
    return this.infos.get(u);
  }

  async _renderHTML() {
    const s = this.item.system, levels = s.levels ?? [];
    if (this.cur > Math.max(1, levels.length)) this.cur = Math.max(1, levels.length);
    const all = new Set([...(s.repertoire ?? []), ...(s.escPassives ?? []), ...(s.escActives ?? []), ...levels.flatMap(l => l.sections.flatMap(x => x.items ?? []))]);
    for (const u of all) await this._info(u);
    const info = u => this.infos.get(u) ?? null;
    const name = u => esc(info(u)?.name ?? "(missing item)");
    const typeLine = u => { const i = info(u); if (!i) return ""; const t = i.type === "action" ? "Action" : i.type === "talent" ? "Talent" : "Feature"; const f = i.type === "action" && i.frequency ? TWOD12.frequencies[i.frequency] : ""; return [t, f, i.escalation ? `Esc ${i.escalation}` : ""].filter(Boolean).join(" · "); };
    const tyColor = u => { const i = info(u); const c = i?.escalation ? ESC_COLOR : i?.type === "action" && i.frequency && FREQ_COLORS[i.frequency] && !["none", ""].includes(i.frequency) ? FREQ_COLORS[i.frequency] : ""; return c ? ` style="--fq:${c}"` : ""; };
    const sel = (opts, val, attrs) => `<select ${attrs}>${Object.entries(opts).map(([k, l]) => `<option value="${k}"${k === val ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
    const attrOpts = Object.fromEntries(ATTR_KEYS.map(k => [k, TWOD12.attributes[k]]));
    const listOpts = [...all].filter(u => info(u)).sort((a, b) => info(a).name.localeCompare(info(b).name));
    const secs = (levels[this.cur - 1]?.sections ?? []).map(x => {
      let body = "";
      if (x.kind === "items") {
        body = (x.items ?? []).map((u, i) => { const al = alsoIn(s, this.cur, x, u); return `<div class="ce-row"><a class="nm" data-open="${u}">${name(u)}</a>${al.length ? `<span class="ce-also">also in: ${esc(al.join(", "))}</span>` : ""}<span class="ty"${tyColor(u)}>${esc(typeLine(u))}</span><button type="button" class="ce-x" data-rmitem="${x.id}" data-i="${i}" aria-label="Remove">&times;</button></div>`; }).join("")
          + `<div class="ce-drop" data-drop="${x.id}">Drop an Action, Feature or Talent here ${sel({ "": "or add from a list…", ...Object.fromEntries(listOpts.filter(u => !(x.items ?? []).includes(u)).map(u => [u, info(u).name])) }, "", `data-addsel="${x.id}" aria-label="Or add from a list"`)}</div>`;
      } else if (x.kind === "attr") {
        body = (x.pairs ?? []).map((p, pi) => `<div class="ce-pair"><span>Pair ${pi + 1}:</span>${sel(attrOpts, p.a, `data-pair="${x.id}" data-pi="${pi}" data-side="a"`)}<span>or</span>${sel(attrOpts, p.b, `data-pair="${x.id}" data-pi="${pi}" data-side="b"`)}<span>+1</span><button type="button" class="ce-x" data-rmpair="${x.id}" data-pi="${pi}" aria-label="Remove pair">&times;</button></div>`).join("")
          + `<button type="button" class="ce-btn small" data-addpair="${x.id}">+ Add pair</button>`;
      } else if (x.kind === "repertoire") {
        body = `<div class="ce-pair"><span>Frequency:</span>${sel(SECTION_FREQS, x.freq || "any", `data-freq="${x.id}"`)}<span class="ce-hint">The player picks from the class Repertoire (Details tab).</span></div>`;
      } else if (x.kind === "talent") {
        body = `<div class="ce-pair"><span>Category:</span>${sel(TALENT_CATS, x.category ?? "", `data-tcat="${x.id}"`)}<span class="ce-hint">The player picks from every Talent of their level (world and compendiums).</span></div>`;
      }
      const seen = playerSees(s, this.cur, x, info);
      const pick = x.kind !== "attr" && !(x.kind === "items" && x.mode === "granted") ? `<label class="ce-num">Pick <input type="number" min="1" max="9" value="${x.pick}" data-pick="${x.id}"></label>` : "";
      const mode = x.kind === "items" ? `<span class="cw-seg">${["granted", "choice"].map(k => `<button type="button" data-mode="${x.id}" data-v="${k}" aria-pressed="${x.mode === k}">${k === "granted" ? "Granted" : "Choice"}</button>`).join("")}</span>` : "";
      return `<section class="ce-sec" data-secid="${x.id}" style="--sc:${sectionColor(x, u => !!info(u)?.escalation)}"><div class="ce-sh"><span class="ce-grip" draggable="true" data-grip="${x.id}" data-tooltip="Drag to reorder">⋮⋮</span><input type="text" class="ce-title" value="${esc(x.title)}" data-title="${x.id}" aria-label="Section title">${sel(SECTION_KINDS, x.kind, `data-kind="${x.id}" aria-label="Section type"`)}${mode}${pick}<button type="button" class="ce-x" data-rmsec="${x.id}" aria-label="Remove section">&times;</button></div>
        <div class="ce-sb">${body}</div><div class="ce-prev${seen.warn ? " warn" : ""}">${seen.warn ? "" : "<b>Player sees:</b> "}${seen.warn ? esc(seen.text) : highlightText(esc(seen.text))}</div></section>`;
    }).join("");
    const lv = `<span class="lbl">Level</span>${levels.map((l, i) => `<button type="button" class="ce-lvb" data-lvl="${i + 1}" aria-pressed="${i + 1 === this.cur}">${i + 1}</button>`).join("")}<button type="button" class="ce-lvb" data-newlvl aria-label="Add level" data-tooltip="Add a level">+</button>${levels.length ? `<button type="button" class="ce-lvb" data-dellvl aria-label="Remove the last level" data-tooltip="Remove the last level (${levels.length})">&minus;</button>` : ""}`;
    const libItem = u => `<div class="ce-li" draggable="true" data-drag="${u}"><span>${name(u)}</span>${info(u)?.escalation ? `<i>Esc ${info(u).escalation}</i>` : ""}</div>`;
    const rep = s.repertoire ?? [];
    // v0.0.369 (Lucas, 2026-11-13): the paragraph under "Class items" is gone (a tip)
    const lib = `<h2>Class items</h2>`
      + FREQ_ORDER.map(f => { const ks = rep.filter(u => freqOf(info(u)) === f); return ks.length ? `<h4${FREQ_COLORS[f] ? ` style="--fq:${FREQ_COLORS[f]}"` : ""}>Repertoire · ${SECTION_FREQS[f]}</h4>${ks.map(libItem).join("")}` : ""; }).join("")
      + (() => { const ks = rep.filter(u => !FREQ_ORDER.includes(freqOf(info(u)))); return ks.length ? `<h4>Repertoire · Other</h4>${ks.map(libItem).join("")}` : ""; })()
      + `<h4 style="--fq:${ESC_COLOR}">Escalation Passives</h4>${(s.escPassives ?? []).map(libItem).join("") || '<p class="ce-hint">None yet.</p>'}<h4 style="--fq:${ESC_COLOR}">Escalation Actives</h4>${(s.escActives ?? []).map(libItem).join("") || '<p class="ce-hint">None yet.</p>'}`;
    const div = document.createElement("div");
    div.className = "cw ce";
    div.innerHTML = `<header class="cw-head"><div class="cw-ttl"><img src="${esc(this.item.img)}" alt=""><h1>${esc(this.item.name)} <small>Levels</small></h1></div></header>
      <div class="ce-lv">${lv}</div>
      <div class="cw-body"><div class="cw-col ce-left">${levels.length ? `${secs}<div class="ce-add"><button type="button" class="ce-btn" data-addsec>+ Add section</button></div>` : '<p class="cw-empty">No levels yet: add level 1 with +.</p>'}</div><div class="cw-col ce-lib">${lib}</div></div>
      <footer class="cw-foot"><span class="cw-msg">What you set here is what the player sees in the class window when they drop the class or level up.</span></footer>`;
    return div;
  }

  _replaceHTML(result, content) {
    const f = content.querySelector(":focus"), key = f ? [...f.attributes].find(a => a.name.startsWith("data-") && a.name !== "data-tooltip") : null;
    const sel = key ? `[${key.name}="${CSS.escape(key.value)}"]` : "";
    const scrolls = [...content.querySelectorAll(".cw-col")].map(c => c.scrollTop);
    content.replaceChildren(result);
    content.querySelectorAll(".cw-col").forEach((c, i) => { c.scrollTop = scrolls[i] ?? 0; });
    if (sel) content.querySelector(sel)?.focus();
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const el = this.element;
    el.addEventListener("click", ev => this._click(ev));
    el.addEventListener("change", ev => this._change(ev));
    el.addEventListener("dragstart", ev => {
      const d = ev.target.closest?.("[data-drag]"), g = ev.target.closest?.("[data-grip]");
      if (d) ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", uuid: d.dataset.drag }));
      else if (g) ev.dataTransfer.setData("text/plain", JSON.stringify({ twod12Section: g.dataset.grip }));
    });
    el.addEventListener("dragover", ev => { const z = ev.target.closest?.("[data-drop], .ce-sec"); if (z) { ev.preventDefault(); z.classList.add("over"); } });
    el.addEventListener("dragleave", ev => ev.target.closest?.("[data-drop], .ce-sec")?.classList.remove("over"));
    el.addEventListener("drop", ev => this._drop(ev));
  }

  async close(options) { Hooks.off("updateItem", this._hook); editors.delete(this.item.uuid); return super.close(options); }

  async _drop(ev) {
    const z = ev.target.closest?.("[data-drop], .ce-sec");
    if (!z) return;
    ev.preventDefault(); ev.stopPropagation();
    z.classList.remove("over");
    const data = dragData(ev), levels = this._levels(), list = levels[this.cur - 1]?.sections;
    if (!list) return;
    if (data?.twod12Section) {   // reorder: the dragged section goes before the one it is dropped on
      const to = z.closest(".ce-sec")?.dataset.secid, from = list.findIndex(x => x.id === data.twod12Section);
      if (!to || from < 0 || to === data.twod12Section) return;
      const [moved] = list.splice(from, 1);
      list.splice(list.findIndex(x => x.id === to), 0, moved);
      return this._save(levels);
    }
    const id = z.dataset.drop ?? z.dataset.secid, sec = list.find(x => x.id === id);
    if (!sec || sec.kind !== "items") return;
    const doc = data?.uuid ? await fromUuid(data.uuid) : null;
    if (!doc || !["action", "feature", "talent"].includes(doc.type)) return ui.notifications.warn("Drop an Action, Feature or Talent here.");
    if (!sec.items.includes(doc.uuid)) sec.items.push(doc.uuid);
    await this._save(levels);
  }

  async _click(ev) {
    const b = ev.target.closest("button, a[data-open]");
    if (!b) return;
    const d = b.dataset, levels = this._levels(), list = levels[this.cur - 1]?.sections ?? [];
    if (d.open) return (await fromUuid(d.open))?.sheet?.render(true);
    if (d.lvl) { this.cur = Number(d.lvl); return this.render(); }
    if ("newlvl" in d) { levels.push({ sections: [] }); this.cur = levels.length; return this._save(levels); }
    if ("dellvl" in d) {
      const last = levels[levels.length - 1];
      if (last?.sections?.length && !(await foundry.applications.api.DialogV2.confirm({ window: { title: "Remove a level" }, content: `<p>Remove level ${levels.length} and its ${last.sections.length} section(s)?</p>`, rejectClose: false }))) return;
      levels.pop(); return this._save(levels);
    }
    if ("addsec" in d) { const n = newSection("items"); levels[this.cur - 1].sections.push(n); return this._save(levels); }
    const sec = this._sec(levels, d.rmsec ?? d.rmitem ?? d.mode ?? d.addpair ?? d.rmpair);
    if (!sec) return;
    if (d.rmsec) levels[this.cur - 1].sections = list.filter(x => x.id !== d.rmsec);
    else if (d.rmitem) sec.items.splice(Number(d.i), 1);
    else if (d.mode) sec.mode = d.v;
    else if (d.addpair) sec.pairs.push({ a: "body", b: "mind" });
    else if (d.rmpair) sec.pairs.splice(Number(d.pi), 1);
    await this._save(levels);
  }

  async _change(ev) {
    const t = ev.target, d = t.dataset, levels = this._levels();
    const sec = this._sec(levels, d.title ?? d.kind ?? d.pick ?? d.addsel ?? d.pair ?? d.freq ?? d.tcat);
    if (!sec) return;
    if (d.title) sec.title = t.value;
    else if (d.kind) { sec.kind = t.value; if (t.value === "attr" && !sec.pairs.length) sec.pairs = [{ a: "body", b: "appeal" }, { a: "mind", b: "instinct" }]; if (t.value === "talent" && /^new section$/i.test(sec.title)) sec.title = "Talent"; }
    else if (d.pick) sec.pick = Math.max(1, Math.min(9, Number(t.value) || 1));
    else if (d.addsel) { if (t.value && !sec.items.includes(t.value)) sec.items.push(t.value); }
    else if (d.pair) sec.pairs[Number(d.pi)][d.side] = t.value;
    else if (d.freq) sec.freq = t.value;
    else if (d.tcat !== undefined) sec.category = t.value;
    await this._save(levels);
  }
}
