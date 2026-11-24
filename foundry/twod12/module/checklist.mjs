// v0.0.425 (Lucas, 2026-11-18: "I think I will go with 3"; foundry-backlog "The version checklists"): THE TEST CHECKLIST inside Foundry.
// The running list of what to try in Foundry (`foundry/to-test.md`, built into `checklist.json` by tools/build-checklist.mjs; t268 keeps them equal)
// ships with the system. For the GM only, behind a world setting: a small bar shows one test at a time (Do / Expect, Pass / Fail / Skip, the
// previous and next ones), its List is a pick window with every test by group, and "Copy report" puts a short text in the clipboard to paste to
// Claude. The answers are saved in the world (they survive updates); a test whose text changes gets a new `rev` and opens again. A Fail asks what
// happened and keeps the console's errors seen since the test was shown, and the version: the diagnostic Claude can't get without Foundry.
// Shift+K shows or hides the bar.
import { esc } from "./util.mjs";
const F = "twod12";
const ITEM = /^###\s+(\S+)\s+·\s+(v[\d.]+)\s+·\s+(.+?)\s*$/;

/** Pure: the running list's markdown -> { groups: [{ name, items: [{ id, v, title, do, expect, rev }] }] }. "## Group", then per test
 *  "### id · v0.0.421 · Title", "Do: ...", "Expect: ..." (a field goes on over the next lines), "Rev: 2" when its text was rewritten. */
export function parseChecklist(md) {
  const groups = []; let g = null, it = null, field = null;
  const text = String(md ?? "").replace(/<!--[\s\S]*?-->/g, "");
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^##\s+/.test(line) && !/^###/.test(line)) { g = { name: line.replace(/^##\s+/, ""), items: [] }; groups.push(g); it = null; field = null; continue; }
    const m = line.match(ITEM);
    if (m && g) { it = { id: m[1], v: m[2], title: m[3], do: "", expect: "", rev: 1 }; g.items.push(it); field = null; continue; }
    if (!it) continue;
    const f = line.match(/^(Do|Expect|Rev):\s*(.*)$/);
    if (f) { field = f[1].toLowerCase(); if (field === "rev") { it.rev = Math.max(1, Math.trunc(Number(f[2])) || 1); field = null; } else it[field] = f[2]; continue; }
    if (line && field) it[field] = `${it[field]} ${line}`.trim();
  }
  return { groups: groups.filter(x => x.items.length) };
}

/** Pure: every test in order, with its group's name. */
export const flatItems = list => (list?.groups ?? []).flatMap(g => g.items.map(it => ({ ...it, group: g.name })));
/** Pure: a test's state: its saved answer if it was given to this revision of the test, else "open". */
export const stateOf = (it, res) => { const r = res?.[it?.id]; return r && (Number(r.rev) || 1) === (Number(it.rev) || 1) && ["pass", "fail", "skip"].includes(r.r) ? r.r : "open"; };
/** Pure: the counts. */
export function counts(list, res) {
  const c = { pass: 0, fail: 0, skip: 0, open: 0, total: 0 };
  for (const it of flatItems(list)) { c[stateOf(it, res)]++; c.total++; }
  return c;
}
/** Pure: the id of the next open test after `fromId` (wrapping around), or the first one; null when none is open. */
export function nextOpen(list, res, fromId = "") {
  const all = flatItems(list), i = all.findIndex(x => x.id === fromId);
  for (let k = 1; k <= all.length; k++) { const x = all[(Math.max(i, -1) + k + all.length) % all.length]; if (stateOf(x, res) === "open") return x.id; }
  return null;
}
/** Pure: the test shown: the cursor's if it is in the list, else the first open one, else the first. */
export function currentItem(list, res, cursor) {
  const all = flatItems(list);
  return all.find(x => x.id === cursor) ?? all.find(x => x.id === nextOpen(list, res, "")) ?? all[0] ?? null;
}
/** Pure: the neighbour of a test (d = -1 or 1), wrapping. */
export function stepItem(list, id, d) {
  const all = flatItems(list), i = all.findIndex(x => x.id === id);
  return all.length ? all[((i < 0 ? 0 : i) + d + all.length) % all.length].id : null;
}
/** Pure: **bold** in a test's text, the rest escaped. */
export const testText = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

const WORD = { pass: "Passed", fail: "Failed", skip: "Skipped" };
/** Pure: the bar's HTML. m: { list, res, cursor, folded, version } */
export function stripHtml(m) {
  const all = flatItems(m.list), c = counts(m.list, m.res), it = currentItem(m.list, m.res, m.cursor);
  const n = it ? all.findIndex(x => x.id === it.id) + 1 : 0, st = it ? stateOf(it, m.res) : "open", r = it ? m.res?.[it.id] : null;
  const tally = `${c.pass} pass${c.fail ? ` · <span class="tc-bad">${c.fail} fail</span>` : ""}${c.skip ? ` · ${c.skip} skipped` : ""} · ${c.open} open`;
  const head = `<div class="tc-head" data-tc-drag><span class="tc-ttl">${it ? `Test ${n} of ${all.length}` : "Tests"}</span><span class="tc-tally">${tally}</span>`
    + `<button type="button" class="tc-ic" data-tc="fold" aria-label="${m.folded ? "Unfold" : "Fold"}"><i class="fa-solid fa-chevron-${m.folded ? "down" : "up"}"></i></button></div>`;
  if (m.folded) return head;
  if (!it) return `${head}<div class="tc-body"><p>The list is empty.</p></div>`;
  const btn = (k, l) => `<button type="button" data-tc="${k}" class="tc-btn${st === k ? " on" : ""}${k === "fail" ? " neg" : ""}" aria-pressed="${st === k}">${l}</button>`;
  const done = c.open === 0 ? `<p class="tc-done">Every test is answered. <button type="button" class="tc-btn" data-tc="copy">Copy report</button></p>` : "";
  return `${head}<div class="tc-body"><div class="tc-grp">${esc(it.group)} · ${esc(it.v)}</div><div class="tc-name">${testText(it.title)}</div>`
    + `<p><b>Do:</b> ${testText(it.do)}</p><p><b>Expect:</b> ${testText(it.expect)}</p>`
    + (st !== "open" ? `<p class="tc-was ${st}">${WORD[st]}${r?.note ? `: ${esc(r.note)}` : ""}${r?.errors?.length ? ` (${r.errors.length} console error${r.errors.length > 1 ? "s" : ""} kept)` : ""}</p>` : "")
    + done
    + `<div class="tc-row">${btn("pass", "Pass")}${btn("fail", "Fail")}${btn("skip", "Skip")}<span class="tc-nav">`
    + `<button type="button" class="tc-ic" data-tc="prev" aria-label="Previous test"><i class="fa-solid fa-chevron-left"></i></button>`
    + `<button type="button" class="tc-ic" data-tc="next" aria-label="Next test"><i class="fa-solid fa-chevron-right"></i></button>`
    + `<button type="button" class="tc-btn" data-tc="list">List</button></span></div></div>`;
}

/** Pure: the List window's model (the pick window's format; each test a row with Pass / Fail / Skip and Show). */
export function listModel(list, res, version) {
  const c = counts(list, res);
  const row = it => {
    const st = stateOf(it, res), r = res?.[it.id];
    const b = (k, l) => `<button type="button" data-row="${esc(it.id)}" data-k="${k}" aria-pressed="${st === k}">${st === k ? '<i class="fa-solid fa-check"></i> ' : ""}<span>${l}</span></button>`;
    return `<div class="cw-attr tc-lrow ${st}"><span class="tc-lt"><b>${testText(it.title)}</b> <small>${esc(it.v)}</small><span class="tc-ld"><b>Do:</b> ${testText(it.do)} <b>Expect:</b> ${testText(it.expect)}</span>`
      + `${r?.note && st !== "open" ? `<span class="tc-ln">${esc(WORD[st])}: ${esc(r.note)}</span>` : ""}</span>`
      + `<div class="cw-seg">${b("pass", "Pass")}${b("fail", "Fail")}${b("skip", "Skip")}<button type="button" data-row="${esc(it.id)}" data-k="show"><span>Show</span></button></div></div>`;
  };
  const sections = (list?.groups ?? []).map(g => {
    const ans = g.items.filter(it => stateOf(it, res) !== "open").length;
    return { title: g.name, pill: `${ans} / ${g.items.length}`, done: ans === g.items.length, html: g.items.map(row).join("") };
  });
  sections.push({ title: "", html: `<div class="cw-attr"><span>Start again: every answer is cleared.</span><div class="cw-seg"><button type="button" data-row="__all" data-k="clear"><span>Clear the answers</span></button></div></div>` });
  return { name: "Test checklist", sub: version ? `v${version}` : "", icon: "fa-list-check", stats: [["Pass", c.pass], ["Fail", c.fail], ["Skipped", c.skip], ["Open", c.open]],
    sections, message: `${c.total - c.open} of ${c.total} answered`, cancel: "Close", confirm: "Copy report" };
}

