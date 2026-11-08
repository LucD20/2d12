// The Action card that opens in place on the sheets (Actions tab, NPC sheet, Build tab rows, the Escalation and Basic rows; also the Generate
// Action window's preview).
// v0.0.297 PACK ACTION-PREVIEW: Lucas's design D2 "Ink and gold, book order" (foundry/mockups/action-preview-prototype.html). The open row is the
// card's head (no title bar of its own); top to bottom:
//   the trait line (squared chips, the group's label under them; the category and the Frequency chip on the right);
//   the book's meta lines (Interrupt / Trigger; Targets ✦ Area, the Area being the Place Area chip; Distance ✦ Vs.; Requirements), a gold rule above and below;
//   the Tier table (a navy head with a "Use · N AP" button per Version, struck with the reason when you can't pay it and its column dimmed;
//   "Tier 1", "Tier 2", "Tier 3", "Critical" in full; riders under the damage after "↳");
//   the Effects block (one line per Version, its AP badge); "Your roll" (the Modifier and the self-side chips the roll dialog detects);
//   the Flavor at the bottom under ◆ ◆ ◆; the ruler line in Designer mode only.
// With actor: what effects add inside the cells in green or red (as before), the strip, the Version buttons. The pure pieces: cardview.mjs.
// The chat cards are unchanged (chatcards.mjs, preview.mjs).
import { TWOD12, traitGroupOf, highlightText, metaRowHtml, effectiveFrequency, distanceText, areaText, vsText, areaButton, prettyDamage, categoryText, doomStatus } from "./config.mjs";
import { rawTierLine, modifierBlocks, actionOnlyTalent } from "./preview.mjs";
import { prereqLine } from "./talents.mjs";
import { actionChanges, unloadedWeapon, traitsFor } from "./actionrows.mjs";
import { rollSource } from "./rollsource.mjs";
import { modifierList, damageSteps } from "./effects.mjs";
import { collectBonuses, bonusesNotNow } from "./bonus.mjs";
import { versionButtons, tierLabel, rollStripChips, modText, rulerText, effectLines, rollsItself } from "./cardview.mjs";
import { distanceShort, costPill } from "./sheetmodel.mjs";
import { esc } from "./util.mjs";

const enrich = async (txt, doc = null) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));
const MODE = { weapon: "Weapon mode", power: "Power mode" };
/** The Frequency chip's colors (the brief): Encounter red, Round blue, Turn teal, At-will green, Daily purple. */
export const FREQ_CHIP = { encounter: "#a8322d", round: "#2c5d9e", turn: "#0F6E6E", atwill: "#4c7a2e", daily: "#5B3FA6" };
const setting = k => { try { return game.settings.get("twod12", k) === true; } catch (e) { return false; } };

/** The trait line: a block per group (Roll, Requires, Kind, Damage, Keywords), the group's label under its chips, a thin line between blocks. */
export function traitLine(traits) {
  const list = [...(traits ?? [])], label = k => String(TWOD12.traits[k] ?? k);
  const blocks = TWOD12.traitGroups.map(g => {
    const ks = list.filter(k => traitGroupOf(k) === g.key).sort((a, b) => label(a).localeCompare(label(b)));
    return ks.length ? `<span class="ap-tg"><span class="ap-cs">${ks.map(k => `<span class="ap-chip g-${g.key}" data-tooltip="${esc(TWOD12.traitHelp?.[k] ?? "")}">${esc(label(k))}</span>`).join("")}</span><i>${esc(g.label)}</i></span>` : "";
  }).filter(Boolean);
  return blocks.join('<span class="ap-gdiv" aria-hidden="true"></span>');
}

