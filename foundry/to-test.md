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

### ar-arms · v0.0.541 · The Arms Modifier
Do: Open Durgan's sheet and the HUD; Durgan uses a Basic Attack on the Orc Warrior; the Ogre Chieftain uses Crushing Grip and Hurled Goblin (a Goblin Sneak within its Reach) on Kaela.
Expect: The sheet, the HUD and the class window say "Arms" (Modifier, DC) where they said "Weapon"; the Basic Attack's card reads "Arms vs. Armor Defense" and its traits "Arms · Strike · Weapon"; the roll adds the Arms Modifier. Crushing Grip and Hurled Goblin are [Arms] with no Weapon, and Hurled Goblin is no longer refused for the ogre's missing weapon (Doomed only if the ogre is Engaged, a [Ranged] Action).

### ar-cards · v0.0.541 · The Charge, Snap Shot's Setup, the extra die without AP
Do: Durgan Charges the Grave Wisp, then uses Drawing Light on it. Sylwen has Snap Shot: the Orc Warrior steps next to her. Aveline, with 2 AP left, opens Smite (2 AP).
Expect: Drawing Light after the Charge is not Doomed for a repeat (the Charge's Basic Attack no longer counts); it is still Doomed if Durgan stands next to an enemy ([Ranged] while Engaged). Snap Shot opens its Setup (Evade 1, optional, the bottom bar) before the shot. Aveline's chip "1 AP: 1 more Smite die" is shown off with "No AP left for it" and can't be ticked.

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

### pt12-bugs · v0.0.541 · Playtest 12's bugs: Rebuke's target, the first AP, Dying Flare, Difficult Terrain
Do: In a new world, start a combat with the four pregens and the four creatures. Aveline (Rebuke) stands next to the Grave Wisp and selects her own token; the wisp moves away (and dies to the Rebuke if its Health allows). Then Kaela Advances through Aveline's square and a dark square she can't see in.
Expect: The first creature of round 1 has its AP (4; a Minion 3). Rebuke's [R] 1d6! Holy goes to the wisp, not to Aveline. When the wisp's damage reaches its Health Pool, Dying Flare is offered (0R). Kaela's Advance charges what the ruler shows (each Difficult Terrain square 1 more). At the end of round 1, the last creature regains its AP (its Turn Log: "AP regained"), and round 2's first turn has them.

### rx-slipaway · v0.0.540 · Rev 4 · Slip Away's Interact waits in the Situational tab
Do: Kaela has Slip Away and a Dagger as well as her bow. The Orc Warrior ends its turn adjacent to her; use Slip Away. Then click the Situational tab and the granted Interact. On another round, use Slip Away again and press Cancel on the granted use.
Expect: Use makes only her Evade 1: no Interact window opens. The Situational tab counts the granted Interact (0 AP, from Slip Away), and the Interact window opens only when she clicks it there; it costs no AP. Cancel skips it.
Rev: 4

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
