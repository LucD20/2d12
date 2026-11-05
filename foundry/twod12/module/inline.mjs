// Inline rolls for chat, descriptions and card text:
// @Check[body|dc:14|adj:2|boon:1|bane:2|traits:divine]   @Damage[(1d4+1)[body,slash],1d6[mind,holy]]
// @Save[appeal|dc:13|t1:1d6[mind,holy]|t2:"text"|t3:0]   @Template[emanation|distance:2|targets:enemies|self:no|places:yes]
import { releaseOptions, regripPrompt } from "./hands.mjs";
import { rollSource, saveDcOf } from "./rollsource.mjs";
import { coverFromPoint } from "./cover.mjs";
import { TWOD12, unconsciousDoom, doomStatus, cardVars, cardHead, prettyDamage, poolIcon, dtypeIcon } from "./config.mjs";
import { performCheck, checkHtml, esc, sgn, showDice, combineRolls } from "./roll.mjs";
import { traitChevrons } from "./config.mjs";
import { askRoll, enrich, adjLabelOf } from "./actions.mjs";
import { resolveModifiers, applyEffects, applyCondition, originInfo, applyBoonEffect, damageSteps } from "./effects.mjs";
import { dealDamage } from "./damage.mjs";
import { postDamageCard } from "./dmgcard.mjs";
import { startTemplate, tokensInEmanation } from "./template.mjs";
import { sysLine } from "./sysmsg.mjs";
import { handleMove, moveDistance } from "./move.mjs";
import { handleRally } from "./rally.mjs";
import { gainGuard } from "./guard.mjs";
import { handleUse } from "./freeuse.mjs";
import { squaresBetween } from "./move.mjs";

