import { isTalentAction } from "./config.mjs";
import { applyEffects, originInfo } from "./effects.mjs";
import { dropClassLevels } from "./classwindow.mjs";
const F = "twod12";

/**
 * Choose `count` of the options ({ key: label }): the pick window (v0.0.415, pack CL; was a DialogV2). One: click and done; several: toggle them,
 * Confirm when exactly `count` are on. Resolves the chosen keys, or null.
 */
export async function chooseDialog(title, prompt, options, count = 1) {
  const PW = await import("./pickwindow.mjs"), entries = Object.entries(options);
  if (count === 1) { const k = await PW.pickOne({ title, name: title, icon: "fa-list-check", text: prompt, options: entries.map(([k, l]) => ({ k, l: String(l).replace(/<[^>]+>/g, "") })) }); return k === null ? null : [k]; }
  const on = new Set();
  return PW.pickWith({
    title,
    model: () => ({ name: title, icon: "fa-list-check", sections: [{ title: "", sub: prompt, rows: [{ key: "pick", label: "", opts: entries.map(([k, l]) => ({ k, l: String(l).replace(/<[^>]+>/g, ""), on: on.has(k) })) }] }],
      complete: on.size === count, message: `${on.size} of ${count} chosen`, confirm: "Confirm" }),
    pick: (row, k) => { if (on.has(k)) on.delete(k); else on.add(k); },
    result: () => [...on]
  });
}

const copyData = (item, flags) => {
  const d = item.toObject();
  delete d._id;
  for (const [k, v] of Object.entries(flags)) foundry.utils.setProperty(d, `flags.${F}.${k}`, v);
  return d;
};

/**
 * A Talent or Feature with a choice (Lesser Blessing: pick the blessing): a window asks which options to grant. The chosen Actions, Features
 * or Talents are added to the character and shown under the item; they are removed with it.
 */
export async function grantChoices(actor, parent, copy, preset = null) {
  const s = parent.system, all = (s.choiceOptions ?? []).filter(Boolean);
  if (!all.length) return;
  const docs = (await Promise.all(all.map(async u => { try { return await fromUuid(u); } catch (e) { return null; } }))).filter(Boolean);
  const count = Math.max(1, s.choiceCount || 1);
  let picked = docs;
  if (docs.length > count && preset?.length) picked = docs.filter(d => preset.includes(d.uuid)).slice(0, count);   // v0.0.215: chosen in the class window
  else if (docs.length > count) {
    const opts = Object.fromEntries(docs.map(d => [d.uuid, `${d.name} (${d.type})`]));
    const res = await chooseDialog(`${parent.name}: ${s.choiceLabel || "Choose"}`, `Choose ${count}.`, opts, count);
    if (!res) { ui.notifications.warn(`No choice made for ${parent.name}.`); return; }
    picked = docs.filter(d => res.includes(d.uuid));
  }
  for (const d of picked) {
    if (d.type === "action") await actor.createEmbeddedDocuments("Item", [copyData(d, { sourceUuid: d.uuid, talentId: copy.id, choice: true })]);
    else if (d.type === "feature") await grantFeature(actor, d, "choice", null, { talentId: copy.id, choice: true });
    else if (d.type === "talent") await grantTalent(actor, d, "", { talentId: copy.id, choice: true });
  }
  await copy.setFlag(F, "choices", picked.map(d => d.uuid));
}

async function grantActions(actor, uuids, flag, id) {
  let n = 0;
  for (const uuid of uuids) {
    try {
      const a = await fromUuid(uuid);
      if (!a) { ui.notifications.warn(`Linked action not found: ${uuid}`); continue; }
      await actor.createEmbeddedDocuments("Item", [copyData(a, { sourceUuid: a.uuid, [flag]: id })]);
      n++;
    } catch (err) { console.error("twod12 | could not grant action", uuid, err); ui.notifications.error(`Could not grant an action (see console).`); }
  }
  return n;
}

export async function grantFeature(actor, feature, by = "manual", level = null, extra = {}, preset = null) {
  if (actor.items.some(i => i.type === "feature" && i.getFlag(F, "sourceUuid") === feature.uuid)) return;
  const flags = { sourceUuid: feature.uuid, grantedBy: by, ...extra };
  if (level !== null) flags.level = level;
  const [copy] = await actor.createEmbeddedDocuments("Item", [copyData(feature, flags)]);
  await grantActions(actor, feature.system.actions, "featureId", copy.id);
  await grantChoices(actor, feature, copy, preset);
}

export async function grantClassFeatures(actor) {
  const cls = actor.itemTypes.class[0];
  if (!cls) return;
  for (const f of cls.system.features) {
    const feat = await fromUuid(f.uuid);
    if (!feat) continue;
    const lvl = Math.max(1, feat.system.level || 1);   // the Feature itself says at which level it is gained
    if (lvl > actor.system.level) continue;
    await grantFeature(actor, feat, "class", lvl);
  }
}

async function grantWeapon(actor, weapon) {
  const [copy] = await actor.createEmbeddedDocuments("Item", [copyData(weapon, { sourceUuid: weapon.uuid })]);
  const n = await grantActions(actor, weapon.system.actions, "weaponId", copy.id);
  ui.notifications.info(`${weapon.name} added with ${n} action(s).`);
}

