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
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 19% | 1% | 2 | 0% | 0% | 0% | 0% |
| 2 Elites | 4 | 3 / 3.1 / 3 | 100% | 28% | 8% | 2 | 1% | 2% | 3% | 2% |
| Elite + 2 Standards | 4 | 3 / 3.1 / 3 | 100% | 24% | 4% | 2 | 1% | 1% | 1% | 1% |
| 8 Grunts | 4 | 4 / 3.8 / 4 | 100% | 27% | 0% | 2 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.4 / 4 | 100% | 21% | 1% | 2 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.6 / 5 | 98% | 40% | 19% | 3 | 4% | 7% | 7% | 8% |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 75% · a PC Down during the day 73% · Downs a day 1.79 · Rally Points left at the end 29% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 1% |
| 2: 4 standard | 100% | 3.1 | 28% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 31% | 10% |
| 4: 2 elite, 2 standard | 75% | 5.0 | 64% | 68% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 301.9 | 278.8 |
| Damage a turn (its own turns) | 26.9 | 24.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 27.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.7 | 18.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.3 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 82.2 | 46.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.4 | 46.3 |
| Damage taken a round of combat | 5.2 | 3.3 |
| Times Down | 0.42 | 0.48 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.41 | 1.13 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.28 | 3.76 |
| Rally Points left | 2.31 | 2.10 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.6 |
| Divine Surge given (extra damage dealt by allies) | 18.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 9.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.83 |
| **Debuff:** Immobilized (times) | 0.00 | 1.92 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.53 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 89% · a PC Down during the day 62% · Downs a day 1.21 · Rally Points left at the end 28% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 27% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 29% | 9% |
| 4: 2 elite, 2 standard | 89% | 5.2 | 55% | 56% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 318.0 | 282.6 |
| Damage a turn (its own turns) | 26.7 | 24.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 27.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 18.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.0 | 11.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 86.4 | 44.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 64.7 | 44.9 |
| Damage taken a round of combat | 4.5 | 3.1 |
| Times Down | 0.20 | 0.40 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.27 | 1.12 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.33 | 4.02 |
| Rally Points left | 2.40 | 1.86 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.2 |
| Divine Surge given (extra damage dealt by allies) | 6.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.96 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.51 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 89% · a PC Down during the day 44% · Downs a day 0.88 · Rally Points left at the end 19% · Health at the end 68%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 9% | 0% |
| 2: 4 standard | 100% | 3.0 | 9% | 0% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 13% | 2% |
| 4: 2 elite, 2 standard | 89% | 4.6 | 44% | 43% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 293.8 | 297.2 |
| Damage a turn (its own turns) | 26.3 | 25.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 29.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.4 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.2 | 11.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 81.1 | 45.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.1 | 45.0 |
| Damage taken a round of combat | 6.0 | 3.3 |
| Times Down | 0.22 | 0.22 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.65 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 2.51 | 3.42 |
| Rally Points used between fights | 1.72 | 1.52 |
| Rally Points left | 1.13 | 1.72 |
| **Buffs:** healed allies (Lay On Hands) | 48.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 19.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.25 |
| **Debuff:** Immobilized (times) | 0.00 | 2.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.56 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 59% · Downs a day 1.30 · Rally Points left at the end 24% · Health at the end 67%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 12% | 0% |
| 2: 4 standard | 100% | 3.0 | 17% | 2% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 22% | 5% |
| 4: 2 elite, 2 standard | 83% | 4.8 | 55% | 56% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 308.0 | 293.9 | 287.8 |
| Damage a turn (its own turns) | 27.2 | 26.4 | 25.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 20.1 | 28.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.2 | 37.4 | 18.4 |
| Share of the party's damage (%) | 26 | 25 | 24 |
| Turns taken | 11.4 | 11.2 | 11.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 84.4 | 78.9 | 45.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 73.0 | 78.9 | 45.4 |
| Damage taken a round of combat | 5.3 | 5.8 | 3.3 |
| Times Down | 0.29 | 0.34 | 0.34 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.73 | 3.19 | 0.63 |
| Rally Points used through an ally's Lay On Hands | 2.51 | 0.00 | 1.84 |
| Rally Points used between fights | 2.83 | 3.26 | 2.65 |
| Rally Points left | 1.93 | 1.55 | 1.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 50.5 | 0.0 |
| Defense given (damage it stopped) | 3.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 18.5 | 19.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.4 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.29 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.13 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.02 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.56 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 60% · a PC Down during the day 82% · Downs a day 2.40 · Rally Points left at the end 34% · Health at the end 52%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 1% |
| 2: 4 standard | 100% | 3.1 | 27% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 33% | 16% |
| 4: 2 elite, 2 standard | 60% | 5.1 | 70% | 77% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 331.1 | 298.7 |
| Damage a turn (its own turns) | 29.0 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 29.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 42.0 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.5 | 11.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 96.8 | 54.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.6 | 54.3 |
| Damage taken a round of combat | 6.1 | 3.8 |
| Times Down | 0.56 | 0.64 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.65 | 1.16 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.13 | 3.54 |
| Rally Points left | 3.22 | 2.30 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.25 |
| **Debuff:** Hindered (times) | 0.00 | 1.97 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.61 |
| **Debuff:** Immobilized (times) | 0.00 | 1.08 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 78% · a PC Down during the day 62% · Downs a day 1.48 · Rally Points left at the end 20% · Health at the end 59%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 9% | 0% |
| 2: 4 standard | 100% | 3.1 | 9% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 15% | 7% |
| 4: 2 elite, 2 standard | 78% | 4.9 | 53% | 59% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 323.6 | 321.8 |
| Damage a turn (its own turns) | 27.7 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 31.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.4 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.7 | 11.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 97.8 | 55.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 97.8 | 55.6 |
| Damage taken a round of combat | 7.0 | 4.0 |
| Times Down | 0.35 | 0.39 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.89 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 2.65 | 3.44 |
| Rally Points used between fights | 1.74 | 1.59 |
| Rally Points left | 1.72 | 1.52 |
| **Buffs:** healed allies (Lay On Hands) | 55.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 19.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.32 |
| **Debuff:** Hindered (times) | 0.00 | 2.21 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.71 |
| **Debuff:** Immobilized (times) | 0.00 | 1.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.57 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 92% · a PC Down during the day 57% · Downs a day 1.02 · Rally Points left at the end 35% · Health at the end 84%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 22% | 1% |
| 2: 4 standard | 100% | 3.1 | 29% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 28% | 7% |
| 4: 2 elite, 2 standard | 92% | 4.9 | 52% | 51% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 359.0 | 304.5 |
| Damage a turn (its own turns) | 30.5 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.2 | 30.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.8 | 19.9 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.8 | 11.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.3 | 51.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.4 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.6 | 0.0 |
| Damage taken | 77.7 | 51.0 |
| Damage taken a round of combat | 5.6 | 3.7 |
| Times Down | 0.17 | 0.34 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.06 | 0.96 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.42 | 4.55 |
| Rally Points left | 3.51 | 2.49 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 8.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.29 |
| **Debuff:** Hindered (times) | 0.00 | 1.99 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.09 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.57 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 28% · Downs a day 0.39 · Rally Points left at the end 26% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 0% |
| 2: 4 standard | 100% | 3.1 | 10% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 11% | 3% |
| 4: 2 elite, 2 standard | 98% | 4.6 | 25% | 25% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 333.4 | 331.0 |
| Damage a turn (its own turns) | 28.3 | 28.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.2 | 32.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.2 | 19.8 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 98.0 | 52.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 86.8 | 52.9 |
| Damage taken a round of combat | 6.3 | 3.9 |
| Times Down | 0.05 | 0.15 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.44 | 0.22 |
| Rally Points used through an ally's Lay On Hands | 2.60 | 4.19 |
| Rally Points used between fights | 1.46 | 1.60 |
| Rally Points left | 2.50 | 1.99 |
| **Buffs:** healed allies (Lay On Hands) | 63.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 20.4 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (times) | 0.00 | 2.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.77 |
| **Debuff:** Immobilized (times) | 0.00 | 1.19 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.51 |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 72% · a PC Down during the day 79% · Downs a day 2.20 · Rally Points left at the end 14% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 40% | 1% |
| 2: 6 standard | 96% | 4.6 | 47% | 32% |
| 3: 2 elite | 100% | 3.1 | 35% | 20% |
| 4: 1 elite, 4 standard | 75% | 4.8 | 60% | 63% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 342.7 | 335.1 |
| Damage a turn (its own turns) | 25.6 | 25.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 28.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.7 | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.5 | 13.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 107.1 | 59.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 91.1 | 59.6 |
| Damage taken a round of combat | 5.7 | 3.7 |
| Times Down | 0.48 | 0.62 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.92 | 1.58 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.00 | 4.46 |
| Rally Points left | 1.09 | 0.96 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 21.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 16.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.53 |
| **Debuff:** Immobilized (times) | 0.00 | 2.41 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.37 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 92% · a PC Down during the day 70% · Downs a day 1.36 · Rally Points left at the end 13% · Health at the end 67%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 38% | 1% |
| 2: 6 standard | 99% | 4.7 | 42% | 26% |
| 3: 2 elite | 100% | 3.1 | 33% | 15% |
| 4: 1 elite, 4 standard | 93% | 5.0 | 51% | 51% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 366.3 | 348.8 |
| Damage a turn (its own turns) | 25.4 | 25.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 28.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.7 | 18.0 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 14.5 | 13.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 113.7 | 58.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.6 | 58.6 |
| Damage taken a round of combat | 4.7 | 3.5 |
| Times Down | 0.18 | 0.51 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.55 | 1.61 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.13 | 4.73 |
| Rally Points left | 1.32 | 0.66 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.2 |
| Divine Surge given (extra damage dealt by allies) | 9.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 15.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.73 |
| **Debuff:** Immobilized (times) | 0.00 | 2.47 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 66% · a PC Down during the day 76% · Downs a day 2.19 · Rally Points left at the end 6% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 14% | 0% |
| 2: 6 standard | 99% | 4.3 | 24% | 11% |
| 3: 2 elite | 100% | 3.0 | 19% | 11% |
| 4: 1 elite, 4 standard | 66% | 4.6 | 56% | 73% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 329.8 | 354.3 |
| Damage a turn (its own turns) | 25.7 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 30.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.1 | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 12.9 | 13.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 106.0 | 62.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 106.0 | 62.8 |
| Damage taken a round of combat | 6.8 | 4.0 |
| Times Down | 0.57 | 0.53 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.14 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 2.87 | 4.37 |
| Rally Points used between fights | 1.72 | 1.61 |
| Rally Points left | 0.28 | 0.64 |
| **Buffs:** healed allies (Lay On Hands) | 58.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.20 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.08 |
| **Debuff:** Immobilized (times) | 0.00 | 2.73 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 73% · a PC Down during the day 71% · Downs a day 1.98 · Rally Points left at the end 10% · Health at the end 43%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 26% | 0% |
| 2: 6 standard | 97% | 4.4 | 38% | 22% |
| 3: 2 elite | 100% | 3.1 | 26% | 13% |
| 4: 1 elite, 4 standard | 75% | 4.6 | 55% | 64% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 346.8 | 328.5 | 347.3 |
| Damage a turn (its own turns) | 26.1 | 25.7 | 26.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.7 | 20.7 | 30.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.9 | 36.8 | 17.9 |
| Share of the party's damage (%) | 25 | 24 | 25 |
| Turns taken | 13.4 | 12.9 | 13.1 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 110.0 | 102.7 | 59.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 91.4 | 102.7 | 59.3 |
| Damage taken a round of combat | 5.9 | 6.6 | 3.8 |
| Times Down | 0.41 | 0.55 | 0.51 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.83 | 3.89 | 0.77 |
| Rally Points used through an ally's Lay On Hands | 2.92 | 0.00 | 2.24 |
| Rally Points used between fights | 3.32 | 3.68 | 3.14 |
| Rally Points left | 0.93 | 0.43 | 0.86 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 60.3 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 22.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 18.6 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.84 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.63 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.46 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 68% · a PC Down during the day 84% · Downs a day 2.52 · Rally Points left at the end 16% · Health at the end 47%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 37% | 1% |
| 2: 6 standard | 95% | 4.9 | 48% | 35% |
| 3: 2 elite | 98% | 3.3 | 39% | 26% |
| 4: 1 elite, 4 standard | 73% | 5.1 | 63% | 69% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 374.9 | 364.0 |
| Damage a turn (its own turns) | 27.4 | 26.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 30.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.9 | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.8 | 13.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 122.5 | 67.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 105.9 | 67.1 |
| Damage taken a round of combat | 6.4 | 4.1 |
| Times Down | 0.57 | 0.69 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.29 | 1.64 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.09 | 4.34 |
| Rally Points left | 1.62 | 1.02 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 22.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 16.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.05 |
| **Debuff:** Hindered (times) | 0.00 | 2.52 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.54 |
| **Debuff:** Immobilized (times) | 0.00 | 1.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.35 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 63% · a PC Down during the day 77% · Downs a day 2.35 · Rally Points left at the end 7% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 11% | 0% |
| 2: 6 standard | 98% | 4.4 | 23% | 14% |
| 3: 2 elite | 99% | 3.2 | 22% | 18% |
| 4: 1 elite, 4 standard | 64% | 4.9 | 58% | 73% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 365.5 | 388.1 |
| Damage a turn (its own turns) | 26.9 | 28.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 32.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.7 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.7 | 13.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 124.5 | 70.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 124.5 | 70.6 |
| Damage taken a round of combat | 7.7 | 4.4 |
| Times Down | 0.56 | 0.61 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.50 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 3.29 | 4.35 |
| Rally Points used between fights | 1.73 | 1.61 |
| Rally Points left | 0.48 | 0.64 |
| **Buffs:** healed allies (Lay On Hands) | 69.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.5 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.14 |
| **Debuff:** Hindered (times) | 0.00 | 2.88 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.12 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 94% · a PC Down during the day 63% · Downs a day 1.23 · Rally Points left at the end 20% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 38% | 1% |
| 2: 6 standard | 100% | 4.5 | 41% | 25% |
| 3: 2 elite | 100% | 3.0 | 31% | 12% |
| 4: 1 elite, 4 standard | 94% | 4.8 | 50% | 46% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 423.4 | 367.6 |
| Damage a turn (its own turns) | 30.1 | 27.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.1 | 30.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.3 | 20.1 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.1 | 13.3 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 126.6 | 66.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 6.7 | 0.0 |
| Damage taken | 93.3 | 66.6 |
| Damage taken a round of combat | 5.8 | 4.1 |
| Times Down | 0.16 | 0.45 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.43 | 1.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.20 | 5.46 |
| Rally Points left | 2.37 | 1.09 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.3 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 1.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.6 | 0.0 |
| Guard given (damage it took instead of Health) | 13.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.19 |
| **Debuff:** Hindered (times) | 0.00 | 2.42 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.57 |
| **Debuff:** Immobilized (times) | 0.00 | 1.06 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.47 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 45% · Downs a day 0.74 · Rally Points left at the end 11% · Health at the end 70%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 12% | 0% |
| 2: 6 standard | 100% | 4.4 | 13% | 6% |
| 3: 2 elite | 100% | 3.0 | 14% | 7% |
| 4: 1 elite, 4 standard | 97% | 4.6 | 32% | 40% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 394.5 | 400.4 |
| Damage a turn (its own turns) | 28.0 | 29.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.0 | 33.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.3 | 20.1 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.1 | 13.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 131.0 | 68.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 4.7 | 0.0 |
| Damage taken | 110.8 | 68.6 |
| Damage taken a round of combat | 7.0 | 4.3 |
| Times Down | 0.09 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 3.17 | 0.23 |
| Rally Points used through an ally's Lay On Hands | 3.31 | 5.29 |
| Rally Points used between fights | 1.46 | 1.67 |
| Rally Points left | 1.06 | 0.81 |
| **Buffs:** healed allies (Lay On Hands) | 80.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 23.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.7 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.25 |
| **Debuff:** Hindered (times) | 0.00 | 2.94 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.70 |
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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 74% · a PC Down during the day 78% · Downs a day 1.98 · Rally Points left at the end 35% · Health at the end 62%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 28% | 3% |
| 2: 2 elite, 2 standard | 78% | 5.0 | 63% | 65% |
| 3: 6 standard | 95% | 4.6 | 48% | 35% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 239.1 | 237.9 |
| Damage a turn (its own turns) | 25.7 | 25.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.8 | 27.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.2 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 9.4 | 9.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 79.8 | 44.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.2 | 44.5 |
| Damage taken a round of combat | 6.1 | 4.0 |
| Times Down | 0.47 | 0.52 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.67 | 1.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.55 | 3.23 |
| Rally Points left | 2.77 | 2.44 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 15.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.48 |
| **Debuff:** Immobilized (times) | 0.00 | 1.64 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.04 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 87% · a PC Down during the day 68% · Downs a day 1.37 · Rally Points left at the end 31% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 28% | 3% |
| 2: 2 elite, 2 standard | 88% | 5.1 | 55% | 53% |
| 3: 6 standard | 99% | 4.7 | 43% | 28% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 266.4 | 252.8 |
| Damage a turn (its own turns) | 25.4 | 25.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.0 | 28.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.6 | 9.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 87.9 | 45.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.4 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 61.4 | 45.3 |
| Damage taken a round of combat | 5.1 | 3.7 |
| Times Down | 0.22 | 0.46 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.51 | 1.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.70 | 3.67 |
| Rally Points left | 2.79 | 1.93 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 7.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.76 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.08 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 52% · Downs a day 1.13 · Rally Points left at the end 20% · Health at the end 66%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 11% | 1% |
| 2: 2 elite, 2 standard | 91% | 4.6 | 41% | 38% |
| 3: 6 standard | 96% | 4.3 | 30% | 27% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 247.8 | 270.8 |
| Damage a turn (its own turns) | 25.5 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 30.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.1 | 18.4 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 9.8 | 10.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 81.6 | 46.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.6 | 46.2 |
| Damage taken a round of combat | 7.1 | 4.0 |
| Times Down | 0.28 | 0.29 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.58 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 2.38 | 3.17 |
| Rally Points used between fights | 1.79 | 1.69 |
| Rally Points left | 1.25 | 1.70 |
| **Buffs:** healed allies (Lay On Hands) | 45.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.3 |
| Divine Surge given (extra damage dealt by allies) | 17.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.38 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.02 |
| **Debuff:** Immobilized (times) | 0.00 | 2.03 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.12 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 82% · a PC Down during the day 65% · Downs a day 1.50 · Rally Points left at the end 27% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 18% | 1% |
| 2: 2 elite, 2 standard | 85% | 4.7 | 54% | 53% |
| 3: 6 standard | 97% | 4.5 | 40% | 28% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 251.1 | 238.3 | 256.5 |
| Damage a turn (its own turns) | 26.0 | 25.7 | 26.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 20.4 | 29.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.7 | 36.8 | 18.2 |
| Share of the party's damage (%) | 25 | 24 | 26 |
| Turns taken | 9.8 | 9.4 | 9.7 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 82.4 | 77.6 | 45.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 70.5 | 77.6 | 45.7 |
| Damage taken a round of combat | 6.2 | 6.8 | 4.0 |
| Times Down | 0.31 | 0.41 | 0.39 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 1.02 | 3.13 | 0.87 |
| Rally Points used through an ally's Lay On Hands | 2.04 | 0.00 | 1.59 |
| Rally Points used between fights | 2.68 | 3.08 | 2.58 |
| Rally Points left | 2.26 | 1.79 | 1.97 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 42.3 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.5 |
| Divine Surge given (extra damage dealt by allies) | 16.8 | 17.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 11.9 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 2.77 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.87 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.06 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 56% · a PC Down during the day 85% · Downs a day 2.57 · Rally Points left at the end 45% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 28% | 3% |
| 2: 2 elite, 2 standard | 60% | 5.1 | 70% | 76% |
| 3: 6 standard | 94% | 5.0 | 49% | 41% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 243.6 | 231.8 |
| Damage a turn (its own turns) | 27.8 | 26.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 29.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 8.9 | 8.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 87.9 | 50.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.8 | 50.5 |
| Damage taken a round of combat | 7.2 | 4.7 |
| Times Down | 0.60 | 0.68 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.84 | 1.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.95 | 2.63 |
| Rally Points left | 4.21 | 2.99 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 14.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 10.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.06 |
| **Debuff:** Hindered (times) | 0.00 | 1.51 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.98 |
| **Debuff:** Immobilized (times) | 0.00 | 0.66 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.97 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 78% · a PC Down during the day 67% · Downs a day 1.70 · Rally Points left at the end 24% · Health at the end 58%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 11% | 1% |
| 2: 2 elite, 2 standard | 81% | 4.9 | 51% | 56% |
| 3: 6 standard | 96% | 4.6 | 30% | 31% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 264.9 | 280.9 |
| Damage a turn (its own turns) | 27.0 | 28.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 32.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.2 | 18.3 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 9.9 | 9.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 96.0 | 53.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 96.0 | 53.3 |
| Damage taken a round of combat | 8.3 | 4.7 |
| Times Down | 0.39 | 0.46 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.81 | 0.53 |
| Rally Points used through an ally's Lay On Hands | 2.44 | 2.94 |
| Rally Points used between fights | 1.75 | 1.66 |
| Rally Points left | 2.01 | 1.87 |
| **Buffs:** healed allies (Lay On Hands) | 49.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.2 |
| Divine Surge given (extra damage dealt by allies) | 17.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.32 |
| **Debuff:** Hindered (times) | 0.00 | 2.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.15 |
| **Debuff:** Immobilized (times) | 0.00 | 0.84 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.06 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 93% · a PC Down during the day 61% · Downs a day 1.13 · Rally Points left at the end 37% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 31% | 4% |
| 2: 2 elite, 2 standard | 93% | 4.8 | 51% | 47% |
| 3: 6 standard | 99% | 4.5 | 42% | 25% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 313.7 | 276.8 |
| Damage a turn (its own turns) | 29.9 | 27.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.8 | 30.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.4 | 20.0 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.6 | 10.0 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 99.7 | 51.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 5.0 | 0.0 |
| Damage taken | 75.3 | 51.6 |
| Damage taken a round of combat | 6.3 | 4.3 |
| Times Down | 0.17 | 0.39 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.29 | 1.25 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.86 | 4.28 |
| Rally Points left | 3.85 | 2.47 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 17.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.9 | 0.0 |
| Guard given (damage it took instead of Health) | 9.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.37 |
| **Debuff:** Hindered (times) | 0.00 | 1.76 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.15 |
| **Debuff:** Immobilized (times) | 0.00 | 0.76 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.10 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 33% · Downs a day 0.49 · Rally Points left at the end 26% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 12% | 1% |
| 2: 2 elite, 2 standard | 98% | 4.6 | 24% | 26% |
| 3: 6 standard | 100% | 4.3 | 20% | 13% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 296.6 | 309.0 |
| Damage a turn (its own turns) | 27.9 | 29.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.1 | 33.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.1 | 20.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.7 | 10.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 102.4 | 54.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.4 | 0.0 |
| Damage taken | 86.9 | 54.4 |
| Damage taken a round of combat | 7.3 | 4.6 |
| Times Down | 0.06 | 0.19 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.42 | 0.26 |
| Rally Points used through an ally's Lay On Hands | 2.54 | 4.12 |
| Rally Points used between fights | 1.46 | 1.75 |
| Rally Points left | 2.57 | 1.87 |
| **Buffs:** healed allies (Lay On Hands) | 62.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.6 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.43 |
| **Debuff:** Hindered (times) | 0.00 | 2.19 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.30 |
| **Debuff:** Immobilized (times) | 0.00 | 0.88 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.13 |
