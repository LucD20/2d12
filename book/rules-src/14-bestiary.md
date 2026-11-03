<!-- doc: bestiary -->
# Bestiary: Building NPCs

You build an NPC by picking a **role**, then a **rating** for each of its numbers. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

Each role has a **Combat Value (CV)**: what one NPC of the role counts for in an encounter. It is lower for an NPC of an earlier [[Stages|Stage]] than the party (see [[Building an encounter]]). A typical fight is **4 PCs against enemies with a total CV of 400** (CV 100 per PC). It lasts about **3½ rounds** and costs the party about **a third of its Health**. A level 1 PC deals about 20 to 25 damage a turn to one creature, and has 27 to 40 Health.

| Role | CV | AP a turn | Takes about | Deals about (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | 25 | **3** | one PC hit | 3 |
| **Grunt** | 50 | 5 | 1 PC turn | 6 to 7 |
| **Standard** | 100 | 5 | 2 to 3 PC turns | 10 to 11 |
| **Elite** | 200 | 5 | 5 PC turns | 17 to 18 |

**Minions have 3 AP a turn**, not 5: quick, simple creatures that move and strike, and die fast.

### Minor enemies

**Minor enemies** are Minions and Grunts: the roles with a CV below 100.

## Ratings

Each role has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the role's normal value; the others go down or up from it. Minions have no Extreme. The rows of the Health and Basic attack tables are **[[Stages]]**: **Stage 1** (levels 1 to 4), **Stage 2** (levels 5 to 7) and **Stage 3** (levels 8 to 10). An NPC uses the row of its level's Stage, and nothing changes inside a Stage. Each rating keeps the same step from Medium at every Stage. Attributes, Defenses and Modifiers don't change with the Stage.

- **Attributes**: by default one **High**, two **Medium** and one **Low**.
- **Health**: a rating for the **Body Health Multiplier** and one for the **Mind Health Multiplier**, Medium by default. A brute might have High Body and Low Mind; a ghost, Terrible Body and High Mind.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (see Defenses below).
- **Basic attack**: a rating for its damage (Medium by default).

**The ratings are guidance, not a rule: choose any rating for any number.** As a suggestion, if one number is High, a Low somewhere else usually makes sense (High Armor Defense and Low Health, for example). A creature whose ratings average out to Medium is balanced for its role.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its role's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (14) and a Low Ward Defense (12). A Defense is never below 11. An NPC's Defenses come from these ratings only.

**A Defense rating is a small step.** One rating is 1 point of Defense, which takes about 8 to 10% off what the PCs deal in a turn; a rating of Health or damage is 20 to 25%. A High Defense is worth about +10% Health against +25% for a High Health, so Defense is the mildest of the ratings.

## Attributes and Modifiers

Assign the Attributes to **Body, Mind, Appeal and Instinct**. Choose a **Weapon Attribute** and a **Power Attribute**: each Modifier is **⌈Attribute ÷ 2⌉ + 1**, as for a PC (see [[Weapon, Power and Signature Modifiers]]). Its Vs. Attributes are 13 + half, as for anyone. **An NPC's Modifiers don't grow with its Stage** (its Health and damage tables do), and are never above +4.

## Health

The same formula as a PC, with the role's numbers:

- **Body Damage Threshold** = (Body + 2) × Body Health Multiplier + Health Base
- **Mind Damage Threshold** = (Mind + 2) × Mind Health Multiplier + Health Base
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

Every NPC has one **Basic attack**: its main attack, 1 AP, At-will, Vs. AD (a Weapon Action) or WD (a Power Action). Its damage is the role's (the tables give the **average damage** on Tier 2 and Tier 3, [Mod] included; pick dice that come close). Tier 1 deals nothing, like a Weapon Attack. The weapon in its hands is only what the attack looks like.

**NPCs have no Weapon Attack.** Their Basic attack takes its place: when an Action or rule calls for a Weapon Attack (the Weapon Attack (1A) at the end of a Charge, for example), an NPC uses its Basic attack.

### Special Actions

Special Actions make an NPC interesting. **Every role has them, Minions included.** A Special Action deals the **Basic attack's average damage**, at the rating you give it, **times**:

| AP | Frequency | Damage |
|---|---|---|
| 1 AP | Round | × 1.4 |
| 2 AP | Round | × 2.2 |
| 3 AP | Encounter | × 3.5 |

Minions have at most 2 AP Special Actions (3 AP is their whole turn). For example, a Stage 1 Standard's Medium Basic attack averages 6 / 11: its Medium 2 AP Special averages about 13 / 24.

- **Area Save Actions** (a Save the targets roll, DC 11 + the Modifier): about **half** the damage, to each creature in the area.

### Conditions

A condition is worth **steps of rating**: **Mild 1, Moderate 2, Severe 3**. An Action with a condition lowers its damage rating by that many steps: a **Low** attack with a **Moderate** condition is as strong as a **High** attack. An Action with no damage counts as one step below Terrible.

| Severity | Examples |
|---|---|
| **Mild** | Hindered (EoT); 1 Bane on its next roll; Pushed, Pulled or Slid (any distance); Bright light on it (it can't hide) |
| **Moderate** | Vulnerable 1 (EoT); Immobilized (EoT); Immobilized until it escapes; Enfeebled 1 |
| **Severe** | Prone; Slowed 1; Vulnerable 2 (EoT); Doomed on its next roll |

**Slowed 2** is one step beyond Severe (4 steps). Conditions that cost AP (Prone, Slowed) are the strongest; conditions that only move a creature are the weakest. A condition that lasts longer than EoT, or that a Save can't shake off, is one step more severe, unless the table already lists that duration. A condition on Tier 3 only costs one step less.

### Reactions

- **Minions and Grunts** normally have none.
- **Standards and Elites** may have one or more.
- A Reaction uses AP from the NPC's next turn, as for a PC.
- **A Reaction that doesn't disrupt the triggering Action** (a Trigger, after it) should be **one rating stronger** than an Action of the same AP: it only happens when its trigger does.
- **A Reaction that disrupts it** (an Interrupt that can stop the Action) is worth the same as an Action of the same AP: stopping the Action is its strength.

### Escalation

An Elite can have Escalation (the NPC sheet's switch). Give it one or two Escalation Actions.

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
| **Stage 3** (levels 8-10) | ×0 | ×1.25 | ×1.75 | ×2.25 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Every Stage** | 11 | 11 | 12 | 13 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 1.5 / 3.5 | 2 / 5 | 3 / 5.5 | 3.5 / 7 |
| **Stage 2** (levels 5-7) | 1.5 / 4 | 2.5 / 6 | 3.5 / 6.5 | 4 / 8.5 |
| **Stage 3** (levels 8-10) | 2 / 5 | 3 / 6.5 | 4 / 7.5 | 5 / 9.5 |

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
| **Stage 3** (levels 8-10) | ×3.25 | ×5 | ×6.75 | ×8.25 | ×10 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 3 / 4 | 3.5 / 5 | 4 / 6 | 5.5 / 7.5 | 6 / 9.5 |
| **Stage 2** (levels 5-7) | 3.5 / 5 | 4 / 6 | 5 / 7.5 | 6.5 / 9.5 | 7.5 / 12 |
| **Stage 3** (levels 8-10) | 4 / 6 | 5 / 6.5 | 6 / 8.5 | 7.5 / 10.5 | 8.5 / 13.5 |

With every rating Medium, a Stage 1 grunt has **24 Health** (Stage 2: 26, Stage 3: 34).

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
| **Stage 3** (levels 8-10) | ×6.25 | ×9.25 | ×12.5 | ×15.5 | ×18.75 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 11 | 12 | 13 | 14 | 15 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 4 / 6 | 5 / 8.5 | 6 / 11 | 7.5 / 13 | 9.5 / 16 |
| **Stage 2** (levels 5-7) | 5 / 7.5 | 6 / 10 | 7.5 / 13.5 | 9.5 / 16 | 12 / 19.5 |
| **Stage 3** (levels 8-10) | 6 / 8.5 | 6.5 / 11.5 | 8.5 / 15.5 | 10.5 / 18 | 13.5 / 22 |

With every rating Medium, a Stage 1 standard has **56 Health** (Stage 2: 62, Stage 3: 84).

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
| **Stage 3** (levels 8-10) | ×10.75 | ×16 | ×21.25 | ×26.75 | ×32 |

**Defense (Armor Defense or Ward Defense)**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Every Stage** | 12 | 13 | 14 | 15 | 16 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1** (levels 1-4) | 4 / 6 | 5.5 / 9 | 7 / 11 | 9 / 13.5 | 10.5 / 15.5 |
| **Stage 2** (levels 5-7) | 5 / 7.5 | 7 / 11 | 9 / 13.5 | 11 / 16.5 | 12.5 / 19 |
| **Stage 3** (levels 8-10) | 5.5 / 8.5 | 8 / 12 | 10 / 15 | 12 / 18.5 | 14.5 / 21.5 |

With every rating Medium, a Stage 1 elite has **118 Health** (Stage 2: 136, Stage 3: 182).

## Building an encounter

Add up the CV of the enemies. **CV 100 per PC is a normal fight**: 75 per PC is easy, **125 is hard, 150 is deadly**. Many Minions are cheap but act often: no more than 4 Minions per PC.

**An NPC of an earlier Stage counts for less.** The NPCs of a Stage are the same at every level of it, so only the Stage matters:

| The NPC's Stage is | Minion | Grunt | Standard | Elite |
|---|---|---|---|---|
| the party's Stage | 25 | 50 | 100 | 200 |
| one Stage below | 20 | 40 | 80 | 160 |
| two Stages below | 15 | 30 | 65 | 130 |

What the fight model gives for 4 PCs (all ratings Medium, levels 1 to 3):

| Enemies (total CV) | Rounds | Party Health lost |
|---|---|---|
| 3 Standards (300, easy) | 2½ | about 20% |
| 4 Standards, 1 Elite and 2 Standards, or 8 Grunts (400) | 3½ | about a third |
| 5 Standards, or 1 Elite and 3 Standards (500, hard) | 4½ to 5 | about half |
| 6 Standards, or 2 Elites and 2 Standards (600, deadly) | 6 | half to three quarters; the party wins about 3 times in 4 |

## Example NPCs (Stage 1)

**Goblin Sneak** (Minion, CV 25, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier +2 (Instinct). Body and Mind Health Low (×0.75): Health 6 (3 + 3). Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): about 3 / 5.5 (1d2 + [Mod] / 1d6 + [Mod] Pi).
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: about 3 / 5.5, and Hindered (EoT).

**Orc Warrior** (Standard, CV 100): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier +2 (Body). Body Health High (×9.75), Mind Health Low (×5.75): Health 65 (Body 43, Mind 22). Armor Defense Medium (13), Ward Defense Low (12).
- *Cleaver* (Basic attack, Medium): about 6 / 11 (1d8 + [Mod] / 2d8 + [Mod] Sl).
- *Brutal Swing* (Special, 2 AP, Round): Terrible damage + Severe condition = High: about 9 / 13, and Prone.
- *Hold the Line* (Reaction, Trigger: an ally within 2 squares is hit; 1 AP): the attacker takes a Medium 1 AP Special one rating up: about 10.5 / 18 Sl.

**Ogre Chieftain** (Elite, CV 200): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier +3 (Body). Health Medium: 132 (Body 73, Mind 59). Armor Defense Medium (14), Ward Defense Low (13). Speed 4 (slow: High Basic attack). Escalation on.
- *Club* (Basic attack, High): about 9 / 13.5 (1d10 + [Mod] / 2d10 + [Mod] Bl).
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP: about 19.5 / 12 / 0 (Tier 1 is the worst for them), and Prone on Tier 1.
- *Rally the Tribe* (1 Escalation, 1 AP): allies within 5 squares gain 1 Boon on their next [Weapon] Action.
