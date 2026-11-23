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

### b3-basic-as-action · v0.0.481 · Basic Attack as a normal At-will Action on PCs
Do: Open Aveline's Actions tab and select Aveline's token to open the HUD.
Expect: Basic Attack sits in the main At-will Actions section on Aveline's sheet (beside Drawing Light) and in the main Actions tab of the HUD, not in the Basic Actions grid/tab. Fists stays in Basic Actions.

## The HUD

## Starting a combat

## The roll dialog

### b3-basic-t1-explode · v0.0.481 · Basic Attack Tier 1 1d4! and ! on weapon dice in roll dialog
Do: With Aveline (Longsword) targeting the Orc Warrior, open Basic Attack. Check the roll dialog Tiers, force a Tier 1, and roll damage.
Expect: Roll dialog Tiers show ! on all weapon dice (1d4! Slash on Tier 1, 1d4!+6 + 2 Slash on Tier 2, 1d6!+9 + 1d6! + 2 Slash on Tier 3). Tier 1 rolls an exploding 1d4! Slash.

## Chat cards

### b3-sworn-blade · v0.0.480 · Sworn Blade slides a Strained target on Basic Attack
Rev: 2
Do: Make the Orc Warrior Strained, then have Aveline use Basic Attack against it (try Tier 1 as well as Tier 2/3) and apply damage. Also test Aveline's Drawing Light (Tier 2 or 3) against a Bloodied Orc Warrior.
Expect: Both chat cards show their Strained/Bloodied line on the attack card itself. Sworn Blade triggers on any landed Tier (including Tier 1) and offers Slide 1. Drawing Light against a Bloodied target prompts Slide vs. Pull (or Esc to skip).

### b3-steady-draw · v0.0.480 · Steady Draw adds +1[D] on Tier 3 against a pre-Strained target
Rev: 2
Do: Make the Orc Warrior Strained before rolling, then have Sylwen (Hunting Bow) target it with Basic Attack. Check the roll dialog notice and Tier 3 preview, force Tier 3, roll damage, and open both the dice breakdown and the = ledger. Repeat against a non-Strained Orc Warrior (and on Tier 2).
Expect: The Steady Draw notice in the roll dialog is crisp/active (not faded) and Tier 3 preview includes the extra 1d4! Pierce. The attack card lists Steady Draw under Applied, the damage roll includes the extra 1d4! labeled Steady Draw in both the dice breakdown and the = ledger (with no bogus Flat -1 on exploded dice), and no extra [D] is added on Tier 2 or against a non-Strained target.

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows


