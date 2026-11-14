# The PC budget

Written by `node book/ruler/sim/pcbudget.mjs`; don't edit, run it again. 2500 fights a level (levels 1, 2 and 3, no Momentum), the plan policy, the open field, against four Standards with effects (`stage0.md` section 9) unless a column says two Elites. **A guide for writing class cards, not a rule of the book.**

**The unit:** points of a PC's turn. **The yardstick is a plain PC:** its class's Health, armor, weapon and Modifiers, no Feature, no Passive, no Reaction, and a turn of **three Weapon Attacks = 100 points** (a Weapon Attack is 25; the fourth AP moves it or becomes Guard). It sits in one seat of the usual party (the melee seat: the Smite Paladin's; the ranged seat: the Double Shot Archer's); the other three PCs are the Stage 0 builds. **The scale is what the fights cost the party** (its Health lost with the Rally Points it spent): a PC in that seat that deals no damage is 0 points, the plain PC 100, and anything else sits on that line. So a point is worth the same whether it comes from damage dealt, damage prevented or Health given back. One worth is good to about ±3 points.

## 1. The yardstick: what damage and Health are worth

| Seat | A Weapon Attack (Tier 2 / Tier 3 average) | The party's cost with a PC that deals no damage → the plain PC | So 100 points are | The plain PC deals a fight |
|---|---|---|---|---|
| melee (a Paladin's Greatsword) | 11.0 / 15.0 | 39% → 28% | 13.1 Health saved a fight | 71 damage |
| ranged (an Archer's Crossbow) | 7.0 / 9.0 | 37% → 31% | 8.0 Health saved a fight | 39 damage |

**How much damage is a point of Health worth?** The melee seat, by the size of the fight: what the plain PC's whole offense saves the party, and three other things on the same scale (the plain PC with +40% damage; with a 1 AP heal of 1d8 + [Mod] in the place of its third attack; with Shield of Faith).

| Fight | The plain PC's damage saves (Health · the party wins) | 1 Health saved = this much damage dealt | +40% damage | The 1 AP heal | Shield of Faith |
|---|---|---:|---:|---:|---:|
| 4 Standards (normal) | 13.1 Health · won 99% → 100% | 5.4 | 127 points · won 100% | 144 points · won 100% | 166 points · won 100% |
| 5 Standards (hard) | 24.7 Health · won 85% → 97% | 3.4 | 131 points · won 98% | 133 points · won 97% | 164 points · won 99% |
| 6 Standards (deadly) | 28.8 Health · won 41% → 72% | 3.1 | 139 points · won 81% | 128 points · won 75% | 174 points · won 85% |

### What a class is worth today

The Stage 0 builds in the same seats (the R builds cut to the Stage 0 lists, `stage0lib.mjs`): **what a class's Features, Hallmarks, Passives and Reaction add to the plain turn.**

| Build | Seat | Level 1 | Level 2 | Level 3 |
|---|---|---:|---:|---:|
| Paladin (Smite) | melee | 115 | 126 | 118 |
| Paladin (Lay On Hands) | melee | 126 | 161 | 163 |
| Archer (Double Shot) | ranged | 174 | 163 | 168 |
| Archer (Rolling Shot) | ranged | 194 | 182 | 200 |

## 2. AP and Frequency: the same points in different shapes

The plain PC with one Action of flat damage in the place of Weapon Attacks (its points: 25 = a Weapon Attack's average on each Tier). The turn's points are what it uses; its worth is what the fights give.

| The turn | Points used | Worth, melee | Worth, ranged |
|---|---:|---:|---:|
| three Weapon Attacks (the yardstick) | 75 | 100.0 | 100.0 |
| a 2 AP Action of 50 and a Weapon Attack | 75 | 107.3 | 106.0 |
| a 3 AP Action of 75 | 75 | 100.9 | 100.0 |
| a 2 AP Action of 50 and two Weapon Attacks (4 AP) | 100 | 109.2 | 117.8 |
| a 2 AP Action of 60 and a Weapon Attack | 85 | 117.0 | 114.9 |
| once an encounter, a 2 AP Action of 100 (double) and a Weapon Attack; else the yardstick | 125 (that turn) | 133.4 | 130.2 |
| once an encounter, a 3 AP Action of 150 (double); else the yardstick | 150 (that turn) | 121.7 | 139.9 |

## 3. Riders a PC puts on an enemy (on a hit: Tier 2 or 3)

The plain PC's Weapon Attacks carry the rider for free. **On an Action** is what the rider adds to one Weapon Attack that carries it (what it adds to the turn, over the attacks of the turn): its price. Against four Standards, and against two Elites (a creature that lives longer and whose turn is bigger).

| Rider | Melee seat, 4 Standards | Ranged seat, 4 Standards | Melee seat, 2 Elites | Lands a fight (melee, Standards) |
|---|---:|---:|---:|---:|
| Hindered (EoT) | -2.3 | 1.7 | -1.1 | 5.6 |
| Frightened (EoT) | 2.1 | 4.0 | 6.2 | 5.7 |
| Taunted (by you) | 0.9 | 2.8 | 3.2 | 0.0 |
| Immobilized (EoT) | -3.6 | 3.4 | -3.5 | 5.5 |
| Immobilized (until it escapes) | -0.1 | 1.8 | 1.5 | 5.6 |
| Blinded (EoT) | 11.6 | 14.6 | 26.0 | 5.8 |
| Vulnerable 1 | 2.5 | 0.7 | 3.6 | 0.0 |
| Vulnerable 2 | 5.0 | 5.5 | 5.3 | 0.0 |
| Slowed 1 | 7.0 | 9.8 | 11.7 | 5.6 |
| Dazed 1 | 11.3 | 15.4 | 19.9 | 5.6 |
| Prone | 7.0 | 8.7 | 11.4 | 5.8 |
| Lingering 1d4 | 0.1 | 1.2 | 0.5 | 5.6 |
| Lingering 1d6 | 0.3 | 2.2 | 1.8 | 5.6 |
| Slowed 2 | 12.9 | 19.8 | 25.6 | 5.6 |

The plain PC makes 2.5 attacks a turn in the melee seat and 2.9 in the ranged one (it moves, and the fight ends).

## 4. Reactions

The plain PC with one of the classes' Reactions (1R, its Reaction AP), for free.

| Reaction | Seat | Fires in what share of its rounds | Worth it adds a turn |
|---|---|---:|---:|
| Shield of Faith (a hit on you or an ally within 5: block 2d6 + [Mod]) | melee | 82% | 65.7 |
| Rebuke (an enemy within 5 Strikes an ally: an Appeal Save, damage, Pushed, Frightened) | melee | 66% | 13.7 |
| Overwatch (an enemy moves closer within 10: a Weapon Attack) | ranged | 85% | 10.1 |
| Covering Shot (a Strike would damage an ally within 10: a Weapon Attack with 1 Boon; a Tier 3 halves the damage) | ranged | 111% | 16.2 |

## 5. Helps: 1 AP that isn't an attack

The plain PC in the melee seat gives up its third Weapon Attack (25 points) for a 1 AP help each turn. **Worth of the AP** = 25 + what the turn gained or lost.

| The 1 AP | Worth of the AP |
|---|---:|
| the most hurt ally (or you) heals 1d8 + [Mod] (new Health, not a Rally Point) | 69.1 |
| the most hurt ally (or you) heals 2d6 + [Mod] | 84.5 |
| an ally uses 1 of its Rally Points (Lay On Hands' heal) | -10.9 |
| you gain Guard 1d8 + [Mod] | 34.7 |
| an ally gains +1 Defense until your next turn | 12.3 |
| nothing (the AP is not used: its Guard at the next turn) | 12.4 |

## 6. The classes' Actions in points (level 3 lists, Defense 13, no Passive)

Each Action's **damage points**: its average damage on one creature over its own Weapon Attack's, × 25 (a Weapon Attack: 25). What else it does is listed, not priced: price it with sections 3 to 5.

| Build | Action | AP | Frequency | Damage points | Points an AP | And |
|---|---|---:|---|---:|---:|---|
| Paladin (Smite) | Smite 2 | 2 | round | 45 | 22.5 |  |
| Paladin (Smite) | Smite 3 | 3 | round | 50 | 16.7 | guard |
| Paladin (Smite) | Holy Wrath 2 | 2 | encounter | 50 | 25.1 |  |
| Paladin (Smite) | Holy Wrath 3 | 3 | encounter | 63 | 20.9 |  |
| Paladin (Smite) | Final Verdict | 2 | encounter | 50 | 25.1 | area, area 1.5 |
| Paladin (Lay On Hands) | Lay On Hands 1 | 1 | round | 0 | 0.0 | heal |
| Paladin (Lay On Hands) | Lay On Hands 2 | 2 | round | 0 | 0.0 | heal, mend |
| Paladin (Lay On Hands) | Holy Wrath 2 | 2 | encounter | 54 | 26.9 |  |
| Paladin (Lay On Hands) | Hallowed Dawn | 3 | encounter | 0 | 0.0 | mend, push, remove-effect |
| Archer (Double Shot) | Double Shot 2 | 2 | round | 50 | 25.0 | 2 linked |
| Archer (Double Shot) | Double Shot 3 | 3 | round | 50 | 16.7 | evade, 2 linked |
| Archer (Double Shot) | Pinning Shot | 1 | encounter | 25 | 25.0 | Immobilized (EoT) |
| Archer (Double Shot) | Deathmark | 2 | encounter | 65 | 32.6 |  |
| Archer (Double Shot) | Lock & Loose | 1 | round | 25 | 24.6 | Hindered (until it moves), Immobilized |
| Archer (Rolling Shot) | Rolling Shot 2 | 2 | round | 36 | 18.2 | evade, 1 linked |
| Archer (Rolling Shot) | Rolling Shot 3 | 3 | round | 48 | 15.9 | evade, 1 linked |
| Archer (Rolling Shot) | Pinning Shot | 1 | encounter | 25 | 25.0 | Immobilized (EoT) |
| Archer (Rolling Shot) | Open Season | 2 | encounter | 25 | 12.5 | vulnerable, 1 linked |
| Archer (Rolling Shot) | Lock & Loose | 1 | round | 25 | 24.6 | Hindered (until it moves), Immobilized |
## 7. Each Passive and Feature on its own

The plain PC with one Passive or Feature of its class, at the Escalation the Stage 0 lists give it (2, 4 or 6). **What it adds to the turn**, in a fight that starts at Escalation 1 (Momentum 0) and at Escalation 3 (Momentum 2): a Passive at Escalation 6 is seldom reached without Momentum. Levels 1 to 3 (the plain PC is the same at each).

| Passive or Feature | Seat | At Escalation | Adds, Momentum 0 | Adds, Momentum 2 |
|---|---|---:|---:|---:|
| Radiant Zeal | melee | 2 | 3.2 | 7.0 |
| Searing Blows | melee | 4 | -0.3 | 4.2 |
| Reckoning | melee | 6 | 0.0 | -0.0 |
| Font of Mercy | melee | 2 | 0.3 | -0.1 |
| Mending Light | melee | 4 | 8.5 | 36.5 |
| Hallowed Stance | melee | 6 | -0.6 | 2.9 |
| Sharpshooter | ranged | always | 3.6 | 14.3 |
| Marked Quarry | ranged | always | 25.8 | 38.9 |
| Killer's Focus | ranged | 2 | 8.6 | 34.0 |
| Hunter's Edge | ranged | 4 | -4.6 | 9.7 |
| Finisher | ranged | 6 | 1.2 | 12.0 |

## 8. Areas

The plain PC with a 2 AP Round area Action and a Weapon Attack (the area placed on the grid where it catches the most enemies). **Each creature in it takes the listed points** (50 = the 2 AP price in full; 33 = two thirds; 25 = half). Against 4 Standards and against 6.

| Area | Seat | Points to each | Creatures hit a use: 4 · 6 Standards | Worth: 4 Standards | Worth: 6 Standards |
|---|---|---:|---|---:|---:|
| 2 Burst within 10 squares | ranged | 50 | 1.6 · 2.1 | 161.5 | 222.3 |
| 2 Burst within 10 squares | ranged | 33 | 1.6 · 2.2 | 122.7 | 160.5 |
| 2 Burst within 10 squares | ranged | 25 | 1.6 · 2.1 | 106.3 | 130.7 |
| 1 Emanation around you | melee | 50 | 1.3 · 1.6 | 132.6 | 155.7 |
| 1 Emanation around you | melee | 33 | 1.3 · 1.6 | 106.0 | 117.4 |
| 1 Emanation around you | melee | 25 | 1.3 · 1.6 | 87.4 | 96.9 |
| 2 Emanation around you | melee | 50 | 1.7 · 2.1 | 140.2 | 169.1 |
| 2 Emanation around you | melee | 33 | 1.7 · 2.2 | 112.3 | 126.3 |
| 2 Emanation around you | melee | 25 | 1.7 · 2.2 | 91.0 | 103.4 |

The same turn with the 2 AP Action on one creature at 50: section 2 (106 to 107).

## 9. On maps with walls

Two maps beside the open field (600 fights a level on a map: good to about ±0.6 Health). **In Health saved a fight**, not points: on a map the plain ranged PC is worth little (cover, blocked lines), so its line from 0 to 100 is too short to measure on. The first rows are against the PC that deals no damage; the others are what the thing adds to the plain PC.

| Health saved a fight | Seat | open | pillars | corridor |
|---|---|---:|---:|---:|
| The plain PC's three Weapon Attacks (its 100 points) | melee | 13.1 | 16.0 | 18.1 |
| The plain PC's three Weapon Attacks (its 100 points) | ranged | 8.0 | 9.8 | 6.8 |
| Paladin (Smite), level 2 | melee | 14.7 | 18.1 | 19.4 |
| Paladin (Lay On Hands), level 2 | melee | 18.8 | 22.1 | 24.1 |
| Archer (Double Shot), level 2 | ranged | 12.7 | 16.6 | 11.8 |
| Archer (Rolling Shot), level 2 | ranged | 14.2 | 17.0 | 13.7 |
| + Push 1 on its Weapon Attacks | melee | -2.4 | -0.8 | -2.0 |
| + Push 1 on its Weapon Attacks | ranged | 0.1 | 0.3 | 1.0 |
| + Push 2 on its Weapon Attacks | melee | -2.3 | -0.5 | -1.2 |
| + Push 2 on its Weapon Attacks | ranged | 0.5 | 0.8 | 0.2 |
| + Hindered (EoT) on its Weapon Attacks | melee | -0.8 | -0.9 | -0.2 |
| + Hindered (EoT) on its Weapon Attacks | ranged | 0.4 | 0.2 | 1.3 |
| + Immobilized (EoT) on its Weapon Attacks | melee | -1.2 | -1.0 | -2.1 |
| + Immobilized (EoT) on its Weapon Attacks | ranged | 0.8 | 0.7 | 1.2 |
| + Prone on its Weapon Attacks | melee | 2.3 | 3.4 | 3.5 |
| + Prone on its Weapon Attacks | ranged | 2.1 | 2.2 | 3.8 |
| + Slowed 1 on its Weapon Attacks | melee | 2.3 | 3.0 | 2.6 |
| + Slowed 1 on its Weapon Attacks | ranged | 2.3 | 2.0 | 4.0 |
| + Shield of Faith | melee | 8.6 | 11.1 | 10.4 |
| + Rebuke | melee | 1.8 | 1.7 | 2.4 |
| + Overwatch | ranged | 0.8 | 1.4 | 1.2 |
| + Covering Shot | ranged | 1.3 | 2.9 | 0.9 |
| A 1 AP heal of 1d8 + [Mod] in the place of the third attack | melee | 5.8 | 7.8 | 7.0 |


(52 minutes.)
