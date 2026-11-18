// A card of book/cards/*.json to Foundry item data (pack CS, 2026-11-03). Used by tools/gen-basic.mjs (the Basic Actions: module/basic-data.mjs)
// and, from CS-2 on, by tools/content.mjs (the compendium items). The Foundry text of a Version is the book's text (links and bold stripped,
// then convertEffects makes its buttons) plus the card's Foundry-only `append` (buttons the text can't derive, map instructions).
// Data to data: no card is named here; the rules are the ones book/cards/README.md lists.
// The generators read Foundry globals when they load: give them stand-ins (content.mjs does the same; `??=` keeps its own).
globalThis.foundry ??= { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks ??= { on() {} }; globalThis.Combat ??= class {}; globalThis.CONFIG ??= {}; globalThis.game ??= { settings: { get: () => true } };
const { parseTierFull, convertEffects } = await import("../module/gen.mjs");
const { loadFoundryCards, isReaction, hasVersions, splitTier, isDamage, stripLinks, stripBold } = await import(new URL("../../../book/cards/load.mjs", import.meta.url).href);   // a URL, not a path: a Windows path is not a valid ESM import (v0.0.231)
// v0.0.409 (pack F2): Foundry's cards: the old files, with the Paladin's replaced by its Structure cards (load.mjs loadFoundryCards; the ruler keeps loadCards)
export const loadCards = loadFoundryCards;
// Pack R-classes (Lucas, 2026-11-04): the ruler's worth of each class card (book/ruler/worth.json, written by rclasses.mjs) is printed as a tiny line on the item, for the playtests.
const { readFileSync, existsSync } = await import("node:fs");
const WORTH_FILE = new URL("../../../book/ruler/worth.json", import.meta.url);
export const WORTH = existsSync(WORTH_FILE) ? JSON.parse(readFileSync(WORTH_FILE, "utf8")) : {};
const worthOf = name => WORTH[name] ?? "";
// v0.0.246 (cards 1, Lucas): the book's [[links]] stay links in Foundry. A link to a card of the compendium opens that item (anyone can read it: Hide);
// any other link is a book link (@Book[Heading]{label}: the book's anchor; the Journal import comes later). A Basic Action has no compendium item: a book link.
const CARD_BY_NAME = new Map(loadCards().map(c => [c.name.toLowerCase(), c]));
export function foundryLinks(text) {
  return String(text ?? "").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, ref, label) => {
    const r = ref.trim(), l = (label ?? r).trim(), c = CARD_BY_NAME.get(r.toLowerCase());
    return c && c.foundry !== false && !c.foundry?.basic ? `{{link:${c.name}|${l}}}` : `@Book[${r}]{${l}}`;   // v0.0.360: a card with no Foundry item (foundry: false) is a book link
  });
}

const FREQ = { "at-will": "atwill", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const TRAIT_KEY = { power: "magic", projectile: "shot", firearm: "gun" };   // v0.0.411 (pack F3): the book's Projectile and Firearm are Foundry's shot and gun keys (their labels say Projectile, Firearm)   // the book's word -> Foundry's key (config.mjs: the key stays "magic", the label is Power)
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
  let pool = "B", flat = null;
  const subOf = {};   // v0.0.426: a subtype is its own pool's ("[V] 1[W] + [Mod] + [R] 1d6! Ho": the Holy is the Resolve dice's, not the [Mod]'s)
  const tokens = [];
  for (let p of s.split("+").map(x => x.trim()).filter(Boolean)) {
    let m;
    if ((m = p.match(/^\[(B|M|V|R)\]\s*(.*)$/))) { pool = ({ V: "B", R: "M" })[m[1]] ?? m[1]; p = m[2].trim(); }   // pack R-core: [V] Vigor / [R] Resolve are Foundry's B / M pools
    if ((m = p.match(/^(.*?)\s+(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)$/))) { subOf[pool] = SUB[m[2]]; p = m[1].trim(); }
    if (p) tokens.push({ p, pool });
  }
  const out = [];
  for (const { p, pool: pl } of tokens) {
    let m;
    const sub = subOf[pl] ?? "";
    if ((m = p.match(/^(\d*)\[W\]$/))) out.push({ k: "w", t: `${m[1] || 1}W${pl}` });
    else if (p === "[Mod]") { if (!(weaponAction && tier >= 2)) out.push({ k: "at", t: `Mod${pl}${sub}` }); }
    else if (/^\d+d\d+!?$/.test(p)) out.push({ k: "dice", t: `${p}${pl}${sub}` });   // v0.0.407: a die written with ! explodes
    else if (/^\d+$/.test(p)) flat = { n: p, pool: pl };
    else throw new Error(`can't read the damage "${dmg}" (the part "${p}")`);
  }
  if (flat !== null) { const d = out.find(x => x.k === "dice"); if (d) d.t = d.t.replace(/^(\d+d\d+!?)/, `$1+${flat.n}`); else out.push({ k: "dice", t: `${flat.n}${flat.pool}${subOf[flat.pool] ?? ""}` }); }   // "[B] 1[W] + [Mod] + 4": a flat 4 of its own
  return out.map(x => x.t).join(",");
}

