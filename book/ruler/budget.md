# The Bestiary's turn budget: the calibration

Written by `node book/ruler/sim/calib.mjs`; don't edit, run it again. 1000 fights a cell, levels 1, 2 and 3 of `stage0.md` (no Momentum), the plan policy, on the open field unless a map is named.

**The unit:** points of a Medium Standard's turn (its budget is 100). **The yardstick** is today's damage-only Standard (Basic attack 25 points, 2 AP Round Special 55: exactly the Bestiary's table) with its damage scaled by d; a design that costs the party what the yardstick costs at d (the party's Health lost, with the Rally Points it spent) is **worth 100 × d**. A rider is measured added for free on both of the yardstick's Actions: what it adds, over how often it lands, is **its worth when it lands**; times how often an Action with it lands is **its worth on an Action** (the price).

## 1. The yardstick

Four of today's Standards: worth 97.2 (should be 100: the noise of the method), the party's cost 25%, a PC Down in 9%. A Basic attack is 25 points: Tier 2 / Tier 3 averages are points × 0.14 / × 0.22 (25 points: 1 + 1d4 / 2 + 1d6; 55: 4 + 1d6 / 8 + 1d8, the table's 2 AP Special exactly).

## 2. Conditions as riders (on a hit: Tier 2 or 3)

**One enemy of the four carries the rider** (on both its Actions; 2500 fights a level): the price is for a rider that one creature in the encounter has, which is how the Bestiary's ladder builds encounters. (With all four carrying the same rider, 40% of its landings were wasted on a PC that already had it, and the prices read about a third lower.) The encounter without the rider: worth 98.2.

| Group (its price) | Condition | Lands a fight | Wasted (it had it) | Worth when it lands | On an Action (measured) |
|---|---|---:|---:|---:|---:|
| mild (3) | Hindered (EoT) | 1.6 | 0.4 | 0.1 | 0.0 |
| mild (3) | Taunted | 1.6 | 0.4 | 0.2 | 0.1 |
| mild (3) | Staggered (EoT) | 1.6 | 0.4 | 3.4 | 1.8 |
| mild (3) | Frightened (EoT) | 1.6 | 0.4 | 4.0 | 2.2 |
| mild (3) | Pressure Bane (next roll) | 1.6 | 0.4 | 6.3 | 3.5 |
| mild (3) | Doomed (next roll) | 1.6 | 0.4 | 8.7 | 4.7 |
| moderate (8) | Immobilized | 1.4 | 0.8 | 14.1 | 6.2 |
| moderate (8) | Immobilized (EoT) | 1.7 | 0.4 | 12.4 | 6.7 |
| moderate (8) | Vulnerable 1 | 1.6 | 0.5 | 12.1 | 6.6 |
| moderate (8) | Slowed 1 | 1.7 | 0.5 | 14.5 | 7.8 |
| moderate (8) | Dazed 1 | 1.7 | 0.4 | 15.0 | 8.2 |
| moderate (8) | Blinded (EoT) | 1.7 | 0.4 | 15.0 | 8.2 |
| moderate (8) | Vulnerable 2 | 1.6 | 0.5 | 16.0 | 8.7 |
| severe (12) | Lingering 1 | 1.6 | 0.5 | 23.0 | 11.8 |
| severe (12) | Prone | 1.8 | 0.5 | 23.9 | 13.0 |
| extreme (18) | Lingering 2 | 1.7 | 0.5 | 33.0 | 17.0 |
| extreme (18) | Slowed 2 | 1.9 | 0.5 | 32.1 | 17.4 |
| extreme (18) | Dazed 2 | 1.9 | 0.5 | 32.0 | 17.3 |
| extreme (18) | Lingering 1d4 | 1.6 | 0.6 | 38.5 | 19.8 |
| beyond (its own) | Lingering 1d6 | 1.6 | 0.5 | 45.8 | 23.1 |
| beyond (its own) | Lingering 2d6 | 1.6 | 0.5 | 77.5 | 39.6 |

Mean measured price on an Action by group: Mild 2.1 (priced 3), Moderate 7.5 (8), Severe 12.4 (12), Extreme 17.9 (18); Lingering 1d6 23.1, Lingering 2d6 39.6. One measured price is good to about ±1.5 points.

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


(14 minutes.)
