// v0.0.185 (pack C2): the levels of a Class, as sections, and what the player can choose in each. No Foundry calls here: the class window,
// the Levels window, the Details tab and the tests all use these functions.
//
// class.system.levels = [ { sections: [section, ...] }, ... ]   (index 0 is level 1)
// section = { id, title, kind: "items" | "attr" | "repertoire" | "talent", mode: "granted" | "choice" (items only), pick,
//             items: [uuid] (items), pairs: [{ a, b }] (attr), freq (repertoire), category (talent: an optional Talent category) }
// info(uuid) -> { uuid, name, type, frequency, escalation } or null: what the functions need to know about an item.

export const SECTION_KINDS = { items: "Items I drop", attr: "Attribute increase", repertoire: "From the Repertoire", talent: "Talent" };
export const SECTION_FREQS = { any: "Any", passive: "Passive", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily" };
export const ATTR_KEYS = ["body", "mind", "appeal", "instinct"];
const ATTR_NAMES = { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" };

let seq = 0;
export const newSectionId = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;
export function newSection(kind = "items") {
  return { id: newSectionId(), title: kind === "attr" ? "Attribute increases" : kind === "talent" ? "Talent" : "New section", kind, mode: "choice", pick: 1, items: [],
    pairs: kind === "attr" ? [{ a: "body", b: "appeal" }] : [], freq: "any", category: "" };
}

export const sectionsAt = (cls, level) => cls?.levels?.[level - 1]?.sections ?? [];
export const isChoice = s => s.kind === "repertoire" || s.kind === "talent" || (s.kind === "items" && s.mode === "choice");
export const isGranted = s => s.kind === "items" && s.mode === "granted";

/** A Repertoire item's Frequency: a Feature (or Talent) is Passive; an Action has its own. */
export const freqOf = i => (!i ? "" : i.type === "action" ? (i.frequency || "") : "passive");

/** Everything a section offers before anything is taken away. talents: the Talents the character could take at this level (uuids). */
export function candidates(sec, cls, info, talents = []) {
  if (sec.kind === "items") return [...new Set(sec.items ?? [])];
  if (sec.kind === "repertoire") return [...new Set(cls.repertoire ?? [])].filter(u => sec.freq === "any" || !sec.freq || freqOf(info(u)) === sec.freq);
  if (sec.kind === "talent") {
    const cat = String(sec.category ?? "").trim().toLowerCase();
    return [...new Set(talents)].filter(u => !cat || String(info(u)?.category ?? "").toLowerCase().includes(cat));
  }
  return [];
}

/** The items Granted sections give at a level. */
export const grantedAt = (cls, level) => new Set(sectionsAt(cls, level).filter(isGranted).flatMap(s => s.items ?? []));

/**
 * The state of one level in the class window.
 *   owned: uuids the character has from before (granted and chosen at earlier levels, or from anywhere else)
 *   picks: { sectionId: [uuid] } chosen so far in this window (oldest first)
 *   attrs: { sectionId: [attrKey | null per pair] }
 *   priorAttrs: Attribute increases chosen at earlier levels (Distinct Choices)
 */
export function levelModel(cls, level, { owned = [], picks = {}, attrs = {}, priorAttrs = [], info = () => null, talents = [] } = {}) {
  const sections = sectionsAt(cls, level);
  const ownedSet = new Set(owned), granted = grantedAt(cls, level);
  const out = [];
  for (const s of sections) {
    if (s.kind === "attr") {
      const chosen = attrs[s.id] ?? [];
      const pairs = (s.pairs ?? []).map((p, i) => {
        const opts = [p.a, p.b].filter(Boolean);
        const free = opts.filter(k => !priorAttrs.includes(k));
        return { i, opts, free, chosen: chosen[i] ?? null };
      });
      const need = pairs.filter(p => p.free.length).length, made = pairs.filter(p => p.free.length && p.chosen).length;
      out.push({ s, kind: "attr", pairs, need, made, pill: made >= need ? "Chosen" : `Choose ${need}`, done: made >= need,
        sub: "One from each pair. These can't be changed later." });
      continue;
    }
    if (isGranted(s)) {
      out.push({ s, kind: "granted", list: [...new Set(s.items ?? [])], need: 0, made: 0, pill: "Granted", done: true, sub: "Yours at this level." });
      continue;
    }
    if (!isChoice(s)) continue;
    const cand = candidates(s, cls, info, talents);
    const elsewhere = new Set(sections.filter(o => o !== s && isChoice(o)).flatMap(o => picks[o.id] ?? []));
    const available = cand.filter(u => !ownedSet.has(u) && !granted.has(u) && !elsewhere.has(u));
    const chosen = (picks[s.id] ?? []).filter(u => available.includes(u));
    const need = Math.min(Math.max(0, s.pick ?? 1), available.length), made = Math.min(need, chosen.length);
    const pill = need === 0 ? "Complete" : made >= need ? "Chosen" : `${made} / ${need}`;
    const sub = s.kind === "repertoire" ? `Choose ${s.pick} from the Repertoire (${s.freq && s.freq !== "any" ? SECTION_FREQS[s.freq] : "any Frequency"}).`
      : s.kind === "talent" ? `Choose ${s.pick} Talent${s.pick === 1 ? "" : "s"}.` : `Choose ${s.pick}.`;
    out.push({ s, kind: "choice", list: available, chosen, need, made, pill, done: made >= need, empty: need === 0, sub });
  }
  const total = out.reduce((n, x) => n + x.need, 0), made = out.reduce((n, x) => n + x.made, 0);
  return { sections: out, total, made, complete: made >= total };
}

/** Choose or put back one item. Pick 1: another choice replaces it. Pick N: at most N, choosing past N drops the oldest. */
export function togglePick(picks, sec, uuid) {
  const cur = [...(picks[sec.id] ?? [])];
  const at = cur.indexOf(uuid);
  if (at >= 0) cur.splice(at, 1);
  else {
    const n = Math.max(1, sec.pick ?? 1);
    if (n === 1) cur.length = 0;
    cur.push(uuid);
    while (cur.length > n) cur.shift();
  }
  return { ...picks, [sec.id]: cur };
}

/**
 * Choose an Attribute for one pair. Distinct Choices (Chapter 5): an Attribute chosen at an earlier level can't be chosen; one chosen in
 * another pair of this level moves here (that pair is cleared and must be chosen again). Clicking the chosen one again puts it back.
 */
export function setAttr(attrs, sections, secId, pair, key, priorAttrs = []) {
  if (priorAttrs.includes(key)) return attrs;
  const next = Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, [...v]]));
  const mine = next[secId] ??= [];
  if (mine[pair] === key) { mine[pair] = null; return next; }
  for (const s of sections.filter(x => x.kind === "attr")) {
    const arr = next[s.id] ??= [];
    arr.forEach((v, i) => { if (v === key && !(s.id === secId && i === pair)) arr[i] = null; });
  }
  mine[pair] = key;
  return next;
}

/** The Attribute increases chosen, in section and pair order. */
export const attrList = (cls, level, attrs) => sectionsAt(cls, level).filter(s => s.kind === "attr").flatMap(s => (s.pairs ?? []).map((p, i) => attrs[s.id]?.[i]).filter(Boolean));

/** What a confirmed level gives: the items to add (each with its section) and the Attribute increases. */
export function levelPlan(cls, level, model) {
  const grant = [];
  for (const x of model.sections) {
    if (x.kind === "granted") for (const u of x.list) grant.push({ uuid: u, section: x.s.id, kind: x.s.kind, title: x.s.title });
    else if (x.kind === "choice") x.chosen.slice(0, x.need).forEach((u, n) => grant.push({ uuid: u, section: x.s.id, kind: x.s.kind, title: x.s.title, slot: n }));
  }
  return grant;
}

/** "Body or Appeal +1, Mind or Instinct +1": the Attribute increases of a level (read-only on the Details tab). */
export const attrLine = (cls, level = 1) => sectionsAt(cls, level).filter(s => s.kind === "attr").flatMap(s => s.pairs ?? []).map(p => `${ATTR_NAMES[p.a] ?? "?"} or ${ATTR_NAMES[p.b] ?? "?"} +1`).join(", ");

/** The other sections of the level that hold this item ("also in: ..." in the Levels window). */
export const alsoIn = (cls, level, sec, uuid) => sectionsAt(cls, level).filter(o => o !== sec && o.kind === "items" && (o.items ?? []).includes(uuid)).map(o => o.title);

/** Choices to make at a level for a new character (nothing owned yet but what earlier levels grant; Talent sections count their Pick). */
export function choicesToMake(cls, level, info = () => null) {
  const owned = [];
  for (let l = 1; l < level; l++) owned.push(...grantedAt(cls, l));
  const sections = sectionsAt(cls, level);
  const fake = sections.filter(s => s.kind === "talent").flatMap(s => Array.from({ length: Math.max(0, s.pick ?? 1) }, (_, i) => `talent:${s.id}:${i}`));
  return levelModel(cls, level, { owned, info, talents: fake }).total;
}

/** What the designer reads under a section: "Player sees: ..." or a warning. */
export function playerSees(cls, level, sec, info = () => null) {
  const nameOf = u => info(u)?.name ?? "(missing item)";
  if (sec.kind === "attr") return { text: (sec.pairs ?? []).map(p => `${ATTR_NAMES[p.a] ?? "?"} or ${ATTR_NAMES[p.b] ?? "?"} +1`).join(" · ") || "No pairs yet.", warn: !(sec.pairs ?? []).length };
  if (sec.kind === "talent") return { text: `Choose ${sec.pick} Talent${sec.pick === 1 ? "" : "s"}${sec.category ? ` (${sec.category})` : ""}`, warn: false };
  if (sec.kind === "repertoire") {
    const grantedAll = new Set((cls.levels ?? []).flatMap((l, i) => [...grantedAt(cls, i + 1)]));
    const k = candidates(sec, cls, info).filter(u => !grantedAll.has(u)).length;
    return { text: `Choose ${sec.pick} from the Repertoire (${sec.freq && sec.freq !== "any" ? SECTION_FREQS[sec.freq] : "any Frequency"}, ${k} available)`, warn: k < sec.pick };
  }
  const n = (sec.items ?? []).length;
  if (!n) return { text: "Empty: drop at least one item.", warn: true };
  if (sec.mode === "granted") return { text: `Granted: ${sec.items.map(nameOf).join(", ")}`, warn: false };
  if (sec.pick > n) return { text: `Choose ${sec.pick} but only ${n} item${n === 1 ? "" : "s"} to pick from.`, warn: true };
  return { text: `Choose ${sec.pick} of ${n}`, warn: false };
}

/** The Stage a level starts (5: Stage 2, 8: Stage 3), for the window's header. */
export const stageLine = level => level === 5 ? "Stage 2: your Weapon and Power Modifiers +1 (never above +4)." : level === 8 ? "Stage 3: your Weapon and Power Modifiers +2 (never above +4)." : "";
