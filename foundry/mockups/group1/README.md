# Group 1 (Lucas on v0.0.442, 2026-11-19): the sheets' marks, the Basic Actions, the NPCs

**A mockup only: nothing in `foundry/twod12/` changed.** Each part draws the sheet **as built (v0.0.442)** beside the **proposal**, cropped to
the part that changes, dark and light. The windows are 540 px wide.

- `index.html` (`group1.mjs`, `group1.css`): open it through a local server from the repository's root
  (`/foundry/mockups/group1/index.html?theme=dark|light`; the links at the top switch).
- **Round 2** (the combat line, after Lucas's answers): `round2.html` (`round2.mjs`, `round2.css`; it also loads `group1.css`). See "Round 2" below.
- Screenshots (2x): `group1-dark.jpg`, `group1-light.jpg`, `round2-dark.jpg`, `round2-light.jpg`. `node foundry/mockups/group1/shoot.mjs` remakes
  them (Playwright; `--only round2` or `--only group1` for one page).

## What each part proposes

**1. The sheet's marks are the HUD's marks** ("Sheet's AP/R/Strike pips should match the ones in the strip"; "Reaction pip ... still has old
fill and hard to read"). Sylwen: 3 of 4 AP, the Reaction AP, one Strike made, Escalation 4.
- The AP are squares (today circles), gold.
- The Reaction AP is a gold diamond (today teal): the AP's own gold; its shape says what it is (`book/research/ui-marks-and-state.md`).
- The Strikes are the HUD's slashes in the HUD's red, `#c0675c` (today orange); on the light sheet a darker red, `#a8433a`, to read on parchment.
  A Strike already made is a faint outline, as on the HUD.
- A little bigger than the HUD's: AP 12 px, the diamond 10 px, a slash 13 px tall (the HUD: 9, 8, 11). The hairlines between them stay.
- The Esc. row is as built (diamonds, the rungs ringed).
- Added, moved, removed: nothing. Shapes and colors only.

**2. The Basic Actions' vertical strips** ("very hard to see").
- The Frequency strip: 4 px (today 3), in the theme's Frequency color (`--s-fq-atwill`, `--s-fq-round`) at 88% (today a fixed dark color
  written on the button, at 55%: made for the light sheet, nearly gone on the dark one).
- A Strike's second strip: 3 px (today 2) in the Strikes' red of part 1, with a 1 px gap between the two strips.
- The space between a name and its cost goes from 6 px to 4 px, so the wider strips take no room from the name.
- An Action that can't be used keeps its dashed, faded strip.
- Added, moved, removed: nothing.

**3. Long names in the Basic Actions: two options** ("Weapon Attack and Steel Yourself are long and dont fit"). Sylwen and Aveline, both with
part 2's strips.
- **Option A, four columns kept.** *Removed:* the word "AP" in each Basic Action's cost ("1", "2/3", "1/2/3"). With that, both names fit at
  full size. A name still too long shrinks until it fits (to 9.5 px, as `hud.mjs fitNames` does; below that, two lines) and is never cut.
- **Option B, three columns.** *Moved:* the Control group goes under Attack; Movement and Utility keep a column each. Every name fits at full
  size, the cost keeps "AP". The block is about 100 px (3 to 4 lines) taller.
- Not drawn: icons. With no hover texts allowed, 19 icons would have to be learned by heart.

**4. An Elite's combat line laid out like a PC's** ("AP, Escalation etc from Elite NPCs should mimic PCs"). The Ogre Chieftain at Elite
Escalation 2, Bloodied; the Orc Warrior (a Standard).
- *Moved:* the phases go to the left cell, where a PC has its hooks: the small heading "Phases", then each phase in bold with its state
  ("Bloodied +1 ✓", "Strained +1 not yet").
- *Added:* an Esc. row in the marks cell, under the AP row: six diamonds, the Elite ladder's rungs (2, 4, 6: `ELITE_RUNGS`) ringed, the number.
  A click on a diamond sets the Escalation, as on a PC's sheet.
- *Moved:* the ladder's names ("2 Pressing", "4 Relentless", "6 Second Wind") become one small line under the phases; reached in ink, the
  others faint. They are no longer the buttons (the diamonds are).
- *Removed:* the title "Elite Escalation 2" and its small pips (the Esc. row says both); the word "Phases:" in the sentence (now the heading).
- The line is 66 px tall, the PC's height (today it grows with its text, about 70 px here).
- A Standard NPC: only the AP row with part 1's marks, at the left where it is today.

**5. An NPC's Attribute and Modifier tiles in the PC's layout** ("Attributes and modifiers as well").
- The NPC's tiles take the PC's grid (four Attributes, the gap, three Modifier places), every tile the PC's width. The places an NPC doesn't
  use (Signature always; Power when it has no Power Action) stay empty.
- *Changed text:* "Weapon Mod." / "Power Mod." become "Weapon" / "Power", as on a PC's tiles (the long word doesn't fit a PC-width tile).

