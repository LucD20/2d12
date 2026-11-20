// Pack TALENTS-PT (2026-11-20; book, Chapter 1, Halving and splitting damage): halving and splitting damage. Each damage type (and each pool,
// Lethal or Nonlethal) is halved on its own; a split rounds up for the first creature named and gives the rest to the other, so a split never makes
// more damage than there was. Bear the Blow (a Reaction whose setting momentSplit is "half") splits a held damage with its user before Guard: the
// user's part takes the user's Weakness and Guard but not its Resistance or Immunity; the rest goes to the ally with all of its own. Ricochet
// (bounce.mjs) sends half of the damage dealt to its target, before the target's Resistance, Weakness, Immunity and Guard.

const keyOf = c => `${c.pool || "B"}|${c.sub || ""}|${c.nl === undefined ? "" : c.nl ? "n" : "l"}`;

/** Pure: the damage components grouped by pool, type and Lethal / Nonlethal, each with its total (the factor first, rounded up, as the card's Half does). */
export function groupComps(comps, factor = 1) {
  const out = new Map();
  for (const c of comps ?? []) {
    const t = factor === 1 ? Number(c.total) || 0 : Math.ceil((Number(c.total) || 0) * factor);
    if (t <= 0) continue;
    const k = keyOf(c), g = out.get(k) ?? { pool: c.pool || "B", sub: c.sub || "", ...(c.nl === undefined ? {} : { nl: !!c.nl }), total: 0, kind: "D", formula: "", dice: [] };
    g.total += t; out.set(k, g);
  }
  return [...out.values()];
}
/** Pure: each group's half, rounded up: { first, rest } (first: rounded up; rest: what is left). Nothing is made or lost. */
export function splitComps(comps, factor = 1) {
  const first = [], rest = [];
  for (const g of groupComps(comps, factor)) {
    const a = Math.ceil(g.total / 2), b = g.total - a;
    if (a) first.push({ ...g, total: a, formula: `${a}` });
    if (b) rest.push({ ...g, total: b, formula: `${b}` });
  }
  return { first, rest };
}
/** Pure: half of each group, rounded up (Ricochet: the second creature takes half of the damage dealt). */
export const halveComps = (comps, factor = 1) => splitComps(comps, factor).first;
/** Pure: the held buckets { B: {l, n}, M: {l, n} } split, each bucket rounded up for the first: { first, rest } (when the components aren't known). */
export function splitBuckets(a) {
  const first = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 } }, rest = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 } };
  for (const p of ["B", "M"]) for (const k of ["l", "n"]) { const t = Number(a?.[p]?.[k]) || 0, h = Math.ceil(t / 2); first[p][k] = h; rest[p][k] = t - h; }
  return { first, rest };
}
/** Pure: the components' totals after Resist / Weak / Immune ({ B, M }: chatcards.mjs afterResist) as buckets, each pool keeping its Lethal and Nonlethal share. */
export function toBuckets(comps, after, nlDefault = false) {
  const share = p => { const all = (comps ?? []).filter(c => (c.pool === "M" ? "M" : "B") === p), tot = all.reduce((x, c) => x + (Number(c.total) || 0), 0), n = all.filter(c => c.nl ?? nlDefault).reduce((x, c) => x + (Number(c.total) || 0), 0); return tot ? n / tot : (nlDefault ? 1 : 0); };
  const cut = (v, p) => { const k = Math.round((Number(v) || 0) * share(p)); return { l: (Number(v) || 0) - k, n: k }; };
  return { B: cut(after?.B, "B"), M: cut(after?.M, "M") };
}
/** Pure: no Resistance and no Immunity, the creature's own Weakness (Bear the Blow: "your Resistance and Immunity don't reduce your part"). */
export const weakOnly = mods => ({ resist: {}, immune: [], weak: { ...(mods?.weak ?? {}) } });
const total = a => a.B.l + a.B.n + a.M.l + a.M.n;

/**
 * The held damage of `subject` is split with the Reaction's user (split: { actorUuid, by }). opts: the applyToActor options ({ comps, factor,
 * from, nl }: the card's components when it has them). `a` is changed in place to the subject's part; the user's part is applied to the user.
 * Returns { mine, theirs } (the totals before Guard) or null.
 */
export async function applySplit(subject, a, split, opts = {}) {
  let doc = null; try { doc = await fromUuid(split.actorUuid); } catch (e) { doc = null; }
  const user = doc?.documentName === "Actor" ? doc : doc?.actor ?? null;
  if (!user || user.uuid === subject.uuid) return null;
  let mine, theirs, how = "";
  if (opts.comps?.length) {
    const CC = await import("./chatcards.mjs"), { dmgModsOf } = await import("./ccdamage.mjs");
    const { first, rest } = splitComps(opts.comps, opts.factor ?? 1);
    theirs = toBuckets(rest, CC.afterResist(rest, dmgModsOf(subject)), !!opts.nl);
    mine = toBuckets(first, CC.afterResist(first, weakOnly(dmgModsOf(user))), !!opts.nl);
  } else {   // a damage with no components (an old card's Apply): the held buckets, already past the subject's Resistance
    const s = splitBuckets(a); mine = s.first; theirs = s.rest; how = " (split after the ally's Resistance: this damage has no types)";
  }
  a.B = theirs.B; a.M = theirs.M;
  const { sysLine } = await import("./sysmsg.mjs"), esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  try { await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: user }), content: sysLine("fa-people-arrows", `<b>${esc(split.by || "The Reaction")}</b>: <b>${esc(user.name)}</b> takes <b>${total(mine)}</b> of the damage (half, rounded up; no Resistance or Immunity on it), <b>${esc(subject.name)}</b> the other <b>${total(theirs)}</b>${how}.`, "fxm") }); } catch (e) { /* no line */ }
  if (total(mine) > 0) { const D = await import("./damage.mjs"); await D.applyToActor(user, mine, { announce: true, from: opts.from ?? null, shared: true }); }
  return { mine: total(mine), theirs: total(theirs) };
}
