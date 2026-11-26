// Playtest 6, section 6 (D1-D5): MOCKUPS. Nothing in foundry/twod12 changed. Each part draws TODAY with the system's own code and CSS on example
// data (healwin.mjs healModel + pickwindow.mjs pickWindowHtml, sysmsg.mjs sysCard, chatcards.mjs attackCardHtml, the sheet's template on
// ../sheets/model.mjs, actioncard.mjs buildActionCard, hudview.mjs tokenBarHtml, pickbar.mjs pickBarHtml) beside the PROPOSAL, which is this
// page's own markup (proposal.mjs) styled by pt6.css under .p6-* classes.   index.html?theme=dark|light
import { makeActor, sheetModel, esc } from "../sheets/model.mjs";
import { hudState, todayModel } from "../hud3/model.mjs";
import * as P from "./proposal.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const CFG = await import("../../twod12/module/config.mjs");
const HW = await import("../../twod12/module/healwin.mjs");
const PW = await import("../../twod12/module/pickwindow.mjs");
const MSG = await import("../../twod12/module/sysmsg.mjs");
const CC = await import("../../twod12/module/chatcards.mjs"), RL = await import("../../twod12/module/roll.mjs");
const AC = await import("../../twod12/module/actioncard.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const HV = await import("../../twod12/module/hudview.mjs");
const PB = await import("../../twod12/module/pickbar.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { TWOD12 } = CFG;
const { ICONS } = await import("../npc-hud-icons.mjs");
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const noTips = html => html.replace(/\sdata-tooltip="[^"]*"/g, "");
const data = await (await fetch("actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");
const IMG = { durgan: "../../twod12/art/pcs/durgan.png", aveline: "../../twod12/art/pcs/aveline.png", sylwen: "../../twod12/art/pcs/sylwen.webp", kaela: "../../twod12/art/pcs/kaela.webp", goblin: "../../twod12/art/npcs/goblin-sneak.png", orc: "../../twod12/art/npcs/orc-warrior.png", ogre: "../../twod12/art/npcs/ogre-chieftain.png" };

/* ------------------------------------------------------------------ the page's frames */
/** A Foundry window on the page (the title bar is a stand-in; the content is the system's). */
const win = (title, w, cls, inner) => `<div class="mk-win p6-win" style="width:${w}px"><div class="application ${cls} themed theme-${theme}" style="width:${w}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div>`;
/** A chat message in the sidebar (Foundry's frame is a stand-in: the sender, the time). bare: a system line shows no sender (twod12.mjs bareSysLine). */
const chatMsg = (who, html, { bare = false } = {}) => `<li class="chat-message message p6-msg${bare ? " bare" : ""}">${bare ? "" : `<header class="message-header"><h4 class="message-sender">${esc(who)}</h4><span class="message-metadata"><time>Now</time></span></header>`}<div class="message-content">${icons(html)}</div></li>`;
const chatLog = (...msgs) => `<ol class="p6-chat chat-log themed theme-${theme}">${msgs.join("")}</ol>`;
const shot = (label, html, note = "") => `<div class="p6-shot"><h3>${label}</h3>${html}${note ? `<p class="p6-note">${note}</p>` : ""}</div>`;
const pair = (...shots) => `<div class="p6-pair">${shots.join("")}</div>`;
const sec = (id, title, quote, lists, body) => `<section class="p6-sec" id="${id}"><h2>${title}</h2><p class="p6-q">${quote}</p>${lists}${body}</section>`;
const list = (head, items) => `<div class="p6-list"><b>${head}</b><ul>${items.map(x => `<li>${x}</li>`).join("")}</ul></div>`;
const X = { theme, esc, icons, win, chatMsg, chatLog, IMG, ICONS, CFG, MSG, CC };

/* ================================================================== D1. The Rally window and its chat message */
function d1() {
  const durgan = makeActor(data.durgan, { system: { damage: { bodyLethal: 9 }, rallyUsed: 0 } }), s = durgan.system;
  // Durgan with Vigor and Resolve damage (a choice to make), then with Vigor damage only (none)
  const hurt = makeActor(data.durgan, { system: { damage: { bodyLethal: 9, bodyNonlethal: 2, mindLethal: 6 }, rallyUsed: 1 } }), h = hurt.system;
  const heal = Number(s.rallyHeal) || 0;
  const o = (a, total, n = 1, extraText = "") => ({ name: a.name, damage: a.system.damage, thresholds: HW.thresholdsOf(a), total, totalText: `Remove up to ${total} damage${extraText ? ` (${extraText})` : ""}`, rally: { n, max: a.system.rallyMax, left: Math.max(0, a.system.rallyLeft - n) } });
  const today = (a, total, n, extra) => { const oo = o(a, total, n, extra); return win(`Rally: ${a.name}`, 640, "twod12 classwin pickwin", `<div class="cw">${icons(PW.pickWindowHtml(HW.healModel(oo, { values: HW.symmetricHealing(oo.damage, oo.thresholds, oo.total) })))}</div>`); };
  // the "how many" window of @Rally[N|upto] (rally.mjs askHowMany)
  const many = (a, top, n) => win("Rally Points", 640, "twod12 classwin pickwin", `<div class="cw">${icons(PW.pickWindowHtml({ name: "Rally Points", sub: a.name, icon: "fa-heart-pulse", stats: [["Left", String(a.system.rallyLeft)], ["Each heals", String(a.system.rallyHeal)]],
    sections: [{ title: "How many?", pill: String(n), done: true, rows: [{ key: "n", label: "", opts: Array.from({ length: top }, (_, i) => ({ k: String(i + 1), l: String(i + 1), on: n === i + 1 })) }] }], complete: true, message: `${n} Rally Point${n === 1 ? "" : "s"}: ${n * a.system.rallyHeal} healing.`, confirm: "Use" }))}</div>`);
  // the chat message as rally.mjs useRally writes it (its lead, sub and result), through sysmsg.mjs sysCard
  const card = (a, text, n = 1) => MSG.sysCard({ title: "Rally", lead: `${esc(a.name)} uses ${n} Rally Point${n === 1 ? "" : "s"}`, text, cls: "rallymsg" });
  const left = s.rallyMax - s.rallyUsed - 1;
  const msgToday = chatLog(
    chatMsg(durgan.name, card(durgan, `${heal} healing<br>Choosing the damage to remove…`)),
    chatMsg(durgan.name, card(durgan, `${heal} healing<br>Removes <b>9</b> Vigor. <b>${left}</b> Rally Point${left === 1 ? "" : "s"} left.`)),
    chatMsg(hurt.name, card(hurt, `Lay On Hands: ${heal} + 3 [Font of Mercy] + 4 [1d6+Pow 2] healing<br>Removes <b>9</b> Vigor, <b>5</b> Resolve, <b>1</b> Vigor Nonlethal. <b>${h.rallyMax - h.rallyUsed - 1}</b> Rally Points left.`)),
    chatMsg(durgan.name, card(durgan, `${heal} healing<br>Cancelled: no Rally Point used.`)));
  const R = P.rally({ ...X, durgan, hurt, heal, HW });
  return sec("d1", "D1. The Rally window and its chat message",
    "“The rally window could use some reworking: it seems to have too much information. Let's do a complete redesign.” “The chat use of Rally Points as well.”",
    R.lists,
    `<h4 class="p6-h">The window</h4>`
    + pair(shot("Today: Durgan, 9 Vigor damage (nothing to choose)", today(durgan, heal, 1)), shot("Proposed: the same moment", R.winSimple))
    + pair(shot("Today: Durgan with Vigor, Vigor Nonlethal and Resolve damage (a choice)", today(hurt, heal, 1)), shot("Proposed, option A (recommended): the rows, the steppers shown", R.winA), shot("Proposed, option B: the pools' bars, the steppers behind “Change the split”", R.winB))
    + pair(shot("Today: an Action that lets you use up to 3 (two windows, one after the other)", `<div class="p6-stack">${many(hurt, 3, 2)}${today(hurt, heal * 2, 2)}</div>`), shot("Proposed: one window (the count is its first line)", R.winMany, R.manyNote))
    + `<h4 class="p6-h">The chat message</h4>`
    + pair(shot("Today (while choosing, done, with two bonuses, cancelled)", msgToday), shot("Proposed, option A (recommended): one line (sysLine)", R.msgA, R.msgANote), shot("Proposed, option B: the card kept, said once (sysCard)", R.msgB, R.msgBNote)));
}

/* ================================================================== D2. The chat card's breakdown button */
function d2() {
  const D = f => ({ faces: f, total: CC.dieValue(f), first: f[0] });
  const row = (name, d1, d2, total, dc, mods) => ({ name, uuid: "t1", total, dc, dcLabel: "AD", d1, d2, boonFaces: [], baneFaces: [], sources: [], mods, ...(() => { const x = RL.keepDice([D(d1), D(d2)], "", total - CC.dieValue(d1) - CC.dieValue(d2), dc); return { tier: x.tier, base: x.base, crit: x.crit, doubles: x.doubles }; })() });
  const view = CC.viewOf({ gm: true });
  // 1. Lucas's example: the Goblin Sneak's Rusty Knife on Sylwen, 2 Pierce; Durgan's Shield of Faith reduced it by 1 + Pow (3)
  const knife = { kind: "attack", name: "Rusty Knife", freq: "atwill", cost: "1 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Reach", names: ["Sylwen"] }, hasDamage: true };
  const kComps = [{ pool: "B", sub: "Pi", total: 2, formula: "1d4", dice: [{ faces: 4, results: [2] }], src: "Rusty Knife" }];
  // 2. a fuller one: Durgan's Smite on the Orc Warrior (example data: Resist 2 Slash, Weak 2 Holy, Guard 2)
  const smite = { kind: "attack", name: "Smite", freq: "encounter", cost: "2 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Weapon", names: ["Orc Warrior"] }, hasDamage: true };
  const sComps = [{ pool: "B", sub: "Sl", total: 6, formula: "1d8", dice: [{ faces: 8, results: [6] }], src: "Arming Sword" }, { pool: "B", sub: "Sl", total: 1, kind: "A", dice: [], label: "Weapon" }, { pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }], src: "Smite" }];
  const dm = (name, comps, rows, tier = 2) => ({ kind: "dmg", name, nl: false, groups: [{ tier, comps, riders: [], rows: rows.map((r, i) => i) }], rows });
  const cardOf = (atk, r, comps, drow) => `<div class="twod12 chat cc">${CC.attackCardHtml({ ...atk, rows: [r], dmg: dm(atk.name, comps, [drow], r.tier) }, view)}</div>`;
  const open = html => { const b = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html").body; b.querySelector(".cc-adjrow")?.classList.add("open"); b.querySelector("[data-cc-more]")?.setAttribute("aria-expanded", "true"); return b.innerHTML; };
  const kRow = row("Sylwen", [3], [9], 14, 12, [{ v: 2, label: "Weapon" }]), sRow = row("Orc Warrior", [4], [9], 14, 13, [{ v: 1, label: "Weapon" }]);
  const kPend = { name: "Sylwen", mods: [{ kind: "guard", v: -3, label: "Guard" }], choice: "", applied: null };
  const sPend = { name: "Orc Warrior", mods: [{ kind: "guard", v: -2, label: "Guard" }], choice: "", applied: null };
  const sDone = { name: "Orc Warrior", mods: [], choice: "", applied: { took: { B: 3, M: 9 }, state: "", factor: 1, mods: [{ kind: "resist", label: "Slash", v: -2 }, { kind: "weak", label: "Holy", v: 2 }] } };
  const today1 = chatLog(chatMsg("Goblin Sneak 2", open(cardOf(knife, kRow, kComps, kPend))));
  const today2 = chatLog(chatMsg("Durgan (Dwarf Paladin, Lay On Hands, level 1)", open(cardOf(smite, sRow, sComps, sPend))));
  const today3 = chatLog(chatMsg("Durgan (Dwarf Paladin, Lay On Hands, level 1)", open(cardOf(smite, sRow, sComps, sDone))));
  const R = P.breakdown({ ...X, cards: { knife: cardOf(knife, kRow, kComps, kPend), smite: cardOf(smite, sRow, sComps, sPend), smiteDone: cardOf(smite, sRow, sComps, sDone) } });
  return sec("d2", "D2. The chat card: the breakdown button, and Full / Half / Double on a right-click",
    "The sliders button (“Full, Half or Double”) shows three oversized buttons. Its new job: open the damage's breakdown for that target, for example “2 Pi − 3 Guard = 0 damage” when Shield of Faith gave Guard against that attack. Full / Half / Double move to a right-click on Apply (decided).",
    R.lists,
    pair(shot("Today: the sliders button clicked (the Goblin Sneak's Rusty Knife on Sylwen, after Shield of Faith)", today1), shot("Proposed, option A (recommended): one line a pool, written as the sum", R.a1), shot("Proposed, option B: a ledger, one step a line", R.b1))
    + pair(shot("Today: the sliders button clicked (Durgan's Smite on the Orc Warrior: Resist 2 Slash, Weak 2 Holy, Guard 2)", today2), shot("Proposed, option A (recommended)", R.a2), shot("Proposed, option B", R.b2))
    + pair(shot("Today: once applied (the sliders button clicked)", today3), shot("Proposed: once applied, the same button shows what happened", R.a3), shot("Proposed: a right-click on Apply (and on Undo, to change it afterwards)", R.menu, R.menuNote)));
}

