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

### hide-owner-only · v0.0.518 · The Hide lines: only the GM and the hider's player
Do: Make Kaela hide from Goblin Sneak. Select or hover her as the GM, as Kaela's player, and as another player (Sylwen's).
Expect: The GM and Kaela's player see the lines and plates; Sylwen's player sees none.

### hiding-fold · v0.0.518 · The HUD's Hiding entry folds to its title
Do: Select Kaela while she hides from two creatures; click "Hiding" in the HUD's Situational tab; click it again. Reload, select her.
Expect: The first click folds it to its title ("Hiding · from Hide · 2" with a chevron), the second unfolds it. After a reload it stays as you left it (for you only).

## The HUD

### charge-reselect · v0.0.518 · Charge by targeting: clicks select as usual, the Charge's candidates too
Do: As the GM, start Orc Warrior's Charge (Durgan within its reach). Click Durgan, then click the Orc again; click an empty square; target Durgan (T) and click the Charge button.
Expect: Clicking Durgan selects him (the gold squares under him don't stop the click), and clicking the Orc selects it again with its Charge bar back in its HUD. Targeting Durgan aims the Charge at him; only the Charge button (or Enter) charges.
Rev: 4

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
