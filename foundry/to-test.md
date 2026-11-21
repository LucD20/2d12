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

## Chat cards

## Conditions and their Tiers

### break-free · v0.0.476 · Break Free: its Check, and its button in the Situational tab
Do: Kaela: drop Immobilized on her (DC 13), select her token and look at the HUD's Situational tab; use Break Free from there. Then Aveline's
Binding Light on a Tier 2 on her instead and Break Free again.
Expect: the Situational tab shows "Immobilized" with a Break Free button (Grabbed shows "Grabbed"); the button rolls her Instinct Check
against the Action DC (13, then 11 + Aveline's Weapon Modifier); meeting it ends Immobilized (and Grabbed) and the button goes.
Rev: 2

## Movement

## Reactions and Judge

## Areas, light and Cover

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

