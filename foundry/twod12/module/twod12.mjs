import { registerAuraHooks } from "./aura.mjs";
import { registerHazardHooks, registerHazardBehavior } from "./hazard.mjs";
import { registerDownHooks } from "./down.mjs";
import { registerLeanHooks } from "./lean.mjs";
import { registerMasteryHooks } from "./mastery.mjs";
import { registerArcherHooks } from "./archer.mjs";
import { registerLoE } from "./loe.mjs";
import { solidTiles, tileConfigSolid } from "./corners.mjs";
import { registerLightRadius } from "./lightradius.mjs";
import { registerEscalationHooks } from "./escalation.mjs";
import { registerArmorHooks } from "./armor.mjs";
import { registerFloatText } from "./floattext.mjs";
import { registerEffectEditor } from "./fxeditor.mjs";
import { registerAppliedEditor } from "./fxapplied.mjs";
import { registerClock, moveClock } from "./clock.mjs";
import { registerSleep, bumpExhausted } from "./sleep.mjs";
import { registerLight } from "./light.mjs";
import { registerLightOverlay } from "./lightoverlay.mjs";
import { CharacterData, NpcData, SpeciesData, ClassData, FeatureData, ActionData, WeaponData, EffectData, TalentData, ArmorData, GearData } from "./data.mjs";
import { registerEffectHooks, setupPanel, wrapConditions, shadowedEffects } from "./effects.mjs";
import { registerHealthBar } from "./healthbar.mjs";
import { registerInline, handleInline, saveRoll, retargetSave, registerInlineSocket } from "./inline.mjs";
import { openBuilder } from "./builder.mjs";
import { CharacterSheet, NpcSheet, TwoD12ItemSheet, registerSheetHooks } from "./sheets.mjs";
import { registerHandSetting } from "./hands.mjs";
import { grantClassFeatures } from "./grants.mjs";
import { rollDamage, retargetAction } from "./actions.mjs";
import { damageButton, registerSocket } from "./damage.mjs";
import { TWOD12 } from "./config.mjs";
import { TwoD12Combat, registerCombatHooks } from "./combat.mjs";
import { registerMovement, endMovement, evadeAsAdvance, clearLooseMove, rulerInfo } from "./move.mjs";
import { registerBasicHooks, refreshAllBasics } from "./basic.mjs";
import { catalog } from "./catalog.mjs";
import { registerSenses, giveHearing, addHearing } from "./senses.mjs";
import { giveVision, syncVision, globalLight, visionInfo } from "./vision.mjs";
import { lightInfo } from "./sightgate.mjs";
import { registerLightLabel, registerLightTool, sliderInfo } from "./lightlabel.mjs";
import { registerDamageReport, toggleDamageReport } from "./damagelog.mjs";
import { updateUseButtons } from "./freeuse.mjs";
import { registerVersionTabs } from "./preview.mjs";
import { registerCarousel, renderCarousel } from "./carousel.mjs";
import { GROUPS } from "./config.mjs";
import { registerDragCopy } from "./drag.mjs";
import { registerUsageHooks } from "./usage.mjs";

