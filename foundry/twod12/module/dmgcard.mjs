import { TWOD12, cardVars, dtypeIcon, dtypeHtml, poolIcon } from "./config.mjs";
import { esc } from "./roll.mjs";
import { damageOdds } from "./calc.mjs";

const POOL_LABEL = { B: "Vigor", M: "Resolve", C: "Vigor or Resolve", "": "Other" };

const srcA = c => (c.srcUuid ? `<a class="content-link" draggable="true" data-link data-uuid="${esc(c.srcUuid)}">${esc(c.src)}</a>` : esc(c.src));
const compHtml = c => {
  // v0.0.189: bonus damage names where it comes from ("Heavy Blows", a link that opens it), with its type when it has one.
  const name = c.src ? (c.sub ? `${TWOD12.subtypes[c.sub]} <span class="csrc">${srcA(c)}</span>` : srcA(c)) : (c.sub ? TWOD12.subtypes[c.sub] : (c.kind === "A" ? "Modifier" : "Untyped"));
  const icon = c.sub ? `${dtypeIcon(c.sub)} ` : "";
  const dice = (c.dice ?? []).map(d => d.results.map((x, k) => `<span class="die d${d.faces}${d.ex?.[k] ? " ex" : ""}">${x}${d.ex?.[k] ? "!" : ""}</span>`).join("")).join("");   // v0.0.407: an exploded die
  return `<div class="comp sub-${c.sub || "N"}" style="--sc:${TWOD12.subtypeInk[c.sub] ?? "#888780"};--sc-d:${TWOD12.subtypeColors[c.sub] ?? "#888780"}"><span class="ctype">${icon}${name}${c.nl ? ' <span class="nlb">NL</span>' : ""}</span><span class="cform">${esc(c.formula)}</span><span class="cdice">${dice}</span><span class="ctotal">${c.total}</span></div>`;
};

/**
 * Post a damage card. comps: [{ pool: "B"|"M"|"C"|"", sub, nl (true|false|undefined), kind, formula, total, dice, hidden }]
 * texts: enriched HTML strings; fx: [{ uuid, mode }].
 */
/** The title bar of a damage card: the same look as an Action card, "Damage" as its badge and the Tier (or Cleave) under it. */
const dmgHead = (title, subtitle) => {
  const [first, ...rest] = String(subtitle ?? "").split(/\s*\u2022\s*/);
  const badge = rest.length ? first : "Damage", cat = rest.length ? rest.join(" \u2022 ") : first;
  return `<div class="ahead"><b>${esc(title)}</b><div class="aright"><span class="aps"><span class="apmark dmgtag">${esc(badge)}</span></span>${cat && cat !== badge ? `<span class="acat">${esc(cat)}</span>` : ""}</div></div>`;
};

export async function postDamageCard({ actor = null, title, subtitle = "", comps: allComps, texts = [], fx = [], targets = [], originUuid = "", chip = "", rolls = [], applied = "", color = TWOD12.cardColors.default, defaultNl = false, originMod = null, after = "", areaPoint = null, strike = false }) {
  // v0.0.283 (pack chat-cards): every damage card that isn't already applied is the new damage message (ccdamage.mjs)
  if (!applied) {
    const { postCcDamage } = await import("./ccdamage.mjs");
    const t0 = targets[0]?.tier ?? (/Tier (\d)/.exec(subtitle)?.[1] ? Number(/Tier (\d)/.exec(subtitle)[1]) : 0);
    return postCcDamage({ actor, title, groups: [{ tier: t0, crit: !!targets[0]?.crit, comps: allComps, fx, riders: texts }], targets: targets.map(t => ({ ...t, tier: t.tier ?? t0, g: 0 })), rolls, nl: defaultNl, originUuid, originMod, after, areaPoint, strike });
  }
  const comps = allComps;
  const pools = {};
  for (const c of comps) (pools[c.pool || ""] ??= []).push(c);
  const order = ["B", "M", "C", ""].filter(k => pools[k]);
  let grand = 0;
  const boxes = order.map(k => {
    const total = pools[k].reduce((s, c) => s + c.total, 0);
    grand += total;
    return `<div class="poolbox pool-${k || "N"}"><div class="poolhead"><span>${k ? `${poolIcon(k)} ` : ""}${POOL_LABEL[k] ?? TWOD12.poolNames[k]}</span><b>${total}</b></div>${pools[k].filter(c => !c.hidden).map(compHtml).join("")}</div>`;
  }).join("");
  const odds = (() => {
    try {
      if (game.settings.get("twod12", "designerMode") !== true) return "";   // v0.0.283: only in Designer mode
    } catch (e) {
      /* default on */
    }
    const o = damageOdds(comps);
    return o.hasDice
      ? `<div class="oddsrow">Avg ${Math.round(o.avg * 10) / 10} &middot; this total or more: ${Math.round(o.atLeast * 100)}% &middot; exactly: ${Math.round(o.exact * 1000) / 10}%</div>`
      : "";
  })();
  const tline = ts => `<div class="tline">${ts.length ? `<i class="fa-solid fa-crosshairs"></i> ${esc(ts.map(t => t.name).join(", "))}` : ""}</div>`;
  const dmgBtns = `<div class="dbtns">
        <button type="button" data-twod12="applyDamage">Damage</button>
        <button type="button" data-twod12="applyHalf">Half</button>
        <button type="button" data-twod12="applyDouble">Double</button>
        <button type="button" class="blk" data-twod12="block">Block</button>
        ${fx.some(x => x.mode === "conditional" || x.mode === "down") ? '<button type="button" data-twod12="applyFx">Effects</button>' : ""}
        <select class="kind"><option value="lethal" ${defaultNl ? "" : "selected"}>Lethal</option><option value="nonlethal" ${defaultNl ? "selected" : ""}>Nonlethal</option></select>
      </div>`;
  const content = `<div class="twod12 chat dmg" style="${color ? cardVars(color) : ""}">${dmgHead(title, subtitle)}<div class="orn">&#10022; &#10022; &#10022;</div>${chip}${boxes || "<div class='hint'>No damage.</div>"}${texts.length ? `<div class="dtexts">${texts.join("")}</div>` : ""}
      <div class="orn">&#10022;</div>
      ${
        applied
          ? `<div class="dtotal"><span>Total <b>${grand}</b></span></div>${odds}<div class="applied">${applied}</div></div>`
          : `<div class="dtotal"><button type="button" class="tgt" data-twod12="retarget" aria-label="Target the selected tokens"><i class="fa-solid fa-bullseye"></i></button><span>Total <b>${grand}</b></span></div>
      ${odds}
      ${tline(targets)}
      ${dmgBtns}</div>`
      }`;

  const damage = comps.map(c => ({ pool: c.pool, subtype: c.sub, total: c.total, formula: c.formula, nonlethal: c.nl }));
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(actor ? { actor } : {}), content, rolls,
    flags: { twod12: { damage, dmgCard: { comps: comps.map(c => ({ pool: c.pool, sub: c.sub, nl: c.nl, total: c.total })), targets, name: title, fx, originUuid, originMod, after, areaPoint, strike: !!strike } } }
  });
}

/* ------------------------------------------------------------------ one damage card for several creatures */
/** A creature's damage in a short line: a heart or brain with the total, and the damage types. */
export function damageSummary(comps) {
  const pools = {};
  for (const c of comps ?? []) { const k = c.pool || ""; (pools[k] ??= { total: 0, subs: [] }); pools[k].total += c.total; if (c.sub && !pools[k].subs.includes(c.sub) && !c.hidden) pools[k].subs.push(c.sub); }
  const out = ["B", "M", "C", ""].filter(k => pools[k]).map(k => `<span class="mdp">${k ? poolIcon(k) : ""} <b>${pools[k].total}</b>${pools[k].subs.length ? ` ${pools[k].subs.map(s => dtypeHtml(s)).join(" ")}` : ""}</span>`);
  return out.length ? out.join(" ") : '<span class="hint">no damage</span>';
}

/** The card: an "All" bar, then a row per creature with its own total and its own Damage, Half, Double and Block. */
export function multiDamageHtml({ title, rows, color = TWOD12.cardColors.default, defaultNl = false, kind = "" }) {
  const nl = kind ? kind === "nonlethal" : defaultNl;
  const btn = (k, i, f, label, extra = "") => `<button type="button"${extra} data-twod12="${k}"${i == null ? "" : ` data-row="${i}"`} data-factor="${f}">${label}</button>`;
  const rowHtml = (r, i) =>
    `<div class="mdrow${r.blocked ? " blocked" : ""}${r.applied ? " done" : ""}" data-row="${i}"><div class="mdtop"><b class="mdname">${esc(r.name)}</b><span class="rtag rolled${r.tier === 1 ? " fail" : ""}">Tier ${r.tier}</span><span class="mdsum">${damageSummary(r.comps)}</span></div>` +
    (r.applied
      ? `<div class="applied">${r.applied}</div>`
      : `<div class="dbtns">${btn("rowApply", i, 1, "Damage")}${btn("rowApply", i, 0.5, "Half")}${btn("rowApply", i, 2, "Double")}<button type="button" class="blk${r.blocked ? " active" : ""}" data-twod12="rowBlock" data-row="${i}">Block</button>${(r.fx ?? []).some(x => x.mode === "conditional" || x.mode === "down") ? `<button type="button" data-twod12="rowFx" data-row="${i}">Effects</button>` : ""}</div>`) +
    `</div>`;
  const pending = rows.some(r => !r.applied && !r.blocked);
  return `<div class="twod12 chat dmg multi" style="${color ? cardVars(color) : ""}">${dmgHead(title, "Damage \u2022 Each target")}<div class="orn">&#10022; &#10022; &#10022;</div>`
    + (pending && rows.length > 1 ? `<div class="mdall"><span class="mdl">All</span><div class="dbtns">${btn("allApply", null, 1, "Damage")}${btn("allApply", null, 0.5, "Half")}${btn("allApply", null, 2, "Double")}</div></div>` : "")
    + `<div class="mdrows">${rows.map(rowHtml).join("")}</div>`
    + (pending ? `<div class="dtotal"><select class="kind"><option value="lethal" ${nl ? "" : "selected"}>Lethal</option><option value="nonlethal" ${nl ? "selected" : ""}>Nonlethal</option></select></div>` : "") + "</div>";   // v0.0.249 (Lucas): the selector goes once every row is applied
}

