// The World Clock: Foundry keeps the world's time (game.time.worldTime, in seconds) and its calendar, but shows no clock.
//   - A window (token controls): the date and time, buttons to move the clock (GM), the Exhaustion toggle.
//     It is built once and only its date line changes, so clicking never redraws it.
//   - A quick bar above the chat (GM): -1 hour, -10 minutes, -1 round, +1 round, +10 minutes, +1 hour.
// 1 round = 10 seconds (twod12.mjs).
import { clockTick, sleepEffects, setTracking, trackingExhaustion } from "./sleep.mjs";
import { esc } from "./util.mjs";
import { sysCard } from "./sysmsg.mjs";   // v0.0.415

const F = "twod12";
const pad = n => String(n).padStart(2, "0");
const ordinal = n => `${n}${(n % 100 >= 11 && n % 100 <= 13) ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")}`;

/** The calendar's parts for a time, or null without a usable calendar. */
function parts(t) {
  try {
    const cal = game.time?.calendar, c = cal?.timeToComponents?.(t);
    if (!c || !Number.isFinite(c.hour)) return null;
    const loc = s => game.i18n?.localize?.(s) ?? s;
    const month = cal.months?.values?.[c.month]?.name, weekday = cal.days?.values?.[c.dayOfWeek]?.name;
    return { c, month: month ? loc(month) : "", weekday: weekday ? loc(weekday) : "", year: (c.year ?? 0) + (cal.years?.yearZero ?? 0) };
  } catch (e) { return null; }
}

/** The time as the world's calendar names it ("Monday, 3 Hammer 1492 · 14:05"), or "Day 3 · 14:05" without one. */
export function clockText(t = Number(game.time?.worldTime ?? 0)) {
  const p = parts(t);
  if (p) {
    const date = p.month ? `${(p.c.dayOfMonth ?? 0) + 1} ${p.month} ${p.year}` : `Day ${(p.c.day ?? 0) + 1}, year ${p.year}`;
    return `${p.weekday ? `${p.weekday}, ` : ""}${date} · ${pad(p.c.hour)}:${pad(p.c.minute ?? 0)}`;
  }
  const day = Math.floor(t / 86400) + 1, h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60);
  return `Day ${day} · ${pad(h)}:${pad(m)}`;
}

/** The date and the time apart ("Fireday, 2nd of Lamashan, 4726" and "03:43:54"). */
export function clockParts(t = Number(game.time?.worldTime ?? 0)) {
  const p = parts(t), sec = Math.floor(((t % 60) + 60) % 60);
  if (p) {
    const date = p.month ? `${ordinal((p.c.dayOfMonth ?? 0) + 1)} of ${p.month}, ${p.year}` : `Day ${(p.c.day ?? 0) + 1}, ${p.year}`;
    return { date: `${p.weekday ? `${p.weekday}, ` : ""}${date}`, time: `${pad(p.c.hour)}:${pad(p.c.minute ?? 0)}:${pad(p.c.second ?? sec)}` };
  }
  const day = Math.floor(t / 86400) + 1, h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60);
  return { date: `Day ${day}`, time: `${pad(h)}:${pad(m)}:${pad(sec)}` };
}

/** The window's header, like PF2e's: "Fireday, 2nd of Lamashan, 4726 (03:43:54)". */
export function clockTitle(t = Number(game.time?.worldTime ?? 0)) {
  const { date, time } = clockParts(t);
  return `${date} (${time})`;
}

/** The current date as fields you can edit: { year, month (index), months: [names], day, time "HH:MM:SS" }. Without a calendar: only the day (from 1) and the time. */
export function dateFields(t = Number(game.time?.worldTime ?? 0)) {
  const p = parts(t), sec = Math.floor(((t % 60) + 60) % 60);
  if (!p) return { year: null, month: null, months: [], day: Math.floor(t / 86400) + 1, time: clockParts(t).time };
  return { year: p.year, month: p.c.month ?? 0, months: (game.time.calendar.months?.values ?? []).map(m => game.i18n?.localize?.(m.name) ?? m.name), day: (p.c.dayOfMonth ?? 0) + 1, time: `${pad(p.c.hour)}:${pad(p.c.minute ?? 0)}:${pad(p.c.second ?? sec)}` };
}

/** The world time (seconds) for edited fields, or { error } when they can't be read. */
export function timeFromFields(f) {
  const m = /^\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*$/.exec(String(f.time ?? ""));
  if (!m) return { error: "The time must look like 14:30 or 14:30:15." };
  const hour = Number(m[1]), minute = Number(m[2]), second = Number(m[3] ?? 0);
  if (hour > 23 || minute > 59 || second > 59) return { error: "That time doesn't exist (hours 0-23, minutes and seconds 0-59)." };
  const day = Math.round(Number(f.day));
  if (!Number.isFinite(day) || day < 1) return { error: "The day must be 1 or more." };
  const cal = game.time?.calendar;
  if (f.year == null || !cal) return { time: (day - 1) * 86400 + hour * 3600 + minute * 60 + second };
  if (typeof cal.componentsToTime !== "function") return { error: "This calendar can't turn a date into a time. Use the buttons to move the clock." };
  const month = Math.round(Number(f.month)), year = Math.round(Number(f.year));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return { error: "Choose a year and a month." };
  const length = cal.months?.values?.[month]?.days;
  if (length && day > length) return { error: `That month has only ${length} days.` };
  try { return { time: cal.componentsToTime({ year: year - (cal.years?.yearZero ?? 0), month, dayOfMonth: day - 1, hour, minute, second }) }; }
  catch (e) { return { error: "The calendar could not read that date." }; }
}

export const UNITS = { seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 7 * 86400 };
/** Seconds from a time to the next time of day (dawn 06:00, noon 12:00, dusk 18:00, midnight 00:00). Never zero: a full day if it is exactly then. */
export function secondsUntil(t, target) {
  const at = { dawn: 6 * 3600, noon: 12 * 3600, dusk: 18 * 3600, midnight: 0 }[target];
  if (at == null) return 0;
  const now = ((t % 86400) + 86400) % 86400;
  const d = (at - now + 86400) % 86400;
  return d === 0 ? 86400 : d;
}

/** Move the clock (a negative number goes back). */
export async function moveClock(delta) {
  if (!delta) return;
  const target = Number(game.time.worldTime) + delta;
  await game.time.advance(delta);
  if (Math.abs(Number(game.time.worldTime) - target) > 0.5 && game.time.set) await game.time.set(target);
}

/** Everyone sleeps: the clock moves 8 hours, then every player character completes a Sleep. */
export async function everyoneSleeps() {
  await moveClock(8 * 3600);
  await clockTick(game.time.worldTime);   // count the hours awake first, then the Sleep resets them
  const lines = [];
  for (const actor of game.actors?.filter?.(a => a.type === "character") ?? []) {
    const { before, after } = await sleepEffects(actor);
    lines.push(`<b>${esc(actor.name)}</b>${before ? `: Exhausted ${before} → ${after}` : ""}`);
  }
  // v0.0.415 (pack CL): a system card (was a plain line)
  await ChatMessage.create({ content: sysCard({ title: "Sleep", lead: `Everyone sleeps 8 hours (now ${esc(clockText())})`, text: `Daily Actions are renewed for ${lines.length ? lines.join(", ") : "nobody"}.` }) });
}

/* ------------------------------------------------------------------ the window */
const gmOnly = html => (game.user?.isGM ? html : "");
const STEP = (s, label) => `<button type="button" data-s="${s}">${label}</button>`;
const TO = (k, icon, tip) => `<button type="button" data-to="${k}" aria-label="${tip}"><i class="fa-solid ${icon}"></i></button>`;

function clockHtml() {
  return `<div class="clockbody">
    <div class="clock-date">${esc(clockTitle())}</div>
    ${gmOnly(`
    <div class="clock-grid">
      ${STEP(10, "+ 1 Round")}${STEP(60, "+ 1 Minute")}${STEP(600, "+ 10 Minutes")}
      ${STEP(3600, "+ 1 Hour")}${STEP(86400, "+ 1 Day")}${STEP(7 * 86400, "+ 1 Week")}
    </div>
    <div class="clock-grid four">
      ${TO("dawn", "fa-cloud-sun", "Advance to dawn (06:00)")}${TO("noon", "fa-sun", "Advance to noon (12:00)")}${TO("dusk", "fa-cloud-moon", "Advance to dusk (18:00)")}${TO("midnight", "fa-moon", "Advance to midnight (00:00)")}
    </div>
    <div class="clock-custom">
      <input type="number" name="amount" min="0" step="any" placeholder="Number">
      <select name="unit">${Object.keys(UNITS)
        .map(u => `<option value="${u}">${u[0].toUpperCase() + u.slice(1)}</option>`)
        .join("")}</select>
      <button type="button" data-act="advance">Advance</button>
      <button type="button" data-act="back">Back</button>
    </div>
    <details class="clock-set"><summary>Set the date</summary>
      <div class="clock-setrow">
        <label>Year <input type="number" name="sy" step="1"></label>
        <label>Month <select name="sm"></select></label>
        <label>Day <input type="number" name="sd" min="1" step="1"></label>
        <label>Time <input type="text" name="st" placeholder="HH:MM:SS"></label>
        <button type="button" data-act="setdate">Set</button>
      </div>
      <p class="hint">Setting a date moves the clock, and Exhaustion counts the hours since each character's last Sleep. Turn off "Count Exhaustion" first to jump without it.</p>
    </details>
    <button type="button" class="clock-wide" data-act="sleep"><i class="fa-solid fa-bed"></i> Everyone sleeps (8 hours)</button>
    <label class="clock-track"><input type="checkbox" name="track" ${trackingExhaustion() ? "checked" : ""}> Count Exhaustion from the time awake</label>
    </div>`)}
  </div>`;
}

function bindClock(root) {
  root.addEventListener("click", async ev => {
    const b = ev.target.closest("button"); if (!b || !game.user?.isGM) return;
    if (b.dataset.s) return moveClock(Number(b.dataset.s));
    if (b.dataset.to) return moveClock(secondsUntil(Number(game.time.worldTime), b.dataset.to));
    const act = b.dataset.act;
    if (act === "sleep") return everyoneSleeps();
    if (act === "setdate") {
      const q = n => root.querySelector(`[name="${n}"]`);
      const r = timeFromFields({ year: q("sy")?.value === "" ? null : q("sy")?.value, month: q("sm")?.value, day: q("sd")?.value, time: q("st")?.value });
      if (r.error) return ui.notifications.warn(r.error);
      await moveClock(r.time - Number(game.time.worldTime));
      return fillDateFields(root);
    }
    if (act === "advance" || act === "back") {
      const n = Number(root.querySelector('[name="amount"]')?.value) || 0, u = UNITS[root.querySelector('[name="unit"]')?.value] ?? 1;
      if (n > 0) await moveClock(Math.round(n * u) * (act === "back" ? -1 : 1));
    }
  });
  root.addEventListener("change", ev => { if (ev.target.name === "track" && game.user?.isGM) setTracking(ev.target.checked); });
}

/** Put the current date in the "Set the date" fields (the month list too). */
export function fillDateFields(root, t = Number(game.time?.worldTime ?? 0)) {
  const f = dateFields(t), q = n => root?.querySelector?.(`[name="${n}"]`);
  if (!q("sd")) return;
  const hasCal = f.year != null;
  for (const n of ["sy", "sm"]) { const el = q(n)?.closest("label"); if (el) el.style.display = hasCal ? "" : "none"; }
  if (hasCal) { q("sy").value = f.year; q("sm").innerHTML = f.months.map((m, i) => `<option value="${i}"${i === f.month ? " selected" : ""}>${esc(m)}</option>`).join(""); }
  q("sd").value = f.day; q("st").value = f.time;
}

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? class {};
export class WorldClock extends ApplicationV2 {
  static DEFAULT_OPTIONS = { id: "twod12-clock", classes: ["twod12", "clockwin"], tag: "div", window: { title: "World Clock", icon: "fa-solid fa-clock", resizable: false }, position: { width: 400, height: "auto" } };
  static instance = null;
  static open() { const app = (WorldClock.instance ??= new WorldClock()); app.render({ force: true }); return app; }
  async _renderHTML() { return clockHtml(); }
  _replaceHTML(result, content) {
    content.innerHTML = result; bindClock(content); fillDateFields(content);
    content.querySelector(".clock-set")?.addEventListener("toggle", ev => { if (ev.target.open) fillDateFields(content); });
  }
  /** Only the date line changes: nothing is redrawn. */
  refresh() {
    const el = this.element?.querySelector?.(".clock-date"); if (el) el.textContent = clockTitle();
    const set = this.element?.querySelector?.(".clock-set"); if (set && !set.open) fillDateFields(this.element);   // an open section is being edited: leave it alone
  }
}

/* ------------------------------------------------------------------ the quick bar at the top of the chat */
const BAR = [[-3600, "fa-backward-fast", "Back 1 hour"], [-600, "fa-angles-left", "Back 10 minutes"], [-10, "fa-chevron-left", "Back 1 round (10 seconds)"],
  [10, "fa-chevron-right", "Forward 1 round (10 seconds)"], [600, "fa-angles-right", "Forward 10 minutes"], [3600, "fa-forward-fast", "Forward 1 hour"]];

export function barHtml() {
  const { time } = clockParts();
  const btn = ([s, icon, tip]) => `<button type="button" data-s="${s}" aria-label="${tip}"><i class="fa-solid ${icon}"></i></button>`;
  return `${BAR.slice(0, 3).map(btn).join("")}<span class="tb-time" data-open="1">${esc(time)}</span>${BAR.slice(3).map(btn).join("")}`;
}

/** A click anywhere on the page: if it is on one of the bar's buttons, move the clock. (Whole-page, so it works however the chat is redrawn.) */
let lastBarClick = 0;
export async function barClick(ev) {
  const b = ev.target?.closest?.(".twod12-timebar [data-s], .twod12-timebar [data-open], [data-s], [data-open]");
  if (!b) return;
  if (b.closest && !b.closest(".twod12-timebar") && !(ev.fromTest)) return;
  // Both pointerup and click arrive for one press: act once.
  const stamp = Date.now();
  if (ev.type === "click" || ev.type === "pointerup") { if (stamp - lastBarClick < 350) return; lastBarClick = stamp; }
  console.debug("twod12 | time bar", b.dataset.s ?? "open");
  try {
    if (b.dataset.open) return WorldClock.open();
    await moveClock(Number(b.dataset.s));
  } catch (e) {
    console.error("twod12 | time bar", e);
    globalThis.ui?.notifications?.error?.(`The time bar couldn't move the clock: ${e?.message ?? e}`);
  }
}

/** The bar is the first thing inside the chat tab, so it never scrolls away with the messages. */
export function insertBar(root) {
  if (!root?.prepend || !game.user?.isGM) return;
  try { if (!game.settings.get(F, "timeBar")) return; } catch (e) { /* default: shown */ }
  root.querySelector?.(".twod12-timebar")?.remove();
  const bar = document.createElement("div");
  bar.className = "twod12-timebar";
  bar.innerHTML = barHtml();
  root.prepend(bar);
  // If the message list sits under the bar instead of below it, push the list down by the overlap.
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => {
    try {
      const log = root.querySelector(".chat-scroll") ?? root.querySelector("#chat-log, .chat-log");
      if (!log) return;
      const over = bar.getBoundingClientRect().bottom + 4 - log.getBoundingClientRect().top;
      if (over > 1) log.style.paddingTop = `${(parseFloat(getComputedStyle(log).paddingTop) || 0) + over}px`;
    } catch (e) { /* layout not available */ }
  });
}

export function registerClock() {
  game.settings.register(F, "timeBar", { name: "Quick time bar above the chat (GM)", hint: "Six buttons to move the world clock: back and forward 1 hour, 10 minutes and 1 round.", scope: "client", config: true, type: Boolean, default: true, onChange: () => ui.chat?.render?.() });
  Hooks.on("renderChatLog", (app, html) => insertBar(app?.element ?? (typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : html?.[0])));
  Hooks.once("ready", () => {
    if (typeof document === "undefined") return;
    insertBar(document.querySelector("#chat"));
    document.addEventListener("click", barClick, true);
    document.addEventListener("pointerup", barClick, true);
  });
  Hooks.on("updateWorldTime", () => {
    WorldClock.instance?.refresh?.();
    if (typeof document === "undefined") return;
    const { time } = clockParts();
    document.querySelectorAll(".twod12-timebar .tb-time").forEach(el => { el.textContent = time; });
  });
  Hooks.on("getSceneControlButtons", controls => {
    try {
      const tool = { name: "twod12Clock", title: "World clock (2d12)", icon: "fa-solid fa-clock", button: true };
      if (Array.isArray(controls)) {   // V12
        const tc = controls.find(c => c.name === "token");
        if (tc && !tc.tools.some(t => t.name === tool.name)) tc.tools.push({ ...tool, onClick: () => WorldClock.open() });
      } else {                          // V13+
        const tc = controls.tokens ?? controls.token;
        if (tc?.tools) tc.tools[tool.name] = { ...tool, order: Object.keys(tc.tools).length + 1, onChange: () => WorldClock.open() };
      }
    } catch (e) { console.warn("twod12 | world clock button", e); }
  });
}

