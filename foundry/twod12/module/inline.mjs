// Inline rolls for chat, descriptions and card text:
import { expireOnUse } from "./bonus.mjs";   // v0.0.458
// @Check[body|dc:14|adj:2|boon:1|bane:2|traits:divine]   @Damage[(1d4+1)[body,slash],1d6[mind,holy]]
// @Save[appeal|dc:13|t1:1d6[mind,holy]|t2:"text"|t3:0]   @Template[emanation|distance:2|targets:enemies|self:no|places:yes]
import { releaseOptions, regripPrompt } from "./hands.mjs";
import { rollSource, saveDcOf } from "./rollsource.mjs";
import { coverFromPoint } from "./cover.mjs";
import { TWOD12, unconsciousDoom, doomStatus, cardVars, cardHead, prettyDamage, poolIcon, dtypeIcon } from "./config.mjs";
import { performCheck, checkHtml, esc, sgn, showDice, combineRolls } from "./roll.mjs";
import { traitChevrons } from "./config.mjs";
import { askRoll, enrich, adjLabelOf, ccRowOf } from "./actions.mjs";
import * as CC from "./chatcards.mjs";   // v0.0.283 (pack chat-cards): the one-target Save card
import { bookRoll, diceOfRoll, empoweredNow, markEmpoweredUsed, empoweredComponent, minorNpc } from "./explode.mjs";   // v0.0.407: exploding dice, the Empowered die
import { resolveModifiers, applyEffects, applyCondition, originInfo, applyBoonEffect, damageSteps, conditionItem } from "./effects.mjs";
import { parseAttrs, needsOrigin } from "./condrules.mjs";   // v0.0.314 (pack AU): Bleed's Attributes
import { dealDamageEx } from "./damage.mjs";
import { postDamageCard } from "./dmgcard.mjs";
import { startTemplate, tokensInEmanation } from "./template.mjs";
import { sysCard, sysLine } from "./sysmsg.mjs";
import { handleMove, moveDistance } from "./move.mjs";
import { handleRally } from "./rally.mjs";
import { gainGuard } from "./guard.mjs";
import { handleUse } from "./freeuse.mjs";
import { squaresBetween } from "./move.mjs";
import { evalExpr } from "./refs.mjs";

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
    if (t === "body" || t === "vigor" || t === "v") o.pool = "B"; else if (t === "mind" || t === "resolve" || t === "r") o.pool = "M"; else if (t === "choice") o.pool = "C";   // v0.0.356 (D46): the pools' names since pack R-core; body / mind still read
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
  if (kind === "Mark") { cfg.kind = String(segs[0] ?? "").trim().toLowerCase(); return cfg; }   // v0.0.418: @Mark[judge]
  // pack TALENTS-PT: @Place[<actor uuid>|adjacent:yes|one:yes|eoe:yes|defense:action] places an object (the Ice Pillar: objects.mjs);
  // @Bounce[2|half] sends half of the damage dealt to the target to a creature within 2 squares of it (Ricochet: bounce.mjs)
  if (kind === "Place" || kind === "Bounce") {
    if (kind === "Place") cfg.uuid = String(segs[0] ?? "").trim(); else cfg.range = Math.max(1, Number(segs[0]) || 2);
    for (const sg of segs.slice(1)) { const [k, v = "yes"] = sg.split(":").map(x => x.trim()); if (k === "label") cfg.label = v; else if (k) cfg[k.toLowerCase()] = /^(yes|true|1)$/i.test(v) ? true : v; }
    return cfg;
  }
  if (kind === "Condition") {
    cfg.cond = segs[0].trim().toLowerCase();
    for (const s of segs.slice(1)) {
      const m = s.trim().toLowerCase().match(/^(?:(?:rounds?|duration)\s*:\s*)?(eot|\d+)$/);
      if (m) { if (m[1] === "eot") cfg.dur = "eot"; else { cfg.dur = "rounds"; cfg.rounds = Number(m[1]); } }
      else if (/^label\s*:/i.test(s)) cfg.label = s.replace(/^label\s*:\s*/i, "");
      else if (/^crit\s*:/i.test(s)) cfg.crit = yes(s.replace(/^crit\s*:\s*/i, ""));   // v0.0.249: only the targets that rolled a Critical
      else if (/^tier\s*:/i.test(s)) cfg.tier = Math.max(0, Number(s.replace(/^tier\s*:\s*/i, "")) || 0);   // v0.0.267: only the targets that rolled that Tier or more
      else if (/^down\s*:/i.test(s)) cfg.down = yes(s.replace(/^down\s*:\s*/i, ""));   // v0.0.360
      else if (/^to\s*:/i.test(s)) cfg.to = s.replace(/^to\s*:\s*/i, "").trim().toLowerCase();   // v0.0.409 (Shield of Faith): to:trigger, the Reaction's triggering creature
      else if (/^on\s*:/i.test(s)) cfg.onTiers = s.replace(/^on\s*:\s*/i, "").split(",").map(x => Number(x.trim())).filter(n => [1, 2, 3].includes(n));   // v0.0.358: exactly these Tiers (on:2)
      else if (/^(value|rounds?)\s*:\s*(?!eot$)(?=.*[a-z@(])/i.test(s.trim())) (cfg.exprs ??= {})[/^value/i.test(s.trim()) ? "value" : "rounds"] = s.replace(/^[a-z]+\s*:\s*/i, "").toLowerCase().replace(/\s+/g, "");   // v0.0.358: a formula (value:pow, rounds:stage)
      else if (/^value\s*:/i.test(s)) cfg.value = Math.max(1, Math.trunc(Number(s.replace(/^value\s*:\s*/i, ""))) || 1);   // v0.0.250: Enfeebled 1, Vulnerable 2
      else if (/^side\s*:/i.test(s)) cfg.side = s.replace(/^side\s*:\s*/i, "").toLowerCase();
      else if (/^quiet\s*:/i.test(s)) cfg.quiet = yes(s.replace(/^quiet\s*:\s*/i, ""));
      // v0.0.314 (pack AU): Bleed's own values, @Condition[bleed|dmg:1d6|pool:R|sub:Ho|attrs:mi/ap|dc:15] (the condition's setting fills the rest)
      else if (/^(dmg|pool|sub|attrs|dc)\s*:/i.test(s)) {
        const [k, ...v] = s.split(":"), key = k.trim().toLowerCase(), val = v.join(":").trim();
        cfg.bleed ??= {};
        if (key === "dmg") cfg.bleed.dmg = val;
        else if (key === "pool") cfg.bleed.pool = ({ V: "B", R: "M", B: "B", M: "M" })[val.toUpperCase()] ?? "";
        else if (key === "sub") cfg.bleed.sub = val.length === 2 ? val[0].toUpperCase() + val[1].toLowerCase() : val;
        else if (key === "attrs") cfg.bleed.attrs = parseAttrs(val);
        else if (key === "dc") cfg.bleed.dc = Math.max(0, Number(val) || 13);
      }   // v0.0.252: the label shows no duration (the sentence says it)
    }
    return cfg;
  }
  if (kind === "Use") cfg.target = segs[0].trim();
  if (kind === "Cleave") cfg.n = Math.max(1, Number(segs[0]) || 1);
  if (kind === "Boon") cfg.n = Number(segs[0]) || 0;
  if (kind === "Book") cfg.ref = segs[0].trim();   // v0.0.246: @Book[Heading]{label}: a link to the book's anchor (the Journal import comes later)
  if (kind === "Heal" || kind === "Reduce") cfg.formula = segs[0].trim().toLowerCase().replace(/\s+/g, "");   // v0.0.250: @Heal[3d6+pow|s2:4d6+pow|s3:6d6+pow], @Heal[rp*2]; v0.0.254: @Reduce[2d6+pow|s2:3d6+pow] (the next damage is reduced)
  if (kind === "Pause") cfg.label = segs[0].trim();   // v0.0.254: @Pause[After the damage]: the chain stops here; the rest is the next Apply button
  if (kind === "EndEffect") cfg.which = /^any$/i.test(segs[0].trim()) ? "any" : "eot1";   // v0.0.250: @EndEffect[eot1] / @EndEffect[any]
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
    else if (key === "round" || key === "rounds") { if (/^eot$/i.test(val)) cfg.expire = "eot"; else cfg.rounds = Number(val) || 0; }   // v0.0.250 (Lucas): rounds:eot reads as EoT
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
    else if (key === "actor") cfg.actor = val;   // v0.0.345: @Use for this creature (a card of several creatures: the start-of-the-encounter stack)
    else if (key === "quick") cfg.quick = yes(val);
    else if (key === "reach") cfg.withinReach = yes(val);   // v0.0.174: a Reposition whose target must remain within your Reach (Relocate)
    // v0.0.246 (cards 1, Smite): who:pick asks "you or one ally" (a picker); area:N looks in an N Emanation around the card's target; pick:yes on a
    // Pushed / Pulled / Slid lists the creatures to move one by one; from:target makes the card's target the origin of the Forced Movement.
    else if (key === "who") cfg.who = val.toLowerCase();
    // v0.0.358 (Lucas: "most number fields should allow a formula"): area, near, count and min read a formula too (refs.mjs evalExpr: pow, mod, stage, speed/2...),
    // worked out for the creature when the chip is used (handleInline)
    else if (["area", "near", "count", "min"].includes(key) && /[a-z@(]/i.test(val)) (cfg.exprs ??= {})[key] = val.toLowerCase().replace(/\s+/g, "");
    else if (key === "down") cfg.down = yes(val);   // v0.0.360 (Deathmark): only for the targets the damage put Down (a step's "Only when the target goes Down")
    else if (key === "on") cfg.onTiers = val.split(",").map(x => Number(x.trim())).filter(n => [1, 2, 3].includes(n));   // v0.0.358: exactly these Tiers (on:2, on:1,3)
    else if (key === "area") cfg.area = Math.max(0, Number(val) || 0);
    else if (key === "pick") cfg.pick = yes(val);
    else if (key === "from") cfg.from = val.toLowerCase();
    else if (key === "doc") cfg.doc = val;
    else if (key === "crit") cfg.crit = yes(val);   // v0.0.249: @Condition[prone|crit:yes]: only the targets that rolled a Critical
    else if (key === "tier") cfg.tier = Math.max(0, Number(val) || 0);   // v0.0.267: tier:2: only the targets that rolled that Tier or more (a Grant's line on the Tier rows)
    // v0.0.250 (cards 3): s2:/s3: the formula at Stage 2 / 3 (Guard, Heal); side:allies / side:enemies (a chain's chip for one side of the card's targets); extra: a heal added to a Rally Point (Lay On Hands)
    else if (/^s\d+$/.test(key)) (cfg.stages ??= {})[key] = val.toLowerCase().replace(/\s+/g, "");   // v0.0.355: any Stage (s0: with Stage 0), not only s2 / s3
    else if (key === "side") cfg.side = val.toLowerCase();
    else if (key === "extra") cfg.extra = val.toLowerCase().replace(/\s+/g, "");
    else if (key === "bb") cfg.bb = ({ field: "field", pressure: "pressure", support: "support" })[val.toLowerCase()] ?? "";   // v0.0.301 (PACK BB): @Boon[-1|bb:pressure] = 1 Pressure Bane
    else if (key === "next") cfg.next = val.toLowerCase();   // v0.0.458: @Boon[-1|bb:pressure|next:roll]: spent by the next roll of any kind
    else if (key === "must") cfg.must = yes(val);   // pack TALENTS-PT (book, Chapter 3: a movement you must make): the Setup warns when squares are left
    else if (key === "still") cfg.still = yes(val);   // pack TALENTS-PT: this movement doesn't count as leaving your square (Ricochet's Setup)
    else if (key === "near") cfg.near = Math.max(0, Number(val) || 0);   // v0.0.254: the candidates within N squares of you (a Reaction's "an ally within 5 squares")
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
  if (kind === "Condition" || kind === "Effect") a.draggable = true;   // v0.0.418 (playtest 5, G1): dragged onto a token, it applies there (twod12.mjs)
  // v0.0.352 (Step 6): the icon uses the chip, the name opens what it names (twod12.mjs's click; openChip)
  a.innerHTML = `${icon.startsWith("<") ? icon : `<i class="fa-solid ${icon}"></i>`} <span class="ti-name">${esc(label)}</span>`;
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
/** v0.0.250: the creature's Power Modifier and Stage for a text (the card's creature, a damage card's origin, the item's owner). */
export function powForDoc(doc) {
  try { const a = doc?.documentName === "ChatMessage" ? (() => { const u = doc.getFlag?.("twod12", "action")?.actorUuid ?? doc.getFlag?.("twod12", "dmgCard")?.originUuid ?? doc.getFlag?.("twod12", "dmgMulti")?.originUuid; const d = u ? fromUuidSync(u) : null; return d?.documentName === "Actor" ? d : (d?.actor ?? null); })() : actorOfDoc(doc); const v = Number(a?.system?.powerMod); return a && Number.isFinite(v) ? v : null; } catch (e) { return null; }
}
export function stageForDoc(doc) {
  try { const a = doc?.documentName === "ChatMessage" ? (() => { const u = doc.getFlag?.("twod12", "action")?.actorUuid ?? doc.getFlag?.("twod12", "dmgCard")?.originUuid ?? doc.getFlag?.("twod12", "dmgMulti")?.originUuid; const d = u ? fromUuidSync(u) : null; return d?.documentName === "Actor" ? d : (d?.actor ?? null); })() : actorOfDoc(doc); const v = Number(a?.system?.stage); return a && Number.isFinite(v) && v >= 0 ? v : 0; } catch (e) { return 0; }   // v0.0.407: Stages 0 to 3
}
/** v0.0.255: what a Rally Point heals, for a Guard RP chip: the card's first target's, else the creature's own; null when unknown. */
export function rallyForDoc(doc) {
  try {
    if (doc?.documentName === "ChatMessage") {
      const t = (doc.getFlag?.("twod12", "action")?.targets ?? doc.getFlag?.("twod12", "dmgCard")?.targets ?? [])[0];
      const d = t?.uuid ? fromUuidSync(t.uuid) : null, a = d?.documentName === "Actor" ? d : (d?.actor ?? null);
      if (a) return Number(a.system?.rallyHeal) || 0;
    }
    const a = doc?.documentName === "ChatMessage" ? (() => { const u = doc.getFlag?.("twod12", "action")?.actorUuid; const d = u ? fromUuidSync(u) : null; return d?.documentName === "Actor" ? d : (d?.actor ?? null); })() : actorOfDoc(doc);
    return a ? (Number(a.system?.rallyHeal) || 0) : null;
  } catch (e) { return null; }
}
/** "+1d6+Pow" with the Power Modifier 3 reads "+1d6+3"; with none known, the word stays. */
export const withPow = (label, pow) => (pow === null || pow === undefined || !/\bPow\b|\[Pow\]/.test(label) ? label : label.replace(/\s*\+\s*(?:\[Pow\]|Pow)\b/g, `+${pow}`).replace(/\[Pow\]|\bPow\b/g, String(pow)));
/** The formula a chip uses at this Stage (s2: / s3: on the chip), else its own. */
/** v0.0.355 (the audit's D51): the highest sN: at or below the Stage, for any Stage number (an empty Stage uses the one before it). */
export const stagedFormula = (cfg, stage) => { const n = Object.keys(cfg?.stages ?? {}).map(k => Number(k.slice(1))).filter(x => x <= Number(stage) && cfg.stages[`s${x}`]).sort((a, b) => b - a)[0]; return (n != null && cfg.stages[`s${n}`]) || cfg?.formula || ""; };
/** "3d6+pow" -> "3d6 + Pow"; "rp*2" -> "twice a Rally Point's heal"; "1d8+mod" -> "1d8 + [Mod]". */
export const healText = f => { const s = String(f ?? ""); if (/^rp\*(\d+)$/.test(s)) { const n = Number(s.slice(3)); return `${({ 2: "twice", 3: "three times" })[n] ?? `${n} ×`} a Rally Point's heal`; } return s.replace(/\+/g, " + ").replace(/\*/g, " × ").replace(/\bpow\b/g, "Pow").replace(/\bmod\b/g, "[Mod]").replace(/\brp\b/g, "a Rally Point's heal"); };
/** "Guard 1d8 + [Mod]" with the Modifier 3 reads "Guard 1d8+3" (Lucas's spelling); with no Modifier known, the words stay. */
export const withMod = (label, mod) => (mod === null || mod === undefined || !/\[Mod\]/.test(label) ? label : label.replace(/\s*\+\s*\[Mod\]/g, `+${mod}`).replace(/\[Mod\]/g, String(mod)));

export function registerInline() {
  const list = CONFIG.TextEditor?.enrichers ?? CONFIG.ux?.TextEditor?.enrichers;
  if (!list) return console.warn("twod12 | text enrichers are not available");
  list.push({
    id: "twod12-inline",
    pattern: /@(Check|Damage|Save|Template|Move|Rally|Guard|Effect|Condition|Use|Cleave|Reload|Release|Regrip|Boon|Book|Heal|EndEffect|Reduce|Pause|Swap|ShakeOff|Mark|Place|Bounce)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]+)\})?/g,
    enricher: async (match, options) => {
      const kind = match[1];
      const cfg = parseInline(kind, match[2]);
      // v0.0.246: "[Mod]" in a chip's words becomes the number of the creature the text belongs to (the tooltip says whose). v0.0.250: "Pow" too (the Power Modifier), and a Stage formula.
      const modN = modForDoc(options?.relativeTo), powN = powForDoc(options?.relativeTo), stageN = stageForDoc(options?.relativeTo);
      // v0.0.420 (the tooltip review): the calculation is kept in data-calc, no longer shown on hover.
      // v0.0.352 (Lucas, playtest 4, Step 6: "calculated buttons in a slightly different text colour, the calculation on hover"): a chip whose
      // number was worked out for this creature (its [Mod] / Pow, its Stage's dice, a Rally Point, a distance from its Speed) has the class calc
      const inlineEl = (k, c, label, icon) => { const l2 = withPow(withMod(label, modN), powN); const el = mkEl(k, c, l2, icon); if (l2 !== label) { el.classList.add("calc"); el.dataset.calc = `Calculated: ${label} with this creature's ${[modN !== null ? `[Mod] ${modN}` : "", powN !== null ? `Pow ${powN}` : ""].filter(Boolean).join(", ")} = ${l2}`; } return el; };
      const staged = el => { if (cfg.stages && stagedFormula(cfg, stageN) !== cfg.formula) { el.classList.add("calc"); el.dataset.calc = `Calculated: Stage ${stageN}: ${stagedFormula(cfg, stageN)} (Stage 0: ${cfg.formula})${el.dataset.calc ? `. ${el.dataset.calc}` : ""}`; } return el; };
      if (kind === "Heal") return staged(inlineEl("Heal", cfg, cfg.label ?? match[3] ?? `Heal ${healText(stagedFormula(cfg, stageN))}`, "fa-hand-holding-medical"));
      if (kind === "Reduce") return staged(inlineEl("Reduce", cfg, (cfg.stages && stagedFormula(cfg, stageN) !== cfg.formula ? null : cfg.label ?? match[3]) ?? `reduced by ${healText(stagedFormula(cfg, stageN))}`, "fa-shield-halved"));
      if (kind === "Pause") return inlineEl("Pause", cfg, cfg.label || "After the damage", "fa-pause");
      if (kind === "Swap") return inlineEl("Swap", cfg, match[3] ?? "Swap squares", "fa-right-left");   // v0.0.410 (Hold the Line, Trade Places)
      if (kind === "ShakeOff") return inlineEl("ShakeOff", cfg, match[3] ?? "Shake Off: the Save", "fa-droplet-slash");   // v0.0.414 (book, Shake Off)
      if (kind === "Mark") return inlineEl("Mark", cfg, match[3] ?? "Apply Effect", "fa-crosshairs");
      if (kind === "Place") return inlineEl("Place", cfg, cfg.label ?? match[3] ?? "Place it", "fa-cube");   // pack TALENTS-PT (the Ice Pillar)
      if (kind === "Bounce") return inlineEl("Bounce", cfg, cfg.label ?? match[3] ?? "Bounce", "fa-share");   // pack TALENTS-PT (Ricochet)   // v0.0.418 (playtest 5, G4: Judge with no target)
      if (kind === "EndEffect") return inlineEl("EndEffect", cfg, cfg.label ?? match[3] ?? (cfg.which === "any" ? "End one effect" : "End one effect (EoT or 1 round left)"), "fa-wand-magic-sparkles");
      if (kind === "Book") {
        const el = mkEl("Book", cfg, cfg.label ?? match[3] ?? cfg.ref, "fa-book-open");
        el.classList.add("book"); el.dataset.rule = `${cfg.ref}: a rule of the book${cfg.doc ? ` (${cfg.doc})` : ""}`;
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
        card.setAttribute("aria-label", "Create a save card for the targeted tokens");
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
        const el = inlineEl("Condition", cfg, cfg.label ?? match[3] ?? `${nm}${cfg.value ? ` ${cfg.value}` : ""}${cfg.quiet ? "" : dur}`, "fa-triangle-exclamation");
        if (cfg.quiet && dur) el.dataset.rule = `${nm}${dur}`;
        return el;
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
        const nm = ({ field: "Field ", pressure: "Pressure ", support: "Support " })[cfg.bb] ?? "";
        return inlineEl("Boon", cfg, cfg.label ?? match[3] ?? `${n} ${nm}${cfg.n < 0 ? "Bane" : "Boon"}${n === 1 ? "" : "s"} on the next ${what}`, cfg.n < 0 ? "fa-chevron-down" : "fa-chevron-up");
      }
      if (kind === "Rally") return inlineEl("Rally", cfg, cfg.label ?? match[3] ?? `${cfg.n} Rally Point${cfg.n === 1 ? "" : "s"}${cfg.extra ? ` (+${healText(cfg.extra)})` : ""}`, "fa-heart-pulse");
      if (kind === "Effect") return inlineEl("Effect", cfg, cfg.label ?? match[3] ?? "Apply the effect", "fa-shield-halved");
      if (kind === "Guard") {
        // v0.0.255 (Lucas): "Guard RP" shows the number: the card's target's Rally Point heal (the first target), else this creature's own
        const rp = /\brally\b/.test(cfg.formula) ? rallyForDoc(options?.relativeTo) : null;
        const lbl = cfg.stages && stagedFormula(cfg, stageN) !== cfg.formula ? null : cfg.label ?? match[3];
        const text = rp !== null && (lbl === undefined || lbl === null || /\bRP\b/.test(lbl)) ? (lbl ? lbl.replace(/\bRP\b/, String(rp)) : `Guard ${rp}`) : lbl ?? `Guard ${guardText(stagedFormula(cfg, stageN))}`;
        const el = staged(inlineEl("Guard", cfg, text, "fa-shield-heart"));
        if (rp !== null) { el.classList.add("calc"); el.dataset.calc = `Calculated: Guard equal to what one of their Rally Points heals (${rp})`; }
        return el;
      }
      if (kind === "Move") {
        // A distance that is calculated (floor(speed/2)) shows its number for the creature whose card or sheet this is, with a calculator.
        const calc = !!cfg.distanceExpr && !cfg.label && !match[3];
        const who = calc ? actorOfDoc(options?.relativeTo) : null, value = who ? moveDistance(cfg, who) : null;
        const n = cfg.distanceExpr ? (value || cfg.distanceExpr.replace(/[a-z]+/g, w => w[0].toUpperCase() + w.slice(1))) : (cfg.distance || 1);
        const name = { pushed: "Pushed", pulled: "Pulled", slid: "Slid", evade: "Evade", charge: "Charge", reposition: "Reposition" }[cfg.kind] ?? "Advance", icon = { pushed: "fa-hand", pulled: "fa-hand-back-fist", slid: "fa-route", evade: "fa-wind", charge: "fa-person-running-fast", reposition: "fa-arrows-up-down-left-right" }[cfg.kind] ?? "fa-person-running";
        const el = inlineEl("Move", cfg, cfg.label ?? match[3] ?? `${name} ${n}`, icon);
        if (calc) el.classList.add("calc");   // v0.0.352
        if (calc) { const c = document.createElement("i"); c.className = "fa-solid fa-calculator calc"; c.dataset.calc = value ? `Calculated from your stats: ${cfg.distanceExpr} = ${value}` : `Calculated: ${cfg.distanceExpr}`; el.append(" ", c); }
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

export async function rollParts(list, nonlethalAll) {
  const comps = [], rolls = [];
  for (const p of list) {
    try {
      const r = await bookRoll(p.formula).evaluate();   // v0.0.407: a die written with ! explodes (explode.mjs)
      rolls.push(r);
      comps.push({ pool: p.pool || "B", sub: p.sub, nl: nonlethalAll ? true : p.nl, kind: "D", formula: p.formula, total: r.total, dice: diceOfRoll(r) });
    } catch (e) { ui.notifications.warn(`Invalid dice formula: ${p.formula}`); }
  }
  return { comps, rolls };
}

/**
 * Several Targets (v0.0.160): a Save card rolls each Tier's damage when it appears, once, and every creature that lands on a Tier takes that
 * Tier's roll. The dice are shown together. Returns { t1: comps, t2: comps, t3: comps } (a Tier with no damage is left out).
 */
async function prerollTiers(cfg, targets = []) {
  const out = {}, all = [];
  let empFirst = null;
  // v0.0.407 (book, Chapter 8): the Save Action's user Empowered: its first damage on each of its turns adds 1d6! (once a turn; Enfeebled is gone)
  let empUser = null;
  try {
    const user = cfg.saveAction && cfg.actorUuid ? fromUuidSync(cfg.actorUuid) : null;
    // v0.0.468: the roll dialog's Empowered when the Save Action came through it (cfg.empOn: on by the condition or by hand, off if switched off)
    const wants = typeof cfg.empOn === "boolean" ? cfg.empOn : !!damageSteps(user, new Set([...(cfg.actionTraits ?? []), "__action"])).empowered.length;
    if (user && wants && empoweredNow(user)) empUser = user;
  } catch (e) { console.warn("twod12 | Empowered on a Save", e); }
  for (let n = 1; n <= 3; n++) {
    const parts = parseParts(cfg.tiers?.[`t${n}`]);
    if (!parts.damage.length) continue;
    const { comps, rolls } = await rollParts(parts.damage, cfg.nonlethal);
    if (comps.length) { out[`t${n}`] = comps; empFirst ??= comps[0]; }
    all.push(...rolls);
  }
  // v0.0.426 (the audit; book, Chapter 8, Empowered: one creature takes it): one die, kept apart; saveDamage gives it to one creature
  if (empUser && empFirst) { const ec = await empoweredComponent(empFirst, all, { explode: !minorNpc(empUser) }); if (ec) out.emp = ec; }
  if (all.length) { try { await showDice(all); } catch (e) { /* no dice to show */ } }
  if (empUser && out.emp) await markEmpoweredUsed(empUser);
  // v0.0.467 (Lucas, 2026-11-20: "For save Actions, you decide the Empowered die before the enemies roll their Saves"; book, Chapter 8): the
  // creature that takes the die is chosen now, on the map bar (one creature: that one); if it then takes no damage, the die is lost
  if (out.emp) {
    const list = (targets ?? []).filter(t => t?.uuid);
    let pickUuid = list[0]?.uuid ?? "";
    if (list.length > 1 && typeof document !== "undefined") {
      try {
        const { pickBar } = await import("./pickbar.mjs");
        const tokOf = u => { try { const d = fromUuidSync(u); return d?.object ?? d?.getActiveTokens?.()[0] ?? null; } catch (e) { return null; } };
        const pick = await pickBar({ icon: "fa-burst", cancel: false, text: `<b>Empowered</b>: ${esc(empUser?.name ?? "")}'s ${esc(cfg.source || "Action")} damages several creatures. Which one takes the 1d6! (Chapter 8)? Choose before their Saves: click its token or its picture.`,
          options: list.map((t, i) => { const tk = tokOf(t.uuid); return { id: String(i), label: t.name ?? tk?.name ?? "?", token: tk ?? undefined, img: tk?.document?.texture?.src || "" }; }) });
        if (pick !== null && pick !== undefined && list[Number(pick)]) pickUuid = list[Number(pick)].uuid;
      } catch (e) { console.warn("twod12 | Empowered pick", e); }
    }
    out.empFor = pickUuid;
    const who = list.find(t => t.uuid === pickUuid)?.name ?? "";
    if (who) { try { await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: empUser }), content: sysLine("fa-burst", `<b>${esc(empUser?.name ?? "")}</b>'s Empowered 1d6! goes to <b>${esc(who)}</b> (chosen before the Saves).`) }); } catch (e) { /* no chat */ } }
  } else if (cfg.saveAction && cfg.actorUuid) {
    // a diagnostic: Empowered on the user, but its die isn't rolled now (already used this turn, or not the user's turn)
    try { const u = fromUuidSync(cfg.actorUuid); if (u && damageSteps(u, new Set([...(cfg.actionTraits ?? []), "__action"])).empowered.length) console.info(`twod12 | Empowered on a Save Action: ${u.name}'s die is not rolled now (${empoweredNow(u) ? "no damage on this Action's Tiers" : "already used this turn, or not its turn"})`); } catch (e) { /* none */ }
  }
  return out;
}
/** A Tier's line on a Save card once its damage is rolled: the amounts, with the dice in the tooltip, then its texts and effects. */
async function tierRolled(parts, comps) {
  const bits = comps.map(c => `<span>${prettyDamage(esc(`[${({ B: "V", M: "R" })[c.pool || "B"] ?? c.pool}] ${c.total}${c.sub ? ` ${c.sub}` : ""}${c.nl ? " NL" : ""}`))}</span>`);
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
  // v0.0.320 (book, Ch. 1 Riders): after Resist and Immune, a damaging Tier's effects happen only if its damage landed
  const dealt = comps.length ? await dealDamageEx(actor, comps) : null, summary = dealt?.text ?? "";
  const names = [];
  if (parts.uuids.length && (!dealt || dealt.landed)) {
    await applyEffects(parts.uuids, [actor.uuid], originInfo(""));
    for (const u of parts.uuids) names.push((await fromUuid(u))?.name ?? "?");
  }
  // v0.0.418 (playtest 5): the conditions written in the Tier's text, as on an attack (when its damage landed, or a Tier with no damage)
  if (!dealt || dealt.landed) for (const chip of tierConditionChips(cfg.tiers[`t${tier}`])) {
    try { await applyConditionChip(chip, { targets: [{ uuid: actor.uuid, name: actor.name }], actor: cfg.actorUuid ? await fromUuid(cfg.actorUuid).catch(() => null) : null }); names.push(chip.match(/^@Condition\[([^|\]]*)/)[1]); } catch (e) { console.warn("twod12 | a Tier's condition", e); }
  }
  const applied = dealt && !dealt.landed ? `${esc(actor.name)} takes <b>${esc(summary)}</b>: the rest of this Tier doesn't happen.`
    : `${esc(actor.name)}${summary ? ` takes <b>${summary}</b> damage` : ""}${names.length ? `${summary ? "; " : " gains "}${esc(names.join(", "))}` : ""}.`;
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
    expireOnUse(actor, new Set(), new Set(), { rolled: true }).catch(() => {});   // v0.0.458: a Bane "on its next roll" (Dirty Trick) is spent by a Save or a Check too
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
    targets: handTargetTokens({}).map(t => ({ uuid: t.document.uuid, name: t.name }))   // v0.0.252: the selected tokens first
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
 * v0.0.252 (Lucas): a chip clicked by hand on a card goes to the tokens you have selected; with none selected, to the tokens you target; with none,
 * to the card's targets. A chain (the Apply buttons, after the damage) brings its own targets and is not touched.
 */
export function handTargetTokens(ctx) {
  if (ctx?.targets) return cardTargetTokens(ctx);
  const sel = (canvas.tokens?.controlled ?? []).filter(t => t.actor);
  if (sel.length) return sel;
  const tg = [...(game.user?.targets ?? [])].filter(t => t.actor);
  if (tg.length) return tg;
  return cardTargetTokens(ctx);
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
  // v0.0.255 (Lucas): the card's targets are the recipients when it has them (no question asked); the picker only when it has none
  // v0.0.343 (Lucas, playtest 4: Smite 3 AP's Guard went to the creature hit): not for who:pick or an area / near search: there the card's targets
  // are where to look (the enemy hit), never the recipients
  if (ctx.targets?.length && cfg.who !== "self" && cfg.who !== "pick" && !(cfg.area > 0) && !(cfg.near > 0)) {
    const list = [];
    for (const t of ctx.targets) { try { const d = await fromUuid(t.uuid); const a = d?.documentName === "Actor" ? d : d?.actor; if (a) list.push(a); } catch (e) { /* gone */ } }
    if (list.length) return { origin, who: list };
  }
  const me = tokenOfActor(origin);
  const side = me?.document?.disposition ?? canvas.tokens?.controlled[0]?.document?.disposition ?? 1;
  const mine = t => t.actor && t.document?.disposition === side && t.id !== me?.id;
  let allies;
  if (cfg.area > 0) allies = tokensInEmanation(cardTargetTokens(ctx), cfg.area).filter(mine).map(t => t.actor);
  else if (cfg.near > 0 && me) allies = tokensInEmanation([me], cfg.near).filter(mine).map(t => t.actor);   // v0.0.254: within N squares of you (Shield of Faith, Bulwark of Faith)
  else allies = handTargetTokens(ctx).filter(mine).map(t => t.actor);   // v0.0.252: the selected tokens first (a hand click), the chain's own otherwise
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
  // v0.0.250: a chain's chip for a side (side:enemies) goes to those creatures, no question asked (Hallowed Dawn's light on the enemies)
  if (ctx.targets?.length && (cfg.side || cfg.who === "targets")) {
    const origin = originActor(ctx), mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : null;
    await applyEffects([cfg.uuid], ctx.targets.map(t => t.uuid), { ...originInfo(origin?.uuid ?? ""), ...(mod !== null ? { mod } : {}) });
    return;
  }
  const { origin, who, cancelled } = await allyRecipients(cfg, ctx, what);
  if (cancelled) return;
  if (!who.length) return ui.notifications.warn("Select your token, or target the ally that gains the effect.");
  const act = ctx.message?.getFlag?.("twod12", "action");
  const mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number.isFinite(act?.attrVal) ? act.attrVal : null);
  const uuids = who.map(a => a.getActiveTokens?.()[0]?.document?.uuid ?? a.uuid);
  await applyEffects([cfg.uuid], uuids, { ...originInfo(origin?.uuid ?? ""), ...(mod !== null ? { mod } : {}) });
}

/** "1d8+mod" -> "1d8 + [Mod]"; "rally" -> "a Rally Point's heal". */
export const guardText = f => String(f ?? "").replace(/\+/g, " + ").replace(/\bmod\b/g, "[Mod]").replace(/\bpow\b/g, "Pow").replace(/\brally\b/g, "a Rally Point's heal");

/**
 * The @Guard[formula] button (v0.0.181; book: Guard, Chapter 4): @Guard[1d8+mod], @Guard[2d6|self:yes], @Guard[rally] (the creature's own Rally Point heal).
 * mod is the Modifier of the card's roll (or the origin's Signature Modifier). It goes to the targets (or the selected tokens); self:yes: the card's creature.
 * Each creature keeps the higher of its Guard and the new value.
 */
async function handleGuard(cfg, ctx) {
  const act = ctx.message?.getFlag?.("twod12", "action");
  const origin0 = originActor(ctx);
  const mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number.isFinite(Number(act?.attrVal)) && act?.attrVal !== undefined ? Number(act.attrVal) : (Number(origin0?.system?.signatureMod) || 0));
  const formula = stagedFormula(cfg, Number(origin0?.system?.stage) || 0);   // v0.0.250: the Stage's dice (s2: / s3: on the chip)
  const { origin, who, cancelled } = await allyRecipients(cfg, ctx, `Guard ${withMod(guardText(formula), mod)}`);
  if (cancelled) return;
  if (!who.length) return ui.notifications.warn("Select your token, or target the ally that gains the Guard.");
  for (const a of who) {
    // v0.0.409 (pack F2, Lay On Hands): pow is the Action's user's Power Modifier
    const f = String(formula || "0").replace(/\bmod\b/g, `(${mod})`).replace(/\bpow\b/g, `(${Number(origin0?.system?.powerMod) || 0})`).replace(/\brally\b/g, `(${Number(a.system?.rallyHeal) || 0})`);
    const roll = await bookRoll(f).evaluate();
    const now = Number(a.system?.guard) || 0, next = gainGuard(now, roll.total);
    if (next !== now) {
      if (a.isOwner) await a.update({ "system.guard": next });
      else game.socket.emit("system.twod12", { type: "applyGuard", actorUuid: a.uuid, value: next });
    }
    // v0.0.246: a system line (the standing rule for chat messages)
    // v0.0.347 (Step 3): into the card whose button or chain gave it (followup.mjs), else its own line as before
    const { postFollow } = await import("./followup.mjs");
    await postFollow(ctx.message, "fa-shield-heart", `<b>${esc(a.name)}</b> ${next > now ? `gains <b>Guard ${next}</b>` : `keeps Guard ${now} (the higher; the new Guard was ${roll.total})`} <small>(${esc(withMod(guardText(formula), mod))} = ${roll.total})</small>.`, { speaker: ChatMessage.getSpeaker({ actor: origin ?? a }), rolls: /d/.test(f) ? [roll] : [], cls: "guardmsg" });
  }
}

