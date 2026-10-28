# 2d12 character and NPC sheet: the agreed design

Chosen by the user from mockups (October 2026). This file is the spec for the build; the mockups are the reference for the look.

**Mockups (canvas):** https://claude.ai/artifact/4opLvbHE4o9qqM31T3maup
The final ones are the two bottom rows: **"Foundry · Actions / Features / Items / Effects / Notes"** (the PC sheet) and **"NPC · Actions / Items and loot / Generate Action / Generate Weapon"**. Shared parts: "Side panel (Donut / Classic)", "NPC side panel (stat block)", "Action card (component)", "Health display (component)". The rows above are earlier directions (A to P) kept for history.

Sample used everywhere: the Human Paladin (Body 2, Mind 1, Appeal 1, Instinct 0; Body threshold 21, Mind 14, pool 35) and the Skeleton Captain NPC (Standard, Professional, pool 25: Body 18, Mind 7).

## Decisions

- **Layout:** header band, side panel on the left (220 px), tabs on the right: **Actions · Features · Items · Effects · Notes** (PC and NPC).
- **Actions tab = mockup "M"** (table by cost whose rows open into the card). **Features tab = mockup "J"** (each feature a card, what it gives indented beneath it).
- **Health:** default **Donut** (option 6: the circle is the whole pool cut into a Body slice and a Mind slice at the thresholds; damage fills each slice; damage past a threshold spills into the other slice in a lighter color; "N to Down" in the middle). A toggle **Donut / Classic** switches to the **spill-over bars** (option 1: a Body bar and a Mind bar, each its own threshold; damage past one threshold shows striped in the other bar). Both show "X / pool damage · N to Down". The toggle is a per-user choice.
- **Custom order everywhere:** every list row has a drag handle (⠿): Actions, Features, weapons, armor, gear, loot. Actions: **Sort by: Custom (drag to reorder)** is the default; also Usage, Name, Cost. With a Group by, the custom order holds inside each group; **Group by: None** gives one list in your order. The order is saved on the actor.
- **Basic Actions** are always their own collapsible section, at the bottom of the Actions tab, collapsed by default.
- **Green and red for effects:** a value changed by a **temporary effect or an Escalation passive** shows in green when better, red when worse (side panel numbers, the Action rows' chips, the card's cells). **Gear and always-on passives are part of the base** and never color a value. Hovering shows the base.
- **The Action card** (shared component) uses the book's card format: title bar in the Frequency color with category, Frequency and cost badge; flavor; trait chips; the meta line (target, distance, Escalation cost); **trigger** for Reactions; the tiers grid with the cost badges as column heads (a Split Action has Weapon mode / Power mode columns), **alternating shaded rows**; Critical; Effects with cost badges. Damage subtypes are colored (Holy gold, Cold blue). When effects change the roll: a "Changed by effects" line with green/red chips, and the added or changed parts inside the cells in green/red.
- **Unloaded** (Reload weapons): the weapon card in Items shows a red **Unloaded** strip with a **Reload · 1 AP** button; in Actions, the Actions that use that weapon are faded with a red **Unloaded** chip, and their Use button becomes a red reload icon (hover: "Unloaded: Reload (1 AP)").

## Header band
Portrait, name, "Level 1 · Human · Paladin · Medium"; on the right AP pips (5) and Escalation pips (3). NPC: "NPC · Level 1 · Standard · Professional · Undead, Profane" and "Health Pool 25 · ×1 Standard" instead of Escalation.

## PC side panel (220 px, dark)
1. Health (Donut / Classic toggle in its top-right corner), "X / pool damage · N to Down", Rally Points ("13 · each heals 9").
2. Defenses: Armor (with the armor type) and Ward, big.
3. Attributes 2×2.
4. Modifiers: Weapon, Power, Signature.
5. Movement: Speed, Reach, Size.

## Actions tab (PC = "Foundry · Actions"; NPC adds the toolbar)
- Controls: Group by (Cost, Source, Frequency, None), Sort by (Custom, Usage, Name, Cost), Filter (search).
- Header row aligned with the row columns: [handle] [chevron] Action · Cost · Range · Frequency · Use.
- Groups by cost: **On your turn**, **Reactions**, **0 AP** (with a count). Row background tinted by Frequency (Round blue, Encounter red, Daily purple, At-will green, Turn teal); a used one is faded ("Daily 0/1").
- Row: handle · chevron · name (+ Escalation cost "· 2 Esc." + effect chips) · cost badge · range · Frequency · **Use** (dice button). **Clicking the row opens its card in place without using it**; the dice button uses it.
- NPC: a toolbar on top: **+ New Action**, **Generate Action**, **Browse compendium**.

