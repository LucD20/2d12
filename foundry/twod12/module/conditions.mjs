// v0.0.314 (pack AU, the conditions as items; book, Chapter 8): what the new conditions do on the map and in combat.
//   Frightened: the sight check behind its "whileSeen" rule (escalation.mjs effectOff); Dazed: the AP it takes now and at the next regain;
//   Bleed: its damage card at the end of each of the creature's turns; Grabbed: it ends when the holder goes Down.
// The pure parts are in condrules.mjs.
import { setSeenGate } from "./escalation.mjs";
import { dazeSplit, bleedOf, bleedPool, bleedText, needsOrigin, hasBleed } from "./condrules.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./roll.mjs";
import { TWOD12 } from "./config.mjs";
const F = "twod12";
const tokenOf = a => a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null;
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);
const originActor = e => { try { return e?.origin ? actorOf(fromUuidSync(e.origin)) : null; } catch (err) { return null; } };
const fxList = a => (typeof a?.effects?.filter === "function" ? a.effects.filter(() => true) : []);   // a Collection (or a test's stand-in)
const valueOf = e => Math.max(1, Math.trunc(Number(e?.getFlag?.(F, "value"))) || 1);

/**
 * Does the creature see the effect's origin (Clear or Obscured to it, with Line of Effect)? No token on the map for either: yes (the rule works).
 * v0.0.315 (Lucas: "extremely slow when I move"): effectOff asks this for every effect read (Speed, rolls, the sheet...), many times while a token
 * moves; the answer is kept per pair of token positions, forgotten when walls, lights, tokens' statuses or the scene change, and after 2 seconds.
 */
const seenCache = new Map();
let seenBusy = false;
export const forgetSeen = () => seenCache.clear();
async function seesOriginFn() {
  const { perceive } = await import("./senses.mjs");
  const { coverBetween } = await import("./cover.mjs");
  const at = t => { const d = t.document ?? t; return `${d.id}@${d.x},${d.y},${d.elevation ?? 0}`; };
  return (actor, e) => {
    const src = originActor(e), me = tokenOf(actor), them = tokenOf(src);
    if (!src || !me || !them || me === them) return true;
    if (seenBusy) return true;   // asked again from inside the check (the light or the Senses read effects): no loop
    const key = `${at(me)}|${at(them)}`, now = Date.now(), hit = seenCache.get(key);
    if (hit && now - hit.t < 2000) return hit.v;
    seenBusy = true;
    let v = true;
    try { const pv = perceive(me, them, { loe: !coverBetween(me, them)?.noLoE }); v = pv.level === "clear" || pv.level === "obscured"; } finally { seenBusy = false; }
    if (seenCache.size > 500) seenCache.clear();
    seenCache.set(key, { v, t: now });
    return v;
  };
}

/** Dazed N: the AP it takes when it lands (the rest waits for the next regain); with nothing left to take, it ends. */
async function dazeOnApply(effect) {
  const actor = effect.parent;
  if (!actor || effect.disabled || !effect.getFlag(F, "loseAp")) return;
  const C = await import("./combat.mjs");
  const c = game.combat?.started ? C.combatantOf(actor, game.combat) : null;
  const v = valueOf(effect), name = esc(c?.name ?? actor.name);
  if (!c) {
    await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${name}</b> is ${esc(effect.name)}, out of combat: no AP to lose. It ends.`) });
    return effect.delete();
  }
  const { now, rest } = dazeSplit(C.getAP(c), v);
  if (now) await C.setAP(c, C.getAP(c) - now, `${effect.name}`, { kind: "react" });
  await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${name}</b> is ${esc(effect.name)}: loses <b>${now} AP</b> now${rest ? `, and ${rest} from the AP of its next turn` : ""}.`) });
  if (rest) await effect.setFlag(F, "dazeRest", rest);
  else await effect.delete();
}

/** The start of a creature's turn, after it regains AP: a Dazed that still has AP to take takes them, then ends. GM only (combat.mjs startTurn). */
export async function dazeAtTurnStart(c) {
  const actor = c?.actor;
  if (!actor) return;
  const C = await import("./combat.mjs");
  for (const e of fxList(actor).filter(x => Number(x.getFlag?.(F, "dazeRest")) > 0)) {
    const rest = Number(e.getFlag(F, "dazeRest")), have = C.getAP(c), take = Math.min(have, rest);
    if (take) await C.setAP(c, have - take, `${e.name}`, { kind: "react" });
    await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${esc(c.name)}</b>: ${esc(e.name)} takes <b>${take} AP</b> of this turn's AP, then ends.`) });
    await e.delete();
  }
}