/** One cell of the table: the tier's damage as written, its rider on its own line after "↳", then (with changes) Empowered/Enfeebled and bonus damage in green or red. */
async function cell(item, v, n, ch) {
  const insts = v[`t${n}`] ?? [];
  const { dmg, effects } = rawTierLine(insts, v[`x${n}`], n >= 2 && !item.system.traits.has("save") && (item.system.traits.has("weapon") || v.mode === "weapon"));
  const riders = await Promise.all(effects.map(x => enrich(x, item)));
  let html = dmg ? prettyDamage(esc(dmg)) : "";
  if (riders.length) html += dmg ? riders.map(r => `<span class="ap-rid"><span class="arr">↳</span> <span class="ap-mv">${r}</span></span>`).join("") : riders.join("; ");
  const extra = [];
  if (ch && insts.some(i => i.useW || i.dice)) {
    if (ch.net > 0) extra.push(`<span class="chg up" data-tooltip="Empowered ${ch.net}">+${ch.net} per die</span>`);
    if (ch.net < 0) extra.push(`<span class="chg down" data-tooltip="Enfeebled ${-ch.net}">−${-ch.net} per die</span>`);
  }
  if (ch && (insts.length || n > 1)) for (const b of ch.bonuses[n] ?? []) extra.push(`<span class="chg up" data-tooltip="${esc(b.source)}">${prettyDamage(esc(b.text))}</span>`);
  return (html || "&mdash;") + (extra.length ? ` ${extra.join(" ")}` : "");
}

/** The roll dialog's own sources for the "Your roll" chips, about you only (no target): see rollStripChips in cardview.mjs. */
export function rollStripSources(actor, item) {
  const traits = traitsFor(actor, item), src = rollSource(actor.system ?? {}, item.system);
  const safe = (f, d) => { try { return f(); } catch (e) { console.warn("twod12 | Your roll", e); return d; } };
  const bonuses = [];
  for (const t of [1, 2, 3]) bonuses.push(...safe(() => collectBonuses(actor, traits, t, { target: null, mod: src.mod }), []));
  return {
    src,
    chips: rollStripChips({
      mods: safe(() => modifierList(actor, traits, [], null), []),
      doom: safe(() => doomStatus(actor) || (actor.system?.armorUntrained ? "Untrained armor" : ""), ""),
      exhausted: Number(actor.system?.exhausted ?? 0),
      steps: safe(() => damageSteps(actor, traits, null), {}),
      bonuses,
      notNow: safe(() => bonusesNotNow(actor, traits, { label: k => TWOD12.traits[k] ?? k, name: item.name }), []),
      name: item.name
    })
  };
}

/** A chip of the strip: Bane / Doomed / Enfeebled / a penalty red with a down triangle; Boon / Passive / Empowered green with a "+"; struck when it can't apply. */
const stripChip = c => {
  const bad = ["bane", "doom", "enf", "flat"].includes(c.kind);
  return `<span class="ap-ac${bad ? " bad" : ""}${c.applies ? "" : " na"}" data-tooltip="${esc(c.why)}">${bad ? '<span class="tri" aria-hidden="true"></span>' : '<span class="pg" aria-hidden="true">+</span>'}${esc(c.label)}</span>`;
};

/** The AP the creature has now, for the Version buttons (null: not in a started combat, nothing is struck). */
async function apNow(actor) {
  try {
    if (!actor || !game.combat?.started) return null;
    const { combatantOf, getAP, getRAP } = await import("./combat.mjs");
    const c = combatantOf(actor, game.combat);
    return c ? { ap: getAP(c), rap: getRAP(c) } : null;
  } catch (e) { return null; }
}

