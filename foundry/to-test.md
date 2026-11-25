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

### hide-basic · v0.0.513 · Hide: Unsensed or Hidden to each targeted creature
Do: In a combat, put Kaela behind a wall corner so Goblin Sneak can't see her, and Orc Warrior can see her over a crate or wall that gives her High Cover. Target both and use Hide (Utility in the HUD's Basic tab).
Expect: One roll against each one's Instinct DC (the roll dialog shows both). On a Tier 2 or 3, a chat line says Kaela is Unsensed to the Goblin and Hidden to the Orc. The Goblin's roll dialog against her then says it can't target her (Unsensed); the Orc's is Doomed (Hidden), and Kaela is Favored against the Orc.

### hide-ends · v0.0.513 · Hide ends: an Action without [Subtle], or Sight without High Cover
Do: With Kaela Hidden to Orc Warrior (above), move the Orc to where it sees her with no cover. Hide again, then have Kaela use Basic Attack against Goblin Sneak. Hide again, then use Lean.
Expect: When the Orc sees her without High Cover, a chat line says Hide ends against it. After the Basic Attack, a line says Kaela's Hide ends (Basic Attack isn't [Subtle]). After Lean, Hide holds (Lean is [Subtle]).

### sneak-move · v0.0.513 · Sneak: the movement keeps Hide, and triggers no Reaction
Do: On Goblin Sneak's turn, behind cover where Sylwen can't see it, use Hide (target Sylwen) until it is Unsensed or Hidden to her. Next turn, use Sneak and move it into a square adjacent to Sylwen (her Snap Shot answers an enemy entering a square next to her), ending in the open. End its turn.
Expect: Sneak is an Advance of half its Speed. Sylwen is offered no Snap Shot while the Goblin is Hidden or Unsensed to her. If she sees it during the movement while it was Unsensed, it becomes Hidden to her (a chat line). At the end of its turn, in her sight with no High Cover, Hide ends against her.

### seek-pointout · v0.0.513 · Seek finds, Point Out shows
Do: With Kaela Unsensed to Goblin Sneak and Hidden to Orc Warrior from Hide, on the Goblin's turn use Seek (1 AP, 5 squares; or 2 AP, 10 squares), without targeting anyone. On the Orc's turn, use Point Out on Kaela (the Orc must perceive her better than the Goblin does).
Expect: Seek targets by itself the creatures Hidden or Unsensed to the Goblin within its range (Kaela), with no Doomed roll for Senses; on a Tier 2 or 3 the Goblin perceives her 1 step better (Unsensed to Hidden). With nobody hiding in range it warns and spends nothing. Point Out on a Tier 2 asks which ally within 10 squares (or picks the only one) and improves its perception of Kaela 1 step; on a Tier 3, every ally within 10 squares.

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
