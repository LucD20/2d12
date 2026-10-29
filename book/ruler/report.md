# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/classes/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

## Archer (ranged damage), `classes/archer-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

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
| Elite | 120 | 14 | 3 | 16.8 | 5 / 5.3 | 2 / 2.2 |

## Archer (ranged damage), `classes/archer-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

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
| Elite | 120 | 14 | 3 | 16.8 | 5 / 5.1 | 2 / 2.3 |

## Paladin (tank / support), `classes/paladin-1.txt`

Health 36 (Body 21 + Mind 15) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

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

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

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

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

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
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 28% | 2% | 2 | 1% | 0% | 1% | 1% |
| 2 Elites | 4 | 3 / 3.1 / 4 | 100% | 37% | 17% | 2 | 5% | 5% | 4% | 5% |
| Elite + 2 Standards | 4 | 3 / 3.1 / 3 | 100% | 32% | 8% | 2 | 3% | 3% | 2% | 2% |
| 8 Grunts | 4 | 4 / 3.5 / 4 | 100% | 35% | 1% | 2 | 0% | 1% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.1 / 3 | 100% | 31% | 1% | 2 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.7 / 5 | 94% | 49% | 30% | 2 | 14% | 14% | 12% | 12% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody moves, uses Rally Points on their own or uses Reactions. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given** and **Vulnerable given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points). Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 70% · a PC Down during the day 70% · Downs a day 1.84 · Rally Points left at the end 20% · Health at the end 51%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.5 | 20% | 0% |
| 2: 4 standard | 100% | 3.0 | 26% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 28% | 8% |
| 4: 2 elite, 2 standard | 70% | 4.7 | 62% | 67% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 295.5 | 278.1 |
| Damage a turn (its own turns) | 27.3 | 24.9 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.9 | 11.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 83.7 | 49.3 |
| Reduced (Hallowed Stance) | 2.9 | 0.0 |
| Damage taken | 80.7 | 49.3 |
| Damage taken a round of combat | 6.1 | 3.7 |
| Times Down | 0.46 | 0.46 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.34 | 0.64 |
| Rally Points used through an ally's Lay On Hands | 1.59 | 1.55 |
| Rally Points used between fights | 3.93 | 2.97 |
| Rally Points left | 1.15 | 1.85 |
| **Buffs:** healed allies (Lay On Hands) | 25.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.5 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.01 |
| **Debuff:** Immobilized (times) | 0.00 | 2.00 |
| **Debuff:** Prone (times) | 0.97 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 50% · a PC Down during the day 85% · Downs a day 2.72 · Rally Points left at the end 24% · Health at the end 36%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.7 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 27% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 31% | 14% |
| 4: 2 elite, 2 standard | 50% | 4.9 | 73% | 81% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 312.1 | 302.6 |
| Damage a turn (its own turns) | 28.0 | 26.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.2 | 11.4 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 99.8 | 60.5 |
| Reduced (Hallowed Stance) | 3.0 | 0.0 |
| Damage taken | 96.8 | 60.5 |
| Damage taken a round of combat | 7.0 | 4.4 |
| Times Down | 0.68 | 0.68 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.50 | 0.74 |
| Rally Points used through an ally's Lay On Hands | 1.63 | 1.46 |
| Rally Points used between fights | 3.87 | 2.91 |
| Rally Points left | 2.00 | 1.90 |
| **Buffs:** healed allies (Lay On Hands) | 28.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (times) | 0.00 | 2.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.67 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Prone (times) | 0.96 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.58 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 50% · a PC Down during the day 86% · Downs a day 2.73 · Rally Points left at the end 24% · Health at the end 36%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.7 | 20% | 0% |
| 2: 4 standard | 100% | 3.1 | 27% | 4% |
| 3: 1 elite, 2 standard | 99% | 3.2 | 32% | 18% |
| 4: 2 elite, 2 standard | 50% | 4.9 | 73% | 82% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 292.5 | 316.7 | 306.5 |
| Damage a turn (its own turns) | 26.2 | 28.0 | 26.5 |
| Share of the party's damage (%) | 24 | 26 | 25 |
| Turns taken | 11.2 | 11.3 | 11.5 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 100.0 | 100.7 | 60.3 |
| Reduced (Hallowed Stance) | 3.1 | 3.2 | 0.0 |
| Damage taken | 96.9 | 97.5 | 60.3 |
| Damage taken a round of combat | 7.0 | 7.0 | 4.3 |
| Times Down | 0.69 | 0.69 | 0.68 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 1.45 | 1.47 | 0.73 |
| Rally Points used through an ally's Lay On Hands | 1.70 | 1.69 | 1.45 |
| Rally Points used between fights | 3.83 | 3.85 | 2.91 |
| Rally Points left | 2.01 | 1.98 | 1.91 |
| **Buffs:** healed allies (Lay On Hands) | 28.6 | 28.5 | 0.0 |
| Defense given (damage it stopped) | 1.3 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.8 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.26 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 2.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 1.70 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.14 |
| **Debuff:** Prone (times) | 0.99 | 0.94 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.55 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 36% · a PC Down during the day 90% · Downs a day 3.47 · Rally Points left at the end 9% · Health at the end 17%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 35% | 1% |
| 2: 6 standard | 95% | 4.4 | 41% | 30% |
| 3: 2 elite | 99% | 3.1 | 34% | 22% |
| 4: 1 elite, 4 standard | 38% | 4.2 | 66% | 86% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 314.1 | 328.7 |
| Damage a turn (its own turns) | 26.4 | 26.3 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 11.9 | 12.4 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 105.2 | 66.5 |
| Reduced (Hallowed Stance) | 4.3 | 0.0 |
| Damage taken | 100.8 | 66.5 |
| Damage taken a round of combat | 6.8 | 4.5 |
| Times Down | 0.90 | 0.84 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.66 | 0.68 |
| Rally Points used through an ally's Lay On Hands | 2.09 | 2.35 |
| Rally Points used between fights | 3.79 | 3.15 |
| Rally Points left | 0.46 | 0.82 |
| **Buffs:** healed allies (Lay On Hands) | 34.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.1 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.63 |
| **Debuff:** Immobilized (times) | 0.00 | 2.50 |
| **Debuff:** Prone (times) | 0.75 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.41 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 32% · a PC Down during the day 92% · Downs a day 3.76 · Rally Points left at the end 10% · Health at the end 15%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 35% | 1% |
| 2: 6 standard | 94% | 4.7 | 43% | 32% |
| 3: 2 elite | 97% | 3.4 | 39% | 33% |
| 4: 1 elite, 4 standard | 35% | 4.4 | 70% | 89% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 336.6 | 359.3 |
| Damage a turn (its own turns) | 26.8 | 27.7 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 12.6 | 12.9 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 123.4 | 75.1 |
| Reduced (Hallowed Stance) | 5.3 | 0.0 |
| Damage taken | 118.1 | 75.1 |
| Damage taken a round of combat | 7.6 | 4.9 |
| Times Down | 0.96 | 0.92 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.92 | 0.78 |
| Rally Points used through an ally's Lay On Hands | 2.32 | 2.18 |
| Rally Points used between fights | 3.95 | 3.17 |
| Rally Points left | 0.80 | 0.87 |
| **Buffs:** healed allies (Lay On Hands) | 40.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.03 |
| **Debuff:** Hindered (times) | 0.00 | 2.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.53 |
| **Debuff:** Immobilized (times) | 0.00 | 1.04 |
| **Debuff:** Prone (times) | 0.76 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 31% · a PC Down during the day 93% · Downs a day 3.78 · Rally Points left at the end 11% · Health at the end 15%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 35% | 1% |
| 2: 6 standard | 93% | 4.8 | 43% | 32% |
| 3: 2 elite | 97% | 3.4 | 39% | 35% |
| 4: 1 elite, 4 standard | 35% | 4.4 | 70% | 89% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 322.0 | 338.6 | 361.8 |
| Damage a turn (its own turns) | 25.4 | 26.8 | 27.8 |
| Share of the party's damage (%) | 23 | 24 | 26 |
| Turns taken | 12.7 | 12.7 | 13.0 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 124.0 | 122.7 | 74.9 |
| Reduced (Hallowed Stance) | 5.7 | 5.2 | 0.0 |
| Damage taken | 118.4 | 117.4 | 74.9 |
| Damage taken a round of combat | 7.6 | 7.5 | 4.8 |
| Times Down | 0.96 | 0.95 | 0.93 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 1.97 | 1.92 | 0.79 |
| Rally Points used through an ally's Lay On Hands | 2.34 | 2.30 | 2.15 |
| Rally Points used between fights | 3.89 | 3.94 | 3.15 |
| Rally Points left | 0.80 | 0.84 | 0.91 |
| **Buffs:** healed allies (Lay On Hands) | 39.9 | 39.8 | 0.0 |
| Defense given (damage it stopped) | 1.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.9 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.04 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 2.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 1.55 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.07 |
| **Debuff:** Prone (times) | 0.79 | 0.81 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.34 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1** (paladin-1, paladin-1, archer-1, archer-1; NPCs of level 1): the day cleared 65% · a PC Down during the day 77% · Downs a day 2.27 · Rally Points left at the end 27% · Health at the end 45%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 29% | 2% |
| 2: 2 elite, 2 standard | 73% | 4.7 | 61% | 63% |
| 3: 6 standard | 89% | 4.5 | 48% | 46% |

| Per PC, over the day | Paladin `paladin-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 229.8 | 238.8 |
| Damage a turn (its own turns) | 26.5 | 25.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 8.8 | 9.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 80.1 | 48.7 |
| Reduced (Hallowed Stance) | 3.3 | 0.0 |
| Damage taken | 76.8 | 48.7 |
| Damage taken a round of combat | 7.1 | 4.6 |
| Times Down | 0.59 | 0.55 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.62 | 0.75 |
| Rally Points used through an ally's Lay On Hands | 1.47 | 1.60 |
| Rally Points used between fights | 3.00 | 2.44 |
| Rally Points left | 1.91 | 2.21 |
| **Buffs:** healed allies (Lay On Hands) | 24.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.1 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.21 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.52 |
| **Debuff:** Immobilized (times) | 0.00 | 1.81 |
| **Debuff:** Prone (times) | 0.60 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 2** (paladin-2, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 44% · a PC Down during the day 88% · Downs a day 2.94 · Rally Points left at the end 41% · Health at the end 31%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 29% | 2% |
| 2: 2 elite, 2 standard | 49% | 4.9 | 73% | 81% |
| 3: 6 standard | 89% | 4.8 | 47% | 45% |

| Per PC, over the day | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 217.8 | 227.7 |
| Damage a turn (its own turns) | 27.1 | 26.7 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 8.2 | 8.4 |
| Health Pool | 39 | 29 |
| Damage aimed at it (before reduction) | 86.3 | 53.8 |
| Reduced (Hallowed Stance) | 3.5 | 0.0 |
| Damage taken | 82.9 | 53.8 |
| Damage taken a round of combat | 8.3 | 5.5 |
| Times Down | 0.74 | 0.73 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.61 | 0.79 |
| Rally Points used through an ally's Lay On Hands | 1.34 | 1.25 |
| Rally Points used between fights | 2.41 | 1.97 |
| Rally Points left | 3.64 | 2.99 |
| **Buffs:** healed allies (Lay On Hands) | 23.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.8 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.00 |
| **Debuff:** Hindered (times) | 0.00 | 1.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.99 |
| **Debuff:** Immobilized (times) | 0.00 | 0.68 |
| **Debuff:** Prone (times) | 0.54 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.90 |

**Level 2, one support Paladin** (paladin-2-support, paladin-2, archer-2, archer-2; NPCs of level 2): the day cleared 44% · a PC Down during the day 90% · Downs a day 3.00 · Rally Points left at the end 41% · Health at the end 31%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 30% | 4% |
| 2: 2 elite, 2 standard | 49% | 4.9 | 74% | 83% |
| 3: 6 standard | 89% | 5.0 | 47% | 48% |

| Per PC, over the day | Paladin (support) `paladin-2-support` | Paladin `paladin-2` | Archer `archer-2` |
|---|---:|---:|---:|
| Damage dealt | 204.9 | 219.7 | 228.8 |
| Damage a turn (its own turns) | 25.6 | 27.2 | 26.7 |
| Share of the party's damage (%) | 23 | 25 | 26 |
| Turns taken | 8.1 | 8.2 | 8.4 |
| Health Pool | 39 | 39 | 29 |
| Damage aimed at it (before reduction) | 86.3 | 86.3 | 54.2 |
| Reduced (Hallowed Stance) | 3.4 | 3.2 | 0.0 |
| Damage taken | 83.0 | 83.1 | 54.2 |
| Damage taken a round of combat | 8.2 | 8.2 | 5.5 |
| Times Down | 0.74 | 0.74 | 0.76 |
| Rally Points (of 9 / 9 / 7): used in combat (Steel Yourself) | 1.60 | 1.59 | 0.82 |
| Rally Points used through an ally's Lay On Hands | 1.36 | 1.36 | 1.26 |
| Rally Points used between fights | 2.41 | 2.45 | 1.97 |
| Rally Points left | 3.63 | 3.60 | 2.95 |
| **Buffs:** healed allies (Lay On Hands) | 23.5 | 23.6 | 0.0 |
| Defense given (damage it stopped) | 1.1 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 2.6 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.00 |
| **Debuff:** Hindered (times) | 0.00 | 0.00 | 1.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 0.99 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 0.67 |
| **Debuff:** Prone (times) | 0.55 | 0.55 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.92 |
