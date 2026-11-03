// A card of book/cards/*.json to Foundry item data (pack CS, 2026-11-03). Used by tools/gen-basic.mjs (the Basic Actions: module/basic-data.mjs)
// and, from CS-2 on, by tools/content.mjs (the compendium items). The Foundry text of a Version is the book's text (links and bold stripped,
// then convertEffects makes its buttons) plus the card's Foundry-only `append` (buttons the text can't derive, map instructions).
// Data to data: no card is named here; the rules are the ones book/cards/README.md lists.
import path from "node:path";
import { fileURLToPath } from "node:url";
// The generators read Foundry globals when they load: give them stand-ins (content.mjs does the same; `??=` keeps its own).
globalThis.foundry ??= { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks ??= { on() {} }; globalThis.Combat ??= class {}; globalThis.CONFIG ??= {}; globalThis.game ??= { settings: { get: () => true } };
const { parseTierFull, convertEffects } = await import("../module/gen.mjs");
const { loadCards, isReaction, hasVersions, splitTier, isDamage, stripLinks, stripBold } = await import(path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../book/cards/load.mjs"));
export { loadCards };

const FREQ = { "at-will": "atwill", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const TRAIT_KEY = { power: "magic" };   // the book's word -> Foundry's key (config.mjs: the key stays "magic", the label is Power)
const SUB = { Ac: "Ac", Bl: "Bl", Co: "Co", El: "El", Fi: "Fi", Fo: "Fo", Ho: "H", Pi: "Pi", Ps: "Ps", Sl: "S", Th: "Th", Un: "Un" };
const ATTRS = ["body", "mind", "appeal", "instinct"];

export const frequencyKey = f => { const k = FREQ[String(f ?? "").toLowerCase()]; if (k === undefined) throw new Error(`unknown Frequency "${f}"`); return k; };
export const traitKeys = traits => [...new Set((traits ?? []).map(t => TRAIT_KEY[t] ?? t))].sort();
/** The book's Distance to the item's: Weapon -> weapon, Reach -> reach, "5 sq." -> "5", none -> "self" for a card with no Target, else "". */
export function distanceKey(c) {
  const t = String(c.distance ?? "").trim();
  if (!t) return c.target ? "" : "self";
  if (/^weapon$/i.test(t)) return "weapon";
  if (/^reach$/i.test(t)) return "reach";
  if (/^self$/i.test(t)) return "self";
  const m = t.match(/^(\d+)\s*sq\.?$/i);
  return m ? m[1] : t;
}
/** The book's Vs to the item's: AD, WD and a DC -> "" (the traits say which Defense); an Attribute -> its key; "A or B (the one used to roll)" -> roll; "Instinct Save" -> instinct. */
export function vsKey(vs) {
  const t = String(vs ?? "").trim();
  if (!t || /^(AD|WD)$/i.test(t) || /^DC\s*\d+$/i.test(t)) return "";
  if (/\(the one used to roll\)/i.test(t) || /\bor\b/i.test(t)) return "roll";
  const m = t.match(/^(\w+)(?:\s+Save)?$/);
  if (m && ATTRS.includes(m[1].toLowerCase())) return m[1].toLowerCase();
  throw new Error(`unknown Vs "${vs}"`);
}

/** The book's damage of one tier ("[B] 1[W] + [Mod] + [M] 1d6 Ho") to Foundry's tier tokens ("1WB,1d6MH").
 *  A [Weapon] Action adds the Weapon Modifier on Tiers 2 and 3 by itself (actions.mjs attrFrom), so its [Mod] is left out there (not for a Save Action). */
export function tierTokens(dmg, weaponAction, tier) {
  const s = String(dmg ?? "").trim();
  if (!s || s === "0" || s === "-") return "";
  let pool = "B", sub = "", flat = null;
  const tokens = [];
  for (let p of s.split("+").map(x => x.trim()).filter(Boolean)) {
    let m;
    if ((m = p.match(/^\[(B|M)\]\s*(.*)$/))) { pool = m[1]; p = m[2].trim(); }
    if ((m = p.match(/^(.*?)\s+(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)$/))) { sub = SUB[m[2]]; p = m[1].trim(); }
    if (p) tokens.push({ p, pool });
  }
  const out = [];
  for (const { p, pool: pl } of tokens) {
    let m;
    if ((m = p.match(/^(\d*)\[W\]$/))) out.push({ k: "w", t: `${m[1] || 1}W${pl}` });
    else if (p === "[Mod]") { if (!(weaponAction && tier >= 2)) out.push({ k: "at", t: `Mod${pl}${sub}` }); }
    else if (/^\d+d\d+$/.test(p)) out.push({ k: "dice", t: `${p}${pl}${sub}` });
    else if (/^\d+$/.test(p)) flat = p;
    else throw new Error(`can't read the damage "${dmg}" (the part "${p}")`);
  }
  if (flat !== null) { const d = out.find(x => x.k === "dice"); if (!d) throw new Error(`a flat number with no dice in "${dmg}"`); d.t = d.t.replace(/^(\d+d\d+)/, `$1+${flat}`); }
  return out.map(x => x.t).join(",");
}

/** The Foundry text of a book text: links and bold stripped, the buttons convertEffects derives, then the Foundry-only append. */
const fxText = (book, append) => [convertEffects(stripBold(stripLinks(book ?? ""))).replace(/^(@\w+\[[^\]]*\](?:\{[^}]*\})?)\.$/, "$1"), append ?? ""].filter(Boolean).join(" ");   // a cell that is one button keeps no final period
const appendOf = (v, key) => { const a = v.foundry?.append; if (!a) return ""; if (typeof a === "string") return key === "effects" ? a : ""; return a[key] ?? ""; };

/** One Version of a card as the item's version data. */
export function versionData(c, v, resolve = s => s) {
  const weaponAction = (c.traits ?? []).includes("weapon") && !(c.traits ?? []).includes("save");   // a Save Action's tiers are the target's result: its [Mod] stays explicit
  const fx = { all: [], t1: [], t2: [], t3: [] };
  for (const [k, list] of Object.entries(v.foundry?.fx ?? {})) fx[k] = list.map(u => ({ uuid: resolve(u), mode: "auto" }));
  const out = { ap: v.ap, noTiers: !v.tiers, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", effects: resolve(fxText(v.effects, appendOf(v, "effects"))), fx };
  if (v.tiers) {
    if (v.tiers.length !== 3) throw new Error(`${c.name}: a Version needs three tiers`);
    v.tiers.forEach((cell, i) => {
      const [d, x] = splitTier(cell);
      const dmg = isDamage(d) ? d : "", text = isDamage(d) ? x : cell.trim();
      const r = parseTierFull(tierTokens(dmg, weaponAction, i + 1));
      out[`t${i + 1}`] = r.insts;
      out[`x${i + 1}`] = resolve(fxText(text, appendOf(v, `x${i + 1}`)));
    });
  }
  if (v.critical) out.critical = resolve(fxText(v.critical, appendOf(v, "critical")));
  if (v.mode) out.mode = v.mode;
  if (v.foundry?.areaSize) out.areaSize = v.foundry.areaSize;
  return out;
}

/** The book's **bold** to <b> (descriptions are HTML). */
const boldHtml = s => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
/** The book's Area ("2 / 3 Emanation", "1 Burst") and Distance ("5 sq.", "Your weapon's normal range") to the item's areaCfg; "Aura N" is a Distance, not an area template. */
export function areaOf(c) {
  const a = String(c.area ?? "").trim();
  if (!a) return null;
  const m = a.match(/^(\d+(?:\s*\/\s*\d+)*)\s+(Emanation|Burst|Line)$/i);
  if (!m) return null;   // "Aura 2": the Distance below
  const sizes = m[1].split("/").map(x => Number(x.trim()));
  const cfg = { size: sizes[0], shape: m[2].toLowerCase(), within: 0, targets: "all", center: false, keep: false, rounds: 0 };
  const d = String(c.distance ?? "").trim(), r = d.match(/weapon's (normal|far|maximum) range/i);
  if (r) cfg.withinRange = r[1].toLowerCase(); else if (d) cfg.within = Number(distanceKey(c)) || 0;
  Object.assign(cfg, c.foundry?.areaCfg ?? {});
  return { cfg, sizes };
}
/** The item's system data of a card (an Action). `resolve` turns {{fx:Name}} into the Effect's uuid (content.mjs). */
export function cardSystem(c, resolve = s => s) {
  if (!hasVersions(c)) throw new Error(`${c.name}: an Action card needs versions`);
  const area = areaOf(c);
  const sys = { category: c.category, level: c.level ?? c.foundry?.level ?? 0, traits: traitKeys(c.traits), targets: stripLinks(c.target ?? ""), distance: area ? undefined : (/^Aura \d+$/i.test(c.area ?? "") ? c.area.trim() : distanceKey(c)), frequency: frequencyKey(c.frequency) };
  if (sys.distance === undefined) delete sys.distance;   // an Action with an Area places it from its areaCfg (within or the weapon's range)
  if (area) sys.areaCfg = area.cfg;
  const vs = vsKey(c.vs); if (vs) sys.vs = vs;
  if (c.escalation) sys.escalation = c.escalation;
  if (isReaction(c)) { sys.reaction = true; sys.reactionKind = c.interrupt ? "interrupt" : "trigger"; sys.trigger = stripLinks(c.interrupt ?? c.trigger); }
  if (c.requirements) sys.requirements = stripLinks(c.requirements);
  if (c.prerequisites) sys.prerequisites = stripLinks(c.prerequisites);
  if (c.setup) sys.setup = resolve(fxText(c.setup, c.foundry?.appendSetup));
  const prose = [c.rules, c.notes].filter(Boolean).map(t => `<p>${boldHtml(stripLinks(t))}</p>`).join("");
  if (prose) sys.description = prose;
  sys.versions = c.versions.map((v, i) => { const d = versionData(c, v, resolve); if (area && i > 0 && area.sizes[i] && area.sizes[i] !== area.sizes[0]) d.areaSize = area.sizes[i]; return d; });
  if (c.flavor) sys.flavor = c.flavor;
  for (const k of ["weaponUse", "automation", "automationNote", "marksTarget", "basicAttack", "modifiers"]) if (c.foundry?.[k] !== undefined) sys[k] = c.foundry[k];
  return sys;
}

/** The item's system data of a Feature or Talent card (no Versions): its text is the description (plus the Foundry-only `append`), its automation is settings. */
export function featureSystem(c, resolve = s => s) {
  if (hasVersions(c)) throw new Error(`${c.name}: a Feature card has no versions`);
  const category = String(c.category).replace(/\s*\(Passive\)$/, "");
  const text = [boldHtml(stripLinks(c.text ?? "")), c.foundry?.append ?? ""].filter(Boolean).join(" ");
  const sys = { category, level: c.level ?? c.foundry?.level ?? 0, description: text ? `<p>${text}</p>` : "" };
  if (c.foundry?.settings) sys.settings = JSON.parse(resolve(JSON.stringify(c.foundry.settings)));
  if (c.foundry?.actions) sys.actions = c.foundry.actions.map(n => resolve(`{{action:${n}}}`));
  if (c.flavor) sys.flavor = c.flavor;
  for (const k of ["automation", "automationNote", "talents"]) if (c.foundry?.[k] !== undefined) sys[k] = c.foundry[k];
  if (/escalation/i.test(category) || c.foundry?.escalationPassive) sys.escalationPassive = true;
  return sys;
}

/** A Basic Action as basic.mjs keeps it (the entry of BASIC_ACTIONS): the item's fields plus the key, flat. */
export function basicEntry(c) {
  if (!c.foundry?.basic) throw new Error(`${c.name}: a Basic Action needs foundry.basic (its key)`);
  const s = cardSystem(c);
  const e = { name: c.name, img: c.foundry.img ?? "icons/svg/sword.svg", frequency: s.frequency, traits: s.traits, targets: s.targets, vs: s.vs ?? "", distance: s.distance };
  if (s.requirements) e.requirements = s.requirements;
  if (s.weaponUse) e.weaponUse = s.weaponUse;
  if (s.description) e.description = s.description;
  e.flavor = c.flavor ?? "";
  e.versions = s.versions;
  return e;
}
