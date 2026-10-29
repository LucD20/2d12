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

Plan: round 1: Aimed Marksman · round 2: Double Shot + Lock & Loose + attack · round 3+: Twin · when itself below 35% Health: Steel

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

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.0 | 1 / 1.0 | 15 / 15.5 |
| Grunt | 31 | 13 | 2 | 4.9 | 2 / 2.0 | 6 / 6.5 |
| Standard | 57 | 13 | 2 | 7.7 | 3 / 2.8 | 4 / 4.4 |
| Elite | 120 | 14 | 3 | 16.8 | 5 / 5.1 | 2 / 2.3 |

## Archer (ranged damage), `classes/archer-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.8 | 41.5 | 38.2 | 41.5 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.0 | 1 / 1.0 | 16 / 16.5 |
| Grunt | 31 | 13 | 2 | 4.9 | 2 / 2.0 | 7 / 6.9 |
| Standard | 57 | 13 | 2 | 7.7 | 3 / 2.9 | 5 / 4.7 |
| Elite | 120 | 14 | 3 | 16.8 | 5 / 5.1 | 2 / 2.4 |

## Paladin (book) (tank / support), `classes/paladin-book-1.txt`

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

Plan: round 1: Radiance opening · round 2+: Surge Smite 3 · when an ally is below 50% Health: Heal · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 2 / 1.8 | 17 / 17.0 |
| Standard | 57 | 13 | 2 | 6.9 | 3 / 2.6 | 8 / 7.8 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.1 | 3 / 3.1 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 36.7 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.4 | 18 / 18.7 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.6 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 6.1 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.1 | 22.8 | 20.4 | 22.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.1 | 22.8 | 20.4 | 22.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 18.1 | 16.4 | 14.6 | 16.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 39.1 | 37.7 | 36.2 | 37.7 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 16.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.4 | 21 / 20.8 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 9 / 9.4 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.7 | 4 / 3.7 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.1 | 22.8 | 20.4 | 25.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.1 | 22.8 | 20.4 | 25.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 18.1 | 16.4 | 14.6 | 18.9 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 39.1 | 37.7 | 36.2 | 41.3 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 18.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 13.6 | 12.5 | 11.3 | 15.0 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.4 | 22 / 22.4 |
| Standard | 57 | 13 | 2 | 6.9 | 3 / 2.8 | 10 / 10.1 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 6.1 | 4 / 4.0 |