/** Bleed: at the end of each of the creature's turns, its damage is rolled on a damage card targeting it (the Damage button applies it). */
export async function bleedAtTurnEnd(actor) {
  const list = fxList(actor).filter(e => !e.disabled).map(e => [e, bleedOf(e)]).filter(([, b]) => b);
  if (!list.length) return;
  const { parseParts, rollParts } = await import("./inline.mjs");
  const tok = tokenOf(actor);
  for (const [e, b] of list) {
    const pool = bleedPool(b.pool, b.attrs);
    const parts = parseParts(`[${pool === "M" ? "R" : "V"}] ${b.dmg}${b.sub ? ` ${b.sub}` : ""}`);
    if (!parts.damage.length) continue;
    const { comps, rolls } = await rollParts(parts.damage, false);
    // v0.0.315 (Lucas: the card was too long): the Save as one short line under the damage (no ↳ box), and no Lethal tag
    const attrs = (b.attrs?.length ? b.attrs : ["body", "instinct"]).map(a => (TWOD12.attributes[a] ?? a).slice(0, 2)).join("/");
    const note = `<i class="fa-solid fa-hand" aria-hidden="true"></i> Ends with Interact (1 AP) and a ${esc(attrs)} Save, DC ${b.dc || 13}.`;
    const { postCcDamage } = await import("./ccdamage.mjs");
    await postCcDamage({ actor: originActor(e), title: bleedText(b), groups: [{ tier: 0, comps, fx: [], riders: [] }], targets: tok ? [{ uuid: tok.document.uuid, name: tok.name, tier: 0, g: 0 }] : [], rolls, originUuid: e.origin ?? "", note, noNl: true });
  }
}

/** Grabbed (and any effect with the "endsWithOrigin" rule): it ends when its origin goes Down or Unconscious. */
export async function endHeldBy(origin) {
  if (!origin?.uuid) return;
  const actors = new Set();
  for (const c of game.combat?.combatants ?? []) if (c.actor) actors.add(c.actor);
  for (const td of canvas?.scene?.tokens ?? []) if (td.actor) actors.add(td.actor);
  for (const a of actors) {
    const ids = fxList(a).filter(e => e.getFlag?.(F, "endsWithOrigin") && e.origin === origin.uuid).map(e => e.id);
    if (!ids.length) continue;
    const names = ids.map(id => a.effects.get(id)?.name).filter(Boolean).join(", ");
    await a.deleteEmbeddedDocuments("ActiveEffect", ids);
    await ChatMessage.create({ content: sysLine("fa-hand", `<b>${esc(a.name)}</b>: ${esc(names)} ends (${esc(origin.name)} is Down).`) });
  }
}

export function registerConditionRules() {
  seesOriginFn().then(setSeenGate).catch(e => console.warn("twod12 | Frightened's sight check", e));
  for (const h of ["createWall", "updateWall", "deleteWall", "createAmbientLight", "updateAmbientLight", "deleteAmbientLight", "updateScene", "canvasReady", "createActiveEffect", "deleteActiveEffect", "updateRegion", "createRegion", "deleteRegion"]) Hooks.on(h, forgetSeen);
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    try {
      if (effect.getFlag(F, "loseAp")) await dazeOnApply(effect);
      if (effect.statuses?.has?.("unconscious") || effect.statuses?.has?.("dead")) await endHeldBy(effect.parent);
    } catch (e) { console.warn("twod12 | conditions", e); }
  });
  // Grabbed ends when its creature ends the Immobilized it brought (Break Free): the linked condition goes, the holder's grip goes with it
  Hooks.on("deleteActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    const pid = effect.getFlag?.(F, "linkedTo"), parent = pid ? effect.parent?.effects?.get?.(pid) : null;
    if (parent?.getFlag?.(F, "endsWithOrigin") && effect.statuses?.has?.("immobilized")) {
      try {
        await parent.delete();
        await ChatMessage.create({ content: sysLine("fa-hand", `<b>${esc(effect.parent.name)}</b> is no longer Immobilized: ${esc(parent.name)} ends.`) });
      } catch (e) { console.warn("twod12 | Grabbed", e); }
    }
  });
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const ended = combat.combatants.get(prior?.combatantId);
    if (ended?.actor) { try { await bleedAtTurnEnd(ended.actor); } catch (e) { console.warn("twod12 | Bleed", e); } }
  });
}

