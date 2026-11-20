// Setup: "what happens before the dice are rolled" (see Actions in the rules). Its movement (an Advance or an Evade) is made first, so the roll's range,
// cover and Engaged are read from where the creature ends. The card then shows the Setup without its movement button, because it has been done.
import { esc } from "./util.mjs";
const TAG = /@Move\[([^\]]*)\]/g;

/** The Setup text for a card: once its movement has been made before the roll, the movement button is taken out (the creature already moved). */
export const setupFor = (text, done) => (done
  ? String(text ?? "").replace(/\s*\(\s*@Move\[[^\]]*\]\s*\)/g, "").replace(/@Move\[[^\]]*\]/g, "").replace(/[ \t]{2,}/g, " ").trim()
  : String(text ?? ""));

/** The text of a Setup without its buttons, for a dialog. */
// v0.0.461 (found by the map notes' mockup: Strafe's bar read "You {Advance}."): a tag's label stays as its words ("@Move[...]{Advance}" -> "Advance");
// a movement tag with no label reads as its kind and distance ("@Move[evade|distance:1]" -> "Evade 1"); any other tag goes
const MOVE_WORD = { advance: "Advance", walk: "Advance", evade: "Evade", charge: "Charge", pushed: "Pushed", pulled: "Pulled", slid: "Slid", reposition: "Reposition" };
export const plainSetup = text => String(text ?? "").replace(/\s*\(\s*@\w+\[[^\]]*\](?:\{[^}]*\})?\s*\)/g, "")
  .replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1")
  .replace(/@Move\[([^\]|]*)(?:\|([^\]]*))?\]/g, (m, k, rest) => { const w = MOVE_WORD[String(k).trim().toLowerCase()] ?? ""; const d = /distance:([^|\]]+)/i.exec(rest ?? "")?.[1]?.trim(); return w ? `${w}${d && /^\d+$/.test(d) ? ` ${d}` : ""}` : ""; })
  .replace(/\s*\(\s*@\w+\[[^\]]*\]\s*\)/g, "").replace(/@\w+\[[^\]]*\]/g, "").replace(/[ \t]{2,}/g, " ").trim();

/**
 * Before the roll: make the movement of the Action's Setup. For each @Move (Advance or Evade) tag the movement is granted (its area is shown on the map), the player moves the token
 * and presses Continue, and then the free movement ends. Returns { ok: false } if the player cancels the Action, and { ok: true, done } otherwise (done: a movement was made).
 * `deps` is for tests: { parse, handleMove, finish, dialog }.
 */
/**
 * v0.0.224 (Lucas, playtest 3: Cut Through's Setup was a plain window): the Setup's movement in the bottom bar (the Line and Charge bars'
 * look): what the Setup says, then Continue (make the roll) or Cancel the Action. Returns "go" or "cancel".
 */
