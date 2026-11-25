// Compact STYLE-3 Save & Attribute Check Roll Dialog (ApplicationV2).
// Replaces the legacy Foundry DialogV2.prompt in askRoll() for Saves, Checks, and Shake Off rolls,
// reusing rolldlg.mjs's exact 3-Tier ladder, bbState (5 Boons/Banes -> Favored/Doomed), and oddsOf.
import { esc } from "./util.mjs";
import { TWOD12, highlightText } from "./config.mjs";
import { ladder, oddsOf, bbState } from "./rolldlg.mjs";
const { ApplicationV2 } = foundry.applications?.api ?? {};

const ATTR_COLOR = { body: "#c44536", mind: "#4c80c4", appeal: "#c99732", instinct: "#4c9665" };
const sgn = n => (Number(n) >= 0 ? `+${Number(n) || 0}` : `\u2212${Math.abs(Number(n) || 0)}`);

function showOddsEnabled() {
  try { return !!game.settings?.get?.("twod12", "showOdds"); } catch (e) { return false; }
}

/**
 * Pure (v0.0.500, Lucas on v0.0.499: the Save dialog "shows the tiers effect as 3d6[mind,holy] etc instead of just the descriptions"): a Tier
 * written in the @Save chip's code ("3d6+2[mind,holy], \"Pushed 1.\"") as the card writes it ("[R] 3d6 + 2 Ho; Pushed 1."). Plain text is kept.
 */
export function saveTierWords(text) {
  const t = String(text ?? "").trim();
  if (!t || t === "0") return "No effect.";
  if (!/\[(?:body|mind)(?:,[^\]]*)?\]|^"/i.test(t)) return t;
  const codeOf = name => Object.entries(TWOD12.subtypes ?? {}).find(([k, v]) => k && String(v).toLowerCase() === String(name ?? "").trim().toLowerCase())?.[0] ?? "";
  const parts = [], re = /"((?:[^"]|"")*)"|((?:\[[^\]]*\]|[^,\["])+)/g;
  let m;
  while ((m = re.exec(t))) {
    if (m[1] !== undefined) { const x = m[1].trim(); if (x) parts.push({ text: x }); continue; }
    const p = m[2].trim(), d = p.match(/^(.*?)\[(body|mind)(?:,([^\]]*))?\]$/i);
    if (!d) { if (p && p !== "0") parts.push({ text: p }); continue; }
    const amt = d[1].replace(/\s*\+\s*/g, " + ").trim(), sub = codeOf(d[3]);
    parts.push({ dmg: `[${d[2].toLowerCase() === "mind" ? "R" : "V"}] ${amt}${sub ? ` ${sub}` : ""}` });
  }
  const dmg = parts.filter(x => x.dmg).map(x => x.dmg).join(" + "), txt = parts.filter(x => x.text).map(x => x.text).join(" ");
  return [dmg, txt].filter(Boolean).join("; ").replace(/([^.!?])$/, "$1.") || "No effect.";
}

