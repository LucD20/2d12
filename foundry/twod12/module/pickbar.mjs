// v0.0.247 (Lucas, after v0.0.246): a choice made on the map is a bar at the bottom, in the Line bar's look (the Charge and Setup bars), never a Foundry
// window: an icon, a text, one button per option, and Done / Cancel. "Who gains the Guard?" and the Push picker use it; any map picker can.
import { esc } from "./util.mjs";
import * as MAPMARK from "./mapmark.mjs";   // v0.0.461 (the map notes' redesign)
import { askHtml, splitLead, offMap } from "./sitframe.mjs";   // v0.0.529 (the sit-fixed mockup, rule A)

/** v0.0.441 (the HUD mockup, R5): a question that already has a "no" answer (Judge's "Not now") shows no third button "Cancel" (Escape still cancels). */
export const hasNo = o => (o.options ?? []).some(x => /^no$/i.test(String(x.id ?? "")) || /^(no|not now)$/i.test(String(x.label ?? "").trim()));
/** Pure: the bar's HTML. o: { icon, text, options: [{ id, label, tip, cls, mapOnly }], done (the label of the Done button, or "" for none), cancel (label, default "Cancel") }. */
export function pickBarHtml(o) {
  // v0.0.397 (Lucas: "token images only, side by side in squares, like Draw Steel; hover over shows the name"): an option with a picture is a square
  // v0.0.476 (Lucas, checklist v0.0.475: the Ice Pillar's bar showed "Here" eight times): an option with mapOnly is picked on the map only (no button)
  const opts = (o.options ?? []).filter(x => !x.mapOnly).map(x => (x.img
    // v0.0.454 (Lucas, playtest 6, D5 "Proposed A"): its token's number in a corner, the name on a hover (asked by Lucas: t264's list)
    // v0.0.529 (the sit-fixed mockup, rule A): an option that is off (a creature already moved in a Push of several) keeps its place, shown off
    ? `<button type="button" class="lb-opt sq${x.cls ? ` ${esc(x.cls)}` : ""}" data-id="${esc(x.id)}" aria-label="${esc(x.label)}" data-tooltip="${esc(x.label)}"${x.off ? " disabled" : ""}><img src="${esc(x.img)}" alt="">${x.num ? `<b class="lb-num">${esc(x.num)}</b>` : ""}</button>`
    : `<button type="button" class="lb-opt${x.cls ? ` ${esc(x.cls)}` : ""}" data-id="${esc(x.id)}"${x.tip && x.off ? ` data-tooltip="${esc(x.tip)}"` : ""}${x.off ? " disabled" : ""}>${esc(x.label)}</button>`)).join("");
  // v0.0.529 (rule A): the frame: the lead (the text's first <b>) on the title line, the rest the text, the options a row of their own, then Done at
  // the left of the last row and Cancel at its right end (a bar with no Cancel keeps the row)
  const { head, tag, text } = splitLead(o.text ?? "");
  return askHtml({ icon: esc(o.icon ?? "fa-hand-pointer"), head, tag, text, lines: 3, opts: opts || null,
    left: o.done ? `<button type="button" class="lb-go" data-id="__done"><i class="fa-solid fa-check"></i> ${esc(o.done)}</button>` : "",
    give: hasNo(o) || o.cancel === false ? "" : `<button type="button" class="lb-give" data-id="__cancel">${esc(o.cancel ?? "Cancel")}</button>` });
}

/**
 * Show the bar and wait for a click: resolves to the option's id, "done" (the Done button), or null (Cancel, Escape). Enter picks the first option
 * when there is one and no Done button, else Done. The open windows step aside while the bar is up (template.mjs stepAside), as for an area.
 * v0.0.248 (Lucas): an option with a `token` can be picked by clicking that token on the map too; the candidates are outlined in gold meanwhile.
 */