/** item: an Action. actor (optional): the creature that has it. use: the Version buttons are buttons (false on the Build tab and with no actor). */
export async function buildActionCard(item, { actor = null, use = true } = {}) {
  const it = item.system, versions = it.versions ?? [];
  const f = effectiveFrequency(it);
  const ch = actor ? actionChanges(actor, item) : null;
  const weapon = actor ? (actor.items?.get?.(item.getFlag?.("twod12", "weaponId")) ?? null) : null;
  const canUse = !!actor && use;
  const now = canUse ? await apNow(actor) : null;
  const btns = versionButtons(versions.map(v => v.ap), { reaction: !!it.reaction, inCombat: !!now, ap: now?.ap ?? 0, rap: now?.rap ?? 0 });
  const offAt = ap => btns.find(b => b.ap === (Number(ap) || 0)) ?? { off: false, why: "" };
  const headBtn = v => {
    const b = offAt(v.ap), mode = v.mode ? ` <span class="ap-mode">${MODE[v.mode]}</span>` : "";
    if (!canUse) return `<span class="ap-vcost">${esc(b.cost ?? (it.reaction ? `${v.ap}R` : `${v.ap} AP`))}</span>${mode}`;
    return b.off
      ? `<span class="ap-vwrap" data-tooltip="${esc(b.why)}"><button type="button" class="ap-vbtn no" aria-disabled="true" disabled aria-label="${esc(`${b.label}: ${b.why}`)}">${esc(b.label)}</button></span>${mode}`
      : `<button type="button" class="ap-vbtn" data-action="useVersion" data-ap="${v.ap}" data-tooltip="Use the ${esc(b.cost)} Version" aria-label="Use ${esc(item.name)}, the ${esc(b.cost)} Version">${esc(b.label)}</button>${mode}`;
  };

  // The Tier table: a row per Tier (one "Tiers 1–3" row when nothing changes between them), then Critical; a column per Version.
  let grid = "";
  const tiered = versions.filter(v => !v.noTiers);
  if (tiered.length) {
    const cols = await Promise.all(tiered.map(async v => [await cell(item, v, 1, ch), await cell(item, v, 2, ch), await cell(item, v, 3, ch)]));
    const same = cols.every(c => c[0] === c[1] && c[1] === c[2]);
    const rows = same ? [["tall", tierLabel("all"), cols.map(c => c[0])]] : [1, 2, 3].map(n => [`t${n}`, tierLabel(n), cols.map(c => c[n - 1])]);
    if (tiered.some(v => v.critical)) rows.push(["crit", tierLabel("crit"), await Promise.all(tiered.map(async v => (v.critical ? await enrich(v.critical, item) : "&mdash;")))]);
    const dim = tiered.map(v => offAt(v.ap).off);
    grid = `<div class="ap-ttw"><table class="ap-tt"><thead><tr><th></th>${tiered.map(v => `<th>${headBtn(v)}</th>`).join("")}</tr></thead><tbody>${rows.map(([cls, label, cells]) => `<tr class="${cls}"><td class="tl">${label}</td>${cells.map((c, k) => `<td${dim[k] ? ' class="dim"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  // Effects: one line per Version with its AP badge (struck with its column); once when every Version has the same text.
  const fx = effectLines(versions);
  let effects = "";
  if (fx.lines.length) {
    const lines = await Promise.all(fx.lines.map(async l => {
      const b = offAt(l.ap), txt = await enrich(l.text, item);
      return l.badge ? `<span class="ap-ap${b.off ? " no" : ""}"${b.off ? ` data-tooltip="${esc(b.why)}"` : ""}>${esc(it.reaction ? `${l.ap}R` : `${l.ap} AP`)}</span><span class="ap-fxt${b.off ? " dim" : ""}">${txt}</span>` : `<span class="ap-fxt one">${txt}</span>`;
    }));
    effects = `<div class="ap-fxh">${esc(fx.title)}</div><div class="ap-fxl${fx.lines.some(l => l.badge) ? "" : " plain"}">${lines.join("")}</div>`;
  }

  // "Your roll" (read-only): the Modifier and the self-side chips the roll dialog would detect by itself.
  let strip = "";
  if (actor && rollsItself(versions, it.traits)) {
    try {
      const { src, chips } = rollStripSources(actor, item);
      const out = unloadedWeapon(actor, item);
      if (out) chips.push({ kind: "bane", label: "Unloaded", applies: true, why: `${out.name} must be reloaded first (Reload, 1 AP)` });
      strip = `<div class="ap-strip"><span class="lab">Your roll</span><b class="ap-rmod" data-tooltip="The roll's Modifier">${esc(modText(src.chip, src.mod))}</b>${chips.map(stripChip).join("")}</div>`;
    } catch (e) { console.warn("twod12 | Your roll", e); }
  }
  // (an Action with no roll has no strip: what changes a roll doesn't matter to it; the old "Changed by effects" line is gone, v0.0.297)

  // The meta lines, the book's: the Area value is the Place Area chip.
  const area = areaText(it), aBtn = areaButton(it);
  const areaHtml = area && aBtn ? await enrich(aBtn.replace(/\|label:[^|\]]*/, "").replace(/\]$/, `|label:${area.replace(/[|\]]/g, " ")}]`), item) : "";
  // the Distance as the row writes it ("10 sq.")
  const meta = metaRowHtml({ escalation: it.escalation ?? 0, frequency: "", targetText: it.targets, distance: distanceShort(distanceText(it, weapon)).replace(/^\u2014$/, ""), area, areaHtml, sepHtml: '<span class="ap-st" aria-hidden="true">✦</span>', vs: vsText(it, { src: actor?.system?.attributes ? rollSource(actor.system, it) : null, fists: item.getFlag?.("twod12", "basic") === "fists" }), requirements: it.requirements, trigger: it.trigger, reactionKind: it.reactionKind, self: it.traits?.has?.("self") });
  // An area with no Area line (a Self Emanation without a Targets line): its chip on its own line, as before
  const areaRow = aBtn && !(area && meta.includes("<b>Area:</b>")) ? `<div class="trow arearow">${await enrich(aBtn, item)}</div>` : "";
  const setup = it.setup ? `<div class="trow setuprow"><b>Setup:</b> ${await enrich(it.setup, item)}</div>` : "";
  // v0.0.229 (pack CS): the card's prose (the book's text before and after the table: Weapon Attack, Steel Yourself) is the item's description.
  const notes = it.description && String(it.description).replace(/<[^>]+>/g, "").trim() ? `<div class="ac-notes">${await enrich(it.description, item)}</div>` : "";
  const cat = categoryText(it), fl = f && TWOD12.frequencies[f] && !["none", ""].includes(f) ? TWOD12.frequencies[f] : "";
  const traits = it.traits?.size ? traitLine(it.traits) : "";
  const ruler = rulerText(it.worth, setting("designerMode"));
  const flavor = it.flavor ? `<div class="ap-flav"><div class="dv" aria-hidden="true">◆ ◆ ◆</div>${esc(it.flavor)}</div>` : "";
  return `<div class="twod12 acard d2" data-card-item="${esc(item.id ?? "")}">
    <div class="ap-trow">${traits}<span class="ap-cat">${cat ? esc(cat) : ""}${fl ? ` <span class="ap-freq" style="background:${FREQ_CHIP[f] ?? "#5f5e5a"}">${esc(fl)}</span>` : ""}</span></div>
    ${meta ? `<div class="ap-meta">${meta}</div>` : ""}${areaRow}${setup}
    ${it.prerequisites ? `<div class="trow"><b>Prerequisites:</b> ${esc(it.prerequisites)}</div>` : ""}
    ${notes}
    ${grid}${effects}${modifierBlocks(it).join("")}${strip}${flavor}
    ${ruler ? `<div class="ap-ruler"><b>Ruler</b> ${esc(ruler)}</div>` : ""}
  </div>`;
}

/**
 * v0.0.298 (Lucas tested v0.0.297: "Features should look similar to cards like Opportunity Attack"): a Feature's or Talent's card on the sheets
 * in the same look as an Action with no table: the trait line (traits, category, Frequency chip), the meta lines (Prerequisites, Requirements),
 * "◆ Effects" and its text, what it grants (each Action as its card, a choice folded), the Talent slots and "Modifies", the Flavor at the bottom,
 * the ruler in Designer mode. A Talent that is only its Action shows that Action's card. The chat keeps buildInfoCard (preview.mjs).
 */
export async function buildFeatureCard(item, { actor = null } = {}) {
  const s = item.system ?? {};
  const load = async list => (await Promise.all((list ?? []).filter(Boolean).map(async u => { try { return await fromUuid(u); } catch (e) { return null; } }))).filter(Boolean);
  if (item.type === "talent" && actionOnlyTalent(s)) { const [a] = await load(s.actions); if (a?.type === "action") return buildActionCard(a, { actor, use: false }); }
  const f = effectiveFrequency(s), fl = f && TWOD12.frequencies[f] && !["none", ""].includes(f) ? TWOD12.frequencies[f] : "";
  const cat = categoryText(s), traits = s.traits?.size ? traitLine(s.traits) : "";
  const pre = prereqLine(s), req = String(s.requirements ?? "").trim();
  const meta = [pre ? `<div class="trow"><span><b>Prerequisites:</b> ${esc(pre)}</span></div>` : "", req ? `<div class="trow"><span><b>Requirements:</b> ${highlightText(esc(req))}</span></div>` : ""].join("");
  const body = String(s.description ?? "").replace(/<[^>]*>/g, "").trim() ? await enrich(s.description, item) : "";
  // what it grants: each Action as its card under a small head (its name and cost), a choice's options folded
  const head = d => `<div class="ap-ghead"><b>${esc(d.name)}</b>${d.type === "action" ? `<span class="ap-gcost">${esc(costPill((d.system.versions ?? []).map(v => v.ap), !!d.system.reaction))}</span>` : `<span class="ap-gcost kind">${esc(categoryText(d.system ?? {}) || d.type)}</span>`}</div>`;
  const full = async d => { try { return d.type === "action" ? await buildActionCard(d, { actor, use: false }) : await buildFeatureCard(d, { actor }); } catch (e) { return ""; } };
  const blocks = [];
  const grants = await load(s.actions), options = await load(s.choiceOptions);
  if (grants.length) blocks.push(`<div class="ap-fxh">Grants</div>${(await Promise.all(grants.map(async d => `<div class="ap-grant">${head(d)}${await full(d)}</div>`))).join("")}`);
  if (options.length) blocks.push(`<div class="ap-fxh">${esc(s.choiceLabel || "Choose")} ${Math.max(1, s.choiceCount || 1)}</div>${(await Promise.all(options.map(async d => `<details class="ap-grant ap-choice"><summary>${head(d)}</summary>${await full(d)}</details>`))).join("")}`);
  if (s.talents) blocks.push(`<div class="ap-fxh">Talent slots</div><div class="ap-fxt one">${esc(String(s.talents))}</div>`);
  const ruler = rulerText(s.worth, setting("designerMode"));
  const flavor = s.flavor ? `<div class="ap-flav"><div class="dv" aria-hidden="true">◆ ◆ ◆</div>${esc(s.flavor)}</div>` : "";
  // v0.0.299 (Lucas): the text is the "Description"; the category and the Frequency chip sit on its heading line (less height); a trait line only with traits
  const catHtml = cat || fl ? `<span class="ap-cat">${cat ? esc(cat) : ""}${fl ? ` <span class="ap-freq" style="background:${FREQ_CHIP[f] ?? "#5f5e5a"}">${esc(fl)}</span>` : ""}</span>` : "";
  const onHead = !!body && !traits;
  return `<div class="twod12 acard d2 feat" data-card-item="${esc(item.id ?? "")}">
    ${traits || (catHtml && !onHead) ? `<div class="ap-trow">${traits}${catHtml}</div>` : ""}
    ${meta ? `<div class="ap-meta">${meta}</div>` : ""}
    ${body ? `<div class="ap-fxh${onHead ? " withcat" : ""}">Description${onHead ? `<span class="ap-fxr" aria-hidden="true"></span>${catHtml}` : ""}</div><div class="ap-fxl plain"><div class="ap-fxt one ap-prose">${body}</div></div>` : ""}
    ${blocks.join("")}${modifierBlocks(s).join("")}${flavor}
    ${ruler ? `<div class="ap-ruler"><b>Ruler</b> ${esc(ruler)}</div>` : ""}
  </div>`;
}
