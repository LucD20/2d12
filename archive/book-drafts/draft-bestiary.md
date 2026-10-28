# Bestiary (draft v2): Building NPCs

*Draft for discussion. The level 1 numbers come from the PC ruler (`book/npc-ruler.md`) and were checked with the system's own dice math (`book/ruler/`: `ratings.py` makes the tables below). Later levels are left empty until PC levels are written.*

You build an NPC by picking a **role**, then a **rating** for each of its numbers. **An NPC's items are flavor and loot**: its Health, Defenses and damage never come from its weapons or armor.

## The targets

A typical fight is **4 PCs against enemies worth 4** (1 Worth per PC). It lasts about **3 rounds** and costs the party about **40% of its Health**. A level 1 PC deals about 22 to 27 damage a turn to one creature, and has 19 to 36 Health (about 28).

| Role | Worth | AP a turn | Takes about | Deals about (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | ¼ | **3** | one PC hit | 3 to 4 |
| **Grunt** | ½ | 5 | 1 PC turn | 5 |
| **Standard** | 1 | 5 | 2 PC turns | 7 to 8 |
| **Elite** | 2 | 5 | 4 to 5 PC turns | 15 |

**Minions have 3 AP a turn**, not 5: quick, simple creatures that move and strike, and die fast.

## Ratings

Each role has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the role's normal value; the others go down or up from it. Minions have no Extreme.

- **Attributes**: by default one **High**, two **Medium** and one **Low**. You can raise one Attribute by a step if you lower another by a step (a High and a Terrible instead of two Mediums, for example).
- **Health**: a rating for the **Body Health Multiplier** and one for the **Mind Health Multiplier**, Medium by default. A brute might have High Body and Low Mind; a ghost, Terrible Body and High Mind.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (Medium by default; never below 11).
- **Basic attack**: a rating for its damage (Medium by default).

A rating above Medium should be paid for: raise one number, lower another (High Armor Defense and Low Health, for example). The roles' numbers are balanced when they average out to Medium.

## Attributes and Modifiers

Assign the Attributes to **Body, Mind, Appeal and Instinct**. Choose a **Weapon Attribute** and a **Power Attribute**: each Modifier is **⌈Attribute ÷ 2⌉ + 1**, as for a PC. Its Vs. Attributes are 13 + half, as for anyone.

## Health

The same formula as a PC, with the role's numbers:

- **Body Damage Threshold** = (Body + 2) × Body Health Multiplier + Health Base
- **Mind Damage Threshold** = (Mind + 2) × Mind Health Multiplier + Health Base
- **Health Pool** = the two thresholds added together (round each threshold up).

Bloodied, Strained and going Down work as usual (see NPCs Going Down). **A Minion has no Dying: at 0 it dies, or falls Unconscious if the GM prefers.**

## Speed

Speed is **free**: every NPC has Speed 5 unless it says otherwise. But it is strong, so it should be balanced with the rest of the creature:

- **A fast creature** (Speed 6 or more, or one that flies) chooses its fights: it reaches the back line, gets out of reach, and makes the PCs come to it. Give it a downside: Low Health, Low Armor Defense, or a Low Basic attack.
- **A slow creature** (Speed 4 or less) is easy to avoid and to keep away. Give it an upside: High Health, a High Basic attack, or Reach.

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
| **Mild** | Hindered (EoT); 1 bane on its next roll; Pushed or Pulled 1 or 2; Bright light on it (it can't hide) |
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

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | -2 | — | — | — |
| **Low** | -1 | — | — | — |
| **Medium** | +0 | — | — | — |
| **High** | +1 | — | — | — |

**Health Multiplier (Health Base +1)**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | ×0 | — | — | — |
| **Low** | ×0.75 | — | — | — |
| **Medium** | ×1 | — | — | — |
| **High** | ×1.25 | — | — | — |

**Armor Defense / Ward Defense**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 11 / 11 | — | — | — |
| **Low** | 11 / 11 | — | — | — |
| **Medium** | 12 / 11 | — | — | — |
| **High** | 13 / 12 | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 1 / 2.5 | — | — | — |
| **Low** | 1.5 / 3 | — | — | — |
| **Medium** | 2 / 4 | — | — | — |
| **High** | 2.5 / 5 | — | — | — |

With every rating Medium, a level 1 minion has **6 Health**.

### Grunts

**Attributes**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | -2 | — | — | — |
| **Low** | -1 | — | — | — |
| **Medium** | +0 | — | — | — |
| **High** | +1 | — | — | — |
| **Extreme** | +2 | — | — | — |

**Health Multiplier (Health Base +3)**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | ×2.5 | — | — | — |
| **Low** | ×3.75 | — | — | — |
| **Medium** | ×5 | — | — | — |
| **High** | ×6.25 | — | — | — |
| **Extreme** | ×7.5 | — | — | — |

**Armor Defense / Ward Defense**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 11 / 11 | — | — | — |
| **Low** | 12 / 11 | — | — | — |
| **Medium** | 13 / 11 | — | — | — |
| **High** | 14 / 12 | — | — | — |
| **Extreme** | 15 / 13 | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 2 / 2.5 | — | — | — |
| **Low** | 2.5 / 3.5 | — | — | — |
| **Medium** | 3 / 4.5 | — | — | — |
| **High** | 3.5 / 5.5 | — | — | — |
| **Extreme** | 4 / 6.5 | — | — | — |

With every rating Medium, a level 1 grunt has **26 Health**.

### Standards

**Attributes**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | -1 | — | — | — |
| **Low** | +0 | — | — | — |
| **Medium** | +1 | — | — | — |
| **High** | +2 | — | — | — |
| **Extreme** | +3 | — | — | — |

**Health Multiplier (Health Base +4)**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | ×3.5 | — | — | — |
| **Low** | ×5.25 | — | — | — |
| **Medium** | ×7 | — | — | — |
| **High** | ×8.75 | — | — | — |
| **Extreme** | ×10.5 | — | — | — |

**Armor Defense / Ward Defense**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 11 / 11 | — | — | — |
| **Low** | 12 / 11 | — | — | — |
| **Medium** | 13 / 12 | — | — | — |
| **High** | 14 / 13 | — | — | — |
| **Extreme** | 15 / 14 | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 2.5 / 4.5 | — | — | — |
| **Low** | 3.5 / 6 | — | — | — |
| **Medium** | 4.5 / 7.5 | — | — | — |
| **High** | 5.5 / 9 | — | — | — |
| **Extreme** | 6.5 / 10.5 | — | — | — |

With every rating Medium, a level 1 standard has **50 Health**.

### Elites

**Attributes**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | +0 | — | — | — |
| **Low** | +1 | — | — | — |
| **Medium** | +2 | — | — | — |
| **High** | +3 | — | — | — |
| **Extreme** | +4 | — | — | — |

**Health Multiplier (Health Base +6)**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | ×6 | — | — | — |
| **Low** | ×9 | — | — | — |
| **Medium** | ×12 | — | — | — |
| **High** | ×15 | — | — | — |
| **Extreme** | ×18 | — | — | — |

**Armor Defense / Ward Defense**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 12 / 11 | — | — | — |
| **Low** | 13 / 12 | — | — | — |
| **Medium** | 14 / 13 | — | — | — |
| **High** | 15 / 14 | — | — | — |
| **Extreme** | 16 / 15 | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Rating | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| **Terrible** | 4 / 6 | — | — | — |
| **Low** | 5 / 8 | — | — | — |
| **Medium** | 6.5 / 10 | — | — | — |
| **High** | 8 / 12 | — | — | — |
| **Extreme** | 9 / 14 | — | — | — |

With every rating Medium, a level 1 elite has **108 Health**.

## Building an encounter

Add up the Worth of the enemies. **1 Worth per PC is a normal fight**: ¾ is easy, 1½ is hard, 2 is deadly. Many Minions are cheap but act often: no more than 4 Minions per PC.

What the fight model gives for 4 PCs (all ratings Medium):

| Enemies | Rounds | Party Health lost |
|---|---|---|
| 4 Standards | 3 | about 40% |
| 1 Elite and 2 Standards | 3 | about 45% |
| 2 Elites | 3 | about 55% |

## Example NPCs (level 1)

**Goblin Sneak** (Minion, Worth ¼, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Attribute Instinct (+2). Body and Mind Health Low (×0.75): Health 6 (3 + 3). AD Medium 12, WD 11. **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): about 2 / 4 ([Mod] / 1d4 + [Mod] Pi).
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: about 2 / 4, and Hindered (EoT).

**Orc Warrior** (Standard, Worth 1): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Attribute Body (+2). Body Health High (×8.75), Mind Health Low (×5.25): Health 59 (Body 39, Mind 20). AD 13, WD 12.
- *Cleaver* (Basic attack, Medium): about 4.5 / 7.5 (1d4 + [Mod] / 1d10 + [Mod] Sl).
- *Brutal Swing* (Special, 2 AP, Round): Low damage + Moderate condition = High: about 7.5 / 13, and Prone.
- *Hold the Line* (Reaction, Trigger: an ally within 2 squares is hit; 1 AP): the attacker takes a Medium 1 AP Special one rating up: about 7.5 / 12.5 Sl.

**Ogre Chieftain** (Elite, Worth 2): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Attribute Body (+3). Health Medium: 120 (Body 66, Mind 54). AD 14, WD 13. Speed 4 (slow: High Basic attack). Escalation on.
- *Club* (Basic attack, High): about 8 / 12 (1d8 + [Mod] / 2d6 + [Mod] Bl).
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP: about 17.5 / 11.5 / 0 (Tier 1 is the worst for them), and Prone on Tier 1.
- *Rally the Tribe* (1 Escalation, 1 AP): allies within 5 squares gain 1 boon on their next Basic attack.

## Open questions

1. **Condition severities**: is the list right (which conditions are Mild, Moderate, Severe)? Missing ones?
2. **Trading ratings**: is "raise one, lower another" the rule you want for Attributes and the other numbers, or should each role have a fixed default spread you adjust only for flavor?
3. **Minions' Terrible Health Multiplier ×0**: their Body or Mind threshold is then only the Health Base (1). Intended?

## Decisions after v2 (apply in v3)

- **Tables:** the rows are the **levels** (Level 1, 2, 3, 4...), the columns are the ratings (**Terrible, Low, Medium, High, Extreme**). One table per stat per role (Attributes, Health Multiplier, Defense, Basic attack). Level 1 is filled; the other levels stay empty until PC levels are written. Minions have no Extreme.
- **Ratings are guidance, not a rule:** "if one number is High, one Low usually makes sense", but the choice is free. Take out "must be paid for" wording; keep it as a suggestion.
- **Minions:** 3 AP a turn (keep). The **Terrible Health Multiplier of ×0 is intended** (their threshold is then only the Health Base).
- **Defenses (new):** each role has **one Defense table with a single value per rating** (not an "AD / WD" pair). When you create the NPC you pick a rating for **Armor Defense** and a rating for **Ward Defense**, independently (a Standard defaults to 13 and 13; a knight could be 14 and 12). The role-specific Ward offset goes away. Level 1 values to check with ratings.py: Minion 11 / 11 / 12 / 13; Grunt and Standard 11 to 15; Elite 12 to 16 (never below 11).
- Kept: Health as written (Elite Worth 2), Speed free with its own section, conditions as Mild / Moderate / Severe steps, Reactions guidance, Special Actions x1.4 / x2.2 / x3.5, area Save actions at half.
