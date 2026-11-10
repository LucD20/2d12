import { runDamageTriggers } from "./triggers.mjs";
import { logDamage } from "./damagelog.mjs";
import { targetLine } from "./actions.mjs";
import { esc } from "./roll.mjs";
import { applyEffects, originInfo, applyCondition, applyBoonEffect } from "./effects.mjs";
import { absorbGuard, guardBefore, guardAfter } from "./guard.mjs";
import { sysLine } from "./sysmsg.mjs";
import { clearHalfHint } from "./halfhint.mjs";   // v0.0.261 (Covering Shot)
const { DialogV2 } = foundry.applications.api;
const SOCKET = "system.twod12";

/**
 * Apply damage buckets { B: {l, n}, M: {l, n} } (lethal / nonlethal) to an actor (via the GM when needed).
 * v0.0.181: the actor's Guard takes the damage first (guard.mjs); the buckets are changed in place to what reached the Health,
 * so the callers count, log and trigger only that. Returns what the Guard took.
 */
export async function applyToActor(actor, a, opts = {}) {
  const { announce = true, from = null } = opts;
  if (!actor) return 0;
  let M = null;
  try { M = await import("./moment.mjs"); } catch (e) { M = null; }
  // v0.0.272 (pack RX): before anything lands, the Interrupts of "a Strike would damage an ally" (from: a Strike's damage card) and "an ally takes
  // damage" (some of it would reach the Health) hold it until every row of the Reactions message is answered; what they did (a Guard, a reduction)
  // is read below, and a Tier 3's half halves it here.
  // v0.0.275 (pack RX-2): the Reactions message's ids, so the result (the final damage, what the protection took off) is written into it
  const rxIds = [];
  let rxGained = 0;
  if (M && a.B.l + a.B.n + a.M.l + a.M.n > 0) {
    try {
      const r = await M.damageMoment(actor, a, from, reachesHealth(actor, a));
      rxIds[0] = r.id || ""; rxGained = r.gained || 0;
      // v0.0.275 (the book, Chapter 2: an invalid target): the attacker dropped before its Strike landed: the held damage never lands
      if (r.never) { for (const p of ["B", "M"]) for (const k of ["l", "n"]) a[p][k] = 0; await M.noteLanded(rxIds, { never: true, final: 0 }); return 0; }
      if (r.half) { const off = M.halveHeld(a); if (off) ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-shield-halved", `<b>${esc(actor.name)}</b> takes <b>half</b> of the damage${r.halfBy ? ` (${esc(r.halfBy)})` : ""}: <b>${off}</b> turned away.`, "fxm") }); }
    } catch (e) { console.warn("twod12 | moment", e); }
  }
  const d = actor.system.damage, upd = {}, early = {};
  // v0.0.243 (pack R): the Guard of the kept AP (system.apGuard) is taken before the other Guard; both are one "Guard N" on the line.
  // v0.0.254 (Shield of Faith): a reduction waiting on the creature takes from this damage first, then it is spent whatever is left of it
  const red = Math.max(0, Math.floor(Number(actor.system.reduceNext) || 0));
  if (red) { const r = absorbGuard(red, a, 0); a.B = r.a.B; a.M = r.a.M; a.reduced = r.taken; a.reduceLeft = 0; early["system.reduceNext"] = 0; if (r.taken && announce) ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-shield-halved", `<b>${esc(actor.name)}</b>'s damage is reduced by <b>${r.taken}</b>${red > r.taken ? ` (of ${red}; the rest is spent)` : ""}.`, "guardmsg") }); }
  const g = absorbGuard(actor.system.guard, a, actor.system.apGuard, opts.guardFirst === "M" ? "M" : "B");   // v0.0.283: the creature's choice of pool
  if (g.taken) { a.B = g.a.B; a.M = g.a.M; early["system.guard"] = g.guard; early["system.apGuard"] = g.apGuard; a.guardLeft = g.guard + g.apGuard; }
  // v0.0.272: the Guard and the reduction this damage used are written first, so a Guard a "would go Down" Reaction gives is not overwritten
  if (Object.keys(early).length) await writeDamage(actor, early);
  // v0.0.261 (Lucas, Divine Intervention): a creature that would go Down: the Reactions that watch for that moment are offered first (v0.0.272:
  // the Reactions message); used, the damage stops 1 under the Health Pool. Nothing is applied until the answers come.
  let downing = false;
  try {
    downing = !!M?.wouldGoDown(actor, a);
    const dm = downing ? await M.downMoment(actor, a, from) : null;
    if (dm?.id) rxIds[1] = dm.id;
    if (dm?.saved) { downing = false; const cut = M.capAtPool(actor, a); if (cut && announce !== null) ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand-holding-heart", `<b>${esc(actor.name)}</b> stays up: <b>${cut}</b> damage turned away, 1 under the Health Pool.`, "fxm") }); }
  } catch (e) { console.warn("twod12 | moment", e); }
  const add = (k, amt) => { if (amt) upd[`system.damage.${k}`] = (upd[`system.damage.${k}`] ?? d[k]) + amt; };
  add("bodyLethal", a.B.l); add("bodyNonlethal", a.B.n); add("mindLethal", a.M.l); add("mindNonlethal", a.M.n);
  if (g.taken && announce) ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-shield-halved", `<b>${esc(actor.name)}</b>'s Guard takes <b>${g.taken}</b> damage${g.takenAp ? ` (${g.takenAp} from the kept AP)` : ""}${a.guardLeft ? ` (Guard ${a.guardLeft} left)` : " and ends"}.`) });
  if (Object.keys(upd).length) await writeDamage(actor, upd);
  // v0.0.275: the result into the Reactions message(s): the final damage, and what the Reactions' protection took off (a reduction, a Guard)
  if (rxIds.some(Boolean)) { try { const final = a.B.l + a.B.n + a.M.l + a.M.n; await M.noteLanded(rxIds[0], { final, blocked: Math.min(rxGained, (Number(a.reduced) || 0) + (Number(g.taken) || 0)) }); if (rxIds[1]) await M.noteLanded(rxIds[1], { final, cut: a.momentCut || 0 }); } catch (e) { console.warn("twod12 | moment", e); } }
  // v0.0.272: the damage landed: the Triggers of these moments are offered now (they hold nothing)
  try { M?.landedMoment(actor, a.B.l + a.B.n + a.M.l + a.M.n, from, downing); } catch (e) { console.warn("twod12 | moment", e); }
  // v0.0.294 (brief section 13): a held damage landed: the Reactions' cards on this creature unlock their "After the damage" step (Bulwark of Faith's Slide)
  if (rxIds[0]) { try { const { afterLanded } = await import("./noroll.mjs"); await afterLanded(actor); } catch (e) { console.warn("twod12 | After the damage", e); } }
  return g.taken;
}
/** The actor's update, through the GM when this user doesn't own it. */
export async function writeDamage(actor, upd) {
  if (actor.isOwner) await actor.update(upd);
  else game.socket.emit(SOCKET, { type: "applyDamage", actorUuid: actor.uuid, upd });
}
/** Pure: would some of this damage reach the Health (after a waiting reduction and the Guard)? */
export function reachesHealth(actor, a) {
  const c = { B: { ...a.B }, M: { ...a.M } }, red = Math.max(0, Math.floor(Number(actor?.system?.reduceNext) || 0));
  let left = red ? absorbGuard(red, c, 0).a : c;
  left = absorbGuard(actor?.system?.guard, left, actor?.system?.apGuard).a;
  return left.B.l + left.B.n + left.M.l + left.M.n > 0;
}

export function registerSocket() {
  game.socket.on(SOCKET, async data => {
    // v0.0.250 (cards 3): prompts addressed to one user (the creature's answerer): the Heal window and the "end one effect" window
    if (data?.userId && data.userId === game.user.id) {
      if (String(data.type).startsWith("rx")) return (await import("./moment.mjs")).onSocket(data);   // v0.0.272 (pack RX): the Reactions message (an answer, a Reaction to run, its result)
      const H = await import("./healwin.mjs"), a = await fromUuid(data.actorUuid), actor = a?.documentName === "Actor" ? a : a?.actor;
      if (!actor) return;
      if (data.type === "healPrompt") return H.healHere(actor, data.amount, { source: data.source, lead: data.lead });
      if (data.type === "endEffectPrompt") return H.endEffectHere(actor, data.which, { source: data.source });
    }
    if (!game.user.isActiveGM) return;
    if (data?.type === "applyEffects") return applyEffects(data.effectUuids, data.targetUuids, data.origin, data.over);
    if (data?.type === "applyBoon") { const a = await fromUuid(data.actorUuid); if (a) await applyBoonEffect(a, data.cfg, data.origin); return; }
    if (data?.type === "applyCondition") { const a = await fromUuid(data.actorUuid); if (a) await applyCondition(data.cond, [a], data.dur, data.origin); return; }
    if (data?.type === "markOnce") { const a = await fromUuid(data.actorUuid); if (a) await (await import("./automation.mjs")).markOnce(a, data.keys); return; }   // v0.0.186
    if (data?.type === "applyGuard") { const a = await fromUuid(data.actorUuid); if (a) await a.update({ "system.guard": Math.max(0, Number(data.value) || 0) }); return; }
    if (data?.type === "halfHint") { const a = await fromUuid(data.actorUuid); const actor = a?.documentName === "Actor" ? a : a?.actor; if (actor) await (data.info ? actor.setFlag("twod12", "halfHint", data.info) : actor.unsetFlag("twod12", "halfHint")); return; }   // v0.0.261 (Covering Shot)
    if (data?.type === "applyApGuard") { const a = await fromUuid(data.actorUuid); if (a) await a.update({ "system.apGuard": Math.max(0, Number(data.value) || 0) }); return; }   // v0.0.243: a kept AP paid a Reaction
    if (data?.type !== "applyDamage") return;
    const actor = await fromUuid(data.actorUuid);
    const upd = Object.fromEntries(Object.entries(data.upd).filter(([k]) => k.startsWith("system.damage.") || k === "system.guard" || k === "system.apGuard" || k === "system.reduceNext"));
    if (actor && Object.keys(upd).length) await actor.update(upd);
  });
}

export const summaryText = a => [[a.B.l, "Vigor"], [a.B.n, "Vigor Nonlethal"], [a.M.l, "Resolve"], [a.M.n, "Resolve Nonlethal"]].filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(", ");

/** Apply a list of damage components (pool, nl, total) to an actor right away; returns a text summary. */
export async function dealDamage(actor, comps) { return (await dealDamageEx(actor, comps)).text; }

/**
 * v0.0.320 (pack AU part 2; book, Ch. 1): the Save cards that still deal their damage at once (an Area Save's rows) apply Resist / Weak / Immune too
 * (once per subtype, both pools together), and say whether the damage landed: its riders (the Tier's effects) happen only if it did.
 * Returns { text, landed, mods: ["Resist 2 Fire"] }.
 */
export async function dealDamageEx(actor, comps) {
  const list = [];
  let cTot = 0;
  for (const c of comps ?? []) { if (c.pool === "C") cTot += Number(c.total) || 0; else list.push(c); }
  if (cTot) { const p = (await chooseChoicePool(cTot)) ?? "B"; for (const c of comps) if (c.pool === "C") list.push({ ...c, pool: p }); }
  const CC = await import("./chatcards.mjs");
  let dm = { resist: {}, weak: {}, immune: [] };
  try { dm = (await import("./ccdamage.mjs")).dmgModsOf(actor); } catch (e) { console.warn("twod12 | Resist", e); }
  const mods = CC.dmgModsFor(list, dm).map(x => x.label), after = CC.afterResist(list, dm);
  // Lethal and Nonlethal keep their share of each pool
  const share = p => { const all = list.filter(c => (c.pool === "M" ? "M" : "B") === p), tot = all.reduce((x, c) => x + (Number(c.total) || 0), 0), n = all.filter(c => c.nl).reduce((x, c) => x + (Number(c.total) || 0), 0); return tot ? n / tot : 0; };
  const cut = (n, p) => { const k = Math.round(n * share(p)); return { l: n - k, n: k }; };
  const a = { B: cut(after.B, "B"), M: cut(after.M, "M") };
  const total = after.B + after.M, landed = total > 0;
  const tail = mods.length ? ` (${mods.join(", ")})` : "";
  if (!landed) return { text: `no damage${tail}`, landed, mods };
  const taken = await applyToActor(actor, a, { announce: false });
  // plain text: the Save cards escape it
  const text = taken ? `${guardBefore(total, taken)}${summaryText(a) || "no damage"} (${a.guardLeft ? `Guard ${a.guardLeft} left` : "the Guard ends"})${tail}` : `${summaryText(a)}${tail}`;
  return { text, landed, mods };
}

async function chooseChoicePool(amount) {
  return DialogV2.prompt({
    window: { title: "Choice damage" },
    content: `<p>Apply ${amount} Choice [C] damage to:</p><label><input type="radio" name="p" value="B" checked> Vigor</label> <label><input type="radio" name="p" value="M"> Resolve</label>`,
    ok: { label: "Apply", callback: (ev, btn) => new FormData(btn.form).get("p") }, rejectClose: false
  });
}

async function retarget(msg) {
  const toks = game.user.targets.size ? [...game.user.targets] : (canvas.tokens?.controlled ?? []);
  if (!toks.length) return ui.notifications.warn("Select or target a token first.");
  const targets = toks.map(t => ({ uuid: t.document.uuid, name: t.name }));
  const content = msg.content.replace(/<div class="tline">[\s\S]*?<\/div>/, targetLine(targets));
  try { await msg.update({ content, "flags.twod12.dmgCard.targets": targets }); }
  catch (e) { ui.notifications.warn("Only the author of this card or the GM can change its target."); }
}

async function apply(msg, button, factor) {
  const f = msg.getFlag("twod12", "dmgCard");
  if (!f) return;
  const targets = f.targets ?? [];
  const selNl = button.closest(".dmg")?.querySelector(".kind")?.value === "nonlethal";
  const half = n => (factor === 1 ? n : Math.ceil(n * factor));
  const b = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 }, C: { l: 0, n: 0 } };
  for (const c of f.comps ?? []) { const k = b[c.pool] ? c.pool : "B"; b[k][(c.nl ?? selNl) ? "n" : "l"] += c.total; }
  const a = { B: { l: half(b.B.l), n: half(b.B.n) }, M: { l: half(b.M.l), n: half(b.M.n) } };
  const cTotal = half(b.C.l) + half(b.C.n);
  if (a.B.l + a.B.n + a.M.l + a.M.n + cTotal > 0) {
    if (!targets.length) ui.notifications.warn("No target: use the target button first.");
    else {
      if (cTotal) {
        const p = await chooseChoicePool(cTotal);
        if (!p) return;
        a[p].l += half(b.C.l); a[p].n += half(b.C.n);
      }
      const lines = [];
      for (const t of targets) {
        const actor = (await fromUuid(t.uuid))?.actor;
        if (!actor) continue;
        const mine = { B: { ...a.B }, M: { ...a.M } };   // each target's Guard takes its own share (v0.0.181)
        const before = mine.B.l + mine.B.n + mine.M.l + mine.M.n, taken = await applyToActor(actor, mine, { announce: false, from: { uuid: f.originUuid ?? "", strike: !!f.strike } });
        const dealt = mine.B.l + mine.B.n + mine.M.l + mine.M.n;
        // v0.0.182: one line per creature, the Guard in it: "12 − Guard 5 = 7 Body"
        lines.push(`${esc(t.name)} takes ${guardBefore(before, taken, mine.reduced)}<b>${summaryText(mine) || "no damage"}</b>${guardAfter(taken, mine.guardLeft, mine.reduced, mine.reduceLeft)}`);
        const src = f.originUuid ? await fromUuid(f.originUuid) : null;
        await logDamage({ originUuid: f.originUuid ?? "", originName: src?.name ?? f.name ?? "", targetName: t.name, amount: dealt });
        clearHalfHint(f.originUuid);   // v0.0.261 (Covering Shot): the lit Half was for this damage
        await applyDownEffects(f, actor, t.uuid);   // v0.0.266 (Deathmark): the effects that come when the target goes Down
        if (dealt > 0) await runDamageTriggers(src, actor, t.uuid, f.comps ?? []);   // "When you deal Holy damage to a Profane creature..." (triggers.mjs)
      }
      // v0.0.183: the result goes on the damage card itself, under its target line (a new message only when this user can't change the card).
      const result = `${lines.join("<br>")} damage${factor === 1 ? "" : (factor === 2 ? " (double)" : " (half)")}.`;
      const block = `<div class="applied dres"><i class="fa-solid fa-heart-crack"></i> ${result}</div>`;
      const was = String(msg.content ?? "");
      const content = /<div class="applied dres">[\s\S]*?<\/div>/.test(was) ? was.replace(/<div class="applied dres">[\s\S]*?<\/div>/, block)
        : was.replace(/(<div class="tline">[\s\S]*?<\/div>)/, `$1${block}`);
      let onCard = false;
      if (content !== was && (msg.isOwner || game.user.isGM)) { try { await msg.update({ content }); onCard = true; } catch (e) { /* not the author */ } }
      if (!onCard) await ChatMessage.create({ content: `<div class="twod12 chat">${lines.join("<br>")} damage${factor === 1 ? "" : (factor === 2 ? " (double)" : " (half)")} from ${esc(f.name)}.</div>` });
    }
  }
  else ui.notifications.info("This card deals 0 damage.");
  try { await msg.setFlag("twod12", "collapsed", true); } catch (e) { /* not the author */ }
  const auto = (f.fx ?? []).filter(x => x.mode === "auto").map(x => x.uuid);
  if (auto.length) await applyEffects(auto, targets.map(t => t.uuid), { ...originInfo(f.originUuid), escalation: !!f.escalation, ...(Number.isFinite(f.originMod) ? { mod: f.originMod } : {}) });
  // v0.0.246 (cards 1): the Version's "After the damage" chips, one after the other (Smite 3 AP: who gains the Guard, then the Pushes)
  if (f.after) await runAfterDamage(f, targets);
}

/** The after-damage chain of a damage card: the chips run for the card's creature, with its targets and its Modifier. */
async function runAfterDamage(f, targets) {
  let actor = null;
  try { actor = f.originUuid ? await fromUuid(f.originUuid) : null; } catch (e) { /* not loaded */ }
  const { runAfter } = await import("./inline.mjs");
  await runAfter(f.after, { actor: actor?.documentName === "Actor" ? actor : (actor?.actor ?? null), targets: (targets ?? []).map(t => ({ uuid: t.uuid, name: t.name, tier: t.tier, crit: !!t.crit })), attrVal: Number.isFinite(f.originMod) ? f.originMod : null, areaPoint: f.areaPoint ?? null });
}

/** v0.0.266 (Lucas, Deathmark): a Version's effects with the mode "when the target is Down" come by themselves once the damage put it at its Pool (the Effects button stays, for a miss-click). */
export async function applyDownEffects(f, actor, targetUuid) {
  const uuids = (f?.fx ?? []).filter(x => x.mode === "down").map(x => x.uuid);
  if (!uuids.length || !actor?.system?.atZero) return;
  await applyEffects(uuids, [targetUuid], { ...originInfo(f.originUuid), escalation: !!f.escalation, ...(Number.isFinite(f.originMod) ? { mod: f.originMod } : {}) });
}
const isConditional = x => x.mode === "conditional" || x.mode === "down";   // v0.0.266: a "when Down" effect is on the Effects button too
async function applyConditional(msg) {
  const f = msg.getFlag("twod12", "dmgCard");
  const uuids = (f?.fx ?? []).filter(isConditional).map(x => x.uuid);
  if (uuids.length) await applyEffects(uuids, (f.targets ?? []).map(t => t.uuid), { ...originInfo(f.originUuid), escalation: !!f.escalation, ...(Number.isFinite(f.originMod) ? { mod: f.originMod } : {}) });
}

async function toggleBlock(msg, button) {
  button.classList.toggle("active");
  const on = button.classList.contains("active");
  try { await msg.update({ content: msg.content.replace(/class="blk( active)?"/, `class="blk${on ? " active" : ""}"`) }); } catch (e) { /* not the author */ }
}

/** One creature of a merged damage card takes its damage (x factor); returns what happened, or null when nothing was applied. */
async function applyRow(f, row, factor, selNl) {
  const b = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 }, C: { l: 0, n: 0 } };
  for (const c of row.comps ?? []) { const k = b[c.pool] ? c.pool : "B"; b[k][(c.nl ?? selNl) ? "n" : "l"] += c.total; }
  const h = n => (factor === 1 ? n : Math.ceil(n * factor));
  const a = { B: { l: h(b.B.l), n: h(b.B.n) }, M: { l: h(b.M.l), n: h(b.M.n) } };
  const cTotal = h(b.C.l) + h(b.C.n);
  if (cTotal) { const p = await chooseChoicePool(cTotal); if (!p) return null; a[p].l += h(b.C.l); a[p].n += h(b.C.n); }
  const actor = (await fromUuid(row.uuid))?.actor;
  if (!actor) return null;
  const before = a.B.l + a.B.n + a.M.l + a.M.n;
  const taken = before > 0 ? await applyToActor(actor, a, { announce: false, from: { uuid: f.originUuid ?? "", strike: !!f.strike } }) : 0;   // v0.0.181: the Guard takes its part first, a is what is left
  const dealt = a.B.l + a.B.n + a.M.l + a.M.n;
  if (dealt > 0) {
    const src = f.originUuid ? await fromUuid(f.originUuid) : null;
    await logDamage({ originUuid: f.originUuid ?? "", originName: src?.name ?? f.name ?? "", targetName: row.name, amount: dealt });
    clearHalfHint(f.originUuid);   // v0.0.261 (Covering Shot)
    await applyDownEffects({ ...f, fx: row.fx }, actor, row.uuid);   // v0.0.266 (Deathmark)
    await runDamageTriggers(src, actor, row.uuid, row.comps ?? []);   // "When you deal Holy damage to a Profane creature..." (triggers.mjs)
  }
  const auto = (row.fx ?? []).filter(x => x.mode === "auto").map(x => x.uuid);
  if (auto.length) await applyEffects(auto, [row.uuid], { ...originInfo(f.originUuid), escalation: !!f.escalation, ...(Number.isFinite(f.originMod) ? { mod: f.originMod } : {}) });
  const parts = [[a.B.l, "Vigor"], [a.B.n, "Vigor Nonlethal"], [a.M.l, "Resolve"], [a.M.n, "Resolve Nonlethal"]].filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(", ");
  const mult = factor === 0.5 ? " (half)" : factor === 2 ? " (double)" : "";
  if (taken || a.reduced) return { dealt, text: `${guardBefore(before, taken, a.reduced)}<b>${esc(parts) || "no damage"}</b>${mult}${guardAfter(taken, a.guardLeft, a.reduced, a.reduceLeft)}` };   // v0.0.182; v0.0.255: the reduction too
  return { dealt, text: dealt > 0 ? `<b>${esc(parts)}</b>${mult}` : "No damage" };
}

