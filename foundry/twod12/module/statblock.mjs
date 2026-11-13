// v0.0.375 (PACK STYLE-2; Lucas, 2026-11-12/13; the brief foundry/mockups/npc-hud-brief.md, the approved page foundry/mockups/npc-hud-sheet.html):
// the one-page NPC sheet. A second NPC sheet for experienced GMs (the full sheet stays): its Main tab is a printed stat block (a name plate in the
// rank's color, the stats as ruled lines, each Action under a header bar in its frequency's color with the Tiers as three lines and its Effects
// under a line, the Attributes and Modifiers as tiles); Build, Effects and Notes are the full sheet's own tabs. statBlockHtml is pure (test t251);
// statBlockModel reads the actor and the full sheet's model (pcsheet.mjs), so the numbers are the ones the full sheet shows.
import { esc } from "./util.mjs";

export const SB_GROUPS = [["basic", "Basic"], ["special", "Special"], ["react", "Reactions"], ["esc", "Escalation"]];
export const SB_FREQ = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };
const TIER_NAMES = ["Tier 1", "Tier 2", "Tier 3"];
// v0.0.377 (Lucas: "around this size", 480 px): Steadiness written Steady, a long Size shortened (the full word is the tooltip)
const SIZE_SHORT = { Medium: "Med.", Gargantuan: "Garg." };
const sign = n => (Number(n) > 0 ? `+${Number(n)}` : Number(n) < 0 ? `−${-Number(n)}` : "0");

/** Pure: which group an Action goes in (its fields: basicAttack, reaction, escalation). */
export const sbGroupOf = a => (a.escalation ? "esc" : a.reaction ? "react" : a.basicAttack ? "basic" : "special");

/** Pure: one Action. a: { id, name, traits, freq, fqColor, escalation, dim, why, versions: [{ ap, label, off, used, why }], meta: [[label, html]],
 *  tiers: [{ label, cells: [html, html, html] }], crit: html, effects: html, noTiers } */
export function sbActionHtml(a) {
  const stamp = v => (v.off || v.used
    ? `<button type="button" class="sb-vb no${v.used ? " used" : ""}" disabled data-tooltip="${esc(v.why || (v.used ? "Used" : ""))}" aria-label="${esc(`${a.name}, ${v.label}: ${v.why || "used"}`)}">${esc(v.label)}</button>`
    : `<button type="button" class="sb-vb" data-action="useVersion" data-ap="${Number(v.ap) || 0}" data-tooltip="Use the ${esc(v.label)} Version (the roll dialog)" aria-label="Use ${esc(a.name)}, ${esc(v.label)}">${esc(v.label)}</button>`);
  const fq = [a.escalation ? `Escalation ${a.escalation}` : "", SB_FREQ[a.freq] ?? "", a.usedWord ? "used" : ""].filter(Boolean).join(", ");
  const meta = (a.meta ?? []).filter(([, h]) => h).map(([l, h]) => `<b>${esc(l)}</b> ${h}`).join('<span class="sep">;</span> ');
  const tiers = a.noTiers ? "" : (a.tiers ?? []).map(t => `<div class="sb-tiers">${t.label ? `<div class="sb-vl">${esc(t.label)}</div>` : ""}${t.cells.map((c, i) => `<div class="sb-t t${i + 1}"><span class="tl">${TIER_NAMES[i]}</span><span class="tv">${c || '<span class="none">No effect</span>'}</span></div>`).join("")}${t.crit ? `<div class="sb-t crit"><span class="tl">Critical</span><span class="tv">${t.crit}</span></div>` : ""}</div>`).join("");
  return `<div class="sb-oa${a.dim ? " dim" : ""}" data-item-id="${esc(a.id)}" style="--fq:${esc(a.fqColor)}">
    <div class="sb-oa-h">${(a.versions ?? []).map(stamp).join("")}<a class="n" data-action="openItem" data-tooltip="Open the Action">${esc(a.name)}</a>${a.traits ? `<span class="tr">(${esc(a.traits)})</span>` : ""}<span class="fq"><i aria-hidden="true">✦</i> ${esc(fq)}</span><span class="sb-tools"><a data-action="openItem" data-tooltip="Edit" aria-label="Edit ${esc(a.name)}"><i class="fa-solid fa-pen-to-square"></i></a><a data-action="confirmDelete" data-tooltip="Delete" aria-label="Delete ${esc(a.name)}"><i class="fa-solid fa-trash"></i></a></span></div>
    ${meta ? `<div class="sb-meta">${meta}</div>` : ""}${tiers}${a.effects ? `<div class="sb-fx"><span class="fxl">Effects</span> ${a.effects}</div>` : ""}
  </div>`;
}

