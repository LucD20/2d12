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

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

### ui-end-warn-copy · v0.0.488 · Dark red warning button & End Combat Copy Log
Do: With Durgan Dying or Shattered, try to end combat (opens "End the encounter?" warning), then actually end a combat with Aveline, Durgan, and Goblin Sneak (opens "The encounter ends").
Expect: "End it anyway" is deep crimson with crisp light text (not pastel pink); "The encounter ends" includes a "Copy Encounter Log (archived)" button that copies the report without closing the dialog, and the finished fight stays accessible in Encounter Log's Archive dropdown.

## The Encounter Log

### enclog-v488 · v0.0.488 · Upgraded Encounter Log (Health Pressure %, Unified IDs, Archive)
Do: Run a round or two of combat with Aveline, Durgan, Sylwen, Kaela against Ogre Chieftain, Orc Warrior, and two Goblin Sneaks (including a Shield of Faith or Judge reduction, a Critical or Bloodied hit, a passed Reaction, and an Undo on a damage card), then open Encounter Log from 2d12 Tools.
Expect: Summary & Health % tab shows Raw, Reduced, Net ([V]/[R]), Max HP, Heal (RP), Current, Taken %, Attempted %, Party Total with G9 difficulty band, Prevented credit for Durgan/Aveline, and identical Goblin Sneak 1/2 numbering across Encounter Log and Damage Report; Undo does not log as a Heal; Copy for Analysis copies the full Markdown report cleanly.

## Windows

### ui-clock-align · v0.0.488 · Image-1 World Clock, Above-Chat Time Bar & button centering
Do: Open World Clock from 2d12 Tools and check the quick time bar above chat (with Aveline on the scene); also glance at button/icon centering in Initiative, Pick dialogs, and 2d12 Tools.
Expect: World Clock shows stacked uppercase date over bold gold HH:MM:SS with centered "+ 1 Round / + 1 Min / + 10 Min" and labeled Dawn/Noon/Dusk/Night buttons; the above-chat time bar uses dark STYLE-3 buttons (no white buttons) with stacked day/time readout; buttons and icons across dialogs sit dead-center.

