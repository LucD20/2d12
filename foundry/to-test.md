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

### ui-init-dark · v0.0.487 · Initiative window in dark theme
Do: With Foundry's Interface theme on Dark, start a combat with Aveline, Durgan, Orc Warrior, and Goblin Sneak and open the Initiative window.
Expect: The Initiative window body, side headers (Heroes / Enemies), rows, attribute buttons, and steppers all render in dark theme with crisp, readable text and no cream/pastel bleed-through.

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

### ui-toolbox-drawer · v0.0.487 · Consolidated 2d12 Tools drawer in Token Controls
Do: Look at Foundry's Token Controls bar with Aveline or Sylwen selected, then click the single 2d12 Tools button to toggle Line of Effect, Weapon Range & Reach, Show Flanking, and Light Levels Overlay, and launch Cover Height, Area Height, World Clock, and (as GM) Encounter Log / Damage Report / Create Chat Button.
Expect: Token Controls only shows ONE 2d12 button (no toolbar clutter); clicking it opens the floating 2d12 Tools drawer grouped into Map Overlays (with live ON/OFF pills and active count badge), 3D & Rules Tools, and GM Tools.

### ui-areaheight-dead · v0.0.487 · 3D Area Height Calculator ignores dead tokens
Do: Mark an Orc Warrior or Goblin Sneak Dead (or defeated in combat) on a scene with live Aveline and Durgan, then open Area Height (3D) from the 2d12 Tools drawer.
Expect: Only living tokens appear in the Area Height top-down grid, side cross-section, and creature list; dead/defeated tokens are excluded.

## Ending an encounter and resting

### ui-pickwin-layout · v0.0.487 · Compact Pick dialogs sizing & Encounter End order
Do: End an encounter with Aveline and Durgan (to open "The encounter ends") and try Shove with Aveline holding a two-handed weapon (to open "Shove: no free hand").
Expect: Choice buttons expand cleanly around their title, subtitle, and right tag with zero text overflow or overlap; in "The encounter ends", Party Momentum and "How did the encounter end for the party?" appear ABOVE Overcome / Retreat / Neither.

## The Encounter Log

## Windows
