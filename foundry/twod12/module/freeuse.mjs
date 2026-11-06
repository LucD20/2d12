import { evalExpr } from "./refs.mjs";
// Actions that let you use other Actions: the @Use[...] button and the Grant setting of an Effect.
//   @Use[Weapon Attack|count:2|boons:1|distinct:yes]      each click uses the Action for 0 AP (add ap:1 for a cost)
//   @Use[category:Weapon Technique|count:2]                you choose among the Actions of that category
//   @Use[trait:strike]                                    any Action with that trait
// An Action used because of another Action or a Talent does not count toward its Frequency or toward the 3 Strikes of the turn.
import { useAction } from "./actions.mjs";
import { grantMatches, activeGrants } from "./usage.mjs";
import { sysCard } from "./sysmsg.mjs";
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
    countAtWill: !!cfg.countAtWill,
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

// v0.0.260 (Lucas, Double Shot): the granted uses an Action's effect brings are buttons on its card, one per use, bound to the effect's grants:
// a click uses the Action with that granted use (the sheet's ticket drops too), the button then grays; a use from the sheet grays it as well.
// After a use from the card, with uses left, a short card repeats the buttons (the Action's own card is long and pushes this one up).
const cleanName = n => String(n ?? "").replace(/\s*\(.*\)\s*$/, "");
const escT = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/** v0.0.264 (Lucas): pure: a Grant's "On [a result], the card says [line]" written on the granted use's Version: the Critical row for a Critical,
 *  the Tier rows from that Tier up (a Version with no tiers: its text), every row for "any result". Other Grants leave the Version as it is. */
export function withGrantLine(version, grant) {
  const on = String(grant?.on ?? ""), text = String(grant?.text ?? "").trim();
  if (!version || !on || !text || (grant?.does ?? "half") !== "text") return version;
  const v = { ...version }, add = k => { v[k] = [v[k], text].filter(Boolean).join(" "); };
  if (on === "crit") add("critical");
  else if (v.noTiers) add("effects");
  else for (const n of [1, 2, 3]) if (on === "all" || n >= (Number(on.slice(1)) || 1)) add(`x${n}`);
  return v;
}
/** The rows of a grant card: one per grant, with its buttons; the live effect says what is left (gone: all spent). */
export function grantRowsHtml(actor, card) {
  return (card?.effects ?? []).map(g => {
    const e = actor?.effects?.get?.(g.id), grant = e?.getFlag?.(F, "grants")?.[g.index], left = grant ? Math.max(0, grant.left) : 0, count = Math.max(g.count, left);
    const btns = Array.from({ length: count }, (_, k) => { const spent = k < count - left; return `<button type="button" data-twod12="useGrant" data-effect-id="${g.id}" data-index="${g.index}"${spent ? ' class="spent" disabled' : ""}><i class="fa-solid ${spent ? "fa-check" : "fa-bolt"}"></i> ${escT(g.actionName)} ${k + 1}</button>`; }).join("");
    return `<div class="tline grantrow"><span class="apside"><i class="fa-solid fa-ticket"></i> ${escT(g.name)}: <b>${escT(g.actionName)}</b> <small>${left ? `${left} of ${count} left${g.ap ? ` · ${g.ap} AP each` : " · free"}` : "spent"}</small></span><div class="gbtns">${btns}</div></div>`;
  }).join("");
}
/** After an Action's card applied its effects: the grants those effects brought become rows on the card (nothing when they brought none). */
export async function attachGrantCard(msg, actor, effectUuids) {
  const effects = [];
  for (const e of actor?.effects ?? []) {
    if (!effectUuids.includes(e.getFlag(F, "effectUuid"))) continue;
    (e.getFlag(F, "grants") ?? []).forEach((g, index) => { if (g.left > 0) effects.push({ id: e.id, index, name: cleanName(e.name), spec: g.spec, count: g.count ?? g.left, ap: g.ap ?? 0, actionName: actionsFor(actor, g.spec)[0]?.name ?? String(g.spec).replace(/^(category|trait):/i, "") }); });
  }
  if (!effects.length) return;
  const card = { actorUuid: actor.uuid, effects };
  const content = String(msg.content).replace(/<\/div>\s*$/, `${grantRowsHtml(actor, card)}</div>`);
  try { await msg.update({ content, [`flags.${F}.grantCard`]: card }); } catch (e) { /* not the author */ }
}
/** A button of a grant row: the Action is used with that granted use (useAction takes the waiting grant by itself). */
export async function useGrant(msg, effectId, index = 0) {
  const card = msg?.getFlag?.(F, "grantCard"), g = card?.effects?.find(x => x.id === effectId && x.index === Number(index)) ?? card?.effects?.[0];
  let actor = null;
  try { actor = card?.actorUuid ? await fromUuid(card.actorUuid) : null; } catch (e) { actor = null; }
  if (!actor || !g) return;
  if (!actor.isOwner) return ui.notifications.warn(`You don't own ${actor.name}.`);
  const e = actor.effects.get(g.id), grant = e?.getFlag(F, "grants")?.[g.index];
  if (!grant || !(grant.left > 0)) { await refreshGrantCards(actor); return ui.notifications.warn(`No ${g.actionName} left from ${g.name}.`); }
  const item = actionsFor(actor, g.spec).find(i => activeGrants(actor, i).some(x => x.effect.id === g.id)) ?? actionsFor(actor, g.spec)[0];
  if (!item) return ui.notifications.warn(`${actor.name} has no Action called "${g.spec}".`);
  const ok = await useAction(actor, item, {});
  if (!ok) return;
  const after = actor.effects.get(g.id)?.getFlag(F, "grants")?.[g.index];
  if (after && after.left > 0 && msg.id !== game.messages.contents.at(-1)?.id) {   // the Action's card came after: repeat the buttons under it
    const n = after.left, word = n === 1 ? "use" : "uses";
    const lead = `<b>${n}</b> ${word} of <b>${escT(g.actionName)}</b> left`;
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `${sysCard({ title: g.name, lead })}`.replace(/<\/div>\s*$/, `${grantRowsHtml(actor, card)}</div>`), flags: { [F]: { grantCard: card } } });
  }
}
/** The grant cards of this creature follow its grants: a use from the sheet grays the card's button, the spent effect grays them all. */
export async function refreshGrantCards(actor, effectId = "") {
  if (!actor) return;
  for (const msg of game.messages.contents.slice(-80)) {
    const card = msg.getFlag?.(F, "grantCard");
    if (!card || card.actorUuid !== actor.uuid || (effectId && !card.effects.some(x => x.id === effectId))) continue;
    const mine = msg.author?.id === game.user.id, doer = msg.author?.active ? mine : game.user.isActiveGM;
    if (!doer) continue;
    const content = String(msg.content).replace(/(?:<div class="tline grantrow">[\s\S]*?<\/div><\/div>)+/, grantRowsHtml(actor, card));
    if (content !== msg.content) { try { await msg.update({ content }); } catch (e) { /* not ours */ } }
  }
}
export function registerGrantCardHooks() {
  Hooks.on("updateActiveEffect", (fx, changes) => { if (changes?.flags?.[F]?.grants && fx.parent?.documentName === "Actor") refreshGrantCards(fx.parent, fx.id); });
  Hooks.on("deleteActiveEffect", fx => { if ((fx.getFlag?.(F, "grants") ?? []).length && fx.parent?.documentName === "Actor") refreshGrantCards(fx.parent, fx.id); });
}
