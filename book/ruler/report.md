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
| Nova (plan, **best**) | 1 | 36.8 | 35.5 | 34.2 | 35.5 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.7 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.6 | 8 / 8.6 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 6.2 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.1 | 22.8 | 20.4 | 22.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.1 | 22.8 | 20.4 | 22.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 18.1 | 16.4 | 14.6 | 16.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 37.8 | 36.5 | 35.2 | 36.5 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 16.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 21 / 20.8 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.5 | 9 / 9.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.7 | 4 / 3.7 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.1 | 22.8 | 20.4 | 25.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.1 | 22.8 | 20.4 | 25.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 18.1 | 16.4 | 14.6 | 18.9 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 37.8 | 36.5 | 35.2 | 40.0 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 18.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 13.6 | 12.5 | 11.3 | 15.0 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.4 | 22 / 22.4 |
| Standard | 57 | 13 | 2 | 6.9 | 3 / 2.9 | 10 / 10.1 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 6.2 | 4 / 4.0 |

## Paladin (Smite, hold) (tank / support), `classes/paladin-smite-1-hold.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 39.7 | 37.7 | 35.6 | 37.7 | 5 | 2 | Divine Surge (keep 2), Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge (keep 2), Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.5 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.9 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 39.7 | 37.7 | 35.6 | 37.7 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 18 / 18.6 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.5 | 8 / 8.5 |
| Elite | 120 | 14 | 3 | 15.1 | 6 / 5.9 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 25.6 | 23.7 | 21.7 | 23.7 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.7 | 39.7 | 37.6 | 39.7 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 16.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.6 | 18.3 | 16.9 | 18.3 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.2 | 21 / 20.8 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.3 | 9 / 9.5 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.3 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 25.6 | 23.7 | 21.7 | 27.1 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.7 | 39.7 | 37.6 | 43.2 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 18.1 | 16.4 | 14.6 | 18.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.6 | 18.3 | 16.9 | 21.7 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 19.6 | 18.3 | 16.9 | 21.7 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 1.8 | 1 / 1.0 | 60+ / - |
| Grunt | 31 | 13 | 2 | 4.4 | 1 / 1.3 | 22 / 22.3 |
| Standard | 57 | 13 | 2 | 6.9 | 2 / 2.4 | 10 / 10.1 |
| Elite | 120 | 14 | 3 | 15.1 | 5 / 5.6 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 13% | 1% | 2 | 0% | 0% | 0% | 0% |
| 2 Elites | 4 | 3 / 3.1 / 3 | 100% | 22% | 6% | 2 | 1% | 1% | 2% | 2% |
| Elite + 2 Standards | 4 | 3 / 3.1 / 3 | 100% | 18% | 3% | 2 | 1% | 0% | 1% | 1% |
| 8 Grunts | 4 | 4 / 3.8 / 4 | 100% | 18% | 0% | 2 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.3 / 4 | 100% | 14% | 0% | 3 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.6 / 5 | 99% | 30% | 12% | 2 | 3% | 4% | 4% | 5% |

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
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.02 |
| **Debuff:** Immobilized (times) | 0.00 | 2.00 |
| **Debuff:** Prone (times) | 0.96 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 60% · Downs a day 1.30 · Rally Points left at the end 50% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 14% | 0% |
| 2: 4 standard | 100% | 3.0 | 20% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 24% | 7% |
| 4: 2 elite, 2 standard | 83% | 4.8 | 54% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 297.7 | 286.1 |
| Damage a turn (its own turns) | 26.6 | 25.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 28.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.6 | 18.5 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.3 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 79.6 | 45.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.6 | 45.8 |
| Damage taken a round of combat | 5.8 | 3.3 |
| Times Down | 0.31 | 0.34 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.27 | 0.79 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.14 | 2.29 |
| Rally Points left | 3.58 | 3.92 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.1 |
| Divine Surge given (extra damage dealt by allies) | 18.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 27.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.10 |
| **Debuff:** Immobilized (times) | 0.00 | 1.98 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 93% · a PC Down during the day 49% · Downs a day 0.82 · Rally Points left at the end 52% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 14% | 0% |
| 2: 4 standard | 100% | 3.0 | 20% | 2% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 22% | 5% |
| 4: 2 elite, 2 standard | 93% | 4.9 | 46% | 45% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 308.1 | 294.1 |
| Damage a turn (its own turns) | 26.3 | 25.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 28.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.7 | 18.5 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.8 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.9 | 44.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 10.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.2 | 44.5 |
| Damage taken a round of combat | 5.2 | 3.2 |
| Times Down | 0.14 | 0.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.06 | 0.71 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.01 | 2.35 |
| Rally Points left | 3.93 | 3.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 6.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 30.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.17 |
| **Debuff:** Immobilized (times) | 0.00 | 2.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 95% · a PC Down during the day 36% · Downs a day 0.59 · Rally Points left at the end 26% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.0 | 7% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 10% | 3% |
| 4: 2 elite, 2 standard | 95% | 4.5 | 32% | 33% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 292.2 | 299.7 |
| Damage a turn (its own turns) | 25.8 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 29.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.1 | 18.3 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.4 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 81.1 | 45.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.1 | 45.0 |
| Damage taken a round of combat | 6.0 | 3.3 |
| Times Down | 0.13 | 0.17 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.69 | 0.24 |
| Rally Points used through an ally's Lay On Hands | 2.54 | 3.45 |
| Rally Points used between fights | 1.16 | 1.00 |
| Rally Points left | 1.61 | 2.30 |
| **Buffs:** healed allies (Lay On Hands) | 48.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.4 |
| Divine Surge given (extra damage dealt by allies) | 19.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.32 |
| **Debuff:** Immobilized (times) | 0.00 | 2.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 91% · a PC Down during the day 47% · Downs a day 0.88 · Rally Points left at the end 37% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 9% | 0% |
| 2: 4 standard | 100% | 3.0 | 12% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 16% | 5% |
| 4: 2 elite, 2 standard | 91% | 4.7 | 44% | 44% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 302.6 | 292.6 | 292.9 |
| Damage a turn (its own turns) | 26.7 | 25.9 | 25.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 20.2 | 29.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.7 | 36.2 | 18.3 |
| Share of the party's damage (%) | 26 | 25 | 25 |
| Turns taken | 11.4 | 11.4 | 11.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 82.0 | 78.2 | 45.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 82.0 | 78.2 | 45.3 |
| Damage taken a round of combat | 6.0 | 5.7 | 3.3 |
| Times Down | 0.21 | 0.21 | 0.23 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.74 | 3.08 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 2.78 | 0.00 | 1.80 |
| Rally Points used between fights | 2.11 | 2.17 | 1.69 |
| Rally Points left | 2.37 | 2.75 | 3.06 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 52.4 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 18.1 | 19.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 29.2 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 30.2 | 0.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.29 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.20 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.57 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 65% · a PC Down during the day 78% · Downs a day 2.13 · Rally Points left at the end 52% · Health at the end 59%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 15% | 0% |
| 2: 4 standard | 100% | 3.1 | 21% | 3% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 27% | 14% |
| 4: 2 elite, 2 standard | 65% | 5.1 | 64% | 73% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 326.9 | 309.1 |
| Damage a turn (its own turns) | 28.6 | 26.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 30.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.6 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.5 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 95.8 | 55.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.8 | 55.5 |
| Damage taken a round of combat | 6.7 | 3.9 |
| Times Down | 0.52 | 0.55 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.52 | 0.99 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.09 | 2.06 |
| Rally Points left | 4.39 | 3.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.1 |
| Divine Surge given (extra damage dealt by allies) | 19.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 27.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.24 |
| **Debuff:** Hindered (times) | 0.00 | 2.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 84% · a PC Down during the day 55% · Downs a day 1.17 · Rally Points left at the end 26% · Health at the end 71%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.1 | 7% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 12% | 6% |
| 4: 2 elite, 2 standard | 84% | 4.9 | 44% | 51% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 320.6 | 327.8 |
| Damage a turn (its own turns) | 27.1 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 31.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.9 | 12.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 100.0 | 55.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 100.0 | 55.3 |
| Damage taken a round of combat | 7.1 | 3.9 |
| Times Down | 0.27 | 0.32 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.92 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 2.69 | 3.52 |
| Rally Points used between fights | 1.32 | 0.99 |
| Rally Points left | 2.06 | 2.09 |
| **Buffs:** healed allies (Lay On Hands) | 56.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 20.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (times) | 0.00 | 2.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.72 |
| **Debuff:** Immobilized (times) | 0.00 | 1.24 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 93% · a PC Down during the day 49% · Downs a day 0.87 · Rally Points left at the end 57% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 16% | 0% |
| 2: 4 standard | 100% | 3.1 | 24% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 22% | 7% |
| 4: 2 elite, 2 standard | 93% | 4.8 | 43% | 44% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 350.6 | 311.7 |
| Damage a turn (its own turns) | 30.2 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.2 | 30.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.0 | 19.8 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.7 | 11.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 94.7 | 50.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.3 | 0.0 |
| Damage taken | 83.7 | 50.9 |
| Damage taken a round of combat | 6.0 | 3.7 |
| Times Down | 0.15 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.92 | 0.73 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.09 | 2.61 |
| Rally Points left | 4.99 | 4.65 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 18.7 | 0.0 |
| Banes given (damage its areas stopped) | 3.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 32.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.29 |
| **Debuff:** Hindered (times) | 0.00 | 2.05 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 23% · Downs a day 0.30 · Rally Points left at the end 35% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 7% | 0% |
| 2: 4 standard | 100% | 3.1 | 8% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 9% | 2% |
| 4: 2 elite, 2 standard | 99% | 4.6 | 18% | 21% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 328.6 | 332.8 |
| Damage a turn (its own turns) | 27.8 | 28.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.2 | 32.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.0 | 19.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.9 | 11.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.3 | 53.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 10.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.6 | 0.0 |
| Damage taken | 86.3 | 53.0 |
| Damage taken a round of combat | 6.3 | 3.9 |
| Times Down | 0.04 | 0.11 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.40 | 0.17 |
| Rally Points used through an ally's Lay On Hands | 2.57 | 4.21 |
| Rally Points used between fights | 0.83 | 0.84 |
| Rally Points left | 3.20 | 2.77 |
| **Buffs:** healed allies (Lay On Hands) | 62.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 20.4 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.33 |
| **Debuff:** Hindered (times) | 0.00 | 2.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.75 |
| **Debuff:** Immobilized (times) | 0.00 | 1.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

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
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.39 |
| **Debuff:** Prone (times) | 0.77 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 87% · a PC Down during the day 65% · Downs a day 1.38 · Rally Points left at the end 31% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 31% | 1% |
| 2: 6 standard | 97% | 4.5 | 40% | 26% |
| 3: 2 elite | 100% | 3.0 | 28% | 15% |
| 4: 1 elite, 4 standard | 90% | 4.7 | 48% | 43% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 337.6 | 354.8 |
| Damage a turn (its own turns) | 25.4 | 26.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 29.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.9 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.4 | 13.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 104.1 | 60.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 104.1 | 60.1 |
| Damage taken a round of combat | 6.6 | 3.8 |
| Times Down | 0.32 | 0.37 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.85 | 1.11 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.17 | 3.27 |
| Rally Points left | 1.98 | 2.63 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.8 |
| Divine Surge given (extra damage dealt by allies) | 22.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 35.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.93 |
| **Debuff:** Immobilized (times) | 0.00 | 2.65 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.39 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 97% · a PC Down during the day 49% · Downs a day 0.77 · Rally Points left at the end 37% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 28% | 1% |
| 2: 6 standard | 100% | 4.4 | 32% | 17% |
| 3: 2 elite | 100% | 3.1 | 26% | 10% |
| 4: 1 elite, 4 standard | 97% | 4.7 | 40% | 31% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 353.0 | 366.1 |
| Damage a turn (its own turns) | 25.3 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 30.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.9 | 17.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.0 | 13.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 108.9 | 58.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 90.0 | 58.2 |
| Damage taken a round of combat | 5.6 | 3.6 |
| Times Down | 0.12 | 0.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.31 | 0.98 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 3.20 |
| Rally Points left | 2.78 | 2.82 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.1 |
| Divine Surge given (extra damage dealt by allies) | 9.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 39.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.09 |
| **Debuff:** Immobilized (times) | 0.00 | 2.74 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 55% · Downs a day 1.17 · Rally Points left at the end 10% · Health at the end 56%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 10% | 0% |
| 2: 6 standard | 99% | 4.2 | 18% | 8% |
| 3: 2 elite | 100% | 3.0 | 14% | 7% |
| 4: 1 elite, 4 standard | 88% | 4.5 | 42% | 50% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 330.1 | 371.0 |
| Damage a turn (its own turns) | 25.1 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 31.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.5 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.2 | 13.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.5 | 61.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 107.5 | 61.8 |
| Damage taken a round of combat | 6.9 | 4.0 |
| Times Down | 0.32 | 0.26 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.32 | 0.30 |
| Rally Points used through an ally's Lay On Hands | 3.03 | 4.72 |
| Rally Points used between fights | 1.19 | 0.98 |
| Rally Points left | 0.46 | 1.00 |
| **Buffs:** healed allies (Lay On Hands) | 62.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 23.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 21.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.22 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.26 |
| **Debuff:** Immobilized (times) | 0.00 | 2.95 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.46 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 90% · a PC Down during the day 52% · Downs a day 1.04 · Rally Points left at the end 20% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 18% | 0% |
| 2: 6 standard | 99% | 4.3 | 28% | 16% |
| 3: 2 elite | 100% | 3.0 | 20% | 10% |
| 4: 1 elite, 4 standard | 91% | 4.6 | 41% | 38% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 342.9 | 334.9 | 363.9 |
| Damage a turn (its own turns) | 25.7 | 25.0 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.7 | 20.6 | 30.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.7 | 35.4 | 17.8 |
| Share of the party's damage (%) | 24 | 24 | 26 |
| Turns taken | 13.4 | 13.4 | 13.6 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 107.4 | 103.7 | 59.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 107.4 | 103.7 | 59.6 |
| Damage taken a round of combat | 6.9 | 6.6 | 3.8 |
| Times Down | 0.26 | 0.25 | 0.27 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.83 | 4.02 | 0.61 |
| Rally Points used through an ally's Lay On Hands | 3.58 | 0.00 | 2.35 |
| Rally Points used between fights | 2.60 | 2.72 | 2.19 |
| Rally Points left | 0.98 | 1.25 | 1.84 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 68.2 | 0.0 |
| Defense given (damage it stopped) | 7.6 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.4 |
| Divine Surge given (extra damage dealt by allies) | 22.7 | 23.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 39.1 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 40.4 | 1.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.18 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.13 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.41 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 80% · a PC Down during the day 74% · Downs a day 1.86 · Rally Points left at the end 32% · Health at the end 69%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 29% | 0% |
| 2: 6 standard | 96% | 4.8 | 40% | 29% |
| 3: 2 elite | 99% | 3.2 | 32% | 23% |
| 4: 1 elite, 4 standard | 83% | 5.0 | 53% | 54% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 374.4 | 381.7 |
| Damage a turn (its own turns) | 27.1 | 27.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 31.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.8 | 17.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.9 | 13.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 120.6 | 68.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 120.6 | 68.2 |
| Damage taken a round of combat | 7.3 | 4.2 |
| Times Down | 0.43 | 0.50 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.24 | 1.32 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.18 | 3.09 |
| Rally Points left | 2.58 | 2.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 8.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.9 |
| Divine Surge given (extra damage dealt by allies) | 23.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 35.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.08 |
| **Debuff:** Hindered (times) | 0.00 | 2.73 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.57 |
| **Debuff:** Immobilized (times) | 0.00 | 1.05 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.35 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 86% · a PC Down during the day 60% · Downs a day 1.34 · Rally Points left at the end 10% · Health at the end 56%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 8% | 0% |
| 2: 6 standard | 100% | 4.4 | 16% | 9% |
| 3: 2 elite | 100% | 3.2 | 17% | 14% |
| 4: 1 elite, 4 standard | 86% | 4.9 | 43% | 53% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 373.5 | 404.2 |
| Damage a turn (its own turns) | 26.6 | 28.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 33.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | 17.9 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 14.1 | 14.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 126.4 | 69.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 126.4 | 69.4 |
| Damage taken a round of combat | 7.8 | 4.3 |
| Times Down | 0.32 | 0.35 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.73 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 3.39 | 4.76 |
| Rally Points used between fights | 1.26 | 0.98 |
| Rally Points left | 0.62 | 0.92 |
| **Buffs:** healed allies (Lay On Hands) | 73.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 22.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.19 |
| **Debuff:** Hindered (times) | 0.00 | 3.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.75 |
| **Debuff:** Immobilized (times) | 0.00 | 1.14 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.47 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 56% · Downs a day 0.92 · Rally Points left at the end 42% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 31% | 0% |
| 2: 6 standard | 99% | 4.5 | 33% | 23% |
| 3: 2 elite | 100% | 3.0 | 25% | 14% |
| 4: 1 elite, 4 standard | 98% | 4.5 | 40% | 35% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 413.7 | 378.6 |
| Damage a turn (its own turns) | 29.9 | 28.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.2 | 31.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.3 | 20.1 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.9 | 13.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 124.1 | 66.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.4 | 0.0 |
| Damage taken | 104.8 | 66.0 |
| Damage taken a round of combat | 6.6 | 4.2 |
| Times Down | 0.13 | 0.33 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.32 | 1.04 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 3.51 |
| Rally Points left | 3.77 | 3.44 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 1.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 41.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.13 |
| **Debuff:** Hindered (times) | 0.00 | 2.61 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.58 |
| **Debuff:** Immobilized (times) | 0.00 | 1.05 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 30% · Downs a day 0.41 · Rally Points left at the end 18% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 9% | 0% |
| 2: 6 standard | 100% | 4.3 | 9% | 6% |
| 3: 2 elite | 100% | 3.0 | 11% | 6% |
| 4: 1 elite, 4 standard | 99% | 4.4 | 22% | 23% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 387.7 | 405.9 |
| Damage a turn (its own turns) | 27.9 | 29.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.1 | 33.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.4 | 20.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 14.0 | 13.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 128.7 | 69.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.4 | 0.0 |
| Damage taken | 108.9 | 69.4 |
| Damage taken a round of combat | 7.0 | 4.4 |
| Times Down | 0.04 | 0.16 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 3.11 | 0.21 |
| Rally Points used through an ally's Lay On Hands | 3.30 | 5.52 |
| Rally Points used between fights | 0.88 | 0.87 |
| Rally Points left | 1.71 | 1.41 |
| **Buffs:** healed allies (Lay On Hands) | 81.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.5 |
| Divine Surge given (extra damage dealt by allies) | 24.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.23 |
| **Debuff:** Hindered (times) | 0.00 | 2.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.74 |
| **Debuff:** Immobilized (times) | 0.00 | 1.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.46 |

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
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.74 |
| **Debuff:** Prone (times) | 0.60 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 80% · a PC Down during the day 65% · Downs a day 1.54 · Rally Points left at the end 50% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 22% | 2% |
| 2: 2 elite, 2 standard | 83% | 4.8 | 54% | 54% |
| 3: 6 standard | 97% | 4.5 | 39% | 26% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 238.8 | 253.2 |
| Damage a turn (its own turns) | 25.5 | 26.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 29.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.5 | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 9.5 | 9.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 79.0 | 45.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.0 | 45.6 |
| Damage taken a round of combat | 7.0 | 4.1 |
| Times Down | 0.38 | 0.39 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.61 | 0.97 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.79 | 2.14 |
| Rally Points left | 3.59 | 3.89 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 16.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 23.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.70 |
| **Debuff:** Immobilized (times) | 0.00 | 1.82 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 93% · a PC Down during the day 52% · Downs a day 0.93 · Rally Points left at the end 53% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 20% | 2% |
| 2: 2 elite, 2 standard | 93% | 4.9 | 45% | 40% |
| 3: 6 standard | 99% | 4.5 | 33% | 18% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 261.6 | 270.7 |
| Damage a turn (its own turns) | 25.2 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 30.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.4 | 18.2 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 10.5 | 10.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 84.3 | 45.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.4 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.9 | 45.6 |
| Damage taken a round of combat | 5.8 | 3.8 |
| Times Down | 0.16 | 0.31 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.26 | 0.86 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.68 | 2.31 |
| Rally Points left | 4.05 | 3.84 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 7.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 28.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.36 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.96 |
| **Debuff:** Immobilized (times) | 0.00 | 1.93 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.08 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 93% · a PC Down during the day 41% · Downs a day 0.74 · Rally Points left at the end 26% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 9% | 1% |
| 2: 2 elite, 2 standard | 95% | 4.5 | 32% | 33% |
| 3: 6 standard | 98% | 4.3 | 20% | 14% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 249.7 | 279.4 |
| Damage a turn (its own turns) | 25.2 | 27.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 31.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.1 | 18.4 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.0 | 10.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 83.5 | 46.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 83.5 | 46.4 |
| Damage taken a round of combat | 7.2 | 4.0 |
| Times Down | 0.18 | 0.19 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.61 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 2.47 | 3.28 |
| Rally Points used between fights | 1.29 | 1.13 |
| Rally Points left | 1.63 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 47.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.2 |
| Divine Surge given (extra damage dealt by allies) | 18.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.43 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.20 |
| **Debuff:** Immobilized (times) | 0.00 | 2.12 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.15 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 54% · Downs a day 1.10 · Rally Points left at the end 38% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 13% | 1% |
| 2: 2 elite, 2 standard | 90% | 4.7 | 44% | 44% |
| 3: 6 standard | 98% | 4.3 | 29% | 18% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 250.2 | 243.4 | 269.8 |
| Damage a turn (its own turns) | 25.7 | 25.1 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.4 | 20.5 | 30.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.2 | 35.7 | 18.4 |
| Share of the party's damage (%) | 24 | 24 | 26 |
| Turns taken | 9.8 | 9.8 | 9.9 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 83.3 | 79.9 | 45.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 83.3 | 79.9 | 45.7 |
| Damage taken a round of combat | 7.2 | 6.9 | 4.0 |
| Times Down | 0.28 | 0.26 | 0.28 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.97 | 3.07 | 0.57 |
| Rally Points used through an ally's Lay On Hands | 2.52 | 0.00 | 1.59 |
| Rally Points used between fights | 2.13 | 2.15 | 1.78 |
| Rally Points left | 2.38 | 2.78 | 3.07 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 47.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.4 |
| Divine Surge given (extra damage dealt by allies) | 16.0 | 17.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 26.8 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 31.4 | 1.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.36 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 2.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.04 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.07 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 77% · Downs a day 2.04 · Rally Points left at the end 56% · Health at the end 60%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 21% | 1% |
| 2: 2 elite, 2 standard | 69% | 5.0 | 61% | 68% |
| 3: 6 standard | 97% | 4.7 | 39% | 26% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 250.8 | 254.7 |
| Damage a turn (its own turns) | 27.5 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 30.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.2 | 18.3 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.3 | 9.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 87.1 | 50.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 87.1 | 50.7 |
| Damage taken a round of combat | 7.9 | 4.7 |
| Times Down | 0.49 | 0.52 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.75 | 1.05 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.44 | 1.78 |
| Rally Points left | 4.81 | 4.16 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.3 |
| Divine Surge given (extra damage dealt by allies) | 15.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 22.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (times) | 0.00 | 1.71 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.06 |
| **Debuff:** Immobilized (times) | 0.00 | 0.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.98 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 83% · a PC Down during the day 58% · Downs a day 1.30 · Rally Points left at the end 31% · Health at the end 69%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 9% | 0% |
| 2: 2 elite, 2 standard | 84% | 4.9 | 43% | 48% |
| 3: 6 standard | 98% | 4.5 | 20% | 21% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 265.3 | 290.6 |
| Damage a turn (its own turns) | 26.7 | 28.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 32.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | 18.3 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.0 | 10.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 95.6 | 53.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.6 | 53.8 |
| Damage taken a round of combat | 8.2 | 4.7 |
| Times Down | 0.31 | 0.34 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.67 | 0.43 |
| Rally Points used through an ally's Lay On Hands | 2.50 | 3.19 |
| Rally Points used between fights | 1.28 | 1.03 |
| Rally Points left | 2.54 | 2.34 |
| **Buffs:** healed allies (Lay On Hands) | 52.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.3 |
| Divine Surge given (extra damage dealt by allies) | 17.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.33 |
| **Debuff:** Hindered (times) | 0.00 | 2.07 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.25 |
| **Debuff:** Immobilized (times) | 0.00 | 0.81 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.06 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 93% · a PC Down during the day 55% · Downs a day 0.97 · Rally Points left at the end 57% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 24% | 2% |
| 2: 2 elite, 2 standard | 94% | 4.8 | 43% | 44% |
| 3: 6 standard | 99% | 4.4 | 33% | 17% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 306.9 | 284.0 |
| Damage a turn (its own turns) | 29.6 | 28.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 31.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.3 | 20.1 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.4 | 9.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.0 | 51.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.1 | 0.0 |
| Damage taken | 82.3 | 51.8 |
| Damage taken a round of combat | 6.9 | 4.4 |
| Times Down | 0.16 | 0.33 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.16 | 0.89 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.74 | 2.53 |
| Rally Points left | 5.10 | 4.57 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 17.6 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 31.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.35 |
| **Debuff:** Hindered (times) | 0.00 | 1.90 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.16 |
| **Debuff:** Immobilized (times) | 0.00 | 0.78 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 24% · Downs a day 0.32 · Rally Points left at the end 35% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 9% | 0% |
| 2: 2 elite, 2 standard | 99% | 4.5 | 17% | 18% |
| 3: 6 standard | 100% | 4.2 | 13% | 7% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 291.3 | 313.5 |
| Damage a turn (its own turns) | 27.6 | 29.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 33.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.1 | 20.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.6 | 10.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 100.8 | 55.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.6 | 0.0 |
| Damage taken | 85.3 | 55.2 |
| Damage taken a round of combat | 7.2 | 4.7 |
| Times Down | 0.04 | 0.12 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.33 | 0.23 |
| Rally Points used through an ally's Lay On Hands | 2.50 | 4.28 |
| Rally Points used between fights | 0.78 | 0.86 |
| Rally Points left | 3.39 | 2.62 |
| **Buffs:** healed allies (Lay On Hands) | 62.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.4 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.41 |
| **Debuff:** Hindered (times) | 0.00 | 2.19 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.31 |
| **Debuff:** Immobilized (times) | 0.00 | 0.90 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |
