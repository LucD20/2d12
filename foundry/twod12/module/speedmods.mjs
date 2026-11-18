// Speed changes from effects: "override: floor(speed/2)" replaces the Speed, "add: 2" adds to it.
import { allEffects, isBaseSource } from "./passives.mjs";
import { effectOff, seesOrigin } from "./escalation.mjs";
import { bonusTotal } from "./fxrules.mjs";
const F = "twod12";

/** Evaluate a formula such as floor(speed/2), ceil(speed*0.5), min(speed, 3) or 2. Returns null when it cannot be read. */
export function evalSpeed(formula, speed) {
  const src = String(formula ?? "").toLowerCase().replace(/\s+/g, "");
  if (!src) return null;
  const expr = src.replace(/\b(speed|walk|move)\b/g, `(${speed})`).replace(/\b(floor|ceil|round|min|max|abs)\(/g, "Math.$1(");
  if (!/^[0-9+\-*/().,Mathfloorceilroundminxabs]+$/.test(expr)) return null;
  try { const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? v : null; } catch (e) { return null; }
}

/** The Speed after the actor's effects: additions, bonuses and opts.minus (Exhausted) first, then the overrides (halving), never below 0 (rounded up).
 *  opts.baseOnly: only always-on passives. */
export function applySpeedMods(actor, base, opts = {}) {
  let speed = Number(base) || 0;
  const mods = [];
  const seen = new Set();
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e) || (opts.baseOnly && !isBaseSource(e))) continue;
    for (const m of e.getFlag?.(F, "speedMods") ?? e.flags?.[F]?.speedMods ?? []) {
      if (m.seen && !seesOrigin(actor, e)) continue;   // v0.0.323
      // A creature can't have the same condition twice: identical changes (Prone's Hindered and Hindered) count once.
      const key = `${m.mode}|${String(m.formula).replace(/\s+/g, "").toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key); mods.push(m);
    }
  }
  // v0.0.431 (the book audit Q12; Chapter 3, Changes to your Speed: "Apply every other change first, then halve it"): the additions, the bonuses and
  // Exhausted (opts.minus, to a minimum of 1) first, then the overrides (Hindered's floor(speed/2)). Before: the overrides came first.
  const base0 = speed;
  for (const m of mods.filter(x => x.mode !== "override" && x.kind !== "bonus")) { const v = evalSpeed(m.formula, base0); if (v !== null) speed += v; }
  // v0.0.323 (PACK EFFECT-SHEET; the book's Stacking): bonuses to Speed: different names add, the same name the highest, an unnamed one doesn't add to another
  const bon = mods.filter(x => x.mode !== "override" && x.kind === "bonus").map(m => ({ name: m.name || "", n: evalSpeed(m.formula, base0) ?? 0 }));
  if (bon.length) speed += bonusTotal(bon);
  if (Number(opts.minus) > 0) speed = Math.max(1, speed - Number(opts.minus));
  speed = Math.max(0, speed);
  for (const m of mods.filter(x => x.mode === "override")) { const v = evalSpeed(m.formula, Math.max(0, Math.ceil(speed - 1e-9))); if (v !== null) speed = v; }
  return Math.max(0, Math.ceil(speed - 1e-9));
}
