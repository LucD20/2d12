# Tooltip inventory (Lucas's review done; APPLIED in v0.0.420)

**Lucas's answer (2026-11-18): B and H "Remove both"; the other categories as proposed.** Applied in v0.0.420: A (the HP bars) and C (why a
button is off, until the mockups show it on screen) stay; B, D, E, F, G and H are gone; a button showing only an icon or a picture keeps its
name for screen readers (aria-label). The Distance's ⓘ and the effect formula's ⓘ went with their hovers. Test t264 lists the hover texts
left. The rows below are the record of what was there (their line numbers are of v0.0.419).

**Corrected by the audit (v0.0.421):** three reasons a button is off had been filed under F and are back as hovers (C): Favored / Doomed from an
effect (Initiative window), End move with no movement (the combat strip), a struck roll-dialog chip ("Not this time"); and a struck Encounter Log
line's reason. A pick window or pick bar option shows its hover only when it is off. The Charge bar's `title` (set by code, missed by the scan)
went. `aria-label` stays only on elements that show no words. Not in this inventory: the hover card over a placed area
(`module/zonetip.mjs`, his playtest 4 ask): **kept (Lucas, 2026-11-18, v0.0.422: "Keep it").**

Lucas, 2026-11-17 (playtest 5): "tooltips are too much. Only ones that are necessary so far are the ones in the HP bars. Remove all for now."
Then: "When we are done reviewing and get to the tooltip stage, write them all down, categorized, and I will review."

This is every hover text the system writes (Foundry's own core tooltips are not here), read from the code on 2026-11-17 (v0.0.419):
**about 500 places in 46 files** (380 hover attributes, and the texts that feed them), sorted into 8 categories (the counts below are
those places, so one sheet tooltip that every row draws counts once). Each row says where it is, what it says, and Claude's proposal. Your default is
"remove", so the proposal is **Remove** unless removing it loses something: then it says what is lost and offers a way out.

**How to answer:** a category at a time is enough ("A keep, B remove, C keep..."); name a row only to make an exception. Row numbers are
per category (B3, C7...).

**Proposals used**
- **Remove:** the hover text goes; nothing else changes.
- **Keep:** stays as it is.
- **Label only:** the button shows only an icon or a picture, so its name stays for screen readers (`aria-label`), with no hover box.
- **Show it instead:** the information is not on screen anywhere else; it gets a short visible line (in the mockups) instead of a hover.

## Summary

| | Category | Count | Proposal |
|---|---|---|---|
| A | The HP bars | 4 | **Keep** (your exception) |
| B | Hover cards (an Action's or a condition's card on hover) | 16 | Ask: they are the only quick way to read a condition on the sheet and on tokens |
| C | Why a button is struck or off | 34 | **Show it instead** where possible; else Keep |
| D | Calculated values (where a number comes from) | 75 | Remove; the calculated chips' blue (playtest 5, B4) already says "calculated" |
| E | Rule notes (a rule explained on hover) | 107 | Remove; the right-click on a button opens the rule (V1.1) |
| F | What a click does (button names, click / right-click / Shift instructions) | 184 | Remove; Label only for the icon-only buttons |
| G | Names and words repeated (the hover says what is already written) | 35 | Remove |
| H | Item sheet and builder help (the GM's editing screens) | 22 | Ask: these are the only help on the editing screens |

---

## A. The HP bars (keep: your exception)

| # | Where | What it says |
|---|---|---|
| A1 | HUD, the Vigor and Resolve bars (`hudview.mjs` 41) | "Vigor: 18 of 23 left (2 Nonlethal damage)" |
| A2 | PC sheet, the Vigor track (`pcsheet.mjs` 154, template 128) | the damage, the Nonlethal part, "Bloodied when full" |
| A3 | PC sheet, the Resolve track (`pcsheet.mjs` 156) | the same, "Strained when full", Exhausted's effect |
| A4 | NPC sheet, the same two tracks (template 128) | the same |

## B. Hover cards (a whole card appears on hover)

These are the "hover cards". Removing them means reading a condition by opening it (a click), or not at all on a token.

| # | Where | What it shows | Proposal |
|---|---|---|---|
| B1 | PC / NPC sheet, an Action's row (`actor-sheets.mjs` 321) | the Action's card | Remove (the row opens the card on a click) |
| B2 | PC sheet, a granted Action (`actor-sheets.mjs` 363, 380) | where it comes from, its duration, uses left | Remove (the granted row says "from X") |
| B3 | PC sheet, the condition list (`actor-sheets.mjs` 420; `effects.mjs` 557: "Brought by X: it leaves with it") | the condition's card: name, duration, text, source, its controls | **Ask**: the only place its text and source are read without opening it |
| B4 | PC sheet, Bloodied and Strained (`actor-sheets.mjs` 406, 407) | "Your Vigor damage is at or past your Vigor threshold..." | Remove |
| B5 | Token HUD (Foundry's right-click on a token), the condition icons (`effects.mjs` 531, 673) | the condition's card | **Ask**: the only way to read a condition on the map |
| B6 | PC sheet, the Escalation section (`escblock.mjs` 77) | a passive's text at its rung | Remove |
| B7 | Roll dialog, an effect chip (`actions.mjs` 997) | the effect's card (Hindered from Rimebrand...) | Remove |
| B8 | Sheet, an Immune / Resist / Weak line (`dmglines.mjs` 32, 87) | the line, its source, time left | Remove |
| B9 | Gear rows (`actor-sheets.mjs` 467) | the item's description | Remove |
| B10 | The diamond beside a card's name (`config.mjs` 359) | the Bronze / Silver / Gold rating and what is done by hand | **Ask**: the only place the card says what is by hand (or the item sheet only) |
| B11 | Chat, a condition button's name (`inline.mjs` 335) | the condition and its duration | Remove (the button says it) |
| B12 | Rule buttons in text, `@Book` (`inline.mjs` 305) | "Forced Movement: a rule of the book (Chapter 3)" | Remove |

## C. Why a button is struck or off

When a button is greyed or struck, the hover is today the only place that says why ("Not enough AP", "Wield the Longsword to use it").
Removing them leaves a dead button with no reason. **Proposal for the whole category: show the reason** (a short line under or beside the
button, in the mockups); until then **Keep**.

| # | Where | Example |
|---|---|---|
| C1 | Sheet, an Action's Use button when it can't be used (template 4, 205) | "Not enough AP (click to use it anyway)" |
| C2 | Sheet, a hand button that can't be used (template 6; `loadout.mjs` 122, 123, 132) | "Main hand: Longsword (both hands): no free hand for the Dagger (Release first, 0 AP)" |
| C3 | Sheet, Unloaded (template 3, 252) | "Unloaded: Reload first (1 AP)" |
| C4 | Sheet, Initiative off (template 61) | "No active combat: the GM starts an encounter first" |
| C5 | Sheet, the Down choices off (template 118, 119) | why Keep fighting / Collapse is off |
| C6 | Sheet, a Recovery off (template 354) | why it can't be used now |
| C7 | Action card, a Version off (`actioncard.mjs` 125) | "Not enough AP" |
| C8 | HUD, a Version's stamp off (`hudview.mjs` 62; `hudmodel.mjs` 21) | "Not enough AP", "Used this round" |
| C9 | NPC stat block, a Version off (`statblock.mjs` 22) | "Used" |
| C10 | Roll dialog, a Version or a note off (`rolldlg.mjs` 550, 553) | why that Version can't be chosen |
| C11 | Class window, a Talent you can't take (`classwindow.mjs` 127) | "Not yet: Level 3; Requires Smite" |
| C12 | Class window, a choice already set (`classwindow.mjs` 142, 156, 168, 169) | "Set by the class", "Chosen at an earlier level", "Permanent..." |
| C13 | Chat card, a chain step off (`chatcards.mjs` 384) | why "After the damage" can't run |
| C14 | Chat card, a granted Weapon Attack out of reach (`chatcards.mjs` 387) | "Orc Warrior is 3 squares away: your Longsword reaches 1" |
| C15 | Combat strip, Swap off (`carousel.mjs` 45) | why Swap Initiative can't be used |
| C16 | Pick bar / pick window, an option off (`pickbar.mjs` 10; `pickwindow.mjs` 18) | the option's reason |
| C17 | Roll dialog, a notice (`actions.mjs` 251, 264) | "Out of range", "Engaged: 1 Bane" (the reason a Bane is there) |
| C18 | Reactions message, Move back (`moment.mjs` 187) | what Move back does, or why it can't |

## D. Calculated values (where a number comes from)

The number is on screen; the hover explains how it was worked out. Removing them loses the "why is my AD 15?" answer, which the sheet
could show by a click (the tile opens its breakdown) in the sheet mockups. **Proposal: Remove** (the calculated chips' blue, playtest 5's B4,
already marks them).

| # | Where | Example |
|---|---|---|
| D1 | Chat and cards, a calculated chip (`inline.mjs` 294, 295, 360, 371) | "Calculated: 1d6 + [Mod] with this creature's [Mod] 2" |
| D2 | PC sheet, AD and WD (`pcsheet.mjs` 169, 170; `actor-sheets.mjs` 541-545; template 142, 143) | "Armor Defense: 11 + 3 (Chain) + 1 (Shield)" |
| D3 | PC sheet, the Vs. Attribute Defenses (`pcsheet.mjs` 172) | "Vs. Body: 12 + your Body (+2)" |
| D4 | PC sheet, Speed, Reach, Size, Steadiness (`pcsheet.mjs` 178-181; `actor-sheets.mjs` 556-560; template 154) | "Speed 4 (base 5; Exhausted −1)" |
| D5 | PC sheet, the Modifiers (`pcsheet.mjs` 192-197; template 159) | "Weapon Modifier, from Body. Save DC 11 + it" |
| D6 | PC sheet, the Attributes (`actor-sheets.mjs` 549, 529) | "Roll a Body Check. Save DC 14"; "Base 2, now 3" |
| D7 | PC sheet, the AP pips and Guard (`pcsheet.mjs` 122, 124; template 88, 111) | "3 AP left of the 4 this turn gave (Slowed 1)" |
| D8 | PC sheet, Strikes left (template 89) | "Strikes left this turn: 2 of 3" |
| D9 | PC sheet, the Momentum start (template 77) | "This encounter started with Momentum 2: Escalation 3" |
| D10 | HUD, AP / Reaction AP / Strikes / Escalation marks (`hudview.mjs` 29-35) | "AP 2 of 4", "2 of 3 Strikes left this turn" |
| D11 | HUD, Speed, and a party card's changed stats (`hud.mjs` 189; `hudview.mjs` 49) | "Speed 4 (base 5; Exhausted 1)" |
| D12 | Combat strip, the pips (`carousel.mjs` 29; `ticker.mjs` 30; `turndock.mjs` 59) | "2 AP left, Reaction AP ready" |
| D13 | Roll dialog, the average (`preview.mjs` 83; `actions.mjs` 388) | "Without them: 7.5" |
| D14 | Chat, the total's shield (`roll.mjs` 109, 185; `inline.mjs` 1040) | "Total 17 against AD 14" |
| D15 | Chat, a damage roll (`inline.mjs` 428, 1017; `chatcards.mjs` 544) | "1d6+2: 4 + 2" |
| D16 | Chat, a Boon or Bane line (`chatcards.mjs` 142) | its source and count |
| D17 | NPC sheet, the Builder's numbers (`pcsheet.mjs` 497-572; template 401, 414, 422, 428; `statblock.mjs` 44) | "High Basic attack: 40 points, 6 / 9 (Tier 2 / Tier 3)" |
| D18 | NPC sheet, CV and Stage (template 46, 383, 384) | "Levels 1-3: Stage 0..." |
| D19 | Action sheet, Avg / Exp (`actionsheet.mjs` 57, 161) | "Avg: the damage when this Tier happens..." |
| D20 | Gear, weight and cost each (template 277) | "Each: weight 1, cost 5" |
| D21 | The Distance's ⓘ icon on cards, the sheet and the chat (`actioncard.mjs` 149; `config.mjs` 540; template 14) | "Your weapon's Range: 1 (Reach 1)" |
| D22 | Action card, the live roll line's chips (`actioncard.mjs` 174) | "Longbow must be reloaded first (Reload, 1 AP)" |

## E. Rule notes (a rule explained on hover)

Since V1.1 a right-click on a button opens its rule; these hovers repeat the book. **Proposal: Remove.**

| # | Where | Example |
|---|---|---|
| E1 | Every trait chip (cards, sheet, roll dialog: `actioncard.mjs` 37, 105; `config.mjs` 424, 476; `rolldlg.mjs` 418, 468; `rollinput.mjs` 37) | "[Strike]: an Action that attacks..." |
| E2 | The AP / R marks on a card (`config.mjs` 395, 396) | "0 AP: it costs no Action Points, and can be used only on your turn" |
| E3 | The Vigor / Resolve icons in damage (`config.mjs` 364-366) | "Vigor damage", "Vigor or Resolve: the origin chooses" |
| E4 | Dice rules in the chat and the roll dialog (`roll.mjs` 84, 92, 94, 100-108, 166, 170; `chatcards.mjs` 89, 92, 133, 532; `dmgcard.mjs` 12; `initcard.mjs` 50-59) | "A 12 counts as 11 and is rolled again"; "Doubles"; "Dropped die" |
| E5 | Roll dialog chips (`actions.mjs` 252, 266-296; `rollinput.mjs` 92-121; `rolldlg.mjs` 72) | "Favored: roll 3d12 and keep the two highest..."; "Deal Nonlethal damage instead: 1 Bane" |
| E6 | Roll dialog, the odds row (`actions.mjs` 143; `dmgcard.mjs` 52) | "Chance of each tier for this roll" |
| E7 | Chat, the Tier tags (`actions.mjs` 1012-1035; `inline.mjs` 1035) | "Doubles on a Tier 3", "20 or more above the DC" |
| E8 | PC sheet, Rally Points (template 137) | "Rally Points: your class's Rally value + your Stage. Each removes..." |
| E9 | PC sheet, the Senses (`sheetmodel.mjs` 302-307; template 27) | "Darksight: you see in Darkness as in Dim light" |
| E10 | PC sheet, the Wounds (template 166) | "each one adds 1d6 to its Table" |
| E11 | PC sheet, Level (template 288) | "raising it opens the class window" |
| E12 | PC sheet, Hands and gear places (`pcsheet.mjs` 63, 239, 240, 353, 354; template 83, 98, 252, 255, 265) | "On you, ready to draw"; "a Two-handed weapon in one hand: 3 Banes" |
| E13 | PC sheet, Mastery (`mastery.mjs` 134; template 335) | "1 Mastery each" |
| E14 | The Elite ladder (`sheetmodel.mjs` 316-318; `pcsheet.mjs` 131; template 72, 380; `statblock.mjs` 41) | "Escalation 4: it can use its Round Special Action twice a round" |
| E15 | Momentum (`combat.mjs` 465; `hudview.mjs` 57; `escalation.mjs` 210; `carousel.mjs` 107) | "every PC starts this encounter at Escalation 1 + n" |
| E16 | Map bars: Forced Movement, the Line's tie, the Charge (`move.mjs` 752, 753, 1630; `template.mjs` 218) | "It moves 0 squares (the value is a maximum)" |
| E17 | Combat strip, movement left (`carousel.mjs` 43, 44) | "Evade left this turn. Click to end it" |
| E18 | NPC Builder, ranks and roles (template 376, 378, 379; `npcbudget.mjs` 94-99) | "Holds a line and protects its allies" |
| E19 | Lingering's pool (`conditions.mjs` 203) | "Bo/In: Vigor; Mi/Ap: Resolve" |
| E20 | World Clock, Exhaustion tracking (`clock.mjs` 145) | "Counts Exhaustion from the time awake..." |
| E21 | Encounter start, Unspent AP link (`turndock.mjs` 52) | "The book, Chapter 2: Unspent AP" |

## F. What a click does (button names and click instructions)

Most of these name a button that already has a word, or tell the clicks ("Left-click +1, right-click −1"). **Proposal: Remove**, and for
the buttons that show only an icon or a picture: **Label only** (marked ★).

| # | Where | Example |
|---|---|---|
| F1 | PC / NPC sheet, small icon buttons ★ (template 32, 43, 50, 51, 57, 58, 59, 167, 168, 178, 199, 224, 227, 235, 238, 252, 263, 275, 278, 332, 364, 390, 419, 420, 441) | "Edit", "Remove", "Open the effect", "Change the portrait", "Send to chat", "Exhausted +1" |
| F2 | PC sheet, the Use buttons (template 5, 6, 7; `pcsheet.mjs` 239, 240, 313) | "Use Smite", "Use with Longsword (main hand)" |
| F3 | Sheet, click instructions (template 72, 78, 88, 127, 149; `sleep.mjs` 132) | "Click: Body Check · Shift-click: Body Save"; "Reaction AP: ready (click to correct)" |
| F4 | HUD, buttons and instructions (`hudview.mjs` 71, 81, 94, 99, 100, 103, 104; `hud.mjs` 188-192, 399; `hudmodel.mjs` 29, 49, 50, 63) | "Rally Points (right-click: −1; Shift: +1)"; "Fold the HUD"; "Close" ★ |
| F5 | Combat strip (`carousel.mjs` 43, 50, 101, 176; `combat.mjs` 431, 433) | "Use the Evade as an Advance", "Remove 1 AP" |
| F6 | Chat cards (`chatcards.mjs` 146, 192, 193, 207, 218, 226, 279, 305, 570, 577; `dmgcard.mjs` 7, 60, 69, 99; `actions.mjs` 158; `config.mjs` 572; `inline.mjs` 323, 1044; `followup.mjs` 56, 82) | "Target the selected tokens" ★, "Open Smite", "Full, Half or Double" ★ |
| F7 | Granted Action buttons (`freeuse.mjs` 128, 132, 218, 221, 222) | "Use Weapon Attack against Orc Warrior"; "Drag to move this bar" |
| F8 | Reactions message (`moment.mjs` 194-260) | "Use", "Pass", "Drag to change the order", "Show it on the map" |
| F9 | Encounter start stack (`startstack.mjs` 51-55) | "Done: the next one", "Skip it", "See the Action's card" |
| F10 | Roll dialog (`rolldlg.mjs` 341-343, 389, 402, 428, 450, 470, 492, 525; `actions.mjs` 261, 336) | "Remove", "Make Tier 3 the result (GM)", "Place the area" |
| F11 | Action card, Use a Version (`actioncard.mjs` 126; `statblock.mjs` 23) | "Use the 2 AP Version" |
| F12 | NPC stat block (`statblock.mjs` 28, 42, 54, 60) | "Open the Action", "Add an Action", "Roll Initiative" ★ |
| F13 | Encounter Log (`enclog.mjs` 230-238) | "Edit the text", "Remove (a misclick)...", "Add a note" |
| F14 | Initiative window (`initview.mjs` 20-24, 32) | "Move to another side", "GM correction: roll again" |
| F15 | Class window and editor (`classwindow.mjs` 86, 87; `classeditor.mjs` 65, 68) | "Show as a compact list", "Drag to reorder" |
| F16 | Action sheet, item and effect sheets (`actionsheet.mjs` 143, 173; `fxsheet.mjs` 302; `builder.mjs` 188, 217; `genwindow.mjs` 37; `settings.hbs` 4; `item-sheet.hbs` 204) | "Earlier", "Later", "Remove", "Show the help texts" |
| F17 | World Clock and side-view (`clock.mjs` 113, 132, 205, 206; `heightcover.mjs` 84) | "Move the clock back"; "Send this side view to the chat" |
| F18 | Turn Breakdown and the chat export (`turndock.mjs` 70, 194, 216) | "Turn Breakdown: show or hide" |
| F19 | Down's check button (template 121) | "The end-of-turn Check (it also runs by itself)" |
| F20 | Favorite star (template 12) | "Favorite (right-click the row to change)" |
| F21 | The class cards' Choices button and the swap after a Rest (template 288, 292; `pcsheet.mjs` 420) | what the swap button does |
| F22 | Prototype token header button (`actor-sheets.mjs` 1154) | "Token" / "Prototype Token" (Foundry's own button, named) |

## G. Names and words repeated

The hover says what is already written, or gives a name that a picture hides. **Proposal: Remove**, except G1 (★ Label only: a picture
with no name).

| # | Where | Example |
|---|---|---|
| G1 | Pick bar, token squares ★ (`pickbar.mjs` 9) | the creature's name (the square shows only its picture) |
| G2 | Reactions message and start stack, the portraits (`moment.mjs` 123; `startstack.mjs` 14) | the creature's name ★ |
| G3 | Initiative window, names (`initview.mjs` 18, 19) | the name, its rank |
| G4 | Chat, names in rows (`chatcards.mjs` 21, 217; `dmgcard.mjs` 96; `roll.mjs` 184, 89) | the same names again |
| G5 | Chat and roll dialog, Boon / Bane / Modifier labels and "Hidden by the GM" (`roll.mjs` 100, 108; `initcard.mjs` 55, 59, 64; `rolldlg.mjs` 362) | "Boon", "Modifier", "Dropped die" |
| G6 | Chat, a damage type icon (`inline.mjs` 1016) | "Blunt" |
| G7 | Chat, Doubles on the stamp (`chatcards.mjs` 89, 92; `actions.mjs` 1012) | "Doubles" (the gold outline) |
| G8 | Card, "The roll's Modifier" (`actioncard.mjs` 175) | "The roll's Modifier" |
| G9 | Card, Empowered and bonuses (`actioncard.mjs` 55-58) | "Empowered: the first damage on each of your turns adds 1d6!" |
| G10 | Class editor, ids and names (`classeditor.mjs` 65; `fxsheet.mjs` 173; `builder.mjs` 215) | an internal id |
| G11 | Encounter Log, an edited line (`enclog.mjs` 230) | "Edited by hand"; a removed line's reason |
| G12 | A granted use's "A free use" mark (`actor-sheets.mjs` 377) | "A free use" |
| G13 | `util.mjs` 49 (a generic helper) | whatever it is given |

## H. Item sheet and builder help (the editing screens)

The grey help on the item sheets, the Action sheet and the effect settings: the only explanation a GM gets while making a homebrew item.
**Ask:** keep them (they are not seen in play), or move them into the "Show the help texts" toggle the sheets already have.

| # | Where | Example |
|---|---|---|
| H1 | Species sheet (`item-sheet.hbs` 30, 35) | "Human: +3 to one threshold and +2 to the other..." |
| H2 | Talent sheet (`item-sheet.hbs` 117, 124) | "A theme the Talent picker can filter by..."; "and / or" |
| H3 | Any card, Automation and its note (`item-sheet.hbs` 120, 192) | "How much Foundry does for this card..." |
| H4 | Feature sheet, Escalation (`item-sheet.hbs` 193) | "Shown in the Escalation section..." |
| H5 | Weapon sheet, Group and Mastery kind (`item-sheet.hbs` 251, 252) | "You gain at most 1 Mastery per Weapon Group..." |
| H6 | Effect settings (`settings.hbs` 7, 12, 105; `preds.hbs` 3) | "Field, Pressure and Support: up to 2 Boons..." |
| H7 | Effect sheet, the formula help (`fxsheet.mjs` 21) | how to write a formula |
| H8 | Help toggles (`item-sheet.hbs` 11, 20) | "Show the help texts" |
| H9 | NPC Builder, "click again to type your own" (`npcbuilder.mjs` 26, 64, 74) | "Click again to clear it and type your own Speed" |
| H10 | Damage lines' Add (`dmglines.mjs` 34) | "Add a lasting Immune, Resist or Weak line (GM)" |

---

## What happens after your answers

1. Each category marked Remove: its hover texts go in one pass. A button that shows only an icon keeps its name for screen readers
   (`aria-label`), and nothing else on screen changes.
2. C (the reasons) and anything marked "Show it instead" go into the mockups (the HUD, the Save card, the sheets), so no information is lost.
3. A test checks that no new hover text sneaks back in: a list of the allowed ones (the HP bars and whatever you keep).
