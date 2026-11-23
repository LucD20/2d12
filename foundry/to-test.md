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

### b3-mod-order · v0.0.480 · Paladin and Archer choose their Modifier order
Do: Update sheets from the compendium when prompted, then open Aveline's and Sylwen's Build tab and Class details / Swap choices.
Expect: Both Paladin and Archer allow choosing Weapon +2 / Power +1 or Power +2 / Weapon +1. Aveline and Durgan carry Sworn Blade and Drawing Light at level 1; Sylwen and Kaela carry Steady Draw and Harrying Shot at level 1.

### b3-basic-grid · v0.0.480 · The 24 Basic Actions in the sheet grid and HUD
Do: Open Aveline's Actions tab (Basic section) and select Aveline's token to open the HUD Basic tab.
Expect: Basic Attack replaces Weapon Attack (Attack); Tumble is in Movement; Demoralize and Feint are in Control; Heal and Aid are in Utility. Trip, Shove, and Haul no longer show the Strike trait. Everything fits cleanly without clipping.

## The HUD

## Starting a combat

## The roll dialog

### b3-basic-attack-d · v0.0.480 · Basic Attack [Mod] on Tier 1 and 1[W] + 1[D] + [Mod] on Tier 3
Do: With Aveline (Longsword) targeting the Orc Warrior, open Basic Attack. Check the card preview, force a Tier 1, then a Tier 3, and roll damage.
Expect: Tier 1 deals [V] [Mod] Slash, Tier 2 deals [V] 1[W] + [Mod], Tier 3 deals [V] 1[W] + 1[D] + [Mod] (two exploding d6s + 9 + Mod). On Aveline's Basic Attack card, Sworn Blade's Strained line shows under Tier 3.

### b3-fists-explode · v0.0.480 · Fists fixed tiers and exploding 1d6!
Do: With Durgan (free hand) targeting the Orc Warrior, open Fists. Check all three tiers and force a Tier 3 damage roll.
Expect: Tiers show [V] 1 Bl / [V] 2 + [Mod] Bl / [V] 1d6! + [Mod] Bl. Tier 3 rolls an exploding 1d6! + Mod Blunt, and Durgan's Fists weapon item shows 0 / 2 / 1d6!.

## Chat cards

### b3-sworn-blade · v0.0.480 · Sworn Blade slides a Strained target on Basic Attack
Do: Make the Orc Warrior Strained, then have Aveline use Basic Attack against it and apply damage.
Expect: When damage lands on the Strained Orc Warrior, Sworn Blade's Strained line triggers and offers Slide the target 1 (can be declined).

### b3-steady-draw · v0.0.480 · Steady Draw adds +1[D] on Tier 3 against a pre-Strained target
Do: Make the Orc Warrior Strained before rolling, then have Sylwen (Hunting Bow) target it with Basic Attack. Check the card and roll dialog notice, force Tier 3, and roll damage. Repeat against a non-Strained Orc Warrior (and on Tier 2).
Expect: Sylwen's Basic Attack card shows Steady Draw's Strained line above Attack, the roll dialog shows the Steady Draw notice, and Tier 3 adds an extra 1d4! labeled Steady Draw. No extra [D] is added on Tier 2 or against a non-Strained target.

### b3-power-basics · v0.0.480 · Drawing Light and Harrying Shot (Power Basic attacks & Critical 1d10!)
Do: Have Aveline use Drawing Light against a Bloodied Orc Warrior (force Tier 3 Critical) and have Sylwen use Harrying Shot against a Bloodied Orc Warrior (force Tier 2, then Tier 3 Critical).
Expect: Both deal Resolve damage with no [Mod] added and offer the Basic attack 1d10! Critical pick on Doubles + Tier 3. Drawing Light's Bloodied line appears on Tier 2 and Tier 3; Harrying Shot's Bloodied Daunted line triggers only on Tier 3 (not Tier 2).

### b3-new-basics · v0.0.480 · Aid, Demoralize, Feint, Heal, Tumble, Trip, Shove, Kneel
Do: Have Sylwen use Aid on Kaela, Demoralize on the Orc Warrior (Tier 3), Feint on the Orc Warrior (Tier 2 and Tier 3), and Heal on a hurt Aveline (Tier 2). Have Durgan use Trip (1 AP and 2 AP) and Shove (1 AP and 2 AP) on the Orc Warrior, and Aveline use Commandment (Kneel) on the Orc Warrior (force Tier 1 and Tier 2 Save).
Expect: Aid shows a clickable Quickened 1 chip; Demoralize rolls Appeal vs. Appeal DC and applies Vulnerable 1 (1 round) and Daunted (EoT) on Tier 3; Feint differentiates Tier 2 (2 Boons), Tier 3 (Favored), and Critical (no Reactions); Heal rolls Appeal or Mind vs. DC 13 with Rally buttons; Trip and Shove each have 2 Versions with no Strike trait; Kneel applies Prone only on a Tier 1 Save and Hindered (EoT) on a Tier 2 Save.

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows


