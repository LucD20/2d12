// A strip of portraits across the top of the screen while there is a combat (also while it is being prepared):
// turn order, the creature whose turn it is, and its Action Points as dots under the portrait.
import { getAP, setAP, apMax, getRAP, slowedOf, endTurnFor, swapCandidates, swapWith, thawedNow, rollPendingInitiative } from "./combat.mjs";
import { stripMove, endMoveFor, evadeToAdvance } from "./move.mjs";
import { groupColor } from "./config.mjs";
import { esc, perFrame, logOnlyChange } from "./util.mjs";
import { strikesUsed } from "./usage.mjs";
import { marksHtml } from "./hudview.mjs";
import { momentumNow, setMomentum } from "./escalation.mjs";
const F = "twod12", ID = "twod12-carousel";


/** v0.0.199 (Lucas, mockup "D2. Plates, condensed"): a creature's plate: the band (FOE / ALLY, or ACTING), the round portrait with the
 * initiative seal, the name and the AP pips; the active one also has its movement left and Swap. */
export const DISP_LABEL = { 1: "Ally", 0: "Neutral", "-1": "Foe", "-2": "Secret" };
const dispOf = c => { const d = c.token?.disposition; return d === undefined || d === null ? (c.actor?.type === "character" ? 1 : -1) : d; };
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
  const pips = `<div class="tp-marks ${pipKind}">${marksHtml({ ap, max: Math.max(apMax(c), 1), slowed, rap, rapMax: 1, strikes: combat.started ? strikesUsed(c.actor) : 0, showStrikes: combat.started })}</div>`;
  // v0.0.224 (Lucas, playtest 3): the 3 Strikes of this turn as three red diamonds; each Strike (not a Linked one) empties one.
  const strikes = "";   // v0.0.390: the Strikes are in the marks
  const htag = "";   // v0.0.453 (Lucas, playtest 6: "Remove the 'Bloodied' 'Dying' from the combat strip"): no state tag under the name
  const img = c.token?.texture?.src ?? c.img ?? "icons/svg/mystery-man.svg";
  const noInit = c.initiative === null || c.initiative === undefined;
  const d = dispOf(c), band = current ? "Acting" : (DISP_LABEL[d] ?? "");
  const swapOk = st.swapIds.has(c.id);
  let extra = "";
  if (current) {
    const m = stripMove(c);
    const move = m.n > 0
      ? `<div class="tp-move${m.evade ? " evade" : ""}" data-tc="endmove"><span>${m.evade ? "Evade" : "Move"}</span> <b>${m.n}</b> sq${m.evade && st.canAct ? ' <a class="tp-adv" data-tc="evadeadv" aria-label="Use the Evade as an Advance (it can trigger Reactions)"><i class="fa-solid fa-person-running"></i></a>' : ""}</div>`
      : `<div class="tp-move none">No move</div>`;
    const swap = `<button type="button" class="tp-swap${st.swapping ? " on" : ""}" data-tc="swap"${st.swapWhy ? ` disabled data-tooltip="${esc(st.swapWhy)}"` : ` aria-label="${st.swapping ? "Click an ally with the swap badge, or here to cancel" : "Swap initiative with an ally who hasn't had a turn this round (1 AP)"}"`}><i class="fa-solid fa-right-left"></i> Swap</button>`;   // v0.0.394: the cost in the tooltip (it was cut off)
    extra = move + swap;
  }
  // v0.0.201 (Lucas): no tooltip on the creature whose turn it is (its plate says it all); the others name themselves.
  const tip = current ? "" : `${noInit ? "Click to roll initiative · " : ""}${swapOk ? "Click to swap with this ally · " : ""}${esc(c.name)}`;
  return `<div class="tp ${current ? "act" : ""} d${d < 0 ? "m" : ""}${Math.abs(d)} ${noInit ? "noinit" : ""} ${c.isDefeated ? "defeated" : ""} ${frozen ? "frozen" : ""} ${swapOk ? "swapok" : ""}" data-combatant-id="${c.id}" style="--tcc:${groupColor(c)}"${tip ? ` aria-label="${tip}"` : ""}>
    <div class="tp-band">${band}</div>
    <div class="tp-por"><img src="${img}" alt="">${noInit ? "" : `<span class="tp-seal">${Math.round(c.initiative)}</span>`}${swapOk ? '<span class="tp-swapb"><i class="fa-solid fa-right-left"></i></span>' : ""}</div>
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

/** v0.0.201: the GM sets a creature's movement left this turn (an Evade under way stays an Evade). */
async function setMoveLeft(c) {
  const m = stripMove(c);
  // v0.0.415 (pack CL): the pick window (was a DialogV2)
  const res = await (await import("./pickwindow.mjs")).pickInput({ title: `${c.name}: movement left`, name: "Movement left", sub: c.name, icon: "fa-shoe-prints", confirm: "Set",
    fields: [{ key: "n", label: `Squares ${m.evade ? "of Evade" : "of movement"}`, type: "number", value: m.n, min: 0 }] });
  if (!res) return;
  const n = Math.max(0, Math.trunc(Number(res.n)) || 0);
  await c.update(m.evade ? { [`flags.${F}.evadeMove`]: n, [`flags.${F}.freeMove`]: 0, [`flags.${F}.moveLeft`]: 0 } : { [`flags.${F}.freeMove`]: n, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.evadeMove`]: 0 });
}   // the combatant id that is choosing an ally to swap with (this client only)

export function renderCarousel() {
  const combat = game.combat;
  let el = document.getElementById(ID);
  let show = true;
  try { show = game.settings.get("twod12", "carousel"); } catch (e) { /* not registered yet */ }
  if (!combat || !show) { el?.remove(); return; }
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
  // v0.0.199: Swap on the active plate (Core Rules, Swapping Initiative); while choosing, the allies it can swap with are marked.
  const cands = cur ? swapCandidates(combat, cur) : [];
  const swapWhy = cur ? swapBlock({ mine: mine || gm, acted: !!cur.getFlag(F, "acted"), down: !!cur.actor?.system?.atZero, ap: getAP(cur), candidates: cands.length, thawed: thawedNow(combat, cur) }) : "Not started";
  if (swapping && (swapping !== cur?.id || swapWhy)) swapping = null;
  const st = { swapWhy, swapping: !!swapping, swapIds: new Set(swapping ? cands.map(x => x.id) : []), canAct: mine || gm, gm };
  const btn = (k, icon, label, tip, off = false) => `<button type="button" class="tc-btn" data-tc="${k}"${off ? ` disabled data-tooltip="${tip}"` : label ? "" : ` aria-label="${tip}"`}><i class="fa-solid ${icon}"></i>${label ? ` ${label}` : ""}</button>`;   // v0.0.421 (the audit): off: its reason on hover (C); an icon only: its name
  const left = gm ? (started ? btn("prev", "fa-backward-step", "Previous turn", "Go back one turn") : btn("init", "fa-dice-d20", "Initiative", "Roll initiative for the creatures that haven't rolled (the window says who skips)")) : "";
  // v0.0.397 (Lucas: "Momentum isn't showing in the combat strip"); v0.0.407 (Stage 0 in Foundry): the party's Momentum, 0 to 4, always shown (it is
  // no longer used up when an encounter starts); the GM clicks it: left +1, right -1
  let mom = 0; try { mom = momentumNow(); } catch (e) { mom = 0; }
  const momHtml = ` <span class="tc-mom${gm ? " gm" : ""}" data-tc-mom="1">· Momentum <b>${mom}</b></span>`;
  const middle = started ? `<span class="tc-round">Round <b>${combat.round}</b>${momHtml}</span>` : `<span class="tc-round tc-prep">Preparing the encounter${momHtml}</span>`;   // v0.0.405: Momentum shows before the start too
  const moving = cur ? stripMove(cur).n > 0 : false;
  const right = [
    // v0.0.199 (Lucas): End move stays in the bar (greyed when there is nothing to end, so it doesn't come and go); the MOVE row ends it too.
    started && (mine || gm) ? btn("endmove", "fa-flag-checkered", "End move", moving ? "End the movement: the squares left are lost" : "No movement under way", !moving) : "",
    started && (mine || gm) ? btn("next", "fa-forward-step", "Next turn", "End this turn") : "",
    gm && !started ? btn("begin", "fa-play", "Begin", "Begin the combat") : "",
    gm ? btn("end", "fa-flag-checkered", "End", "End the encounter") : ""
  ].join("");
  const head = `<div class="tc-side left">${left}</div>${middle}<div class="tc-side right">${right}</div>`;
  const oldScroll = el.querySelector(".tp-list")?.scrollLeft ?? 0;
  el.innerHTML = `<div class="tc-head tc-bar">${head}</div><div class="tc-list tp-list">${list.map(c => card(combat, c, st)).join("")}</div>`;
  el.querySelectorAll(".tp").forEach(div => div.addEventListener("click", ev => {
    if (ev.target.closest("[data-tc]")) return;
    const c = combat.combatants.get(div.dataset.combatantId);
    // v0.0.199: choosing who to swap with: an ally with the swap badge swaps; anything else cancels.
    if (swapping) { const a = cur; swapping = null; if (c && a && div.classList.contains("swapok")) return swapWith(combat, a, c.id); return renderCarousel(); }
    // v0.0.190 (Lucas): a creature with no initiative yet (a new encounter, or added later) rolls it when its portrait is clicked.
    if (c && (c.initiative === null || c.initiative === undefined) && (c.isOwner || game.user.isGM)) { combat.rollInitiative([c.id]); return; }
    const tok = c?.token?.object;
    if (tok?.isOwner) tok.control({ releaseOthers: true });
    if (tok) canvas.animatePan({ x: tok.center.x, y: tok.center.y });
  }));
  el.querySelectorAll("[data-tc]").forEach(b => b.addEventListener("click", async ev => {
    ev.stopPropagation();
    const k = b.dataset.tc, c = b.dataset.id ? combat.combatants.get(b.dataset.id) : null;
    if (k === "endmove" && cur) return endMoveFor(cur.id);
    if (k === "evadeadv" && cur) return evadeToAdvance(cur.id);
    if (k === "next") return endTurnFor(combat);
    if (k === "prev") return combat.previousTurn();
    if (k === "swap" && cur) { swapping = swapping ? null : cur.id; return renderCarousel(); }
    if (k === "init") return rollPendingInitiative(combat);   // v0.0.273: only the ones still to roll, not left out
    if (k === "begin") return combat.startCombat();
    if (k === "end") return combat.endCombat();   // Foundry asks for confirmation itself
    if (k === "applus" && c) return setAP(c, getAP(c) + 1, "edited");
    if (k === "apminus" && c) return setAP(c, Math.max(0, getAP(c) - 1), "edited");
  }));
  placeCarousel();
  // v0.0.202: the mouse wheel scrolls the plates sideways when they don't all fit.
  const lst = el.querySelector(".tp-list");
  lst?.addEventListener("wheel", ev => { if (lst.scrollWidth <= lst.clientWidth || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; ev.preventDefault(); lst.scrollLeft += ev.deltaY; }, { passive: false });
  // v0.0.205 (Lucas): the new list starts where the old one was scrolled, then glides to the acting plate (it used to jump to the left first).
  if (lst) {
    lst.scrollTo?.({ left: oldScroll, behavior: "instant" });
    const act = lst.querySelector(".tp.act");
    if (act) {
      const goal = Math.max(0, Math.min(lst.scrollWidth - lst.clientWidth, act.offsetLeft - lst.offsetLeft - (lst.clientWidth - act.offsetWidth) / 2));
      if (Math.abs(goal - lst.scrollLeft) > 2) lst.scrollTo?.({ left: goal, behavior: "smooth" });
    }
  }
  // v0.0.201 (Lucas): the GM can set the movement left by hand (right-click the MOVE row).
  // v0.0.407: the GM's Momentum (left +1, right -1)
  const momEl = gm ? el.querySelector("[data-tc-mom]") : null;
  momEl?.addEventListener("click", async ev => { ev.stopPropagation(); await setMomentum(momentumNow() + 1, "set by the GM"); });
  momEl?.addEventListener("contextmenu", async ev => { ev.preventDefault(); ev.stopPropagation(); await setMomentum(momentumNow() - 1, "set by the GM"); });
  if (gm && cur) el.querySelector(".tp-move")?.addEventListener("contextmenu", async ev => { ev.preventDefault(); ev.stopPropagation(); await setMoveLeft(cur); });
  if (gm) el.querySelectorAll(".tp").forEach(div => {
    div.addEventListener("mouseenter", () => showApButtons(div, combat));
    div.addEventListener("mouseleave", () => hideApButtons());
  });
}

/** +/- Action Points for the GM: a small floating bar under the portrait, outside of the strip so the strip does not change size. */
let hideTimer = null;
function ensureFloat() {
  let f = document.getElementById("twod12-apfloat");
  if (!f) {
    f = document.createElement("div"); f.id = "twod12-apfloat";
    f.innerHTML = '<button type="button" data-tc="apminus" aria-label="Remove 1 AP">&minus;</button><button type="button" data-tc="applus" aria-label="Add 1 AP">+</button>';
    f.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    f.addEventListener("mouseleave", hideApButtons);
    f.addEventListener("click", async ev => {
      const b = ev.target.closest("[data-tc]"); if (!b) return;
      const c = game.combat?.combatants.get(f.dataset.id); if (!c) return;
      await setAP(c, Math.max(0, getAP(c) + (b.dataset.tc === "applus" ? 1 : -1)), "edited");
    });
    document.body.append(f);
  }
  return f;
}
function showApButtons(div, combat) {
  clearTimeout(hideTimer);
  const f = ensureFloat(), r = div.getBoundingClientRect();
  f.dataset.id = div.dataset.combatantId;
  f.style.display = "flex";
  f.style.left = `${r.left + r.width / 2 - f.offsetWidth / 2}px`;
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
  const right = document.getElementById("sidebar")?.getBoundingClientRect?.().left || window.innerWidth;
  // the left column: Foundry's scene controls (the tools under them included), not the players list below
  const ctl = document.getElementById("scene-controls") ?? document.getElementById("controls");
  // v0.0.203 (Lucas): and the scene navigation ("Default Scene"), which sits at the top beside them and covered the strip's left buttons.
  const nav = document.getElementById("scene-navigation") ?? document.getElementById("navigation");
  const navR = nav?.offsetParent !== null ? nav?.getBoundingClientRect?.() : null;
  const navEdge = navR && navR.width > 0 && navR.top < 90 && navR.right < window.innerWidth * 0.4 ? navR.right : 0;
  const edge = Math.max(0, navEdge, ...[ctl, ...(ctl?.querySelectorAll?.("menu, ol") ?? [])].map(x => x?.getBoundingClientRect?.().right ?? 0).filter(n => n < window.innerWidth / 3));
  const left = (edge || 90) + 8;
  const w = Math.max(240, right - 8 - left);
  el.style.left = `${left + w / 2}px`;
  el.style.maxWidth = `${w}px`;
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
  // v0.0.224: the Strike pips follow the creatures' usage (an actor flag).
  Hooks.on("updateActor", (a, ch) => { if (ch?.flags?.twod12 && "usage" in ch.flags.twod12 && game.combat?.combatants?.some?.(c => c.actor === a)) renderCarousel(); });   // again once Foundry has set the new turn order (v0.0.189)
  renderCarousel();
  for (const h of ["collapseSidebar", "renderSidebar", "renderSceneControls", "renderSceneNavigation", "collapseSceneNavigation"]) Hooks.on(h, () => { setTimeout(placeCarousel, 0); setTimeout(placeCarousel, 450); });   // again once the sidebar's slide has ended
  // v0.0.205 (Lucas): collapsing the sidebar didn't re-fit the strip; follow its size and its slide.
  const sb = document.getElementById("sidebar");
  if (sb && typeof ResizeObserver !== "undefined") new ResizeObserver(() => placeCarousel()).observe(sb);
  sb?.addEventListener("transitionend", () => placeCarousel());
  window.addEventListener("resize", placeCarousel);
}
