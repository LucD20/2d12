// v0.0.261 (Lucas, Covering Shot): "On a Tier 3, the ally takes half of the triggering damage." The triggering damage is rolled after the
// Reaction, so the player clicks Half on that damage card: the attacker carries a hint (flag twod12.halfHint) that lights the Half buttons of
// its next damage card and says why. The hint goes when a damage from it is applied, or at the start of its next turn.
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./roll.mjs";
const F = "twod12", SOCKET = "system.twod12";
/** Pure: does this result (the tier, a Critical) meet a Grant's "On a Tier X" (t1: 1 or more, t2: 2 or more, t3: 3, crit: a Critical, all: any result)? */
export const halfHits = (halfOn, tier = 0, crit = false) => {
  const h = String(halfOn ?? "");
  if (!h) return false;
  if (h === "all") return true;
  if (h === "crit") return !!crit;
  const n = Number(h.slice(1)) || 0;
  return (Number(tier) || 0) >= n;
};
const actorOf = doc => (doc?.documentName === "Actor" ? doc : doc?.actor ?? null);

/** The target (a token or actor uuid) gets the hint, and the chat says it. */
export async function setHalfHint(targetUuid, { source = "", by = "" } = {}) {
  let doc = null; try { doc = await fromUuid(targetUuid); } catch (e) { doc = null; }
  const actor = actorOf(doc);
  if (!actor) return;
  const info = { source, by, at: Date.now() };
  if (actor.isOwner) await actor.setFlag(F, "halfHint", info); else game.socket.emit(SOCKET, { type: "halfHint", actorUuid: actor.uuid, info });
  await ChatMessage.create({ content: sysLine("fa-shield-halved", `<b>${esc(source || "The Reaction")}</b>, Tier 3: the ally takes <b>half</b> of <b>${esc(actor.name)}</b>'s triggering damage (its Half button is lit).`, "fxm") });
}
export async function clearHalfHint(actorUuid) {
  if (!actorUuid) return;
  let doc = null; try { doc = fromUuidSync(actorUuid); } catch (e) { doc = null; }
  const actor = actorOf(doc);
  if (!actor?.getFlag(F, "halfHint")) return;
  if (actor.isOwner) await actor.unsetFlag(F, "halfHint"); else game.socket.emit(SOCKET, { type: "halfHint", actorUuid: actor.uuid, info: null });
}
/** Pure: the damage card's HTML with its Half buttons lit and a line that says why. */
export function lightHalf(root, info) {
  if (!root?.querySelectorAll) return 0;
  let n = 0;
  for (const b of root.querySelectorAll('button[data-twod12="applyHalf"], button[data-factor="0.5"]')) { b.classList.add("hinted"); n++; }
  if (n && !root.querySelector(".halfhint")) {
    const line = root.ownerDocument.createElement("div");
    line.className = "halfhint";
    line.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <span>${esc(info?.source || "The Reaction")}: the ally takes <b>half</b> of this damage.</span>`;
    const first = root.querySelector(".dbtns, .mdall, .mdrows");
    if (first?.parentNode) first.parentNode.insertBefore(line, first); else root.appendChild(line);
  }
  return n;
}
/** Chat hook: a damage card from a creature that carries the hint, made after it, lights its Half buttons. */
export function markHalfHint(msg, html) {
  try {
    const f = msg?.getFlag?.(F, "dmgCard");
    if (!f?.originUuid) return;
    const actor = actorOf(fromUuidSync(f.originUuid)), info = actor?.getFlag?.(F, "halfHint");
    if (!info || (msg.timestamp ?? 0) < (info.at ?? 0)) return;
    const el = html instanceof HTMLElement ? html : html?.[0];
    lightHalf(el, info);
  } catch (e) { /* no hint */ }
}
