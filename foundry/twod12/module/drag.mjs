// Dragging things between windows: rows of a sheet can be dragged to the Items directory (a copy is made), to another sheet,
// and effects can be dragged to another sheet or to the Items directory (they become an Effect item).
const F = "twod12";

/** An Effect item's data from an Active Effect on an actor (its stored source, or a best effort from what it holds). */
export function effectItemData(ae) {
  const f = ae.flags?.[F] ?? {};
  let system = f.source ? foundry.utils.deepClone(f.source) : null;
  if (!system) {
    const settings = [];
    for (const m of f.modifiers ?? []) settings.push({ type: "boonbane", boons: m.boons ?? 0, banes: m.banes ?? 0, predicate: m.predicate ?? "", all: m.all ?? [], any: m.any ?? [], none: m.none ?? [] });
    for (const b of f.bonuses ?? []) settings.push({ type: "bonusdamage", dmg: b.dmg, dmgPool: b.dmgPool, dmgSub: b.dmgSub, tiers: b.tiers ?? [], text: b.text, fxUuid: b.fxUuid ?? "", all: b.all ?? [], any: b.any ?? [], none: b.none ?? [] });
    for (const n of f.notes ?? []) settings.push({ type: "note", attrs: n.attrs ?? [], title: n.title ?? "", text: n.text ?? "" });
    system = { description: f.description ?? "", settings, expireOn: f.expireOn ?? [] };
  }
  return { name: ae.name, type: "effect", img: ae.img ?? "icons/svg/aura.svg", system };
}

/** Drag data for a row of a sheet: an Item (embedded or not) or an Active Effect. */
export async function dragDataFor(el, actor) {
  const eid = el.closest("[data-effect-id]")?.dataset.effectId;
  if (eid) return actor.effects.get(eid)?.toDragData() ?? null;
  const row = el.closest("[data-item-id],[data-item-uuid]");
  if (!row) return null;
  const item = row.dataset.itemId && actor.items.get(row.dataset.itemId);
  if (item) return item.toDragData();
  return row.dataset.itemUuid ? { type: "Item", uuid: row.dataset.itemUuid } : null;
}

/** Rows and linked lists of a sheet start a drag with the right data. */
export function enableDragging(app, actor = null) {
  const root = app.element;
  if (!root) return;
  // rows are new elements after every render: they get draggable each time; the listener is added once
  if (actor) root.querySelectorAll("tr[data-item-id],tr[data-effect-id],details.feat[data-item-id],details.feat[data-item-uuid]").forEach(el => el.setAttribute("draggable", "true"));
  if (root._twod12Drag) return;
  root._twod12Drag = true;
  root.addEventListener("dragstart", async ev => {
    const el = ev.target.closest?.("[data-item-id],[data-item-uuid],[data-effect-id],li[data-uuid],.fxline[data-uuid]");
    if (!el || ev.target.closest("input,select,textarea")) return;
    let data = null;
    if (el.dataset.uuid) data = { type: "Item", uuid: el.dataset.uuid };
    else if (actor) data = await dragDataFor(el, actor);
    if (!data) return;
    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
    ev.dataTransfer.effectAllowed = "copy";
  });
}

/** An Active Effect dropped on another actor's sheet is copied to it. */
export async function dropEffect(actor, data) {
  const e = data?.uuid ? await fromUuid(data.uuid) : null;
  if (!e || e.parent === actor) return false;
  await actor.createEmbeddedDocuments("ActiveEffect", [e.toObject()]);
  ui.notifications.info(`${e.name} copied to ${actor.name}.`);
  return true;
}

/** The Items directory accepts an Active Effect: it becomes a world Effect item. */
export function registerDragCopy() {
  Hooks.on("renderItemDirectory", (app, html) => {
    const el = html instanceof HTMLElement ? html : html?.[0];
    if (!el || el._twod12Drop) return;
    el._twod12Drop = true;
    el.addEventListener("dragover", ev => { if (ev.dataTransfer?.types?.includes("text/plain")) ev.preventDefault(); });
    el.addEventListener("drop", async ev => {
      let data; try { data = JSON.parse(ev.dataTransfer.getData("text/plain")); } catch (e) { return; }
      if (data?.type !== "ActiveEffect") return;
      ev.preventDefault(); ev.stopPropagation();
      const ae = await fromUuid(data.uuid);
      if (!ae) return;
      const folder = ev.target.closest?.("[data-folder-id]")?.dataset.folderId ?? null;
      const item = await Item.create({ ...effectItemData(ae), folder });
      ui.notifications.info(`Created the Effect item ${item.name}.`);
    }, true);
  });
}
