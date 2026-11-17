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

// v0.0.407 (pack "Stage 0 in Foundry"; book, the pack "Stage 0 into the book"): an existing world brought to Stage 0 once, by the GM, after a
// question in the system's window (Migrate / Later; asked again at the next load after Later; also game.twod12.migrateS0()). What it does: the
// party's Momentum becomes a number (an old "on" is 1); the items are updated from the compendium (refresh.mjs: the weapons' new damage, the
// classes without the level 3 Daily Pick and with their Health steps at 0 (not written yet), the Empowered condition, the Basic Actions without Opportunity
// Attack); every Escalation is kept within 1 to 6. Nothing is deleted: Talents (set aside), Daily Picks taken at Stage 0 and an Enfeebled effect stay
// on the sheets, and the GM's card lists them to remove by hand. NPCs need nothing: at Stage 0 their Health and Defenses come from the Bestiary's
// new tables by themselves; the card says that their Actions no longer add the Modifier to the damage.
const DONE_S0 = "S0";
/** Pure: what a character keeps that Stage 0 no longer gives: { talents: [names], daily: [names], enfeebled: bool }. items: [{ name, type, frequency, classLevel }]. */
export function stage0Leftovers(items = [], effects = []) {
  return {
    talents: items.filter(i => i.type === "talent").map(i => i.name),
    daily: items.filter(i => i.type === "action" && i.frequency === "daily" && (Number(i.classLevel) || 0) > 0 && Number(i.classLevel) <= 3).map(i => i.name),
    enfeebled: effects.some(e => [...(e.statuses ?? [])].includes("enfeebled"))
  };
}
export const needsMigrationS0 = () => { try { return game.settings.get(F, "migratedS0") !== DONE_S0 && [...(game.actors ?? [])].some(a => a.type === "character" || a.type === "npc"); } catch (e) { return false; } };

export async function migrateS0({ ask = true } = {}) {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can run the Stage 0 migration."); return null; }
  if (ask) {
    const { pickConfirm } = await import("./pickwindow.mjs");
    const ok = await pickConfirm({ title: "Stage 0", name: "Stage 0 in Foundry", sub: "the book's Stage 0 rules", icon: "fa-stairs", confirm: "Migrate",
      text: "<b>Back up your world first</b> (Foundry: Game Worlds, Backup). Nothing is deleted.<br>The system now follows the book's Stage 0: Stages 0 to 3 (levels 1-3, 4-7, 8-11, 12-15), Escalation 1 to 6, Momentum 0 to 4, exploding weapon dice, the weapon table, the Bestiary's Stage 0 numbers, no Opportunity Attack and no Talents for now.<br>Migrate now updates the items from the compendium (weapons, classes, conditions, Basic Actions: what each copy chose is kept) and makes Momentum a number. Later asks again at the next load." });
    if (!ok) return null;
  }
  const lines = [];
  // Momentum: an old switch (true / false) becomes a number
  try { const { momentumValue } = await import("./roundrules.mjs"); const v = game.settings.get(F, "momentum"); const n = momentumValue(v); if (v !== n) await game.settings.set(F, "momentum", n); lines.push(`Momentum: <b>${n}</b>`); } catch (e) { console.warn("twod12 | Momentum", e); }
  // Escalation within 1 to 6
  for (const a of game.actors ?? []) { const e = Number(a.system?.escalation); if (Number.isFinite(e) && (e < 1 || e > 6) && (a.type === "character" || a.system?.useEscalation)) await a.update({ "system.escalation": Math.max(1, Math.min(6, e)) }); }
  const { refreshFromCompendium } = await import("./refresh.mjs");
  const res = await refreshFromCompendium({ byName: true, basics: true });
  for (const a of characters()) {
    const left = stage0Leftovers(a.items.map(i => ({ name: i.name, type: i.type, frequency: i.system?.frequency, classLevel: i.getFlag?.(F, "classLevel") })), [...(a.effects ?? [])]);
    const keep = [left.talents.length ? `Talents (set aside): ${left.talents.map(esc).join(", ")}` : "", left.daily.length ? `a Daily Pick at Stage 0: ${left.daily.map(esc).join(", ")}` : "", left.enfeebled ? "an Enfeebled effect (gone from the book)" : ""].filter(Boolean);
    lines.push(`${esc(a.name)}: level ${a.system.level}, <b>Stage ${a.system.stage}</b>, Rally Points ${a.system.rallyMax}, Escalation ${a.system.escalation}${keep.length ? `; kept: ${keep.join("; ")}` : ""}`);
  }
  const npcs = [...(game.actors ?? [])].filter(a => a.type === "npc").length;
  await game.settings.set(F, "migratedS0", DONE_S0);
  await game.settings.set(F, "refreshAskedFor", game.system.version);   // the refresh ran here
  await ChatMessage.create({ whisper: game.users.filter(u => u.isGM).map(u => u.id), content: sysCard({ title: "Stage 0: the world migrated", lead: `${characters().length} character${characters().length === 1 ? "" : "s"}, ${npcs} NPC${npcs === 1 ? "" : "s"}`,
    text: `${lines.join("<br>")}<br>${res ? `${res.items} item${res.items === 1 ? "" : "s"} updated from the compendium.` : ""} What is kept on a sheet but no longer given (Talents, a Daily Pick at Stage 0, Enfeebled) can be removed by hand. NPCs: at Stage 0 their Health and Defenses are the Bestiary's new numbers, and their damage is written whole (the Modifier is no longer added): check your own NPCs' Actions against the Builder tab's turn budget; the compendium's five NPCs are rebuilt.` }) });
  return { characters: characters().length, npcs, refreshed: res };
}

