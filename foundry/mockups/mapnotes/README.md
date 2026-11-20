# The map notes' redesign (mockup, 2026-11-20)

Lucas's request (checklist v0.0.459; foundry-backlog.md "THE MAP NOTES' REDESIGN"): the blinking on tokens must draw more attention
(the Situational tab is good), the map's notes (Forced Movement and its colors, Charge, Advance, Evade, picking whom to push) need a
redesign, and Charge gives no feedback that you must pick an enemy. "It is more interface and intuitiveness than actual design."
**Mockups only: nothing in `foundry/twod12/` or `book/` changed.** The aim: at every moment the player knows what the map asks, what
can be clicked, what each line and label means and costs, and how to finish or cancel.

- `index.html` (`mapnotes.js`, `mapnotes.css`, the shared colors `../style-tokens.css`): opens from the file or a server;
  `?theme=light` for the parchment. Each state: **Today** (redrawn from the code as of v0.0.460) beside **Proposed**, the HUD's
  Situational tab beside the map. The map and its notes don't follow the theme (the map is the map); the HUD and the page do.
- Screenshots (2x): `mapnotes-<state>-dark.jpg` / `-light.jpg` for `legend`, `attention`, `advance`, `evade`, `setup`, `charge`,
  `forced`, `pick`, `controls`, `choices`. `node foundry/mockups/mapnotes/shoot.mjs` remakes them (Playwright; `--1x`, `--out <dir>`).
  The screenshots freeze the attention mark at rest; open the page to see it move.
