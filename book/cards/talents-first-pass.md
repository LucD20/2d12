# Talents, the first pass: the card template and four test Talents

> **Status (2026-11-20): HISTORY (superseded by `talents-batch.md`, then set aside by T15). Kept for its audit and Lucas's review (section 8).**

> **Superseded for review on 2026-11-20 by `talents-batch.md`,** which holds every Talent still standing. This file is kept as history with its audit.

**2026-11-19.** Four Talents written to test the shape decided in `book/talents-design.md` (T1 to T13), in two groups, each with its ranks drafted so the size can be seen. **A test, not a Talent list. Nothing here is decided and nothing is in the book. Every number is a placeholder** [not priced]. Lucas's cards come a few at a time, with him: these are drafts for him to correct.

**Audit status.** The first version of the four was audited and corrected (section 7). **The branching ranks in sections 3 and 4 are new and not yet audited.** Stage 2 is not written in the game, so every Stage on a rank is a placeholder.

---

## How to read this file

Each Talent has the same five parts:

1. **At a glance:** its group, what it does in one line, how big it is.
2. **Rank I:** the card you get when you first take it.
3. **The tree:** every rank and branch on one picture.
4. **The branches:** a table, one row a branch, Rank II beside the Rank III that continues it.
5. **Notes:** what it lifts, what it borders, open points.

**Sizes at a glance:**

| Talent | Group | Ranks | Branches at Rank II | Picks to take all of one path |
|---|---|---|---|---|
| Opportunity Attack | Sentinel | I, II, III | 3 | 3 |
| Shoulder Through | Sentinel | I, II, III | 3 | 3 |
| Called Shot | Archery | I, II | 3 | 2 |
| Overwatch | Archery | I, II | 3 | 2 |

Two Talents run three ranks deep, two stop at Rank II (T13: as many ranks as it has something worth a pick to add).

---

## 1. The template

A Talent is written on the card Structure (`book/cards/card-structure.md`), with these differences.

- **Title bar:** **Talent · its group · Stage N** (or **Skill Talent**).
- **Prerequisite** (only when needed): what you must have to take it: a trait one of your cards carries, or a Stage. Never another Talent (T5). Not the Action's Requirements line, and not the Requires trait group.
- **Body:** an Action or Reaction card written whole by the Structure; or a rule that adds to Actions by their traits (never naming a class card: T9); or a lifted limit.
- **Ranks:** **Rank II** and **Rank III**, each a pick (T12), each worth a whole pick (T13), never a bigger number (T1, T4). **At a rank a card may offer up to three branches** (T11); the next rank continues the branch chosen. A rank says what it adds to ("the Interrupt also...", "a new Mode", "a new line"), and may write a minimum Stage. A sheet shows only the path taken.
- **Flavor** under the title (Claude writes it); **`automation`** on the card.

---

## 2. Opportunity Attack

**At a glance.** Sentinel. A Reaction that punishes an enemy for leaving you. Three ranks, three branches: the mage-hunter, the line-holder, the bodyguard.

**Rank I**

> **Opportunity Attack** · Talent · Sentinel · Stage 0
> *You were waiting for them to look away.*
> **Opportunity Attack** · 1R · Round · [Melee, Strike, Weapon]
> **Interrupt:** An enemy adjacent to you would leave a square during a Move Action, or would use the Stand Action.
> **Target:** The triggering creature.
> **Attack:** Weapon vs. Armor Defense
> You make a Weapon Attack (1A) against the target.

**The tree**

```
 Rank I                 [ Opportunity Attack ]   1R · Round
                                   │
            ┌──────────────────────┼──────────────────────┐
 Rank II    ▼                      ▼                      ▼
 (Stage 1)  [ Spellwatch ]         [ Hamstring ]          [ Bodyguard ]
            │                      │                      │
 Rank III   ▼                      ▼                      ▼
 (Stage 2)  [ Spellbreaker ]       [ Cripple ]            [ Interpose ]
```

**The branches**

