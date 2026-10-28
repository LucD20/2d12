// Floating text on tokens (every client shows it for the tokens it can see):
//   - damage: red numbers for Body, blue for Mind, green for healing of either;
//   - effects: "+ Exhausted 2" when one is added or raised (floats up), "- Exhausted" when removed or lowered (slides down).
// Two styles for the damage numbers: JRPG numbers (a hit is a burst of numbers that add up to it, each thrown up, changing direction at the top, and falling to a random side while it fades; healing floats up slowly like Foundry's own text)
// and Non-JRPG numbers (Foundry's own floating text: "-5", "+6").
// The values before an update are put in the update's options (preUpdate runs on the client that makes the change,
// the options travel with it), so every client can work out the difference.
const F = "twod12";
export const COLORS = { body: "#ff4d4d", mind: "#4da6ff", heal: "#4cd964", fx: "#ffffff" };
export const timing = { stagger: 400, jrpgStagger: 110, digit: 45 };

const setting = (k, d) => { try { const v = game.settings.get(F, k); return v ?? d; } catch (e) { return d; } };
const enabled = () => !!setting("floatText", true);
const style = () => (setting("floatStyle", "jrpg") === "plain" ? "plain" : "jrpg");
const FIELDS = [["bodyLethal", "body", ""], ["bodyNonlethal", "body", " NL"], ["mindLethal", "mind", ""], ["mindNonlethal", "mind", " NL"]];

/** The numbers to show for a change in damage: [{ text, color, kind }]. */
export function damageTexts(prev, now) {
  const out = [];
  for (const [k, pool, tag] of FIELDS) {
    const d = (Number(now?.[k]) || 0) - (Number(prev?.[k]) || 0);
    if (!d) continue;
    out.push(d > 0 ? { text: `\u2212${d}${tag}`, color: COLORS[pool], kind: "damage" } : { text: `+${-d}${tag}`, color: COLORS.heal, kind: "heal" });
  }
  return out;
}

const clean = n => String(n ?? "").replace(/^\s*Effect:\s*/i, "").trim();
const lastNumber = n => { const m = /(\d+)\s*$/.exec(n ?? ""); return m ? Number(m[1]) : null; };
const noNumber = n => clean(n).replace(/\s+\d+\s*$/, "");

/** The text for an effect that was renamed (its value changed), or null. Going down slides down. */
export function renameText(oldName, newName) {
  const a = lastNumber(oldName), b = lastNumber(newName);
  if (b == null || b === a) return null;
  const up = a == null || b > a;
  return { text: `${up ? "+" : "\u2212"} ${clean(newName)}`, color: COLORS.fx, kind: "fx", down: !up };
}

/* ------------------------------------------------------------------ JRPG numbers: the motion, as plain functions */
const clamp01 = p => Math.max(0, Math.min(1, p));

/** The glyphs of a number: the digits (signs are not shown) and "NL" small after them. */
export function glyphs(text) {
  const s = String(text ?? "").replace(/[+\u2212\-\s]/g, "");
  const m = /^(\d+)(NL)?$/.exec(s);
  if (!m) return [...s].map(ch => ({ ch, small: false }));
  return [...[...m[1]].map(ch => ({ ch, small: false })), ...(m[2] ? [...m[2]].map(ch => ({ ch, small: true })) : [])];
}

/** The size of one number's digits (a piece of a hit is small, a single big number is big). */
export const sizeFor = n => Math.round(Math.min(60, 30 + Math.sqrt(Math.max(0, n)) * 6));

/**
 * A hit as a burst of numbers that add up to it, fired one after another (rapid fire): 20 damage might be 5, 7, 4, 4.
 * Small hits stay one number. The pieces are random but always add up exactly.
 */
export function splitDamage(total, rand = Math.random) {
  total = Math.max(0, Math.round(total));
  const k = total <= 6 ? 1 : Math.min(8, Math.ceil(total / 5));
  if (k === 1) return [total];
  const w = Array.from({ length: k }, () => 0.55 + rand() * 0.9);
  const sum = w.reduce((a, b) => a + b, 0);
  const parts = w.map(x => Math.max(1, Math.round((x / sum) * total)));
  let diff = total - parts.reduce((a, b) => a + b, 0);
  for (let i = 0; diff !== 0 && i < 1000; i++) {                      // fix the rounding, one at a time, never below 1
    const p = i % k;
    if (diff > 0) { parts[p]++; diff--; } else if (parts[p] > 1) { parts[p]--; diff++; }
  }
  return parts;
}

/**
 * How one number is thrown: up (drifting a little), then, at the top, it changes direction and falls to a random side, fading before the ground.
 * k and count: the pieces of a burst mostly start toward alternate sides so they spread out.
 */
export function throwParams(gs, size, k = 0, count = 1, rand = Math.random) {
  const dirUp = count <= 1 ? (rand() < 0.5 ? -1 : 1) : (((k + (rand() < 0.3 ? 1 : 0)) % 2 === 0) ? 1 : -1);
  const dirDown = rand() < 0.6 ? -dirUp : dirUp;                    // usually the other way: a clear change of direction
  const apex = gs * (0.5 + rand() * 0.5) + size * 0.3;               // pixels up to the top
  const tUp = 0.3 + rand() * 0.14;                                   // seconds to the top
  return { dirUp, dirDown, vxUp: dirUp * (15 + rand() * 60), vxDown: dirDown * (90 + rand() * 220), vy0: -2 * apex / tUp, g: 2 * apex / (tUp * tUp), tUp, ground: gs * (0.15 + rand() * 0.3), spin: dirDown * (0.5 + rand() * 1.3), apex };
}

/** Where the thrown number is tMs milliseconds after the throw (dy is down). It starts to fade at the top and is gone before it reaches the ground. */
export function throwFrame(tMs, p) {
  const t = Math.max(0, tMs) / 1000;
  const tLand = (-p.vy0 + Math.sqrt(p.vy0 * p.vy0 + 2 * p.g * p.ground)) / p.g;   // when it would reach the ground
  const fadeEnd = p.tUp + (tLand - p.tUp) * 0.8;                                    // gone, a little above the ground
  const dx = t <= p.tUp ? p.vxUp * t : p.vxUp * p.tUp + p.vxDown * (t - p.tUp);
  const dy = p.vy0 * t + 0.5 * p.g * t * t;
  const pop = tMs < 0 ? 0 : 1 + 0.5 * (1 - clamp01(tMs / 180));
  const alpha = tMs < 0 ? 0 : 1 - clamp01((t - p.tUp * 0.9) / (fadeEnd - p.tUp * 0.9));
  return { dx, dy, rot: p.spin * (t / tLand), scale: pop, alpha, done: t >= fadeEnd, tLand, tEnd: fadeEnd };
}

/** Left-to-right positions of the glyphs, centered on 0. */
export function layout(gl, size) {
  const w = g => (g.small ? size * 0.5 : size) * 0.62;
  const total = gl.reduce((a, g) => a + w(g), 0);
  let x = -total / 2;
  return gl.map(g => { const c = x + w(g) / 2; x += w(g); return c; });
}

/* ------------------------------------------------------------------ drawing */
const FONT = '"Lilita One", "Arial Black", Impact, sans-serif';
const recent = new Map();
/** The same text over the same token within a moment is shown once. */
const fresh = (token, text) => { const key = `${token?.id ?? token?.document?.id ?? ""}|${text}`, now = Date.now(); if (now - (recent.get(key) ?? 0) < 350) return false; recent.set(key, now); if (recent.size > 200) for (const [k, t] of recent) if (now - t > 2000) recent.delete(k); return true; };

function spawnPlain(token, t) {
  const anchor = globalThis.CONST?.TEXT_ANCHOR_POINTS?.TOP, bottom = globalThis.CONST?.TEXT_ANCHOR_POINTS?.BOTTOM;
  const slow = t.kind === "heal" && style() === "jrpg";                    // healing in JRPG mode: Foundry's text, bigger and slower
  canvas.interface.createScrollingText(token.center ?? { x: token.x, y: token.y }, t.text, { anchor, direction: t.down ? bottom : anchor, fontSize: slow ? 36 : 30, fill: t.color, stroke: 0x000000, strokeThickness: slow ? 6 : 5, jitter: 0.25, ...(slow ? { duration: 3000 } : {}) });
}

/** One number of a burst, thrown up and to a random side. k and count place it among the others. */
function spawnJrpg(token, t, k = 0, count = 1, delay = 0) {
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? globalThis.PIXI.Text;
  const gl = glyphs(t.text), n = parseInt(String(t.text).replace(/\D+/g, ""), 10) || 0, size = sizeFor(n);
  const gs = canvas.grid?.size ?? 100;
  const p = throwParams(gs, size, k, count);
  const xs = layout(gl, size);
  const center = token.center ?? { x: token.x, y: token.y };
  const box = new PIXI.Container();
  box.position.set(center.x, center.y - gs * 0.1);
  box.zIndex = 100000; box.eventMode = "none";                                                // on top of the token
  canvas.interface.sortableChildren = true;
  canvas.interface.addChild(box);
  const kids = gl.map((g, i) => {
    const s = g.small ? size * 0.5 : size;
    const txt = new PT(g.ch, { fontFamily: FONT, fontSize: s, fill: t.color, stroke: 0x000000, strokeThickness: Math.max(4, Math.round(s / 6)), lineJoin: "round", miterLimit: 2, dropShadow: true, dropShadowColor: 0x000000, dropShadowBlur: 2, dropShadowDistance: 3, dropShadowAlpha: 0.6 });
    txt.anchor?.set?.(0.5, 0.5);
    txt.position.set(xs[i], 0); txt.alpha = 0;
    box.addChild(txt);
    return { txt, delay: i * timing.digit };
  });
  const start = performance.now() + delay, ticker = canvas.app.ticker;
  const tick = () => {
    const now = performance.now() - start;
    const f = throwFrame(now, p);
    box.position.set(center.x + f.dx, center.y - gs * 0.1 + f.dy); box.rotation = f.rot; box.alpha = f.alpha;
    for (const c of kids) { const pop = now - c.delay; c.txt.alpha = pop < 0 ? 0 : 1; c.txt.scale.set(pop < 0 ? 0.2 : 1 + 0.5 * (1 - clamp01(pop / 180))); }
    if (f.done) { ticker.remove(tick); try { box.destroy({ children: true }); } catch (e) { /* already gone */ } }
  };
  ticker.add(tick);
}

export const renderers = { plain: spawnPlain, jrpg: spawnJrpg };

/** Show texts over a creature's tokens. Damage in JRPG style is a burst of numbers firing one after another; healing and effects are Foundry's floating text. */
export function floatOver(actor, texts) {
  if (!texts?.length || !enabled() || !globalThis.canvas?.interface) return;
  const tokens = (actor?.getActiveTokens?.(true) ?? []).filter(t => t?.visible !== false && !t?.document?.hidden || game.user?.isGM);
  const jrpg = style() === "jrpg" && !!globalThis.PIXI && !!canvas.app?.ticker;
  let at = 0;                                                                // when the next text starts (ms)
  for (const t of texts) {
    const burst = jrpg && t.kind === "damage";
    const pieces = burst ? splitDamage(parseInt(String(t.text).replace(/\D+/g, ""), 10) || 0).map(n => ({ ...t, text: `${n}${/NL/.test(t.text) ? " NL" : ""}` })) : [t];
    pieces.forEach((p, k) => {
      const when = at + (burst ? k * timing.jrpgStagger : 0);
      setTimeout(() => {
        for (const token of tokens) {
          if (t.kind === "fx" && !fresh(token, t.text)) continue;      // the same effect text twice at once is shown once (damage pieces are never dropped)
          try { if (burst) renderers.jrpg(token, p, k, pieces.length, 0); else renderers.plain(token, p); }
          catch (e) { console.warn("twod12 | floating text", e); try { renderers.plain(token, { ...p, text: t.text }); } catch (e2) { /* nothing more to try */ } }
        }
      }, when);
    });
    at += burst ? pieces.length * timing.jrpgStagger + 120 : timing.stagger;
  }
}

/** Foundry shows its own "+(Name)" when an effect is added or removed; with ours on, that one is switched off so they don't show together. */
export function silenceCoreText() {
  const done = [];
  const wrap = (proto, name, test) => {
    const orig = proto?.[name];
    if (typeof orig !== "function" || orig.twod12) return;
    const wrapped = function (...args) { if (enabled() && (!test || test(args))) return undefined; return orig.apply(this, args); };
    wrapped.twod12 = true;
    proto[name] = wrapped; done.push(name);
  };
  wrap(globalThis.CONFIG?.ActiveEffect?.documentClass?.prototype, "_displayScrollingStatus");
  // if a Foundry version names it differently: its text always looks like "+(Name)" or "-(Name)"
  if (!done.length) wrap(globalThis.CONFIG?.Token?.objectClass?.prototype, "animateText", args => /^\s*[+\-\u2212]\s*\(/.test(String(args[0] ?? "")));
  return done;
}

export function registerFloatText() {
  game.settings.register(F, "floatText", { name: "Floating text on tokens", hint: "Damage and healing numbers and effects added or removed float from the token.", scope: "client", config: true, type: Boolean, default: true });
  game.settings.register(F, "floatStyle", {
    name: "Damage numbers style",
    hint: "JRPG numbers: the digits pop up one after another, jump, fall and bounce (healing floats up). Non-JRPG numbers: Foundry's plain floating text.",
    scope: "client",
    config: true,
    type: String,
    choices: { jrpg: "JRPG numbers", plain: "Non-JRPG numbers" },
    default: "jrpg"
  });
  silenceCoreText();
  Hooks.once("ready", () => { try { document.fonts?.load?.(`40px ${FONT}`); } catch (e) { /* the font loads when first used */ } });
  const has = (changes, path) => foundry.utils.hasProperty?.(changes, path) ?? false;
  Hooks.on("preUpdateActor", (actor, changes, options) => { if (has(changes, "system.damage")) options.twod12Prev = foundry.utils.deepClone(actor.system?.damage ?? {}); });
  Hooks.on("updateActor", (actor, changes, options) => { if (options?.twod12Prev && has(changes, "system.damage")) floatOver(actor, damageTexts(options.twod12Prev, actor.system?.damage)); });
  Hooks.on("preUpdateActiveEffect", (fx, changes, options) => { if ("name" in (changes ?? {})) options.twod12PrevName = fx.name; });
  Hooks.on("updateActiveEffect", (fx, changes, options) => {
    if (!fx.parent?.getActiveTokens || !("name" in (changes ?? {})) || options?.twod12PrevName == null) return;
    const t = renameText(options.twod12PrevName, fx.name);
    if (t) floatOver(fx.parent, [t]);
  });
  Hooks.on("createActiveEffect", fx => { if (fx.parent?.getActiveTokens && !fx.disabled && clean(fx.name)) floatOver(fx.parent, [{ text: `+ ${clean(fx.name)}`, color: COLORS.fx, kind: "fx" }]); });
  Hooks.on("deleteActiveEffect", fx => { if (fx.parent?.getActiveTokens && clean(fx.name)) floatOver(fx.parent, [{ text: `\u2212 ${noNumber(fx.name)}`, color: COLORS.fx, kind: "fx", down: true }]); });
}
