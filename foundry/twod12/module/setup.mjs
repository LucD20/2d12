// Setup: "what happens before the dice are rolled" (see Actions in the rules). Its movement (an Advance or an Evade) is made first, so the roll's range,
// cover and Engaged are read from where the creature ends. The card then shows the Setup without its movement button, because it has been done.
import { esc } from "./util.mjs";
const TAG = /@Move\[([^\]]*)\]/g;

const MOVE_WORD = { advance: "Advance", walk: "Advance", evade: "Evade", charge: "Charge", pushed: "Pushed", pulled: "Pulled", slid: "Slid", reposition: "Reposition" };
const movePlain = (k, rest, braced) => {
  if (braced) return braced;
  const lbl = /label:([^|\]]+)/i.exec(rest ?? "")?.[1]?.trim();
  if (lbl) return lbl;
  const w = MOVE_WORD[String(k).trim().toLowerCase()] ?? "";
  const d = /distance:([^|\]]+)/i.exec(rest ?? "")?.[1]?.trim();
  return w ? `${w}${d && /^\d+$/.test(d) ? ` ${d}` : ""}` : "";
};
/** The Setup text for a card: once its movement has been made before the roll, the movement button becomes plain text (or is dropped when parenthetical / repeating the preceding verb). */
export const setupFor = (text, done) => (done
  ? String(text ?? "")
      .replace(/\s*\(\s*@Move\[[^\]]*\](?:\{[^}]*\})?\s*\)/g, "")
      .replace(/(\b[A-Za-z]+\s+)?@Move\[([^\]|]*)(?:\|([^\]]*))?\](?:\{([^}]*)\})?/g, (m, prev, k, rest, braced) => {
        const w = MOVE_WORD[String(k).trim().toLowerCase()] ?? "";
        if (prev && w && prev.trim().toLowerCase() === w.toLowerCase()) return prev;
        return `${prev ?? ""}${movePlain(k, rest, braced)}`;
      })
      .replace(/[ \t]{2,}/g, " ").trim()
  : String(text ?? ""));

/** The text of a Setup without its buttons, for a dialog. */
// v0.0.461 (found by the map notes' mockup: Strafe's bar read "You {Advance}."): a tag's label stays as its words ("@Move[...]{Advance}" -> "Advance");
// a movement tag with no label reads as its kind and distance ("@Move[evade|distance:1]" -> "Evade 1"); any other tag goes
export const plainSetup = text => String(text ?? "").replace(/\s*\(\s*@\w+\[[^\]]*\](?:\{[^}]*\})?\s*\)/g, "")
  .replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1")
  .replace(/@Move\[([^\]|]*)(?:\|([^\]]*))?\]/g, (m, k, rest) => movePlain(k, rest, ""))
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
    const done = v => { bar.remove(); try { (globalThis.__twod12Hud ?? hud)?.hudAsking?.(false); } catch (e) { /* gone */ } if (sq) Hooks.off("updateCombatant", watch); window.removeEventListener("keydown", key, true); resolve(v); };
    const key = ev => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); done("cancel"); } if (ev.key === "Enter" && !/input|textarea/i.test(ev.target?.tagName ?? "")) { ev.preventDefault(); done("go"); } };
    bar.querySelector(".lb-go").addEventListener("click", ev => { ev.preventDefault(); done("go"); });
    bar.querySelector(".lb-give").addEventListener("click", ev => { ev.preventDefault(); done("cancel"); });
    window.addEventListener("keydown", key, true);
  });
  await back();
  return pick;
}

/** Pure (pack TALENTS-PT): the squares a Setup's movement has left (the combatant's free or Evade squares). leftOf: (squares) => number, for the tests. */
export function mustLeft(squares, leftOf = null) {
  if (!squares) return 0;
  if (leftOf) return Math.max(0, Number(leftOf(squares)) || 0);
  try { return Math.max(0, Math.round((Number(game.combat?.combatants?.get(squares.cid)?.getFlag("twod12", squares.key)) || 0) * 100) / 100); } catch (e) { return 0; }
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
    // pack TALENTS-PT (Ricochet: "This Advance doesn't count as leaving your square for other cards"): while it is made, the actor carries stillMove
    // (hooks.mjs: no "left its square", no effect ended for leaving it); deps.still for the tests
    const still = deps.still ?? (async on => { try { if (on) await actor.setFlag("twod12", "stillMove", true); else if (actor.getFlag?.("twod12", "stillMove")) await actor.unsetFlag("twod12", "stillMove"); } catch (e) { console.warn("twod12 | still movement", e); } });
    if (cfg.still) await still(true);
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
      // pack TALENTS-PT (book, Chapter 3: a movement you must make: the whole distance): Continue with squares left warns (it doesn't stop: Lucas's
      // "warn, don't block")
      if (pick === "go" && cfg.must && squares) { const left = mustLeft(squares, deps.leftOf); if (left > 0) { const w = `${item.name}: the Setup's movement must be made in full (${left} of ${squares.total} square${squares.total === 1 ? "" : "s"} left). Used anyway.`; try { ui.notifications.warn(w); } catch (e) { /* no UI */ } } }
      await finish();
    } finally { setLog(""); if (cfg.still) { try { await new Promise(r => setTimeout(r, 250)); } catch (e) { /* no timer */ } await still(false); } }   // v0.0.421 (the audit): never left set (an error, a movement not granted); the last drag's moveToken first
    if (pick !== "go") return { ok: false, done };
    done = true;
  }
  return { ok: true, done };
}