/* ================================================================== D3. The NPC sheet's symbols */
function built(a, pc, st) {
  const ap = st.ap ?? 4, rap = st.rap ?? 1;
  for (const sc of pc.sections) for (const r of sc.rows) {
    const it = r.item.system, hb = r.handBtns;
    r.bar = { ...SM.actionBar({ aps: it.versions.map(v => v.ap), reaction: !!it.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: pc.strip.inCombat, ap, rap }), weaponId: hb?.length === 1 ? hb[0].id : "", hands: hb?.length >= 2 ? hb : null };
  }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; });
  const escN = Number(a.system.escalation) || 0;
  pc.strip.esc.pips = Array.from({ length: 6 }, (_, k) => k < escN);
  pc.strip.esc.hookList = st.hookList ?? [];
  pc.strip.esc.marks = SM.escMarks(escN, 6, [2, 4, 6]);
  pc.strip.lists = SM.combatLists({ npc: pc.npc, elite: pc.strip.elite, hookNames: st.hookNames ?? [], used: st.used ?? {}, rungs: pc.npc ? (SM.ELITE_RUNGS ?? []).map(r => ({ ...r, lit: escN >= r.n })) : SM.escRungs(escN, st.rungs ?? {}, true, 6), bloodied: a.system.bloodied, strained: a.system.strained });
  for (const g of pc.basic) for (const r of g.rows) { const f = CFG.effectiveFrequency(r.item.system); r.fq = f === "round" ? "round" : "atwill"; r.cost = String(r.cost).replace(/\s*AP$/, ""); }
  pc.mods.forEach(m => { m.tile = m.label; });
  for (const sc of pc.sections) for (const r of sc.rows) if (r.basicAtk) r.sub = [SM.basicAttackLine(r.item.system.versions?.[0]), ...String(r.sub).split(" · ").filter(x => /^Area/.test(x))].join(" · ");
  for (const sc of pc.sections) if (["reaction", "granted", "apex"].includes(sc.key)) sc.rows.forEach(r => { r.showFq = true; });
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.head.round = `Round ${st.round ?? 1}`;
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true });
  return pc;
}
async function sheetHtml(a, st, { open = true } = {}) {
  const pc = built(a, sheetModel(a, st), st);
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "actions");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "actions");
  if (open) for (const row of host.querySelectorAll(".ar.open")) { const it = a.items.get(row.dataset.itemId); if (it) row.querySelector(".ar-card").innerHTML = await AC.buildActionCard(it, { actor: a, short: true }); }
  return noTips(icons(art(host.innerHTML)));
}
const sheetWin = (title, h, inner, cls = "") => `<div class="mk-win ${cls}" style="width:540px;height:${h}px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px;height:${h}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div>`;
async function d3() {
  const orc = makeActor(data.orc, { system: { damage: { bodyLethal: 5 }, dmgMods: "Resist 2 Blunt, Weak 2 Fire", guard: 2 } });
  const ogre = makeActor(data.ogre, { system: { escalation: 2, bloodied: true, useEscalation: true, damage: { bodyLethal: 34 } } });
  const st = { inCombat: true, round: 2, ap: 4, dl: DL, cd: CD };
  const orcHtml = await sheetHtml(orc, st), ogreHtml = await sheetHtml(ogre, st);
  const R = P.symbols({ ...X });
  return sec("d3", "D3. A small symbol beside each stat of the NPC sheet",
    "“The icons of each feature in the NPC's sheet (AD, WD, Speed...) could get a small, ‘serious’ symbol next to each, to help with intuitiveness. Looking up words is harder than looking up symbols.”",
    R.lists,
    R.plate
    + pair(shot("Today: the Orc Warrior (the sheet's top)", `<div class="p6-crop-top">${sheetWin(orc.name, 330, orcHtml)}</div>`), shot("Proposed: the same sheet, a symbol before each word", `<div class="p6-crop-top p6-sym">${sheetWin(orc.name, 330, R.apply(orcHtml))}</div>`))
    + pair(shot("Today: the Ogre Chieftain (an Elite)", `<div class="p6-crop-top">${sheetWin(ogre.name, 330, ogreHtml)}</div>`), shot("Proposed", `<div class="p6-crop-top p6-sym">${sheetWin(ogre.name, 330, R.apply(ogreHtml))}</div>`))
    + R.alt);
}

