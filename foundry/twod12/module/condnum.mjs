// v0.0.501 (Lucas on v0.0.500: the conditions' numbers still didn't show on the token): a condition with a value (Vulnerable 1, Slowed 2,
// Exhausted 3) takes the numbered copy of its icon (icons/conditions/numbered/<id>-<n>.svg, tools/build-cond-numbers.mjs), so Foundry draws the
// number on the token itself, with no change to how Foundry draws effects. The picture follows the value when it is created or changed; once per
// load the active GM brings the effects already on the map to it. Pure helpers first (the tests load them).

export const VALUED_CONDITIONS = ["vulnerable", "slowed", "quickened", "pressed", "sickened", "dazed", "exhausted"];
export const NUMBER_MAX = 9;
const BASE = "systems/twod12/icons/conditions/";
const RE = /^systems\/twod12\/icons\/conditions\/(?:numbered\/)?([a-z-]+?)(?:-(\d+))?\.svg$/;

/** Pure: the condition icon an img names ({ id, n }), or null for any other picture. */
export function iconOf(img) {
  const m = String(img ?? "").match(RE);
  return m ? { id: m[1], n: m[2] ? Number(m[2]) : 0 } : null;
}
/** Pure: the plain icon of a numbered one (the HUD's pill draws its own number). */
export const plainIcon = img => { const c = iconOf(img); return c ? `${BASE}${c.id}.svg` : img; };

/** Pure: the value an effect's data shows: its value flag, else the number its name ends with ("Vulnerable 1"). */
export function valueOf(data) {
  const v = Math.trunc(Number(data?.flags?.twod12?.value));
  if (Number.isFinite(v) && v > 0) return v;
  const m = String(data?.name ?? "").replace(/\s*\([^)]*\)\s*$/, "").trim().match(/\s(\d+)$/);
  return m ? Number(m[1]) : 0;
}

/** Pure: the img an effect should have (its data: img, statuses, flags, name), or "" when it should keep its own. */
export function wantedImg(data) {
  const cur = iconOf(data?.img);
  const st = [...(data?.statuses ?? [])].find(s => VALUED_CONDITIONS.includes(s));
  const id = cur && VALUED_CONDITIONS.includes(cur.id) ? cur.id : st;
  if (!id || (cur && cur.id !== id)) return "";
  if (!cur && data?.img) return "";   // a picture of its own (not the condition's icon): kept
  const n = Math.min(NUMBER_MAX, valueOf(data));
  const want = n > 0 ? `${BASE}numbered/${id}-${n}.svg` : `${BASE}${id}.svg`;
  return want === data?.img ? "" : want;
}

export function registerCondNumbers() {
  const merged = (doc, change) => {
    const d = doc?.toObject?.() ?? {};
    return { img: change?.img ?? d.img, name: change?.name ?? d.name, statuses: change?.statuses ?? d.statuses, flags: foundry.utils.mergeObject(d.flags ?? {}, change?.flags ?? {}, { inplace: false }) };
  };
  Hooks.on("preCreateActiveEffect", (doc, data) => { try { const w = wantedImg(merged(doc, data)); if (w) doc.updateSource({ img: w }); } catch (e) { console.warn("twod12 | a condition's number", e); } });
  Hooks.on("preUpdateActiveEffect", (doc, change) => {
    try {
      if (!("name" in change) && !change?.flags?.twod12 && !("img" in change) && !("statuses" in change)) return;
      const w = wantedImg(merged(doc, change)); if (w) change.img = w;
    } catch (e) { console.warn("twod12 | a condition's number", e); }
  });
  Hooks.once("ready", async () => {
    if (!game.user?.isActiveGM) return;
    const fix = async parent => {
      const ups = [];
      for (const e of parent?.effects ?? []) { const w = wantedImg(e.toObject()); if (w) ups.push({ _id: e.id, img: w }); }
      if (ups.length) { try { await parent.updateEmbeddedDocuments("ActiveEffect", ups); } catch (e) { console.warn("twod12 | a condition's number", e); } }
    };
    for (const a of game.actors ?? []) await fix(a);
    for (const sc of game.scenes ?? []) for (const t of sc.tokens ?? []) if (!t.actorLink && t.actor) await fix(t.actor);
  });
}
