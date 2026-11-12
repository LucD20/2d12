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
| plan | 3.7 · 14% · 23% · 99% | 3.7 · 21% · 31% · 98% | 3.6 · 18% · 29% · 99% |
| hold the line | 3.6 · 11% · 18% · 99% | 3.5 · 17% · 26% · 98% | 3.5 · 16% · 21% · 98% |
| kite | 3.8 · 13% · 21% · 99% | 3.8 · 21% · 34% · 99% | 3.9 · 21% · 37% · 98% |
| protect the back line | 3.6 · 15% · 27% · 99% | 3.6 · 20% · 34% · 99% | 3.7 · 21% · 31% · 98% |
| Encounter Actions in round 2 | 3.6 · 14% · 23% · 100% | 3.8 · 22% · 39% · 98% | 3.6 · 19% · 30% · 98% |
| react to the first trigger | 3.6 · 14% · 22% · 99% | 3.7 · 25% · 41% · 98% | 3.6 · 20% · 28% · 98% |
| tactical (hold, kite, protect) | 3.8 · 11% · 16% · 99% | 3.7 · 17% · 31% · 98% | 3.5 · 14% · 20% · 99% |
| casual (no focus fire, first trigger) | 3.6 · 21% · 35% · 99% | 3.8 · 32% · 50% · 95% | 3.8 · 29% · 45% · 97% |
| size the hit to the target | 3.6 · 15% · 24% · 99% | 3.7 · 19% · 30% · 99% | 3.7 · 19% · 30% · 99% |
| the Minions left for last | 3.7 · 14% · 23% · 99% | 3.7 · 21% · 31% · 98% | 3.6 · 18% · 29% · 99% |
| *Health lost, the least to the most* | *11% to 21%* | *17% to 32%* | *14% to 29%* |

**5 Standards (CV 5, hard)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 4.6 · 24% · 38% · 92% | 4.9 · 36% · 57% · 87% | 4.7 · 37% · 56% · 87% |
| hold the line | 4.5 · 20% · 38% · 95% | 4.6 · 28% · 48% · 93% | 4.5 · 25% · 42% · 95% |
| kite | 5.0 · 31% · 55% · 87% | 5.1 · 41% · 67% · 81% | 4.9 · 36% · 58% · 85% |
| protect the back line | 4.7 · 26% · 45% · 92% | 4.8 · 37% · 63% · 86% | 4.7 · 33% · 54% · 89% |
| Encounter Actions in round 2 | 4.7 · 27% · 46% · 92% | 4.8 · 36% · 58% · 85% | 4.7 · 35% · 57% · 89% |
| react to the first trigger | 4.7 · 32% · 52% · 89% | 4.8 · 38% · 63% · 87% | 4.7 · 37% · 59% · 86% |
| tactical (hold, kite, protect) | 4.8 · 24% · 42% · 93% | 4.8 · 30% · 53% · 93% | 4.7 · 29% · 48% · 91% |
| casual (no focus fire, first trigger) | 4.6 · 41% · 64% · 83% | 4.9 · 52% · 73% · 73% | 4.7 · 50% · 70% · 74% |
| size the hit to the target | 4.7 · 27% · 47% · 92% | 4.7 · 35% · 58% · 87% | 4.7 · 33% · 53% · 89% |
| the Minions left for last | 4.6 · 24% · 38% · 92% | 4.9 · 36% · 57% · 87% | 4.7 · 37% · 56% · 87% |
| *Health lost, the least to the most* | *20% to 41%* | *28% to 52%* | *25% to 50%* |

**6 Standards (CV 6, deadly)**

| Party policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.5 · 41% · 63% · 77% | 5.6 · 61% · 85% · 58% | 5.4 · 58% · 79% · 60% |
| hold the line | 5.6 · 37% · 61% · 85% | 5.5 · 53% · 76% · 65% | 5.4 · 48% · 69% · 71% |
| kite | 5.9 · 49% · 73% · 68% | 5.7 · 66% · 87% · 50% | 5.6 · 56% · 79% · 62% |
| protect the back line | 5.9 · 50% · 75% · 71% | 5.6 · 60% · 83% · 59% | 5.3 · 57% · 76% · 61% |
| Encounter Actions in round 2 | 5.7 · 47% · 70% · 72% | 5.6 · 61% · 83% · 59% | 5.6 · 58% · 80% · 61% |
| react to the first trigger | 5.4 · 49% · 73% · 72% | 5.4 · 62% · 87% · 57% | 5.3 · 58% · 82% · 63% |
| tactical (hold, kite, protect) | 5.8 · 44% · 63% · 75% | 5.7 · 55% · 81% · 66% | 5.5 · 55% · 78% · 65% |
| casual (no focus fire, first trigger) | 5.4 · 62% · 79% · 57% | 4.7 · 80% · 95% · 32% | 4.8 · 75% · 91% · 41% |
| size the hit to the target | 5.7 · 42% · 65% · 77% | 5.3 · 60% · 80% · 56% | 5.5 · 60% · 78% · 58% |
| the Minions left for last | 5.5 · 41% · 63% · 77% | 5.6 · 61% · 85% · 58% | 5.4 · 58% · 79% · 60% |
| *Health lost, the least to the most* | *37% to 62%* | *53% to 80%* | *48% to 75%* |

## 2. What the party does under each policy (6 Standards (CV 6, deadly); per PC, a fight)

**open**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 69.95 | 78.05 | 68.31 | 75.37 | 61.08 |
| A Paladin: damage taken | 39.60 | 35.98 | 42.27 | 40.49 | 48.73 |
| A Paladin: AP spent moving | 1.33 | 1.11 | 1.45 | 1.09 | 0.80 |
| A Paladin: turns it held its place | 0.00 | 0.14 | 0.00 | 0.14 | 0.00 |
| An Archer: damage dealt | 121.45 | 119.46 | 114.88 | 114.69 | 111.37 |
| An Archer: damage taken | 29.59 | 30.69 | 34.82 | 32.37 | 34.60 |
| An Archer: turns it started Engaged | 1.86 | 2.01 | 2.27 | 2.11 | 1.99 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 2.21 | 2.04 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 1.86 | 1.84 | 0.73 | 0.79 | 1.57 |
| Turn AP left unspent (a PC) | 0.51 | 0.72 | 0.44 | 0.76 | 0.38 |
| Guard from them: given | 0.31 | 0.45 | 0.32 | 0.46 | 0.18 |
| ... used | 0.04 | 0.17 | 0.07 | 0.17 | 0.02 |
| Reactions used (a PC) | 3.21 | 3.53 | 3.27 | 3.64 | 3.04 |
| ... Opportunity Attacks | 0.00 | 0.04 | 0.00 | 0.03 | 0.31 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.06 | 0.00 |

**corridor**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 73.03 | 80.33 | 72.85 | 81.24 | 61.31 |
| A Paladin: damage taken | 43.75 | 40.61 | 45.53 | 42.00 | 48.40 |
| A Paladin: AP spent moving | 1.09 | 0.73 | 1.01 | 0.79 | 0.65 |
| A Paladin: turns it held its place | 0.00 | 0.16 | 0.00 | 0.16 | 0.00 |
| An Archer: damage dealt | 99.20 | 100.45 | 89.75 | 97.66 | 81.03 |
| An Archer: damage taken | 35.17 | 34.33 | 37.98 | 35.28 | 38.17 |
| An Archer: turns it started Engaged | 2.08 | 2.14 | 2.08 | 2.16 | 1.82 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.27 | 1.33 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 2.81 | 2.58 | 1.76 | 1.75 | 2.31 |
| Turn AP left unspent (a PC) | 0.24 | 0.56 | 0.22 | 0.62 | 0.16 |
| Guard from them: given | 0.12 | 0.21 | 0.13 | 0.29 | 0.05 |
| ... used | 0.02 | 0.08 | 0.03 | 0.13 | 0.02 |
| Reactions used (a PC) | 3.05 | 3.39 | 2.98 | 3.51 | 2.58 |
| ... Opportunity Attacks | 0.00 | 0.06 | 0.00 | 0.07 | 0.40 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.07 | 0.00 |

**pillars**

| | plan | hold the line | kite | tactical (hold, kite, protect) | casual (no focus fire, first trigger) |
|---|---:|---:|---:|---:|---:|
| A Paladin: damage dealt | 72.39 | 80.58 | 76.09 | 81.60 | 66.03 |
| A Paladin: damage taken | 42.90 | 38.24 | 43.67 | 41.44 | 48.18 |
| A Paladin: AP spent moving | 1.02 | 0.80 | 1.12 | 0.84 | 0.76 |
| A Paladin: turns it held its place | 0.00 | 0.14 | 0.00 | 0.10 | 0.00 |
| An Archer: damage dealt | 100.22 | 106.20 | 99.81 | 97.23 | 90.11 |
| An Archer: damage taken | 33.12 | 31.84 | 33.92 | 33.52 | 36.75 |
| An Archer: turns it started Engaged | 2.17 | 2.27 | 2.25 | 2.23 | 2.06 |
| An Archer: steps away (kite) | 0.00 | 0.00 | 1.27 | 1.24 | 0.00 |
| An Archer: shots while Engaged (2 Banes) | 3.21 | 3.39 | 2.58 | 2.37 | 3.00 |
| Turn AP left unspent (a PC) | 0.22 | 0.53 | 0.26 | 0.42 | 0.18 |
| Guard from them: given | 0.12 | 0.23 | 0.16 | 0.20 | 0.07 |
| ... used | 0.02 | 0.09 | 0.03 | 0.06 | 0.02 |
| Reactions used (a PC) | 2.97 | 3.41 | 3.16 | 3.30 | 2.77 |
| ... Opportunity Attacks | 0.00 | 0.04 | 0.00 | 0.02 | 0.40 |
| Opportunity Attacks taken (a PC) | 0.00 | 0.00 | 0.00 | 0.08 | 0.00 |

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
| plan | 3.7 · 14% · 23% · 99% | 3.7 · 21% · 31% · 98% | 3.6 · 18% · 29% · 99% |
| focus the weakest | 4.3 · 17% · 48% · 99% | 4.1 · 23% · 61% · 97% | 4.2 · 23% · 59% · 98% |
| the nearest | 3.7 · 19% · 33% · 100% | 3.9 · 33% · 49% · 93% | 3.7 · 25% · 40% · 95% |
| go for the back line | 3.9 · 15% · 33% · 99% | 3.9 · 21% · 40% · 98% | 3.8 · 19% · 36% · 98% |
| *Health lost, the least to the most* | *14% to 19%* | *21% to 33%* | *18% to 25%* |

**4 Standards (normal), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 3.8 · 11% · 16% · 99% | 3.7 · 17% · 31% · 98% | 3.5 · 14% · 20% · 99% |
| focus the weakest | 4.7 · 23% · 56% · 97% | 4.1 · 22% · 58% · 97% | 4.0 · 22% · 59% · 98% |
| the nearest | 3.5 · 9% · 12% · 99% | 3.6 · 21% · 35% · 98% | 3.5 · 14% · 21% · 100% |
| go for the back line | 4.3 · 16% · 34% · 99% | 4.1 · 19% · 40% · 99% | 3.7 · 14% · 30% · 100% |
| *Health lost, the least to the most* | *9% to 23%* | *17% to 22%* | *14% to 22%* |

**6 Standards (CV 6, deadly), the party: plan**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.5 · 41% · 63% · 77% | 5.6 · 61% · 85% · 58% | 5.4 · 58% · 79% · 60% |
| focus the weakest | 7.6 · 63% · 96% · 58% | 6.8 · 74% · 99% · 41% | 7.4 · 64% · 97% · 54% |
| the nearest | 5.0 · 51% · 66% · 65% | 4.2 · 84% · 93% · 25% | 4.5 · 80% · 91% · 33% |
| go for the back line | 6.6 · 46% · 77% · 74% | 6.3 · 60% · 92% · 61% | 6.2 · 56% · 88% · 65% |
| *Health lost, the least to the most* | *41% to 63%* | *60% to 84%* | *56% to 80%* |

**6 Standards (CV 6, deadly), the party: tactical (hold, kite, protect)**

| Enemy policy | open | corridor | pillars |
|---|---|---|---|
| plan | 5.8 · 44% · 63% · 75% | 5.7 · 55% · 81% · 66% | 5.5 · 55% · 78% · 65% |
| focus the weakest | 7.8 · 67% · 94% · 51% | 6.8 · 70% · 98% · 48% | 6.7 · 67% · 95% · 50% |
| the nearest | 5.0 · 46% · 65% · 69% | 4.7 · 74% · 87% · 38% | 4.7 · 71% · 83% · 41% |
| go for the back line | 7.1 · 51% · 84% · 69% | 6.5 · 61% · 93% · 60% | 6.4 · 53% · 87% · 70% |
| *Health lost, the least to the most* | *44% to 67%* | *55% to 74%* | *53% to 71%* |

(10.4 minutes.)
