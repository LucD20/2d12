// The item sheet (every item type; the Details tab of an Effect is written as sentences: fxdetails.mjs).
import { rollSource } from "./rollsource.mjs";
import { tagChoices, TWOD12, categoryText, traitPicker } from "./config.mjs";
import { versionRow } from "./actions.mjs";
import { versionStats, fmt } from "./calc.mjs";
import { buildRawCard, buildWeaponCard } from "./preview.mjs";
import { openWeaponGenerator } from "./gen.mjs";
import { openActionGenerator } from "./genaction.mjs";
import { enableDragging } from "./drag.mjs";
import { settingSentence, effectSummary, predRows, hiddenPreds, familyColor } from "./fxdetails.mjs";
import { applyTab, dragData } from "./sheet-common.mjs";
import { VersionsEditor } from "./versions.mjs";
import { attrLine, choicesToMake, freqOf, SECTION_FREQS } from "./classlevels.mjs";
import { itemInfo } from "./classwindow.mjs";
import { openLevelsEditor } from "./classeditor.mjs";
import { prereqText, prereqLine } from "./talents.mjs";
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class TwoD12ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  _activeTab = "description";
  static DEFAULT_OPTIONS = {
    classes: ["twod12", "item"],
    position: { width: 560, height: 680 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      switchTab: TwoD12ItemSheet.switchTab,
      removeLink: TwoD12ItemSheet.removeLink,
      openLinked: TwoD12ItemSheet.openLinked,
      openVersions: TwoD12ItemSheet.openVersions,
      setSteadiness: TwoD12ItemSheet.setSteadiness,
      openGenerator: TwoD12ItemSheet.openGenerator,
      generateWeapon: TwoD12ItemSheet.generateWeapon,
      createTechnique: TwoD12ItemSheet.createTechnique,
      addDefense: TwoD12ItemSheet.addDefense,
      removeDefense: TwoD12ItemSheet.removeDefense,
      removeSetting: TwoD12ItemSheet.removeSetting,
      addTalentMod: TwoD12ItemSheet.addTalentMod,
      createLinkedAction: TwoD12ItemSheet.createLinkedAction,
      removeTalentMod: TwoD12ItemSheet.removeTalentMod,
      togglePrereqMode: TwoD12ItemSheet.togglePrereqMode,
      removePrereq: TwoD12ItemSheet.removePrereq,
      editLevels: TwoD12ItemSheet.editLevels
    }
  };
  static PARTS = { main: { template: "systems/twod12/templates/item-sheet.hbs" } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const it = this.item,
      s = it.system,
      t = it.type;
    const TE = foundry.applications.ux.TextEditor.implementation;
    const link = async (uuid, extra = {}) => ({ uuid, name: (await fromUuid(uuid))?.name ?? "(missing item)", ...extra });
    return Object.assign(ctx, {
      item: it,
      system: s,
      fields: s.schema.fields,
      traitPicker: traitPicker(),   // v0.0.179: the Traits drop-down grouped Roll, Requires, Kind, Damage, Keywords
      // v0.0.172: the help tips (the grey hints) of the Action and Talent sheets can be hidden, like the Effect's (one choice per user, for both sheets).
      helpable: t === "action" || t === "talent" || t === "class",
      sheetHelp: (() => { try { return game.settings.get("twod12", "sheetHelp") !== false; } catch (e) { return true; } })(),
      rawCard: t === "action" ? await buildRawCard(it) : t === "weapon" ? await buildWeaponCard(it) : "",
      categoryShown: categoryText(s),
      enriched: await TE.enrichHTML(s.description ?? "", { relativeTo: it }),
      vsChoices: TWOD12.vsChoices,
      attrChoices: TWOD12.attributes,
      defensesList: t === "feature" ? s.defenses.map((d, i) => ({ i, attr: d.attr, bonus: d.bonus, tags: d.tags })) : [],
      ...(t === "effect" ? this._effectContext(s) : ["feature", "talent"].includes(t) ? this._passiveContext() : {}),
      isPassiveHost: ["feature", "talent"].includes(t),
      freqChoices: TWOD12.frequencies,
      reactionKinds: { interrupt: "Interrupt", trigger: "Trigger" },
      condRows: (s.conditions ?? []).map((c, i) => ({ i, name: c.name, value: c.value, valued: !!c.valued, mode: c.mode || "set" })),
      riderModes: { set: "the highest counts", increase: "increase the value" },
      isTalent: t === "talent",
      autoRanks: TWOD12.automationRanks,
      // v0.0.186: the Talent's Category and Prerequisites as data (talents.mjs).
      ...(t === "talent" ? {
        talentGroups: TWOD12.talentGroups, prereqKinds: TWOD12.prereqKinds, prereqModes: { all: "all of these", any: "any one of these" },
        traitChoices: Object.fromEntries(Object.entries(TWOD12.traits).sort((a, b) => a[1].localeCompare(b[1]))),
        prereqJoin: s.prereqMode === "any" ? "or" : "and",
        prereqRows: (s.prereqs ?? []).map((p, i) => ({ i, ...p, text: prereqText(p), kindLabel: { talent: "Talent", level: "Level", trait: "a", attribute: "", other: "Other" }[p.kind] ?? "", isTalent: p.kind === "talent", isLevel: p.kind === "level", isTrait: p.kind === "trait", isAttribute: p.kind === "attribute", isOther: p.kind === "other" })),
        prereqShown: prereqLine(s),
        talentNames: [...new Set([...(game.items ?? [])].filter(i => i.type === "talent").map(i => i.name))].sort()
      } : {}),
      hasMods: t === "talent" || t === "action",
      talentMods:
        t === "talent" || t === "action"
          ? s.modifiers.map((m, i) => ({
              i,
              spec: m.spec,
              critical: m.critical,
              effects: m.effects,
              always: m.when === "always",
              outOfTurn: m.when === "outOfTurn"
            }))
          : [],
      talentTraits: t === "talent" ? Object.entries(TWOD12.actionTraits).map(([key, label]) => ({ key, label, checked: s.traits.has(key) })) : [],
      isSpecies: t === "species",
      steadinessChoices: [0, 1, 2, 3, 4].map(v => ({ v, on: Number(s.steadiness ?? 0) === v })),
      isClass: t === "class",
      cls: t === "class" ? await this._classContext(s) : null,
      defenseKindChoices: TWOD12.defenseKinds,
      armorTrainingChoices: TWOD12.armorTrainings,
      modPriorityChoices: { weapon: "the Weapon Modifier keeps it", power: "the Power Modifier keeps it" },
      isFeature: t === "feature",
      isEffect: t === "effect",
      styled: t !== "species",   // v0.0.168: the sheet's look (parchment, dark text); v0.0.185: Class too, Species keeps the old one until it is redone
      durationChoices: TWOD12.durationTypes,
      settingChoices: TWOD12.effectSettings,
      settingsList:
        ["effect", "feature", "talent"].includes(t) && Array.isArray(s.settings)
          ? s.settings.map((x, i) => {
              const shown = new Set([...(this._shownPreds ?? [])].filter(k => k.startsWith(`${i}:`)).map(k => k.split(":")[1]));
              const fields = x.type === "boonbane" ? ["all", "any", "none", "from"] : ["all", "any", "none"];
              return {
                i,
                label: TWOD12.effectSettings[x.type],
                sentence: settingSentence(x) + (["feature", "talent"].includes(t) && x.minEscalation > 0 ? ` <i class="fxd-esc">(Escalation ${x.minEscalation}+)</i>` : ""),
                minEscalation: x.minEscalation,
                isDamageStep: x.type === "damagestep",
                isAura: x.type === "aura",
                auraSize: x.auraSize,
                auraWho: x.auraWho,
                auraSelf: x.auraSelf,
                auraOutlineColor: /^#[0-9a-f]{6}$/i.test(x.auraOutline ?? "") ? x.auraOutline : (TWOD12.auraColors[x.auraWho] ?? TWOD12.auraColors.allies),
                auraFillColor: /^#[0-9a-f]{6}$/i.test(x.auraFill ?? "") ? x.auraFill : (TWOD12.auraColors[x.auraWho] ?? TWOD12.auraColors.allies),
                auraWhoChoices: { allies: "allies", enemies: "enemies", all: "everyone" },
                isOnDamage: x.type === "ondamage",
                trigSub: x.trigSub,
                trigTag: x.trigTag,
                tagChoices: tagChoices(),
                open: !!this._openSettings?.has(i),
                isNote: x.type === "note",
                isLight: x.type === "light",
                isSpeed: x.type === "speed",
                isDefense: x.type === "defense",
                defKind: x.defKind,
                defValue: x.defValue,
                defKinds: TWOD12.defenseKinds,
                isGrant: x.type === "grant",
                grantAction: x.grantAction,
                grantCount: x.grantCount,
                grantAp: x.grantAp,
                grantDistinct: x.grantDistinct,
                against: x.against,
                againstVal: String(!!x.against),
                speedMode: x.speedMode,
                speedFormula: x.speedFormula,
                speedModes: { add: "Add to the creature's Speed:", override: "Replace the creature's Speed with:" },
                isBoonBane: x.type === "boonbane",
                isIgnore: x.type === "ignore",
                isRally: x.type === "rally",
                isTurnStart: x.type === "turnstart",
                ignoreRule: x.ignoreRule,
                ignoreRules: TWOD12.ignoreRules,
                rallyBonus: x.rallyBonus,
                rallyRange: x.rallyRange,
                oncePerRound: x.oncePerRound,
                vsMarked: x.vsMarked,
                showOnce: ["boonbane", "bonusdamage"].includes(x.type),
                showMarked: ["bonusdamage", "damagestep"].includes(x.type) || (x.type === "boonbane" && !x.against),
                isBonus: x.type === "bonusdamage",
                boons: x.boons,
                banes: x.banes,
                empowered: x.empowered,
                enfeebled: x.enfeebled,
                byValue: x.byValue,
                showByValue: !!(s.valued || x.byValue),
                boonWord: x.boons === 1 ? "Boon" : "Boons",
                baneWord: x.banes === 1 ? "Bane" : "Banes",
                timesWord: x.grantCount === 1 ? "time" : "times",
                dmg: x.dmg,
                poolOpts: TWOD12.pools,
                subOpts: TWOD12.subtypes,
                dmgPool: x.dmgPool,
                dmgSub: x.dmgSub,
                fxName: x.fxUuid ? (fromUuidSync(x.fxUuid)?.name ?? "(missing)") : "",
                tierBoxes: ["t1", "t2", "t3"].map((k, ti) => ({ key: k, label: `T${ti + 1}`, checked: x.tiers.has(k) })),
                preds: ["boonbane", "bonusdamage", "damagestep", "ignore"].includes(x.type) ? predRows(x, shown, fields, ["bonusdamage", "ignore"].includes(x.type) ? "any action" : "every roll") : [],
                hidden: ["boonbane", "bonusdamage", "damagestep", "ignore"].includes(x.type) ? hiddenPreds(x, shown, fields) : [],
                title: x.title,
                text: x.text,
                bright: x.bright,
                dim: x.dim,
                color: x.color,
                attrs: Object.entries(TWOD12.attributes).map(([key, label]) => ({ key, label, checked: x.attrs.has(key) }))
              };
            })
          : [],
      isAction: t === "action",
      isWeapon: t === "weapon",
      isArmor: t === "armor",
      isGear: t === "gear",
      escChoices: { 0: "always", 1: "while its owner's Escalation is 1 or more", 2: "while its owner's Escalation is 2 or more", 3: "while its owner's Escalation is 3" },
      weaponThrown: t === "weapon" && !!it.system.traits?.has?.("thrown"),
      armorCategories: { light: "Light (Armor 12)", medium: "Medium (Armor 13)", heavy: "Heavy (Armor 14)" },
      attrValues: Object.entries(TWOD12.attributes).map(([k, label]) => ({ key: k, label, value: s.attributes?.[k] ?? 0 })),
      featuresList:
        t === "class"
          ? (
              await Promise.all(
                s.features.map(async (f, index) => {
                  const d = await fromUuid(f.uuid);
                  return {
                    uuid: f.uuid,
                    index,
                    name: d?.name ?? "(missing item)",
                    level: Math.max(1, d?.system.level || 1),
                    cat: d ? categoryText(d.system) : ""
                  };
                })
              )
            ).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
          : [],
      choiceList: t === "talent" || t === "feature" ? await Promise.all(s.choiceOptions.map((u, index) => link(u, { index }))) : [],
      actionsList:
        t === "feature" || t === "weapon" || t === "talent" ? await Promise.all(s.actions.map((u, index) => link(u, { index }))) : [],
      weaponTiers: t === "weapon" ? ["t1", "t2", "t3"].map((k, i) => ({ key: k, label: `Tier ${i + 1}`, d: s.damage[k] })) : [],
      poolChoices: TWOD12.pools,
      dieChoices: TWOD12.dice,
      subtypeChoices: TWOD12.subtypes,
      versionCount: t === "action" ? s.versions.length : 0,
      versionRows: t === "action" ? this._versionRows() : [],
      onActor: !!it.parent,
      attrChecks:
        t === "class"
          ? Object.fromEntries(
              ["choiceA", "choiceB", "weaponAttrs", "magicAttrs"].map(k => [
                k,
                Object.entries(TWOD12.attributes).map(([key, label]) => ({ key, label, checked: s[k].has(key) }))
              ])
            )
          : {}
    });
  }

  /** v0.0.185: the Class's Details tab: the Modifier selects, the Attribute increases of level 1, the level rows, the Repertoire and Escalation chips. */
  async _classContext(s) {
    const infos = new Map();
    for (const u of new Set([...(s.repertoire ?? []), ...(s.escPassives ?? []), ...(s.escActives ?? []), ...(s.levels ?? []).flatMap(l => l.sections.flatMap(x => x.items ?? []))])) {
      let d = null; try { d = await fromUuid(u); } catch (e) { /* missing */ }
      infos.set(u, itemInfo(d));
    }
    const info = u => infos.get(u) ?? null;
    const chip = (u, index) => ({ uuid: u, index, name: info(u)?.name ?? "(missing item)", esc: info(u)?.escalation || 0 });
    const freqs = ["passive", "turn", "round", "encounter", "daily"];
    const rep = (s.repertoire ?? []).map(chip);
    const repGroups = [...freqs.map(f => ({ label: SECTION_FREQS[f], list: rep.filter(c => freqOf(info(c.uuid)) === f) })), { label: "Other", list: rep.filter(c => !freqs.includes(freqOf(info(c.uuid)))) }].filter((g, i) => g.list.length || i < freqs.length);
    const w = [...(s.weaponAttrs ?? [])], p = [...(s.magicAttrs ?? [])];
    const shared = w.filter(k => p.includes(k)).map(k => TWOD12.attributes[k]);
    return {
      weapon: [w[0] ?? "body", w[1] ?? w[0] ?? "body"], power: [p[0] ?? "mind", p[1] ?? p[0] ?? "mind"], attrLine: attrLine(s, 1), shared: shared.join(" or "),
      levels: (s.levels ?? []).map((l, i) => { const c = choicesToMake(s, i + 1, info); return { n: i + 1, sections: l.sections.length, one: l.sections.length === 1, choices: c, oneChoice: c === 1 }; }),
      rep: repGroups,
      esc: [{ key: "escPassives", label: "Passives", list: (s.escPassives ?? []).map(chip) }, { key: "escActives", label: "Actives", list: (s.escActives ?? []).map(chip) }]
    };
  }

  /** A Feature's or Talent's passive: the same sentences as an Effect's settings. */
  _passiveContext() {
    let help = false;
    try { help = !!game.settings.get("twod12", "effectHelp"); } catch (e) { /* not registered yet */ }
    return { fxHelp: help, whoChoices: { false: "by this creature", true: "against this creature" } };
  }

  /** The Details tab of an Effect: the sentences, the "In short" line and the chips of how it ends (fxdetails.mjs). */
  _effectContext(s) {
    let help = false;
    try {
      help = !!game.settings.get("twod12", "effectHelp");
    } catch (e) {
      /* not registered yet */
    }
    const ex = new Set(s.expireOn);
    return {
      fxHelp: help,
      fxSummary: effectSummary(s),
      kindChoices: { effect: "an effect", condition: "a condition" },
      kindVal: s.isCondition ? "condition" : "effect",
      selfChoices: { target: "the target", user: "the user" },
      selfVal: s.selfApplied ? "user" : "target",
      whoChoices: { false: "by this creature", true: "against this creature" },
      durationWords: { "": "until removed", eot: "until the end of its turn (EoT)", rounds: "for" },
      isRounds: s.duration.type === "rounds",
      roundsWord: s.duration.rounds === 1 ? "round" : "rounds",
      expireAllChoices: { any: "any", all: "all" },
      expireAllVal: s.expireAll ? "all" : "any",
      expireChips: [...ex].map(key => ({ key, label: TWOD12.traits[key] ?? key, color: familyColor(key) })),
      expireOptions: Object.entries(TWOD12.actionTraits)
        .filter(([k]) => !ex.has(k))
        .map(([key, label]) => ({ key, label }))
    };
  }

  _onRender(context, options) {
    super._onRender?.(context, options);
    // v0.0.190 (Lucas): a locked compendium's item (read-only) still opens its Details tab: Foundry disables every button of a read-only
    // sheet, so the tab buttons (and "Edit levels…", which only shows) are switched back on. The fields stay read-only.
    if (!this.isEditable) this.element.querySelectorAll(".tabbtn, [data-action='openLinked']").forEach(b => { b.disabled = false; });
    this.element.classList.toggle("twod12-styled", this.item.type !== "species");   // v0.0.168 (system.css "Item sheets")
    applyTab(this);
    enableDragging(this);
    this.element.querySelectorAll("details.setting").forEach(d =>
      d.addEventListener("toggle", () => {
        this._openSettings ??= new Set();
        const i = Number(d.dataset.i);
        if (d.open) this._openSettings.add(i);
        else this._openSettings.delete(i);
      })
    );
    this._effectListeners();
    // v0.0.185: the Class's Weapon and Power Modifier selects ("uses X or Y") write the two-Attribute lists.
    this.element.querySelectorAll("[data-modsel]").forEach(el => el.addEventListener("change", async () => {
      const key = el.dataset.modsel, pair = [...this.element.querySelectorAll(`[data-modsel="${key}"]`)].map(x => x.value);
      if (pair[0] === pair[1]) ui.notifications.info("The two Attributes of a Modifier should be different.");
      await this.item.update({ [`system.${key}`]: [...new Set(pair)] });
    }));
    this.element.querySelectorAll("[data-sheethelp]").forEach(el => el.addEventListener("change", async () => {
      el.closest("section.tab")?.classList.toggle("help-off", !el.checked);
      try { await game.settings.set("twod12", "sheetHelp", el.checked); } catch (e) { /* not registered */ }
    }));
    this.element.querySelectorAll("[data-set]").forEach(el =>
      el.addEventListener("change", async () => {
        const set = el.dataset.set;
        const keys = [...this.element.querySelectorAll(`[data-set="${set}"]`)].filter(c => c.checked).map(c => c.dataset.key);
        await this.item.update({ [`system.${set}`]: keys });
      })
    );
    this.element.querySelectorAll("[data-sfield]").forEach(el =>
      el.addEventListener("change", async () => {
        const arr = foundry.utils.deepClone(this.item.toObject().system.settings);
        arr[Number(el.dataset.sfield)][el.dataset.field] =
          el.type === "checkbox"
            ? el.checked
            : "bool" in el.dataset
              ? el.value === "true"
              : el.type === "number"
                ? ("signed" in el.dataset ? Math.trunc(Number(el.value)) || 0 : Math.max(0, Number(el.value) || 0))
                : el.value;
        await this.item.update({ "system.settings": arr });
      })
    );
    this.element.querySelectorAll("[data-sset]").forEach(el =>
      el.addEventListener("change", async () => {
        const i = Number(el.dataset.sset),
          field = el.dataset.field || "attrs";
        const keys = [...this.element.querySelectorAll(`[data-sset="${i}"][data-field="${field}"], [data-sset="${i}"]:not([data-field])`)]
          .filter(c => (c.dataset.field || "attrs") === field && c.checked)
          .map(c => c.dataset.key);
        const arr = foundry.utils.deepClone(this.item.toObject().system.settings);
        arr[i][field] = keys;
        await this.item.update({ "system.settings": arr });
      })
    );
    // v0.0.186: a Talent's Prerequisite rows (a new kind starts with its own default: Level 1, an Attribute at 1).
    this.element.querySelectorAll("[data-pfield]").forEach(el =>
      el.addEventListener("change", async () => {
        const arr = foundry.utils.deepClone(this.item.toObject().system.prereqs ?? []), row = arr[Number(el.dataset.pfield)];
        if (!row) return;
        row[el.dataset.field] = el.type === "number" ? Math.trunc(Number(el.value)) || 0 : el.value;
        if (el.dataset.field === "kind") { row.name = ""; row.value = ["level", "attribute"].includes(el.value) ? 1 : 0; }
        await this.item.update({ "system.prereqs": arr });
      })
    );
    this.element.querySelector("[data-prereqadd]")?.addEventListener("change", async ev => {
      const kind = ev.currentTarget.value;
      if (!kind) return;
      const arr = foundry.utils.deepClone(this.item.toObject().system.prereqs ?? []);
      arr.push({ kind, name: "", value: ["level", "attribute"].includes(kind) ? 1 : 0 });
      await this.item.update({ "system.prereqs": arr });
    });
    this.element.querySelectorAll("[data-dfield]").forEach(el =>
      el.addEventListener("change", async () => {
        const arr = foundry.utils.deepClone(this.item.toObject().system.defenses);
        arr[Number(el.dataset.dfield)][el.dataset.field] = el.type === "number" ? Number(el.value) || 0 : el.value;
        await this.item.update({ "system.defenses": arr });
      })
    );
    this.element.querySelectorAll("[data-cfield]").forEach(el =>
      el.addEventListener("change", async () => {
        // the value of a condition this effect applies
        const arr = foundry.utils.deepClone(this.item.toObject().system.conditions);
        arr[Number(el.dataset.cfield)].value = Math.max(1, Math.trunc(Number(el.value)) || 1);
        await this.item.update({ "system.conditions": arr });
      })
    );
    this.element.querySelectorAll("[data-cmode]").forEach(el =>
      el.addEventListener("change", async () => {
        // "The highest counts" or "Increase the value"
        const arr = foundry.utils.deepClone(this.item.toObject().system.conditions);
        arr[Number(el.dataset.cmode)].mode = el.value === "increase" ? "increase" : "set";
        await this.item.update({ "system.conditions": arr });
      })
    );
    this.element.querySelectorAll("[data-cdel]").forEach(el =>
      el.addEventListener("click", async () => {
        const arr = foundry.utils.deepClone(this.item.toObject().system.conditions);
        arr.splice(Number(el.dataset.cdel), 1);
        await this.item.update({ "system.conditions": arr });
      })
    );
    this.element.querySelectorAll("[data-sfx]").forEach(zone => {
      zone.addEventListener("dragover", ev => ev.preventDefault());
      zone.addEventListener("drop", async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const data = dragData(ev);
        const doc = data?.uuid ? await fromUuid(data.uuid) : null;
        if (!doc || doc.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
        const arr = foundry.utils.deepClone(this.item.toObject().system.settings);
        arr[Number(zone.dataset.sfx)].fxUuid = doc.uuid;
        await this.item.update({ "system.settings": arr });
      });
    });
    this.element.querySelectorAll(".drop-zone").forEach(zone => {
      zone.addEventListener("dragover", ev => ev.preventDefault());
      zone.addEventListener("drop", async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const data = dragData(ev);
        const doc = data?.uuid ? await fromUuid(data.uuid) : null;
        if (!doc || !zone.dataset.accept.split(",").includes(doc.type))
          return ui.notifications.warn(`Drop a ${zone.dataset.accept.replace(/,/g, " or ")} here.`);
        const list = zone.dataset.list === "escalation" ? (doc.type === "feature" ? "escPassives" : "escActives") : zone.dataset.list;
        const arr = foundry.utils.deepClone(this.item.toObject().system[list]);
        if (["repertoire", "escPassives", "escActives"].includes(list) && arr.includes(doc.uuid)) return ui.notifications.info(`${doc.name} is already in the list.`);
        if (list === "conditions" && !doc.system?.isCondition) return ui.notifications.warn("Drop a condition here (from the Conditions compendium).");
        arr.push(
          list === "features"
            ? { uuid: doc.uuid, level: 1 }
            : list === "conditions"
              ? { uuid: doc.uuid, name: doc.name, value: 1, valued: !!doc.system?.valued, mode: "set" }
              : doc.uuid
        );
        await this.item.update({ [`system.${list}`]: arr });
      });
    });
  }

  /** The controls of an Effect's Details tab that have no form name: the sentences' selects, the trait chips and the help toggle. */
  _effectListeners() {
    const root = this.element,
      it = this.item;
    const on = (sel, ev, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener(ev, e => fn(el, e)));
    const settings = () => foundry.utils.deepClone(it.toObject().system.settings);
    on("[data-fxhelp]", "change", async el => {
      root.querySelector(".fxd")?.classList.toggle("help-on", el.checked);
      try {
        await game.settings.set("twod12", "effectHelp", el.checked);
      } catch (e) {
        /* not registered */
      }
    });
    on("[data-fxkind]", "change", el => it.update({ "system.isCondition": el.value === "condition" }));
    on("[data-fxself]", "change", el => it.update({ "system.selfApplied": el.value === "user" }));
    on("[data-fxadd]", "change", async el => {
      const type = el.value;
      el.value = "";
      if (!type) return;
      if (type === "condition") return ui.notifications.info("Drag a condition from the Conditions compendium onto the dashed box under the settings.");
      await this._addSetting(type);
    });
    on("[data-padd]", "change", async el => {
      if (!el.value) return;
      const arr = settings(),
        x = arr[Number(el.dataset.padd)],
        f = el.dataset.field;
      x[f] = [...new Set([...(x[f] ?? []), el.value])];
      await it.update({ "system.settings": arr });
    });
    on("[data-prem]", "click", async el => {
      const arr = settings(),
        x = arr[Number(el.dataset.prem)],
        f = el.dataset.field;
      x[f] = (x[f] ?? []).filter(k => k !== el.dataset.key);
      await it.update({ "system.settings": arr });
    });
    on("[data-pshow]", "click", (el, e) => {
      e.preventDefault();
      (this._shownPreds ??= new Set()).add(`${el.dataset.pshow}:${el.dataset.field}`);
      this.render();
    });
    on("[data-eadd]", "change", el => el.value && it.update({ "system.expireOn": [...new Set([...it.system.expireOn, el.value])] }));
    on("[data-erem]", "click", el => it.update({ "system.expireOn": [...it.system.expireOn].filter(k => k !== el.dataset.erem) }));
    on("[data-expireall]", "change", el => it.update({ "system.expireAll": el.value === "all" }));
  }

  /** A new setting starts open; the others keep their state. */
  async _addSetting(type) {
    const arr = foundry.utils.deepClone(this.item.toObject().system.settings);
    arr.push({
      type,
      attrs: [],
      title: "",
      text: "",
      bright: 0,
      dim: 0,
      color: "",
      boons: 0,
      banes: 0,
      predicate: "",
      all: [],
      any: [],
      none: [],
      dmg: "",
      dmgPool: "B",
      dmgSub: "",
      tiers: ["t1", "t2", "t3"],
      fxUuid: "",
      defKind: "all",
      defValue: 1
    });
    (this._openSettings ??= new Set()).add(arr.length - 1);
    await this.item.update({ "system.settings": arr });
  }

  /** Average and expected damage need the actor: its wielded or linked weapon, attribute and attack modifier. */
  _versionRows() {
    const it = this.item,
      s = it.system,
      actor = it.parent,
      isWeapon = s.traits.has("weapon");
    // What the Action rolls and what its damage adds (rollsource.mjs); without an actor, a Weapon Action still shows the [Mod] line.
    const ctx = { weapon: null, attrVal: 0, isWeapon, attrMode: isWeapon ? "t2" : "none", mod: null };
    if (actor?.system?.attributes) {
      const a = actor.system, src = rollSource(a, s);
      if (src.kind === "weapon") {
        const linked = it.getFlag("twod12", "weaponId");
        ctx.weapon = linked ? actor.items.get(linked) : (actor.itemTypes.weapon.find(w => w.system.wielded) ?? null);
      }
      if (src.kind) {
        ctx.attrVal = Number(src.mod) || 0;   // [Mod]: the Modifier used on the roll
        ctx.mod = src.kind === "attribute" ? ctx.attrVal : (src.attrKey ? src.mod : null);
        ctx.attrMode = src.attrMode;
      }
    }

    return s.versions.map(v => {
      const row = versionRow(v),
        st = versionStats(v, ctx);
      return {
        ...row,
        noTiers: !!v.noTiers,
        hasExp: !!st.exp && !v.noTiers,
        total: fmt(st.expTotal),
        meanAvg: fmt(st.meanAvg),
        tiers: row.tiers.map((text, i) => ({ text, avg: fmt(st.avg[i]), exp: st.exp ? fmt(st.exp[i]) : null }))
      };
    });
  }

  static async openGenerator() {
    await openActionGenerator({ item: this.item });   // v0.0.136: the whole Action, written like its card
  }
  static async generateWeapon() {
    await openWeaponGenerator({ item: this.item });
  }

  /** A new Action for this weapon (category Weapon Technique), linked to it, and opened. */
  static async createTechnique() {
    const w = this.item,
      wt = w.system.traits;
    const traits = ["strike", "weapon", ...(wt.has("ranged") ? ["ranged"] : ["melee"])];
    const system = {
      category: "Weapon Technique",
      level: 0,
      frequency: "round",   // Weapon Techniques are Round (the Weapon trait no longer means Round on its own)
      traits,
      targets: "One creature",
      versions: [{ ap: 1, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "", fx: { all: [], t1: [], t2: [], t3: [] } }]
    };
    if (w.parent) {
      const [a] = await w.parent.createEmbeddedDocuments("Item", [
        { name: `${w.name} Technique`, type: "action", img: w.img, system, flags: { twod12: { weaponId: w.id } } }
      ]);
      a?.sheet.render(true);
    } else {
      const a = await Item.create({ name: `${w.name} Technique`, type: "action", img: w.img, folder: w.folder?.id ?? null, system });
      await w.update({ "system.actions": [...w.system.actions, a.uuid] });
      a.sheet.render(true);
    }
  }
  static async togglePrereqMode() {
    await this.item.update({ "system.prereqMode": this.item.system.prereqMode === "any" ? "all" : "any" });
  }
  static async removePrereq(event, target) {
    const arr = foundry.utils.deepClone(this.item.toObject().system.prereqs ?? []);
    arr.splice(Number(target.dataset.index), 1);
    await this.item.update({ "system.prereqs": arr });
  }
  static async addDefense() {
    const arr = foundry.utils.deepClone(this.item.toObject().system.defenses);
    arr.push({ attr: "body", bonus: 1, tags: "" });
    await this.item.update({ "system.defenses": arr });
  }
  static async removeDefense(event, target) {
    const arr = foundry.utils.deepClone(this.item.toObject().system.defenses);
    arr.splice(Number(target.dataset.index), 1);
    await this.item.update({ "system.defenses": arr });
  }
  static switchTab(event, target) {
    this._activeTab = target.dataset.tabTarget;
    applyTab(this);
  }
  static async removeLink(event, target) {
    const list = target.dataset.list;
    const arr = foundry.utils.deepClone(this.item.toObject().system[list]);
    arr.splice(Number(target.dataset.index), 1);
    await this.item.update({ [`system.${list}`]: arr });
  }
  /** v0.0.185: the Class's Levels window. */
  static editLevels() { openLevelsEditor(this.item); }
  static async openLinked(event, target) {
    (await fromUuid(target.dataset.uuid))?.sheet.render(true);
  }
  /** A new Action for this Talent or Feature, linked to it, with the Action generator opened on it. */
  static async createLinkedAction() {
    const t = this.item;
    const system = {
      category: t.system.category || (t.type === "talent" ? "Talent" : "Feature"),
      level: t.system.level ?? 0,
      traits: [],
      targets: "",
      versions: [{ ap: 1, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "", fx: { all: [], t1: [], t2: [], t3: [] } }]
    };
    let a;
    if (t.parent) {
      const flag = t.type === "talent" ? "talentId" : "featureId";
      [a] = await t.parent.createEmbeddedDocuments("Item", [
        { name: `${t.name} Action`, type: "action", img: t.img, system, flags: { twod12: { [flag]: t.id } } }
      ]);
    } else {
      a = await Item.create({ name: `${t.name} Action`, type: "action", img: t.img, folder: t.folder?.id ?? null, system });
      await t.update({ "system.actions": [...t.system.actions, a.uuid] });
    }
    a?.sheet.render(true);
    if (a) await openActionGenerator({ item: a });
  }

  /** Talents that modify other Actions: add and remove a row. */
  static async addTalentMod() {
    const list = this.item.system.modifiers.map(m => ({ ...m }));
    list.push({ spec: "", when: "always", critical: "", effects: "" });
    await this.item.update({ "system.modifiers": list });
  }
  static async removeTalentMod(event, target) {
    const i = Number(target.dataset.index);
    await this.item.update({ "system.modifiers": this.item.system.modifiers.map(m => ({ ...m })).filter((m, k) => k !== i) });
  }

  static async removeSetting(event, target) {
    event?.preventDefault?.();
    event?.stopPropagation?.(); // the button sits in the setting's summary: don't toggle it
    const i = Number(target.dataset.index);
    const arr = foundry.utils.deepClone(this.item.toObject().system.settings);
    arr.splice(i, 1);
    const shift = k => (k > i ? k - 1 : k); // the open settings and the opened chip rows follow the ones after it
    this._openSettings = new Set([...(this._openSettings ?? [])].filter(k => k !== i).map(shift));
    this._shownPreds = new Set(
      [...(this._shownPreds ?? [])]
        .map(k => k.split(":"))
        .filter(([n]) => Number(n) !== i)
        .map(([n, f]) => `${shift(Number(n))}:${f}`)
    );
    await this.item.update({ "system.settings": arr });
  }
  /** The Steadiness buttons of a species (0 to 4). */
  static async setSteadiness(event, target) { await this.item.update({ "system.steadiness": Number(target.dataset.v) || 0 }); }

  static openVersions() {
    new VersionsEditor(this.item).render(true);
  }
}
