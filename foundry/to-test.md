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

## The HUD

### hud-hp-boxes · v0.0.501 · The Token HUD's Vigor (red) and Resolve (blue) boxes, above the HUD bar
Do: Right-click Orc Warrior's token (with the system's HUD bar open at the bottom of the screen, and a window open behind it). In the red Vigor box type -5 and Enter; then +2; in the blue Resolve box type 3.
Expect: Both boxes, and the whole Token HUD, show above the system's HUD bar and the windows, and both can be clicked. -5 deals 5 to Vigor only, +2 heals 2 of it, a plain number sets what is left of that pool (Resolve 3). The token's bars, Bloodied and Strained follow.
Rev: 2

### status-palette-groups · v0.0.501 · The status palette in groups, with names, above the HUD bar
Do: Right-click Orc Warrior's token and open its status effects (the conditions button). Click Prone's icon, then click the word Daunted.
Expect: The palette shows whole, above the system's HUD bar and the windows: five groups (Health, Movement, Senses, Harmful, Helpful), each icon with its name; a click on the icon or the name toggles it.
Rev: 2

### cond-numbers · v0.0.501 · A condition's number on the token and on the HUD's pills
Do: On Aveline's turn, Demoralize Orc Warrior (GM Force Tier 2: Vulnerable 1); give it Slowed 2 from the palette (then raise it to 3). Look at its token, then select it and look at the HUD's conditions row. Also look at a creature that already had a valued condition before the update (reload the world as GM).
Expect: On the map, the Vulnerable and Slowed icons carry their number in a dark disc with a gold ring in the icon's lower right corner (1, then 2, then 3 when it rises). In the HUD's row, the pill shows the number in bold right after the icon, before the name. A condition applied before the update gets its numbered icon when the GM loads the world.
Rev: 2

## Starting a combat

## The roll dialog

### save-tier-words · v0.0.501 · The Save dialog writes each Tier as the card does, readable in the dark theme
Do: In the dark theme, have Aveline (the level 4 build) use Word of Radiance on Orc Warrior, then click Orc Warrior's Save button on the card. Then try a Save Action whose Tier pushes or knocks Prone.
Expect: The Tiers read like the card ("[R] 3d6 Ho.", "Pushed 1", "Prone"): no "3d6[mind,holy]" and no "@Move". The [R] and the other game words are the light colors of the dark theme (as in the roll dialog), not dark blue.
Rev: 2

## Chat cards

## Conditions and their Tiers

## Movement

### large-in-wall · v0.0.501 · A Large token can't end partly inside a wall
Do: Drag Ogre Chieftain (2 x 2) beside a wall so that a column of its squares would end inside the rock, even only its outer part, in combat and out of it; then drag it flush against a straight wall (its side on the wall's line).
Expect: The drag into the rock is refused: "Ogre Chieftain doesn't fit there: part of its space would be inside a wall." Flush against a wall it stands (nothing of it inside). The GM's Alt-drag still stops before the wall.
Rev: 2

### push-large-cone · v0.0.501 · Pushing a larger creature: the cone from its nearest square (book, Chapter 3)
Do: With Aveline beside Ogre Chieftain (2 x 2), level with its top square on its left side, use Shove (GM Force Tier 3: Pushed 3) and hover the squares beyond it; then Pull it with Drawing Light from 3 squares to its left.
Expect: The push can go straight away or diagonally to either side, the same cone a Medium creature gets (from the Ogre's square nearest Aveline, not from its center): no side is cut off. The pull's cone points straight at Aveline from the Ogre's nearest square.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
