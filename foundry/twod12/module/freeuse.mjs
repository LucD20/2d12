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
  try { actor = cfg.actor ? await fromUuid(cfg.actor) : f?.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { /* not loaded */ }   // v0.0.345: actor:<uuid>
  if (actor?.documentName !== "Actor" && actor?.actor) actor = actor.actor;
  actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  if (!actor) return ui.notifications.warn("Select your token first.");
  if (!actor.isOwner) return ui.notifications.warn(`You don't own ${actor.name}.`);
  const key = cfg.actor ? `${cfg.target}|${cfg.actor}` : cfg.target;   // v0.0.345: one count per creature on a card of several
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
    // v0.0.294 (brief section 13): on a non-roll card's "Granted Action:" row: the name alone ("Weapon Attack"), then a green "✓ Used"
    if (a.closest?.(".cc-grant")) a.innerHTML = left <= 0 ? '<i class="fa-solid fa-check"></i> Used' : `${grantIcon(cleanName(label))} ${foundry.utils.escapeHTML?.(cleanName(label)) ?? cleanName(label)}`;
    else a.innerHTML = `<i class="fa-solid fa-bolt"></i> ${foundry.utils.escapeHTML?.(label) ?? label}`;
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
  if (!version || !grant) return version;
  let v = version;
  for (const [on, does, text] of [[grant.on, grant.does ?? "half", grant.text], [grant.on2, grant.does2 ?? "text", grant.text2]]) {   // v0.0.266: a second line
    const o = String(on ?? ""), t = String(text ?? "").trim();
    if (!o || !t || does !== "text") continue;
    v = { ...v };
    const add = k => { v[k] = [v[k], t].filter(Boolean).join(" "); };
    if (o === "crit") add("critical");
    else if (v.noTiers) add("effects");
    else for (const n of [1, 2, 3]) if (o === "all" || n >= (Number(o.slice(1)) || 1)) add(`x${n}`);
    // v0.0.267 (Lucas, Overwatch): the line's chips also run by themselves after the damage, for the targets that rolled that result (the chain)
    const gate = o === "crit" ? "crit:yes" : /^t[23]$/.test(o) ? `tier:${o.slice(1)}` : "";
    const chips = (t.match(/@\w+\[[^\]]*\](?:\{[^}]*\})?/g) ?? []).map(c => (gate ? c.replace(/\]/, `|${gate}]`) : c));
    if (chips.length && !v.noTiers) v.after = [v.after, ...chips].filter(Boolean).join(" ");
  }
  return v;
}
/** The rows of a grant card: one per grant, with its buttons; the live effect says what is left (gone: all spent). */
export function grantRowsHtml(actor, card) {
  // v0.0.294 (chat cards addendum, brief section 13 6a): "Granted Action: <name>" and a primary button with a bolt and the name; a used one is a
  // green "✓ Used"; no sublines (no "1 of 1 left · free", no source name). Several uses: a button each.
  return (card?.effects ?? []).map(g => {
    const e = actor?.effects?.get?.(g.id), grant = e?.getFlag?.(F, "grants")?.[g.index], left = grant ? Math.max(0, grant.left) : 0, count = Math.max(g.count, left);
    const btns = Array.from({ length: count }, (_, k) => { const spent = k < count - left; return spent ? `<span class="cc-used"><i class="fa-solid fa-check"></i> Used</span>` : `<button type="button" class="cc-gbtn" data-twod12="useGrant" data-effect-id="${g.id}" data-index="${g.index}">${grantIcon(g.actionName)} ${escT(g.actionName)}</button>`; }).join("");
    return `<div class="tline grantrow"><span class="apside">Granted Action: <b>${escT(g.actionName)}</b></span><div class="gbtns">${btns}</div></div>`;
  }).join("");
}
/** v0.0.295 (Lucas): a Weapon Attack (or an NPC's Basic attack) gets a sword (Foundry's own icon), the other granted Actions the bolt. */
export const grantIcon = name => (/weapon attack|basic attack/i.test(String(name ?? "")) ? '<img class="cc-gico" src="icons/svg/sword.svg" alt="" aria-hidden="true">' : '<i class="fa-solid fa-bolt" aria-hidden="true"></i>');
/** v0.0.294: pure: what a granted use brings to the Action (useAction's opts): free, its AP, its Boons and Banes, the source's name, the creatures it can't take again. */
export const grantOpts = (g, label = "") => ({ free: true, ap: g?.grant?.ap ?? 0, boons: g?.grant?.boons ?? 0, banes: g?.grant?.banes ?? 0, label: label || g?.effect?.name || "Granted use", grant: g, excludeTargets: g?.grant?.distinct ? (g.grant.used ?? []) : [] });
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
  const ok = await useAction(actor, item, { grantKey: { effectId: g.id, index: g.index } });   // v0.0.269: this grant, not the first waiting
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
/**
 * v0.0.336 (Lucas, Double Shot: "when you click on a token that has the effect that grants Actions, besides the chat button, a small hud at the
 * bottom with buttons to the granted Actions"): pure: the uses left on a creature's effects, one button each: [{ effectId, index, source, actionName, left }].
 */
