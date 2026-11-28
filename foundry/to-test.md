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

### ae-start · v0.0.539 · Rev 3 · The Strike slashes on every plate of the combat strip
Do: Put Aveline, Kaela, an Orc Warrior and a Goblin Sneak in a combat and start it. During the orc's turn, look at the combat strip at the top; have Kaela make a Strike as a Reaction (Snap Shot) if she can.
Expect: Every plate of the combat strip shows its AP squares and its 3 Strike slashes, the acting one's and the waiting ones' (theirs a little smaller); a Strike Kaela makes in the orc's turn fills one of hers. Everyone started with its AP (the goblin 3); no Reaction Point diamond.
Rev: 3

## The roll dialog

## Chat cards

### rv-cards · v0.0.539 · Rev 3 · Quick Shots' Critical, Lay On Hands, Consecrated Ground
Do: Sylwen uses Quick Shots on the Orc Warrior and gets a Critical (the dialog's Tier buttons or its Flat); then Aveline uses Lay On Hands (1 AP) on Kaela; then Durgan (level 2) places Consecrated Ground and Kaela starts her turn in it.
Expect: The Critical's question in the HUD's Situational tab reads "Apply its Critical row? You make a [Projectile, Ranged] Basic Attack (1A)" with a short Apply button and Don't apply; Apply opens a free Basic Attack (no AP) a moment after Quick Shots' own card. Quick Shots' Tier 1 is [V] 1d6! + Mod and no Evade follows. Lay On Hands' Setup frame says Continue and gives Guard 4 + Aveline's Power Modifier; Consecrated Ground gives Kaela Guard 2 + Durgan's Power Modifier.
Rev: 3

## Conditions and their Tiers

## Movement

## Reactions and Judge

### rx-slipaway · v0.0.539 · Rev 3 · Slip Away's Interact waits in the Situational tab
Do: Kaela has Slip Away and a Dagger as well as her bow, and her HUD is on the Hands tab. The Orc Warrior ends its turn adjacent to her; use Slip Away. Then do it again on another round and press Cancel on the granted use.
Expect: Slip Away is offered once the orc's turn has ended; Use starts her Evade 1 by itself. The HUD does not switch tabs for the granted Interact: the Situational tab shows its count, and clicking the tab shows "Interact" (0 AP, from Slip Away); using it costs no AP. Cancel skips it.
Rev: 3

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
