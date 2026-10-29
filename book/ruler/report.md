# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/classes/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

## Archer (ranged damage), `classes/archer-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the lowest Escalation the turn needs ("Esc": its passives at that Escalation too), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Lock & Loose + attack (plan) | 0 | 26.5 | 24.8 | 22.9 | 27.6 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 41.9 | 39.0 | 36.1 | 39.0 | 5 | 3 | Double Shot 3, Twin Shot, Lock & Loose |  |
| Reload Shot | 0 | 29.3 | 27.7 | 25.9 | 30.6 | 5 | 3 | Double Shot 3, Weapon Attack, Lock & Loose (reload shot) |  |
| Reload and shoot | 0 | 16.4 | 15.6 | 14.7 | 17.8 | 5 | 2 | Reload, Double Shot 3, Lock & Loose (reload shot) |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Lock & Loose + attack · round 3+: Twin

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.0 | 1 / 1.0 | 14 / 14.5 |
| Grunt | 31 | 13 | 2 | 4.9 | 2 / 2.0 | 6 / 6.1 |
| Standard | 57 | 13 | 2 | 7.7 | 3 / 2.9 | 4 / 4.1 |
| Elite | 120 | 14 | 3 | 16.8 | 5 / 4.7 | 2 / 2.2 |

## Archer (ranged damage), `classes/archer-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the lowest Escalation the turn needs ("Esc": its passives at that Escalation too), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.8 | 41.5 | 38.2 | 41.5 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.0 | 1 / 1.0 | 15 / 15.5 |
| Grunt | 31 | 13 | 2 | 4.9 | 2 / 2.0 | 6 / 6.5 |
| Standard | 57 | 13 | 2 | 7.7 | 3 / 2.8 | 4 / 4.4 |
| Elite | 120 | 14 | 3 | 16.8 | 4 / 4.5 | 2 / 2.3 |

## Paladin (tank / support), `classes/paladin-1.txt`

Health 36 (Body 21 + Mind 15) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the lowest Escalation the turn needs ("Esc": its passives at that Escalation too), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Smite and two attacks | 0 | 24.2 | 22.4 | 20.6 | 22.4 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and two attacks | 0 | 26.5 | 24.7 | 22.9 | 24.7 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Surge Smite 3 (plan, **best**) | 1 | 30.9 | 29.2 | 27.4 | 29.2 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Radiance opening (plan) | 0 | 25.9 | 24.5 | 23.0 | 24.5 | 5 | 2 | Word of Radiance 2, Smite 2, Weapon Attack |  |
| Surge | 1 | 28.6 | 26.9 | 25.1 | 26.9 | 4 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack |  |
| Heal (when an ally is hurt) | 1 | 23.4 | 22.1 | 20.8 | 22.1 | 4 | 2 | Lay On Hands 1, Divine Surge, Smite 2, Weapon Attack |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.7 | 19.1 | 18.3 | 19.1 | 5 | 1 | Steel Yourself 2, Divine Surge, Smite 3 |  |

Plan: round 1: Radiance opening · round 2+: Surge Smite 3 · when an ally is below 50% Health: Heal

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 2 / 1.8 | 17 / 17.0 |
| Standard | 57 | 13 | 2 | 6.9 | 3 / 2.6 | 8 / 7.8 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.1 | 3 / 3.1 |

## Paladin (support) (tank / support), `classes/paladin-2-support.txt`

Health 39 (Body 23 + Mind 16) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the lowest Escalation the turn needs ("Esc": its passives at that Escalation too), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Shield | 0 | 24.2 | 22.4 | 20.6 | 22.4 | 5 | 3 | Shield of Faith 1, Smite 2, Weapon Attack, Weapon Attack |  |
| Shield surge (plan) | 1 | 28.6 | 26.9 | 25.1 | 26.9 | 5 | 3 | Shield of Faith 1, Divine Surge, Smite 2, Weapon Attack, Weapon Attack |  |
| Shield 2 surge | 1 | 19.7 | 19.1 | 18.3 | 19.1 | 5 | 1 | Shield of Faith 2, Divine Surge, Smite 3 |  |
| Surge Smite 3 (**best**) | 1 | 30.9 | 29.2 | 27.4 | 29.2 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Vow | 0 | 28.6 | 26.4 | 24.1 | 26.4 | 5 | 3 | Vow of Enmity 1, Smite 2, Weapon Attack, Weapon Attack |  |
| Radiance opening (plan) | 0 | 25.9 | 24.5 | 23.0 | 24.5 | 5 | 2 | Word of Radiance 2, Smite 2, Weapon Attack |  |
| Heal (when an ally is hurt) | 1 | 23.4 | 22.1 | 20.8 | 22.1 | 4 | 2 | Lay On Hands 1, Divine Surge, Smite 2, Weapon Attack |  |
| Steel | 1 | 19.7 | 19.1 | 18.3 | 19.1 | 5 | 1 | Steel Yourself 2, Divine Surge, Smite 3 |  |

Plan: round 1: Radiance opening · round 2+: Shield surge · when an ally is below 50% Health: Heal

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 2 / 1.8 | 18 / 18.7 |
| Standard | 57 | 13 | 2 | 6.9 | 3 / 2.7 | 8 / 8.4 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.4 | 3 / 3.4 |

## Paladin (tank / support), `classes/paladin-2.txt`

Health 39 (Body 23 + Mind 16) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the lowest Escalation the turn needs ("Esc": its passives at that Escalation too), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Sacred | 0 | 29.4 | 27.3 | 25.2 | 27.3 | 5 | 3 | Sacred Weapon 1, Smite 2, Weapon Attack, Weapon Attack |  |
| Sacred surge (plan, **best**) | 1 | 34.8 | 32.8 | 30.6 | 32.8 | 5 | 3 | Sacred Weapon 1, Divine Surge, Smite 2, Weapon Attack, Weapon Attack |  |
| Sacred Smite 3 | 1 | 31.6 | 30.1 | 28.7 | 30.1 | 5 | 2 | Sacred Weapon 1, Divine Surge, Smite 3, Weapon Attack |  |
| Surge Smite 3 | 1 | 30.9 | 29.2 | 27.4 | 29.2 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Vow | 0 | 28.6 | 26.4 | 24.1 | 26.4 | 5 | 3 | Vow of Enmity 1, Smite 2, Weapon Attack, Weapon Attack |  |
| Radiance opening (plan) | 0 | 25.9 | 24.5 | 23.0 | 24.5 | 5 | 2 | Word of Radiance 2, Smite 2, Weapon Attack |  |
| Heal (when an ally is hurt) | 1 | 23.4 | 22.1 | 20.8 | 22.1 | 4 | 2 | Lay On Hands 1, Divine Surge, Smite 2, Weapon Attack |  |
| Steel | 1 | 19.7 | 19.1 | 18.3 | 19.1 | 5 | 1 | Steel Yourself 2, Divine Surge, Smite 3 |  |

Plan: round 1: Radiance opening · round 2+: Sacred surge · when an ally is below 50% Health: Heal

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 2 / 1.8 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.5 | 8 / 8.4 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 4.7 | 3 / 3.4 |

## Party fights (Paladin, Paladin, Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin Down | Paladin Down | Archer Down | Archer Down |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 28% | 2% | 2 | 0% | 0% | 0% | 1% |
| 2 Elites | 4 | 3 / 3.2 / 4 | 99% | 36% | 15% | 2 | 5% | 4% | 5% | 5% |
| Elite + 2 Standards | 4 | 3 / 3.0 / 3 | 100% | 32% | 6% | 2 | 2% | 2% | 2% | 2% |
| 8 Grunts | 4 | 4 / 3.5 / 4 | 100% | 34% | 0% | 2 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.1 / 3 | 100% | 30% | 2% | 2 | 0% | 0% | 0% | 1% |
| 6 Standards (CV 6, hard) | 6 | 4 / 4.4 / 5 | 98% | 44% | 23% | 2 | 7% | 9% | 8% | 8% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody moves, uses Rally Points on their own or uses Reactions. Escalation is 0 in round 1, then +1 a round (up to 3).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given** and **Vulnerable given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points). Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 73% · a PC Down during the day 68% · Downs a day 1.80 · Rally Points left at the end 19% · Health at the end 53%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.5 | 20% | 0% |
| 2: 4 standard | 100% | 3.0 | 25% | 2% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 29% | 10% |
| 4: 2 elite, 2 standard | 73% | 4.8 | 61% | 66% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 296.7 | 275.3 |
| Damage a turn (its own turns) | 27.1 | 24.6 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.0 | 11.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 85.1 | 49.9 |
| Reduced (Hallowed Stance) | 5.9 | 0.0 |
| Damage taken | 79.2 | 49.9 |
| Damage taken a round of combat | 5.9 | 3.7 |
| Times Down | 0.44 | 0.46 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.28 | 0.65 |
| Rally Points used through an ally's Lay On Hands | 1.61 | 1.57 |
| Rally Points used between fights | 3.92 | 3.05 |
| Rally Points left | 1.19 | 1.73 |
| **Buffs:** healed allies (Lay On Hands) | 25.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.95 |
| **Debuff:** Immobilized (times) | 0.00 | 2.04 |
| **Debuff:** Prone (times) | 0.96 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.58 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 55% · a PC Down during the day 83% · Downs a day 2.54 · Rally Points left at the end 24% · Health at the end 40%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.7 | 20% | 0% |
| 2: 4 standard | 100% | 3.1 | 26% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 32% | 17% |
| 4: 2 elite, 2 standard | 55% | 4.9 | 70% | 79% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 313.2 | 300.2 |
| Damage a turn (its own turns) | 27.7 | 26.2 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.4 | 11.4 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 101.7 | 60.2 |
| Reduced (Hallowed Stance) | 6.9 | 0.0 |
| Damage taken | 94.8 | 60.2 |
| Damage taken a round of combat | 6.8 | 4.3 |
| Times Down | 0.60 | 0.67 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.49 | 0.76 |
| Rally Points used through an ally's Lay On Hands | 1.71 | 1.48 |
| Rally Points used between fights | 3.80 | 2.98 |
| Rally Points left | 2.00 | 1.79 |
| **Buffs:** healed allies (Lay On Hands) | 28.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.27 |
| **Debuff:** Hindered (times) | 0.00 | 2.07 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.67 |
| **Debuff:** Immobilized (times) | 0.00 | 1.19 |
| **Debuff:** Prone (times) | 0.96 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.59 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 55% · a PC Down during the day 83% · Downs a day 2.57 · Rally Points left at the end 24% · Health at the end 39%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.7 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 27% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 32% | 18% |
| 4: 2 elite, 2 standard | 55% | 5.0 | 70% | 80% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 296.5 | 317.1 | 305.4 |
| Damage a turn (its own turns) | 25.9 | 27.8 | 26.4 |
| Share of the party's damage (%) | 24 | 26 | 25 |
| Turns taken | 11.5 | 11.5 | 11.5 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 102.7 | 102.5 | 60.1 |
| Reduced (Hallowed Stance) | 7.1 | 6.9 | 0.0 |
| Damage taken | 95.7 | 95.6 | 60.1 |
| Damage taken a round of combat | 6.8 | 6.8 | 4.3 |
| Times Down | 0.60 | 0.62 | 0.67 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 1.53 | 1.54 | 0.67 |
| Rally Points used through an ally's Lay On Hands | 1.71 | 1.68 | 1.50 |
| Rally Points used between fights | 3.84 | 3.82 | 2.97 |
| Rally Points left | 1.93 | 1.96 | 1.85 |
| **Buffs:** healed allies (Lay On Hands) | 28.7 | 29.1 | 0.0 |
| Defense given (damage it stopped) | 1.4 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.8 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.30 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 2.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 1.67 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.18 |
| **Debuff:** Prone (times) | 0.96 | 0.98 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.55 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 41% · a PC Down during the day 90% · Downs a day 3.40 · Rally Points left at the end 7% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 34% | 1% |
| 2: 6 standard | 96% | 4.5 | 40% | 29% |
| 3: 2 elite | 99% | 3.3 | 35% | 27% |
| 4: 1 elite, 4 standard | 43% | 4.3 | 65% | 85% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 319.1 | 330.9 |
| Damage a turn (its own turns) | 26.2 | 26.3 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 12.2 | 12.5 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 110.9 | 66.8 |
| Reduced (Hallowed Stance) | 10.5 | 0.0 |
| Damage taken | 100.4 | 66.8 |
| Damage taken a round of combat | 6.7 | 4.4 |
| Times Down | 0.86 | 0.85 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.76 | 0.73 |
| Rally Points used through an ally's Lay On Hands | 2.07 | 2.36 |
| Rally Points used between fights | 3.78 | 3.18 |
| Rally Points left | 0.38 | 0.73 |
| **Buffs:** healed allies (Lay On Hands) | 34.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.66 |
| **Debuff:** Immobilized (times) | 0.00 | 2.46 |
| **Debuff:** Prone (times) | 0.80 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 38% · a PC Down during the day 93% · Downs a day 3.66 · Rally Points left at the end 10% · Health at the end 18%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 34% | 0% |
| 2: 6 standard | 95% | 4.9 | 42% | 34% |
| 3: 2 elite | 97% | 3.5 | 39% | 38% |
| 4: 1 elite, 4 standard | 41% | 4.6 | 69% | 89% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 339.2 | 368.4 |
| Damage a turn (its own turns) | 26.4 | 28.2 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 12.9 | 13.0 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 128.9 | 75.0 |
| Reduced (Hallowed Stance) | 12.4 | 0.0 |
| Damage taken | 116.5 | 75.0 |
| Damage taken a round of combat | 7.3 | 4.7 |
| Times Down | 0.91 | 0.92 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.05 | 0.81 |
| Rally Points used through an ally's Lay On Hands | 2.19 | 2.18 |
| Rally Points used between fights | 3.98 | 3.21 |
| Rally Points left | 0.77 | 0.79 |
| **Buffs:** healed allies (Lay On Hands) | 38.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.08 |
| **Debuff:** Hindered (times) | 0.00 | 2.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.53 |
| **Debuff:** Immobilized (times) | 0.00 | 1.05 |
| **Debuff:** Prone (times) | 0.76 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 34% · a PC Down during the day 94% · Downs a day 3.77 · Rally Points left at the end 10% · Health at the end 16%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 34% | 0% |
| 2: 6 standard | 94% | 4.9 | 43% | 33% |
| 3: 2 elite | 97% | 3.5 | 40% | 35% |
| 4: 1 elite, 4 standard | 37% | 4.6 | 70% | 91% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 318.6 | 340.5 | 369.5 |
| Damage a turn (its own turns) | 25.0 | 26.5 | 28.2 |
| Share of the party's damage (%) | 23 | 24 | 26 |
| Turns taken | 12.8 | 12.9 | 13.0 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 129.2 | 129.4 | 76.2 |
| Reduced (Hallowed Stance) | 12.9 | 12.8 | 0.0 |
| Damage taken | 116.3 | 116.6 | 76.2 |
| Damage taken a round of combat | 7.3 | 7.3 | 4.8 |
| Times Down | 0.94 | 0.92 | 0.96 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 2.03 | 2.04 | 0.82 |
| Rally Points used through an ally's Lay On Hands | 2.16 | 2.22 | 2.20 |
| Rally Points used between fights | 3.93 | 3.92 | 3.17 |
| Rally Points left | 0.88 | 0.82 | 0.81 |
| **Buffs:** healed allies (Lay On Hands) | 39.0 | 38.8 | 0.0 |
| Defense given (damage it stopped) | 2.2 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.2 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.04 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 2.58 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 1.49 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.07 |
| **Debuff:** Prone (times) | 0.81 | 0.78 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.36 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 68% · a PC Down during the day 76% · Downs a day 2.16 · Rally Points left at the end 26% · Health at the end 47%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 28% | 2% |
| 2: 2 elite, 2 standard | 75% | 4.8 | 59% | 60% |
| 3: 6 standard | 90% | 4.6 | 45% | 45% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 234.4 | 239.0 |
| Damage a turn (its own turns) | 26.2 | 25.6 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.1 | 9.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 83.4 | 49.5 |
| Reduced (Hallowed Stance) | 8.1 | 0.0 |
| Damage taken | 75.3 | 49.5 |
| Damage taken a round of combat | 6.8 | 4.5 |
| Times Down | 0.52 | 0.56 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.71 | 0.79 |
| Rally Points used through an ally's Lay On Hands | 1.51 | 1.66 |
| Rally Points used between fights | 2.90 | 2.48 |
| Rally Points left | 1.87 | 2.07 |
| **Buffs:** healed allies (Lay On Hands) | 25.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.9 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.24 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.57 |
| **Debuff:** Immobilized (times) | 0.00 | 1.79 |
| **Debuff:** Prone (times) | 0.58 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 49% · a PC Down during the day 89% · Downs a day 2.85 · Rally Points left at the end 39% · Health at the end 35%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 29% | 3% |
| 2: 2 elite, 2 standard | 55% | 4.9 | 71% | 80% |
| 3: 6 standard | 90% | 5.0 | 46% | 50% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 223.3 | 233.6 |
| Damage a turn (its own turns) | 26.8 | 26.7 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 8.5 | 8.5 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 91.0 | 54.5 |
| Reduced (Hallowed Stance) | 8.4 | 0.0 |
| Damage taken | 82.6 | 54.5 |
| Damage taken a round of combat | 8.0 | 5.4 |
| Times Down | 0.69 | 0.74 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.69 | 0.82 |
| Rally Points used through an ally's Lay On Hands | 1.38 | 1.34 |
| Rally Points used between fights | 2.49 | 2.06 |
| Rally Points left | 3.43 | 2.78 |
| **Buffs:** healed allies (Lay On Hands) | 24.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.9 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.05 |
| **Debuff:** Hindered (times) | 0.00 | 1.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.02 |
| **Debuff:** Immobilized (times) | 0.00 | 0.69 |
| **Debuff:** Prone (times) | 0.54 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.94 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 53% · a PC Down during the day 86% · Downs a day 2.71 · Rally Points left at the end 36% · Health at the end 38%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 29% | 2% |
| 2: 2 elite, 2 standard | 59% | 5.0 | 69% | 78% |
| 3: 6 standard | 89% | 4.9 | 45% | 45% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 218.0 | 232.3 | 244.8 |
| Damage a turn (its own turns) | 25.5 | 26.9 | 26.9 |
| Share of the party's damage (%) | 23 | 25 | 26 |
| Turns taken | 8.7 | 8.8 | 8.9 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 91.8 | 92.2 | 55.1 |
| Reduced (Hallowed Stance) | 8.4 | 8.4 | 0.0 |
| Damage taken | 83.4 | 83.8 | 55.1 |
| Damage taken a round of combat | 7.9 | 7.9 | 5.3 |
| Times Down | 0.65 | 0.65 | 0.70 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 1.74 | 1.74 | 0.87 |
| Rally Points used through an ally's Lay On Hands | 1.42 | 1.45 | 1.37 |
| Rally Points used between fights | 2.60 | 2.60 | 2.17 |
| Rally Points left | 3.24 | 3.22 | 2.59 |
| **Buffs:** healed allies (Lay On Hands) | 25.0 | 25.2 | 0.0 |
| Defense given (damage it stopped) | 1.2 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.07 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 1.71 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 1.05 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 0.72 |
| **Debuff:** Prone (times) | 0.54 | 0.60 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.96 |
