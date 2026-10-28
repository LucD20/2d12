// Speed changes from effects: "override: floor(speed/2)" replaces the Speed, "add: 2" adds to it.
import { allEffects, isBaseSource } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
const F = "twod12";

/** Evaluate a formula such as floor(speed/2), ceil(speed*0.5), min(speed, 3) or 2. Returns null when it cannot be read. */
export function evalSpeed(formula, speed) {
  const src = String(formula ?? "").toLowerCase().replace(/\s+/g, "");
  if (!src) return null;
  const expr = src.replace(/\b(speed|walk|move)\b/g, `(${speed})`).replace(/\b(floor|ceil|round|min|max|abs)\(/g, "Math.$1(");
  if (!/^[0-9+\-*/().,Mathfloorceilroundminxabs]+$/.test(expr)) return null;
  try { const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? v : null; } catch (e) { return null; }
}

/** The Speed after the actor's effects: overrides first, then additions, never below 0 (rounded up). opts.baseOnly: only always-on passives. */
export function applySpeedMods(actor, base, opts = {}) {
  let speed = Number(base) || 0;
  const mods = [];
  const seen = new Set();
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e) || (opts.baseOnly && !isBaseSource(e))) continue;
    for (const m of e.getFlag?.(F, "speedMods") ?? e.flags?.[F]?.speedMods ?? []) {
      // A creature can't have the same condition twice: identical changes (Prone's Hindered and Hindered) count once.
      const key = `${m.mode}|${String(m.formula).replace(/\s+/g, "").toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key); mods.push(m);
    }
  }
  for (const m of mods.filter(x => x.mode === "override")) { const v = evalSpeed(m.formula, speed); if (v !== null) speed = v; }
  for (const m of mods.filter(x => x.mode !== "override")) { const v = evalSpeed(m.formula, speed); if (v !== null) speed += v; }
  return Math.max(0, Math.ceil(speed - 1e-9));
}
