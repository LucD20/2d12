// v0.0.275 (pack RX-2, Lucas's design 2026-11-07): the Reactions message's map overlay. While a Reactions message is open (not resolved, not
// skipped), every client draws on the map: the triggering Action (a red curved arrow attacker -> target with an "N held" bubble; on a
// movement, the path's squares outlined and a ghost of the token where it started), a dashed amber ring on every creature that can react
// (gone once it passes), a solid line in its slab's color from every Reaction used to its target (with the Reaction's name), the hovered,
// unused option as a dashed line, and once every row is answered a numbered green pin on each line (its place in the stack; a drag in the
// chat renumbers them live). A client setting turns it off. The data comes from the message's flags (moment.mjs); nothing here is saved.
import { attentionRing, plate, INK, GOLD } from "./mapmark.mjs";   // v0.0.461 (the map notes' redesign)
const F = "twod12";
export const PALETTE = ["#f0b54a", "#5fc4c0", "#b48ce0", "#7fc97f"];
const RED = 0xe0553b, AMBER = 0xf0b54a, BEIGE = 0xecdcae, PIN = 0x2f6b3a, NAVY = 0x1d2738, PARCH = 0xf4eddc;
const hex = c => (typeof c === "number" ? c : parseInt(String(c ?? "#f0b54a").replace("#", ""), 16) || AMBER);

const shown = new Map();   // moment id -> its state (the message's flags)
const local = { hover: null, order: new Map() };   // hover: { id, row } (row: a number or "base"); order: id -> row ids (a drag under way)
let layer = null, queued = false;

export const overlayOn = () => { try { return game.settings.get(F, "reactionOverlay") !== false; } catch (e) { return true; } };
export function registerOverlaySetting() {
  game.settings.register(F, "reactionOverlay", { name: "Reaction map overlay", hint: "While a Reactions message is open, the map shows the triggering Action, a ring on every creature that can react and a line for every Reaction used (this client only).", scope: "client", config: true, type: Boolean, default: true, onChange: () => queue() });
}
/** The message was drawn or changed: show it while it is open, clear it once resolved or skipped. */
export function syncOverlay(st) {
  if (!st?.id || st.v !== 2) return;
  if (st.done) { shown.delete(st.id); local.order.delete(st.id); if (local.hover?.id === st.id) local.hover = null; }
  else shown.set(st.id, st);
  queue();
}
export function dropOverlay(id) { if (shown.delete(id)) queue(); }
export function setHover(id, row) { const h = id ? { id, row } : null; if (JSON.stringify(h) === JSON.stringify(local.hover)) return; local.hover = h; queue(); }
/** A slab is being dragged in the chat: the pins follow the order shown there (top first), before it is sent. */
export function previewOrder(id, ids) { if (ids) local.order.set(id, ids); else local.order.delete(id); queue(); }
export const hasOverlay = () => shown.size > 0;

/** Pure: the place of each used row in the stack (1 = resolves first), with a local drag order when there is one. */
export function pinNumbers(st, ids = null) {
  const used = st.rows.filter(r => r.state === "use").sort((x, y) => y.order - x.order).map(r => r.i);
  const list = ids && ids.length === used.length && ids.every(i => used.includes(i)) ? ids : used;
  return new Map(list.map((i, k) => [i, k + 1]));
}

export function queue() { if (queued) return; queued = true; (globalThis.requestAnimationFrame ?? (f => setTimeout(f, 16)))(() => { queued = false; try { draw(); } catch (e) { console.warn("twod12 | Reaction overlay", e); } }); }
export function registerOverlayHooks() {
  Hooks.on("canvasTearDown", () => { layer = null; });
  Hooks.on("canvasReady", () => { layer = null; shown.clear(); for (const m of game.messages?.contents?.slice(-40) ?? []) { const st = m.getFlag?.(F, "rx"); if (st?.v === 2 && !st.done) shown.set(st.id, st); } queue(); });
  for (const h of ["refreshToken", "updateToken", "deleteToken"]) Hooks.on(h, () => { if (shown.size) queue(); });
  Hooks.on("deleteChatMessage", m => { const st = m.getFlag?.(F, "rx"); if (st?.id) dropOverlay(st.id); });
  // hovering a token lights its slab (and its line)
  Hooks.on("hoverToken", (tk, on) => {
    if (!shown.size || typeof document === "undefined") return;
    const uuid = tk?.actor?.uuid;
    if (!uuid) return;
    document.querySelectorAll(".twod12.rx2 [data-actor]").forEach(el => { if (el.dataset.actor === uuid) el.classList.toggle("rx-hl", !!on); });
    if (!on) return setHover(null);
    for (const st of shown.values()) { const r = st.rows.find(x => x.actorUuid === uuid && x.state !== "pass" && x.state !== "skip"); if (r) return setHover(st.id, r.i); }
  });
}

/* ------------------------------------------------------------------ drawing (PIXI 7 on Foundry's interface layer) */
const tokenAt = uuid => { if (!uuid) return null; let d = null; try { d = fromUuidSync(uuid); } catch (e) { d = null; } const t = d?.object ?? (d?.documentName === "Actor" ? d.getActiveTokens?.()[0] : null); return t && !t.destroyed && t.document?.parent === canvas.scene && (!t.document.hidden || game.user.isGM) ? t : null; };
const centerOf = t => t.center ?? { x: t.x + t.w / 2, y: t.y + t.h / 2 };
function dashLine(g, a, b, dash, gap) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  if (!len) return;
  for (let s = 0; s < len; s += dash + gap) { const e = Math.min(len, s + dash); g.moveTo(a.x + dx * s / len, a.y + dy * s / len).lineTo(a.x + dx * e / len, a.y + dy * e / len); }
}
function arrowHead(g, from, to, color, size) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  g.lineStyle(0).beginFill(color, 1).moveTo(to.x, to.y).lineTo(to.x - size * Math.cos(ang - 0.45), to.y - size * Math.sin(ang - 0.45)).lineTo(to.x - size * Math.cos(ang + 0.45), to.y - size * Math.sin(ang + 0.45)).closePath().endFill();
}
/** A point short of the token's edge (lines end at the ring, not at the center). */
const shortOf = (a, b, by) => { const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: b.x - dx / l * by, y: b.y - dy / l * by }; };
function tag(text, color, fg, size) {
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? PIXI.Text;
  const box = new PIXI.Container(), t = new PT(String(text), { fontFamily: "Source Sans 3, Signika, sans-serif", fontSize: size, fontWeight: "700", fill: fg });
  t.anchor?.set?.(0.5);
  const w = t.width + size * 0.9, h = t.height + size * 0.3, bg = new PIXI.Graphics();
  bg.lineStyle(2, PARCH, 1).beginFill(hex(color), 1).drawRoundedRect(-w / 2, -h / 2, w, h, size * 0.35).endFill();
  box.addChild(bg, t);
  return box;
}
/** A pin: a circle in the slab's color (v0.0.281) with its place in the stack, or a plain dot before the order is known. */
function pin(n, size, color = PIN) {
  const box = new PIXI.Container(), g = new PIXI.Graphics(), r = size * 0.8;
  g.lineStyle(2, NAVY, 1).beginFill(hex(color), 1).drawCircle(0, 0, n ? r : r * 0.6).endFill();
  box.addChild(g);
  if (n) {
    const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? PIXI.Text, t = new PT(String(n), { fontFamily: "Source Sans 3, Signika, sans-serif", fontSize: size, fontWeight: "700", fill: NAVY });
    t.anchor?.set?.(0.5);
    box.addChild(t);
  }
  return box;
}
export function draw() {
  if (!globalThis.canvas?.ready || !globalThis.PIXI) return;
  if (!layer || layer.destroyed) { layer = new PIXI.Container(); layer.name = "twod12-rxoverlay"; layer.eventMode = "none"; layer.zIndex = 9000; const host = canvas.interface ?? canvas.stage; host.sortableChildren = true; host.addChild(layer); }   // v0.0.278 (Lucas: under some tokens' frames): drawn above the tokens' layer
  for (const c of layer.removeChildren()) c.destroy?.({ children: true });
  if (!overlayOn() || (!shown.size && !replays.size)) return;
  const gs = canvas.grid?.size ?? 100, fs = Math.max(13, Math.round(gs * 0.2));
  for (const st of shown.values()) drawOne(st, gs, fs);
  for (const R of replays.values()) if (R.until > Date.now() && (!R.st.snap?.scene || R.st.snap.scene === canvas.scene?.id)) drawReplay(R, gs, fs);
}
function drawOne(st, gs, fs) {
  const b = st.base ?? {}, g = new PIXI.Graphics(), labels = new PIXI.Container();
  layer.addChild(g, labels);
  const hov = local.hover?.id === st.id ? local.hover.row : null;
  // the triggering Action
  if (b.kind === "move" || b.kind === "stand") {
    // v0.0.468 (Lucas: "the movement triggering overlay (the dashed squares) could use some work for intuitiveness. Where the reactions trigger?
    // What is the exact movement the token took?"): the map notes' language: the exact path as a pale line through each square's center, a dot on
    // each, an arrow where it ended; the square where the Reaction can come outlined in gold, with a plate naming it
    const ctr = sq => ({ x: sq.x + (sq.w ?? gs) / 2, y: sq.y + (sq.h ?? gs) / 2 });
    const pts = [...(b.start ? [ctr(b.start)] : []), ...(b.path ?? []).map(ctr)].filter((p, i, a) => !i || Math.hypot(p.x - a[i - 1].x, p.y - a[i - 1].y) > 1);
    if (pts.length > 1) {
      g.lineStyle(5, 0x1f1c18, 0.55); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.lineStyle(3, INK, 0.95); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.lineStyle(0); for (const p of pts.slice(1, -1)) g.beginFill(INK, 0.95).drawCircle(p.x, p.y, Math.max(3, gs * 0.06)).endFill();
      arrowHead(g, pts[pts.length - 2], pts[pts.length - 1], INK, fs);
    }
    if (b.backAt) {
      g.lineStyle(4, GOLD, 1).drawRect(b.backAt.x + 2, b.backAt.y + 2, (b.backAt.w ?? gs) - 4, (b.backAt.h ?? gs) - 4);
      const names = [...new Set((st.rows ?? []).filter(r => r.state === "wait" || r.state === "use").map(r => r.itemName).filter(Boolean))];
      const pl = plate(["Reaction here", names.join(", ")], { fs: Math.round(fs * 0.95) }); pl.position.set(b.backAt.x + (b.backAt.w ?? gs) / 2, b.backAt.y - 4); labels.addChild(pl);
    }
    if (b.start && b.face?.img) {
      try { const sp = PIXI.Sprite.from(b.face.img); sp.alpha = 0.35; sp.width = (b.start.w ?? 1) * gs; sp.height = (b.start.h ?? 1) * gs; sp.position.set(b.start.x, b.start.y); layer.addChildAt(sp, 0); } catch (e) { /* no image */ }
    }
  } else {
    const s = tokenAt(b.face?.uuid), t = tokenAt(b.target?.uuid);
    if (s && t && s !== t) {
      const a = centerOf(s), z = centerOf(t), mid = { x: (a.x + z.x) / 2, y: (a.y + z.y) / 2 }, len = Math.hypot(z.x - a.x, z.y - a.y) || 1;
      const ctrl = { x: mid.x + (z.y - a.y) / len * Math.min(gs, len * 0.35) * -1, y: mid.y + (z.x - a.x) / len * Math.min(gs, len * 0.35) };
      const end = shortOf(ctrl, z, t.w * 0.45);
      g.lineStyle(hov === "base" ? 8 : 5, RED, 1).moveTo(a.x, a.y).quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
      arrowHead(g, ctrl, end, RED, fs * 1.1);
    }
    if (t && st.hold && b.held) { const bub = tag(`${b.held} held`, "#b8432f", 0xffffff, fs); const c = centerOf(t); bub.position.set(c.x, t.y - fs); labels.addChild(bub); }
  }
  // the rings, the lines, the pins
  const pins = st.ready ? pinNumbers(st, local.order.get(st.id)) : null, ringed = new Set();
  for (const r of st.rows) {
    const me = tokenAt(r.tokenUuid);
    if (!me) continue;
    if (r.state === "wait") {
      if (!ringed.has(r.actorUuid)) {
        ringed.add(r.actorUuid); attentionRing(labels, centerOf(me), me.w * 0.62);   // v0.0.461 (the map notes, Lucas's B): the steady gold ring and its slow ripple (was a dashed amber ring)
        // v0.0.390 (Lucas: "it can pass unnoticed"): the Reaction's name over the token, only for the one who answers it (a player never sees an
        // NPC's options), until it is used or passed; a client setting turns it off
        let showName = true; try { showName = game.settings.get(F, "rxFloat") !== false; } catch (e) { showName = true; }
        if (showName && r.answerer === game.user.id) { const names = st.rows.filter(x => x.actorUuid === r.actorUuid && x.state === "wait").map(x => x.itemName); const lb = plate([`${[...new Set(names)].join(" or ")}?`, "Use or Pass in the HUD"], { fs: Math.round(fs * 1.05) }); lb.position.set(centerOf(me).x, me.y - me.h * 0.12); labels.addChild(lb); }   // v0.0.461: the plate
      }
      if (hov === r.i) { const t = tokenAt(r.targetUuid); if (t && t !== me) { const col = hex(PALETTE[st.rows.filter(x => x.state === "use").length % PALETTE.length]); g.lineStyle(4, col, 0.9); const a = centerOf(me), z = shortOf(a, centerOf(t), t.w * 0.45); dashLine(g, a, z, 14, 9); arrowHead(g, a, z, col, fs); } }
      continue;
    }
    if (r.state !== "use") continue;
    // v0.0.281 (Lucas: the labels still overlapped): no text on the lines; the reactor carries a pin in its color at its top right (its place in
    // the stack once all are answered), the line goes from its ring to the target's, and the Reaction's name shows only while it is hovered
    // (its slab in the chat, or its token), under the reactor
    const t = tokenAt(r.targetUuid), col = hex(r.color), a = centerOf(me), on = hov === r.i;
    g.lineStyle(on ? 5 : 3, col, 1).drawCircle(a.x, a.y, me.w * 0.55);
    const p = pin(pins?.get(r.i) ?? "", Math.round(fs * 0.85), r.color);
    p.position.set(me.x + me.w * 0.92, me.y + me.h * 0.08);
    labels.addChild(p);
    if (on) { const lb = tag(r.itemName, r.color, NAVY, Math.round(fs * 0.85)); lb.position.set(a.x, me.y + me.h + fs * 0.7); labels.addChild(lb); }
    if (!t || t === me) continue;
    const c = centerOf(t), s0 = shortOf(c, a, me.w * 0.55), z = shortOf(a, c, t.w * 0.5);
    g.lineStyle(on ? 7 : 4, col, 1).moveTo(s0.x, s0.y).lineTo(z.x, z.y);
    arrowHead(g, s0, z, col, fs);
  }
}

