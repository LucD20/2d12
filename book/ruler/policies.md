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
| plan | 3.8 · 14% · 21% · 98% | 3.9 · 22% · 36% · 98% | 3.9 · 21% · 34% · 96% |
| hold the line | 3.7 · 9% · 15% · 100% | 3.7 · 15% · 25% · 99% | 3.6 · 16% · 25% · 99% |
| kite | 3.9 · 14% · 25% · 99% | 4.0 · 23% · 35% · 96% | 4.1 · 20% · 34% · 96% |
| protect the back line | 3.7 · 12% · 20% · 99% | 3.8 · 20% · 31% · 99% | 3.7 · 19% · 29% · 98% |
| Encounter Actions in round 2 | 3.8 · 15% · 30% · 99% | 3.9 · 22% · 36% · 97% | 3.9 · 19% · 34% · 99% |
| react to the first trigger | 3.7 · 13% · 23% · 100% | 3.8 · 23% · 42% · 97% | 3.8 · 20% · 37% · 99% |
| tactical (hold, kite, protect) | 3.9 · 12% · 22% · 99% | 3.8 · 17% · 29% · 99% | 3.8 · 14% · 24% · 100% |
| casual (no focus fire, first trigger) | 3.7 · 20% · 31% · 96% | 3.9 · 30% · 48% · 95% | 3.8 · 29% · 45% · 93% |
| *Health lost, the least to the most* | *9% to 20%* | *15% to 30%* | *14% to 29%* |

**5 Standards (CV 5, hard)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 4.9 · 29% · 46% · 89% | 5.1 · 39% · 60% · 82% | 4.9 · 38% · 58% · 83% |
| hold the line | 4.7 · 23% · 37% · 91% | 4.8 · 30% · 53% · 91% | 4.6 · 27% · 46% · 94% |
| kite | 4.9 · 31% · 52% · 87% | 5.2 · 39% · 59% · 82% | 5.1 · 38% · 60% · 84% |
| protect the back line | 4.7 · 28% · 46% · 92% | 4.9 · 35% · 55% · 86% | 4.8 · 33% · 54% · 87% |
| Encounter Actions in round 2 | 4.9 · 29% · 50% · 92% | 5.2 · 41% · 64% · 81% | 4.8 · 38% · 57% · 84% |
| react to the first trigger | 4.8 · 30% · 54% · 93% | 4.9 · 43% · 63% · 81% | 4.8 · 39% · 59% · 82% |
| tactical (hold, kite, protect) | 5.0 · 23% · 40% · 92% | 5.0 · 32% · 57% · 90% | 4.8 · 29% · 51% · 92% |
| casual (no focus fire, first trigger) | 4.7 · 40% · 60% · 82% | 4.9 · 53% · 77% · 72% | 4.8 · 53% · 74% · 73% |
| *Health lost, the least to the most* | *23% to 40%* | *30% to 53%* | *27% to 53%* |

**6 Standards (CV 6, deadly)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.9 · 48% · 73% · 71% | 5.5 · 65% · 85% · 53% | 5.3 · 60% · 82% · 58% |
| hold the line | 5.6 · 39% · 61% · 77% | 5.8 · 56% · 81% · 62% | 5.4 · 51% · 72% · 68% |
| kite | 5.9 · 50% · 69% · 66% | 5.8 · 65% · 87% · 50% | 5.7 · 65% · 84% · 52% |
| protect the back line | 5.8 · 47% · 67% · 69% | 5.7 · 59% · 82% · 59% | 5.4 · 58% · 83% · 59% |
| Encounter Actions in round 2 | 5.4 · 50% · 69% · 68% | 5.4 · 63% · 81% · 53% | 5.7 · 60% · 81% · 57% |
| react to the first trigger | 5.7 · 51% · 73% · 69% | 5.7 · 64% · 86% · 53% | 5.5 · 64% · 82% · 53% |
| tactical (hold, kite, protect) | 6.0 · 43% · 63% · 73% | 5.9 · 60% · 82% · 57% | 5.8 · 53% · 74% · 66% |
| casual (no focus fire, first trigger) | 5.5 · 64% · 82% · 52% | 5.0 · 80% · 93% · 32% | 4.8 · 81% · 94% · 32% |
| *Health lost, the least to the most* | *39% to 64%* | *56% to 80%* | *51% to 81%* |

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
| A Paladin: damage dealt | 74.89 | 87.72 | 78.21 | 85.66 | 65.70 |
| A Paladin: damage taken | 46.35 | 43.50 | 47.41 | 45.57 | 51.17 |
| A Paladin: AP spent moving | 0.96 | 0.78 | 1.04 | 0.73 | 0.67 |
| A Paladin: turns it held its place | 0.00 | 0.16 | 0.00 | 0.16 | 0.00 |
| An Archer: damage dealt | 99.79 | 101.50 | 92.41 | 97.62 | 85.58 |
| An Archer: damage taken | 36.04 | 35.43 | 38.05 | 36.66 | 39.48 |
| An Archer: turns it started Engaged | 2.05 | 2.15 | 2.13 | 2.18 | 1.90 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.29 | 1.36 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 2.66 | 2.62 | 2.04 | 1.86 | 2.53 |
| Turn AP left unspent (a PC) | 0.25 | 0.56 | 0.25 | 0.57 | 0.18 |
| Guard from them: given | 0.15 | 0.24 | 0.14 | 0.25 | 0.06 |
| ... used | 0.03 | 0.11 | 0.03 | 0.10 | 0.02 |
| Reactions used (a PC) | 3.00 | 3.55 | 3.14 | 3.58 | 2.78 |
| ... Opportunity Attacks | 0.00 | 0.06 | 0.00 | 0.07 | 0.42 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.07 | 0.00 |

**pillars**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 75.50 | 87.14 | 75.35 | 85.78 | 61.75 |
| A Paladin: damage taken | 42.86 | 39.00 | 47.22 | 41.86 | 50.58 |
| A Paladin: AP spent moving | 1.13 | 0.80 | 1.14 | 0.87 | 0.71 |
| A Paladin: turns it held its place | 0.00 | 0.15 | 0.00 | 0.18 | 0.00 |
| An Archer: damage dealt | 102.92 | 107.23 | 96.88 | 105.78 | 87.37 |
| An Archer: damage taken | 34.21 | 32.41 | 35.41 | 34.26 | 37.04 |
| An Archer: turns it started Engaged | 2.14 | 2.27 | 2.13 | 2.32 | 1.98 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.28 | 1.35 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 3.23 | 3.29 | 2.38 | 2.57 | 2.89 |
| Turn AP left unspent (a PC) | 0.25 | 0.55 | 0.25 | 0.66 | 0.16 |
| Guard from them: given | 0.12 | 0.22 | 0.14 | 0.32 | 0.06 |
| ... used | 0.03 | 0.09 | 0.03 | 0.13 | 0.01 |
| Reactions used (a PC) | 3.03 | 3.45 | 3.06 | 3.71 | 2.68 |
| ... Opportunity Attacks | 0.00 | 0.04 | 0.00 | 0.04 | 0.36 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.10 | 0.00 |

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
| plan | 3.8 · 14% · 21% · 98% | 3.9 · 22% · 36% · 98% | 3.9 · 21% · 34% · 96% |
| focus the weakest | 4.6 · 20% · 50% · 97% | 4.6 · 26% · 70% · 95% | 4.5 · 24% · 64% · 95% |
| the nearest | 3.8 · 19% · 31% · 99% | 3.9 · 33% · 51% · 91% | 3.9 · 24% · 39% · 95% |
| go for the back line | 4.1 · 15% · 34% · 100% | 4.1 · 22% · 40% · 98% | 4.0 · 18% · 35% · 98% |
| *Health lost, the least to the most* | *14% to 20%* | *22% to 33%* | *18% to 24%* |

**4 Standards (normal), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 3.9 · 12% · 22% · 99% | 3.8 · 17% · 29% · 99% | 3.8 · 14% · 24% · 100% |
| focus the weakest | 4.9 · 23% · 60% · 97% | 4.3 · 22% · 59% · 98% | 4.2 · 21% · 56% · 98% |
| the nearest | 3.7 · 12% · 16% · 99% | 3.7 · 22% · 35% · 96% | 3.7 · 14% · 22% · 99% |
| go for the back line | 4.3 · 16% · 37% · 98% | 4.1 · 19% · 43% · 99% | 3.9 · 15% · 31% · 99% |
| *Health lost, the least to the most* | *12% to 23%* | *17% to 22%* | *14% to 21%* |

**6 Standards (CV 6, deadly), the party: plan**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.9 · 48% · 73% · 71% | 5.5 · 65% · 85% · 53% | 5.3 · 60% · 82% · 58% |
| focus the weakest | 8.1 · 65% · 97% · 54% | 6.9 · 77% · 99% · 36% | 7.4 · 72% · 98% · 41% |
| the nearest | 5.1 · 57% · 72% · 59% | 4.4 · 78% · 89% · 31% | 4.4 · 79% · 88% · 30% |
| go for the back line | 6.9 · 53% · 86% · 67% | 6.4 · 64% · 96% · 54% | 6.5 · 58% · 87% · 58% |
| *Health lost, the least to the most* | *48% to 65%* | *64% to 78%* | *58% to 79%* |

**6 Standards (CV 6, deadly), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 6.0 · 43% · 63% · 73% | 5.9 · 60% · 82% · 57% | 5.8 · 53% · 74% · 66% |
| focus the weakest | 8.1 · 71% · 96% · 44% | 6.8 · 72% · 97% · 43% | 7.1 · 67% · 96% · 50% |
| the nearest | 5.2 · 46% · 61% · 69% | 4.5 · 76% · 87% · 33% | 4.7 · 76% · 87% · 36% |
| go for the back line | 7.3 · 55% · 91% · 67% | 6.7 · 63% · 93% · 56% | 6.6 · 54% · 87% · 66% |
| *Health lost, the least to the most* | *43% to 71%* | *60% to 76%* | *53% to 76%* |

(8.9 minutes.)
