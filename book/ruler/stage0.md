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
| Paladin (Smite) | 1 | Main | 33.1 | 36.5 | 36.5 | 36.5 |
| Paladin (Smite) | 2 | Nova | 31.4 | 34.7 | 38.1 | 38.1 |
| Paladin (Smite) | 2 | Main | 33.1 | 36.5 | 41.3 | 41.3 |
| Paladin (Smite) | 3 | Nova | 31.4 | 34.7 | 38.1 | 38.1 |
| Paladin (Smite) | 3 | Main | 33.1 | 36.5 | 41.3 | 41.3 |
| Paladin (Lay On Hands) | 1 | Main | 14.0 | 14.0 | 14.0 | 14.0 |
| Paladin (Lay On Hands) | 2 | Nova | 15.9 | 15.9 | 15.9 | 15.9 |
| Paladin (Lay On Hands) | 2 | Main | 14.0 | 14.0 | 14.0 | 14.0 |
| Paladin (Lay On Hands) | 3 | Nova | 15.9 | 15.9 | 15.9 | 15.9 |
| Paladin (Lay On Hands) | 3 | Main | 14.0 | 14.0 | 14.0 | 14.0 |
| Archer (Double Shot) | 1 | Main | 25.4 | 28.9 | 28.9 | 28.9 |
| Archer (Double Shot) | 2 | Pin | 25.8 | 29.3 | 31.8 | 31.8 |
| Archer (Double Shot) | 3 | Pin | 25.8 | 29.3 | 31.8 | 31.8 |
| Archer (Rolling Shot) | 1 | Main | 22.0 | 25.5 | 25.5 | 25.5 |
| Archer (Rolling Shot) | 2 | Pin | 22.0 | 25.5 | 27.9 | 27.9 |
| Archer (Rolling Shot) | 3 | Pin | 22.0 | 25.5 | 27.9 | 27.9 |

## 2. The Bestiary's Stage 0 table

The book's tables (`foundry/twod12/module/config.mjs npcStage0`). **Health:** an NPC's Vigor or Resolve by rating (the Health Pool is the two added). **Damage:** Tier 2 / Tier 3 as written, the Modifier already in it.

| Role | Vigor or Resolve: Terrible / Low / Medium / High / Extreme | Health, both Medium | Basic attack, Medium | Its Round Special, Medium | Deals a turn to a level 1 Paladin (AD 14) / Archer (AD 13) |
|---|---|---:|---|---|---|
| Minion | 3 / 5 / 6 / 7 | 12 | 2 / 1 + 1d4 | 1d4 / 2 + 1d4 (1 AP) | 5.2 / 5.8 |
| Grunt | 7 / 10 / 13 / 16 / 19 | 26 | 1d4 / 1 + 1d4 | 1 + 1d4 / 2 + 1d4 (1 AP) | 6.0 / 6.7 |
| Standard | 17 / 24 / 30 / 36 / 42 | 60 | 1 + 1d4 / 2 + 1d6 | 4 + 1d6 / 8 + 1d8 (2 AP) | 11.9 / 13.3 |
| Elite | 35 / 50 / 65 / 80 / 95 | 130 | 3 + 1d4 / 3 + 1d6 | 6 + 1d6 / 10 + 1d8 (2 AP) | 17.0 / 18.6 |

The fit behind it (`node book/ruler/sim/stage0fit.mjs`): over pack R's first row (a Standard with 63 Health in the ruler, a Basic attack of 4 / 7.5), the Health factor **h** for which the normal fight lasts 3.5 rounds, then the damage factor **d** for each of the Bestiary's two targets. As before, the two targets don't meet at one number.

| Level | Momentum | h (3.5 rounds) | d: the fight costs a fifth (Rally Points counted) | d: a PC Down in 1 fight of 5 |
|---:|---:|---:|---:|---:|
| 1 | 0 | × 0.98 | × 0.67 | × 0.92 |
| 1 | 2 | × 1.04 | × 0.68 | × 0.94 |
| 2 | 0 | × 0.96 | × 0.68 | × 0.96 |
| 2 | 2 | × 1.04 | × 0.79 | × 0.95 |
| 3 | 0 | × 0.98 | × 0.68 | × 0.91 |
| 3 | 2 | × 1.07 | × 0.78 | × 0.94 |

**The table chosen: Health × 0.95 of that row (a Standard: 30 + 30 = 60) and damage × 0.75**, as ready numbers, on the low side on purpose (Lucas, 2026-11-12: level 1 was too hard, make lower monsters). **Then, with Lucas the same day:** a Standard's Medium 2 AP Special half a step up (4 + 1d6 on Tier 2, was 3 + 1d6; the full step, × 0.80, gives a level 1 party a PC Down in 14% of normal fights and wins the deadly fight 68% of the time); **a Grunt has 3 AP** (with 4, eight Grunts cost a level 1 party 37% of its Health with the Rally Points against 28% for four Standards; with 3: 23%); **a Minion has 6 + 6 Health**, no Reaction AP, and up to 3 Minions act in one turn slot (dying to any damage was tried: it was worth half its CV 25; with 12 Health it is worth it exactly); **Elites' damage × 1.12** (two Elites then cost what four Standards do); a ranged attack's damage is one rating lower; **an Elite's Escalation follows the 1-to-6 ladder** (+1 a round and at each phase; its three abilities at 2, 4 and 6).

## 3. The fights at levels 1, 2 and 3

| Level | Momentum | 3 Standards (easy) | 4 Standards (normal) | 5 Standards (hard) | 6 Standards (deadly) |
|---:|---:|---|---|---|---|
| 1 | 0 | 2.6 · 7% · 16% · 4% · 100% | 3.3 · 12% · 27% · 12% · 100% | 4.1 · 25% · 45% · 28% · 98% | 4.9 · 44% · 68% · 53% · 82% |
| 1 | 2 | 2.5 · 7% · 15% · 3% · 100% | 3.2 · 10% · 24% · 7% · 100% | 4.0 · 21% · 40% · 24% · 97% | 4.8 · 40% · 64% · 47% · 86% |
| 1 | 4 | 2.5 · 7% · 15% · 3% · 100% | 3.2 · 10% · 24% · 7% · 100% | 4.0 · 21% · 40% · 24% · 97% | 4.8 · 40% · 64% · 47% · 86% |
| 2 | 0 | 2.7 · 6% · 16% · 4% · 100% | 3.3 · 12% · 26% · 11% · 100% | 4.1 · 21% · 41% · 28% · 98% | 4.9 · 39% · 63% · 50% · 85% |
| 2 | 2 | 2.5 · 5% · 12% · 3% · 100% | 3.1 · 8% · 19% · 7% · 100% | 3.9 · 18% · 34% · 23% · 98% | 4.7 · 30% · 52% · 39% · 90% |
| 2 | 4 | 2.4 · 5% · 10% · 3% · 100% | 3.1 · 7% · 16% · 6% · 100% | 3.8 · 15% · 30% · 18% · 99% | 4.6 · 26% · 46% · 36% · 93% |
| 3 | 0 | 2.7 · 6% · 16% · 4% · 100% | 3.3 · 11% · 26% · 10% · 100% | 4.1 · 22% · 42% · 28% · 97% | 4.9 · 38% · 62% · 50% · 87% |
| 3 | 2 | 2.5 · 5% · 12% · 5% · 100% | 3.1 · 7% · 19% · 6% · 100% | 3.8 · 15% · 31% · 20% · 99% | 4.6 · 26% · 47% · 35% · 93% |
| 3 | 4 | 2.3 · 4% · 8% · 2% · 100% | 3.0 · 5% · 13% · 4% · 100% | 3.7 · 9% · 23% · 11% · 100% | 4.5 · 17% · 35% · 26% · 97% |

**The other normal encounters (CV 400)**, Momentum 0:

| Level | 1 Elite + 2 Standards | 2 Elites | 8 Grunts | 2 Standards + 8 Minions |
|---:|---|---|---|---|
| 1 | 3.4 · 11% · 26% · 10% · 100% | 3.6 · 11% · 27% · 8% · 100% | 3.2 · 7% · 20% · 2% · 100% | 3.4 · 13% · 29% · 8% · 100% |
| 2 | 3.5 · 10% · 26% · 10% · 100% | 3.7 · 10% · 26% · 10% · 100% | 3.2 · 7% · 19% · 1% · 100% | 3.4 · 13% · 28% · 10% · 100% |
| 3 | 3.5 · 10% · 25% · 10% · 100% | 3.7 · 10% · 26% · 10% · 100% | 3.1 · 7% · 19% · 2% · 100% | 3.4 · 12% · 27% · 9% · 100% |

## 4. Escalation 1 to 6: where the turns are

The normal fight (4 Standards), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.

| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |
|---:|---:|---:|---:|---:|---:|---|---|
| 0 | 1 | 34% | 43% | 22% | 1% | 66% / 23% / 1% | 3.3 · 11% · 26% · 10% · 100% |
| 1 | 2 | 0% | 56% | 38% | 6% | 100% / 44% / 6% | 3.2 · 10% · 22% · 11% · 100% |
| 2 | 3 | 0% | 37% | 44% | 19% | 100% / 63% / 19% | 3.1 · 7% · 19% · 6% · 100% |
| 3 | 4 | 0% | 0% | 58% | 42% | 100% / 100% / 42% | 3.1 · 6% · 15% · 4% · 100% |
| 4 | 5 | 0% | 0% | 38% | 62% | 100% / 100% / 62% | 3.0 · 5% · 13% · 4% · 100% |

## 5. How it is played (level 2, Momentum 0 to 2 in turn)

| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |
|---|---|---|---|---|
| 3 Standards (easy) | 2.6 · 6% · 15% · 4% · 100% | 2.6 · 3% · 10% · 1% · 100% | 2.6 · 8% · 17% · 7% · 100% | 2.7 · 4% · 11% · 4% · 100% |
| 4 Standards (normal) | 3.2 · 9% · 22% · 8% · 100% | 3.2 · 7% · 18% · 4% · 100% | 3.3 · 12% · 26% · 10% · 100% | 3.5 · 9% · 20% · 26% · 100% |
| 1 Elite + 2 Standards (normal) | 3.4 · 10% · 23% · 9% · 100% | 3.3 · 6% · 17% · 3% · 100% | 3.4 · 14% · 28% · 16% · 100% | 3.6 · 8% · 18% · 18% · 100% |
| 5 Standards (hard) | 3.9 · 17% · 35% · 20% · 99% | 3.9 · 13% · 29% · 14% · 99% | 4.2 · 29% · 48% · 36% · 95% | 4.8 · 21% · 38% · 56% · 98% |
| 6 Standards (deadly) | 4.7 · 33% · 55% · 42% · 88% | 4.6 · 27% · 49% · 37% · 93% | 4.8 · 51% · 73% · 63% · 72% | 6.1 · 42% · 64% · 83% · 85% |

## 6. Ranged against melee

Level 2, Momentum 0 to 2 in turn. **As built:** two Paladins with Greatswords (0 / 5 + 1d6 / 8 + 1d8) and two Archers with Crossbows (0 / 2 + 1d4 / 4 + 1d4). **All Crossbows:** the Paladins with the Archers' weapon. The gap is closed when the second party is no longer the better one. Fight cells: Health lost · a PC Down · won.

| Map | Normal: as built | Normal: all Crossbows | Deadly: as built | Deadly: all Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn |
|---|---|---|---|---|---|---|
| open | 9% · 8% · 100% | 7% · 6% · 100% | 33% · 42% · 88% | 33% · 50% · 89% | 27.5 / 21.2 | 6.3 / 4.1 |
| pillars | 11% · 11% · 100% | 10% · 12% · 100% | 46% · 56% · 76% | 51% · 68% · 68% | 28.3 / 20.6 | 6.2 / 3.7 |

## 7. On the maps (level 2)

| Encounter | Policy | open | corridor | pillars |
|---|---|---|---|---|
| 4 Standards (normal) | the plan | 3.2 · 9% · 21% · 7% · 100% | 3.3 · 12% · 25% · 13% · 99% | 3.3 · 11% · 25% · 11% · 100% |
| 4 Standards (normal) | holding the line | 3.2 · 8% · 19% · 4% · 100% | 3.2 · 9% · 20% · 6% · 100% | 3.2 · 7% · 19% · 4% · 100% |
| 6 Standards (deadly) | the plan | 4.7 · 34% · 56% · 43% · 87% | 4.7 · 41% · 65% · 53% · 81% | 4.8 · 46% · 69% · 56% · 76% |
| 6 Standards (deadly) | holding the line | 4.6 · 28% · 50% · 38% · 92% | 4.8 · 40% · 63% · 53% · 83% | 4.7 · 37% · 59% · 51% · 86% |

## 8. A day: Momentum 0 to 4