/* ------------------------------------------------------------------ v0.0.281: the replay of a resolved moment (its message's map button) */
const replays = new Map();   // moment id -> { st, label, until }
/** Draws a resolved moment on the map from where the tokens stood when it resolved, for a few seconds (a second click clears it). */
export function replayOverlay(st, { label = "", ms = 6000 } = {}) {
  if (!st?.id) return false;
  if (replays.has(st.id)) { replays.delete(st.id); queue(); return false; }
  replays.set(st.id, { st, label, until: Date.now() + ms });
  setTimeout(() => { const R = replays.get(st.id); if (R && R.until <= Date.now()) { replays.delete(st.id); queue(); } }, ms + 50);
  queue();
  return true;
}
export const replaying = id => replays.has(id);
/** Pure: the frozen positions as a map (uuid -> { x, y }); a list since v0.0.278. */
export const frozenPos = st => { const raw = st?.snap?.pos ?? []; return new Map((Array.isArray(raw) ? raw : Object.entries(raw).map(([u, p]) => ({ u, ...p }))).filter(p => Number.isFinite(p?.x)).map(p => [p.u, { x: p.x, y: p.y }])); };
function drawReplay(R, gs, fs) {
  const st = R.st, pos = frozenPos(st), b = st.base ?? {}, g = new PIXI.Graphics(), labels = new PIXI.Container(), rad = gs * 0.45;
  layer.addChild(g, labels);
  const at = u => pos.get(u) ?? null;
  const ring = (p, color, w = 3) => { if (p) g.lineStyle(w, hex(color), 1).drawCircle(p.x, p.y, rad); };
  if (b.kind === "move") { const s = at("start"), z = at(b.face?.uuid); if (s && z) { g.lineStyle(3, BEIGE, 0.9); dashLine(g, s, z, 10, 7); g.lineStyle(2, BEIGE, 0.9).beginFill(BEIGE, 0.2).drawCircle(s.x, s.y, rad * 0.9).endFill(); } ring(z, "#ecdcae"); }
  else { const s = at(b.face?.uuid), z = at(b.target?.uuid); if (s && z) { g.lineStyle(5, RED, b.never ? 0.45 : 1).moveTo(s.x, s.y).lineTo(shortOf(s, z, rad).x, shortOf(s, z, rad).y); arrowHead(g, s, shortOf(s, z, rad), RED, fs * 1.1); } ring(s, "#e0553b"); }
  const used = st.rows.filter(r => r.state === "use").sort((x, y) => y.order - x.order);
  used.forEach((r, k) => {
    const a = at(r.tokenUuid), z = at(r.targetUuid);
    if (!a) return;
    ring(a, r.color);
    const p = pin(k + 1, Math.round(fs * 0.85), r.out?.spent ? "#6b5d45" : r.color);
    p.position.set(a.x + rad * 0.8, a.y - rad * 0.8);
    labels.addChild(p);
    if (!z || z === a) return;
    const s0 = shortOf(z, a, rad), e = shortOf(a, z, rad);
    g.lineStyle(4, hex(r.color), r.out?.spent ? 0.45 : 1).moveTo(s0.x, s0.y).lineTo(e.x, e.y);
    arrowHead(g, s0, e, hex(r.color), fs);
  });
  const tgt = at(b.kind === "move" ? b.face?.uuid : b.target?.uuid);
  if (tgt && R.label) { const bub = tag(R.label, b.never ? "#3b4559" : "#b8432f", 0xffffff, fs); bub.position.set(tgt.x, tgt.y - rad - fs); labels.addChild(bub); }
}
