// The item sheet (every item type; the Details tab of an Effect is written as sentences: fxdetails.mjs).
import { rollSource } from "./rollsource.mjs";
import { TWOD12, categoryText, traitPicker, npcDamage, FREQ_COLORS, highlightText } from "./config.mjs";
import { npcSuggest } from "./npcbudget.mjs";
/** v0.0.407 (the Bestiary, the turn budget): the Builder's suggestion for an NPC's Action (Stage 0: its points and damage; later Stages: pack R's averages). */
export function npcActionSuggest(npc, s) {
  const rank = TWOD12.npcRoles[npc?.role] ? npc.role : "standard";
  if ((Number(npc?.stage) || 0) > 0) return npcDamage(rank, s.basicRating || "medium", npc.level).join(" / ");
  const ap = Math.max(1, ...(s.versions ?? []).map(v => Number(v.ap) || 0)), d = Number(String(s.distance ?? "").match(/\d+/)?.[0] ?? 0);
  return npcSuggest({ rank, rating: s.basicAttack ? (s.basicRating || "medium") : (npc?.ratings?.damage || "medium"), ap, freq: s.basicAttack ? "atwill" : s.frequency, basic: !!s.basicAttack, ranged: d > 2 || [...(s.traits ?? [])].includes("ranged") }).text;
}
import { versionRow } from "./actions.mjs";
import { versionStats, fmt } from "./calc.mjs";
import { buildWeaponCard } from "./preview.mjs";
import { openWeaponGenerator } from "./gen.mjs";
import { openActionGenerator } from "./genaction.mjs";
import { enableDragging } from "./drag.mjs";
import { effectSummary, familyColor } from "./fxdetails.mjs";
import { applyTab, dragData } from "./sheet-common.mjs";
import { attrLine, choicesToMake, freqOf, SECTION_FREQS } from "./classlevels.mjs";
import { itemInfo } from "./classwindow.mjs";
import { openLevelsEditor } from "./classeditor.mjs";
import { prereqText, prereqLine } from "./talents.mjs";
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class TwoD12ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  _activeTab = "description";
  // v0.0.324 (Lucas): the rules tab (Effects, Features, Talents) opens wider
  constructor(options = {}) {
    if (["effect", "feature", "talent"].includes(options.document?.type)) options.position = { ...(options.position ?? {}), width: 680 };
    if (options.document?.type === "action") options.position = { ...(options.position ?? {}), width: 900, height: 760 };   // v0.0.355 (PACK ACTION-SHEET): the page and the order of events
    super(options);
  }
  static DEFAULT_OPTIONS = {
    classes: ["twod12", "item"],
    position: { width: 560, height: 680 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      switchTab: TwoD12ItemSheet.switchTab,
      removeLink: TwoD12ItemSheet.removeLink,
      openLinked: TwoD12ItemSheet.openLinked,
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
      editLevels: TwoD12ItemSheet.editLevels,
      setClassField: TwoD12ItemSheet.setClassField,
      stepClassField: TwoD12ItemSheet.stepClassField
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
      // v0.0.291 (PACK NPC-SHEET): the Basic attack's rating and the average it suggests (the NPC's role and Stage)
      basicRatings: Object.fromEntries(Object.entries(TWOD12.npcRatings).filter(([k]) => it.parent?.system?.role !== "minion" || k !== "extreme").map(([k, v]) => [k, v.label])),
      basicSuggest: t === "action" && it.parent?.type === "npc" ? npcActionSuggest(it.parent.system, s) : "",   // v0.0.407: the turn budget at Stage 0
      // v0.0.172: the help tips (the grey hints) of the Action and Talent sheets can be hidden, like the Effect's (one choice per user, for both sheets).
      helpable: t === "talent",   // v0.0.374: the Class's help is the ? on the tab bar (frQ)   // v0.0.355: the Action's help is the ? on the tab bar (the rules tabs' way)
      sheetHelp: (() => { try { return game.settings.get("twod12", "sheetHelp") !== false; } catch (e) { return true; } })(),
      rawCard: t === "action" ? (this._soloCard = await (await import("./actioncard.mjs")).buildSoloCard(it)) : t === "weapon" ? await buildWeaponCard(it) : "",   // v0.0.322: the new card
      categoryShown: categoryText(s),
      enriched: await TE.enrichHTML(s.description ?? "", { relativeTo: it }),
      vsChoices: TWOD12.vsChoices,
      attrChoices: TWOD12.attributes,
      defensesList: t === "feature" ? s.defenses.map((d, i) => ({ i, attr: d.attr, bonus: d.bonus, tags: d.tags })) : [],
      ...(t === "effect" ? this._effectContext(s) : ["feature", "talent"].includes(t) ? this._passiveContext() : {}),
      // v0.0.323 (PACK EFFECT-SHEET): the new Details tab (fxsheet.mjs), and the ? on the tab bar
      fxHost: ["effect", "feature", "talent", "action"].includes(t),
      frQ: ["effect", "feature", "talent", "action", "class"].includes(t),   // v0.0.374: the ? on the tab bar (the Class too)
      fxTab: ["effect", "feature", "talent"].includes(t) ? await this._fxTab() : "",
      // v0.0.355 (PACK ACTION-SHEET): the Action's Details tab (actionsheet.mjs; Lucas's mockup A2)
      actionTab: t === "action" ? await this._actionTab() : "",
      // v0.0.333 (PACK RWI): an armor's (while worn) or a weapon's (while wielded) Immune / Resist / Weak lines, edited in the pick window
      dmgLinesHtml: ["armor", "weapon"].includes(t) ? (await import("./dmglines.mjs")).itemDamageHtml(this.item, { editable: this.isEditable }) : "",
      fxHeadLine: t === "effect" ? (this._fxExtra?.()?.headLine ?? "") : "",
      isPassiveHost: ["feature", "talent"].includes(t),
      freqChoices: TWOD12.frequencies,
      reactionKinds: { interrupt: "Interrupt", trigger: "Trigger" },
      moments: TWOD12.moments,   // v0.0.261
      momentUsedOn: TWOD12.momentTargets,   // v0.0.272 (named so: the template test reads "Targets" as the Targets field)
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
      hasMods: t === "talent" || (t === "action" && s.modifiers.length > 0),   // v0.0.355 (the audit's D25): a Talent's piece; on an Action only while it has some
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
      modOrderChoices: { either: "Either way (the player chooses)", weapon: "Weapon Modifier is the high one", power: "Power Modifier is the high one" },   // v0.0.305 (pack MOD)
      modLeadChoices: { weapon: "Weapon Modifier", power: "Power Modifier" },
      modStage2Choices: { "": "the higher one (default)", weapon: "Weapon Modifier", power: "Power Modifier" },
      isFeature: t === "feature",
      isEffect: t === "effect",
      styled: t !== "species",   // v0.0.168: the sheet's look (parchment, dark text); v0.0.185: Class too, Species keeps the old one until it is redone
      durationChoices: TWOD12.durationTypes,
      settingChoices: TWOD12.effectSettings,
      weaponUses: TWOD12.weaponUses,   // v0.0.207
      // v0.0.355 (the audit's D38): the old settings rows (settingsList) were built on every render and read by no template since v0.0.323: gone
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
      ...(t === "weapon" ? await (async () => { const { weaponGroupOf } = await import("./mastery.mjs"); const auto = weaponGroupOf({ name: it.name, system: { ...it.system, weaponGroup: "" } }); return { weaponGroupChoices: { "": `From its name${auto && TWOD12.weaponGroups[auto] ? ` (${TWOD12.weaponGroups[auto]})` : ": none"}`, ...TWOD12.weaponGroups } }; })() : {}),   // v0.0.343
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
    const repGroups = [...freqs.map(f => ({ label: SECTION_FREQS[f], fq: FREQ_COLORS[f] ?? FREQ_COLORS.none, list: rep.filter(c => freqOf(info(c.uuid)) === f) })), { label: "Other", fq: FREQ_COLORS.none, list: rep.filter(c => !freqs.includes(freqOf(info(c.uuid)))) }].filter((g, i) => g.list.length || i < freqs.length);
    // v0.0.374 (STYLE-2): the redone Details tab's choices as buttons side by side, the steppers' texts, Health by Stage with its totals
    const n = v => Number(v) || 0, sg = v => (n(v) > 0 ? `+${n(v)}` : String(n(v)));
    const opts = (cur, list) => list.map(([k, l]) => ({ k, l, on: String(cur ?? "") === k }));
    const seg = {
      armor: opts(s.armorTraining, Object.entries(TWOD12.armorTrainings)), armorField: "system.armorTraining",
      order: opts(s.modOrder, [["either", "the player's choice"], ["weapon", "Weapon"], ["power", "Power"]]), orderField: "system.modOrder",
      lead: opts(s.modPriority, [["weapon", "Weapon"], ["power", "Power"]]), leadField: "system.modPriority",
      stage2: opts(s.modStage2, [["", "the higher"], ["weapon", "Weapon"], ["power", "Power"]]), stage2Field: "system.modStage2"
    };
    // v0.0.407 (Stage 0 in Foundry): Stages 0 to 3, a step at Stages 1, 2 and 3
    const hp = { high1: n(s.healthHigh) + n(s.stepHigh1), high2: n(s.healthHigh) + n(s.stepHigh1) + n(s.stepHigh2), high3: n(s.healthHigh) + n(s.stepHigh1) + n(s.stepHigh2) + n(s.stepHigh3),
      low1: n(s.healthLow) + n(s.stepLow1), low2: n(s.healthLow) + n(s.stepLow1) + n(s.stepLow2), low3: n(s.healthLow) + n(s.stepLow1) + n(s.stepLow2) + n(s.stepLow3) };
    const w = [...(s.weaponAttrs ?? [])], p = [...(s.magicAttrs ?? [])];
    const shared = w.filter(k => p.includes(k)).map(k => TWOD12.attributes[k]);
    return {
      weapon: [w[0] ?? "body", w[1] ?? w[0] ?? "body"], power: [p[0] ?? "mind", p[1] ?? p[0] ?? "mind"], attrLine: attrLine(s, 1), shared: shared.join(" or "),
      oldMods: !(Number(s.modHigh) > 0 || Number(s.modLow) > 0) && (w.length || p.length) ? `${w.map(k => TWOD12.attributes[k]).join(" or ") || "-"} (Weapon) and ${p.map(k => TWOD12.attributes[k]).join(" or ") || "-"} (Power)` : "",
      levels: (s.levels ?? []).map((l, i) => { const c = choicesToMake(s, i + 1, info); return { n: i + 1, sections: l.sections.length, one: l.sections.length === 1, choices: c, oneChoice: c === 1 }; }),
      rep: repGroups, seg, hp, speedTxt: sg(s.speedMod), modHighTxt: sg(s.modHigh), modLowTxt: sg(s.modLow), attrLineHtml: highlightText(String(attrLine(s, 1) ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")),
      esc: [{ key: "escPassives", label: "Passives", fq: "#c9821f", list: (s.escPassives ?? []).map(chip) }, { key: "escActives", label: "Actives", fq: "#c9821f", list: (s.escActives ?? []).map(chip) }]
    };
  }

  /** A Feature's or Talent's passive: the same sentences as an Effect's settings. */
  /** v0.0.323 (PACK EFFECT-SHEET): the model of the new Details tab: the rules, the names and details of what was dropped, the origin, the help. */
  async _fxTab() {
    const it = this.item, s = it.system, host = it.type;
    const { fxTabHtml, dropInfo } = await import("./fxsheet.mjs");
    const plain = r => (typeof r?.toObject === "function" ? r.toObject() : r);
    const rules = (s.rules ?? []).map(plain);
    const refs = new Set();
    for (const r of rules) {
      if (r?.item) refs.add(r.item);
      if (r?.carry?.fx) refs.add(r.carry.fx);
      for (const d of r?.dmg?.list ?? []) if (d.fx) refs.add(d.fx);
      if (r?.setting?.fxUuid) refs.add(r.setting.fxUuid);
      for (const k of ["carry"]) if (r?.inside?.[k]?.fx) refs.add(r.inside[k].fx);
      if (r?.inside?.ht?.gives?.fx) refs.add(r.inside.ht.gives.fx);
    }
    // v0.0.327 (PACK ZONE): the Zone's dropped Effects, and the Action that places it ("From the Action")
    const zone = host === "effect" ? (s.zone ?? {}) : {};
    if (zone.inside?.carry?.fx) refs.add(zone.inside.carry.fx);
    if (zone.inside?.carry2?.fx) refs.add(zone.inside.carry2.fx);   // v0.0.351
    if (zone.inside?.ht?.gives?.fx) refs.add(zone.inside.ht.gives.fx);
    const items = {};
    for (const u of refs) { try { const d = /^(Compendium|Item|Actor|Scene)\./.test(u) ? await fromUuid(u) : null; const inf = await dropInfo(d); if (inf) items[u] = inf; } catch (e) { /* gone */ } }
    // a granted Action given by name (an older setting): find it on the creature or in the world for its card line
    for (const r of rules) if (r?.kind === "grant" && !r.item && r.itemName && !items[`name:${r.itemName}`]) {
      const d = it.parent?.items?.getName?.(r.itemName) ?? game.items?.getName?.(r.itemName);
      if (d) { const inf = await dropInfo(d); if (inf) items[`name:${r.itemName}`] = inf; }
    }
    let help = false;
    try { help = !!game.settings.get("twod12", "effectHelp"); } catch (e) { /* not registered */ }
    const anims = [["", "None"], ...Object.entries(CONFIG.Canvas?.lightAnimations ?? {}).map(([k, v]) => [k, (typeof v?.label === "string" && game.i18n?.localize?.(v.label)) || k])];
    const extra = this._fxExtra?.() ?? {};
    this._fr ??= { sel: "", own: false, names: {} };
    const onMap = host === "effect" && s.where === "map";
    const zoneAction = onMap ? await (await import("./zone.mjs")).actionPlacing(it.getFlag?.("twod12", "effectUuid") || it.getFlag?.("core", "sourceId") || it._stats?.compendiumSource || it.uuid) : null;
    this._fr.zoneAction = zoneAction;   // v0.0.327: a save writes the Action's Area line into the hover text (v0.0.328: after it is declared; before, every rules window failed to open)
    return fxTabHtml({
      where: onMap ? "map" : "creature", zone, zoneAction, canPlace: onMap && !!canvas?.ready && game.user.isGM,
      host, name: it.name, rules, ends: s.ends ?? {}, sel: this._fr.sel, own: this._fr.own, names: { ...this._fr.names, ...(extra.names ?? {}) }, items,
      originName: extra.originName ?? "", applied: extra.applied ?? null, hover: s.hover ?? "", help, lightAnims: anims, valuedHost: !!s.valued,
      auto: { rank: s.automation ?? "", note: s.automationNote ?? "", ranks: Object.entries(TWOD12.automationRanks ?? {}) },
      adv: { isCondition: !!s.isCondition, valued: !!s.valued, selfApplied: !!s.selfApplied, originFromUser: !!s.originFromUser }
    });
  }

  /** v0.0.355 (PACK ACTION-SHEET): the Action's Details tab: its data, the names of the Effects it applies, the card and the rules list. */
  async _actionTab() {
    const it = this.item, s = it.system;
    const { actionTabHtml } = await import("./actionsheet.mjs");
    const { parseAfter } = await import("./aftersteps.mjs");
    const { instanceText } = await import("./actions.mjs");
    const { ruleLabel, RULE_KINDS, normRule } = await import("./fxrules.mjs");
    const sys = it.toObject().system;
    sys.traits = [...(s.traits ?? [])];
    const st = (this._as ??= { v: 0, step: 0, show: {}, open: new Set(), stageOpen: -1 });
    const names = {}, lines = {};
    let zoneName = "";
    const refs = new Set();
    for (const v of sys.versions ?? []) {
      for (const t of ["all", "t1", "t2", "t3"]) for (const x of v.fx?.[t] ?? []) refs.add(x.uuid);
      for (const stp of parseAfter(v.after)) if (stp.kind === "Effect" && stp.head) refs.add(stp.head);
    }
    for (const u of refs) {
      try {
        const d = /^(Compendium|Item|Actor|Scene)\./.test(u) ? await fromUuid(u) : null;
        if (!d) continue;
        names[u] = d.name; lines[u] = String(d.system?.hover || d.system?.autoHover || "").replace(/\{origin\}/g, "you");
        if (d.system?.where === "map") zoneName ||= d.name;
      } catch (e) { /* gone */ }
    }
    let help = false;
    try { help = !!game.settings.get("twod12", "effectHelp"); } catch (e) { /* not registered */ }
    const rules = (sys.rules ?? []).map(normRule);
    return actionTabHtml({
      sys, v: st.v, step: st.step, show: st.show, open: st.open, stageOpen: st.stageOpen, names, lines, zoneName, help,
      card: this._soloCard ?? "", rulesTab: await this._fxTab(),
      ruleLabels: rules.map(r => ({ tile: RULE_KINDS[r.kind]?.tile ?? "?", cls: RULE_KINDS[r.kind]?.cls ?? "rule", label: ruleLabel(r, { names: {}, host: "action" }) })),
      dmgText: list => (list ?? []).map(instanceText).filter(Boolean).join(" + "), calc: this._versionRows(), onActor: !!it.parent,
      basicRatings: Object.entries(TWOD12.npcRatings ?? {}).filter(([k]) => it.parent?.system?.role !== "minion" || k !== "extreme").map(([k, v]) => [k, v.label]),
      basicSuggest: it.parent?.type === "npc" ? npcActionSuggest(it.parent.system, s) : ""
    });
  }

  /** v0.0.327 (PACK ZONE): "Place on the map" (Set here): the existing area placement with the Zone's shape and size, kept as this Zone; the origin is the
   *  selected token's creature (else the GM's character); ⌖ Change on the placed Zone's card can change it later. */
  async placeZone() {
    const { placeZoneItem } = await import("./zone.mjs");
    await placeZoneItem(this.item);   // v0.0.329: shared with dropping the Effect on the map
  }

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
    // v0.0.333 (PACK RWI): the "Damage lines" list: + Add and a chip (edit or remove) open the pick window
    this.element.querySelectorAll("[data-dl-add], [data-dl-edit]").forEach(b => b.addEventListener("click", async ev => {
      ev.preventDefault();
      const { editDamageLine } = await import("./dmglines.mjs"), d = b.dataset;
      await editDamageLine(this.item, b.hasAttribute("data-dl-edit") ? { kind: d.kind, code: d.sub, value: d.value === "" ? null : Number(d.value) } : null);
    }));
    this.element.querySelectorAll("details.setting").forEach(d =>
      d.addEventListener("toggle", () => {
        this._openSettings ??= new Set();
        const i = Number(d.dataset.i);
        if (d.open) this._openSettings.add(i);
        else this._openSettings.delete(i);
      })
    );
    this._effectListeners();
    // v0.0.323 (PACK EFFECT-SHEET): the new Details tab, and the ? that shows its help texts
    const frTab = this.element.querySelector(".fr-tab");
    // v0.0.355 (PACK ACTION-SHEET): an Action's tab wires itself; its rules list is the nested one (.as-rules)
    const asTab = this.element.querySelector(".as-tab");
    if (asTab) { import("./actionsheet.mjs").then(m => m.wireActionTab(this, this.element)); const inner = this.element.querySelector(".as-rules"); if (inner?.querySelector(".fr-tab")) import("./fxsheet.mjs").then(m => m.wireFxTab(this, inner)); }
    else if (frTab && !frTab.classList.contains("cls2")) import("./fxsheet.mjs").then(m => m.wireFxTab(this, this.element));   // v0.0.374: the Class's tab borrows the look only
    this.element.querySelector("[data-fr-q]")?.addEventListener("click", async ev => {
      ev.preventDefault();
      const on = !this.element.querySelector(".fr-tab")?.classList.contains("fr-helpon");
      this.element.querySelectorAll(".fr-tab").forEach(x => x.classList.toggle("fr-helpon", on));
      ev.currentTarget.classList.toggle("on", on); ev.currentTarget.setAttribute("aria-pressed", String(on));
      try { await game.settings.set("twod12", "effectHelp", on); } catch (e) { /* not registered */ }
    });
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
        ctx.mod = src.kind === "attribute" ? ctx.attrVal : (src.attrKey || ["class", "role"].includes(actor.system?.modSource) ? src.mod : null);   // pack MOD: a class value has no Attribute
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
  /** v0.0.374: the Class sheet's buttons side by side (a choice of few): set the field to the button's value. */
  static async setClassField(event, target) {
    const f = target.dataset.field;
    if (f?.startsWith("system.")) await this.item.update({ [f]: target.dataset.value ?? "" });
  }
  /** v0.0.374: the Class sheet's steppers (Rally, Speed, the two Modifiers). */
  static async stepClassField(event, target) {
    const f = target.dataset.field;
    if (!f?.startsWith("system.")) return;
    const cur = Number(foundry.utils.getProperty(this.item, f)) || 0, v = Math.min(Number(target.dataset.max ?? 99), Math.max(Number(target.dataset.min ?? -99), cur + Number(target.dataset.d)));
    if (v !== cur) await this.item.update({ [f]: v });
  }
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

}