export function registerMigrationS0() {
  game.settings.register(F, "migratedS0", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM || game.settings.get(F, "migratedS0") === DONE_S0) return;
    // after the pack R migration (a world that still needs it runs that first; this one asks at the next load)
    try { if (game.settings.get(F, "migratedR") !== DONE) return; } catch (e) { return; }
    if (!needsMigrationS0()) { await game.settings.set(F, "migratedS0", DONE_S0); return; }
    await migrateS0();
  });
}

// v0.0.409 (pack F2, "the Paladin in Foundry"; book, the Paladin redesigned on 2026-11-16): an existing world's Paladins, once, by the GM, after the
// Stage 0 migration, with a question in the system's window (Migrate / Later). The items of the same name and type are updated from the compendium (the
// class with its new levels, Smite, Lay On Hands, Shield of Faith, Rebuke, Bulwark of Faith, Word of Radiance, Consecrated Ground, Kindled Wrath,
// Hallowed Stance: what each copy chose is kept). Nothing is deleted: pack R's cards that left the Paladin stay on the sheets and the GM's card lists
// them, with the new choices to make in the class window (Judge, a Hallmark Action, an Art, the Escalation abilities).
const DONE_F2 = "F2";
/** Pure: what a character keeps of pack R's Paladin (the cards that left it on 2026-11-16; Reckoning was a Feature, it is an Action now): [names]. items: [{ name, type }]. */
export function paladinLeftovers(items = []) {
  const OLD = ["Divine Power", "Holy Wrath", "Beacon", "Beacon's Step", "Miraculous Recovery", "Divine Intervention", "Radiant Zeal", "Divine Surge", "Font of Mercy", "Searing Blows", "Mending Light", "Final Verdict", "Hallowed Dawn"];
  return items.filter(i => (OLD.includes(i.name) && ["action", "feature"].includes(i.type)) || (i.name === "Reckoning" && i.type === "feature")).map(i => i.name);
}
const paladins = () => characters().filter(a => a.items.some(i => i.type === "class" && i.name === "Paladin"));
export const needsMigrationF2 = () => { try { return game.settings.get(F, "migratedF2") !== DONE_F2 && paladins().length > 0; } catch (e) { return false; } };
export async function migrateF2({ ask = true } = {}) {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can run the Paladin migration."); return null; }
  if (ask) {
    const { pickConfirm } = await import("./pickwindow.mjs");
    const ok = await pickConfirm({ title: "The Paladin", name: "The redesigned Paladin", sub: "the book's Paladin of 2026-11-16", icon: "fa-sun", confirm: "Migrate",
      text: "<b>Back up your world first</b> (Foundry: Game Worlds, Backup). Nothing is deleted.<br>The Paladin was redesigned: Judge and Smite for every Paladin, a Hallmark Action (Binding Light or Lay On Hands), a Hallmark Reaction (Shield of Faith or Rebuke), the Arts, the Escalation 2, 4 and 6 abilities, Weapon +1 and Power +2.<br>Migrate updates the class and the cards of the same name from the compendium (what each copy chose is kept). The old cards stay on the sheets; a card for you lists them, and each Paladin chooses the new picks in the class window. Later asks again at the next load." });
    if (!ok) return null;
  }
  const { refreshFromCompendium } = await import("./refresh.mjs");
  const res = await refreshFromCompendium({ byName: true, basics: false });
  const lines = paladins().map(a => { const left = paladinLeftovers(a.items.map(i => ({ name: i.name, type: i.type }))); return `${esc(a.name)}: level ${a.system.level}${left.length ? `; kept from the old Paladin: ${left.map(esc).join(", ")}` : ""}`; });
  await game.settings.set(F, "migratedF2", DONE_F2);
  await ChatMessage.create({ whisper: game.users.filter(u => u.isGM).map(u => u.id), content: sysCard({ title: "The Paladin: the world migrated", lead: `${lines.length} Paladin${lines.length === 1 ? "" : "s"}`,
    text: `${lines.join("<br>")}<br>${res ? `${res.items} item${res.items === 1 ? "" : "s"} updated from the compendium.` : ""} Each Paladin opens the class window (the Build tab) to choose what the new levels give (Judge and Smite are granted; a Hallmark Action, a Hallmark Reaction, an Art, the Escalation abilities). The old cards can be removed by hand.` }) });
  return { paladins: lines.length, refreshed: res };
}
export function registerMigrationF2() {
  game.settings.register(F, "migratedF2", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM || game.settings.get(F, "migratedF2") === DONE_F2) return;
    try { if (game.settings.get(F, "migratedS0") !== DONE_S0) return; } catch (e) { return; }   // after Stage 0 (a world that needs it runs that first)
    if (!needsMigrationF2()) { await game.settings.set(F, "migratedF2", DONE_F2); return; }
    await migrateF2();
  });
}

