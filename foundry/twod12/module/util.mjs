// Small helpers shared by every module (no Foundry needed, so the tests can load them).

/**
 * v0.0.277 (Lucas: "forced deletion key -=ignoreTerrain using legacy syntax" on every turn start): removes a key in an update.
 * unset("flags.twod12.lean") is { "flags.twod12.lean": ForcedDeletion } where Foundry has it (V14), else the old { "flags.twod12.-=lean": null }.
 */
export function unset(path) {
  const FD = globalThis.foundry?.data?.operators?.ForcedDeletion;
  if (FD) return { [path]: new FD() };
  const k = String(path).split(".");
  k[k.length - 1] = `-=${k[k.length - 1]}`;
  return { [k.join(".")]: null };
}

/** Escape text for HTML (text and double-quoted attributes). */
/** v0.0.295 (Lucas): the Vs. value in its color: AD and WD as the NPC Builder (the Weapon / Power Modifier's), an Attribute (or its Save) in the Attribute's. */
export const VS_COLORS = { ad: "#9a4a00", wd: "#5b3a9e", body: "#7a1626", mind: "#17327a", appeal: "#6b4e00", instinct: "#14532d" };
export function vsColored(vs) {
  const e = String(vs ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return e.replace(/\b(AD|WD)\b|\b(Body|Mind|Appeal|Instinct)( Save)?\b/g, (m, d, a) => `<span class="vsv" style="color:${VS_COLORS[(d ?? a).toLowerCase()]};font-weight:700">${m}</span>`);
}
/** v0.0.314 (pack AU, the AD / WD coloring): the kind of a Vs. word for its color class ("ad", "wd", "adwd", an Attribute, or ""): "AD", "WD 13", "AD/WD", "Bo", "App Save". */
export function vsKind(label) {
  const t = String(label ?? "").trim();
  if (/^AD\b.*\bWD\b/i.test(t)) return "adwd";
  if (/^AD\b/.test(t)) return "ad";
  if (/^WD\b/.test(t)) return "wd";
  const a = t.match(/^(Bo|Mi|Ap|In)/i);
  return a ? ({ bo: "body", mi: "mind", ap: "appeal", in: "instinct" })[a[1].toLowerCase()] : "";
}
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** The hover text of an effect or ability: its own "Hover text" if it has one, else the start of its description (plain text). */
/**
 * v0.0.253 (Lucas): the hover card of an effect or condition (a tooltip in the system's style): the name with its duration, a short description
 * (the item's, cut to its first sentences), and a small line with the controls. Shown through data-tooltip (Foundry renders it as HTML).
 */
export const shortText = (text, max = 260) => {
  const t = String(text ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max), end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > max * 0.4 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "\u2026").trim();
};
export const fxTipHtml = ({ name, dur = "", text = "", what = "", source = "", controls = "" }) => {   // v0.0.267: what (the effect's settings in a line)
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<div class="twod12 fxtip"><div class="ft-head"><b>${e(name)}</b>${dur ? `<span class="ft-dur">${e(dur)}</span>` : ""}</div>${text ? `<div class="ft-text">${e(shortText(text))}</div>` : ""}${what ? `<div class="ft-what">${e(shortText(what, 200))}</div>` : ""}${source ? `<div class="ft-src">${e(source)}</div>` : ""}${controls ? `<div class="ft-ctl">${e(controls)}</div>` : ""}</div>`;
};
/** v0.0.256: the attributes that make an element show an HTML card on hover: Foundry 13 reads data-tooltip-html, older versions data-tooltip (both are written). */
export const tipAttrs = html => { const e = String(html ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); return html ? `data-tooltip-html="${e}" data-tooltip="${e}"` : ""; };
export const hoverOf = (hover, description) => {
  const h = String(hover ?? "").trim().replace(/\{origin\}/g, "its origin");   // v0.0.323: the built text of an effect with no origin yet
  if (h) return h;
  return String(description ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
};

/**
 * v0.0.358 (Lucas: "always use the first name of the actor, unless it is 'The'"): a creature's short name. "Aveline (Human Paladin, Smite, level 1)"
 * and "Aveline Dawnshield" are "Aveline"; "Ogre Chieftain" is "Ogre"; a name that starts with "The" keeps its next word ("The Herald", not "The").
 * Every place that shows only a first name uses it (the flanking overlay, the system's one-line chat messages).
 */
export function firstName(name) {
  const full = String(name ?? ""), w = full.replace(/\s*\([^()]*\)\s*$/, "").trim().split(/\s+/).filter(Boolean);
  if (!w.length) return full;
  return /^the$/i.test(w[0]) && w[1] ? `${w[0]} ${w[1]}` : w[0];
}
/**
 * The names in a line of HTML shortened to first names. names: the creatures' full names (the scene's tokens, the world's actors). Two creatures
 * that would get the same first name ("Ogre Chieftain", "Ogre Brute") keep their names without the parenthesis instead. Pure.
 */
export function shortNames(html, names) {
  const escH = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = [...new Set((names ?? []).map(n => String(n ?? "").trim()).filter(Boolean))], count = new Map();
  for (const n of list) { const f = firstName(n); count.set(f, (count.get(f) ?? 0) + 1); }
  const short = n => (count.get(firstName(n)) > 1 ? n.replace(/\s*\([^()]*\)\s*$/, "").trim() || n : firstName(n));
  let out = String(html ?? "");
  for (const n of list.sort((a, b) => b.length - a.length)) { const s = short(n); if (s === n) continue; for (const form of new Set([escH(n), n])) if (out.includes(form)) out = out.split(form).join(form === n ? s : escH(s)); }
  return out;
}

/* ---- v0.0.361 (PACK PERF): fewer redraws ---- */
/** The Combat flags that are only logs or the undo snapshot: a change of these alone redraws no sheet, strip or Zone (D27, D28, D30, D40). */
export const LOG_FLAG_KEYS = new Set(["encl", "dmgl", "enclog", "dmglog", "snapshot", "enclogAbbr"]);
/** Pure: is this update's diff only log lines (or the old snapshot)? `ch` is what the update hook receives. */
export function logOnlyChange(ch) {
  if (!ch || typeof ch !== "object") return false;
  const top = Object.keys(ch).filter(k => k !== "_id" && k !== "_stats");
  if (top.length !== 1 || top[0] !== "flags") return false;
  const fl = Object.keys(ch.flags ?? {});
  if (fl.length !== 1 || fl[0] !== "twod12") return false;
  const keys = Object.keys(ch.flags.twod12 ?? {});
  return keys.length > 0 && keys.every(k => LOG_FLAG_KEYS.has(k.replace(/^-=/, "")));
}
const soon = new Map();
/**
 * D27: an open window is drawn again once, `ms` after the last of a burst of asks (a turn start writes several documents, each with its hooks).
 * Only an app that is still open is drawn. Returns nothing; the draw is not awaited.
 */
export function renderSoon(app, ms = 60) {
  if (!app) return;
  clearTimeout(soon.get(app));
  soon.set(app, setTimeout(() => { soon.delete(app); try { if (app.rendered) app.render(); } catch (e) { console.warn("twod12 | redraw", e); } }, ms));
}
/** D30, D32, D40: `fn` runs once on the next animation frame, however often it is asked before then (setTimeout 16 ms where there are no frames). */
export function perFrame(fn) {
  let asked = false;
  const raf = globalThis.requestAnimationFrame ?? (f => setTimeout(f, 16));
  return () => { if (asked) return; asked = true; raf(() => { asked = false; fn(); }); };
}

/** v0.0.373: run fn after the earlier calls for the same key have finished (a per-creature queue; automation.mjs's turn-start Effects). */
const fxQueue = new Map();
export function oneAtATime(actor, fn) {
  const key = actor?.uuid ?? String(actor ?? "");
  const run = (fxQueue.get(key) ?? Promise.resolve()).catch(() => {}).then(fn);
  fxQueue.set(key, run);
  run.finally(() => { if (fxQueue.get(key) === run) fxQueue.delete(key); }).catch(() => {});
  return run;
}
