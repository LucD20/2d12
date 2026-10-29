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
| 4 Standards | 4 | 3 / 3.0 / 3 | 100% | 14% | 1% | 2 | 0% | 0% | 0% | 0% |
| 2 Elites | 4 | 3 / 3.1 / 3 | 100% | 22% | 6% | 2 | 1% | 1% | 3% | 2% |
| Elite + 2 Standards | 4 | 3 / 3.0 / 3 | 100% | 18% | 3% | 2 | 0% | 0% | 1% | 1% |
| 8 Grunts | 4 | 4 / 3.8 / 4 | 100% | 18% | 0% | 2 | 0% | 0% | 0% | 0% |
| 2 Standards + 8 Minions | 4 | 3 / 3.4 / 4 | 100% | 15% | 1% | 3 | 0% | 0% | 0% | 0% |
| 6 Standards (CV 6, hard) | 6 | 5 / 4.6 / 5 | 100% | 27% | 11% | 2 | 2% | 2% | 5% | 5% |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 95% · a PC Down during the day 50% · Downs a day 0.82 · Rally Points left at the end 37% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 1% |
| 2: 4 standard | 100% | 3.0 | 25% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 23% | 6% |
| 4: 2 elite, 2 standard | 95% | 4.9 | 45% | 45% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 314.5 | 281.8 |
| Damage a turn (its own turns) | 27.0 | 24.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.2 | 27.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 18.2 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.8 | 11.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 83.9 | 43.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 52.8 | 43.6 |
| Damage taken a round of combat | 3.8 | 3.1 |
| Times Down | 0.11 | 0.30 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 0.74 | 1.02 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.79 | 3.97 |
| Rally Points left | 3.47 | 2.01 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 18.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.90 |
| **Debuff:** Immobilized (times) | 0.00 | 1.98 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.51 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 95% · a PC Down during the day 50% · Downs a day 0.81 · Rally Points left at the end 32% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 0% |
| 2: 4 standard | 100% | 3.1 | 26% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 27% | 7% |
| 4: 2 elite, 2 standard | 95% | 5.1 | 46% | 44% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 318.3 | 289.8 |
| Damage a turn (its own turns) | 26.8 | 24.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 28.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.0 | 18.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.0 | 11.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 85.2 | 44.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 59.4 | 44.6 |
| Damage taken a round of combat | 4.2 | 3.2 |
| Times Down | 0.11 | 0.29 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 0.89 | 1.02 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.24 | 4.00 |
| Rally Points left | 2.86 | 1.99 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.3 |
| Divine Surge given (extra damage dealt by allies) | 6.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 14.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.08 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.53 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 99% · a PC Down during the day 19% · Downs a day 0.24 · Rally Points left at the end 38% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 7% | 0% |
| 2: 4 standard | 100% | 3.0 | 6% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 6% | 2% |
| 4: 2 elite, 2 standard | 99% | 4.4 | 15% | 17% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 298.1 | 298.5 |
| Damage a turn (its own turns) | 26.2 | 26.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 29.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.4 | 18.5 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.4 | 11.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 80.3 | 43.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 52.5 | 43.2 |
| Damage taken a round of combat | 4.0 | 3.3 |
| Times Down | 0.03 | 0.09 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.08 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 1.87 | 3.83 |
| Rally Points used between fights | 0.58 | 0.82 |
| Rally Points left | 3.47 | 2.17 |
| **Buffs:** healed allies (Lay On Hands) | 44.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 27.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 11.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.32 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 97% · a PC Down during the day 34% · Downs a day 0.48 · Rally Points left at the end 38% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 10% | 0% |
| 2: 4 standard | 100% | 3.0 | 13% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 12% | 3% |
| 4: 2 elite, 2 standard | 97% | 4.5 | 30% | 31% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 311.6 | 298.5 | 291.9 |
| Damage a turn (its own turns) | 27.3 | 26.3 | 25.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.4 | 20.1 | 29.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 40.1 | 37.5 | 18.5 |
| Share of the party's damage (%) | 26 | 25 | 24 |
| Turns taken | 11.5 | 11.4 | 11.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 81.2 | 78.9 | 42.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 51.0 | 51.4 | 42.7 |
| Damage taken a round of combat | 3.8 | 3.8 | 3.2 |
| Times Down | 0.06 | 0.06 | 0.18 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.26 | 2.51 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 2.30 | 0.00 | 2.29 |
| Rally Points used between fights | 1.79 | 1.97 | 2.18 |
| Rally Points left | 3.65 | 3.52 | 2.13 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 54.4 | 0.0 |
| Defense given (damage it stopped) | 3.7 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 4.4 |
| Divine Surge given (extra damage dealt by allies) | 19.2 | 19.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 30.1 | 27.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.4 | 0.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.19 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.14 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.55 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 89% · a PC Down during the day 62% · Downs a day 1.22 · Rally Points left at the end 38% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 0% |
| 2: 4 standard | 100% | 3.1 | 25% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 26% | 11% |
| 4: 2 elite, 2 standard | 89% | 5.3 | 51% | 56% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 350.5 | 306.7 |
| Damage a turn (its own turns) | 28.6 | 26.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 30.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 42.0 | 18.4 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.3 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 100.7 | 51.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 65.9 | 51.7 |
| Damage taken a round of combat | 4.6 | 3.6 |
| Times Down | 0.18 | 0.43 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.07 | 1.10 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.79 | 3.96 |
| Rally Points left | 4.14 | 1.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 19.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.24 |
| **Debuff:** Hindered (times) | 0.00 | 2.03 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.57 |
| **Debuff:** Immobilized (times) | 0.00 | 1.11 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.53 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 97% · a PC Down during the day 32% · Downs a day 0.49 · Rally Points left at the end 36% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 7% | 0% |
| 2: 4 standard | 100% | 3.1 | 6% | 1% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 7% | 3% |
| 4: 2 elite, 2 standard | 97% | 4.8 | 21% | 30% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 332.0 | 328.2 |
| Damage a turn (its own turns) | 27.6 | 27.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 32.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.6 | 18.4 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 12.1 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 97.9 | 51.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 65.8 | 51.9 |
| Damage taken a round of combat | 4.7 | 3.7 |
| Times Down | 0.06 | 0.19 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.33 | 0.25 |
| Rally Points used through an ally's Lay On Hands | 2.08 | 3.87 |
| Rally Points used between fights | 0.67 | 1.03 |
| Rally Points left | 3.92 | 1.85 |
| **Buffs:** healed allies (Lay On Hands) | 52.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.0 |
| Divine Surge given (extra damage dealt by allies) | 20.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (times) | 0.00 | 2.35 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.74 |
| **Debuff:** Immobilized (times) | 0.00 | 1.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 40% · Downs a day 0.54 · Rally Points left at the end 47% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 1% |
| 2: 4 standard | 100% | 3.1 | 28% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 21% | 6% |
| 4: 2 elite, 2 standard | 100% | 4.6 | 35% | 33% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 365.1 | 304.6 |
| Damage a turn (its own turns) | 30.9 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.6 | 30.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.7 | 19.9 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.9 | 11.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 94.5 | 48.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 10.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 7.7 | 0.0 |
| Damage taken | 54.3 | 48.9 |
| Damage taken a round of combat | 4.0 | 3.6 |
| Times Down | 0.03 | 0.24 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.42 | 0.84 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.36 | 4.42 |
| Rally Points left | 5.22 | 2.74 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.1 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.5 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.7 | 0.0 |
| Guard given (damage it took instead of Health) | 29.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.30 |
| **Debuff:** Hindered (times) | 0.00 | 1.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.63 |
| **Debuff:** Immobilized (times) | 0.00 | 1.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.55 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 13% · Downs a day 0.14 · Rally Points left at the end 47% · Health at the end 95%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 6% | 0% |
| 2: 4 standard | 100% | 3.1 | 6% | 0% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 5% | 2% |
| 4: 2 elite, 2 standard | 100% | 4.4 | 8% | 11% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 332.5 | 332.2 |
| Damage a turn (its own turns) | 28.3 | 28.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.4 | 32.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.0 | 19.7 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 11.8 | 11.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 96.9 | 52.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 7.8 | 0.0 |
| Damage taken | 57.0 | 52.0 |
| Damage taken a round of combat | 4.2 | 3.8 |
| Times Down | 0.00 | 0.07 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.83 | 0.14 |
| Rally Points used through an ally's Lay On Hands | 1.75 | 4.31 |
| Rally Points used between fights | 0.32 | 0.74 |
| Rally Points left | 5.11 | 2.81 |
| **Buffs:** healed allies (Lay On Hands) | 53.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 19.8 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.4 | 0.0 |
| Guard given (damage it took instead of Health) | 28.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.4 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.31 |
| **Debuff:** Hindered (times) | 0.00 | 2.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.78 |
| **Debuff:** Immobilized (times) | 0.00 | 1.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.59 |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 97% · a PC Down during the day 56% · Downs a day 0.93 · Rally Points left at the end 23% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 36% | 1% |
| 2: 6 standard | 100% | 4.5 | 36% | 21% |
| 3: 2 elite | 100% | 3.0 | 26% | 11% |
| 4: 1 elite, 4 standard | 98% | 4.7 | 42% | 39% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 362.0 | 349.1 |
| Damage a turn (its own turns) | 25.7 | 25.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 29.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.0 | 18.0 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.1 | 13.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 109.1 | 56.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 62.4 | 56.7 |
| Damage taken a round of combat | 3.9 | 3.5 |
| Times Down | 0.09 | 0.37 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 0.90 | 1.43 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.56 | 4.72 |
| Rally Points left | 2.54 | 0.86 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.2 |
| Divine Surge given (extra damage dealt by allies) | 23.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 46.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.3 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.18 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.72 |
| **Debuff:** Immobilized (times) | 0.00 | 2.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.43 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 99% · a PC Down during the day 56% · Downs a day 0.87 · Rally Points left at the end 16% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 37% | 1% |
| 2: 6 standard | 100% | 4.5 | 37% | 19% |
| 3: 2 elite | 100% | 3.1 | 30% | 10% |
| 4: 1 elite, 4 standard | 99% | 4.9 | 43% | 40% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 367.9 | 356.9 |
| Damage a turn (its own turns) | 25.5 | 25.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 29.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.0 | 17.9 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.5 | 13.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 112.4 | 58.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.6 | 58.8 |
| Damage taken a round of combat | 4.5 | 3.6 |
| Times Down | 0.07 | 0.36 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.22 | 1.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.09 | 4.78 |
| Rally Points left | 1.69 | 0.77 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.6 |
| Divine Surge given (extra damage dealt by allies) | 9.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 19.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 10.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.83 |
| **Debuff:** Immobilized (times) | 0.00 | 2.60 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.46 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 99% · a PC Down during the day 29% · Downs a day 0.41 · Rally Points left at the end 23% · Health at the end 82%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 7% | 0% |
| 2: 6 standard | 100% | 4.2 | 8% | 5% |
| 3: 2 elite | 100% | 3.0 | 8% | 4% |
| 4: 1 elite, 4 standard | 99% | 4.4 | 17% | 24% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 345.6 | 369.0 |
| Damage a turn (its own turns) | 25.3 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 31.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.7 | 13.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 109.3 | 58.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 65.0 | 58.3 |
| Damage taken a round of combat | 4.2 | 3.8 |
| Times Down | 0.03 | 0.18 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.68 | 0.19 |
| Rally Points used through an ally's Lay On Hands | 2.31 | 5.12 |
| Rally Points used between fights | 0.53 | 0.75 |
| Rally Points left | 2.48 | 0.94 |
| **Buffs:** healed allies (Lay On Hands) | 57.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.8 |
| Divine Surge given (extra damage dealt by allies) | 23.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 44.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.22 |
| **Debuff:** Immobilized (times) | 0.00 | 2.90 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.45 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 99% · a PC Down during the day 41% · Downs a day 0.64 · Rally Points left at the end 23% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 19% | 0% |
| 2: 6 standard | 100% | 4.3 | 20% | 12% |
| 3: 2 elite | 100% | 3.0 | 16% | 8% |
| 4: 1 elite, 4 standard | 99% | 4.5 | 27% | 31% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 360.3 | 347.7 | 360.1 |
| Damage a turn (its own turns) | 26.1 | 25.3 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.0 | 20.7 | 30.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.8 | 36.6 | 17.9 |
| Share of the party's damage (%) | 25 | 24 | 25 |
| Turns taken | 13.9 | 13.8 | 13.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 108.7 | 108.3 | 57.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 62.6 | 64.2 | 57.2 |
| Damage taken a round of combat | 4.0 | 4.1 | 3.7 |
| Times Down | 0.05 | 0.06 | 0.27 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.32 | 3.25 | 0.50 |
| Rally Points used through an ally's Lay On Hands | 2.84 | 0.00 | 3.05 |
| Rally Points used between fights | 2.19 | 2.33 | 2.49 |
| Rally Points left | 2.66 | 2.42 | 0.96 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 70.6 | 0.0 |
| Defense given (damage it stopped) | 4.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 5.0 |
| Divine Surge given (extra damage dealt by allies) | 22.1 | 23.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 46.1 | 44.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 22.5 | 1.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 3.22 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.18 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.76 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.46 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 95% · a PC Down during the day 64% · Downs a day 1.20 · Rally Points left at the end 24% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 35% | 1% |
| 2: 6 standard | 99% | 4.6 | 36% | 20% |
| 3: 2 elite | 100% | 3.2 | 29% | 18% |
| 4: 1 elite, 4 standard | 95% | 5.1 | 46% | 48% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 408.1 | 377.0 |
| Damage a turn (its own turns) | 27.7 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.9 | 30.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 41.0 | 17.8 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 14.8 | 13.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 127.1 | 64.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 75.8 | 64.9 |
| Damage taken a round of combat | 4.5 | 3.9 |
| Times Down | 0.14 | 0.46 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.20 | 1.54 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.69 | 4.67 |
| Rally Points left | 3.11 | 0.79 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.2 |
| Divine Surge given (extra damage dealt by allies) | 24.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 51.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.6 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.11 |
| **Debuff:** Hindered (times) | 0.00 | 2.64 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.53 |
| **Debuff:** Immobilized (times) | 0.00 | 1.05 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.37 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 99% · a PC Down during the day 39% · Downs a day 0.58 · Rally Points left at the end 23% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 7% | 0% |
| 2: 6 standard | 100% | 4.3 | 8% | 6% |
| 3: 2 elite | 100% | 3.1 | 10% | 8% |
| 4: 1 elite, 4 standard | 99% | 4.8 | 20% | 34% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 383.8 | 405.6 |
| Damage a turn (its own turns) | 26.8 | 29.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 33.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.8 | 18.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 14.4 | 14.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 126.1 | 66.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.2 | 66.8 |
| Damage taken a round of combat | 4.9 | 4.1 |
| Times Down | 0.04 | 0.25 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.97 | 0.23 |
| Rally Points used through an ally's Lay On Hands | 2.53 | 5.18 |
| Rally Points used between fights | 0.61 | 0.84 |
| Rally Points left | 2.88 | 0.75 |
| **Buffs:** healed allies (Lay On Hands) | 67.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 47.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.21 |
| **Debuff:** Hindered (times) | 0.00 | 3.07 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.75 |
| **Debuff:** Immobilized (times) | 0.00 | 1.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.40 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 50% · Downs a day 0.68 · Rally Points left at the end 36% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 35% | 1% |
| 2: 6 standard | 100% | 4.4 | 28% | 17% |
| 3: 2 elite | 100% | 3.0 | 24% | 9% |
| 4: 1 elite, 4 standard | 100% | 4.5 | 38% | 33% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 428.5 | 371.3 |
| Damage a turn (its own turns) | 30.5 | 27.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.6 | 31.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.4 | 19.9 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.1 | 13.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 123.4 | 65.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 12.6 | 0.0 |
| Damage taken | 60.0 | 65.7 |
| Damage taken a round of combat | 3.8 | 4.2 |
| Times Down | 0.02 | 0.32 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.46 | 1.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.77 | 5.38 |
| Rally Points left | 4.77 | 1.27 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 5.2 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 1.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.7 | 0.0 |
| Guard given (damage it took instead of Health) | 44.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.46 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.56 |
| **Debuff:** Immobilized (times) | 0.00 | 1.07 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.42 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 19% · Downs a day 0.23 · Rally Points left at the end 36% · Health at the end 90%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 6% | 0% |
| 2: 6 standard | 100% | 4.3 | 4% | 4% |
| 3: 2 elite | 100% | 3.0 | 7% | 5% |
| 4: 1 elite, 4 standard | 100% | 4.3 | 10% | 13% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 389.7 | 406.6 |
| Damage a turn (its own turns) | 28.2 | 29.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.1 | 33.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.3 | 20.0 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 13.9 | 13.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 127.4 | 69.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 12.9 | 0.0 |
| Damage taken | 64.4 | 69.0 |
| Damage taken a round of combat | 4.2 | 4.4 |
| Times Down | 0.00 | 0.12 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.19 | 0.14 |
| Rally Points used through an ally's Lay On Hands | 1.94 | 5.71 |
| Rally Points used between fights | 0.26 | 0.64 |
| Rally Points left | 4.61 | 1.51 |
| **Buffs:** healed allies (Lay On Hands) | 66.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 4.7 |
| Divine Surge given (extra damage dealt by allies) | 24.1 | 0.0 |
| Banes given (damage its areas stopped) | 1.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.0 | 0.0 |
| Guard given (damage it took instead of Health) | 43.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.9 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 3.24 |
| **Debuff:** Hindered (times) | 0.00 | 3.00 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.73 |
| **Debuff:** Immobilized (times) | 0.00 | 1.22 |
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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 96% · a PC Down during the day 57% · Downs a day 0.94 · Rally Points left at the end 38% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 27% | 2% |
| 2: 2 elite, 2 standard | 96% | 4.9 | 45% | 42% |
| 3: 6 standard | 99% | 4.5 | 36% | 22% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 271.4 | 260.9 |
| Damage a turn (its own turns) | 25.7 | 25.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 28.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.2 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.7 | 10.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 87.2 | 44.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 50.9 | 44.8 |
| Damage taken a round of combat | 4.2 | 3.7 |
| Times Down | 0.12 | 0.36 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 0.87 | 1.27 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.40 | 3.75 |
| Rally Points left | 3.72 | 1.97 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 17.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.37 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.75 |
| **Debuff:** Immobilized (times) | 0.00 | 1.82 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.10 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 95% · a PC Down during the day 58% · Downs a day 1.00 · Rally Points left at the end 35% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 27% | 2% |
| 2: 2 elite, 2 standard | 95% | 5.1 | 47% | 45% |
| 3: 6 standard | 99% | 4.6 | 38% | 24% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 274.9 | 264.0 |
| Damage a turn (its own turns) | 25.6 | 25.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 29.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.5 | 18.3 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.9 | 10.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 89.8 | 46.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 56.9 | 46.0 |
| Damage taken a round of combat | 4.6 | 3.7 |
| Times Down | 0.13 | 0.37 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.10 | 1.23 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.64 | 3.73 |
| Rally Points left | 3.25 | 2.04 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 7.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 17.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 9.2 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.38 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.76 |
| **Debuff:** Immobilized (times) | 0.00 | 1.88 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.08 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 99% · a PC Down during the day 24% · Downs a day 0.34 · Rally Points left at the end 37% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 8% | 1% |
| 2: 2 elite, 2 standard | 99% | 4.4 | 15% | 17% |
| 3: 6 standard | 100% | 4.2 | 10% | 9% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 260.2 | 283.5 |
| Damage a turn (its own turns) | 25.3 | 27.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.5 | 31.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | 18.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.3 | 10.3 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 84.2 | 45.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 51.5 | 45.5 |
| Damage taken a round of combat | 4.4 | 3.9 |
| Times Down | 0.03 | 0.14 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.04 | 0.21 |
| Rally Points used through an ally's Lay On Hands | 1.80 | 3.91 |
| Rally Points used between fights | 0.55 | 0.88 |
| Rally Points left | 3.62 | 2.00 |
| **Buffs:** healed allies (Lay On Hands) | 44.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.5 |
| Divine Surge given (extra damage dealt by allies) | 18.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.45 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.27 |
| **Debuff:** Immobilized (times) | 0.00 | 2.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.11 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 98% · a PC Down during the day 35% · Downs a day 0.52 · Rally Points left at the end 38% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.0 | 14% | 1% |
| 2: 2 elite, 2 standard | 99% | 4.5 | 30% | 28% |
| 3: 6 standard | 100% | 4.3 | 20% | 12% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 270.7 | 259.5 | 275.8 |
| Damage a turn (its own turns) | 26.1 | 25.2 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.7 | 20.3 | 30.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 39.7 | 37.0 | 18.3 |
| Share of the party's damage (%) | 25 | 24 | 25 |
| Turns taken | 10.4 | 10.4 | 10.1 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 85.7 | 82.3 | 44.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 50.7 | 49.7 | 44.2 |
| Damage taken a round of combat | 4.3 | 4.2 | 3.8 |
| Times Down | 0.05 | 0.06 | 0.20 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.33 | 2.41 | 0.50 |
| Rally Points used through an ally's Lay On Hands | 2.17 | 0.00 | 2.27 |
| Rally Points used between fights | 1.78 | 1.86 | 2.25 |
| Rally Points left | 3.72 | 3.73 | 1.98 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 53.1 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 17.8 | 18.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.9 | 32.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.1 | 1.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.42 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.03 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.06 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 1.08 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 88% · a PC Down during the day 65% · Downs a day 1.32 · Rally Points left at the end 42% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 27% | 2% |
| 2: 2 elite, 2 standard | 88% | 5.3 | 51% | 55% |
| 3: 6 standard | 100% | 4.7 | 36% | 22% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 295.7 | 270.8 |
| Damage a turn (its own turns) | 27.6 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 30.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 18.0 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 10.8 | 10.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 100.7 | 50.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 62.3 | 50.9 |
| Damage taken a round of combat | 5.1 | 4.1 |
| Times Down | 0.21 | 0.45 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.18 | 1.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.25 | 3.49 |
| Rally Points left | 4.58 | 2.15 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.8 |
| Divine Surge given (extra damage dealt by allies) | 17.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.1 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.27 |
| **Debuff:** Hindered (times) | 0.00 | 1.80 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.06 |
| **Debuff:** Immobilized (times) | 0.00 | 0.75 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.04 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 97% · a PC Down during the day 32% · Downs a day 0.53 · Rally Points left at the end 37% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 8% | 1% |
| 2: 2 elite, 2 standard | 97% | 4.7 | 20% | 25% |
| 3: 6 standard | 100% | 4.4 | 11% | 12% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 286.6 | 310.9 |
| Damage a turn (its own turns) | 26.7 | 29.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 33.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.1 | 18.5 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.8 | 10.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 99.3 | 53.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 63.6 | 53.1 |
| Damage taken a round of combat | 5.3 | 4.4 |
| Times Down | 0.06 | 0.20 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.29 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 1.98 | 3.91 |
| Rally Points used between fights | 0.61 | 1.02 |
| Rally Points left | 4.12 | 1.78 |
| **Buffs:** healed allies (Lay On Hands) | 51.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.4 |
| Divine Surge given (extra damage dealt by allies) | 18.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 35.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.8 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.40 |
| **Debuff:** Hindered (times) | 0.00 | 2.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.26 |
| **Debuff:** Immobilized (times) | 0.00 | 0.91 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.14 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 48% · Downs a day 0.65 · Rally Points left at the end 50% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 28% | 2% |
| 2: 2 elite, 2 standard | 99% | 4.6 | 35% | 35% |
| 3: 6 standard | 100% | 4.3 | 32% | 17% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 324.9 | 284.9 |
| Damage a turn (its own turns) | 30.4 | 28.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.5 | 31.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 38.5 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.8 | 10.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 99.5 | 50.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 10.2 | 0.0 |
| Damage taken | 49.9 | 50.4 |
| Damage taken a round of combat | 4.2 | 4.2 |
| Times Down | 0.03 | 0.29 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.44 | 1.09 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.84 | 4.17 |
| Rally Points left | 5.71 | 2.74 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.9 |
| Divine Surge given (extra damage dealt by allies) | 17.5 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 34.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.0 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.39 |
| **Debuff:** Hindered (times) | 0.00 | 1.89 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.19 |
| **Debuff:** Immobilized (times) | 0.00 | 0.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.10 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 14% · Downs a day 0.16 · Rally Points left at the end 49% · Health at the end 94%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.1 | 7% | 0% |
| 2: 2 elite, 2 standard | 100% | 4.4 | 7% | 12% |
| 3: 6 standard | 100% | 4.2 | 6% | 3% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 294.5 | 317.1 |
| Damage a turn (its own turns) | 28.0 | 30.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 34.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.0 | 20.1 |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 10.6 | 10.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 100.4 | 54.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.4 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 10.5 | 0.0 |
| Damage taken | 52.8 | 54.8 |
| Damage taken a round of combat | 4.5 | 4.7 |
| Times Down | 0.01 | 0.07 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.64 | 0.14 |
| Rally Points used through an ally's Lay On Hands | 1.56 | 4.53 |
| Rally Points used between fights | 0.23 | 0.64 |
| Rally Points left | 5.57 | 2.69 |
| **Buffs:** healed allies (Lay On Hands) | 53.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.7 |
| Divine Surge given (extra damage dealt by allies) | 19.3 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.5 | 0.0 |
| Guard given (damage it took instead of Health) | 32.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.5 | 0.0 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.47 |
| **Debuff:** Hindered (times) | 0.00 | 2.29 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 1.27 |
| **Debuff:** Immobilized (times) | 0.00 | 0.93 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.14 |
