// v0.0.532 (Lucas, playtest 11: "A target that is 'marked', like by Judge and similar, should have it on the situational tab or something, similar
// to Hiding, so we can remove it manually. And the chat card of these marks should have a 'Apply effect', so we can also do it manually."): the
// HUD's Marks entry. The creature selected sees what it has placed on others, each with a remove (its owner or the GM):
//   - its marks (mark.mjs: the quarry flag, kind "" or "judge", and flags.twod12.marks.<kind>, a Bound Ally), named by their kind, not by a card;
//   - the conditions with a source it gave (an effect on another creature whose origin is it and that carries the "endsWithOrigin" rule: Taunted
//     by, Daunted of, Grabbed by), read from the effect's own data.
// Built like the Hiding entry (hudview.mjs hidingHtml; v0.0.529's frame: a title, then one row a mark, the remove at the row's right end).
// v0.0.534 (Lucas on v0.0.533, pt-marks: "add the situational on the target of the mark as well 'Marked by'"): the mirror, "Marked by", on the
// creature that carries them (the same marks and conditions, read the other way: carriedOf), the same model with a direction ("by" / "on") and
// the same removal (removeMark: a carried mark's key names the creature that holds it; a flag on a creature you don't own goes through the GM).
// Pure helpers first (the tests load them).
const F = "twod12";

/** Pure: what a mark of this kind is called on its row ("Judged", "Bound Ally", "Marked"). */
export const markLabel = kind => ({ judge: "Judged", bound: "Bound Ally" }[String(kind ?? "").toLowerCase()] ?? "Marked");

/**
 * Pure: the Marks entry's rows. marks: [{ kind, uuid, name }] (the creature's mark flags); conds: [{ actorUuid, effectId, targetName, name }] (the
 * conditions with a source it gave). Returns { rows: [{ key, kind: "mark" | "cond", what, name, ... }], folded, dir } or null when there is none.
 * v0.0.534: dir "on" (the creature carries them, carriedOf): a mark's row names the creature that placed it (markerUuid, markerName) and its key
 * carries that creature's uuid ("m:<kind>:<markerUuid>"); a condition's row names its source (sourceName). dir "by" (the default) is v0.0.532's.
 */
export function placedModel({ marks = [], conds = [], folded = false, dir = "by" } = {}) {
  const rows = [], on = dir === "on";
  for (const m of marks ?? []) {
    if (!m?.uuid || (on && !m.markerUuid)) continue;
    rows.push({ key: `m:${m.kind ?? ""}${on ? `:${m.markerUuid}` : ""}`, kind: "mark", markKind: String(m.kind ?? ""), what: markLabel(m.kind), name: (on ? m.markerName : m.name) || "a creature" });
  }
  for (const c of conds ?? []) if (c?.effectId) rows.push({ key: `c:${c.actorUuid}:${c.effectId}`, kind: "cond", actorUuid: c.actorUuid, effectId: c.effectId, what: String(c.name ?? "Condition"), name: (on ? c.sourceName : c.targetName) || "a creature" });
  return rows.length ? { rows, folded: !!folded, dir: on ? "on" : "by" } : null;
}

/** Pure: the entry's HTML (hudview.mjs rightHtml draws it in the Situational tab, after Hiding). */
export function placedHtml(m) {
  if (!m) return "";
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const on = m.dir === "on";
  const row = r => `<div class="h3-hd-r h3-mk-r"><i class="fa-solid fa-${r.kind === "mark" ? "crosshairs" : "link"} hm" aria-hidden="true"></i><span class="nm">${e(r.name)}</span><span class="hb-btn q h3-hd-st h3-mk-what">${e(r.what)}</span>`
    + `<button type="button" class="h3-hd-x" data-hud="markrm" data-mk="${e(r.key)}" aria-label="${e(on ? `Remove ${r.what} by ${r.name}` : `Remove ${r.what} from ${r.name}`)}">✕</button></div>`;
  const head = `<button type="button" class="h h3-hd-fold" data-hud="markfold"${on ? ' data-dir="on"' : ""} aria-expanded="${m.folded ? "false" : "true"}"><b>${on ? "Marked by" : "Marks"}</b><span class="tg">${on ? "others" : "by you"} · ${m.rows.length}</span><i class="fa-solid fa-chevron-${m.folded ? "right" : "down"}" aria-hidden="true"></i></button>`;
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

/** The token uuids a creature stands as (its own token, or a linked actor's tokens on the scene): what a mark's flag points at. */
const tokenUuids = actor => new Set((actor?.isToken ? [actor.token] : (actor?.getActiveTokens?.() ?? []).map(t => t.document ?? t)).filter(Boolean).map(d => d.uuid).filter(Boolean));

/**
 * v0.0.534: the mirror of placedOf, the model's inputs for dir "on": the marks other creatures hold on this one (their flags point at one of its
 * tokens) and the conditions with a source on it (the same "endsWithOrigin" rule, the source another creature).
 */
export function carriedOf(actor) {
  const marks = [], conds = [], uuid = actor?.uuid ?? "", mine = tokenUuids(actor);
  const toks = globalThis.canvas?.tokens?.placeables ?? [], seen = new Set();
  const nameOf = u => { const t = toks.find(x => x?.actor?.uuid === u); if (t) return t.name ?? ""; try { return globalThis.fromUuidSync?.(u)?.name ?? ""; } catch (e) { return ""; } };
  if (mine.size) {
    for (const a of [...toks.map(t => t?.actor), ...(globalThis.game?.actors?.contents ?? [])]) {
      if (!a?.uuid || seen.has(a.uuid) || a.uuid === uuid) continue;
      seen.add(a.uuid);
      const q = a.getFlag?.(F, "quarry"), list = [...(q?.uuid ? [{ ...q, kind: q.kind ?? "" }] : []), ...Object.entries(a.getFlag?.(F, "marks") ?? {}).map(([kind, m]) => ({ ...m, kind }))];
      for (const m of list) if (m?.uuid && mine.has(m.uuid)) marks.push({ kind: m.kind, uuid: m.uuid, name: m.name, markerUuid: a.uuid, markerName: nameOf(a.uuid) || a.name });
    }
  }
  for (const fx of actor?.effects ?? []) {
    const o = String(fx.origin ?? "");
    if (fx.disabled || !o || o === uuid || !fx.getFlag?.(F, "endsWithOrigin") || fx.getFlag?.(F, "linkedTo")) continue;
    conds.push({ actorUuid: uuid, effectId: fx.id, sourceName: nameOf(o), name: String(fx.name ?? "").replace(/\s*\(.*\)\s*$/, "") });
  }
  return { marks, conds };
}

/** Pure: a row's key read back: { kind: "mark", markKind, markerUuid ("" = the creature itself) } or { kind: "cond", actorUuid, effectId } or null. */
export function parseMarkKey(key) {
  const k = String(key ?? "");
  let x = /^m:([^:]*)(?::(.+))?$/.exec(k);
  if (x) return { kind: "mark", markKind: x[1], markerUuid: x[2] ?? "" };
  x = /^c:(.+):([^:]+)$/.exec(k);
  return x ? { kind: "cond", actorUuid: x[1], effectId: x[2] } : null;
}

const docActor = async u => { try { const d = await fromUuid(u); return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { return null; } };

/** v0.0.534: the active GM clears a mark held by a creature the user who removed it doesn't own (the socket "clearMark"; damage.mjs). */
export async function clearMarkAsGM(data) {
  const marker = await docActor(data?.markerUuid ?? ""), { setQuarry, markOf } = await import("./mark.mjs");
  if (marker && markOf(marker, data.kind ?? "")?.uuid === data.markUuid) await setQuarry(marker, null, data.kind ?? "");
}

/**
 * Remove one row (the HUD's ✕), from either side: a mark from the flags of the creature that holds it, or a condition from the creature it is on
 * (through the GM when needed); a line in the chat. actor = the creature selected (the one whose entry it is; its owner or the GM).
 */
export async function removeMark(actor, key) {
  if (!actor?.isOwner) return ui.notifications.warn(`Only ${actor?.name ?? "its"} player (or the GM) can remove its marks.`);
  const { sysLine } = await import("./sysmsg.mjs");
  const esc = s => foundry.utils.escapeHTML?.(String(s ?? "")) ?? String(s ?? "");
  const k = parseMarkKey(key);
  if (!k) return;
  if (k.kind === "mark") {
    const kind = k.markKind, marker = k.markerUuid ? await docActor(k.markerUuid) : actor, { setQuarry, markOf } = await import("./mark.mjs"), m = markOf(marker, kind);
    if (!marker || !m) return;
    if (marker.isOwner) await setQuarry(marker, null, kind);
    else game.socket?.emit("system.twod12", { type: "clearMark", markerUuid: marker.uuid, kind, markUuid: m.uuid });
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(m.name)}</b> is no longer ${markLabel(kind) === "Bound Ally" ? `<b>${esc(marker.name)}</b>'s Bound Ally` : `${markLabel(kind)} by <b>${esc(marker.name)}</b>`} (removed by hand).`, "fxm") });
  }
  const { actorUuid, effectId } = k, target = await docActor(actorUuid);
  const fx = target?.effects?.get?.(effectId);
  if (!fx) return;
  const name = String(fx.name ?? "").replace(/\s*\(.*\)\s*$/, "");
  const source = String(fx.origin ?? "") === actor.uuid ? actor : await docActor(String(fx.origin ?? ""));   // v0.0.534: from the carrier's side, the source is the other creature
  if (target.isOwner) await fx.delete();
  else game.socket?.emit("system.twod12", { type: "deleteEffect", actorUuid: target.uuid, effectId });
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(target.name)}</b> is no longer ${esc(name)}${source ? ` (from <b>${esc(source.name)}</b>; removed by hand)` : " (removed by hand)"}.`, "fxm") });
}
