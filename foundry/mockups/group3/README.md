# Group 3 (Lucas, 2026-11-19): the PC sheet's Build tab

**A mockup only. Nothing in `foundry/twod12/` or `book/` changed.** Each part shows **today** beside the **proposal**. Today is drawn by the
system's own template (`templates/actor-sheet-pc.hbs`, the Build tab active) and CSS (v0.0.454). The windows are the sheet's real size,
540 × 840 px.

Lucas's three notes:
1. "The Species and Class areas are a bit weird; very thick dark header for example."
2. "The Level changed only through a button with a confirm step."
3. "A more imposing Stage."

## Files

- `index.html` (`group3.mjs`, `group3.css`): open it through a local server from the repository's root:
  `/foundry/mockups/group3/index.html?theme=dark|light`. The links at the top switch the theme.
- `actors.json` is written by `node foundry/mockups/group3/data.mjs` from `packs/_source/pcs`. It holds Aveline, Durgan, Sylwen and Kaela at
  level 1, plus the compendium's level 4 Aveline.
- Screenshots (2x, each under 1.5 MB), one per part, dark and light: `group3-<1..5>-<dark|light>.jpg`. `node foundry/mockups/group3/shoot.mjs`
  remakes them with Playwright (`--full` also saves a whole-page picture; `--1x` saves smaller ones).

**How today is drawn:** the sheets mockup's model (`../sheets/model.mjs`) leaves the Build tab empty. `group3.mjs buildModel` is a copy of
`pcsheet.mjs pcModel`'s "Build tab" part (v0.0.454), with these stand-ins:
- no card is open;
- the viewer is the GM, so Swap on a Rest shows;
- `classwindow.mjs classTalentSlots` is copied.

The confirmation windows are the system's own `pickwindow.mjs pickWindowHtml`, built from `pickConfirm`'s model and the `pwStepHtml` stepper.

**Example data:** "Aveline, level 3" is the compendium's level 4 Aveline lowered to level 3. Everything her levels 1 to 3 gave is the
compendium's. Levels 9 and 13 in part 2 are example numbers only (Stages 2 and 3 aren't written yet).

## The parts

1. **Aveline, level 1:** today and the proposal (the recommended 2A + 3A + 4A), as the window opens.
2. **The Stage, A or B:** option A drawn at Stages 0 to 3, option B at Stages 0, 1 and 3.
3. **The Level, A or B:**
   - the buttons at level 1 (Level down off) and at level 3;
   - the confirmations: level up 1 → 2, level down 3 → 2, and level up 3 → 4 (a new Stage);
   - option B's single window with a stepper.
4. **Species and Class, A or B:** all four compendium PCs, each as today, option A and option B.
5. **Aveline, level 3 (example data):** the whole Build tab, unscrolled, today and proposed.

## Decisions to ask Lucas

**1. The Stage (part 2).**
- **A (recommended): the Stage is the tab's title band.**
  - "Stage 0" is set in Source Serif 4. It is the one big title on the tab.
  - Beside it: its levels ("Levels 1 to 3") and when the next Stage comes ("Stage 1 at level 4"). At the right: the Level and its buttons.
  - Under it, a ladder of the 15 levels in their four Stages: the levels passed are filled, the current one is ringed in the bronze, and the
    Stage reached is named in ink.
  - Why: the ladder shows what a Stage is and how far away the next one is, which a bigger number alone doesn't. It is imposing without
    giving the Stage a color, and the Stage has no meaning a color could carry.
- **B: a plaque.** A ruled square holding "Stage" and the big number, with the Level line beside it. There is no ladder. It is shorter
  (78 px against 100) and quieter.

**2. The Level (part 3).**
- **A (recommended): two buttons, Level up and Level down,** one level per click.
  - Each button opens a confirmation in the pick window's style (`pickConfirm`) that says what the level gives (or takes away) and whether
    the Stage changes.
  - After Confirm, level up opens the class window, as today.
  - Level down now asks every time (today it asks only when something would be lost).
  - At level 15 Level up is off; at level 1 Level down is off. Each shows its reason (the one hover text the rules allow).
  - Level down is outlined in the hairline, not the bronze, so it is the quieter button.
  - Why A: the usual change is one level up, so one click and one confirmation.
- **B: one Change level button** that opens a window with the system's − / + stepper, the new Stage, and what the change gives.
  - Better when a character is made at level 3 in one go. It is one more step for the usual single level.
- Not drawn: a confirmation inside the button itself (the button turns into "Confirm level 2?"). It is lighter, but it can't list what the
  level gives.

**3. Species and Class (part 4).**
- **A (recommended): two ruled entries, laid out like the stat lines at the sheet's top.**
  - Each entry: the kind in grey at the left, the name in bold, Choices as an outlined button at the right.
  - Then two lines, each a grey word followed by a bold value. Vigor and Resolve keep the pool colors; Attributes are in ink.
  - Every line is full width, so nothing wraps.
  - It is 169 px tall against today's 251 px of cards.
- **B: side by side, one column each.** It reads as a pair and is a little shorter (160 px). The columns are narrow: Durgan's four
  Attribute changes already wrap to two lines.

## What the proposal keeps, moves and drops (nothing that works is lost)

**Kept:**
- every number the Species and Class cards show (the Attribute changes, Vigor and Resolve, Speed, Reach, Size, Steady, Weapon, Power,
  Rally, Armor);
- both Choices buttons (`openSpecies`, the Species window; `openClass`, the class's sheet);
- Swap on a Rest (`swapRest`), with the same rule for when it shows;
- the banner "N cards fill no slot" with its Review button (`reviewSlots`);
- the Level 1 / 2 / 3, Escalation, Other and Next levels lists, each row's edit and remove, and the Talent drop slots (none of these are
  touched);
- the plate's "Level 1 · Stage 0" line.

**Changed:**
- **The Level field (`system.level`, saved on change) becomes buttons with a confirmation.** What runs after Confirm is today's flow:
  `twod12.mjs` updateActor, then `classwindow.mjs classLevelChange` (the class window going up; `levelsDown`'s removals going down). A slip
  like "12" typed for "2" no longer opens ten class windows.

**Moved:**
- **Swap on a Rest** moves from the Level's line to the Class entry: beside Choices in A, under the class's column in B. It changes the
  choices the class's level list gave you.

**Dropped:**
- the navy header bars, the filled pills, the filled boxes, and the spaced-out capitals "SPECIES" / "CLASS" (STYLE-3);
- the level after the class's name ("Paladin 1"), since the Stage band shows the level;
- the small grey "Stage 0" after the Level field, since the Stage band replaces it.

**Not touched:**
- the NPC Builder's Level field (an NPC has no class windows);
- the level fields of the item sheets.

## Assumptions I made

- The buttons cover levels 1 to 15, the book's levels. Today's field allows 0, which counts as 1. If level 0 is wanted, Level down would go
  to 0.
- Leveling stays open to whoever owns the sheet, as today (not GM-only).
- One level per click in option A. For several levels, click several times; each click opens its own class window, as the field did.
- The level-up confirmation's text is the tab's own "Next levels" line for that level (`sheetmodel.mjs nextLevels`). The level-down text is
  today's `levelsDown` wording.
- The mock gives the pick windows Font Awesome's arrow-up and arrow-down icons, which the shared icon set lacks.
- Today's Swap on a Rest button gets a stand-in look (a flat, thin-lined button). The page has no Foundry CSS, and without it the button
  would show the browser's white default. In Foundry it takes Foundry's own button style.

## Found in passing (not part of this mockup)

- **The Build tab labels the Escalation 4 and 6 abilities "Escalation 3"** (part 5: Weight of Judgment, Reckoning).
  `sheetmodel.mjs escSectionRank` caps the rank at 3, which is left over from the old 1-to-3 scale; the rungs are now 2, 4 and 6. The Apex
  check (`rank === 4`) goes with the same scale. The fix belongs in the system, not in this mockup.

## Not tried

- Foundry itself.
- The class window that opens after the confirmation (it is today's and isn't drawn).
- Hover and focus states (the hover fill is in the CSS).
