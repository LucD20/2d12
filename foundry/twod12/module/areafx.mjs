// v0.0.327 PACK ZONE: what an area does to the creatures inside, for a Zone (an effect placed on the map: a Region with flags.twod12.zone) and an Aura
// (the squares around its creature), with one set of rows (fxrules.mjs normInside): Carries an Effect (zone.mjs and aura.mjs, as before), Heals,
// Hazard [HT] and Difficult Terrain (here), and a Zone's Ends (the encounter, its origin going Down, "Someone uses an Action").
// Each row has its own Who, judged from the origin's side (a neutral counts as an enemy) and "self" (the origin, or the Aura's creature).
// The rules: Chapter 3 (Areas, Aura, Hazardous Terrain: Entering and Turn share one hit per turn-cycle, Movement once per Movement; Difficult Terrain),
// Chapter 4 (Heal: the creature chooses which damage, the Heal window), Chapter 2 (a duration in rounds counts down at its slot).
import { normInside, rowReaches, htPatterns, evalFormula, refValues, zoneSentence, zoneEndsSentence, plainText, normEnds, zoneRows, htMayHit, entered } from "./fxrules.mjs";
export { zoneRows, htMayHit, entered };
import { tokenCells } from "./template.mjs";
import { allEffects } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
import { auraCells } from "./aura.mjs";
import { tokenDistance } from "./light.mjs";
const F = "twod12";
const key = c => `${c.i},${c.j}`;
const actorOf = uuid => { try { const d = uuid ? fromUuidSync(uuid) : null; return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { return null; } };
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ------------------------------------------------------------------ the areas of a scene */
let cache = null, cacheAt = 0;
/** Every area of the scene with rows that work here: [{ key, kind, name, cells: Set, rows, originUuid, od, bearerId, region }]. Cached a moment (the movement cost asks often). */
export function areasNow(scene = globalThis.canvas?.scene, { fresh = false } = {}) {
  const now = Date.now();
  if (!fresh && cache && cache.scene === scene && now - cacheAt < 400) return cache.list;
  const list = [];
  try {
    for (const r of scene?.regions ?? []) {
      const z = r.getFlag?.(F, "zone");
      if (!z) continue;
      list.push({ key: `z|${r.id}`, kind: "zone", name: z.name ?? "Zone", cells: new Set(z.cells ?? []), rows: zoneRows(z), originUuid: z.originUuid ?? "", od: Number(z.originDisposition ?? 1), region: r, zone: z });
    }
    for (const t of globalThis.canvas?.tokens?.placeables ?? []) {
      if (!t.actor) continue;
      for (const e of allEffects(t.actor)) {
        if (effectOff(t.actor, e)) continue;
        (e.getFlag?.(F, "auras") ?? []).forEach((a, i) => {
          if (!a.rows || !(a.rows.heal?.on || a.rows.ht?.on || a.rows.diff?.on)) return;
          let size = Number(a.size) || 1;
          if (a.formula) { const o = actorOf(e.origin) ?? t.actor; size = Math.max(1, Math.trunc(Number(evalFormula(a.formula, { origin: refValues(o), target: refValues(t.actor) }).value) || 1)); }
          const cells = auraCells(t, size, canvas.grid.size, tokenDistance);
          list.push({ key: `a|${t.actor.uuid}|${e.id}|${i}`, kind: "aura", name: String(e.name ?? "Aura"), cells: new Set(cells.map(c => key(canvas.grid.getOffset(c)))), rows: normInside(a.rows), originUuid: t.actor.uuid, od: Number(t.document.disposition ?? 0), bearerId: t.id });
        });
      }
    }
  } catch (e) { console.warn("twod12 | areas", e); }
  cache = { scene, list }; cacheAt = now;
  return list;
}
export const forgetAreas = () => { cache = null; };
/** Pure: is a token (its cells) in an area? */
export const isIn = (area, cells) => (cells ?? []).some(c => area.cells.has(key(c)));
/** Pure: does a row of this area reach this creature? (its side from the origin's; the origin itself only through "self") */
export const reaches = (area, row, tokenDoc) => rowReaches(row, { originDisposition: area.od, disposition: tokenDoc?.disposition ?? 0, isOrigin: !!tokenDoc?.actor && (tokenDoc.actor.uuid === area.originUuid || tokenDoc.id === area.bearerId) });

/* ------------------------------------------------------------------ Difficult Terrain (one side only: the movement cost asks, per creature) */
/** Are these squares Difficult Terrain for this creature because of an area's Difficult Terrain row? (move.mjs hardStep; Forced Movement doesn't ask) */
export function areaDifficult(tokenDoc, cells) {
  try { return areasNow(tokenDoc?.parent ?? globalThis.canvas?.scene).some(a => a.rows.diff.on && isIn(a, cells) && reaches(a, a.rows.diff, tokenDoc)); } catch (e) { return false; }
}

/* ------------------------------------------------------------------ Heals (the start of each of their turns inside) */
/** The start of a creature's turn: each area it is in heals it once (rolled for it, said in the chat, then its Heal window: Chapter 4). */
export async function healAtTurnStart(combatant) {
  const td = combatant?.token, actor = td?.actor;
  if (!td || !actor) return 0;
  const cells = tokenCells(td);
  let n = 0;
  for (const a of areasNow(td.parent, { fresh: true })) {
    if (!a.rows.heal.on || !isIn(a, cells) || !reaches(a, a.rows.heal, td)) continue;
    const o = actorOf(a.originUuid) ?? actor, f = evalFormula(a.rows.heal.formula, { origin: refValues(o), target: refValues(actor) }, { dice: true });
    if (!f.ok || !String(f.value).trim()) continue;
    const roll = await new Roll(String(f.value)).evaluate();
    try { const { showDice } = await import("./roll.mjs"); await showDice([roll]); } catch (e) { /* no dice */ }
    const { sysLine } = await import("./sysmsg.mjs");
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand-holding-medical", `<b>${esc(a.name)}</b>: <b>${esc(actor.name)}</b> heals <b>${roll.total}</b> (${esc(a.rows.heal.formula)}) at the start of its turn.`, "zoneheal") });
    const { promptHeal } = await import("./healwin.mjs");
    await promptHeal(actor, roll.total, { source: a.name, lead: `${a.name}: ${roll.total} healing` });
    n++;
  }
  return n;
}

/* ------------------------------------------------------------------ Hazard [HT] (Chapter 3) */
async function htHit(area, tokenDoc, pattern) {
  const ht = area.rows.ht, actor = tokenDoc?.actor;
  if (!ht.on || !actor || !htPatterns(ht).includes(pattern) || !reaches(area, ht, tokenDoc)) return false;
  const c = game.combat;
  if (pattern !== "movement" && c?.started) {
    const own = c.turns.findIndex(x => x.tokenId === tokenDoc.id), hits = actor.getFlag(F, "areaHits") ?? {};
    if (!htMayHit(pattern, hits[area.key], { round: c.round, turn: c.turn, own })) return false;
    await actor.setFlag(F, "areaHits", { ...hits, [area.key]: [c.round, c.turn] });
  }
  const origin = actorOf(area.originUuid), vals = { origin: refValues(origin ?? actor), target: refValues(actor) };
  const { rollParts, parseParts } = await import("./inline.mjs");
  const text = ht.list.map(d => { const f = evalFormula(d.dice, vals, { dice: true }); return f.ok && String(f.value).trim() ? `[${d.pool === "M" ? "R" : "V"}] ${f.value}${d.sub ? ` ${d.sub}` : ""}` : ""; }).filter(Boolean).join(" + ");
  if (text) {
    const parts = parseParts(text);
    const { comps, rolls } = await rollParts(parts.damage, false);
    const { postCcDamage } = await import("./ccdamage.mjs");
    await postCcDamage({ actor: origin, title: `${area.name} [HT: ${pattern === "movement" ? "Movement" : pattern === "turn" ? "Turn" : "Entering"}]`, groups: [{ tier: 0, comps, fx: [], riders: [] }], targets: [{ uuid: tokenDoc.uuid, name: tokenDoc.name, tier: 0, g: 0 }], rolls, originUuid: area.originUuid, noNl: true });
  }
  if (ht.gives.on && ht.gives.fx) {   // the Effect it gives keeps its own Ends
    try { const { createEffect, originInfo } = await import("./effects.mjs"); const item = await fromUuid(ht.gives.fx); if (item?.type === "effect") await createEffect(actor, item, originInfo(area.originUuid)); } catch (e) { console.warn("twod12 | HT effect", e); }
  }
  return true;
}
const inside = new Map();   // token id -> Set(area keys) it was in after its last movement (Entering)
async function afterMove(tokenDoc, movement) {
  const dest = movement?.destination, at = dest && Number.isFinite(dest.x) ? { x: dest.x, y: dest.y, width: tokenDoc.width, height: tokenDoc.height, flags: tokenDoc.flags } : tokenDoc;
  const cells = tokenCells(at), list = areasNow(tokenDoc.parent, { fresh: true }).filter(a => a.rows.ht.on && a.bearerId !== tokenDoc.id);
  const before = inside.get(tokenDoc.id) ?? new Set(), now = new Set(list.filter(a => isIn(a, cells)).map(a => a.key));
  inside.set(tokenDoc.id, now);
  for (const k of entered(before, now)) await htHit(list.find(a => a.key === k), tokenDoc, "entering");
  // Movement: each Movement that crosses the area (its start, its end, or the straight line between them)
  const o = movement?.origin;
  if (o && dest) {
    const path = [];
    const steps = Math.max(1, Math.round(Math.hypot(dest.x - o.x, dest.y - o.y) / (canvas.grid.size / 2)));
    for (let s = 0; s <= steps; s++) path.push(...tokenCells({ x: o.x + (dest.x - o.x) * s / steps, y: o.y + (dest.y - o.y) * s / steps, width: tokenDoc.width, height: tokenDoc.height, flags: tokenDoc.flags }));
    for (const a of list) if (htPatterns(a.rows.ht).includes("movement") && isIn(a, path)) await htHit(a, tokenDoc, "movement");
  }
}

/* ------------------------------------------------------------------ a Zone's Ends */
/** The origin went Down (Unconscious, leaving the scene): its Zones with "Origin goes Down" end. */
export async function endZonesOfOrigin(actor) {
  if (!actor || !game.user.isActiveGM) return;
  for (const s of game.scenes ?? []) {
    const gone = (s.regions ?? []).filter(r => { const z = r.getFlag?.(F, "zone"); return z && z.originUuid === actor.uuid && z.ends?.down?.on; }).map(r => r.id);
    if (gone.length) await s.deleteEmbeddedDocuments("Region", gone);
  }
}
/** The encounter ends: the Zones that last "This encounter" end with it. */
export async function endEncounterZones() {
  if (!game.user.isActiveGM) return;
  for (const s of game.scenes ?? []) {
    const gone = (s.regions ?? []).filter(r => { const z = r.getFlag?.(F, "zone"); return z?.ends?.time?.on && z.ends.time.mode === "encounter"; }).map(r => r.id);
    if (gone.length) await s.deleteEmbeddedDocuments("Region", gone);
  }
}
/** The card a Zone posts when it is placed: its sentence, its Ends, and "End it" when someone can end it with an Action. */
export async function postZoneCard(region) {
  const z = region?.getFlag?.(F, "zone");
  if (!z) return;
  const origin = actorOf(z.originUuid), on = z.ends?.someone?.on;
  const ctx = { originName: origin?.name ?? "the origin", names: z.names ?? {} };
  const text = `${esc(plainText(zoneSentence({ ...z, inside: zoneRows(z), src: "here" }, { ...ctx, action: z.area ? { area: z.area } : null })))} ${esc(zoneEndsSentence(z.ends ?? {}, ctx))}`;
  const btn = on ? ` <button type="button" data-twod12="zoneEnd" data-region="${esc(region.uuid)}"><i class="fa-solid fa-hand"></i> End it (${Number(z.ends.someone.ap) || 0} AP)</button>` : "";
  const { sysCard } = await import("./sysmsg.mjs");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: origin ?? undefined }), content: sysCard({ title: `${esc(z.name ?? "Zone")} is placed`, lead: esc(origin?.name ?? ""), text: `${text}${btn}` }) });
}
/** "End it": the origin (or, with "Anyone within Reach of it", a creature within its Reach of a Zone square) pays the AP and ends the Zone. */
export async function zoneEndClick(button) {
  const region = await fromUuid(button?.dataset?.region ?? "");
  const z = region?.getFlag?.(F, "zone");
  if (!z) return ui.notifications.info("That Zone has already ended.");
  const tok = canvas.tokens?.controlled?.[0] ?? null, who = z.ends?.someone?.who ?? "origin", ap = Math.max(0, Number(z.ends?.someone?.ap) || 0);
  if (!game.user.isGM) {
    if (!tok?.actor) return ui.notifications.warn("Select your token first.");
    if (who === "origin" && tok.actor.uuid !== z.originUuid) return ui.notifications.warn(`Only ${actorOf(z.originUuid)?.name ?? "its origin"} can end it.`);
    if (who === "reach") {
      const reach = Math.max(1, Number(tok.actor.system?.reach ?? tok.actor.system?.reachBase) || 1), mine = tokenCells(tok);
      const near = [...new Set(z.cells ?? [])].some(k => { const [i, j] = k.split(",").map(Number); return mine.some(c => Math.max(Math.abs(c.i - i), Math.abs(c.j - j)) <= reach); });
      if (!near && tok.actor.uuid !== z.originUuid) return ui.notifications.warn("Your creature must be within Reach of the Zone.");
    }
  }
  const c = game.combat?.started ? game.combat.combatants.find(x => x.tokenId === tok?.id) : null;
  if (c && ap) {
    const C = await import("./combat.mjs"), have = C.getAP(c);
    if (have < ap) return ui.notifications.warn(`${c.name} has ${have} AP: ending it costs ${ap}.`);
    await C.setAP(c, have - ap, `${z.name ?? "Zone"}: ended`, { kind: "spend" });
  }
  try { await region.delete(); } catch (e) { return ui.notifications.warn("Only the GM can remove it (ask the GM)."); }
  const { sysLine } = await import("./sysmsg.mjs");
  await ChatMessage.create({ content: sysLine("fa-hand", `<b>${esc(tok?.name ?? game.user.name)}</b> ends <b>${esc(z.name ?? "the Zone")}</b>${ap && c ? ` (${ap} AP)` : ""}.`) });
}

