// v0.0.261 (Lucas, cards session 5: Divine Intervention). A Reaction with a moment ("would go Down", system.moment) is offered by itself when the
// moment comes: before a damage that would take a creature to its Health Pool is applied, each creature that has such a Reaction (within its
// range, on the creature's side, the Reaction not spent) is asked, through its owner (a pick window on their client), whether to use it. Yes:
// the Reaction is used on that creature (its card, its R AP, its Frequency, its chain: the Guard) and the damage stops 1 under the Pool.
// Nothing is applied until the answer comes.
import { tokenDistance } from "./light.mjs";
import { isFaded } from "./usage.mjs";
import { answererFor } from "./healwin.mjs";
const SOCKET = "system.twod12";
const pending = new Map();

/** Pure: would this damage (after the Guard) take the creature to its Health Pool? */
export function wouldGoDown(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = (a?.B?.l ?? 0) + (a?.B?.n ?? 0) + (a?.M?.l ?? 0) + (a?.M?.n ?? 0);
  return pool > 0 && incoming > 0 && now < pool && now + incoming >= pool;
}
/** Pure: the damage is cut so the total stops 1 under the Pool (lethal first, then nonlethal); returns what was cut. */
export function capAtPool(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = a.B.l + a.B.n + a.M.l + a.M.n;
  let cut = Math.max(0, now + incoming - (pool - 1)), left = cut;
  for (const [p, k] of [["B", "l"], ["M", "l"], ["B", "n"], ["M", "n"]]) { const take = Math.min(a[p][k], left); a[p][k] -= take; left -= take; if (!left) break; }
  a.momentCut = cut;
  return cut;
}
/** The creatures that could answer for this one: [{ actor, token, item, dist }], nearest first. */
export function momentCandidates(target, moment = "wouldDown") {
  const tt = target?.token?.object ?? target?.getActiveTokens?.()[0] ?? null;
  const side = Number(tt?.document?.disposition ?? 1);
  const out = [];
  for (const tk of canvas?.tokens?.placeables ?? []) {
    const actor = tk.actor;
    if (!actor || tk.document.hidden) continue;
    if (actor.uuid !== target.uuid && Number(tk.document.disposition ?? 0) !== side) continue;
    for (const item of actor.itemTypes?.action ?? []) {
      if (item.system.moment !== moment || !item.system.reaction) continue;
      if (isFaded(actor, item)?.faded) continue;
      const dist = tt && tk !== tt ? tokenDistance(tk, tt) : 0, range = Number(item.system.momentRange) || 0;
      if (range && dist > range) continue;
      out.push({ actor, token: tk, item, dist });
    }
  }
  return out.sort((x, y) => x.dist - y.dist);
}
/** Ask each candidate's owner in turn; true as soon as one uses its Reaction. */
export async function offerMoment(target, moment = "wouldDown", info = {}) {
  if (!globalThis.canvas?.ready || !globalThis.game?.users) return false;
  for (const c of momentCandidates(target, moment)) {
    const data = { moment, actorUuid: c.actor.uuid, itemId: c.item.id, targetUuid: target.uuid, targetName: target.name, incoming: info.incoming ?? 0 };
    const who = answererFor(c.actor);
    const ok = who?.id === game.user.id ? await answerHere(data) : await askRemote(who.id, data);
    if (ok) return true;
  }
  return false;
}
function askRemote(userId, data) {
  const id = foundry.utils.randomID();
  return new Promise(resolve => {
    pending.set(id, resolve);
    game.socket.emit(SOCKET, { ...data, type: "momentAsk", userId, id, from: game.user.id });
  });
}
export function receiveAnswer(data) { const r = pending.get(data.id); if (r) { pending.delete(data.id); r(!!data.ok); } }
/** On the owner's client: the question, then the Reaction used on the creature; answers the asker (through the socket when it is another user). */
export async function answerHere(data) {
  let ok = false;
  try {
    const actor = await fromUuid(data.actorUuid), item = actor?.items?.get(data.itemId), target = await fromUuid(data.targetUuid);
    const tActor = target?.documentName === "Actor" ? target : target?.actor;
    if (actor && item && tActor) {
      const { pickWith } = await import("./pickwindow.mjs");
      const yes = await pickWith({
        title: item.name,
        model: () => ({
          name: item.name, icon: "fa-hand-holding-heart", sub: `${item.system.versions?.[0]?.ap ?? ""}R · ${data.targetName} would go Down`,
          sections: [{ title: "The moment", sub: `${data.targetName} is about to take ${data.incoming} damage and go Down. Use ${item.name}? Confirm uses it; Cancel lets the damage land.`, rows: [] }],
          message: item.system.trigger ? `Interrupt: ${item.system.trigger}` : "", complete: true
        }),
        result: () => true
      });
      if (yes) {
        const tok = tActor.token?.object ?? tActor.getActiveTokens?.()[0] ?? null;
        if (tok) tok.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
        const { useAction } = await import("./actions.mjs");
        ok = (await useAction(actor, item, {})) === true;
      }
    }
  } catch (e) { console.warn("twod12 | moment answer", e); ok = false; }
  if (data.from && data.from !== game.user.id) game.socket.emit(SOCKET, { type: "momentAnswer", userId: data.from, id: data.id, ok });
  return ok;
}
