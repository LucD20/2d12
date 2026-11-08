// The character and NPC sheets.
import { prereqLine } from "./talents.mjs";
import { escalationModel, grantBadges } from "./escblock.mjs";

/** v0.0.198: the Basic Actions in their 4 groups (config basicGroups), each in its order; any other Basic Action goes in a fifth group. */
export function basicGroupsOf(rows) {
  const used = new Set(), out = [];
  for (const g of TWOD12.basicGroups) {
    // v0.0.289: the character sheet shows Opportunity Attack with the Reactions; the NPC sheet keeps it with the Attack group
    const list = [...g.names, ...(g.key === "attack" ? ["Opportunity Attack"] : [])].map(n => rows.find(r => r.name === n)).filter(Boolean);
    list.forEach(r => used.add(r));
    if (list.length) out.push({ key: g.key, label: g.label, rows: list });
  }
  const rest = rows.filter(r => !used.has(r));
  if (rest.length) out.push({ key: "other", label: "Other", rows: rest });
  return out;
}
import { masteryRows, masteryOf, setMastery, setCollapsed, techniqueState, startMasteryOf, chooseStartMastery } from "./mastery.mjs";
import { weaponRanges } from "./weaponrange.mjs";
import { defenseBonus, steadinessOf } from "./defense.mjs";
import { setWorn } from "./armor.mjs";
import { bumpExhausted, isExhaustedFx, exhaustedClick } from "./sleep.mjs";
import { autoChip, TWOD12, orderTraits, apLabel, traitChevrons, categoryText, unconsciousDoom, doomStatus, cardColorFor, effectiveFrequency, distanceText, areaText, lineColorFor, KIND_LINE, SIZE_NAMES, isTalentAction, tagChoices } from "./config.mjs";
import { rollCheck, rollTable, esc, sgn } from "./roll.mjs";
import { useAction, askRoll, adjLabelOf } from "./actions.mjs";
import { handleDrop } from "./grants.mjs";
import { hasLevels, classTabSections, classTalentSlots } from "./classwindow.mjs";
import { resolveModifiers } from "./effects.mjs";
import { buildRawCard, buildInfoCard, sendItemToChat } from "./preview.mjs";
import { openWeaponGenerator } from "./gen.mjs";
import { openActionGenerator } from "./genaction.mjs";
import { rollActorInitiative, combatantOf, getAP, setAP, spendAP, getRAP, setRAP } from "./combat.mjs";
import { healthView, donutPoolAt } from "./healthview.mjs";
import { applySpeedMods } from "./speedmods.mjs";
import { unloadedWeapon, costText, frequencyText, costGroup, groupRows, GROUP_BY, SORT_BY, sortKeyOf } from "./actionrows.mjs";
import { buildActionCard } from "./actioncard.mjs";
import { enableDragging, dropEffect } from "./drag.mjs";
import { isFaded, grantMatches, activeGrants } from "./usage.mjs";
import { chooseRecovery } from "./rest.mjs";
import { addBasicActions, missingBasic } from "./basic.mjs";
import { openEffectSheet } from "./fxopen.mjs";
import { applyTab, durationText, dragData } from "./sheet-common.mjs";
import { hoverOf, fxTipHtml, tipAttrs } from "./util.mjs";
import { effectWhat } from "./fxdetails.mjs";   // v0.0.267
import { WEAPON_WHERE, ARMOR_WHERE, weaponWhere, armorWhere, weaponMove, armorMove, handsFor, tierBoxes, handSlots, whereButtons, freeHandFor, useButtons, handOf, HAND_LABEL, handButtonsFor, freeHandButtons, oneHandedTwoHander } from "./loadout.mjs";
import { ensureHandsFor, releaseOptions, applyRelease, applyRegrip } from "./hands.mjs";
import { passiveSources } from "./passives.mjs";
import { weaponsFor, weaponCandidates, heldFirst, fistsOf, hasProp } from "./fists.mjs";
import { effectOff } from "./escalation.mjs";
import { npcBuilderContext, ratingUpdate, cvTip } from "./npcbuilder.mjs";
import { pcModel, handMenu, applyHandPick } from "./pcsheet.mjs";   // v0.0.289 (PACK SHEET): the character sheet's new layout
import { pickConfirm, pickKeepRemove } from "./pickwindow.mjs";
import { sysLine } from "./sysmsg.mjs";
// What keeps its scroll position when the sheet is drawn again (v0.0.165): the window, the side panel, the main pane and each tab.
// (v0.0.164's "scrollable" parts were not enough: the tab is shown after Foundry puts the position back, and a hidden element can't be scrolled.)
const SCROLL_SEL = ".window-content, .np, .mn, .ps-scroll, .tab[data-tab]";   // v0.0.289: .ps-scroll, the character sheet's tab pane
const scrollKey = el => (el.matches(".tab[data-tab]") ? `tab:${el.dataset.tab}` : el.classList.contains("np") ? "np" : el.classList.contains("ps-scroll") ? `ps:${el.querySelector(".tab.active")?.dataset.tab ?? ""}` : el.classList.contains("mn") ? "mn" : "window");
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;


