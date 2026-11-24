// v0.0.223 (Lucas: a full log for playtesting) & v0.0.488 (Core Rework I1 + Section R + Draw Steel Health Pressure %):
// The Encounter Log. Tracks every Action (with dice, Mod, Boons/Banes, DC, Tier, Critical 1d10! & damage type, card lines),
// movement, forced movement (including Pushed 0), raw vs reduced damage (with Guard/Reaction/Resist sources and protector credit),
// healing & Rally Points, Bloodied/Strained/Down thresholds, Reactions offered vs used/passed (including on Collision), and turn AP kept.
// Survives End Combat via automatic GM archiving (last 5 encounters) and a one-click Copy button on "The encounter ends".
import { unset } from "./util.mjs";
const F = "twod12", SOCKET = "system.twod12", FLAG = "enclog", LINES = "encl", ABBR = "enclogAbbr", SNAP = "encSnap", ARCHIVE = "encArchive";
const MAX_ARCHIVE = 5;

/**
 * v0.0.361 (PACK PERF, D28): one Combat flag key per line (flags.twod12.encl.<id>), so a new line sends only itself.
 * Pure: the lines, in order.
 */
export function logOf(combat) {
  const old = combat?.getFlag?.(F, FLAG), keyed = combat?.getFlag?.(F, LINES);
  const a = Array.isArray(old) ? old : [];
  const b = keyed && typeof keyed === "object" ? Object.values(keyed).filter(e => e && typeof e === "object") : [];
  return b.length ? [...a, ...b.sort((x, y) => (x.s ?? 0) - (y.s ?? 0))] : a;
}
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const idOf = uuid => { const p = String(uuid ?? "").split(".").filter(Boolean), k = p.lastIndexOf("Token"); return k >= 0 && p[k + 1] ? p[k + 1] : (p.pop() ?? ""); };
export const cleanCreatureName = n => String(n ?? "").replace(/\s*\([^()]*\)\s*$/, "").replace(/\s+\d+$/, "").trim();

/* ------------------------------------------------------------------ pure: names, abbreviations, unified creature list */
const SMALL = new Set(["of", "on", "the", "and", "a", "an", "to", "in", "&"]);
/** "Lay on Hands" -> "LoH", "Lock & Loose" -> "LnL", "Weapon Attack" -> "WA"; one word stays whole ("Cleaver"). */
export function actionAbbr(name) {
  const w = String(name ?? "").replace(/\(.*?\)/g, " ").trim().split(/\s+/).filter(Boolean);
  if (w.length <= 1) return w[0] ?? "";
  return w.map(x => (x === "&" ? "n" : SMALL.has(x.toLowerCase()) ? x[0].toLowerCase() : x[0].toUpperCase())).join("");
}
/** A creature's short name: "Dwarf Paladin" -> "DP", "Goblin Sneak" twice -> "GS1", "GS2"; one word stays whole ("Nari"). list: [{ id, name }]. */
export function creatureAbbrs(list, overrides = {}) {
  const base = c => { const w = cleanCreatureName(c.name).split(/\s+/).filter(Boolean); return w.length <= 1 ? (w[0] ?? "?") : w.map(x => x[0].toUpperCase()).join(""); };
  const counts = new Map(); for (const c of list) counts.set(base(c), (counts.get(base(c)) ?? 0) + 1);
  const seen = new Map(), out = {};
  for (const c of list) {
    const b = base(c), n = (seen.get(b) ?? 0) + 1; seen.set(b, n);
    out[c.id] = overrides[c.id] || (counts.get(b) > 1 ? `${b}${n}` : b);
  }
  return out;
}
/** Full names, numbered when two creatures share one ("Goblin Sneak 1", "Goblin Sneak 2"), in the list's order. Pure. */
export function fullNames(list) {
  const count = new Map(); for (const c of list) { const b = cleanCreatureName(c.name); count.set(b, (count.get(b) ?? 0) + 1); }
  const seen = new Map(), out = {};
  for (const c of list) { const b = cleanCreatureName(c.name); if ((count.get(b) ?? 0) < 2) continue; const n = (seen.get(b) ?? 0) + 1; seen.set(b, n); out[c.id] = `${b} ${n}`; }
  return out;
}

/**
 * v0.0.488: ONE canonical ordered creature list shared by Encounter Log and Damage Report (ordered by combat.turns
 * when available so Goblin Sneak 1 / 2 / 3 never disagree between log and damage table).
 */
export function unifiedCreatures(combat, overrides = null) {
  const turns = combat?.turns?.length ? [...combat.turns] : [...(combat?.combatants ?? [])];
  const snap = combat?.getFlag?.(F, SNAP) ?? {};
  const raw = [];
  const seenIds = new Set();
  for (const c of turns) {
    const id = c.tokenId ?? c.actorId ?? c.id ?? "";
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);
    const a = c.actor, sys = a?.system ?? {}, s = snap[id] ?? {};
    const disp = c.token?.disposition ?? a?.prototypeToken?.disposition ?? (a?.type === "character" ? 1 : -1);
    const side = s.side ?? (a?.type === "character" || disp === 1 ? "pc" : "npc");
    const maxHp = Number(s.maxHp ?? sys.pool) || 0;
    const dmgNow = (Number(sys.damage?.bodyLethal) || 0) + (Number(sys.damage?.bodyNonlethal) || 0) + (Number(sys.damage?.mindLethal) || 0) + (Number(sys.damage?.mindNonlethal) || 0);
    const startHp = Number.isFinite(s.startHp) ? s.startHp : Math.max(0, maxHp - dmgNow);
    raw.push({
      id,
      actorId: c.actorId ?? a?.id ?? "",
      actorUuid: a?.uuid ?? s.actorUuid ?? "",
      name: cleanCreatureName(c.token?.name ?? c.name ?? s.name ?? "?") || "?",
      side,
      disposition: disp,
      maxHp,
      vigMax: Number(s.vigMax ?? sys.bdt) || 0,
      resMax: Number(s.resMax ?? sys.mdt) || 0,
      startHp,
      liveHp: Math.max(0, maxHp - dmgNow)
    });
  }
  const ov = overrides ?? combat?.getFlag?.(F, ABBR) ?? {};
  const ab = creatureAbbrs(raw, ov), fn = fullNames(raw);
  return raw.map(c => ({ ...c, fullName: fn[c.id] ?? c.name, abbr: ab[c.id] ?? c.name }));
}

/* ------------------------------------------------------------------ pure: lines, turns, classic export */
/** Strip nested parenthetical actor build subtitles from condition labels ("Taunted (Durgan (Dwarf Paladin, Lay On Hands))" -> "Taunted (Durgan)"). */
export function cleanEffectName(name) {
  let s = String(name ?? "").trim(), prev;
  do { prev = s; s = s.replace(/\(([^()]*?)\s*\([^()]*\)\s*\)/g, "($1)"); } while (s !== prev);
  return s.replace(/\s{2,}/g, " ").trim();
}

export function lineText(e, nm = r => r?.name ?? "?", an = n => n) {
  if (e.txt) return e.txt;
  const d = e.d ?? {};
  switch (e.k) {
    case "act": {
      const tg = (d.tg ?? []).map(t => `${nm(t)}${t.tier != null && !d.save ? ` T${t.tier}${t.crit ? "!" : ""}` : ""}`);
      const vs = tg.length ? ` vs ${tg.join(", ")}${d.save ? ` (${d.save} Save)` : ""}` : "";
      return `${an(d.name)}${d.multiAp ? ` ${d.ap}${d.react ? "R" : "A"}` : ""}${vs}`;
    }
    case "move": return `${d.mode} ${d.n}`;
    case "push": return `${nm(d.target)} ${d.mode} ${d.n}${d.note ? ` (${d.note})` : ""}`;
    case "dmg": {
      const tgt = d.target ? nm(d.target) : nm(e.who);
      const red = d.reducedBy ? ` (raw ${d.raw ?? (Number(d.n) + Number(d.reducedBy))}${d.reducedNote ? `, ${cleanEffectName(d.reducedNote)}` : `, −${d.reducedBy}`})` : "";
      return `${tgt} takes ${d.text}${red}${d.ally ? " (ally)" : ""}`;
    }
    case "heal": return `${nm(d.target ?? e.who)} heals ${d.n}${d.rp ? ` (${d.rp} RP)` : ""}`;
    case "cond": return `${nm(e.who)}: ${cleanEffectName(d.name)}`;
    case "state": return `${nm(e.who)} becomes ${d.state}${d.by ? ` (${d.by})` : ""}${d.cardLine ? ` · ${d.cardLine}` : ""}`;
    case "rx": return `${nm(e.who)} ${d.outcome === "used" ? "uses" : d.outcome === "skipped" ? "skipped" : "passed"} ${an(d.action)}${d.trigger ? ` on ${d.trigger}` : ""}${d.detail ? ` (${d.detail})` : ""}`;
    case "turn": return `End of turn: AP ${d.apSpent ?? 0}/${d.apMax ?? 4}${d.apKept ? ` · kept ${d.apKept}${d.guard ? ` (+${d.guard} Guard)` : ""}` : ""}`;
    case "down": return `${nm(e.who)} goes Down`;
    case "up": return `${nm(e.who)} is back up`;
    case "note": return d.text ?? "";
    default: return "";
  }
}

export function turnsOf(log, { all = false } = {}) {
  const map = new Map();
  for (const e of log) {
    if (e.off && !all) continue;
    const key = `${e.r}:${e.t}`;
    if (!map.has(key)) map.set(key, { r: e.r, t: e.t, own: e.own, items: [] });
    map.get(key).items.push(e);
  }
  return [...map.values()].sort((a, b) => a.r - b.r || a.t - b.t);
}

export function turnText(turn, nm, an, { details = false } = {}) {
  const ownId = turn.own?.id;
  const parts = [], tail = [];
  for (const e of turn.items) {
    if (e.k === "turn") continue;
    if (["heal", "down", "up", "note"].includes(e.k) || (details && ["dmg", "cond", "state"].includes(e.k))) { tail.push(lineText(e, nm, an)); continue; }
    if (e.k === "rx") { if (details || e.d?.outcome === "used") tail.push(lineText(e, nm, an)); continue; }
    if (!["act", "move", "push"].includes(e.k)) continue;
    const mine = !e.who?.id || e.who.id === ownId;
    let txt = lineText(e, nm, an);
    if (!mine) txt = `${nm(e.who)} ${txt}`;
    const last = parts[parts.length - 1];
    if (e.k === "move" && last && last.k === "move" && last.mode === e.d.mode && last.mine === mine && !e.txt && (last.setup ?? "") === (e.d.setup ?? "")) { last.n += e.d.n; last.txt = `${mine ? "" : `${nm(e.who)} `}${e.d.mode} ${last.n}`; continue; }
    if (e.k === "move" && e.d.mode === "Charge" && last?.k === "act" && last.name === "Charge" && last.mine === mine) { last.txt = `${last.txt.replace(/Charge( 2A)?$/, "Charge")} ${e.d.n}`; last.k = "charge"; continue; }
    if (e.k === "act" && last?.k === "move" && last.setup && last.setup === e.d?.name && last.mine === mine) { parts.pop(); txt = `${txt} (Setup: ${last.mode} ${last.n})`; }
    const part = { k: e.k, mode: e.d?.mode, n: e.d?.n ?? 0, name: e.d?.name, mine, txt, free: !!e.d?.free, setup: e.d?.setup ?? "" };
    if (part.free && last) { last.txt += `, ${txt}`; continue; }
    parts.push(part);
  }
  const head = `${nm(turn.own)} - ${parts.map(p => p.txt).join("; ") || "(nothing)"}.`;
  return tail.length ? `${head} ${tail.join(". ")}.` : head;
}

export function exportText(log, { abbr = {}, short = true, details = false, full = {} } = {}) {
  const used = new Map(), usedAct = new Map();
  const nm = r => { if (!r) return "?"; const s = short ? (abbr[r.id] ?? r.name) : (full[r.id] ?? r.name); if (short && s !== r.name) used.set(s, full[r.id] ?? r.name); return s; };
  const taken = new Set(Object.values(abbr).flatMap(a => [a, String(a).replace(/\d+$/, "")]));
  const an = n => { let s = short ? actionAbbr(n) || n : n; if (taken.has(s)) s = n; if (short && s !== n) usedAct.set(s, n); return s; };
  const out = [];
  let round = null;
  for (const turn of turnsOf(log)) {
    if (turn.r !== round) { round = turn.r; out.push("", round > 0 ? `Round ${round}` : "Before the first round"); }
    out.push(turnText(turn, nm, an, { details }));
  }
  const legend = [...used].map(([s, n]) => `${s} - ${n}`).concat([...usedAct].map(([s, n]) => `${s} - ${n}`));
  return [...(legend.length ? [legend.join("\n")] : []), ...out].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ------------------------------------------------------------------ pure: v0.0.488 analytics (Health Pressure %, Offense, Matrix, Section R) */
export function g9DifficultyBand(pct) {
  if (pct < 20) return { label: "Trivial (<20%)", cls: "muted" };
  if (pct < 32) return { label: "Easy (~25%)", cls: "good" };
  if (pct <= 48) return { label: "Normal (35–45%)", cls: "gold" };
  if (pct <= 68) return { label: "Hard (55–65%)", cls: "warn" };
  return { label: "Deadly (>65%)", cls: "bad" };
}

/** Pure: compute full encounter telemetry from log entries and unified creature metadata. */
export function computeEncounterStats(log, creatures = []) {
  const active = (log ?? []).filter(e => !e.off);
  const rounds = Math.max(1, ...active.map(e => Number(e.r) || 0), 1);
  const byId = new Map(), byUuid = new Map(), byName = new Map();
  const makeRow = c => ({
    id: c.id, actorUuid: c.actorUuid ?? "", name: c.fullName ?? c.name ?? "?", abbr: c.abbr ?? c.name ?? "?",
    side: c.side ?? "npc", maxHp: Number(c.maxHp) || 0, startHp: Number.isFinite(c.startHp) ? c.startHp : (Number(c.maxHp) || 0),
    liveHp: Number.isFinite(c.liveHp) ? c.liveHp : null,
    rawTaken: 0, reducedTaken: 0, reducedNotes: [], selfAllyTaken: 0, adjust: 0,
    takenV: 0, takenR: 0, dealtV: 0, dealtR: 0, dealtAllies: 0, prevented: 0,
    healGiven: 0, healTaken: 0, rpSpent: 0,
    t1: 0, t2: 0, t3: 0, crit: 0, rolls: 0,
    rxUsed: 0, rxOff: 0, turnsCount: 0, apSpent: 0, apKept: 0, states: [],
    byRound: Object.fromEntries(Array.from({ length: rounds }, (_, i) => [i + 1, { dealt: 0, taken: 0, apS: 0, apK: 0 }]))
  });
  for (const c of creatures) {
    const row = makeRow(c);
    byId.set(c.id, row);
    if (c.actorUuid) byUuid.set(c.actorUuid, row);
    if (c.actorId) byUuid.set(c.actorId, row);
    byName.set(cleanCreatureName(c.name), row);
  }
  const find = ref => {
    if (!ref) return null;
    if (typeof ref === "string") return byId.get(ref) ?? byUuid.get(ref) ?? byName.get(cleanCreatureName(ref)) ?? null;
    return byId.get(ref.id) ?? byUuid.get(ref.actorUuid ?? ref.uuid) ?? byName.get(cleanCreatureName(ref.name)) ?? null;
  };
  const labelOf = ref => find(ref)?.name ?? ref?.name ?? "?";
  const sectionR = { crits: [], states: [], rxCollision: [], pushZero: [] };
  const turnSeen = new Set();

  for (const e of active) {
    const r = Math.max(1, Math.min(rounds, Number(e.r) || 1));
    const d = e.d ?? {};
    if (e.k === "turn") {
      const own = find(e.who ?? e.own);
      if (own) {
        const tk = `${r}:${e.t}:${own.id}`;
        if (!turnSeen.has(tk)) {
          turnSeen.add(tk);
          own.turnsCount++;
          own.apSpent += Number(d.apSpent) || 0;
          own.apKept += Number(d.apKept) || 0;
          own.byRound[r].apS += Number(d.apSpent) || 0;
          own.byRound[r].apK += Number(d.apKept) || 0;
        }
      }
      continue;
    }
    if (e.k === "act") {
      const src = find(e.who);
      if (src && !d.save) {
        for (const tg of d.tg ?? []) {
          if (tg.tier != null) {
            src.rolls++;
            if (tg.tier === 1) src.t1++;
            else if (tg.tier === 2) src.t2++;
            else if (tg.tier >= 3) src.t3++;
            if (tg.crit || d.roll?.crit) {
              src.crit++;
              sectionR.crits.push(`R${r} ${src.name} ${d.name} vs ${labelOf(tg)}${d.roll?.critDie ? `: ${d.roll.critDie}` : ""}${d.roll?.critType ? ` ${d.roll.critType}` : ""}`);
            }
          }
        }
      }
      if (d.cardLines?.length) {
        for (const cl of d.cardLines) sectionR.states.push(`R${r} ${labelOf(e.who)} ${d.name}: ${cl}`);
      }
      continue;
    }
    if (e.k === "dmg") {
      const dst = find(d.target ?? e.who);
      const src = d.origin ? find(d.origin) : null;
      const amtV = Number(d.v) || (d.pool === "R" ? 0 : (Number(d.n) || 0));
      const amtR = Number(d.r) || (d.pool === "R" ? (Number(d.n) || 0) : 0);
      const amt = amtV + amtR;
      const raw = Number.isFinite(d.raw) ? Number(d.raw) : amt;
      const red = Number.isFinite(d.reducedBy) ? Number(d.reducedBy) : Math.max(0, raw - amt);
      if (src) {
        if (d.ally) src.dealtAllies += amt;
        else { src.dealtV += amtV; src.dealtR += amtR; src.byRound[r].dealt += amt; }
      }
      if (dst) {
        if (d.manual) {
          dst.adjust += amt;
        } else if (d.ally) {
          dst.selfAllyTaken += amt;
        } else {
          dst.rawTaken += raw;
          dst.reducedTaken += red;
          if (d.reducedNote) dst.reducedNotes.push(`R${r}: ${d.reducedNote}`);
        }
        dst.takenV += amtV;
        dst.takenR += amtR;
        dst.byRound[r].taken += amt;
      }
      if (red > 0 && d.reducedSource) {
        const prot = find(d.reducedSource);
        if (prot) prot.prevented += red;
      }
      continue;
    }
    if (e.k === "heal") {
      const dst = find(d.target ?? e.who), src = d.origin ? find(d.origin) : null;
      const n = Number(d.n) || 0, rp = Number(d.rp) || 0;
      if (dst) { dst.healTaken += n; dst.rpSpent += rp; }
      if (src) src.healGiven += n;
      continue;
    }
    if (e.k === "rx") {
      const w = find(e.who);
      if (w) { w.rxOff++; if (d.outcome === "used") w.rxUsed++; }
      if (d.collision || /collision/i.test(String(d.trigger ?? ""))) {
        sectionR.rxCollision.push(`R${r} ${labelOf(e.who)} (${d.action}) → ${d.outcome}`);
      }
      continue;
    }
    if (e.k === "push" && Number(d.n) === 0) {
      sectionR.pushZero.push(`R${r} ${labelOf(e.who)} → ${labelOf(d.target)} Pushed 0${d.note ? ` (${d.note})` : ""}`);
      continue;
    }
    if (e.k === "state" || e.k === "down") {
      const w = find(e.who), st = e.k === "down" ? "Down" : (d.state ?? "");
      if (w && st) {
        const tag = `${st} R${r}`;
        if (!w.states.includes(tag)) w.states.push(tag);
      }
      if (st) sectionR.states.push(`R${r} ${labelOf(e.who)} → ${st}${d.by ? ` (${d.by})` : ""}${d.cardLine ? ` · ${d.cardLine}` : ""}`);
    }
  }

  const rows = [...byId.values()];
  for (const s of rows) {
    s.netTaken = s.takenV + s.takenR;
    s.currentHp = s.liveHp != null ? s.liveHp : Math.min(s.maxHp, Math.max(0, s.startHp - s.netTaken + s.healTaken));
    s.takenPct = s.maxHp > 0 ? (s.netTaken / s.maxHp) * 100 : 0;
    s.attemptedPct = s.maxHp > 0 ? (s.rawTaken / s.maxHp) * 100 : 0;
  }
  const pcs = rows.filter(x => x.side === "pc"), npcs = rows.filter(x => x.side !== "pc");
  const sumGroup = grp => {
    const raw = grp.reduce((a, x) => a + x.rawTaken, 0), red = grp.reduce((a, x) => a + x.reducedTaken, 0);
    const sa = grp.reduce((a, x) => a + x.selfAllyTaken, 0), adj = grp.reduce((a, x) => a + x.adjust, 0);
    const nv = grp.reduce((a, x) => a + x.takenV, 0), nr = grp.reduce((a, x) => a + x.takenR, 0), net = grp.reduce((a, x) => a + x.netTaken, 0);
    const maxHp = grp.reduce((a, x) => a + x.maxHp, 0), heal = grp.reduce((a, x) => a + x.healTaken, 0);
    const rp = grp.reduce((a, x) => a + x.rpSpent, 0), currentHp = grp.reduce((a, x) => a + x.currentHp, 0);
    const dealt = grp.reduce((a, x) => a + x.dealtV + x.dealtR, 0);
    return {
      raw, red, sa, adj, nv, nr, net, maxHp, heal, rp, currentHp, dealt,
      takenPct: maxHp > 0 ? (net / maxHp) * 100 : 0,
      attemptedPct: maxHp > 0 ? (raw / maxHp) * 100 : 0
    };
  };
  const party = sumGroup(pcs), enemies = sumGroup(npcs);
  return { rounds, rows, pcs, npcs, party, enemies, g9: g9DifficultyBand(party.takenPct), sectionR };
}

/** Pure: Markdown Analysis Bundle (default Copy for Analysis). */
export function exportAnalysis(log, creatures = [], { title = "Encounter", outcome = "", includePassedRx = true } = {}) {
  const st = computeEncounterStats(log, creatures);
  const byId = Object.fromEntries(creatures.map(c => [c.id, c]));
  const nm = r => byId[r?.id]?.abbr ?? byId[r?.id]?.fullName ?? r?.name ?? "?";
  const lines = [];
  lines.push(`# 2d12 Encounter Report — ${title} (${st.rounds} ${st.rounds === 1 ? "round" : "rounds"}${outcome ? ` · ${outcome}` : ""})`);
  lines.push(`**Party Health Cost:** ${st.party.net}/${st.party.maxHp} HP (**${Math.round(st.party.takenPct)}%** taken vs **${Math.round(st.party.attemptedPct)}%** attempted · ${st.party.red} prevented · ${st.g9.label})`);

  lines.push("", "## Incoming Damage & Health Pressure (% of Max HP)");
  lines.push("| Creature | Raw | Reduced | Self/Ally | Adjust | Net ([V]/[R]) | Max HP | Heal (RP) | Current | Taken % | Attempted % |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  const hRow = c => `| ${c.name} | ${c.rawTaken} | ${c.reducedTaken} | ${c.selfAllyTaken} | ${c.adjust} | ${c.netTaken} (${c.takenV}/${c.takenR}) | ${c.maxHp} | ${c.healTaken} (${c.rpSpent}) | ${c.currentHp} | **${Math.round(c.takenPct)}%** | ${Math.round(c.attemptedPct)}% |`;
  for (const c of st.pcs) lines.push(hRow(c));
  if (st.pcs.length) lines.push(`| **Party Total** | **${st.party.raw}** | **${st.party.red}** | **${st.party.sa}** | **${st.party.adj}** | **${st.party.net} (${st.party.nv}/${st.party.nr})** | **${st.party.maxHp}** | **${st.party.heal} (${st.party.rp})** | **${st.party.currentHp}** | **${Math.round(st.party.takenPct)}%** | **${Math.round(st.party.attemptedPct)}%** |`);
  for (const c of st.npcs) lines.push(hRow(c));

  lines.push("", "## Offense, Mitigation & Rolls");
  lines.push("| Creature | Dealt ([V]/[R]) | /Rd | Allies | Prevented | Heal Given | T1/T2/T3/Crit | Rx Used/Off | AP Kept | States |");
  lines.push("|---|---:|---:|---:|---:|---:|:---:|:---:|---:|---|");
  for (const c of [...st.pcs, ...st.npcs]) {
    const tot = c.dealtV + c.dealtR;
    lines.push(`| ${c.name} | ${tot} (${c.dealtV}/${c.dealtR}) | ${(tot / st.rounds).toFixed(1)} | ${c.dealtAllies || "—"} | ${c.prevented || "—"} | ${c.healGiven || "—"} | ${c.rolls ? `${c.t1}/${c.t2}/${c.t3}/${c.crit}` : "—"} | ${c.rxOff ? `${c.rxUsed}/${c.rxOff}` : "—"} | ${c.apKept} | ${c.states.join(", ") || "—"} |`);
  }

  lines.push("", "## Turn-by-Turn Log");
  let lastR = null;
  for (const turn of turnsOf(log)) {
    if (turn.r !== lastR) { lastR = turn.r; lines.push("", `### Round ${turn.r}`); }
    const turnMeta = turn.items.find(x => x.k === "turn")?.d;
    const rxActKeys = new Set();
    for (const x of turn.items) {
      if (x.k === "act" && x.d?.react) {
        const aname = String(x.d?.name ?? "").toLowerCase();
        if (x.who?.id) rxActKeys.add(`${x.who.id}|${aname}`);
        rxActKeys.add(`${nm(x.who).toLowerCase()}|${aname}`);
      }
    }
    const parts = [];
    for (const e of turn.items) {
      if (e.k === "turn") continue;
      const d = e.d ?? {};
      const offTurn = !!(e.who?.id && turn.own?.id && e.who.id !== turn.own.id);
      if (e.k === "act") {
        let s = lineText(e, nm, n => n);
        if (d.react) s = `${nm(e.who)} Rx ${s}`;
        else if (offTurn) s = `${nm(e.who)} ${s}`;
        if (d.roll?.dice?.length) s += ` [${d.roll.dice.join(",")}${d.roll.mod >= 0 ? `+${d.roll.mod}` : d.roll.mod}${d.roll.netBB ? ` ${d.roll.netBB}` : ""} = ${d.roll.total}/${d.roll.dc}${d.roll.critDie ? `; Crit ${d.roll.critDie} ${d.roll.critType ?? ""}` : ""}]`;
        if (d.cardLines?.length) s += ` {${d.cardLines.join("; ")}}`;
        parts.push(s);
      } else if (e.k === "rx") {
        const aname = String(d.action ?? "").toLowerCase();
        const dup = (e.who?.id && rxActKeys.has(`${e.who.id}|${aname}`)) || rxActKeys.has(`${nm(e.who).toLowerCase()}|${aname}`);
        if (d.outcome === "used") {
          if (!dup) parts.push(`${nm(e.who)} Rx ${d.action}${d.detail ? ` (${d.detail})` : ""}`);
        } else if (includePassedRx) parts.push(`[Rx ${d.outcome}: ${nm(e.who)} ${d.action}]`);
      } else if (e.k === "move" && offTurn) {
        parts.push(`${nm(e.who)} ${lineText(e, nm, n => n)}`);
      } else {
        parts.push(lineText(e, nm, n => n));
      }
    }
    const apTag = turnMeta ? ` [AP ${turnMeta.apSpent}/${turnMeta.apMax}${turnMeta.apKept ? `, kept ${turnMeta.apKept}` : ""}]` : "";
    lines.push(`- ${nm(turn.own)}${apTag}: ${parts.join("; ") || "(nothing)"}.`);
  }

  const sr = st.sectionR;
  if (sr.crits.length || sr.states.length || sr.rxCollision.length || sr.pushZero.length) {
    lines.push("", "## Core Rework Watchlist (Section R)");
    if (sr.crits.length) lines.push(`- **Crits:** ${sr.crits.join("; ")}`);
    if (sr.states.length) lines.push(`- **States & Lines:** ${sr.states.join("; ")}`);
    if (sr.rxCollision.length) lines.push(`- **Reactions on Collision:** ${sr.rxCollision.join("; ")}`);
    if (sr.pushZero.length) lines.push(`- **Pushed 0:** ${sr.pushZero.join("; ")}`);
  }
  return lines.join("\n").trim();
}

export function exportJson(log, creatures = [], { title = "Encounter", outcome = "" } = {}) {
  const st = computeEncounterStats(log, creatures);
  return JSON.stringify({
    version: game?.system?.version ?? "0.0.488",
    title, outcome, rounds: st.rounds,
    party: st.party, enemies: st.enemies, g9: st.g9.label,
    creatures: st.rows,
    sectionR: st.sectionR,
    log: (log ?? []).filter(e => !e.off)
  }, null, 2);
}

/* ------------------------------------------------------------------ writing & archive (GM writes; players send) */
let chain = Promise.resolve();
const newId = () => (globalThis.foundry?.utils?.randomID?.() ?? Math.random().toString(36).slice(2, 12));
let seq = 0;

export function logUpdate(log, op, hadArray = false, now = Date.now()) {
  const P = `flags.${F}.${LINES}`, upd = {};
  if (hadArray) { log.forEach((e, k) => { upd[`${P}.${e.id}`] = { ...e, s: e.s ?? k }; }); Object.assign(upd, unset(`flags.${F}.${FLAG}`)); }
  const patch = (e, ch) => { if (upd[`${P}.${e.id}`]) Object.assign(upd[`${P}.${e.id}`], ch); else for (const [k, v] of Object.entries(ch)) upd[`${P}.${e.id}.${k}`] = v; };
  if (op.type === "add") { seq = Math.max(seq + 1, now); upd[`${P}.${op.entry.id}`] = { ...op.entry, s: seq }; }
  else if (op.type === "patch") { const e = log.find(x => x.id === op.id); if (e) patch(e, op.changes); }
  else if (op.type === "voidTurn") for (const e of log) { if (e.r === op.r && e.t === op.t && !e.off) patch(e, { off: true, why: op.why ?? "" }); }
  else if (op.type === "voidLast") { const e = [...log].reverse().find(x => x.r === op.r && x.t === op.t && !x.off && x.k === "act" && x.who?.id === op.who && x.d?.name === op.name); if (e) patch(e, { off: true, why: op.why ?? "" }); }
  return Object.keys(upd).length ? upd : null;
}

async function apply(combat, op) {
  const old = combat.getFlag(F, FLAG), hadArray = Array.isArray(old) && old.length > 0;
  const upd = logUpdate(logOf(combat), op, hadArray);
  if (upd) await combat.update(upd);
}
function send(op, combat = game.combat) {
  if (typeof combat?.getFlag !== "function") return;
  if (game.user.isActiveGM || (game.user.isGM && !game.users.activeGM)) { chain = chain.then(() => apply(combat, op)).catch(e => console.warn("twod12 | encounter log", e)); return chain; }
  game.socket.emit(SOCKET, { type: "encLog", combatId: combat.id, op });
}
export function registerEncLogSocket() {
  game.socket.on(SOCKET, data => {
    if (data?.type !== "encLog" || !game.user.isActiveGM) return;
    const combat = game.combats.get(data.combatId);
    if (combat) chain = chain.then(() => apply(combat, data.op)).catch(e => console.warn("twod12 | encounter log", e));
  });
}

export const refOf = (actorOrToken, name = null) => {
  const a = actorOrToken?.actor ?? actorOrToken, tok = actorOrToken?.document ?? actorOrToken?.token ?? a?.token ?? a?.getActiveTokens?.()[0]?.document ?? null;
  return { id: tok?.id ?? a?.id ?? "", actorUuid: a?.uuid ?? "", name: name ?? cleanCreatureName(tok?.name ?? a?.name ?? "?") };
};

export function logLine(k, who, d = {}, id = null) {
  const combat = game.combat;
  if (!combat?.started) return;
  const cur = combat.combatant;
  const entry = { id: id || newId(), r: combat.round, t: combat.turn, own: { id: cur?.tokenId ?? cur?.actorId ?? "", name: cleanCreatureName(cur?.token?.name ?? cur?.name ?? "") }, k, who, d };
  return send({ type: "add", entry }, combat);
}

/** An Action was used: name, AP, targets with tier/crit, Save, free, Reaction, plus optional roll math & triggered card lines. */
export function logAction(actor, item, { ap = 0, targets = [], save = "", free = false, roll = null, cardLines = null } = {}) {
  const multiAp = new Set((item?.system?.versions ?? []).map(v => v.ap)).size > 1;
  const payload = {
    name: item?.name ?? "?", ap, multiAp,
    tg: targets.map(t => ({ id: idOf(t.uuid) || t.id || "", name: cleanCreatureName(t.name), tier: t.tier ?? null, ...(t.crit ? { crit: true } : {}) })),
    save, free, react: !!item?.system?.reaction
  };
  if (roll) payload.roll = roll;
  if (cardLines?.length) payload.cardLines = cardLines;
  logLine("act", refOf(actor), payload);
}
export const logMove = (actor, mode, n, setup = "") => { if (!(n > 0)) return ""; const id = newId(); logLine("move", refOf(actor), { mode, n: Math.round(n * 100) / 100, ...(setup ? { setup } : {}) }, id); return id; };
export const logPush = (origin, target, mode, n, note = "") => logLine("push", refOf(origin), { target: refOf(target), mode, n, note });
export const voidTurn = (combat, r, t, why) => send({ type: "voidTurn", r, t, why }, combat);
export const voidLastAction = (actor, name, why) => { const c = game.combat; if (c?.started) send({ type: "voidLast", r: c.round, t: c.turn, who: refOf(actor).id, name, why }, c); };
export const patchLine = (id, changes) => send({ type: "patch", id, changes });

/** Deduplication window so card-applied damage doesn't also trigger a duplicate updateActor line. */
const recentCardDmg = new Map();
export function noteCardDamageApplied(actorUuid) {
  if (actorUuid) recentCardDmg.set(actorUuid, Date.now());
}

/** v0.0.488: rich card-damage entry (raw, net Vigor/Resolve, reducedBy, protector source, ally flag, collision). Returns the entry id for Undo voiding. */
export async function logDamageCard({ origin = null, target = null, v = 0, r = 0, raw = null, reducedBy = 0, reducedSource = null, reducedNote = "", ally = false, collision = false, note = "" } = {}) {
  const n = (Number(v) || 0) + (Number(r) || 0);
  if (n <= 0 && !(Number(raw) > 0)) return "";
  const tgtRef = refOf(target);
  if (tgtRef.actorUuid) noteCardDamageApplied(tgtRef.actorUuid);
  const parts = [];
  if (v > 0) parts.push(`${v} Vigor`);
  if (r > 0) parts.push(`${r} Resolve`);
  const text = parts.join(", ") || "0 damage";
  if (!game.combat?.started) return "";
  const id = newId();
  await logLine("dmg", tgtRef, {
    n, v: Number(v) || 0, r: Number(r) || 0,
    pool: r > 0 && !v ? "R" : "V",
    text,
    raw: Number.isFinite(raw) ? Number(raw) : n + (Number(reducedBy) || 0),
    reducedBy: Number(reducedBy) || 0,
    ...(reducedSource ? { reducedSource: refOf(reducedSource) } : {}),
    ...(reducedNote ? { reducedNote } : {}),
    ...(origin ? { origin: refOf(origin) } : {}),
    ...(ally ? { ally: true } : {}),
    ...(collision ? { collision: true } : {}),
    ...(note ? { note } : {})
  }, id);
  return id;
}

/** v0.0.488: log every offered Reaction row (used, passed, or skipped) when a Reactions stack finishes. */
export function logReactionMoment(st) {
  if (!game.combat?.started || !st?.rows?.length) return;
  const trig = String(st.label ?? st.base?.text ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const collision = /collision/i.test(trig);
  for (const row of st.rows) {
    const outcome = row.state === "use" ? "used" : row.state === "skip" ? "skipped" : "passed";
    const who = { id: idOf(row.actorUuid) || row.actorId || "", actorUuid: row.actorUuid ?? "", name: cleanCreatureName(row.name) };
    const detail = outcome === "used"
      ? (row.out?.blocked ? `reduced ${row.out.blocked}` : row.out?.tier ? `T${row.out.tier}${row.out.crit ? "!" : ""}` : row.out?.spent ? "spent" : "")
      : "";
    logLine("rx", who, { action: row.itemName ?? "Reaction", trigger: trig, outcome, ...(detail ? { detail } : {}), ...(collision ? { collision: true } : {}) });
  }
}

/** v0.0.488: log Bloodied / Strained / Down / Up state transitions with source pool and optional card line. */
export function logStateChange(actor, state, { by = "", cardLine = "" } = {}) {
  logLine("state", refOf(actor), { state, ...(by ? { by } : {}), ...(cardLine ? { cardLine } : {}) });
}

/** v0.0.488: log turn-end AP telemetry (spent, max, kept, Guard gained, Strikes). */
export function logTurnEnd(combat, combatant, { apSpent = 0, apMax = 4, apKept = 0, guard = 0, strikes = 0 } = {}) {
  if (!combat?.started || !combatant) return;
  const who = { id: combatant.tokenId ?? combatant.actorId ?? "", actorUuid: combatant.actor?.uuid ?? "", name: cleanCreatureName(combatant.token?.name ?? combatant.name) };
  logLine("turn", who, { apSpent, apMax, apKept, guard, strikes });
}

/** v0.0.488: snapshot each combatant's Max HP and Starting HP when combat starts (or reinforcements join). */
export async function snapshotCombat(combat) {
  if (!game.user?.isActiveGM || !combat) return;
  const curSnap = foundry.utils.deepClone(combat.getFlag?.(F, SNAP) ?? {});
  let changed = false;
  for (const c of combat.combatants ?? []) {
    const id = c.tokenId ?? c.actorId ?? c.id;
    if (!id || curSnap[id]) continue;
    const a = c.actor, sys = a?.system ?? {};
    const maxHp = Number(sys.pool) || 0;
    const dmg = (Number(sys.damage?.bodyLethal) || 0) + (Number(sys.damage?.bodyNonlethal) || 0) + (Number(sys.damage?.mindLethal) || 0) + (Number(sys.damage?.mindNonlethal) || 0);
    const disp = c.token?.disposition ?? a?.prototypeToken?.disposition ?? (a?.type === "character" ? 1 : -1);
    curSnap[id] = {
      name: cleanCreatureName(c.token?.name ?? c.name ?? "?"),
      actorUuid: a?.uuid ?? "",
      side: a?.type === "character" || disp === 1 ? "pc" : "npc",
      maxHp, vigMax: Number(sys.bdt) || 0, resMax: Number(sys.mdt) || 0,
      startHp: Math.max(0, maxHp - dmg)
    };
    changed = true;
  }
  if (changed) { try { await combat.setFlag(F, SNAP, curSnap); } catch (e) { console.warn("twod12 | encSnap", e); } }
}

/** v0.0.488: archive finished combat (last 5) in GM world setting so End Combat never loses the log. Serialized to avoid concurrent deleteCombat races. */
let archiveChain = Promise.resolve();
export function archivedEncounters() {
  try { const a = game.settings.get(F, ARCHIVE); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
export function archiveCombat(combat, outcome = "") {
  if (!game.user?.isActiveGM || !combat?.started) return Promise.resolve(null);
  const log = logOf(combat);
  if (!log.length) return Promise.resolve(null);
  const creatures = unifiedCreatures(combat);
  const foes = creatures.filter(c => c.side !== "pc").map(c => c.name);
  const uniqFoes = [...new Set(foes)].slice(0, 3).join(", ");
  const id = combat.id || newId();
  const baseEntry = {
    id, savedAt: Date.now(),
    label: uniqFoes ? `vs ${uniqFoes}` : `Combat (${combat.round ?? 1} rd)`,
    outcome, rounds: Math.max(1, Number(combat.round) || 1), creatures, log
  };
  const task = archiveChain.then(async () => {
    const existing = archivedEncounters().find(x => x.id === id);
    const entry = { ...baseEntry, outcome: outcome || existing?.outcome || "" };
    const next = [entry, ...archivedEncounters().filter(x => x.id !== id)].slice(0, MAX_ARCHIVE);
    try { await game.settings.set(F, ARCHIVE, next); } catch (e) { console.warn("twod12 | archive encounter", e); }
    return entry;
  });
  archiveChain = task.catch(() => {});
  return task;
}
export function updateArchiveOutcome(combatId, outcome) {
  if (!game.user?.isActiveGM || !combatId || !outcome) return Promise.resolve();
  const task = archiveChain.then(async () => {
    const list = archivedEncounters();
    const idx = list.findIndex(x => x.id === combatId);
    if (idx < 0) return;
    const next = foundry.utils.deepClone(list);
    next[idx].outcome = outcome;
    try { await game.settings.set(F, ARCHIVE, next); } catch (e) { console.warn("twod12 | archive outcome", e); }
  });
  archiveChain = task.catch(() => {});
  return task;
}
export async function copyEncounterReport(combatOrArchive, { fmt = "analysis" } = {}) {
  const isArch = combatOrArchive && Array.isArray(combatOrArchive.log);
  const log = isArch ? combatOrArchive.log : logOf(combatOrArchive);
  const creatures = isArch ? (combatOrArchive.creatures ?? []) : unifiedCreatures(combatOrArchive);
  const title = isArch ? combatOrArchive.label : "Active Combat";
  const outcome = isArch ? (combatOrArchive.outcome ?? "") : "";
  let text = "";
  if (fmt === "json") text = exportJson(log, creatures, { title, outcome });
  else if (fmt === "short") {
    const abbr = Object.fromEntries(creatures.map(c => [c.id, c.abbr]));
    const full = Object.fromEntries(creatures.map(c => [c.id, c.fullName]));
    text = exportText(log, { abbr, short: true, details: false, full });
  } else text = exportAnalysis(log, creatures, { title, outcome });
  try {
    await (game.clipboard?.copyPlainText?.(text) ?? navigator.clipboard.writeText(text));
    ui.notifications?.info?.(fmt === "analysis" ? "Encounter analysis report copied." : fmt === "json" ? "Encounter JSON copied." : "Encounter log copied.");
  } catch (e) {
    console.log(text);
    ui.notifications?.warn?.("Could not copy: the log is in the console (F12).");
  }
  return text;
}

/* ------------------------------------------------------------------ automatic hooks: manual damage, healing, Bloodied/Strained/Down, conditions */
export function registerEncLogHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options) => {
    options.twod12LogDmg = foundry.utils.deepClone(actor.system?.damage ?? {});
    options.twod12LogRally = actor.system?.rallyUsed ?? 0;
    options.twod12LogDown = !!actor.system?.atZero;
    options.twod12LogBl = !!actor.system?.bloodied;
    options.twod12LogSt = !!actor.system?.strained;
  });
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    try {
      if (userId !== game.user.id || !game.combat?.started || !options?.twod12LogDmg || options.twod12Reset || !["character", "npc"].includes(actor.type)) return;
      const old = options.twod12LogDmg, now = actor.system?.damage ?? {};
      const KEYS = [["bodyLethal", "Vigor"], ["bodyNonlethal", "Vigor Nonlethal"], ["mindLethal", "Resolve"], ["mindNonlethal", "Resolve Nonlethal"]];
      const up = KEYS.map(([k, l]) => [(Number(now[k]) || 0) - (Number(old[k]) || 0), l]);
      const vUp = Math.max(0, up[0][0]) + Math.max(0, up[1][0]);
      const rUp = Math.max(0, up[2][0]) + Math.max(0, up[3][0]);
      const dealt = up.filter(([n]) => n > 0), healed = -up.filter(([n]) => n < 0).reduce((s, [n]) => s + n, 0);
      const fromCard = !!options.twod12CardDmg || Date.now() - (recentCardDmg.get(actor.uuid) ?? 0) < 900;
      if (dealt.length && !fromCard) {
        logLine("dmg", refOf(actor), { n: dealt.reduce((s, [n]) => s + n, 0), v: vUp, r: rUp, pool: rUp > 0 && !vUp ? "R" : "V", text: dealt.map(([n, l]) => `${n} ${l}`).join(", "), manual: true });
      }
      if (healed > 0) logLine("heal", refOf(actor), { n: healed, rp: Math.max(0, (actor.system?.rallyUsed ?? 0) - (options.twod12LogRally ?? 0)) });
      const bl = !!actor.system?.bloodied, st = !!actor.system?.strained, down = !!actor.system?.atZero;
      const byPool = vUp && rUp ? "[V]+[R]" : rUp ? "[R]" : vUp ? "[V]" : "";
      if (bl && !options.twod12LogBl) logStateChange(actor, "Bloodied", { by: byPool || "[V]" });
      if (st && !options.twod12LogSt) logStateChange(actor, "Strained", { by: byPool || "[R]" });
      if (down && !options.twod12LogDown) logLine("down", refOf(actor));
      if (!down && options.twod12LogDown) logLine("up", refOf(actor));
    } catch (e) { console.warn("twod12 | encounter log (actor)", e); }
  });
  Hooks.on("createActiveEffect", (effect, options, userId) => {
    try {
      const actor = effect.parent;
      if (userId !== game.user.id || !game.combat?.started || actor?.documentName !== "Actor" || effect.getFlag?.(F, "rider") || options?.twod12Reset) return;
      const dur = effect.getFlag?.(F, "duration")?.type === "eot" ? " (EoT)" : "";
      logLine("cond", refOf(actor), { name: `${cleanEffectName(effect.name)}${dur}` });
    } catch (e) { console.warn("twod12 | encounter log (effect)", e); }
  });
}

