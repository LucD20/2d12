// v0.0.261 (Lucas, cards session 5: Consecrated Ground). A Zone is a placed area that does something to the creatures in it for as long as it
// lasts: an Effect's "Zone" settings (who: allies, enemies or everyone; an Effect they carry while inside; a heal at the start of each of their
// turns). The settings go on the region the Action keeps on the map (flags.twod12.zone: name, rules, cells, originUuid, originDisposition);
// the creatures inside get the Effect (flag zoneFrom), lose it when they leave or the area ends; the region's rounds count down like an effect's.
import { tokenCells } from "./template.mjs";
import { TWOD12 } from "./config.mjs";
import { logOnlyChange } from "./util.mjs";
import { normZone, normEnds, rowReaches } from "./fxrules.mjs";
import { zoneRows } from "./fxrules.mjs";
const F = "twod12";
const key = c => `${c.i},${c.j}`;
let timer = null, running = false, again = false;
const landing = new Map();   // v0.0.270 (Lucas: the Bane stayed after moving out): where a moving token ends (the movement's destination), read on the next refresh

/** v0.0.327 (PACK ZONE): the Actions that apply an Effect (its uuid in a Version's effects), the first one's card lines, cached: { name, cost, freq, area, dist, more }. */
const placing = new Map();
export async function actionPlacing(uuid) {
  if (!uuid) return null;
  if (placing.has(uuid)) return placing.get(uuid);
  const hits = [];
  const uses = a => (a?.system?.versions ?? []).some(v => Object.values(v.fx ?? {}).some(l => (l ?? []).some(x => x?.uuid === uuid)));
  for (const a of game.items ?? []) if (a.type === "action" && uses(a)) hits.push(a);
  for (const pack of game.packs ?? []) {
    if (pack.documentName !== "Item" || hits.length) continue;
    try { for (const d of await pack.getDocuments({ type: "action" })) if (uses(d)) hits.push(d); } catch (e) { /* not readable */ }
  }
  const a = hits[0], sy = a?.system ?? {};
  const aps = [...new Set((sy.versions ?? []).map(v => Number(v.ap) || 0))].sort((x, y) => x - y);
  const info = a ? { name: a.name, cost: aps.length ? `${aps.join("/")}${sy.reaction ? "R" : " AP"}` : "", freq: TWOD12.frequencies?.[sy.frequency] ?? "", area: String(sy.area ?? "").trim(), dist: String(sy.areaDistance ?? "").trim() || (/^\d+$/.test(String(sy.distance ?? "")) ? `${sy.distance} sq.` : String(sy.distance ?? "")), more: hits.length - 1, doc: a } : null;
  placing.set(uuid, info);
  return info;
}
/**
 * v0.0.329 (Lucas: "effects can't be placed on the map"): place an Effect whose Where is "On the map" (its sheet's Place on the map, or the Effect
 * dropped on the map). From the Action: the Action's own Area (shape, its smallest size, its rounds); Set here, or no Action found: the Zone's shape
 * and size (a formula, read with the selected token as the origin). The rounds: the Action's, else the Zone's Ends: Time. Only the GM places one.
 */
export async function placeZoneItem(item) {
  if (!game.user.isGM) return ui.notifications.warn("Only the GM places a Zone by hand. A player places it with the Action that applies it (its Place Area button).");
  const { normZone: nz, normEnds: ne, refValues, evalFormula } = await import("./fxrules.mjs");
  const s = item.system, z = nz(s.zone), ends = ne(s.ends);
  let shape = z.shape, size = 0, rounds = ends.time.on && ends.time.mode === "rounds" ? ends.time.rounds : 0, within = 0;
  const act = z.src === "action" ? await actionPlacing(item.getFlag?.("twod12", "effectUuid") || item._stats?.compendiumSource || item.uuid) : null;
  const ac = act?.doc?.system?.areaCfg;
  if (ac?.size > 0) {
    shape = ac.shape; within = Number(ac.within) || 0;
    const v = [...(act.doc.system.versions ?? [])].sort((a, b) => a.ap - b.ap)[0];
    size = Number(v?.areaSize) || ac.size; rounds = Number(v?.areaRounds) || ac.rounds || rounds;
  } else {
    const tok = canvas?.tokens?.controlled?.[0] ?? null, vals = refValues(tok?.actor ?? null);
    size = Math.trunc(Number(evalFormula(z.size, { origin: vals, target: vals }).value) || 0);
  }
  size = Math.max(1, size || 1);
  const { startTemplate } = await import("./template.mjs");
  return startTemplate({ shape, distance: size, within, quick: true, places: true, rounds, targets: "all", zone: { ...zoneFromItem(item), ...(act?.area ? { area: act.area } : {}) }, source: item.name });
}