Four fights with no Rest (easy, normal, normal, hard). **The ladder** (Chapter 2): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum (the system's `roundrules.mjs escalationStartAt`, `momentumAfter`). **Flat:** every fight starts at Escalation 1.

| Level | | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |
|---:|---|---|---|---|---|---|
| 1 | The ladder | Momentum 0.0: 2.6 r · 7% · Down 4% · won 100% | Momentum 1.0: 3.2 r · 11% · Down 11% · won 100% | Momentum 1.8: 3.2 r · 9% · Down 7% · won 100% | Momentum 2.8: 4.0 r · 21% · Down 26% · won 98% | 98% |
| 1 | Flat | Momentum 0.0: 2.6 r · 6% · Down 3% · won 100% | Momentum 0.0: 3.3 r · 11% · Down 10% · won 99% | Momentum 0.0: 3.3 r · 11% · Down 12% · won 100% | Momentum 0.0: 4.2 r · 26% · Down 35% · won 96% | 95% |
| 2 | The ladder | Momentum 0.0: 2.7 r · 6% · Down 3% · won 100% | Momentum 1.0: 3.2 r · 10% · Down 11% · won 100% | Momentum 1.8: 3.2 r · 8% · Down 10% · won 100% | Momentum 2.7: 3.8 r · 15% · Down 20% · won 98% | 98% |
| 2 | Flat | Momentum 0.0: 2.7 r · 7% · Down 4% · won 100% | Momentum 0.0: 3.3 r · 12% · Down 11% · won 100% | Momentum 0.0: 3.3 r · 12% · Down 13% · won 100% | Momentum 0.0: 4.2 r · 26% · Down 36% · won 95% | 95% |
| 3 | The ladder | Momentum 0.0: 2.7 r · 7% · Down 4% · won 100% | Momentum 1.0: 3.2 r · 9% · Down 9% · won 100% | Momentum 1.9: 3.2 r · 8% · Down 8% · won 100% | Momentum 2.8: 3.8 r · 14% · Down 23% · won 98% | 98% |
| 3 | Flat | Momentum 0.0: 2.7 r · 6% · Down 4% · won 100% | Momentum 0.0: 3.3 r · 10% · Down 10% · won 100% | Momentum 0.0: 3.3 r · 12% · Down 12% · won 100% | Momentum 0.0: 4.2 r · 24% · Down 35% · won 96% | 96% |

## 9. Enemies that do more than damage (the turn budget)

The Bestiary since this pack builds an NPC's Actions on a **turn budget** (`book/ruler/budget.md`, `sim/budget.mjs`; the price list is the system's `config.mjs npcBudget`). The Standards below are four of the Bestiary's kind of creature, each built on the budget (Basic attack and 2 AP Round Special, the riders paid from their points): **Raider** (Push 1 on its Basic attack, Prone on its Special), **Hexer** (Vs. WD and [R]; Slowed 1), **Cutter** (Bleed 1d4), **Guard** (1 Pressure Bane; Push 2; a 1R Reaction that strikes back when it is hit). An encounter of 4 has one of each; 3, 5 and 6 take them in that order. **Damage only** is the Bestiary's damage table of before (the yardstick). Momentum 0. Cells: rounds · Health lost · cost · a PC Down · won.

| Level | Enemies | 3 Standards (easy) | 4 (normal) | 5 (hard) | 6 (deadly) |
|---:|---|---|---|---|---|
| 1 | damage only | 2.6 · 7% · 16% · 4% · 100% | 3.3 · 12% · 27% · 12% · 100% | 4.1 · 25% · 45% · 28% · 98% | 4.9 · 44% · 68% · 53% · 82% |
| 1 | with effects | 2.8 · 6% · 17% · 3% · 100% | 3.5 · 11% · 27% · 8% · 100% | 4.5 · 22% · 44% · 23% · 99% | 5.7 · 49% · 77% · 57% · 77% |
| 2 | damage only | 2.7 · 6% · 16% · 4% · 100% | 3.3 · 12% · 26% · 11% · 100% | 4.1 · 21% · 41% · 28% · 98% | 4.9 · 39% · 63% · 50% · 85% |
| 2 | with effects | 2.9 · 6% · 16% · 5% · 100% | 3.6 · 9% · 25% · 5% · 100% | 4.5 · 20% · 42% · 23% · 99% | 5.4 · 43% · 69% · 51% · 80% |
| 3 | damage only | 2.7 · 6% · 16% · 4% · 100% | 3.3 · 11% · 26% · 10% · 100% | 4.1 · 22% · 42% · 28% · 97% | 4.9 · 38% · 62% · 50% · 87% |
| 3 | with effects | 2.9 · 7% · 17% · 4% · 100% | 3.6 · 10% · 26% · 7% · 100% | 4.5 · 19% · 41% · 23% · 98% | 5.6 · 40% · 67% · 51% · 83% |

## 10. The four Ranks with effects

Levels 1 and 2 (the mean). **With effects:** every NPC on the budget with riders (a Minion: Push 1, Hindered; a Grunt: Push 1, Vulnerable 1; a Standard: the four above in turn; an Elite: Push 1, Prone, a 3 AP Encounter area with Slowed 1 and its pay-back, a 1R Reaction). **Damage only:** the same budget with no riders and no Reaction. Cells: cost · a PC Down · won.

| Encounter (CV) | Damage only (the table before) | Damage only, on the budget | With effects |
|---|---|---|---|
| 4 Standards (400) | 27% · 12% · 100% | 27% · 12% · 100% | 26% · 6% · 100% |
| 2 Elites (400) | 26% · 9% · 100% | 25% · 6% · 100% | 24% · 2% · 100% |
| 1 Elite + 2 Standards (400) | 26% · 10% · 100% | 25% · 9% · 100% | 25% · 6% · 100% |
| 8 Grunts (400) | 20% · 2% · 100% | 26% · 7% · 100% | 26% · 8% · 100% |
| 2 Standards + 8 Minions (400) | 28% · 9% · 100% | 31% · 13% · 100% | 29% · 9% · 100% |
| 16 Minions (400) | 30% · 6% · 100% | 30% · 7% · 100% | 28% · 5% · 100% |
| 6 Standards (600) | 65% · 51% · 83% | 71% · 59% · 79% | 73% · 54% · 79% |
| 3 Elites (600) | 62% · 51% · 88% | 60% · 43% · 86% | 56% · 27% · 93% |
| 12 Grunts (600) | 41% · 14% · 100% | 63% · 44% · 89% | 61% · 40% · 92% |
| 4 Standards + 8 Minions (600) | 65% · 52% · 89% | 70% · 57% · 82% | 66% · 45% · 87% |

## 11. The six Roles with what makes them (level 2)

Four of a Role (the Leader: one Leader with three Standards with effects, against four Standards with effects), and six for the deadly fight. Each Role has its ratings (the Bestiary's Roles table) and is built on the budget: the **Soldier** with Hold the Line (1R, Trigger: a PC's Strike hits an ally within 2: it attacks that PC) and Immobilized on its Special; the **Controller** with Frightened and Dazed 1 (Vs. WD); the **Leader** with Rally (1 AP, Round: its allies within 5 gain 1 Boon on their next attack, 9 points taken from its Special). Plain Standards with effects: the first row. Cells: cost · a PC Down · won.

| Role | Normal (4) | Deadly (6) |
|---|---|---|
| Standards with effects | 25% · 5% · 100% | 69% · 51% · 80% |
| Striker | 24% · 11% · 100% | 57% · 49% · 89% |
| Soldier | 24% · 7% · 100% | 63% · 49% · 85% |
| Skirmisher | 26% · 10% · 100% | 58% · 45% · 89% |
| Artillery | 28% · 4% · 100% | 62% · 36% · 92% |
| Controller | 26% · 7% · 100% | 65% · 49% · 87% |
| Leader | 27% · 8% · 100% | 64% · 47% · 86% |

## 12. Grunts and Minions, settled on these numbers

**Grunts** (with effects): today's points an AP (17), one rating up (20: candidate (a) of the backlog), Health 30 with only the Round Special one rating up (candidate (b)), and a Standard's points an AP (25). **Minions** (with effects): their points an AP (15 today, 18), and a Minion's High Defense at one point a rating (10 / 11 / 12 / 13) against today's 14. Levels 1 and 2. Cells: cost · a PC Down · won.

| Grunts | 8 Grunts (400) | 2 Standards + 4 Grunts (400) | 12 Grunts (600) | 4 Standards + 4 Grunts (600) |
|---|---|---|---|---|
| 17 an AP (the table's Grunt, on the budget) | 17% · 1% · 100% | 24% · 5% · 100% | 35% · 8% · 100% | 60% · 40% · 92% |
| (a) 20 an AP (a rating up) | 18% · 2% · 100% | 25% · 7% · 100% | 38% · 12% · 100% | 63% · 41% · 89% |
| (b) Health 30, the Round Special a rating up | 21% · 2% · 100% | 27% · 8% · 100% | 47% · 17% · 98% | 70% · 51% · 83% |
| **chosen: 25 an AP (a Standard's), Health 26** | 26% · 8% · 100% | 27% · 8% · 100% | 61% · 40% · 92% | 67% · 50% · 85% |

| Minions | 16 Minions (400) | 2 Standards + 8 Minions (400) | 4 Standards + 8 Minions (600) |
|---|---|---|---|
| 15 an AP, Defense 12 (Medium) | 20% · 0% · 100% | 26% · 6% · 100% | 58% · 36% · 94% |
| 18 an AP, Defense 12 (Medium) | 28% · 5% · 100% | 29% · 9% · 100% | 66% · 45% · 87% |
| 18 an AP, Defense 13 (High at one point a rating) | 30% · 6% · 100% | 30% · 9% · 100% | 70% · 51% · 84% |
| 18 an AP, Defense 14 (today's High) | 33% · 7% · 100% | 32% · 10% · 100% | 73% · 53% · 81% |


(5.3 minutes.)
