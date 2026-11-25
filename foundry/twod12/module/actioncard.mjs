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
import { mergeDiceLine, namesWithCount } from "./dicemerge.mjs";
import { autoChip, TWOD12, traitGroupOf, highlightText, effectiveFrequency, prettyDamage, categoryText, doomStatus } from "./config.mjs";
import { rawTierLine, modifierBlocks, actionOnlyTalent } from "./preview.mjs";
import { prereqLine } from "./talents.mjs";
import { actionChanges, unloadedWeapon, traitsFor } from "./actionrows.mjs";
import { rollSource } from "./rollsource.mjs";
import { modifierList, damageSteps } from "./effects.mjs";
import { collectBonuses, bonusesNotNow } from "./bonus.mjs";
import { versionButtons, rollStripChips, modText, rulerText, rollsItself } from "./cardview.mjs";
import { costPill } from "./sheetmodel.mjs";
import { esc } from "./util.mjs";
import { cardModel, shortModel, tierLines } from "./cardmodel.mjs";   // Pack CARD-ONE step 2

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
    return ks.length ? `<span class="ap-tg"><span class="ap-cs">${ks.map(k => `<span class="ap-chip g-${g.key}">${esc(label(k))}</span>`).join("")}</span><i>${esc(g.label)}</i></span>` : "";
  }).filter(Boolean);
  return blocks.join('<span class="ap-gdiv" aria-hidden="true"></span>');
}

