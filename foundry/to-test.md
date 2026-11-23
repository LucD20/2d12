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

### ui-inline-card-btns · v0.0.485 · Inline buttons inside card prose (no tacked-on end buttons)
Do: Open Kaela's Footwork (Hands Busy) card and Basic Actions (Charge, Reload, Crawl, Lean, Regrip, Release, Shake Off) on Aveline's sheet or chat.
Expect: Buttons sit inline inside the book description ("You [Evade 1], and before or after it you use the [Interact] or [Reload] Action (1A)") with no extra buttons tacked onto the end.

## The HUD

## Starting a combat

## The roll dialog

### ui-rolldlg-cover-notices · v0.0.485 · Clear buff & debuff Cover notices (Find the Gap, Keep Low)
Do: With Sylwen, use Spotter (Keep Low), then open an Orc Warrior's Basic Attack roll dialog targeting Sylwen both with NO Cover and WITH Low Cover. Then use Spotter (Find the Gap) on Sylwen and open Sylwen's Basic Attack targeting an Orc Warrior in Low Cover and with No Cover.
Expect: Clear solid-border buff/debuff pills appear when Cover shifts ("Keep Low (Sylwen): Low cover → Medium cover" in red; "Find the Gap: Low cover → No cover" in green) and clear dashed pills explain when it cannot shift ("Keep Low (Sylwen): no Cover to raise", "Find the Gap: no Cover to lower").

## Chat cards

### ui-chat-card-align · v0.0.485 · Single-target footer Card button alignment & full-width breakdown
Do: With Aveline (Longsword), roll Basic Attack + Damage against an Orc Warrior, Apply damage, and click "=" to open the damage breakdown ledger.
Expect: "=", "✓ Undo" (or "Apply"), and "Card" sit horizontally aligned on the same row, and the expanded "=" breakdown box spans the full width of the chat card underneath them.

## Conditions and their Tiers

### l1-paladin-auto · v0.0.485 · Aveline & Durgan L1 automations (Thwart Cut both-sides move, Brace caster square, Grabbed release)
Rev: 2
Do: With Aveline, land Thwart Cut on an Orc Warrior to apply Pressed, then move the Orc Warrior out of Reach (and in a second use, move Aveline out of Reach). With Durgan, use Hold the Line (Brace) and check Durgan's own square plus the 8 adjacent squares; then land Seizing Cut Tier 3 to Grab an Orc Warrior and let go via Release (0 AP).
Expect: Thwart Cut's Pressed ends automatically whether the NPC moves away OR Aveline moves away; Brace's fixed 1-round Difficult Terrain Zone includes Durgan's own square (full 3×3 1 Emanation); Releasing the Grabbed target ends Grabbed + Immobilized with zero console errors.

## Movement

### l1-archer-auto · v0.0.485 · Sylwen & Kaela L1 automations (Circling Shot Setup text & force Tier 3, Footwork inline buttons)
Rev: 2
Do: With Kaela, open Circling Shot targeting an Orc Warrior, click Tier 3 in the roll dialog to force Tier 3, click Roll, complete the Setup Evade 1, and inspect the chat card and post-hit Evade 1. Also use Footwork (Hands Busy).
Expect: Circling Shot preserves the forced Tier 3 across the Setup Evade 1, displays "Setup: You Evade 1." cleanly on the chat card (not "You ."), and auto-starts the Tier 3 no-farther Evade 1; Footwork (Hands Busy) shows inline Evade 1, Interact, and Reload buttons inside its sentence.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows


