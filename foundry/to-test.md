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

### hud-hp-boxes · v0.0.505 · The Token HUD's two plain boxes, small: Vigor (red outline) and Resolve (blue outline)
Do: Right-click Orc Warrior's token. In the red-outlined box type -5 and Enter; then +2; in the blue-outlined box type 3. Then click the Token HUD's other buttons (the conditions, the target, the visibility).
Expect: Two small plain boxes (about Foundry's own Health box's height, a few digits wide) with only the number, side by side and centered under the token: red outline for Vigor, blue for Resolve. -5 deals 5 to Vigor, +2 heals 2, a plain number sets what is left (Resolve 3). Every other button of the Token HUD can be clicked. No "Invalid Asset" error in the console on load.
Rev: 6

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
