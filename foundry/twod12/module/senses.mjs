import { tokenLight, seenLight, tokenDistance, LIGHT_NAMES } from "./light.mjs";
import { registerSightGate, registerSightRefresh } from "./sightgate.mjs";
import { modeList, withMode } from "./modes.mjs";

// Perception statuses the GM puts on a token, for how the other side perceives it (see Senses in the rules):
//   Obscured: Actions against it take 1 bane; its Actions against others gain 1 boon.
//   Hidden: Actions against it are Doomed; its Actions against others are Favored (unless they perceive you as Hidden too). Shown to players as a sound ripple.
//   Unsensed: it can't be targeted; its Actions against others are Favored.
// [Area] Actions ignore Senses. Senses per creature (picking the best one by light and range) are not automated yet.
// Like PF2e, a token that is only sensed by hearing is shown to the players as a ripple ("sound wave") through a detection mode.
// Hearing (see Senses in the rules): you perceive creatures that make noise within 10 squares as Hidden, even through walls. A creature makes noise while it is in combat and not Unsensed
// (a creature that hides becomes Unsensed: the rules for hiding are not written yet, so the GM puts the Unsensed status on it).
const MODE_ID = "hearing";
export const HEARING_RANGE = 10;   // squares, unless the creature's Senses say otherwise (0 is deaf)

/** How far a creature hears, in squares. */
export const hearingRange = actor => { const r = Number(actor?.system?.senses?.hearing); return Number.isFinite(r) && r >= 0 ? r : HEARING_RANGE; };

/** Does this token make noise? It is in the combat that has started (and not defeated), and it is not Unsensed (a hiding creature). */
export function makesNoise(token) {
  try {
    if (token?.actor?.statuses?.has?.("unsensed")) return false;
    const cb = game.combat, id = token?.document?.id ?? token?.id;
    if (!cb?.started || !id) return false;
    const c = cb.combatants.find(x => x.tokenId === id);
    return !!c && !(c.isDefeated ?? c.defeated);
  } catch (e) { return false; }
}

/** Does the observer hear the target: it makes noise and is within the observer's Hearing range. Walls don't matter, but a thick wall does (v0.0.525). Without two tokens there is nothing to measure: it is heard unless it is Hiding. */
export function hears(observer, target) {
  if (target?.actor?.statuses?.has?.("unsensed")) return false;
  if (!observer || !target) return true;
  return makesNoise(target) && tokenDistance(observer, target) <= hearingRange(observer.actor) && !thickWallBetween(observer, target);
}

/* ---- v0.0.525 (the cleanup audit, B3-077; book, Chapter 3, Senses: "A thick wall is a wall at least 1 square thick. A thick wall usually blocks
   Hearing and Tremorsense; the GM can rule otherwise"). A wall drawn in Foundry has no thickness, so the GM marks a thick one: the Wall settings'
   "Thick wall (2d12)" checkbox (the flag twod12.thick, as a Tile's "Solid (2d12)"). Foundry's own Sound restriction is not used: every new wall
   blocks sound by default, and the book's Hearing goes through walls. */
