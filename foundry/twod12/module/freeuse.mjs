import { evalExpr } from "./refs.mjs";
// Actions that let you use other Actions: the @Use[...] button and the Grant setting of an Effect.
//   @Use[Weapon Attack|count:2|boons:1|distinct:yes]      each click uses the Action for 0 AP (add ap:1 for a cost)
//   @Use[category:Weapon Technique|count:2]                you choose among the Actions of that category
//   @Use[trait:strike]                                    any Action with that trait
// An Action used because of another Action or a Talent does not count toward its Frequency or toward the 3 Strikes of the turn.
import { useAction } from "./actions.mjs";
import { grantMatches } from "./usage.mjs";
const { DialogV2 } = foundry.applications.api;
const F = "twod12";

/** The Actions of a creature that a spec names. */
export function actionsFor(actor, spec) {
  return actor.itemTypes.action.filter(i => grantMatches(spec, i));
}

async function chooseAction(list, spec) {
  if (list.length <= 1) return list[0] ?? null;
  const buttons = list.map(i => ({ action: i.id, label: i.name, callback: () => i.id }));
  const id = await DialogV2.wait({ window: { title: "Choose an Action" }, content: `<p>Which Action? (${spec})</p>`, buttons, rejectClose: false });
  return list.find(i => i.id === id) ?? null;
}

/** Use up one granted use of an Action: it is spent, and the effect goes away when nothing is left. */
export async function consumeGrant(actor, { effect, index }, targetUuid = "") {
  const grants = foundry.utils.deepClone(effect.getFlag(F, "grants") ?? []);
  const g = grants[index];
  if (!g) return;
  g.left = Math.max(0, g.left - 1);
  if (targetUuid) (g.used ??= []).push(targetUuid);
  if (grants.every(x => x.left <= 0) && !(effect.getFlag(F, "keepWhenSpent"))) await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
  else await effect.setFlag(F, "grants", grants);
}

/** The @Use button. */
export async function handleUse(cfg, ctx = {}) {
  const msg = ctx.message;
  const f = msg?.getFlag?.(F, "action");
  let actor = null;
  try { actor = f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }
  actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  if (!actor) return ui.notifications.warn("Select your token first.");
  if (!actor.isOwner) return ui.notifications.warn(`You don't own ${actor.name}.`);
  const key = cfg.target;
  const uses = foundry.utils.deepClone(msg?.getFlag?.(F, "uses") ?? {});
  const total = cfg.count ?? 1, left = total - (uses[key] ?? 0);
  if (left <= 0) return ui.notifications.warn("No uses left.");
  let list = actionsFor(actor, cfg.target);
  // v0.0.214: NPCs have no Weapon Attack: a use of it (the attack at the end of a Charge, a grant) is their Basic attack.
  // v0.0.216: the Action with the "NPC's Basic attack" box first (Lucas), else the category "Basic attack" (older NPCs).
  if (!list.length && actor.type === "npc" && /^weapon attack$/i.test(String(cfg.target ?? "").trim())) {
    const ticked = actor.itemTypes.action.filter(i => i.system?.basicAttack);
    list = ticked.length ? ticked : actionsFor(actor, "category:Basic attack");
  }
  if (!list.length) return ui.notifications.warn(`${actor.name} has no Action called "${cfg.target}".`);
  const item = await chooseAction(list, cfg.target);
  if (!item) return;
  const used = foundry.utils.deepClone(msg?.getFlag?.(F, "usedTargets") ?? {});
  const ok = await useAction(actor, item, {
    free: true, ap: cfg.ap ?? 0, boons: cfg.boon ?? 0, banes: cfg.bane ?? 0, label: cfg.source || grantName(msg) || "Granted use", noHandle: !!cfg.noHandle,
    empowered: cfg.empowered ? (["yes", "true"].includes(cfg.empowered) ? 1 : Math.max(0, Math.trunc(evalExpr(cfg.empowered, actor) ?? 0))) : 0,   // Empowered N: yes is 1, or an expression
    excludeTargets: cfg.distinct ? (used[key] ?? []) : [],
    onUsed: ({ targets }) => { used[key] = [...(used[key] ?? []), ...targets.map(t => t.uuid)]; }
  });
  if (!ok) return;
  uses[key] = (uses[key] ?? 0) + 1;
  try { await msg?.update({ [`flags.${F}.uses`]: uses, [`flags.${F}.usedTargets`]: used }); } catch (e) { /* not the author: the count is not kept */ }
}

/** Chat hook: the @Use buttons show how many uses are left, and are dimmed when none are. */
export function updateUseButtons(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const uses = msg.getFlag?.(F, "uses") ?? {};
  el?.querySelectorAll?.('a[data-twod12-inline="Use"]').forEach(a => {
    let cfg; try { cfg = JSON.parse(a.dataset.cfg); } catch (e) { return; }
    const total = cfg.count ?? 1, left = total - (uses[cfg.target] ?? 0);
    const label = cfg.label ?? `${cfg.target.replace(/^(category|trait):/i, "")}${total > 1 ? ` \u00d7${Math.max(0, left)}` : ""}`;
    a.innerHTML = `<i class="fa-solid fa-bolt"></i> ${foundry.utils.escapeHTML?.(label) ?? label}`;
    a.classList.toggle("spent", left <= 0);
  });
}

/** The name of the Action whose card granted this use ("Charge"), for the roll dialog's chip. */
function grantName(msg) {
  try { const a = msg?.getFlag?.("twod12", "action"); return a?.actorUuid && a?.itemId ? fromUuidSync(a.actorUuid)?.items?.get?.(a.itemId)?.name ?? "" : ""; } catch (e) { return ""; }
}
