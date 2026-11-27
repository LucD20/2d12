# The Reactions' rebuild: the decisions, one at a time

The running record of the rebuild (HANDOFF "Next", step a; MASTER-PLAN 1.1). One decision at a time: Claude proposes, **Lucas decides**, and the decision is written here. **Nothing here is in the book, the cards or Foundry until Lucas says to build it** (2026-11-27: "dont build anything yet until I say"). The economy it sits on is in `rules-backlog.md`, "DECIDED, NOT BUILT: THE ACTION ECONOMY AND THE REACTIONS". The research is `research/action-economy.md` (the price), `paladins-other-games.md`, `frontline-protection.md`, `tactical-combat.md` and `targeting.md`. The measured rates are in `ruler/reactions.md`.

## Lucas's brief (2026-11-27)

> I want to discard the Reactions; in play, they felt more disrupting than cool. We should rebuild them from the ground up, keeping only the idea of it.

> Stopping someone else's turn was the most disrupting part, and the most disrupting were the ones that allowed to move as part of it.

> A Reaction is simply an Action Point you can use as a response to something.

> I dont want to limit Reactions by rules like that, we limit each case as we go. (On a cap of one Reaction a round.)

## What is settled around it

- **The price:** a Reaction is paid with AP. You regain your 4 AP at the end of your turn, and they pay for your Reactions until your next turn starts. There is no Reaction Point and no free 1R. Whatever you spend reacting, you don't have on your next turn. That is the wording for the next playtest.
- **No general cap:** each card limits itself (its Frequency, its trigger).
- **NPCs follow the same rule.**
- **The Guard from unspent AP is removed.** Full Defense and Assess are future Basic Actions.

## What is being replaced, and what the playtests showed

The nine discarded cards: the four Hallmark Reactions (Shield of Faith, Rebuke, Snap Shot, Slip Away), Bulwark of Faith (level 2) and the creatures' four (Backhand, Blood for Blood, Dying Flare, Shriek and Scatter; the HANDOFF's "five" counted Shriek and Scatter twice). Judge's 0R re-mark, a Feature's Reaction that isn't discarded, is in the table for comparison. Bear the Blow (a playtest Talent's 0R, `cards/talents-playtest.md`) is not discarded either; decision 3 takes it up.

| Card | What it does in another creature's turn | Seen in playtests 8 to 11 |
|---|---|---|
| Shield of Faith | reduces the hit by 1 + Pow; Taunts the attacker | the most used Reaction (p9: 6 uses; p11: every round, 3 off hits of 14 to 19, "a rounding error") |
| Rebuke | Hindered; on a failed Save, the Move Action is **disrupted** (the token goes back) | p8: the orc spent 3 of its 4 AP walking; p9 once |
| Snap Shot | a shot before the enemy is adjacent; **the token goes back** to the square before | p9 twice (15 damage); p11 once (21, Immobilized) |
| Slip Away | **you move** (Evade 1, Advance 2) during the enemy's move | p9 once |
| Bulwark of Faith | Guard; **the ally is Slid 1** after the damage | not played (level 2) |
| Backhand | 2 damage and **the mover is Pushed 2**, then it goes on with its movement | p8 never offered and its "move" unclear; p9, p10 and p11 (twice), twice into a wall or a creature |
| Blood for Blood | **the orc Advances 2** and attacks during the PC's turn | p8 Tier 1, nothing; p11 once |
| Dying Flare | an area at the moment the wisp goes Down, before the attacker's Action finishes | p8 |
| Shriek and Scatter | **the goblin Evades 1**, then Jeers | never seen |
| Judge (0R) | re-marks when your Judged creature goes Down | every fight; nothing on the board moves |

**A reading of the table [judgment]:** 7 of the 10 cards move a token during someone else's turn, and two of those also stop that creature's Action. Those are the two things Lucas named. The two that move nothing are Shield of Faith and Judge's re-mark, and those are the two that fired every fight without his complaint attached to them. Shield of Faith's own problem was size, not disruption.

## What 1 AP must buy now [arithmetic, from `research/action-economy.md`]

A Reaction now costs 1 AP of your next turn. On your turn, 1 AP buys about a Strike: 6 to 9 damage at level 1. So a Reaction has to be worth about that much at its moment, or players will keep the AP. Enemy hits are now 14 to 19 on a Tier 2 or 3 (playtest 11). The Interrupt on "would damage" already sees the damage before it lands (Chapter 2), so a protection that takes a third to a half of a hit off is in that range, and the player decides with the number in front of them.

## The order of the decisions