/**
 * v0.0.410 (pack F2; book, Swapping Places): @Swap[]: you and the card's target (or the targeted token) swap squares at the same moment, each moved
 * by a Reposition (no Move Action, no Reactions: the forced flag). v0.0.431 (the book audit Q33, Chapter 3): only two creatures of the same Size swap.
 */
async function handleSwap(cfg, ctx) {
  const me = tokenOfActor(originActor(ctx)), them = cardTargetTokens(ctx)[0] ?? [...(game.user.targets ?? [])][0] ?? null;
  if (!me || !them || them.id === me.id) return ui.notifications.warn("Swap squares: your token and the target's must be on the map (target the ally).");
  const a = me.document, b = them.document;
  if ((a.width ?? 1) !== (b.width ?? 1) || (a.height ?? 1) !== (b.height ?? 1)) return ui.notifications.warn(`${me.name} and ${them.name} are not the same Size: they can't swap squares (Chapter 3, Swapping Places).`);
  const move = async (d, x, y) => { if (d.isOwner) await d.update({ x, y }, { twod12Forced: true, animate: true }); else game.socket.emit("system.twod12", { type: "pushMove", tokenUuid: d.uuid, x, y }); };
  const [ax, ay, bx, by] = [a.x, a.y, b.x, b.y];
  await Promise.all([move(a, bx, by), move(b, ax, ay)]);
  const { postFollow } = await import("./followup.mjs");
  await postFollow(ctx.message, "fa-right-left", `<b>${esc(me.name)}</b> and <b>${esc(them.name)}</b> swap squares (a Reposition each).`);
}

/**
 * v0.0.254 (cards 4, Shield of Faith): the @Reduce chip: the next damage the creature takes is reduced by the formula (rolled now, the Stage's dice);
 * it waits on the creature (system.reduceNext, the higher kept) and is spent by that damage. Who: as a Guard (you or one ally, who:pick, near:N).
 */
async function handleReduce(cfg, ctx) {
  const origin0 = originActor(ctx);
  const mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number(origin0?.system?.weaponMod) || 0), pow = Number(origin0?.system?.powerMod) || 0;
  const formula = stagedFormula(cfg, Number(origin0?.system?.stage) || 0);
  const { who, cancelled } = await allyRecipients(cfg, ctx, `a reduction of ${withPow(healText(formula), pow)}`);
  if (cancelled) return;
  if (!who.length) return ui.notifications.warn("Select your token, or target the ally whose damage is reduced.");
  for (const a of who) {
    const f = String(formula || "0").replace(/\bpow\b/g, `(${pow})`).replace(/\bmod\b/g, `(${mod})`).replace(/\brp\b/g, `(${Number(a.system?.rallyHeal) || 0})`);
    const roll = await bookRoll(f).evaluate();
    const now = Number(a.system?.reduceNext) || 0, next = Math.max(now, roll.total);
    // v0.0.454 (Lucas, playtest 6, D2): the reduction remembers what gave it (Shield of Faith), so the breakdown names it ("− 3 Shield of Faith")
    const from = String(ctx?.source ?? ctx?.message?.getFlag?.("twod12", "action")?.title ?? "").trim();
    if (next !== now) { const upd = { "system.reduceNext": next, ...(from ? { "system.reduceFrom": from } : {}) }; if (a.isOwner) await a.update(upd); else game.socket.emit("system.twod12", { type: "applyDamage", actorUuid: a.uuid, upd }); }
    // v0.0.418 (Lucas, playtest 5, C4): no chat line; the damage card shows the reduction when it lands (dice are still thrown)
    if (/d/.test(f)) await showDice([roll]);
  }
}

/**
 * v0.0.246 (cards 1, Smite 3 AP): the chips an Action's Version lists under "After the damage" run one after the other once the damage is applied
 * (the Guard's "who" question, then the Pushes, one creature at a time). `text` is the Version's field: the same chips as in any text.
 * ctx: { actor, targets: [{ uuid, name }], attrVal } (the damage card's creature, targets and Modifier).
 */
export async function runAfter(text, ctx = {}, { side = "" } = {}) {
  const re = /@(\w+)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]+)\})?/g;
  let m;
  while ((m = re.exec(String(text ?? "")))) {
    const cfg = parseInline(m[1], m[2]);
    if (m[3]) cfg.label = m[3];
    // v0.0.250: a chip for one side (side:allies / side:enemies) runs with that side's creatures among the targets; an Apply button for a side runs only its chips
    if (side && cfg.side && cfg.side !== side) continue;
    let targets = cfg.side ? sideTargets(ctx, cfg.side) : ctx.targets;
    if (cfg.side && !targets?.length) continue;
    // v0.0.267: a chip for a Tier (tier:2) or a Critical (crit:yes) runs for the targets that rolled it; a target without a result (a click by hand) passes
    // v0.0.334: after a Save Action, tier:N means that Tier or worse for the target (tier:1: only those who rolled a Tier 1)
    if (cfg.onTiers?.length) { targets = (targets ?? []).filter(t => t.tier === undefined || cfg.onTiers.includes(Number(t.tier) || 0)); if (!targets.length) continue; }   // v0.0.358
    // v0.0.360: down:yes: only the targets that are Down now (the damage is applied before the chain runs); it replaces the Effect mode "when the target is Down"
    if (cfg.down) { const kept = []; for (const t of targets ?? []) { let a = null; try { const d = await fromUuid(t.uuid); a = d?.documentName === "Actor" ? d : (d?.actor ?? null); } catch (e) { a = null; } if (a?.system?.atZero) kept.push(t); } targets = kept; if (!targets.length) continue; }
    if (cfg.tier || cfg.crit) { targets = (targets ?? []).filter(t => t.tier === undefined ? true : (!cfg.tier || (ctx.save ? (Number(t.tier) || 0) <= cfg.tier : (Number(t.tier) || 0) >= cfg.tier)) && (!cfg.crit || t.crit)); if (!targets.length) continue; }
    try { await handleInline(m[1], cfg, { ...ctx, targets, message: ctx.message ?? null }); } catch (e) { console.error("twod12 | after the damage", e); }
  }
}
/** The chain's targets on one side of the card's creature (allies: its side, the creature itself included; enemies: the other sides). */
export function sideTargets(ctx, side) {
  const me = tokenOfActor(originActor(ctx)), mine = me?.document?.disposition ?? 1;
  return (ctx?.targets ?? []).filter(t => { let tok = null; try { tok = fromUuidSync(t.uuid); } catch (e) { tok = null; } const d = tok?.disposition ?? tok?.document?.disposition ?? tok?.object?.document?.disposition; if (d === undefined) return side === "allies"; return side === "allies" ? d === mine : d !== mine && d !== 0; });
}

/**
 * v0.0.250 (cards 3): the @Heal chip. The formula (the Stage's: s2: / s3:) is rolled once for every target when it has dice (the book: a heal to
 * several creatures is rolled once); "rp*2" is each creature's own Rally Point heal, no dice. Each creature's answerer then chooses the split
 * in the Heal window (healwin.mjs), on their own client.
 */
