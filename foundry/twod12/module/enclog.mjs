// v0.0.223 (Lucas: a full log for playtesting): the Encounter Log. Every Action (with its tier per target), movement, damage, healing, condition and
// Down is logged on the Combat (written by the GM; players send theirs by socket). The window (Token Controls, the book icon) shows it by Round and
// turn; each line can be removed (struck through, kept) or edited, and a turn can get a note. Copy gives the playtest format:
//   "OC - Charge 4, WA vs DP T3; Club vs DP T3; Advance 2. DP goes Down."  plus the abbreviations and the damage report.
// Lines count by default (no confirming); a cancelled roll never logs; Reset Turn removes that turn's lines; a Charge given up is removed.
const F = "twod12", SOCKET = "system.twod12", FLAG = "enclog", ABBR = "enclogAbbr";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const idOf = uuid => String(uuid ?? "").split(".").filter(Boolean).pop() ?? "";

/* ------------------------------------------------------------------ pure: names, abbreviations, lines, the export */
const SMALL = new Set(["of", "on", "the", "and", "a", "an", "to", "in", "&"]);
/** "Lay on Hands" -> "LoH", "Lock & Loose" -> "LnL", "Weapon Attack" -> "WA"; one word stays whole ("Cleaver"). */
export function actionAbbr(name) {
  const w = String(name ?? "").replace(/\(.*?\)/g, " ").trim().split(/\s+/).filter(Boolean);
  if (w.length <= 1) return w[0] ?? "";
  return w.map(x => (x === "&" ? "n" : SMALL.has(x.toLowerCase()) ? x[0].toLowerCase() : x[0].toUpperCase())).join("");
}
/** A creature's short name: "Dwarf Paladin" -> "DP", "Goblin Sneak" twice -> "GS1", "GS2"; one word stays whole ("Nari"). list: [{ id, name }]. */
export function creatureAbbrs(list, overrides = {}) {
  const base = c => { const w = String(c.name ?? "").replace(/\s+\d+$/, "").trim().split(/\s+/).filter(Boolean); return w.length <= 1 ? (w[0] ?? "?") : w.map(x => x[0].toUpperCase()).join(""); };
  const counts = new Map(); for (const c of list) counts.set(base(c), (counts.get(base(c)) ?? 0) + 1);
  const seen = new Map(), out = {};
  for (const c of list) {
    const b = base(c), n = (seen.get(b) ?? 0) + 1; seen.set(b, n);
    out[c.id] = overrides[c.id] || (counts.get(b) > 1 ? `${b}${n}` : b);
  }
  return out;
}

/** One line, written out. nm(ref) gives a creature's name (full or short); an: an Action's name (full or short). */
export function lineText(e, nm = r => r?.name ?? "?", an = n => n) {
  if (e.txt) return e.txt;   // edited by hand
  const d = e.d ?? {};
  switch (e.k) {
    case "act": {
      const tg = (d.tg ?? []).map(t => `${nm(t)}${t.tier != null && !d.save ? ` T${t.tier}` : ""}`);
      const vs = tg.length ? ` vs ${tg.join(", ")}${d.save ? ` (${d.save} Save)` : ""}` : "";
      return `${an(d.name)}${d.multiAp ? ` ${d.ap}${d.react ? "R" : "A"}` : ""}${vs}`;
    }
    case "move": return `${d.mode} ${d.n}`;
    case "push": return `${nm(d.target)} ${d.mode} ${d.n}${d.note ? ` (${d.note})` : ""}`;
    case "dmg": return `${nm(e.who)} takes ${d.text}`;
    case "heal": return `${nm(e.who)} heals ${d.n}${d.rp ? ` (${d.rp} RP)` : ""}`;
    case "cond": return `${nm(e.who)}: ${d.name}`;
    case "down": return `${nm(e.who)} goes Down`;
    case "up": return `${nm(e.who)} is back up`;
    case "note": return d.text ?? "";
    default: return "";
  }
}

/**
 * The turns of the log, in order: [{ r, t, own, items }] (items: the lines kept, in order). Removed lines are left out.
 */
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

