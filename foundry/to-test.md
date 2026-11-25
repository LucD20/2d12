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

### slip-away-chain · v0.0.512 · Slip Away: the Evade 1, then the Advance 2, by themselves
Do: Kaela has Slip Away (her Hallmark Reaction). On Orc Warrior's turn, move it toward her until her Slip Away is offered; Use it. Move her 1 square (or click End movement), then move her again. Another time, use Slip Away and, during its Evade, use another Action instead.
Expect: Use starts the Evade 1 at once (no button to click). When it ends (its square used, or End movement), the Advance 2 starts by itself. If she uses another Action first, the Advance 2 doesn't come.

### charge-situational · v0.0.512 · Charge: its Basic Attack (1A) waits in the HUD's Situational tab
Do: On Aveline's turn, Charge Orc Warrior (at least 3 squares away) and let the Charge end within Reach. Look at the HUD's Situational tab, click "Basic Attack (1A)" there. Another time, use the Basic Attack from the Charge's chat card instead.
Expect: After the movement, the Situational tab shows "Charge" with a "Basic Attack (1A)" button; it rolls the Basic Attack with the Charge's Boon, free, and the entry goes. Used from the card, the entry goes too. A Charge that ends out of Reach shows nothing there (its card says it is disrupted).

### charge-reselect · v0.0.512 · Charge: deselecting and reselecting the token keeps the Charge in the HUD
Do: On Durgan's turn, start a Charge (the bar asks to pick the enemy), click an empty part of the map to deselect him, then select him again (and once select Aveline, then Durgan).
Expect: The Charge bar comes back into Durgan's HUD (Situational) and still works: pick the enemy, Charge. Nothing is lost or stuck.

## Starting a combat

### enclog-new-lines · v0.0.511 · The Encounter Log: Flanking, blocked moves, Checks, and what cards took
Do: In a combat: flank Orc Warrior with Aveline and Durgan and make Aveline's Basic Attack; try to Advance Kaela through Goblin Sneak's square (refused), then Tumble past it, clicking its Instinct Check with the Goblin targeted; let the Orc hit Aveline while Judged by her (and once while she has Guard from Durgan's Lay On Hands). End the combat and use Copy for Analysis.
Expect: The log shows "Basic Attack vs Orc Warrior T2 (flanked)", "Kaela's Advance is blocked by Goblin Sneak" and "Kaela: Instinct Check N vs DC N (Goblin Sneak) T2". The copied report has a table "Enemy Damage: What Reached the Party, and What Cards Took" (the Orc's raw damage, what reductions took, the class cards' share of it from Judge and the Lay On Hands Guard, and "Would reach a plain PC"), and the watchlist lists Flanking Boons by side, moves refused by blocking and the Checks.

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
