// The cards (book/cards/*.json) for Node: the Foundry build (tools/content.mjs, tools/gen-basic.mjs) and the ruler (book/ruler/spec.mjs).
// One source per card; the format: book/cards/README.md. No dependency.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CARDS_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Every card of every file, in file order (each knows its `_file`). Throws on a card with no name or a name written twice. */
export function loadCards(dir = CARDS_DIR) {
  const out = [], seen = new Map();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
    catch (e) { throw new Error(`${f}: ${e.message}`); }
    for (const c of data.cards ?? []) {
      if (!c.name) throw new Error(`${f}: a card has no name`);
      if (seen.has(c.name)) throw new Error(`${f}: the card "${c.name}" is also in ${seen.get(c.name)}`);
      seen.set(c.name, f);
      out.push({ ...c, _file: f });
    }
  }
  return out;
}

export const isReaction = c => Boolean(c.interrupt || c.trigger);
export const hasVersions = c => Array.isArray(c.versions) && c.versions.length > 0;
/** "damage; effect text" -> [damage, text] (the first ";" splits; a cell with no damage is all text). */
export const splitTier = t => { const i = t.indexOf(";"); return i < 0 ? [t.trim(), ""] : [t.slice(0, i).trim(), t.slice(i + 1).trim()]; };
/** Does this text read as damage the book writes ("0", "[B] 1[W] + [Mod] + [M] 1d6 Ho", "[B] [Mod] Pi")? */
// v0.0.407 (pack "Stage 0 in Foundry"): a die can be written with ! (1d4!: it explodes)
export const isDamage = t => /^(0|-|(\[(B|M|V|R)\]\s*)?(\d*\[[WD]\]|\[Mod\]|\d+d\d+!?|\d+)(\s*\+\s*((\[(B|M|V|R)\]\s*)?(\d*\[[WD]\]|\[Mod\]|\d+d\d+!?|\d+)))*(\s+(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un))?)$/.test(t.trim());
/** The book's [[links]] to their label (Foundry and the ruler have no links). */
export const stripLinks = s => String(s ?? "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
/** The book's **bold** to plain text. */
export const stripBold = s => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "$1");

/* ------------------------------------------------------------------ the Structure (2026-11-16) for Foundry (pack F2, v0.0.409) */
// The book draws stage0/*.json itself (cards.py). Foundry reads a class's Structure cards once its Foundry pass is done (FOUNDRY_STRUCTURE): each
// is turned into the old card shape below (versions, tiers, effects, vs, interrupt / trigger, setup, notes), so cardgen.mjs builds the item as
// before. The class's old file stays for the ruler (spec.mjs reads loadCards: the ruler's builds are written on the old cards until its own pass).
export const STRUCTURE_DIR = "stage0";
/**
 * v0.0.412 (pack F3 part 2): a Structure file laid OVER an old file: its cards replace the old cards of the same name, its new names are added,
 * and the old file's other cards stay, but the ones listed in `drop` (the gear: the two bows' and the two swords' Techniques; the placeholder
 * weapons keep theirs).
 */
export const FOUNDRY_OVERLAY = { "gear.json": { file: "gear.json", drop: ["Skirmish Shot", "Heartseeker", "Guarded Cut", "Reaping Sweep"] },
  "talents.json": { file: "talents-pt.json" } };   // pack TALENTS-PT (2026-11-20): the four playtest Talents (Ricochet takes the old Talent's place)
