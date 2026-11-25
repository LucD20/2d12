// v0.0.250 (cards session 3, Lucas): healing is chosen in a window of the system's style (pickwindow.mjs), never a Foundry dialog: the Rally window
// (how many Rally Points are left, the heal, the Vigor and Resolve damage, the split) and the Heal window (@Heal: the same without Rally Points).
// The default split is symmetrical: each damage type's share of its own threshold (Vigor damage ÷ Vigor threshold, Resolve damage ÷ Resolve
// threshold) is brought down together, the higher share first, lethal before nonlethal within a type; the player changes it as they wish.
import { esc } from "./util.mjs";

export const BUCKETS = [["bodyLethal", "Vigor"], ["mindLethal", "Resolve"], ["bodyNonlethal", "Vigor Nonlethal"], ["mindNonlethal", "Resolve Nonlethal"]];

/** Pure: the symmetrical default. damage: the four buckets; thresholds: { vigor, resolve }; total: the healing. */
export function symmetricHealing(damage, thresholds, total) {
  const out = { bodyLethal: 0, mindLethal: 0, bodyNonlethal: 0, mindNonlethal: 0 };
  const left = { bodyLethal: damage.bodyLethal ?? 0, mindLethal: damage.mindLethal ?? 0, bodyNonlethal: damage.bodyNonlethal ?? 0, mindNonlethal: damage.mindNonlethal ?? 0 };
  const thr = { body: Math.max(1, Number(thresholds?.vigor) || 1), mind: Math.max(1, Number(thresholds?.resolve) || 1) };
  const dmg = k => left[`${k}Lethal`] + left[`${k}Nonlethal`];
  let n = Math.max(0, Math.floor(Number(total) || 0));
  while (n > 0 && (dmg("body") > 0 || dmg("mind") > 0)) {
    const sb = dmg("body") / thr.body, sm = dmg("mind") / thr.mind;
    const k = dmg("mind") <= 0 ? "body" : dmg("body") <= 0 ? "mind" : (sb >= sm ? "body" : "mind");
    const b = left[`${k}Lethal`] > 0 ? `${k}Lethal` : `${k}Nonlethal`;
    left[b]--; out[b]++; n--;
  }
  return out;
}

/** Pure: the form's values into a plan: each bucket capped at its damage, the total at the healing. */
export function planHealing(values, damage, total) {
  const out = {};
  let left = Math.max(0, Math.floor(Number(total) || 0));
  for (const [k] of BUCKETS) {
    const n = Math.min(Math.max(0, Math.floor(Number(values[k]) || 0)), damage[k] ?? 0, left);
    if (n) { out[k] = n; left -= n; }
  }
  return out;
}

/**
 * v0.0.454 (Lucas, playtest 6, D1: "The rally window could use some reworking: it seems to have too much information. Let's do a complete redesign";
 * the mockup foundry/mockups/pt6, his answer "B for both windows"): the Rally window and the Heal window, 400 px, in the table look. One sentence
 * at the top ("Durgan heals 15", each part and its source under it), the Rally Points as the sheet's marks ("5 of 7 left"), the pools as the HUD's
 * bars (what is left, the part healed lighter), the split behind "Change the split" (its rows, − and + each), Cancel and Use. When an Action lets
 * you use up to N Rally Points, the count is the window's first line (it was a window of its own). Pure.
 * o: { name, damage, thresholds, partsFor(n) → [[amount, source]], rally: { max, left (before), top } | null }; st: { n, values, split }.
 */
