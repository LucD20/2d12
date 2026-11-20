// v0.0.350 (Lucas, playtest 4: "hovering over an area should show a small tooltip of what it does, for example Covering Fire: '1 Bane on Strike
// Actions / Allies +1 Defense'"): over a placed area (a Zone's region), a small card follows the mouse: its name, then one line per thing it does
// (an Effect it gives to allies / enemies / everyone inside, a heal, a hazard, Difficult Terrain). Nothing is saved; it reads the region's flags.
import { zoneRows } from "./fxrules.mjs";
import { highlightText } from "./config.mjs";
const F = "twod12";
const WHO = { allies: "Allies", enemies: "Enemies", all: "Everyone" };
const strip = s => String(s ?? "").replace(/<[^>]+>/g, "").trim();

/** Pure: an Effect's short words: the part of its name in brackets ("Covering Fire (1 Bane)" -> "1 Bane"), else its summary, else its name. */
export function shortWords(name, summary = "") {
  const m = String(name ?? "").match(/\(([^()]+)\)\s*$/);
  if (m) return m[1];
  const s = strip(summary);
  return s && s.length <= 70 ? s : String(name ?? "");
}
/** Pure: the tooltip's lines for a zone flag. nameOf(uuid) -> { name, summary }. */
export function zoneTipLines(z, nameOf = () => null) {
  const lines = [];
  for (const r of z?.rules ?? []) {
    if (r.fxUuid) { const n = nameOf(r.fxUuid); lines.push(`${WHO[r.who] ?? "Inside"}: ${shortWords(n?.name ?? "an Effect", n?.summary)}`); }
    if (String(r.heal ?? "").trim()) lines.push(`${WHO[r.who] ?? "Inside"}: heal ${r.heal} at the start of their turns`);
  }
  if (z?.rows) {
    const rows = zoneRows(z);
    for (const c of [rows.carry, rows.carry2]) if (c?.on && c.fx && !(z.rules ?? []).some(r => r.fxUuid === c.fx)) { const n = nameOf(c.fx); lines.push(`${WHO[c.who] ?? "Inside"}: ${shortWords(n?.name ?? (z.names?.[c.fx] || "an Effect"), n?.summary)}`); }   // v0.0.351: both Carries rows
    if (rows.heal?.on && !(z.rules ?? []).some(r => String(r.heal ?? "").trim())) lines.push(`${WHO[rows.heal.who] ?? "Inside"}: heal ${rows.heal.formula} at the start of their turns`);
    if (rows.ht?.on) lines.push(`${WHO[rows.ht.who] ?? "Everyone"}: Hazardous Terrain, ${(rows.ht.list ?? []).map(d => `${d.dice}${d.sub ? ` ${d.sub}` : ""}`).join(" + ") || "damage"}`);   // v0.0.467: who first, as every line
    if (rows.diff?.on) lines.push(`${WHO[rows.diff.who] ?? "Everyone"}: Difficult Terrain`);
    // v0.0.463 (Lucas, checklist v0.0.462, area-hover: Consecrated Ground showed only the enemies' Difficult Terrain): the Guard row too
    if (rows.guard?.on) lines.push(`${WHO[rows.guard.who] ?? "Inside"}${rows.guard.self ? " and you" : ""}: Guard equal to ${String(rows.guard.formula ?? "").replace(/@origin\.pow/gi, "your Power Modifier").replace(/@origin\./gi, "")} at the start of their turns`);
  }
  const t = z?.ends?.time;
  if (t?.on) lines.push(t.mode === "encounter" ? "Until the encounter ends" : `${Number(z.remaining ?? t.rounds) || t.rounds} round${(Number(z.remaining ?? t.rounds) || t.rounds) === 1 ? "" : "s"}`);
  return lines;
}
/** Pure (v0.0.467, Lucas: "It should say in sections ... Enemies: Difficult Terrain; Allies/Origin: Guard (origin included)"): the lines grouped by
 *  who they affect, in the order they come; a line with no "Who:" (its duration) is the foot. { groups: [{ who, lines }], foot: [lines] } */
