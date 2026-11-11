// v0.0.347 (Lucas, playtest 4, Step 3 "a quieter chat": "an Action's follow-ups (Guard given, Pushed, not moved) merge into its card"): a line a
// card's button or "After the damage" chain would post goes into that card instead, under a thin line, in the system line's look (icon + text).
// The lines are kept on the message (flags.twod12.follow = [{ icon, html }]) and drawn under its content for everyone; a card you can't update
// (another user's) is updated by the GM. With no card (a button clicked elsewhere), the line is posted as before.
import { sysLine } from "./sysmsg.mjs";
const F = "twod12", SOCKET = "system.twod12";

/** Pure: the follow-up block's HTML (empty when there are none). */
export const followHtml = list => ((list ?? []).length ? `<div class="twod12 chat follow">${list.map(l => `<div class="fl-line"><i class="fa-solid ${l.icon || "fa-circle-info"}"></i><span>${l.html}</span></div>`).join("")}</div>` : "");

const queues = new Map();
/** Adds a line to a message's follow-ups (queued per message: two lines at once both land). */
export async function addFollow(msg, line) {
  if (!msg) return;
  if (!(msg.isOwner || game.user.isGM)) { game.socket.emit(SOCKET, { type: "followUp", msgId: msg.id, line }); return; }
  const prev = queues.get(msg.id) ?? Promise.resolve();
  const next = prev.then(async () => { const cur = msg.getFlag(F, "follow") ?? []; await msg.setFlag(F, "follow", [...cur, line]); }).catch(e => console.warn("twod12 | follow-up", e));
  queues.set(msg.id, next);
  return next;
}

/** A follow-up line: into ctx.message's card when there is one, else its own system line (as before). opts: { speaker, rolls, cls }. */
export async function postFollow(msg, icon, html, opts = {}) {
  const card = msg && game.messages?.get?.(msg.id) ? msg : null;
  if (card) return addFollow(card, { icon, html });
  return ChatMessage.create({ ...(opts.speaker ? { speaker: opts.speaker } : {}), ...(opts.rolls?.length ? { rolls: opts.rolls } : {}), content: sysLine(icon, html, opts.cls ?? "") });
}

/** Chat render: the follow-ups under the message's content. */
export function renderFollow(msg, html) {
  const list = msg?.getFlag?.(F, "follow");
  if (!list?.length) return;
  const el = html instanceof HTMLElement ? html : html?.[0];
  const box = el?.querySelector?.(".message-content") ?? el;
  if (!box || box.querySelector(":scope > .twod12.follow")) return;
  box.insertAdjacentHTML("beforeend", followHtml(list));
}

/** The GM's side of a follow-up from a user who can't update the card. */
export async function onFollowSocket(data) {
  if (data?.type !== "followUp" || !game.user.isActiveGM) return;
  const m = game.messages?.get(data.msgId);
  if (m) await addFollow(m, data.line);
}

/**
 * v0.0.347 (Lucas, playtest 4: "the Damage button could use some feedback"): a roll card whose damage was rolled (a damage card points back to it)
 * shows its Damage button as used ("✓ Damage", muted; still clickable to roll it again).
 */
export const damageRolledFor = msgId => !!msgId && (game.messages?.contents ?? []).some(m => m.getFlag?.(F, "ccDmg")?.srcId === msgId);
export function markDamageButton(el, used) {
  const b = el?.querySelector?.('[data-twod12="rollDamage"]');
  if (!b || !used || b.classList.contains("dmg-used")) return;
  b.classList.add("dmg-used");
  b.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Damage';
  b.dataset.tooltip = "Damage rolled (click to roll it again)";
}
export function renderDamageUsed(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  if (el?.querySelector?.('[data-twod12="rollDamage"]')) markDamageButton(el, damageRolledFor(msg.id));
}
export function registerDamageUsed() {
  Hooks.on("createChatMessage", m => {
    const src = m.getFlag?.(F, "ccDmg")?.srcId;
    if (!src) return;
    for (const el of document.querySelectorAll(`[data-message-id="${src}"]`)) markDamageButton(el, true);
  });
}

/**
 * v0.0.347 (Lucas, playtest 4: "Rally Points abilities should have a Heal button, where the Damage button would be; it does the same as the
 * chip"): an Action card with a Rally chip and no Damage button gets a Heal button in its bottom row; a click is a click on the chip.
 */
export function addHealButton(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const foot = el?.querySelector?.(".cc-foot");
  const chip = el?.querySelector?.('a[data-twod12-inline="Rally"]');
  if (!foot || !chip || foot.querySelector('[data-twod12="rollDamage"], .cc-healproxy')) return;
  const b = document.createElement("button");
  b.type = "button"; b.className = "cc-btn small primary cc-healproxy";
  b.innerHTML = '<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i> Heal';
  b.dataset.tooltip = chip.textContent?.trim() || "Rally Points";
  b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); chip.click(); });
  const card = foot.querySelector('[data-twod12="ccCard"]');
  foot.insertBefore(b, card ?? null);
}
