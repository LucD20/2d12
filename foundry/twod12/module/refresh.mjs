// Update from the compendium (v0.0.190, Lucas): the GM can bring every sheet's Features, Talents, Actions, Effects, Classes, Species,
// weapons and armor up to the system compendium's current versions. Optional (homebrew changes to a copy are replaced), asked once after
// each system update, and always available from the system settings ("Update from the compendium") or a macro:
// game.twod12.refreshFromCompendium().
//   An item is matched by where it came from (flags.twod12.sourceUuid, or Foundry's compendium source), or, when asked, by its type and name
//   in the system compendiums. World items are updated first, so a copy made from a world item gets the world item's new version.
//   What belongs to the copy is kept: its flags (class picks, slots, granted-by), a class's chosen Attributes, a weapon's grip and state,
//   worn armor, quantities. The Basic Actions are replaced too.
const F = "twod12";
const { DialogV2 } = foundry.applications.api;

/** What a copy keeps of its own system data, by item type. */
export const KEEP = {
  class: ["chosenA", "chosenB", "chosenAttrs", "chosenWeapon", "chosenMagic", "modPriority", "modStage2"],
  species: ["chosen"],
  weapon: ["wielded", "dropped", "unloaded", "hands"],
  armor: ["worn", "dropped"],
  gear: ["quantity"]
};

/** Pure: the new system data of a copy: the source's, with the copy's own fields kept. */
export function mergedSystem(type, source, own) {
  const out = foundry.utils.deepClone(source);
  for (const k of KEEP[type] ?? []) if (own && k in own) out[k] = foundry.utils.deepClone(own[k]);
  return out;
}

const TYPES = new Set(["feature", "talent", "action", "effect", "class", "species", "weapon", "armor"]);

/** The system compendiums' items, by "type|name". */
async function systemIndex() {
  const out = new Map();
  for (const pack of game.packs) {
    if (pack.metadata?.packageName !== F || pack.documentName !== "Item") continue;
    for (const d of await pack.getDocuments()) out.set(`${d.type}|${d.name}`, d);
  }
  return out;
}

async function sourceOf(item, byName, index) {
  const u = item.getFlag?.(F, "sourceUuid") || item._stats?.compendiumSource || "";
  if (u) { try { const d = await fromUuid(u); if (d && d.type === item.type && d.uuid !== item.uuid) return d; } catch (e) { /* gone */ } }
  return byName ? index.get(`${item.type}|${item.name}`) ?? null : null;
}

async function refreshItem(item, byName, index) {
  if (!TYPES.has(item.type) || item.getFlag?.(F, "basic") || item.getFlag?.(F, "fists")) return false;
  const src = await sourceOf(item, byName, index);
  if (!src) return false;
  const own = item.toObject().system, data = mergedSystem(item.type, src.toObject().system, own);
  if (JSON.stringify(data) === JSON.stringify(own) && item.name === src.name && item.img === src.img) return false;
  await item.update({ name: src.name, img: src.img, system: data }, { recursive: false, diff: false });
  return true;
}

/** Every actor the GM can reach: the world's, and the unlinked tokens of every scene. */
function allActors() {
  const out = [...(game.actors ?? [])];
  for (const s of game.scenes ?? []) for (const t of s.tokens ?? []) if (!t.actorLink && t.actor) out.push(t.actor);
  return out;
}

/** Run it. Returns { items, actors }. */
export async function refreshFromCompendium({ byName = true, basics = true } = {}) {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can update the sheets from the compendium."); return null; }
  const index = await systemIndex();
  let items = 0, actors = 0;
  for (const it of game.items ?? []) { try { if (await refreshItem(it, byName, index)) items++; } catch (e) { console.warn("twod12 | update", it.name, e); } }
  for (const a of allActors()) {
    let changed = 0;
    for (const it of [...a.items]) { try { if (await refreshItem(it, byName, index)) changed++; } catch (e) { console.warn("twod12 | update", a.name, it.name, e); } }
    if (basics && ["character", "npc"].includes(a.type)) { try { const { addBasicActions } = await import("./basic.mjs"); await addBasicActions(a, { replace: true }); } catch (e) { console.warn("twod12 | Basic Actions", a.name, e); } }
    if (changed) { items += changed; actors++; }
  }
  ui.notifications.info(`2d12: ${items} item${items === 1 ? "" : "s"} updated from the compendium (${actors} creature${actors === 1 ? "" : "s"}); Basic Actions ${basics ? "refreshed" : "kept"}.`);
  return { items, actors };
}

/**
 * v0.0.241 (Lucas: the worth lines didn't show on his characters): the ruler's worth (v0.0.239) is a line of the compendium card, not a change the copy
 * made, so every Action and Feature on a sheet or in the world takes the compendium item's worth of the same type and name when it has none or an old
 * one (the ledger reruns at every card pass). Silent, at ready, by the active GM; nothing else of the copy moves. Returns how many items changed.
 */
export async function refreshWorth() {
  const map = new Map();
  for (const key of ["twod12.actions", "twod12.features"]) {
    const pack = game.packs.get(key); if (!pack) continue;
    for (const e of await pack.getIndex({ fields: ["system.worth"] })) if (e.system?.worth) map.set(`${e.type}:${e.name}`, e.system.worth);
  }
  let n = 0;
  const fix = async it => { const w = map.get(`${it.type}:${it.name}`); if (w && it.system?.worth !== w) { await it.update({ "system.worth": w }); n++; } };
  for (const it of game.items ?? []) { try { await fix(it); } catch (e) { console.warn("twod12 | worth", it.name, e); } }
  for (const a of allActors()) for (const it of [...a.items]) { try { await fix(it); } catch (e) { console.warn("twod12 | worth", a.name, it.name, e); } }
  if (n) console.log(`twod12 | the ruler's worth refreshed on ${n} item${n === 1 ? "" : "s"}`);
  return n;
}

/** The question, with its options. */
export async function askRefresh(reason = "") {
  if (!game.user.isGM) return null;
  const res = await DialogV2.wait({
    window: { title: "Update from the compendium" },
    content: `${reason ? `<p>${reason}</p>` : ""}<p>Replace the Features, Talents, Actions, Effects, Classes, Species, weapons and armor on every sheet (and the world's items) with the system compendium's current versions?</p>
      <p class="hint">What each copy chose is kept (class picks and Attributes, Talent slots, a weapon in hand, worn armor). <b>Changes made by hand to a copy are lost</b>: skip this if you homebrew the system's cards.</p>
      <label class="checkbox"><input type="checkbox" name="byName" checked> Also match items with the same type and name as a compendium item</label>
      <label class="checkbox"><input type="checkbox" name="basics" checked> Replace the Basic Actions too</label>`,
    buttons: [
      { action: "yes", label: "Update", icon: "fa-solid fa-rotate", default: true, callback: (ev, btn) => ({ byName: btn.form.elements.byName.checked, basics: btn.form.elements.basics.checked }) },
      { action: "no", label: "Not now", icon: "fa-solid fa-xmark" }
    ],
    rejectClose: false
  });
  if (!res || res === "no") return null;
  return refreshFromCompendium(res);
}

/** The settings button opens the question (an ApplicationV2 that asks and closes). */
class RefreshMenu extends foundry.applications.api.ApplicationV2 {
  async render() { await askRefresh(); return this; }
}

export function registerRefresh() {
  game.settings.register(F, "refreshAskedFor", { scope: "world", config: false, type: String, default: "" });
  game.settings.registerMenu(F, "refreshMenu", { name: "Update from the compendium", label: "Update sheets", hint: "Bring every sheet's cards up to the system compendium's versions (asked after each system update).", icon: "fa-solid fa-rotate", type: RefreshMenu, restricted: true });
  // After a system update: asked once per version, by the active GM.
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM) return;
    // v0.0.241: the worth lines; v0.0.361 (PACK PERF, D37): once per system version (the compendium's worth only changes with one), not at every load
    try { if (game.settings.get(F, "worthFor") !== game.system.version) { await refreshWorth(); await game.settings.set(F, "worthFor", game.system.version); } } catch (e) { console.warn("twod12 | worth", e); }
    const v = game.system.version, asked = game.settings.get(F, "refreshAskedFor");
    if (asked === v) return;
    try { const { needsMigrationR } = await import("./migrater.mjs"); if (needsMigrationR()) return; } catch (e) { /* none */ }   // v0.0.243: the pack R migration asks and runs the refresh itself
    await game.settings.set(F, "refreshAskedFor", v);
    if (!asked && !(game.actors?.size || game.items?.size)) return;   // a new, empty world: nothing to update
    await askRefresh(`The 2d12 system was updated to v${v}.`);
  });
}