/**
 * v0.0.412 (pack F3 part 2): a character's old weapon replaced by the compendium's new one (the weapons migration): the new weapon is added where
 * the old one was (in hand, on you, dropped; one or both hands as the new weapon needs), with its Weapon Technique; the old weapon and the Actions
 * it gave go. Returns the new weapon's name.
 */
export async function replaceWeapon(actor, old, fresh) {
  const d = copyData(fresh, { sourceUuid: fresh.uuid }), was = old.system ?? {};
  for (const k of ["wielded", "dropped", "hand"]) if (k in was && d.system && k in d.system) d.system[k] = was[k];
  const [copy] = await actor.createEmbeddedDocuments("Item", [d]);
  await grantActions(actor, fresh.system.actions ?? [], "weaponId", copy.id);
  const gone = actor.items.filter(i => i.type === "action" && i.getFlag(F, "weaponId") === old.id).map(i => i.id);
  await actor.deleteEmbeddedDocuments("Item", [old.id, ...gone]);
  return copy.name;
}

async function dropSpecies(actor, item) {
  // v0.0.244: the Species window (specieswindow.mjs), in the class window's format: the two Attributes, the side of the bigger Health bonus, what it grants.
  const { chooseSpecies } = await import("./specieswindow.mjs");
  const res = await chooseSpecies({ item, actor, adding: true });
  if (!res) return;
  for (const old of actor.itemTypes.species) await old.delete();
  const d = copyData(item, { sourceUuid: item.uuid });
  d.system.chosen = res.chosen;
  await actor.createEmbeddedDocuments("Item", [d]);
  if (actor.type === "character" && (actor.system.speciesHigh ?? "") !== res.side) await actor.update({ "system.speciesHigh": res.side });
}

async function dropClass(actor, item) {
  const s = item.system;
  // v0.0.185: a class with levels uses the class window (classwindow.mjs). v0.0.415 (pack CL): the old Attribute dialog for a class without levels is
  // gone (Stage 0 has no class Attribute increases; every class has levels): such a class asks for its levels first; NPCs don't take classes.
  if (actor.type !== "character") return ui.notifications.warn(`${actor.name}: classes are for characters (an NPC is built in its Builder).`);
  if (!s.levels?.length) return ui.notifications.warn(`${item.name} has no levels yet: open the class and use Edit levels first.`);
  return dropClassLevels(actor, item);
}

/** Talents (characters only): the Talent and the Actions it gives. */
export async function grantTalent(actor, talent, slot = "", extra = {}, preset = null) {
  if (actor.type !== "character") return ui.notifications.warn("Talents are for characters.");
  if (actor.items.some(i => i.type === "talent" && i.getFlag(F, "sourceUuid") === talent.uuid)) return ui.notifications.info(`${actor.name} already has ${talent.name}.`);
  const [copy] = await actor.createEmbeddedDocuments("Item", [copyData(talent, { sourceUuid: talent.uuid, ...(slot ? { slot } : {}), ...extra })]);
  const n = await grantActions(actor, talent.system.actions, "talentId", copy.id);
  await grantChoices(actor, talent, copy, preset);
  ui.notifications.info(`${talent.name} added${n ? ` with ${n} action(s)` : ""}.`);
}

export async function handleDrop(actor, item, { slot = "" } = {}) {
  switch (item.type) {
    case "species": return dropSpecies(actor, item);
    case "class": return dropClass(actor, item);
    case "feature": return grantFeature(actor, item, "manual");
    case "talent": return grantTalent(actor, item, slot);
    case "weapon": return grantWeapon(actor, item);
    case "armor": {
      const d = copyData(item, { sourceUuid: item.uuid });
      d.system.worn = false;
      await actor.createEmbeddedDocuments("Item", [d]);
      return ui.notifications.info(`${item.name} added: wear it from the Items tab.`);
    }
    case "gear": {
      // The same gear again adds to its quantity instead of a second row.
      const same = actor.itemTypes.gear?.find(g => g.getFlag(F, "sourceUuid") === item.uuid || g.name === item.name);
      if (same) return same.update({ "system.quantity": (same.system.quantity || 0) + Math.max(1, item.system.quantity || 1) });
      return actor.createEmbeddedDocuments("Item", [copyData(item, { sourceUuid: item.uuid })]);
    }
    case "effect": return applyEffects([item.uuid], [actor.uuid], originInfo(actor.uuid));
    case "action": {
      // An Action that is a Talent (Aim, Cut Through...) takes a Talent slot, like a Talent does.
      if (isTalentAction(item) && actor.type === "character") {
        if (actor.items.some(i => i.type === "action" && i.getFlag(F, "sourceUuid") === item.uuid)) return ui.notifications.info(`${actor.name} already has ${item.name}.`);
        await actor.createEmbeddedDocuments("Item", [copyData(item, { sourceUuid: item.uuid, ...(slot ? { slot } : {}) })]);
        return ui.notifications.info(`${item.name} added.`);
      }
      return actor.createEmbeddedDocuments("Item", [copyData(item, { sourceUuid: item.uuid })]);
    }
  }
}