/**
 * One turn as the playtest format writes it: "OC - Charge 4, WA vs DP T3; Club vs DP T3. DP goes Down."
 * A free (linked) Action follows the one before it with a comma; a Charge and its movement are one part; moves of the same kind add up;
 * another creature's Action (a Reaction) is written with its name; healing, Down, back up and notes are sentences at the end. opts.details adds
 * damage and conditions.
 */
export function turnText(turn, nm, an, { details = false } = {}) {
  const ownId = turn.own?.id;
  const parts = [], tail = [];
  for (const e of turn.items) {
    if (["heal", "down", "up", "note"].includes(e.k) || (details && ["dmg", "cond"].includes(e.k))) { tail.push(lineText(e, nm, an)); continue; }
    if (!["act", "move", "push"].includes(e.k)) continue;
    const mine = !e.who?.id || e.who.id === ownId;
    let txt = lineText(e, nm, an);
    if (!mine) txt = `${nm(e.who)} ${txt}`;
    const last = parts[parts.length - 1];
    if (e.k === "move" && last && last.k === "move" && last.mode === e.d.mode && last.mine === mine && !e.txt) { last.n += e.d.n; last.txt = `${mine ? "" : `${nm(e.who)} `}${e.d.mode} ${last.n}`; continue; }
    if (e.k === "move" && e.d.mode === "Charge" && last?.k === "act" && last.name === "Charge" && last.mine === mine) { last.txt = `${last.txt.replace(/Charge( 2A)?$/, "Charge")} ${e.d.n}`; last.k = "charge"; continue; }
    const part = { k: e.k, mode: e.d?.mode, n: e.d?.n ?? 0, name: e.d?.name, mine, txt, free: !!e.d?.free };
    if (part.free && last) { last.txt += `, ${txt}`; continue; }
    parts.push(part);
  }
  const head = `${nm(turn.own)} - ${parts.map(p => p.txt).join("; ") || "(nothing)"}.`;
  return tail.length ? `${head} ${tail.join(". ")}.` : head;
}

