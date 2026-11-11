// v0.0.294 (the chat cards addendum, brief sections 12 and 13, decided 2026-11-08): the card of an Action that makes no roll (Opportunity Attack,
// Bulwark of Faith, Aim). chatcards.mjs draws it (nonRollCardHtml); this module builds the parts of its model: the numbered steps of its chain
// (one per @Pause), the granted Action's row (an @Use in its text), and unlocks an "After the damage" step when the held damage lands.
// The pure functions first (the tests load them); the Foundry ones after.
import { esc } from "./util.mjs";

/** The chain's steps (an Action's "after": chips, @Pause[label] between them) → [{ label, chips }] (the same split as actions.mjs chainSteps). */
export function chainOf(after) {
  const steps = [{ label: "", chips: [] }];
  for (const c of String(after ?? "").trim().split(/\s+(?=@)/).filter(Boolean)) {
    const m = c.match(/^@Pause\[([^\]]*)\]/);
    if (m) steps.push({ label: m[1].trim() || "Then", chips: [] }); else steps[steps.length - 1].chips.push(c);
  }
  return steps.filter(s => s.chips.length);
}
/** A step's button: what its chips do, short ("Give Guard 9", "Slide 1", "Push 2", "Heal", "Apply Prone"). guard: the Guard value when it is known. */
export function stepButton(chips, { guard = null } = {}) {
  const t = Array.isArray(chips) ? chips.join(" ") : String(chips ?? "");
  const mv = /@Move\[(\w+)[^\]]*?distance:(\d+)/i.exec(t);
  if (/@Guard\[/i.test(t)) return guard ? `Give Guard ${guard}` : "Give Guard";
  if (mv) { const k = mv[1].toLowerCase(), word = { slid: "Slide", pushed: "Push", pulled: "Pull", reposition: "Reposition", advance: "Advance", evade: "Evade" }[k] ?? "Move"; return `${word} ${mv[2]}`; }
  if (/@Heal\[|@Rally\[/i.test(t)) return "Heal";
  if (/@Reduce\[/i.test(t)) return "Reduce the damage";
  const cond = /@Condition\[(\w+)/i.exec(t);
  if (cond) return `Apply ${cond[1][0].toUpperCase()}${cond[1].slice(1)}`;
  if (/@Damage\[/i.test(t)) return "Deal the damage";
  return "Apply";
}
/**
 * The numbered steps of a non-roll card: [{ k (the chain's step), side, label, btn }]. The first step is "Before the damage" when the next one is
 * "After the damage" (Bulwark of Faith); a step that names sides (|side:allies) gets one row per side. One step with no label reads "Apply".
 */
export function stepsOf(after, { guard = null } = {}) {
  const ch = chainOf(after), out = [];
  ch.forEach((st, k) => {
    const label = st.label || (ch.length > 1 && /^after the damage/i.test(ch[1]?.label ?? "") && k === 0 ? "Before the damage" : ch.length > 1 ? "First" : "Apply");
    const text = st.chips.join(" "), sides = [...new Set([...text.matchAll(/\|side:(allies|enemies)\b/g)].map(m => m[1]))];
    if (!sides.length) out.push({ k, side: "", label, btn: stepButton(st.chips, { guard }) });
    else for (const side of sides) out.push({ k, side, label: `${label} · ${side === "allies" ? "Allies" : "Enemies"}`, btn: stepButton(st.chips.filter(c => !/\|side:/.test(c) || c.includes(`|side:${side}`)), { guard }) });
  });
  return out;
}
/** Does the chain have a step that waits for the damage ("After the damage")? */
export const waitsForDamage = after => chainOf(after).some(s => /after the damage/i.test(s.label));
/**
 * The granted Action of a card's text: its @Use button (Opportunity Attack's "Weapon Attack (1A)") is taken out of the text and becomes the card's
 * "Granted Action:" row. { html (the text without it), anchor, name ("Weapon Attack"), target }.
 */
export function splitUse(html) {
  const re = /<a[^>]*data-twod12-inline="Use"[^>]*>[\s\S]*?<\/a>/;
  const m = re.exec(String(html ?? ""));
  if (!m) return { html: String(html ?? ""), anchor: "", name: "", target: "" };
  let target = "";
  const cfg = /data-cfg="([^"]*)"/.exec(m[0]);
  if (cfg) { try { target = JSON.parse(cfg[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&")).target ?? ""; } catch (e) { target = ""; } }
  const label = m[0].replace(/<[^>]+>/g, "").trim();
  const name = (label || target).replace(/\s*\(.*\)\s*$/, "").trim();
  const rest = String(html).replace(m[0], "").replace(/\s+([.,;])/g, "$1").replace(/<p>\s*<\/p>/g, "").trim();
  return { html: rest, anchor: m[0], name, target };
}
/** The grant row's button reads the Action's name with a bolt, or "✓ Used" once spent (updateUseButtons, freeuse.mjs). */
export const grantButtonHtml = (name, spent) => (spent ? '<i class="fa-solid fa-check"></i> Used' : `<i class="fa-solid fa-bolt"></i> ${esc(String(name ?? "").replace(/\s*\(.*\)\s*$/, ""))}`);
/**
 * Can a weapon reach the triggering creature (Opportunity Attack: "as long as your weapon can target them")? reaches: [{ name, max }] (squares),
 * dist: squares to the creature. "" when one can; else why ("Bandit Thug is 3 sq. away: Greatsword reaches 1 sq.").
 */
export function reachProblem(reaches, dist, targetName = "the target") {
  if (!(dist > 0) || !reaches?.length) return "";
  if (reaches.some(r => r.max >= dist)) return "";
  return `${targetName} is ${dist} sq. away: ${reaches.map(r => `${r.name} reaches ${r.max} sq.`).join(", ")}`;
}

/* ------------------------------------------------------------------ Foundry */
const F = "twod12", SOCKET = "system.twod12";
/** The held damage landed on this creature: its Reactions' cards unlock their "After the damage" step (on the client that may update each card). */
export function afterLanded(actor) {
  if (!actor) return;
  const ids = [actor.uuid, actor.token?.uuid ?? ""].filter(Boolean);
  try { game.socket?.emit(SOCKET, { type: "afterLanded", ids }); } catch (e) { /* no socket */ }
  return unlockHere(ids);
}
async function unlockHere(ids) {
  for (const msg of (game.messages?.contents ?? []).slice(-40)) {
    const m = msg.getFlag?.(F, "cc");
    if (m?.kind !== "noroll" || !m.afterWait) continue;
    if (!ids.includes(m.afterWait.actor) && !ids.includes(m.afterWait.token)) continue;
    const doer = msg.author?.active ? msg.isAuthor : game.user.isActiveGM;   // one client updates it
    if (!doer) continue;
    try { await msg.update({ [`flags.${F}.cc.afterWait`]: null }); } catch (e) { console.warn("twod12 | After the damage", e); }
  }
}
/** A step was applied from the card: it shows "✓ Done" (the card's author or the GM keeps it). */
export async function markStepDone(msg, step, side = "") {
  const m = msg?.getFlag?.(F, "cc");
  if (m?.kind !== "noroll") return;
  const done = [...new Set([...(m.afterDone ?? []), `${Number(step) || 0}|${side}`])];
  try { await msg.update({ [`flags.${F}.cc.afterDone`]: done }); } catch (e) { /* not the author: it stays a button */ }
}
export function registerNoRollHooks() {
  game.socket?.on(SOCKET, d => { if (d?.type === "afterLanded") unlockHere(d.ids ?? []).catch(e => console.warn("twod12 | After the damage", e)); });
}
