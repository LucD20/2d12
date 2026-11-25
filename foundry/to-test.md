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

### enclog-new-lines · v0.0.511 · The Encounter Log: Flanking, blocked moves, Checks, and what cards took
Do: In a combat: flank Orc Warrior with Aveline and Durgan and make Aveline's Basic Attack; try to Advance Kaela through Goblin Sneak's square (refused), then Tumble past it, clicking its Instinct Check with the Goblin targeted; let the Orc hit Aveline while Judged by her (and once while she has Guard from Durgan's Lay On Hands). End the combat and use Copy for Analysis.
Expect: The log shows "Basic Attack vs Orc Warrior T2 (flanked)", "Kaela's Advance is blocked by Goblin Sneak" and "Kaela: Instinct Check N vs DC N (Goblin Sneak) T2". The copied report has a table "Enemy Damage: What Reached the Party, and What Cards Took" (the Orc's raw damage, what reductions took, the class cards' share of it from Judge and the Lay On Hands Guard, and "Would reach a plain PC"), and the watchlist lists Flanking Boons by side, moves refused by blocking and the Checks.

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
