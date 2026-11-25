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

## Hiding

### hide-marks · v0.0.515 · The Hide marks: seals at rest, lines on select or hover for 5 seconds
Do: Make Kaela Unsensed to Goblin Sneak and Hidden to Orc Warrior with Hide. Look at her token with nothing selected; then select her; wait; hover her. Then log in as a player (or look with a player's view) and do the same; once as the GM, make Goblin Sneak hide from Kaela and look at its token as a player.
Expect: At rest, two small seals on Kaela's left edge: an empty dashed ring (Unsensed) and a half-filled disc (Hidden). Selected or hovered: a dotted line to the Goblin with a plate "Unsensed" under it, a dashed line to the Orc with "Hidden"; after 5 seconds they fade, and come back when she is selected or hovered again. Players see Kaela's marks; they don't see the Goblin's (only the GM does).

### lines-5s · v0.0.515 · Line of Effect's and Flanking's lines fade after 5 seconds
Do: Turn on Show Line of Effect and Show Flanking in the token controls. With Aveline selected and Orc Warrior targeted (Durgan opposite the Orc), wait 5 seconds; then hover a token, and select or target again; move a token while the lines are up.
Expect: The lines and their plates fade out 5 seconds after the last selection, hover or target, and come back with the next one. Moving a token doesn't keep them up. Turning a toggle on shows its lines for 5 seconds.

### hide-auto · v0.0.514 · Hide targets by itself, and isn't Doomed through a wall
Do: Put Kaela behind a wall from Goblin Sneak (it can't see her) and behind a crate from Orc Warrior (High Cover; it sees her). Target nobody and click Hide.
Expect: It targets the Goblin and the Orc by itself (not a creature that sees her without High Cover); the roll against each is not Doomed (no Hidden or No Line of Effect penalty), only against its Instinct DC. Afterwards, with the Goblin selected (its vision), Kaela shows no sound ripple to it (Unsensed); the Orc still has its ripple or sight of her.

### hud-basic-5 · v0.0.514 · The HUD's Basic tab in five columns
Do: Select Kaela and open the HUD's Basic tab. Then select Orc Warrior.
Expect: Five columns: Attack, Movement, Control, Stealth (Hide, Sneak, Seek, Point Out, Lean), Utility, five or six Actions each, none cut off. The Actions tab on the sheet keeps its four groups.

### check-card-new · v0.0.514 · A card's Check button posts the new Check card
Do: Target Goblin Sneak and use Tumble with Kaela; in its chat card click Appeal Check.
Expect: The result is the new card (the stamp, the ladder against the DC, the breakdown), titled "Appeal Check vs Goblin Sneak", against the Goblin's Appeal DC. Not the old block with a Tier table.

### seek-pointout · v0.0.514 · Seek finds, Point Out shows
Do: With Kaela Unsensed to Goblin Sneak and Hidden to Orc Warrior from Hide, on the Goblin's turn click Seek in the HUD (the 1 AP and the 2 AP Version once each), without targeting anyone. On the Orc's turn, use Point Out on Kaela (the Orc must perceive her better than the Goblin does).
Expect: No error. Seek targets by itself the creatures hiding from the Goblin within 5 squares (1 AP) or 10 (2 AP; from the sheet it asks which); no Doomed roll for Senses; on a Tier 2 or 3 the Goblin perceives her 1 step better. With nobody hiding in range it warns and spends nothing. Point Out on a Tier 2 asks which ally within 10 squares (or picks the only one) and improves its perception of Kaela 1 step; on a Tier 3, every ally within 10 squares.
Rev: 2

## The HUD

### charge-reselect · v0.0.514 · Charge: an empty click deselects, the bar comes back; only the button confirms
Do: On Durgan's turn, start a Charge and pick Orc Warrior. Click the Orc again. Click an empty part of the map, then select Durgan again. Click the Charge button. When the Charge ends in Reach, look at the HUD's Situational tab; another time, click its Cancel.
Expect: Clicking the Orc again doesn't launch the Charge (only the button, or Enter, does). The empty click deselects Durgan; reselecting him brings the Charge bar back into his HUD. After the movement the Situational tab's "Charge · Basic Attack (1A)" pulses, as a Reaction does; Cancel removes it.
Rev: 2

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
