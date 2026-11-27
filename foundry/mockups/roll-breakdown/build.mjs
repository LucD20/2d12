// Builds index.html (the three designs) and today.html (today's panel, drawn by the system's own function with the system's own CSS).
// Run: node build.mjs        A mockup: nothing here is in the system. The cases are data (CASES); the counting is the system's (calc.mjs).
// Then, from foundry/twod12: node ../mockups/roll-breakdown/check.mjs (it measures, writes measured.json and the pictures), and build again
// so the page's table of heights has the numbers.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bbCount, bbResolve, bbKey, BB_NAMES, BB_LIMIT } from "../../twod12/module/calc.mjs";
import { breakdownHtml } from "../../twod12/module/chatcards.mjs";
const HERE = dirname(fileURLToPath(import.meta.url));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sg = n => (n < 0 ? `−${-n}` : `+${n}`);
const pl = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

/* ------------------------------------------------------------------ the cases (data) */
// A source: { name, boons | banes, bb: "field" | "pressure" | "support" | "" } or { name, fav: true } / { name, doom: true } (counts as 5, once).
const CASES = [
  { id: "1", title: "The picture's roll", who: "Sylwen's Basic Attack on a Goblin Archer",
    dice: [[3], [11]], mod: { v: 2, label: "Weapon" }, dcLabel: "AD", dc: 14,
    sources: [{ name: "Shifting Aim", boons: 1, bb: "field" }, { name: "Vulnerable 1", boons: 1 }, { name: "Low cover", banes: 1, bb: "field" }, { name: "Engaged with Aveline", banes: 1, bb: "field" }] },
  { id: "2a", title: "A plain roll", who: "No Boon, no Bane",
    dice: [[9], [10]], mod: { v: 3, label: "Weapon" }, dcLabel: "AD", dc: 15, sources: [] },
  { id: "2b", title: "A plain roll, a die explodes", who: "The 12 counts as 11 and is rolled again (a 6)",
    dice: [[12, 6], [4]], mod: { v: 3, label: "Weapon" }, dcLabel: "AD", dc: 15, sources: [] },
  { id: "3a", title: "Favored", who: "Hidden to the target (Favored: 5 Boons), 1 more Boon, 1 Bane: 5 left",
    dice: [[4], [9], [10]], mod: { v: 2, label: "Weapon" }, dcLabel: "AD", dc: 14,
    sources: [{ name: "Hidden to the target", fav: true }, { name: "Flanking with Durgan", boons: 1, bb: "field" }, { name: "Low cover", banes: 1, bb: "field" }] },
  { id: "3b", title: "Doomed", who: "A Ranged Action while Engaged (Doomed: 5 Banes), 1 more Bane, 1 Boon: 5 left",
    dice: [[8], [3], [11]], mod: { v: 2, label: "Weapon" }, dcLabel: "AD", dc: 14,
    sources: [{ name: "Shifting Aim", boons: 1, bb: "field" }, { name: "Ranged while Engaged", doom: true }, { name: "Far range", banes: 1 }] },
  { id: "4a", title: "Doubles raise the Tier", who: "Tier 2 by the total, Tier 3 by the Doubles (not a Critical)",
    dice: [[6], [6]], mod: { v: 2, label: "Weapon" }, dcLabel: "AD", dc: 14, sources: [{ name: "Flanking with Durgan", boons: 1, bb: "field" }] },
  { id: "4b", title: "A Critical", who: "Tier 3 by the total, and Doubles",
    dice: [[10], [10]], mod: { v: 3, label: "Weapon" }, dcLabel: "AD", dc: 15, sources: [] },
  { id: "5", title: "Many entries", who: "5 Boons (a third Field does not count), 3 Banes; they cancel to 1 Boon",
    dice: [[5], [8]], mod: { v: 2, label: "Weapon" }, dcLabel: "AD", dc: 14,
    sources: [{ name: "Flanking with Durgan", boons: 1, bb: "field" }, { name: "Prone target", boons: 1, bb: "field" }, { name: "Shifting Aim", boons: 1, bb: "field" }, { name: "War cry", boons: 1, bb: "support" }, { name: "Vulnerable 1", boons: 1 },
      { name: "Engaged with Ogre Chieftain", banes: 1, bb: "field" }, { name: "Low cover", banes: 1, bb: "field" }, { name: "Far range", banes: 1 }] },
  { id: "6", title: "A Save", who: "Goblin Archer's Instinct Save against Durgan's Rebuke. Tier 1 is the worst for the Goblin", save: true, roller: "Goblin Archer",
    dice: [[7], [5]], mod: { v: 1, label: "Instinct" }, dcLabel: "DC", dc: 14,
    sources: [{ name: "Durgan's Banes, turned around", boons: 2 }, { name: "Low cover", boons: 1, bb: "field" }, { name: "Vulnerable 1", banes: 1 }] },
  { id: "7", title: "One roll, three targets", who: "Sylwen's Volley: the dice are shared, each target has its own Boons, Banes, Defense and Tier",
    dice: [[6], [9]], mod: { v: 2, label: "Weapon" },
    targets: [
      { name: "Goblin Sneak", dcLabel: "AD", dc: 11, sources: [{ name: "Prone target", boons: 1, bb: "field" }] },
      { name: "Orc Warrior", dcLabel: "AD", dc: 14, sources: [] },
      { name: "Ogre Chieftain", dcLabel: "AD", dc: 16, sources: [{ name: "Low cover", banes: 1, bb: "field" }, { name: "Engaged with Durgan", banes: 1, bb: "field" }] },
    ] },
];

/* ------------------------------------------------------------------ the rules (Chapter 1; the counting is calc.mjs) */
const dieTot = f => f.reduce((s, x) => s + (x === 12 ? 11 : x), 0);
function resolve(c, shared = null) {
  const src = c.sources ?? [];
  const cnt = bbCount(src.filter(s => !s.fav && !s.doom));
  const fav = src.some(s => s.fav), doom = src.some(s => s.doom);
  const res = bbResolve(cnt.boons, cnt.banes, fav, doom);
  const used = { boon: {}, bane: {} }; let favSeen = false, doomSeen = false;
  const entries = src.map(s => {
    const side = s.fav || s.boons ? "boon" : "bane", k = bbKey(s.bb);
    let n = s.fav || s.doom ? 5 : Number(s.boons || s.banes) || 0, counted = n;
    if (s.fav) { counted = favSeen ? 0 : 5; favSeen = true; }
    if (s.doom) { counted = doomSeen ? 0 : 5; doomSeen = true; }
    if (k) { const before = used[side][k] ?? 0; counted = Math.max(0, Math.min(n, BB_LIMIT - before)); used[side][k] = before + n; }
    return { side, name: s.name, n, counted, kind: k ? BB_NAMES[k] : "", special: s.fav ? "Favored" : s.doom ? "Doomed" : "" };
  });
  const B = entries.filter(e => e.side === "boon").reduce((s, e) => s + e.counted, 0), N = entries.filter(e => e.side === "bane").reduce((s, e) => s + e.counted, 0);
  if (B - N !== res.net) throw new Error(`case ${c.id}: the entries (${B} - ${N}) and calc.mjs (${res.net}) disagree`);
  const dice = (shared ?? c).dice, tots = dice.map(dieTot);
  if (res.state && dice.length < 3) throw new Error(`case ${c.id}: ${res.state} needs three dice`);
  let kept = [0, 1], dropped = -1;
  if (res.state) { const order = [0, 1, 2].sort((a, b) => (res.state === "favored" ? tots[b] - tots[a] : tots[a] - tots[b])); kept = order.slice(0, 2).sort(); dropped = order[2]; }
  const first = dice.map(f => f[0]);
  const pairs = res.state === "favored" ? [[0, 1], [0, 2], [1, 2]] : res.state === "doomed" ? [] : [[0, 1]];
  const dbl = pairs.find(([a, b]) => first[a] === first[b]) ?? null;
  const triple = res.state === "favored" && first[0] === first[1] && first[1] === first[2];
  const diceSum = kept.reduce((s, i) => s + tots[i], 0), mod = (shared ?? c).mod;
  const total = diceSum + mod.v + res.add;
  const base = total < c.dc ? 1 : total < c.dc + 7 ? 2 : 3;
  const far = total >= c.dc + 20;
  const crit = !c.save && (triple || far || (!!dbl && base === 3));
  const tier = dbl && base < 3 ? base + 1 : base;
  return { c, entries, B, N, net: res.net, add: res.add, state: res.state, dice, tots, kept, dropped, dbl, triple, diceSum, mod, total, base, tier, crit, critWhy: triple ? "three of a kind" : dbl && base === 3 ? "Doubles" : far ? "20 over" : "" };
}

/* ------------------------------------------------------------------ the shared pieces */
const PENT = "14,1.5 26,10.2 21.4,24.5 6.6,24.5 2,10.2";
const die = (f, cls = "") => `<span class="d${cls ? ` ${cls}` : ""}"><svg viewBox="0 0 28 28" aria-hidden="true"><polygon points="${PENT}"/><text x="14" y="14.5" text-anchor="middle" dominant-baseline="central">${f}</text></svg><span class="sr">${f}</span></span>`;
/** One d12 as rolled: its mark; an explosion is the 12 (in the accent), its reroll, and "11 + 6" beside them. */
const dieGroup = (faces, cls = "") => `<span class="dg">${faces.map(f => die(f, `${cls}${f === 12 ? " boom" : ""}`)).join("")}${faces.length > 1 ? `<span class="q">${faces.map(f => (f === 12 ? 11 : f)).join(" + ")}</span>` : ""}</span>`;
/** The dice of a roll. plus: a "+" between the ones kept (the sentence); the one dropped comes last, quiet, with the word. */
function diceHtml(r, { plus = false } = {}) {
  const k = r.kept.map(i => dieGroup(r.dice[i], r.dbl && r.dbl.includes(i) ? "dbl" : "")).join(plus ? '<span class="op">+</span>' : "");
  const d = r.dropped >= 0 ? `<span class="drop">${dieGroup(r.dice[r.dropped], `off${r.dbl && r.dbl.includes(r.dropped) ? " dbl" : ""}`)}</span>` : "";
  return `<span class="dice">${k}${d}</span>`;
}
const stateNote = r => (r.state ? `3d12, the ${r.dice[r.dropped][0]} is dropped` : "");
const tierTag = (r) => `<span class="tier ${r.crit ? "crit" : `t${r.tier}`}">${r.crit ? "Critical" : `${r.c.save ? "Their " : ""}Tier ${r.tier}`}</span>`;
/** "Tier 2, Doubles:" before the tag when Doubles or a Critical changed what the total alone gives. */
const tierWhy = r => (r.crit ? `Tier 3, ${r.critWhy}:` : r.tier > r.base ? `Tier ${r.base}, Doubles:` : "");
const against = r => `against <b>${esc(r.c.dcLabel)} ${r.c.dc}</b>`;
/** A name whose count (when it is not 1) is glued to its last word, so a long name can wrap but its number never leaves it. */
function nameHtml(e, { kind = true } = {}) {
  const words = esc(e.name).split(" "), last = words.pop();
  const tail = e.n > 1 && !e.special ? `<span class="g">${last} ×${e.n}</span>` : last;
  const nm = [...words, tail].join(" ");
  const off = e.counted === 0, part = !off && e.counted < e.n;
  const k = e.special ? `(${e.special}: counts as 5 ${e.side === "boon" ? "Boons" : "Banes"})`
    : off ? `(${e.kind}: ${BB_LIMIT} at most)` : part ? `(${e.kind}: ${e.counted} of ${e.n} counts)` : kind && e.kind ? `(${e.kind})` : "";
  return `${off ? `<s>${nm}</s>` : nm}${k ? ` <span class="k">${k}</span>` : ""}`;
}
/** How the Boons and the Banes became what is added: the cancelling, in words. */
function cancelText(r) {
  const b = pl(r.B, "Boon"), n = pl(r.N, "Bane"), left = Math.abs(r.net), w = r.net > 0 ? "Boon" : "Bane";
  if (r.state) return `${r.B && r.N ? `${b}, ${n}: ` : ""}${left} ${w}s left, so the roll is <b>${r.state === "favored" ? "Favored" : "Doomed"}</b> and nothing is added`;
  if (r.B && r.N) return r.net === 0 ? `${b} and ${n} cancel: nothing is added` : `${b}, ${n}: ${pl(left, w)} left`;
  return r.B ? b : n;
}
const endHtml = r => `<span class="end"><span class="t">${against(r)}</span><span class="t res">${tierWhy(r) ? `<span class="why">${tierWhy(r)}</span> ` : ""}${tierTag(r)}</span></span>`;
/** The same, short, for the line of the written sum. */
function cancelShort(r) {
  if (r.state) return `<b>${r.state === "favored" ? "Favored" : "Doomed"}</b>: ${Math.abs(r.net)} ${r.net > 0 ? "Boons" : "Banes"} left`;
  return r.B && r.N ? (r.net === 0 ? `${r.B} and ${r.N} cancel` : `${pl(r.B, "Boon")}, ${pl(r.N, "Bane")}`) : "";
}
const caret = open => `<span class="car" aria-hidden="true">${open ? "▾" : "▸"}</span>`;