/** Redraw a merged card after a change (only its author or the GM can). */
async function updateMulti(msg, f, rows, kind) {
  const { multiDamageHtml } = await import("./dmgcard.mjs");
  try {
    await msg.update({ content: multiDamageHtml({ title: f.name, rows, color: f.color, defaultNl: f.defaultNl, kind }), "flags.twod12.dmgMulti.rows": rows, "flags.twod12.dmgMulti.kind": kind });
    // v0.0.249 (Lucas): the card stays open once every row is applied (the selector goes instead)
  } catch (e) { ui.notifications.warn("Only the author of this card or the GM can change it."); }
}

const kindOf = button => (button.closest(".dmg")?.querySelector(".kind")?.value === "nonlethal" ? "nonlethal" : "lethal");

async function multiApply(msg, button, factor, only = null) {
  const f = msg.getFlag("twod12", "dmgMulti");
  if (!f) return;
  const kind = kindOf(button), rows = f.rows.map(r => ({ ...r })), done = [];
  for (const [i, r] of rows.entries()) {
    if (only != null && i !== only) continue;
    if (r.applied || (only == null && r.blocked)) continue;
    const res = await applyRow(f, r, factor, kind === "nonlethal");
    if (res) { r.applied = res.text; if (r.tier >= 2) done.push(r); }
  }
  await updateMulti(msg, f, rows, kind);
  if (f.after && done.length) await runAfterDamage(f, done);   // v0.0.246: once, for the creatures just damaged on Tier 2 or 3
}

