// v0.0.283 (pack chat-cards; brief: foundry/mockups/chat-cards-brief.md, section 4.7): the damage message. Posting it, Apply (one row, or Apply all,
// which skips the rows with a choice), Undo, Full / Half / Double, and the choices the damaged creature makes (Ch. 4 Guard over both pools,
// Ch. 1 a Resist split across both pools), asked of its owner. The card itself is drawn by chatcards.mjs.
// Order per creature: the damage per subtype, then Resist / Weak / Immune (once per subtype per Action), then Guard, then Health.
// A rider (a Tier's own effects, the "After the damage" chain) lands only if the damage did: more than 0 after Resist and Immune (Ch. 1 Riders).
import * as CC from "./chatcards.mjs";
import { esc } from "./util.mjs";
import { damageOdds } from "./calc.mjs";
import { allEffects } from "./passives.mjs";
import { evalFormula, refValues } from "./fxrules.mjs";
import { effectOff } from "./escalation.mjs";
import { damageLinesFrom, damageLinesMods } from "./sheetmodel.mjs";
import { TWOD12 } from "./config.mjs";
const F = "twod12", SOCKET = "system.twod12";

const actorOf = uuid => { try { const d = fromUuidSync(uuid); return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { return null; } };
const guardOf = a => (Number(a?.system?.guard) || 0) + (Number(a?.system?.apGuard) || 0) + (Number(a?.system?.reduceNext) || 0);
/**
 * v0.0.320 (pack AU part 2): the creature's Resist / Weak / Immune: its own line (system.dmgMods, the Builder's chips) and the "Resist, Weak or Immune"
 * settings of its effects, Features and Talents that work now (an Escalation minimum, Only while it sees its origin); the highest of each counts.
 */
export function dmgModsOf(a) {
  try { return damageLinesMods(creatureDamageLines(a)); } catch (e) { console.warn("twod12 | damage lines", e); }   // v0.0.333: one source for the sheet and the card
  const extra = [];
  for (const e of allEffects(a)) {
    if (effectOff(a, e)) continue;
    for (const m of e.getFlag?.(F, "dmgMods") ?? e.flags?.[F]?.dmgMods ?? []) {
      if (!m.formula) { extra.push(m); continue; }   // v0.0.324: a formula ("@origin.pow"): the origin's values, else the creature's own
      let o = null; try { const d = e.origin ? fromUuidSync(e.origin) : null; o = d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (err) { o = null; }
      extra.push({ ...m, n: Math.trunc(Number(evalFormula(m.formula, { origin: refValues(o ?? a), target: refValues(a) }).value) || 0) });
    }
  }
  return CC.mergeDmgMods(CC.parseDmgMods(a?.system?.dmgMods ?? ""), extra);
}
const modsOf = dmgModsOf;

/**
 * v0.0.333 (PACK RWI; book, Chapter 1, Resist, Weak and Immune): every Immune / Resist / Weak line of a creature with its source, the highest of
 * each kind and subtype kept (sheetmodel.mjs damageLinesFrom). The sources: its own line (system.dmgMods: an NPC's stat block, a GM's lasting line),
 * the armor it wears and the weapons it wields (their dmgMods), the "Resist, Weak or Immune" rule of its Features and Talents (lasting) and of the
 * effects on it (temporary, with their time left). An effect that doesn't work now (an Escalation minimum, Only while it sees its origin) is left out.
 */
export function creatureDamageLines(a) {
  const names = Object.fromEntries(Object.entries(TWOD12.subtypes ?? {}).filter(([k]) => k));
  const parsed = t => { const p = CC.parseDmgMods(t ?? ""); return [...Object.entries(p.resist).map(([sub, n]) => ({ kind: "resist", sub, n })), ...Object.entries(p.weak).map(([sub, n]) => ({ kind: "weak", sub, n })), ...p.immune.map(sub => ({ kind: "immune", sub }))]; };
  const sources = [];
  if (String(a?.system?.dmgMods ?? "").trim()) sources.push({ name: a.name, type: "actor", uuid: a.uuid ?? "", lines: parsed(a.system.dmgMods) });
  for (const it of [...(a?.itemTypes?.armor ?? []).filter(i => i.system?.worn), ...(a?.itemTypes?.weapon ?? []).filter(i => i.system?.wielded)])
    if (String(it.system?.dmgMods ?? "").trim()) sources.push({ name: it.name, type: "item", uuid: it.uuid ?? "", lines: parsed(it.system.dmgMods) });
  for (const e of allEffects(a)) {
    if (effectOff(a, e)) continue;
    const list = e.getFlag?.(F, "dmgMods") ?? e.flags?.[F]?.dmgMods ?? [];
    if (!list.length) continue;
    let o = null;
    const lines = list.map(m => {
      if (!m.formula) return m;
      if (o === null) { try { const d = e.origin ? fromUuidSync(e.origin) : null; o = d?.documentName === "Actor" ? d : d?.actor ?? false; } catch (err) { o = false; } }
      return { ...m, n: Math.trunc(Number(evalFormula(m.formula, { origin: refValues(o || a), target: refValues(a) }).value) || 0) };
    });
    const pid = /^passive-(.+)-\d+$/.exec(e.id ?? "")?.[1], item = pid ? a.items?.get?.(pid) : null;
    if (item) { sources.push({ name: item.name, type: item.type === "talent" ? "talent" : "feature", uuid: item.uuid ?? "", lines }); continue; }
    if (String(e.id ?? "").startsWith("passive-")) { sources.push({ name: e.name, type: "feature", uuid: "", lines }); continue; }
    const d = e.getFlag?.(F, "duration") ?? {}, left = Number(e.getFlag?.(F, "remaining") ?? d.rounds) || 0;
    sources.push({ name: e.name, type: "effect", uuid: e.uuid ?? "", temporary: true, remaining: d.type === "rounds" && left > 0 ? left : d.type === "eot" ? "eot" : null, lines });
  }
  return damageLinesFrom(sources, names);
}

/** The preview of one row (what changes the damage for that creature) and its choice, from the creature as it is now. */
export function rowPreview(comps, actor) {
  const dm = modsOf(actor), mods = CC.dmgModsFor(comps, dm), a = CC.afterResist(comps, dm);
  // v0.0.454 (Lucas, playtest 6, D2: "2 Pi − 3 Guard = 0" read as Guard): a waiting reduction (Shield of Faith) is its own step, named, before the Guard
  const redAll = Math.max(0, Number(actor?.system?.reduceNext) || 0), red = Math.min(redAll, a.B + a.M);   // spent whole: its full value is shown
  if (redAll > 0) mods.push({ v: -redAll, label: String(actor?.system?.reduceFrom || "") || "Reduction", kind: "reduce" });
  const g = Math.min((Number(actor?.system?.guard) || 0) + (Number(actor?.system?.apGuard) || 0), a.B + a.M - red);
  if (g > 0) mods.push({ v: -g, label: "Guard", kind: "guard" });
  return { mods, choice: CC.choiceOf(comps, dm, guardOf(actor)) };
}

/** The card's model from its stored state. */
export function dmgModel(s) {
  const top = s.groups?.[0];
  let designer = null;
  try { const o = top ? damageOdds(top.comps) : null; if (o?.hasDice) designer = { avg: Math.round(o.avg * 10) / 10, atLeast: Math.round(o.atLeast * 100) }; } catch (e) { designer = null; }
  return { kind: "dmg", name: s.name, nl: !!s.nl, groups: (s.groups ?? []).map(g => ({ tier: g.tier, crit: g.crit, comps: g.comps, riders: g.riders ?? [], rows: g.rows ?? [] })), rows: s.rows ?? [], designer, note: s.note ?? "", noNl: !!s.noNl };
}

/**
 * Post a damage message. groups: [{ tier, crit, comps, fx, riders (HTML) }]; targets: [{ uuid, name, tier, crit, g (its group) }].
 * comps: [{ pool, sub, nl, total, formula, dice, kind, src, emp, label }]. The old flags (dmgCard / damage) stay for the modules that read them.
 */
export async function postCcDamage({ actor = null, title, groups, targets = [], nl = false, originUuid = "", originMod = null, after = "", areaPoint = null, strike = false, srcId = "", rolls = [], escalation = false, note = "", noNl = false, save = false, into = null, replace = false }) {   // v0.0.315: note (a short line, no ↳ box: Bleed's Save), noNl (no Lethal tag)
  const rows = targets.map(t => {
    const g = Number.isInteger(t.g) ? t.g : Math.max(0, groups.findIndex(x => x.tier === t.tier));
    const p = rowPreview(groups[g]?.comps ?? [], actorOf(t.uuid));
    return { uuid: t.uuid, name: t.name, tier: t.tier ?? groups[g]?.tier ?? 0, crit: !!t.crit, g, mods: p.mods, choice: p.choice, applied: null };
  });
  const gs = groups.map((g, i) => ({ conds: g.conds ?? [], move: g.move ?? "", tier: g.tier ?? 0, crit: !!g.crit, comps: g.comps.map(c => ({ pool: c.pool || "B", sub: c.sub ?? "", nl: c.nl, total: Number(c.total) || 0, formula: c.formula ?? "", dice: c.dice ?? [], kind: c.kind ?? "", src: c.src ?? "", emp: c.emp ?? 0, label: c.label ?? "" })), fx: g.fx ?? [], riders: g.riders ?? [], rows: rows.map((r, k) => (r.g === i ? k : -1)).filter(k => k >= 0) }));
  const state = { name: title, nl: !!nl, groups: gs, rows, originUuid, originMod, after, areaPoint, strike: !!strike, srcId, escalation: !!escalation, note, noNl: !!noNl, save: !!save };   // v0.0.334: save: from a Save Action (its chain runs on the Tiers the damage landed: 1 and 2)
  const first = gs[0];
  // v0.0.388: into a card that draws its damage (an attack or Save card); an old card (no card model) still gets a damage message
  if (into && ["attack", "save"].includes(into.getFlag?.(F, "cc")?.kind) && typeof into.update === "function") return writeInto(into, state, rolls, { replace });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(actor ? { actor } : {}), rolls, content: CC.cardContent(dmgModel(state)),
    flags: { [F]: { ccDmg: state, cc: dmgModel(state), damage: (first?.comps ?? []).map(c => ({ pool: c.pool, subtype: c.sub, total: c.total, formula: c.formula, nonlethal: c.nl })),
      dmgCard: { comps: first?.comps ?? [], targets: targets.map(t => ({ uuid: t.uuid, name: t.name, tier: t.tier, crit: !!t.crit })), name: title, fx: first?.fx ?? [], originUuid, originMod, after, areaPoint, strike: !!strike } } }
  });
}

