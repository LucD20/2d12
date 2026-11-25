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

### hide-by-hand · v0.0.517 · The HUD's Hiding entry: switch, remove, add
Do: Make Kaela Unsensed to Goblin Sneak and Hidden to Orc Warrior with Hide, select her and open the HUD's Situational tab. Click the Orc's "Hidden"; click the Goblin's ✕. Target Goblin Archer (or the Goblin again) and click Add's "Hidden"; then target two creatures and Add "Unsensed". Next turn, without hiding from anyone, select Kaela.
Expect: A "Hiding" entry (from Hide · 2) lists the Goblin (Unsensed) and the Orc (Hidden), each with a mark, its name, the state as a button and a ✕. Clicking "Hidden" switches the Orc to Unsensed; ✕ removes the Goblin; Add sets the targeted creatures ("Add against 2 creatures" for two); each change posts a short chat line ending "(set by hand)", and the Hide lines on the map follow. The entry never pulses. When she hides from no one and didn't use Hide or Sneak this turn, there is no entry.

### hide-lines-only · v0.0.516 · Hide: no marks on the token, the lines on select or hover
Do: Make Kaela Unsensed to Goblin Sneak and Hidden to Orc Warrior with Hide. Look at her token with nothing selected, then select her.
Expect: No small rings or discs on her token. Selected (or hovered): the dotted and dashed lines with their plates, gone after 5 seconds.

### pointout-pick · v0.0.516 · Point Out's Tier 2: pick the ally on the map
Do: With Kaela hiding from Goblin Sneak, and two of Goblin Sneak's allies within 10 squares (or, from the PCs' side: Sylwen Points Out a hiding Goblin with Aveline and Durgan near her), get a Tier 2 on Point Out. Read the card's Tier 3 line too.
Expect: The pick bar asks which ally, and the allies' tokens blink on the map: clicking one picks it. The Tier 3 line reads as a whole sentence (every ally within 10 squares perceives the target 1 step better), as do Hide's and Seek's Tier 3.

## The HUD

### charge-reselect · v0.0.516 · Charge by targeting: clicks select as usual
Do: On Durgan's turn, start a Charge. Target Orc Warrior (T, or Foundry's targeting). Then target Goblin Sneak instead. Click an empty part of the map, then click Durgan to select him again, and click another token. Click the Charge button. Another time, target the Orc before using Charge.
Expect: Targeting a creature makes it the Charge's enemy (the line goes to it); targeting another changes it. Clicks select and deselect tokens as usual and never launch the Charge; the bar comes back into Durgan's HUD when he is selected. Only the Charge button (or Enter) charges. With the Orc already targeted, the Charge starts aimed at it.
Rev: 3

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
