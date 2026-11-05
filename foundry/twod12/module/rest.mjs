import { completeSleep, sleepEffects, setExhausted, hoursText } from "./sleep.mjs";
import { clockText } from "./clock.mjs";
// Recovery (see Resting in the rules): Take a Breather (10 minutes), Sleep (8 hours) or Rest (24 hours in a safe place).
import { performCheck, checkHtml, combineRolls, sgn, esc } from "./roll.mjs";
const { DialogV2 } = foundry.applications.api;

export async function completeRest(actor) {
  const s = actor.system;
  const ok = await DialogV2.confirm({
    window: { title: "Rest" },
    content: "<p>A rest is a day (24 hours) in a safe place. Remove all damage, regain all Rally Points, and roll to remove Wounds. Complete the rest?</p>",
    rejectClose: false
  });
  if (!ok) return false;
  const upd = { "system.damage": { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, "system.rallyUsed": 0 };
  const rolls = [], blocks = [];
  for (const [key, label] of [["body", "Body"], ["mind", "Mind"]]) {
    const wounds = s[`${key}Wounds`];
    if (!wounds) continue;
    const mod = s.attributes[key] ?? 0;
    const r = await performCheck({ mod });
    rolls.push(...r.rolls);
    const removed = Math.min(wounds, r.tier);
    upd[`system.${key}Wounds`] = wounds - removed;
    blocks.push(`${checkHtml(`${label} Wounds`, r, [`Modifier ${sgn(mod)}`, "DC 13"], { showTier: true })}<div>Removes <b>${removed}</b> Wound${removed === 1 ? "" : "s"} (${wounds - removed} left).</div>`);
  }
  await actor.update(upd);
  try { const { hasMomentum, setMomentum } = await import("./escalation.mjs"); if (game.user.isGM && hasMomentum()) await setMomentum(false); } catch (e) { /* no setting */ }   // v0.0.243: a Rest uses up the party's Momentum
  const slept = await sleepEffects(actor);   // a Rest includes a Sleep
  const all = combineRolls(rolls);
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    rolls: all ? [all] : [],
    content: `<div class="twod12 chat"><div class="apmsg"><b>${esc(actor.name)}</b> completes a Rest (which includes a Sleep): all damage is removed, all Rally Points are back, and Daily Actions are renewed${slept.before ? `; Exhausted goes from ${slept.before} to ${slept.after}` : ""}.</div>${blocks.join("")}</div>`
  });
  return true;
}

/** The recovery button: pick a Breather, a Sleep or a Rest. */
export async function chooseRecovery(actor) {
  const last = actor.getFlag("twod12", "lastSleep"), exh = Number(actor.system.exhausted ?? 0);
  const status = `<p class="hint">Exhausted: <input type="number" name="exhausted" value="${exh}" min="0" style="width:4em"> · Last Sleep: ${last == null ? "not recorded yet" : `${hoursText(game.time.worldTime - last)} ago`} · Now: ${clockText()}</p>`;
  let setTo = exh;
  const pick = await DialogV2.wait({
    window: { title: `Recovery: ${actor.name}` },
    content: `${status}<p><b>Take a Breather</b> (10 minutes): remove all Nonlethal damage.</p>
      <p><b>Sleep</b> (8 hours, at most once every 16 hours): renews Daily Actions and reduces Exhausted by 2.</p>
      <p><b>Rest</b> (24 hours in a safe place): remove all damage, regain all Rally Points, roll to remove Wounds. A Rest includes a Sleep.</p>`,
    buttons: [
      { action: "breather", label: "Breather", icon: "fa-solid fa-mug-hot" },
      { action: "sleep", label: "Sleep", icon: "fa-solid fa-bed" },
      { action: "rest", label: "Rest", icon: "fa-solid fa-campground", default: true },
      { action: "none", label: "Only update Exhausted", icon: "fa-solid fa-check" }
    ],
    render: (event, dialog) => { dialog.element.querySelector('[name="exhausted"]')?.addEventListener("change", ev => { setTo = Number(ev.target.value) || 0; }); },
    rejectClose: false
  });
  if (pick && setTo !== exh) await setExhausted(actor, setTo);
  if (pick === "breather") return takeBreather(actor);
  if (pick === "sleep") return completeSleep(actor);
  if (pick === "rest") return completeRest(actor);
  return false;
}

export async function takeBreather(actor) {
  const d = actor.system.damage ?? {};
  const removed = (d.bodyNonlethal ?? 0) + (d.mindNonlethal ?? 0);
  await actor.update({ "system.damage.bodyNonlethal": 0, "system.damage.mindNonlethal": 0 });
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<div class="twod12 chat"><div class="apmsg"><b>${esc(actor.name)}</b> takes a Breather: ${removed ? `<b>${removed}</b> Nonlethal damage removed` : "no Nonlethal damage to remove"}.</div></div>` });
  return true;
}

