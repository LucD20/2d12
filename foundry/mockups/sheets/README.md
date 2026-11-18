# The sheets redesign (playtest 5, E1 / E2 / E3 / E6): the mockup

Lucas (playtest 5): "Both sheets will need some changes. PCs and normal NPC sheet should be small"; a Reaction previewed on the sheet doesn't
show its Frequency (E2); the Hands are the right size but don't fit: no word "Hands", one hand above the other (E3); Blunt on the dark NPC sheet
is too close to the background (E6).

**Round 2 (Lucas, 2026-11-18: "good and compact", but the colors and the Tier colors followed old rules, and "no need for one-page sheet since
the npc one is already better anyway"):** the proposals are redrawn in STYLE-3's look (`../style-book.md`, "Lucas's answers", built v0.0.387)
and the one-page NPC sheet is out of the mockup. **In the build the one-page NPC sheet would be retired** (`NpcStatBlockSheet`, the world
setting "New NPCs open with", `statblock.mjs`'s sheet face; "Post stat block" is the full sheet's own and stays).

**A mockup only: nothing in `foundry/twod12/` or `book/` changed.** For each of the two sheets the page draws **today's sheet next to the
proposal**, dark and light.

- `index.html` (`sheets.mjs`, `model.mjs`, `proposal.mjs`, `stubs.mjs`, `sheets.css`): open it through a local server from the repository's root
  (`/foundry/mockups/sheets/index.html?theme=dark|light&sheet=pc|npc`; the links at the top switch).
- Screenshots (2x): `pc-dark.jpg`, `pc-light.jpg`, `npc-dark.jpg`, `npc-light.jpg`.
  `node foundry/mockups/sheets/shoot.mjs` remakes them (Playwright); `node foundry/mockups/sheets/data.mjs` remakes `actors.json` from the built packs.

## The sizes

| Sheet | Today | Proposed |
|---|---|---|
| The PC sheet (Sylwen, level 1) | 900 × 1100 | **540 × 840** |
| The full NPC sheet (the Orc Warrior) | 900 × 1100 | **540 × 760** |

A little under half the area they take today. With one card open: Sylwen's five Actions and the open card show without scrolling and the Basic
Actions start at the fold; the Orc's three Actions and its open card show whole.

## The look (STYLE-3)

- **Type:** Source Serif 4 for the one big title (the name on the plate, in its own case, no capitals); Source Sans 3 for everything read.
- **Color only for a meaning:** game words, the Attribute and Modifier tiles (no colored tops), the Hands' grip words, "to Down" and the section
  headings in ink. Kept: the bronze accent (rules, the open tab, the Escalation pips), the stamp, the pools (Vigor red, Resolve blue), the rank's
  color on an NPC's plate (a PC's plate is the neutral dark head it has today), the subtypes' colors, the automation diamond.
- **The Frequency is a small colored square beside its word** ("■ Round"), on each Action's bar and on the section's heading; the bar itself is
  neutral (the band's tone when open). The Basic Actions keep their vertical strips, muted.
- **No Tier color on the card:** the short card is the approved Action card (style-book step 5: labeled lines, "Tier 1" in ink). No Tier result
  is drawn on a sheet, so palette A doesn't appear here.

## The layout

The name plate, the stats as ruled lines, the Attribute and Modifier tiles, one combat line, the tabs, and **each Action as one bar**; a click
opens the **short card** under the bar.

## E2: the short card

Today the sheet's open card has no head bar, so a Reaction's Frequency is only in its row's pill. In the proposal **the row is the card's head
bar**, open or closed: the cost (the stamp), the name, Distance · Vs., and the Frequency (its square and its word). The short card opens under
it: the system's own Action card (`actioncard.mjs buildActionCard`) with lines left out. Two options, both drawn under the PC pair beside
today's full card:

- **Option 1 (recommended, drawn in the sheets): without what the bar says.** Kept: the trait words, Target (and Area), the Requirement /
  Trigger / Setup, the Tiers, the Critical, the Effect, a Special. **Dropped from the full card:** the Flavor, the automation rank's word (its
  diamond stays beside the name), the Distance and the Attack / Save line (the bar's "8 / 16 / 24 · AD"), "Your roll" (the roll dialog shows
  it), the Ruler line.
- **Option 2:** only the Flavor and "Your roll" are dropped; the Distance, the Attack line and the rank's word are written under the bar.

The full card stays where it is today (the chat's Card button, the hover card, the Action sheet).

## E3: the Hands

No word "Hands"; the two hands one above the other, each tile at today's size (12 px text, 4 px 8 px padding) and 160 px wide, so "Hunting Bow"
and "Free (Fists)" are written whole (today: "H.. Main", "D... Off" in a 150 px cell). A two-handed weapon stays one tile. The three states are
drawn (the sheet, and the two small pictures under it).

## E6: Blunt on the dark sheet

The cause, seen in today's NPC picture (the cleaver's "Slash"): a damage type's word and its flat amount carry the parchment's ink as an inline
color (`config.mjs` `subtypeInk`: Blunt `#5a4a36`, Slash `#4a5058`) on every theme. The proposals use the bright set on dark (`subtypeColors`:
Blunt bronze `#b9a58c`, what the Resist / Weak chips already do with `--sc-l` / `--sc-d`).

## What each proposal adds, moves or removes (veto any line)

**The PC sheet**
- *Moved:* the side panel is gone; its content is the ruled lines on top (Health, to Down, Guard, Dominant Damage; the Vigor and Resolve bars,
  still the damage taken, Lethal solid and Nonlethal hatched; AD, WD, Speed, Reach, Steady, Size; Immune / Resist / Weak; Rally and the Wound
  counts). The four "vs" Defenses go into the Attribute tiles ("Vs. 11"), the Modifiers and their Save DCs into three tiles beside them. The
  Senses become words in the line under the name. "In combat · Round 2" becomes "Round 2" on the plate; Roll Initiative becomes an icon on the
  plate (shown when there is a roll to make).
- *Moved:* in a row, the cost pill becomes the stamp at the left, **and the stamp is the Use button** (decision 3); Distance and Vs. are words at
  the right, not columns (the column header line goes); the Frequency's square leaves the pill for the right end, with its word.
- *Moved:* the Wounds' "Roll Dying" / "Roll Shattered" buttons and "none named" leave the front for the Upkeep tab's Wounds section (the counts
  stay on the front).
- *Added:* the Frequency's word on every row (E2); six Escalation pips beside the three rungs (the rungs become words, lit or faint).
- *Removed:* the word "Hands" (E3); the row's weapon button with its grip tag ("1H"); the Vs. chip's colored box (the word stays, bold); the
  Basic Actions' legend (each button keeps its strip); from the open card, what the short card drops.
- *Kept as they are:* the tabs and what is in them (Effects, Items, Build, Mastery, Upkeep, Notes), the Favorites star, the sections' names, the
  Basic Actions' four columns (each Action one line instead of a box).

**The full NPC sheet**
- The same moves. Also: the rank chip ("STANDARD") becomes the plate's color and word; "Post stat block" becomes an icon on the plate;
  Generate Action / Browse compendium / New Action become a line of links; an Elite's Escalation rungs and phases go in the combat line, as a
  PC's Escalation does.
- *Kept:* the tabs (Actions, Effects, Builder, Loot, GM notes), "Basic attack · Medium" beside the Basic attack's name.

## Decisions for Lucas (answer by exception: "all defaults except 2")

1. **The sizes.** *Default:* PC 540 × 840, full NPC 540 × 760. Otherwise: give the numbers.
2. **The short card.** *Default:* option 1 (without what the bar says). Otherwise: option 2 (only the Flavor and Your roll dropped).
3. **The cost stamp is the Use button**, as on the HUD ("a Version is the button"); the row's separate Use / weapon button goes. A PC holding
   two weapons that both fit the Action keeps a small button for each hand after the stamp. *Default:* yes. Otherwise: the outlined Use button
   stays at the right end as today and the cost is written as words.

## What is real code and what is not

- **Real:** today's sheets are the system's own template (`templates/actor-sheet-pc.hbs`, through Handlebars 4.7.8, `handlebars.min.js` here),
  `styles/system.css` + `theme.css`, the open cards by `actioncard.mjs buildActionCard`. The numbers come from the system's data model
  (`data.mjs prepareDerivedData`, run on the compendium actor). In the proposals the short card is `buildActionCard`'s own output with elements
  removed (in the build: a `short` option of that face, so the card model still decides what a card says).