/** One cell of the table: the tier's damage as written, its rider on its own line after "↳", then (with changes) Empowered/Enfeebled and bonus damage in green or red. */
async function cell(item, v, n, ch) {
  const insts = v[`t${n}`] ?? [];
  // the Bestiary's rebuild (2026-11-25): a Structure card writes its [Mod] where it counts, so none is added here (cardmodel.mjs rawCell, the same rule)
  const { dmg, effects } = rawTierLine(insts, v[`x${n}`], n >= 2 && !item.system.structure && !item.system.traits.has("save") && (item.system.traits.has("weapon") || v.mode === "weapon"));
  const riders = await Promise.all(effects.map(x => enrich(x, item)));
  // v0.0.373 (STYLE-2, Lucas): bonus damage of the same pool, die and type is merged into the line ("[R] 2d6 Ho + 1d6 Ho + 1d6 Ho" reads
  // "[R] 4d6 Ho"); what was added is named once after it, in green ("+ Radiant Zeal ×2"). A bonus with words in it keeps its own chip.
  const plain = ch && (insts.length || n > 1) ? (ch.bonuses[n] ?? []).filter(b => /^\+ \[[A-Z]\] [^;]+$/.test(String(b.text))) : [];
  const line = plain.length ? mergeDiceLine([dmg, ...plain.map(b => String(b.text).slice(2))].filter(Boolean).join(" + ")) : mergeDiceLine(dmg);
  let html = line ? prettyDamage(esc(line)) : "";
  if (riders.length) html += dmg ? riders.map(r => `<span class="ap-rid"><span class="arr">↳</span> <span class="ap-mv">${r}</span></span>`).join("") : riders.join("; ");
  const extra = [];
  if (ch && insts.some(i => i.useW || i.useD || i.dice)) {
    if (ch.net > 0) extra.push(`<span class="chg up">+1d6!</span>`);   // v0.0.407: no value; Enfeebled is gone
  }
  if (plain.length) extra.push(`<span class="chg up">+ ${esc(namesWithCount(plain.map(b => b.source)))}</span>`);
  if (ch && (insts.length || n > 1)) for (const b of (ch.bonuses[n] ?? []).filter(b => !plain.includes(b))) extra.push(`<span class="chg up">${prettyDamage(esc(b.text))}</span>`);
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


/** The AP the creature has now, for the Version buttons (null: not in a started combat, nothing is struck). */
async function apNow(actor) {
  try {
    if (!actor || !game.combat?.started) return null;
    const { combatantOf, getAP, getRAP } = await import("./combat.mjs");
    const c = combatantOf(actor, game.combat);
    return c ? { ap: getAP(c), rap: getRAP(c) } : null;
  } catch (e) { return null; }
}

/* ------------------------------------------------------------------ v0.0.411 (pack F2): the card in the book's look and Structure */
// Step 5 of the Foundry style plan (foundry/mockups/card, decided 2026-11-17 with the automation rank in its colors): the book's flat tinted panel
// with an accent rule above and below; the Flavor at the top in the serif italic; the traits as words with dots and a line under them, the
// automation rank at the right; Distance, Area and Target; then the labeled lines in play order (Requirement, Interrupt / Trigger, Setup, the
// card's own lines, the roll, the Tiers, Effect, Special), a Version or a Mode a block with its cost or name as its header; no Tier color; the
// Use button in each block's header, or at the end of the Your roll line with one Version; Your roll a labeled line under a hairline (the
// Modifier, Boons "+" in the success color, Banes "▼" in the failure color); what effects change a short note after its line; the Ruler line small.
/** Pure: the trait words in the book's group order, joined by dots. */
export function traitWords(traits) {
  const list = [...(traits ?? [])], label = k => String(TWOD12.traits[k] ?? k);
  const order = TWOD12.traitGroups.flatMap(g => list.filter(k => traitGroupOf(k) === g.key).sort((a, b) => label(a).localeCompare(label(b))));
  const rest = list.filter(k => !order.includes(k));
  return [...order, ...rest].map(k => `<span>${esc(label(k))}</span>`).join('<i class="st-dot" aria-hidden="true">&middot;</i>');
}
export { rollLine, tierLines } from "./cardmodel.mjs";   // Pack CARD-ONE: they moved to the card model
const stLine = (label, html, cls = "") => `<div class="st-l${cls ? ` ${cls}` : ""}"><b>${esc(label)}</b><span>${html}</span></div>`;

/** item: an Action. actor (optional): the creature that has it. use: the Version buttons are buttons (false on the Build tab and with no actor).
 *  short (v0.0.441, pack SHEETS-HUD): the sheets' short card under an Action's bar (cardmodel.mjs SHORT_CARD: no Flavor, rank word, Distance,
 *  Attack / Save line, Your roll, Ruler or Use button; the bar's stamps are the Use buttons). */
export async function buildActionCard(item, { actor = null, use = true, short = false } = {}) {
  if (short) use = false;
  const it = item.system, versions = it.versions ?? [];
  const ch = actor ? actionChanges(actor, item) : null;
  const weapon = actor ? (actor.items?.get?.(item.getFlag?.("twod12", "weaponId")) ?? null) : null;
  const canUse = !!actor && use;
  const now = canUse ? await apNow(actor) : null;
  const btns = versionButtons(versions.map(v => v.ap), { reaction: !!it.reaction, inCombat: !!now, ap: now?.ap ?? 0, rap: now?.rap ?? 0 });
  const offAt = ap => btns.find(b => b.ap === (Number(ap) || 0)) ?? { off: false, why: "" };
  const costOf = v => (it.reaction ? `${v.ap}R` : `${v.ap} AP`);
  // the Use button (outlined; struck and dashed with its reason); a Mode's button carries the Mode
  const useBtn = v => {
    if (!canUse) return "";
    const b = offAt(v.ap), lab = `Use · ${costOf(v)}`;
    // v0.0.454 (Lucas, playtest 6, D4: "with no AP left, no need to move the button and write 'no ap left', just keep the button in place with a
    // strike through and faded"; and "warn, don't block"): an off button stays in place, struck and faded, and still opens the roll dialog, which warns
    return `<span class="ap-vwrap"${b.off ? ` data-tooltip="${esc(b.why)}"` : ""}><button type="button" class="ap-vbtn st-use${b.off ? " no" : ""}" data-action="useVersion" data-ap="${v.ap}"${v.mode && !MODE[v.mode] ? ` data-mode="${esc(v.mode)}"` : ""}${b.off ? ` aria-label="${esc(`${lab}: ${b.why}`)}"` : ""}>${esc(lab)}</button></span>`;
  };
  // Pack CARD-ONE step 2: what the card says, and in which order, is the card model (cardmodel.mjs); this face draws it (the creature's cells and buttons)
  const M0 = cardModel(item, { actor, weapon, fists: item.getFlag?.("twod12", "weaponUse") === "fists" }), M = short ? shortModel(M0) : M0;
  const save = !!it.traits?.has?.("save"), modes = M.modes;
  const fmt = async l => (l.fmt === "hl" ? highlightText(esc(l.text)) : l.fmt === "esc" ? esc(l.text) : l.fmt === "rich-esc" ? await enrich(esc(l.text), item) : await enrich(l.text, item));
  // a Version's labeled lines: its Special, the Tiers (with the creature's changes in the cells; grouped as the cells read), the Critical, its Effect
  const versionLines = async vm => {
    const v = vm.source, out = [];
    for (const l of vm.lines) {
      if (l.kind === "tier") {
        if (l.tier !== vm.lines.find(x => x.kind === "tier").tier) continue;   // the Tiers are drawn once, together, at the first one
        const cells = [await cell(item, v, 1, ch), await cell(item, v, 2, ch), await cell(item, v, 3, ch)];
        const noDmg = ![1, 2, 3].some(n => (v[`t${n}`] ?? []).length);
        for (const [lab, h] of tierLines(cells, save, noDmg, v.orTiers ?? "", v.tiersWritten ?? "")) out.push(stLine(lab, h));
      } else out.push(stLine(l.label, await fmt(l)));
    }
    return out.join("");
  };
  // the grid: Distance, Area (the Place Area chip), Target
  const area = M.grid.area, aBtn = M.grid.areaButton;
  const areaHtml = area && aBtn ? await enrich(aBtn.replace(/\|label:[^|\]]*/, "").replace(/\]$/, `|label:${area.replace(/[|\]]/g, " ")}]`), item) : (area ? esc(area) : "");
  const dist = M.grid.distance;
  const grid = [dist && !/^self$/i.test(dist) ? `<span><b>Distance:</b> ${esc(dist)}</span>` : "", areaHtml ? `<span><b>Area:</b> ${areaHtml}</span>` : "",
    M.grid.target ? `<span><b>Target:</b> ${highlightText(esc(M.grid.target))}</span>` : ""].filter(Boolean).join("");
  const areaRow = aBtn && !areaHtml ? `<div class="st-l arearow"><b>Area</b><span>${await enrich(aBtn, item)}</span></div>` : "";
  // the lines above the Versions: Requirement, Prerequisite, Interrupt / Trigger, Setup, the card's own lines, the roll
  const top = [];
  for (const l of M.top) top.push(stLine(l.label, await fmt(l)));
  // one Version: its lines here; several: a block each (its cost, or its Mode's name, as the header; its own traits, Distance, Target, roll)
  let body = "";
  if (M.versions.length === 1) body = await versionLines(M.versions[0]);
  else for (const vm of M.versions) {
    const v = vm.source, head = esc(vm.heading);
    const own = [vm.own.traits.length ? `<span class="st-btr">${traitWords(vm.own.traits)}</span>` : "", vm.own.distance ? `<span><b>Distance:</b> ${esc(vm.own.distance)}</span>` : "", vm.own.target ? `<span><b>Target:</b> ${highlightText(esc(vm.own.target))}</span>` : ""].filter(Boolean).join("");
    const vroll = vm.roll ? stLine(vm.roll.label, await fmt(vm.roll)) : "";
    // v0.0.454 (D4): the block isn't dimmed and says no reason; only its Use button is struck
    body += `<div class="st-b"><div class="st-bh"><span>${head}</span>${useBtn(v)}</div>${own ? `<div class="st-grid">${own}</div>` : ""}${vroll}${await versionLines(vm)}</div>`;
  }
  // the card's Special (a Structure card's), or an old card's prose (the description)
  const special = M.special ? stLine(M.special.label, await fmt(M.special)) : (M.prose ? `<div class="st-prose">${await enrich(M.prose, item)}</div>` : "");
  // Your roll (read-only), and the Use button of a one-Version card at its end
  let live = "";
  const oneBtn = versions.length === 1 ? useBtn(versions[0]) : "";
  if (actor && !short && !modes && rollsItself(versions, it.traits)) {   // an Art whose Mode has its own Save: no one roll to show
    try {
      const { src, chips } = rollStripSources(actor, item);
      const out = unloadedWeapon(actor, item);
      if (out) chips.push({ kind: "bane", label: "Unloaded", applies: true, why: `${out.name} must be reloaded first (Reload, 1 AP)` });
      const word = c => { const bad = ["bane", "doom", "enf", "flat"].includes(c.kind); return `<span class="st-rc ${bad ? "b" : "g"}${c.applies ? "" : " na"}">${esc(c.label)}</span>`; };
      live = `<div class="st-live"><div class="st-l"><b>Your roll</b><span class="st-roll"><span class="st-m">${esc(modText(src.chip, src.mod))}</span>${chips.map(word).join("")}${oneBtn}</span></div></div>`;
    } catch (e) { console.warn("twod12 | Your roll", e); }
  }
  if (!live && oneBtn) live = `<div class="st-live st-only">${oneBtn}</div>`;
  const ruler = short ? "" : rulerText(it.worth, setting("designerMode"));
  const rank = it.automation && !short ? `<span class="st-auto">${autoChip(it.automation, it.automationNote)} ${esc(TWOD12.automationRanks?.[it.automation] ?? "")}</span>` : "";
  const traits = it.traits?.size ? traitWords(it.traits) : "";
  return `<div class="twod12 acard d2 st${short ? " st-short" : ""}" data-card-item="${esc(item.id ?? "")}">
    ${it.flavor && !short ? `<div class="st-flavor">${esc(it.flavor)}</div>` : ""}
    ${traits || rank ? `<div class="st-traits">${traits}${rank}</div>` : ""}
    ${grid ? `<div class="st-grid">${grid}</div>` : ""}${areaRow}
    ${top.join("")}${body}${special}${modifierBlocks(it).join("")}${live}
    ${ruler ? `<div class="st-ruler"><b>Ruler</b> ${esc(ruler)}</div>` : ""}
  </div>`;
}