- Creatures: Durgan, Aveline, Kaela, Sylwen, the Orc Warrior, three Goblin Sneaks (the system's art).

## The shared language (the page's legend)

| Mark | Means |
|---|---|
| Solid pale edge, a 7% pale fill | where this movement can stop (Advance, a Setup's movement, the Charge's farthest square) |
| Dashed pale edge | an Evade (no Reactions; Difficult Terrain closed). The only dashed thing on the map |
| Pale line, a dot a square | the path; an arrow when someone else moves the creature |
| **Gold corners** (+ a number) | **you can click this**: a token or a square; the number is its picture's in the HUD. The Situational tab's gold. Gold means nothing else on the map |
| Red | not allowed / it stops here: a red cross where it stops, the rest red |
| Hatching | Difficult Terrain: pale with "+1" (costs 1 more), red and framed (closed: an Evade, a Charge) |
| The plate | a flat dark box, square corners, Source Sans 3, at the path's end: the count, then the cost or the problem (red) |
| A ring with a dot | the origin of a Forced Movement |
| A faint portrait | where the token stops (Charge, Forced Movement) or started (a Reaction's trigger) |

Every Situational item ends the same way: the thing to do filled and first, the others outlined, the way out quiet and last, then one
key line ("Enter Charge · Esc Give up · Right-click pans").

## The problems found in today's map notes (from the code)

1. **No mark draws the eye.** A waiting Reaction is a dashed amber ring of the same weight as every other line, and still
   (rxoverlay.mjs:136-142); creatures to pick are a 22% gold fill (pickbar.mjs:79). Nothing on the map moves.
2. **One color, several meanings.** Gold is a pickable creature (pickbar.mjs:79), the Charge's limit (move.mjs:1712) and a ghost origin
   (move.mjs:808). Blue is the movement area (move.mjs:1579), a Charge's passed squares (1723) and a Slid path (941). Green is a good push
   path (820) and a Charge's end (1724). White is a Forced Movement's area (815).
3. **Advance and Evade look the same** (move.mjs:1579-1580); the Evade's rules are only in the HUD's sentence.
4. **No count, no cost on the map.** The label is Foundry's ruler ("4 sq (+1)"); past the free squares the drag silently pays a new
   Advance (move.mjs:246).
5. **Charge asks nothing visible.** Before a target only a gold outline and "Click the destination, or an enemy to Charge it"; the
   enemies aren't marked and the tokens can't be hovered (move.mjs:1640). With a target, **any left click on the map Charges**
   (move.mjs:1743-1760). A blocked line hides a two-click arming ("Click to choose it, then again to confirm").
6. **A Forced Movement says its result three times** (the pointer tip `.twod12-pushtip`, the HUD's long bar, and for Slid a notification,
   move.mjs:972) and Escape cancels it silently (move.mjs:1047).
7. **Eight names for ending** (Done, Stop, Cancel, Give up, End movement, Cancel the Action, Charge!, Continue), Escape doing five
   different things and written nowhere, right-click doing three (pan, take back a square, nothing).

## The proposal, state by state

- **a. Attention.** Gold corners around the token, a plate ("Rebuke?" / "Use or Pass in the HUD"), the same corner glyph before the
  HUD item's name. The motion (choice 1): A, the corners breathe (open 14% and back, 2.4 s, never off); B, a steady ring and a slow
  ripple. Still under `prefers-reduced-motion` (and a client setting): the corners carry the meaning alone.
- **b. Advance.** Pale area, the rubble hatched "+1", the plate "5 of 6 · 1 left" / "+1 Difficult Terrain"; at the limit a tick on the
  edge and "7 squares: 6 free + 1" / "the 1 more is an Advance: 1 AP" (red only when there is no AP for it). The HUD: the count big,
  End movement filled.
- **c. Evade.** A dashed edge; the squares it can't enter hatched red; one plate with its two rules.
- **d. A Setup's movement.** The Advance's language; the plate's second line says what comes next ("then Strafe's roll from here");
  the HUD: "4 of 6 squares left" big, Continue: the roll filled, Cancel the Action quiet; Escape named.
- **e. Charge.** Before a target, **the enemies it can Charge get the gold corners and a number, and the HUD lists their pictures**
  ("Pick the enemy to Charge"); too close / too far ones get a quiet plate. With a target: the straight line, the faint portrait on the
  stop square, "5 squares · in Reach" / "then Weapon Attack (1A) on Orc"; only Charge, Enter or a click on the target confirms. Blocked:
  a red cross on the blocker's edge, the result on the plate, and the two real choices as buttons (Give up · 2 AP back, Charge anyway).
- **f. Forced Movement.** The squares to click are gold (they are a choice); the hovered one gets the corners; the arrow points away
  from (Pushed) or toward (Pulled) the origin's ring, Slid's steps are numbered; the result on the plate and once in the HUD; no pointer
  tip, no notification. **Colors (choice 2): no color per kind** (recommended): the kind is direction, which the arrow and the word
  already show; the only free hues are palette A's Tier colors (the map would say "Tier 1" for a push), and a red Pushed fights
  red = "no". B is drawn for comparison.
- **g. Picking whom to push.** The same corners and numbers as a Reaction; a moved creature keeps a quiet "Pushed 1 ✓" plate and its
  picture is checked in the HUD ("1 of 3 moved"); hover lights the token and its picture together, with a short arrow; one end
  button, "Done: the rest stay".
- **h. Controls.** One order (filled first, way out last, named for what it does); Escape presses the way-out button and the key line
  says so; Enter the filled one; **right-click always pans** (Slid's take-back moves to Backspace and a button); ending a Forced
  Movement without moving always posts its line.

## Choices for Lucas (the default is what is drawn as Proposed)

1. **The attention mark's motion:** **A, gold corners that breathe (default)** · B, a steady ring and a slow ripple · C, no motion.
2. **Forced Movement's colors:** **A, one set for every kind; the arrow and the word tell the kind (default)** · B, a color per kind.
3. **Charge without a target:** **A, enemies only, a Charge always picks a creature first, as the book's Charge says (default)** ·
   B, keep clicking a destination square too.
4. **Charge, confirming:** **A, only the Charge button, Enter or a click on the target (default)** · B, any left click (today).
5. **Escape in a Forced Movement:** **A, "Don't move it", posted as "was Pushed 0" (default)** · B, silent (today).
6. **Slid's take-back:** **A, Backspace and a "Take back a step" button; right-click pans (default)** · B, right-click (today).
7. **The plates:** **A, dark in both themes (they sit on the map's art) (default)** · B, parchment in the light theme.
8. **The pointer tip in a Forced Movement:** **A, removed; the plate and the HUD's readout say it (default)** · B, kept.

## What would change if built (no code here)

- `module/move.mjs`: the movement area (`showRange`: pale, Evade dashed, hatching), a plate beside Foundry's ruler while dragging (the
  count, the cost, the limit), the Charge picker (`openChargePicker`: the enemies marked and listed, confirm only by button / Enter /
  the target, the blocked choices as buttons, ties under the text), the Forced Movement pickers (`choosePush`, `choosePath`, `forcedBar`:
  gold squares, the origin ring, one readout, no `.twod12-pushtip`, no notification, Escape = 0 with its line, Backspace), the
  Alt-drag preview's label, `pushPicker` (numbers, the moved ones kept, one end button).
- `module/pickbar.mjs`: the candidates' mark (corners + number instead of a fill), hover linked both ways, one end button.
- `module/rxoverlay.mjs`: the waiting ring becomes the corners (with the motion) and the plate; the trigger drawn in the pale language.
- A new shared drawing module (the corners, the plate, the hatching, the origin ring, the motion with reduced-motion and a client
  setting), used by the files above; the canvas text in Source Sans 3 (today Signika: rxoverlay.mjs, move.mjs:1386, loe.mjs,
  fearline.mjs, flankoverlay.mjs).
- `module/hudview.mjs` (`sitItemHtml`: the corner glyph, the count line, the readout, the key line), `module/setup.mjs` (`setupBar`),
  `module/hud.mjs` (the in-HUD bars), `styles/system.css` (the Situational item's new lines; then `tools/build-theme.mjs`).
- Tests: t264 (no new hover text: the pointer tip goes), the pure parts (counts, labels) as tests.

## Found broken along the way

- `module/setup.mjs:12` `plainSetup` leaves an `@Move` label's braces: Strafe's bar reads "You {Advance}."; a Setup with no label
  ("You @Move[evade|distance:1].") reads "You .".
- `module/move.mjs:1047` + `1154`: Escape during one creature's push returns silently, and the picker then counts it as moved and drops
  it from the list.
- `module/move.mjs:1150`: the push picker's Done and Stop do the same thing.
- `module/move.mjs:1743-1760`: with a Charge target set, any left click on the map launches the Charge.
- `module/move.mjs:835`: a wall Collision reads "Vigor damage" while every other Collision line says "Body" (836, 923, 1061, 1385).
- `module/move.mjs:545-590` (`freeMoveBar`): no Escape handler (Escape does nothing during a free Advance or Evade).
- `module/move.mjs:1053-1054`: `who` is built and discarded (`void who;`).