/** Pure model for the compact Check / Save Roll Dialog. */
export function checkRollHtml(st) {
  const attrName = TWOD12.attributes[st.attrKey] ?? "";
  const attrCol = ATTR_COLOR[st.attrKey] ?? "#d2a75a";
  const baseMod = Number(st.baseMod) || 0;
  const adj = Number(st.adj) || 0;
  const dc = Math.max(1, Math.trunc(Number(st.dc) || 13));
  let fxBoons = 0, fxBanes = 0, fxFav = false, fxDoom = false;
  for (const m of st.mods) {
    if (!m.info && st.fxOn.has(m.id)) {
      fxBoons += Number(m.boons) || 0;
      fxBanes += Number(m.banes) || 0;
      if (m.favored) fxFav = true;
      if (m.doomed) fxDoom = true;
    }
  }
  const totBoons = fxBoons + (Number(st.boons) || 0);
  const totBanes = fxBanes + (Number(st.banes) || 0);
  const b = bbState({ boons: totBoons, banes: totBanes, fav: !!st.favored || fxFav, doom: !!st.doomed || fxDoom });
  const effMod = baseMod + adj + b.add;
  const dice = b.state === "favored" ? "3d12kh2" : b.state === "doomed" ? "3d12kl2" : "2d12";
  const stateTag = b.cancel ? "Favored + Doomed cancel"
    : b.state === "favored" ? (b.five === "favored" ? "Favored (5+ Boons)" : "Favored")
    : b.state === "doomed" ? (b.five === "doomed" ? "Doomed (5+ Banes)" : "Doomed")
    : "";
  const formula = `${dice} ${effMod >= 0 ? "+" : "\u2212"} ${Math.abs(effMod)} vs DC ${dc}`;
  // v0.0.498 (Pass 3): live Modifier Breakdown summarizing every active source feeding the roll
  const bdParts = [];
  if (attrName) bdParts.push(`${attrName} ${sgn(baseMod)}`);
  if (adj) bdParts.push(`${st.adjLabel && adj === Number(st.adjDefault) ? st.adjLabel : "Manual"} ${sgn(adj)}`);
  for (const m of st.mods) {
    if (m.info || !st.fxOn.has(m.id)) continue;
    const isFav = !!m.favored && !m.doomed && !(m.boons || m.banes);
    const isDoom = !!m.doomed && !m.favored && !(m.boons || m.banes);
    if (isFav) bdParts.push(`${m.name} (Favored)`);
    else if (isDoom) bdParts.push(`${m.name} (Doomed)`);
    else {
      const d = `${m.boons ? `+${m.boons}` : ""}${m.boons && m.banes ? "/" : ""}${m.banes ? `\u2212${m.banes}` : ""}`;
      bdParts.push(d ? `${m.name} ${d}` : m.name);
    }
  }
  if (Number(st.boons) > 0) bdParts.push(`Manual +${Number(st.boons)} Boon${Number(st.boons) === 1 ? "" : "s"}`);
  if (Number(st.banes) > 0) bdParts.push(`Manual \u2212${Number(st.banes)} Bane${Number(st.banes) === 1 ? "" : "s"}`);
  if (st.favored) bdParts.push(st.favoredLabel || "Favored");
  if (st.doomed) bdParts.push(st.doomedLabel || "Doomed");
  const breakdownHtml = bdParts.length ? `<div class="ck-breakdown">${esc(bdParts.join(" \u00b7 "))}</div>` : "";
  const lad = ladder(dc, false);
  const odds = showOddsEnabled() ? oddsOf({ mod: baseMod + adj, dc, bbAdd: b.add, state: b.state }, false) : null;
  const tiers = st.tiers ?? null;
  const tierHtml = lad.map((row, i) => {
    const body = tiers?.[`t${i + 1}`] ? `<div class="ck-tbody">${highlightText(esc(saveTierWords(tiers[`t${i + 1}`])))}</div>` : "";
    const pct = odds ? `<span class="ck-pct">${odds[i]}%</span>` : "";
    return `<div class="ck-tier ${row.k}"><div class="ck-thead"><b>${esc(row.label)}</b>${pct}</div>${body}</div>`;
  }).join("");

  const effectChips = st.mods.filter(m => !m.info).map(m => {
    const on = st.fxOn.has(m.id);
    const isFav = !!m.favored && !m.doomed && !(m.boons || m.banes);
    const isDoom = !!m.doomed && !m.favored && !(m.boons || m.banes);
    const kind = isDoom || (m.banes && !m.boons) ? "bane" : "boon";
    const icon = isFav ? "angles-up" : isDoom ? "angles-down" : (kind === "bane" ? "chevron-down" : "chevron-up");
    const delta = isFav ? "Favored" : isDoom ? "Doomed" : `${m.boons ? `+${m.boons}` : ""}${m.boons && m.banes ? "/" : ""}${m.banes ? `\u2212${m.banes}` : ""}`;
    return `<button type="button" class="ck-chip ${kind}${on ? " on" : ""}" data-ck-fx="${esc(m.id)}" aria-pressed="${on}"><i class="fa-solid fa-${icon}" aria-hidden="true"></i><span>${esc(m.name)}</span>${delta && !m.full ? `<small>${delta}</small>` : ""}</button>`;
  }).join("");

  const noticeChips = [...st.notices, ...st.mods.filter(m => m.info)].map(n =>
    `<span class="ck-notice"><i class="fa-solid ${esc(n.icon ?? "fa-circle-info")}" aria-hidden="true"></i> ${esc(n.text)}</span>`
  ).join("");

  const notesHtml = st.notes.length
    ? `<div class="ck-notes"><span class="ck-lbl">Active notes</span><ul>${st.notes.map(n => `<li><b>${esc(n.title)}</b>${n.text ? `: ${highlightText(esc(n.text))}` : ""}</li>`).join("")}</ul></div>`
    : "";

  const favLabel = st.favored && st.favoredLabel ? st.favoredLabel : "Favored";
  const doomLabel = st.doomed && st.doomedLabel ? st.doomedLabel : "Doomed";
  const img = st.actorImg ? `<img class="ck-por" src="${esc(st.actorImg)}" alt="">` : `<span class="cw-icon"><i class="fa-solid fa-dice-d20"></i></span>`;

  return `<header class="cw-head ck-head">
      <div class="cw-top">
        <div class="cw-ttl">${img}<div><h1>${esc(st.title)}</h1><div class="ck-sub">${esc(st.actorName)}${st.dcNote ? ` \u00b7 ${esc(st.dcNote)}` : ""}</div></div></div>
        ${attrName ? `<span class="ck-attr" style="--ac:${attrCol}">${esc(attrName)} <b>${sgn(baseMod)}</b></span>` : ""}
      </div>
    </header>
    <div class="cw-body ck-body">
      <div class="ck-hero">
        <div class="ck-hero-top">
          <div class="ck-formula">${esc(formula)}</div>
          ${stateTag ? `<span class="ck-state ${b.state || "cancel"}">${esc(stateTag)}</span>` : ""}
        </div>
        ${breakdownHtml}
      </div>
      <div class="ck-steppers">
        <div class="ck-field"><span>DC</span><span class="pw-step"><button type="button" data-ck-step="dc" data-d="-1" aria-label="Lower DC">&minus;</button><input type="number" data-ck-in="dc" value="${dc}"><button type="button" data-ck-step="dc" data-d="1" aria-label="Raise DC">+</button></span></div>
        <div class="ck-field"><span>Modifier</span><span class="pw-step"><button type="button" data-ck-step="adj" data-d="-1" aria-label="Lower modifier">&minus;</button><input type="number" data-ck-in="adj" value="${adj}"><button type="button" data-ck-step="adj" data-d="1" aria-label="Raise modifier">+</button></span></div>
      </div>
      <div class="ck-bbrow">
        <button type="button" class="ck-bb boon${st.boons ? " on" : ""}" data-ck-bb="boons" aria-label="Add Boon (right-click to remove)"><i class="fa-solid fa-chevron-up"></i> Boons <b>${st.boons}</b></button>
        <button type="button" class="ck-bb bane${st.banes ? " on" : ""}" data-ck-bb="banes" aria-label="Add Bane (right-click to remove)"><i class="fa-solid fa-chevron-down"></i> Banes <b>${st.banes}</b></button>
        <button type="button" class="ck-bb boon${st.favored ? " on" : ""}" data-ck-tog="favored" aria-pressed="${!!st.favored}"><i class="fa-solid fa-angles-up"></i> ${esc(favLabel)}</button>
        <button type="button" class="ck-bb bane${st.doomed ? " on" : ""}" data-ck-tog="doomed" aria-pressed="${!!st.doomed}"><i class="fa-solid fa-angles-down"></i> ${esc(doomLabel)}</button>
      </div>
      ${noticeChips ? `<div class="ck-row">${noticeChips}</div>` : ""}
      ${effectChips ? `<div class="ck-row"><span class="ck-lbl">Effects</span><div class="ck-chips">${effectChips}</div></div>` : ""}
      <div class="ck-tiers">${tierHtml}</div>
      ${notesHtml}
    </div>
    <footer class="cw-foot ck-foot">
      <span class="cw-msg">${totBoons || totBanes ? `${totBoons} Boon${totBoons === 1 ? "" : "s"} \u00b7 ${totBanes} Bane${totBanes === 1 ? "" : "s"}` : "Click Roll or press Enter"}</span>
      <span class="cw-btns"><button type="button" class="cw-btn" data-ck="cancel">Cancel</button><button type="button" class="cw-btn primary" data-ck="roll"><i class="fa-solid fa-dice-d20"></i> Roll</button></span>
    </footer>`;
}

export class CheckRollWindow extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = {
    classes: ["twod12", "classwin", "pickwin", "pw-compact", "ckwin"],
    window: { resizable: true },
    position: { width: 460, height: "auto" }
  };

  constructor(st, resolve) {
    super({ window: { title: st.title } });
    this.st = st;
    this.resolve = resolve;
    this.done = false;
  }

  async _renderHTML() {
    const div = document.createElement("div");
    div.className = "cw";
    div.innerHTML = checkRollHtml(this.st);
    return div;
  }

  _replaceHTML(result, content) {
    const active = content.querySelector(":focus")?.dataset?.ckIn;
    content.replaceChildren(result);
    if (active) content.querySelector(`[data-ck-in="${CSS.escape(active)}"]`)?.focus({ preventScroll: true });
  }

  _result() {
    const s = this.st;
    return {
      dc: String(Math.max(1, Math.trunc(Number(s.dc) || 13))),
      mod: String(Math.trunc(Number(s.adj) || 0)),
      boons: String(Math.max(0, Math.trunc(Number(s.boons) || 0))),
      banes: String(Math.max(0, Math.trunc(Number(s.banes) || 0))),
      ...(s.favored ? { favored: "on" } : {}),
      ...(s.doomed ? { doomed: "on" } : {}),
      ...(s.adjLabel ? { adjLabel: s.adjLabel, adjDefault: String(s.adjDefault ?? 0) } : {}),
      fx: [...s.fxOn],
      bonusOn: [],
      removed: []
    };
  }

  _submit() {
    if (this.done) return;
    this.done = true;
    this.resolve(this._result());
    return this.close();
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const el = this.element;
    el.addEventListener("click", ev => {
      const b = ev.target.closest("button");
      if (!b || b.disabled) return;
      if (b.dataset.ck === "cancel") return this.close();
      if (b.dataset.ck === "roll") return this._submit();
      if (b.dataset.ckStep) {
        const k = b.dataset.ckStep, d = Number(b.dataset.d) || 0;
        this.st[k] = k === "dc" ? Math.max(1, (Number(this.st.dc) || 13) + d) : (Number(this.st[k]) || 0) + d;
        return this.render();
      }
      if (b.dataset.ckBb) {
        const k = b.dataset.ckBb;
        this.st[k] = Math.max(0, (Number(this.st[k]) || 0) + 1);
        return this.render();
      }
      if (b.dataset.ckTog) {
        const k = b.dataset.ckTog;
        this.st[k] = !this.st[k];
        return this.render();
      }
      if (b.dataset.ckFx) {
        const id = b.dataset.ckFx;
        if (this.st.fxOn.has(id)) this.st.fxOn.delete(id); else this.st.fxOn.add(id);
        return this.render();
      }
    });
    el.addEventListener("contextmenu", ev => {
      const b = ev.target.closest("[data-ck-bb]");
      if (!b) return;
      ev.preventDefault();
      const k = b.dataset.ckBb;
      this.st[k] = Math.max(0, (Number(this.st[k]) || 0) - 1);
      this.render();
    });
    el.addEventListener("change", ev => {
      const inp = ev.target.closest("[data-ck-in]");
      if (!inp) return;
      const v = Number(inp.value);
      if (Number.isFinite(v)) this.st[inp.dataset.ckIn] = inp.dataset.ckIn === "dc" ? Math.max(1, Math.trunc(v)) : Math.trunc(v);
      this.render();
    });
    el.addEventListener("input", ev => {
      const inp = ev.target.closest("[data-ck-in]");
      if (!inp) return;
      const v = Number(inp.value);
      if (Number.isFinite(v)) this.st[inp.dataset.ckIn] = inp.dataset.ckIn === "dc" ? Math.max(1, Math.trunc(v)) : Math.trunc(v);
    });
    el.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { ev.preventDefault(); return this.close(); }
      if (ev.key === "Enter" && !ev.target.closest?.("button")) { ev.preventDefault(); return this._submit(); }
    });
  }

  async close(options) {
    if (!this.done) { this.done = true; this.resolve(null); }
    return super.close(options);
  }
}

export function openCheckRoll(opts) {
  return new Promise(resolve => new CheckRollWindow(opts, resolve).render({ force: true }));
}