async function multiBlock(msg, button) {
  const f = msg.getFlag("twod12", "dmgMulti"), i = Number(button.dataset.row);
  if (!f?.rows?.[i]) return;
  const rows = f.rows.map(r => ({ ...r })); rows[i].blocked = !rows[i].blocked;
  await updateMulti(msg, f, rows, kindOf(button));
}

async function multiFx(msg, button) {
  const f = msg.getFlag("twod12", "dmgMulti"), r = f?.rows?.[Number(button.dataset.row)];
  const uuids = (r?.fx ?? []).filter(isConditional).map(x => x.uuid);
  if (uuids.length) await applyEffects(uuids, [r.uuid], { ...originInfo(f.originUuid), escalation: !!f.escalation, ...(Number.isFinite(f.originMod) ? { mod: f.originMod } : {}) });
}

// v0.0.272 (pack RX): while a damage card's damage waits for a Reactions message, its buttons do nothing (no second click lands it twice)
const holding = new Set();
export async function damageButton(kind, button, msg) {
  if (["rowApply", "allApply", "applyDouble", "applyDamage", "applyHalf"].includes(kind)) {
    if (holding.has(msg.id)) return ui.notifications.info("This damage waits for the Reactions message: answer it (or skip it) first.");
    holding.add(msg.id);
    try { return await damageClick(kind, button, msg); } finally { holding.delete(msg.id); }
  }
  return damageClick(kind, button, msg);
}
async function damageClick(kind, button, msg) {
  if (kind === "rowApply") return multiApply(msg, button, Number(button.dataset.factor) || 1, Number(button.dataset.row));
  if (kind === "allApply") return multiApply(msg, button, Number(button.dataset.factor) || 1);
  if (kind === "rowBlock") return multiBlock(msg, button);
  if (kind === "rowFx") return multiFx(msg, button);
  if (kind === "applyDouble") return apply(msg, button, 2);
  if (kind === "applyFx") return applyConditional(msg);
  if (kind === "retarget") return retarget(msg);
  if (kind === "applyDamage") return apply(msg, button, 1);
  if (kind === "applyHalf") return apply(msg, button, 0.5);
  if (kind === "block") return toggleBlock(msg, button);
}
