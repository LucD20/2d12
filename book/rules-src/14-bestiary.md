<!-- doc: bestiary -->
# Bestiary: Building NPCs

You build an NPC by picking a **role**, then a **rating** for each of its numbers. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

Each role has a **Combat Value (CV)**: what one NPC of the role counts for in an encounter. It is lower for an NPC of an earlier [[Stages|Stage]] than the party (see [[Building an encounter]]). A typical fight is **4 PCs against enemies with a total CV of 400** (CV 100 per PC). It lasts about **3½ rounds** and costs the party about **a fifth of its Health**, counting the Rally Points it spends during the fight; a PC goes Down in about one such fight in five. A level 1 PC deals about 25 to 30 damage a turn to one creature, and has 29 to 35 Health.

| Role | CV | AP a turn | Takes about | Deals about (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | 25 | **3** | one PC hit | 5 |
| **Grunt** | 50 | 4 | 1 PC turn | 8 |
| **Standard** | 100 | 4 | 2 PC turns | 12 |
| **Elite** | 200 | 4 | 4 PC turns | 17 |

"Deals about" is a whole turn: the Basic attack and the Special Actions it can fit after moving, against an average Defense, before anything the PCs do about it (Guard, blocks, damage reduction take about half of it away). It is what you check a new NPC's Actions against.

**Minions have 3 AP a turn**, not 4: quick, simple creatures that move and strike, and die fast. Every NPC also gains the Reaction AP, as a PC does (see [[Action Points]]).

### Minor enemies

**Minor enemies** are Minions and Grunts: the roles with a CV below 100.

## Ratings

Each role has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the role's normal value; the others go down or up from it. Minions have no Extreme. The rows of the Health and Basic attack tables are **[[Stages]]**: **Stage 1** (levels 1 to 4), **Stage 2** (levels 5 to 7) and **Stage 3** (levels 8 to 10). An NPC uses the row of its level's Stage, and nothing changes inside a Stage. Each rating keeps the same step from Medium at every Stage. Attributes, Defenses and Modifiers don't change with the Stage.

- **Attributes**: by default one **High**, two **Medium** and one **Low**.
- **Health**: a rating for the **Body Health Multiplier** and one for the **Mind Health Multiplier**, Medium by default. A brute might have High Body and Low Mind; a ghost, Terrible Body and High Mind.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (see Defenses below).
- **Modifiers**: a rating for the **Weapon Modifier** and one for the **Power Modifier** (see Attributes and Modifiers below).
- **Basic attack**: a rating for its damage (Medium by default).

**The ratings are guidance, not a rule: choose any rating for any number.** As a suggestion, if one number is High, a Low somewhere else usually makes sense (High Armor Defense and Low Health, for example). A creature whose ratings average out to Medium is balanced for its role.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its role's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (14) and a Low Ward Defense (12). A Defense is never below 11. An NPC's Defenses come from these ratings only.

**A Defense rating is a small step.** One rating is 1 point of Defense, which takes about 8 to 10% off what the PCs deal in a turn; a rating of Health or damage is 20 to 25%. A High Defense is worth about +10% Health against +25% for a High Health, so Defense is the mildest of the ratings.

### Attacking Ward Defense

**Any NPC Action can be Vs. WD**: it is then a Power Action (it rolls the NPC's Power Modifier against the target's Ward Defense) and **deals [R] (Resolve damage) by default**; write it on the Action when it deals [V] instead. The damage tables are the same for Vs. AD and Vs. WD attacks: a PC's Ward Defense is 12 or 13 at Stage 1 (up to 14 at Stage 2 and 15 at Stage 3), close to its Armor Defense, so a Vs. WD attack hits about as often. What changes is the pool it hits: Resolve is most PCs' low pool, so a creature that attacks Ward Defense makes them Strained early (see [[Bloodied]] and [[Strained]]). Some creatures attack **only** Ward Defense (a ghost, a nightmare, a wisp of dread); about one NPC in four should, so the PCs' Resolve and everything that cares about Strained get their share of the fights.

## Attributes and Modifiers

Assign the Attributes to **Body, Mind, Appeal and Instinct**. Its Vs. Attributes are 12 + the Attribute, as for anyone.

An NPC's **Weapon Modifier** and **Power Modifier** are each a rating of its role's table. They don't come from its Attributes and don't grow with its Stage (its Health and damage tables do). By default the Weapon Modifier is **Medium** and the Power Modifier **Low** (a Standard's is Medium too); a creature that attacks Ward Defense usually swaps them. A Modifier is never above +4.

| Role | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Minion** | +0 | +1 | +2 | +3 | — |
| **Grunt** | +0 | +1 | +2 | +3 | +4 |
| **Standard** | +0 | +1 | +2 | +3 | +4 |
| **Elite** | +1 | +2 | +3 | +4 | +4 |

## Health

The Bestiary's own formula (a PC's Health is in [[Health Pool]]), with the role's numbers:

- **Vigor** = (Body + 2) × Body Health Multiplier + Health Base
- **Resolve** = (Mind + 2) × Mind Health Multiplier + Health Base
- **Health Pool** = the two thresholds added together (round each threshold up).

Bloodied, Strained and going Down work as usual (see [[NPCs Going Down]]). **A Minion has no Dying: at 0 it dies, or falls Unconscious if the GM prefers.**

## Speed

Speed is **free**: every NPC has Speed 5 unless it says otherwise. But it is strong, so it should be balanced with the rest of the creature:

- **A fast creature** (Speed 6 or more, or one that flies) chooses its fights: it reaches the back line, gets out of reach, and makes the PCs come to it. Give it a downside: Low Health, Low Armor Defense, or a Low Basic attack.
- **A slow creature** (Speed 4 or less) is easy to avoid and to keep away. Give it an upside: High Health, a High Basic attack, or Reach.

## Steadiness

An NPC has Steadiness 0 unless it says otherwise. A big or heavy creature can have 1 or more (see [[Steadiness]] in Chapter 3).

## Actions

### The Basic attack

Every NPC has one **Basic attack**: its main attack, 1 AP, At-will, Vs. AD (a Weapon Action, [V]) or Vs. WD (a Power Action, [R]). Its damage is the role's (the tables give the **average damage** on Tier 2 and Tier 3, [Mod] included; pick dice that come close). Tier 1 deals nothing, like a Weapon Attack. The weapon in its hands is only what the attack looks like.

**NPCs have no Weapon Attack.** Their Basic attack takes its place: when an Action or rule calls for a Weapon Attack (the Weapon Attack (1A) at the end of a Charge, for example), an NPC uses its Basic attack.

### Special Actions

Special Actions make an NPC interesting. **Every role has them, Minions included.** A Special Action deals the **Basic attack's average damage**, at the rating you give it, **times**:

| AP | Frequency | Damage |
|---|---|---|
| 1 AP | Round | × 1.4 |
| 2 AP | Round | × 2.2 |
| 3 AP | Encounter | × 3.5 |

Minions have at most 2 AP Special Actions (3 AP is their whole turn). For example, a Stage 1 Standard's Medium Basic attack averages 4 / 7.5: its Medium 2 AP Special averages about 9 / 16.5. **The Specials are part of the role's turn**: an NPC spends what it has left after moving on its best Special, then on Basic attacks, and the tables are fitted with it doing so every round (a Standard's Round Special every round, an Elite's Encounter Special in its first).

- **Area Save Actions** (a Save the targets roll, DC 11 + the Modifier): about **half** the damage, to each creature in the area.

### Conditions

A condition is worth **steps of rating**: **Mild 1, Moderate 2, Severe 3**. An Action with a condition lowers its damage rating by that many steps: a **Low** attack with a **Moderate** condition is as strong as a **High** attack. An Action with no damage counts as one step below Terrible.

| Severity | Examples |
|---|---|
| **Mild** | Hindered (EoT); 1 Pressure Bane on its next roll; Pushed, Pulled or Slid (any distance); Bright light on it (it can't hide); Taunted (1 round); Sickened 1; Bleed 1 or 2; Staggered (EoT) on a creature whose Reaction is only Opportunity Attack |
| **Moderate** | Vulnerable 1 (EoT); Immobilized (EoT); Immobilized until it escapes; Enfeebled 1; Dazed 1; Grabbed; Bleed 1d4 to 1d6; Frightened (EoT) of a creature it can already reach; Staggered (EoT) on a creature with a Reaction worth an AP |
| **Severe** | Prone; Slowed 1; Vulnerable 2 (EoT); Doomed on its next roll; Blinded (EoT); Frightened (EoT) of a creature it must still approach |

**Slowed 2**, **Dazed 2** and **Bleed 2d6** are one step beyond Severe (4 steps). The measure behind the new rows (pack R-classes, 2026-11-04): a Bane is about 10% of an attack and Doomed about half of it; Dazed 1 takes a quarter of a Standard's turn (about 3 DE), Frightened's Bane alone is Mild and its movement restriction the real cost, a Bleed deals about twice its value over the rest of a fight or costs 1 AP to staunch (priced on a Standard: Bleed 1d4 4.8 DE, Bleed 2d6 13.7; Dazed 1 2.4, Blinded 6.7, Frightened's Bane 1.4, Taunted 0.8: prices.md section 5). Conditions that cost AP (Prone, Slowed) are the strongest; conditions that only move a creature are the weakest. A condition that lasts longer than EoT, or that a Save can't shake off, is one step more severe, unless the table already lists that duration. A condition on Tier 3 only costs one step less.

### Reactions

- **Every NPC** has Opportunity Attack, the basic Reaction (with its Basic attack: see [[Chapter 6: Basic Actions|Chapter 6]]).
- **Minions and Grunts** normally have no other.
- **Standards and Elites** may have one or more.
- An NPC pays for a Reaction as a PC does: with its Reaction AP or the AP it kept from its turn (see [[Reactions]]).
- **A Reaction that doesn't disrupt the triggering Action** (a Trigger, after it) should be **one rating stronger** than an Action of the same AP: it only happens when its trigger does.
- **A Reaction that disrupts it** (an Interrupt that can stop the Action) is worth the same as an Action of the same AP: stopping the Action is its strength.

### Elite Escalation

An **Elite** has Escalation (the NPC sheet's switch); no other NPC does. It is a level from 1 to 3, as a PC's (see [[Escalation]]), with the Elite's own rules:

- **Start and rounds:** an Elite starts every encounter at **Escalation 1** and gains 1 at the start of each round after the first, up to 3. It has no Momentum and no Critical hook.
- **Phases:** when an Elite **becomes Bloodied**, and when it **becomes Strained**, its Escalation increases by 1 (once each). The GM says so when it happens: the players always see an Elite change.
- **What its Escalation does**, unless the Elite's entry says otherwise:

| Escalation | The Elite... |
|---|---|
| **1** | has **1 Boon** on its first attack each round. |
| **2** | can use its **Round Special Action twice** a round. |
| **3** | gets its **Encounter Special Action back**, once. |

- An Elite can also have Actions with an **Escalation** line (Rally the Tribe below): it can use them while its Escalation is at least that number, and they spend nothing.

With its Escalation, an Elite is worth its CV: two Elites cost the party what four Standards do; without it, about a fifth less (the ruler, pack R-bestiary). The phases rarely move the numbers (an Elite is usually at 3 when it becomes Bloodied); they are there to be seen.

## The roles

### Minions

**Attributes**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Every Stage** | -2 | -1 | +0 | +1 |

**Health Multiplier (Health Base +1)**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 1** (levels 1-4) | ×0 | ×0.75 | ×1 | ×1.25 |
| **Stage 2** (levels 5-7) | ×0 | ×1 | ×1.25 | ×1.5 |
| **Stage 3** (levels 8-10) | ×0 | ×1.5 | ×2 | ×2.75 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Every Stage** | 11 | 11 | 12 | 13 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 1 / 2.5 | 1.5 / 3.5 | 2 / 4 | 2.5 / 5 |
| **Stage 2** (levels 5-7) | 1.5 / 3.5 | 2 / 5 | 3 / 5.5 | 3.5 / 7 |
| **Stage 3** (levels 8-10) | 2 / 5 | 3 / 7 | 4 / 8 | 5 / 10 |

With every rating Medium, a Stage 1 minion has **6 Health** (Stage 2: 8, Stage 3: 10).

### Grunts

**Attributes**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | -2 | -1 | +0 | +1 | +2 |

**Health Multiplier (Health Base +3)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | ×2 | ×3 | ×4.25 | ×5.25 | ×6.25 |
| **Stage 2** (levels 5-7) | ×2.5 | ×3.75 | ×4.75 | ×6 | ×7.25 |
| **Stage 3** (levels 8-10) | ×4 | ×6 | ×8 | ×10 | ×12 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 2 / 3 | 2.5 / 3.5 | 3 / 4 | 4 / 5.5 | 4.5 / 6.5 |
| **Stage 2** (levels 5-7) | 3 / 4 | 3.5 / 5 | 4 / 6.5 | 5.5 / 8 | 6.5 / 10 |
| **Stage 3** (levels 8-10) | 4 / 6.5 | 5 / 7 | 6.5 / 9 | 8 / 11 | 9 / 14 |

With every rating Medium, a Stage 1 grunt has **24 Health** (Stage 2: 26, Stage 3: 38).

### Standards

**Attributes**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | -1 | +0 | +1 | +2 | +3 |

**Health Multiplier (Health Base +4)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | ×3.75 | ×5.75 | ×7.75 | ×9.75 | ×11.5 |
| **Stage 2** (levels 5-7) | ×4.5 | ×6.75 | ×9 | ×11.25 | ×13.5 |
| **Stage 3** (levels 8-10) | ×7.5 | ×11 | ×15 | ×18.5 | ×22.5 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 3 / 4 | 3.5 / 6 | 4 / 7.5 | 5.5 / 9 | 6.5 / 11 |
| **Stage 2** (levels 5-7) | 4 / 6.5 | 5 / 8.5 | 6.5 / 11.5 | 8 / 13.5 | 10 / 16.5 |
| **Stage 3** (levels 8-10) | 6.5 / 9 | 7 / 12 | 9 / 16.5 | 11 / 19 | 14 / 23 |

With every rating Medium, a Stage 1 standard has **56 Health** (Stage 2: 62, Stage 3: 98).

### Elites

**Attributes**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | +0 | +1 | +2 | +3 | +4 |

**Health Multiplier (Health Base +6)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | ×6.5 | ×10 | ×13.25 | ×16.5 | ×19.75 |
| **Stage 2** (levels 5-7) | ×7.75 | ×11.5 | ×15.5 | ×19.25 | ×23.25 |
| **Stage 3** (levels 8-10) | ×13 | ×19.25 | ×25.5 | ×32 | ×38.5 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 12 | 13 | 14 | 15 | 16 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 3 / 4 | 4 / 6.5 | 5 / 7.5 | 6.5 / 9.5 | 7.5 / 11 |
| **Stage 2** (levels 5-7) | 4 / 6.5 | 6 / 9 | 7.5 / 11.5 | 9 / 14 | 10.5 / 16 |
| **Stage 3** (levels 8-10) | 6 / 9 | 8.5 / 12.5 | 10.5 / 15.5 | 12.5 / 19.5 | 15 / 22.5 |

With every rating Medium, a Stage 1 elite has **118 Health** (Stage 2: 136, Stage 3: 216).

**The rows by Stage:** the Stage 2 and 3 damage rows are the Stage 1 rows × 1.2 and × 1.5 beyond their old growth, and the Stage 3 Health rows × 1.2, so that a Standard takes as many turns to Down a PC at level 8 as at level 1 and a fight stays 3½ rounds while the PCs' Health line and Mastery grow (the ruler, pack R-bestiary; the Stage 2 and 3 fits are models until the classes have their Stage picks).

## Building an encounter

Add up the CV of the enemies. **CV 100 per PC is a normal fight**: 75 per PC is easy, **125 is hard, 150 is deadly**. Many Minions are cheap but act often: no more than 4 Minions per PC. Minions and Grunts on their own come under their CV (16 Minions cost about half of what 4 Standards do: they die before they act much): mix them with Standards.

**An NPC of an earlier Stage counts for less.** The NPCs of a Stage are the same at every level of it, so only the Stage matters:

| The NPC's Stage is | Minion | Grunt | Standard | Elite |
|---|---|---|---|---|
| the party's Stage | 25 | 50 | 100 | 200 |
| one Stage below | 20 | 40 | 80 | 160 |
| two Stages below | 15 | 30 | 65 | 130 |

What the fight model gives for 4 PCs (all ratings Medium, Stage 1; the cost counts the Rally Points spent in the fight):

| Enemies (total CV) | Rounds | The party's Health | A PC goes Down in | The party wins |
|---|---|---|---|---|
| 3 Standards, or 2 Standards and 4 Minions (300, easy) | 2½ | about 10% | 1 fight in 14 | always |
| 4 Standards, 1 Elite and 2 Standards, 2 Elites, 8 Grunts, or 2 Standards and 8 Minions (400, normal) | 3½ | about a fifth | 1 fight in 5 or 6 | always |
| 5 Standards, or 1 Elite and 3 Standards (500, hard) | 4½ | about 30% | 1 fight in 3 | 95 to 98% |
| 6 Standards, or 2 Elites and 2 Standards (600, deadly) | 5½ | about half | more often than not | 82 to 89% |

> [!tip]
> These numbers assume the enemies **spread their attacks**: each strikes the PC it can reach best. If every enemy strikes **the same PC** (the weakest one, or simply the nearest), the encounter plays about **one step harder**: a normal fight like a hard one, a hard one like a deadly one. Do it on purpose (a wolf pack, a disciplined squad), and count it when you choose the CV.

## Example NPCs (Stage 1)

**Goblin Sneak** (Minion, CV 25, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier Medium (+2), Power Modifier Low (+1). Body and Mind Health Low (×0.75): Health 6 (3 + 3). Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): about 2 / 4 ([Mod] / 1d4 + [Mod] Pi).
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: about 2 / 5 ([Mod] / 1d6 + [Mod] Pi), and Hindered (EoT).

**Orc Warrior** (Standard, CV 100): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier Medium (+2), Power Modifier Medium (+2). Body Health High (×9.75), Mind Health Low (×5.75): Health 65 (Vigor 43, Resolve 22). Armor Defense Medium (13), Ward Defense Low (12).
- *Cleaver* (Basic attack, Medium): about 4 / 7.5 (1d4 + [Mod] / 1d10 + [Mod] Sl).
- *Brutal Swing* (Special, 2 AP, Round): Terrible damage + Severe condition = High: about 6.5 / 9 (1d8 + [Mod] / 2d6 + [Mod] Sl), and Prone.
- *Hold the Line* (Reaction, 1R, Trigger: an ally within 2 squares is hit): the attacker takes a Medium 1 AP Special one rating up: about 7.5 / 12.5 (1d10 + [Mod] / 3d6 + [Mod] Sl).

**Grave Wisp** (Standard, CV 100): Mind High (+2), Appeal Medium (+1), Instinct Medium (+1), Body Low (0). Power Modifier Medium (+2), Weapon Modifier Medium (+2); it attacks only Ward Defense. Body Health Terrible (×3.75), Mind Health High (×9.75): Health 55 (Vigor 12, Resolve 43). Armor Defense Low (12), Ward Defense High (14). Speed 5, flies (a fast creature: its Vigor is Terrible).
- *Chilling Touch* (Basic attack, Medium, Vs. WD): about 4 / 7.5 ([R] 1d4 + [Mod] / 1d10 + [Mod] Co).
- *Dread Whisper* (Special, 2 AP, Round, Vs. WD, [Fear]): Low damage + Moderate condition = High: about 7.5 / 13 ([R] 1d10 + [Mod] / 3d6 + [Mod] Ps), and Frightened of it (EoT).

**Ogre Chieftain** (Elite, CV 200): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier Medium (+3), Power Modifier Low (+2). Health Medium: 132 (Vigor 73, Resolve 59). Armor Defense Medium (14), Ward Defense Low (13). Speed 4 (slow: High Basic attack). Elite Escalation (the ladder above).
- *Club* (Basic attack, High): about 6.5 / 9.5 (1d6 + [Mod] / 2d6 + [Mod] Bl).
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP: about 13 / 8.5 / 0 (Tier 1 is the worst for them: 3d6 + [Mod] / 1d10 + [Mod] Bl), and Prone on Tier 1. At Escalation 3 it comes back once.
- *Rally the Tribe* (Escalation 2, 1 AP, Round): allies within 5 squares gain 1 Boon on their next [Weapon] Action.
