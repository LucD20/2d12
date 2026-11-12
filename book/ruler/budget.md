# The Bestiary's turn budget: the calibration

Written by `node book/ruler/sim/calib.mjs`; don't edit, run it again. 1000 fights a cell, levels 1, 2 and 3 of `stage0.md` (no Momentum), the plan policy, on the open field unless a map is named.

**The unit:** points of a Medium Standard's turn (its budget is 100). **The yardstick** is today's damage-only Standard (Basic attack 25 points, 2 AP Round Special 55: exactly the Bestiary's table) with its damage scaled by d; a design that costs the party what the yardstick costs at d (the party's Health lost, with the Rally Points it spent) is **worth 100 × d**. A rider is measured added for free on both of the yardstick's Actions: what it adds, over how often it lands, is **its worth when it lands**; times how often an Action with it lands is **its worth on an Action** (the price).

## 1. The yardstick

Four of today's Standards: worth 97.2 (should be 100: the noise of the method), the party's cost 25%, a PC Down in 9%. A Basic attack is 25 points: Tier 2 / Tier 3 averages are points × 0.14 / × 0.22 (25 points: 1 + 1d4 / 2 + 1d6; 55: 4 + 1d6 / 8 + 1d8, the table's 2 AP Special exactly).

## 2. Conditions as riders (on a hit: Tier 2 or 3)

| Group in the Bestiary today | Condition | Lands a fight | Wasted (it had it) | Worth a turn | Worth when it lands | On an Action (the price) |
|---|---|---:|---:|---:|---:|---:|
| mild | Hindered (EoT) | 5.1 | 2.8 | -2.4 | -3.8 | -1.6 |
| mild | Pressure Bane (next roll) | 5.2 | 2.9 | -1.9 | -2.8 | -1.2 |
| mild | Taunted | 5.2 | 2.9 | 0.2 | 0.3 | 0.1 |
| mild | Bleed 2 | 5.4 | 4.1 | 20.1 | 33.6 | 13.1 |
| moderate | Staggered (EoT) | 5.2 | 3.0 | 0.9 | 1.3 | 0.6 |
| moderate | Vulnerable 1 | 5.2 | 3.0 | 0.7 | 1.1 | 0.5 |
| moderate | Immobilized (EoT) | 5.6 | 3.2 | 3.3 | 4.9 | 2.1 |
| moderate | Immobilized | 3.6 | 5.4 | 5.1 | 11.8 | 3.2 |
| moderate | Enfeebled 1 | 5.4 | 3.0 | 0.1 | 0.1 | 0.1 |
| moderate | Dazed 1 | 5.9 | 3.4 | 6.7 | 10.0 | 4.3 |
| moderate | Bleed 1d4 | 5.4 | 4.1 | 21.7 | 36.5 | 14.0 |
| moderate | Frightened (EoT) | 5.3 | 3.0 | 0.4 | 0.6 | 0.3 |
| severe | Prone | 6.0 | 3.7 | 11.8 | 17.7 | 7.7 |
| severe | Slowed 1 | 5.9 | 3.5 | 7.6 | 11.4 | 4.9 |
| severe | Vulnerable 2 | 5.2 | 3.3 | 5.9 | 9.0 | 3.9 |
| severe | Doomed (next roll) | 5.6 | 3.1 | 3.1 | 4.7 | 2.0 |
| severe | Blinded (EoT) | 5.9 | 3.4 | 6.9 | 10.5 | 4.5 |
| beyond | Slowed 2 | 7.1 | 4.2 | 23.9 | 34.6 | 14.7 |
| beyond | Dazed 2 | 7.1 | 4.3 | 24.7 | 35.8 | 15.2 |
| beyond | Bleed 2d6 | 5.4 | 4.1 | 47.5 | 80.5 | 30.8 |

Mean price on an Action by today's group: Mild 2.6, Moderate 3.1, Severe 4.6, beyond 20.3. An Action lands about 42% of the time (a hit on a PC that hasn't it yet).

## 3. Where the effect is: Setup, a hit, Tier 3 only

The worth a turn of the condition on both Actions, by where it is.

| Condition | Setup (always) | On a hit (Tier 2 or 3) | Tier 3 only | Setup ÷ hit | Tier 3 ÷ hit |
|---|---:|---:|---:|---:|---:|
| Prone | 16.2 | 11.8 | 3.4 | 1.4 | 0.3 |
| Frightened (EoT) | 1.4 | 0.4 | -1.1 | 3.4 | -2.7 |
| Vulnerable 1 | 7.9 | 0.7 | -1.8 | 10.7 | -2.5 |
| Slowed 1 | 11.1 | 7.6 | 2.3 | 1.5 | 0.3 |

Mean: Setup is 4.2 times a hit, Tier 3 only -1.1 times.

## 4. Forced movement and Collision

A Push on both Actions, measured on the open field and on maps with walls. **The GM pushes when it hurts** (into a wall or another PC: a Collision) and otherwise leaves the PC where it is; "always" pushes every hit (a melee enemy pushing its own target away). Collision today: 2 a square not moved into a wall, 1 to each creature; higher: 4 and 2. Cells: worth a turn · Collision damage a fight · pushes a fight (300 fights a cell on a map).

| Rider | Collision | open | pillars | corridor | closequarters |
|---|---|---|---|---|---|
| Push 1 | today (2 / 1) | -5.3 · 0.0 · 0.0 | 5.7 · 4.5 · 2.7 | 8.4 · 4.3 · 2.4 | 7.7 · 6.3 · 3.6 |
| Push 2 | today (2 / 1) | -5.3 · 0.0 · 0.0 | 21.1 · 14.3 · 4.6 | 24.4 · 14.8 · 4.8 | 21.2 · 17.7 · 5.6 |
| Push 3 | today (2 / 1) | -5.3 · 0.0 · 0.0 | 36.7 · 24.7 · 5.4 | 43.4 · 25.8 · 5.5 | 44.8 · 30.1 · 6.4 |
| Push 1 | higher (4 / 2) | -5.3 · 0.0 · 0.0 | 14.8 · 9.1 · 2.7 | 14.5 · 8.4 · 2.4 | 20.4 · 11.9 · 3.5 |
| Push 2 | higher (4 / 2) | -5.3 · 0.0 · 0.0 | 46.1 · 27.5 · 4.5 | 48.8 · 28.9 · 4.7 | 56.8 · 36.4 · 5.8 |
| Push 3 | higher (4 / 2) | -5.3 · 0.0 · 0.0 | 84.9 · 49.4 · 5.5 | 88.6 · 50.4 · 5.4 | 93.9 · 58.4 · 6.3 |
| Push 2, always | today (2 / 1) | -16.1 · 0.0 · 6.4 | 13.6 · 15.7 · 7.8 | 15.9 · 16.7 · 8.1 | 22.4 · 20.3 · 8.6 |

## 5. AP and Frequency: designs on the price list

Each design is priced by the list (25 points an AP; +10% for Round; +5% for 3 AP; a 2 AP Action needs no premium: it is already better than two Basic attacks, the second of which takes the At-will Bane). Its best turn (no move) against the budget (100), and its worth.

| Design | Its Actions (points) | Best turn | Worth | Normal fight: cost · a PC Down | Deadly (6): won |
|---|---|---:|---:|---|---:|
| Basic attack only | Basic 25 | 75 | 87.6 | 22% · 4% | 94% |
| Basic + 1 AP Round | Basic 25, Jab 28 | 78 | 92.5 | 24% · 5% | 91% |
| Basic + 2 AP Round (today's shape) | Basic 25, Special 55 | 105 | 97.2 | 25% · 9% | 84% |
| Basic + 1 AP Round + 2 AP Round | Basic 25, Jab 28, Special 55 | 108 | 97.2 | 25% · 9% | 84% |
| Basic + 2 AP At-will | Basic 25, Heavy 50 | 100 | 93.5 | 24% · 7% | 90% |
| Basic + 3 AP Round | Basic 25, Big 86 | 111 | 101.9 | 27% · 12% | 82% |
| Two 1 AP At-will Actions (no At-will Bane between them) | Basic 25, Other 25 | 75 | 87.6 | 22% · 4% | 94% |

### The Encounter Action: double, and its pay-back

Today's shape (Basic attack, 2 AP Round Special) with an Encounter Action at double the Round price of its AP. **Pay-back, on Standards, in points:** points off every one of the creature's other Actions (Level Up A5E's rule, "for every 2 points over the budget take 1 off the other turns", would be about 20 to 30 here). Cells: worth · a PC Down in a normal fight (the plain shape: a PC Down in about 9%).

| Encounter Action | Pay-back 0 | 20 | 40 | 60 | 80 |
|---|---|---|---|---|---|
| 1 AP, one target | 121.0 · 21% | 103.3 · 12% | 92.6 · 7% | 76.7 · 3% | 67.3 · 2% |
| 2 AP, one target | 148.8 · 40% | 133.2 · 35% | 122.7 · 31% | 108.1 · 28% | 100.0 · 26% |
| 3 AP, one target | 154.7 · 54% | 142.8 · 52% | 131.7 · 50% | 114.8 · 47% | 105.7 · 46% |
| 2 AP, an area (up to 3 PCs within 2 of the target, half each) | 119.0 · 16% | 106.4 · 9% | 98.4 · 7% | 85.6 · 4% | 78.9 · 3% |
| 3 AP, an area (the same) | 126.6 · 22% | 116.3 · 18% | 103.5 · 15% | 90.2 · 12% | 80.5 · 10% |
| 3 AP, one target, at 1.5 × the Round one (not double: for comparison) | 131.6 · 35% | 117.9 · 32% | 105.8 · 27% | 92.7 · 24% | 83.2 · 24% |

**The pay-back fitted on Elites** (the share every other Action and the Reaction lose). Cells: two Elites, cost · a PC Down / three Elites, won. An Elite with no Encounter Action: 26% · 11% / 85%.

| Encounter Action | Share 0 | 0.1 | 0.2 | 0.25 | 0.3 | 0.5 |
|---|---|---|---|---|---|---|
| 1 AP, one target | 32% · 19% / 72% | 30% · 16% / 75% | 25% · 11% / 88% | 23% · 7% / 91% | 23% · 7% / 92% | 18% · 2% / 99% |
| 2 AP, an area (up to 3 PCs within 2, half each) | 32% · 17% / 68% | 30% · 14% / 74% | 27% · 9% / 83% | 25% · 6% / 86% | 24% · 6% / 87% | 20% · 2% / 95% |
| 3 AP, an area (the same) | 40% · 28% / 59% | 37% · 25% / 62% | 34% · 22% / 70% | 32% · 20% / 73% | 32% · 19% / 76% | 28% · 17% / 87% |
| 2 AP, one target | 42% · 43% / 43% | 39% · 39% / 51% | 36% · 39% / 63% | 34% · 37% / 70% | 33% · 35% / 71% | 27% · 30% / 84% |

Chosen (config.mjs npcBudget.payBack): 1 AP 0.2, 2 AP 0.25, 3 AP 0.5.

## 6. Reactions

The yardstick with a Reaction. Its attack has a Round Action's points of its cost (1R: 28; 2R: 55, and the creature keeps 1 AP from its turn for it). **Paid:** the turn gives up 33% of the Reaction's points for one that answers its own being hit, 25% for one on an ally or a movement, nothing more for a 2R one (the AP it keeps is its price). **Free:** nothing taken from the turn.

| Reaction | Cost | Fires a fight (per creature) | In what share of its rounds | Worth, free | Worth, paid |
|---|---|---:|---:|---:|---:|
| Trigger: a PC's Strike hits it: an attack back | 1R | 0.8 | 39% | 14.4 | 1.2 |
| Trigger: a PC's Strike hits it: an attack back | 2R | 0.8 | 41% | -6.4 | -6.4 |
| Trigger: a PC's Strike hits an ally within 2: it attacks that PC (Hold the Line) | 1R | 0.2 | 12% | 4.1 | 2.3 |
| Trigger: a PC's Strike hits an ally within 2: it attacks that PC (Hold the Line) | 2R | 0.3 | 13% | -25.7 | -25.7 |
| Interrupt: a PC makes a Strike against an ally next to it: +2 Defense against it (a shield) | 1R | 0.6 | 28% | 0.1 | -3.8 |
| Interrupt: a PC would enter a square next to it: it attacks first | 1R | 0.5 | 24% | 6.8 | 2.7 |
| Interrupt: a PC would enter a square next to it: it attacks first | 2R | 0.5 | 24% | -21.2 | -21.2 |

## 7. Actions with no damage, and Actions that hit several creatures

**Helps** are measured as one creature among three of the yardstick (cells: the encounter's worth, a mean of its four creatures; the four yardsticks: 97.2).

| Design (the help added for free, on top of the yardstick's Actions) | What it did a fight | Worth of the encounter |
|---|---|---:|
| Rally (1 AP, Round): its allies within 5 gain 1 Boon on their next attack | 1.9 allies helped | 93.3 |
| Rally (1 AP, Round): 2 Boons | 1.9 allies helped | 95.3 |
| Mend (1 AP, Round): the most hurt ally heals 4 + 1d6 | 10.0 Health healed | 95.6 |

**Areas:** the yardstick's 2 AP Special as an area that hits up to 3 PCs near its target, by the share each takes.

| Area | Share each | PCs hit a use | Worth |
|---|---:|---:|---:|
| within 1 of the target | 50% | 1.1 | 70.8 |
| within 1 of the target | 67% | 1.1 | 85.0 |
| within 2 of the target | 50% | 1.5 | 82.7 |
| within 2 of the target | 67% | 1.5 | 102.4 |

## 8. Grunts and their Reaction AP

Eight of today's Grunts (3 AP: Basic attack 17 points, 1 AP Round Special 24), measured against the yardstick's four Standards (a worth of 100 is what four Standards cost): today, no Reaction: 84.7; with a 1R Trigger (hit: an attack back), free: 100.2 (it fires 0.4 times a fight a Grunt); paid as a Standard's (a third of its points off the turn): 89.9.


(16 minutes.)
