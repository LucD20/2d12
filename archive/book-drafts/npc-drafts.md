# NPC Drafts (level 1)

Five example NPCs to look at, one per weight class. All numbers come from the system's own formulas: HP = 22 × weight × 1.1 at level 1, split by the archetype; damage is the expected damage of a full turn using the Exp numbers of the Action's Details tab. "DC 13" is a plain roll. "DC 15" is the same attack against a PC with Defense +2 (13 + 2).

Attribute spreads are placeholders: every NPC starts at +1/+1/0/0 and an NPC can change any of them.

## Weight classes

| Weight | × | HP (Professional / Mastermind / Brute) | Expected damage per full turn | Counts as |
|---|---|---|---|---|
| **Minion** | 0.25 | 7 / 7 / 7 | about 4 | 0.25 |
| **Grunt** | 0.75 | 19 / 19 / 19 | about 7 to 9 | 0.75 |
| **Standard** | 1.0 | 25 / 25 / 25 | about 11 to 14 | 1 |
| **Elite** | 1.5 | 37 / 37 / 38 | about 18 to 19 | 1.5 |

"Grunt" is a placeholder name for the 0.75 class. The values live in `TWOD12.weightClasses`.

## Archetypes

| Archetype | Body / Mind split of HP | Attribute spread |
|---|---|---|
| **Professional** | 70% / 30% | +1 Body, +1 Instinct |
| **Mastermind** | 40% / 60% | +1 Instinct, +1 Appeal |
| **Brute** | 80% / 20% | +1 Body, +1 Instinct |

---

## 1. Skeleton: Minion, Professional

- **Attributes:** Body +1, Instinct +1, Mind 0, Appeal 0. **Speed** 5.
- **HP:** 5 Body + 2 Mind = **7**.
- **Weapon:** Rusty Shortsword. Slash, damage 0 / 1d6 / 2d4 (Tier 1 / 2 / 3). Weapon Modifier: Body (+2).
- **Actions:** only the Basic Actions (Weapon Attack, Traverse...). Nothing to author.
- **Damage per turn:** Weapon Attack **3.7** (DC 13) / 2.9 (DC 15).
- **Tests:** minion packs, an NPC going Down (it dies with more Lethal damage), how fast the table can run many weak creatures.

## 2. Goblin Skirmisher: Grunt, Mastermind

- **Attributes:** Instinct +1, Appeal +1. Weapon Modifier: Instinct (+2). **Speed** 5.
- **HP:** 8 Body + 11 Mind = **19**.
- **Weapon:** Dagger. Pierce, 0 / 1d4 / 1d6+1.
- **Own action: Nick and Slip** (Strike, Melee, Weapon, Round). Category: Goblin. Written in the Action Generator:

| AP | Tier 1 | Tier 2 | Tier 3 | Effects |
|---|---|---|---|---|
| 1 | (empty) | `1WB` | `1WB,1d4BP` | |
| 2 | `AtB` | `1WB,1d4BP` | `1WB,1d6BP` | `Evade 1 (T3)` |

- **Damage per turn:** Nick and Slip (2 AP) + Weapon Attack **8.5** (DC 13) / 6.9 (DC 15). With the 1 AP version, 6.8 / 5.3.
- **Tests:** Evade and Safe Movement, a Mind-heavy HP split (8 / 11), a one-action NPC.

## 3. Roadside Bandit: Standard, Professional

- **Attributes:** Body +1, Instinct +1. **Speed** 5.
- **HP:** 17 Body + 8 Mind = **25**.
- **Weapon:** Rusty Shortsword (as above).
- **Own action: Ruthless Cut** (Strike, Melee, Weapon, Round):

| AP | Tier 1 | Tier 2 | Tier 3 | Effects |
|---|---|---|---|---|
| 2 | `AtB` | `1WB,1d6BS` | `1WB,2d6BS` | |
| 3 | `AtB` | `1WB,2d6BS` | `1WB,3d6BS` | `Hindered (T3)` |

- **Damage per turn:** Ruthless Cut (3 AP) + Weapon Attack **13.6** (DC 13) / 11.0 (DC 15). With the 2 AP version, 11.0 / 8.9.
- **Tests:** the baseline Standard creature: how long a fight with one signature action lasts.

## 4. Dire Boar: Standard, Brute

- **Attributes:** Body +1, Instinct +1. **Speed** 5.
- **HP:** 20 Body + 5 Mind = **25**.
- **Weapon:** Tusks (a natural weapon, always wielded). Pierce, 0 / 1d6 / 2d6. Using a weapon gives it the Weapon Modifier (+2); a bare attribute roll would be only +1.
- **Own action: Gore Rush** (Strike, Melee, Weapon, Round):

| AP | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| 2 | `AtB` | `1WB,"Pushed 1"` | `1WB,1d6BB,"Pushed 2"` |
| 3 | `AtB` | `1WB,1d6BB,"Pushed 2"` | `1WB,2d6BB,"Pushed 4"` |

- **Damage per turn:** Gore Rush (3 AP) + Weapon Attack **12.1** (DC 13) / 9.7 (DC 15). With the 2 AP version, 9.6 / 7.7.
- **Tests:** Pushed and Collision used against the PCs, a Body-heavy HP split (20 / 5), natural weapons.

## 5. Skeleton Captain: Elite, Professional

- **Attributes:** Body +1, Instinct +1. **Speed** 5.
- **HP:** 26 Body + 11 Mind = **37**.
- **Weapon:** Greatsword (0 / 1d8 / 2d6). It brings its own action, **Reaping Sweep** (Cleave).
- **Own action: Bone Verdict** (Strike, Melee, Weapon, Round):

| AP | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| 2 | `AtB` | `1WB,1d6BS` | `1WB,1d10BS` |
| 3 | `AtB` | `1WB,1d8BS` | `1WB,2d8BS` |

- **Own action: Rattle of Command** (1 AP, No Tiers, Frequency Round). Effects: `Each ally within 3 can Evade 2.` (every ally clicks the Evade button).
- **Damage per turn:** Reaping Sweep + Weapon Attack + Bone Verdict (3 AP) **19.4** (DC 13) / 15.8 (DC 15). Using Rattle of Command (1 AP) leaves 2 AP for Bone Verdict: 18.0 / 14.7.
- **Tests:** a weapon-granted action on an NPC, Cleave, a leader effect that touches other creatures.

---

## What the numbers say

1. **A +1/+1 NPC lands well under the old damage budget.** A Standard creature with one signature action deals about 12 to 14 in a full turn, not 19. Two things cap it: every Strike has Frequency Round (so Weapon Attack and the signature action are one use each per round) and a creature can make at most 3 Strikes per turn. Attribute +1 and +2 give the same hit chance (the Weapon Modifier is 2 for both), only 1 less damage.
2. **The weight classes work as an encounter cost.** Simulating four level 1 Paladins (36 HP, about 22 damage per turn, focusing the weakest enemy, no Rally):

| Enemies | Counts as | Rounds | Party HP lost | Someone Down |
|---|---|---|---|---|
| 4 Standard | 4 | 2.0 | 16% | 2% |
| 2 Standard + 2 Elite | 5 | 2.3 | 29% | 21% |
| 6 Standard | 6 | 3.1 | 47% | 37% |
| 4 Grunts + 4 Minions | 4 | 2.8 | 27% | 2% |
| 8 Minions | 2 | 2.2 | 11% | 0% |
| 1 Elite + 2 Standard + 4 Minions | 4.5 | 3.0 | 44% | 44% |

   So about **4 slots is Easy, 5 is Hard (about a third of the party's HP), and 6 or more is Deadly.** The Minion rows are generous to the enemies: in the simulation each PC turn kills only one Minion, while a real turn has up to 3 attacks.
3. **Four Standard creatures die in about 2 rounds** to four Paladins, so an encounter needs several bodies, not a few strong ones.
4. **An Elite (37 HP) has more HP than a PC (36), and two Elites die in about 1.5 rounds.** They need support or more damage to threaten anyone.
5. **Minions cost almost nothing to author:** the weapon is their whole stat block. Everything else on this page is one or two signature actions.
