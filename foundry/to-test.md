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

### ui-hud-conds-popover · v0.0.482 · HUD condition polarity pills and +N overflow popover
Rev: 2
Do: On Aveline, apply at least 4 active conditions/effects (mix buffs like Empowered / Shield of Faith and debuffs like Prone, Daunted, Hindered), then select Aveline's token and click the +N button on the HUD conditions row.
Expect: Debuffs (including Daunted) and buffs render cleanly with full top and bottom borders (no clipped outline), and past 3 items a +N ▾ button opens a popover grouped into Debuffs, Buffs, and Other.

## Starting a combat

## The roll dialog

## Chat cards

### ui-chat-down-foot · v0.0.483 · Chat card Down chip and single-row footer with Card button
Do: With Aveline (Longsword), apply damage to an Orc Warrior that puts it Down (both Bloodied and Strained, or total damage at/past its Health Pool), and also apply damage to an Orc Warrior with Resist Slash 2.
Expect: A Down creature shows a single "Down" badge instead of "Bloodied Strained". The post-Apply Resist tag stays compact ("Slash −2" with shield icon) on the same line as "Took", and the "Card" button stays on the right of the footer instead of wrapping underneath.

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows


