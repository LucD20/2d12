# Stage 0: levels 1 to 3 in the ruler

Written by `node book/ruler/sim/stage0.mjs`; don't edit, run it again. Stage 0 as the book has it since 2026-11-12: **Escalation 1 to 6**, a fight starts at 1 + **Momentum** (0 to 4); **no Opportunity Attack**; a [Ranged] Action while Engaged is **Doomed**; the weapon table of Chapter 15 (a flat part plus one small die; melee +4 two-handed, +2 one-handed); **the Bestiary's Stage 0 table** (ready numbers: the system's `config.mjs npcStage0`).

Runs: 600 fights a cell on the open field, 300 on a map. Each fight cell: rounds · Health lost · cost (with the Rally Points spent) · a PC Down · won. The decisions are the plan policy's unless a column says otherwise.

**The builds are not the classes' final Stage 0:** the class cards are still written for the old level lists (card sessions with Lucas come next). Until then the four R builds (Smite and Lay On Hands Paladins with Greatswords, Double Shot and Rolling Shot Archers with Crossbows; Human, 35 and 29 Health, Modifiers +2 / +1, Rally + 1, Guard 2 an unused AP) are cut to `book/decisions-s1.md`'s lists, with the Passives at Escalation 2, 4 and 6, no Apex, no Daily, no Talents:

| Level | Paladin (Smite / Lay On Hands) | Archer (Double Shot / Rolling Shot) |
|---|---|---|
| 1 | Smite or Lay On Hands; Rebuke or Shield of Faith; at Escalation 2: Radiant Zeal / Font of Mercy | Sharpshooter, Mark Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; at Escalation 2: Killer's Focus |
| 2 | + the hook (Kindled Wrath); Holy Wrath (Encounter); at Escalation 4: Searing Blows / Mending Light | + the hook (Thrill of the Kill); Pinning Shot (Encounter); at Escalation 4: Hunter's Edge |
| 3 | + at Escalation 6: Reckoning / Hallowed Stance | + at Escalation 6: Finisher |

## 1. A turn's damage by level and Escalation

The build's planned turn against Defense 13 (20,000 turns; one target; no Reactions).

| Build | Level | Turn | Escalation 1 | 2 | 4 | 6 |
|---|---:|---|---:|---:|---:|---:|
| Paladin (Smite) | 1 | Main | 32.0 | 35.5 | 35.5 | 35.5 |
| Paladin (Smite) | 2 | Nova | 30.6 | 34.1 | 37.6 | 37.6 |
| Paladin (Smite) | 2 | Main | 32.0 | 35.5 | 40.2 | 40.2 |
| Paladin (Smite) | 3 | Nova | 30.6 | 34.1 | 37.6 | 37.6 |
| Paladin (Smite) | 3 | Main | 32.0 | 35.5 | 40.2 | 40.2 |
| Paladin (Lay On Hands) | 1 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Paladin (Lay On Hands) | 2 | Nova | 15.5 | 15.5 | 15.5 | 15.5 |
| Paladin (Lay On Hands) | 2 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Paladin (Lay On Hands) | 3 | Nova | 15.5 | 15.5 | 15.5 | 15.5 |
| Paladin (Lay On Hands) | 3 | Main | 13.4 | 13.4 | 13.4 | 13.4 |
| Archer (Double Shot) | 1 | Main | 24.3 | 27.7 | 27.7 | 27.7 |
| Archer (Double Shot) | 2 | Pin | 24.6 | 28.1 | 30.6 | 30.6 |
| Archer (Double Shot) | 3 | Pin | 24.6 | 28.1 | 30.6 | 30.6 |
| Archer (Rolling Shot) | 1 | Main | 21.2 | 24.7 | 24.7 | 24.7 |
| Archer (Rolling Shot) | 2 | Pin | 21.2 | 24.7 | 27.2 | 27.2 |
| Archer (Rolling Shot) | 3 | Pin | 21.2 | 24.7 | 27.2 | 27.2 |

## 2. The Bestiary's Stage 0 table

The book's tables (`foundry/twod12/module/config.mjs npcStage0`). **Health:** an NPC's Vigor or Resolve by rating (the Health Pool is the two added). **Damage:** Tier 2 / Tier 3 as written, the Modifier already in it.

| Role | Vigor or Resolve: Terrible / Low / Medium / High / Extreme | Health, both Medium | Basic attack, Medium | Its Round Special, Medium | Deals a turn to a level 1 Paladin (AD 14) / Archer (AD 13) |
|---|---|---:|---|---|---|
| Minion | 3 / 5 / 6 / 7 | 12 | 2 / 1 + 1d4 | 1d4 / 2 + 1d4 (1 AP) | 5.2 / 5.8 |
| Grunt | 7 / 10 / 13 / 16 / 19 | 26 | 1d4 / 1 + 1d4 | 1 + 1d4 / 2 + 1d4 (1 AP) | 6.0 / 6.7 |
| Standard | 17 / 24 / 30 / 36 / 42 | 60 | 1 + 1d4 / 2 + 1d6 | 4 + 1d6 / 8 + 1d8 (2 AP) | 11.3 / 12.6 |
| Elite | 35 / 50 / 65 / 80 / 95 | 130 | 3 + 1d4 / 3 + 1d6 | 6 + 1d6 / 10 + 1d8 (2 AP) | 16.3 / 17.8 |

The fit behind it (`node book/ruler/sim/stage0fit.mjs`): over pack R's first row (a Standard with 63 Health in the ruler, a Basic attack of 4 / 7.5), the Health factor **h** for which the normal fight lasts 3.5 rounds, then the damage factor **d** for each of the Bestiary's two targets. As before, the two targets don't meet at one number.

| Level | Momentum | h (3.5 rounds) | d: the fight costs a fifth (Rally Points counted) | d: a PC Down in 1 fight of 5 |
|---:|---:|---:|---:|---:|
| 1 | 0 | × 0.98 | × 0.66 | × 0.93 |
| 1 | 2 | × 0.99 | × 0.68 | × 0.95 |
| 2 | 0 | × 0.93 | × 0.68 | × 0.95 |
| 2 | 2 | × 1.02 | × 0.81 | × 0.97 |
| 3 | 0 | × 0.94 | × 0.68 | × 0.93 |
| 3 | 2 | × 1.04 | × 0.79 | × 0.96 |

**The table chosen: Health × 0.95 of that row (a Standard: 30 + 30 = 60) and damage × 0.75**, as ready numbers, on the low side on purpose (Lucas, 2026-11-12: level 1 was too hard, make lower monsters). **Then, with Lucas the same day:** a Standard's Medium 2 AP Special half a step up (4 + 1d6 on Tier 2, was 3 + 1d6; the full step, × 0.80, gives a level 1 party a PC Down in 14% of normal fights and wins the deadly fight 68% of the time); **a Grunt has 3 AP** (with 4, eight Grunts cost a level 1 party 37% of its Health with the Rally Points against 28% for four Standards; with 3: 23%); **a Minion has 6 + 6 Health**, no Reaction AP, and up to 3 Minions act in one turn slot (dying to any damage was tried: it was worth half its CV 25; with 12 Health it is worth it exactly); **Elites' damage × 1.12** (two Elites then cost what four Standards do); a ranged attack's damage is one rating lower; **an Elite's Escalation follows the 1-to-6 ladder** (+1 a round and at each phase; its three abilities at 2, 4 and 6).

## 3. The fights at levels 1, 2 and 3

| Level | Momentum | 3 Standards (easy) | 4 Standards (normal) | 5 Standards (hard) | 6 Standards (deadly) |
|---:|---:|---|---|---|---|
| 1 | 0 | 2.7 · 7% · 17% · 3% · 100% | 3.3 · 12% · 27% · 10% · 100% | 4.2 · 23% · 44% · 26% · 98% | 5.0 · 41% · 66% · 49% · 86% |
| 1 | 2 | 2.5 · 6% · 15% · 2% · 100% | 3.2 · 9% · 23% · 5% · 100% | 4.1 · 20% · 39% · 22% · 98% | 4.8 · 35% · 60% · 42% · 90% |
| 1 | 4 | 2.5 · 6% · 15% · 2% · 100% | 3.2 · 9% · 23% · 5% · 100% | 4.1 · 20% · 39% · 22% · 98% | 4.8 · 35% · 60% · 42% · 90% |
| 2 | 0 | 2.7 · 6% · 16% · 3% · 100% | 3.4 · 11% · 26% · 10% · 100% | 4.2 · 20% · 40% · 25% · 98% | 5.0 · 37% · 61% · 48% · 87% |
| 2 | 2 | 2.6 · 4% · 11% · 2% · 100% | 3.2 · 8% · 20% · 7% · 100% | 3.9 · 14% · 31% · 18% · 99% | 4.7 · 27% · 49% · 35% · 92% |
| 2 | 4 | 2.5 · 4% · 10% · 1% · 100% | 3.1 · 7% · 16% · 5% · 100% | 3.9 · 13% · 28% · 15% · 99% | 4.7 · 25% · 45% · 32% · 94% |
| 3 | 0 | 2.7 · 6% · 16% · 4% · 100% | 3.4 · 10% · 25% · 8% · 100% | 4.2 · 22% · 42% · 27% · 97% | 5.0 · 36% · 60% · 48% · 88% |
| 3 | 2 | 2.6 · 5% · 12% · 4% · 100% | 3.1 · 7% · 18% · 5% · 100% | 3.9 · 13% · 30% · 17% · 99% | 4.7 · 24% · 45% · 38% · 95% |
| 3 | 4 | 2.4 · 3% · 8% · 2% · 100% | 3.1 · 5% · 13% · 5% · 100% | 3.7 · 9% · 22% · 12% · 99% | 4.5 · 13% · 31% · 21% · 98% |

**The other normal encounters (CV 400)**, Momentum 0:

| Level | 1 Elite + 2 Standards | 2 Elites | 8 Grunts | 2 Standards + 8 Minions |
|---:|---|---|---|---|
| 1 | 3.5 · 10% · 26% · 8% · 100% | 3.7 · 11% · 27% · 10% · 100% | 3.2 · 7% · 20% · 2% · 100% | 3.4 · 13% · 28% · 9% · 100% |
| 2 | 3.6 · 10% · 25% · 9% · 100% | 3.8 · 9% · 26% · 7% · 100% | 3.2 · 7% · 20% · 2% · 100% | 3.4 · 11% · 27% · 7% · 100% |
| 3 | 3.6 · 10% · 25% · 11% · 100% | 3.8 · 9% · 25% · 10% · 100% | 3.2 · 7% · 20% · 1% · 100% | 3.4 · 11% · 27% · 6% · 100% |

## 4. Escalation 1 to 6: where the turns are

The normal fight (4 Standards), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.

| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |
|---:|---:|---:|---:|---:|---:|---|---|
| 0 | 1 | 33% | 43% | 23% | 1% | 67% / 23% / 1% | 3.4 · 10% · 25% · 8% · 100% |
| 1 | 2 | 0% | 56% | 38% | 6% | 100% / 44% / 6% | 3.2 · 8% · 21% · 7% · 100% |
| 2 | 3 | 0% | 36% | 44% | 20% | 100% / 64% / 20% | 3.1 · 7% · 18% · 5% · 100% |
| 3 | 4 | 0% | 0% | 57% | 43% | 100% / 100% / 43% | 3.1 · 6% · 15% · 5% · 100% |
| 4 | 5 | 0% | 0% | 37% | 63% | 100% / 100% / 63% | 3.1 · 5% · 13% · 5% · 100% |

## 5. How it is played (level 2, Momentum 0 to 2 in turn)

| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |
|---|---|---|---|---|
| 3 Standards (easy) | 2.6 · 5% · 14% · 3% · 100% | 2.7 · 3% · 10% · 1% · 100% | 2.7 · 7% · 16% · 3% · 100% | 2.8 · 3% · 11% · 4% · 100% |
| 4 Standards (normal) | 3.3 · 8% · 22% · 6% · 100% | 3.2 · 6% · 18% · 3% · 100% | 3.3 · 11% · 25% · 10% · 100% | 3.6 · 9% · 20% · 24% · 100% |
| 1 Elite + 2 Standards (normal) | 3.5 · 9% · 22% · 9% · 100% | 3.4 · 6% · 18% · 3% · 100% | 3.5 · 13% · 27% · 17% · 100% | 3.7 · 7% · 18% · 16% · 100% |
| 5 Standards (hard) | 4.1 · 18% · 36% · 23% · 98% | 4.0 · 13% · 30% · 14% · 99% | 4.2 · 24% · 44% · 31% · 97% | 4.8 · 20% · 37% · 55% · 98% |
| 6 Standards (deadly) | 4.8 · 33% · 56% · 43% · 90% | 4.7 · 27% · 49% · 35% · 93% | 4.9 · 47% · 69% · 56% · 77% | 6.2 · 39% · 62% · 80% · 87% |

## 6. Ranged against melee

Level 2, Momentum 0 to 2 in turn. **As built:** two Paladins with Greatswords (0 / 5 + 1d6 / 8 + 1d8) and two Archers with Crossbows (0 / 2 + 1d4 / 4 + 1d4). **All Crossbows:** the Paladins with the Archers' weapon. The gap is closed when the second party is no longer the better one. Fight cells: Health lost · a PC Down · won.

| Map | Normal: as built | Normal: all Crossbows | Deadly: as built | Deadly: all Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn |
|---|---|---|---|---|---|---|
| open | 8% · 6% · 100% | 6% · 5% · 100% | 33% · 43% · 90% | 32% · 48% · 90% | 27.6 / 20.0 | 5.6 / 3.7 |
| pillars | 11% · 9% · 100% | 8% · 7% · 100% | 46% · 58% · 75% | 50% · 66% · 68% | 28.5 / 19.9 | 5.6 / 3.4 |

## 7. On the maps (level 2)

| Encounter | Policy | open | corridor | pillars |
|---|---|---|---|---|
| 4 Standards (normal) | the plan | 3.3 · 8% · 20% · 6% · 100% | 3.4 · 11% · 26% · 10% · 100% | 3.3 · 11% · 24% · 9% · 100% |
| 4 Standards (normal) | holding the line | 3.2 · 6% · 17% · 2% · 100% | 3.2 · 8% · 20% · 5% · 100% | 3.2 · 8% · 20% · 5% · 100% |
| 6 Standards (deadly) | the plan | 4.7 · 32% · 55% · 41% · 90% | 4.8 · 38% · 62% · 51% · 84% | 4.9 · 46% · 69% · 58% · 75% |
| 6 Standards (deadly) | holding the line | 4.8 · 27% · 49% · 36% · 93% | 5.0 · 37% · 61% · 49% · 88% | 4.9 · 37% · 60% · 47% · 88% |

## 8. A day: Momentum 0 to 4

Four fights with no Rest (easy, normal, normal, hard). **The ladder** (Chapter 2): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum (the system's `roundrules.mjs escalationStartAt`, `momentumAfter`). **Flat:** every fight starts at Escalation 1.

| Level | | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |
|---:|---|---|---|---|---|---|
| 1 | The ladder | Momentum 0.0: 2.7 r · 6% · Down 1% · won 100% | Momentum 1.0: 3.2 r · 10% · Down 8% · won 100% | Momentum 1.9: 3.3 r · 9% · Down 8% · won 100% | Momentum 2.8: 4.1 r · 19% · Down 22% · won 98% | 98% |
| 1 | Flat | Momentum 0.0: 2.7 r · 7% · Down 2% · won 100% | Momentum 0.0: 3.4 r · 12% · Down 12% · won 100% | Momentum 0.0: 3.4 r · 11% · Down 12% · won 100% | Momentum 0.0: 4.3 r · 25% · Down 31% · won 96% | 96% |
| 2 | The ladder | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 1.0: 3.2 r · 7% · Down 6% · won 100% | Momentum 1.9: 3.2 r · 7% · Down 6% · won 100% | Momentum 2.8: 3.9 r · 13% · Down 20% · won 99% | 99% |
| 2 | Flat | Momentum 0.0: 2.7 r · 6% · Down 2% · won 100% | Momentum 0.0: 3.4 r · 10% · Down 9% · won 100% | Momentum 0.0: 3.4 r · 10% · Down 11% · won 100% | Momentum 0.0: 4.3 r · 22% · Down 29% · won 96% | 96% |
| 3 | The ladder | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 1.0: 3.2 r · 7% · Down 7% · won 100% | Momentum 1.9: 3.2 r · 8% · Down 7% · won 100% | Momentum 2.8: 3.8 r · 13% · Down 18% · won 99% | 99% |
| 3 | Flat | Momentum 0.0: 2.8 r · 6% · Down 3% · won 100% | Momentum 0.0: 3.4 r · 11% · Down 9% · won 100% | Momentum 0.0: 3.4 r · 11% · Down 10% · won 100% | Momentum 0.0: 4.2 r · 22% · Down 30% · won 96% | 96% |

(4.5 minutes.)
