// SIM-4 (2026-11-12): a fight's log in the Encounter Log's playtest format, the one Foundry's Encounter Log copies ("OC - Charge 4, WA vs DP T3;
// Club vs DP T3. DP goes Down."), so a SIM fight and a table fight read the same. The format is the system's own (module/enclog.mjs exportText,
// creatureAbbrs): this file only turns the engine's events into the Encounter Log's lines.
globalThis.foundry ??= { utils: {}, applications: { api: {} } }; globalThis.game ??= { settings: { get: () => true } }; globalThis.CONFIG ??= {}; globalThis.Hooks ??= { on() {} };
const EL = await import(new URL("../../../foundry/twod12/module/enclog.mjs", import.meta.url).href);
const GR = await import(new URL("../../../foundry/twod12/module/gridrules.mjs", import.meta.url).href);
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** A creature's name for the table: "Paladin (Smite) 1" -> "Smite Paladin", "Standard 2" stays (its number makes the short name: S2 is "Standard2"). */
export const tableName = n => { const m = n.match(/^(\w+) \((.+)\) \d+$/); return m ? `${m[2]} ${m[1]}` : n; };
/** The engine's log as Encounter Log lines: [{ r, t, own, k, who, d }]. */
export function toEncounterLog(log) {
  const start = log[0], ref = Object.fromEntries(start.creatures.map((c, i) => [c.name, { id: `c${i}`, name: tableName(c.name) }])), out = [];
  let t = -1, own = null, r = 0, last = null;
  const push = (k, who, d) => { const e = { r, t: Math.max(0, t), own, k, who: ref[who] ?? null, d }; out.push(e); return e; };
  for (const e of log) {
    if (e.type === "round") { r = e.round; continue; }
    if (e.type === "turn") { t++; own = ref[e.who]; last = null; continue; }
    if (e.type === "move") { push("move", e.who, { mode: e.how, n: GR.gridDistance({ x: e.from[0], y: e.from[1] }, { x: e.to[0], y: e.to[1] }) }); last = null; }
    else if (e.type === "action") {
      const m = e.action.match(/^(.*) (\d)$/), name = m ? m[1] : e.action, tg = e.target ? { ...ref[e.target], tier: e.tier } : null;
      if (last && last.d.name === name && last.who === ref[e.who] && !e.linked && last.area) { if (tg) last.d.tg.push(tg); continue; }   // an Area: one Action, several targets
      last = push("act", e.who, { name, ap: e.ap, multiAp: !!m, tg: tg ? [tg] : [], save: e.save ? cap(e.save) : "", free: !!e.linked }); last.area = !e.linked;
    }
    else if (e.type === "attack") { push("act", e.who, { name: e.kind === "special" ? "Special" : "Basic attack", tg: [{ ...ref[e.target], tier: e.tier }] }); last = null; }
    else if (e.type === "reaction") { push("act", e.who, { name: e.reaction, react: true, tg: e.on ? [{ ...ref[e.on], tier: e.tier ?? null }] : [] }); last = null; }
    else if (e.type === "help" && e.amount) push("heal", e.target, { n: Math.round(e.amount), rp: /Rally Point/.test(e.what) ? 1 : 0 });
    else if (e.type === "collision") push("note", e.who, { text: `${ref[e.who].name} hits ${e.into === "a wall" ? "a wall" : ref[e.into].name} (${e.damage})` });
    else if (e.type === "hold") push("note", e.who, { text: "holds its place" });
    else if (e.type === "down" || e.type === "dead") push("down", e.who, {});
  }
  return { lines: out, creatures: Object.values(ref) };
}
/** The fight as the playtest text: the legend of short names, then each round's turns. */
export function playtestText(log, { short = true } = {}) { const { lines, creatures } = toEncounterLog(log); return EL.exportText(lines, { abbr: EL.creatureAbbrs(creatures), short }); }
