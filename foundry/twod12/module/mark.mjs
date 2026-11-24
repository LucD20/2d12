// The mark (v0.0.161 as the Archer's Marked Quarry; v0.0.186 general; v0.0.207 the messages are settings): an Action with "Marks the target"
// (Mark Quarry) marks a creature (actor flag twod12.quarry = { uuid, name } of its token). Settings "only against the creature it marked" read it
// (automation.mjs). The mark ends when an encounter starts and when the marked creature dies or goes Down. What the marker is told then is
// not code: the "Chat message" settings of its items (Marked Quarry: "At the start of an encounter", "When the creature it marked goes Down").
import { postMessages } from "./automation.mjs";
const F = "twod12";
export const quarryOf = actor => actor?.getFlag?.(F, "quarry") ?? null;
const uuidOfToken = t => t?.document?.uuid ?? t?.uuid ?? "";

/** Mark a creature (a token) as this creature's marked target, or clear it (token null). */
export async function setQuarry(actor, token, kind = "") {
  if (!token) { if (quarryOf(actor)) await actor.unsetFlag(F, "quarry"); return; }
  await actor.setFlag(F, "quarry", { uuid: uuidOfToken(token), name: token.name, kind: String(kind ?? "") });   // v0.0.409: kind "judge" (Judge: the creature is Judged)
  // v0.0.343 (Lucas, playtest 4): no "X marks Y" line: the Action's card says it, and the mark shows on the map (its icon on the token)
}

/** The creatures that could hold a mark: the world's actors and the unlinked tokens of the scene. */
const markers = () => game.actors.contents.concat((canvas?.scene?.tokens ?? []).filter(t => !t.actorLink).map(t => t.actor).filter(Boolean));
/**
 * The token uuids that are marked by a creature this user owns (the GM sees every mark): uuid -> the marker's image (v0.0.224).
 * v0.0.361 (PACK PERF, D35): kept until a mark, an actor, a token or the scene changes (each token refresh, every frame a token moved, walked
 * every world actor: 14 µs with 50 actors, 75 µs with 300).
 */
let marksCache = null;
export const forgetQuarryMarks = () => { marksCache = null; };
function quarryMarks() {
  return marksCache ??= readQuarryMarks();
}
function readQuarryMarks() {
  const out = new Map();
  for (const a of markers().filter(x => game.user.isGM || x.isOwner)) {
    const q = quarryOf(a);
    // v0.0.348 (Lucas: "multiple marks on the same target need to show all icons, like two Archers marking the same Quarry"): a list per token
    if (q?.uuid) {
      const src = (a.isToken ? a.token?.texture?.src : a.getActiveTokens?.()[0]?.document?.texture?.src) || a.prototypeToken?.texture?.src || a.img || "";
      out.set(q.uuid, [...(out.get(q.uuid) ?? []), { src, kind: String(q.kind || "quarry").toLowerCase() }]);
    }
  }
  return out;
}

/** Pure layout helper for right-edge Heraldic Portrait Seals so multiple marks never collide. */
export function markSealLayout(count, tokenW = 100) {
  const r = Math.max(11, Math.min(18, tokenW * 0.145));
  const step = Math.round(r * 2.85);
  const x = tokenW - r * 0.45;
  return Array.from({ length: Math.max(0, count) }, (_, k) => ({ x, y: r * 0.85 + k * step, r, step }));
}

function mPoly(g, pts, fillCol, strokeW, strokeCol, fillAlpha = 1) {
  if (typeof g.beginFill === "function") {
    if (strokeW > 0) g.lineStyle(strokeW, strokeCol, 1);
    g.beginFill(fillCol, fillAlpha);
    g.drawPolygon(pts);
    g.endFill();
    g.lineStyle(0);
  } else {
    g.poly(pts);
    g.fill({ color: fillCol, alpha: fillAlpha });
    if (strokeW > 0) { g.poly(pts); g.stroke({ width: strokeW, color: strokeCol, alpha: 1 }); }
  }
}

function mCircle(g, cx, cy, r, fillCol, strokeW = 0, strokeCol = 0, fillAlpha = 1) {
  if (typeof g.beginFill === "function") {
    if (strokeW > 0) g.lineStyle(strokeW, strokeCol, 1);
    if (fillCol !== null) g.beginFill(fillCol, fillAlpha);
    g.drawCircle(cx, cy, r);
    if (fillCol !== null) g.endFill();
    g.lineStyle(0);
  } else {
    g.circle(cx, cy, r);
    if (fillCol !== null) g.fill({ color: fillCol, alpha: fillAlpha });
    if (strokeW > 0) { g.circle(cx, cy, r); g.stroke({ width: strokeW, color: strokeCol, alpha: 1 }); }
  }
}

function mLine(g, x1, y1, x2, y2, width, color) {
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, 1); g.moveTo(x1, y1).lineTo(x2, y2); g.lineStyle(0); }
  else { g.moveTo(x1, y1).lineTo(x2, y2); g.stroke({ width, color, alpha: 1 }); }
}

