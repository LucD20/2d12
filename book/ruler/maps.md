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
| 4 Standards (normal) | 3.8 · 14% · 23% · 98% | 3.8 · 18% · 31% · 98% | 3.9 · 16% · 27% · 98% | 3.8 · 18% · 28% · 98% | 3.8 · 16% · 26% · 97% | 3.8 · 16% · 28% · 100% |
| 3 Standards + 1 Ward attacker | 3.8 · 15% · 28% · 98% | 4.0 · 22% · 35% · 95% | 3.9 · 20% · 33% · 98% | 3.8 · 19% · 30% · 97% | 3.9 · 19% · 31% · 97% | 3.8 · 19% · 33% · 99% |
| Elite + 2 Standards | 3.9 · 14% · 25% · 100% | 3.9 · 15% · 27% · 100% | 3.8 · 12% · 21% · 99% | 3.8 · 13% · 21% · 99% | 4.0 · 15% · 25% · 100% | 3.8 · 14% · 24% · 100% |
| 6 Standards (CV 6, deadly) | 5.9 · 47% · 73% · 73% | 5.4 · 61% · 78% · 54% | 5.8 · 59% · 81% · 56% | 5.6 · 48% · 68% · 69% | 5.5 · 56% · 75% · 60% | 5.8 · 45% · 68% · 73% |
| 2 Standards + 2 ranged Standards | 4.2 · 16% · 27% · 98% | 4.2 · 13% · 29% · 99% | 4.3 · 14% · 26% · 97% | 4.2 · 18% · 28% · 96% | 4.3 · 15% · 28% · 98% | 4.2 · 17% · 33% · 97% |

**What the map does to the party** (4 Standards (normal); per PC, a fight):

| | open | closequarters | corridor | longsight | pillars | rough |
|---|---:|---:|---:|---:|---:|---:|
| A Paladin: AP spent moving | 1.87 | 1.15 | 1.61 | 1.89 | 1.57 | 1.78 |
| A Paladin: damage dealt | 53.8 | 59.5 | 57.3 | 51.6 | 56.5 | 52.0 |
| A Paladin: damage taken | 19.6 | 22.0 | 20.0 | 18.5 | 19.7 | 18.3 |
| An Archer: AP spent moving | 0.00 | 0.05 | 0.05 | 0.00 | 0.08 | 0.00 |
| An Archer: damage dealt | 97.6 | 90.6 | 93.5 | 99.8 | 93.5 | 99.0 |
| An Archer: damage taken | 12.8 | 14.1 | 16.0 | 12.3 | 13.9 | 10.5 |
| An Archer: shots | 11.3 | 10.8 | 11.0 | 11.5 | 11.1 | 11.4 |
| ... with Cover (share of its shots) | 48% | 51% | 56% | 50% | 57% | 50% |
| ... Banes from the map on a shot | 0.87 | 0.90 | 1.14 | 1.03 | 1.18 | 0.79 |
| An Archer: Actions with no target it could see or reach | 0.00 | 0.44 | 0.33 | 0.00 | 0.25 | 0.00 |
| A Paladin: Actions with no target in reach | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| Reactions used (a PC) | 2.03 | 2.25 | 2.22 | 2.12 | 2.22 | 2.15 |
| Turns that start Engaged (an Archer) | 1.12 | 1.31 | 1.41 | 1.53 | 1.37 | 1.26 |
| Collision damage it caused (a PC) | 0.0 | 0.8 | 0.5 | 0.4 | 0.6 | 0.4 |

## 2. What Speed and the movement conditions are worth, by map

Each price is 400 pairs of fights with the same dice (every creature rolls its own), one with the change: 4 Standards (normal), the NPCs don't die, the first 3 rounds. **Value = the damage the party deals more + the damage it takes less** (DE; 1 AP is about 5.8 DE). For a condition: put on every Standard at the start of round 2 (they have closed in), the value for one Standard. A value under about 0.5 is inside the noise.

| Change | open | closequarters | corridor | longsight | pillars | rough |
|---|---:|---:|---:|---:|---:|---:|
| +1 Speed, both Paladins (5 → 6) | 0.10 ± 0.06 | 0.00 ± 0.00 | 0.11 ± 0.06 | 1.43 ± 0.33 | -0.10 ± 0.08 | 1.50 ± 0.28 |
| -1 Speed, both Paladins (5 → 4) | -0.03 ± 0.02 | -0.90 ± 0.35 | -0.23 ± 0.26 | 0.16 ± 0.19 | -1.00 ± 0.37 | 0.24 ± 0.19 |
| +1 Speed, both Archers (6 → 7) | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.05 ± 0.08 | 0.00 ± 0.00 | 0.02 ± 0.03 | 0.00 ± 0.00 |
| -1 Speed, both Archers (6 → 5) | 0.00 ± 0.00 | 0.00 ± 0.00 | -0.07 ± 0.13 | 0.00 ± 0.00 | 0.05 ± 0.03 | 0.00 ± 0.00 |
| -1 Speed on every Standard (5 → 4), for one | 0.71 ± 0.52 | 3.07 ± 0.62 | 2.08 ± 0.56 | 3.37 ± 0.59 | 1.73 ± 0.56 | 1.13 ± 0.46 |
| +1 Speed on every Standard (5 → 6), for one | -1.14 ± 0.49 | -0.74 ± 0.59 | -0.93 ± 0.33 | -1.25 ± 0.53 | -2.47 ± 0.57 | -1.98 ± 0.54 |
| Hindered (EoT) on a Standard | 0.63 ± 0.42 | 2.04 ± 0.37 | 0.82 ± 0.40 | 1.43 ± 0.33 | 0.77 ± 0.39 | 1.15 ± 0.35 |
| Immobilized (EoT) on a Standard | 2.73 ± 0.50 | 1.49 ± 0.56 | 0.39 ± 0.48 | 1.87 ± 0.50 | 1.48 ± 0.49 | 1.21 ± 0.51 |
| Slowed 1 on a Standard | 4.41 ± 0.42 | 4.05 ± 0.46 | 3.53 ± 0.48 | 4.43 ± 0.41 | 2.91 ± 0.47 | 3.57 ± 0.44 |
| Prone on a Standard | 4.18 ± 0.44 | 4.11 ± 0.47 | 3.41 ± 0.49 | 4.33 ± 0.42 | 2.84 ± 0.47 | 3.49 ± 0.45 |

A price is for one creature (the Speed rows: for one of the two PCs, or one of the four Standards). On the open field every Advance reaches whatever its length, so Speed is worth nothing there; a map gives it a price where the way is long (a corridor, rough ground) or the lines are blocked.

(26.5 minutes.)
