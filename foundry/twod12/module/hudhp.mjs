// v0.0.500 (Lucas on v0.0.499: "Right-click the token should show two entries on the bottom, one blue and one red, for Vigor and Resolve, so you
// can apply damage to each individually"): the Token HUD's bottom box (Foundry's one Health input) becomes two, Vigor (red) and Resolve (blue).
// Each is a correction of that pool, as the sheet's bars are (no Guard, no Reactions): "-5" adds 5 damage, "+5" heals 5, "12" (or "=12") sets
// what is left to 12. Healing takes the Lethal damage first, then the Nonlethal. Pure helper first (the tests load it).

/**
 * Pure: the new damage of one pool for what was typed. now = { left, lethal, nonlethal } (left: the pool's threshold minus its damage).
 * Returns { lethal, nonlethal }, or null when the text isn't a number or changes nothing.
 */
export function hudHpChange(text, now = {}) {
  const t = String(text ?? "").trim().replace(/\s+/g, "");
  const m = t.match(/^([+\-=]?)(\d+)$/);
  if (!m) return null;
  const n = Number(m[2]), left = Number(now.left) || 0;
  let lethal = Math.max(0, Number(now.lethal) || 0), nonlethal = Math.max(0, Number(now.nonlethal) || 0);
  const delta = m[1] === "-" ? n : m[1] === "+" ? -n : left - n;   // > 0: more damage, < 0: healing
  if (!delta) return null;
  if (delta > 0) lethal += delta;
  else { let heal = -delta; const a = Math.min(lethal, heal); lethal -= a; heal -= a; nonlethal -= Math.min(nonlethal, heal); }
  if (lethal === (Number(now.lethal) || 0) && nonlethal === (Number(now.nonlethal) || 0)) return null;
  return { lethal, nonlethal };
}

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Pure: the two boxes' HTML for an actor's system (its derived bdt, mdt, vigorLeft, resolveLeft). */
export function hudHpHtml(sys = {}) {
  const box = (pool, word, cls, left, max) => `<label class="twod12-hpbox ${cls}"><span class="k">${word}</span><input type="text" data-twod12-pool="${pool}" value="${esc(left)}" aria-label="${word}: type -5 to deal 5, +5 to heal 5, or a number to set what is left"><span class="max">/ ${esc(max)}</span></label>`;
  return `<div class="twod12-hphud">${box("body", "Vigor", "v", sys.vigorLeft ?? 0, sys.bdt ?? 0)}${box("mind", "Resolve", "r", sys.resolveLeft ?? 0, sys.mdt ?? 0)}</div>`;
}

/** The Token HUD: Foundry's bottom bar input is replaced by the two boxes (a creature with a Vigor or Resolve threshold). */
export function hpHud(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const actor = (app?.document ?? app?.object)?.actor;
  if (!root?.querySelector || !actor || !["character", "npc"].includes(actor.type)) return false;
  const sys = actor.system ?? {};
  if (!(Number(sys.bdt) > 0 || Number(sys.mdt) > 0)) return false;
  root.querySelector(".twod12-hphud")?.remove();
  const bar1 = root.querySelector(".attribute.bar1");
  const wrap = document.createElement("div");
  wrap.innerHTML = hudHpHtml(sys);
  const el = wrap.firstElementChild;
  if (bar1) { bar1.style.display = "none"; bar1.after(el); }
  else (root.querySelector(".col.middle") ?? root).append(el);
  for (const input of el.querySelectorAll("input[data-twod12-pool]")) {
    input.addEventListener("focus", () => input.select());
    input.addEventListener("keydown", ev => { ev.stopPropagation(); if (ev.key === "Enter") { ev.preventDefault(); input.blur(); } });
    input.addEventListener("change", async () => {
      const pool = input.dataset.twod12Pool, d = actor.system.damage ?? {};
      const now = { left: pool === "body" ? actor.system.vigorLeft : actor.system.resolveLeft, lethal: d[`${pool}Lethal`], nonlethal: d[`${pool}Nonlethal`] };
      const next = hudHpChange(input.value, now);
      if (!next) { input.value = String(now.left ?? 0); return; }
      try { (await import("./damage.mjs")).writeDamage(actor, { [`system.damage.${pool}Lethal`]: next.lethal, [`system.damage.${pool}Nonlethal`]: next.nonlethal }, {}); }
      catch (e) { console.warn("twod12 | the HUD's Health boxes", e); }
    });
  }
  return true;
}

export function registerHudHp() {
  Hooks.on("renderTokenHUD", (app, html) => { try { hpHud(app, html); } catch (e) { console.warn("twod12 | token HUD Health", e); } });
}
