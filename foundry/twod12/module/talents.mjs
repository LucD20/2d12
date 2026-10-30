// Talents (v0.0.186, pack C-a; book 16-talents.md): the Category, the Level and the Prerequisites as data, so the Talent picker can say
// whether a creature can take a Talent and why not. Pure (the tests load it).
import { TWOD12 } from "./config.mjs";

const low = s => String(s ?? "").trim().toLowerCase();
const traitName = k => TWOD12.traits?.[k] ?? k;

/** One Prerequisite in words: "Brawler", "Level 5", "a [Divine] Action", "Body 2", or the Other text. */
export function prereqText(p) {
  switch (p?.kind) {
    case "talent": return String(p.name ?? "").trim() || "(a Talent)";
    case "level": return `Level ${Number(p.value) || 1}`;
    case "trait": return `a [${traitName(low(p.name)) || "?"}] Action`;
    case "attribute": return `${TWOD12.attributes?.[low(p.name)] ?? (p.name || "?")} ${Number(p.value) || 0}`;
    default: return String(p?.name ?? "").trim();
  }
}

/** The Prerequisites line of a Talent: "Heavy Blows", "Lesser Blessing or a [Divine] Action". The old free text when it has no list. */
export function prereqLine(sys) {
  const list = (sys?.prereqs ?? []).map(prereqText).filter(Boolean);
  if (!list.length) return String(sys?.requirements ?? "").trim().replace(/\.$/, "");
  const j = sys?.prereqMode === "any" ? " or " : ", ";
  return list.join(j);
}

/** Is one Prerequisite met by this creature? { ok, checked, why }. Other is never checked (ok, with a note). */
export function prereqMet(actor, p) {
  const sys = actor?.system ?? {}, items = actor?.items ? [...actor.items] : [];
  switch (p?.kind) {
    case "talent": {
      const ok = items.some(i => ["talent", "feature"].includes(i.type) && low(i.name) === low(p.name));
      return { ok, checked: true, why: ok ? "" : `needs the Talent ${p.name}` };
    }
    case "level": {
      const ok = (Number(sys.level) || 1) >= (Number(p.value) || 1);
      return { ok, checked: true, why: ok ? "" : `needs Level ${Number(p.value) || 1}` };
    }
    case "trait": {
      const t = low(p.name);
      const ok = items.some(i => i.type === "action" && (i.system?.traits?.has?.(t) || (Array.isArray(i.system?.traits) && i.system.traits.includes(t))));
      return { ok, checked: true, why: ok ? "" : `needs ${prereqText(p)}` };
    }
    case "attribute": {
      const ok = (Number(sys.attributes?.[low(p.name)]) || 0) >= (Number(p.value) || 0);
      return { ok, checked: true, why: ok ? "" : `needs ${prereqText(p)}` };
    }
    default: return { ok: true, checked: false, why: p?.name ? `check by hand: ${p.name}` : "" };
  }
}

/**
 * Can this creature take this Talent? { ok, reasons: [why not], notes: [what isn't checked] }.
 * Its Level, its Prerequisites (all of them, or any one), and not twice.
 */
export function canTake(actor, talent) {
  const s = talent?.system ?? {}, reasons = [], notes = [];
  const lvl = Number(actor?.system?.level) || 1, need = Number(s.level) || 1;
  if (lvl < need) reasons.push(`needs Level ${need}`);
  if ((actor?.items ? [...actor.items] : []).some(i => i.type === "talent" && low(i.name) === low(talent?.name))) reasons.push("already taken");
  const res = (s.prereqs ?? []).map(p => prereqMet(actor, p));
  for (const r of res) if (!r.checked && r.why) notes.push(r.why);
  const checked = res.filter(r => r.checked);
  if (checked.length) {
    if (s.prereqMode === "any") { if (!checked.some(r => r.ok) && !res.some(r => !r.checked)) reasons.push(`needs ${prereqLine(s)}`); }
    else for (const r of checked) if (!r.ok) reasons.push(r.why);
  }
  return { ok: !reasons.length, reasons: [...new Set(reasons)], notes };
}
