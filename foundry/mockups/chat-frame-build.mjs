// The chat message frame (Lucas, 2026-11-13, "big design question": remove Foundry's own background around our chat cards, and put the
// token's name, the time since the message and the trash bin in our cards, so they are bigger and easier to read). Mockups only; nothing in
// the system changes.   node foundry/mockups/chat-frame-build.mjs   ->   chat-frame.html
// The cards are drawn by the system's own functions with the system's real stylesheets (styles/system.css and the theme, styles/theme.css,
// v0.0.371), so "Today" is what Foundry shows now except Foundry's own frame, which is drawn here by hand (approximate: Foundry V14's look).
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { ICONS } from "./npc-hud-icons.mjs";
import { SIGNIKA } from "./npc-hud-signika.mjs";

const here = f => fileURLToPath(new URL(f, import.meta.url));
const ic = n => { const [vb, d] = ICONS[n]; return `<svg class="ic" viewBox="${vb}" aria-hidden="true"><path d="${d}"/></svg>`; };
const FA = html => html.replace(/<i class="fa-solid fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="${rest.trim()}" data-ic="${n}"${attrs}>${ic(n)}</i>` : m));
const art = f => `data:image/webp;base64,${execFileSync("python3", ["-c", "import sys,io,base64;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((96,96));b=io.BytesIO();im.save(b,'WEBP',quality=80);sys.stdout.write(base64.b64encode(b.getvalue()).decode())", here(`../twod12/art/${f}`)]).toString()}`;
const SYS = readFileSync(here("../twod12/styles/system.css"), "utf8").replace(/url\("\.\.\/fonts\/[^"]+"\)/g, "none");
const THEME = readFileSync(here("../twod12/styles/theme.css"), "utf8");
const FONTS = Object.entries(SIGNIKA).map(([w, d]) => `@font-face { font-family: "Signika"; font-weight: ${w}; font-style: normal; src: url(data:font/woff2;base64,${d}) format("woff2"); }`).join("\n");

/* ------------------------------------------------------------------ the messages (the system's functions) */
const CC = await import("../twod12/module/chatcards.mjs"), RL = await import("../twod12/module/roll.mjs"), SM = await import("../twod12/module/sysmsg.mjs");
const D = f => ({ faces: f, total: CC.dieValue(f), first: f[0] });
const row = (d1, d2, total, dc, extra = {}) => ({ name: "Orc Warrior", uuid: "t1", total, dc, dcLabel: "AD", d1, d2, boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Weapon" }], ...extra, ...(() => { const x = RL.keepDice([D(d1), D(d2)], "", total - CC.dieValue(d1) - CC.dieValue(d2), dc); return { tier: x.tier, base: x.base, crit: x.crit, doubles: x.doubles }; })() });
const wrap = h => `<div class="twod12 chat cc">${FA(h)}</div>`;
const attack = wrap(CC.attackCardHtml({ kind: "attack", name: "Smite", freq: "round", cost: "2 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Weapon", names: ["Orc Warrior"] }, hasDamage: true, rows: [row([4], [9], 15, 13)] }));
const damage = wrap(CC.damageCardHtml({ kind: "dmg", name: "Smite", nl: false, groups: [{ tier: 2, comps: [{ pool: "B", sub: "Sl", total: 9, formula: "2d6", dice: [{ faces: 6, results: [4, 5] }], src: "Greatsword" }, { pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }, { pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }], src: "Smite" }], riders: [], rows: [0] }], rows: [{ name: "Orc Warrior", mods: [], choice: "", applied: null }] }, CC.viewOf({ gm: true })));
const line = FA(SM.sysLine("fa-shield-heart", "<b>Aveline</b> gains <b>Guard 5</b> <small>(1d8 + 2 = 5)</small>."));
const AV = art("pcs/aveline.png"), OG = art("npcs/ogre-chieftain.png");
const MSGS = [{ who: "Aveline", img: AV, ago: "2m", html: attack, kind: "card" }, { who: "Aveline", img: AV, ago: "1m", html: damage, kind: "card" }, { who: "Aveline", img: AV, ago: "now", html: line, kind: "line" }];
const trash = `<a class="message-delete" aria-label="Delete">${ic("trash")}</a>`;

/* ------------------------------------------------------------------ Today: Foundry's frame (by hand, approximate) */
const today = m => `<li class="chat-message message"><header class="message-header"><h4 class="message-sender">${m.who}</h4><span class="message-metadata"><time>${m.ago === "now" ? "Now" : `${m.ago} ago`}</time>${trash}</span></header><div class="message-content">${m.html}</div></li>`;
/* A: CSS only. Foundry's elements stay where they are; its box and header are made transparent for our messages, and its header becomes a
   thin line glued on top of our card (the card's surface, its border, small muted text). A one-line message takes the time at its right. */
const optA = m => `<li class="chat-message message tw-a ${m.kind}"><header class="message-header"><h4 class="message-sender">${m.who}</h4><span class="message-metadata"><time>${m.ago === "now" ? "Now" : `${m.ago} ago`}</time>${trash}</span></header><div class="message-content">${m.html}</div></li>`;
/* B: moved into the card. A render hook takes the name, the time and the trash out of Foundry's header (hidden) and puts them in the card:
   the speaker's token image and name before the card's title, the time and the trash at the right of the title row. A one-line message: its
   icon, its text, the time at the right; the trash shows on hover. */
const whoB = m => `<span class="tw-who"><img src="${m.img}" alt=""><b>${m.who}</b></span>`;
const metaB = m => `<span class="tw-meta"><time>${m.ago}</time>${trash}</span>`;
const optB = m => {
  let h = m.html;
  if (m.kind === "card") h = h.replace(/<div class="(cc-card[^"]*)">/, `<div class="$1"><div class="tw-top">${whoB(m)}${metaB(m)}</div>`);
  else h = h.replace(/<\/div>\s*$/, `${metaB(m)}</div>`);
  return `<li class="chat-message message tw-b ${m.kind}"><div class="message-content">${h}</div></li>`;
};
const log = (f, cls) => `<ol class="chat-log ${cls}">${MSGS.map(f).join("")}</ol>`;

