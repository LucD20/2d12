// THE HUD, ROUND 3 (playtest 5, group D: D1, D2, D3, D4, D7): the mockup. For each state, today's HUD (the system's own hudview.mjs
// tokenBarHtml and its CSS, on the compendium's character) above the proposal. ?theme=dark|light
import "../sheets/stubs.mjs";
import { hudState, todayModel } from "./model.mjs";
import { proposalHtml, condsHtml } from "./proposal.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark", only = q.get("state") ?? "";
document.body.classList.add(`theme-${theme}`);
const HV = await import("../../twod12/module/hudview.mjs");
const PB = await import("../../twod12/module/pickbar.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Font Awesome is Foundry's: the mockups' drawn set stands in
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}"${attrs}><svg viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const data = await (await fetch("actors.json")).json();

/* Foundry's macro bar (its ten slots): a stand-in, the same in today's HUD and in the proposal. */
const MACROS = { 1: "dice-d20", 2: "campground", 3: "eye", 5: "music" };
const hotbar = () => icons(`<div id="hotbar"><ol id="action-bar">${Array.from({ length: 10 }, (_, k) => `<li class="slot">${MACROS[k + 1] ? `<i class="fa-solid fa-${MACROS[k + 1]}"></i>` : ""}<span class="key">${(k + 1) % 10}</span></li>`).join("")}</ol></div>`);

/* ---- the states */
const SYL = { short: "Sylwen", over: { system: { escalation: 2, damage: { bodyLethal: 6, mindNonlethal: 3 } } } };
const DUR = { short: "Durgan", over: { system: { escalation: 2, damage: { bodyLethal: 9 } } } };
const STATES = [
  { id: "a-sylwen", who: "sylwen", title: "(a) Sylwen's turn, nothing waiting", note: "Round 2: 3 of 4 AP, one Strike made (Wounding Shot, used), Escalation 2, 6 Vigor damage and 3 Nonlethal Resolve damage.",
    S: { ...SYL, ap: 3, rap: 1, strikes: 1, esc: 2, guard: 0, tab: "act", used: ["Wounding Shot"] } },
  { id: "a-durgan", who: "durgan", title: "(a) Durgan's turn, nothing waiting", note: "Round 2: 4 AP, Guard 2 (from the AP he kept), 9 Vigor damage.",
    S: { ...DUR, ap: 4, rap: 1, strikes: 0, esc: 2, guard: 2, tab: "act", used: [] } },
  { id: "b-sylwen", who: "sylwen", title: "(b) Sylwen, Prone and Hindered, the Basic tab open (D1, D4)", note: "The start of her turn: 4 AP, Prone, and Hindered until the end of her turn (her Speed 6 halved to 3). Prone: no Advance, Evade or Charge; Stand and Crawl can be used.",
    S: { ...SYL, ap: 4, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "basic", prone: true, speed: 3, conds: [{ id: "c1", name: "Prone", dur: "" }, { id: "c2", name: "Hindered", dur: "EoT" }],
      sit: [{ lead: "Prone", text: "Your only Move Actions: Stand, Crawl, Break Free.", btns: [{ label: "Stand · 1 AP" }, { label: "Crawl 1 · 1 AP" }, { label: "Crawl 3 · 2 AP" }] }] } },
  { id: "b-conditions", who: "sylwen", only: "extra", title: "Decision 1: the conditions under AP and Escalation", note: "The row is always 19 px high, so a condition never changes the HUD's height (D4).",
    S: { ...SYL, ap: 4, rap: 1, strikes: 0, esc: 2, guard: 0, prone: true, speed: 3, conds: [{ id: "c1", name: "Prone", dur: "" }, { id: "c2", name: "Hindered", dur: "EoT" }] } },
  { id: "c-kaela", who: "kaela", title: "(c) Strafe used: its Setup's Advance is waiting (D7)", note: "Kaela (the compendium's Archer with Strafe; Sylwen's Hallmark Action is Quick Shots) clicked Strafe's 2 AP: the Setup gives an Advance before the roll. She has moved 2 of her 6 squares.",
    S: { short: "Kaela", over: { system: { escalation: 2 } }, ap: 2, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act",
      sit: [{ lead: "Strafe", tag: "Setup", text: "You Advance: move your token. <b>4</b> of 6 squares left.", btns: [{ label: "Continue: the roll" }, { label: "Cancel the Action", q: true }] }],
      today: { float: icons(`<div class="twod12-linebar twod12-setupbar"><i class="fa-solid fa-person-running lb-ic"></i><span class="lb-text"><b>Strafe</b>: You Advance. Move your token, then Continue.</span><button type="button" class="lb-go"><i class="fa-solid fa-dice"></i> Continue</button><button type="button" class="lb-give">Cancel</button></div>`) } } },
  { id: "d-sylwen", who: "sylwen", title: "(d) A trigger: Snap Shot, on the Goblin Sneak's turn", note: "The Goblin Sneak moves toward Sylwen. She kept 1 AP and has her Reaction AP. Today the HUD jumps to the Reactions tab and the alert takes the side panel; proposed: the HUD stays on the tab she had open, the Reaction is in the Situational section.",
    S: { ...SYL, ap: 1, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", used: ["Wounding Shot", "Quick Shots"], rx: { name: "Snap Shot", cost: "1R", lead: "Goblin Sneak would enter a square adjacent to Sylwen." },
      sit: [{ lead: "Snap Shot", tag: "Reaction", text: "The Goblin Sneak would enter a square adjacent to you.", btns: [{ label: "Use · 1R" }, { label: "Pass", q: true }] }] } },
  { id: "d-durgan", who: "durgan", title: "(d) Judge's question, on the Orc Warrior's turn", note: "The Orc Warrior, Judged by Durgan, hits Sylwen 3 squares from him. Today the question is the pick bar squeezed into the side panel; proposed: the same question in the Situational section, in the HUD's own type.",
    S: { ...DUR, ap: 0, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", used: ["Lay On Hands"],
      sit: [{ lead: "Judge", tag: "once each round", text: "The Orc Warrior, Judged by you, damages Sylwen. Reduce that damage by 1?", btns: [{ label: "Reduce by 1" }, { label: "Not now", q: true }] }],
      today: { ask: { icon: "fa-shield-halved", text: "<b>Judge</b> (Durgan): Orc Warrior, Judged by you, damages Sylwen. Reduce that damage by 1 (once each round)?", options: [{ id: "no", label: "Not now" }, { id: "yes", label: "Reduce by 1" }] } } } }
];