## Paladin (Smite, Guard) (tank / support), `classes/paladin-smite-1-guard.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite, hold) (tank / support), `classes/paladin-smite-1-hold.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge (keep 2), Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge (keep 2), Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 43.1 | 40.9 | 38.7 | 40.9 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 16.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.6 | 18.3 | 16.9 | 18.3 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.2 | 21 / 20.9 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.2 | 9 / 9.4 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.3 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 43.1 | 40.9 | 38.7 | 44.4 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 18.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.6 | 18.3 | 16.9 | 21.7 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 19.6 | 18.3 | 16.9 | 21.7 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 22 / 22.3 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 10 / 10.0 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.5 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 13% | 1% | 2 | 0% | 0% | 0% | 0% |
| 2 Elites | 4 | 3 / 3.0 / 3 | 100% | 22% | 6% | 2 | 1% | 1% | 2% | 2% |
| Elite + 2 Standards | 4 | 3 / 3.0 / 3 | 100% | 18% | 3% | 2 | 0% | 0% | 1% | 1% |
| 8 Grunts | 4 | 4 / 3.8 / 4 | 100% | 18% | 0% | 3 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.3 / 4 | 100% | 15% | 0% | 3 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.6 / 5 | 99% | 30% | 10% | 2 | 2% | 3% | 4% | 4% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody moves, uses Rally Points on their own or uses Reactions. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 71% · a PC Down during the day 69% · Downs a day 1.84 · Rally Points left at the end 20% · Health at the end 52%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.5 | 20% | 0% |
| 2: 4 standard | 100% | 3.0 | 26% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 28% | 9% |
| 4: 2 elite, 2 standard | 71% | 4.7 | 61% | 66% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 295.9 | 276.9 |
| Damage a turn (its own turns) | 27.4 | 24.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.4 | 28.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 32.1 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.8 | 11.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 83.0 | 49.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.1 | 49.0 |
| Damage taken a round of combat | 6.1 | 3.7 |
| Times Down | 0.46 | 0.46 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.31 | 0.61 |
| Rally Points used through an ally's Lay On Hands | 1.59 | 1.51 |
| Rally Points used between fights | 3.92 | 3.04 |
| Rally Points left | 1.18 | 1.84 |
| **Buffs:** healed allies (Lay On Hands) | 24.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.02 |
| **Debuff:** Immobilized (times) | 0.00 | 2.00 |
| **Debuff:** Prone (times) | 0.96 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 59% · Downs a day 1.29 · Rally Points left at the end 50% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 14% | 0% |
| 2: 4 standard | 100% | 3.0 | 21% | 2% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 25% | 7% |
| 4: 2 elite, 2 standard | 83% | 4.8 | 53% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 300.0 | 288.0 |
| Damage a turn (its own turns) | 27.0 | 25.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 28.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.7 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.2 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 78.7 | 45.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.7 | 45.8 |
| Damage taken a round of combat | 5.7 | 3.3 |
| Times Down | 0.31 | 0.34 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.23 | 0.80 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.14 | 2.27 |
| Rally Points left | 3.63 | 3.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.5 |
| Divine Surge given (extra damage dealt by allies) | 18.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 26.8 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.06 |
| **Debuff:** Immobilized (times) | 0.00 | 2.07 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.57 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 92% · a PC Down during the day 48% · Downs a day 0.82 · Rally Points left at the end 53% · Health at the end 84%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 14% | 0% |
| 2: 4 standard | 100% | 3.1 | 20% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 22% | 5% |
| 4: 2 elite, 2 standard | 92% | 4.8 | 45% | 42% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 311.4 | 293.4 |
| Damage a turn (its own turns) | 26.7 | 25.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 28.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.9 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.7 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.4 | 44.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 10.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.8 | 44.2 |
| Damage taken a round of combat | 5.2 | 3.2 |
| Times Down | 0.14 | 0.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.02 | 0.70 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.98 | 2.30 |
| Rally Points left | 3.99 | 3.99 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.6 |
| Divine Surge given (extra damage dealt by allies) | 6.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 30.4 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 11.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.18 |
| **Debuff:** Immobilized (times) | 0.00 | 2.09 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 Smite with Guard (question 4.2)** (paladin-smite-1-guard, paladin-smite-1-guard, archer-1, archer-1; NPCs of level 1): the day cleared 84% · a PC Down during the day 64% · Downs a day 1.32 · Rally Points left at the end 40% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 0% |
| 2: 4 standard | 100% | 3.0 | 25% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 28% | 8% |
| 4: 2 elite, 2 standard | 84% | 5.0 | 56% | 58% |

