// v0.0.261 (Lucas, cards session 5): a Reaction with a moment (system.moment) is offered by itself when the moment comes.
// v0.0.272 (pack RX, Lucas's design): the Reactions pass. When a moment comes (a damage about to land, a Strike, a movement), ONE chat message
// lists every Reaction it triggered: a row per creature and Reaction, with Use / Pass for its owner (the system's card, sysCard). The GM has
// "Skip all others"; an auto-skip timer (a world setting, on by default, 1 minute since v0.0.273, paused with a click on the clock) counts down on the message. Nothing lands until every row
// is answered or skipped. The rows used form a stack: they resolve last in, first out (the message shows the order); each is run by its owner's
// client as its card runs today, against the triggering creature. An Interrupt holds the damage until answered; a Trigger is offered after the
// moment and holds nothing. A moment that Reactions watch but none can answer (spent, no AP, Down) posts a one-line note.
// The moments are settings of each Reaction (Moment, Within, You too, Used on): no code here names a card.
// v0.0.275 (pack RX-2, Lucas's design): the message is a stack card (faces, "pick one" groups, slabs in their map colors), a map overlay shows
// it while it is open (rxoverlay.mjs), and once resolved the same message is edited in place into one line that unfolds (a snapshot, the frozen stack).
import { tokenDistance } from "./light.mjs";
import { isFaded } from "./usage.mjs";
import { answererFor } from "./healwin.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
import { moveActionOf } from "./moveseq.mjs";   // v0.0.274: once per Move Action
import * as O from "./rxoverlay.mjs";   // v0.0.275 (pack RX-2): the map overlay
const F = "twod12", SOCKET = "system.twod12";

/** The moments. who: the side of the creature the moment is about, seen from the Reaction's owner. */
export const MOMENTS = {
  wouldDown: { who: "ally", damage: true },
  strikeDamage: { who: "ally", damage: true },
  strikeAgainst: { who: "ally" },
  enemyCloser: { who: "enemy", move: true, closer: true },
  enemyMoves: { who: "enemy", move: true },
  allyDamage: { who: "ally", damage: true }
};

/* ------------------------------------------------------------------ pure pieces (tests) */
/** Pure: would this damage (after the Guard) take the creature to its Health Pool? */
export function wouldGoDown(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = (a?.B?.l ?? 0) + (a?.B?.n ?? 0) + (a?.M?.l ?? 0) + (a?.M?.n ?? 0);
  return pool > 0 && incoming > 0 && now < pool && now + incoming >= pool;
}
/** Pure: the damage is cut so the total stops 1 under the Pool (lethal first, then nonlethal); returns what was cut. */
export function capAtPool(actor, a) {
  const s = actor?.system ?? {}, pool = Number(s.pool) || 0, now = Number(s.totalDamage) || 0;
  const incoming = a.B.l + a.B.n + a.M.l + a.M.n;
  let cut = Math.max(0, now + incoming - (pool - 1)), left = cut;
  for (const [p, k] of [["B", "l"], ["M", "l"], ["B", "n"], ["M", "n"]]) { const take = Math.min(a[p][k], left); a[p][k] -= take; left -= take; if (!left) break; }
  a.momentCut = cut;
  return cut;
}
/** Pure: halve the held damage (rounded up, as the Half button does); returns what was taken off. */
export function halveHeld(a) {
  let off = 0;
  for (const p of ["B", "M"]) for (const k of ["l", "n"]) { const h = Math.ceil(a[p][k] / 2); off += a[p][k] - h; a[p][k] = h; }
  return off;
}
/** Pure: is the subject on the side the moment wants, seen from the Reaction's owner? (you count only with "You too") */
export function sideOk(who, ownerDisp, subjectDisp, isSelf, self) {
  if (isSelf) return who === "ally" && !!self;
  const o = Number(ownerDisp ?? 0), s = Number(subjectDisp ?? 0);
  return who === "ally" ? o === s : o * s < 0;
}
/** Pure: a Reaction's Distance in squares ("5"), or 0 (Weapon, Reach, none: not checked here). */
export const squaresOf = d => (/^\d+$/.test(String(d ?? "").trim()) ? Number(d) : 0);
/** Pure: the order the used rows resolve in: last in, first out. */
export const stackOrder = rows => rows.filter(r => r.state === "use").sort((x, y) => y.order - x.order);
/** Pure: every row is answered (used, passed or skipped). */
export const allAnswered = rows => rows.every(r => r.state !== "wait");
/** Pure: "9:41" for the time left. */
export const clockText = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
/** Pure: Skip all others: every row still waiting is skipped (v0.0.274, Lucas: the GM's own rows too; v0.0.272 kept them waiting). */
export function skipOthers(rows) { return skipAll(rows); }
/** Pure: the timer ran out: every row still waiting is skipped. */
export function skipAll(rows) { let n = 0; for (const r of rows) if (r.state === "wait") { r.state = "skip"; n++; } return n; }
/** Pure: a row is answered (Use puts it on the stack: its place is the next number). false when it can't be (not waiting). */
export function answerRow(rows, i, choice) {
  const r = rows[i];
  if (!r || r.state !== "wait") return false;
  if (choice === "use") { r.state = "use"; r.order = Math.max(0, ...rows.map(x => x.order || 0)) + 1; } else r.state = "pass";
  return true;
}

/** v0.0.273 (Lucas): pure: a used row resolves one place earlier ("up") or later ("down"): it swaps its stack number with its neighbour's. */
export function moveInStack(rows, i, dir) {
  const stack = stackOrder(rows), k = stack.findIndex(r => r.i === i), j = k + (dir === "up" ? -1 : 1);
  if (k < 0 || j < 0 || j >= stack.length) return false;
  [stack[k].order, stack[j].order] = [stack[j].order, stack[k].order];
  return true;
}
/** Pure: may this user pause the timer: the GM, or one who answers a row of the message (v0.0.275: the order and Resolve are the GM's). */
export const mayManage = (st, user) => !!user && (user.isGM || st.rows.some(r => r.answerer === user.id));
/** Pure: the time left on the message (paused: what was left when it was paused). */
export const timeLeft = (st, now = Date.now()) => (st.paused ? st.left ?? 0 : (st.deadline || 0) - now);

/* ------------------------------------------------------------------ v0.0.275 (pack RX-2, Lucas's design 2026-11-07): the stack card */
// The live card: a navy header (the clock; the GM's Skip all others), "Can react" (one row per creature, a "pick one" group when a creature has
// several Reactions to this Action), and the Stack (the triggering Action as the dark base slab, every Use a slab on top in its map color).
// Resolved, the same message becomes one line (faces in resolve order, a result chip) that unfolds into a map snapshot above the frozen stack.
export const PALETTE = ["#f0b54a", "#5fc4c0", "#b48ce0", "#7fc97f"];
/** Pure: the color of the n-th Reaction used (in the order they were used). */
export const colorFor = n => PALETTE[((n % PALETTE.length) + PALETTE.length) % PALETTE.length];
/** Pure: two letters for a face with no image ("Bandit Thug" BT, "Nari" NA). */
/** v0.0.276 (Lucas): pure: a token's name without the build in parentheses ("Archer 1 (Double Shot, Marksman)" is "Archer 1"). */
export const cleanName = n => String(n ?? "").replace(/\s*\([^()]*\)\s*$/, "").trim() || String(n ?? "");
export const initials = name => { const w = String(name ?? "").trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] ?? "?").slice(0, 2)).toUpperCase(); };
const FACE_BG = { "-1": "#8a2f22", "0": "#6b5d45", "1": "#2d5d7a", "-2": "#3a3a3a" };
/** Pure: what a Reaction does, from its own data: an attack (a Strike, or used on the attacker or an enemy), a protection (used on an ally), else a hand. */
export function roleOf(item, def) {
  const traits = item?.system?.traits, strike = !!(traits?.has?.("strike") || (Array.isArray(traits) && traits.includes("strike")));
  if (strike || item?.system?.momentTarget === "source" || def?.who === "enemy") return "attack";
  if (def?.who === "ally") return "protect";
  return "other";
}
// v0.0.276 (Lucas: the icon buttons were empty): Foundry cleans a chat message's content and drops <svg>, so the icons are Font Awesome
const fa = (name, extra = "") => () => `<i class="rx-i ${name}${extra ? ` ${extra}` : ""}" aria-hidden="true"></i>`;
export const ICON = {
  check: fa("fa-solid fa-check"), x: fa("fa-solid fa-xmark"), clock: fa("fa-regular fa-clock"), pause: fa("fa-solid fa-pause"),
  skip: fa("fa-solid fa-forward-fast"), grip: fa("fa-solid fa-grip-vertical"), play: fa("fa-solid fa-play"), down: fa("fa-solid fa-chevron-down"),
  up: fa("fa-solid fa-chevron-up"), sword: fa("fa-solid fa-burst"), move: fa("fa-solid fa-person-running"), shield: fa("fa-solid fa-shield-halved"),
  arrow: fa("fa-solid fa-crosshairs"), hand: fa("fa-solid fa-hand"), back: fa("fa-solid fa-rotate-left"), spin: fa("fa-solid fa-spinner", "fa-spin")
};
const roleIcon = role => (role === "attack" ? ICON.arrow() : role === "protect" ? ICON.shield() : ICON.hand());
/** Pure: a face (the token's image in a circle, the initials under it; the name on hover). size: "" (22 px), "s" (16 px), "m" (20 px). */
export const faceHtml = (f, size = "") => `<span class="rx-av${size ? ` rx-av-${size}` : ""}" style="background:${FACE_BG[String(f?.disp ?? 0)] ?? FACE_BG[0]}" data-tooltip="${esc(f?.name ?? "")}" aria-label="${esc(f?.name ?? "")}"><b>${esc(f?.ini ?? initials(f?.name))}</b>${f?.img ? `<img src="${esc(f.img)}" alt="">` : ""}</span>`;
const kindTag = k => `<span class="rx-tag">${k === "interrupt" ? "INTERRUPT" : "TRIGGER"}</span>`;
const pill = (cls, html) => `<span class="rx-out ${cls}">${html}</span>`;
const faceOfRow = r => ({ name: r.name, img: r.img, ini: r.ini, disp: r.disp });

/** Pure: Use on one option answers the creature's whole group (its other options are passed); Pass passes the group. false when it can't be. */
export function answerGroup(rows, i, choice) {
  const r = rows[i];
  if (!r || r.state !== "wait") return false;
  const mates = rows.filter(x => x.actorUuid === r.actorUuid && x.state === "wait");
  if (choice === "use") {
    r.state = "use"; r.order = Math.max(0, ...rows.map(x => x.order || 0)) + 1;
    r.color = colorFor(rows.filter(x => x.state === "use").length - 1);
    for (const m of mates) if (m !== r) m.state = "pass";
  } else for (const m of mates) m.state = "pass";
  return true;
}
/** Pure: the GM dragged the slabs: ids are the used rows from the top (resolves first) down. false when the list isn't the stack. */
export function setStackOrder(rows, ids) {
  const used = rows.filter(r => r.state === "use");
  if (!Array.isArray(ids) || ids.length !== used.length || new Set(ids).size !== ids.length || !ids.every(i => used.some(r => r.i === i))) return false;
  ids.forEach((i, k) => { rows.find(r => r.i === i).order = ids.length - k; });
  return true;
}
/** Pure: the rows still waiting, a group per creature (in the order they came). */
export function waitingGroups(rows) {
  const g = new Map();
  for (const r of rows) if (r.state === "wait") { if (!g.has(r.actorUuid)) g.set(r.actorUuid, []); g.get(r.actorUuid).push(r); }
  return [...g.values()];
}

/** Pure: a resolved slab's result chip ({ cls, text, short } or null when nothing can be read). */
export function outChip(r) {
  const o = r.out ?? {};
  if (o.spent) return { cls: "spent", text: `${r.ap}R spent`, short: "spent" };
  if (r.result === "failed") return { cls: "spent", text: "not used", short: "not used" };
  if (r.role === "attack") {
    if (o.down) return { cls: "hit", text: "Down", short: "Down" };
    if (o.tier) return { cls: "hit", text: o.tier >= 2 ? `T${o.tier} hit` : `T${o.tier}`, short: `T${o.tier}` };
    return null;
  }
  if (o.blocked > 0) return { cls: "blk", text: `−${o.blocked}`, short: `−${o.blocked}` };
  if (o.tier && r.role !== "protect") return { cls: "hit", text: `T${o.tier}`, short: `T${o.tier}` };
  return null;
}
/** Pure: the base slab's chip: the held damage struck and the final one, "never lands", the hits of the stack (a movement), or the damage dealt. */
export function baseChip(st) {
  const b = st.base ?? {};
  if (b.never) return { cls: "never", html: "never lands", short: "never lands" };
  if (st.hold && b.held) {
    if (b.final === undefined || b.final === null) return { cls: "dmg", html: `${b.held} held`, short: `${b.held} held` };
    return b.final === b.held ? { cls: "dmg", html: `${b.final}`, short: `${b.final}` } : { cls: "dmg", html: `<s>${b.held}</s> ${b.final}`, short: `${b.held} → ${b.final}` };
  }
  const atk = st.rows.filter(r => r.state === "use" && r.role === "attack" && !r.out?.spent && r.result !== "failed");
  // v0.0.276: "N hits" only once every attack's result is known (an Opportunity Attack's Weapon Attack is clicked after its slab resolves)
  if (atk.length && st.done && atk.every(r => r.out?.down || r.out?.tier)) { const n = atk.filter(r => r.out?.down || (r.out?.tier ?? 0) >= 2).length; return { cls: "hit", html: `${n} hit${n === 1 ? "" : "s"}`, short: `${n} hit${n === 1 ? "" : "s"}` }; }
  if (b.dealt) return { cls: "dmg", html: `${b.dealt} dealt`, short: `${b.dealt} dealt` };
  return null;
}
/** The base slab's words: "Strike → Krysta", "Moves 4 sq.", "Stands up". */
const baseWords = b => (b.kind === "move" ? `<b>Moves</b> ${Number(b.squares) || 0} sq.` : b.kind === "stand" ? "<b>Stands up</b>" : `<b>${esc(b.label || "Strike")}</b>${b.target?.name ? ` → ${esc(b.target.name)}` : ""}`);
const baseIcon = b => (b.kind === "move" || b.kind === "stand" ? ICON.move() : ICON.sword());
const backBtn = b => (b?.back && !b.back.used ? `<button type="button" class="rx-hb rx-backbtn" data-twod12="rxBack" data-tooltip="Move ${esc(b.back.name)} back to the square it left (${b.back.squares} sq.), the movement refunded" aria-label="Move ${esc(b.back.name)} back">${ICON.back()}</button>` : b?.back?.used ? `<span class="rx-backed" data-tooltip="${esc(b.back.name)} went back to where its movement started; its movement is refunded">${ICON.back()}</span>` : "");

function liveHtml(st) {
  const groups = waitingGroups(st.rows), waiting = groups.flat(), kinds = new Set(waiting.map(r => r.kind)), one = kinds.size === 1;
  const ctl = (r, inner) => `<span class="rx-ctl" data-answerer="${esc(r.answerer)}">${inner}<span class="rx-deciding">deciding…</span></span>`;
  const can = groups.map(g => {
    const r = g[0], tg = one ? "" : ` ${kindTag(r.kind)}`;
    if (g.length === 1) return `<div class="rx-dl" data-rx-hover="${r.i}" data-actor="${esc(r.actorUuid)}">${faceHtml(faceOfRow(r))}<span class="rx-nm"><a class="rx-open" data-twod12="rxOpen" data-row="${r.i}" data-tooltip="Open the Action">${esc(r.itemName)}</a> ${esc(r.ap)}R <span class="rx-tg">→ ${esc(r.targetName)}</span>${tg}</span>${ctl(r, `<button type="button" class="rx-ib rx-use" data-twod12="rxUse" data-row="${r.i}" data-tooltip="Use" aria-label="Use">${ICON.check()}</button><button type="button" class="rx-ib rx-pass" data-twod12="rxPass" data-row="${r.i}" data-tooltip="Pass" aria-label="Pass">${ICON.x()}</button>`)}</div>`;
    const same = g.every(x => x.targetName === r.targetName);
    return `<div class="rx-grp" data-actor="${esc(r.actorUuid)}"><div class="rx-gh">${faceHtml(faceOfRow(r))}<span class="rx-nm"><span class="rx-own"><b>Pick one</b></span><span class="rx-oth"><b>${esc(r.name)}</b> <span class="rx-tg">· ${g.length} options</span></span>${same ? ` <span class="rx-tg">→ ${esc(r.targetName)}</span>` : ""}${tg}</span>${ctl(r, `<button type="button" class="rx-ib rx-pass" data-twod12="rxPass" data-row="${r.i}" data-tooltip="Pass (all of them)" aria-label="Pass">${ICON.x()}</button>`)}</div><div class="rx-chs" data-answerer="${esc(r.answerer)}">${g.map(x => `<button type="button" class="rx-ch" data-twod12="rxUse" data-row="${x.i}" data-rx-hover="${x.i}" data-tooltip="Use ${esc(x.itemName)}${same ? "" : ` → ${esc(x.targetName)}`}">${esc(x.itemName)} ${esc(x.ap)}R</button>`).join("")}</div></div>`;
  }).join("");
  const stack = stackOrder(st.rows), ready = st.ready && !st.resolving;
  const slabs = stack.map((r, k) => {
    const run = r.result === "run" ? `<span class="rx-run">${ICON.spin()}</span>` : r.result === "done" ? `<span class="rx-ok">${ICON.check(12)}</span>` : "";
    return `<div class="rx-it${k === 0 ? " top" : ""}" data-row="${r.i}" data-rx-hover="${r.i}" data-actor="${esc(r.actorUuid)}">${ready ? `<span class="rx-grip" data-tooltip="Drag to change the order">${ICON.grip()}</span>` : ""}${st.ready ? `<span class="rx-num">${k + 1}</span>` : ""}<span class="rx-sw" style="background:${esc(r.color)}"></span>${faceHtml(faceOfRow(r), "s")}<b>${esc(r.itemName)}</b> <span class="rx-tg">→ ${esc(r.targetName)}</span>${run}</div>`;
  }).join("");
  const b = st.base ?? {}, bc = baseChip(st);
  const base = `<div class="rx-it rx-base" data-rx-hover="base"${b.face?.actorUuid ? ` data-actor="${esc(b.face.actorUuid)}"` : ""}><span class="rx-sw" style="background:${b.kind === "move" || b.kind === "stand" ? "#ecdcae" : "#e0553b"}"></span>${faceHtml(b.face, "s")}<span class="rx-bw">${baseWords(b)}</span>${bc ? pill(bc.cls, bc.html) : ""}${backBtn(b)}</div>`;
  const left = timeLeft(st, st.now ?? Date.now());
  const clock = st.deadline || st.paused ? `<span class="rx-tm${st.paused ? " paused" : ""}" data-twod12="rxPause"${st.paused ? "" : ` data-deadline="${st.deadline}"`} data-tooltip="${st.paused ? "Paused: click to go on" : "Auto-skip: click to pause"}">${st.paused ? ICON.pause() : ICON.clock()}<span class="rx-left">${clockText(left)}</span></span>` : "";
  const skip = !allAnswered(st.rows) ? `<button type="button" class="rx-hb rx-gm" data-twod12="rxSkip" data-tooltip="Skip all others" aria-label="Skip all others">${ICON.skip()}</button>` : "";
  const foot = ready ? `<div class="rx-ft rx-gmonly"><button type="button" class="rx-btn rx-pri" data-twod12="rxResolve">${ICON.play()} Resolve</button></div>` : st.resolving ? `<div class="rx-ft rx-busy">${ICON.spin()} Resolving…</div>` : "";
  return `<div class="twod12 chat rx2" data-rx="${esc(st.id)}"><div class="rx-hd"><span class="rx-ttl">Reactions</span>${clock}${skip}</div>${can ? `<div class="rx-sec">Can react${one && waiting.length ? ` ${kindTag(waiting[0].kind)}` : ""}</div>${can}` : ""}<div class="rx-sec">Stack${st.ready ? '<span class="rx-sub">· top resolves first</span>' : ""}</div><div class="rx-stk">${slabs}${base}</div>${foot}</div>`;
}

