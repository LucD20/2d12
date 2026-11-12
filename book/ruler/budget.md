# The Bestiary's turn budget: the calibration

Written by `node book/ruler/sim/calib.mjs`; don't edit, run it again. 1000 fights a cell, levels 1, 2 and 3 of `stage0.md` (no Momentum), the plan policy, on the open field unless a map is named.

**The unit:** points of a Medium Standard's turn (its budget is 100). **The yardstick** is today's damage-only Standard (Basic attack 25 points, 2 AP Round Special 55: exactly the Bestiary's table) with its damage scaled by d; a design that costs the party what the yardstick costs at d (the party's Health lost, with the Rally Points it spent) is **worth 100 × d**. A rider is measured added for free on both of the yardstick's Actions: what it adds, over how often it lands, is **its worth when it lands**; times how often an Action with it lands is **its worth on an Action** (the price).

## 1. The yardstick

Four of today's Standards: worth 99.3 (should be 100: the noise of the method), the party's cost 26%, a PC Down in 9%. A Basic attack is 25 points: Tier 2 / Tier 3 averages are points × 0.14 / × 0.22 (25 points: 1 + 1d4 / 2 + 1d6; 55: 4 + 1d6 / 8 + 1d8, the table's 2 AP Special exactly).

## 2. Conditions as riders (on a hit: Tier 2 or 3)

| Group in the Bestiary today | Condition | Lands a fight | Wasted (it had it) | Worth a turn | Worth when it lands | On an Action (the price) |
|---|---|---:|---:|---:|---:|---:|
| mild | Hindered (EoT) | 5.3 | 3.0 | -1.3 | -2.1 | -0.9 |
| mild | Pressure Bane (next roll) | 5.4 | 3.0 | -1.8 | -2.8 | -1.2 |
| mild | Taunted | 5.4 | 3.0 | -1.1 | -1.6 | -0.7 |
| mild | Bleed 2 | 5.5 | 4.4 | 20.2 | 34.1 | 13.0 |
| moderate | Staggered (EoT) | 5.3 | 3.2 | 1.2 | 1.8 | 0.8 |
| moderate | Vulnerable 1 | 5.3 | 3.2 | 1.3 | 2.0 | 0.9 |
| moderate | Immobilized (EoT) | 5.8 | 3.4 | 3.7 | 5.4 | 2.3 |
| moderate | Immobilized | 3.7 | 5.6 | 6.1 | 14.2 | 3.8 |
| moderate | Enfeebled 1 | 5.4 | 3.1 | 0.0 | 0.0 | 0.0 |
| moderate | Dazed 1 | 6.2 | 3.6 | 8.6 | 12.7 | 5.5 |
| moderate | Bleed 1d4 | 5.5 | 4.4 | 20.9 | 35.3 | 13.4 |
| moderate | Frightened (EoT) | 5.4 | 3.0 | -1.2 | -1.8 | -0.8 |
| severe | Prone | 6.1 | 3.9 | 12.0 | 18.1 | 7.7 |
| severe | Slowed 1 | 6.1 | 3.6 | 8.2 | 12.4 | 5.3 |
| severe | Vulnerable 2 | 5.3 | 3.5 | 5.5 | 8.3 | 3.6 |
| severe | Doomed (next roll) | 5.7 | 3.2 | 2.1 | 3.1 | 1.4 |
| severe | Blinded (EoT) | 6.0 | 3.6 | 6.2 | 9.3 | 4.0 |
| beyond | Slowed 2 | 7.3 | 4.5 | 24.0 | 34.7 | 14.7 |
| beyond | Dazed 2 | 7.3 | 4.4 | 22.2 | 32.2 | 13.6 |
| beyond | Bleed 2d6 | 5.6 | 4.3 | 48.3 | 81.2 | 31.0 |

Mean price on an Action by today's group: Mild 2.5, Moderate 3.3, Severe 4.4, beyond 19.8. An Action lands about 42% of the time (a hit on a PC that hasn't it yet).

## 3. Where the effect is: Setup, a hit, Tier 3 only

The worth a turn of the condition on both Actions, by where it is.

| Condition | Setup (always) | On a hit (Tier 2 or 3) | Tier 3 only | Setup ÷ hit | Tier 3 ÷ hit |
|---|---:|---:|---:|---:|---:|
| Prone | 16.0 | 12.0 | 4.5 | 1.3 | 0.4 |
| Frightened (EoT) | 1.6 | -1.2 | -1.0 | -1.3 | 0.9 |
| Vulnerable 1 | 8.0 | 1.3 | -0.4 | 6.2 | -0.3 |
| Slowed 1 | 10.5 | 8.2 | 2.9 | 1.3 | 0.4 |

Mean: Setup is 1.9 times a hit, Tier 3 only 0.3 times.

## 4. Forced movement and Collision

A Push on both Actions, measured on the open field and on maps with walls. **The GM pushes when it hurts** (into a wall or another PC: a Collision) and otherwise leaves the PC where it is; "always" pushes every hit (a melee enemy pushing its own target away). Collision today: 2 a square not moved into a wall, 1 to each creature; higher: 4 and 2. Cells: worth a turn · Collision damage a fight · pushes a fight (300 fights a cell on a map).

| Rider | Collision | open | pillars | corridor | closequarters |
|---|---|---|---|---|---|
| Push 1 | today (2 / 1) | -0.5 · 0.0 · 0.0 | 5.8 · 4.7 · 2.7 | 4.2 · 4.2 · 2.4 | 9.1 · 6.2 · 3.6 |
| Push 2 | today (2 / 1) | -0.5 · 0.0 · 0.0 | 22.3 · 14.5 · 4.7 | 20.6 · 15.2 · 4.8 | 26.3 · 18.1 · 5.8 |
| Push 3 | today (2 / 1) | -0.5 · 0.0 · 0.0 | 43.2 · 26.3 · 5.7 | 39.5 · 25.6 · 5.5 | 46.7 · 30.7 · 6.6 |
| Push 1 | higher (4 / 2) | -0.5 · 0.0 · 0.0 | 16.5 · 9.7 · 2.8 | 13.8 · 8.6 · 2.4 | 25.8 · 13.0 · 3.7 |
| Push 2 | higher (4 / 2) | -0.5 · 0.0 · 0.0 | 52.7 · 29.8 · 4.8 | 48.9 · 29.9 · 4.8 | 60.8 · 36.4 · 5.8 |
| Push 3 | higher (4 / 2) | -0.5 · 0.0 · 0.0 | 91.5 · 52.1 · 5.7 | 85.4 · 50.4 · 5.5 | 105.7 · 61.2 · 6.6 |
| Push 2, always | today (2 / 1) | -15.7 · 0.0 · 6.6 | 14.7 · 16.3 · 8.0 | 16.2 · 17.0 · 8.3 | 18.6 · 19.8 · 8.5 |

## 5. AP and Frequency: designs on the price list

Each design is priced by the list (25 points an AP; +10% for Round; +5% for 3 AP; a 2 AP Action needs no premium: it is already better than two Basic attacks, the second of which takes the At-will Bane). Its best turn (no move) against the budget (100), and its worth.

| Design | Its Actions (points) | Best turn | Worth | Normal fight: cost · a PC Down | Deadly (6): won |
|---|---|---:|---:|---|---:|
| Basic attack only | Basic 25 | 75 | 82.6 | 20% · 2% | 98% |
| Basic + 1 AP Round | Basic 25, Jab 28 | 78 | 90.3 | 22% · 3% | 95% |
| Basic + 2 AP Round (today's shape) | Basic 25, Special 55 | 105 | 99.3 | 26% · 9% | 85% |
| Basic + 1 AP Round + 2 AP Round | Basic 25, Jab 28, Special 55 | 108 | 101.6 | 26% · 10% | 84% |
| Basic + 2 AP At-will | Basic 25, Heavy 50 | 100 | 94.9 | 24% · 7% | 88% |
| Basic + 3 AP Round | Basic 25, Big 86 | 111 | 103.0 | 27% · 12% | 83% |
| Two 1 AP At-will Actions (no At-will Bane between them) | Basic 25, Other 25 | 75 | 82.6 | 20% · 2% | 98% |

### The Encounter Action: double, and its pay-back

Today's shape (Basic attack, 2 AP Round Special) with an Encounter Action at double the Round price of its AP. **Pay-back, on Standards, in points:** points off every one of the creature's other Actions (Level Up A5E's rule, "for every 2 points over the budget take 1 off the other turns", would be about 20 to 30 here). Cells: worth · a PC Down in a normal fight (the plain shape: a PC Down in about 9%).

| Encounter Action | Pay-back 0 | 20 | 40 | 60 | 80 |
|---|---|---|---|---|---|
| 1 AP, one target | 119.9 · 19% | 103.3 · 11% | 90.8 · 5% | 77.5 · 2% | 69.3 · 2% |
| 2 AP, one target | 149.0 · 40% | 133.3 · 34% | 122.3 · 30% | 109.4 · 27% | 101.0 · 24% |
| 3 AP, one target | 160.2 · 55% | 145.6 · 53% | 135.3 · 52% | 120.0 · 50% | 108.8 · 47% |
| 2 AP, an area (up to 3 PCs within 2 of the target, half each) | 119.8 · 14% | 107.8 · 9% | 99.6 · 6% | 87.0 · 4% | 80.2 · 3% |
| 3 AP, an area (the same) | 128.3 · 21% | 115.6 · 17% | 105.5 · 15% | 92.0 · 12% | 84.1 · 12% |
| 3 AP, one target, at 1.5 × the Round one (not double: for comparison) | 135.1 · 37% | 119.3 · 31% | 107.6 · 28% | 95.1 · 27% | 88.2 · 25% |

**The pay-back fitted on Elites** (the share every other Action and the Reaction lose). Cells: two Elites, cost · a PC Down / three Elites, won. An Elite with no Encounter Action: 26% · 9% / 86%.

| Encounter Action | Share 0 | 0.1 | 0.2 | 0.25 | 0.3 | 0.5 |
|---|---|---|---|---|---|---|
| 1 AP, one target | 32% · 20% / 73% | 29% · 16% / 78% | 24% · 8% / 89% | 22% · 6% / 91% | 22% · 6% / 92% | 18% · 4% / 99% |
| 2 AP, an area (up to 3 PCs within 2, half each) | 32% · 16% / 68% | 29% · 11% / 75% | 26% · 8% / 83% | 24% · 5% / 87% | 24% · 5% / 87% | 19% · 1% / 96% |
| 3 AP, an area (the same) | 40% · 27% / 56% | 37% · 24% / 60% | 35% · 21% / 70% | 33% · 20% / 74% | 32% · 20% / 74% | 27% · 15% / 88% |
| 2 AP, one target | 43% · 46% / 42% | 42% · 44% / 52% | 35% · 34% / 63% | 34% · 33% / 68% | 33% · 34% / 69% | 27% · 30% / 86% |

Chosen (config.mjs npcBudget.payBack): 1 AP 0.2, 2 AP 0.25, 3 AP 0.5.

## 6. Reactions

The yardstick with a Reaction. Its attack has a Round Action's points of its cost (1R: 28; 2R: 55, and the creature keeps 1 AP from its turn for it). **Paid:** the turn gives up 33% of the Reaction's points for one that answers its own being hit, 25% for one on an ally or a movement, nothing more for a 2R one (the AP it keeps is its price). **Free:** nothing taken from the turn.

| Reaction | Cost | Fires a fight (per creature) | In what share of its rounds | Worth, free | Worth, paid |
|---|---|---:|---:|---:|---:|
| Trigger: a PC's Strike hits it: an attack back | 1R | 0.8 | 40% | 14.5 | 1.6 |
| Trigger: a PC's Strike hits it: an attack back | 2R | 0.8 | 41% | -6.9 | -6.9 |
| Trigger: a PC's Strike hits an ally within 2: it attacks that PC (Hold the Line) | 1R | 0.2 | 12% | 4.0 | 0.6 |
| Trigger: a PC's Strike hits an ally within 2: it attacks that PC (Hold the Line) | 2R | 0.3 | 13% | -25.3 | -25.3 |
| Interrupt: a PC makes a Strike against an ally next to it: +2 Defense against it (a shield) | 1R | 0.6 | 28% | -0.7 | -4.1 |
| Interrupt: a PC would enter a square next to it: it attacks first | 1R | 0.5 | 23% | 7.7 | 2.5 |
| Interrupt: a PC would enter a square next to it: it attacks first | 2R | 0.5 | 24% | -21.4 | -21.4 |

## 7. Actions with no damage, and Actions that hit several creatures

**Helps** are measured as one creature among three of the yardstick (cells: the encounter's worth, a mean of its four creatures; the four yardsticks: 99.3).

| Design (the help added for free, on top of the yardstick's Actions) | What it did a fight | Worth of the encounter |
|---|---|---:|
| Rally (1 AP, Round): its allies within 5 gain 1 Boon on their next attack | 2.0 allies helped | 93.7 |
| Rally (1 AP, Round): 2 Boons | 2.0 allies helped | 94.8 |
| Mend (1 AP, Round): the most hurt ally heals 4 + 1d6 | 10.2 Health healed | 94.5 |

**Areas:** the yardstick's 2 AP Special as an area that hits up to 3 PCs near its target, by the share each takes.

| Area | Share each | PCs hit a use | Worth |
|---|---:|---:|---:|
| within 1 of the target | 50% | 1.1 | 71.9 |
| within 1 of the target | 67% | 1.1 | 84.6 |
| within 2 of the target | 50% | 1.5 | 82.8 |
| within 2 of the target | 67% | 1.5 | 102.8 |

## 8. Grunts and their Reaction AP

Eight of today's Grunts (3 AP: Basic attack 17 points, 1 AP Round Special 24), measured against the yardstick's four Standards (a worth of 100 is what four Standards cost): today, no Reaction: 87.2; with a 1R Trigger (hit: an attack back), free: 102.8 (it fires 0.4 times a fight a Grunt); paid as a Standard's (a third of its points off the turn): 92.2.


(18 minutes.)
