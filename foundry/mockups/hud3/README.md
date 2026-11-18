# The HUD, round 3 (playtest 5, group D): the mockup

Lucas (playtest 5, `book/playtest-5.md` sections D and 1g): the Basic tab needs refitting (D1); both Modifiers, no Vigor / Resolve words and
a readable weight in the identity area, "mostly good so it's small" (D2); the macro bar at the bottom, the Hands above it, the empty space
the **Situational section** for every "act now" control, the triggers included (D3); a condition as an icon under AP / Esc, the HUD must not
grow (D4); Strafe's Advance in the HUD's place, not the old floating bar (D7).

**A mockup only: nothing in `foundry/twod12/` or `book/` changed.** For each state the page draws **today's HUD above the proposal**, at the
same width (1500 px) and the same height (150 px), dark (the default) and light.

- `index.html` (`hud3.mjs`, `model.mjs`, `proposal.mjs`, `hud3.css`): open it through a local server from the repository's root
  (`/foundry/mockups/hud3/index.html?theme=dark|light&state=<id>`; the links at the top switch).
- Screenshots (2x): `hud-dark.jpg`, `hud-light.jpg` (the whole page) and one pair a state: `a-sylwen`, `a-durgan`, `b-sylwen`,
  `b-conditions`, `c-kaela`, `d-sylwen`, `d-durgan` (`-dark.jpg`, `-light.jpg`).
  `node foundry/mockups/hud3/shoot.mjs` remakes them (Playwright); `node foundry/mockups/hud3/data.mjs` remakes `actors.json` from the built packs.

## The states

| | Who | What it shows |
|---|---|---|
| (a) | Sylwen, Durgan | Their turn, nothing waiting: the Situational section is empty ("Nothing waiting.") |
| (b) | Sylwen | Prone and Hindered, **the Basic tab open (D1)**: the conditions under AP / Esc (D4); Stand and Crawl in the Situational section |
| (c) | Kaela | Strafe clicked: its Setup's Advance waits in the Situational section (D7); today the floating bar |
| (d) | Sylwen | A trigger: Snap Shot on the Goblin Sneak's turn, with Use and Pass |
| (d) | Durgan | Judge's question, "Reduce that damage by 1?" |

## What changes, and why

The bar keeps its four parts and its height. Their widths: portrait 84 | identity 268 → **300** | the tabs | the side panel 260 + the macro
bar's block at the right end (about 160) → **one right column of 312**. The tabs' area gains about 75 px at 1500.

1. **The identity column (D2).** The same rows in the same order (name, the two bars, Guard and Rally, AP and Escalation), then the
   numbers as two ruled lines of words: `AD 12  WD 12  Speed 7 | Weapon +2  Power +1`, then `Body −1  Mind +2  Appeal +1  Instinct +2`
   (a click still rolls the Check, Shift the Save). Every label is in the muted ink at weight 600 and 12.5 px (today 10 to 11.5 px in the
   faint ink, the labels "Wpn", "Pow", "Bo", "Mi", "Ap", "In" under the numbers); every number is bold. No Vigor or Resolve word (the bars
   carry only their numbers, as they do since v0.0.418).
2. **The conditions (D4).** A row under AP / Escalation, always there (19 px), so a condition never changes the HUD's height. Each condition
   is its icon in a small square; a click opens the Effect (as its word did in the side panel).
3. **The Basic tab (D1).** The sheet's four groups as the four columns (Attack, Movement, Control, Utility: `config.mjs basicGroups`),
   every Basic Action on one line with its cost stamps (each stamp is the Use button, as on the other tabs and on the sheets' mockup), all
   19 on the screen at once. Today: columns by Frequency, three lines a column, twelve shown and "+7 more". What can't be used now is dim
   with dashed stamps (Prone: Advance, Evade, Charge). The Frequency is the muted strip at the row's left and a Strike its second strip, as
   on the sheet (STYLE-3, step 3).
4. **The right column (D3, D7).** From top to bottom: **the Situational section**, the Hands, the macro bar.
   - The Situational section holds whatever asks for an answer now, in one format: a bold lead, a quiet word for what it is, one or two
     lines, the buttons (outlined in the accent; the "no" answer in the quiet outline). With something in it the section takes the accent's
     top line and tint (what the granted uses and the side question use today). Drawn: Prone (Stand, Crawl 1, Crawl 3), a Setup's movement
     (Continue: the roll, Cancel the Action, the squares left), a trigger (Use · 1R, Pass), Judge's question (Reduce by 1, Not now).
     Not drawn, the same format: Linked Actions and granted uses (today's "Granted" block moves here unchanged), Forced Movement ("Push the
     Orc Warrior 2 squares", Done), End movement after an Advance or Evade, every pick bar question.
   - The Hands: one tile a hand, side by side (the sheets' mockup's tile: the weapon, then Main, Off or 2H; a free hand dashed). A click
     opens the Hands panel.
   - The macro bar: Foundry's ten slots in one row at the bottom of the column.

Style: STYLE-3 as built (Source Sans 3 for everything; no serif in the HUD, it has no big title), the dark table look (flat, thin lines,
outlined buttons), color only where it means something (the pools' bars, the Frequency squares and strips, the bronze accent). No pill, no
box inside a box, no spaced capital label.

## Every element added, moved or removed against today's HUD

**Added**
- A1. The conditions row under AP / Escalation (D4).
- A2. The Situational section, with "Nothing waiting." when it is empty.
- A3. In the Situational section: Stand, Crawl 1 and Crawl 3 while Prone, with one line saying what Prone leaves (D3).
- A4. In the Situational section: a Setup's movement, with the squares left (D7).
- A5. The Basic tab's four group heads (Attack, Movement, Control, Utility) and the Frequency and Strike strips on its rows (D1).
- A6. The second hand's tile ("Free (Fists) Off").
- A7. The words "Weapon", "Power", "Speed", "Body", "Mind", "Appeal", "Instinct" in the place of the abbreviations (D2).

**Moved**
- M1. The conditions: from the side panel's "On you" line to the row under AP / Escalation (D4).
- M2. The macro bar: from the HUD's right end (two rows of five) to the bottom of the right column (one row of ten) (D3).
- M3. The Hands: from the top of the side panel to above the macro bar (D3).
- M4. A waiting Reaction: from the side panel's alert to the Situational section (D3).
- M5. A pick bar question (Judge's, a Push's square, "Who gains the Guard?"): from the side panel's slot to the Situational section.
- M6. The granted uses ("Granted by ..."): from the side panel to the Situational section (same lines).
- M7. A Setup's movement and End movement: from the floating bar over the map to the Situational section (D7).
- M8. The Attributes: from the cells beside the Defenses to their own line under them.

**Removed**
- R1. The word "Hands" and the "Regrip" / "Draw" button that shows on hover (the tiles are the button).
- R2. The "On you" label.
- R3. The Basic tab's Frequency columns, the roll line under a Basic Action ("Weapon +2 vs AD · Strike") and "+7 more".
- R4. The jump to the Reactions tab when a Reaction triggers (decision 2).
- R5. The pick bar's third button "Cancel" on a question that already has a "no" answer (Judge: Not now).
- R6. The floating Setup bar (D7).

## Three decisions for Lucas (the recommendation first)

1. **A condition under AP / Escalation: the icon and its word while up to three fit, the icons alone past three (recommended)**, or
   always the icons alone (D4 as written). Why: the tooltip review left no hover text, so an icon alone has nothing to say its name but a
   click; with the word, Prone and Hindered read at a glance and the row is the same height. Both are drawn in `b-conditions`.
2. **When a Reaction triggers: the HUD stays on the tab that was open, and the Reaction shows only in the Situational section
   (recommended)**, or it also jumps to the Reactions tab as today. Why: one place to look, and nothing moves under the pointer (the
   jump was D5's complaint). The chime and the name on the map stay as they are.
3. **The Basic tab: what can't be used now stays in its place, dim (recommended)**, or it is hidden. Why: every Basic Action keeps its
   place, so the hand learns it; hidden rows would make the list move each time a condition changes.

## Assumptions I made

- **State (c) is Kaela**, the compendium's Archer with Strafe (playtest 5's own): Sylwen's Hallmark Action is Quick Shots.
- The Situational section shows the first thing waiting whole (its height is about 80 px: a lead, two lines, the buttons); a second one
  would wait under it as its lead and buttons on one line. Not drawn.
- "Nothing waiting." is written when the section is empty, so the place is learned; it can be left blank.
- The trigger's button says "Use · 1R" (the cost stamp with its verb), since a bare "1R" beside "Pass" reads less clearly.
- The Setup's buttons are "Continue: the roll" and "Cancel the Action" (today "Continue" and "Cancel").
- Light is drawn because the HUD follows Foundry's Interface scheme since v0.0.387.

## Found while drawing (not part of the proposal)

- **Today's identity column pushes Instinct out of the bar.** `.hb-defs` is a grid of 4 + a gap + 4 columns, and v0.0.418 added the Power
  Modifier as a ninth cell: "In" wraps to a second row, under the HUD's bottom edge (see every "Today" picture). The proposal's two lines
  replace that grid.
- **Full AP pips may draw empty on the dark theme.** In this page's Chromium, v0.0.418's scoped rule for every pip
  (`:scope .twod12-hud .hm-ap i:not(.x)`, a dark center) wins over v0.0.421's unscoped rule for a full pip (same specificity; the scoped
  one is nearer). The page sets the meant look for both HUDs. To check in Foundry; if it shows there, the fix is to scope the second rule too.
- Today, a waiting Reaction's alert is taller than the side panel: its tint hangs under the bar (`d-sylwen`, Today).

## What could not be drawn with the real code

- **Drawn by the system's own code:** today's whole bar (`hudview.mjs tokenBarHtml` with the system's CSS), the pick bar's question
  (`pickbar.mjs pickBarHtml`), and in the proposal the marks, the Escalation ticks, the Health bars, the tabs' Action lines and columns
  (`marksHtml`, `escHtml`, `barHtml`, `lineHtml`, `colsHtml`), the hand tiles (`pcsheet.mjs handTiles`), the numbers (`data.mjs
  prepareDerivedData` on the compendium characters), each line's roll (`rollsource.mjs`, `config.mjs vsText`, `cardview.mjs`), what can't be
  used (`cardview.mjs versionButtons`, `sheetmodel.mjs basicUnavailable`), the Technique filter (`mastery.mjs techniqueState`: Seizing
  Cut is left out for Durgan, D6).
- **Built by hand:** the bar's model (`hud.mjs barModel` needs a live actor and combat: `model.mjs` follows it line by line), the example
  state (AP, used Actions, conditions, the trigger's and the question's texts), the Setup bar's HTML (copied from `setup.mjs setupBar`).
- **Stand-ins:** the condition icons (Foundry's `icons/svg/falling.svg` and `downgrade.svg` are not in the repository: small drawn
  pictures take their place), Font Awesome (the mockups' drawn set), Foundry's macro bar (ten plain slots; its page arrows and lock are
  not drawn), the map behind the HUD.
- **Mockup CSS only:** the identity column, the conditions row, the Basic tab, the right column (`hud3.css`, the classes `h3-*`).
- Not tried in Foundry. The action card on right-click, the folded bar, the party strip and an NPC's bar are unchanged and not drawn.

## Built (v0.0.441, pack SHEETS-HUD)

The approved proposal ("All recommended") is built into the system. `built.html` (`built.mjs`, `built.css`) draws the HUD **as built** (hudview.mjs tokenBarHtml with the system's CSS) in six of this page's states; `built-dark.jpg` / `built-light.jpg` are its screenshots. The "Found while drawing" items: Instinct fixed in v0.0.440; the AP pips draw full in the built page; the waiting Reaction's alert now stays inside the bar (the Situational section scrolls in its row).
