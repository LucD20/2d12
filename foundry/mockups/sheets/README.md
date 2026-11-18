# The sheets redesign (playtest 5, E1 / E2 / E3 / E6): the mockup

Lucas (playtest 5): "Both sheets will need some changes. PCs and normal NPC sheet should be small, but the one-page should be long"; a Reaction
previewed on the sheet doesn't show its Frequency (E2); the Hands are the right size but don't fit: no word "Hands", one hand above the other
(E3); Blunt on the dark NPC sheet is too close to the background (E6).

**A mockup only: nothing in `foundry/twod12/` or `book/` changed.** For each of the three sheets the page draws **today's sheet next to the
proposal**, dark and light.

- `index.html` (`sheets.mjs`, `model.mjs`, `proposal.mjs`, `stubs.mjs`, `sheets.css`): open it through a local server from the repository's root
  (`/foundry/mockups/sheets/index.html?theme=dark|light&sheet=pc|npc|onepage`; the links at the top switch).
- Screenshots (2x): `pc-dark.jpg`, `pc-light.jpg`, `npc-dark.jpg`, `npc-light.jpg`, `onepage-dark.jpg`, `onepage-light.jpg`.
  `node foundry/mockups/sheets/shoot.mjs` remakes them (Playwright); `node foundry/mockups/sheets/data.mjs` remakes `actors.json` from the built packs.

## The sizes

| Sheet | Today | Proposed |
|---|---|---|
| The PC sheet (Sylwen, level 1) | 900 × 1100 | **540 × 840** |
| The full NPC sheet (the Orc Warrior) | 900 × 1100 | **540 × 760** |
| The one-page NPC sheet (the Ogre Chieftain) | 480 × 820 | **480 × 1000** |

The two small sheets take a little under half the area they take today. At these sizes, with one card open: Sylwen's five Actions and the open
card show without scrolling and the Basic Actions start at the fold; the Orc's three Actions and its open card show whole. The Ogre (an Elite, the
book's longest stat block) shows every Action and its Escalation ladder in the 1000 px (today's 820 px stops inside the ladder); its Attribute
tiles, Effects, Notes and Build are one scroll below (the third picture).

## The idea: one family

The settled look says a sheet is a printed stat block, and the one-page NPC sheet already is one (`.twod12-sb` in system.css). The proposal makes
the three sheets one family, with that CSS:

