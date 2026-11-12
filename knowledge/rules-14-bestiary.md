# Bestiary: Building NPCs

You build an NPC by picking a **rank** (how much it counts for in a fight) and a **rating** for each of its numbers; a **role** (what it does in the fight) is a ready set of ratings to start from. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

Each rank has a **Combat Value (CV)**: what one NPC of the rank counts for in an encounter. It is lower for an NPC of an earlier [[Stages|Stage]] than the party (see [[Building an encounter]]). A typical fight is **4 PCs against enemies with a total CV of 400** (CV 100 per PC). At Stage 0 it lasts about **3½ rounds** and costs the party about **a quarter of its Health**, counting the Rally Points it spends during the fight (about a tenth is still missing when it ends); a PC goes Down in about one such fight in ten. A level 1 PC built to deal damage deals about 21 to 35 a turn to one creature (one built to heal, about half), and has 29 to 35 Health.

| Rank | CV | AP a turn | Takes about | Deals about at Stage 0 (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | 25 | **3** | one or two PC hits | 4 |
| **Grunt** | 50 | **3** | 1 PC turn | 6 |
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
- **Damage**: a rating for its **turn budget** (Medium by default): its points an AP and its turn budget come from it (see [[Actions: the turn budget]]).

**The ratings are guidance, not a rule: choose any rating for any number, or a number between two ratings.**

**Health and damage must balance, or the CV changes.** Count the steps the NPC's Vigor, Resolve and damage ratings sit above Medium, minus the steps below it (a step on Vigor or on Resolve alone is half a step; damage is its turn budget's rating). At zero, the NPC is worth its rank's CV. For each step left over, its CV goes up or down:

| Rank | Minion | Grunt | Standard | Elite |
|---|---|---|---|---|
| **CV for each step** | 5 | 10 | 15 | 30 |

A Standard with High Health and High damage counts for 130; one with Low Health and Medium damage for 85. **A Defense step and a Modifier step each count as half a step** (Armor Defense and Ward Defense each on their own). So a High in Health pays for a Low in damage, and a High Armor Defense pays for a Low Ward Defense.

> [!tbd]
> Only Stage 0's tables are written. The tables of Stages 1, 2 and 3 come with those Stages.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its rank's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (15) and a Low Ward Defense (11). An NPC's Defenses come from these ratings only.

**A Defense rating is the mildest step.** One rating up is 2 points of Defense (a Minion's, 1 point: a Minion dies to the hits it doesn't avoid, so each point of its Defense counts double), which takes about 10% off what the PCs deal in a turn and makes the fight almost half a round longer; a rating of Health or damage is 20 to 25%. Defense makes a creature last by making the PCs miss: against an Extreme Defense a level 1 PC gets a Tier 1 more than half the time. **Give an Extreme Defense to one creature in a fight, not to all of them**, and prefer a High in one Defense with a Low in the other: it rewards attacking the right one. That trade is even only for a party that can attack both Defenses: against one that attacks only Armor Defense, a High Armor Defense with a Low Ward Defense is simply a High.

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

## Actions: the turn budget

An NPC's Actions are bought with **points**. Points are damage: the [[Points into damage]] table turns them into a Tier 2 and a Tier 3. Each rank has a **turn budget** (the points of a whole turn) and **points an AP** (what one AP of an Action is worth), by its damage rating; both are in the rank's tables below. A Medium Standard has **25 points an AP** and a **turn budget of 100**: its Basic attack is 25 points, its 2 AP Round Special 55, and its usual turn (the Special and two Basic attacks, the second with its At-will Bane) is about 100.

You spend the points on what the creature does: damage, conditions, Forced Movement, help for its allies, a Reaction. **These are guidance, not a rule:** an NPC should feel balanced at the table, and the points are how you get there quickly. You can always write an NPC by hand and check it against them.

### The Basic attack

Every NPC has one **Basic attack**: 1 AP, At-will, its rank's points an AP. It is usually a Weapon Action Vs. AD that deals [V], or a Power Action Vs. WD that deals [R] (see [[What an Action attacks, rolls and damages]]). Tier 1 deals nothing. **Its damage die explodes** (see [[Exploding Dice]]), except a Minion's or a Grunt's: **a Minor enemy's dice never explode.** The weapon in its hands is only what the attack looks like. **A Basic attack is not always damage only:** it can carry a cheap rider (a Push 1, a Mild condition) and keep most of its damage.

**NPCs have no Weapon Attack.** Their Basic attack takes its place: when an Action or rule calls for a Weapon Attack (the Weapon Attack (1A) at the end of a Charge, for example), an NPC uses its Basic attack.