/* ------------------------------------------------------------------ the STYLE-3 window */
const { ApplicationV2 } = foundry.applications?.api ?? {};
const ICON = { act: "fa-dice", move: "fa-shoe-prints", push: "fa-hand", dmg: "fa-heart-crack", heal: "fa-heart-pulse", cond: "fa-triangle-exclamation", state: "fa-bolt", rx: "fa-shield", turn: "fa-flag-checkered", down: "fa-skull", up: "fa-person-rays", note: "fa-note-sticky" };

export class EncounterLog extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { id: "twod12-encounter-log", window: { title: "Encounter Log", icon: "fa-solid fa-book-open", resizable: true }, position: { width: 860, height: 680 }, classes: ["twod12", "enclog-app"] };
  tab = "summary";
  metric = "taken";
  fmt = "analysis";
  sourceId = "live";
  creatureFilter = "all";
  includePassedRx = true;
  show = { rollMath: true, dmg: true, states: true, rx: true, cond: true, off: true };

  _resolveSource() {
    const live = game.combat, arch = archivedEncounters();
    if (this.sourceId !== "live") {
      const hit = arch.find(x => x.id === this.sourceId);
      if (hit) return { isLive: false, title: hit.label, outcome: hit.outcome ?? "", log: hit.log ?? [], creatures: hit.creatures ?? [], archive: hit };
    }
    if (live) return { isLive: true, title: "Active Combat", outcome: "", log: logOf(live), creatures: unifiedCreatures(live), combat: live };
    if (arch.length) {
      const hit = arch[0];
      return { isLive: false, title: hit.label, outcome: hit.outcome ?? "", log: hit.log ?? [], creatures: hit.creatures ?? [], archive: hit };
    }
    return null;
  }

  async _renderHTML() {
    const div = document.createElement("div");
    div.className = "enclog";
    const arch = archivedEncounters();
    const src = this._resolveSource();
    if (!src) {
      div.innerHTML = '<div class="el-empty"><p>No active combat or archived encounter yet.</p><p class="el-hint">Start a combat to record rolls, Health Pressure %, Reactions, and States. Finished fights are automatically archived here.</p></div>';
      return div;
    }
    const { log, creatures, isLive } = src;
    const st = computeEncounterStats(log, creatures);
    const ab = Object.fromEntries(creatures.map(c => [c.id, c.abbr]));
    const fn = Object.fromEntries(creatures.map(c => [c.id, c.fullName]));
    const nm = r => esc(fn[r?.id] ?? r?.name ?? "?");

    const srcOpts = [
      ...(game.combat ? [`<option value="live"${isLive ? " selected" : ""}>Active Combat (Round ${game.combat.round ?? 0})</option>`] : []),
      ...arch.map((a, i) => `<option value="${esc(a.id)}"${!isLive && src.archive?.id === a.id ? " selected" : ""}>Archive #${i + 1}: ${esc(a.label)} (${a.rounds} rd${a.outcome ? ` · ${esc(a.outcome)}` : ""})</option>`)
    ].join("");

    const topBar = `<div class="el-top">
      <div class="el-top-l">
        <select class="el-sel" data-el-src aria-label="Select encounter">${srcOpts}</select>
        <span class="el-g9 is-${st.g9.cls}">Party: ${Math.round(st.party.takenPct)}% HP · ${esc(st.g9.label)}</span>
      </div>
      <div class="el-top-r">
        <button type="button" class="el-btn primary" data-el="copy-analysis"><i class="fa-solid fa-copy" aria-hidden="true"></i> Copy for Analysis</button>
        <button type="button" class="el-btn" data-el="copy-short">Copy Short</button>
      </div>
    </div>`;

    const tabs = `<div class="el-tabs" role="tablist">
      <button type="button" class="el-tab${this.tab === "summary" ? " on" : ""}" data-tab="summary">Summary &amp; Health %</button>
      <button type="button" class="el-tab${this.tab === "log" ? " on" : ""}" data-tab="log">Turn Log</button>
      <button type="button" class="el-tab${this.tab === "matrix" ? " on" : ""}" data-tab="matrix">Per-Round</button>
      <button type="button" class="el-tab${this.tab === "export" ? " on" : ""}" data-tab="export">Export</button>
      <span class="el-tabmeta">${st.rounds} ${st.rounds === 1 ? "Round" : "Rounds"} · ${creatures.length} creatures</span>
    </div>`;

    let body = "";
    if (this.tab === "summary") {
      const rxUsed = st.rows.reduce((a, x) => a + x.rxUsed, 0), rxOff = st.rows.reduce((a, x) => a + x.rxOff, 0);
      const mitPct = st.party.raw ? Math.round((st.party.red / st.party.raw) * 100) : 0;
      const kpis = `<div class="el-kpis">
        <div class="el-kpi"><div class="el-kl">Party Net Taken %</div><div class="el-kv">${Math.round(st.party.takenPct)}%</div><div class="el-ks">${st.party.net} / ${st.party.maxHp} Max HP · Attempted ${Math.round(st.party.attemptedPct)}%</div></div>
        <div class="el-kpi"><div class="el-kl">Mitigation Absorbed</div><div class="el-kv">${st.party.red} HP</div><div class="el-ks">${mitPct}% of raw enemy damage prevented</div></div>
        <div class="el-kpi"><div class="el-kl">PC Output / Round</div><div class="el-kv">${(st.party.dealt / st.rounds).toFixed(1)}</div><div class="el-ks">${st.party.dealt} total · ${(st.party.dealt / st.rounds / Math.max(1, st.pcs.length)).toFixed(1)} / PC-turn</div></div>
        <div class="el-kpi"><div class="el-kl">Reactions Used / Off</div><div class="el-kv">${rxUsed} / ${rxOff}</div><div class="el-ks">${rxOff ? Math.round((rxUsed / rxOff) * 100) : 0}% used · ${st.party.rp} RP healed</div></div>
      </div>`;

      const hRow = c => {
        const startTag = c.startHp < c.maxHp ? ` <span class="el-mut">(start ${c.startHp})</span>` : "";
        const takenCls = c.takenPct >= 60 ? " bad" : c.takenPct >= 35 ? " gold" : "";
        return `<tr>
          <td class="el-nm"><i class="el-dot ${c.side}"></i>${esc(c.name)}</td>
          <td class="c">${c.rawTaken || "—"}</td>
          <td class="c${c.reducedTaken ? " good" : " mut"}">${c.reducedTaken || "—"}</td>
          <td class="c${c.selfAllyTaken ? " gold" : " mut"}">${c.selfAllyTaken || "—"}</td>
          <td class="c mut">${c.adjust || "—"}</td>
          <td class="c"><b>${c.netTaken}</b> <span class="el-mut">(${c.takenV}/${c.takenR})</span></td>
          <td class="c">${c.maxHp || "—"}${startTag}</td>
          <td class="c">${c.healTaken ? `${c.healTaken} <span class="el-mut">(${c.rpSpent})</span>` : "—"}</td>
          <td class="c${c.currentHp <= 0 && c.maxHp ? " bad" : ""}">${c.maxHp ? c.currentHp : "—"}</td>
          <td class="c b${takenCls}">${c.maxHp ? `${Math.round(c.takenPct)}%` : "—"}</td>
          <td class="c mut">${c.maxHp ? `${Math.round(c.attemptedPct)}%` : "—"}</td>
          <td class="el-pcol"><div class="el-pbar"><span class="el-patt" style="width:${Math.min(100, c.attemptedPct)}%"></span><span class="el-ptak ${c.side}" style="width:${Math.min(100, c.takenPct)}%"></span></div></td>
        </tr>`;
      };
      const subRow = (label, g) => `<tr class="subrow">
        <td>${label}</td><td class="c">${g.raw}</td><td class="c good">${g.red || "—"}</td><td class="c">${g.sa || "—"}</td><td class="c">${g.adj || "—"}</td>
        <td class="c">${g.net} <span class="el-mut">(${g.nv}/${g.nr})</span></td><td class="c">${g.maxHp}</td>
        <td class="c">${g.heal ? `${g.heal} (${g.rp})` : "—"}</td><td class="c">${g.currentHp}</td>
        <td class="c gold">${Math.round(g.takenPct)}%</td><td class="c mut">${Math.round(g.attemptedPct)}%</td>
        <td class="el-pcol"><div class="el-pbar"><span class="el-patt" style="width:${Math.min(100, g.attemptedPct)}%"></span><span class="el-ptak tot" style="width:${Math.min(100, g.takenPct)}%"></span></div></td>
      </tr>`;

      const healthTbl = `<div class="el-sec">
        <div class="el-shd"><span>Incoming Damage &amp; Health Pressure (% of Max HP)</span><small>G9 targets: Easy ~25% · Normal 35–45% · Hard 55–65%</small></div>
        <div class="el-tblwrap"><table class="el-tbl"><thead><tr>
          <th>Creature</th><th class="c">Raw</th><th class="c">Reduced</th><th class="c">Self/Ally</th><th class="c">Adjust</th>
          <th class="c">Net ([V]/[R])</th><th class="c">Max HP</th><th class="c">Heal (RP)</th><th class="c">Current</th>
          <th class="c">Taken %</th><th class="c">Attempted %</th><th>HP Bar</th>
        </tr></thead><tbody>
          ${st.pcs.map(hRow).join("")}${st.pcs.length ? subRow("Party Total", st.party) : ""}
          ${st.npcs.map(hRow).join("")}${st.npcs.length ? subRow("Enemies Total", st.enemies) : ""}
        </tbody></table></div></div>`;

      const tierBar = (label, grp) => {
        const t1 = grp.reduce((a, x) => a + x.t1, 0), t2 = grp.reduce((a, x) => a + x.t2, 0), t3 = grp.reduce((a, x) => a + x.t3, 0), cr = grp.reduce((a, x) => a + x.crit, 0);
        const tot = Math.max(1, t1 + t2 + t3), p = n => Math.round((n / tot) * 100);
        return `<div class="el-tbar"><div class="el-tbh"><b>${label} Attack Rolls (${t1 + t2 + t3})</b><span>T1 ${p(t1)}% · T2 ${p(t2)}% · T3 ${p(t3)}% · <b class="gold">${cr} Crit</b></span></div>
          <div class="el-ttrack"><i class="t1" style="width:${p(t1)}%"></i><i class="t2" style="width:${p(t2)}%"></i><i class="t3" style="width:${p(t3)}%"></i></div></div>`;
      };

      const offRow = c => {
        const tot = c.dealtV + c.dealtR;
        return `<tr>
          <td class="el-nm"><i class="el-dot ${c.side}"></i>${esc(c.name)} <span class="el-mut">(${esc(c.abbr)})</span></td>
          <td class="c"><b>${tot}</b> <span class="el-mut">(${c.dealtV}/${c.dealtR})</span></td>
          <td class="c">${(tot / st.rounds).toFixed(1)}</td>
          <td class="c${c.dealtAllies ? " gold" : " mut"}">${c.dealtAllies || "—"}</td>
          <td class="c${c.prevented ? " good" : " mut"}">${c.prevented || "—"}</td>
          <td class="c">${c.healGiven || "—"}</td>
          <td class="c">${c.rolls ? `${c.t1}/${c.t2}/${c.t3}/${c.crit}` : "—"}</td>
          <td class="c">${c.rxOff ? `${c.rxUsed}/${c.rxOff}` : "—"}</td>
          <td class="c">${c.turnsCount ? c.apKept : "—"}</td>
          <td class="el-mut">${esc(c.states.join(", ")) || "—"}</td>
        </tr>`;
      };
      const offTbl = `<div class="el-sec">
        <div class="el-shd"><span>Offense, Mitigation &amp; Rolls</span><small>Prevented credits the protector (Shield of Faith, Judge)</small></div>
        <div class="el-tblwrap"><table class="el-tbl"><thead><tr>
          <th>Creature</th><th class="c">Dealt ([V]/[R])</th><th class="c">/Rd</th><th class="c">Allies</th><th class="c">Prevented</th>
          <th class="c">Heal Given</th><th class="c">T1/T2/T3/Crit</th><th class="c">Rx Used/Off</th><th class="c">AP Kept</th><th>States</th>
        </tr></thead><tbody>${[...st.pcs, ...st.npcs].map(offRow).join("")}</tbody></table></div></div>`;

      const sr = st.sectionR;
      const watch = `<div class="el-watch"><div class="el-wt">Core Rework Watchlist (Section R)</div><div class="el-wg">
        <div><b>Criticals (1d10!):</b> <span>${esc(sr.crits.join(" · ")) || "None"}</span></div>
        <div><b>States &amp; Lines:</b> <span>${esc(sr.states.join(" · ")) || "None"}</span></div>
        <div><b>Reactions on Collision:</b> <span>${esc(sr.rxCollision.join(" · ")) || "None"}</span></div>
        <div><b>Pushed 0:</b> <span>${esc(sr.pushZero.join(" · ")) || "None"}</span></div>
      </div></div>`;

      body = `<div class="el-pane">${kpis}${healthTbl}<div class="el-tbars">${tierBar("Heroes", st.pcs)}${tierBar("Enemies", st.npcs)}</div>${offTbl}${watch}</div>`;
    } else if (this.tab === "log") {
      const cfOpts = `<option value="all">All creatures</option>${creatures.map(c => `<option value="${esc(c.id)}"${this.creatureFilter === c.id ? " selected" : ""}>${esc(c.fullName)} (${esc(c.abbr)})</option>`).join("")}`;
      const fbar = `<div class="el-fbar">
        <label><input type="checkbox" data-show="rollMath" ${this.show.rollMath ? "checked" : ""}> Roll math</label>
        <label><input type="checkbox" data-show="dmg" ${this.show.dmg ? "checked" : ""}> Damage</label>
        <label><input type="checkbox" data-show="states" ${this.show.states ? "checked" : ""}> States</label>
        <label><input type="checkbox" data-show="rx" ${this.show.rx ? "checked" : ""}> Reactions</label>
        <label><input type="checkbox" data-show="cond" ${this.show.cond ? "checked" : ""}> Conditions</label>
        <label><input type="checkbox" data-show="off" ${this.show.off ? "checked" : ""}> Removed</label>
        <select class="el-sel sm" data-el-cf aria-label="Filter by creature">${cfOpts}</select>
      </div>`;
      const rows = [];
      let round = null;
      for (const turn of turnsOf(log, { all: true })) {
        const items = turn.items.filter(e => {
          if (e.k === "turn") return false;
          if (!this.show.dmg && e.k === "dmg") return false;
          if (!this.show.cond && e.k === "cond") return false;
          if (!this.show.states && e.k === "state") return false;
          if (!this.show.rx && e.k === "rx") return false;
          if (!this.show.off && e.off) return false;
          if (this.creatureFilter !== "all") {
            const ids = [turn.own?.id, e.who?.id, e.d?.target?.id, ...(e.d?.tg ?? []).map(x => x.id)];
            if (!ids.includes(this.creatureFilter)) return false;
          }
          return true;
        });
        if (this.creatureFilter !== "all" && !items.length && turn.own?.id !== this.creatureFilter) continue;
        if (turn.r !== round) { round = turn.r; rows.push(`<h3 class="el-round">${round > 0 ? `Round ${round}` : "Before the first round"}</h3>`); }
        const turnMeta = turn.items.find(x => x.k === "turn")?.d;
        const apChip = turnMeta ? `<span class="el-apchip">AP ${turnMeta.apSpent}/${turnMeta.apMax}${turnMeta.apKept ? ` · kept ${turnMeta.apKept}` : ""}</span>` : "";
        const lines = items.map(e => {
          const who = e.who?.id && e.who.id !== turn.own?.id && !["dmg", "heal", "cond", "down", "up", "note", "state", "rx"].includes(e.k) ? `<b>${nm(e.who)}</b> ` : "";
          const rollSub = this.show.rollMath && e.k === "act" && e.d?.roll?.dice?.length
            ? `<div class="el-sub">[${e.d.roll.dice.join(", ")}] ${e.d.roll.mod >= 0 ? `+${e.d.roll.mod}` : e.d.roll.mod}${e.d.roll.netBB ? ` · ${esc(e.d.roll.netBB)}` : ""} = <b>${e.d.roll.total}</b> vs ${e.d.roll.dc}${e.d.roll.def ? ` ${esc(e.d.roll.def)}` : ""}${e.d.roll.critDie ? ` · <b class="gold">Crit ${esc(e.d.roll.critDie)} ${esc(e.d.roll.critType ?? "")}</b>` : ""}</div>`
            : "";
          const ctrls = isLive ? `<a data-el="edit" aria-label="Edit the text"><i class="fa-solid fa-pen-to-square"></i></a><a data-el="${e.off ? "restore" : "remove"}" aria-label="${e.off ? "Put it back" : "Remove (a misclick)"}"><i class="fa-solid ${e.off ? "fa-rotate-left" : "fa-xmark"}"></i></a>` : "";
          return `<div class="el-line k-${e.k}${e.off ? " off" : ""}" data-id="${e.id}"${e.why ? ` data-tooltip="${esc(e.why)}"` : ""}><i class="fa-solid ${ICON[e.k] ?? "fa-circle"}"></i><div class="el-txt">${who}${esc(lineText(e, r => fn[r?.id] ?? r?.name ?? "?"))}${e.txt ? ' <i class="fa-solid fa-pen el-edited" aria-label="Edited by hand"></i>' : ""}${rollSub}</div>${ctrls}</div>`;
        }).join("");
        const noteBtn = isLive ? `<a data-el="note" aria-label="Add a note to this turn"><i class="fa-solid fa-plus"></i> note</a>` : "";
        rows.push(`<div class="el-turn" data-r="${turn.r}" data-t="${turn.t}"><div class="el-own"><b>${nm(turn.own)}</b> <span class="el-ab">(${esc(ab[turn.own?.id] ?? "")})</span>${apChip}${noteBtn}</div>${lines || '<div class="el-line empty">(nothing)</div>'}</div>`);
      }
      const abbrBox = isLive ? `<details class="el-abbr"><summary>Short names</summary><div class="el-abgrid">${creatures.map(c => `<label>${esc(c.fullName)} <input type="text" data-abbr="${esc(c.id)}" value="${esc(c.abbr)}"></label>`).join("")}</div></details>` : "";
      body = `${fbar}${abbrBox}<div class="el-body">${rows.join("") || '<p class="el-hint">Nothing logged yet.</p>'}</div>`;
    } else if (this.tab === "matrix") {
      const rNums = Array.from({ length: st.rounds }, (_, i) => i + 1);
      const mRow = c => {
        if (this.metric === "ap") return `<tr><td class="el-nm">${esc(c.name)}</td>${rNums.map(r => `<td class="c">${c.byRound[r].apS}/${c.byRound[r].apK}</td>`).join("")}<td class="c b">${c.apSpent}/${c.apKept}</td><td class="c">${c.turnsCount ? (c.apKept / c.turnsCount).toFixed(1) : "—"}</td></tr>`;
        const vals = rNums.map(r => this.metric === "dealt" ? c.byRound[r].dealt : c.byRound[r].taken);
        const tot = vals.reduce((a, b) => a + b, 0);
        const tail = this.metric === "taken" ? (c.maxHp ? `<b>${Math.round(c.takenPct)}%</b> <span class="el-mut">(att ${Math.round(c.attemptedPct)}%)</span>` : "—") : (tot / st.rounds).toFixed(1);
        return `<tr><td class="el-nm">${esc(c.name)}</td>${vals.map(v => `<td class="c${v ? "" : " mut"}">${v || "—"}</td>`).join("")}<td class="c b">${tot}</td><td class="c">${tail}</td></tr>`;
      };
      body = `<div class="el-pane"><div class="el-shd"><span>Per-Creature × Round Matrix</span><div class="el-seg">
        <button type="button" class="el-btn sm${this.metric === "taken" ? " primary" : ""}" data-metric="taken">Taken (% HP)</button>
        <button type="button" class="el-btn sm${this.metric === "dealt" ? " primary" : ""}" data-metric="dealt">Dealt</button>
        <button type="button" class="el-btn sm${this.metric === "ap" ? " primary" : ""}" data-metric="ap">AP Spent/Kept</button>
      </div></div>
      <div class="el-tblwrap"><table class="el-tbl"><thead><tr><th>Creature</th>${rNums.map(r => `<th class="c">R${r}</th>`).join("")}<th class="c">Total</th><th class="c">${this.metric === "taken" ? "% Max HP" : "Avg / Rd"}</th></tr></thead>
      <tbody>${[...st.pcs, ...st.npcs].map(mRow).join("")}</tbody></table></div></div>`;
    } else {
      const preview = this.fmt === "json"
        ? exportJson(log, creatures, { title: src.title, outcome: src.outcome })
        : this.fmt === "short"
          ? exportText(log, { abbr: ab, short: true, details: false, full: fn })
          : exportAnalysis(log, creatures, { title: src.title, outcome: src.outcome, includePassedRx: this.includePassedRx });
      body = `<div class="el-pane"><div class="el-shd"><div class="el-seg">
        <button type="button" class="el-btn sm${this.fmt === "analysis" ? " primary" : ""}" data-fmt="analysis">Analysis Bundle</button>
        <button type="button" class="el-btn sm${this.fmt === "short" ? " primary" : ""}" data-fmt="short">Classic Short</button>
        <button type="button" class="el-btn sm${this.fmt === "json" ? " primary" : ""}" data-fmt="json">JSON</button>
      </div><div class="el-expctl">
        <label><input type="checkbox" data-el-opt="includePassedRx" ${this.includePassedRx ? "checked" : ""}> Passed Reactions</label>
        <button type="button" class="el-btn sm primary" data-el="copy-current"><i class="fa-solid fa-copy" aria-hidden="true"></i> Copy</button>
      </div></div><pre class="el-pre">${esc(preview)}</pre></div>`;
    }

    div.innerHTML = `${topBar}${tabs}${body}`;
    return div;
  }

  _replaceHTML(result, content) {
    const body = content.querySelector(".el-body"), keep = body ? body.scrollTop : null, atEnd = body ? body.scrollTop + body.clientHeight >= body.scrollHeight - 8 : true;
    content.replaceChildren(result);
    const nb = content.querySelector(".el-body");
    if (nb) nb.scrollTop = atEnd ? nb.scrollHeight : keep ?? 0;
  }

  _onRender() {
    const root = this.element;
    root.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { this.tab = b.dataset.tab; this.render(); }));
    root.querySelectorAll("[data-metric]").forEach(b => b.addEventListener("click", () => { this.metric = b.dataset.metric; this.render(); }));
    root.querySelectorAll("[data-fmt]").forEach(b => b.addEventListener("click", () => { this.fmt = b.dataset.fmt; this.render(); }));
    root.querySelector("[data-el-src]")?.addEventListener("change", ev => { this.sourceId = ev.target.value; this.creatureFilter = "all"; this.render(); });
    root.querySelector("[data-el-cf]")?.addEventListener("change", ev => { this.creatureFilter = ev.target.value; this.render(); });
    root.querySelectorAll("[data-el]").forEach(b => b.addEventListener("click", ev => { ev.preventDefault(); this._act(b); }));
    root.querySelectorAll("[data-show]").forEach(b => b.addEventListener("change", () => { this.show[b.dataset.show] = b.checked; this.render(); }));
    root.querySelectorAll("[data-el-opt]").forEach(b => b.addEventListener("change", () => { this[b.dataset.elOpt] = b.checked; this.render(); }));
    root.querySelectorAll("[data-abbr]").forEach(b => b.addEventListener("change", async () => {
      const all = foundry.utils.deepClone(game.combat?.getFlag(F, ABBR) ?? {}); all[b.dataset.abbr] = b.value.trim(); await game.combat?.setFlag(F, ABBR, all);
    }));
  }

  async _act(b) {
    const src = this._resolveSource();
    if (!src) return;
    const id = b.closest("[data-id]")?.dataset.id, what = b.dataset.el;
    if (what === "copy-analysis") return copyEncounterReport(src.isLive ? src.combat : src.archive, { fmt: "analysis" });
    if (what === "copy-short") return copyEncounterReport(src.isLive ? src.combat : src.archive, { fmt: "short" });
    if (what === "copy-current") return copyEncounterReport(src.isLive ? src.combat : src.archive, { fmt: this.fmt });
    const combat = game.combat;
    if (!combat || !src.isLive) return;
    if (what === "remove" && id) return patchLine(id, { off: true, why: "Removed by hand" });
    if (what === "restore" && id) return patchLine(id, { off: false, why: "" });
    if (what === "edit" && id) {
      const e = logOf(combat).find(x => x.id === id);
      const res = await (await import("./pickwindow.mjs")).pickInput({ title: "Edit the line", name: "Edit the line", icon: "fa-pen", text: "Empty: back to the logged text.", confirm: "Save", fields: [{ key: "t", label: "Line", value: e ? lineText(e) : "" }] });
      if (res && res.t != null) return patchLine(id, { txt: String(res.t).trim() });
      return;
    }
    if (what === "note") {
      const turn = b.closest(".el-turn"), r = Number(turn.dataset.r), t = Number(turn.dataset.t);
      const res = await (await import("./pickwindow.mjs")).pickInput({ title: "Add a note", name: "Add a note", icon: "fa-note-sticky", confirm: "Add", fields: [{ key: "t", label: "Note", value: "", placeholder: "DP chose to keep fighting" }] });
      const val = res?.t ?? "";
      if (!val?.trim()) return;
      const own = logOf(combat).find(x => x.r === r && x.t === t)?.own ?? { id: "", name: "" };
      return send({ type: "add", entry: { id: newId(), r, t, own, k: "note", who: null, d: { text: val.trim() } } }, combat);
    }
  }
}

const openWin = () => foundry.applications.instances?.get?.("twod12-encounter-log") ?? null;
let lastToggle = 0;
export function toggleEncounterLog() {
  if (Date.now() - lastToggle < 500) return;
  lastToggle = Date.now();
  const w = openWin();
  if (w?.rendered) { w.close(); return; }
  new EncounterLog().render({ force: true });
}
export function registerEncounterLog() {
  try {
    game.settings.register(F, ARCHIVE, { name: "Archived Encounter Logs", scope: "world", config: false, type: Array, default: [] });
  } catch (e) { /* already registered or test */ }
  registerEncLogSocket();
  registerEncLogHooks();
  Hooks.on("combatStart", combat => { snapshotCombat(combat).catch(e => console.warn("twod12 | encSnap", e)); });
  Hooks.on("createCombatant", c => { if (c?.parent?.started) snapshotCombat(c.parent).catch(e => console.warn("twod12 | encSnap", e)); });
  Hooks.on("deleteCombat", combat => { archiveCombat(combat).catch(e => console.warn("twod12 | archive", e)); });
  for (const h of ["updateCombat", "deleteCombat", "createCombat"]) Hooks.on(h, () => { const w = openWin(); if (w?.rendered) w.render(); });
}
