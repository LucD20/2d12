# The price list of the core rules (pack E1; positions: pack E2)

Written by `node book/ruler/econ.mjs` from the class catalogues (`book/ruler/catalogue/*.txt`) and the system's dice math. Don't edit this file: edit those and run it again.

Everything is priced in **damage-equivalents (DE)**: average damage against the level's Medium Standard (AD and WD 13, Saves +1, Body +2), with Weapon and Power Modifier +2 (no Attribute growth in levels 1 to 3 yet).

## 1. The exchange rate

| | Level 1 | Level 2 | Level 3 | Where it comes from |
|---|---:|---:|---:|---|
| A baseline PC's damage a turn (Defense 13) | 23.30 | 23.30 | 23.30 | the Bestiary's PC baseline (config pcDamageVsDefense, flat inside Stage 1: model A, pack LV) |
| **1 AP** (the baseline turn / 5) | 4.66 | 4.66 | 4.66 | the price of one Action Point |
| A Paladin Weapon Attack (Greatsword) | 5.36 | 5.36 | 5.36 | exact |
| An Archer Weapon Attack (Crossbow) | 5.50 | 5.50 | 5.50 | exact |
| A Standard's turn against AD 13 | 10.74 | 10.74 | 10.74 | exact: 2 Strikes, the 2nd with 1 Bane; what a PC takes a round in a normal fight (CV 1 per PC) |
| The baseline PC's Health Pool | 31.50 | 34.00 | 36.50 | frozen (pack P1): the average of the Paladin and the Archer as they were before P1 (a Human Paladin and a Human Archer) |
| A Rally Point (Health it heals) | 8.00 | 9.00 | 10.00 | ceil(Pool / 4) of that baseline Pool |
| 1 Health healed | 1.10 | 1.10 | 1.10 | Lucas: a little more than 1 damage |
| A Down prevented or undone | 34.95 | 34.95 | 34.95 | 1.5 baseline turns (the turns it would lose), plus the Health |

**Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so spending turns it off. **Momentum** (Lucas, 2026-10-29): +1 after each fight harder than easy; with Momentum you start a fight with half your level in Escalation (rounded up), up to 2; a Rest resets it. In the Standard day (easy, normal, normal, hard) of fights.txt (level 1 party, simulated; 4.1 rounds a fight, 50% of the fights start with Momentum):

| | Escalation 1 or more | 2 or more | 3 or more |
|---|---:|---:|---:|
| Share of the rounds, nothing spent, with Momentum | 88% | 63% | 39% |
| The same without Momentum | 75% | 51% | 27% |
| Uses a fight of an Active that costs it (spent as soon as possible) | 3.57 | 1.57 | 0.82 |
| The same without Momentum | 3.07 | 1.34 | 0.62 |

An Active and a passive compete: a level 1 PC who spends 1 Escalation every round never reaches 2, so its Escalation 2 passive stays off. In the same day an ally goes Down in 46% of the fights and on 97% of the days; a Paladin uses Lay On Hands on 39% of its turns.

## 2. The price list (level 1; DE, and as a share of what it modifies)

