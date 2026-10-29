# The price list of the core rules (pack E1; positions: pack E2)

Written by `node book/ruler/econ.mjs` from the class catalogues (`book/ruler/catalogue/*.txt`) and the system's dice math. Don't edit this file: edit those and run it again.

Everything is priced in **damage-equivalents (DE)**: average damage against the level's Medium Standard (AD and WD 13, Saves +1, Body +2), with Weapon and Power Modifier +2 (no Attribute growth in levels 1 to 3 yet).

## 1. The exchange rate

| | Level 1 | Level 2 | Level 3 | Where it comes from |
|---|---:|---:|---:|---|
| A baseline PC's damage a turn (Defense 13) | 23.30 | 26.56 | 26.56 | the Bestiary's PC baseline (config pcDamageVsDefense, x the level's measured growth) |
| **1 AP** (the baseline turn / 5) | 4.66 | 5.31 | 5.31 | the price of one Action Point |
| A Paladin Weapon Attack (Greatsword) | 5.36 | 5.36 | 5.36 | exact |
| An Archer Weapon Attack (Crossbow) | 5.50 | 5.50 | 5.50 | exact |
| A Standard's turn against AD 13 | 7.93 | 8.62 | 9.55 | exact: 2 Strikes, the 2nd with 1 Bane; what a PC takes a round in a normal fight (CV 1 per PC) |
| The baseline PC's Health Pool | 31.50 | 34.00 | 36.50 | frozen (pack P1): the average of the Paladin and the Archer as they were before P1 (a Human Paladin and a Human Archer) |
| A Rally Point (Health it heals) | 8.00 | 9.00 | 10.00 | ceil(Pool / 4) of that baseline Pool |
| 1 Health healed | 1.10 | 1.10 | 1.10 | Lucas: a little more than 1 damage |
| A Down prevented or undone | 34.95 | 39.84 | 39.84 | 1.5 baseline turns (the turns it would lose), plus the Health |

**Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so spending turns it off. **Momentum** (Lucas, 2026-10-29): +1 after each fight harder than easy; with Momentum you start a fight with half your level in Escalation (rounded up), up to 2; a Rest resets it. In the Standard day (easy, normal, normal, hard) of fights.txt (level 1 party, simulated; 3.9 rounds a fight, 50% of the fights start with Momentum):

| | Escalation 1 or more | 2 or more | 3 or more |
|---|---:|---:|---:|
| Share of the rounds, nothing spent, with Momentum | 87% | 62% | 37% |
| The same without Momentum | 74% | 49% | 24% |
| Uses a fight of an Active that costs it (spent as soon as possible) | 3.41 | 1.50 | 0.76 |
| The same without Momentum | 2.91 | 1.29 | 0.51 |

An Active and a passive compete: a level 1 PC who spends 1 Escalation every round never reaches 2, so its Escalation 2 passive stays off. In the same day an ally goes Down in 33% of the fights and on 91% of the days; a Paladin uses Lay On Hands on 43% of its turns.

## 2. The price list (level 1; DE, and as a share of what it modifies)

| Effect | DE | Share | Notes |
|---|---:|---:|---|
| +1 Boon on a Weapon Attack (Paladin / Archer) | 0.50 | 9% | +1 Modifier and -1 target Defense are the same |
| +2 Boons | 0.98 | 18% |  |
| +1 Bane | -0.55 | -10% |  |
| Favored | 1.95 | 35% | about 3.7 Boons |
| Empowered 1 on a Greatsword / Crossbow Weapon Attack | 0.99 | 18% / 13% | Crossbow 0.72: +1 a die that lands, so more dice = more value |
| Vulnerable 1 (until the target's turn ends) | 1.23 | - | 2.5 party attacks reach it |
| +1 Defense for 1 round on one ally | 0.87 | 11% | of what it would take that round; +2: 1.74 |
| 1 Bane on one enemy's Strikes for its turn | 0.87 | 11% | the same as +1 Defense for everyone it attacks |
| A Rally Point used in a fight | 8.80 | - | Steel Yourself pays 2 AP for it: 4.40 DE per AP |
| A Down prevented or undone | 34.95 | - |  |

**Frequency bands** (DE per AP, divided by the price of 1 AP): At-will 0.9 to 1.1, Round and Turn 1 to 1.3, Encounter 1.4 to 2, Daily 2 to 3. An At-will Action takes a Bane on each use after the first, so its first use can sit at the top. A **0 AP** Action is priced per use as a share of a baseline turn. Verdict: **under** or **over** when more than 10% outside its band; **+ ?** when part of its value is still not modeled (NPC Saves, hazardous areas), so the verdict isn't final. Movement, Evade, Forced Movement, Cover, range, Hindered, Immobilized, Prone and ending an effect are priced by positions (pack E2, section 5).

## 3. The role budgets (every build of `classes/`)

Shares of the baseline PC: damage against the Bestiary's baseline turn of the level (23.3 / 26.6 / 26.6 at levels 1 / 2 / 3), and in brackets against the charter's growth curve (+10% a level: 23.3 / 25.6 / 28.0; pack E3 refits the Bestiary to it). Health against the baseline Pool (31.5 / 34.0 / 36.5).

**Sustained (best)**: the best turn with no Encounter or Daily Action and no Escalation (a Reload Shot turn and heal turns left out). **Nova**: the best turn with an Encounter or Daily Action, at the Escalation it spends or the Escalation Momentum starts a fight with (1 / 1 / 2), whichever is more. **Sustained (real)**: the damage a turn in the simulated Standard day on the turns without an Encounter or Daily Action (openings, Steel Yourself turns and Escalation as the plan spends it, Momentum on); **this is the column the sustained budget is checked on**. **All turns**: the same with the Nova turns in (a once-a-fight Nova is about a third of a PC's turns: fights last about 3 rounds). The real columns use the map model (pack E2: positions, movement, Banes from range, cover and shooting into melee, Flanking); **No positions** is the sustained real damage in the old fight with no map, to compare.

| Build | Sustained (best) | Nova | Sustained (real) | No positions | All turns (real) | Health | Budget: sustained / Nova / Health | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Archer L1 `archer-1` | 24.7 (106%) | 19.2 (82%) | 22.4 (96%) | 28.1 (121%) | 20.8 (89%) | 27 (86%) | 100%-105% / 110%-130% / 80%-85% | sustained low; Nova low; Health ok (86%) |
| Archer L2 `archer-2` | 26.8 (101%; 105%) | 19.2 (72%; 75%) | 24.3 (92%; 95%) | 30.0 (113%; 117%) | 22.4 (84%; 87%) | 29 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained low; Nova low; Health ok (85%) |
| Archer L3 `archer-3` | 26.8 (101%; 96%) | 22.0 (83%; 79%) | 24.3 (91%; 87%) | 30.5 (115%; 109%) | 22.7 (85%; 81%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained low; Nova low; Health ok (85%) |
| Paladin (book) L1 `paladin-book-1` | 24.5 (105%) | 24.3 (104%) | 25.3 (108%) | 25.3 (109%) | 26.1 (112%) | 36 (114%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova low; Health low (114%) |
| Paladin (Lay On Hands) L1 `paladin-hands-1` | 20.7 (89%) | 36.5 (157%) | 18.5 (79%) | 20.1 (86%) | 22.1 (95%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (124%) |
| Paladin (Lay On Hands) L2 `paladin-hands-2` | 20.7 (78%; 81%) | 36.5 (137%; 142%) | 18.7 (70%; 73%) | 20.2 (76%; 79%) | 22.1 (83%; 86%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova low; Health ok (126%) |
| Paladin (Lay On Hands) L3 `paladin-hands-3` | 20.7 (78%; 74%) | 40.2 (151%; 144%) | 19.9 (75%; 71%) | 21.3 (80%; 76%) | 22.9 (86%; 82%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova low; Health ok (126%) |
| Paladin (Smite, hold) L1 `paladin-smite-1-hold` | 21.1 (91%) | 38.8 (166%) | 19.0 (82%) | 20.1 (86%) | 24.1 (103%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (124%) |
| Paladin (Smite) L1 `paladin-smite-1` | 21.1 (91%) | 38.8 (166%) | 18.9 (81%) | 20.2 (87%) | 24.0 (103%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (124%) |
| Paladin (Smite) L2 `paladin-smite-2` | 21.1 (80%; 83%) | 38.8 (146%; 151%) | 19.0 (71%; 74%) | 20.1 (76%; 78%) | 23.9 (90%; 93%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (126%) |
| Paladin (Smite) L3 `paladin-smite-3` | 21.1 (80%; 76%) | 42.3 (159%; 151%) | 21.1 (79%; 75%) | 22.3 (84%; 80%) | 25.8 (97%; 92%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (126%) |

Roles: Paladin: tank and support: more Health, heals and Defense for allies, Nova damage. Archer: mobile, fragile, constant ranged damage (a future melee class has the top damage: about 1.15). The verdict at level 2 and 3 uses the charter's curve (the Bestiary's level 3 baseline doesn't grow yet).

## 4. Paladin (P1): every Action of `catalogue/paladin-p1.txt` (level 1; efficiency also at levels 2 and 3)

**The P1 main build (pack P1, 2026-10-29; in the book since 2026-10-29)**: the defaults of every level 1 to 3 Pick, then the options in the Paladin document (Shield of Faith, Bulwark of Faith, Aura of Protection, Font of Mercy).

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.01 | 1.01 | a little over |  |
| Steel Yourself 2 | 2 | round |  | 0.0 | 8.8 | 8.8 | 4.40 | 0.94 | 0.93 | 1.04 | a little under | uses the target's own Rally Points |
| Smite 1 | 1 | round |  | 7.4 | 0.0 | 7.4 | 7.44 | 1.60 | 1.40 | 1.40 | **over** |  |
| Smite 2 | 2 | round |  | 11.2 | 0.6 | 11.9 | 5.93 | 1.27 | 1.12 | 1.13 | on target |  |
| Smite 3 | 3 | round |  | 11.2 | 2.2 | 13.4 | 4.47 | 0.96 | 0.85 | 0.85 | a little under | Guard: only what a later hit uses (30%) |
| Lay On Hands 1 | 1 | round |  | 0.0 | 8.8 | 8.8 | 8.80 | 1.89 | 1.86 | 2.07 | **over** | uses the target's own Rally Points |
| Lay On Hands 2 | 2 | round |  | 0.0 | 15.3 | 15.3 | 7.65 | 1.64 | 1.54 | 1.65 | **over** | uses the target's own Rally Points |
| Lay On Hands 3 | 3 | round |  | 0.0 | 24.1 | 24.1 | 8.03 | 1.72 | 1.65 | 1.79 | **over** | uses the target's own Rally Points |
| Holy Wrath 2 | 2 | encounter |  | 18.3 | 0.0 | 18.3 | 9.13 | 1.96 | 1.72 | 1.72 | on target |  |
| Holy Wrath 3 | 3 | encounter |  | 27.8 | 0.0 | 27.8 | 9.26 | 1.99 | 1.74 | 1.74 | on target |  |
| Consecrated Ground 2 | 2 | daily |  | 0.0 | 21.7 | 21.7 | 10.85 | 2.33 | 2.08 | 2.14 | on target |  |
| Consecrated Ground 3 | 3 | daily |  | 0.0 | 45.2 | 45.2 | 15.08 | 3.24 | 2.89 | 2.97 | a little over |  |
| Divine Surge | 0 | round | 1 | 0.0 | 6.4 | 6.4 | - | 27% of a turn | 24% | 24% | **over** (0 AP: >25% of a turn) | an ally's damage (90% that one hits the target in time); Guard: only what a later hit uses (30%); costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 5.5 DE a turn |
| Shield of Faith (R) | 1 | turn |  | 0.0 | 5.2 | 5.2 | 5.22 | 1.12 | 0.98 | 0.98 | on target | damage an ally doesn't take (one hit); Reaction: needs AP kept after your turn |
| Bulwark of Faith 1 (R) | 1 | encounter |  | 0.0 | 5.9 | 5.9 | 5.94 | 1.27 | 1.21 | 1.34 | a little under | damage an ally doesn't take (one hit); Reaction: needs AP kept after your turn |
| Bulwark of Faith 2 (R) | 2 | encounter |  | 0.0 | 6.9 | 6.9 | 3.47 | 0.74 | 0.71 | 0.78 | **under** | damage an ally doesn't take (one hit); Slid 2: 1.00 (positions); Reaction: needs AP kept after your turn |
| Aura of Protection | 0 | encounter | 1 | 0.0 | 5.4 | 5.4 | - | 23% of a turn | 22% | 24% | on target (0 AP) | costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 4.7 DE a turn |

**Paladin (P1) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Font of Mercy | 1 | 0.4 | 0.4 | 2% | +4 on every Rally Point the party uses in a fight (Escalation is 0 between fights): 0.10 a Paladin turn in the Standard day (a Lay On Hands party uses more: 0.62, 2.7 DE) |
| Hallowed Stance | 2 | 7.2 | 4.5 | 19% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Radiant Zeal | 1 | 2.5 | 2.2 | 9% | the first qualifying hit each round |
| Heavy Blows |  | 2.4 | 2.4 | 10% | +1 on each damaging hit of the typical turn's matching Actions |

## 4. Archer: every Action of `catalogue/archer.txt` (level 1; efficiency also at levels 2 and 3)

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | a little over |  |
| Steel Yourself 2 | 2 | round |  | 0.0 | 8.8 | 8.8 | 4.40 | 0.94 | 0.93 | 1.04 | a little under | uses the target's own Rally Points |
| Reload | 1 | at-will |  | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | a cost (of a Reload Shot) |  |
| Double Shot 2 | 2 | round |  | 11.0 | 0.0 | 11.0 | 5.50 | 1.18 | 1.03 | 1.03 | on target |  |
| Double Shot 3 | 3 | round |  | 12.0 | 0.0 | 12.0 | 4.01 | 0.86 | 0.75 | 0.75 | **under** |  |
| Precise Aim 1 | 1 | round |  | 0.0 | 0.5 | 0.5 | 0.52 | 0.11 | 0.10 | 0.10 | **under** |  |
| Precise Aim 2 | 2 | round |  | 0.0 | 1.0 | 1.0 | 0.50 | 0.11 | 0.09 | 0.09 | **under** |  |
| Lock & Loose | 1 | round |  | 5.5 | 0.7 | 6.2 | 6.24 | 1.34 | 1.19 | 1.19 | a little over | Hindered (until it moves): 0.69 (positions); Immobilized: 1.52 (positions) |
| Quick Draw (R) | 1 | turn |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | on target | Reaction: needs AP kept after your turn |
| Rolling Shot 1 | 1 | round |  | 5.5 | 2.2 | 7.7 | 7.69 | 1.65 | 1.51 | 1.51 | **over** | Evade 1: saves the step away (1 AP) on the 47% of the turns it starts Engaged |
| Rolling Shot 2 | 2 | round |  | 6.0 | 2.2 | 8.2 | 4.10 | 0.88 | 0.80 | 0.80 | **under** | Evade 3: saves the step away (1 AP) on the 47% of the turns it starts Engaged |
| Wing Clip | 1 | round |  | 7.6 | 0.4 | 8.0 | 7.96 | 1.71 | 1.51 | 1.51 | **over** | Hindered: 1.46 (positions) |
| True Shot | 1 | round |  | 0.0 | 0.3 | 0.3 | 0.33 | 0.07 | 0.06 | 0.06 | **under** | ignores Cover: 0.58 Banes on an average shot |
| Suppressing Fire | 1 | round |  | 0.0 | 0.3 | 0.3 | 0.34 | 0.07 | 0.07 | 0.08 | **under** |  |
| Volley | 3 | encounter |  | 12.3 | 1.0 | 13.3 | 4.44 | 0.95 | 0.84 | 0.84 | **under** | Hindered: 1.46 (positions) |
| Marksman's Shot | 2 | encounter |  | 5.5 | 0.8 | 6.3 | 3.17 | 0.68 | 0.60 | 0.60 | **under** |  |
| Covering Fire | 2 | encounter |  | 0.0 | 2.6 | 2.6 | 1.30 | 0.28 | 0.26 | 0.29 | **under** + ? | not modeled: enemies entering take 1d4 |
| Rain of Arrows | 3 | daily |  | 11.4 | 0.0 | 11.4 | 3.81 | 0.82 | 0.72 | 0.72 | **under** + ? | not modeled: the area lasts 2 rounds (hazardous terrain) |
| Hunter's Focus | 1 | daily |  | 0.0 | 13.1 | 13.1 | 13.14 | 2.82 | 2.47 | 2.47 | on target |  |
| Deadeye | 3 | daily |  | 12.4 | 0.3 | 12.7 | 4.25 | 0.91 | 0.80 | 0.80 | **under** | Prone: 1.20 (positions) |
| Steady Aim | 0 | round | 1 | 0.0 | 0.7 | 0.7 | - | 3% of a turn | 3% | 3% | under (0 AP: <8% of a turn) | range: 0.26 range Banes on an average shot; costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 0.6 DE a turn |
| Vanish | 1 | round | 1 | 0.0 | 2.2 | 2.2 | 2.20 | 0.47 | 0.47 | 0.47 | **under** + ? | not modeled: the first Strike against you takes 1 Bane; Evade 3: saves the step away (1 AP) on the 47% of the turns it starts Engaged; costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 1.9 DE a turn |
| Pinning Shot | 1 | round | 2 | 5.5 | 4.7 | 10.2 | 10.20 | 2.19 | 2.04 | 2.04 | **over** | Immobilized (EoT): 4.70 (positions); costs 2 Escalation: 1.50 uses a fight (1.29 without Momentum), 3.9 DE a turn |
| Twin Shot | 1 | round | 3 | 16.0 | 0.0 | 16.0 | 16.05 | 3.44 | 3.02 | 3.02 | **over** | costs 3 Escalation: 0.76 uses a fight (0.51 without Momentum), 3.1 DE a turn |
| Perfect Shot | 0 | round | 3 | 0.0 | 3.8 | 3.8 | - | 16% of a turn | 14% | 14% | on target (0 AP) | ignores Cover: 0.58 Banes on an average shot; costs 3 Escalation: 0.76 uses a fight (0.51 without Momentum), 0.7 DE a turn |

**Archer passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Marked Quarry |  | 1.8 | 1.8 | 8% | the typical turn's Shot Strikes against the quarry, +1 Boon each |
| Killer's Focus | 2 | 2.5 | 1.6 | 7% | the first qualifying hit each round |
| Patient Hunter | 2 | 1.3 | 0.8 | 3% | the typical turn's Shots, on the 70% of the Archer's turns it hasn't left its square since its last one (positions): against the Archer's role (mobile) |
| Long Draw |  | 0.5 | 0.5 | 2% | 1 range Bane off (0.26 a shot on average: positions) |
| Steady Nerves | 2 | 0.1 | 0.0 | 0% | 2 Banes off the 2% of the shots made while Engaged (the Archer kites: positions); an Archer that doesn't kite: section 5 |

## 4. Paladin: every Action of `catalogue/paladin.txt` (level 1; efficiency also at levels 2 and 3)

**The Paladin before P1** (the book until 2026-10-29), kept to compare.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.01 | 1.01 | a little over |  |
| Steel Yourself 2 | 2 | round |  | 0.0 | 8.8 | 8.8 | 4.40 | 0.94 | 0.93 | 1.04 | a little under | uses the target's own Rally Points |
| Steel Yourself 3 | 3 | round |  | 0.0 | 17.6 | 17.6 | 5.87 | 1.26 | 1.24 | 1.38 | on target | uses the target's own Rally Points |
| Smite 1 | 1 | round |  | 7.4 | 0.0 | 7.4 | 7.44 | 1.60 | 1.40 | 1.40 | **over** |  |
| Smite 2 | 2 | round |  | 12.3 | 0.7 | 13.0 | 6.52 | 1.40 | 1.23 | 1.23 | a little over |  |
| Smite 3 | 3 | round |  | 16.9 | 0.7 | 17.6 | 5.86 | 1.26 | 1.10 | 1.10 | on target |  |
| Lay On Hands 1 | 1 | round |  | 0.0 | 8.8 | 8.8 | 8.80 | 1.89 | 1.86 | 2.07 | **over** | uses the target's own Rally Points |
| Lay On Hands 2 | 2 | round |  | 0.0 | 19.8 | 19.8 | 9.90 | 2.12 | 2.10 | 2.31 | **over** | uses the target's own Rally Points; Evade 2: saves the step away (1 AP) on the 47% of the turns it starts Engaged |
| Rebuke 1 (R) | 1 | turn |  | 4.5 | 0.0 | 4.5 | 4.49 | 0.96 | 0.85 | 0.85 | a little under | Reaction: needs AP kept after your turn |
| Rebuke 2 (R) | 2 | turn |  | 5.5 | 0.9 | 6.4 | 3.20 | 0.69 | 0.61 | 0.61 | **under** | Pushed 1: 0.91 (positions); Pushed 2: 0.91 (positions); Pushed 3: 0.91 (positions); Reaction: needs AP kept after your turn |
| Vow of Enmity 1 | 1 | round |  | 1.2 | 1.1 | 2.3 | 2.27 | 0.49 | 0.43 | 0.43 | **under** |  |
| Vow of Enmity 2 | 2 | round |  | 2.5 | 1.4 | 3.9 | 1.96 | 0.42 | 0.37 | 0.37 | **under** |  |
| Vow of Enmity 3 | 3 | round |  | 5.1 | 1.7 | 6.8 | 2.26 | 0.48 | 0.43 | 0.43 | **under** |  |
| Shield of Faith 1 | 1 | round |  | 0.0 | 0.9 | 0.9 | 0.87 | 0.19 | 0.18 | 0.20 | **under** |  |
| Shield of Faith 2 | 2 | round |  | 0.0 | 1.7 | 1.7 | 0.87 | 0.19 | 0.18 | 0.20 | **under** |  |
| Shield of Faith 3 | 3 | round |  | 0.0 | 1.3 | 1.3 | 0.43 | 0.09 | 0.09 | 0.10 | **under** + ? | not modeled: Boon on Saves (NPC Save Actions are not modeled) |
| Sacred Weapon 1 | 1 | round |  | 0.0 | 5.0 | 5.0 | 4.97 | 1.07 | 0.94 | 0.94 | on target |  |
| Sacred Weapon 2 | 2 | round |  | 0.0 | 9.9 | 9.9 | 4.97 | 1.07 | 0.94 | 0.94 | on target |  |
| Champion's Challenge 1 | 1 | round |  | 0.0 | 0.6 | 0.6 | 0.56 | 0.12 | 0.11 | 0.13 | **under** |  |
| Champion's Challenge 2 | 2 | round |  | 0.0 | 1.1 | 1.1 | 0.56 | 0.12 | 0.11 | 0.13 | **under** |  |
| Word of Radiance 2 | 2 | encounter |  | 13.7 | 0.6 | 14.3 | 7.16 | 1.54 | 1.36 | 1.36 | on target | Prone: 1.20 (positions) |
| Word of Radiance 3 | 3 | encounter |  | 22.4 | 0.8 | 23.3 | 7.75 | 1.66 | 1.47 | 1.47 | on target | Prone: 1.20 (positions) |
| Divine Retribution Weapon (R) | 2 | encounter |  | 12.3 | 0.0 | 12.3 | 6.13 | 1.31 | 1.15 | 1.15 | a little under | Reaction: needs AP kept after your turn |
| Divine Retribution Power (R) | 3 | encounter |  | 11.0 | 0.0 | 11.0 | 3.66 | 0.79 | 0.69 | 0.69 | **under** | Reaction: needs AP kept after your turn |
| Aura of Protection 1 | 1 | encounter |  | 0.0 | 2.2 | 2.2 | 2.16 | 0.46 | 0.44 | 0.49 | **under** |  |
| Aura of Protection 2 | 2 | encounter |  | 0.0 | 5.2 | 5.2 | 2.61 | 0.56 | 0.53 | 0.59 | **under** |  |
| Aura of Protection 3 | 3 | encounter |  | 0.0 | 5.2 | 5.2 | 1.74 | 0.37 | 0.35 | 0.39 | **under** + ? | not modeled: Boon on Saves (NPC Save Actions are not modeled) |
| Miraculous Recovery 2 | 2 | daily |  | 0.0 | 22.3 | 22.3 | 11.17 | 2.40 | 2.37 | 2.58 | on target | ends an effect: 4.74 (the average Moderate condition on a PC, positions) |
| Miraculous Recovery 3 | 3 | daily |  | 0.0 | 31.1 | 31.1 | 10.38 | 2.23 | 2.20 | 2.41 | on target | ends an effect: 4.74 (the average Moderate condition on a PC, positions) |
| Consecrated Ground 2 | 2 | daily |  | 0.0 | 21.7 | 21.7 | 10.85 | 2.33 | 2.08 | 2.14 | on target |  |
| Consecrated Ground 3 | 3 | daily |  | 0.0 | 45.2 | 45.2 | 15.08 | 3.24 | 2.89 | 2.97 | a little over |  |
| Divine Intervention 1 (R) | 1 | daily |  | 0.0 | 31.8 | 31.8 | 31.80 | 6.83 | 6.83 | 6.83 | **over** | a Down undone or prevented: 35 DE a use, x 91% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Divine Intervention 2 (R) | 2 | daily |  | 0.0 | 40.6 | 40.6 | 20.30 | 4.36 | 4.34 | 4.45 | **over** | a Down undone or prevented: 35 DE a use, x 91% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Call to Arms | 0 | round | 1 | 0.0 | 20.3 | 20.3 | - | 87% of a turn | 87% | 91% | **over** (0 AP: >25% of a turn) | a Down undone or prevented: 35 DE a use, x 33% (how often an ally goes Down in a fight); costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 5.2 DE a turn |
| Divine Surge | 0 | round | 1 | 0.0 | 4.5 | 4.5 | - | 19% of a turn | 17% | 17% | on target (0 AP) | costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 3.9 DE a turn |
| Hand of Mercy | 1 | round | 1 | 0.0 | 4.7 | 4.7 | 4.74 | 1.02 | 1.02 | 1.02 | on target | ends an effect: 4.74 (the average Moderate condition on a PC, positions); costs 1 Escalation: 3.41 uses a fight (2.91 without Momentum), 4.1 DE a turn |
| Judgment | 1 | round | 2 | 5.6 | 1.1 | 6.6 | 6.65 | 1.43 | 1.28 | 1.28 | a little over | Hindered: 1.46 (positions); costs 2 Escalation: 1.50 uses a fight (1.29 without Momentum), 2.6 DE a turn |
| Sanctified Ground | 1 | round | 2 | 0.0 | 2.6 | 2.6 | 2.60 | 0.56 | 0.53 | 0.59 | **under** | costs 2 Escalation: 1.50 uses a fight (1.29 without Momentum), 1.0 DE a turn |

**Paladin passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Hallowed Stance | 2 | 7.2 | 4.5 | 19% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Avenger's Oath | 2 | 0.2 | 0.1 | 0% | about once a fight (a third of the turns) |
| Aegis |  | 0.0 | 0.0 | 0% | not modeled: 1 |
| Divine Vigil | 2 | 0.0 | 0.0 | 0% | not modeled: Boon on Saves against Fear |
| Mercy's Reward |  | 2.5 | 2.5 | 11% | 6.0 a Smite after a Lay On Hands that heals; weighted by Lay On Hands on 43% of the turns |
| Profane Judgment |  | 0.0 | 0.0 | 0% | not modeled: Enfeebled 1 on Profane creatures |

## 5. Positions (pack E2): movement and conditions (level 1)

Measured with the map model (`map.mjs`; README "The map model"): the party of a Standard day (2 Smite Paladins, 2 Archers) against 4 Standards that don't die, 6000 pairs of fights with the same dice, the change in one and not the other. **Value = the party's damage dealt more + its damage taken less** (1 Health = 1 DE) over 2 rounds from the round the condition is put on (round 1: the NPCs are closing in; rounds 2 and 3: the lines are in contact). The ± is one standard error.

### What a fight on the map looks like (rounds 1 to 4)

| | |
|---|---:|
| Archer: Banes from the map on each shot (average) | 1.60 |
| ... shots into melee (the target is Engaged with a Paladin: 1 Bane) | 72% |
| ... shots with Cover (a creature in the line, or the map's own cover) | 53% (0.58 Banes a shot) |
| ... Range Banes a shot (far range) | 0.26 |
| ... shots while Engaged (2 Banes) | 2% |
| Archer turns that start Engaged (it steps away: the Kite turn) | 47% |
| Archer turns it hadn't left its square since its last turn (Patient Hunter) | 70% |
| Archer AP spent moving a turn | 0.45 |
| Paladin AP spent moving a turn (closing in, round 1 mostly) | 0.25 |
| Paladin Flanking Boons a Weapon Action | 0.21 |
| Paladin Opportunity Attacks a turn | 0.00 |
| NPC Strikes aimed at a Paladin / an Archer (each) | 34% / 16% |

### Conditions and Forced Movement on one NPC (a Standard)

| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Share of 1 AP |
|---|---:|---:|---:|---:|---:|---:|
| Hindered (EoT) | 2.08 | 1.43 | 0.87 | **1.46** | 0.18 | 31% |
| Hindered until it moves (Lock & Loose) | 0.59 | 0.71 | 0.75 | **0.69** | 0.14 | 15% |
| Immobilized (EoT) | 5.44 | 4.68 | 3.98 | **4.70** | 0.20 | 101% |
| Immobilized until it escapes (Interact, 1 AP) | 1.56 | 1.59 | 1.42 | **1.52** | 0.17 | 33% |
| Prone (Stand, 1 AP) | 1.34 | 1.13 | 1.14 | **1.20** | 0.18 | 26% |
| Slowed 1 (its next turn) | 1.59 | 1.27 | 1.43 | **1.43** | 0.18 | 31% |
| Slowed 2 (its next turn) | 3.49 | 3.89 | 3.48 | **3.62** | 0.20 | 78% |
| Pushed 1 (from the nearest PC) | 0.25 | 0.99 | 1.28 | **0.84** | 0.17 | 18% |
| Pushed 2 (from the nearest PC) | 0.41 | 0.75 | 1.17 | **0.78** | 0.19 | 17% |
| Pushed 4 (from the nearest PC) | 1.03 | 1.05 | 1.25 | **1.11** | 0.21 | 24% |
| Slid 2 (away from the PCs) | 0.41 | 1.14 | 1.44 | **1.00** | 0.18 | 21% |
| Pulled 2 (toward the nearest Paladin) | 3.15 | 0.13 | 0.27 | **1.18** | 0.21 | 25% |
| Vulnerable 1 (EoT; E1 prices it 1.23) | 0.42 | 0.58 | 0.84 | **0.61** | 0.06 | 13% |

### The same on a PC (what an NPC's condition costs the party), against the Bestiary's severity steps

The Bestiary prices a condition on an NPC Action in steps of damage rating (Mild 1, Moderate 2, Severe 3; one step is 20 to 25% of the Action's damage). For a Standard's 2 AP Special (Basic attack × 2.2 against AD 13) one step is about 2.1 DE.

| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Bestiary | In steps |
|---|---:|---:|---:|---:|---:|---|---:|
| Hindered (EoT) on a Paladin | 5.18 | 0.18 | 0.22 | **1.86** | 0.14 | Mild | 0.9 |
| Hindered (EoT) on an Archer | -0.03 | 0.05 | -0.01 | **0.00** | 0.06 | Mild | 0.0 |
| Pushed 2 on a Paladin | 2.02 | 1.24 | 0.85 | **1.37** | 0.23 | Mild | 0.7 |
| Pushed 2 on an Archer | -1.53 | -2.22 | -1.89 | **-1.88** | 0.21 | Mild | -0.9 |
| Prone on a Paladin | 6.67 | 5.83 | 5.81 | **6.10** | 0.14 | Moderate | 2.9 |
| Prone on an Archer | 5.41 | 6.03 | 5.88 | **5.77** | 0.15 | Moderate | 2.8 |
| Immobilized (EoT) on a Paladin | 13.13 | 2.01 | 1.56 | **5.57** | 0.27 | Moderate | 2.7 |
| Immobilized (EoT) on an Archer | 1.34 | 2.80 | 2.34 | **2.16** | 0.15 | Moderate | 1.0 |
| Slowed 1 on a Paladin | 6.25 | 5.07 | 5.09 | **5.47** | 0.12 | Moderate | 2.6 |
| Slowed 1 on an Archer | 5.22 | 5.52 | 5.41 | **5.39** | 0.14 | Moderate | 2.6 |
| Pushed 4 on a Paladin | 4.47 | 2.10 | 1.52 | **2.70** | 0.26 | Moderate | 1.3 |
| Immobilized until it escapes, on an Archer | 3.06 | 4.71 | 3.88 | **3.88** | 0.17 | Severe | 1.9 |
| Slowed 2 on a Paladin | 15.66 | 9.76 | 9.99 | **11.80** | 0.16 | Severe | 5.7 |

### The map's rules (on against off, rounds 1 to 4)

| Rule | What it costs the party a round | ± (per run) | Who it hits |
|---|---:|---:|---|
| Ranged while Engaged (2 Banes) | 0.14 | 0.01 | the Archers' shots |
| Ranged into melee (1 Bane) | 2.42 | 0.05 | the Archers' shots |
| Cover (creatures in the line, the map's cover) | 1.94 | 0.09 | the Archers' shots |
| Range (far 1 Bane, maximum 2) | 0.94 | 0.03 | the Archers' shots |
| Flanking (both sides) | 2.18 | 0.07 | both sides' melee |

### Builds and Talents (per turn of the changed class, rounds 1 to 4)

| Change | DE a turn | ± | Share of a baseline turn | Note |
|---|---:|---:|---:|---|
| +1 Speed (Archer 6 → 7) | 0.01 | 0.00 | 0% |  |
| -1 Speed (Archer 6 → 5) | 0.01 | 0.01 | 0% |  |
| +1 Speed (Paladin 5 → 6) | 0.04 | 0.01 | 0% |  |
| -1 Speed (Paladin 5 → 4) | -0.07 | 0.01 | 0% |  |
| The Archer stands and shoots when Engaged (no Kite turn) | -1.51 | 0.06 | -6% | the price of stepping away |
| Talent: Opportunity Attack added | 0.00 | 0.00 | 0% | AP kept after its turn are rare: most turns spend 5 |
| Talent: Opportunity Attack, keeping 1 AP for it (its last Weapon Attack dropped) | -1.78 | 0.04 | -8% |  |
| Steady Nerves always on (no Engaged Banes) | 0.08 | 0.01 | 0% | the Archer kites, so it is rarely Engaged when it shoots |
| Steady Nerves, an Archer that doesn't kite | 1.96 | 0.03 | 8% | against the same Archer without it |
| Long Draw (far range no Bane, maximum 1) | 0.50 | 0.02 | 2% |  |
| Rolling Shot 1 for the step away (Evade 1 + a Weapon Attack for the Advance's AP) | 2.13 | 0.06 | 9% | the Evade is worth the AP of the step away on the turns the Archer starts Engaged |
| Every Standard has an Opportunity Attack; the Archer still steps away | -0.25 | 0.05 | -1% | what it costs the party (map npc-reactions standard, elite) |
| Every Standard has an Opportunity Attack; Rolling Shot 1 to step away | 2.37 | 0.04 | 10% | against the Advance away, in the same world |

## Assumptions

- `heal`: 1.1
- `downTurns`: 1.5
- `vulnAttacks`: 2.5
- `quarryShare`: 0.16
- `rangedShare`: 0.3
- `othersShare`: 0.66
- `surgeLands`: 0.9
- `hitBeforeTurn`: 0.95
- `guardUsed`: 0.3
- `baseHealthSpecs`: attributes body 2, mind 1
health body x4 +3, mind x3 +4,attributes body 1, mind 1
health body x3 +3, mind x2.5 +4
- `roles`: [object Object]
- `growth`: 0.1
- Areas: the catalogues write `area N` as the creatures reached (Emanation 1: 1.5, 2: 2, 3: 2.5 of a normal fight's 4 enemies) and `allies N` as the allies reached (Aura 1: 1.5, Aura 2: 2.5, Aura 3: 3, you included).
- A "next ..." effect is priced on the Action it most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the Action it names (Smite 2).
- Divine Retribution: Weapon mode 2R, Power mode 3R (the card has 2 / 3R and two columns).
