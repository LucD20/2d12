// v0.0.297 PACK ACTION-PREVIEW (Lucas's design D2 "Ink and gold, book order", foundry/mockups/action-preview-prototype.html):
// the pure pieces of the Action card that opens in place on the sheets (actioncard.mjs draws it). No Foundry here, so the tests (t216) load it.
//   - which Version you can pay (one logic with the row's "Not enough AP", sheetmodel.mjs payReaction / versionCant)
//   - the "Your roll" strip's chips: the self-side modifiers the roll dialog detects by itself (rollinput.mjs), applies or not, with the reason
//   - the Tier labels written in full, the ruler line only in Designer mode, the Effects lines (one per Version)
import { versionCant } from "./sheetmodel.mjs";

/** The labels of the Tier table, in full (Lucas): "Tier 1", "Tier 2", "Tier 3", "Critical"; "Tiers 1–3" when the three are the same. */
export const TIER_LABELS = { 1: "Tier 1", 2: "Tier 2", 3: "Tier 3", all: "Tiers 1–3", crit: "Critical" };
export const tierLabel = k => TIER_LABELS[k] ?? "";

/**
 * Each Version's head button: "Use · 2 AP" (a Reaction "Use · 1R"), struck when you can't pay it, with the reason on hover.
 * c: { reaction, inCombat, ap, rap, free }. Out of combat (or a free use) nothing is struck: AP are only counted in a started combat, as the row's Use.
 * Returns [{ ap, cost: "2 AP", label: "Use · 2 AP", off, why }].
 */
export function versionButtons(aps = [], { reaction = false, inCombat = false, ap = 0, rap = 0, free = false } = {}) {
  return aps.map(a0 => {
    const n = Math.max(0, Math.trunc(Number(a0)) || 0), cost = reaction ? `${n}R` : `${n} AP`;
    const why = inCombat && !free ? versionCant(n, ap, reaction ? rap : 0, reaction) : "";
    return { ap: n, cost, label: `Use · ${cost}`, off: !!why, why };
  });
}

const reEsc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A chip's label is the name only: "Flanking (Bandit, 2 Boons)" → "Flanking", "Target is Obscured (1 Bane)" → "Target is Obscured" (the roll dialog's labels). */
export const cleanLabel = (name, targetName = "") => {
  let s = String(name ?? "");
  if (targetName) s = s.replace(new RegExp(`\\s*\\(${reEsc(targetName)}(,[^)]*)?\\)`), "");
  return s.replace(/\s*\(\d+\s+(?:(?:Field|Pressure|Support)\s+)?(?:Boons?|Banes?)\)\s*$/i, "").trim();   // v0.0.303: "(1 Field Bane)" too: the chip's name tag says it
};

/** "Word of Radiance is not a Strike" (bonus.mjs bonusesNotNow) → "Not this Action: not a Strike". */
export const notThisWhy = (why, name = "") => {
  const w = String(why ?? "").trim();
  if (!w) return "Not this Action";
  if (/already used this round/i.test(w)) return "Not now: already used this round";
  const rest = name ? w.replace(new RegExp(`^${reEsc(name)}\\s+is\\s+`, "i"), "") : w;
  return `Not this Action: ${rest.replace(/^this Action is\s+/i, "")}`;
};

/**
 * "Your roll": the chips the roll dialog would show by itself for this Action, about you only (Cover, Flanking, the target's own effects and
 * Defense stay in the dialog). src (gathered by actioncard.mjs from the dialog's own sources):
 *   mods: modifierList(actor, traits, []) — { id, name, boons, banes, match, predicate, naWhy }; ids with "|" (one target's) are left out
 *   doom: "Unconscious" / "Untrained armor" / ""      exhausted: N
 *   steps: { empowered: [{ name, n }], enfeebled: [...] }   (damageSteps without a target)
 *   bonuses: [{ effect, dmg, sub }]   (collectBonuses on Tiers 1-3, without a target)
 *   notNow: [{ effect, why }]   (bonusesNotNow)        name: the Action's name (to shorten the reasons)
 * Returns [{ kind: "bane"|"boon"|"doom"|"flat"|"emp"|"enf"|"pass", label, applies, why }]: applies false = struck, the reason on hover.
 */
