// Builds the NPC-HUD mockups (pack-npc-hud-mockups, 2026-11-12; the brief: npc-hud-brief.md, section 4). Static HTML, nothing in the system.
//   node foundry/mockups/npc-hud-build.mjs   ->   npc-hud-sheet.html, npc-hud-hud.html, npc-hud-screen.html (self-contained: the system's CSS, npc-hud.css, the fonts and the art are embedded)
// ONE DISPLAY MODEL, THREE OUTPUTS (the brief's section 2): the NPCS objects below are a first draft of that model; the sheet's rows, the
// HUD's buttons and the Action card are all drawn from them. The numbers are the Bestiary's Stage 0 example NPCs (book/rules-src/14-bestiary.md);
// the Health is pack HP's model (HP = Vigor + Resolve; the gauges can go below 0). The pick bar and the Turn dock are the system's own functions.
import { writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { SIGNIKA } from "./npc-hud-signika.mjs";
import { fileURLToPath } from "node:url";
import { ICONS } from "./npc-hud-icons.mjs";
import { pickBarHtml } from "../twod12/module/pickbar.mjs";
import { dockModel, dockHtml } from "../twod12/module/turndock.mjs";
import { FREQ_COLORS } from "../twod12/module/config.mjs";

const here = f => fileURLToPath(new URL(f, import.meta.url));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ic = n => { const [vb, d] = ICONS[n]; return `<svg class="ic" viewBox="${vb}" aria-hidden="true"><path d="${d}"/></svg>`; };
const FA = html => html.replace(/<i class="fa-solid fa-([a-z0-9-]+)([^"]*)"><\/i>/g, (m, n, rest) => ICONS[n] ? `<span class="${rest.trim()}">${ic(n)}</span>` : m);
const sign = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0");
// SELF-CONTAINED PAGES (Lucas, 2026-11-12: the linked pages opened broken outside the repo): the CSS, the fonts and the art are embedded.
const b64 = f => readFileSync(here(f)).toString("base64");
const thumb = f => execFileSync("python3", ["-c", "import sys,io,base64;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((160,160));b=io.BytesIO();im.save(b,'WEBP',quality=80);sys.stdout.write(base64.b64encode(b.getvalue()).decode())", here(`../twod12/art/${f}`)]).toString();
const ARTDATA = Object.fromEntries(["npcs/goblin-sneak.png", "npcs/orc-warrior.png", "npcs/ogre-chieftain.png", "pcs/aveline.png", "pcs/durgan.png", "pcs/sylwen.webp", "pcs/kaela.webp"].map(f => [f, `data:image/webp;base64,${thumb(f)}`]));
const artKey = f => f.replace(/[^a-z]/g, "");
const ART_CSS = Object.entries(ARTDATA).map(([f, d]) => `img.art-${artKey(f)} { content: url(${d}); }`).join("\n");
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const inlineArt = html => html.replace(/<img ([^>]*?)src="\.\.\/twod12\/art\/([^"]+)"/g, (m, pre, f) => { const c = `art-${artKey(f)}`; return /class="/.test(pre) ? `<img ${pre.replace('class="', `class="${c} `)}src="${BLANK}"` : `<img class="${c}" ${pre}src="${BLANK}"`; });
// Only the rules the mockups use (the Action card, the Turn dock, the pick bar, the variables, Cinzel): the whole file made the pages too heavy for some viewers.
function pruneCss(css) { const out = []; let i = 0, start = 0, depth = 0; for (; i < css.length; i++) { const ch = css[i]; if (ch === "{") depth++; else if (ch === "}") { depth--; if (depth === 0) { const block = css.slice(start, i + 1), pre = block.slice(0, block.indexOf("{")); if (/acard|twod12-dock|turnend|linebar|pickbar|:root/.test(pre) || (/font-face/.test(pre) && /Cinzel/.test(block))) out.push(block.trim()); start = i + 1; } } } return out.join("\n"); }
const SYSTEM_CSS = pruneCss(readFileSync(here("../twod12/styles/system.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "")).replace(/url\("\.\.\/fonts\/([a-z0-9-]+\.woff2)"\)/g, (m, f) => `url(data:font/woff2;base64,${b64(`../twod12/fonts/${f}`)})`).replace(/url\((?!data:)[^)]*\)/g, "none").replace(/<\/style/gi, "");
const FONT_CSS = Object.entries(SIGNIKA).map(([w, d]) => `@font-face { font-family: "Signika"; font-weight: ${w}; font-style: normal; src: url(data:font/woff2;base64,${d}) format("woff2"); }`).join("\n");
const MOCK_CSS = readFileSync(here("./npc-hud.css"), "utf8");
const ART = "../twod12/art/";

/* ------------------------------------------------------------------ the display model (draft) */
const FREQ = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };
const GROUPS = { basic: ["Basic", "var(--g-basic)"], special: ["Special", "var(--g-special)"], react: ["Reactions", "var(--g-react)"], esc: ["Escalation", "var(--g-esc)"] };
const TRAITS = { weapon: ["Weapon", "roll"], magic: ["Power", "roll"], save: ["Save", "roll"], body: ["Body", "roll"], melee: ["Melee", "requires"], strike: ["Strike", "kind"], area: ["Area", "kind"], focus: ["Focus", "keywords"], fear: ["Fear", "keywords"] };
const SUB = { Sl: "Slashing", Pi: "Piercing", Bl: "Bludgeoning" };

// An Action of the model: group, name, ap, reaction, freq, traits, vs, dist, target, tiers [t1, t2, t3] (damage text, "" = nothing), sub (damage subtype),
// rider (a condition and on which Tiers), line (the Bestiary's one line, written as the book writes it), flavor (from book/cards/bestiary.json).
const NPCS = {
  goblin: { name: "Goblin Sneak", img: "npcs/goblin-sneak.png", rank: "Minion", role: "Skirmisher", cv: 25, level: 1, ap: 3,
    vigor: [5, 5], resolve: [5, 5], ad: 12, wd: 11, speed: 7, attrs: { body: 0, mind: 0, appeal: -1, instinct: 1 }, wmod: 2, pmod: 1,
    actions: [
      { group: "basic", name: "Rusty Knife", ap: 1, freq: "atwill", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "One creature", tiers: ["", "2", "1 + 1d4"], sub: "Pi",
        kind: "Basic attack", line: "2 / 1 + 1d4 Pi.", flavor: "A notched blade, quick and dirty." },
      { group: "special", name: "Dirty Trick", ap: 1, freq: "round", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "One creature", tiers: ["", "2", "1 + 1d4"], sub: "Pi",
        rider: { text: "Hindered (EoT)", on: "Tier 2 and Tier 3" }, kind: "Special, 1 AP, Round", line: "2 / 1 + 1d4 Pi, and <span class=\"cond\">Hindered</span> (EoT).", flavor: "Sand in the eyes, a heel on the toes, and the goblin is gone." }
    ] },
  orc: { name: "Orc Warrior", img: "npcs/orc-warrior.png", rank: "Standard", role: "Soldier", cv: 100, level: 1, ap: 4,
    vigor: [22, 36], resolve: [24, 24], ad: 13, wd: 11, speed: 5, attrs: { body: 2, mind: 1, appeal: 0, instinct: 1 }, wmod: 2, pmod: 2,
    actions: [
      { group: "basic", name: "Cleaver", ap: 1, freq: "atwill", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "One creature", tiers: ["", "1 + 1d4", "2 + 1d6"], sub: "Sl",
        kind: "Basic attack", line: "1 + 1d4 / 2 + 1d6 Sl.", flavor: "A butcher's blade, swung by someone who enjoys it." },
      { group: "special", name: "Brutal Swing", ap: 2, freq: "round", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "One creature", tiers: ["", "2 + 1d4", "3 + 1d6"], sub: "Sl",
        rider: { text: "Prone", on: "Tier 2 and Tier 3" }, kind: "Special, 2 AP, Round", line: "2 + 1d4 / 3 + 1d6 Sl, and <span class=\"cond\">Prone</span>.", flavor: "The orc puts its whole weight behind one wild arc." },
      { group: "react", name: "Hold the Line", ap: 1, reaction: true, freq: "round", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "The attacker", tiers: ["", "2 + 1d6", "6 + 1d6"], sub: "Sl",
        trigger: "An ally within 2 squares is hit.", kind: "Reaction, 1R, Trigger: an ally within 2 squares is hit", line: "the attacker takes 2 + 1d6 / 6 + 1d6 Sl.", flavor: "Touch its kin, and the orc answers." }
    ] },
  ogre: { name: "Ogre Chieftain", img: "npcs/ogre-chieftain.png", rank: "Elite", role: "Striker", cv: 200, level: 1, ap: 4, escalation: 4,
    vigor: [-6, 65], resolve: [41, 65], ad: 14, wd: 12, speed: 4, attrs: { body: 3, mind: 2, appeal: 1, instinct: 2 }, wmod: 3, pmod: 2,
    ladder: [[2, "1 Boon on its first attack each round."], [4, "Its Round Special Action twice a round."], [6, "Ground Slam comes back, once."]],
    actions: [
      { group: "basic", name: "Club", ap: 1, freq: "atwill", traits: ["weapon", "melee", "strike"], vs: "AD", dist: "Melee", target: "One creature", tiers: ["", "3 + 1d6", "5 + 1d6"], sub: "Bl",
        kind: "Basic attack", line: "3 + 1d6 / 5 + 1d6 Bl.", flavor: "A tree trunk with a handle." },
      { group: "special", name: "Ground Slam", ap: 3, freq: "encounter", used: true, traits: ["save", "body", "area"], vs: "Body Save, DC 14", dist: "Area 1 Emanation", target: "All creatures in the Area", tiers: ["7 + 1d6", "4 + 1d6", "0"], sub: "Bl", saveAction: true,
        rider: { text: "Prone", on: "Tier 1" }, kind: "Special, 3 AP, Encounter, Area 1 Emanation, Body Save DC 14", line: "7 + 1d6 / 4 + 1d6 / 0 Bl (Tier 1 is the worst for them), and <span class=\"cond\">Prone</span> on Tier 1.", flavor: "The ogre brings both fists down, and the ground jumps." },
      { group: "esc", name: "Rally the Tribe", ap: 1, freq: "round", escalation: 4, traits: ["focus"], vs: "", dist: "5 squares", target: "Allies within 5 squares", noTiers: true,
        effect: "Allies within 5 squares gain 1 <span class=\"cond\">Boon</span> on their next [Weapon] Action.", kind: "Escalation 4, 1 AP, Round", line: "allies within 5 squares gain 1 <span class=\"cond\">Boon</span> on their next [Weapon] Action.", flavor: "One bellow, and the whole tribe fights harder." }
    ] }
};
// Only to measure the width (open point 3): an Elite with far more Actions than any in the book. The names are placeholders, not rules.
const BUSY = { ...NPCS.ogre, name: "A busy Elite", actions: [
  NPCS.ogre.actions[0],
  ...[["Special A", 1, "round"], ["Special B", 2, "round"], ["Special C", 2, "round"], ["Special D", 3, "encounter"]].map(([name, ap, freq]) => ({ group: "special", name, ap, freq })),
  ...[["Reaction A", 1], ["Reaction B", 2]].map(([name, ap]) => ({ group: "react", name, ap, reaction: true, freq: "round" })),
  ...[["Escalation A", 1, 2], ["Escalation B", 2, 4]].map(([name, ap, escalation]) => ({ group: "esc", name, ap, freq: "round", escalation }))
] };

const fq = a => `var(--fq-${FREQ_COLORS[a.freq] ? a.freq : "none"})`;   // the frequency colors, as theme variables (the light set is FREQ_COLORS)
const cost = a => (a.reaction ? `${a.ap}R` : `${a.ap} AP`);
const locked = (n, a) => a.escalation && (n.escalation ?? 0) < a.escalation;
const vbtn = (n, a, v = null) => { const lab = v ? (a.reaction ? `${v}R` : `${v} AP`) : cost(a); return a.used ? `<button class="vb used" title="Used this encounter">${lab}</button>` : locked(n, a) ? `<button class="vb no" title="Needs Escalation ${a.escalation}">${lab}</button>` : `<button class="vb" title="Click: the roll dialog on this Version. Right-click: the Action card.">${lab}</button>`; };
const byGroup = n => Object.keys(GROUPS).map(g => [g, n.actions.filter(a => a.group === g)]).filter(([, l]) => l.length);
const pool = a => `<span class="pool ${a.pool === "R" ? "r" : "v"}">${a.pool === "R" ? "R" : "V"}</span>`;
const dmg = (a, t) => (!t ? '<span class="none">No effect</span>' : t === "0" ? '<span class="none">0</span>' : `${pool(a)}${t} <span class="sub">${a.sub}</span>`);
const pips = (now, max) => `<span class="pips">${Array.from({ length: max }, (_, i) => `<i class="${i < now ? "on" : ""}"></i>`).join("")}</span>`;

/* ------------------------------------------------------------------ 1. the one-page sheet */
const tools = `<span class="oa-tools" title="Edit, delete">${ic("pen-to-square")}${ic("trash")}</span>`;
const traitText = a => (a.traits ?? []).map(t => TRAITS[t][0]).join(", ");
function rowFull(n, a) {
  const tierNames = ["Tier 1", "Tier 2", "Tier 3"];
  const rider = i => (a.rider && a.rider.on.includes(tierNames[i]) ? `, <span class="cond">${a.rider.text.replace(/ \(.*/, "")}</span>${a.rider.text.includes("(") ? ` ${a.rider.text.match(/\(.*\)/)[0]}` : ""}` : "");
  // an effect on Tier 2 and Tier 3 both is written once, under the Tiers ("Tier 2+"), not in each cell
  const plus = a.rider && a.rider.on === "Tier 2 and Tier 3", riderHtml = a.rider ? `<span class="cond">${a.rider.text.replace(/ \(.*/, "")}</span>${a.rider.text.includes("(") ? ` ${a.rider.text.match(/\(.*\)/)[0]}` : ""}` : "";
  const tiers = a.noTiers ? "" : `<div class="oa-t">${a.tiers.map((t, i) => `<div class="t${i + 1}"><span class="tl">${tierNames[i]}</span><span class="tv">${dmg(a, t)}${plus ? "" : rider(i)}</span></div>`).join("")}</div>${plus ? `<div class="oa-fx"><b class="tplus">Tier 2+</b> ${riderHtml}.</div>` : ""}`;
  const sep = '<span class="sep">;</span> ';
  const meta = [a.trigger ? `<b>Trigger</b> ${a.trigger.replace(/\.$/, "")}` : "", a.vs ? `<b>Vs.</b> ${a.vs}` : "", `<b>Distance</b> ${a.dist}`, `<b>Target</b> ${a.target}`].filter(Boolean).join(sep);
  return `<div class="oa${a.used || locked(n, a) ? " dim" : ""}" style="--fq:${fq(a)}">
    <div class="oa-h">${vbtn(n, a)}<span class="n">${a.name}</span><span class="tr">(${traitText(a)})</span><span class="fq"><i>✦</i> ${a.escalation ? `Escalation ${a.escalation}, ` : ""}${FREQ[a.freq]}${a.used ? ", used" : ""}</span>${tools}</div>
    <div class="oa-meta">${meta}</div>${tiers}${a.effect ? `<div class="oa-fx">${a.effect}</div>` : ""}
  </div>`;
}
const rowLine = (n, a) => `<div class="ol${a.used || locked(n, a) ? " dim" : ""}" style="--fq:${fq(a)}">${vbtn(n, a)}<span class="tx"><i class="n">${a.name}</i> (${a.kind}${a.used ? "; <b>used</b>" : ""}): ${a.pool === "R" ? "[R] " : ""}${a.line}</span>${tools}</div>`;
function sheet(n, mode) {
  const hp = n.vigor[0] + n.resolve[0], max = n.vigor[1] + n.resolve[1], pct = (v, m) => Math.max(0, Math.min(100, Math.round(100 * v / m)));
  const gauge = (k, l, [v, m]) => `<span class="gauge ${k}"><span class="k">${l}</span> <b class="${v < 0 ? "neg" : ""}">${v < 0 ? sign(v) : v}</b> / ${m} <span class="track"><i style="width:${pct(v, m)}%"></i></span></span>`;
  const states = [n.vigor[0] <= 0 ? '<span class="state">Bloodied</span>' : "", n.resolve[0] <= 0 ? '<span class="state s">Strained</span>' : ""].join("");
  const bands = byGroup(n).map(([g, list]) => {
    const [label, color] = GROUPS[g];
    const right = g === "esc" ? `<span class="r">${pips(n.escalation, 6)} ${n.escalation} / 6</span>` : g === "special" && list.length > 1 ? '<span class="r">by AP</span>' : "";
    const ladder = g === "esc" ? (n.ladder ?? []).map(([k, t]) => `<div class="passive${n.escalation >= k ? "" : " off"}"><span class="num">${k}</span><span>${t}</span></div>`).join("") : "";
    return `<div class="band${g === "react" ? " react" : ""}" style="--gc:${color}">${label}${right}</div>${ladder}${list.map(a => (mode === "a" ? rowFull(n, a) : rowLine(n, a))).join("")}`;
  });
  // an Elite with no Escalation Action still shows its ladder
  const A = [["Body", "body"], ["Mind", "mind"], ["Appeal", "appeal"], ["Instinct", "instinct"]];
  return `<div class="win"><div class="win-head">${ic("user")} ${n.name}<span class="sp">${ic("gear")} Sheet ${ic("xmark")}</span></div>
  <div class="ops">
    <div class="ops-hb rk-${n.rank.toLowerCase()}"><div class="nm">${n.name}</div><div class="who"><b>${n.rank} ${n.role}</b><span>Level ${n.level} (Stage 0) &middot; CV ${n.cv}</span></div></div>
    <div class="ops-tabs"><a class="on">Main</a><a>Build</a><a>Effects</a><a>Notes</a><span class="tools"><a title="Roll Initiative">${ic("dice-d20")}</a><a title="Senses">${ic("eye")}</a></span></div>
    <div class="ops-stats">
      <div class="sbl"><span class="k">HP</span> <b class="big">${hp}</b> / ${max} <span class="track hpbar"><i style="width:${pct(hp, max)}%"></i></span>${states}</div>
      <div class="sbl two">${gauge("v", "Vigor", n.vigor)}${gauge("r", "Resolve", n.resolve)}</div>
      <div class="sbl"><span class="k">Armor Defense</span> <b class="big">${n.ad}</b><i class="sp"></i><span class="k">Ward Defense</span> <b class="big">${n.wd}</b><i class="sp"></i><span class="k">Speed</span> <b class="big">${n.speed}</b><i class="sp"></i><span class="k">Steadiness</span> <b>${n.steadiness ?? 0}</b><i class="sp"></i><span class="k">AP</span> <b>${n.ap}</b></div>
      <div class="sbl"><span class="k">Resist</span> ${n.resist ?? "—"}<i class="sp"></i><span class="k">Weak</span> ${n.weak ?? "—"}</div>
    </div>
    <div class="ops-body">
      ${bands.join("")}
      <div class="ops-attrs">${A.map(([l, k]) => `<div class="attr" style="--c:var(--c-${k})" title="Click: a ${l} Check or Save"><span>${l}</span><b>${sign(n.attrs[k])}</b><small>Vs. ${12 + n.attrs[k]}</small></div>`).join("")}
        <div class="attr gap" style="--c:var(--c-wmod)"><span>Weapon Mod.</span><b>${sign(n.wmod)}</b><small>&nbsp;</small></div><div class="attr" style="--c:var(--c-pmod)"><span>Power Mod.</span><b>${sign(n.pmod)}</b><small>&nbsp;</small></div></div>
    </div>
  </div></div>`;
}
// The right-click card: the system's Action card (D2) markup, drawn by hand from the same model.
function card(n, a) {
  const groups = ["roll", "requires", "kind", "keywords"].map(g => { const ks = a.traits.filter(t => TRAITS[t][1] === g); return ks.length ? `<span class="ap-tg"><span class="ap-cs">${ks.map(k => `<span class="ap-chip g-${g}">${TRAITS[k][0]}</span>`).join("")}</span><i>${g[0].toUpperCase() + g.slice(1)}</i></span>` : ""; }).filter(Boolean).join('<span class="ap-gdiv"></span>');
  const st = '<span class="ap-st">✦</span>';
  const meta = `<div class="trow">${[`<b>Target</b> ${a.target}`, `<b>Distance</b> ${a.dist}`, a.vs ? `<b>Vs.</b> ${a.vs}` : ""].filter(Boolean).join(st)}</div>${a.trigger ? `<div class="trow"><b>Trigger</b> ${a.trigger}</div>` : ""}`;
  const names = ["Tier 1", "Tier 2", "Tier 3"];
  const cell = (t, i) => (!t ? '<span style="color:#8f8774">No effect.</span>' : t === "0" ? "0" : `<span class="dt-body">♥</span> <span class="dtamt">${t}</span> <span class="dtype">${SUB[a.sub]}</span>`) + (a.rider && a.rider.on.includes(names[i]) ? `<span class="ap-rid"><span class="arr">↳</span> <span class="ap-mv">${a.rider.text}</span></span>` : "");
  const table = a.noTiers ? `<div class="ap-fxh">Effect</div><div class="ap-fxl plain"><div class="ap-fxt one">${a.effect}</div></div>`
    : `<div class="ap-ttw"><table class="ap-tt"><thead><tr><th></th><th><button type="button" class="ap-vbtn">${cost(a)}</button></th></tr></thead><tbody>${a.tiers.map((t, i) => `<tr class="t${i + 1}"><td class="tl">${names[i]}</td><td>${cell(t, i)}</td></tr>`).join("")}</tbody></table></div>`;
  return `<div class="cardpop"><div class="twod12 acard d2" style="border-top:1px solid #1b2433;border-radius:4px">
    <div class="ap-title"><b>${a.name}</b><span class="ap-tcost">${cost(a)}</span></div>
    <div class="ap-trow">${groups}<span class="ap-cat">${n.name} <span class="ap-freq" style="background:${fq(a)}">${FREQ[a.freq]}</span></span></div>
    <div class="ap-meta">${meta}</div>${table}
    <div class="ap-flav"><div class="dv">◆ ◆ ◆</div>${esc(a.flavor)}</div>
  </div></div>`;
}

/* ------------------------------------------------------------------ 2 to 4. the HUD */
const idBlock = (o, img) => `<div class="hud-id">${img ? `<img src="${ART}${o.img}" alt="">` : ""}<div><div class="nm">${o.name}</div><div class="sb">${o.sub}</div></div></div>`;
const hotbar = (slim = false) => { const f = { 1: "dice-d20", 2: "campground", 3: "lightbulb", 5: "music" }; return `<div class="hud-hot" title="The hotbar: macros, one click away"><div class="hot-grid">${Array.from({ length: 10 }, (_, i) => { const k = (i + 1) % 10; return `<i class="${f[i + 1] ? "f" : ""}" data-k="${k}">${f[i + 1] ? ic(f[i + 1]) : ""}</i>`; }).join("")}</div><div class="hot-pg">${ic("chevron-up")}<span>1</span>${ic("chevron-down")}</div></div>`; };
const npcSub = n => `${n.rank} &middot; CV ${n.cv}`;
const haBtn = (n, a) => `<span class="ha${a.used || locked(n, a) ? " dim" : ""}" style="--fq:${fq(a)}"><b>${a.name}</b>${locked(n, a) ? `<span class="lk">${ic("lock")}</span>` : ""}<span class="vs">${(a.aps ?? [a.ap]).map(v => vbtn(n, a, v)).join("")}</span></span>`;
const SAVES = [["Body", "body", "Bo"], ["Mind", "mind", "Mi"], ["Appeal", "appeal", "Ap"], ["Instinct", "instinct", "In"]];
const savesGroup = n => `<div class="hud-g g-saves"><span class="hud-gl">Checks and Saves</span><div class="hud-acts">${SAVES.map(([l, k, s]) => `<span class="sv" style="--c:var(--hc-${k})" title="${l}: Check or Save">${s} <b>${sign(n.attrs[k])}</b></span>`).join("")}</div></div>`;
// The NPC's bar (Lucas, 2026-11-12: "the same amount as the PC occupies"): the PC's frame. Two lines, never more: its attacks on the first
// (Basic, Special), the rest on the second (Reactions, Escalation, Checks and Saves). What doesn't fit a line folds into a "+N more" button.
function hudNpc(n, { img = true, saves = true, hot = true } = {}) {
  const g = Object.fromEntries(byGroup(n));
  const grp = k => (g[k] ? `<span class="hn-g g-${k}"><span class="hud-gl">${GROUPS[k][0]}${k === "esc" ? ` ${pips(n.escalation, 6)}` : ""}</span>${g[k].map(a => haBtn(n, a)).join("")}</span>` : "");
  const sv = saves ? `<span class="hn-g g-saves"><span class="hud-gl">Checks and Saves</span>${SAVES.map(([l, k, s]) => `<span class="sv" style="--c:var(--hc-${k})" title="${l}: Check or Save">${s} <b>${sign(n.attrs[k])}</b></span>`).join("")}<button class="cat sv-all">${ic("dice")} Checks and Saves</button></span>` : "";
  return `<div class="hud npc rk-${n.rank.toLowerCase()}${img ? "" : " noimg"}">${idBlock({ ...n, sub: npcSub(n) }, img)}<div class="hud-npcmain"><div class="hn-line l1">${grp("basic")}${grp("special")}</div><div class="hn-line l2">${grp("react")}${grp("esc")}${sv}</div></div>${hot ? hotbar() : ""}</div>`;
}
// The Paladin: Aveline (the system's sample PC), with today's Paladin cards (her Stage 0 cards are not written yet: only the layout matters here).
const PAL = { name: "Aveline", img: "pcs/aveline.png", sub: "Human Paladin &middot; Level 1", attrs: { body: 2, mind: 0, appeal: 1, instinct: 1 }, escalation: 2 };
const P = (name, aps, freq, x = {}) => ({ name, aps, ap: aps[0], freq, ...x });
const PCATS = [
  { key: "actions", label: "Actions", icon: "hand-fist", cols: [["Actions (her class and Talents)", "g-special", [P("Smite", [1, 2, 3], "round"), P("Holy Wrath", [2, 3], "encounter")]]] },
  { key: "basic", label: "Basic Actions", icon: "person-running", cols: [
    ["Basic", "g-basic", [P("Weapon Attack", [1], "atwill", { note: "Greatsword" }), P("Fists", [1], "atwill"), P("Charge", [2], "round"), P("Shove", [1, 2, 3], "round"), P("Trip", [1, 2], "round"), P("Haul", [1, 2, 3], "round"), P("Relocate", [1, 2, 3], "atwill")]],
    ["Movement", "g-basic", [P("Advance", [1], "atwill"), P("Evade", [1, 2], "atwill"), P("Stand", [1], "atwill"), P("Crawl", [1, 2], "atwill"), P("Break Free", [1], "atwill"), P("Leaning", [1], "atwill")]]] },
  { key: "reactions", label: "Reactions", icon: "reply", cols: [["Reactions", "g-react", [P("Rebuke", [1], "turn", { reaction: true })]]] },
  { key: "escalation", label: "Escalation", icon: "angles-up", cols: [["Escalation", "g-esc", [P("Radiant Zeal", [], "atwill", { passive: 1 }), P("Searing Blows", [], "atwill", { passive: 2 }), P("Reckoning", [], "atwill", { passive: 3 }), P("Final Verdict", [2], "encounter", { escalation: 3 })]]] },
  { key: "hands", label: "Hands and Gear", icon: "hand", cols: [["Hands and Gear", "g-saves", [P("Draw or stow", [1], "atwill", { note: "Interact" }), P("Switch grip", [1], "atwill", { note: "Regrip" }), P("Drop", [0], "atwill", { note: "Release" }), P("Reload", [1], "atwill")]]] },
  { key: "checks", label: "Checks and Saves", icon: "dice", cols: [] },
  { key: "skills", label: "Skills", icon: "star", later: true, cols: [] },
  { key: "conditions", label: "Conditions and Effects", icon: "heart-pulse", cols: [] },
  { key: "utility", label: "Utility", icon: "campground", cols: [["Utility", "g-saves", [P("Rally", [], "atwill", { go: "1 Rally Point" }), P("Steel Yourself", [2, 3], "round"), P("Guard", [], "atwill", { go: "set or clear" }), P("Take a Breather", [], "atwill", { go: "out of combat" }), P("Rest", [], "atwill", { go: "out of combat" })]]] }
];
const catCount = c => c.cols.reduce((s, [, , l]) => s + l.length, 0);
const popRow = (n, a) => (a.passive ? `<div class="pr txt" style="--fq:var(--g-esc)"><b>${a.name}</b><small>Passive, Escalation ${a.passive}${n.escalation >= a.passive ? "" : " (not yet)"}</small></div>`
  : a.go ? `<div class="pr" style="--fq:#4a5266"><b>${a.name}</b><span class="go">${a.go} ${ic("chevron-right")}</span></div>`
  : `<div class="pr${locked(n, a) ? " dim" : ""}" style="--fq:${fq(a)}"><b>${a.name}</b>${a.note ? `<small>${a.note}</small>` : ""}${locked(n, a) ? `<small>${ic("lock")} Escalation ${a.escalation}</small>` : ""}<span class="vs">${a.aps.map(v => vbtn(n, a, v)).join("")}</span></div>`);
function popFor(key) {
  const c = PCATS.find(x => x.key === key);
  if (key === "checks") return `<div class="pop-col g-saves"><div class="pop-h">Saves</div><div class="pop-grid">${SAVES.map(([l, k]) => `<div class="pr txt" style="--fq:var(--hc-${k})"><b>${l} Save</b><span class="vs"><button class="vb" style="min-width:30px">${sign(PAL.attrs[k])}</button></span></div>`).join("")}</div></div>
    <div class="pop-col g-saves"><div class="pop-h">Checks</div><div class="pop-grid">${SAVES.map(([l, k]) => `<div class="pr txt" style="--fq:var(--hc-${k})"><b>${l} Check</b><span class="vs"><button class="vb" style="min-width:30px">${sign(PAL.attrs[k])}</button></span></div>`).join("")}</div><div class="pr" style="--fq:#4a5266;margin-top:3px"><b>Initiative</b><span class="go">roll ${ic("chevron-right")}</span></div></div>`;
  if (key === "skills") return `<div class="pop-col g-saves"><div class="pop-h">Skills</div><div class="hud-hint" style="padding:6px 2px">A place kept for Skills, when they are made.</div></div>`;
  if (key === "conditions") return `<div class="pop-col g-saves"><div class="pop-h">On Aveline</div><div class="pr txt" style="--fq:#2f7d4f"><b>Radiant Zeal</b><small>until your next Strike</small><span class="go">${ic("xmark")}</span></div><div class="pr txt" style="--fq:#a12b2b"><b>Hindered</b><small>EoT</small><span class="go">${ic("xmark")}</span></div></div>
    <div class="pop-col g-saves"><div class="pop-h">Add</div><div class="pr" style="--fq:#4a5266"><b>A condition</b><span class="go">pick ${ic("chevron-right")}</span></div><div class="pr" style="--fq:#4a5266"><b>An Effect</b><span class="go">pick ${ic("chevron-right")}</span></div></div>`;
  return c.cols.map(([h, cls, list]) => `<div class="pop-col ${cls}"><div class="pop-h">${h}</div>${list.map(a => popRow(PAL, a)).join("")}</div>`).join("");
}
// Quick actions (Lucas, 2026-11-12): the player's favorites, usable without opening a category. Right-click -> Favorite, on an Action or on a single Version.
const QUICK = [P("Smite", [1, 2], "round"), P("Weapon Attack", [1], "atwill"), P("Advance", [1], "atwill"), P("Rebuke", [1], "turn", { reaction: true })];   // Smite: only its 1 AP and 2 AP Versions are favorited
const pcCats = open => PCATS.map(c => `<button class="cat${open === c.key ? " on" : ""}${c.later ? " later" : ""}" data-cat="${c.key}"${c.later ? ' title="When Skills are made"' : ""}>${ic(c.icon)} ${c.label}${c.later ? ' <span class="ct">later</span>' : ""}</button>`).join("");
const pcMain = (open, quick = QUICK) => `<div class="hud-pcmain"><div class="hud-quick"><span class="hud-gl">${ic("star")} Quick</span>${quick.length ? quick.map(a => haBtn(PAL, a)).join("") : '<span class="hud-hint">Right-click an Action or a Version, then Favorite, to put it here.</span>'}</div><div class="hud-cats">${pcCats(open)}</div></div>`;
function hudPc({ img = true, open = "", hot = true, quick = QUICK } = {}) {
  const pop = open ? `<div class="hud-pop" data-pop="${open}">${popFor(open)}</div>` : "";
  return `<div class="hud${img ? "" : " noimg"}" data-pc>${idBlock(PAL, img)}${pcMain(open, quick)}${hot ? hotbar() : ""}${pop}</div>`;
}
// A choice on the map: the HUD keeps its frame (who, the hotbar) and its middle asks the question, with the system's pick bar content.
const hudAsk = () => `<div class="hud asking">${idBlock(PAL, true)}<div class="twod12-linebar twod12-pickbar hud-ask">${guardBar}</div>${hotbar()}</div>`;
const TOKS = [[NPCS.orc, "Orc Warrior 1", ""], [NPCS.orc, "Orc Warrior 2", ""], [NPCS.goblin, "Goblin Sneak 1", ""], [NPCS.goblin, "Goblin Sneak 2", ""], [NPCS.goblin, "Goblin Sneak 3", "hov"], [NPCS.ogre, "Ogre Chieftain", ""]];
const hudList = ({ img = true, hot = true } = {}) => `<div class="hud${img ? "" : " noimg"}"><div class="hud-list"><span class="lbl">6 tokens selected.<br>Click one for its HUD.</span>${TOKS.map(([n, name, c]) => `<span class="tk ${c}">${img ? `<img src="${ART}${n.img}" alt="">` : ""}<span><b>${name}</b><small>${n.rank}</small></span></span>`).join("")}</div>${hot ? hotbar() : ""}</div>`;
const hudEmpty = ({ hot = true, slim = false } = {}) => `<div class="hud${slim ? " slim" : ""}"><div class="hud-empty">No token selected.</div>${hot ? hotbar(slim) : ""}</div>`;
const PLAYERS = [["Lucas", "Gamemaster", "#cc2829", 1], ["Player 2", "Aveline", "#4b9ad8", 1], ["Player 3", "Durgan", "#3b9d53", 1], ["Player 4", "Sylwen", "#d8a13b", 1], ["Player 5", "Kaela", "#8a5bd8", 0]];
const players = open => `<div class="players">${open ? `<ul>${PLAYERS.map(([p, c, col, on]) => `<li class="${on ? "" : "off"}"><i style="--pc:${col}"></i>${p} <small>[${c}]</small></li>`).join("")}</ul>` : ""}<div class="ph">${ic("users")} Players <span class="dots">${PLAYERS.filter(p => p[3]).map(p => `<i style="--pc:${p[2]}"></i>`).join("")}</span> ${ic(open ? "chevron-down" : "chevron-up")}</div></div>`;

/* ------------------------------------------------------------------ 5. the bottom of the screen */
const guardBar = FA(pickBarHtml({ icon: "fa-shield-halved", text: "<b>Shield of Faith</b>: who gains the <b>Guard 5</b>? Click a button, or the creature on the map.", options: [{ id: "a", label: "Aveline", cls: "you" }, { id: "d", label: "Durgan" }, { id: "s", label: "Sylwen", cls: "hover" }] }));
const dock = dockHtml(dockModel({ who: "Orc Warrior", round: 2, ap: 2, rap: 1, max: 4 }), false);
function screen({ hud, playersOpen = false, pick = "", caption = "", sel = "orc" }) {
  const tok = (n, x, y, c = "") => `<img class="s-tok ${c}" src="${ART}${n.img}" style="left:${x}px;top:${y}px" alt="">`;
  const pcs = [["pcs/aveline.png", 520, 460, sel === "pc" ? "sel" : pick ? "cand" : ""], ["pcs/durgan.png", 456, 588, pick ? "cand" : ""], ["pcs/sylwen.webp", 328, 524, pick ? "cand" : ""], ["pcs/kaela.webp", 392, 396, ""]];
  const bar = pick ? `<div class="twod12-linebar twod12-pickbar">${guardBar}</div>` : "";
  return `<div class="screenwrap"><div class="screen">
    <div class="s-nav">${ic("map")} The Orc Camp</div>
    <div class="s-ctl">${["arrow-pointer", "ruler-combined", "pencil", "lightbulb", "music", "note-sticky", "expand", "gear"].map((k, i) => `<i class="${i === 0 ? "on" : ""}">${ic(k)}</i>`).join("")}</div>
    <div class="s-car">${[["pcs/aveline.png", "Aveline", "#3b6d11"], ["npcs/orc-warrior.png", "Orc Warrior", "#a32d2d", 1], ["pcs/durgan.png", "Durgan", "#3b6d11"], ["npcs/goblin-sneak.png", "Goblins", "#a32d2d"], ["pcs/sylwen.webp", "Sylwen", "#3b6d11"], ["npcs/ogre-chieftain.png", "Ogre", "#a32d2d"], ["pcs/kaela.webp", "Kaela", "#3b6d11"]].map(([i, n, c, now]) => `<div class="${now ? "now" : ""}" style="--tc:${c}"><img src="${ART}${i}" alt=""><span>${n}</span></div>`).join("")}</div>
    ${tok(NPCS.orc, 648, 460, sel === "orc" ? "sel" : "")}${tok(NPCS.orc, 712, 588, "")}${tok(NPCS.goblin, 840, 396, "")}${tok(NPCS.goblin, 904, 524, "")}${tok(NPCS.goblin, 776, 332, "")}${tok(NPCS.ogre, 968, 268, "big")}
    ${pcs.map(([i, x, y, c]) => `<img class="s-tok pc ${c}" src="${ART}${i}" style="left:${x}px;top:${y}px" alt="">`).join("")}
    ${caption ? `<div class="s-cap">${caption}</div>` : ""}
    <div class="s-side"><div class="tabs">${["comments", "dice-d20", "map", "users", "suitcase", "book-atlas", "table-list", "music", "gear"].map((k, i) => `<i class="${i === 0 ? "on" : ""}">${ic(k)}</i>`).join("")}</div>
      <div class="log"><div class="s-msg"><div class="h">Cleaver &middot; 1 AP</div><p><b>Orc Warrior</b> hits <b>Aveline</b>: Tier 2, 4 Slashing to Vigor.</p></div><div class="s-msg"><div class="h">Advance &middot; 1 AP</div><p><b>Orc Warrior</b> moves 3 squares.</p></div></div>
      <div class="twod12-dockwrap">${dock}</div><div class="inp">Chat&hellip;</div></div>
    <div class="s-hud${pick === "float" ? " float" : ""}">${players(playersOpen)}${pick === "over" ? hudAsk() : pick === "float" ? bar + hud : hud}</div>
  </div></div>`;
}

/* ------------------------------------------------------------------ the pages */
const FIT = `<script>
document.querySelector(".themes").addEventListener("click", ev => document.body.classList.toggle("light", ev.target.classList.contains("l")));
// the screens are drawn at 1600 x 900 and scaled to the page's width
function fit() { document.querySelectorAll(".screenwrap").forEach(w => { const s = w.firstElementChild, k = Math.min(1, (w.parentElement.clientWidth - 2) / 1600); s.style.transform = "scale(" + k + ")"; w.style.width = Math.round(1600 * k) + "px"; w.style.height = Math.round(900 * k) + "px"; }); }
addEventListener("resize", fit); fit();
// the PC's categories open with a click (the mockup's only live part)
document.querySelectorAll("[data-live]").forEach(h => { const pops = JSON.parse(h.nextElementSibling.textContent); h.addEventListener("click", ev => { const b = ev.target.closest(".cat"); if (!b) return; const was = b.classList.contains("on"); h.querySelectorAll(".cat").forEach(x => x.classList.remove("on")); h.querySelector(".hud-pop")?.remove(); if (was) return; b.classList.add("on"); const p = document.createElement("div"); p.className = "hud-pop"; p.innerHTML = pops[b.dataset.cat]; h.append(p); place(h, p, b); }); });
// an NPC's line that doesn't fit: its last Actions fold into a "+N more" button (the bar never grows)
document.querySelectorAll(".hn-line").forEach(l => { const c = [...l.querySelectorAll(".ha")]; let n = 0, m = null; if (l.scrollWidth > l.clientWidth) l.classList.add("nosv"); while (l.scrollWidth > l.clientWidth && n < c.length) { c[c.length - 1 - n].hidden = true; n++; if (!m) { m = document.createElement("button"); m.className = "hn-more"; m.title = "The Actions that don't fit: click for a panel, as a PC's category"; l.append(m); } m.textContent = "+" + n + " more"; } });
function place(h, p, b) { const left = Math.max(0, Math.min(b.offsetLeft - 10, h.clientWidth - p.offsetWidth)); p.style.left = left + "px"; p.style.setProperty("--ax", (b.offsetLeft - left + 24) + "px"); }
document.querySelectorAll(".hud-pop[data-pop]").forEach(p => { const h = p.closest(".hud"); place(h, p, h.querySelector(".cat.on")); });
// how many Version buttons fit a row (open point 3): written under each measured bar
document.querySelectorAll("[data-measure]").forEach(m => { const h = m.previousElementSibling, all = h.querySelectorAll(".ha").length, hid = h.querySelectorAll(".ha[hidden]").length; m.textContent = h.offsetWidth + " px wide, " + h.offsetHeight + " px high: " + all + " Actions, " + (hid ? (all - hid) + " shown and " + hid + " folded into the more button." : "all shown."); });
</script>`;
const page = (file, title, body) => writeFileSync(here(`./${file}`), inlineArt(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<!-- GENERATED by npc-hud-build.mjs (pack-npc-hud-mockups, 2026-11-12): edit the script, not this file. A mockup: nothing here is built in the system. -->
<!-- Self-contained: Signika, the rules of the system's CSS that the page uses (twod12/styles/system.css: the Action card, the Turn dock, the pick bar, Cinzel) and npc-hud.css are embedded below; the art is embedded once, as small copies. -->
<style>${FONT_CSS}</style>
<style>${SYSTEM_CSS}</style>
<style>${ART_CSS}</style>
<style>${MOCK_CSS}</style>
</head>
<body class="mock">
<h1>${title} <span class="themes"><button class="d">Dark (default)</button><button class="l">Light</button></span></h1>
<div class="nav">${[["npc-hud-sheet.html", "1. The one-page NPC sheet"], ["npc-hud-hud.html", "2 to 4. The HUD"], ["npc-hud-screen.html", "5. The bottom of the screen"]].map(([f, l]) => `<a href="${f}"${f === file ? ' class="here"' : ""}>${l}</a>`).join("")}</div>
${body}
${FIT}
</body>
</html>
`));
const PICK = '<span class="tag pick">Proposed</span>', ALT = '<span class="tag alt">Alternative</span>', PICKED = '<span class="tag pick">Picked by Lucas</span>', NOT = '<span class="tag alt">Not picked</span>';
const box = (id, title, tag, why, html, extra = "") => `<div class="col" id="${id}"><h3>${title} ${tag}</h3>${why ? `<p class="why">${why}</p>` : ""}${html}${extra}</div>`;
const measure = '<span class="measure" data-measure></span>';

// ---- page 1
page("npc-hud-sheet.html", "NPC-HUD mockups 1: the one-page NPC sheet", `
<p class="lead">A second NPC sheet for experienced GMs (the current sheet stays). The Main tab is the whole stat block; Build, Effects and Notes are the other tabs. The numbers are the Bestiary's Stage 0 examples; the Health is pack HP's model (one HP bar, the Vigor and Resolve gauges, which can go below 0). <b>Lucas picked (a) full text (2026-11-12).</b> <b>The sheet as a printed stat block</b> (Lucas's fifth and sixth reviews, 2026-11-12): a name plate in the rank's color, the stats as ruled lines of text; each Action under a header bar in its frequency's color (as 4e shades a power's header) with <b>a faint tint of the same color behind the whole Action</b>; its line of rules text; <b>the three Tiers side by side, each under a rule in its Tier's color</b> (no table); an effect on Tier 2 and Tier 3 both written once ("Tier 2+"); a description-only Action is just its text. The Attributes and Modifiers as tiles, as before. Dark by default; the Light button at the top shows the parchment page. A click on a cost stamp opens the roll dialog, a right-click on a row opens the Action card.</p>
<h2>The name plate: one color per rank</h2>
<p class="why">Lucas, 2026-11-12: one color per rank, as 4e colors its monsters. Minion slate, Grunt olive, Standard maroon, Elite purple. (The HUD's portrait ring takes the same color.)</p>
<div class="cols">${[["Goblin Sneak", "Minion Skirmisher", "Level 1 (Stage 0) &middot; CV 25", "minion"], ["Bandit Thug", "Grunt", "Level 1 (Stage 0) &middot; CV 50", "grunt"], ["Orc Warrior", "Standard Soldier", "Level 1 (Stage 0) &middot; CV 100", "standard"], ["Ogre Chieftain", "Elite Striker", "Level 1 (Stage 0) &middot; CV 200", "elite"]].map(([n, r, l, k]) => `<div class="ops" style="width:290px"><div class="ops-hb rk-${k}"><div class="nm" style="font-size:15px">${n}</div><div class="who"><b>${r}</b><span>${l}</span></div></div></div>`).join("")}</div>
<h2>Orc Warrior (Standard), mid-fight: 14 Vigor lost</h2>
<div class="cols">
  ${box("orc-a", "(a) Full text, with the Tier table", PICKED, "Everything is read on the sheet: traits, Target, Distance, Vs., the three Tiers side by side (a one-Version Action's Tier table, turned on its side).", sheet(NPCS.orc, "a"))}
  ${box("orc-b", "(b) One line, as the Bestiary writes it", NOT, "The book's line, with the Version button in front. The rest is one right-click away.", sheet(NPCS.orc, "b"), `<div style="margin-top:14px"><p class="rc">${ic("arrow-pointer")} Right-click on Brutal Swing: the system's Action card</p>${card(NPCS.orc, NPCS.orc.actions[1])}</div>`)}
</div>
<h2>Ogre Chieftain (Elite), Bloodied, Escalation 4, Ground Slam used</h2>
<div class="cols">
  ${box("ogre-a", "(a) Full text", PICKED, "A Save Action shows its Tiers in the targets' order (Tier 1 is the worst for them). The Escalation band holds the ladder and the pips.", sheet(NPCS.ogre, "a"))}
  ${box("ogre-b", "(b) One line", NOT, "Used and locked Actions are dimmed and their button is struck or dashed (the same in the HUD).", sheet(NPCS.ogre, "b"), `<div style="margin-top:14px"><p class="rc">${ic("arrow-pointer")} Right-click on Ground Slam</p>${card(NPCS.ogre, NPCS.ogre.actions[1])}</div>`)}
</div>
`);

// ---- page 2
const live = JSON.stringify(Object.fromEntries(PCATS.map(c => [c.key, popFor(c.key)]))).replace(/</g, "\\u003c");
page("npc-hud-hud.html", "NPC-HUD mockups 2 to 4: the HUD", `
<p class="lead">One HUD for PCs and NPCs, <b>in the chat card's look</b> (Lucas, 2026-11-12: the chat card is the base of the design from here on): <b>dark by default</b> (the Light button at the top shows the parchment set), a thin line, a filled button for a Version, outlined buttons for the rest, Signika everywhere for reading. The group names are all one color; a frequency's color is only on a row's left edge. No Health, AP, Guard or uses: only a used or locked Action is dimmed. <b>Click a Version button: the roll dialog on that Version. Right-click: the Action card.</b> The bars below are drawn at the width they would have on a 1600 px wide screen (1276 px between the left edge and the sidebar) unless a line says otherwise.</p>

<h2>2. An NPC: the PC's frame, everything visible</h2>
<p class="why"><b>Redrawn after Lucas's second review (2026-11-12): an NPC's bar takes exactly what a PC's takes.</b> The same two lines and the same 70 px, always. The first line is its attacks (Basic, Special), the second the rest (Reactions, Escalation, Checks and Saves), so each thing is always in the same place. No categories and no click to see an Action. It never grows: on a line that is too full, the four Check / Save buttons first become one button, then the last Actions fold into a "+N more" button.</p>
<div class="stack" style="width:1276px">
  ${box("npc-goblin", "Goblin Sneak (Minion)", PICK, "", hudNpc(NPCS.goblin), measure)}
  ${box("npc-orc", "Orc Warrior (Standard): a Reaction on the second line", PICK, "", hudNpc(NPCS.orc), measure)}
  ${box("elite-flat", "Ogre Chieftain (Elite): flat like any NPC", PICK, "Ground Slam is used (struck); the Escalation pips sit on the group's name.", hudNpc(NPCS.ogre), measure)}
  ${box("npc-orc-noimg", "Orc Warrior, without the portrait", ALT, "The same height; it only gives back the portrait's width.", hudNpc(NPCS.orc, { img: false }), measure)}
  ${box("elite-cats", "Ogre Chieftain, with categories like a PC", ALT, "Three Actions hidden behind three clicks: it costs a click on every use and shows nothing at a glance.", `<div class="hud">${idBlock({ ...NPCS.ogre, sub: npcSub(NPCS.ogre) }, true)}<div class="hud-cats">${[["Actions", "hand-fist"], ["Reactions", "reply"], ["Escalation", "angles-up"], ["Checks and Saves", "dice"], ["Conditions and Effects", "heart-pulse"]].map(([l, i]) => `<button class="cat">${ic(i)} ${l}</button>`).join("")}</div>${hotbar()}</div>`)}
</div>
<h2>The width test: a made-up Elite with 9 Actions (placeholder names, not rules)</h2>
<p class="why">Far more than any creature in the book has. The bar keeps its height at every width.</p>
<div class="stack" style="width:1276px">
  ${box("elite-busy", "On a 1600 px screen (1276 px for the HUD)", '<span class="tag">Measure</span>', "", hudNpc(BUSY), measure)}
</div>
<div class="stack" style="width:1042px">
  ${box("elite-busy-1366", "On a 1366 px laptop (1042 px for the HUD)", '<span class="tag">Measure</span>', "", hudNpc(BUSY), measure)}
  ${box("npc-ogre-1366", "Ogre Chieftain on the 1366 px laptop", '<span class="tag">Measure</span>', "", hudNpc(NPCS.ogre), measure)}
</div>

<h2>3. A PC (the Paladin): categories, opened by a click</h2>
<p class="why">Aveline, the system's sample Paladin, with today's Paladin cards (her Stage 0 cards are not written yet: only the layout matters). <b>Changed after Lucas's review (2026-11-12):</b> a <b>Quick</b> row on top for the player's favorites (right-click &rarr; Favorite, on an Action or on one Version: here Smite's 1 AP and 2 AP only); <b>Actions, Basic Actions and Reactions</b> are three buttons; a place is kept for <b>Skills</b>. <b>The first bar is live: click a category.</b></p>
<div class="stack" style="width:1276px">
  ${box("pc-closed", "Closed, with the portrait (live: click the categories)", PICK, "The Quick row on top (favorites, used with one click; Smite shows only its two favorited Versions), the categories under it. Skills is a kept place, dashed until they exist.", `<div style="padding-top:8px">${hudPc().replace("data-pc", "data-pc data-live")}<script type="application/json">${live}</script></div>`)}
  ${box("pc-closed-noimg", "Closed, without the portrait", ALT, "", hudPc({ img: false }))}
  ${box("pc-noquick", "Nothing pinned yet", PICK, "The Quick row says how to fill it; the bar keeps its height.", hudPc({ quick: [] }))}
  ${box("pc-actions", "Actions, open", PICK, "Her class's Actions and Talents. One row per Action, one button per Version; the left edge is the frequency's color (blue Round, red Encounter).", `<div style="padding-top:110px">${hudPc({ open: "actions" })}</div>`)}
  ${box("pc-basic", "Basic Actions, open", PICK, "The Actions every creature has, in two columns: Basic and Movement.", `<div style="padding-top:300px">${hudPc({ open: "basic" })}</div>`)}
  ${box("pc-escalation", "Escalation, open", PICK, "Passives are read, not clicked. An Action above her Escalation is locked (dashed).", `<div style="padding-top:170px">${hudPc({ open: "escalation" })}</div>`)}
  ${box("pc-checks", "Checks and Saves, open (without the portrait)", ALT, "", `<div style="padding-top:185px">${hudPc({ img: false, open: "checks" })}</div>`)}
</div>

<h2>4. Several tokens selected, and nothing selected</h2>
<div class="stack" style="width:1276px">
  ${box("list", "Six tokens selected: the list", PICK, "A click selects that token alone and opens its HUD. The hovered one lights up as a pick bar's candidate does (here and on the map).", hudList())}
  ${box("list-noimg", "The list, without portraits", ALT, "", hudList({ img: false }))}
  ${box("empty", "The GM with nothing selected: the empty bar, at the HUD's height", PICK, "The same height as any HUD, so the hotbar and the players list never move. (A player with nothing selected sees their own character's HUD.)", hudEmpty())}
</div>
`);

// ---- page 3
page("npc-hud-screen.html", "NPC-HUD mockups 5: the bottom of the screen", `
<p class="lead">The whole screen at 1600 x 900, scaled to this page. The HUD runs across the bottom, from the left edge to the sidebar. The hotbar is the two short rows at the HUD's right end; the players list sits above the HUD's left end, closed by default. The map, the scene controls, the carousel and the chat are stand-ins; <b>the Turn dock (above the chat's input) and the pick bar are the system's real ones.</b></p>
<h2>5a. An NPC selected; the players list closed</h2>
${screen({ hud: hudNpc(NPCS.orc), caption: "<b>The Orc Warrior is selected</b> (the orange ring): its HUD. The Turn dock on the right shows its AP, so the HUD doesn't." })}
<h2>5b. A PC selected, a category open; the players list open</h2>
${screen({ hud: hudPc({ open: "basic" }), playersOpen: true, sel: "pc", caption: "<b>Aveline is selected.</b> The players list opens upward and covers none of Foundry's own controls. A category's panel that would open under it closes the list." })}
<h2>5c. A choice on the map: the HUD asks the question ${PICKED}</h2>
<p class="why">Redrawn after Lucas's review (2026-11-12: the first version replaced the whole HUD with a stretched bar and looked broken). <b>The HUD keeps its frame</b>: who is asking on the left, the hotbar on the right. Only the middle (the Quick row and the categories, which can't be used while a roll waits) becomes the pick bar's question and buttons, with a gold glow; it comes back when the choice is made.</p>
${screen({ hud: hudPc(), pick: "over", sel: "pc", caption: "<b>Shield of Faith</b> asks who gains the Guard. The candidates are outlined in gold on the map, as today." })}
<h2>5d. The pick bar floating above the HUD ${NOT}</h2>
<p class="why">Today's place, raised to clear the HUD (which dims). It keeps the HUD visible, but covers a strip of the map and the bar is narrower.</p>
${screen({ hud: hudPc(), pick: "float", sel: "pc" })}
`);
console.log("built: npc-hud-sheet.html, npc-hud-hud.html, npc-hud-screen.html");
