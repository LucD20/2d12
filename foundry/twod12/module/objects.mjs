// Pack TALENTS-PT (2026-11-20; Rime Strike's Ice Pillar, book/cards/talents-playtest.md section 2): a placed object. The chip @Place[<actor
// uuid>|adjacent:yes|one:yes|eoe:yes|defense:action] asks for a square on the map (the pick bar: a square adjacent to the card's target that holds
// no creature or object and that the user has Line of Effect to) and the active GM's client places a token of that actor there. What the object
// does is read from its actor's flag `object` (settings anyone can edit, no card named here): solid (four walls on its square's edges block
// movement; v0.0.476: they no longer block sight, so the object can be seen and targeted: cover.mjs wallBlocks treats its square as solid for Line
// of Effect, a line ending in it excepted), breakAt (one Action's damage of at least this breaks it,
// less does nothing: damage.mjs), saveTier (its Tier against a Save: by hand for now). one:yes: one at a time per user (a new one melts the old);
// eoe:yes: it melts when the encounter ends; defense:action: its Armor and Ward Defense are the Action DC (11 + the Modifier the Action used).
import { sysLine } from "./sysmsg.mjs";
const F = "twod12", SOCKET = "system.twod12";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Pure: the squares around a footprint (the 8 neighbours of each of its cells), the footprint left out. cells: [{ i, j }]. */
export function ringCells(cells) {
  const own = new Set(cells.map(c => `${c.i},${c.j}`)), out = new Map();
  for (const c of cells) for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const k = `${c.i + di},${c.j + dj}`; if (!own.has(k) && !out.has(k)) out.set(k, { i: c.i + di, j: c.j + dj }); }
  return [...out.values()];
}
/** Pure: the four wall segments on a square's edges ([x0, y0, x1, y1] each). */
export const squareWalls = (x, y, s) => [[x, y, x + s, y], [x + s, y, x + s, y + s], [x + s, y + s, x, y + s], [x, y + s, x, y]];
/** Pure: the Defense of a placed object: the Action DC (11 + the Modifier the Action used), 13 when the Modifier isn't known. */
export const actionDcOf = mod => (Number.isFinite(Number(mod)) && mod !== null && mod !== "" ? 11 + Number(mod) : 13);
/** Pure: what one Action's damage does to an object that breaks at `breakAt`: "breaks" or "nothing". */
export const hitOutcome = (dmg, breakAt) => ((Number(dmg) || 0) >= (Number(breakAt) || Infinity) ? "breaks" : "nothing");

const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);
const tokOf = actor => actor?.getActiveTokens?.()[0] ?? null;

/** The chip (on the user's client): pick the square, then ask the active GM to place it. */
export async function handlePlace(cfg, ctx = {}) {
  if (!canvas?.ready) return;
  const { originActor } = await import("./inline.mjs"), T = await import("./template.mjs"), { wallBlocks } = await import("./cover.mjs");
  const user = originActor(ctx), me = tokOf(user);
  if (!user || !me) return ui.notifications.warn("No token of the user on this scene: place it by hand.");
  let src = null; try { src = await fromUuid(cfg.uuid); } catch (e) { src = null; }
  if (!src) return ui.notifications.warn("The object to place isn't in the compendium.");
  const t0 = (ctx.targets ?? [])[0];
  let tdoc = null; try { tdoc = t0?.uuid ? await fromUuid(t0.uuid) : null; } catch (e) { tdoc = null; }
  const target = tdoc?.object ?? tokOf(actorOf(tdoc));
  if (cfg.adjacent && !target) return ui.notifications.warn(`${src.name}: no target on the card to place it next to.`);
  const occupied = new Set((canvas.tokens?.placeables ?? []).flatMap(t => T.tokenCells(t)).map(c => `${c.i},${c.j}`));
  const from = me.center;
  const cells = (cfg.adjacent ? ringCells(T.tokenCells(target)) : []).filter(c => !occupied.has(`${c.i},${c.j}`) && !wallBlocks(from, T.cellCenter(c.i, c.j)));
  if (!cells.length) return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: user }), content: sysLine("fa-cube", `<b>${esc(src.name)}</b>: no empty square next to <b>${esc(target?.name)}</b> in ${esc(user.name)}'s Line of Effect.`, "fxm") });
  const { pickBar } = await import("./pickbar.mjs");
  const id = await pickBar({ icon: "fa-cube", text: `<b>${esc(src.name)}</b>: click its square (next to ${esc(target?.name ?? "the target")}).`, options: cells.map(c => ({ id: `${c.i},${c.j}`, label: "Here", cells: [c], mapOnly: true })), cancel: "Cancel" });   // v0.0.476: the squares are clicked on the map, one Cancel button
  if (!id || id === "no" || id === "done") return;
  const [i, j] = id.split(",").map(Number), tl = canvas.grid.getTopLeftPoint({ i, j });
  const data = { type: "placeObject", uuid: cfg.uuid, sceneId: canvas.scene.id, x: tl.x, y: tl.y, by: user.uuid, byName: user.name, one: !!cfg.one, eoe: !!cfg.eoe, dc: cfg.defense === "action" ? actionDcOf(ctx.attrVal) : null };
  if (game.user.isActiveGM) return placeHere(data);
  game.socket.emit(SOCKET, data);
}

/** The world actor a compendium actor is placed from (imported once, then reused). */
async function worldActorFor(uuid) {
  const have = game.actors.find(a => a.getFlag(F, "placedFrom") === uuid);
  if (have) return have;
  const src = await fromUuid(uuid);
  if (!src) return null;
  const o = src.toObject(); delete o._id; o.flags = { ...(o.flags ?? {}), [F]: { ...(o.flags?.[F] ?? {}), placedFrom: uuid } };
  return Actor.create(o);
}
/** On the active GM's client: place the object (and its walls), melting the user's old one first. */
export async function placeHere(d) {
  const scene = game.scenes.get(d.sceneId) ?? canvas.scene;
  const actor = await worldActorFor(d.uuid);
  if (!scene || !actor) return;
  if (d.one) { const old = scene.tokens.filter(t => t.flags?.[F]?.placed?.by === d.by && t.flags?.[F]?.placed?.from === d.uuid).map(t => t.id); if (old.length) await scene.deleteEmbeddedDocuments("Token", old); }
  const o = actor.getFlag(F, "object") ?? {};
  const proto = (await actor.getTokenDocument({ x: d.x, y: d.y })).toObject();
  const tok = { ...proto, x: d.x, y: d.y, actorLink: false, disposition: 0, flags: { ...(proto.flags ?? {}), [F]: { ...(proto.flags?.[F] ?? {}), placed: { by: d.by, from: d.uuid, eoe: !!d.eoe, dc: d.dc } } },
    ...(Number.isFinite(d.dc) ? { delta: { system: { armorDef: d.dc, wardDef: d.dc } } } : {}) };
  const [made] = await scene.createEmbeddedDocuments("Token", [tok]);
  if (made && o.solid) {
    const s = scene.grid?.size ?? canvas.grid.size, W = CONST.WALL_SENSE_TYPES ?? {}, MV = CONST.WALL_MOVEMENT_TYPES ?? {};
    await scene.createEmbeddedDocuments("Wall", squareWalls(d.x, d.y, s).map(c => ({ c, move: MV.NORMAL ?? 20, sight: W.NONE ?? 0, light: W.NONE ?? 0, sound: W.NONE ?? 0, flags: { [F]: { solidOf: made.id } } })));
  }
  await ChatMessage.create({ content: sysLine("fa-cube", `<b>${esc(actor.name)}</b> rises for <b>${esc(d.byName)}</b>${Number.isFinite(d.dc) ? ` (its Defense ${d.dc})` : ""}${o.breakAt ? `: one Action's ${o.breakAt} damage breaks it` : ""}${o.saveTier ? `; against a Save it gets Tier ${o.saveTier}` : ""}${d.eoe ? " (EoE)" : ""}.`, "fxm") });
}

/** A damage reaches a placed object (damage.mjs): one Action's damage of at least its breakAt breaks it (the token goes, its walls with it). */
export async function objectHit(actor, dmg) {
  const o = actor.getFlag(F, "object") ?? {}, doc = actor.token ?? tokOf(actor)?.document ?? null;
  const out = hitOutcome(dmg, o.breakAt);
  await ChatMessage.create({ content: sysLine(out === "breaks" ? "fa-burst" : "fa-cube", out === "breaks" ? `<b>${esc(actor.name)}</b> breaks: <b>${dmg}</b> damage from one Action.` : `<b>${esc(actor.name)}</b> holds: ${dmg} damage, less than ${o.breakAt} from one Action, does nothing (and doesn't add up).`, "fxm") });
  if (out === "breaks" && doc) { if (game.user.isActiveGM || doc.isOwner) await doc.delete(); else game.socket.emit(SOCKET, { type: "breakObject", tokenUuid: doc.uuid }); }
  return out;
}

/** The encounter ends: the placed objects that last until then melt (the active GM; mark.mjs's deleteCombat calls it). */
export async function endEncounterObjects(combat) {
  if (!game.user.isActiveGM) return;
  for (const scene of new Set([combat?.scene, canvas?.scene].filter(Boolean))) {
    const ids = scene.tokens.filter(t => t.flags?.[F]?.placed?.eoe).map(t => t.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
  }
}

/** The GM's side: the socket's requests, and a placed token's walls go with it. */
export function registerObjects() {
  Hooks.on("deleteToken", async doc => {
    if (!game.user.isActiveGM || !doc?.flags?.[F]?.placed) return;
    const scene = doc.parent, ids = (scene?.walls ?? []).filter(w => w.flags?.[F]?.solidOf === doc.id).map(w => w.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Wall", ids);
  });
}
export async function onObjectSocket(data) {
  if (data.type === "placeObject") return placeHere(data);
  if (data.type === "breakObject") { const d = await fromUuid(data.tokenUuid); if (d) await d.delete(); }
}