export async function setupBar(o) {
  // v0.0.225 (Lucas): the sheets and windows get out of the way of the map while the bar is up, and come back after.
  let back = async () => {};
  try { back = await (await import("./template.mjs")).stepAside(); } catch (e) { /* nothing to minimize */ }
  const pick = await new Promise(resolve => {
    const bar = document.createElement("div");
    bar.className = "twod12-linebar twod12-setupbar";
    const txt = String(o.text ?? "").trim();
    // v0.0.456 (pack SHEETS-HUD's leftover, the HUD mockup's A4: "4 of 6 squares left"): the squares the movement has left, kept up to date
    const sq = o.squares ?? null, leftNow = () => { try { return Math.max(0, Math.round((Number(game.combat?.combatants?.get(sq.cid)?.getFlag("twod12", sq.key)) || 0) * 100) / 100); } catch (e) { return 0; } };
    const leftHtml = () => (sq ? ` <span class="lb-left"><b>${leftNow()}</b> of ${sq.total} square${sq.total === 1 ? "" : "s"} left.</span>` : "");
    bar.innerHTML = `<i class="fa-solid fa-person-running lb-ic"></i><span class="lb-text"><b>${esc(o.title ?? "Setup")}</b>${txt ? `: ${esc(txt)}` : ""} Move your token, then Continue.${leftHtml()}</span><button type="button" class="lb-go fill"><i class="fa-solid fa-dice"></i> Continue: the roll</button><button type="button" class="lb-give">Cancel the Action</button><span class="lb-keys"><kbd>Enter</kbd> Continue \u00b7 <kbd>Esc</kbd> Cancel the Action</span>`;   // v0.0.461 (the map notes, d / h): the filled one first, the key line
    // v0.0.441 (pack SHEETS-HUD, D7: "Strafe's Advance in the HUD's place, not the old floating bar"): in the HUD's Situational section when a
    // creature's bar is on screen, as the pick bar asks; at the bottom of the screen with no HUD
    const hud = globalThis.__twod12Hud ?? null, slot = hud?.hudAskSlot?.() ?? null, side = !!slot?.classList?.contains("hb-ask");
    if (slot) { bar.classList.add("in-hud"); bar.classList.toggle("in-side", side); slot.append(bar); hud.hudAsking(true, side); } else document.body.append(bar);
    const watch = c => { if (sq && c.id === sq.cid) { const el = bar.querySelector(".lb-left b"); if (el) el.textContent = String(leftNow()); } };
    if (sq) Hooks.on("updateCombatant", watch);
    const done = v => { bar.remove(); if (slot) hud.hudAsking(false); if (sq) Hooks.off("updateCombatant", watch); window.removeEventListener("keydown", key, true); resolve(v); };
    const key = ev => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); done("cancel"); } if (ev.key === "Enter" && !/input|textarea/i.test(ev.target?.tagName ?? "")) { ev.preventDefault(); done("go"); } };
    bar.querySelector(".lb-go").addEventListener("click", ev => { ev.preventDefault(); done("go"); });
    bar.querySelector(".lb-give").addEventListener("click", ev => { ev.preventDefault(); done("cancel"); });
    window.addEventListener("keydown", key, true);
  });
  await back();
  return pick;
}

export async function runSetup(actor, item, token, deps = {}) {
  const text = item?.system?.setup;
  const parse = deps.parse ?? (await import("./inline.mjs")).parseInline;
  const moves = [...String(text ?? "").matchAll(TAG)].map(m => parse("Move", m[1])).filter(c => c.kind === "advance" || c.kind === "evade");
  if (!moves.length) return { ok: true, done: false };
  const handleMove = deps.handleMove ?? (await import("./move.mjs")).handleMove;
  const finish = deps.finish ?? (async () => {
    const { endMovement, clearLooseMove } = await import("./move.mjs"), { combatantOf } = await import("./combat.mjs");
    const c = game.combat?.started ? combatantOf(actor, game.combat) : null;
    if (c) await endMovement(c.id); else clearLooseMove();
  });
  const ask = deps.dialog ?? setupBar;
  let done = false;
  for (const cfg of moves) {
    cfg.traits = [...new Set([...(cfg.traits ?? []), "self"])];   // the creature that uses the Action is the one that moves
    if (!deps.dialog) cfg.quiet = true;   // v0.0.224: the bar says it all, no chat line
    const setLog = deps.setLog ?? (await import("./move.mjs")).setSetupLog;   // v0.0.418: the Encounter Log writes the movement inside the Action
    setLog(item.name);
    let granted = false, pick = null;
    try {
      granted = await handleMove(cfg, { actor, token });
      if (!granted) continue;   // it said why (not in combat, Immobilized...): the Action goes on without this movement
      // v0.0.456: the squares this movement gives (the combatant's free or Evade squares, just granted), for the bar's "N of M squares left"
      let squares = null;
      try { const { combatantOf } = await import("./combat.mjs"), c = game.combat?.started ? combatantOf(actor, game.combat) : null, key = cfg.kind === "evade" ? "evadeMove" : "freeMove", total = Number(c?.getFlag?.("twod12", key)) || 0; if (c && total > 0) squares = { cid: c.id, key, total }; } catch (e) { squares = null; }
      pick = await ask({
        title: item.name, text: plainSetup(text), squares,
        window: { title: `${item.name}: Setup` },
        content: `<p>${esc(plainSetup(text))}</p><p>Move your token, then press <b>Continue</b> to make the roll.</p>`,
        buttons: [{ action: "go", label: "Continue", icon: "fa-solid fa-dice", default: true }, { action: "cancel", label: "Cancel the Action", icon: "fa-solid fa-xmark" }],
        rejectClose: false
      });
      await finish();
    } finally { setLog(""); }   // v0.0.421 (the audit): never left set (an error, a movement not granted)
    if (pick !== "go") return { ok: false, done };
    done = true;
  }
  return { ok: true, done };
}
