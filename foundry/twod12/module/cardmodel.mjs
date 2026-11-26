// Pack CARD-ONE step 2 (Lucas, 2026-11-17: one card for every place it shows): the card model. One pure description of an Action card in the
// Structure (book/cards/card-structure.md, "THE STRUCTURE, WHOLE"; the book's own model is book/cards.py structure(), written to
// book/cards/structure.json by the book's build, and test t260 keeps the two together): what the card says and in which order. Every face draws
// from it (actioncard.mjs: the sheet's open card, the HUD's, the item sheet's, the hover card, the chat's Send and Card button, the class window;
// next: the roll dialog, the chat result, the stat block), so a part added to a card is added here once and every face gets it.
// The text is kept as written, with how it is shown (fmt): "esc" (escaped), "hl" (escaped and highlighted), "rich" (enriched: the buttons),
// "rich-esc" (escaped, then enriched). A face enriches; the model never does (it stays pure: no Foundry, no async).
import { TWOD12, effectiveFrequency, distanceText, distanceNote, areaText, vsText, areaButton } from "./config.mjs";
import { rawTierLine } from "./preview.mjs";
import { distanceShort } from "./sheetmodel.mjs";
import { rollSource } from "./rollsource.mjs";
import { tierLabel } from "./cardview.mjs";
import { tierOfLabel } from "./util.mjs";
import { activeHooks } from "./hooks.mjs";

export const MODE_NAME = { weapon: "Weapon mode", power: "Power mode" };
const ROLL_WORDS = ["signature", "weapon", "magic", "body", "mind", "appeal", "instinct"];
const DEF = { AD: "Armor Defense", WD: "Ward Defense" };

/** Pure: the roll line's label and text ("Attack" "Weapon vs. Armor Defense", "Save" "Appeal"), or null when the Action makes no roll. */
export function rollLine(it, vs) {
  if (!(it.versions ?? []).some(v => !v.noTiers)) return null;
  const t = it.traits ?? new Set(), has = k => t.has?.(k) ?? false;
  if (has("save")) return { label: "Save", text: String(vs || "").replace(/\s*Save$/, "") || "the target's choice" };
  // a [Signature] Action rolls the Signature Modifier, whatever else it is (the book: "Signature vs. Armor Defense")
  const words = (has("signature") ? ["signature"] : ROLL_WORDS.filter(has)).map(k => (k === "magic" ? "Power" : TWOD12.traits[k] ?? TWOD12.attributes[k] ?? k));
  // the core rework A7 (book, Chapter 1, Attribute DCs): an Attribute is rolled against the target's DC of that Attribute ("Body vs. Body DC");
  // "Body or Instinct" (the one used to roll) against "the same Attribute's DC"; Break Free's Check against the Action DC
  const ATTR = /^(Body|Mind|Appeal|Instinct)$/;
  const def = DEF[vs] ?? (ATTR.test(vs) ? `${vs} DC` : / or /.test(vs ?? "") && it.vs === "roll" ? "the same Attribute's DC" : vs);
  return def ? { label: it.vs === "action" ? "Check" : "Attack", text: `${words.length ? `${words.join(" or ")} ` : ""}vs. ${def}` } : null;
}
/** Pure: how a Version's three Tier texts are written: one line ("Tier 1 or 2" / "Tier 2 or 3" / "Tiers 1–3") or three. cells: [t1, t2, t3]. */
export function tierLines(cells, save, noDamage, orTiers = "", written = "") {
  // v0.0.429 (CARD-ONE step 6): a card that writes only some Tiers (Circling Shot: no Tier 1 line) shows only those
  const all = tierLinesAll(cells, save, noDamage, orTiers);
  return written ? all.filter(([l]) => !/^Tier (\d)$/.test(l) || written.includes(l.slice(-1))) : all;
}
function tierLinesAll(cells, save, noDamage, orTiers = "") {
  const none = c => /^(No effect\.?|&mdash;)$/.test(String(c).trim());
  if (cells[0] === cells[1] && cells[1] === cells[2]) return [[tierLabel("all"), cells[0]]];
  // v0.0.426: the card's own "Tier 2 or 3" / "Tier 1 or 2" (load.mjs keeps it as orTiers), with damage too (Trick Shots' Pin and Startle)
  if (orTiers === "23" && cells[1] === cells[2]) return [["Tier 1", cells[0]], ["Tier 2 or 3", cells[1]]].filter(([l, c]) => l !== "Tier 1" || !none(c));
  if (orTiers === "12" && cells[0] === cells[1]) return [["Tier 1 or 2", cells[0]], ["Tier 3", cells[2]]].filter(([l, c]) => l !== "Tier 3" || !none(c));
  if (noDamage && save && cells[0] === cells[1] && none(cells[2])) return [["Tier 1 or 2", cells[0]]];
  if (noDamage && !save && none(cells[0]) && cells[1] === cells[2]) return [["Tier 2 or 3", cells[1]]];
  return [1, 2, 3].map(n => [`Tier ${n}`, cells[n - 1]]);
}
/** The first Tier a tierLines label stands for ("Tiers 1–3" 1, "Tier 2 or 3" 2, "Tier 3" 3): util.mjs (v0.0.431: the Save card reads it too). */
export { tierOfLabel };