Hooks.once("init", () => {
  registerSenses();
  registerSleep();
  registerClock();
  registerEffectEditor();
  registerAppliedEditor();
  registerArmorHooks();
  registerEscalationHooks();
  registerAuraHooks();
  registerHazardHooks();
  registerDownHooks();
  registerLeanHooks();
  registerMasteryHooks();
  registerArcherHooks();
  registerLoE();   // the Line of Effect button on the token HUD (v0.0.165)
  // Template parts used by more than one sheet (the settings of an Effect and of a passive).
  (foundry.applications?.handlebars?.loadTemplates ?? globalThis.loadTemplates)?.(["systems/twod12/templates/parts/settings.hbs", "systems/twod12/templates/parts/preds.hbs"]);
  game.settings.register("twod12", "sheetHelp", { name: "Action and Talent sheets: show help", hint: "The grey explanations on the Details tab of Action and Talent sheets. Also switched with the Show help box on the tab.", scope: "client", config: false, type: Boolean, default: true });
  game.settings.register("twod12", "effectHelp", { name: "Effect sheet: show help", hint: "Short explanations under each line of an Effect's Details tab. Also switched with the Show help box on the tab.", scope: "client", config: false, type: Boolean, default: false });
  registerHandSetting();
  game.settings.register("twod12", "auraOutlines", { name: "Show Aura outlines in combat", hint: "While a combat is running, the limits of every Aura on the scene are drawn. Hovering a token always shows its Aura (outline and squares).", scope: "client", config: true, type: Boolean, default: true });
  registerFloatText();
  wrapConditions(CONFIG.Actor.documentClass?.prototype);   // after registerSleep: it wraps the Exhausted rule
  CONFIG.time.roundTime = 10;   // 1 round is 10 seconds of world time
  registerLight();
  registerLightOverlay();
  CONFIG.TWOD12 = TWOD12;
  CONFIG.Combat.documentClass = TwoD12Combat;
  game.twod12 = {
    catalog,
    addHearing,
    syncVision,
    globalLight,
    visionInfo,
    lightInfo,
    sliderInfo,
    refreshBasics: refreshAllBasics,
    shadowedEffects,
    rulerInfo,
    solidTiles: (on = true) => solidTiles(on),
    time: s => moveClock(Number(s) || 0),
    exhausted: (delta = 1, actor = canvas.tokens?.controlled[0]?.actor ?? game.user.character) => bumpExhausted(actor, Number(delta) || 0)
  };
  for (const g of GROUPS)
    game.settings.register("twod12", `group_${g.key}`, {
      name: `Initiative color: ${g.label}`,
      hint: "Color of this group on the combat strip and in the combat tracker. Groups follow the token disposition.",
      scope: "client",
      config: true,
      type: new foundry.data.fields.ColorField({ required: true, nullable: false, initial: g.color }),
      default: g.color,
      onChange: () => {
        renderCarousel();
        ui.combat?.render();
      }
    });
  game.settings.register("twod12", "moveOutsideCombat", {
    name: "Movement buttons outside combat",
    hint: "Lets the Advance, Evade and Charge buttons on cards show the area a token can reach when there is no combat. The movement is not tracked or charged.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  game.settings.register("twod12", "ownMoveCorners", {
    name: "Solid corners for your own movement",
    hint: "Refuses an Advance, Evade or Charge that cuts a solid corner (a wall touching the corner point, or a Tile marked Solid). Foundry already refuses those diagonals; turn this on if you use Unrestricted movement. Forced Movement and Reposition always check corners.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  game.settings.register("twod12", "regionSnapCorners", { name: "Regions snap to whole squares", hint: "Drawing a Region snaps its points to grid corners, never to half squares (hold Shift to place freely).", scope: "world", config: true, type: Boolean, default: true });
  game.settings.register("twod12", "showOdds", { name: "Show the odds on cards", hint: "For testing: action cards show the chance of each tier, and damage cards the average and the chance of that total.", scope: "client", config: true, type: Boolean, default: true });
  game.settings.register("twod12", "highlightTraits", { name: "Highlight traits and damage types in rules text", hint: "A very light background behind trait names (Strike, Divine...) and colored damage types (Cold, Holy...) on cards.", scope: "client", config: true, type: Boolean, default: true });
  CONFIG.Actor.dataModels = { character: CharacterData, npc: NpcData };
  CONFIG.Item.dataModels = { species: SpeciesData, class: ClassData, feature: FeatureData, action: ActionData, weapon: WeaponData, armor: ArmorData, gear: GearData, effect: EffectData, talent: TalentData };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, "twod12", CharacterSheet, { types: ["character"], makeDefault: true, label: "2d12 Sheet" });
  DocumentSheetConfig.registerSheet(Actor, "twod12", NpcSheet, { types: ["npc"], makeDefault: true, label: "2d12 NPC Sheet" });
  DocumentSheetConfig.registerSheet(Item, "twod12", TwoD12ItemSheet, { types: ["species", "class", "feature", "action", "weapon", "armor", "gear", "effect", "talent"], makeDefault: true, label: "2d12 Item Sheet" });

  registerHealthBar();
  registerSheetHooks();
  // Difficult Terrain: the core "Modify Movement Cost" behavior with an Allies / Enemies filter.
  const Base = foundry.data?.regionBehaviors?.ModifyMovementCostRegionBehaviorType;
  if (Base && CONFIG.RegionBehavior) {
    const f = foundry.data.fields;
    class DifficultTerrainBehavior extends Base {
      static defineSchema() {
        return { ...super.defineSchema(), targets: new f.StringField({ initial: "all", choices: ["all", "allies", "enemies"] }), originDisposition: new f.NumberField({ initial: 1, integer: true }) };
      }
      _getTerrainEffects(token, segment) {
        const d = token.disposition ?? token.document?.disposition ?? 0, od = this.originDisposition;
        const ok = this.targets === "all" || (this.targets === "allies" && d === od) || (this.targets === "enemies" && d !== 0 && d !== od);
        return ok ? super._getTerrainEffects(token, segment) : [];
      }
    }
    CONFIG.RegionBehavior.dataModels.difficultTerrain = DifficultTerrainBehavior;
  }
  registerHazardBehavior();
  registerInline();
  game.settings.register("twod12", "tagList", { name: "Tags", hint: "The tags a creature can have, separated by commas. Abilities can refer to them (\"if the target has the Unholy tag\").", scope: "world", config: true, type: String, default: TWOD12.defaultTags.join(", ") });
  game.settings.register("twod12", "defaultSceneMade", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.164: a new world gets one plain scene, once
  game.settings.register("twod12", "quickInsertOffered", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.164: Quick Insert switched on once per world
  game.settings.register("twod12", "diagonalsApplied", { scope: "world", config: false, type: Boolean, default: false });
  game.settings.register("twod12", "weaponRoundApplied", { scope: "world", config: false, type: Boolean, default: false });
  game.settings.register("twod12", "projectileApplied", { scope: "world", config: false, type: Boolean, default: false });
  game.settings.register("twod12", "rallyV176", { scope: "world", config: false, type: Boolean, default: false });   // the Paladin's and Archer's Rally values updated once

  // Initiative is an Attribute Check rolled by TwoD12Combat#rollInitiative; this formula is only a fallback.
  CONFIG.Combat.initiative = { formula: "1d12 + @attributes.instinct", decimals: 0 };

  CONFIG.statusEffects = [
    ["bloodied", "icons/svg/blood.svg"],
    ["strained", "icons/svg/daze.svg"],
    ["desperate", "icons/svg/aura.svg"],
    ["dying", "icons/svg/skull.svg"],
    ["shattered", "icons/svg/terror.svg"],
    ["unconscious", "icons/svg/unconscious.svg"],
    ["prone", "icons/svg/falling.svg"],
    ["hindered", "icons/svg/downgrade.svg"],
    ["immobilized", "icons/svg/net.svg"],
    ["leaning", "icons/svg/eye.svg"],
    ["obscured", "icons/svg/blind.svg"],
    ["hidden", "icons/svg/sound.svg"],
    ["unsensed", "icons/svg/invisible.svg"],
    ["vulnerable", "icons/svg/hazard.svg"],
    ["empowered", "icons/svg/upgrade.svg"],
    ["enfeebled", "icons/svg/degen.svg"],
    ["exhausted", "icons/svg/sleep.svg"],
    ["imperiled", "icons/svg/hazard.svg"],
    ["squeezing", "icons/svg/net.svg"],
    ["slowed", "icons/svg/stoned.svg"],
    ["quickened", "icons/svg/lightning.svg"],
    ["dead", "icons/svg/skull.svg"]
  ].map(([id, img]) => ({ id, name: id[0].toUpperCase() + id.slice(1), img }));
});

/** Cards that are finished (damage rolled / applied) are shown short: title, result and effects. Clicking the title shows the whole card again. */
function collapsibleCards(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const root = el?.querySelector?.(".twod12.chat.action, .twod12.chat.dmg");
  if (!root || root.dataset.tcInit || msg.getFlag("twod12", "collapsed") === undefined) return;
  root.dataset.tcInit = "1";
  if (msg.getFlag("twod12", "collapsed")) root.classList.add("collapsed");
  const head = root.querySelector(":scope > .ahead");
  head?.classList.add("clickable");
  head?.addEventListener("click", () => root.classList.toggle("collapsed"));
}
Hooks.on("renderChatMessageHTML", collapsibleCards);
// v0.0.177: a light of size N reaches an N Emanation (the half square Foundry leaves out is added), and Regions snap to whole squares.
Hooks.once("setup", () => { try { registerLightRadius(); } catch (e) { console.warn("twod12 | light radius", e); } });
// Corners (v0.0.170): a "Solid" checkbox in the Tile settings (a solid Tile blocks the corners it covers).
Hooks.on("renderTileConfig", (app, html) => { try { tileConfigSolid(app, html); } catch (e) { console.warn("twod12 | Tile settings", e); } });
Hooks.on("renderChatMessageHTML", updateUseButtons);
Hooks.once("ready", registerVersionTabs);
Hooks.on("renderChatMessage", updateUseButtons);
Hooks.on("renderChatMessage", collapsibleCards);

// "Roll Damage" buttons on action cards (delegated so it works regardless of chat re-rendering).
Hooks.once("ready", async () => {
  document.addEventListener("click", async ev => {
    const inl = ev.target.closest?.("[data-twod12-inline]");
    if (inl) {
      ev.preventDefault();
      try { await handleInline(inl.dataset.twod12Inline, JSON.parse(inl.dataset.cfg), { message: game.messages.get(inl.closest("[data-message-id]")?.dataset.messageId) ?? null }); } catch (err) { console.error("twod12 | inline roll failed", err); }
      return;
    }
    const b = ev.target.closest?.("[data-twod12]");
    if (!b) return;
    const msg = game.messages.get(b.closest("[data-message-id]")?.dataset.messageId);
    if (!msg) return;
    if (b.dataset.twod12 === "endMove") return endMovement(b.dataset.combatant);
    if (b.dataset.twod12 === "clearMove") return clearLooseMove();
    if (b.dataset.twod12 === "evadeAdvance") return evadeAsAdvance(b.dataset.combatant);
    if (b.dataset.twod12 === "saveRoll") await saveRoll(msg, Number(b.dataset.idx));
    else if (b.dataset.twod12 === "retargetSave") await retargetSave(msg);
    else if (b.dataset.twod12 === "retargetAction") await retargetAction(msg);
    else if (b.dataset.twod12 === "rollDamage") await rollDamage(msg);
    else await damageButton(b.dataset.twod12, b, msg);
  });
  registerSocket();
  registerInlineSocket();
  // Default diagonal rule: alternating 1/2/1 (applied once, GM only).
  // v0.0.146: the Weapon trait no longer means Round. Actions that had no Frequency and the Weapon trait (they were Round) are set to Round, once.
  // v0.0.156: Shot Actions need a Projectile weapon. Once, every ranged weapon that isn't Thrown gets the property (the old rule: "ranged, not thrown").
  if (game.user.isGM && !game.settings.get("twod12", "projectileApplied")) {
    try {
      const fix = items => items.filter(i => i.type === "weapon" && i.system.traits?.has?.("ranged") && !i.system.traits.has("thrown") && !i.system.traits.has("projectile")).map(i => ({ _id: i.id, "system.traits": [...i.system.traits, "projectile"] }));
      const world = fix([...game.items]);
      if (world.length) await Item.updateDocuments(world);
      for (const a of game.actors) { const u = fix([...a.items]); if (u.length) await a.updateEmbeddedDocuments("Item", u); }
      await game.settings.set("twod12", "projectileApplied", true);
    } catch (e) { console.warn("twod12 | could not give ranged weapons the Projectile property", e); }
  }
  if (game.user.isGM && !game.settings.get("twod12", "weaponRoundApplied")) {
    try {
      const fix = items => items.filter(i => i.type === "action" && !i.system.frequency && i.system.traits?.has?.("weapon")).map(i => ({ _id: i.id, "system.frequency": "round" }));
      const world = fix([...game.items]);
      if (world.length) await Item.updateDocuments(world);
      for (const a of game.actors) { const u = fix([...a.items]); if (u.length) await a.updateEmbeddedDocuments("Item", u); }
      await game.settings.set("twod12", "weaponRoundApplied", true);
    } catch (e) { console.warn("twod12 | could not set the Round Frequency of Weapon Actions", e); }
  }
  if (game.user.isGM && !game.settings.get("twod12", "diagonalsApplied")) {
    try {
      if (game.settings.settings.has("core.gridDiagonals")) await game.settings.set("core", "gridDiagonals", CONST.GRID_DIAGONALS.ALTERNATING_1);
      await game.settings.set("twod12", "diagonalsApplied", true);
    } catch (err) { console.warn("twod12 | could not set the default grid diagonals", err); }
  }
  registerEffectHooks();
  registerCombatHooks();
  registerMovement();
  registerBasicHooks();
  registerCarousel();
  registerDragCopy();
  registerUsageHooks();
  registerDeadHooks();
  registerDamageReport();
  setupPanel();
});

// Scene controls: a button to build chat buttons.
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user.isGM) return;
  const tool = { name: "twod12-button", title: "Create Button", icon: "fa-solid fa-square-plus", button: true, order: 99, visible: true, onChange: () => openBuilder(), onClick: () => openBuilder() };
  const report = { name: "twod12-report", title: "Damage Report", icon: "fa-solid fa-chart-column", button: true, order: 100, visible: true, onChange: () => toggleDamageReport(), onClick: () => toggleDamageReport() };
  if (Array.isArray(controls)) controls.find(c => c.name === "token")?.tools.push(tool, report);
  else if (controls?.tokens?.tools) { controls.tokens.tools[tool.name] = tool; controls.tokens.tools[report.name] = report; }
});

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (!["character", "npc"].includes(actor.type)) return;
  // Level up: grant newly available class features (only on the client that made the change).
  if (userId === game.user.id && foundry.utils.hasProperty(changes, "system.level")) grantClassFeatures(actor);
  // Bloodied / Strained follow the damage thresholds.
  if (game.user.isActiveGM && foundry.utils.hasProperty(changes, "system.damage")) {
    actor.toggleStatusEffect("bloodied", { active: actor.system.bloodied });
    actor.toggleStatusEffect("strained", { active: actor.system.strained });
  }
});

