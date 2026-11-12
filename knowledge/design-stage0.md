# Stage 0: levels 1 to 3 in the ruler

Written by `node book/ruler/sim/stage0.mjs`; don't edit, run it again. Stage 0 as the book has it since 2026-11-12: **Escalation 1 to 6**, a fight starts at 1 + **Momentum** (0 to 4); **no Opportunity Attack**; a [Ranged] Action while Engaged is **Doomed**; the weapon table of Chapter 15 (a flat part plus one small die; melee +4 two-handed, +2 one-handed); **the Bestiary's Stage 0 table** (ready numbers: the system's `config.mjs npcStage0`).

Runs: 600 fights a cell on the open field, 300 on a map. Each fight cell: rounds · Health lost · cost (with the Rally Points spent) · a PC Down · won. The decisions are the plan policy's unless a column says otherwise.

**The builds are not the classes' final Stage 0:** the class cards are still written for the old level lists (card sessions with Lucas come next). Until then the four R builds (Smite and Lay On Hands Paladins with Greatswords, Double Shot and Rolling Shot Archers with Crossbows; Human, 35 and 29 Health, Modifiers +2 / +1, Rally + 1, Guard 2 an unused AP) are cut to `book/decisions-s1.md`'s lists, with the Passives at Escalation 2, 4 and 6, no Apex, no Daily, no Talents:

| Level | Paladin (Smite / Lay On Hands) | Archer (Double Shot / Rolling Shot) |
|---|---|---|
| 1 | Smite or Lay On Hands; Rebuke or Shield of Faith; at Escalation 4: Searing Blows / Mending Light | Sharpshooter, Mark Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; at Escalation 4: Hunter's Edge |
| 2 | + the hook (Kindled Wrath); Holy Wrath (Encounter); at Escalation 2: Radiant Zeal / Font of Mercy | + the hook (Thrill of the Kill); Pinning Shot (Encounter); at Escalation 2: Killer's Focus |
| 3 | + at Escalation 6: Reckoning / Hallowed Stance | + at Escalation 6: Finisher |

## 1. A turn's damage by level and Escalation

The build's planned turn against Defense 13 (20,000 turns; one target; no Reactions).

| Build | Level | Turn | Escalation 1 | 2 | 4 | 6 |
|---|---:|---|---:|---:|---:|---:|
| Paladin (Smite) | 1 | Main | 32.0 | 32.0 | 36.8 | 36.8 |
| Paladin (Smite) | 2 | Nova | 30.6 | 34.1 | 37.6 | 37.6 |
| Paladin (Smite) | 2 | Main | 32.0 | 35.5 | 40.2 | 40.2 |
| Paladin (Smite) | 3 | Nova | 30.6 | 34.1 | 37.6 | 37.6 |
| Paladin (Smite) | 3 | Main | 32.0 | 35.5 | 40.2 | 40.2 |
| Paladin (Lay On Hands) | 1 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Paladin (Lay On Hands) | 2 | Nova | 15.5 | 15.5 | 15.5 | 15.5 |
| Paladin (Lay On Hands) | 2 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Paladin (Lay On Hands) | 3 | Nova | 15.5 | 15.5 | 15.5 | 15.5 |
| Paladin (Lay On Hands) | 3 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Archer (Double Shot) | 1 | Main | 24.3 | 24.3 | 26.7 | 26.7 |
| Archer (Double Shot) | 2 | Pin | 24.6 | 28.1 | 30.6 | 30.6 |
| Archer (Double Shot) | 3 | Pin | 24.6 | 28.1 | 30.6 | 30.6 |
| Archer (Rolling Shot) | 1 | Main | 21.2 | 21.2 | 23.7 | 23.7 |
| Archer (Rolling Shot) | 2 | Pin | 21.2 | 24.7 | 27.2 | 27.2 |
| Archer (Rolling Shot) | 3 | Pin | 21.2 | 24.7 | 27.2 | 27.2 |

## 2. The Bestiary's Stage 0 table

The book's tables (`foundry/twod12/module/config.mjs npcStage0`). **Health:** an NPC's Vigor or Resolve by rating (the Health Pool is the two added). **Damage:** Tier 2 / Tier 3 as written, the Modifier already in it.

| Role | Vigor or Resolve: Terrible / Low / Medium / High / Extreme | Health, both Medium | Basic attack, Medium | Its Round Special, Medium | Deals a turn to a level 1 Paladin (AD 14) / Archer (AD 13) |
|---|---|---:|---|---|---|
| Minion | 1 / 2 / 3 / 4 | 6 | 2 / 1 + 1d4 | 1d4 / 2 + 1d4 (1 AP) | 5.2 / 5.8 |
| Grunt | 7 / 10 / 13 / 16 / 19 | 26 | 1d4 / 1 + 1d4 | 1 + 1d4 / 2 + 1d4 (1 AP) | 6.0 / 6.7 |
| Standard | 17 / 24 / 30 / 36 / 42 | 60 | 1 + 1d4 / 2 + 1d6 | 3 + 1d6 / 8 + 1d8 (2 AP) | 10.8 / 12.1 |
| Elite | 35 / 50 / 65 / 80 / 95 | 130 | 2 + 1d4 / 2 + 1d6 | 5 + 1d6 / 8 + 1d8 (2 AP) | 13.9 / 15.2 |

The fit behind it (`node book/ruler/sim/stage0fit.mjs`): over pack R's first row (a Standard with 63 Health in the ruler, a Basic attack of 4 / 7.5), the Health factor **h** for which the normal fight lasts 3.5 rounds, then the damage factor **d** for each of the Bestiary's two targets. As before, the two targets don't meet at one number.

| Level | Momentum | h (3.5 rounds) | d: the fight costs a fifth (Rally Points counted) | d: a PC Down in 1 fight of 5 |
|---:|---:|---:|---:|---:|
| 1 | 0 | × 0.88 | × 0.61 | × 0.93 |
| 1 | 2 | × 0.93 | × 0.73 | × 0.93 |
| 2 | 0 | × 0.93 | × 0.68 | × 0.95 |
| 2 | 2 | × 1.02 | × 0.81 | × 0.97 |
| 3 | 0 | × 0.94 | × 0.68 | × 0.93 |
| 3 | 2 | × 1.04 | × 0.79 | × 0.96 |

**The table chosen: Health × 0.95 of that row (a Standard: 30 + 30 = 60) and damage × 0.75**, as ready numbers. The damage sits near the low target on purpose (Lucas, 2026-11-12: level 1 was too hard, make lower monsters): at level 1 with no Momentum the hard and the deadly fights then land where the Bestiary's difficulty table puts them (section 3). One step up (damage × 0.80 to 0.85: +1 on a Standard's Special) gives a level 1 party a PC Down in 14 to 18% of normal fights and wins the deadly fight 67 to 71% of the time.