1. **What a Reaction is for:** its families (below, proposed).
2. **What a Reaction may do to another creature's turn:** Interrupt and Trigger, disruption, movement, and whether a part waits until the triggering Action ends. Chapter 2's timing rules are kept only where this decision keeps them.
3. **What one must be worth, and the 0R ones:** the anchor for 1 AP; whether a 0R Reaction survives (Judge's re-mark, Bear the Blow).
4. **Who has Reactions:** the Hallmark Reaction slot (the charter's "two that share a trigger and differ by the rider", and the "half the rounds" target, both to be re-read at the new price); the NPCs' (by rank; whether a Minion has any); whether a Basic Reaction exists for everyone (today: none by default).
5. **The Paladin's,** against his brief ("aid you, make sure you don't go down"; "they stay in front so the squishies can stay back").
6. **The Archer's,** against his ("very mobile").
7. **Bulwark of Faith's place.**
8. **The creatures' four,** creature by creature.
9. **The cards that pay or count the old Reaction AP:** Smite's extra die, Steady Draw's Special, Tireless Vigil's second Reaction AP, Strained, Staggered, the Minion's line.
10. **Chapter 2's Reactions section re-read whole,** then Foundry's list (`moment.mjs`, the Reactions message, the HUD's Reaction mark), then the build with the rest of the economy.

## Decision 1: what a Reaction is for (PROPOSED 2026-11-27, waiting for Lucas)

**Every family the rules offer, the rejected ones included:**

| # | Family | What it does | Old cards | The case for | The case against |
|---|---|---|---|---|---|
| 1 | **Protect** | makes a hit on an ally (or you) smaller, or gives Guard before it lands | Shield of Faith, Bulwark (its Guard), Bear the Blow | the richest decision at the new price: the damage is known when you choose; moves nothing; the Paladin's brief | fires on most enemy turns unless the card limits it (charter rule 16); a "you or an ally" card gets spent on yourself (`frontline-protection.md`, the 5e Monk) |
| 2 | **Punish** | after the enemy's Action, damage or a condition on the creature that triggered it | Blood for Blood's attack, Backhand's damage, Snap Shot's shot | the enemy's turn is left whole; it teaches the enemy what not to do (`tactical-combat.md` 3: "a defender punishes being ignored"); this is how the front line becomes real without stopping anyone | a Strike off your turn is worth about the Strike you give up next turn, so the card must add something the timing gives (a condition, a target that is otherwise hard to reach) |
| 3 | **Stop** | cancels or cuts short the enemy's Action (disrupts it, sends its token back) | Rebuke's Tier 1 or 2, Snap Shot's and Slip Away's "move back" | the strongest "they stay in front" there is | **the thing Lucas named first**: "Stopping someone else's turn was the most disrupting part" |
| 4 | **Move yourself** | you move in answer | Slip Away, Blood for Blood's Advance, Shriek and Scatter's Evade | the Archer's escape; the brief's "very mobile" | **the second thing he named**: "the most disrupting were the ones that allowed to move" |
| 5 | **Move someone else** | forced movement on the trigger | Backhand's Push, Bulwark's Slide | visible protection (`frontline-protection.md`) | the same token problem, and Backhand's mid-move Push was the playtests' unclear case |
| 6 | **A moment that isn't an enemy's Action** | answers something that happens: a creature goes Down, you become Bloodied, an ally goes Down | Judge's re-mark, Dying Flare, Shriek and Scatter | cheap at the table when it changes nothing about the current mover's turn | Dying Flare is this family and still lands in the middle of the attacker's Action |
| 7 | **Help** | gives an ally something at the trigger (a Boon on their next roll, a Rally Point when they would go Down) | none | "make sure you don't go down"; nothing moves | overlaps Protect; probably the same family |
| 8 | **Information** | reveals or marks the creature that acted (it stops being Hidden) | none | moves nothing | rarely worth an AP; Assess and the Arts already cover it |
| 9 | **A Basic Reaction for everyone** | not a family: one Reaction every creature has (say, "reduce one hit") | none (today: no Reaction by default) | simple, the same for all | every player watches every enemy turn: the worry that led to the economy's wording |

**Claude's proposal:** **Protect (with Help) and Punish are the two families of the rebuilt Reactions, and Moments (6) stay for Features and creatures. Stop (3), Move yourself (4) and Move someone else (5) leave as a Reaction's main thing.** Decision 2 then settles whether a movement can come back as a rider that waits until the triggering Action has ended (the enemy's turn is never cut in two; the board changes only between Actions). No Information and no Basic Reaction.

**Why:**

- **It is his complaint, card by card:** the families that go are exactly the 7 cards that moved a token or stopped an Action. The ones that stay are those that left the enemy's turn whole.
- **It fits the new price:** Protect is chosen with the damage in front of you, so the AP is spent when it matters. Punish is the enemy's choice ("do I walk past the Paladin?"), so its value is mostly the threat, and the enemy's turn stays the enemy's.
- **"They stay in front" survives as Punish:** the enemy can walk past him, and it pays for doing so (the 4e mark's pattern), instead of being stopped.

**What it costs, said plainly:**

- **The Archer loses his escape Reaction** (Slip Away). His brief's mobility would live on his own turn (Shifting Aim, Darting Blade, Evade) unless decision 2 lets a move wait until after the enemy's Action. That would be option B below.
- **The front line becomes a price, not a wall.** An enemy that accepts the price still reaches the back line.
- **Backhand and Blood for Blood lose their movement,** and the ogre and the orc lose some of what makes them feel like themselves. The creatures' decision (8) has to give that back another way.

**The choice for Lucas:**

- **A (Claude's):** Protect and Punish (and Moments); no stopping, no movement in a Reaction.
- **B:** A, plus movement as a rider that happens once the triggering Action has ended (the Archer steps away after the swing, never during the walk).
- **C:** every family allowed, each card limited case by case ("we limit each case as we go"), with rarer triggers for the ones that stop or move.