export function grantBarModel(effects, nameOf = g => String(g.spec ?? "").replace(/^(category|trait):/i, "")) {
  const out = [];
  for (const e of effects ?? []) (e.getFlag?.(F, "grants") ?? e.flags?.[F]?.grants ?? []).forEach((g, index) => { if (g?.left > 0) out.push({ effectId: e.id, index, source: cleanName(e.name), actionName: cleanName(nameOf(g)), left: g.left }); });
  return out;
}
let grantBarEl = null;
function closeGrantBar() { grantBarEl?.remove(); grantBarEl = null; }
/** The bar for the token the user controls (one token; its owner): a button per use left, each uses that grant (as the card's button does). */
export function refreshGrantBar() {
  if (typeof document === "undefined") return;
  const toks = globalThis.canvas?.tokens?.controlled ?? [];
  const tok = toks.length === 1 ? toks[0] : null, actor = tok?.actor;
  const list = actor?.isOwner ? grantBarModel(actor.effects, g => actionsFor(actor, g.spec)[0]?.name ?? g.spec) : [];
  if (!list.length) return closeGrantBar();
  const btns = list.flatMap(x => Array.from({ length: x.left }, () => `<button type="button" class="lb-go lb-grant" data-effect-id="${escT(x.effectId)}" data-index="${x.index}" data-tooltip="${escT(`${x.actionName}, granted by ${x.source} (free)`)}">${grantIcon(x.actionName)} ${escT(x.actionName)}</button>`)).join("");
  const sources = [...new Set(list.map(x => x.source))].join(", ");
  const html = `<i class="fa-solid fa-bolt lb-ic"></i><span class="lb-text"><b>${escT(tok.name)}</b>: granted by <b>${escT(sources)}</b></span>${btns}`;
  if (!grantBarEl) {
    grantBarEl = document.createElement("div"); grantBarEl.className = "twod12-linebar twod12-setupbar twod12-grantbar"; document.body.append(grantBarEl);
    grantBarEl.addEventListener("click", async ev => { const b = ev.target.closest(".lb-grant"); if (!b) return; ev.preventDefault(); const t = canvas.tokens.controlled[0]; if (t?.actor) await useGrantOf(t.actor, b.dataset.effectId, Number(b.dataset.index) || 0); });
  }
  grantBarEl.innerHTML = html;
}
/** Use one granted use of a creature's effect (the bar's button). Returns whether it was used. */
export async function useGrantOf(actor, effectId, index = 0) {
  if (!actor?.isOwner) { ui.notifications.warn(`You don't own ${actor?.name ?? "that creature"}.`); return false; }
  const e = actor.effects.get(effectId), grant = e?.getFlag(F, "grants")?.[index];
  if (!grant || !(grant.left > 0)) { ui.notifications.warn("No use left."); return false; }
  const item = actionsFor(actor, grant.spec).find(i => activeGrants(actor, i).some(x => x.effect.id === effectId)) ?? actionsFor(actor, grant.spec)[0];
  if (!item) { ui.notifications.warn(`${actor.name} has no Action called "${grant.spec}".`); return false; }
  return !!(await useAction(actor, item, { grantKey: { effectId, index } }));
}
export function registerGrantCardHooks() {
  // v0.0.336: the granted uses' bar follows the controlled token and its effects
  const later = () => setTimeout(refreshGrantBar, 50);
  for (const h of ["controlToken", "createActiveEffect", "updateActiveEffect", "deleteActiveEffect", "canvasReady"]) Hooks.on(h, later);
  Hooks.on("updateActiveEffect", (fx, changes) => { if (changes?.flags?.[F]?.grants && fx.parent?.documentName === "Actor") refreshGrantCards(fx.parent, fx.id); });
  Hooks.on("deleteActiveEffect", fx => { if ((fx.getFlag?.(F, "grants") ?? []).length && fx.parent?.documentName === "Actor") refreshGrantCards(fx.parent, fx.id); });
}