/** The Structure files Foundry reads in the place of the old file's cards (the whole old file leaves Foundry). */
export const FOUNDRY_STRUCTURE = { "paladin.json": "paladin.json", "archer.json": "archer.json" };   // v0.0.411 (pack F3): the Archer too
const costAp = cost => { const m = String(cost ?? "").match(/(\d+)/); return m ? Number(m[1]) : 0; };
/** The lines of a body ([{ label, text }]) sorted into the old card's fields (pure). */
export function readBody(lines = []) {
  const o = { tiers: [null, null, null], or: null, effects: [], notes: [], rules: [], text: [], seq: [] };   // seq: the Effect and Special lines in their order
  // v0.0.419 (card-structure.md, A1): a Special written above the Attack or Save line says how the roll is made: it stays above it (a labeled line)
  const rollAt = lines.findIndex(x => ["Attack", "Save"].includes(String(x?.label ?? "").trim()));
  // v0.0.429 (CARD-ONE step 6): an Effect written above the roll stays above it (Rebuke, Reckoning, Hit and Run)
  const effAt = lines.findIndex(x => String(x?.label ?? "").trim() === "Effect");
  if (rollAt >= 0 && effAt >= 0 && effAt < rollAt) o.effectFirst = true;
  for (const [i, { label, text }] of lines.entries()) {
    const l = String(label ?? "").trim(), t = String(text ?? "").trim();
    if (l === "Special" && rollAt >= 0 && i < rollAt) { o.rules.push(`**Special:** ${t}`); (o.lines ??= []).push({ label: l, text: t }); continue; }
    let m;
    if (l === "Attack") o.vs = /Ward Defense/i.test(t) ? "WD" : /Armor Defense/i.test(t) ? "AD" : t.replace(/^.*?vs\.\s*/i, "");
    else if (l === "Save") o.vs = `${t} Save`;
    else if ((m = l.match(/^Tier ([123])$/))) o.tiers[Number(m[1]) - 1] = t;
    else if ((m = l.match(/^Tier ([123]) or ([123])$/))) o.or = { tiers: [Number(m[1]), Number(m[2])], text: t };
    else if (l === "Critical") o.critical = t;   // v0.0.411 (Quick Shots, Volley): the Version's Critical
    else if (l === "Bloodied") o[rollAt >= 0 && i < rollAt ? "bloodiedBefore" : "bloodied"] = t;   // core rework batch 3: Structure cards' Bloodied / Strained lines
    else if (l === "Strained") o[rollAt >= 0 && i < rollAt ? "strainedBefore" : "strained"] = t;
    else if (l === "Effect") { o.effects.push(t); o.seq.push(t); }
    else if (l === "Interrupt") o.interrupt = t;
    else if (l === "Trigger") o.trigger = t;
    else if (l === "Setup") o.setup = t;
    else if (l === "Requirement") o.requirements = t;
    else if (l === "Prerequisite") o.prerequisites = t;
    else if (l === "Passive") o.text.push(t);
    else if (l === "Special") { o.notes.push(t); o.seq.push(`Special: ${t}`); }
    else { o.rules.push(l ? `**${l}:** ${t}` : t); (o.lines ??= []).push({ label: l, text: t }); }   // v0.0.411: the labeled line itself too (the card draws it)
  }
  return o;
}
/** A body's tiers as the old three cells: the Tier lines, or "Tier 1 or 2" on two of them and "No effect." on the third; null: no tiers. */
const tierCells = b => {
  if (b.tiers.every(x => x == null) && !b.or) return null;
  // a cell that is only damage drops the Structure's final period ("[R] 1d6 Ho." is the old "[R] 1d6 Ho")
  const cell = t => { const m = String(t).match(/^(.*?)\.\s*$/); return m && isDamage(m[1]) ? m[1] : t; };
  return [1, 2, 3].map(n => cell(b.tiers[n - 1] ?? (b.or?.tiers.includes(n) ? b.or.text : "No effect.")));
};
/**
 * A Structure card as an old card (pure): `structure: 2` cards of stage0/. A block is a Version ("1 AP", "2R") or a Mode (any other heading: the
 * Version's `mode` is its name, with the block's own traits, Distance, Target and roll as `modeTraits`, `modeDistance`, `modeTargets`, `modeVs`).
 * The card's `foundry` stays; a block's `foundry` is its Version's. `foundry.tiers` (a card or a block) replaces the tier cells Foundry reads
 * (Smite: the book's "your Smite dice" as dice Foundry rolls); a one-Version card writes its Version's extras in `foundry.version`.
 */
