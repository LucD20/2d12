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

## Decision 1: what a Reaction is for (ANSWERED 2026-11-27: no family is banned)

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

**Lucas's answer (2026-11-27):** "Snap Shot and Blood for Blood is actually fine." So no family is banned as a rule: it is the same "we limit each case as we go" as the cap (in effect option C). Snap Shot (an Interrupt shot as the enemy steps up) and Blood for Blood (the orc Advances 2 and attacks) are kept as designs, to be re-sized for the new price in their batches. What disrupted is judged card by card: the table above is the evidence for each one.

**His reading of the price, confirmed (Claude, 2026-11-27):** "now Reactions should be worth much closer to a normal AP, since you no longer has a chance of 'wasting' them." Yes. The old anchor (a 1R Reaction worth 10 to 15 points a turn, `class-charter.md`) priced a free point that was lost if unused. Now an AP not spent on a Reaction is spent on your next turn, so a Reaction is a trade against about a Strike (6 to 9 damage at level 1, about 25 points). Three things move it a little either way, case by case:

- **Up:** it happens at the best moment, with the information in front of you (the damage is known before it lands; the enemy has committed to its move). And a [Strike] made as a Reaction isn't one of your turn's repeats, so it escapes the repeat's Doomed (decided, not built) and the 3-Strike cap.
- **Down:** the AP comes out of a turn you haven't planned yet. Losing 1 of 4 can break a 2 + 2 turn (Smite 2 and a Charge, say), so one Reaction can cost more than one AP's worth of that turn.
- **The threat:** a Reaction the enemy has to play around is worth something even when it isn't used. This isn't priced; it is judged per card.

**How the rebuild runs (Lucas, 2026-11-27): in batches, one class at a time.** Batch 1, the Paladin: Shield of Faith, Rebuke, Bulwark of Faith (and the Hallmark Reaction slot). Batch 2, the Archer: Snap Shot (kept), Slip Away. Batch 3, the creatures: Backhand, Blood for Blood (kept), Dying Flare, Shriek and Scatter. Then the cards that paid the old Reaction Point (step 9 of the order above). This replaces steps 3 to 8 of the order as separate decisions: each batch settles them for its cards.

## The toolbox: what a Reaction can carry, by what it does to the turn it lands in

Read from Chapter 1 (Boons, Banes, Favored and Doomed), Chapter 2 (Buffs, Stacking, durations), Chapter 3 (Forced Movement, Reposition, Steadiness, Engaged, Flanking), Chapter 4 (Guard, Rally Points, health states) and Chapter 8 (conditions), 2026-11-27. **Durations in a Reaction:** an EoT given on another creature's turn ends at the end of *that* turn when the affected creature is the one whose turn it is (so Rebuke's Hindered (EoT) cuts the mover's movement now), and lasts until the end of its next turn otherwise. "1 round" counts down from the current slot, so it covers that creature's next turn.

**It changes the rest of the turn it lands in** (the mover feels it at once: the kind Lucas called disrupting when it stops or moves):

