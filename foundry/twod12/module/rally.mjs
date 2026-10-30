// Rally Points: each point heals ceil(Health Pool / 4). @Rally[N] buttons and Actions with "Use Rally Points" spend them.
import { esc } from "./roll.mjs";
import { fontOfMercy } from "./paladin.mjs";
const { DialogV2 } = foundry.applications.api;
const warn = m => ui.notifications.warn(m);

const BUCKETS = [["bodyLethal", "Body"], ["mindLethal", "Mind"], ["bodyNonlethal", "Body Nonlethal"], ["mindNonlethal", "Mind Nonlethal"]];

/** Default way to remove the damage: lethal damage first (Body, then Mind), then nonlethal. */
export function defaultHealing(damage, total) {
  const out = {};
  let left = total;
  for (const [k] of BUCKETS) { const n = Math.min(left, damage[k] ?? 0); if (n) out[k] = n; left -= n; }
  return out;
}

/** Turn the form values into a healing plan: each bucket capped at its damage, the total capped at the healing. */
export function planHealing(values, damage, total) {
  const out = {};
  let left = total;
  for (const [k] of BUCKETS) {
    const n = Math.min(Math.max(0, Math.floor(Number(values[k]) || 0)), damage[k] ?? 0, left);
    if (n) { out[k] = n; left -= n; }
  }
  return out;
}

async function chooseHealing(actor, total) {
  const d = actor.system.damage;
  const all = BUCKETS.reduce((s, [k]) => s + (d[k] ?? 0), 0);
  if (all <= total || BUCKETS.filter(([k]) => d[k] > 0).length <= 1) return defaultHealing(d, total);
  const def = defaultHealing(d, total);
  const rows = BUCKETS.filter(([k]) => d[k] > 0).map(([k, l]) => `<div class="form-group"><label>${l} <small>(${d[k]})</small></label><input type="number" min="0" max="${d[k]}" name="${k}" value="${def[k] ?? 0}"></div>`).join("");
  const res = await DialogV2.prompt({
    window: { title: `Rally: remove ${total} damage` },
    content: `<p>Choose which damage to remove (up to ${total}). Closing this window uses the suggestion.</p>${rows}`,
    ok: { label: "Heal", callback: (ev, btn) => Object.fromEntries(new FormData(btn.form)) }, rejectClose: false
  });
  return res ? planHealing(res, d, total) : def;
}

/**
 * Spend n Rally Points of an actor and heal. The chat card comes first (unless the Action's own card is already
 * in the chat: announce = false), then the window to choose which damage to heal; the card is then completed.
 */
export async function useRally(actor, n, why = "", { announce = true } = {}) {
  const s = actor?.system;
  if (!s?.rallyMax) { warn(`${actor?.name ?? "This creature"} has no Rally Points.`); return false; }
  if (!actor.isOwner) { warn(`Only the owner of ${actor.name} can use its Rally Points.`); return false; }
  if (s.rallyLeft < n) { warn(`${actor.name} has ${s.rallyLeft} Rally Point${s.rallyLeft === 1 ? "" : "s"} left and ${n} are needed.`); return false; }
  // Font of Mercy (P1, v0.0.181): a Paladin with Escalation 1+ within 5 squares adds its Power Modifier + 2 to each Rally Point.
  const fm = await fontOfMercy(actor);
  const total = (s.rallyHeal + (fm?.bonus ?? 0)) * n;
  const head = `<b>${esc(actor.name)}</b> uses ${n} Rally Point${n === 1 ? "" : "s"}${why ? ` <small>(${esc(why)})</small>` : ""}${fm ? ` <small>(Font of Mercy, ${esc(fm.name)}: +${fm.bonus} each)</small>` : ""}`;
  const card = announce ? await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<div class="twod12 chat apmsg">${head}.</div>` }) : null;
  const plan = await chooseHealing(actor, total);
  const upd = { "system.rallyUsed": s.rallyUsed + n };
  for (const [k, v] of Object.entries(plan)) upd[`system.damage.${k}`] = s.damage[k] - v;
  await actor.update(upd);
  const healed = Object.values(plan).reduce((a, b) => a + b, 0);
  const parts = BUCKETS.filter(([k]) => plan[k]).map(([k, l]) => `${plan[k]} ${l}`).join(", ");
  const result = `removes <b>${healed}</b> damage${parts ? ` (${parts})` : ""}. ${s.rallyMax - s.rallyUsed - n} Rally Points left.`;
  if (card) { try { await card.update({ content: `<div class="twod12 chat apmsg">${head}: ${result}</div>` }); return true; } catch (e) { /* not the author */ } }
  await ChatMessage.create({ content: `<div class="twod12 chat apmsg"><b>${esc(actor.name)}</b> ${result}</div>` });
  return true;
}

async function askHowMany(actor, max) {
  const left = actor.system.rallyLeft;
  const top = Math.min(max, left);
  if (top <= 1) return top;
  const v = await DialogV2.prompt({
    window: { title: "Rally Points" },
    content: `<p>How many Rally Points? (up to ${top}; ${left} left)</p><div class="form-group"><input type="number" name="n" min="1" max="${top}" value="${top}"></div>`,
    ok: { label: "Use", callback: (ev, btn) => Number(new FormData(btn.form).get("n")) }, rejectClose: false
  });
  return v ? Math.min(top, Math.max(1, Math.floor(v))) : 0;
}

/** The @Rally[N] button (@Rally[N|upto] lets you pick 1 to N): the creature that clicks uses the points. */
export async function handleRally(cfg) {
  const actor = canvas.tokens?.controlled[0]?.actor ?? game.user.character;
  if (!actor) return warn("Select your token (or assign a character) to use Rally Points.");
  const max = Math.max(1, Number(cfg.n) || 1);
  const n = cfg.upto ? await askHowMany(actor, max) : max;
  if (!n) return;
  return useRally(actor, n, "Rally");
}
