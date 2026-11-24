// A strip of portraits across the top of the screen while there is a combat (also while it is being prepared):
// turn order, the creature whose turn it is, and its Action Points as dots under the portrait.
import { getAP, setAP, apMax, getRAP, setRAP, rapMaxOf, slowedOf, endTurnFor, swapCandidates, swapWith, thawedNow, rollPendingInitiative, squadKeyOf, turnSnapshot, resetTurn } from "./combat.mjs";
import { stripMove, endMoveFor, evadeToAdvance, showRange, clearRange } from "./move.mjs";
import { groupColor } from "./config.mjs";
import { esc, perFrame, logOnlyChange } from "./util.mjs";
import { strikesUsed } from "./usage.mjs";
import { marksHtml } from "./hudview.mjs";
import { momentumNow, setMomentum } from "./escalation.mjs";
const F = "twod12", ID = "twod12-carousel";
let stripHovered = null;
const clearStripHover = () => {
  const tok = stripHovered;
  stripHovered = null;
  if (tok && tok._hover) try { tok._onHoverOut?.({ currentTarget: tok }); } catch (e) { /* gone */ }
};

/** v0.0.199 (Lucas, mockup "D2. Plates, condensed"): a creature's plate: the band (FOE / ALLY, or ACTING), the round portrait with the
 * initiative seal, the name and the AP pips; the active one also has its movement left and Swap. */
