// v0.0.310 (Lucas's design, the "FAB · GM window" mockup): the Initiative windows' pure model. No Foundry here: initwindow.mjs builds the
// creatures from the combatants and draws what this returns; the tests load it.
//
// A creature: { id, name (no build), img, actorId, pc, npc, ally (a Friendly NPC), owner (the player's name or ""), disp (token disposition),
//   hidden, mods: { body, mind, appeal, instinct }, rolled (its initiative or null), rolledAttr, rolledBy, dying,
//   fx: { boons, banes, fav, doom, favBy, doomBy, exh, chips: [text] } (its effects, which fill the row by themselves),
//   set: { who: "gm" | "wait", attr, fav, doom, boons, banes, side, last } (the GM's settings: the combatant flag twod12.init) }.
// call: { attr } (the Attribute the GM calls: Instinct by default). ui: { closed: { side }, open: { stackKey }, moving: { id } }.

import { minionGroupOf } from "./roundrules.mjs";   // v0.0.440: the Minions' squads (pure)

export const ATTRS = ["body", "mind", "appeal", "instinct"];
export const ATTR_NAMES = { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" };
export const ATTR_COLORS = { body: "#8f1d1d", mind: "#1f4a8f", appeal: "#7a5a00", instinct: "#1d6338" };
/** The sides, in their order (Fourth: one the GM makes by moving a creature). */
export const SIDES = [
  { key: "friendly", name: "Heroes", tag: "Friendly · wins ties", bg: "#dfe7f1", disp: 1 },
  { key: "hostile", name: "Enemies", tag: "Hostile", bg: "#f1dfdb", disp: -1 },
  { key: "neutral", name: "Third side", tag: "Neutral", bg: "#e9e4d3", disp: 0 },
  { key: "fourth", name: "Fourth side", tag: "moved by the GM", bg: "#e4e0ea", disp: -3 }
];
const SIDE_BY = Object.fromEntries(SIDES.map(s => [s.key, s]));
/** The number the turn order sorts sides by (combat.mjs zipper: higher first on a tie); Secret counts as Hostile. */
export const sideDisp = key => SIDE_BY[key]?.disp ?? -1;
export const STACK_OVER = 5;   // stacks only with MORE than 5 enemies

const sgn = n => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The side of a creature: the GM's move, else its token's disposition (Secret and anything below Hostile count as Hostile). */
export function sideOf(cr) {
  const s = cr?.set?.side;
  if (s && SIDE_BY[s]) return s;
  const d = Number(cr?.disp);
  return d === 1 ? "friendly" : d === 0 ? "neutral" : "hostile";
}
/** Who rolls: the GM's choice, else a PC waits for its player and an NPC is the GM's. */
export const whoOf = cr => (cr?.set?.who === "gm" || cr?.set?.who === "wait" ? cr.set.who : (cr?.pc ? "wait" : "gm"));
/** The Attribute a creature rolls: its own, else the one the GM calls. */
export const attrOf = (cr, call) => (ATTRS.includes(cr?.set?.attr) ? cr.set.attr : (ATTRS.includes(call?.attr) ? call.attr : "instinct"));
export const isRolled = cr => cr?.rolled !== null && cr?.rolled !== undefined;
export const goesLast = cr => !!cr?.set?.last;
/** Anything the GM changed from a plain roll (the orange row): its own Check, Favored, Doomed, Boons, Banes. Effects are not the GM's. */
export const changedOf = (cr, call) => !isRolled(cr) && ((ATTRS.includes(cr?.set?.attr) && cr.set.attr !== (call?.attr ?? "instinct")) || !!cr?.set?.fav || !!cr?.set?.doom || (Number(cr?.set?.boons) || 0) > 0 || (Number(cr?.set?.banes) || 0) > 0);
/** What the roll is: the effects' and the GM's together. Favored and Doomed both: a normal roll (performCheck cancels them). */
export function rollOf(cr, call) {
  const fx = cr?.fx ?? {}, set = cr?.set ?? {}, attr = attrOf(cr, call);
  const boons = (Number(fx.boons) || 0) + (Number(set.boons) || 0), banes = (Number(fx.banes) || 0) + (Number(set.banes) || 0);
  return { attr, mod: Number(cr?.mods?.[attr]) || 0, boons, banes, manualBoons: Number(set.boons) || 0, manualBanes: Number(set.banes) || 0,
    favored: !!(fx.fav || set.fav), doomed: !!(fx.doom || set.doom), adj: -(Number(fx.exh) || 0), adjLabel: fx.exh ? `Exhausted ${fx.exh}` : "" };
}
/** Enemies: everyone not on the Heroes side (the Third and Fourth sides too). */
export const enemyCount = list => (list ?? []).filter(c => sideOf(c) !== "friendly").length;
export const stacking = list => enemyCount(list) > STACK_OVER;
/** The stack a creature belongs to (identical NPCs: the same base actor, the same side, not Heroes), or "". */
export function stackKeyOf(cr, list) {
  if (!cr?.npc || !cr.actorId || !stacking(list)) return "";
  const side = sideOf(cr);
  if (side === "friendly") return "";
  const k = `${side}|${cr.actorId}`;
  return (list ?? []).filter(x => x.npc && x.actorId === cr.actorId && sideOf(x) === side).length > 1 ? k : "";
}
/** The base name of a stack ("Goblin Minion 3" -> "Goblin Minion"; the actor's name when the model has it). */
export const baseName = cr => cr?.base || String(cr?.name ?? "").replace(/\s+\d+$/, "");

/** The turn order of the creatures that go last: the tie rule (the higher Attribute Modifier for the called Check, then the Friendly side). */
export function lastOrder(list, call) {
  return [...(list ?? [])].sort((a, b) => ((Number(b.mods?.[attrOf(b, call)]) || 0) - (Number(a.mods?.[attrOf(a, call)]) || 0)) || (sideDisp(sideOf(b)) - sideDisp(sideOf(a))));
}

/* ---------------------------------------------------------------- the GM window */

/** One row: a creature, a stack (several members, opts.stack) or a stack member (opts.member). */
export function rowView(ms, call, opts = {}) {
  const r = ms[0], same = f => ms.every(x => f(x) === f(r));
  const rolled = ms.every(isRolled), last = ms.every(goesLast);
  const attr = same(x => attrOf(x, call)) ? attrOf(r, call) : "";
  const overridden = ms.some(x => ATTRS.includes(x.set?.attr) && x.set.attr !== call.attr);
  const who = same(whoOf) ? whoOf(r) : "mixed";
  const fav = ms.every(x => x.set?.fav || x.fx?.fav), doom = ms.every(x => x.set?.doom || x.fx?.doom);
  const favFx = ms.every(x => x.fx?.fav), doomFx = ms.every(x => x.fx?.doom);
  const total = (x, k) => (Number(x.fx?.[k]) || 0) + (Number(x.set?.[k]) || 0);
  const boons = same(x => total(x, "boons")) ? total(r, "boons") : "·", banes = same(x => total(x, "banes")) ? total(r, "banes") : "·";
  const manB = ms.some(x => (Number(x.set?.boons) || 0) > 0), manN = ms.some(x => (Number(x.set?.banes) || 0) > 0);
  const changed = !rolled && ms.some(x => changedOf(x, call));
  const chips = [];
  for (const x of ms) for (const t of [...(x.fx?.chips ?? []), ...(x.dying ? [x.dying] : [])]) { const s = opts.stack ? `${t} (${String(x.name).match(/(\d+)$/)?.[1] ?? x.name})` : t; if (!chips.includes(s)) chips.push(s); }
  const ownerTxt = r.pc ? `Player: ${r.owner || "?"}` : (r.ally ? "GM · ally" : "GM");
  const waiting = !rolled && who === "wait";
  return {
    ids: ms.map(x => x.id), id: opts.stack ? `stack:${opts.stack}` : r.id, name: opts.stack ? baseName(r) : r.name, img: r.img, pc: !!r.pc,
    member: !!opts.member, stack: opts.stack || "", stackN: ms.length, expanded: !!opts.expanded, stackLabel: `×${ms.length} ${opts.expanded ? "▴ hide each" : "▾ show each"}`,
    owner: ownerTxt, chips, last, moving: !!opts.moving, side: sideOf(r),
    rolled, result: rolled ? r.rolled : null, rolledWith: `with ${ATTR_NAMES[r.rolledAttr] ?? ATTR_NAMES[attrOf(r, call)]}`, rolledBy: r.rolledBy && r.rolledBy !== "GM" ? `by ${r.rolledBy}` : "",
    who, waitLabel: r.pc ? (r.owner || "Player") : "Wait", liveNote: r.pc && waiting ? (changed ? `Waiting · your settings go to ${r.owner || "the player"}` : `Waiting for ${r.owner || "the player"}'s roll`) : "",
    attr, attrMixed: !attr, overridden, mods: Object.fromEntries(ATTRS.map(a => [a, sgn(Number(r.mods?.[a]) || 0)])),
    fav, doom, favFx, doomFx, both: fav && doom, favBy: (r.fx?.favBy ?? []).join(", "), doomBy: (r.fx?.doomBy ?? []).join(", "),
    boons, banes, boonsOn: boons !== 0, banesOn: banes !== 0, manB, manN,
    squad: !rolled && opts.squad ? { n: opts.squad.n, of: opts.squad.of, next: opts.squad.next ?? ((opts.squad.n % opts.squad.of) + 1), ids: Object.keys(opts.squad.groups ?? {}) } : null,   // v0.0.440: a Minion's squad (a click: the next one)
    tint: changed ? "changed" : (rolled || waiting ? "quiet" : "plain")
  };
}

/** The whole GM window. */
export function gmModel(list, call, ui = {}, opts = {}) {
  list = list ?? []; call = { attr: ATTRS.includes(call?.attr) ? call.attr : "instinct" };
  const st = stacking(list), closed = ui.closed ?? {}, open = ui.open ?? {}, moving = ui.moving ?? {};
  // v0.0.440 (Lucas: "The GM decides who goes together when initiative is rolled"): each Minion not rolled yet shows its squad (even by default)
  const sq = minionGroupOf(list.filter(c => !isRolled(c)).map(c => ({ id: c.id, kind: c.minion ?? "", group: c.set?.group ?? 0 })));
  const sides = SIDES.map(def => {
    const inSide = list.filter(c => sideOf(c) === def.key), rows = [], done = new Set();
    for (const c of inSide) {
      const k = stackKeyOf(c, list);
      if (k) {
        if (done.has(k)) continue;
        done.add(k);
        const ms = inSide.filter(x => stackKeyOf(x, list) === k), ex = !!open[k];
        rows.push(rowView(ms, call, { stack: k, expanded: ex, moving: !!moving[`stack:${k}`] }));
        if (ex) ms.forEach(m => rows.push(rowView([m], call, { member: true, moving: !!moving[m.id], squad: sq[m.id] })));
      } else rows.push(rowView([c], call, { moving: !!moving[c.id], squad: sq[c.id] }));
    }
    return { ...def, open: !closed[def.key], caret: closed[def.key] ? "▸" : "▾", count: plural(inSide.length, "creature"), rows };
  }).filter(s => s.rows.length);
  // The footer
  const nameOf = c => `${c.name}${ATTRS.includes(c.set?.attr) && c.set.attr !== call.attr ? ` (${ATTR_NAMES[c.set.attr]})` : ""}`;
  const listOf = xs => {
    const out = [], seen = new Set();
    for (const c of xs) {
      const k = stackKeyOf(c, list);
      if (k) { if (seen.has(k)) continue; seen.add(k); out.push(`${baseName(c)} ×${xs.filter(x => stackKeyOf(x, list) === k).length}`); }
      else out.push(nameOf(c));
    }
    return out.length ? out.join(", ") : "nobody";
  };
  const pend = list.filter(c => !isRolled(c) && !goesLast(c));
  const rolling = pend.filter(c => whoOf(c) === "gm"), playerWait = pend.filter(c => whoOf(c) === "wait" && c.pc), npcWait = pend.filter(c => whoOf(c) === "wait" && !c.pc);
  const players = [...new Set(list.filter(c => c.pc).map(c => c.owner || "?"))];
  const pState = p => { const mine = list.filter(c => c.pc && (c.owner || "?") === p); return mine.every(c => isRolled(c) || goesLast(c)) ? "rolled" : mine.some(c => !isRolled(c) && !goesLast(c) && whoOf(c) === "wait") ? "waiting" : "GM rolls"; };
  const pending = new Set(playerWait.map(c => c.owner || "?")).size;
  return {
    attr: call.attr, sub: `${ATTR_NAMES[call.attr]} Check · ${plural(list.length, "creature")} · ${plural(sides.length, "side")} · ties: higher Modifier, then Friendly`,
    attrBtns: ATTRS.map(a => ({ key: a, label: ATTR_NAMES[a], on: a === call.attr, color: ATTR_COLORS[a] })),
    playersLine: `${opts.playersOpen === false ? "Not opened for the players (setting): they roll from their portraits" : "Open for the players too"}${players.length ? `: ${players.map(p => `${p} (${pState(p)})`).join(" · ")}` : ": no player creatures"} · ${st ? "stacks on: more than 5 enemies" : "no stacks: 5 enemies or fewer"}`,
    stacking: st, sides,
    sumRoll: listOf(rolling), sumPlayer: listOf(playerWait), sumWait: listOf(npcWait),
    sumKept: list.filter(isRolled).map(c => `${c.name} ${c.rolled}`).join(", ") || "nobody", sumLast: list.filter(goesLast).map(c => c.name).join(", ") || "nobody",
    rollIds: rolling.map(c => c.id), rollN: rolling.length, pending,
    rollLabel: `Roll ${rolling.length}${pending ? ` · ${plural(pending, "player")} pending` : ""}`
  };
}

/** The settings a click changes, for these creatures: { id: { ...set } } (the combatant flag twod12.init, whole). */
export function applyClick(ms, call, act, value) {
  const out = {};
  const put = (x, patch) => { out[x.id] = { ...(x.set ?? {}), ...patch }; };
  const allFav = ms.every(x => x.set?.fav), allDoom = ms.every(x => x.set?.doom);
  for (const x of ms) {
    const s = x.set ?? {};
    if (act === "who") put(x, { who: value === "gm" ? "gm" : "wait" });
    else if (act === "attr") put(x, { attr: value === call.attr || !ATTRS.includes(value) ? "" : value });
    else if (act === "fav") put(x, { fav: !allFav });
    else if (act === "doom") put(x, { doom: !allDoom });
    else if (act === "boons+" || act === "banes+") { const k = act.slice(0, 5); put(x, { [k]: (Number(s[k]) || 0) + 1 }); }
    else if (act === "boons-" || act === "banes-") { const k = act.slice(0, 5); put(x, { [k]: Math.max(0, (Number(s[k]) || 0) - 1) }); }
    else if (act === "side") put(x, { side: SIDE_BY[value] ? value : "" });
    else if (act === "last") put(x, { last: !ms.every(goesLast) });
    else if (act === "gmAll") { if (!isRolled(x)) put(x, { who: "gm" }); }
    else if (act === "squad") put(x, { group: Math.max(1, Math.trunc(Number(value)) || 1) });   // v0.0.440: the Minion's squad (the GM's choice)
  }
  return out;
}

/** v0.0.453 (playtest 6): a squad click fixes every Minion of that kind where it stands now (the window's squads), then moves this one: so the
 *  squads stay as the GM sees them, and one click makes a new squad or joins another. `all`: the window's creatures; `groups`: { id: squad }. */
export function squadMove(all, id, value, groups = {}) {
  const out = {};
  for (const x of all ?? []) {
    if (!(x.id in groups)) continue;
    out[x.id] = { ...(x.set ?? {}), group: x.id === id ? Math.max(1, Math.trunc(Number(value)) || 1) : groups[x.id] };
  }
  return out;
}

/* ---------------------------------------------------------------- the players' window */

/**
 * One player's window. me: the player's name (the owner the creatures carry); opts: { npcMode: "visible" | "afterStart", started }.
 * Their creatures (a card each, read-only), the other Heroes with a status, and the other sides: NPCs by name with "rolled" / "waiting" only,
 * never the number; hidden creatures are never listed; stacks as "<name> ×N" (never expanded).
 */
export function playerModel(list, call, me, opts = {}) {
  list = (list ?? []).filter(c => !c.hidden); call = { attr: ATTRS.includes(call?.attr) ? call.attr : "instinct" };
  const status = c => (isRolled(c) ? "rolled" : goesLast(c) ? "goes last" : whoOf(c) === "gm" ? "the GM rolls" : "waiting");
  const fromGm = c => {
    const s = c.set ?? {}, out = [];
    if (ATTRS.includes(s.attr) && s.attr !== call.attr) out.push(`${ATTR_NAMES[s.attr]} Check · from the GM`);
    if (s.fav) out.push("Favored · from the GM");
    if (s.doom) out.push("Doomed · from the GM");
    if (Number(s.boons) > 0) out.push(`${plural(Number(s.boons), "Boon")} · from the GM`);
    if (Number(s.banes) > 0) out.push(`${plural(Number(s.banes), "Bane")} · from the GM`);
    return out;
  };
  const mine = list.filter(c => (typeof c.mine === "boolean" ? c.mine : (c.pc && c.owner === me)));   // c.mine: the player owns it (initwindow.mjs)
  const yours = mine.map(c => {
    const a = attrOf(c, call), gm = fromGm(c);
    return { id: c.id, name: c.name, img: c.img, check: `${ATTR_NAMES[a]} ${sgn(Number(c.mods?.[a]) || 0)}`, attr: a, gmChips: gm, fxChips: [...(c.fx?.chips ?? []), ...(c.dying ? [c.dying] : [])],
      rolled: isRolled(c), result: isRolled(c) ? c.rolled : null, gmRolls: !isRolled(c) && whoOf(c) === "gm", last: goesLast(c), canRoll: !isRolled(c) && !goesLast(c) && whoOf(c) === "wait",
      note: gm.length ? "The GM set your Check and Boons. Your own effects are already in the roll." : "Your own effects are already in the roll." };
  });
  const heroes = list.filter(c => sideOf(c) === "friendly" && !mine.includes(c)).map(c => ({ name: c.name, img: c.img, status: status(c) }));
  const others = SIDES.filter(s => s.key !== "friendly").map(def => {
    const inSide = list.filter(c => sideOf(c) === def.key);
    if (!inSide.length) return null;
    const hold = opts.npcMode === "afterStart" && !opts.started;
    const items = [], seen = new Set();
    for (const c of inSide) {
      if (hold) break;
      const k = stackKeyOf(c, list);
      if (k) { if (seen.has(k)) continue; seen.add(k); const ms = inSide.filter(x => stackKeyOf(x, list) === k); items.push({ name: `${baseName(c)} ×${ms.length}`, img: c.img, status: ms.every(isRolled) ? "rolled" : "waiting" }); }
      else items.push({ name: c.name, img: c.img, status: isRolled(c) ? "rolled" : "waiting" });
    }
    return { key: def.key, name: def.name, bg: def.bg, hold, items };
  }).filter(Boolean);
  return { sub: `${ATTR_NAMES[call.attr]} Check, called by the GM`, yours, heroes, others };
}