/** Pure: do the segments p1-p2 and q1-q2 cross (a touch at an end counts)? Points { x, y }. */
export function segmentsCross(p1, p2, q1, q2) {
  const o = (a, b, c) => Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
  const on = (a, b, c) => Math.min(a.x, b.x) <= c.x && c.x <= Math.max(a.x, b.x) && Math.min(a.y, b.y) <= c.y && c.y <= Math.max(a.y, b.y);
  const d1 = o(q1, q2, p1), d2 = o(q1, q2, p2), d3 = o(p1, p2, q1), d4 = o(p1, p2, q2);
  if (d1 !== d2 && d3 !== d4) return true;
  return (d1 === 0 && on(q1, q2, p1)) || (d2 === 0 && on(q1, q2, p2)) || (d3 === 0 && on(p1, p2, q1)) || (d4 === 0 && on(p1, p2, q2));
}
/** Pure: is a thick wall between two points? walls: [{ c: [x1, y1, x2, y2], thick }] (a wall document's coordinates and its flag). */
export const thickBetween = (a, b, walls = []) => (walls ?? []).some(w => w?.thick && Array.isArray(w.c) && w.c.length >= 4 && segmentsCross(a, b, { x: w.c[0], y: w.c[1] }, { x: w.c[2], y: w.c[3] }));
/** A wall document marked thick by the GM (Wall settings). */
export const isThickWall = doc => !!(doc?.getFlag?.("twod12", "thick") ?? doc?.flags?.twod12?.thick);
const centerOf = t => { if (t?.center && Number.isFinite(t.center.x)) return t.center; const d = t?.document ?? t, g = globalThis.canvas?.grid?.size ?? 100; return { x: (d?.x ?? 0) + ((d?.width ?? 1) * g) / 2, y: (d?.y ?? 0) + ((d?.height ?? 1) * g) / 2 }; };
/** Foundry: a thick wall between two tokens (their centers)? No canvas or no walls: none. */
export function thickWallBetween(a, b) {
  try {
    const walls = (globalThis.canvas?.walls?.placeables ?? []).map(w => w.document ?? w).filter(isThickWall).map(d => ({ c: d.c, thick: true }));
    return walls.length ? thickBetween(centerOf(a), centerOf(b), walls) : false;
  } catch (e) { return false; }
}
/** The Wall settings' checkbox (the Tile's "Solid" way, corners.mjs tileConfigSolid). */
export function wallConfigThick(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const doc = app?.document;
  if (!root || !doc || root.querySelector("[name='flags.twod12.thick']")) return;
  const anchor = root.querySelector("[name='sound']")?.closest(".form-group") ?? root.querySelector(".form-group");
  if (!anchor) return;
  const g = document.createElement("div");
  g.className = "form-group";
  g.innerHTML = `<label>Thick wall (2d12)</label><div class="form-fields"><input type="checkbox" name="flags.twod12.thick" ${isThickWall(doc) ? "checked" : ""}></div><p class="hint">At least 1 square thick: it blocks Hearing and Tremorsense (Chapter 3, Senses). Leave it off for a wall that carries sound.</p>`;
  anchor.after(g);
}

export function registerSenses() {
  try {
    const Base = foundry.canvas?.perception?.DetectionMode ?? globalThis.DetectionMode;
    const Outline = foundry.canvas?.rendering?.filters?.OutlineOverlayFilter ?? globalThis.OutlineOverlayFilter;
    if (!Base || !CONFIG.Canvas?.detectionModes) return console.warn("twod12 | detection modes are not available: Hidden tokens won't show as a sound wave.");
    class HearingMode extends Base {
      static getDetectionFilter() { return this._detectionFilter ??= Outline.create({ outlineColor: [1, 1, 1, 1], knockout: true, wave: true }); }
      _canDetect(visionSource, target) {
        // v0.0.315 (Lucas): a Blinded creature still hears (the ripple stays); only its Sight is gone
        const actor = target?.document?.actor ?? target?.actor;
        if (actor?.statuses?.has?.("unsensed")) return false;   // nobody perceives it: not even by its noise
        // v0.0.514 (Lucas on v0.0.513: "Kaela unsensed vs the goblin still allow the goblin to see the ripples"): Unsensed to this viewer from Hide
        if (actor?.getFlag?.("twod12", "hide")?.[visionSource?.object?.document?.id ?? visionSource?.object?.id] === "unsensed") return false;
        if (actor?.statuses?.has?.("hidden")) return true;   // the GM's Hidden status
        return !!visionSource?.object && !!target && visionSource.object !== target && hears(visionSource.object, target);   // a creature in combat within range
      }
    }
    CONFIG.Canvas.detectionModes[MODE_ID] = new HearingMode({ id: MODE_ID, label: "Hearing (Hidden)", type: Base.DETECTION_TYPES?.SOUND ?? 1, walls: false });
  } catch (e) { console.warn("twod12 | could not register the Hearing detection mode", e); }
  registerSightGate();      // what Foundry shows as seen follows the rules of Light
  registerSightRefresh();   // and it is refreshed when a region, the combat, a status or the Senses change
}

/** New characters can hear: their token gets the Hearing detection mode (no range limit). */
export function giveHearing(actor) {
  try {
    const w = withMode(actor.prototypeToken?.toObject?.().detectionModes, MODE_ID);
    if (w.changed) actor.updateSource({ "prototypeToken.detectionModes": w.value });
  } catch (e) { console.warn("twod12 | could not add Hearing", e); }
}

