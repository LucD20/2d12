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

### hud-faded-ap · v0.0.477 · An Action you can't pay is faded
Do: Sylwen in combat: spend AP until 1 is left; look at Quick Shots (2 AP) in the HUD.
Expect: Quick Shots is faded (still clickable: the roll dialog warns).
Rev: 1

### strip-strike-pips · v0.0.477 · The combat strip's Strike marks use the sheet's color
Do: Kaela in combat, light and dark Foundry themes: make a Strike; compare the combat strip's Strike marks with her sheet's.
Expect: the same red in both, and the light theme's darker red on the strip too.
Rev: 1

## Starting a combat

## The roll dialog

### attribute-dc · v0.0.477 · Attribute DCs: 11 + the Attribute, named "Body DC"
Do: Durgan: Shove a Goblin Sneak; Kaela: Trip the Orc Warrior with Instinct. Open Durgan's sheet (the Defenses).
Expect: the cards read "Body vs. Body DC" and "Body or Instinct vs. the same Attribute's DC"; the DC is 11 + the target's Attribute (1 lower
than before), shown as "Body DC (Goblin Sneak): 11 + ..."; the sheet's tiles read "Body DC", "Mind DC", "Appeal DC", "Inst. DC".
Rev: 1

### doomed-counts-five · v0.0.477 · A Doomed roll counts as 5 Banes
Do: Sylwen: shoot an enemy adjacent to her (Engaged: Doomed), once as it is, once with 2 Boons added by hand in the dialog.
Expect: alone, the roll is Doomed (3d12, the two lowest) and extra Banes subtract nothing; with 2 Boons it is a normal roll at −3
(5 − 2 Banes): the dialog's dice line says so.
Rev: 1

### save-user-banes · v0.0.477 · A Save Action: the user's Banes become the targets' Boons
Do: Aveline: be Taunted by the Ogre Chieftain, then use Commandment's Kneel on an Orc Warrior (an Appeal Save).
Expect: her dialog shows her Taunted Bane; the Orc's Save row starts with 1 Boon; with no Bane on her, it starts with none.
Rev: 1

## Chat cards

### binding-light-signature · v0.0.477 · Binding Light rolls Signature
Do: Aveline: Binding Light on an Orc Warrior.
Expect: its card reads "Signature vs. Armor Defense" and the roll uses her Signature Modifier (the higher of the two).
Rev: 1

### dying-card · v0.0.477 · The Dying check uses the Action card
Do: Durgan: take him to Dying (damage past his Health) and keep fighting; roll the Dying check when it comes.
Expect: the check is drawn as the Action card (the stamp, the DC ladder), not the old block.
Rev: 1

## Conditions and their Tiers

### daunted · v0.0.477 · Frightened is Daunted, and it ends when its source goes Down
Do: Grave Wisp: Chilling Touch on Durgan (a Tier 2), and Aveline: Commandment's Challenge on the Orc Warrior (Taunted). Bring the Grave Wisp
to 0 (Down), then the Orc. In a world that had a Frightened on someone before this version, look at that creature too.
Expect: the condition is named "Daunted (Grave Wisp)" everywhere (card, HUD, sheet, the token's icon); when the Wisp goes Down a line says
Durgan's Daunted ends; when the Orc goes Down its Taunted ends the same way. An old Frightened was renamed Daunted when the world loaded.
Rev: 1

### exhausted-banes · v0.0.477 · Exhausted is Banes, not a penalty
Do: Durgan: give him Exhausted 2 (the sheet's + button), then open a Weapon Attack's roll dialog and a Body Check from the HUD.
Expect: "Exhausted 2" is a Bane chip worth 2 in the dialog (it cancels with Boons and counts toward 5); the Modifier is no longer lowered.
Rev: 1

### break-free · v0.0.477 · Break Free: a Check with Tiers, also while Prone
Do: Kaela: drop Immobilized and Prone on her, select her and use Break Free from the HUD's Situational tab (twice or more, to see a Tier 1
and a Tier 2 or 3). Then Aveline's Binding Light on a Tier 2 on her instead and Break Free again.
Expect: Break Free is allowed while Prone; it opens the roll dialog like any Action, its card reads "Check: Body or Instinct vs. Action DC",
Tier 1 "No effect", "Tier 2 or 3" frees; the DC is the Action DC (13 for the hand-dropped one, then 11 + Aveline's Signature Modifier);
a Tier 2 or 3 (Doubles below the DC count) ends Immobilized and Grabbed with a line saying the Tier; a Tier 1 says she stays Immobilized.
Rev: 3

## Movement

### lean-ends · v0.0.477 · Lean: the Action's new name, and Leaning ends when you leave your square
Do: Sylwen: use Lean (Utility), click a corner; then Evade 1. Lean again, and have the Ogre push her while her back is to a wall.
Expect: the Action reads "Lean", the condition "Leaning"; the corner nudge doesn't end it; the Evade ends it (a line says so); the push into
the wall right behind her ends it too.
Rev: 1

### push-wall-0 · v0.0.477 · Pushed into a wall right behind you: Collision, and it counts as moved
Do: Durgan stands with his back to a wall; the Ogre Chieftain's Overhead Smash on a Tier 2 (Pushed 2) aimed through the wall.
Expect: the line reads "was Pushed by Ogre Chieftain but stopped at once (0 squares; it still counts as moved)" and "hits a wall with 2
unused: 4 Vigor damage"; a Lean or Take Aim on him ends.
Rev: 1

### immobile-drag · v0.0.477 · An Immobilized creature's token can't be dragged
Do: Ogre Chieftain: Immobilized by Aveline's Binding Light; in combat, drag its token one square; then Alt-drag it (GM).
Expect: the drag is refused with "Immobilized and can't move: Break Free (1 AP) first"; the Alt-drag moves it as Forced Movement.
Rev: 1

### steel-yourself-cost · v0.0.477 · Steel Yourself costs 1 or 2 AP
Do: Durgan in combat with damage: open Steel Yourself.
Expect: its Versions are 1 AP (1 Rally Point) and 2 AP (2 Rally Points); a Round Action.
Rev: 1

## Reactions and Judge

## Areas, light and Cover

### cover-touch · v0.0.477 · A creature the center line only touches gives Low cover; a Prone or dead one gives none
Do: Sylwen shoots the Orc Warrior on an exact diagonal with a Goblin Sneak beside the line, its corner touching it (Show cover on). Then
make that Goblin Prone, then mark a Goblin on the line dead.
Expect: the corner-touching Goblin gives Low cover (1 Field Bane); Prone or dead, it gives none.
Rev: 1

### ice-pillar · v0.0.476 · Rime Strike's Ice Pillar: its square clicked on the map
Do: Aveline: Rime Strike (Power mode) on an Orc Warrior; on a Tier 2 or 3 Apply the damage; look at the bar (and the HUD's Situational tab),
then click one of the outlined squares. Try a second Rime Strike, and once press Cancel instead.
Expect: the bar has no "Here" buttons, only its text and Cancel; the squares next to the Orc are outlined on the map and a click places the
pillar there (its Defense = 11 + her Power Modifier); Cancel places none. The other pick bars (Pushes, Charge, Move back) keep their buttons.
Rev: 2

### ice-pillar-break · v0.0.476 · The Ice Pillar can be targeted, and breaks on 5 from one Action
Do: Sylwen targets the Ice Pillar and shoots it twice: one hit dealing 4 or less, one dealing 5 or more. Also check a creature standing
behind the pillar: her Line of Effect button to it, and whether she can target it. Then end the combat with a pillar standing.
Expect: the pillar is visible and can be targeted (no Cover from its own square); "Ice Pillar holds: ... does nothing", then "Ice Pillar
breaks" and its token and walls go. A creature right behind it has no Line of Effect (or Cover from the blocked corners). Tokens still can't be
dragged through its square. Ending the combat melts every pillar left.
Rev: 2

### eoe-text · v0.0.476 · EoE alone in Foundry's texts
Do: Aveline: Lantern of Faith, Kindle; open the effect on her (its Details: Ends) and hover it.
Expect: the Ends' button and summary read "EoE", the hover "Lasts until EoE.", Kindle's description "…, EoE (Lantern of Faith, Kindle)";
"end of the encounter" isn't written beside it.
Rev: 2

## Ending an encounter and resting

## The Encounter Log

## Windows