export async function pickBar(o) {
  if (typeof document === "undefined") return o.options?.find?.(x => !x.off)?.id ?? (o.done ? "done" : null);   // no DOM (the tests): the first option (v0.0.529: not one shown off)
  let back = async () => {};
  if (o.aside !== false) { try { back = await (await import("./template.mjs")).stepAside(); } catch (e) { /* nothing to minimize */ } }
  // v0.0.280: an option can be a set of squares too (cells: [{ i, j }]), picked by clicking one of them (Move back's squares)
  const toks = (o.options ?? []).filter(x => (x.token || x.cells?.length) && !x.off);   // v0.0.529: an option shown off is not picked on the map either
  let T = null;
  if (toks.length && globalThis.canvas?.ready) { try { T = await import("./template.mjs"); } catch (e) { T = null; } }
  // v0.0.400 (Lucas: after the first push, the second question floated bare): a click on the map releases the controlled tokens, so the HUD
  // fell back to the party strip; they are controlled again when the bar closes
  // v0.0.402 (Lucas: "Token isn't selected after the push"): held by id, the token looked up fresh (a placeable has no .scene: the old check
  // was always false), selected again when released, after a pick, when the bar closes, and a moment later (Foundry's own release comes last)
  let held = [];
  // v0.0.472 (Lucas, checklist v0.0.471: "my selection locked on orc warrior, clicking on the map didnt remove it"): the selection is held only for a
  // pick made on the map (a token or squares to click); a question with buttons only (Judge's "reduce that damage?") leaves Foundry's selection alone
  try { held = toks.length ? (globalThis.canvas?.tokens?.controlled ?? []).map(t => t.id) : []; } catch (e) { held = []; }
  const reselect = () => { try { for (const id of held) { const t = canvas.tokens?.get?.(id); if (t && !t.destroyed && !t.controlled) t.control?.({ releaseOthers: false }); } } catch (e) { /* gone */ } };
  // v0.0.401 (Lucas: "Don't deselect the token after push"; in target mode he can't select it again): Foundry releases the tokens on the map
  // click's pointer-up, after the pick: while the bar is up (and a moment after) a held token that is released is controlled again at once
  let guard = null;
  // v0.0.403 (Lucas: "it does blink for me as a GM as the token unselects and selects again"): while the bar is up (and a moment after) the token
  // layer's release-all does nothing, so a pick on the map doesn't release the tokens at all; the hook below stays as the fallback
  let unpatch = () => {};
  try {
    const L = globalThis.canvas?.tokens;
    if (held.length && L && typeof L.releaseAll === "function") {
      // a count: the Push asks once a creature, and one question's tail overlaps the next
      if (!L.__twod12Hold) { L.__twod12Orig = L.releaseAll; L.releaseAll = function () { return 0; }; }
      L.__twod12Hold = (L.__twod12Hold || 0) + 1;
      let done = false;
      unpatch = () => { if (done) return; done = true; try { L.__twod12Hold = Math.max(0, (L.__twod12Hold || 1) - 1); if (!L.__twod12Hold && L.__twod12Orig) { L.releaseAll = L.__twod12Orig; delete L.__twod12Orig; } } catch (e) { /* gone */ } };
    }
  } catch (e) { unpatch = () => {}; }
  const keep = (token, on) => { if (on || !held.includes(token?.id)) return; setTimeout(reselect, 0); };
  try { if (held.length && globalThis.Hooks?.on) guard = Hooks.on("controlToken", keep); } catch (e) { guard = null; }
  const res = await new Promise(resolve => {
    const bar = document.createElement("div");
    bar.className = `twod12-linebar twod12-pickbar${o.cls ? ` ${o.cls}` : ""}`;
    bar.innerHTML = pickBarHtml(o);
    // v0.0.376 (PACK STYLE-2, the brief's 5c): with the HUD on screen the question is asked in its middle (it keeps its frame), else at the bottom
    let hud = null;
    try { hud = globalThis.__twod12Hud ?? null; } catch (e) { hud = null; }
    let slot = hud?.hudAskSlot?.() ?? null;
    // v0.0.397 (Lucas: "This should also be in the same area as the granted action"): in the HUD's side panel when a creature's bar is shown
    let side = !!slot?.classList?.contains("hb-ask");
    if (slot) { bar.classList.add("in-hud"); bar.classList.toggle("in-side", side); slot.append(bar); hud.hudAsking(true, side); } else document.body.append(bar);
    // v0.0.463 (Lucas: "As a GM, when the Judge is triggered, if I click on the Paladin's tokens, it shows a small Judge window, and not the hud with
    // the situational tab"): a question asked with no HUD on screen moves into the HUD's Situational section as soon as a token brings the HUD up
    // v0.0.471 (Lucas, checklist v0.0.470: "a very large 'Judge' bar"): asked in the HUD's middle it moves into the Situational tab once a creature's
    // HUD comes up. v0.0.473 (checklist v0.0.472: "I unselected Durgan and selected again and it only expanded the Judge message again"): it keeps
    // following the selection while it is open: a creature's HUD, its Situational tab; none, the HUD's middle (or the bottom with no HUD)
    let dockHook = null;
    const place = (n = 0) => {
      const h = globalThis.__twod12Hud ?? null, sl = h?.hudAskSlot?.() ?? null, sideNow = !!sl?.classList?.contains("hb-ask");
      if (sl && sl.contains(bar)) return;
      if (!sl) { if (n < 6) return setTimeout(() => place(n + 1), 250); if (!bar.isConnected) { bar.classList.remove("in-hud", "in-side"); document.body.append(bar); } return; }
      if (!sideNow && n < 6) return setTimeout(() => place(n + 1), 250);   // the HUD may still be drawing a creature's bar
      if (slot && hud && slot !== sl) { try { hud.hudAsking(false); } catch (e) { /* gone */ } }
      hud = h; slot = sl; side = sideNow;
      bar.classList.add("in-hud"); bar.classList.toggle("in-side", sideNow); sl.append(bar); h.hudAsking(true, sideNow);
    };
    // a new selection: the HUD leaves its "asking" state first, so it can draw the creature's bar, then the question goes where it belongs
    // (v0.0.474: the HUD's redraw carries a question from its middle into the creature's tab itself, hud.mjs; this places one the redraw missed)
    try { dockHook = Hooks.on("controlToken", () => setTimeout(() => place(0), 150)); } catch (e) { dockHook = null; }
    let gfx = null, down = null, move = null, prevInteractive = null, hovered = null, M = null;
    const cellsOf = x => x.cells ?? T.tokenCells(x.token);
    // v0.0.249 (Lucas): feedback before the click: the candidate under the pointer (or whose button is hovered) lights up on the map and in the bar
    // v0.0.461 (the map notes' redesign, Lucas's B): a creature to pick wears the attention mark (the gold ring and its slow ripple) and its number
    // (the same as its picture in the HUD), brighter while hovered; a set of squares (Move back's) keeps the gold fill
    let marks = null, marked = null;   // v0.0.466 (Lucas: "the glowing rings only show when hovering"): null, so the first draw (nothing hovered, key "") draws them
    const draw = () => {
      if (!gfx) return;
      gfx.clear();
      const key = `${hovered?.id ?? ""}`;
      if (marks && marked !== key) { for (const c of marks.removeChildren()) c.destroy?.({ children: true }); marked = null; }
      const gs = canvas.grid?.size ?? 100;
      toks.forEach((x, n) => {
        const cells = cellsOf(x), on = x === hovered;
        if (!x.token || !M) { T.fillCells(gfx, cells, on ? 0xfff0b0 : 0xc9a24a, on ? 0.45 : 0.22); T.outlineCells(gfx, cells, { color: on ? 0xffffff : 0xc9a24a, width: on ? 4 : 3 }); return; }
        if (marked === key) return;
        const i0 = Math.min(...cells.map(c => c.i)), j0 = Math.min(...cells.map(c => c.j)), i1 = Math.max(...cells.map(c => c.i)), j1 = Math.max(...cells.map(c => c.j));
        const w = (j1 - j0 + 1) * gs, h = (i1 - i0 + 1) * gs, c = { x: j0 * gs + w / 2, y: i0 * gs + h / 2 };
        M.attentionRing(marks, c, Math.max(w, h) * 0.62, { hot: on });
        const pin = M.numberPin(x.num ?? n + 1, { fs: Math.max(12, Math.round(gs * 0.16)) }); pin.position.set(c.x + Math.max(w, h) * 0.46, c.y - Math.max(w, h) * 0.46); marks.addChild(pin);
      });
      marked = key;
      bar.querySelectorAll(".lb-opt").forEach(b => b.classList.toggle("hover", !!hovered && b.dataset.id === hovered.id));
    };
    const hover = x => { if (x === hovered) return; hovered = x; draw(); if (gfx) canvas.app.view.style.cursor = x ? "pointer" : ""; };
    if (T) {
      gfx = new PIXI.Graphics();
      MAPMARK.addOnTop(gfx);
      try { M = MAPMARK; marks = new PIXI.Container(); marks.eventMode = "none"; MAPMARK.addOnTop(marks); } catch (e) { M = null; }
      prevInteractive = canvas.tokens.interactiveChildren; canvas.tokens.interactiveChildren = false;
      const at = ev => { const p = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage), c = T.cellAt(p); return toks.find(x => cellsOf(x).some(k => k.i === c.i && k.j === c.j)) ?? null; };
      move = ev => { if (!offMap(ev, canvas.app?.view)) hover(at(ev)); };   // v0.0.530: not while the mouse is on the HUD
      down = ev => { if (ev.button !== 0) return; const hit = at(ev); if (hit) { finish(hit.id); setTimeout(reselect, 0); setTimeout(reselect, 250); } };
      canvas.stage.on("pointermove", move);
      canvas.stage.on("pointerdown", down);
      draw();
    }
    bar.addEventListener("mouseover", ev => { const b = ev.target.closest(".lb-opt"); if (b) hover(toks.find(x => x.id === b.dataset.id) ?? null); });
    bar.addEventListener("mouseleave", () => hover(null));
    const finish = v => {
      bar.remove(); window.removeEventListener("keydown", key, true);
      if (dockHook !== null) { try { Hooks.off("controlToken", dockHook); } catch (e) { /* gone */ } }
      if (slot) hud.hudAsking(false);
      if (gfx) canvas.app.view.style.cursor = "";
      if (move) canvas.stage.off("pointermove", move);
      if (down) canvas.stage.off("pointerdown", down);
      if (prevInteractive !== null) canvas.tokens.interactiveChildren = prevInteractive;
      try { gfx?.destroy(); marks?.destroy({ children: true }); } catch (e) { /* gone */ }
      reselect();
      resolve(v);
    };
    const key = ev => {
      if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); finish(null); }
      if (ev.key === "Enter" && !/input|textarea/i.test(ev.target?.tagName ?? "")) { ev.preventDefault(); finish(o.done ? "done" : (o.options?.find?.(x => !x.mapOnly && !x.off)?.id ?? null)); }   // v0.0.476: never a map-only square
    };
    bar.addEventListener("click", ev => {
      const b = ev.target.closest("button[data-id]");
      if (!b) return;
      ev.preventDefault();
      finish(b.dataset.id === "__cancel" ? null : b.dataset.id === "__done" ? "done" : b.dataset.id);
    });
    window.addEventListener("keydown", key, true);
  });
  await back();
  if (guard !== null) setTimeout(() => { try { Hooks.off("controlToken", guard); } catch (e) { /* gone */ } }, 800);
  setTimeout(reselect, 300);
  setTimeout(unpatch, 400);
  return res;
}