export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  _activeTab = "actions";
  _filter = "all";
  _search = "";   // the Actions tab's Filter box (kept while the sheet is open)
  _open = new Set();   // Actions whose card is open in the table
  _openFeat = new Set();   // Feature cards opened on the Features tab (they start folded)
  rollOpts = { dc: 13, boons: 0, banes: 0 };

  static DEFAULT_OPTIONS = {
    classes: ["twod12", "twod12-actor"],
    position: { width: 900, height: 1100 },   // v0.0.289 (PACK SHEET): Lucas's design size
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      switchTab: CharacterSheet.switchTab, rollAttr: CharacterSheet.rollAttr, rollTable: CharacterSheet.rollTable,
      useAction: CharacterSheet.useAction, useWith: CharacterSheet.useWith, swapHands: CharacterSheet.swapHands, handBlocked: CharacterSheet.handBlocked, openItem: CharacterSheet.openItem, deleteItem: CharacterSheet.deleteItem,
      openEffect: CharacterSheet.openEffect, deleteEffect: CharacterSheet.deleteEffect, exhaustedUp: CharacterSheet.exhaustedUp, exhaustedDown: CharacterSheet.exhaustedDown,
      confirmDelete: CharacterSheet.confirmDelete,
      rollInitiative: CharacterSheet.rollInitiative, addBasic: CharacterSheet.addBasic, rest: CharacterSheet.rest, editSenses: CharacterSheet.editSenses,
      sendItem: CharacterSheet.sendItem, toggleGroup: CharacterSheet.toggleGroup, generateWeapon: CharacterSheet.generateWeapon, toggleLoaded: CharacterSheet.toggleLoaded,
      toggleFav: CharacterSheet.toggleFav, toggleDetails: CharacterSheet.toggleDetails, toggleEsc: CharacterSheet.toggleEsc, toggleEscPass: CharacterSheet.toggleEscPass, toggleGrant: CharacterSheet.toggleGrant, setFilter: CharacterSheet.setFilter, setView: CharacterSheet.setView,
      setHands: CharacterSheet.setHands, setWorn: CharacterSheet.setWorn, setEscalation: CharacterSheet.setEscalation, toggleEscalation: CharacterSheet.toggleEscalation, masteryStep: CharacterSheet.masteryStep, masteryCollapse: CharacterSheet.masteryCollapse, masteryOpen: CharacterSheet.masteryOpen, chooseStartMastery: CharacterSheet.chooseStartMastery, hpEdit: CharacterSheet.hpEdit,
      setHealthView: CharacterSheet.setHealthView, setApPip: CharacterSheet.setApPip, toggleRap: CharacterSheet.toggleRap,
      openSpecies: CharacterSheet.openSpecies,   // v0.0.244 (pack R): the Species window (the Health line's high side is chosen in the class window at level 1, v0.0.245: no swap after that)
      toggleCard: CharacterSheet.toggleCard, reloadFor: CharacterSheet.reloadFor, toggleBasic: CharacterSheet.toggleBasic,
      toggleFeat: CharacterSheet.toggleFeat, foldAll: CharacterSheet.foldAll, newGear: CharacterSheet.newGear, reloadWeapon: CharacterSheet.reloadWeapon,
      setWhere: CharacterSheet.setWhere, toggleItemFold: CharacterSheet.toggleItemFold,
      // v0.0.289 (PACK SHEET): Down mode's buttons, the Upkeep tab's Recovery, the Build tab's Review and the class card's Choices
      downChoice: CharacterSheet.downChoice, downCheck: CharacterSheet.downCheck, recover: CharacterSheet.recover, reviewSlots: CharacterSheet.reviewSlots, openClass: CharacterSheet.openClass
    }
  };
  static PARTS = { main: { template: "systems/twod12/templates/actor-sheet-pc.hbs" } };   // v0.0.289 (PACK SHEET); the NPC sheet keeps actor-sheet.hbs

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.tagChoices = tagChoices();   // the tags a creature can have (a world setting)
    const a = this.actor, s = a.system;
    const row = i => ({ id: i.id, name: i.name, img: i.img });
    return (
      Object.assign(ctx, {
        actor: a,
        system: s,
        opts: this.rollOpts,
        attrs: Object.entries(TWOD12.attributes).map(([k, label]) => ({
          key: k,
          label,
          value: s.attributes[k],
          text: s.attributes[k] >= 0 ? `+${s.attributes[k]}` : `\u2212${Math.abs(s.attributes[k])}`
        })),
        species: a.itemTypes.species.map(row),
        classes: a.itemTypes.class.map(row),
        features: a.itemTypes.feature.filter(f => f.getFlag("twod12", "grantedBy") !== "class").map(row),
        classTab: await this._classTab(),
        // The Notes tab (v0.0.134): Appearance, Background, Notes, and GM notes (only the GM sees them).
        notesFields: s.schema?.fields ?? {},
        notesEnriched: Object.fromEntries(await Promise.all(["appearance", "background", "notes", "gmNotes"].map(async k => [k, await foundry.applications.ux.TextEditor.implementation.enrichHTML(s[k] ?? "", { relativeTo: a, secrets: a.isOwner })]))),
        isGM: !!game.user?.isGM,
        weapons: a.itemTypes.weapon.map(w => ({
          ...row(w),
          wielded: w.system.wielded,
          hands: w.system.hands,
          hands1: w.system.hands < 2,
          hands2: w.system.hands >= 2,
          twohanded: w.system.traits.has("twohanded"),
          reloads: w.system.traits.has("reload"),
          unloaded: w.system.unloaded,
          handsWarn: w.system.wielded && w.system.traits.has("twohanded") && w.system.hands < 2
        })),
        missingBasic: missingBasic(a),
        ...this._talentSlots(),
        ...(await this._sheetModel())
      }) && Object.assign(ctx, { tf: this._tfModel(ctx) }) && Object.assign(ctx, { feat: a.type === "character" ? null : await this._featModel(ctx) })
      && Object.assign(ctx, { pc: (this._pcLast = a.type === "character" ? await pcModel(this, ctx) : null) })
    );
  }

  /**
   * The Features tab (v0.0.132): Class (its Features in your order, then the ones of later levels), Species, Talents (the slots) and
   * other Features. Each is a card; what it gives (Actions, chosen Actions, Features and Talents) is listed under it as rows like the
   * Actions table; a card that gives nothing shows its text.
   */
  async _featModel(ctx) {
    const a = this.actor, TE = foundry.applications.ux.TextEditor.implementation;
    const order = a.getFlag("twod12", "featureOrder") ?? [];
    const idx = id => { const k = order.indexOf(id); return k < 0 ? 9999 : k; };
    const short = t => (t.length > 80 ? `${t.slice(0, 78).trim()}\u2026` : t);
    const tipOf = it => hoverOf(it.system?.hover, it.system?.description);
    const passive = it => (it.system?.settings ?? []).length > 0;
    const minEsc = it => Math.max(0, ...(it.system?.settings ?? []).map(x => Number(x.minEscalation) || 0));
    const subRow = it => (it.type === "action" ? this._actionRow(it) : {
      id: it.id, name: it.name, costLabel: passive(it) ? "Passive" : (it.type === "talent" ? "Talent" : "Feature"), fq: KIND_LINE[it.type] ?? KIND_LINE.feature,
      range: (it.system?.settings ?? []).filter(x => x.type === "aura").map(x => `Aura ${x.auraSize}`).join(", ") || "\u2014",
      freqText: minEsc(it) ? `From Esc. ${minEsc(it)}` : "\u2014", open: !!this._open?.has(it.id), chips: []
    });
    // What an item gave: its own Actions, and what was chosen with it (with the Actions of a chosen Feature or Talent).
    const kidsOf = copy => {
      const out = [];
      const own = id => a.items.filter(i => i.type === "action" && (i.getFlag("twod12", "featureId") === id || (i.getFlag("twod12", "talentId") === id && !i.getFlag("twod12", "choice"))));
      out.push(...own(copy.id));
      for (const c of a.items.filter(i => i.getFlag("twod12", "talentId") === copy.id && i.getFlag("twod12", "choice"))) { out.push(c); if (c.type !== "action") out.push(...own(c.id)); }
      return [...new Set(out)].sort((x, y) => idx(x.id) - idx(y.id));
    };
    const card = async (it, o = {}) => {
      const sys = it.system ?? {}, rows = (o.rows ?? kidsOf(it)).map(subRow);
      const options = (sys.choiceOptions ?? []).filter(Boolean).length;
      let kind = o.kind ?? "Feature", detail = "";
      if (!o.kind && options) kind = "Choice";
      else if (!o.kind && passive(it) && !(sys.actions ?? []).length) kind = "Passive";
      if (!detail && sys.talents) detail = `${sys.talents} Talent slot${sys.talents === 1 ? "" : "s"}`;
      if (!detail && String(sys.hover ?? "").trim()) detail = short(tipOf(it));   // its own hover text; the description shows when the card is opened
      const key = it.id ?? it.uuid;
      // Opened: its description first, then what it grants.
      return { key, id: it.id, name: it.name, auto: autoChip(sys.automation, sys.automationNote), kind, kcls: kind.toLowerCase(), detail: o.detail ?? detail, tip: tipOf(it), rows, open: !!this._openFeat?.has(key), canRemove: !!o.canRemove,
        text: (await TE.enrichHTML(sys.description ?? "", { relativeTo: it })).trim() || (rows.length ? "" : "<p><em>No description.</em></p>") };
    };
    // Class: the granted Features in your order (level order at first), then the ones not reached yet.
    const cls = a.itemTypes.class[0];
    const classCards = [];
    // The pick Features (Encounter Pick, Daily Pick, Free Picks...: a choice whose name says Pick) go together in one "Class picks" card. v0.0.181: the Hallmark Action too.
    const isPick = it => (it.system?.choiceOptions ?? []).some(Boolean) && /\bpicks?\b|\bhallmark action\b/i.test(it.name);
    const pickCopies = [];
    // v0.0.186 (Lucas): Escalation is its own section, like Class and Talents: the class's Escalation Passives and Actives (its lists, or an
    // "Escalation" Category, or an Escalation cost), with when each works.
    const escList = new Set([...(cls?.system?.escPassives ?? []), ...(cls?.system?.escActives ?? [])]);
    const isEsc = it => !!it.system?.escalationPassive || escList.has(it.getFlag("twod12", "sourceUuid")) || /escalation/i.test(String(it.system?.category ?? "")) || Number(it.system?.escalation) > 0;   // v0.0.187: the Feature's own box first
    const escNow = Number(a.system.escalation) || 0;
    const escCards = [];
    const escCard = async it => {
      const cost = Number(it.system?.escalation) || 0, min = Math.min(...(it.system?.settings ?? []).map(x => Number(x.minEscalation) || 0).filter(n => n > 0), 99);
      const at = it.type === "action" ? cost : (min < 99 ? min : 0);
      const detail = it.type === "action" ? `needs Escalation ${cost}` : (at ? `works at Escalation ${at}+` : "always on");   // v0.0.289: nothing spends Escalation
      const c = await card(it, { kind: it.type === "action" ? "Active" : "Passive", detail, rows: it.type === "action" ? [it, ...kidsOf(it)] : undefined });
      return { ...c, kcls: `${c.kcls} esc${at && escNow >= at ? " esc-on" : ""}` };
    };
    for (const f of (ctx.classTab?.features ?? []).filter(x => x.unlocked).map((x, k) => ({ x, k })).sort((p, q) => idx(p.x.id) - idx(q.x.id) || p.k - q.k)) {
      const copy = a.items.get(f.x.id);
      if (!copy) continue;
      if (isEsc(copy)) escCards.push(await escCard(copy));
      else if (isPick(copy)) pickCopies.push(copy); else classCards.push(await card(copy));
    }
    // Class picks: first of the class. Opened, it shows the Attribute increases and Modifiers; it always lists what each pick chose.
    const picks = (ctx.classTab?.picks ?? "").split(" | ").filter(Boolean);
    if (cls && (picks.length || pickCopies.length || ctx.classTab?.pickSections?.length)) {
      const rows = [];
      for (const p of pickCopies) {
        const kids = kidsOf(p).map(subRow);
        rows.push({ isLabel: true, id: p.id, name: p.name, empty: !kids.length, tip: tipOf(p) }, ...kids);
      }
      // v0.0.185: a class with levels: one label per section reached, with what was chosen in it (and what that gave).
      for (const p of ctx.classTab?.pickSections ?? []) {
        const mine = [];
        for (const it of p.items) if (isEsc(it)) { if (!escCards.some(c => c.id === it.id)) escCards.push(await escCard(it)); } else mine.push(it);
        if (!mine.length && p.items.length) continue;   // a section of Escalation picks: they are in the Escalation section
        const kids = mine.flatMap(it => [it, ...(it.type === "action" ? [] : kidsOf(it))]).map(subRow);
        rows.push({ isLabel: true, id: "", name: `${p.title} (Level ${p.level})`, empty: !kids.length, tip: "" }, ...kids);
      }
      classCards.unshift({ key: "classpicks", name: "Class picks", kind: "Picks", kcls: "picks", detail: "", rows, open: !!this._openFeat?.has("classpicks"),
        text: picks.map(p => `<p>${esc(p)}</p>`).join("") });
    }
    // v0.0.186 (Lucas): the Features of higher levels are not shown until they are reached (no greyed cards).
    // (the cards of the levels not reached are no longer pushed)
    // Species: one card with what it gives.
    const sp = a.itemTypes.species[0];
    const spText = sp ? (() => {
      const ss = sp.system, L = TWOD12.attributes;
      const attrs = ss.pickTwo ? [...(ss.chosen ?? [])].map(k => `${L[k]} +1`) : Object.entries(ss.attributes ?? {}).filter(([, v]) => v).map(([k, v]) => `${L[k]} ${v > 0 ? "+" : "\u2212"}${Math.abs(v)}`);
      return [attrs.join(", "), `Speed ${ss.speed}`, `Reach ${ss.reach}`, `Size ${ss.size} (${SIZE_NAMES[ss.size] ?? ""})`].filter(Boolean).join(" \u00b7 ");
    })() : "";
    const species = sp ? await card(sp, { kind: "Species", detail: spText, rows: [], canRemove: true }) : null;
    // Talents: the slots as before (drop a Talent on one), then the extra Talents.
    const talentCard = async (t, where) => {
      const item = a.items.get(t.id);
      if (!item) return null;
      return card(item, { kind: "Talent", detail: where, rows: item.type === "action" ? [item, ...kidsOf(item)] : kidsOf(item), canRemove: true });
    };
    const slots = [];
    for (const sl of ctx.talentSlots ?? []) slots.push(sl.talent ? { card: await talentCard(sl.talent, `Slot from ${sl.feature}`) } : { key: sl.key, feature: sl.feature });
    const extras = (await Promise.all((ctx.talents ?? []).map(t => talentCard(t, "Extra")))).filter(Boolean);
    const filled = slots.filter(x => x.card).length;
    // v0.0.186 (Lucas): the Talents in subsections by Category (Combat, Mobility, Magic, Skill; "Other" for an Action that is a Talent), then the empty slots.
    const groupOf = c => { const it = a.items.get(c.id); return TWOD12.talentGroups[it?.system?.group] ?? "Other"; };
    const groupOrder = [...Object.values(TWOD12.talentGroups), "Other"];
    const talentGroups = groupOrder.map(label => ({ label, cards: [...slots.filter(x => x.card).map(x => x.card), ...extras].filter(c => groupOf(c) === label) })).filter(g => g.cards.length);
    const emptySlots = slots.filter(x => !x.card);
    const others = await Promise.all(a.itemTypes.feature.filter(f => !["class", "choice"].includes(f.getFlag("twod12", "grantedBy"))).sort((x, y) => idx(x.id) - idx(y.id)).map(f => card(f, { canRemove: true })));
    return {
      classTitle: cls ? `Class \u00b7 ${cls.name}` : "", classId: cls?.id ?? "", level: a.system.level, picks: (ctx.classTab?.picks ?? "").split(" | ").join(" \u00b7 "), classCards,
      species, slots, extras, talentGroups, emptySlots, escCards, escNow, talentNote: slots.length ? `${filled} of ${slots.length} slot${slots.length === 1 ? "" : "s"} filled` : (extras.length ? "" : "none yet"), others
    };
  }

  /** Open or fold a Feature card (they start folded; kept while the sheet is open). */
  static toggleFeat(event, target) {
    const c = target.closest(".fcard"), key = c?.dataset.fkey;
    if (!c || !key) return;
    const open = !c.classList.contains("open");
    c.classList.toggle("open", open);
    if (open) this._openFeat.add(key); else this._openFeat.delete(key);
  }

  /** Expand all / Collapse all on the Features tab. */
  static foldAll(event, target) {
    const open = target.dataset.open === "1";
    this.element.querySelectorAll('.tab[data-tab="class"] .fcard[data-fkey]').forEach(c => {
      c.classList.toggle("open", open);
      if (open) this._openFeat.add(c.dataset.fkey); else this._openFeat.delete(c.dataset.fkey);
    });
  }

  /** The Talents and Features tab: every Feature, Talent and chosen item as the same kind of row. */
  _tfModel(ctx) {
    const line = (id, kind) => { const it = id ? this.actor.items.get(id) : null; return it ? lineColorFor(it) : KIND_LINE[kind]; };
    const kids = list => (list ?? []).map(c => ({ id: c.id, name: c.name, img: c.img, sub: c.cat, apsHtml: c.apsHtml, traits: c.traits, child: true, canOpen: true, fq: line(c.id, "talent") }));
    const talentRow = (t, where) => ({ id: t.id, name: t.name, img: t.img, sub: [where, t.cat].filter(Boolean).join(" \u00b7 "), traits: t.traits, requirements: t.requirements, canOpen: true, canRemove: true, kids: kids(t.children), fq: line(t.id, "talent") });
    return {
      picks: (ctx.classTab?.picks ?? "").split(" | ").join(" \u00b7 "),
      classRows: (ctx.classTab?.features ?? []).map(f => ({ fq: line(f.id, "feature"), id: f.id ?? "", uuid: f.uuid, name: f.name, img: f.icon, sub: f.unlocked ? (f.cat || `Level ${f.level}`) : `Level ${f.level}`, locked: !f.unlocked, description: f.description, canOpen: !!f.id })),
      slots: (ctx.talentSlots ?? []).map(s => (s.talent ? { filled: true, row: talentRow(s.talent, s.feature) } : { filled: false, key: s.key, feature: s.feature })),
      extras: (ctx.talents ?? []).map(t => talentRow(t, "Extra")),
      others: (ctx.otherFeatures ?? []).map(f => ({ id: f.id, name: f.name, img: f.img, sub: f.cat, canOpen: true, canRemove: true, fq: line(f.id, "feature") }))
    };
  }

  /** Everything the redesigned sheet shows: sidebar, Actions (Granted, groups, Basic), Favorites and the weapons. */
  async _sheetModel() {
    const a = this.actor, s = a.system, isPc = a.type === "character";
    const sgnTxt = v => (v >= 0 ? `+${v}` : `\u2212${Math.abs(v)}`);
    const view = game.user.getFlag("twod12", "sheetView") ?? "normal";
    const sort = game.user.getFlag("twod12", "sheetSort") ?? "custom";
    const collapsed = new Set(game.user.getFlag("twod12", "collapsedGroups") ?? []);
    const favs = a.getFlag("twod12", "favorites") ?? [];
    const order = a.getFlag("twod12", "order") ?? [];
    const FREQ_ORDER = { atwill: 0, turn: 0.5, round: 1, encounter: 2, "": 3, none: 3 };
    const condensed = view === "condensed";
    const rowOf = async i => {
      const aps = i.system.versions.map(v => v.ap).sort((x, y) => x - y);
      const tr = orderTraits(i.system.traits ?? []).map(t => TWOD12.traits[t] ?? t);   // v0.0.179: the book's order (by group)
      const f = isFaded(a, i);
      return {
        id: i.id, name: i.name, img: i.img, apsHtml: apLabel(aps, i.system.reaction), minAp: aps[0] ?? 0,
        fq: cardColorFor(i.system), freqKey: FREQ_ORDER[effectiveFrequency(i.system)] ?? 3,
        traitShort: tr.slice(0, 3).join(" \u00b7 "), traitMore: Math.max(0, tr.length - 3), traitFull: tr.join(" \u00b7 "),
        faded: f.faded, fadedWhy: f.faded ? f.why : "", fav: favs.includes(i.id), group: this._groupOf(i),
        tip: condensed ? await buildRawCard(i) : ""
      };
    };
    // Weapon Techniques: not shown before their Mastery, nor while their weapon is not in hand (v0.0.213, Lucas: a Technique is used only with its own weapon).
    const actions = a.itemTypes.action.filter(i => techniqueState(a, i) === "ok");
    const all = await Promise.all(actions.filter(i => !i.getFlag("twod12", "basic")).map(rowOf));
    const pass = r => {
      const it = a.items.get(r.id)?.system;
      if (this._filter === "strikes") return it?.traits?.has("strike");
      if (this._filter === "move") return it?.traits?.has("move");
      if (this._filter === "reactions") return !!it?.reaction;
      return true;
    };
    const idx = id => { const k = order.indexOf(id); return k < 0 ? 9999 : k; };
    const cmp = {
      custom: (x, y) => idx(x.id) - idx(y.id) || x.name.localeCompare(y.name),
      name: (x, y) => x.name.localeCompare(y.name), cost: (x, y) => x.minAp - y.minAp || x.name.localeCompare(y.name),
      frequency: (x, y) => x.freqKey - y.freqKey || x.name.localeCompare(y.name), source: (x, y) => x.group.localeCompare(y.group) || x.name.localeCompare(y.name)
    }[sort] ?? ((x, y) => x.name.localeCompare(y.name));
    const shown = all.filter(pass).sort(cmp);
    const groups = sort === "custom"
      ? this._groupLabels.filter(l => l !== "Basic").map(label => { const rows = shown.filter(r => r.group === label); return { label, rows, count: rows.length, collapsed: collapsed.has(label) }; }).filter(g => g.rows.length)
      : [{ label: "", rows: shown, count: shown.length, collapsed: false }];
    const favorites = favs.map(id => all.find(r => r.id === id)).filter(Boolean);
    // The Actions table (v0.0.131): Group by and Sort by are each user's choice; the custom order is the creature's.
    const groupBy = game.user.getFlag("twod12", "sheetGroup") ?? "cost";
    const sortBy = sortKeyOf(sort);
    const actRow = i => this._actionRow(i);
    // v0.0.194: Escalation Actions live only in the Escalation block (escblock.mjs), not in the list or the Favorites.
    const isEscAct = i => Number(i.system?.escalation) > 0;
    const tableRows = actions.filter(i => !i.getFlag("twod12", "basic") && !isEscAct(i) && !i.getFlag("twod12", "inlineOf")).map(actRow);   // v0.0.255: an inline Action sits in the Granted area
    const escOpen = (game.user.getFlag("twod12", "escOpen") ?? {})[a.id];
    const esc = isPc || a.system?.useEscalation ? escalationModel(a, { actionRow: i => this._actionRow(i), isFaded, open: escOpen ?? null, openPass: this._escPass }) : { show: false };
    const actGroups = groupRows(tableRows, { groupBy, sort: sortBy, order, sourceLabels: this._groupLabels.filter(l => l !== "Basic") })
      .map(g => ({ ...g, collapsed: !!g.label && collapsed.has(g.label) }));
    // Granted: Actions an effect lets you use for free, with the uses left and where they came from.
    const granted = [];
    // v0.0.255 (Lucas): an inline Action (Beacon's Step) is a Granted ticket too, with its own icon, for as long as its effect lasts
    for (const it of actions.filter(i => i.getFlag("twod12", "inlineOf"))) {
      const e = a.effects.get(it.getFlag("twod12", "inlineOf")), dur = e ? durationText(e) : "", source = it.getFlag("twod12", "sourceName") || e?.name?.replace(/\s*\(.*\)\s*$/, "") || "";
      const tr = orderTraits(it.system.traits).map(t => TWOD12.traits[t] ?? t), row = this._actionRow(it), v = it.system.versions?.[0], cost = v ? `${v.ap}${it.system.reaction ? "R" : " AP"}` : "";
      granted.push({ key: `inline:${it.id}`, actionId: it.id, name: it.name, img: it.img, inline: true, apsHtml: "", cost, free: v?.ap === 0, traitShort: tr.slice(0, 3).join(" \u00b7 "), source, dur, left: 0, count: 0, badges: [], adds: [], range: row?.range ?? "", traits: tr.join(" \u00b7 "), open: !!this._openGrant?.has(`inline:${it.id}`),
        tip: [`From ${source}${dur ? ` · ${dur}` : ""}`, it.system.trigger ? `${it.system.reactionKind === "interrupt" ? "Interrupt" : "Trigger"}: ${it.system.trigger}` : ""].filter(Boolean).join(" · "), boxes: [] });
    }
    for (const e of a.effects) {
      for (const [gi, g] of (e.getFlag("twod12", "grants") ?? []).entries()) {
        if (!(g.left > 0)) continue;
        const act = actions.find(i => grantMatches(g.spec, i));
        const count = Math.max(g.count ?? g.left, g.left);
        const tr = act ? orderTraits(act.system.traits).map(t => TWOD12.traits[t] ?? t) : [];
        // v0.0.194 (Lucas, mockup granted-C2-ladder): a ticket: uses left, cost, source and duration, what it adds; expanded, the details.
        const bd = grantBadges(g, e), row = act ? this._actionRow(act) : null;
        const source = e.name.replace(/\s*\(.*\)\s*$/, ""), dur = durationText(e);
        granted.push({
          key: `${e.id}:${granted.length}`, actionId: act?.id ?? "", name: act?.name ?? g.spec.replace(/^(category|trait):/i, ""), img: act?.img ?? e.img,
          effectId: e.id, grantIndex: gi,   // v0.0.269: the ticket's button uses this very grant
          apsHtml: g.ap ? apLabel([g.ap]) : `<span class="apmark free" data-tooltip="A free use">Free</span>`, cost: g.ap ? `${g.ap} AP` : "Free", free: !g.ap,
          traitShort: tr.slice(0, 3).join(" \u00b7 "), source, dur, left: g.left, count, badges: bd.short, adds: bd.long,
          range: row?.range ?? "", traits: tr.join(" \u00b7 "), open: !!this._openGrant?.has(`${e.id}:${granted.length}`),
          tip: [`From ${source}${dur ? ` · ${dur}` : ""}`, `${g.left} of ${count} left`, ...bd.long].join(" · "),
          boxes: Array.from({ length: count }, (_, k) => ({ on: k < g.left }))
        });
      }
    }
    // Basic Actions, in a fixed order (Reload only with a Reload weapon in hand): their own section at the bottom, collapsed by default.
    const BASIC = ["basicWeaponAttack", "fists", "rally", "charge", "shove", "haul", "relocate", "trip", "advance", "safeMovement", "stand", "leaning", "interact", "reload"];
    const basics = (await Promise.all(actions.filter(i => i.getFlag("twod12", "basic")).map(async i => ({ ...(await rowOf(i)), key: i.getFlag("twod12", "basic") }))))
      .sort((x, y) => { const p = k => { const n = BASIC.indexOf(k); return n < 0 ? 99 : n; }; return p(x.key) - p(y.key) || x.name.localeCompare(y.name); });
    // Health (v0.0.130): the Donut or the Classic bars, a choice of each user. The tooltip has the Lethal and Nonlethal numbers.
    const d = s.damage, pool = Math.max(1, (s.bdt || 0) + (s.mdt || 0));
    const healthMode = game.user.getFlag("twod12", "healthView") === "classic" ? "classic" : "donut";
    const tip = `<div class="twod12 hptip"><div><b>Body</b> ${d.bodyLethal} Lethal &middot; ${d.bodyNonlethal} Nonlethal</div><div><b>Mind</b> ${d.mindLethal} Lethal &middot; ${d.mindNonlethal} Nonlethal</div><div>Bloodied at ${s.bdt} &middot; Strained at ${s.mdt} &middot; Down at ${pool}</div><div class="hint">Click a slice or bar to add damage, right-click to remove. Shift: Nonlethal. Ctrl: 5 at a time. Click a number to type it.</div><div class="hint">Darker: Nonlethal. Lighter or striped: damage past its threshold, spilled into the other part.</div></div>`;
    let down = null;
    if (s.atZero) {
      const st = k => a.statuses?.has(k);
      if (!isPc) down = { title: "Down", sub: s.zeroState ?? "" };
      else if (st("dying")) down = { title: "Dying", sub: st("unconscious") ? "Collapsed" : "Fighting", note: st("unconscious") ? "End of turn: Body Check, the Dying Table on a Tier 1." : "End of turn and when you take damage: Body Check." };
      else if (st("shattered")) down = { title: "Shattered", sub: st("unconscious") ? "Gave Up" : "Fighting", note: st("unconscious") ? "End of turn: Mind Check, the Shattered Table on a Tier 1." : "End of turn and when you take damage: Mind Check." };
      else if (st("desperate")) down = { title: "Desperate", sub: "" };
      else if (st("unconscious")) down = { title: "Unconscious", sub: "" };
      else down = { title: "Down", sub: s.zeroState ?? "" };
    }
    // Conditions: from damage first, then the effects with their duration.
    const conditions = [];
    // v0.0.253 (Lucas): the chips' tooltip is a hover card (the name and duration, a short description, the controls in small)
    if (s.bloodied) conditions.push({ name: "Bloodied", img: "icons/svg/blood.svg", dur: "from damage", tip: fxTipHtml({ name: "Bloodied", dur: "from damage", text: "Your Vigor damage is at or past your Vigor threshold. No effect by itself: the Escalation hooks and some cards read it.", controls: "It ends when the damage drops below the threshold." }) });
    if (s.strained) conditions.push({ name: "Strained", img: "icons/svg/daze.svg", dur: "from damage", tip: fxTipHtml({ name: "Strained", dur: "from damage", text: "Your Resolve damage is at or past your Resolve threshold. No effect by itself: the Escalation hooks and some cards read it.", controls: "It ends when the damage drops below the threshold." }) });
    // The Effects tab (v0.0.134): a status (a condition) is a chip; any other applied effect is a row with what it does and where it came from.
    // v0.0.255: a linked condition sits right after the effect that brought it (its chain icon points at it)
    for (const c of conditions) c.tipAttrs = tipAttrs(c.tip);   // v0.0.256: the card through data-tooltip-html (Foundry 13) and data-tooltip
    conditions.sort((x, y) => (conditions.findIndex(c => c.id === (x.linkedTo || x.id)) - conditions.findIndex(c => c.id === (y.linkedTo || y.id))) || ((x.linkedTo ? 1 : 0) - (y.linkedTo ? 1 : 0)));
    const fxEffects = [];
    const fxText = e => hoverOf(e.getFlag?.("twod12", "hover"), e.getFlag?.("twod12", "description") ?? e.description);
    for (const e of a.effects) {
      if ((s.bloodied && e.statuses?.has("bloodied")) || (s.strained && e.statuses?.has("strained"))) continue;   // already listed, from damage
      if (e.statuses?.size) {
        const counter = isExhaustedFx(e) && a.type === "character", by = e.origin && e.origin !== a.uuid ? (fromUuidSync(e.origin)?.name ?? "") : "";
        const linkedTo = e.getFlag?.("twod12", "linkedTo") ?? "", parent = linkedTo ? a.effects.get(linkedTo) : null;   // v0.0.255 (Lucas): a condition another effect brought is shown chained to it
        conditions.push({ id: e.id, name: e.name.replace(/\s*\(.*\)\s*$/, ""), img: e.img ?? "icons/svg/aura.svg", dur: durationText(e), counter, linkedTo, linkedName: parent?.name?.replace(/\s*\(.*\)\s*$/, "") ?? "",
          tip: fxTipHtml({ name: e.name, dur: durationText(e) || "until removed", text: fxText(e), what: effectWhat(e), source: by ? `From ${by}` : "", controls: counter ? "Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove" : "Click the name: open · ×: remove" }) });
        continue;
      }
      const by = e.origin && e.origin !== a.uuid ? (fromUuidSync(e.origin)?.name ?? "") : "";
      fxEffects.push({ id: e.id, name: e.name.replace(/\s*\(.*\)\s*$/, ""), img: e.img ?? "icons/svg/aura.svg", dur: durationText(e) || "until removed", text: fxText(e), source: by ? `From ${by}` : (e.origin && e.origin === a.uuid ? "From yourself" : ""), off: !!e.disabled });
    }
    // Passives from Features and Talents: one row per Escalation step; off now when its Escalation isn't reached.
    const fxPassives = passiveSources(a).map(p => {
      const itemId = p.id.split("-")[1], item = a.items.get(itemId), min = Number(p.flags.twod12.minEscalation) || 0;
      const off = effectOff(a, p);
      return { itemId, name: p.name, img: item?.img ?? "icons/svg/aura.svg", text: hoverOf(item?.system.hover, item?.system.description), source: `From ${item?.type === "talent" ? "the Talent" : "the Feature"}${min ? ` \u00b7 from Escalation ${min}` : " \u00b7 always"}`,
        off, offText: off ? `off now (Escalation ${Number(s.escalation) || 0})` : "" };
    });
    // The Items tab (v0.0.133): weapons and armor as cards, then gear and loot as a list; all in the creature's custom order (drag to reorder).
    const itemOrder = a.getFlag("twod12", "itemOrder") ?? [];
    const byOrder = (x, y) => { const i = id => { const k = itemOrder.indexOf(id); return k < 0 ? 9999 : k; }; return i(x.id) - i(y.id); };
    // v0.0.139: the loadout (hand and armor slots) and the Weapons and Armor lists, each item where it is (loadout.mjs).
    const weapons = [...a.itemTypes.weapon].sort(byOrder);
    const weaponSub = w => {
      const t = w.system.traits, r = weaponRanges(w, s.reach ?? 1);
      return [w.system.subtype ? TWOD12.subtypes[w.system.subtype] : "", t.has("melee") ? `Melee${r.melee ? ` ${r.melee}` : ""}` : "", t.has("ranged") ? `Ranged${r.ranged ? ` ${r.ranged}` : ""}` : "",
        t.has("thrown") ? "Thrown" : "", t.has("long") ? "Long" : "", t.has("reload") ? "Reload" : "", t.has("twohanded") ? "Two-handed" : "", t.has("nonthreatening") ? "Non-threatening" : ""].filter(Boolean).join(" \u00b7 ");
    };
    const weaponRows = weapons.filter(w => weaponWhere(w) !== "none").map(w => {   // v0.0.141: Fists (no hand) are not listed
      const where = weaponWhere(w), t = w.system.traits;
      return { id: w.id, name: w.name, sub: weaponSub(w), tiers: tierBoxes(w), where, dropped: where === "dropped",
        seg: whereButtons("weapon", where),
        unloaded: t.has("reload") && !!w.system.unloaded, warn: where === "1h" && t.has("twohanded") };
    });
    const training = TWOD12.armors[s.armorTraining]?.rank ?? 3;
    const armorRow = ar => {
      const cat = TWOD12.armors[ar.system.category] ?? { label: "", value: 0 }, bonus = Number(ar.system.bonus) || 0, where = armorWhere(ar);
      return { id: ar.id, name: ar.name, where, dropped: where === "dropped", sub: [cat.label, ar.system.properties || ""].filter(Boolean).join(" \u00b7 "),
        boxes: [{ l: "Armor", v: TWOD12.defenseBase + (cat.value ?? 0) + bonus }, { l: "Ward", v: `+${Number(ar.system.ward) || 0}` }],
        seg: whereButtons("armor", where),
        untrained: isPc && where === "worn" && (cat.rank ?? 0) > training };
    };
    const armorRows = [...(a.itemTypes.armor ?? [])].sort(byOrder).map(armorRow);
    const wornArmor = armorRows.find(r => r.where === "worn");
    const fold = game.user.getFlag("twod12", "itemFold") ?? {};
    const loadout = {
      hands: (sl => sl.map(slot => (slot.free ? slot : { ...slot, ...weaponRows.find(r => r.id === slot.id), label: slot.label, swap: slot.hand === "main" && !sl.some(x => x.free) })))(handSlots(weapons)),   // v0.0.208: Swap on the main hand when both hold a weapon
      armor: (isPc ? wornArmor : null) ?? { free: true, text: isPc ? "Unarmored" : "Stat block", sub: isPc ? "Armor 11 · Ward +0" : `AD ${s.armorDC ?? 13} · WD ${s.wardDC ?? 13} (armor items are loot)` }
    };
    const fmtN = n => String(Math.round(n * 100) / 100);
    const gear = [...(a.itemTypes.gear ?? [])].sort(byOrder).map(g => {
      const q = Number(g.system.quantity) || 0, w = Number(g.system.weight) || 0, c = Number(g.system.cost) || 0;
      return { id: g.id, name: g.name, img: g.img, qty: q, weight: w ? fmtN(w * q) : "\u2014", cost: c ? fmtN(c * q) : "\u2014", tip: hoverOf("", g.system.description), eachTip: `Each: ${w ? `weight ${fmtN(w)}` : "no weight"}, ${c ? `cost ${fmtN(c)}` : "no cost"}` };
    });
    const gearWeight = fmtN((a.itemTypes.gear ?? []).reduce((n, g) => n + (Number(g.system.weight) || 0) * (Number(g.system.quantity) || 0), 0));
    return {
      isPc,
      isNpc: !isPc,
      view,
      condensed,
      sort,
      filter: this._filter,
      filters: [
        ["all", "All"],
        ["strikes", "Strikes"],
        ["move", "Move"],
        ["reactions", "Reactions"]
      ].map(([k, l]) => ({ k, l, on: this._filter === k })),
      views: [
        ["normal", "Normal"],
        ["condensed", "Condensed"]
      ].map(([k, l]) => ({ k, l, on: view === k })),
      sorts: { custom: "Custom order", name: "Name", cost: "Cost", frequency: "Frequency", source: "Source" },
      groups,
      actGroups,
      groupByChoices: GROUP_BY,
      hasTechniques: a.itemTypes.action.some(i => i.system?.category === "Weapon Technique"),
      masteryOpen: [...(this._masteryOpen ?? [])], isGMUser: game.user.isGM,
      sortByChoices: SORT_BY,
      groupBy,
      sortBy,
      actSearch: this._search ?? "",
      basicOpen: !!game.user.getFlag("twod12", "basicOpen"),
      basicRows: basics.map(b => actRow(a.items.get(b.id))),
      basicGroups: basicGroupsOf(basics.map(b => actRow(a.items.get(b.id)))),
      // The Favorites tab (v0.0.137): the same rows as the Actions table, in the Favorites' own order.
      favRows: favs.map(id => a.items.get(id)).filter(i => i?.type === "action" && !(Number(i.system?.escalation) > 0)).map(actRow), esc,
      favorites,
      granted,
      basics,
      weaponRows,
      armorRows,
      loadout,
      fold: { weapons: !!fold.weapons, armor: !!fold.armor },
      armorSummary: armorRows.map(r => `${r.name} ${ARMOR_WHERE[r.where].toLowerCase()}`).join(" \u00b7 "),
      weaponSummary: weaponRows.map(r => `${r.name} ${(WEAPON_WHERE[r.where] ?? "").toLowerCase()}`).join(" \u00b7 "),
      gear,
      gearWeight,
      armorTrainingLabel: TWOD12.armorTrainings[s.armorTraining] ?? "",
      noArmorNote: !isPc && !(a.itemTypes.armor ?? []).some(x => x.system.worn),
      conditions,
      fx: { conditions, effects: fxEffects, passives: fxPassives },
      escPips: a.type === "character" || s.useEscalation ? [1, 2, 3].map(n => ({ n, on: (Number(s.escalation) || 0) >= n })) : null,
      npcEsc: a.type === "npc", npcEscOn: !!s.useEscalation,
      mastery: a.type === "character" ? masteryRows(a).map(r => ({ ...r, open: !!this._masteryOpen?.has(r.key) })) : null,   // the Mastery tab (mastery.mjs)
      startMastery: startMasteryOf(a), showMastery: a.type === "character",
      escNow: Number(s.escalation) || 0,
      armorTypeChoices: Object.fromEntries(Object.entries(TWOD12.armors).map(([k, v]) => [k, v.label])),
      armorChoices: Object.fromEntries(Object.entries(TWOD12.armors).map(([k, v]) => [k, `${v.label} (${11 + v.value})`])),
      // The side panel (v0.0.130): Defenses, Attributes, Modifiers, Movement. A number shows its CURRENT value; against the base
      // (gear and always-on passives) it is green when a temporary effect or an Escalation passive makes it better, red when worse.
      // An editable one shows the number to type when clicked.
      panel: (() => {
        const tile = (label, now, ref, o = {}) => ({ label, value: now, base: o.base ?? ref, edit: o.edit ?? "", cls: now < ref ? "down" : now > ref ? "up" : "",
          tip: [o.tip ?? "", now !== ref ? `Base ${ref}, now ${now}` : "", o.edit ? "Click to edit" : ""].filter(Boolean).join(" \u00b7 ") });
        const npc = a.type === "npc", none = new Set();
        const armorNow = (s.armorDC ?? 11) + defenseBonus(a, "armor", none).total, armorRef = (s.armorDC ?? 11) + defenseBonus(a, "armor", none, { baseOnly: true }).total;
        const wardNow = (s.wardDC ?? 11) + defenseBonus(a, "ward", none).total, wardRef = (s.wardDC ?? 11) + defenseBonus(a, "ward", none, { baseOnly: true }).total;
        const armorType = TWOD12.armors[s.armorKey ?? s.armor] ?? TWOD12.armors.unarmored;
        const wornName = s.armorItemId ? s.armorLabel : "";
        const speedNow = s.moveSpeed ?? s.speed ?? 0, speedRef = s.speed === undefined ? speedNow : applySpeedMods(a, s.speed, { baseOnly: true });
        const pw = s.powerAttribute ?? s.magicAttribute;
        const modTile = (label, attr, mod, tip) => ({ label, value: attr ? sgnTxt(mod) : "\u2014", tip: attr ? tip : "" });
        return [
          { key: "defs", title: "Defenses", cols: 2, tiles: [
            npc ? tile("AD", armorNow, armorRef, { tip: "Armor Defense (AD), against Weapon Actions and Fists: from its rating (Builder tab) + bonuses. Its armor items are loot" })
              : tile(armorType.value ? `AD \u00b7 ${armorType.label[0]}` : "AD", armorNow, armorRef, { base: s.armorDC ?? 11,
                tip: `Armor Defense (AD): 11 + Armor value + bonuses. ${armorType.label} armor${wornName ? `: ${wornName}` : ""}. Against Weapon Actions and Fists (from the armor you wear, Items tab)` }),
            npc ? tile("WD", wardNow, wardRef, { tip: "Ward Defense (WD), against Power Actions: from its rating (Builder tab) + bonuses" })
              : tile("WD", wardNow, wardRef, { tip: `Ward Defense (WD), against Power Actions: 11 + Power Modifier (${sgnTxt(s.powerMod ?? 0)}) + Ward value (charms, holy symbols, features; a worn Warded armor adds its own) + bonuses` })
          ], warn: s.armorUntrained ? "Untrained armor" : "",
          warnTip: `Your armor is beyond your Armor Training (${TWOD12.armorTrainings[s.armorTraining] ?? ""}): all your Rolls are Doomed, and Actions against your Armor Defense or Ward Defense are Favored.` },
          { key: "attrs", title: "Attributes", cols: 2, tiles: Object.entries(TWOD12.attributes).map(([k, label]) => ({ label, roll: k, value: sgnTxt(s.attributes?.[k] ?? 0),
            input: "", tip: `Roll a ${label} Check. Save DC ${s.saveDC?.[k] ?? "\u2014"} (@${k}.dc)` })) },
          { key: "mods", title: "Modifiers", cols: npc ? 2 : 3, tiles: [
            modTile("Weapon", s.weaponAttribute, s.weaponMod, `Weapon Modifier, from ${TWOD12.attributes[s.weaponAttribute]}. Save DC ${s.saveDC?.weapon ?? "\u2014"} (@weapon.dc)`),
            modTile("Power", pw, s.powerMod ?? s.magicMod, `Power Modifier, from ${TWOD12.attributes[pw]}. Save DC ${s.saveDC?.power ?? "\u2014"} (@power.dc)`),
            ...(npc ? [] : [modTile("Signature", s.signatureAttribute, s.signatureMod, `Signature Modifier: the ${s.signatureFrom === "power" ? "Power" : "Weapon"} Modifier (${TWOD12.attributes[s.signatureAttribute]}). Save DC ${s.saveDC?.signature ?? "\u2014"} (@signature.dc)`)])
          ] },
          { key: "move", title: "Movement", cols: 4, tiles: [
            tile("Speed", speedNow, speedRef, { base: s.speed ?? 0, tip: npc ? "From the Builder tab" : "From your species and class" }),
            tile("Reach", s.reach ?? 1, s.reach ?? 1, { edit: npc ? "reach" : "", base: npc ? (s.reachBase ?? s.reach ?? 1) : (s.reach ?? 1), tip: npc ? "" : "From your species" }),
            tile("Size", s.size ?? 3, s.size ?? 3, { edit: npc ? "size" : "", tip: `SR ${s.size ?? 3}: ${SIZE_NAMES[s.size ?? 3] ?? ""}` }),
            // Steadiness (v0.0.169; always shown since v0.0.172, even at 0): it reduces the value of Forced Movement and Reposition.
            tile("Steady", steadinessOf(a).total, s.steadiness ?? 0, { tip: `Steadiness ${s.steadiness ?? 0}: reduces the value of Forced Movement and Reposition against you (you can choose not to apply it)${npc ? ". Set it in the Builder tab" : ". From your species"}` })
          ] }
        ];
      })(),
      // The header band: what the creature is, its AP in combat, and Escalation (PCs) or the Health Pool (NPCs).
      head: (() => {
        const c = combatantOf(a), ap = c ? getAP(c) : 0, rap = c ? getRAP(c) : 0;
        const tags = [...(s.tags ?? [])].map(t => tagChoices()[t] ?? t).join(", ");
        // v0.0.243 (pack R): 4 AP and the Reaction AP (the last pip, a diamond with an R: it pays only for Reactions); out of its turn the kept AP are Guard.
        return {
          size: SIZE_NAMES[s.size ?? 3] ?? "", tags, role: s.roleLabel ?? "", cv: s.cv ?? "",
          cvTip: a.type === "npc" ? cvTip(TWOD12.npcRoles[s.role] ?? TWOD12.npcRoles.standard) : "",
          ap: { inCombat: !!c, pips: Array.from({ length: Math.max(Number(s.apPerTurn) || TWOD12.apPerTurn, ap) }, (_, k) => ({ n: k + 1, on: k < ap })), rap: !!rap,
            tip: c ? `${ap} AP${s.apGuard ? ` (Guard ${s.apGuard} from the AP its last turn left unused, 1 round)` : ""}, Reaction AP ${rap ? "ready" : "spent"}. Click a pip to correct the AP (it is said in the chat); click the R to spend or give back the Reaction AP.` : `Not in combat: ${Number(s.apPerTurn) || TWOD12.apPerTurn} AP and 1 Reaction AP are regained at the start of each turn in combat.` }
        };
      })(),
      health: {
        pool,
        v: healthView(s),
        donut: healthMode === "donut",
        views: [["donut", "Donut"], ["classic", "Classic"]].map(([k, l]) => ({ k, l, on: healthMode === k })),
        tip,
        down
      },
      otherFeatures: a.itemTypes.feature
        .filter(f => !["class", "choice"].includes(f.getFlag("twod12", "grantedBy")))
        .map(f => ({ id: f.id, name: f.name, img: f.img, cat: categoryText(f.system) }))
    };
  }

  /** One row of the Actions table (also the rows under a Feature): cost, range, Frequency, faded and why, Unloaded. */
  _actionRow(i) {
    const a = this.actor, it = i.system, f = isFaded(a, i), out = unloadedWeapon(a, i);
    // v0.0.289 (PACK SHEET): the Fists' Distance is the Fists' own Range (it said "Weapon")
    const fistsRow = it.weaponUse === "fists" || i.getFlag("twod12", "basic") === "fists";
    const weapon = a.items.get(i.getFlag("twod12", "weaponId")) ?? (fistsRow ? fistsOf(a) : null) ?? (it.traits?.has?.("weapon") ? (weaponsFor(a, i)[0] ?? null) : null);
    const aps = (it.versions ?? []).map(v => Number(v.ap) || 0);
    // On the row only Unloaded; what effects change shows on the card when the row is opened (v0.0.132).
    const chips = out ? [{ text: "Unloaded", cls: "down", why: `${out.name} must be reloaded first (Reload, 1 AP)` }] : [];
    // v0.0.224 (Lucas, playtest 3): three limits, three looks: a used Frequency greys the row; too few AP dims its cost and dice; 3 Strikes made
    // this turn put a red diamond before its name.
    const cbt = game.combat?.started ? combatantOf(a, game.combat) : null, apNow = cbt ? getAP(cbt) + (it.reaction ? getRAP(cbt) : 0) : null;   // v0.0.243: a Reaction can use the Reaction AP
    const minCost = Math.min(...(it.versions ?? []).map(v => Number(v.ap) || 0), 99);
    const noAp = apNow !== null && minCost < 99 && minCost > apNow, strikeCap = !!f.strikeCap;
    // v0.0.182: a granted use waiting (Double Shot's Weapon Attacks): the use button turns blue and uses it.
    const g = activeGrants(a, i)[0];
    // v0.0.208 (W): a [Weapon] Action that picks its weapon gets a button per hand (2H, or M and O); one weapon that fits: its name on the tooltip.
    // v0.0.209: Reload offers only the Reload weapons; a Weapon Technique shows the hand that holds its weapon; the Fists (and Pummel) the free hands.
    const isW = !!it.traits?.has?.("weapon"), linkedId = i.getFlag("twod12", "weaponId"), fistsUse = it.weaponUse === "fists" || i.getFlag("twod12", "basic") === "fists";
    let picks = isW && !linkedId && !it.weaponUse && !fistsUse ? heldFirst(weaponCandidates(a, i)) : null;
    if (picks && i.getFlag("twod12", "basic") === "reload") picks = picks.filter(w => hasProp(w, "reload"));
    const ordered = isW ? this._weaponsInOrder() : null;
    const hands = !isW ? null : linkedId ? handButtonsFor(ordered, linkedId) : fistsUse ? freeHandButtons(ordered, fistsOf(a)?.id) : picks ? useButtons(ordered, new Set(picks.map(w => w.id))) : null;
    const useTip = picks?.length === 1 ? `Use ${i.name} with ${picks[0].name}${(h => (h ? ` (${HAND_LABEL[h].toLowerCase()})` : ""))(handOf(ordered, picks[0].id))}` : `Use ${i.name}`;
    const grant = g ? { tip: `Granted by ${g.effect.name.replace(/\s*\(.*\)\s*$/, "")}: ${g.grant.left} use${g.grant.left === 1 ? "" : "s"} left, ${g.grant.ap ? `${g.grant.ap} AP` : "free"}. Click to use it; Shift-click for a normal use.` } : null;
    const solo = !hands && picks?.length === 1 ? { id: picks[0].id, name: picks[0].name, hand: handOf(ordered, picks[0].id) } : null;   // v0.0.289: one weapon that fits
    return {
      grant, hands, useTip, solo, isWeapon: isW, weapon,
      id: i.id, name: i.name, costLabel: costText(i), cost: costGroup(i), fq: cardColorFor(it), freq: effectiveFrequency(it), freqText: frequencyText(i, (a.getFlag("twod12", "dailyUsed") ?? []).includes(i.id)),
      // v0.0.168: a number reads as squares ("5 sq."); words (Weapon, Reach, Self) and bands (10/20/40) stay
      range: ((r => (/^\d+$/.test(r) ? `${r} sq.` : r))((areaText(it) || distanceText(it, weapon) || "\u2014"))),
      escText: Number(it.escalation) > 0 ? `Esc. ${Number(it.escalation)}+` : "", chips,   // v0.0.289: a requirement, never a cost
      faded: f.faded || !!out, fadedWhy: out ? `Unloaded: ${out.name} must be reloaded first` : (f.faded ? f.why : ""), unloaded: !!out,
      noAp, noApWhy: noAp ? `Not enough AP: it costs ${minCost}${it.reaction ? "R" : ""}, ${apNow} left${it.reaction ? " (the Reaction AP and the kept AP)" : ""}` : "", strikeCap, strikeWhy: strikeCap ? "3 Strikes made this turn: no more Strikes until the next turn" : "",
      open: !!this._open?.has(i.id), minAp: aps.length ? Math.min(...aps) : 0, source: this._groupOf(i),
      strike: !!(it.traits?.has?.("strike") ?? (Array.isArray(it.traits) && it.traits.includes("strike"))),   // v0.0.165: a red line at the start of the row
      search: [i.name, ...[...(it.traits ?? [])].map(t => TWOD12.traits[t] ?? t)].join(" ").toLowerCase()
    };
  }

  _groupLabels = ["Class", "Talents", "Items", "Other", "Basic"];
  _groupOf(i) { return i.getFlag("twod12", "talentId") || isTalentAction(i) ? "Talents" : i.getFlag("twod12", "basic") ? "Basic" : i.getFlag("twod12", "weaponId") ? "Items" : (i.getFlag("twod12", "featureId") || i.getFlag("twod12", "classLevel") || i.getFlag("twod12", "inlineOf") ? "Class" : "Other"); }

  async _classTab() {
    const cls = this.actor.itemTypes.class[0];
    if (!cls) return null;
    const TE = foundry.applications.ux.TextEditor.implementation;
    const s = cls.system, L = TWOD12.attributes;
    const granted = this.actor.itemTypes.feature;
    const rows = [];
    let pickSections = null;
    // v0.0.185: a class with levels: the Features of its Granted sections, its picks by section, and the sections of the levels not reached.
    if (hasLevels(cls)) {
      const t = classTabSections(this.actor, cls);
      for (const { it, level } of t.granted) rows.push({ name: it.name, icon: it.img, uuid: it.getFlag("twod12", "sourceUuid") ?? "", id: it.id, level, cat: categoryText(it.system), unlocked: true, description: await TE.enrichHTML(it.system.description ?? "", { relativeTo: it }) });
      for (const l of t.locked) rows.push({ name: l.title, icon: cls.img, uuid: "", lockKey: l.key, id: "", level: l.level, cat: "", unlocked: false, description: "" });
      pickSections = t.picks;
    } else for (const f of s.features) {
      const src = await fromUuid(f.uuid);
      const copy = granted.find(g => g.getFlag("twod12", "sourceUuid") === f.uuid);
      rows.push({
        name: src?.name ?? "(missing item)", icon: src?.img ?? "icons/svg/mystery-man.svg", uuid: src?.uuid ?? "", id: copy?.id ?? "", level: Math.max(1, src?.system.level || 1), cat: src ? categoryText(src.system) : "", unlocked: !!copy,
        description: copy ? await TE.enrichHTML(copy.system.description ?? "", { relativeTo: copy }) : ""
      });
    }
    rows.sort((x, y) => x.level - y.level);
    return {
      name: cls.name, features: rows, pickSections,
      picks: (() => {
        const as = this.actor.system;
        const both = `${as.modConflict ? ` | Both Modifiers wanted the same Attribute: the ${s.modPriority === "power" ? "Power" : "Weapon"} Modifier kept it (change it on the class)` : ""}`;
        return `+1 ${L[s.chosenA] ?? "-"}, +1 ${L[s.chosenB] ?? "-"} | Weapon Modifier: ${L[as.weaponAttribute] ?? "-"} | Power Modifier: ${L[as.powerAttribute] ?? "-"}${both}`;
      })()
    };
  }

  /** Where the sheet is scrolled, kept before it is drawn again (v0.0.165). */
  async _preRender(context, options) {
    await super._preRender?.(context, options);
    this._scrolls = this.element ? [...this.element.querySelectorAll(SCROLL_SEL)].map(el => [scrollKey(el), el.scrollTop]).filter(([, t]) => t > 0) : [];
  }
  /** Puts the scroll positions back once the active tab is shown (now, and again on the next frame). */
  _restoreScroll() {
    const saved = this._scrolls ?? [];
    if (!saved.length || !this.element) return;
    const put = () => { for (const el of this.element.querySelectorAll(SCROLL_SEL)) { const hit = saved.find(([k]) => k === scrollKey(el)); if (hit && el.scrollTop !== hit[1]) el.scrollTop = hit[1]; } };
    put(); requestAnimationFrame(put);
  }

  _onRender(context, options) {
    super._onRender?.(context, options);
    this._editableMods();
    this.element.classList.add("twod12-actor");   // the sheet fills the window under Foundry's title bar (no padding)
    this.element.style.setProperty("padding", "0", "important");   // the window itself had the 8px (v0.0.138)
    // Whatever stylesheet adds room around the content, the sheet fills the window (an inline !important wins over all of them).
    const wc = this.element.querySelector(".window-content");
    for (const el of [wc, wc?.firstElementChild]) if (el) { el.style.setProperty("padding", "0", "important"); el.style.setProperty("margin", "0", "important"); }
    // v0.0.137: the sheet is pinned to the four edges of the window's content (no scrollbar gutter, no leftover height or width).
    if (wc) for (const [k, v] of [["border", "none"], ["position", "relative"], ["overflow", "hidden"], ["scrollbar-gutter", "auto"]]) wc.style.setProperty(k, v, "important");
    const root = wc?.querySelector(":scope > .twod12.sheet");
    if (root) for (const [k, v] of [["position", "absolute"], ["inset", "0"], ["width", "auto"], ["height", "auto"]]) root.style.setProperty(k, v, "important");
    applyTab(this);
    this._restoreScroll();   // after the active tab is shown (v0.0.165)
    enableDragging(this, this.actor);
    this._basicContextMenu();
    // The Exhausted condition has a value: right-click is -1.
    this.element.querySelectorAll(".cond2[data-counter], .cchip[data-counter]").forEach(row => row.addEventListener("contextmenu", ev => { ev.preventDefault(); if (this.actor.isOwner) bumpExhausted(this.actor, -1); }));
    this._bindHealth();
    this._bindReorder();
    this._bindFeatureOrder();
    // Talents and Features: an expanded row shows the item's card, as it would be sent to chat
    this.element.querySelectorAll("details.tfitem").forEach(d => d.addEventListener("toggle", async () => {
      const box = d.querySelector(":scope > .tfbody");
      if (!d.open || !box || box.dataset.loaded) return;
      const item = d.dataset.itemId ? this.actor.items.get(d.dataset.itemId) : (d.dataset.itemUuid ? await fromUuid(d.dataset.itemUuid) : null);
      try {
        if (!item) throw new Error("item not found");
        box.innerHTML = item.type === "action" ? await buildRawCard(item) : await buildInfoCard(item);
        box.dataset.loaded = "1";
      } catch (e) {
        console.warn("twod12 | could not show the card", e);
        box.innerHTML = `<div class="tferr">Could not show this card (${String(e.message ?? e).slice(0, 80)}).</div>`;
      }
    }));
    this.element.querySelector("select.sortsel")?.addEventListener("change", async ev => { await game.user.setFlag("twod12", "sheetSort", ev.target.value); this.render(); });
    this._bindActionTable();
    this._bindHandTiles();
    // v0.0.289: the Action names are keyboard links (Enter or Space opens the card)
    this.element.querySelectorAll(".ps-nm[tabindex], .tabbtn[tabindex]").forEach(el => el.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); el.click(); } }));
    this.element.querySelectorAll("[data-opt]").forEach(el => {
      el.addEventListener("change", () => { this.rollOpts[el.dataset.opt] = Number(el.value) || 0; });
    });
    if (!this._dropBound) {
      this._dropBound = true;
      this.element.addEventListener("dragover", ev => ev.preventDefault());
      this.element.addEventListener("drop", async ev => {
        const data = dragData(ev);
        if (data?.type === "ActiveEffect" && data.uuid) { ev.preventDefault(); ev.stopImmediatePropagation(); ev._twod12 = true; await dropEffect(this.actor, data); return; }
        if (data?.type !== "Item" || !data.uuid) return;
        // A row of this very sheet being moved: the lists reorder it (stopping the event here would keep it from them).
        try { if (fromUuidSync(data.uuid)?.parent === this.actor) return; } catch (e) { /* cannot be resolved right now: treat it as coming from outside */ }
        ev.preventDefault(); ev.stopImmediatePropagation(); ev._twod12 = true;
        const item = await fromUuid(data.uuid);
        if (!item || item.parent === this.actor) return;
        await handleDrop(this.actor, item, { slot: this._slotFor(ev, item) });
      }, true);
    }
  }

  /** The health view: click adds damage to the part clicked (a Body or Mind slice or bar), right-click removes it; Shift for Nonlethal, Ctrl for 5. */
  _bindHealth() {
    const change = async (ev, pool, sign) => {
      ev.preventDefault();
      if (!this.isEditable || !pool) return;
      const key = `${pool}${ev.shiftKey ? "Nonlethal" : "Lethal"}`;
      const step = (ev.ctrlKey || ev.metaKey ? 5 : 1) * sign;
      const cur = this.actor.system.damage[key] ?? 0;
      await this.actor.update({ [`system.damage.${key}`]: Math.max(0, cur + step) });
    };
    this.element.querySelectorAll(".np-track[data-pool]").forEach(t => {
      t.addEventListener("click", ev => change(ev, t.dataset.pool, 1));
      t.addEventListener("contextmenu", ev => change(ev, t.dataset.pool, -1));
    });
    // v0.0.183: the Guard button works like the health view: click +1, right-click -1, Ctrl 5 at a time.
    for (const gb of this.element.querySelectorAll(".np-guardbtn")) for (const [evName, sign] of [["click", 1], ["contextmenu", -1]]) gb.addEventListener(evName, async ev => {
      ev.preventDefault();
      if (!this.isEditable) return;
      await this.actor.update({ "system.guard": Math.max(0, (Number(this.actor.system.guard) || 0) + (ev.ctrlKey || ev.metaKey ? 5 : 1) * sign) });
    });
    const donut = this.element.querySelector(".np-donut");
    if (donut) {
      const poolAt = ev => {
        if (ev.target.closest(".np-hole")) return "";   // the middle is not part of the circle
        const r = donut.getBoundingClientRect();
        return donutPoolAt(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2), Number(donut.dataset.bodyDeg) || 0);
      };
      donut.addEventListener("click", ev => change(ev, poolAt(ev), 1));
      donut.addEventListener("contextmenu", ev => change(ev, poolAt(ev), -1));
    }
  }

  /** The Actions table: Group by and Sort by (each user's), the Filter box (hides rows as you type), and the cards that were open. */
  _bindActionTable() {
    const el = this.element;
    el.querySelector("select.at-groupsel")?.addEventListener("change", async ev => { await game.user.setFlag("twod12", "sheetGroup", ev.target.value); this.render(); });
    el.querySelector("select.at-sortsel")?.addEventListener("change", async ev => { await game.user.setFlag("twod12", "sheetSort", ev.target.value); this.render(); });
    const box = el.querySelector("input.at-filter");
    const apply = () => {
      const q = this._search.trim().toLowerCase();
      el.querySelectorAll('.tab[data-tab="actions"] .ar[data-search]').forEach(r => { r.hidden = !!q && !r.dataset.search.includes(q); });
      el.querySelectorAll('.tab[data-tab="actions"] .at-group').forEach(g => { g.hidden = !!q && !g.querySelector(".ar:not([hidden])"); });
    };
    box?.addEventListener("input", () => { this._search = box.value; apply(); });
    box?.addEventListener("keydown", ev => { if (ev.key === "Enter") ev.preventDefault(); });   // not a form submit
    apply();
    el.querySelectorAll(".ar.open").forEach(r => this._loadCard(r));
  }

  /** Put an Action's card into its row (once). */
  async _loadCard(row) {
    const box = row.querySelector(":scope > .ar-card"), item = this.actor.items.get(row.dataset.itemId);
    if (!box || !item || box.dataset.loaded) return;
    try { box.innerHTML = item.type === "action" ? await buildActionCard(item, { actor: this.actor }) : await buildInfoCard(item); box.dataset.loaded = "1"; }
    catch (e) { console.warn("twod12 | could not show the card", e); box.innerHTML = `<div class="tferr">Could not show this card (${esc(String(e.message ?? e).slice(0, 80))}).</div>`; }
  }

  /** Clicking a row opens its card in place, without using it (the dice button uses it). */
  static async toggleCard(event, target) {
    const row = target.closest(".ar"), id = row?.dataset.itemId;
    if (!row || !id) return;
    const open = !row.classList.contains("open");
    row.classList.toggle("open", open);
    if (open) { this._open.add(id); await this._loadCard(row); } else this._open.delete(id);
  }

  /** The Use button of an Action whose weapon is Unloaded: the Reload Basic Action. */
  static async reloadFor(event, target) {
    event?.stopPropagation?.();
    const reload = this.actor.itemTypes.action.find(i => i.getFlag("twod12", "basic") === "reload");
    if (!reload) return ui.notifications.warn(`${this.actor.name} has no Reload action: use Add Basic Actions at the bottom of the Actions tab.`);
    await useAction(this.actor, reload);
  }

  /** The Basic Actions section opens and closes (each user's choice; closed at first). */
  static async toggleBasic() { await game.user.setFlag("twod12", "basicOpen", !game.user.getFlag("twod12", "basicOpen")); this.render(); }

  /**
   * Lists in the creature's own order (Features, weapons, armor, gear): a row dragged onto another row of the same list goes there.
   * The list says where the order is saved (data-order-flag: featureOrder, itemOrder).
   */
  _bindFeatureOrder() {
    this.element.querySelectorAll(".olist[data-order-flag]").forEach(list => {
      const flag = list.dataset.orderFlag;
      list.addEventListener("dragover", ev => { if (ev.target.closest("[data-item-id]")) ev.preventDefault(); });
      list.addEventListener("drop", async ev => {
        const target = [...list.children].find(c => c.contains(ev.target) && c.dataset?.itemId);
        const data = dragData(ev);
        const moved = data?.uuid ? fromUuidSync(data.uuid) : null;
        if (!target || !moved || moved.parent !== this.actor || moved.id === target.dataset.itemId) return;
        if (![...list.children].some(c => c.dataset?.itemId === moved.id)) return;   // only within the same list
        ev.preventDefault(); ev.stopImmediatePropagation(); ev._twod12 = true;
        const shown = [...list.children].map(c => c.dataset?.itemId).filter(Boolean);
        const ids = [...new Set([...shown, ...(this.actor.getFlag("twod12", flag) ?? [])])].filter(id => id !== moved.id);
        ids.splice(Math.max(0, ids.indexOf(target.dataset.itemId)), 0, moved.id);
        await this.actor.setFlag("twod12", flag, ids);
      }, true);
    });
    // v0.0.139: the Where dropdown of a weapon or armor row; a weapon dropped on a Free hand slot is drawn into it.
    this.element.querySelectorAll(".lo-slot.free[data-slot=\"hand\"]").forEach(slot => {
      slot.addEventListener("dragover", ev => ev.preventDefault());
      slot.addEventListener("drop", ev => {
        const data = dragData(ev), w = data?.uuid ? fromUuidSync(data.uuid) : null;
        if (!w || w.parent !== this.actor || w.type !== "weapon") return;
        ev.preventDefault(); ev.stopImmediatePropagation(); ev._twod12 = true;
        this._moveItem(w, "1h", slot.dataset.hand ?? "");
      }, true);
    });
    // The quantity of a gear row, typed in place.
    this.element.querySelectorAll("input.gq[data-item-id]").forEach(inp => inp.addEventListener("change", async ev => {
      ev.stopPropagation();
      const g = this.actor.items.get(inp.dataset.itemId);
      if (g) await g.update({ "system.quantity": Math.max(0, Math.trunc(Number(inp.value)) || 0) });
    }));
  }

  /** Dragging a row onto another row of the same list puts it there (Custom order, or the Favorites order). */
  _bindReorder() {
    this.element.querySelectorAll(".fcard[data-item-id], .lrow[data-item-id], .icard[data-item-id], .grow[data-item-id], .ar[data-item-id], .arow[data-item-id], .bbtn[data-item-id], .wcard[data-item-id], .ps-brow[data-item-id]:not([data-item-id=\"\"]), .ps-erow[data-effect-id], details.tfitem[data-item-id]:not([data-item-id=\"\"])").forEach(el => el.setAttribute("draggable", "true"));
    this.element.querySelectorAll(".alist, .atable[data-list=\"actions\"], .atable[data-list=\"favorites\"]").forEach(list => {
      list.addEventListener("dragover", ev => { if (ev.target.closest(".arow, .ar")) ev.preventDefault(); });
      list.addEventListener("drop", async ev => {
        const target = ev.target.closest(".arow[data-item-id], .ar[data-item-id]");
        const data = dragData(ev);
        const moved = data?.uuid ? fromUuidSync(data.uuid) : null;
        if (!target || !moved || moved.parent !== this.actor || moved.id === target.dataset.itemId) return;
        ev.preventDefault(); ev.stopImmediatePropagation(); ev._twod12 = true;
        const fav = list.dataset.list === "favorites";
        const key = fav ? "favorites" : "order";
        let ids = fav ? [...(this.actor.getFlag("twod12", "favorites") ?? [])] : [...list.closest(".tab").querySelectorAll('.atable[data-list="actions"] .ar[data-item-id]')].map(r => r.dataset.itemId);
        if (!fav) { const saved = this.actor.getFlag("twod12", "order") ?? []; ids = [...new Set([...ids, ...saved])]; }
        ids = ids.filter(id => id !== moved.id);
        ids.splice(Math.max(0, ids.indexOf(target.dataset.itemId)), 0, moved.id);
        if (!fav && (game.user.getFlag("twod12", "sheetSort") ?? "custom") !== "custom") await game.user.setFlag("twod12", "sheetSort", "custom");
        await this.actor.setFlag("twod12", key, ids);
      }, true);
    });
  }

  // Fallback in case the core drop handler runs instead of the capture listener above.
  async _onDropItem(event, item) {
    if (event?._twod12 || item?.parent === this.actor) return;
    if (event) event._twod12 = true;
    await handleDrop(this.actor, item, { slot: this._slotFor(event, item) });
  }

  /** The Talent slot a drop goes to: the slot dropped on, "" for the extra zone, otherwise the first empty slot. */
  _slotFor(ev, item) {
    if (item?.type !== "talent" && !isTalentAction(item)) return "";
    const zone = ev?.target?.closest?.("[data-slot]");
    if (zone) return zone.dataset.slot ?? "";
    return this._talentSlots().talentSlots.find(x => !x.talent)?.key ?? "";
  }

  /** Talent slots: one for each Talent a Feature gives, filled by the Talent dropped on it. Talents dropped anywhere else are extras. */
  _talentSlots() {
    const a = this.actor;
    // What a Talent gave by a choice: shown under it, always (even when the Talent is collapsed), each one expandable.
    const kids = t => a.items.filter(i => i.getFlag("twod12", "talentId") === t.id && i.getFlag("twod12", "choice")).map(i => ({
      id: i.id, name: i.name, img: i.img, type: i.type, cat: categoryText(i.system), traits: traitChevrons(i.system.traits ?? []),
      apsHtml: i.type === "action" ? apLabel(i.system.versions.map(v => v.ap), i.system.reaction) : ""
    })).sort((x, y) => x.name.localeCompare(y.name));
    const row = t => ({ children: kids(t), id: t.id, name: t.name, img: t.img, cat: categoryText(t.system), traits: traitChevrons(t.system.traits), requirements: t.type === "action" ? t.system.prerequisites : prereqLine(t.system), freq: TWOD12.frequencies[t.system.frequency] ?? "" });
    // Talents are Talent items and Actions that are Talents.
    const talents = [...a.itemTypes.talent, ...a.itemTypes.action.filter(isTalentAction)];
    const used = new Set();
    const slots = [];
    for (const f of a.itemTypes.feature) {
      for (let i = 0; i < (f.system.talents ?? 0); i++) {
        const key = `${f.id}:${i}`;
        const t = talents.find(x => x.getFlag("twod12", "slot") === key);
        if (t) used.add(t.id);
        slots.push({ key, feature: f.name, talent: t ? row(t) : null });
      }
    }
    // v0.0.185: the Talent sections of the class (one slot per Pick, at the levels reached).
    for (const sl of classTalentSlots(a)) {
      const t = talents.find(x => x.getFlag("twod12", "slot") === sl.key);
      if (t) used.add(t.id);
      slots.push({ ...sl, talent: t ? row(t) : null });
    }
    const extras = talents.filter(t => !used.has(t.id)).map(row).sort((x, y) => x.name.localeCompare(y.name));
    return { talentSlots: slots, talents: extras };
  }

  /** v0.0.289 (PACK SHEET, the decided Hands widget): a click on a hand tile opens a small menu (Regrip, Release, Interact; the cost on each line). */
  _bindHandTiles() {
    const root = this.element;
    root.querySelectorAll("[data-hand-tile]").forEach(tile => tile.addEventListener("click", ev => {
      ev.preventDefault(); ev.stopPropagation();
      root.querySelector(".ps-menu")?.remove();
      if (!this.isEditable) return;
      const inCombat = !!combatantOf(this.actor), items = handMenu(this._weaponsInOrder(), tile.dataset.handTile, inCombat);
      const menu = document.createElement("div");
      menu.className = "ps-menu"; menu.setAttribute("role", "menu");
      menu.innerHTML = items.map(o => `<button type="button" role="menuitem" data-k="${esc(o.key)}"${o.key ? "" : " disabled"}><span>${esc(o.label)}</span><b>${esc(o.cost)}</b></button>`).join("");
      const box = root.querySelector(".twod12.sheet") ?? root, r = tile.getBoundingClientRect(), b = box.getBoundingClientRect();
      Object.assign(menu.style, { top: `${r.bottom - b.top + 4}px`, left: `${Math.max(4, Math.min(r.left - b.left, b.width - 280))}px` });
      box.appendChild(menu);
      menu.querySelector("button:not([disabled])")?.focus();
      const close = () => { menu.remove(); document.removeEventListener("pointerdown", away, true); };
      const away = e => { if (!menu.contains(e.target)) close(); };
      document.addEventListener("pointerdown", away, true);
      menu.addEventListener("keydown", e => { if (e.key === "Escape") { close(); tile.focus(); } });
      menu.addEventListener("click", async e => {
        const k = e.target.closest("button[data-k]")?.dataset.k;
        if (!k) return;
        close();
        await applyHandPick(this.actor, this._weaponsInOrder(), k, { spendAP, applyRegrip, applyRelease, sysLine });
      });
    }));
  }

  _item(target) { return this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId); }
  /** v0.0.208: the weapons in the Items tab's order (the hands of weapons that don't say theirs follow it). */
  _weaponsInOrder() { const o = this.actor.getFlag("twod12", "itemOrder") ?? [], k = id => { const n = o.indexOf(id); return n < 0 ? 9999 : n; }; return [...this.actor.itemTypes.weapon].sort((x, y) => k(x.id) - k(y.id)); }
  /** Star: add or remove an Action from the Favorites tab. */
  static async toggleFav(event, target) {
    event?.stopPropagation?.();
    const id = target.closest("[data-item-id]")?.dataset.itemId;
    const favs = [...(this.actor.getFlag("twod12", "favorites") ?? [])];
    const k = favs.indexOf(id);
    if (k >= 0) favs.splice(k, 1); else favs.push(id);
    await this.actor.setFlag("twod12", "favorites", favs);
  }
  /** The arrow at the end of a row opens the Action's card under it (one Version at a time). */
  /** v0.0.194: open or collapse the Escalation block (remembered per sheet, for each user). */
  /** v0.0.215: show or hide an Escalation Passive's description under it (kept while the sheet is open). */
  static toggleEscPass(event, target) {
    const id = target.closest("[data-item-id]")?.dataset.itemId;
    if (!id) return;
    this._escPass ??= new Set();
    if (this._escPass.has(id)) this._escPass.delete(id); else this._escPass.add(id);
    this.render();
  }
  static async toggleEsc() {
    const all = foundry.utils.deepClone(game.user.getFlag("twod12", "escOpen") ?? {});
    const now = all[this.actor.id] ?? !!game.combat?.started;
    all[this.actor.id] = !now;
    await game.user.setFlag("twod12", "escOpen", all);
    this.render();
  }
  /** v0.0.194: open or fold a Granted ticket (kept while the sheet is open). */
  static toggleGrant(event, target) {
    if (event.target.closest("[data-action='useAction']")) return;
    const t = target.closest(".gtk"), key = t?.dataset.key;
    if (!key) return;
    (this._openGrant ??= new Set());
    if (this._openGrant.has(key)) this._openGrant.delete(key); else this._openGrant.add(key);
    t.classList.toggle("open", this._openGrant.has(key));
  }
  static async toggleDetails(event, target) {
    const row = target.closest(".arow"), box = row?.querySelector(".adetail");
    const item = this._item(target);
    if (!box || !item) return;
    if (!box.dataset.loaded) { box.innerHTML = await buildRawCard(item); box.dataset.loaded = "1"; }
    box.hidden = !box.hidden;
    row.classList.toggle("open", !box.hidden);
  }
  static setFilter(event, target) { this._filter = target.dataset.k; this.render(); }
  static async setView(event, target) { await game.user.setFlag("twod12", "sheetView", target.dataset.k); this.render(); }
  /** The weapon's hands switch: stowed, held in one hand or in two. */
  /** The side panel numbers that can be edited (an NPC's Speed, Reach and Size): a click shows the base in a box; Enter or leaving it saves. */
  _editableMods() {
    this.element.querySelectorAll(".np-tile.editable").forEach(cell => cell.addEventListener("click", () => {
      if (!this.isEditable || cell.querySelector("input")) return;
      const b = cell.querySelector("b"), key = cell.dataset.edit;
      const input = document.createElement("input");
      Object.assign(input, { type: "number", value: cell.dataset.base, className: "sb-modedit" });
      b.replaceWith(input); input.focus(); input.select();
      let done = false;
      const save = async () => {
        if (done) return; done = true;
        const v = Math.trunc(Number(input.value));
        if (!Number.isFinite(v)) return this.render();
        // (Defenses are not edited here: a character's come from its armor and Power Modifier, an NPC's from the Builder tab.)
        const upd = { speed: { "system.speed": Math.max(0, v) }, reach: { "system.reachBase": Math.max(1, v) }, size: { "system.size": Math.min(7, Math.max(1, v)) } }[key];
        if (upd && v !== Number(cell.dataset.base)) await this.actor.update(upd);
        this.render();   // an unchanged number updates nothing, so close the box here
      };
      input.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); save(); } else if (ev.key === "Escape") { done = true; this.render(); } });
      input.addEventListener("blur", save);
    }));
  }

  /** Set Escalation by hand (the GM's correction): a click on a pip sets it there; a click on the last lit pip lowers it by one. */
  /** Mastery: +1 / -1 by hand (the GM correcting, or a feature that grants it). */
  static async masteryStep(event, target) {
    if (!game.user.isGM) return ui.notifications.warn("Only the GM can change Mastery by hand.");
    const k = target.dataset.key, d = Number(target.dataset.d) || 0, cur = Number(masteryOf(this.actor)[k]?.value) || 0;
    await setMastery(this.actor, k, cur + d, target.closest(".mst-row")?.querySelector(".mst-name b")?.textContent ?? "");
  }
  static async chooseStartMastery(event, target) { await chooseStartMastery(this.actor, target.dataset.item); }

  /** Shrink a Mastery row to one small line (name, bar, number), or open it again. Kept on the character. */
  static async masteryCollapse(event, target) {
    const k = target.dataset.key, row = masteryRows(this.actor).find(r => r.key === k);
    await setCollapsed(this.actor, k, !row?.collapsed, row?.name ?? "");
  }
  /** Show or hide what each step grants (this user, this sheet). */
  static masteryOpen(event, target) {
    this._masteryOpen ??= new Set();
    const k = target.dataset.key;
    if (this._masteryOpen.has(k)) this._masteryOpen.delete(k); else this._masteryOpen.add(k);
    this.render();
  }

  /** An NPC with or without Escalation (elite foes can have it). */
  static async toggleEscalation() { if (this.actor.type === "npc") await this.actor.update({ "system.useEscalation": !this.actor.system.useEscalation, "system.escalation": 1 }); }   // v0.0.243: an Elite rests at Escalation 1

  static async setEscalation(event, target) {
    const n = Number(target.dataset.n) || 0, now = Number(this.actor.system.escalation) || 0;
    await this.actor.update({ "system.escalation": n === now ? n - 1 : n });
  }

  /** Donut or Classic: how this user sees health on every sheet. */
  static async setHealthView(event, target) { await game.user.setFlag("twod12", "healthView", target.dataset.k); this.render(); }

  /** v0.0.244: the Species window (specieswindow.mjs): the species' choices (two Attributes, the side of the bigger Health bonus) and what it grants. */
  static async openSpecies() { const { editSpecies } = await import("./specieswindow.mjs"); await editSpecies(this.actor); }
  /** The Reaction AP by hand (spent on a Reaction done outside the system, or given back). */
  static async toggleRap() {
    const c = combatantOf(this.actor);
    if (!c?.isOwner || !game.combat?.started) return;
    await setRAP(c, getRAP(c) ? 0 : 1);
  }

  /** Correct the AP in combat from the header pips (a click on the last lit pip lowers it by one). The chat says so, as from the tracker. */
  static async setApPip(event, target) {
    const c = combatantOf(this.actor);
    if (!c?.isOwner) return;
    const n = Number(target.dataset.n) || 0, now = getAP(c);
    await setAP(c, n === now ? n - 1 : n, "edited");
  }

  /** Wear or take off an armor (only one is worn at a time). */
  /** Move a weapon or an armor (Dropped, Worn, One hand, Both hands; Dropped, Carried, Worn). Taking a weapon in hand checks the hands first. */
  async _moveItem(item, where, hand = "") {
    if (!item || !where) return;
    if (item.type === "weapon") {
      const need = handsFor(where);
      if (need && !(await ensureHandsFor(this.actor, item, need))) return this.render();   // put the dropdown back
      // v0.0.208: a weapon taken in one hand goes into the free hand (the main hand first), or the hand of the slot it was dropped on.
      // v0.0.211: a weapon already in one hand taken in both is a Regrip (1 AP in combat)
      if (where === "2h" && item.system.wielded && (Number(item.system.hands) || 1) < 2 && !(await spendAP(this.actor, 1, "Regrip"))) return this.render();
      return item.update(weaponMove(where, where === "1h" ? (hand || freeHandFor(this._weaponsInOrder(), item.id)) : ""));
    }
    if (item.type === "armor") {
      if (where === "worn") { await setWorn(item, true); return item.system.dropped ? item.update({ "system.dropped": false }) : null; }
      return item.update(armorMove(where));
    }
  }
  static async setWhere(event, target) { if (target.classList.contains("on")) return; return this._moveItem(this._item(target), target.dataset.where); }

  /** Fold or open the Weapons or the Armor list (each user's choice). */
  static async toggleItemFold(event, target) {
    const f = { ...(game.user.getFlag("twod12", "itemFold") ?? {}) };
    f[target.dataset.k] = !f[target.dataset.k];
    await game.user.setFlag("twod12", "itemFold", f);
    this.render();
  }

  static async setWorn(event, target) {
    const ar = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
    if (ar) await setWorn(ar, target.dataset.worn === "1");
  }
  static async setHands(event, target) {
    const w = this._item(target), v = Number(target.dataset.hands);
    if (!w) return;
    await w.update(v === 0 ? { "system.wielded": false } : { "system.wielded": true, "system.hands": v });
  }
  /** Clicking a Body or Mind number lets you type its Lethal and Nonlethal damage. */
  static async hpEdit(event, target) {
    const pool = target.dataset.pool, d = this.actor.system.damage;
    const L = pool === "body" ? "bodyLethal" : "mindLethal", N = pool === "body" ? "bodyNonlethal" : "mindNonlethal";
    // v0.0.289 (PACK SHEET): the system's window (no DialogV2)
    const { pickWith } = await import("./pickwindow.mjs"), label = pool === "body" ? "Vigor" : "Resolve", v = { l: d[L], n: d[N] };
    const res = await pickWith({ title: `${label} damage: ${this.actor.name}`, input: (f, val) => { v[f] = Math.max(0, Math.trunc(Number(val)) || 0); }, result: () => v,
      model: () => ({ name: `${label} damage`, sub: this.actor.name, icon: "fa-heart-crack", confirm: "Save",
        sections: [{ title: "", html: `<div class="pw-nums"><label>Lethal <input type="number" min="0" data-field="l" value="${v.l}"></label><label>Nonlethal <input type="number" min="0" data-field="n" value="${v.n}"></label></div>` }] }) });
    if (res) await this.actor.update({ [`system.damage.${L}`]: Math.max(0, res.l), [`system.damage.${N}`]: Math.max(0, res.n) });
  }
  static switchTab(event, target) { this._activeTab = target.dataset.tabTarget; applyTab(this); }
  static async rollAttr(event, target) {
    if (event?.target?.closest?.("input")) return;
    const key = target.dataset.key, kind = event?.shiftKey ? "Save" : "Check";   // v0.0.289 (PACK SHEET): Shift-click rolls the Save
    const mod = this.actor.system.attributes[key];
    const doomed = unconsciousDoom(this.actor, key);
    const data = await askRoll(this.actor, { title: `${TWOD12.attributes[key]} ${kind}`, attrKey: key, defaults: { doomed, doomedWhy: `${doomStatus(this.actor) || "Unconscious"}: all your Rolls are Doomed`, doomedLabel: `${doomStatus(this.actor) || "Unconscious"} (Doomed)` } });
    if (!data) return;
    const fxm = resolveModifiers(this.actor, data.fx);
    const manB = Number(data.boons) || 0, manN = Number(data.banes) || 0;
    await rollCheck({
      actor: this.actor, label: `${TWOD12.attributes[key]} ${kind}`, mod, chips: [`${TWOD12.attributes[key]} ${sgn(mod)}`],
      dc: Number(data.dc) || 13, boons: fxm.boons + manB, banes: fxm.banes + manN, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data),
      sources: fxm.sources, manualBoons: manB, manualBanes: manN, favored: data.favored === "on", doomed: data.doomed === "on"
    });
  }
  /** A Prototype Token button in the window header (or the token's own settings for an unlinked token). */
  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    const header = frame.querySelector?.(".window-header");
    if (header && !header.querySelector(".twod12-proto")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "header-control icon fa-solid fa-circle-user twod12-proto";
      btn.dataset.tooltip = this.actor.isToken ? "Token" : "Prototype Token";
      btn.setAttribute("aria-label", btn.dataset.tooltip);
      btn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); this._openTokenConfig(); });
      header.insertBefore(btn, header.querySelector('[data-action="close"]') ?? null);
    }
    return frame;
  }
  _openTokenConfig() {
    const actor = this.actor;
    try {
      if (actor.isToken && actor.token) return actor.token.sheet.render(true);
      const Cls = foundry.applications.sheets?.PrototypeTokenConfig ?? CONFIG.Token.prototypeSheetClass;
      if (Cls) return new Cls({ prototype: actor.prototypeToken }).render({ force: true });
    } catch (e) { console.error("twod12 | prototype token", e); }
    ui.notifications.warn("Open the Prototype Token from the sheet's menu.");
  }

  /** Right-click on a Basic Action card: Edit or Remove. */
  _basicContextMenu() {
    const CM = foundry.applications.ux?.ContextMenu?.implementation ?? foundry.applications.ux?.ContextMenu;
    if (!CM || this._basicCM === this.element) return;
    this._basicCM = this.element;
    const item = li => this.actor.items.get(li.dataset.itemId ?? li.closest?.("[data-item-id]")?.dataset.itemId);
    const isFav = li => (this.actor.getFlag("twod12", "favorites") ?? []).includes(li.dataset.itemId);
    try {
      // Right-click an Action: add it to the Favorites tab, or take it off.
      // v0.0.139: weapon and armor rows and slots on the Items tab.
      new CM(this.element, ".lrow[data-item-id], .lo-slot[data-item-id]", [
        { name: "Edit", icon: '<i class="fa-solid fa-pen"></i>', callback: li => item(li)?.sheet.render(true) },
        { name: "Send to chat", icon: '<i class="fa-solid fa-comment"></i>', callback: li => { const i = item(li); if (i) sendItemToChat(i, this.actor); } },
        { name: "Drop", icon: '<i class="fa-solid fa-arrow-down"></i>', condition: li => !item(li)?.system?.dropped && !item(li)?.system?.traits?.has?.("barehanded"), callback: li => this._moveItem(item(li), "dropped") },
        { name: "Remove", icon: '<i class="fa-solid fa-trash"></i>', callback: async li => { const i = item(li); if (i && await pickConfirm({ title: `Remove ${i.name}`, name: `Remove ${i.name}`, icon: "fa-trash", confirm: "Remove", text: `Remove <b>${esc(i.name)}</b> from ${esc(this.actor.name)}?` })) await i.delete(); } }
      ], { jQuery: false, fixed: true });
      new CM(this.element, ".ar[data-item-id]", [
        { name: "Favorite", icon: '<i class="fa-regular fa-star"></i>', condition: li => !isFav(li), callback: li => CharacterSheet.toggleFav.call(this, null, li) },
        { name: "Remove from favorites", icon: '<i class="fa-solid fa-star"></i>', condition: li => isFav(li), callback: li => CharacterSheet.toggleFav.call(this, null, li) },
        { name: "Send to chat", icon: '<i class="fa-solid fa-comment"></i>', callback: li => { const i = item(li); if (i) sendItemToChat(i, this.actor); } },
        { name: "Edit", icon: '<i class="fa-solid fa-pen"></i>', callback: li => item(li)?.sheet.render(true) },
        // v0.0.224 (Lucas: no way to delete a custom Action): Remove for every Action, with a confirmation (it was offered only on Basic Actions).
        { name: "Remove", icon: '<i class="fa-solid fa-trash"></i>', callback: async li => { const i = item(li); if (i && await pickConfirm({ title: `Remove ${i.name}`, name: `Remove ${i.name}`, icon: "fa-trash", confirm: "Remove", text: `Remove <b>${esc(i.name)}</b> from ${esc(this.actor.name)}?${i.getFlag("twod12", "basic") ? " A Basic Action comes back with Update Basic Actions." : ""}` })) await i.delete(); } }
      ], { jQuery: false, fixed: true });
      new CM(this.element, ".arow", [
        { name: "Favorite", icon: '<i class="fa-regular fa-star"></i>', condition: li => !isFav(li), callback: li => CharacterSheet.toggleFav.call(this, null, li) },
        { name: "Remove from favorites", icon: '<i class="fa-solid fa-star"></i>', condition: li => isFav(li), callback: li => CharacterSheet.toggleFav.call(this, null, li) },
        { name: "Edit", icon: '<i class="fa-solid fa-pen"></i>', callback: li => item(li)?.sheet.render(true) }
      ], { jQuery: false, fixed: true });
      new CM(this.element, ".bbtn", [
        { name: "Edit", icon: '<i class="fa-solid fa-pen"></i>', callback: li => item(li)?.sheet.render(true) },
        { name: "Remove", icon: '<i class="fa-solid fa-trash"></i>', callback: async li => { const i = item(li); if (i) await i.delete(); } }
      ], { jQuery: false, fixed: true });
    } catch (e) { console.warn("twod12 | context menu", e); }
  }

  /** Clicking the icon of an Action, Weapon, Feature or Talent sends it to the chat. */
  static async sendItem(event, target) {
    event.stopPropagation();
    const row = target.closest("[data-item-id],[data-item-uuid]");
    const item = row?.dataset.itemId ? this.actor.items.get(row.dataset.itemId) : (row?.dataset.itemUuid ? await fromUuid(row.dataset.itemUuid) : null);
    if (item) await sendItemToChat(item, this.actor);
  }

  /** Sections of the Actions tab collapse when their title is clicked (remembered while the sheet is open). */
  static async toggleGroup(event, target) {
    const g = target.dataset.group;
    const list = new Set(game.user.getFlag("twod12", "collapsedGroups") ?? []);
    if (list.has(g)) list.delete(g); else list.add(g);
    await game.user.setFlag("twod12", "collapsedGroups", [...list]);
    this.render();
  }
  static async generateWeapon() { await openWeaponGenerator({ actor: this.actor }); }
  /** "Add Basic Actions" adds the missing ones; "Update Basic Actions" replaces them all with the current versions. */
  static async addBasic() {
    const replace = !missingBasic(this.actor);
    const n = await addBasicActions(this.actor, { replace });
    ui.notifications.info(`${this.actor.name}: ${n} Basic Action${n === 1 ? "" : "s"} ${replace ? "updated" : "added"}.`);
  }

  static async rollInitiative() { await rollActorInitiative(this.actor); }
  /** A rest: a day in a safe place (see rest.mjs). */
  static async rest() { await chooseRecovery(this.actor); }

  /** Senses beyond Sight and Hearing: Sight Senses, "no heat" for Heatsight, and other senses with a range and a condition. */
  static async editSenses() {
    const s = this.actor.system.senses ?? {};
    const rows = [...(s.list ?? []).map(x => ({ ...x })), { name: "", range: 6, gives: "clear", needs: "none" }, { name: "", range: 6, gives: "clear", needs: "none" }];
    const opts = (choices, v) => Object.entries(choices).map(([k, l]) => `<option value="${k}"${k === v ? " selected" : ""}>${l}</option>`).join("");
    const G = { clear: "Clear", obscured: "Obscured", hidden: "Hidden" }, N = { none: "No condition", heat: "Gives off heat", ground: "Same ground" };
    const esc2 = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const content = `<div class="twod12-senses">
      <p class="hint">Every creature has Sight and Hearing. The best sense decides how a creature is perceived: Clear, Obscured or Hidden.</p>
      <label>Hearing range (squares; 0 is deaf): <input type="number" name="hearing" value="${Number.isFinite(Number(s.hearing)) ? s.hearing : 10}" min="0" style="width:4em"></label><br>
      <label><input type="checkbox" name="dimlight"${s.dimlight ? " checked" : ""}> Dim-light Sight: Dim light counts as Bright</label><br>
      <label><input type="checkbox" name="darksight"${s.darksight ? " checked" : ""}> Dark Sight: Dim light and Darkness count as Bright</label><br>
      <label><input type="checkbox" name="noHeat"${s.noHeat ? " checked" : ""}> Gives off no heat (Heatsight doesn't sense it)</label>
      <table style="margin-top:8px"><tr><th>Other sense</th><th>Range</th><th>Perceives as</th><th>Only</th></tr>
      ${rows.map((r, k) => `<tr><td><input type="text" name="n${k}" value="${esc2(r.name)}" placeholder="Tremorsense"></td><td><input type="number" name="r${k}" value="${r.range}" min="0" style="width:4em"></td><td><select name="g${k}">${opts(G, r.gives)}</select></td><td><select name="c${k}">${opts(N, r.needs)}</select></td></tr>`).join("")}
      </table></div>`;
    const DV2 = foundry.applications.api.DialogV2;
    const res = await DV2.prompt({ window: { title: `Senses: ${this.actor.name}` }, content, rejectClose: false, ok: { label: "Save", callback: (ev, button) => {
      const f = button.form.elements, val = n => f[n]?.value ?? "", on = n => !!f[n]?.checked;
      const list = rows.map((r, k) => ({ name: val(`n${k}`).trim(), range: Math.max(0, Number(val(`r${k}`)) || 0), gives: val(`g${k}`) || "clear", needs: val(`c${k}`) || "none" })).filter(x => x.name);
      return { dimlight: on("dimlight"), darksight: on("darksight"), noHeat: on("noHeat"), hearing: val("hearing") === "" ? 10 : Math.max(0, Math.round(Number(val("hearing")) || 0)), list };
    } } });
    if (res) {
      await this.actor.update({ "system.senses": res });
      if (this.actor.type === "character") { const { syncVisionOf } = await import("./vision.mjs"); const n = await syncVisionOf(this.actor); if (n) ui.notifications.info(`${this.actor.name}: token vision follows the Senses (${res.darksight ? "Dark Sight: darkvision" : "sees what is lit"}).`); }
    }
  }
  static async rollTable(event, target) { await rollTable(this.actor, target.dataset.kind); }
  static async useAction(event, target) {
    const gk = target?.dataset?.grantEffect ? { grantKey: { effectId: target.dataset.grantEffect, index: Number(target.dataset.grantIndex) || 0 } } : {};   // v0.0.269: a ticket's button names its grant
    await useAction(this.actor, this._item(target), event?.shiftKey ? { noGrant: true } : gk);
  }
  /** v0.0.208 (W): a hand button: the Action with the weapon in that hand (no "Which weapon?" window). */
  static async useWith(event, target) {
    const w = this.actor.items.get(target.dataset.weaponId);
    // v0.0.211 (Lucas): a Two-handed weapon held in one hand: Regrip first (Release the other hand first if it is full), use it anyway, or cancel.
    if (oneHandedTwoHander(w)) {
      const weapons = this._weaponsInOrder(), others = weapons.filter(x => x.id !== w.id);
      const otherFull = handSlots(weapons).some(s => !s.free && s.id !== w.id);
      const buttons = otherFull
        ? releaseOptions({ itemTypes: { weapon: others } }).filter(o => o.action.startsWith("drop:")).map(o => ({ action: `rel|${o.action}`, label: `${o.label} (Release, 0 AP), then Regrip (1 AP)`, icon: "fa-solid fa-hands" }))
        : [{ action: "regrip", label: `Regrip (1 AP): ${w.name} in both hands`, icon: "fa-solid fa-hands" }];
      buttons.push({ action: "anyway", label: "Use it in one hand (3 Banes)", icon: "fa-solid fa-hand" }, { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" });
      const { pickOne } = await import("./pickwindow.mjs");   // v0.0.289: the system's window (no DialogV2)
      const pick = await pickOne({ title: `${w.name}: one hand`, name: w.name, sub: "one hand", icon: "fa-hand", text: `${w.name} is Two-handed and held in one hand: 3 Banes on [Strike, Weapon] Actions.`, options: buttons.filter(b => b.action !== "cancel").map(b => ({ k: b.action, l: b.label })), confirm: "Go" });
      if (!pick || pick === "cancel") return;
      if (pick !== "anyway") {
        if (pick.startsWith("rel|")) await applyRelease(this.actor, pick.slice(4));
        if (!(await spendAP(this.actor, 1, "Regrip"))) return;
        const text = await applyRegrip(this.actor, this._weaponsInOrder(), `two:${w.id}`);
        if (text) await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: sysLine("fa-hands", `<b>Regrip</b> (1 AP): ${esc(this.actor.name)} ${text}.`) });
      }
    }
    await useAction(this.actor, this._item(target), { weaponId: target.dataset.weaponId, ...(event?.shiftKey ? { noGrant: true } : {}) });
  }
  /** v0.0.211 (Lucas): a greyed hand button. The Fists with no free hand: Release first (0 AP: one hand off a two-handed grip, or drop a weapon). A weapon that can't be used for this Action: say why. */
  static async handBlocked(event, target) {
    const item = this._item(target), fistsUse = item?.system?.weaponUse === "fists" || item?.getFlag?.("twod12", "basic") === "fists";
    if (!fistsUse) return ui.notifications.info(target.dataset.tooltip || "That hand's weapon can't be used for this Action.");
    const buttons = [...releaseOptions(this.actor).map(o => ({ ...o, label: `${o.label} (Release, 0 AP)` })), { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }];
    const { pickOne } = await import("./pickwindow.mjs");   // v0.0.289: the system's window (no DialogV2)
    const pick = await pickOne({ title: `${item.name}: no free hand`, name: item.name, sub: "no free hand", icon: "fa-hand", text: `${this.actor.name} needs a free hand for ${item.name}. Release one first (0 AP)?`, options: buttons.filter(b => b.action !== "cancel").map(b => ({ k: b.action, l: b.label })), confirm: "Release" });
    if (!pick || pick === "cancel") return;
    await applyRelease(this.actor, pick);
  }
  /** v0.0.208: the Items tab's Swap: the main-hand and off-hand weapons change hands. */
  static async swapHands() {
    const slots = handSlots(this._weaponsInOrder());
    if (slots.length !== 2 || slots.some(s => s.free)) return;
    if (!(await spendAP(this.actor, 1, "Regrip (swap hands)"))) return;   // v0.0.211 (Lucas): Regrip (1 AP in combat; free out of combat)
    await this.actor.updateEmbeddedDocuments("Item", slots.map(s => ({ _id: s.id, "system.hand": s.hand === "main" ? "off" : "main" })));
  }   // v0.0.182: Shift: a normal use, even with a granted use waiting
  static openItem(event, target) { this._item(target)?.sheet.render(true); }

  /** v0.0.289 (PACK SHEET): Down mode's Keep fighting / Collapse (Give up for Shattered): the choice of down.mjs, collapsing asks first. */
  static async downChoice(event, target) {
    if (!this.isEditable || target.getAttribute("aria-disabled") === "true") return;
    const { setDownChoice } = await import("./down.mjs");
    await setDownChoice(this.actor, target.dataset.choice === "fight" ? "fight" : "collapse");
  }
  /** v0.0.289: the end-of-turn Body or Mind Check of Dying or Shattered, by hand (it also runs when the turn ends). */
  static async downCheck() {
    if (!this.isEditable) return;
    const { endOfTurn } = await import("./down.mjs");
    await endOfTurn(this.actor, { force: true });
  }
  /** v0.0.289: the Upkeep tab's Breather, Sleep and Rest (each asks to confirm in the system's window, then posts a chat card). */
  static async recover(event, target) {
    if (!this.isEditable || target.getAttribute("aria-disabled") === "true") return;
    const { takeBreather, completeRest } = await import("./rest.mjs"), { completeSleep } = await import("./sleep.mjs");
    const k = target.dataset.k;
    if (k === "breather") return takeBreather(this.actor, { ask: true });
    if (k === "sleep") return completeSleep(this.actor, { ask: true });
    if (k === "rest") return completeRest(this.actor);
  }
  /** v0.0.289: the Build tab's validator: Keep or Remove each card that fills no slot (the system's window). */
  static async reviewSlots() {
    const ids = (this._pcLast?.build?.other ?? []).filter(r => r.bad).map(r => r.id);
    const rows = ids.map(id => this.actor.items.get(id)).filter(Boolean).map(i => ({ key: i.id, label: i.name }));
    if (!rows.length) return;
    const gone = await pickKeepRemove({ title: `Review: ${this.actor.name}`, name: "Cards that fill no slot", icon: "fa-list-check",
      text: "Each card must fill a slot: the species, the class's level table, a Talent slot or the GM's extra Talent. Remove the leftovers (a card from an older version, a pick changed later).", rows });
    if (gone?.length) await this.actor.deleteEmbeddedDocuments("Item", gone.filter(id => this.actor.items.has(id)));
  }
  /** v0.0.289: the class card's Choices: the class (its levels, lists and choices) in its own window. */
  static openClass() { this.actor.itemTypes.class[0]?.sheet.render(true); }
  static async deleteItem(event, target) { await this._item(target)?.delete(); }
  static async confirmDelete(event, target) {
    const item = this._item(target);
    if (!item) return;
    const ok = await pickConfirm({ title: `Remove ${item.name}`, name: `Remove ${item.name}`, icon: "fa-trash", text: `Remove <b>${esc(item.name)}</b> from ${esc(this.actor.name)}?`, confirm: "Remove" });   // v0.0.289: the system's window
    if (ok) await item.delete();
  }
  static openEffect(event, target) {
    const fx = this.actor.effects.get(target.closest("[data-effect-id]")?.dataset.effectId);
    if (isExhaustedFx(fx) && this.actor.type === "character") { exhaustedClick(this.actor, fx, { shift: event?.shiftKey, ctrl: event?.ctrlKey || event?.metaKey }); return; }   // Exhausted: click +1, Shift settings, Ctrl remove
    openEffectSheet(fx);
  }
  /** The + and - buttons on the Exhausted condition of the sheet. */
  static exhaustedUp() { if (this.actor.isOwner) bumpExhausted(this.actor, 1); }
  static exhaustedDown() { if (this.actor.isOwner) bumpExhausted(this.actor, -1); }
  static async deleteEffect(event, target) { await this.actor.effects.get(target.closest("[data-effect-id]")?.dataset.effectId)?.delete(); }
  /** A weapon with the Reload property: loaded or not (a Reload shot empties it; the Reload action fills it). */
  /** New Item: a Gear item on the creature, its sheet opened to fill in. */
  static async newGear() {
    const [g] = await this.actor.createEmbeddedDocuments("Item", [{ name: "New item", type: "gear", img: "icons/svg/item-bag.svg" }]);
    g?.sheet.render(true);
  }

  /** The Reload button of an Unloaded weapon card: the Reload Basic Action (it costs 1 AP in combat). */
  static async reloadWeapon(event, target) { return CharacterSheet.reloadFor.call(this, event, target); }

  static async toggleLoaded(event, target) {
    const w = this._item(target);
    if (w) await w.update({ "system.unloaded": !w.system.unloaded });
  }
}


