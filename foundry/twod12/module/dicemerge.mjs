// v0.0.373 (STYLE-2, Lucas, 2026-11-13: "2d6 Holy + 1d6 Holy + 1d6 Holy reads 4d6 Holy"): dice of the same type are merged where damage is
// written. A rule of display, not of the roll: the dice are rolled as before. Pure (tests t250).

/** "[R] 2d6 Ho + 1d6 Ho + [V] 1[W] + [R] 1d6 Ho" -> "[R] 4d6 Ho + [V] 1[W]": per pool, terms "NdX" with the same die, the same "!" and the
 *  same damage type add up (in the place of the first); anything else stays as written, in its order. Pools keep the order they first appear in. */
export function mergeDiceLine(text) {
  const terms = String(text ?? "").split(/\s+\+\s+/).map(t => t.trim()).filter(Boolean);
  if (terms.length < 2) return String(text ?? "");
  const pools = new Map();
  let pool = "";
  for (let t of terms) {
    const tag = t.match(/^\[([A-Z])\]\s*/);
    if (tag) { pool = tag[1]; t = t.slice(tag[0].length); }
    if (!pools.has(pool)) pools.set(pool, []);
    const list = pools.get(pool), m = t.match(/^(\d+)d(\d+)(!?)(?:\s+([A-Z][a-z]))?$/);
    if (m) {
      const key = `${m[2]}|${m[3]}|${m[4] ?? ""}`, same = list.find(x => x.key === key);
      if (same) { same.n += Number(m[1]); continue; }
      list.push({ key, n: Number(m[1]), die: m[2], bang: m[3], sub: m[4] ?? "" });
    } else list.push({ text: t });
  }
  const term = x => (x.text ?? `${x.n}d${x.die}${x.bang}${x.sub ? ` ${x.sub}` : ""}`);
  return [...pools].map(([p, list]) => `${p ? `[${p}] ` : ""}${list.map(term).join(" + ")}`).join(" + ");
}

/** Names with a count: ["Smite", "Radiant Zeal", "Radiant Zeal"] -> "Smite, Radiant Zeal ×2". */
export function namesWithCount(names) {
  const n = new Map();
  for (const x of names) if (x) n.set(x, (n.get(x) ?? 0) + 1);
  return [...n].map(([k, c]) => (c > 1 ? `${k} ×${c}` : k)).join(", ");
}

/** The damage card's breakdown: one block per pool and damage type, with all its dice and modifiers, its sources named once each. */
export function mergeInstances(insts) {
  const out = [];
  for (const x of insts ?? []) {
    const same = out.find(o => o.pool === x.pool && o.sub === x.sub);
    if (!same) { out.push({ ...x, dice: [...(x.dice ?? [])], mods: [...(x.mods ?? [])], srcs: [x.src].filter(Boolean) }); continue; }
    same.dice.push(...(x.dice ?? []));
    same.mods.push(...(x.mods ?? []));
    same.total += Number(x.total) || 0;
    if (x.src) same.srcs.push(x.src);
  }
  return out.map(o => ({ ...o, src: namesWithCount(o.srcs) }));
}
