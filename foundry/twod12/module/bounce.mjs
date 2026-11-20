// Pack TALENTS-PT (2026-11-20; Ricochet, book/cards/talents-playtest.md section 4): the chip @Bounce[N|half] after the damage. For each target
// whose damage landed (the chain runs on a Tier 2 or 3), the pick bar lists the creatures within N squares of it that it has Line of Effect to (the
// user needs none); the one clicked gets a plain damage card: half of each damage type the target was dealt (rounded up; Chapter 1, Halving and
// splitting damage), before the target's Resistance, Weakness, Immunity and Guard. That card's Apply takes the second creature's own; it has no
// riders and no Tier (another card's Tier effects don't reach it). The bounce is optional: "No ricochet".
import { sysLine } from "./sysmsg.mjs";
import { halveComps } from "./share.mjs";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);

/** Pure: the creatures a bounce can reach: within `range` of the target, not the target, not the user, not a placed object, with Line of Effect from the target. */
export function bounceCandidates(target, tokens, { range = 2, userId = "", dist, loe } = {}) {
  return (tokens ?? []).filter(t => t && t.id !== target.id && t.id !== userId && t.actor && !t.document?.flags?.twod12?.placed && !t.document?.hidden && dist(target, t) <= range && loe(target, t));
}

export async function handleBounce(cfg, ctx = {}) {
  if (!canvas?.ready) return;
  const { originActor } = await import("./inline.mjs"), { tokenDistance } = await import("./light.mjs"), { coverBetween } = await import("./cover.mjs");
  const user = originActor(ctx), me = user?.getActiveTokens?.()[0] ?? null, range = Math.max(1, Number(cfg.range) || 2);
  const source = ctx.message?.getFlag?.("twod12", "ccDmg")?.name || cfg.label || "Bounce";
  for (const t of ctx.targets ?? []) {
    let doc = null; try { doc = await fromUuid(t.uuid); } catch (e) { doc = null; }
    const tok = doc?.object ?? actorOf(doc)?.getActiveTokens?.()[0] ?? null;
    const comps = halveComps(t.comps ?? [], Number(t.factor) || 1);
    if (!tok || !comps.length) continue;
    const list = bounceCandidates(tok, canvas.tokens?.placeables ?? [], { range, userId: me?.id ?? "", dist: tokenDistance, loe: (a, b) => !coverBetween(a, b)?.noLoE });
    if (!list.length) { await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: user }), content: sysLine("fa-share", `<b>${esc(source)}</b>: no creature within ${range} squares of <b>${esc(tok.name)}</b> that it has Line of Effect to: no ricochet.`, "fxm") }); continue; }
    const { pickBar } = await import("./pickbar.mjs");
    const id = await pickBar({ icon: "fa-share", text: `<b>${esc(source)}</b>: the arrow bounces off <b>${esc(tok.name)}</b>. Click the creature it hits (half of the damage).`, options: [...list.map(x => ({ id: x.id, label: x.name, token: x })), { id: "no", label: "No ricochet" }], cancel: "" });
    const hit = list.find(x => x.id === id);
    if (!hit) continue;
    const { postCcDamage } = await import("./ccdamage.mjs");
    await postCcDamage({ actor: user, title: `${source}: the ricochet`, groups: [{ tier: 0, crit: false, comps, fx: [], riders: [] }], targets: [{ uuid: hit.document.uuid, name: hit.name, tier: 0, g: 0 }],
      originUuid: user?.uuid ?? "", strike: false, note: `Half of the damage dealt to ${tok.name}, before its Resistance, Weakness, Immunity and Guard; no riders.` });
  }
}
