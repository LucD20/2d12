// Builds the DARK ACTION CARD mockup (Lucas, 2026-11-12: "do the Dark theme for Action Cards first"). Nothing in the system changes.
//   node foundry/mockups/action-card-dark-build.mjs   ->   action-card-dark.css (the dark set, generated) and action-card-dark.html (the page)
// HOW THE DARK SET IS MADE: every rule of the system's Action card (.twod12.acard.d2 in system.css) is read, and each color in it is
// replaced by its dark counterpart (the MAP below; a color can map differently as text, as a background and as a line). The output is
// a block of rules under one scope class (.twod12-dark), so it holds EVERY part of the card, also the ones this page doesn't show.
// When the system gets it, the scope becomes whatever switches the theme (Foundry's own theme class, or a system setting): to decide then.
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ICONS } from "./npc-hud-icons.mjs";
import { SIGNIKA } from "./npc-hud-signika.mjs";

const here = f => fileURLToPath(new URL(f, import.meta.url));
const b64 = f => readFileSync(here(f)).toString("base64");
const ic = n => { const [vb, d] = ICONS[n]; return `<svg class="ic" viewBox="${vb}" aria-hidden="true"><path d="${d}"/></svg>`; };

/* ------------------------------------------------------------------ the system's card rules */
const raw = readFileSync(here("../twod12/styles/system.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
function blocks(css) { const out = []; let start = 0, depth = 0; for (let i = 0; i < css.length; i++) { const ch = css[i]; if (ch === "{") depth++; else if (ch === "}") { depth--; if (depth === 0) { out.push(css.slice(start, i + 1).trim()); start = i + 1; } } } return out; }
const all = blocks(raw);
const cardRules = all.filter(b => /\.acard\.d2/.test(b.slice(0, b.indexOf("{"))) && !b.startsWith("@"));
const fontRules = all.filter(b => /^@font-face/.test(b) && /Cinzel/.test(b)).map(b => b.replace(/url\("\.\.\/fonts\/([a-z0-9-]+\.woff2)"\)/g, (m, f) => `url(data:font/woff2;base64,${b64(`../twod12/fonts/${f}`)})`));
const rootRules = all.filter(b => /^:root/.test(b));

/* ------------------------------------------------------------------ light -> dark */
// The dark page's tokens (the same as the one-page sheet's, npc-hud.css): the page, a shaded row, a band, a rule, a hairline, ink, muted ink, gold, the stamp.
const T = { pg: "#1f1c18", pg2: "#28241d", band: "#332c22", rule: "#7a683f", hair: "#4a4132", ink: "#ece3cf", mute: "#b3a68e", faint: "#8a7f6b", gold: "#d4a548", stamp: "#eadfc8", stampInk: "#221d16", stampHover: "#fff8e8" };
// any: whatever the property; text / bg / line: when the color is used as text, as a background or as a border, outline or shadow.
const MAP = {
  any: {
    "#d5ebe6": "#17332f", "#1d5a53": "#7fd3c8", "#a9cfc7": "#2c5a54",          // Roll traits (teal)
    "#dbe5f2": "#1a2a44", "#24467a": "#9dbcf5", "#b3c5df": "#2f4a78",          // Requires (blue)
    "#f4ddd5": "#3a211b", "#8a3324": "#f29f84", "#e2b8aa": "#6a3a2e",          // Kind (rust)
    "#f2e6d0": "#33290f", "#6b4410": "#e8c25a", "#dcc7a0": "#5c4a1c",          // Damage (gold)
    "#e5e0d6": "#2c2924", "#4a443b": "#c2bbae", "#cfc6b5": "#4a463e",          // Keywords (grey)
    "#e3eef1": "#16303a", "#b6d0d6": "#2c5560", "#1d4f5a": "#8fd0e0",          // the highlighted Trigger
    "#fbefed": "#3a201d", "#f1f7ec": "#26331f", "#e8f1e3": "#1d3a25", "#e6eef8": "#17263a", "#eef3fa": "#17263a",   // the Tier rows
    "#a8261c": "#f3a79e", "#3f6e31": "#aed79e", "#1d5a9e": "#8db8f0", "#7fae6c": "#7fae6c",
    "#9b2226": "#d0564f", "#2c4a9b": "#6f90e6", "#7d5400": "#e3ba62", "#1d4f8f": "#8db8f0", "#b07a12": T.gold,
    "#26241f": T.ink, "#2a241d": T.ink, "#3a3329": T.ink, "#5d5446": T.mute, "#6b6152": T.mute, "#7a6f5f": T.mute, "#6b665a": T.mute, "#8f8774": T.faint, "#a99f8a": T.faint,
    "#9aa6ba": T.faint, "#5d6b85": T.hair, "#c9cfda": T.mute, "#9cbf8c": "#4d7a45", "#d9a39c": "#8a4a42", "#8c7d63": "#8c7d63",
    "#fff3df": "#3a3125", "#efe6d3": T.pg2, "#efe7d6": T.band, "#fbf7ef": T.pg2, "#e6d6b2": T.hair, "#c9bfab": T.hair, "#b8a988": T.hair, "#c9a35a": T.rule,
    "#f3d39c": T.gold, "#7a4f12": "transparent", "#e8a345": T.stampHover
  },
  text: { "#1b2433": T.ink, "#d9902f": T.gold, "#d9b26a": T.gold, "#fff": "#fff", "#fbf6ea": T.stampInk, "#2b5a2f": "#93d99f" },
  bg: { "#1b2433": T.band, "#d9902f": T.stamp, "#d9b26a": T.rule, "#fff": T.pg2, "#fbf6ea": T.pg, "#2b5a2f": "#2f6b3a" },
  line: { "#1b2433": T.rule, "#d9902f": T.gold, "#d9b26a": T.hair, "#fff": T.hair, "#fbf6ea": T.pg, "#2b5a2f": "#2f6b3a" }
};
const kindOf = prop => (/^(color|--c|--n)$/.test(prop) ? "text" : /^(background|background-color|--bg)$/.test(prop) ? "bg" : /^(border|outline|box-shadow|text-decoration)/.test(prop) ? "line" : "text");
const COLOR = /#[0-9a-fA-F]{3,8}\b/g;
const unmapped = new Set();
function darkRule(block) {
  const sel = block.slice(0, block.indexOf("{")).trim(), body = block.slice(block.indexOf("{") + 1, -1);
  const decls = body.split(";").map(d => d.trim()).filter(Boolean).filter(d => /#[0-9a-fA-F]{3,8}\b/.test(d));
  if (!decls.length) return "";
  const out = decls.map(d => { const i = d.indexOf(":"), prop = d.slice(0, i).trim(), k = kindOf(prop); return `${prop}:${d.slice(i + 1).replace(COLOR, c => { const lc = c.toLowerCase(), v = MAP[k][lc] ?? MAP.any[lc]; if (!v) unmapped.add(lc); return v ?? c; })}`; });
  return `${sel.split(",").map(s => `.twod12-dark ${s.trim()}`).join(", ")} { ${out.join("; ")}; }`;
}
// What the mapping can't know (a color whose meaning depends on what is under it), set by hand after the generated rules.
const BY_HAND = `
/* by hand: the card's frame (a thin rule, the inner line kept faint), the cost stamps, the head row of the Tier table */
.twod12-dark .twod12.acard.d2 { border-color: ${T.rule}; outline-color: ${T.hair}; }
.twod12-dark .twod12.acard.d2 .ap-vbtn { background: ${T.stamp}; color: ${T.stampInk}; box-shadow: none; border-radius: 2px; }
.twod12-dark .twod12.acard.d2 .ap-vbtn:hover { background: ${T.stampHover}; }
.twod12-dark .twod12.acard.d2 .ap-vbtn.no { background: transparent; color: ${T.faint}; border: 1px dashed ${T.faint}; }
.twod12-dark .twod12.acard.d2 .ap-ap { background: ${T.stamp}; color: ${T.stampInk}; border-radius: 2px; }
.twod12-dark .twod12.acard.d2 .ap-ap.no { background: transparent; color: ${T.faint}; border: 1px dashed ${T.faint}; }
.twod12-dark .twod12.acard.d2 > .ap-title .ap-tcost { background: ${T.stamp}; color: ${T.stampInk}; border-radius: 2px; }
.twod12-dark .twod12.acard.d2 table.ap-tt thead th { background: ${T.band}; color: ${T.ink}; border-bottom: 1px solid ${T.rule}; }
.twod12-dark .twod12.acard.d2 table.ap-tt thead th + th, .twod12-dark .twod12.acard.d2 table.ap-tt td + td { border-left-color: ${T.hair}; }
.twod12-dark .twod12.acard.d2 table.ap-tt td { border-bottom-color: ${T.hair}; }
.twod12-dark .twod12.acard.d2 table.ap-tt td:not(.tl) { color: ${T.ink}; }
.twod12-dark .twod12.acard.d2 table.ap-tt td.dim { color: ${T.faint}; }
/* a book link stays a dashed underline (the generated border of the inline buttons would box it) */
.twod12-dark .twod12.acard.d2 a.twod12-inline.book, .twod12-dark .twod12.acard.d2 a.content-link { border: 0; border-bottom: 1px dashed ${T.gold}; background: none; color: ${T.gold}; }
.twod12-dark .twod12.acard.d2 .ap-ac .pg { color: #fff; }
.twod12-dark .twod12.acard.d2 .ap-freq { color: #fff; }
`;
const darkCss = `/* GENERATED by action-card-dark-build.mjs from system.css's .twod12.acard.d2 rules (${cardRules.length} of them): do not edit; edit the MAP in the script.
   The dark set of the Action card (Lucas, 2026-11-12). A mockup: the system doesn't load this file. */\n${cardRules.map(darkRule).filter(Boolean).join("\n")}\n${BY_HAND}`;
writeFileSync(here("./action-card-dark.css"), darkCss);

/* ------------------------------------------------------------------ the sample cards (the system's markup, written by hand) */
const st = '<span class="ap-st" aria-hidden="true">✦</span>';
const chips = groups => groups.map(([g, label, ks]) => `<span class="ap-tg"><span class="ap-cs">${ks.map(k => `<span class="ap-chip g-${g}">${k}</span>`).join("")}</span><i>${label}</i></span>`).join('<span class="ap-gdiv" aria-hidden="true"></span>');
const V = t => `<span class="dt-body">♥</span> <span class="dtamt">${t}</span>`, R = (t, sub) => `<span class="dt-mind">◆</span> <span class="dtamt">${t}</span> <span class="dtype">${sub}</span>`;
const link = t => `<a class="twod12-inline book">${t}</a>`;
const smite = `<div class="twod12 acard d2" style="border-top-width:1px;border-top-style:solid;border-radius:4px">
  <div class="ap-title"><b>Smite</b><span class="ap-tcost">1 / 2 / 3 AP</span></div>
  <div class="ap-trow">${chips([["roll", "Roll", ["Weapon"]], ["kind", "Kind", ["Strike"]], ["keywords", "Keywords", ["Divine", "Signature"]]])}<span class="ap-cat">Divine Power <span class="ap-freq" style="background:#185FA5">Round</span></span></div>
  <div class="ap-meta"><div class="trow"><b>Target</b> One creature${st}<b>Distance</b> Weapon${st}<b>Vs.</b> AD</div></div>
  <div class="ap-ttw"><table class="ap-tt"><thead><tr><th></th><th><button type="button" class="ap-vbtn">1 AP</button></th><th><button type="button" class="ap-vbtn">2 AP</button></th><th><span class="ap-vwrap"><button type="button" class="ap-vbtn no" disabled>3 AP</button></span></th></tr></thead><tbody>
    <tr class="t1"><td class="tl">Tier 1</td><td>${V("1[W]")}</td><td>${V("1[W]")} + ${R("1d6", "Holy")}</td><td class="dim">${V("1[W]")} + ${R("1d8", "Holy")}</td></tr>
    <tr class="t2"><td class="tl">Tier 2</td><td>${V("1[W] + 2")} + ${R("1d6", "Holy")}</td><td>${V("1[W] + 2")} + ${R("2d6", "Holy")}</td><td class="dim">${V("1[W] + 2")} + ${R("2d8", "Holy")}</td></tr>
    <tr class="t3"><td class="tl">Tier 3</td><td>${V("1[W] + 2")} + ${R("1d8", "Holy")}</td><td>${V("1[W] + 2")} + ${R("2d10", "Holy")}</td><td class="dim">${V("1[W] + 2")} + ${R("3d8", "Holy")}</td></tr>
    <tr class="crit"><td class="tl">Critical</td><td colspan="3">The target is <a class="twod12-inline">Vulnerable 1</a> (EoT).</td></tr>
  </tbody></table></div>
  <div class="ap-fxh">Effects</div>
  <div class="ap-fxl"><span class="ap-ap">1 AP</span><span class="ap-fxt">The target sheds ${link("Bright light")} in a 1 Emanation and takes 1 <span class="kw-bane">Bane</span> when they try to ${link("Hide")}, for 1 round.</span>
    <span class="ap-ap">2 AP</span><span class="ap-fxt">As 1 AP, but a 2 Emanation.</span>
    <span class="ap-ap no">3 AP</span><span class="ap-fxt dim">As 2 AP, and you or one ally in the Bright light gain ${link("Guard")} 1d8 + 2. The other creatures in the light, you excepted, are Pushed 1, away from the target.</span></div>
  <div class="ap-strip"><span class="lab">Your roll</span><b class="ap-rmod">+2 Weapon</b><span class="ap-ac"><span class="pg">+</span>Radiant Zeal</span><span class="ap-ac bad"><span class="tri"></span>Hindered</span></div>
  <div class="ap-flav"><div class="dv" aria-hidden="true">◆ ◆ ◆</div>Your weapon blazes with holy light.</div>
</div>`;
const rally = `<div class="twod12 acard d2" style="border-top-width:1px;border-top-style:solid;border-radius:4px">
  <div class="ap-title"><b>Rally the Tribe</b><span class="ap-tcost">1 AP</span></div>
  <div class="ap-trow">${chips([["keywords", "Keywords", ["Focus"]]])}<span class="ap-cat">Ogre Chieftain <span class="ap-freq" style="background:#185FA5">Round</span></span></div>
  <div class="ap-meta"><div class="trow"><b>Escalation</b> 4${st}<b>Target</b> Allies within 5 squares${st}<b>Distance</b> 5 squares</div></div>
  <div class="ap-fxh">Effects</div>
  <div class="ap-fxl plain"><span class="ap-fxt one">Allies within 5 squares gain 1 Boon on their next [Weapon] Action. <a class="twod12-inline" data-twod12-inline="Use">${ic("hand-pointer")} Apply</a></span></div>
  <div class="ap-flav"><div class="dv" aria-hidden="true">◆ ◆ ◆</div>One bellow, and the whole tribe fights harder.</div>
</div>`;
const hold = `<div class="twod12 acard d2" style="border-top-width:1px;border-top-style:solid;border-radius:4px">
  <div class="ap-title"><b>Hold the Line</b><span class="ap-tcost">1R</span></div>
  <div class="ap-trow">${chips([["roll", "Roll", ["Weapon"]], ["requires", "Requires", ["Melee"]], ["kind", "Kind", ["Strike"]]])}<span class="ap-cat">Orc Warrior <span class="ap-freq" style="background:#185FA5">Round</span></span></div>
  <div class="ap-meta"><div class="trow"><span class="trhl">Trigger</span> An ally within 2 squares is hit.</div><div class="trow"><b>Target</b> The attacker${st}<b>Distance</b> Melee${st}<b>Vs.</b> AD</div></div>
  <div class="ap-ttw"><table class="ap-tt"><thead><tr><th></th><th><button type="button" class="ap-vbtn">1R</button></th></tr></thead><tbody>
    <tr class="t1"><td class="tl">Tier 1</td><td>No effect.</td></tr>
    <tr class="t2"><td class="tl">Tier 2</td><td>${V("2 + 1d6")} <span class="dtype">Slashing</span></td></tr>
    <tr class="t3"><td class="tl">Tier 3</td><td>${V("6 + 1d6")} <span class="dtype">Slashing</span><span class="ap-rid"><span class="arr">↳</span> <span class="ap-mv">Pushed 1</span></span></td></tr>
  </tbody></table></div>
  <div class="ap-flav"><div class="dv" aria-hidden="true">◆ ◆ ◆</div>Touch its kin, and the orc answers.</div>
</div>`;

/* ------------------------------------------------------------------ the page */
const FONT_CSS = Object.entries(SIGNIKA).map(([w, d]) => `@font-face { font-family: "Signika"; font-weight: ${w}; font-style: normal; src: url(data:font/woff2;base64,${d}) format("woff2"); }`).join("\n");
const col = (title, tag, why, html, dark) => `<div class="col"><h3>${title} ${tag}</h3><p class="why">${why}</p><div class="stage${dark ? " twod12-dark dk" : ""}">${html}</div></div>`;
writeFileSync(here("./action-card-dark.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Action card, dark</title>
<!-- GENERATED by action-card-dark-build.mjs (2026-11-12): a mockup, nothing here is in the system. Self-contained (the card's rules from system.css, the generated dark set, the fonts). -->
<style>${FONT_CSS}</style>
<style>${fontRules.join("\n")}\n${rootRules.join("\n")}\n${cardRules.join("\n")}</style>
<style>${darkCss}</style>
<style>
* { box-sizing: border-box; }
body { margin: 0; background: #2a2723; color: #eee6d6; font: 14px/1.45 "Signika", "Segoe UI", system-ui, sans-serif; padding: 22px 22px 60px; --font-primary: "Signika", sans-serif; }
h1 { font: 600 24px Georgia, serif; margin: 0 0 4px; color: #f3e9d2; }
h2 { font: 600 19px Georgia, serif; margin: 34px 0 4px; color: #f3e9d2; border-top: 1px solid #4a443a; padding-top: 18px; }
h3 { font: 600 14px "Signika", sans-serif; margin: 0 0 6px; color: #f3e9d2; display: flex; align-items: center; gap: 8px; }
.lead, .why { color: #c9c0ad; max-width: 1100px; margin: 0 0 10px; } .why { font-size: 13px; } .lead b, .why b { color: #f3e9d2; }
.tag { font: 700 10.5px "Signika", sans-serif; letter-spacing: .08em; text-transform: uppercase; padding: 2px 7px; border-radius: 3px; background: #5a4a2a; color: #e9dfc8; } .tag.pick { background: #2f6b3a; color: #fff; }
.cols { display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-start; margin-top: 14px; }
.col { width: 470px; max-width: 100%; }
.stage { padding: 14px; background: #efebe3; border-radius: 4px; } .stage.dk { background: #14120f; }
.stage .acard { box-shadow: 0 4px 14px rgba(0, 0, 0, .35); }
.ic { width: 1em; height: 1em; fill: currentColor; vertical-align: -.125em; }
ul.notes { color: #c9c0ad; max-width: 1000px; margin: 6px 0 0; padding-left: 20px; } ul.notes b { color: #f3e9d2; }
</style>
</head>
<body>
<h1>The Action card, dark</h1>
<p class="lead">The system's Action card (the one that opens under an Action's row on the sheets, and on a right-click in the HUD) in a dark set, beside today's. <b>The card's structure doesn't change:</b> the same title, traits, meta line, Tier table, Effects, "Your roll" strip and Flavor. Only its colors do, and the Version buttons become the cost stamps of the sheet and the HUD. The dark set is generated from the card's own ${cardRules.length} rules, so it covers every part of the card, also the ones not shown here.</p>
<h2>Smite: three Versions, the Tier table, Effects by Version, "Your roll"</h2>
<div class="cols">${col("Dark", '<span class="tag pick">Proposed</span>', "The page of the one-page sheet (the same tokens): a warm near-black, a thin gold-brown rule, light ink. The Tier rows keep their colors, darkened. The 3 AP Version is not affordable here (dashed, its column dimmed).", smite, true)}${col("Today (light)", '<span class="tag">Unchanged</span>', "The card as the system draws it now: parchment, a navy frame, amber Version buttons. It stays as the light theme's card.", smite, false)}</div>
<h2>Hold the Line: a Reaction with a Trigger and a rider</h2>
<div class="cols">${col("Dark", '<span class="tag pick">Proposed</span>', "", hold, true)}${col("Today (light)", '<span class="tag">Unchanged</span>', "", hold, false)}</div>
<h2>Rally the Tribe: Effects only, with a button</h2>
<div class="cols">${col("Dark", '<span class="tag pick">Proposed</span>', "", rally, true)}${col("Today (light)", '<span class="tag">Unchanged</span>', "", rally, false)}</div>
<h2>Notes</h2>
<ul class="notes">
<li><b>The Version buttons change shape in the dark set:</b> a square light stamp, as on the sheet and the HUD, in the place of the amber button with its shadow. Say if the amber should stay.</li>
<li><b>The Tier table stays a table here</b> (the card has one column per Version, so three lines can't hold it), while the one-page sheet writes a one-Version Action's Tiers as three lines.</li>
<li><b>How the system would pick dark or light is not decided:</b> Foundry's own theme setting, or a setting of the system. This mockup only shows the colors.</li>
<li>The sample cards are the system's markup written by hand (the real card needs Foundry to be drawn); Smite's text is its card's.</li>
</ul>
</body>
</html>
`);
console.log(`built: action-card-dark.css (${cardRules.length} rules read), action-card-dark.html`, unmapped.size ? `| colors left as they are: ${[...unmapped].join(" ")}` : "");
