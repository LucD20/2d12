// Roll dialog preview: what the action will roll, per Version, in the look of the chat card.
import { prereqLine } from "./talents.mjs";
import { attrFromTier } from "./rollsource.mjs";
import { TWOD12, expandAsText, cardVars, cardHead, flavorHtml, apIcon, apLabel, traitChevrons, categoryText, highlightText, metaRowHtml, effectiveFrequency, distanceText, distanceNote, areaText, cardColorFor, vsText, areaButton, poolIcon, dtypeHtml, inkOf, prettyDamage } from "./config.mjs";
import { setupFor } from "./setup.mjs";
import { esc } from "./roll.mjs";
import { tierAvg, tierProbs, critProb, fmt, avgFormula } from "./calc.mjs";


const enrich = async (txt, doc = null) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));
const sgnN = n => (n >= 0 ? `+${n}` : `\u2212${Math.abs(n)}`);

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
    if (t && i.subtype && inkOf(i.subtype)) t = `<span class="dtamt" style="color:${inkOf(i.subtype)}">${t}</span>`;
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

/**
 * v0.0.193: what the effects add to a Tier's average: its Bonus Damage (ctx.bonusByTier) and the Empowered / Enfeebled step (ctx.step) on
 * every die. { add, why: ["Heavy Blows +2", "Empowered 1"] }. Only for a Tier that deals damage.
 */
export function avgExtras(insts, tier, ctx = {}) {
  if (!insts.length) return { add: 0, why: [] };
  const bon = ctx.bonusByTier?.[tier] ?? [];
  let add = 0, dice = 0, own = 0;
  const why = [], parts = [];
  for (const b of bon) { const a = avgFormula(b.dmg) ?? 0, d = diceIn(b.dmg); if (a) { add += a; why.push(`${b.effect} +${b.dmg}`); } dice += d; parts.push({ key: `${b.effect}|${b.dmg}|${b.sub}|${b.text}`, name: `${b.effect} +${b.dmg}`, avg: a, dice: d }); }
  for (const i of insts) { if (i.useW && ctx.weapon) own += (Number(ctx.weapon.system?.damage?.[`t${tier}`]?.count) || 0) * (i.wCount || 1); if (i.dice) own += diceIn(i.dice); }
  dice += own;
  const step = Math.trunc(Number(ctx.step) || 0);
  if (step && dice) { add += step * dice; why.push(step > 0 ? `Empowered ${step}` : `Enfeebled ${-step}`); }
  return { add, why, dice: own, parts };   // v0.0.194: dice and parts let the dialog recompute it live
}
const diceIn = f => [...String(f ?? "").matchAll(/(\d*)d\d+/g)].reduce((s, m) => s + (Number(m[1]) || 1), 0);

export async function buildPreviews(ctx) {
  const { item } = ctx, it = item.system;
  const color = cardColorFor(it);
  const out = {};
  for (const v0 of it.versions) {
    const v = applyTalentMods(v0, ctx.talentMods ?? []);
    const rows = [];
    for (const [n, k] of (v.noTiers ? [] : [1, 2, 3]).map(n => [n, `t${n}`])) {
      const lines = await tierLines(v[k] ?? [], n, ctx, expandAsText(v[`x${n}`], item.system.versions, v0, n));   // "As 1 AP" written out (the dialog shows one Version)
      const avg0 = tierAvg(v[k] ?? [], n, ctx), extra = avgExtras(v[k] ?? [], n, ctx), avg = avg0 ? avg0 + extra.add : 0;
      const live = avg0 ? ` data-avg="${esc(JSON.stringify({ base: avg0, dice: extra.dice, parts: extra.parts }))}"` : "";   // v0.0.194: recomputed when a Bonus chip or Empowered changes
      rows.push(`<tr data-t="${n}"><th>Tier ${n} <small class="pv-p"></small></th><td>${lines.length ? lines.join("<br>") : "&mdash;"}${avg ? `<div class="calc"${live}${extra.why.length ? ` data-tooltip="${esc(`Without them: ${fmt(avg0)}`)}"` : ""}>Avg ${fmt(avg)}${extra.why.length ? ` <small>(with ${esc(extra.why.join(", "))})</small>` : ""}</div>` : ""}</td></tr>`);
    }
    // The Critical row sits under Tier 3, only for Actions that have one.
    if (!v.noTiers && v.critical) rows.push(`<tr class="critp"><th>Critical <small class="pv-c"></small></th><td>${await enrich(v.critical, item)}</td></tr>`);
    const pvMeta = metaRowHtml({ escalation: it.escalation ?? 0, frequency: effectiveFrequency(it), targetText: it.targets, distance: distanceText(it, ctx.weapon), distanceTip: distanceNote(it, ctx.weapon), area: areaText(it), vs: vsText(it, { fists: item.getFlag?.("twod12", "basic") === "fists", rolls: !v.noTiers }), requirements: it.requirements, trigger: it.trigger, reactionKind: it.reactionKind, self: ctx.isSelf });
    const pvArea = areaButton(it) ? `<div class="trow arearow">${await enrich(areaButton(it), item)}</div>` : "";
    const pvSetup = it.setup ? `<div class="trow setuprow"><b>Setup:</b> ${await enrich(setupFor(it.setup, ctx.setupDone), item)}</div>` : "";
    const check = ctx.mod === null || v.noTiers ? "" : `<div class="pv-check">${esc(ctx.checkLabel)}: 2d12 ${sgnN(ctx.mod)} vs DC <b class="pv-dc">${ctx.dc}</b> <span class="pv-odds"></span></div>`;
    out[v.ap] = `<div class="twod12 chat action pv" style="${cardVars(color)}">
      ${cardHead(item.name, categoryText(it), apIcon(v.ap, it.reaction), effectiveFrequency(it), it.automation, it.automationNote)}
      ${flavorHtml(it)}
      ${it.traits.size ? `<div class="traits">${traitChevrons(it.traits)}</div>` : ""}
      ${pvMeta}${pvArea}${pvSetup}
      ${ctx.dcNote && !v.noTiers ? `<div class="vsrow">${esc(ctx.dcNote)}</div>` : ""}
      ${(it.traits.size || pvMeta) && (check || rows.length || v.effects) ? `<hr class="cdiv">` : ""}
      ${check}
      ${rows.length ? `<table class="tiers">${rows.join("")}</table>` : ""}
      ${v.effects ? `<div class="effects${rows.length ? " sep" : ""}"><div class="eh">${v.noTiers ? "Effects" : "Effects (Tier 2+)"}</div><div class="et">${await enrich(v.effects, item)}</div></div>` : ""}</div>`;
  }
  return { byAp: out, mod: ctx.mod, label: ctx.checkLabel, noTiers: Object.fromEntries(it.versions.map(v => [v.ap, !!v.noTiers])) };
}

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