- **Not real:** `pcsheet.mjs pcModel` needs a live Foundry actor and combat, so `model.mjs` builds the same shape from the compendium actor with
  the sheet's pure pieces (`sheetmodel.mjs`, `config.mjs`, `pcsheet.mjs handTiles`): every row is usable, nothing is used up, no favorites.
  Foundry's window frame and its own CSS are not on the page (the frame is drawn); Font Awesome is Foundry's: the mockups' drawn icons stand in
  (the weapon button's sword is drawn here).
- **The proposals' layout** is the mockup's CSS (`sheets.css`, `.mk-*`). The plate, the ruled stat lines, the tiles, the headings and the stamp
  borrow the one-page sheet's rules (`.twod12-sb`: `sb-plate`, `sbl`, `sb-attr`, `sb-band`, `sb-vb`) with STYLE-3 laid over them in the mockup;
  the build writes them as the sheet's own rules when the one-page sheet goes.
- **Not drawn:** the other tabs. They keep their content; their column goes from 640 px (900 less the side panel) to 540 px, and the Builder's
  damage table is the one that will need care. The out-of-combat state (the combat line then holds only the Hands). Decision 3's two hand
  buttons for a PC whose two held weapons both fit an Action (Sylwen's bow and Dagger never fit the same one). E5 needs Foundry.
- **Example state** laid on the compendium data: Sylwen in combat (round 2, 3 AP, one Strike, Escalation 2, 6 Vigor and 3 Nonlethal Resolve
  damage) with her Dagger drawn in the off hand; the Orc with Resist 2 Blunt and Weak 2 Fire.

## Still in today's colors inside the proposals (they come from the system's code or today's sheet)

- **A trait word in a card's text** ("[Strike]" in Avenge Kin's Trigger) keeps its tinted box: `config.mjs highlightText` (`.trhl`, the trait
  group's color). STYLE-3 dropped the trait chips' fills; this one is still filled today. The build: the word in ink.
- **The AP pips (accent), the Reaction AP's teal diamond, the Strikes' orange diamonds and Rally's green pips** are copied from today's sheet as
  v0.0.387 left it. If "AP to ink" is meant for the pips too, the build draws them in ink.
- **The damage line** (the pool's heart and dice in the pool's color, the type's word in its color) is the card's own: kept by STYLE-3.

## Seen in today's sheets while drawing them (not part of this mockup)

- The Reactions' pill "Round · 1R" wraps onto two lines in its column (the Orc's Avenge Kin).

## Built (v0.0.441, pack SHEETS-HUD)

The approved proposal is built into the system. `built.html` (`built.mjs`) draws the sheets **as built**: the system's own template and CSS on this mockup's model, with the open cards as the short card; `built-dark.jpg` / `built-light.jpg` are its screenshots. The proposal pages above stay as the record of what was approved.

## The fixes mockup (Lucas on v0.0.441, 2026-11-18: "Dont remake it yet... Make the mockup of these changes")

`fixes.html` (`fixes.mjs`, `fixes.css`; screenshots `fixes-dark.jpg`, `fixes-light.jpg`): the sheet as built beside the proposal (the same HTML
with the mockup's changes; nothing in `foundry/twod12` changed). Aveline in combat at Escalation 6 (Roving Judgment, Weight of Judgment, Apex),
Sylwen out of combat, Aveline's Build tab.
1. The Frequency at a bar's right end goes under a Frequency's heading; under Reactions (Granted, Escalation) the word stays, muted, no square.
2. Out of combat: only "Out of combat", centered, faded.
3. The Vigor and Resolve gauges: the whole gauge is the click area (the track 18 px to the pointer, drawn 6 px); the numbers still open the edit.
4. The Build tab: the cost an outlined stamp in ink, the Frequency a muted word (no colored pill).
5. AP and Strikes: two aligned rows with their words, the Strikes the AP pips' size, no wrapping.
6. Escalation: the title and its pips; the rungs one under the other (the number a column); the hooks one line ("Hooks left: ...").

**Round 2 of 5 and 6 (Lucas: "Didnt like the Escalation and AP/R/Strike section, it is too large. Others are fine"):** at the top of the page,
the build beside two compact options (`fixes-compact-dark.jpg`, `fixes-compact-light.jpg`), the combat line no taller than the two hand tiles.
**A:** Escalation in three short lines (the title and six clickable pips; the Passives reached, by name, on one line; the hooks); the AP pips and
the Reaction AP over the Strikes as the HUD's slashes. **B:** Escalation in two lines (the pips where a Passive or the Apex comes ringed; the
hooks); AP, the Reaction AP and the Strikes on one line. In both the rungs' numbers leave the sheet (the Build tab lists each Passive).

**Round 3 (Lucas: "I like C. But I need to see with two weapons, one on each hand"; "C" read as the third picture, Option B):** at the top of
the page, Sylwen with her Hunting Bow in the main hand and her Dagger in the off hand: the build, Option B, Option A
(`fixes-two-hands-dark.jpg`, `fixes-two-hands-light.jpg`). With B the combat line is the two hand tiles' height.

**Round 4 (Lucas: "Put escalation (not the hooks) on the same section as AP/R/Strikes, and make the Hooks more pronunced"):** at the top of the
page (`fixes-hooks-dark.jpg`, `fixes-hooks-light.jpg`): the marks cell has two rows, AP (pips, the Reaction AP, the Strikes' slashes) and Esc.
(six pips, the rungs ringed, the number); the left cell holds only the hooks: "Hooks left", then each hook in bold at an Action name's size with
the accent's small diamond, or "None this encounter", faded. Drawn with one hook (Sylwen, a weapon in each hand), two and none (Aveline).
