// A strip of portraits across the top of the screen while there is a combat (also while it is being prepared):
// turn order, the creature whose turn it is, and its Action Points as dots under the portrait.
import { getAP, setAP, apMax, requestSwap, endTurnFor, swapCandidates } from "./combat.mjs";
import { groupColor } from "./config.mjs";
import { esc } from "./util.mjs";
const F = "twod12", ID = "twod12-carousel";


function card(combat, c) {
  const current = combat.started && combat.combatant?.id === c.id;
  const ap = getAP(c), max = Math.max(apMax(c), ap);
  const frozen = !!c.getFlag(F, "frozen");
  const dots = Array.from({ length: max }, (_, i) => `<i class="dot ${i < ap ? "on" : ""}"></i>`).join("");
  const img = c.token?.texture?.src ?? c.img ?? "icons/svg/mystery-man.svg";
  const init = c.initiative === null || c.initiative === undefined ? "" : `<span class="tc-init">${Math.round(c.initiative)}</span>`;
  return `<div class="tc-card ${current ? "current" : ""} ${c.isDefeated ? "defeated" : ""} ${frozen ? "frozen" : ""}" data-combatant-id="${c.id}" style="--tcc:${groupColor(c)}" data-tooltip="${esc(c.name)}: ${ap} AP${frozen ? " (frozen)" : ""}">
    <div class="tc-portrait"><img src="${img}" alt="">${init}</div>
    <div class="tc-name">${esc(c.name)}</div>
    <div class="tc-ap">${dots}</div></div>`;
}

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
  const list = (combat.turns?.length ? combat.turns : [...combat.combatants]).filter(c => (gm || !c.hidden) && !(hideDead && c.isDefeated));
  const canSwap = started && mine && !cur.getFlag(F, "acted") && getAP(cur) >= 1 && swapCandidates(combat, cur).length > 0;
  const btn = (k, icon, label, tip) => `<button type="button" class="tc-btn" data-tc="${k}" data-tooltip="${tip}"><i class="fa-solid ${icon}"></i>${label ? ` ${label}` : ""}</button>`;
  const left = gm ? (started ? btn("prev", "fa-backward-step", "Previous turn", "Go back one turn") : btn("init", "fa-dice-d20", "Initiative", "Roll initiative for everyone")) : "";
  const middle = started ? `<b>Round ${combat.round}</b>` : '<b class="tc-prep">Preparing the encounter</b>';
  const right = [
    started && canSwap ? btn("swap", "fa-right-left", "Swap", "Swap initiative with an ally (1 AP)") : "",
    started && (mine || gm) ? btn("next", "fa-forward-step", "Next turn", "End this turn") : "",
    gm && !started ? btn("begin", "fa-play", "Begin", "Begin the combat") : "",
    gm ? btn("end", "fa-flag-checkered", "End", "End the encounter") : ""
  ].join("");
  const head = `<div class="tc-side left">${left}</div>${middle}<div class="tc-side right">${right}</div>`;
  const gmBtns = "";
  el.innerHTML = `<div class="tc-head">${head}${gmBtns}</div><div class="tc-list">${list.map(c => card(combat, c)).join("")}</div>`;
  el.querySelectorAll(".tc-card").forEach(div => div.addEventListener("click", ev => {
    if (ev.target.closest("[data-tc]")) return;
    const c = combat.combatants.get(div.dataset.combatantId);
    const tok = c?.token?.object;
    if (tok?.isOwner) tok.control({ releaseOthers: true });
    if (tok) canvas.animatePan({ x: tok.center.x, y: tok.center.y });
  }));
  el.querySelectorAll("[data-tc]").forEach(b => b.addEventListener("click", async ev => {
    ev.stopPropagation();
    const k = b.dataset.tc, c = b.dataset.id ? combat.combatants.get(b.dataset.id) : null;
    if (k === "next") return endTurnFor(combat);
    if (k === "prev") return combat.previousTurn();
    if (k === "swap" && cur) return requestSwap(combat, cur);
    if (k === "init") return combat.rollInitiative(combat.combatants.map(x => x.id));
    if (k === "begin") return combat.startCombat();
    if (k === "end") return combat.endCombat();   // Foundry asks for confirmation itself
    if (k === "applus" && c) return setAP(c, getAP(c) + 1, "edited");
    if (k === "apminus" && c) return setAP(c, Math.max(0, getAP(c) - 1), "edited");
  }));
  el.querySelector(".tc-card.current")?.scrollIntoView?.({ inline: "center", block: "nearest" });
  if (gm) el.querySelectorAll(".tc-card").forEach(div => {
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
  for (const h of ["createCombat", "updateCombat", "deleteCombat", "createCombatant", "updateCombatant", "deleteCombatant", "combatStart", "combatTurnChange", "canvasReady"]) Hooks.on(h, () => renderCarousel());
  renderCarousel();
}
