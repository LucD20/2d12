# The decisions: every headline number under several policies (SIM-3)

Written by `node book/ruler/sim/policies.mjs`; don't edit, run it again. The policies are `book/ruler/sim/policy.mjs`.

Runs: 300 fights a cell; two cells differ for real when they are more than about 5 points apart. Each cell: rounds · the party's Health lost · a PC goes Down · the party wins. The party: fights.txt's four R builds, level 1.

**The party's policies** (each is the plan policy with one decision changed, then two mixes):

| Policy | What it decides differently |
|---|---|
| plan | The ruler's decisions so far: focus the enemy closest to dying; the melee PCs walk to the nearest enemy; an Archer moves only when its turn says so; the Encounter Action in round 1; the Reaction AP kept for the class Reaction |
| hold the line | A melee PC doesn't walk to an enemy it can't reach with one Advance while melee enemies are still coming (rounds 1 and 2): it keeps its place and its AP (Guard at its next turn) |
| kite | An Archer that starts its turn Engaged steps away first (1 AP), then takes what is left of its turn |
| protect the back line | A melee PC walks to the enemy nearest to an Archer (within 3 squares of one), not to the one nearest to itself |
| Encounter Actions in round 2 | The round 1 turn with an Encounter Action waits for round 2 (Escalation 2) |
| react to the first trigger | Every Reaction on its first trigger, the Opportunity Attack too |
| tactical | hold + kite + protect |
| casual | No focus fire (each PC hits the enemy nearest to it), every Reaction on its first trigger |

## 1. The party's decisions

**4 Standards (normal)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 3.8 · 14% · 21% · 98% | 3.8 · 15% · 25% · 98% | 3.8 · 16% · 25% · 98% |
| hold the line | 3.7 · 9% · 15% · 100% | 3.7 · 14% · 23% · 99% | 3.7 · 12% · 19% · 99% |
| kite | 3.9 · 14% · 25% · 99% | 4.1 · 20% · 35% · 97% | 4.0 · 19% · 31% · 97% |
| protect the back line | 3.7 · 12% · 20% · 99% | 4.0 · 18% · 35% · 98% | 3.9 · 18% · 32% · 98% |
| Encounter Actions in round 2 | 3.8 · 15% · 30% · 99% | 3.8 · 17% · 32% · 99% | 3.8 · 16% · 27% · 98% |
| react to the first trigger | 3.7 · 13% · 23% · 100% | 3.9 · 22% · 40% · 98% | 3.9 · 20% · 36% · 97% |
| tactical (hold, kite, protect) | 3.9 · 12% · 22% · 99% | 3.9 · 13% · 21% · 99% | 3.8 · 12% · 20% · 99% |
| casual (no focus fire, first trigger) | 3.7 · 20% · 31% · 96% | 3.9 · 25% · 45% · 95% | 3.9 · 27% · 46% · 95% |
| *Health lost, the least to the most* | *9% to 20%* | *13% to 25%* | *12% to 27%* |

**5 Standards (CV 5, hard)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 4.9 · 29% · 46% · 89% | 5.0 · 35% · 56% · 85% | 4.8 · 33% · 50% · 85% |
| hold the line | 4.7 · 23% · 37% · 91% | 4.8 · 26% · 43% · 92% | 4.8 · 26% · 41% · 92% |
| kite | 4.9 · 31% · 52% · 87% | 5.2 · 38% · 58% · 80% | 5.0 · 36% · 54% · 81% |
| protect the back line | 4.7 · 28% · 46% · 92% | 4.9 · 35% · 57% · 82% | 4.9 · 32% · 51% · 85% |
| Encounter Actions in round 2 | 4.9 · 29% · 50% · 92% | 5.2 · 34% · 55% · 84% | 5.0 · 32% · 54% · 89% |
| react to the first trigger | 4.8 · 30% · 54% · 93% | 5.0 · 42% · 65% · 78% | 4.9 · 38% · 56% · 78% |
| tactical (hold, kite, protect) | 5.0 · 23% · 40% · 92% | 5.1 · 30% · 48% · 86% | 5.0 · 26% · 45% · 92% |
| casual (no focus fire, first trigger) | 4.7 · 40% · 60% · 82% | 5.1 · 53% · 71% · 70% | 4.9 · 47% · 65% · 74% |
| *Health lost, the least to the most* | *23% to 40%* | *26% to 53%* | *26% to 47%* |

**6 Standards (CV 6, deadly)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.9 · 48% · 73% · 71% | 5.9 · 59% · 80% · 56% | 5.6 · 54% · 75% · 62% |
| hold the line | 5.6 · 39% · 61% · 77% | 5.9 · 51% · 74% · 66% | 5.7 · 47% · 68% · 70% |
| kite | 5.9 · 50% · 69% · 66% | 5.8 · 60% · 80% · 55% | 5.7 · 56% · 76% · 60% |
| protect the back line | 5.8 · 47% · 67% · 69% | 5.9 · 57% · 80% · 58% | 5.6 · 58% · 78% · 56% |
| Encounter Actions in round 2 | 5.4 · 50% · 69% · 68% | 5.6 · 56% · 78% · 59% | 5.7 · 53% · 73% · 64% |
| react to the first trigger | 5.7 · 51% · 73% · 69% | 5.6 · 60% · 79% · 57% | 5.4 · 59% · 78% · 56% |
| tactical (hold, kite, protect) | 6.0 · 43% · 63% · 73% | 6.0 · 54% · 74% · 63% | 6.0 · 51% · 74% · 67% |
| casual (no focus fire, first trigger) | 5.5 · 64% · 82% · 52% | 5.1 · 79% · 91% · 33% | 5.2 · 75% · 89% · 38% |
| *Health lost, the least to the most* | *39% to 64%* | *51% to 79%* | *47% to 75%* |

## 2. What the party does under each policy (6 Standards (CV 6, deadly); per PC, a fight)

**open**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 72.45 | 81.05 | 73.01 | 78.51 | 61.67 |
| A Paladin: damage taken | 43.15 | 37.09 | 42.83 | 39.95 | 49.07 |
| A Paladin: AP spent moving | 1.43 | 1.17 | 1.33 | 1.20 | 0.88 |
| A Paladin: turns it held its place | 0.00 | 0.13 | 0.00 | 0.20 | 0.00 |
| An Archer: damage dealt | 122.72 | 123.34 | 116.57 | 121.75 | 115.26 |
| An Archer: damage taken | 34.23 | 31.84 | 33.76 | 33.30 | 34.16 |
| An Archer: turns it started Engaged | 2.04 | 2.06 | 2.08 | 2.27 | 1.94 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 2.00 | 2.20 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 1.90 | 2.09 | 0.80 | 0.89 | 1.51 |
| Turn AP left unspent (a PC) | 0.45 | 0.71 | 0.52 | 0.89 | 0.41 |
| Guard from them: given | 0.25 | 0.47 | 0.33 | 0.62 | 0.23 |
| ... used | 0.04 | 0.20 | 0.05 | 0.27 | 0.05 |
| Reactions used (a PC) | 3.38 | 3.60 | 3.41 | 3.85 | 3.07 |
| ... Opportunity Attacks | 0.00 | 0.03 | 0.00 | 0.04 | 0.32 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.05 | 0.00 |

**corridor**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 75.58 | 77.17 | 74.70 | 81.41 | 60.09 |
| A Paladin: damage taken | 46.61 | 43.36 | 46.10 | 45.43 | 52.84 |
| A Paladin: AP spent moving | 1.16 | 0.80 | 1.01 | 0.86 | 0.72 |
| A Paladin: turns it held its place | 0.00 | 0.11 | 0.00 | 0.13 | 0.00 |
| An Archer: damage dealt | 102.97 | 114.74 | 100.80 | 106.33 | 88.56 |
| An Archer: damage taken | 38.92 | 36.23 | 38.97 | 38.99 | 40.74 |
| An Archer: turns it started Engaged | 2.15 | 2.38 | 2.27 | 2.34 | 1.97 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.32 | 1.40 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 2.88 | 2.69 | 2.13 | 2.23 | 2.67 |
| Turn AP left unspent (a PC) | 0.27 | 0.51 | 0.28 | 0.57 | 0.18 |
| Guard from them: given | 0.15 | 0.22 | 0.17 | 0.29 | 0.05 |
| ... used | 0.03 | 0.08 | 0.04 | 0.11 | 0.01 |
| Reactions used (a PC) | 3.23 | 3.54 | 3.25 | 3.75 | 2.90 |
| ... Opportunity Attacks | 0.00 | 0.05 | 0.00 | 0.05 | 0.45 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.10 | 0.00 |

