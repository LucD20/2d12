// The old card builders' last pieces (pack CARD-ONE step 7, v0.0.439: buildPreviews, buildRawCard and buildInfoCard retired; every card is
// drawn from the card model now): the tier text helpers, the odds of the Checks' and Saves' dialog, the weapon's card, Send to chat.
import { attrFromTier } from "./rollsource.mjs";
import { TWOD12, cardVars, traitChevrons, highlightText, poolIcon, dtypeHtml, inkOf, brightOf } from "./config.mjs";
import { weaponTierText } from "./explode.mjs";   // v0.0.407: "3 + 1d4!" (the book's way)
import { esc } from "./roll.mjs";
import { tierProbs, critProb } from "./calc.mjs";
const enrich = async (txt, doc = null) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));
/** Weapon damage for a tier as dice text ("1d8", "2d6+1"). */
export function weaponText(weapon, tier, n = 1) {
  const d = weapon?.system?.damage?.[`t${tier}`];
  if (!d) return "";
  const dice = d.die ? `${d.count * n}${d.die}` : "";
  const mod = d.mod * n;
  return dice + (mod ? `${dice && mod > 0 ? "+" : ""}${mod}` : "") || "0";
}

/** The lines of one tier with the weapon's real dice and the [Mod] value (the roll dialog's preview and the chat card). */
export async function tierLines(insts, tier, ctx, effectText = "") {
  const lines = [];
  for (const i of insts) {
    const parts = [];
    if (i.useW) parts.push(ctx.weapon ? `${weaponText(ctx.weapon, tier, i.wCount)} <small>${esc(ctx.weapon.name)}</small>` : `${i.wCount}[W] <small>(no weapon)</small>`);
    if (i.dice) parts.push(esc(i.dice));
    if (i.useAt) parts.push(`${ctx.attrVal} <small>${esc(ctx.attrLabel)}</small>`);
    let t = parts.join(" + ");
    // The amount takes the color of its damage type, like the type's name (v0.0.137).
    if (t && i.subtype && inkOf(i.subtype)) t = `<span class="dtamt" style="color:${inkOf(i.subtype)};--sc-d:${brightOf(i.subtype) || inkOf(i.subtype)}">${t}</span>`;
    if (t) t = `${poolIcon(i.pool || "B")} ${t}${i.subtype ? ` ${dtypeHtml(i.subtype) || esc(TWOD12.subtypes[i.subtype])}` : ""}`;
    if (t) lines.push(t);
  }
  const dmg = insts;
  if (tier >= attrFromTier(ctx) && dmg.length && !dmg.some(i => i.useAt)) lines.push(`+ ${ctx.attrVal} <small>${esc(ctx.attrLabel)}</small>`);
  // v0.0.249 (Lucas): the effect rides on the damage with "; " as the book writes it ("[R] 1d8 Ho; Pushed 2"), on its own only when the tier deals no damage
  if (effectText) { const e = await enrich(effectText, ctx?.item); if (lines.length) lines[lines.length - 1] += `; ${e}`; else lines.push(e); }
  return lines;
}

/**
 * Previews for each Version (keyed by AP). ctx: { actor, item, weapon, isWeapon, mod, attrLabel, attrVal, dc, dcNote }.
 * The check line has spans (.pv-dc, .pv-odds) that the dialog keeps up to date.
 */
/** A version with the Critical and Effects text that Talents add to this Action (see "Modifies other Actions" on a Talent). */
export function applyTalentMods(v, mods = []) {
  if (!mods.length) return v;
  return { ...v, critical: [v.critical, ...mods.map(m => m.critical)].filter(Boolean).join(" "), effects: [v.effects, ...mods.map(m => m.effects)].filter(Boolean).join(" ") };
}

/** v0.0.428: the average of Empowered's 1d6! (a 6 counts 5 and rolls again: 2.5 + (5 + E) / 6 = E, so E = 4). */
export const EMPOWERED_AVG = 4;

/** Fill the tier odds (T1 / T2 / T3 %) in a preview element. */
export function updateOdds(el, mod, dc, boons, banes, state = "") {
  if (mod === null || mod === undefined) return;
  const p = tierProbs(mod, dc, boons, banes, state);
  const pct = x => `${Math.round(x * 100)}%`;
  el.querySelector(".pv-odds") && (el.querySelector(".pv-odds").textContent = `T1 ${pct(p[0])} \u00b7 T2 ${pct(p[1])} \u00b7 T3 ${pct(p[2])}`);
  el.querySelectorAll(".pv-p").forEach((s, i) => { s.textContent = pct(p[i]); });
  el.querySelectorAll(".pv-c").forEach(s => { s.textContent = pct(critProb(mod, dc, boons, banes, state)); });
  const d = el.querySelector(".pv-dc"); if (d) d.textContent = dc;
}

/** One line for a tier: damage of the same Damage Type is merged with "+": [B] 1[W] + 1d4 H. Effect text follows after "; ". */
export function rawTierLine(insts, effectText = "", addMod = false) {
  const groups = new Map(), effects = [];
  for (const i of insts) {
    const parts = [];
    if (i.useW) parts.push(`${i.wCount}[W]`);
    if (i.dice) parts.push(`${i.dice}${i.subtype ? ` ${i.subtype}` : ""}`);
    if (i.useAt) parts.push(`[Mod]${i.subtype ? ` ${i.subtype}` : ""}`);
    if (parts.length) { const k = i.pool || "B"; (groups.get(k) ?? groups.set(k, []).get(k)).push(...parts); }
  }
  // A Weapon Action adds [Mod] to the weapon's damage on Tiers 2 and 3 (the caller says when): written as the book does, "1[W] + [Mod]".
  if (addMod && groups.size && !insts.some(i => i.useAt)) {
    const k = insts.find(i => i.useW)?.pool || [...groups.keys()][0], list = groups.get(k) ?? groups.get([...groups.keys()][0]);
    const w = list.findIndex(x => x.includes("[W]"));
    list.splice(w >= 0 ? w + 1 : list.length, 0, "[Mod]");
  }
  if (effectText) effects.push(effectText);
  return { dmg: [...groups].map(([pool, parts]) => `[${({ B: "V", M: "R" })[pool] ?? pool}] ${parts.join(" + ")}`).join(" + "), effects };
}