### The price of an Action

An Action's points are **its AP × the rank's points an AP**, then:

| The Action is... | Its points |
|---|---|
| At-will | × 1 |
| **Round** | **+10%** |
| **3 AP** (at once) | **+5%** more |
| **Encounter** | **double** the Round price of the same AP |

A Medium Standard's prices:

| AP | At-will | Round | Encounter |
|---|---:|---:|---:|
| **1 AP** | 25 | 28 | 55 |
| **2 AP** | 50 | 55 | 110 |
| **3 AP** | 79 | 86 | 173 |

**The Exploding trait** on any other Action of a Standard or an Elite costs **6 points** (its damage dice explode).

**Frequency is apart from AP:** any AP cost can be At-will, Round or Encounter. A 2 AP Action needs no premium of its own: it is already better than two Basic attacks, the second of which takes the At-will Bane. Two different 1 AP At-will Actions don't take the At-will Bane from each other, so the GM can alternate them.

**An Encounter Action is big, and the rest of the fight pays for it.** It deals double what a Round Action of its AP does, so its turn is far over the budget. **Its pay-back:** every other Action of the creature, and its Reaction, loses a share of its points:

| Encounter Action | Its other Actions lose | It hits |
|---|---|---|
| **1 AP** | a fifth of their points | one creature, or several |
| **2 AP** | a quarter | **several creatures** (see [[Actions that hit several creatures]]) |
| **3 AP** | half | **several creatures** |

**A 2 AP or 3 AP Encounter Action should hit several creatures.** Against one PC it is a killing blow: double damage, or the same points in heavy riders stacked on one creature, takes a PC from full Health to Down in one hit, and no pay-back makes up for that. You can still give one to a boss as its signature: count the encounter **one step harder** (a normal fight as a hard one) and let the players see it coming. A 3 AP one is the creature's whole identity: it gives up half of everything else for it.

### Points into damage

The damage of an Action is the points left after its riders (below). The table writes them as a flat number plus at most one small die; between two rows, take the nearer one.

| Points | Tier 2 / Tier 3 | | Points | Tier 2 / Tier 3 |
|---:|---|---|---:|---|
| 5 | 1 / 1 | | 70 | 6 + 1d6 / 11 + 1d8 |
| 10 | 1 / 1d4 | | 80 | 8 + 1d6 / 13 + 1d8 |
| 15 | 1d4 / 1 + 1d4 | | 90 | 8 + 1d8 / 15 + 1d8 |
| 20 | 1d4 / 2 + 1d4 | | 100 | 10 + 1d8 / 18 + 1d8 |
| 25 | 1 + 1d4 / 2 + 1d6 | | 110 | 11 + 1d8 / 20 + 1d8 |
| 30 | 2 + 1d4 / 3 + 1d6 | | 120 | 12 + 1d8 / 22 + 1d8 |
| 35 | 2 + 1d4 / 4 + 1d6 | | 140 | 15 + 1d8 / 26 + 1d8 |
| 40 | 2 + 1d6 / 5 + 1d6 | | 160 | 18 + 1d8 / 31 + 1d8 |
| 45 | 3 + 1d6 / 6 + 1d6 | | 180 | 21 + 1d8 / 35 + 1d8 |
| 50 | 4 + 1d6 / 8 + 1d6 | | 200 | 24 + 1d8 / 40 + 1d8 |
| 55 | 4 + 1d6 / 8 + 1d8 | | 220 | 26 + 1d8 / 44 + 1d8 |
| 60 | 5 + 1d6 / 9 + 1d8 | | 240 | 29 + 1d8 / 48 + 1d8 |

### Ranged attacks

An attack an NPC can make from more than 2 squares away **pays one rating for its range**: a Medium creature's ranged attack has its Low points. A creature that attacks from safety is worth more than its numbers (at full damage, four ranged Standards are a hard fight, not a normal one). Reach doesn't count as range.

### Riders and their price

A **rider** is an effect an Action adds to its damage: a condition, a Forced Movement. It is paid **from the Action's points at a flat price**, the same for every rank:

