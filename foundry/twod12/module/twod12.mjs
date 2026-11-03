import { registerAuraHooks } from "./aura.mjs";
import { registerHazardHooks, registerHazardBehavior } from "./hazard.mjs";
import { registerDownHooks } from "./down.mjs";
import { registerLeanHooks } from "./lean.mjs";
import { registerMasteryHooks } from "./mastery.mjs";
import { registerMarkHooks } from "./mark.mjs";
import { registerLoE } from "./loe.mjs";
import { solidTiles, tileConfigSolid } from "./corners.mjs";
import { registerLightRadius } from "./lightradius.mjs";
import { registerRegionSnap } from "./regionshape.mjs";
import { chatChips } from "./chatchips.mjs";
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
import { classLevelChange } from "./classwindow.mjs";
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
import { bindInitCard } from "./initcard.mjs";
import { registerRefresh, refreshFromCompendium, askRefresh } from "./refresh.mjs";
import { GROUPS } from "./config.mjs";
import { registerDragCopy } from "./drag.mjs";
import { registerUsageHooks } from "./usage.mjs";

Hooks.once("init", () => {
  // v0.0.202 (Lucas): tooltips wait a little longer before they show (Foundry's own wait is 0.5 s); a client setting.
  const tipDelay = v => { const TM = foundry.helpers?.interaction?.TooltipManager ?? globalThis.TooltipManager; if (TM) TM.TOOLTIP_ACTIVATION_MS = Math.max(0, Number(v) || 0); };
  game.settings.register("twod12", "tooltipDelay", { name: "Tooltip delay (ms)", hint: "How long the pointer rests on something before its tooltip shows. Foundry's own is 500.", scope: "client", config: true, type: Number, default: 900, range: { min: 0, max: 3000, step: 100 }, onChange: tipDelay });
  tipDelay(game.settings.get("twod12", "tooltipDelay"));
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
  registerMarkHooks();
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
  // v0.0.215 (Lucas, playtest 2): the token HUD's two buttons as shortcuts, for speed in play.
  game.keybindings.register("twod12", "lineOfEffect", { name: "Line of Effect", hint: "Shows or hides the Line of Effect lines of your selected token (the token HUD's button).", editable: [{ key: "KeyL", modifiers: ["Shift"] }],
    onDown: () => { import("./loe.mjs").then(m => m.loeShortcut()); return true; } });
  game.keybindings.register("twod12", "coverHeight", { name: "Cover height calculation", hint: "Opens the side view of your selected token and its first target (the token HUD's button).", editable: [{ key: "KeyH", modifiers: ["Shift"] }],
    onDown: () => { import("./loe.mjs").then(m => m.heightShortcut()); return true; } });
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
    refreshFromCompendium: (opts = {}) => (Object.keys(opts).length ? refreshFromCompendium(opts) : askRefresh()),   // v0.0.190: a macro can call it
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
  game.settings.register("twod12", "showOdds", { name: "Show the odds on cards", hint: "For testing: action cards show the chance of each tier, and damage cards the average and the chance of that total.", scope: "client", config: true, type: Boolean, default: true });
  game.settings.register("twod12", "highlightTraits", { name: "Highlight traits and damage types in rules text", hint: "The book's text colors on cards (Attributes, Modifiers, Banes and Boons, Rally Points, costs, movement, damage), a light background behind trait names (Strike, Divine...) and colored damage types (Cold, Holy...).", scope: "client", config: true, type: Boolean, default: true });
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
  game.settings.register("twod12", "unlockPacks", { name: "Unlock the system compendiums", hint: "Keep the 2d12 compendiums unlocked, so their items can be opened and edited without unlocking them first (only the GM and Assistants can edit; a system update rebuilds them, so edits there are lost).", scope: "world", config: true, type: Boolean, default: true, onChange: () => import("./basic.mjs").then(m => m.unlockSystemPacks()) });   // v0.0.191
  game.settings.register("twod12", "tokenDefaultsV215", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.215: core token rotation off, once
  game.settings.register("twod12", "settingsV207", { scope: "world", config: false, type: Boolean, default: false });   // v0.0.207: the editability sweep's settings and fields (automation.mjs)
  game.settings.register("twod12", "settingsV187", { scope: "world", config: false, type: Boolean, default: false });   // Killer's Focus and Radiant Zeal: an Effect each turn
  game.settings.register("twod12", "settingsV186", { scope: "world", config: false, type: Boolean, default: false });   // the cards automated by name get their settings (automation.mjs)
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
Hooks.on("renderChatMessageHTML", bindInitCard);   // v0.0.206: the Initiative card's rows open on click
Hooks.on("renderChatMessageHTML", chatChips);   // v0.0.180: no line between trait groups at the start or end of a wrapped row
// v0.0.177: a light of size N reaches an N Emanation (the half square Foundry leaves out is added), and Regions snap to whole squares.
Hooks.once("setup", () => { try { registerLightRadius(); } catch (e) { console.warn("twod12 | light radius", e); } });
registerRegionSnap();   // v0.0.178: a Region drawn by hand is snapped to whole squares when it is created (a circle becomes the area of its size)
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
// v0.0.215 (Lucas, playtest 2): every new creature's token shows its bars always, to everyone, and doesn't rotate.
Hooks.on("preCreateActor", (actor, data) => {
  const bars = globalThis.CONST?.TOKEN_DISPLAY_MODES?.ALWAYS ?? 50;
  if (data?.prototypeToken?.displayBars === undefined) actor.updateSource({ "prototypeToken.displayBars": bars });
  if (data?.prototypeToken?.lockRotation === undefined) actor.updateSource({ "prototypeToken.lockRotation": true });
});
Hooks.on("preCreateActor", actor => {
  if (actor.type === "character") { actor.updateSource({ "prototypeToken.disposition": 1, "prototypeToken.actorLink": true }); giveHearing(actor); giveVision(actor); }
  else if (actor.type === "npc") actor.updateSource({ "prototypeToken.disposition": -1 });
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
