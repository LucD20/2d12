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

### ui-strip-polish · v0.0.486 · Combat Strip & Turn Dock polish
Do: Start combat with Aveline, Durgan, Sylwen, Kaela, Orc Warrior, and Ogre Chieftain; inspect the top Combat Strip and Turn Dock during a turn, with Reactions pending, and after an initiative swap (Frozen).
Expect: Combat Strip cards clearly distinguish Acting, waiting-for-Reaction, Frozen, and disposition bands, AP/Reaction/Strike pips stay crisp even at high AP/Reaction counts, and the Turn Dock matches cleanly.

## The roll dialog

### ui-check-save-dlg · v0.0.486 · STYLE-3 Save, Check, and Shake Off Roll Dialog
Do: On Aveline's sheet, click an Attribute for a Check, Shift-click for a Save, roll a Save from a Save Action card (e.g., Grave Wisp's Dread Whisper on Aveline), and roll Shake Off on a Lingering creature.
Expect: All Checks, Saves, and Shake Off open the new compact STYLE-3 Roll Dialog (not the old Foundry DialogV2) with the 3-Tier ladder, 5 Boons/Banes cliff, Boons/Banes/Flat controls, and Tier preview where applicable.

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

### ui-overlays-3d · v0.0.486 · Weapon Range Rings, Z-ordered overlays, and 3D Cover / Area Height tools
Do: Select Sylwen (Longbow) or Aveline (Longsword) and toggle the new Range & Reach overlay in Token Controls alongside Line of Effect and Show Flanking; also open the Cover Height and 3D Area Height tools from Token Controls.
Expect: Range & Reach draws Normal/Far/Max weapon bands and Melee Threat Reach below tokens without overlapping LoE plates; overlays layer cleanly in Z-order; Cover Height and 3D Area Height tools open and calculate linked 3D Burst/Emanation/Line geometry cleanly.

## Ending an encounter and resting

## The Encounter Log

## Windows

### ui-pick-util-wins · v0.0.486 · Compact Pick/Confirm dialogs and utility windows
Do: Trigger a Release/hands prompt on Durgan (e.g., two-handed weapon in one hand, or Release after Seizing Cut Grab), click Collapse/Breather/Heal on Aveline, and open Escalation / Damage Report windows.
Expect: Pick and confirm dialogs use the new compact card layout with clear subtitles/tags (including "Ends Grabbed · frees your hand" / "0 AP" for Grabbed targets) and warning tones where appropriate; utility windows render cleanly in both light and dark themes.