/**
 * v0.0.327 (PACK ZONE): what a Zone keeps on its Region, from its Effect ("Where it is: On the map"): its name, its rows (Carries, Heals, Hazard,
 * Difficult Terrain, each with its Who), its Ends (Time, Origin goes Down, Someone uses an Action), its colors, the names of the Effects it carries.
 */
export function zoneFromItem(item) {
  const s = item?.system ?? {}, z = normZone(s.zone), names = {};
  for (const r of [z.inside.carry, z.inside.carry2, z.inside.ht.gives]) if (r?.fx) { try { names[r.fx] = fromUuidSync(r.fx)?.name ?? r.fxName ?? ""; } catch (e) { names[r.fx] = r.fxName ?? ""; } }
  return { name: String(item?.name ?? "Zone").replace(/\s*\(.*\)\s*$/, ""), shape: z.shape, size: z.size, ring: !!z.ring, rows: z.inside, ends: normEnds(s.ends), show: z.show, outline: z.outline, fill: z.fill, names, effectUuid: item?.uuid ?? "" };
}
/** The Zone a Version's effects describe (an Effect placed on the map; an older one's "zone" settings are read the same, settingsmigrate.mjs migrateZone), for the
 *  area about to be placed: { zone, uuids } or null. Those effects are not applied to creatures: the area is them. */
export async function zoneOf(versions) {
  const uuids = new Set(); let zone = null;
  for (const v of versions ?? []) for (const x of ["all", "t1", "t2", "t3"].flatMap(k => v.fx?.[k] ?? [])) {   // v0.0.329: every bucket (an Effect on a tier is a Zone too)
    if (uuids.has(x.uuid)) continue;
    let item = null; try { item = await fromUuid(x.uuid); } catch (e) { item = null; }
    if (item?.system?.where !== "map") continue;
    uuids.add(x.uuid);
    zone ??= zoneFromItem(item);
  }
  return zone ? { zone, uuids } : null;
}
export const zonesOf = scene => (scene?.regions ?? []).filter(r => r.getFlag?.(F, "zone"));
/** Pure: is a token (its cells) inside the zone's cells? */
export const inZone = (zone, cells) => { const set = new Set(zone?.cells ?? []); return (cells ?? []).some(c => set.has(key(c))); };
/** Pure: the side of a creature for a zone: the zone's origin side is "allies"; everyone else "enemies" (a neutral creature counts as an enemy). */
export const zoneSide = (zone, disposition) => (Number(disposition ?? 0) === Number(zone?.originDisposition ?? 1) ? "allies" : "enemies");
export const ruleWants = (rule, side) => rule.who === "all" || rule.who === side;
/** Pure: what each creature should carry: Map(tokenId -> Map(key -> { regionId, rule, zone })). tokens: [{ id, disposition, cells }]; regions: [{ id, zone }]. */
export function zonePlan(regions, tokens) {
  const want = new Map();
  for (const r of regions) for (const t of tokens) {
    if (!inZone(r.zone, t.cells)) continue;
    const side = zoneSide(r.zone, t.disposition);
    // v0.0.327 (PACK ZONE): the Carries row, its Who and "And the origin" (an older Zone's rules are read as rows)
    // v0.0.351: and the second Carries row (Covering Fire: the allies' +1 Defense, which the single row had dropped)
    const rows = zoneRows(r.zone);
    void side;
    [rows.carry, rows.carry2].forEach((carry, n) => {
      if (!carry?.on || !carry.fx || !rowReaches(carry, { originDisposition: r.zone.originDisposition ?? 1, disposition: t.disposition, isOrigin: !!t.actorUuid && t.actorUuid === r.zone.originUuid })) return;
      if (!want.has(t.id)) want.set(t.id, new Map());
      want.get(t.id).set(`${r.id}|${n}`, { regionId: r.id, rule: { fxUuid: carry.fx }, zone: r.zone });
    });
  }
  return want;
}
export async function refreshZones() {
  if (!game.user?.isActiveGM || !canvas?.scene) return;
  if (running) { again = true; return; }
  running = true;
  try {
    const { createEffect, originInfo } = await import("./effects.mjs");
    const regions = zonesOf(canvas.scene).map(r => ({ id: r.id, zone: r.getFlag(F, "zone") }));
    const toks = (canvas.scene.tokens ?? []).filter(td => td.actor).map(td => ({ id: td.id, doc: td, actorUuid: td.actor.uuid, disposition: td.disposition, cells: tokenCells(landing.get(td.id) ?? td) }));
    landing.clear();
    const want = zonePlan(regions, toks);
    const done = new Set();
    for (const t of toks) {
      const actor = t.doc.actor;
      if (done.has(actor.uuid)) continue;
      done.add(actor.uuid);
      const mine = want.get(t.id) ?? new Map();
      const have = actor.effects.filter(e => e.getFlag(F, "zoneFrom"));
      const stale = have.filter(e => !mine.has(e.getFlag(F, "zoneFrom"))).map(e => e.id);
      if (stale.length) { console.log(`twod12 | zones: ${actor.name} leaves ${stale.length} zone effect(s)`); await actor.deleteEmbeddedDocuments("ActiveEffect", stale); }
      for (const [k, w] of mine) {
        if (have.some(e => e.getFlag(F, "zoneFrom") === k)) continue;
        let item = null; try { item = await fromUuid(w.rule.fxUuid); } catch (e) { item = null; }
        if (item) { console.log(`twod12 | zones: ${actor.name} gains ${item.name} (${w.zone.name})`); await createEffect(actor, item, originInfo(w.zone.originUuid || actor.uuid), null, { zoneFrom: k }); }
      }
    }
  } catch (e) { console.warn("twod12 | zones", e); }
  finally { running = false; if (again) { again = false; scheduleZoneRefresh(); } }
}
export function scheduleZoneRefresh() { clearTimeout(timer); timer = setTimeout(refreshZones, 250); }
/** At the start of a creature's turn: the heals of the Zones it stands in (rolled, said in the chat, then its Heal window). */
export async function zoneTurnStart(combatant) {
  const td = combatant?.token, actor = td?.actor;
  if (!td || !actor) return 0;
  const cells = tokenCells(td);
  let n = 0;
  for (const r of zonesOf(td.parent)) {
    const zone = r.getFlag(F, "zone");
    if (!inZone(zone, cells)) continue;
    const side = zoneSide(zone, td.disposition);
    for (const rule of zone.rules ?? []) {
      if (!rule.heal || !ruleWants(rule, side)) continue;
      const roll = await new Roll(rule.heal).evaluate();
      try { const { showDice } = await import("./roll.mjs"); await showDice([roll]); } catch (e) { /* no dice */ }
      const { sysLine } = await import("./sysmsg.mjs"), { esc } = await import("./roll.mjs");
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand-holding-medical", `<b>${esc(zone.name)}</b>: <b>${esc(actor.name)}</b> heals <b>${roll.total}</b> (${esc(rule.heal)}) at the start of its turn.`, "fxm") });
      const { promptHeal } = await import("./healwin.mjs");
      await promptHeal(actor, roll.total, { source: zone.name, lead: `${zone.name}: ${roll.total} healing` });
      n++;
    }
  }
  return n;
}
export function registerZoneHooks() {
  const sched = () => scheduleZoneRefresh();
  for (const h of ["canvasReady", "createToken", "deleteToken", "createRegion", "deleteRegion", "updateRegion"]) Hooks.on(h, sched);
  // v0.0.361 (PACK PERF, D40): only a change that can move a creature in or out of a Zone (it was any token update, a light or a bar included)
  Hooks.on("updateToken", (doc, ch) => { if (["x", "y", "width", "height", "hidden", "disposition", "elevation", "actorId", "actorLink"].some(k => k in (ch ?? {}))) sched(); });
  // Foundry V13+: a movement says where it ends; the document can still be on its way when the hook fires (the hazards read it the same way)
  Hooks.on("moveToken", (doc, movement) => { const d = movement?.destination; if (d && Number.isFinite(d.x) && Number.isFinite(d.y)) landing.set(doc.id, { x: d.x, y: d.y, width: doc.width, height: doc.height, flags: doc.flags }); sched(); });
  Hooks.on("combatTurnChange", sched);
  Hooks.on("updateCombat", (combat, ch) => { if (!logOnlyChange(ch) && ["round", "turn", "started", "active"].some(k => k in (ch ?? {}))) sched(); });   // D40: not on a log line
}
