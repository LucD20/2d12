// v0.0.441 (pack SHEETS-HUD): the HUD AS BUILT, for checking the build against the approved mockup (index.html): the system's own
// hudview.mjs tokenBarHtml and CSS on the mockup's states (model.mjs), with the model hud.mjs barModel now gives (h3, basicGroups, conds, right).
//   built.html?theme=dark|light&state=<id>
import "../sheets/stubs.mjs";
import { hudState, todayModel } from "./model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark", only = q.get("state") ?? "";
document.body.classList.add(`theme-${theme}`);
const HV = await import("../../twod12/module/hudview.mjs");
const PB = await import("../../twod12/module/pickbar.mjs");
const { TWOD12 } = await import("../../twod12/module/config.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}"${attrs}><svg viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const data = await (await fetch("actors.json")).json();
const hotbar = () => `<div id="hotbar"><ol id="action-bar">${Array.from({ length: 10 }, (_, k) => `<li class="slot"><span class="key">${(k + 1) % 10}</span></li>`).join("")}</ol></div>`;
const SYL = { short: "Sylwen", over: { system: { escalation: 2, damage: { bodyLethal: 6, mindNonlethal: 3 } } } };
const DUR = { short: "Durgan", over: { system: { escalation: 2, damage: { bodyLethal: 9 } } } };
const STATES = [
  { id: "a-sylwen", who: "sylwen", S: { ...SYL, ap: 3, rap: 1, strikes: 1, esc: 2, guard: 0, tab: "act", used: ["Wounding Shot"] } },
  { id: "b-sylwen", who: "sylwen", S: { ...SYL, ap: 4, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "basic", prone: true, speed: 3, conds: [{ id: "c1", name: "Prone", dur: "" }, { id: "c2", name: "Hindered", dur: "EoT" }] } },
  { id: "b-many", who: "sylwen", S: { ...SYL, ap: 4, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", conds: [{ id: "c1", name: "Prone", dur: "" }, { id: "c2", name: "Hindered", dur: "EoT" }, { id: "c3", name: "Dazed", dur: "" }, { id: "c4", name: "Lingering", dur: "2" }] } },
  { id: "c-kaela", who: "kaela", S: { short: "Kaela", over: { system: { escalation: 2 } }, ap: 2, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", ask: '<div class="twod12-linebar twod12-setupbar in-hud in-side"><i class="fa-solid fa-person-running lb-ic"></i><span class="lb-text"><b>Strafe</b>: You Advance. Move your token, then Continue.</span><button type="button" class="lb-go"><i class="fa-solid fa-dice"></i> Continue: the roll</button><button type="button" class="lb-give">Cancel the Action</button></div>' } },
  { id: "d-sylwen", who: "sylwen", S: { ...SYL, ap: 1, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", used: ["Wounding Shot", "Quick Shots"], rx: { name: "Snap Shot", cost: "1R", lead: "Goblin Sneak would enter a square adjacent to Sylwen.", msg: "m", row: 0 } } },
  { id: "d-durgan", who: "durgan", S: { ...DUR, ap: 0, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", used: ["Lay On Hands"], askPick: { icon: "fa-shield-halved", text: "<b>Judge</b> (Durgan): Orc Warrior, Judged by you, damages Sylwen. Reduce that damage by 1 (once each round)?", options: [{ id: "no", label: "Not now" }, { id: "yes", label: "Reduce by 1" }] } } }
];
function built(h) {
  const m = todayModel(h), S = h.S;
  const words = { AD: ["ad", "AD"], WD: ["wd", "WD"], Spd: ["speed", "Speed"], Wpn: ["weapon", "Weapon"], Pow: ["power", "Power"] };
  m.defs = m.defs.map(d => (d.gap ? d : d.hud === "attr" ? { ...d, word: h.attrs.find(x => x.short === d.label)?.label } : { ...d, key: words[d.label]?.[0], word: words[d.label]?.[1] }));
  m.h3 = true; m.tab = S.tab ?? "act"; m.conds = S.conds ?? [];
  m.cols = m.tab === "basic" ? [] : m.cols;
  const strike = new Set(h.list.filter(x => x.strike).map(x => x.name));
  const bl = h.basic.map(l => ({ ...l, strike: strike.has(l.name) }));
  m.basicGroups = TWOD12.basicGroups.map(g => ({ label: g.label, lines: g.names.map(n => bl.find(l => l.name === n)).filter(Boolean) })).filter(g => g.lines.length);
  const prone = S.prone ? { lead: "Prone", text: "Your only Move Actions: Stand, Crawl, Break Free.", btns: [{ label: "Stand · 1 AP" }, { label: "Crawl 1 · 1 AP" }, { label: "Crawl 3 · 2 AP" }] } : null;
  m.right = { rx: S.rx ?? null, grants: [], cancels: [], prone, tiles: h.tiles };
  return m;
}
const out = document.getElementById("page");
for (const st of STATES) {
  if (only && only !== st.id) continue;
  try {
    const h = hudState(data[st.who], st.S);
    let bar = HV.tokenBarHtml(built(h));
    if (st.S.ask) bar = bar.replace('<div class="hb-ask"></div>', `<div class="hb-ask">${st.S.ask}</div>`);
    if (st.S.askPick) bar = bar.replace('<div class="hb-ask"></div>', `<div class="hb-ask"><div class="twod12-linebar twod12-pickbar in-hud in-side">${PB.pickBarHtml(st.S.askPick)}</div></div>`);
    bar = bar.replace('<div class="h3-hot"></div>', `<div class="h3-hot">${hotbar()}</div>`);
    out.insertAdjacentHTML("beforeend", `<section class="mk-state"><h3>${esc(st.id)}</h3><div class="mk-scene"><div class="twod12-hud is-bar with-hot hot-in-bar"><div class="hud-players"></div><div class="hud-main">${icons(bar)}</div><div class="hud-ask"></div><div class="hud-hot"></div></div></div></section>`);
  } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(st.id)}: ${esc(e.stack ?? e)}</pre>`); }
}
await document.fonts.ready;
document.body.dataset.ready = "1";