export const DISP_LABEL = { 1: "Ally", 0: "Neutral", "-1": "Foe", "-2": "Secret" };
const dispOf = c => {
  const side = c?.getFlag?.(F, "init")?.side;
  if (side === "ally") return 1;
  if (side === "foe") return -1;
  const d = c.token?.disposition;
  return d === undefined || d === null ? (c.actor?.type === "character" ? 1 : -1) : d;
};
const waitingRxActors = () => {
  const out = new Set();
  const msgs = game.messages?.contents ?? [];
  for (let i = msgs.length - 1; i >= Math.max(0, msgs.length - 20); i--) {
    const stx = msgs[i]?.getFlag?.(F, "rx");
    if (!stx || stx.done) continue;
    for (const r of stx.rows ?? []) if (r.state === "wait" && r.actorUuid) out.add(r.actorUuid);
  }
  return out;
};
function card(combat, c, st) {
  const current = combat.started && combat.combatant?.id === c.id;
  const ap = getAP(c), rap = combat.started ? getRAP(c) : 0;
  const frozen = !!c.getFlag(F, "frozen");
  // v0.0.201 (Lucas): three kinds of pips, by shape as well as color: its turn (discs), out of turn (diamonds: AP for Reactions), frozen (dashed rings).
  // v0.0.243 (pack R): the Reaction Point is the last pip (a diamond with an R); out of its turn the kept AP are Guard (the tooltip says how much).
  const pipKind = frozen ? "frozen" : (current ? "turn" : "react");
  // v0.0.390 (PACK HUD2, Lucas: "All your picks"): the HUD's marks, the same shapes on every turn (book/research/ui-marks-and-state.md): AP squares,
  // the Reaction Point a diamond, the Strikes left as slashes, a hairline between them; frozen keeps its dashed look (CSS) and its tooltip
  const slowed = (() => { try { return slowedOf(c.actor); } catch (e) { return 0; } })();
  const rapMax = Math.max(1, rapMaxOf(c));
  const dense = Math.max(ap, apMax(c)) >= 6 || rapMax > 1;
  const marks = rapMax > 1
    ? marksHtml({ ap, max: Math.max(apMax(c), 1), slowed, rap, rapMax, strikes: combat.started ? strikesUsed(c.actor) : 0, showStrikes: combat.started })
    : marksHtml({ ap, max: Math.max(apMax(c), 1), slowed, rap, rapMax: 1, strikes: combat.started ? strikesUsed(c.actor) : 0, showStrikes: combat.started });
  const pips = `<div class="tp-marks ${pipKind}${dense ? " dense" : ""}">${marks}</div>`;
  const strikes = "";   // v0.0.390: the Strikes are in the marks
  const htag = "";   // v0.0.453 (Lucas, playtest 6: "Remove the 'Bloodied' 'Dying' from the combat strip"): no state tag under the name
  const img = esc(c.token?.texture?.src || c.img || "icons/svg/mystery-man.svg");
  const noInit = c.initiative === null || c.initiative === undefined;
  const d = dispOf(c), band = current ? "Acting" : frozen ? "Frozen" : (DISP_LABEL[d] ?? "");
  const swapOk = st.swapIds.has(c.id);
  const acted = combat.started && !current && st.curIdx >= 0 && st.idx < st.curIdx && !c.isDefeated && !frozen;
  const isTarget = !!(c.tokenId && st.targetIds.has(c.tokenId));
  const hasWaitRx = !!(c.actor?.uuid && st.rxActors.has(c.actor.uuid));
  let extra = "";
  if (current) {
    const m = stripMove(c);
    const move = m.n > 0
      ? `<div class="tp-move${m.evade ? " evade" : ""}" data-tc="endmove"><span>${m.evade ? "Evade" : "Move"}</span> <b>${m.n}</b> sq${m.evade && st.canAct ? ' <a class="tp-adv" data-tc="evadeadv" aria-label="Use the Evade as an Advance (it can trigger Reactions)"><i class="fa-solid fa-person-running"></i></a>' : ""}</div>`
      : `<div class="tp-move none">No move</div>`;
    const swap = `<button type="button" class="tp-swap${st.swapping ? " on" : ""}" data-tc="swap"${st.swapWhy ? ` disabled data-tooltip="${esc(st.swapWhy)}"` : ` aria-label="${st.swapping ? "Click an ally with the swap badge, or here to cancel" : "Swap initiative with an ally who hasn't had a turn this round (1 AP)"}"`}><i class="fa-solid fa-right-left"></i> Swap</button>`;   // v0.0.394: the cost in the tooltip (it was cut off)
    extra = move + swap;
  }
  const tip = current ? "" : `${noInit ? "Click to roll initiative · " : ""}${swapOk ? "Click to swap with this ally · " : ""}${esc(c.name)}`;
  const xCls = [acted ? "acted" : "", c.hidden ? "gmhid" : "", isTarget ? "targeted" : "", st.squadPos || ""].filter(Boolean).join(" ");
  const badges = [
    noInit ? "" : `<span class="tp-seal">${Math.round(c.initiative)}</span>`,
    swapOk ? '<span class="tp-swapb"><i class="fa-solid fa-right-left"></i></span>' : "",
    c.hidden && st.gm ? '<span class="tp-hid" aria-label="Hidden"><i class="fa-solid fa-eye-slash"></i></span>' : "",
    hasWaitRx ? '<span class="tp-rxw" aria-label="Waiting Reaction">R?</span>' : "",
    isTarget ? '<span class="tp-tgt" aria-label="Targeted"><i class="fa-solid fa-crosshairs"></i></span>' : ""
  ].join("");
  return `<div class="tp ${current ? "act" : ""} d${d < 0 ? "m" : ""}${Math.abs(d)} ${noInit ? "noinit" : ""} ${c.isDefeated ? "defeated" : ""} ${frozen ? "frozen" : ""} ${swapOk ? "swapok" : ""}${xCls ? ` ${xCls}` : ""}" data-combatant-id="${c.id}"${c.tokenId ? ` data-token-id="${esc(c.tokenId)}"` : ""} style="--tcc:${groupColor(c)}"${tip ? ` aria-label="${tip}"` : ""}>
    <div class="tp-band">${band}</div>
    <div class="tp-por"><img src="${img}" alt="">${badges}</div>
    <div class="tp-name">${esc(c.name)}</div>
    ${pips}${strikes}${htag}${extra}</div>`;
}

/** v0.0.199: why the active creature can't swap now ("" when it can): Swapping Initiative, Core Rules Chapter 2. Pure. */
export function swapBlock({ mine, acted, down, ap, candidates, thawed = false }) {
  if (!mine) return "Only on your own turn";
  if (thawed) return "Already swapped this round: it carries on, it can't swap again";
  if (down) return "Not while Down";
  if (acted) return "Only before you take any Action this turn";
  if (ap < 1) return "It costs 1 AP";
  if (!candidates) return "No ally is left who hasn't had a turn this round";
  return "";
}
let swapping = null;
let lastActId = null;
let busy = false;