/* ------------------------------------------------------------------ design A: the sentence */
function aTerms(r, { open, shared = false }) {
  const bb = !r.entries.length ? "" : `<button type="button" class="tog t" aria-expanded="${open}">${r.state ? `<span><b>${r.state === "favored" ? "Favored" : "Doomed"}</b></span>` : `${r.B ? `<span><b>+${r.B}</b> ${r.B === 1 ? "Boon" : "Boons"}</span>` : ""}${r.N ? `<span><b>−${r.N}</b> ${r.N === 1 ? "Bane" : "Banes"}</span>` : ""}`}${caret(open)}</button>`;
  const why = tierWhy(r);
  return `${shared ? "" : `<span class="t">${diceHtml(r, { plus: true })}</span>${stateNote(r) ? `<span class="t q">${stateNote(r)}</span>` : ""}<span class="t"><b>${sg(r.mod.v)}</b> ${esc(r.mod.label)}</span>`}${bb}<span class="t eq">= <b class="tot">${r.total}</b></span>${endHtml(r)}`;
}
function aNames(r, open) {
  if (!r.entries.length) return "";
  const side = (s, w) => { const es = r.entries.filter(e => e.side === s); return es.length ? `<p class="a-l"><b>${w}</b> ${es.map(e => `<span class="e">${nameHtml(e)}</span>`).join(", ")}.</p>` : ""; };
  return `<div class="names"${open ? "" : " hidden"}>${side("boon", "Boons")}${side("bane", "Banes")}${r.state || (r.B && r.N) ? `<p class="a-l q">${cancelText(r)}.</p>` : ""}</div>`;
}
function designA(c, { open = true } = {}) {
  if (c.targets) {
    const sh = resolve({ ...c, dc: 99, sources: [] });
    return `<div class="rb a"><p class="a-line"><span class="t">${diceHtml(sh, { plus: true })}</span><span class="t"><b>${sg(c.mod.v)}</b> ${esc(c.mod.label)}</span><span class="t eq">= <b class="tot">${sh.diceSum + c.mod.v}</b></span><span class="t q">for every target</span></p>`
      + c.targets.map(t => { const r = resolve({ ...t, id: c.id }, c); return `<div class="a-tg"><p class="a-line"><span class="t"><b>${esc(t.name)}</b></span><span class="t">${r.diceSum + r.mod.v}</span>${aTerms(r, { open, shared: true })}</p>${aNames(r, open)}</div>`; }).join("") + `</div>`;
  }
  const r = resolve(c);
  return `<div class="rb a">${c.save ? `<p class="lead">${esc(c.roller)} rolls</p>` : ""}<p class="a-line">${aTerms(r, { open })}</p>${aNames(r, open)}</div>`;
}