/** The whole log in the playtest format, by Round, with the abbreviations used (a legend) first. */
export function exportText(log, { abbr = {}, short = true, details = false } = {}) {
  const used = new Map(), usedAct = new Map();
  const nm = r => { if (!r) return "?"; const s = short ? (abbr[r.id] ?? r.name) : r.name; if (short && s !== r.name) used.set(s, r.name); return s; };
  // An Action's short name that is also a creature's (Ground Slam and the Goblin Sneaks: GS) stays whole.
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

/* ------------------------------------------------------------------ writing (the GM writes; players send) */
let chain = Promise.resolve();
const newId = () => (globalThis.foundry?.utils?.randomID?.() ?? Math.random().toString(36).slice(2, 12));
async function apply(combat, op) {
  const log = foundry.utils.deepClone(combat.getFlag(F, FLAG) ?? []);
  if (op.type === "add") log.push(op.entry);
  else if (op.type === "patch") { const e = log.find(x => x.id === op.id); if (e) Object.assign(e, op.changes); }
  else if (op.type === "voidTurn") for (const e of log) { if (e.r === op.r && e.t === op.t && !e.off) { e.off = true; e.why = op.why ?? ""; } }
  else if (op.type === "voidLast") { const e = [...log].reverse().find(x => x.r === op.r && x.t === op.t && !x.off && x.k === "act" && x.who?.id === op.who && x.d?.name === op.name); if (e) { e.off = true; e.why = op.why ?? ""; } }
  await combat.setFlag(F, FLAG, log);
}
function send(op, combat = game.combat) {
  if (typeof combat?.getFlag !== "function") return;   // no real Combat (the tests' stand-ins)
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

/** A creature reference: its token's id (several Goblin Sneaks stay apart) and its name. */
export const refOf = (actorOrToken, name = null) => {
  const a = actorOrToken?.actor ?? actorOrToken, tok = actorOrToken?.document ?? actorOrToken?.token ?? a?.token ?? a?.getActiveTokens?.()[0]?.document ?? null;
  return { id: tok?.id ?? a?.id ?? "", name: name ?? tok?.name ?? a?.name ?? "?" };
};

/** Log a line (k, who, d) for the combat's current round and turn. Nothing outside combat. */
export function logLine(k, who, d = {}) {
  const combat = game.combat;
  if (!combat?.started) return;
  const cur = combat.combatant;
  const entry = { id: newId(), r: combat.round, t: combat.turn, own: { id: cur?.tokenId ?? cur?.actorId ?? "", name: cur?.token?.name ?? cur?.name ?? "" }, k, who, d };
  return send({ type: "add", entry }, combat);
}
/** An Action was used: name, its AP (written when it has several Versions), the targets with their tier, a Save, free (a linked use), Reaction. */
export function logAction(actor, item, { ap = 0, targets = [], save = "", free = false } = {}) {
  const multiAp = new Set((item?.system?.versions ?? []).map(v => v.ap)).size > 1;
  logLine("act", refOf(actor), { name: item?.name ?? "?", ap, multiAp, tg: targets.map(t => ({ id: idOf(t.uuid) || t.id || "", name: t.name, tier: t.tier ?? null })), save, free, react: !!item?.system?.reaction });
}
export const logMove = (actor, mode, n) => { if (n > 0) logLine("move", refOf(actor), { mode, n: Math.round(n * 100) / 100 }); };
export const logPush = (origin, target, mode, n, note = "") => logLine("push", refOf(origin), { target: refOf(target), mode, n, note });
export const voidTurn = (combat, r, t, why) => send({ type: "voidTurn", r, t, why }, combat);
export const voidLastAction = (actor, name, why) => { const c = game.combat; if (c?.started) send({ type: "voidLast", r: c.round, t: c.turn, who: refOf(actor).id, name, why }, c); };
export const patchLine = (id, changes) => send({ type: "patch", id, changes });

/* ------------------------------------------------------------------ automatic lines: damage, healing, Down, conditions */
export function registerEncLogHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options) => { options.twod12LogDmg = foundry.utils.deepClone(actor.system?.damage ?? {}); options.twod12LogRally = actor.system?.rallyUsed ?? 0; options.twod12LogDown = !!actor.system?.atZero; });
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    try {
      if (userId !== game.user.id || !game.combat?.started || !options?.twod12LogDmg || options.twod12Reset || !["character", "npc"].includes(actor.type)) return;
      const old = options.twod12LogDmg, now = actor.system?.damage ?? {};
      const KEYS = [["bodyLethal", "Body"], ["bodyNonlethal", "Body Nonlethal"], ["mindLethal", "Mind"], ["mindNonlethal", "Mind Nonlethal"]];
      const up = KEYS.map(([k, l]) => [(Number(now[k]) || 0) - (Number(old[k]) || 0), l]);
      const dealt = up.filter(([n]) => n > 0), healed = -up.filter(([n]) => n < 0).reduce((s, [n]) => s + n, 0);
      if (dealt.length) logLine("dmg", refOf(actor), { n: dealt.reduce((s, [n]) => s + n, 0), text: dealt.map(([n, l]) => `${n} ${l}`).join(", ") });
      if (healed > 0) logLine("heal", refOf(actor), { n: healed, rp: Math.max(0, (actor.system?.rallyUsed ?? 0) - (options.twod12LogRally ?? 0)) });
      const down = !!actor.system?.atZero;
      if (down && !options.twod12LogDown) logLine("down", refOf(actor));
      if (!down && options.twod12LogDown) logLine("up", refOf(actor));
    } catch (e) { console.warn("twod12 | encounter log (actor)", e); }
  });
  Hooks.on("createActiveEffect", (effect, options, userId) => {
    try {
      const actor = effect.parent;
      if (userId !== game.user.id || !game.combat?.started || actor?.documentName !== "Actor" || effect.getFlag?.(F, "rider") || options?.twod12Reset) return;
      const dur = effect.getFlag?.(F, "duration")?.type === "eot" ? " (EoT)" : "";
      logLine("cond", refOf(actor), { name: `${effect.name}${dur}` });
    } catch (e) { console.warn("twod12 | encounter log (effect)", e); }
  });
}

/* ------------------------------------------------------------------ the window */
const { ApplicationV2 } = foundry.applications?.api ?? {};
const ICON = { act: "fa-dice", move: "fa-shoe-prints", push: "fa-hand", dmg: "fa-heart-crack", heal: "fa-heart-pulse", cond: "fa-triangle-exclamation", down: "fa-skull", up: "fa-person-rays", note: "fa-note-sticky" };
export class EncounterLog extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { id: "twod12-encounter-log", window: { title: "Encounter Log", resizable: true }, position: { width: 560, height: 640 }, classes: ["twod12", "enclog-app"] };
  show = { dmg: true, cond: true, off: true };
  async _renderHTML() {
    const combat = game.combat;
    const div = document.createElement("div");
    div.className = "enclog";
    if (!combat) { div.innerHTML = "<p>No combat.</p>"; return div; }
    const log = combat.getFlag(F, FLAG) ?? [];
    const list = [...combat.combatants].map(c => ({ id: c.tokenId ?? c.actorId, name: c.token?.name ?? c.name }));
    const ab = creatureAbbrs(list, combat.getFlag(F, ABBR) ?? {});
    const nm = r => esc(r?.name ?? "?");
    const rows = [];
    let round = null;
    for (const turn of turnsOf(log, { all: true })) {
      if (turn.r !== round) { round = turn.r; rows.push(`<h3 class="el-round">${round > 0 ? `Round ${round}` : "Before the first round"}</h3>`); }
      const lines = turn.items.filter(e => (this.show.dmg || e.k !== "dmg") && (this.show.cond || e.k !== "cond") && (this.show.off || !e.off)).map(e => {
        const who = e.who?.id && e.who.id !== turn.own?.id && !["dmg", "heal", "cond", "down", "up", "note"].includes(e.k) ? `<b>${nm(e.who)}</b> ` : "";
        return `<div class="el-line k-${e.k}${e.off ? " off" : ""}" data-id="${e.id}"${e.why ? ` data-tooltip="${esc(e.why)}"` : ""}><i class="fa-solid ${ICON[e.k] ?? "fa-circle"}"></i><span class="el-txt">${who}${esc(lineText(e))}${e.txt ? ' <i class="fa-solid fa-pen el-edited" data-tooltip="Edited by hand"></i>' : ""}</span>
          <a data-el="edit" data-tooltip="Edit the text"><i class="fa-solid fa-pen-to-square"></i></a><a data-el="${e.off ? "restore" : "remove"}" data-tooltip="${e.off ? "Put it back" : "Remove (a misclick): struck through, left out of the copy"}"><i class="fa-solid ${e.off ? "fa-rotate-left" : "fa-xmark"}"></i></a></div>`;
      }).join("");
      rows.push(`<div class="el-turn" data-r="${turn.r}" data-t="${turn.t}"><div class="el-own"><b>${nm(turn.own)}</b> <span class="el-ab">(${esc(ab[turn.own?.id] ?? "")})</span><a data-el="note" data-tooltip="Add a note to this turn"><i class="fa-solid fa-plus"></i> note</a></div>${lines || '<div class="el-line empty">(nothing)</div>'}</div>`);
    }
    div.innerHTML = `<div class="el-bar"><button type="button" data-el="copy"><i class="fa-solid fa-copy"></i> Copy log</button>
        <label><input type="checkbox" data-opt="short" ${this.short === false ? "" : "checked"}> Short names</label>
        <label><input type="checkbox" data-opt="details" ${this.details ? "checked" : ""}> Damage and conditions in the copy</label>
        <span class="el-sp"></span><label data-tooltip="Show damage lines"><input type="checkbox" data-show="dmg" ${this.show.dmg ? "checked" : ""}> Damage</label><label><input type="checkbox" data-show="cond" ${this.show.cond ? "checked" : ""}> Conditions</label><label><input type="checkbox" data-show="off" ${this.show.off ? "checked" : ""}> Removed</label></div>
      <details class="el-abbr"><summary>Short names</summary>${list.map(c => `<label>${esc(c.name)} <input type="text" data-abbr="${esc(c.id)}" value="${esc(ab[c.id])}"></label>`).join("")}</details>
      <div class="el-body">${rows.join("") || "<p class=\"hint\">Nothing logged yet. Actions, movement, damage, healing and conditions in this combat appear here.</p>"}</div>`;
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
    root.querySelectorAll("[data-el]").forEach(b => b.addEventListener("click", ev => { ev.preventDefault(); this._act(b); }));
    root.querySelectorAll("[data-show]").forEach(b => b.addEventListener("change", () => { this.show[b.dataset.show] = b.checked; this.render(); }));
    root.querySelectorAll("[data-opt]").forEach(b => b.addEventListener("change", () => { this[b.dataset.opt] = b.checked; }));
    root.querySelectorAll("[data-abbr]").forEach(b => b.addEventListener("change", async () => {
      const all = foundry.utils.deepClone(game.combat?.getFlag(F, ABBR) ?? {}); all[b.dataset.abbr] = b.value.trim(); await game.combat?.setFlag(F, ABBR, all);
    }));
  }
  async _act(b) {
    const combat = game.combat;
    if (!combat) return;
    const id = b.closest("[data-id]")?.dataset.id, what = b.dataset.el;
    if (what === "copy") {
      const list = [...combat.combatants].map(c => ({ id: c.tokenId ?? c.actorId, name: c.token?.name ?? c.name }));
      let text = exportText(combat.getFlag(F, FLAG) ?? [], { abbr: creatureAbbrs(list, combat.getFlag(F, ABBR) ?? {}), short: this.short !== false, details: !!this.details });
      try { const { reportRows } = await import("./damagelog.mjs"); const rows = reportRows(combat); if (rows.length) text += `\n\nDamage dealt (total / per round)\n${rows.map(r => `${r.name}: ${r.total} / ${Math.round(r.perRound * 10) / 10}`).join("\n")}`; } catch (e) { /* no report */ }
      try { await (game.clipboard?.copyPlainText?.(text) ?? navigator.clipboard.writeText(text)); ui.notifications.info("Encounter log copied."); } catch (e) { console.log(text); ui.notifications.warn("Could not copy: the log is in the console (F12)."); }
      return;
    }
    if (what === "remove" && id) return patchLine(id, { off: true, why: "Removed by hand" });
    if (what === "restore" && id) return patchLine(id, { off: false, why: "" });
    if (what === "edit" && id) {
      const e = (combat.getFlag(F, FLAG) ?? []).find(x => x.id === id);
      const val = await foundry.applications.api.DialogV2.prompt({ window: { title: "Edit the line" }, content: `<input type="text" name="t" value="${esc(e ? lineText(e) : "")}" style="width:100%" autofocus><p class="hint">Empty: back to the logged text.</p>`, ok: { label: "Save", callback: (ev, btn) => btn.form.elements.t.value }, rejectClose: false });
      if (val != null) return patchLine(id, { txt: String(val).trim() });
      return;
    }
    if (what === "note") {
      const turn = b.closest(".el-turn"), r = Number(turn.dataset.r), t = Number(turn.dataset.t);
      const val = await foundry.applications.api.DialogV2.prompt({ window: { title: "Add a note" }, content: '<input type="text" name="t" style="width:100%" placeholder="DP chose to keep fighting" autofocus>', ok: { label: "Add", callback: (ev, btn) => btn.form.elements.t.value }, rejectClose: false });
      if (!val?.trim()) return;
      const own = (combat.getFlag(F, FLAG) ?? []).find(x => x.r === r && x.t === t)?.own ?? { id: "", name: "" };
      return send({ type: "add", entry: { id: newId(), r, t, own, k: "note", who: null, d: { text: val.trim() } } }, combat);
    }
  }
}

// v0.0.224 (Lucas: the open log didn't update): the open window is found by its id (the toolbar button can fire twice and make a second
// instance, so a kept reference could point at the wrong one); a toggle within half a second of the last one is ignored.
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
  registerEncLogSocket();
  registerEncLogHooks();
  for (const h of ["updateCombat", "deleteCombat", "createCombat"]) Hooks.on(h, () => { const w = openWin(); if (w?.rendered) w.render(); });
}
