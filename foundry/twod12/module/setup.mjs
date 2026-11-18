// Setup: "what happens before the dice are rolled" (see Actions in the rules). Its movement (an Advance or an Evade) is made first, so the roll's range,
// cover and Engaged are read from where the creature ends. The card then shows the Setup without its movement button, because it has been done.
import { esc } from "./util.mjs";
const TAG = /@Move\[([^\]]*)\]/g;

/** The Setup text for a card: once its movement has been made before the roll, the movement button is taken out (the creature already moved). */
export const setupFor = (text, done) => (done
  ? String(text ?? "").replace(/\s*\(\s*@Move\[[^\]]*\]\s*\)/g, "").replace(/@Move\[[^\]]*\]/g, "").replace(/[ \t]{2,}/g, " ").trim()
  : String(text ?? ""));

/** The text of a Setup without its buttons, for a dialog. */
const plainSetup = text => String(text ?? "").replace(/\s*\(\s*@\w+\[[^\]]*\]\s*\)/g, "").replace(/@\w+\[[^\]]*\]/g, "").replace(/[ \t]{2,}/g, " ").trim();

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
    bar.innerHTML = `<i class="fa-solid fa-person-running lb-ic"></i><span class="lb-text"><b>${esc(o.title ?? "Setup")}</b>${txt ? `: ${esc(txt)}` : ""} Move your token, then Continue.</span><button type="button" class="lb-go"><i class="fa-solid fa-dice"></i> Continue</button><button type="button" class="lb-give">Cancel</button>`;
    document.body.append(bar);
    const done = v => { bar.remove(); window.removeEventListener("keydown", key, true); resolve(v); };
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
      pick = await ask({
        title: item.name, text: plainSetup(text),
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
