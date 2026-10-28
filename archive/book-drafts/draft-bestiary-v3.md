# Bestiary (draft v3): Building NPCs

*Draft for discussion. The level 1 numbers come from the PC ruler (`book/npc-ruler.md`) and were checked with the system's own dice math (`book/ruler/`: `ratings.py` makes the tables below; `defense.mjs` and `tablecheck.mjs` check them). Later levels are left empty until PC levels are written.*

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

Each role has tables (below) with five **ratings**: **Terrible, Low, Medium, High, Extreme**. Medium is the role's normal value; the others go down or up from it. Minions have no Extreme. The rows of a table are **levels**; only level 1 is filled for now.

- **Attributes**: by default one **High**, two **Medium** and one **Low**.
- **Health**: a rating for the **Body Health Multiplier** and one for the **Mind Health Multiplier**, Medium by default. A brute might have High Body and Low Mind; a ghost, Terrible Body and High Mind.
- **Defenses**: a rating for **Armor Defense** and one for **Ward Defense** (see Defenses below).
- **Basic attack**: a rating for its damage (Medium by default).

**The ratings are guidance, not a rule: choose any rating for any number.** As a suggestion, if one number is High, a Low somewhere else usually makes sense (High Armor Defense and Low Health, for example). A creature whose ratings average out to Medium is balanced for its role.

## Defenses

An NPC has an **Armor Defense** and a **Ward Defense**. Each one is a rating from its role's Defense table, picked **independently** of the other: a Standard is Medium in both by default (13 and 13); a knight could have a High Armor Defense (14) and a Low Ward Defense (12). A Defense is never below 11. An NPC's Defenses come from these ratings only.

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

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | -2 | -1 | +0 | +1 |
| **Level 2** | — | — | — | — |
| **Level 3** | — | — | — | — |
| **Level 4** | — | — | — | — |

**Health Multiplier (Health Base +1)**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | ×0 | ×0.75 | ×1 | ×1.25 |
| **Level 2** | — | — | — | — |
| **Level 3** | — | — | — | — |
| **Level 4** | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | 11 | 11 | 12 | 13 |
| **Level 2** | — | — | — | — |
| **Level 3** | — | — | — | — |
| **Level 4** | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Level 1** | 1 / 2.5 | 1.5 / 3 | 2 / 4 | 2.5 / 5 |
| **Level 2** | — | — | — | — |
| **Level 3** | — | — | — | — |
| **Level 4** | — | — | — | — |

With every rating Medium, a level 1 minion has **6 Health**.

### Grunts

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | -2 | -1 | +0 | +1 | +2 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +3)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×2.5 | ×3.75 | ×5 | ×6.25 | ×7.5 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 11 | 12 | 13 | 14 | 15 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 2 / 2.5 | 2.5 / 3.5 | 3 / 4.5 | 3.5 / 5.5 | 4 / 6.5 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

With every rating Medium, a level 1 grunt has **26 Health**.

### Standards

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | -1 | +0 | +1 | +2 | +3 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +4)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×3.5 | ×5.25 | ×7 | ×8.75 | ×10.5 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 11 | 12 | 13 | 14 | 15 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 2.5 / 4.5 | 3.5 / 6 | 4.5 / 7.5 | 5.5 / 9 | 6.5 / 10.5 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

With every rating Medium, a level 1 standard has **50 Health**.

### Elites

**Attributes**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | +0 | +1 | +2 | +3 | +4 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Health Multiplier (Health Base +6)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | ×6 | ×9 | ×12 | ×15 | ×18 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Defense (Armor Defense or Ward Defense)**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 12 | 13 | 14 | 15 | 16 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

**Basic attack, average damage: Tier 2 / Tier 3**

| Level | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Level 1** | 4 / 6 | 5 / 8 | 6.5 / 10 | 8 / 12 | 9 / 14 |
| **Level 2** | — | — | — | — | — |
| **Level 3** | — | — | — | — | — |
| **Level 4** | — | — | — | — | — |

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

**Goblin Sneak** (Minion, Worth ¼, 3 AP): Instinct High (+1), Body Medium (0), Mind Medium (0), Appeal Low (−1). Weapon Modifier +2 (Instinct). Body and Mind Health Low (×0.75): Health 6 (3 + 3). Armor Defense Medium (12), Ward Defense Low (11). **Speed 7** (fast: its Health is Low).
- *Rusty Knife* (Basic attack, Medium): about 2 / 4 ([Mod] / 1d4 + [Mod] Pi).
- *Dirty Trick* (Special, 1 AP, Round): Low damage + Mild condition = Medium: about 2 / 4, and Hindered (EoT).

**Orc Warrior** (Standard, Worth 1): Body High (+2), Instinct Medium (+1), Mind Medium (+1), Appeal Low (0). Weapon Modifier +2 (Body). Body Health High (×8.75), Mind Health Low (×5.25): Health 59 (Body 39, Mind 20). Armor Defense Medium (13), Ward Defense Low (12).
- *Cleaver* (Basic attack, Medium): about 4.5 / 7.5 (1d4 + [Mod] / 1d10 + [Mod] Sl).
- *Brutal Swing* (Special, 2 AP, Round): Low damage + Moderate condition = High: about 7.5 / 13, and Prone.
- *Hold the Line* (Reaction, Trigger: an ally within 2 squares is hit; 1 AP): the attacker takes a Medium 1 AP Special one rating up: about 7.5 / 12.5 Sl.

**Ogre Chieftain** (Elite, Worth 2): Body High (+3), Instinct Medium (+2), Mind Medium (+2), Appeal Low (+1). Weapon Modifier +3 (Body). Health Medium: 120 (Body 66, Mind 54). Armor Defense Medium (14), Ward Defense Low (13). Speed 4 (slow: High Basic attack). Escalation on.
- *Club* (Basic attack, High): about 8 / 12 (1d8 + [Mod] / 2d8 + [Mod] Bl).
- *Ground Slam* (Special, 3 AP, Encounter, Area 1 Emanation, a Save Action: Body Save, DC 14): half of a Medium 3 AP: about 17.5 / 11.5 / 0 (Tier 1 is the worst for them), and Prone on Tier 1.
- *Rally the Tribe* (1 Escalation, 1 AP): allies within 5 squares gain 1 boon on their next Basic attack.

## Open questions

1. **Condition severities** (open since v2): is the list right (which conditions are Mild, Moderate, Severe)? Missing ones?
2. **How big is a Defense rating?** One rating of Defense is 1 point, and the dice math says 1 point costs the PCs about 8 to 10% of their damage (see Checks). A Health or damage rating is 20 to 25%. So High Defense (+1) is worth about +10% Health against +25% for High Health, and Extreme Defense (+2) about +21% against +50% for Extreme Health. Keep it as is (Defense is the cheap, mild lever, and the guidance can say so), or make High and Extreme Defense worth 2 points each (a Standard Extreme would be 17)?
3. **An NPC's Defenses come from the ratings only** (I wrote it that way). A PC's Ward Defense is 11 + Power Modifier, an NPC's is its table value whatever its Power Modifier is. Is that right?

## Checks (not part of the chapter)

All with the system's dice math (`book/ruler/defense.mjs`, `tablecheck.mjs`), level 1, Modifier +2.

**What a Defense value costs the PCs** (damage a turn; Paladin = Smite 2 AP + two Weapon Attacks, Archer = Double Shot + Wing Clip + Lock & Loose, no quarry):

| Defense | Paladin | Archer | Mean | Against Defense 13 | Like Health × |
|---|---|---|---|---|---|
| 11 | 25.9 | 28.1 | 27.0 | +16% | ×0.86 |
| 12 | 24.3 | 26.2 | 25.2 | +8% | ×0.92 |
| **13** | 22.5 | 24.1 | 23.3 | | ×1 |
| 14 | 20.7 | 21.9 | 21.3 | −9% | ×1.10 |
| 15 | 18.8 | 19.5 | 19.2 | −18% | ×1.21 |
| 16 | 17.2 | 17.4 | 17.3 | −26% | ×1.35 |

- **Power now equals Weapon.** At level 1 both Modifiers are +2, so a Smite against Ward Defense 13 deals the same as a Weapon Attack against Armor Defense 13 (22.5 for the Paladin's turn). In v2 a Standard's Ward Defense was 12 and the same turn dealt 24.3: **7% less now**, which is the old advantage of Power Actions gone.
- **Time to kill** a Medium-Health NPC, in PC turns, by its Defense rating (Terrible to Extreme): Grunt (26 Health) 0.96 / 1.03 / 1.12 / 1.22 / 1.35; Standard (50) 1.85 / 1.98 / 2.15 / 2.35 / 2.60; Elite (108) 4.28 / 4.63 / 5.08 / 5.63 / 6.25; Minion (6) 0.22 to 0.26. The Medium Standard still dies in about 2 PC turns and the Elite in about 5, as the targets say.
- **The Basic attack tables hit the targets.** Damage a turn against a PC Defense of 13 and 14 averaged, all ratings: Grunt 2.8 / 3.7 / 4.6 / 5.5 / 6.4 (target 5, Medium 4.6); Standard 4.2 / 5.7 / 7.3 / 8.8 / 10.3 (target 7 to 8); Elite 9.7 / 12.5 / 16.0 / 19.5 / 22.3 (target 15). A Minion dealing 3.5 at Medium (target 3 to 4) assumes its 3 AP are a move and two attacks.
- **NPCs against the new PC Ward Defense.** A PC's Ward Defense is 11 + Power Modifier (1 to 3), so 12 to 14, and at level 1 almost always 13. A Medium Standard deals 8.5 / 7.7 / 6.8 a turn against Defense 12 / 13 / 14 (Elite 18.5 / 16.9 / 15.2), so the targets hold for Power Actions too. A PC with Power Modifier +1 (Ward Defense 12) takes about 10% more.
- **A Minion's Terrible and Low Defense are both 11**, because a Defense is never below 11.

**Changed from v2:** the tables (levels as rows, ratings as columns, one Defense table per role; the Ward offset is gone, so a Medium Ward Defense is now 12 / 13 / 13 / 14 for Minion / Grunt / Standard / Elite instead of 11 / 11 / 12 / 13); the "must be paid for" wording; Minion Terrible Health ×0 kept as intended; the Defenses section. **Fixes in the examples:** the Ogre's Club is 1d8 / **2d8** (+[Mod]) to reach the High Elite's 8 / 12 (2d6 only gives 10); the Weapon Attributes are written as Weapon **Modifier** (the Goblin said "Attribute +2" with Instinct +1); the examples' Defenses are written as ratings (v2's 13 / 12 and 14 / 13 pairs are Medium and Low).