- **The two small sheets:** the name plate (the rank's color; a PC's is the old sheet's navy), the stats as ruled lines, the Attribute and
  Modifier tiles, one combat line, the tabs, and **each Action as its header bar only**; a click opens the **short card** under the bar.
- **The long one-page:** no tabs. The stat block exactly as `statblock.mjs` draws it today (`sbPlateHtml`, `statBlockHtml`), every Action written
  out, then Effects, Notes, GM notes and Build down the page.

So the small sheets are the long one folded: an Action's bar and its open body are the stat block's own Action (`sbActionModel` + `sbActionHtml`,
the card model's face), not a new card.

## E2: the short card

Today the sheet's open card has no head bar, so a Reaction never says "Turn". In the proposal **the row is the card's head bar**, open or closed:
the cost (the stamp), the name, Distance · Vs., and the Frequency ("✦ Turn") in the Frequency's color. The short card is what opens under it.
Two options, both drawn under the PC pair beside today's full card:

- **Option 1 (recommended, drawn in the sheets): only what the bar doesn't say.** Under the bar: the traits (in the bar, while it is open), the
  Requirement / Trigger / Setup, the Target (and Area), the Tiers as three lines, the Critical, the Effect, a Special. **Dropped from the full
  card:** the Flavor, the automation rank's word (its diamond stays beside the name), the Attack / Save line and the Distance (the bar's
  "8 / 16 / 24 · AD" says them), "Your roll" (the roll dialog shows it), the Ruler line.
- **Option 2: the stat block's Action as the one-page writes it.** The same, but the Attack line and the Distance are written again under the
  bar. No new flag in the code; one line longer.

The full card stays where it is today (the chat's Card button, the hover card, the Action sheet).

## E3: the Hands

No word "Hands"; the two hands one above the other, each tile at today's size (12 px text, 4 px 8 px padding) and 160 px wide, so "Hunting Bow"
and "Free (Fists)" are written whole (today: "H.. Main", "D... Off" in a 150 px cell). A two-handed weapon stays one tile. The three states are
drawn (the sheet, and the two small pictures under it).

## E6: Blunt on the dark sheet

The cause, seen in today's pictures: a damage type's word and its flat amount carry the parchment's ink as an inline color (`config.mjs`
`subtypeInk`: Blunt `#5a4a36`, Slash `#4a5058`) on every theme. The proposals use the bright set on dark (`subtypeColors`: Blunt bronze
`#b9a58c`, what the Resist / Weak chips already do with `--sc-l` / `--sc-d`). **Found beside it:** on a *light* sheet the stat block writes the
Vigor / Resolve dice in the dark set's pale pink and blue (see "Today" in `onepage-light.jpg`); the proposals give them the light set's colors.

## What each proposal adds, moves or removes (veto any line)

**The PC sheet**
- *Moved:* the side panel is gone; its content is the ruled lines on top (Health, to Down, Guard, Dominant Damage; the Vigor and Resolve bars,
  still the damage taken, Lethal solid and Nonlethal hatched; AD, WD, Speed, Reach, Steady, Size; Immune / Resist / Weak; Rally and the Wound
  counts). The four "vs" Defenses go into the Attribute tiles ("Vs. 11"), the Modifiers and their Save DCs into three tiles beside them (as the
  one-page sheet does). The Senses become words in the line under the name. "In combat · Round 2" becomes "Round 2" on the plate; Roll
  Initiative becomes the plate's die icon (shown when there is a roll to make), as on the one-page sheet.
- *Moved:* in a row, the cost pill becomes the stamp at the left, **and the stamp is the Use button** (decision 3); Distance and Vs. are words at
  the right, not columns (the column header line goes).
- *Moved:* the Wounds' "Roll Dying" / "Roll Shattered" buttons and "none named" leave the front for the Upkeep tab's Wounds section (the counts
  stay on the front).
- *Added:* the Frequency on every row (E2); six Escalation pips beside the three rungs (the rungs become words, lit or faint).
- *Removed:* the word "Hands" (E3); the row's weapon button with its grip tag ("1H"); the Basic Actions' legend (At-will / Once per round /
  Strike: each button keeps its colored edge); from the open card, what the short card drops.
- *Kept as they are:* the tabs and what is in them (Effects, Items, Build, Mastery, Upkeep, Notes), the Favorites star, the sections' names, the
  Basic Actions' four columns (each Action one line instead of a box).

**The full NPC sheet**
- The same moves. Also: the rank chip ("STANDARD") becomes the plate's color and word; "Post stat block" becomes an icon on the plate;
  Generate Action / Browse compendium / New Action become a line of links; an Elite's Escalation rungs and phases go in the combat line, as a
  PC's Escalation does.
- *Kept:* the tabs (Actions, Effects, Builder, Loot, GM notes), "Basic attack · Medium" beside the Basic attack's name.

**The one-page NPC sheet**
- *Removed:* the tab bar (Main, Build, Effects, Notes).
- *Moved:* Effects, Notes and Build become sections after the stat block. Effects: conditions then effects, one ruled line each (name, text,
  duration, remove), without their picture squares; the drop zone's box becomes words in the section's heading (the whole sheet takes the drop).
  Notes: each of today's four fields shown when it has text, with an Edit link. Build: a closed heading with the Builder's own summary (Health,
  Turn budget, Best turn, CV steps); opened, it is today's Builder (decision 4).
- *Unchanged:* the plate and the stat block (the same functions, the same output), but for E6's colors.

## Decisions for Lucas (answer by exception: "all defaults except 2")

1. **The sizes.** *Default:* PC 540 × 840, full NPC 540 × 760, one-page 480 × 1000 (its width is the one you chose in v0.0.377). Otherwise: give
   the numbers.
2. **The short card.** *Default:* option 1 (only what the bar doesn't say). Otherwise: option 2 (the one-page's Action as it is).
3. **The cost stamp is the Use button on the small sheets**, as on the one-page sheet and the HUD ("a Version is the button"); the row's separate
   Use / weapon button goes. A PC holding two weapons that both fit the Action keeps a small button for each hand after the stamp. *Default:*
   yes. Otherwise: the Use button stays at the right end as today and the cost is written as words.
4. **The one-page's Build.** *Default:* a closed section at the end of the page (the page has no tabs at all). Otherwise: the page keeps one tab
   pair, "Sheet" and "Build".

## What is real code and what is not

- **Real:** today's sheets are the system's own template (`templates/actor-sheet-pc.hbs`, through Handlebars 4.7.8, `handlebars.min.js` here),
  `styles/system.css` + `theme.css`, the open cards by `actioncard.mjs buildActionCard`, the one-page by `statblock.mjs` (`statBlockModel`,
  `statBlockHtml`, `sbPlateHtml`). The numbers come from the system's data model (`data.mjs prepareDerivedData`, run on the compendium actor).
  In the proposals every Action bar and short card is `sbActionModel` + `sbActionHtml`; the stat lines, tiles, bands and plate use the stat
  block's CSS; the long page calls `sbPlateHtml` and `statBlockHtml` unchanged.
- **Not real:** `pcsheet.mjs pcModel` needs a live Foundry actor and combat, so `model.mjs` builds the same shape from the compendium actor with
  the sheet's pure pieces (`sheetmodel.mjs`, `config.mjs`, `pcsheet.mjs handTiles` and `npcBuilderModel`): every row is usable, nothing is used
  up, no favorites. Foundry's window frame and its own CSS are not on the page (the frame is drawn); Font Awesome and Signika are Foundry's:
  the mockups' drawn icons and embedded Signika stand in (the weapon button's sword is drawn here).