## Features tab ("Foundry · Features")
- Section **Class · Paladin** (level), then each feature as a card: handle · chevron (folds) · name · kind tag (Feature, Choice, Passive) · detail ("1 of 3", "Locked Actions") · edit.
- Beneath, indented with a dotted connector, what it gives as rows like the Actions table (name, cost, range, Frequency); a passive shows "Passive" in the cost column.
- Then **Species · Human**, then **Talents** (the slots).

## Items tab ("Foundry · Items")
- Toolbar: Generate Weapon, New Item (NPC: + New Weapon too).
- **Weapons** as cards (2 columns): handle, icon, name, **Off / 1H / 2H**; Use (Melee 1 · Thrown 4/8/12 · Reload · Two-handed), Damage (subtype · pool · Tier 1/2/3), Technique. Unloaded strip as above.
- **Armor** cards: Armor value (11 + category), Ward, Properties, **Off / Worn**; the section title shows the Armor Training. NPC: a note when it wears none ("its stat block's Armor is used").
- **Gear and loot** (PC) / **Loot** (NPC): a list with quantity, edit, remove; "Coins" on the section line. **Needs a new item type** (see open decisions).

## Effects tab ("Foundry · Effects")
- **Conditions** as chips (Strained: Mind damage past its threshold...).
- **Effects on you**: icon, name, what it does (its hover text or description), duration chip ("1 round", "EoT", "until used"), source ("From Divine Surge · ends with the encounter"), edit, remove.
- **Passives from Features**: same rows; one that is off now (an Escalation passive below its Escalation) is faded with "off now (Escalation 1)".
- A drop zone: "Drop an Effect or a condition here to apply it".

## Notes tab ("Foundry · Notes")
Appearance, Background, Notes, **GM notes** (only the GM sees them).

## NPC side panel ("NPC side panel (stat block)")
Health (same toggle, the NPC's own numbers, no Rally); **Stat block**: Level, Weight (Standard ×1, Minion ×0.25, Grunt ×0.75, Elite ×1.5), Archetype, Rolls with (Attribute), Armor type, Tags as chips (+ to add); Defenses, Movement and Attributes as tiles edited in place (as today: click, type the base, Enter).

## Generators
- **Generate Action** (dialog from the NPC sheet, also usable for any Action): Name, Traits, Frequency, Target, Distance; per version: cost, Tier 1–3, Critical, Effects; "+ add" another version. **Tiers are written like the card** ("[B] 1d8 Co; Hindered (EoT)"; [W], [At], [M] 2d6 Ho) and the short codes (1WB, 1d8MCo) still work. A **live preview** of the card and a green "Understood: ..." line. Buttons: Cancel, Create on <NPC>. (Today the generator only reads short codes and edits one version of an existing Action; creating a whole Action is new.)
- **Generate Weapon** (as today, one line: "rusty greatsword: two-handed, melee, slash, range 1, 0/1d8/2d6"): green chips for what it understood, a "Not understood" line, a preview of the weapon card, the words it knows. Buttons: Cancel, Create in the world, **Give to <NPC>**.

## Open decisions (ask the user before building those parts)
1. **Gear and loot:** a new item type (name, quantity, description, maybe weight/cost) or wait? (Proposed: a new type.)
2. **Group by / Sort by** saved per character or per user? (Proposed: the custom order and Sort per character, Group by per user.)
3. **Talents** in the Features tab: the slots as today (a slot row to drop into) inside the new card style.

## Build order (one version each, each with its test checklist)
1. Side panel (both health views + toggle) and the header band.
2. Actions tab (table, groups, open-in-place card, Use, custom order, Basic Actions section, effect chips, Unloaded).
3. Features tab.
4. Items tab (+ the Gear/Loot type if approved).
5. Effects and Notes tabs.
6. NPC sheet (stat block panel, toolbar) and the two generators.

Keep what exists and works (the editable sidebar cells, the roll dialog, the effect editor); the sheet changes are templates, CSS and sheet code. The current templates are templates/actor-sheet.hbs and module/actor-sheets.mjs.
