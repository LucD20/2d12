// Group 3 (Lucas, 2026-11-19, the PC sheet's Build tab): a MOCKUP. Nothing in foundry/twod12 changed.
// TODAY is the system's own template (templates/actor-sheet-pc.hbs) and CSS on the sheets mockup's model (../sheets/model.mjs), with the Build
// tab's part of pcsheet.mjs pcModel copied below (buildModel: pcModel needs a live Foundry actor). The PROPOSAL is the same HTML with the Build
// tab's top (the Level bar, the Species and Class cards) replaced by this page's markup, styled by group3.css under .g3-* classes.
// The confirmation windows are the system's own pickwindow.mjs pickWindowHtml (pickConfirm's model).   index.html?theme=dark|light
import { makeActor, sheetModel, esc } from "../sheets/model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const SM = await import("../../twod12/module/sheetmodel.mjs");
const CFG = await import("../../twod12/module/config.mjs");
const PW = await import("../../twod12/module/pickwindow.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { TWOD12, SIZE_NAMES, effectiveFrequency, isTalentAction } = CFG;
const { ICONS } = await import("../npc-hud-icons.mjs");
// the pick windows' arrows (Font Awesome 6 arrow-up / arrow-down), which the shared icon set lacks
ICONS["arrow-up"] ??= ["0 0 384 512", "M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"];
ICONS["arrow-down"] ??= ["0 0 384 512", "M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"];
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const data = await (await fetch("actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");
const F = "twod12", sg = v => (v >= 0 ? `+${v}` : `−${Math.abs(v)}`), L = TWOD12.attributes, MAX_LEVEL = 15;

/* ------------------------------------------------------------------ TODAY's model */
/** classwindow.mjs classTalentSlots (the Talent slots the class's Talent sections give at the levels reached), copied: it reads only the actor. */
function talentSlots(a) {
  const cls = a.itemTypes.class[0], lv = Math.max(1, Number(a.system.level) || 1), out = [];
  (cls?.system?.levels ?? []).forEach((l, i) => { if (i + 1 > lv) return; for (const s of l.sections ?? []) if (s.kind === "talent") for (let n = 0; n < Math.max(1, s.pick || 1); n++) out.push({ key: `class:${i + 1}:${s.id}:${n}`, feature: `${s.title} (Level ${i + 1})` }); });
  return out;
}
/** pcsheet.mjs pcModel, its "Build tab" part (v0.0.454), copied with the live parts stubbed (no open cards; the user is the GM, so Swap shows). */
function buildModel(a) {
  const s = a.system, cls = a.itemTypes.class[0] ?? null, sp = a.itemTypes.species[0] ?? null, vals = s.modSource === "class" || s.modSource === "role";
  const levels = cls?.system?.levels ?? [], lv = Math.max(1, Number(s.level) || 1);
  const secInfo = {};
  levels.forEach((l, k) => { if (k + 1 <= lv) for (const x of l.sections ?? []) secInfo[x.id] = { level: k + 1, title: x.title, pick: x.pick, kind: x.kind, granted: x.kind === "items" && x.mode === "granted", order: (l.sections ?? []).indexOf(x) }; });
  const cardsList = [...a.itemTypes.action, ...a.itemTypes.feature, ...a.itemTypes.talent].map(i => ({ id: i.id, name: i.name, kind: i.type, flags: i.flags?.twod12 ?? {}, category: i.system?.category, createdTime: 0, talentAction: isTalentAction(i) }));
  const bad = SM.slotless(cardsList, secInfo, id => a.items.has(id)), badIds = new Set(bad.map(c => c.id));
  const brow = (it, slot) => {
    const isA = it.type === "action", f = effectiveFrequency(it.system ?? {});
    return { id: it.id, slot, name: it.name, cost: isA ? SM.costPill((it.system.versions ?? []).map(v => v.ap), !!it.system.reaction) : "", fc: (SM.SHEET_FREQ[it.system?.reaction ? "reaction" : f] ?? SM.SHEET_FREQ.atwill).color, freq: isA && f ? TWOD12.frequencies[f] : "—", open: false };
  };
  const placed = new Set(), levelBlocks = [], escRows = [];
  for (let L2 = 1; L2 <= lv; L2++) {
    const rows = [];
    const mine = a.items.filter(i => Number(i.getFlag(F, "classLevel")) === L2 && !badIds.has(i.id) && i.type !== "class").sort((x, y) => (secInfo[x.getFlag(F, "classSection")]?.order ?? 99) - (secInfo[y.getFlag(F, "classSection")]?.order ?? 99));
    for (const it of mine) {
      const sec = secInfo[it.getFlag(F, "classSection")], rank = SM.escSectionRank(sec?.title);
      placed.add(it.id);
      if (rank) escRows.push({ rank, row: brow(it, rank === 4 ? "Apex" : `Escalation ${rank}`) });
      else rows.push(brow(it, SM.slotLabel(sec?.title ?? (it.type === "talent" ? "Talent" : "Feature"))));
    }
    if (rows.length) levelBlocks.push({ title: `Level ${L2}`, rows });
  }
  escRows.sort((x, y) => x.rank - y.rank);
  const other = [];
  for (const it of [...a.itemTypes.feature, ...a.itemTypes.talent, ...a.itemTypes.action.filter(isTalentAction)]) {
    if (placed.has(it.id) || badIds.has(it.id)) continue;
    const fl = it.flags?.twod12 ?? {};
    if (fl.featureId || fl.talentId || fl.weaponId || fl.inlineOf || fl.basic) continue;
    if (fl.grantedBy === "class" && fl.classLevel) continue;
    other.push(brow(it, it.type === "talent" || isTalentAction(it) ? (fl.slot ? "Talent" : "Extra Talent") : fl.grantedBy === "species" ? "Species" : "Feature"));
  }
  for (const c of bad) { const it = a.items.get(c.id); if (it) other.push({ ...brow(it, "No slot"), bad: true }); }
  const ssys = sp?.system, hl = s.healthLine ?? {};
  const spChips = sp ? [
    ...(ssys.pickTwo ? [...(ssys.chosen ?? [])].map(k => ({ t: `${L[k]} +1` })) : Object.entries(ssys.attributes ?? {}).filter(([, v]) => v).map(([k, v]) => ({ t: `${L[k]} ${sg(v)}` }))),
    { t: `Vigor ${sg(hl.bonusVigor ?? ssys.bodyMod ?? 0)}`, cls: "v" }, { t: `Resolve ${sg(hl.bonusResolve ?? ssys.mindMod ?? 0)}`, cls: "r" }
  ] : [];
  const csys = cls?.system;
  const chosen = csys ? (csys.chosenAttrs?.length ? csys.chosenAttrs : [csys.chosenA, csys.chosenB]).filter(Boolean) : [];
  const cards = [
    ...(sp ? [{ kind: "SPECIES", name: sp.name, choices: "openSpecies", chips: spChips, stats: [{ v: ssys.speed, l: "Speed" }, { v: ssys.reach, l: "Reach" }, { v: SIZE_NAMES[ssys.size ?? s.size ?? 3] ?? "", l: "Size" }, { v: Number(ssys.steadiness) || 0, l: "Steady" }] }] : []),
    ...(cls ? [{ kind: "CLASS", name: `${cls.name} ${lv}`, choices: "openClass", chips: [...chosen.map(k => ({ t: `${L[k]} +1` })), { t: `Vigor ${hl.classVigor ?? 0}`, cls: "v" }, { t: `Resolve ${hl.classResolve ?? 0}`, cls: "r" }],
      stats: [{ v: vals ? sg(s.weaponMod) : (L[s.weaponAttribute] ?? "—"), l: "Weapon" }, { v: vals ? sg(s.powerMod) : (L[s.powerAttribute] ?? "—"), l: "Power" }, { v: csys.rallyMod ?? 0, l: "Rally" }, { v: TWOD12.armorTrainings[s.armorTraining] ?? "—", l: "Armor" }] }] : [])
  ];
  const stNext = TWOD12.stages.find(x => x.n === (Number(s.stage) || 0) + 1);
  const next = cls ? SM.nextLevels(lv, levels, stNext ? { at: stNext.from, n: stNext.n, health: [csys[`stepHigh${stNext.n}`] ?? 0, csys[`stepLow${stNext.n}`] ?? 0], guard: TWOD12.guardPerAp[stNext.n], rally: TWOD12.rallyByStage[stNext.n] - TWOD12.rallyByStage[stNext.n - 1], modifiers: stNext.n === 1 ? "one" : (TWOD12.stageModStep[stNext.n] ?? 0) > 0 ? "both" : "" } : null) : [];
  return { banner: bad.length ? { count: bad.length, one: bad.length === 1, names: bad.map(c => c.name).join(" · ") } : null, cards, levels: levelBlocks, esc: escRows.map(x => x.row), other, next,
    swap: cls ? { tip: "The GM: change this character's level-list choices (Swapping comes with a Rest)" } : null, emptySlots: talentSlots(a), bad: bad.length,
    // for the proposal (not in pcModel): the same facts, unchipped
    sp: sp ? { name: sp.name, attrs: spChips.filter(c => !c.cls).map(c => c.t), vigor: sg(hl.bonusVigor ?? ssys.bodyMod ?? 0), resolve: sg(hl.bonusResolve ?? ssys.mindMod ?? 0), stats: cards[0].stats } : null,
    cls: cls ? { name: cls.name, attrs: chosen.map(k => `${L[k]} +1`), vigor: String(hl.classVigor ?? 0), resolve: String(hl.classResolve ?? 0), stats: cards[sp ? 1 : 0].stats } : null };
}
/** The sheet's model as built (../sheets/built.mjs "built", out of combat), with the Build tab's. */
function model(a) {
  const pc = sheetModel(a, { inCombat: false, dl: DL, cd: CD }), escN = Number(a.system.escalation) || 0;
  for (const sec of pc.sections) for (const r of sec.rows) { const it = r.item.system; r.bar = { ...SM.actionBar({ aps: it.versions.map(v => v.ap), reaction: !!it.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: false, ap: 4, rap: 1 }), weaponId: "", hands: null }; }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; });
  pc.mods.forEach(m => { m.tile = m.label; });
  pc.strip.esc.marks = SM.escMarks(escN, 6, [2, 4, 6]);
  pc.strip.lists = SM.combatLists({ npc: false, elite: false, hookNames: [], used: {}, rungs: SM.escRungs(escN, {}, true, 6), bloodied: false, strained: false });
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.build = buildModel(a);
  pc.tabs.find(t => t.k === "build").n = pc.build.bad;
  return pc;
}

/* ------------------------------------------------------------------ the creatures */
const actor = (k, over) => makeActor(data[k], over);
/** EXAMPLE DATA: the compendium's level 4 Aveline lowered to level 3 (what her levels 1 to 3 gave is the compendium's; her level 4 Stage Talent slot is empty). */
const aveline3 = () => { const d = structuredClone(data.aveline4); d.system.level = 3; d.name = "Aveline (Human Paladin, Smite)"; return makeActor(d); };

/* ------------------------------------------------------------------ the proposal's markup */
const stageOf = CFG.stageOf, stageRow = n => TWOD12.stages.find(x => x.n === n);
const btn = (word, action, { off = "", quiet = false, icon = "" } = {}) => `<button type="button" class="g3-btn${quiet ? " quiet" : ""}${off ? " no" : ""}" data-action="${action}"${off ? ` aria-disabled="true" data-off="${esc(off)}"` : ""}>${icon ? `<i class="fa-solid ${icon}"></i> ` : ""}${esc(word)}</button>`;
/** The Level's buttons (Level option A): Level up, and the quieter Level down; at the ends the button is off with its reason. B: one Change level button. */
function levelCtl(lv, opt = "A") {
  if (opt === "B") return `<span class="g3-lvc"><span class="g3-lvw">Level <b>${lv}</b></span>${btn("Change level", "changeLevel")}</span>`;
  return `<span class="g3-lvc"><span class="g3-lvw">Level <b>${lv}</b></span>${btn("Level up", "levelUp", { off: lv >= MAX_LEVEL ? "Level 15 is the highest" : "" })}${btn("Level down", "levelDown", { quiet: true, off: lv <= 1 ? "Level 1 is the lowest" : "" })}</span>`;
}
const swapBtn = b => (b.swap ? btn("Swap on a Rest", "swapRest", { quiet: true, icon: "fa-right-left" }) : "");
/** The 15 levels in their four Stages, the level reached filled, the current one ringed; the Stage reached's name in ink. */
function ladder(lv) {
  return `<div class="g3-ladder" aria-label="Level ${lv} of 15">${TWOD12.stages.map(st => `<div class="g3-lg${stageOf(lv) === st.n ? " on" : ""}"><span class="g3-cells">${Array.from({ length: st.to - st.from + 1 }, (_, k) => { const n = st.from + k; return `<i class="${n < lv ? "past" : n === lv ? "now" : ""}">${n}</i>`; }).join("")}</span><small>Stage ${st.n}</small></div>`).join("")}</div>`;
}
/** Stage option A: the tab's title band (the Stage in the big serif, its levels, when the next one comes; the Level and its buttons at the right; the ladder under). */
function stageBand(lv, b, lvOpt = "A") {
  const n = stageOf(lv), st = stageRow(n), nx = stageRow(n + 1);
  return `<div class="g3-stage a"><div class="g3-st1"><div class="g3-stt"><span class="g3-stw">Stage</span> <span class="g3-stn">${n}</span></div>
    <div class="g3-sts"><span>Levels ${st.from} to ${st.to}</span><span class="g3-q">${nx ? `Stage ${nx.n} at level ${nx.from}` : "The last Stage"}</span></div>${levelCtl(lv, lvOpt)}</div>
    ${ladder(lv)}</div>`;
}
/** Stage option B: a plaque (a ruled square, the word and the big number), the Level line and the next Stage beside it; no ladder. */
function stagePlaque(lv, b, lvOpt = "A") {
  const n = stageOf(lv), st = stageRow(n), nx = stageRow(n + 1);
  return `<div class="g3-stage b"><div class="g3-plq"><span>Stage</span><b>${n}</b></div><div class="g3-plr">${levelCtl(lv, lvOpt)}
    <div class="g3-sts"><span>Stage ${n} is levels ${st.from} to ${st.to}</span><span class="g3-q">${nx ? `Stage ${nx.n} at level ${nx.from}` : "The last Stage"}</span></div></div></div>`;
}
const kv = (k, v, cls = "") => `<span class="g3-kv"><span class="g3-k">${esc(k)}</span> <b class="${cls}">${esc(v)}</b></span>`;
const statsLine = stats => stats.map(x => kv(x.l, x.v)).join("");
/** Species and Class option A: two ruled entries, full width (the kind at the left, the name, Choices at the right; two lines of what it gives). */
function originA(b) {
  const ent = (kind, name, action, l1, l2, extra = "") => `<div class="g3-ent"><div class="g3-eh"><span class="g3-ek">${kind}</span><b class="g3-en">${esc(name)}</b><span class="g3-ebtns">${extra}${btn("Choices", action, { quiet: true })}</span></div><div class="g3-el">${l1}</div><div class="g3-el">${l2}</div></div>`;
  const out = [];
  if (b.sp) out.push(ent("Species", b.sp.name, "openSpecies", `${kv("Attributes", b.sp.attrs.join(", ") || "none")}${kv("Vigor", b.sp.vigor, "dom-Vigor")}${kv("Resolve", b.sp.resolve, "dom-Resolve")}`, statsLine(b.sp.stats)));
  if (b.cls) out.push(ent("Class", b.cls.name, "openClass", `${kv("Attributes", b.cls.attrs.join(", ") || "none")}${kv("Vigor", b.cls.vigor, "dom-Vigor")}${kv("Resolve", b.cls.resolve, "dom-Resolve")}`, statsLine(b.cls.stats), swapBtn(b)));
  return out.length ? `<div class="g3-origin a">${out.join("")}</div>` : `<div class="ps-empty">Drop a Species and a Class on this sheet.</div>`;
}
/** Species and Class option B: side by side, a column each (the name over a rule, Choices at its right; four short lines). */
function originB(b) {
  const col = (kind, name, action, lines, extra = "") => `<div class="g3-col"><div class="g3-eh"><b class="g3-en">${esc(name)}</b><span class="g3-ek">${kind}</span><span class="g3-ebtns">${btn("Choices", action, { quiet: true })}</span></div>${lines.map(l => `<div class="g3-el">${l}</div>`).join("")}${extra ? `<div class="g3-el g3-ex">${extra}</div>` : ""}</div>`;
  const two = st => [statsLine(st.slice(0, 2)), statsLine(st.slice(2))];
  const out = [];
  if (b.sp) out.push(col("Species", b.sp.name, "openSpecies", [kv("Attributes", b.sp.attrs.join(", ") || "none"), `${kv("Vigor", b.sp.vigor, "dom-Vigor")}${kv("Resolve", b.sp.resolve, "dom-Resolve")}`, ...two(b.sp.stats)]));
  if (b.cls) out.push(col("Class", b.cls.name, "openClass", [kv("Attributes", b.cls.attrs.join(", ") || "none"), `${kv("Vigor", b.cls.vigor, "dom-Vigor")}${kv("Resolve", b.cls.resolve, "dom-Resolve")}`, ...two(b.cls.stats)], swapBtn(b)));
  return `<div class="g3-origin b">${out.join("")}</div>`;
}

/* ------------------------------------------------------------------ drawing a sheet */
/** One window with the Build tab open. prop: null (today) or { stage: "A"|"B", origin: "A"|"B", level: "A"|"B" }. crop: "" (the whole 540 x 840
 *  window, as on screen), "tab" (the Build tab whole, unscrolled, the sheet's top left out) or "top" (only the Build tab's top). */
function draw(a, pc, { prop = null, crop = "", cap = "", note = "" } = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "build");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "build");
  host.querySelectorAll("[data-tooltip]").forEach(x => x.removeAttribute("data-tooltip"));
  if (prop) {
    const stack = host.querySelector('.tab[data-tab="build"] .ps-stack'), lvbar = stack.querySelector(".ps-lvlbar"), cards = stack.querySelector(".ps-g2.wide"), lv = Number(a.system.level) || 1;
    lvbar.outerHTML = (prop.stage === "B" ? stagePlaque : stageBand)(lv, pc.build, prop.level);
    cards.outerHTML = (prop.origin === "B" ? originB : originA)(pc.build);
    stack.classList.add("g3-stack");
  }
  const h = crop ? "auto" : "840px";
  return `<div class="g3-shot"><h3>${cap}</h3><div class="g3-clip${crop ? ` g3-crop g3-crop-${crop}` : ""}"><div class="mk-win" style="width:540px;height:${h}"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px;height:${h}"><header class="window-header"><span class="window-title">${esc(a.name)}</span><span class="mk-x">&times;</span></header><section class="window-content">${icons(art(host.innerHTML))}</section></div></div></div>${note ? `<p class="g3-note">${note}</p>` : ""}</div>`;
}
/** A confirmation as pickwindow.mjs pickConfirm draws it (the system's own pickWindowHtml, in the pick window's frame). */
function confirmWin(o, cap = "", note = "") {
  const m = { name: o.name, sub: o.sub ?? "", icon: o.icon, stats: o.stats ?? [], sections: [{ title: o.heading ?? "", html: `<div class="cw-sub pw-text">${CFG.highlightText(o.text ?? "")}</div>` }], message: o.message ?? "", confirm: o.confirm ?? "Confirm" };
  return `<div class="g3-shot"><h3>${cap}</h3><div class="mk-win g3-pw" style="width:520px"><div class="application twod12 classwin pickwin themed theme-${theme}" style="width:520px"><header class="window-header"><span class="window-title">${esc(o.title)}</span><span class="mk-x">&times;</span></header><section class="window-content"><div class="cw">${icons(PW.pickWindowHtml(m))}</div></section></div></div>${note ? `<p class="g3-note">${note}</p>` : ""}</div>`;
}
/** Option B's window: one Change level window with the system's − / + stepper (pickwindow.mjs pwStepHtml) and what the change gives or takes. */
function changeWin(a, to, cap, note) {
  const from = Number(a.system.level) || 1;
  const m = { name: "Change level", sub: a.name.split(" (")[0], icon: "fa-arrow-up", stats: [["Level", `${from} → ${to}`], ["Stage", stageOf(from) === stageOf(to) ? String(stageOf(from)) : `${stageOf(from)} → ${stageOf(to)}`]],
    sections: [{ title: "New level", html: `<div class="g3-pwstep">${PW.pwStepHtml("level", String(to))}</div>` }, { title: `What level ${to} gives`, html: `<div class="cw-sub pw-text">${gainsText(a, to)}<br>The class window opens next, one level at a time, for its choices.</div>` }], message: "", confirm: `Go to level ${to}` };
  return `<div class="g3-shot"><h3>${cap}</h3><div class="mk-win g3-pw" style="width:520px"><div class="application twod12 classwin pickwin themed theme-${theme}" style="width:520px"><header class="window-header"><span class="window-title">${esc(a.name.split(" (")[0])}: change level</span><span class="mk-x">&times;</span></header><section class="window-content"><div class="cw">${icons(PW.pickWindowHtml(m))}</div></section></div></div>${note ? `<p class="g3-note">${note}</p>` : ""}</div>`;
}
/** What the next level gives, from the Build tab's own "Next levels" line (sheetmodel.mjs nextLevels). */
function gainsText(a, to) {
  const cls = a.itemTypes.class[0], s = a.system, n = stageOf(to), stNext = stageRow(n);
  const rows = SM.nextLevels(to - 1, cls.system.levels ?? [], stNext && stNext.from === to ? { at: to, n, health: [cls.system[`stepHigh${n}`] ?? 0, cls.system[`stepLow${n}`] ?? 0], guard: TWOD12.guardPerAp[n], rally: TWOD12.rallyByStage[n] - TWOD12.rallyByStage[n - 1], modifiers: n === 1 ? "one" : (TWOD12.stageModStep[n] ?? 0) > 0 ? "both" : "" } : null);
  const r = rows.find(x => x.level === to);
  return `<b>Level ${to}:</b> ${esc(r?.text ?? "—")}`;
}
/** classwindow.mjs levelsDown's list: what the levels above the new one gave (the items, then the Attribute increases). */
function lossText(a, to) {
  const cls = a.itemTypes.class[0];
  const gone = a.items.filter(i => (Number(i.getFlag(F, "classLevel")) || 0) > to).map(i => i.name);
  const lost = Object.entries(cls.getFlag(F, "classAttrs") ?? {}).filter(([l]) => Number(l) > to).flatMap(([, v]) => v).map(k => `+1 ${L[k] ?? k}`);
  return [...gone, ...lost];
}

