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

### crit-basic · v0.0.479 · A Basic attack's Critical: 1d10! of a type you choose, or none
Do: Kaela: Weapon Attack on a Goblin Sneak until a Critical (force it: the roll dialog's Tier "Critical", if you use it); roll the damage.
Then Aveline's Weapon Attack with a Critical, and once press "Don't apply".
Expect: before the damage, the bar asks "a Critical! Its 1d10!: choose the damage type" with one button per type the Action deals ("[V]
1d10! Pi") and "Don't apply"; the chosen die is added to the damage card (exploding); "Don't apply" deals a plain Tier 3. A Critical on a
non-Basic Action with no Critical row (Smite) asks nothing.
Rev: 1

### crit-rows · v0.0.479 · Trip's and Shove's Critical rows
Do: Durgan: Shove a Goblin Sneak with a Critical; Trip it (1 AP, then 2 AP) with a Critical.
Expect: the cards show a "Critical" row under Tier 3 (Shove: Prone; Trip: [V] 1d6! Bl). On the Critical the bar asks "Apply: Prone" /
"Apply: [V] 1d6! Bl." or "Don't apply"; Shove's Prone lands with the push; Trip 1 AP's 1d6! comes as a small damage card ("Trip: Critical")
to Apply; Trip 2 AP adds it to its Tier 3 damage.
Rev: 1

## Conditions and their Tiers

### bloodied-effects · v0.0.479 · Bloodied: Speed −2 and Steadiness −1 (below 0)
Do: Orc Warrior: deal it damage until it is Bloodied (its Vigor). Look at its Speed (sheet, Advance); then Durgan Shoves it (Pushed 1).
Then heal it above the threshold.
Expect: Bloodied, its Speed is 2 lower (a Hindered one: lowered first, then halved); Durgan's Shove 1 moves it 2 (Steadiness −1; no
question asked); healed, Speed and pushes are back to normal.
Rev: 1

### strained-rp · v0.0.479 · Strained: no Reaction Point at the start of the turn
Do: Aveline: Resolve damage until she is Strained, with her Reaction Point spent; let her next turn start. Then once with it unspent.
Expect: spent, it stays spent at the start of her turn (the gold diamond empty); unspent, she keeps it; kept AP still pay Reactions; healed
below the threshold, she regains it from her next turn. The texts say "Reaction Point" (sheet, HUD, roll dialog).
Rev: 1

### bloodied-line · v0.0.479 · A card's Bloodied line (the Ogre's placeholder)
Do: Ogre Chieftain: Overhead Smash on Durgan, once when Durgan is far from Bloodied, once when this hit makes him Bloodied (Tier 2 or 3).
Expect: the card shows "Bloodied: On a Tier 2 or 3, the target is Pushed 1 more." under the Tiers; the first time only Pushed 2; the
second, after the damage lands and the Push 2, a Push 1 more runs.
Rev: 1

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows

