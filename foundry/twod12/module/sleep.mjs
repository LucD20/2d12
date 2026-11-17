import { openEffectSheet } from "./fxopen.mjs";
import { esc, unset } from "./util.mjs";
import { sysLine } from "./sysmsg.mjs";   // v0.0.415
// Sleep and Exhausted (see Resting and Exhausted in the rules), driven by the world clock (game.time.worldTime, in seconds).
//   A Sleep renews Daily Actions and reduces Exhausted by 2; at most once every 16 hours. A Rest includes a Sleep.
//   24 hours without a Sleep: Exhausted 1, +1 for every further 24 hours.
//   Exhausted: Speed - value (minimum 1), - value on all Rolls, Mind Damage Threshold - 4 x value (see data.mjs and askRoll).
//   With the Mind Damage Threshold at 0: a Mind Save, and again every 12 hours (the GM applies the result).
const F = "twod12";
const HOUR = 3600, DAY = 24 * HOUR;
// v0.0.415 (pack CL): a sysLine (was a plain line)
const post = async (actor, html) => ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-bed", await foundry.applications.ux.TextEditor.implementation.enrichHTML(html)) });
const now = () => Number(game.time?.worldTime ?? 0);

/** "5 hours", "1 day 3 hours" */
export function hoursText(seconds) {
  const h = Math.max(0, Math.round(seconds / HOUR));
  const d = Math.floor(h / 24), r = h % 24;
  return [d ? `${d} day${d === 1 ? "" : "s"}` : "", r || !d ? `${r} hour${r === 1 ? "" : "s"}` : ""].filter(Boolean).join(" ");
}

/** Is this effect the Exhausted condition? Recognized by its status, by our flag, or by its name ("Exhausted", "Exhausted 2"). */
export const isExhaustedFx = e => !!e && (!!e.statuses?.has?.("exhausted") || e.getFlag?.(F, "counter") === "exhausted" || e.flags?.[F]?.counter === "exhausted" || /^\s*Exhausted(\s+\d+)?\s*$/i.test(e.name ?? ""));

/** Set Exhausted to a value: the number on the creature, and an "Exhausted N" condition to show it. */
export async function setExhausted(actor, n) {
  n = Math.max(0, Math.round(Number(n) || 0));
  await actor.update({ "system.exhausted": n });
  const fx = actor.effects.find(isExhaustedFx);
  if (!n) {
    if (fx) await fx.delete();
  } else if (fx) {
    const ch = {};
    if (fx.name !== `Exhausted ${n}`) ch.name = `Exhausted ${n}`;
    if (fx.showIcon !== 2) ch.showIcon = 2;
    if (Object.keys(ch).length) await fx.update(ch);
  } else
    await actor.createEmbeddedDocuments("ActiveEffect", [
      {
        name: `Exhausted ${n}`,
        img: "icons/svg/sleep.svg",
        statuses: ["exhausted"],
        showIcon: 2,
        flags: { [F]: { counter: "exhausted" } },
        description:
          "<p>Speed reduced by the value (minimum 1); the value as a penalty on all Rolls; Mind Damage Threshold reduced by 4 times the value. Each Sleep reduces it by 2.</p>"
      }
    ]);
  await checkExhaustSave(actor, true);
  return n;
}

/** The effects of a completed Sleep (also part of a Rest): Daily Actions renewed, Exhausted - 2, the clock restarts. */
export async function sleepEffects(actor) {
  const before = Number(actor.system.exhausted ?? 0);
  await actor.update({ [`flags.${F}.dailyUsed`]: [], [`flags.${F}.lastSleep`]: now(), [`flags.${F}.awakeDays`]: 0, ...unset(`flags.${F}.exhaustSaveAt`) });
  const after = before ? await setExhausted(actor, before - 2) : 0;
  return { before, after };
}