/* ------------------------------------------------------------------ design B: the ledger */
/** The sentence of the sum, with the Boons and Banes already as one number (the ledger above it explains that number). */
function sumLine(r, { shared = false } = {}) {
  const why = tierWhy(r);
  const bb = r.entries.length && !r.state && r.add ? `<span class="t"><b>${sg(r.add)}</b> ${r.add > 0 ? (r.add === 1 ? "Boon" : "Boons") : (r.add === -1 ? "Bane" : "Banes")}</span>` : "";
  return `<p class="a-line">${shared ? `<span class="t">${r.diceSum + r.mod.v}</span>` : `<span class="t">${diceHtml(r, { plus: true })}</span>${stateNote(r) ? `<span class="t q">${stateNote(r)}</span>` : ""}<span class="t"><b>${sg(r.mod.v)}</b> ${esc(r.mod.label)}</span>`}${bb}<span class="t eq">= <b class="tot">${r.total}</b></span>${endHtml(r)}</p>`;
}
function ledger(r) {
  if (!r.entries.length) return "";
  const kinds = ["Field", "Pressure", "Support", ""].filter(k => r.entries.some(e => e.kind === k));
  const cell = (s, k) => { const es = r.entries.filter(e => e.side === s && e.kind === k); return `<div class="b-c ${s}">${es.length ? `<span class="b-k">${k || "No name"}</span>${es.map(e => `<span class="e">${nameHtml(e, { kind: false }).replace(`(${e.kind}: ${BB_LIMIT} at most)`, `(${BB_LIMIT} at most)`)}</span>`).join("")}` : ""}</div>`; };
  const sides = ["boon", "bane"].filter(sd => r.entries.some(e => e.side === sd));
  return `<div class="b-led${sides.length === 1 ? " one" : ""}">${sides.map(sd => `<div class="b-c ${sd} b-h"><b>${sd === "boon" ? "Boons" : "Banes"}</b> <b class="num">${sd === "boon" ? r.B : r.N}</b></div>`).join("")}${kinds.map(k => sides.map(sd => cell(sd, k)).join("")).join("")}</div><p class="b-x">${cancelText(r)}${!r.state && r.net !== 0 ? `: <b>${sg(r.add)}</b>` : ""}.</p>`;
}
function designB(c) {
  if (c.targets) {
    const sh = resolve({ ...c, dc: 99, sources: [] });
    return `<div class="rb b"><p class="a-line"><span class="t">${diceHtml(sh, { plus: true })}</span><span class="t"><b>${sg(c.mod.v)}</b> ${esc(c.mod.label)}</span><span class="t eq">= <b class="tot">${sh.diceSum + c.mod.v}</b></span><span class="t q">for every target</span></p>`
      + c.targets.map(t => { const r = resolve({ ...t, id: c.id }, c); return `<div class="a-tg"><p class="b-tn"><b>${esc(t.name)}</b></p>${ledger(r)}${sumLine(r, { shared: true })}</div>`; }).join("") + `</div>`;
  }
  const r = resolve(c);
  return `<div class="rb b">${c.save ? `<p class="lead">${esc(c.roller)} rolls</p>` : ""}${ledger(r)}${sumLine(r)}</div>`;
}

/* ------------------------------------------------------------------ design C: the written sum */
function cBB(r, open) {
  if (!r.entries.length) return "";
  const rows = r.entries.map(e => `<span class="e${e.counted === 0 ? " off" : ""}"><span class="n">${e.counted === 0 ? "0" : sg(e.side === "boon" ? e.counted : -e.counted)}</span><span class="nm">${nameHtml({ ...e, n: e.special ? e.n : 1 })}</span></span>`).join("");
  return `<span class="c-n${r.state || !r.add ? " zero" : ""}">${r.state ? "+0" : r.add ? sg(r.add) : "+0"}</span><div class="c-t"><button type="button" class="tog" aria-expanded="${open}"><b>Boons and Banes</b>${caret(open)}</button>${cancelShort(r) ? ` <span class="q g">${cancelShort(r)}</span>` : ""}<div class="names c-sub"${open ? "" : " hidden"}>${rows}</div></div>`;
}
const cTot = r => `<span class="c-n c-tot"><b class="tot">${r.total}</b></span><div class="c-t c-tot"><span class="a-line">${endHtml(r)}</span></div>`;
function designC(c, { open = true } = {}) {
  if (c.targets) {
    const sh = resolve({ ...c, dc: 99, sources: [] });
    return `<div class="rb c"><div class="c-sum"><span class="c-n">${sh.diceSum}</span><div class="c-t">${diceHtml(sh)}</div><span class="c-n">${sg(c.mod.v)}</span><div class="c-t">${esc(c.mod.label)}</div><span class="c-n c-tot c-sh">${sh.diceSum + c.mod.v}</span><div class="c-t c-tot c-sh"><span class="q">for every target</span></div></div>`
      + c.targets.map(t => { const r = resolve({ ...t, id: c.id }, c); return `<div class="a-tg"><div class="c-sum"><span class="c-n">${r.diceSum + r.mod.v}</span><div class="c-t"><b>${esc(t.name)}</b></div>${cBB(r, open)}${cTot(r)}</div></div>`; }).join("") + `</div>`;
  }
  const r = resolve(c);
  return `<div class="rb c">${c.save ? `<p class="lead">${esc(c.roller)} rolls</p>` : ""}<div class="c-sum"><span class="c-n">${r.diceSum}</span><div class="c-t">${diceHtml(r)}${stateNote(r) ? ` <span class="q">${stateNote(r)}</span>` : ""}</div><span class="c-n">${sg(r.mod.v)}</span><div class="c-t">${esc(r.mod.label)}</div>${cBB(r, open)}${cTot(r)}</div></div>`;
}

/* ------------------------------------------------------------------ today: the system's own function */
function todayModel(c) {
  const r = resolve(c);
  return { d1: c.dice[0], d2: c.dice[1], doubles: !!r.dbl, crit: r.crit, base: r.base, tier: r.tier, total: r.total, dc: c.dc, dcLabel: c.dcLabel,
    boonFaces: Array(r.B).fill(1), baneFaces: Array(r.N).fill(1), sources: c.sources.map(s => ({ name: s.name, boons: s.boons || 0, banes: s.banes || 0, bb: s.bb || "" })), mods: [c.mod] };
}
const TODAY_IDS = ["1", "2a", "4a", "5"];
const todayHtml = `<!doctype html>
<html lang="en" class="twod12-type">
<head><meta charset="utf-8"><title>Today's breakdown (the system's own function and CSS)</title>
<link rel="stylesheet" href="../../twod12/styles/system.css"><link rel="stylesheet" href="../../twod12/styles/theme.css">
<style>
@font-face { font-family: "Source Sans 3"; font-weight: 200 900; src: url("../../twod12/fonts/source-sans-3.woff2") format("woff2"); }
@font-face { font-family: "Source Serif 4"; font-weight: 200 900; src: url("../../twod12/fonts/source-serif-4.woff2") format("woff2"); }
body { margin: 0; padding: 16px; display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; background: #14120f; --font-primary: "Source Sans 3", sans-serif; }
body.theme-light { background: #e6dcc6; }
.shot { width: 300px; } .shot.w232 { width: 232px; }
</style></head>
<body class="theme-dark">
${TODAY_IDS.flatMap(id => [300, 232].map(w => `<div class="shot${w === 232 ? " w232" : ""}" data-today="${id}" data-w="${w}"><div class="twod12 chat cc"><div class="cc-card">${breakdownHtml(todayModel(CASES.find(c => c.id === id)), { open: true })}</div></div></div>`)).join("\n")}
<script>if (new URLSearchParams(location.search).has("light")) document.body.className = "theme-light";</script>
</body></html>
`;
writeFileSync(join(HERE, "today.html"), todayHtml);