/* ------------------------------------------------------------------ the CSS of the frame and the two proposals */
const CSS = `
* { box-sizing: border-box; }
body { margin: 0; background: #2a2723; color: #eee6d6; font: 14px/1.45 "Signika", sans-serif; padding: 22px 22px 60px; }
h1 { font: 600 24px Georgia, serif; margin: 0 0 4px; color: #f3e9d2; } h2 { font: 600 19px Georgia, serif; margin: 30px 0 4px; color: #f3e9d2; border-top: 1px solid #4a443a; padding-top: 16px; }
h3 { font: 600 14px "Signika", sans-serif; margin: 0 0 6px; color: #f3e9d2; } .lead, .why { color: #c9c0ad; max-width: 1100px; } .lead b, .why b { color: #f3e9d2; }
ul.notes { color: #c9c0ad; max-width: 1050px; padding-left: 20px; } ul.notes b { color: #f3e9d2; } ul.notes li { margin-bottom: 4px; }
.tag { font: 700 10.5px "Signika", sans-serif; letter-spacing: .08em; text-transform: uppercase; padding: 2px 7px; border-radius: 3px; background: #5a4a2a; color: #e9dfc8; margin-left: 6px; } .tag.pick { background: #2f6b3a; color: #fff; }
.cols { display: flex; flex-wrap: wrap; gap: 22px; align-items: flex-start; margin-top: 12px; }
.ic { width: 1em; height: 1em; fill: currentColor; vertical-align: -.125em; }
/* the sidebar: Foundry V14's chat column, about 300 px of content */
.side { width: 316px; padding: 8px 6px; } .side.dk { background: #18181b; } .side.lt { background: #d8d2c4; }
.chat-log { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
/* Today: Foundry's message box (approximate) */
.chat-message { position: relative; padding: 4px 6px 6px; border: 1px solid; border-radius: 5px; font-size: 13px; }
.dk .chat-message { background: #2b2b30; border-color: #45454d; color: #e6e3dc; } .lt .chat-message { background: #f1ece0; border-color: #b9ae97; color: #26241f; }
.message-header { display: flex; align-items: baseline; gap: 6px; margin: 0 0 4px; line-height: 18px; }
.message-sender { flex: 1; margin: 0; font: 700 13px "Signika", sans-serif; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.message-metadata { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; opacity: .75; } .message-delete { cursor: pointer; }
/* A: CSS only (li.chat-message:has(.twod12.chat) in the system) */
.chat-message.tw-a { padding: 0; border: 0; background: none !important; }
.chat-message.tw-a .message-header { margin: 0; padding: 2px 8px 1px; border: 1px solid var(--a-line); border-bottom: 1px dotted var(--a-line); border-radius: 5px 5px 0 0; background: var(--a-bg); color: var(--a-mute); }
.chat-message.tw-a .message-sender { font: 600 12px "Signika", sans-serif; color: var(--a-mute); }
.chat-message.tw-a.card .message-header { border-bottom: 0; }
.chat-message.tw-a.card .cc-card { margin-top: 0; border-top-left-radius: 0; border-top-right-radius: 0; border-top: 1px dotted var(--a-line); }
.chat-message.tw-a.card .message-content, .chat-message.tw-a.card .message-content > .twod12.chat { margin: 0; padding: 0; }
.chat-message.tw-a.line { display: flex; flex-direction: row-reverse; align-items: stretch; }
.chat-message.tw-a.line .message-header { border: 0; background: none; padding: 0 0 0 6px; align-items: center; } .chat-message.tw-a.line .message-sender { display: none; }
.chat-message.tw-a.line .message-content { flex: 1; min-width: 0; }
.dk { --a-bg: #1f1c18; --a-line: #7a683f; --a-mute: #b3a68e; --b-mute: #b3a68e; --b-hair: #4a4132; } .lt { --a-bg: #f4ede0; --a-line: #bfae8c; --a-mute: #5d5446; --b-mute: #5d5446; --b-hair: #cdb88a; }
/* B: in the card (a render hook moves the name, the time and the trash; Foundry's header is hidden) */
.chat-message.tw-b { padding: 0; border: 0; background: none !important; }
.chat-message.tw-b .tw-top { display: flex; align-items: center; gap: 6px; margin: -2px 0 5px; padding: 0 0 4px; border-bottom: 1px solid var(--b-hair); font-size: 12px; color: var(--b-mute); }
.chat-message.tw-b .tw-who { display: inline-flex; align-items: center; gap: 6px; flex: 1; min-width: 0; } .chat-message.tw-b .tw-who b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-message.tw-b .tw-who img { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid var(--b-hair); }
.chat-message.tw-b .tw-meta { display: inline-flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--b-mute); white-space: nowrap; }
.chat-message.tw-b.line .twod12.chat.sysline { display: flex; align-items: center; } .chat-message.tw-b.line .tw-meta { margin-left: auto; padding-left: 8px; }
.chat-message.tw-b.line .message-delete { visibility: hidden; } .chat-message.tw-b.line:hover .message-delete { visibility: visible; }
`;
const set = (title, tag, why, html) => `<div><h3>${title}${tag}</h3>${why ? `<p class="why" style="max-width:316px;font-size:12.5px">${why}</p>` : ""}${html}</div>`;
const PROP = '<span class="tag pick">Proposed</span>', TODAY = '<span class="tag">Today</span>';
const row3 = (cls, theme) => `<div class="cols">
${set("Today", TODAY, "Foundry's box and header around our card (drawn here by hand, approximately).", `<div class="side ${cls} ${theme}">${log(today, "")}</div>`)}
${set("A: CSS only", PROP, "Foundry's box goes; its header becomes a thin line on top of our card. Nothing moves; the delete and the time keep working as Foundry's own.", `<div class="side ${cls} ${theme}">${log(optA, "")}</div>`)}
${set("B: in the card", PROP, "The token's image and name, the time and the trash inside the card's top line. Needs a small render hook (it moves Foundry's elements).", `<div class="side ${cls} ${theme}">${log(optB, "")}</div>`)}
</div>`;
writeFileSync(here("./chat-frame.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>The chat message frame</title>
<!-- GENERATED by chat-frame-build.mjs (2026-11-13): a mockup, nothing here is in the system. Self-contained. -->
<style>${FONTS}</style>
<style>${SYS}</style>
<style>${THEME}</style>
<style>${CSS}</style>
</head>
<body>
<h1>The chat message frame</h1>
<p class="lead">Lucas, 2026-11-13: <b>can we remove Foundry's own background around our chat cards</b>, and put the token's name, the time since the message and the trash bin inside our cards, so they are bigger and easier to read? <b>Yes, two ways.</b> The cards below are drawn by the system's own functions with its real stylesheets (system.css and the theme of v0.0.371), at the chat's width (about 316 px). Foundry's own box is drawn by hand and is approximate.</p>
<h2>Dark</h2>
${row3("dk", "twod12-dark twod12-type")}
<h2>Light</h2>
${row3("lt", "twod12-light twod12-type")}
<h2>Notes</h2>
<ul class="notes">
<li><b>Both give the card the chat's full width</b> (Foundry's box took about 14 px and a line of height for its header).</li>
<li><b>A is CSS only:</b> <code>li.chat-message:has(.twod12.chat)</code> loses its box; Foundry's header is restyled as the card's top line. Nothing is added, moved or removed, so it is a style change. Messages that aren't ours (a plain roll, another module's) keep Foundry's box.</li>
<li><b>B moves elements</b> (Foundry's header is hidden and its name, time and trash are drawn in our card by a <code>renderChatMessageHTML</code> hook); it adds the token's image. A whisper's and a blind roll's marks would move in too. One line per message saved.</li>
<li>A one-line message (a Guard line, a follow-up): in A the time and the trash sit at its right; in B the time sits at its right and the trash shows on hover.</li>
<li>My recommendation: <b>B</b> if you want the token's face on every card (it reads faster in a busy chat); <b>A</b> if the time and the trash can stay as Foundry draws them.</li>
</ul>
</body>
</html>
`);
console.log("built: chat-frame.html");