/** The cost badges of a description card switch the Version shown, wherever the card is (chat, sheets, item sheets). Called once. */
export function registerVersionTabs() {
  document.addEventListener("click", ev => {
    const tab = ev.target.closest?.(".rawcard .vtab");
    if (!tab) return;
    ev.preventDefault();
    const card = tab.closest(".rawcard"), vi = tab.dataset.vtab;
    card.querySelectorAll(".vtab").forEach(t => t.classList.toggle("on", t === tab));
    card.querySelectorAll(".rawv").forEach(b => { b.classList.toggle("off", b.dataset.v !== vi); b.hidden = false; });   // a class: chat messages drop the hidden attribute
  }, true);
}

/** A weapon: traits, damage type, the damage of each tier and the actions it gives. Used on the Description tab and in the chat. */
export async function buildWeaponCard(item) {
  const w = item.system, sub = w.subtype ? TWOD12.subtypes[w.subtype] : "";
  const acts = (await Promise.all((w.actions ?? []).map(async u => (await fromUuid(u))?.name))).filter(Boolean);
  return `<div class="twod12 chat action rawcard weaponcard" style="${cardVars(TWOD12.cardColors.weapon)}">
    <div class="ahead"><b>${esc(item.name)}</b><span class="acat">Weapon</span></div>
    ${w.traits.size ? `<div class="traits">${traitChevrons(w.traits, { properties: true })}</div>` : ""}
    <div class="trow"><span class="freq">${sub ? `<span class="dmgword" style="--dc:${TWOD12.subtypeInk[w.subtype] ?? "#888"};--sc-d:${TWOD12.subtypeColors[w.subtype] ?? "#888"}"><i class="${TWOD12.subtypeIcons[w.subtype] ?? ""}"></i> ${esc(sub)}</span> damage` : "No damage type"}</span></div>
    ${w.range ? `<div class="vsrow"><b>Range</b> ${esc(w.range.split("/").join(" / "))}</div>` : ""}
    <div class="vsrow"><b>Weapon damage [W]</b></div>
    <table class="tiers">${[1, 2, 3].map(n => { const txt = weaponTierText(w.damage[`t${n}`]); return `<tr><th>Tier ${n}</th><td>${esc(txt || "0")}</td></tr>`; }).join("")}</table>
    ${acts.length ? `<div class="effects"><b>Actions:</b> ${acts.map(esc).join(", ")}</div>` : ""}
    ${w.wielded ? '<div class="vsrow">Wielded</div>' : ""}</div>`;
}

/** Features, Talents and anything else with a description: what is shown in the chat when its icon is clicked. */
/** The "Modifies ..." blocks of a Talent or of an Action that is a Talent. */
export const modifierBlocks = s => (s.modifiers ?? []).filter(m => m.spec).map(m => {
  const what = m.spec.replace(/^category:/i, "").replace(/^trait:/i, "trait ");
  return `<div class="iblock"><div class="eh">Modifies ${esc(what)}${m.when === "outOfTurn" ? " (out of your turn)" : ""}</div><div class="et">${m.critical ? `<b>Critical:</b> ${esc(m.critical)} ` : ""}${m.effects ? esc(m.effects) : ""}</div></div>`;
});

/**
 * v0.0.215 (Lucas, playtest 2): a Talent that is only its Action (Aim, Bloodlust, Cut Through, Whirlwind: it grants one Action and has no text,
 * settings, modifiers or choices of its own) is shown as that Action's card.
 */
export const actionOnlyTalent = s => (s?.actions ?? []).filter(Boolean).length === 1 && !String(s.description ?? "").replace(/<[^>]*>/g, "").trim()
  && !(s.settings ?? []).length && !(s.modifiers ?? []).length && !(s.choiceOptions ?? []).filter(Boolean).length && !s.talents;

/** Send an item to the chat as a card (Actions: every Version, like the Description tab). */
export async function sendItemToChat(item, actor = null) {
  // v0.0.334 (Lucas: "sending a Feature to the chat is still sending the old card"): a Feature or a Talent goes as the new card (buildSoloCard)
  // v0.0.340 (Lucas: "Send to chat" on an Action still sent the old card): an Action goes as the new card too
  // v0.0.439 (CARD-ONE step 7): a weapon its own card; every other kind (a Species, a Class too) the new card
  const content = item.type === "weapon" ? await buildWeaponCard(item) : await (await import("./actioncard.mjs")).buildSoloCard(item, { actor });
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content });
}

/**
 * v0.0.194 (Lucas): the roll dialog's Avg follows its chips: the Bonus Damage ticked (keys) and the Empowered / Enfeebled step.
 * d = { base, dice, parts: [{ key, name, avg, dice }] }. Returns { avg, why }.
 */
export function liveAvg(d, on, step) {
  let avg = Number(d?.base) || 0, dice = Number(d?.dice) || 0;
  const why = [];
  for (const p of d?.parts ?? []) if (on.has(p.key)) { avg += p.avg; dice += p.dice; if (p.avg) why.push(p.name); }
  const k = Math.trunc(Number(step) || 0);
  if (k > 0 && dice) { avg += EMPOWERED_AVG; why.push("Empowered 1d6!"); }   // v0.0.428
  return { avg, why };
}