/** Pure: the whole Main tab. m: { name, rank, rankKey, role, level, stage, cv, hp: { now, max }, vigor: [now, max], resolve: [now, max], states: [..],
 *  stats: [[label, value, tip, big]], rw: [[label, html]], groups: [{ key, label, actions, ladder, esc }], attrs: [{ key, label, value, vs }], mods: [{ key, label, value }] } */
export function statBlockHtml(m) {
  const pct = (v, mx) => Math.max(0, Math.min(100, Math.round((100 * (Number(v) || 0)) / (Number(mx) || 1))));
  const gauge = (k, l, [v, mx]) => `<span class="sb-gauge ${k}"><span class="k">${l}</span> <b class="${v < 0 ? "neg" : ""}">${v < 0 ? sign(v) : v}</b> / ${mx} <span class="sb-track"><i style="width:${pct(v, mx)}%"></i></span></span>`;
  const pips = (now, max) => `<span class="sb-pips">${Array.from({ length: max }, (_, i) => `<i class="${i < now ? "on" : ""}"></i>`).join("")}</span>`;
  const groups = (m.groups ?? []).map(g => {
    const right = g.esc ? `<span class="r">${pips(g.esc.n, g.esc.max)} ${g.esc.n} / ${g.esc.max}</span>` : "";
    const ladder = (g.ladder ?? []).map(r => `<div class="sb-rung${r.lit ? "" : " off"}"${r.tip ? ` data-tooltip="${esc(r.tip)}"` : ""}><span class="num">${esc(r.n)}.</span><span>${esc(r.text)}</span></div>`).join("");
    return `<div class="sb-band">${esc(g.label)}${right}<a class="add" data-action="newAction" data-tooltip="Add an Action">+ Add</a></div>${ladder}${(g.actions ?? []).map(sbActionHtml).join("")}`;
  }).join("");
  const stats = (m.stats ?? []).map(([k, v, tip, big]) => `<span${tip ? ` data-tooltip="${esc(tip)}"` : ""}><span class="k">${esc(k)}</span> <b${big ? ' class="big"' : ""}>${esc(v)}</b></span>`).join("");
  const rw = (m.rw ?? []).map(([k, h]) => `<span class="s2"><span class="k">${esc(k)}</span> ${h || "—"}</span>`).join("");
  return `<div class="twod12-sb rk-${esc(m.rankKey)}">
  <div class="sb-stats">
    <div class="sbl"><span class="k">HP</span> <b class="big">${m.hp.now}</b> / ${m.hp.max} <span class="sb-track hp"><i style="width:${pct(m.hp.now, m.hp.max)}%"></i></span>${(m.states ?? []).map(s => `<span class="sb-state">${esc(s)}</span>`).join("")}</div>
    <div class="sbl two">${gauge("v", "Vigor", m.vigor)}${gauge("r", "Resolve", m.resolve)}</div>
    <div class="sbl grid">${stats}</div>
    <div class="sbl grid">${rw}</div>
  </div>
  <div class="sb-body">${groups || '<p class="sb-empty">No Actions yet. Drag Actions onto this sheet, or + Add.</p>'}
    <div class="sb-attrs">${(m.attrs ?? []).map(x => `<a class="sb-attr at-${esc(x.key)}" data-action="rollAttr" data-key="${esc(x.key)}" data-tooltip="Click: ${esc(x.label)} Check · Shift-click: ${esc(x.label)} Save"><span>${esc(x.label)}</span><b>${esc(x.value)}</b><small>Vs. ${esc(x.vs)}</small></a>`).join("")}${(m.mods ?? []).map((x, i) => `<div class="sb-attr mod-${esc(x.key)}${i === 0 ? " gap" : ""}"><span>${esc(x.label)} Mod.</span><b>${esc(x.value)}</b><small>${esc(x.dc ?? "")}</small></div>`).join("")}</div>
  </div>
</div>`;
}

/** Pure: the name plate (over the tab bar): the name in Cinzel on the rank's color, the rank and the level at the right, Initiative and Senses. */
export const sbPlateHtml = m => `<div class="twod12-sb sb-platew rk-${esc(m.rankKey)}"><div class="sb-plate"><div class="nm">${esc(m.name)}</div><div class="who"><b>${esc([m.rank, m.role].filter(Boolean).join(" "))}</b><span>Level ${esc(m.level)} (Stage ${esc(m.stage)}) \u00b7 CV ${esc(m.cv)}</span></div><span class="sb-ptools"><a data-action="rollInitiative" data-tooltip="Roll Initiative" aria-label="Roll Initiative"><i class="fa-solid fa-dice-d20"></i></a><a data-action="editSenses" data-tooltip="Senses" aria-label="Senses"><i class="fa-solid fa-eye"></i></a></span></div></div>`;

/* ------------------------------------------------------------------ the model (Foundry) */
/** The model from the actor and the full sheet's model (pc: pcsheet.mjs's, so the numbers agree with the full sheet). */
export async function statBlockModel(actor, pc) {
  const { TWOD12, FREQ_COLORS, effectiveFrequency, vsText, distanceText, prettyDamage, highlightText } = await import("./config.mjs");
  const { rawTierLine } = await import("./preview.mjs");
  const { effectLines } = await import("./cardview.mjs");
  const { creatureDamageLines } = await import("./ccdamage.mjs");
  const { damageLineRows, damageLineChip } = await import("./sheetmodel.mjs");
  const TE = foundry.applications.ux.TextEditor.implementation;
  const enrich = async (t, doc) => highlightText(await TE.enrichHTML(t ?? "", { relativeTo: doc }));
  const s = actor.system, F = "twod12";
  const rankKey = String(s.role ?? "standard"), rank = TWOD12.npcRoles?.[rankKey]?.label ?? pc?.head?.role ?? "";
  const rows = new Map((pc?.sections ?? []).flatMap(sec => sec.rows ?? []).map(r => [r.id, r]));
  const escNow = Number(s.escalation) || 0;
  const actions = [];
  for (const i of actor.itemTypes.action) {
    if (i.getFlag(F, "basic")) continue;   // the Basic Actions every creature has (Advance, Shove...) are not the stat block's
    const it = i.system, row = rows.get(i.id) ?? {}, freq = effectiveFrequency(it);
    const versions = it.versions ?? [], tiered = versions.filter(v => !v.noTiers);
    const used = /used|spent/i.test(String(row.offWhy ?? "")) && !/AP/i.test(String(row.offWhy ?? ""));
    const locked = Number(it.escalation) > 0 && escNow < Number(it.escalation);
    const addMod = n => n >= 2 && !it.traits?.has?.("save") && (it.traits?.has?.("weapon"));
    const tiers = await Promise.all(tiered.map(async v => ({
      label: tiered.length > 1 ? (it.reaction ? `${v.ap}R` : `${v.ap} AP`) : "",
      cells: await Promise.all([1, 2, 3].map(async n => {
        const { dmg, effects } = rawTierLine(v[`t${n}`] ?? [], v[`x${n}`], addMod(n) || (n >= 2 && v.mode === "weapon"));
        const riders = await Promise.all(effects.map(x => enrich(x, i)));
        return [dmg ? prettyDamage(esc(dmg)) : "", ...riders].filter(Boolean).join(", ");
      })),
      crit: v.critical ? await enrich(v.critical, i) : ""
    })));
    const fx = effectLines(versions);
    const effects = fx.lines.length ? (await Promise.all(fx.lines.map(async l => `${l.badge ? `<b>${esc(it.reaction ? `${l.ap}R` : `${l.ap} AP`)}:</b> ` : ""}${await enrich(l.text, i)}`))).join(" ") : "";
    actions.push({
      id: i.id, name: i.name, group: sbGroupOf({ basicAttack: it.basicAttack, reaction: it.reaction, escalation: Number(it.escalation) || 0 }),
      traits: [...(it.traits ?? [])].map(k => TWOD12.traits?.[k] ?? k).join(", "), freq, fqColor: FREQ_COLORS[freq] ?? FREQ_COLORS.none, escalation: Number(it.escalation) || 0,
      dim: !!row.off || locked, usedWord: used,
      versions: versions.map(v => ({ ap: v.ap, label: it.reaction ? `${v.ap}R` : `${v.ap} AP`, off: !!row.off || locked, used, why: locked ? `Needs Escalation ${it.escalation}` : row.offWhy ?? "" })),
      meta: [["Trigger", it.trigger ? await enrich(it.trigger, i) : ""], ["Vs.", esc(vsText(it) ?? "")], ["Distance", esc(distanceText(it) ?? "")], ["Target", it.targets ? await enrich(it.targets, i) : ""]],
      tiers, effects, noTiers: !tiered.length, minAp: Math.min(...versions.map(v => Number(v.ap) || 0), 99)
    });
  }
  const groups = SB_GROUPS.map(([key, label]) => {
    const list = actions.filter(a => a.group === key).sort((a, b) => (key === "special" ? a.minAp - b.minAp : 0));
    const elite = key === "esc" && pc?.strip?.elite;
    return { key, label, actions: list, esc: elite ? { n: escNow, max: TWOD12.escalation?.max ?? 3 } : null,
      ladder: elite ? (pc.strip.eliteRungs ?? []).map(r => ({ n: r.n, text: String(r.tip ?? r.label).replace(/^Escalation \d+: /, "").replace(/ (Automated|By hand).*$/, ""), lit: r.lit, tip: r.tip })) : [] };
  }).filter(g => g.actions.length || g.ladder.length);
  // Health as what is left (the stat block's reading; the full sheet shows the damage taken): HP before Down, each gauge before Bloodied / Strained
  const pool = Number(s.pool) || 0, vig = (Number(s.bdt) || 0) - (Number(s.bodyDamage) || 0), res = (Number(s.mdt) || 0) - (Number(s.mindDamage) || 0);
  const tags = (pc?.health?.bars ?? []).map(b => b.tag).filter(Boolean).map(t => t.charAt(0) + t.slice(1).toLowerCase());
  const mv = Object.fromEntries((pc?.move ?? []).map(x => [x.label, x]));
  let rw = [["Immune", ""], ["Resist", ""], ["Weak", ""]];
  try {
    const rowsDl = damageLineRows(creatureDamageLines(actor));
    rw = rw.map(([k]) => { const r = rowsDl.find(x => x.label === k); return [k, (r?.lines ?? []).map(l => `<span class="rw-chip sb-rw" style="--sc-l:${TWOD12.subtypeInk?.[l.code] ?? "#5d5446"};--sc-d:${TWOD12.subtypeColors?.[l.code] ?? "#b3a68e"}"><i class="${TWOD12.subtypeIcons?.[l.code] ?? ""}" aria-hidden="true"></i>${esc(damageLineChip(l))}</span>`).join(" ")]; });
  } catch (e) { /* no lines */ }
  const vs = Object.fromEntries((pc?.defs?.vs ?? []).map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  return {
    name: actor.name, rank, rankKey, role: "", level: s.level ?? 1, stage: s.stage ?? 1, cv: pc?.head?.cv ?? "",
    hp: { now: pool - (Number(s.totalDamage) || 0), max: pool }, vigor: [vig, Number(s.bdt) || 0], resolve: [res, Number(s.mdt) || 0], states: tags,
    stats: [["AD", pc?.defs?.main?.[0]?.value ?? "", "Armor Defense", 1], ["WD", pc?.defs?.main?.[1]?.value ?? "", "Ward Defense", 1], ["Speed", mv.Speed?.value ?? "", "", 1], ["Reach", mv.Reach?.value ?? 1, "", 1],
      ["Steady", mv.Steady?.value ?? 0, "Steadiness: reduces Forced Movement and Reposition against it", 1], ["Size", `${SIZE_SHORT[pc?.head?.size] ?? pc?.head?.size ?? ""} (${mv.Size?.value ?? 3})`, `${pc?.head?.size ?? ""}: its Size Rank (Chapter 3)`, 1]],   // v0.0.378 (Lucas): Steady and Size at the size of the others
    rw, groups,
    attrs: (pc?.attrs ?? []).map(x => ({ key: x.key, label: x.label, value: x.value, vs: vs[x.key] ?? "" })),
    mods: (pc?.mods ?? []).map(x => ({ key: x.label === "Power" ? "power" : "weapon", label: x.label, value: x.value, dc: x.dc }))
  };
}