/** Split on a separator that is not inside brackets, parentheses, braces or quotes. */
export function splitTop(str, sep) {
  const out = [];
  let depth = 0, quote = false, cur = "";
  for (const ch of str) {
    if (ch === '"') quote = !quote;
    if (!quote) {
      if ("[({".includes(ch)) depth++;
      else if ("])}".includes(ch)) depth--;
      if (ch === sep && depth === 0) { out.push(cur); cur = ""; continue; }
    }
    cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

const SUB = { ...Object.fromEntries(Object.entries(TWOD12.subtypes).filter(([k]) => k).map(([k, v]) => [v.toLowerCase(), k])), mental: "Ps" };
function parseTag(tags) {
  const o = { pool: "", sub: "", nl: undefined };
  for (const t of (tags ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean)) {
    if (t === "body") o.pool = "B"; else if (t === "mind") o.pool = "M"; else if (t === "choice") o.pool = "C";
    else if (t === "nonlethal") o.nl = true; else if (t === "lethal") o.nl = false;
    else if (SUB[t]) o.sub = SUB[t];
  }
  return o;
}

/** Damage instances, plain text ("..."), and effect links (@UUID[...]) separated by top-level commas. */
export function parseParts(str) {
  const out = { damage: [], texts: [], uuids: [] };
  for (const part of splitTop(str ?? "", ",")) {
    if (!part || part === "0") continue;
    if (part.startsWith('"')) { out.texts.push(part.replace(/^"|"$/g, "")); continue; }
    if (part.startsWith("@UUID[")) { const m = part.match(/^@UUID\[([^\]]+)\]/); if (m) out.uuids.push(m[1]); continue; }
    const bare = part.match(/^(?:uuid:)?((?:Item|Actor|Compendium|Scene)\.[\w.\-]+)$/i);
    if (bare) { out.uuids.push(bare[1]); continue; }
    // The book's notation also reads: "[B] 1d8 Fi", "1d8 Fi", "1d4 Fire" (a leading [B]/[M] pool, a trailing subtype code or name).
    let p = part, pool0 = "", sub0 = "";
    const lead = p.match(/^\[(B|M|V|R)\]\s*/i);
    if (lead) { pool0 = ({ V: "B", R: "M" })[lead[1].toUpperCase()] ?? lead[1].toUpperCase(); p = p.slice(lead[0].length); }
    const tail = p.match(/\s+([A-Za-z]+)$/);
    if (tail) {
      const w = tail[1], code = w.length === 2 ? w[0].toUpperCase() + w[1].toLowerCase() : SUB[w.toLowerCase()];
      if (code && TWOD12.subtypes[code]) { sub0 = code; p = p.slice(0, -tail[0].length); }
    }
    const m = p.match(/^([\s\S]*?)(?:\[([^\[\]]*)\])?$/);
    let formula = m[1].trim();
    if (/^\([\s\S]*\)$/.test(formula)) formula = formula.slice(1, -1);
    const tag = parseTag(m[2]);
    if (formula) out.damage.push({ formula, ...tag, pool: tag.pool || pool0, sub: tag.sub || sub0 });
  }
  return out;
}

const yes = v => /^(yes|true|1|y)$/i.test(String(v));
export function parseInline(kind, inner) {
  const segs = splitTop(inner, "|");
  const cfg = { dc: 13, adj: 0, boon: 0, bane: 0, traits: [], tiers: {} };
  if (kind === "Damage") {
    cfg.parts = parseParts(segs[0]);
    cfg.nonlethal = segs.slice(1).some(s => s.toLowerCase() === "nonlethal");
    const lab = segs.slice(1).find(s => /^label\s*:/i.test(s));
    if (lab) cfg.label = lab.replace(/^label\s*:\s*/i, "");
    return cfg;
  }
  if (kind === "Condition") {
    cfg.cond = segs[0].trim().toLowerCase();
    for (const s of segs.slice(1)) {
      const m = s.trim().toLowerCase().match(/^(?:(?:rounds?|duration)\s*:\s*)?(eot|\d+)$/);
      if (m) { if (m[1] === "eot") cfg.dur = "eot"; else { cfg.dur = "rounds"; cfg.rounds = Number(m[1]); } }
      else if (/^label\s*:/i.test(s)) cfg.label = s.replace(/^label\s*:\s*/i, "");
      else if (/^crit\s*:/i.test(s)) cfg.crit = yes(s.replace(/^crit\s*:\s*/i, ""));   // v0.0.249: only the targets that rolled a Critical
    }
    return cfg;
  }
  if (kind === "Use") cfg.target = segs[0].trim();
  if (kind === "Cleave") cfg.n = Math.max(1, Number(segs[0]) || 1);
  if (kind === "Boon") cfg.n = Number(segs[0]) || 0;
  if (kind === "Book") cfg.ref = segs[0].trim();   // v0.0.246: @Book[Heading]{label}: a link to the book's anchor (the Journal import comes later)
  if (kind === "Template") cfg.shape = segs[0].toLowerCase(); else if (kind === "Move") { const k = segs[0].toLowerCase(); cfg.kind = ["move", "walk"].includes(k) ? "advance" : k; } else if (kind === "Rally") cfg.n = Number(segs[0]) || 1; else if (kind === "Effect") cfg.uuid = segs[0].trim(); else if (kind === "Guard") cfg.formula = segs[0].trim().toLowerCase().replace(/\s+/g, "").replace(/\[mod\]/g, "mod"); else cfg.attr = segs[0].toLowerCase();
  for (const s of segs.slice(1)) {
    const k = s.indexOf(":");
    if (k < 0) continue;
    const key = s.slice(0, k).trim().toLowerCase(), val = s.slice(k + 1).trim();
    if (key === "dc") { const ref = val.match(/^@(weapon|power|signature|body|mind|appeal|instinct)(?:\.dc)?$/i); if (ref) cfg.dcRef = ref[1].toLowerCase(); else cfg.dc = Number(val) || 13; cfg.dcSet = true; }
    else if (key === "distance") { if (/^[\d.]+$/.test(val)) cfg.distance = Number(val) || 0; else { cfg.distance = 0; cfg.distanceExpr = val.toLowerCase().replace(/\s+/g, ""); } }
    else if (["adj", "boon", "bane"].includes(key)) cfg[key] = Number(val) || 0;
    else if (key === "boons") cfg.boon = Number(val) || 0;
    else if (key === "banes") cfg.bane = Number(val) || 0;
    else if (key === "count") cfg.count = Math.max(1, Number(val) || 1);
    else if (key === "ap") cfg.ap = Math.max(0, Number(val) || 0);
    else if (key === "distinct") cfg.distinct = yes(val);
    else if (key === "atwill") cfg.countAtWill = yes(val);   // v0.0.224: a Linked use that counts toward At-will Banes (a Charge's Weapon Attack)
    else if (key === "nohandle") cfg.noHandle = yes(val);
    else if (key === "sight") cfg.sight = yes(val);
    else if (key === "empowered") cfg.empowered = val.toLowerCase().replace(/\s+/g, "");
    else if (key === "trait" || key === "traits") cfg.traits = val.split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
    else if (key === "label") cfg.label = val;
    else if (key === "min") cfg.min = Math.max(0, Number(val) || 0);
    else if (key === "uncapped") cfg.uncapped = /^(yes|true)$/i.test(val);   // @Move[charge|distance:speed+2|uncapped:yes]: it may go beyond your Speed (an ability says so)
    else if (key === "terrain") cfg.ignoreTerrain = /^(ignore|ignores|yes|true)$/i.test(val);   // @Move[evade|distance:2|terrain:ignore]: it moves through creatures and ignores Difficult Terrain (Cut Through)
    else if (key === "upto") cfg.upto = /^(yes|true|1|y)$/i.test(val);
    else if (key === "expire") cfg.expire = val.toLowerCase();
    else if (key === "round" || key === "rounds") cfg.rounds = Number(val) || 0;
    else if (key === "height") cfg.height = Math.max(1, Number(val) || 1);   // v0.0.214: a Line's height in squares (1 unless the card says otherwise)
    else if (key === "ht") cfg.ht = val;   // Hazardous Terrain: ht:entering+turn (or ht:yes for the default, Entering and Turn)
    else if (key === "difficult") cfg.difficult = /^(no|false|0)$/i.test(val) ? [] : (/^(yes|true|1|y)$/i.test(val) ? ["walk"] : (val.toLowerCase() === "all" ? Object.keys(TWOD12.movementActions) : val.toLowerCase().split(",").map(x => x.trim()).filter(Boolean)));
    else if (key === "difficultfor" || key === "dfor") cfg.dfor = val.toLowerCase();
    else if (/^t[123]$/.test(key)) cfg.tiers[key] = val;
    else if (key === "self") cfg.self = yes(val);
    else if (key === "places" || key === "keep") cfg.places = yes(val);
    else if (key === "targets") cfg.targets = val.toLowerCase();
    else if (key === "at") cfg.at = val.toLowerCase();
    else if (key === "source") cfg.source = val;
    else if (key === "quick") cfg.quick = yes(val);
    else if (key === "reach") cfg.withinReach = yes(val);   // v0.0.174: a Reposition whose target must remain within your Reach (Relocate)
    // v0.0.246 (cards 1, Smite): who:pick asks "you or one ally" (a picker); area:N looks in an N Emanation around the card's target; pick:yes on a
    // Pushed / Pulled / Slid lists the creatures to move one by one; from:target makes the card's target the origin of the Forced Movement.
    else if (key === "who") cfg.who = val.toLowerCase();
    else if (key === "area") cfg.area = Math.max(0, Number(val) || 0);
    else if (key === "pick") cfg.pick = yes(val);
    else if (key === "from") cfg.from = val.toLowerCase();
    else if (key === "doc") cfg.doc = val;
    else if (key === "crit") cfg.crit = yes(val);   // v0.0.249: @Condition[prone|crit:yes]: only the targets that rolled a Critical
  }
  // A button always has the traits of what it is: Advance and Charge are Move. (Evade and Pushed have none.) A Save has its Attribute.
  if (kind === "Move") cfg.traits = [...new Set([...(cfg.kind === "advance" || cfg.kind === "charge" ? ["move"] : []), ...(cfg.traits ?? [])])];
  if (kind === "Boon" && /\brounds?\s*:\s*eot\b/i.test(inner)) cfg.rounds = "eot";
  return cfg;
}

/** The DC of a Save written on this Action (an Item owned by a creature) or on its chat card, or null when it can't be told. */
function saveDcFor(doc) {
  try {
    if (!doc) return null;
    if (doc.documentName === "ChatMessage") return Number(doc.getFlag?.("twod12", "action")?.saveDc) || null;
    const actor = doc.parent?.documentName === "Actor" ? doc.parent : null;
    if (doc.documentName !== "Item" || !actor?.system?.attributes || !doc.system?.versions) return null;
    return saveDcOf(rollSource(actor.system, doc.system), actor.system.attributes);
  } catch (e) { return null; }
}

/** The creature a card, an Item or an Effect belongs to (for numbers that are calculated from its stats), or null. */
export function actorOfDoc(doc) {
  try {
    if (!doc) return null;
    if (doc.documentName === "Actor") return doc;
    if (doc.documentName === "ChatMessage") { const u = doc.getFlag?.("twod12", "action")?.actorUuid, a = u ? fromUuidSync(u) : null; return a?.documentName === "Actor" ? a : (a?.actor ?? null); }
    return doc.parent?.documentName === "Actor" ? doc.parent : null;
  } catch (e) { return null; }
}

function mkEl(kind, cfg, label, icon) {
  const a = document.createElement("a");
  a.classList.add("twod12-inline");
  a.dataset.twod12Inline = kind;
  a.dataset.cfg = JSON.stringify(cfg);
  a.innerHTML = `${icon.startsWith("<") ? icon : `<i class="fa-solid ${icon}"></i>`} ${esc(label)}`;
  return a;
}

/**
 * v0.0.246 (Lucas, mockup "Chosen" row): the area chips' icons, each the shape's footprint: an Emanation is the creature's square (faded, with a dot)
 * and its ring; a Burst a circle with a crosshair and a center ring (it sits on a corner); a Line is you (faded), two squares and an arrow.
 * v0.0.247: an <i> masked with the SVG file (icons/area-*.svg, system.css): an inline <svg> is stripped from a chat card, an <i> is not.
 */
export const AREA_ICONS = { emanation: '<i class="areaic emanation"></i>', burst: '<i class="areaic burst"></i>', line: '<i class="areaic line"></i>' };
/** The chip's words for an area, the book's order: "1 Emanation", "2 Burst", "6 Line". */
export const areaLabel = (shape, n) => `${n} ${shape === "burst" ? "Burst" : shape === "line" ? "Line" : "Emanation"}`;

/**
 * v0.0.246 (Lucas): the Modifier of the creature whose card, sheet or damage this text belongs to, so that a chip's "[Mod]" can show the number
 * ("Guard 1d8+3"): the Action card's roll, a damage card's origin, or the roll the Action would make from the sheet. null when there is none.
 */
export function modForDoc(doc) {
  try {
    if (!doc) return null;
    if (doc.documentName === "ChatMessage") {
      const a = doc.getFlag?.("twod12", "action");
      if (a && a.attrVal !== undefined && Number.isFinite(Number(a.attrVal))) return Number(a.attrVal);
      const d = doc.getFlag?.("twod12", "dmgCard");
      return Number.isFinite(d?.originMod) ? d.originMod : null;
    }
    const actor = actorOfDoc(doc);
    if (doc.documentName === "Item" && actor?.system?.attributes && doc.system?.versions) { const src = rollSource(actor.system, doc.system); return src.kind ? (Number(src.mod) || 0) : null; }
  } catch (e) { /* no creature to read it from */ }
  return null;
}
/** "Guard 1d8 + [Mod]" with the Modifier 3 reads "Guard 1d8+3" (Lucas's spelling); with no Modifier known, the words stay. */
export const withMod = (label, mod) => (mod === null || mod === undefined || !/\[Mod\]/.test(label) ? label : label.replace(/\s*\+\s*\[Mod\]/g, `+${mod}`).replace(/\[Mod\]/g, String(mod)));

export function registerInline() {
  const list = CONFIG.TextEditor?.enrichers ?? CONFIG.ux?.TextEditor?.enrichers;
  if (!list) return console.warn("twod12 | text enrichers are not available");
  list.push({
    id: "twod12-inline",
    pattern: /@(Check|Damage|Save|Template|Move|Rally|Guard|Effect|Condition|Use|Cleave|Reload|Release|Regrip|Boon|Book)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]+)\})?/g,
    enricher: async (match, options) => {
      const kind = match[1];
      const cfg = parseInline(kind, match[2]);
      // v0.0.246: "[Mod]" in a chip's words becomes the number of the creature the text belongs to (the tooltip says whose).
      const modN = modForDoc(options?.relativeTo);
      const inlineEl = (k, c, label, icon) => { const el = mkEl(k, c, withMod(label, modN), icon); if (withMod(label, modN) !== label) el.dataset.tooltip = `[Mod] is this creature's Modifier on the Action: ${modN}`; return el; };
      if (kind === "Book") {
        const el = mkEl("Book", cfg, cfg.label ?? match[3] ?? cfg.ref, "fa-book-open");
        el.classList.add("book"); el.dataset.tooltip = `${cfg.ref}: a rule of the book${cfg.doc ? ` (${cfg.doc})` : ""}`;
        return el;
      }
      if (kind === "Check" || kind === "Save") {
        const a = TWOD12.attributes[cfg.attr];
        if (!a) return null;
        // A Save with no DC written takes the DC of the Action that makes it: 11 + the Modifier that sets it (Saves in the rules).
        if (kind === "Save" && !cfg.dcSet) { const dc = saveDcFor(options?.relativeTo); if (dc) cfg.dc = dc; }
        // dc:@weapon.dc (or @power, @signature, @body...): the DC this creature sets (system.saveDC), read when the text is shown.
        if (cfg.dcRef) { const dc = actorOfDoc(options?.relativeTo)?.system?.saveDC?.[cfg.dcRef]; if (dc) cfg.dc = dc; }
        const dcText = cfg.dcRef && !actorOfDoc(options?.relativeTo)?.system?.saveDC ? `DC 11 + ${cfg.dcRef[0].toUpperCase()}${cfg.dcRef.slice(1)} ` : `DC ${cfg.dc} `;
        const label = `${kind === "Save" || cfg.dc !== 13 ? dcText : ""}${cfg.label ?? match[3] ?? `${a} ${kind}`}`;
        if (kind === "Check") return inlineEl("Check", cfg, label, "fa-dice-d20");
        const span = document.createElement("span");
        span.classList.add("twod12-inline-group");
        span.append(inlineEl("Save", cfg, label, "fa-shield-halved"));
        const card = inlineEl("SaveCard", cfg, "", "fa-comment");
        card.classList.add("chatbtn");
        card.dataset.tooltip = "Create a save card for the targeted tokens";
        span.append(card);
        return span;
      }
      if (kind === "Damage") {
        const label = cfg.label ?? match[3] ?? (cfg.parts.damage.map(p => `${p.formula}${p.sub ? " " + TWOD12.subtypes[p.sub] : ""}`).join(", ") || "Damage");
        return inlineEl(kind, cfg, label, "fa-heart-crack");
      }
      if (kind === "Condition") {
        const nm = cfg.cond.charAt(0).toUpperCase() + cfg.cond.slice(1);
        const dur = cfg.dur === "eot" ? " (EoT)" : (cfg.dur === "rounds" ? ` (${cfg.rounds} round${cfg.rounds === 1 ? "" : "s"})` : "");
        return inlineEl("Condition", cfg, cfg.label ?? match[3] ?? `${nm}${dur}`, "fa-triangle-exclamation");
      }
      if (kind === "Use") {
        const total = cfg.count ?? 1;
        return inlineEl("Use", cfg, cfg.label ?? match[3] ?? `${cfg.target.replace(/^(category|trait):/i, "")}${total > 1 ? ` \u00d7${total}` : ""}`, "fa-bolt");
      }
      if (kind === "Reload") return inlineEl("Reload", cfg, cfg.label ?? match[3] ?? "Weapon reloaded", "fa-bullseye");
      if (kind === "Release") return inlineEl("Release", cfg, cfg.label ?? match[3] ?? "Release", "fa-hand");
      if (kind === "Regrip") return inlineEl("Regrip", cfg, cfg.label ?? match[3] ?? "Regrip", "fa-hands");
      if (kind === "Cleave") return inlineEl("Cleave", cfg, cfg.label ?? match[3] ?? `Cleave ${cfg.n}`, "fa-crosshairs");
      if (kind === "Boon") {
        if (match[3]) cfg.name = match[3];
        const n = Math.abs(cfg.n), what = cfg.traits.length ? cfg.traits.map(t => TWOD12.traits[t] ?? t).join(" ") : "Roll";
        return inlineEl("Boon", cfg, cfg.label ?? match[3] ?? `${n} ${cfg.n < 0 ? "Bane" : "Boon"}${n === 1 ? "" : "s"} on the next ${what}`, cfg.n < 0 ? "fa-chevron-down" : "fa-chevron-up");
      }
      if (kind === "Rally") return inlineEl("Rally", cfg, cfg.label ?? match[3] ?? `${cfg.n} Rally Point${cfg.n === 1 ? "" : "s"}`, "fa-heart-pulse");
      if (kind === "Effect") return inlineEl("Effect", cfg, cfg.label ?? match[3] ?? "Apply the effect", "fa-shield-halved");
      if (kind === "Guard") return inlineEl("Guard", cfg, cfg.label ?? match[3] ?? `Guard ${guardText(cfg.formula)}`, "fa-shield-heart");
      if (kind === "Move") {
        // A distance that is calculated (floor(speed/2)) shows its number for the creature whose card or sheet this is, with a calculator.
        const calc = !!cfg.distanceExpr && !cfg.label && !match[3];
        const who = calc ? actorOfDoc(options?.relativeTo) : null, value = who ? moveDistance(cfg, who) : null;
        const n = cfg.distanceExpr ? (value || cfg.distanceExpr.replace(/[a-z]+/g, w => w[0].toUpperCase() + w.slice(1))) : (cfg.distance || 1);
        const name = { pushed: "Pushed", pulled: "Pulled", slid: "Slid", evade: "Evade", charge: "Charge", reposition: "Reposition" }[cfg.kind] ?? "Advance", icon = { pushed: "fa-hand", pulled: "fa-hand-back-fist", slid: "fa-route", evade: "fa-wind", charge: "fa-person-running-fast", reposition: "fa-arrows-up-down-left-right" }[cfg.kind] ?? "fa-person-running";
        const el = inlineEl("Move", cfg, cfg.label ?? match[3] ?? `${name} ${n}`, icon);
        if (calc) { const c = document.createElement("i"); c.className = "fa-solid fa-calculator calc"; c.dataset.tooltip = value ? `Calculated from your stats: ${cfg.distanceExpr} = ${value}` : `Calculated: ${cfg.distanceExpr}`; el.append(" ", c); }
        return el;
      }
      // v0.0.246 (Lucas): an area chip reads "1 Emanation", "2 Burst", "6 Line", with the shape's footprint as its icon (AREA_ICONS).
      const shape = ["burst", "line"].includes(cfg.shape) ? cfg.shape : "emanation";
      return inlineEl(kind, cfg, cfg.label ?? match[3] ?? areaLabel(shape, cfg.distance || 1), AREA_ICONS[shape]);
    }
  });
}

function rollers() {
  const ctl = (canvas.tokens?.controlled ?? []).filter(t => t.actor);
  if (ctl.length) return ctl.map(t => ({ actor: t.actor, token: t }));
  const a = game.user.character;
  if (!a) { ui.notifications.warn("Select a token or assign a character first."); return []; }
  return [{ actor: a, token: a.getActiveTokens()[0] ?? null }];
}

async function rollParts(list, nonlethalAll) {
  const comps = [], rolls = [];
  for (const p of list) {
    try {
      const r = await new Roll(p.formula).evaluate();
      rolls.push(r);
      comps.push({ pool: p.pool || "B", sub: p.sub, nl: nonlethalAll ? true : p.nl, kind: "D", formula: p.formula, total: r.total, dice: r.dice.map(d => ({ faces: d.faces, results: d.results.map(x => x.result) })) });
    } catch (e) { ui.notifications.warn(`Invalid dice formula: ${p.formula}`); }
  }
  return { comps, rolls };
}

/**
 * Several Targets (v0.0.160): a Save card rolls each Tier's damage when it appears, once, and every creature that lands on a Tier takes that
 * Tier's roll. The dice are shown together. Returns { t1: comps, t2: comps, t3: comps } (a Tier with no damage is left out).
 */
async function prerollTiers(cfg) {
  const out = {}, all = [];
  let step = 0;
  try {
    const user = cfg.saveAction && cfg.actorUuid ? fromUuidSync(cfg.actorUuid) : null;
    if (user) {
      const st = damageSteps(user, new Set([...(cfg.actionTraits ?? []), "__action"]));
      const emp = Math.max(0, ...st.empowered.map(x => x.n)), enf = Math.max(0, ...st.enfeebled.map(x => x.n));
      step = emp - enf;   // the Enfeebled value is taken from the Empowered one
    }
  } catch (e) { console.warn("twod12 | Empowered on a Save", e); }
  for (let n = 1; n <= 3; n++) {
    const parts = parseParts(cfg.tiers?.[`t${n}`]);
    if (!parts.damage.length) continue;
    const { comps, rolls } = await rollParts(parts.damage, cfg.nonlethal);
    // The Save Action's user is Empowered or Enfeebled: the value goes to every damage roll, per die (Several Targets in the rules).
    if (step) for (const c of comps) { const k = (c.dice ?? []).reduce((a, d) => a + (d.results?.length ?? 0), 0); if (k) { c.total = Math.max(0, c.total + step * k); c.formula = `${c.formula} ${step > 0 ? "+" : "\u2212"}${Math.abs(step)}/die`; } }
    if (comps.length) out[`t${n}`] = comps;
    all.push(...rolls);
  }
  if (all.length) { try { await showDice(all); } catch (e) { /* no dice to show */ } }
  return out;
}
/** A Tier's line on a Save card once its damage is rolled: the amounts, with the dice in the tooltip, then its texts and effects. */
async function tierRolled(parts, comps) {
  const bits = comps.map(c => `<span data-tooltip="${esc(`${c.formula}: ${(c.dice ?? []).flatMap(d => d.results ?? []).join(" + ") || c.total}`)}">${prettyDamage(esc(`[${({ B: "V", M: "R" })[c.pool || "B"] ?? c.pool}] ${c.total}${c.sub ? ` ${c.sub}` : ""}${c.nl ? " NL" : ""}`))}</span>`);
  bits.push(...parts.texts.map(t => prettyDamage(esc(t))));
  for (const u of parts.uuids) bits.push(`\u2726 ${esc((await fromUuid(u))?.name ?? "?")}`);
  return bits.join("<br>") || "&mdash;";
}

