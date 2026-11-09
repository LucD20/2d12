// v0.0.185 (pack C2): the class window the player sees. It opens when a Class with levels is dropped on a character (level 1, then each
// level up to the character's) and when the character's Level goes up (each new level in turn). Nothing is applied before confirm;
// Cancel changes nothing (on a level up the Level goes back). A Level that goes down removes what the higher levels gave.
import { prereqLine, canTake } from "./talents.mjs";
import { TWOD12, effectiveFrequency, categoryText } from "./config.mjs";
import { esc } from "./util.mjs";
import { levelModel, togglePick, setAttr, attrList, levelPlan, sectionsAt, stageLine } from "./classlevels.mjs";
import { grantFeature, grantTalent } from "./grants.mjs";
import { buildRawCard, buildInfoCard } from "./preview.mjs";
import { classTrack } from "./modifiers.mjs";
const { ApplicationV2, DialogV2 } = foundry.applications.api;
const F = "twod12";
const AN = TWOD12.attributes;

/** What the window shows of an item: its name, kind and the meta line of its tile ("1 / 2 AP · Round", "Passive", "Esc 1"). */
export function itemInfo(doc) {
  if (!doc) return null;
  const s = doc.system ?? {};
  const frequency = doc.type === "action" ? effectiveFrequency(s) : "";
  const esc1 = Number(s.escalation) || 0;
  let meta;
  if (doc.type === "action") {
    const aps = [...new Set((s.versions ?? []).map(v => v.ap))].sort((a, b) => a - b);
    meta = [aps.length ? `${aps.join(" / ")}${s.reaction ? "R" : " AP"}` : "", TWOD12.frequencies[frequency] && frequency ? TWOD12.frequencies[frequency] : "", esc1 ? `Esc ${esc1}` : ""].filter(Boolean).join(" · ");
  } else if (doc.type === "talent") meta = [categoryText({ group: s.group, category: s.category }) || "Talent", prereqLine(s) ? `Requires ${prereqLine(s)}` : ""].filter(Boolean).join(" · ");   // v0.0.186: "Combat Talent · Requires Brawler"
  else meta = (s.settings ?? []).length || /escalation/i.test(s.category ?? "") ? "Passive" : "Feature";
  return { uuid: doc.uuid, name: doc.name, type: doc.type, img: doc.img, frequency, escalation: esc1, category: s.category ?? "", level: Number(s.level) || 0, meta };
}

const load = async u => { try { return await fromUuid(u); } catch (e) { return null; } };

/** Every Talent the character could take at this level: the Talent items and the Actions that are Talents (world and system compendiums). */
export async function talentPool(level) {
  const out = new Map();
  const ok = d => (d.type === "talent" || (d.type === "action" && /^talent/i.test(String(d.system?.category ?? "")))) && (Number(d.system?.level) || 0) <= level;
  for (const i of game.items ?? []) if (ok(i)) out.set(i.uuid, i);
  for (const pack of game.packs ?? []) {
    if (pack.metadata?.packageName !== F || pack.documentName !== "Item") continue;
    const index = await pack.getIndex({ fields: ["system.category", "system.level"] });
    for (const e of index) if (ok(e)) { const d = await load(e.uuid); if (d) out.set(d.uuid, d); }
  }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** The documents a level can offer, loaded once: its sections' items, the Repertoire and (for Talent sections) the Talent pool. */
async function gather(cls, level) {
  const docs = new Map();
  const uuids = new Set([...(cls.repertoire ?? []), ...sectionsAt(cls, level).flatMap(s => s.items ?? [])]);
  for (const u of uuids) { const d = await load(u); if (d) docs.set(u, d); }
  const talents = sectionsAt(cls, level).some(s => s.kind === "talent") ? await talentPool(level) : [];
  for (const d of talents) docs.set(d.uuid, d);
  const infos = new Map([...docs].map(([u, d]) => [u, itemInfo(d)]));
  return { docs, info: u => infos.get(u) ?? null, talents: talents.map(d => d.uuid) };
}

const CHECK = '<i class="fa-solid fa-check"></i>';
const ATTR_CLS = { body: "cw-a-body", mind: "cw-a-mind", appeal: "cw-a-appeal", instinct: "cw-a-instinct" };

export class ClassWindow extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "classwin"], window: { resizable: true }, position: { width: 1000, height: 760 } };

  /** o: { name, img, cls (the class data), level, adding, owned, priorAttrs, data (from gather), resolve } */
  constructor(o) {
    super({ window: { title: `Class: ${o.name}` } });
    Object.assign(this, { o, picks: {}, attrs: {}, view: null, cards: new Map(), done: false, priority: o.cls.modPriority === "power" ? "power" : "weapon", stage2: o.cls.modStage2 || "" });
    this.healthHigh = "vigor";   // v0.0.244 (pack R): where the class's high Health value goes (a level 1 choice); v0.0.245: a dropped class starts fresh (Vigor), never from the sheet's old state
    this.tf = { q: "", cat: "", only: true, compact: false };   // v0.0.195: the Talent filter bar
    this.choiceSel = {};   // v0.0.215: a chosen Talent or Feature with a choice (Lesser Blessing's blessing): uuid -> the options picked here
  }

  /** v0.0.195: a Talent's filter data: { q (name, Category, Theme), cat, ok, reasons } (canTake against the level being taken). */
  _talentData(u) {
    const d = this.o.data.docs.get(u), s = d?.system ?? {};
    const cat = d?.type === "talent" ? (s.group || "combat") : (/^(combat|mobility|magic|skill)/i.exec(String(s.category ?? ""))?.[1]?.toLowerCase() ?? "combat");
    const who = { system: { level: this.o.level, attributes: this.o.actor?.system?.attributes ?? {} }, items: this.o.actor?.items ?? [] };
    const r = d?.type === "talent" ? canTake(who, d) : { ok: true, reasons: [] };
    return { q: [d?.name, TWOD12.talentGroups[cat], s.theme].filter(Boolean).join(" ").toLowerCase(), cat, ok: r.ok, reasons: r.reasons };
  }
  _filterBar(sec) {
    const t = this.tf, opt = (v, l) => `<option value="${v}"${t.cat === v ? " selected" : ""}>${l}</option>`;
    return `<div class="cw-filter" data-sec="${sec}"><input type="search" class="cw-fq" placeholder="Search Talents…" value="${esc(t.q)}" aria-label="Search Talents">
      <select class="cw-fcat" aria-label="Category">${opt("", "All categories")}${Object.entries(TWOD12.talentGroups).map(([k, l]) => opt(k, l)).join("")}</select>
      <label class="cw-fonly" data-tooltip="Hide the Talents whose Level or Prerequisites you don't meet yet"><input type="checkbox" class="cw-fok"${t.only ? " checked" : ""}> Only what I can take</label>
      <button type="button" class="cw-fview" data-key="tfview" data-tooltip="${t.compact ? "Show as tiles" : "Show as a compact list"}"><i class="fa-solid ${t.compact ? "fa-grip" : "fa-list"}"></i></button></div>`;
  }
  /** Show or hide the Talent tiles by the filter (no redraw: typing keeps its place). The chosen ones always show. */
  _applyFilter() {
    const t = this.tf, q = t.q.trim().toLowerCase();
    this.element?.querySelectorAll(".cw-tiles[data-sec]").forEach(box => {
      let shown = 0;
      box.querySelectorAll(".cw-tile[data-q]").forEach(tile => {
        const ok = tile.classList.contains("chosen") || ((!q || tile.dataset.q.includes(q)) && (!t.cat || tile.dataset.cat === t.cat) && (!t.only || tile.dataset.ok === "1"));
        tile.hidden = !ok; if (ok) shown++;
      });
      const none = box.parentElement?.querySelector(".cw-none");
      if (none) none.hidden = shown > 0 || !box.querySelector(".cw-tile[data-q]");
    });
  }

  _model() {
    const { cls, level, owned, priorAttrs, data } = this.o;
    return levelModel(cls, level, { owned, picks: this.picks, attrs: this.attrs, priorAttrs, info: data.info, talents: data.talents });
  }

  async _card(uuid) {
    if (!this.cards.has(uuid)) {
      const d = this.o.data.docs.get(uuid);
      this.cards.set(uuid, d ? (d.type === "action" ? await buildRawCard(d) : await buildInfoCard(d)) : "");
    }
    return this.cards.get(uuid);
  }

  async _renderHTML() {
    const { cls, level, adding, name, img, data } = this.o;
    const m = this._model();
    if (!this.view) { const first = m.sections.find(x => x.list?.length); if (first) this.view = { uuid: (first.chosen?.[0] ?? first.list[0]), sec: first.s.id }; }
    const info = data.info;
    const tile = (x, u) => {
      const i = info(u), on = !!x.chosen?.includes(u), vw = this.view?.uuid === u && this.view?.sec === x.s.id;
      // v0.0.195: a Talent tile carries what the filter bar reads (name, Category, Theme, and whether the character can take it, and why not).
      const tal = x.s.kind === "talent" ? this._talentData(u) : null;
      const act = x.kind === "granted" ? '<span class="cw-lock">Granted</span>'
        : `<button type="button" class="cw-choose" data-key="pick:${x.s.id}:${u}" data-pick="${x.s.id}" data-uuid="${u}" aria-pressed="${on}">${on ? `${CHECK} Chosen` : "Choose"}</button>`;
      return `<div class="cw-tile${on ? " chosen" : ""}${vw ? " viewing" : ""}${tal && !tal.ok ? " cant" : ""}"${tal ? ` data-q="${esc(tal.q)}" data-cat="${tal.cat}" data-ok="${tal.ok ? 1 : 0}"${tal.ok ? "" : ` data-tooltip="${esc(`Not yet: ${tal.reasons.join("; ")}`)}"`}` : ""}><button type="button" class="cw-view" data-key="view:${x.s.id}:${u}" data-view="${u}" data-sec="${x.s.id}"><span class="nm">${esc(i?.name ?? "(missing item)")}</span><span class="mt">${esc(i?.meta ?? "")}</span></button><div class="cw-act">${act}</div></div>`;
    };
    const shared = level === 1 ? [...(cls.weaponAttrs ?? [])].filter(k => [...(cls.magicAttrs ?? [])].includes(k)) : [];
    // v0.0.244 (Lucas): the Health line's choice as a selection like the Attributes: the high value on Vigor or Resolve (book, Chapter 4; chosen once).
    const healthRow = level === 1 && Number(cls.healthHigh) > 0 ? `<div class="cw-attr"><span>High Health value (${Number(cls.healthHigh)}) on</span><div class="cw-seg">${[["vigor", "Vigor"], ["resolve", "Resolve"]].map(([k, l]) => `<button type="button" data-key="hhigh:${k}" data-hhigh="${k}" aria-pressed="${this.healthHigh === k}">${this.healthHigh === k ? `${CHECK} ` : ""}${l}</button>`).join("")}</div><span class="cw-hnote">the low value (${Number(cls.healthLow)}) on the other</span></div>` : "";
    let healthPlaced = !healthRow;
    // v0.0.305 (pack MOD; book, Chapter 5): the class's two Modifier values. Level 1: which is the Weapon Modifier (a class that lets you choose);
    // level 5 (Stage 2): which Modifier takes the +1 (default: the higher one). Chosen once.
    const mh = Number(cls.modHigh) || 0, ml = Number(cls.modLow) || 0, hasVals = mh > 0 || ml > 0, sgv = n => `${n >= 0 ? "+" : "−"}${Math.abs(n)}`;
    const segBtn = (data, k, on, l) => `<button type="button" data-key="${data}:${k}" data-${data}="${k}" aria-pressed="${on}">${on ? `${CHECK} ` : ""}${esc(l)}</button>`;
    const orderRow = level === 1 && hasVals && (cls.modOrder || "either") === "either"
      ? `<div class="cw-attr"><span>Your Modifiers</span><div class="cw-seg">${[["weapon", `Weapon ${sgv(mh)}, Power ${sgv(ml)}`], ["power", `Power ${sgv(mh)}, Weapon ${sgv(ml)}`]].map(([k, l]) => segBtn("prio", k, this.priority === k, l)).join("")}</div></div>` : "";
    // v0.0.307 (Lucas): a class that fixes the order (the Archer) still shows its Modifiers at level 1, as a decided choice.
    const fixedFirst = cls.modOrder === "power" ? "power" : "weapon";
    const fixedRow = level === 1 && hasVals && (cls.modOrder || "either") !== "either"
      ? `<div class="cw-attr"><span>Your Modifiers</span><div class="cw-seg"><button type="button" aria-pressed="true" disabled data-tooltip="Set by the class">${CHECK} ${esc(fixedFirst === "power" ? `Power ${sgv(mh)}, Weapon ${sgv(ml)}` : `Weapon ${sgv(mh)}, Power ${sgv(ml)}`)}</button></div></div>` : "";
    const t1 = hasVals ? classTrack({ high: mh, low: ml, order: cls.modOrder, lead: this.priority, stage: 1 }) : null;
    const s2now = this.stage2 || (t1?.weaponFirst ? "weapon" : "power");
    const s2Row = level === 5 && hasVals
      ? `<div class="cw-attr"><span>Stage 2: +1 to</span><div class="cw-seg">${[["weapon", `Weapon Modifier (Weapon ${sgv(t1.weapon + 1)}, Power ${sgv(t1.power)})`], ["power", `Power Modifier (Weapon ${sgv(t1.weapon)}, Power ${sgv(t1.power + 1)})`]].map(([k, l]) => segBtn("s2", k, s2now === k, l)).join("")}</div></div>` : "";
    const modSub = orderRow ? "Your class gives two Modifier values: choose which is your Weapon Modifier (Weapon Actions) and which your Power Modifier (Power Actions and Ward Defense). It can't be changed later."
      : fixedRow ? "Your class sets your Weapon Modifier (Weapon Actions) and your Power Modifier (Power Actions and Ward Defense). Stage 2 adds +1 to the one you choose, Stage 3 +1 to both."
      : "Stage 2 adds +1 to one of your Modifiers (never above +4). It can't be changed later.";
    const modSec = orderRow || fixedRow || s2Row ? `<section class="cw-sec"><h2>Modifiers <span class="cw-pill done">${orderRow || s2Row ? "Chosen" : "Set by the class"}</span></h2><p class="cw-sub">${modSub}</p>${orderRow}${fixedRow}${s2Row}</section>` : "";
    let modPlaced = !modSec;   // v0.0.306 (Lucas): the Modifiers section right under the Attribute increases, above the Features
    const secs = m.sections.map(x => {
      const pill = `<span class="cw-pill${x.done && x.kind !== "granted" ? " done" : ""}">${esc(x.pill)}</span>`;
      let body = "";
      if (x.kind === "attr") {
        body = x.pairs.map(p => `<div class="cw-attr"><span>${p.opts.map(k => AN[k]).join(" or ")} +1</span><div class="cw-seg">${p.opts.map(k => `<button type="button" data-key="attr:${x.s.id}:${p.i}:${k}" data-attr="${x.s.id}" data-pair="${p.i}" data-k="${k}" aria-pressed="${p.chosen === k}"${p.free.includes(k) ? "" : ' disabled data-tooltip="Chosen at an earlier level"'}><span class="${ATTR_CLS[k] ?? ""}">${AN[k]}</span> +1</button>`).join("")}</div></div>`).join("");
        if (!healthPlaced) { body += healthRow; healthPlaced = true; }
        if (shared.length) body += `<div class="cw-attr"><span>If ${shared.map(k => AN[k]).join(" or ")} is the higher for both Modifiers</span><div class="cw-seg">${[["weapon", "Weapon Modifier keeps it"], ["power", "Power Modifier keeps it"]].map(([k, l]) => `<button type="button" data-key="prio:${k}" data-prio="${k}" aria-pressed="${this.priority === k}">${l}</button>`).join("")}</div></div>`;
      } else {
        const bar = x.s.kind === "talent" ? this._filterBar(x.s.id) : "";
        body = `${x.empty ? '<div class="cw-empty">Everything here is already yours.</div>' : ""}${bar}<div class="cw-tiles${x.s.kind === "talent" && this.tf.compact ? " compact" : ""}" data-sec="${x.s.id}">${x.list.map(u => tile(x, u)).join("")}</div>${x.s.kind === "talent" ? '<p class="cw-none" hidden>No Talent matches the filter.</p>' : ""}`;
      }
      const html = `<section class="cw-sec"><h2>${esc(x.s.title)} ${pill}</h2><p class="cw-sub">${esc(x.sub)}</p>${body}</section>`;
      if (x.kind === "attr" && !modPlaced) { modPlaced = true; return html + modSec; }
      return html;
    }).join("");
    const secsAll = (modPlaced ? "" : modSec) + secs + (healthPlaced ? "" : `<section class="cw-sec"><h2>Health <span class="cw-pill done">Chosen</span></h2><p class="cw-sub">The class gives a high and a low Health value: you assign them.</p>${healthRow}</section>`) || '<p class="cw-empty">Nothing to choose at this level.</p>';
    // The card being read.
    let detail = '<p class="cw-empty">Click a name to read it.</p>';
    if (this.view) {
      const x = m.sections.find(y => y.s.id === this.view.sec);
      const on = !!x?.chosen?.includes(this.view.uuid);
      const foot = !x ? "" : x.kind === "granted" ? '<p class="cw-note">Granted. You don\'t need to choose this.</p>'
        : `<button type="button" class="cw-choose big" data-key="dpick" data-pick="${x.s.id}" data-uuid="${this.view.uuid}" aria-pressed="${on}">${on ? `${CHECK} Chosen` : "Choose"}</button>`;
      detail = `${await this._card(this.view.uuid)}${on ? await this._choiceBlock(this.view.uuid) : ""}<div class="cw-dfoot">${foot}</div>`;
    }
    const missing = this._missingChoices(m);
    if (missing.length) m.complete = false;
    const dots = Array.from({ length: m.total }, (_, i) => `<i class="${i < m.made ? "on" : ""}"></i>`).join("");
    const hv = this.healthHigh === "resolve" ? ["Resolve", "Vigor"] : ["Vigor", "Resolve"];
    const stats = [["Health", cls.healthHigh ? `${hv[0]} ${cls.healthHigh}, ${hv[1]} ${cls.healthLow} (Stage 2 +${cls.stepHigh2} / +${cls.stepLow2}; Stage 3 +${cls.stepHigh3} / +${cls.stepLow3})` : `Body ×${cls.bodyMult}, Mind ×${cls.mindMult} (old)`], ["Rally", `${cls.rallyMod} + Stage`], ["Speed", `${cls.speedMod >= 0 ? "+" : "−"}${Math.abs(cls.speedMod)}`], ["Armor Training", TWOD12.armorTrainings[cls.armorTraining] ?? cls.armorTraining]];
    const left = m.total - m.made, stage = stageLine(level);
    const div = document.createElement("div");
    div.className = "cw";
    div.innerHTML = `<header class="cw-head"><div class="cw-top"><div class="cw-ttl"><img src="${esc(img)}" alt=""><h1>${esc(name)} <small>Level ${level}</small></h1></div>
        <div class="cw-progress"><span class="cw-dots">${dots}</span><span>${m.made} of ${m.total} choices made</span></div></div>
        <div class="cw-stats">${stats.map(([k, v]) => `<span>${k}<b>${esc(v)}</b></span>`).join("")}</div>${stage ? `<div class="cw-stage">${esc(stage)}</div>` : ""}</header>
      <div class="cw-body"><div class="cw-col cw-slots">${secsAll}</div><div class="cw-col cw-detail">${detail}</div></div>
      <footer class="cw-foot"><span class="cw-msg">${left > 0 ? `${left} left to choose.` : missing.length ? `Choose for ${esc(missing.join(", "))} (under its card).` : "Everything is chosen. Attribute and Health choices can't be changed later."}</span>
        <span class="cw-btns"><button type="button" class="cw-btn" data-key="cancel" data-cancel>Cancel</button><button type="button" class="cw-btn primary" data-key="confirm" data-confirm${m.complete ? "" : " disabled"}>${adding ? `Add ${esc(name)} to sheet` : `Level up to ${level}`}</button></span></footer>`;
    return div;
  }

  /** v0.0.215 (Lucas): the options of a chosen item with a choice (Lesser Blessing: its blessing), picked here instead of a window after Confirm. */
  async _choiceBlock(uuid) {
    const d = this.o.data.docs.get(uuid), opts = (d?.system?.choiceOptions ?? []).filter(Boolean);
    if (!opts.length) return "";
    const count = Math.max(1, d.system.choiceCount || 1), sel = this._choicesFor(uuid);
    const names = await Promise.all(opts.map(async u => (await load(u))?.name ?? "(missing item)"));
    const only = opts.length <= count;
    return `<div class="cw-choice"><div class="cw-choice-h">${esc(d.system.choiceLabel || "Choose")} ${count}${only ? " (the only option: granted with it)" : ""}</div><div class="cw-seg">${opts.map((u, k) => `<button type="button" data-key="choice:${uuid}:${u}" data-choice="${uuid}" data-opt="${u}" aria-pressed="${only || sel.includes(u)}"${only ? " disabled" : ""}>${esc(names[k])}</button>`).join("")}</div></div>`;
  }
  _choicesFor(uuid) { return this.choiceSel[uuid] ?? []; }
  /** The chosen items whose choice is not made yet (more options than it grants). */
  _missingChoices(m) {
    const out = [];
    for (const x of m.sections) for (const u of x.chosen ?? []) {
      const d = this.o.data.docs.get(u), opts = (d?.system?.choiceOptions ?? []).filter(Boolean), count = Math.max(1, d?.system?.choiceCount || 1);
      if (x.kind !== "granted" && opts.length > count && this._choicesFor(u).length < count) out.push(d.name);
    }
    return out;
  }

  _replaceHTML(result, content) {
    // v0.0.215 (Lucas, playtest 2: clicking any option scrolled the window): every scrolled box is kept (the window's own content too), the
    // focus comes back without scrolling, and the card column starts at its top only when another card is shown.
    const key = content.querySelector(":focus")?.dataset?.key;
    const scrolls = [...content.querySelectorAll(".cw-col")].map(c => c.scrollTop), own = content.scrollTop;
    const viewKey = `${this.view?.sec}|${this.view?.uuid}`, sameCard = viewKey === this._viewKey;
    this._viewKey = viewKey;
    content.replaceChildren(result);
    this._applyFilter();   // v0.0.216: before the scroll comes back (the hidden Talents above the Escalation picks made it jump)
    content.querySelectorAll(".cw-col").forEach((c, i) => { c.scrollTop = c.classList.contains("cw-detail") && !sameCard ? 0 : scrolls[i] ?? 0; });
    content.scrollTop = own;
    if (key) content.querySelector(`[data-key="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this.element.addEventListener("click", ev => this._click(ev));
    // v0.0.195: the Talent filter bar.
    this.element.addEventListener("input", ev => {
      if (ev.target.matches(".cw-fq")) { this.tf.q = ev.target.value; this._applyFilter(); }
    });
    this.element.addEventListener("change", ev => {
      if (ev.target.matches(".cw-fcat")) { this.tf.cat = ev.target.value; this._applyFilter(); }
      if (ev.target.matches(".cw-fok")) { this.tf.only = ev.target.checked; this._applyFilter(); }
    });
  }

  _onRender(context, options) {
    super._onRender?.(context, options);
    this._applyFilter();
  }

  _click(ev) {
    const b = ev.target.closest("button");
    if (!b || b.disabled) return;
    const m = this._model();
    const sec = id => m.sections.find(x => x.s.id === id)?.s;
    if (b.dataset.view) this.view = { uuid: b.dataset.view, sec: b.dataset.sec };
    else if (b.dataset.pick) { const s = sec(b.dataset.pick); if (s) { this.picks = togglePick(this.picks, s, b.dataset.uuid); this.view = { uuid: b.dataset.uuid, sec: s.id }; } }
    else if (b.dataset.attr) this.attrs = setAttr(this.attrs, sectionsAt(this.o.cls, this.o.level), b.dataset.attr, Number(b.dataset.pair), b.dataset.k, this.o.priorAttrs);
    else if (b.dataset.prio) this.priority = b.dataset.prio;
    else if (b.dataset.s2) this.stage2 = b.dataset.s2;   // v0.0.305 (pack MOD): the Stage 2 +1
    else if (b.dataset.hhigh) this.healthHigh = b.dataset.hhigh;
    else if (b.dataset.choice) {
      const u = b.dataset.choice, d = this.o.data.docs.get(u), count = Math.max(1, d?.system?.choiceCount || 1), cur = this._choicesFor(u);
      this.choiceSel[u] = cur.includes(b.dataset.opt) ? cur.filter(x => x !== b.dataset.opt) : [...cur, b.dataset.opt].slice(-count);
    }
    else if (b.dataset.key === "tfview") this.tf.compact = !this.tf.compact;
    else if (b.hasAttribute("data-cancel")) return this.close();
    else if (b.hasAttribute("data-confirm")) {
      if (!m.complete || this._missingChoices(m).length) return;
      this.done = true;
      this.o.resolve({ grant: levelPlan(this.o.cls, this.o.level, m), attrs: attrList(this.o.cls, this.o.level, this.attrs), attrMap: this.attrs, picks: this.picks, priority: this.priority, stage2: this.stage2 || "", choices: this.choiceSel, healthHigh: this.healthHigh });
      return this.close();
    } else return;
    this.render();
  }

  async close(options) {
    if (!this.done) { this.done = true; this.o.resolve(null); }
    return super.close(options);
  }
}

/** Opens the window for one level and waits: the confirmed choices, or null (Cancel or closed). */
export async function chooseLevel({ name, img, cls, level, adding = false, owned = [], priorAttrs = [], actor = null }) {
  const data = await gather(cls, level);
  return new Promise(resolve => new ClassWindow({ name, img, cls, level, adding, owned, priorAttrs, data, resolve, actor }).render({ force: true }));
}

const sourceOf = i => i.getFlag(F, "sourceUuid");
/** The items the class gave (any level, or above a level), with what each of them gave in turn. */
function classItems(actor, above = 0) {
  const top = actor.items.filter(i => (Number(i.getFlag(F, "classLevel")) || 0) > above || (above === 0 && i.type === "feature" && i.getFlag(F, "grantedBy") === "class"));
  const ids = new Set(top.map(i => i.id));
  for (let grew = true; grew;) {
    grew = false;
    for (const i of actor.items) {
      if (ids.has(i.id)) continue;
      if (["featureId", "talentId"].some(k => ids.has(i.getFlag(F, k)))) { ids.add(i.id); grew = true; }
    }
  }
  return [...ids].map(id => actor.items.get(id)).filter(Boolean);
}

/** Adds what one confirmed level gives to the character and records it on the class copy. */
async function applyLevel(actor, level, res) {
  const cls = actor.itemTypes.class[0];
  if (!cls) return;
  for (const g of res.grant) {
    const doc = await load(g.uuid);
    if (!doc) { ui.notifications.warn(`Class item not found: ${g.uuid}`); continue; }
    const flags = { classLevel: level, classSection: g.section };
    const slot = g.kind === "talent" ? `class:${level}:${g.section}:${g.slot ?? 0}` : "";
    const preset = res.choices?.[g.uuid] ?? null;   // v0.0.215: the choice made in the window (Lesser Blessing's blessing)
    if (doc.type === "feature") await grantFeature(actor, doc, "class", level, flags, preset);
    else if (doc.type === "talent") await grantTalent(actor, doc, slot, flags, preset);
    else if (actor.items.some(i => sourceOf(i) === doc.uuid)) continue;
    else {
      const d = doc.toObject(); delete d._id;
      d.flags = foundry.utils.mergeObject(d.flags ?? {}, { [F]: { sourceUuid: doc.uuid, ...flags, ...(slot ? { slot } : {}) } });
      await actor.createEmbeddedDocuments("Item", [d]);
    }
  }
  const all = [...(cls.system.chosenAttrs ?? []), ...res.attrs];
  const upd = { "system.chosenAttrs": all, "system.chosenA": all[0] ?? "", "system.chosenB": all[1] ?? "", [`flags.${F}.classPicks.${level}`]: res.picks, [`flags.${F}.classAttrs.${level}`]: res.attrs };
  if (level === 1) upd["system.modPriority"] = res.priority;
  if (level === 5 && res.stage2) upd["system.modStage2"] = res.stage2;   // v0.0.305 (pack MOD): "" keeps the default (the higher one)
  await cls.update(upd);
  if (level === 1 && res.healthHigh && actor.type === "character" && actor.system.healthHigh !== res.healthHigh) await actor.update({ "system.healthHigh": res.healthHigh });   // v0.0.244: the Health line's side
}

/** The Level field changed on the sheet (or the class was dropped on a character above level 1): each new level in turn. */
async function levelsUp(actor, from, to) {
  for (let l = from + 1; l <= to; l++) {
    const cls = actor.itemTypes.class[0];
    if (!cls) return;
    const res = await chooseLevel({ name: cls.name, img: cls.img, cls: cls.system, level: l, owned: actor.items.map(sourceOf).filter(Boolean), priorAttrs: [...(cls.system.chosenAttrs ?? [])], actor });
    if (!res) {
      await actor.update({ "system.level": l - 1 }, { twod12Class: "skip" });
      if (l - 1 !== to) ui.notifications.info(`${actor.name} stays at level ${l - 1}.`);
      return;
    }
    await applyLevel(actor, l, res);
  }
}

async function levelsDown(actor, from, to) {
  const cls = actor.itemTypes.class[0];
  if (!cls) return;
  const gone = classItems(actor, to);
  const lost = Object.entries(cls.getFlag(F, "classAttrs") ?? {}).filter(([l]) => Number(l) > to).flatMap(([, v]) => v);
  if (gone.length || lost.length) {
    const names = [...gone.filter(i => (Number(i.getFlag(F, "classLevel")) || 0) > to).map(i => i.name), ...lost.map(k => `+1 ${AN[k] ?? k}`)];
    const ok = await DialogV2.confirm({ window: { title: `${actor.name}: level ${from} to ${to}` }, content: `<p>Going down to level ${to} removes what the higher levels gave:</p><p><b>${names.map(esc).join(", ")}</b></p>`, rejectClose: false });
    if (!ok) return actor.update({ "system.level": from }, { twod12Class: "skip" });
  }
  if (gone.length) await actor.deleteEmbeddedDocuments("Item", gone.map(i => i.id));
  const picks = cls.getFlag(F, "classPicks") ?? {}, attrs = cls.getFlag(F, "classAttrs") ?? {};
  const keep = Object.keys(attrs).map(Number).filter(l => l <= to).sort((a, b) => a - b).flatMap(l => attrs[l] ?? []);
  const upd = { "system.chosenAttrs": keep, "system.chosenA": keep[0] ?? "", "system.chosenB": keep[1] ?? "" };
  for (const l of Object.keys(picks)) if (Number(l) > to) upd[`flags.${F}.classPicks.-=${l}`] = null;
  for (const l of Object.keys(attrs)) if (Number(l) > to) upd[`flags.${F}.classAttrs.-=${l}`] = null;
  await cls.update(upd);
}

export const hasLevels = cls => !!cls?.system?.levels?.length;

/** The Level changed (updateActor, on the client that changed it). Returns false when the class has no levels (the old flow runs). */
export async function classLevelChange(actor, from, to) {
  const cls = actor.itemTypes.class?.[0];
  if (actor.type !== "character" || !hasLevels(cls)) return false;
  from = Math.max(1, Number(from) || 1); to = Math.max(1, Number(to) || 1);   // level 0 counts as 1, as the class's level 1 does
  if (to > from) await levelsUp(actor, from, to);
  else if (to < from) await levelsDown(actor, from, to);
  return true;
}

/** A Class with levels dropped on a character: level 1 in the window, then the levels up to the character's. */
export async function dropClassLevels(actor, item) {
  const leaving = new Set(classItems(actor).map(i => i.id));
  const owned = actor.items.filter(i => !leaving.has(i.id) && i.type !== "class").map(sourceOf).filter(Boolean);
  const res = await chooseLevel({ name: item.name, img: item.img, cls: item.system, level: 1, adding: true, owned, actor });
  if (!res) return;
  for (const old of actor.itemTypes.class) await old.delete();
  if (leaving.size) await actor.deleteEmbeddedDocuments("Item", [...leaving].filter(id => actor.items.has(id)));
  const d = item.toObject();
  delete d._id;
  foundry.utils.setProperty(d, `flags.${F}.sourceUuid`, item.uuid);
  Object.assign(d.system, { chosenA: "", chosenB: "", chosenAttrs: [], chosenWeapon: "", chosenMagic: "" });
  await actor.createEmbeddedDocuments("Item", [d]);
  await applyLevel(actor, 1, res);
  ui.notifications.info(`${item.name} added (${res.attrs.map(k => `+1 ${AN[k] ?? k}`).join(", ") || "no Attribute increases"}).`);
  const lvl = Math.max(1, Number(actor.system.level) || 1);
  if (lvl > 1) await levelsUp(actor, 1, lvl);
}

/** The Class tab of the sheet, for a class with levels: the Features its Granted sections gave, the picks by section, and what is not reached. */
export function classTabSections(actor, cls) {
  const lv = Math.max(1, Number(actor.system.level) || 1);
  const granted = [], picks = [], locked = [];
  (cls.system.levels ?? []).forEach((l, i) => {
    const level = i + 1;
    for (const s of l.sections ?? []) {
      if (s.kind === "attr") continue;
      if (level > lv) { locked.push({ level, title: s.title, key: `lock:${level}:${s.id}` }); continue; }
      if (s.kind === "talent") continue;   // Talents fill the Talent slots
      const got = actor.items.filter(it => Number(it.getFlag(F, "classLevel")) === level && it.getFlag(F, "classSection") === s.id);
      if (s.kind === "items" && s.mode === "granted") {
        granted.push(...got.filter(it => it.type === "feature").map(it => ({ it, level })));
        const rest = got.filter(it => it.type !== "feature");
        if (rest.length) picks.push({ level, title: s.title, items: rest });
      } else picks.push({ level, title: s.title, items: got });
    }
  });
  return { granted, picks, locked, level: lv };
}

/** The Talent slots the class's Talent sections give at the levels reached (one per Pick). */
export function classTalentSlots(actor) {
  const cls = actor.itemTypes.class?.[0];
  if (!hasLevels(cls)) return [];
  const lv = Math.max(1, Number(actor.system.level) || 1), out = [];
  (cls.system.levels ?? []).forEach((l, i) => {
    if (i + 1 > lv) return;
    for (const s of l.sections ?? []) if (s.kind === "talent") for (let n = 0; n < Math.max(1, s.pick || 1); n++) out.push({ key: `class:${i + 1}:${s.id}:${n}`, feature: `${s.title} (Level ${i + 1})` });
  });
  return out;
}

