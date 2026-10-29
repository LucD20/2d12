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
| Kite | 0 | 20.0 | 18.8 | 17.5 | 21.7 | 5 | 2 | advance, Double Shot 3, Lock & Loose |  |

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
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

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
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

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

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 3 / 3.4 / 4 | 100% | 14% | 4% | 2 | 0% | 1% | 1% | 1% | 3.0 / 14% |
| 2 Elites | 4 | 4 / 3.7 / 4 | 100% | 26% | 31% | 2 | 6% | 6% | 13% | 12% | 3.1 / 22% |
| Elite + 2 Standards | 4 | 3 / 3.5 / 4 | 100% | 19% | 19% | 2 | 2% | 3% | 10% | 6% | 3.0 / 18% |
| 8 Grunts | 4 | 4 / 4.1 / 5 | 100% | 17% | 3% | 2 | 0% | 0% | 1% | 2% | 3.8 / 18% |
| 2 Standards + 8 Minions | 4 | 4 / 3.7 / 4 | 100% | 11% | 2% | 2 | 0% | 0% | 1% | 1% | 3.4 / 15% |
| 6 Standards (CV 6, hard) | 6 | 5 / 5.3 / 6 | 97% | 32% | 34% | 2 | 6% | 8% | 16% | 20% | 4.6 / 27% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range, Cover (a creature in the line; the map's own cover 5% Medium, 15% Low), shooting while Engaged and into melee; Flanking for both sides; Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 40% · a PC Down during the day 97% · Downs a day 3.62 · Rally Points left at the end 30% · Health at the end 27%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.7 | 17% | 2% |
| 2: 4 standard | 100% | 3.3 | 27% | 13% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 31% | 37% |
| 4: 2 elite, 2 standard | 40% | 5.2 | 77% | 94% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 294.7 | 242.9 |
| Damage a turn (its own turns) | 26.1 | 20.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.5 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 27.8 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.3 | 11.6 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 88.9 | 51.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 3.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.1 | 51.3 |
| Damage taken a round of combat | 5.9 | 3.5 |
| Times Down | 0.90 | 0.91 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.11 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 1.48 | 1.57 |
| Rally Points used between fights | 3.63 | 2.66 |
| Rally Points left | 1.78 | 2.73 |
| **Buffs:** healed allies (Lay On Hands) | 24.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.8 | 4.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.5 | 0.0 |
| Turns that start Engaged | 7.0 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 41.5 |
| ... into melee (1 Bane) | 0.0 | 26.5 |
| ... with Cover | 0.0 | 18.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.91 | 5.95 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.26 |
| **Debuff:** Prone (times) | 0.91 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.91 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 79% · a PC Down during the day 88% · Downs a day 2.29 · Rally Points left at the end 40% · Health at the end 71%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 17% | 2% |
| 2: 4 standard | 100% | 3.4 | 27% | 16% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 26% | 27% |
| 4: 2 elite, 2 standard | 79% | 6.0 | 60% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 310.9 | 246.3 |
| Damage a turn (its own turns) | 24.4 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.3 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 12.9 | 11.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 95.1 | 43.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 63.1 | 43.4 |
| Damage taken a round of combat | 4.1 | 2.8 |
| Times Down | 0.38 | 0.76 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.04 | 0.31 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.60 | 3.99 |
| Rally Points left | 3.36 | 2.70 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 21.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.9 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.1 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 42.3 |
| ... into melee (1 Bane) | 0.0 | 29.3 |
| ... with Cover | 0.0 | 19.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.88 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.66 |
| **Debuff:** Immobilized (times) | 0.00 | 2.22 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 90% · Downs a day 2.27 · Rally Points left at the end 36% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 18% | 3% |
| 2: 4 standard | 100% | 3.5 | 27% | 13% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 29% | 31% |
| 4: 2 elite, 2 standard | 83% | 6.3 | 59% | 82% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 321.9 | 249.8 |
| Damage a turn (its own turns) | 24.1 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.5 | 12.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 101.6 | 44.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 66.3 | 44.8 |
| Damage taken a round of combat | 4.1 | 2.8 |
| Times Down | 0.32 | 0.81 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.21 | 0.30 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.85 | 4.17 |
| Rally Points left | 2.94 | 2.53 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 6.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 18.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.9 | 0.0 |
| **Map:** AP spent moving | 6.5 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.7 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 43.0 |
| ... into melee (1 Bane) | 0.0 | 29.8 |
| ... with Cover | 0.0 | 20.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.90 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.22 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 92% · a PC Down during the day 63% · Downs a day 1.21 · Rally Points left at the end 32% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 6% | 1% |
| 2: 4 standard | 100% | 3.5 | 6% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 8% | 16% |
| 4: 2 elite, 2 standard | 92% | 5.6 | 30% | 58% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 292.3 | 268.7 |
| Damage a turn (its own turns) | 22.1 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.4 | 22.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.3 | 12.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 96.4 | 47.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 65.8 | 47.9 |
| Damage taken a round of combat | 4.3 | 3.1 |
| Times Down | 0.17 | 0.44 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.44 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.17 | 3.58 |
| Rally Points used between fights | 0.64 | 1.37 |
| Rally Points left | 2.75 | 2.04 |
| **Buffs:** healed allies (Lay On Hands) | 46.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 23.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 30.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 11.9 | 0.0 |
| **Map:** AP spent moving | 6.9 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 8.4 | 4.2 |
| Shots ([Ranged] Actions) | 0.0 | 46.0 |
| ... into melee (1 Bane) | 0.0 | 32.8 |
| ... with Cover | 0.0 | 21.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.51 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.06 |
| **Debuff:** Immobilized (times) | 0.00 | 2.45 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.90 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 85% · a PC Down during the day 79% · Downs a day 1.74 · Rally Points left at the end 35% · Health at the end 73%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 8% | 1% |
| 2: 4 standard | 100% | 3.4 | 13% | 6% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 15% | 22% |
| 4: 2 elite, 2 standard | 85% | 5.8 | 45% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 314.9 | 287.1 | 258.6 |
| Damage a turn (its own turns) | 24.3 | 22.4 | 21.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 18.7 | 22.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - | - |
| Share of the party's damage (%) | 28 | 26 | 23 |
| Turns taken | 13.1 | 12.9 | 12.2 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 96.7 | 91.7 | 46.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 64.7 | 62.1 | 46.4 |
| Damage taken a round of combat | 4.2 | 4.0 | 3.0 |
| Times Down | 0.28 | 0.28 | 0.59 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.52 | 3.06 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 2.74 | 0.00 | 2.18 |
| Rally Points used between fights | 1.68 | 1.73 | 2.60 |
| Rally Points left | 3.06 | 3.21 | 2.17 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 57.3 | 0.0 |
| Defense given (damage it stopped) | 3.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 21.8 | 22.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.0 | 29.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.3 | 0.1 | 0.0 |
| **Map:** AP spent moving | 6.6 | 6.6 | 4.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 6.6 | 0.0 |
| Turns that start Engaged | 8.2 | 8.0 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 44.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 30.9 |
| ... with Cover | 0.0 | 0.0 | 20.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.0 | 10.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 6.20 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.88 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.89 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 63% · a PC Down during the day 94% · Downs a day 2.98 · Rally Points left at the end 45% · Health at the end 57%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 17% | 3% |
| 2: 4 standard | 100% | 3.5 | 27% | 17% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 29% | 34% |
| 4: 2 elite, 2 standard | 63% | 6.1 | 69% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 340.5 | 269.6 |
| Damage a turn (its own turns) | 26.1 | 22.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.9 | 24.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.2 | 12.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 113.0 | 51.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.3 | 51.7 |
| Damage taken a round of combat | 4.9 | 3.2 |
| Times Down | 0.57 | 0.92 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.21 | 0.31 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.54 | 3.81 |
| Rally Points left | 4.25 | 2.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 21.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.4 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 43.3 |
| ... into melee (1 Bane) | 0.0 | 29.4 |
| ... with Cover | 0.0 | 19.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.72 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (times) | 0.00 | 2.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 81% · a PC Down during the day 80% · Downs a day 1.84 · Rally Points left at the end 31% · Health at the end 67%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 6% | 0% |
| 2: 4 standard | 100% | 3.6 | 6% | 4% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 10% | 20% |
| 4: 2 elite, 2 standard | 81% | 6.0 | 42% | 75% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 324.9 | 294.0 |
| Damage a turn (its own turns) | 23.7 | 22.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.3 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.8 | 12.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.8 | 57.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.1 | 57.5 |
| Damage taken a round of combat | 5.2 | 3.5 |
| Times Down | 0.30 | 0.62 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.73 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.44 | 3.59 |
| Rally Points used between fights | 0.73 | 1.50 |
| Rally Points left | 3.10 | 1.90 |
| **Buffs:** healed allies (Lay On Hands) | 54.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 24.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 33.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.4 | 0.0 |
| **Map:** AP spent moving | 6.9 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 8.8 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 47.0 |
| ... into melee (1 Bane) | 0.0 | 33.2 |
| ... with Cover | 0.0 | 21.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.00 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.16 |
| **Debuff:** Hindered (times) | 0.00 | 2.54 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.55 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 92% · a PC Down during the day 86% · Downs a day 1.84 · Rally Points left at the end 46% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 18% | 5% |
| 2: 4 standard | 100% | 3.5 | 30% | 19% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 24% | 23% |
| 4: 2 elite, 2 standard | 92% | 5.7 | 49% | 76% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 368.1 | 269.2 |
| Damage a turn (its own turns) | 27.8 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.1 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.3 | 11.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 108.5 | 50.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 67.5 | 50.2 |
| Damage taken a round of combat | 4.4 | 3.2 |
| Times Down | 0.21 | 0.71 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.80 | 0.26 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.53 | 4.67 |
| Rally Points left | 4.67 | 3.06 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 21.5 | 0.0 |
| Banes given (damage its areas stopped) | 4.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.8 | 0.0 |
| Guard given (damage it took instead of Health) | 31.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.1 | 0.0 |
| **Map:** AP spent moving | 6.7 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 8.4 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 42.9 |
| ... into melee (1 Bane) | 0.0 | 30.0 |
| ... with Cover | 0.0 | 19.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.73 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.94 |
| **Debuff:** Immobilized (times) | 0.00 | 0.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.91 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 55% · Downs a day 0.87 · Rally Points left at the end 40% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 6% | 0% |
| 2: 4 standard | 100% | 3.6 | 6% | 5% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 7% | 12% |
| 4: 2 elite, 2 standard | 97% | 5.6 | 19% | 49% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 333.3 | 300.7 |
| Damage a turn (its own turns) | 24.4 | 23.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 30.8 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.7 | 12.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 112.9 | 58.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 10.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.0 | 0.0 |
| Damage taken | 71.7 | 58.3 |
| Damage taken a round of combat | 4.6 | 3.7 |
| Times Down | 0.08 | 0.36 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.20 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.09 | 4.10 |
| Rally Points used between fights | 0.47 | 1.37 |
| Rally Points left | 4.24 | 2.53 |
| **Buffs:** healed allies (Lay On Hands) | 56.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 4.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.7 | 0.0 |
| Guard given (damage it took instead of Health) | 31.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.8 | 0.0 |
| **Map:** AP spent moving | 7.0 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 8.7 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 47.4 |
| ... into melee (1 Bane) | 0.0 | 34.0 |
| ... with Cover | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 11.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.07 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (times) | 0.00 | 2.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.95 |
| **Debuff:** Immobilized (times) | 0.00 | 0.55 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 17% · a PC Down during the day 99% · Downs a day 4.78 · Rally Points left at the end 20% · Health at the end 8%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 34% | 6% |
| 2: 6 standard | 85% | 5.2 | 51% | 57% |
| 3: 2 elite | 96% | 3.7 | 39% | 56% |
| 4: 1 elite, 4 standard | 21% | 4.4 | 68% | 97% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 309.6 | 258.8 |
| Damage a turn (its own turns) | 25.8 | 20.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.2 | 22.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.0 | 12.3 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 103.5 | 64.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 97.9 | 64.1 |
| Damage taken a round of combat | 6.3 | 4.1 |
| Times Down | 1.18 | 1.21 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.59 | 0.06 |
| Rally Points used through an ally's Lay On Hands | 1.81 | 2.22 |
| Rally Points used between fights | 3.37 | 2.96 |
| Rally Points left | 1.23 | 1.77 |
| **Buffs:** healed allies (Lay On Hands) | 31.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.8 | 5.6 |
| AP lost to moving (Actions dropped or made smaller) | 3.3 | 0.0 |
| Turns that start Engaged | 8.6 | 5.8 |
| Shots ([Ranged] Actions) | 0.0 | 43.5 |
| ... into melee (1 Bane) | 0.0 | 26.8 |
| ... with Cover | 0.0 | 20.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 8.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.70 | 6.80 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.54 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.23 |
| **Debuff:** Immobilized (times) | 0.00 | 2.57 |
| **Debuff:** Prone (times) | 0.70 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.62 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 85% · a PC Down during the day 93% · Downs a day 2.84 · Rally Points left at the end 24% · Health at the end 69%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.2 | 35% | 18% |
| 2: 6 standard | 97% | 5.4 | 43% | 56% |
| 3: 2 elite | 100% | 3.5 | 32% | 41% |
| 4: 1 elite, 4 standard | 88% | 5.8 | 52% | 71% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 375.4 | 288.1 |
| Damage a turn (its own turns) | 23.6 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.6 | 22.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 16.0 | 13.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 123.4 | 58.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.8 | 58.1 |
| Damage taken a round of combat | 3.9 | 3.1 |
| Times Down | 0.36 | 1.06 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.23 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.37 | 5.27 |
| Rally Points left | 2.39 | 1.28 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 28.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 50.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.1 | 0.0 |
| **Map:** AP spent moving | 6.4 | 5.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 11.4 | 5.8 |
| Shots ([Ranged] Actions) | 0.0 | 48.6 |
| ... into melee (1 Bane) | 0.0 | 32.9 |
| ... with Cover | 0.0 | 23.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.36 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.78 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.59 |
| **Debuff:** Immobilized (times) | 0.00 | 2.77 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.70 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 89% · a PC Down during the day 95% · Downs a day 2.86 · Rally Points left at the end 20% · Health at the end 71%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 36% | 19% |
| 2: 6 standard | 98% | 5.7 | 43% | 56% |
| 3: 2 elite | 100% | 3.7 | 34% | 46% |
| 4: 1 elite, 4 standard | 92% | 6.1 | 51% | 73% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 391.5 | 293.2 |
| Damage a turn (its own turns) | 23.5 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 22.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.1 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 16.8 | 14.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 130.9 | 61.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 28.4 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.2 | 0.0 |
| Damage taken | 75.4 | 61.2 |
| Damage taken a round of combat | 3.9 | 3.1 |
| Times Down | 0.29 | 1.14 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.40 | 0.49 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.58 | 5.47 |
| Rally Points left | 2.03 | 1.04 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 11.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 27.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Map:** AP spent moving | 6.6 | 5.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 12.1 | 6.0 |
| Shots ([Ranged] Actions) | 0.0 | 49.6 |
| ... into melee (1 Bane) | 0.0 | 33.9 |
| ... with Cover | 0.0 | 23.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 13.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.53 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.76 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.76 |
| **Debuff:** Immobilized (times) | 0.00 | 2.77 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.70 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 90% · a PC Down during the day 73% · Downs a day 1.63 · Rally Points left at the end 18% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.2 | 7% | 0% |
| 2: 6 standard | 100% | 5.0 | 10% | 17% |
| 3: 2 elite | 100% | 3.6 | 14% | 29% |
| 4: 1 elite, 4 standard | 91% | 5.8 | 30% | 63% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 357.7 | 318.9 |
| Damage a turn (its own turns) | 22.0 | 21.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 16.4 | 14.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 127.8 | 65.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.1 | 65.4 |
| Damage taken a round of combat | 4.3 | 3.5 |
| Times Down | 0.20 | 0.61 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.05 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.52 | 5.12 |
| Rally Points used between fights | 0.57 | 1.06 |
| Rally Points left | 1.85 | 0.82 |
| **Buffs:** healed allies (Lay On Hands) | 59.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 30.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.8 | 0.0 |
| **Map:** AP spent moving | 6.9 | 6.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 11.5 | 6.6 |
| Shots ([Ranged] Actions) | 0.0 | 53.7 |
| ... into melee (1 Bane) | 0.0 | 37.3 |
| ... with Cover | 0.0 | 25.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.9 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.37 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.78 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.28 |
| **Debuff:** Immobilized (times) | 0.00 | 3.09 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.69 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 88% · a PC Down during the day 82% · Downs a day 2.03 · Rally Points left at the end 21% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 16% | 3% |
| 2: 6 standard | 99% | 5.1 | 25% | 32% |
| 3: 2 elite | 99% | 3.6 | 20% | 31% |
| 4: 1 elite, 4 standard | 89% | 5.7 | 37% | 68% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 384.1 | 350.1 | 304.2 |
| Damage a turn (its own turns) | 23.9 | 22.2 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 19.1 | 22.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.0 | - | - |
| Share of the party's damage (%) | 29 | 26 | 23 |
| Turns taken | 16.2 | 15.9 | 14.3 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 126.5 | 121.8 | 61.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 75.7 | 74.7 | 61.7 |
| Damage taken a round of combat | 4.1 | 4.1 | 3.4 |
| Times Down | 0.23 | 0.28 | 0.76 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.59 | 3.72 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 3.32 | 0.00 | 3.15 |
| Rally Points used between fights | 1.88 | 2.11 | 2.79 |
| Rally Points left | 2.21 | 2.17 | 1.00 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 76.7 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 29.9 | 29.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 50.8 | 47.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 23.3 | 0.1 | 0.0 |
| **Map:** AP spent moving | 6.7 | 6.5 | 6.1 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 6.5 | 0.0 |
| Turns that start Engaged | 11.4 | 11.2 | 6.2 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 51.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 35.4 |
| ... with Cover | 0.0 | 0.0 | 24.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 13.8 | 12.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 7.86 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.81 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.94 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.71 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 77% · a PC Down during the day 97% · Downs a day 3.39 · Rally Points left at the end 28% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.2 | 33% | 12% |
| 2: 6 standard | 97% | 5.6 | 44% | 56% |
| 3: 2 elite | 98% | 3.8 | 38% | 56% |
| 4: 1 elite, 4 standard | 81% | 6.1 | 58% | 79% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 414.9 | 316.7 |
| Damage a turn (its own turns) | 25.5 | 22.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 16.4 | 14.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 142.4 | 66.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 89.0 | 66.1 |
| Damage taken a round of combat | 4.6 | 3.4 |
| Times Down | 0.50 | 1.19 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.54 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.46 | 5.15 |
| Rally Points left | 3.00 | 1.41 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 28.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 53.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.3 | 0.0 |
| **Map:** AP spent moving | 6.5 | 5.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 11.7 | 5.9 |
| Shots ([Ranged] Actions) | 0.0 | 49.9 |
| ... into melee (1 Bane) | 0.0 | 33.9 |
| ... with Cover | 0.0 | 23.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.89 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.81 |
| **Debuff:** Hindered (times) | 0.00 | 2.86 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.65 |
| **Debuff:** Immobilized (times) | 0.00 | 0.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.70 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 81% · a PC Down during the day 82% · Downs a day 2.20 · Rally Points left at the end 19% · Health at the end 57%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 6% | 0% |
| 2: 6 standard | 99% | 5.2 | 12% | 19% |
| 3: 2 elite | 99% | 3.8 | 17% | 37% |
| 4: 1 elite, 4 standard | 83% | 6.2 | 38% | 73% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 394.4 | 345.1 |
| Damage a turn (its own turns) | 23.6 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.9 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 16.8 | 15.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 150.1 | 73.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 98.1 | 73.6 |
| Damage taken a round of combat | 5.1 | 3.8 |
| Times Down | 0.31 | 0.79 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.34 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.79 | 4.95 |
| Rally Points used between fights | 0.67 | 1.20 |
| Rally Points left | 2.21 | 0.84 |
| **Buffs:** healed allies (Lay On Hands) | 68.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 30.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 52.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.8 | 0.0 |
| **Map:** AP spent moving | 6.7 | 6.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 12.0 | 6.5 |
| Shots ([Ranged] Actions) | 0.0 | 54.2 |
| ... into melee (1 Bane) | 0.0 | 37.7 |
| ... with Cover | 0.0 | 25.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.9 |
| Flanking Boons on its melee Actions | 12.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.25 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.81 |
| **Debuff:** Hindered (times) | 0.00 | 3.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.68 |
| **Debuff:** Immobilized (times) | 0.00 | 0.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.73 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 95% · a PC Down during the day 93% · Downs a day 2.44 · Rally Points left at the end 33% · Health at the end 84%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.2 | 35% | 17% |
| 2: 6 standard | 99% | 5.2 | 35% | 54% |
| 3: 2 elite | 100% | 3.3 | 29% | 39% |
| 4: 1 elite, 4 standard | 96% | 5.4 | 47% | 67% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 449.6 | 314.9 |
| Damage a turn (its own turns) | 28.1 | 22.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.4 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 16.1 | 13.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 138.4 | 67.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.0 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 74.4 | 67.2 |
| Damage taken a round of combat | 4.1 | 3.7 |
| Times Down | 0.20 | 1.02 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.90 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.00 | 6.02 |
| Rally Points left | 4.10 | 1.57 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 27.6 | 0.0 |
| Banes given (damage its areas stopped) | 1.7 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.5 | 0.0 |
| Guard given (damage it took instead of Health) | 48.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.1 | 0.0 |
| **Map:** AP spent moving | 6.5 | 5.5 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 11.3 | 5.7 |
| Shots ([Ranged] Actions) | 0.0 | 48.6 |
| ... into melee (1 Bane) | 0.0 | 33.3 |
| ... with Cover | 0.0 | 23.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 13.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.85 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.85 |
| **Debuff:** Hindered (times) | 0.00 | 2.73 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.70 |
| **Debuff:** Immobilized (times) | 0.00 | 0.41 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.75 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 65% · Downs a day 1.22 · Rally Points left at the end 28% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 6% | 1% |
| 2: 6 standard | 100% | 5.1 | 7% | 15% |
| 3: 2 elite | 100% | 3.5 | 12% | 24% |
| 4: 1 elite, 4 standard | 98% | 5.5 | 20% | 54% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 406.0 | 357.6 |
| Damage a turn (its own turns) | 24.8 | 23.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 24.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 31.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 16.4 | 15.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 147.5 | 77.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.1 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 84.0 | 77.6 |
| Damage taken a round of combat | 4.6 | 4.2 |
| Times Down | 0.09 | 0.52 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.66 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.45 | 5.49 |
| Rally Points used between fights | 0.41 | 1.22 |
| Rally Points left | 3.48 | 1.29 |
| **Buffs:** healed allies (Lay On Hands) | 70.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 31.0 | 0.0 |
| Banes given (damage its areas stopped) | 1.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.6 | 0.0 |
| Guard given (damage it took instead of Health) | 47.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 24.0 | 0.0 |
| **Map:** AP spent moving | 7.0 | 6.5 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 11.5 | 6.6 |
| Shots ([Ranged] Actions) | 0.0 | 54.8 |
| ... into melee (1 Bane) | 0.0 | 38.6 |
| ... with Cover | 0.0 | 25.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.9 |
| Flanking Boons on its melee Actions | 12.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.25 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.81 |
| **Debuff:** Hindered (times) | 0.00 | 3.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.70 |
| **Debuff:** Immobilized (times) | 0.00 | 0.41 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.74 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 34% · a PC Down during the day 97% · Downs a day 3.71 · Rally Points left at the end 47% · Health at the end 23%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 29% | 10% |
| 2: 2 elite, 2 standard | 46% | 5.3 | 76% | 91% |
| 3: 6 standard | 73% | 5.1 | 57% | 72% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 207.7 | 176.3 |
| Damage a turn (its own turns) | 26.0 | 20.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.4 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 8.1 | 8.3 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 76.6 | 46.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 4.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.4 | 46.8 |
| Damage taken a round of combat | 6.8 | 4.5 |
| Times Down | 0.91 | 0.94 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.15 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 1.16 | 1.37 |
| Rally Points used between fights | 2.28 | 1.98 |
| Rally Points left | 3.41 | 3.60 |
| **Buffs:** healed allies (Lay On Hands) | 20.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.9 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 3.5 | 3.5 |
| AP lost to moving (Actions dropped or made smaller) | 2.6 | 0.0 |
| Turns that start Engaged | 5.5 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 29.7 |
| ... into melee (1 Bane) | 0.0 | 18.0 |
| ... with Cover | 0.0 | 13.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 5.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.52 | 4.51 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.19 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.83 |
| **Debuff:** Immobilized (times) | 0.00 | 1.68 |
| **Debuff:** Prone (times) | 0.52 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.47 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 75% · a PC Down during the day 92% · Downs a day 2.54 · Rally Points left at the end 46% · Health at the end 68%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 27% | 12% |
| 2: 2 elite, 2 standard | 78% | 5.9 | 60% | 82% |
| 3: 6 standard | 97% | 5.4 | 43% | 54% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 261.8 | 201.9 |
| Damage a turn (its own turns) | 23.7 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.2 | 9.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 95.8 | 42.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 59.6 | 42.6 |
| Damage taken a round of combat | 4.6 | 3.2 |
| Times Down | 0.42 | 0.86 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.11 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.00 | 3.64 |
| Rally Points left | 3.89 | 3.00 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.4 | 0.0 |
| **Map:** AP spent moving | 4.5 | 3.6 |
| AP lost to moving (Actions dropped or made smaller) | 4.5 | 0.0 |
| Turns that start Engaged | 7.9 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 33.9 |
| ... into melee (1 Bane) | 0.0 | 23.0 |
| ... with Cover | 0.0 | 15.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.97 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.35 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.13 |
| **Debuff:** Immobilized (times) | 0.00 | 1.84 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.55 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 81% · a PC Down during the day 92% · Downs a day 2.48 · Rally Points left at the end 40% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 29% | 12% |
| 2: 2 elite, 2 standard | 83% | 6.3 | 59% | 80% |
| 3: 6 standard | 97% | 5.7 | 44% | 57% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 278.3 | 211.7 |
| Damage a turn (its own turns) | 23.5 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 12.0 | 10.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 104.5 | 45.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 21.3 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.1 | 0.0 |
| Damage taken | 61.1 | 45.4 |
| Damage taken a round of combat | 4.4 | 3.2 |
| Times Down | 0.33 | 0.91 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.23 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.29 | 4.09 |
| Rally Points left | 3.49 | 2.57 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 8.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 22.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.2 | 0.0 |
| **Map:** AP spent moving | 4.7 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 0.0 |
| Turns that start Engaged | 8.6 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 35.5 |
| ... into melee (1 Bane) | 0.0 | 24.1 |
| ... with Cover | 0.0 | 16.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.24 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.34 |
| **Debuff:** Immobilized (times) | 0.00 | 1.90 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 91% · a PC Down during the day 68% · Downs a day 1.38 · Rally Points left at the end 32% · Health at the end 75%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 8% | 2% |
| 2: 2 elite, 2 standard | 92% | 5.5 | 28% | 56% |
| 3: 6 standard | 98% | 5.2 | 18% | 34% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 263.4 | 240.1 |
| Damage a turn (its own turns) | 22.2 | 21.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 23.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.0 | 11.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 99.4 | 50.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 64.1 | 50.9 |
| Damage taken a round of combat | 4.7 | 3.7 |
| Times Down | 0.19 | 0.50 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.41 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.03 | 3.66 |
| Rally Points used between fights | 0.60 | 1.44 |
| Rally Points left | 2.96 | 1.89 |
| **Buffs:** healed allies (Lay On Hands) | 45.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 21.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 35.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.2 | 0.0 |
| **Map:** AP spent moving | 5.2 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 8.2 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 40.3 |
| ... into melee (1 Bane) | 0.0 | 27.8 |
| ... with Cover | 0.0 | 18.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 9.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.15 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.42 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.87 |
| **Debuff:** Immobilized (times) | 0.00 | 2.28 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 86% · a PC Down during the day 82% · Downs a day 1.85 · Rally Points left at the end 37% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 14% | 4% |
| 2: 2 elite, 2 standard | 87% | 5.7 | 45% | 70% |
| 3: 6 standard | 99% | 5.2 | 25% | 38% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 273.1 | 252.8 | 226.8 |
| Damage a turn (its own turns) | 23.7 | 22.1 | 21.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.6 | 19.1 | 22.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - | - |
| Share of the party's damage (%) | 28 | 26 | 23 |
| Turns taken | 11.6 | 11.5 | 10.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 97.0 | 94.3 | 47.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 60.3 | 60.4 | 47.5 |
| Damage taken a round of combat | 4.6 | 4.6 | 3.6 |
| Times Down | 0.28 | 0.28 | 0.64 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.51 | 2.95 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 2.39 | 0.00 | 2.17 |
| Rally Points used between fights | 1.69 | 1.65 | 2.59 |
| Rally Points left | 3.42 | 3.40 | 2.19 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 53.7 | 0.0 |
| Defense given (damage it stopped) | 4.9 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 20.0 | 21.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.6 | 34.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.1 | 0.1 | 0.0 |
| **Map:** AP spent moving | 4.9 | 4.9 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 4.9 | 0.0 |
| Turns that start Engaged | 8.0 | 7.9 | 4.2 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 37.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 26.0 |
| ... with Cover | 0.0 | 0.0 | 17.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 10.1 | 9.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 5.80 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.42 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.65 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.57 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 59% · a PC Down during the day 96% · Downs a day 3.04 · Rally Points left at the end 54% · Health at the end 54%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 28% | 12% |
| 2: 2 elite, 2 standard | 62% | 6.0 | 70% | 88% |
| 3: 6 standard | 96% | 5.7 | 44% | 58% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 267.0 | 203.1 |
| Damage a turn (its own turns) | 25.8 | 22.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.4 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 10.5 | 9.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 105.0 | 47.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.7 | 47.5 |
| Damage taken a round of combat | 5.7 | 3.9 |
| Times Down | 0.57 | 0.96 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.20 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.66 | 3.17 |
| Rally Points left | 5.14 | 3.54 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 16.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 35.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.5 | 0.0 |
| **Map:** AP spent moving | 4.2 | 3.4 |
| AP lost to moving (Actions dropped or made smaller) | 4.2 | 0.0 |
| Turns that start Engaged | 7.5 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 32.1 |
| ... into melee (1 Bane) | 0.0 | 21.6 |
| ... with Cover | 0.0 | 14.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.53 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.28 |
| **Debuff:** Hindered (times) | 0.00 | 1.73 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.51 |
| **Debuff:** Immobilized (times) | 0.00 | 0.29 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 81% · a PC Down during the day 81% · Downs a day 1.99 · Rally Points left at the end 34% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 8% | 3% |
| 2: 2 elite, 2 standard | 82% | 5.9 | 41% | 73% |
| 3: 6 standard | 98% | 5.6 | 19% | 40% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 282.7 | 249.3 |
| Damage a turn (its own turns) | 23.5 | 23.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.6 | 24.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.1 | 10.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.3 | 58.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.3 | 58.2 |
| Damage taken a round of combat | 5.9 | 4.2 |
| Times Down | 0.32 | 0.68 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.62 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.16 | 3.41 |
| Rally Points used between fights | 0.70 | 1.60 |
| Rally Points left | 3.52 | 1.97 |
| **Buffs:** healed allies (Lay On Hands) | 49.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 21.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 11.9 | 0.0 |
| **Map:** AP spent moving | 5.0 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 0.0 |
| Turns that start Engaged | 8.5 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 39.0 |
| ... into melee (1 Bane) | 0.0 | 27.0 |
| ... with Cover | 0.0 | 17.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 9.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.07 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.36 |
| **Debuff:** Hindered (times) | 0.00 | 2.21 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.54 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 89% · a PC Down during the day 89% · Downs a day 2.15 · Rally Points left at the end 48% · Health at the end 83%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 30% | 13% |
| 2: 2 elite, 2 standard | 90% | 5.7 | 50% | 74% |
| 3: 6 standard | 99% | 5.2 | 40% | 52% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 330.8 | 233.4 |
| Damage a turn (its own turns) | 27.7 | 23.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.0 | 24.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.0 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 12.0 | 10.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 112.5 | 52.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.3 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.3 | 0.0 |
| Damage taken | 63.8 | 52.3 |
| Damage taken a round of combat | 4.7 | 3.8 |
| Times Down | 0.24 | 0.83 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.83 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.97 | 4.66 |
| Rally Points left | 5.19 | 3.01 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 19.2 | 0.0 |
| Banes given (damage its areas stopped) | 4.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.7 | 0.0 |
| Guard given (damage it took instead of Health) | 36.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.6 | 0.0 |
| **Map:** AP spent moving | 5.1 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 8.3 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 35.9 |
| ... into melee (1 Bane) | 0.0 | 24.6 |
| ... with Cover | 0.0 | 16.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.88 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.45 |
| **Debuff:** Hindered (times) | 0.00 | 2.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.56 |
| **Debuff:** Immobilized (times) | 0.00 | 0.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 56% · Downs a day 0.95 · Rally Points left at the end 40% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 8% | 3% |
| 2: 2 elite, 2 standard | 98% | 5.6 | 17% | 45% |
| 3: 6 standard | 100% | 5.0 | 12% | 25% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 307.8 | 276.9 |
| Damage a turn (its own turns) | 24.6 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 25.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 29.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.6 | 11.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.0 | 62.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 69.6 | 62.7 |
| Damage taken a round of combat | 5.0 | 4.4 |
| Times Down | 0.08 | 0.39 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.09 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 1.96 | 4.35 |
| Rally Points used between fights | 0.41 | 1.40 |
| Rally Points left | 4.55 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 56.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 23.3 | 0.0 |
| Banes given (damage its areas stopped) | 4.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.9 | 0.0 |
| **Map:** AP spent moving | 5.4 | 4.7 |
| AP lost to moving (Actions dropped or made smaller) | 5.4 | 0.0 |
| Turns that start Engaged | 8.7 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 42.5 |
| ... into melee (1 Bane) | 0.0 | 30.0 |
| ... with Cover | 0.0 | 19.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.34 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.43 |
| **Debuff:** Hindered (times) | 0.00 | 2.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.57 |
| **Debuff:** Immobilized (times) | 0.00 | 0.36 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |
