// Migrations of an Effect's, Feature's or Talent's settings (pure: the tests load it).
import { migrate } from "./fxrules.mjs";
//  v0.0.126: Empowered and Enfeebled are their own setting ("damagestep"), no longer part of Boons and Banes; a passive's Escalation minimum
//  belongs to each setting (minEscalation), no longer to the whole Feature or Talent (passiveEscalation).
export function migrateSettings(source) {
  if (!source || !Array.isArray(source.settings)) return source;
  const itemMin = Number(source.passiveEscalation) || 0;
  const out = [];
  for (const raw of source.settings) {
    const x = { ...raw };
    if (itemMin > 0 && x.minEscalation === undefined) x.minEscalation = itemMin;
    const emp = Math.trunc(Number(x.empowered)) || 0, enf = Math.trunc(Number(x.enfeebled)) || 0;
    if (x.type === "boonbane" && !x.against && (emp > 0 || enf > 0)) {
      const step = { ...x, type: "damagestep", boons: 0, banes: 0, byValue: false, from: [] };
      if ((Number(x.boons) || 0) > 0 || (Number(x.banes) || 0) > 0) out.push({ ...x, empowered: 0, enfeebled: 0 });
      out.push(step);
      continue;
    }
    out.push(x);
  }
  source.settings = out;
  return source;
}

/**
 * v0.0.323 (PACK EFFECT-SHEET): an item whose rules aren't stored yet (rulesOn off) reads its old settings as rules, in memory, on every load (stable ids):
 * the new Details tab shows them, and the first save from it stores the rules with the settings compiled from them. Only a whole source (with its settings)
 * is migrated, never a partial update. host: "effect", "feature", "talent".
 */
export function migrateRules(source, host = "effect") {
  if (!source || source.rulesOn || !Array.isArray(source.settings) || (Array.isArray(source.rules) && source.rules.length)) return source;
  try { const m = migrate(source, host); source.rules = m.rules; if (host === "effect") source.ends = m.ends; } catch (e) { console.warn("twod12 | effect rules", e); }
  return source;
}
