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

### hud-faded-ap · v0.0.478 · An Action you can't pay is faded; several costs fit beside the name
Do: Sylwen in combat: spend AP until 1 is left; look at Quick Shots (2 AP) in the HUD. Durgan: open the HUD's Basic tab on a small window.
Expect: Quick Shots' line is faded (still clickable: the roll dialog warns). Shove, Relocate and Haul write their costs "1" "2" "3 AP" (Reaction
Actions "1" "2R"), so their names aren't squished.
Rev: 2

## Starting a combat

## The roll dialog

### attribute-dc · v0.0.478 · Attribute DCs: the roll dialog says "Body DC"
Do: Durgan: Shove a Goblin Sneak; Kaela: Trip the Orc Warrior with Instinct.
Expect: the roll dialog reads "Body +N vs. Body DC" (Kaela: "vs. the same Attribute's DC"), the card the same; the DC is 11 + the target's
Attribute, shown as "Body DC (Goblin Sneak): 11 + ..."; the sheet's tiles read "Body DC" and so on.
Rev: 2

### doomed-counts-five · v0.0.478 · A Doomed roll counts as 5 Banes; "Engaged with" names whom
Do: Sylwen: shoot an enemy adjacent to her (Engaged: Doomed), once alone, once with 2 Boons added by hand; then shoot a Goblin that is
adjacent to Kaela too.
Expect: alone, Doomed (extra Banes subtract nothing); with 2 Boons a normal roll at −3. Shooting the Goblin beside Kaela, the Goblin's tile
says "Engaged with Kaela" (1 Field Bane), distinct from your own "You are Engaged"; a Goblin adjacent only to Sylwen shows no such Bane.
Rev: 2

## Chat cards

## Conditions and their Tiers

## Movement

### immobile-drag · v0.0.478 · An Immobilized creature's token can't be dragged, on its turn or not
Do: Ogre Chieftain: Immobilized by Aveline's Binding Light; during a combat, drag its token on its own turn and on someone else's; then
Alt-drag it (GM).
Expect: both drags are refused with "Immobilized and can't move: Break Free (1 AP) first"; the Alt-drag moves it as Forced Movement.
Rev: 2

## Reactions and Judge

## Areas, light and Cover

### cover-touch · v0.0.478 · A line that only touches a creature gives no cover; a Prone or dead one gives none
Do: Sylwen shoots the Orc Warrior on an exact diagonal with a Goblin Sneak beside the line, its corner touching it (Show cover on). Then put
the Goblin where the line crosses its square, then make it Prone, then dead.
Expect: the corner touch gives no cover; crossing its square gives Low cover (1 Field Bane); Prone or dead, none.
Rev: 2

### ice-pillar · v0.0.478 · Rime Strike's Ice Pillar: one "1 AP" in the HUD, its square clicked on the map
Do: Aveline: look at Rime Strike in the HUD; use it (Power mode) on an Orc Warrior; on a Tier 2 or 3 Apply the damage; click one of the
outlined squares. Once press Cancel instead.
Expect: the HUD shows one "1 AP" stamp (not one per mode); the bar has only its text and Cancel; a click places the pillar (its Defense = 11 +
her Power Modifier); Cancel places none. The other pick bars keep their buttons.
Rev: 3

## Ending an encounter and resting

## The Encounter Log

## Windows

