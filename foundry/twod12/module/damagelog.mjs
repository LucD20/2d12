// Damage Report: who dealt how much damage in the current combat. Kept on the Combat (by the GM) and shown in a window
// opened from the Token Controls (the chart icon). Columns: this turn, this round, total, average per turn and per round.
const F = "twod12", SOCKET = "system.twod12";
const { ApplicationV2 } = foundry.applications.api;

/** Record damage dealt by an origin (an actor uuid) to a target. Players send it to the GM, who writes it on the Combat. */
export async function logDamage({ originUuid = "", originName = "", targetName = "", targetUuid = "", amount = 0 }) {
  const combat = game.combat;
  if (!combat?.started || !amount) return;
  // v0.0.418 (Lucas, playtest 5: the Ogre's 71 was mostly its own Goblins): damage to the origin's allies (its side) is kept apart
  // v0.0.421 (the audit): itself counts with its allies (its own side); the origin is an actor uuid, the target a token's: compared as actors
  const al = !!targetUuid && !!originUuid && (actorUuidOf(targetUuid) === actorUuidOf(originUuid) || sameSide(dispositionOf(originUuid), dispositionOf(targetUuid)));
  const entry = { o: originUuid, on: originName, tn: targetName, a: amount, r: combat.round, t: combat.turn, ...(al ? { al: true } : {}) };
  if (game.user.isGM) return writeEntry(combat, entry);
  game.socket.emit(SOCKET, { type: "logDamage", combatId: combat.id, entry });
}
/** A creature's side (its token's disposition) from an actor or token uuid; undefined when it can't be read. */
function dispositionOf(uuid) {
  try {
    const d = fromUuidSync(uuid);
    const tok = d?.documentName === "Token" ? d : d?.token ?? d?.getActiveTokens?.()?.[0]?.document ?? d?.prototypeToken ?? null;
    return tok?.disposition;
  } catch (e) { return undefined; }
}
/** An actor or token uuid as its actor's uuid ("" when it can't be read). */
function actorUuidOf(uuid) {
  try { const d = fromUuidSync(uuid); return (d?.documentName === "Actor" ? d : d?.actor)?.uuid ?? ""; } catch (e) { return ""; }
}
/** Pure (v0.0.418): two dispositions on the same side (a neutral, 0, is nobody's ally; unknown: not allies). */
export const sameSide = (a, b) => Number.isFinite(a) && Number.isFinite(b) && a !== 0 && a === b;
/**
 * v0.0.361 (PACK PERF, D28): one Combat flag key per entry (flags.twod12.dmgl.<id>): a new entry sends only itself, not the whole log.
 * A Combat from before keeps its old array (dmglog), read with the new keys. Pure: every entry.
 */
export function damageLogOf(combat) {
  const old = combat?.getFlag?.(F, "dmglog"), keyed = combat?.getFlag?.(F, "dmgl");
  return [...(Array.isArray(old) ? old : []), ...(keyed && typeof keyed === "object" ? Object.values(keyed).filter(e => e && typeof e === "object") : [])];
}
async function writeEntry(combat, entry) {
  const id = globalThis.foundry?.utils?.randomID?.() ?? Math.random().toString(36).slice(2, 12);
  await combat.update({ [`flags.${F}.dmgl.${id}`]: entry });
}
export function registerDamageLogSocket() {
  game.socket.on(SOCKET, async data => {
    if (data?.type !== "logDamage" || !game.user.isActiveGM) return;
    const combat = game.combats.get(data.combatId);
    if (combat) await writeEntry(combat, data.entry);
  });
}

/** The rows of the report: one per creature that dealt damage. */
export function reportRows(combat) {
  const log = damageLogOf(combat);
  const rows = new Map();
  for (const e of log) {
    const key = e.o || e.on;
    const r = rows.get(key) ?? { key, name: e.on || "Unknown", total: 0, round: 0, turn: 0, allies: 0 };
    rows.set(key, r);
    // v0.0.418 (playtest 5): damage to its allies is counted apart (not in the totals)
    if (e.al) { r.allies += e.a; continue; }
    r.total += e.a;
    if (e.r === combat.round) r.round += e.a;
    if (e.r === combat.round && e.t === combat.turn) r.turn += e.a;
    rows.set(key, r);
  }
  const rounds = Math.max(1, combat?.round ?? 1);
  for (const [key, r] of rows) {
    // Turns this creature has had: every round so far, minus this one if its turn hasn't come yet.
    const c = combat?.combatants.find(x => x.actor?.uuid === key);
    const idx = c ? combat.turns.findIndex(x => x.id === c.id) : -1;
    const turns = Math.max(1, rounds - (idx > combat.turn ? 1 : 0));
    r.perTurn = r.total / turns; r.perRound = r.total / rounds;
  }
  return numberSameNames([...rows.values()], combat).sort((a, b) => b.total - a.total || b.allies - a.allies);
}
/** v0.0.418 (Lucas, playtest 5: two "Goblin Sneak" rows): creatures of the same name are numbered (1, 2...) in the combat's order. */
// v0.0.472 (Lucas, checklist v0.0.471, log-allies: "Goblin Sneak: 2 / 1"; "Sylwen (Elf Archer, Quick Shots)"): names as the log writes them: the
// sheet's parenthesis dropped, and numbered by the combat's creatures (two Goblin Sneaks in the fight: "Goblin Sneak 2" even when only one dealt damage)
const baseName = n => String(n ?? "").replace(/\s*\([^()]*\)\s*$/, "").replace(/\s+\d+$/, "").trim();
export function numberSameNames(rows, combat) {
  const turns = combat?.turns ?? [...(combat?.combatants ?? [])];
  const count = new Map(); for (const t of turns) { const b = baseName(t.token?.name ?? t.name); if (b) count.set(b, (count.get(b) ?? 0) + 1); }
  const seen = new Map(), numbered = new Map();
  for (const t of turns) { const b = baseName(t.token?.name ?? t.name); if (!b || (count.get(b) ?? 0) < 2) continue; const n = (seen.get(b) ?? 0) + 1; seen.set(b, n); for (const k of [t.actor?.uuid, t.actorId, t.token?.actor?.uuid].filter(Boolean)) numbered.set(k, `${b} ${n}`); }
  // rows without a combatant to match (the tests' lists): numbered among themselves, as before
  const left = rows.filter(r => !numbered.has(r.key)), cnt = new Map(); for (const r of left) cnt.set(baseName(r.name), (cnt.get(baseName(r.name)) ?? 0) + 1);
  const seen2 = new Map();
  for (const r of rows) {
    if (numbered.has(r.key)) { r.name = numbered.get(r.key); continue; }
    const b = baseName(r.name);
    if ((cnt.get(b) ?? 0) < 2) { r.name = b; continue; }
    const n = (seen2.get(b) ?? 0) + 1; seen2.set(b, n); r.name = `${b} ${n}`;
  }
  return rows;
}

export class DamageReport extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { id: "twod12-damage-report", window: { title: "Damage Report", resizable: true }, position: { width: 540, height: "auto" }, classes: ["twod12", "dmgreport-win"] };
  async _renderHTML() {
    const combat = game.combat;
    const div = document.createElement("div");
    div.className = "dmgreport";
    if (!combat) { div.innerHTML = "<p>No combat.</p>"; return div; }
    const rows = reportRows(combat);
    const maxTot = Math.max(1, ...rows.map(r => r.total));
    const n = x => (Math.round(x * 10) / 10).toString();
    div.innerHTML = `<p class="hint">Round ${combat.round}. Damage dealt to enemies (after Half or Block), from the damage cards; damage to its own side (its allies, itself) is counted apart.</p>
      <table><thead><tr><th>Creature</th><th>This turn</th><th>This round</th><th>Total</th><th>Per turn</th><th>Per round</th><th>To allies</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${foundry.utils.escapeHTML?.(r.name) ?? r.name}</td><td class="c">${r.turn}</td><td class="c">${r.round}</td><td class="c dr-tot"><span class="dr-bar" style="width:${Math.round((r.total / maxTot) * 100)}%"></span><b>${r.total}</b></td><td class="c">${n(r.perTurn)}</td><td class="c">${n(r.perRound)}</td><td class="c${r.allies ? " dr-ally" : ""}">${r.allies || "\u2014"}</td></tr>`).join("") || '<tr><td colspan="7"><i>Nothing yet.</i></td></tr>'}</tbody></table>`;
    return div;
  }
  _replaceHTML(result, content) { content.replaceChildren(result); }
}

// v0.0.224: as the Encounter Log, the open window is found by its id, and a double toggle is ignored.
const openReport = () => foundry.applications.instances?.get?.("twod12-damage-report") ?? null;
let lastToggle = 0;
export function toggleDamageReport() {
  if (Date.now() - lastToggle < 500) return;
  lastToggle = Date.now();
  const r = openReport();
  if (r?.rendered) { r.close(); return; }
  new DamageReport().render({ force: true });
}
export function registerDamageReport() {
  registerDamageLogSocket();
  for (const h of ["updateCombat", "deleteCombat", "createCombat"]) Hooks.on(h, () => { const r = openReport(); if (r?.rendered) r.render(); });
}
