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

**After the research (`research/reactions.md`, 2026-11-27), the options for Lucas:**

- **A. Half, Round Frequency:** once a round, any enemy's [Strike] on an ally within 5. Draw Steel's Parry without the move.
- **B. Half, only against the creature you Judged** (Claude's proposal now): *Interrupt:* the creature you Judged would damage an ally with a [Strike] Action. *Effect:* the ally takes half of that damage, and it is Taunted by you (1 round). Judge is one creature, so at the Turn Frequency it fires at most once a round with no new word. It is a payoff for a choice made on his own turn (Judge, 1 AP to move it), the pattern of 4e's Divine Challenge, Draw Steel's Judgment and Pathfinder 2e's Raise a Shield. And the enemy decides whether to give it a target: hit the Paladin, or have the hit on his ally halved. The other enemies' hits are not his to answer (the Paladin's protection is aimed, not general). The charter's "the two Hallmark Reactions share a trigger" could then key Rebuke to the Judged creature too.
- **C. Half, Encounter:** once a fight, as 13th Age and 4e. It never feels mandatory, and it is rare for the class's Hallmark Reaction.
- **D. Split the hit with the Paladin** (13th Age's Bastion): it limits itself through his Health, but the brief says he "can't take hits for you", and Bear the Blow is this.
- **E. Half, chosen before the roll** (DC20's rule: "a Strike is made against an ally", Foundry's `strikeAgainst`): a gamble that sometimes lands on a miss.

**Lucas's answer (2026-11-27): "B is good."** Shield of Faith answers only the creature the Paladin Judged: *Interrupt:* the creature you Judged would damage an ally within 5 squares of you with a [Strike] Action. *Effect:* the ally takes half of that damage, and the creature is Taunted by you (1 round). 1R · Turn · [Divine, Focus]. Two rule lines go with it at the build: halving's place in the damage order (after Resistance and Weakness, before reductions and Guard: Claude's proposal, not yet confirmed), and whether Rebuke keys to the Judged creature too (card 2). Not built.

**Lucas, revising (2026-11-27): "Lets make it more broad, and less strong. Could be turn, not about reducing damage."** So B's narrow trigger goes: the card answers any enemy's [Strike] on an ally within 5, at the Turn Frequency, and its payload is no longer a cut to the damage.

**What protects without touching the damage** (the toolbox): a Defense bonus or Banes on the Strike, both before the roll; Taunted; a Boon for the ally afterwards; Guard (a damage buffer, so out by his words); moving the ally (out: disruption).

**The moment it needs:** before the roll. An Interrupt on "would damage" comes after the roll and "can't change that roll" (Chapter 2), so a Defense bonus needs the moment "an enemy makes a [Strike] Action against the target". Foundry already has it (`strikeAgainst`, "A Strike is made against an ally within N"). The book doesn't define it yet. **The rule to write (Claude's proposal):** an Interrupt on an Action made against a creature happens once the Action and its targets are declared, before its roll. That also makes it a choice under uncertainty (DC20's rule: "you must decide to use the Maneuver before the GM says the result"): some uses land on a Strike that would have missed. That is the brake his "less strong" asks for.

**Its size, priced [arithmetic]:** on 2d12, each point of Defense moves about 7 to 8% of the rolls across each of the two Tier lines (the Tier gap is 7, DC to DC + 6). On a Strike whose Tiers are about 3 / 10 / 17, a point of Defense is worth about 1 damage. Taunted is about 1 to 2 (and more if the enemy turns on the Paladin). **What 1 AP is worth now has dropped:** with a repeated At-will [Strike] Doomed (decided), his last AP of a turn is a Doomed third attack (62 to 70% of 6 to 9: about 4 to 6) or a maneuver (1 to 2). So a Reaction of about 4 to 5 is an even trade for the AP it costs.

| Option | Payload | Worth a use | Notes |
|---|---|---:|---|
| **A** | **+1 + your Power Modifier to the target's Defense against that Strike (+2 or +3), and Taunted by you (1 round)** | about 3 to 5 | Claude's: a number tied to the Paladin's build, as today's card; a Defense needs no re-setting at later Stages (2d12 grows horizontally) |
| B | Taunted alone, applied before the roll (that Strike takes Taunted's 1 Bane) | about 2 to 3 | the shortest; under the AP |
| C | 2 Pressure Banes on that Strike, and Taunted | about 3 to 4 | the same as +2 Defense, but Pressure Banes share a limit of 2 with other effects |
| D | after the Strike, the ally gains 1 Boon on their next roll against the attacker | about 1 | support, too small |

**Claude's proposal, A:**

> **Shield of Faith** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand, and a pane of light turns the blow aside and pulls your foe's eye to you.*
> **Interrupt:** An enemy makes a [Strike] Action against the target.
> **Distance:** 5 sq. · **Target:** One ally
> **Effect:** The target gains +1 + your Power Modifier to its Defense against that Strike, and the triggering creature is Taunted by you (1 round).

**Analysis.** Broad: any enemy, any ally within 5, once on each creature's turn. Less strong than the half: about the Paladin's last AP, not more. It isn't a reflex because he decides before the roll (a miss would have missed anyway) and because each use costs a blow of his next turn. It makes a Tier 3 into a Tier 2 or a Tier 2 into a miss about a sixth of the time each, so the table sees it as "that one missed because of the Paladin". The Taunt is the deterrent of the research (4e's mark, Draw Steel's Judgment). Judge no longer appears in it, so Rebuke's trigger is free again. Rules it touches: the new moment (above); "+N Defense" is Chapter 2's ("raises every Defense"), unnamed, so it doesn't add to another unnamed bonus. Complexity: one Version, about 25 words, no roll of its own.

**For Lucas to choose:** A (and +1 + Pow, or a flat +2), B, C or D.

**Lucas, 2026-11-27: "SoF is good."** Shield of Faith is settled as above (B).

## Batch 1, card 2: Rebuke (PROPOSED 2026-11-27, waiting for Lucas)

**Lucas's direction:** "Lets make Rebuke more broad, and less strong. Could be turn, not about reducing damage."

**Today's card (stage0):** 1R · Turn · [Power, Save, Divine] · 3 squares · one enemy. *Trigger:* the target moves away from you. *Effect:* Hindered (EoT). *Save* (Appeal): on a Tier 1 or 2, its Move Action is disrupted. It is the strongest stop the Paladin has, it rolls a Save on the GM's turn, and its disrupted move sends a token back: two of the things Lucas named.

**Broad means:** any enemy, a common moment. **Less strong means:** under the Shield's 9 to 10 a use, and nothing that stops or moves. **The charter** asks that the two Hallmark Reactions "share a trigger and a payload where they can, and differ by the rider" (`class-charter.md`). Shield of Faith answers the Judged creature's hit on an ally, so the shared moment is **an enemy damages an ally**: the Shield narrow and before the damage, Rebuke broad and after it. One prevents, aimed; the other punishes, for anyone.

**Every trigger the rules offer:**

| Trigger | How often | Notes |
|---|---|---|
| **An enemy within 5 squares of you damages an ally** (a Trigger: after the damage) | most enemy turns | shares the Shield's moment; leaves the enemy's turn whole; the hit has landed, so it never reduces it |
| An enemy within 5 squares moves closer to an ally | most enemy turns | the "stay in front" moment; a payload here lands during the move (Hindered halves what is left) |
| The target moves away from you (today) | about half the rounds (`ruler/reactions.md`: 48 to 61%) | a front-line moment; 3 squares |
| An enemy makes a [Strike] against an ally (before the roll) | most enemy turns | Foundry's `strikeAgainst`; a payload can't change the roll (Chapter 2) |
| An enemy ends its turn within 5 squares of you | every turn | lands when nothing is left to disrupt, but every enemy, every turn: the duty the Shield just escaped |

**Every payload (nothing that reduces the damage; at most one rider), priced against the Paladin's AP (6.2 to 8.8, `research/action-economy.md` 4.1):**

| Payload | What it does to the turn | Worth a use | Notes |
|---|---|---|---|
| **Slowed 1** | nothing now; it regains 1 AP less at the end of this turn, so its next turn is 3 AP | one of its AP: about 4 to 5 on a Standard (about 19 a turn), about 8 on the ogre (32), about 3 on a Minion | the enemy's turn is left whole; it prices itself: worth it on the big enemy, not on the goblin; Slowed doesn't stack, so a second Rebuke on the same enemy adds nothing |
| Hindered (EoT) | halves what is left of its movement now | 0 to one attack | today's half; it bends the turn in progress |
| Immobilized (EoT), Prone | ends the movement / Crawl only | up to an attack | a stop: what Lucas named |
| Dazed 1 | it loses 1 AP now | as Slowed, but now | takes from the turn in progress: an action it planned can fail mid-turn |
| [R] Holy damage (1d6! + Pow, about 5 to 6) | nothing | 5 to 6 | the 4e Divine Challenge's shape; the brief's "not a consistent damage dealer" |
| Pressed 1 (1 round) | its Strikes take 1 Pressure Bane | about 1.5 to 2 | small |
| Vulnerable 1 (1 round) | allies gain 1 Boon against it | about 2 to 4 over the party's attacks | support; small |
| Daunted of you (1 round) | Banes, and Difficult Terrain toward him | about 1 to 2 | pushes it off him |
| Taunted by you (1 round) | 1 Bane against anyone else | about 1 to 2 | the Shield's rider: the two would read the same |
| Judged by you | moves the mark (1 AP on his turn) | about 1 AP once | a tempting pairing with the Shield; it changes Judge's price |
| Pushed, Pulled, Slid; the Paladin moves | a token moves on the enemy's turn | | rejected: what Lucas named |

**Claude's proposal:**

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You call your foe's cruelty by its name, and the weight of it slows every step that follows.*
> **Trigger:** An enemy damages an ally within 5 squares of you.
> **Target:** The triggering creature
> **Effect:** The target is Slowed 1.

```
Slowed 1 on the triggering enemy ............ 4 to 5 on a Standard, about 8 on an Elite, about 3 on a Minion
                                               [arithmetic: one of its 4 AP, its turn's damage / 4]
--- Under the Shield (9 to 10) and under his own AP (6.2 to 8.8), except against the Elite.
    He Rebukes the ogre and lets the goblin go: the choice is the size of the enemy.
```

**Analysis.**
- **Broad:** any enemy, at the most common moment.
- **Less strong:** it never touches the hit or the turn in progress. It takes one AP from the enemy's next turn: the same trade the Paladin just made, AP for AP.
- **The decision it gives:** which enemy's next turn is worth one of his blows. An Elite's AP is worth more than his, a Minion's much less. And beside the Shield: Shield the Judged creature's hit, Rebuke everyone else's.
- **Disruption:** none in the turn it answers. The token doesn't move, nothing stops, and there is no roll on the GM's turn (today's Appeal Save goes).
- **The rules it touches:** Slowed is being reworded for the end-of-turn regain (step 9 of the order). The wording has to make Slowed 1 cost exactly one AP, once: "you regain 1 AP less the next time you regain AP; then it ends", or Rebuke would cost a creature two turns' AP. Rebuke writes no duration, and waits for that rule.
- **Siblings:** Shield of Faith (the same moment, before the damage, the Judged creature only). Judge (the mark). Bulwark of Faith (card 3).
- **Traits:** [Divine, Focus], as the Shield. [Power] and [Save] leave with the Save. Tireless Vigil's second Reaction Point "pays only for [Divine] Reactions": it covers both, and its rewording is step 9.
- **Complexity:** one Version, 13 words, no roll, one condition.
- **Table feel:** "the goblin's knife lands; the Paladin says 'Rebuke, it's Slowed'": said once the hit is applied, nothing undone.

**For Lucas to choose:** the trigger (an enemy damages an ally; moves closer to an ally; moves away from you) and the payload (Slowed 1; Holy damage; Hindered; Vulnerable 1; Pressed 1).

**Lucas, 2026-11-27: "The charters are starting to get on the way, lets set them aside for this session."** For the rest of this session's rebuild, `class-charter.md` doesn't bind the Reactions (its "two Hallmark Reactions share a trigger", the 35-point budget, the "half the rounds" target). The book's rules, the card Structure and Lucas's card-writing rules still apply. Rebuke's damage trigger now stands on its own reasons (broad, after the hit, leaves the turn whole), not on the charter's.

**Lucas's direction (2026-11-27):** "5 squares, moves closer to an ally, I want something more 'rebuke' like, like flashing a divine light, I think it could work some damage, maybe cause a bane on Strikes of the creature." So the trigger is decided (an enemy within 5 squares of you moves closer to an ally), and the payload is damage with a Bane on its Strikes. Slowed is dropped.

**The Bane is Pressed 1** (Chapter 8: "Your [Strike] Actions take that many Pressure Banes", at most 2 count): it is the condition that already says it, so no new wording. **Its duration, EoT:** given on the enemy's own turn it ends at the end of that turn (Chapter 2, End of Turn), so it covers exactly the Strikes it walked up to make. "1 round" would cover its next turn too.

**The damage has no roll to attack**, so it can't use [Mod] (Chapter 1: the Modifier of the roll). The Paladin's cards write such damage as exploding dice ([R] 1d4! / 1d6! / 1d8! Ho):

| Damage | Average | With Pressed 1 (EoT) | Against his AP (6.2 to 8.8) |
|---|---:|---:|---|
| [R] 1d4! Ho | 2.9 | about 4.5 | well under |
| **[R] 1d6! Ho** | 4.2 | **about 5.5 to 6** | **a little under: "less strong"** |
| [R] 1d8! Ho | 5.1 | about 6.5 to 7 | about even |

The Bane's worth: 6 to 8% of each Strike it makes this turn, about 1.5 to 2 on a Standard's two [arithmetic, `research/action-economy.md` 2.2].

**Claude's proposal:**

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand and a flash of holy light sears the foe that dares to pass you; its blows come slower through the glare.*
> **Trigger:** An enemy within 5 squares of you moves closer to an ally.
> **Target:** The triggering creature
> **Effect:** [R] 1d6! Ho, and the target is Pressed 1 (EoT).

**Analysis.**
- **Rebuke-like:** a flash and a burn on the one that walks past him, and its next blows weakened. It punishes the choice; it doesn't undo it.
- **Disruption:** the damage lands during the move (a Trigger: after the first square closer, at the square he chooses, Chapter 2), and the move goes on. The token doesn't move, nothing stops (unless the damage puts it Down), and there is no Save on the GM's turn. The Bane bends the rest of its turn, as asked.
- **Less strong:** about 5.5 to 6 a use, under the Shield's 9 to 10 and a little under his own AP. He uses it when an enemy goes for the back line, not on every step.
- **With the Shield:** Rebuke the enemy that walks to the Archer; Shield the Judged one's hit. Together on one enemy (it moves closer, then hits): about 15 for 2 AP.
- **The rules it touches:** Chapter 2's Moving Closer is written "closer to you"; the card needs "closer to an ally". **Claude's proposal:** reword it "closer to a creature" (to you, to an ally: whoever the card names), with the rest unchanged. Damage dealt in the middle of a Move Action is already Chapter 2's "At its moment".
- **Traits:** [Divine, Focus]. Its damage is [R] Holy, so a Profane rule or a Talent that keys on Holy damage reads it.
- **Complexity:** one Version, 14 words, one damage die, one condition.
- **Table feel:** "the orc runs for Sylwen; the Paladin flashes it: 4 Holy, and its swing takes a Bane."

**For Lucas to choose:** the die (1d4!, 1d6!, 1d8!) and Pressed's duration (EoT, or 1 round).

**Lucas (2026-11-27): "Lets change the trigger: 3 squares, when creature moves. Easier to understand, easier to trigger, straighforward."** The trigger is now **an enemy within 3 squares of you moves**.

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand and a flash of holy light sears the foe that moves against you; its blows come slower through the glare.*
> **Trigger:** An enemy within 3 squares of you moves.
> **Target:** The triggering creature
> **Effect:** [R] 1d6! Ho, and the target is Pressed 1 (EoT).

**What "moves" has to mean (the least ambiguity; Claude's proposal for Chapter 2, beside Moving Closer and Moving Away):** *a creature **moves within N squares of you** when, with its own Move Action, it leaves a square that is within N squares of you.* So:
- Walking up to him from 4 squares away fires it once it takes a step inside 3. Walking away fires on the first step. Stepping sideways inside 3 fires too.
- Standing up from Prone doesn't fire, because no square is left. Neither do Break Free, Evade, Forced Movement or Reposition (Chapter 2 already says these "don't trigger Reactions from movement").
- It fires once per Move Action, at the square he chooses along it (Chapter 2's single trigger for a Move Action).
- Foundry already has this moment (`enemyMoves`, "an enemy within N moves"): its range test is the squares the enemy leaves, which is this rule. It also fires on standing up, which this rule leaves out, so one line of `moment.mjs` changes at the build.

**What changes from the last draft:** it is easier to trigger (any step near him, not only toward an ally), and shorter to read. It no longer cares where the enemy goes, so it guards the Paladin's 3 squares, not the path to the back line: an enemy that walks around the 3 squares to reach the Archer pays nothing. It fires more often, but each use costs an AP, so he still chooses which enemy. The size is unchanged: about 5.5 to 6 a use, a little under his AP.

**Still open:** the die (1d6! proposed; 1d4! or 1d8!) and Pressed's duration (EoT proposed; 1 round).

**Lucas (2026-11-27), on the trigger:** "If the enemy is 4sq away, move into 3sq, should it really trigger? It didnt move inside the 3sq area." **No, and the rule already says so:** it leaves a square 4 away, so nothing fires. Only a step that *leaves* a square within 3 counts, which means moving inside the area: 4 to 3 doesn't fire; 4 to 3 to 2 fires at the second step; 3 to 4 (walking out) fires; 2 to 2 sideways fires. Claude's earlier line ("once it takes a step inside the 3 squares") meant that second step and read badly.

**Lucas, on the damage and the Bane:** "[R] 1d6! Holy damage is good, but Pressed 1 EoT might be too much; I think should be Pressed 1 until it makes a Strike Action (EoT)." So the Bane falls on its next [Strike] only. Chapter 2's "Until" already gives the reading: it lasts through that Strike and ends once it is resolved; the (EoT) ends it at the end of its turn if no Strike comes. Worth: 1 Bane on one Strike, about 0.8 to 1, so about 5 a use.

> **Rebuke** · Paladin Hallmark Reaction · 1R · Turn · [Divine, Focus]
> *You raise a hand and a flash of holy light sears the foe that moves against you; its next blow comes slower through the glare.*
> **Trigger:** An enemy within 3 squares of you moves.
> **Target:** The triggering creature
> **Effect:** [R] 1d6! Ho, and the target is Pressed 1 until it makes a [Strike] Action (EoT).

**DECIDED (Lucas, 2026-11-27), with the rule for "moves within N" (Chapter 2, at the build):** a creature moves within N squares of you when, with its own Move Action, it leaves a square that is within N squares of you. Not built.

**Lucas (2026-11-27): "Lets not work on level 2 yet, just level 1."** Bulwark of Faith (level 2) waits; the rebuild covers level 1 only for now.

**The Paladin's level 1 cards left that touch Reactions** (Claude's proposal: keep both as they are):
- **Judge's 0R** (Trigger: the creature you Judged goes Down; it Judges another). It costs no AP, moves nothing, stops nothing, and fires at most once per creature that falls. The new economy doesn't touch it. Keep.
- **Bear the Blow** (Durgan's playtest Talent, 0R, Turn: his adjacent Bound Ally's damage is split, half to him, and he gains 1 Guard). It is the "move the damage onto the protector" kind, which limits itself through his own Health (`research/reactions.md`, takeaway 3). It is a 0R, so the AP price doesn't reach it. It is a Talent, so its price is the Talents' pass (`talents-design.md`), not this rebuild. Keep, and flag it there.
- **Smite's extra die** costs 1 AP on his own turn instead of the Reaction Point (decided in `rules-backlog.md`). Nothing to decide here.
