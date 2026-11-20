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

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

### judge-gm-dock · v0.0.473 · Judge's question for the GM follows the selection
Do: As the GM, the Orc Warrior attacks Aveline next to Durgan (Judged Orc); when Judge's question comes, click the empty map, then Durgan's token; then deselect Durgan and select him again; answer it.
Expect: Each time Durgan is selected, his HUD opens with the question in its Situational tab (not the large bar); deselected, the question waits in the HUD's middle; the map click releases the Orc as usual.
Rev: 4

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

### log-allies · v0.0.472 · The Encounter Log: numbered names
Do: In a fight with two Goblin Sneaks where only one deals damage, and Sylwen's Volley hits Aveline; open the Encounter Log, copy it.
Expect: The legend reads "GS2 - Goblin Sneak 2" and "GS1 - Goblin Sneak 1"; the damage table and the copy read "Goblin Sneak 2" (not "Goblin Sneak") and "Sylwen" (not "Sylwen (Elf Archer, Quick Shots)"), with Sylwen's damage to Aveline as "to allies".
Rev: 3

## Windows

