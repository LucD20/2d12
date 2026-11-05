# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/classes/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

## Archer (ranged damage), `classes/archer-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Lock & Loose + attack (plan) | 0 | 26.0 | 24.2 | 22.3 | 27.1 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 41.2 | 38.4 | 35.3 | 38.4 | 5 | 3 | Double Shot 3, Twin Shot, Lock & Loose |  |
| Reload Shot | 0 | 28.8 | 27.1 | 25.3 | 30.0 | 5 | 3 | Double Shot 3, Weapon Attack, Lock & Loose (reload shot) |  |
| Reload and shoot | 0 | 16.4 | 15.6 | 14.7 | 17.8 | 5 | 2 | Reload, Double Shot 3, Lock & Loose (reload shot) |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 20.0 | 18.8 | 17.5 | 21.7 | 5 | 2 | advance, Double Shot 3, Lock & Loose |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Lock & Loose + attack · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.1 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.1 | 3 / 3.2 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.8 | 2 / 2.2 |

## Archer (ranged damage), `classes/archer-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.1 | 40.8 | 37.4 | 40.8 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.5 | 2 / 2.3 |

## Archer (ranged damage), `classes/archer-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.1 | 40.8 | 37.4 | 40.8 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.5 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.5 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.1 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan, **best**) | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.7 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.8 | 2 / 2.2 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.1 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.0 | 28.2 | 33.5 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.2 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.8 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.6 | 2 / 2.3 |

## Archer (Double Shot, options) (ranged damage), `classes/archer-double-3-options.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.1 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 3 | 32.7 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Nova | 0 | 21.2 | 20.5 | 19.6 | 23.1 | 5 | 1 | Volley, Double Shot 3 |  |
| Focus (**best**) | 0 | 33.9 | 32.3 | 30.8 | 35.7 | 5 | 3 | Deadeye, Double Shot 3, Lock & Loose |  |
| Kite | 3 | 32.7 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.3 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.6 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.1 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.0 | 28.2 | 33.5 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Focus | 0 | 23.7 | 22.6 | 21.5 | 26.3 | 5 | 2 | Hunter's Focus, Double Shot 3, Lock & Loose |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 3 / 3.6 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.0 | 2 / 2.4 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan, **best**) | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.7 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.1 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 6.0 | 2 / 2.2 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.2 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.8 | 2 / 2.3 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.2 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Focus | 0 | 23.4 | 22.4 | 21.2 | 26.1 | 5 | 2 | Hunter's Focus, Rolling Shot 3, Lock & Loose |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.6 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.0 | 2 / 2.4 |

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
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 28 / 27.8 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.6 | 10 / 10.6 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 5 / 5.4 |
| Elite | 132 | 14 | 3 | 15.1 | 5 / 5.5 | 3 / 3.1 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 27.6 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.6 | 11 / 11.4 |
| Standard | 63 | 13 | 2 | 9.2 | 4 / 4.0 | 6 / 5.9 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 9.8 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 27.6 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.6 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 4 / 4.0 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 9.8 | 4 / 3.8 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 31.3 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 5.8 | 5.3 | 4.8 | 7.8 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 36 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.9 | 14 / 13.7 |
| Standard | 63 | 13 | 2 | 9.2 | 5 / 4.7 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 10.4 | 4 / 4.0 |