/** Today's HUD: hudview.mjs tokenBarHtml in the frame hud.mjs makes (the hotbar at its right end; the pick bar's question in the side panel). */
function todayHtml(h) {
  const t = h.S.today ?? {};
  let bar = HV.tokenBarHtml(todayModel(h));
  if (t.ask) bar = bar.replace('<div class="hb-ask"></div>', `<div class="hb-ask"><div class="twod12-linebar twod12-pickbar in-hud in-side">${icons(PB.pickBarHtml(t.ask))}</div></div>`);
  return `${t.float ?? ""}<div class="twod12-hud is-bar with-hot${t.ask ? " asking-side" : ""}"><div class="hud-players"></div><div class="hud-main">${bar}</div><div class="hud-ask"></div><div class="hud-hot">${hotbar()}</div></div>`;
}
const scene = (label, inner, cls = "") => `<div class="mk-row"><h3>${label}</h3><div class="mk-scene ${cls}">${inner}</div></div>`;
const link = (k, v, t) => { const u = new URLSearchParams(location.search); u.set(k, v); if (!v) u.delete(k); return `<a href="?${u}" class="${(q.get(k) ?? (k === "theme" ? "dark" : "")) === v ? "on" : ""}">${t}</a>`; };
document.getElementById("nav").innerHTML = `<span>Theme:</span>${link("theme", "dark", "Dark")}${link("theme", "light", "Light")}<span>&nbsp;State:</span>${link("state", "", "All")}${STATES.map(s => link("state", s.id, s.id)).join("")}`;
const out = document.getElementById("page");
out.insertAdjacentHTML("beforeend", `<header class="mk-top"><h1>The HUD, round 3</h1><p>Playtest 5, group D. Each state: the HUD as the system draws it today, then the proposal, at the same width (1500 px) and the same height (150 px). What changes: the identity column is rebuilt (D2), a condition is an icon under AP and Escalation (D4), the Basic tab is the sheet's four groups (D1), and the right column is the Situational section over the Hands over the macro bar (D3, D7).</p></header>`);
for (const st of STATES) {
  if (only && only !== st.id) continue;
  try {
    const h = hudState(data[st.who], st.S);
    if (st.only === "extra") {
      const many = [...st.S.conds, { id: "c3", name: "Dazed", dur: "" }, { id: "c4", name: "Lingering", dur: "2" }, { id: "c5", name: "Immobilized", dur: "EoT" }];
      const col = (t, conds, o) => `<div><p>${t}</p><div class="twod12-hud is-bar h3">${proposalHtml({ ...h, S: { ...h.S, conds } }, { conds: o }).match(/<div class="h3-id">[\s\S]*?<\/div><div class="hb-mid">/)[0].replace(/<div class="hb-mid">$/, "")}</div></div>`;
      out.insertAdjacentHTML("beforeend", `<section class="mk-extra" id="${st.id}"><h2>${esc(st.title)}</h2><p class="mk-lead">${esc(st.note)}</p><div class="mk-inset">${col("<b>A (drawn above, recommended):</b> the icon and the condition's word while up to three fit.", st.S.conds, {})}${col("A with more than three: the icons alone (a duration keeps its small text); a click opens the Effect.", many, {})}${col("<b>B:</b> always the icons alone, as D4 says it.", st.S.conds, { words: false })}</div></section>`);
      continue;
    }
    out.insertAdjacentHTML("beforeend", `<section class="mk-state" id="${st.id}"><h2>${esc(st.title)}</h2><p class="mk-lead">${esc(st.note)}</p>${scene("Today", todayHtml(h), "today")}${scene("<b>Proposed</b>", proposalHtml(h, { hotbar: hotbar() }))}${st.extra ? st.extra(h) : ""}</section>`);
  } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(st.id)}: ${esc(e.stack ?? e)}</pre>`); }
}
await document.fonts.ready;
document.body.dataset.ready = "1";