/** The Foundry text of a book text: bold stripped, the links kept (foundryLinks), the buttons convertEffects derives, then the Foundry-only append. */
// v0.0.341 (Lucas: "the buttons aware isn't necessary, just make buttons normally"): the Tier text keeps its buttons; the chain runs by itself too
const fxText = (book, append) => [convertEffects(stripBold(foundryLinks(book ?? ""))).replace(/^(@\w+\[(?:[^\[\]]|\[[^\[\]]*\])*\](?:\{[^}]*\})?)\.$/, "$1"), append ?? ""].filter(Boolean).join(" ");   // a cell that is one button keeps no final period
const appendOf = (v, key) => { const a = v.foundry?.append; if (!a) return ""; if (typeof a === "string") return key === "effects" ? a : ""; return a[key] ?? ""; };

/** One Version of a card as the item's version data. */
export function versionData(c, v, resolve = s => s) {
  // v0.0.426 (the audit: Smite lost its Signature Modifier, Trick Shots' "[V] [Mod]" dealt nothing, Seizing Cut's Tier 2 got one the book doesn't
  // write): a Structure card's [Mod] stays where it is written (Chapter 1: a Modifier is added only where the card writes [Mod]); rollsource.mjs adds
  // none for it. The old cards keep the old way (the Weapon Modifier added from Tier 2).
  const weaponAction = (c.traits ?? []).includes("weapon") && !(c.traits ?? []).includes("save") && !c.structure;   // a Save Action's tiers are the target's result: its [Mod] stays explicit
  const fx = { all: [], t1: [], t2: [], t3: [] };
  // v0.0.265: an entry can be { "uuid": "{{fx:X}}", "mode": "conditional" } (the damage card's Effects button applies it: Deathmark's shot when the target goes Down)
  for (const [k, list] of Object.entries(v.foundry?.fx ?? {})) fx[k] = list.map(u => (typeof u === "object" && u ? { uuid: resolve(u.uuid), mode: u.mode || "auto" } : { uuid: resolve(u), mode: "auto" }));
  // v0.0.246 (Lucas): a Version's `foundry.text` is its Foundry text written in full ("As 1 AP, but..." is the book's; Foundry says it all); `foundry.after` the chips that run after the damage.
  const out = { ap: v.ap, noTiers: !v.tiers, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", effects: resolve(fxText(v.foundry?.text ?? v.effects, appendOf(v, "effects"))), fx };
  if (v.foundry?.after) out.after = resolve(v.foundry.after);
  // v0.0.409 (pack F2, Shield of Faith): replacements in the converted text (a button the book's words can't say: Taunted on the triggering creature)
  for (const [a, b] of v.foundry?.sub ?? []) out.effects = out.effects.split(a).join(b);
  // v0.0.254 (Lucas): a card's inline Actions are written on its last Version's Foundry text (a link to the item and its line), so the sheet's preview shows them after "you gain the following Action:"
  if (c.inline?.length && v === (c.versions ?? [])[(c.versions ?? []).length - 1]) out.effects += " " + c.inline.map(a => resolve(`{{link:${a.name}|${a.name}}} \u2014 ${[a.cost, a.frequency, a.traits?.length ? `[${a.traits.join(", ")}]` : "", a.interrupt ? `Interrupt: ${a.interrupt}` : "", a.trigger ? `Trigger: ${a.trigger}` : "", a.target ? `Target: ${a.target}` : "", a.effects ? `Effects: ${convertEffects(stripBold(foundryLinks(a.effects)))}` : ""].filter(Boolean).join(" | ")}`)).join(" ");
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
  // v0.0.334 (Lucas, Rebuke and Skirmish Shot): a Tier's Foundry text written in full (foundry.x1 / x2 / x3), as it is: no buttons made from it
  // (what it does runs by itself after the damage: the Version's foundry.after chain and its Effects by Tier)
  for (const n of [1, 2, 3]) if (typeof v.foundry?.[`x${n}`] === "string") out[`x${n}`] = resolve(v.foundry[`x${n}`]);
  if (v.critical) out.critical = resolve(fxText(v.critical, appendOf(v, "critical")));
  if (typeof v.foundry?.critical === "string") out.critical = resolve(v.foundry.critical);   // v0.0.338: the Critical's Foundry text as it is (its effect runs after the damage)
  if (v.mode) out.mode = v.mode;
  if (v.orTiers) out.orTiers = v.orTiers;   // v0.0.426: the card writes "Tier 2 or 3" / "Tier 1 or 2" (cardmodel.mjs tierLines draws one line)
  // v0.0.409 (pack F2): an Art's Mode (a Structure block): its own traits, Distance, Target and roll
  if (v.modeTraits?.length) out.modeTraits = traitKeys(v.modeTraits);
  if (v.modeDistance) out.modeDistance = distanceKey({ distance: v.modeDistance, target: v.modeTargets });
  if (v.modeTargets) out.modeTargets = stripLinks(v.modeTargets);
  if (v.modeVs) out.modeVs = vsKey(v.modeVs);
  if (v.foundry?.diceRule) out.diceRule = v.foundry.diceRule;
  if (v.special) out.special = resolve(fxText(v.special));   // v0.0.411: a Structure block's Special
  if (v.foundry?.areaSize) out.areaSize = v.foundry.areaSize;
  if (v.foundry?.areaRounds) out.areaRounds = v.foundry.areaRounds;   // v0.0.261 (Consecrated Ground): this version's rounds for the kept area
  // v0.0.426 (the audit: Rescue's Reposition 2 was held within the Paladin's Reach; book, Chapter 3: "Your Reach and the creature's Size don't limit
  // it"): only a card that says so keeps the target within its Reach (Relocate: "must remain within your Reach throughout the whole movement")
  if (!/remain within your Reach/i.test(String(c.requirements ?? ""))) for (const k of ["effects", "x1", "x2", "x3", "critical", "after"]) if (typeof out[k] === "string") out[k] = out[k].replace(/(@Move\[reposition\|[^\]]*?)\|reach:yes/g, "$1");
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
/** A costed card with no table ("1R" and prose: Opportunity Attack) reads as one Version whose text is the card's text. */
export const versionsOf = c => (hasVersions(c) ? c.versions : c.cost ? [{ ap: Number(String(c.cost).match(/\d+/)?.[0] ?? 0), effects: c.text ?? "", foundry: c.foundry?.append ? { append: c.foundry.append } : undefined, ruler: c.ruler?.line }] : []);
/** v0.0.246: a placeholder card (`placeholder: true`: an Action the book hasn't written yet, Hide) is an Action item with no Versions, so links to it open something to read. */
export const isAction = c => hasVersions(c) || Boolean(c.cost) || Boolean(c.placeholder);
export function cardSystem(c, resolve = s => s) {
  if (!isAction(c)) throw new Error(`${c.name}: an Action card needs versions`);
  const area = areaOf(c);
  const aura = /^Aura \d+$/i.test(c.area ?? "");   // v0.0.249 (Lucas): an Aura is the Area line ("Area: Aura 2"), not a Distance
  const sys = { category: c.category, level: c.level ?? c.foundry?.level ?? 0, traits: traitKeys(c.traits), targets: stripLinks(c.target ?? ""), distance: area ? undefined : distanceKey(c), frequency: c.placeholder && !c.frequency ? "" : frequencyKey(c.frequency) };
  if (sys.distance === undefined) delete sys.distance;   // an Action with an Area places it from its areaCfg (within or the weapon's range)
  if (area) sys.areaCfg = area.cfg;
  if (aura) sys.area = c.area.trim();
  const vs = vsKey(c.vs); if (vs) sys.vs = vs;
  if (c.escalation) sys.escalation = c.escalation;
  if (isReaction(c)) { sys.reaction = true; sys.reactionKind = c.interrupt ? "interrupt" : "trigger"; sys.trigger = stripLinks(c.interrupt ?? c.trigger); }
  if (c.requirements) sys.requirements = stripLinks(c.requirements);
  if (c.prerequisites) sys.prerequisites = stripLinks(c.prerequisites);
  if (c.setup) sys.setup = resolve(fxText(c.setup, c.foundry?.appendSetup));
  const prose = [c.rules, c.notes, ...(c.placeholder ? [c.text] : [])].filter(Boolean).map(t => `<p>${boldHtml(foundryLinks(t))}</p>`).join("");
  if (prose) sys.description = resolve(prose);
  if (worthOf(c.name) && !c.structure) sys.worth = worthOf(c.name);   // v0.0.409: the ruler's worth is of the old card (not a Structure card)
  if (c.category === "Basic attack") sys.basicAttack = true;   // an NPC's Basic attack stands in for the Weapon Attack NPCs don't have
  sys.versions = versionsOf(c).map((v, i) => { const d = versionData(c, v, resolve); if (area && i > 0 && area.sizes[i] && area.sizes[i] !== area.sizes[0]) d.areaSize = area.sizes[i]; return d; });
  if (c.flavor) sys.flavor = c.flavor;
  // v0.0.411 (pack F2, the card's look): a Structure card's labeled lines and Special, for the card (its prose stays the description for the other surfaces)
  if (c.structure) { sys.structure = true; if (c.lines?.length) sys.lines = c.lines.map(l => ({ label: l.label, text: resolve(fxText(l.text)) })); if (c.notes) sys.special = resolve(fxText(c.notes)); }
  if (c.foundry?.settings) sys.settings = JSON.parse(resolve(JSON.stringify(c.foundry.settings)));   // v0.0.360 (the audit's D17): an Action holds rules (Mark Quarry)
  for (const k of ["weaponUse", "automation", "automationNote", "marksTarget", "markKind", "basicAttack", "basicRating", "modifiers", "moment", "momentRange", "momentSelf", "momentTarget", "momentThreat"]) if (c.foundry?.[k] !== undefined) sys[k] = c.foundry[k];   // v0.0.261: moment, momentRange (Divine Intervention); v0.0.272: momentSelf, momentTarget
  return sys;
}

/**
 * v0.0.249 (Lucas, inline Actions): a card's `inline` list, each as a card of its own (an Action item in the "Inline" folder; the parent's effect
 * carries it with the "inline" setting while it lasts). Written by Lucas as one line: Name — cost | Frequency | [traits] | Interrupt: ... | Effects: ...
 */
export const inlineCards = c => (c.inline ?? []).map(a => ({ name: a.name, category: "Inline Action", flavor: a.flavor, traits: a.traits ?? [], frequency: a.frequency, target: a.target, cost: a.cost, interrupt: a.interrupt, trigger: a.trigger, requirements: a.requirements, text: a.effects, foundry: { img: c.foundry?.img, folder: "Inline", automation: a.automation ?? c.foundry?.automation, automationNote: a.automationNote, append: a.append, inlineOf: c.name, ...Object.fromEntries(["moment", "momentRange", "momentSelf", "momentTarget"].filter(k => a[k] !== undefined).map(k => [k, a[k]])) }, _file: c._file }));
/** The item's system data of a Feature or Talent card (no Versions): its text is the description (plus the Foundry-only `append`), its automation is settings. */
export function featureSystem(c, resolve = s => s) {
  if (isAction(c)) throw new Error(`${c.name}: a Feature card has no versions`);
  const category = String(c.category).replace(/\s*\(Passive\)$/, "");
  const text = [boldHtml(foundryLinks(c.text ?? "")), c.foundry?.append ?? ""].filter(Boolean).join(" ");
  const sys = { category, level: c.level ?? c.foundry?.level ?? 0, description: text ? resolve(`<p>${text}</p>`) : "" };
  if (worthOf(c.name) && !c.structure) sys.worth = worthOf(c.name);   // v0.0.409: the ruler's worth is of the old card (not a Structure card)
  if (c.foundry?.settings) sys.settings = JSON.parse(resolve(JSON.stringify(c.foundry.settings)));
  if (c.foundry?.actions) sys.actions = c.foundry.actions.map(n => resolve(`{{action:${n}}}`));
  if (c.flavor) sys.flavor = c.flavor;
  for (const k of ["automation", "automationNote", "talents", "hooks"]) if (c.foundry?.[k] !== undefined) sys[k] = c.foundry[k];   // v0.0.409: hooks (hooks.mjs)
  if (/escalation/i.test(category) || c.foundry?.escalationPassive) sys.escalationPassive = true;
  if (c.structure && Number(c.escalation) > 0) sys.escalationRung = Number(c.escalation);   // v0.0.409: a Structure card's rung (2 / 4 / 6)
  return sys;
}

/** The item's system data of a Talent card (`talent` on the card: group, theme, prerequisites, choices as data). A Talent with Versions is also an Action
 *  (cardSystem) that the Talent grants; its description is then the Talent's own `talent.description`, not the Action's text. */
export function talentSystem(c, resolve = s => s) {
  const t = c.talent ?? {};
  const sys = { category: "Talent", level: c.level ?? c.foundry?.level ?? 1, group: t.group ?? "combat" };
  if (t.theme) sys.theme = t.theme;
  if (t.traits) sys.traits = t.traits.map(x => TRAIT_KEY[x] ?? x);
  if (t.prereqs) sys.prereqs = t.prereqs;
  if (t.prereqMode) sys.prereqMode = t.prereqMode;
  const text = isAction(c) ? (t.description ?? "") : [boldHtml(foundryLinks(c.text ?? "")), c.foundry?.append ?? ""].filter(Boolean).join(" ");
  if (text) sys.description = resolve(`<p>${text}</p>`);
  const actions = [...(isAction(c) ? [c.name] : []), ...(c.foundry?.actions ?? [])];
  if (actions.length) sys.actions = actions.map(n => resolve(`{{action:${n}}}`));
  if (t.modifiers) sys.modifiers = t.modifiers;
  if (t.choiceLabel) { sys.choiceLabel = t.choiceLabel; sys.choiceCount = t.choiceCount ?? 1; sys.choiceOptions = (t.choiceOptions ?? []).map(n => resolve(`{{action:${n}}}`)); }
  if (c.foundry?.settings) sys.settings = JSON.parse(resolve(JSON.stringify(c.foundry.settings)));
  if (c.flavor) sys.flavor = c.flavor;
  for (const k of ["automation", "automationNote"]) if (c.foundry?.[k] !== undefined) sys[k] = c.foundry[k];
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
  if (s.reaction) Object.assign(e, { reaction: true, reactionKind: s.reactionKind, trigger: s.trigger });   // pack R-core: Opportunity Attack, the basic Reaction
  for (const k of ["moment", "momentRange", "momentSelf", "momentTarget", "momentThreat"]) if (s[k] !== undefined) e[k] = s[k];   // v0.0.272 (pack RX): its moment
  e.flavor = c.flavor ?? "";
  e.versions = s.versions;
  if (s.automation) e.automation = s.automation;   // v0.0.418 (playtest 5, A5): the card's Bronze / Silver / Gold rating
  return e;
}