async function tierSummary(parts) {
  const bits = parts.damage.map(p => `[${({ B: "V", M: "R" })[p.pool || "B"] ?? p.pool}] ${p.formula}${p.sub ? ` ${p.sub}` : ""}${p.nl ? " NL" : ""}`);
  bits.push(...parts.texts);
  for (const u of parts.uuids) bits.push(`\u2726 ${(await fromUuid(u))?.name ?? "?"}`);
  return bits.map(b => prettyDamage(esc(b))).join("<br>") || "&mdash;";   // [M] and Ho as the brain and the colored type, like on Action cards
}

/** Roll the tier's damage, deal it to the actor right away and post a card showing what happened. */
async function resolveSaveTier(actor, title, subtitle, cfg, tier, pre = null) {
  const parts = parseParts(cfg.tiers[`t${tier}`]);
  if (!parts.damage.length && !parts.texts.length && !parts.uuids.length) return;
  const { comps, rolls } = pre ?? await rollParts(parts.damage, cfg.nonlethal);
  const summary = comps.length ? await dealDamage(actor, comps) : "";
  const names = [];
  if (parts.uuids.length) {
    await applyEffects(parts.uuids, [actor.uuid], originInfo(""));
    for (const u of parts.uuids) names.push((await fromUuid(u))?.name ?? "?");
  }
  const applied = `${esc(actor.name)}${summary ? ` takes <b>${summary}</b> damage` : ""}${names.length ? `${summary ? "; " : " gains "}${esc(names.join(", "))}` : ""}.`;
  await postDamageCard({ actor, title, subtitle, comps, rolls: pre ? [] : rolls, texts: await Promise.all(parts.texts.map(t => enrich(t))), applied });
}

async function doCheck(kind, cfg, ctx = {}) {
  // A Save carries the traits of the Action that caused it ("from"), so Talents can give bonuses against, say, Divine Actions.
  const fromList = kind === "Save" ? (ctx.message?.getFlag?.("twod12", "action")?.traits ?? []) : [];
  const key = cfg.attr;
  if (!(key in TWOD12.attributes)) return ui.notifications.warn(`Unknown attribute: ${key}`);
  const label = `${TWOD12.attributes[key]} ${kind === "Save" ? "Save" : "Check"}`;
  for (const { actor } of rollers()) {
    const mod = actor.system.attributes[key] ?? 0;
    // v0.0.176 (book 2026-10-25): only the light where the TARGET is matters, so the light where you stand no longer changes a Check
    // (the "requires sight" penalties of Dim light and Darkness are gone; |sight:yes is still read and does nothing).
    const data = await askRoll(actor, {
      title: `${label}: ${actor.name}`,
      attrKey: key,
      traits: new Set([...(cfg.traits ?? []), key, kind === "Save" ? "__save" : "__check"]),
      from: fromList.length ? new Set(fromList) : null,
      defaults: {
        dc: cfg.dc,
        mod: cfg.adj,
        boons: cfg.boon,
        banes: cfg.bane,
        doomed: unconsciousDoom(actor, key, kind),
        doomedWhy: `${doomStatus(actor) || "Unconscious"}: all your Rolls are Doomed`,
        doomedLabel: `${doomStatus(actor) || "Unconscious"} (Doomed)`
      }
    });
    if (!data) continue;
    const fxm = resolveModifiers(actor, data.fx);
    const manB = Number(data.boons) || 0, manN = Number(data.banes) || 0;
    const dc = Number(data.dc) || 13;
    const chk = await performCheck({ mod, boons: fxm.boons + manB, banes: fxm.banes + manN, dc, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data), favored: data.favored === "on", doomed: data.doomed === "on", sources: fxm.sources, manualBoons: manB, manualBanes: manN });
    const labels = [`\u2264 ${dc - 1}`, `${dc}\u2013${dc + 6}`, `\u2265 ${dc + 7}`];
    const dbl = chk.doubles;
    const rows = [];
    for (let n = 1; n <= 3; n++) {
      const cls = dbl ? (n === chk.tier ? "up" : (n === chk.base ? "hit" : "")) : (n === chk.tier ? "hit" : "");
      const body = kind === "Save" ? await tierSummary(parseParts(cfg.tiers[`t${n}`])) : `Tier ${n}`;
      rows.push(`<tr class="${cls}"><th>${labels[n - 1]}</th><td>${body}</td></tr>`);
    }
    const pre = kind === "Save" ? await rollParts(parseParts(cfg.tiers[`t${chk.tier}`]).damage, cfg.nonlethal) : null;
    const all = combineRolls([...chk.rolls, ...(pre?.rolls ?? [])]);
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }), rolls: all ? [all] : [],
      content: `<div class="twod12 chat action"><div class="ahead"><b>${esc(label)}</b><span>DC ${dc}</span></div>${checkHtml(`${TWOD12.attributes[key]} ${sgn(mod)}`, chk, [])}<table class="tiers">${rows.join("")}</table></div>`
    });
    if (kind !== "Save") continue;
    await resolveSaveTier(actor, label, labels[chk.tier - 1], cfg, chk.tier, pre);
  }
}

async function doDamage(cfg) {
  const { comps, rolls } = await rollParts(cfg.parts.damage, cfg.nonlethal);
  if (!comps.length && !cfg.parts.texts.length && !cfg.parts.uuids.length) return;
  await postDamageCard({
    title: "Damage", comps, rolls, texts: await Promise.all(cfg.parts.texts.map(t => enrich(t))),
    fx: cfg.parts.uuids.map(u => ({ uuid: u, mode: "auto" })),
    targets: [...game.user.targets].map(t => ({ uuid: t.document.uuid, name: t.name }))
  });
}

/** The creature a button acts for: the one the after-damage chain names, the card's creature, the selected token or your character. */
export const originActor = ctx => ctx?.actor ?? actorOfDoc(ctx?.message) ?? canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
const tokenOfActor = a => a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null;
/** v0.0.249: a Move chip's distance for a creature on this Tier (t2:1|t3:2 on the chip: Word of Radiance's Pushed 1 / 2), else the chip's distance. */
export const tierDistance = (cfg, tier) => { const v = cfg?.tiers?.[`t${tier}`]; return v !== undefined && /^\d+$/.test(String(v)) ? Number(v) : null; };
/** The tokens of the card's targets: the chain's, the Action card's, or a damage card's. */
export function cardTargetTokens(ctx) {
  const list = ctx?.targets ?? ctx?.message?.getFlag?.("twod12", "action")?.targets ?? ctx?.message?.getFlag?.("twod12", "dmgCard")?.targets ?? [];
  return list.map(t => { try { return fromUuidSync(t.uuid)?.object ?? null; } catch (e) { return null; } }).filter(Boolean);
}

/**
 * Who a "you or one ally" button (@Guard, @Effect) is for (v0.0.181): the targeted creatures on the card's creature's side;
 * with none, the card's creature itself (self:yes: always the card's creature). The enemy you just hit is never chosen by accident.
 * v0.0.246 (cards 1, Smite): area:N looks for the allies in an N Emanation around the card's target ("in the light"); who:pick asks which one
 * creature gains it, you first (no question when you are the only one); who:all gives it to every ally found.
 */
async function allyRecipients(cfg, ctx, what = "the effect") {
  const origin = originActor(ctx);
  if (cfg.self || cfg.who === "self") return { origin, who: [origin].filter(Boolean) };
  const me = tokenOfActor(origin);
  const side = me?.document?.disposition ?? canvas.tokens?.controlled[0]?.document?.disposition ?? 1;
  const mine = t => t.actor && t.document?.disposition === side && t.id !== me?.id;
  let allies;
  if (cfg.area > 0) allies = tokensInEmanation(cardTargetTokens(ctx), cfg.area).filter(mine).map(t => t.actor);
  else {
    const fromCard = cardTargetTokens(ctx).filter(mine);
    allies = (fromCard.length ? fromCard : [...game.user.targets].filter(mine)).map(t => t.actor);
  }
  if (cfg.who !== "pick") return { origin, who: allies.length ? allies : [origin].filter(Boolean) };
  const cands = [...(origin ? [origin] : []), ...allies.filter(a => a !== origin)];
  if (cands.length <= 1) return { origin, who: cands };
  // v0.0.247 (Lucas): the question is a bar at the bottom (pickbar.mjs), not a Foundry window
  const { pickBar } = await import("./pickbar.mjs");
  const pick = await pickBar({ icon: "fa-shield-heart", text: `Who gains <b>${esc(what)}</b>? ${cfg.area > 0 ? `You, or an ally within ${cfg.area} of the target` : "You, or one ally"} (click here or the token).`,
    options: cands.map((a, n) => ({ id: String(n), label: a === origin ? `You (${a.name})` : a.name, cls: a === origin ? "you" : "", token: tokenOfActor(a) })) });   // v0.0.248: the token on the map can be clicked too
  if (pick == null || pick === "done") return { origin, who: [], cancelled: true };
  return { origin, who: [cands[Number(pick)]] };
}

/** The @Effect[uuid] button (v0.0.181): applies an Effect item to you or the targeted allies ("you or one ally gain +1 Defense"). */
async function handleEffect(cfg, ctx) {
  let what = "the effect";
  try { what = (await fromUuid(cfg.uuid))?.name ?? what; } catch (e) { /* not loaded */ }
  const { origin, who, cancelled } = await allyRecipients(cfg, ctx, what);
  if (cancelled) return;
  if (!who.length) return ui.notifications.warn("Select your token, or target the ally that gains the effect.");
  const act = ctx.message?.getFlag?.("twod12", "action");
  const mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number.isFinite(act?.attrVal) ? act.attrVal : null);
  const uuids = who.map(a => a.getActiveTokens?.()[0]?.document?.uuid ?? a.uuid);
  await applyEffects([cfg.uuid], uuids, { ...originInfo(origin?.uuid ?? ""), ...(mod !== null ? { mod } : {}) });
}

/** "1d8+mod" -> "1d8 + [Mod]"; "rally" -> "a Rally Point's heal". */
export const guardText = f => String(f ?? "").replace(/\+/g, " + ").replace(/\bmod\b/g, "[Mod]").replace(/\brally\b/g, "a Rally Point's heal");

/**
 * The @Guard[formula] button (v0.0.181; book: Guard, Chapter 4): @Guard[1d8+mod], @Guard[2d6|self:yes], @Guard[rally] (the creature's own Rally Point heal).
 * mod is the Modifier of the card's roll (or the origin's Signature Modifier). It goes to the targets (or the selected tokens); self:yes: the card's creature.
 * Each creature keeps the higher of its Guard and the new value.
 */
async function handleGuard(cfg, ctx) {
  const act = ctx.message?.getFlag?.("twod12", "action");
  const origin0 = originActor(ctx);
  const mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number.isFinite(Number(act?.attrVal)) && act?.attrVal !== undefined ? Number(act.attrVal) : (Number(origin0?.system?.signatureMod) || 0));
  const { origin, who, cancelled } = await allyRecipients(cfg, ctx, `Guard ${withMod(guardText(cfg.formula), mod)}`);
  if (cancelled) return;
  if (!who.length) return ui.notifications.warn("Select your token, or target the ally that gains the Guard.");
  for (const a of who) {
    const f = String(cfg.formula || "0").replace(/\bmod\b/g, `(${mod})`).replace(/\brally\b/g, `(${Number(a.system?.rallyHeal) || 0})`);
    const roll = await new Roll(f).evaluate();
    const now = Number(a.system?.guard) || 0, next = gainGuard(now, roll.total);
    if (next !== now) {
      if (a.isOwner) await a.update({ "system.guard": next });
      else game.socket.emit("system.twod12", { type: "applyGuard", actorUuid: a.uuid, value: next });
    }
    // v0.0.246: a system line (the standing rule for chat messages)
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: origin ?? a }), rolls: /d/.test(f) ? [roll] : [],
      content: sysLine("fa-shield-heart", `<b>${esc(a.name)}</b> ${next > now ? `gains <b>Guard ${next}</b>` : `keeps Guard ${now} (the higher; the new Guard was ${roll.total})`} <small>(${esc(withMod(guardText(cfg.formula), mod))} = ${roll.total})</small>.`, "guardmsg") });
  }
}

/**
 * v0.0.246 (cards 1, Smite 3 AP): the chips an Action's Version lists under "After the damage" run one after the other once the damage is applied
 * (the Guard's "who" question, then the Pushes, one creature at a time). `text` is the Version's field: the same chips as in any text.
 * ctx: { actor, targets: [{ uuid, name }], attrVal } (the damage card's creature, targets and Modifier).
 */
export async function runAfter(text, ctx = {}) {
  const re = /@(\w+)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]+)\})?/g;
  let m;
  while ((m = re.exec(String(text ?? "")))) {
    const cfg = parseInline(m[1], m[2]);
    if (m[3]) cfg.label = m[3];
    try { await handleInline(m[1], cfg, { ...ctx, message: ctx.message ?? null }); } catch (e) { console.error("twod12 | after the damage", e); }
  }
}

/** v0.0.246: a book link. A Journal page named like the heading opens it (the Journal import comes later); until then, a note. */
async function openBook(cfg) {
  const ref = String(cfg.ref ?? "").trim();
  if (!ref) return;
  for (const j of game.journal ?? []) {
    const page = j.pages?.find?.(p => String(p.name ?? "").toLowerCase() === ref.toLowerCase());
    if (page) return j.sheet.render(true, { pageId: page.id });
  }
  await foundry.applications.api.DialogV2.prompt({ window: { title: ref }, rejectClose: false, ok: { label: "Close" },
    content: `<p><b>${esc(ref)}</b> is a rule of the book${cfg.doc ? ` (${esc(cfg.doc)})` : ""}: read it there. When the book is imported into Foundry as a Journal, this link opens its page.</p>` });
}

export async function handleInline(kind, cfg, ctx = {}) {
  if (kind === "Book") return openBook(cfg);
  if (kind === "Guard") return handleGuard(cfg, ctx);
  if (kind === "Effect") return handleEffect(cfg, ctx);
  if (kind === "Move") return handleMove(cfg, ctx);
  if (kind === "Rally") return handleRally(cfg);
  if (kind === "Condition") return handleCondition(cfg, ctx);
  if (kind === "Use") return handleUse(cfg, ctx);
  if (kind === "Cleave") return handleCleave(cfg, ctx);
  if (kind === "Reload") return handleReloadWeapon(ctx);
  if (kind === "Release") return handleRelease(ctx);
  if (kind === "Regrip") return handleRegrip(ctx);
  if (kind === "Check" || kind === "Save") return doCheck(kind, cfg, ctx);
  if (kind === "Damage") return doDamage(cfg);
  if (kind === "SaveCard") return postSaveCard(cfg, ctx);
  if (kind === "Template") return startTemplate(cfg, ctx);
  if (kind === "Boon") return boonFlow(cfg, ctx);
}