export class NpcSheet extends CharacterSheet {
  static DEFAULT_OPTIONS = { position: { width: 800, height: 820 }, actions: { newAction: NpcSheet.newAction, newWeapon: NpcSheet.newWeapon, setRole: NpcSheet.setRole, setRating: NpcSheet.setRating, setSteadiness: NpcSheet.setSteadiness, levelStep: NpcSheet.levelStep, removeTag: NpcSheet.removeTag, generateAction: NpcSheet.generateAction, browseCompendium: NpcSheet.browseCompendium } };
  static PARTS = { main: { template: "systems/twod12/templates/actor-sheet.hbs" } };
  _groupLabels = ["Actions", "Features", "Items", "Basic"];
  _groupOf(i) {
    if (i.getFlag("twod12", "basic")) return "Basic";
    if (i.getFlag("twod12", "weaponId")) return "Items";
    return i.getFlag("twod12", "featureId") ? "Features" : "Actions";
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    return Object.assign(ctx, {
      builder: npcBuilderContext(this.actor),   // the Builder tab (v0.0.163)
      weaponAttrChoices: TWOD12.attributes,
      // The stat block's Tags as chips (× removes), and the ones that can still be added (v0.0.136).
      npcTags: (() => { const all = tagChoices(), have = new Set(this.actor.system.tags ?? []); return { have: [...have].map(k => ({ key: k, label: all[k] ?? k })), add: Object.entries(all).filter(([k]) => !have.has(k)).map(([key, label]) => ({ key, label })) }; })()
    });
  }

