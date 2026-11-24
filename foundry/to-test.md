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

### ui-init-squads · v0.0.490 · Intuitive Initiative Squads & alignment
Rev: 2
Do: Start a combat with Aveline, Durgan, Ogre Chieftain, Orc Warrior, and 4 Goblin Sneaks, then open Initiative. Try Ungroup All then Auto-Squad Minions, "+ Squad" / "+ Add" popovers (including on the bottom row), checkbox multi-select + "Group Selected into Squad", dragging one enemy onto another or into a squad, toggling Goes last, clicking "×" on a member pill, and rolling Initiative.
Expect: Minions auto-group into visual brass-bordered Squad Cards ("×2 · 1 roll") and Auto-Squad Minions re-groups cleanly after Ungroup All; "+ Squad" / "+ Add" popovers open cleanly over neighboring rows without clipping; checkboxes have crisp borders; Goes last rows don't clip their badge or show "+ Squad"; all buttons, pills, dropdowns, and icons sit centered.

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

### enclog-v489-fixes · v0.0.489 · Encounter Log HP Bar header, Undo voiding & clean turn log
Do: In combat with Durgan, Sylwen, Orc Warrior, and Ogre Chieftain: apply damage to Ogre Chieftain then click Undo; have Durgan use Judge (0 AP) and Shield of Faith (Reaction) during Orc Warrior's turn (applying Taunted), then open Encounter Log and click Copy for Analysis.
Expect: The summary column header reads "HP Bar" (not "Pressure"); undone damage is voided so Net matches Max HP − Current; the Turn-by-Turn log prefixes off-turn actions ("Durgan Judge 0A vs OW"), writes "Taunted (Durgan)" without nested build text, and shows "Durgan Rx Shield of Faith vs Sylwen" once without duplication.

## Windows