/** Pure: the report to paste to Claude. o: { version, date, loose } (loose: console errors not kept with a Fail). */
export function reportText(list, res, o = {}) {
  const all = flatItems(list), c = counts(list, res), out = [];
  out.push(`2d12 test results · system v${o.version ?? "?"} · ${o.date ?? ""} · ${c.total} tests: ${c.pass} pass, ${c.fail} fail, ${c.skip} skipped, ${c.open} open`);
  for (const k of ["fail", "skip"]) for (const it of all.filter(x => stateOf(x, res) === k)) {
    const r = res[it.id];
    out.push("", `${k.toUpperCase()} ${it.id} (${it.v}, ${it.group}) ${it.title}`);
    if (r.note) out.push(`  note: ${r.note}`);
    if (r.ver && r.ver !== o.version) out.push(`  answered on v${r.ver}`);
    for (const e of r.errors ?? []) out.push(`  console: ${e.t}`);
  }
  const ids = k => all.filter(x => stateOf(x, res) === k).map(x => x.id);
  if (c.open) out.push("", `OPEN: ${ids("open").join(", ")}`);
  if (c.pass) out.push("", `PASS: ${ids("pass").join(", ")}`);
  if (o.loose?.length) { out.push("", "Console errors not kept with a Fail (the last ones):"); for (const e of o.loose) out.push(`  ${e.t}`); }
  return out.join("\n");
}

// ---- Foundry -------------------------------------------------------------------------------------------------------------------------------
const errs = []; let errOn = false;
/** The console's errors (and the system's warnings), the last 60, for a Fail's diagnostic. Installed at init; it only listens. */
export function installErrorCapture() {
  if (errOn || typeof window === "undefined") return; errOn = true;
  const str = a => { try { if (a instanceof Error || (a && a.stack && a.message)) return `${a.name ?? "Error"}: ${a.message}${a.stack ? ` | ${String(a.stack).split("\n").slice(1, 3).map(s => s.trim()).join(" | ")}` : ""}`; return typeof a === "string" ? a : JSON.stringify(a); } catch (e) { return String(a); } };
  const keep = (kind, args) => { try { errs.push({ at: Date.now(), kind, t: `[${new Date().toLocaleTimeString()}] ${args.map(str).join(" ")}`.slice(0, 500) }); if (errs.length > 60) errs.shift(); } catch (e) { /* never break the console */ } };
  const ce = console.error.bind(console), cw = console.warn.bind(console);
  console.error = (...a) => { keep("error", a); ce(...a); };
  console.warn = (...a) => { if (a.some(x => String(x).includes("twod12"))) keep("warn", a); cw(...a); };
  window.addEventListener("error", ev => keep("error", [ev.error ?? ev.message]));
  window.addEventListener("unhandledrejection", ev => keep("error", [ev.reason]));
}

let LIST = null, shownAt = Date.now(), shownId = null, dragging = null;
const enabled = () => { try { return !!game.user?.isGM && !!game.settings.get(F, "testChecklist"); } catch (e) { return false; } };
const results = () => { try { return game.settings.get(F, "testResults") ?? {}; } catch (e) { return {}; } };
const stripState = () => { try { return game.settings.get(F, "testStrip") ?? {}; } catch (e) { return {}; } };
const setStrip = patch => game.settings.set(F, "testStrip", { ...stripState(), ...patch });