/** v0.0.201: the GM sets a creature's movement left this turn (an Evade under way stays an Evade). */
async function setMoveLeft(c) {
  const m = stripMove(c);
  // v0.0.415 (pack CL): the pick window (was a DialogV2)
  const res = await (await import("./pickwindow.mjs")).pickInput({ title: `${c.name}: movement left`, name: "Movement left", sub: c.name, icon: "fa-shoe-prints", confirm: "Set", compact: true,
    fields: [{ key: "n", label: `Squares ${m.evade ? "of Evade" : "of movement"}`, type: "number", value: m.n, min: 0 }] });
  if (!res) return;
  const n = Math.max(0, Math.trunc(Number(res.n)) || 0);
  await c.update(m.evade ? { [`flags.${F}.evadeMove`]: n, [`flags.${F}.freeMove`]: 0, [`flags.${F}.moveLeft`]: 0 } : { [`flags.${F}.freeMove`]: n, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.evadeMove`]: 0 });
  if (n > 0) showRange(c, n);
  else clearRange();
}   // the combatant id that is choosing an ally to swap with (this client only)

function updateScrollChevrons(el) {
  const lst = el?.querySelector?.(".tp-list");
  const prev = el?.querySelector?.(".tc-nav.prev"), next = el?.querySelector?.(".tc-nav.next");
  if (!lst || !prev || !next) return;
  const over = lst.scrollWidth > lst.clientWidth + 4;
  prev.hidden = !over;
  next.hidden = !over;
  if (!over) return;
  prev.disabled = lst.scrollLeft <= 2;
  next.disabled = lst.scrollLeft >= lst.scrollWidth - lst.clientWidth - 2;
}

export function renderCarousel() {
  const combat = game.combat;
  let el = document.getElementById(ID);
  let show = true;
  try { show = game.settings.get("twod12", "carousel"); } catch (e) { /* not registered yet */ }
  if (!combat || !show) {
    clearStripHover();
    el?.remove();
    swapping = null;
    lastActId = null;
    const f = document.getElementById("twod12-apfloat");
    if (f) f.style.display = "none";
    return;
  }
  if (!el) { el = document.createElement("div"); el.id = ID; document.body.append(el); }
  const gm = game.user.isGM, started = combat.started;
  const cur = started ? combat.combatant : null;
  const mine = !!cur?.isOwner;
  let hideDead = false;
  try { hideDead = game.settings.get("twod12", "carouselHideDead"); } catch (e) { /* not registered */ }
  // v0.0.189: a creature added after the combat started may not be in the turn order yet: it is shown at the end until it is.
  const turns = combat.turns?.length ? [...combat.turns] : [];
  for (const c of combat.combatants) if (!turns.includes(c)) turns.push(c);
  const list = turns.filter(c => (gm || !c.hidden) && !(hideDead && c.isDefeated));
  const visIds = new Set(list.map(x => x.id));
  // v0.0.199: Swap on the active plate (Core Rules, Swapping Initiative); while choosing, the allies it can swap with are marked.
  const cands = cur ? swapCandidates(combat, cur).filter(x => gm || visIds.has(x.id)) : [];
  const swapWhy = cur ? swapBlock({ mine: mine || gm, acted: !!cur.getFlag(F, "acted"), down: !!cur.actor?.system?.atZero, ap: getAP(cur), candidates: cands.length, thawed: thawedNow(combat, cur) }) : "Not started";
  if (swapping && (swapping !== cur?.id || swapWhy)) swapping = null;
  const curIdx = cur ? list.findIndex(x => x.id === cur.id) : -1;
  const targetIds = new Set([...(game.user?.targets ?? [])].map(t => t.id));
  const rxActors = waitingRxActors();
  // Squad runs among visible adjacent plates (2+ members sharing a squadKeyOf)
  const sKeys = list.map(c => squadKeyOf(c, list));
  const squadPosAt = i => {
    const k = sKeys[i];
    if (!k) return "";
    const prev = i > 0 && sKeys[i - 1] === k, next = i < sKeys.length - 1 && sKeys[i + 1] === k;
    if (!prev && !next) return "";
    return prev && next ? "sq-mid" : prev ? "sq-end" : "sq-start";
  };
  const baseSt = { swapWhy, swapping: !!swapping, swapIds: new Set(swapping ? cands.map(x => x.id) : []), canAct: mine || gm, gm, curIdx, targetIds, rxActors };
  const btn = (k, icon, label, tip, off = false) => `<button type="button" class="tc-btn" data-tc="${k}"${off ? ` disabled data-tooltip="${tip}"` : label ? "" : ` aria-label="${tip}"`}><i class="fa-solid ${icon}"></i>${label ? ` ${label}` : ""}</button>`;   // v0.0.421 (the audit): off: its reason on hover (C); an icon only: its name
  const unrolled = list.filter(c => c.initiative === null || c.initiative === undefined).length;
  const hasSnap = started && !!turnSnapshot(combat);
  const left = gm ? (started
    ? `${btn("prev", "fa-backward-step", "Previous turn", "Go back one turn")}${btn("reset", "fa-rotate-left", "", hasSnap ? "Reset this turn to how it started" : "No turn snapshot available", !hasSnap)}`
    : btn("init", "fa-dice-d20", unrolled ? `Initiative (${unrolled})` : "Initiative", "Roll initiative for the creatures that haven't rolled (the window says who skips)")) : "";
  // v0.0.397 (Lucas: "Momentum isn't showing in the combat strip"); v0.0.407 (Stage 0 in Foundry): the party's Momentum, 0 to 4, always shown (it is
  // no longer used up when an encounter starts); the GM clicks it: left +1, right -1
  let mom = 0; try { mom = momentumNow(); } catch (e) { mom = 0; }
  const momHtml = ` <span class="tc-mom${gm ? " gm" : ""}" data-tc-mom="1">· Momentum <b>${mom}</b></span>`;
  const middle = swapping
    ? `<span class="tc-round tc-swapmsg"><i class="fa-solid fa-right-left"></i> Pick an ally to swap with <button type="button" class="tc-btn" data-tc="swap">Cancel</button></span>`
    : started ? `<span class="tc-round">Round <b>${combat.round}</b>${momHtml}</span>` : `<span class="tc-round tc-prep">Preparing the encounter${momHtml}</span>`;   // v0.0.405: Momentum shows before the start too
  const moving = cur ? stripMove(cur).n > 0 : false;
  const right = [
    // v0.0.199 (Lucas): End move stays in the bar (greyed when there is nothing to end, so it doesn't come and go); the MOVE row ends it too.
    started && (mine || gm) ? btn("endmove", "fa-flag-checkered", "End move", moving ? "End the movement: the squares left are lost" : "No movement under way", !moving) : "",
    started && (mine || gm) ? btn("next", "fa-forward-step", "Next turn", "End this turn") : "",
    gm && !started ? btn("begin", "fa-play", "Begin", "Begin the combat") : "",
    gm ? `<span class="tc-sep"></span>${btn("end", "fa-power-off", "End", "End the encounter")}` : ""
  ].join("");
  const head = `${left ? `<div class="tc-side left">${left}</div>` : ""}${middle}${right ? `<div class="tc-side right">${right}</div>` : ""}`;
  clearStripHover();
  const oldScroll = el.querySelector(".tp-list")?.scrollLeft ?? 0;
  el.innerHTML = `<div class="tc-head tc-bar">${head}</div><div class="tp-wrap"><button type="button" class="tc-nav prev" aria-label="Scroll left" hidden><i class="fa-solid fa-chevron-left"></i></button><div class="tc-list tp-list">${list.map((c, idx) => card(combat, c, { ...baseSt, idx, squadPos: squadPosAt(idx) })).join("")}</div><button type="button" class="tc-nav next" aria-label="Scroll right" hidden><i class="fa-solid fa-chevron-right"></i></button></div>`;
  el.onmouseleave = () => { clearStripHover(); if (gm) hideApButtons(); };
  el.querySelectorAll(".tp").forEach(div => {
    div.addEventListener("click", async ev => {
      if (ev.target.closest("[data-tc]")) return;
      const c = combat.combatants.get(div.dataset.combatantId);
      // v0.0.199: choosing who to swap with: an ally with the swap badge swaps; anything else cancels.
      if (swapping) {
        const a = cur; swapping = null;
        if (c && a && div.classList.contains("swapok")) { if (busy) return; busy = true; try { return await swapWith(combat, a, c.id); } finally { busy = false; } }
        return renderCarousel();
      }
      // v0.0.190 (Lucas): a creature with no initiative yet (a new encounter, or added later) rolls it when its portrait is clicked.
      if (c && (c.initiative === null || c.initiative === undefined) && (c.isOwner || game.user.isGM)) { combat.rollInitiative([c.id]); return; }
      const tok = c?.token?.object;
      if (tok?.isOwner) tok.control({ releaseOthers: true });
      if (tok) canvas.animatePan({ x: tok.center.x, y: tok.center.y });
    });
    div.addEventListener("dblclick", ev => {
      if (ev.target.closest("[data-tc]")) return;
      const c = combat.combatants.get(div.dataset.combatantId);
      if (c?.actor && (c.isOwner || gm)) c.actor.sheet?.render(true);
    });
    div.addEventListener("mouseenter", () => {
      const c = combat.combatants.get(div.dataset.combatantId);
      const tok = c?.token?.object;
      if (stripHovered && stripHovered !== tok) clearStripHover();
      if (tok && !tok._hover && (gm || tok.visible)) {
        tok._onHoverIn?.({ currentTarget: tok }, { hoverOutOthers: true });
        stripHovered = tok;
      }
      if (gm && started && c && !c.isDefeated) showApButtons(div, combat);
    });
    div.addEventListener("mouseleave", () => {
      const c = combat.combatants.get(div.dataset.combatantId);
      const tok = c?.token?.object;
      if (tok && (tok._hover || tok === stripHovered)) {
        tok._onHoverOut?.({ currentTarget: tok });
        if (tok === stripHovered) stripHovered = null;
      }
      if (gm) hideApButtons();
    });
  });
  el.querySelectorAll("[data-tc]").forEach(b => b.addEventListener("click", async ev => {
    ev.stopPropagation();
    const k = b.dataset.tc, c = b.dataset.id ? combat.combatants.get(b.dataset.id) : null;
    if (k === "swap" && cur) { swapping = swapping ? null : cur.id; return renderCarousel(); }
    if (k === "applus" && c) return setAP(c, getAP(c) + 1, "edited");
    if (k === "apminus" && c) return setAP(c, Math.max(0, getAP(c) - 1), "edited");
    if (busy) return;
    busy = true;
    try {
      if (k === "endmove" && cur) return await endMoveFor(cur.id);
      if (k === "evadeadv" && cur) return await evadeToAdvance(cur.id);
      if (k === "next") return await endTurnFor(combat);
      if (k === "prev") return await combat.previousTurn();
      if (k === "reset") return await resetTurn(combat);
      if (k === "init") return rollPendingInitiative(combat);   // v0.0.273: only the ones still to roll, not left out
      if (k === "begin") return await combat.startCombat();
      if (k === "end") return await combat.endCombat();   // Foundry asks for confirmation itself
    } finally { busy = false; }
  }));
  placeCarousel();
  // v0.0.202: the mouse wheel scrolls the plates sideways when they don't all fit.
  const lst = el.querySelector(".tp-list");
  lst?.addEventListener("wheel", ev => { if (lst.scrollWidth <= lst.clientWidth || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; ev.preventDefault(); lst.scrollLeft += ev.deltaY; }, { passive: false });
  lst?.addEventListener("scroll", () => updateScrollChevrons(el), { passive: true });
  el.querySelector(".tc-nav.prev")?.addEventListener("click", () => lst?.scrollBy?.({ left: -240, behavior: "smooth" }));
  el.querySelector(".tc-nav.next")?.addEventListener("click", () => lst?.scrollBy?.({ left: 240, behavior: "smooth" }));
  // v0.0.205 (Lucas): the new list starts where the old one was scrolled, then glides to the acting plate ONLY when the active combatant changes.
  if (lst) {
    lst.scrollTo?.({ left: oldScroll, behavior: "instant" });
    const actId = cur?.id ?? null;
    const act = lst.querySelector(".tp.act");
    if (act && actId !== lastActId) {
      const goal = Math.max(0, Math.min(lst.scrollWidth - lst.clientWidth, act.offsetLeft - lst.offsetLeft - (lst.clientWidth - act.offsetWidth) / 2));
      if (Math.abs(goal - lst.scrollLeft) > 2) lst.scrollTo?.({ left: goal, behavior: "smooth" });
    }
    lastActId = actId;
    updateScrollChevrons(el);
  }
  // v0.0.201 (Lucas): the GM can set the movement left by hand (right-click the MOVE row).
  // v0.0.407: the GM's Momentum (left +1, right -1)
  const momEl = gm ? el.querySelector("[data-tc-mom]") : null;
  momEl?.addEventListener("click", async ev => { ev.stopPropagation(); await setMomentum(momentumNow() + 1, "set by the GM"); });
  momEl?.addEventListener("contextmenu", async ev => { ev.preventDefault(); ev.stopPropagation(); await setMomentum(momentumNow() - 1, "set by the GM"); });
  if (gm && cur) el.querySelector(".tp-move")?.addEventListener("contextmenu", async ev => { ev.preventDefault(); ev.stopPropagation(); await setMoveLeft(cur); });
}

/** +/- Action Points & Reaction AP for the GM: a small floating bar under the portrait, outside of the strip so the strip does not change size. */
let hideTimer = null;
function ensureFloat() {
  let f = document.getElementById("twod12-apfloat");
  if (!f) {
    f = document.createElement("div"); f.id = "twod12-apfloat";
    f.innerHTML = '<button type="button" data-tc="apminus" aria-label="Remove 1 AP">&minus;</button><span class="af-lbl">AP</span><button type="button" data-tc="applus" aria-label="Add 1 AP">+</button><span class="af-sep"></span><button type="button" data-tc="raptog" aria-label="Toggle Reaction AP">R</button>';
    f.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    f.addEventListener("mouseleave", hideApButtons);
    f.addEventListener("click", async ev => {
      const b = ev.target.closest("[data-tc]"); if (!b) return;
      const c = game.combat?.combatants.get(f.dataset.id); if (!c) return;
      if (b.dataset.tc === "raptog") {
        const curR = getRAP(c), maxR = Math.max(1, rapMaxOf(c));
        await setRAP(c, curR > 0 ? curR - 1 : maxR);
        return;
      }
      await setAP(c, Math.max(0, getAP(c) + (b.dataset.tc === "applus" ? 1 : -1)), "edited");
    });
    document.body.append(f);
  }
  return f;
}
function showApButtons(div, combat) {
  clearTimeout(hideTimer);
  const c = combat?.combatants?.get?.(div.dataset.combatantId);
  const f = ensureFloat(), r = div.getBoundingClientRect();
  f.dataset.id = div.dataset.combatantId;
  const rBtn = f.querySelector('[data-tc="raptog"]');
  if (rBtn && c) rBtn.classList.toggle("on", getRAP(c) > 0);
  f.style.display = "flex";
  const fw = f.offsetWidth || 100;
  const x = Math.max(8, Math.min(window.innerWidth - fw - 8, r.left + r.width / 2 - fw / 2));
  f.style.left = `${x}px`;
  f.style.top = `${r.bottom + 6}px`;
}
function hideApButtons() { clearTimeout(hideTimer); hideTimer = setTimeout(() => { const f = document.getElementById("twod12-apfloat"); if (f) f.style.display = "none"; }, 200); }

/**
 * v0.0.202 (Lucas): the strip fits between the left controls and the sidebar (open or collapsed), so its buttons always show;
 * the plates scroll sideways inside it.
 */
export function placeCarousel() {
  const el = typeof window !== "undefined" ? document.getElementById(ID) : null;
  if (!el?.style) return;
  const sb = document.getElementById("sidebar");
  const sbParts = [sb, document.getElementById("sidebar-tabs"), document.getElementById("sidebar-content")].filter(Boolean);
  const rightCandidates = sbParts.map(x => x.getBoundingClientRect?.()).filter(r => r && r.width > 0 && r.left > window.innerWidth * 0.5).map(r => r.left);
  const right = rightCandidates.length ? Math.min(...rightCandidates) : window.innerWidth;
  // the left column: Foundry's scene controls (the tools under them included), not the players list below
  const ctl = document.getElementById("scene-controls") ?? document.getElementById("controls");
  // v0.0.203 (Lucas): and the scene navigation ("Default Scene"), which sits at the top beside them and covered the strip's left buttons.
  // V14 uses position:fixed on #scene-navigation (offsetParent is null), so check bounding rect + visibility instead.
  const nav = document.getElementById("scene-navigation") ?? document.getElementById("navigation");
  const navVis = nav && getComputedStyle(nav).display !== "none" && getComputedStyle(nav).visibility !== "hidden";
  const navR = navVis ? nav.getBoundingClientRect?.() : null;
  const navEdge = navR && navR.width > 0 && navR.height > 0 && navR.top < 90 && navR.right < window.innerWidth * 0.4 ? navR.right : 0;
  const edge = Math.max(0, navEdge, ...[ctl, ...(ctl?.querySelectorAll?.("menu, ol") ?? [])].map(x => x?.getBoundingClientRect?.().right ?? 0).filter(n => n < window.innerWidth / 3));
  const left = (edge || 90) + 8;
  const w = Math.max(240, right - 8 - left);
  el.style.left = `${left + w / 2}px`;
  el.style.maxWidth = `${w}px`;
  updateScrollChevrons(el);
}

export function registerCarousel() {
  game.settings.register("twod12", "carouselHideDead", { name: "Combat strip: hide defeated creatures", hint: "Hide dead or defeated creatures from the strip. When off, they are shown in grey.", scope: "client", config: true, type: Boolean, default: false, onChange: renderCarousel });
  game.settings.register("twod12", "carousel", { name: "Combat strip with Action Points", hint: "Shows the turn order across the top of the screen with the Action Points of each creature as dots.", scope: "client", config: true, type: Boolean, default: true, onChange: renderCarousel });
  // v0.0.361 (PACK PERF, D30): at most one draw per animation frame, and one more 60 ms after the last change (once Foundry has set the new
  // turn order, v0.0.189); a log line or the old snapshot alone draws nothing (it drew the strip twice per line, on every client)
  const draw = perFrame(renderCarousel);
  let late = null;
  const poke = () => { draw(); clearTimeout(late); late = setTimeout(draw, 60); };
  for (const h of ["createCombat", "updateCombat", "deleteCombat", "createCombatant", "updateCombatant", "deleteCombatant", "combatStart", "combatTurnChange", "canvasReady"]) Hooks.on(h, (doc, ch) => { if (h === "updateCombat" && logOnlyChange(ch)) return; poke(); });
  // v0.0.224: Strike pips, Down state (atZero), Slowed/Frozen ActiveEffects, Token appearance/disposition, and Reaction badges stay in sync.
  Hooks.on("updateActor", (a, ch) => {
    if (!game.combat?.combatants?.some?.(c => c.actor === a)) return;
    if ((ch?.flags?.twod12 && "usage" in ch.flags.twod12) || ch?.system?.damage !== undefined || ch?.system?.atZero !== undefined) poke();
  });
  for (const h of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) Hooks.on(h, ef => {
    const a = ef?.parent;
    if (a && game.combat?.combatants?.some?.(c => c.actor === a)) poke();
  });
  Hooks.on("updateToken", doc => { if (game.combat?.combatants?.some?.(c => c.tokenId === doc.id)) poke(); });
  for (const h of ["createChatMessage", "updateChatMessage"]) Hooks.on(h, msg => { if (msg?.getFlag?.(F, "rx") && game.combat) poke(); });
  Hooks.on("targetToken", (user, token, targeted) => {
    if (user !== game.user) return;
    const plate = document.querySelector(`#twod12-carousel .tp[data-token-id="${CSS.escape(token.id)}"]`);
    if (!plate) return;
    plate.classList.toggle("targeted", !!targeted);
    const por = plate.querySelector(".tp-por");
    if (!por) return;
    const existing = por.querySelector(".tp-tgt");
    if (targeted && !existing) { const sp = document.createElement("span"); sp.className = "tp-tgt"; sp.setAttribute("aria-label", "Targeted"); sp.innerHTML = '<i class="fa-solid fa-crosshairs"></i>'; por.append(sp); }
    else if (!targeted && existing) existing.remove();
  });
  Hooks.on("hoverToken", (token, hovered) => {
    const plate = document.querySelector(`#twod12-carousel .tp[data-token-id="${CSS.escape(token.id)}"]`);
    plate?.classList.toggle("tok-hov", !!hovered);
  });
  window.addEventListener("keydown", ev => { if (ev.key === "Escape" && swapping) { swapping = null; renderCarousel(); } });
  renderCarousel();
  for (const h of ["collapseSidebar", "renderSidebar", "renderSceneControls", "renderSceneNavigation", "collapseSceneNavigation"]) Hooks.on(h, () => { setTimeout(placeCarousel, 0); setTimeout(placeCarousel, 450); });   // again once the sidebar's slide has ended
  // v0.0.205 (Lucas): collapsing the sidebar didn't re-fit the strip; follow its size and its slide.
  const sb = document.getElementById("sidebar");
  if (sb && typeof ResizeObserver !== "undefined") new ResizeObserver(() => placeCarousel()).observe(sb);
  sb?.addEventListener("transitionend", () => placeCarousel());
  window.addEventListener("resize", placeCarousel);
}