/* ================================================================== D4. Using an Art opens its card */
async function d4() {
  const av = makeActor(data.aveline, { system: { escalation: 2 } }), syl = makeActor(data.sylwen, { system: { escalation: 2 } });
  const cmd = av.items.find(i => i.name === "Commandment"), spot = syl.items.find(i => i.name === "Spotter");
  const cardOf = async (a, it) => noTips(icons(art(await AC.buildActionCard(it, { actor: a }))));
  const hudcard = html => `<div class="twod12-hudcard p6-hudcard themed theme-${theme}"><button type="button" class="hc-x" aria-label="Close the card">&times;</button>${html}</div>`;
  // today's click: actions.mjs useAction's pick window (pickwindow.mjs pickOne)
  const pickOne = (it, modes) => win(it.name, 640, "twod12 classwin pickwin", `<div class="cw">${icons(PW.pickWindowHtml({ name: it.name, sub: "choose a Mode", icon: "fa-shapes", sections: [{ title: "", sub: "Each time you use an Art, you choose one of its Modes.", rows: [{ key: "one", label: "", opts: modes.map(m => ({ k: m, l: m, on: false })) }] }], message: "", confirm: false }))}</div>`);
  const modes = it => it.system.versions.map(v => v.mode).filter(Boolean);
  const cmdCard = await cardOf(av, cmd), spotCard = await cardOf(syl, spot);
  const R = P.arts({ ...X, cmd, spot, av, syl, cmdCard, spotCard });
  return sec("d4", "D4. Using an Art opens its card",
    "“Using an Art should open a window like the right click on an Art in the token HUD. The token HUD shows all information in a compact way, very good. So the clicking should show the same.”",
    R.lists,
    pair(shot("Today: a click on Commandment's “1 AP” (the sheet or the HUD): the Modes' names only", pickOne(cmd, modes(cmd))), shot("Today: a right-click on Commandment in the HUD (the card, 360 px)", hudcard(cmdCard)), shot("Proposed, option A (recommended): the click opens that card; each Mode's cost is its Use button", R.cmdA, R.noteA))
    + pair(shot("Proposed, option B: the card in a window, a Mode picked and then Use", R.cmdB, R.noteB), shot("Today: a right-click on Sylwen's Spotter", hudcard(spotCard)), shot("Proposed (A): Spotter; “Find the Gap” can't be used (no AP left: the example)", R.spotA)));
}

/* ================================================================== D5. The Minions' picker */
function d5() {
  const hotbar = () => `<aside id="hotbar"><menu id="action-bar" class="flexrow">${Array.from({ length: 10 }, (_, k) => `<li class="slot"><span class="key">${(k + 1) % 10}</span></li>`).join("")}</menu></aside>`;
  const h = hudState(data.durgan, { short: "Durgan", over: { system: { escalation: 2, damage: { bodyLethal: 9 } } }, ap: 0, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", used: ["Lay On Hands"] });
  const bar = ask => {
    const m = todayModel(h), words = { AD: ["ad", "AD"], WD: ["wd", "WD"], Spd: ["speed", "Speed"], Wpn: ["weapon", "Weapon"], Pow: ["power", "Power"] };
    m.defs = m.defs.map(d => (d.gap ? d : d.hud === "attr" ? { ...d, word: h.attrs.find(x => x.short === d.label)?.label } : { ...d, key: words[d.label]?.[0], word: words[d.label]?.[1] }));
    m.h3 = true; m.tab = "act"; m.conds = [];
    m.right = { rx: null, grants: [], cancels: [], prone: null, tiles: h.tiles, view: "sit" };
    let b = HV.tokenBarHtml(m);
    b = b.replace('<div class="hb-ask"></div>', `<div class="hb-ask">${ask}</div>`).replace('<div class="h3-hot"></div>', `<div class="h3-hot">${hotbar()}</div>`).replace(/<div class="h3-side[^"]*" data-rtab="[^"]*">/, '<div class="h3-side has-sit" data-rtab="sit">');
    return `<div class="twod12-hud is-bar with-hot hot-in-bar asking-side"><div class="hud-players"></div><div class="hud-main">${icons(b)}</div><div class="hud-ask"></div><div class="hud-hot"></div></div>`;
  };
  const squad = [1, 2, 3].map(n => ({ id: `g${n}`, label: `Goblin Sneak ${n}`, n }));
  const todayBar = `<div class="twod12-linebar twod12-pickbar in-hud in-side">${icons(PB.pickBarHtml({ icon: "fa-people-group", text: "<b>Goblin Sneak</b>: which one goes now? (3 of the squad left)", options: squad }))}</div>`;
  const R = P.minions({ ...X, squad, PB });
  const scene = (hud, over = "") => `<div class="p6-hcrop"><div class="mk-scene">${over}${hud}</div></div>`;
  return sec("d5", "D5. The Minions' picker: the token pictures",
    "“The ‘which one goes now’ for minions turn in the situational tab should show the token images, where on a hover it shows the name.”",
    R.lists,
    pair(shot("Today: the HUD's right end, the Situational tab (the GM's question, three Goblin Sneaks left)", scene(bar(todayBar), R.map(""))), shot("Proposed, option A (recommended): the pictures, each with its token's number", scene(bar(R.barA), R.map(""))), shot("The same, the pointer on the second picture: its name, and its token lit on the map (as today)", scene(bar(R.barAHover), R.map("g2"))))
    + pair(shot("Proposed, option B: the pictures alone (Lucas's words to the letter)", scene(bar(R.barB), R.map(""))), shot("A squad of 6: still one row", scene(bar(R.barSix), R.map(""))), shot("Two kinds of Minion in one squad (a stand-in: the Orc Warrior's picture)", scene(bar(R.barMixed), R.map("")))));
}

const out = document.getElementById("page");
out.insertAdjacentHTML("beforeend", `<h1>Playtest 6: the five redesigns (D1 to D5)</h1><p class="p6-lead">Mockups only: nothing in the system changed. Each part shows <b>today</b> (the system's own code and styles on example data, as the code stood on 2026-11-19) beside the <b>proposal</b>. Where there is a real choice there are two options, A and B, and the one recommended says why. The links at the top switch dark and light.</p>`);
for (const f of [d1, d2, d3, d4, d5]) { try { out.insertAdjacentHTML("beforeend", await f()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(f.name)}: ${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
document.querySelectorAll(".ps2-combat .ps2-ls").forEach(l => SM.fitList(l)); document.querySelectorAll(".ps2-bxn[data-fit]").forEach(n => SM.fitName(n));
P.afterLayout?.();
document.body.dataset.ready = "1";
