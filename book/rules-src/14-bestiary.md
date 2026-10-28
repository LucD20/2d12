<!-- doc: bestiary -->
# Bestiary: Building NPCs

You build an NPC by picking a **role**, then a **rating** for each of its numbers. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

Each role has a **CV Multiplier**: at level 1, an NPC's **Combat Value (CV)** is its role's CV Multiplier (later levels are not written yet). A typical fight is **4 PCs against enemies with a total CV of 4** (CV 1 per PC). It lasts about **3 rounds** and costs the party about **40% of its Health**. A level 1 PC deals about 22 to 27 damage a turn to one creature, and has 19 to 36 Health (about 28).

| Role | CV Multiplier | AP a turn | Takes about | Deals about (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | ¼ | **3** | one PC hit | 3 to 4 |
| **Grunt** | ½ | 5 | 1 PC turn | 5 |
| **Standard** | 1 | 5 | 2 PC turns | 7 to 8 |
| **Elite** | 2 | 5 | 4 to 5 PC turns | 15 |

**Minions have 3 AP a turn**, not 5: quick, simple creatures that move and strike, and die fast.

### Minor enemies

**Minor enemies** are Minions and Grunts: the roles with a CV Multiplier below 1.

## Ratings

Each role has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the role's normal value; the others go down or up from it. Minions have no Extreme. The rows of a table are **levels**: levels 1 to 3 are filled; level 4 waits for the PC levels. NPCs grow with the party: from level 2 an NPC's Health follows the PCs' damage and its damage follows the PCs' Health. A Medium NPC keeps exact pace with the PCs, a Low or Terrible one falls a little behind each level and a High or Extreme one pulls a little ahead (about 2% to 5% a level in how hard the fight is), and a level 1 Basic attack is a little higher than a bare calculation would give. The tables already include all of it; Attributes and Defenses don't change.

> [!tbd]
> Level 4 and up are empty until those PC levels are written.

- **Attributes**: by default one **High**, two **Medium** and one **Low**.
- **Health**: a rating for the **Body Health Multiplier** and one for the **Mind Health Multiplier**, Medium by default. A brute might have High Body and Low Mind; a ghost, Terrible Body and High Mind.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (see Defenses below).
- **Basic attack**: a rating for its damage (Medium by default).

**The ratings are guidance, not a rule: choose any rating for any number.** As a suggestion, if one number is High, a Low somewhere else usually makes sense (High Armor Defense and Low Health, for example). A creature whose ratings average out to Medium is balanced for its role.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its role's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (14) and a Low Ward Defense (12). A Defense is never below 11. An NPC's Defenses come from these ratings only.

**A Defense rating is a small step.** One rating is 1 point of Defense, which takes about 8 to 10% off what the PCs deal in a turn; a rating of Health or damage is 20 to 25%. A High Defense is worth about +10% Health against +25% for a High Health, so Defense is the mildest of the ratings.

## Attributes and Modifiers

Assign the Attributes to **Body, Mind, Appeal and Instinct**. Choose a **Weapon Attribute** and a **Power Attribute**: each Modifier is **⌈Attribute ÷ 2⌉ + 1**, as for a PC (see [[Weapon, Power and Signature Modifiers]]). Its Vs. Attributes are 13 + half, as for anyone.

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

### Special Actions

Special Actions make an NPC interesting. **Every role has them, Minions included.** A Special Action deals the **Basic attack's average damage**, at the rating you give it, **times**:

| AP | Frequency | Damage |
|---|---|---|
| 1 AP | Round | × 1.4 |
| 2 AP | Round | × 2.2 |
| 3 AP | Encounter | × 3.5 |

Minions have at most 2 AP Special Actions (3 AP is their whole turn). For example, a level 1 Standard's Medium Basic attack averages 4.5 / 7.5: its Medium 2 AP Special averages about 10 / 16.5.

- **Area Save Actions** (a Save the targets roll, DC 11 + the Modifier): about **half** the damage, to each creature in the area.

### Conditions

A condition is worth **steps of rating**: **Mild 1, Moderate 2, Severe 3**. An Action with a condition lowers its damage rating by that many steps: a **Low** attack with a **Moderate** condition is as strong as a **High** attack. An Action with no damage counts as one step below Terrible.

| Severity | Examples |
|---|---|
| **Mild** | Hindered (EoT); 1 Bane on its next roll; Pushed or Pulled 1 or 2; Bright light on it (it can't hide) |
| **Moderate** | Prone; Vulnerable 1 (EoT); Immobilized (EoT); Enfeebled 1; Slowed 1; Pushed 3 or more |
| **Severe** | Vulnerable 2 (EoT); Immobilized until it escapes; Slowed 2; Doomed on its next roll |

A condition that lasts longer than EoT, or that a Save can't shake off, is one step more severe. A condition on Tier 3 only costs one step less.

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

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | -2 | -1 | +0 | +1 |
| **Level 2** | -2 | -1 | +0 | +1 |
| **Level 3** | -2 | -1 | +0 | +1 |
| **Level 4** | — | — | — | — |

**Health Multiplier (Health Base +1)**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | ×0 | ×0.75 | ×1 | ×1.25 |
| **Level 2** | ×0 | ×0.75 | ×1.25 | ×1.5 |
| **Level 3** | ×0 | ×0.75 | ×1.25 | ×1.5 |
| **Level 4** | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | 11 | 11 | 12 | 13 |
| **Level 2** | 11 | 11 | 12 | 13 |
| **Level 3** | 11 | 11 | 12 | 13 |
| **Level 4** | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | 1 / 2.5 | 1.5 / 3.5 | 2 / 4 | 2.5 / 5 |
| **Level 2** | 1.5 / 2.5 | 2 / 3.5 | 2.5 / 4.5 | 3 / 5.5 |
| **Level 3** | 1.5 / 3 | 2 / 4 | 2.5 / 5 | 3 / 6 |
| **Level 4** | — | — | — | — |

With every rating Medium, a level 1 minion has **6 Health**.

### Grunts

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | -2 | -1 | +0 | +1 | +2 |
| **Level 2** | -2 | -1 | +0 | +1 | +2 |
| **Level 3** | -2 | -1 | +0 | +1 | +2 |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +3)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×2.5 | ×3.75 | ×5 | ×6.25 | ×7.5 |
| **Level 2** | ×3 | ×4 | ×5.5 | ×7 | ×8.5 |
| **Level 3** | ×2.5 | ×4 | ×5.5 | ×7.5 | ×9 |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 11 | 12 | 13 | 14 | 15 |
| **Level 2** | 11 | 12 | 13 | 14 | 15 |
| **Level 3** | 11 | 12 | 13 | 14 | 15 |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 2 / 3 | 2.5 / 3.5 | 3 / 4.5 | 4 / 5.5 | 4.5 / 7 |
| **Level 2** | 2 / 3 | 2.5 / 4 | 3.5 / 5 | 4 / 6.5 | 5 / 7.5 |
| **Level 3** | 2 / 3 | 3 / 4.5 | 3.5 / 5.5 | 4.5 / 7 | 5.5 / 8.5 |
| **Level 4** | — | — | — | — | — |

With every rating Medium, a level 1 grunt has **26 Health**.

### Standards

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | -1 | +0 | +1 | +2 | +3 |
| **Level 2** | -1 | +0 | +1 | +2 | +3 |
| **Level 3** | -1 | +0 | +1 | +2 | +3 |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +4)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×3.5 | ×5.25 | ×7 | ×8.75 | ×10.5 |
| **Level 2** | ×4 | ×6 | ×8 | ×10 | ×12 |
| **Level 3** | ×4 | ×6 | ×8 | ×10 | ×12.5 |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 11 | 12 | 13 | 14 | 15 |
| **Level 2** | 11 | 12 | 13 | 14 | 15 |
| **Level 3** | 11 | 12 | 13 | 14 | 15 |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 3 / 4.5 | 3.5 / 6 | 4.5 / 8 | 5.5 / 9.5 | 7 / 11.5 |
| **Level 2** | 3 / 5 | 4 / 6.5 | 5 / 8.5 | 6.5 / 10.5 | 7.5 / 12.5 |
| **Level 3** | 3 / 5 | 4.5 / 7 | 5.5 / 9.5 | 7 / 11.5 | 8.5 / 14 |
| **Level 4** | — | — | — | — | — |

