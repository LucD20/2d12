// Generate Action (v0.0.136): a whole Action from a dialog. Name, Traits, Frequency, Target, Distance; per version its cost, Tiers 1-3,
// Critical and Effects. The tiers are written like the card ("[B] 1d8 Co; Hindered (EoT)", "1[W]", "[Mod]", "[M] 2d6 Ho"); the short
// codes of the old generator still work ("1WB, 1d8MCo"). A live preview of the card and an "Understood" line.
// From the NPC sheet it creates the Action on the NPC; with an Action (its sheet) it fills that Action; otherwise a world item.
import { TWOD12, subtypeCode } from "./config.mjs";
import { parseTierFull, convertEffects } from "./gen.mjs";
import { rawTierLine } from "./preview.mjs";

const blank = () => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "" });

/** Split at a separator outside brackets, parentheses and quotes. */
function splitTop(str, sep) {
  const out = []; let cur = "", depth = 0, q = false;
  for (const ch of String(str ?? "")) {
    if (ch === '"') q = !q;
    if (!q) { if ("[({".includes(ch)) depth++; else if ("])}".includes(ch)) depth = Math.max(0, depth - 1); }
    if (ch === sep && !q && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}

const PART = /^(?:\[([BMCVR])\]\s*)?(?:(\d*)\s*\[W\]|\[(?:At|Mod)\]|(\d+d\d+!?(?:[+-]\d+)?|\d+))(?:\s+([A-Za-z]+))?$/i;   // v0.0.409: a die written with ! (Smite's 1d6!)

/** One damage piece written like the card ("[B] 1[W] Sl + [M] 1d6 Ho"): its Instances, or null if it isn't damage. */
function cardDamage(piece) {
  const insts = [];
  let pool = "B";
  for (const raw of piece.split(/\s\+\s/)) {
    const m = raw.trim().match(PART);
    if (!m) return null;
    if (m[1]) pool = ({ V: "B", R: "M" })[m[1].toUpperCase()] ?? m[1].toUpperCase();   // pack R-core: [V] / [R] are the B / M pools
    const sub = m[4] ? subtypeCode(m[4]) : "";
    if (m[4] && !sub) return null;   // a word that is no damage type: not damage
    const i = { ...blank(), pool, subtype: sub };
    if (m[2] !== undefined && /\[W\]/i.test(raw)) Object.assign(i, { useW: true, wCount: Math.max(1, Number(m[2]) || 1) });
    else if (/\[(?:At|Mod)\]/i.test(raw)) i.useAt = true;
    else i.dice = m[3].replace(/\s+/g, "");
    insts.push(i);
  }
  return insts;
}

/** A tier written like the card or with the short codes: { insts, text, plain } (plain: the pieces it kept as written, not understood). */
export function parseCardTier(text) {
  const insts = [], texts = [], plain = [];
  for (const piece of splitTop(text, ";")) {
    const dmg = cardDamage(piece);
    if (dmg) { insts.push(...dmg); continue; }
    const old = parseTierFull(piece);   // short codes, commas, quoted text
    insts.push(...old.insts);
    if (old.text) texts.push(old.text);
    if (!old.insts.length && old.text && !old.text.includes("@") && !/^".*"$/.test(piece.trim())) plain.push(piece.trim());
  }
  return { insts, text: texts.join("; "), plain };
}

/** What the generator did not understand: tier pieces and Criticals that are neither damage nor a known effect (kept as plain text; "quoted" text is on purpose). */
export function notUnderstood(f) {
  const out = [];
  for (const v of f.versions ?? []) {
    for (const n of [1, 2, 3]) out.push(...parseCardTier(v[`t${n}`]).plain);
    const c = String(v.critical ?? "").trim();
    if (c && !convertEffects(c).includes("@")) out.push(c);
  }
  return [...new Set(out)];
}

const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
/** The simple buttons back to words, as they are typed: @Condition[hindered|eot] -> Hindered (EoT), @Move[pushed|distance:2] -> Pushed 2, @Save[appeal] -> Appeal Save. */
export function humanize(text) {
  return String(text ?? "")
    .replace(/@Condition\[(\w+)(?:\|(eot|rounds:(\d+)))?\]/g, (m, c, d, r) => `${cap(c)}${d ? ` (${r ? `${r} round${r === "1" ? "" : "s"}` : "EoT"})` : ""}`)
    .replace(/@Move\[(pushed|pulled|slid|advance|evade|reposition)\|distance:([^\]|]+)\]/g, (m, k, d) => `${cap(k)} ${d}`)
    .replace(/@Save\[(\w+)\]/g, (m, a) => `${cap(a)} Save`)
    .replace(/@Check\[(\w+)\]/g, (m, a) => `${cap(a)} Check`);
}

/** A version's tier back to the card's way of writing it. */
export function tierCardText(v, n) {
  const { dmg, effects } = rawTierLine(v?.[`t${n}`] ?? [], v?.[`x${n}`] ?? "");
  return [dmg, ...effects.map(humanize)].filter(Boolean).join("; ");
}

/** The form's values to the Action's system data. */
export function actionFromForm(f) {
  const versions = (f.versions ?? []).map(v => {
    const t = [1, 2, 3].map(n => parseCardTier(v[`t${n}`]));
    const noTiers = t.every(x => !x.insts.length && !x.text) && !String(v.critical ?? "").trim();
    return { ap: Math.max(0, Math.min(5, Math.trunc(Number(v.ap)) || 0)), mode: "", noTiers, t1: t[0].insts, t2: t[1].insts, t3: t[2].insts, x1: t[0].text, x2: t[1].text, x3: t[2].text,
      critical: convertEffects(v.critical ?? ""), effects: convertEffects(v.effects ?? ""), fx: { all: [], t1: [], t2: [], t3: [] } };
  });
  return { traits: [...(f.traits ?? [])], frequency: f.frequency ?? "", reaction: !!f.reaction, targets: f.targets ?? "", distance: f.distance ?? "", versions };
}

/** "Understood: 3 tiers, Cold damage to Body, Hindered (EoT) on Tiers 2 and 3." */
export function understood(sys) {
  const bits = [];
  sys.versions.forEach((v, k) => {
    const tiers = [1, 2, 3].filter(n => v[`t${n}`].length || v[`x${n}`]);
    const kinds = new Set(), texts = new Map();
    for (const n of [1, 2, 3]) {
      for (const i of v[`t${n}`]) kinds.add(`${i.useW ? "weapon " : i.useAt ? "Attribute " : ""}${i.subtype ? `${TWOD12.subtypes[i.subtype] ?? i.subtype} ` : ""}damage to ${{ B: "Vigor", M: "Resolve", C: "Vigor or Resolve" }[i.pool] ?? "Vigor"}`);
      if (v[`x${n}`]) texts.set(v[`x${n}`], [...(texts.get(v[`x${n}`]) ?? []), n]);
    }
    const tierWord = ns => (ns.length === 3 ? "every Tier" : `Tier${ns.length > 1 ? "s" : ""} ${ns.join(" and ")}`);
    const parts = [tiers.length ? `${tiers.length} tier${tiers.length === 1 ? "" : "s"}` : "no tiers", ...kinds, ...[...texts].map(([t, ns]) => `${humanize(t)} on ${tierWord(ns)}`)];
    if (v.critical) parts.push("a Critical");
    if (v.effects) parts.push("Effects");
    bits.push(`${sys.versions.length > 1 ? `${v.ap}AP: ` : ""}${parts.join(", ")}`);
  });
  return bits.join(" | ");
}

/**
 * Generate Action. v0.0.357 (PACK ACTION-SHEET; Lucas's pick: mockup G2 "paste the card"): the card is written or pasted as text and read line by
 * line (gencard.mjs); the window (genwindow.mjs) is the system's own, not a Foundry default one. actor: create on it; item: fill that Action
 * (its Versions keep their Effects and their steps: the old window dropped them); neither: a world item.
 */
export async function openActionGenerator({ actor = null, item = null } = {}) {
  const { openCardGenerator } = await import("./genwindow.mjs");
  return openCardGenerator({ actor, item });
}
