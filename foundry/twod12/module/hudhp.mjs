// v0.0.500 (Lucas on v0.0.499: "Right-click the token should show two entries on the bottom, one blue and one red, for Vigor and Resolve, so you
// can apply damage to each individually"): the Token HUD's bottom box (Foundry's one Health input) becomes two, Vigor (red) and Resolve (blue);
// v0.0.504: two plain boxes, the number only, in Foundry's own Health box (the other buttons stay clickable).
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

/**
 * The Bestiary's rebuild (2026-11-25): a Minion's one box is its ticks. Pure: the damage record for what was typed ("-1" removes a tick, "+1"
 * restores one, "2" sets what is left), never past its ticks; removed ticks count as Vigor Lethal, restored ones come off the record Lethal first.
 * Returns the new { bodyLethal, bodyNonlethal, mindLethal, mindNonlethal }, or null.
 */
export function hudTickChange(text, damage = {}, max = 2) {
  const t = String(text ?? "").trim().replace(/\s+/g, ""), m = t.match(/^([+\-=]?)(\d+)$/);
  if (!m) return null;
  const d = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 };
  for (const k of Object.keys(d)) d[k] = Math.max(0, Number(damage?.[k]) || 0);
  const lost = Object.values(d).reduce((a, b) => a + b, 0), left = Math.max(0, max - lost), n = Number(m[2]);
  const want = Math.max(0, Math.min(max, m[1] === "-" ? left - n : m[1] === "+" ? left + n : n));
  if (want === left) return null;
  if (want < left) { d.bodyLethal += left - want; return d; }
  let heal = want - left;
  for (const k of ["bodyLethal", "mindLethal", "bodyNonlethal", "mindNonlethal"]) { const a = Math.min(d[k], heal); d[k] -= a; heal -= a; }
  return d;
}

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Pure: the two boxes' HTML for an actor's system (its derived bdt, mdt, vigorLeft, resolveLeft). */
export function hudHpHtml(sys = {}) {
  if (sys.isMinion) return `<div class="twod12-hphud"><input type="text" class="twod12-hpbox v" data-twod12-pool="ticks" value="${esc(sys.ticksLeft ?? 0)}" aria-label="Ticks (${esc(sys.ticksLeft ?? 0)} of ${esc(sys.ticksMax ?? 0)}): type -1 to remove a tick, +1 to restore one, or a number to set what is left"></div>`;   // the Bestiary's rebuild: a Minion's ticks
  // v0.0.504 (Lucas on v0.0.503: "do like foundry, just two plain boxes, with the outline red and blue, with the number"): two plain inputs,
  // side by side inside Foundry's Health box (the token's width), no words; their names for screen readers only
  const box = (pool, word, cls, left, max) => `<input type="text" class="twod12-hpbox ${cls}" data-twod12-pool="${pool}" value="${esc(left)}" aria-label="${word} (${esc(left)} of ${esc(max)}): type -5 to deal 5, +5 to heal 5, or a number to set what is left">`;
  return `<div class="twod12-hphud">${box("body", "Vigor", "v", sys.vigorLeft ?? 0, sys.bdt ?? 0)}${box("mind", "Resolve", "r", sys.resolveLeft ?? 0, sys.mdt ?? 0)}</div>`;
}

/** v0.0.531: the z-index given to Foundry's #hud: above the system's HUD bar (`.twod12-hud.floating`, z 60), under every window (z 100 up). */
export const HUD_LAYER_Z = 70;

/** The Token HUD: Foundry's bottom bar input is replaced by the two boxes (a creature with a Vigor or Resolve threshold). */
export function hpHud(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const actor = (app?.document ?? app?.object)?.actor;
  if (!root?.querySelector || !actor || !["character", "npc"].includes(actor.type)) return false;
  const sys = actor.system ?? {};
  if (!(Number(sys.bdt) > 0 || Number(sys.mdt) > 0)) return false;
  // v0.0.501 (Lucas on v0.0.500: the Resolve box and the status palette "appear under the token hud (the one at the bottom, from this system),
  // it should likely appear above windows"): the map's HUD layer (Foundry's #hud) goes above the interface (the system's HUD bar is z 60 in it)
  // and the windows; it lets the mouse through where it has nothing (Foundry's own pointer-events)
  // v0.0.531 (Lucas on v0.0.530: the Token HUD "is showing above every window, including the sheet, the lingering etc"): v0.0.501's z 1000
  // also put it over every window (Foundry's windows start at z 100, in the same stacking context); HUD_LAYER_Z sits between the system's
  // HUD bar (60) and the windows (100+)
  const layer = root.closest?.("#hud") ?? root.parentElement;
  if (layer?.style) layer.style.zIndex = String(HUD_LAYER_Z);
  root.querySelector(".twod12-hphud")?.remove();
  const bar1 = root.querySelector(".attribute.bar1");
  const wrap = document.createElement("div");
  wrap.innerHTML = hudHpHtml(sys);
  const el = wrap.firstElementChild;
  // v0.0.503 (Lucas on v0.0.502: stacked "Now its worse"): the boxes go inside Foundry's own Health box (bar1), which Foundry places under the
  // token, clear of the side columns; its own input stays, hidden (the HUD's form still has it)
  if (bar1) { for (const c of bar1.children) c.style.display = "none"; bar1.classList.add("twod12-hpbar1"); bar1.append(el); }
  else (root.querySelector(".col.middle") ?? root).append(el);
  for (const input of el.querySelectorAll("input[data-twod12-pool]")) {
    input.addEventListener("focus", () => input.select());
    input.addEventListener("keydown", ev => { ev.stopPropagation(); if (ev.key === "Enter") { ev.preventDefault(); input.blur(); } });
    input.addEventListener("change", async ev => {
      ev.stopPropagation();   // v0.0.503: the HUD's own form doesn't submit it
      const pool = input.dataset.twod12Pool, d = actor.system.damage ?? {};
      if (pool === "ticks") {   // the Bestiary's rebuild: a Minion's ticks
        const nd = hudTickChange(input.value, d, Number(actor.system.ticksMax) || 2);
        if (!nd) { input.value = String(actor.system.ticksLeft ?? 0); return; }
        const left = (Number(actor.system.ticksMax) || 2) - Object.values(nd).reduce((a, b) => a + b, 0);
        try { (await import("./damage.mjs")).writeDamage(actor, { ...Object.fromEntries(Object.entries(nd).map(([k, v]) => [`system.damage.${k}`, v])), ...(left === 1 ? {} : { "system.tickBy": "" }) }, {}); }
        catch (e) { console.warn("twod12 | the HUD's ticks box", e); }
        return;
      }
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