/**
 * v0.0.388 (pack ONE, Lucas: "C"): one message per Action. The damage is written into the attack or Save card it was rolled from: the card's model
 * keeps it (flags.cc.dmg, drawn by chatcards.mjs damageInHtml) and the damage's state stays flags.ccDmg, so Apply, Undo, Full / Half / Double and the
 * chain work on that message as they did on a damage message. A Save card's later damage (creatures that rolled later) is added to it; replace
 * (the GM's "Roll the damage again") starts over. The dice show with Dice So Nice; the rolls are kept on the message.
 */
export function mergeDamage(old, add) {
  if (!old) return add;
  const s = structuredClone(old), base = s.rows.length;
  s.rows.push(...add.rows.map(r => ({ ...r, g: r.g })));
  add.groups.forEach((g, gi) => {
    const idx = add.rows.map((r, k) => (r.g === gi ? base + k : -1)).filter(k => k >= 0);
    const same = s.groups.findIndex(x => x.tier === g.tier && !!x.crit === !!g.crit);
    if (same >= 0) { s.groups[same].rows.push(...idx); idx.forEach(k => { s.rows[k].g = same; }); }
    else { s.groups.push({ ...g, rows: idx }); idx.forEach(k => { s.rows[k].g = s.groups.length - 1; }); }
  });
  return s;
}
async function writeInto(msg, state, rolls = [], { replace = false } = {}) {
  const prev = replace ? null : msg.getFlag(F, "ccDmg"), old = Array.isArray(prev?.rows) && Array.isArray(prev?.groups) ? prev : null;
  const s = mergeDamage(old, { ...state, srcId: msg.id });
  try { if (game.dice3d && rolls.length) await Promise.all(rolls.map(r => game.dice3d.showForRoll(r, game.user, true))); } catch (e) { console.warn("twod12 | Dice So Nice", e); }
  const cc = msg.getFlag(F, "cc"), next = { ...cc, dmg: dmgModel(s) }, first = s.groups[0];
  const keep = (msg.rolls ?? []).map(r => JSON.stringify(r.toJSON ? r.toJSON() : r)), added = rolls.map(r => JSON.stringify(r.toJSON ? r.toJSON() : r));
  await msg.update({ content: CC.replaceCard(msg.content, cc, next), rolls: replace ? added : [...keep, ...added], [`flags.${F}.ccDmg`]: s, [`flags.${F}.cc`]: next,
    [`flags.${F}.damage`]: (first?.comps ?? []).map(c => ({ pool: c.pool, subtype: c.sub, total: c.total, formula: c.formula, nonlethal: c.nl })) });
  return msg;
}
/** Is this message a card holding its own damage (pack ONE) rather than a damage message? */
const holdsDamage = msg => { const k = msg.getFlag(F, "cc")?.kind; return k === "attack" || k === "save"; };

