# The fights on the maps (SIM-2)

Written by `node book/ruler/sim/maps.mjs`; don't edit, run it again. The maps: `book/ruler/maps/*.txt` (`open` is the open field of report.md). The party: fights.txt's (the four R builds, level 1), the rules the book's today, the decisions the plan policy's (the ruler's old ones: nobody holds a chokepoint or looks for cover on purpose; SIM-3).

Runs: 400 fights a cell, 400 pairs a price.

| Map | What it is | Squares | Walls | Difficult Terrain |
|---|---|---:|---:|---:|
| open | The open field: no walls, Cover drawn by chance on each shot (5% Medium, 15% Low) | - | - | - |
| closequarters | Close quarters: small rooms and short lines, the sides start near each other (good for melee) | 14 × 11 | 14 inside | 0 |
| corridor | Corridor: two rooms joined by a passage 2 squares wide (a chokepoint) | 16 × 14 | 36 inside | 0 |
| longsight | Long sight lines: a wide open hall, the two sides far apart, low walls only at the edges (good for ranged) | 22 × 18 | 4 inside | 0 |
| pillars | Pillars: scattered pillars between the two sides (cover and blocked lines for everyone) | 16 × 15 | 8 inside | 0 |
| rough | Rough ground: patches of Difficult Terrain across the middle (Speed matters) | 16 × 14 | 0 inside | 50 |

## 1. The fights by map

Each cell: rounds · the party's Health lost · a PC goes Down · the party wins.

| Encounter | open | closequarters | corridor | longsight | pillars | rough |
|---|---|---|---|---|---|---|
| 4 Standards (normal) | 3.7 · 14% · 26% · 99% | 3.7 · 22% · 36% · 98% | 3.7 · 21% · 31% · 98% | 3.6 · 19% · 28% · 98% | 3.6 · 18% · 27% · 98% | 3.6 · 18% · 29% · 99% |
| 3 Standards + 1 Ward attacker | 3.7 · 17% · 29% · 98% | 3.8 · 25% · 39% · 98% | 3.7 · 21% · 32% · 98% | 3.7 · 20% · 29% · 98% | 3.8 · 23% · 33% · 97% | 3.6 · 18% · 28% · 99% |
| Elite + 2 Standards | 3.7 · 12% · 21% · 100% | 3.8 · 17% · 26% · 99% | 3.8 · 14% · 23% · 99% | 3.7 · 13% · 21% · 100% | 3.8 · 16% · 28% · 100% | 3.7 · 16% · 25% · 99% |
| 6 Standards (CV 6, deadly) | 5.6 · 43% · 65% · 76% | 5.1 · 64% · 83% · 51% | 5.7 · 60% · 85% · 59% | 5.5 · 51% · 73% · 69% | 5.3 · 57% · 77% · 61% | 5.5 · 53% · 77% · 69% |
| 2 Standards + 2 ranged Standards | 4.1 · 16% · 29% · 98% | 4.2 · 18% · 32% · 98% | 4.2 · 17% · 30% · 97% | 4.1 · 21% · 32% · 97% | 4.2 · 18% · 29% · 98% | 4.1 · 21% · 33% · 98% |

**What the map does to the party** (4 Standards (normal); per PC, a fight):

| | open | closequarters | corridor | longsight | pillars | rough |
|---|---:|---:|---:|---:|---:|---:|
| A Paladin: AP spent moving | 1.79 | 1.11 | 1.46 | 1.77 | 1.53 | 1.77 |
| A Paladin: damage dealt | 50.9 | 56.0 | 55.7 | 51.1 | 52.2 | 48.0 |
| A Paladin: damage taken | 18.7 | 22.1 | 19.2 | 18.8 | 18.9 | 18.4 |
| An Archer: AP spent moving | 0.00 | 0.04 | 0.05 | 0.00 | 0.06 | 0.00 |
| An Archer: damage dealt | 91.0 | 85.4 | 85.0 | 90.6 | 88.6 | 93.3 |
| An Archer: damage taken | 12.0 | 14.0 | 15.1 | 10.8 | 13.1 | 10.1 |
| An Archer: shots | 10.7 | 10.1 | 10.2 | 10.6 | 10.5 | 10.8 |
| ... with Cover (share of its shots) | 47% | 52% | 59% | 52% | 58% | 52% |
| ... Banes from the map on a shot | 0.87 | 0.92 | 1.17 | 1.10 | 1.18 | 0.82 |
| An Archer: Actions with no target it could see or reach | 0.00 | 0.41 | 0.31 | 0.00 | 0.21 | 0.00 |
| A Paladin: Actions with no target in reach | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| Reactions used (a PC) | 1.97 | 2.10 | 2.13 | 2.04 | 2.11 | 2.03 |
| Turns that start Engaged (an Archer) | 1.05 | 1.30 | 1.28 | 1.34 | 1.32 | 1.22 |
| Collision damage it caused (a PC) | 0.0 | 0.7 | 0.5 | 0.3 | 0.5 | 0.4 |

## 2. What Speed and the movement conditions are worth, by map

Each price is 400 pairs of fights with the same dice (every creature rolls its own), one with the change: 4 Standards (normal), the NPCs don't die, the first 3 rounds. **Value = the damage the party deals more + the damage it takes less** (DE; 1 AP is about 5.8 DE). For a condition: put on every Standard at the start of round 2 (they have closed in), the value for one Standard. A value under about 0.5 is inside the noise.

| Change | open | closequarters | corridor | longsight | pillars | rough |
|---|---:|---:|---:|---:|---:|---:|
| +1 Speed, both Paladins (5 → 6) | 0.10 ± 0.06 | 0.00 ± 0.00 | 0.06 ± 0.12 | 1.46 ± 0.34 | 0.02 ± 0.08 | 1.49 ± 0.32 |
| -1 Speed, both Paladins (5 → 4) | -0.03 ± 0.02 | -0.92 ± 0.42 | -0.06 ± 0.25 | 0.12 ± 0.18 | -1.18 ± 0.39 | 0.07 ± 0.14 |
| +1 Speed, both Archers (6 → 7) | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.09 ± 0.07 | 0.00 ± 0.00 | 0.01 ± 0.03 | 0.00 ± 0.00 |
| -1 Speed, both Archers (6 → 5) | 0.00 ± 0.00 | 0.00 ± 0.00 | -0.07 ± 0.13 | 0.00 ± 0.00 | 0.05 ± 0.03 | 0.00 ± 0.00 |
| -1 Speed on every Standard (5 → 4), for one | 0.71 ± 0.52 | 2.80 ± 0.68 | 2.31 ± 0.63 | 3.91 ± 0.64 | 1.88 ± 0.64 | 0.87 ± 0.56 |
| +1 Speed on every Standard (5 → 6), for one | -1.14 ± 0.49 | -1.29 ± 0.66 | -0.75 ± 0.36 | -1.32 ± 0.57 | -2.42 ± 0.66 | -2.44 ± 0.65 |
| Hindered (EoT) on a Standard | 0.63 ± 0.42 | 1.92 ± 0.44 | 1.16 ± 0.47 | 1.77 ± 0.39 | 0.57 ± 0.45 | 0.73 ± 0.43 |
| Immobilized (EoT) on a Standard | 2.73 ± 0.50 | 0.12 ± 0.63 | -0.03 ± 0.56 | 0.94 ± 0.61 | 0.54 ± 0.55 | 0.25 ± 0.60 |
| Slowed 1 on a Standard | 4.41 ± 0.42 | 4.38 ± 0.54 | 4.00 ± 0.57 | 5.02 ± 0.52 | 3.46 ± 0.56 | 4.10 ± 0.55 |
| Prone on a Standard | 4.18 ± 0.44 | 4.45 ± 0.54 | 3.97 ± 0.57 | 4.92 ± 0.51 | 3.44 ± 0.55 | 4.00 ± 0.55 |

A price is for one creature (the Speed rows: for one of the two PCs, or one of the four Standards). On the open field every Advance reaches whatever its length, so Speed is worth nothing there; a map gives it a price where the way is long (a corridor, rough ground) or the lines are blocked.

(20.8 minutes.)