## 3. The fights at levels 1, 2 and 3

| Level | Momentum | 3 Standards (easy) | 4 Standards (normal) | 5 Standards (hard) | 6 Standards (deadly) |
|---:|---:|---|---|---|---|
| 1 | 0 | 2.8 · 7% · 17% · 3% · 100% | 3.5 · 12% · 28% · 7% · 100% | 4.4 · 26% · 47% · 29% · 98% | 5.3 · 46% · 71% · 53% · 82% |
| 1 | 2 | 2.7 · 6% · 13% · 2% · 100% | 3.4 · 10% · 23% · 8% · 100% | 4.2 · 18% · 37% · 19% · 98% | 5.1 · 34% · 58% · 41% · 90% |
| 1 | 4 | 2.6 · 5% · 10% · 1% · 100% | 3.3 · 8% · 18% · 6% · 100% | 4.0 · 17% · 33% · 18% · 98% | 4.9 · 29% · 52% · 35% · 94% |
| 2 | 0 | 2.7 · 6% · 16% · 3% · 100% | 3.4 · 9% · 24% · 7% · 100% | 4.1 · 18% · 37% · 23% · 99% | 5.0 · 34% · 57% · 43% · 89% |
| 2 | 2 | 2.5 · 4% · 10% · 2% · 100% | 3.2 · 7% · 18% · 5% · 100% | 3.9 · 14% · 30% · 17% · 99% | 4.8 · 25% · 47% · 35% · 93% |
| 2 | 4 | 2.5 · 4% · 9% · 1% · 100% | 3.1 · 6% · 14% · 3% · 100% | 3.8 · 11% · 26% · 13% · 99% | 4.6 · 23% · 42% · 30% · 94% |
| 3 | 0 | 2.7 · 5% · 15% · 2% · 100% | 3.4 · 9% · 23% · 7% · 100% | 4.1 · 18% · 38% · 22% · 99% | 5.0 · 32% · 57% · 43% · 90% |
| 3 | 2 | 2.5 · 4% · 11% · 3% · 100% | 3.1 · 7% · 18% · 5% · 100% | 3.9 · 11% · 28% · 13% · 99% | 4.6 · 21% · 41% · 29% · 96% |
| 3 | 4 | 2.4 · 3% · 7% · 2% · 100% | 3.1 · 4% · 12% · 2% · 100% | 3.7 · 8% · 20% · 10% · 100% | 4.4 · 12% · 29% · 18% · 98% |

