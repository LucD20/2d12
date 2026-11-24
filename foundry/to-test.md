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

### ui-init-squads · v0.0.492 · Intuitive Initiative Squads & alignment
Rev: 4
Do: Start a combat with Aveline, Durgan, Ogre Chieftain, Orc Warrior, and 4 Goblin Sneaks, then open Initiative. Click enemy checkboxes, click "+ Squad" / "+ Add" (including on the bottom row), test Ungroup All → Auto-Squad Minions, and roll Initiative.
Expect: Checkboxes have crisp high-contrast borders and checking them puts "Group Selected (N)" in the Enemies header with zero vertical layout shift; "+ Squad" / "+ Add" popovers open directly under their clicked button (floating cleanly over the window/footer without shifting position or growing the window); Orc Warrior's sub-line stays on one tidy row.

## The roll dialog

### pass1-cover-demoralize · v0.0.494 · Cover only on [Strike]/[Area], Large target doorway Cover, and Demoralize EoE
Do: (1) Put Ogre Chieftain in a 1-square doorway (with 1 of its 4 squares cleanly exposed in the doorway) and shoot it with Sylwen's Basic Attack; (2) Use Demoralize (Sylwen or Durgan) and Shove (Durgan) against a target behind cover; (3) Use Demoralize twice on the same enemy in one encounter, and check Tier 2 / Tier 3 durations.
Expect: (1) Ogre Chieftain has No cover (0 Banes) and Line of Effect draws to its exposed square; (2) Demoralize and Shove take no Cover Banes (Strikes & Areas still do); (3) Demoralize applies Vulnerable 1 (EoT) on T2, Vulnerable 1 (1 round) on T3, and warns in the roll dialog if you target a creature already Demoralized by you this encounter.

### pass1-strikes-cards · v0.0.494 · Shared At-will [Strike] Banes, Magical/Ranged traits, Darting Blade 2 AP, Heal T1-T3
Do: (1) On Durgan's turn, use Basic Attack then Drawing Light (or Sylwen's Basic Attack then Harrying Shot); check Drawing Light's & Harrying Shot's traits (and Engaged penalties on both); (2) Check Kaela's Darting Blade cost; (3) Use Heal (Durgan) on a wounded/Prone ally.
Expect: (1) Second At-will [Strike] in the same turn takes 1 Bane even when switching between Basic Attack and Drawing Light / Harrying Shot; Drawing Light shows [Divine, Magical, Power, Ranged, Strike] and Harrying Shot shows [Power, Ranged, Strike]; (2) Darting Blade costs 2 AP; (3) Heal costs 2 AP ([Handle]) and offers 1 RP on T1, 2 RP on T2, and 2 RP + Stand if Prone on T3.

## Chat cards

### fix-layonhands-eq · v0.0.493 · Lay On Hands @Rally target & damage card = icon
Do: Have Durgan use Lay On Hands (2 AP) targeting Aveline and click the Rally Point button on the card while Durgan's token is still selected; also deal damage to Durgan and inspect the "=" breakdown button next to Undo.
Expect: Clicking Lay On Hands' Rally Point opens "Rally: Aveline" (never Durgan) and heals Aveline; the "=" icon inside the breakdown button is dead-center inside its square border.

## Conditions and their Tiers

### fix-daunted-eot · v0.0.493 · Daunted (EoT) expires at end of target's turn
Do: Have Grave Wisp hit Durgan with Chilling Touch (applying Daunted EoT), then advance through Durgan's turn (including when Durgan is last in the round) into the next round.
Expect: Daunted (Grave Wisp) (EoT) clears automatically at the end of Durgan's turn on both Round 1 and Round 2+.

## Movement

## Reactions and Judge

### fix-rx-order-dead · v0.0.493 · Interrupt before Trigger & defeated tokens skip Reactions
Do: Kill/defeat an enemy with a Reaction (e.g. Orc Warrior) and trigger its moment near its body; also trigger Slip Away (Kaela, Interrupt) and Rebuke (Aveline, Trigger) on the same enemy movement, and try reordering the stack.
Expect: Defeated/Down tokens never trigger Reactions or post No-Reactions lines; Interrupt (Slip Away) is always listed and resolved before Trigger (Rebuke), and Rebuke cannot be moved above Slip Away. Also verify Skip Defeated is ON by default in Combat Tracker settings, dead squad Minions no longer trigger the Minion pick bar, and hovering across Combat Strip portraits never leaves stuck token highlights on the canvas.

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows

