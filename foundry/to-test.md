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

### ae-start · v0.0.537 · Rev 2 · Every creature starts the encounter with its AP
Do: Put Aveline, Kaela, an Orc Warrior and a Goblin Sneak in a combat and start it. During the orc's turn, look at Aveline's and Kaela's portraits in the HUD's party strip and at the combat strip at the top.
Expect: Everyone starts with its AP (4; the goblin 3), no Reaction Point diamond anywhere. The Strike slashes (3) show for every creature on both strips, its turn or not; a Strike Kaela makes as a Reaction in the orc's turn takes one.
Rev: 2

## The roll dialog

## Chat cards

### rv-cards · v0.0.536 · Quick Shots, Lay On Hands, Consecrated Ground (the review)
Do: Sylwen uses Quick Shots on the Orc Warrior (force a Tier 1 and a Critical with the dialog's Flat if needed); Aveline uses Lay On Hands (1 AP) on Kaela; Durgan (level 2) places Consecrated Ground and Kaela starts her turn in it.
Expect: Quick Shots' Tier 1 deals [V] 1d6! + Mod, there is no Evade after it, and on a Critical a "Basic Attack" button makes one free Basic Attack (no AP spent). Lay On Hands gives Guard 4 + Aveline's Power Modifier. Consecrated Ground gives Kaela Guard 2 + Durgan's Power Modifier.

## Conditions and their Tiers

### fd-save · v0.0.537 · Rev 2 · A Doomed caster gives Favored Saves
Do: The Orc Warrior uses War Howl with Aveline and Sylwen in the area: open its roll dialog and add 2 Banes and 1 Boon with the buttons, then use it. Then use War Howl again with Doomed on.
Expect: The Save Action's dialog has Boon, Bane, Favored, Doomed and Empowered buttons and Boons and Banes rows. The first time, each target's Save has "Caster's Banes" +1 (2 Banes and 1 Boon leave 1). The second, each target's Save is Favored ("Caster Doomed").
Rev: 2

## Movement

## Reactions and Judge

### rx-slipaway · v0.0.537 · Rev 2 · Slip Away and Backhand: an enemy ends its turn adjacent
Do: Kaela has Slip Away and a Dagger as well as her bow. The Orc Warrior ends its turn adjacent to her; use Slip Away. Then do it again on another round and press Cancel on the granted use.
Expect: Once the orc's turn has ended, Slip Away is offered; Use starts her Evade 1 by itself, and her HUD shows a granted "Interact" (0 AP, from Slip Away) to swap weapons; using it costs no AP. Cancel skips it and removes it. Backhand (Durgan ending his turn next to the Ogre Chieftain) still works as before.
Rev: 2

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