**The other normal encounters (CV 400)**, Momentum 0:

| Level | 1 Elite + 2 Standards | 2 Elites | 8 Grunts | 2 Standards + 8 Minions |
|---:|---|---|---|---|
| 1 | 3.7 · 10% · 26% · 7% · 100% | 3.9 · 10% · 26% · 7% · 100% | 3.4 · 20% · 37% · 9% · 100% | 3.0 · 9% · 21% · 3% · 100% |
| 2 | 3.6 · 8% · 22% · 5% · 100% | 3.8 · 7% · 23% · 5% · 100% | 3.3 · 15% · 31% · 7% · 100% | 3.0 · 7% · 19% · 2% · 100% |
| 3 | 3.6 · 8% · 23% · 6% · 100% | 3.8 · 7% · 22% · 5% · 100% | 3.2 · 15% · 31% · 6% · 100% | 3.0 · 8% · 19% · 2% · 100% |

## 4. Escalation 1 to 6: where the turns are

The normal fight (4 Standards), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.

| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |
|---:|---:|---:|---:|---:|---:|---|---|
| 0 | 1 | 34% | 43% | 23% | 1% | 66% / 24% / 1% | 3.4 · 9% · 23% · 7% · 100% |
| 1 | 2 | 0% | 55% | 39% | 6% | 100% / 45% / 6% | 3.2 · 7% · 20% · 4% · 100% |
| 2 | 3 | 0% | 36% | 44% | 20% | 100% / 64% / 20% | 3.1 · 7% · 18% · 5% · 100% |
| 3 | 4 | 0% | 0% | 58% | 42% | 100% / 100% / 42% | 3.1 · 5% · 14% · 3% · 100% |
| 4 | 5 | 0% | 0% | 37% | 63% | 100% / 100% / 63% | 3.1 · 4% · 12% · 2% · 100% |

## 5. How it is played (level 2, Momentum 0 to 2 in turn)

| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |
|---|---|---|---|---|
| 3 Standards (easy) | 2.6 · 5% · 13% · 3% · 100% | 2.6 · 4% · 10% · 1% · 100% | 2.6 · 6% · 15% · 4% · 100% | 2.8 · 3% · 10% · 3% · 100% |
| 4 Standards (normal) | 3.3 · 8% · 21% · 6% · 100% | 3.2 · 6% · 17% · 3% · 100% | 3.3 · 10% · 23% · 8% · 100% | 3.5 · 7% · 18% · 19% · 100% |
| 1 Elite + 2 Standards (normal) | 3.4 · 8% · 21% · 6% · 100% | 3.4 · 5% · 16% · 1% · 100% | 3.5 · 11% · 25% · 12% · 100% | 3.6 · 5% · 15% · 10% · 100% |
| 5 Standards (hard) | 4.0 · 15% · 32% · 18% · 99% | 3.9 · 11% · 28% · 11% · 100% | 4.1 · 21% · 41% · 27% · 98% | 4.7 · 18% · 33% · 50% · 99% |
| 6 Standards (deadly) | 4.8 · 28% · 50% · 37% · 94% | 4.6 · 22% · 44% · 26% · 96% | 4.9 · 42% · 65% · 50% · 83% | 6.0 · 33% · 55% · 77% · 92% |

