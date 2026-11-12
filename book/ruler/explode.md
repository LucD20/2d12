# Exploding damage dice (explode -1)

Written by `node book/ruler/sim/explode.mjs`. **Adopted by Lucas (2026-11-12): in the book since; this is the measurement behind it.** A die that explodes counts its top face as one less and is rolled again, as a 12 does on the 2d12: every die gains exactly 0.5 on average. **Who explodes:** a PC's weapon die only (not Smite, not a Passive's extra dice); a Standard's or an Elite's Basic attack always, its other Actions only with the trait (6 points); Minions and Grunts never. 800 fights a cell, no Momentum. Cells: rounds · Health lost · cost · a PC Down · won.

## 1. A PC's turn (Defense 13, Escalation 2)

| Build | Level | No explosion | Exploding | Change |
|---|---:|---:|---:|---:|
| Paladin (Smite) | 1 | 35.5 | 36.5 | +1.0 (3%) |
| Paladin (Lay On Hands) | 1 | 13.4 | 14.0 | +0.6 (4%) |
| Archer (Double Shot) | 1 | 27.7 | 28.9 | +1.2 (4%) |
| Archer (Rolling Shot) | 1 | 24.7 | 25.5 | +0.8 (3%) |
| Paladin (Smite) | 2 | 35.5 | 36.5 | +1.0 (3%) |
| Paladin (Lay On Hands) | 2 | 13.4 | 14.0 | +0.6 (4%) |
| Archer (Double Shot) | 2 | 28.1 | 29.3 | +1.2 (4%) |
| Archer (Rolling Shot) | 2 | 24.7 | 25.5 | +0.8 (3%) |

An enemy's turn against a level 1 Paladin (no move, no Encounter Action):

| Enemy | No explosion | Exploding |
|---|---:|---:|
| grunt | 6.0 | 6.0 |
| standard | 11.3 | 11.9 |
| elite | 16.3 | 17.0 |

## 2. The fights, enemies with effects

| Level | Dice | 4 Standards (normal) | 5 Standards (hard) | 6 Standards (deadly) |
|---:|---|---|---|---|
| 1 | no explosion | 3.6 · 12% · 29% · 8% · 100% | 4.6 · 22% · 46% · 23% · 97% | 5.7 · 49% · 78% · 56% · 75% |
| 1 | exploding | 3.5 · 12% · 29% · 9% · 100% | 4.5 · 25% · 47% · 26% · 97% | 5.7 · 51% · 79% · 59% · 75% |
| 1 | exploding, the trait on the 2 AP Special too | 3.5 · 12% · 28% · 9% · 100% | 4.5 · 27% · 49% · 31% · 95% | 5.5 · 49% · 77% · 57% · 78% |
| 2 | no explosion | 3.7 · 10% · 27% · 7% · 100% | 4.6 · 21% · 43% · 23% · 98% | 5.7 · 44% · 72% · 53% · 78% |
| 2 | exploding | 3.6 · 11% · 28% · 9% · 100% | 4.5 · 23% · 46% · 28% · 97% | 5.5 · 46% · 73% · 57% · 77% |
| 2 | exploding, the trait on the 2 AP Special too | 3.6 · 11% · 27% · 9% · 100% | 4.5 · 22% · 44% · 29% · 97% | 5.5 · 45% · 72% · 55% · 77% |
| 3 | no explosion | 3.6 · 10% · 26% · 7% · 100% | 4.6 · 20% · 43% · 24% · 98% | 5.7 · 43% · 71% · 56% · 81% |
| 3 | exploding | 3.6 · 11% · 27% · 9% · 100% | 4.5 · 23% · 44% · 28% · 97% | 5.6 · 43% · 70% · 57% · 82% |
| 3 | exploding, the trait on the 2 AP Special too | 3.6 · 11% · 27% · 9% · 100% | 4.5 · 22% · 43% · 27% · 97% | 5.5 · 42% · 69% · 56% · 80% |

## 3. Who gains (level 2)

| Dice | 4 Standards | 6 Standards |
|---|---|---|
| no explosion | 3.7 · 10% · 27% · 7% · 100% | 5.7 · 44% · 72% · 53% · 78% |
| only the PCs' weapon dice | 3.6 · 10% · 26% · 6% · 100% | 5.5 · 41% · 68% · 51% · 83% |
| only the enemies' Basic attacks | 3.7 · 11% · 28% · 10% · 100% | 5.6 · 47% · 75% · 58% · 75% |
| both | 3.6 · 11% · 28% · 9% · 100% | 5.5 · 46% · 73% · 57% · 77% |

## 4. The ranks (level 2, with effects; minor enemies don't explode)

| Encounter | No explosion | Exploding |
|---|---|---|
| 2 Elites | 4.0 · 7% · 25% · 2% · 100% | 3.9 · 7% · 24% · 2% · 100% |
| 8 Grunts | 3.2 · 12% · 26% · 8% · 100% | 3.2 · 12% · 26% · 9% · 100% |
| 2 Standards + 8 Minions | 3.6 · 12% · 28% · 7% · 100% | 3.6 · 12% · 28% · 9% · 100% |
| 3 Elites | 6.0 · 25% · 55% · 28% · 93% | 5.9 · 27% · 55% · 30% · 92% |
| 12 Grunts | 4.8 · 41% · 63% · 42% · 89% | 4.7 · 39% · 60% · 41% · 92% |
| 4 Standards + 4 Grunts | 5.5 · 40% · 67% · 51% · 84% | 5.4 · 43% · 69% · 54% · 82% |

## 5. The damage-only Standards (the table of before; its Basic attack explodes)

| Level | Dice | 4 | 6 |
|---:|---|---|---|
| 1 | no explosion | 3.3 · 12% · 27% · 10% · 100% | 5.0 · 43% · 68% · 50% · 84% |
| 1 | exploding | 3.3 · 12% · 27% · 12% · 100% | 4.9 · 43% · 68% · 52% · 83% |
| 2 | no explosion | 3.4 · 11% · 26% · 10% · 100% | 5.0 · 37% · 61% · 47% · 86% |
| 2 | exploding | 3.3 · 11% · 26% · 10% · 100% | 4.9 · 39% · 63% · 50% · 85% |
| 3 | no explosion | 3.4 · 10% · 25% · 9% · 100% | 5.0 · 36% · 60% · 48% · 87% |
| 3 | exploding | 3.3 · 12% · 26% · 10% · 100% | 4.9 · 38% · 62% · 53% · 87% |

(1.5 minutes.)