| Branch | Rank II | Rank III |
|---|---|---|
| **The mage-hunter** | **Spellwatch:** the Interrupt also happens when an enemy adjacent to you would use a [Spell] Action. A [Subtle] casting isn't noticed, so it escapes | **Spellbreaker:** when the Weapon Attack of an Opportunity Attack triggered by a [Spell] Action gets a Critical, that [Spell] Action is disrupted |
| **The line-holder** | **Hamstring:** a new line: on a Tier 3, the triggering Move Action is disrupted; the target stays in the square it was leaving | **Cripple:** a new line: on a Tier 3, the target is also Prone |
| **The bodyguard** | **Bodyguard:** the Interrupt also happens when an enemy within your Reach would leave a square adjacent to one of your allies | **Interpose:** a new line: after the Weapon Attack, you can Evade 1 toward that ally |

**Notes**
- **No prerequisite:** every creature has Fists, a Melee weapon (Chapter 15).
- **Round, not At-will** (Lucas: made weaker so it competes, "C for sure").
- **Spellbreaker** is a second way to stop a casting, beside the counterspell Talent of magic decision 99.

---

## 3. Shoulder Through

**At a glance.** Sentinel. A faster way through the enemy's line during an Advance. Three ranks, three branches: the battering ram, the gap-maker, the charger. **The branches are new and not yet audited.**

**Rank I**

> **Shoulder Through** · Talent · Sentinel · Stage 0
> *You lower your shoulder and the line gives.*
> Once on your turn, during an Advance, you can move through one enemy's square as if it were an ordinary square. You can't end your movement there; if your movement is disrupted while you are in that square, it ends in the last square you left.

**The tree**

```
 Rank I                 [ Shoulder Through ]   once a turn, in an Advance
                                   │
            ┌──────────────────────┼──────────────────────┐
 Rank II    ▼                      ▼                      ▼
 (Stage 1)  [ Bowl Over ]          [ Make a Gap ]         [ Break the Line ]
            │                      │                      │
 Rank III   ▼                      ▼                      ▼
 (Stage 2)  [ Bull Rush ]          [ Hold the Gap ]       [ Breach ]
```

**The branches**

| Branch | Rank II | Rank III |
|---|---|---|
| **The battering ram** | **Bowl Over:** a new line: the enemy you moved through is Staggered (EoT) | **Bull Rush:** a new line: as you leave its square, you can push it: Pushed 1, in the direction you are moving |
| **The gap-maker** | **Make a Gap:** a new line: until the start of your next turn, your allies can move through that enemy's square as if it were an ordinary square | **Hold the Gap:** a new line: until the start of your next turn, that enemy can't use Reactions against an ally who moves through its square |
| **The charger** | **Break the Line:** you can use it during a Charge, and the enemy's square doesn't break the Charge's line | **Breach:** a new line: the Charge's Weapon Attack can target the enemy you moved through |

**Notes**
- **What it lifts:** Chapter 7's "passing through the squares of an unwilling creature is Difficult Terrain". Anyone can push through; this makes it faster (T2's permission test: better, never "you can").
- **Beside the Archer's Footwork (Weave),** which moves through unwilling creatures for 1 AP: this Talent is narrower (one enemy, once a turn) and free.
- **Hold the Gap borders Staggered:** it is Staggered aimed at one kind of target; worth an audit question.

---

## 4. Called Shot

**At a glance.** Archery. A slower shot aimed at a part of the body, each part its own effect. Two ranks; Rank II adds one of three new targets. **The branches are new and not yet audited.**

**Rank I**

> **Called Shot** · Talent · Archery · Stage 0
> *You stop aiming at the man and start aiming at his hand.*
> **Called Shot** · 2 AP · Round · [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Attack:** Weapon vs. Armor Defense
> Before the roll, choose a Mode.
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod]. **Tier 3:** [V] 1[W] + [Mod], and the Mode's effect.
> **The hand:** the target drops one object it holds in one hand (its choice); an object held in two hands isn't dropped.
> **The arm:** Pressed 1 (1 round).

**The tree**

