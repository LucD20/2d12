# The price list of the core rules (pack E1)

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

**Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so spending turns it off. **Momentum** (Lucas, 2026-10-29): +1 after each fight harder than easy; with Momentum you start a fight with half your level in Escalation (rounded up), up to 2; a Rest resets it. In the Standard day (easy, normal, normal, hard) of fights.txt (level 1 party, simulated; 3.5 rounds a fight, 50% of the fights start with Momentum):

| | Escalation 1 or more | 2 or more | 3 or more |
|---|---:|---:|---:|
| Share of the rounds, nothing spent, with Momentum | 86% | 57% | 29% |
| The same without Momentum | 71% | 42% | 15% |
| Uses a fight of an Active that costs it (spent as soon as possible) | 2.96 | 1.29 | 0.56 |
| The same without Momentum | 2.46 | 1.12 | 0.30 |

An Active and a passive compete: a level 1 PC who spends 1 Escalation every round never reaches 2, so its Escalation 2 passive stays off. In the same day an ally goes Down in 19% of the fights and on 65% of the days; a Paladin uses Lay On Hands on 53% of its turns.

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

**Frequency bands** (DE per AP, divided by the price of 1 AP): At-will 0.9 to 1.1, Round and Turn 1 to 1.3, Encounter 1.4 to 2, Daily 2 to 3. An At-will Action takes a Bane on each use after the first, so its first use can sit at the top. A **0 AP** Action is priced per use as a share of a baseline turn. Verdict: **under** or **over** when more than 10% outside its band; **+ E2** when part of its value (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone, Saves) can't be priced before pack E2, so the verdict isn't final.

## 3. The role budgets (every build of `classes/`)

Shares of the baseline PC: damage against the Bestiary's baseline turn of the level (23.3 / 26.6 / 26.6 at levels 1 / 2 / 3), and in brackets against the charter's growth curve (+10% a level: 23.3 / 25.6 / 28.0; pack E3 refits the Bestiary to it). Health against the baseline Pool (31.5 / 34.0 / 36.5).