/* ------------------------------------------------------------------ the page */
const M = existsSync(join(HERE, "measured.json")) ? JSON.parse(readFileSync(join(HERE, "measured.json"), "utf8")) : {};
const h = k => (M[k] ? `${Math.round(M[k])}` : "?");
const fig = (design, c, html, { w = 300, m = "", note = "" } = {}) => `<figure class="case" data-design="${design}" data-case="${c.id}"${m ? ` data-m="${m}"` : ""}><figcaption><b>${c.id.replace(/[ab]$/, "")}. ${esc(c.title)}${note ? ` <span class="mute">(${note})</span>` : ""}</b><span>${esc(c.who)}</span></figcaption><div class="card${w !== 300 ? ` w${w}` : ""}">${html}</div></figure>`;
const byId = id => CASES.find(c => c.id === id);
const DESIGNS = [
  { key: "A", name: "The sentence", fn: designA,
    lead: `One sentence, read left to right, the way the book writes a sum ("11 + 8 + 5 = 24"): the dice, the Modifier, the Boons, the Banes, the total, the Defense, the Tier. It is short enough to stay on the card all the time. A click on <b>+2 Boons −2 Banes</b> opens their names under it, each with its kind in words. Click one to try.`,
    extra: () => [fig("A", byId("1"), designA(byId("1"), { open: false }), { m: "A1closed", note: "closed" }), fig("A", byId("5"), designA(byId("5"), { open: false }), { m: "A5closed", note: "closed" })] },
  { key: "B", name: "The ledger", fn: designB,
    lead: `Boons in the left column, Banes in the right, a row for each kind, so the two rules that decide the number can be seen as a shape: a kind counts 2 a side at most (the third is struck out), and the columns cancel across (the line under them says what is left). The sentence of the sum closes it.`,
    extra: () => [] },
  { key: "C", name: "The written sum", fn: designC,
    lead: `A sum written the way it is done on paper: every line starts with its number, in one column, and the line under the column is the total. The Boons and the Banes are one line of that sum (what they add after cancelling), with their own short column under it. A name can be as long as it likes: it wraps under itself, and its number stays at the start of its line. A click on <b>Boons and Banes</b> folds their list.`,
    extra: () => [fig("C", byId("1"), designC(byId("1"), { open: false }), { m: "C1closed", note: "folded" }), fig("C", byId("5"), designC(byId("5"), { open: false }), { m: "C5closed", note: "folded" })] },
];
const section = d => `<section id="d-${d.key}" class="design"><h2>${d.key}. ${d.name}</h2><p>${d.lead}</p>
<div class="row">${CASES.map(c => fig(d.key, c, d.fn(c), { m: c.id === "1" ? `${d.key}1` : c.id === "5" ? `${d.key}5` : "" })).join("")}${d.extra().join("")}</div>
<h3>A narrower chat (232 px) and a popped-out one (420 px)</h3>
<div class="row">${fig(d.key, byId("5"), d.fn(byId("5")), { w: 232, note: "232 px" })}${fig(d.key, byId("1"), d.fn(byId("1")), { w: 232, note: "232 px" })}${fig(d.key, byId("5"), d.fn(byId("5")), { w: 420, note: "420 px" })}</div>
</section>`;
const css = readFileSync(join(HERE, "roll-breakdown.css"), "utf8");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Roll Breakdown</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:wght@600&display=swap" rel="stylesheet">
<style>
${css}</style>
</head>
<body>
<main>
<h1>The roll's breakdown: three designs</h1>
<p class="mute">A mockup: nothing here is in the system. The part of an Action's chat card that explains the roll, drawn three ways for the same ten rolls, in a card 300 px wide. Every number is counted by the system's own rules (<code>calc.mjs</code>), not typed. <button type="button" class="reset" id="theme">Show the light theme</button></p>

<section id="today"><h2>Today</h2>
<p>Drawn by the system's own function with the system's own CSS (a picture: the page does not load them). The left column is three labels in small capitals; the entries hang from the right edge, so in a narrow chat a long name wraps and its number and its kind are torn from it; the kind is a small tag at the far right; nothing says how the dice became the total.</p>
<div class="row today"><figure class="case"><figcaption><b>1. The picture's roll, 300 px</b><span>${h("today1")} px tall</span></figcaption><img class="shot" data-today="today-1" src="today-1-dark.png" alt="Today's breakdown for the picture's roll" width="300"></figure>
<figure class="case"><figcaption><b>1. The same, 232 px</b><span>as in Lucas's picture: the last Bane is torn</span></figcaption><img class="shot" data-today="today-1-232" src="today-1-232-dark.png" alt="Today's breakdown, in a narrower chat" width="232"></figure>
<figure class="case"><figcaption><b>5. Many entries, 300 px</b><span>${h("today5")} px tall</span></figcaption><img class="shot" data-today="today-5" src="today-5-dark.png" alt="Today's breakdown with five Boons and three Banes" width="300"></figure></div>
</section>