| Per PC, over the day | Paladin (Smite, Guard) `paladin-smite-1-guard` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 307.5 | 279.9 |
| Damage a turn (its own turns) | 27.0 | 24.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 27.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.5 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 81.9 | 44.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 67.4 | 44.9 |
| Damage taken a round of combat | 4.8 | 3.2 |
| Times Down | 0.28 | 0.38 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.28 | 1.09 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.56 | 3.03 |
| Rally Points left | 3.17 | 2.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 19.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 14.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.92 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 94% · a PC Down during the day 34% · Downs a day 0.59 · Rally Points left at the end 27% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.0 | 7% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 10% | 3% |
| 4: 2 elite, 2 standard | 94% | 4.5 | 33% | 32% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 297.1 | 298.2 |
| Damage a turn (its own turns) | 26.3 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 29.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.4 | 18.3 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.4 | 11.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 81.5 | 44.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.5 | 44.5 |
| Damage taken a round of combat | 6.0 | 3.3 |
| Times Down | 0.14 | 0.16 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.69 | 0.26 |
| Rally Points used through an ally's Lay On Hands | 2.49 | 3.39 |
| Rally Points used between fights | 1.20 | 0.99 |
| Rally Points left | 1.61 | 2.37 |
| **Buffs:** healed allies (Lay On Hands) | 47.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.37 |
| **Debuff:** Immobilized (times) | 0.00 | 2.19 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 91% · a PC Down during the day 43% · Downs a day 0.82 · Rally Points left at the end 39% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 9% | 0% |
| 2: 4 standard | 100% | 3.0 | 12% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 16% | 3% |
| 4: 2 elite, 2 standard | 91% | 4.6 | 43% | 40% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 306.3 | 293.1 | 291.8 |
| Damage a turn (its own turns) | 27.3 | 26.4 | 25.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 20.1 | 29.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.0 | 37.4 | 18.3 |
| Share of the party's damage (%) | 26 | 25 | 25 |
| Turns taken | 11.3 | 11.2 | 11.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 81.0 | 76.4 | 44.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 81.0 | 76.4 | 44.5 |
| Damage taken a round of combat | 6.0 | 5.7 | 3.3 |
| Times Down | 0.19 | 0.20 | 0.21 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.69 | 2.90 | 0.46 |
| Rally Points used through an ally's Lay On Hands | 2.78 | 0.00 | 1.79 |
| Rally Points used between fights | 2.09 | 2.18 | 1.63 |
| Rally Points left | 2.44 | 2.92 | 3.12 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 52.1 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 19.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 29.5 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 29.5 | 0.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.23 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.09 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.54 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 68% · a PC Down during the day 72% · Downs a day 1.96 · Rally Points left at the end 53% · Health at the end 62%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 14% | 0% |
| 2: 4 standard | 100% | 3.1 | 21% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 26% | 11% |
| 4: 2 elite, 2 standard | 68% | 5.0 | 62% | 68% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 331.9 | 308.2 |
| Damage a turn (its own turns) | 29.0 | 26.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 30.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 42.1 | 18.6 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.5 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 93.3 | 54.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 93.3 | 54.3 |
| Damage taken a round of combat | 6.6 | 3.8 |
| Times Down | 0.46 | 0.52 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.47 | 0.97 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.04 | 2.06 |
| Rally Points left | 4.49 | 3.97 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.6 |
| Divine Surge given (extra damage dealt by allies) | 19.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 27.6 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.27 |
| **Debuff:** Hindered (times) | 0.00 | 2.08 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 86% · a PC Down during the day 51% · Downs a day 1.05 · Rally Points left at the end 27% · Health at the end 73%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.1 | 7% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 12% | 5% |
| 4: 2 elite, 2 standard | 86% | 4.8 | 41% | 48% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 327.6 | 325.7 |
| Damage a turn (its own turns) | 27.8 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 31.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.5 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 96.9 | 54.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 96.9 | 54.5 |
| Damage taken a round of combat | 6.9 | 3.9 |
| Times Down | 0.23 | 0.29 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.89 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 2.63 | 3.53 |
| Rally Points used between fights | 1.27 | 0.97 |
| Rally Points left | 2.21 | 2.14 |
| **Buffs:** healed allies (Lay On Hands) | 55.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 19.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.32 |
| **Debuff:** Hindered (times) | 0.00 | 2.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.73 |
| **Debuff:** Immobilized (times) | 0.00 | 1.24 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.58 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 94% · a PC Down during the day 52% · Downs a day 0.87 · Rally Points left at the end 57% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 16% | 0% |
| 2: 4 standard | 100% | 3.1 | 23% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 22% | 6% |
| 4: 2 elite, 2 standard | 94% | 4.7 | 43% | 47% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 355.5 | 309.2 |
| Damage a turn (its own turns) | 30.8 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 30.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.2 | 19.8 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.6 | 11.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 93.5 | 50.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 82.5 | 50.3 |
| Damage taken a round of combat | 6.0 | 3.7 |
| Times Down | 0.15 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.89 | 0.71 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.06 | 2.56 |
| Rally Points left | 5.05 | 4.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 3.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 32.1 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.25 |
| **Debuff:** Hindered (times) | 0.00 | 2.06 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.66 |
| **Debuff:** Immobilized (times) | 0.00 | 1.10 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.53 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 25% · Downs a day 0.31 · Rally Points left at the end 35% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 7% | 0% |
| 2: 4 standard | 100% | 3.1 | 8% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 9% | 2% |
| 4: 2 elite, 2 standard | 99% | 4.5 | 18% | 22% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 331.6 | 332.0 |
| Damage a turn (its own turns) | 28.3 | 28.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.3 | 32.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.0 | 19.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.1 | 52.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 86.0 | 52.6 |
| Damage taken a round of combat | 6.3 | 3.9 |
| Times Down | 0.04 | 0.12 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.43 | 0.17 |
| Rally Points used through an ally's Lay On Hands | 2.53 | 4.16 |
| Rally Points used between fights | 0.83 | 0.88 |
| Rally Points left | 3.21 | 2.79 |
| **Buffs:** healed allies (Lay On Hands) | 61.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 20.2 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.6 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.32 |
| **Debuff:** Hindered (times) | 0.00 | 2.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.78 |
| **Debuff:** Immobilized (times) | 0.00 | 1.17 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 37% · a PC Down during the day 89% · Downs a day 3.46 · Rally Points left at the end 9% · Health at the end 17%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 35% | 1% |
| 2: 6 standard | 95% | 4.4 | 41% | 27% |
| 3: 2 elite | 99% | 3.2 | 34% | 26% |
| 4: 1 elite, 4 standard | 39% | 4.2 | 66% | 87% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 314.1 | 328.5 |
| Damage a turn (its own turns) | 26.4 | 26.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 30.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 11.9 | 12.4 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 105.6 | 65.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 4.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 101.0 | 65.9 |
| Damage taken a round of combat | 6.9 | 4.5 |
| Times Down | 0.90 | 0.83 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.69 | 0.69 |
| Rally Points used through an ally's Lay On Hands | 2.10 | 2.21 |
| Rally Points used between fights | 3.73 | 3.15 |
| Rally Points left | 0.47 | 0.95 |
| **Buffs:** healed allies (Lay On Hands) | 34.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.39 |
| **Debuff:** Prone (times) | 0.77 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 61% · Downs a day 1.31 · Rally Points left at the end 32% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 31% | 1% |
| 2: 6 standard | 97% | 4.5 | 39% | 23% |
| 3: 2 elite | 99% | 3.1 | 28% | 14% |
| 4: 1 elite, 4 standard | 91% | 4.6 | 47% | 43% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 340.3 | 353.9 |
| Damage a turn (its own turns) | 25.7 | 26.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 29.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.9 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.3 | 13.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 102.5 | 58.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 102.5 | 58.4 |
| Damage taken a round of combat | 6.5 | 3.7 |
| Times Down | 0.31 | 0.35 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.77 | 1.05 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.15 | 3.23 |
| Rally Points left | 2.08 | 2.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.1 |
| Divine Surge given (extra damage dealt by allies) | 22.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 34.7 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.94 |
| **Debuff:** Immobilized (times) | 0.00 | 2.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.38 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 97% · a PC Down during the day 48% · Downs a day 0.76 · Rally Points left at the end 38% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 28% | 0% |
| 2: 6 standard | 100% | 4.4 | 33% | 17% |
| 3: 2 elite | 100% | 3.1 | 26% | 12% |
| 4: 1 elite, 4 standard | 98% | 4.7 | 39% | 30% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 359.6 | 364.3 |
| Damage a turn (its own turns) | 25.7 | 26.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 29.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.9 | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.1 | 13.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.9 | 58.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 18.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 89.1 | 58.9 |
| Damage taken a round of combat | 5.6 | 3.7 |
| Times Down | 0.10 | 0.28 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.25 | 0.98 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.92 | 3.21 |
| Rally Points left | 2.83 | 2.80 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.3 |
| Divine Surge given (extra damage dealt by allies) | 9.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 40.4 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 2.73 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 1, P1 Smite with Guard (question 4.2)** (paladin-smite-1-guard, paladin-smite-1-guard, archer-1, archer-1; NPCs of level 1): the day cleared 89% · a PC Down during the day 68% · Downs a day 1.44 · Rally Points left at the end 22% · Health at the end 73%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 37% | 1% |
| 2: 6 standard | 98% | 4.6 | 43% | 30% |
| 3: 2 elite | 100% | 3.1 | 32% | 14% |
| 4: 1 elite, 4 standard | 91% | 4.8 | 52% | 47% |

