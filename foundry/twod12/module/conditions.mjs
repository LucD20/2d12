// v0.0.314 (pack AU, the conditions as items; book, Chapter 8): what the new conditions do on the map and in combat.
//   Frightened: the sight check behind its "whileSeen" rule (escalation.mjs effectOff); Dazed: the AP it takes now and at the next regain;
//   Bleed: its damage card at the end of each of the creature's turns; Grabbed: it ends when the holder goes Down.
// The pure parts are in condrules.mjs.
import { setSeenGate } from "./escalation.mjs";
import { dazeSplit, bleedOf, bleedPool, bleedText } from "./condrules.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./roll.mjs";
import { TWOD12 } from "./config.mjs";
const F = "twod12";
const tokenOf = a => a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null;
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);
const originActor = e => { try { return e?.origin ? actorOf(fromUuidSync(e.origin)) : null; } catch (err) { return null; } };
const fxList = a => (typeof a?.effects?.filter === "function" ? a.effects.filter(() => true) : []);   // a Collection (or a test's stand-in)
const valueOf = e => Math.max(1, Math.trunc(Number(e?.getFlag?.(F, "value"))) || 1);

/** Does the creature see the effect's origin (Clear or Obscured to it, with Line of Effect)? No token on the map for either: yes (the rule works). */
async function seesOriginFn() {
  const { perceive } = await import("./senses.mjs");
  const { coverBetween } = await import("./cover.mjs");
  return (actor, e) => {
    const src = originActor(e), me = tokenOf(actor), them = tokenOf(src);
    if (!src || !me || !them || me === them) return true;
    const pv = perceive(me, them, { loe: !coverBetween(me, them)?.noLoE });
    return pv.level === "clear" || pv.level === "obscured";
  };
}

/** Dazed N: the AP it takes when it lands (the rest waits for the next regain); with nothing left to take, it ends. */
async function dazeOnApply(effect) {
  const actor = effect.parent;
  if (!actor || effect.disabled || !effect.getFlag(F, "loseAp")) return;
  const C = await import("./combat.mjs");
  const c = game.combat?.started ? C.combatantOf(actor, game.combat) : null;
  const v = valueOf(effect), name = esc(c?.name ?? actor.name);
  if (!c) {
    await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${name}</b> is ${esc(effect.name)}, out of combat: no AP to lose. It ends.`) });
    return effect.delete();
  }
  const { now, rest } = dazeSplit(C.getAP(c), v);
  if (now) await C.setAP(c, C.getAP(c) - now, `${effect.name}`, { kind: "react" });
  await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${name}</b> is ${esc(effect.name)}: loses <b>${now} AP</b> now${rest ? `, and ${rest} from the AP of its next turn` : ""}.`) });
  if (rest) await effect.setFlag(F, "dazeRest", rest);
  else await effect.delete();
}

/** The start of a creature's turn, after it regains AP: a Dazed that still has AP to take takes them, then ends. GM only (combat.mjs startTurn). */
export async function dazeAtTurnStart(c) {
  const actor = c?.actor;
  if (!actor) return;
  const C = await import("./combat.mjs");
  for (const e of fxList(actor).filter(x => Number(x.getFlag?.(F, "dazeRest")) > 0)) {
    const rest = Number(e.getFlag(F, "dazeRest")), have = C.getAP(c), take = Math.min(have, rest);
    if (take) await C.setAP(c, have - take, `${e.name}`, { kind: "react" });
    await ChatMessage.create({ content: sysLine("fa-star-half-stroke", `<b>${esc(c.name)}</b>: ${esc(e.name)} takes <b>${take} AP</b> of this turn's AP, then ends.`) });
    await e.delete();
  }
}

/** Bleed: at the end of each of the creature's turns, its damage is rolled on a damage card targeting it (the Damage button applies it). */
export async function bleedAtTurnEnd(actor) {
  const list = fxList(actor).filter(e => !e.disabled).map(e => [e, bleedOf(e)]).filter(([, b]) => b);
  if (!list.length) return;
  const { parseParts, rollParts } = await import("./inline.mjs");
  const { enrich } = await import("./actions.mjs");
  const { postDamageCard } = await import("./dmgcard.mjs");
  const tok = tokenOf(actor);
  for (const [e, b] of list) {
    const pool = bleedPool(b.pool, b.attrs);
    const parts = parseParts(`[${pool === "M" ? "R" : "V"}] ${b.dmg}${b.sub ? ` ${b.sub}` : ""}`);
    if (!parts.damage.length) continue;
    const { comps, rolls } = await rollParts(parts.damage, false);
    const attrs = (b.attrs?.length ? b.attrs : ["body", "instinct"]).map(a => TWOD12.attributes[a] ?? a).join(" or ");
    const save = `Interact (1 AP), on itself or a creature within Reach, ends it with a Save (the better of ${attrs}) against DC ${b.dc || 13}: Tier 2 takes half this Bleed at the end of that turn, then it ends; Tier 3 ends it. Healing doesn't.`;
    await postDamageCard({ actor: originActor(e), title: `${bleedText(b)}`, subtitle: `End of ${actor.name}'s turn`, comps, rolls, texts: [await enrich(save)], targets: tok ? [{ uuid: tok.document.uuid, name: tok.name }] : [], originUuid: e.origin ?? "" });
  }
}

/** Grabbed (and any effect with the "endsWithOrigin" rule): it ends when its origin goes Down or Unconscious. */
export async function endHeldBy(origin) {
  if (!origin?.uuid) return;
  const actors = new Set();
  for (const c of game.combat?.combatants ?? []) if (c.actor) actors.add(c.actor);
  for (const td of canvas?.scene?.tokens ?? []) if (td.actor) actors.add(td.actor);
  for (const a of actors) {
    const ids = fxList(a).filter(e => e.getFlag?.(F, "endsWithOrigin") && e.origin === origin.uuid).map(e => e.id);
    if (!ids.length) continue;
    const names = ids.map(id => a.effects.get(id)?.name).filter(Boolean).join(", ");
    await a.deleteEmbeddedDocuments("ActiveEffect", ids);
    await ChatMessage.create({ content: sysLine("fa-hand", `<b>${esc(a.name)}</b>: ${esc(names)} ends (${esc(origin.name)} is Down).`) });
  }
}

export function registerConditionRules() {
  seesOriginFn().then(setSeenGate).catch(e => console.warn("twod12 | Frightened's sight check", e));
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    try {
      if (effect.getFlag(F, "loseAp")) await dazeOnApply(effect);
      if (effect.statuses?.has?.("unconscious") || effect.statuses?.has?.("dead")) await endHeldBy(effect.parent);
    } catch (e) { console.warn("twod12 | conditions", e); }
  });
  // Grabbed ends when its creature ends the Immobilized it brought (Break Free): the linked condition goes, the holder's grip goes with it
  Hooks.on("deleteActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    const pid = effect.getFlag?.(F, "linkedTo"), parent = pid ? effect.parent?.effects?.get?.(pid) : null;
    if (parent?.getFlag?.(F, "endsWithOrigin") && effect.statuses?.has?.("immobilized")) {
      try {
        await parent.delete();
        await ChatMessage.create({ content: sysLine("fa-hand", `<b>${esc(effect.parent.name)}</b> is no longer Immobilized: ${esc(parent.name)} ends.`) });
      } catch (e) { console.warn("twod12 | Grabbed", e); }
    }
  });
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const ended = combat.combatants.get(prior?.combatantId);
    if (ended?.actor) { try { await bleedAtTurnEnd(ended.actor); } catch (e) { console.warn("twod12 | Bleed", e); } }
  });
}
