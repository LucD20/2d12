# The Bestiary refit: the numbers (pack E3)

Written by `node book/ruler/bestiary.mjs` (the spec ruler with the map model). Don't edit this file: edit the script and run it again. The proposal that reads it is `book/bestiary-e3.md`.

Runs: 1000 fights a measurement, 600 a calibration step, 600 days. **The parties** (book/ruler/classes): Smite ×2 + Double Shot ×2; Smite ×2 + Rolling Shot ×2; each number is the mean of the two. Half the fights start with Momentum; a Daily only in a hard fight (CV 1.25 a PC or more). **The NPCs:** the level 1 Bestiary (Medium, Foundry's default ratings: Body High) with Health and damage × the factors; Defense and Modifier never change (decided). NPC damage is rolled with the table's exact average (exact: the nearest dice moved by a flat amount), so the tables below are what was simulated. The PCs' Health uses the new factor (Level + 17) / 16 unless a row says *today*.

## 1. Today: the real classes against today's Bestiary

Levels 1-3 against the Bestiary's own rows for that level (Health ×1.14 at levels 2-3, damage ×12/11 and ×13/11) and today's Health factor (Level + 10) / 10. Rounds · Health lost · a PC Down · the party wins.

| Fight (CV) | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 4 Standards (4) | 3.1 r · 22% · Down 8% · won 100% | 3.4 r · 24% · Down 12% · won 100% | 3.2 r · 23% · Down 10% · won 100% |
| Elite + 2 Standards (4) | 3.2 r · 28% · Down 24% · won 100% | 3.5 r · 30% · Down 28% · won 100% | 3.4 r · 28% · Down 25% · won 100% |
| 2 Elites (4) | 3.3 r · 32% · Down 34% · won 100% | 3.7 r · 36% · Down 40% · won 99% | 3.4 r · 33% · Down 33% · won 100% |
| 6 Standards (6, today's hard) | 5.1 r · 44% · Down 47% · won 99% | 5.8 r · 49% · Down 54% · won 97% | 5.4 r · 41% · Down 49% · won 98% |
| 2 Elites + 2 Standards (6, today's hard) | 5.8 r · 62% · Down 76% · won 85% | 6.4 r · 68% · Down 82% · won 76% | 5.7 r · 56% · Down 71% · won 85% |

## 2. The tier 1 refit: NPC Health and damage factors

For each target share of Health lost, the factors on the level 1 Bestiary for which 4 Standards last 3.5 rounds and cost the party that share (found by bisection, alternating). Levels 2 and 3 are calibrated on their own to show how far a flat tier drifts (model A: the NPCs of a tier don't change).

| Target Health lost | Level 1: Health / damage factor | Level 2 | Level 3 | Level 3 against the level 1 factors: rounds · lost |
|---|---:|---:|---:|---|
| 33% | 1.10 / 1.38 | 1.11 / 1.45 | 1.17 / 1.58 | 3.3 r · 27% |
| 40% | 1.03 / 1.73 | 1.03 / 1.84 | 1.10 / 1.98 | 3.2 r · 33% |

## 3. Fight length and Health lost by CV (the refit, Elites unchanged)

Rounds · Health lost · a PC Down · the party wins. Target rounds: LV's (easy 2.5, standard 3.5, hard 4-4.5, deadly 5).

### Target 33% (factors 1.10 / 1.38)

| Fight | target rounds | Level 1 | Level 2 | Level 3 |
|---|---:|---|---|---|
| easy: 3 Standards (CV 3) | 2.5 | 2.6 r · 20% · Down 9% · won 100% | 2.5 r · 19% · Down 7% · won 100% | 2.4 r · 17% · Down 5% · won 100% |
| standard: 4 Standards (CV 4) | 3.5 | 3.5 r · 32% · Down 27% · won 100% | 3.4 r · 31% · Down 23% · won 100% | 3.3 r · 27% · Down 17% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.9 r · 43% · Down 55% · won 98% | 3.7 r · 40% · Down 49% · won 98% | 3.5 r · 34% · Down 39% · won 99% |
| standard: 2 Elites (CV 4) | 3.5 | 4.1 r · 51% · Down 67% · won 92% | 4.0 r · 48% · Down 63% · won 94% | 3.7 r · 42% · Down 53% · won 97% |
| standard: 8 Grunts (CV 4) | 3.5 | 4.5 r · 42% · Down 40% · won 100% | 4.4 r · 40% · Down 33% · won 100% | 4.2 r · 34% · Down 24% · won 100% |
| standard: 2 Standards + 8 Minions (CV 4) | 3.5 | 4.1 r · 33% · Down 30% · won 100% | 4.1 r · 31% · Down 25% · won 100% | 4.0 r · 28% · Down 21% · won 100% |
| hard: 5 Standards (CV 5) | 4-4.5 | 4.8 r · 49% · Down 57% · won 95% | 4.7 r · 46% · Down 50% · won 97% | 4.3 r · 36% · Down 39% · won 99% |
| hard: Elite + 3 Standards (CV 5) | 4-4.5 | 5.3 r · 63% · Down 79% · won 82% | 5.1 r · 58% · Down 73% · won 87% | 4.6 r · 45% · Down 60% · won 95% |
| deadly: 6 Standards (CV 6) | 5 | 6.0 r · 70% · Down 82% · won 71% | 6.0 r · 65% · Down 78% · won 79% | 5.5 r · 51% · Down 65% · won 91% |
| deadly: 2 Elites + 2 Standards (CV 6) | 5 | 5.3 r · 90% · Down 96% · won 28% | 5.6 r · 87% · Down 94% · won 36% | 5.7 r · 72% · Down 86% · won 64% |
| beyond: 8 Standards (CV 8, today's deadly) |  | 4.4 r · 98% · Down 99% · won 7% | 4.9 r · 96% · Down 99% · won 11% | 6.0 r · 87% · Down 94% · won 34% |

### Target 40% (factors 1.03 / 1.73)

| Fight | target rounds | Level 1 | Level 2 | Level 3 |
|---|---:|---|---|---|
| easy: 3 Standards (CV 3) | 2.5 | 2.5 r · 24% · Down 18% · won 100% | 2.4 r · 23% · Down 15% · won 100% | 2.3 r · 20% · Down 11% · won 100% |
| standard: 4 Standards (CV 4) | 3.5 | 3.6 r · 40% · Down 45% · won 98% | 3.4 r · 37% · Down 39% · won 99% | 3.3 r · 33% · Down 30% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 4.0 r · 54% · Down 74% · won 89% | 3.8 r · 49% · Down 67% · won 93% | 3.5 r · 43% · Down 58% · won 97% |
| standard: 2 Elites (CV 4) | 3.5 | 4.1 r · 63% · Down 81% · won 77% | 4.0 r · 60% · Down 79% · won 82% | 3.7 r · 53% · Down 71% · won 89% |
| standard: 8 Grunts (CV 4) | 3.5 | 4.7 r · 52% · Down 60% · won 96% | 4.5 r · 49% · Down 50% · won 97% | 4.2 r · 43% · Down 42% · won 99% |
| standard: 2 Standards + 8 Minions (CV 4) | 3.5 | 4.2 r · 41% · Down 50% · won 99% | 4.2 r · 39% · Down 44% · won 100% | 4.0 r · 35% · Down 35% · won 100% |
| hard: 5 Standards (CV 5) | 4-4.5 | 4.8 r · 63% · Down 76% · won 81% | 4.7 r · 58% · Down 71% · won 86% | 4.4 r · 47% · Down 59% · won 93% |
| hard: Elite + 3 Standards (CV 5) | 4-4.5 | 5.0 r · 75% · Down 90% · won 61% | 4.9 r · 72% · Down 88% · won 67% | 4.6 r · 58% · Down 76% · won 84% |
| deadly: 6 Standards (CV 6) | 5 | 5.1 r · 84% · Down 93% · won 41% | 5.3 r · 80% · Down 90% · won 51% | 5.3 r · 67% · Down 80% · won 72% |
| deadly: 2 Elites + 2 Standards (CV 6) | 5 | 4.2 r · 96% · Down 99% · won 11% | 4.5 r · 95% · Down 98% · won 16% | 4.9 r · 85% · Down 94% · won 38% |
| beyond: 8 Standards (CV 8, today's deadly) |  | 3.2 r · 100% · Down 100% · won 1% | 3.5 r · 99% · Down 100% · won 2% | 4.2 r · 96% · Down 98% · won 11% |

## 4. What a role is worth in Standards (its real CV)

How many Standards take as much of the party's Health as the encounter (interpolated between whole counts); **CV each** = (that count − the Standards in it) ÷ the role's count. Level 1 and level 3, the refit's factors.

### Target 33%

| Encounter | book CV | Level 1: Standards for it · CV each | Level 3: Standards · CV each |
|---|---:|---|---|
| Elite + 2 Standards | 4 | 4.6 · 2.58 | 4.9 · 2.94 |
| Elite + 3 Standards | 5 | 5.7 · 2.69 | 5.6 · 2.63 |
| 2 Elites | 4 | 5.1 · 2.54 | 5.4 · 2.71 |
| 2 Elites + 2 Standards | 6 | 7.3 · 2.63 | 7.1 · 2.54 |
| 8 Grunts | 4 | 4.6 · 0.57 | 4.9 · 0.61 |
| 4 Grunts + 2 Standards | 4 | 4.3 · 0.57 | 4.4 · 0.61 |
| 2 Standards + 8 Minions | 4 | 4.0 · 0.24 | 4.0 · 0.25 |
| 16 Minions | 4 | 3.1 · 0.19 | 3.1 · 0.19 |

### Target 40%

| Encounter | book CV | Level 1: Standards for it · CV each | Level 3: Standards · CV each |
|---|---:|---|---|
| Elite + 2 Standards | 4 | 4.6 · 2.60 | 4.7 · 2.73 |
| Elite + 3 Standards | 5 | 5.7 · 2.69 | 5.6 · 2.59 |
| 2 Elites | 4 | 5.1 · 2.53 | 5.3 · 2.65 |
| 2 Elites + 2 Standards | 6 | 7.2 · 2.60 | 7.0 · 2.49 |
| 8 Grunts | 4 | 4.6 · 0.57 | 4.7 · 0.58 |
| 4 Grunts + 2 Standards | 4 | 4.3 · 0.57 | 4.4 · 0.59 |
| 2 Standards + 8 Minions | 4 | 4.1 · 0.26 | 4.1 · 0.27 |
| 16 Minions | 4 | 3.2 · 0.20 | 3.2 · 0.20 |

### Role fixes

Each fix found by bisection at level 1 so that the encounter (Elite + 2 Standards; 8 Grunts) costs the party what 4 Standards cost; the factor is on top of section 2's. Rounds · Health lost · a PC Down, at level 1 · level 3.

| Target | Role: fix | factor | Medium Health / damage a turn vs AD 14 | Elite + 2 Standards or 8 Grunts | 2 Elites or 4 Grunts + 2 Standards | Elite + 3 Standards (hard) or 10 Grunts (hard) |
|---|---|---:|---|---|---|---|
| 33% | elite: damage only | 0.75 | 132 / 16.7 | 3.6 r · 34% · Down 35% / 3.3 r · 28% · Down 22% | 3.7 r · 36% · Down 39% / 3.3 r · 29% · Down 25% | 5.0 r · 50% · Down 63% / 4.3 r · 35% · Down 41% |
| 33% | elite: Health only | 0.53 | 69 / 22.2 | 3.0 r · 34% · Down 40% / 2.7 r · 27% · Down 27% | 2.2 r · 28% · Down 34% / 2.0 r · 23% · Down 21% | 4.2 r · 51% · Down 64% / 3.7 r · 37% · Down 45% |
| 33% | elite: both (√ each) | 0.67 | 108 / 18.2 | 3.4 r · 33% · Down 35% / 3.1 r · 27% · Down 23% | 3.1 r · 33% · Down 36% / 2.8 r · 27% · Down 23% | 4.7 r · 52% · Down 64% / 4.1 r · 36% · Down 43% |
| 33% | elite: no change | 1.00 | 132 / 22.2 | 3.9 r · 43% · Down 55% / 3.5 r · 34% · Down 39% | 4.1 r · 51% · Down 67% / 3.7 r · 42% · Down 53% | 5.3 r · 63% · Down 79% / 4.6 r · 45% · Down 60% |
| 33% | grunt: damage only | 0.80 | 34 / 4.8 | 4.3 r · 34% · Down 19% / 4.0 r · 27% · Down 8% | 4.0 r · 35% · Down 30% / 3.6 r · 28% · Down 19% | 5.8 r · 47% · Down 48% / 5.3 r · 33% · Down 32% |
| 33% | grunt: Health only | 0.69 | 23 / 6.0 | 3.3 r · 33% · Down 20% / 3.1 r · 27% · Down 11% | 3.5 r · 32% · Down 25% / 3.2 r · 26% · Down 16% | 4.5 r · 48% · Down 50% / 4.2 r · 36% · Down 35% |
| 33% | grunt: both (√ each) | 0.75 | 30 / 5.2 | 4.0 r · 34% · Down 21% / 3.7 r · 27% · Down 11% | 3.8 r · 34% · Down 30% / 3.5 r · 27% · Down 16% | 5.3 r · 48% · Down 51% / 4.9 r · 35% · Down 37% |
| 33% | grunt: no change | 1.00 | 34 / 6.0 | 4.5 r · 42% · Down 40% / 4.2 r · 34% · Down 24% | 4.1 r · 38% · Down 36% / 3.7 r · 30% · Down 22% | 6.4 r · 62% · Down 74% / 5.8 r · 45% · Down 57% |
| 33% | reference: 4 Standards | | 63 / 9.8 (today 57 / 7.1) | 3.5 r · 32% · Down 27% / 3.3 r · 27% · Down 17% | | |
| 40% | elite: damage only | 0.73 | 123 / 20.3 | 3.6 r · 40% · Down 50% / 3.3 r · 33% · Down 36% | 3.7 r · 43% · Down 56% / 3.3 r · 35% · Down 40% | 4.9 r · 63% · Down 77% / 4.4 r · 45% · Down 58% |
| 40% | elite: Health only | 0.51 | 63 / 28.0 | 2.9 r · 40% · Down 57% / 2.6 r · 33% · Down 43% | 2.2 r · 33% · Down 49% / 1.9 r · 26% · Down 34% | 4.1 r · 62% · Down 77% / 3.7 r · 46% · Down 61% |
| 40% | elite: both (√ each) | 0.64 | 99 / 22.3 | 3.4 r · 41% · Down 54% / 3.0 r · 33% · Down 38% | 3.1 r · 39% · Down 53% / 2.7 r · 32% · Down 37% | 4.6 r · 64% · Down 80% / 4.1 r · 46% · Down 61% |
| 40% | elite: no change | 1.00 | 123 / 28.0 | 4.0 r · 54% · Down 74% / 3.5 r · 43% · Down 58% | 4.1 r · 63% · Down 81% / 3.7 r · 53% · Down 71% | 5.0 r · 75% · Down 90% / 4.6 r · 58% · Down 76% |
| 40% | grunt: damage only | 0.79 | 32 / 6.0 | 4.3 r · 40% · Down 35% / 4.0 r · 33% · Down 20% | 4.0 r · 42% · Down 48% / 3.6 r · 35% · Down 33% | 6.1 r · 60% · Down 71% / 5.5 r · 43% · Down 55% |
| 40% | grunt: Health only | 0.61 | 19 / 7.6 | 3.2 r · 38% · Down 32% / 3.0 r · 32% · Down 20% | 3.4 r · 37% · Down 39% / 3.1 r · 31% · Down 25% | 4.3 r · 58% · Down 67% / 3.9 r · 44% · Down 49% |
| 40% | grunt: both (√ each) | 0.75 | 28 / 6.5 | 4.0 r · 41% · Down 38% / 3.6 r · 33% · Down 21% | 3.8 r · 41% · Down 46% / 3.4 r · 34% · Down 31% | 5.6 r · 60% · Down 70% / 5.1 r · 45% · Down 56% |
| 40% | grunt: no change | 1.00 | 32 / 7.6 | 4.7 r · 52% · Down 60% / 4.2 r · 43% · Down 42% | 4.1 r · 46% · Down 54% / 3.7 r · 38% · Down 39% | 5.7 r · 80% · Down 89% / 5.9 r · 61% · Down 77% |
| 40% | reference: 4 Standards | | 59 / 12.3 (today 57 / 7.1) | 3.6 r · 40% · Down 45% / 3.3 r · 33% · Down 30% | | |

## 5. The Standard day on the new scale

spec.mjs day(): four fights with no Rest; Momentum after each fight harder than easy; Rally Points carried over; a Daily in the hard fight. **New scale:** easy 3 Standards | standard 4 Standards | standard Elite + 2 Standards | hard Elite + 3 Standards (CV 5). **Today's scale** for comparison: the same, hard 2 Elites + 2 Standards (CV 6). **The proposal** = the refit + the Elite's damage fix + the Grunt's Health fix (section 4). Cleared · Downs a day (the party) · Rally Points left.

| NPCs | Scale | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| today's Bestiary, today's Health factor | today's | 82% · 2.02 · 42% | 71% · 2.49 · 45% | 94% · 1.52 · 49% |
| today's Bestiary, today's Health factor | new | 99% · 0.97 · 48% | 98% · 1.18 · 48% | 100% · 0.86 · 56% |
| refit 33%, no role fix | today's | 23% · 4.74 · 40% | 35% · 4.24 · 45% | 72% · 2.82 · 44% |
| refit 33%, no role fix | new | 75% · 3.10 · 31% | 85% · 2.60 · 38% | 98% · 1.52 · 47% |
| **the proposal, 33%** | new | 93% · 2.04 · 33% | 95% · 1.67 · 42% | 100% · 1.01 · 52% |
| refit 40%, no role fix | today's | 7% · 5.70 · 40% | 11% · 5.42 · 46% | 41% · 4.31 · 44% |
| refit 40%, no role fix | new | 43% · 4.79 · 34% | 55% · 4.21 · 37% | 88% · 2.83 · 38% |
| **the proposal, 40%** | new | 72% · 3.54 · 30% | 82% · 2.88 · 36% | 96% · 1.94 · 43% |
| the proposal, 33%: Smite + Lay On Hands + Double Shot + Rolling Shot (a check) | new | 94% · 1.62 · 28% | 97% · 1.15 · 38% | 100% · 0.63 · 51% |

## 5b. The proposal as a whole (target 33%): fights by CV

The refit with the Elite's damage fix and the Grunt's Health fix. Rounds · Health lost · a PC Down · the party wins. Last column: the mixed party at level 1 (a check).

| Fight | target rounds | Level 1 | Level 2 | Level 3 | mixed party, level 1 |
|---|---:|---|---|---|---|
| easy: 3 Standards (CV 3) | 2.5 | 2.6 r · 20% · Down 9% · won 100% | 2.5 r · 19% · Down 7% · won 100% | 2.4 r · 17% · Down 5% · won 100% | 2.7 r · 12% · Down 7% · won 100% |
| standard: 4 Standards (CV 4) | 3.5 | 3.5 r · 32% · Down 27% · won 100% | 3.4 r · 31% · Down 23% · won 100% | 3.3 r · 27% · Down 17% · won 100% | 3.5 r · 20% · Down 18% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.6 r · 34% · Down 35% · won 100% | 3.5 r · 32% · Down 28% · won 100% | 3.3 r · 28% · Down 22% · won 100% | 3.6 r · 22% · Down 27% · won 100% |
| standard: 2 Elites (CV 4) | 3.5 | 3.7 r · 36% · Down 39% · won 100% | 3.6 r · 34% · Down 36% · won 100% | 3.3 r · 29% · Down 25% · won 100% | 3.7 r · 24% · Down 32% · won 100% |
| standard: 8 Grunts (CV 4) | 3.5 | 3.3 r · 33% · Down 20% · won 100% | 3.3 r · 32% · Down 15% · won 100% | 3.1 r · 27% · Down 11% · won 100% | 3.3 r · 21% · Down 10% · won 100% |
| standard: 2 Standards + 8 Minions (CV 4) | 3.5 | 4.1 r · 33% · Down 30% · won 100% | 4.1 r · 31% · Down 25% · won 100% | 4.0 r · 28% · Down 21% · won 100% | 4.0 r · 18% · Down 16% · won 100% |
| hard: 5 Standards (CV 5) | 4-4.5 | 4.8 r · 49% · Down 57% · won 95% | 4.7 r · 46% · Down 50% · won 97% | 4.3 r · 36% · Down 39% · won 99% | 4.7 r · 34% · Down 43% · won 97% |
| hard: Elite + 3 Standards (CV 5) | 4-4.5 | 5.0 r · 50% · Down 63% · won 95% | 4.8 r · 47% · Down 54% · won 98% | 4.3 r · 35% · Down 41% · won 99% | 4.8 r · 35% · Down 48% · won 97% |
| deadly: 6 Standards (CV 6) | 5 | 6.0 r · 70% · Down 82% · won 71% | 6.0 r · 65% · Down 78% · won 79% | 5.5 r · 51% · Down 65% · won 91% | 5.9 r · 56% · Down 72% · won 78% |
| deadly: 2 Elites + 2 Standards (CV 6) | 5 | 6.2 r · 74% · Down 85% · won 66% | 6.3 r · 67% · Down 80% · won 78% | 5.6 r · 51% · Down 66% · won 92% | 6.2 r · 60% · Down 79% · won 75% |
| beyond: 8 Standards (CV 8, today's deadly) |  | 4.4 r · 98% · Down 99% · won 7% | 4.9 r · 96% · Down 99% · won 11% | 6.0 r · 87% · Down 94% · won 34% | 5.0 r · 93% · Down 97% · won 16% |

## 6. Tiers 2 and 3 (levels 5-10): from LV's stand-ins

No class has levels above 3 yet, so the steps of model A come from LV (progression.md section 2, model A): NPC Health × its level's factor ÷ level 1's; NPC damage × the PCs' Health factor (Level + 17) / 16 at the tier's first level ÷ level 1's. **CV of a lower tier** = √(its Health × damage factors ÷ the party tier's) (LV: within about 0.05 of every measured value).

| Tier (levels) | NPC Health (tier 1 = 1) | NPC damage (tier 1 = 1) | CV of an NPC one tier below | two tiers below |
|---|---:|---:|---:|---:|
| 1 (1-4) | ×1.00 | ×1.00 | - | - |
| 2 (5-7) | ×1.17 | ×1.22 | ×0.84 | - |
| 3 (8-10) | ×1.61 | ×1.39 | ×0.80 | ×0.67 |

## 7. The proposed tables (target 33%)

Today's level 1 numbers × the refit (Health ×1.10, damage ×1.38; Elite damage ×0.75 more, Grunt Health ×0.69 more) × the tier (section 6). Health Multipliers rounded to 0.25, damage to 0.5. The ratings keep today's level 1 steps at every tier (no drift between ratings inside a tier). Health Base, Attributes and Defenses don't change.

### Minion

| Tier | Health Multiplier terrible | Health Multiplier low | Health Multiplier medium | Health Multiplier high | damage terrible | damage low | damage medium | damage high | all Medium: Health |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 (1-4) | ×0 | ×0.75 | ×1 | ×1.25 | 1.5 / 3.5 | 2 / 5 | 3 / 5.5 | 3.5 / 7 | 6 |
| 2 (5-7) | ×0 | ×1 | ×1.25 | ×1.5 | 1.5 / 4 | 2.5 / 6 | 3.5 / 6.5 | 4 / 8.5 | 8 |
| 3 (8-10) | ×0 | ×1.25 | ×1.75 | ×2.25 | 2 / 5 | 3 / 6.5 | 4 / 7.5 | 5 / 9.5 | 10 |
| today, level 1 | ×0 | ×0.75 | ×1 | ×1.25 | 1 / 2.5 | 1.5 / 3.5 | 2 / 4 | 2.5 / 5 | 6 |

### Grunt

| Tier | Health Multiplier terrible | Health Multiplier low | Health Multiplier medium | Health Multiplier high | Health Multiplier extreme | damage terrible | damage low | damage medium | damage high | damage extreme | all Medium: Health |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 (1-4) | ×2 | ×2.75 | ×3.75 | ×4.75 | ×5.75 | 3 / 4 | 3.5 / 5 | 4 / 6 | 5.5 / 7.5 | 6 / 9.5 | 22 |
| 2 (5-7) | ×2.25 | ×3.25 | ×4.5 | ×5.5 | ×6.75 | 3.5 / 5 | 4 / 6 | 5 / 7.5 | 6.5 / 9.5 | 7.5 / 12 | 24 |
| 3 (8-10) | ×3 | ×4.5 | ×6 | ×7.75 | ×9.25 | 4 / 5.5 | 5 / 6.5 | 5.5 / 8.5 | 7.5 / 10.5 | 8.5 / 13.5 | 30 |
| today, level 1 | ×2.5 | ×3.75 | ×5 | ×6.25 | ×7.5 | 2 / 3 | 2.5 / 3.5 | 3 / 4.5 | 4 / 5.5 | 4.5 / 7 | 26 |

### Standard

| Tier | Health Multiplier terrible | Health Multiplier low | Health Multiplier medium | Health Multiplier high | Health Multiplier extreme | damage terrible | damage low | damage medium | damage high | damage extreme | all Medium: Health |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 (1-4) | ×3.75 | ×5.75 | ×7.75 | ×9.5 | ×11.5 | 4 / 6 | 5 / 8.5 | 6 / 11 | 7.5 / 13 | 9.5 / 16 | 56 |
| 2 (5-7) | ×4.5 | ×6.75 | ×9 | ×11.25 | ×13.5 | 5 / 7.5 | 6 / 10 | 7.5 / 13.5 | 9.5 / 16 | 12 / 19.5 | 62 |
| 3 (8-10) | ×6.25 | ×9.25 | ×12.5 | ×15.5 | ×18.5 | 5.5 / 8.5 | 6.5 / 11.5 | 8.5 / 15.5 | 10.5 / 18 | 13.5 / 22 | 84 |
| today, level 1 | ×3.5 | ×5.25 | ×7 | ×8.75 | ×10.5 | 3 / 4.5 | 3.5 / 6 | 4.5 / 8 | 5.5 / 9.5 | 7 / 11.5 | 50 |

### Elite

| Tier | Health Multiplier terrible | Health Multiplier low | Health Multiplier medium | Health Multiplier high | Health Multiplier extreme | damage terrible | damage low | damage medium | damage high | damage extreme | all Medium: Health |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 (1-4) | ×6.5 | ×9.75 | ×13.25 | ×16.5 | ×19.75 | 4 / 6 | 5.5 / 9 | 7 / 11 | 9 / 13.5 | 10.5 / 15.5 | 118 |
| 2 (5-7) | ×7.75 | ×11.5 | ×15.5 | ×19.25 | ×23.25 | 5 / 7.5 | 7 / 10.5 | 9 / 13.5 | 10.5 / 16.5 | 12.5 / 19 | 136 |
| 3 (8-10) | ×10.75 | ×16 | ×21.25 | ×26.5 | ×32 | 5.5 / 8.5 | 8 / 12 | 10 / 15 | 12 / 18.5 | 14.5 / 21.5 | 182 |
| today, level 1 | ×6 | ×9 | ×12 | ×15 | ×18 | 4 / 6 | 5.5 / 8.5 | 7 / 10.5 | 8.5 / 13 | 10 / 15 | 108 |

## 8. The PCs' Health: (Level + 10) / 10 today, (Level + 17) / 16 decided

| Build | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 | Level 8 | Level 10 |
|---|---|---|---|---|---|---|---|
| paladin-smite (today → decided) | 39 → 40 | 43 → 42 | 46 → 44 | 50 → 46 | 53 → 49 | 64 → 55 | 70 → 60 |
| archer-double (today → decided) | 27 → 27 | 29 → 29 | 31 → 30 | 34 → 32 | 36 → 33 | 43 → 37 | 47 → 41 |

Run time: 1356 s.