## 6. Ranged against melee

Level 2, Momentum 0 to 2 in turn. **As built:** two Paladins with Greatswords (0 / 5 + 1d6 / 8 + 1d8) and two Archers with Crossbows (0 / 2 + 1d4 / 4 + 1d4). **All Crossbows:** the Paladins with the Archers' weapon. The gap is closed when the second party is no longer the better one. Fight cells: Health lost · a PC Down · won.

| Map | Normal: as built | Normal: all Crossbows | Deadly: as built | Deadly: all Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn |
|---|---|---|---|---|---|---|
| open | 8% · 6% · 100% | 5% · 3% · 100% | 28% · 37% · 94% | 28% · 42% · 92% | 27.3 / 20.8 | 5.7 / 3.5 |
| pillars | 11% · 13% · 100% | 6% · 5% · 100% | 40% · 48% · 80% | 44% · 65% · 77% | 27.9 / 20.9 | 6.0 / 3.1 |

## 7. On the maps (level 2)

| Encounter | Policy | open | corridor | pillars |
|---|---|---|---|---|
| 4 Standards (normal) | the plan | 3.3 · 8% · 21% · 6% · 100% | 3.4 · 10% · 24% · 7% · 100% | 3.4 · 11% · 24% · 13% · 100% |
| 4 Standards (normal) | holding the line | 3.2 · 7% · 17% · 3% · 100% | 3.3 · 8% · 19% · 4% · 100% | 3.2 · 7% · 18% · 3% · 100% |
| 6 Standards (deadly) | the plan | 4.8 · 26% · 49% · 35% · 95% | 4.9 · 42% · 64% · 52% · 81% | 4.9 · 40% · 62% · 48% · 80% |
| 6 Standards (deadly) | holding the line | 4.6 · 19% · 41% · 22% · 96% | 4.8 · 31% · 54% · 42% · 91% | 4.8 · 32% · 54% · 40% · 89% |

## 8. A day: Momentum 0 to 4

Four fights with no Rest (easy, normal, normal, hard). **The ladder** (Chapter 2): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum (the system's `roundrules.mjs escalationStartAt`, `momentumAfter`). **Flat:** every fight starts at Escalation 1.

| Level | | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |
|---:|---|---|---|---|---|---|
| 1 | The ladder | Momentum 0.0: 2.8 r · 7% · Down 3% · won 100% | Momentum 1.0: 3.4 r · 11% · Down 10% · won 100% | Momentum 1.9: 3.4 r · 10% · Down 12% · won 100% | Momentum 2.7: 4.2 r · 18% · Down 24% · won 98% | 98% |
| 1 | Flat | Momentum 0.0: 2.8 r · 7% · Down 2% · won 100% | Momentum 0.0: 3.5 r · 13% · Down 11% · won 100% | Momentum 0.0: 3.6 r · 13% · Down 12% · won 100% | Momentum 0.0: 4.5 r · 26% · Down 33% · won 96% | 96% |
| 2 | The ladder | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 1.0: 3.2 r · 9% · Down 9% · won 100% | Momentum 1.9: 3.2 r · 6% · Down 5% · won 100% | Momentum 2.8: 3.8 r · 12% · Down 14% · won 99% | 99% |
| 2 | Flat | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 0.0: 3.4 r · 9% · Down 8% · won 100% | Momentum 0.0: 3.4 r · 9% · Down 9% · won 100% | Momentum 0.0: 4.2 r · 20% · Down 28% · won 98% | 98% |
| 3 | The ladder | Momentum 0.0: 2.8 r · 5% · Down 2% · won 100% | Momentum 1.0: 3.2 r · 8% · Down 7% · won 100% | Momentum 1.9: 3.2 r · 6% · Down 5% · won 100% | Momentum 2.9: 3.8 r · 11% · Down 15% · won 99% | 99% |
| 3 | Flat | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 0.0: 3.4 r · 9% · Down 8% · won 100% | Momentum 0.0: 3.4 r · 9% · Down 10% · won 100% | Momentum 0.0: 4.2 r · 20% · Down 27% · won 98% | 98% |

(5.1 minutes.)