| Per PC, over the day | Paladin (Smite, Guard) `paladin-smite-1-guard` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 350.3 | 346.0 |
| Damage a turn (its own turns) | 25.6 | 25.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 28.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.9 | 17.8 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.8 | 13.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.0 | 59.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.5 | 59.3 |
| Damage taken a round of combat | 5.3 | 3.7 |
| Times Down | 0.28 | 0.43 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.70 | 1.67 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.50 | 3.87 |
| Rally Points left | 1.80 | 1.45 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.3 |
| Divine Surge given (extra damage dealt by allies) | 22.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 22.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.49 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.38 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 89% · a PC Down during the day 50% · Downs a day 1.07 · Rally Points left at the end 10% · Health at the end 58%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 10% | 0% |
| 2: 6 standard | 100% | 4.2 | 16% | 8% |
| 3: 2 elite | 100% | 3.0 | 13% | 7% |
| 4: 1 elite, 4 standard | 89% | 4.6 | 40% | 46% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 337.5 | 370.0 |
| Damage a turn (its own turns) | 25.4 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 31.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.4 | 13.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.2 | 60.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 107.2 | 60.1 |
| Damage taken a round of combat | 6.9 | 3.9 |
| Times Down | 0.28 | 0.25 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.32 | 0.28 |
| Rally Points used through an ally's Lay On Hands | 3.15 | 4.66 |
| Rally Points used between fights | 1.12 | 0.97 |
| Rally Points left | 0.41 | 1.10 |
| **Buffs:** healed allies (Lay On Hands) | 63.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.6 |
| Divine Surge given (extra damage dealt by allies) | 23.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 21.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.23 |
| **Debuff:** Immobilized (times) | 0.00 | 2.89 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.47 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 92% · a PC Down during the day 50% · Downs a day 0.96 · Rally Points left at the end 21% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 18% | 0% |
| 2: 6 standard | 98% | 4.3 | 28% | 17% |
| 3: 2 elite | 100% | 3.0 | 20% | 9% |
| 4: 1 elite, 4 standard | 94% | 4.4 | 39% | 35% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 347.2 | 337.1 | 361.0 |
| Damage a turn (its own turns) | 26.2 | 25.5 | 26.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.7 | 20.6 | 30.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.2 | 36.8 | 18.1 |
| Share of the party's damage (%) | 25 | 24 | 26 |
| Turns taken | 13.3 | 13.3 | 13.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 105.8 | 101.1 | 58.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 105.8 | 101.1 | 58.5 |
| Damage taken a round of combat | 6.9 | 6.6 | 3.8 |
| Times Down | 0.24 | 0.21 | 0.25 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.82 | 3.94 | 0.58 |
| Rally Points used through an ally's Lay On Hands | 3.57 | 0.00 | 2.32 |
| Rally Points used between fights | 2.54 | 2.75 | 2.20 |
| Rally Points left | 1.07 | 1.30 | 1.90 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 67.6 | 0.0 |
| Defense given (damage it stopped) | 7.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.8 |
| Divine Surge given (extra damage dealt by allies) | 22.5 | 23.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 38.9 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 40.0 | 0.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.10 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.77 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.45 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 78% · a PC Down during the day 75% · Downs a day 1.88 · Rally Points left at the end 34% · Health at the end 68%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 30% | 0% |
| 2: 6 standard | 96% | 4.7 | 40% | 28% |
| 3: 2 elite | 99% | 3.2 | 32% | 22% |
| 4: 1 elite, 4 standard | 83% | 5.0 | 53% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 376.5 | 377.9 |
| Damage a turn (its own turns) | 27.6 | 27.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 31.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.8 | 13.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 119.3 | 67.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 119.3 | 67.6 |
| Damage taken a round of combat | 7.3 | 4.2 |
| Times Down | 0.43 | 0.51 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.20 | 1.27 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.11 | 3.06 |
| Rally Points left | 2.69 | 2.68 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 8.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 35.2 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.07 |
| **Debuff:** Hindered (times) | 0.00 | 2.67 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.04 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.36 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 88% · a PC Down during the day 58% · Downs a day 1.29 · Rally Points left at the end 10% · Health at the end 58%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 8% | 0% |
| 2: 6 standard | 100% | 4.4 | 16% | 11% |
| 3: 2 elite | 100% | 3.2 | 17% | 14% |
| 4: 1 elite, 4 standard | 88% | 4.8 | 41% | 52% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 378.0 | 403.7 |
| Damage a turn (its own turns) | 27.0 | 28.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.7 | 32.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.9 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 14.0 | 14.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 125.2 | 69.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 125.2 | 69.5 |
| Damage taken a round of combat | 7.7 | 4.3 |
| Times Down | 0.30 | 0.35 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.68 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 3.42 | 4.77 |
| Rally Points used between fights | 1.26 | 0.97 |
| Rally Points left | 0.63 | 0.90 |
| **Buffs:** healed allies (Lay On Hands) | 74.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 24.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 22.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.18 |
| **Debuff:** Hindered (times) | 0.00 | 3.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.68 |
| **Debuff:** Immobilized (times) | 0.00 | 1.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.46 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 52% · Downs a day 0.83 · Rally Points left at the end 44% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 31% | 1% |
| 2: 6 standard | 100% | 4.4 | 33% | 21% |
| 3: 2 elite | 100% | 3.0 | 25% | 11% |
| 4: 1 elite, 4 standard | 97% | 4.5 | 40% | 31% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 416.0 | 378.8 |
| Damage a turn (its own turns) | 30.3 | 28.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.2 | 31.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.3 | 20.0 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.8 | 13.3 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 121.7 | 65.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.2 | 0.0 |
| Damage taken | 102.5 | 65.4 |
| Damage taken a round of combat | 6.5 | 4.2 |
| Times Down | 0.11 | 0.30 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.21 | 1.01 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.89 | 3.46 |
| Rally Points left | 3.90 | 3.53 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.3 |
| Divine Surge given (extra damage dealt by allies) | 21.9 | 0.0 |
| Banes given (damage its areas stopped) | 1.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 41.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.13 |
| **Debuff:** Hindered (times) | 0.00 | 2.64 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.06 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 30% · Downs a day 0.40 · Rally Points left at the end 19% · Health at the end 82%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 9% | 0% |
| 2: 6 standard | 100% | 4.3 | 9% | 6% |
| 3: 2 elite | 100% | 3.0 | 11% | 6% |
| 4: 1 elite, 4 standard | 99% | 4.3 | 21% | 22% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 391.8 | 404.9 |
| Damage a turn (its own turns) | 28.3 | 29.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.2 | 33.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.6 | 20.1 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.9 | 13.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 127.0 | 68.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.3 | 0.0 |
| Damage taken | 107.4 | 68.7 |
| Damage taken a round of combat | 6.9 | 4.4 |
| Times Down | 0.04 | 0.16 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 3.11 | 0.22 |
| Rally Points used through an ally's Lay On Hands | 3.27 | 5.45 |
| Rally Points used between fights | 0.83 | 0.87 |
| Rally Points left | 1.79 | 1.46 |
| **Buffs:** healed allies (Lay On Hands) | 80.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.9 |
| Divine Surge given (extra damage dealt by allies) | 23.9 | 0.0 |
| Banes given (damage its areas stopped) | 1.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.23 |
| **Debuff:** Hindered (times) | 0.00 | 2.96 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.77 |
| **Debuff:** Immobilized (times) | 0.00 | 1.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 65% · a PC Down during the day 78% · Downs a day 2.23 · Rally Points left at the end 28% · Health at the end 45%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 29% | 2% |
| 2: 2 elite, 2 standard | 73% | 4.7 | 61% | 64% |
| 3: 6 standard | 90% | 4.5 | 46% | 44% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 231.5 | 237.4 |
| Damage a turn (its own turns) | 26.5 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.0 | 29.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.2 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 8.8 | 9.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 80.4 | 48.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 3.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.8 | 48.1 |
| Damage taken a round of combat | 7.1 | 4.5 |
| Times Down | 0.57 | 0.54 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.64 | 0.74 |
| Rally Points used through an ally's Lay On Hands | 1.48 | 1.54 |
| Rally Points used between fights | 2.95 | 2.42 |
| Rally Points left | 1.92 | 2.30 |
| **Buffs:** healed allies (Lay On Hands) | 24.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.1 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.74 |
| **Debuff:** Prone (times) | 0.60 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 82% · a PC Down during the day 67% · Downs a day 1.48 · Rally Points left at the end 50% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 21% | 2% |
| 2: 2 elite, 2 standard | 84% | 4.7 | 53% | 53% |
| 3: 6 standard | 98% | 4.5 | 39% | 28% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 242.1 | 256.0 |
| Damage a turn (its own turns) | 25.8 | 26.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 29.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.3 | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 9.5 | 9.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 78.4 | 44.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.4 | 44.5 |
| Damage taken a round of combat | 6.9 | 3.9 |
| Times Down | 0.37 | 0.37 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.61 | 0.94 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.79 | 2.12 |
| Rally Points left | 3.60 | 3.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.4 |
| Divine Surge given (extra damage dealt by allies) | 16.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 23.1 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.75 |
| **Debuff:** Immobilized (times) | 0.00 | 1.87 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 94% · a PC Down during the day 52% · Downs a day 0.89 · Rally Points left at the end 52% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 20% | 1% |
| 2: 2 elite, 2 standard | 94% | 4.8 | 45% | 42% |
| 3: 6 standard | 99% | 4.4 | 32% | 17% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 265.6 | 269.3 |
| Damage a turn (its own turns) | 25.7 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 30.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.5 | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 10.5 | 10.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 83.9 | 45.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.6 | 45.5 |
| Damage taken a round of combat | 5.8 | 3.8 |
| Times Down | 0.14 | 0.30 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.21 | 0.85 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.74 | 2.33 |
| Rally Points left | 4.05 | 3.82 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 7.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 28.8 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.36 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.94 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.09 |