export function healWinHtml(o, st) {
  const d = o.damage ?? {}, thr = o.thresholds ?? {}, parts = o.partsFor(st.n), total = parts.reduce((t, p) => t + (Number(p[0]) || 0), 0);
  const given = BUCKETS.reduce((t, [k]) => t + (Number(st.values[k]) || 0), 0), all = BUCKETS.reduce((t, [k]) => t + (d[k] ?? 0), 0);
  const keys = HW_ORDER.filter(k => (d[k] ?? 0) > 0), choice = keys.length > 1 && total < all;
  const r = o.rally, leftAfter = r ? Math.max(0, r.left - st.n) : 0;
  const pips = r ? `<span class="hw2-pips" role="img" aria-label="${leftAfter} of ${r.max} Rally Points left after">${Array.from({ length: r.max }, (_, k) => `<i class="${k < leftAfter ? "on" : k < leftAfter + st.n ? "go" : ""}"></i>`).join("")}</span>` : "";
  const count = r && r.top > 1 ? `<div class="hw2-count"><span class="k">Rally Points to use</span><span class="hw2-seg">${Array.from({ length: r.top }, (_, k) => `<button type="button" data-hw="n" data-v="${k + 1}" class="${k + 1 === st.n ? "on" : ""}" aria-pressed="${k + 1 === st.n}">${k + 1}</button>`).join("")}</span><span class="q">each heals ${o.partsFor(1)[0]?.[0] ?? 0}</span></div>` : "";
  const head = `<div class="hw2-head"><div class="hw2-who"><b>${esc(o.name)}</b> heals <b class="n">${total}</b>${parts.length > 1 ? `<span class="hw2-sum">${parts.map(p => `${p[0]}${p[1] ? ` ${esc(p[1])}` : ""}`).join(" + ")}</span>` : ""}</div>`
    + (r ? `<div class="hw2-rp"><span class="k">Rally Points</span>${pips}<span><b>${leftAfter}</b> of ${r.max} left</span></div>` : "") + "</div>";
  const bar = (pool, cls, name) => {
    const max = Math.max(1, pool === "body" ? Number(thr.vigor) || 1 : Number(thr.resolve) || 1), dmg = (d[`${pool}Lethal`] ?? 0) + (d[`${pool}Nonlethal`] ?? 0), h = (Number(st.values[`${pool}Lethal`]) || 0) + (Number(st.values[`${pool}Nonlethal`]) || 0);
    if (!dmg) return "";
    const pct = n => `${Math.max(0, Math.min(100, (n / max) * 100))}%`;
    return `<div class="hw2-bar ${cls}"><span class="nm">${name}</span><span class="tr"><i class="l" style="width:${pct(max - dmg)}"></i><i class="h" style="width:${pct(h)}"></i></span><span class="nn">${max - dmg} &rarr; <b>${max - dmg + h}</b> / ${max}</span></div>`;
  };
  const step = (k, n) => `<span class="hw2-st"><button type="button" data-hw="step" data-k="${k}" data-d="-1" aria-label="Less ${HW_NAMES[k][0]}"${n <= 0 ? " disabled" : ""}>&minus;</button><b>${n}</b><button type="button" data-hw="step" data-k="${k}" data-d="1" aria-label="More ${HW_NAMES[k][0]}"${n >= (d[k] ?? 0) || given >= total ? " disabled" : ""}>+</button></span>`;
  const rows = keys.map(k => { const n = Number(st.values[k]) || 0, of = k === "bodyLethal" ? thr.vigor : k === "mindLethal" ? thr.resolve : 0;
    return `<div class="hw2-row"><span class="nm ${HW_NAMES[k][1]}">${HW_NAMES[k][0]}</span><span class="was">${d[k]}</span><span class="ar">&rarr;</span><b class="${n ? "chg" : ""}">${d[k] - n}</b><span class="of">${of ? `of ${of}` : ""}</span>${step(k, n)}</div>`; }).join("");
  const body = all === 0 ? '<div class="hw2-none">No damage to remove.</div>'
    : `${bar("body", "v", "Vigor")}${bar("mind", "r", "Resolve")}${choice ? (st.split ? `<div class="hw2-split">${rows}</div>` : `<div class="hw2-link"><span>Split evenly between the two.</span><button type="button" class="hw2-lk" data-hw="split">Change the split</button></div>`) : ""}`;
  const msg = all > 0 && choice && st.split ? (given < total ? `${total - given} left to give` : "Split evenly by default.") : "";
  const go = r ? `Use ${st.n} Rally Point${st.n === 1 ? "" : "s"}` : "Heal";
  return `<div class="hw2">${count}${head}<div class="hw2-rows">${body}</div><div class="hw2-foot"><span class="m">${esc(msg)}</span><button type="button" class="hw2-b" data-hw="cancel">Cancel</button><button type="button" class="hw2-b go" data-hw="go">${go}</button></div></div>`;
}
const HW_ORDER = ["bodyLethal", "bodyNonlethal", "mindLethal", "mindNonlethal"];
const HW_NAMES = { bodyLethal: ["Vigor", "v"], bodyNonlethal: ["Vigor Nonlethal", "v"], mindLethal: ["Resolve", "r"], mindNonlethal: ["Resolve Nonlethal", "r"] };
const AppV2 = globalThis.foundry?.applications?.api?.ApplicationV2;
class HealWin extends (AppV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "twod12-healwin"], window: { resizable: false }, position: { width: 400, height: "auto" } };
  constructor(o) { super({ window: { title: o.title } }); this.o = o; this.st = o.st; this.done = false; }
  async _renderHTML() { const div = document.createElement("div"); div.innerHTML = healWinHtml(this.o, this.st); return div; }
  _replaceHTML(result, content) {
    const f = content.querySelector(":focus");
    const sel = f?.dataset?.hw ? `[data-hw="${CSS.escape(f.dataset.hw)}"]${f.dataset.k ? `[data-k="${CSS.escape(f.dataset.k)}"]` : ""}${f.dataset.d ? `[data-d="${CSS.escape(f.dataset.d)}"]` : ""}${f.dataset.v ? `[data-v="${CSS.escape(f.dataset.v)}"]` : ""}` : null;
    content.replaceChildren(result);
    if (sel) content.querySelector(sel)?.focus({ preventScroll: true });
  }
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this.element.addEventListener("click", ev => {
      const b = ev.target.closest("button[data-hw]");
      if (!b || b.disabled) return;
      const k = b.dataset.hw, st = this.st, o = this.o;
      if (k === "cancel") return this.close();
      if (k === "go") { this.done = true; o.resolve({ n: st.n, plan: planHealing(st.values, o.damage, o.partsFor(st.n).reduce((t, p) => t + (Number(p[0]) || 0), 0)) }); return this.close(); }
      if (k === "split") st.split = true;
      if (k === "n") { st.n = Math.max(1, Number(b.dataset.v) || 1); st.values = { ...symmetricHealing(o.damage, o.thresholds, o.partsFor(st.n).reduce((t, p) => t + (Number(p[0]) || 0), 0)) }; }
      if (k === "step") { const key = b.dataset.k; st.values[key] = Math.max(0, Math.min(o.damage[key] ?? 0, (Number(st.values[key]) || 0) + (Number(b.dataset.d) || 0))); }
      this.render();
    });
    this.element.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { ev.preventDefault(); return this.close(); }
      if (ev.key === "Enter" && !ev.target.closest?.("button")) {
        ev.preventDefault();
        this.element.querySelector('button[data-hw="go"]')?.click();
      }
    });
  }
  async close(options) { if (!this.done) { this.done = true; this.o.resolve(null); } return super.close(options); }
}
/** The window: resolves to { n, plan } or null (cancelled). o as healWinHtml's, with title; n the Rally Points first shown. */
export function healWindowFull(o) {
  const n0 = Math.max(1, Number(o.n) || 1), total0 = o.partsFor(n0).reduce((t, p) => t + (Number(p[0]) || 0), 0);
  const st = { n: n0, values: { ...symmetricHealing(o.damage, o.thresholds, total0) }, split: false };
  if (!AppV2 || typeof document === "undefined") return Promise.resolve({ n: n0, plan: { ...st.values } });   // no windows (the tests): the default split
  if (typeof globalThis.__twod12Pick === "function") return Promise.resolve({ n: n0, plan: { ...st.values } });
  return new Promise(resolve => new HealWin({ ...o, st, resolve }).render({ force: true }));
}
/** The Heal window (@Heal) and the old callers: resolves to the plan or null. o: { name, damage, thresholds, total, sub, rally } */
export async function healWindow(o) {
  const res = await healWindowFull({ title: o.rally ? `Rally: ${o.name}` : `Heal: ${o.name}`, name: o.name, damage: o.damage, thresholds: o.thresholds, partsFor: () => (o.parts ?? [[o.total, o.source ?? ""]]), rally: o.rally ? { max: o.rally.max, left: o.rally.left + (o.rally.n ?? 1), top: 1 } : null, n: o.rally?.n ?? 1 });
  return res ? res.plan : null;
}

