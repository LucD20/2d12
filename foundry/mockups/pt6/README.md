# Playtest 6, section 6: the five redesigns (D1 to D5)

Lucas's notes: `book/playtest-6.md`, section 6. **Mockups only: nothing in `foundry/twod12/` or `book/` changed.** Each part draws **today**
(the system's own code and CSS on example data, as the code stood on 2026-11-19) beside the **proposal**, dark and light. Where a choice is
real there are two options, A and B, with the one recommended and why.

- `index.html` (`pt6.mjs`, `proposal.mjs`, `pt6.css`): open it through a local server from the repository's root
  (`/foundry/mockups/pt6/index.html?theme=dark|light`; the links at the top switch).
- Screenshots (2x): `pt6-dark.jpg`, `pt6-light.jpg` (the whole page) and one pair a part: `d1` to `d5` (`-dark.jpg`, `-light.jpg`).
  `node foundry/mockups/pt6/shoot.mjs` remakes them (Playwright; `--1x` for small ones, `--out <dir>`).
  `node foundry/mockups/pt6/data.mjs` remakes `actors.json` from the packs' source.
- Creatures: Durgan (D1, D2, D5's HUD), Aveline and Sylwen (D4), the Goblin Sneak (D2, D5), the Orc Warrior and the Ogre Chieftain (D2, D3).
  Kaela is in `actors.json` but no part needed her.

**Lucas's answers (2026-11-19) and the build (v0.0.454):** D1 window B for both windows, the message A written in lines; D2 B; D3 all proposed but no symbols on the Attributes, AD the shield with a dot, WD the talisman; D4 A, a Use button short of AP stays in place struck and faded (no "no AP left"); D5 A. `built.html` (`built.mjs`) draws D1 and D2 as built. **`index.html` no longer runs:** its "today" pictures used `healwin.mjs healModel`, removed in v0.0.454; its screenshots stay as the record.

## What each part proposes

**D1. The Rally window and its chat message.**
- The window: 640 px becomes 400 px, in the table look. One sentence at the top ("Durgan heals 9"; with bonuses each part and its source
  under it), the Rally Points as the sheet's marks with "5 of 7 left", one row a kind of damage ("Vigor 9 → 3 of 23"). The − and + show only
  when there is something to choose (two kinds of damage and less healing than damage).
- Removed: the navy header and its icon, the stats strip (merged into the rows), the column headings, the pill, the sentence about the
  symmetrical split, "All of it given", "Removes 9 damage." Kept: every number and every control.
- Added: when an Action lets you use up to N Rally Points, the count is the window's first line (today a window before this one).
- **Window, A (recommended):** rows of numbers, the steppers in sight. **B:** the pools as the HUD's bars, the split behind "Change the split".
- **Message, A (recommended):** one line (sysLine): "Durgan uses 1 Rally Point: heals 9 Vigor. 6 left." **B:** the card kept (sysCard), each
  thing said once: "Durgan heals 9 Vigor" / "1 Rally Point · 6 of 7 left".

**D2. The chat card's sliders button becomes the breakdown.**
- The button (an equals sign, "Damage breakdown") opens a panel under that target's row: each pool's damage by type, Resist / Weak / Immune,
  a reduction with its source's name, Guard, what the pool takes; then Lethal or Nonlethal and Full / Half / Double. After Apply the same
  button shows what happened.
- Full / Half / Double: a small menu on a right-click on Apply (on Undo once applied). A "half" a Reaction asked for makes Apply read
  "Apply half" with the reason under it.
- **A (recommended):** one line a pool, written as the sum ("2 Pi − 3 Shield of Faith = 0 Vigor"). **B:** a ledger, one step a line.

**D3. A symbol beside each stat of the NPC sheet.** Sixteen line drawings in the text's color, 14 px, before the word: AD (a great helm),
WD (a talisman), Speed (a boot), Reach (a spear), Size (a figure against a measure), Steady (an anchor), Guard (a buckler), Immune (a barred
ring), Resist (a half-filled shield), Weak (a cracked shield), Body (a fist), Mind (a book), Appeal (a crown), Instinct (an eye), Weapon
(a sword), Power (an orb). Nothing moves; the sheet keeps its height. **The one choice:** the two Defenses as a helm and a talisman
(A, recommended) or as one shield, plain and charged (B).

**D4. A click on an Art opens its card.** The card the HUD's right-click draws today (every Mode with its Distance, Target, Save and Effect
and its own "Use · 1 AP"), with a top line added (the name, "Paladin Art · Once per round", "Choose a Mode"). The pick window with the three
names goes. **A (recommended):** the floating card, from the sheet and the HUD. **B:** the card in a window, pick a Mode, then Use.

**D5. The Minions' picker.** In the HUD's Situational tab, in that section's own format: "Goblin Sneak · 3 of the squad left", "Which one
goes now?", then one 40 px square a Minion with its token's picture; the name on a hover; the hovered one lit on the map and a click on the
map still picks (both as today). **A (recommended):** each picture carries its token's number. **B:** the pictures alone.

## Decisions to ask Lucas

1. **D1, the window:** A (rows, steppers in sight) or B (bars, "Change the split")?
2. **D1:** merge the "How many?" window into the Rally window (the count as its first line), or keep two windows?
3. **D1, the message:** A (one line) or B (the card)? With A: is it right that nothing is posted while the window is open or when it is
   cancelled? (Today the card is posted first, because Lay On Hands' extra roll rides on it; with A the roll would ride on the line.)
4. **D1:** should the Heal window (an Action's @Heal) take the same look? (Assumed yes; not drawn.)
5. **D2, the panel:** A (the sum) or B (the ledger)?
6. **D2:** is the equals sign the right mark for the button? And is a right-click on **Undo** the right place to change Full / Half / Double
   after applying?
7. **D2:** naming the reduction's source ("− 3 Shield of Faith" and not "− 3 Guard") needs the reduction to remember what gave it (today
   `reduceNext` is a number counted with Guard). Wanted?
8. **D3:** the set as drawn? The two Defenses: A (helm, talisman) or B (two shields)?
9. **D3:** only the NPC sheet, or also the PC sheet and the HUD's two stat lines (same words)? Should the chat's Resist / Weak / Immune
   icons take these drawings (Weak would stop being a flame, which is Fire's icon)?
10. **D4:** A (the floating card) or B (a window)? From the sheet, where should the card open (drawn: beside the row clicked)?
11. **D5:** A (pictures with the token's number) or B (pictures alone)? The hover name is a new hover text (t264's list).

## Assumptions I made

- **D1:** short names ("Durgan") in the window's title and in the message; Nonlethal damage is listed under its pool, in the order Vigor,
  Vigor Nonlethal, Resolve, Resolve Nonlethal (today: Vigor, Resolve, then the two Nonlethal); the Rally Points this use spends are dashed
  rings in the accent; the footer's words are "Split evenly by default." and "N left to give".
- **D1's examples:** "Font of Mercy +3" and Lay On Hands' roll are example bonuses laid on Durgan; his damage (9 Vigor; then 9 Vigor,
  2 Vigor Nonlethal, 6 Resolve) is example data.
- **D2's examples:** the Goblin Sneak's Rusty Knife for 2 Pierce on Sylwen with Shield of Faith's 3; Durgan's Smite on an Orc Warrior given
  Resist 2 Slash, Weak 2 Holy and Guard 2. The rolls and totals are invented; the order of the steps is the system's (`afterResist`,
  `guardSplit`).
- **D2:** on the page the right-click menu sits inside the row (the card clips what floats); in the build it floats under the pointer.
- **D3:** Health, Vigor and Resolve get no new symbol (Health is the pools' sum; the pools have their color, their bar, and the heart and
  brain in damage lines). The Orc's Resist 2 Blunt, Weak 2 Fire and Guard 2 are example data.
- **D4:** "no AP left" on Spotter's Find the Gap is an example of a Mode that can't be used.
- **D5:** the HUD drawn is Durgan's right end, cropped (the question sits in whatever HUD the GM has on screen); the map strip and its three
  tokens are stand-ins; the mixed squad uses the Orc Warrior's picture under an invented name.

## What is the system's own code, and what is not

- **The system's (every "Today" picture):** the Rally window (`healwin.mjs healModel` through `pickwindow.mjs pickWindowHtml`), the "How
  many?" window (`rally.mjs askHowMany`'s model), the Rally card (`sysmsg.mjs sysCard` with `rally.mjs`'s lead and text), the attack cards
  with their damage (`chatcards.mjs attackCardHtml`), the NPC sheets (`templates/actor-sheet-pc.hbs` on `../sheets/model.mjs`), the Art's
  pick window (`pickwindow.mjs`, `actions.mjs`'s model), the Art's card (`actioncard.mjs buildActionCard`), the HUD (`hudview.mjs
  tokenBarHtml` on `../hud3/model.mjs`) and today's question (`pickbar.mjs pickBarHtml`).
- **The page's own:** Foundry's window title bars and chat frames (stand-ins); every proposal (`proposal.mjs`, `pt6.css` under `.p6-*`).
  D2's and D4's proposals start from the system's card and change it in the page; D3's adds the symbols to the system's sheet. D1's messages
  go through the real `sysLine` / `sysCard`.
- **Dropped or not reproduced:** today's Rally window in a real Foundry frame (the frame is a stand-in); the Weak icon after "Took" on
  today's applied card (its flame isn't in the mockups' icon set, so only Resist's shows); hover texts (the page strips them; D5's is drawn
  as if hovered); D5's "today" with the GM's own HUD (an NPC's bar isn't in the mockups' HUD model). Not tried in Foundry.
