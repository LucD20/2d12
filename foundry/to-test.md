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

### ae-start · v0.0.535 · Every creature starts the encounter with its AP
Do: Put Aveline, Kaela, an Orc Warrior and a Goblin Sneak in a combat, roll Initiative and start it. Before Aveline's first turn, look at her HUD and the tracker.
Expect: Everyone has AP before their first turn: Aveline, Kaela and the orc 4, the goblin 3 (a Minion). No diamond (Reaction Point) shows on the HUD, the tracker or the sheet: there is no Reaction Point any more.

### ae-regain · v0.0.535 · The AP are regained at the end of the turn
Do: On Aveline's turn, spend 1 AP (a Basic Attack on the Orc Warrior) and end the turn. Watch her AP in the Turn Log and the HUD, then during the orc's turn.
Expect: When her turn ends, the Turn Log shows "AP regained +N" and she is back to 4 (the AP left are lost, never more than 4). Her next turn starts with those 4 AP: the start gives nothing more. No Guard from unspent AP appears anywhere (the Turn Breakdown has no "unused AP" row).

### ae-zero · v0.0.535 · A turn that starts with 0 AP still starts and ends
Do: With Aveline, set her AP to 0 in the tracker during the orc's turn (as if she had spent them reacting), then let her turn come and end it.
Expect: Her turn starts (its start effects happen) with 0 AP, and at its end she regains 4.

## The roll dialog

### ae-doomed · v0.0.535 · A repeated At-will Strike is Doomed
Do: On Kaela's turn, make a Basic Attack against the Orc Warrior, then a second one, then open a third and look at the roll dialog. On the Ogre Chieftain's turn, use Crushing Grip then Roar.
Expect: The second and third show the chip "2x At-will Strike (Doomed)" / "3x ..." and roll 3d12, keeping the two lowest; no 1 or 2 Banes any more. The ogre's second Basic attack (Roar after Crushing Grip) is Doomed too (they share one count). The sheet's hint reads "Basic attack: next Doomed".

### ae-smite · v0.0.535 · Smite's extra die and Steady Draw's Special cost 1 AP
Do: Aveline uses Smite with the chip "1 AP: 1 more Smite die" on; Sylwen gets a Tier 2 with a Basic Attack with the chip "1 AP: 2dE more on a Tier 2 or 3" on.
Expect: Each spends 1 AP of the turn (the Turn Log shows it) and adds its die or dice; with no AP left, a warning says so and nothing is added.

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

### rx-shield · v0.0.535 · Shield of Faith: the Judged creature's Strike on an ally, half of it
Do: Aveline Judges the Orc Warrior. On the orc's turn, it hits Kaela (within 5 squares of Aveline) with its Hamstringing Axe. Then, on the Goblin Sneak's turn, the goblin hits Kaela with Shiv.
Expect: The orc's Strike on Kaela offers Shield of Faith in the Reactions message (the damage waits). Use: Kaela takes half of it, rounded up (a line says "takes half ... turned away"), the orc is Taunted by Aveline (1 round), and Aveline pays 1 AP of her next turn. A Strike from a creature Aveline did not Judge (the goblin) doesn't offer it.

### rx-rebuke · v0.0.535 · Rebuke: an enemy within 3 squares moves
Do: Durgan has Rebuke (or give it to Aveline). The Orc Warrior starts 5 squares from him and Advances: first 1 square (to 4), then on another Advance from 3 to 2. Then, on another turn, the orc stands up from Prone 2 squares from him.
Expect: 5 to 4 offers nothing; a step that leaves a square within 3 offers Rebuke once for that Move Action. Use: [R] 1d6! Holy damage on the orc and 1 Pressure Bane on its next Strike this turn (the effect ends with that Strike or at the end of its turn); the orc's movement goes on. Standing up offers nothing.

### rx-snapshot · v0.0.535 · Snap Shot: Evade 1, then the weaker shot, once a round
Do: Sylwen has Snap Shot. The Orc Warrior Advances to a square adjacent to her. Then, in the same round, the Goblin Sneak does the same.
Expect: The orc's step offers Snap Shot (an Interrupt: Move back stops it before the square). Its card shows "Effect: You Evade 1, then make this attack" above the roll, with the Tiers [V] [Mod] / [V] 1[W] / [V] 1[W] + [Mod] (no Hindered, no Immobilized). The goblin's step in the same round doesn't offer it (Round: used).

### rx-slipaway · v0.0.535 · Slip Away and Backhand: an enemy ends its turn adjacent
Do: Kaela has Slip Away. The Orc Warrior ends its turn adjacent to her. Later, Durgan ends his turn adjacent to the Ogre Chieftain.
Expect: Once the orc's turn has ended (its AP regained, its Lingering done), the Reactions message offers Kaela's Slip Away: Use starts her Evade 1 by itself; the weapon swap (Interact) is by hand. When Durgan's turn ends next to the ogre, Backhand is offered: its buttons deal [V] 1d6 Blunt and Push him 2. Neither is offered while the creature is still moving in its turn.

### rx-creatures · v0.0.535 · Dying Flare and Goblin Shriek
Do: Kill a Grave Wisp with Aveline's Basic Attack while Kaela stands next to it. Then Kaela kills a Goblin Sneak while the other Goblin Sneak is within 6 squares of it.
Expect: The wisp's Dying Flare is offered once its damage reaches its Health Pool (a Trigger, 0R: it costs no AP); its 1 Emanation Save hits Kaela. Goblin Shriek (renamed) is offered to the other goblin, used on Kaela (the creature that put its ally Down): its button rolls Jeer against her.

### rx-strained · v0.0.535 · Strained is Speed −2; a Bloodied enemy's space can be crossed
Do: Make Durgan Strained (Resolve damage at least his Resolve) and look at his Speed; then make the Orc Warrior Bloodied and have Kaela Advance through its square, and try to Evade through it.
Expect: Durgan's Speed is 2 lower while Strained (and no longer while Bloodied). Kaela's Advance can pass through the Bloodied orc's square as Difficult Terrain (never ending there). Known gap: Foundry may also let an Evade pass it (the book allows only an ally's space for an Evade).

### pt-marks · v0.0.534 · Rev 2 · "Marked by" on the marked creature, and "Marks · by you" on the one who placed them
Do: Aveline Judges the Orc Warrior and Durgan Taunts it (his Taunt, or Taunted by Durgan from the Token HUD). Select the Orc Warrior and open the HUD's Situational tab; click the ✕ on one row (Judged or Taunted). Then put both back, select Aveline (or Durgan) and click the ✕ on the orc's row in "Marks · by you"; then select the Orc Warrior again. Last, click "Apply effect" on Judge's card with the orc targeted, then with nothing targeted.
Expect: The Orc Warrior's Situational tab shows "Marked by" (others · 2): "Aveline · Judged" and "Durgan · Taunted", each with a ✕ at the row's right end; it folds on its title like Hiding, on its own, and its buttons never move. Its ✕ removes that one and posts the same short system line as the "by you" side ("Orc Warrior is no longer Judged by Aveline (removed by hand)" / "... no longer Taunted (from Durgan; removed by hand)"); the mark also leaves Aveline's (or Durgan's) "Marks · by you" entry, and the Judged ring goes. The other way round: a ✕ in Aveline's (or Durgan's) "by you" entry removes the row from the orc's "Marked by". A creature that both placed and carries marks shows both entries, "Marks · by you" first. A player who doesn't own the creature that placed the mark can still remove it from the creature they own (the GM's client does it). Apply effect marks the targeted orc again; with nothing targeted it marks the card's own target.
Rev: 2

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
