// Values of a creature that text can refer to, e.g. @Move[evade|distance:walk/2] (half your Walk). Results round up.
export const REFERENCES = {
  // Your Speed as it is now: with Hindered, Exhausted and the like (the book's "Speed"), not the base Speed of your Species and Class.
  speed: { label: "Speed (your movement)", get: a => a.system.moveSpeed ?? a.system.speed },
  walk: { label: "Speed (old name)", get: a => a.system.moveSpeed ?? a.system.speed },
  move: { label: "Speed (old name)", get: a => a.system.moveSpeed ?? a.system.speed },
  body: { label: "Body", get: a => a.system.attributes?.body },
  mind: { label: "Mind", get: a => a.system.attributes?.mind },
  appeal: { label: "Appeal", get: a => a.system.attributes?.appeal },
  instinct: { label: "Instinct", get: a => a.system.attributes?.instinct },
  level: { label: "Level", get: a => a.system.level },
  weapon: { label: "Arms Modifier", get: a => a.system.weaponMod },
  // v0.0.358: the names the Effect sheet's formulas use, so a chip's number options read them too (near:pow+2, value:stage)
  wpn: { label: "Arms Modifier", get: a => a.system.weaponMod },
  power: { label: "Power Modifier", get: a => a.system.powerMod ?? a.system.magicMod },
  pow: { label: "Power Modifier", get: a => a.system.powerMod ?? a.system.magicMod },
  sig: { label: "Signature Modifier", get: a => a.system.signatureMod },
  stage: { label: "Stage", get: a => a.system.stage },
  hp: { label: "Health Pool", get: a => a.system.pool },
  rally: { label: "HP healed by a Rally Point", get: a => a.system.rallyHeal }
};

const norm = s => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
/** True when the creature has an item (Talent, Feature, Action...) or an effect with this name ("Battering Charge", spaces and case don't matter). */
export function hasNamed(actor, name) {
  const n = norm(name);
  if (!n) return false;
  const base = s => norm(String(s).replace(/\s*\(.*\)\s*$/, ""));
  return [...(actor?.items ?? []), ...(actor?.effects ?? [])].some(x => norm(x.name) === n || base(x.name) === n);
}

const FUNCS = { floor: Math.floor, ceil: Math.ceil, round: Math.round, min: Math.min, max: Math.max, abs: Math.abs };

/**
 * Evaluate "walk/2", "body+1", "3", "speed+2*has(Battering Charge)", "floor(speed/2)", "min(speed, 3)" for an actor.
 * A result with a fraction is rounded up (use floor(...) to round down). Returns null when it cannot be read.
 */
export function evalExpr(expr, actor) {
  const src = String(expr ?? "").toLowerCase().replace(/\s+/g, "");
  if (!src) return null;
  let bad = false;
  // has(name) is 1 when the creature has that item or effect, otherwise 0: a bonus that only applies with a Talent.
  const withHas = src.replace(/has\(([^)]*)\)/g, (m, name) => (hasNamed(actor, name) ? "(1)" : "(0)"));
  const num = withHas.replace(/[a-z]+/g, name => {
    if (Object.hasOwn(FUNCS, name)) return name;   // floor( ... ), min( ... )
    const ref = Object.hasOwn(REFERENCES, name) ? REFERENCES[name] : null;
    let v = NaN;
    try { v = ref ? Number(ref.get(actor)) : NaN; } catch (e) { /* no creature to read it from */ }
    if (!Number.isFinite(v)) { bad = true; return "0"; }
    return `(${v})`;
  });
  if (bad || !/^(?:[0-9+\-*/().,]|floor|ceil|round|min|max|abs)+$/.test(num)) return null;
  try {
    const v = Function(...Object.keys(FUNCS), `"use strict";return (${num})`)(...Object.values(FUNCS));
    return Number.isFinite(v) ? Math.max(0, Math.ceil(v - 1e-9)) : null;
  } catch (e) { return null; }
}
