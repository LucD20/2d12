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

### flank-opposite · v0.0.506 · Flanking: a flat 1 Field Boon from opposite sides, and the cancel
Do: Put Aveline and Durgan on opposite sides of Orc Warrior (Durgan diagonally across from Aveline counts too) and open Aveline's Basic Attack roll dialog against it. Then move Durgan beside Aveline (both on the Orc's same side) and open it again. Then put Goblin Sneak next to Aveline, Durgan back across, and open it a third time.
Expect: First: a "Flanking" chip, 1 Field Boon (never "Flanking 2", whoever else stands around). Second: no Boon; its n/a reason says Durgan threatens the Orc "but not from its opposite side". Third: no Boon; the reason names Goblin Sneak (the Orc's side) threatening Aveline.

## Chat cards

## Conditions and their Tiers

## Movement

### block-enemy · v0.0.506 · An enemy's space blocks; an ally's is Difficult Terrain; the diagonal between two enemies blocks
Do: In combat on Sylwen's turn, drag her through Orc Warrior's square; then diagonally between Orc Warrior and Goblin Sneak placed corner to corner; then through Kaela's square (Advance), and with Evade 2 and Evade 1 through Kaela. Look at the movement range shown while dragging.
Expect: Through the Orc: refused ("Orc Warrior's space blocks your movement ... Tumble to pass through, or go around"). The diagonal between the two enemies: refused ("You can't slip diagonally between ..."). Through Kaela: allowed, her square counts 2 on the ruler. Evade 2 through Kaela: allowed (her square costs 2); Evade 1 can't reach past her. The range area doesn't spread through enemies or between two corner-to-corner enemies.

### tumble-pass · v0.0.506 · Tumble passes enemies and the diagonal between two
Do: On Kaela's turn, use Tumble (1 AP: Advance half her Speed) and drag her through Goblin Sneak's square to the far side; use it again (2 AP: Evade 2) between Orc Warrior and Goblin Sneak corner to corner. Try to end inside the Goblin's square.
Expect: Both movements pass (the Check is by hand: its card says so); she can't end in an enemy's square. After the Tumble, a normal Advance is blocked by the enemies again.

### charge-and-down · v0.0.506 · Charge stops at allies and enemies; a Down creature is Difficult Terrain
Do: Aim Aveline's Charge at Ogre Chieftain with Durgan on the straight line, then with Goblin Sneak on it. Then bring Goblin Sneak to 0 (Down) and drag Sylwen through its square.
Expect: The Charge stops before Durgan ("an ally's or a Down creature's space is Difficult Terrain") and before the Goblin ("blocks movement"). The Down Goblin's square can be crossed by an Advance at double cost.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