export function rollStripChips({ mods = [], doom = "", exhausted = 0, steps = {}, bonuses = [], notNow = [], name = "" } = {}) {
  const out = [];
  for (const m of mods) {
    if (m.info || !(m.boons || m.banes) || String(m.id ?? "").includes("|") || String(m.id ?? "").startsWith("syn:")) continue;
    const boon = (m.boons ?? 0) >= (m.banes ?? 0) && m.boons > 0, n = boon ? m.boons : m.banes;
    const label0 = cleanLabel(m.name), label = n > 1 && !/\d/.test(label0) ? `${label0} ×${n}` : label0;
    const pred = String(m.naWhy || m.predicate || "").trim();
    out.push({ kind: boon ? "boon" : "bane", label, applies: !!m.match, why: m.match ? `${n} ${boon ? "Boon" : "Bane"}${n === 1 ? "" : "s"}${pred ? `: ${pred}` : ""}` : notThisWhy(pred ? `${pred}` : "", name) });
  }
  if (doom) out.push({ kind: "doom", label: doom, applies: true, why: `${doom}: all your Rolls are Doomed` });
  const exh = Math.max(0, Math.trunc(Number(exhausted)) || 0);
  if (exh) out.push({ kind: "bane", label: `Exhausted ${exh}`, applies: true, why: `Exhausted ${exh}: ${exh} Bane${exh === 1 ? "" : "s"} on all your Rolls` });   // the core rework A5: Banes, not a penalty
  // v0.0.407 (book, Chapter 8): Empowered has no value; Enfeebled is gone
  for (const x of (steps.empowered ?? []).slice(0, 1)) out.push({ kind: "emp", label: "Empowered", applies: true, why: `${x.name}: +1d6! on the first damage of each of your turns` });
  const seen = new Set();
  for (const b of bonuses) {
    if (seen.has(b.effect)) continue;
    seen.add(b.effect);
    out.push({ kind: "pass", label: b.effect, applies: true, why: b.dmg ? `+${b.dmg}${b.sub ? ` ${b.sub}` : ""} damage` : String(b.text ?? "").replace(/<[^>]+>/g, "") });
  }
  for (const b of notNow) {
    if (seen.has(b.effect)) continue;
    seen.add(b.effect);
    out.push({ kind: "pass", label: b.effect, applies: false, why: notThisWhy(b.why, name) });
  }
  return out;
}

/** The roll's Modifier as the strip writes it: "Signature +2", "Power −1" (rollSource's chip: "Signature Modifier"). */
export const modText = (chip, mod) => {
  const n = Math.trunc(Number(mod)) || 0;
  return `${String(chip ?? "").replace(/\s*Modifier$/i, "").trim() || "Modifier"} ${n >= 0 ? `+${n}` : `−${-n}`}`;
};

/** The ruler line ("Ruler: 1 AP 1.40× ..."), only in Designer mode; its text without the "Ruler:" word (the card writes it in bold). */
export const rulerText = (worth, designer) => (designer && String(worth ?? "").trim() ? String(worth).trim().replace(/^Ruler:?\s*/i, "") : "");

/**
 * The Effects block: one line per Version (its cost badge), written once when every Version has the same text; a Split Action's two modes at
 * the same cost once. versions: [{ ap, effects, noTiers }]. Returns { title, lines: [{ ap, text, badge }] } (badge false: no cost badge).
 */
export function effectLines(versions = []) {
  const fxv = versions.filter(v => v.effects).filter((v, i, all) => all.findIndex(w => w.ap === v.ap && w.effects === v.effects) === i);
  if (!fxv.length) return { title: "", lines: [] };
  const title = "Effects";   // v0.0.453: an Effect happens whatever the roll (the book's Effect Timing)
  const once = fxv.length === versions.length && fxv.every(v => v.effects === fxv[0].effects);
  const multi = versions.length > 1;
  return { title, lines: once ? [{ ap: fxv[0].ap, text: fxv[0].effects, badge: false }] : fxv.map(v => ({ ap: v.ap, text: v.effects, badge: multi })) };
}

/** Whether the card shows the "Your roll" strip: an Action that rolls (a Version with Tiers), not a Save Action (the targets roll). */
export const rollsItself = (versions = [], traits = new Set()) => versions.some(v => !v.noTiers) && !(traits?.has?.("save"));
