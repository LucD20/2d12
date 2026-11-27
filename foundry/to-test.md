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

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

### pt-marks · v0.0.534 · Rev 2 · "Marked by" on the marked creature, and "Marks · by you" on the one who placed them
Do: Aveline Judges the Orc Warrior and Durgan Taunts it (his Taunt, or Taunted by Durgan from the Token HUD). Select the Orc Warrior and open the HUD's Situational tab; click the ✕ on one row (Judged or Taunted). Then put both back, select Aveline (or Durgan) and click the ✕ on the orc's row in "Marks · by you"; then select the Orc Warrior again. Last, click "Apply effect" on Judge's card with the orc targeted, then with nothing targeted.
Expect: The Orc Warrior's Situational tab shows "Marked by" (others · 2): "Aveline · Judged" and "Durgan · Taunted", each with a ✕ at the row's right end; it folds on its title like Hiding, on its own, and its buttons never move. Its ✕ removes that one and posts the same short system line as the "by you" side ("Orc Warrior is no longer Judged by Aveline (removed by hand)" / "... no longer Taunted (from Durgan; removed by hand)"); the mark also leaves Aveline's (or Durgan's) "Marks · by you" entry, and the Judged ring goes. The other way round: a ✕ in Aveline's (or Durgan's) "by you" entry removes the row from the orc's "Marked by". A creature that both placed and carries marks shows both entries, "Marks · by you" first. A player who doesn't own the creature that placed the mark can still remove it from the creature they own (the GM's client does it). Apply effect marks the targeted orc again; with nothing targeted it marks the card's own target.
Rev: 2

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
