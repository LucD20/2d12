// v0.0.501 (Lucas on v0.0.500: the conditions' numbers didn't show on the token): a valued condition took a numbered copy of its icon.
// v0.0.503 (Lucas on v0.0.502: "I think it just doesnt work on the token, just leave without a number on it"): the numbered icons are gone; an
// effect that still names one (a world from v0.0.501 / 502) gets its plain icon back, when it is created or changed, and once per load by the
// active GM. The number stays on the HUD's pills and the effects panel beside the chat. Pure helpers first (the tests load them).

const BASE = "systems/twod12/icons/conditions/";
const RE = /^systems\/twod12\/icons\/conditions\/(?:numbered\/)?([a-z-]+?)(?:-(\d+))?\.svg$/;

/** Pure: the condition icon an img names ({ id, n, numbered }), or null for any other picture. */
export function iconOf(img) {
  const m = String(img ?? "").match(RE);
  return m ? { id: m[1], n: m[2] ? Number(m[2]) : 0, numbered: String(img).includes("/numbered/") } : null;
}
/** Pure: the plain icon of a numbered one (any other picture as it is). */
export const plainIcon = img => { const c = iconOf(img); return c?.numbered ? `${BASE}${c.id}.svg` : img; };

/** Pure: the value an effect's data shows: its value flag, else the number its name ends with ("Vulnerable 1"). */
export function valueOf(data) {
  const v = Math.trunc(Number(data?.flags?.twod12?.value));
  if (Number.isFinite(v) && v > 0) return v;
  const m = String(data?.name ?? "").replace(/\s*\([^)]*\)\s*$/, "").trim().match(/\s(\d+)$/);
  return m ? Number(m[1]) : 0;
}

/** Pure: the img an effect should have instead of its own (a numbered icon's plain one), or "" to keep it. */
export const restoredImg = data => { const c = iconOf(data?.img); return c?.numbered ? `${BASE}${c.id}.svg` : ""; };

export function registerCondNumbers() {
  // v0.0.504 (Lucas's console on v0.0.503: "Invalid Asset .../numbered/vulnerable-2.svg" at Token._drawEffect): the tokens drew before the GM's
  // pass below fixed the data, so an effect's prepared data takes the plain icon at once, in memory, on every client
  try {
    const P = CONFIG.ActiveEffect?.documentClass?.prototype, inner = P?.prepareDerivedData;
    if (P && typeof inner === "function" && !inner.twod12Plain) {
      const wrapped = function (...args) { const r = inner.apply(this, args); try { const w = restoredImg({ img: this.img }); if (w) this.img = w; } catch (e) { /* kept */ } return r; };
      wrapped.twod12Plain = true;
      P.prepareDerivedData = wrapped;
    }
  } catch (e) { console.warn("twod12 | a condition's icon", e); }
  Hooks.on("preCreateActiveEffect", (doc, data) => { try { const w = restoredImg({ img: data?.img ?? doc?.img }); if (w) doc.updateSource({ img: w }); } catch (e) { /* kept */ } });
  Hooks.on("preUpdateActiveEffect", (doc, change) => { try { if ("img" in change) { const w = restoredImg(change); if (w) change.img = w; } } catch (e) { /* kept */ } });
  Hooks.once("ready", async () => {
    if (!game.user?.isActiveGM) return;
    const fix = async parent => {
      const ups = [];
      for (const e of parent?.effects ?? []) { const w = restoredImg({ img: e._source?.img ?? e.img }); if (w) ups.push({ _id: e.id, img: w }); }   // the stored data (the prepared one is plain already)
      if (ups.length) { try { await parent.updateEmbeddedDocuments("ActiveEffect", ups); } catch (e) { console.warn("twod12 | a condition's icon", e); } }
    };
    for (const a of game.actors ?? []) await fix(a);
    for (const sc of game.scenes ?? []) for (const t of sc.tokens ?? []) if (!t.actorLink && t.actor) await fix(t.actor);
  });
}