async function handleHeal(cfg, ctx) {
  const origin = originActor(ctx);
  const targets = ctx.targets?.length ? ctx.targets : handTargetTokens(ctx).map(t => ({ uuid: t.document.uuid, name: t.name }));
  const list = targets.length ? targets : (origin ? [{ uuid: origin.uuid, name: origin.name }] : []);
  if (!list.length) return ui.notifications.warn("Target the creatures that heal first.");
  const formula = stagedFormula(cfg, Number(origin?.system?.stage) || 0);
  const pow = Number(origin?.system?.powerMod) || 0, mod = Number.isFinite(ctx.attrVal) ? ctx.attrVal : (Number(origin?.system?.weaponMod) || 0);
  const source = ctx.message?.getFlag?.("twod12", "action")?.itemId ? (origin?.items?.get(ctx.message.getFlag("twod12", "action").itemId)?.name ?? "") : (ctx.source ?? "");
  const actors = [];
  for (const t of list) { try { const d = await fromUuid(t.uuid); const a = d?.documentName === "Actor" ? d : d?.actor; if (a) actors.push(a); } catch (e) { /* gone */ } }
  if (!actors.length) return;
  const perCreature = /\brp\b/.test(formula);
  let shared = null, roll = null;
  if (!perCreature) { roll = await bookRoll(String(formula).replace(/\bpow\b/g, `(${pow})`).replace(/\bmod\b/g, `(${mod})`)).evaluate(); shared = roll.total; }
  const amountFor = a => (perCreature ? Math.max(0, Math.round(Function("rp", `"use strict";return (${String(formula).replace(/\bpow\b/g, `(${pow})`).replace(/\bmod\b/g, `(${mod})`).replace(/[^0-9rp+\-*/(). ]/g, "")})`)(Number(a.system?.rallyHeal) || 0))) : shared);
  const { sysCard } = await import("./sysmsg.mjs");
  const text = perCreature ? actors.map(a => `${esc(a.name)} ${amountFor(a)}`).join(" · ") : actors.map(a => esc(a.name)).join(", ");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: origin ?? actors[0] }), rolls: roll ? [roll] : [],
    content: sysCard({ title: source || "Heal", lead: `${esc(origin?.name ?? "")} heals ${esc(withPow(healText(formula), pow))}${shared !== null ? ` = <b>${shared}</b>` : ""}`, text: `${text}. Each creature chooses what it removes.`, cls: "healmsg" }) });
  const { promptHeal } = await import("./healwin.mjs");
  for (const a of actors) await promptHeal(a, amountFor(a), { source: source || "Heal", lead: `<b>${esc(a.name)}</b> heals` });
}
/** v0.0.250: the @EndEffect chip: each target's answerer ends one effect (eot1: EoT or 1 round left; any: every non-permanent one) in a window. */
async function handleEndEffect(cfg, ctx) {
  const origin = originActor(ctx);
  const targets = ctx.targets?.length ? ctx.targets : handTargetTokens(ctx).map(t => ({ uuid: t.document.uuid, name: t.name }));
  if (!targets.length) return ui.notifications.warn("Target the creature first.");
  const source = ctx.message?.getFlag?.("twod12", "action")?.itemId ? (origin?.items?.get(ctx.message.getFlag("twod12", "action").itemId)?.name ?? "") : (ctx.source ?? "");
  const { promptEndEffect } = await import("./healwin.mjs");
  for (const t of targets) { try { const d = await fromUuid(t.uuid); const a = d?.documentName === "Actor" ? d : d?.actor; if (a) await promptEndEffect(a, cfg.which ?? "any", { source }); } catch (e) { /* gone */ } }
}

/**
 * v0.0.414 (book, Chapter 6, Shake Off; Chapter 8, Lingering): the @ShakeOff chip: the targeted creature (none targeted: the Action's user) makes a
 * Save with the better of its Lingering's two Attributes against its DC (13 unless it writes one), one Save for each Lingering it has. Tier 3: it
 * ends. Tier 2: it ends after half its damage at the end of the current turn, whoever's it is (v0.0.427; conditions.mjs bleedAtTurnEnd reads the flag shakeHalf). Tier 1: no effect.
 */
async function handleShakeOff(cfg, ctx) {
  const origin = originActor(ctx);
  const { bleedOf, bleedText } = await import("./condrules.mjs");
  // v0.0.462 (Lucas, checklist v0.0.459: "When I use shake off, it doesnt roll against the target, it says I dont have Lingering"): the lookup took
  // the selected token (Kaela) before the targeted one (Durgan). The candidates now come in order: the card's targets, your targets, the selected
  // tokens, yourself; the first group with a Lingering is the one (none has one: the first group, to say so)
  const lingering = a => [...(a?.effects ?? [])].some(e => !e.disabled && bleedOf(e));
  const toActors = async list => { const out = []; for (const t of list) { try { const d = t.actor ? t : await fromUuid(t.uuid ?? t.document?.uuid); const a = d?.documentName === "Actor" ? d : d?.actor; if (a && !out.includes(a)) out.push(a); } catch (e) { /* gone */ } } return out; };
  const groups = [await toActors(ctx.targets ?? []), await toActors([...(game.user?.targets ?? [])].map(t => t.actor).filter(Boolean)), await toActors((canvas?.tokens?.controlled ?? []).map(t => t.actor).filter(Boolean)), origin ? [origin] : []].filter(g => g.length);
  let actors = groups.find(g => g.some(lingering))?.filter(lingering) ?? groups[0] ?? [];
  if (!actors.length) return ui.notifications.warn("Target the Lingering creature (or none, for yourself).");
  for (const actor of actors) {
    const list = [...(actor.effects ?? [])].filter(e => !e.disabled).map(e => [e, bleedOf(e)]).filter(([, b]) => b);
    if (!list.length) { ui.notifications.info(`${actor.name} has no Lingering.`); continue; }
    for (const [e, b] of list) {
      const keys = (b.attrs?.length ? b.attrs : ["body", "instinct"]).filter(k => k in TWOD12.attributes);
      const key = keys.reduce((best, k) => ((actor.system.attributes?.[k] ?? 0) > (actor.system.attributes?.[best] ?? -99) ? k : best), keys[0] ?? "body");
      const dc = Number(b.dc) || 13, label = `Shake Off: ${TWOD12.attributes[key]} Save`;
      const data = await askRoll(actor, { title: `${label}: ${actor.name}`, attrKey: key, traits: new Set([key, "__save"]), defaults: { dc } });
      if (!data) continue;
      const fxm = resolveModifiers(actor, data.fx), manB = Number(data.boons) || 0, manN = Number(data.banes) || 0, dcUsed = Number(data.dc) || dc;
      const chk = await performCheck({ mod: actor.system.attributes?.[key] ?? 0, boons: fxm.boons + manB, banes: fxm.banes + manN, dc: dcUsed, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data), favored: data.favored === "on", doomed: data.doomed === "on", sources: fxm.sources, manualBoons: manB, manualBanes: manN });
      expireOnUse(actor, new Set(), new Set(), { rolled: true }).catch(() => {});   // v0.0.458: a Bane "on its next roll" (Dirty Trick) is spent by a Save or a Check too
      const what = shakeOffResult(chk.tier);
      // v0.0.426 (the audit: Shake Off on another player's creature failed for lack of permission): the GM ends or flags it when you don't own it
      if (what !== "none") {
        if (e.isOwner) await (what === "ends" ? e.delete() : e.setFlag("twod12", "shakeHalf", true));
        else if (game.users?.activeGM) game.socket.emit("system.twod12", { type: "shakeOff", effectUuid: e.uuid, what });
        else ui.notifications.warn("A GM must be connected to end another player's Lingering.");
      }
      // v0.0.465 (Lucas, checklist v0.0.464, shake-off-other: "the save on the chat is using a very old style"): one card in the system's look: the Save
      // and its result as the lead, what happens to the Lingering under it (was the old roll card, then a line)
      const tierWord = ["", "Tier 1", "Tier 2", "Tier 3"][chk.tier] ?? "";
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: chk.rolls, content: sysCard({ title: "Shake Off", lead: `<b>${esc(actor.name)}</b>: ${esc(TWOD12.attributes[key])} Save <b>${chk.total}</b> vs DC ${dcUsed}: <b>${tierWord}</b>`, text: `<b>${esc(actor.name)}</b>: ${esc(bleedText(b))} ${what === "ends" ? "ends." : what === "half" ? "takes half its damage at the end of the current turn, then it ends." : "goes on (no effect)."}`, cls: "shakeoff" }) });
    }
  }
}
/** Pure (v0.0.414): Shake Off's Tiers: 3 ends the Lingering, 2 ends it after half this turn's damage, 1 nothing. */
export const shakeOffResult = tier => (tier >= 3 ? "ends" : tier === 2 ? "half" : "none");

/** v0.0.246: a book link. A Journal page named like the heading opens it (the Journal import comes later); until then, a note. */
export async function openBook(cfg) {
  const ref = String(cfg.ref ?? "").trim();
  if (!ref) return;
  for (const j of game.journal ?? []) {
    const page = j.pages?.find?.(p => String(p.name ?? "").toLowerCase() === ref.toLowerCase());
    if (page) return j.sheet.render(true, { pageId: page.id });
  }
  // v0.0.335: the system's window, not a Foundry dialog (the standing rule)
  const { pickConfirm } = await import("./pickwindow.mjs");
  await pickConfirm({ title: ref, name: ref, sub: cfg.doc ?? "", icon: "fa-book-open", confirm: "Close",
    text: `<b>${esc(ref)}</b> is a rule of the book${cfg.doc ? ` (${esc(cfg.doc)})` : ""}: read it there. When the book is imported into Foundry as a Journal, this link opens its page.` });
}

/**
 * v0.0.352 (Lucas, playtest 4, Step 6: "clicking the left side (the symbol) uses it, clicking the right side (the name) opens the sheet of the
 * feature"): a chip's name opens what it names: a condition or an Effect its item, a movement or a rule its book rule (v0.0.453: an @Use chip's name
 * uses it, as its symbol does: Lucas, playtest 6, Charge's Weapon Attack opened the item sheet). Returns
 * true when something was opened (otherwise the click uses the chip, as before).
 */
const MOVE_REF = { pushed: "Pushed", pulled: "Pulled", slid: "Slid", reposition: "Reposition", advance: "Advance", walk: "Advance", evade: "Evade", charge: "Charge", crawl: "Crawl", shift: "Shift", climb: "Climb", jump: "Jump" };
const RULE_REF = { Swap: "Swapping Places", Guard: "Guard", Heal: "Heal", Rally: "Rally Points", Reduce: "Damage", Check: "Checks", Save: "Saves", Template: "Areas", Damage: "Damage", Boon: "Boons and Banes", Cleave: "Cleave", Reload: "Reload", Release: "Hands", Regrip: "Hands", EndEffect: "Effects" };
export async function openChip(kind, cfg, ctx = {}) {
  try {
    if (kind === "Condition" && cfg.cond) { const it = await conditionItem(cfg.cond); if (it?.sheet) { it.sheet.render(true); return true; } }
    if (kind === "Effect" && cfg.uuid) { const d = await fromUuid(cfg.uuid); if (d?.sheet) { d.sheet.render(true); return true; } }
    // v0.0.453 (Lucas, playtest 6: "Clicking on weapon attack from Charge is opening the weapon attack item-sheet"): a Use chip's name uses it too
    const ref = kind === "Move" ? MOVE_REF[cfg.kind] : RULE_REF[kind];
    if (ref) { await openBook({ ref }); return true; }
  } catch (e) { console.warn("twod12 | chip name", e); }
  return false;
}