/**
 * v0.0.319: every token has Hearing when Foundry prepares its data (nothing written to the world), whatever is stored: Foundry tests only the
 * modes a token lists, and NPC tokens had none (the book: "Every creature has Sight and Hearing").
 */
export function hearingOnPrepare() {
  const proto = CONFIG.Token?.documentClass?.prototype;
  const name = ["_prepareDetectionModes", "prepareBaseData"].find(n => typeof proto?.[n] === "function");
  if (!name || proto[name].twod12Hearing) return name ?? "";
  const inner = proto[name];
  const wrapped = function (...args) {
    const r = inner.apply(this, args);
    try {
      if (["character", "npc"].includes(this.actor?.type)) {
        const raw = this.detectionModes, w = withMode(raw, MODE_ID);
        if (w.changed) { if (Array.isArray(raw)) raw.push(w.value.at(-1)); else if (raw && typeof raw === "object" && !raw.contents) raw[MODE_ID] = w.value[MODE_ID]; else this.detectionModes = w.value; }
      }
    } catch (e) { /* the stored modes stay */ }
    return r;
  };
  wrapped.twod12Hearing = true;
  proto[name] = wrapped;
  return name;
}

/** game.twod12.addHearing(): give the Hearing detection mode to every existing creature (prototype token and placed tokens); v0.0.318: NPCs too. */
export async function addHearing({ quiet = false } = {}) {   // v0.0.318: every creature (NPCs too); v0.0.319: in the shape this Foundry stores
  let n = 0, failed = 0;
  for (const actor of game.actors.filter(a => a.type === "character" || a.type === "npc")) {
    const w = withMode(actor.prototypeToken.toObject().detectionModes, MODE_ID);
    if (w.changed) { try { await actor.update({ "prototypeToken.detectionModes": w.value }); n++; } catch (e) { failed++; console.warn("twod12 | Add Hearing", actor.name, e); } }
  }
  for (const scene of game.scenes) {
    const updates = [];
    for (const t of scene.tokens) {
      if (!["character", "npc"].includes(t.actor?.type)) continue;
      const w = withMode(t.toObject().detectionModes, MODE_ID);
      if (w.changed) updates.push({ _id: t.id, detectionModes: w.value });
    }
    if (updates.length) { try { await scene.updateEmbeddedDocuments("Token", updates); } catch (e) { failed++; console.warn("twod12 | Add Hearing (tokens)", scene.name, e); } }
  }
  if (!quiet || failed) ui.notifications[failed ? "warn" : "info"](`Hearing added to ${n} creature${n === 1 ? "" : "s"} and their tokens${failed ? ` (${failed} failed: see the console)` : ""}.`);
  return n;
}

/** How a creature is perceived by the other side, from the GM's statuses: "unsensed", "hidden", "obscured" or "" (Clear). */
export function perceptionOf(actor) {
  const st = actor?.statuses;
  if (st?.has?.("unsensed")) return "unsensed";
  if (st?.has?.("hidden")) return "hidden";
  if (st?.has?.("obscured")) return "obscured";
  return "";
}

const RANK = { unsensed: 0, hidden: 1, obscured: 2, clear: 3 };
/** v0.0.525 (B2-030): a Point Out kept for one observer ({ x, y }: where the target was) holds while the target is still there (pure). */
export const pointedOutHolds = (entry, doc) => !!entry && Number.isFinite(Number(entry.x)) && Number(entry.x) === Number(doc?.x) && Number(entry.y) === Number(doc?.y);
/**
 * v0.0.410 (pack F2; book, Senses: the two questions): what you gain from how the target perceives you ("boon": 1 Field Boon, "favored", or "").
 * Only when it perceives you worse than you perceive it, and never against a creature that is Hidden (or Unsensed) to you. seen: how you perceive
 * it, mine: how it perceives you ("" or "clear", "obscured", "hidden", "unsensed"). Two creatures each Obscured to the other gain nothing.
 */