/** Pure: the snapshot's layout (about 258 × 110): the tokens, the lines and the labels, from the positions frozen when it resolved. */
export function snapshotLayout(st, W = 258, H = 110) {
  const pos = st.snap?.pos ?? {}, gs = st.snap?.gs || 100, pts = Object.values(pos);
  if (!pts.length) return null;
  const minX = Math.min(...pts.map(p => p.x)) - gs * 0.7, maxX = Math.max(...pts.map(p => p.x)) + gs * 0.7, minY = Math.min(...pts.map(p => p.y)) - gs * 0.7, maxY = Math.max(...pts.map(p => p.y)) + gs * 0.7;
  const k = Math.min(W / Math.max(1, maxX - minX), H / Math.max(1, maxY - minY), 0.4), ox = (W - (maxX - minX) * k) / 2, oy = (H - (maxY - minY) * k) / 2;
  const at = uuid => (pos[uuid] ? { x: Math.round(ox + (pos[uuid].x - minX) * k), y: Math.round(oy + (pos[uuid].y - minY) * k) } : null);
  const r = Math.max(7, Math.min(11, gs * k * 0.45));
  return { W, H, r, at, k, center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 } };
}
export function snapshotSvg(st) {
  const L = snapshotLayout(st);
  if (!L) return "";
  const b = st.base ?? {}, stack = stackOrder(st.rows), drawn = new Map(), parts = [], labels = [];
  const tok = (f, dim = false) => { if (!f?.uuid || drawn.has(f.uuid)) return; const p = L.at(f.uuid); if (!p) return; drawn.set(f.uuid, p); const id = `c${drawn.size}${String(st.id).slice(-4)}`; parts.push(`<g${dim ? ' opacity=".6"' : ""}><circle cx="${p.x}" cy="${p.y}" r="${L.r}" fill="${dim ? "#3a3a3a" : (FACE_BG[String(f.disp ?? 0)] ?? FACE_BG[0])}" stroke="#f4eddc" stroke-width="1.5"/><text x="${p.x}" y="${p.y + 3}" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">${esc(f.ini ?? initials(f.name))}</text>${f.img ? `<clipPath id="${id}"><circle cx="${p.x}" cy="${p.y}" r="${L.r - 1}"/></clipPath><image href="${esc(f.img)}" x="${p.x - L.r}" y="${p.y - L.r}" width="${L.r * 2}" height="${L.r * 2}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/>` : ""}<title>${esc(f.name ?? "")}</title></g>`); };
  const lines = [];
  if (b.kind !== "move" && b.kind !== "stand" && b.face?.uuid && b.target?.uuid) { const a = L.at(b.face.uuid), z = L.at(b.target.uuid); if (a && z) lines.push(`<path d="M${a.x} ${a.y} Q${Math.round((a.x + z.x) / 2)} ${Math.round(Math.min(a.y, z.y) - 14)} ${z.x} ${z.y}" stroke="#e0553b" stroke-width="3" fill="none"${b.never ? ' stroke-dasharray="3 3" opacity=".6"' : ""}/>`); }
  if ((b.kind === "move") && b.startUuid && b.face?.uuid) { const a = L.at(b.startUuid), z = L.at(b.face.uuid); if (a && z) { lines.push(`<path d="M${a.x} ${a.y} L${z.x} ${z.y}" stroke="#ecdcae" stroke-width="2" stroke-dasharray="4 3" fill="none"/>`); parts.push(`<circle cx="${a.x}" cy="${a.y}" r="${L.r}" fill="#ecdcae" opacity=".35"/>`); } }
  stack.forEach((r, k) => {
    const a = L.at(r.tokenUuid), z = L.at(r.targetUuid), c = outChip(r);
    if (!a || !z) return;
    const spent = !!r.out?.spent;
    lines.push(`<path d="M${a.x} ${a.y} L${z.x} ${z.y}" stroke="${esc(r.color)}" stroke-width="${spent ? 2 : 3}" fill="none"${spent ? ' stroke-dasharray="3 3" opacity=".6"' : ""}/>`);
    if (!spent) labels.push({ x: Math.round((a.x + z.x) / 2), y: Math.round((a.y + z.y) / 2) - 6, bg: r.color, fg: "#1d2738", text: `${k + 1}${c ? ` · ${c.short}` : ""}` });
  });
  for (const r of stack) tok({ uuid: r.tokenUuid, ...faceOfRow(r) });
  tok(b.target); tok(b.face, !!(b.never && b.face));
  const bc = baseChip(st);
  if (bc && b.target?.uuid && st.hold) { const z = L.at(b.target.uuid); if (z) labels.push({ x: z.x, y: Math.max(8, z.y - L.r - 8), bg: bc.cls === "never" ? "#3b4559" : "#b8432f", fg: bc.cls === "never" ? "#ecdcae" : "#fff", text: bc.short }); }
  const lab = labels.map(l => { const w = Math.round(String(l.text).length * 5.6 + 10); return `<g><rect x="${l.x - w / 2}" y="${l.y - 7}" width="${w}" height="14" rx="7" fill="${esc(l.bg)}"/><text x="${l.x}" y="${l.y + 3}" text-anchor="middle" font-size="10" font-weight="700" fill="${l.fg}">${esc(l.text)}</text></g>`; }).join("");
  return `<svg width="${L.W}" height="${L.H}" viewBox="0 0 ${L.W} ${L.H}" aria-hidden="true">${lines.join("")}${parts.join("")}${lab}</svg>`;
}
function doneHtml(st) {
  const stack = stackOrder(st.rows), b = st.base ?? {}, bc = baseChip(st);
  const line = `<div class="rx-line" data-twod12="rxFold" data-tooltip="Unfold"><span class="rx-okc">${ICON.check()}</span>${faceHtml(b.face, "m")}<span class="rx-ic">${baseIcon(b)}</span>${b.target?.name && b.kind !== "move" && b.kind !== "stand" ? faceHtml(b.target, "m") : ""}<span class="rx-dot">·</span>${stack.length ? stack.map(r => `${faceHtml(faceOfRow(r), "m")}<span class="rx-ic${r.out?.spent ? " gone" : ""}">${roleIcon(r.role)}</span>`).join("") : `<span class="rx-tg">${esc(st.closed ? "closed" : "no Reactions")}</span>`}${bc ? pill(bc.cls, bc.html) : ""}<button type="button" class="rx-ib rx-fold" data-twod12="rxFold" aria-label="Unfold">${ICON.down()}</button></div>`;
  const slabs = stack.map((r, k) => { const c = outChip(r), gone = !!r.out?.spent; return `<div class="rx-it${gone ? " gone" : ""}" data-row="${r.i}" data-actor="${esc(r.actorUuid)}"><span class="rx-num"${gone ? ' style="background:#6b5d45"' : ""}>${k + 1}</span>${faceHtml(faceOfRow(r), "m")}<span class="rx-ic">${roleIcon(r.role)}</span>${gone ? `<s>${esc(r.itemName)}</s>` : `<b>${esc(r.itemName)}</b>`} <span class="rx-tg">→ ${esc(r.targetName)}</span>${c ? pill(c.cls, c.text) : ""}</div>`; }).join("");
  const base = `<div class="rx-it rx-base${b.never ? " gone" : ""}">${faceHtml(b.face, "m")}<span class="rx-bw">${b.never ? `<s>${baseWords(b).replace(/<\/?b>/g, "")}</s>` : baseWords(b)}</span>${bc ? pill(bc.cls, bc.html) : ""}${backBtn(b)}</div>`;
  const note = st.closed ? `<div class="rx-note">${esc(st.closed)}</div>` : "";
  return `<div class="twod12 chat rx2 rx-done" data-rx="${esc(st.id)}">${line}<div class="rx-full"><div class="rx-hd"><span class="rx-ttl">Reactions</span><span class="rx-okh">${ICON.check(12)} Resolved</span><button type="button" class="rx-hb rx-fold" data-twod12="rxFold" aria-label="Fold">${ICON.up()}</button></div>${snapshotLayout(st) ? '<div class="rx-mini" data-twod12="rxPan" data-tooltip="Show this spot on the map"></div>' : ""}<div class="rx-stk">${slabs}${base}</div>${note}</div></div>`;
}
/** Pure: the message's HTML from its state: the live stack card, or (resolved) the one line that unfolds. */
export function rxCardHtml(st) { return st.done ? doneHtml(st) : liveHtml(st); }

/* ------------------------------------------------------------------ the creatures and their Reactions */
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);
const tokenOf = actor => actor?.token?.object ?? actor?.getActiveTokens?.()[0] ?? null;
/** The creatures a moment is about: { actor, token, at (where it is measured from: a token, or a place) }. */
const party = (actor, at = null) => (actor ? { actor, token: tokenOf(actor), at: at ?? tokenOf(actor) } : null);
/** v0.0.275: a face for the message: the token's name and image, its side (the face's color), the token's uuid (the map overlay). */
export const faceOf = p => {
  if (!p?.actor && !p?.token) return null;
  const t = p.token, d = t?.document, name = cleanName(t?.name ?? p.actor?.name ?? "");
  return { name, ini: initials(name), img: d?.texture?.src ?? p.actor?.img ?? "", disp: Number(d?.disposition ?? 0), uuid: d?.uuid ?? p.actor?.uuid ?? "", actorUuid: p.actor?.uuid ?? "" };
};
const isDown = actor => !!(actor?.system?.atZero || actor?.statuses?.has?.("unconscious") || actor?.statuses?.has?.("dead"));

/** Why this creature can't use this Reaction now ("" when it can): spent, Down, no AP left. */
export async function blockedWhy(actor, item) {
  const f = isFaded(actor, item);
  if (f?.faded) return f.why || "spent";
  if (isDown(actor)) return "Down";
  try {
    const C = await import("./combat.mjs"), c = game.combat?.started ? C.combatantOf(actor, game.combat) : null;
    if (c) {
      const min = Math.min(...(item.system.versions ?? []).map(v => Number(v.ap) || 0));
      if (Number.isFinite(min) && C.getAP(c) + C.getRAP(c) < min) return `no AP left (it costs ${min}R)`;
    }
  } catch (e) { /* no combat module (tests) */ }
  return "";
}

/**
 * The Reactions a moment triggers. ev: { kinds, subjects: [{ actor, token, at }] (nearest first wins), source: { actor, token } | null,
 * closer: (ownerToken) => bool (an enemy that moved closer to that creature's side), only: "interrupt" | "trigger" | "" }.
 * Returns { rows: [{ actor, token, item, kind, subject, target, dist }], blocked: [the same, with why] }.
 */
export async function collectReactions(ev) {
  const rows = [], blocked = [];
  for (const tk of globalThis.canvas?.tokens?.placeables ?? []) {
    const actor = tk.actor;
    if (!actor || tk.document?.hidden) continue;
    if (ev.source?.actor && actor.uuid === ev.source.actor.uuid) continue;   // never a Reaction to your own Strike or move
    for (const item of actor.itemTypes?.action ?? []) {
      const k = item.system?.moment, def = MOMENTS[k];
      if (!def || !item.system.reaction || !ev.kinds.includes(k)) continue;
      const kind = item.system.reactionKind === "interrupt" ? "interrupt" : "trigger";
      if (ev.only && kind !== ev.only) continue;
      if (ev.filter && !ev.filter.has(`${actor.uuid}|${item.id}`)) continue;
      if (def.closer && ev.closer && !ev.closer(tk)) continue;
      const range = Number(item.system.momentRange) || 0;
      let hit = null;
      for (const sj of ev.subjects ?? []) {
        if (!sj?.actor) continue;
        const isSelf = sj.actor.uuid === actor.uuid;
        if (!sideOk(def.who, tk.document?.disposition, sj.token?.document?.disposition ?? sj.disposition, isSelf, item.system.momentSelf)) continue;
        const where = (def.move && ev.at?.[k]) || sj.at || sj.token;
        // v0.0.277 (Lucas: a movement's Reaction sometimes wasn't offered): a movement is measured on every square of its path (an array)
        const dist = isSelf ? 0 : Array.isArray(where) ? Math.min(Infinity, ...where.map(w => tokenDistance(tk, w))) : where ? tokenDistance(tk, where) : Infinity;
        if (range && dist > range) continue;
        if (!hit || dist < hit.dist) hit = { sj, dist };
      }
      if (!hit) continue;
      const target = item.system.momentTarget === "source" && ev.source?.actor ? ev.source : hit.sj;
      const sq = squaresOf(item.system.distance);   // a Distance in squares limits how far the target can be (Rebuke: 5 sq.)
      if (sq && target.token && target.token !== tk && tokenDistance(tk, target.token) > sq) continue;
      const row = { actor, token: tk, item, kind, moment: k, subject: hit.sj, target, dist: hit.dist, role: roleOf(item, def) };
      const why = await blockedWhy(actor, item);
      if (why) blocked.push({ ...row, why }); else rows.push(row);
    }
  }
  rows.sort((x, y) => x.dist - y.dist);
  return { rows, blocked };
}

/* ------------------------------------------------------------------ the message and the stack (the client that holds the moment) */
const live = new Map();   // moment id -> { st, msg, resolve, timer }
const finished = new Map();   // v0.0.275: moment id -> { st, msg } once resolved (the damage that lands afterwards is written into it)
const pendingRuns = new Map();
export const timerMinutes = () => {
  try { if (!game.settings.get(F, "reactionTimerOn")) return 0; return Math.max(1, Number(game.settings.get(F, "reactionTimer")) || 1); } catch (e) { return 1; }
};
export function registerReactionSettings() {
  game.settings.register(F, "reactionTimerOn", { name: "Reactions: auto-skip timer", hint: "A Reactions message skips the rows nobody answered when its timer runs out (the time is counted down on the message). The GM can also click Skip all others.", scope: "world", config: true, type: Boolean, default: true });
  game.settings.register(F, "reactionTimer", { name: "Reactions: auto-skip after (minutes)", hint: "How long a Reactions message waits for its answers before it skips the rows still waiting (anyone in it can pause the countdown by clicking the clock).", scope: "world", config: true, type: Number, default: 1, range: { min: 1, max: 60, step: 1 } });
  try { O.registerOverlaySetting(); } catch (e) { console.warn("twod12 | Reaction overlay", e); }   // v0.0.275: "Reaction map overlay" (client)
}

/** The note when Reactions watch the moment but none can answer: whispered to the GM and those Reactions' owners. */
async function postNobody(plain, blocked) {
  const users = new Set(game.users?.filter?.(u => u.isGM).map(u => u.id) ?? []);
  for (const b of blocked) for (const u of game.users?.filter?.(u => b.actor.testUserPermission?.(u, "OWNER")) ?? []) users.add(u.id);
  const why = blocked.map(b => `${esc(b.actor.name)}'s ${esc(b.item.name)}: ${esc(b.why)}`).join("; ");
  await ChatMessage.create({ content: sysLine("fa-hourglass-end", `${plain}: nobody can react (${why}).`, "rxnote"), whisper: [...users] });
}

/**
 * A moment comes: the message with its rows (or the note), and, once every row is answered or skipped, the stack resolved.
 * ev.base: the triggering Action's slab ({ kind: "strike" | "damage" | "down" | "landed" | "against" | "move" | "stand", label, face, target, held, dealt, squares, path, start }).
 * Resolves to { id, used: [{ moment, actorUuid, itemId, ok, half }], never } when the stack is done (an Interrupt's caller waits for it; a Trigger's doesn't).
 */
export async function openMoment(ev) {
  if (!globalThis.canvas?.ready || !globalThis.game?.users) return { used: [] };
  const { rows, blocked } = await collectReactions(ev);
  if (!rows.length) { if (blocked.length) await postNobody(ev.plain ?? ev.lead, blocked); return { used: [] }; }
  const minutes = timerMinutes(), id = foundry.utils.randomID();
  const st = {
    v: 2, id, host: game.user.id, hold: !!ev.hold, lead: ev.lead, done: false, resolving: false, ready: false, paused: false,
    base: { ...(ev.base ?? {}), back: ev.back ?? null }, deadline: minutes ? Date.now() + minutes * 60000 : 0,
    rows: rows.map((r, i) => {
      const f = faceOf({ actor: r.actor, token: r.token }) ?? {};
      return {
        i, moment: r.moment, actorUuid: r.actor.uuid, name: f.name ?? r.actor.name, img: f.img ?? "", ini: f.ini ?? initials(r.actor.name), disp: f.disp ?? 0, tokenUuid: f.uuid ?? "",
        itemId: r.item.id, itemName: r.item.name, kind: r.kind, role: r.role ?? "other",
        ap: Math.min(...(r.item.system.versions ?? [{ ap: 0 }]).map(v => Number(v.ap) || 0)),
        targetUuid: r.target.token?.document?.uuid ?? r.target.actor.uuid, targetName: cleanName(r.target.token?.name ?? r.target.actor.name),
        answerer: answererFor(r.actor)?.id ?? game.user.id, state: "wait", order: 0, result: "", color: "", out: null
      };
    })
  };
  const msg = await ChatMessage.create({ content: rxCardHtml(st), flags: { [F]: { rx: st } } });
  return new Promise(resolve => {
    const L = { st, msg, resolve, timer: null };
    live.set(id, L);
    arm(L);
  });
}
async function redraw(L) {
  try { await L.msg.update({ content: rxCardHtml(L.st), [`flags.${F}.rx`]: L.st }); } catch (e) { console.warn("twod12 | Reactions message", e); }
}
/** On the holding client: an answer (Use / Pass), the GM's Skip all others, the order (the GM's drag), the clock, Resolve, or the timer. */
export async function hostAnswer(id, i, choice, fromId, extra = {}) {
  const L = live.get(id);
  if (!L || L.st.done || L.st.resolving) return;
  const st = L.st, from = game.users?.get?.(fromId);
  if (choice === "timeout") skipAll(st.rows);
  else if (choice === "skipAll") { if (!from?.isGM) return; skipOthers(st.rows); }
  else if (choice === "pause") {   // v0.0.273: the GM or anyone who answers a row here
    if (!mayManage(st, from)) return;
    if (st.paused) { st.paused = false; st.deadline = Date.now() + Math.max(1000, st.left ?? 0); arm(L); } else if (st.deadline) { st.paused = true; st.left = Math.max(0, st.deadline - Date.now()); if (L.timer) clearTimeout(L.timer); L.timer = null; }
    return redraw(L);
  } else if (["up", "down", "order", "resolve"].includes(choice)) {
    // v0.0.275 (Lucas): the reactors decide the order (opposed: the GM decides); the GM drags the slabs and clicks Resolve
    if (!from?.isGM) return;
    if (choice === "order") { if (setStackOrder(st.rows, extra.ids)) await redraw(L); return; }
    if (choice !== "resolve") { if (moveInStack(st.rows, i, choice)) await redraw(L); return; }
    if (!allAnswered(st.rows)) return;
  } else {
    const r = st.rows[i];
    if (!r) return;
    const mayAnswer = fromId === r.answerer || !!from?.isGM;   // its owner; v0.0.274 (Lucas): the GM can answer any row
    if (!mayAnswer || !answerGroup(st.rows, i, choice)) return;   // v0.0.275: once per triggering Action: one Use answers the creature's group
  }
  if (!allAnswered(st.rows)) return redraw(L);
  // v0.0.273 (Lucas): with two Reactions or more on the stack, it waits for Resolve (the order can be changed first; the timer resolves it too)
  if (stackOrder(st.rows).length > 1 && !st.ready && choice !== "timeout" && choice !== "resolve") { st.ready = true; return redraw(L); }
  if (L.timer) clearTimeout(L.timer);
  await resolveStack(L);
}
function arm(L) {
  if (L.timer) clearTimeout(L.timer);
  L.timer = L.st.deadline && !L.st.paused ? setTimeout(() => hostAnswer(L.st.id, -1, "timeout", game.user.id), Math.max(0, L.st.deadline - Date.now())) : null;
}
const docSync = uuid => { if (!uuid) return null; try { return fromUuidSync(uuid); } catch (e) { return null; } };
/** v0.0.275: the triggering creature dropped (the book: an invalid target; the others still lose the AP). */
const sourceDown = st => { const u = st.base?.face?.actorUuid; return !!u && isDown(actorOf(docSync(u))); };
/** v0.0.275: where the tokens stand when it resolves (the resolved message's snapshot). */
function freezePositions(st) {
  const pos = {}, put = uuid => { const d = docSync(uuid), t = d?.object ?? actorOf(d)?.getActiveTokens?.()[0]; if (t?.center) pos[uuid] = { x: Math.round(t.center.x), y: Math.round(t.center.y) }; };
  for (const r of st.rows) if (r.state === "use") { put(r.tokenUuid); put(r.targetUuid); }
  put(st.base?.face?.uuid); put(st.base?.target?.uuid);
  const s = st.base?.start, gs = globalThis.canvas?.grid?.size ?? 100;
  if (s) { pos.start = { x: Math.round(s.x + (s.w ?? 1) * gs / 2), y: Math.round(s.y + (s.h ?? 1) * gs / 2) }; st.base.startUuid = "start"; }
  st.snap = { pos, gs, scene: globalThis.canvas?.scene?.id ?? "" };
}
/** Every row answered: the used ones resolve last in, first out, each on its owner's client, then the moment's caller goes on. */
async function resolveStack(L) {
  const st = L.st, used = [];
  st.resolving = true;
  const order = stackOrder(st.rows);
  for (const r of order) {
    const who = game.users.get(r.answerer)?.active ? r.answerer : (answererFor(fromUuidSync(r.actorUuid))?.id ?? game.user.id);
    const data = { actorUuid: r.actorUuid, itemId: r.itemId, targetUuid: r.targetUuid, targetName: r.targetName };
    // v0.0.275 (the book, Chapter 2): the triggering creature dropped before this one resolved: its Reaction is spent (the AP lost), nothing is rolled
    if (st.base?.face?.actorUuid && (st.base.never || sourceDown(st))) {
      if (st.hold) st.base.never = true;
      let res = { ok: false }; try { res = who === game.user.id ? await runHere({ ...data, spend: true }) : await runRemote(who, { ...data, spend: true }); } catch (e) { console.warn("twod12 | Reaction", e); }
      r.result = "spent"; r.out = { spent: true, paid: !!res.ok };
      used.push({ moment: r.moment, actorUuid: r.actorUuid, itemId: r.itemId, ok: false, half: null, spent: true });
      continue;
    }
    r.result = "run"; await redraw(L);
    let res = { ok: false };
    try { res = who === game.user.id ? await runHere(data) : await runRemote(who, data); } catch (e) { console.warn("twod12 | Reaction", e); }
    r.result = res.ok ? "done" : "failed";
    // v0.0.275: what it did, for the resolved message (the tier its roll card shows, a creature it took Down); nothing guessed
    const tgt = actorOf(docSync(r.targetUuid));
    r.out = { tier: Number(res.tier) || 0, crit: !!res.crit, down: r.role === "attack" && isDown(tgt), half: !!res.half };
    used.push({ moment: r.moment, actorUuid: r.actorUuid, itemId: r.itemId, ok: !!res.ok, half: res.half ?? null });
  }
  if (st.hold && st.base?.face?.actorUuid && sourceDown(st)) st.base.never = true;
  st.resolving = false; st.done = true; st.resolvedAt = Date.now();
  freezePositions(st);
  await redraw(L);   // v0.0.275 (Lucas): the same message, edited in place (no second post): one line that unfolds
  live.delete(st.id);
  finished.set(st.id, { st, msg: L.msg });
  if (finished.size > 20) finished.delete(finished.keys().next().value);
  // what a Reaction set on another creature (a Guard, a reduction) comes back through the GM: a moment for it to arrive before the damage lands
  if (used.some(u => u.ok)) await new Promise(r => setTimeout(r, 500));
  L.resolve({ id: st.id, used, never: !!st.base?.never });
}
/**
 * v0.0.275: the held damage landed (damage.mjs): its result goes into the resolved message(s): the final damage, what the Reactions'
 * protection took off (given to the slab when one protection was used; with several it can't be told apart, so no chip), the Downs.
 * info: { final, blocked, cut, never }.
 */
export async function noteLanded(ids, info = {}) {
  for (const id of [ids].flat().filter(Boolean)) {
    const F2 = finished.get(id);
    if (!F2) continue;
    const st = F2.st, b = st.base ?? (st.base = {});
    if (info.never) b.never = true;
    if (Number.isFinite(info.final)) b.final = info.final;
    const prot = st.rows.filter(r => r.state === "use" && r.result === "done" && r.role === "protect");
    const off = (Number(info.blocked) || 0) + (Number(info.cut) || 0);
    if (prot.length === 1 && off > 0) prot[0].out = { ...(prot[0].out ?? {}), blocked: off };
    for (const r of st.rows) if (r.state === "use" && r.role === "attack" && r.out && !r.out.spent && isDown(actorOf(docSync(r.targetUuid)))) r.out.down = true;
    try { await F2.msg.update({ content: rxCardHtml(st), [`flags.${F}.rx`]: st }); } catch (e) { console.warn("twod12 | Reactions message", e); }
  }
}
/**
 * v0.0.276 (Lucas: Opportunity Attack's hits weren't logged): a Reaction whose card only offers its attack (a Weapon Attack button) rolls after
 * its slab resolved. On the client that holds the resolved message, a later roll card of that creature (within a few minutes) gives the
 * slab its tier, and a target that goes Down gives it "Down"; the message is edited again. Pure part: which rows a card answers.
 */
export function lateTier(st, card, now = Date.now()) {
  const a = card?.flags?.[F]?.action ?? card?.getFlag?.(F, "action");
  if (!a || !st?.done || now - (st.resolvedAt ?? 0) > 5 * 60000) return [];
  const tier = Number(a.tier) || 0;
  if (!tier && !(a.results ?? []).some(x => x.tier)) return [];
  const hits = [];
  for (const r of st.rows) {
    if (r.state !== "use" || r.role !== "attack" || r.out?.spent || r.out?.tier || r.actorUuid !== a.actorUuid) continue;
    const row = (a.results ?? []).find(x => x.uuid === r.targetUuid);
    hits.push({ r, tier: Number(row?.tier ?? tier) || 0, crit: !!(row?.crit ?? a.crit) });
    break;   // one card answers one slab
  }
  return hits;
}
async function rewrite(F2) { try { await F2.msg.update({ content: rxCardHtml(F2.st), [`flags.${F}.rx`]: F2.st }); } catch (e) { console.warn("twod12 | Reactions message", e); } }
export function registerLateResults() {
  Hooks.on("createChatMessage", msg => {
    if (!finished.size || !msg?.getFlag?.(F, "action")) return;
    for (const F2 of finished.values()) {
      const hits = lateTier(F2.st, msg);
      if (!hits.length) continue;
      for (const h of hits) { h.r.out = { ...(h.r.out ?? {}), tier: h.tier, crit: h.crit }; if (h.r.result === "failed") h.r.result = "done"; }
      rewrite(F2);
      return;
    }
  });
  Hooks.on("updateActor", actor => {
    if (!finished.size || !isDown(actor)) return;
    for (const F2 of finished.values()) {
      let changed = false;
      for (const r of F2.st.rows) if (r.state === "use" && r.role === "attack" && !r.out?.spent && !r.out?.down && actorOf(docSync(r.targetUuid))?.uuid === actor.uuid) { r.out = { ...(r.out ?? {}), down: true }; changed = true; }
      if (changed) rewrite(F2);
    }
  });
}
function runRemote(userId, data) {
  const reqId = foundry.utils.randomID();
  return new Promise(resolve => {
    pendingRuns.set(reqId, resolve);
    game.socket.emit(SOCKET, { type: "rxRun", userId, reqId, from: game.user.id, data });
  });
}
/** Pure: the tier of the roll the Reaction just made, from the cards it posted (the last one with a result; its row for that target). */
export function tierFromCards(cards, actorUuid, targetUuid = "") {
  for (const m of [...cards].reverse()) {
    const a = m?.getFlag?.(F, "action") ?? m?.flags?.[F]?.action;
    if (!a || a.actorUuid !== actorUuid) continue;
    const row = (a.results ?? []).find(x => x.uuid === targetUuid);
    const tier = Number(row?.tier ?? a.tier) || 0;
    if (tier) return { tier, crit: !!(row?.crit ?? a.crit) };
  }
  return { tier: 0, crit: false };
}
/** On the owner's client: the Reaction is used as its card is, against the triggering creature; a Reaction whose card brings granted uses
 *  makes its first one at once (the Weapon Attack), so what it does to the held damage (a Tier 3's half) is known before it lands.
 *  v0.0.275: data.spend: only its AP is paid (the triggering creature dropped first); the tier of its roll is sent back. */
export async function runHere(data) {
  const H = await import("./halfhint.mjs");
  const actor = actorOf(await fromUuid(data.actorUuid)), item = actor?.items?.get(data.itemId), tdoc = await fromUuid(data.targetUuid);
  if (!actor || !item) return { ok: false };
  if (data.spend) {
    const ap = Math.min(...(item.system.versions ?? [{ ap: 0 }]).map(v => Number(v.ap) || 0));
    try { const C = await import("./combat.mjs"); return { ok: ap > 0 ? (await C.spendAP(actor, ap, item.name, { reaction: true, quiet: true })) !== false : true }; } catch (e) { return { ok: false }; }
  }
  const tok = tdoc?.object ?? tokenOf(actorOf(tdoc));
  if (tok) tok.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
  const t0 = Date.now(), before = new Set((game.messages?.contents ?? []).slice(-30).map(m => m.id));
  H.halfCtx.held = true;
  let ok = false;
  try {
    const { useAction } = await import("./actions.mjs");
    ok = (await useAction(actor, item, {})) === true;
    if (ok) {
      const card = game.messages.contents.slice(-8).reverse().find(m => !before.has(m.id) && m.getFlag?.(F, "grantCard")?.actorUuid === actor.uuid);   // the card this use just posted
      const g = card?.getFlag(F, "grantCard")?.effects?.[0];
      if (g) {
        if (tok) tok.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
        await (await import("./freeuse.mjs")).useGrant(card, g.id, g.index);
      }
    }
  } finally { H.halfCtx.held = false; }
  const half = H.halfCtx.last && H.halfCtx.last.at >= t0 ? { ...H.halfCtx.last } : null;
  const fresh = (game.messages?.contents ?? []).slice(-12).filter(m => !before.has(m.id));
  const { tier, crit } = tierFromCards(fresh, actor.uuid, tdoc?.uuid ?? "");
  return { ok, half, tier, crit };
}
/** The socket (damage.mjs routes the rx messages here). */
export async function onSocket(data) {
  if (data.type === "rxAnswer") return hostAnswer(data.id, data.row, data.choice, data.from, { ids: data.ids });
  if (data.type === "rxBackMark") return markBack(data.msgId);
  if (data.type === "rxRun") { let res = { ok: false }; try { res = await runHere(data.data); } catch (e) { console.warn("twod12 | Reaction", e); } game.socket.emit(SOCKET, { type: "rxRunDone", userId: data.from, reqId: data.reqId, ok: res.ok, half: res.half, tier: res.tier ?? 0, crit: !!res.crit }); return; }
  if (data.type === "rxRunDone") { const r = pendingRuns.get(data.reqId); if (r) { pendingRuns.delete(data.reqId); r({ ok: !!data.ok, half: data.half ?? null, tier: Number(data.tier) || 0, crit: !!data.crit }); } }
}
/** Sends a choice to the client that holds the moment (or answers it here). */
function send(st, choice, row = -1, extra = {}) {
  if (st.host === game.user.id) return hostAnswer(st.id, row, choice, game.user.id, extra);
  if (!game.users.get(st.host)?.active) return ui.notifications.warn("The one who brought this moment has left: it can't be answered any more.");
  game.socket.emit(SOCKET, { type: "rxAnswer", userId: st.host, id: st.id, row, choice, from: game.user.id, ...extra });
}
const unfolded = new Set();   // v0.0.275: the resolved messages this client unfolded (per viewer, never saved)
/** A click on the message: Use, Pass (the row's owner), Skip all others and Resolve (the GM), the clock (the GM or one who answers a row):
 *  sent to the client that holds the moment. The Action's name opens its sheet; Move back is done by the clicker; the fold and the snapshot are local. */
export async function rxClick(msg, b) {
  const st = msg?.getFlag?.(F, "rx");
  if (!st) return;
  const k = b.dataset.twod12, row = Number(b.dataset.row ?? -1);
  if (k === "rxFold") { const el = b.closest(".rx2"); const open = !unfolded.has(msg.id); if (open) unfolded.add(msg.id); else unfolded.delete(msg.id); el?.classList.toggle("open", open); return; }
  if (k === "rxPan") return panTo(st);
  if (k === "rxOpen") return openRowItem(st.rows[row]);
  if (k === "rxBack") return moveBack(msg, st);
  if (st.done) return;
  const choice = { rxUse: "use", rxPass: "pass", rxSkip: "skipAll", rxUp: "up", rxDown: "down", rxPause: "pause", rxResolve: "resolve" }[k];
  if (!choice) return;
  await send(st, choice, row);
  if (b.tagName === "BUTTON") b.disabled = true;
}
/** v0.0.275: a click on the snapshot shows that spot on the map. */
function panTo(st) {
  const c = snapshotLayout(st)?.center;
  if (!c || !globalThis.canvas?.ready) return;
  if (st.snap?.scene && canvas.scene?.id !== st.snap.scene) return ui.notifications.info("That happened on another scene.");
  canvas.animatePan({ x: c.x, y: c.y, duration: 400 });
}
/** v0.0.273 (Lucas): the Action's name on a row opens its sheet. */
async function openRowItem(r) {
  if (!r) return;
  let actor = null; try { actor = actorOf(await fromUuid(r.actorUuid)); } catch (e) { actor = null; }
  const item = actor?.items?.get(r.itemId);
  if (!item) return ui.notifications.warn("That Action is gone.");
  if (!item.testUserPermission?.(game.user, "LIMITED") && !game.user.isGM) return ui.notifications.warn(`You can't see ${actor.name}'s Actions.`);
  item.sheet.render(true);
}
/** v0.0.273 (Lucas): Move back: the mover goes back to the square its movement left (the trigger), its movement as it was before (refunded). */
async function moveBack(msg, st) {
  const b = st.base?.back ?? st.back;
  if (!b || b.used) return;
  let doc = null; try { doc = await fromUuid(b.tokenUuid); } catch (e) { doc = null; }
  if (!doc) return ui.notifications.warn("That token is gone.");
  if (!doc.isOwner) return ui.notifications.warn(`Only ${doc.name}'s owner or the GM can move it back.`);
  await doc.update({ x: b.x, y: b.y }, { twod12Forced: true, animate: true });
  const c = game.combat?.combatants?.get?.(b.combatantId);
  if (c && b.flags) { try { await c.update(Object.fromEntries(Object.entries(b.flags).map(([k, v]) => [`flags.${F}.${k}`, v]))); } catch (e) { console.warn("twod12 | movement refund", e); } }
  await markBack(msg.id);
}
/** The message of that moment says the mover went back: its author writes it; through the socket otherwise (v0.0.275: one message, edited in place). */
async function markBack(msgId) {
  const m = game.messages?.get?.(msgId), st = m?.getFlag?.(F, "rx");
  const b = st?.base?.back ?? st?.back;
  if (!b || b.used) return;
  const mark = s => { if (s.base?.back) s.base.back = { ...s.base.back, used: true }; if (s.back) s.back = { ...s.back, used: true }; return s; };
  const L = live.get(st.id) ?? finished.get(st.id);
  if (L) mark(L.st);
  if (m.isAuthor || (game.user.isGM && !m.author?.active)) { const nst = L?.st ?? mark(foundry.utils.deepClone(st)); try { await m.update({ content: rxCardHtml(nst), [`flags.${F}.rx`]: nst }); } catch (e) { /* not ours */ } }
  else if (m.author?.id) game.socket.emit(SOCKET, { type: "rxBackMark", userId: m.author.id, msgId: m.id });
}
/** Pure: may this user answer this row from the card (its owner; the GM for a creature whose player has left). */
// v0.0.277 (Lucas: "the GM should not get deciding…, the GM should be able to pick"): the GM answers every row (as v0.0.274)
export const answersHere = (st, r, user) => !!user && !!r && (r.answerer === user.id || !!user.isGM);
/** Chat hook: Use and Pass only for the row's owner (the others see "deciding…"), Skip all others, the grips and Resolve only for the GM;
 *  the hover previews the line on the map, the GM drags the slabs; the timer ticks; the map overlay follows the message. */
export function rxRender(msg, html) {
  const st = msg?.getFlag?.(F, "rx");
  if (!st) return;
  const el = html instanceof HTMLElement ? html : html?.[0];
  if (!el?.querySelectorAll) return;
  if (st.v !== 2) return oldRender(st, el);   // a message from before v0.0.275
  try { O.syncOverlay(st); } catch (e) { /* no canvas */ }
  el.querySelectorAll(".rx-av img").forEach(img => img.addEventListener("error", () => img.remove(), { once: true }));
  if (st.done) {
    const card = el.querySelector(".rx2");
    if (card && unfolded.has(msg.id)) card.classList.add("open");
    const mini = el.querySelector(".rx-mini");   // v0.0.276: the snapshot is drawn here (the chat content can't hold an SVG)
    if (mini && !mini.firstElementChild) { try { mini.innerHTML = snapshotSvg(st); } catch (e) { console.warn("twod12 | Reactions snapshot", e); } }
    if (st.base?.back && !st.base.back.used) { const doc = docSync(st.base.back.tokenUuid); if (!doc?.isOwner) el.querySelectorAll('[data-twod12="rxBack"]').forEach(b => b.remove()); }
    return;
  }
  el.querySelectorAll(".rx-ctl, .rx-chs").forEach(c => {
    const r = st.rows.find(x => x.answerer === c.dataset.answerer) ?? { answerer: c.dataset.answerer };
    if (answersHere(st, r, game.user)) c.querySelectorAll(".rx-deciding").forEach(d => d.remove());
    else { c.querySelectorAll("button").forEach(b => b.remove()); if (c.classList.contains("rx-chs")) c.remove(); }
  });
  el.querySelectorAll(".rx-grp").forEach(g => g.classList.toggle("mine", !!g.querySelector(".rx-chs")));
  if (!game.user.isGM) el.querySelectorAll(".rx-gm, .rx-gmonly, .rx-grip").forEach(b => b.remove());
  if (!mayManage(st, game.user)) el.querySelectorAll(".rx-tm").forEach(t => { delete t.dataset.twod12; delete t.dataset.tooltip; });
  const b = st.base?.back;
  if (b && !b.used) { const doc = docSync(b.tokenUuid); if (!doc?.isOwner) el.querySelectorAll('[data-twod12="rxBack"]').forEach(x => x.remove()); }
  el.querySelectorAll("[data-rx-hover]").forEach(h => {
    const row = h.dataset.rxHover === "base" ? "base" : Number(h.dataset.rxHover);
    h.addEventListener("mouseenter", () => O.setHover(st.id, row));
    h.addEventListener("mouseleave", () => O.setHover(null));
  });
  if (game.user.isGM && st.ready && !st.resolving) dragSlabs(st, el);
  ticker();
}
/** v0.0.275: the GM drags the Reaction slabs (not the base) to change the order; the map's pins follow while dragging, the order is sent on drop. */
function dragSlabs(st, el) {
  const box = el.querySelector(".rx-stk");
  if (!box) return;
  const slabs = () => [...box.querySelectorAll(".rx-it[data-row]")];
  const ids = () => slabs().map(s => Number(s.dataset.row));
  const renumber = () => slabs().forEach((s, k) => { const n = s.querySelector(".rx-num"); if (n) n.textContent = String(k + 1); s.classList.toggle("top", k === 0); });
  let dragged = null, start = "";
  for (const s of slabs()) {
    s.draggable = true;
    s.addEventListener("dragstart", e => { e.stopPropagation(); dragged = s; start = ids().join(","); s.classList.add("rx-drag"); try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", "twod12-rx"); } catch (x) { /* */ } });
    s.addEventListener("dragend", e => {
      e.stopPropagation(); s.classList.remove("rx-drag");
      const now = ids();
      dragged = null; O.previewOrder(st.id, null);
      if (now.join(",") !== start) send(st, "order", -1, { ids: now });
    });
  }
  box.addEventListener("dragover", e => {
    if (!dragged) return;
    e.preventDefault(); e.stopPropagation();
    const over = e.target.closest?.(".rx-it[data-row]");
    if (!over || over === dragged) return;
    const r = over.getBoundingClientRect(), after = e.clientY > r.top + r.height / 2;
    box.insertBefore(dragged, after ? over.nextSibling : over);
    renumber(); O.previewOrder(st.id, ids());
  });
  box.addEventListener("drop", e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } });
}
/** The look of a message from before v0.0.275 (its buttons by who may click them). */
function oldRender(st, el) {
  el.querySelectorAll('button[data-twod12="rxUse"], button[data-twod12="rxPass"]').forEach(b => { const r = st.rows[Number(b.dataset.row)]; if (!(r && (r.answerer === game.user.id || game.user.isGM))) b.remove(); });
  if (!game.user.isGM) el.querySelectorAll(".rx-gm").forEach(b => b.remove());
  if (!mayManage(st, game.user)) { el.querySelectorAll(".rx-move, .rx-go").forEach(b => b.remove()); el.querySelectorAll(".rx-timer").forEach(t => { delete t.dataset.twod12; delete t.dataset.tooltip; }); }
  ticker();
}
let ticking = null;
function ticker() {
  if (ticking || typeof document === "undefined") return;
  ticking = setInterval(() => {
    const els = document.querySelectorAll(".rx-tm[data-deadline], .rx-timer[data-deadline]");
    if (!els.length) { clearInterval(ticking); ticking = null; return; }
    els.forEach(e => { const s = e.querySelector(".rx-left"); if (s) s.textContent = clockText(Number(e.dataset.deadline) - Date.now()); });
  }, 1000);
}
/** At ready: a message this client was holding when it reloaded can't be answered any more; it is closed. */
export async function closeStale() {
  for (const m of game.messages?.contents?.slice(-60) ?? []) {
    const st = m.getFlag?.(F, "rx");
    if (!st || st.done || st.host !== game.user.id || live.has(st.id)) continue;
    skipAll(st.rows); st.done = true; st.resolving = false; st.closed = "Closed: the page was reloaded before every row was answered.";
    try { await m.update({ content: st.v === 2 ? rxCardHtml(st) : m.content, [`flags.${F}.rx`]: st }); } catch (e) { /* not ours */ }
  }
}

/* ------------------------------------------------------------------ the moments themselves */
const bTotal = a => a.B.l + a.B.n + a.M.l + a.M.n;
const nameOf = p => esc(cleanName(p?.token?.name ?? p?.actor?.name ?? ""));
async function sourceOf(from) {
  if (!from?.uuid) return null;
  let d = null; try { d = await fromUuid(from.uuid); } catch (e) { d = null; }
  return party(actorOf(d));
}
/** v0.0.275: what is waiting on a creature to take damage first (a reduction, a Guard): a Reaction that adds to it shows here. */
export const protectionOf = actor => { const s = actor?.system ?? {}; return (Number(s.reduceNext) || 0) + (Number(s.guard) || 0) + (Number(s.apGuard) || 0); };
/**
 * The damage is about to land (applyToActor): "a Strike would damage an ally" (a Strike's damage card) and "an ally takes damage" (when some of
 * it would reach the Health: the Guard and a reduction are counted). The Interrupts hold it; the answer may halve it (a Tier 3's half).
 * from: { uuid (the creature dealing it), strike }. Resolves to { half, halfBy, id, gained (what the Reactions added to the protection), never }.
 */
export async function damageMoment(actor, a, from, reaches) {
  const kinds = [...(from?.strike ? ["strikeDamage"] : []), ...(reaches ? ["allyDamage"] : [])];
  if (!kinds.length) return {};
  const source = await sourceOf(from), subject = party(actor), before = protectionOf(actor);
  const plain = source ? `<b>${nameOf(source)}</b>'s ${from?.strike ? "Strike" : "damage"} would damage <b>${nameOf(subject)}</b>` : `<b>${nameOf(subject)}</b> would take damage`;
  const base = { kind: from?.strike ? "strike" : "damage", label: from?.strike ? "Strike" : "Damage", face: faceOf(source ?? subject), target: faceOf(subject), held: bTotal(a) };
  const res = await openMoment({ kinds, subjects: [subject], source, only: "interrupt", hold: true, plain, lead: plain, base });
  const half = (res.used ?? []).find(u => u.ok && u.half && (!source || !u.half.targetUuid || [source.actor.uuid, source.token?.document?.uuid].includes(u.half.targetUuid)));
  return { half: !!half, halfBy: half?.half?.source ?? "", id: res.id ?? "", gained: res.id ? Math.max(0, protectionOf(actor) - before) : 0, never: !!res.never };
}
/** The damage would take the creature to its Pool: the "would go Down" Interrupts. Resolves to { saved (one was used: the damage stops 1 under the Pool), id, never }. */
export async function downMoment(actor, a, from) {
  const source = await sourceOf(from), subject = party(actor);
  const plain = `<b>${nameOf(subject)}</b> would go Down`;
  const base = { kind: "down", label: from?.strike ? "Strike" : "Damage", face: faceOf(source ?? subject), target: faceOf(subject), held: bTotal(a) };
  const res = await openMoment({ kinds: ["wouldDown"], subjects: [subject], source, only: "interrupt", hold: true, plain, lead: `${plain} (${bTotal(a)} damage)`, base });
  return { saved: (res.used ?? []).some(u => u.ok && u.moment === "wouldDown"), id: res.id ?? "", never: !!res.never };
}
/** The damage landed: the Triggers of the damage moments (they hold nothing). */
export function landedMoment(actor, dealt, from, wentDown) {
  const kinds = [...(dealt > 0 && from?.strike ? ["strikeDamage"] : []), ...(dealt > 0 ? ["allyDamage"] : []), ...(wentDown ? ["wouldDown"] : [])];
  if (!kinds.length) return;
  (async () => {
    const source = await sourceOf(from), subject = party(actor);
    const plain = wentDown ? `<b>${nameOf(subject)}</b> goes Down` : `<b>${nameOf(subject)}</b> takes <b>${dealt}</b> damage${source ? ` from <b>${nameOf(source)}</b>` : ""}`;
    const base = { kind: "landed", label: wentDown ? "Down" : from?.strike ? "Strike" : "Damage", face: faceOf(source ?? subject), target: faceOf(subject), dealt };
    await openMoment({ kinds, subjects: [subject], source, only: "trigger", plain, lead: plain, base });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
/** A Strike was made (useAction, after its card): "a Strike is made against an ally". A Trigger: nothing waits. */
export function strikeMoment(actor, targets) {
  (async () => {
    const subjects = [];
    for (const t of targets ?? []) { let d = null; try { d = await fromUuid(t.uuid); } catch (e) { d = null; } const p = party(actorOf(d)); if (p && p.actor.uuid !== actor.uuid) subjects.push(p); }
    if (!subjects.length) return;
    const source = party(actor), plain = `<b>${nameOf(source)}</b> makes a Strike against <b>${subjects.map(nameOf).join(", ")}</b>`;
    const tf = faceOf(subjects[0]), base = { kind: "against", label: "Strike", face: faceOf(source), target: subjects.length > 1 ? { ...tf, name: subjects.map(s => cleanName(s.token?.name ?? s.actor.name)).join(", ") } : tf };
    await openMoment({ kinds: ["strikeAgainst"], subjects, source, plain, lead: plain, base });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
/** Pure: did the mover come closer to any of these creatures (each { from, to }: its distance before and after)? */
export const cameCloser = pairs => pairs.some(p => p.to < p.from);
/** v0.0.275: pure: the squares a movement went through (top-left corners in pixels), from its waypoints, along straight steps (40 at most). */
export function pathSquares(points, gs, w = 1, h = 1) {
  const out = [], seen = new Set(), add = (x, y) => { const k = `${x},${y}`; if (!seen.has(k) && out.length < 40) { seen.add(k); out.push({ x, y, w: w * gs, h: h * gs }); } };
  const pts = (points ?? []).filter(p => Number.isFinite(p?.x) && Number.isFinite(p?.y)).map(p => ({ x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs }));
  for (let k = 0; k < pts.length; k++) {
    if (!k) { add(pts[0].x, pts[0].y); continue; }
    const a = pts[k - 1], b = pts[k], n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) / gs;
    for (let s = 1; s <= n; s++) add(Math.round((a.x + (b.x - a.x) * s / n) / gs) * gs, Math.round((a.y + (b.y - a.y) * s / n) / gs) * gs);
  }
  return out;
}
/** v0.0.277: pure: the places of a movement's squares (as tokenDistance reads them: x, y in pixels and the token's size). */
export const movePlaces = (points, gs, size = {}) => pathSquares(points, gs, size.width || 1, size.height || 1).map(p => ({ x: p.x, y: p.y, width: size.width || 1, height: size.height || 1, elevation: size.elevation ?? 0 }));
const offered = new Set();   // once per Move Action: a Reaction is offered once for each Move Action of the same mover
/** A creature moved (not an Evade, not a Forced Movement): "an enemy moves closer" and "an enemy moves (or stands up)". */
export function moveMoment(doc, origin, dest, { stand = false, before = null, waypoints = null } = {}) {
  (async () => {
    const actor = doc?.actor;
    if (!actor || !game.combat?.started) return;
    const size = { width: doc.width, height: doc.height, elevation: doc.elevation };
    const fromAt = { ...size, x: origin?.x ?? doc.x, y: origin?.y ?? doc.y }, toAt = { ...size, x: dest?.x ?? doc.x, y: dest?.y ?? doc.y };
    // v0.0.274 (Lucas; the book: "You can react only once to the same Action"): once per Reaction for each Move Action (a new Advance offers again)
    const cbt = game.combat.combatants?.find?.(x => x.tokenId === doc.id);
    const turn = `${doc.id}|${game.combat.round}|${game.combat.turn}|${moveActionOf(cbt?.id)}`;
    const sideToks = disp => (canvas.tokens?.placeables ?? []).filter(t => t.actor && !t.document.hidden && Number(t.document.disposition ?? 0) === Number(disp ?? 0) && t.document.id !== doc.id);
    // v0.0.277 (Lucas: the trigger "didn't happen" when the mover walked past and away): the squares it left (Opportunity Attack: "would leave a
    // square") and the squares it entered (Overwatch: "moves closer": any square nearer than where it started) along its whole path, not only
    // where it started and stopped
    const gsz = globalThis.canvas?.grid?.size ?? 100;
    const sqs = movePlaces(waypoints?.length ? waypoints : [fromAt, toAt], gsz, size);
    const left = stand ? [fromAt] : (sqs.length > 1 ? sqs.slice(0, -1) : [fromAt]), entered = sqs.length > 1 ? sqs.slice(1) : [toAt];
    const ev = {
      kinds: stand ? ["enemyMoves"] : ["enemyCloser", "enemyMoves"], subjects: [party(actor, toAt)], source: null, at: { enemyMoves: left, enemyCloser: entered },
      closer: tk => cameCloser(sideToks(tk.document.disposition).map(s => ({ from: tokenDistance(fromAt, s), to: Math.min(...entered.map(e => tokenDistance(e, s))) })))
    };
    const { rows, blocked } = await collectReactions(ev);
    const fresh = r => { const k = `${turn}|${r.actor.uuid}|${r.item.id}`; if (!stand && offered.has(k)) return false; offered.add(k); return true; };
    const keep = new Set([...rows, ...blocked].filter(fresh).map(r => `${r.actor.uuid}|${r.item.id}`));
    if (!keep.size) return;
    const name = esc(cleanName(doc.name ?? actor.name)), plain = stand ? `<b>${name}</b> stands up` : `<b>${name}</b> moves`;
    // v0.0.273 (Lucas): Move back: to where this movement started, with the movement it had then (the squares since are refunded)
    const back = !stand && origin ? { tokenUuid: doc.uuid, x: fromAt.x, y: fromAt.y, combatantId: before?.combatantId ?? "", flags: before?.flags ?? null, squares: tokenDistance(fromAt, toAt), name: cleanName(doc.name ?? actor.name), used: false } : null;
    // v0.0.275: the base slab ("Moves N sq.", Move back on it) and the path for the map overlay (the squares, the ghost where it started)
    const gs = globalThis.canvas?.grid?.size ?? 100, face = faceOf({ actor, token: doc.object ?? tokenOf(actor) }) ?? {};
    const base = stand ? { kind: "stand", face } : { kind: "move", face: { ...face, uuid: doc.uuid }, squares: tokenDistance(fromAt, toAt), path: pathSquares(waypoints?.length ? waypoints : [fromAt, toAt], gs, doc.width || 1, doc.height || 1), start: { x: fromAt.x, y: fromAt.y, w: doc.width || 1, h: doc.height || 1 } };
    await openMoment({ ...ev, filter: keep, back, plain, lead: plain, base });
  })().catch(e => console.warn("twod12 | Reactions", e));
}
const moving = new Map();   // token id -> { forced, evading }, on the client that moves it
export function registerMomentHooks() {
  try { O.registerOverlayHooks(); } catch (e) { console.warn("twod12 | Reaction overlay", e); }   // v0.0.275: the map overlay
  registerLateResults();   // v0.0.276: an attack rolled after its slab resolved (Opportunity Attack's Weapon Attack) still gets its chip
  Hooks.on("preMoveToken", (doc, movement, operation) => {
    try {
      if (operation?.twod12Lean || movement?.method === "undo") return;
      const c = game.combat?.combatants?.find?.(x => x.tokenId === doc.id);
      // v0.0.273: the movement it has before this move (Move back refunds it)
      const flags = c ? { freeMove: Number(c.getFlag(F, "freeMove")) || 0, evadeMove: Number(c.getFlag(F, "evadeMove")) || 0, moveLeft: Number(c.getFlag(F, "moveLeft")) || 0 } : null;
      moving.set(doc.id, { forced: !!operation?.twod12Forced, evading: Number(c?.getFlag?.(F, "evadeMove")) > 0, before: c ? { combatantId: c.id, flags } : null });
    } catch (e) { /* not tracked */ }
  });
  Hooks.on("moveToken", (doc, movement) => {
    const m = moving.get(doc.id);
    if (!m) return;   // moved by another client: that client offers the moment
    // v0.0.277: a movement Foundry splits into several updates (waypoints still pending) keeps its entry for the next part
    if (!movement?.pending?.waypoints?.length) moving.delete(doc.id);
    if (m.forced || m.evading || !movement?.origin || !movement?.destination) return;
    const wp = movement.passed?.waypoints ?? null;
    moveMoment(doc, movement.origin, movement.destination, { before: m.before, waypoints: wp?.length ? [movement.origin, ...wp] : null });
  });
}