| Effect | DE | Share | Notes |
|---|---:|---:|---|
| +1 Boon on a Weapon Attack (Paladin / Archer) | 0.50 | 9% | +1 Modifier and -1 target Defense are the same |
| +2 Boons | 0.98 | 18% |  |
| +1 Bane | -0.55 | -10% |  |
| Favored | 1.95 | 35% | about 3.7 Boons |
| Empowered 1 on a Greatsword / Crossbow Weapon Attack | 0.99 | 18% / 13% | Crossbow 0.72: +1 a die that lands, so more dice = more value |
| Vulnerable 1 (until the target's turn ends) | 1.23 | - | 2.5 party attacks reach it |
| +1 Defense for 1 round on one ally | 1.18 | 11% | of what it would take that round; +2: 2.37 |
| 1 Bane on one enemy's Strikes for its turn | 1.18 | 11% | the same as +1 Defense for everyone it attacks |
| A Rally Point used in a fight | 8.80 | - | Steel Yourself pays 2 AP for it: 4.40 DE per AP |
| A Down prevented or undone | 34.95 | - |  |

**Frequency bands** (DE per AP, divided by the price of 1 AP): At-will 0.9 to 1.1, Round and Turn 1 to 1.3, Encounter 1.4 to 2, Daily 2 to 3. An At-will Action takes a Bane on each use after the first, so its first use can sit at the top. A **0 AP** Action is priced per use as a share of a baseline turn. Verdict: **under** or **over** when more than 10% outside its band; **+ ?** when part of its value is still not modeled (NPC Saves, hazardous areas), so the verdict isn't final. Movement, Evade, Forced Movement, Cover, range, Hindered, Immobilized, Prone and ending an effect are priced by positions (pack E2, section 5).

## 3. The role budgets (every build of `classes/`)

Shares of the baseline PC: damage against the Bestiary's baseline turn of the level (23.3 / 23.3 / 23.3 at levels 1 / 2 / 3), and in brackets against model A (pack LV: flat inside tier 1, +0% a level: 23.3 / 23.3 / 23.3; pack E3 refits the Bestiary to it). Health against the baseline Pool (31.5 / 34.0 / 36.5).

**Sustained (best)**: the best turn with no Encounter or Daily Action and no Escalation (a Reload Shot turn and heal turns left out). **Nova**: the best turn with an Encounter or Daily Action, at the Escalation it spends or the Escalation Momentum starts a fight with (1 / 1 / 2), whichever is more. **Sustained (real)**: the damage a turn in the simulated Standard day on the turns without an Encounter or Daily Action (openings, Steel Yourself turns and Escalation as the plan spends it, Momentum on); **this is the column the sustained budget is checked on**. **All turns**: the same with the Nova turns in (a once-a-fight Nova is about a third of a PC's turns: fights last about 3 rounds). The real columns use the map model (pack E2: positions, movement, Banes from range, cover and shooting into melee, Flanking); **No positions** is the sustained real damage in the old fight with no map, to compare.

| Build | Sustained (best) | Nova | Sustained (real) | No positions | All turns (real) | Health | Budget: sustained / Nova / Health | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Archer L1 `archer-1` | 24.1 (104%) | 19.2 (82%) | 22.2 (95%) | 27.4 (118%) | 20.8 (89%) | 27 (86%) | 100%-105% / 110%-130% / 80%-85% | sustained low; Nova low; Health ok (86%) |
| Archer L2 `archer-2` | 26.8 (115%; 115%) | 19.2 (82%; 82%) | 24.0 (103%; 103%) | 29.4 (126%; 126%) | 22.1 (95%; 95%) | 29 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova low; Health ok (85%) |
| Archer L3 `archer-3` | 26.8 (115%; 115%) | 22.0 (94%; 94%) | 24.2 (104%; 104%) | 30.3 (130%; 130%) | 22.6 (97%; 97%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova low; Health ok (85%) |
| Archer (Double Shot) L1 `archer-double-1` | 25.0 (107%) | - | 23.8 (102%) | 23.9 (103%) | 23.8 (102%) | 27 (86%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova none; Health ok (86%) |
| Archer (Double Shot) L2 `archer-double-2` | 25.0 (107%; 107%) | 30.0 (129%; 129%) | 24.2 (104%; 104%) | 24.0 (103%; 103%) | 24.9 (107%; 107%) | 29 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova ok; Health ok (85%) |
| Archer (Double Shot, options) L3 `archer-double-3-options` | 25.0 (107%; 107%) | 35.6 (153%; 153%) | 25.1 (108%; 108%) | 25.3 (109%; 109%) | 26.1 (112%; 112%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova high; Health ok (85%) |
| Archer (Double Shot) L3 `archer-double-3` | 25.0 (107%; 107%) | 33.4 (143%; 143%) | 25.6 (110%; 110%) | 26.2 (112%; 112%) | 26.7 (115%; 115%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained high; Nova high; Health ok (85%) |
| Archer (Rolling Shot) L1 `archer-rolling-1` | 24.5 (105%) | - | 24.1 (103%) | 23.9 (102%) | 24.1 (103%) | 27 (86%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova none; Health ok (86%) |
| Archer (Rolling Shot) L2 `archer-rolling-2` | 24.5 (105%; 105%) | 28.9 (124%; 124%) | 24.2 (104%; 104%) | 23.6 (101%; 101%) | 25.1 (108%; 108%) | 29 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova ok; Health ok (85%) |
| Archer (Rolling Shot) L3 `archer-rolling-3` | 24.5 (105%; 105%) | 32.4 (139%; 139%) | 25.7 (110%; 110%) | 25.7 (110%; 110%) | 27.2 (117%; 117%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained high; Nova high; Health ok (85%) |
| Paladin (book) L1 `paladin-book-1` | 24.5 (105%) | 24.3 (104%) | 24.9 (107%) | 24.7 (106%) | 25.7 (110%) | 36 (114%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova low; Health low (114%) |
| Paladin (Lay On Hands) L1 `paladin-hands-1` | 14.3 (62%) | 27.3 (117%) | 12.4 (53%) | 13.7 (59%) | 14.9 (64%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova low; Health ok (124%) |
| Paladin (Lay On Hands) L2 `paladin-hands-2` | 14.3 (62%; 62%) | 27.3 (117%; 117%) | 12.4 (53%; 53%) | 13.8 (59%; 59%) | 14.8 (64%; 64%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova low; Health ok (126%) |
| Paladin (Lay On Hands) L3 `paladin-hands-3` | 14.3 (62%; 62%) | 31.2 (134%; 134%) | 13.8 (59%; 59%) | 15.7 (67%; 67%) | 16.0 (69%; 69%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova low; Health ok (126%) |
| Paladin (Smite, hold) L1 `paladin-smite-1-hold` | 24.1 (104%) | 39.9 (171%) | 21.6 (93%) | 22.6 (97%) | 25.9 (111%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova ok; Health ok (124%) |
| Paladin (Smite, options) L1 `paladin-smite-1-options` | 24.1 (104%) | 24.1 (104%) | 20.6 (88%) | 21.2 (91%) | 22.4 (96%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova low; Health ok (124%) |
| Paladin (Smite) L1 `paladin-smite-1` | 24.1 (104%) | 39.9 (171%) | 21.5 (92%) | 22.8 (98%) | 26.1 (112%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (124%) |
| Paladin (Smite) L2 `paladin-smite-2` | 24.1 (104%; 104%) | 39.9 (171%; 171%) | 21.7 (93%; 93%) | 22.8 (98%; 98%) | 26.2 (112%; 112%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova ok; Health ok (126%) |
| Paladin (Smite) L3 `paladin-smite-3` | 24.1 (104%; 104%) | 43.6 (187%; 187%) | 23.9 (103%; 103%) | 25.1 (108%; 108%) | 28.1 (120%; 120%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova high; Health ok (126%) |

Roles: Paladin: tank and support: more Health, heals and Defense for allies, Nova damage. Archer: mobile, fragile, constant ranged damage (a future melee class has the top damage: about 1.15). The verdict at level 2 and 3 uses model A (pack LV: the baseline stays at level 1's inside tier 1; the Bestiary's level 2-3 rows are refit in E3).

## 4. Paladin (P1): every Action of `catalogue/paladin-p1.txt` (level 1; efficiency also at levels 2 and 3)

**The P1 main build (pack P1, 2026-10-29; in the book since 2026-10-29)**: the defaults of every level 1 to 3 Pick, then the options in the Paladin document (Shield of Faith, Bulwark of Faith, Aura of Protection, Font of Mercy).

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over |  |
| Smite 1 | 1 | round |  | 8.2 | 0.0 | 8.2 | 8.16 | 1.75 | 1.75 | 1.75 | **over** |  |
| Smite 2 | 2 | round |  | 12.5 | 0.0 | 12.5 | 6.23 | 1.34 | 1.34 | 1.34 | a little over |  |
| Smite 3 | 3 | round |  | 14.3 | 1.5 | 15.9 | 5.29 | 1.13 | 1.13 | 1.13 | on target | Guard: only what a later hit uses (30%) |

**Paladin (P1) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Font of Mercy | 1 | 0.6 | 0.5 | 2% | +4 on every Rally Point the party uses in a fight (Escalation is 0 between fights): 0.13 a Paladin turn in the Standard day (a Lay On Hands party uses more: 0.55, 2.4 DE) |
| Hallowed Stance | 3 | 14.4 | 5.7 | 24% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Radiant Zeal | 1 | 2.5 | 2.2 | 10% | the first qualifying hit each round |
| Heavy Blows |  | 2.4 | 2.4 | 10% | +1 on each damaging hit of the typical turn's matching Actions |

## 4. Archer (A1): every Action of `catalogue/archer-a1.txt` (level 1; efficiency also at levels 2 and 3)

**The A1 main build (pack A1, 2026-10-29; PROPOSED: book/archer-a1.md)**: both Signatures and the defaults of every level 1 to 3 Pick.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot 2 | 2 | round |  | 11.0 | 0.0 | 11.0 | 5.50 | 1.18 | 1.18 | 1.18 | on target |  |
| Double Shot 3 | 3 | round |  | 11.0 | 2.1 | 13.1 | 4.38 | 0.94 | 0.94 | 0.94 | a little under | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Hunter's Focus | 1 | daily |  | 0.0 | 13.0 | 13.0 | 13.00 | 2.79 | 2.79 | 2.79 | on target |  |
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | a little over |  |
| Lock & Loose | 1 | round |  | 5.5 | 1.2 | 6.7 | 6.69 | 1.44 | 1.44 | 1.44 | **over** | Hindered (until it moves): 1.13 (positions); Immobilized: 2.48 (positions) |

**Archer (A1) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Killer's Focus | 1 | 2.5 | 2.2 | 10% | the first qualifying hit each round |
| Marked Quarry |  | 1.9 | 1.9 | 8% | the typical turn's Shot Strikes against the quarry, +1 Boon each |

## 4. Archer (options): every Action of `catalogue/archer-options.txt` (level 1; efficiency also at levels 2 and 3)

**The Archer's options (pack OT, 2026-10-30; in the book: book/options-talents.md)**: every option of a level 1 to 3 Pick slot, to compare with its default (A1).

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot 2 | 2 | round |  | 11.0 | 0.0 | 11.0 | 5.50 | 1.18 | 1.18 | 1.18 | on target |  |
| Double Shot 3 | 3 | round |  | 11.0 | 2.1 | 13.1 | 4.38 | 0.94 | 0.94 | 0.94 | a little under | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | a little over |  |

**Archer (options) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Killer's Focus | 1 | 2.5 | 2.2 | 10% | the first qualifying hit each round |

## 4. Archer: every Action of `catalogue/archer.txt` (level 1; efficiency also at levels 2 and 3)

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot 2 | 2 | round |  | 11.0 | 0.0 | 11.0 | 5.50 | 1.18 | 1.18 | 1.18 | on target |  |
| Double Shot 3 | 3 | round |  | 12.0 | 0.0 | 12.0 | 4.01 | 0.86 | 0.86 | 0.86 | **under** |  |
| Rolling Shot 2 | 2 | round |  | 6.0 | 2.1 | 8.1 | 4.07 | 0.87 | 0.87 | 0.87 | **under** | Evade 3: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Marksman's Shot | 2 | encounter |  | 5.5 | 0.8 | 6.3 | 3.17 | 0.68 | 0.68 | 0.68 | **under** |  |
| Volley | 3 | encounter |  | 12.3 | 1.5 | 13.8 | 4.59 | 0.99 | 0.99 | 0.99 | **under** | Hindered: 2.12 (positions) |
| Covering Fire | 2 | encounter |  | 0.0 | 3.5 | 3.5 | 1.77 | 0.38 | 0.38 | 0.38 | **under** + ? | not modeled: enemies entering take 1d4 |
| Pinning Shot | 1 | round | 2 | 5.5 | 7.5 | 13.0 | 12.96 | 2.78 | 2.78 | 2.78 | **over** | Immobilized (EoT): 7.47 (positions); costs 2 Escalation: 1.57 uses a fight (1.34 without Momentum), 5.0 DE a turn |
| Hunter's Focus | 1 | daily |  | 0.0 | 13.1 | 13.1 | 13.14 | 2.82 | 2.82 | 2.82 | on target |  |
| Deadeye | 3 | daily |  | 12.4 | 0.6 | 13.0 | 4.34 | 0.93 | 0.93 | 0.93 | **under** | Prone: 2.26 (positions) |
| Rain of Arrows | 3 | daily |  | 11.4 | 0.0 | 11.4 | 3.81 | 0.82 | 0.82 | 0.82 | **under** + ? | not modeled: the area lasts 2 rounds (hazardous terrain) |
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | a little over |  |
| Lock & Loose | 1 | round |  | 5.5 | 1.2 | 6.7 | 6.69 | 1.44 | 1.44 | 1.44 | **over** | Hindered (until it moves): 1.13 (positions); Immobilized: 2.48 (positions) |
| Reload | 1 | at-will |  | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | a cost (of a Reload Shot) |  |
| Precise Aim 1 | 1 | round |  | 0.0 | 0.5 | 0.5 | 0.52 | 0.11 | 0.11 | 0.11 | **under** |  |
| Precise Aim 2 | 2 | round |  | 0.0 | 1.0 | 1.0 | 0.50 | 0.11 | 0.11 | 0.11 | **under** |  |
| Quick Draw (R) | 1 | turn |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | on target | Reaction: needs AP kept after your turn |
| Wing Clip | 1 | round |  | 7.6 | 0.6 | 8.1 | 8.14 | 1.75 | 1.75 | 1.75 | **over** | Hindered: 2.12 (positions) |
| True Shot | 1 | round |  | 0.0 | 0.3 | 0.3 | 0.32 | 0.07 | 0.07 | 0.07 | **under** | ignores Cover: 0.57 Banes on an average shot |
| Suppressing Fire | 1 | round |  | 0.0 | 0.5 | 0.5 | 0.47 | 0.10 | 0.10 | 0.10 | **under** |  |
| Steady Aim | 0 | round | 1 | 0.0 | 0.7 | 0.7 | - | 3% of a turn | 3% | 3% | under (0 AP: <8% of a turn) | range: 0.26 range Banes on an average shot; costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 0.6 DE a turn |
| Vanish | 1 | round | 1 | 0.0 | 2.1 | 2.1 | 2.14 | 0.46 | 0.46 | 0.46 | **under** + ? | not modeled: the first Strike against you takes 1 Bane; Evade 3: saves the step away (1 AP) on the 46% of the turns it starts Engaged; costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 1.9 DE a turn |
| Perfect Shot | 0 | round | 3 | 0.0 | 3.8 | 3.8 | - | 16% of a turn | 16% | 16% | on target (0 AP) | ignores Cover: 0.57 Banes on an average shot; costs 3 Escalation: 0.82 uses a fight (0.62 without Momentum), 0.8 DE a turn |

**Archer passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Marked Quarry |  | 1.8 | 1.8 | 8% | the typical turn's Shot Strikes against the quarry, +1 Boon each |
| Killer's Focus | 1 | 2.5 | 2.2 | 10% | the first qualifying hit each round |
| Patient Hunter | 2 | 1.3 | 0.8 | 4% | the typical turn's Shots, on the 73% of the Archer's turns it hasn't left its square since its last one (positions): against the Archer's role (mobile) |
| Long Draw |  | 0.5 | 0.5 | 2% | 1 range Bane off (0.26 a shot on average: positions) |
| Steady Nerves | 2 | 0.1 | 0.0 | 0% | 2 Banes off the 2% of the shots made while Engaged (the Archer kites: positions); an Archer that doesn't kite: section 5 |

## 4. Gear (D2 weapons): every Action of `catalogue/gear-d2.txt` (level 1; efficiency also at levels 2 and 3)

**The weapons and Weapon Techniques of D2 (2026-10-31; book/gear-d2.md)**: every weapon's Weapon Attack and its Technique, on a level 1 PC (Weapon Modifier +2).

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over |  |
| Dagger Attack | 1 | at-will |  | 3.8 | 0.0 | 3.8 | 3.78 | 0.81 | 0.81 | 0.81 | a little under |  |
| Longsword Attack | 1 | at-will |  | 4.5 | 0.0 | 4.5 | 4.51 | 0.97 | 0.97 | 0.97 | on target |  |
| Maul Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | a little over |  |
| Greataxe Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.44 | 1.17 | 1.17 | 1.17 | a little over |  |
| Musket Attack | 1 | at-will |  | 5.0 | 0.0 | 5.0 | 4.99 | 1.07 | 1.07 | 1.07 | on target |  |
| Pistol Attack | 1 | at-will |  | 4.5 | 0.0 | 4.5 | 4.45 | 0.96 | 0.96 | 0.96 | on target |  |
| Knuckle Attack | 1 | at-will |  | 3.5 | 0.0 | 3.5 | 3.52 | 0.75 | 0.75 | 0.75 | **under** |  |
| Stick and Slip (Dagger) | 1 | round |  | 4.3 | 1.5 | 5.9 | 5.88 | 1.26 | 1.26 | 1.26 | on target | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Guarded Cut (Longsword) | 1 | round |  | 5.1 | 0.3 | 5.4 | 5.38 | 1.15 | 1.15 | 1.15 | on target |  |
| Hooking Chop (Handaxe) | 1 | round |  | 4.3 | 0.8 | 5.2 | 5.17 | 1.11 | 1.11 | 1.11 | on target | Pulled 1: 1.15 (positions) |
| Rending Chop (Greataxe) | 1 | round |  | 6.0 | 0.3 | 6.3 | 6.33 | 1.36 | 1.36 | 1.36 | a little over |  |
| Ringing Blow (Mace) | 1 | round |  | 5.1 | 0.2 | 5.3 | 5.27 | 1.13 | 1.13 | 1.13 | on target |  |
| Bowl Over (Maul) | 1 | round |  | 6.1 | 0.6 | 6.7 | 6.66 | 1.43 | 1.43 | 1.43 | a little over | Prone: 2.26 (positions) |
| Lunge (Spear) | 1 | round |  | 4.3 | 0.6 | 4.9 | 4.91 | 1.05 | 1.05 | 1.05 | on target | Hindered (EoT): 2.12 (positions) |
| Keep Them Off (Pike) | 1 | round |  | 5.1 | 0.9 | 5.9 | 5.94 | 1.27 | 1.27 | 1.27 | on target | Pushed 1: 1.21 (positions); Pushed 2: 1.21 (positions) |
| Gut Punch (Knuckle Dagger) | 1 | round |  | 4.1 | 1.5 | 5.6 | 5.61 | 1.20 | 1.20 | 1.20 | on target | Hindered (EoT): 2.12 (positions) |
| Skirmish Shot (Shortbow) | 1 | round |  | 5.1 | 0.6 | 5.6 | 5.63 | 1.21 | 1.21 | 1.21 | on target | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Heartseeker (Longbow) | 1 | round |  | 5.1 | 0.3 | 5.4 | 5.39 | 1.16 | 1.16 | 1.16 | on target |  |
| Sting (Hand Crossbow) | 1 | round |  | 4.3 | 0.6 | 4.9 | 4.91 | 1.05 | 1.05 | 1.05 | on target | Hindered (EoT): 2.12 (positions) |
| Point Blank (Pistol) | 1 | round |  | 5.0 | 0.3 | 5.3 | 5.33 | 1.14 | 1.14 | 1.14 | on target | Pushed 1: 1.21 (positions) |
| Thunderclap (Musket) | 1 | round |  | 5.5 | 0.6 | 6.1 | 6.15 | 1.32 | 1.32 | 1.32 | a little over | Prone: 2.26 (positions) |
| Wounding Shot (Hunting Bow) | 1 | round |  | 5.1 | 0.6 | 5.6 | 5.63 | 1.21 | 1.21 | 1.21 | on target | Hindered (EoT): 2.12 (positions) |
| Wounding Shot at 20 (Hunting Bow) | 1 | round |  | 5.1 | 1.5 | 6.6 | 6.60 | 1.42 | 1.42 | 1.42 | a little over | Hindered (EoT): 2.12 (positions) |
| Skirmish Shot (Recurve Bow) | 1 | round |  | 5.1 | 0.6 | 5.6 | 5.63 | 1.21 | 1.21 | 1.21 | on target | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Skirmish Shot at 8 (Recurve Bow) | 1 | round |  | 5.1 | 1.5 | 6.6 | 6.61 | 1.42 | 1.42 | 1.42 | a little over | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |

**Gear (D2 weapons) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|

## 4. Paladin (options): every Action of `catalogue/paladin-options.txt` (level 1; efficiency also at levels 2 and 3)

**The Paladin's options (pack OT, 2026-10-30; in the book: book/options-talents.md)**: every option of a level 1 to 3 Pick slot, to compare with its default above.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over |  |
| Smite 1 | 1 | round |  | 8.2 | 0.0 | 8.2 | 8.16 | 1.75 | 1.75 | 1.75 | **over** |  |
| Smite 2 | 2 | round |  | 12.5 | 0.0 | 12.5 | 6.23 | 1.34 | 1.34 | 1.34 | a little over |  |
| Smite 3 | 3 | round |  | 14.3 | 1.5 | 15.9 | 5.29 | 1.13 | 1.13 | 1.13 | on target | Guard: only what a later hit uses (30%) |
| Hand of Mercy (cleanse) | 1 | round | 1 | 0.0 | 5.7 | 5.7 | 5.71 | 1.23 | 1.23 | 1.23 | on target | ends an effect: 5.71 (the average Moderate condition on a PC, positions); costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 5.0 DE a turn |
| Hand of Mercy (rescue) | 1 | round | 1 | 0.0 | 25.0 | 25.0 | 24.99 | 5.36 | 5.60 | 5.84 | **over** | a Down undone or prevented: 35 DE a use, x 46% (how often an ally goes Down in a fight); costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 6.1 DE a turn |

**Paladin (options) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Radiant Zeal | 1 | 2.5 | 2.2 | 10% | the first qualifying hit each round |

## 4. Paladin: every Action of `catalogue/paladin.txt` (level 1; efficiency also at levels 2 and 3)

**The Paladin before P1** (the book until 2026-10-29), kept to compare.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over |  |
| Smite 1 | 1 | round |  | 7.4 | 0.0 | 7.4 | 7.44 | 1.60 | 1.60 | 1.60 | **over** |  |
| Smite 2 | 2 | round |  | 12.3 | 0.7 | 13.0 | 6.52 | 1.40 | 1.40 | 1.40 | a little over |  |
| Smite 3 | 3 | round |  | 16.9 | 0.7 | 17.6 | 5.86 | 1.26 | 1.26 | 1.26 | on target |  |
| Lay On Hands 2 | 2 | round |  | 0.0 | 19.7 | 19.7 | 9.87 | 2.12 | 2.35 | 2.59 | **over** | uses the target's own Rally Points; Evade 2: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Word of Radiance 2 | 2 | encounter |  | 13.7 | 1.2 | 14.9 | 7.44 | 1.60 | 1.60 | 1.60 | on target | Prone: 2.26 (positions) |
| Word of Radiance 3 | 3 | encounter |  | 22.4 | 1.5 | 24.0 | 7.99 | 1.71 | 1.71 | 1.71 | on target | Prone: 2.26 (positions) |
| Rebuke 1 (R) | 1 | turn |  | 4.5 | 0.0 | 4.5 | 4.49 | 0.96 | 0.96 | 0.96 | a little under | Reaction: needs AP kept after your turn |
| Rebuke 2 (R) | 2 | turn |  | 5.5 | 1.2 | 6.7 | 3.35 | 0.72 | 0.72 | 0.72 | **under** | Pushed 1: 1.21 (positions); Pushed 2: 1.21 (positions); Pushed 3: 1.21 (positions); Reaction: needs AP kept after your turn |
| Vow of Enmity 1 | 1 | round |  | 1.2 | 1.1 | 2.3 | 2.27 | 0.49 | 0.49 | 0.49 | **under** |  |
| Vow of Enmity 2 | 2 | round |  | 2.5 | 1.4 | 3.9 | 1.96 | 0.42 | 0.42 | 0.42 | **under** |  |
| Vow of Enmity 3 | 3 | round |  | 5.1 | 1.7 | 6.8 | 2.26 | 0.48 | 0.48 | 0.48 | **under** |  |
| Shield of Faith 1 | 1 | round |  | 0.0 | 1.2 | 1.2 | 1.18 | 0.25 | 0.25 | 0.25 | **under** |  |
| Shield of Faith 2 | 2 | round |  | 0.0 | 2.4 | 2.4 | 1.18 | 0.25 | 0.25 | 0.25 | **under** |  |
| Shield of Faith 3 | 3 | round |  | 0.0 | 1.8 | 1.8 | 0.59 | 0.13 | 0.13 | 0.13 | **under** + ? | not modeled: Boon on Saves (NPC Save Actions are not modeled) |
| Champion's Challenge 1 | 1 | round |  | 0.0 | 0.8 | 0.8 | 0.76 | 0.16 | 0.16 | 0.16 | **under** |  |
| Champion's Challenge 2 | 2 | round |  | 0.0 | 1.5 | 1.5 | 0.76 | 0.16 | 0.16 | 0.16 | **under** |  |
| Divine Retribution Weapon (R) | 2 | encounter |  | 12.3 | 0.0 | 12.3 | 6.13 | 1.31 | 1.31 | 1.31 | a little under | Reaction: needs AP kept after your turn |
| Divine Retribution Power (R) | 3 | encounter |  | 11.0 | 0.0 | 11.0 | 3.66 | 0.79 | 0.79 | 0.79 | **under** | Reaction: needs AP kept after your turn |
| Aura of Protection 1 | 1 | encounter |  | 0.0 | 2.9 | 2.9 | 2.94 | 0.63 | 0.63 | 0.63 | **under** |  |
| Aura of Protection 2 | 2 | encounter |  | 0.0 | 7.1 | 7.1 | 3.55 | 0.76 | 0.76 | 0.76 | **under** |  |
| Aura of Protection 3 | 3 | encounter |  | 0.0 | 7.1 | 7.1 | 2.37 | 0.51 | 0.51 | 0.51 | **under** + ? | not modeled: Boon on Saves (NPC Save Actions are not modeled) |
| Divine Intervention 1 (R) | 1 | daily |  | 0.0 | 33.8 | 33.8 | 33.77 | 7.25 | 7.25 | 7.25 | **over** | a Down undone or prevented: 35 DE a use, x 97% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Divine Intervention 2 (R) | 2 | daily |  | 0.0 | 42.6 | 42.6 | 21.29 | 4.57 | 4.69 | 4.80 | **over** | a Down undone or prevented: 35 DE a use, x 97% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Call to Arms | 0 | round | 1 | 0.0 | 25.0 | 25.0 | - | 107% of a turn | 112% | 117% | **over** (0 AP: >25% of a turn) | a Down undone or prevented: 35 DE a use, x 46% (how often an ally goes Down in a fight); costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 6.1 DE a turn |
| Divine Surge | 0 | round | 1 | 0.0 | 4.5 | 4.5 | - | 19% of a turn | 19% | 19% | on target (0 AP) | costs 1 Escalation: 3.57 uses a fight (3.07 without Momentum), 3.9 DE a turn |
| Judgment | 1 | round | 2 | 5.6 | 1.5 | 7.1 | 7.12 | 1.53 | 1.53 | 1.53 | **over** | Hindered: 2.12 (positions); costs 2 Escalation: 1.57 uses a fight (1.34 without Momentum), 2.7 DE a turn |
| Sanctified Ground | 1 | round | 2 | 0.0 | 3.5 | 3.5 | 3.54 | 0.76 | 0.76 | 0.76 | **under** | costs 2 Escalation: 1.57 uses a fight (1.34 without Momentum), 1.4 DE a turn |

**Paladin passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Hallowed Stance | 2 | 7.2 | 4.6 | 20% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Avenger's Oath | 2 | 0.2 | 0.1 | 0% | about once a fight (a third of the turns) |
| Aegis |  | 0.0 | 0.0 | 0% | not modeled: 1 |
| Divine Vigil | 2 | 0.0 | 0.0 | 0% | not modeled: Boon on Saves against Fear |
| Mercy's Reward |  | 2.4 | 2.4 | 10% | 6.0 a Smite after a Lay On Hands that heals; weighted by Lay On Hands on 39% of the turns |
| Profane Judgment |  | 0.0 | 0.0 | 0% | not modeled: Enfeebled 1 on Profane creatures |

## 4. Talents (ranged, on the Archer): every Action of `catalogue/talents-ranged.txt` (level 1; efficiency also at levels 2 and 3)

**The Talents, ranged (pack OT, 2026-10-30; in the book: book/options-talents.md)**: priced on the A1 Archer's numbers.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.18 | 1.18 | a little over |  |
| Aim | 1 | round |  | 6.0 | 0.3 | 6.3 | 6.33 | 1.36 | 1.36 | 1.36 | a little over | ignores Cover: 0.57 Banes on an average shot |
| Aim (today) | 1 | at-will |  | 0.0 | 0.5 | 0.5 | 0.52 | 0.11 | 0.11 | 0.11 | **under** |  |

**Talents (ranged, on the Archer) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Long Draw |  | 0.5 | 0.5 | 2% | 1 range Bane off (0.26 a shot on average: positions) |
| Steady Nerves |  | 0.1 | 0.1 | 0% | 2 Banes off the 2% of the shots made while Engaged (the Archer kites: positions); an Archer that doesn't kite: section 5 |

## 4. Talents (melee, on the Paladin): every Action of `catalogue/talents.txt` (level 1; efficiency also at levels 2 and 3)

**The Talents, melee (pack OT, 2026-10-30; in the book: book/options-talents.md)**: priced on the P1 Paladin's numbers.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over |  |
| Smite 1 | 1 | round |  | 8.2 | 0.0 | 8.2 | 8.16 | 1.75 | 1.75 | 1.75 | **over** |  |
| Smite 2 | 2 | round |  | 11.2 | 0.0 | 11.2 | 5.62 | 1.21 | 1.21 | 1.21 | on target |  |
| Smite 3 | 3 | round |  | 14.3 | 1.5 | 15.9 | 5.29 | 1.13 | 1.13 | 1.13 | on target | Guard: only what a later hit uses (30%) |
| Opportunity Attack (R) | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.15 | 1.15 | a little over | Reaction: needs AP kept after your turn |

**Talents (melee, on the Paladin) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Heavy Blows (today) |  | 2.4 | 2.4 | 10% | +1 on each damaging hit of the typical turn's matching Actions |

## 5. Positions (pack E2): movement and conditions (level 1)

Measured with the map model (`map.mjs`; README "The map model"): the party of a Standard day (2 Smite Paladins, 2 Archers) against 4 Standards that don't die, 6000 pairs of fights with the same dice, the change in one and not the other. **Value = the party's damage dealt more + its damage taken less** (1 Health = 1 DE) over 2 rounds from the round the condition is put on (round 1: the NPCs are closing in; rounds 2 and 3: the lines are in contact). The ± is one standard error.

### What a fight on the map looks like (rounds 1 to 4)

| | |
|---|---:|
| Archer: Banes from the map on each shot (average) | 1.53 |
| ... shots into melee (the target is Engaged with a Paladin: 1 Bane) | 67% |
| ... shots with Cover (a creature in the line, or the map's own cover) | 52% (0.57 Banes a shot) |
| ... Range Banes a shot (far range) | 0.26 |
| ... shots while Engaged (2 Banes) | 2% |
| Archer turns that start Engaged (it steps away: the Kite turn) | 46% |
| Archer turns it hadn't left its square since its last turn (Patient Hunter) | 73% |
| Archer AP spent moving a turn | 0.44 |
| Paladin AP spent moving a turn (closing in, round 1 mostly) | 0.27 |
| Paladin Flanking Boons a Weapon Action | 0.20 |
| Paladin Opportunity Attacks a turn | 0.00 |
| NPC Strikes aimed at a Paladin / an Archer (each) | 34% / 16% |

### Conditions and Forced Movement on one NPC (a Standard)

| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Share of 1 AP |
|---|---:|---:|---:|---:|---:|---:|
| Hindered (EoT) | 3.42 | 1.72 | 1.24 | **2.12** | 0.26 | 46% |
| Hindered until it moves (Lock & Loose) | 1.13 | 1.23 | 1.01 | **1.13** | 0.20 | 24% |
| Immobilized (EoT) | 9.25 | 6.57 | 6.59 | **7.47** | 0.29 | 160% |
| Immobilized until it escapes (Interact, 1 AP) | 2.74 | 2.57 | 2.13 | **2.48** | 0.25 | 53% |
| Prone (Stand, 1 AP) | 2.51 | 2.43 | 1.84 | **2.26** | 0.26 | 48% |
| Slowed 1 (its next turn) | 2.74 | 2.39 | 1.93 | **2.35** | 0.26 | 50% |
| Slowed 2 (its next turn) | 5.84 | 5.85 | 5.30 | **5.66** | 0.29 | 122% |
| Dazed 1 | 2.74 | 2.39 | 1.93 | **2.35** | 0.26 | 50% |
| Dazed 2 | 5.84 | 5.85 | 5.30 | **5.66** | 0.29 | 122% |
| Staggered (EoT) | 0.00 | 0.00 | 0.00 | **0.00** | 0.00 | 0% |
| Blinded (EoT) | 5.57 | 8.05 | 7.82 | **7.15** | 0.22 | 153% |
| Frightened (EoT) | 1.08 | 1.70 | 1.67 | **1.48** | 0.11 | 32% |
| Taunted by the nearest Paladin (1 round) | 0.69 | 0.99 | 0.85 | **0.84** | 0.08 | 18% |
| Bleed 1d4 (Bo/In) | 4.98 | 4.78 | 4.66 | **4.81** | 0.17 | 103% |
| Bleed 2d6 (Bo/In) | 13.64 | 13.75 | 13.69 | **13.69** | 0.19 | 294% |
| Pushed 1 (from the nearest PC) | 0.36 | 1.48 | 1.43 | **1.09** | 0.23 | 23% |
| Pushed 2 (from the nearest PC) | 0.68 | 1.40 | 0.99 | **1.02** | 0.26 | 22% |
| Pushed 4 (from the nearest PC) | 2.05 | 1.35 | 1.16 | **1.52** | 0.29 | 33% |
| Slid 2 (away from the PCs) | 0.68 | 1.71 | 1.19 | **1.19** | 0.24 | 26% |
| Pulled 2 (toward the nearest Paladin) | 2.98 | 0.03 | 0.43 | **1.15** | 0.27 | 25% |
| Vulnerable 1 (EoT; E1 prices it 1.23) | 0.44 | 0.72 | 0.77 | **0.64** | 0.06 | 14% |

### The same on a PC (what an NPC's condition costs the party), against the Bestiary's severity steps

The Bestiary prices a condition on an NPC Action in steps of damage rating (Mild 1, Moderate 2, Severe 3; one step is 20 to 25% of the Action's damage). For a Standard's 2 AP Special (Basic attack × 2.2 against AD 13) one step is about 2.8 DE.

| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Bestiary | In steps |
|---|---:|---:|---:|---:|---:|---|---:|
| Hindered (EoT) on a Paladin | 5.22 | 0.20 | 0.18 | **1.87** | 0.15 | Mild | 0.7 |
| Hindered (EoT) on an Archer | 0.06 | 0.13 | 0.04 | **0.08** | 0.07 | Mild | 0.0 |
| Pushed 2 on a Paladin | 1.83 | 0.20 | -0.89 | **0.38** | 0.31 | Mild | 0.1 |
| Pushed 2 on an Archer | -1.67 | -2.93 | -2.09 | **-2.23** | 0.27 | Mild | -0.8 |
| Prone on a Paladin | 7.15 | 6.43 | 6.14 | **6.57** | 0.17 | Moderate | 2.3 |
| Prone on an Archer | 5.64 | 6.31 | 5.89 | **5.95** | 0.17 | Moderate | 2.1 |
| Immobilized (EoT) on a Paladin | 13.02 | 2.30 | 1.33 | **5.55** | 0.31 | Moderate | 2.0 |
| Immobilized (EoT) on an Archer | 1.52 | 3.01 | 2.07 | **2.20** | 0.19 | Moderate | 0.8 |
| Slowed 1 on a Paladin | 11.11 | 9.09 | 8.48 | **9.56** | 0.14 | Moderate | 3.4 |
| Slowed 1 on an Archer | 10.18 | 9.77 | 7.78 | **9.24** | 0.16 | Moderate | 3.3 |
| Pushed 4 on a Paladin | 3.49 | 0.51 | -1.24 | **0.92** | 0.35 | Moderate | 0.3 |
| Immobilized until it escapes, on an Archer | 3.21 | 4.47 | 3.38 | **3.69** | 0.20 | Severe | 1.3 |
| Slowed 2 on a Paladin | 25.51 | 17.75 | 16.79 | **20.01** | 0.18 | Severe | 7.1 |

### The map's rules (on against off, rounds 1 to 4)

| Rule | What it costs the party a round | ± (per run) | Who it hits |
|---|---:|---:|---|
| Ranged while Engaged (2 Banes) | 0.08 | 0.01 | the Archers' shots |
| Ranged into melee (1 Bane) | 2.04 | 0.06 | the Archers' shots |
| Cover (creatures in the line, the map's cover) | 1.74 | 0.11 | the Archers' shots |
| Range (far 1 Bane, maximum 2) | 0.77 | 0.03 | the Archers' shots |
| Flanking (both sides) | 4.63 | 0.12 | both sides' melee |

### Builds and Talents (per turn of the changed class, rounds 1 to 4)

| Change | DE a turn | ± | Share of a baseline turn | Note |
|---|---:|---:|---:|---|
| +1 Speed (Archer 6 → 7) | 0.00 | 0.00 | 0% |  |
| -1 Speed (Archer 6 → 5) | 0.01 | 0.01 | 0% |  |
| +1 Speed (Paladin 5 → 6) | 0.05 | 0.01 | 0% |  |
| -1 Speed (Paladin 5 → 4) | -0.06 | 0.01 | 0% |  |
| The Archer stands and shoots when Engaged (no Kite turn) | -1.98 | 0.09 | -9% | the price of stepping away |
| Talent: Opportunity Attack added | 0.00 | 0.00 | 0% | AP kept after its turn are rare: most turns spend 5 |
| Talent: Opportunity Attack, keeping 1 AP for it (its last Weapon Attack dropped) | -1.67 | 0.05 | -7% |  |
| Steady Nerves always on (no Engaged Banes) | 0.05 | 0.00 | 0% | the Archer kites, so it is rarely Engaged when it shoots |
| Steady Nerves, an Archer that doesn't kite | 1.80 | 0.03 | 8% | against the same Archer without it |
| Long Draw (far range no Bane, maximum 1) | 0.46 | 0.02 | 2% |  |
| Rolling Shot 1 for the step away (Evade 1 + a Weapon Attack for the Advance's AP) | 1.92 | 0.08 | 8% | the Evade is worth the AP of the step away on the turns the Archer starts Engaged |
| Every Standard has an Opportunity Attack; the Archer still steps away | -0.45 | 0.07 | -2% | what it costs the party (map npc-reactions standard, elite) |
| Every Standard has an Opportunity Attack; Rolling Shot 1 to step away | 2.37 | 0.06 | 10% | against the Advance away, in the same world |

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
- `growth`: 0
- Areas: the catalogues write `area N` as the creatures reached (Emanation 1: 1.5, 2: 2, 3: 2.5 of a normal fight's 4 enemies) and `allies N` as the allies reached (Aura 1: 1.5, Aura 2: 2.5, Aura 3: 3, you included).
- A "next ..." effect is priced on the Action it most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the Action it names (Smite 2).
- Divine Retribution: Weapon mode 2R, Power mode 3R (the card has 2 / 3R and two columns).