/**
 * v0.0.298 (Lucas tested v0.0.297: "Features should look similar to cards like Opportunity Attack"): a Feature's or Talent's card on the sheets
 * in the same look as an Action with no table: the trait line (traits, category, Frequency chip), the meta lines (Prerequisites, Requirements),
 * "◆ Effects" and its text, what it grants (each Action as its card, a choice folded), the Talent slots and "Modifies", the Flavor at the bottom,
 * the ruler in Designer mode. A Talent that is only its Action shows that Action's card. v0.0.439 (CARD-ONE step 7): a Species and a Class too (buildInfoCard retired).
 */
export async function buildFeatureCard(item, { actor = null } = {}) {
  // v0.0.411 (pack F2): the same look as the Action card (the book's): the Flavor on top, the trait words and the rank, the labeled lines
  const s = item.system ?? {};
  const load = async list => (await Promise.all((list ?? []).filter(Boolean).map(async u => { try { return await fromUuid(u); } catch (e) { return null; } }))).filter(Boolean);
  if (item.type === "talent" && actionOnlyTalent(s)) { const [a] = await load(s.actions); if (a?.type === "action") return buildActionCard(a, { actor, use: false }); }
  const traits = s.traits?.size ? traitWords(s.traits) : "";
  const pre = prereqLine(s), req = String(s.requirements ?? "").trim();
  const body = String(s.description ?? "").replace(/<[^>]*>/g, "").trim() ? await enrich(s.description, item) : "";
  const rung = s.escalationPassive ? Number(s.escalationRung) || 0 : 0;
  const lines = [pre ? stLine("Prerequisite", esc(pre)) : "", req ? stLine("Requirement", highlightText(esc(req))) : "", rung ? stLine("Escalation", `${rung} or more`) : "",
    body ? (["species", "class"].includes(item.type) ? `<div class="st-prose">${body}</div>` : stLine(s.escalationPassive || /passive|feature/i.test(String(s.category ?? "")) ? "Passive" : "Effect", `<span class="st-prose">${body}</span>`)) : ""].join("");   // v0.0.439: a Species or a Class reads as prose
  const head = d => `<div class="st-bh"><span>${esc(d.name)}</span><span class="st-why">${esc(d.type === "action" ? costPill((d.system.versions ?? []).map(v => v.ap), !!d.system.reaction) : categoryText(d.system ?? {}) || d.type)}</span></div>`;
  const full = async d => { try { return d.type === "action" ? await buildActionCard(d, { actor, use: false }) : await buildFeatureCard(d, { actor }); } catch (e) { return ""; } };
  const blocks = [];
  const grants = await load(s.actions), options = await load(s.choiceOptions);
  if (grants.length) blocks.push(`<div class="st-b"><div class="st-bh"><span>Grants</span></div>${(await Promise.all(grants.map(async d => `<div class="ap-grant">${head(d)}${await full(d)}</div>`))).join("")}</div>`);
  if (options.length) blocks.push(`<div class="st-b"><div class="st-bh"><span>${esc(s.choiceLabel || "Choose")} ${Math.max(1, s.choiceCount || 1)}</span></div>${(await Promise.all(options.map(async d => `<details class="ap-grant ap-choice"><summary>${head(d)}</summary>${await full(d)}</details>`))).join("")}</div>`);
  if (s.talents) blocks.push(stLine("Talent slots", esc(String(s.talents))));
  const ruler = rulerText(s.worth, setting("designerMode"));
  const rank = s.automation ? `<span class="st-auto">${autoChip(s.automation, s.automationNote)} ${esc(TWOD12.automationRanks?.[s.automation] ?? "")}</span>` : "";
  return `<div class="twod12 acard d2 st feat" data-card-item="${esc(item.id ?? "")}">
    ${s.flavor ? `<div class="st-flavor">${esc(s.flavor)}</div>` : ""}
    ${traits || rank ? `<div class="st-traits">${traits}${rank}</div>` : ""}
    ${lines}${blocks.join("")}${modifierBlocks(s).join("")}
    ${ruler ? `<div class="st-ruler"><b>Ruler</b> ${esc(ruler)}</div>` : ""}
  </div>`;
}

