// Rally Points: each point heals ceil(Health Pool / 4). @Rally[N] buttons and Actions with "Use Rally Points" spend them.
import { rallyBonusFor } from "./automation.mjs";
import { sysLine } from "./sysmsg.mjs";
const warn = m => ui.notifications.warn(m);

import { planHealing, symmetricHealing, healWindowFull, thresholdsOf, healLinesHtml, answererFor } from "./healwin.mjs";
export { healLinesHtml };
export { planHealing };
/** v0.0.250: the default split is the symmetrical one (healwin.mjs); kept under its old name for the callers and the tests. */
export const defaultHealing = (damage, total, thresholds = null) => symmetricHealing(damage, thresholds ?? { vigor: 1, resolve: 1 }, total);

const shortName = a => String(a?.name ?? "").replace(/\s*\(.*$/, "").trim() || a?.name || "";

/**
 * Spend n Rally Points of an actor and heal (v0.0.454, D1): the Rally window first (the count in it when an Action lets you use up to `top`), then
 * one line in the chat once Use is pressed; nothing is posted while choosing or when cancelled. Lay On Hands' extra heal is rolled first and
 * rides on that line.
 */
export async function useRally(actor, n, why = "", { extra = "", source = null, top = 0 } = {}) {
  const s = actor?.system;
  // v0.0.340 (Lucas; book, Rally Points: NPCs): an NPC has no Rally Points; one an Action lets it use heals its Stage's amount and spends nothing
  const npc = actor?.type === "npc";
  if (!npc && !s?.rallyMax) { warn(`${actor?.name ?? "This creature"} has no Rally Points.`); return false; }
  if (!actor.isOwner) { warn(`Only the owner of ${actor.name} can use its Rally Points.`); return false; }
  if (!npc && s.rallyLeft < n) { warn(`${actor.name} has ${s.rallyLeft} Rally Point${s.rallyLeft === 1 ? "" : "s"} left and ${n} are needed.`); return false; }
  // v0.0.186: the "Rally Points" settings of the creature and of allies within their range (Font of Mercy: Power Modifier + 2, within 5); the highest counts.
  const fm = await rallyBonusFor(actor);
  // v0.0.250 (Lucas, Lay On Hands): an extra heal ("1d6+pow": the card's creature's Power Modifier) is rolled now and shown in the window and the line
  let extraRoll = null, extraName = "";
  if (extra) {
    const f = String(extra).toLowerCase().replace(/\s+/g, "").replace(/\bpow\b/g, `(${Number(source?.system?.powerMod) || 0})`).replace(/\bmod\b/g, `(${Number(source?.system?.weaponMod) || 0})`).replace(/\brp\b/g, `(${Number(s.rallyHeal) || 0})`);
    try { extraRoll = await new Roll(f).evaluate(); extraName = why && !/^rally$/i.test(why) ? why : String(extra).replace(/\bpow\b/gi, "Pow"); } catch (e) { ui.notifications.warn(`Invalid formula: ${extra}`); }
  }
  const partsFor = k => [[s.rallyHeal * k, ""], ...(fm?.bonus ? [[fm.bonus * k, fm.name]] : []), ...(extraRoll ? [[extraRoll.total, extraName]] : [])];
  const leftNow = npc ? Math.max(n, top || n) : s.rallyLeft;
  const res = await healWindowFull({ title: `Rally: ${shortName(actor)}`, name: shortName(actor), damage: s.damage, thresholds: thresholdsOf(actor), partsFor,
    rally: npc ? null : { max: s.rallyMax, left: leftNow, top: Math.min(top || n, leftNow) }, n });
  if (!res) return false;
  const used = res.n, plan = res.plan;
  const upd = npc ? {} : { "system.rallyUsed": s.rallyUsed + used };
  for (const [k, v] of Object.entries(plan)) upd[`system.damage.${k}`] = s.damage[k] - v;
  await actor.update(upd);
  const leftN = s.rallyMax - s.rallyUsed - used;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-heart-pulse", healLinesHtml(shortName(actor), plan, partsFor(used), { rally: { n: used, left: leftN }, npc }), "healmsg rallymsg"), rolls: extraRoll ? [extraRoll] : [] });
  return true;
}

/** Pure: whether an Action's Targets line names another creature rather than Self. */
export const targetsOther = t => {
  const s = String(t ?? "").trim().toLowerCase();
  return !!s && !/^(self|you)\b/.test(s);
};

/** Resolve an Actor from a token/actor UUID. */
async function actorFromUuid(u) {
  if (!u) return null;
  try { const d = await fromUuid(u); return d?.documentName === "Actor" ? d : (d?.actor ?? null); } catch (e) { return null; }
}

/** Prompt the creature's owner to use Rally Points (local if owned/answerer, via socket otherwise). */
export async function promptRally(actor, n, why = "Rally", { extra = "", source = null, top = 0 } = {}) {
  const who = answererFor(actor);
  if (who?.id && who.id !== game.user?.id && !actor.isOwner) {
    game.socket.emit("system.twod12", { type: "rallyPrompt", userId: who.id, actorUuid: actor.uuid, n, why, extra, sourceUuid: source?.uuid ?? "", top });
    return true;
  }
  return useRally(actor, n, why, { extra, source, top });
}

/** The @Rally[N] button (@Rally[N|upto] lets you pick 1 to N): targets the Action's target (e.g. Lay On Hands / Heal), prompting when needed. v0.0.250: |extra:1d6+pow adds a heal rolled with the card's creature's Modifiers. */
export async function handleRally(cfg, ctx = {}) {
  const actFlag = ctx.message?.getFlag?.("twod12", "action") ?? null;
  let source = ctx.actor ?? null;
  if (!source && actFlag?.actorUuid) source = await actorFromUuid(actFlag.actorUuid);
  const srcItem = source && actFlag?.itemId ? source.items?.get?.(actFlag.itemId) : null;
  const needOther = !cfg.self && targetsOther(srcItem?.system?.targets ?? "");

  let actors = [];
  const rawTargets = ctx.targets?.length ? ctx.targets : (actFlag?.targets?.length ? actFlag.targets : []);
  if (!cfg.self && rawTargets.length) {
    actors = (await Promise.all(rawTargets.map(t => actorFromUuid(t.uuid ?? t)))).filter(Boolean);
  }
  if (!actors.length && !cfg.self && game.user?.targets?.size) {
    actors = [...game.user.targets].map(t => t.actor).filter(Boolean);
  }
  if (!actors.length && needOther) {
    const srcTok = source?.getActiveTokens?.(true, true)?.[0] ?? canvas.tokens?.controlled?.[0] ?? null;
    const disp = srcTok?.document?.disposition ?? 1;
    const allies = (canvas.tokens?.placeables ?? []).filter(t => t.actor && Number(t.document?.disposition ?? 0) === disp && t.actor.uuid !== source?.uuid);
    const cands = [...allies.map(t => ({ actor: t.actor, tok: t })), ...(source ? [{ actor: source, tok: srcTok }] : [])];
    if (cands.length > 1) {
      const { pickBar } = await import("./pickbar.mjs");
      const pick = await pickBar({
        icon: "fa-heart-pulse",
        text: `<b>${shortName(srcItem) || "Rally"}</b>: Who uses a Rally Point? (click here or the token)`,
        options: cands.map((c, i) => ({ id: String(i), label: c.actor === source ? `You (${shortName(c.actor)})` : shortName(c.actor), cls: c.actor === source ? "you" : "", token: c.tok ?? undefined }))
      });
      if (pick == null || pick === "done") return false;
      const chosen = cands[Number(pick)]?.actor;
      if (chosen) actors = [chosen];
    } else if (cands.length === 1) {
      actors = [cands[0].actor];
    }
  }
  if (!actors.length) {
    const fallback = (cfg.self ? source : null) ?? canvas.tokens?.controlled[0]?.actor ?? game.user.character;
    if (fallback) actors = [fallback];
  }
  if (!actors.length) return warn("Select or target a creature to use Rally Points.");

  let actor = actors[0];
  if (actors.length > 1) {
    const { pickBar } = await import("./pickbar.mjs");
    const pick = await pickBar({
      icon: "fa-heart-pulse",
      text: `<b>${shortName(srcItem) || "Rally"}</b>: Who uses a Rally Point?`,
      options: actors.map((a, i) => ({ id: String(i), label: shortName(a), token: a.getActiveTokens?.(true, true)?.[0] ?? undefined }))
    });
    if (pick == null || pick === "done") return false;
    actor = actors[Number(pick)];
    if (!actor) return false;
  }

  const max = Math.max(1, Number(cfg.n) || 1);
  // v0.0.454 (D1): "up to N": the count is the Rally window's first line (it was a window of its own); it starts at the most that can be used
  const left = actor.type === "npc" ? max : Number(actor.system?.rallyLeft) || 0, n = cfg.upto ? Math.min(max, left) : max;
  if (!n) return warn(`${actor.name} has no Rally Point left.`);
  return promptRally(actor, n, srcItem?.name || "Rally", { extra: cfg.extra ?? "", source, top: cfg.upto ? n : 0 });
}