**pillars**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 75.37 | 79.49 | 74.52 | 82.20 | 62.42 |
| A Paladin: damage taken | 43.26 | 41.39 | 44.25 | 43.79 | 50.91 |
| A Paladin: AP spent moving | 1.15 | 0.83 | 1.16 | 0.91 | 0.74 |
| A Paladin: turns it held its place | 0.00 | 0.14 | 0.00 | 0.13 | 0.00 |
| An Archer: damage dealt | 111.29 | 115.19 | 104.81 | 111.06 | 93.52 |
| An Archer: damage taken | 34.98 | 33.39 | 36.48 | 36.12 | 39.12 |
| An Archer: turns it started Engaged | 2.29 | 2.38 | 2.31 | 2.48 | 2.15 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.34 | 1.41 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 3.40 | 3.40 | 2.56 | 2.85 | 3.15 |
| Turn AP left unspent (a PC) | 0.28 | 0.58 | 0.28 | 0.57 | 0.17 |
| Guard from them: given | 0.16 | 0.28 | 0.15 | 0.28 | 0.07 |
| ... used | 0.02 | 0.10 | 0.02 | 0.11 | 0.02 |
| Reactions used (a PC) | 3.23 | 3.66 | 3.29 | 3.76 | 2.92 |
| ... Opportunity Attacks | 0.00 | 0.04 | 0.00 | 0.03 | 0.43 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.09 | 0.00 |

## 3. The enemies' decisions (the party on the plan policy, and on the tactical one)

| Enemy policy | What it decides |
|---|---|
| plan | The PC it can strike most after moving, a hurt PC a little more |
| focus the weakest | Every NPC on the PC with the least Health left |
| the nearest | The nearest PC, whoever it is |
| go for the back line | The Archers first |

**4 Standards (normal), the party: plan**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 3.8 · 14% · 21% · 98% | 3.8 · 15% · 25% · 98% | 3.8 · 16% · 25% · 98% |
| focus the weakest | 4.6 · 20% · 50% · 97% | 5.0 · 27% · 74% · 96% | 4.8 · 23% · 63% · 97% |
| the nearest | 3.8 · 19% · 31% · 99% | 4.1 · 32% · 48% · 92% | 4.0 · 27% · 41% · 89% |
| go for the back line | 4.1 · 15% · 34% · 100% | 4.1 · 18% · 38% · 99% | 4.0 · 16% · 33% · 98% |
| *Health lost, the least to the most* | *14% to 20%* | *15% to 32%* | *16% to 27%* |

**4 Standards (normal), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 3.9 · 12% · 22% · 99% | 3.9 · 13% · 21% · 99% | 3.8 · 12% · 20% · 99% |
| focus the weakest | 4.9 · 23% · 60% · 97% | 4.9 · 26% · 67% · 95% | 4.6 · 23% · 59% · 97% |
| the nearest | 3.7 · 12% · 16% · 99% | 3.8 · 22% · 35% · 96% | 3.9 · 16% · 28% · 99% |
| go for the back line | 4.3 · 16% · 37% · 98% | 4.1 · 15% · 34% · 98% | 4.1 · 14% · 30% · 98% |
| *Health lost, the least to the most* | *12% to 23%* | *13% to 26%* | *12% to 23%* |

**6 Standards (CV 6, deadly), the party: plan**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.9 · 48% · 73% · 71% | 5.9 · 59% · 80% · 56% | 5.6 · 54% · 75% · 62% |
| focus the weakest | 8.1 · 65% · 97% · 54% | 7.3 · 78% · 99% · 35% | 7.6 · 77% · 98% · 36% |
| the nearest | 5.1 · 57% · 72% · 59% | 4.3 · 82% · 92% · 25% | 4.5 · 76% · 87% · 34% |
| go for the back line | 6.9 · 53% · 86% · 67% | 6.7 · 60% · 88% · 59% | 6.5 · 57% · 86% · 62% |
| *Health lost, the least to the most* | *48% to 65%* | *59% to 82%* | *54% to 77%* |

**6 Standards (CV 6, deadly), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 6.0 · 43% · 63% · 73% | 6.0 · 54% · 74% · 63% | 6.0 · 51% · 74% · 67% |
| focus the weakest | 8.1 · 71% · 96% · 44% | 7.2 · 76% · 98% · 38% | 7.1 · 74% · 97% · 40% |
| the nearest | 5.2 · 46% · 61% · 69% | 4.7 · 77% · 88% · 32% | 4.7 · 71% · 84% · 40% |
| go for the back line | 7.3 · 55% · 91% · 67% | 6.7 · 58% · 89% · 62% | 6.8 · 57% · 84% · 62% |
| *Health lost, the least to the most* | *43% to 71%* | *54% to 77%* | *51% to 74%* |

(10.9 minutes.)
