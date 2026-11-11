// Pack R on load (v0.0.243; decision sheet item 23): the characters of an existing world are brought to the new core rules once, by the GM, after a
// backup reminder. Health is recomputed from the class's Health line (the GM says which threshold gets the high value for each character; Vigor by
// default), Escalation becomes a level (0 to 1; nothing is spent any more), the Guard of kept AP starts at 0, and the class, species and class cards are
// replaced from the compendium with the existing refresh (refresh.mjs: what a copy chose is kept). Nothing is deleted: an old Opportunity Attack Talent
// or an old card stays until the player removes it. Asked again at the next load when the GM says "Later"; also game.twod12.migrateR().
import { sysCard } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
const F = "twod12", DONE = "R1";
const { DialogV2 } = foundry.applications.api;

const characters = () => [...(game.actors ?? [])].filter(a => a.type === "character");
/** Does this world still need the pack R migration? (characters exist and it hasn't run) */
export const needsMigrationR = () => { try { return game.settings.get(F, "migratedR") !== DONE && characters().length > 0; } catch (e) { return false; } };

/** Pure: the updates of one character: the high side, Escalation 1 (a level), no AP Guard. */
export function migrationUpdate(sys, highSide = "vigor") {
  const upd = {};
  if ((sys?.healthHigh ?? "vigor") !== highSide) upd["system.healthHigh"] = highSide;
  if ((Number(sys?.escalation) || 0) < 1) upd["system.escalation"] = 1;
  if ((Number(sys?.apGuard) || 0) !== 0) upd["system.apGuard"] = 0;
  return upd;
}

/** The question: a backup reminder, then one row per character (which threshold is high). */
async function askMigration() {
  const rows = characters().map(a => `<div class="form-group"><label>${esc(a.name)}</label><select name="high-${a.id}"><option value="vigor">High value on Vigor</option><option value="resolve"${a.system.healthHigh === "resolve" ? " selected" : ""}>High value on Resolve</option></select></div>`).join("");
  return DialogV2.wait({
    window: { title: "Pack R: the new core rules" },
    content: `<p><b>Back up your world first</b> (Foundry: Game Worlds, Backup). Nothing is deleted, but Health, Escalation and the class cards change.</p>
      <p>The 2d12 system now runs the book's pack R rules: <b>4 AP + 1 Reaction AP</b>, <b>Escalation as a level</b> (1 to 3, never spent), the <b>Vigor / Resolve Health line</b> (the class's high and low values, the species' bonuses, the Stage steps; the Attributes are out), <b>Rally Points = Rally + Stage</b>, Bloodied and Strained without Banes.</p>
      <p>For each character, say which threshold gets the class's high Health value (it can be changed later on the sheet, next to the Health):</p>${rows}
      <p class="hint">Then: Escalation set to 1, the Guard of kept AP to 0, and the class, species and class cards are replaced from the compendium (what each copy chose is kept: picks, Attributes, Talent slots; changes made by hand to a copy are lost).</p>`,
    buttons: [
      { action: "yes", label: "Migrate", icon: "fa-solid fa-rotate", default: true, callback: (ev, btn) => Object.fromEntries(characters().map(a => [a.id, btn.form.elements[`high-${a.id}`]?.value === "resolve" ? "resolve" : "vigor"])) },
      { action: "no", label: "Later", icon: "fa-solid fa-xmark" }
    ],
    rejectClose: false
  });
}

/** Run it (the GM). Returns what was done, or null. */
export async function migrateR({ ask = true } = {}) {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can run the pack R migration."); return null; }
  const choice = ask ? await askMigration() : Object.fromEntries(characters().map(a => [a.id, a.system.healthHigh === "resolve" ? "resolve" : "vigor"]));
  if (!choice || choice === "no") return null;
  const lines = [];
  for (const a of characters()) {
    const upd = migrationUpdate(a.system, choice[a.id] ?? "vigor");
    if (Object.keys(upd).length) await a.update(upd);
  }
  const { refreshFromCompendium } = await import("./refresh.mjs");
  const res = await refreshFromCompendium({ byName: true, basics: true });
  for (const a of characters()) lines.push(`${esc(a.name)}: Vigor <b>${a.system.bdt}</b> / Resolve <b>${a.system.mdt}</b> (Health Pool ${a.system.pool}), Escalation ${a.system.escalation}, Rally Points ${a.system.rallyMax}`);
  await game.settings.set(F, "migratedR", DONE);
  await game.settings.set(F, "refreshAskedFor", game.system.version);   // the refresh ran here
  await ChatMessage.create({ whisper: game.users.filter(u => u.isGM).map(u => u.id), content: sysCard({ title: "Pack R: characters migrated", lead: `${characters().length} character${characters().length === 1 ? "" : "s"} on the new core rules`,
    text: `${lines.join("<br>")}<br>${res ? `${res.items} item${res.items === 1 ? "" : "s"} refreshed from the compendium.` : ""} Check each sheet's Health line (the high side can be swapped there). Old cards and Talents that left the book (Opportunity Attack) were kept: remove them by hand.` }) });
  return { characters: characters().length, refreshed: res };
}

