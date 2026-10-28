// Damage Report: who dealt how much damage in the current combat. Kept on the Combat (by the GM) and shown in a window
// opened from the Token Controls (the chart icon). Columns: this turn, this round, total, average per turn and per round.
const F = "twod12", SOCKET = "system.twod12";
const { ApplicationV2 } = foundry.applications.api;

/** Record damage dealt by an origin (an actor uuid) to a target. Players send it to the GM, who writes it on the Combat. */
export async function logDamage({ originUuid = "", originName = "", targetName = "", amount = 0 }) {
  const combat = game.combat;
  if (!combat?.started || !amount) return;
  const entry = { o: originUuid, on: originName, tn: targetName, a: amount, r: combat.round, t: combat.turn };
  if (game.user.isGM) return writeEntry(combat, entry);
  game.socket.emit(SOCKET, { type: "logDamage", combatId: combat.id, entry });
}
async function writeEntry(combat, entry) {
  const log = [...(combat.getFlag(F, "dmglog") ?? []), entry];
  await combat.setFlag(F, "dmglog", log);
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
  const log = combat?.getFlag(F, "dmglog") ?? [];
  const rows = new Map();
  for (const e of log) {
    const key = e.o || e.on;
    const r = rows.get(key) ?? { name: e.on || "Unknown", total: 0, round: 0, turn: 0 };
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
  return [...rows.values()].sort((a, b) => b.total - a.total);
}

export class DamageReport extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { id: "twod12-damage-report", window: { title: "Damage Report", resizable: true }, position: { width: 520, height: "auto" }, classes: ["twod12"] };
  async _renderHTML() {
    const combat = game.combat;
    const div = document.createElement("div");
    div.className = "dmgreport";
    if (!combat) { div.innerHTML = "<p>No combat.</p>"; return div; }
    const rows = reportRows(combat);
    const n = x => (Math.round(x * 10) / 10).toString();
    div.innerHTML = `<p class="hint">Round ${combat.round}. Damage dealt (after Half or Block), from the damage cards.</p>
      <table><thead><tr><th>Creature</th><th>This turn</th><th>This round</th><th>Total</th><th>Per turn</th><th>Per round</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${foundry.utils.escapeHTML?.(r.name) ?? r.name}</td><td class="c">${r.turn}</td><td class="c">${r.round}</td><td class="c"><b>${r.total}</b></td><td class="c">${n(r.perTurn)}</td><td class="c">${n(r.perRound)}</td></tr>`).join("") || '<tr><td colspan="6"><i>Nothing yet.</i></td></tr>'}</tbody></table>`;
    return div;
  }
  _replaceHTML(result, content) { content.replaceChildren(result); }
}

let report = null;
export function toggleDamageReport() {
  if (report?.rendered) { report.close(); return; }
  report = new DamageReport();
  report.render({ force: true });
}
export function registerDamageReport() {
  registerDamageLogSocket();
  for (const h of ["updateCombat", "deleteCombat", "createCombat"]) Hooks.on(h, () => { if (report?.rendered) report.render(); });
}