/** Draws (or removes) Heraldic Portrait Seal marks down the right edge of a token. */
function drawQuarryMark(token, marks = quarryMarks()) {
  if (!token || token.destroyed) return;
  token.children?.filter(c => c.name === "twod12-quarry").forEach(c => { token.removeChild(c); c.destroy({ children: true }); });
  if (!marks.has(token.document?.uuid)) return;
  const w = token.w ?? token.document.width * (canvas.grid?.size ?? 100);
  const list = marks.get(token.document?.uuid) ?? [];
  const slots = markSealLayout(list.length, w);

  list.forEach((entry, k) => {
    const src = typeof entry === "string" ? entry : (entry?.src ?? "");
    const isJudge = (typeof entry === "object" && entry?.kind === "judge");
    const { x, y, r } = slots[k];

    const box = new PIXI.Container();
    box.name = "twod12-quarry";
    box.eventMode = "none";
    box.position.set(x, y);

    const back = new PIXI.Graphics();
    if (isJudge) {
      // Gilded 8-point radiant starburst behind the portrait
      const pts = [];
      const outerR = r * 1.44, innerR = r * 0.98;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8 - Math.PI / 2;
        const rad = i % 2 === 0 ? outerR : innerR;
        pts.push(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      mPoly(back, pts, 0x241c11, Math.max(1.5, r * 0.11), 0xe6be5a, 0.96);
    } else {
      // Dark-iron medallion + 4 diagonal crimson broadhead barbs pointing inward
      mCircle(back, 0, 0, r * 1.15, 0x1f1412, Math.max(1.4, r * 0.1), 0x8f2920, 0.96);
      for (const deg of [45, 135, 225, 315]) {
        const a = (deg * Math.PI) / 180;
        const tipX = Math.cos(a) * (r * 1.38), tipY = Math.sin(a) * (r * 1.38);
        const lA = a - 0.36, rA = a + 0.36;
        const baseR = r * 0.88;
        mPoly(back, [tipX, tipY, Math.cos(lA) * baseR, Math.sin(lA) * baseR, Math.cos(rA) * baseR, Math.sin(rA) * baseR], 0xe05a4d, 1, 0x1a110f, 1);
      }
    }
    // Portrait backing disc
    mCircle(back, 0, 0, r * 0.96, isJudge ? 0x3a2f22 : 0x221a18, 0, 0, 1);
    box.addChild(back);

    if (src) {
      try {
        const sp = PIXI.Sprite.from(src);
        sp.anchor.set(0.5);
        sp.width = sp.height = r * 1.92;
        const mask = new PIXI.Graphics();
        mCircle(mask, 0, 0, r * 0.94, 0xffffff, 0, 0, 1);
        sp.mask = mask;
        box.addChild(mask, sp);
      } catch (e) { /* no image: fallback disc */ }
    }

    const front = new PIXI.Graphics();
    if (isJudge) {
      mCircle(front, 0, 0, r * 0.98, null, Math.max(2, r * 0.15), 0xf5dc93, 1);
      // Bottom-right gilded cross diamond badge
      const bx = r * 0.74, by = r * 0.74, br = r * 0.42;
      mPoly(front, [bx, by - br, bx + br, by, bx, by + br, bx - br, by], 0x1c150c, Math.max(1.2, r * 0.09), 0xf5dc93, 1);
      const cw = Math.max(1.3, r * 0.1), cs = br * 0.56;
      mLine(front, bx, by - cs, bx, by + cs, cw, 0xf5dc93);
      mLine(front, bx - cs * 0.85, by, bx + cs * 0.85, by, cw, 0xf5dc93);
    } else {
      mCircle(front, 0, 0, r * 0.96, null, Math.max(2, r * 0.14), 0xe86858, 1);
      // Bottom-right dark-iron arrowhead badge
      const bx = r * 0.74, by = r * 0.74, br = r * 0.42;
      mCircle(front, bx, by, br, 0x1d1210, Math.max(1.2, r * 0.09), 0xe86858, 1);
      const s = br * 0.62;
      mPoly(front, [bx + s, by - s, bx + s * 0.1, by + s, bx - s * 0.15, by + s * 0.15, bx - s, by - s * 0.1], 0xffd9cc, 0, 0, 1);
    }
    box.addChild(front);
    token.addChild(box);
  });
}
const redrawQuarryMarks = () => { marksCache = null; if (!canvas?.ready) return; const m = quarryMarks(); for (const t of canvas.tokens?.placeables ?? []) drawQuarryMark(t, m); };

export function registerMarkHooks() {
  // v0.0.162: a marked creature shows a crosshair on its token (for the marker's owners and the GM).
  Hooks.on("refreshToken", token => drawQuarryMark(token));
  Hooks.on("canvasReady", redrawQuarryMarks);
  // D35: what the cached marks depend on (a marker's token image or ownership, an unlinked marker's token, a world actor)
  for (const h of ["createToken", "deleteToken", "createActor", "deleteActor"]) Hooks.on(h, forgetQuarryMarks);
  Hooks.on("updateToken", (doc, ch) => { if (ch && ("texture" in ch || "actorLink" in ch || "actorId" in ch || "delta" in ch)) forgetQuarryMarks(); });
  Hooks.on("updateActor", (actor, ch) => { if (ch && ("ownership" in ch || "prototypeToken" in ch || "img" in ch)) forgetQuarryMarks(); });
  Hooks.on("updateActor", (actor, change) => { const f = change?.flags?.twod12; if (f && ("quarry" in f || "-=quarry" in f)) redrawQuarryMarks(); });
  // The marked creature dies or goes Down: the mark ends, and the marker's "When the creature it marked goes Down" messages are posted (the active GM).
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    if (!["dead", "unconscious", "desperate", "dying", "shattered"].some(s => effect.statuses?.has?.(s))) return;
    const a = effect.parent;
    if (a?.documentName !== "Actor") return;
    const uuids = new Set((a.isToken ? [a.token] : (a.getActiveTokens?.() ?? []).map(t => t.document)).filter(Boolean).map(d => d.uuid));
    for (const marker of markers()) {
      const q = quarryOf(marker);
      if (!q || !uuids.has(q.uuid)) continue;
      await marker.unsetFlag(F, "quarry");
      await postMessages(marker, "markDown", { mark: q.name });
      // v0.0.243 (pack R): the class hook "the creature it marked goes Down" (Thrill of the Kill): once an encounter, +1 Escalation.
      try {
        const { escHooksOf } = await import("./states.mjs"), { raiseEscalation } = await import("./escalation.mjs");
        for (const h of escHooksOf(marker)) if (h.when === "markDown" && game.combat?.started) await raiseEscalation(marker, "hook", { label: `${h.source} (${q.name} goes Down)` });
      } catch (e) { console.warn("twod12 | Escalation hook (mark)", e); }
    }
  });
  // v0.0.411 (pack F3, Thrill of the Kill): a creature goes Down: each creature that damaged it in this combat and has the hook "an enemy it
  // has damaged goes Down" raises its Escalation (once an encounter: raiseEscalation's hook)
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM || !game.combat?.started) return;
    if (!["dead", "unconscious", "desperate", "dying", "shattered"].some(s => effect.statuses?.has?.(s))) return;
    const a = effect.parent;
    if (a?.documentName !== "Actor") return;
    const h = a.getFlag?.(F, "hurtBy");
    if (!h || h.combat !== game.combat.id) return;
    try {
      const { escHooksOf } = await import("./states.mjs"), { raiseEscalation } = await import("./escalation.mjs");
      for (const u of h.by ?? []) {
        let who = null; try { who = await fromUuid(u); } catch (e) { who = null; }
        if (!who) continue;
        // v0.0.426 (the audit): an enemy of the one who damaged it (an ally hit by a Volley that later goes Down doesn't count)
        const wa = who.documentName === "Actor" ? who : who.actor, dw = Number(wa?.getActiveTokens?.()[0]?.document?.disposition ?? wa?.prototypeToken?.disposition), da = Number(a.getActiveTokens?.()[0]?.document?.disposition ?? a.prototypeToken?.disposition);
        if (Number.isFinite(dw) && Number.isFinite(da) && !(dw * da < 0)) continue;
        for (const x of escHooksOf(who)) if (x.when === "damagedDown") await raiseEscalation(who, "hook", { label: `${x.source} (${a.name} goes Down)` });
      }
    } catch (e) { console.warn("twod12 | Escalation hook (damaged)", e); }
  });
  // v0.0.224 (Lucas: the mark stayed after the combat): the combat ends (deleted): every mark of its creatures ends.
  Hooks.on("deleteCombat", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) { const a = c.actor; if (a && quarryOf(a)) await a.unsetFlag(F, "quarry"); }
    try { await (await import("./automation.mjs")).endEncounterEffects(combat); } catch (e) { console.warn("twod12 | encounter effects", e); }   // v0.0.323: "This encounter"
    redrawQuarryMarks();
  });
  // An encounter starts: every mark ends; the "At the start of an encounter" messages are one stack card in the turn order (v0.0.345,
  // startstack.mjs; they were one message each).
  Hooks.on("combatStart", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) {
      const a = c.actor;
      if (!a) continue;
      if (quarryOf(a)) await a.unsetFlag(F, "quarry");
      try { await (await import("./automation.mjs")).applyEncounterStartEffects(a); } catch (e) { console.warn("twod12 | encounter effects", e); }   // v0.0.323
    }
    try { await (await import("./startstack.mjs")).postStartStack(combat); } catch (e) { console.warn("twod12 | start of the encounter", e); }
  });
}