With every rating Medium, a level 1 standard has **50 Health**.

### Elites

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | +0 | +1 | +2 | +3 | +4 |
| **Level 2** | +0 | +1 | +2 | +3 | +4 |
| **Level 3** | +0 | +1 | +2 | +3 | +4 |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +6)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×6 | ×9 | ×12 | ×15 | ×18 |
| **Level 2** | ×6.5 | ×10 | ×13.5 | ×17.5 | ×21 |
| **Level 3** | ×6.5 | ×10 | ×13.5 | ×17.5 | ×21.5 |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 12 | 13 | 14 | 15 | 16 |
| **Level 2** | 12 | 13 | 14 | 15 | 16 |
| **Level 3** | 12 | 13 | 14 | 15 | 16 |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 4 / 6 | 5.5 / 8.5 | 7 / 10.5 | 8.5 / 13 | 10 / 15 |
| **Level 2** | 4.5 / 6.5 | 6 / 9 | 7.5 / 11.5 | 9 / 14 | 11 / 17 |
| **Level 3** | 4.5 / 7 | 6 / 9.5 | 8 / 12.5 | 10 / 15.5 | 12 / 18.5 |
| **Level 4** | — | — | — | — | — |

With every rating Medium, a level 1 elite has **108 Health**.

## Building an encounter