// v0.0.411 (pack F3, "the Archer in Foundry"; book, the Archer redesigned on 2026-11-16): an existing world's Archers, once, by the GM, after the
// Paladin's migration, with a question in the system's window. The class and the cards of the same name and type are updated from the compendium
// (Volley, Covering Fire, Thrill of the Kill); nothing is deleted: pack R's cards that left the Archer stay on the sheets, listed for the GM.
const DONE_F3 = "F3";
/** Pure: what a character keeps of pack R's Archer: [names]. items: [{ name, type }]. */
export function archerLeftovers(items = []) {
  const OLD = ["Sharpshooter", "Marked Quarry", "Mark Quarry", "Double Shot", "Rolling Shot", "Overwatch", "Covering Shot", "Marksman's Shot", "Pinning Shot", "Twin Shot", "Hunter's Focus", "Deadeye", "Rain of Arrows",
    "Killer's Focus", "Vanish", "Harrying Shots", "Hunter's Edge", "Sure Step", "Finisher", "Staggering Shot", "Deathmark", "Open Season", "Vanish's Step"];
  return items.filter(i => OLD.includes(i.name) && ["action", "feature"].includes(i.type)).map(i => i.name);
}
const archers = () => characters().filter(a => a.items.some(i => i.type === "class" && i.name === "Archer"));
export async function migrateF3({ ask = true } = {}) {
  if (!game.user.isGM) { ui.notifications.warn("Only the GM can run the Archer migration."); return null; }
  if (ask) {
    const { pickConfirm } = await import("./pickwindow.mjs");
    const ok = await pickConfirm({ title: "The Archer", name: "The redesigned Archer", sub: "the book's Archer of 2026-11-16", icon: "fa-bullseye", confirm: "Migrate",
      text: "<b>Back up your world first</b> (Foundry: Game Worlds, Backup). Nothing is deleted.<br>The Archer was redesigned: Shifting Aim and Darting Blade for every Archer, a Hallmark Action (Quick Shots or Strafe), a Hallmark Reaction (Slip Away or Snap Shot), the Arts, the Escalation 2, 4 and 6 abilities, Light Armor Training; no quarry.<br>Migrate updates the class and the cards of the same name from the compendium. The old cards stay on the sheets; a card for you lists them, and each Archer chooses the new picks in the class window. Later asks again at the next load." });
    if (!ok) return null;
  }
  const { refreshFromCompendium } = await import("./refresh.mjs");
  const res = await refreshFromCompendium({ byName: true, basics: false });
  const lines = archers().map(a => { const left = archerLeftovers(a.items.map(i => ({ name: i.name, type: i.type }))); return `${esc(a.name)}: level ${a.system.level}${left.length ? `; kept from the old Archer: ${left.map(esc).join(", ")}` : ""}`; });
  await game.settings.set(F, "migratedF3", DONE_F3);
  await ChatMessage.create({ whisper: game.users.filter(u => u.isGM).map(u => u.id), content: sysCard({ title: "The Archer: the world migrated", lead: `${lines.length} Archer${lines.length === 1 ? "" : "s"}`,
    text: `${lines.join("<br>")}<br>${res ? `${res.items} item${res.items === 1 ? "" : "s"} updated from the compendium.` : ""} Each Archer opens the class window (the Build tab) to choose what the new levels give (Shifting Aim and Darting Blade are granted). Light Armor Training now: Medium Armor is beyond it. The old cards (the quarry's among them) can be removed by hand.` }) });
  return { archers: lines.length, refreshed: res };
}
export function registerMigrationF3() {
  game.settings.register(F, "migratedF3", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM || game.settings.get(F, "migratedF3") === DONE_F3) return;
    try { if (game.settings.get(F, "migratedS0") !== DONE_S0) return; } catch (e) { return; }
    if (!(game.settings.get(F, "migratedF3") !== DONE_F3 && archers().length > 0)) { await game.settings.set(F, "migratedF3", DONE_F3); return; }
    await migrateF3();
  });
}