export function zoneTipGroups(lines) {
  const groups = [], foot = [];
  for (const l of lines ?? []) {
    const m = String(l).match(/^(Enemies|Allies and you|Allies|Everyone|Inside)(?: and you)?: (.*)$/);
    if (!m) { foot.push(l); continue; }
    const who = String(l).startsWith(`${m[1]} and you:`) ? `${m[1]} and you` : m[1];
    let g = groups.find(x => x.who === who); if (!g) groups.push(g = { who, lines: [] });
    g.lines.push(m[2]);
  }
  return { groups, foot };
}

let el = null, queued = false, last = null;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function hide() { if (el) el.style.display = "none"; }
/** v0.0.359 (Lucas: "still showing over windows"): the map's pointermove also fires while the mouse is over a window (PIXI listens on the document):
 *  only the map itself under the mouse counts. */
const overMap = ev => { try { const t = document.elementFromPoint(ev.clientX, ev.clientY); return !t || t === canvas?.app?.view || t.id === "board"; } catch (e) { return true; } };
function show(ev) {
  queued = false;
  if (!overMap(ev)) return hide();
  if (!canvas?.ready || !canvas.grid?.isSquare || !last) return hide();
  const p = last, off = canvas.grid.getOffset?.({ x: p.x, y: p.y });
  if (!off) return hide();
  const k = `${off.i},${off.j}`;
  // v0.0.467 (Lucas, checklist v0.0.466: "If two overlap, it should still show both, separated by name"): every area under the mouse
  const zones = (canvas.scene?.regions ?? []).map(r => r.getFlag?.(F, "zone")).filter(z => z && (z.cells ?? []).some(c => `${c.i},${c.j}` === k || c === k));
  if (!zones.length) return hide();
  const nameOf = u => { try { const d = fromUuidSync(u); if (!d) return null; return { name: d.name, summary: d.system?.autoHover ?? d.system?.hover ?? "" }; } catch (e) { return null; } };
  if (!el) { el = document.createElement("div"); el.className = "twod12 twod12-zonetip"; document.body.append(el); }
  // v0.0.352 (Lucas: "Enemies red and Allies blue; and the colors of the stats, as elsewhere"): the side in its color, the rest through the
  // system's highlighting (Attributes, Boons and Banes, traits); v0.0.467: each area under its name, its lines in sections by who they affect
  const hl = t => { try { return highlightText(esc(t)); } catch (e) { return esc(t); } };
  const cls = w => (w.startsWith("Enemies") ? "enemies" : w.startsWith("Allies") ? "allies" : "everyone");
  el.innerHTML = zones.map(z => { const { groups, foot } = zoneTipGroups(zoneTipLines(z, nameOf)); return `<div class="zt-zone"><b>${esc(z.name ?? "Area")}</b>${groups.map(g => `<div class="zt-sec"><span class="zt-who ${cls(g.who)}">${esc(g.who)}</span>${g.lines.map(l => `<div class="zt-l">${hl(l)}</div>`).join("")}</div>`).join("")}${foot.map(l => `<div class="zt-foot">${hl(l)}</div>`).join("")}</div>`; }).join("");
  el.style.display = "block";
  el.style.left = `${ev.clientX + 16}px`; el.style.top = `${ev.clientY + 14}px`;
}
export function registerZoneTip() {
  Hooks.on("canvasReady", () => {
    canvas.stage?.on?.("pointermove", ev => {
      if (ev.buttons) return hide();   // dragging: no tooltip
      try { last = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data?.getLocalPosition?.(canvas.stage); } catch (e) { last = null; }
      const n = ev.nativeEvent ?? ev.data?.originalEvent ?? ev;
      if (queued) return; queued = true;
      requestAnimationFrame(() => { try { show(n); } catch (e) { hide(); } });
    });
    canvas.stage?.on?.("pointerleave", hide);
  });
  Hooks.on("canvasTearDown", hide);
  // v0.0.358 (Lucas: the tooltip showed over the windows): the map's own pointer events don't say when the mouse goes onto a window or the sidebar
  document.addEventListener("pointermove", ev => { if (el && el.style.display !== "none" && ev.target !== canvas?.app?.view && ev.target?.id !== "board") hide(); }, { passive: true });
}
