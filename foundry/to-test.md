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

### steady-draw-de · v0.0.509 · Steady Draw: 2dE for the Reaction Point, once an encounter
Do: In a combat, on Kaela's turn, use Basic Attack with her bow against Goblin Sneak until one gets a Tier 2 or 3. On that chat card, click the Special line's "2dE more" button. Click it again. Next round (Escalation 2, or higher), try it on a Tier 1 card, then on another Tier 2 card.
Expect: The Basic Attack card (sheet, HUD, chat) has a Special line: "Once an encounter, when this Action gets a Tier 2 or 3, you can spend your Reaction Point to deal 2dE more to the target." The first click spends her Reaction Point and posts a damage card to the Goblin: 2d4 at Escalation 1 or 2 (2d6 at 3, 2d8 at 4...), the bow's subtype, no exploding dice. The second click is refused (already used this encounter); on a Tier 1 card: "Only on a Tier 2 or 3"; with no Reaction Point left: refused. In a new combat it works again.

## The HUD

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

### tumble-pass · v0.0.508 · Tumble posts its card: the Check, then the movement past enemies
Do: On Kaela's turn, use Tumble (1 AP: Advance half her Speed). In the chat card, click Appeal Check or Instinct Check, then the card's Move button, and drag her through Goblin Sneak's square to the far side. Use it again (2 AP: Evade 2) between Orc Warrior and Goblin Sneak corner to corner. Try to end inside the Goblin's square.
Expect: Each use posts Tumble's card to the chat (it no longer starts the movement by itself), with two Check buttons (Appeal Check, Instinct Check; set the DC and the Banes in the roll dialog by hand) and a Move button. The movement passes the enemies; she can't end in an enemy's square. After the Tumble, a normal Advance is blocked by the enemies again.
Rev: 2

### aid-two-checks · v0.0.508 · Aid's Check: an Appeal and an Instinct button
Do: Make Sylwen Daunted, then on Kaela's turn use Aid on Sylwen and look at the card in the chat.
Expect: The card's line reads "an Appeal Check or Instinct Check" with a button on each (was a button only on Instinct); each rolls that Attribute.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