**6. The Basic attack's subtitle** ("Remove '- high...' ... like 'Basic attack - 2 + 1d6! / 5 + 1d6!'").
- Written from the Action's own Tier 2 / Tier 3 damage (`versions[0].t2` / `t3`), the flat number first: the Orc's Cleaver
  "Basic attack · 1 + 1d4! / 3 + 1d4!", the Ogre's Club "Basic attack · 1 + 1d4! / 3 + 1d6!".
- *Removed:* the rating's word ("Medium", "High") and the "~" estimate (the Builder's suggestion, not what the Action deals).
- *Kept:* an Elite's "+1 Boon on its first attack this round" after it.
- *Also changed:* on that bar the name is never the part that is cut. Today the long subtitle squeezes "Club" to "C…"; in the proposal the
  subtitle's end gives way.

## The choice in part 4, and other assumptions

- **Where the Elite ladder's names go: one line under the phases.** Why not only on the Builder tab: an NPC has no Build tab that lists them,
  a GM runs several NPCs at once, and a ringed diamond alone doesn't say which rung it is. One small line costs no height (the line is the
  PC's 66 px). The names stop being buttons: the diamonds set the Escalation, as on a PC.
- **The phases' states** are the words "✓" and "not yet" (no new mark).
- **A Standard NPC's AP row stays at the left.** The other way (at the right, under an Elite's) would leave an empty cell beside it.
- **The Strikes' red on the light sheet** is darker than the HUD's (`#a8433a`): the HUD is always dark; its `#c0675c` is pale on parchment.
- **Option B's grouping**: Control under Attack (both are things done to an enemy). Any other pairing is one line of code.
- **Part 6 with several damage lines in a Tier**: joined with " + " (not met in the compendium's Basic attacks).
- **Example state**: the Ogre is Bloodied (so one phase shows "✓") at Elite Escalation 2, round 1; both PCs and both NPCs are in combat.

## For Lucas to look at

- **The Reaction AP's diamond and the Esc. row's diamonds** are now the same shape and the same gold, one row apart (the Reaction AP 10 px and
  after a hairline; the Esc. diamonds 8 px with rings). The HUD draws Escalation as upright ticks in ink. If the two diamonds read as one
  thing, the Esc. row could take the HUD's ticks too (not drawn: he asked for the diamonds to stay).
- **An Elite's "+1 Boon on its first attack this round"** doesn't fit the Basic attack's bar at 540 px, today or in the proposal (its end is
  cut). A shorter wording, or moving it off the bar, is his call.

## What is real code and what is not

- **Real:** the sheets as built are the system's own template (`templates/actor-sheet-pc.hbs`, through Handlebars) and CSS
  (`styles/system.css`, `theme.css`) on the sheets mockup's model (`../sheets/model.mjs`, with the fields `../sheets/built.mjs` lays on).
  The Basic attack's subtitle "as built" is written here as `pcsheet.mjs` writes it (its line 251: `npcSuggest` from `npcbudget.mjs`).