| Rider | Price | Examples |
|---|---:|---|
| **Forced Movement 1** | 2 | Pushed, Pulled or Slid 1 |
| **Mild** | 3 | Hindered (EoT); 1 Pressure Bane on its next roll; Doomed on its next roll; Taunted (1 round); Frightened (EoT); Staggered (EoT); Vulnerable 1 (EoT); Immobilized (EoT); Enfeebled 1; Sickened 1; Bright light on it (it can't hide) |
| **Moderate** | 6 | Prone; Slowed 1; Dazed 1; Blinded (EoT); Vulnerable 2 (EoT); Immobilized until it escapes; Grabbed; Bleed 1; **Forced Movement 2** |
| **Severe** | 12 | Slowed 2; Dazed 2; Bleed 2, Bleed 1d4 or 1d6; **Forced Movement 3 or more** |
| **Beyond Severe** | 18 a step | Bleed 2d6 (30) |

**AP are the strongest thing to take** (Prone, Dazed, Slowed), **a Bleed is damage that keeps coming** (it lasts until the PC spends 1 AP to staunch it), and conditions that only make a PC's next roll or its movement worse are mild: a PC shakes them off at the end of its turn, and its allies don't care. A condition that lasts longer than EoT, or that a Save can't shake off, is one size more, unless the table already lists that duration.

- **Forced Movement is the most common rider:** in the open it changes little, and against a wall or another PC it deals Collision damage (see [[Steadiness]] and Collision in Chapter 3). Push the PC when it hurts: into a wall, into another PC, off a ledge, out of an ally's aura; pushing a PC away from you in the open only frees it. Against walls a Push is worth about twice its price; in the open, nothing.
- **No limit on repeating a rider.** A rider on a creature that already has it is wasted: spread the attacks.
- **At most 2 riders on an Action**, as guidance.

### Where the effect is

| The effect is... | Its price |
|---|---|
| a rider (on a hit: Tier 2 and Tier 3), or on the Action's Effects row | the price above |
| in the **Setup** (it always happens, hit or miss) | **one size more** (a Mild condition costs a Moderate's 6) |
| on **Tier 3 only** | **one size less** (a Moderate condition costs a Mild's 3; a Mild one 2) |

A **unique effect** ("the Dragon grabs you, flies up and drops you to the ground") is priced as the nearest conditions (Grabbed and Prone, with the fall's damage as damage), and belongs on an Encounter Action.

### Actions that hit several creatures

An Action that hits several creatures (an Area, a Save Action against everyone in it, "two creatures") deals **two thirds** of its points to each, after its riders. **An Encounter Action deals half to each:** every creature in it takes what a Round Action of its AP would deal. It pays when it catches two or more, and a party that spreads out often gives it one: give it a real area (a 2 Emanation, a Line along the front) or a reason for the PCs to stand together.

- **Area Save Actions** use a Save the targets roll (DC 11 + the Modifier); the PC's Tier 1 takes the Action's Tier 3, its Tier 2 the Tier 2, its Tier 3 nothing.

### Actions with no damage

An Action that only helps the NPC's side (a buff, a heal, a wall) or only puts an effect on a PC is priced from the same points, by what it gives:

| It gives | Points |
|---|---:|
| An ally's next attack has 1 Boon (each ally) | 3 |
| An ally makes its Basic attack (each ally) | the ally's Basic attack |
| An ally heals 1 Health | 1 |
| A condition or a Forced Movement on a PC | its rider price (on a hit, in the Setup or on Tier 3) |

A help is cheap because one Boon or a few Health matter little in a fight of three or four rounds; **put it on a Round Special as a rider** ("and each ally within 5 squares gains 1 Boon on its next attack") rather than as an Action of its own, which costs the creature an attack. Healing an enemy is weak: its allies have more Health than the PCs, and the fight is short.

### Reactions

- **No NPC has a Reaction by default**: an NPC has the Reactions its entry gives it (see [[Reactions]]). It pays for one as a PC does: with its Reaction AP or an AP it kept from its turn. **Minions have no Reaction AP**; a Grunt's Reaction is priced as anyone's.
- **A Reaction's attack has the points of a Round Action of its cost:** a 1R Reaction a 1 AP Round Action's (28 for a Medium Standard), a 2R Reaction a 2 AP Round Action's (55).
- **It is paid from the turn:**

| Reaction | Off its turn budget |
|---|---|
| **1R**, on its own being hit or targeted ("Trigger: a creature hits you"): it fires often | **a third** of its points (9) |
| **1R**, on an ally or a movement ("Trigger: an ally within 2 squares is hit"; "Interrupt: a creature would enter a square next to you"): it fires now and then | **a quarter** (7) |
| **2R** | nothing more: the AP it keeps from its turn is its price |

**A 2R Reaction is weak on an NPC:** the AP it keeps costs more than the Reaction gives back, unless it fires in most rounds. Prefer 1R. A Reaction that only protects (an ally gains +2 Defense against the triggering Strike) is cheap: 2 points off the turn.

### How common each kind of Action is

Most NPC Actions should do more than damage. As guidance, from most to least common:

1. **Common:** damage + a Forced Movement.
2. **Common:** damage only.
3. **A little less:** damage + one other rider.
4. **Uncommon:** damage + 2 riders, one of them a Forced Movement.
5. **Rare:** damage + 2 riders of any kind.
6. **Very rare:** a unique effect, on an Encounter Action.

### Check its best turn

Add the points of the most it can do in one turn: its AP (4, or 3), at most 3 Strikes, each Round Action once, **without its Encounter Action** (the pay-back covers that turn). It should be within its turn budget, or up to **15% over**. A turn of Basic attacks only, or with only a 1 AP Special, is well under the budget (the repeated Basic attacks take At-will Banes): give it a 2 AP Special.

> [!example]
> **Building the Orc Warrior** (a Medium Standard: 25 points an AP, turn budget 100). *Cleaver* is its Basic attack: 25 points; a Push 1 (2) leaves 23: 1 + 1d4 / 3 + 1d4. *Hold the Line* is a 1R Reaction on an ally being hit: its attack has 28 points, and a quarter of that (7) comes off the turn, here off the Special. *Brutal Swing* is a 2 AP Round Special: 55 points, Prone on a hit (Moderate, 6) and the Reaction's 7 leave 42: 2 + 1d6 / 6 + 1d6. Its best turn: Brutal Swing and two Cleavers, 55 + 25 + 25 = 105: within the budget.

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

A **role** says what a creature does in a fight. It is a ready set of ratings for a rank's tables and a way to spend its points, to build an NPC quickly and to tell the GM how to play it. **Every role below is balanced: an NPC built with it is worth its rank's CV**, its Actions bought with its turn budget. A role has no rules of its own, and an NPC needs none: every rating a role doesn't name is Medium.

| Role | It... | Ratings | Its points go to |
|---|---|---|---|
| **Striker** | walks in and hits hard, and is easy to hit | **High** damage, **High** Vigor; **Low** Resolve, **Low** Armor Defense, **Low** Weapon Modifier | damage, a Forced Movement |
| **Soldier** | holds a line and protects its allies | **High** Armor Defense; **Low** Vigor and Resolve | a Reaction that punishes an attack on an ally or a PC that comes close (1R, a quarter of its points off the turn); Immobilized, Grabbed |
| **Skirmisher** | moves, strikes and gets away | Speed 6 or 7, **High** Weapon Modifier; **Low** Vigor and Resolve | a Special with a movement in it; Hindered |
| **Artillery** | attacks from far away | ranged attacks (each pays its rating for the range), **High** Modifier; **Low** Armor Defense | damage; a Pressure Bane, Vulnerable |
| **Controller** | changes the fight with conditions and areas | **High** Ward Defense, **Low** Armor Defense; often Power Actions Vs. WD | Moderate and Severe conditions (Dazed, Slowed, Prone), an Area |
| **Leader** | makes its allies better; one in a fight | Medium everything | help on its Round Special (Boons for its allies, an ally's Basic attack) |

All six are measured with what makes them: four of a role cost a party about what four Standards with effects do, a Controller's conditions and a Soldier's Reaction included. Speed costs nothing by itself.

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
| **Every Stage** | 10 | 11 | 12 | 13 |

**Points at Stage 0** (by its damage rating; see [[Actions: the turn budget]])

| | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Points an AP** | 12 | 14 | 18 | 22 |
| **Turn budget** (3 AP) | 35 | 43 | 54 | 65 |

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
| **Every Stage** | 10 | 11 | 13 | 15 | 17 |

**Points at Stage 0** (by its damage rating; see [[Actions: the turn budget]])

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Points an AP** | 16 | 20 | 25 | 30 | 38 |
| **Turn budget** (3 AP) | 49 | 60 | 75 | 90 | 113 |

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
| **Every Stage** | 10 | 11 | 13 | 15 | 17 |

**Points at Stage 0** (by its damage rating; see [[Actions: the turn budget]])

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Points an AP** | 16 | 20 | 25 | 30 | 38 |
| **Turn budget** (4 AP) | 65 | 80 | 100 | 120 | 150 |

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
| **Every Stage** | 11 | 12 | 14 | 16 | 18 |

**Points at Stage 0** (by its damage rating; see [[Actions: the turn budget]])

| | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Points an AP** | 21 | 26 | 33 | 40 | 50 |
| **Turn budget** (4 AP) | 86 | 106 | 132 | 158 | 198 |

With both ratings Medium, a Stage 0 elite has **130 Health** (65 + 65).

## Building an encounter

Add up the CV of the enemies. **CV 100 per PC is a normal fight**: 75 per PC is easy, **125 is hard, 150 is deadly**. Many Minions act often: no more than 4 Minions per PC.

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

The three levels are about as hard as each other. Elites, Grunts and Minions are worth their CV in any mix. **With enemies that use effects** (built on the turn budget, most of their Actions with a rider), a normal fight costs the same with fewer PCs Down (about 1 fight in 15), and the fights are a little longer; a deadly fight of Standards is about half a step harder (won about three times in four): the effects add up in a long fight, and that is what deadly means. **Momentum makes every fight easier**: at Momentum 2 the same fights cost about a quarter less, and at Momentum 4 a level 3 party wins the deadly fight 98% of the time. A party late in a good expedition can take one step more.

> [!tip]
> These numbers assume the enemies **spread their attacks**: each strikes the PC it can reach best. If every enemy strikes **the same PC** (the weakest one, or simply the nearest), the encounter plays about **one step harder**: a normal fight like a hard one, a hard one like a deadly one. Do it on purpose (a wolf pack, a disciplined squad), and count it when you choose the CV.

## Example NPCs (Stage 0)

Each is built on its turn budget (see [[Actions: the turn budget]]); the points are in brackets.

**Goblin Sneak** (Minion, CV 25, 3 AP; 18 points an AP, turn budget 54): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier Medium (+2), Power Modifier Low (+1). Vigor Low (5), Resolve Low (5): Health 10. Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, 1 AP, At-will; 18): 1d4 / 1 + 1d4 Pi.
- *Dirty Trick* (1 AP, Round; 20, a Mild rider 3): 1d4 / 1 + 1d4 Pi, and 1 Pressure Bane on its next roll.

**Orc Warrior** (Standard, CV 100; 25 points an AP, turn budget 100): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier Medium (+2), Power Modifier Medium (+2). Vigor High (36), Resolve Low (24): Health 60. Armor Defense Medium (13), Ward Defense Low (11).
- *Cleaver* (Basic attack, 1 AP, At-will; 25, Push 1 2): 1 + 1d4 / 3 + 1d4 Sl, and it can Push the target 1.
- *Brutal Swing* (2 AP, Round; 55, Prone 6, Hold the Line's share 7): 2 + 1d6 / 6 + 1d6 Sl, and Prone.
- *Hold the Line* (Reaction, 1R, Trigger: an ally within 2 squares is hit by a Strike; 28): it makes an attack against the attacker if it can reach it: 1 + 1d4 / 3 + 1d6 Sl.

**Grave Wisp** (Standard, CV 100; 25 points an AP): Mind High (+2), Appeal Medium (+1), Instinct Medium (+1), Body Low (0). Power Modifier Medium (+2), Weapon Modifier Medium (+2); it attacks only Ward Defense. Vigor Terrible (17), Resolve High (36): Health 53. Armor Defense Low (11), Ward Defense High (15). Speed 5, flies (a fast creature: its Vigor is Terrible).
- *Chilling Touch* (Basic attack, 1 AP, At-will, Vs. WD, [Fear]; 25, Frightened 3): [R] 1 + 1d4 / 2 + 1d4 Co, and Frightened of it (EoT).
- *Dread Whisper* (2 AP, Round, Vs. WD, [Fear]; 55, Dazed 1 6): [R] 3 + 1d6 / 7 + 1d6 Ps, and Dazed 1.

**Ogre Chieftain** (Elite, CV 200; 33 points an AP, turn budget 132): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier Medium (+3), Power Modifier Low (+2). Vigor Medium (65), Resolve Medium (65): Health 130. Armor Defense Medium (14), Ward Defense Low (12). Speed 4 (slow: its Club is High, 40 points an AP). Elite Escalation (the ladder above).
- *Club* (Basic attack, 1 AP, At-will, High; 40, Push 1 2, then Ground Slam's pay-back, a quarter): 1 + 1d4 / 3 + 1d6 Bl, and it can Push the target 1.
- *Overhead Smash* (2 AP, Round; 73, Push 2 6, the pay-back): 3 + 1d6 / 7 + 1d6 Bl, and it can Push the target 2.
- *Ground Slam* (2 AP, Encounter, Area 2 Emanation, a Save Action: Body Save, DC 14; 145, Prone 6, half to each): 11 + 1d8 / 6 + 1d6 / 0 Bl (Tier 1 is the worst for them), and Prone on Tier 1 and Tier 2. At Escalation 6 it comes back once.
- *Rally the Tribe* (Escalation 4, 1 AP, Round): allies within 5 squares gain 1 Boon on their next [Weapon] Action.
