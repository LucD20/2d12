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

## Movement

### drag-move-limit · v0.0.496 · Dragging a token in combat shows its movement limit
Do: On Sylwen's turn in combat (with AP remaining, without clicking Advance first), click-and-drag Sylwen across the map; cancel the drag (right-click or Esc), then drag 2 squares and drop, then drag again.
Expect: Starting a drag immediately shows Sylwen's Speed movement-range outline on the map (just like clicking Advance); cancelling clears the outline; dropping 2 squares spends 1 AP and keeps the remaining 4-square range outline visible around the new square until End movement or 0 squares left.

### undo-move-ctrlz · v0.0.496 · Undo movement (Ctrl+Z & Undo move button) refunds 2d12 + Foundry ruler
Do: On Sylwen's turn in combat, drag 2 squares (spends 1 AP, 4 sq left), drag 2 more squares (2 sq left), then press Ctrl+Z twice (or use the "Undo move" button in the Situational tab). Also try clicking Advance first, dragging, and pressing Ctrl+Z; and verify Ctrl+Z still works normally out of combat or on the Walls layer.
Expect: First Ctrl+Z steps Sylwen back to after the first drag (4 sq left, range redrawn, Foundry's drag ruler drops back by 2 sq); second Ctrl+Z returns Sylwen to her start square, refunds the 1 AP, closes the Advance banner, removes the movement from Turn Breakdown & Encounter Log, and resets Foundry's movement history to 0. Ctrl+Z out of combat or on Walls still runs Foundry's normal undo.

## Reactions and Judge

## Areas, light and Cover

### loe-lines-optb · v0.0.496 · Line of Effect lines (Option B: dark-cased emerald/crimson dashed + blocked X)
Do: Select Sylwen, target Ogre Chieftain across a wall/corner, and toggle Line of Effect (Shift+L or 2d12 Tools drawer) on both light and dark map backgrounds.
Expect: Clear corner lines are high-contrast emerald green dashed with dark casing; blocked corner lines are crimson red dashed with dark casing and a white X inside each blocked corner dot; center line has dark casing (cream when clear, bright orange when a creature is in the way).

### fix-peek-sliver · v0.0.496 · Large token visibility tuned (no wall-sliver leak, still visible when peeking)
Do: Place Ogre Chieftain (2×2) behind a horizontal wall ending near its bottom-middle (like your v0.0.495 screenshot with only a tiny sliver of light under its bottom edge), then move Sylwen right so ≥25% of one of the Ogre's 1×1 squares peeks cleanly into view.
Expect: Ogre Chieftain stays hidden when only a razor-thin sliver of light passes its bottom wall edge, and becomes cleanly visible as soon as at least a quarter of one of its occupied squares peeks out past the wall.

## Ending an encounter and resting

## The Encounter Log

## Windows


