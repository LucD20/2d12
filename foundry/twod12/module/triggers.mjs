// On damage (Round 11 of the rules, Tags): "When you deal [Holy] damage to a creature with the [Profane] Tag, that creature gains [an Effect]"
// (Profane Judgment). A setting of an Effect or of a passive; the trigger runs when the damage is applied to the target. The roll dialog says
// beforehand that it can trigger, and a chat line says when it did.
import { effectOff } from "./escalation.mjs";
import { allEffects } from "./passives.mjs";
import { applyEffects, originInfo } from "./effects.mjs";
import { tagChoices, TWOD12 } from "./config.mjs";
import { esc, hoverOf } from "./util.mjs";
const F = "twod12";
const norm = s => String(s ?? "").trim().toLowerCase();
const fxName = uuid => { try { return (typeof fromUuidSync === "function" && fromUuidSync(uuid)?.name) || "an effect"; } catch (e) { return "an effect"; } };

/** The triggers of a creature (effects and passives that are on) that this damage sets off: [{ sub, tag, fxUuid, source }]. comps: [{ sub, total }]. */
export function matchingTriggers(source, target, comps) {
  const subs = new Set((comps ?? []).filter(c => (Number(c.total) || 0) > 0 && c.sub).map(c => c.sub));
  let labels = {};
  try { labels = tagChoices() ?? {}; } catch (e) { /* no world tags */ }
  const tags = new Set([...(target?.system?.tags ?? [])].flatMap(k => [norm(k), norm(labels[k])]).filter(Boolean));
  const out = new Map();
  for (const e of allEffects(source)) {
    if (effectOff(source, e)) continue;
    for (const tr of e.getFlag?.(F, "triggers") ?? []) {
      if (!tr.fxUuid || (tr.sub && !subs.has(tr.sub)) || (tr.tag && !tags.has(norm(tr.tag)))) continue;
      out.set(tr.fxUuid, { ...tr, source: String(e.name ?? ""), hover: hoverOf(e.getFlag?.(F, "hover"), e.getFlag?.(F, "description")) });
    }
  }
  return [...out.values()];
}

/** For the roll dialog: the triggers that this roll could set off on its targets, given the damage types it can deal. [{ text, icon, why }]. */
export function triggerNotices(source, targets, subs) {
  const out = [], seen = new Set();
  for (const t of targets ?? []) {
    for (const tr of matchingTriggers(source, t, [...(subs ?? [])].map(sub => ({ sub, total: 1 })))) {
      const text = tr.source;   // the chip is just the name; the hover says what it does (the item's own hover text or description)
      const key = `${t.uuid}|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ text, icon: "fa-bolt", for: t.uuid, why: `${tr.hover ? `${tr.hover} ` : ""}[${TWOD12.subtypes[tr.sub] ?? "any"} damage to ${t.name} \u2192 ${fxName(tr.fxUuid)}]` });
    }
  }
  return out;
}

export async function runDamageTriggers(source, target, targetUuid, comps) {
  if (!source || !target) return;
  const hits = matchingTriggers(source, target, comps);
  if (!hits.length) return;
  await applyEffects(hits.map(h => h.fxUuid), [targetUuid], originInfo(source.uuid));
  if (typeof ChatMessage === "undefined") return;
  const lines = hits.map(h => `<i class="fa-solid fa-bolt"></i> <b>${esc(h.source)}</b> triggers: ${esc(target.name)} gains <b>${esc(fxName(h.fxUuid))}</b>.`);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker?.({ actor: source }), content: `<div class="twod12 chat">${lines.join("<br>")}</div>` });
}