/* ------------------------------------------------------------------ hooks */
export function registerAreaHooks() {
  const fresh = () => forgetAreas();
  for (const h of ["createRegion", "deleteRegion", "updateRegion", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect", "canvasReady", "createToken", "deleteToken"]) Hooks.on(h, fresh);
  Hooks.on("updateToken", (doc, ch) => { if ("x" in (ch ?? {}) || "y" in (ch ?? {})) fresh(); });
  Hooks.on("moveToken", async (doc, movement, operation) => {
    if (!game.user.isActiveGM || operation?.twod12Lean) return;
    try { await afterMove(doc, movement); } catch (e) { console.warn("twod12 | area HT", e); }
  });
  // a Zone that appears: the creatures in it count as entering (its HT), and its card goes to the chat
  Hooks.on("createRegion", async region => {
    if (!game.user.isActiveGM || !region.getFlag?.(F, "zone")) return;
    forgetAreas();
    try {
      await postZoneCard(region);
      const a = areasNow(region.parent, { fresh: true }).find(x => x.key === `z|${region.id}`);
      if (a?.rows.ht.on) for (const td of region.parent.tokens ?? []) if (td.actor && isIn(a, tokenCells(td))) { (inside.get(td.id) ?? inside.set(td.id, new Set()).get(td.id)).add(a.key); await htHit(a, td, "entering"); }
    } catch (e) { console.warn("twod12 | Zone placed", e); }
  });
  // Turn: a creature ends its turn in an area
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const td = combat.combatants.get(prior?.combatantId)?.token;
    if (!td?.actor) return;
    try { for (const a of areasNow(td.parent, { fresh: true })) if (a.rows.ht.on && a.bearerId !== td.id && isIn(a, tokenCells(td))) await htHit(a, td, "turn"); } catch (e) { console.warn("twod12 | area HT turn", e); }
  });
  Hooks.on("deleteCombat", () => endEncounterZones().catch(e => console.warn("twod12 | Zones", e)));
}
// The Ends' end-of-turn and turn-start hooks are combat.mjs's (healAtTurnStart) and states.mjs's (endZonesOfOrigin).
export { normEnds };