const L = (label, text, fmt) => ({ label, text: String(text ?? ""), fmt });
/** Pure: a Version's Tier n as written, with no creature: its damage and its rider (the key that decides how the Tiers are grouped). */
export function rawCell(it, v, n) {
  // the Bestiary's rebuild (2026-11-25, the Orc Warrior's Basic attacks drawn with no creature read "1d4! + [Mod]"): a Structure card writes its
  // [Mod] where it counts (rollsource.mjs: nothing is added by the kind of roll), so the card with no creature adds none either
  const { dmg, effects } = rawTierLine(v[`t${n}`] ?? [], v[`x${n}`], n >= 2 && !it.structure && !it.traits?.has?.("save") && (it.traits?.has?.("weapon") || v.mode === "weapon"));
  return dmg ? `${dmg}${effects.length ? ` | ${effects.join("; ")}` : ""}` : (effects.join("; ") || "&mdash;");
}

/**
 * Pure: the card model of an Action (item: { name, system } with traits a Set). opts: { actor (for the roll line's Modifier), weapon (for the
 * Distance), fists }. Returns { name, frequency, cost, reaction, flavor, traits, automation, grid: { distance, distTip, area, areaButton, target },
 * top: [line], versions: [{ ap, cost, mode, heading, own: { traits, distance, target }, roll, lines: [line] }], special, prose, modifiers } where a
 * line is { label, text, fmt } or a Tier line { label, tier: n, kind: "tier" }. One Version: its lines follow top; several: a block each.
 */
