<!-- doc: bestiary -->
# Bestiary: Building NPCs

You build an NPC by picking a **rank** (how much it counts for in a fight) and a **rating** for each of its numbers; a **role** (what it does in the fight) is a ready set of ratings to start from. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

Each rank has a **Combat Value (CV)**: what one NPC of the rank counts for in an encounter. It is lower for an NPC of an earlier [[Stages|Stage]] than the party (see [[Building an encounter]]). A typical fight is **4 PCs against enemies with a total CV of 400** (CV 100 per PC). At Stage 0 it lasts about **3½ rounds** and costs the party about **a quarter of its Health**, counting the Rally Points it spends during the fight (about a tenth is still missing when it ends); a PC goes Down in about one such fight in ten. A level 1 PC built to deal damage deals about 21 to 35 a turn to one creature (one built to heal, about half), and has 29 to 35 Health.

| Rank | CV | AP a turn | Takes about | Deals about at Stage 0 (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | 25 | **3** | one or two PC hits | 4 |
| **Grunt** | 50 | **3** | 1 PC turn | 5 |
| **Standard** | 100 | 4 | 2 to 3 PC turns | 9 |
| **Elite** | 200 | 4 | 5 PC turns | 13 |

"Deals about" is a whole turn: the Basic attack and the Special Actions it can fit after moving, against an average Defense, before anything the PCs do about it (Guard, blocks, damage reduction take about half of it away). A turn in which it doesn't need to move deals about a quarter more. It is what you check a new NPC's Actions against.

**Minions and Grunts have 3 AP a turn**, not 4: simple creatures that move and strike. Every NPC also gains the Reaction AP, as a PC does (see [[Action Points]]), **except Minions, which have none**.

**Minions share turns.** Up to **3 Minions** can act in the same turn slot, one after another: the GM rolls Initiative once for the group. Each still has its own turn (its own AP, its own start and end of turn).

### Minor enemies

**Minor enemies** are Minions and Grunts: the ranks with a CV below 100. Both have 3 AP a turn.

## Ratings

Each rank has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the rank's normal value; the others go down or up from it. Minions have no Extreme. The Health and damage tables are written by **[[Stages|Stage]]**: an NPC uses the tables of its level's Stage, and nothing changes inside a Stage. Attributes, Defenses and Modifiers don't change with the Stage. **The tables below are Stage 0's (levels 1 to 3).**

- **Attributes**: by default one **High**, two **Medium** and one **Low**.
- **Health**: a rating for its **Vigor** and one for its **Resolve**, Medium by default. A brute might have High Vigor and Low Resolve; a ghost, Terrible Vigor and High Resolve.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (see Defenses below).
- **Modifiers**: a rating for the **Weapon Modifier** and one for the **Power Modifier** (see Attributes and Modifiers below).
- **Damage**: a rating for its Basic attack and one for each Special Action (Medium by default).

**The ratings are guidance, not a rule: choose any rating for any number, or a number between two ratings.**

**Health and damage must balance, or the CV changes.** Count the steps the NPC's Vigor, Resolve and damage ratings sit above Medium, minus the steps below it (a step on Vigor or on Resolve alone is half a step; use the rating of its Basic attack and Specials together). At zero, the NPC is worth its rank's CV. For each step left over, its CV goes up or down:

| Rank | Minion | Grunt | Standard | Elite |
|---|---|---|---|---|
| **CV for each step** | 5 | 10 | 15 | 30 |

A Standard with High Health and High damage counts for 130; one with Low Health and Medium damage for 85. **Defense steps are free** (a point of Defense is the mildest rating), and a Modifier step counts as half a step. So a High in Health pays for a Low in damage, but a High Armor Defense pays for nothing.

> [!tbd]
> Only Stage 0's tables are written. The tables of Stages 1, 2 and 3 come with those Stages.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its rank's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (14) and a Low Ward Defense (12). A Defense is never below 11. An NPC's Defenses come from these ratings only.

**A Defense rating is a small step.** One rating is 1 point of Defense, which takes about 5% off what the PCs deal in a turn (a fight about a fifth of a round longer); a rating of Health or damage is 20 to 25%. Defense is the mildest of the ratings, which is why it doesn't change the CV.

### What an Action attacks, rolls and damages

Every NPC Action that attacks makes **three separate choices**:

1. **The Defense it attacks:** Armor Defense or Ward Defense.
2. **The Modifier it rolls:** the Weapon Modifier (a Weapon Action) or the Power Modifier (a Power Action).
3. **The pool it damages:** [V] (Vigor) or [R] (Resolve).

Two sets are the usual ones: **a Weapon Action Vs. AD that deals [V]**, and **a Power Action Vs. WD that deals [R]**. They are the default, not a limit: a Power Action can burn Vigor, a Power Action can strike Armor Defense, and in rare cases a Weapon Action strikes Ward Defense. Write on the Action whatever is not the usual set.

The damage tables are the same whatever the three are: a PC's Ward Defense is 12 or 13 at Stage 0, close to its Armor Defense, so an attack on it hits about as often. What changes most is the pool: Resolve is most PCs' low pool, so a creature that deals [R] makes them Strained early (see [[Bloodied]] and [[Strained]]). Some creatures deal **only** [R] (a ghost, a nightmare, a wisp of dread); about one NPC in four should, so the PCs' Resolve and everything that cares about Strained get their share of the fights.

## Attributes and Modifiers

Assign the Attributes to **Body, Mind, Appeal and Instinct**. Its Vs. Attributes are 12 + the Attribute, as for anyone.

An NPC's **Weapon Modifier** and **Power Modifier** are each a rating of its rank's table. They don't come from its Attributes and don't grow with its Stage (its Health and damage tables do). **An NPC's Modifier is for its rolls only: its damage is written whole in the tables, with nothing to add.** By default the Weapon Modifier is **Medium** and the Power Modifier **Low** (a Standard's is Medium too); a creature that attacks Ward Defense usually swaps them. A Modifier is never above +4.

| Rank | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Minion** | +0 | +1 | +2 | +3 | — |
| **Grunt** | +0 | +1 | +2 | +3 | +4 |
| **Standard** | +0 | +1 | +2 | +3 | +4 |
| **Elite** | +1 | +2 | +3 | +4 | +4 |

## Health

An NPC's **Vigor** and **Resolve** are each a ready number: pick a rating for each in its rank's Health table. Its **Health Pool** is the two added together. Nothing is calculated, and its Attributes don't change its Health. (A PC's Health is in [[Health Pool]].)

Bloodied, Strained and going Down work as usual (see [[NPCs Going Down]]). **A Minion has no Dying: at 0 it dies, or falls Unconscious if the GM prefers.**

## Speed

Speed is **free**: every NPC has Speed 5 unless it says otherwise. But it is strong, so it should be balanced with the rest of the creature:

- **A fast creature** (Speed 6 or more, or one that flies) chooses its fights: it reaches the back line, gets out of reach, and makes the PCs come to it. Give it a downside: Low Health, Low Armor Defense, or a Low Basic attack.
- **A slow creature** (Speed 4 or less) is easy to avoid and to keep away. Give it an upside: High Health, a High Basic attack, or Reach.

## Steadiness

An NPC has Steadiness 0 unless it says otherwise. A big or heavy creature can have 1 or more (see [[Steadiness]] in Chapter 3).

## Actions

### The Basic attack

Every NPC has one **Basic attack**: its main attack, 1 AP, At-will: usually a Weapon Action Vs. AD that deals [V], or a Power Action Vs. WD that deals [R] (see [[What an Action attacks, rolls and damages]]). Its damage is its rank's, by rating: the rank's damage table gives it for Tier 2 and Tier 3 as **a flat number plus at most one small die**, ready to use. Tier 1 deals nothing, like a Weapon Attack. The weapon in its hands is only what the attack looks like.

**NPCs have no Weapon Attack.** Their Basic attack takes its place: when an Action or rule calls for a Weapon Attack (the Weapon Attack (1A) at the end of a Charge, for example), an NPC uses its Basic attack.

### Ranged attacks

An attack an NPC can make from more than 2 squares away **pays one step of damage rating for its range**: a Medium ranged Basic attack deals the Low row's damage. A creature that attacks from safety is worth more than its numbers (at full damage, four ranged Standards are a hard fight, not a normal one). Reach doesn't count as range.

### Special Actions

Special Actions make an NPC interesting. **Every rank has them, Minions included.** There are three sizes, each with its own row in the rank's damage table:

| AP | Frequency | Damage (of the Basic attack's) |
|---|---|---|
| 1 AP | Round | about × 1.4 |
| 2 AP | Round | about × 2.2 |
| 3 AP | Encounter | about × 3.5 |

Minions have at most 2 AP Special Actions. A Grunt's 3 AP Special is its whole turn. **The Specials are part of the rank's turn**: an NPC spends what it has left after moving on its best Special, then on Basic attacks, and the tables are fitted with it doing so every round (a Standard's Round Special every round, an Elite's Encounter Special in its first).

- **Area Save Actions** (a Save the targets roll, DC 11 + the Modifier): about **half** the row's damage, to each creature in the area.

### Conditions

A condition is worth **steps of rating**: **Mild 1, Moderate 2, Severe 3**. An Action with a condition lowers its damage rating by that many steps: a **Low** attack with a **Moderate** condition is as strong as a **High** attack. An Action with no damage counts as one step below Terrible.

| Severity | Examples |
|---|---|
| **Mild** | Hindered (EoT); 1 Pressure Bane on its next roll; Pushed, Pulled or Slid (any distance); Bright light on it (it can't hide); Taunted (1 round); Sickened 1; Bleed 1 or 2; Staggered (EoT) on a creature with no Reaction |
| **Moderate** | Vulnerable 1 (EoT); Immobilized (EoT); Immobilized until it escapes; Enfeebled 1; Dazed 1; Grabbed; Bleed 1d4 to 1d6; Frightened (EoT) of a creature it can already reach; Staggered (EoT) on a creature with a Reaction worth an AP |
| **Severe** | Prone; Slowed 1; Vulnerable 2 (EoT); Doomed on its next roll; Blinded (EoT); Frightened (EoT) of a creature it must still approach |

**Slowed 2**, **Dazed 2** and **Bleed 2d6** are one step beyond Severe (4 steps). The measure behind the new rows (pack R-classes, 2026-11-04): a Bane is about 10% of an attack and Doomed about half of it; Dazed 1 takes a quarter of a Standard's turn (about 3 DE), Frightened's Bane alone is Mild and its movement restriction the real cost, a Bleed deals about twice its value over the rest of a fight or costs 1 AP to staunch (priced on a Standard: Bleed 1d4 4.8 DE, Bleed 2d6 13.7; Dazed 1 2.4, Blinded 6.7, Frightened's Bane 1.4, Taunted 0.8: prices.md section 5). Conditions that cost AP (Prone, Slowed) are the strongest; conditions that only move a creature are the weakest. A condition that lasts longer than EoT, or that a Save can't shake off, is one step more severe, unless the table already lists that duration. A condition on Tier 3 only costs one step less.

### Reactions

- **No NPC has a Reaction by default**: an NPC has the Reactions its entry gives it (see [[Reactions]]).
- **Minions and Grunts** normally have none.
- **Standards and Elites** may have one or more.
- An NPC pays for a Reaction as a PC does: with its Reaction AP or the AP it kept from its turn (see [[Reactions]]).
- **A Reaction that doesn't disrupt the triggering Action** (a Trigger, after it) should be **one rating stronger** than an Action of the same AP: it only happens when its trigger does.
- **A Reaction that disrupts it** (an Interrupt that can stop the Action) is worth the same as an Action of the same AP: stopping the Action is its strength.

### Elite Escalation

An **Elite** has Escalation (the NPC sheet's switch); no other NPC does. It follows the same ladder as a PC's, from **1 to 6** (see [[Escalation]]), with the Elite's own rules:

- **Start and rounds:** an Elite starts every encounter at **Escalation 1** and gains 1 at the start of each round after the first, up to 6. It has no Momentum and no Critical hook.
- **Phases:** when an Elite **becomes Bloodied**, and when it **becomes Strained**, its Escalation increases by 1 (once each). The GM says so when it happens: the players always see an Elite change.
- **What its Escalation does**, unless the Elite's entry says otherwise:

| Escalation | The Elite... |
|---|---|
| **2** | has **1 Boon** on its first attack each round. |
| **4** | can use its **Round Special Action twice** a round. |
| **6** | gets its **Encounter Special Action back**, once. |

- An Elite can also have Actions with an **Escalation** line (Rally the Tribe below): it can use them while its Escalation is at least that number, and they spend nothing.

With its Escalation, an Elite is worth its CV: two Elites cost the party what four Standards do, and three what six do. The phases are there to be seen, and they bring its later abilities a round sooner.

> [!tbd]
> An Elite's own steps of Escalation (what each Elite gains, and at which numbers) come later; until then every Elite uses the table above.

## Roles

A **role** says what a creature does in a fight. It is a ready set of ratings and habits for a rank's tables, to build an NPC quickly and to tell the GM how to play it. A role is a suggestion: it has no rules of its own, and an NPC needs none.

| Role | It... | Ratings to start from |
|---|---|---|
| **Brute** | walks in and hits hard | High Vigor, High Basic attack, Low Armor Defense |
| **Soldier** | holds a line and protects its allies | High Armor Defense, Medium damage, a Reaction that protects an ally or punishes leaving |
| **Skirmisher** | moves, strikes and gets away | Speed 6 or 7, Low Health, a Special with a movement in it |
| **Artillery** | attacks from far away | a ranged Basic attack and Specials (each pays its step of damage for the range), Low Health, Low Armor Defense |
| **Controller** | changes the fight with conditions and areas | Low damage with Moderate or Severe conditions, Area Save Actions, often Power Actions Vs. WD |
| **Leader** | makes its allies better; one in a fight | Medium everything, a Special that helps its allies (Boons, movement, an extra attack) |

> [!tbd]
> The roles are a first list. Their ratings are not measured yet, and a ranged or a fast creature is not priced in its CV: the four ranks are made to work first.

## The ranks

The Health and damage tables are **Stage 0's** (levels 1 to 3).

### Minions

3 AP a turn, no Reaction AP. Up to 3 Minions act in the same turn slot.

**Attributes**

| | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Every Stage** | -2 | -1 | +0 | +1 |

**Health: Vigor or Resolve**

| | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 0** | 3 | 5 | 6 | 7 |

**Defense (Armor Defense or Ward Defense)**

| | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Every Stage** | 11 | 11 | 12 | 13 |

**Damage at Stage 0: Tier 2 / Tier 3**

| | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Basic attack** (1 AP, At-will) | 1 / 2 | 1 / 1d4 | 2 / 1 + 1d4 | 1d4 / 2 + 1d4 |
| **Special, 1 AP** (Round) | 1 / 1d4 | 2 / 1 + 1d4 | 1d4 / 2 + 1d4 | 1 + 1d4 / 3 + 1d4 |
| **Special, 2 AP** (Round) | 2 / 2 + 1d4 | 1d4 / 2 + 1d6 | 1 + 1d4 / 3 + 1d6 | 2 + 1d4 / 5 + 1d6 |

With both ratings Medium, a Stage 0 minion has **12 Health** (6 + 6).

### Grunts

3 AP a turn.

**Attributes**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | -2 | -1 | +0 | +1 | +2 |

**Health: Vigor or Resolve**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 0** | 7 | 10 | 13 | 16 | 19 |

**Defense (Armor Defense or Ward Defense)**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Damage at Stage 0: Tier 2 / Tier 3**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Basic attack** (1 AP, At-will) | 1 / 2 | 2 / 1d4 | 1d4 / 1 + 1d4 | 1 + 1d4 / 2 + 1d4 | 1 + 1d4 / 3 + 1d4 |
| **Special, 1 AP** (Round) | 2 / 1d4 | 1d4 / 1 + 1d4 | 1 + 1d4 / 2 + 1d4 | 2 + 1d4 / 2 + 1d6 | 2 + 1d4 / 3 + 1d6 |
| **Special, 2 AP** (Round) | 1 + 1d4 / 2 + 1d4 | 2 + 1d4 / 2 + 1d6 | 2 + 1d4 / 3 + 1d6 | 3 + 1d6 / 6 + 1d6 | 4 + 1d6 / 7 + 1d6 |
| **Special, 3 AP** (Encounter) | 3 + 1d4 / 4 + 1d6 | 3 + 1d6 / 6 + 1d6 | 4 + 1d6 / 7 + 1d6 | 7 + 1d6 / 10 + 1d8 | 7 + 1d8 / 13 + 1d8 |

With both ratings Medium, a Stage 0 grunt has **26 Health** (13 + 13).

### Standards

**Attributes**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | -1 | +0 | +1 | +2 | +3 |

**Health: Vigor or Resolve**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 0** | 17 | 24 | 30 | 36 | 42 |

**Defense (Armor Defense or Ward Defense)**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Damage at Stage 0: Tier 2 / Tier 3**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Basic attack** (1 AP, At-will) | 1d4 / 1 + 1d4 | 1d4 / 2 + 1d4 | 1 + 1d4 / 2 + 1d6 | 2 + 1d4 / 3 + 1d6 | 3 + 1d4 / 5 + 1d6 |
| **Special, 1 AP** (Round) | 1 + 1d4 / 2 + 1d4 | 1 + 1d4 / 3 + 1d6 | 2 + 1d4 / 4 + 1d6 | 2 + 1d6 / 6 + 1d6 | 3 + 1d6 / 7 + 1d8 |
| **Special, 2 AP** (Round) | 2 + 1d4 / 3 + 1d6 | 2 + 1d6 / 6 + 1d6 | 4 + 1d6 / 8 + 1d8 | 6 + 1d6 / 10 + 1d8 | 7 + 1d6 / 14 + 1d8 |
| **Special, 3 AP** (Encounter) | 4 + 1d6 / 7 + 1d6 | 6 + 1d6 / 11 + 1d8 | 7 + 1d6 / 15 + 1d8 | 10 + 1d8 / 19 + 1d8 | 13 + 1d8 / 24 + 1d8 |

With both ratings Medium, a Stage 0 standard has **60 Health** (30 + 30).

### Elites

**Attributes**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | +0 | +1 | +2 | +3 | +4 |

**Health: Vigor or Resolve**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 0** | 35 | 50 | 65 | 80 | 95 |

**Defense (Armor Defense or Ward Defense)**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 12 | 13 | 14 | 15 | 16 |

**Damage at Stage 0: Tier 2 / Tier 3**

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Basic attack** (1 AP, At-will) | 1d4 / 1 + 1d4 | 1 + 1d4 / 3 + 1d4 | 3 + 1d4 / 3 + 1d6 | 3 + 1d6 / 5 + 1d6 | 4 + 1d6 / 6 + 1d6 |
| **Special, 1 AP** (Round) | 1 + 1d4 / 3 + 1d4 | 3 + 1d4 / 4 + 1d6 | 3 + 1d6 / 5 + 1d6 | 4 + 1d6 / 7 + 1d6 | 5 + 1d6 / 8 + 1d8 |
| **Special, 2 AP** (Round) | 3 + 1d4 / 4 + 1d6 | 4 + 1d6 / 7 + 1d8 | 6 + 1d6 / 10 + 1d8 | 7 + 1d8 / 13 + 1d8 | 10 + 1d8 / 16 + 1d8 |
| **Special, 3 AP** (Encounter) | 5 + 1d6 / 7 + 1d8 | 7 + 1d8 / 15 + 1d8 | 11 + 1d8 / 17 + 1d8 | 15 + 1d8 / 23 + 1d8 | 17 + 1d8 / 27 + 1d8 |

With both ratings Medium, a Stage 0 elite has **130 Health** (65 + 65).

## Building an encounter

Add up the CV of the enemies. **CV 100 per PC is a normal fight**: 75 per PC is easy, **125 is hard, 150 is deadly**. Many Minions act often: no more than 4 Minions per PC. Encounters of only Grunts cost a little less than their CV.

**The CV is counted for 4 to 6 PCs.** With three PCs a normal fight costs the same, but there is less room for bad luck: a hard or a deadly fight plays about one step harder.

**An NPC of an earlier Stage counts for less.** The NPCs of a Stage are the same at every level of it, so only the Stage matters:

| The NPC's Stage is | Minion | Grunt | Standard | Elite |
|---|---|---|---|---|
| the party's Stage | 25 | 50 | 100 | 200 |
| one Stage below | 20 | 40 | 80 | 160 |
| two Stages below | 15 | 30 | 65 | 130 |

What the fight model gives for 4 PCs of levels 1 to 3 with no [[Momentum]] (all ratings Medium, Stage 0; the cost counts the Rally Points spent in the fight):

| Enemies (total CV) | Rounds | The party's Health | A PC goes Down in | The party wins |
|---|---|---|---|---|
| 3 Standards, or 12 Minions (300, easy) | 2½ to 3 | about 15% | 1 fight in 30 or more | always |
| 4 Standards, 1 Elite and 2 Standards, 2 Elites, 8 Grunts, 16 Minions, or 2 Standards and 8 Minions (400, normal) | 3½ | about a quarter | 1 fight in 10 | always |
| 5 Standards, or 1 Elite and 3 Standards (500, hard) | 4 | 40 to 45% | 1 fight in 4 | 97 to 98% |
| 6 Standards, 3 Elites, 2 Elites and 2 Standards, 1 Elite and 4 Standards, or 4 Standards and 8 Minions (600, deadly) | 5 | 60 to 65% | about half the time | 86 to 88% |

The three levels are about as hard as each other. Elites and Minions are worth their CV in any mix. **Momentum makes every fight easier**: at Momentum 2 the same fights cost about a quarter less, and at Momentum 4 a level 3 party wins the deadly fight 98% of the time. A party late in a good expedition can take one step more.

> [!tip]
> These numbers assume the enemies **spread their attacks**: each strikes the PC it can reach best. If every enemy strikes **the same PC** (the weakest one, or simply the nearest), the encounter plays about **one step harder**: a normal fight like a hard one, a hard one like a deadly one. Do it on purpose (a wolf pack, a disciplined squad), and count it when you choose the CV.

## Example NPCs (Stage 0)

**Goblin Sneak** (Minion, CV 25, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier Medium (+2), Power Modifier Low (+1). Vigor Low (5), Resolve Low (5): Health 10. Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): 2 / 1 + 1d4 Pi.
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: 2 / 1 + 1d4 Pi, and Hindered (EoT).

**Orc Warrior** (Standard, CV 100): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier Medium (+2), Power Modifier Medium (+2). Vigor High (36), Resolve Low (24): Health 60. Armor Defense Medium (13), Ward Defense Low (12).
- *Cleaver* (Basic attack, Medium): 1 + 1d4 / 2 + 1d6 Sl.
- *Brutal Swing* (Special, 2 AP, Round): Terrible damage + Severe condition = High: 2 + 1d4 / 3 + 1d6 Sl, and Prone.
- *Hold the Line* (Reaction, 1R, Trigger: an ally within 2 squares is hit): the attacker takes a Medium 1 AP Special one rating up (High): 2 + 1d6 / 6 + 1d6 Sl.

**Grave Wisp** (Standard, CV 100): Mind High (+2), Appeal Medium (+1), Instinct Medium (+1), Body Low (0). Power Modifier Medium (+2), Weapon Modifier Medium (+2); it attacks only Ward Defense. Vigor Terrible (17), Resolve High (36): Health 53. Armor Defense Low (12), Ward Defense High (14). Speed 5, flies (a fast creature: its Vigor is Terrible).
- *Chilling Touch* (Basic attack, Medium, Vs. WD): [R] 1 + 1d4 / 2 + 1d6 Co.
- *Dread Whisper* (Special, 2 AP, Round, Vs. WD, [Fear]): Low damage + Moderate condition = High: [R] 2 + 1d6 / 6 + 1d6 Ps, and Frightened of it (EoT).

**Ogre Chieftain** (Elite, CV 200): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier Medium (+3), Power Modifier Low (+2). Vigor Medium (65), Resolve Medium (65): Health 130. Armor Defense Medium (14), Ward Defense Low (13). Speed 4 (slow: High Basic attack). Elite Escalation (the ladder above).
- *Club* (Basic attack, High): 3 + 1d6 / 5 + 1d6 Bl.
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP Special: 7 + 1d6 / 4 + 1d6 / 0 Bl (Tier 1 is the worst for them), and Prone on Tier 1. At Escalation 6 it comes back once.
- *Rally the Tribe* (Escalation 4, 1 AP, Round): allies within 5 squares gain 1 Boon on their next [Weapon] Action.