/**
 * Cleave N: you deal your Attribute as damage (the type and subtype of the weapon) to up to N creatures adjacent to the original target.
 * Target them, click the button, and a damage card for them is posted: apply it from there.
 */
async function handleCleave(cfg, ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  if (!f) return ui.notifications.warn("Cleave works from the card of the Action that rolled it.");
  const origins = (f.targets ?? []).map(t => { try { return fromUuidSync(t.uuid)?.object; } catch (e) { return null; } }).filter(Boolean);
  const originIds = new Set((f.targets ?? []).map(t => t.uuid));
  let picked = [...game.user.targets].filter(t => !originIds.has(t.document.uuid));
  if (!picked.length) return ui.notifications.warn(`Target up to ${cfg.n} creature${cfg.n === 1 ? "" : "s"} next to the original target, then click Cleave.`);
  const ok = [], skipped = [];
  for (const t of picked) {
    if (origins.length && !origins.some(o => squaresBetween(o, t) <= 1)) skipped.push(t.name); else ok.push(t);
  }
  if (skipped.length) ui.notifications.warn(`Not adjacent to the original target: ${skipped.join(", ")}.`);
  if (ok.length > cfg.n) ui.notifications.warn(`Cleave ${cfg.n}: only the first ${cfg.n} of the ${ok.length} targets are used.`);
  const chosen = ok.slice(0, cfg.n);
  if (!chosen.length) return;
  const actor = f.actorUuid ? await fromUuid(f.actorUuid) : null;
  const itemName = actor?.items?.get(f.itemId)?.name ?? "Cleave";
  const attr = Number(f.attrVal) || 0;
  await postDamageCard({
    actor, title: itemName, subtitle: `Cleave ${cfg.n}`, color: f.color,
    comps: [{ kind: "D", pool: "B", sub: f.weaponSub ?? "", formula: String(attr), total: attr, dice: [] }],
    targets: chosen.map(t => ({ uuid: t.document.uuid, name: t.name })), originUuid: f.actorUuid, defaultNl: !!f.nl
  });
}

/** Release: the creature lets go of a weapon it holds: a two-handed weapon is then held with one hand, or the weapon is dropped (no longer held). */
async function handleRelease(ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  let actor = null;
  try { actor = f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }
  actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  if (!actor?.isOwner) return ui.notifications.warn("Select your token first.");
  const buttons = releaseOptions(actor);   // the same choices as the free-hand prompt (hands.mjs)
  if (!buttons.length) return ui.notifications.info(`${actor.name} holds no weapon. (Dropping another object needs no roll.)`);
  const pick = await foundry.applications.api.DialogV2.wait({ window: { title: `Release: ${actor.name}` }, content: "<p>What do you let go of?</p>", buttons, rejectClose: false });
  if (!pick) return;
  const [kind, id] = String(pick).split(":"), w = actor.items.get(id);
  if (!w) return;
  if (kind === "one") await w.update({ "system.hands": 1 }); else await w.update({ "system.wielded": false, "system.dropped": true });   // on the ground (v0.0.139)
  ui.notifications.info(kind === "one" ? `${actor.name} holds ${w.name} with one hand.` : `${actor.name} drops ${w.name}.`);
}

/** v0.0.211: Regrip from its card (the Action already paid its AP): the choices for the creature that used it. */
async function handleRegrip(ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  let actor = null;
  try { actor = f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }
  actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  if (!actor?.isOwner) return ui.notifications.warn("Select your token first.");
  const o = actor.getFlag?.("twod12", "itemOrder") ?? [], k = id => { const n = o.indexOf(id); return n < 0 ? 9999 : n; };
  await regripPrompt(actor, [...actor.itemTypes.weapon].sort((x, y) => k(x.id) - k(y.id)));
}

/** The weapon (with the Reload property) of the creature that used the Action is loaded again. */
async function handleReloadWeapon(ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  let actor = null;
  try { actor = f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }
  actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  if (!actor?.isOwner) return ui.notifications.warn("Select your token first.");
  // v0.0.221 (Lucas; book: Reload, Distance Reach): your own unloaded weapon, or an ally's within your Reach. Several: you choose one.
  const emptyOf = a => (a?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && w.system.traits.has("reload") && w.system.unloaded);
  const opts = emptyOf(actor).map(w => ({ w, who: actor, label: `Your ${w.name}` }));
  const me = actor.token?.object ?? actor.getActiveTokens?.()[0] ?? null;
  if (me) {
    const reach = Math.max(1, Number(actor.system?.reach) || 1);
    const { tokenDistance } = await import("./light.mjs");
    for (const t of canvas.tokens?.placeables ?? []) {
      if (t.id === me.id || !t.actor || t.document.hidden || (t.document.disposition ?? 0) !== (me.document.disposition ?? 0) || tokenDistance(me, t) > reach) continue;
      for (const w of emptyOf(t.actor)) opts.push({ w, who: t.actor, label: `${t.name}'s ${w.name}` });
    }
  }
  if (!opts.length) return ui.notifications.info(`No unloaded weapon in hand: neither ${actor.name}'s nor an ally's within Reach.`);
  let pick = opts[0];
  if (opts.length > 1) {
    const k = await foundry.applications.api.DialogV2.wait({ window: { title: "Reload" }, content: "<p>Which weapon do you reload?</p>", rejectClose: false,
      buttons: opts.map((o, n) => ({ action: String(n), label: o.label, default: n === 0 })) });
    if (k == null) return;
    pick = opts[Number(k)];
  }
  if (pick.w.isOwner) await pick.w.update({ "system.unloaded": false });
  else game.socket.emit("system.twod12", { type: "reloadWeapon", uuid: pick.w.uuid });   // the GM reloads an ally's weapon you don't own
  const { sysLine } = await import("./sysmsg.mjs");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-bullseye", pick.who === actor ? `<b>${esc(actor.name)}</b> reloads ${esc(pick.w.name)}.` : `<b>${esc(actor.name)}</b> reloads <b>${esc(pick.who.name)}</b>'s ${esc(pick.w.name)}.`, "reloadmsg") });
}

/** The condition goes on the targets of the card (or the targeted / selected tokens), with the duration written on the button. */
async function handleCondition(cfg, ctx = {}) {
  const msg = ctx.message;
  const f = msg?.getFlag?.("twod12", "action") ?? msg?.getFlag?.("twod12", "dmgCard");
  let actors = [];
  const toActor = async uuid => { const d = await fromUuid(uuid); return d?.documentName === "Actor" ? d : d?.actor; };
  if (f?.self && f.actorUuid) actors = [await toActor(f.actorUuid)];
  else if (ctx.targets?.length) actors = await Promise.all(ctx.targets.filter(t => !cfg.crit || t.crit).map(t => toActor(t.uuid)));   // v0.0.249: the chain's targets (crit:yes: the Criticals only)
  else if (f?.targets?.length) actors = await Promise.all(f.targets.map(t => toActor(t.uuid)));
  else if (game.user.targets.size) actors = [...game.user.targets].map(t => t.actor);
  else actors = (canvas.tokens?.controlled ?? []).map(t => t.actor);
  actors = actors.filter(Boolean);
  if (!actors.length) return cfg.crit && ctx.targets?.length ? ui.notifications.info("No Critical: nothing to apply.") : ui.notifications.warn("Target or select a token first.");
  const src = ctx.actor ?? (f?.actorUuid ? await fromUuid(f.actorUuid) : (game.combat?.combatant?.actor ?? null));
  const dur = cfg.dur === "eot" ? { type: "eot" } : (cfg.dur === "rounds" ? { type: "rounds", rounds: cfg.rounds } : null);
  const found = await applyCondition(cfg.cond, actors, dur, { ...originInfo(src?.uuid ?? ""), ...(Number.isFinite(f?.attrVal ?? f?.originMod) ? { mod: f.attrVal ?? f.originMod } : {}) });
  ui.notifications.info(`${cfg.cond.charAt(0).toUpperCase() + cfg.cond.slice(1)} applied to ${actors.map(a => a.name).join(", ")}${found ? "" : " (as a status: there is no Effect item with that name)"}.`);
}

/* ---- Save card: one row per targeted token: name | check result | damage taken ---- */
const saveLabels = dc => [`\u2264 ${dc - 1}`, `${dc}\u2013${dc + 6}`, `\u2265 ${dc + 7}`];

const sdie = (f, dbl) => `<span class="die d12${f === 12 ? " boom" : ""}${dbl ? " dbl" : ""}">${f}</span>`;
const sside = (f, cls, sign) => f?.length ? `<span class="plus">${sign}</span><span class="dgroup ${cls}">${f.map(x => `<span class="die d3 ${cls}">${x}</span>`).join("")}</span>` : "";
/** The check dice and the damage dice of one finished save, as chips (same look as the check card). */
const diceRowHtml = (d, tier = 0) => {
  if (!d) return "";
  // each damage roll has its symbols in front: a heart or a brain, and the damage type's icon ("Body Bl" is a heart and a hammer)
  const sym = c => `${c.pool ? poolIcon(c.pool) : ""}${c.sub ? `<span class="dtic" data-tooltip="${esc(TWOD12.subtypes[c.sub] ?? c.sub)}" style="color:${TWOD12.subtypeInk[c.sub] ?? "inherit"}">${dtypeIcon(c.sub)}</span>` : ""}`;
  const dmg = (d.dmg ?? []).filter(c => c.faces?.length).map(c => `${c.pool || c.sub ? `<span class="dsym">${sym(c)}</span>` : ""}<span class="dgroup dmgdice" data-tooltip="${esc(c.formula)}">${c.faces.map(f => `<span class="die d${c.d}">${f}</span>`).join("")}</span>`).join("");
  const anySym = (d.dmg ?? []).some(c => c.faces?.length && (c.pool || c.sub));
  return `<div class="dice sdice">${tier ? `<span class="rtag rolled${tier === 1 ? " fail" : ""}">Tier ${tier}</span>` : ""}<span class="dgroup">${d.d1.map((f, i) => sdie(f, d.doubles && i === 0)).join("")}</span><span class="plus">+</span><span class="dgroup">${d.d2.map((f, i) => sdie(f, d.doubles && i === 0)).join("")}</span>${sside(d.boon, "boon", "+")}${sside(d.bane, "bane", "&minus;")}${dmg ? `<span class="grow"></span>${anySym ? "" : '<i class="fa-solid fa-burst sdicon"></i>'}${dmg}` : ""}</div>`;
};

/** What a creature took, in the Save card's last column: just the total damage, and (small) any other effect. Cards from before keep their text. */
const dmgCellHtml = res => {
  if (!("amount" in res)) return esc(res.dmg || "\u2014");
  return (res.amount != null ? `<b class="samt">${res.amount}</b>` : "") || "\u2014";   // v0.0.249: the texts go on their own line under the row (they broke the columns)
};
const extraLineHtml = res => (res && "amount" in res && res.extra ? `<div class="sextraline">${prettyDamage(esc(res.extra))}</div>` : "");

async function saveCardHtml(st) {
  const cfg = st.cfg, dc = cfg.dc, attr = TWOD12.attributes[cfg.attr];
  const labels = saveLabels(dc);
  const rows = [];
  for (let n = 1; n <= 3; n++) {
    const parts = parseParts(cfg.tiers[`t${n}`]), rolled = st.tierDmg?.[`t${n}`];
    rows.push(`<tr class="t${n}"><th data-tooltip="Tier ${n}">${labels[n - 1]}</th><td>${rolled ? await tierRolled(parts, rolled) : await tierSummary(parts)}</td></tr>`);
  }
  const traits = cfg.traits.length ? `<div class="traits">${traitChevrons(cfg.traits, { compact: true })}</div>` : "";   // a chat card: tight chips (v0.0.180)
  const targets = st.rows.map((r, i) => {
    const res = r.result;
    const mid = res ? `<span class="shield small ${res.total >= dc ? "win" : "lose"}" data-tooltip="${esc(res.tip)}"><b class="rtotal">${res.total}</b><small class="vsdc">DC ${dc}</small></span>` : `<button type="button" data-twod12="saveRoll" data-idx="${i}">${esc(attr)}</button>`;
    return `<div class="srow"><span class="sname"><i class="fa-solid fa-crosshairs"></i> ${esc(r.name)}</span>${mid}<span class="sdmg ${res ? `t${res.tier}` : ""}">${res ? dmgCellHtml(res) : ""}</span></div>${extraLineHtml(res)}${res ? diceRowHtml(res.dice, res.tier) : ""}`;
  }).join('<hr class="sep">');
  return `<div class="twod12 chat action savecard" style="${st.color ? cardVars(st.color) : ""}">${cardHead(`${attr} Save`, "", `<span class="apmark">DC ${dc}</span>`)}${traits}
    <div class="orn">&#10022; &#10022; &#10022;</div><table class="tiers">${rows.join("")}</table><div class="orn">&#10022;</div><div class="stargets"><div class="srow sthead"><span class="sname"><button type="button" class="tgt" data-twod12="retargetSave" data-tooltip="Retarget"><i class="fa-solid fa-bullseye"></i></button> Name</span><span class="scol">Save</span><span class="scol r">Damage</span></div>${targets || "<i>No targets</i>"}</div></div>`;
}

/**
 * The Save of a Save Action (v0.0.159): the Save on its Vs. line, DC 11 + the Modifier its traits name, and each Tier's damage as the book writes it
 * ([Mod] = your Modifier, on the Tiers where the card has it: Tier 1 and 2) and the Tier's text. Its targets roll it (Tier 1 is the worst for them).
 */
export function saveActionCfg(actor, item, version, src) {
  const it = item.system, mod = Number(src?.mod) || 0;
  const subName = k => (TWOD12.subtypes[k] ?? "").toLowerCase();
  const tier = n => {
    const parts = [];
    for (const i of version[`t${n}`] ?? []) {
      const tag = `[${[i.pool === "M" ? "mind" : "body", subName(i.subtype)].filter(Boolean).join(",")}]`;
      if (i.dice && i.useAt) parts.push(`${i.dice}+${mod}${tag}`);
      else if (i.dice) parts.push(`${i.dice}${tag}`);
      else if (i.useAt) parts.push(`${mod}${tag}`);
    }
    const x = String(version[`x${n}`] ?? "").replace(/<[^>]+>/g, "").trim();
    if (x && !/^no effect\.?$/i.test(x)) parts.push(`"${x.replace(/"/g, "'")}"`);
    return parts.join(", ") || "0";
  };
  return { attr: it.vs && it.vs !== "roll" ? it.vs : "body", dc: saveDcOf(src, actor.system?.attributes), adj: 0, boon: 0, bane: 0, traits: [], tiers: { t1: tier(1), t2: tier(2), t3: tier(3) }, saveAction: true, source: item.name, actorUuid: actor.uuid, actionTraits: [...(it.traits ?? [])] };
}

/** The banes and boons a creature takes on a Save Action's Save: Vulnerable N gives N banes; Cover from the area's center gives boons (Save Actions). */
function saveRowMods(tokenDoc, point) {
  const out = { boon: 0, bane: 0, why: [] };
  const a = tokenDoc?.actor;
  let v = 0;
  for (const e of a?.effects ?? []) if (!e.disabled && e.statuses?.has?.("vulnerable")) v = Math.max(v, Math.max(1, Math.trunc(Number(e.getFlag?.("twod12", "value"))) || 1));
  if (v) { out.bane += v; out.why.push(`Vulnerable ${v}`); }
  try {
    if (point && tokenDoc?.object && canvas?.grid) {
      const c = coverFromPoint(point, tokenDoc.object);   // counted from the center of the area (its Point of Origin)
      if (c?.level > 0) { const n = Math.min(3, c.level); out.boon += n; out.why.push(`${c.label} (${n} Boon${n === 1 ? "" : "s"})`); }
    }
  } catch (e) { console.warn("twod12 | cover from the area", e); }
  return out;
}

