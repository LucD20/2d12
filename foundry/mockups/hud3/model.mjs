// The HUD mockup (playtest 5, group D): the example states and the HUD's model for each. The numbers are the system's own (../sheets/model.mjs
// makeActor: data.mjs prepareDerivedData on the compendium character); the lines are built as hud.mjs barModel builds them (rollsource.mjs,
// config.mjs vsText, cardview.mjs modText and versionButtons, sheetmodel.mjs basicUnavailable), without the live checks a running Foundry makes.
import { makeActor } from "../sheets/model.mjs";
const CFG = await import("../../twod12/module/config.mjs");
const CV = await import("../../twod12/module/cardview.mjs");
const RS = await import("../../twod12/module/rollsource.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const PCS = await import("../../twod12/module/pcsheet.mjs");
const HV = await import("../../twod12/module/hudview.mjs");
const HM = await import("../../twod12/module/hudmodel.mjs");
const MA = await import("../../twod12/module/mastery.mjs");
const F = "twod12", nn = v => Math.max(0, Math.trunc(Number(v)) || 0);
const sg = v => (Number(v) > 0 ? `+${Number(v)}` : Number(v) < 0 ? `−${-Number(v)}` : "0");

/** hud.mjs rollLine */
function rollLine(actor, item) {
  const it = item.system, src = RS.rollSource(actor.system ?? {}, it), vs = CFG.vsText(it, { src });
  const bits = [];
  if (src?.kind && vs) bits.push(`${CV.modText(src.chip, src.mod)} vs ${vs}`); else if (vs) bits.push(`vs ${vs}`);
  if (it.traits?.has?.("strike")) bits.push("Strike");
  if (it.reaction && it.trigger) bits.push(String(it.trigger).replace(/<[^>]+>/g, ""));
  return bits.join(" · ");
}
/** hud.mjs colsOf */
export function colsOf(lines, { per = 3, maxCols = 6 } = {}) {
  const cols = [];
  for (const k of HV.FREQ_ORDER) {
    const ls = lines.filter(l => l.freq === k);
    for (let i = 0; i < ls.length; i += per) cols.push({ key: k, label: i === 0 ? HV.FREQ_LABEL[k] : "", cont: i > 0, fq: ls[0].fqColor, lines: ls.slice(i, i + per) });
  }
  if (cols.length <= maxCols) return cols;
  const shown = cols.slice(0, maxCols), rest = cols.slice(maxCols).flatMap(c => c.lines);
  shown[maxCols - 1] = { ...shown[maxCols - 1], more: `+${rest.length} more` };
  return shown;
}

/**
 * A creature in a state. S: { over (makeActor's example data), short (the name on the bar), sub, ap, rap, strikes, esc, guard, tab,
 * conds: [{ id, name, dur }], prone, used: [Action names used this round], rx: { name, cost, lead } | null }
 */
export function hudState(data, S) {
  const a = makeActor(data, S.over ?? {}), s = a.system;
  const weapons = a.itemTypes.weapon, held = weapons.filter(w => w.system.wielded && !w.system.traits.has("barehanded"));
  const tiles = PCS.handTiles(weapons, true);
  const ctx = { freeHand: tiles.some(t => t.free), reloadWeapon: held.some(w => w.system.traits.has("reload")), prone: !!S.prone, immobilized: false, speed: S.speed ?? s.moveSpeed ?? s.speed, reach: s.reach ?? 1, down: false, rallyLeft: s.rallyLeft, npc: false };
  const used = new Set(S.used ?? []);
  const one = i => {
    const it = i.system, freq = CFG.effectiveFrequency(it) || "none", vs = it.versions ?? [], key = i.getFlag(F, "basic") ?? "";
    const btns = CV.versionButtons(vs.map(v => v.ap), { reaction: !!it.reaction, inCombat: true, ap: S.ap, rap: S.rap });
    let why = key ? SM.basicUnavailable(key, ctx) : "";
    // actions.mjs: Prone: no Evade, and the only Move Actions are Crawl, Stand and Break Free
    if (!why && S.prone && (key === "safeMovement" || (it.traits.has("move") && !["crawl", "stand", "breakFree"].includes(key)))) why = "Prone";
    const spent = used.has(i.name);
    if (spent) why = freq === "encounter" ? "used this encounter" : "used this round";
    const versions = vs.map((v, k) => ({ ap: v.ap, label: it.reaction ? `${v.ap}R` : `${v.ap} AP`, off: !!why || !!btns[k]?.off, used: spent, why: why || btns[k]?.why || "" }));
    return { id: i.id, name: i.name, item: i, key, freq, fq: CFG.FREQ_COLORS[freq] ?? CFG.FREQ_COLORS.none, roll: rollLine(a, i), versions, basic: !!key, reaction: !!it.reaction, strike: !!it.traits.has("strike"), offWhy: why };
  };
  // hud.mjs actionsOf (v0.0.418, D6): a Technique not unlocked is left out
  const list = a.itemTypes.action.filter(i => { try { return MA.techniqueState(a, i) !== "locked"; } catch (e) { return true; } }).map(one);
  const lineOf = x => ({ id: x.id, name: x.name, freq: x.freq, fqColor: x.fq, sub: x.versions.every(v => v.off) && x.versions.some(v => v.used) ? (x.versions.find(v => v.why)?.why ?? "used") : x.roll,
    used: x.versions.length > 0 && x.versions.every(v => v.used), stamps: x.versions.map(v => ({ ap: v.ap, label: v.label, off: v.off, why: v.why })) });
  const act = list.filter(x => !x.basic && !x.reaction).map(lineOf), rx = list.filter(x => x.reaction).map(lineOf), basic = list.filter(x => x.basic && !x.reaction).map(lineOf);
  if (S.rx) rx.forEach(l => { if (l.name === S.rx.name) l.ready = true; });
  const escLines = a.itemTypes.feature.filter(f => Number(f.system?.escalation) > 0).map(f => ({ id: f.id, name: f.name, freq: "none", fqColor: CFG.FREQ_COLORS.none, pass: true, state: S.esc >= Number(f.system.escalation) ? "working" : `at ${f.system.escalation}`, sub: `Escalation ${f.system.escalation}` }));
  const usable = l => !l.used;
  const tabs = HV.HUD_TABS_PC.map(([k, label]) => ({ k, label, count: k === "act" ? act.filter(usable).length : k === "rx" ? rx.filter(usable).length : k === "basic" ? basic.filter(usable).length : `${escLines.filter(l => l.state === "working").length} of ${escLines.length}` }));
  const speed = nn(S.speed ?? s.moveSpeed ?? s.speed), base = nn(s.speed);
  const bars = [{ name: "Vigor", cls: "v", max: nn(s.bdt), left: nn(s.bdt) - nn(s.bodyDamage), nl: nn(s.damage?.bodyNonlethal) }, { name: "Resolve", cls: "r", max: nn(s.mdt), left: nn(s.mdt) - nn(s.mindDamage), nl: nn(s.damage?.mindNonlethal) }];
  const cls = a.itemTypes.class[0], sp = a.itemTypes.species[0];
  const marks = { ap: S.ap, max: nn(s.apPerTurn) || 4, slowed: 0, rap: S.rap, rapMax: 1, strikes: S.strikes ?? 0 };
  return { a, s, S, list, act, rx, basic, escLines, tabs, bars, marks, tiles, speed, base, sg,
    name: S.short ?? a.name, img: String(a.img).replace(/^systems\/twod12\//, "../../twod12/"), sub: [sp?.name, cls?.name, s.level ?? 1].filter(Boolean).join(" "),
    guard: nn(S.guard), rally: { left: nn(s.rallyLeft), max: nn(s.rallyMax) }, escN: nn(S.esc), escMax: 6,
    attrs: HM.HUD_SAVES.map(([key, label, short]) => ({ key, label, short, value: sg(s.attributes?.[key] ?? 0) })) };
}

/** Today's bar model (hud.mjs barModel), for hudview.mjs tokenBarHtml. */
export function todayModel(h) {
  const { s, S } = h, tab = S.rx ? "rx" : (S.tab ?? "act");
  const cols = tab === "rx" ? colsOf(h.rx) : tab === "basic" ? colsOf(h.basic, { maxCols: 4 }) : tab === "esc" ? colsOf(h.escLines).map((c, i) => ({ ...c, label: i ? "" : "Escalation" })) : colsOf(h.act);
  const defs = [{ label: "AD", value: nn(s.armorDC) }, { label: "WD", value: nn(s.wardDC) }, { label: "Spd", value: h.speed, chg: h.speed !== h.base }, { label: "Wpn", value: h.sg(s.weaponMod ?? 0) }, { label: "Pow", value: h.sg(s.powerMod ?? 0) }, { gap: true },
    ...h.attrs.map(x => ({ label: x.short, value: x.value, hud: "attr", data: { key: x.key } }))];
  const heldT = h.tiles.filter(t => !t.free);
  const hands = heldT.length ? { text: heldT.map(t => t.name).join(", "), note: heldT.some(t => t.wide) ? "(both hands)" : "", btn: "Regrip" } : { text: "empty", btn: "Draw" };
  return { npc: false, name: h.name, img: h.img, sub: h.sub, bars: h.bars, guard: h.guard, tag: null, rally: h.rally, marks: HV.marksHtml(h.marks), escN: h.escN, escMax: h.escMax, defs, tabs: h.tabs, tab, cols, rxAlert: !!S.rx,
    side: { hands, conds: S.conds ?? [], condLabel: "On you", rx: S.rx ? { ...S.rx, msg: "m", row: 0 } : null, grants: [], cancels: [] }, folded: false, cond: "" };
}