export function registerMigrationR() {
  game.settings.register(F, "migratedR", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM) return;
    if (game.settings.get(F, "migratedR") === DONE) return;
    if (!characters().length) { await game.settings.set(F, "migratedR", DONE); return; }   // a new world: nothing to migrate
    await migrateR();
  });
}

// Pack MOD on load (v0.0.305; book, Chapter 5): the Weapon and Power Modifiers are class values (+2 and +1). Each character keeps the order its
// Modifiers had: the one that was higher (from the Attributes, the old formula) becomes the lead (the +2); a tie goes to the Weapon Modifier.
// Nothing is asked: the GM gets one card. The class copies take their values when they are updated from the compendium (refresh.mjs keeps
// modPriority and modStage2). Also game.twod12.migrateMod().
const DONE_MOD = "MOD1";
/** The Attribute lists of the classes before pack MOD (a class copy already updated from the compendium has none left). */
export const OLD_MOD_LISTS = { Paladin: [["body", "appeal"], ["mind", "appeal"]], Archer: [["instinct", "body"], ["mind", "appeal"]] };

/** Pure: the lead Modifier a character keeps. attrs: its Attributes; cs: its class copy's system; name: the class's name. */
export function modLeadOf(attrs, cs, name, classModifiers) {
  const list = k => [...(cs?.[k] ?? [])];
  let W = list("weaponAttrs"), P = list("magicAttrs");
  if (!W.length && !P.length) [W, P] = OLD_MOD_LISTS[name] ?? [[cs?.chosenWeapon].filter(Boolean), [cs?.chosenMagic].filter(Boolean)];
  const cm = classModifiers(attrs ?? {}, W, P, cs?.modPriority === "power" ? "power" : "weapon");
  return cm.power.mod > cm.weapon.mod ? "power" : "weapon";
}

export async function migrateMod() {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can run the pack MOD migration."); return null; }
  const { classModifiers } = await import("./modifiers.mjs");
  const lines = [];
  for (const a of characters()) {
    const cls = a.itemTypes?.class?.[0];
    if (!cls) continue;
    const lead = modLeadOf(a.system.attributes, cls.system, cls.name, classModifiers);
    if ((cls.system.modPriority || "weapon") !== lead) await cls.update({ "system.modPriority": lead });
    lines.push(`${esc(a.name)} (${esc(cls.name)}): leads with the <b>${lead === "power" ? "Power" : "Weapon"} Modifier</b>`);
  }
  await game.settings.set(F, "migratedMod", DONE_MOD);
  if (lines.length) await ChatMessage.create({ whisper: game.users.filter(u => u.isGM).map(u => u.id), content: sysCard({ title: "Modifiers are class values", lead: `${lines.length} character${lines.length === 1 ? "" : "s"}: each keeps the order of its Modifiers`,
    text: `${lines.join("<br>")}<br>The Paladin's Modifiers are +2 and +1 (the player's order), the Archer's Weapon +2, Power +1; Stage 2 adds +1 to one, Stage 3 +1 to both. They take effect when the class copies are updated from the compendium (System settings: Update from the compendium). A Paladin's order can be changed on its class (Details tab).` }) });
  return { characters: lines.length };
}

export function registerMigrationMod() {
  game.settings.register(F, "migratedMod", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM || game.settings.get(F, "migratedMod") === DONE_MOD) return;
    if (!characters().length) { await game.settings.set(F, "migratedMod", DONE_MOD); return; }
    await migrateMod();
  });
}
