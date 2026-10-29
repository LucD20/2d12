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
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 17% | 1% | 2 | 0% | 0% | 0% | 1% |
| 2 Elites | 4 | 3 / 3.1 / 3 | 100% | 25% | 6% | 2 | 1% | 2% | 2% | 2% |
| Elite + 2 Standards | 4 | 3 / 3.1 / 3 | 100% | 21% | 3% | 2 | 0% | 1% | 2% | 1% |
| 8 Grunts | 4 | 4 / 3.8 / 4 | 100% | 23% | 0% | 2 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.4 / 4 | 100% | 19% | 1% | 2 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.6 / 5 | 99% | 35% | 16% | 2 | 3% | 6% | 6% | 5% |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 84% · a PC Down during the day 65% · Downs a day 1.36 · Rally Points left at the end 30% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 1% |
| 2: 4 standard | 100% | 3.1 | 26% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 30% | 9% |
| 4: 2 elite, 2 standard | 84% | 4.9 | 56% | 59% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 305.4 | 282.0 |
| Damage a turn (its own turns) | 26.9 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.8 | 28.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 18.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.5 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.6 | 44.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.7 | 44.8 |
| Damage taken a round of combat | 5.2 | 3.2 |
| Times Down | 0.30 | 0.38 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.30 | 1.03 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.36 | 3.78 |
| Rally Points left | 2.34 | 2.19 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 9.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.92 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 94% · a PC Down during the day 53% · Downs a day 0.88 · Rally Points left at the end 32% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 26% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 28% | 8% |
| 4: 2 elite, 2 standard | 94% | 5.0 | 48% | 46% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 316.1 | 289.6 |
| Damage a turn (its own turns) | 26.8 | 24.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 28.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.2 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.9 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 84.6 | 44.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 63.5 | 44.1 |
| Damage taken a round of combat | 4.5 | 3.1 |
| Times Down | 0.13 | 0.31 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.07 | 0.96 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.30 | 3.93 |
| Rally Points left | 2.63 | 2.11 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 6.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.06 |
| **Debuff:** Immobilized (times) | 0.00 | 2.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.51 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 94% · a PC Down during the day 34% · Downs a day 0.61 · Rally Points left at the end 25% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.0 | 8% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 10% | 2% |
| 4: 2 elite, 2 standard | 94% | 4.5 | 33% | 32% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 295.3 | 298.6 |
| Damage a turn (its own turns) | 26.3 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 29.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.4 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.3 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 79.9 | 44.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.9 | 44.7 |
| Damage taken a round of combat | 6.0 | 3.3 |
| Times Down | 0.15 | 0.15 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.52 | 0.28 |
| Rally Points used through an ally's Lay On Hands | 2.51 | 3.37 |
| Rally Points used between fights | 1.41 | 1.21 |
| Rally Points left | 1.56 | 2.14 |
| **Buffs:** healed allies (Lay On Hands) | 48.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 19.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.33 |
| **Debuff:** Immobilized (times) | 0.00 | 2.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.57 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 87% · a PC Down during the day 50% · Downs a day 1.03 · Rally Points left at the end 27% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 12% | 0% |
| 2: 4 standard | 100% | 3.1 | 15% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 19% | 4% |
| 4: 2 elite, 2 standard | 87% | 4.7 | 49% | 48% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 306.1 | 290.7 | 290.7 |
| Damage a turn (its own turns) | 27.1 | 26.5 | 25.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 20.2 | 28.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.8 | 37.3 | 18.3 |
| Share of the party's damage (%) | 26 | 25 | 25 |
| Turns taken | 11.4 | 11.1 | 11.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 83.2 | 78.5 | 45.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 72.0 | 78.5 | 45.4 |
| Damage taken a round of combat | 5.3 | 5.8 | 3.3 |
| Times Down | 0.21 | 0.28 | 0.27 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.64 | 3.15 | 0.60 |
| Rally Points used through an ally's Lay On Hands | 2.46 | 0.00 | 1.83 |
| Rally Points used between fights | 2.61 | 3.13 | 2.48 |
| Rally Points left | 2.29 | 1.72 | 2.09 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 49.9 | 0.0 |
| Defense given (damage it stopped) | 3.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.2 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.1 | 1.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.13 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.10 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.56 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 70% · a PC Down during the day 74% · Downs a day 1.96 · Rally Points left at the end 35% · Health at the end 62%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 27% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 31% | 14% |
| 4: 2 elite, 2 standard | 70% | 5.2 | 63% | 69% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 336.2 | 304.3 |
| Damage a turn (its own turns) | 28.8 | 26.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 29.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 42.0 | 18.5 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.8 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 97.1 | 54.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.5 | 54.1 |
| Damage taken a round of combat | 6.0 | 3.8 |
| Times Down | 0.44 | 0.54 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.54 | 1.17 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.16 | 3.58 |
| Rally Points left | 3.30 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.4 |
| Divine Surge given (extra damage dealt by allies) | 19.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (times) | 0.00 | 2.00 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.59 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.54 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 86% · a PC Down during the day 49% · Downs a day 1.02 · Rally Points left at the end 25% · Health at the end 73%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.1 | 7% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 11% | 4% |
| 4: 2 elite, 2 standard | 86% | 4.8 | 42% | 47% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 326.4 | 326.5 |
| Damage a turn (its own turns) | 27.9 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 31.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.8 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 96.8 | 53.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 96.8 | 53.2 |
| Damage taken a round of combat | 6.9 | 3.8 |
| Times Down | 0.23 | 0.28 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.85 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 2.64 | 3.36 |
| Rally Points used between fights | 1.50 | 1.38 |
| Rally Points left | 2.00 | 1.92 |
| **Buffs:** healed allies (Lay On Hands) | 54.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 20.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (times) | 0.00 | 2.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.72 |
| **Debuff:** Immobilized (times) | 0.00 | 1.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 50% · Downs a day 0.80 · Rally Points left at the end 38% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 22% | 1% |
| 2: 4 standard | 100% | 3.1 | 29% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 27% | 7% |
| 4: 2 elite, 2 standard | 96% | 4.8 | 46% | 44% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 361.6 | 307.1 |
| Damage a turn (its own turns) | 30.8 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 30.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 19.9 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.8 | 11.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 95.8 | 50.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.7 | 0.0 |
| Damage taken | 76.1 | 50.4 |
| Damage taken a round of combat | 5.5 | 3.6 |
| Times Down | 0.11 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.92 | 0.89 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.33 | 4.40 |
| Rally Points left | 3.75 | 2.71 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.6 | 0.0 |
| Guard given (damage it took instead of Health) | 8.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.32 |
| **Debuff:** Hindered (times) | 0.00 | 2.03 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.62 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.53 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 18% · Downs a day 0.21 · Rally Points left at the end 35% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 7% | 0% |
| 2: 4 standard | 100% | 3.1 | 8% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 7% | 1% |
| 4: 2 elite, 2 standard | 100% | 4.5 | 15% | 17% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 333.1 | 332.7 |
| Damage a turn (its own turns) | 28.3 | 28.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.3 | 32.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.2 | 19.8 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.3 | 52.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 86.3 | 52.7 |
| Damage taken a round of combat | 6.4 | 3.9 |
| Times Down | 0.03 | 0.08 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.36 | 0.14 |
| Rally Points used through an ally's Lay On Hands | 2.47 | 4.04 |
| Rally Points used between fights | 0.99 | 1.03 |
| Rally Points left | 3.18 | 2.79 |
| **Buffs:** healed allies (Lay On Hands) | 60.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 20.3 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.34 |
| **Debuff:** Hindered (times) | 0.00 | 2.35 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.77 |
| **Debuff:** Immobilized (times) | 0.00 | 1.20 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.57 |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 85% · a PC Down during the day 69% · Downs a day 1.60 · Rally Points left at the end 14% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 38% | 1% |
| 2: 6 standard | 97% | 4.6 | 43% | 28% |
| 3: 2 elite | 100% | 3.1 | 32% | 16% |
| 4: 1 elite, 4 standard | 88% | 4.8 | 53% | 52% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 346.5 | 345.8 |
| Damage a turn (its own turns) | 25.6 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 29.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.1 | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.6 | 13.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.3 | 58.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 91.0 | 58.5 |
| Damage taken a round of combat | 5.7 | 3.7 |
| Times Down | 0.33 | 0.47 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.77 | 1.47 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.12 | 4.56 |
| Rally Points left | 1.11 | 0.97 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.2 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 16.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 10.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.74 |
| **Debuff:** Immobilized (times) | 0.00 | 2.45 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 96% · a PC Down during the day 61% · Downs a day 1.06 · Rally Points left at the end 16% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 37% | 1% |
| 2: 6 standard | 100% | 4.6 | 38% | 21% |
| 3: 2 elite | 100% | 3.1 | 30% | 16% |
| 4: 1 elite, 4 standard | 96% | 4.9 | 46% | 42% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 366.0 | 354.3 |
| Damage a turn (its own turns) | 25.5 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 29.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 17.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.4 | 13.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 111.7 | 59.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.8 | 59.7 |
| Damage taken a round of combat | 4.7 | 3.6 |
| Times Down | 0.12 | 0.41 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.37 | 1.48 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.08 | 4.73 |
| Rally Points left | 1.55 | 0.79 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.4 |
| Divine Surge given (extra damage dealt by allies) | 9.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 14.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 11.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.18 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.85 |
| **Debuff:** Immobilized (times) | 0.00 | 2.59 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.44 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 84% · a PC Down during the day 55% · Downs a day 1.29 · Rally Points left at the end 9% · Health at the end 53%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 10% | 0% |
| 2: 6 standard | 99% | 4.2 | 18% | 9% |
| 3: 2 elite | 100% | 3.0 | 14% | 7% |
| 4: 1 elite, 4 standard | 85% | 4.5 | 44% | 51% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 334.8 | 366.3 |
| Damage a turn (its own turns) | 25.6 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 30.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | 17.9 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.2 | 13.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.1 | 61.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 107.1 | 61.3 |
| Damage taken a round of combat | 6.9 | 4.0 |
| Times Down | 0.34 | 0.31 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.24 | 0.31 |
| Rally Points used through an ally's Lay On Hands | 3.01 | 4.49 |
| Rally Points used between fights | 1.34 | 1.28 |
| Rally Points left | 0.40 | 0.93 |
| **Buffs:** healed allies (Lay On Hands) | 60.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.6 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.21 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.24 |
| **Debuff:** Immobilized (times) | 0.00 | 2.82 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.47 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 85% · a PC Down during the day 61% · Downs a day 1.43 · Rally Points left at the end 11% · Health at the end 58%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 24% | 1% |
| 2: 6 standard | 99% | 4.4 | 33% | 17% |
| 3: 2 elite | 100% | 3.0 | 23% | 10% |
| 4: 1 elite, 4 standard | 87% | 4.6 | 48% | 52% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 352.8 | 334.2 | 356.5 |
| Damage a turn (its own turns) | 26.2 | 25.7 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.8 | 20.7 | 30.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.1 | 36.9 | 17.9 |
| Share of the party's damage (%) | 25 | 24 | 25 |
| Turns taken | 13.5 | 13.1 | 13.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 110.9 | 102.5 | 59.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 93.2 | 102.5 | 59.6 |
| Damage taken a round of combat | 6.0 | 6.5 | 3.8 |
| Times Down | 0.28 | 0.40 | 0.37 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.77 | 4.02 | 0.70 |
| Rally Points used through an ally's Lay On Hands | 2.99 | 0.00 | 2.31 |
| Rally Points used between fights | 3.23 | 3.46 | 3.04 |
| Rally Points left | 1.01 | 0.51 | 0.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 62.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 23.3 | 21.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 17.7 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 25.2 | 1.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.18 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.00 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.76 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.44 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 79% · a PC Down during the day 77% · Downs a day 1.98 · Rally Points left at the end 17% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 36% | 1% |
| 2: 6 standard | 97% | 4.8 | 43% | 29% |
| 3: 2 elite | 99% | 3.2 | 36% | 23% |
| 4: 1 elite, 4 standard | 82% | 5.1 | 57% | 60% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 388.2 | 375.0 |
| Damage a turn (its own turns) | 27.6 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 30.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 41.2 | 17.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.2 | 13.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 123.7 | 67.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 106.1 | 67.9 |
| Damage taken a round of combat | 6.4 | 4.1 |
| Times Down | 0.42 | 0.57 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.12 | 1.62 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.17 | 4.43 |
| Rally Points left | 1.71 | 0.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.6 |
| Divine Surge given (extra damage dealt by allies) | 23.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 17.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.12 |
| **Debuff:** Hindered (times) | 0.00 | 2.59 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.48 |
| **Debuff:** Immobilized (times) | 0.00 | 1.05 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 85% · a PC Down during the day 58% · Downs a day 1.35 · Rally Points left at the end 9% · Health at the end 55%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 9% | 0% |
| 2: 6 standard | 99% | 4.4 | 16% | 7% |
| 3: 2 elite | 100% | 3.1 | 17% | 13% |
| 4: 1 elite, 4 standard | 86% | 4.8 | 44% | 53% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 372.9 | 404.4 |
| Damage a turn (its own turns) | 26.9 | 28.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 33.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.8 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.9 | 14.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 124.2 | 68.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 124.2 | 68.6 |
| Damage taken a round of combat | 7.7 | 4.2 |
| Times Down | 0.32 | 0.35 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.56 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 3.39 | 4.47 |
| Rally Points used between fights | 1.44 | 1.36 |
| Rally Points left | 0.61 | 0.83 |
| **Buffs:** healed allies (Lay On Hands) | 71.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.8 |
| Divine Surge given (extra damage dealt by allies) | 24.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.19 |
| **Debuff:** Hindered (times) | 0.00 | 3.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.77 |
| **Debuff:** Immobilized (times) | 0.00 | 1.14 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 55% · Downs a day 0.92 · Rally Points left at the end 24% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 37% | 1% |
| 2: 6 standard | 99% | 4.5 | 38% | 22% |
| 3: 2 elite | 100% | 3.0 | 30% | 10% |
| 4: 1 elite, 4 standard | 97% | 4.6 | 45% | 36% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 420.1 | 373.2 |
| Damage a turn (its own turns) | 30.2 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.2 | 31.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.2 | 19.9 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.9 | 13.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 124.8 | 65.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 6.4 | 0.0 |
| Damage taken | 91.7 | 65.7 |
| Damage taken a round of combat | 5.8 | 4.1 |
| Times Down | 0.11 | 0.35 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.22 | 1.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.12 | 5.29 |
| Rally Points left | 2.66 | 1.39 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.5 |
| Divine Surge given (extra damage dealt by allies) | 21.9 | 0.0 |
| Banes given (damage its areas stopped) | 1.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.5 | 0.0 |
| Guard given (damage it took instead of Health) | 13.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 10.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.49 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.55 |
| **Debuff:** Immobilized (times) | 0.00 | 1.10 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 24% · Downs a day 0.33 · Rally Points left at the end 20% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 9% | 0% |
| 2: 6 standard | 100% | 4.3 | 7% | 4% |
| 3: 2 elite | 100% | 3.0 | 10% | 5% |
| 4: 1 elite, 4 standard | 99% | 4.3 | 18% | 19% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 389.0 | 408.5 |
| Damage a turn (its own turns) | 28.2 | 29.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.1 | 33.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.4 | 20.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.8 | 13.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 126.0 | 69.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.4 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.2 | 0.0 |
| Damage taken | 106.6 | 69.7 |
| Damage taken a round of combat | 6.9 | 4.5 |
| Times Down | 0.04 | 0.13 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 3.02 | 0.16 |
| Rally Points used through an ally's Lay On Hands | 3.07 | 5.27 |
| Rally Points used between fights | 0.97 | 1.04 |
| Rally Points left | 1.95 | 1.53 |
| **Buffs:** healed allies (Lay On Hands) | 77.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.9 |
| Divine Surge given (extra damage dealt by allies) | 23.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.1 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 28.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.21 |
| **Debuff:** Hindered (times) | 0.00 | 2.97 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.78 |
| **Debuff:** Immobilized (times) | 0.00 | 1.18 |
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
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.74 |
| **Debuff:** Prone (times) | 0.60 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 82% · a PC Down during the day 72% · Downs a day 1.63 · Rally Points left at the end 34% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 28% | 3% |
| 2: 2 elite, 2 standard | 85% | 5.0 | 56% | 57% |
| 3: 6 standard | 96% | 4.6 | 45% | 31% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 248.6 | 250.5 |
| Damage a turn (its own turns) | 25.7 | 25.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 28.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.2 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.9 | 9.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.3 | 45.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.3 | 45.9 |
| Damage taken a round of combat | 6.1 | 3.9 |
| Times Down | 0.36 | 0.45 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.61 | 1.32 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.65 | 3.34 |
| Rally Points left | 2.75 | 2.34 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 16.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 9.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.52 |
| **Debuff:** Immobilized (times) | 0.00 | 1.81 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 95% · a PC Down during the day 58% · Downs a day 0.97 · Rally Points left at the end 33% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 27% | 2% |
| 2: 2 elite, 2 standard | 96% | 5.0 | 47% | 44% |
| 3: 6 standard | 99% | 4.5 | 39% | 22% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 272.9 | 265.7 |
| Damage a turn (its own turns) | 25.6 | 25.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 29.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.5 | 18.2 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 10.8 | 10.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 88.1 | 45.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 60.8 | 45.8 |
| Damage taken a round of combat | 5.0 | 3.7 |
| Times Down | 0.13 | 0.36 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.26 | 1.26 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.80 | 3.70 |
| Rally Points left | 2.94 | 2.04 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 7.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 10.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.37 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.78 |
| **Debuff:** Immobilized (times) | 0.00 | 1.88 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 93% · a PC Down during the day 39% · Downs a day 0.76 · Rally Points left at the end 23% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 10% | 0% |
| 2: 2 elite, 2 standard | 95% | 4.5 | 32% | 29% |
| 3: 6 standard | 98% | 4.3 | 22% | 18% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 253.2 | 278.1 |
| Damage a turn (its own turns) | 25.6 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.7 | 30.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | 18.3 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.0 | 10.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.8 | 46.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 82.8 | 46.5 |
| Damage taken a round of combat | 7.2 | 4.0 |
| Times Down | 0.18 | 0.20 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.59 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 2.40 | 3.24 |
| Rally Points used between fights | 1.57 | 1.42 |
| Rally Points left | 1.44 | 1.99 |
| **Buffs:** healed allies (Lay On Hands) | 46.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.2 |
| Divine Surge given (extra damage dealt by allies) | 17.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.14 |
| **Debuff:** Immobilized (times) | 0.00 | 2.06 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 58% · Downs a day 1.18 · Rally Points left at the end 29% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 16% | 1% |
| 2: 2 elite, 2 standard | 90% | 4.7 | 47% | 47% |
| 3: 6 standard | 98% | 4.4 | 34% | 22% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 255.6 | 245.2 | 265.3 |
| Damage a turn (its own turns) | 26.0 | 25.7 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 20.3 | 30.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.5 | 37.4 | 18.4 |
| Share of the party's damage (%) | 25 | 24 | 26 |
| Turns taken | 9.9 | 9.7 | 9.9 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 83.4 | 78.4 | 45.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 70.6 | 78.4 | 45.7 |
| Damage taken a round of combat | 6.1 | 6.8 | 4.0 |
| Times Down | 0.23 | 0.32 | 0.31 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.75 | 3.19 | 0.70 |
| Rally Points used through an ally's Lay On Hands | 2.16 | 0.00 | 1.62 |
| Rally Points used between fights | 2.58 | 2.93 | 2.52 |
| Rally Points left | 2.51 | 1.88 | 2.16 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 44.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 17.8 | 17.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 12.8 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.8 | 1.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.38 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 2.90 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.96 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.13 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 81% · Downs a day 2.16 · Rally Points left at the end 43% · Health at the end 60%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 28% | 3% |
| 2: 2 elite, 2 standard | 70% | 5.2 | 65% | 72% |
| 3: 6 standard | 97% | 4.7 | 43% | 30% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 257.1 | 249.6 |
| Damage a turn (its own turns) | 27.7 | 26.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 29.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 41.4 | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.4 | 9.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 91.6 | 51.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.7 | 51.2 |
| Damage taken a round of combat | 7.2 | 4.6 |
| Times Down | 0.49 | 0.58 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.75 | 1.31 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.20 | 2.89 |
| Rally Points left | 4.05 | 2.80 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 15.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 10.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (times) | 0.00 | 1.65 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.03 |
| **Debuff:** Immobilized (times) | 0.00 | 0.69 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.00 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 85% · a PC Down during the day 53% · Downs a day 1.19 · Rally Points left at the end 27% · Health at the end 70%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 10% | 1% |
| 2: 2 elite, 2 standard | 86% | 4.8 | 40% | 45% |
| 3: 6 standard | 98% | 4.5 | 22% | 20% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 270.7 | 291.6 |
| Damage a turn (its own turns) | 27.1 | 28.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 32.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.3 | 18.5 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.1 | 10.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 95.4 | 53.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.4 | 53.5 |
| Damage taken a round of combat | 8.2 | 4.7 |
| Times Down | 0.26 | 0.33 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.75 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 2.50 | 3.09 |
| Rally Points used between fights | 1.44 | 1.46 |
| Rally Points left | 2.31 | 2.05 |
| **Buffs:** healed allies (Lay On Hands) | 51.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 18.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.33 |
| **Debuff:** Hindered (times) | 0.00 | 2.05 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.24 |
| **Debuff:** Immobilized (times) | 0.00 | 0.84 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 95% · a PC Down during the day 57% · Downs a day 0.97 · Rally Points left at the end 41% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 30% | 3% |
| 2: 2 elite, 2 standard | 95% | 4.7 | 46% | 44% |
| 3: 6 standard | 99% | 4.4 | 39% | 21% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 315.0 | 282.1 |
| Damage a turn (its own turns) | 30.1 | 28.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.0 | 31.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.5 | 20.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.5 | 10.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 98.6 | 51.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 5.1 | 0.0 |
| Damage taken | 74.0 | 51.8 |
| Damage taken a round of combat | 6.2 | 4.3 |
| Times Down | 0.14 | 0.34 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.10 | 1.15 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.71 | 4.05 |
| Rally Points left | 4.19 | 2.80 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 17.5 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.9 | 0.0 |
| Guard given (damage it took instead of Health) | 9.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.39 |
| **Debuff:** Hindered (times) | 0.00 | 1.84 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.15 |
| **Debuff:** Immobilized (times) | 0.00 | 0.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.10 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 20% · Downs a day 0.25 · Rally Points left at the end 37% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 10% | 1% |
| 2: 2 elite, 2 standard | 100% | 4.5 | 13% | 15% |
| 3: 6 standard | 100% | 4.2 | 10% | 6% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 295.0 | 316.7 |
| Damage a turn (its own turns) | 27.9 | 30.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.1 | 34.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.1 | 20.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.6 | 10.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 101.6 | 54.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.6 | 0.0 |
| Damage taken | 85.9 | 54.4 |
| Damage taken a round of combat | 7.3 | 4.6 |
| Times Down | 0.02 | 0.10 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.33 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 2.45 | 4.02 |
| Rally Points used between fights | 0.79 | 1.02 |
| Rally Points left | 3.43 | 2.78 |
| **Buffs:** healed allies (Lay On Hands) | 60.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.5 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 23.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.47 |
| **Debuff:** Hindered (times) | 0.00 | 2.32 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.32 |
| **Debuff:** Immobilized (times) | 0.00 | 0.87 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.15 |
