// v0.0.275 (pack RX-2, Lucas's design 2026-11-07): the Reactions message's map overlay. While a Reactions message is open (not resolved, not
// skipped), every client draws on the map: the triggering Action (a red curved arrow attacker -> target with an "N held" bubble; on a
// movement, the path's squares outlined and a ghost of the token where it started), a dashed amber ring on every creature that can react
// (gone once it passes), a solid line in its slab's color from every Reaction used to its target (with the Reaction's name), the hovered,
// unused option as a dashed line, and once every row is answered a numbered green pin on each line (its place in the stack; a drag in the
// chat renumbers them live). A client setting turns it off. The data comes from the message's flags (moment.mjs); nothing here is saved.
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
function dashCircle(g, c, r, n = 16) { for (let k = 0; k < n; k++) { const a0 = (k / n) * Math.PI * 2, a1 = a0 + Math.PI / n; g.moveTo(c.x + r * Math.cos(a0), c.y + r * Math.sin(a0)); g.arc(c.x, c.y, r, a0, a1); } }
function arrowHead(g, from, to, color, size) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  g.lineStyle(0).beginFill(color, 1).moveTo(to.x, to.y).lineTo(to.x - size * Math.cos(ang - 0.45), to.y - size * Math.sin(ang - 0.45)).lineTo(to.x - size * Math.cos(ang + 0.45), to.y - size * Math.sin(ang + 0.45)).closePath().endFill();
}
/** A point short of the token's edge (lines end at the ring, not at the center). */
const shortOf = (a, b, by) => { const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: b.x - dx / l * by, y: b.y - dy / l * by }; };
function tag(text, color, fg, size) {
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? PIXI.Text;
  const box = new PIXI.Container(), t = new PT(String(text), { fontFamily: "Signika, sans-serif", fontSize: size, fontWeight: "700", fill: fg });
  t.anchor?.set?.(0.5);
  const w = t.width + size * 0.9, h = t.height + size * 0.3, bg = new PIXI.Graphics();
  bg.lineStyle(2, PARCH, 1).beginFill(hex(color), 1).drawRoundedRect(-w / 2, -h / 2, w, h, size * 0.35).endFill();
  box.addChild(bg, t);
  return box;
}
function pin(n, size) {
  const box = new PIXI.Container(), g = new PIXI.Graphics(), r = size * 0.75;
  g.lineStyle(2, PARCH, 1).beginFill(PIN, 1).drawCircle(0, 0, r).endFill();
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? PIXI.Text, t = new PT(String(n), { fontFamily: "Signika, sans-serif", fontSize: size, fontWeight: "700", fill: 0xffffff });
  t.anchor?.set?.(0.5);
  box.addChild(g, t);
  return box;
}
export function draw() {
  if (!globalThis.canvas?.ready || !globalThis.PIXI) return;
  if (!layer || layer.destroyed) { layer = new PIXI.Container(); layer.name = "twod12-rxoverlay"; layer.eventMode = "none"; layer.zIndex = 9000; const host = canvas.interface ?? canvas.stage; host.sortableChildren = true; host.addChild(layer); }   // v0.0.278 (Lucas: under some tokens' frames): drawn above the tokens' layer
  for (const c of layer.removeChildren()) c.destroy?.({ children: true });
  if (!overlayOn() || !shown.size) return;
  const gs = canvas.grid?.size ?? 100, fs = Math.max(13, Math.round(gs * 0.2));
  for (const st of shown.values()) drawOne(st, gs, fs);
}
function drawOne(st, gs, fs) {
  const b = st.base ?? {}, g = new PIXI.Graphics(), labels = new PIXI.Container();
  layer.addChild(g, labels);
  const hov = local.hover?.id === st.id ? local.hover.row : null;
  // the triggering Action
  if (b.kind === "move" || b.kind === "stand") {
    g.lineStyle(2, BEIGE, 0.8);
    for (const sq of b.path ?? []) { const a = { x: sq.x, y: sq.y }; const w = sq.w ?? gs, h = sq.h ?? gs; dashLine(g, a, { x: a.x + w, y: a.y }, 8, 6); dashLine(g, { x: a.x + w, y: a.y }, { x: a.x + w, y: a.y + h }, 8, 6); dashLine(g, { x: a.x + w, y: a.y + h }, { x: a.x, y: a.y + h }, 8, 6); dashLine(g, { x: a.x, y: a.y + h }, a, 8, 6); }
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
      if (!ringed.has(r.actorUuid)) { ringed.add(r.actorUuid); g.lineStyle(3, AMBER, 0.95); dashCircle(g, centerOf(me), me.w * 0.62); }
      if (hov === r.i) { const t = tokenAt(r.targetUuid); if (t && t !== me) { const col = hex(PALETTE[st.rows.filter(x => x.state === "use").length % PALETTE.length]); g.lineStyle(4, col, 0.9); const a = centerOf(me), z = shortOf(a, centerOf(t), t.w * 0.45); dashLine(g, a, z, 14, 9); arrowHead(g, a, z, col, fs); } }
      continue;
    }
    if (r.state !== "use") continue;
    const t = tokenAt(r.targetUuid), col = hex(r.color), a = centerOf(me);
    g.lineStyle(3, col, 1).drawCircle(a.x, a.y, me.w * 0.55);
    if (!t || t === me) continue;
    const z = shortOf(a, centerOf(t), t.w * 0.45), mid = { x: (a.x + z.x) / 2, y: (a.y + z.y) / 2 };
    g.lineStyle(hov === r.i ? 8 : 4.5, col, 1).moveTo(a.x, a.y).lineTo(z.x, z.y);
    arrowHead(g, a, z, col, fs);
    const lb = tag(r.itemName, r.color, NAVY, Math.round(fs * 0.85));
    const shift = pins ? fs * 0.8 : 0;   // the pin sits just left of the label
    lb.position.set(mid.x + shift, mid.y - fs * 0.9);
    labels.addChild(lb);
    if (pins?.has(r.i)) { const p = pin(pins.get(r.i), Math.round(fs * 0.85)); p.position.set(mid.x + shift - lb.width / 2 - fs * 0.7, mid.y - fs * 0.9); labels.addChild(p); }
  }
}