async function save(msg, s) {
  if (holdsDamage(msg)) {
    const cc = msg.getFlag(F, "cc"), next = { ...cc, dmg: dmgModel(s) };
    try { await msg.update({ content: CC.replaceCard(msg.content, cc, next), [`flags.${F}.ccDmg`]: s, [`flags.${F}.cc`]: next }); return true; }
    catch (e) { ui.notifications.warn("Only the author of this card or the GM can change it."); return false; }
  }
  try { await msg.update({ content: CC.cardContent(dmgModel(s)), [`flags.${F}.ccDmg`]: s, [`flags.${F}.cc`]: dmgModel(s) }); return true; }
  catch (e) { ui.notifications.warn("Only the author of this card or the GM can change it."); return false; }
}

/* ---- the choices, asked of the creature's owner (here, or through the socket) ---- */
const waiting = new Map();
export function registerCcSocket() {
  game.socket.on(SOCKET, async d => {
    if (d?.type === "ccAsk" && d.userId === game.user.id) {
      const { pickBar } = await import("./pickbar.mjs");
      const id = await pickBar({ icon: "fa-shield-halved", text: d.text, options: d.options, cancel: "" });
      game.socket.emit(SOCKET, { type: "ccAnswer", reqId: d.reqId, id: id ?? d.options?.[0]?.id ?? "" });
    }
    if (d?.type === "ccAnswer" && waiting.has(d.reqId)) { waiting.get(d.reqId)(d.id); waiting.delete(d.reqId); }
  });
}
/** Ask the creature's answerer (an active owner who is a player, else the GM): resolves to an option's id (the first after 2 minutes). */
export async function askOwner(actor, text, options) {
  const { answererFor } = await import("./healwin.mjs");
  const who = answererFor(actor);
  if (!who || who.id === game.user.id) {
    const { pickBar } = await import("./pickbar.mjs");
    return (await pickBar({ icon: "fa-shield-halved", text, options })) ?? options[0].id;
  }
  const reqId = foundry.utils.randomID();
  return new Promise(res => {
    waiting.set(reqId, res);
    game.socket.emit(SOCKET, { type: "ccAsk", userId: who.id, reqId, text, options });
    ui.notifications.info(`Waiting for ${who.name} to choose for ${actor.name}.`);
    setTimeout(() => { if (waiting.has(reqId)) { waiting.delete(reqId); res(options[0].id); } }, 120000);
  });
}
const POOLS = [{ id: "B", label: "Vigor first" }, { id: "M", label: "Resolve first" }];