**Level 1, P1 Smite with Guard (question 4.2)** (paladin-smite-1-guard, paladin-smite-1-guard, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 73% · Downs a day 1.55 · Rally Points left at the end 42% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 27% | 3% |
| 2: 2 elite, 2 standard | 86% | 4.9 | 55% | 59% |
| 3: 6 standard | 97% | 4.6 | 43% | 29% |

| Per PC, over the day | Paladin (Smite, Guard) `paladin-smite-1-guard` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 252.2 | 249.1 |
| Damage a turn (its own turns) | 25.5 | 25.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.8 | 28.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.3 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 10.0 | 9.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.3 | 45.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 66.4 | 45.2 |
| Damage taken a round of combat | 5.7 | 3.8 |
| Times Down | 0.33 | 0.45 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.57 | 1.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.08 | 2.71 |
| Rally Points left | 3.34 | 2.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 16.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.54 |
| **Debuff:** Immobilized (times) | 0.00 | 1.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.06 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 92% · a PC Down during the day 40% · Downs a day 0.79 · Rally Points left at the end 27% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 10% | 0% |
| 2: 2 elite, 2 standard | 93% | 4.5 | 33% | 32% |
| 3: 6 standard | 98% | 4.3 | 20% | 16% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 250.5 | 275.4 |
| Damage a turn (its own turns) | 25.5 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 31.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.3 | 18.3 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 9.9 | 10.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.8 | 46.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 82.8 | 46.5 |
| Damage taken a round of combat | 7.2 | 4.1 |
| Times Down | 0.18 | 0.22 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.63 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 2.41 | 3.25 |
| Rally Points used between fights | 1.26 | 1.12 |
| Rally Points left | 1.70 | 2.30 |
| **Buffs:** healed allies (Lay On Hands) | 46.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 17.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.40 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.04 |
| **Debuff:** Immobilized (times) | 0.00 | 2.08 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.13 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 87% · a PC Down during the day 53% · Downs a day 1.06 · Rally Points left at the end 39% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 13% | 1% |
| 2: 2 elite, 2 standard | 90% | 4.6 | 43% | 43% |
| 3: 6 standard | 97% | 4.3 | 29% | 17% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 252.6 | 246.3 | 265.0 |
| Damage a turn (its own turns) | 26.3 | 25.6 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 20.5 | 30.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.0 | 37.0 | 18.1 |
| Share of the party's damage (%) | 25 | 24 | 26 |
| Turns taken | 9.7 | 9.7 | 9.8 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 81.0 | 77.5 | 45.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 81.0 | 77.5 | 45.9 |
| Damage taken a round of combat | 7.1 | 6.8 | 4.0 |
| Times Down | 0.27 | 0.23 | 0.28 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.88 | 3.00 | 0.55 |
| Rally Points used through an ally's Lay On Hands | 2.49 | 0.00 | 1.61 |
| Rally Points used between fights | 2.11 | 2.08 | 1.78 |
| Rally Points left | 2.52 | 2.92 | 3.06 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 47.0 | 0.0 |
| Defense given (damage it stopped) | 6.1 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.3 |
| Divine Surge given (extra damage dealt by allies) | 16.3 | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 26.7 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 31.0 | 1.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 2.95 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.94 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.08 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 77% · Downs a day 2.06 · Rally Points left at the end 56% · Health at the end 60%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 21% | 2% |
| 2: 2 elite, 2 standard | 69% | 5.1 | 61% | 69% |
| 3: 6 standard | 96% | 4.6 | 39% | 26% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 253.4 | 252.5 |
| Damage a turn (its own turns) | 27.8 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 30.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 41.4 | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.3 | 9.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 86.6 | 51.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.6 | 51.5 |
| Damage taken a round of combat | 7.8 | 4.7 |
| Times Down | 0.48 | 0.55 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.73 | 1.10 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.43 | 1.81 |
| Rally Points left | 4.84 | 4.10 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 16.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 22.2 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (times) | 0.00 | 1.68 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.05 |
| **Debuff:** Immobilized (times) | 0.00 | 0.70 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.94 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 86% · a PC Down during the day 52% · Downs a day 1.13 · Rally Points left at the end 29% · Health at the end 73%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 9% | 1% |
| 2: 2 elite, 2 standard | 87% | 4.8 | 40% | 44% |
| 3: 6 standard | 99% | 4.5 | 19% | 17% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 269.5 | 295.3 |
| Damage a turn (its own turns) | 26.9 | 28.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 33.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.0 | 18.2 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.1 | 10.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 94.8 | 53.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 94.8 | 53.6 |
| Damage taken a round of combat | 8.1 | 4.6 |
| Times Down | 0.26 | 0.31 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.74 | 0.43 |
| Rally Points used through an ally's Lay On Hands | 2.48 | 3.26 |
| Rally Points used between fights | 1.32 | 1.05 |
| Rally Points left | 2.45 | 2.26 |
| **Buffs:** healed allies (Lay On Hands) | 52.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.3 |
| Divine Surge given (extra damage dealt by allies) | 17.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.31 |
| **Debuff:** Hindered (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.22 |
| **Debuff:** Immobilized (times) | 0.00 | 0.88 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.08 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 94% · a PC Down during the day 59% · Downs a day 1.01 · Rally Points left at the end 57% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 24% | 2% |
| 2: 2 elite, 2 standard | 95% | 4.7 | 43% | 48% |
| 3: 6 standard | 99% | 4.4 | 34% | 19% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 309.7 | 283.9 |
| Damage a turn (its own turns) | 29.9 | 28.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.8 | 32.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.2 | 20.2 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.4 | 9.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 96.7 | 52.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.5 | 0.0 |
| Damage taken | 81.7 | 52.1 |
| Damage taken a round of combat | 6.9 | 4.4 |
| Times Down | 0.16 | 0.35 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.14 | 0.89 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.73 | 2.59 |
| Rally Points left | 5.13 | 4.52 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 31.3 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.34 |
| **Debuff:** Hindered (times) | 0.00 | 1.91 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.17 |
| **Debuff:** Immobilized (times) | 0.00 | 0.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.10 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 23% · Downs a day 0.30 · Rally Points left at the end 35% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 9% | 1% |
| 2: 2 elite, 2 standard | 99% | 4.5 | 17% | 18% |
| 3: 6 standard | 100% | 4.2 | 13% | 7% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 294.6 | 314.6 |
| Damage a turn (its own turns) | 28.0 | 29.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.2 | 33.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.0 | 20.2 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.6 | 10.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 100.5 | 55.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.4 | 0.0 |
| Damage taken | 85.0 | 55.2 |
| Damage taken a round of combat | 7.2 | 4.7 |
| Times Down | 0.03 | 0.12 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.33 | 0.22 |
| Rally Points used through an ally's Lay On Hands | 2.51 | 4.28 |
| Rally Points used between fights | 0.77 | 0.90 |
| Rally Points left | 3.40 | 2.60 |
| **Buffs:** healed allies (Lay On Hands) | 63.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 19.0 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.8 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.44 |
| **Debuff:** Hindered (times) | 0.00 | 2.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.30 |
| **Debuff:** Immobilized (times) | 0.00 | 0.90 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.14 |