Add up the CV of the enemies. **CV 1 per PC is a normal fight**: ¾ is easy, 1½ is hard, 2 is deadly. Many Minions are cheap but act often: no more than 4 Minions per PC.

What the fight model gives for 4 PCs (all ratings Medium):

| Enemies | Rounds | Party Health lost |
|---|---|---|
| 4 Standards | 3 | about 40% |
| 1 Elite and 2 Standards | 3 | about 45% |
| 2 Elites | 3 | about 55% |

## Example NPCs (level 1)

**Goblin Sneak** (Minion, CV ¼, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier +2 (Instinct). Body and Mind Health Low (×0.75): Health 6 (3 + 3). Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): about 2 / 4 ([Mod] / 1d4 + [Mod] Pi).
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: about 2 / 4, and Hindered (EoT).

**Orc Warrior** (Standard, CV 1): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier +2 (Body). Body Health High (×8.75), Mind Health Low (×5.25): Health 59 (Body 39, Mind 20). Armor Defense Medium (13), Ward Defense Low (12).
- *Cleaver* (Basic attack, Medium): about 4.5 / 7.5 (1d4 + [Mod] / 1d10 + [Mod] Sl).
- *Brutal Swing* (Special, 2 AP, Round): Low damage + Moderate condition = High: about 7.5 / 13, and Prone.
- *Hold the Line* (Reaction, Trigger: an ally within 2 squares is hit; 1 AP): the attacker takes a Medium 1 AP Special one rating up: about 7.5 / 12.5 Sl.

**Ogre Chieftain** (Elite, CV 2): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier +3 (Body). Health Medium: 120 (Body 66, Mind 54). Armor Defense Medium (14), Ward Defense Low (13). Speed 4 (slow: High Basic attack). Escalation on.
- *Club* (Basic attack, High): about 8 / 12 (1d8 + [Mod] / 2d8 + [Mod] Bl).
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP: about 17.5 / 11.5 / 0 (Tier 1 is the worst for them), and Prone on Tier 1.
- *Rally the Tribe* (1 Escalation, 1 AP): allies within 5 squares gain 1 Boon on their next Basic attack.
