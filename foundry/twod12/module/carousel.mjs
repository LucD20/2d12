// A strip of portraits across the top of the screen while there is a combat (also while it is being prepared):
// turn order, the creature whose turn it is, and its Action Points as dots under the portrait.
import { getAP, setAP, apMax, endTurnFor, swapCandidates, swapWith } from "./combat.mjs";
import { stripMove, endMoveFor, evadeToAdvance } from "./move.mjs";
import { groupColor } from "./config.mjs";
import { esc } from "./util.mjs";
const F = "twod12", ID = "twod12-carousel";


/** v0.0.199 (Lucas, mockup "D2. Plates, condensed"): a creature's plate: the band (FOE / ALLY, or ACTING), the round portrait with the
 * initiative seal, the name and the AP pips; the active one also has its movement left and Swap. */
export const DISP_LABEL = { 1: "Ally", 0: "Neutral", "-1": "Foe", "-2": "Secret" };
const dispOf = c => { const d = c.token?.disposition; return d === undefined || d === null ? (c.actor?.type === "character" ? 1 : -1) : d; };
function card(combat, c, st) {
  const current = combat.started && combat.combatant?.id === c.id;
  const ap = getAP(c), max = Math.max(apMax(c), ap, 1);
  const frozen = !!c.getFlag(F, "frozen");
  const pips = Array.from({ length: max }, (_, i) => `<i class="${i < ap ? "on" : ""}"></i>`).join("");
  const img = c.token?.texture?.src ?? c.img ?? "icons/svg/mystery-man.svg";
  const noInit = c.initiative === null || c.initiative === undefined;
  const d = dispOf(c), band = current ? "Acting" : (DISP_LABEL[d] ?? "");
  const swapOk = st.swapIds.has(c.id);
  let extra = "";
  if (current) {
    const m = stripMove(c);
    const move = m.n > 0
      ? `<div class="tp-move${m.evade ? " evade" : ""}" data-tc="endmove" data-tooltip="${m.evade ? "Evade" : "Movement"} left this turn. Click to end it (the squares left are lost)"><span>${m.evade ? "Evade" : "Move"}</span> <b>${m.n}</b> sq${m.evade && st.canAct ? ' <a class="tp-adv" data-tc="evadeadv" data-tooltip="Use the Evade as an Advance (it can trigger Reactions)"><i class="fa-solid fa-person-running"></i></a>' : ""}</div>`
      : `<div class="tp-move none" data-tooltip="No movement left this turn (Advance or drag the token to move)">No move</div>`;
    const swap = `<button type="button" class="tp-swap${st.swapping ? " on" : ""}" data-tc="swap"${st.swapWhy ? ` disabled data-tooltip="${esc(st.swapWhy)}"` : ` data-tooltip="${st.swapping ? "Click an ally with the swap badge, or here to cancel" : "Swap initiative with an ally who hasn't had a turn this round (1 AP)"}"`}><i class="fa-solid fa-right-left"></i> Swap &middot; 1 AP</button>`;
    extra = move + swap;
  }
  const tip = `${noInit ? "Click to roll initiative · " : ""}${swapOk ? "Click to swap with this ally · " : ""}${esc(c.name)}: ${ap} AP${frozen ? " (frozen: it swapped initiative)" : ""}`;
  return `<div class="tp ${current ? "act" : ""} d${d < 0 ? "m" : ""}${Math.abs(d)} ${noInit ? "noinit" : ""} ${c.isDefeated ? "defeated" : ""} ${frozen ? "frozen" : ""} ${swapOk ? "swapok" : ""}" data-combatant-id="${c.id}" style="--tcc:${groupColor(c)}" data-tooltip="${tip}">
    <div class="tp-band">${band}</div>
    <div class="tp-por"><img src="${img}" alt="">${noInit ? "" : `<span class="tp-seal">${Math.round(c.initiative)}</span>`}${swapOk ? '<span class="tp-swapb"><i class="fa-solid fa-right-left"></i></span>' : ""}</div>
    <div class="tp-name">${esc(c.name)}</div>
    <div class="tp-pips">${pips}</div>${extra}</div>`;
}

/** v0.0.199: why the active creature can't swap now ("" when it can): Swapping Initiative, Core Rules Chapter 2. Pure. */
export function swapBlock({ mine, acted, down, ap, candidates }) {
  if (!mine) return "Only on your own turn";
  if (down) return "Not while Down";
  if (acted) return "Only before you take any Action this turn";
  if (ap < 1) return "It costs 1 AP";
  if (!candidates) return "No ally is left who hasn't had a turn this round";
  return "";
}
let swapping = null;   // the combatant id that is choosing an ally to swap with (this client only)

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
  const swapWhy = cur ? swapBlock({ mine: mine || gm, acted: !!cur.getFlag(F, "acted"), down: !!cur.actor?.system?.atZero, ap: getAP(cur), candidates: cands.length }) : "Not started";
  if (swapping && (swapping !== cur?.id || swapWhy)) swapping = null;
  const st = { swapWhy, swapping: !!swapping, swapIds: new Set(swapping ? cands.map(x => x.id) : []), canAct: mine || gm };
  const btn = (k, icon, label, tip, off = false) => `<button type="button" class="tc-btn" data-tc="${k}" data-tooltip="${tip}"${off ? " disabled" : ""}><i class="fa-solid ${icon}"></i>${label ? ` ${label}` : ""}</button>`;
  const left = gm ? (started ? btn("prev", "fa-backward-step", "Previous turn", "Go back one turn") : btn("init", "fa-dice-d20", "Initiative", "Roll initiative for everyone")) : "";
  const middle = started ? `<span class="tc-round">Round <b>${combat.round}</b></span>` : '<span class="tc-round tc-prep">Preparing the encounter</span>';
  const moving = cur ? stripMove(cur).n > 0 : false;
  const right = [
    // v0.0.199 (Lucas): End move stays in the bar (greyed when there is nothing to end, so it doesn't come and go); the MOVE row ends it too.
    started && (mine || gm) ? btn("endmove", "fa-flag-checkered", "End move", moving ? "End the movement: the squares left are lost" : "No movement under way", !moving) : "",
    started && (mine || gm) ? btn("next", "fa-forward-step", "Next turn", "End this turn") : "",
    gm && !started ? btn("begin", "fa-play", "Begin", "Begin the combat") : "",
    gm ? btn("end", "fa-flag-checkered", "End", "End the encounter") : ""
  ].join("");
  const head = `<div class="tc-side left">${left}</div>${middle}<div class="tc-side right">${right}</div>`;
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
    if (k === "init") return combat.rollInitiative(combat.combatants.map(x => x.id));
    if (k === "begin") return combat.startCombat();
    if (k === "end") return combat.endCombat();   // Foundry asks for confirmation itself
    if (k === "applus" && c) return setAP(c, getAP(c) + 1, "edited");
    if (k === "apminus" && c) return setAP(c, Math.max(0, getAP(c) - 1), "edited");
  }));
  el.querySelector(".tp.act")?.scrollIntoView?.({ inline: "center", block: "nearest" });
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
    f.innerHTML = '<button type="button" data-tc="apminus" data-tooltip="Remove 1 AP">&minus;</button><button type="button" data-tc="applus" data-tooltip="Add 1 AP">+</button>';
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

export function registerCarousel() {
  game.settings.register("twod12", "carouselHideDead", { name: "Combat strip: hide defeated creatures", hint: "Hide dead or defeated creatures from the strip. When off, they are shown in grey.", scope: "client", config: true, type: Boolean, default: false, onChange: renderCarousel });
  game.settings.register("twod12", "carousel", { name: "Combat strip with Action Points", hint: "Shows the turn order across the top of the screen with the Action Points of each creature as dots.", scope: "client", config: true, type: Boolean, default: true, onChange: renderCarousel });
  for (const h of ["createCombat", "updateCombat", "deleteCombat", "createCombatant", "updateCombatant", "deleteCombatant", "combatStart", "combatTurnChange", "canvasReady"]) Hooks.on(h, () => { renderCarousel(); setTimeout(renderCarousel, 50); });   // again once Foundry has set the new turn order (v0.0.189)
  renderCarousel();
}