// Removing a weapon or feature also removes the actions it granted.
Hooks.on("deleteItem", (item, options, userId) => {
  if (userId !== game.user.id || !item.parent) return;
  const key = item.type === "weapon" ? "weaponId" : (item.type === "feature" ? "featureId" : (item.type === "talent" ? "talentId" : null));
  if (!key) return;
  const ids = item.parent.items.filter(i => i.getFlag("twod12", key) === item.id).map(i => i.id);
  if (ids.length) item.parent.deleteEmbeddedDocuments("Item", ids);
});


/** An NPC that is Down with more Lethal damage is dead: the Dead condition, shown as an overlay on its token. If it is healed it is back. */
async function checkDead(actor) {
  if (!game.user.isActiveGM || actor?.type !== "npc") return;
  const s = actor.system;
  const dead = !!s.atZero && s.lethal > s.nonlethal;
  const has = actor.statuses?.has("dead");
  if (dead !== !!has) await actor.toggleStatusEffect("dead", { active: dead, overlay: dead });
}
function registerDeadHooks() {
  // A Down creature whose damage drops below its Health Pool is no longer Down and wakes up at once.
  Hooks.on("preUpdateActor", (actor, changes, options) => { options.twod12WasDown = !!actor.system?.atZero; options.twod12OldDamage = actor.system?.totalDamage ?? 0; });
  Hooks.on("updateActor", async (actor, changes, options) => {
    if (!game.user.isActiveGM || !options.twod12WasDown) return;
    // Back above zero: no longer Down, and an Unconscious creature wakes up.
    if (!actor.system?.atZero) {
      if (actor.statuses?.has("unconscious")) await actor.toggleStatusEffect("unconscious", { active: false });
      for (const s of ["desperate", "dying", "shattered"]) if (actor.statuses?.has(s)) await actor.toggleStatusEffect(s, { active: false });
      return;
    }
    // Going Down, Desperate, Dying and Shattered (the choices, the Tables and the Checks): down.mjs.
  });
  Hooks.on("updateActor", actor => checkDead(actor));
  Hooks.on("updateToken", token => { if (token.actor && !token.actorLink) checkDead(token.actor); });
}


// New characters are Friendly and linked to their token (with the vision of their Senses); new NPCs are Hostile.
Hooks.on("preCreateActor", actor => {
  if (actor.type === "character") { actor.updateSource({ "prototypeToken.disposition": 1, "prototypeToken.actorLink": true }); giveHearing(actor); giveVision(actor); }
  else if (actor.type === "npc") actor.updateSource({ "prototypeToken.disposition": -1 });
});

Hooks.once("ready", () => { try { registerLightLabel(); } catch (e) { console.warn("twod12 | light level label", e); } });

registerLightTool();   // the light level button of the lighting controls (before the controls are drawn)


// ---- World defaults (v0.0.164) ----
// Scenes are made with Global Illumination on, unless the scene's data says otherwise.
Hooks.on("preCreateScene", (scene, data) => {
  if (foundry.utils.getProperty(data, "environment.globalLight.enabled") === undefined) scene.updateSource({ "environment.globalLight.enabled": true });
});
Hooks.once("ready", async () => {
  if (!game.user.isActiveGM) return;
  // A new world gets one plain scene (no image), active, once: deleting it later doesn't bring it back.
  try {
    if (!game.settings.get("twod12", "defaultSceneMade")) {
      if (!game.scenes.size) await Scene.create({ name: "Default Scene", active: true, navigation: true });
      await game.settings.set("twod12", "defaultSceneMade", true);
    }
  } catch (e) { console.warn("twod12 | default scene", e); }
  // Quick Insert (recommended in system.json): switched on once per world when it is installed, with the modules it needs. Switching it off later is respected.
  try {
    if (game.settings.get("twod12", "quickInsertOffered")) return;
    const qi = game.modules.get("quick-insert");
    if (!qi) return;   // not installed: nothing to do (system.json recommends it)
    await game.settings.set("twod12", "quickInsertOffered", true);
    if (qi.active) return;
    const config = foundry.utils.deepClone(game.settings.get("core", "moduleConfiguration") ?? {});
    const needs = [...(qi.relationships?.requires ?? [])].map(r => r.id).filter(id => game.modules.get(id));
    for (const id of ["quick-insert", ...needs]) config[id] = true;
    await game.settings.set("core", "moduleConfiguration", config);
    ui.notifications.info("2d12: Quick Insert is now on for this world (Ctrl + Space). Reloading...");
    foundry.utils.debouncedReload();
  } catch (e) { console.warn("twod12 | Quick Insert", e); }
});