  /** A Tag chip's ×: the NPC loses that Tag. */
  static async removeTag(event, target) {
    const tags = new Set(this.actor.system.tags ?? []);
    tags.delete(target.dataset.tag);
    await this.actor.update({ "system.tags": [...tags] });
  }

  /** Generate Action: a whole Action written like its card, created on this NPC. */
  static async generateAction() { return openActionGenerator({ actor: this.actor }); }

  /** Browse compendium: the system's Action compendiums (or the Compendium sidebar). */
  static async browseCompendium() {
    const packs = game.packs.filter(p => p.documentName === "Item" && (p.metadata.system === "twod12" || p.metadata.packageName === "twod12") && /action/i.test(`${p.metadata.name} ${p.metadata.label}`));
    if (packs.length) return packs.forEach(p => p.render(true));
    ui.sidebar?.changeTab?.("compendium", "primary");
  }

  _onRender(context, options) {
    super._onRender(context, options);
    this.element.querySelector("select.tagadd")?.addEventListener("change", async ev => {
      const k = ev.target.value;
      if (!k) return;
      await this.actor.update({ "system.tags": [...new Set([...(this.actor.system.tags ?? []), k])] });
    });
  }

  /** An Action created right on the NPC, with one empty version, opened for editing. */
  static async newAction() {
    const empty = { ap: 1, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "", fx: { all: [], t1: [], t2: [], t3: [] } };
    const [a] = await this.actor.createEmbeddedDocuments("Item", [{ name: "New Action", type: "action", img: "icons/svg/sword.svg", system: { versions: [empty] } }]);
    a?.sheet.render(true);
  }
  static async newWeapon() {
    const [w] = await this.actor.createEmbeddedDocuments("Item", [{ name: "New Weapon", type: "weapon", img: "icons/svg/sword.svg", system: { wielded: true } }]);
    w?.sheet.render(true);
  }
  /** The Builder tab: the role buttons and the rating chips. A chip set to Custom keeps the number it showed. */
  static async setRole(event, target) { await this.actor.update({ "system.role": target.dataset.role }); }
  static async setRating(event, target) { await this.actor.update(ratingUpdate(this.actor, target.dataset.key, target.dataset.rating)); }
  /** A Steadiness button of the Builder tab: a number, or "custom" (clicking the button that is on): then the number is typed (v0.0.172). */
  static async setSteadiness(event, target) {
    if (target.dataset.rating === "custom") return this.actor.setFlag("twod12", "steadyCustom", true);
    await this.actor.update({ "system.steadiness": Math.max(0, Number(target.dataset.v) || 0), "flags.twod12.steadyCustom": false });
  }
  static async levelStep(event, target) { await this.actor.update({ "system.level": Math.max(0, (Number(this.actor.system.level) || 0) + (Number(target.dataset.d) || 0)) }); }
}

/** The header's AP pips follow the combat: a sheet is drawn again when its creature's AP changes or it joins or leaves a combat. */
export function registerSheetHooks() {
  const redraw = c => { const sh = c?.actor?.sheet; if (sh?.rendered) sh.render(); };
  Hooks.on("updateCombatant", (c, ch) => { if (foundry.utils.hasProperty(ch ?? {}, "flags.twod12") || "initiative" in (ch ?? {})) redraw(c); });   // v0.0.289: AP, the Reaction AP, the Initiative
  // v0.0.289 (PACK SHEET): the strip, the Granted and Escalation 3 sections and the header follow the round and the turn
  Hooks.on("updateCombat", (combat, ch) => { if (["round", "turn", "started", "active"].some(k => k in (ch ?? {})) || foundry.utils.hasProperty(ch ?? {}, "flags.twod12")) combat.combatants.forEach(redraw); });
  Hooks.on("createCombat", () => game.actors?.forEach(a => { if (a.sheet?.rendered && a.type === "character") a.sheet.render(); }));
  Hooks.on("createCombatant", redraw);
  Hooks.on("deleteCombatant", redraw);
  Hooks.on("deleteCombat", combat => combat.combatants.forEach(redraw));
}
