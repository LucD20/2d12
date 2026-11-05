import { TWOD12, isTalentAction } from "./config.mjs";
import { applyEffects, originInfo } from "./effects.mjs";
import { dropClassLevels } from "./classwindow.mjs";
const { DialogV2 } = foundry.applications.api;
const F = "twod12";

export async function chooseDialog(title, prompt, options, count = 1) {
  const entries = Object.entries(options);
  const type = count === 1 ? "radio" : "checkbox";
  const inputs = entries.map(([k, l], i) => `<label class="pick"><input type="${type}" name="pick" value="${k}" ${count === 1 && i === 0 ? "checked" : ""}> ${l}</label>`).join("<br>");
  const res = await DialogV2.prompt({
    window: { title }, content: `<p>${prompt}</p>${inputs}`,
    ok: { label: "OK", callback: (ev, btn) => new FormData(btn.form).getAll("pick") }, rejectClose: false
  });
  if (!res) return null;
  if (res.length !== count) { ui.notifications.warn(`Select exactly ${count}.`); return chooseDialog(title, prompt, options, count); }
  return res;
}

const copyData = (item, flags) => {
  const d = item.toObject();
  delete d._id;
  for (const [k, v] of Object.entries(flags)) foundry.utils.setProperty(d, `flags.${F}.${k}`, v);
  return d;
};

/**
 * The choices of a class in one window: its two Attribute increases (they must go to different Attributes) and, when its Weapon and
 * Power lists share an Attribute, which Modifier keeps that Attribute if it is the higher for both. The Modifiers themselves are not
 * picked: each uses the higher of its two Attributes. A group with one option is shown as already decided.
 */
async function classChoices(item) {
  const s = item.system;
  const groups = [["a", "Attribute +1 (first)", s.choiceA], ["b", "Attribute +1 (second)", s.choiceB]].map(([key, label, set]) => ({ key, label, keys: [...set] }));
  const shared = [...s.weaponAttrs].filter(k => s.magicAttrs.has(k));
  const open = groups.filter(g => g.keys.length > 1);
  const fixed = Object.fromEntries(groups.map(g => [g.key, g.keys.length === 1 ? g.keys[0] : ""]));
  if (!open.length && !shared.length) return { ...fixed, priority: "weapon" };
  const row = g => `<div class="form-group choicegroup"><label>${g.label}</label><div class="form-fields">${g.keys.map(k => `<label class="inline"><input type="radio" name="${g.key}" value="${k}"> ${TWOD12.attributes[k]}</label>`).join(" ")}</div></div>`;
  const prio = shared.length ? `<div class="form-group choicegroup"><label>If ${shared.map(k => TWOD12.attributes[k]).join(" or ")} is the higher for both Modifiers</label><div class="form-fields"><label class="inline"><input type="radio" name="priority" value="weapon" checked> the Weapon Modifier keeps it</label> <label class="inline"><input type="radio" name="priority" value="power"> the Power Modifier keeps it</label></div></div>` : "";
  const decided = groups.filter(g => g.keys.length === 1).map(g => `<li>${g.label}: <b>${TWOD12.attributes[g.keys[0]]}</b></li>`).join("");
  const mods = `<li>Weapon Modifier: the higher of ${[...s.weaponAttrs].map(k => TWOD12.attributes[k]).join(" or ") || "-"}</li><li>Power Modifier: the higher of ${[...s.magicAttrs].map(k => TWOD12.attributes[k]).join(" or ") || "-"}</li>`;
  for (;;) {
    const res = await DialogV2.prompt({
      window: { title: `${item.name}: choices` }, position: { width: 480 },
      content: `<div class="twod12 classchoices"><p>The two Attribute increases must go to different Attributes.</p>${open.map(row).join("")}${prio}<ul class="decided">${decided}${mods}</ul></div>`,
      ok: { label: "Apply", callback: (ev, btn) => Object.fromEntries(new FormData(btn.form)) }, rejectClose: false
    });
    if (!res) return null;
    const missing = open.filter(g => !res[g.key]);
    const out = { ...fixed, ...Object.fromEntries(open.map(g => [g.key, res[g.key]])), priority: res.priority === "power" ? "power" : "weapon" };
    if (missing.length) { ui.notifications.warn(`Choose: ${missing.map(g => g.label).join(", ")}.`); continue; }
    if (out.a && out.a === out.b) { ui.notifications.warn("The two Attribute increases must go to different Attributes."); continue; }
    return out;
  }
}


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
  // v0.0.185: a class with levels uses the class window (classwindow.mjs); one without keeps the old dialogs.
  if (s.levels?.length && actor.type === "character") return dropClassLevels(actor, item);
  if ([s.choiceA, s.choiceB, s.weaponAttrs, s.magicAttrs].every(x => [...x].length === 0)) {
    ui.notifications.warn(`${item.name} has no attribute options set (Details tab).`);
  }
  const picks = await classChoices(item);
  if (!picks) return;
  const { a, b, priority } = picks;
  for (const old of actor.itemTypes.class) await old.delete();
  const granted = actor.items.filter(i => i.type === "feature" && i.getFlag(F, "grantedBy") === "class").map(i => i.id);
  if (granted.length) await actor.deleteEmbeddedDocuments("Item", granted);
  const d = copyData(item, { sourceUuid: item.uuid });
  Object.assign(d.system, { chosenA: a, chosenB: b, chosenWeapon: "", chosenMagic: "", modPriority: priority });
  await actor.createEmbeddedDocuments("Item", [d]);
  await grantClassFeatures(actor);
  ui.notifications.info(`${item.name} applied (+1 ${a || "-"}, +1 ${b || "-"}).`);
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
