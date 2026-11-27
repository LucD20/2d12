// v0.0.532 (Lucas, playtest 11: "A target that is 'marked', like by Judge and similar, should have it on the situational tab or something, similar
// to Hiding, so we can remove it manually. And the chat card of these marks should have a 'Apply effect', so we can also do it manually."): the
// HUD's Marks entry. The creature selected sees what it has placed on others, each with a remove (its owner or the GM):
//   - its marks (mark.mjs: the quarry flag, kind "" or "judge", and flags.twod12.marks.<kind>, a Bound Ally), named by their kind, not by a card;
//   - the conditions with a source it gave (an effect on another creature whose origin is it and that carries the "endsWithOrigin" rule: Taunted
//     by, Daunted of, Grabbed by), read from the effect's own data.
// Built like the Hiding entry (hudview.mjs hidingHtml; v0.0.529's frame: a title, then one row a mark, the remove at the row's right end).
// Pure helpers first (the tests load them).
const F = "twod12";

/** Pure: what a mark of this kind is called on its row ("Judged", "Bound Ally", "Marked"). */
export const markLabel = kind => ({ judge: "Judged", bound: "Bound Ally" }[String(kind ?? "").toLowerCase()] ?? "Marked");

/**
 * Pure: the Marks entry's rows. marks: [{ kind, uuid, name }] (the creature's mark flags); conds: [{ actorUuid, effectId, targetName, name }] (the
 * conditions with a source it gave). Returns { rows: [{ key, kind: "mark" | "cond", what, name, ... }], folded } or null when there is none.
 */
export function placedModel({ marks = [], conds = [], folded = false } = {}) {
  const rows = [];
  for (const m of marks ?? []) if (m?.uuid) rows.push({ key: `m:${m.kind ?? ""}`, kind: "mark", markKind: String(m.kind ?? ""), what: markLabel(m.kind), name: m.name || "a creature" });
  for (const c of conds ?? []) if (c?.effectId) rows.push({ key: `c:${c.actorUuid}:${c.effectId}`, kind: "cond", actorUuid: c.actorUuid, effectId: c.effectId, what: String(c.name ?? "Condition"), name: c.targetName || "a creature" });
  return rows.length ? { rows, folded: !!folded } : null;
}

/** Pure: the entry's HTML (hudview.mjs rightHtml draws it in the Situational tab, after Hiding). */
export function placedHtml(m) {
  if (!m) return "";
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const row = r => `<div class="h3-hd-r h3-mk-r"><i class="fa-solid fa-${r.kind === "mark" ? "crosshairs" : "link"} hm" aria-hidden="true"></i><span class="nm">${e(r.name)}</span><span class="hb-btn q h3-hd-st h3-mk-what">${e(r.what)}</span>`
    + `<button type="button" class="h3-hd-x" data-hud="markrm" data-mk="${e(r.key)}" aria-label="${e(`Remove ${r.what} from ${r.name}`)}">✕</button></div>`;
  const head = `<button type="button" class="h h3-hd-fold" data-hud="markfold" aria-expanded="${m.folded ? "false" : "true"}"><b>Marks</b><span class="tg">by you · ${m.rows.length}</span><i class="fa-solid fa-chevron-${m.folded ? "right" : "down"}" aria-hidden="true"></i></button>`;
  return `<div class="h3-si h3-hd h3-mk${m.folded ? " folded" : ""}">${head}${m.folded ? "" : m.rows.map(row).join("")}</div>`;
}

/** The marks this creature holds (its flags) and the conditions with a source it gave, on the scene: the model's inputs. */
export function placedOf(actor) {
  const marks = [];
  const q = actor?.getFlag?.(F, "quarry");
  if (q?.uuid) marks.push({ kind: q.kind ?? "", uuid: q.uuid, name: q.name });
  for (const [kind, m] of Object.entries(actor?.getFlag?.(F, "marks") ?? {})) if (m?.uuid) marks.push({ kind, uuid: m.uuid, name: m.name });
  const conds = [], seen = new Set(), uuid = actor?.uuid ?? "";
  for (const t of globalThis.canvas?.tokens?.placeables ?? []) {
    const a = t?.actor;
    if (!a || seen.has(a.uuid) || a.uuid === uuid) continue;
    seen.add(a.uuid);
    for (const fx of a.effects ?? []) {
      if (fx.disabled || String(fx.origin ?? "") !== uuid || !fx.getFlag?.(F, "endsWithOrigin") || fx.getFlag?.(F, "linkedTo")) continue;
      conds.push({ actorUuid: a.uuid, effectId: fx.id, targetName: t.name, name: String(fx.name ?? "").replace(/\s*\(.*\)\s*$/, "") });
    }
  }
  return { marks, conds };
}

/** Remove one row (the HUD's ✕): a mark from the creature's flags, or a condition from the creature it is on (through the GM when needed); a line in the chat. */
export async function removeMark(actor, key) {
  if (!actor?.isOwner) return ui.notifications.warn(`Only ${actor?.name ?? "its"} player (or the GM) can remove its marks.`);
  const { sysLine } = await import("./sysmsg.mjs");
  const esc = s => foundry.utils.escapeHTML?.(String(s ?? "")) ?? String(s ?? "");
  if (key.startsWith("m:")) {
    const kind = key.slice(2), { setQuarry, markOf } = await import("./mark.mjs"), m = markOf(actor, kind);
    if (!m) return;
    await setQuarry(actor, null, kind);
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(m.name)}</b> is no longer ${markLabel(kind) === "Bound Ally" ? `<b>${esc(actor.name)}</b>'s Bound Ally` : `${markLabel(kind)} by <b>${esc(actor.name)}</b>`} (removed by hand).`, "fxm") });
  }
  const [, actorUuid, effectId] = /^c:(.+):([^:]+)$/.exec(key) ?? [];
  if (!actorUuid || !effectId) return;
  let target = null; try { const d = await fromUuid(actorUuid); target = d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { target = null; }
  const fx = target?.effects?.get?.(effectId);
  if (!fx) return;
  const name = String(fx.name ?? "").replace(/\s*\(.*\)\s*$/, "");
  if (target.isOwner) await fx.delete();
  else game.socket?.emit("system.twod12", { type: "deleteEffect", actorUuid: target.uuid, effectId });
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(target.name)}</b> is no longer ${esc(name)} (from <b>${esc(actor.name)}</b>; removed by hand).`, "fxm") });
}
