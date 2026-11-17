// STYLE-1 (v0.0.369): builds styles/theme.css, the settled look on top of system.css (Lucas, 2026-11-12/13; every surface approved in
// foundry/mockups, the decisions in foundry/mockups/style-audit.md). Moved here from the mockups' generator (mockups/style-build.mjs, which
// stays as the record of what was approved). system.css is not regrouped: the theme is a second stylesheet loaded after it.
//   node tools/build-theme.mjs          writes styles/theme.css     (test t248 fails when theme.css is not what this script makes)
// The scope classes sit on <html> (module/theme.mjs, the "theme" setting): .twod12-type always (the type and the shapes, both themes),
// .twod12-dark (the default) or .twod12-light. The shared colors are the --s-* variables of the first block.
// HOW A DARK SET IS MADE: every rule of a surface is read from system.css and each color in it is replaced by its dark counterpart:
// by the MAP when the color is known (a color can map differently as text, as a background and as a line), else by AUTO (the same hue,
// its lightness turned over). BY_HAND fixes what a color swap can't know. Change a color here (or in system.css) and run the script again.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = f => fileURLToPath(new URL(f, import.meta.url));

/* ------------------------------------------------------------------ 1. the shared colors */
// Dark is the default. One name for one job: the page, a shaded row, a band (a heading or a table's head), a rule (a strong line), a
// hairline, ink, muted ink, faint ink, gold (stars, diamonds, links, the open tab), the stamp (the one thing clicked) and its ink.
const DARK = { pg: "#1f1c18", pg2: "#28241d", band: "#332c22", rule: "#7a683f", hair: "#4a4132", ink: "#ece3cf", mute: "#b3a68e", faint: "#8a7f6b", gold: "#d2a75a", stamp: "#eadfc8", stampInk: "#221d16", stampHover: "#fff8e8",
  t1: "#f3a79e", t1bg: "#3a201d", t2: "#e0d65a", t2bg: "#35321a", t2n: "#bdb230", t3: "#8fd69b", t3bg: "#1d3a25", crit: "#8db8f0", critbg: "#17263a",
  vig: "#d0564f", res: "#6f90e6", boon: "#8db8f0", bane: "#f3a79e", good: "#8fd69b", bad: "#ff9c92",
  fqAtwill: "#6aa82e", fqRound: "#4a90de", fqEncounter: "#d65a5a", fqTurn: "#25a3a3", fqDaily: "#9279e0",
  rkMinion: "#4d545c", rkGrunt: "#4b5a26", rkStandard: "#6e2318", rkElite: "#4f2c69",
  // STYLE-3: palette A, the Tiers (fills; their text on a pale range; the pale range; the Critical's ring and ink)
  ta1: "#a8471a", ta2: "#0e6e52", ta3: "#2366a3", taC: "#d9a62e", taCr: "#f0c35a", taCi: "#1f1c18",
  ta1t: "#f2a17c", ta2t: "#6fd3b0", ta3t: "#8cc1f0", taCt: "#f0c35a",
  ta1p: "color-mix(in srgb, #a8471a 22%, #28241d)", ta2p: "color-mix(in srgb, #0e6e52 22%, #28241d)", ta3p: "color-mix(in srgb, #2366a3 22%, #28241d)", taCp: "color-mix(in srgb, #d9a62e 22%, #28241d)" };
const LIGHT = { pg: "#f4ede0", pg2: "#eae0c8", band: "#dfd2b6", rule: "#8a6d3b", hair: "#cdb88a", ink: "#2a241d", mute: "#5d5446", faint: "#8f8774", gold: "#7a5418", stamp: "#3b3128", stampInk: "#f4ede0", stampHover: "#2a231c",
  t1: "#a8261c", t1bg: "#fbefed", t2: "#6f6800", t2bg: "#f7f3cf", t2n: "#bdb230", t3: "#2b5a2f", t3bg: "#e8f1e3", crit: "#1d5a9e", critbg: "#e6eef8",
  vig: "#9b2c2c", res: "#2c4a9b", boon: "#1d4f8f", bane: "#a8261c", good: "#234d27", bad: "#8a1c13",
  fqAtwill: "#3B6D11", fqRound: "#185FA5", fqEncounter: "#A32D2D", fqTurn: "#0F6E6E", fqDaily: "#5B3FA6",
  rkMinion: "#4d545c", rkGrunt: "#4b5a26", rkStandard: "#6e2318", rkElite: "#4f2c69",
  ta1: "#b34a12", ta2: "#0f7a5a", ta3: "#0a64a8", taC: "#d9a62e", taCr: "#8a6414", taCi: "#1f1c18",
  ta1t: "#b34a12", ta2t: "#0f7a5a", ta3t: "#0a64a8", taCt: "#8a6414",
  ta1p: "color-mix(in srgb, #b34a12 18%, #f4ede0)", ta2p: "color-mix(in srgb, #0f7a5a 18%, #f4ede0)", ta3p: "color-mix(in srgb, #0a64a8 18%, #f4ede0)", taCp: "color-mix(in srgb, #d9a62e 25%, #f4ede0)" };
const T = DARK;
const kebab = k => k.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
const vars = o => Object.entries(o).map(([k, v]) => `--s-${kebab(k)}: ${v};`).join(" ");

/* ------------------------------------------------------------------ the system's rules */
function blocks(css) { const out = []; let start = 0, depth = 0; for (let i = 0; i < css.length; i++) { const ch = css[i]; if (ch === "{") depth++; else if (ch === "}") { depth--; if (depth === 0) { out.push(css.slice(start, i + 1).trim()); start = i + 1; } } } return out; }
const selOf = b => b.slice(0, b.indexOf("{"));

/* ------------------------------------------------------------------ light -> dark */
const MAP = {
  any: {
    "#d5ebe6": "#17332f", "#1d5a53": "#7fd3c8", "#a9cfc7": "#2c5a54", "#dbe5f2": "#1a2a44", "#24467a": "#9dbcf5", "#b3c5df": "#2f4a78",          // traits: Roll, Requires
    "#f4ddd5": "#3a211b", "#8a3324": "#f29f84", "#e2b8aa": "#6a3a2e", "#f2e6d0": "#33290f", "#6b4410": "#e8c25a", "#dcc7a0": "#5c4a1c",          // Kind, Damage
    "#e5e0d6": "#2c2924", "#4a443b": "#c2bbae", "#cfc6b5": "#4a463e", "#e3eef1": "#16303a", "#b6d0d6": "#2c5560", "#1d4f5a": "#8fd0e0",          // Keywords, the Trigger
    "#fbefed": T.t1bg, "#f2cdc7": T.t1bg, "#a8261c": T.t1, "#8a1c13": T.t1, "#f1f7ec": T.t2bg, "#cfe3c2": "#453f18", "#3f6e31": T.t2, "#234d27": T.t2, "#7fae6c": T.t2n,   // the Tiers (Tier 2 yellowish)
    "#e8f1e3": T.t3bg, "#1c3a1f": "#12301a", "#e6eef8": T.critbg, "#eef3fa": T.critbg, "#eef4fb": T.critbg, "#1d5a9e": T.crit, "#1d3f6b": T.crit,
    "#9b2226": T.vig, "#9b2c2c": T.vig, "#2c4a9b": T.res, "#7d5400": "#e3ba62", "#1d4f8f": T.boon, "#b07a12": T.gold, "#e0b23a": "#e0b23a",
    "#26241f": T.ink, "#2a241d": T.ink, "#3a3329": T.ink, "#2c2a26": T.ink, "#2b2216": T.ink, "#2a2010": T.ink, "#5d5446": T.mute, "#6b6152": T.mute, "#7a6f5f": T.mute, "#6b665a": T.mute, "#6f6a5c": T.mute, "#6b6358": T.mute, "#6b5a3a": T.mute, "#8f8774": T.faint, "#a99f8a": T.faint,
    "#9aa6ba": T.faint, "#5d6b85": T.hair, "#c9cfda": T.mute, "#9cbf8c": "#4d7a45", "#d9a39c": "#8a4a42", "#8c7d63": "#8c7d63", "#8a7650": "#8c7d63",
    "#fff3df": "#3a3125", "#efe6d3": T.pg2, "#efe7d6": T.band, "#fbf7ef": T.pg2, "#fbf7ee": T.pg2, "#fffdf8": T.pg2, "#e8dec8": T.band, "#dfd2b6": T.band, "#e0d4ba": T.band, "#e6dcc4": T.band,
    "#e6d6b2": T.hair, "#c9bfab": T.hair, "#b8a988": T.hair, "#cdb88a": T.hair, "#c9a35a": T.rule, "#bfae8c": T.rule, "#bfae86": T.rule, "#c8b48a": T.rule,
    "#f3d39c": T.gold, "#7a4f12": "transparent", "#e8a345": T.stampHover, "#f4ede0": T.pg, "#f4eddc": T.pg, "#f4ecdc": T.pg,
    "#7a1626": "#ef8a96", "#17327a": "#8db3ff", "#14532d": "#7fd49a", "#6b4e00": "#e6bd5a", "#9a4a00": "#f4a259", "#5b3a9e": "#b794f6",   // the Attribute and Modifier colors
    "#185fa5": T.fqRound, "#a32d2d": T.fqEncounter, "#0f6e6e": T.fqTurn, "#3b6d11": T.fqAtwill, "#5b3fa6": T.fqDaily
  },
  text: { "#1b2433": T.ink, "#1d2738": T.ink, "#d9902f": T.gold, "#d9b26a": T.gold, "#fff": "#fff", "#fbf6ea": T.stampInk, "#2b5a2f": T.t3, "#1f6b3a": T.t3, "#2f6b3a": T.good, "#3b3128": T.ink, "#f4ede0": T.stampInk, "#2a231c": T.ink },
  bg: { "#185fa5": "#185fa5", "#a32d2d": "#8f2626", "#0f6e6e": "#0f6e6e", "#3b6d11": "#3b6d11", "#5b3fa6": "#5b3fa6", "#1b2433": T.band, "#1d2738": T.band, "#d9902f": T.stamp, "#d9b26a": T.rule, "#fff": T.pg2, "#fbf6ea": T.pg, "#2b5a2f": "#2f6b3a", "#1f6b3a": "#2f6b3a", "#2f6b3a": "#2f6b3a", "#3b3128": T.stamp, "#2a231c": T.stampHover, "#5f5e5a": "#5f5e5a" },
  line: { "#1b2433": T.rule, "#1d2738": T.rule, "#d9902f": T.gold, "#d9b26a": T.hair, "#fff": T.hair, "#fbf6ea": T.pg, "#2b5a2f": "#2f6b3a", "#3b3128": T.stamp, "#f4ede0": T.pg }
};
// AUTO: an unknown color keeps its hue and has its lightness turned over, by how it is used.
const hex2 = h => { let s = h.slice(1); if (s.length === 3 || s.length === 4) s = [...s].map(c => c + c).join(""); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16) / 255).concat(s.length === 8 ? [parseInt(s.slice(6, 8), 16) / 255] : []); };
const toHsl = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; if (!d) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1)); const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, s, l]; };
const fromHsl = ([h, s, l]) => { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2; const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return `#${[r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("")}`; };
function auto(kind, hexc, warm = false) {
  const rgb = hex2(hexc); if (rgb.length === 4) return hexc;
  const [h, s, l] = toHsl(rgb);
  // a sheet's navy family (the PC sheet's head, side panel, tiles and their blue-grey inks) goes to the warm page: the same lightness, a brown hue
  if (warm && h >= 195 && h <= 250) {
    if (kind === "text") { if (s < 0.45) return fromHsl([38, 0.2, Math.max(l, 0.62)]); }
    else if (l < 0.5 && s > 0.1) return fromHsl([36, kind === "line" ? 0.22 : 0.14, kind === "line" ? Math.max(l, 0.24) : l * 0.72]);
  }
  if (kind === "bg") return l >= 0.55 ? fromHsl([h, s * 0.7, 0.1 + (1 - l) * 0.45]) : l <= 0.3 ? fromHsl([h, s, Math.min(l + 0.05, 0.3)]) : hexc;
  if (kind === "line") return l >= 0.6 ? fromHsl([h, s * 0.6, 0.26 + (1 - l) * 0.2]) : l <= 0.3 ? fromHsl([h, s * 0.8, 0.5]) : hexc;
  return l <= 0.45 ? fromHsl([h, Math.min(s, 0.75), 0.92 - l * 0.55]) : hexc;
}
const kindOf = prop => (/^(color|--c|--n|fill)$/.test(prop) ? "text" : /^(background|background-color|--bg)$/.test(prop) ? "bg" : /^(border|outline|box-shadow|text-decoration)/.test(prop) ? "line" : "text");
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const autoUsed = {};
function darkSet(name, rules, scope = ".twod12-dark") {
  autoUsed[name] = new Set();
  return rules.map(block => {
    const sel = selOf(block).trim(), body = block.slice(block.indexOf("{") + 1, -1);
    // v0.0.370: the automation diamonds keep their colors on the dark page (a gem's gradient turned dark read as a dark square)
    if (/\.autodia\b/.test(sel)) return "";
    // v0.0.370: a near-white background (rgba white, .35 and more) is a faint light tint on the dark page (a die, a rider's chip on a Tier row)
    const WHITE = /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0?\.(?:3[5-9]|[4-9])\d*\s*\)/g;
    const decls = body.split(";").map(d => d.trim()).filter(d => (/#[0-9a-fA-F]{3,8}\b/.test(d) || (/^background(-color)?\s*:/.test(d) && new RegExp(WHITE.source).test(d))) && !/^--cc-|^--rd-|^--cw-|^--ps-|^--sk-|^--fr-|^--tp-/.test(d));
    if (!decls.length) return "";
    // a "background" shorthand resets background-clip: keep the rule's own clip after it (gradient text)
    if (decls.some(d => /^background\s*:/.test(d))) decls.push(...body.split(";").map(d => d.trim()).filter(d => /^(-webkit-)?background-clip\s*:/.test(d)));
    const out = decls.map(d => { const i = d.indexOf(":"), prop = d.slice(0, i).trim(), k = kindOf(prop); return `${prop}:${d.slice(i + 1).replace(WHITE, "rgba(255, 255, 255, .07)").replace(HEX, c => { const lc = c.toLowerCase(), v = MAP[k][lc] ?? MAP.any[lc]; if (v) return v; autoUsed[name].add(lc); return auto(k, lc, name === "pcs"); })}`; });
    // :where() keeps each rule's own weight, so the system's cascade holds (a rule that colors with a variable, as "the lit pip is the row's color",
    // still beats the plain rule before it); the set only has to come after the system's rules.
    return `${topSplit(sel).map(s => `:where(${scope}) ${s.trim()}`).join(", ")} { ${out.join("; ")}; }`;
  }).filter(Boolean).join("\n");
}

// The light theme of a sheet: only its navy family turns warm (the same brown the dark set uses, at the same lightness); every other color stays.
// Body red and Mind blue (the Wounds boxes) and the colors written on the elements themselves (Vigor, Resolve, the frequencies) are meanings, not chrome: kept.
function warmSet(rules) {
  return rules.map(block => {
    const sel = selOf(block).trim(), body = block.slice(block.indexOf("{") + 1, -1);
    if (/\.mind\b|\.body\b|\.ps-wb\b|\.ps-uw\b/.test(sel)) return "";
    const out = body.split(";").map(d => d.trim()).filter(d => /#[0-9a-fA-F]{3,8}\b/.test(d) && !/^--ps-/.test(d)).map(d => { const i = d.indexOf(":"), prop = d.slice(0, i).trim(), k = kindOf(prop); let hit = false; const v = d.slice(i + 1).replace(HEX, c => { const w = auto(k, c.toLowerCase(), true), plain = auto(k, c.toLowerCase(), false); if (w !== plain) { hit = true; return k === "text" ? w : fromHsl([36, 0.14, toHsl(hex2(c))[2]]); } return c; }); return hit ? `${prop}:${v}` : ""; }).filter(Boolean);
    return out.length ? `${topSplit(sel).map(x => `:where(.twod12-type) ${x.trim()}`).join(", ")} { ${out.join("; ")}; }` : "";
  }).filter(Boolean).join("\n");
}

/* ------------------------------------------------------------------ the type (both themes): the one-page sheet's */
// Cinzel only for a big title. Names and labels are Signika: bold for a name, bold small capitals for a label (Tier 1, Effects, Your roll).
const TYPE = `
/* THE TYPE (Lucas, 2026-11-12: "copy the font style from the NPC sheet"), for both themes */
.twod12-type .twod12.acard.d2 > .ap-title > b { font: 700 16.5px "Source Sans 3", sans-serif; letter-spacing: 0; }
.twod12-type .twod12.acard.d2 table.ap-tt td.tl { font: 700 14px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; }
.twod12-type .twod12.acard.d2 .ap-vbtn, .twod12-type .twod12.acard.d2 .ap-vcost { font: 700 12.5px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; }
.twod12-type .twod12.acard.d2 .ap-fxh { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; }
.twod12-type .twod12.acard.d2 .ap-fxh::before { content: none; }
.twod12-type .twod12.acard.d2 .ap-strip .lab { font: 700 14px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; text-transform: none; }
.twod12-type .twod12.acard.d2 .ap-ap, .twod12-type .twod12.acard.d2 > .ap-title .ap-tcost { font: 700 12px "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat.cc .cc-name { font: 700 15.5px "Source Sans 3", sans-serif; letter-spacing: 0; }
.twod12-type .twod12.chat.cc .cc-stamp b { font-family: "Source Sans 3", sans-serif; font-weight: 700; }
.twod12-type .twod12.chat.cc .cc-stamp small { font: 700 12px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .03em; text-transform: none; }
.twod12-type .twod12.chat.cc .cc-stamp .cc-stl { font-variant: normal; font-size: 11px; }
.twod12-type .twod12.chat.cc .cc-seg, .twod12-type .twod12.chat.cc .cc-arrow b, .twod12-type .twod12.chat.cc .cc-total, .twod12-type .twod12.chat.cc .cc-stotal, .twod12-type .twod12.chat.cc .cc-savehead b, .twod12-type .twod12.chat.cc .cc-srow b, .twod12-type .twod12.chat.cc .cc-ptot, .twod12-type .twod12.chat.cc [class*="cc-"]:not(i):not([class*="fa-"]) { font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat .ahead > b, .twod12-type .twod12.chat.sysmsg > .ahead > b { font: 700 14.5px "Source Sans 3", sans-serif; letter-spacing: 0; }
.twod12-type .twod12-dock .td-ttl { font: 700 14.5px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; text-transform: none; }
/* the cost stamp in the light theme too (Lucas: "if it is helpful"): the chat card's dark brown button, square, no shadow */
.twod12-type .twod12.acard.d2 .ap-vbtn { background: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; box-shadow: none; border-radius: 2px; }
.twod12-type .twod12.acard.d2 .ap-vbtn:hover { background: ${LIGHT.stampHover}; }
.twod12-type .twod12.acard.d2 .ap-vbtn.no { background: transparent; color: #8f8774; border: 1px dashed #a99f8a; }
.twod12-type .twod12.acard.d2 .ap-ap:not(.no), .twod12-type .twod12.acard.d2 > .ap-title .ap-tcost { background: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; border-radius: 2px; }
.twod12-type .twod12.chat.cc .cc-btn.primary { border-radius: 2px; }
/* THE SYSTEM MESSAGES (sysCard, sysLine) in the chat card's look (Lucas: the navy header, the orange line and the Cinzel title no longer fit):
   the same card as an attack roll (a flat surface, a thin line), the title as a line of bold text over a hairline, the AP as the chat card's pill.
   Style only: the message's elements and text don't change. */
.twod12-type .twod12.chat.action.sysmsg { background: ${LIGHT.pg}; border: 1px solid #bfae8c; border-radius: 5px; padding: 7px 8px 6px; color: ${LIGHT.ink}; font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat.action.sysmsg > * { margin-left: 0; margin-right: 0; }
.twod12-type .twod12.chat.action.sysmsg > .ahead { background: none !important; color: inherit !important; border: 0 !important; border-bottom: 1px solid ${LIGHT.hair} !important; padding: 0 0 4px; margin: 0 0 5px; align-items: center; }
.twod12-type .twod12.chat.action.sysmsg > .ahead .apmark { background: #3b4cb8; color: #fff; border-radius: 3px; font: 700 10.5px/1 "Source Sans 3", sans-serif; padding: 2px 6px; margin: 0; }
.twod12-type .twod12.chat.action.sysmsg .sm-lead { font-size: 14px; }
.twod12-type .twod12.chat.sysline { background: ${LIGHT.pg}; border: 1px solid #bfae8c; border-radius: 5px; color: ${LIGHT.ink}; font-family: "Source Sans 3", sans-serif; }
/* AP is the AP blue wherever it is written (it was plain inside a system card's text); a Guard line's shield is the Guard blue (the Turn dock's) */
.twod12-type .twod12.chat.sysline > i:has(svg), .twod12-type .twod12.chat.sysline > i { color: #6b5a3a; }
.twod12-type .twod12.chat.sysline > i[data-ic^="shield"] { color: #2f6fb3; }
.twod12-type .twod12.chat .kw-guard { color: #2f6fb3; font-weight: 700; }
/* THE PC SHEET, both themes (style only): square corners, "Use" as the stamp, Signika for the headings (Cinzel stays on the character's name),
   gold in the place of amber. Light: the warm dark brown of the stamp in the place of navy for the head and the side panel. */
.twod12-type .twod12.sheet.pcs { --ps-navy: #2b2520; --ps-cell: #332c25; --ps-edge: #54493a; --ps-tile: #3a3229; --ps-parch: ${LIGHT.pg}; --ps-card: #fbf7ee; --ps-cline: ${LIGHT.hair};
  --ps-strip: ${LIGHT.band}; --ps-amber: #c9962b; --ps-amberl: #ecd9a4; --ps-ink: ${LIGHT.ink}; --ps-mut: ${LIGHT.mute}; --ps-lt: #d9cfba; --ps-k: #b3a68e; font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.sheet.pcs .ps-h2, .twod12-type .twod12.sheet.pcs .ps-bh b { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; color: ${LIGHT.ink}; }
.twod12-type .twod12.sheet.pcs .ps-block, .twod12-type .twod12.sheet.pcs .ps-box, .twod12-type .twod12.sheet.pcs .ps-box.big, .twod12-type .twod12.sheet.pcs .ps-tile, .twod12-type .twod12.sheet.pcs .ps-bxbtn, .twod12-type .twod12.sheet.pcs .ps-init,
.twod12-type .twod12.sheet.pcs .ps-bcard, .twod12-type .twod12.sheet.pcs .ps-rcard, .twod12-type .twod12.sheet.pcs .ps-irow, .twod12-type .twod12.sheet.pcs .ps-wb, .twod12-type .twod12.sheet.pcs .ps-lbox, .twod12-type .twod12.sheet.pcs .ps-mchip, .twod12-type .twod12.sheet.pcs .ps-seg, .twod12-type .twod12.sheet.pcs button { border-radius: 2px; }
.twod12-type .twod12.sheet.pcs .ps-block, .twod12-type .twod12.sheet.pcs .ps-bxbtn { box-shadow: none; }
.twod12-type .twod12.sheet.pcs .ps-bxbtn.ln { box-shadow: inset 4px 0 0 var(--lnf); } .twod12-type .twod12.sheet.pcs .ps-bxbtn.ln.ln-strike { box-shadow: inset 4px 0 0 var(--lnf), inset 8px 0 0 var(--tw-strike); }
/* the groups ("Once per round", "Reactions", "Level 1"...) are not boxed tables (Lucas, 2026-11-13): a heading on a rule, the rows under it
   on hairlines, the next group close below. The same elements; no frame, no filled header, no shadow, less space between groups. */
.twod12-type .twod12.sheet.pcs .ps-stack { gap: 4px; }
.twod12-type .twod12.sheet.pcs .ps-block { background: none; border: 0; border-radius: 0; box-shadow: none; overflow: visible; }
.twod12-type .twod12.sheet.pcs .ps-bh { background: none; padding: 5px 2px 2px; border-bottom: 1px solid #8a6d3b; }
.twod12-type .twod12.sheet.pcs .ps-block.esc .ps-bh, .twod12-type .twod12.sheet.pcs .ps-block.granted .ps-bh, .twod12-dark .twod12.sheet.pcs .ps-block.esc .ps-bh { background: none !important; }
.twod12-type .twod12.sheet.pcs .ps-block .ps-row:first-child, .twod12-type .twod12.sheet.pcs .ps-block .ps-brw:first-child .ps-brow { border-top: 0; }
.twod12-type .twod12.sheet.pcs .ps-row, .twod12-type .twod12.sheet.pcs .ps-brow { border-top-color: ${LIGHT.hair}; }
.twod12-type .twod12.sheet.pcs .ps-line { padding: 5px 2px; } .twod12-type .twod12.sheet.pcs .ps-brow { padding: 5px 2px; }
.twod12-type .twod12.sheet.pcs .ps-colh { padding: 0 2px 2px; }
.twod12-type .twod12.sheet.pcs .ps-dot { border-radius: 0; transform: rotate(45deg); width: 7px; height: 7px; }
.twod12-type .twod12.sheet.pcs .ps-pill { border-radius: 3px; }
.twod12-type .twod12.sheet.pcs .ps-roleseg, .twod12-type .twod12.sheet.pcs .nb-stat, .twod12-type .twod12.sheet.pcs .nb-sum { border-radius: 2px; }
.twod12-type .twod12.sheet.pcs .ps-roleseg { border-color: #2b2520; } .twod12-type .twod12.sheet.pcs .ps-roleseg button { color: #2b2520; background: #fbf7ee; }
.twod12-type .twod12.sheet.pcs .ps-roleseg button.on { background: #2b2520; color: #f4ede0; }
/* a block's head with a note and a button (the Builder's "Damage: Immune, Resist and Weak"): the title, the note after it, the button at the right */
.twod12-type .twod12.sheet.pcs .ps-bh { flex-wrap: wrap; }
.twod12-type .twod12.sheet.pcs .ps-bh > .ps-dladd { order: 3; margin-left: auto; width: auto; padding: 1px 10px; }
.twod12-type .twod12.sheet.pcs .ps-bh > .ps-bsub { order: 2; font-style: italic; }
.twod12-type .twod12.sheet.pcs .ps-main .ps-dladd { color: ${LIGHT.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-main .ps-dladd { color: ${T.ink}; }
/* "+ Add" on the side panel: an outlined button, as the others there (it was a white bar) */
.twod12-type .twod12.sheet.pcs .ps-dladd { background: transparent; color: #ecd9a4; border: 1px solid #8c7d63; }
/* the Species and Class chips wrap to a second line (the last one was cut off at the card's edge) */
.twod12-type .twod12.sheet.pcs .ps-chips { flex-wrap: wrap; overflow: visible; row-gap: 4px; }
/* the grey group diamonds (Level 1, Next levels) take the gold */
.twod12-type .twod12.sheet.pcs .ps-dot[style*="#6b665a"] { background: ${LIGHT.gold} !important; }
.twod12-dark .twod12.sheet.pcs .ps-dot[style*="#6b665a"] { background: ${T.gold} !important; }
.twod12-dark .twod12.sheet.pcs .ps-dladd { color: ${T.ink}; }
.twod12-type .twod12.sheet.pcs .ps-lvl, .twod12-type .twod12.sheet.pcs .ps-bch b, .twod12-type .twod12.sheet.pcs .ps-bch small { font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.sheet.pcs .ps-lvl, .twod12-type .twod12.sheet.pcs .ps-bch b { font-weight: 700; font-variant: small-caps; letter-spacing: .02em; }
.twod12-type .twod12.sheet.pcs .ps-use { background: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; border: 0; border-radius: 2px; box-shadow: none; font: 700 12.5px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; text-transform: none; }
.twod12-type .twod12.sheet.pcs .ps-use.rx { background: #1f7a72; color: #fff; }
.twod12-type .twod12.sheet.pcs .ps-init:not(.dis) { background: #ecd9a4; color: #2b2520; box-shadow: none; }
.twod12-type .twod12.sheet.pcs .ps-line[data-action="toggleCard"]:hover, .twod12-type .twod12.sheet.pcs .ps-brow[data-action="toggleCard"]:hover { background: ${LIGHT.pg2}; }
/* THE CAROUSEL, both themes: Signika in the place of Cinzel, square corners; light keeps its parchment cards, its bar the warm dark brown. */
.twod12-type #twod12-carousel { --tp-navy: #2b2520; --tp-navy2: #3a3229; --tp-parch: #f4ede0; --tp-parch2: #eae0c8; --tp-border: #bfae8c; --tp-ink: ${LIGHT.ink}; --tp-mut: ${LIGHT.mute}; --tp-gold: ${LIGHT.gold}; }
.twod12-type #twod12-carousel .tc-head.tc-bar { font: 600 13px "Source Sans 3", sans-serif; letter-spacing: 0; border-color: #1a1612; border-radius: 3px; }
.twod12-type #twod12-carousel .tc-round { font: 700 14px "Source Sans 3", sans-serif; font-variant: small-caps; font-style: normal; letter-spacing: .02em; }
.twod12-type #twod12-carousel .tc-bar .tc-btn { font: 700 12px "Source Sans 3", sans-serif; letter-spacing: 0; text-transform: none; font-variant: normal; background: transparent; border: 1px solid #8c7d63; border-radius: 2px; color: #f4ede0; }
.twod12-type #twod12-carousel .tp { border-radius: 3px; }
.twod12-type #twod12-carousel .tp-band { font: 700 11px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .06em; text-transform: none; }
.twod12-type #twod12-carousel .tp-name { font: 700 12.5px "Source Sans 3", sans-serif; letter-spacing: 0; text-transform: none; font-variant: normal; }
/* THE ITEM SHEETS (an Action's, an Effect's, a Feature's: the editor), both themes: the warm dark brown for the head, gold for amber and maroon,
   Signika headings on a rule in the place of the Cinzel gradient bars, square corners, the chosen option filled as the stamp. */
.twod12-type .application.twod12-styled { --sk-navy: #2b2520; --sk-amber: #c9962b; --sk-acc: ${LIGHT.gold}; --sk-par: ${LIGHT.pg}; --sk-panel: #fbf7ee; --sk-line: ${LIGHT.hair}; --sk-ink: ${LIGHT.ink}; --sk-mut: ${LIGHT.mute}; }
.twod12-type .application .fr-tab { --fr-navy: ${LIGHT.stamp}; --fr-gold: #c9962b; --fr-maroon: ${LIGHT.ink}; --fr-goldsoft: transparent; --fr-line: ${LIGHT.hair}; --fr-par2: ${LIGHT.pg2}; --fr-field: #fbf7ee; --fr-ink: ${LIGHT.ink}; --fr-mut: ${LIGHT.mute}; font-family: "Source Sans 3", sans-serif; }
.twod12-type .application.twod12-styled .sk .head .name { font: 700 20px "Source Sans 3", sans-serif; }
.twod12-type .application.twod12-styled .sk .head img { border-radius: 2px; }
/* the class's Levels window (the editor inside the class window) */
.twod12-dark.twod12-dark .classwin .at-body { color: #f08a8a; } .twod12-dark.twod12-dark .classwin .at-mind { color: #8fb3ee; } .twod12-dark.twod12-dark .classwin .at-appeal { color: #e3c15a; } .twod12-dark.twod12-dark .classwin .at-instinct { color: #7fcf95; }
.twod12-type .classwin .at-body { color: #7a1626; font-weight: 600; } .twod12-type .classwin .at-mind { color: #17327a; font-weight: 600; } .twod12-type .classwin .at-appeal { color: #6b4e00; font-weight: 600; } .twod12-type .classwin .at-instinct { color: #14532d; font-weight: 600; }
.twod12-type .application.classwin .cw-ttl img { border-radius: 2px; } .twod12-type .application.classwin .cw-head h1 small { font: 600 13px "Source Sans 3", sans-serif; letter-spacing: 0; text-transform: none; }
.twod12-type .application.classwin .ce-lvb { border-radius: 0; border-color: #8c7d63; background: transparent; font-family: "Source Sans 3", sans-serif; } .twod12-type .application.classwin .ce-lvb[aria-pressed="true"] { background: ${LIGHT.stamp}; border-color: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; }
.twod12-type .application.classwin .ce-sec { border-radius: 0; border: 0; border-top: 2px solid ${LIGHT.rule}; background: none; } .twod12-type .application.classwin .ce-sh { border-radius: 0; background: none; padding: 6px 0; border-bottom: 1px solid ${LIGHT.hair}; }
.twod12-type .application.classwin .ce-sh input.ce-title { border: 0; border-radius: 0; background: transparent; color: ${LIGHT.ink}; font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; padding: 0 2px; }
.twod12-type .application.classwin .ce-sb { padding: 6px 0; gap: 0; } .twod12-type .application.classwin .ce-row { border: 0; border-bottom: 1px solid ${LIGHT.hair}; border-radius: 0; background: none; padding: 4px 2px; }
.twod12-type .application.classwin .ce-pair { padding: 3px 2px; } .twod12-type .application.classwin .ce-drop { border-radius: 0; border: 1px dashed ${LIGHT.hair}; margin-top: 6px; padding: 5px 8px; font-size: 12.5px; }
.twod12-type .application.classwin .ce-prev { border-top: 0; padding: 2px 2px 6px; } .twod12-type .application.classwin .ce-x { border: 0; border-radius: 0; background: none; color: ${LIGHT.mute}; }
.twod12-type .application.classwin .ce-btn { border-radius: 0; border-color: #8c7d63; background: transparent; font-family: "Source Sans 3", sans-serif; }
.twod12-type .application.classwin .ce-lib h2 { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; text-transform: none; color: ${LIGHT.ink}; border-bottom: 1px solid ${LIGHT.rule}; padding-bottom: 2px; }
.twod12-type .application.classwin .ce-lib h4 { font: 700 12.5px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .04em; text-transform: none; margin: 10px 0 0; }
.twod12-type .application.classwin .ce-li { border: 0; border-bottom: 1px solid ${LIGHT.hair}; border-radius: 0; background: none; margin: 0; padding: 4px 2px; }
.twod12-type .application.classwin .ce-sh select, .twod12-type .application.classwin .ce-pair select, .twod12-type .application.classwin .ce-drop select, .twod12-type .application.classwin .ce-num input { border-radius: 0; }
.twod12-dark .application.classwin .ce-lvb { color: ${T.ink}; } .twod12-dark .application.classwin .ce-lvb[aria-pressed="true"] { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .application.classwin .ce-sec { border-top-color: ${T.rule}; } .twod12-dark .application.classwin .ce-sh, .twod12-dark .application.classwin .ce-row, .twod12-dark .application.classwin .ce-li { border-color: ${T.hair}; } .twod12-dark .application.classwin .ce-drop { border-color: ${T.hair}; }
.twod12-dark .application.classwin .ce-sh input.ce-title, .twod12-dark .application.classwin .ce-lib h2 { color: ${T.ink}; } .twod12-dark .application.classwin .ce-lib h2 { border-color: ${T.rule}; } .twod12-dark .application.classwin .ce-x { color: ${T.mute}; } .twod12-dark .application.classwin .ce-btn { color: ${T.ink}; }
/* the Levels window, with color (Lucas, 2026-11-13: "everything looks too equal, difficult to see when a section starts and ends") */
.twod12-type .application.classwin .ce { --lv-pg: ${LIGHT.pg}; --lv-mix: 0%; } .twod12-dark .application.classwin .ce { --lv-pg: ${T.pg}; --lv-mix: 55%; }
.twod12-type.twod12-type .application.classwin .ce-left { gap: 16px; }
.twod12-type.twod12-type .application.classwin .ce-sec { border: 0; border-left: 4px solid var(--sc, #8c7d63); background: color-mix(in srgb, var(--sc, #8c7d63) 7%, var(--lv-pg)); }
.twod12-type.twod12-type .application.classwin .ce-sh { padding: 6px 10px; border-bottom: 0; background: color-mix(in srgb, var(--sc, #8c7d63) 24%, var(--lv-pg)); }
.twod12-type.twod12-type .application.classwin .ce-sb { padding: 6px 10px 8px; } .twod12-type.twod12-type .application.classwin .ce-prev { padding: 5px 10px; border-top: 1px solid color-mix(in srgb, var(--sc, #8c7d63) 30%, var(--lv-pg)); background: color-mix(in srgb, var(--sc, #8c7d63) 13%, var(--lv-pg)); }
.twod12-type.twod12-type .application.classwin .ce-row { border-bottom-color: color-mix(in srgb, var(--sc, #8c7d63) 28%, var(--lv-pg)); }
.twod12-type.twod12-type .application.classwin .ce-row .ty[style] { color: color-mix(in srgb, var(--fq), #fff var(--lv-mix)); font-weight: 600; }
.twod12-type.twod12-type .application.classwin .ce-lib h4 { margin: 12px 0 2px; padding: 3px 8px; border-left: 4px solid var(--fq, #8c7d63); background: color-mix(in srgb, var(--fq, #8c7d63) 24%, var(--lv-pg)); color: color-mix(in srgb, var(--fq, #8c7d63), #fff var(--lv-mix)); }
.twod12-type.twod12-type .application.classwin .ce-li { padding: 4px 2px 4px 12px; }
/* the encounter log and the Generate window */
.twod12-type .enclog .el-round { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .03em; border-bottom: 1px solid ${LIGHT.rule}; color: ${LIGHT.ink}; }
.twod12-type .enclog .el-turn { border-left: 2px solid ${LIGHT.rule}; border-radius: 0; background: none; padding: 2px 8px; } .twod12-type .enclog .el-own { color: ${LIGHT.ink}; }
.twod12-type .enclog .el-bar button { border: 1px solid #8c7d63; border-radius: 0; background: transparent; color: inherit; font: 600 12px "Source Sans 3", sans-serif; }
.twod12-dark .enclog .el-turn { background: none; } .twod12-dark .enclog-app .window-content { background: ${T.pg}; color: ${T.ink}; } .twod12-dark .enclog .el-bar { background: ${T.pg2}; border-color: ${T.hair}; } .twod12-dark .enclog .el-abbr { border-color: ${T.hair}; }
.twod12-dark .enclog .el-bar label, .twod12-dark .enclog .el-abbr label, .twod12-dark .enclog .el-line, .twod12-dark .enclog .el-own, .twod12-dark .enclog .el-round { color: ${T.ink}; } .twod12-dark .enclog .el-round, .twod12-dark .enclog .el-turn { border-color: ${T.rule}; }
.twod12-dark .enclog .el-line > a { color: ${T.mute}; } .enclog .el-line > i svg, .enclog a svg, .enclog button svg { width: 1em; height: 1em; fill: currentColor; vertical-align: -.125em; } .twod12-dark .enclog .el-line > i { color: ${T.gold}; opacity: 1; } .twod12-dark .enclog .el-line > a, .twod12-dark .enclog .el-own a { color: ${T.mute}; opacity: 1; } .twod12-dark .enclog .el-line.k-dmg, .twod12-dark .enclog .el-line.k-down { color: #f0958a; } .twod12-dark .enclog .el-line.k-heal { color: #6fd0c4; }
.twod12-type .application.twod12-gencard h4.gc-h { font: 700 13px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .03em; color: ${LIGHT.ink}; }
.twod12-type .application.twod12-builder .bb-cap { font: 700 13px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .03em; text-transform: none; }
.twod12-type .application.twod12-gencard ul.gc-lines, .twod12-type .application.twod12-gencard .fr-tab .fr-ta.gc-text { border-radius: 0; }
.twod12-type .application.twod12-builder .bb-foot .fr-q { border-radius: 0; }
.twod12-type.twod12-type .application.twod12-styled .sk .bb-foot button { border-radius: 0; border: 1px solid #8c7d63; background: transparent; color: ${LIGHT.ink}; font: 600 13px "Source Sans 3", sans-serif; }
.twod12-type.twod12-type .application.twod12-styled .sk .bb-foot button.bb-go { background: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; border-color: ${LIGHT.stamp}; }
.twod12-dark.twod12-dark .application.twod12-styled .sk .bb-foot button { color: ${T.ink}; } .twod12-dark.twod12-dark .application.twod12-styled .sk .bb-foot button.bb-go { background: ${T.stamp}; color: ${T.stampInk}; border-color: ${T.stamp}; }
.twod12-dark .application.twod12-gencard h4.gc-h { color: ${T.ink}; } .twod12-dark .application.twod12-gencard ul.gc-lines { background: ${T.pg2}; border-color: ${T.hair}; } .twod12-dark .application.twod12-gencard ul.gc-lines li.no { background: none; } .twod12-dark .application.twod12-gencard ul.gc-lines li.no > span { color: ${T.gold}; }
.twod12-type .application .fr-tab .fr-sec > h3 { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; background: none; border-left: 0; border-bottom: 1px solid #8a6d3b; padding: 2px 0; color: ${LIGHT.ink}; }
.twod12-type .application .fr-tab .as-h4 { font-family: "Source Sans 3", sans-serif; font-variant: small-caps; color: ${LIGHT.gold}; }
.twod12-type .application .fr-tab .as-tl, .twod12-type .application .fr-tab .as-railh, .twod12-type .application .fr-tab .fr-dropped b { font-family: "Source Sans 3", sans-serif; }
.twod12-type .application .fr-tab .as-tl { font-weight: 700; font-variant: small-caps; font-size: 14px; }
.twod12-type .application .fr-tab .as-tier.t2 { --tc: ${LIGHT.t2}; }
.twod12-type .application .fr-tab button, .twod12-type .application .fr-tab input, .twod12-type .application .fr-tab select, .twod12-type .application .fr-tab textarea, .twod12-type .application .fr-tab .fr-seg, .twod12-type .application .fr-tab .fr-chip, .twod12-type .application .fr-tab .as-tier, .twod12-type .application .fr-tab .as-flow, .twod12-type .application .fr-tab .fr-part, .twod12-type .application .fr-tab .fr-dropped, .twod12-type .application .fr-tab .fr-drop, .twod12-type .application .fr-tab .as-prev, .twod12-type .application .fr-tab .fr-tog { border-radius: 2px; }
.twod12-type .application.twod12-styled .sk .as-tab button.as-vtab.on { background: ${LIGHT.stamp}; border-color: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; }
/* THE WINDOWS (the pick window, the class window, the roll dialog): Signika for the title (no Cinzel), a band for the header in the place of navy,
   gold in the place of the class window's orange, the confirm button as the stamp. Style only. */
.twod12-type .application.classwin { --cw-navy: ${LIGHT.band}; --cw-navy2: ${LIGHT.pg2}; --cw-paper: ${LIGHT.pg}; --cw-paper2: ${LIGHT.pg2}; --cw-card: #fbf7ee; --cw-ink: ${LIGHT.ink}; --cw-mut: ${LIGHT.mute};
  --cw-line: ${LIGHT.hair}; --cw-acc: ${LIGHT.gold}; --cw-orange: ${LIGHT.gold}; --cw-chosen: ${LIGHT.band}; --cw-band: ${LIGHT.band}; --cw-head: ${LIGHT.gold}; font-family: "Source Sans 3", sans-serif; }
.twod12-type .application.classwin .cw-head { border-bottom: 1px solid #8a6d3b; }
.twod12-type .application.classwin .cw-head, .twod12-type .application.classwin .cw-head h1, .twod12-type .application.classwin .cw-head small, .twod12-type .application.classwin .cw-stats, .twod12-type .application.classwin .cw-stats b { color: ${LIGHT.ink}; }
.twod12-type .application.classwin .cw-head h1 { font: 700 18px "Source Sans 3", sans-serif; letter-spacing: 0; }
.twod12-type .application.classwin .cw-icon { color: ${LIGHT.gold}; }
.twod12-type .application.classwin .cw-sec h2 { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; text-transform: none; }
.twod12-type .application.classwin .cw-btn, .twod12-type .application.classwin .cw-seg button { border-radius: 2px; font-family: "Source Sans 3", sans-serif; }
.twod12-type .application.classwin .cw-btn.primary, .twod12-type .application.classwin .cw-seg button[aria-pressed="true"] { background: ${LIGHT.stamp}; border-color: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; }
.twod12-type .application.classwin .cw-seg button[aria-pressed="true"] * { color: inherit; }
/* the options: each its own outlined button, never wrapping its words; the chosen one is filled (no check mark, so nothing moves when it is picked) */
.twod12-type .application.classwin .cw-seg { display: flex; flex-wrap: wrap; gap: 6px; border: 0; border-radius: 0; background: none; overflow: visible; }
.twod12-type .application.classwin .cw-seg button, .twod12-type .application.classwin .cw-seg button + button { border: 1px solid #8c7d63; border-radius: 2px; background: transparent; padding: 0 12px; min-height: 28px; min-width: 76px; line-height: 1.2; white-space: nowrap; box-shadow: none; color: ${LIGHT.ink}; }
.twod12-type .application.classwin .cw-seg button > i.fa-check { display: none; }
/* a choice with no label (one option per line): a list of full-width buttons, the text on the left */
.twod12-type .application.classwin .cw-attr > .cw-seg:only-child { flex: 1 1 100%; flex-direction: column; flex-wrap: nowrap; gap: 5px; }
.twod12-type .application.classwin .cw-attr > .cw-seg:only-child button { width: 100%; min-height: 32px; text-align: left; justify-content: flex-start; padding: 0 12px; }
.twod12-type .application.classwin .cw-seg button[aria-pressed="true"] { box-shadow: none; }
.twod12-type .application.classwin .cw-attr > span { color: ${LIGHT.ink}; font-weight: 600; }
.twod12-type .application.classwin .cw-btn { min-height: 28px; min-width: 84px; padding: 0 14px; }
.twod12-type .application.classwin .cw-sec h2 { border-left: 0; background: none; padding: 0 0 2px; border-bottom: 1px solid #8a6d3b; color: ${LIGHT.gold}; }
.twod12-type .twod12.rolldlg { font-family: "Source Sans 3", sans-serif; --cc-title: "Source Sans 3", sans-serif; --cc-t2: #e4dd80; --cc-t2i: #423d00; }
.twod12-type .twod12.rolldlg .rd-name { font: 700 18px "Source Sans 3", sans-serif; letter-spacing: 0; }
.twod12-type .twod12.rolldlg .rd-go { border-radius: 2px; }
/* the roll dialog's Tier rows: the yellower Tier 2 (its own rules set these colors with !important) */
.twod12-type .twod12.rolldlg .rd-tiers tr.t2 th { background: ${LIGHT.t2bg} !important; color: ${LIGHT.t2}; box-shadow: inset 4px 0 0 ${LIGHT.t2n}, inset -1px 0 0 #dcd6a4; }
/* THE OTHER CHAT MESSAGES in the chat card's look (style only): no navy bars, no orange line, no Cinzel; a heading is a band or a bold line. */
.twod12-type .twod12.chat.rx2 { border-radius: 5px; border-color: #bfae8c; background: ${LIGHT.pg}; color: ${LIGHT.ink}; }
.twod12-type .twod12.chat.rx2 .rx-hd { background: ${LIGHT.band}; color: ${LIGHT.ink}; border-bottom: 1px solid ${LIGHT.hair}; font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; }
.twod12-type .twod12.chat.rx2.rxused .rxu-txt, .twod12-type .twod12.chat.rx2.rxused .rxu-txt b { color: ${LIGHT.ink}; }
.twod12-type .twod12.chat.rx2 .rx-base { background: ${LIGHT.band}; color: ${LIGHT.ink}; border: 1px solid ${LIGHT.hair}; }
.twod12-type .twod12.chat.rx2 .rx-it.rx-base, .twod12-type .twod12.chat.rx2 .rx-it.rx-base .rx-bw b, .twod12-type .twod12.chat.rx2 .rx-tm { color: ${LIGHT.ink}; }
.twod12-type .twod12.chat.rx2 .rx-it.rx-base { background: ${LIGHT.band}; border-color: ${LIGHT.hair}; }
.twod12-type .twod12.chat select { background: transparent; color: ${LIGHT.ink}; border: 1px solid #8c7d63; border-radius: 2px; font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat.rx2 .rx-hd .rx-hb { background: transparent; border: 1px solid #8c7d63; color: ${LIGHT.ink}; border-radius: 2px; }
.twod12-type .twod12.chat.initcard > .orn { display: none; }
.twod12-type .twod12.chat.action.sysmsg.initcard { padding: 0 0 4px; overflow: hidden; }
.twod12-type .twod12.chat.action.sysmsg.initcard > .ahead { background: ${LIGHT.band} !important; border-bottom: 1px solid ${LIGHT.hair} !important; padding: 4px 8px; margin: 0; justify-content: center; }
.twod12-type .twod12.chat.action.sysmsg.initcard > .ahead > b { flex: none; text-align: center; font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; }
.twod12-type .twod12.chat.action.sysmsg.initcard > .ahead > .aright:empty, .twod12-type .twod12.chat.action.sysmsg.initcard > .ahead > .aright { display: none; }
.twod12-type .twod12.chat.initcard .ic-band { font: 700 13.5px/1.2 "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .03em; text-transform: none; }
.twod12-type .twod12.chat.initcard .ic-name { font: 600 13.5px/1.3 "Source Sans 3", sans-serif; letter-spacing: 0; color: ${LIGHT.ink}; }
.twod12-type .twod12.chat.dmg { background: ${LIGHT.pg}; border: 1px solid #bfae8c; border-radius: 5px; color: ${LIGHT.ink}; font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat.dmg > .ahead { background: none !important; color: inherit !important; border: 0 !important; border-bottom: 1px solid ${LIGHT.hair} !important; }
.twod12-type .twod12.chat.dmg > .ahead * { color: inherit !important; }
.twod12-type .twod12.chat.dmg.multi .mdl { font: 700 14px "Source Sans 3", sans-serif; font-variant: small-caps; }
.twod12-type .twod12.chat .dbtns button, .twod12-type .twod12.chat .dbtns select { background: transparent; color: ${LIGHT.ink}; border: 1px solid #8c7d63; border-radius: 2px; box-shadow: none; font-family: "Source Sans 3", sans-serif; }
.twod12-type .twod12.chat .dbtns button:first-child { background: ${LIGHT.stamp}; border-color: ${LIGHT.stamp}; color: ${LIGHT.stampInk}; }
.twod12-type .twod12.chat.turnend > summary { background: ${LIGHT.band}; color: ${LIGHT.ink}; border-bottom: 1px solid ${LIGHT.hair}; }
.twod12-type .twod12.chat.turnend .td-ttl { font: 700 14.5px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; text-transform: none; }
.twod12-type .twod12-dock { background: ${LIGHT.pg}; color: ${LIGHT.ink}; border: 1px solid #bfae8c; border-radius: 5px; box-shadow: none; font-size: 13px; }
.twod12-type .twod12-dock .td-hd { background: ${LIGHT.band}; color: ${LIGHT.ink}; border-bottom: 1px solid ${LIGHT.hair}; min-height: 28px; padding: 3px 8px 3px 10px; gap: 8px; }
.twod12-type .twod12-dock:not(.open) .td-hd { border-bottom: 0; }
.twod12-type .twod12-dock .td-ttl { font-size: 15px; } .twod12-type .twod12-dock .td-who { font-size: 14px; } .twod12-type .twod12-dock .td-rd { color: ${LIGHT.mute}; opacity: 1; font-size: 12px; }
.twod12-type .twod12-dock .td-who { color: ${LIGHT.ink}; }
.twod12-type .twod12-dock .td-pips i, .twod12-type .twod12.chat.turnend .td-pips i { background: rgba(42, 36, 29, .2); }
.twod12-type .twod12-dock .td-pips i.on, .twod12-type .twod12.chat.turnend .td-pips i.on { background: #3b4cb8; }
.twod12-type .twod12-dock .td-pips i.r.on, .twod12-type .twod12.chat.turnend .td-pips i.r.on { background: #b07a12; }
.twod12-type .twod12.chat.follow i[data-ic^="shield"] { color: #2f6fb3; }
/* Tier 2, more yellow (Lucas): still a green, toward yellow. The light theme's values; the dark set has its own. */
.twod12-type .twod12.acard.d2 table.ap-tt tr.t2 { --c: ${LIGHT.t2}; --bg: ${LIGHT.t2bg}; --n: ${LIGHT.t2n}; }
.twod12-type .twod12.chat.cc { --cc-t2: #e4dd80; --cc-t2i: #423d00; }
.twod12-type .twod12.chat.cc .cc-srow.t2 { --c: #857c12; --n: ${LIGHT.t2n}; --bg: ${LIGHT.t2bg}; }
`;

/* ------------------------------------------------------------------ the dark sets */
const surfaces = pick => ({
  card: pick(/\.acard\.d2/),
  chat: pick(/\.twod12\.chat\.(cc|sysmsg|sysline|action|turnend)\b|\.twod12\.chat \.(ahead|apmark)|\.twod12\.chat > \.ahead/),
  older: pick(/\.twod12\.chat\b/).filter(b => !/\.twod12\.chat\.(cc|sysmsg|sysline|action|turnend)\b|\.twod12\.chat \.(ahead|apmark)|\.twod12\.chat > \.ahead/.test(selOf(b))),
  dock: pick(/twod12-dock\b|\.twod12 \.td-/),
  bars: pick(/twod12-(linebar|pickbar)\b/),
  pcs: pick(/\.sheet\.pcs\b|twod12-actor|\.twod12\.sheet(?![.\w-])|^\s*\.twod12 \.|\.hpnum|\.autodia|\.np-guardbtn|\.np-track/),
  car: pick(/#twod12-carousel/),
  tools: pick(/enclog|\.el-|twod12-builder|twod12-gencard|\.gc-|\.bb-/),
  item: pick(/twod12-styled|\.twod12\.sheet\.item|\.sheet\.sk\b|\.fr-|\.as-|\.twod12\.sheet(?![.\w-])|^\s*\.twod12 \./),
  wins: pick(/\.classwin\b|\.pickwin\b|\.twod12\.rolldlg\b|\.trhl\b|\.trgrp\b|\.twod12 \.kw-/)
});
const BY_HAND = `
/* ---- by hand: the Action card (the frame, the cost stamps, the Tier table's head, the book links) */
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
.twod12-dark .twod12.acard.d2 table.ap-tt tr.t2 { --c: ${T.t2}; --bg: ${T.t2bg}; --n: ${T.t2n}; }
.twod12-dark .twod12.acard.d2 a.twod12-inline.book, .twod12-dark .twod12.acard.d2 a.content-link { border: 0; border-bottom: 1px dashed ${T.gold}; background: none; color: ${T.gold}; }
.twod12-dark .twod12.acard.d2 .ap-ac .pg, .twod12-dark .twod12.acard.d2 .ap-freq { color: #fff; }
.twod12-dark .twod12.acard.d2 .ap-fxh { color: ${T.gold}; }
/* ---- by hand: the chat cards (their variables, the primary button as the stamp, the pills) */
.twod12-dark .twod12.chat.cc { --cc-bg: ${T.pg}; --cc-line: ${T.rule}; --cc-ink: ${T.ink}; --cc-mute: ${T.mute}; --cc-panel: ${T.band}; --cc-gold: ${T.gold}; --cc-gline: ${T.hair};
  --cc-t1: #8f2a22; --cc-t1p: ${T.t1bg}; --cc-t1i: ${T.t1}; --cc-t2: #453f18; --cc-t2i: ${T.t2}; --cc-t3: #2f6b3a; --cc-crit: #2f6fb8; --cc-critp: rgba(141,184,240,.3); --cc-criti: ${T.crit};
  --cc-plus: ${T.boon}; --cc-minus: ${T.bane}; --cc-vig: ${T.vig}; --cc-res: ${T.res}; --cc-btn: ${T.stamp}; --cc-btn2: #8c7d63; color: ${T.ink}; }
.twod12-dark .twod12.chat.cc .cc-card { background: ${T.pg}; }
.twod12-dark .twod12.chat.cc .cc-btn.primary { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; border-radius: 2px; }
.twod12-dark .twod12.chat.cc .cc-card .cc-btn.primary:hover { background: ${T.stampHover}; color: ${T.stampInk}; }
.twod12-dark .twod12.chat.cc .cc-btn, .twod12-dark .twod12.chat.cc .cc-icon, .twod12-dark .twod12.chat.cc .cc-adj { border-radius: 2px; }
.twod12-dark .twod12.chat.cc .cc-cost { color: #fff; }
.twod12-dark .twod12.chat.cc .cc-seg.s3.lit, .twod12-dark .twod12.chat.cc .cc-stamp.t3, .twod12-dark .twod12.chat.cc .cc-pill.t3 { color: #f1f7ec; }
.twod12-dark .twod12.chat.cc .cc-srow { --c: #8f2a22; --bg: ${T.t1bg}; --n: #8f2a22; border-bottom-color: ${T.hair}; color: ${T.ink}; }
.twod12-dark .twod12.chat.cc .cc-srow > :first-child, .twod12-dark .twod12.chat.cc .cc-srow > :first-child * { color: #fff !important; opacity: 1; }
.twod12-dark .twod12.chat.cc .cc-pools, .twod12-dark .twod12.chat.cc .cc-poolrow, .twod12-dark .twod12.chat.cc .cc-ptot { color: ${T.ink}; }
.twod12-dark .twod12.chat.cc .cc-card .cc-pools:hover { background: ${T.pg2}; }
.twod12-dark .twod12.chat.cc button { color: ${T.ink}; }
.twod12-dark .twod12.chat.cc .cc-stamp.t1 { color: #fff; }
.twod12-dark .twod12.chat.cc .cc-srow.t2 { --c: #7d7414; --bg: ${T.t2bg}; --n: ${T.t2n}; }
.twod12-dark .twod12.chat.cc .cc-srow.t3 { --c: #2f6b3a; --bg: ${T.t3bg}; }
.twod12-dark .twod12.chat.cc .cc-sub { color: #e3ba62 !important; }
.twod12-dark .twod12.chat.cc .cc-stotal { background: ${T.stamp}; color: ${T.stampInk}; }
/* ---- by hand: the system messages and the older Action head (a band, not a navy bar) */
.twod12-dark .twod12.chat.action, .twod12-dark .twod12.chat.sysline, .twod12-dark .twod12.chat.action.sysmsg { background: ${T.pg}; border-color: ${T.rule}; color: ${T.ink}; }
.twod12-dark .twod12.chat.action > .ahead { background: ${T.band} !important; color: ${T.ink}; border-bottom: 1px solid ${T.rule}; }
.twod12-dark .twod12.chat.action.sysmsg > .ahead { background: none !important; border-bottom: 1px solid ${T.hair} !important; }
.twod12-dark .twod12.chat.sysline > i { color: ${T.gold}; }
.twod12-dark .twod12.chat.sysline > i[data-ic^="shield"], .twod12-dark .twod12.chat .kw-guard { color: #7fb4ee; }
/* the ladder: every segment's range can be read when it is not the lit one */
.twod12-dark .twod12.chat.cc .cc-seg.s1 { background: rgba(143, 42, 34, .38); color: #f3a79e; } .twod12-dark .twod12.chat.cc .cc-seg.s1.lit { background: #8f2a22; color: #fff; }
.twod12-dark .twod12.chat.cc .cc-seg.s2 { background: rgba(140, 130, 24, .32); color: #e0d65a; } .twod12-dark .twod12.chat.cc .cc-seg.s2.lit { background: #7d7414; color: #fff; }
.twod12-dark .twod12.chat.cc .cc-seg.s3 { background: rgba(47, 107, 58, .38); color: #8fd69b; } .twod12-dark .twod12.chat.cc .cc-seg.s3.lit { background: #2f6b3a; color: #fff; }
.twod12-dark .twod12.chat .kw-bane { color: ${T.bane}; } .twod12-dark .twod12.chat .kw-boon { color: ${T.boon}; }
/* ---- by hand: the other chat messages */
.twod12-dark .twod12.chat.rx2, .twod12-dark .twod12.chat.dmg { background: ${T.pg}; border-color: ${T.rule}; color: ${T.ink}; }
.twod12-dark .twod12.chat.rx2 .rx-hd, .twod12-dark .twod12.chat.rx2 .rx-base, .twod12-dark .twod12.chat.turnend > summary { background: ${T.band}; color: ${T.ink}; border-color: ${T.hair}; }
.twod12-dark .twod12.chat.rx2.rxused .rxu-txt, .twod12-dark .twod12.chat.rx2.rxused .rxu-txt b, .twod12-dark .twod12.chat.rx2 .rx-it.rx-base, .twod12-dark .twod12.chat.rx2 .rx-it.rx-base .rx-bw b, .twod12-dark .twod12.chat.rx2 .rx-tm { color: ${T.ink}; }
.twod12-dark .twod12.chat.rx2 .rx-it.rx-base { background: ${T.band}; border-color: ${T.hair}; }
.twod12-dark .twod12.chat select { background: ${T.pg2}; color: ${T.ink}; border: 1px solid #8c7d63; }
/* the AP blue, the movement green and the Guard blue on the dark page (the Turn dock's and the End of Turn line's rows) */
.twod12-dark .twod12 .td-tl .td-ic.ap, .twod12-dark .twod12 .td-tl .td-c.ap { color: #9aa7ff; }
.twod12-dark .twod12 .td-tl .td-ic.mv { color: #b9dc6a; } .twod12-dark .twod12 .td-tl .td-ic.rx { color: #e6bd5a; }
.twod12-dark .twod12 .td-tl .td-ic.guard, .twod12-dark .twod12 .td-tl .td-g { color: #7fb4ee; }
.twod12-dark .twod12 .td-tl .tk-pips i.on { background: #9aa7ff; }
.twod12-dark .twod12 .td-badge.tick { background: #232a4a; color: #9aa7ff; }
.twod12-dark .twod12.chat.rx2 .rx-hd .rx-hb { background: transparent; border: 1px solid #8c7d63; color: ${T.ink}; }
.twod12-dark .twod12.chat.initcard { --ic-foe: #8f2626; --ic-ally: #3b6d11; --ic-neutral: #6b6456; }
.twod12-dark .twod12.chat.initcard .ic-name { color: ${T.ink}; }
.twod12-dark .twod12.chat.action.sysmsg.initcard > .ahead { background: ${T.band} !important; border-bottom: 1px solid ${T.rule} !important; }
.twod12-dark .twod12.chat.dmg > .ahead { background: none !important; border-bottom: 1px solid ${T.hair} !important; }
.twod12-dark .twod12.chat .dbtns button, .twod12-dark .twod12.chat .dbtns select { background: transparent; color: ${T.ink}; border: 1px solid #8c7d63; }
.twod12-dark .twod12.chat .dbtns button:first-child { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .twod12.chat .dbtns select option { background: ${T.pg}; }
.twod12-dark .twod12.chat.dmg .mdsum, .twod12-dark .twod12.chat.dmg .mdsum * { color: ${T.ink}; }
.twod12-dark .twod12.chat.follow i[data-ic^="shield"] { color: #7fb4ee; }
.twod12-dark .twod12.chat.turnend .td-ttl, .twod12-dark .twod12.chat.turnend > summary { color: ${T.ink}; }
/* ---- by hand: the pick window / class window and the roll dialog (their variables; the confirm button as the stamp) */
.twod12-dark .application.classwin { --cw-navy: ${T.band}; --cw-navy2: ${T.pg2}; --cw-paper: ${T.pg}; --cw-paper2: ${T.pg2}; --cw-card: ${T.pg2}; --cw-ink: ${T.ink}; --cw-mut: ${T.mute};
  --cw-line: ${T.hair}; --cw-acc: ${T.gold}; --cw-orange: ${T.gold}; --cw-chosen: ${T.band}; --cw-band: ${T.band}; --cw-head: ${T.gold}; color-scheme: dark; background: ${T.pg}; color: ${T.ink}; }
.twod12-dark .application.classwin .cw-head { border-bottom: 1px solid ${T.rule}; color: ${T.ink}; }
.twod12-dark .application.classwin .cw-head h1, .twod12-dark .application.classwin .cw-head small, .twod12-dark .application.classwin .cw-stats, .twod12-dark .application.classwin .cw-stats b { color: ${T.ink}; }
.twod12-dark .application.classwin .cw-icon { color: ${T.gold}; }
.twod12-dark .application.classwin .cw-foot { background: ${T.pg2}; border-top: 1px solid ${T.rule}; color: ${T.mute}; }
.twod12-dark .application.classwin .cw-btn { background: transparent; color: ${T.ink}; border: 1px solid #8c7d63; border-radius: 2px; }
.twod12-dark .application.classwin .cw-btn.primary { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .application.classwin .cw-seg button, .twod12-dark .application.classwin .cw-seg button + button { background: transparent; color: ${T.ink}; border-color: #8c7d63; }
.twod12-dark .application.classwin .cw-attr > span { color: ${T.ink}; }
.twod12-dark .application.classwin .cw-sec h2 { border-bottom-color: ${T.rule}; }
.twod12-dark .trhl { color: var(--tc); background: color-mix(in srgb, var(--tc) 16%, transparent); }
.twod12-dark .application.classwin .cw-sub { color: ${T.ink}; }
/* the highlighter's colors on the dark page (the system's own light-on-dark values) */
.twod12-dark { --g-roll: #5fd3c8; --g-requires: #7db1f5; --g-kind: #f29272; --g-damage: #e8c25a; --g-keywords: #aeb0b5; --c-bane: #ff8f7a; --c-boon: #4cc3ff; --c-rally: #3fd8c4; --c-ap: #9aa7ff; --c-mv: #b9dc6a; }
.twod12-dark .application.classwin .cw-seg button[aria-pressed="true"] { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .application.classwin .cw-seg button[aria-pressed="true"] * { color: inherit; }
.twod12-dark .application.classwin .cw-sec h2 { color: ${T.gold}; }
.twod12-dark .application.classwin .cw-seg .neg { color: ${T.bad}; }
.twod12-dark .twod12.rolldlg { --cc-bg: ${T.pg}; --cc-line: ${T.rule}; --cc-ink: ${T.ink}; --cc-mute: ${T.mute}; --cc-panel: ${T.band}; --cc-gold: ${T.gold}; --cc-gline: ${T.hair};
  --cc-t1: #8f2a22; --cc-t1p: ${T.t1bg}; --cc-t1i: ${T.t1}; --cc-t2: #453f18; --cc-t2i: ${T.t2}; --cc-t3: #2f6b3a; --cc-crit: #2f6fb8; --cc-vig: ${T.vig}; --cc-res: ${T.res}; --cc-btn: ${T.stamp}; --cc-btn2: #8c7d63;
  --rd-box: ${T.pg2}; --rd-boxline: ${T.hair}; --rd-buff: #4d7a45; --rd-debuff: #8a4a42; --rd-label: ${T.mute}; --rd-boon: ${T.boon}; --rd-bane: ${T.bane}; background: ${T.pg}; color: ${T.ink}; }
.twod12-dark .twod12.rolldlg button, .twod12-dark .twod12.rolldlg select, .twod12-dark .twod12.rolldlg input { color: ${T.ink}; }
.twod12-dark .twod12.rolldlg select, .twod12-dark .twod12.rolldlg input { background: ${T.pg2}; border-color: #8c7d63; }
.twod12-dark .twod12.rolldlg .rd-go, .twod12-dark .twod12.rolldlg .rd-vers button[aria-pressed="true"] { background: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .twod12.rolldlg .rd-go { border-radius: 2px; }
.twod12-dark .twod12.rolldlg .rd-roll { background: ${T.pg2}; }
.twod12-dark .twod12.rolldlg .rd-cbox { background: ${T.pg}; border-color: ${T.hair}; }
.twod12-dark .twod12.rolldlg .rd-def { border-color: ${T.ink}; color: ${T.ink}; }
.twod12-dark .twod12.rolldlg .rd-vers button.cant { color: ${T.faint}; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.rd-eff th { background: ${T.band}; color: ${T.ink}; }
.twod12-dark .twod12.rolldlg .rd-lseg.t1, .twod12-dark .twod12.rolldlg .rd-lseg.t2, .twod12-dark .twod12.rolldlg .rd-lseg.t3 { color: #fff; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.t1 th { background: ${T.t1bg} !important; color: ${T.t1}; box-shadow: inset 4px 0 0 #b23a30, inset -1px 0 0 ${T.hair}; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.t2 th { background: ${T.t2bg} !important; color: ${T.t2}; box-shadow: inset 4px 0 0 ${T.t2n}, inset -1px 0 0 ${T.hair}; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.t3 th { background: ${T.t3bg} !important; color: ${T.t3}; box-shadow: inset 4px 0 0 #3f8f4c, inset -1px 0 0 ${T.hair}; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.crit th { background: ${T.critbg} !important; color: ${T.crit}; }
.twod12-dark .twod12.rolldlg .rd-tiers tr.rd-eff th { background: ${T.band} !important; color: ${T.ink}; box-shadow: inset 4px 0 0 #8c7d63, inset -1px 0 0 ${T.hair}; }
.twod12-dark .twod12.rolldlg .rd-tiers th, .twod12-dark .twod12.rolldlg .rd-tiers td { border-top-color: ${T.hair} !important; }
.twod12-dark .twod12.rolldlg { --cc-t1p: #8f2a22; --cc-t2: #7d7414; }
.twod12-dark .twod12.rolldlg .rd-ptag { background: #26331f; color: #aed79e; }
.twod12-dark .twod12.rolldlg .rd-step { color: ${T.gold}; }
.twod12-dark .twod12.rolldlg .rd-sub, .twod12-dark .twod12.rolldlg [class*="rd-"] .cc-sub { color: #e3ba62 !important; }
.twod12-dark .twod12.rolldlg .rd-cx:hover, .twod12-dark .twod12.rolldlg .rd-ci:hover { background: ${T.band}; }
.twod12-dark .twod12.rolldlg .rd-freq { color: #fff; }
/* v0.0.370 (Lucas: "the header of the roll dialog has old colors"): its window bar stays dark on the dark page (the swap had made it light) */
.twod12-dark .twod12.rolldlg .window-header { background: #15130f; color: ${T.ink}; border-bottom: 1px solid ${T.rule}; } .twod12-dark .twod12.rolldlg .window-header button { color: ${T.ink}; }
/* ---- by hand: the PC sheet (its variables: one dark page, the side panel a shade apart; the stamp; inputs) */
.twod12-dark .twod12.sheet.pcs { --ps-navy: ${T.pg}; --ps-cell: ${T.pg2}; --ps-edge: ${T.hair}; --ps-tile: ${T.pg2}; --ps-parch: #24201b; --ps-card: ${T.pg2}; --ps-cline: ${T.hair};
  --ps-strip: ${T.band}; --ps-amber: ${T.gold}; --ps-amberl: ${T.gold}; --ps-teal: #2fa59a; --ps-tealr: #2fa59a; --ps-ink: ${T.ink}; --ps-mut: ${T.mute}; --ps-lt: ${T.mute}; --ps-k: ${T.mute}; color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-side { border-right: 1px solid ${T.rule}; }
.twod12-dark .twod12.sheet.pcs .ps-block { background: none; border: 0; }
.twod12-dark .twod12.sheet.pcs .ps-bh { background: none; border-bottom-color: ${T.rule}; }
.twod12-dark .twod12.sheet.pcs .ps-row, .twod12-dark .twod12.sheet.pcs .ps-brow { border-top-color: ${T.hair}; }
.twod12-dark .twod12.sheet.pcs .ps-head { border-bottom: 1px solid ${T.rule}; }
.twod12-dark .twod12.sheet.pcs .ps-h2, .twod12-dark .twod12.sheet.pcs .ps-bh b { color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-tabs { border-bottom-color: ${T.rule}; }
.twod12-dark .twod12.sheet.pcs .ps-tabs .tabbtn { color: ${T.mute}; } .twod12-dark .twod12.sheet.pcs .ps-tabs .tabbtn.active { color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-use { background: ${T.stamp}; color: ${T.stampInk}; box-shadow: none; }
.twod12-dark .twod12.sheet.pcs .ps-use.rx { background: #1f7a72; color: #fff; }
.twod12-dark .twod12.sheet.pcs .ps-wb { background: ${T.pg2}; }
.twod12-dark .twod12.sheet.pcs .ps-sec.line, .twod12-dark .twod12.sheet.pcs .ps-wounds { border-color: ${T.hair}; }
.twod12-dark .twod12.sheet.pcs .ps-init:not(.dis) { background: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .twod12.sheet.pcs .ps-bxbtn { background: ${T.pg2}; border-color: ${T.hair}; color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-tile { background: ${T.pg2}; color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-pill { color: #fff; }
.twod12-dark .twod12.sheet.pcs .ps-line[data-action="toggleCard"]:hover, .twod12-dark .twod12.sheet.pcs .ps-brow[data-action="toggleCard"]:hover { background: ${T.band}; }
.twod12-dark .twod12.sheet.pcs input, .twod12-dark .twod12.sheet.pcs .nbox { background: ${T.pg2}; color: ${T.ink}; border-color: ${T.hair}; }
.twod12-dark .twod12.sheet.pcs .ps-nameinput { background: transparent; border-color: transparent; }
.twod12-dark .twod12.sheet.pcs button { color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-dladd, .twod12-dark .twod12.sheet.pcs .ps-btn2, .twod12-dark .twod12.sheet.pcs .ps-wroll, .twod12-dark .twod12.sheet.pcs .ps-bch button, .twod12-dark .twod12.sheet.pcs .ps-rcard button { background: transparent; border: 1px solid #8c7d63; color: ${T.ink}; }
.twod12-dark .twod12.sheet.pcs .ps-seg button { background: transparent; color: ${T.ink}; } .twod12-dark .twod12.sheet.pcs .ps-seg button.on { background: ${T.stamp}; color: ${T.stampInk}; }
/* ---- by hand: the NPC Builder tab (a row's color is written dark for parchment: lightened on the dark page) */
.twod12-dark .twod12.sheet.pcs .nb-nm, .twod12-dark .twod12.sheet.pcs .nb-val, .twod12-dark .twod12.sheet.pcs .nb-step.sel span { color: color-mix(in srgb, var(--fc) 45%, #f4ecd9); }
.twod12-dark .twod12.sheet.pcs .nb-step.on .nb-pip { background: color-mix(in srgb, var(--fc) 62%, #cdbb92); }
.twod12-dark .twod12.sheet.pcs .nb-step:hover { background: ${T.band}; }
.twod12-dark .twod12.sheet.pcs .nb-rt { color: ${T.mute}; }
.twod12-dark .twod12.sheet.pcs .ps-roleseg button { background: transparent; color: ${T.ink}; } .twod12-dark .twod12.sheet.pcs .ps-roleseg button.on { background: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .twod12.sheet.pcs .nb-stat { background: ${T.pg2}; border-color: ${T.hair}; } .twod12-dark .twod12.sheet.pcs .nb-stat.dark { background: ${T.band}; border-color: ${T.rule}; color: ${T.gold}; }
.twod12-dark .twod12.sheet.pcs .nb-sum { background: ${T.band}; }
.twod12-dark .twod12.sheet.pcs .nb-dc b, .twod12-dark .twod12.sheet.pcs .nb-dhc { color: color-mix(in srgb, var(--rc) 40%, #f4ecd9); }
.twod12-dark .twod12.sheet.pcs select { background: ${T.pg2}; color: ${T.ink}; border-color: #8c7d63; }
/* ---- by hand: the carousel (the bar and the cards on the dark page) */
.twod12-type #twod12-carousel { --tp-navy: ${T.pg}; --tp-navy2: ${T.pg2}; --tp-parch: ${T.pg2}; --tp-parch2: ${T.pg}; --tp-border: ${T.rule}; --tp-ink: ${T.ink}; --tp-mut: ${T.mute}; --tp-gold: ${T.gold}; --tp-foe: #8f2626; --tp-ally: #3b6d11; }
.twod12-type #twod12-carousel .tc-head.tc-bar { background: ${T.pg}; border-color: ${T.rule}; color: ${T.ink}; }
.twod12-type #twod12-carousel .tc-round { color: ${T.ink}; opacity: 1; }
.twod12-type #twod12-carousel .tc-bar .tc-btn { background: transparent; color: ${T.ink}; border-color: #8c7d63; opacity: 1; }
.twod12-type #twod12-carousel .tp { background: linear-gradient(${T.pg2}, ${T.pg}); border-color: ${T.rule}; color: ${T.ink}; }
.twod12-type #twod12-carousel .tp-name { color: ${T.ink}; }
.twod12-type #twod12-carousel .tp-pips i { border-color: ${T.mute}; }
.twod12-type #twod12-carousel .tp-swap { background: transparent; color: ${T.ink}; border-color: #6a5d48; } .twod12-type #twod12-carousel .tp-move.none { color: ${T.mute}; }
.twod12-type #twod12-carousel .tc-round { white-space: nowrap; }
.twod12-type #twod12-carousel .tp-move, .twod12-type #twod12-carousel .tp-swap { font-family: "Source Sans 3", sans-serif; font-size: 11.5px; font-weight: 600; }
.twod12-dark .application.twod12-styled .sk .head, .twod12-dark .application.twod12-styled .sk .tabs { border-color: ${T.rule} !important; box-shadow: none; }
.twod12-type .application .fr-tab .fr-tip b { font-family: "Source Sans 3", sans-serif; font-weight: 700; }
.twod12-type.twod12-type .twod12.sheet .fr-headline { color: #b3a68e; } .twod12-type.twod12-type .twod12.sheet .fr-headline b { color: #eadfc8; }
.twod12-dark .application .fr-tab .fr-tip { background: ${T.band}; color: ${T.ink}; border-radius: 0; }
.twod12-dark .application .fr-tab .fr-chip { background: transparent; border: 1px solid currentColor; line-height: 16px; font-weight: 600; }
.twod12-dark .application .fr-tab .fr-chip.g-roll { color: var(--g-roll); } .twod12-dark .application .fr-tab .fr-chip.g-requires { color: var(--g-requires); } .twod12-dark .application .fr-tab .fr-chip.g-kind { color: var(--g-kind); }
.twod12-dark .application .fr-tab .fr-chip.g-damage { color: var(--g-damage); } .twod12-dark .application .fr-tab .fr-chip.g-keywords { color: var(--g-keywords); }
.twod12-dark .application .fr-tab .fr-chip button { background: transparent; color: inherit; opacity: .8; }
/* ---- by hand: the item sheets (their variables; fields, the chosen option as the stamp) */
.twod12-dark .application.twod12-styled { --sk-ink: ${T.ink}; --sk-mut: ${T.mute}; --sk-line: ${T.hair}; --sk-acc: ${T.gold}; --sk-navy: ${T.band}; --sk-par: ${T.pg}; --sk-panel: ${T.pg2}; --sk-amber: ${T.gold};
  --input-background-color: ${T.pg2}; --button-background-color: transparent; }
.twod12-dark .application.twod12-styled .window-content { color-scheme: dark; background: ${T.pg}; color: ${T.ink}; }
.twod12-dark .application .fr-tab { --fr-line: ${T.hair}; --fr-par2: ${T.pg2}; --fr-field: #2f2a22; --fr-fline: #6b5d45; --fr-ink: ${T.ink}; --fr-mut: ${T.mute}; --fr-navy: ${T.stamp}; --fr-gold: ${T.gold}; --fr-goldsoft: transparent; --fr-maroon: ${T.ink}; --fr-boon: ${T.boon}; --fr-bane: ${T.bane}; }
.twod12-dark .application.twod12-styled .sk .head { border-bottom: 1px solid ${T.rule}; }
.twod12-dark .application.twod12-styled .sk .head .name { color: ${T.ink}; }
.twod12-dark .application .fr-tab .fr-sec > h3 { border-bottom-color: ${T.rule}; color: ${T.ink}; }
.twod12-dark .application .fr-tab .as-h4 { color: ${T.gold}; }
.twod12-dark .application .fr-tab input, .twod12-dark .application .fr-tab select, .twod12-dark .application .fr-tab textarea { background: #2f2a22; color: ${T.ink}; border-color: #6b5d45; }
.twod12-dark .application .fr-tab button { color: ${T.ink}; background: transparent; border-color: #8c7d63; }
.twod12-dark .application .fr-tab .fr-seg button.on, .twod12-dark .application.twod12-styled .sk .as-tab button.as-vtab.on { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; }
.twod12-dark .application.twod12-styled .sk .as-tab button.as-vtab.on small { color: ${T.stampInk}; }
.twod12-dark .application .fr-tab .as-tier.t1 { --tc: #c8483d; } .twod12-dark .application .fr-tab .as-tier.t2 { --tc: ${T.t2n}; } .twod12-dark .application .fr-tab .as-tier.t3 { --tc: #3f8f4c; } .twod12-dark .application .fr-tab .as-tier.crit { --tc: ${T.gold}; }
.twod12-dark .application .fr-tab code { background: ${T.band}; color: ${T.ink}; }
/* ---- by hand: the Turn dock (a band for its head, the page for its body) */
.twod12-dark .twod12-dock, .twod12-dark .twod12.chat.turnend { background: ${T.pg}; color: ${T.ink}; border-color: ${T.rule}; border-radius: 5px; }
.twod12-dark .twod12-dock .td-hd { border-bottom-color: ${T.rule}; }
.twod12-dark .twod12-dock .td-hd, .twod12-dark .twod12.chat.turnend > summary { background: ${T.band}; color: ${T.ink}; }
.twod12-dark .twod12-dock .td-who { color: ${T.ink}; }
.twod12-dark .twod12-dock .td-pips i, .twod12-dark .twod12.chat.turnend .td-pips i { background: rgba(236, 227, 207, .22); }
.twod12-dark .twod12-dock .td-pips i.on, .twod12-dark .twod12.chat.turnend .td-pips i.on { background: #9aa7ff; }
.twod12-dark .twod12-dock .td-pips i.r.on, .twod12-dark .twod12.chat.turnend .td-pips i.r.on { background: #e6bd5a; }
.twod12-dark .twod12-dock .td-ttl, .twod12-dark .twod12-dock .td-rd { color: ${T.mute}; }
.twod12-dark .twod12-dock .td-sep { color: ${T.mute}; border-color: ${T.hair}; }
/* ---- by hand: the pick bar and the Line bar, in the HUD's look (warm, square, outlined buttons, the pick as a stamp) */
.twod12-dark .twod12-linebar { background: ${T.pg}; color: ${T.ink}; border: 1px solid ${T.gold}; border-radius: 2px; box-shadow: 0 3px 14px rgba(0, 0, 0, .6); }
.twod12-dark .twod12-linebar .lb-ic { color: ${T.gold}; }
.twod12-dark .twod12-linebar .lb-side button, .twod12-dark .twod12-pickbar .lb-opt { background: transparent; color: ${T.ink}; border: 1px solid #8c7d63; border-radius: 2px; font-weight: 600; }
.twod12-dark .twod12-linebar .lb-side button:hover, .twod12-dark .twod12-linebar .lb-side button.on, .twod12-dark .twod12-pickbar .lb-opt:hover, .twod12-dark .twod12-pickbar .lb-opt.hover { background: ${T.stamp}; border-color: ${T.stamp}; color: ${T.stampInk}; font-weight: 700; }
.twod12-dark .twod12-pickbar .lb-opt.you { background: transparent; border-color: ${T.good}; color: ${T.good}; }
.twod12-dark .twod12-pickbar .lb-go { background: ${T.stamp}; color: ${T.stampInk}; border: 1px solid ${T.stamp}; border-radius: 2px; }
.twod12-dark .twod12-pickbar .lb-give { background: transparent; color: ${T.bad}; border: 1px solid ${T.bad}; border-radius: 2px; }
.twod12-dark .twod12-linebar kbd { background: ${T.pg2}; color: ${T.gold}; border-color: ${T.hair}; }
`;

/* ------------------------------------------------------------------ the carousel: look B, the medallions (Lucas, 2026-11-13), one dark look for both themes */
const CAR_B = `
.twod12-type.twod12-type #twod12-carousel { gap: 6px; font-family: "Source Sans 3", sans-serif; }
.twod12-type.twod12-type #twod12-carousel .tc-head.tc-bar { align-self: center; width: auto; gap: 14px; background: rgba(26,23,19,.92); border: 0; border-bottom: 2px solid ${T.rule}; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,.4); padding: 4px 8px; }
.twod12-type.twod12-type #twod12-carousel .tc-round { color: ${T.ink}; font: 700 14px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; white-space: nowrap; } .twod12-type.twod12-type #twod12-carousel .tc-round b { color: ${T.gold}; font-size: 16px; }
.twod12-type.twod12-type #twod12-carousel .tc-bar .tc-btn { border-radius: 0; border-color: #6a5d48; color: ${T.ink}; font-weight: 600; height: 22px; }
.twod12-type.twod12-type #twod12-carousel .tc-bar .tc-btn[data-tc="next"], .twod12-type.twod12-type #twod12-carousel .tc-bar .tc-btn[data-tc="begin"] { background: ${T.stamp}; color: ${T.stampInk}; border-color: ${T.stamp}; }
.twod12-type.twod12-type #twod12-carousel .tp-list { gap: 10px; padding: 0 4px 6px; justify-content: center; align-items: flex-start; }
.twod12-type.twod12-type #twod12-carousel .tp, .twod12-type.twod12-type #twod12-carousel .tp.act { width: 104px; padding: 0; background: none; border: 0; border-radius: 0; box-shadow: none; overflow: visible; display: flex; flex-direction: column; align-items: stretch; filter: drop-shadow(0 3px 5px rgba(0,0,0,.55)); }
.twod12-type.twod12-type #twod12-carousel .tp.act { width: 136px; }
/* v0.0.391 (Lucas: "the whole strip is occupying too much vertical space"): Move and Swap side by side on the acting plate */
.twod12-type.twod12-type #twod12-carousel .tp.act { flex-direction: row; flex-wrap: wrap; } .twod12-type.twod12-type #twod12-carousel .tp.act > * { flex: 0 0 100%; }
.twod12-type.twod12-type #twod12-carousel .tp.act > .tp-por { flex: 0 0 auto; } .twod12-type.twod12-type #twod12-carousel .tp.act > .tp-move { flex: 0 1 auto; min-width: 0; padding: 2px 6px; white-space: nowrap; }
.twod12-type.twod12-type #twod12-carousel .tp.act > .tp-swap { flex: 1 1 0; min-width: 0; height: auto; line-height: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; padding: 0 3px; border-left: 1px solid ${T.hair}; }
.twod12-type.twod12-type #twod12-carousel .tp-band { order: 2; height: auto; padding: 11px 4px 0; margin-top: -10px; background: rgba(26,23,19,.94); font: 700 11px/13px "Source Sans 3", sans-serif; font-variant: normal; letter-spacing: 0; color: ${T.mute}; border-top: 2px solid #8c7d63; }
.twod12-type.twod12-type #twod12-carousel .tp.d1 .tp-band { color: #9fcf7a; border-top-color: #5c9a34; } .twod12-type.twod12-type #twod12-carousel .tp.dm1 .tp-band { color: #ea8f84; border-top-color: #c0453b; } .twod12-type.twod12-type #twod12-carousel .tp.act .tp-band { color: ${T.gold}; border-top-color: ${T.gold}; background: rgba(26,23,19,.94); }
.twod12-type.twod12-type #twod12-carousel .tp-por { order: 1; position: relative; z-index: 2; width: 46px; height: 46px; margin: 0 auto; } .twod12-type.twod12-type #twod12-carousel .tp.act .tp-por { width: 58px; height: 58px; }
.twod12-type.twod12-type #twod12-carousel .tp-por img { border: 2px solid #1a1612; outline: none; } .twod12-type.twod12-type #twod12-carousel .tp.act .tp-por img { border-color: ${T.gold}; box-shadow: 0 0 0 1px #1a1612, 0 0 12px rgba(212,165,72,.55); }
.twod12-type.twod12-type #twod12-carousel .tp-seal { right: -6px; bottom: 0; border-radius: 0; border: 0; background: ${T.stamp}; color: ${T.stampInk}; font: 700 11px/17px "Source Sans 3", sans-serif; height: 17px; }
.twod12-type.twod12-type #twod12-carousel .tp-name, .twod12-type.twod12-type #twod12-carousel .tp.act .tp-name { order: 3; margin: 0; padding: 0 5px; background: rgba(26,23,19,.94); font: 700 13px/16px "Source Sans 3", sans-serif; color: ${T.ink}; }
.twod12-type.twod12-type #twod12-carousel .tp-pips { order: 4; margin: 0; padding: 3px 4px 5px; background: rgba(26,23,19,.94); } .twod12-type.twod12-type #twod12-carousel .tp-strikes { order: 5; margin: 0; padding: 0 4px 6px; background: rgba(26,23,19,.94); }
.twod12-type.twod12-type #twod12-carousel .tp-move { order: 6; margin: 0; padding: 4px 4px; border: 0; border-top: 1px solid ${T.hair}; border-radius: 0; background: rgba(26,23,19,.94); font: 600 11.5px "Source Sans 3", sans-serif; }
.twod12-type.twod12-type #twod12-carousel .tp-swap { order: 7; width: auto; margin: 0; border-radius: 0; background: rgba(26,23,19,.94); border: 0; border-top: 1px solid ${T.hair}; color: ${T.ink}; font: 600 11.5px/22px "Source Sans 3", sans-serif; height: 24px; }`;


/* ------------------------------------------------------------------ added at the build (STYLE-1), beyond the mockups' rules */
// The word Guard, colored by the text highlighter (config.mjs highlightText, "kw-guard") wherever rules text is highlighted, not only in the chat.
const EXTRA = `
/* ---- the word Guard in the Guard blue (Lucas, 2026-11-12: "I like the proposed"), on cards, sheets and windows too */
.twod12-type .twod12 .kw-guard, .twod12-type .classwin .kw-guard { color: #2f6fb3; font-weight: 700; }
.twod12-dark .twod12 .kw-guard, .twod12-dark .classwin .kw-guard { color: #7fb4ee; }
/* ---- v0.0.372: the [Strike] marks' terracotta on the dark page */
.twod12-dark { --tw-strike: #ec8a55; }
/* ---- v0.0.372: the chat frame's top line on the dark page (the cards' own variables cover theirs; the other messages use these) */
.twod12-dark .twod12 .tw-top { color: ${T.mute}; border-bottom-color: ${T.hair}; } .twod12-dark .twod12 .tw-who img { border-color: ${T.hair}; }
.twod12-dark .twod12.chat.cc .tw-top { color: var(--cc-mute); border-bottom-color: var(--cc-gline); }
/* ---- v0.0.373: the Immune / Resist / Weak block and chips on the dark page */
.twod12-dark .twod12 .rw-chip, .twod12-dark .twod12 .rw-sub { --sc: var(--sc-d); }
.twod12-dark .twod12.sheet.pcs .nb-rw.rwA { --rw-ink: ${T.ink}; --rw-mute: ${T.mute}; --rw-hair: ${T.hair}; --rw-out: #8c7d63; --rw-res: #8fd69b; --rw-wk: #f3a79e; --rw-ona: ${T.band}; }
/* ---- v0.0.374: the Class sheet's Details tab on the dark page (the mockup's dark values) */
.twod12-dark .application.twod12-styled .sk .fr-tab.cls2 { --cf-ink: ${T.ink}; --cf-mute: ${T.mute}; --cf-hair: ${T.hair}; --cf-rule: ${T.rule}; --cf-band: ${T.pg2}; --cf-pg: ${T.pg}; }
.twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .cls-grp { background: color-mix(in srgb, var(--fq, #5F5E5A) 16%, ${T.pg}); }
.twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .cls-gl { background: color-mix(in srgb, var(--fq, #5F5E5A) 38%, #14110d); color: color-mix(in srgb, var(--fq, #5F5E5A), #fff 62%); }
.twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .at-body { color: #f08a8a; } .twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .at-mind { color: #8fb3ee; } .twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .at-appeal { color: #e3c15a; } .twod12-dark .application.twod12-styled .sk .fr-tab.cls2 .at-instinct { color: #7fcf95; }
/* ---- v0.0.375: the one-page NPC sheet on the dark page: the Attributes' and Modifiers' lighter colors, the HP bar */
.twod12-dark .twod12-sb .sb-attr.at-body { --ac: #ef8a96; } .twod12-dark .twod12-sb .sb-attr.at-mind { --ac: #8db3ff; } .twod12-dark .twod12-sb .sb-attr.at-appeal { --ac: #e6bd5a; } .twod12-dark .twod12-sb .sb-attr.at-instinct { --ac: #7fd49a; }
.twod12-dark .twod12-sb .sb-attr.mod-weapon { --ac: #f4a259; } .twod12-dark .twod12-sb .sb-attr.mod-power { --ac: #b794f6; } .twod12-dark .twod12-sb .sb-track { background: #40382c; } .twod12-dark .twod12-sb .sb-track.hp i { background: #62a653; }
.twod12-dark .twod12-sb .sb-oa { background: color-mix(in srgb, var(--fq) 16%, ${T.pg}); } .twod12-dark .twod12-sb .sb-oa-h { background: color-mix(in srgb, var(--fq) 42%, ${T.pg}); }
.twod12-dark .twod12-sb .sb-state, .twod12-dark .twod12-sb .neg { color: #ff8f86; } .twod12-dark .twod12-sb .sb-gauge.v .k { color: #ef8a80; } .twod12-dark .twod12-sb .sb-gauge.r .k { color: #8fb3ee; }
/* ---- v0.0.377 (Lucas: "the number on the Guard is almost unreadable"; "Health X could look more important"): dark ink on the gold shield, light on the grey one; Health as a heading */
.twod12-type .twod12.sheet.pcs .ps-shield { color: #1f1a12; } .twod12-type .twod12.sheet.pcs .ps-shield b { font-size: 13px; font-weight: 800; }
.twod12-type .twod12.sheet.pcs .ps-shield.zero { background: #6b6152; color: #fbf6ea; }
.twod12-type .twod12.sheet.pcs .ps-hh:has(.ps-shield) > .ps-k { font: 700 15px "Source Sans 3", sans-serif; font-variant: small-caps; letter-spacing: .02em; text-transform: none; color: #f3ebd8; }
.twod12-light .twod12.sheet.pcs .ps-hh:has(.ps-shield) > .ps-k { color: #f3ebd8; }
/* ---- v0.0.377: the damage line window on the dark page */
.twod12-dark .application.classwin .cw-seg > button.pw-sub { --sc: var(--sc-d); } .twod12-dark .application.classwin .cw-seg > button.pw-kind.resist span { color: #8fd69b; } .twod12-dark .application.classwin .cw-seg > button.pw-kind.weak span { color: #f3a79e; }
.twod12-dark .application.classwin .cw-seg > button.pw-kind[aria-pressed="true"] span { color: inherit; }
/* ---- v0.0.377: the damage line window's layout wins over the single-choice list (one option per line): the types four to a row, the kinds side by side */
.twod12-type.twod12-type .application.classwin .cw-attr > .cw-seg:has(> button.pw-sub) { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); flex-direction: row; gap: 4px; }
.twod12-type.twod12-type .application.classwin .cw-attr > .cw-seg:has(> button.pw-kind) { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; }
.twod12-type.twod12-type .application.classwin .cw-attr > .cw-seg > button.pw-sub, .twod12-type.twod12-type .application.classwin .cw-attr > .cw-seg > button.pw-kind { width: auto; min-width: 0; min-height: 28px; padding: 0 9px; justify-content: flex-start; text-align: left; }
.twod12-type.twod12-type .application.classwin .cw-seg > button.pw-sub > i { display: inline-block; color: var(--sc); margin-right: 2px; }
.twod12-type.twod12-type .application.classwin .cw-seg > button.pw-sub[aria-pressed="true"] { background: transparent; color: inherit; border-color: var(--sc); box-shadow: inset 0 -3px 0 var(--sc); }
.twod12-light .application.classwin .cw-seg > button.pw-sub[aria-pressed="true"] { color: #2a241d; } .twod12-dark .application.classwin .cw-seg > button.pw-sub[aria-pressed="true"] { color: ${T.ink}; }
/* ---- v0.0.371 (Lucas: "the rainbow is missing the glow that the diamond has"): Mithril glows like Diamond, in two of its own colors */
.twod12-type .twod12 .autodia.auto-mithril, .twod12-type .twod12.sheet.pcs .autodia.auto-mithril, .twod12-type .twod12.acard.d2 .autodia.auto-mithril, .twod12-type .twod12.chat.cc .autodia.auto-mithril { filter: saturate(1.5) drop-shadow(-1px 0 2px #5ad7ff) drop-shadow(1px 0 2px #ff6fb5); }
/* ---- the pick window's text goes through the highlighter now: its colors on the dark window */
.twod12-dark .application.classwin .kw-ap { color: #9aa7ff; } .twod12-dark .application.classwin .kw-bane, .twod12-dark .application.classwin .kw-neg { color: ${T.bane}; } .twod12-dark .application.classwin .kw-boon, .twod12-dark .application.classwin .kw-pos { color: ${T.boon}; }
`;



/* ------------------------------------------------------------------ STYLE-3: Foundry's color schemes (style-book.md step 4, A) */
// The rules are written with .twod12-dark / .twod12-light in front (as since STYLE-1); here each one moves into an @scope block of Foundry's
// theme, the dnd5e and Draw Steel convention: @scope (.theme-dark) to (.themed) { ... }. A rule keeps its weight: ":where(.twod12-dark) X"
// becomes "X" (the scope's own prefix weighs nothing) and ".twod12-dark X" becomes ":scope X" (one class, as before). A sheet is its own scope
// root (Foundry puts .themed.theme-dark on the window, with the system's classes): so each selector also matches with its first part on the root.
const topSplit = sel => { const out = []; let d = 0, cur = ""; for (const ch of sel) { if ("([".includes(ch)) d++; else if (")]".includes(ch)) d--; if (ch === "," && !d) { out.push(cur.trim()); cur = ""; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
const firstCompound = s => { let d = 0; for (let i = 0; i < s.length; i++) { const ch = s[i]; if ("([".includes(ch)) d++; else if (")]".includes(ch)) d--; else if (!d && /[\s>+~]/.test(ch)) return [s.slice(0, i), s.slice(i)]; } return [s, ""]; };
const THEME_HEAD = /^(:where\(\.twod12-(dark|light)\)|(?:\.twod12-(dark|light)\b(?!-))+)(?:\s+|(?=[.#[:])|$)/;
function scoped(sel) {
  const m = sel.match(THEME_HEAD);
  if (!m) return null;
  const theme = m[2] || m[3], weight = m[1].startsWith(":where") ? 0 : (m[1].match(/\.twod12-(dark|light)/g) ?? []).length;
  const rest = sel.slice(m[0].length).trim(), sc = weight ? ":scope".repeat(weight) : ":where(:scope)";
  if (!rest) return { theme, plain: `.theme-${theme}` };   // a theme's own variables: on Foundry's class (the nearest theme wins)
  const [c, tail] = firstCompound(rest);
  const sels = [`${sc} ${rest}`];
  if (!c.includes("::")) sels.push(`:is(${c})${sc}${tail}`);
  return { theme, sels };
}
export function foundryThemes(css) {
  const out = [];
  let run = null;   // consecutive rules of one theme share one @scope block, so the order of the rules is kept
  const flush = () => { if (run) { out.push(`@scope (.theme-${run.theme}) to (.themed) {\n${run.rules.join("\n")}\n}`); run = null; } };
  const push = (theme, rule) => { if (run && run.theme !== theme) flush(); if (!run) run = { theme, rules: [] }; run.rules.push(rule); };
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) { flush(); out.push(css.slice(i)); break; }
    let d = 0, j = open;
    for (; j < css.length; j++) { if (css[j] === "{") d++; else if (css[j] === "}" && --d === 0) break; }
    const head = css.slice(i, open), body = css.slice(open, j + 1);
    const lead = head.match(/^[\s\S]*\*\/\s*/)?.[0] ?? (head.match(/^\s*/)?.[0] ?? ""), sel = head.slice(lead.length).trim();
    i = j + 1;
    if (lead.trim()) { flush(); out.push(lead.trimEnd()); }
    if (sel.startsWith("@")) { flush(); out.push(`${sel} ${body}`); continue; }
    const plain = [], byTheme = { dark: [], light: [] };
    for (const one of topSplit(sel)) { const x = scoped(one); if (x?.plain) plain.push(x.plain); else if (x) byTheme[x.theme].push(...x.sels); else plain.push(one); }
    if (plain.length) { flush(); out.push(`${plain.join(", ")} ${body}`); }
    for (const t of ["dark", "light"]) if (byTheme[t].length) push(t, `${byTheme[t].join(", ")} ${body}`);
  }
  flush();
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
/* ---------------------------------------------------------------- STYLE-3 (2026-11-17, foundry/mockups/style-book.md): the book's restraint.
   Step 3: a color only for a meaning. Steps 3 and 6 rounds: palette A for the Tiers, the Basic Actions' strips muted, Use outlined. */
const STYLE3 = `
/* ==== STYLE-3: game words in text take the ink (AP, Guard, Boon, Bane, the Attributes, the Modifiers); the frequency a small mark beside its word ==== */
.twod12-type :is(.twod12, .classwin, .application, .twod12-hud) :is(.kw-ap, .kw-guard, .kw-bane, .kw-boon, .kw-pos, .kw-neg, .kw-rally, .kw-mv, .at-body, .at-mind, .at-instinct, .at-appeal, .mod-weapon, .mod-power, .mod-signature) { color: inherit !important; }
.twod12-type .twod12.sheet.pcs .ps-pill:not(.line), .twod12-type .twod12.chat.cc .cc-cost, .twod12-type .twod12.acard.d2 .ap-freq { background: transparent !important; color: var(--s-ink) !important; border: 1px solid var(--s-hair) !important; }
.twod12-type .twod12.sheet.pcs .ps-pill:not(.line)::before, .twod12-type .twod12.chat.cc .cc-cost::before, .twod12-type .twod12.acard.d2 .ap-freq::before { content: ""; display: inline-block; width: .55em; height: .55em; margin-right: .35em; vertical-align: .05em; background: var(--fqm, #888); }
.twod12-type .twod12.sheet.pcs .ps-pill { --fqm: var(--fc); } .twod12-type .twod12.acard.d2 .ap-freq { --fqm: var(--fq); }
.twod12-type .twod12.chat.cc .cc-cost.f-atwill { --fqm: var(--s-fq-atwill); } .twod12-type .twod12.chat.cc .cc-cost.f-round { --fqm: var(--s-fq-round); } .twod12-type .twod12.chat.cc .cc-cost.f-encounter { --fqm: var(--s-fq-encounter); }
.twod12-type .twod12.chat.cc .cc-cost.f-turn { --fqm: var(--s-fq-turn); } .twod12-type .twod12.chat.cc .cc-cost.f-daily { --fqm: var(--s-fq-daily); }
/* the trait chips lose their fills (their group names go with the Action card's Structure pass) */
.twod12-type .twod12 .ap-chip { background: transparent !important; border-color: transparent !important; color: var(--s-ink) !important; padding-left: 0 !important; padding-right: 0 !important; }
/* ==== STYLE-3: the Basic Actions' and the Reactions' strips, muted (the frequency's color and Strike's mixed toward the surface) ==== */
.twod12-type .twod12.sheet.pcs { --tw-mute-to: ${LIGHT.pg}; }
.twod12-dark .twod12.sheet.pcs { --tw-mute-to: ${DARK.pg2}; }
.twod12-type .twod12.sheet.pcs .ps-bxbtn.ln { padding-left: 14px !important; box-shadow: inset 4px 0 0 color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to)) !important; }
.twod12-type .twod12.sheet.pcs .ps-bxbtn.ln.ln-strike { padding-left: 16px !important; box-shadow: inset 4px 0 0 color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to)), inset 8px 0 0 color-mix(in srgb, var(--tw-strike) 55%, var(--tw-mute-to)) !important; }
.twod12-type .twod12.sheet.pcs .ps-row.lnfreq > .ps-line { padding-left: 14px !important; box-shadow: inset 4px 0 0 color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to)) !important; }
.twod12-type .twod12.sheet.pcs .ps-row.lnfreq.strike > .ps-line { padding-left: 18px !important; box-shadow: inset 4px 0 0 color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to)), inset 8px 0 0 color-mix(in srgb, var(--tw-strike) 55%, var(--tw-mute-to)) !important; }
.twod12-type .twod12.sheet.pcs .ps-row.strike:not(.lnfreq) > .ps-line { box-shadow: inset 4px 0 0 color-mix(in srgb, var(--tw-strike) 55%, var(--tw-mute-to)) !important; }
.twod12-type .twod12.sheet.pcs .ps-legend .sw { background: color-mix(in srgb, var(--lnf) 55%, var(--tw-mute-to)) !important; }
/* ==== STYLE-3: "Use" outlined in the accent, the word in ink, filled on hover; the Reactions' the same (their teal gone) ==== */
.twod12-type .twod12.sheet.pcs .ps-use, .twod12-type .twod12.sheet.pcs .ps-use.rx { background: transparent !important; color: var(--s-ink) !important; border: 1px solid var(--s-gold) !important; box-shadow: none !important; font-weight: 600 !important; min-width: 46px; height: 26px; }
.twod12-type .twod12.sheet.pcs .ps-use:hover, .twod12-type .twod12.sheet.pcs .ps-use:focus-visible { background: var(--s-gold) !important; color: var(--s-pg) !important; }
/* ==== STYLE-3: the Tiers in palette A (both themes through the --s-ta-* variables): a fill for the result, a pale range for the others ==== */
.twod12-type .twod12.chat.cc .t1:is(.cc-stamp, .cc-pill), .twod12-type .twod12.chat.cc .cc-sband.t1, .twod12-type .twod12.chat.cc .cc-srow.t1.hit, .twod12-type .twod12.chat.cc .cc-seg.s1.lit, .twod12-type .twod12.rolldlg .rd-lseg.t1, .twod12-type .twod12.chat.cc .cc-stamp.dmg.t1:hover { background: var(--s-ta-1) !important; color: #fff !important; border-color: var(--s-ta-1) !important; }
.twod12-type .twod12.chat.cc .t2:is(.cc-stamp, .cc-pill), .twod12-type .twod12.chat.cc .cc-sband.t2, .twod12-type .twod12.chat.cc .cc-srow.t2, .twod12-type .twod12.chat.cc .cc-seg.s2.lit, .twod12-type .twod12.rolldlg .rd-lseg.t2, .twod12-type .twod12.chat.cc .cc-stamp.dmg.t2:hover { background: var(--s-ta-2) !important; color: #fff !important; border-color: var(--s-ta-2) !important; }
.twod12-type .twod12.chat.cc .t3:is(.cc-stamp, .cc-pill), .twod12-type .twod12.chat.cc .cc-sband.t3, .twod12-type .twod12.chat.cc .cc-srow.t3, .twod12-type .twod12.chat.cc .cc-seg.s3.lit, .twod12-type .twod12.rolldlg .rd-lseg.t3, .twod12-type .twod12.chat.cc .cc-stamp.dmg.t3:hover { background: var(--s-ta-3) !important; color: #fff !important; border-color: var(--s-ta-3) !important; }
.twod12-type .twod12.chat.cc .crit:is(.cc-stamp, .cc-pill), .twod12-type .twod12.chat.cc .cc-sband.crit, .twod12-type .twod12.chat.cc .cc-czone.solid, .twod12-type .twod12.rolldlg .rd-lseg.crit, .twod12-type .twod12.chat.cc .cc-tag.crit, .twod12-type .twod12.chat.cc .cc-stamp.dmg.crit:hover { background: var(--s-ta-c) !important; color: var(--s-ta-ci) !important; border-color: var(--s-ta-cr) !important; }
.twod12-type .twod12.chat.cc .cc-stamp.crit { box-shadow: inset 0 0 0 3px var(--s-ta-cr) !important; } .twod12-type .twod12.chat.cc .cc-pill.crit { box-shadow: inset 0 0 0 2px var(--s-ta-cr) !important; }
.twod12-type .twod12.chat.cc .cc-stamp *, .twod12-type .twod12.chat.cc .cc-srow:is(.t2, .t3, .t1.hit) :is(.cc-pv, .cc-pr, .cc-sub, .cc-dot, .cc-none) { color: inherit !important; }
.twod12-type .twod12.chat.cc .cc-seg.s1:not(.lit), .twod12-type .twod12.chat.cc .cc-srow.t1:not(.hit) { background: var(--s-ta-1p) !important; color: var(--s-ink) !important; }
.twod12-type .twod12.chat.cc .cc-seg.s2:not(.lit) { background: var(--s-ta-2p) !important; color: var(--s-ink) !important; }
.twod12-type .twod12.chat.cc .cc-seg.s3:not(.lit) { background: var(--s-ta-3p) !important; color: var(--s-ink) !important; }
.twod12-type .twod12.chat.cc .cc-czone:not(.solid) { background: var(--s-ta-cp) !important; color: var(--s-ink) !important; }
.twod12-type .twod12.chat.cc .cc-dbl, .twod12-type .twod12.chat.cc .cc-dbl.crit { border-color: var(--s-ta-c) !important; box-shadow: none !important; }
.twod12-type .twod12.rolldlg .rd-tiers tr.t1 th { background: var(--s-ta-1p) !important; color: var(--s-ink) !important; box-shadow: inset 4px 0 0 var(--s-ta-1) !important; }
.twod12-type .twod12.rolldlg .rd-tiers tr.t2 th { background: var(--s-ta-2p) !important; color: var(--s-ink) !important; box-shadow: inset 4px 0 0 var(--s-ta-2) !important; }
.twod12-type .twod12.rolldlg .rd-tiers tr.t3 th { background: var(--s-ta-3p) !important; color: var(--s-ink) !important; box-shadow: inset 4px 0 0 var(--s-ta-3) !important; }
.twod12-type .twod12.rolldlg .rd-tiers tr.crit th { background: var(--s-ta-cp) !important; color: var(--s-ink) !important; box-shadow: inset 4px 0 0 var(--s-ta-c) !important; }
.twod12-type .twod12.acard.d2 table.ap-tt tr.t1 { --c: var(--s-ta-1t) !important; --n: var(--s-ta-1) !important; --bg: var(--s-ta-1p) !important; }
.twod12-type .twod12.acard.d2 table.ap-tt tr.t2 { --c: var(--s-ta-2t) !important; --n: var(--s-ta-2) !important; --bg: var(--s-ta-2p) !important; }
.twod12-type .twod12.acard.d2 table.ap-tt :is(tr.t3, tr.tall) { --c: var(--s-ta-3t) !important; --n: var(--s-ta-3) !important; --bg: var(--s-ta-3p) !important; }
.twod12-type .twod12.acard.d2 table.ap-tt tr.crit { --c: var(--s-ta-ct) !important; --n: var(--s-ta-c) !important; --bg: var(--s-ta-cp) !important; }
.twod12-type .twod12.acard.d2 table.ap-tt tr.crit td:not(.tl) { background: var(--s-ta-cp) !important; }
/* ==== STYLE-3: a light window inside the dark interface keeps the light values of the variables the dark theme changes (system.css :root) ==== */
.theme-light { --g-roll: #1f7a73; --g-requires: #2c5f9e; --g-kind: #b4472a; --g-damage: #8a6a00; --g-keywords: #5c5a55; --c-bane: #b3261e; --c-boon: #0b5cad; --c-rally: #0a6b62; --c-ap: #3b4cb8; --c-mv: #4d6b0a; --tw-strike: #c25a28; }
/* ==== STYLE-3: a button's text takes the browser's color scheme unless it is set: the damage card's pools line was white on the light card in a dark browser ==== */
.twod12-type .twod12.chat.cc .cc-pools { color: var(--s-ink); }
`;

/** The theme's CSS from system.css's text (pure: the test calls it). */
export function buildTheme(systemCss) {
  const ALL = blocks(systemCss.replace(/\/\*[\s\S]*?\*\//g, ""));
  const pick = re => ALL.filter(b => !b.startsWith("@") && re.test(selOf(b)));
  const R = surfaces(pick);
  const WARM_PCS = warmSet(R.pcs);
  // the carousel takes the dark look in both themes (it sits on the map), so its set is scoped to the always-on class
  const SETS = Object.entries(R).map(([k, rules]) => [k, darkSet(k, rules, k === "car" ? ".twod12-type" : ".twod12-dark")]);
  return foundryThemes(`/* GENERATED by tools/build-theme.mjs from styles/system.css: do not edit; edit the script and run it again (node tools/build-theme.mjs).
   STYLE-1 (v0.0.369): the settled look, on top of system.css. .twod12-type is on <html> always (module/theme.mjs). STYLE-3 (2026-11-17):
   the dark and light sets follow Foundry's own color schemes, as dnd5e and Draw Steel do: inside @scope (.theme-dark) to (.themed), so the
   chat and the bars follow the Interface setting, a sheet or window its Applications setting or its own theme, the nearest theme winning. Surfaces: ${Object.entries(R).map(([k, r]) => `${k} ${r.length}`).join(", ")} rules read. */
/* ==== the shared colors (the --s-* variables): dark on :root and Foundry's .theme-dark, light on .theme-light (the nearest wins) ==== */
:root, .theme-dark { ${vars(DARK)} }
.theme-light { ${vars(LIGHT)} }
/* ==== the PC sheet, light: its navy family turned warm ==== */
${WARM_PCS}
/* ==== the type and the shapes, both themes ==== */
${TYPE}
${SETS.map(([k, css]) => `/* ==== the dark set: ${k} ==== */\n${css}`).join("\n")}
/* ==== by hand ==== */
${BY_HAND}
/* ==== the carousel, look B ==== */
${CAR_B}
${EXTRA}
${STYLE3}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = buildTheme(readFileSync(here("../styles/system.css"), "utf8"));
  writeFileSync(here("../styles/theme.css"), css);
  console.log(`styles/theme.css: ${css.length} characters`);
}