/** Pure: one step better (Spotter's Call Out): Hidden as Obscured, Obscured as Clear; Unsensed and Clear stay. */
export const calledOut = best => (best[0] === "hidden" ? ["obscured", `${best[1]} (Called Out)`] : best[0] === "obscured" ? ["clear", `${best[1]} (Called Out)`] : best);
export function youGain(seen, mine) {
  const r = v => RANK[v || "clear"] ?? 3, sv = seen || "clear", mv = mine || "clear";
  if (sv === "hidden" || sv === "unsensed" || r(mv) >= r(sv)) return "";
  return mv === "obscured" ? "boon" : "favored";
}
const CAP = { unsensed: "Unsensed", hidden: "Hidden", obscured: "Obscured", clear: "Clear" };

/**
 * How the observer's token perceives the target's token, with its best sense (see Senses in the rules):
 * Sight (light at the target's brightest square, after Dim-light Sight / Dark Sight; needs Line of Effect),
 * Hearing (Hidden: the target is in combat, not Unsensed and within the Hearing range; the GM's Hidden status counts as heard too), and the observer's other senses within their range and condition.
 * The GM's Obscured / Hidden / Unsensed statuses on the target only ever make it worse.
 * Returns { level: "clear" | "obscured" | "hidden" | "unsensed", why }.
 */
export function perceive(observer, target, { loe = true, noHide = false } = {}) {
  const o = observer?.actor, t = target?.actor;
  const os = o?.system?.senses ?? {};
  if (o?.statuses?.has?.("unconscious")) return { level: "unsensed", why: "Unconscious: every creature is Unsensed to you", name: CAP.unsensed };   // the Unconscious rule
  const options = [];
  const blind = !!o?.statuses?.has?.("blinded") || !!o?.statuses?.has?.(CONFIG.specialStatusEffects?.BLIND ?? "blind");   // v0.0.316: the system's Blinded
  if (loe && !blind && target) {
    const raw = tokenLight(target), light = seenLight(raw, os);
    const how = light === raw ? `Sight, ${LIGHT_NAMES[raw]} light` : `Sight (${os.darksight ? "Dark Sight" : "Dim-light Sight"}), ${LIGHT_NAMES[raw]} light`;
    // v0.0.409 (pack F2; book, Chapter 8, Half-Blinded): its Sight perceives no creature better than Obscured
    if (light === "bright") options.push(o?.statuses?.has?.("half-blinded") ? ["obscured", `${how} (Half-Blinded)`] : ["clear", how]);
    else if (light === "dim") options.push(["obscured", how]);
  }
  if (hears(observer, target)) options.push(["hidden", "Hearing"]);
  else if (t?.statuses?.has?.("hidden")) options.push(["hidden", "the GM's Hidden status"]);   // the GM says it is heard
  if (observer && target) {
    const dist = tokenDistance(observer, target);
    for (const s of os.list ?? []) {
      if (!s?.name || !RANK[s.gives] || dist > (Number(s.range) || 0)) continue;
      if (s.needs === "heat" && t?.system?.senses?.noHeat) continue;
      if (s.needs === "ground" && (observer.document?.elevation ?? 0) !== (target.document?.elevation ?? 0)) continue;
      if (s.needs === "ground" && thickWallBetween(observer, target)) continue;   // v0.0.525 (B3-077): Tremorsense, no thick wall between
      options.push([s.gives, `${s.name} (${s.range} sq.)`]);
    }
  }
  let best = options.reduce((a, c) => (!a || RANK[c[0]] > RANK[a[0]] ? c : a), null) ?? ["unsensed", "no sense reaches it"];
  // v0.0.525 (the cleanup audit, B2-030; book, Point Out: "Unsensed becomes Hidden, whatever the reason"): an ally's Point Out makes this observer
  // perceive the target as Hidden at least, while the target stays in the square it was pointed out in (hide.mjs pointOut)
  if (observer?.document?.id && target?.document && RANK[best[0]] < RANK.hidden && pointedOutHolds(t?.getFlag?.("twod12", "pointedOut")?.[observer.document.id], target.document)) best = ["hidden", "Point Out"];
  // v0.0.411 (pack F3, Spotter's Call Out): a Called Out creature is perceived one step better by its enemies (Hidden as Obscured, Obscured as Clear)
  // v0.0.426 (the audit; book, Spotter: "Your allies perceive the target one step better"; "You are never your own ally"): the caller's allies only,
  // the caller excluded (the effect's origin); with no origin kept, every enemy of the target as before
  if (t?.statuses?.has?.("called-out") && observer?.document && target?.document && Number(observer.document.disposition) !== Number(target.document.disposition)) {
    const fx = [...(t.effects ?? [])].find(e => e.statuses?.has?.("called-out")), by = fx?.origin ?? "";
    let caller = null; try { caller = by ? globalThis.fromUuidSync?.(by) : null; } catch (e) { caller = null; }
    const callerActor = caller?.documentName === "Actor" ? caller : caller?.actor ?? null;
    const callerDisp = callerActor ? Number(callerActor.token?.disposition ?? callerActor.getActiveTokens?.()[0]?.document?.disposition ?? callerActor.prototypeToken?.disposition) : null;
    const isCaller = !!callerActor && observer.actor?.uuid === callerActor.uuid;
    if (!callerActor || (!isCaller && Number(observer.document.disposition) === callerDisp)) best = calledOut(best);
  }
  const st = perceptionOf(t);
  if (st && RANK[st] < RANK[best[0]]) best = [st, `${CAP[st]} (status)`];
  // v0.0.513 (the Hide package; book, Chapter 3, Hiding): Hidden or Unsensed from Hide, against this observer only; the worse of it and the senses
  if (!noHide && observer?.document?.id) { const hs = t?.getFlag?.("twod12", "hide")?.[observer.document.id]; if ((hs === "hidden" || hs === "unsensed") && RANK[hs] < RANK[best[0]]) best = [hs, `${CAP[hs]} (Hide)`]; }
  return { level: best[0], why: best[1], name: CAP[best[0]] };
}

