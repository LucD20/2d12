# To test in Foundry: the running list

The one list of what Lucas tries in Foundry (since v0.0.425; it replaced the per-version "TO TEST" sections of foundry-backlog.md, which stay as
history). **Foundry shows it:** turn on the world setting **Test checklist** (GM): a bar shows one test at a time (Shift+K shows or hides it),
Pass / Fail / Skip; a Fail asks what happened and keeps the console's errors; the bar's List has every test and **Copy report** (paste it to
Claude). The answers are saved in the world.

**How Claude keeps it** (`foundry/twod12/tools/build-checklist.mjs` builds `foundry/twod12/checklist.json` from this file; t268 fails when they
differ):
- `## Group` = where you meet it in play. `### id · vX · Title`, then `Do:` and `Expect:` (a field can go on over several lines), and `Rev: N`
  when a test's text is rewritten so that it must be tried again (its old answer no longer counts).
- A new version adds its tests here (in the group where they are met), rewrites a test it changes (Rev + 1) and deletes a test it replaces.
- A test Lucas reports as passed is deleted from here in the next version (the report's PASS line); a failed one stays until its fix (Rev + 1).
- Only what the automated tests can't see: how it looks, how it feels, Foundry itself. v0.0.387 to v0.0.406 are not here: Lucas tested them at
  the merge ("All works except momentum").
- **Each test's Do names the creature to test it with** (Lucas, 2026-11-18: "When asking for an action on the checklist, write which PC has it").
- The names: the compendium's PCs Aveline (Paladin, Smite), Durgan (Paladin, Lay On Hands), Sylwen (Archer, Quick Shots), Kaela (Archer,
  Strafe); the NPCs Goblin Sneak, Orc Warrior, Grave Wisp, Ogre Chieftain.

## Characters and sheets

### guard-bar · v0.0.500 · The token's Guard bar is taller, closer to the Health bar
Do: Give Aveline Guard 4 (her sheet's Guard button), and look at her token's bars.
Expect: The blue Guard bar above the Health bar reaches further down: about 2 pixels from the Health bar (the brass pin may touch it). The whole bar block keeps its height.

### sheet-bars-click · v0.0.500 · The sheet's bars: a click raises, a right-click lowers; the bar stays still
Do: Open Aveline's sheet. Right-click her Vigor bar a few times, then left-click it; take her Vigor from 10 down to 9, and on to Bloodied (Ctrl+right-click: 5 at a time); do the same on Resolve until Strained.
Expect: A right-click lowers the bar (1 damage), a left-click raises it (1 healed). The bar's track doesn't move or change width when the number loses a digit (10 to 9) or when the Bloodied / Strained tag appears.

## The HUD

### hud-hp-boxes · v0.0.500 · The Token HUD's Vigor (red) and Resolve (blue) boxes
Do: Right-click Orc Warrior's token. In the red Vigor box at the bottom type -5 and Enter; then +2; in the blue Resolve box type 3 (a plain number).
Expect: Two boxes at the bottom of the Token HUD in place of Foundry's one: Vigor (red) and Resolve (blue), each with its number left and "/ max". -5 deals 5 to Vigor only, +2 heals 2 of it, a plain number sets what is left of that pool (Resolve 3). The token's bars, Bloodied and Strained follow. Guard isn't used (a correction, like the sheet's bars).

### status-palette-groups · v0.0.500 · The status palette in groups, with names
Do: Right-click Orc Warrior's token and open its status effects (the conditions button). Click Prone's icon, then click the word Daunted; right-click an icon.
Expect: The palette is in five groups (Health, Movement, Senses, Harmful, Helpful), each condition's icon with its name beside it; an active one is lit (bold name, a gold frame). A click on the icon or on the name toggles it as before; a right-click does what Foundry's right-click did.

### cond-numbers · v0.0.500 · A condition's number on the token and on the HUD's pills
Do: On Aveline's turn, Demoralize Orc Warrior (GM Force Tier 2: Vulnerable 1); give it Slowed 2 from the palette. Look at its token, then select it and look at the HUD's conditions row.
Expect: On the map, the Vulnerable and Slowed icons show their numbers (1, 2) in a white badge with a dark edge on the icon's corner. In the HUD, the pill's icon carries the number as a small badge, so it shows even when the name is cut short.

## Starting a combat

## The roll dialog

### save-tier-words · v0.0.500 · The Save dialog writes each Tier as the card does
Do: Have Aveline (the level 4 build) use Word of Radiance on Orc Warrior, then click Orc Warrior's Save button on the card.
Expect: The Save dialog's three Tiers read like the card ("[R] 3d6 Ho.", "No effect.", an effect's words), never the code ("3d6[mind,holy]").

## Chat cards

## Conditions and their Tiers

## Movement

### large-in-wall · v0.0.500 · A Large token can't end partly inside a wall
Do: Drag Ogre Chieftain (2 x 2) beside a wall so that one column of its squares would end behind it (its center in the open); then, as the GM, Alt-drag it (Forced Movement) toward the wall.
Expect: The drag is refused: "Ogre Chieftain doesn't fit there: part of its space would be inside a wall." A drag where the whole space fits works as before. The Alt-drag stops on the last space where it fits whole (the rest is a Collision).

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