${DESIGNS.map(section).join("\n")}

<section id="heights"><h2>Heights</h2>
<p>The breakdown alone, in a 300 px card, in pixels.</p>
<div class="tw"><table>
<thead><tr><th></th><th>1. The picture's roll</th><th>5. Many entries</th></tr></thead>
<tbody>
<tr><th>Today</th><td>${h("today1")}</td><td>${h("today5")}</td></tr>
<tr><th>A, closed (the sentence alone)</th><td>${h("A1closed")}</td><td>${h("A5closed")}</td></tr>
<tr><th>A, open</th><td>${h("A1")}</td><td>${h("A5")}</td></tr>
<tr><th>B</th><td>${h("B1")}</td><td>${h("B5")}</td></tr>
<tr><th>C, folded</th><td>${h("C1closed")}</td><td>${h("C5closed")}</td></tr>
<tr><th>C, open</th><td>${h("C1")}</td><td>${h("C5")}</td></tr>
</tbody></table></div>
</section>

<section id="rec"><h2>Recommended</h2>
<div class="rec"><p><b>A on the card, C behind its click.</b> The sentence is the only form short enough to be on every card without a click, and it answers the question asked most ("how did 3 and 11 become 16?") in one line. When the names are wanted, the written sum is the form in which a long name cannot hurt: the number is the first thing on its line. If only one is built, build C.</p>
<p>B is the most exact picture of the rule (the limit of a kind and the cancelling are shapes, not words) and the tallest; it also splits a 300 px card into two columns of about 135 px, where most names wrap. It suits a wide window better than the chat.</p></div>
</section>

<section id="q"><h2>Questions for Lucas</h2>
<ul>
<li><b>A, B or C</b>, or A with C behind its click?</li>
<li><b>Always on the card, or behind a click?</b> Today the whole breakdown opens on a click on the Tier ladder. A's sentence could be on the card all the time (${h("A1closed")} px), with only the names behind a click.</li>
<li><b>The names: open or closed at first?</b></li>
<li><b>An entry that does not count</b> (a third Field): shown struck out with "2 at most", as drawn, or left out?</li>
<li><b>Cancelling:</b> the rule cancels counts, not pairs, so no design says "this Boon cancelled that Bane". The designs say "4 Boons, 3 Banes: 1 Boon left". Enough?</li>
<li><b>The Defense</b> is written "against AD 14" in ink (today a colored, framed badge). Keep the badge's color?</li>
<li><b>Several targets:</b> drawn as one breakdown (the shared dice once, then each target). Today each target's row opens its own, with the dice repeated. Which?</li>
</ul>
</section>
</main>
<script>
// the theme switch, and the click that opens or folds a list (a click, never a hover)
const btn = document.getElementById("theme");
btn.addEventListener("click", () => { const on = document.documentElement.classList.toggle("twod12-light"); btn.textContent = on ? "Show the dark theme" : "Show the light theme"; document.querySelectorAll("img.shot").forEach(i => { i.src = i.dataset.today + (on ? "-light.png" : "-dark.png"); }); });
if (new URLSearchParams(location.search).has("light")) btn.click();
document.addEventListener("click", ev => {
  const t = ev.target.closest(".tog"); if (!t) return;
  const card = t.closest(".a-tg") ?? t.closest(".rb"), open = t.getAttribute("aria-expanded") !== "true";
  t.setAttribute("aria-expanded", open); t.querySelector(".car").textContent = open ? "\\u25be" : "\\u25b8";
  card.querySelectorAll(".names").forEach(n => { n.hidden = !open; });
});
</script>
</body>
</html>
`;
writeFileSync(join(HERE, "index.html"), html);
console.log("index.html", html.length, "bytes; today.html", todayHtml.length, "bytes");
