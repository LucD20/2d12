// The two health views of the sheet's side panel (v0.0.130), pure so the tests can check them.
//   Donut (default): the circle is the whole Health Pool, cut into a Body slice and a Mind slice at the thresholds. Damage fills its own
//   slice (Lethal solid, Nonlethal darker); damage past a threshold spills into the other slice in a lighter color.
//   Classic: a Body bar and a Mind bar, each its own threshold; damage past one threshold shows striped in the other bar.
// Both say "X / pool damage" and "N to Down".

export const HEALTH_COLORS = {
  body: "#d0544b", bodyNl: "#8e342d", bodySpill: "#eba29c",
  mind: "#4a86e0", mindNl: "#28589f", mindSpill: "#8fb5ef",
  empty: "var(--np-empty, #3a4a62)", tick: "var(--np-tick, #ffffff)"   // follow the sheet's Light or Dark look
};

const num = v => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const f2 = n => Number(n.toFixed(2));

/** sys: { bdt, mdt, damage: { bodyLethal, bodyNonlethal, mindLethal, mindNonlethal } } */
export function healthView(sys) {
  const C = HEALTH_COLORS;
  const bdt = num(sys?.bdt), mdt = num(sys?.mdt), d = sys?.damage ?? {};
  const pool = Math.max(1, bdt + mdt);
  const bL = num(d.bodyLethal), bN = num(d.bodyNonlethal), mL = num(d.mindLethal), mN = num(d.mindNonlethal);
  const body = bL + bN, mind = mL + mN, dmg = body + mind;
  const bodyOver = Math.max(0, body - bdt), mindOver = Math.max(0, mind - mdt);
  // What each slice holds: its own Lethal, its own Nonlethal (both up to the threshold), then what spilled from the other one.
  const fill = (lethal, nonlethal, cap, spill) => {
    const l = Math.min(lethal, cap), n = Math.min(nonlethal, cap - l), s = Math.min(spill, cap - l - n);
    return { l, n, s, empty: cap - l - n - s };
  };
  const B = fill(bL, bN, bdt, mindOver), M = fill(mL, mN, mdt, bodyOver);

  // Donut: a conic gradient from the top, clockwise. A 1.5 degree white tick at the start of each slice.
  const deg = n => (n / pool) * 360;
  const stops = [];
  let at = 0;
  const slice = (parts, cap) => {
    const start = at, end = start + deg(cap);
    at = start + Math.min(1.5, end - start);
    stops.push(`${C.tick} ${f2(start)}deg ${f2(at)}deg`);
    let edge = start;
    for (const [color, n] of parts) { edge += deg(n); if (edge > at) { stops.push(`${color} ${f2(at)}deg ${f2(edge)}deg`); at = edge; } }
    at = end;
  };
  if (bdt) slice([[C.body, B.l], [C.bodyNl, B.n], [C.mindSpill, B.s], [C.empty, B.empty]], bdt);
  if (mdt) slice([[C.mind, M.l], [C.mindNl, M.n], [C.bodySpill, M.s], [C.empty, M.empty]], mdt);
  const gradient = stops.length ? `conic-gradient(${stops.join(", ")})` : C.empty;   // no thresholds yet (no class): an empty ring

  const legend = [
    { pool: "body", color: C.body, label: "Vigor", value: body, max: bdt },
    { pool: "mind", color: C.mind, label: "Resolve", value: mind, max: mdt }
  ];
  if (mindOver) legend.push({ color: C.mindSpill, label: "Resolve past its slice", value: mindOver });
  if (bodyOver) legend.push({ color: C.bodySpill, label: "Vigor past its slice", value: bodyOver });

  // Classic: each bar is its own threshold; the other pool's spill is striped at the end.
  const pct = (n, of) => f2(of ? Math.max(0, Math.min(100, (n / of) * 100)) : 0);
  const bar = (pool, label, value, max, f, color, nlColor, spillColor, badge) => ({
    pool, label, value, max, badge,
    segs: [{ cls: "l", w: pct(f.l, max), color }, { cls: "n", w: pct(f.n, max), color: nlColor }, { cls: "s", w: pct(f.s, max), color: spillColor }].filter(s => s.w > 0)
  });
  const bars = [
    bar("body", "Vigor", body, bdt, B, C.body, C.bodyNl, C.mind, body >= bdt && bdt > 0 ? "Bloodied" : ""),
    bar("mind", "Resolve", mind, mdt, M, C.mind, C.mindNl, C.body, mind >= mdt && mdt > 0 ? "Strained" : "")
  ];
  const states = bars.map(b => b.badge).filter(Boolean);
  return { pool, dmg, left: Math.max(0, pool - dmg), body, mind, bdt, mdt, bodyOver, mindOver, bodyDeg: f2(deg(bdt)), gradient, legend, bars, states };
}

/** Which slice of the donut a point is on: the angle from the top, clockwise, against where the Body slice ends. */
export function donutPoolAt(dx, dy, bodyDeg) {
  const a = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  return a < bodyDeg ? "body" : "mind";
}
