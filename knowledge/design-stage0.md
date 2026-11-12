# The Stage 0 run: a prototype (levels 1 to 3)

Written by `node book/ruler/sim/stage0.mjs`; don't edit, run it again. **Nothing here is in the book**: it is the numbers for Stage 0 as `book/decisions-s1.md` describes it, for Lucas to decide on.

Runs: 600 fights a cell on the open field, 300 on a map. Each fight cell: rounds · Health lost · cost (with the Rally Points spent) · a PC Down · won. The decisions are the plan policy's unless a column says otherwise (the Bestiary's target is the plan's: Lucas, 2026-11-12).

**What Stage 0 is here:** the four R builds (Smite and Lay On Hands Paladins, Double Shot and Rolling Shot Archers; Human, 35 and 29 Health, Modifiers +2 / +1, Rally + 1, Guard 2 an unused AP) with only what their level gives; **Escalation runs 1 to 6**, starts at 1 + Momentum (0 to 4), +1 a round, +1 on a Critical and on the class's hook; the Passives sit at Escalation 2, 4 and 6; no Apex, no Daily, no Talents. The enemies are today's Stage 1 rows unless a section fits them.

| Level | Paladin (Smite / Lay On Hands) | Archer (Double Shot / Rolling Shot) |
|---|---|---|
| 1 | Smite or Lay On Hands; Rebuke or Shield of Faith; at Escalation 4: Searing Blows / Mending Light | Sharpshooter, Marked Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; at Escalation 4: Hunter's Edge |
| 2 | + the hook (Kindled Wrath); Holy Wrath (Encounter); at Escalation 2: Radiant Zeal / Font of Mercy | + the hook (Thrill of the Kill); Pinning Shot (Encounter); at Escalation 2: Killer's Focus |
| 3 | + at Escalation 6: Reckoning / Hallowed Stance | + at Escalation 6: Finisher |

## 1. A turn's damage by level and Escalation

The build's planned turn against Defense 13 (20,000 turns; one target; no Reactions).

| Build | Level | Turn | Escalation 1 | 2 | 4 | 6 |
|---|---:|---|---:|---:|---:|---:|
| Paladin (Smite) | 1 | Main | 22.6 | 22.6 | 27.3 | 27.3 |
| Paladin (Smite) | 2 | Nova | 24.1 | 27.6 | 31.1 | 31.1 |
| Paladin (Smite) | 2 | Main | 22.6 | 26.0 | 30.8 | 30.8 |
| Paladin (Smite) | 3 | Nova | 24.1 | 27.6 | 31.1 | 31.1 |
| Paladin (Smite) | 3 | Main | 22.6 | 26.0 | 30.8 | 30.8 |
| Paladin (Lay On Hands) | 1 | Main | 7.8 | 7.8 | 7.8 | 7.8 |
| Paladin (Lay On Hands) | 2 | Nova | 12.6 | 12.6 | 12.6 | 12.6 |
| Paladin (Lay On Hands) | 2 | Main | 7.8 | 7.8 | 7.8 | 7.8 |
| Paladin (Lay On Hands) | 3 | Nova | 12.6 | 12.6 | 12.6 | 12.6 |
| Paladin (Lay On Hands) | 3 | Main | 7.8 | 7.8 | 7.8 | 7.8 |
| Archer (Double Shot) | 1 | Main | 25.2 | 25.2 | 27.6 | 27.6 |
| Archer (Double Shot) | 2 | Pin | 25.6 | 29.1 | 31.6 | 31.6 |
| Archer (Double Shot) | 3 | Pin | 25.6 | 29.1 | 31.6 | 31.6 |
| Archer (Rolling Shot) | 1 | Main | 21.8 | 21.8 | 24.3 | 24.3 |
| Archer (Rolling Shot) | 2 | Pin | 21.8 | 25.3 | 27.8 | 27.8 |
| Archer (Rolling Shot) | 3 | Pin | 21.8 | 25.3 | 27.8 | 27.8 |

## 2. Escalation 1 to 6: where the turns are

The normal fight (4 Standards, today's rows), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.

| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |
|---:|---:|---:|---:|---:|---:|---|---|
| 0 | 1 | 29% | 37% | 29% | 5% | 71% / 34% / 5% | 4.0 · 22% · 40% · 30% · 99% |
| 1 | 2 | 0% | 47% | 40% | 13% | 100% / 53% / 13% | 3.8 · 19% · 35% · 28% · 99% |
| 2 | 3 | 0% | 31% | 39% | 30% | 100% / 69% / 30% | 3.6 · 16% · 30% · 24% · 100% |
| 3 | 4 | 0% | 0% | 49% | 51% | 100% / 100% / 51% | 3.5 · 12% · 24% · 18% · 99% |
| 4 | 5 | 0% | 0% | 32% | 68% | 100% / 100% / 68% | 3.5 · 10% · 21% · 16% · 100% |

## 3. Levels 1 to 3 against today's Stage 1 rows (4 Standards)

| Level | Momentum 0 | Momentum 2 | Momentum 4 |
|---:|---|---|---|
| 1 | 4.3 · 31% · 52% · 40% · 95% | 4.1 · 26% · 43% · 36% · 98% | 3.9 · 20% · 35% · 27% · 99% |
| 2 | 4.0 · 24% · 42% · 35% · 98% | 3.7 · 16% · 31% · 23% · 99% | 3.6 · 16% · 29% · 23% · 99% |
| 3 | 4.0 · 22% · 40% · 30% · 99% | 3.6 · 16% · 30% · 24% · 100% | 3.5 · 10% · 21% · 16% · 100% |

For scale, today's level 1 party (the three Passives at Escalation 1 / 2 / 3, the hook, Holy Wrath and Pinning Shot, the Apex) in report.md: 3.7 rounds, 14% of its Health lost, a PC Down in 24%.

## 4. The Bestiary's Stage 0 row: the fit

For each level and Momentum: **h**, the NPC Health factor over today's Stage 1 row for which the normal fight lasts 3.5 rounds; then the NPC damage factor **d** for each of the Bestiary's two targets: the fight costs a fifth of the party's Health (the Rally Points it spends counted), and a PC goes Down in 1 fight of 5. As pack R-bestiary found, the two don't meet at one number.

| Level | Momentum | h (3.5 rounds) | d for a cost of a fifth | The fight there | d for a Down in 1 of 5 | The fight there |
|---:|---:|---:|---:|---|---:|---|
| 1 | 0 | × 0.79 | × 0.61 | 3.3 · 7% · 20% · 2% · 100% | × 0.93 | 3.4 · 20% · 36% · 21% · 100% |
| 1 | 2 | × 0.87 | × 0.71 | 3.4 · 8% · 20% · 5% · 100% | × 0.91 | 3.5 · 16% · 31% · 19% · 100% |
| 2 | 0 | × 0.88 | × 0.66 | 3.4 · 7% · 20% · 4% · 100% | × 0.93 | 3.5 · 16% · 32% · 19% · 100% |
| 2 | 2 | × 0.94 | × 0.79 | 3.3 · 8% · 20% · 7% · 100% | × 1.01 | 3.5 · 16% · 30% · 24% · 99% |
| 3 | 0 | × 0.88 | × 0.66 | 3.4 · 7% · 19% · 2% · 100% | × 0.94 | 3.6 · 18% · 33% · 24% · 99% |
| 3 | 2 | × 0.94 | × 0.79 | 3.3 · 7% · 19% · 6% · 100% | × 0.96 | 3.4 · 14% · 27% · 18% · 99% |

**The Stage 0 row used below: today's Stage 1 rows with Health × 0.90 and damage × 0.85**: level 2's fit (the mean of Momentum 0 and 2), its damage halfway between the two targets, rounded to 0.05. Lucas decides the row; this one is to have numbers to look at. With it:

| Level | Momentum 0 | Momentum 2 | Momentum 4 |
|---:|---|---|---|
| 1 | 3.8 · 19% · 37% · 19% · 100% | 3.6 · 15% · 30% · 16% · 100% | 3.4 · 12% · 23% · 12% · 100% |
| 2 | 3.5 · 13% · 29% · 15% · 100% | 3.3 · 9% · 21% · 8% · 100% | 3.2 · 8% · 18% · 8% · 100% |
| 3 | 3.5 · 13% · 30% · 14% · 100% | 3.3 · 9% · 21% · 10% · 100% | 3.2 · 6% · 14% · 7% · 100% |

## 5. The difficulty table at that row (level 2, Momentum 0 to 2 in turn)

| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |
|---|---|---|---|---|
| 3 Standards (easy) | 2.7 · 6% · 16% · 4% · 100% | 2.7 · 4% · 11% · 1% · 100% | 2.7 · 10% · 20% · 11% · 100% | 2.9 · 4% · 12% · 7% · 100% |
| 4 Standards (normal) | 3.4 · 11% · 25% · 13% · 100% | 3.3 · 9% · 21% · 7% · 100% | 3.4 · 18% · 33% · 23% · 100% | 3.8 · 12% · 23% · 31% · 100% |
| 1 Elite + 2 Standards (normal) | 3.6 · 10% · 23% · 12% · 100% | 3.5 · 8% · 19% · 5% · 100% | 3.6 · 18% · 33% · 23% · 99% | 3.7 · 8% · 19% · 22% · 100% |
| 5 Standards (hard) | 4.2 · 22% · 41% · 26% · 97% | 4.1 · 17% · 35% · 21% · 100% | 4.3 · 35% · 55% · 45% · 93% | 5.2 · 28% · 46% · 67% · 93% |
| 6 Standards (deadly) | 5.0 · 42% · 65% · 53% · 81% | 5.1 · 35% · 59% · 48% · 88% | 4.9 · 64% · 84% · 75% · 61% | 6.5 · 51% · 74% · 87% · 72% |

## 6. Ranged against melee: the four candidates

Level 2, Momentum 0 to 2 in turn, the Stage 0 row above. **As built:** two melee Paladins (Greatswords) and two Archers (Crossbows). **Both Paladins on Crossbows:** the same builds with the Archers' weapon. A candidate works when the second party stops being the better one, and the Archer keeps its place. Fight cells: Health lost · a PC Down · won.

| Candidate | Normal: as built | Normal: both Paladins on Crossbows | Deadly: as built | Deadly: both Paladins on Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn: Greatsword / Crossbow | Double Shot Archer: damage a turn |
|---|---|---|---|---|---|---|---|
| Today's rules | 11% · 13% · 100% | 7% · 5% · 100% | 42% · 53% · 81% | 31% · 45% · 90% | 23.0 / 22.4 | 7.2 / 3.6 | 25.1 |
| A. Ranged weapons one die smaller (Crossbow 0 / 1d4+1 / 1d8+2) | 11% · 13% · 100% | 8% · 7% · 100% | 44% · 60% · 81% | 35% · 49% · 86% | 22.7 / 21.7 | 7.4 / 4.1 | 23.0 |
| B1. +2 damage on a [Melee] Strike that deals damage | 11% · 12% · 100% | 7% · 5% · 100% | 40% · 55% · 86% | 31% · 45% · 90% | 25.3 / 22.4 | 6.7 / 3.6 | 24.9 |
| B2. A melee PC that ends its turn Engaged has Guard 3 until its next turn | 8% · 9% · 100% | 7% · 5% · 100% | 34% · 48% · 88% | 31% · 45% · 90% | 22.8 / 22.4 | 5.4 / 3.6 | 24.9 |
| B1 + B2 | 9% · 8% · 100% | 7% · 5% · 100% | 30% · 43% · 92% | 31% · 45% · 90% | 25.5 / 22.4 | 5.5 / 3.6 | 24.5 |
| C2. A [Ranged] Action while Engaged is Doomed (not 2 Banes) | 12% · 13% · 100% | 8% · 6% · 100% | 42% · 55% · 83% | 35% · 52% · 86% | 23.2 / 20.6 | 6.4 / 4.2 | 25.0 |
| C3. A [Ranged] Action while Engaged draws an Opportunity Attack | 12% · 14% · 100% | 12% · 10% · 100% | 43% · 61% · 82% | 54% · 70% · 75% | 22.7 / 22.7 | 6.8 / 5.4 | 25.2 |
| C2 + C3 | 13% · 14% · 100% | 13% · 13% · 100% | 44% · 60% · 79% | 56% · 72% · 70% | 23.1 / 20.8 | 6.7 / 6.3 | 24.7 |
| B2 + C3 | 9% · 10% · 100% | 12% · 10% · 100% | 34% · 51% · 87% | 54% · 70% · 75% | 23.0 / 22.7 | 5.7 / 5.4 | 25.0 |
| A + B2 + C3 | 9% · 11% · 100% | 12% · 11% · 100% | 37% · 52% · 85% | 56% · 71% · 70% | 23.0 / 21.7 | 5.0 / 5.8 | 22.9 |

**The same among the pillars** (walls, blocked lines):

| Candidate | Normal: as built | Normal: both Paladins on Crossbows | Deadly: as built | Deadly: both Paladins on Crossbows |
|---|---|---|---|---|
| Today's rules | 11% · 14% · 100% | 10% · 12% · 100% | 53% · 66% · 69% | 42% · 55% · 80% |
| A. Ranged weapons one die smaller (Crossbow 0 / 1d4+1 / 1d8+2) | 11% · 10% · 100% | 10% · 15% · 100% | 53% · 68% · 70% | 47% · 65% · 72% |
| B1 + B2 | 9% · 10% · 100% | 10% · 12% · 100% | 37% · 49% · 85% | 42% · 55% · 80% |
| C2 + C3 | 18% · 23% · 99% | 18% · 20% · 100% | 57% · 69% · 64% | 76% · 87% · 41% |
| B2 + C3 | 13% · 17% · 99% | 17% · 22% · 100% | 50% · 66% · 72% | 67% · 79% · 53% |
| A + B2 + C3 | 13% · 15% · 100% | 18% · 20% · 99% | 50% · 65% · 71% | 74% · 89% · 46% |

**E. Carrying both weapons.** Both Paladins start with a Crossbow (they shoot while the enemies walk) and take the Greatsword when an enemy is within 2 squares, once a fight. What the switch costs decides whether it is worth doing. Under today's rules, and under B2 + C3 (Guard for a melee PC that ends its turn Engaged; a shot while Engaged draws an Opportunity Attack):

| Rules | The Paladins carry | Normal | Deadly | Smite Paladin: damage that counted a turn · taken a turn |
|---|---|---|---|---|
| Today's | Greatswords only (as built) | 11% · 13% · 100% | 42% · 53% · 81% | 23.0 · 7.2 |
| Today's | Crossbows only | 7% · 5% · 100% | 31% · 45% · 90% | 22.4 · 3.6 |
| Today's | both: the switch costs 0 AP | 8% · 5% · 100% | 35% · 48% · 88% | 24.3 · 4.0 |
| Today's | both: the switch costs 1 AP | 9% · 8% · 100% | 38% · 52% · 86% | 22.4 · 4.8 |
| Today's | both: the switch costs 2 AP | 10% · 10% · 100% | 41% · 54% · 84% | 21.0 · 4.7 |
| B2 + C3 | Greatswords only (as built) | 9% · 10% · 100% | 34% · 51% · 87% | 23.0 · 5.7 |
| B2 + C3 | Crossbows only | 12% · 10% · 100% | 54% · 70% · 75% | 22.7 · 5.4 |
| B2 + C3 | both: the switch costs 0 AP | 8% · 7% · 100% | 30% · 48% · 91% | 24.3 · 3.6 |
| B2 + C3 | both: the switch costs 1 AP | 8% · 8% · 100% | 33% · 47% · 88% | 22.7 · 4.0 |
| B2 + C3 | both: the switch costs 2 AP | 8% · 8% · 100% | 38% · 56% · 85% | 21.2 · 4.0 |

## 7. On the maps (level 2, the Stage 0 row)

| Encounter | Policy | open | corridor | pillars |
|---|---|---|---|---|
| 4 Standards (normal) | the plan | 3.4 · 11% · 25% · 14% · 100% | 3.5 · 14% · 30% · 17% · 99% | 3.5 · 11% · 26% · 14% · 100% |
| 4 Standards (normal) | holding the line | 3.3 · 9% · 21% · 6% · 100% | 3.4 · 10% · 24% · 12% · 100% | 3.3 · 9% · 21% · 9% · 100% |
| 6 Standards (deadly) | the plan | 5.0 · 42% · 65% · 51% · 82% | 5.1 · 55% · 79% · 73% · 70% | 5.0 · 53% · 75% · 66% · 69% |
| 6 Standards (deadly) | holding the line | 5.1 · 37% · 61% · 51% · 87% | 4.9 · 47% · 70% · 60% · 76% | 4.9 · 46% · 68% · 59% · 78% |

## 8. A day: Momentum 0 to 4

Four fights with no Rest (easy, normal, normal, hard) at the Stage 0 row, level 2. **The ladder** (decisions-s1.md): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum. **Flat:** every fight starts at Escalation 1.

| | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |
|---|---|---|---|---|---|
| The ladder | Momentum 0.0: 2.9 r · 7% · Down 5% · won 100% | Momentum 1.0: 3.4 r · 10% · Down 13% · won 100% | Momentum 1.8: 3.3 r · 10% · Down 13% · won 100% | Momentum 2.7: 4.1 r · 20% · Down 31% · won 97% | 96% |
| Flat | Momentum 0.0: 2.9 r · 8% · Down 6% · won 100% | Momentum 0.0: 3.5 r · 13% · Down 15% · won 100% | Momentum 0.0: 3.5 r · 13% · Down 16% · won 100% | Momentum 0.0: 4.4 r · 31% · Down 44% · won 91% | 91% |

(6.8 minutes.)