```
 Rank I                 [ Called Shot ]   the hand · the arm
                                   │
            ┌──────────────────────┼──────────────────────┐
 Rank II    ▼                      ▼                      ▼
 (Stage 1)  [ The Throat ]         [ The Eye ]            [ The Heart ]
```

**The branches** (each adds a Mode)

| Branch | Rank II: a new Mode |
|---|---|
| **The silencer** | **The throat:** the target can't use [Incanted] Actions (EoT) |
| **The blinder** | **The eye:** Half-Blinded (EoT) |
| **The finisher** | **The heart:** if the target is Bloodied, its Tier 3 deals [V] 2[W] + [Mod] in place of 1[W] |

**Notes**
- **No Rank III:** nothing more worth a whole pick (T13).
- **The heart is a number** (more dice), which T1 and T4 forbid as a bare rank. It is drafted to show the line: **it should go or become a different effect.** A candidate in its place: **the knee:** the target can't Advance on its next turn (it can still Crawl, Stand, Evade).
- The leg (Hindered) was taken out in the audit: it was Trick Shots' Pin.

---

## 5. Overwatch

**At a glance.** Archery. Spend 1 AP on your turn to hold a shot for an enemy who comes too close. Two ranks; Rank II widens what you watch for. **The branches are new and not yet audited.**

**Rank I**

> **Overwatch** · Talent · Archery · Stage 0
> *You keep the arrow on the string and your eyes on the gap.*
> **Overwatch** · 1 AP · Round · [Projectile]
> You hold a shot: until the start of your next turn, you have the Reaction **Held Shot**.
> **Held Shot** · 0R · Round · [Projectile, Ranged, Strike, Weapon]
> **Interrupt:** An enemy within your weapon's normal range would enter a square adjacent to you or to an ally.
> **Target:** The triggering creature.
> **Attack:** Weapon vs. Armor Defense
> You make a Weapon Attack (1A) against the target.

**The tree**

