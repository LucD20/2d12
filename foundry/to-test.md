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

### ui-canvas-polish · v0.0.484 · Canvas overlays, Area placement bar, and compact Situational cards
Do: Put Aveline Prone or Grabbed (or unload a weapon on Kaela), check the HUD Situational tab, then use Ogre Chieftain's Ground Slam or a Burst/Line Area Action to preview placement on the map.
Expect: Situational cards are compact (Prone shows Stand/Crawl, Grabbed/Immobilized shows Break Free, unloaded weapon shows Reload); Area placement shows a HUD bar with enemy/ally/blocked counts, gold target rings, and No Line of Effect plates on blocked tokens.

## Starting a combat

## The roll dialog

## Chat cards

### ui-chat-down-foot · v0.0.484 · Clean Took line (state badges only) and Resist/Weak/Immune in breakdown
Rev: 2
Do: With Aveline (Longsword), apply Slash damage to an Orc Warrior that has Resist Slash 2 (making it Bloodied), and apply lethal damage that puts a target Down (both Bloodied and Strained, or damage at/past its Health Pool).
Expect: The post-Apply Took line shows only "Took ♥ N" plus Bloodied, Strained, or Down (never Resist/Weak/Immune pills), Undo and Card sit cleanly on one row without wrapping, and clicking "=" opens the breakdown ledger showing Resist Slash −2 cleanly.

## Conditions and their Tiers

### l1-paladin-auto · v0.0.484 · Aveline & Durgan L1 automations (Courage, Thwart Cut, Brace, Seizing Cut)
Do: With Aveline, use Commandment (Courage) while Daunted (from Grave Wisp) and check rolls/movement toward Grave Wisp; use Thwart Cut to apply Pressed then move Aveline out of Reach. With Durgan, use Hold the Line (Brace) then move Durgan; use Seizing Cut Tier 3 to Grab an enemy and check hands / Release (0 AP).
Expect: Courage Aura 3 lets Aveline and allies inside ignore Daunted's Bane and movement restriction; Thwart Cut's Pressed ends automatically when Aveline stops threatening; Brace leaves a fixed 1-round Difficult Terrain Zone on the original adjacent squares even after Durgan moves; Grabbing occupies Durgan's free hand and Release (0 AP) offers "Let go of <target>".

## Movement

### l1-archer-auto · v0.0.484 · Sylwen & Kaela L1 automations (Quick Shots, Darting Blade, Spotter, Footwork, Circling Shot)
Do: With Sylwen, score a Critical on Quick Shots; use Darting Blade with a Dagger worn (not in hand) and finish Evade 2; use Spotter (Find the Gap, then shoot a target in Cover; and Keep Low while in Cover). With Kaela, use Footwork (Hands Busy) and Circling Shot Tier 3.
Expect: Quick Shots Critical grants +1 AP when applied; Darting Blade draws the Dagger with Setup and prompts to stow it when Evade 2 ends; Find the Gap lowers target Cover 1 level (Total stays Total) and Keep Low raises Sylwen's Cover 1 level up to High; Footwork Hands Busy offers free Interact and Reload buttons; Circling Shot Tier 3 auto-starts Evade 1 that refuses squares farther from the target.

## Reactions and Judge

### l1-npc-auto · v0.0.484 · Playtest NPC automations (Dirty Trick, Overhead Smash, Rally the Tribe)
Do: With Goblin Sneak, land Dirty Trick Tier 2 or 3 on Aveline. With Ogre Chieftain, land Overhead Smash Tier 2 or 3 on a Bloodied target, and at Escalation 4+ use Rally the Tribe near an Orc Warrior and Goblin Sneak.
Expect: Dirty Trick automatically applies 1 Pressure Bane on Aveline's next roll; Overhead Smash folds Bloodied's +1 Push into a single Push 3; Rally the Tribe shows a 5 Emanation targeting allies and automatically applies 1 Support Boon on their next [Weapon] Action.

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows


