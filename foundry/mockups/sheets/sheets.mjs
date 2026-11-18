// THE SHEETS REDESIGN (playtest 5, E1 / E2 / E3 / E6): the mockup. For each of the three sheets, the current one (the system's own template,
// CSS and card renderers, on the compendium's creature) next to the proposal. ?theme=dark|light&sheet=pc|npc|onepage (all three when left out)
import { enrichHTML } from "./stubs.mjs";
import { makeActor, sheetModel, esc, enrichCard } from "./model.mjs";
const q = new URLSearchParams(location.search);
const theme = q.get("theme") === "light" ? "light" : "dark", only = q.get("sheet") ?? "";
document.body.classList.add(`theme-${theme}`);

const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const AC = await import("../../twod12/module/actioncard.mjs");
const SB = await import("../../twod12/module/statblock.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const P = await import("./proposal.mjs");
const { TWOD12 } = await import("../../twod12/module/config.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const { SIGNIKA } = await import("../npc-hud-signika.mjs");
// Signika (Foundry's own font: the system's CSS only names it) and the icons (Font Awesome is Foundry's too: the mockups' drawn set stands in)
document.head.insertAdjacentHTML("beforeend", `<style>${Object.entries(SIGNIKA).map(([w, d]) => `@font-face { font-family: "Signika"; font-weight: ${w}; font-style: normal; src: url(data:font/woff2;base64,${d}) format("woff2"); }`).join("")}</style>`);
// E6: on a dark sheet a damage type's word (and its flat amount) takes the bright set (config.mjs subtypeColors, what the Resist / Weak chips
// already use), not the parchment's ink. The same fault the other way around, found here: on a light sheet the stat block writes the Vigor /
// Resolve dice in the dark set's pale colors; the proposals give them the light set's.
document.head.insertAdjacentHTML("beforeend", `<style>${Object.entries(TWOD12.subtypeColors).map(([k, c]) => `.theme-dark .mk-e6 .dtype.dt-${k.toLowerCase()}, .theme-dark .mk-e6 .dtamt:has(+ .dtype.dt-${k.toLowerCase()}) { color: ${c} !important; }`).join("")}
.theme-light .mk-e6 .twod12-sb .pool-b, .theme-light .mk-e6 .twod12-sb .dt-body { color: var(--s-vig); } .theme-light .mk-e6 .twod12-sb .pool-m, .theme-light .mk-e6 .twod12-sb .dt-mind { color: var(--s-res); }</style>`);
ICONS.khanda = ["0 0 512 512", "M474 24 L330 60 L150 300 L212 362 L452 182 Z M120 300 L60 360 L96 396 L52 440 L72 460 L116 416 L152 452 L212 392 Z"];
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const SWORD = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M474 24 330 60 150 300l62 62 240-180zM120 300l-60 60 36 36-44 44 20 20 44-44 36 36 60-60z"/></svg>');
// the art is the system's (foundry/twod12/art); Foundry's own icons/svg are not in the repository: its sword (the Slash word's picture) is drawn here
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/sword\.svg"/g, `src="${SWORD}"`).replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');

const data = await (await fetch("actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("formInput", () => "");

/** A Foundry window around a sheet (the frame is the mockup's: Foundry's own CSS is not on this page; the system's rules for its header are). */
const win = (title, w, h, cls, inner) => `<div class="mk-win" style="width:${w}px;height:${h}px"><div class="application sheet twod12 twod12-actor themed theme-${theme} ${cls}" style="width:${w}px;height:${h}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div>`;

/** The current sheet: the system's template on the model, its open rows' cards drawn by the system's own card. */
async function currentSheet(a, pc, extra = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;   // an inert document: nothing loads before the paths are set
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, ...extra }));
  const tab = extra.tab ?? "actions";
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === tab);
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === tab);
  for (const row of host.querySelectorAll(".ar.open")) {
    const it = a.items.get(row.dataset.itemId);
    if (it) row.querySelector(".ar-card").innerHTML = await AC.buildActionCard(it, { actor: a, use: true });
  }
  return icons(art(host.innerHTML));
}

const LEAD = {
  pc: "Sylwen, level 1, in combat (round 2, 3 of 4 AP, one Strike made, Escalation 2), her bow in one hand and her Dagger drawn in the other; Snap Shot (a Reaction, once a turn) is open. Left: the sheet as the system draws it today. Right: the small sheet, a printed stat block: the plate, the stats as ruled lines, the Hands one above the other with no word (E3), each Action as its bar (cost, name, Distance · Vs., Frequency) and, open, the short card under it (E2).",
  npc: "The Orc Warrior in combat (round 2), 5 Vigor damage, with two example damage lines (Resist 2 Blunt, Weak 2 Fire); Avenge Kin (a Reaction) is open. The same small sheet as the PC's, without what an NPC doesn't have (Rally, Wounds, Hands, the Signature Modifier). On the dark sheet the damage type's word takes its bright color (E6: today the cleaver's Slash is drawn in the parchment's ink).",
  onepage: "The Ogre Chieftain (Elite) in combat, Escalation 3, 18 damage, Resist 2 Blunt and one example condition (Hindered). Left: today's sheet, its Main tab. Middle and right: the long page at its size, from the top and scrolled to its end: no tabs; the stat block as it is drawn today (statblock.mjs), then Effects, Notes, GM notes and Build down the page. Blunt is readable on the dark page (E6)."
};
const link = (k, v, t) => { const u = new URLSearchParams(location.search); u.set(k, v); if (!v) u.delete(k); return `<a href="?${u}" class="${(q.get(k) ?? (k === "theme" ? "dark" : "")) === v ? "on" : ""}">${t}</a>`; };
document.getElementById("nav").innerHTML = `<span>Theme:</span>${link("theme", "dark", "Dark")}${link("theme", "light", "Light")}<span>&nbsp;Sheet:</span>${link("sheet", "", "All three")}${link("sheet", "pc", "PC")}${link("sheet", "npc", "Full NPC")}${link("sheet", "onepage", "One-page NPC")}`;
const out = document.getElementById("page");
const S = {};
S.pc = async () => {
  const a = makeActor(data.sylwen, { system: { escalation: 2, damage: { bodyLethal: 6, mindNonlethal: 3 } }, items: { Dagger: { wielded: true, hand: "off" }, "Hunting Bow": { hand: "main" } } });
  const pc = sheetModel(a, { inCombat: true, round: 2, ap: 3, strikes: 1, open: ["Snap Shot"], hooks: [], dl: DL, cd: CD });
  const prop = icons(art(await P.smallSheet(a, pc)));
  // the Hands' other states (E3), with the same tiles: the bow alone (the compendium's Sylwen) and Aveline's two-handed Longsword
  const tiles = (d, o) => { const x = makeActor(d, o); return sheetModel(x, { inCombat: true, dl: DL, cd: CD }).hands.tiles; };
  const hand = (t, list) => `<div><p>${t}</p><div class="mk-hands">${list.map(x => `<button type="button" class="mk-hand${x.free ? " free" : ""}"><span>${esc(x.name)}</span><b>${x.grip}</b></button>`).join("")}</div></div>`;
  const hands = `<div class="mk-inset">${hand("A weapon and a free hand", tiles(data.sylwen))}${hand("A two-handed weapon (one tile, as today)", tiles(data.aveline))}</div>`;
  const full = win("", 470, 0, "mk-flat", `<div class="twod12 sheet pcs"><div class="ar ps-row open"><div class="ar-card">${await AC.buildActionCard(a.items.find(i => i.name === "Snap Shot"), { actor: a, use: true })}</div></div></div>`);
  return `<section class="mk-pair"><h2>The PC sheet</h2><p class="mk-lead">${LEAD.pc}</p><div class="mk-cols"><div class="mk-col"><h3>Today: 900 &times; 1100</h3>${win(a.name, 900, 1100, "", await currentSheet(a, pc))}</div><div class="mk-col"><h3><b>Proposed: 540 &times; 840</b></h3>${win(a.name, 540, 840, "mk-e6", prop)}${hands}</div></div>${icons(art(await P.shortCompare(a, pc, "Snap Shot", art(full), h => win("", 470, 0, "mk-flat mk-e6", h))))}</section>`;
};
S.npc = async () => {
  const a = makeActor(data.orc, { system: { damage: { bodyLethal: 5 }, dmgMods: "Resist 2 Blunt, Weak 2 Fire" } });
  const pc = sheetModel(a, { inCombat: true, round: 2, ap: 4, open: ["Avenge Kin"], dl: DL, cd: CD });
  const prop = icons(art(await P.smallSheet(a, pc)));
  return `<section class="mk-pair"><h2>The full NPC sheet</h2><p class="mk-lead">${LEAD.npc}</p><div class="mk-cols"><div class="mk-col"><h3>Today: 900 &times; 1100</h3>${win(a.name, 900, 1100, "", await currentSheet(a, pc))}</div><div class="mk-col"><h3><b>Proposed: 540 &times; 760</b></h3>${win(a.name, 540, 760, "mk-e6", prop)}</div></div></section>`;
};
S.onepage = async () => {
  const a = makeActor(data.ogre, { system: { escalation: 3, damage: { bodyLethal: 14, mindLethal: 4 }, dmgMods: "Resist 2 Blunt" } });
  const pc = sheetModel(a, { inCombat: true, round: 3, ap: 4, dl: DL, cd: CD });
  // example state: one condition on it, and notes (the compendium's Ogre has none)
  pc.effects.conditions = [{ name: "Hindered", text: "Its Speed is halved, rounded down.", pill: "End of its turn" }];
  const notes = "<p><b>Appearance.</b> Twice a man's height, in a coat of stitched hides, a club cut from one tree.</p>";
  const gmNotes = "<p>Uses Ground Slam as soon as three PCs stand within 2 squares. Flees at 20 HP if no ally is left standing.</p>";
  const m = await SB.statBlockModel(a, pc);
  const pc1 = { ...pc, statblock: true, tabs: [{ k: "main", l: "Main", n: 0 }, { k: "builder", l: "Build", n: 0 }, { k: "effects", l: "Effects", n: 1 }, { k: "notes", l: "Notes", n: 0 }] };
  const now = await currentSheet(a, pc1, { tab: "main", statblockHtml: SB.statBlockHtml(m), statblockPlate: SB.sbPlateHtml(m) });
  const long = icons(art(P.longPage(m, pc, { notes, gmNotes })));
  const cls = `twod12-sbsheet sb-rk-${m.rankKey}`;
  return `<section class="mk-pair"><h2>The one-page NPC sheet</h2><p class="mk-lead">${LEAD.onepage}</p><div class="mk-cols"><div class="mk-col"><h3>Today: 480 &times; 820</h3>${win(a.name, 480, 820, cls, now)}</div><div class="mk-col"><h3><b>Proposed: 480 &times; 1000</b></h3>${win(a.name, 480, 1000, `${cls} mk-e6`, long)}</div><div class="mk-col"><h3>Proposed, scrolled to its end</h3>${win(a.name, 480, 1000, `${cls} mk-e6 mk-end`, long)}</div></div></section>`;
};
for (const k of ["pc", "npc", "onepage"]) if ((!only || only === k) && S[k]) { try { out.insertAdjacentHTML("beforeend", await S[k]()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(k)}: ${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
for (const el of document.querySelectorAll(".mk-end .mk-scroll")) el.scrollTop = el.scrollHeight;
document.body.dataset.ready = "1";
