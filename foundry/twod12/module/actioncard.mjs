// The Action card of the new sheet (v0.0.131), in the book's card format:
//   title bar in the Frequency color (name; category, Frequency, cost); flavor; trait chips; the meta line (Escalation, target, distance, Vs.);
//   the Trigger or Interrupt line of a Reaction; the tiers grid with one column per version (its cost badge on top; a Split Action's
//   Weapon mode / Power mode), shaded every other row; Critical; Effects with their cost badges.
//   With actor: a "Changed by effects" line (green and red chips), and what effects add inside the cells in green or red.
// The chat cards are unchanged (preview.mjs).
import { TWOD12, flavorHtml, traitChevrons, categoryText, highlightText, metaRowHtml, effectiveFrequency, distanceText, areaText, cardColorFor, vsText, areaButton, prettyDamage } from "./config.mjs";
import { rawTierLine, modifierBlocks } from "./preview.mjs";
import { actionChanges, costText, unloadedWeapon } from "./actionrows.mjs";
import { rollSource } from "./rollsource.mjs";
import { esc } from "./util.mjs";

const enrich = async (txt, doc = null) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));
const badge = (v, reaction) => `<span class="ac-badge">${Number(v.ap) || 0}${reaction ? "R" : "AP"}</span>`;
const MODE = { weapon: "Weapon mode", power: "Power mode" };

/** One cell of the grid: the tier as written, then (with changes) Empowered/Enfeebled and bonus damage in green or red. */
async function cell(item, v, n, ch) {
  const insts = v[`t${n}`] ?? [];
  const { dmg, effects } = rawTierLine(insts, v[`x${n}`], n >= 2 && !item.system.traits.has("save") && (item.system.traits.has("weapon") || v.mode === "weapon"));
  const bits = [dmg ? prettyDamage(esc(dmg)) : "", ...(await Promise.all(effects.map(x => enrich(x, item))))].filter(Boolean);
  const extra = [];
  if (ch && insts.some(i => i.useW || i.dice)) {
    if (ch.net > 0) extra.push(`<span class="chg up" data-tooltip="Empowered ${ch.net}">+${ch.net} per die</span>`);
    if (ch.net < 0) extra.push(`<span class="chg down" data-tooltip="Enfeebled ${-ch.net}">\u2212${-ch.net} per die</span>`);
  }
  if (ch && (insts.length || n > 1)) for (const b of ch.bonuses[n] ?? []) extra.push(`<span class="chg up" data-tooltip="${esc(b.source)}">${prettyDamage(esc(b.text))}</span>`);
  return (bits.length ? bits.join("; ") : "&mdash;") + (extra.length ? ` ${extra.join(" ")}` : "");
}

/** item: an Action. actor (optional): the creature that has it, for the changes and Unloaded. */
export async function buildActionCard(item, { actor = null } = {}) {
  const it = item.system, versions = it.versions ?? [];
  const f = effectiveFrequency(it), color = cardColorFor(it);
  const ch = actor ? actionChanges(actor, item) : null;
  const weapon = actor ? (actor.items?.get?.(item.getFlag?.("twod12", "weaponId")) ?? null) : null;
  const multi = versions.length > 1;

  // The tiers grid: a row per Tier (one "Tiers 1-3" row when nothing changes between them), then Critical.
  let grid = "";
  const tiered = versions.filter(v => !v.noTiers);
  if (tiered.length) {
    const cols = await Promise.all(tiered.map(async v => [await cell(item, v, 1, ch), await cell(item, v, 2, ch), await cell(item, v, 3, ch)]));
    const same = cols.every(c => c[0] === c[1] && c[1] === c[2]);
    const rows = same ? [["Tiers 1\u20133", cols.map(c => c[0])]] : [1, 2, 3].map(n => [`Tier ${n}`, cols.map(c => c[n - 1])]);
    if (tiered.some(v => v.critical)) rows.push(["Critical", await Promise.all(tiered.map(async v => (v.critical ? await enrich(v.critical, item) : "&mdash;")))]);
    const head = tiered.length > 1 || tiered.some(v => v.mode)
      ? `<tr><th></th>${tiered.map(v => `<th>${badge(v, it.reaction)}${v.mode ? ` <span class="ac-mode">${MODE[v.mode]}</span>` : ""}</th>`).join("")}</tr>` : "";
    grid = `<table class="ac-tiers" style="--cols:${tiered.length}"><thead>${head}</thead><tbody>${rows.map(([label, cells]) => `<tr class="${label === "Critical" ? "crit" : ""}"><th>${label}</th>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }

  // Effects: each version's, with its cost badge; written once when every version has the same text.
  // A Split Action has a Version per mode at the same cost: the same Effects text is written once (v0.0.148).
  const fxv = versions.filter(v => v.effects).filter((v, i, all) => all.findIndex(w => w.ap === v.ap && w.effects === v.effects) === i);
  let effects = "";
  if (fxv.length) {
    const once = fxv.length === versions.length && fxv.every(v => v.effects === fxv[0].effects);
    const title = versions.every(v => v.noTiers) ? "Effects" : "Effects (Tier 2+)";
    // v0.0.193: the text in its own span: the line is a flex row, and loose text and chips each became a column (Twin Shot).
    const lines = once ? [`<div class="ac-fxl"><span class="ac-fxt">${await enrich(fxv[0].effects, item)}</span></div>`]
      : await Promise.all(fxv.map(async v => `<div class="ac-fxl">${multi ? badge(v, it.reaction) : ""}<span class="ac-fxt">${await enrich(v.effects, item)}</span></div>`));
    effects = `<div class="ac-fx"><b>${title}</b>${lines.join("")}</div>`;
  }

  const out = actor ? unloadedWeapon(actor, item) : null;
  const chips = [...(ch?.chips ?? []), ...(out ? [{ text: "Unloaded", cls: "down", why: `${out.name} must be reloaded first (Reload, 1 AP)` }] : [])];
  const changed = chips.length ? `<div class="ac-changed"><b>Changed by effects</b>${chips.map(c => `<span class="eff ${c.cls}" data-tooltip="${esc(c.why)}">${esc(c.text)}</span>`).join("")}</div>` : "";
  const area = areaButton(it) ? `<div class="trow arearow">${await enrich(areaButton(it), item)}</div>` : "";
  const setup = it.setup ? `<div class="trow setuprow"><b>Setup:</b> ${await enrich(it.setup, item)}</div>` : "";
  // v0.0.229 (pack CS): the card's prose (the book's text before and after the table: Weapon Attack, Steel Yourself) is the item's description, shown on the card.
  const notes = it.description && String(it.description).replace(/<[^>]+>/g, "").trim() ? `<div class="ac-notes">${await enrich(it.description, item)}</div>` : "";
  const worth = it.worth ? `<div class="ac-worth">${esc(it.worth)}</div>` : "";   // v0.0.239: the ruler's worth, bottom right
  const meta = metaRowHtml({ escalation: it.escalation ?? 0, frequency: "", targetText: it.targets, distance: distanceText(it, weapon), area: areaText(it), vs: vsText(it, { src: actor?.system?.attributes ? rollSource(actor.system, it) : null, fists: item.getFlag?.("twod12", "basic") === "fists" }), requirements: it.requirements, trigger: it.trigger, reactionKind: it.reactionKind, self: it.traits?.has?.("self") });
  const cat = categoryText(it);
  return `<div class="twod12 acard" style="--fqc:${color}">
    <div class="ac-head"><b>${esc(item.name)}</b><span class="ac-right">${cat ? `<span class="ac-cat">${esc(cat)}</span>` : ""}${f ? `<span class="ac-freq">${esc(TWOD12.frequencies[f])}</span>` : ""}<span class="ac-cost">${esc(costText(item))}</span></span></div>
    <div class="ac-body">
      ${flavorHtml(it)}
      ${it.traits?.size ? `<div class="ac-traits">${traitChevrons(it.traits)}</div>` : ""}
      ${meta}${area}${setup}
      ${it.prerequisites ? `<div class="trow"><b>Prerequisites:</b> ${esc(it.prerequisites)}</div>` : ""}
      ${notes}
      ${grid}${changed}${effects}${modifierBlocks(it).join("")}${worth}
    </div></div>`;
}