**Sustained (best)**: the best turn with no Encounter or Daily Action and no Escalation (a Reload Shot turn and heal turns left out). **Nova**: the best turn with an Encounter or Daily Action, at the Escalation it spends or the Escalation Momentum starts a fight with (1 / 1 / 2), whichever is more. **Sustained (real)**: the damage a turn in the simulated Standard day on the turns without an Encounter or Daily Action (openings, Steel Yourself turns and Escalation as the plan spends it, Momentum on); **this is the column the sustained budget is checked on**. **All turns**: the same with the Nova turns in (a once-a-fight Nova is about a third of a PC's turns: fights last about 3 rounds).

| Build | Sustained (best) | Nova | Sustained (real) | All turns (real) | Health | Budget: sustained / Nova / Health | Verdict |
|---|---:|---:|---:|---:|---:|---|---|
| Archer L1 `archer-1` | 24.7 (106%) | 19.2 (82%) | 27.6 (119%) | 24.4 (105%) | 27 (86%) | 100%-105% / 110%-130% / 80%-85% | sustained high; Nova low; Health ok (86%) |
| Archer L2 `archer-2` | 26.8 (101%; 105%) | 19.2 (72%; 75%) | 29.5 (111%; 115%) | 25.9 (98%; 101%) | 29 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained high; Nova low; Health ok (85%) |
| Archer L3 `archer-3` | 26.8 (101%; 96%) | 22.0 (83%; 79%) | 30.2 (114%; 108%) | 26.7 (100%; 95%) | 31 (85%) | 100%-105% / 110%-130% / 80%-85% | sustained ok; Nova low; Health ok (85%) |
| Paladin (book) L1 `paladin-book-1` | 24.5 (105%) | 24.3 (104%) | 25.3 (109%) | 27.2 (117%) | 36 (114%) | 85%-90% / 150%-180% / 120%-130% | sustained high; Nova low; Health low (114%) |
| Paladin (Lay On Hands) L1 `paladin-hands-1` | 20.7 (89%) | 36.5 (157%) | 20.0 (86%) | 26.3 (113%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (124%) |
| Paladin (Lay On Hands) L2 `paladin-hands-2` | 22.7 (85%; 88%) | 37.5 (141%; 146%) | 22.0 (83%; 86%) | 27.6 (104%; 108%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (126%) |
| Paladin (Lay On Hands) L3 `paladin-hands-3` | 22.7 (85%; 81%) | 41.2 (155%; 147%) | 23.0 (86%; 82%) | 28.0 (106%; 100%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained low; Nova ok; Health ok (126%) |
| Paladin (Smite, hold) L1 `paladin-smite-1-hold` | 21.1 (91%) | 38.8 (166%) | 19.8 (85%) | 26.4 (113%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (124%) |
| Paladin (Smite) L1 `paladin-smite-1` | 21.1 (91%) | 38.8 (166%) | 20.0 (86%) | 26.8 (115%) | 39 (124%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (124%) |
| Paladin (Smite) L2 `paladin-smite-2` | 23.5 (89%; 92%) | 40.8 (153%; 159%) | 21.7 (82%; 85%) | 28.4 (107%; 111%) | 43 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (126%) |
| Paladin (Smite) L3 `paladin-smite-3` | 23.5 (89%; 84%) | 44.3 (167%; 158%) | 24.0 (90%; 86%) | 30.5 (115%; 109%) | 46 (126%) | 85%-90% / 150%-180% / 120%-130% | sustained ok; Nova ok; Health ok (126%) |

Roles: Paladin: tank and support: more Health, heals and Defense for allies, Nova damage. Archer: mobile, fragile, constant ranged damage (a future melee class has the top damage: about 1.15). The verdict at level 2 and 3 uses the charter's curve (the Bestiary's level 3 baseline doesn't grow yet).

## 4. Paladin (P1): every Action of `catalogue/paladin-p1.txt` (level 1; efficiency also at levels 2 and 3)

**The P1 main build (pack P1, 2026-10-29; PROPOSED, not in the book yet)**: the defaults of every level 1 to 3 Pick, then two repriced support options (proposals for the Options step). Cards marked (book) are unchanged.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Not priced yet (E2) / notes |
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
| Divine Surge | 0 | round | 1 | 0.0 | 4.0 | 4.0 | - | 17% of a turn | 15% | 15% | on target (0 AP) | an ally's damage (90% that one hits the target in time); costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 3.5 DE a turn |
| Shield of Faith (R) | 1 | turn |  | 0.0 | 5.2 | 5.2 | 5.22 | 1.12 | 0.98 | 0.98 | on target | damage an ally doesn't take (one hit); Reaction: needs AP kept after your turn |
| Aura of Protection | 1 | encounter |  | 0.0 | 6.5 | 6.5 | 6.49 | 1.39 | 1.32 | 1.47 | a little under |  |

**Paladin (P1) passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Font of Mercy |  | 1.5 | 1.5 | 7% | the extra Health on every Rally Point the party uses (in and between fights), from the simulated Standard day: 1.4 a Paladin turn |
| Hallowed Stance | 2 | 7.2 | 4.1 | 18% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Radiant Zeal | 1 | 2.5 | 2.2 | 9% | the first qualifying hit each round |
| Heavy Blows |  | 2.4 | 2.4 | 10% | +1 on each damaging hit of the typical turn's matching Actions |

## 4. Archer: every Action of `catalogue/archer.txt` (level 1; efficiency also at levels 2 and 3)

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Not priced yet (E2) / notes |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | a little over |  |
| Steel Yourself 2 | 2 | round |  | 0.0 | 8.8 | 8.8 | 4.40 | 0.94 | 0.93 | 1.04 | a little under | uses the target's own Rally Points |
| Reload | 1 | at-will |  | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | a cost (of a Reload Shot) |  |
| Double Shot 2 | 2 | round |  | 11.0 | 0.0 | 11.0 | 5.50 | 1.18 | 1.03 | 1.03 | on target |  |
| Double Shot 3 | 3 | round |  | 12.0 | 0.0 | 12.0 | 4.01 | 0.86 | 0.75 | 0.75 | **under** |  |
| Precise Aim 1 | 1 | round |  | 0.0 | 0.5 | 0.5 | 0.52 | 0.11 | 0.10 | 0.10 | **under** |  |
| Precise Aim 2 | 2 | round |  | 0.0 | 1.0 | 1.0 | 0.50 | 0.11 | 0.09 | 0.09 | **under** |  |
| Lock & Loose | 1 | round |  | 5.5 | 0.0 | 5.5 | 5.52 | 1.18 | 1.04 | 1.04 | on target + E2 | E2: Hindered (until it moves); E2: Immobilized |
| Quick Draw (R) | 1 | turn |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | on target | Reaction: needs AP kept after your turn |
| Rolling Shot 1 | 1 | round |  | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | on target + E2 | E2: Evade 1 |
| Rolling Shot 2 | 2 | round |  | 6.0 | 0.0 | 6.0 | 3.01 | 0.65 | 0.57 | 0.57 | **under** + E2 | E2: Evade 3 |
| Wing Clip | 1 | round |  | 7.6 | 0.0 | 7.6 | 7.57 | 1.62 | 1.42 | 1.42 | **over** | E2: Hindered |
| True Shot | 1 | round |  | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | **under** + E2 | E2: ignores Cover |
| Suppressing Fire | 1 | round |  | 0.0 | 0.4 | 0.4 | 0.39 | 0.08 | 0.08 | 0.09 | **under** |  |
| Volley | 3 | encounter |  | 12.3 | 0.0 | 12.3 | 4.10 | 0.88 | 0.77 | 0.77 | **under** + E2 | E2: Hindered |
| Marksman's Shot | 2 | encounter |  | 5.5 | 0.8 | 6.3 | 3.17 | 0.68 | 0.60 | 0.60 | **under** |  |
| Covering Fire | 2 | encounter |  | 0.0 | 2.6 | 2.6 | 1.30 | 0.28 | 0.26 | 0.29 | **under** + E2 | E2: enemies entering take 1d4 |
| Rain of Arrows | 3 | daily |  | 11.4 | 0.0 | 11.4 | 3.81 | 0.82 | 0.72 | 0.72 | **under** + E2 | E2: the area lasts 2 rounds (hazardous terrain) |
| Hunter's Focus | 1 | daily |  | 0.0 | 14.2 | 14.2 | 14.16 | 3.04 | 2.66 | 2.66 | a little over |  |
| Deadeye | 3 | daily |  | 12.4 | 0.0 | 12.4 | 4.14 | 0.89 | 0.78 | 0.78 | **under** + E2 | E2: Prone |
| Steady Aim | 0 | round | 1 | 0.0 | 0.5 | 0.5 | - | 2% of a turn | 2% | 2% | under (0 AP: <8% of a turn) + E2 | E2: range; costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 0.4 DE a turn |
| Vanish | 1 | round | 1 | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | **under** + E2 | E2: Evade 3; E2: the first Strike against you takes 1 Bane; costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 0.0 DE a turn |
| Pinning Shot | 1 | round | 2 | 5.5 | 0.0 | 5.5 | 5.50 | 1.18 | 1.03 | 1.03 | on target + E2 | E2: Immobilized; costs 2 Escalation: 1.29 uses a fight (1.12 without Momentum), 2.0 DE a turn |
| Twin Shot | 1 | round | 3 | 16.0 | 0.0 | 16.0 | 16.05 | 3.44 | 3.02 | 3.02 | **over** | costs 3 Escalation: 0.56 uses a fight (0.30 without Momentum), 2.6 DE a turn |
| Perfect Shot | 0 | round | 3 | 0.0 | 0.0 | 0.0 | - | 0% of a turn | 0% | 0% | under (0 AP: <8% of a turn) | costs 3 Escalation: 0.56 uses a fight (0.30 without Momentum), 0.0 DE a turn |

**Archer passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Marked Quarry |  | 1.8 | 1.8 | 8% | the typical turn's Shot Strikes against the quarry, +1 Boon each |
| Killer's Focus | 2 | 2.5 | 1.4 | 6% | the first qualifying hit each round |
| Patient Hunter | 2 | 1.8 | 1.0 | 4% | the typical turn's Shots; only while you don't leave your square: against the Archer's role (mobile) |
| Long Draw |  | 0.0 | 0.0 | 0% | E2 / not modeled: 0 |
| Steady Nerves | 2 | 0.0 | 0.0 | 0% | E2 / not modeled: no Banes for [Ranged] while Engaged |

## 4. Paladin: every Action of `catalogue/paladin.txt` (level 1; efficiency also at levels 2 and 3)

**The Paladin as the book has it today** (before P1), kept to compare.

| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Not priced yet (E2) / notes |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Weapon Attack | 1 | at-will |  | 5.4 | 0.0 | 5.4 | 5.36 | 1.15 | 1.01 | 1.01 | a little over |  |
| Steel Yourself 2 | 2 | round |  | 0.0 | 8.8 | 8.8 | 4.40 | 0.94 | 0.93 | 1.04 | a little under | uses the target's own Rally Points |
| Steel Yourself 3 | 3 | round |  | 0.0 | 17.6 | 17.6 | 5.87 | 1.26 | 1.24 | 1.38 | on target | uses the target's own Rally Points |
| Smite 1 | 1 | round |  | 7.4 | 0.0 | 7.4 | 7.44 | 1.60 | 1.40 | 1.40 | **over** |  |
| Smite 2 | 2 | round |  | 12.3 | 0.7 | 13.0 | 6.52 | 1.40 | 1.23 | 1.23 | a little over |  |
| Smite 3 | 3 | round |  | 16.9 | 0.7 | 17.6 | 5.86 | 1.26 | 1.10 | 1.10 | on target |  |
| Lay On Hands 1 | 1 | round |  | 0.0 | 8.8 | 8.8 | 8.80 | 1.89 | 1.86 | 2.07 | **over** | uses the target's own Rally Points |
| Lay On Hands 2 | 2 | round |  | 0.0 | 17.6 | 17.6 | 8.80 | 1.89 | 1.86 | 2.07 | **over** | E2: Evade 2; uses the target's own Rally Points |
| Rebuke 1 (R) | 1 | turn |  | 4.5 | 0.0 | 4.5 | 4.49 | 0.96 | 0.85 | 0.85 | a little under | Reaction: needs AP kept after your turn |
| Rebuke 2 (R) | 2 | turn |  | 5.5 | 0.0 | 5.5 | 2.74 | 0.59 | 0.52 | 0.52 | **under** + E2 | E2: Push 1; E2: Push 2; E2: Push 3; Reaction: needs AP kept after your turn |
| Vow of Enmity 1 | 1 | round |  | 1.2 | 1.1 | 2.3 | 2.27 | 0.49 | 0.43 | 0.43 | **under** |  |
| Vow of Enmity 2 | 2 | round |  | 2.5 | 1.4 | 3.9 | 1.96 | 0.42 | 0.37 | 0.37 | **under** |  |
| Vow of Enmity 3 | 3 | round |  | 5.1 | 1.7 | 6.8 | 2.26 | 0.48 | 0.43 | 0.43 | **under** |  |
| Shield of Faith 1 | 1 | round |  | 0.0 | 0.9 | 0.9 | 0.87 | 0.19 | 0.18 | 0.20 | **under** |  |
| Shield of Faith 2 | 2 | round |  | 0.0 | 1.7 | 1.7 | 0.87 | 0.19 | 0.18 | 0.20 | **under** |  |
| Shield of Faith 3 | 3 | round |  | 0.0 | 1.3 | 1.3 | 0.43 | 0.09 | 0.09 | 0.10 | **under** + E2 | E2: Boon on Saves (NPC Save Actions are not modeled) |
| Sacred Weapon 1 | 1 | round |  | 0.0 | 5.0 | 5.0 | 4.97 | 1.07 | 0.94 | 0.94 | on target |  |
| Sacred Weapon 2 | 2 | round |  | 0.0 | 9.9 | 9.9 | 4.97 | 1.07 | 0.94 | 0.94 | on target |  |
| Champion's Challenge 1 | 1 | round |  | 0.0 | 0.6 | 0.6 | 0.63 | 0.14 | 0.13 | 0.14 | **under** |  |
| Champion's Challenge 2 | 2 | round |  | 0.0 | 1.3 | 1.3 | 0.63 | 0.14 | 0.13 | 0.14 | **under** |  |
| Word of Radiance 2 | 2 | encounter |  | 13.7 | 0.0 | 13.7 | 6.84 | 1.47 | 1.29 | 1.29 | on target + E2 | E2: Prone |
| Word of Radiance 3 | 3 | encounter |  | 22.4 | 0.0 | 22.4 | 7.48 | 1.61 | 1.41 | 1.41 | on target + E2 | E2: Prone |
| Divine Retribution Weapon (R) | 2 | encounter |  | 12.3 | 0.0 | 12.3 | 6.13 | 1.31 | 1.15 | 1.15 | a little under | Reaction: needs AP kept after your turn |
| Divine Retribution Power (R) | 3 | encounter |  | 11.0 | 0.0 | 11.0 | 3.66 | 0.79 | 0.69 | 0.69 | **under** | Reaction: needs AP kept after your turn |
| Aura of Protection 1 | 1 | encounter |  | 0.0 | 2.2 | 2.2 | 2.16 | 0.46 | 0.44 | 0.49 | **under** |  |
| Aura of Protection 2 | 2 | encounter |  | 0.0 | 5.2 | 5.2 | 2.61 | 0.56 | 0.53 | 0.59 | **under** |  |
| Aura of Protection 3 | 3 | encounter |  | 0.0 | 5.2 | 5.2 | 1.74 | 0.37 | 0.35 | 0.39 | **under** + E2 | E2: Boon on Saves (NPC Save Actions are not modeled) |
| Miraculous Recovery 2 | 2 | daily |  | 0.0 | 17.6 | 17.6 | 8.80 | 1.89 | 1.86 | 2.07 | a little under + E2 | E2: ends an effect |
| Miraculous Recovery 3 | 3 | daily |  | 0.0 | 26.4 | 26.4 | 8.80 | 1.89 | 1.86 | 2.07 | a little under + E2 | E2: ends an effect |
| Consecrated Ground 2 | 2 | daily |  | 0.0 | 21.7 | 21.7 | 10.85 | 2.33 | 2.08 | 2.14 | on target |  |
| Consecrated Ground 3 | 3 | daily |  | 0.0 | 45.2 | 45.2 | 15.08 | 3.24 | 2.89 | 2.97 | a little over |  |
| Divine Intervention 1 (R) | 1 | daily |  | 0.0 | 22.8 | 22.8 | 22.85 | 4.90 | 4.90 | 4.90 | **over** | a Down undone or prevented: 35 DE a use, x 65% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Divine Intervention 2 (R) | 2 | daily |  | 0.0 | 31.6 | 31.6 | 15.82 | 3.40 | 3.38 | 3.49 | **over** | a Down undone or prevented: 35 DE a use, x 65% (how often an ally goes Down in a day); Reaction: needs AP kept after your turn |
| Call to Arms | 0 | round | 1 | 0.0 | 15.4 | 15.4 | - | 66% of a turn | 66% | 70% | **over** (0 AP: >25% of a turn) | a Down undone or prevented: 35 DE a use, x 19% (how often an ally goes Down in a fight); costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 4.4 DE a turn |
| Divine Surge | 0 | round | 1 | 0.0 | 4.5 | 4.5 | - | 19% of a turn | 17% | 17% | on target (0 AP) | costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 3.9 DE a turn |
| Hand of Mercy | 1 | round | 1 | 0.0 | 0.0 | 0.0 | 0.00 | 0.00 | 0.00 | 0.00 | **under** + E2 | E2: ends an effect; costs 1 Escalation: 2.96 uses a fight (2.46 without Momentum), 0.0 DE a turn |
| Judgment | 1 | round | 2 | 5.6 | 0.0 | 5.6 | 5.59 | 1.20 | 1.05 | 1.05 | on target + E2 | E2: Hindered; costs 2 Escalation: 1.29 uses a fight (1.12 without Momentum), 2.1 DE a turn |
| Sanctified Ground | 1 | round | 2 | 0.0 | 2.6 | 2.6 | 2.60 | 0.56 | 0.53 | 0.59 | **under** | costs 2 Escalation: 1.29 uses a fight (1.12 without Momentum), 1.0 DE a turn |

**Paladin passives** (DE a turn, weighted by the share of the rounds at its Escalation):

| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |
|---|---:|---:|---:|---:|---|
| Hallowed Stance | 2 | 7.2 | 4.1 | 18% | Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square |
| Avenger's Oath | 2 | 0.2 | 0.1 | 0% | about once a fight (a third of the turns) |
| Aegis |  | 0.0 | 0.0 | 0% | E2 / not modeled: 1 |
| Divine Vigil | 2 | 0.0 | 0.0 | 0% | E2 / not modeled: Boon on Saves against Fear |
| Mercy's Reward |  | 3.1 | 3.1 | 14% | 6.0 a Smite after a Lay On Hands that heals; weighted by Lay On Hands on 53% of the turns |
| Profane Judgment |  | 0.0 | 0.0 | 0% | E2 / not modeled: Enfeebled 1 on Profane creatures |

## Assumptions

- `heal`: 1.1
- `downTurns`: 1.5
- `vulnAttacks`: 2.5
- `quarryShare`: 0.3
- `rangedShare`: 0.3
- `othersShare`: 0.75
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