/**
 * v0.0.322 (Lucas: "the Action Card when clicking on the Card button the same as the new designs"): the new card where no sheet row is its head
 * (the chat's Card button, the Action sheet's preview, a condensed row's hover card, the class window, the older sheets' panels): a title line
 * (the name, and the cost or the kind) on top of buildActionCard / buildFeatureCard. No Use buttons: these are for reading.
 */
export const soloTitle = (name, right = "") => `<div class="ap-title"><b>${esc(name)}</b>${right ? `<span class="ap-tcost">${esc(right)}</span>` : ""}</div>`;
const KIND = { feature: "Feature", talent: "Talent", species: "Species", class: "Class" };   // v0.0.439 (CARD-ONE step 7): a Species and a Class on this card too
export async function buildSoloCard(item, { actor = null } = {}) {
  if (!item) return "";
  const s = item.system ?? {};
  const card = item.type === "action" ? await buildActionCard(item, { actor, use: false }) : await buildFeatureCard(item, { actor });
  // v0.0.411 (the book's card head): the Frequency and the cost ("Encounter · 2 AP"); a Feature or Talent its kind
  const fq = item.type === "action" ? (TWOD12.frequencies[effectiveFrequency(s)] ?? "") : "";
  const right = item.type === "action" ? [fq && !/^none$/i.test(fq) ? fq : "", costPill((s.versions ?? []).map(v => v.ap), !!s.reaction)].filter(Boolean).join(" \u00b7 ") : (KIND[item.type] ?? "");
  return card.replace(/^(\s*<div class="twod12 acard d2[^"]*"[^>]*>)/, `$1${soloTitle(item.name, right)}`);
}