- **Not real (the mockup's own):**
  - `group1.css`: every rule under a `.g1-*` class (`.g1-marks`, `.g1-strips`, `.g1-a`, `.g1-b`, `.g1-elite`, `.g1-tiles`, `.g1-sub`), and
    the crops (`.g1-crop-*` hide the parts of the sheet a picture leaves out).
  - `group1.mjs`'s DOM changes on the rendered sheet: `strips` (the strip's color variable set to the theme's), `fourCols` (" AP" removed; the
    names marked for the fit, which runs at the end of the page), `threeCols` (the Attack and Control columns wrapped in one), `elite` (the
    Escalation cell replaced by the phases cell; the Esc. row added to the marks cell), `tiles` (" Mod." removed), `basicSub` (the subtitle
    rewritten from the Action's damage).
  - In the build these would be: the template's marks and the NPC's combat line, `pcsheet.mjs` (the phases as a list, the Elite's marks, the
    tiles' labels, the Basic attack's `sub`), `system.css`, and a fit for the Basic Actions' names in `actor-sheets.mjs` (Option A).
- **Not drawn:** the slowed AP mark (the HUD's dashed, struck square) and "Basic attack: next +1 Bane" under an NPC's marks (kept as they
  are); the out-of-combat line (unchanged); the HUD itself (unchanged). The hover text on a Basic Action that can't be used is the build's
  (allowed: the reason a button is off); the page strips every hover text, so none shows here. Not tried in Foundry.

---

# Round 2 (2026-11-19): the combat line

Lucas approved round 1's parts 1, 2, 3 (Option A), 5 and 6. His answers change only **the combat line**; `round2.html` redraws it, each
"As built (v0.0.442)" beside "Proposed", with round 1's approved marks and tiles already on the proposal. Round 1's page is unchanged.

## What the page draws

1. **Sylwen in combat** (3 of 4 AP, the Reaction AP, one Strike made, Escalation 4).
2. **Aveline in combat** at Escalation 6 with both hooks left, and again with the Critical hook used.
3. **The Ogre Chieftain (Elite)** at Elite Escalation 2, Bloodied; and its Basic attack's bar.
4. **The Orc Warrior (Standard)** in combat.
5. **Sylwen out of combat.**
6. **The fit** (proposal only): four hooks and long names on Aveline (invented, to test that the line never grows).

## What changed against v0.0.442

- *Removed:* **the Hands** (a PC's two weapon tiles). The HUD's tiles and the coming Inventory tab hold them.
- *Changed:* the left of the line is **two lists side by side**, the same on a PC and an Elite:
  - **Hooks** (heading), one hook a line, bold. Today "Hooks left", in a row, each after a gold diamond. The diamond bullet is gone (the
    diamond is the Reaction AP's).
  - **Escalation** (heading), the ladder: 2, 4, 6, one rung a line, the number then its name; reached in ink, the others faint.
- *Changed:* **the Esc. row's marks are the HUD's ticks** (`hudview.mjs escHtml`), filled in ink up to the level, then the number. Today gold
  diamonds with ringed rungs. A click on a tick sets the Escalation (`data-action="setEscalation"`, `data-n`).
- *An Elite:* the same line. Its hooks are its phases ("Bloodied +1", "Strained +1"); its ladder is `ELITE_RUNGS`; it gets the Esc. row.
  Removed: the title "Elite Escalation 2" and its small diamonds, the names as buttons, the sentence "Phases: ...".
- *A Standard NPC:* its AP marks moved to the right.
- *The Basic attack's bar of an Elite:* "+1 Boon on its first attack this round" removed.
- *Out of combat:* see the choices.

## What changed against round 1

- The Hands leave the line (round 1 kept them).
- The Esc. row: ticks, not diamonds (round 1 kept the diamonds, and listed the clash with the Reaction AP's diamond under "For Lucas to look at").
- Part 4's left cell: the heading "Phases" and the words "not yet" are gone; the ladder's names, one line under the phases in round 1, are
  now a list beside the hooks. The same two lists are now on a PC's sheet too.
- A Standard NPC's marks: at the right (round 1 kept them at the left).
- The Elite's Basic attack: the Boon sentence removed (round 1 kept it and let its end be cut).
- The line's height: 72 px (round 1: 66 px).

## The choices (each can be reverted alone)

- **The rungs on the ticks: a taller tick** (16 px against 11 px, standing on the same baseline), as the long marks of a ruler. Why not a gap
  after it: a gap makes three pairs, which reads as "three things" before it reads as six steps, and it changes the row's width with the
  ladder; a taller tick keeps six even steps, shows the rung filled or empty, and needs no second color or ring.
- **The ticks' color: ink** (`--s-ink` filled, `--s-mute` outline), as on the HUD. Gold stays the AP's.
- **Sizes:** a tick 8 px wide (the HUD: 7 x 10).
- **A used hook stays, faint, with a check** ("Critical ✓"); v0.0.442 removes it ("Hooks left"). Why: the heading is now "Hooks", a list;
  the list keeps its shape from the first round to the last; a player sees what is spent and what is left; and it is the same mark as an
  Elite's phase that has happened (Lucas asked for ✓ there). Faint plus the check: never by color alone.
- **Ink means "still to come" on both sheets:** an Elite's phase that has happened is faint with the check; the one not yet met is bold.
- **The heading: "Hooks"** (Lucas wrote "Hook"): it heads a list, and a list of one still reads right. With no hooks: a faint "None".
- **The ladder's heading: "Escalation".** Lucas asked for the list, not for a heading; it is there so the two lists start on the same line
  and the 2 / 4 / 6 say what they count. The marks cell's "Esc." is the short form of the same word.
- **The height: 72 px, fixed** (v0.0.442: 66 px). A heading (15 px) and three lines of 16 px, with 4 px above and below; 66 px would put the
  ladder at about 12 px or drop its heading. The same on a PC and an Elite, in and out of combat.
- **A Standard NPC: 44 px, fixed, its left empty.** One row of marks doesn't need 72 px. No faint word at the left: a Standard has no hooks
  and no Escalation, and "None" would say it could have. (That empty cell is where "Basic attack: next +1 Bane" could go; not drawn.)
- **The lists' widths:** the Hooks list is as wide as its longest hook (at least 118 px, at most half the cell); the ladder takes the rest.
- **The fit** (Lucas: "That area should never grow"): each list shrinks its text by half pixels until no name is wider than its column and
  the list is no taller than its place (hooks from 14 px, the ladder from 13 px). Never cut, never taller. Up to three hooks of a usual
  length stay at 14 px; part 6's four hooks with a 29-letter name land near 9.5 px.
- **Out of combat:** the line keeps its height and its two lists, quiet (no hook bold, no rung reached), and "Out of combat" is written where
  the marks will be. Why: without the Hands the line would be 72 px holding two words; with the lists nothing jumps when combat begins, and
  the ladder (the class's Passives) can be read at any time. An Elite follows the same rule; a Standard shows only "Out of combat" at the
  right (neither NPC drawn out of combat).

## What is real code and what is not (round 2)

- **Real:** every "As built" window (the system's template and CSS, as in round 1); `ELITE_RUNGS` and the Elite's rungs reached
  (`sheetmodel.mjs`); the as-built hooks' fit (`SM.fitHooks`).
- **Not real:**
  - `round2.mjs` `line()` rebuilds the combat line's DOM (the lists cell, the ticks, the empty cell, "Out of combat"); `basicSub()` rewrites
    the Basic attack's subtitle; the fit at the end of the page.
  - `round2.css`: every rule, under `.r2-line`.
  - **The PCs' ladders are stand-ins** written in `round2.mjs` (`LADDER`: Sylwen 2 Lean and Loose, 4 Steady Draw, 6 Apex; Aveline 2 Roving
    Judgment, 4 Weight of Judgment, 6 Apex); the build reads them from the class's Passives. **The hooks** are given by hand too (Sylwen:
    Critical; Aveline: Critical, Kindled Wrath), and part 6's are invented.
  - In the build: the template's combat line, `pcsheet.mjs` (the hooks with their used state, the ladder, the Elite's phases as hooks),
    `sheetmodel.mjs` `fitHooks` rewritten for a list, `system.css`, and the Hands' markup and CSS removed from the sheet.
- **Not drawn:** an NPC out of combat; a PC with no hooks ("None"; the rule is in the CSS); Momentum beside the Esc. number (kept after the
  number, as built); the slowed AP mark and "Basic attack: next +1 Bane" (as in round 1). No hover texts. Not tried in Foundry.