/** The Sleep option of the Recovery button. At most once every 16 hours (anyone can still confirm). */
export async function completeSleep(actor, { force = false, ask = false } = {}) {
  const last = actor.getFlag(F, "lastSleep");
  // v0.0.289 (PACK SHEET): the confirmations in the system's window (pickwindow.mjs)
  const { pickConfirm } = await import("./pickwindow.mjs");
  if (!force && last != null && now() - last < 16 * HOUR) {
    const ok = await pickConfirm({ title: `Sleep: ${actor.name}`, name: "Sleep anyway?", sub: "once every 16 hours", icon: "fa-bed", confirm: "Sleep",
      text: `${esc(actor.name)}'s last Sleep ended ${hoursText(now() - last)} ago. A Sleep can be completed at most once every 16 hours. Complete a Sleep anyway?` });
    if (!ok) return false;
  } else if (ask && !(await pickConfirm({ title: `Sleep: ${actor.name}`, name: "Sleep", sub: "8 hours", icon: "fa-bed", confirm: "Sleep",
    text: "8 hours of sleep or quiet watch: your Daily Actions return and Exhausted goes down by 2. Complete a Sleep?" }))) return false;
  const { before, after } = await sleepEffects(actor);
  // v0.0.407 (book, Momentum): -1 at each Sleep, once a night for the party (a player's Sleep: the GM's client writes it)
  try { const m = await import("./escalation.mjs"); if (game.user.isGM) await m.momentumAfterSleep(); else m.momentumRequest({ sleeps: 1 }, "the party slept"); } catch (e) { /* no setting */ }
  const { sysCard } = await import("./sysmsg.mjs");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysCard({ title: "Sleep", lead: `${esc(actor.name)} completes a Sleep`, text: `Daily Actions are renewed${before ? `, and Exhausted goes from ${before} to ${after}` : ""}.` }) });
  return true;
}

/** With Exhausted and the Mind Damage Threshold at 0: ask for a Mind Save now (or when it is due), then again every 12 hours. */
async function checkExhaustSave(actor, changed = false) {
  const s = actor.system;
  if (!(s.exhausted > 0) || s.mdt > 0) { if (actor.getFlag(F, "exhaustSaveAt") != null) await actor.unsetFlag(F, "exhaustSaveAt"); return; }
  const due = actor.getFlag(F, "exhaustSaveAt");
  if (due != null && now() < due && !changed) return;
  if (due != null && changed && now() < due) return;   // already asked; the next Save is on its timer
  await actor.setFlag(F, "exhaustSaveAt", now() + 12 * HOUR);
  await post(actor, `<b>${esc(actor.name)}</b> is Exhausted ${s.exhausted} and its Mind Damage Threshold is 0: it must make a <b>Mind Save</b> @Check[mind|label:Mind Save].<br>
    <b>Tier 1:</b> Unconscious, and a Sleep starts; it can't wake up while its Mind Damage Threshold is 0.<br>
    <b>Tier 2:</b> Exhausted +1, and this Save again in 12 hours.<br>
    <b>Tier 3:</b> this Save again in 12 hours.`);
}

/** Is Exhaustion counted from the time awake? (A world setting; off lets the clock jump many days.) */
export const trackingExhaustion = () => { try { return !!game.settings.get(F, "trackExhaustion"); } catch (e) { return true; } };

/** Turn the counting on or off. Turning it on starts every character's time awake from now. */
export async function setTracking(on) {
  await game.settings.set(F, "trackExhaustion", !!on);
  if (on) for (const actor of game.actors?.filter?.(a => a.type === "character") ?? []) await actor.update({ [`flags.${F}.lastSleep`]: now(), [`flags.${F}.awakeDays`]: 0, ...unset(`flags.${F}.exhaustSaveAt`) });
  await ChatMessage.create({ content: sysLine("fa-hourglass-half", `Exhaustion from time awake is now <b>${on ? "counted (everyone's time awake starts from now)" : "paused"}</b>.`) });   // v0.0.415: a sysLine
}

/** Exhausted +1 or -1 (a click or a right-click on its condition). Only characters have the value. */
export async function bumpExhausted(actor, delta) {
  if (actor?.type !== "character") return null;
  try {
    return await setExhausted(actor, Number(actor.system.exhausted ?? 0) + delta);
  } catch (e) {
    console.error("twod12 | Exhausted", e);
    globalThis.ui?.notifications?.error?.(`Couldn't change Exhausted: ${e?.message ?? e}`);
    return null;
  }
}

/** A click on the Exhausted condition: +1; with Shift, open its settings instead; with Ctrl, remove it whatever its value. */
export async function exhaustedClick(actor, fx, { shift = false, ctrl = false } = {}) {
  if (shift) { openEffectSheet(fx); return "opened"; }
  if (!actor?.isOwner) return "denied";
  if (ctrl) { await setExhausted(actor, 0); return "removed"; }
  await bumpExhausted(actor, 1);
  return "bumped";
}

/** The token HUD's condition grid: only the tooltip. (The clicks go through Foundry's own status toggle, below: one path, no handlers of ours.) */
export function exhaustedHud(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const actor = (app?.document ?? app?.object)?.actor;
  const el = root?.querySelector?.('[data-status-id="exhausted"]');
  if (!el || actor?.type !== "character") return false;
  const n = Number(actor.system.exhausted ?? 0);
  el.dataset.tooltip = `Exhausted${n ? ` ${n}` : ""} · Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove`;
  return true;
}

/** The modifier keys held right now (Foundry tracks them). */
export function heldModifiers() {
  const d = globalThis.game?.keyboard?.downKeys;
  const any = codes => !!d && codes.some(c => d.has(c));
  return { shift: any(["ShiftLeft", "ShiftRight"]), ctrl: any(["ControlLeft", "ControlRight", "MetaLeft", "MetaRight"]) };
}

/**
 * The Token HUD (and macros) switch a condition with Actor#toggleStatusEffect. For Exhausted, which has a value, that is changed:
 * a click is +1 (Shift: settings, Ctrl: remove) and a right-click (Foundry passes overlay: true) is -1; `active` is ignored (the HUD sends
 * true or false to apply or remove). Foundry's own toggle, which would delete the effect and make a new one without its value, never runs.
 */
export function wrapToggleStatus(proto) {
  const orig = proto?.toggleStatusEffect;
  if (typeof orig !== "function" || orig.twod12) return false;
  const wrapped = async function (statusId, options = {}) {
    if (statusId !== "exhausted" || this.type !== "character") return orig.call(this, statusId, options);
    const find = () => this.effects.find(isExhaustedFx);
    // The HUD tells Foundry to apply or remove it (active: true / false); for a condition with a value that means nothing:
    // a click is +1 and a right-click (overlay) is -1, whatever active says. (Macros: use game.twod12.exhausted.)
    if (this.isOwner) {
      if (options.overlay) await bumpExhausted(this, -1);
      else await exhaustedClick(this, find(), heldModifiers());
    }
    try { globalThis.canvas?.hud?.token?.render?.(); } catch (e) { /* no HUD open */ }
    return find() ?? false;
  };
  wrapped.twod12 = true;
  proto.toggleStatusEffect = wrapped;
  return true;
}

/** The world clock moved: count the days without a Sleep, and the Mind Saves due. Only the active GM does this. */
async function onWorldTime(worldTime) {
  if (!game.user?.isActiveGM || !trackingExhaustion()) return;
  for (const actor of game.actors?.filter?.(a => a.type === "character") ?? []) {
    try {
      const last = actor.getFlag(F, "lastSleep");
      if (last == null) { await actor.setFlag(F, "lastSleep", worldTime); continue; }   // start counting from now
      const days = Math.floor((worldTime - last) / DAY), applied = Number(actor.getFlag(F, "awakeDays") ?? 0);
      if (days > applied) {
        const n = Number(actor.system.exhausted ?? 0) + (days - applied);
        await actor.setFlag(F, "awakeDays", days);
        await post(actor, `<b>${esc(actor.name)}</b> has gone ${hoursText(worldTime - last)} without a Sleep: <b>Exhausted ${n}</b>.`);
        await setExhausted(actor, n);   // (this asks for the Mind Save if the threshold is now 0)
      }
      await checkExhaustSave(actor);
    } catch (e) { console.warn(`twod12 | clock check for ${actor.name}`, e); }
  }
}

/** Clock checks run one at a time, in order: the clock can move several times in a row (every round of a combat). */
let queue = Promise.resolve();
export function clockTick(worldTime) {
  queue = queue.then(() => onWorldTime(Number(worldTime) || 0)).catch(e => console.warn("twod12 | clock check", e));
  return queue;
}

export function registerSleep() {
  game.settings.register(F, "trackExhaustion", { scope: "world", config: false, type: Boolean, default: true });
  Hooks.on("updateWorldTime", worldTime => { clockTick(worldTime); });
  Hooks.on("renderTokenHUD", (app, html) => { try { exhaustedHud(app, html); } catch (e) { console.warn("twod12 | token HUD", e); } });
  wrapToggleStatus(globalThis.CONFIG?.Actor?.documentClass?.prototype);
  // An Exhausted condition added or removed by hand (the token HUD) keeps the value in step.
  Hooks.on("createActiveEffect", (e, opts, userId) => {
    const a = e.parent;
    if (userId !== game.user?.id || a?.type !== "character" || !isExhaustedFx(e) || !(Number(a.system.exhausted ?? 0) === 0)) return;
    setExhausted(a, 1).catch(() => {});
  });
  Hooks.on("deleteActiveEffect", (e, opts, userId) => {
    const a = e.parent;
    if (userId !== game.user?.id || a?.type !== "character" || !isExhaustedFx(e) || !(Number(a.system.exhausted ?? 0) > 0)) return;
    a.update({ "system.exhausted": 0 }).catch(() => {});
  });
}