/** A Save card for these targets (each player rolls their own Save), from a Save Action or an [HT] area that repeats it. */
export async function postSaveFor(cfg, targets, { point = null, source = "", note = "" } = {}) {
  const rows = [];
  for (const t of targets) {
    const doc = await fromUuid(t.uuid).catch(() => null);
    const m = saveRowMods(doc, point);
    rows.push({ uuid: t.uuid, name: t.name, result: null, boon: m.boon, bane: m.bane, why: m.why.join(", ") });
  }
  const head = `<div class="twod12 chat"><b>${esc(source || cfg.source || "Save")}</b>: ${note ? `${note} ` : ""}${rows.length ? `${rows.map(r => esc(r.name)).join(", ")} roll${rows.length === 1 ? "s" : ""} a DC ${cfg.dc} ${esc(TWOD12.attributes[cfg.attr] ?? cfg.attr)} Save.` : "no creature is in the area."}</div>`;
  if (!rows.length) return ChatMessage.create({ content: head });
  const st = { cfg, color: "", rows, tierDmg: await prerollTiers(cfg) };   // each Tier's damage rolled once, now
  await ChatMessage.create({ content: await saveCardHtml(st), flags: { twod12: { saveCard: st } } });
}

export async function postSaveCard(cfg, ctx = {}) {
  // The tokens targeted now; if none, the targets of the Action card the Save came from.
  const fromCard = ctx.message?.getFlag?.("twod12", "action")?.targets ?? [];
  const targets = game.user.targets.size ? [...game.user.targets].map(t => ({ uuid: t.document.uuid, name: t.name })) : fromCard.map(t => ({ uuid: t.uuid, name: t.name }));
  if (!(cfg.attr in TWOD12.attributes)) return ui.notifications.warn(`Unknown attribute: ${cfg.attr}`);
  if (!targets.length) return ui.notifications.warn("Target at least one token first.");
  const st = { cfg, color: ctx.message?.getFlag?.("twod12", "action")?.color ?? "", rows: targets.map(t => ({ uuid: t.uuid, name: t.name, result: null })), tierDmg: await prerollTiers(cfg) };
  await ChatMessage.create({ content: await saveCardHtml(st), flags: { twod12: { saveCard: st } } });
}

async function writeSaveCard(msg, st) {
  await msg.update({ content: await saveCardHtml(st), "flags.twod12.saveCard": st });
}

async function storeSaveResult(messageId, idx, result) {
  const msg = game.messages.get(messageId);
  const st = foundry.utils.deepClone(msg?.getFlag("twod12", "saveCard"));
  if (!st || st.rows[idx].result) return;
  const { tierDmg, ...rest } = result;
  if (tierDmg?.length && !st.tierDmg?.[`t${result.tier}`]) st.tierDmg = { ...(st.tierDmg ?? {}), [`t${result.tier}`]: tierDmg };
  st.rows[idx].result = rest;
  await writeSaveCard(msg, st);
}

/** Replace the card's targets with the currently targeted (or selected) tokens, keeping finished rows. */
export async function retargetSave(msg) {
  const st = foundry.utils.deepClone(msg.getFlag("twod12", "saveCard"));
  if (!st) return;
  const toks = game.user.targets.size ? [...game.user.targets] : (canvas.tokens?.controlled ?? []);
  if (!toks.length) return ui.notifications.warn("Select or target a token first.");
  const old = new Map(st.rows.map(r => [r.uuid, r]));
  st.rows = toks.map(t => old.get(t.document.uuid) ?? { uuid: t.document.uuid, name: t.name, result: null });
  try { await writeSaveCard(msg, st); } catch (e) { ui.notifications.warn("Only the author of this card or the GM can change its targets."); }
}

export function registerInlineSocket() {
  game.socket.on("system.twod12", async data => {
    if (game.user.isActiveGM && data?.type === "saveResult") await storeSaveResult(data.messageId, data.idx, data.result);
  });
}

export async function saveRoll(msg, idx) {
  const st = msg.getFlag("twod12", "saveCard");
  const row = st?.rows[idx];
  if (!row || row.result) return;
  const actor = (await fromUuid(row.uuid))?.actor;
  if (!actor?.isOwner) return ui.notifications.warn("Only the owner of that token can roll its save.");
  const cfg = st.cfg, key = cfg.attr, mod = actor.system.attributes[key] ?? 0;
  // A Save Action's row carries its target's own banes and boons (Vulnerable, Cover from the area): they start in the dialog (v0.0.159).
  const data = await askRoll(actor, { title: `${TWOD12.attributes[key]} Save: ${actor.name}${row.why ? ` (${row.why})` : ""}`, attrKey: key, traits: new Set([...(cfg.traits ?? []), key, "__save"]), defaults: { dc: cfg.dc, mod: cfg.adj, boons: (cfg.boon || 0) + (row.boon || 0), banes: (cfg.bane || 0) + (row.bane || 0) } });
  if (!data) return;
  const fxm = resolveModifiers(actor, data.fx);
  const manB = Number(data.boons) || 0, manN = Number(data.banes) || 0, dc = Number(data.dc) || cfg.dc;
  const chk = await performCheck({ mod, boons: fxm.boons + manB, banes: fxm.banes + manN, dc, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data), favored: data.favored === "on", doomed: data.doomed === "on", sources: fxm.sources, manualBoons: manB, manualBanes: manN });
  // The damage of the tier rolled is calculated right away and every die (check and damage) is thrown at once.
  const parts = parseParts(cfg.tiers[`t${chk.tier}`]);
  // Several Targets: the damage of a Tier is rolled once, by the first creature on that Tier, and every other creature on it takes the same.
  const shared = st.tierDmg?.[`t${chk.tier}`] ?? null;
  const { comps, rolls } = shared ? { comps: shared.map(c => ({ ...c })), rolls: [] } : await rollParts(parts.damage, cfg.nonlethal);
  await showDice([...chk.rolls, ...rolls]);
  const bits = [], extras = [];
  let amount = null;
  if (comps.length) { bits.push(await dealDamage(actor, comps)); amount = comps.reduce((s, c) => s + c.total, 0); }
  bits.push(...parts.texts); extras.push(...parts.texts);
  if (parts.uuids.length) {
    await applyEffects(parts.uuids, [actor.uuid], originInfo(""));
    for (const u of parts.uuids) { const b = `\u2726 ${(await fromUuid(u))?.name ?? "?"}`; bits.push(b); extras.push(b); }
  }
  const tip = `${TWOD12.attributes[key]} ${sgn(mod)}${chk.adj ? `, modifier ${sgn(chk.adj)}` : ""}: 2d12 ${chk.d1.join("+")} + ${chk.d2.join("+")}${chk.boonFaces.length ? `, boons ${chk.boonFaces.join("+")}` : ""}${chk.baneFaces.length ? `, banes ${chk.baneFaces.join("+")}` : ""}${chk.doubles ? ", doubles" : ""} = ${chk.total} vs DC ${dc} (${saveLabels(dc)[chk.tier - 1]})${comps.length ? `. Damage: ${comps.map(c => `${c.formula} [${c.dice.map(d => d.results.join("+")).join(" ")}] = ${c.total}`).join("; ")}` : ""}`;
  const result = {
    total: chk.total, tier: chk.tier, tip, dmg: bits.join("; "), amount, extra: extras.join("; "), tierDmg: shared ? null : comps,
    dice: { d1: chk.d1, d2: chk.d2, boon: chk.boonFaces, bane: chk.baneFaces, doubles: chk.doubles, dmg: comps.flatMap(c => c.dice.map(d => ({ d: d.faces, faces: d.results, formula: c.formula, pool: c.pool, sub: c.sub }))) }
  };
  if (game.user.isGM || msg.isAuthor) await storeSaveResult(msg.id, idx, result);
  else game.socket.emit("system.twod12", { type: "saveResult", messageId: msg.id, idx, result });
}

/** @Boon: put boons or banes on the next matching roll of the card's targets (or of the user, with self:yes). */
async function boonFlow(cfg, ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  let src = null;
  try { src = f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }
  src ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  let actors;
  if (cfg.self) actors = src ? [src] : [];
  else {
    const fromCard = (f?.targets ?? []).map(t => { try { return fromUuidSync(t.uuid)?.actor ?? null; } catch (e) { return null; } }).filter(Boolean);
    actors = fromCard.length ? fromCard : [...game.user.targets].map(t => t.actor).filter(Boolean);
  }
  if (!actors.length) return ui.notifications.warn(cfg.self ? "Select your token first." : "Target a creature first.");
  const origin = originInfo(src?.uuid ?? null);
  for (const a of actors) await applyBoonEffect(a, cfg, origin);
  ui.notifications.info(`${actors.map(a => a.name).join(", ")}: ${cfg.name || "effect"} applied.`);
}