/** v0.0.358: a chip's number options written as formulas (cfg.exprs), worked out for the creature that uses it. Pure but for evalExpr. */
export function resolveExprs(cfg, actor) {
  if (!cfg?.exprs) return cfg;
  const out = { ...cfg };
  for (const [k, e] of Object.entries(cfg.exprs)) { let v = 0; try { v = Math.max(0, Math.trunc(Number(evalExpr(e, actor)) || 0)); } catch (err) { v = 0; } out[k] = k === "value" || k === "count" ? Math.max(1, v) : v; if (k === "rounds") { out.dur = "rounds"; out.rounds = Math.max(1, v); } }
  return out;
}
export async function handleInline(kind, cfg0, ctx = {}) {
  const cfg = cfg0?.exprs ? resolveExprs(cfg0, originActor(ctx)) : cfg0;
  if (kind === "Book") return openBook(cfg);
  if (kind === "Heal") return handleHeal(cfg, ctx);
  if (kind === "Reduce") return handleReduce(cfg, ctx);
  if (kind === "Pause") return;   // a marker between the steps of a chain (actions.mjs applyAfter runs one step at a time)
  if (kind === "Swap") return handleSwap(cfg, ctx);
  if (kind === "EndEffect") return handleEndEffect(cfg, ctx);
  if (kind === "ShakeOff") return handleShakeOff(cfg, ctx);
  if (kind === "Mark") return handleMark(cfg, ctx);
  if (kind === "Place") return (await import("./objects.mjs")).handlePlace(cfg, ctx);   // pack TALENTS-PT
  if (kind === "Bounce") return (await import("./bounce.mjs")).handleBounce(cfg, ctx);   // pack TALENTS-PT
  if (kind === "Guard") return handleGuard(cfg, ctx);
  if (kind === "Effect") return handleEffect(cfg, ctx);
  if (kind === "Move") return handleMove(cfg, ctx);
  if (kind === "Rally") return handleRally(cfg, ctx);
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
 * v0.0.418 (playtest 5, G4): the @Mark[kind] chip ("@Mark[judge]{Apply Effect}"): the card's creature marks the selected or targeted token, as its
 * Action does when used with a target (mark.mjs; the kind "judge": Judged). Judge's card shows it when the Action was used with no target.
 */
async function handleMark(cfg, ctx = {}) {
  const f = ctx.message?.getFlag?.("twod12", "action");
  let user = null; try { const d = f?.actorUuid ? await fromUuid(f.actorUuid) : null; user = d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { user = null; }
  user ??= ctx.actor ?? null;
  if (!user) return ui.notifications.warn("This button works from the card of the Action that marks.");
  if (!user.isOwner) return ui.notifications.warn(`Only ${user.name}'s player (or the GM) can mark with it.`);   // v0.0.421 (the audit)
  const mine = new Set(user.getActiveTokens?.().map(t => t.id) ?? []);
  const tok = [...(game.user?.targets ?? [])].find(t => t.actor && !mine.has(t.id)) ?? (canvas.tokens?.controlled ?? []).find(t => t.actor && !mine.has(t.id));
  if (!tok) return ui.notifications.warn("Target the creature first, then click the button.");
  const { setQuarry } = await import("./mark.mjs");
  await setQuarry(user, tok, cfg.kind ?? "");
  const { postFollow } = await import("./followup.mjs");
  const what = cfg.kind === "judge" ? "is Judged by" : "is marked by";
  if (ctx.message) await postFollow(ctx.message, "fa-crosshairs", `<b>${esc(tok.name)}</b> ${what} <b>${esc(user.name)}</b>.`);
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
  const { pickButtons } = await import("./hands.mjs");   // v0.0.415 (pack CL): the pick window (was a DialogV2)
  const pick = await pickButtons({ title: `Release: ${actor.name}`, name: "Release", sub: actor.name, icon: "fa-hand", text: "What do you let go of?", buttons });
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
    const { pickOne } = await import("./pickwindow.mjs");   // v0.0.415 (pack CL): was a DialogV2
    const k = await pickOne({ title: "Reload", name: "Reload", sub: actor.name, icon: "fa-bullseye", text: "Which weapon do you reload?", options: opts.map((o, n) => ({ k: String(n), l: o.label })) });
    if (k == null) return;
    pick = opts[Number(k)];
  }
  if (pick.w.isOwner) await pick.w.update({ "system.unloaded": false });
  else game.socket.emit("system.twod12", { type: "reloadWeapon", uuid: pick.w.uuid });   // the GM reloads an ally's weapon you don't own
  const { sysLine } = await import("./sysmsg.mjs");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-bullseye", pick.who === actor ? `<b>${esc(actor.name)}</b> reloads ${esc(pick.w.name)}.` : `<b>${esc(actor.name)}</b> reloads <b>${esc(pick.who.name)}</b>'s ${esc(pick.w.name)}.`, "reloadmsg") });
}

/** The condition goes on the targets of the card (or the targeted / selected tokens), with the duration written on the button. */
/** v0.0.418 (playtest 5, G1-G3): apply a condition chip ("@Condition[prone]", "@Condition[dazed|value:1]") to the context's targets, as its
 *  button would (the origin: ctx.actor). Used when a Tier lands (ccdamage.mjs applyRow, resolveSaveTier). */
/** v0.0.418 (playtest 5, G1): a condition or effect chip dropped on a token: it applies to that token, as its button would (the card's creature the
 *  origin). */
export async function dropChip(kind, cfg, tokenDoc, message = null) {
  const targets = [{ uuid: tokenDoc.uuid, name: tokenDoc.name }];
  // v0.0.421 (the audit): through handleInline, which works out the formula options (value:pow, rounds:stage...)
  if (kind === "Condition") return handleInline("Condition", { ...cfg, crit: false, to: "" }, { targets, message });
  if (kind === "Effect") return handleInline("Effect", { ...cfg, who: "targets" }, { targets, message });
}
/** Pure (v0.0.421, the audit): the conditions a Tier's text gives by itself: its @Condition chips, but not one written after a movement ("Slid 1,
 *  then Grabbed": it waits for that movement, a button to click after it, or the movement would meet the condition's Immobilized). */
export const tierConditionChips = text => { const s = String(text ?? ""), mi = s.search(/@Move\[/); return (mi < 0 ? s : s.slice(0, mi)).match(/@Condition\[[^\]]*\]/g) ?? []; };
/** Pure (v0.0.440, Lucas, checklist: Seizing Cut "didn't slide automatically"): a Tier's forced movement (Pushed, Pulled, Slid, Repositioned) and
 *  the conditions written after it ("Slid 1, then Grabbed"), which run by themselves, in that order, when the Tier lands. null: none. */
export const tierMoveThen = text => {
  const s = String(text ?? ""), m = s.match(/@Move\[((?:pushed|pulled|slid|reposition)\b[^\]]*)\]/);
  if (!m) return null;
  return { move: m[1], conds: s.slice(m.index + m[0].length).match(/@Condition\[[^\]]*\]/g) ?? [] };
};
/** v0.0.440: runs a Tier's forced movement on its creatures, one at a time, then the conditions written after it. ctx: { targets, actor, message, attrVal }. */
export async function runTierMove(text, ctx = {}) {
  const mt = tierMoveThen(text);
  if (!mt || !(ctx.targets ?? []).length) return false;
  try { await handleInline("Move", parseInline("Move", mt.move), ctx); } catch (e) { console.warn("twod12 | a Tier's movement", e); }
  for (const chip of mt.conds) { try { await applyConditionChip(chip, ctx); } catch (e) { console.warn("twod12 | a condition after the movement", chip, e); } }
  return true;
}
export async function applyConditionChip(chip, ctx = {}) {
  const m = String(chip).match(/^@Condition\[([^\]]*)\]/);
  if (!m) return;
  return handleInline("Condition", parseInline("Condition", m[1]), ctx);   // v0.0.421: with its formula options worked out
}

async function handleCondition(cfg, ctx = {}) {
  const msg = ctx.message;
  const f = msg?.getFlag?.("twod12", "action") ?? msg?.getFlag?.("twod12", "dmgCard");
  let actors = [];
  const toActor = async uuid => { const d = await fromUuid(uuid); return d?.documentName === "Actor" ? d : d?.actor; };
  if (cfg.to === "trigger" && f?.triggerUuid) {   // v0.0.409 (Shield of Faith): the Reaction's triggering creature
    actors = [await toActor(f.triggerUuid)];
    // v0.0.410 (book, A Reaction's Target): doing something to the triggering creature needs Line of Effect to it; without it that part doesn't happen
    try {
      const td = await fromUuid(f.triggerUuid), tt = td?.object ?? td?.getActiveTokens?.()[0], me = (ctx.actor ?? (f.actorUuid ? await fromUuid(f.actorUuid) : null))?.getActiveTokens?.()[0];
      const { coverBetween } = await import("./cover.mjs");
      if (tt && me && coverBetween(me, tt)?.noLoE) {
        const { postFollow } = await import("./followup.mjs");
        await postFollow(ctx.message, "fa-eye-slash", `No Line of Effect to <b>${esc(tt.name)}</b>: it isn't ${esc(cfg.cond)}.`);
        return;
      }
    } catch (e) { /* no map: apply */ }
  }
  else if (ctx.targets?.length) actors = await Promise.all(ctx.targets.filter(t => !cfg.crit || t.crit).map(t => toActor(t.uuid)));   // v0.0.249: the chain's targets (crit:yes: the Criticals only)
  else actors = handTargetTokens(ctx).map(t => t.actor);   // v0.0.252 (Lucas): a hand click goes to the selected tokens, else the targeted, else the card's (the card's Self no longer wins)
  actors = actors.filter(Boolean);
  if (!actors.length) return cfg.crit && ctx.targets?.length ? ui.notifications.info("No Critical: nothing to apply.") : ui.notifications.warn("Target or select a token first.");
  let src = ctx.actor ?? (f?.actorUuid ? await fromUuid(f.actorUuid) : (game.combat?.combatant?.actor ?? null));
  // v0.0.316 (Lucas): a condition that needs an origin (Frightened, Taunted, Grabbed) takes the Action's user only when its Effect says so and an
  // Action is behind the chip; otherwise it always asks (click a token)
  const condIt = await conditionItem(cfg.cond);
  if (condIt && needsOrigin(condIt.system)) {
    const user = ctx.actor ?? (f?.actorUuid ? await fromUuid(f.actorUuid) : null);
    if (user) src = user;   // v0.0.324 (Lucas: "isn't this the default?"): with an Action behind the chip, its user is the origin (the old switch is gone)
    else {
      const { askOrigin } = await import("./conditions.mjs");
      const u = await askOrigin(condIt, actors);
      if (!u) return;
      src = await fromUuid(u);
    }
  }
  const dur = cfg.dur === "eot" ? { type: "eot" } : (cfg.dur === "rounds" ? { type: "rounds", rounds: cfg.rounds } : null);
  const found = await applyCondition(cfg.cond, actors, dur, { ...originInfo(src?.uuid ?? ""), ...(Number.isFinite(ctx.attrVal) ? { mod: ctx.attrVal } : Number.isFinite(f?.attrVal ?? f?.originMod) ? { mod: f.attrVal ?? f.originMod } : {}) }, cfg.value ?? null, cfg.bleed ? { bleed: cfg.bleed } : {});
  ui.notifications.info(`${cfg.cond.charAt(0).toUpperCase() + cfg.cond.slice(1)}${cfg.value ? ` ${cfg.value}` : ""} applied to ${actors.map(a => a.name).join(", ")}${found ? "" : " (as a status: there is no Effect item with that name)"}.`);
}

/* ---- Save card: one row per targeted token: name | check result | damage taken ---- */
const saveLabels = dc => [`\u2264 ${dc - 1}`, `${dc}\u2013${dc + 6}`, `\u2265 ${dc + 7}`];

const sdie = (f, dbl) => `<span class="die d12${f === 12 ? " boom" : ""}${dbl ? " dbl" : ""}">${f}</span>`;
const sside = (f, cls, sign) => f?.length ? `<span class="plus">${sign}</span><span class="dgroup ${cls}">${f.map(x => `<span class="die d3 ${cls}">${x}</span>`).join("")}</span>` : "";
/** The check dice and the damage dice of one finished save, as chips (same look as the check card). */
const diceRowHtml = (d, tier = 0) => {
  if (!d) return "";
  // each damage roll has its symbols in front: a heart or a brain, and the damage type's icon ("Body Bl" is a heart and a hammer)
  const sym = c => `${c.pool ? poolIcon(c.pool) : ""}${c.sub ? `<span class="dtic" aria-label="${esc(TWOD12.subtypes[c.sub] ?? c.sub)}" style="color:${TWOD12.subtypeInk[c.sub] ?? "inherit"};--sc-d:${TWOD12.subtypeColors?.[c.sub] ?? TWOD12.subtypeInk[c.sub] ?? "inherit"}">${dtypeIcon(c.sub)}</span>` : ""}`;   // v0.0.443: its bright color on a dark card (E6)
  const dmg = (d.dmg ?? []).filter(c => c.faces?.length).map(c => `${c.pool || c.sub ? `<span class="dsym">${sym(c)}</span>` : ""}<span class="dgroup dmgdice">${c.faces.map(f => `<span class="die d${c.d}">${f}</span>`).join("")}</span>`).join("");
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
    rows.push(`<tr class="t${n}"><th>${labels[n - 1]}</th><td>${rolled ? await tierRolled(parts, rolled) : await tierSummary(parts)}</td></tr>`);
  }
  const traits = cfg.traits.length ? `<div class="traits">${traitChevrons(cfg.traits, { compact: true })}</div>` : "";   // a chat card: tight chips (v0.0.180)
  const targets = st.rows.map((r, i) => {
    const res = r.result;
    const mid = res ? `<span class="shield small ${res.total >= dc ? "win" : "lose"}"><b class="rtotal">${res.total}</b><small class="vsdc">DC ${dc}</small></span>` : `<button type="button" data-twod12="saveRoll" data-idx="${i}">${esc(attr)}</button>`;
    return `<div class="srow"><span class="sname"><i class="fa-solid fa-crosshairs"></i> ${esc(r.name)}</span>${mid}<span class="sdmg ${res ? `t${res.tier}` : ""}">${res ? dmgCellHtml(res) : ""}</span></div>${extraLineHtml(res)}${res ? diceRowHtml(res.dice, res.tier) : ""}`;
  }).join('<hr class="sep">');
  return `<div class="twod12 chat action savecard" style="${st.color ? cardVars(st.color) : ""}">${cardHead(`${attr} Save`, "", `<span class="apmark">DC ${dc}</span>`)}${traits}
    <div class="orn">&#10022; &#10022; &#10022;</div><table class="tiers">${rows.join("")}</table><div class="orn">&#10022;</div><div class="stargets"><div class="srow sthead"><span class="sname"><button type="button" class="tgt" data-twod12="retargetSave" aria-label="Retarget"><i class="fa-solid fa-bullseye"></i></button> Name</span><span class="scol">Save</span><span class="scol r">Damage</span></div>${targets || "<i>No targets</i>"}</div></div>`;
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
  return { attr: it.vs && it.vs !== "roll" ? it.vs : "body", dc: saveDcOf(src, actor.system?.attributes), adj: 0, boon: 0, bane: 0, traits: [], tiers: { t1: tier(1), t2: tier(2), t3: tier(3) }, saveAction: true, source: item.name, actorUuid: actor.uuid, diceRule: version.diceRule ?? "", actionTraits: [...(it.traits ?? [])],   /* v0.0.428: Word of Radiance's d8s (saveDamage) */
    // v0.0.334 (Lucas, Rebuke): the Version's Effects by Tier (applied when the damage is applied and lands) and its "After the damage" chain
    fx: Object.fromEntries([1, 2, 3].map(n => [`t${n}`, [...(version.fx?.all ?? []), ...(version.fx?.[`t${n}`] ?? [])].filter(x => x?.uuid && (x.mode ?? "auto") === "auto").map(x => x.uuid)])), after: String(version.after ?? "").trim() };
}

/** v0.0.419: the token ids that give no Cover against the area: its creatures (the targets) and the creature using the Action. */
const areaIds = (targets, actorUuid = "") => {
  const ids = (targets ?? []).map(t => String(t.uuid ?? "").split(".").pop()).filter(Boolean);
  try { const a = actorUuid ? fromUuidSync(actorUuid) : null; const act = a?.documentName === "Actor" ? a : a?.actor; for (const t of act?.getActiveTokens?.() ?? []) ids.push(t.id); } catch (e) { /* none */ }
  return ids;
};
/**
 * The banes and boons a creature takes on a Save Action's Save: Vulnerable N gives N banes; Cover from the area's center gives Field Boons (Low 1,
 * Medium 2), and High cover makes the Save Favored (v0.0.301, PACK BB; book Ch. 1, Saves).
 */
function saveRowMods(tokenDoc, point, exclude = []) {
  const out = { boon: 0, bane: 0, favored: false, why: [] };
  const a = tokenDoc?.actor;
  let v = 0;
  for (const e of a?.effects ?? []) if (!e.disabled && e.statuses?.has?.("vulnerable")) v = Math.max(v, Math.max(1, Math.trunc(Number(e.getFlag?.("twod12", "value"))) || 1));
  if (v) { out.bane += v; out.why.push(`Vulnerable ${v}`); }
  try {
    if (point && tokenDoc?.object && canvas?.grid) {
      // v0.0.419 (book, Chapter 3, Cover against an area): the creatures inside the area (the Save's creatures) never give Cover against it
      const c = coverFromPoint(point, tokenDoc.object, { exclude });   // counted from the center of the area (its Point of Origin)
      if (c?.level >= 3 && !c.noLoE) { out.favored = true; out.why.push(`${c.label} (Favored)`); }
      else if (c?.level > 0 && !c.noLoE) { const n = Math.min(2, c.level); out.boon += n; out.why.push(`${c.label} (${n} Field Boon${n === 1 ? "" : "s"})`); }
    }
  } catch (e) { console.warn("twod12 | cover from the area", e); }
  return out;
}

/** A Save card for these targets (each player rolls their own Save), from a Save Action or an [HT] area that repeats it. */
export async function postSaveFor(cfg, targets, { point = null, source = "", note = "" } = {}) {
  const rows = [];
  for (const t of targets) {
    const doc = await fromUuid(t.uuid).catch(() => null);
    const m = saveRowMods(doc, point, areaIds(targets, cfg.actorUuid));
    rows.push({ uuid: t.uuid, name: t.name, result: null, boon: m.boon, bane: m.bane, favored: m.favored, why: m.why.join(", ") });
  }
  const head = `<div class="twod12 chat"><b>${esc(source || cfg.source || "Save")}</b>: ${note ? `${note} ` : ""}${rows.length ? `${rows.map(r => esc(r.name)).join(", ")} roll${rows.length === 1 ? "s" : ""} a DC ${cfg.dc} ${esc(TWOD12.attributes[cfg.attr] ?? cfg.attr)} Save.` : "no creature is in the area."}</div>`;
  if (!rows.length) { const { sysLine } = await import("./sysmsg.mjs"); return ChatMessage.create({ content: sysLine("fa-shield-halved", head.replace(/^<div class="twod12 chat">|<\/div>$/g, "")) }); }   // v0.0.415: a sysLine
  const st = { cfg, color: "", rows, tierDmg: await prerollTiers(cfg, rows) };   // each Tier's damage rolled once, now
  await ChatMessage.create({ content: await saveCardHtml(st), flags: { twod12: { saveCard: st } } });
}

export async function postSaveCard(cfg, ctx = {}) {
  // The tokens targeted now; if none, the targets of the Action card the Save came from.
  const fromCard = ctx.message?.getFlag?.("twod12", "action")?.targets ?? [];
  const targets = game.user.targets.size ? [...game.user.targets].map(t => ({ uuid: t.document.uuid, name: t.name })) : fromCard.map(t => ({ uuid: t.uuid, name: t.name }));
  if (!(cfg.attr in TWOD12.attributes)) return ui.notifications.warn(`Unknown attribute: ${cfg.attr}`);
  if (!targets.length) return ui.notifications.warn("Target at least one token first.");
  const st = { cfg, color: ctx.message?.getFlag?.("twod12", "action")?.color ?? "", rows: targets.map(t => ({ uuid: t.uuid, name: t.name, result: null })), tierDmg: await prerollTiers(cfg, targets) };
  await ChatMessage.create({ content: await saveCardHtml(st), flags: { twod12: { saveCard: st } } });
}

async function writeSaveCard(msg, st) {
  if (st.cc) {   // v0.0.283: the new Save card lives on the Save Action's own card
    const old = msg.getFlag("twod12", "cc"), m = foundry.utils.deepClone(old);
    // v0.0.286: one row per creature (several targets: each rolls its own Save on the same card)
    m.creatures = st.rows.map(r => ({ uuid: r.uuid, name: r.name, result: r.result?.row ?? null, damageDone: !!(r.damageDone || st.damageDone), hasDamage: !!r.result && !!(r.result.ccComps ?? []).length }));
    delete m.target; delete m.result; delete m.damageDone; delete m.hasDamage;
    m.tline.names = st.rows.map(r => r.name);
    return msg.update({ content: CC.replaceCard(msg.content, old, m), "flags.twod12.saveCard": st, "flags.twod12.cc": m });
  }
  await msg.update({ content: await saveCardHtml(st), "flags.twod12.saveCard": st });
}
/** v0.0.283: each Tier of a Save as the card shows it: one line per pool, then its riders (its texts, its effects' names). */
export async function saveTierOutcomes(cfg) {
  const out = {};
  for (const n of [1, 2, 3]) {
    const p = parseParts(cfg.tiers?.[`t${n}`]);
    const riders = [...await Promise.all(p.texts.map(t => enrich(t)))];
    for (const u of p.uuids) riders.push(`<span class="fxname">${esc((await fromUuid(u).catch(() => null))?.name ?? "?")}</span>`);
    out[n] = { parts: p.damage.map(d => ({ pool: d.pool || "B", t: d.formula, sub: d.sub })), riders };
  }
  return out;
}
/** v0.0.283: a one-target Save Action: its own card becomes the Save card (the target's owner rolls on it); the Tier's damage waits for the Damage button. */
export async function ccSaveOnCard(msg, cfg, targets, { model, point = null, chain = null }) {
  targets = [].concat(targets);   // v0.0.286: one creature or several, a row each
  const rows = [];
  for (const t of targets) { const doc = await fromUuid(t.uuid).catch(() => null), mods = saveRowMods(doc, point, areaIds(targets, cfg.actorUuid)); rows.push({ uuid: t.uuid, name: t.name, result: null, boon: mods.boon, bane: mods.bane, favored: mods.favored, why: mods.why.join(", ") }); }
  const st = { cfg, color: "", cc: true, rows, tierDmg: await prerollTiers(cfg, rows), ...(chain ? { chain } : {}) };   // v0.0.426: a damage-free Save Action's use-time chain (retargetSave)
  const m = { ...model, kind: "save", saveName: `${TWOD12.attributes[cfg.attr] ?? cfg.attr} Save`, dc: cfg.dc, tiers: await saveTierOutcomes(cfg), creatures: rows.map(r => ({ uuid: r.uuid, name: r.name, result: null, damageDone: false, hasDamage: false })) };
  m.tline = { ...m.tline, names: rows.map(r => r.name), retargetKind: "retargetSave" };
  await msg.update({ content: CC.cardContent(m), "flags.twod12.cc": m, "flags.twod12.saveCard": st });
}
/** v0.0.283: the Save card's Damage button: the target's Tier as a damage message (its effects ride on the damage). */
export async function saveDamage(msg) {
  const st = foundry.utils.deepClone(msg.getFlag("twod12", "saveCard"));
  // v0.0.286: every creature that rolled and whose damage wasn't posted yet, one group per Tier (rolled once per Tier: Several Targets)
  const ready = (st?.rows ?? []).map((r, i) => ({ r, i })).filter(({ r }) => r.result && !r.damageDone && !st.damageDone && (r.result.ccComps ?? []).length);
  if (!ready.length) return;
  if (!msg.isAuthor && !game.user.isGM) return ui.notifications.warn("Only the author of this card or the GM can roll its damage.");
  const cfg = st.cfg, m = msg.getFlag("twod12", "cc");
  const tiers = [...new Set(ready.map(x => x.r.result.tier))].sort((a, b) => a - b);
  const groups = tiers.map(t => { const parts = parseParts(cfg.tiers[`t${t}`]), first = ready.find(x => x.r.result.tier === t).r.result;
    return { tier: t, crit: false, comps: (st.tierDmg?.[`t${t}`] ?? first.ccComps ?? []).map(c => ({ pool: c.pool, sub: c.sub, nl: c.nl, total: c.total, formula: c.formula, dice: c.dice, kind: c.kind ?? "D" })), fx: [...parts.uuids, ...(cfg.fx?.[`t${t}`] ?? [])].map(u => ({ uuid: u, mode: "auto", rider: true })), riders: m?.tiers?.[t]?.riders ?? [], conds: tierConditionChips(cfg.tiers[`t${t}`]) }; });
  let actor = null; try { actor = cfg.actorUuid ? await fromUuid(cfg.actorUuid) : null; } catch (e) { actor = null; }
  const gOf = ready.map(({ r }) => tiers.indexOf(r.result.tier));
  // v0.0.428 (the audit: Word of Radiance's d8s against a Profane creature never rolled on its Save card): a creature that is Profane for the user
  // (Judged by it, or the Tag) gets its own roll of its Tier, d6s as d8s, on a line of its own
  const extraRolls = [];
  if (cfg.diceRule === "profane") {
    let user = null; try { user = cfg.actorUuid ? await fromUuid(cfg.actorUuid) : null; } catch (e) { user = null; }
    const { isProfaneFor } = await import("./judge.mjs");
    for (let k = 0; k < ready.length; k++) {
      const r = ready[k].r; let doc = null; try { doc = await fromUuid(r.uuid); } catch (e) { doc = null; }
      if (!user || !doc || !isProfaneFor(user, doc.object ?? doc)) continue;
      const p = parseParts(String(cfg.tiers?.[`t${r.result.tier}`] ?? "").replace(/(\d+)d6(!?)/g, "$1d8$2"));
      if (!p.damage.length) continue;
      const { comps, rolls } = await rollParts(p.damage, cfg.nonlethal);
      extraRolls.push(...rolls);
      groups.push({ ...groups[gOf[k]], comps: comps.map(c => ({ pool: c.pool, sub: c.sub, nl: c.nl, total: c.total, formula: c.formula, dice: c.dice, kind: c.kind ?? "D" })) });
      gOf[k] = groups.length - 1;
    }
    if (extraRolls.length) { try { await showDice(extraRolls); } catch (e) { /* no dice to show */ } }
  }
  // v0.0.426 (the audit; book, Chapter 8, Empowered: one creature takes it): the die rolled with the Tiers goes to the first creature whose damage
  // is dealt (its own group, so the others on its Tier don't take it), once
  if (st.tierDmg?.emp && !st.empDone) {
    // v0.0.467 (book, Chapter 8: chosen before the Saves): the creature chosen when the card was posted (empFor); not among these Saves yet: it
    // waits; it takes no damage: the die is lost. An older card with no choice: the first creature, as before
    const want = st.tierDmg.empFor ?? "";
    let k = want ? ready.findIndex(x => x.r.uuid === want) : 0;
    if (want && k < 0) k = -1;
    if (k >= 0 && !(groups[gOf[k]]?.comps ?? []).length) { st.empDone = true; k = -1; }
    if (k >= 0) {
    const g0 = groups[gOf[k]], ec = { ...st.tierDmg.emp, kind: "E" };
    if (g0) {
      if (ready.filter(x => x.r.result.tier === ready[k].r.result.tier && gOf[ready.indexOf(x)] === gOf[k]).length === 1) g0.comps = [...g0.comps, ec];
      else { const at = groups.length; groups.push({ ...g0, comps: [...g0.comps, ec] }); gOf[k] = at; }
      st.empDone = true;
    }
    }
  }
  // v0.0.463 (Lucas, checklist v0.0.462, consecrated: "it shows both 1d6 and 1d8, but apply only applies the 1d8"): a Tier's group left with no
  // creature (its only one took its own d8 roll above) is not shown
  { const used = [...new Set(gOf)].sort((x, y) => x - y), map = new Map(used.map((g, n) => [g, n])); if (used.length < groups.length) { const kept = used.map(g => groups[g]); groups.length = 0; groups.push(...kept); for (let j = 0; j < gOf.length; j++) gOf[j] = map.get(gOf[j]); } }
  const { postCcDamage } = await import("./ccdamage.mjs");
  await postCcDamage({ actor, title: cfg.source || m?.name || "Save", groups, targets: ready.map(({ r }, i) => ({ uuid: r.uuid, name: r.name, tier: r.result.tier, g: gOf[i] })), nl: !!cfg.nonlethal, originUuid: cfg.actorUuid ?? "", srcId: msg.id, into: msg, after: cfg.after ?? "", save: true });
  for (const { i } of ready) st.rows[i].damageDone = true;
  await writeSaveCard(msg, st);
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
  if (st.cc && st.rows.some(r => r.result)) return ui.notifications.warn("The Save was rolled: its target can't change now.");
  st.rows = toks.map(t => old.get(t.document.uuid) ?? { uuid: t.document.uuid, name: t.name, result: null });
  // v0.0.426 (the audit's gap): a damage-free Save Action used with no target ran no chain on use (Rebuke's Hindered): a new creature gets it now
  const fresh = st.chain?.chips ? st.rows.filter(r => !(st.chain.done ?? []).includes(r.uuid)) : [];
  if (fresh.length) st.chain.done = [...(st.chain.done ?? []), ...fresh.map(r => r.uuid)];
  try { await writeSaveCard(msg, st); } catch (e) { return ui.notifications.warn("Only the author of this card or the GM can change its targets."); }
  if (fresh.length) {
    let actor = null; try { actor = st.cfg?.actorUuid ? await fromUuid(st.cfg.actorUuid) : null; } catch (e) { actor = null; }
    try { await runAfter(st.chain.chips, { actor, targets: fresh.map(r => ({ uuid: r.uuid, name: r.name })), attrVal: st.chain.attrVal ?? null, message: msg, source: st.chain.source ?? "" }); }
    catch (e) { console.warn("twod12 | the Save card's chain after a retarget", e); }
  }
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
  const data = await askRoll(actor, { title: `${TWOD12.attributes[key]} Save: ${actor.name}${row.why ? ` (${row.why})` : ""}`, attrKey: key, traits: new Set([...(cfg.traits ?? []), key, "__save"]), defaults: { dc: cfg.dc, mod: cfg.adj, boons: (cfg.boon || 0) + (row.boon || 0), banes: (cfg.bane || 0) + (row.bane || 0), ...(row.favored ? { favored: true, favoredLabel: "High cover (Favored)" } : {}) } });
  if (!data) return;
  const fxm = resolveModifiers(actor, data.fx);
  const manB = Number(data.boons) || 0, manN = Number(data.banes) || 0, dc = Number(data.dc) || cfg.dc;
  const chk = await performCheck({ mod, boons: fxm.boons + manB, banes: fxm.banes + manN, dc, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data), favored: data.favored === "on", doomed: data.doomed === "on", sources: fxm.sources, manualBoons: manB, manualBanes: manN });
  expireOnUse(actor, new Set(), new Set(), { rolled: true }).catch(() => {});   // v0.0.458: a Bane "on its next roll" (Dirty Trick) is spent by a Save or a Check too
  // The damage of the tier rolled is calculated right away and every die (check and damage) is thrown at once.
  const parts = parseParts(cfg.tiers[`t${chk.tier}`]);
  // Several Targets: the damage of a Tier is rolled once, by the first creature on that Tier, and every other creature on it takes the same.
  const shared = st.tierDmg?.[`t${chk.tier}`] ?? null;
  const { comps, rolls } = shared ? { comps: shared.map(c => ({ ...c })), rolls: [] } : await rollParts(parts.damage, cfg.nonlethal);
  await showDice([...chk.rolls, ...rolls]);
  if (st.cc) {   // v0.0.283: the new Save card: the result is drawn on the card; the damage waits for its Damage button (effects with no damage land now)
    chk.dcLabel = "DC";
    const r = ccRowOf(chk, actor.name, row.uuid, TWOD12.attributes[key]);
    if (!comps.length && parts.uuids.length) await applyEffects(parts.uuids, [actor.uuid], originInfo(cfg.actorUuid ?? ""));
    // v0.0.418 (playtest 5): a Tier with no damage gives its conditions now (with damage, they ride on the Damage button when it lands)
    if (!comps.length) for (const chip of tierConditionChips(cfg.tiers[`t${chk.tier}`])) {
      try { await applyConditionChip(chip, { targets: [{ uuid: actor.uuid, name: actor.name }], actor: cfg.actorUuid ? await fromUuid(cfg.actorUuid).catch(() => null) : null }); } catch (e) { console.warn("twod12 | a Tier's condition", e); }
    }
    const result = { total: chk.total, tier: chk.tier, row: r, ccComps: comps.map(c => ({ pool: c.pool, sub: c.sub, nl: c.nl, total: c.total, formula: c.formula, dice: c.dice, kind: c.kind ?? "D" })), tierDmg: shared ? null : comps };
    if (game.user.isGM || msg.isAuthor) await storeSaveResult(msg.id, idx, result);
    else game.socket.emit("system.twod12", { type: "saveResult", messageId: msg.id, idx, result });
    return;
  }
  const bits = [], extras = [];
  let amount = null;
  let dealt = null;   // v0.0.320: Resist / Weak / Immune; v0.0.432: the riders happen whatever damage is dealt (Ch. 1 Riders)
  if (comps.length) { dealt = await dealDamageEx(actor, comps); bits.push(dealt.text); amount = comps.reduce((s, c) => s + c.total, 0); }
  bits.push(...parts.texts); extras.push(...parts.texts);
  if (parts.uuids.length) {
    await applyEffects(parts.uuids, [actor.uuid], originInfo(""));
    for (const u of parts.uuids) { const b = `\u2726 ${(await fromUuid(u))?.name ?? "?"}`; bits.push(b); extras.push(b); }
  }
  for (const chip of tierConditionChips(cfg.tiers[`t${chk.tier}`])) {
    try { await applyConditionChip(chip, { targets: [{ uuid: actor.uuid, name: actor.name }], actor: cfg.actorUuid ? await fromUuid(cfg.actorUuid).catch(() => null) : null }); } catch (e) { console.warn("twod12 | a Tier's condition", e); }
  }
  const tip = `${TWOD12.attributes[key]} ${sgn(mod)}${chk.adj ? `, modifier ${sgn(chk.adj)}` : ""}: 2d12 ${chk.d1.join("+")} + ${chk.d2.join("+")}${chk.bo ? `, +${chk.bo} Boon${chk.bo === 1 ? "" : "s"}` : ""}${chk.ba ? `, \u2212${chk.ba} Bane${chk.ba === 1 ? "" : "s"}` : ""}${chk.five ? `, 5 b/b: ${chk.five === "favored" ? "Favored" : "Doomed"}` : ""}${chk.doubles ? ", doubles" : ""} = ${chk.total} vs DC ${dc} (${saveLabels(dc)[chk.tier - 1]})${comps.length ? `. Damage: ${comps.map(c => `${c.formula} [${c.dice.map(d => d.results.join("+")).join(" ")}] = ${c.total}`).join("; ")}` : ""}`;
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
