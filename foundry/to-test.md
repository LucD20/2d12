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

### steady-draw-de · v0.0.510 · Steady Draw: the roll dialog's 2dE chip, paid on a Tier 2 or 3
Do: In a combat, open Kaela's Basic Attack roll dialog (her bow) against Goblin Sneak and tick the chip "Reaction Point: 2dE more on a Tier 2 or 3". Roll until one roll gets a Tier 1 and another a Tier 2 or 3 (tick the chip each time), then roll its damage. Open the roll dialog once more.
Expect: The chip is off until ticked; ticked, the Tier 2 and Tier 3 previews show +2d4 (2d6 at Escalation 3, 2d8 at 4...). On a Tier 1 nothing is spent and the chip is offered again. On a Tier 2 or 3 her Reaction Point is spent and the damage shows 2 more dice named Steady Draw (the bow's subtype, no exploding dice). After that, the chip is gone for the rest of the combat; with no Reaction Point left, a warning and no extra dice. The chat card has no 2dE button any more.
Rev: 2

## The HUD

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

### tumble-pass · v0.0.510 · Tumble: the Check against the targeted creatures' DC, then the movement past enemies
Do: On Kaela's turn, target Goblin Sneak and use Tumble (1 AP). In the chat card, click Instinct Check, then the card's Move button, and drag her through the Goblin's square. Then target both Goblin Sneak and Orc Warrior, use Tumble (2 AP: Evade 2) and click Appeal Check; pass between them corner to corner.
Expect: The roll dialog says "vs Goblin Sneak" and its DC is the Goblin's Instinct DC (11 + its Instinct), not 13. With two targets: the higher of their Appeal DCs and 1 Bane. With no target: DC 13. The movement passes the enemies; she can't end in an enemy's square.
Rev: 3

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