/** The Action as written in the rules, in the chat-card look: every Version in order, [W] and [Mod] left as they are. */
export async function buildRawCard(item) {
  const it = item.system;
  if (!it.versions.length) return "";
  const color = cardColorFor(it);
  const blocks = [];
  for (const [vi, v] of it.versions.entries()) {
    const rows = [];
    if (!v.noTiers) {
      const cells = [];
      for (const n of [1, 2, 3]) {
        const { dmg, effects } = rawTierLine(v[`t${n}`] ?? [], v[`x${n}`], n >= 2 && !it.traits.has("save") && (it.traits.has("weapon") || v.mode === "weapon"));
        const bits = [prettyDamage(esc(dmg)), ...(await Promise.all(effects.map(x => enrich(x, item))))].filter(Boolean);   // icons and colored types (v0.0.137)
        cells.push(bits.length ? bits.join("; ") : "&mdash;");
      }
      // The same result on every tier (Weapon Attack: 1[W]) is written once.
      if (cells[0] === cells[1] && cells[1] === cells[2]) rows.push(`<tr><th>Tiers 1-3</th><td>${cells[0]}</td></tr>`);
      else cells.forEach((cell, k) => rows.push(`<tr><th>Tier ${k + 1}</th><td>${cell}</td></tr>`));
      if (v.critical) rows.push(`<tr class="crit"><th>Critical</th><td>${await enrich(v.critical, item)}</td></tr>`);
    }
    blocks.push(`<div class="rawv${vi ? " off" : ""}" data-v="${vi}">
      ${rows.length ? `<table class="tiers">${rows.join("")}</table>` : ""}
      ${v.effects ? `<div class="effects${rows.length ? " sep" : ""}"><div class="eh">${v.noTiers ? "Effects" : "Effects (Tier 2+)"}</div><div class="et">${await enrich(v.effects, item)}</div></div>` : ""}</div>`);
  }
  // One Version at a time: the cost badges switch between them (see registerVersionTabs).
  const areaRow = areaButton(it) ? `<div class="trow arearow">${await enrich(areaButton(it), item)}</div>` : "";
  const setupRow = it.setup ? `<div class="trow setuprow"><b>Setup:</b> ${await enrich(it.setup, item)}</div>` : "";
  const tabs = it.versions.length > 1 ? `<div class="vtabs">${it.versions.map((v, vi) => `<a class="vtab${vi ? "" : " on"}" data-vtab="${vi}">${apIcon(v.ap, it.reaction)}</a>`).join("")}</div>` : "";
  return `<div class="twod12 chat action rawcard" style="${cardVars(color)}">
    ${cardHead(item.name, categoryText(it), apLabel(it.versions.map(v => v.ap), it.reaction), effectiveFrequency(it), it.automation, it.automationNote)}
    ${flavorHtml(it)}
    ${it.traits.size ? `<div class="traits">${traitChevrons(it.traits)}</div>` : ""}
    ${metaRowHtml({ escalation: it.escalation ?? 0, frequency: effectiveFrequency(it), targetText: it.targets, distance: distanceText(it), area: areaText(it), vs: vsText(it, { fists: item.getFlag?.("twod12", "basic") === "fists" }), requirements: it.requirements, trigger: it.trigger, reactionKind: it.reactionKind, self: it.traits.has("self") })}${areaRow}${setupRow}
    ${(it.traits.size || it.targets || it.requirements || it.trigger || effectiveFrequency(it)) ? `<hr class="cdiv">` : ""}
    ${it.prerequisites ? `<div class="trow"><b>Prerequisites:</b> ${esc(it.prerequisites)}</div>` : ""}
    ${tabs}
    ${blocks.join("")}${modifierBlocks(it).join("")}</div>`;
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
    <div class="trow"><span class="freq">${sub ? `<span class="dmgword" style="--dc:${TWOD12.subtypeColors[w.subtype] ?? "#888"}"><i class="${TWOD12.subtypeIcons[w.subtype] ?? ""}"></i> ${esc(sub)}</span> damage` : "No damage type"}</span></div>
    ${w.range ? `<div class="vsrow"><b>Range</b> ${esc(w.range.split("/").join(" / "))}</div>` : ""}
    <div class="vsrow"><b>Weapon damage [W]</b></div>
    <table class="tiers">${[1, 2, 3].map(n => { const d = w.damage[`t${n}`]; const dice = d.die ? `${d.count}${d.die}` : ""; const txt = dice + (d.mod ? `${dice && d.mod > 0 ? "+" : ""}${d.mod}` : ""); return `<tr><th>Tier ${n}</th><td>${esc(txt || "0")}</td></tr>`; }).join("")}</table>
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

export async function buildInfoCard(item) {
  // A Talent or Feature (not an Action): a plain title bar, then traits, Frequency and Requirements, the text, and what it gives.
  const s = item.system, cat = categoryText(s);
  const load = async list => (await Promise.all((list ?? []).filter(Boolean).map(async u => { try { return await fromUuid(u); } catch (e) { return null; } }))).filter(Boolean);
  if (item.type === "talent" && actionOnlyTalent(s)) { const [a] = await load(s.actions); if (a?.type === "action") return buildRawCard(a); }
  const body = await foundry.applications.ux.TextEditor.implementation.enrichHTML(s.description ?? "", { relativeTo: item }) + (s.worth ? `<div class="ac-worth">${esc(s.worth)}</div>` : "");   // v0.0.239: the ruler's worth
  const ef = effectiveFrequency(s), freq = ef ? TWOD12.frequencies[ef] : "";
  const kid = d => `<div class="ikid">${d.type === "action" ? apLabel(d.system.versions.map(v => v.ap), d.system.reaction) : ""}<span>${esc(d.name)}</span></div>`;
  // v0.0.215 (Lucas): what it grants is shown in full (the Action's card), not only its name; a choice's options too, folded.
  const full = async d => { try { return d.type === "action" ? await buildRawCard(d) : await buildInfoCard(d); } catch (e) { return kid(d); } };
  const grants = await load(s.actions), options = await load(s.choiceOptions);
  const blocks = [];
  if (grants.length) blocks.push(`<div class="iblock"><div class="eh">Grants</div>${(await Promise.all(grants.map(full))).map(h => `<div class="igrant">${h}</div>`).join("")}</div>`);
  if (options.length) blocks.push(`<div class="iblock"><div class="eh">${esc(s.choiceLabel || "Choose")} ${Math.max(1, s.choiceCount || 1)}</div>${(await Promise.all(options.map(async d => `<details class="ichoice"><summary>${kid(d)}</summary><div class="igrant">${await full(d)}</div></details>`))).join("")}</div>`);
  if (s.talents) blocks.push(`<div class="iblock"><div class="eh">Talent slots</div><div class="et">${s.talents}</div></div>`);
  blocks.push(...modifierBlocks(s));
  const meta = [freq ? `<span class="freq">${esc(freq)}</span>` : "", prereqLine(s) ? `<span><b>Prerequisites:</b> ${esc(prereqLine(s))}</span>` : ""].filter(Boolean);
  const head = `${flavorHtml(s)}${s.traits?.size ? `<div class="traits">${traitChevrons(s.traits)}</div>` : ""}${meta.length ? `<div class="trow">${meta.join('<i class="fa-solid fa-sparkle sep"></i>')}</div>` : ""}`;
  const text = body.trim() ? `<div class="anote">${highlightText(body)}</div>` : "";
  return `<div class="twod12 chat action rawcard infocard">
    ${cardHead(item.name, cat, "", "", s.automation, s.automationNote)}
    ${head}${head && (text || blocks.length) ? `<hr class="cdiv">` : ""}${text}${blocks.join("")}</div>`;
}

/** Send an item to the chat as a card (Actions: every Version, like the Description tab). */
export async function sendItemToChat(item, actor = null) {
  // v0.0.334 (Lucas: "sending a Feature to the chat is still sending the old card"): a Feature or a Talent goes as the new card (buildSoloCard)
  const solo = ["feature", "talent"].includes(item.type) ? await (await import("./actioncard.mjs")).buildSoloCard(item, { actor }) : "";
  const content = solo || (item.type === "action" ? await buildRawCard(item) : (item.type === "weapon" ? await buildWeaponCard(item) : await buildInfoCard(item)));
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
  if (k && dice) { avg += k * dice; why.push(k > 0 ? `Empowered ${k}` : `Enfeebled ${-k}`); }
  return { avg, why };
}