/* ------------------------------------------------------------------ the page */
const pair = (...shots) => `<div class="g3-pair">${shots.join("")}</div>`;
const sec = (n, title, quote, notes, body) => `<section class="g3-sec"><h2>${n}. ${title}</h2>${quote ? `<p class="g3-qt">Lucas: ${quote}</p>` : ""}<ul class="g3-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>${body}</section>`;
const REC = { stage: "A", origin: "A", level: "A" };
const TODAY = "Today (v0.0.454)";
const out = document.getElementById("page");
const av = actor("aveline"), avPc = model(av), av3 = aveline3(), av3Pc = model(av3);
const parts = [
  () => sec(1, "Aveline, level 1: today and the proposal", "",
    ["The window as it opens on the Build tab, 540 × 840 px. <b>Proposed</b> = the recommended options of parts 2 to 4: the Stage as the tab's title band (2A), the Level changed only by its buttons (3A), Species and Class as ruled entries (4A).",
      "Only the tab's top changes. The level lists under it (Level 1, Escalation, Other, Next levels, the Talent slots) are today's, untouched.",
      "The new top is about as tall as today's (269 px against 279): the Stage band takes what the Species and Class lines give back, so the level lists start where they start today."],
    pair(draw(av, avPc, { cap: TODAY }), draw(av, avPc, { cap: "Proposed (2A + 3A + 4A)", prop: REC }))),
  () => {
    const stg = [1, 3, 4, 9, 13].map(lv => `<div class="g3-mini"><h4>Level ${lv}${lv > 4 ? " (example)" : ""}</h4><div class="g3-strip theme-${theme} themed">${stageBand(lv, { swap: null })}</div></div>`).join("");
    const stgB = [1, 4, 13].map(lv => `<div class="g3-mini"><h4>Level ${lv}${lv > 4 ? " (example)" : ""}</h4><div class="g3-strip theme-${theme} themed">${stagePlaque(lv, { swap: null })}</div></div>`).join("");
    return sec(2, "A more imposing Stage: pick A or B", "“A more imposing Stage.”",
      ["Today the Stage is a small grey “Stage 0” after the Level field (and in the plate's line, “Level 1 · Stage 0”, which stays as it is).",
        "<b>Option A (recommended): the Stage is the tab's title.</b> “Stage 0” in the big serif (the one place on the tab that takes it), its levels and when the next Stage comes beside it, the Level and its buttons at the right. Under it <b>the 15 levels in their four Stages</b>: the levels passed filled, the current one ringed in the bronze, the Stage reached named in ink. Why: it shows what a Stage is (a group of levels) and how far the next one is, which a number alone doesn't; it is the one picture on the tab, so it is imposing without a color of its own.",
        "<b>Option B: a plaque.</b> A ruled square with “Stage” and the big number, the Level line and the next Stage beside it; no ladder. Shorter (about 78 px against 100) and quieter; it says the Stage, not where you are in it.",
        "No color for the Stage (it has no meaning to carry): the bronze accent marks only the current level, as it marks the open tab. Levels 9 and 13 are example values (Stages 2 and 3 are not written yet)."],
      `<h3 class="g3-sub">Option A at Stages 0 to 3</h3><div class="g3-minis">${stg}</div><h3 class="g3-sub">Option B</h3><div class="g3-minis">${stgB}</div>`);
  },
  () => {
    const nx3 = lossText(av3, 2);
    return sec(3, "The Level changes only through a button with a confirm step: pick A or B", "“The Level changed only through a button with a confirm step.”",
      ["<b>Today</b> the Level is a number field (<code>system.level</code>, the sheet's form saves on change). Typing a higher number opens the class window once for each new level (twod12.mjs updateActor → classwindow.mjs classLevelChange; its Cancel keeps the level reached); typing a lower one asks to confirm only when it removes something. Nothing stops a slip: “12” typed in the place of “2” starts ten class windows in a row.",
        "<b>Option A (recommended): Level up and Level down buttons</b>, one level a click. Each opens a confirmation in the pick window's style (pickwindow.mjs pickConfirm, drawn below with the system's own markup) that says what the level gives or takes; Confirm, then the class window as today (level up). Level down asks every time (today only when something is lost). At level 15 Level up is off, at level 1 Level down (each with its reason, the one hover text the rules allow). Why A: the usual change is one level up, one click and one confirmation; Level down is quieter (outlined in the hairline, not the bronze) so it is not hit by mistake.",
        "<b>Option B: one Change level button</b> opens one window with the system's − / + stepper, the new Stage and what it gives; Confirm, then the class windows one level at a time. Better for a character made at level 3 at once; one more step for the usual one level.",
        "The field goes in both. The plate's “Level 1 · Stage 0” stays text. The NPC Builder's Level field is not touched (an NPC has no class windows)."],
      `<h3 class="g3-sub">Option A: the buttons (on the Stage band of 2A), then the confirmation</h3>`
      + pair(draw(av, avPc, { cap: "Aveline, level 1: Level down is off", prop: REC, crop: "top" }), draw(av3, av3Pc, { cap: "Aveline, level 3 (example data)", prop: REC, crop: "top" }))
      + pair(confirmWin({ title: "Aveline: level up", name: "Level 2", sub: "Aveline", icon: "fa-arrow-up", stats: [["Level", "1 → 2"], ["Stage", "0"]], text: `${gainsText(av, 2)}<br>The class window opens next for its choices.`, confirm: "Level up" }, "Level up, from level 1", "The text is the tab's own “Next levels” line for level 2."),
        confirmWin({ title: "Aveline: level down", name: "Level 2", sub: "Aveline", icon: "fa-arrow-down", stats: [["Level", "3 → 2"], ["Stage", "0"]], text: `Going down to level 2 removes what level 3 gave: <b>${nx3.map(esc).join(", ")}</b>`, confirm: "Level down" }, "Level down, from level 3 (example data)", "Today's wording (classwindow.mjs levelsDown), now asked every time."))
      + confirmWin({ title: "Aveline: level up", name: "Level 4", sub: "Aveline", icon: "fa-arrow-up", stats: [["Level", "3 → 4"], ["Stage", "0 → 1"]], text: `${gainsText(av3, 4)}<br>The class window opens next for its choices.`, confirm: "Level up" }, "Level up into a new Stage (from the level 3 example)", "The Stage's line says what the Stage gives; the stats line says the Stage changes.")
      + `<h3 class="g3-sub">Option B: one button, one window with a stepper</h3>`
      + pair(draw(av, avPc, { cap: "Aveline, level 1", prop: { ...REC, level: "B" }, crop: "top" }), changeWin(av, 2, "Change level (the stepper set to 2)", "The − / + are the system's stepper (pwStepHtml); the window redraws the list as the number moves.")));
  },
  () => {
    const pcs = [["aveline", "Aveline"], ["durgan", "Durgan"], ["sylwen", "Sylwen"], ["kaela", "Kaela"]].map(([k]) => { const a = actor(k); return [a, model(a)]; });
    const row = ([a, pc]) => pair(draw(a, pc, { cap: `${TODAY} · ${a.name.split(" (")[0]}`, crop: "cards" }), draw(a, pc, { cap: "Option A: ruled entries", prop: REC, crop: "top" }), draw(a, pc, { cap: "Option B: side by side", prop: { ...REC, origin: "B" }, crop: "top" }));
    return sec(4, "The Species and Class areas: pick A or B", "“The Species and Class areas are a bit weird; very thick dark header for example.”",
      ["<b>Today:</b> two cards one above the other, each a thick navy header (a spaced-out capital “SPECIES”, the name in the serif, an amber filled Choices button), a row of filled pills (Vigor red, Resolve blue) and four filled boxes: a box inside a box inside a card, the interface-kit look STYLE-3 removed elsewhere.",
        "<b>Option A (recommended): two ruled entries, as the stat lines at the sheet's top.</b> The kind in grey at the left, the name in bold, Choices an outlined button at the right; then two lines of what it gives, each a grey word and its number (the top's own <code>.k</code> + bold). Vigor and Resolve keep the pool colors in the text, the Attributes are in ink. Why A: it reads exactly as the lines above it, every line is the full width (nothing wraps or shrinks), and it is about a third shorter than the cards (169 px against 251).",
        "<b>Option B: side by side, a column each.</b> The two things a character is built from read as a pair; a little shorter than A (about 160 px, Swap on a Rest's line included). The columns are narrow (four short lines each), so a long Species or class name, or a third Attribute, would wrap.",
        "Kept in both: every number the cards show, both Choices buttons (the Species window; the class's sheet). <b>Moved:</b> Swap on a Rest (shown after a Rest, and always to the GM) leaves the Level's line for the Class: it changes the choices the class's level list gave (A: beside Choices; B: under the class's column). Dropped: the header bars, the pills, the boxes, the capital “SPECIES” / “CLASS” and the level after the class's name (“Paladin 1”: the Stage band says the level)."],
      pcs.map(row).join(""));
  },
  () => sec(5, "Aveline, level 3 (example data): today and the proposal", "",
    ["<b>Example data:</b> the compendium's level 4 Aveline lowered to level 3 (what her levels 1 to 3 gave is the compendium's own: Kindled Wrath, Word of Radiance, Weight of Judgment, Lantern of Faith, Reckoning).",
      "The Build tab drawn whole (unscrolled; the sheet's top above the tabs is left out), so its full length shows: the window shows its first ~430 px and scrolls."],
    pair(draw(av3, av3Pc, { cap: TODAY, crop: "tab" }), draw(av3, av3Pc, { cap: "Proposed (2A + 3A + 4A)", prop: REC, crop: "tab" })))
];
out.insertAdjacentHTML("beforeend", `<h1>Group 3: the PC sheet's Build tab</h1><p class="g3-lead">A mockup: nothing in the system changed. Today is the system's own template and CSS (v0.0.454) on the compendium PCs; the proposal changes only the top of the Build tab. Dark and light are the same page (the links at the top).</p>`);
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
document.querySelectorAll(".ps2-combat .ps2-ls").forEach(l => SM.fitList(l));
document.body.dataset.ready = "1";
