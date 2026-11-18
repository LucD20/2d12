// v0.0.441 (pack SHEETS-HUD): the sheets AS BUILT, for checking the build against the approved mockup (index.html): the system's own template
// (templates/actor-sheet-pc.hbs) and CSS on the mockup's model (model.mjs), with the fields the build added (sheetmodel.mjs actionBar, the tiles'
// Vs., the plate's words) laid on as pcsheet.mjs pcModel lays them. The open cards are the short card (actioncard.mjs buildActionCard({ short })).
//   built.html?theme=dark|light&sheet=pc|npc&tab=actions|effects|items|build|mastery|upkeep|notes|builder|loot
import { makeActor, sheetModel, esc } from "./model.mjs";
const q = new URLSearchParams(location.search);
const theme = q.get("theme") === "light" ? "light" : "dark", only = q.get("sheet") ?? "", tab = q.get("tab") ?? "actions";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const AC = await import("../../twod12/module/actioncard.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const CFG = await import("../../twod12/module/config.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const data = await (await fetch("actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");

/** The build's added fields (pcsheet.mjs pcModel), laid on the mockup's model. */
function built(a, pc, st) {
  const ap = st.ap ?? 4, rap = st.rap ?? 1;
  for (const sec of pc.sections) for (const r of sec.rows) {
    const it = r.item.system;
    const hb = r.handBtns;
    r.bar = { ...SM.actionBar({ aps: it.versions.map(v => v.ap), reaction: !!it.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: pc.strip.inCombat, ap, rap }), weaponId: hb?.length === 1 ? hb[0].id : "", hands: hb?.length >= 2 ? hb : null };
  }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; });
  pc.mods.forEach(m => { m.tile = pc.npc ? `${m.label} Mod.` : m.label; });
  pc.strip.esc.pips = Array.from({ length: 6 }, (_, k) => k < (Number(a.system.escalation) || 0));
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.head.round = `Round ${st.round ?? 1}`;
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true });
  return pc;
}
const win = (title, w, h, inner) => `<div class="mk-win" style="width:${w}px;height:${h}px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:${w}px;height:${h}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div>`;
async function sheet(a, pc) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === tab);
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === tab);
  for (const row of host.querySelectorAll(".ar.open")) { const it = a.items.get(row.dataset.itemId); if (it) row.querySelector(".ar-card").innerHTML = await AC.buildActionCard(it, { actor: a, short: true }); }
  return icons(art(host.innerHTML));
}
const S = {
  pc: async () => {
    const a = makeActor(data.sylwen, { system: { escalation: 2, damage: { bodyLethal: 6, mindNonlethal: 3 } }, items: { Dagger: { wielded: true, hand: "off" }, "Hunting Bow": { hand: "main" } } });
    const st = { inCombat: true, round: 2, ap: 3, strikes: 1, open: ["Snap Shot"], hooks: [], dl: DL, cd: CD };
    return win(a.name, 540, 840, await sheet(a, built(a, sheetModel(a, st), st)));
  },
  npc: async () => {
    const a = makeActor(data.orc, { system: { damage: { bodyLethal: 5 }, dmgMods: "Resist 2 Blunt, Weak 2 Fire" } });
    const st = { inCombat: true, round: 2, ap: 4, open: ["Avenge Kin"], dl: DL, cd: CD };
    return win(a.name, 540, 760, await sheet(a, built(a, sheetModel(a, st), st)));
  }
};
const out = document.getElementById("page");
out.style.display = "flex"; out.style.gap = "28px"; out.style.alignItems = "flex-start";
for (const k of ["pc", "npc"]) if (!only || only === k) { try { out.insertAdjacentHTML("beforeend", await S[k]()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(k)}: ${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
document.body.dataset.ready = "1";