## Paladin (Smite, hold) (tank / support), `classes/paladin-smite-1-hold.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge (keep 2), Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge (keep 2), Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge (keep 2), Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge (keep 2), Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite, options) (tank / support), `classes/paladin-smite-1-options.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan, **best**) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Aura of Protection, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Nova (plan) | 0 | 24.2 | 22.9 | 21.7 | 22.9 | 5 | 1 | Word of Radiance 3, Smite 2 |  |
| Steel | 0 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.8 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.2 | 6 / 5.9 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.5 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 27.9 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 27.9 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 26.0 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 43.7 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 21.2 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 19.2 | 17.8 | 16.3 | 21.2 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 35 / 35.8 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 13.7 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 7 / 6.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.0 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 4 / 4.0 / 5 | 99% | 20% | 24% | 2 | 4% | 9% | 8% | 10% | 3.3 / 17% |
| 2 Elites | 4 | 4 / 4.2 / 5 | 99% | 22% | 33% | 2 | 5% | 8% | 13% | 15% | 3.3 / 17% |
| Elite + 2 Standards | 4 | 4 / 4.1 / 5 | 99% | 19% | 26% | 2 | 4% | 7% | 12% | 8% | 3.4 / 15% |
| 8 Grunts | 4 | 4 / 4.1 / 5 | 100% | 17% | 10% | 2 | 1% | 3% | 3% | 5% | 3.7 / 19% |
| 2 Standards + 8 Minions | 4 | 4 / 4.0 / 5 | 100% | 13% | 12% | 2 | 1% | 2% | 7% | 3% | 3.7 / 16% |
| 6 Standards (CV 6, hard) | 6 | 6 / 6.0 / 8 | 65% | 61% | 76% | 2 | 42% | 47% | 55% | 57% | 5.4 / 46% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range, Cover (a creature in the line; the map's own cover 5% Medium, 15% Low), shooting while Engaged and into melee; Flanking for both sides; Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 9% · a PC Down during the day 100% · Downs a day 5.13 · Rally Points left at the end 28% · Health at the end 5%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 22% | 10% |
| 2: 4 standard | 93% | 4.0 | 43% | 48% |
| 3: 1 elite, 2 standard | 97% | 4.0 | 41% | 57% |
| 4: 2 elite, 2 standard | 10% | 4.4 | 80% | 99% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 269.1 | 230.8 |
| Damage a turn (its own turns) | 25.7 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.1 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.5 | 11.0 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 97.3 | 60.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.2 | 60.8 |
| Damage taken a round of combat | 6.6 | 4.2 |
| Times Down | 1.29 | 1.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.26 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 1.45 | 1.67 |
| Rally Points used between fights | 3.62 | 2.79 |
| Rally Points left | 1.67 | 2.49 |
| **Buffs:** healed allies (Lay On Hands) | 24.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.5 | 4.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 6.5 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 39.3 |
| ... into melee (1 Bane) | 0.0 | 23.9 |
| ... with Cover | 0.0 | 17.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.79 | 5.73 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.53 |
| **Debuff:** Immobilized (times) | 0.00 | 2.20 |
| **Debuff:** Prone (times) | 0.79 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 57% · a PC Down during the day 97% · Downs a day 3.67 · Rally Points left at the end 34% · Health at the end 47%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 24% | 14% |
| 2: 4 standard | 98% | 3.8 | 39% | 44% |
| 3: 1 elite, 2 standard | 99% | 3.6 | 31% | 39% |
| 4: 2 elite, 2 standard | 59% | 5.9 | 70% | 90% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 338.1 | 241.9 |
| Damage a turn (its own turns) | 26.4 | 20.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 22.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.0 | 11.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 116.7 | 54.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.0 | 54.2 |
| Damage taken a round of combat | 5.1 | 3.4 |
| Times Down | 0.71 | 1.12 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.31 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.93 | 4.25 |
| Rally Points left | 2.76 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 20.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 35.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.0 | 0.0 |
| **Map:** AP spent moving | 6.5 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.2 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 41.8 |
| ... into melee (1 Bane) | 0.0 | 27.8 |
| ... with Cover | 0.0 | 19.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 11.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.77 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.59 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 59% · a PC Down during the day 98% · Downs a day 3.77 · Rally Points left at the end 30% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 24% | 16% |
| 2: 4 standard | 98% | 4.0 | 40% | 49% |
| 3: 1 elite, 2 standard | 99% | 3.8 | 34% | 41% |
| 4: 2 elite, 2 standard | 61% | 6.2 | 70% | 90% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 343.4 | 247.2 |
| Damage a turn (its own turns) | 26.4 | 20.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 22.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.1 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.2 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 121.6 | 55.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 86.5 | 55.9 |
| Damage taken a round of combat | 5.3 | 3.4 |
| Times Down | 0.72 | 1.17 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.55 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.14 | 4.42 |
| Rally Points left | 2.31 | 2.21 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 6.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 20.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Map:** AP spent moving | 6.4 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 8.5 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 42.4 |
| ... into melee (1 Bane) | 0.0 | 28.1 |
| ... with Cover | 0.0 | 19.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.88 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.65 |
| **Debuff:** Immobilized (times) | 0.00 | 2.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 84% · a PC Down during the day 71% · Downs a day 1.59 · Rally Points left at the end 29% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.2 | 3% | 4% |
| 2: 4 standard | 100% | 4.4 | 7% | 16% |
| 3: 1 elite, 2 standard | 100% | 4.3 | 7% | 16% |
| 4: 2 elite, 2 standard | 84% | 6.9 | 32% | 58% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 238.6 | 334.3 |
| Damage a turn (its own turns) | 14.9 | 21.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.4 | 23.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 16.2 | 15.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 139.1 | 72.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.9 | 72.0 |
| Damage taken a round of combat | 5.1 | 3.9 |
| Times Down | 0.28 | 0.52 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.53 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.62 | 3.69 |
| Rally Points used between fights | 0.52 | 1.29 |
| Rally Points left | 2.32 | 2.02 |
| **Buffs:** healed allies (Lay On Hands) | 51.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 33.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 45.9 | 0.0 |
| Guard given (damage it took instead of Health) | 43.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.1 | 0.0 |
| **Map:** AP spent moving | 7.5 | 5.4 |
| AP lost to moving (Actions dropped or made smaller) | 7.5 | 0.0 |
| Turns that start Engaged | 10.7 | 5.4 |
| Shots ([Ranged] Actions) | 0.0 | 57.1 |
| ... into melee (1 Bane) | 0.0 | 41.6 |
| ... with Cover | 0.0 | 26.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 15.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.50 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.36 |
| **Debuff:** Immobilized (times) | 0.00 | 3.14 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 72% · a PC Down during the day 85% · Downs a day 2.39 · Rally Points left at the end 35% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 9% | 6% |
| 2: 4 standard | 99% | 4.0 | 19% | 24% |
| 3: 1 elite, 2 standard | 100% | 3.9 | 14% | 23% |
| 4: 2 elite, 2 standard | 73% | 6.3 | 51% | 75% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 378.7 | 207.3 | 288.0 |
| Damage a turn (its own turns) | 26.4 | 15.2 | 21.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 12.1 | 23.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - | - |
| Share of the party's damage (%) | 33 | 18 | 25 |
| Turns taken | 14.4 | 13.8 | 13.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 129.3 | 121.8 | 62.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 89.0 | 85.8 | 62.4 |
| Damage taken a round of combat | 5.3 | 5.1 | 3.7 |
| Times Down | 0.40 | 0.54 | 0.73 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.57 | 3.94 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 2.74 | 0.00 | 2.17 |
| Rally Points used between fights | 1.36 | 2.14 | 2.22 |
| Rally Points left | 3.33 | 1.93 | 2.56 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 57.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 24.2 | 27.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 52.7 | 0.0 |
| Guard given (damage it took instead of Health) | 40.3 | 36.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.0 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.9 | 6.8 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 6.8 | 0.0 |
| Turns that start Engaged | 9.4 | 8.8 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 49.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 34.5 |
| ... with Cover | 0.0 | 0.0 | 22.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 13.1 | 11.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 7.09 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.39 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.70 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.87 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 74% · a PC Down during the day 92% · Downs a day 2.79 · Rally Points left at the end 39% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 11% |
| 2: 4 standard | 99% | 3.6 | 34% | 34% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 28% | 30% |
| 4: 2 elite, 2 standard | 74% | 6.0 | 62% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 342.1 | 263.3 |
| Damage a turn (its own turns) | 26.3 | 22.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.1 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 114.5 | 53.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.1 | 53.2 |
| Damage taken a round of combat | 5.0 | 3.3 |
| Times Down | 0.47 | 0.92 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.35 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.92 | 4.15 |
| Rally Points left | 3.73 | 2.48 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 21.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.3 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.3 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 42.7 |
| ... into melee (1 Bane) | 0.0 | 29.1 |
| ... with Cover | 0.0 | 19.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.63 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.18 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.91 |
| **Debuff:** Immobilized (times) | 0.00 | 0.54 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.91 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 92% · a PC Down during the day 55% · Downs a day 1.00 · Rally Points left at the end 37% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.1 | 3% | 3% |
| 2: 4 standard | 100% | 4.3 | 6% | 11% |
| 3: 1 elite, 2 standard | 100% | 4.1 | 5% | 10% |
| 4: 2 elite, 2 standard | 93% | 6.6 | 21% | 45% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 235.1 | 355.4 |
| Damage a turn (its own turns) | 14.9 | 23.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.3 | 24.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 15.9 | 15.4 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 134.7 | 71.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 94.0 | 71.0 |
| Damage taken a round of combat | 5.2 | 3.9 |
| Times Down | 0.15 | 0.35 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.36 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.57 | 3.73 |
| Rally Points used between fights | 0.44 | 0.98 |
| Rally Points left | 3.63 | 2.28 |
| **Buffs:** healed allies (Lay On Hands) | 56.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 32.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 46.1 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.9 | 0.0 |
| **Map:** AP spent moving | 7.5 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.5 | 0.0 |
| Turns that start Engaged | 10.4 | 5.3 |
| Shots ([Ranged] Actions) | 0.0 | 57.0 |
| ... into melee (1 Bane) | 0.0 | 42.0 |
| ... with Cover | 0.0 | 26.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 15.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.49 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (times) | 0.00 | 3.05 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.92 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 82% · Downs a day 1.74 · Rally Points left at the end 44% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 8% |
| 2: 4 standard | 100% | 3.6 | 32% | 28% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 23% | 20% |
| 4: 2 elite, 2 standard | 96% | 5.6 | 44% | 70% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 366.5 | 263.9 |
| Damage a turn (its own turns) | 28.1 | 22.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.8 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.2 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.1 | 11.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 104.5 | 50.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 8.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 65.3 | 50.8 |
| Damage taken a round of combat | 4.3 | 3.3 |
| Times Down | 0.16 | 0.71 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.74 | 0.27 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.60 | 4.84 |
| Rally Points left | 4.66 | 2.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 20.9 | 0.0 |
| Banes given (damage its areas stopped) | 3.7 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.9 | 0.0 |
| Guard given (damage it took instead of Health) | 30.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.9 | 0.0 |
| **Map:** AP spent moving | 6.8 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 8.1 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 42.0 |
| ... into melee (1 Bane) | 0.0 | 29.1 |
| ... with Cover | 0.0 | 19.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.71 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.10 |
| **Debuff:** Hindered (times) | 0.00 | 2.20 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.94 |
| **Debuff:** Immobilized (times) | 0.00 | 0.57 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 34% · Downs a day 0.43 · Rally Points left at the end 49% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.1 | 3% | 1% |
| 2: 4 standard | 100% | 4.2 | 4% | 8% |
| 3: 1 elite, 2 standard | 100% | 3.8 | 3% | 6% |
| 4: 2 elite, 2 standard | 100% | 6.0 | 8% | 23% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 243.2 | 356.2 |
| Damage a turn (its own turns) | 16.0 | 23.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 13.9 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 21.7 | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 15.2 | 15.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 121.6 | 66.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 8.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.3 | 0.0 |
| Damage taken | 77.0 | 66.0 |
| Damage taken a round of combat | 4.5 | 3.8 |
| Times Down | 0.04 | 0.17 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.74 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.03 | 3.88 |
| Rally Points used between fights | 0.28 | 0.83 |
| Rally Points left | 4.95 | 3.29 |
| **Buffs:** healed allies (Lay On Hands) | 53.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 31.8 | 0.0 |
| Banes given (damage its areas stopped) | 4.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 41.6 | 0.0 |
| Guard given (damage it took instead of Health) | 35.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.5 | 0.0 |
| **Map:** AP spent moving | 7.5 | 5.2 |
| AP lost to moving (Actions dropped or made smaller) | 7.5 | 0.0 |
| Turns that start Engaged | 9.7 | 5.2 |
| Shots ([Ranged] Actions) | 0.0 | 56.1 |
| ... into melee (1 Bane) | 0.0 | 41.8 |
| ... with Cover | 0.0 | 25.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 13.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.58 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (times) | 0.00 | 3.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.89 |
| **Debuff:** Immobilized (times) | 0.00 | 0.57 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.91 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 70% · a PC Down during the day 94% · Downs a day 3.04 · Rally Points left at the end 35% · Health at the end 60%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 23% | 13% |
| 2: 4 standard | 100% | 3.5 | 33% | 36% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 28% | 34% |
| 4: 2 elite, 2 standard | 70% | 5.9 | 64% | 83% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 328.8 | 271.9 |
| Damage a turn (its own turns) | 26.4 | 23.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.6 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 105.9 | 49.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 73.7 | 49.5 |
| Damage taken a round of combat | 4.8 | 3.2 |
| Times Down | 0.56 | 0.96 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.21 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 4.22 |
| Rally Points left | 2.89 | 2.43 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.4 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 7.8 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 44.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 11.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.62 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.86 |
| **Debuff:** Immobilized (times) | 0.00 | 3.18 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.58 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 75% · a PC Down during the day 92% · Downs a day 2.66 · Rally Points left at the end 35% · Health at the end 66%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 23% | 13% |
| 2: 4 standard | 100% | 3.5 | 33% | 33% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 26% | 28% |
| 4: 2 elite, 2 standard | 76% | 5.9 | 60% | 79% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 340.3 | 285.4 |
| Damage a turn (its own turns) | 26.3 | 24.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.1 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 105.0 | 47.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.3 | 47.0 |
| Damage taken a round of combat | 4.6 | 3.0 |
| Times Down | 0.48 | 0.85 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.22 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.00 | 4.08 |
| Rally Points left | 2.78 | 2.52 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 19.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.8 | 0.0 |
| **Map:** AP spent moving | 6.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 8.0 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 34.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.10 |
| **Debuff:** Immobilized (times) | 0.00 | 3.35 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.71 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 82% · a PC Down during the day 89% · Downs a day 2.36 · Rally Points left at the end 41% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 21% | 8% |
| 2: 4 standard | 100% | 3.3 | 31% | 27% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 25% | 26% |
| 4: 2 elite, 2 standard | 82% | 5.9 | 57% | 78% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 333.4 | 285.7 |
| Damage a turn (its own turns) | 26.4 | 24.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.9 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.7 | 11.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 104.4 | 49.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.8 | 49.3 |
| Damage taken a round of combat | 4.7 | 3.2 |
| Times Down | 0.38 | 0.80 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.17 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.85 | 4.05 |
| Rally Points left | 3.98 | 2.57 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 21.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.4 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 7.9 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 42.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 12.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.64 |
| **Debuff:** Immobilized (times) | 0.00 | 2.32 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.82 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 88% · a PC Down during the day 85% · Downs a day 1.96 · Rally Points left at the end 41% · Health at the end 80%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 22% | 11% |
| 2: 4 standard | 100% | 3.4 | 29% | 25% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 24% | 22% |
| 4: 2 elite, 2 standard | 89% | 5.9 | 52% | 71% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 341.5 | 298.1 |
| Damage a turn (its own turns) | 26.3 | 25.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.1 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 100.0 | 46.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.0 | 46.4 |
| Damage taken a round of combat | 4.4 | 3.0 |
| Times Down | 0.30 | 0.68 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.12 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.86 | 4.03 |
| Rally Points left | 4.02 | 2.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 20.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.3 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 7.9 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 32.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 15.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 13.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.83 |
| **Debuff:** Immobilized (times) | 0.00 | 2.50 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.83 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 72% · Downs a day 1.18 · Rally Points left at the end 51% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 19% | 7% |
| 2: 4 standard | 100% | 3.3 | 29% | 20% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 20% | 16% |
| 4: 2 elite, 2 standard | 99% | 4.9 | 36% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 339.9 | 298.1 |
| Damage a turn (its own turns) | 28.5 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.7 | 25.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.2 | 28.7 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.0 | 11.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 87.6 | 43.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 56.3 | 43.0 |
| Damage taken a round of combat | 4.0 | 3.1 |
| Times Down | 0.11 | 0.48 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.56 | 0.25 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.27 | 4.27 |
| Rally Points left | 5.16 | 3.48 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 20.6 | 0.0 |
| Banes given (damage its areas stopped) | 3.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.3 | 0.0 |
| Guard given (damage it took instead of Health) | 24.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.1 | 0.0 |
| **Map:** AP spent moving | 6.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 7.1 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 40.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 18.8 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 11.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.54 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.38 |
| **Debuff:** Immobilized (times) | 0.00 | 2.17 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.99 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.02 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 67% · Downs a day 1.06 · Rally Points left at the end 52% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 20% | 7% |
| 2: 4 standard | 100% | 3.3 | 28% | 20% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 19% | 12% |
| 4: 2 elite, 2 standard | 99% | 4.8 | 34% | 48% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 345.6 | 311.6 |
| Damage a turn (its own turns) | 28.2 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.8 | 25.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.8 | 29.7 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.3 | 11.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 85.3 | 41.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.5 | 0.0 |
| Damage taken | 54.4 | 41.6 |
| Damage taken a round of combat | 3.8 | 2.9 |
| Times Down | 0.09 | 0.44 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.49 | 0.28 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.22 | 4.13 |
| Rally Points left | 5.28 | 3.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.7 |
| Divine Surge given (extra damage dealt by allies) | 18.9 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.3 | 0.0 |
| Guard given (damage it took instead of Health) | 24.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 2.9 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 7.1 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 29.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 12.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.89 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (times) | 0.00 | 2.29 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.16 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.99 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 1% · a PC Down during the day 100% · Downs a day 4.80 · Rally Points left at the end 48% · Health at the end 0%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 99% | 3.8 | 41% | 22% |
| 2: 6 standard | 27% | 4.7 | 83% | 94% |
| 3: 2 elite | 77% | 4.2 | 49% | 78% |
| 4: 1 elite, 4 standard | 3% | 3.0 | 59% | 100% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 185.1 | 158.5 |
| Damage a turn (its own turns) | 25.7 | 20.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.7 | 21.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 7.3 | 7.7 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 82.7 | 53.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.1 | 53.9 |
| Damage taken a round of combat | 8.2 | 5.6 |
| Times Down | 1.21 | 1.19 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.27 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 1.09 | 1.46 |
| Rally Points used between fights | 2.08 | 1.78 |
| Rally Points left | 3.56 | 3.72 |
| **Buffs:** healed allies (Lay On Hands) | 20.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 2.6 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 1.7 | 0.0 |
| Turns that start Engaged | 5.4 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 26.5 |
| ... into melee (1 Bane) | 0.0 | 14.6 |
| ... with Cover | 0.0 | 12.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 4.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.47 | 4.30 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.04 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.65 |
| **Debuff:** Immobilized (times) | 0.00 | 1.66 |
| **Debuff:** Prone (times) | 0.47 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.42 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 31% · a PC Down during the day 99% · Downs a day 4.79 · Rally Points left at the end 41% · Health at the end 21%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 42% | 35% |
| 2: 6 standard | 61% | 5.7 | 69% | 87% |
| 3: 2 elite | 100% | 3.7 | 34% | 49% |
| 4: 1 elite, 4 standard | 51% | 5.6 | 70% | 93% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 317.8 | 204.8 |
| Damage a turn (its own turns) | 26.5 | 20.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 21.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.2 | 10.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 131.1 | 60.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.7 | 60.8 |
| Damage taken a round of combat | 6.1 | 4.3 |
| Times Down | 0.92 | 1.48 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.48 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.14 | 3.93 |
| Rally Points left | 3.37 | 2.74 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 18.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 44.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.4 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 0.0 |
| Turns that start Engaged | 9.0 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 34.6 |
| ... into melee (1 Bane) | 0.0 | 21.7 |
| ... with Cover | 0.0 | 16.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 8.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.27 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.44 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.30 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 30% · a PC Down during the day 100% · Downs a day 4.98 · Rally Points left at the end 37% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 43% | 35% |
| 2: 6 standard | 63% | 6.0 | 69% | 87% |
| 3: 2 elite | 99% | 4.0 | 38% | 52% |
| 4: 1 elite, 4 standard | 48% | 5.8 | 72% | 95% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 329.2 | 207.8 |
| Damage a turn (its own turns) | 26.3 | 20.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 21.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.7 | 10.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 143.0 | 63.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 23.6 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.7 | 0.0 |
| Damage taken | 92.9 | 63.2 |
| Damage taken a round of combat | 6.2 | 4.2 |
| Times Down | 0.92 | 1.57 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.75 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.34 | 4.05 |
| Rally Points left | 2.91 | 2.62 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 6.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 26.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.3 | 0.0 |
| **Map:** AP spent moving | 4.3 | 4.4 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 0.0 |
| Turns that start Engaged | 9.6 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 35.3 |
| ... into melee (1 Bane) | 0.0 | 22.0 |
| ... with Cover | 0.0 | 16.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 8.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.28 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.43 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.33 |
| **Debuff:** Immobilized (times) | 0.00 | 1.96 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.55 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 83% · Downs a day 2.68 · Rally Points left at the end 24% · Health at the end 46%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.4 | 3% | 3% |
| 2: 6 standard | 83% | 6.4 | 27% | 47% |
| 3: 2 elite | 99% | 4.4 | 10% | 20% |
| 4: 1 elite, 4 standard | 70% | 6.6 | 44% | 68% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 253.8 | 341.2 |
| Damage a turn (its own turns) | 15.2 | 21.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.9 | 22.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 16.9 | 15.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 175.5 | 91.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 117.2 | 91.6 |
| Damage taken a round of combat | 6.1 | 4.7 |
| Times Down | 0.54 | 0.80 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.88 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.83 | 4.20 |
| Rally Points used between fights | 0.40 | 1.05 |
| Rally Points left | 1.90 | 1.75 |
| **Buffs:** healed allies (Lay On Hands) | 56.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 35.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 57.6 | 0.0 |
| Guard given (damage it took instead of Health) | 58.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.8 | 0.0 |
| **Map:** AP spent moving | 6.1 | 7.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.1 | 0.0 |
| Turns that start Engaged | 12.6 | 7.2 |
| Shots ([Ranged] Actions) | 0.0 | 57.4 |
| ... into melee (1 Bane) | 0.0 | 40.3 |
| ... with Cover | 0.0 | 26.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 13.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.00 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.61 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.60 |
| **Debuff:** Immobilized (times) | 0.00 | 3.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.65 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 45% · a PC Down during the day 95% · Downs a day 3.70 · Rally Points left at the end 34% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 16% | 10% |
| 2: 6 standard | 75% | 5.9 | 47% | 70% |
| 3: 2 elite | 100% | 4.0 | 18% | 34% |
| 4: 1 elite, 4 standard | 61% | 6.0 | 56% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 384.5 | 207.5 | 278.1 |
| Damage a turn (its own turns) | 26.2 | 15.5 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.8 | 12.8 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - | - |
| Share of the party's damage (%) | 34 | 18 | 24 |
| Turns taken | 14.8 | 13.6 | 13.0 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 155.3 | 143.9 | 76.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 101.3 | 97.1 | 76.4 |
| Damage taken a round of combat | 6.1 | 5.9 | 4.6 |
| Times Down | 0.68 | 0.86 | 1.08 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.80 | 4.02 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 2.56 | 0.00 | 2.35 |
| Rally Points used between fights | 1.30 | 1.92 | 2.22 |
| Rally Points left | 3.34 | 2.06 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 58.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 25.3 | 27.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 58.8 | 0.0 |
| Guard given (damage it took instead of Health) | 53.9 | 46.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.9 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.7 | 5.1 | 5.8 |
| AP lost to moving (Actions dropped or made smaller) | 5.7 | 5.1 | 0.0 |
| Turns that start Engaged | 10.8 | 9.9 | 5.9 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 46.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 31.1 |
| ... with Cover | 0.0 | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 11.1 | 9.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 7.33 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.56 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.62 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.71 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.62 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 53% · a PC Down during the day 99% · Downs a day 4.04 · Rally Points left at the end 37% · Health at the end 42%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 38% | 24% |
| 2: 6 standard | 73% | 5.9 | 63% | 82% |
| 3: 2 elite | 100% | 3.5 | 29% | 36% |
| 4: 1 elite, 4 standard | 73% | 6.0 | 62% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 350.1 | 247.6 |
| Damage a turn (its own turns) | 26.2 | 21.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 23.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.6 | 11.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 141.2 | 64.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 93.1 | 64.7 |
| Damage taken a round of combat | 6.0 | 4.1 |
| Times Down | 0.69 | 1.33 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.72 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.64 | 4.36 |
| Rally Points left | 3.65 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 21.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.8 | 0.0 |
| **Map:** AP spent moving | 5.0 | 4.7 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 0.0 |
| Turns that start Engaged | 10.0 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 39.1 |
| ... into melee (1 Bane) | 0.0 | 25.4 |
| ... with Cover | 0.0 | 18.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.08 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.53 |
| **Debuff:** Hindered (times) | 0.00 | 2.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.59 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.62 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 81% · a PC Down during the day 71% · Downs a day 1.73 · Rally Points left at the end 25% · Health at the end 70%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 3% | 2% |
| 2: 6 standard | 92% | 6.3 | 17% | 37% |
| 3: 2 elite | 100% | 4.2 | 7% | 17% |
| 4: 1 elite, 4 standard | 88% | 6.5 | 27% | 51% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 268.8 | 393.3 |
| Damage a turn (its own turns) | 15.1 | 23.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.8 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 18.0 | 16.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 177.8 | 95.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 118.8 | 95.0 |
| Damage taken a round of combat | 5.9 | 4.7 |
| Times Down | 0.28 | 0.58 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.96 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 3.01 | 4.47 |
| Rally Points used between fights | 0.43 | 1.05 |
| Rally Points left | 2.60 | 1.48 |
| **Buffs:** healed allies (Lay On Hands) | 67.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 38.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 61.4 | 0.0 |
| Guard given (damage it took instead of Health) | 59.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.8 | 0.0 |
| **Map:** AP spent moving | 6.8 | 7.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 13.2 | 7.5 |
| Shots ([Ranged] Actions) | 0.0 | 61.8 |
| ... into melee (1 Bane) | 0.0 | 44.2 |
| ... with Cover | 0.0 | 29.2 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 14.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.61 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.75 |
| **Debuff:** Hindered (times) | 0.00 | 3.56 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.67 |
| **Debuff:** Immobilized (times) | 0.00 | 0.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.68 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 91% · a PC Down during the day 95% · Downs a day 2.77 · Rally Points left at the end 33% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 37% | 21% |
| 2: 6 standard | 96% | 5.4 | 44% | 67% |
| 3: 2 elite | 100% | 3.3 | 25% | 30% |
| 4: 1 elite, 4 standard | 95% | 5.5 | 48% | 69% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 433.8 | 286.6 |
| Damage a turn (its own turns) | 28.6 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.1 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.6 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 15.2 | 12.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 141.5 | 68.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.0 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 80.2 | 68.2 |
| Damage taken a round of combat | 4.6 | 3.9 |
| Times Down | 0.26 | 1.13 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.07 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.03 | 5.92 |
| Rally Points left | 3.90 | 1.71 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 2.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.7 | 0.0 |
| Guard given (damage it took instead of Health) | 47.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.7 | 0.0 |
| **Map:** AP spent moving | 6.1 | 5.1 |
| AP lost to moving (Actions dropped or made smaller) | 6.1 | 0.0 |
| Turns that start Engaged | 10.8 | 5.2 |
| Shots ([Ranged] Actions) | 0.0 | 44.6 |
| ... into melee (1 Bane) | 0.0 | 30.1 |
| ... with Cover | 0.0 | 21.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 12.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.55 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.75 |
| **Debuff:** Hindered (times) | 0.00 | 2.45 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.67 |
| **Debuff:** Immobilized (times) | 0.00 | 0.43 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.66 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 47% · Downs a day 0.75 · Rally Points left at the end 36% · Health at the end 91%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 2% | 1% |
| 2: 6 standard | 98% | 5.8 | 8% | 21% |
| 3: 2 elite | 100% | 3.9 | 4% | 8% |
| 4: 1 elite, 4 standard | 98% | 5.8 | 12% | 30% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 297.0 | 403.7 |
| Damage a turn (its own turns) | 16.9 | 23.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 15.0 | 24.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 17.7 | 17.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 165.5 | 92.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.6 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.4 | 0.0 |
| Damage taken | 95.8 | 92.0 |
| Damage taken a round of combat | 4.9 | 4.7 |
| Times Down | 0.07 | 0.30 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.16 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.48 | 4.98 |
| Rally Points used between fights | 0.25 | 0.94 |
| Rally Points left | 4.11 | 2.08 |
| **Buffs:** healed allies (Lay On Hands) | 67.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 38.4 | 0.0 |
| Banes given (damage its areas stopped) | 2.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 55.1 | 0.0 |
| Guard given (damage it took instead of Health) | 54.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 22.1 | 0.0 |
| **Map:** AP spent moving | 7.2 | 7.4 |
| AP lost to moving (Actions dropped or made smaller) | 7.2 | 0.0 |
| Turns that start Engaged | 12.6 | 7.6 |
| Shots ([Ranged] Actions) | 0.0 | 62.3 |
| ... into melee (1 Bane) | 0.0 | 45.3 |
| ... with Cover | 0.0 | 29.2 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 14.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.71 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.82 |
| **Debuff:** Hindered (times) | 0.00 | 3.64 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.68 |
| **Debuff:** Immobilized (times) | 0.00 | 0.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.73 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 45% · a PC Down during the day 99% · Downs a day 4.29 · Rally Points left at the end 36% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 39% | 27% |
| 2: 6 standard | 71% | 5.7 | 63% | 84% |
| 3: 2 elite | 100% | 3.4 | 29% | 35% |
| 4: 1 elite, 4 standard | 64% | 5.8 | 66% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 331.0 | 252.5 |
| Damage a turn (its own turns) | 26.2 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 12.8 | 10.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 129.6 | 59.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.0 | 59.5 |
| Damage taken a round of combat | 5.7 | 4.0 |
| Times Down | 0.80 | 1.35 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.49 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.52 | 4.20 |
| Rally Points left | 2.99 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 44.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.9 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 9.1 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 41.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.8 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 9.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.52 |
| **Debuff:** Immobilized (times) | 0.00 | 2.86 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.79 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 52% · a PC Down during the day 99% · Downs a day 3.98 · Rally Points left at the end 35% · Health at the end 39%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 38% | 25% |
| 2: 6 standard | 73% | 5.8 | 62% | 83% |
| 3: 2 elite | 100% | 3.4 | 28% | 30% |
| 4: 1 elite, 4 standard | 71% | 5.9 | 62% | 83% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 340.9 | 265.0 |
| Damage a turn (its own turns) | 26.2 | 23.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.2 | 11.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 128.8 | 57.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.0 | 57.3 |
| Damage taken a round of combat | 5.5 | 3.7 |
| Times Down | 0.74 | 1.25 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.50 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.62 | 4.14 |
| Rally Points left | 2.87 | 2.45 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 44.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.0 | 0.0 |
| **Map:** AP spent moving | 5.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 9.4 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 32.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 10.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.71 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.68 |
| **Debuff:** Immobilized (times) | 0.00 | 3.04 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.98 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 97% · Downs a day 3.52 · Rally Points left at the end 34% · Health at the end 55%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 35% | 18% |
| 2: 6 standard | 84% | 5.7 | 57% | 77% |
| 3: 2 elite | 100% | 3.3 | 26% | 30% |
| 4: 1 elite, 4 standard | 80% | 5.8 | 58% | 78% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 360.7 | 285.0 |
| Damage a turn (its own turns) | 26.1 | 24.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.6 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.0 | 11.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 133.1 | 63.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 87.0 | 63.9 |
| Damage taken a round of combat | 5.4 | 3.9 |
| Times Down | 0.55 | 1.20 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.56 | 0.46 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 4.62 |
| Rally Points left | 3.53 | 1.92 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 24.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 46.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.4 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 9.8 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 43.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.6 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 11.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.95 |
| **Debuff:** Immobilized (times) | 0.00 | 2.49 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.66 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 96% · Downs a day 3.09 · Rally Points left at the end 34% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 35% | 18% |
| 2: 6 standard | 84% | 5.7 | 55% | 74% |
| 3: 2 elite | 100% | 3.3 | 25% | 24% |
| 4: 1 elite, 4 standard | 86% | 5.8 | 53% | 73% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 370.2 | 298.3 |
| Damage a turn (its own turns) | 26.1 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.3 | 12.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 130.6 | 60.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.5 | 60.6 |
| Damage taken a round of combat | 5.2 | 3.7 |
| Times Down | 0.47 | 1.08 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.53 | 0.47 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.99 | 4.52 |
| Rally Points left | 3.48 | 2.00 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 46.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.3 | 0.0 |
| **Map:** AP spent moving | 5.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.9 | 0.0 |
| Turns that start Engaged | 10.0 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 33.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 12.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.00 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.12 |
| **Debuff:** Immobilized (times) | 0.00 | 2.58 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.30 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 95% · a PC Down during the day 88% · Downs a day 2.04 · Rally Points left at the end 39% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.4 | 33% | 13% |
| 2: 6 standard | 97% | 5.0 | 39% | 58% |
| 3: 2 elite | 100% | 3.0 | 21% | 15% |
| 4: 1 elite, 4 standard | 98% | 5.0 | 42% | 59% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 403.9 | 327.0 |
| Damage a turn (its own turns) | 28.7 | 26.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 25.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.5 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.1 | 12.3 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 123.1 | 59.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.3 | 0.0 |
| Damage taken | 70.3 | 59.2 |
| Damage taken a round of combat | 4.4 | 3.7 |
| Times Down | 0.19 | 0.83 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.83 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.75 | 5.48 |
| Rally Points left | 4.42 | 2.17 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 25.6 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.7 | 0.0 |
| **Map:** AP spent moving | 6.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 9.5 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 44.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.3 |
| ... while Engaged (2 Banes) | 0.0 | 1.4 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.67 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.96 |
| **Debuff:** Immobilized (times) | 0.00 | 2.59 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.12 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 83% · Downs a day 1.75 · Rally Points left at the end 40% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 33% | 14% |
| 2: 6 standard | 99% | 5.0 | 36% | 52% |
| 3: 2 elite | 100% | 3.0 | 20% | 13% |
| 4: 1 elite, 4 standard | 99% | 4.9 | 39% | 54% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 411.1 | 346.6 |
| Damage a turn (its own turns) | 28.7 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 26.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.6 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.4 | 12.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 117.0 | 56.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.0 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 66.7 | 56.4 |
| Damage taken a round of combat | 4.1 | 3.4 |
| Times Down | 0.14 | 0.73 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.75 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.69 | 5.30 |
| Rally Points left | 4.56 | 2.31 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.4 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.3 | 0.0 |
| Guard given (damage it took instead of Health) | 39.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.5 | 0.0 |
| **Map:** AP spent moving | 6.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 9.5 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 33.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.07 |
| **Debuff:** Immobilized (times) | 0.00 | 2.72 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 2% · a PC Down during the day 100% · Downs a day 4.86 · Rally Points left at the end 51% · Health at the end 1%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 97% | 3.9 | 44% | 46% |
| 2: 2 elite, 2 standard | 26% | 5.1 | 85% | 96% |
| 3: 6 standard | 10% | 4.0 | 79% | 100% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 169.1 | 148.1 |
| Damage a turn (its own turns) | 25.2 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 21.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 6.7 | 7.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 80.4 | 51.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.1 | 51.5 |
| Damage taken a round of combat | 8.1 | 5.4 |
| Times Down | 1.22 | 1.21 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.16 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 1.06 | 1.23 |
| Rally Points used between fights | 2.07 | 1.74 |
| Rally Points left | 3.71 | 3.98 |
| **Buffs:** healed allies (Lay On Hands) | 18.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 3.0 | 2.9 |
| AP lost to moving (Actions dropped or made smaller) | 2.1 | 0.0 |
| Turns that start Engaged | 4.6 | 3.0 |
| Shots ([Ranged] Actions) | 0.0 | 25.1 |
| ... into melee (1 Bane) | 0.0 | 14.3 |
| ... with Cover | 0.0 | 11.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 4.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.42 | 3.81 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.40 |
| **Debuff:** Immobilized (times) | 0.00 | 1.42 |
| **Debuff:** Prone (times) | 0.42 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.45 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 37% · a PC Down during the day 98% · Downs a day 4.35 · Rally Points left at the end 47% · Health at the end 30%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.8 | 39% | 39% |
| 2: 2 elite, 2 standard | 62% | 6.0 | 70% | 88% |
| 3: 6 standard | 60% | 5.7 | 70% | 88% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 258.4 | 177.3 |
| Damage a turn (its own turns) | 25.8 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.5 | 21.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 10.2 | 8.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 116.8 | 52.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.2 | 52.7 |
| Damage taken a round of combat | 6.3 | 4.2 |
| Times Down | 0.87 | 1.30 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.47 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.76 | 3.34 |
| Rally Points left | 3.77 | 3.31 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 15.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.6 | 0.0 |
| **Map:** AP spent moving | 3.9 | 3.3 |
| AP lost to moving (Actions dropped or made smaller) | 3.9 | 0.0 |
| Turns that start Engaged | 7.3 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 30.0 |
| ... into melee (1 Bane) | 0.0 | 18.9 |
| ... with Cover | 0.0 | 13.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 7.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.37 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.74 |
| **Debuff:** Immobilized (times) | 0.00 | 1.63 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.53 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 41% · a PC Down during the day 99% · Downs a day 4.34 · Rally Points left at the end 43% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.8 | 41% | 41% |
| 2: 2 elite, 2 standard | 65% | 6.3 | 68% | 88% |
| 3: 6 standard | 63% | 6.1 | 70% | 89% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 272.8 | 178.3 |
| Damage a turn (its own turns) | 25.9 | 20.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 21.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 10.7 | 8.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 126.9 | 54.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 19.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.4 | 0.0 |
| Damage taken | 82.7 | 54.0 |
| Damage taken a round of combat | 6.2 | 4.1 |
| Times Down | 0.83 | 1.34 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.71 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.93 | 3.49 |
| Rally Points left | 3.36 | 3.16 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 5.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 24.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.1 | 0.0 |
| **Map:** AP spent moving | 3.9 | 3.3 |
| AP lost to moving (Actions dropped or made smaller) | 3.9 | 0.0 |
| Turns that start Engaged | 7.9 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 30.2 |
| ... into melee (1 Bane) | 0.0 | 19.1 |
| ... with Cover | 0.0 | 13.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.43 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.79 |
| **Debuff:** Immobilized (times) | 0.00 | 1.64 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 70% · a PC Down during the day 79% · Downs a day 2.28 · Rally Points left at the end 28% · Health at the end 59%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.4 | 8% | 16% |
| 2: 2 elite, 2 standard | 88% | 6.7 | 26% | 52% |
| 3: 6 standard | 79% | 6.5 | 36% | 58% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 209.8 | 288.9 |
| Damage a turn (its own turns) | 15.0 | 21.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.8 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 14.2 | 13.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 153.5 | 77.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 104.5 | 77.8 |
| Damage taken a round of combat | 6.3 | 4.7 |
| Times Down | 0.46 | 0.68 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.68 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.59 | 3.61 |
| Rally Points used between fights | 0.59 | 1.33 |
| Rally Points left | 2.14 | 2.05 |
| **Buffs:** healed allies (Lay On Hands) | 50.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 29.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 46.7 | 0.0 |
| Guard given (damage it took instead of Health) | 49.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.4 | 0.0 |
| **Map:** AP spent moving | 5.3 | 5.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.3 | 0.0 |
| Turns that start Engaged | 10.3 | 5.6 |
| Shots ([Ranged] Actions) | 0.0 | 48.5 |
| ... into melee (1 Bane) | 0.0 | 34.1 |
| ... with Cover | 0.0 | 22.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 11.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.69 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.85 |
| **Debuff:** Immobilized (times) | 0.00 | 2.83 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 50% · a PC Down during the day 95% · Downs a day 3.42 · Rally Points left at the end 40% · Health at the end 41%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 4.0 | 19% | 21% |
| 2: 2 elite, 2 standard | 75% | 6.3 | 49% | 75% |
| 3: 6 standard | 67% | 6.0 | 53% | 75% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 312.5 | 169.8 | 223.6 |
| Damage a turn (its own turns) | 25.9 | 15.4 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.4 | 12.7 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - | - |
| Share of the party's damage (%) | 34 | 18 | 24 |
| Turns taken | 12.2 | 11.2 | 10.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 137.6 | 125.6 | 64.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 92.0 | 86.6 | 64.6 |
| Damage taken a round of combat | 6.5 | 6.1 | 4.5 |
| Times Down | 0.61 | 0.79 | 1.01 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.82 | 3.62 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 2.25 | 0.00 | 1.83 |
| Rally Points used between fights | 1.25 | 1.77 | 2.23 |
| Rally Points left | 3.68 | 2.60 | 2.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 47.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 19.8 | 21.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 45.9 | 0.0 |
| Guard given (damage it took instead of Health) | 45.6 | 39.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.9 | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.7 | 4.4 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 4.4 | 0.0 |
| Turns that start Engaged | 8.8 | 8.0 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 37.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 25.2 |
| ... with Cover | 0.0 | 0.0 | 17.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 9.8 | 8.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 5.85 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.64 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.54 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 57% · a PC Down during the day 98% · Downs a day 3.68 · Rally Points left at the end 44% · Health at the end 51%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 35% | 32% |
| 2: 2 elite, 2 standard | 76% | 6.0 | 62% | 82% |
| 3: 6 standard | 75% | 5.9 | 62% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 285.3 | 206.4 |
| Damage a turn (its own turns) | 25.8 | 22.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 23.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 11.3 | 9.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 124.9 | 55.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.0 | 55.5 |
| Damage taken a round of combat | 6.2 | 4.1 |
| Times Down | 0.66 | 1.18 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.64 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.18 | 3.75 |
| Rally Points left | 4.18 | 2.88 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 17.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.4 | 0.0 |
| **Map:** AP spent moving | 4.4 | 3.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 0.0 |
| Turns that start Engaged | 8.0 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 32.7 |
| ... into melee (1 Bane) | 0.0 | 21.5 |
| ... with Cover | 0.0 | 15.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.60 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.32 |
| **Debuff:** Hindered (times) | 0.00 | 1.79 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.50 |
| **Debuff:** Immobilized (times) | 0.00 | 0.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 85% · a PC Down during the day 67% · Downs a day 1.47 · Rally Points left at the end 34% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.2 | 5% | 10% |
| 2: 2 elite, 2 standard | 93% | 6.5 | 19% | 41% |
| 3: 6 standard | 92% | 6.3 | 21% | 42% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 215.2 | 315.9 |
| Damage a turn (its own turns) | 14.9 | 23.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.8 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 14.6 | 13.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 150.3 | 78.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 102.1 | 78.3 |
| Damage taken a round of combat | 6.2 | 4.7 |
| Times Down | 0.24 | 0.49 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.62 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.59 | 3.79 |
| Rally Points used between fights | 0.49 | 1.13 |
| Rally Points left | 3.29 | 2.07 |
| **Buffs:** healed allies (Lay On Hands) | 57.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 30.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 48.5 | 0.0 |
| Guard given (damage it took instead of Health) | 48.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.8 | 0.0 |
| **Map:** AP spent moving | 5.7 | 5.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.7 | 0.0 |
| Turns that start Engaged | 10.5 | 5.6 |
| Shots ([Ranged] Actions) | 0.0 | 49.6 |
| ... into melee (1 Bane) | 0.0 | 35.8 |
| ... with Cover | 0.0 | 22.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 12.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.79 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.42 |
| **Debuff:** Hindered (times) | 0.00 | 2.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.53 |
| **Debuff:** Immobilized (times) | 0.00 | 0.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 92% · a PC Down during the day 93% · Downs a day 2.40 · Rally Points left at the end 44% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 33% | 25% |
| 2: 2 elite, 2 standard | 97% | 5.4 | 43% | 67% |
| 3: 6 standard | 95% | 5.4 | 47% | 68% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 342.6 | 231.7 |
| Damage a turn (its own turns) | 28.1 | 22.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.7 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.8 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.3 | 10.0 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.3 | 55.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.1 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.8 | 0.0 |
| Damage taken | 68.7 | 55.9 |
| Damage taken a round of combat | 4.9 | 3.9 |
| Times Down | 0.25 | 0.96 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.98 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.26 | 4.96 |
| Rally Points left | 4.76 | 2.67 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 19.4 | 0.0 |
| Banes given (damage its areas stopped) | 4.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.6 | 0.0 |
| Guard given (damage it took instead of Health) | 38.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.3 | 0.0 |
| **Map:** AP spent moving | 4.9 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 0.0 |
| Turns that start Engaged | 8.6 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 35.8 |
| ... into melee (1 Bane) | 0.0 | 24.5 |
| ... with Cover | 0.0 | 16.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.83 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.46 |
| **Debuff:** Hindered (times) | 0.00 | 1.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.57 |
| **Debuff:** Immobilized (times) | 0.00 | 0.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.61 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 43% · Downs a day 0.64 · Rally Points left at the end 45% · Health at the end 94%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.2 | 4% | 7% |
| 2: 2 elite, 2 standard | 99% | 5.9 | 8% | 21% |
| 3: 6 standard | 98% | 5.6 | 10% | 24% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 233.0 | 325.7 |
| Damage a turn (its own turns) | 16.5 | 23.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 15.0 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 14.2 | 13.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 139.2 | 74.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.9 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.0 | 0.0 |
| Damage taken | 83.2 | 73.9 |
| Damage taken a round of combat | 5.3 | 4.7 |
| Times Down | 0.07 | 0.25 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.86 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.18 | 4.11 |
| Rally Points used between fights | 0.29 | 0.94 |
| Rally Points left | 4.67 | 2.95 |
| **Buffs:** healed allies (Lay On Hands) | 57.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 30.0 | 0.0 |
| Banes given (damage its areas stopped) | 4.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 43.8 | 0.0 |
| Guard given (damage it took instead of Health) | 43.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.9 | 0.0 |
| **Map:** AP spent moving | 5.7 | 5.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.7 | 0.0 |
| Turns that start Engaged | 10.0 | 5.6 |
| Shots ([Ranged] Actions) | 0.0 | 50.2 |
| ... into melee (1 Bane) | 0.0 | 36.8 |
| ... with Cover | 0.0 | 23.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.77 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.47 |
| **Debuff:** Hindered (times) | 0.00 | 2.89 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.56 |
| **Debuff:** Immobilized (times) | 0.00 | 0.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 50% · a PC Down during the day 98% · Downs a day 3.85 · Rally Points left at the end 44% · Health at the end 43%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 35% | 30% |
| 2: 2 elite, 2 standard | 73% | 5.9 | 64% | 84% |
| 3: 6 standard | 69% | 5.7 | 64% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 268.9 | 208.4 |
| Damage a turn (its own turns) | 25.8 | 23.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 23.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 10.6 | 8.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 112.2 | 50.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 75.3 | 50.8 |
| Damage taken a round of combat | 5.8 | 3.9 |
| Times Down | 0.74 | 1.18 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.40 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.03 | 3.59 |
| Rally Points left | 3.57 | 3.05 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.4 | 0.0 |
| **Map:** AP spent moving | 4.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.2 | 0.0 |
| Turns that start Engaged | 7.3 | 3.1 |
| Shots ([Ranged] Actions) | 0.0 | 34.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.9 |
| Flanking Boons on its melee Actions | 8.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.67 |
| **Debuff:** Immobilized (times) | 0.00 | 2.40 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.32 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 98% · Downs a day 3.61 · Rally Points left at the end 42% · Health at the end 50%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 34% | 30% |
| 2: 2 elite, 2 standard | 78% | 5.9 | 60% | 79% |
| 3: 6 standard | 74% | 5.8 | 62% | 83% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 280.1 | 224.8 |
| Damage a turn (its own turns) | 25.7 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.6 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.0 | 9.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 112.2 | 49.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.2 | 49.4 |
| Damage taken a round of combat | 5.5 | 3.7 |
| Times Down | 0.69 | 1.12 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.39 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.22 | 3.64 |
| Rally Points left | 3.39 | 2.94 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.5 | 0.0 |
| **Map:** AP spent moving | 4.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 0.0 |
| Turns that start Engaged | 7.5 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 27.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 12.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 9.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.06 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.01 |
| **Debuff:** Immobilized (times) | 0.00 | 2.52 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.52 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 68% · a PC Down during the day 95% · Downs a day 3.18 · Rally Points left at the end 44% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 32% | 24% |
| 2: 2 elite, 2 standard | 83% | 5.8 | 58% | 76% |
| 3: 6 standard | 82% | 5.7 | 57% | 74% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 284.0 | 230.6 |
| Damage a turn (its own turns) | 25.7 | 24.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.2 | 9.4 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 116.1 | 52.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.0 | 52.2 |
| Damage taken a round of combat | 5.8 | 3.9 |
| Times Down | 0.56 | 1.03 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.48 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.30 | 3.79 |
| Rally Points left | 4.22 | 2.83 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.5 | 0.0 |
| Turns that start Engaged | 7.7 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 34.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.7 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 9.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.68 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.17 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.55 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 75% · a PC Down during the day 94% · Downs a day 2.90 · Rally Points left at the end 43% · Health at the end 68%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 30% | 23% |
| 2: 2 elite, 2 standard | 88% | 6.0 | 54% | 74% |
| 3: 6 standard | 85% | 5.6 | 54% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 296.1 | 247.5 |
| Damage a turn (its own turns) | 25.4 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.8 | 10.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 114.4 | 51.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 75.4 | 51.2 |
| Damage taken a round of combat | 5.3 | 3.6 |
| Times Down | 0.49 | 0.96 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.44 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.40 | 3.87 |
| Rally Points left | 4.16 | 2.68 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 19.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 39.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 5.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 7.9 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 27.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 12.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.43 |
| **Debuff:** Immobilized (times) | 0.00 | 2.14 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.77 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 82% · Downs a day 1.69 · Rally Points left at the end 50% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.2 | 29% | 16% |
| 2: 2 elite, 2 standard | 98% | 4.9 | 37% | 51% |
| 3: 6 standard | 98% | 4.9 | 42% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 318.2 | 263.7 |
| Damage a turn (its own turns) | 28.3 | 26.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.8 | 25.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.4 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.3 | 9.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 100.8 | 47.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.9 | 0.0 |
| Damage taken | 59.4 | 47.0 |
| Damage taken a round of combat | 4.6 | 3.6 |
| Times Down | 0.18 | 0.66 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.72 | 0.31 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.05 | 4.42 |
| Rally Points left | 5.23 | 3.26 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 20.2 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.1 | 0.0 |
| Guard given (damage it took instead of Health) | 32.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.0 | 0.0 |
| **Map:** AP spent moving | 4.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 0.0 |
| Turns that start Engaged | 7.5 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 35.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 9.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.18 |
| **Debuff:** Immobilized (times) | 0.00 | 2.11 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.12 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.73 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 79% · Downs a day 1.53 · Rally Points left at the end 51% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 28% | 16% |
| 2: 2 elite, 2 standard | 99% | 4.9 | 34% | 49% |
| 3: 6 standard | 99% | 4.9 | 39% | 51% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 322.5 | 276.2 |
| Damage a turn (its own turns) | 28.2 | 27.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.8 | 26.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.3 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.5 | 10.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 96.7 | 46.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.2 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.1 | 0.0 |
| Damage taken | 55.9 | 45.9 |
| Damage taken a round of combat | 4.3 | 3.5 |
| Times Down | 0.14 | 0.63 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.68 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.90 | 4.32 |
| Rally Points left | 5.42 | 3.31 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.2 | 0.0 |
| Guard given (damage it took instead of Health) | 31.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.1 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 7.4 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 26.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 12.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.78 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.32 |
| **Debuff:** Immobilized (times) | 0.00 | 2.23 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.69 |
