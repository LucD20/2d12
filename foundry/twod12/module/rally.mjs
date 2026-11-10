// Rally Points: each point heals ceil(Health Pool / 4). @Rally[N] buttons and Actions with "Use Rally Points" spend them.
import { esc } from "./roll.mjs";
import { rallyBonusFor } from "./automation.mjs";
import { sysCard } from "./sysmsg.mjs";
const warn = m => ui.notifications.warn(m);

import { BUCKETS, planHealing, symmetricHealing, healWindow, thresholdsOf } from "./healwin.mjs";
export { planHealing };
/** v0.0.250: the default split is the symmetrical one (healwin.mjs); kept under its old name for the callers and the tests. */
export const defaultHealing = (damage, total, thresholds = null) => symmetricHealing(damage, thresholds ?? { vigor: 1, resolve: 1 }, total);

/** v0.0.250 (Lucas): the Rally window (the system's style): the Rally Points left, the heal, the damage and its symmetrical split. */
async function chooseHealing(actor, total, { n = 1, extraText = "" } = {}) {
  const s = actor.system, d = s.damage;
  const all = BUCKETS.reduce((a, [k]) => a + (d[k] ?? 0), 0);
  const def = symmetricHealing(d, thresholdsOf(actor), total);
  if (all <= 0) return def;
  const plan = await healWindow({ name: actor.name, damage: d, thresholds: thresholdsOf(actor), total, totalText: `Remove up to ${total} damage${extraText ? ` (${extraText})` : ""}`, rally: { n, max: s.rallyMax, left: Math.max(0, s.rallyLeft - n) } });
  return plan;   // null: cancelled
}

/**
 * Spend n Rally Points of an actor and heal. The chat card comes first (unless the Action's own card is already
 * in the chat: announce = false), then the window to choose which damage to heal; the card is then completed.
 */
export async function useRally(actor, n, why = "", { announce = true, extra = "", source = null } = {}) {
  const s = actor?.system;
  // v0.0.340 (Lucas; book, Rally Points: NPCs): an NPC has no Rally Points; one an Action lets it use heals its Stage's amount and spends nothing
  const npc = actor?.type === "npc";
  if (!npc && !s?.rallyMax) { warn(`${actor?.name ?? "This creature"} has no Rally Points.`); return false; }
  if (!actor.isOwner) { warn(`Only the owner of ${actor.name} can use its Rally Points.`); return false; }
  if (!npc && s.rallyLeft < n) { warn(`${actor.name} has ${s.rallyLeft} Rally Point${s.rallyLeft === 1 ? "" : "s"} left and ${n} are needed.`); return false; }
  // v0.0.186: the "Rally Points" settings of the creature and of allies within their range (Font of Mercy: Power Modifier + 2, within 5); the highest counts.
  const fm = await rallyBonusFor(actor);
  // v0.0.250 (Lucas, Lay On Hands): an extra heal ("1d6+pow": the card's creature's Power Modifier) is rolled now and shown on the card and in the window
  let extraRoll = null, extraText = "";
  if (extra) {
    const f = String(extra).toLowerCase().replace(/\s+/g, "").replace(/\bpow\b/g, `(${Number(source?.system?.powerMod) || 0})`).replace(/\bmod\b/g, `(${Number(source?.system?.weaponMod) || 0})`).replace(/\brp\b/g, `(${Number(s.rallyHeal) || 0})`);
    try { extraRoll = await new Roll(f).evaluate(); extraText = `${esc(String(extra).replace(/\bpow\b/gi, `Pow ${Number(source?.system?.powerMod) || 0}`))} = ${extraRoll.total}`; } catch (e) { ui.notifications.warn(`Invalid formula: ${extra}`); }
  }
  const total = (s.rallyHeal + (fm?.bonus ?? 0)) * n + (extraRoll?.total ?? 0);
  // v0.0.215 (Lucas, playtest 2): the system card look (sysmsg.mjs, as Swap Initiative): a title bar, a bold line, a plain line.
  const lead = `${esc(actor.name)} uses ${n} Rally Point${n === 1 ? "" : "s"}`;
  const sub = [why && !/^rally$/i.test(why) ? esc(why) : "", `${total} healing (${n} × ${s.rallyHeal + (fm?.bonus ?? 0)}${extraRoll ? ` + ${extraRoll.total}` : ""})`, extraText ? `extra: ${extraText}` : "", fm ? `${esc(fm.source)}, ${esc(fm.name)}: +${fm.bonus} each` : ""].filter(Boolean).join(" · ");
  const rallyCard = text => sysCard({ title: "Rally", lead, text, cls: "rallymsg" });
  const card = announce || extraRoll ? await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: rallyCard(`${sub}. Choosing the damage to remove…`), rolls: extraRoll ? [extraRoll] : [] }) : null;
  const plan = await chooseHealing(actor, total, { n, extraText });
  if (!plan) { if (card) { try { await card.update({ content: rallyCard(`${sub}. Cancelled: no Rally Point used.`) }); } catch (e) { /* not the author */ } } return false; }
  const upd = npc ? {} : { "system.rallyUsed": s.rallyUsed + n };
  for (const [k, v] of Object.entries(plan)) upd[`system.damage.${k}`] = s.damage[k] - v;
  await actor.update(upd);
  const healed = Object.values(plan).reduce((a, b) => a + b, 0);
  const parts = BUCKETS.filter(([k]) => plan[k]).map(([k, l]) => `${plan[k]} ${l}`).join(", ");
  const leftN = s.rallyMax - s.rallyUsed - n;
  const result = `Removes <b>${healed}</b> damage${parts ? ` (${parts})` : ""}. ${npc ? `An NPC: each Rally Point counts as ${s.rallyHeal} at Stage ${s.stage ?? 1} and spends nothing.` : `<b>${leftN}</b> Rally Point${leftN === 1 ? "" : "s"} left.`}`;
  if (card) { try { await card.update({ content: rallyCard(`${sub}. ${result}`) }); return true; } catch (e) { /* not the author */ } }
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: rallyCard(`${sub}. ${result}`) });
  return true;
}

async function askHowMany(actor, max) {
  const left = actor.type === "npc" ? max : actor.system.rallyLeft;   // v0.0.340: an NPC spends none
  const top = Math.min(max, left);
  if (top <= 1) return top;
  if (!globalThis.foundry?.applications?.api?.ApplicationV2) return top;   // no windows (the tests)
  // v0.0.250: a pick window (the system's style), not a Foundry dialog
  const { pickWith } = await import("./pickwindow.mjs");
  const st = { n: top };
  const v = await pickWith({ title: "Rally Points", model: () => ({ name: "Rally Points", sub: actor.name, icon: "fa-heart-pulse", stats: [["Left", String(left)], ["Each heals", String(actor.system.rallyHeal)]],
    sections: [{ title: "How many?", pill: String(st.n), done: true, rows: [{ key: "n", label: "", opts: Array.from({ length: top }, (_, i) => ({ k: String(i + 1), l: String(i + 1), on: st.n === i + 1 })) }] }], complete: true, message: `${st.n} Rally Point${st.n === 1 ? "" : "s"}: ${st.n * actor.system.rallyHeal} healing.`, confirm: "Use" }),
    pick: (row, k) => { st.n = Math.min(top, Math.max(1, Number(k) || 1)); }, input: () => {}, result: () => st.n });
  return v ? Math.min(top, Math.max(1, Math.floor(v))) : 0;
}

/** The @Rally[N] button (@Rally[N|upto] lets you pick 1 to N): the creature that clicks uses the points. v0.0.250: |extra:1d6+pow adds a heal rolled with the card's creature's Modifiers. */
export async function handleRally(cfg, ctx = {}) {
  const actor = canvas.tokens?.controlled[0]?.actor ?? game.user.character;
  if (!actor) return warn("Select your token (or assign a character) to use Rally Points.");
  const max = Math.max(1, Number(cfg.n) || 1);
  const n = cfg.upto ? await askHowMany(actor, max) : max;
  if (!n) return;
  let source = ctx.actor ?? null;
  if (!source) { try { const u = ctx.message?.getFlag?.("twod12", "action")?.actorUuid; const a = u ? fromUuidSync(u) : null; source = a?.documentName === "Actor" ? a : (a?.actor ?? null); } catch (e) { source = null; } }
  return useRally(actor, n, "Rally", { extra: cfg.extra ?? "", source });
}
