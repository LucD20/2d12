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

### fix-calc-btn-size · v0.0.495 · Calculated inline buttons match normal button size & Combat Strip target badge centered
Do: Open Sylwen's Evade Basic Action card (1 AP "Evade 1" vs 2 AP "Evade 3" with calculator icon) and target Ogre Chieftain in the Combat Strip.
Expect: Both "Evade 1" and "Evade 3 🧮" buttons are the exact same font size and crispness (calculated button keeps its blue color, no longer shrunken/faded); the red target crosshair badge on Ogre Chieftain's Combat Strip portrait sits dead-center. Also verify "Test checklist" world setting defaults ON in a fresh world.

## The HUD

### fix-move-end-sit · v0.0.495 · Advance and Evade Basic Actions show End movement in Situational tab
Do: On Sylwen's or Durgan's turn in combat, click Basic Actions → Evade (1 AP or 2 AP) and Advance (1 AP), then check the HUD Situational tab.
Expect: The Situational tab immediately surfaces the movement card with live squares remaining, "End movement" (and "Advance instead" for Evade), and clicking "End movement" or pressing Esc ends the movement cleanly.

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

### fix-rx-order-dead · v0.0.495 · Dead movers skip Reactions & Trigger cannot be dragged above Interrupt
Rev: 2
Do: (1) Drag a dead/defeated Grave Wisp toward Sylwen (with Snap Shot); (2) Trigger both Snap Shot (Interrupt) and Rebuke (Trigger) on the same live enemy movement, then try dragging Rebuke above Snap Shot in the Reactions stack.
Expect: (1) Moving a dead/defeated token never triggers Snap Shot or any Reaction; (2) Rebuke cannot be dragged above Snap Shot (even visually while dragging — it stays locked below Interrupts).

## Areas, light and Cover

### fix-peek-visibility · v0.0.495 · Large/peeking token stays visible when any corner has Line of Effect
Do: Place Ogre Chieftain (2×2) behind a wall with Line of Effect (Shift+L) on Sylwen and move Sylwen right until only 1 corner of the Ogre peeks past the wall (High cover, 3/4 walls blocked), then move 1 more square right until all 4 corners are blocked (No Line of Effect).
Expect: Ogre Chieftain stays visible on the canvas whenever at least 1 corner is inside Sylwen's Line of Sight (High cover), and disappears only once all corners are behind the wall.

## Ending an encounter and resting

## The Encounter Log

## Windows

