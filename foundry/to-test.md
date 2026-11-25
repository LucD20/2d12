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

### hud-hp-boxes · v0.0.503 · The Token HUD's Vigor (red) and Resolve (blue) boxes, where Foundry's Health box was
Do: Right-click Orc Warrior's token. In the red Vigor box type -5 and Enter; then +2; in the blue Resolve box type 3.
Expect: The two boxes sit side by side under the token, where Foundry's own Health box was, both whole and clickable (nothing over them, not over the token). -5 deals 5 to Vigor only, +2 heals 2 of it, a plain number sets what is left of that pool (Resolve 3).
Rev: 4

### status-palette-clicks · v0.0.503 · The status palette: the whole row is the button; a right-click lowers a value
Do: Right-click Orc Warrior's token and open its status effects. Click anywhere in Slowed's row (its frame, not only the icon or the word); click it again; then right-click it twice. Click Prone's row, then right-click it.
Expect: The first click gives Slowed 1, the second makes it Slowed 2; each right-click lowers it by 1, and at 1 a right-click removes it. Prone's row toggles it with a click anywhere in the row; its right-click does Foundry's right-click (the large overlay icon).

### cond-numbers · v0.0.503 · A condition's number: none on the token, readable beside the chat and in the HUD
Do: Give Orc Warrior Vulnerable 1 and Slowed 2 (the palette). Look at its token; select it and look at the effects beside the chat, then the HUD's conditions row. (A world from v0.0.501 or 502: reload it as GM first.)
Expect: The token shows the plain icons (no number). Beside the chat, each valued icon has a large white number on a dark box at its lower right corner. In the HUD's row the number is bold after the icon.
Rev: 4

## Starting a combat

## The roll dialog

## Chat cards

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
