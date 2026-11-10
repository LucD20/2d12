// v0.0.340 (Lucas: "let me see how it looks with the buttons aware"): a Tier's button that the Version's "After the damage" chain also does
// (chain:yes, written by tools/cardgen.mjs) shows where the chain is:
//   wait:   the damage isn't applied yet: dimmed, not clickable ("happens by itself once the damage lands");
//   done:   the chain did it: "✓" before it; a click does it again by hand (a redo);
//   manual: the damage was applied but didn't land (no chain): a plain button, to do it by hand.
// The state comes from the damage message the card posted (its rows: applied, chainDone), or, on a card with no roll, from its steps.
const F = "twod12";

/** Pure: the state from the damage messages' rows, or a non-roll card's steps. dmgs: [ccDmg state]; cc: the card's model. */
export function chainStateOf(dmgs, cc = null) {
  if (!dmgs.length && cc?.steps?.length) return (cc.afterDone ?? []).length ? "done" : "wait";
  const rows = dmgs.flatMap(d => d?.rows ?? []);
  if (rows.some(r => r?.applied?.chainDone)) return "done";
  if (rows.length && rows.every(r => r?.applied)) return "manual";
  return "wait";
}
export function chainState(msg) {
  const own = msg?.getFlag?.(F, "ccDmg");
  const dmgs = own ? [own] : (globalThis.game?.messages?.contents ?? []).filter(m => m.getFlag?.(F, "ccDmg")?.srcId === msg?.id).map(m => m.getFlag(F, "ccDmg"));
  return chainStateOf(dmgs, msg?.getFlag?.(F, "cc"));
}
const TIP = { wait: "Happens by itself once the damage is applied and lands", done: "Done by itself after the damage. Click to do it again by hand", manual: "The damage didn't land, so it didn't happen by itself. Click to do it by hand" };
/** Mark a message's chain buttons with their state. */
export function decorateChainChips(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const chips = el?.querySelectorAll?.("a.twod12-inline.chain") ?? [];
  if (!chips.length) return;
  const st = chainState(msg);
  for (const a of chips) {
    a.classList.remove("chain-wait", "chain-done", "chain-manual");
    a.classList.add(`chain-${st}`);
    a.dataset.tooltip = TIP[st];
    a.toggleAttribute("aria-disabled", st === "wait");
    if (st === "done" && !a.querySelector(".chain-ok")) a.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-check chain-ok" aria-hidden="true"></i>');
  }
}
export function registerChainChips() {
  Hooks.on("renderChatMessageHTML", (msg, html) => { try { decorateChainChips(msg, html); } catch (e) { console.warn("twod12 | chain buttons", e); } });
  // a damage message applied: the card it came from shows the new state
  Hooks.on("updateChatMessage", m => { const s = m.getFlag?.(F, "ccDmg"); const src = s?.srcId ? game.messages.get(s.srcId) : null; if (src) { try { ui.chat?.updateMessage?.(src); } catch (e) { /* older API */ } } });
  // a waiting button (on a card, the sheet's preview, the roll window) does nothing yet
  document.addEventListener("click", ev => {
    const a = ev.target?.closest?.("a.twod12-inline.chain");
    if (!a || a.classList.contains("chain-done") || a.classList.contains("chain-manual")) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    ui.notifications.info("This happens by itself once the damage is applied and lands.");
  }, true);
}