```
 Rank I                 [ Overwatch ]   1 AP: hold a shot until your next turn
                                   │
            ┌──────────────────────┼──────────────────────┐
 Rank II    ▼                      ▼                      ▼
 (Stage 1)  [ Pin Down ]           [ Return Fire ]        [ Silencing Shot ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The warden** | **Pin Down:** a new line on Held Shot: on a Tier 3, the enemy's movement is disrupted; it stays in the square it was leaving |
| **The duelist** | **Return Fire:** Held Shot's Interrupt also happens when an enemy within your weapon's normal range would make a [Ranged, Strike] Action against you or an ally |
| **The mage-hunter** | **Silencing Shot:** Held Shot's Interrupt also happens when an enemy within your weapon's normal range would use a [Spell] Action |

**Notes**
- **Paid on your own turn (1 AP):** a choice against a Strike, never a free attack every round (the audit's must-have finding).
- **Pin Down and Hamstring** (Opportunity Attack) are the same effect in two groups: one melee, one ranged. Fine, or a sign one should change.
- **Silencing Shot and Spellwatch** give the mage-hunter a path in each group.

---

## 6. What the four test

| What the template must hold | Where |
|---|---|
| A Reaction with branching ranks three deep | Opportunity Attack |
| A rule on a Basic Action that lifts a base limit, with branches | Shoulder Through |
| An Action with Modes; ranks that add a Mode; a Talent with no Rank III | Called Shot |
| An Action that grants a Reaction until your next turn (an inline Action) | Overwatch |
| Talents that reach magic (stopping a casting; a Mode against [Incanted]) | Opportunity Attack, Called Shot, Overwatch |
| **A branch that breaks a rule, drafted on purpose to show the line** | Called Shot, the heart |

---

## 7. The audit of the first version: what the independent reader changed


| Talent | Finding | Now |
|---|---|---|
| **Overwatch** | **Its trigger ("ends a Move Action") is the very moment Chapter 2 forbids** ("'ends a Move Action' is not one"); "used no Strike on your last turn" is undefined and tracked across turns; Rank II only widened the range (a bigger number); the base was a step to a must-have Rank III (a free attack nearly every round) | A 1 AP Action that holds a shot until your next turn, with a moment Chapter 2 lists; two ranks; the attack costs a turn's AP |
| **Shoulder Through** | Rank II had no origin for its Strike (unlimited melee reach); Rank III (Prone on a Save, every Advance, no AP) dominated Trip; overlap with Footwork's Weave; a disrupted movement could end in an enemy's square; "each of your Advances" unclear | Once a turn; the disrupted case written; Rank II Staggered; Rank III in a Charge |
| **Opportunity Attack** | "Requires: a [Melee] weapon" gated nothing (everyone has Fists) and wrote a property as a trait; Rank II should say "would use" (Chapter 2's wording); [Subtle] not addressed; Rank III's Critical belongs to the Weapon Attack; the note cited decision 85 where 99 is meant; likely the obvious pick | Prerequisite removed; wording fixed; the must-have question put to Lucas |
| **Called Shot** | No Attack or Distance line (the Structure: a Strike always writes its Defense); Modes not written as blocks; Rank III (the rider on Tier 2) was a better rate; the leg duplicated Trick Shots' Pin; "drops one object" unclear | Written whole; the leg replaced by the arm (Pressed); ranks add Modes (the throat, the eye) |
| **The template** | "Requires" meant three things (a trait group, a Requirements line, a prerequisite); no way to write Modes; ranks didn't say what they add to; no `automation` | "Prerequisite"; Modes by the Structure; "a rank says what it adds to"; `automation` named |

**Not yet checked:** the rulebook has no [Spell] trait in Chapter 7 yet (magic is not written), and [Incanted] is decided but not written.

---

## 8. Lucas's review of the branches (2026-11-20)

**Opportunity Attack**
- "Shouldn't it be in Threatened squares, not adjacent, so Long weapons can work well?" (Chapter 3: a creature threatens every enemy within the normal range of a Melee weapon.)
- **Spellbreaker:** "A Disrupt is a big deal, but a crit only triggers what, 4% of the time? This Rank is far below any other pick I would say. It needs to be inside another Rank." (Measured: a Critical is about 3 to 5% of attacks at Modifier +1 to +3 against Defense 13 to 15.)
- **Hamstring:** "How often does a Tier 3 trigger again? We don't want a Disruptive Stance (Pf2e) situation. I have run into this problem so many times, of people shutting down enemy bosses." (Measured: a Tier 3 is about 17 to 32% of attacks at those numbers.)
- **Bodyguard:** "This trigger does almost nothing." **Interpose:** "way too weak."

**Shoulder Through**
- "By itself, it's too weak. Ignoring a single difficult terrain by creatures isn't a huge deal, especially if it only applies to Advance."
- **Bowl Over:** "Too strong. You stop all Reactions of a creature just by moving."
- **Break the Line:** "I think this should be the main Talent." **Bull Rush:** "Interesting concept." **Hold the Gap:** "Too situational." **Breach:** "Confusing. You make two attacks? If not, what is the point of this rank?"

**Called Shot**
- "Interesting but can be problematic: Disarm on a T3 early on is too strong I feel like." "The branches are good."

**Overwatch**
- **Pin Down:** "It can be strong, need playtesting. How often is a T3?" "Others seem good."

**His next step:** "Make a quick research of the most used feats, talents, etc used in other systems [...] From there, we can build some of the most famous ones, the ones we can expect people to look at first." Research: `research/raw/2026-11-20-famous-picks.md` (running).

**How often each result comes up** (Claude's computation, a Weapon Attack, 2d12 exploding, Doubles counted):

| Modifier | Against | Success | Tier 3 | Critical |
|---|---|---|---|---|
| +1 | 13 | 65% | 23% | 3.4% |
| +2 | 13 | 72% | 27% | 4.5% |
| +3 | 13 | 78% | 32% | 5.0% |
| +1 | 15 | 51% | 17% | 2.1% |
| +2 | 15 | 58% | 19% | 3.0% |
| +3 | 15 | 65% | 23% | 3.4% |