/** init: the settings and the shortcut. */
export function registerChecklist() {
  installErrorCapture();
  game.settings.register(F, "testChecklist", { name: "Test checklist", hint: "For testing a new version: shows the GM the version's list of things to try, one at a time in a small bar (Shift+K shows or hides it), with Pass / Fail / Skip. A Fail asks what happened and keeps the console's errors; the List's Copy report gives a text to paste to Claude.", scope: "world", config: true, type: Boolean, default: true, onChange: v => (v ? startChecklist() : removeStrip()) });
  game.settings.register(F, "testResults", { scope: "world", config: false, type: Object, default: {} });
  game.settings.register(F, "testStrip", { scope: "client", config: false, type: Object, default: {} });
  game.keybindings.register(F, "testChecklist", { name: "Test checklist: show or hide", hint: "Shows or hides the test bar (the world setting Test checklist must be on; GM only).", editable: [{ key: "KeyK", modifiers: ["Shift"] }],
    onDown: () => { if (!enabled()) return false; setStrip({ hidden: !stripState().hidden }).then(drawStrip); return true; } });
}

/** ready (and when the setting is switched on): load the list and draw the bar. */
export async function startChecklist() {
  if (!enabled()) return;
  try {
    const path = `systems/${game.system.id}/checklist.json`;
    const url = `${foundry.utils.getRoute?.(path) ?? path}?v=${encodeURIComponent(game.system.version)}`;
    LIST = await (await fetch(url)).json();
  } catch (e) { console.warn("twod12 | the test checklist could not load checklist.json", e); LIST = { groups: [] }; }
  drawStrip();
}

function removeStrip() { document.getElementById("twod12-tests")?.remove(); }

export function drawStrip() {
  if (!enabled() || !LIST) return removeStrip();
  const s = stripState();
  if (s.hidden) return removeStrip();
  let el = document.getElementById("twod12-tests");
  if (!el) {
    el = document.createElement("div"); el.id = "twod12-tests"; el.className = "twod12-tests";
    (document.getElementById("interface") ?? document.body).append(el);
    el.addEventListener("click", ev => { const b = ev.target.closest("[data-tc]"); if (b) onStrip(b.dataset.tc); });
    el.addEventListener("pointerdown", startDrag);
  }
  const cur = currentItem(LIST, results(), s.cursor)?.id ?? null;
  if (cur !== shownId) { shownId = cur; shownAt = Date.now(); }   // a Fail keeps the console errors seen since its test was shown
  el.classList.toggle("folded", !!s.folded);
  el.innerHTML = stripHtml({ list: LIST, res: results(), cursor: s.cursor, folded: !!s.folded, version: game.system.version });
  if (Number.isFinite(s.left) && Number.isFinite(s.top)) { el.style.left = `${Math.max(0, Math.min(s.left, innerWidth - 120))}px`; el.style.top = `${Math.max(0, Math.min(s.top, innerHeight - 40))}px`; el.style.right = "auto"; }
}

function startDrag(ev) {
  const head = ev.target.closest("[data-tc-drag]"); if (!head || ev.target.closest("button")) return;
  const el = document.getElementById("twod12-tests"), r = el.getBoundingClientRect();
  dragging = { dx: ev.clientX - r.left, dy: ev.clientY - r.top };
  const move = e => { if (!dragging) return; el.style.left = `${e.clientX - dragging.dx}px`; el.style.top = `${e.clientY - dragging.dy}px`; el.style.right = "auto"; };
  const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); const q = el.getBoundingClientRect(); dragging = null; setStrip({ left: Math.round(q.left), top: Math.round(q.top) }); };
  addEventListener("pointermove", move); addEventListener("pointerup", up);
}

