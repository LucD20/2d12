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

## Reactions and Judge

### judge-gm-dock · v0.0.471 · Judge's question for the GM: into the Situational tab
Do: As the GM with no token selected, the Judged Orc Warrior damages an ally near Durgan; read where the question shows; then click Durgan's token.
Expect: Once Durgan's HUD is up, the question moves into its Situational tab, in the tab's look (not the large bar across the HUD). With no creature selected it may first show in the HUD's middle.
Rev: 2

## Areas, light and Cover

### area-hover · v0.0.471 · The hover card: worked-out damage
Do: Hover an area with Hazardous Terrain whose damage uses its origin's Modifier (for example a hazard of 2 + Weapon Modifier Pierce), and Aveline's Consecrated Ground.
Expect: The damage reads as a number and its type in full and in its color ("Hazardous Terrain, 5 Pierce"), not "2 + @origin.wpn Pi"; Consecrated Ground's Guard as a number ("Guard 2 at the start of their turns").
Rev: 4

## Ending an encounter and resting

## The Encounter Log

### log-allies · v0.0.471 · The Encounter Log: To allies and numbered names
Do: In a fight with two Goblin Sneaks, Sylwen's Volley hits Aveline and both Goblins; open the Encounter Log.
Expect: Under the log, a "Damage dealt" table with a "To allies" column (Sylwen's damage to Aveline there); the Goblins are "Goblin Sneak 1" and "Goblin Sneak 2" in the log's lines and in the copied text.
Rev: 2

## Windows