export function fromStructure(c) {
  const top = readBody(c.body), passive = String(c.cost ?? "").trim() === "Passive";
  const out = { name: c.name, category: c.category, level: c.level, flavor: c.flavor, traits: c.traits ?? [], structure: 2, _file: c._file };
  for (const k of ["frequency", "escalation", "distance", "area", "target", "foundry", "ruler", "book", "weapon", "mastery", "talent"]) if (c[k] !== undefined) out[k] = c[k];   // v0.0.412: a Technique's weapon
  for (const k of ["vs", "interrupt", "trigger", "setup", "requirements", "prerequisites", "bloodied", "strained", "bloodiedBefore", "strainedBefore"]) if (top[k] !== undefined) out[k] = top[k];
  if (top.rules.length) out.rules = top.rules.join(" ");
  if (top.lines?.length) out.lines = top.lines;   // v0.0.411: the card's own labeled lines before the roll (Judged, Smite dice)
  if (top.notes.length) out.notes = top.notes.join(" ");
  if (passive) { out.text = [...top.text, ...top.effects].join(" "); return out; }
  const version = (b, ap, extra = {}) => {
    const v = { ap, ...extra };
    const cells = b.foundry?.tiers ?? tierCells(b);
    if (cells) v.tiers = cells;
    // v0.0.411: the Effect lines are the Version's effects; a block's Special lines its `special` (the card draws each under its label)
    const eff = b.seq ? b.seq.filter(t => !t.startsWith("Special: ")) : b.effects, sp = b.seq ? b.seq.filter(t => t.startsWith("Special: ")).map(t => t.slice(9)) : [];
    if (eff.length) v.effects = eff.join(" ");
    if (sp.length) v.special = sp.join(" ");
    if (b.critical) v.critical = b.critical;
    if (b.or?.tiers?.length === 2 && !(b.foundry?.tiers)) v.orTiers = b.or.tiers.join("");   // v0.0.426: "Tier 2 or 3" as written (the card draws one line)
    // v0.0.429 (CARD-ONE step 6): the Tiers the card writes (Circling Shot has no Tier 1 line); the effect written above the roll
    const written = [1, 2, 3].filter(n => b.tiers?.[n - 1] != null || b.or?.tiers?.includes(n));
    if (written.length && written.length < 3 && !(b.foundry?.tiers)) v.tiersWritten = written.join("");
    if (b.effectFirst) v.effectFirst = true;
    if (b.foundry) { v.foundry = { ...b.foundry }; delete v.foundry.tiers; if (!Object.keys(v.foundry).length) delete v.foundry; }   // its tiers are the Version's tiers now
    return v;
  };
  const blocks = c.blocks ?? [];
  if (!blocks.length) {
    // one Version: its Specials are the card's notes (after the table); the card's foundry.version is the Version's foundry block
    const v = version({ ...top, seq: top.effects, foundry: c.foundry?.version }, costAp(c.cost));
    out.versions = [v];
    return out;
  }
  out.versions = blocks.map(bl => {
    const b = readBody(bl.body), h = String(bl.heading ?? "").trim(), m = h.match(/^(\d+)\s*(AP|R)$/i);
    // v0.0.426 (the audit's gap): a Special above the roll inside a block isn't carried to Foundry (only the card's own is): refuse it rather than
    // drop it silently; write it at the card level, or carry a Version's lines through cardgen first
    if ((b.lines ?? []).some(x => x.label === "Special")) throw new Error(`${c._file ?? ""}: "${c.name}", block "${h}": a Special above the Attack / Save line inside a block isn't read by Foundry yet`);
    const shared = top.tiers.some(x => x != null) || top.or ? { tiers: top.tiers, or: top.or } : {};   // a roll written above the blocks is every block's
    const merged = { ...b, ...(b.tiers.some(x => x != null) || b.or ? {} : shared), seq: [...top.effects, ...b.seq], foundry: bl.foundry, critical: b.critical ?? top.critical };
    const extra = {};
    if (!m) {
      // pack TALENTS-PT: a [Split] card's "Weapon mode" / "Power mode" is the Split Action's mode (split.mjs: "weapon" / "power"); any other heading an Art's Mode
      const sm = h.match(/^(weapon|power) mode$/i);
      extra.mode = sm && (c.traits ?? []).includes("split") ? sm[1].toLowerCase() : h;
      if (bl.traits?.length) extra.modeTraits = bl.traits;
      if (bl.distance) extra.modeDistance = bl.distance;
      if (bl.target) extra.modeTargets = bl.target;
      if (b.vs) extra.modeVs = b.vs;
    }
    const v = version(merged, m ? Number(m[1]) : costAp(c.cost), extra);
    if (b.setup) v.setup = b.setup;
    return v;
  });
  return out;
}
/** The Structure cards of stage0/ (each with structure: 2 and its _file), by file name. */
export function loadStructure(dir = path.join(CARDS_DIR, STRUCTURE_DIR)) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    out[f] = (data.cards ?? []).map(c => ({ ...c, structure: 2, _file: `${STRUCTURE_DIR}/${f}` }));
  }
  return out;
}
/**
 * The cards Foundry builds (pack F2, v0.0.409): loadCards(), with each file of FOUNDRY_STRUCTURE replaced by its Structure file (read through
 * fromStructure). The ruler keeps loadCards().
 */
export function loadFoundryCards(dir = CARDS_DIR) {
  const all = loadCards(dir), st = loadStructure(path.join(dir, STRUCTURE_DIR));
  const out = [], over = new Map();
  for (const [oldFile, o] of Object.entries(FOUNDRY_OVERLAY)) for (const c of st[o.file] ?? []) over.set(c.name, { c, oldFile });
  const dropped = new Set(Object.values(FOUNDRY_OVERLAY).flatMap(o => o.drop ?? []));
  for (const c of all) {
    if (FOUNDRY_STRUCTURE[c._file] || dropped.has(c.name)) continue;
    const o = over.get(c.name);
    if (o && o.oldFile === c._file) { out.push(fromStructure(o.c)); over.delete(c.name); } else out.push(c);
  }
  for (const { c } of over.values()) out.push(fromStructure(c));   // an overlay's new names
  const names = new Set(out.map(c => c.name));
  for (const [oldFile, newFile] of Object.entries(FOUNDRY_STRUCTURE)) for (const c of st[newFile] ?? []) {
    if (names.has(c.name)) throw new Error(`${newFile}: the card "${c.name}" is also in another file`);
    names.add(c.name); out.push(fromStructure(c));
  }
  return out;
}