/** Save an answer (null clears it). A Fail keeps the console errors since the test was shown (or the last three). */
async function answer(id, r, note = "") {
  const it = flatItems(LIST).find(x => x.id === id); if (!it) return;
  const res = { ...results() };
  if (!r) delete res[id];
  else {
    let errors = [];
    if (r === "fail") { errors = errs.filter(e => e.at >= shownAt); if (!errors.length) errors = errs.slice(-3); errors = errors.slice(-8).map(e => ({ t: e.t })); }
    res[id] = { r, rev: it.rev ?? 1, note: String(note ?? "").trim(), ver: game.system.version, at: Date.now(), ...(errors.length ? { errors } : {}) };
  }
  await game.settings.set(F, "testResults", res);
}
async function askNote(it, prev = "") {
  const { pickInput } = await import("./pickwindow.mjs");
  const got = await pickInput({ title: "Test failed", name: it.title, sub: it.v, icon: "fa-xmark", text: "What happened? The console's errors seen since this test was shown are kept with it.", fields: [{ key: "note", label: "What happened", type: "text", value: prev }], confirm: "Save" });
  return got ? String(got.note ?? "") : null;
}

async function onStrip(k) {
  const res = results(), s = stripState(), it = currentItem(LIST, res, s.cursor);
  if (k === "fold") return setStrip({ folded: !s.folded }).then(drawStrip);
  if (k === "list") return openList();
  if (k === "copy") return copyReport();
  if (!it) return;
  if (k === "prev" || k === "next") return setStrip({ cursor: stepItem(LIST, it.id, k === "prev" ? -1 : 1) }).then(drawStrip);
  if (!["pass", "fail", "skip"].includes(k)) return;
  if (stateOf(it, res) === k) { await answer(it.id, null); return drawStrip(); }   // the answer clicked again: open again
  if (k === "fail") { const note = await askNote(it, res[it.id]?.note ?? ""); if (note === null) return; await answer(it.id, "fail", note); }
  else await answer(it.id, k);
  await setStrip({ cursor: nextOpen(LIST, results(), it.id) ?? it.id });
  drawStrip(); refreshList();
}

let listApp = null;
const refreshList = () => { if (listApp?.rendered) listApp.render(); };
export async function openList() {
  if (!LIST) return;
  if (listApp?.rendered) return listApp.bringToFront?.();
  const { PickWindow } = await import("./pickwindow.mjs");
  listApp = new PickWindow({
    title: "Test checklist",
    model: () => listModel(LIST, results(), game.system.version),
    pick: (id, k) => { void onList(id, k); },
    result: () => { void copyReport(); return true; },
    resolve: () => { listApp = null; }
  });
  await listApp.render({ force: true });
  listApp.setPosition?.({ width: 760, height: Math.round(innerHeight * 0.8) });
}
async function onList(id, k) {
  if (id === "__all" && k === "clear") {
    const { pickConfirm } = await import("./pickwindow.mjs");
    if (await pickConfirm({ name: "Clear the answers", icon: "fa-rotate-left", text: "Every Pass, Fail and Skip of this world's test list is cleared.", confirm: "Clear" })) await game.settings.set(F, "testResults", {});
  } else {
    const it = flatItems(LIST).find(x => x.id === id); if (!it) return;
    if (k === "show") await setStrip({ cursor: id, hidden: false, folded: false });
    else if (stateOf(it, results()) === k) await answer(id, null);
    else if (k === "fail") { const note = await askNote(it, results()[id]?.note ?? ""); if (note !== null) await answer(id, "fail", note); }
    else await answer(id, k);
  }
  drawStrip(); refreshList();
}

export async function copyReport() {
  const tied = new Set(Object.values(results()).flatMap(r => (r?.errors ?? []).map(e => e.t)));
  const loose = errs.filter(e => !tied.has(e.t)).slice(-10);
  const text = reportText(LIST, results(), { version: game.system.version, date: new Date().toLocaleString(), loose });
  try { await (game.clipboard?.copyPlainText?.(text) ?? navigator.clipboard.writeText(text)); ui.notifications.info("Test report copied: paste it to Claude."); }
  catch (e) { console.log(text); ui.notifications.warn("Could not copy: the report is in the console (F12)."); }
}
