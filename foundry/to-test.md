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

## The HUD

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

### hq-lingering · v0.0.531 · Rev 4 · The Token HUD sits under every window; its Lingering click still adds or ends one
Do: Select Kaela (or the Orc Warrior) and open her character sheet. Right-click her token so Foundry's Token HUD shows (combat toggle, the status palette, the Vigor / Resolve boxes), then drag the sheet over the HUD. Open the status palette and click Lingering: give 1d6 Fi in the window that opens; click Lingering again and choose "Add another Lingering", then once more and choose "End" on one.
Expect: The sheet covers the Token HUD where they overlap (the HUD is under it, not drawn through it); the Lingering damage window opens above the Token HUD, and any other window (the sheet, a pick window) is above it too. The Token HUD's Vigor / Resolve boxes and its status palette are still above the system's HUD bar at the bottom. With a Lingering already on, the click asks in the bottom bar "Add another Lingering", one "End Lingering ..." for each, and Cancel; "End" removes only that one.

## Movement

### ox-charge · v0.0.530 · Rev 2 · Charge stops at the weapon's normal Range
Do: Durgan (Arming Sword) Charges an Orc Warrior 5 squares away. Then Sylwen, with her Hunting Bow in hand, Charges an orc about 14 squares away; then with only her Dagger in hand.
Expect: Durgan stops adjacent, as before (the orc at 5 squares is not "too close"). Sylwen with the bow stops on the first square from which the orc is within 8 squares (the Hunting Bow's normal Range, 8/16/24), the line and texts saying "in Range"; an orc already within 10 is "too close" (fewer than 3 squares to run). With the Dagger the bottom bar first asks "Dagger (in hand) (Range 1)" or "Dagger (thrown) (Range 4)", and she stops where that Range reaches.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