/**
 * v0.0.315 (Lucas): a condition put on from the token's HUD (no Action, so no origin): Frightened, Taunted and Grabbed ask who their origin is (a bar
 * at the bottom: click its token), Bleed asks its damage (a pick window). Resolves { origin: actor uuid | null, over: { bleed } } or null (cancelled).
 */
export async function askApply(item, actor) {
  const out = { origin: null, over: {} };
  const sys = item?.system ?? {};
  if (needsOrigin(sys)) {
    const { pickBar } = await import("./pickbar.mjs");
    const mine = new Set((actor?.getActiveTokens?.() ?? []).map(t => t.id));
    const toks = (canvas?.tokens?.placeables ?? []).filter(t => t.actor && !mine.has(t.id) && t.visible !== false);
    if (!toks.length) { ui.notifications.warn(`${item.name} needs a source: no other token on the map.`); return null; }
    const word = { Frightened: "of whom", Taunted: "by whom", Grabbed: "held by whom" }[item.name] ?? "from whom";
    const id = await pickBar({ icon: "fa-crosshairs", text: `<b>${esc(item.name)}</b> on ${esc(actor?.name ?? "")}: ${word}? Click its token.`, options: toks.map(t => ({ id: t.id, label: t.name, token: t })) });
    if (!id || id === "done") return null;
    out.origin = toks.find(t => t.id === id)?.actor?.uuid ?? null;
  }
  if (hasBleed(sys)) {
    const b = await bleedWindow(item, actor);
    if (!b) return null;
    out.over.bleed = b;
  }
  return out;
}

/** Pure: Bleed's window (the pick window's model) from its state. */
export function bleedModel(st, name = "") {
  const sel = (field, opts, now) => `<select data-field="${field}">${opts.map(([k, l]) => `<option value="${esc(k)}"${k === now ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const subs = [["", "No type"], ...Object.entries(TWOD12.subtypes).filter(([k]) => k)];
  return {
    name: "Bleed", sub: name, icon: "fa-droplet", stats: [["At the end of each turn", bleedText(st)]],
    sections: [
      { title: "Damage", sub: "Rolled at the end of each of its turns (a number or dice).", rows: [],
        html: `<div class="cw-attr bw-row"><span>Bleed</span><input type="text" data-field="dmg" value="${esc(st.dmg)}" placeholder="1d6"> ${sel("sub", subs, st.sub)} <span>Save DC</span><input type="number" min="1" data-field="dc" value="${esc(st.dc)}"></div>` },
      { title: "Save and pool", rows: [
        { key: "attrs", label: "Save", opts: [{ k: "bo/in", l: "Body / Instinct", on: st.attrs.includes("body") }, { k: "mi/ap", l: "Mind / Appeal", on: st.attrs.includes("mind") }] },
        { key: "pool", label: "Pool", opts: [{ k: "", l: "By the Save", on: !st.pool, tip: "Bo/In: Vigor; Mi/Ap: Resolve" }, { k: "B", l: "[V] Vigor", on: st.pool === "B" }, { k: "M", l: "[R] Resolve", on: st.pool === "M" }] }
      ] }
    ],
    complete: !!String(st.dmg ?? "").trim(), message: String(st.dmg ?? "").trim() ? bleedText(st) : "Write the damage.", confirm: "Apply"
  };
}
async function bleedWindow(item, actor) {
  const base = (item.system.settings ?? []).find(x => x.type === "bleed") ?? {};
  const st = { dmg: String(base.dmg ?? "1"), pool: base.dmgPool ?? "", sub: base.dmgSub ?? "", attrs: [...(base.attrs ?? ["body", "instinct"])], dc: Number(base.bleedDc) || 13 };
  if (!globalThis.foundry?.applications?.api?.ApplicationV2) return st;
  const { pickWith } = await import("./pickwindow.mjs");
  return pickWith({
    title: `Bleed: ${actor?.name ?? ""}`,
    model: () => bleedModel(st, actor?.name ?? ""),
    pick: (row, k) => { if (row === "attrs") st.attrs = k === "mi/ap" ? ["mind", "appeal"] : ["body", "instinct"]; if (row === "pool") st.pool = k; },
    input: (field, value) => { if (field === "dmg") st.dmg = String(value).trim(); if (field === "sub") st.sub = value; if (field === "dc") st.dc = Math.max(1, Math.trunc(Number(value)) || 13); },
    result: () => ({ ...st })
  });
}
