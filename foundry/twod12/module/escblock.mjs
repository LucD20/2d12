// The Granted area and the Escalation block (v0.0.194, Lucas; mockup foundry/mockups/granted-C2-ladder.html), above the Actions and
// Favorites tabs' lists. This file builds their data; actor-sheets.mjs renders it with the sheet's own Action rows.
//   Granted: one ticket per granted use (an effect's Grant setting: Double Shot, Pinning Shot, Twin Shot): uses left, cost, source and
//     duration, what it adds (different targets, Boons, the source's Bonus Damage and riders).
//   Escalation: a ladder of rungs 3, 2, 1. Each rung lists the Escalation Passives whose threshold is that number (Active, Ready, Used,
//     greyed below it) and the Escalation Actions whose cost is that number (greyed when they can't be paid or their Frequency is used).
import { passiveSources } from "./passives.mjs";
import { escalationOf } from "./escalation.mjs";
import { onceKey, onceBlocked, tsKey } from "./automation.mjs";
import { turnCycleBlocked } from "./usage.mjs";
import { TWOD12 } from "./config.mjs";
const F = "twod12";

/* ------------------------------------------------------------------ Escalation */
/** Is this Feature an Escalation Passive? (its box, an "Escalation" Category, or the class's Escalation Passives list) */
export function isEscPassive(it, cls = null) {
  if (it?.type !== "feature") return false;
  return !!it.system?.escalationPassive || /escalation/i.test(String(it.system?.category ?? "")) || (cls?.system?.escPassives ?? []).includes(it.getFlag?.(F, "sourceUuid"));
}
/** The Escalation a passive needs: its settings' lowest minimum, or "Escalation is N or more" in its text (Hallowed Stance), or 1. At most 3. */
export function passiveThreshold(it) {
  const mins = (it?.system?.settings ?? []).map(x => Math.trunc(Number(x.minEscalation)) || 0).filter(n => n > 0);
  if (mins.length) return Math.min(3, ...mins);
  const m = String(it?.system?.description ?? "").match(/Escalation is (\d) or more/i);
  return m ? Math.min(3, Math.max(1, Number(m[1]))) : 1;
}
const ownIndex = (c, actor) => c.turns.findIndex(x => x.actor === actor || (actor?.isToken && x.tokenId === actor.token?.id));

/**
 * A passive's tag: "off" (below its threshold), "ready" (its once-a-round effect is waiting: Killer's Focus' Effect is on the creature,
 * or a once-per-round setting not used yet: Elusive), "used" (used this turn-cycle), or "active" (works, nothing to track).
 */
export function passiveState(actor, it, now = escalationOf(actor) ?? 0, combat = globalThis.game?.combat ?? null) {
  if (now < passiveThreshold(it)) return "off";
  // An Effect each turn (Killer's Focus, Radiant Zeal): there = Ready; given this turn-cycle and gone = Used; not given yet = Active.
  for (const st of it.system?.settings ?? []) {
    if (st.type !== "turnstart" || !st.fxUuid) continue;
    if ([...(actor.effects ?? [])].some(e => !e.disabled && e.getFlag?.(F, "effectUuid") === st.fxUuid)) return "ready";
    const at = (actor.getFlag?.(F, "tsGiven") ?? {})[tsKey(st.fxUuid)];
    if (combat?.started && at && turnCycleBlocked(combat.round, combat.turn, ownIndex(combat, actor), at)) return "used";
    return "active";
  }
  // A once-per-round setting (Elusive's Bane, a once-a-round Bonus Damage): its use is remembered on the creature.
  const keys = [];
  for (const e of passiveSources(actor).filter(p => p.id.startsWith(`passive-${it.id}-`))) {
    (e.getFlag(F, "modifiers") ?? []).forEach((m, i) => { if (m.oncePerRound) keys.push(onceKey(e, "m", i)); });
    (e.getFlag(F, "bonuses") ?? []).forEach((m, i) => { if (m.oncePerRound) keys.push(onceKey(e, "b", i)); });
  }
  if (keys.length) return combat?.started && keys.every(k => onceBlocked(actor, k)) ? "used" : "ready";
  return "active";
}
export const PASSIVE_TAG = { active: "Active", ready: "Ready", used: "Used", off: "" };

/**
 * The ladder: { show, now, open, rungs: [{ n, lit, passives: [{ id, name, state, tag, tip }], actives: [rows] }] }.
 * actionRow(item) gives the sheet's own Action row; an Active that can't be paid now (Escalation, Unconscious) or whose Frequency is used
 * is greyed and its Use button off; a used Round / Turn / Encounter Action reads "Round 0/1".
 */
export function escalationModel(actor, { actionRow, isFaded, open = null } = {}) {
  const now = escalationOf(actor) ?? 0, cls = actor.itemTypes?.class?.[0] ?? null;
  const passives = (actor.itemTypes?.feature ?? []).filter(f => isEscPassive(f, cls));
  const actives = (actor.itemTypes?.action ?? []).filter(i => Number(i.system?.escalation) > 0);
  const down = !!actor.statuses?.has?.("unconscious");
  const rungs = [3, 2, 1].map(n => ({
    n, lit: now >= n,
    passives: passives.filter(p => passiveThreshold(p) === n).map(p => {
      const state = passiveState(actor, p, now);
      return { id: p.id, name: p.name, state, tag: PASSIVE_TAG[state], tip: `${p.name} · Escalation ${n}+: ${String(p.system?.hover || p.system?.description || "").replace(/<[^>]+>/g, "").trim()}` };
    }),
    actives: actives.filter(i => Math.min(3, Number(i.system.escalation)) === n).map(i => {
      const row = actionRow ? actionRow(i) : { id: i.id, name: i.name };
      const f = isFaded ? isFaded(actor, i) : { faded: false };
      const used = f.faded && /used/i.test(f.why ?? "");
      const off = now < n || down || f.faded;
      return { ...row, faded: off, useOff: off, fadedWhy: down ? "Unconscious: Escalation can't be spent" : (f.faded ? f.why : ""), freqText: used ? `${TWOD12.frequencies[row.freq] ?? row.freqText} 0/1` : row.freqText, inLadder: true };
    })
  })).map(r => ({ ...r, any: r.passives.length + r.actives.length > 0 }));
  const show = passives.length + actives.length > 0;
  const started = !!globalThis.game?.combat?.started;
  return { show, now, pips: [1, 2, 3].map(k => ({ on: now >= k })), open: open ?? started, rungs: rungs.filter(r => r.any) };
}

/* ------------------------------------------------------------------ Granted */
const tierWord = tiers => { const t = [...(tiers ?? [])].map(x => Number(String(x).replace("t", ""))).sort(); return t.length && t.length < 3 ? ` T${t[0]}${t.length > 1 ? `–${t.at(-1)}` : ""}` : ""; };
/** What a grant adds, as short badges ("≠ targets", "+1 Boon", "+1d6 Pi", "Immobilized T2–3") and as long lines for the expanded body. */
export function grantBadges(g, effect) {
  const short = [], long = [];
  if (g.distinct) { short.push("≠ targets"); long.push("Each use needs a different target"); }
  if (g.boons) { short.push(`+${g.boons} Boon${g.boons === 1 ? "" : "s"}`); long.push(`${g.boons} Boon${g.boons === 1 ? "" : "s"} on it`); }
  for (const b of effect?.getFlag?.(F, "bonuses") ?? []) {
    if (b.dmg) { short.push(`+${b.dmg}${b.dmgSub ? ` ${b.dmgSub}` : ""}`); long.push(`+[${b.dmgPool || "B"}] ${b.dmg}${b.dmgSub ? ` ${TWOD12.subtypes[b.dmgSub] ?? b.dmgSub}` : ""} damage${tierWord(b.tiers) ? ` on${tierWord(b.tiers)}` : ""}`); }
    if (b.text) { short.push(`${String(b.text).replace(/\s*\((?:EoT|.*round.*)\)\s*$/i, "")}${tierWord(b.tiers)}`); long.push(`${b.text}${tierWord(b.tiers) ? ` on${tierWord(b.tiers)}` : ""}`); }
  }
  return { short, long };
}