export function cardModel(item, { actor = null, weapon = null, fists = false } = {}) {
  const it = item.system ?? {}, versions = it.versions ?? [], save = !!it.traits?.has?.("save");
  const costOf = v => (it.reaction ? `${v.ap}R` : `${v.ap} AP`);
  const vs = vsText(it, { src: actor?.system?.attributes ? rollSource(actor.system, it) : null, fists });
  const rl = rollLine(it, vs);
  // pack TALENTS-PT (Rime Strike): a [Split] Action writes its roll in each mode's block ("Attack: Weapon vs. Armor Defense" / "Power vs. Ward Defense")
  const split = !!it.traits?.has?.("split") && versions.some(v => v.mode === "weapon" || v.mode === "power");
  const modes = split || versions.some(v => v.modeVs || v.modeTraits?.length);
  const splitRoll = v => (v.mode === "weapon" ? L("Attack", "Weapon vs. Armor Defense", "esc") : v.mode === "power" ? L("Attack", "Power vs. Ward Defense", "esc") : null);
  const top = [];
  if (it.requirements) top.push(L("Requirement", it.requirements, "hl"));
  if (it.prerequisites) top.push(L("Prerequisite", it.prerequisites, "esc"));
  if (it.reaction && it.trigger) top.push(L(it.reactionKind === "interrupt" ? "Interrupt" : "Trigger", it.trigger, "rich-esc"));
  if (it.setup) top.push(L("Setup", it.setup, "rich"));
  const effectAt = top.length;   // v0.0.429: where an Effect written above the roll goes (before the card's own lines and the roll)
  for (const l of it.lines ?? []) top.push(L(l.label || "Note", l.text, "rich"));
  // the core rework batch 2 & 3 (book, Chapter 2, Effect Timing): a Bloodied / Strained line written above the roll (plus class basicLine hooks on Basic Attack)
  const SL = { ...(it.stateLines ?? {}) };
  if (actor && (item.getFlag?.("twod12", "basic") ?? item.flags?.twod12?.basic) === "basicWeaponAttack") {
    for (const h of activeHooks(actor, "basicLine")) {
      for (const k of ["bloodied", "strained", "bloodiedBefore", "strainedBefore"]) if (h.hook[k]) SL[k] = SL[k] ? `${SL[k]} ${h.hook[k]}` : h.hook[k];
      if (Number(h.hook.strainedBeforeD) > 0) { const txt = `On a Tier 3, this Action deals ${Math.max(1, Number(h.hook.strainedBeforeD) || 1)}[D] more.`; SL.strainedBefore = SL.strainedBefore ? `${SL.strainedBefore} ${txt}` : txt; }   // v0.0.520: the book's words (Steady Draw)
    }
  }
  for (const [k, label] of [["bloodiedBefore", "Bloodied"], ["strainedBefore", "Strained"]]) if (String(SL[k] ?? "").trim()) top.push(L(label, SL[k], "rich"));
  // v0.0.509 (Steady Draw, Lucas 2026-11-25): a class line written as a Special on Basic Attack (its once-an-encounter 2dE button)
  if (actor && (item.getFlag?.("twod12", "basic") ?? item.flags?.twod12?.basic) === "basicWeaponAttack") for (const h of activeHooks(actor, "basicLine")) if (String(h.hook.specialLine ?? "").trim()) top.push(L("Special", h.hook.specialLine, "rich"));
  if (rl && !modes) top.push(L(rl.label, rl.text, "esc"));
  const versionModel = v => {
    const lines = [];
    // v0.0.520 (the cleanup audit, B2-015; book/cards.py _version_lines): a Version's own Requirement first (Crawl's 2 AP)
    if (String(v.requirements ?? "").trim()) lines.push(L("Requirement", v.requirements, "hl"));
    if (v.special) lines.push(L("Special", v.special, "rich"));
    if (!v.noTiers) {
      const noDmg = ![1, 2, 3].some(n => (v[`t${n}`] ?? []).length);
      for (const [label] of tierLines([1, 2, 3].map(n => rawCell(it, v, n)), save, noDmg, v.orTiers ?? "", v.tiersWritten ?? "")) lines.push({ label, tier: tierOfLabel(label), kind: "tier" });
      if (v.critical) lines.push(L("Critical", v.critical, "rich"));
    }
    if (String(v.effects ?? "").trim()) lines.push(L(it.structure || v.noTiers ? "Effect" : save ? "Tier 1 or 2" : "Tier 2 or 3", v.effects, "rich"));
    // the core rework batch 2: a Bloodied / Strained line after the Tiers (this Action's damage counts); on the last Version's block when there are several
    if (v === versions[versions.length - 1]) for (const [k, label] of [["bloodied", "Bloodied"], ["strained", "Strained"]]) if (String(SL[k] ?? "").trim()) lines.push(L(label, SL[k], "rich"));
    return {
      ap: v.ap, cost: costOf(v), mode: v.mode ?? "", heading: v.mode ? (MODE_NAME[v.mode] ?? v.mode) : costOf(v),
      own: { traits: v.modeTraits ?? [], distance: v.modeDistance ? distanceShort(({ weapon: "Weapon", reach: "Reach", self: "Self" })[v.modeDistance] ?? v.modeDistance) : "",   /* pack TALENTS-PT: a mode's "weapon" / "reach" key as the book writes it */ target: v.modeTargets ?? "" },
      roll: v.modeVs ? L("Save", TWOD12.attributes[v.modeVs] ?? v.modeVs, "esc") : split && !v.noTiers ? splitRoll(v) : null, lines, source: v
    };
  };
  const vms0 = versions.map(versionModel);
  // v0.0.520 (the cleanup audit, B2-038; book/cards.py structure()): Versions whose lines are all the same are printed once (Seek: the cost says
  // "1 / 2 AP", the Target line says what changes); each Version keeps its Use button (the faces read allVersions)
  const sig = vm => JSON.stringify(vm.lines.map(l => (l.kind === "tier" ? [l.label, ...[1, 2, 3].map(n => rawCell(it, vm.source, n))] : [l.label, l.text])));
  const merged = vms0.length > 1 && !modes && vms0.every(vm => !vm.mode && !vm.roll && !vm.own.traits.length && !vm.own.distance && !vm.own.target && sig(vm) === sig(vms0[0]));
  const vms = merged ? [{ ...vms0[0], heading: [...new Set(vms0.map(vm => vm.cost))].join(" / "), merged: true }] : vms0;
  // v0.0.429 (CARD-ONE step 6): one Version whose Effect the card writes above the roll (Rebuke, Reckoning, Hit and Run): it goes there
  if (vms.length === 1 && vms[0].source?.effectFirst) { const k = vms[0].lines.findIndex(l => l.label === "Effect"); if (k >= 0) top.splice(effectAt, 0, ...vms[0].lines.splice(k, 1)); }
  const proseText = String(it.description ?? "");
  return {
    name: item.name ?? "", frequency: effectiveFrequency(it), cost: [...new Set(versions.map(costOf))].join(" / "), reaction: !!it.reaction,
    flavor: it.flavor ?? "", traits: [...(it.traits ?? [])], automation: it.automation ? { rank: it.automation, note: it.automationNote ?? "" } : null,
    grid: { distance: distanceShort(distanceText(it, weapon)).replace(/^—$/, ""), distTip: distanceNote(it, weapon), area: areaText(it), areaButton: areaButton(it), target: it.targets ?? "" },
    top, modes, versions: vms, allVersions: vms0, merged,
    special: it.special ? L("Special", it.special, "rich") : null,
    prose: !it.structure && !it.special && !(it.lines ?? []).length && proseText.replace(/<[^>]+>/g, "").trim() ? proseText : ""   // v0.0.429: a Basic Action's Specials are lines
  };
}

