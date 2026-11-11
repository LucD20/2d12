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

/** Pure: the window's model. st: { values }. o: { actor name, damage, thresholds, total, totalText, rally: { n, left, max } | null, source } */
export function healModel(o, st) {
  const d = o.damage, assigned = BUCKETS.reduce((s, [k]) => s + (Number(st.values[k]) || 0), 0), total = o.total;
  const all = BUCKETS.reduce((s, [k]) => s + (d[k] ?? 0), 0);
  // v0.0.251 (Lucas): each row shows the damage now and after the healing, with minus and plus buttons (the pick window's row clicks), in fixed columns; a line says what is left to give
  const left = total - assigned;
  const rows = `<div class="hw-head"><span>Damage</span><span>Now</span><span></span><span>After</span><span>Heal</span></div>` + BUCKETS.filter(([k]) => (d[k] ?? 0) > 0).map(([k, l]) => { const n = Number(st.values[k]) || 0, after = Math.max(0, d[k] - n); return `<div class="hw-row"><span class="hw-lbl ${k.startsWith("body") ? "hw-v" : "hw-r"}">${l}</span><span class="hw-now">${d[k]}</span><span class="hw-arrow">&rarr;</span><span class="hw-after${n ? " changed" : ""}">${after}</span><span class="hw-ctl"><button type="button" data-key="pick:${k}:-1" data-row="${k}" data-k="-1"${n <= 0 ? " disabled" : ""} aria-label="less">&minus;</button><span class="hw-n">${n}</span><button type="button" data-key="pick:${k}:+1" data-row="${k}" data-k="+1"${n >= d[k] || left <= 0 ? " disabled" : ""} aria-label="more">+</button></span></div>`; }).join("")
    + `<div class="hw-left${left < 0 ? " over" : ""}">${left > 0 ? `${left} left to give` : left === 0 ? "All of it given" : `${-left} too many`}</div>`;
  const stats = [["Heal", String(total)], ["Vigor", `${(d.bodyLethal ?? 0) + (d.bodyNonlethal ?? 0)} / ${o.thresholds?.vigor ?? "?"}`], ["Resolve", `${(d.mindLethal ?? 0) + (d.mindNonlethal ?? 0)} / ${o.thresholds?.resolve ?? "?"}`]];
  if (o.rally) stats.push(["Rally Points", `${o.rally.left} of ${o.rally.max} left after`]);
  const over = assigned > total, none = all === 0;
  return {
    name: o.rally ? "Rally" : "Heal", sub: o.name, icon: o.rally ? "fa-heart-pulse" : "fa-hand-holding-medical", stats,
    sections: [{ title: o.totalText ?? `Remove up to ${total} damage`, pill: `${assigned} / ${total}`, done: !over && assigned > 0, sub: o.sub ?? "The split is symmetrical by default (each damage against its threshold); change it as you wish.", rows: [], html: none ? '<p class="cw-sub">No damage to remove.</p>' : rows }],
    complete: !over, message: over ? `${assigned} is more than the ${total} healed.` : (none ? "Nothing to heal." : `Removes ${Math.min(assigned, total)} damage.`), confirm: o.rally ? `Use ${o.rally.n} Rally Point${o.rally.n === 1 ? "" : "s"}` : "Heal"
  };
}

/** The window: resolves to the plan ({ bucket: n }) or null (cancelled). */
export async function healWindow(o) {
  const def = symmetricHealing(o.damage, o.thresholds, o.total);
  if (!globalThis.foundry?.applications?.api?.ApplicationV2) return def;   // no windows (the tests): the default split
  const { pickWith } = await import("./pickwindow.mjs");
  const st = { values: { ...def } };
  const res = await pickWith({
    title: o.rally ? `Rally: ${o.name}` : `Heal: ${o.name}`,
    model: () => healModel(o, st),
    pick: (row, k) => { if (row in st.values) { const n = st.values[row] + (Number(k) || 0); st.values[row] = Math.max(0, Math.min(o.damage[row] ?? 0, n)); } },
    input: (field, value) => { if (field in st.values) st.values[field] = Math.max(0, Math.floor(Number(value) || 0)); },
    result: () => planHealing(st.values, o.damage, o.total)
  });
  return res;
}

/** Apply a plan to a creature (its owner, or the GM through the socket) and say it in the chat. Returns the amount removed. */
export async function applyHealing(actor, plan, { lead = "", why = "" } = {}) {
  const s = actor.system, upd = {};
  for (const [k, v] of Object.entries(plan)) if (v) upd[`system.damage.${k}`] = Math.max(0, (s.damage[k] ?? 0) - v);
  const healed = Object.values(plan).reduce((a, b) => a + b, 0);
  if (Object.keys(upd).length) {
    if (actor.isOwner) await actor.update(upd);
    else game.socket.emit("system.twod12", { type: "applyDamage", actorUuid: actor.uuid, upd });
  }
  const parts = BUCKETS.filter(([k]) => plan[k]).map(([k, l]) => `${plan[k]} ${l}`).join(", ");
  const { sysLine } = await import("./sysmsg.mjs");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand-holding-medical", `${lead || `<b>${esc(actor.name)}</b> heals`} <b>${healed}</b>${parts ? ` (${parts})` : ""}${why ? ` <small>${why}</small>` : ""}.`, "healmsg") });
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
  const plan = await healWindow({ name: actor.name, damage: actor.system.damage, thresholds: thresholdsOf(actor), total: amount, sub: source ? `${esc(source)}: ${amount} healing.` : undefined, rally: null });
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