- **The proposals' layout** is the mockup's CSS (`sheets.css`, `.mk-*`). Option 1's short card is `sbActionHtml` with the Attack / Save and
  Distance entries taken out of its model, and the bar's Distance · Vs. words are put in by the mockup: in the build, a `short` flag of the stat
  block face.
- **Not drawn:** the other tabs of the small sheets. They keep their content; their column goes from 640 px (900 less the side panel) to 540 px,
  and the Builder's damage table is the one that will need care. The opened Build section of the long page (today's Builder at 480 px, as the
  one-page's Build tab shows it now). The out-of-combat state (the combat line then holds only the Hands). Decision 3's two
hand buttons for a PC whose two held weapons both fit an Action (Sylwen's bow and Dagger never fit the same one). E5 (a sheet's own light theme under
  Foundry's dark scheme) needs Foundry.
- **Example state** laid on the compendium data: Sylwen in combat (round 2, 3 AP, one Strike, Escalation 2, 6 Vigor and 3 Nonlethal Resolve
  damage) with her Dagger drawn in the off hand; the Orc with Resist 2 Blunt and Weak 2 Fire; the Ogre at Escalation 3 with Resist 2 Blunt, the
  condition Hindered and two notes.

## Seen in today's sheets while drawing them (not part of this mockup)

- The Reactions' pill "Round · 1R" wraps onto two lines in its column (the Orc's Avenge Kin).
- Ground Slam (the Ogre) writes no Area on any face: the item has the area's settings (a 2 Emanation) but no Area text.
- The one-page's tile row leaves an empty column and wraps "Weapon Mod." when the NPC has no Power Modifier.