/**
 * v0.0.441 (pack SHEETS-HUD; Lucas, 2026-11-18, the sheets' "Option 1"): the SHORT card, opened under an Action's bar on a sheet. The bar already
 * says the cost (its stamps are the Use buttons), the name with its automation diamond, Distance · Vs. and the Frequency, so the short card leaves
 * out what it would repeat. Pure: what a face drops from the full card (the model decides; actioncard.mjs buildActionCard({ short }) draws it).
 * A Mode's own Distance and Save stay (the bar shows only the Action's).
 */
export const SHORT_CARD = { flavor: false, rankWord: false, distance: false, rollLine: false, yourRoll: false, useButtons: false };
/** Pure: a card model with the short card's lines left out (the top's Attack / Save line; the grid's Distance). */
export function shortModel(m) {
  // the roll line is the only "Attack" / "Save" line written escaped (a card's own lines are enriched)
  return { ...m, flavor: "", grid: { ...m.grid, distance: "" }, top: m.top.filter(l => !((l.label === "Attack" || l.label === "Save") && l.fmt === "esc")), short: true };
}

/** Pure: the model's labeled lines in order, one Version's after the top or each block's under its heading ("# 2 AP"): for tests and parity. */
export function modelLabels(m) {
  const out = m.top.map(l => l.label);
  if (m.versions.length === 1) out.push(...m.versions[0].lines.map(l => l.label));
  else for (const v of m.versions) out.push(`# ${v.heading}`, ...(v.roll ? [v.roll.label] : []), ...v.lines.map(l => l.label));
  if (m.special) out.push(m.special.label);
  return out;
}
