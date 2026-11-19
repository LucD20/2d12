// v0.0.376 (PACK STYLE-2; the brief foundry/mockups/npc-hud-brief.md): the HUD across the bottom of the screen. It follows the selection only
// (one token: its HUD; several: the list; none: the player's character, or the GM's empty bar), in the dark table look (module/hudmodel.mjs draws
// it). A Version's stamp opens the roll dialog on that Version ("Skip roll dialog", a per-player setting, rolls at once; Shift does the other);
// right-click opens the Action card (a PC's menu also pins the Version to the Quick row). The hotbar becomes a row inside it (a setting), and the
// pick bar (pickbar.mjs) asks its question in the HUD's middle while a choice waits. Client settings: Show the HUD, Skip roll dialog, Hotbar in the HUD.
import { emptyHudHtml, hudPanelHtml, HUD_SAVES } from "./hudmodel.mjs";
import { partyStripHtml, tokenBarHtml, marksHtml, escHtml, HUD_TABS_PC, HUD_TABS_NPC, FREQ_ORDER, FREQ_LABEL } from "./hudview.mjs";
import { techniqueState } from "./mastery.mjs";   // v0.0.418 (D6)

const F = "twod12";
const st = { open: "", actorUuid: "", pop: null, card: null, cardId: "", tab: "act", rx: null, chimed: new Set(), view: "main", rview: "main", sitWas: false };   // v0.0.446: the right column's tab
let root = null, timer = null;
const setting = (k, d) => { try { return game.settings.get(F, k); } catch (e) { return d; } };

export function registerHudSettings() {
  const redraw = () => renderHud();
  game.settings.register(F, "hudShow", { name: "The HUD", hint: "The bar across the bottom of the screen for the selected token: its Actions, one click to the roll dialog. Only for you.", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
  game.settings.register(F, "hudSkipDialog", { name: "HUD: Skip roll dialog", hint: "A Version clicked in the HUD rolls at once with the roll dialog's defaults (it still shows when something stops the roll). Shift-click does the other.", scope: "client", config: true, type: Boolean, default: false });
  game.settings.register(F, "hudHotbar", { name: "HUD: the hotbar inside it", hint: "The macro hotbar becomes a small row at the HUD's right end. Off: Foundry keeps it where it was (reload to see it move back).", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
  // v0.0.390 (PACK HUD2): the party strip, the fold, and the Reaction alert (Lucas: "it can pass unnoticed"), each its own setting
  game.settings.register(F, "hudParty", { name: "HUD: the party strip", hint: "With no token selected, a small card for each player character (AD, WD, Speed, Rally Points, AP, Escalation, Vigor and Resolve).", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
  game.settings.register(F, "hudFolded", { name: "HUD folded", scope: "client", config: false, type: Boolean, default: false, onChange: redraw });
  game.settings.register(F, "rxChime", { name: "Reactions: a chime", hint: "A short soft chime when one of your creatures can react (it follows Foundry's interface volume).", scope: "client", config: true, type: Boolean, default: true });
  game.settings.register(F, "rxFloat", { name: "Reactions: the name on the map", hint: "The Reaction's name over your reacting token, with its ring, until it is used or passed.", scope: "client", config: true, type: Boolean, default: true });
  game.settings.register(F, "rxHud", { name: "Reactions: the HUD", hint: "The HUD unfolds and names the trigger in its Situational section, with Use and Pass (it stays on the tab you had open).", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
}

/* ------------------------------------------------------------------ the model */
/** v0.0.390: the roll an Action makes, as the HUD's line says it: "Weapon +2 vs AD · Strike", and "next: +1 Bane" on an At-will Action already used this turn. */
let RL = null;
async function rollLibs() {
  if (RL) return RL;
  const [{ rollSource }, { vsText }, { modText }, { atWillUses }] = await Promise.all([import("./rollsource.mjs"), import("./config.mjs"), import("./cardview.mjs"), import("./usage.mjs")]);
  return (RL = { rollSource, vsText, modText, atWillUses });
}
function rollLine(actor, item) {
  if (!RL) return "";
  try {
    const it = item.system, src = RL.rollSource(actor.system ?? {}, it), vs = RL.vsText(it, { src });
    const bits = [];
    if (src?.kind && vs) bits.push(`${RL.modText(src.chip, src.mod)} vs ${vs}`);
    else if (vs) bits.push(`vs ${vs}`);
    if (it.traits?.has?.("strike")) bits.push("Strike");
    const uses = game.combat?.started ? RL.atWillUses(actor, item) : 0;
    if (uses > 0 && /atwill|at-will/i.test(String(it.frequency ?? ""))) bits.push(`next: +${uses} Bane`);
    if (it.reaction && it.trigger) bits.push(String(it.trigger).replace(/<[^>]+>/g, ""));
    return bits.join(" · ");
  } catch (e) { return ""; }
}
const quickKeys = actor => new Set(actor?.getFlag?.(F, "hudQuick") ?? []);
async function apNow(actor) {
  try {
    if (!game.combat?.started) return null;
    const { combatantOf, getAP, getRAP } = await import("./combat.mjs");
    const c = combatantOf(actor, game.combat);
    return c ? { ap: getAP(c), rap: getRAP(c) } : null;
  } catch (e) { return null; }
}
async function actionsOf(actor) {
  const { FREQ_COLORS, effectiveFrequency } = await import("./config.mjs");
  const { versionButtons } = await import("./cardview.mjs");
  const { effectiveAp } = await import("./hooks.mjs");   // v0.0.428
  let pc = null;
  try { const { pcModel } = await import("./pcsheet.mjs"); pc = await pcModel(actor.sheet, {}); } catch (e) { console.warn("twod12 | HUD: the sheet's model", e); }
  const rows = new Map([...(pc?.sections ?? []).flatMap(s => s.rows ?? []), ...(pc?.basic ?? []).flatMap(c => c.rows ?? [])].map(r => [r.id, r]));
  const now = await apNow(actor), quick = quickKeys(actor), escNow = Number(actor.system?.escalation) || 0;
  const one = (i, onlyAps = null) => {
    const it = i.system, freq = effectiveFrequency(it), row = rows.get(i.id), vs = it.versions ?? [];
    const lock = Number(it.escalation) > 0 && escNow < Number(it.escalation);
    const btns = versionButtons(vs.map(v => effectiveAp(actor, i, v)), { reaction: !!it.reaction, inCombat: !!now, ap: now?.ap ?? 0, rap: now?.rap ?? 0 });   // v0.0.428: the cost a passive lowers
    const why = lock ? `Needs Escalation ${it.escalation}` : row?.offWhy ?? "";
    const list = vs.map((v, k) => ({ ap: v.ap, label: it.reaction ? `${v.ap}R` : `${v.ap} AP`, off: lock || !!row?.off || !!btns[k]?.off, lock, used: /used|spent/i.test(why), why: why || btns[k]?.why || "", fav: quick.has(`${i.id}:${v.ap}`) }))
      .filter(v => !onlyAps || onlyAps.includes(Number(v.ap)));
    return { id: i.id, name: i.name, freq: freq || "none", fq: FREQ_COLORS[freq] ?? FREQ_COLORS.none, roll: rollLine(actor, i), dim: lock || (!!row?.off && list.every(v => v.off)), versions: list, pc: actor.type !== "npc",
      basic: !!i.getFlag(F, "basic"), bkey: i.getFlag(F, "basic") || "", basicAttack: !!it.basicAttack, reaction: !!it.reaction, escalation: Number(it.escalation) || 0, minAp: Math.min(99, ...vs.map(v => Number(v.ap) || 0)) };
  };
  // v0.0.418 (playtest 5, D6: Seizing Cut showed though Durgan lacked the Mastery): a Technique not unlocked is left out, as on the sheet
  return { pc, list: actor.itemTypes.action.filter(i => techniqueState(actor, i) !== "locked").map(i => one(i)), one };
}
/* v0.0.390 (PACK HUD2): the models of the new HUD (module/hudview.mjs draws them). */
const nn = v => Math.max(0, Math.trunc(Number(v)) || 0);
async function combatOf(actor) {
  try {
    // v0.0.443 (Lucas: "Token HUD shows 'Out of combat' while combat is prepared but not started; it should mimic the sheet's behavior"): a
    // creature in a combat shows its marks once it is a combatant, started or not, as the sheet does
    if (!game.combat) return null;
    const C = await import("./combat.mjs"), U = await import("./usage.mjs");
    const c = C.combatantOf(actor, game.combat);
    return c ? { ap: C.getAP(c), max: C.apMax(c), slowed: C.slowedOf(actor), rap: C.getRAP(c), rapMax: C.rapMaxOf(c), strikes: U.strikesUsed(actor), c } : null;
  } catch (e) { return null; }
}
async function healthOf(actor) {
  const s = actor.system ?? {}, d = s.damage ?? {};
  const { healthTags, downState } = await import("./sheetmodel.mjs");
  const bars = [
    { name: "Vigor", cls: "v", max: nn(s.bdt), left: nn(s.bdt) - nn(s.bodyDamage), nl: nn(d.bodyNonlethal) },
    { name: "Resolve", cls: "r", max: nn(s.mdt), left: nn(s.mdt) - nn(s.mindDamage), nl: nn(d.mindNonlethal) }
  ];
  const statuses = actor.statuses ?? new Set(), dn = downState(s, statuses), t = healthTags(s);
  const tag = dn.down ? { cls: "down", text: dn.state } : statuses.has?.("unconscious") ? { cls: "down", text: "Unconscious" } : t.bloodied && t.strained ? { cls: "hurt", text: "Bloodied, Strained" } : t.bloodied ? { cls: "hurt", text: "Bloodied" } : t.strained ? { cls: "hurt", text: "Strained" } : null;
  return { bars, tag, guard: nn(s.guard) + nn(s.apGuard) };
}
async function escOf(actor) {
  const { ESC_MAX } = await import("./escalation.mjs");
  const s = actor.system ?? {}, has = actor.type !== "npc" || s.role === "elite" || !!s.useEscalation;
  return has ? { n: nn(s.escalation), max: nn(ESC_MAX) } : null;
}
function condsOf(actor, durationText) {
  return [...(actor.effects ?? [])].filter(e => !e.disabled && !e.getFlag?.(F, "wound") && !e.getFlag?.(F, "grants")?.length).map(e => ({ id: e.id, name: String(e.name ?? "").replace(/\s*\([^)]*\)\s*$/, ""), dur: durationText(e), img: e.img ?? e.icon ?? "" }));   // v0.0.441: its picture (D4)
}
/** A party card (and the cards of several selected tokens). */
async function partyCard(actor, token = null) {
  const s = actor.system ?? {}, h = await healthOf(actor), cb = await combatOf(actor), e = await escOf(actor);
  const { durationText } = await import("./sheet-common.mjs");
  const cls = actor.itemTypes.class?.[0], sp = actor.itemTypes.species?.[0];
  const speed = nn(s.moveSpeed ?? s.speed), base = nn(s.speed);
  return {
    key: token?.id ? `t:${token.id}` : `a:${actor.id}`, name: token?.name ?? actor.name, img: token?.document?.texture?.src || actor.prototypeToken?.texture?.src || actor.img,
    sub: actor.type === "npc" ? rankLabel(actor) : [sp?.name, cls?.name, s.level ?? 1].filter(Boolean).join(" "),
    ad: nn(s.armorDC ?? 11), wd: nn(s.wardDC ?? 11), speed, speedTip: speed !== base ? `Speed ${speed} (base ${base}${s.exhausted ? `; Exhausted ${s.exhausted}` : ""})` : "",
    rally: actor.type === "npc" ? "—" : `${nn(s.rallyLeft)}/${nn(s.rallyMax)}`, guard: h.guard, tag: h.tag?.cls === "hurt" ? null : h.tag, bars: h.bars,   // v0.0.418 (Lucas, playtest 5, F2): Bloodied / Strained off the strip (Down stays)
    marks: cb ? marksHtml({ ...cb, showStrikes: false }) : "", esc: e && cb ? escHtml(e.n, e.max) : "",
    cond: condsOf(actor, durationText).map(c => `${c.name}${c.dur ? ` (${c.dur})` : ""}`).join(" · ")
  };
}
/** The party: the player characters (a player sees them too: Lucas, "for everyone"). */
const partyActors = () => (game.actors?.contents ?? []).filter(a => a.type === "character" && a.hasPlayerOwner);
/** The Action lines of a tab, grouped in columns by Frequency (three lines a column; Basic: "+N more" past four columns). */
/** v0.0.440 (Lucas, checklist: "I don't see the Fists" on the Orc): the Basic Actions in the sheet's fixed order (the attacks first), so the ones
 *  past the tab's last column ("+N more") are the movements and the rest, never an NPC's Fists added after its other items. */
export const BASIC_ORDER = ["basicWeaponAttack", "fists", "rally", "charge", "shove", "haul", "relocate", "trip", "advance", "safeMovement", "stand", "leaning", "interact", "reload"];
export const basicOrder = list => [...list].sort((x, y) => { const p = k => { const n = BASIC_ORDER.indexOf(k); return n < 0 ? 99 : n; }; return p(x.bkey) - p(y.bkey) || String(x.name).localeCompare(String(y.name)); });
function colsOf(lines, { per = 3, maxCols = 6 } = {}) {
  const cols = [];
  for (const k of FREQ_ORDER) {
    const ls = lines.filter(l => l.freq === k);
    // v0.0.396 (Lucas: "Merge frequencies instead of adding a new header"): a second column of the same Frequency has an empty header (its rule runs on)
    for (let i = 0; i < ls.length; i += per) cols.push({ key: k, label: i === 0 ? FREQ_LABEL[k] : "", cont: i > 0, fq: ls[0].fqColor, lines: ls.slice(i, i + per) });
  }
  if (cols.length <= maxCols) return cols;
  const shown = cols.slice(0, maxCols), rest = cols.slice(maxCols).flatMap(c => c.lines);
  shown[maxCols - 1] = { ...shown[maxCols - 1], more: `+${rest.length} more`, moreIds: rest.map(l => l.id) };
  st.moreIds = rest.map(l => l.id);
  return shown;
}
const lineOf = a => ({
  id: a.id, name: a.name, freq: a.freq, fqColor: a.fq, sub: a.versions.every(v => v.off) && a.versions.some(v => v.used) ? (a.versions.find(v => v.why)?.why ?? "used") : a.roll,
  used: a.versions.length > 0 && a.versions.every(v => v.used),   // v0.0.393: "used" only when spent (not when short of AP)
  // v0.0.453 (Lucas, playtest 6: "Token hud shouldnt prevent clicking on used actions. Just give a warning, like using from the sheet"): only an
  // Escalation lock blocks; a spent Frequency or too few AP open the roll dialog, which says so (rolldlg.mjs warnings)
  stamps: a.versions.map(v => ({ ap: v.ap, label: v.label, off: v.off, why: v.why, lock: !!v.lock }))
});
/** The bar's model for one creature. */
async function barModel(actor, token = null) {
  await rollLibs();
  const s = actor.system ?? {}, npc = actor.type === "npc";
  const { list } = await actionsOf(actor);
  const h = await healthOf(actor), cb = await combatOf(actor), e = await escOf(actor);
  const { durationText } = await import("./sheet-common.mjs");
  const { FREQ_COLORS } = await import("./config.mjs");
  const usable = l => !l.used;
  // the lines of each tab
  // v0.0.391 (Lucas: "the granted action hud should be inserted in the actor hud"): a line per use left, each named for the creature it goes to (the
  // card's targets still free, as the card's buttons and the old grant bar did), a Cancel under the column; the separate grant bar is off while the HUD is on
  const grants = [], cancels = [];
  const FU = await import("./freeuse.mjs");
  for (const ef of actor.effects ?? []) {
    if (ef.disabled) continue;
    const source = String(ef.name ?? "").replace(/\s*\([^)]*\)\s*$/, "");
    (ef.getFlag?.(F, "grants") ?? []).forEach((g, index) => {
      if (!(g.left > 0)) return;
      const action = FU.actionsFor(actor, g.spec)[0]?.name ?? String(g.spec ?? "").replace(/^(category|trait):/i, "");
      let free = [];
      try { free = FU.grantTargetOrder(FU.grantCardTargets(actor, ef.id), g.used ?? [], 0).filter(t => !(g.used ?? []).includes(t?.uuid)); } catch (e) { free = []; }
      for (let k = 0; k < g.left; k++) { const t = free[k]; grants.push({ id: "", name: t?.name ? `${action} \u2192 ${t.name}` : action, freq: "granted", fqColor: "#d2a75a", sub: `from ${source}`, grant: { effect: ef.id, index, target: t?.uuid ?? "" }, stamps: [{ ap: nn(g.ap), label: `${nn(g.ap)} AP` }] }); }
      if (!cancels.some(x => x.effect === ef.id)) cancels.push({ effect: ef.id, source });
    });
  }
  const act = list.filter(a => !a.basic && !a.reaction && !a.escalation).map(lineOf);
  const rx = list.filter(a => a.reaction && !a.escalation).map(lineOf);
  const basic = basicOrder(list.filter(a => a.basic && !a.reaction)).map(lineOf);
  const escLines = [...actor.itemTypes.feature.filter(f => Number(f.system?.escalation) > 0).map(f => ({ id: f.id, name: f.name, freq: "none", fqColor: FREQ_COLORS.none, pass: true, state: (e?.n ?? 0) >= Number(f.system.escalation) ? "working" : `at ${f.system.escalation}`, sub: `Escalation ${f.system.escalation}` })),
    ...list.filter(a => a.escalation).map(a => ({ ...lineOf(a), sub: `Escalation ${a.escalation}${a.roll ? ` · ${a.roll}` : ""}` }))];
  // the rx alert: a waiting Reaction of this creature that this user answers
  const wait = st.rx && st.rx.actorUuid === actor.uuid ? st.rx : null;
  if (wait) rx.forEach(l => { if (l.id === wait.itemId) l.ready = true; });
  const tabs = (npc ? HUD_TABS_NPC : HUD_TABS_PC).map(([k, label]) => ({ k, label, count: k === "act" ? act.filter(usable).length : k === "rx" ? rx.filter(usable).length : k === "basic" ? basic.filter(usable).length : `${escLines.filter(l => l.state === "working").length} of ${escLines.filter(l => l.pass).length}` }));
  if (!tabs.some(t => t.k === st.tab)) st.tab = "act";
  // v0.0.441 (the HUD mockup's decision 2, R4): a waiting Reaction no longer opens the Reactions tab: it shows in the Situational section
  const tab = st.tab;
  if (grants.length && !st.tabChosen) st.tab = "act";
  const cols0 = tab === "rx" ? colsOf(rx) : tab === "basic" ? colsOf(basic, { maxCols: 4 }) : tab === "esc" ? colsOf(escLines.map(l => ({ ...l, freq: "none" })), { per: 3 }).map((c, i) => ({ ...c, label: i ? "" : "Escalation" })) : colsOf(act);
  const cols = cols0;
  // the identity column
  const sg = v => (Number(v) > 0 ? `+${Number(v)}` : Number(v) < 0 ? `−${-Number(v)}` : "0");
  const speed = nn(s.moveSpeed ?? s.speed), base = nn(s.speed);
  const defs = [
    { key: "ad", word: "AD", label: "AD", value: nn(s.armorDC ?? 11), tip: "Armor Defense" }, { key: "wd", word: "WD", label: "WD", value: nn(s.wardDC ?? 11), tip: "Ward Defense" },
    { key: "speed", word: "Speed", label: "Spd", value: speed, tip: speed !== base ? `Speed ${speed} (base ${base}${s.exhausted ? `; Exhausted ${s.exhausted}` : ""})` : "Speed", chg: speed !== base },
    // v0.0.418 (Lucas, playtest 5, D2): both Modifiers ("Weapon +2 · Power +1"; it showed only the Weapon one)
    { key: "weapon", word: "Weapon", label: npc ? "Atk" : "Wpn", value: sg(s.weaponMod ?? 0), tip: "Weapon Modifier" }, { key: "power", word: "Power", label: "Pow", value: sg(s.powerMod ?? 0), tip: "Power Modifier" }, { gap: true },
    ...HUD_SAVES.map(([key, label, short]) => ({ word: label, label: short, value: sg(s.attributes?.[key] ?? 0), tip: `${label}: click a Check, Shift-click a Save`, hud: "attr", data: { key } }))
  ];
  const hands = actor.itemTypes.weapon?.length ? await handsOf(actor) : null;
  const conds = condsOf(actor, durationText);
  const cls = actor.itemTypes.class?.[0], sp = actor.itemTypes.species?.[0];
  // v0.0.441 (pack SHEETS-HUD, D1): the Basic tab as the sheet's four groups, every Basic Action shown (no "+N more")
  const { TWOD12 } = await import("./config.mjs");
  const strikeOf = id => !!actor.items.get(id)?.system?.traits?.has?.("strike");
  const bLines = basic.map(l => ({ ...l, strike: strikeOf(l.id) })), placed = new Set();
  const basicGroups = TWOD12.basicGroups.map(g => ({ label: g.label, lines: g.names.map(n => bLines.find(l => l.name === n)).filter(Boolean) })).filter(g => g.lines.length);
  basicGroups.forEach(g => g.lines.forEach(l => placed.add(l.id)));
  const restB = bLines.filter(l => !placed.has(l.id));
  if (restB.length) (basicGroups.at(-1) ?? basicGroups[basicGroups.push({ label: "Other", lines: [] }) - 1]).lines.push(...restB);
  // D3: Prone: Stand and Crawl in the Situational section (and Break Free when Immobilized too), each Version a button
  const statuses = actor.statuses ?? new Set();
  let prone = null;
  if (statuses.has?.("prone")) {
    const pick = k => list.find(a => a.bkey === k);
    const btns = [];
    for (const k of ["stand", "crawl", ...(statuses.has?.("immobilized") ? ["breakFree"] : [])]) {
      const a = pick(k); if (!a) continue;
      const it = actor.items.get(a.id)?.system ?? {};
      a.versions.forEach((v, i) => { const sq = /distance:(\d+)/.exec(it.versions?.[i]?.effects ?? "")?.[1]; btns.push({ label: `${a.name}${k === "crawl" && sq ? ` ${sq}` : ""} \u00b7 ${v.label}`, hud: "use", data: { item: a.id, ap: v.ap }, off: v.off && !v.used ? true : v.used, why: v.why }); });
    }
    prone = { lead: "Prone", text: "Your only Move Actions: Stand, Crawl, Break Free.", btns };
  }
  let tiles = null;
  try { if (!npc && actor.itemTypes.weapon?.length) { const { handTiles } = await import("./pcsheet.mjs"); tiles = handTiles(actor.itemTypes.weapon, !!cb); } } catch (e) { tiles = null; }
  const rxWait = wait && setting("rxHud", true) ? wait : null;
  return {
    h3: true, basicGroups, conds,
    right: { rx: rxWait, grants, cancels, prone, tiles, view: st.view },
    npc, name: token?.name ?? actor.name, img: token?.document?.texture?.src || actor.prototypeToken?.texture?.src || actor.img,
    sub: npc ? `${rankLabel(actor)}${s.cv ? ` · CV ${s.cv}` : ""}` : [sp?.name, cls?.name, s.level ?? 1].filter(Boolean).join(" "),
    bars: h.bars, guard: h.guard, tag: h.tag, rally: npc ? null : { left: nn(s.rallyLeft), max: nn(s.rallyMax) },
    marks: cb ? marksHtml(cb) : "", escN: e?.n ?? 0, escMax: e?.max ?? 0, defs, tabs, tab, cols, rxAlert: !!wait,
    side: { hands, conds, condLabel: npc ? "On it" : "On you", rx: wait && setting("rxHud", true) ? wait : null, grants, cancels },
    folded: !wait && !!setting("hudFolded", false), cond: conds.map(c => `${c.name}${c.dur ? ` (${c.dur})` : ""}`).join(" · ")
  };
}
async function handsOf(actor) {
  try {
    const { weaponWhere } = await import("./loadout.mjs");
    const held = actor.itemTypes.weapon.map(w => ({ w, at: weaponWhere(w) })).filter(x => x.at === "2h" || x.at === "1h");
    if (!held.length) return { text: "empty", btn: "Draw" };
    return { text: held.map(x => x.w.name).join(", "), note: held.some(x => x.at === "2h") ? "(both hands)" : "", btn: "Regrip" };
  } catch (e) { return null; }
}

/** A PC's category panel (or an NPC's "Checks"): the rows. */
async function panelRows(actor, cat) {
  const { list } = await actionsOf(actor);
  const act = a => ({ action: a });
  if (cat === "actions") return list.filter(a => !a.basic && !a.reaction && !a.escalation).sort((a, b) => a.minAp - b.minAp).map(act);
  if (cat === "basic") return basicOrder(list.filter(a => a.basic && !a.reaction)).map(act);
  if (cat === "react") return list.filter(a => a.reaction && !a.escalation).map(act);
  if (cat === "esc") {
    const passives = actor.itemTypes.feature.filter(f => Number(f.system?.escalation) > 0).map(f => ({ text: f.name, sub: `Passive, Escalation ${f.system.escalation}${(Number(actor.system?.escalation) || 0) >= Number(f.system.escalation) ? "" : " (not yet)"}` }));
    return [...passives, ...list.filter(a => a.escalation).map(act)];
  }
  if (cat === "checks") return HUD_SAVES.flatMap(([key, label]) => [{ button: `${label} Check`, hud: "attr", data: { key }, sub: "" }, { button: `${label} Save`, hud: "attr", data: { key, save: "1" } }]);
  if (cat === "hands") {
    const { weaponWhere } = await import("./loadout.mjs");
    const where = { "2h": "in both hands", "1h": "in hand", worn: "worn", stowed: "stowed", dropped: "dropped" };
    return [...actor.itemTypes.weapon.map(w => { let at = ""; try { at = where[weaponWhere(w)] ?? weaponWhere(w); } catch (e) { /* unknown */ } return { button: w.name, hud: "open", data: { item: w.id }, sub: at }; }),
      ...actor.itemTypes.gear.map(g => ({ button: g.name, hud: "open", data: { item: g.id }, sub: "gear" })), { button: "The sheet's Hands", hud: "sheet", data: { tab: "items" }, cls: "out" }];
  }
  if (cat === "fx") return [...actor.effects].filter(e => !e.disabled).map(e => ({ button: e.name, hud: "effect", data: { effect: e.id } })).concat([{ button: "The Effects tab", hud: "sheet", data: { tab: "effects" }, cls: "out" }]);
  if (cat === "utility") return [{ button: "Breather", hud: "rest", data: { k: "breather" }, sub: "10 minutes" }, { button: "Sleep", hud: "rest", data: { k: "sleep" }, sub: "8 hours" }, { button: "Rest", hud: "rest", data: { k: "rest" }, sub: "24 h, safe place" }, { button: "Guard, Rally and the rest: the sheet", hud: "sheet", data: { tab: "actions" }, cls: "out" }];
  return [];
}
const CAT_TITLE = { actions: "Actions", basic: "Basic Actions", react: "Reactions", esc: "Escalation", hands: "Hands and Gear", checks: "Checks and Saves", fx: "Conditions and Effects", utility: "Utility" };

/* ------------------------------------------------------------------ drawing */
/** An NPC's rank as the book writes it ("Elite", not the key "elite"). */
const rankLabel = a => { const k = String(a?.system?.role ?? ""); try { return globalThis.CONFIG?.TWOD12?.npcRoles?.[k]?.label ?? (k.charAt(0).toUpperCase() + k.slice(1)); } catch (e) { return k; } };
function current() {
  const ctrl = globalThis.canvas?.tokens?.controlled ?? [];
  if (st.rx && !game.user.isGM && setting("rxHud", true)) { try { const d = fromUuidSync(st.rx.actorUuid); const actor = d?.documentName === "Actor" ? d : d?.actor; if (actor) return { actor, token: ctrl.find(t => t.actor === actor) ?? null }; } catch (e) { /* gone */ } }
  if (ctrl.length > 1) return { list: ctrl };
  if (ctrl.length === 1 && ctrl[0].actor) return { token: ctrl[0], actor: ctrl[0].actor };
  // v0.0.390: with nothing selected, the party strip (a player too)
  return {};
}
function ensureRoot() {
  if (root?.isConnected) return root;
  root = document.createElement("div");
  root.id = "twod12-hud";
  root.className = "twod12-hud";
  root.innerHTML = '<div class="hud-players"></div><div class="hud-main"></div><div class="hud-ask"></div><div class="hud-hot"></div>';
  // v0.0.379 (Lucas: "still not right placed"): the HUD is placed on the screen itself, from the scene controls' right edge to the sidebar's left
  // edge, not inside Foundry's middle column (whose width Foundry sets); measured again when the window, the sidebar or the controls change
  root.classList.add("floating");
  (document.getElementById("interface") ?? document.body).append(root);
  root.addEventListener("click", onClick);
  // v0.0.382: a click anywhere outside the HUD (and its card) closes its panel and unlights its category
  document.addEventListener("pointerdown", ev => { if (root?.isConnected && !root.contains(ev.target) && !st.card?.contains(ev.target)) closePop(); }, true);
  root.addEventListener("contextmenu", onContext);
  window.addEventListener("resize", placeRoot);
  try { const ro = new ResizeObserver(() => placeRoot()); for (const id of ["ui-right", "sidebar", "sidebar-content", "chat-notifications", "scene-controls", "ui-left"]) { const el = document.getElementById(id); if (el) ro.observe(el); } } catch (e) { /* no observer */ }
  return root;
}
/** Pure: the HUD's left, right and bottom offsets (px) from the edges it sits between. */
export function hudBox({ controlsRight = 0, sidebarLeft = 0, width = 0, hotbarTop = null, height = 0 } = {}) {
  const left = Math.round(Math.max(8, controlsRight + 10)), right = Math.round(Math.max(8, width - (sidebarLeft || width) + 10));
  const bottom = hotbarTop === null ? 6 : Math.round(Math.max(6, height - hotbarTop + 6));
  return { left, right, bottom };
}
function placeRoot() {
  if (!root?.isConnected) return;
  // v0.0.380 (Lucas: "the left corner still not full, when opening the chat the right moves"): only what really sits in the bottom band of the
  // screen counts. Left: the scene controls only when their buttons reach down to the HUD (they stop high up, so the HUD starts at the left edge).
  // Right: the leftmost of the sidebar, its tabs and the chat's floating input when they reach the bottom band (Foundry's #ui-right box is not
  // where they are drawn).
  const W = window.innerWidth, H = window.innerHeight, band = H - 90;
  const vis = el => { const r = el?.getBoundingClientRect?.(); return r && r.width > 0 && r.height > 0 ? r : null; };
  const ctlBottom = Math.max(0, ...[...document.querySelectorAll("#scene-controls button, #scene-controls li")].map(vis).filter(Boolean).map(r => r.bottom));
  const ctl = vis(document.getElementById("scene-controls"));
  // v0.0.384 (Lucas: "the width still doesn't go all the way in fullscreen"): #chat-notifications is a wide, empty area beside the sidebar; only
  // what is drawn there counts (the sidebar and its tabs, the chat's input when it floats over the map)
  const rightEls = ["sidebar", "sidebar-tabs", "sidebar-content", "chat-message", "chat-form"].map(id => document.getElementById(id)).concat([...document.querySelectorAll(".chat-form")]);
  const lefts = rightEls.map(vis).filter(r => r && r.bottom > band && r.top < H && r.left > W * 0.35).map(r => r.left);
  const hb = document.getElementById("hotbar"), hbOut = hb && !root.contains(hb) && hb.offsetParent ? hb.getBoundingClientRect() : null;
  const b = hudBox({ controlsRight: ctl && ctlBottom > band - 20 ? ctl.right : 0, sidebarLeft: lefts.length ? Math.min(...lefts) : W, width: W, hotbarTop: hbOut ? hbOut.top : null, height: H });
  Object.assign(root.style, { left: `${b.left}px`, right: `${b.right}px`, bottom: `${b.bottom}px` });
}
/** The hotbar into the HUD's right end (a setting), and back out when the setting is off (a reload puts it back exactly). */
function placeHotbar() {
  // v0.0.441 (D3): a creature's bar takes the macro bar at the bottom of its right column (one row of ten); the party strip at the HUD's end
  const hb = document.getElementById("hotbar"), inBar = root?.querySelector(".hud-main .h3-hot"), slot = inBar ?? root?.querySelector(".hud-hot");
  if (!hb || !slot) return;
  if (setting("hudHotbar", true)) { if (hb.parentElement !== slot) slot.append(hb); root.classList.add("with-hot"); root.classList.toggle("hot-in-bar", !!inBar); }
  else root.classList.remove("with-hot", "hot-in-bar");
}
/** Before the HUD's middle is drawn again, the macro bar goes back to its own slot (else it would be thrown away with the old HTML). */
function parkHotbar() { const hb = document.getElementById("hotbar"), park = root?.querySelector(".hud-hot"); if (hb && park && root?.querySelector(".hud-main")?.contains(hb)) park.append(hb); }
/** v0.0.378 (Lucas: "the collapsed pill over the HUD"): Foundry's players list sits above the HUD's left end (collapsed as Foundry keeps it, its own
 *  arrow opens it), which also frees the left column, so the HUD gets that width. Off with the HUD. */
function placePlayers() {
  const pl = document.getElementById("players"), slot = root?.querySelector(".hud-players");
  if (!pl || !slot) return;
  if (pl.parentElement !== slot) slot.append(pl);
}
let drawing = false, again = false;
/** v0.0.406: the HUD's middle drawn only when its HTML changed (the same HTML again: no flash of the portrait and the lines). */
function setMain(main, html) { if (main.__twod12Html === html && main.childElementCount) return false; parkHotbar(); main.innerHTML = html; main.__twod12Html = html; placeHotbar(); return true; }
export function renderHud() {
  if (typeof document === "undefined") return;
  clearTimeout(timer);
  // v0.0.406 (Lucas: "Applying some conditions makes the HUD flicker, like Unconscious"): a condition updates the actor, its Effect and the token one
  // after the other; the redraws are gathered (150 ms), one at a time, and a redraw that changes nothing leaves the HUD as it is
  timer = setTimeout(() => { if (drawing) { again = true; return; } drawing = true; drawHud().catch(e => console.warn("twod12 | HUD", e)).finally(() => { drawing = false; if (again) { again = false; renderHud(); } }); }, 150);
}
async function drawHud() {
  const show = setting("hudShow", true);
  if (!show) { if (root) root.hidden = true; return; }
  ensureRoot(); root.hidden = false; placeHotbar(); placePlayers(); placeRoot();
  const main = root.querySelector(".hud-main"), cur = current();
  closePop({ keepOpen: true });
  // v0.0.421 (the audit; Lucas, playtest 5, D5: "accepting a Reaction makes the HUD jump"): the classes that size the HUD (the bar's fixed 150 px)
  // change in the same step as its new content, after the data is ready; they were taken off before the awaits, and for that moment the HUD
  // took its natural height (the jump). v0.0.418's min-height (measured in that moment) is gone.
  const shape = (...on) => { root.classList.remove("is-npc", "is-bar", "is-strip", "is-folded"); root.classList.add(...on); };
  // v0.0.390: several tokens selected, or nothing (the party strip): small cards
  if (cur.list || !cur.actor) {
    st.actorUuid = "";
    if (!cur.list && !setting("hudParty", true)) { shape(); setMain(main, emptyHudHtml(game.user.isGM ? "No token selected." : "No character: select your token.")); return; }
    const pairs = cur.list ? cur.list.filter(t => t.actor).map(t => [t.actor, t]) : partyActors().map(a => [a, (globalThis.canvas?.tokens?.placeables ?? []).find(t => t.actor?.id === a.id) ?? null]);
    const cards = await Promise.all(pairs.map(([a, t]) => partyCard(a, t)));
    // v0.0.407 (Stage 0 in Foundry; Lucas: "Momentum still doesn't show in the strip"): the party's number, 0 to 4, always at the strip's left
    let momentum = "";
    try { const { momentumNow } = await import("./escalation.mjs"); momentum = !cur.list ? String(momentumNow()) : ""; } catch (e) { momentum = ""; }
    const waiting = main.querySelector(".hb-ask > .twod12-linebar");
    shape("is-strip");
    setMain(main, partyStripHtml({ cards, momentum }));
    if (waiting) { root.querySelector(".hud-ask")?.append(waiting); waiting.classList.remove("in-side"); hudAsking(true, false); }
    st.cards = new Map(pairs.map(([a, t], k) => [cards[k].key, { actor: a, token: t }]));
    return;
  }
  if (cur.actor.uuid !== st.actorUuid) { st.open = ""; st.tab = "act"; st.tabChosen = false; st.actorUuid = cur.actor.uuid; }
  const m = await barModel(cur.actor, cur.token);
  const waiting = [...main.querySelectorAll(".hb-ask > .twod12-linebar")];   // v0.0.441: every question waiting (a Setup's movement and a pick bar can both be up)
  shape("is-bar", ...(m.npc ? ["is-npc"] : []), ...(m.folded ? ["is-folded"] : []));
  setMain(main, tokenBarHtml(m));
  const slot = main.querySelector(".hb-bar-wrap:not(.folded) .hb-ask") ?? root.querySelector(".hud-ask");
  for (const w of waiting) slot?.append(w);
  fitNames(main);
  syncSide();
  // v0.0.441 (D3): the hotbar is in the bar's right column (placeHotbar, from setMain); v0.0.446: its Macros tab
}

/**
 * v0.0.395 (Lucas: "Remove the AP buttons. Make it so the font resizes to fit the whole name. Hovering over the action reduces the opacity and
 * shows the AP buttons"): each line's name shrinks (to 0.6rem at the least) until it fits its column; the ellipsis only below that.
 */
export function fitNames(el = root) {
  for (const b of el?.querySelectorAll?.(".hb-ln > b") ?? []) {
    b.style.fontSize = "";
    let size = parseFloat(getComputedStyle(b).fontSize) || 13;
    const min = 9.5;
    b.classList.remove("wrap");
    while (b.scrollWidth > b.clientWidth + 0.5 && size > min) { size = Math.max(min, size - 0.5); b.style.fontSize = `${size}px`; }
    if (b.scrollWidth > b.clientWidth + 0.5) b.classList.add("wrap");   // v0.0.396: still too long at the smallest size: two lines
  }
}
let fitTimer;
if (typeof window !== "undefined") window.addEventListener?.("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => fitNames(), 120); });

/* ------------------------------------------------------------------ panels, the card, the menu */
function closePop({ keepOpen = false } = {}) {
  root?.querySelectorAll(".hud-pop, .hud-menu, .hud-hmenu").forEach(x => x.remove()); st.card?.remove(); st.card = null;
  // v0.0.382 (Lucas: "the button is still colored, so I have to click twice"): a closed panel's category is not lit any more
  if (!keepOpen && st.open) { st.open = ""; root?.querySelectorAll(".cat.on").forEach(x => { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); }); }
}
async function openPanel(cat, ids = null) {
  const cur = current(); if (!cur.actor) return;
  closePop({ keepOpen: true });
  let rows;
  if (ids) { const { list } = await actionsOf(cur.actor); rows = list.filter(a => ids.includes(a.id)).map(a => ({ action: a })); }
  else rows = await panelRows(cur.actor, cat);
  const wrap = document.createElement("div");
  wrap.innerHTML = hudPanelHtml(ids ? "More" : CAT_TITLE[cat] ?? cat, rows);
  const pop = wrap.firstElementChild;
  root.append(pop);
  const anchor = root.querySelector(ids ? ".hud-more:not([hidden])" : `[data-cat="${cat}"]`);
  if (anchor) { const r = anchor.getBoundingClientRect(), h = root.getBoundingClientRect(); pop.style.left = `${Math.max(0, Math.min(r.left - h.left, h.width - 320))}px`; }
}
async function showCard(actor, item, at) {
  try { return await showCardNow(actor, item, at); } catch (e) { console.warn("twod12 | HUD: the Action card", e); ui.notifications?.warn(`${item.name}: the card could not be drawn (see the console).`); }
}
async function showCardNow(actor, item, at) {
  closePop();
  const { buildActionCard } = await import("./actioncard.mjs");
  const div = document.createElement("div");
  div.className = "twod12-hudcard";
  div.innerHTML = `<button type="button" class="hc-x" aria-label="Close the card">&times;</button>${await buildActionCard(item, { actor })}`;
  document.body.append(div);
  const r = at.getBoundingClientRect();
  div.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - div.offsetWidth - 8))}px`;
  div.style.bottom = `${Math.max(8, window.innerHeight - r.top + 8)}px`;
  st.card = div; st.cardId = item.id;
  div.addEventListener("click", ev => {
    if (ev.target.closest(".hc-x")) { ev.preventDefault(); return closePop({ keepOpen: true }); }
    const b = ev.target.closest("[data-action='useVersion'][data-ap]");
    if (b && !b.disabled) { ev.preventDefault(); closePop(); use(actor, item, Number(b.dataset.ap), ev.shiftKey, b.dataset.mode); }   // v0.0.409: an Art's Mode button
  });
  // v0.0.385 (Lucas: "clicking the action again should close the card, not blink it"): a press on this Action's name is left to the click, which closes it
  const sameName = ev => !!ev.target.closest?.(`.ha[data-item-id="${item.id}"] [data-hud="card"], .hb-ln[data-item-id="${item.id}"]`);
  setTimeout(() => document.addEventListener("pointerdown", function away(ev) { if (sameName(ev)) return; if (!div.contains(ev.target)) { div.remove(); if (st.card === div) st.card = null; document.removeEventListener("pointerdown", away, true); } }, true), 0);
}
/**
 * v0.0.444 (group 2; Lucas: "When clicking in the weapon in the token hud, open the window above it, like a 'reversed dropdown' menu, instead of
 * all the way to the left. There it should show the weapons you can change it to or if you want to hold with 2h"): the hand tile's menu, opening
 * upward from the tile and kept on the screen (pcsheet.mjs handMenuModel; a row that can't be done now is struck, its reason under it).
 */
async function handMenu(actor, tile) {
  closePop({ keepOpen: true });
  const P = await import("./pcsheet.mjs"), cb = await combatOf(actor);
  const weapons = actor.itemTypes?.weapon ?? [];
  const m = P.handMenuModel(weapons, tile.dataset.hand, { inCombat: !!cb, ap: cb ? cb.ap : 99 });
  const { esc } = await import("./util.mjs");
  const rowHtml = r => `<button type="button" class="hm-row${r.off ? " off" : ""}"${r.key && !r.off ? ` data-k="${esc(r.key)}"` : " disabled"}><span class="hm-l">${esc(r.label)}${r.off && r.why ? `<small>${esc(r.why)}</small>` : ""}</span><span class="hm-c">${esc(r.act)} <b>${esc(r.cost)}</b></span></button>`;
  const div = document.createElement("div");
  div.className = "hud-hmenu"; div.setAttribute("role", "menu");
  div.innerHTML = `<div class="hm-h"><b>${esc(m.title)}</b> <small>${esc(m.sub)}</small>${m.warn ? `<span class="hm-w">${esc(m.warn)}</span>` : ""}</div>${m.groups.map(g => `<div class="hm-g">${g.map(rowHtml).join("")}</div>`).join("")}`;
  root.append(div);
  tile.classList.add("on");
  const r = tile.getBoundingClientRect(), h = root.getBoundingClientRect();
  div.style.bottom = `${Math.round(h.bottom - r.top + 4)}px`;
  div.style.left = `${Math.round(Math.max(0, Math.min(r.left - h.left, h.width - div.offsetWidth)))}px`;
  div.querySelector("button[data-k]")?.focus({ preventScroll: true });
  const close = () => { div.remove(); tile.classList.remove("on"); document.removeEventListener("pointerdown", away, true); };
  const away = e => { if (!div.contains(e.target) && e.target !== tile) close(); };
  document.addEventListener("pointerdown", away, true);
  div.addEventListener("keydown", e => { if (e.key === "Escape") { close(); tile.focus(); } });
  div.addEventListener("click", async e => {
    const k = e.target.closest("button[data-k]")?.dataset.k;
    if (!k) return;
    close();
    if (!(actor.isOwner || game.user.isGM)) return;
    const { spendAP } = await import("./combat.mjs"), L = await import("./hands.mjs"), { sysLine } = await import("./sysmsg.mjs");
    await P.applyHandPick(actor, actor.itemTypes?.weapon ?? [], k, { spendAP, applyRegrip: L.applyRegrip, applyRelease: L.applyRelease, sysLine });
  });
}

/** v0.0.381 (Lucas): right-click on a PC's Version stamp pins it to (or unpins it from) the Quick row, at once. */
async function toggleQuick(actor, item, ap) {
  const k = `${item.id}:${ap}`, next = quickKeys(actor);
  if (next.has(k)) next.delete(k); else next.add(k);
  await actor.setFlag(F, "hudQuick", [...next]);
}

/* ------------------------------------------------------------------ clicks */
async function use(actor, item, ap, shift, mode = "") {
  const { useAction } = await import("./actions.mjs");
  const skip = !!setting("hudSkipDialog", false) !== !!shift;
  return useAction(actor, item, { rdState: { ap }, skipDialog: skip, ...(mode ? { mode } : {}) });
}
/** v0.0.407: the GM changes the party's Momentum from the party strip (left-click +1, right-click -1). */
async function momentumClick(ev, d) {
  if (!game.user.isGM || !ev.target.closest?.("[data-hud-mom]")) return false;
  ev.preventDefault();
  const { momentumNow, setMomentum } = await import("./escalation.mjs");
  await setMomentum(momentumNow() + d, "set by the GM");
  return true;
}
async function onClick(ev) {
  if (await momentumClick(ev, 1)) return;
  const b = ev.target.closest("[data-hud]");
  if (!b || b.disabled) return;
  const cur = current(), actor = cur.actor, kind = b.dataset.hud;
  if (kind === "pick") { const t = canvas.tokens.get(b.dataset.token); t?.control({ releaseOthers: true }); return; }
  // v0.0.390 (PACK HUD2)
  if (kind === "party") { const c = st.cards?.get(b.dataset.key); if (!c) return; if (ev.detail >= 2) return c.actor.sheet?.render(true); if (c.token) return c.token.control({ releaseOthers: true }); if (!game.user.isGM && c.actor.isOwner) return c.actor.sheet?.render(true); return; }
  if (kind === "fold") { await game.settings.set(F, "hudFolded", !setting("hudFolded", false)); return; }
  if (kind === "rtab") { st.view = b.dataset.rtab === "sit" ? "sit" : "main"; st.rview = "main"; return syncSide(); }   // v0.0.446: the right column's tabs
  if (kind === "tab") { st.tab = b.dataset.tab; st.tabChosen = true; if (st.rx) st.rx = null; return renderHud(); }
  if (kind === "rx") { const msg = game.messages.get(b.dataset.msg); if (!msg) return; const { rxClick } = await import("./moment.mjs"); st.rx = null; await rxClick(msg, { dataset: { twod12: b.dataset.k, row: b.dataset.row }, tagName: "DIV" }); return renderHud(); }
  if (kind === "close") return closePop();
  if (!actor) return;
  const item = actor.items.get(b.closest("[data-item-id]")?.dataset.itemId ?? b.dataset.item ?? "");
  if (kind === "use" && item) { closePop(); return use(actor, item, Number(b.dataset.ap) || 0, ev.shiftKey); }
  if (kind === "line" && item && !ev.target.closest(".hb-st")) { const vs0 = (await actionsOf(actor)).list.find(x => x.id === item.id)?.versions ?? [], first = vs0.find(v => !v.off) ?? vs0.find(v => !v.lock); /* v0.0.453: a spent one too (the dialog warns) */ if (first) { closePop(); return use(actor, item, Number(first.ap) || 0, ev.shiftKey); } return; }
  if (kind === "grant") { const { useGrantOf } = await import("./freeuse.mjs"); return useGrantOf(actor, b.dataset.effect, Number(b.dataset.index) || 0, b.dataset.target || ""); }
  if (kind === "grantcancel") { const { cancelGrantOf } = await import("./freeuse.mjs"); return cancelGrantOf(actor, b.dataset.effect); }
  if (kind === "more") return openPanel("more", st.moreIds ?? []);
  if (kind === "hands") return b.dataset.hand ? handMenu(actor, b) : openPanel("hands");   // v0.0.444 (group 2): the menu above the tile
  if (kind === "steel") { const basic = actor.itemTypes.action.find(i => /steel yourself/i.test(i.name)); if (basic) return use(actor, basic, Math.min(...(basic.system.versions ?? [{ ap: 2 }]).map(v => Number(v.ap) || 0)), ev.shiftKey); return ui.notifications.info("No Steel Yourself on this sheet."); }
  if (kind === "card" && item) { if (st.card?.isConnected && st.cardId === item.id) return closePop({ keepOpen: true }); return showCard(actor, item, b); }
  if (kind === "cat") { const c = b.dataset.cat; if (actor.type !== "npc") { st.open = st.open === c ? "" : c; root.querySelectorAll(".cat").forEach(x => { x.classList.toggle("on", x.dataset.cat === st.open); x.setAttribute("aria-pressed", String(x.dataset.cat === st.open)); }); } return st.open || actor.type === "npc" ? openPanel(c) : closePop(); }
  if (kind === "attr") { const { CharacterSheet } = await import("./actor-sheets.mjs"); return CharacterSheet.rollAttr.call({ actor }, { shiftKey: ev.shiftKey || b.dataset.save === "1" }, { dataset: { key: b.dataset.key } }); }
  if (kind === "open" && item) return item.sheet.render(true);
  if (kind === "effect") return actor.effects.get(b.dataset.effect)?.sheet?.render(true);
  if (kind === "sheet") { const sh = actor.sheet; sh._activeTab = b.dataset.tab; return sh.render(true); }
  if (kind === "rest") {
    const { takeBreather, completeRest } = await import("./rest.mjs"), { completeSleep } = await import("./sleep.mjs");
    if (b.dataset.k === "breather") return takeBreather(actor, { ask: true });
    if (b.dataset.k === "sleep") return completeSleep(actor, { ask: true });
    if (b.dataset.k === "rest") return completeRest(actor);
  }
}
function onContext(ev) {
  if (game.user.isGM && ev.target.closest?.("[data-hud-mom]")) { momentumClick(ev, -1); return; }
  // v0.0.390 (PACK HUD2): right-click on AP, Rally or Escalation adjusts it (-1; Shift: +1), for the owner and the GM
  const res = ev.target.closest('[data-hud="res"]');
  if (res) { ev.preventDefault(); return adjust(current().actor, res.dataset.res, ev.shiftKey ? 1 : -1); }
  const ln = ev.target.closest(".hb-ln[data-item-id]");
  if (ln && ln.dataset.itemId) { ev.preventDefault(); const actor = current().actor, item = actor?.items.get(ln.dataset.itemId); if (!item) return; if (st.card?.isConnected && st.cardId === item.id) return closePop({ keepOpen: true }); return showCard(actor, item, ln); }
  // v0.0.381 (Lucas): right-click on an Action opens its card at once; on a PC's Version stamp it pins or unpins that Version (Quick)
  const ha = ev.target.closest(".ha[data-item-id]");
  if (!ha) return;
  ev.preventDefault();
  const actor = current().actor, item = actor?.items.get(ha.dataset.itemId);
  if (!item) return;
  const v = ev.target.closest(".hv[data-ap]");
  if (v && actor.type !== "npc") return toggleQuick(actor, item, Number(v.dataset.ap));
  if (st.card?.isConnected && st.cardId === item.id) return closePop({ keepOpen: true });   // v0.0.385: again closes it
  return showCard(actor, item, ha);
}

/** v0.0.390: right-click on a resource: AP (the combatant's, "edited" in the chat's line), Rally Points, Escalation. */
async function adjust(actor, res, d) {
  if (!actor || !(actor.isOwner || game.user.isGM)) return;
  if (res === "ap") {
    const C = await import("./combat.mjs"), c = game.combat?.started ? C.combatantOf(actor, game.combat) : null;
    if (!c) return ui.notifications.info("AP are tracked in combat.");
    return C.setAP(c, Math.max(0, C.getAP(c) + d), "edited");
  }
  if (res === "rally") { const s = actor.system ?? {}; const used = Math.min(Math.max(0, (Number(s.rallyUsed) || 0) - d), Number(s.rallyMax) || 0); return actor.update({ "system.rallyUsed": used }); }
  if (res === "esc") {
    if (d > 0) { const { raiseEscalation } = await import("./escalation.mjs"); return raiseEscalation(actor, "gm"); }
    return actor.update({ "system.escalation": Math.max(1, (Number(actor.system?.escalation) || 1) - 1) });
  }
}

/** The pick bar asks in the HUD's middle while a choice waits (pickbar.mjs calls it): the slot, or null when there is no HUD on screen. */
export function hudAskSlot() {
  // v0.0.399 (Lucas: "The pushed HUD isn't merged into the token HUD"): the HUD is position: fixed, and a fixed element has no offsetParent, so
  // this always said "no HUD"; its size says whether it is drawn
  if (!root?.isConnected || root.hidden || !root.getBoundingClientRect().width) return null;
  // v0.0.397 (Lucas: "in the same area as the granted action"): a creature's bar asks in its side panel; the party strip in the middle
  return root.querySelector(".hb-bar-wrap:not(.folded) .hb-ask") ?? root.querySelector(".hud-ask");
}
export const hudAsking = (on, side = false) => { root?.classList.toggle("asking", !!on && !side); root?.classList.toggle("asking-side", !!on && side); syncSide(); };
/**
 * v0.0.446 (Lucas: "only show the 'Situational' tab when there is something happening. When it happens, change tabs to the situational
 * automatically"): the right column's tab. Something waits (a Reaction, granted uses, Prone, a question or a movement in .hb-ask): the
 * Situational tab shows, and the HUD switches to it when it starts waiting; when nothing waits any more, back to the tab chosen before.
 */
function syncSide() {
  const side = root?.querySelector(".hud-main .h3-side");
  if (!side) return;
  const has = !!side.querySelector(".h3-sit > .h3-si, .h3-sit > .hb-gr, .hb-ask > *");
  side.classList.toggle("has-sit", has);
  if (has && !st.sitWas) st.view = "sit";
  if (!has && st.view === "sit") st.view = st.rview;
  st.sitWas = has;
  const v = has && st.view === "sit" ? "sit" : "main";   // v0.0.449: Situational, or the Hands with the macro bar
  side.dataset.rtab = v;
  side.querySelectorAll(".h3-rt").forEach(b => b.setAttribute("aria-selected", String(b.dataset.rtab === v)));
}

/* ------------------------------------------------------------------ the Reaction alert (v0.0.390; Lucas: "it can pass unnoticed") */
/** Pure: the waiting rows of a Reactions message this user answers: [{ row, actorUuid, itemId, name, cost, lead }]. */
export function waitingFor(stx, userId, isGM = false) {
  if (!stx || stx.done) return [];
  return (stx.rows ?? []).filter(r => r.state === "wait" && (r.answerer === userId || (isGM && !r.answerer))).map(r => ({ row: r.i, actorUuid: r.actorUuid, itemId: r.itemId, name: r.itemName, cost: `${Number(r.ap) || 0}R`, lead: String(stx.lead ?? "").replace(/<[^>]+>/g, "") }));
}
/** A soft two-note chime, made by the browser (no sound file), at Foundry's interface volume. */
export function chime() {
  try {
    const AC = globalThis.AudioContext ?? globalThis.webkitAudioContext; if (!AC) return;
    let vol = 0.5; try { vol = Number(game.settings.get("core", "globalInterfaceVolume")) || 0.5; } catch (e) { vol = 0.5; }
    // v0.0.392 (Lucas: "sounds too tech, we need some more medieval like"): a small bronze hand bell struck twice: a bell's inharmonic partials
    // (hum, prime, minor third, fifth, nominal), each fading at its own pace, a soft strike and a long ring
    const ctx = new AC(), t = ctx.currentTime, base = 392;
    const out = ctx.createGain(); out.gain.value = 0.16 * vol; out.connect(ctx.destination);
    const strike = (at, k) => [[0.5, 0.35, 2.4], [1, 0.6, 1.8], [1.2, 0.3, 1.4], [1.5, 0.22, 1.1], [2, 0.4, 0.9], [2.74, 0.12, 0.5], [4.2, 0.06, 0.3]].forEach(([r, a, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = base * k * r;
      g.gain.setValueAtTime(0, t + at); g.gain.linearRampToValueAtTime(a, t + at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + at + d);
      o.connect(g).connect(out); o.start(t + at); o.stop(t + at + d + 0.05);
    });
    strike(0, 1); strike(0.32, 1.335);
    setTimeout(() => ctx.close?.(), 3200);
  } catch (e) { /* no sound */ }
}
function onRxMessage(msg) {
  const stx = msg?.getFlag?.(F, "rx");
  if (!stx) return;
  const w = waitingFor(stx, game.user.id, game.user.isGM);
  const mine = w[0];
  const fresh = w.filter(x => !st.chimed.has(`${msg.id}:${x.row}`));
  fresh.forEach(x => st.chimed.add(`${msg.id}:${x.row}`));
  if (fresh.length && setting("rxChime", true)) chime();
  // a player: the HUD shows the reacting creature on its Reactions tab; the GM: the alert shows when that creature's bar is open
  st.rx = mine ? { ...mine, msg: msg.id } : (st.rx?.msg === msg.id ? null : st.rx);
  renderHud();
}

export function registerHud() {
  Hooks.once("ready", () => renderHud());
  Hooks.on("createChatMessage", onRxMessage); Hooks.on("updateChatMessage", onRxMessage);
  Hooks.on("deleteChatMessage", msg => { if (st.rx?.msg === msg.id) { st.rx = null; renderHud(); } });
  for (const h of ["controlToken", "canvasReady", "updateCombat", "combatTurn", "combatRound", "deleteCombat", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect"]) Hooks.on(h, () => renderHud());
  const mine = a => a && (a.uuid === st.actorUuid || (globalThis.canvas?.tokens?.controlled ?? []).some(t => t.actor === a));
  Hooks.on("updateActor", a => { if (mine(a)) renderHud(); });
  for (const h of ["createItem", "updateItem", "deleteItem"]) Hooks.on(h, i => { if (mine(i.parent)) renderHud(); });
  Hooks.on("renderHotbar", () => { if (root) placeHotbar(); });
  for (const h of ["collapseSidebar", "changeSidebarTab", "renderSceneControls", "renderChatLog", "renderSidebar"]) Hooks.on(h, () => { placeRoot(); setTimeout(placeRoot, 450); });
  for (const h of ["renderPlayers", "renderPlayerList"]) Hooks.on(h, () => { if (root && !root.hidden) placePlayers(); });
  Hooks.on("updateUser", (u, ch) => { if (u.isSelf && "character" in (ch ?? {})) renderHud(); });
}
