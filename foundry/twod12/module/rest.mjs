import { completeSleep, sleepEffects, setExhausted, hoursText } from "./sleep.mjs";
import { clockText } from "./clock.mjs";
// Recovery (see Resting in the rules): Take a Breather (10 minutes), Sleep (8 hours) or Rest (24 hours in a safe place).
import { performCheck, checkHtml, combineRolls, sgn, esc } from "./roll.mjs";
import { sysCard } from "./sysmsg.mjs";
import { pickConfirm } from "./pickwindow.mjs";

export async function completeRest(actor) {
  const s = actor.system;
  // v0.0.289 (PACK SHEET): the confirmation in the system's window; the chat as a system card
  const ok = await pickConfirm({ title: `Rest: ${actor.name}`, name: "Rest", sub: "24 hours, safe place", icon: "fa-campground", confirm: "Rest",
    text: "A Rest is a day (24 hours) in a safe place. Remove all damage, regain all Rally Points, and roll a Body Check and a Mind Check for your Wounds. A Rest includes a Sleep. Complete the Rest?" });
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
  upd[`flags.twod12.restSwap`] = true;   // v0.0.407 (book, Swapping on a Rest): the Build tab's Swap until the next encounter starts
  await actor.update(upd);
  // v0.0.243: a Rest uses up the party's Momentum; v0.0.407 (book, Momentum): you leave a Rest with Momentum 0 (a player's Rest: the GM's client, escalation.mjs momentumRequest)
  try { const { momentumEvent, momentumRequest } = await import("./escalation.mjs"); if (game.user.isGM) await momentumEvent({ rest: true }, "the party rested"); else momentumRequest({ rest: true }, "the party rested"); } catch (e) { /* no setting */ }
  const slept = await sleepEffects(actor);   // a Rest includes a Sleep
  const all = combineRolls(rolls);
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    rolls: all ? [all] : [],
    content: `${sysCard({ title: "Rest", lead: `${esc(actor.name)} completes a Rest`, text: `All damage is removed, all Rally Points are back, and Daily Actions are renewed (a Rest includes a Sleep). The level-list choices can be swapped (Build tab, Swap on a Rest)${slept.before ? `; Exhausted goes from ${slept.before} to ${slept.after}` : ""}.` })}${blocks.length ? `<div class="twod12 chat">${blocks.join("")}</div>` : ""}`
  });
  return true;
}

/** The recovery button: pick a Breather, a Sleep or a Rest. */
export async function chooseRecovery(actor) {
  const last = actor.getFlag("twod12", "lastSleep"), exh = Number(actor.system.exhausted ?? 0);
  const st = { k: null };
  // v0.0.415 (pack CL): the pick window (was a DialogV2): Exhausted as a stepper, then the recovery (a click picks it)
  let setTo = exh;
  const { pickWith, pwStepHtml } = await import("./pickwindow.mjs");
  const pick = await pickWith({
    title: `Recovery: ${actor.name}`, instant: true,
    model: () => ({ name: "Recovery", sub: actor.name, icon: "fa-campground", stats: [["Last Sleep", last == null ? "not recorded yet" : `${hoursText(game.time.worldTime - last)} ago`], ["Now", clockText()]],
      sections: [{ title: "", html: `<div class="cw-attr">${pwStepHtml("exhausted", setTo, "Exhausted")}</div>` },
        { title: "", sub: "Take a Breather (10 minutes): remove all Nonlethal damage. Sleep (8 hours, at most once every 16 hours): renews Daily Actions and reduces Exhausted by 2. Rest (24 hours in a safe place): remove all damage, regain all Rally Points, roll to remove Wounds; a Rest includes a Sleep.",
          rows: [{ key: "how", label: "", opts: [["breather", "Breather"], ["sleep", "Sleep"], ["rest", "Rest"], ["none", "Only update Exhausted"]].map(([k, l]) => ({ k, l, on: false })) }] }],
      message: "", confirm: false }),
    step: (f, d) => { if (f === "exhausted") setTo = Math.max(0, setTo + d); },
    pick: (r, k) => { st.k = k; },
    result: () => st.k
  });
  if (pick && setTo !== exh) await setExhausted(actor, setTo);
  if (pick === "breather") return takeBreather(actor);
  if (pick === "sleep") return completeSleep(actor);
  if (pick === "rest") return completeRest(actor);
  return false;
}

export async function takeBreather(actor, { ask = false } = {}) {
  const d = actor.system.damage ?? {};
  const removed = (d.bodyNonlethal ?? 0) + (d.mindNonlethal ?? 0);
  // v0.0.289 (PACK SHEET): the Upkeep tab asks first (the system's window); the chat as a system card
  if (ask && !(await pickConfirm({ title: `Breather: ${actor.name}`, name: "Take a Breather", sub: "10 minutes", icon: "fa-mug-hot", confirm: "Take a Breather",
    text: `10 minutes of rest: remove all your Nonlethal damage (${removed ? `${removed} now` : "none now"}). It is not a Rest.` }))) return false;
  await actor.update({ "system.damage.bodyNonlethal": 0, "system.damage.mindNonlethal": 0 });
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysCard({ title: "Breather", lead: `${esc(actor.name)} takes a Breather`, text: removed ? `${removed} Nonlethal damage removed.` : "No Nonlethal damage to remove." }) });
  return true;
}

