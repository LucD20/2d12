import { registerAuraHooks } from "./aura.mjs";
import { registerHazardHooks, registerHazardBehavior } from "./hazard.mjs";
import { registerDownHooks } from "./down.mjs";
import { registerConditionRules } from "./conditions.mjs";   // v0.0.314 (pack AU): Frightened, Dazed, Bleed, Grabbed
import { registerZoneHooks } from "./zone.mjs";   // v0.0.261 (Consecrated Ground)
import { markHalfHint } from "./halfhint.mjs";   // v0.0.261 (Covering Shot)
import { rxRender, rxClick, registerReactionSettings, registerMomentHooks, closeStale } from "./moment.mjs";   // v0.0.272 (pack RX): the Reactions message
import { registerLeanHooks } from "./lean.mjs";
import { registerMasteryHooks } from "./mastery.mjs";
import { registerChatScroll } from "./chatscroll.mjs";   // v0.0.343
import { registerFearLine } from "./fearline.mjs";   // v0.0.345
import { renderFollow, renderDamageUsed, registerDamageUsed, addHealButton } from "./followup.mjs";
import { registerChecklist, startChecklist } from "./checklist.mjs";   // v0.0.425
import { registerZoneTip } from "./zonetip.mjs";   // v0.0.350   // v0.0.347
import { registerMarkHooks } from "./mark.mjs";
import { registerObjects } from "./objects.mjs";   // pack TALENTS-PT: a placed object's walls
import { registerLoE } from "./loe.mjs";
import { registerFlankOverlay } from "./flankoverlay.mjs";
import { registerRangeOverlay } from "./rangeoverlay.mjs";
import { solidTiles, tileConfigSolid } from "./corners.mjs";
import { registerLightRadius } from "./lightradius.mjs";
import { registerRegionSnap } from "./regionshape.mjs";
import { chatChips } from "./chatchips.mjs";
import { registerEscalationHooks, registerMomentumSetting, escalationAll } from "./escalation.mjs";
import { registerExplodingDice } from "./explode.mjs";   // v0.0.407 (Stage 0 in Foundry): the book's exploding dice
import { registerStateHooks } from "./states.mjs";
import { registerMigrationR, registerMigrationMod, registerMigrationS0, registerMigrationF2, registerMigrationF3, registerMigrationMastery, registerMigrationWeapons } from "./migrater.mjs";
import { registerMigrationFx } from "./fxmigrate.mjs";   // v0.0.323
import { registerInitiativeSettings, registerInitiativeSocket } from "./initwindow.mjs";
import { registerArmorHooks } from "./armor.mjs";
import { registerFloatText } from "./floattext.mjs";
import { registerEffectEditor } from "./fxeditor.mjs";
import { registerAppliedEditor } from "./fxapplied.mjs";
import { registerClock, moveClock } from "./clock.mjs";
import { registerSleep, bumpExhausted } from "./sleep.mjs";
import { registerLight } from "./light.mjs";
import { registerLightOverlay } from "./lightoverlay.mjs";
import { CharacterData, NpcData, SpeciesData, ClassData, FeatureData, ActionData, WeaponData, EffectData, TalentData, ArmorData, GearData } from "./data.mjs";
import { registerEffectHooks, setupPanel, wrapConditions, shadowedEffects, pendingSteps } from "./effects.mjs";
import { registerTurnDock } from "./turndock.mjs";   // v0.0.362: the Turn Breakdown dock
import { registerHealthBar } from "./healthbar.mjs";
import * as CC from "./chatcards.mjs";   // v0.0.283 (pack chat-cards)
import { registerInline, handleInline, saveRoll, retargetSave, registerInlineSocket } from "./inline.mjs";
import { openBuilder } from "./builder.mjs";
import { CharacterSheet, NpcSheet, TwoD12ItemSheet, registerSheetHooks } from "./sheets.mjs";
import { registerHandSetting } from "./hands.mjs";
import { grantClassFeatures } from "./grants.mjs";
import { classLevelChange } from "./classwindow.mjs";
import { rollDamage, retargetAction } from "./actions.mjs";
import { damageButton, registerSocket } from "./damage.mjs";
import { TWOD12 } from "./config.mjs";
import { TwoD12Combat, registerCombatHooks } from "./combat.mjs";
import { registerMovement, endMovement, evadeAsAdvance, clearLooseMove, rulerInfo } from "./move.mjs";
import { registerBasicHooks, refreshAllBasics } from "./basic.mjs";
import { catalog } from "./catalog.mjs";
import { registerSenses, giveHearing, addHearing, hearingOnPrepare } from "./senses.mjs";
import { withMode } from "./modes.mjs";
import { giveVision, syncVision, globalLight, visionInfo } from "./vision.mjs";
import { lightInfo } from "./sightgate.mjs";
import { hearInfo } from "./senses.mjs";   // v0.0.317: why a token hears (or not)
import { registerLightLabel, registerLightTool, sliderInfo } from "./lightlabel.mjs";
import { registerDamageReport, toggleDamageReport } from "./damagelog.mjs";
import { registerEncounterLog, toggleEncounterLog } from "./enclog.mjs";
import { updateUseButtons, useGrant, registerGrantCardHooks } from "./freeuse.mjs";
import { registerVersionTabs } from "./preview.mjs";
import { registerCarousel, renderCarousel } from "./carousel.mjs";
import { bindInitCard } from "./initcard.mjs";
import { registerRefresh, refreshFromCompendium, askRefresh } from "./refresh.mjs";
import { GROUPS } from "./config.mjs";
import { registerDragCopy } from "./drag.mjs";
import { registerTheme } from "./theme.mjs";
import { frameMessage } from "./chatframe.mjs";
import * as HUD from "./hud.mjs";

Hooks.once("init", () => {
  try { registerExplodingDice(); } catch (e) { console.warn("twod12 | exploding dice", e); }   // v0.0.407: a die written with ! (explode.mjs)
  try { registerTheme(); } catch (e) { console.warn("twod12 | theme", e); }
  try { HUD.registerHudSettings(); HUD.registerHud(); globalThis.__twod12Hud = HUD; } catch (e) { console.warn("twod12 | HUD", e); }   // v0.0.376 (STYLE-2): the HUD   // v0.0.369 (STYLE-1): dark (the default) or light, on <html>
  registerReactionSettings();   // v0.0.272 (pack RX): the Reactions message's auto-skip timer
  // v0.0.202 (Lucas): tooltips wait a little longer before they show (Foundry's own wait is 0.5 s); a client setting.
  const tipDelay = v => { const TM = foundry.helpers?.interaction?.TooltipManager ?? globalThis.TooltipManager; if (TM) TM.TOOLTIP_ACTIVATION_MS = Math.max(0, Number(v) || 0); };
  game.settings.register("twod12", "tooltipDelay", { name: "Tooltip delay (ms)", hint: "How long the pointer rests on something before its tooltip shows. Foundry's own is 500.", scope: "client", config: true, type: Number, default: 900, range: { min: 0, max: 3000, step: 100 }, onChange: tipDelay });
  tipDelay(game.settings.get("twod12", "tooltipDelay"));
  registerSenses();
  try { hearingOnPrepare(); } catch (e) { console.warn("twod12 | Hearing on every token", e); }   // v0.0.319: every token hears (in memory)
  registerSleep();
  registerClock();
  registerEffectEditor();
  registerAppliedEditor();
  registerArmorHooks();
  registerEscalationHooks();
  registerMomentumSetting();   // v0.0.243 (pack R)
  registerStateHooks();   // v0.0.243: Bloodied / Strained announced, the Escalation hooks
  registerInitiativeSettings();   // v0.0.310: Initiative opens for the players; NPCs in the players' window
  registerMigrationMod(); registerMigrationFx(); registerMigrationS0(); registerMigrationF2(); registerMigrationF3(); registerMigrationMastery(); registerMigrationWeapons(); import("./hooks.mjs").then(m => m.registerStrikeState()).catch(e => console.warn("twod12 | strike state", e));   // v0.0.411: Shifting Aim   // v0.0.407: Stage 0 (after pack R); v0.0.409: the Paladin (after Stage 0)   // v0.0.305 (pack MOD): each character keeps the order of its Modifiers, once (before the R migration may refresh the classes)
  registerMigrationR();   // v0.0.243: existing characters brought to pack R, once, by the GM
  registerAuraHooks();
  registerHazardHooks();
  registerDownHooks();
  registerZoneHooks();
  import("./areafx.mjs").then(m => m.registerAreaHooks()).catch(e => console.warn("twod12 | area hooks", e));   // v0.0.327 (PACK ZONE)
  registerLeanHooks();
  registerMasteryHooks();
  registerChatScroll();   // v0.0.343: the chat stays at its bottom when a card grows
  registerFearLine();   // v0.0.345: a selected Frightened creature shows its source on the map
  registerDamageUsed();   // v0.0.347
  registerZoneTip();   // v0.0.350: hovering a placed area shows what it does
  try { registerChecklist(); } catch (e) { console.warn("twod12 | test checklist", e); }   // v0.0.425: the Test checklist (GM, a world setting)
  registerMarkHooks();
  registerObjects();
  registerLoE();   // Line of Effect, Cover height and Show flanking in the token controls (v0.0.165; moved from the token HUD in v0.0.302)
  registerFlankOverlay();   // v0.0.302
  registerRangeOverlay();
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
  registerRefresh();
  // v0.0.196 (Lucas): Evade from the keyboard (Shift+E by default; Configure Controls can change it): Evade 1 AP with the selected token.
  game.keybindings.register("twod12", "quickEvade", { name: "Evade", hint: "Uses Evade with your selected token: choose 1 AP (Evade 1) or 2 AP (half your Speed); its movement starts at once.", editable: [{ key: "KeyE", modifiers: ["Shift"] }],
    onDown: () => { import("./actions.mjs").then(m => m.quickBasic("safeMovement")); return true; } });
  // v0.0.221 (Lucas, pack K): shortcuts for common Actions of the selected token, and End turn. Configure Controls can change them.
  const quick = (key, name, hint, code) => game.keybindings.register("twod12", key, { name, hint, editable: [{ key: code, modifiers: ["Shift"] }], onDown: () => { import("./actions.mjs").then(m => m.quickBasic(key === "quickAttack" ? "basicWeaponAttack" : key === "quickRally" ? "rally" : "advance")); return true; } });
  quick("quickAdvance", "Advance", "Uses Advance with your selected token: its movement starts at once.", "KeyA");
  quick("quickAttack", "Weapon Attack", "Uses Weapon Attack with your selected token (an NPC: its Basic attack).", "KeyW");
  quick("quickRally", "Steel Yourself", "Uses Steel Yourself with your selected token (choose its version).", "KeyR");
  game.keybindings.register("twod12", "quickEndTurn", { name: "End turn", hint: "Ends the current turn when it is yours (the combat strip's Next turn).", editable: [{ key: "KeyQ", modifiers: ["Shift"] }],
    onDown: () => {
      const cb = game.combat;
      if (!cb?.started) { ui.notifications.warn("No combat has started."); return true; }
      if (!game.user.isGM && !cb.combatant?.isOwner) { ui.notifications.warn("It is not your turn."); return true; }
      import("./combat.mjs").then(m => m.endTurnFor(cb));
      return true;
    } });
  for (let n = 1; n <= 9; n++) game.keybindings.register("twod12", `favorite${n}`, { name: `Favorite ${n}`, hint: `Uses Favorite ${n} of your selected token (the Favorites' order on its sheet).`, editable: [{ key: `Digit${n}`, modifiers: ["Alt"] }],
    onDown: () => { import("./actions.mjs").then(m => m.quickFavorite(n)); return true; } });
  // v0.0.215 (Lucas, playtest 2): the two buttons (the token controls since v0.0.302) as shortcuts, for speed in play.
  game.keybindings.register("twod12", "lineOfEffect", { name: "Line of Effect", hint: "Shows or hides the Line of Effect lines of your selected token (the token controls' button; v0.0.302).", editable: [{ key: "KeyL", modifiers: ["Shift"] }],
    onDown: () => { import("./loe.mjs").then(m => m.loeShortcut()); return true; } });
  game.keybindings.register("twod12", "coverHeight", { name: "Cover height calculation", hint: "Opens the side view of your selected token and its first target (the token controls' button; v0.0.302).", editable: [{ key: "KeyH", modifiers: ["Shift"] }],
    onDown: () => { import("./loe.mjs").then(m => m.heightShortcut()); return true; } });
  CONFIG.Combat.documentClass = TwoD12Combat;
  game.twod12 = {
    dockInfo: () => import("./turndock.mjs").then(m => m.dockInfo()),   // v0.0.363: where the Turn Breakdown and its button went
    catalog,
    addHearing,
    syncVision,
    globalLight,
    visionInfo,
    lightInfo, hearInfo,
    sliderInfo,
    refreshBasics: refreshAllBasics,
    fixRulesV346: () => import("./fixrules.mjs").then(m => m.fixRulesV346()),
    fixZonesV351: () => import("./fixrules.mjs").then(m => m.fixZonesV351()),   // v0.0.351   // v0.0.346: old copies of Frightened / Marked Quarry
    refreshFromCompendium: (opts = {}) => (Object.keys(opts).length ? refreshFromCompendium(opts) : askRefresh()),   // v0.0.190: a macro can call it
    escalation: (delta = 1, actors = null) => escalationAll(delta, actors),
    migrateMod: () => import("./migrater.mjs").then(m => m.migrateMod()),
    migrateEffects: (o = {}) => import("./fxmigrate.mjs").then(m => m.migrateEffects(o)),   // v0.0.323 (PACK EFFECT-SHEET): store the effects' rules (write: false only reports)   // v0.0.305: the pack MOD migration again
    migrateS0: () => import("./migrater.mjs").then(m => m.migrateS0()),   // v0.0.407: the Stage 0 migration again
    migrateF2: () => import("./migrater.mjs").then(m => m.migrateF2()),   // v0.0.409: the Paladin migration again
    migrateF3: () => import("./migrater.mjs").then(m => m.migrateF3()),
    migrateWeapons: () => import("./migrater.mjs").then(m => m.migrateWeapons()),   // v0.0.412: the old bows and swords to the book's   // v0.0.411: the Archer migration again
    migrateR: () => import("./migrater.mjs").then(m => m.migrateR()),   // v0.0.243: the pack R migration again (Health line, Escalation 1, the cards refreshed)   // v0.0.243: the GM's valve: every PC in the combat +1 Escalation (or the given creatures)
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
  game.settings.register("twod12", "regionSnapCorners", { name: "Regions snap to whole squares", hint: "A Region drawn by hand is put on whole squares when it is created: a circle becomes the 2d12 area of its size (an Emanation on a square, a Burst on a corner; draw 2 for a 2 Emanation), a rectangle or a polygon snaps its corners to the grid.", scope: "world", config: true, type: Boolean, default: true });
  game.settings.register("twod12", "showOdds", { scope: "client", config: false, type: Boolean, default: false });   // v0.0.283: replaced by Designer mode (kept so old worlds read it)
  // v0.0.283 (pack chat-cards, brief section 5): the chat message settings of the new cards
  game.settings.register("twod12", "designerMode", { name: "Designer mode", hint: "For designing and testing: cards show the odds of each Tier, the Ruler line and the automation mark (Mithril), and damage messages the average and the chance of that total. Off: none of these appear in the chat.", scope: "client", config: true, type: Boolean, default: false });
  game.settings.register("twod12", "hideEnemyDefenses", { name: "Hide enemy Defenses from players", hint: "Players see the Tier of their rolls but not the Defense numbers: the ladder reads Tier 1 / Tier 2 / Tier 3, the arrow sits in the middle of its Tier, no Critical threshold. The GM always sees everything.", scope: "world", config: true, type: Boolean, default: false });
  // v0.0.293 (Lucas): the roll dialog's average damage and chance of each Tier, under each Tier
  game.settings.register("twod12", "rollDialogStats", { name: "Roll dialog: averages and chances", hint: "Under each Tier of the roll dialog: the average damage (with every bonus and penalty that is on) and each target's chance of that Tier. Everyone, the GM only, or no one. With \"Hide enemy Defenses\" on, players see the averages but not the chances.", scope: "world", config: true, type: String, choices: { all: "Everyone", gm: "GM only", none: "Hidden" }, default: "all" });
  game.settings.register("twod12", "hideTargetDetails", { name: "Hide target details from players", hint: "On damage messages, players see only each target's name and whether it was applied (no Weak, Resist, Immune, Guard or what it took). Bloodied and Strained stay visible: they are public.", scope: "world", config: true, type: Boolean, default: false });
  game.settings.register("twod12", "highlightTraits", { name: "Highlight traits and damage types in rules text", hint: "The book's text colors on cards (Attributes, Modifiers, Banes and Boons, Rally Points, costs, movement, damage), a light background behind trait names (Strike, Divine...) and colored damage types (Cold, Holy...).", scope: "client", config: true, type: Boolean, default: true });
  CONFIG.Actor.dataModels = { character: CharacterData, npc: NpcData };
  CONFIG.Item.dataModels = { species: SpeciesData, class: ClassData, feature: FeatureData, action: ActionData, weapon: WeaponData, armor: ArmorData, gear: GearData, effect: EffectData, talent: TalentData };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, "twod12", CharacterSheet, { types: ["character"], makeDefault: true, label: "2d12 Sheet" });
  DocumentSheetConfig.registerSheet(Actor, "twod12", NpcSheet, { types: ["npc"], makeDefault: true, label: "2d12 NPC Sheet" });
  // v0.0.441 (pack SHEETS-HUD): the one-page NPC sheet (v0.0.375) and its world setting "New NPCs open with" are retired: the small NPC sheet
  // replaces it. An NPC still set to it opens the NPC sheet (the GM's client clears the flag once, at ready).
  Hooks.once("ready", async () => {
    if (!game.user?.isGM) return;
    for (const a of game.actors?.contents ?? []) {
      if (a.getFlag?.("core", "sheetClass") !== "twod12.NpcStatBlockSheet") continue;
      try { await a.unsetFlag("core", "sheetClass"); } catch (e) { console.warn("twod12 | the retired one-page sheet", a.name, e); }
    }
  });
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
  game.settings.register("twod12", "unlockPacks", { name: "Unlock the system compendiums", hint: "Keep the 2d12 compendiums unlocked, so their items can be opened and edited without unlocking them first (only the GM and Assistants can edit; a system update rebuilds them, so edits there are lost).", scope: "world", config: true, type: Boolean, default: true, onChange: () => import("./basic.mjs").then(m => m.unlockSystemPacks()) });   // v0.0.191
  game.settings.register("twod12", "worldPassV351", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.351: Zones' second carried Effect
  game.settings.register("twod12", "worldPassV346", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.346: bars, Frightened, Marked Quarry
  game.settings.register("twod12", "worldPassDaunted", { scope: "world", config: false, type: Boolean, default: false });   // the core rework E1
  game.settings.register("twod12", "hearingAllV319", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.318/319: Hearing on every creature's token, once
  game.settings.register("twod12", "tokenDefaultsV215", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.215: core token rotation off, once
  game.settings.register("twod12", "settingsV207", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.207: the editability sweep's settings and fields (automation.mjs)
  game.settings.register("twod12", "settingsV187", { scope: "world", config: false, type: Boolean, default: false });   // Killer's Focus and Radiant Zeal: an Effect each turn
  game.settings.register("twod12", "settingsV186", { scope: "world", config: false, type: Boolean, default: false });   // the cards automated by name get their settings (automation.mjs)
  game.settings.register("twod12", "rallyV176", { scope: "world", config: false, type: Boolean, default: false });   // the Paladin's and Archer's Rally values updated once
  game.settings.register("twod12", "releaseV118", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.361 (PACK PERF, D37): Release at 0 AP, once per world
  game.settings.register("twod12", "worthFor", { scope: "world", config: false, type: String, default: "" });   // v0.0.361 (D37): the worth lines, once per system version

  // Initiative is an Attribute Check rolled by TwoD12Combat#rollInitiative; this formula is only a fallback.
  CONFIG.Combat.initiative = { formula: "1d12 + @attributes.instinct", decimals: 0 };

  const STATUS_NAME = { bleed: "Lingering" };   // v0.0.414 (book, Chapter 8): a status whose name isn't its id
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
    ["empowered", "icons/svg/upgrade.svg"],   // v0.0.407: no value; Enfeebled is gone (book, Chapter 8)
    ["exhausted", "icons/svg/sleep.svg"],
    ["imperiled", "icons/svg/hazard.svg"],
    ["squeezing", "icons/svg/net.svg"],
    ["slowed", "icons/svg/stoned.svg"],
    ["quickened", "icons/svg/lightning.svg"],
    // v0.0.314 (pack AU, the conditions as items): the conditions pass's eight (book, Chapter 8); the HUD applies their Effect items (wrapConditions)
    ["bleed", "icons/svg/blood.svg"],   // v0.0.414: named Lingering (the book's word; the id stays bleed: no migration)
    ["blinded", "icons/svg/blind.svg"],
    ["half-blinded", "icons/svg/blind.svg"],
    ["called-out", "icons/svg/eye.svg"],   // v0.0.411 (pack F3, Spotter): its enemies perceive it one step better   // v0.0.409 (pack F2, Glare; book, Chapter 8): its Sight perceives no creature better than Obscured
    ["dazed", "icons/svg/daze.svg"],
    ["pressed", "icons/svg/sword.svg"],   // v0.0.412 (Thwart Cut)
    ["daunted", "icons/svg/terror.svg"],   // the core rework E1 (Lucas, 2026-11-21): Frightened is Daunted (fixrules.mjs migrates the world)
    ["grabbed", "icons/svg/padlock.svg"],
    ["sickened", "icons/svg/poison.svg"],
    ["staggered", "icons/svg/paralysis.svg"],
    ["taunted", "icons/svg/target.svg"],
    ["dead", "icons/svg/skull.svg"]
  ].map(([id, img]) => ({ id, name: STATUS_NAME[id] ?? id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("-"), img }));
  // v0.0.314: Blinded took Foundry's blind status; v0.0.316 (Lucas: the Hearing ripple went with it): it is the system's own status, and the sight
  // gate (sightgate.mjs) and the Senses (senses.mjs perceive) read it, so only Sight is gone
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
// v0.0.358 (Lucas: "just the message by itself; no title, no time, no trash bin"): a message that is only one of the system's lines shows no header
// (the right-click menu still deletes it)
Hooks.on("renderChatMessageHTML", (msg, html) => { try { const el = html?.[0] ?? html, c = el?.querySelector?.(".message-content"); if (c && c.children.length === 1 && (c.firstElementChild.classList.contains("sysline") || c.firstElementChild.classList.contains("turnend")) && !c.textContent.replace(c.firstElementChild.textContent, "").trim()) el.classList.add("twod12-bare"); } catch (e) { /* cosmetic */ } });
// v0.0.283 (pack chat-cards): the new cards are drawn for each viewer from their model (chatcards.mjs); Designer mode's marks on the older cards
function ccRender(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  if (!el) return;
  let designer = false, hideDef = false, hideTgt = false;
  try { designer = game.settings.get("twod12", "designerMode") === true; hideDef = game.settings.get("twod12", "hideEnemyDefenses") === true; hideTgt = game.settings.get("twod12", "hideTargetDetails") === true; } catch (e) { /* not registered yet */ }
  if (!designer) el.querySelectorAll(".twod12.chat .autodia, .twod12.chat .ac-worth").forEach(x => x.remove());
  const m = msg.getFlag?.("twod12", "cc"), card = el.querySelector(".cc-card");
  if (!m || !card) return;
  const owns = uuid => { try { const d = fromUuidSync(uuid); const a = d?.documentName === "Actor" ? d : d?.actor; return !!a?.isOwner; } catch (e) { return game.user.isGM; } };
  const view = CC.viewOf({ gm: game.user.isGM, hideDef, hideTgt, designer, author: msg.isAuthor, owns });
  const tmp = document.createElement("div");
  tmp.innerHTML = CC.renderCard(msg.getFlag("twod12", "ccApplied") ? { ...m, locked: true } : m, view);
  if (tmp.firstElementChild) card.replaceWith(tmp.firstElementChild);
  // v0.0.294 (brief section 13): the granted uses' rows (appended after the card by freeuse.mjs) go into the non-roll card's slot, before the Flavor
  const slot = el.querySelector(".cc-card .cc-slot");
  if (slot) el.querySelectorAll(".twod12.chat.cc > .tline.grantrow").forEach(r => slot.append(r));
}
Hooks.on("renderChatMessageHTML", ccRender);
// v0.0.388 (pack ONE): the damage is written into its attack card and the Damage button goes; the GM rolls it again from the message's menu
// (only while no row is applied: undo first). V13 and V14 call the hook getChatMessageContextOptions (V12: getChatLogEntryContext).
const rollAgainItem = () => ({
  name: "Roll the damage again", icon: '<i class="fa-solid fa-dice"></i>',
  condition: li => { const m = game.messages.get((li?.dataset ?? li?.[0]?.dataset)?.messageId); const d = m?.getFlag("twod12", "ccDmg"); return game.user.isGM && !!m?.getFlag("twod12", "action") && !!m?.getFlag("twod12", "cc")?.dmg && !(d?.rows ?? []).some(r => r.applied); },
  callback: li => { const m = game.messages.get((li?.dataset ?? li?.[0]?.dataset)?.messageId); if (m) rollDamage(m, { again: true }); }
});
Hooks.on("getChatMessageContextOptions", (_app, items) => { try { items.push(rollAgainItem()); } catch (e) { console.warn("twod12 | roll again", e); } });
Hooks.on("getChatLogEntryContext", (_app, items) => { try { items.push(rollAgainItem()); } catch (e) { console.warn("twod12 | roll again", e); } });
// v0.0.249 (Lucas): a rung Passive's effect comes as soon as the Escalation reaches its rung (the encounter's start, a Critical, the hook, the GM's valve)
Hooks.on("twod12.escalationChanged", async actor => { if (!game.user.isActiveGM) return; try { const { applyReachedEffects } = await import("./automation.mjs"); await applyReachedEffects(actor); } catch (e) { console.warn("twod12 | the rung's effects", e); } });
Hooks.on("renderChatMessageHTML", (msg, html) => { import("./startstack.mjs").then(m => m.bindStartStack(msg, html)).catch(() => {}); });   // v0.0.345: the start-of-the-encounter stack
Hooks.on("renderChatMessageHTML", (msg, html) => { try { renderFollow(msg, html); renderDamageUsed(msg, html); addHealButton(msg, html); } catch (e) { console.warn("twod12 | follow-ups", e); } });   // v0.0.347: follow-ups inside their card; the Damage button used
Hooks.on("renderChatMessageHTML", bindInitCard);   // v0.0.206: the Initiative card's rows open on click
Hooks.on("renderChatMessageHTML", chatChips);   // v0.0.180: no line between trait groups at the start or end of a wrapped row
// v0.0.177: a light of size N reaches an N Emanation (the half square Foundry leaves out is added), and Regions snap to whole squares.
Hooks.once("setup", () => { try { registerLightRadius(); } catch (e) { console.warn("twod12 | light radius", e); } });
registerRegionSnap();   // v0.0.178: a Region drawn by hand is snapped to whole squares when it is created (a circle becomes the area of its size)
// Corners (v0.0.170): a "Solid" checkbox in the Tile settings (a solid Tile blocks the corners it covers).
Hooks.on("renderTileConfig", (app, html) => { try { tileConfigSolid(app, html); } catch (e) { console.warn("twod12 | Tile settings", e); } });
Hooks.on("renderChatMessageHTML", updateUseButtons);
Hooks.on("renderChatMessageHTML", markHalfHint);
Hooks.on("renderChatMessageHTML", frameMessage);   // v0.0.372 (Lucas: B): no Foundry box; the name, time and trash in the card (last, after the cards are drawn)
Hooks.on("renderChatMessageHTML", rxRender);   // v0.0.272: Use / Pass for the row's owner, Skip all others for the GM, the timer
Hooks.once("ready", registerVersionTabs);
Hooks.once("ready", () => { startChecklist().catch(e => console.warn("twod12 | test checklist", e)); });   // v0.0.425: the Test checklist's bar (GM, when its setting is on)
// v0.0.361 (PACK PERF, D36): the same four on the old renderChatMessage hook are gone (the system is V14 only: if it still fired, they ran
// twice per message and the Reactions card bound its listeners twice)

// "Roll Damage" buttons on action cards (delegated so it works regardless of chat re-rendering).
Hooks.once("ready", () => { try { registerInitiativeSocket(); } catch (e) { console.warn("twod12 | initiative socket", e); } });   // v0.0.310: the players' Initiative windows
/** v0.0.418: the chips whose name opens the item they name (a left click on the name); the others are used wherever they are clicked.
 *  v0.0.440 (Lucas, checklist: "left-click or right-click Grabbed opened the book page"): a condition is applied wherever it is clicked; a
 *  right-click opens its rule. */
const NAMES_ITEM = new Set(["Effect", "Use"]);
Hooks.once("ready", async () => {
  // v0.0.418 (playtest 5, C12): a right-click on a chip opens its rule (a movement, Heal, Guard...) or the item it names
  // v0.0.421 (the audit): caught on the way down and stopped, so Foundry's own chat-message menu (or a sheet row's) doesn't open over the rule
  // v0.0.454 (Lucas, playtest 6, D2: "Rightclick on apply"): a right-click on a damage row's Apply (or Undo, once applied) opens a small menu,
  // Apply full / half / double, inside the card so its buttons go through the click handler below (ccApply / ccAdjust with their factor)
  document.addEventListener("contextmenu", ev => {
    const b = ev.target.closest?.("[data-ctx][data-row]");
    if (!b || !b.closest(".cc-card")) return;
    ev.preventDefault(); ev.stopPropagation();
    document.querySelectorAll(".cc-ctxmenu").forEach(x => x.remove());
    const kind = b.dataset.ctx === "adjust" ? "ccAdjust" : "ccApply", row = b.dataset.row;
    const menu = document.createElement("div");
    menu.className = "cc-ctxmenu"; menu.setAttribute("role", "menu");
    menu.innerHTML = [["1", "Apply full"], ["0.5", "Apply half", "rounded up"], ["2", "Apply double"]].map(([f, l, note]) => `<button type="button" role="menuitem" data-twod12="${kind}" data-row="${row}" data-factor="${f}">${l}${note ? ` <small>${note}</small>` : ""}</button>`).join("");
    // v0.0.460 (Lucas, checklist v0.0.459: "opens ... all the way down and cant be clicked, since its covered by the chat"): the menu floats over
    // the page at the button (above it when there is no room below); it carries the message's id so its buttons still reach the click handler
    menu.dataset.messageId = b.closest("[data-message-id]")?.dataset.messageId ?? "";
    menu.classList.add("floating");
    document.body.append(menu);
    menu.addEventListener("click", () => setTimeout(() => menu.remove(), 0));   // a pick closes it (the click handler below has read it)
    const r = b.getBoundingClientRect(), mh = menu.offsetHeight, mw = menu.offsetWidth;
    const below = r.bottom + 2 + mh <= window.innerHeight - 8;
    menu.style.top = `${Math.round(below ? r.bottom + 2 : Math.max(8, r.top - 2 - mh))}px`;
    menu.style.left = `${Math.round(Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8)))}px`;
    setTimeout(() => document.addEventListener("pointerdown", function away(e) { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener("pointerdown", away, true); } }, true), 0);
  }, true);
  document.addEventListener("contextmenu", async ev => {
    const inl = ev.target.closest?.("[data-twod12-inline]");
    if (!inl || ["Book", "Pause"].includes(inl.dataset.twod12Inline)) return;
    ev.preventDefault(); ev.stopPropagation();
    try { const { openChip } = await import("./inline.mjs"); await openChip(inl.dataset.twod12Inline, JSON.parse(inl.dataset.cfg), { message: game.messages.get(inl.closest("[data-message-id]")?.dataset.messageId) ?? null }); } catch (err) { console.warn("twod12 | chip's rule", err); }
  }, true);
  // v0.0.418 (playtest 5, G1: "it couldn't be dragged from the chat to the token"): a condition or effect chip dragged onto a token applies to it
  document.addEventListener("dragstart", ev => {
    const inl = ev.target.closest?.("[data-twod12-inline]");
    if (!inl || !["Condition", "Effect"].includes(inl.dataset.twod12Inline)) return;
    if (!inl.closest?.(".chat-message, .message, #chat-log")) return;   // v0.0.421 (the audit): from the chat only (a sheet row keeps its own drag)
    try { ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "twod12Chip", kind: inl.dataset.twod12Inline, cfg: JSON.parse(inl.dataset.cfg), messageId: inl.closest("[data-message-id]")?.dataset.messageId ?? "" })); } catch (err) { /* no data */ }
  });
  Hooks.on("dropCanvasData", (cv, data) => {
    if (data?.type !== "twod12Chip") return;
    const hits = canvas.tokens.placeables.filter(t => t.visible && t.actor && t.bounds.contains(data.x, data.y)), token = hits[hits.length - 1];
    if (!token) { ui.notifications.warn("Drop it on a token."); return false; }
    import("./inline.mjs").then(m => m.dropChip(data.kind, data.cfg, token.document, game.messages.get(data.messageId) ?? null)).catch(err => console.warn("twod12 | a dropped chip", err));
    return false;
  });
  document.addEventListener("click", async ev => {
    const inl = ev.target.closest?.("[data-twod12-inline]");
    // v0.0.462 (Lucas, checklist v0.0.459, pushed-button: "Button is not clickable in the chat card"): a diagnostic: a click on a card's Tier line
    // or rider that holds no button says so in the console, with what is there
    if (!inl) { const rd = ev.target.closest?.(".cc-rider, .cc-srow, .cc-tier, .cc-out"); if (rd && /Pushed|Pulled|Slid|Reposition/.test(rd.textContent ?? "")) console.warn(`twod12 | pushed-button diagnostic: a click on "${(rd.textContent ?? "").trim().slice(0, 80)}" found no button; its HTML:`, rd.innerHTML.slice(0, 400)); }
    if (inl) {
      ev.preventDefault();
      // v0.0.352 (Lucas, Step 6): the icon uses the chip, the name opens what it names. v0.0.418 (Lucas, playtest 5, C12: "Clicking Heal ... is
      // just opening the Rally Points book entry"): only a chip that names an item opens it on its name (a condition, an effect, an Action to
      // use); every other chip (Heal, Rally, Guard, a movement, Damage...) is used wherever it is clicked; a right-click opens its rule or item
      if (NAMES_ITEM.has(inl.dataset.twod12Inline) && !ev.target.closest?.("i, img, svg, .ti-use")) {
        try { const { openChip } = await import("./inline.mjs"); if (await openChip(inl.dataset.twod12Inline, JSON.parse(inl.dataset.cfg), { message: game.messages.get(inl.closest("[data-message-id]")?.dataset.messageId) ?? null })) return; } catch (err) { console.warn("twod12 | chip name", err); }
      }
      try { await handleInline(inl.dataset.twod12Inline, JSON.parse(inl.dataset.cfg), { message: game.messages.get(inl.closest("[data-message-id]")?.dataset.messageId) ?? null }); } catch (err) { console.error("twod12 | inline roll failed", err); }
      return;
    }
    // v0.0.283: a new card's ladder, result row and pool lines open their breakdown (a class: chat content drops the hidden attribute)
    const tg = ev.target.closest?.("[data-cc-toggle], [data-cc-more]");
    if (tg) {
      ev.preventDefault();
      const card = tg.closest(".cc-card"), id = tg.dataset.ccToggle;
      const panel = id !== undefined ? card?.querySelector(`[data-cc-panel="${CSS.escape(id)}"]`) : tg.closest(".cc-trow")?.querySelector(".cc-adjrow");
      const open = !panel?.classList.contains("open");
      panel?.classList.toggle("open", open); tg.setAttribute("aria-expanded", String(open));
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
    else if (b.dataset.twod12 === "useGrant") await useGrant(msg, b.dataset.effectId, Number(b.dataset.index) || 0, b.dataset.target ?? "");
    else if (b.dataset.twod12 === "cancelGrant") await (await import("./freeuse.mjs")).cancelGrant(msg, b.dataset.effectId);   // v0.0.351   // v0.0.260: a granted use from the card
    else if (b.dataset.twod12 === "rollDamage") await rollDamage(msg);
    else if (/^cc(Apply|ApplyAll|Undo|Adjust|DmgTarget)$/.test(b.dataset.twod12)) await (await import("./ccdamage.mjs")).ccDamageClick(b.dataset.twod12, b, msg);   // v0.0.283
    else if (b.dataset.twod12 === "ccCard") await (await import("./ccdamage.mjs")).openCardWindow(msg);
    else if (b.dataset.twod12 === "zoneEnd") await (await import("./areafx.mjs")).zoneEndClick(b);   // v0.0.327: a Zone's "Someone uses an Action"
    else if (b.dataset.twod12 === "fxEnd") { const fx = await fromUuid(b.dataset.fx); if (!fx) ui.notifications.info("It has already ended."); else if (fx.isOwner) await fx.delete(); else ui.notifications.warn("Only its owner or the GM can end it."); }   // v0.0.323: Ends, a Save
    else if (b.dataset.twod12 === "ccOpenSrc") (await import("./ccdamage.mjs")).openSource(msg);
    else if (b.dataset.twod12 === "ccSaveDamage") await (await import("./inline.mjs")).saveDamage(msg);
    else if (/^rx[A-Z]/.test(b.dataset.twod12)) await rxClick(msg, b, ev);   // v0.0.272: the Reactions message (v0.0.273: its order, clock, Resolve, Move back, the Action's sheet)
    else if (b.dataset.twod12 === "applyAfter") { const { applyAfter } = await import("./actions.mjs"); await applyAfter(msg, b.dataset.side ?? "", Number(b.dataset.step) || 0); }   // v0.0.250; v0.0.254: the step
    else await damageButton(b.dataset.twod12, b, msg);
  });
  registerSocket();
  registerInlineSocket();
  try { (await import("./ccdamage.mjs")).registerCcSocket(); } catch (e) { console.warn("twod12 | chat cards socket", e); }
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
  try { registerTurnDock({ pendingSteps }); } catch (e) { console.warn("twod12 | Turn Breakdown", e); }
  registerConditionRules();
  registerCombatHooks();
  registerMovement();
  registerBasicHooks();
  registerCarousel();
  registerDragCopy();
  registerGrantCardHooks();
  import("./noroll.mjs").then(m => m.registerNoRollHooks()).catch(e => console.warn("twod12 | non-roll cards", e));   // v0.0.294
  registerMomentHooks();   // v0.0.272 (pack RX): the movement moments
  closeStale().catch(e => console.warn("twod12 | Reactions", e));
  registerDeadHooks();
  registerDamageReport();
  registerEncounterLog();   // v0.0.223
  setupPanel();
});

// Scene controls: a button to build chat buttons.
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user.isGM) return;
  const tool = { name: "twod12-button", title: "Create Button", icon: "fa-solid fa-square-plus", button: true, order: 99, visible: true, onChange: () => openBuilder(), onClick: () => openBuilder() };
  const report = { name: "twod12-report", title: "Damage Report", icon: "fa-solid fa-chart-column", button: true, order: 100, visible: true, onChange: () => toggleDamageReport(), onClick: () => toggleDamageReport() };
  const enclog = { name: "twod12-enclog", title: "Encounter Log", icon: "fa-solid fa-book-open", button: true, order: 101, visible: true, onChange: () => toggleEncounterLog(), onClick: () => toggleEncounterLog() };   // v0.0.223
  if (Array.isArray(controls)) controls.find(c => c.name === "token")?.tools.push(tool, report, enclog);
  else if (controls?.tokens?.tools) { controls.tokens.tools[tool.name] = tool; controls.tokens.tools[report.name] = report; controls.tokens.tools[enclog.name] = enclog; }
});

// v0.0.185: the Level before a change, for the class window (each new level in turn; a lower Level removes what the higher levels gave).
Hooks.on("preUpdateActor", (actor, changes, options) => { if (foundry.utils.hasProperty(changes, "system.level")) options.twod12FromLevel = actor.system.level; });
Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (!["character", "npc"].includes(actor.type)) return;
  // Level up: the class window for a class with levels, else grant newly available class features (only on the client that made the change).
  if (userId === game.user.id && foundry.utils.hasProperty(changes, "system.level") && options.twod12Class !== "skip")
    classLevelChange(actor, options.twod12FromLevel, actor.system.level).then(done => { if (!done) grantClassFeatures(actor); });
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


/**
 * An NPC that goes Down (Chapter 4, NPCs Going Down) dies with more Lethal damage (the Dead condition, an overlay on its token) and falls Unconscious
 * with more Nonlethal damage; equal, the GM chooses (a pick window). If it is healed it is back. v0.0.433 (the Bestiary audit): Unconscious and the
 * GM's choice were missing (a Down NPC on more Nonlethal damage stayed up: it threatened, flanked and took its turns).
 */
const askingDown = new Set();
async function checkDead(actor) {
  if (!game.user.isActiveGM || actor?.type !== "npc") return;
  const s = actor.system, down = !!s.atZero;
  let want = null;
  if (down) {
    if (s.lethal > s.nonlethal) want = "dead";
    else if (s.nonlethal > s.lethal) want = "unconscious";
    else {
      if (actor.statuses?.has("dead") || actor.statuses?.has("unconscious") || askingDown.has(actor.uuid)) return;
      askingDown.add(actor.uuid);
      try {
        const { pickOne } = await import("./pickwindow.mjs");
        want = await pickOne({ title: "Down", name: `${actor.name} goes Down`, sub: "Lethal and Nonlethal damage are equal", icon: "fa-skull",
          text: "The GM chooses (Chapter 4, NPCs Going Down).", options: [{ k: "dead", l: "It dies" }, { k: "unconscious", l: "It falls Unconscious" }] });
      } finally { askingDown.delete(actor.uuid); }
      if (!want) return;
    }
  }
  const hasDead = !!actor.statuses?.has("dead");
  if ((want === "dead") !== hasDead) await actor.toggleStatusEffect("dead", { active: want === "dead", overlay: want === "dead" });
  if (want === "unconscious" && !actor.statuses?.has("unconscious")) await actor.toggleStatusEffect("unconscious", { active: true });
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
// v0.0.215 (Lucas, playtest 2): every new creature's token shows its bars always, to everyone, and doesn't rotate.
Hooks.on("preCreateActor", (actor, data) => {
  const bars = globalThis.CONST?.TOKEN_DISPLAY_MODES?.ALWAYS ?? 50;
  if (data?.prototypeToken?.displayBars === undefined) actor.updateSource({ "prototypeToken.displayBars": bars });
  if (data?.prototypeToken?.lockRotation === undefined) actor.updateSource({ "prototypeToken.lockRotation": true });
});
Hooks.on("preCreateActor", actor => {
  if (actor.type === "character") { actor.updateSource({ "prototypeToken.disposition": 1, "prototypeToken.actorLink": true }); giveHearing(actor); giveVision(actor); }
  else if (actor.type === "npc") { actor.updateSource({ "prototypeToken.disposition": -1 }); giveHearing(actor); }   // v0.0.318 (Lucas): NPCs hear too (a Blinded Grave Wisp)
});
// v0.0.318: a token placed from an actor made before (or from the compendium) gets the Hearing mode too
Hooks.on("preCreateToken", doc => {
  // v0.0.346 (Lucas, playtest 4: "tokens from the compendium still don't have Display Bars: Always"): every creature's token shows its bars, to everyone
  try { if (["character", "npc"].includes(doc.actor?.type)) doc.updateSource({ displayBars: globalThis.CONST?.TOKEN_DISPLAY_MODES?.ALWAYS ?? 50 }); } catch (e) { /* keep Foundry's */ }
  try {
    if (!["character", "npc"].includes(doc.actor?.type)) return;
    const w = withMode(doc.toObject().detectionModes, "hearing");   // v0.0.319: in the shape this Foundry stores
    if (w.changed) doc.updateSource({ detectionModes: w.value });
  } catch (e) { console.warn("twod12 | Hearing on a new token", e); }
});
// v0.0.318 (Lucas: a Blinded NPC showed no ripples: its token had no Hearing): every creature and token gets it once per world
Hooks.once("ready", async () => {
  try {
    if (!game.user.isActiveGM || game.settings.get("twod12", "hearingAllV319")) return;
    await addHearing({ quiet: true });
    await game.settings.set("twod12", "hearingAllV319", true);
  } catch (e) { console.warn("twod12 | Hearing for every creature", e); }
});

// v0.0.346 (Lucas): once per world, every creature's prototype token and every placed token shows its bars always (the compendium's actors had
// Foundry's default); and the world's copies of Frightened and Marked Quarry take the book's v0.0.345 rules (data.mjs-free: see fixRulesV346)
Hooks.once("ready", async () => {
  try {
    if (!game.user.isActiveGM || game.settings.get("twod12", "worldPassV346")) return;
    const ALWAYS = globalThis.CONST?.TOKEN_DISPLAY_MODES?.ALWAYS ?? 50;
    for (const a of game.actors ?? []) if (["character", "npc"].includes(a.type) && a.prototypeToken?.displayBars !== ALWAYS) await a.update({ "prototypeToken.displayBars": ALWAYS });
    for (const sc of game.scenes ?? []) {
      const ups = sc.tokens.filter(t => t.displayBars !== ALWAYS).map(t => ({ _id: t.id, displayBars: ALWAYS }));
      if (ups.length) await sc.updateEmbeddedDocuments("Token", ups);
    }
    await (await import("./fixrules.mjs")).fixRulesV346();
    await game.settings.set("twod12", "worldPassV346", true);
  } catch (e) { console.warn("twod12 | v0.0.346 world pass", e); }
});

// the core rework E1 (Lucas, 2026-11-21): once per world, every applied Frightened becomes Daunted (fixrules.mjs migrateDaunted)
Hooks.once("ready", async () => {
  try {
    if (!game.user.isActiveGM || game.settings.get("twod12", "worldPassDaunted")) return;
    await (await import("./fixrules.mjs")).migrateDaunted();
    await game.settings.set("twod12", "worldPassDaunted", true);
  } catch (e) { console.warn("twod12 | the Daunted world pass", e); }
});

// v0.0.351: once per world, Zone Effects (Covering Fire) get their second carried Effect from the compendium (fixrules.mjs fixZonesV351)
Hooks.once("ready", async () => {
  try {
    if (!game.user.isActiveGM || game.settings.get("twod12", "worldPassV351")) return;
    await (await import("./fixrules.mjs")).fixZonesV351();
    await game.settings.set("twod12", "worldPassV351", true);
  } catch (e) { console.warn("twod12 | v0.0.351 world pass", e); }
});

// v0.0.215 (Lucas, playtest 2): Foundry's own token auto-rotation is turned off once per world (the GM can turn it back on in Core settings).
Hooks.once("ready", async () => {
  try {
    if (!game.user.isActiveGM || game.settings.get("twod12", "tokenDefaultsV215")) return;
    for (const key of ["core.tokenAutoRotate", "core.autoRotate", "core.tokenRotation"]) if (game.settings.settings.has(key)) { const [ns, k] = key.split("."); await game.settings.set(ns, k, false); }
    await game.settings.set("twod12", "tokenDefaultsV215", true);
  } catch (e) { console.warn("twod12 | token rotation default", e); }
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