/* ---- Apply, Undo, Full / Half / Double ---- */
/** Apply one row with a factor; ask = false: a row with a choice is skipped (Apply all). Returns true when it was applied. */
async function applyRow(s, i, factor = 1, { ask = true, rerun = false } = {}) {
  const r = s.rows[i], g = s.groups[r?.g];
  if (!r || !g || (r.applied && !rerun)) return false;
  const actor = actorOf(r.uuid);
  if (!actor) { ui.notifications.warn(`${r.name} is not on the scene any more.`); return false; }
  const D = await import("./damage.mjs");
  let comps = g.comps;
  // [C] damage: the origin chooses the pool (here: the user applying it)
  if (comps.some(c => c.pool === "C")) {
    const { pickBar } = await import("./pickbar.mjs");
    const p = (await pickBar({ icon: "fa-heart", text: `<b>${esc(s.name)}</b>: the [C] damage goes to`, options: [{ id: "B", label: "Vigor" }, { id: "M", label: "Resolve" }] })) ?? "B";
    comps = comps.map(c => (c.pool === "C" ? { ...c, pool: p } : c));
  }
  const dm = modsOf(actor), choice = CC.choiceOf(comps, dm, guardOf(actor), factor);
  if (choice && !ask) return false;
  const choices = {};
  for (const x of CC.dmgModsFor(comps, dm).filter(x => x.split)) choices[x.sub] = await askOwner(actor, `<b>${esc(actor.name)}</b>: Resist ${esc(CC.subName(x.sub))} reduces which part first?`, POOLS);
  // v0.0.320 (book, Ch. 1): Weak's extra over both pools goes where the origin chooses
  const weakTo = {}, src0 = actorOf(s.originUuid ?? "");
  for (const sub of src0 ? CC.weakSplits(comps, dm) : []) weakTo[sub] = await askOwner(src0, `<b>${esc(src0.name)}</b>: Weak ${esc(CC.subName(sub))} on <b>${esc(actor.name)}</b>: the extra damage goes to`, [{ id: "B", label: "Vigor" }, { id: "M", label: "Resolve" }]);
  const a = CC.afterResist(comps, dm, { factor, choices, weakTo });
  let guardFirst = "B";
  if (guardOf(actor) > 0 && a.B > 0 && a.M > 0 && guardOf(actor) < a.B + a.M) guardFirst = await askOwner(actor, `<b>${esc(actor.name)}</b>: the Guard takes which damage first?`, POOLS);
  // Lethal / Nonlethal: a component's own, else the card's
  const nlShare = p => { const all = comps.filter(c => (c.pool === "M" ? "M" : "B") === p), tot = all.reduce((x, c) => x + c.total, 0), n = all.filter(c => c.nl ?? s.nl).reduce((x, c) => x + c.total, 0); return tot ? n / tot : (s.nl ? 1 : 0); };
  const split = (n, p) => { const k = Math.round(n * nlShare(p)); return { l: n - k, n: k }; };
  const buckets = { B: split(a.B, "B"), M: split(a.M, "M") };
  const sys = actor.system, undo = { "system.damage.bodyLethal": sys.damage.bodyLethal, "system.damage.bodyNonlethal": sys.damage.bodyNonlethal, "system.damage.mindLethal": sys.damage.mindLethal, "system.damage.mindNonlethal": sys.damage.mindNonlethal, "system.guard": sys.guard ?? 0, "system.apGuard": sys.apGuard ?? 0, "system.reduceNext": sys.reduceNext ?? 0 };
  if (r.applied?.undo) Object.assign(undo, r.applied.undo);
  const report = {};   // v0.0.463: what the reductions and the Guard took (the breakdown after Apply)
  if (a.B + a.M > 0) await D.applyToActor(actor, buckets, { announce: false, from: { uuid: s.originUuid ?? "", strike: !!s.strike }, guardFirst, report, comps, factor, nl: !!s.nl });   // pack TALENTS-PT: the components (a split, share.mjs)
  const took = { B: buckets.B.l + buckets.B.n, M: buckets.M.l + buckets.M.n };
  const bd = (Number(undo["system.damage.bodyLethal"]) || 0) + (Number(undo["system.damage.bodyNonlethal"]) || 0) + took.B, md = (Number(undo["system.damage.mindLethal"]) || 0) + (Number(undo["system.damage.mindNonlethal"]) || 0) + took.M;
  const bl = sys.bdt > 0 && bd >= sys.bdt, st = sys.mdt > 0 && md >= sys.mdt;
  const landed = CC.riderLands(a.B + a.M);
  const firstTime = !r.applied?.ridersDone;
  const origin = { ...(await import("./effects.mjs")).originInfo(s.originUuid), escalation: !!s.escalation, ...(Number.isFinite(s.originMod) ? { mod: s.originMod } : {}) };
  const E = await import("./effects.mjs");
  if (took.B + took.M > 0) {
    let src = null; try { src = s.originUuid ? await fromUuid(s.originUuid) : null; } catch (e) { src = null; }
    try { await (await import("./damagelog.mjs")).logDamage({ originUuid: s.originUuid ?? "", originName: src?.name ?? s.name ?? "", targetName: r.name, targetUuid: r.uuid ?? "", amount: took.B + took.M }); } catch (e) { console.warn("twod12 | damage log", e); }
    try { (await import("./halfhint.mjs")).clearHalfHint(s.originUuid); } catch (e) { /* none */ }
    try { await D.applyDownEffects({ ...s, fx: g.fx }, actor, r.uuid); } catch (e) { console.warn("twod12 | Down effects", e); }
    try { await (await import("./triggers.mjs")).runDamageTriggers(src, actor, r.uuid, comps); } catch (e) { console.warn("twod12 | triggers", e); }
  }
  if (firstTime) {
    const auto = (g.fx ?? []).filter(x => x.mode === "auto" && (!x.rider || landed)).map(x => x.uuid);
    if (auto.length) await E.applyEffects(auto, [r.uuid], origin);
    // v0.0.418 (playtest 5, G1-G3: Brutal Swing's Prone, Dread Whisper's Dazed, Snap Shot's Hindered): the Tier's conditions, when its damage landed
    if (landed && (g.conds ?? []).length) {
      const { applyConditionChip } = await import("./inline.mjs");
      let user = null; try { const d = s.originUuid ? await fromUuid(s.originUuid) : null; user = d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { user = null; }
      for (const chip of g.conds) { try { await applyConditionChip(chip, { targets: [{ uuid: r.uuid, name: r.name, crit: !!r.crit }], actor: user, attrVal: Number.isFinite(s.originMod) ? s.originMod : null }); } catch (e) { console.warn("twod12 | a Tier's condition", chip, e); } }
    }
    // v0.0.440 (Lucas, checklist: Seizing Cut "didn't slide automatically"): the Tier's forced movement, then the conditions written after it
    if (landed && g.move) {
      const { runTierMove } = await import("./inline.mjs");
      let user = null; try { const d = s.originUuid ? await fromUuid(s.originUuid) : null; user = d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { user = null; }
      try { await runTierMove(g.move, { targets: [{ uuid: r.uuid, name: r.name, crit: !!r.crit }], actor: user, attrVal: Number.isFinite(s.originMod) ? s.originMod : null, message: game.messages?.get?.(s.srcId) ?? null }); } catch (e) { console.warn("twod12 | a Tier's movement", e); }
    }
  }
  const rwi = [...CC.dmgModsFor(comps, dm).map(x => ({ kind: x.kind, label: x.label, v: x.v })), ...(report.mods ?? [])];   // v0.0.321: shown as icons after "Took"; v0.0.463: and the reductions and Guard (the breakdown)
  r.applied = { took, mods: rwi, state: bl && st ? "both" : bl ? "bloodied" : st ? "strained" : "", factor, undo, landed, ridersDone: true, chainDone: r.applied?.chainDone ?? false };
  return true;
}
/** The "After the damage" chain, once, for the rows just applied whose damage landed on a Tier 2 or 3 (Ch. 1 Riders). */
async function runChain(s, idx, msg = null) {   // v0.0.404: msg, the card (the chain's lines go into it)
  const list = idx.map(i => s.rows[i]).filter(r => r?.applied?.landed && !r.applied.chainDone && (s.save || (r.tier ?? 0) >= 2));
  if (!s.after || !list.length) return;
  for (const r of list) r.applied.chainDone = true;
  let actor = null; try { actor = s.originUuid ? await fromUuid(s.originUuid) : null; } catch (e) { actor = null; }
  const { runAfter } = await import("./inline.mjs");
  // pack TALENTS-PT: each target's damage as dealt (its group's components and the factor applied: Ricochet's half, bounce.mjs)
  await runAfter(s.after, { save: !!s.save, actor: actor?.documentName === "Actor" ? actor : (actor?.actor ?? null), targets: list.map(r => ({ uuid: r.uuid, name: r.name, tier: r.tier, crit: !!r.crit, comps: s.groups?.[r.g]?.comps ?? [], factor: Number(r.applied?.factor) || 1 })), attrVal: Number.isFinite(s.originMod) ? s.originMod : null, areaPoint: s.areaPoint ?? null, message: msg });
}
async function lockSource(s) {
  const src = s.srcId ? game.messages.get(s.srcId) : null;
  if (src && !src.getFlag(F, "ccApplied")) { try { await src.setFlag(F, "ccApplied", true); } catch (e) { /* not the author */ } }
}
const busy = new Set();
export async function ccDamageClick(kind, button, msg) {
  if (busy.has(msg.id)) return ui.notifications.info("This damage is being applied (or waits for a Reactions message or a choice).");
  const s0 = msg.getFlag(F, "ccDmg");
  if (!s0) return;
  if (!msg.isAuthor && !game.user.isGM) return ui.notifications.warn("Only the author of this card or the GM can apply it.");
  busy.add(msg.id);
  try {
    const s = foundry.utils.deepClone(s0), i = Number(button.dataset.row), f = Number(button.dataset.factor) || 1;
    if (kind === "ccDmgTarget") {
      const toks = game.user.targets.size ? [...game.user.targets] : (canvas.tokens?.controlled ?? []);
      if (!toks.length) return ui.notifications.warn("Target or select a token first.");
      s.rows = toks.map(t => { const p = rowPreview(s.groups[0]?.comps ?? [], t.actor); return { uuid: t.document.uuid, name: t.name, tier: s.groups[0]?.tier ?? 0, crit: !!s.groups[0]?.crit, g: 0, mods: p.mods, choice: p.choice, applied: null }; });
      s.groups.forEach((g, gi) => { g.rows = gi === 0 ? s.rows.map((r, k) => k) : []; });
      await save(msg, s);
    } else if (kind === "ccApply") { if (await applyRow(s, i, f)) { await save(msg, s); await lockSource(s); await runChain(s, [i], msg); await save(msg, s); } }
    else if (kind === "ccApplyAll") {
      const done = [];
      // v0.0.398: the multi-target card's Apply all is a Tier's (data-group): only that group's rows
      const only = button?.dataset?.rows ? button.dataset.rows.split(",").map(Number) : null;   // v0.0.400: an "N×" line's rows
      const gsel = button?.dataset?.group, inGroup = k => (only ? only.includes(k) : true) && (gsel === undefined || gsel === "" || (Number.isInteger(s.rows[k]?.g) ? s.rows[k].g === Number(gsel) : (s.groups?.[Number(gsel)]?.rows ?? []).includes(k)));
      for (const k of CC.applyAllRows(s.rows).filter(inGroup)) if (await applyRow(s, k, 1, { ask: false })) done.push(k);
      if (!done.length) ui.notifications.info("Every row left has a choice to make: apply them one by one.");
      await save(msg, s); if (done.length) await lockSource(s); await runChain(s, done, msg); await save(msg, s);
    } else if (kind === "ccUndo" || kind === "ccAdjust") {
      const r = s.rows[i];
      if (!r?.applied) return;
      const actor = actorOf(r.uuid);
      if (actor) await (await import("./damage.mjs")).writeDamage(actor, r.applied.undo);
      if (kind === "ccUndo") { r.applied = null; await save(msg, s); }
      else if (await applyRow(s, i, f, { rerun: true })) await save(msg, s);
    }
  } finally { busy.delete(msg.id); }
}

/** The damage stamp opens its roll card: the chat scrolls to it and it flashes. */
export function openSource(msg) {
  const id = msg.getFlag(F, "ccDmg")?.srcId;
  const el = id ? document.querySelector(`#chat [data-message-id="${id}"], .chat-log [data-message-id="${id}"]`) : null;
  if (!el) return ui.notifications.info("Its roll card is not in the chat log any more.");
  el.querySelector(".cc-card")?.classList.remove("collapsed");
  import("./chatscroll.mjs").then(m => m.releaseChatLogs()).catch(() => {});   // v0.0.421: this scroll unpins the chat (it doesn't jump back down)
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("cc-flash"); setTimeout(() => el.classList.remove("cc-flash"), 1600);
}

/** v0.0.346: an Action's card in a window (the start-of-the-encounter stack's Card button). */
export async function openItemCardWindow(item) {
  const { buildSoloCard } = await import("./actioncard.mjs");
  const html = await buildSoloCard(item);
  const { ApplicationV2 } = foundry.applications.api;
  class CardWindow extends ApplicationV2 {
    static DEFAULT_OPTIONS = { classes: ["twod12", "cc-window"], window: { resizable: true }, position: { width: 440, height: "auto" } };
    async _renderHTML() { const d = document.createElement("div"); d.className = "twod12 chat"; d.innerHTML = html; return d; }
    _replaceHTML(result, content) { content.replaceChildren(result); }
  }
  new CardWindow({ window: { title: item?.name ?? "Card" } }).render(true);
}

/** The Card button: the Action's full card in a window, with the roll's sources (the same as the breakdown's hovers: never hover-only). */
export async function openCardWindow(msg) {
  const f = msg.getFlag(F, "action"), m = msg.getFlag(F, "cc");
  let item = null;
  try { const a = f?.actorUuid ? await fromUuid(f.actorUuid) : null; item = a?.items?.get?.(f.itemId) ?? null; } catch (e) { item = null; }
  // v0.0.322 (Lucas): the new card (as the sheets show it), with its title line; "This roll" stays under it
  const { buildSoloCard } = await import("./actioncard.mjs");
  const card = item ? await buildSoloCard(item) : "";
  const src = (m?.rows ?? []).map(r => {
    const bb = CC.boonBaneLines(r).map(x => `${x.kind === "boon" ? "Boon" : "Bane"} ${x.val >= 0 ? "+" : "−"}${Math.abs(x.val)}${x.name ? `: ${esc(x.name)}` : ""}`);
    const mods = (r.mods ?? []).filter(x => Number(x.v)).map(x => `${x.v > 0 ? "+" : "−"}${Math.abs(x.v)} ${esc(x.label)}`);
    return `<li><b>${esc(r.name || "Roll")}</b>: 2d12 ${r.d1.join("+")} · ${r.d2.join("+")}${r.dropped ? ` (dropped ${r.dropped.join("+")})` : ""}${[...bb, ...mods].length ? `; ${[...bb, ...mods].join("; ")}` : ""} = ${r.total}</li>`;
  }).join("");
  const extra = (m?.sources ?? []).map(x => `<li>${esc(x)}</li>`).join("");
  const html = `${card}${src || extra ? `<div class="cc-card cc-srcs"><b>This roll</b><ul>${src}${extra}</ul></div>` : ""}`;
  const { ApplicationV2 } = foundry.applications.api;
  class CardWindow extends ApplicationV2 {
    static DEFAULT_OPTIONS = { classes: ["twod12", "cc-window"], window: { resizable: true }, position: { width: 440, height: "auto" } };
    async _renderHTML() { const d = document.createElement("div"); d.className = "twod12 chat"; d.innerHTML = html; return d; }
    _replaceHTML(result, content) { content.replaceChildren(result); }
  }
  new CardWindow({ window: { title: item?.name ?? m?.name ?? "Card" } }).render(true);
}