/**
 * v0.0.317 (Lucas: a Blinded token shows no ripples): game.twod12.hearInfo(): for each controlled token, whether it can hear and what it hears.
 * A ripple needs: the Hearing mode on the observer's token (enabled), a started combat with the target in it (a creature makes noise only in
 * combat) or the GM's Hidden status on the target, and the target within the Hearing range. Prints a line per creature and returns it.
 */
export function hearInfo() {
  const sel = canvas?.tokens?.controlled ?? [];
  if (!sel.length) { ui.notifications.warn("Select the token that should hear (the Blinded one)."); return []; }
  const out = [];
  for (const o of sel) {
    const raw = o.document?.detectionModes, modes = modeList(raw), hm = modes.find(m => m.id === MODE_ID);
    const shape = Array.isArray(raw) ? "a list" : raw?.contents ? "a collection" : raw && typeof raw === "object" ? "a record" : String(raw);
    let stored = ""; try { stored = JSON.stringify(o.document?.toObject?.().detectionModes); } catch (e) { stored = "?"; }
    out.push(`${o.name}: its modes (${shape}): ${modes.map(m => `${m.id}${m.enabled === false ? " (off)" : ""}`).join(", ") || "none"}; stored: ${stored}; vision ${o.document?.sight?.enabled !== false ? "on" : "OFF"}`);
    const head = `${o.name}: Hearing mode ${hm ? (hm.enabled === false ? "OFF on the token" : `on (range ${hm.range ?? "none"})`) : "MISSING on the token (Add Hearing)"}; Blinded ${!!o.actor?.statuses?.has?.("blinded")}; combat started ${!!game.combat?.started}; hearing range ${hearingRange(o.actor)} sq.`;
    out.push(head);
    for (const t of canvas.tokens.placeables) {
      if (t === o || !t.actor) continue;
      out.push(`  ${t.name}: makes noise ${makesNoise(t)} (in the combat: ${!!game.combat?.combatants?.find?.(c => c.tokenId === t.id)}), GM Hidden ${!!t.actor.statuses?.has?.("hidden")}, Unsensed ${!!t.actor.statuses?.has?.("unsensed")}, ${Math.round(tokenDistance(o, t) * 10) / 10} sq. away -> heard ${hears(o, t) || !!t.actor.statuses?.has?.("hidden")}; shown now ${t.visible}`);
    }
  }
  console.log(out.join("\n"));
  ui.notifications.info("Hearing: the details are in the console (F12).");
  return out;
}