/**
 * v0.0.454 (Lucas, playtest 6, D1): the heal message, in the system's short line (sysLine, the heart), one fact a line: "Durgan heals 15", what it
 * removed ("9 Vigor, 5 Resolve, 1 Vigor Nonlethal"), then its parts when it has more than one ("9 + 3 Font of Mercy + 4 Lay On Hands"). Pure.
 * rally: the Rally Points it used and how many are left (a quiet note on the first line), npc: an NPC's heal spends none.
 */
export function healLinesHtml(name, plan, parts = [], { rally = null, npc = false } = {}) {
  const healed = Object.values(plan ?? {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const what = HEAL_ORDER.filter(([k]) => plan?.[k]).map(([k, l]) => `${plan[k]} ${l}`).join(", ");
  const note = rally ? ` <small>${npc ? "an NPC: no Rally Point spent" : `${rally.n} Rally Point${rally.n === 1 ? "" : "s"} \u00b7 ${rally.left} left`}</small>` : "";
  const sum = (parts ?? []).filter(p => Number(p[0])).length > 1 ? `<span class="hl-l q">${parts.filter(p => Number(p[0])).map(p => `${p[0]}${p[1] ? ` ${esc(p[1])}` : ""}`).join(" + ")}</span>` : "";
  return `<b>${esc(name)}</b> heals <b>${healed}</b>${note}${what ? `<span class="hl-l">${what}</span>` : '<span class="hl-l">no damage to remove</span>'}${sum}`;
}
const HEAL_ORDER = [["bodyLethal", "Vigor"], ["mindLethal", "Resolve"], ["bodyNonlethal", "Vigor Nonlethal"], ["mindNonlethal", "Resolve Nonlethal"]];
/**
 * The Bestiary's rebuild (2026-11-25; book, Bestiary, Ticks, rule 6): a heal of any size restores 1 tick to a Minion: the plan that removes one
 * point of its damage record (Lethal first, Vigor first). Pure.
 */
export function minionHealPlan(damage = {}) {
  for (const k of ["bodyLethal", "mindLethal", "bodyNonlethal", "mindNonlethal"]) if ((Number(damage?.[k]) || 0) > 0) return { [k]: 1 };
  return {};
}
/** Apply a plan to a creature (its owner, or the GM through the socket) and say it in the chat. Returns the amount removed. */
export async function applyHealing(actor, plan, { lead = "", why = "" } = {}) {
  const s = actor.system, upd = {};
  if (s?.isMinion) plan = minionHealPlan(s.damage);   // the Bestiary's rebuild: a Minion's heal is 1 tick, whatever its size
  for (const [k, v] of Object.entries(plan)) if (v) upd[`system.damage.${k}`] = Math.max(0, (s.damage[k] ?? 0) - v);
  const healed = Object.values(plan).reduce((a, b) => a + b, 0);
  if (Object.keys(upd).length) {
    if (actor.isOwner) await actor.update(upd);
    else game.socket.emit("system.twod12", { type: "applyDamage", actorUuid: actor.uuid, upd });
  }
  const { sysLine } = await import("./sysmsg.mjs");
  // v0.0.454 (D1): the same lines as a Rally's ("Durgan heals 9", what it removed, what gave it); a lead given by the caller keeps its words
  const short = String(actor.name ?? "").replace(/\s*\(.*$/, "").trim() || actor.name;
  const html = s?.isMinion ? `<b>${esc(short)}</b> regains <b>${healed ? "1 tick" : "no tick"}</b> <small>(a Minion: a heal restores 1 tick)</small>${why ? `<span class="hl-l q">${esc(why)}</span>` : ""}`
    : lead ? `${lead} <b>${healed}</b>${why ? ` <small>${esc(why)}</small>` : ""}` : `${healLinesHtml(short, plan, [])}${why ? `<span class="hl-l q">${esc(why)}</span>` : ""}`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand-holding-medical", html, "healmsg") });
  return healed;
}

/** The thresholds a creature's damage is measured against (the Health line: Vigor and Resolve). */
export const thresholdsOf = a => ({ vigor: Number(a?.system?.bdt) || 0, resolve: Number(a?.system?.healthLine?.resolve ?? a?.system?.mdt) || 0 });

/** The user who should answer for a creature: an active owner who is a player, else the active GM, else yourself. */
export function answererFor(actor) {
  const users = game.users?.filter?.(u => u.active) ?? [];
  const owner = users.find(u => !u.isGM && actor.testUserPermission?.(u, "OWNER"));
  return owner ?? users.find(u => u.isGM) ?? game.user;
}

/** A heal of `amount` for a creature: its answerer chooses the split (here when it is you, through the socket when it is another user). */
export async function promptHeal(actor, amount, { source = "", lead = "" } = {}) {
  const who = answererFor(actor);
  if (who?.id !== game.user.id) { game.socket.emit("system.twod12", { type: "healPrompt", userId: who.id, actorUuid: actor.uuid, amount, source, lead }); return; }
  await healHere(actor, amount, { source, lead });
}
export async function healHere(actor, amount, { source = "", lead = "" } = {}) {
  if (actor.system?.isMinion) return applyHealing(actor, minionHealPlan(actor.system.damage), { why: source });   // the Bestiary's rebuild: no split to choose
  const plan = await healWindow({ name: String(actor.name ?? "").replace(/\s*\(.*$/, "").trim() || actor.name, damage: actor.system.damage, thresholds: thresholdsOf(actor), total: amount, source, rally: null });
  if (!plan) return;
  await applyHealing(actor, plan, { lead, why: source });
}

/**
 * v0.0.250: the "end one effect" window (@EndEffect): the creature's answerer picks one of its effects to end, or none.
 * which: "eot1" (EoT, or 1 round left: Hallowed Dawn) or "any" (every non-permanent effect: Miraculous Recovery).
 */
export function endableEffects(actor, which = "any") {
  const out = [];
  for (const e of actor?.effects ?? []) {
    const d = e.getFlag?.("twod12", "duration"), rem = Number(e.getFlag?.("twod12", "remaining"));
    const timed = d?.type === "eot" || d?.type === "rounds";
    if (!timed) continue;
    if (which === "eot1" && !(d.type === "eot" || (d.type === "rounds" && (Number.isFinite(rem) ? rem : d.rounds) <= 1))) continue;
    out.push({ id: e.id, name: e.name, dur: d.type === "eot" ? "EoT" : `${Number.isFinite(rem) ? rem : d.rounds} round${(Number.isFinite(rem) ? rem : d.rounds) === 1 ? "" : "s"}` });
  }
  return out;
}
export async function promptEndEffect(actor, which = "any", { source = "" } = {}) {
  const who = answererFor(actor);
  if (who?.id !== game.user.id) { game.socket.emit("system.twod12", { type: "endEffectPrompt", userId: who.id, actorUuid: actor.uuid, which, source }); return; }
  await endEffectHere(actor, which, { source });
}
export async function endEffectHere(actor, which = "any", { source = "" } = {}) {
  const list = endableEffects(actor, which);
  const { sysLine } = await import("./sysmsg.mjs");
  if (!list.length) { await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-wand-magic-sparkles", `<b>${esc(actor.name)}</b> has no effect to end${source ? ` <small>${esc(source)}</small>` : ""}.`, "fxmsg") }); return; }
  const { pickWith } = await import("./pickwindow.mjs");
  const st = { chosen: "" };
  const id = await pickWith({
    title: `End an effect: ${actor.name}`,
    model: () => ({ name: "End one effect", sub: actor.name, icon: "fa-wand-magic-sparkles", stats: [["Effects", String(list.length)]],
      sections: [{ title: which === "eot1" ? "An effect that is EoT or has 1 round left" : "A non-permanent effect", pill: st.chosen ? "1" : "0", done: !!st.chosen, sub: source ? `${esc(source)}: choose one to end, or none.` : "Choose one to end, or none.", rows: [{ key: "fx", label: "", opts: list.map(x => ({ k: x.id, l: `${x.name} (${x.dur})`, on: st.chosen === x.id })) }] }],
      complete: true, message: st.chosen ? `${list.find(x => x.id === st.chosen)?.name} ends.` : "No effect ends.", confirm: st.chosen ? "End it" : "None" }),
    pick: (row, k) => { st.chosen = st.chosen === k ? "" : k; },
    input: () => {},
    result: () => st.chosen
  });
  if (id === null) return;
  const e = id ? actor.effects.get(id) : null;
  if (e) { await e.delete(); await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-wand-magic-sparkles", `<b>${esc(e.name)}</b> ends on <b>${esc(actor.name)}</b>${source ? ` <small>${esc(source)}</small>` : ""}.`, "fxmsg") }); }
}