- **Stops or cuts:** disrupted (the Action never happens, or stops where it is); Immobilized (the movement ends); Hindered (the movement left is halved); Prone (Move Actions are only Crawl, Stand, Break Free).
- **Takes from what is left:** Dazed N (AP lost now); Staggered (no Reactions; a Reaction can turn off the enemy's Reactions for the rest of its turn).
- **Bends its choices:** Taunted (1 Bane against anyone else; Shield of Faith's rider); Daunted of a source (1 Bane on every roll and Difficult Terrain toward the source while it is seen); Pressed N (Pressure Banes on its [Strike] Actions, at most 2); a Doomed or a Bane on the roll being made is impossible, because Chapter 2 says an Interrupt "can't change that roll".
- **Moves tokens:** Pushed, Pulled, Slid (Forced Movement: no movement Reactions, Collision 2 a square on objects, 1 each on creatures, Steadiness reduces it, Bloodied lowers Steadiness); Reposition (within your Reach, no Collision, never into a hazard); your own Advance or Evade (an Advance can trigger the enemy's Reactions, an Evade can't).

**It changes nothing in the current turn, only what comes later:**

- **On the enemy, for its next turn:** Slowed N (fewer AP regained; with the end-of-turn regain, to be reworded); Lingering (damage at the end of each of its turns); Sickened N (Banes on Body and Instinct Saves, no potions); Vulnerable N for 1 round (every ally's Actions against it gain N Boons: Demoralize's shape); Taunted or Daunted for 1 round (it also bends the rest of the current turn, above, and lasts through its next one).
- **On you or an ally:** a damage reduction (reductions add up; Guard takes what is left); Guard (keep the higher; it ends with the encounter); a Rally Point used or healing (Lay On Hands' kind); Quickened 1 on its next turn (Aid's shape); a Buff on its next roll or Action ("its next roll has 1 Boon", wasted if not made by the end of its next turn; Feint's shape); Favored on its next roll (counts as 5 Boons, cancels a Doomed); Empowered (1d6! on the first damage of each of its turns); +1 Defense (unnamed) or a named +1 Field / Support bonus (different names add up).
- **On the board:** perception (Point Out's step: Unsensed to Hidden), a mark (Judge's kind), light.

**Limits that apply to every one of them:** the target needs Line of Effect and must be perceived (Hidden is enough); you react once to the same Action; Interrupts resolve before Triggers; Boons and Banes with the same name add up to 2; 5 or more after cancelling become Favored or Doomed; Guard and Defense bonuses don't stack with themselves; Forced Movement and Reposition trigger no movement Reactions.

## Batch 1, the Paladin. Card 1: Shield of Faith (PROPOSED 2026-11-27, waiting for Lucas)

**Today's card** (Decision 6 of `cards/paladin-redesign.md`, 2026-11-14): 1R · Turn · [Divine, Focus] · 5 squares · Target: one ally. *Interrupt:* an enemy's [Strike] Action would damage the target. *Effect:* that damage is reduced by 1 + your Power Modifier, and the triggering creature is Taunted by you (1 round). Lucas kept the size, the [Strike]-only trigger, the Taunt and the name.

**What changed under it:** it now costs a real AP, and the hits grew. Playtest 11 had hits of 14 to 19 on a Tier 2 or 3, and the 3 it took off was "a rounding error". The Paladin's marginal AP on his own turn is his second or third Basic Attack: **Durgan 6.7 / 6.2, Aveline 8.8 / 8.0** (`research/action-economy.md` 4.1). The same research's verdict at today's size: "Shield of Faith leaves the table, unless it is repriced to about twice its size".

**How it is priced here [arithmetic]:** damage prevented against damage he would deal with that AP, both in damage (the research's method). The charter's point anchors (1 Health 12, a 1R Reaction 10 to 15 a turn) priced the free Reaction Point before the retune, so they aren't used. The hits it answers: the ones he chooses, so the bigger ones, about 12 to 19 (16 used below) [playtest 11, judgment].

**Every payload the rules offer** (the trigger kept: the damage is known when he chooses):

| # | Payload | Prevented on a 16 | With the Taunt | Against the AP (6.2 to 8.8) | Notes |
|---|---|---:|---:|---|---|
| A | reduced by 1 + Pow (today) | 2 to 3 | about 4 | **loses** | the playtests' rounding error |
| B | reduced by a bigger flat number (4 + Pow) | 5 to 6 | about 7 | about even | certain, but the number has to be re-set at every Stage |
| C | reduced by 2d6 + Pow (the 2026-11-12 card) | about 8 to 9, swinging 3 to 14 | about 10 | wins a little | one more roll on the GM's turn; it was cut for being too strong at the old numbers (66 points) |
| D | **the target takes half that damage** | 8 (9 to 10 on a 19, 4 on an 8) | about 9 | **wins a little, on the hits worth it** | no roll and no number to re-set: it grows with the enemies; the player sees the hit and decides |
| E | Guard before the damage | as B or C | | | what is left lingers on the ally; that is Bulwark of Faith's payload, its sibling |
| F | the Paladin takes the hit, or part of it | | | | rejected: the brief says he "can't take hits for you"; Bear the Blow (a Talent) does this |
| G | the ally heals or uses a Rally Point after the hit | | | | rejected: Lay On Hands and Divine Intervention's place |
| H | a Bane or +Defense against the attack | about 1 to 2 (2 Banes are 12 to 16% of a hit) | | **loses** | an Interrupt on "would damage" can't change the roll; it would need the earlier moment "a Strike is made against an ally" (Foundry has it: `strikeAgainst`) and it is still too small |

**Every rider (at most one):**

| Rider | What it does | Worth | Notes |
|---|---|---|---|
| **Taunted by you (1 round)** (today) | the attacker's Actions against anyone else take 1 Bane, for the rest of its turn and its next | about 1 to 2 (6 to 8% of each later attack on an ally), more if it turns on him (AD 14) | the brief's "they stay in front"; no token moves, nothing stops |
| The Paladin loads his burst (Empowered, or a Smite die waiting) | protecting feeds the nova (Nimble's Radiant Judgment, `frontline-protection.md`) | about 3 to 5 later | a second thing to track; Smite already has its own extra die |
| The attacker takes [R] Pow Holy | a punishment | about 2 | the brief's "not a consistent damage dealer"; it is Rebuke's job to punish |
| The attacker becomes Judged by you | moves the mark for free | about 1 AP once | changes Judge's own price (re-marking costs 1 AP) |
| Vulnerable 1 on the attacker (1 round) | allies gain 1 Boon against it | about 0.5 to 1 per attack | small |
| The ally gains a Boon on their next roll | support | about 0.5 | small |
| Daunted of you (1 round) | Banes on all its rolls, and Difficult Terrain toward him | about 1 to 2 | pushes it away from him: the wrong direction for "stay in front" |
| Slide the ally 1, or Pull the attacker to you | a token moves on the enemy's turn | | rejected: what Lucas called disrupting; Bulwark's Slide is decided with Bulwark |
| None | | 0 | the shortest card |

**Claude's proposal: D with Taunted.**

> **Shield of Faith** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand, and a pane of light turns part of the blow aside and pulls your foe's eye to you.*
> **Interrupt:** An enemy's [Strike] Action would damage the target.
> **Distance:** 5 sq. · **Target:** One ally
> **Effect:** The target takes half of that damage, and the triggering creature is Taunted by you (1 round).

```
Half of a 16 hit prevented ...................... 8       [arithmetic; 9 to 10 on a 19]
Taunted by you (1 round) ........................ 1 to 2  [arithmetic: 1 Bane, 6 to 8% of its later attacks on others]
--- About 9 to 10 a use, against his AP's 6.2 to 8.8: a little over, on the hits he picks.
    On a small hit (8) it is about 5: under the AP, so he keeps the AP for his turn. That is the decision.
```

**Analysis.**
- **The decision it gives:** every enemy [Strike] on an ally within 5 squares asks "is this one worth a blow on my next turn?" He sees the number before he answers. A Critical for 25 on the Bloodied Archer: yes. A goblin's 6: no. This is the "should I use this or that?" moment the economy research found missing.
- **It grows by itself:** half of a level 1 hit, half of a level 10 hit. No Stage dice, no number to re-set.
- **The enemy's answer:** Taunted, its next Actions against anyone but him take a Bane until its next turn ends. Hit the Paladin (AD 14), or hit his ally worse.
- **The rules it touches, one new sentence:** where "takes half" sits among Resistance, reductions and Guard. **Claude's proposal for Chapter 4's Guard list:** halving comes after Resistance and Weakness and before damage reductions and Guard (Chapter 1's Halving rule already halves each subtype on its own and rounds the half taken up). The Collision rule for "would damage" Reactions applies as it does today (the Action's damage or its Collision, chosen then). A Lingering the Strike adds isn't halved: it is its own damage later.
- **Siblings:** Bulwark of Faith (Guard of a Rally Point, once an encounter) is the big version. Bear the Blow (the Talent) splits the hit between the Paladin and the ally. Only one of them can answer one Action, as today. **Armor of Faith** (a Paladin Escalation Passive: when you use a [Divine] Reaction, not Judge's 0R, you gain Guard 1 + Pow) now rides on Reactions that cost a real AP: it is re-checked with step 9 of the order (the cards that lean on the old Reaction economy).
- **Rebuke is the other Hallmark Reaction:** a stop on movement, where this is protection. That is still a style choice between protecting and holding the line. Card 2 decides Rebuke.
- **Complexity:** one Version, 19 words (as today), no roll, one condition.
- **Table feel:** "the Paladin halves it, and the ogre is Taunted": one word, said once the GM has rolled the damage.

**For Lucas to choose:** the payload (D, half; B, a bigger flat number; C, 2d6 + Pow; or keep A) and the rider (Taunted; the loaded burst; none).

**Lucas's question (2026-11-27):** "Is reducing damage like this really the way forward? Health is the center point of 2d12, wont Paladin feel the necessity to always reduce it? [...] Is dealing damage within the lines of reducing damage? Because anyone can deal damage, but who can actually 'heal'/prevent damage?"

**Claude's answer, in short:** prevention and damage aren't the same coin. Damage is replaceable (anyone deals it). Prevention saves the day's resource: Steel Yourself already buys about 12 Health for 1 AP, but it spends a Rally Point, and Shield of Faith spends none. It also prevents Downs, and a hit's last points are worth more than its first. So the 1-for-1 pricing above undervalues it. That supports his worry: uncapped and Turn, D halves every big hit on every enemy turn, and the Paladin plays on other people's turns. The proposal changes to **D at the Round Frequency** (once a round, for the hit that matters), or D with a condition (the hit would leave the ally Bloodied or Down). Waiting for Lucas.
