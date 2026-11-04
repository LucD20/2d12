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
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 36.7 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.3 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.8 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

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
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.8 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.7 | 4 / 3.7 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 24.3 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 24.3 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 40.3 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 12.8 | 11.8 | 10.6 | 14.3 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 36 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 14 / 13.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.3 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 7.2 | 4 / 4.0 |

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
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 3 / 3.4 |

## Paladin (Smite, options) (tank / support), `classes/paladin-smite-1-options.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Aura of Protection, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Nova (plan, **best**) | 0 | 22.9 | 21.8 | 20.6 | 21.8 | 5 | 1 | Word of Radiance 3, Smite 2 |  |
| Steel | 0 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.8 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.5 | 5 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 7.3 | 3 / 3.4 |

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
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

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
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.6 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 42.4 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 20.0 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 17.9 | 16.6 | 15.2 | 20.0 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 35 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 13.7 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.7 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 4 / 3.9 / 5 | 99% | 26% | 28% | 2 | 7% | 7% | 10% | 12% | 3.3 / 23% |
| 2 Elites | 4 | 4 / 4.0 / 5 | 99% | 28% | 36% | 2 | 7% | 7% | 15% | 16% | 3.3 / 23% |
| Elite + 2 Standards | 4 | 4 / 3.9 / 5 | 100% | 25% | 29% | 2 | 4% | 6% | 14% | 10% | 3.3 / 21% |
| 8 Grunts | 4 | 4 / 4.0 / 5 | 100% | 26% | 13% | 2 | 1% | 2% | 4% | 8% | 3.6 / 28% |
| 2 Standards + 8 Minions | 4 | 4 / 3.9 / 5 | 100% | 19% | 17% | 3 | 2% | 1% | 9% | 6% | 3.6 / 25% |
| 6 Standards (CV 6, hard) | 6 | 6 / 6.0 / 8 | 62% | 68% | 83% | 2 | 47% | 47% | 63% | 65% | 5.5 / 53% |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 97% · Downs a day 3.59 · Rally Points left at the end 33% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 23% | 12% |
| 2: 4 standard | 98% | 4.0 | 39% | 43% |
| 3: 1 elite, 2 standard | 100% | 3.8 | 31% | 37% |
| 4: 2 elite, 2 standard | 59% | 6.3 | 71% | 90% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 319.9 | 252.6 |
| Damage a turn (its own turns) | 24.0 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.5 | 12.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 118.9 | 54.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.5 | 54.7 |
| Damage taken a round of combat | 4.9 | 3.3 |
| Times Down | 0.68 | 1.11 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.38 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.92 | 4.31 |
| Rally Points left | 2.70 | 2.29 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.4 | 0.0 |
| **Map:** AP spent moving | 6.5 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.7 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 43.3 |
| ... into melee (1 Bane) | 0.0 | 29.1 |
| ... with Cover | 0.0 | 19.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.98 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.75 |
| **Debuff:** Immobilized (times) | 0.00 | 2.24 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 59% · a PC Down during the day 98% · Downs a day 3.62 · Rally Points left at the end 30% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 25% | 14% |
| 2: 4 standard | 98% | 4.1 | 39% | 44% |
| 3: 1 elite, 2 standard | 99% | 3.9 | 35% | 42% |
| 4: 2 elite, 2 standard | 60% | 6.6 | 69% | 89% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 328.7 | 257.1 |
| Damage a turn (its own turns) | 23.9 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.0 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.9 | 12.3 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 126.1 | 55.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 87.3 | 55.9 |
| Damage taken a round of combat | 5.1 | 3.2 |
| Times Down | 0.67 | 1.14 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.66 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.12 | 4.40 |
| Rally Points left | 2.22 | 2.21 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 7.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 22.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.0 | 0.0 |
| **Map:** AP spent moving | 6.5 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 9.2 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 44.2 |
| ... into melee (1 Bane) | 0.0 | 29.9 |
| ... with Cover | 0.0 | 20.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.20 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.87 |
| **Debuff:** Immobilized (times) | 0.00 | 2.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 72% · a PC Down during the day 83% · Downs a day 2.42 · Rally Points left at the end 22% · Health at the end 52%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 8% | 5% |
| 2: 4 standard | 99% | 3.9 | 14% | 23% |
| 3: 1 elite, 2 standard | 100% | 3.8 | 12% | 23% |
| 4: 2 elite, 2 standard | 72% | 6.2 | 47% | 76% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 307.8 | 277.1 |
| Damage a turn (its own turns) | 22.1 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.6 | 22.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 14.0 | 12.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 124.5 | 59.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 88.2 | 59.6 |
| Damage taken a round of combat | 5.3 | 3.5 |
| Times Down | 0.46 | 0.75 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.97 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.44 | 3.79 |
| Rally Points used between fights | 0.86 | 1.60 |
| Rally Points left | 1.73 | 1.60 |
| **Buffs:** healed allies (Lay On Hands) | 50.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 24.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.2 | 0.0 |
| **Map:** AP spent moving | 6.8 | 4.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 9.0 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 47.3 |
| ... into melee (1 Bane) | 0.0 | 32.9 |
| ... with Cover | 0.0 | 21.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.83 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.28 |
| **Debuff:** Immobilized (times) | 0.00 | 2.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 62% · a PC Down during the day 91% · Downs a day 3.00 · Rally Points left at the end 28% · Health at the end 46%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 13% | 7% |
| 2: 4 standard | 99% | 3.9 | 25% | 30% |
| 3: 1 elite, 2 standard | 99% | 3.8 | 19% | 29% |
| 4: 2 elite, 2 standard | 63% | 6.2 | 60% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 328.8 | 296.8 | 262.9 |
| Damage a turn (its own turns) | 24.3 | 22.2 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.3 | 18.5 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.3 | 34.4 | - |
| Share of the party's damage (%) | 29 | 26 | 23 |
| Turns taken | 13.7 | 13.5 | 12.4 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 125.6 | 117.1 | 57.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 86.7 | 82.7 | 57.6 |
| Damage taken a round of combat | 5.2 | 5.0 | 3.5 |
| Times Down | 0.58 | 0.58 | 0.92 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.75 | 3.50 | 0.08 |
| Rally Points used through an ally's Lay On Hands | 2.94 | 0.00 | 2.25 |
| Rally Points used between fights | 2.10 | 2.15 | 2.80 |
| Rally Points left | 2.20 | 2.35 | 1.87 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 60.5 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 22.8 | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.9 | 34.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.1 | 0.1 | 0.0 |
| **Map:** AP spent moving | 6.6 | 6.8 | 4.1 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 6.8 | 0.0 |
| Turns that start Engaged | 8.8 | 8.5 | 4.1 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 45.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 31.0 |
| ... with Cover | 0.0 | 0.0 | 20.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.2 | 11.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 6.42 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.07 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.86 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 93% · Downs a day 2.85 · Rally Points left at the end 38% · Health at the end 64%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 22% | 10% |
| 2: 4 standard | 100% | 3.8 | 34% | 31% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 28% | 31% |
| 4: 2 elite, 2 standard | 73% | 6.3 | 63% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 327.0 | 273.8 |
| Damage a turn (its own turns) | 24.0 | 22.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.0 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.8 | 12.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.2 | 54.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.1 | 54.5 |
| Damage taken a round of combat | 4.9 | 3.3 |
| Times Down | 0.47 | 0.96 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.41 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 4.23 |
| Rally Points left | 3.68 | 2.38 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 22.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.5 | 0.0 |
| **Map:** AP spent moving | 6.7 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 8.9 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 44.1 |
| ... into melee (1 Bane) | 0.0 | 30.4 |
| ... with Cover | 0.0 | 20.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.70 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (times) | 0.00 | 2.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.90 |
| **Debuff:** Immobilized (times) | 0.00 | 0.52 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.85 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 88% · a PC Down during the day 73% · Downs a day 1.52 · Rally Points left at the end 28% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 7% | 1% |
| 2: 4 standard | 100% | 3.7 | 11% | 15% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 9% | 16% |
| 4: 2 elite, 2 standard | 88% | 6.0 | 33% | 64% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 309.2 | 299.4 |
| Damage a turn (its own turns) | 22.2 | 22.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.8 | 24.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.1 | 13.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 119.4 | 59.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.9 | 59.3 |
| Damage taken a round of combat | 5.2 | 3.6 |
| Times Down | 0.22 | 0.54 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.90 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.48 | 3.89 |
| Rally Points used between fights | 0.78 | 1.44 |
| Rally Points left | 2.84 | 1.66 |
| **Buffs:** healed allies (Lay On Hands) | 57.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.5 | 0.0 |
| **Map:** AP spent moving | 7.0 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 9.0 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 48.2 |
| ... into melee (1 Bane) | 0.0 | 34.4 |
| ... with Cover | 0.0 | 22.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.04 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (times) | 0.00 | 2.55 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.94 |
| **Debuff:** Immobilized (times) | 0.00 | 0.55 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.90 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 81% · Downs a day 1.66 · Rally Points left at the end 45% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 20% | 6% |
| 2: 4 standard | 100% | 3.7 | 32% | 29% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 22% | 20% |
| 4: 2 elite, 2 standard | 96% | 5.7 | 43% | 67% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 346.4 | 275.6 |
| Damage a turn (its own turns) | 25.9 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.1 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.3 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.4 | 12.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 103.7 | 49.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 7.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 64.8 | 49.6 |
| Damage taken a round of combat | 4.2 | 3.2 |
| Times Down | 0.16 | 0.67 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.74 | 0.27 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.53 | 4.73 |
| Rally Points left | 4.74 | 3.00 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 0.0 |
| Banes given (damage its areas stopped) | 3.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.9 | 0.0 |
| Guard given (damage it took instead of Health) | 31.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.9 | 0.0 |
| **Map:** AP spent moving | 6.8 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 8.4 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 43.8 |
| ... into melee (1 Bane) | 0.0 | 30.9 |
| ... with Cover | 0.0 | 20.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.79 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (times) | 0.00 | 2.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.96 |
| **Debuff:** Immobilized (times) | 0.00 | 0.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 44% · Downs a day 0.67 · Rally Points left at the end 40% · Health at the end 90%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 6% | 2% |
| 2: 4 standard | 100% | 3.7 | 9% | 10% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 5% | 7% |
| 4: 2 elite, 2 standard | 99% | 5.5 | 15% | 35% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 313.4 | 305.9 |
| Damage a turn (its own turns) | 23.1 | 23.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.1 | 24.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.7 | 13.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 108.9 | 57.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 7.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.0 | 0.0 |
| Damage taken | 70.4 | 57.4 |
| Damage taken a round of combat | 4.5 | 3.7 |
| Times Down | 0.06 | 0.27 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.19 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.04 | 4.19 |
| Rally Points used between fights | 0.51 | 1.21 |
| Rally Points left | 4.26 | 2.59 |
| **Buffs:** healed allies (Lay On Hands) | 56.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 25.4 | 0.0 |
| Banes given (damage its areas stopped) | 4.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.6 | 0.0 |
| Guard given (damage it took instead of Health) | 30.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.4 | 0.0 |
| **Map:** AP spent moving | 7.2 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 7.2 | 0.0 |
| Turns that start Engaged | 8.5 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 48.4 |
| ... into melee (1 Bane) | 0.0 | 35.0 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.05 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.10 |
| **Debuff:** Hindered (times) | 0.00 | 2.59 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.90 |
| **Debuff:** Immobilized (times) | 0.00 | 0.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 70% · a PC Down during the day 94% · Downs a day 2.96 · Rally Points left at the end 35% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 23% | 12% |
| 2: 4 standard | 99% | 3.6 | 35% | 36% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 29% | 32% |
| 4: 2 elite, 2 standard | 71% | 6.2 | 63% | 84% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 311.6 | 283.9 |
| Damage a turn (its own turns) | 23.9 | 23.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.7 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.2 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 108.3 | 49.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.2 | 49.9 |
| Damage taken a round of combat | 4.6 | 3.1 |
| Times Down | 0.53 | 0.95 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.25 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.22 |
| Rally Points left | 2.82 | 2.38 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.9 | 0.0 |
| **Map:** AP spent moving | 6.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.2 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 46.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.8 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 12.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.10 |
| **Debuff:** Immobilized (times) | 0.00 | 3.38 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.75 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 74% · a PC Down during the day 90% · Downs a day 2.73 · Rally Points left at the end 36% · Health at the end 64%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 23% | 11% |
| 2: 4 standard | 100% | 3.7 | 33% | 33% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 27% | 30% |
| 4: 2 elite, 2 standard | 74% | 6.2 | 61% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 320.6 | 298.0 |
| Damage a turn (its own turns) | 23.9 | 24.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.5 | 12.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 106.0 | 47.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.7 | 47.8 |
| Damage taken a round of combat | 4.4 | 2.9 |
| Times Down | 0.50 | 0.87 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.17 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.14 |
| Rally Points left | 2.89 | 2.45 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 7.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 8.3 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 36.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 13.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.75 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.34 |
| **Debuff:** Immobilized (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.96 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 84% · a PC Down during the day 89% · Downs a day 2.30 · Rally Points left at the end 40% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 9% |
| 2: 4 standard | 100% | 3.5 | 31% | 28% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 26% | 24% |
| 4: 2 elite, 2 standard | 84% | 6.1 | 57% | 77% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 315.0 | 297.9 |
| Damage a turn (its own turns) | 24.1 | 24.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.8 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.0 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.2 | 12.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 104.9 | 49.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.5 | 49.8 |
| Damage taken a round of combat | 4.6 | 3.1 |
| Times Down | 0.37 | 0.78 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.17 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.90 | 4.17 |
| Rally Points left | 3.92 | 2.43 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 23.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.7 | 0.0 |
| **Map:** AP spent moving | 6.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 8.1 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 44.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.86 |
| **Debuff:** Immobilized (times) | 0.00 | 2.48 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.83 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 85% · a PC Down during the day 84% · Downs a day 2.07 · Rally Points left at the end 41% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 21% | 9% |
| 2: 4 standard | 100% | 3.5 | 30% | 25% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 24% | 23% |
| 4: 2 elite, 2 standard | 85% | 6.2 | 54% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 323.9 | 308.6 |
| Damage a turn (its own turns) | 23.8 | 25.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.7 | 12.4 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 104.6 | 47.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.1 | 47.3 |
| Damage taken a round of combat | 4.4 | 2.9 |
| Times Down | 0.32 | 0.71 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.20 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.81 | 3.95 |
| Rally Points left | 3.99 | 2.64 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 21.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 33.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.7 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 8.4 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 33.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 14.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.01 |
| **Debuff:** Immobilized (times) | 0.00 | 2.57 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.99 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.82 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 68% · Downs a day 1.11 · Rally Points left at the end 51% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 19% | 5% |
| 2: 4 standard | 100% | 3.4 | 28% | 21% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 20% | 12% |
| 4: 2 elite, 2 standard | 99% | 5.1 | 35% | 51% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 325.1 | 308.0 |
| Damage a turn (its own turns) | 26.2 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.0 | 25.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.2 | 28.7 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.5 | 11.6 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 88.9 | 42.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 55.9 | 42.9 |
| Damage taken a round of combat | 3.9 | 3.0 |
| Times Down | 0.10 | 0.46 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.57 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.24 | 4.25 |
| Rally Points left | 5.19 | 3.45 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 22.0 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 26.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.3 | 0.0 |
| **Map:** AP spent moving | 6.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 7.5 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 41.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 19.7 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.45 |
| **Debuff:** Immobilized (times) | 0.00 | 2.32 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 66% · Downs a day 1.05 · Rally Points left at the end 52% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 20% | 6% |
| 2: 4 standard | 100% | 3.4 | 28% | 19% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 20% | 15% |
| 4: 2 elite, 2 standard | 99% | 5.0 | 33% | 48% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 328.9 | 323.8 |
| Damage a turn (its own turns) | 25.9 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.8 | 25.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.0 | 29.7 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 12.8 | 11.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 87.9 | 41.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.4 | 0.0 |
| Damage taken | 55.1 | 41.3 |
| Damage taken a round of combat | 3.8 | 2.8 |
| Times Down | 0.10 | 0.43 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.52 | 0.30 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.23 | 4.07 |
| Rally Points left | 5.25 | 3.64 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.5 |
| Divine Surge given (extra damage dealt by allies) | 20.4 | 0.0 |
| Banes given (damage its areas stopped) | 3.2 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 26.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.1 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 7.6 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 30.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 13.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.62 |
| **Debuff:** Immobilized (times) | 0.00 | 2.40 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.98 |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 30% · a PC Down during the day 100% · Downs a day 4.80 · Rally Points left at the end 38% · Health at the end 21%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 41% | 31% |
| 2: 6 standard | 63% | 6.0 | 68% | 87% |
| 3: 2 elite | 100% | 3.8 | 34% | 47% |
| 4: 1 elite, 4 standard | 47% | 5.9 | 72% | 93% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 307.4 | 218.7 |
| Damage a turn (its own turns) | 24.0 | 20.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.6 | 21.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.1 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.1 | 10.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 138.3 | 61.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 90.0 | 61.4 |
| Damage taken a round of combat | 6.0 | 4.0 |
| Times Down | 0.91 | 1.49 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.64 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.27 | 3.97 |
| Rally Points left | 3.09 | 2.66 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 20.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.4 | 0.0 |
| **Map:** AP spent moving | 4.5 | 4.6 |
| AP lost to moving (Actions dropped or made smaller) | 4.5 | 0.0 |
| Turns that start Engaged | 9.8 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 36.9 |
| ... into melee (1 Bane) | 0.0 | 23.7 |
| ... with Cover | 0.0 | 17.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 9.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.63 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.47 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.49 |
| **Debuff:** Immobilized (times) | 0.00 | 2.14 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.58 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 30% · a PC Down during the day 100% · Downs a day 4.90 · Rally Points left at the end 38% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.2 | 43% | 35% |
| 2: 6 standard | 60% | 6.3 | 69% | 88% |
| 3: 2 elite | 99% | 4.2 | 40% | 57% |
| 4: 1 elite, 4 standard | 50% | 6.2 | 70% | 92% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 305.2 | 213.5 |
| Damage a turn (its own turns) | 23.9 | 20.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 21.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.1 | 10.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 144.8 | 62.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 24.3 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.5 | 0.0 |
| Damage taken | 92.4 | 62.4 |
| Damage taken a round of combat | 6.0 | 4.1 |
| Times Down | 0.90 | 1.55 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.81 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.23 | 3.92 |
| Rally Points left | 2.97 | 2.71 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 6.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 28.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.7 | 0.0 |
| **Map:** AP spent moving | 4.3 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 0.0 |
| Turns that start Engaged | 9.9 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 36.0 |
| ... into melee (1 Bane) | 0.0 | 22.9 |
| ... with Cover | 0.0 | 17.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 9.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.51 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.42 |
| **Debuff:** Immobilized (times) | 0.00 | 2.09 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 33% · a PC Down during the day 96% · Downs a day 4.18 · Rally Points left at the end 20% · Health at the end 18%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 12% | 5% |
| 2: 6 standard | 81% | 5.9 | 39% | 65% |
| 3: 2 elite | 98% | 4.1 | 19% | 42% |
| 4: 1 elite, 4 standard | 41% | 5.5 | 60% | 93% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 318.9 | 261.9 |
| Damage a turn (its own turns) | 22.5 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.3 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.3 | 12.3 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 154.2 | 73.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 104.7 | 73.4 |
| Damage taken a round of combat | 6.2 | 4.4 |
| Times Down | 0.84 | 1.25 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.16 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.41 | 4.11 |
| Rally Points used between fights | 0.79 | 1.53 |
| Rally Points left | 1.63 | 1.35 |
| **Buffs:** healed allies (Lay On Hands) | 52.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 24.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 49.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.3 | 0.0 |
| **Map:** AP spent moving | 5.2 | 5.4 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 10.6 | 5.5 |
| Shots ([Ranged] Actions) | 0.0 | 44.1 |
| ... into melee (1 Bane) | 0.0 | 29.2 |
| ... with Cover | 0.0 | 20.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 9.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.78 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.61 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.22 |
| **Debuff:** Immobilized (times) | 0.00 | 2.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.65 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 35% · a PC Down during the day 98% · Downs a day 4.30 · Rally Points left at the end 28% · Health at the end 20%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 25% | 12% |
| 2: 6 standard | 72% | 5.9 | 55% | 77% |
| 3: 2 elite | 99% | 3.9 | 23% | 43% |
| 4: 1 elite, 4 standard | 49% | 5.8 | 61% | 91% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 324.7 | 302.8 | 242.5 |
| Damage a turn (its own turns) | 24.2 | 22.7 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 19.5 | 22.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - | - |
| Share of the party's damage (%) | 29 | 27 | 22 |
| Turns taken | 13.6 | 13.6 | 11.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 147.5 | 143.2 | 66.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 97.5 | 96.1 | 66.4 |
| Damage taken a round of combat | 6.2 | 6.1 | 4.2 |
| Times Down | 0.85 | 0.86 | 1.30 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.90 | 3.79 | 0.08 |
| Rally Points used through an ally's Lay On Hands | 2.81 | 0.00 | 2.27 |
| Rally Points used between fights | 1.94 | 1.96 | 2.80 |
| Rally Points left | 2.35 | 2.25 | 1.85 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 59.6 | 0.0 |
| Defense given (damage it stopped) | 7.8 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 23.0 | 21.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 49.9 | 47.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.2 | 0.1 | 0.0 |
| **Map:** AP spent moving | 5.0 | 4.9 | 5.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 4.9 | 0.0 |
| Turns that start Engaged | 10.0 | 10.1 | 5.1 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 41.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 26.9 |
| ... with Cover | 0.0 | 0.0 | 19.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 10.1 | 8.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 6.29 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.53 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.91 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.60 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 52% · a PC Down during the day 98% · Downs a day 3.97 · Rally Points left at the end 37% · Health at the end 41%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 37% | 23% |
| 2: 6 standard | 73% | 6.1 | 62% | 79% |
| 3: 2 elite | 100% | 3.7 | 31% | 41% |
| 4: 1 elite, 4 standard | 71% | 6.2 | 62% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 329.5 | 258.0 |
| Damage a turn (its own turns) | 23.7 | 21.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 23.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.1 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 143.6 | 64.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 93.6 | 64.7 |
| Damage taken a round of combat | 5.8 | 4.0 |
| Times Down | 0.67 | 1.31 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.77 | 0.43 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.63 | 4.22 |
| Rally Points left | 3.60 | 2.35 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 22.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 50.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.1 | 0.0 |
| **Map:** AP spent moving | 5.1 | 4.8 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 10.4 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 40.9 |
| ... into melee (1 Bane) | 0.0 | 27.1 |
| ... with Cover | 0.0 | 19.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 10.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.22 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.57 |
| **Debuff:** Hindered (times) | 0.00 | 2.32 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.59 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.62 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 64% · a PC Down during the day 87% · Downs a day 2.94 · Rally Points left at the end 20% · Health at the end 42%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 9% | 2% |
| 2: 6 standard | 90% | 5.7 | 28% | 50% |
| 3: 2 elite | 100% | 3.8 | 13% | 28% |
| 4: 1 elite, 4 standard | 71% | 6.2 | 45% | 79% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 346.0 | 311.7 |
| Damage a turn (its own turns) | 22.3 | 22.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.2 | 24.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 15.7 | 13.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 161.1 | 76.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 108.7 | 76.6 |
| Damage taken a round of combat | 6.0 | 4.2 |
| Times Down | 0.50 | 0.97 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.44 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.76 | 4.50 |
| Rally Points used between fights | 0.77 | 1.39 |
| Rally Points left | 2.03 | 1.09 |
| **Buffs:** healed allies (Lay On Hands) | 65.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 27.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 52.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.0 | 0.0 |
| **Map:** AP spent moving | 6.0 | 5.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 11.4 | 5.9 |
| Shots ([Ranged] Actions) | 0.0 | 49.0 |
| ... into melee (1 Bane) | 0.0 | 33.8 |
| ... with Cover | 0.0 | 23.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 11.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.86 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.71 |
| **Debuff:** Hindered (times) | 0.00 | 2.84 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.65 |
| **Debuff:** Immobilized (times) | 0.00 | 0.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.66 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 91% · a PC Down during the day 93% · Downs a day 2.61 · Rally Points left at the end 33% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 36% | 19% |
| 2: 6 standard | 96% | 5.7 | 43% | 66% |
| 3: 2 elite | 100% | 3.3 | 25% | 27% |
| 4: 1 elite, 4 standard | 95% | 5.6 | 47% | 68% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 412.7 | 300.6 |
| Damage a turn (its own turns) | 26.1 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.8 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 15.9 | 13.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 142.7 | 68.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.4 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.8 | 0.0 |
| Damage taken | 79.5 | 68.0 |
| Damage taken a round of combat | 4.4 | 3.8 |
| Times Down | 0.22 | 1.08 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.07 | 0.42 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.02 | 5.91 |
| Rally Points left | 3.91 | 1.67 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 26.8 | 0.0 |
| Banes given (damage its areas stopped) | 2.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 7.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.8 | 0.0 |
| **Map:** AP spent moving | 6.4 | 5.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 11.2 | 5.4 |
| Shots ([Ranged] Actions) | 0.0 | 46.7 |
| ... into melee (1 Bane) | 0.0 | 31.9 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 12.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.64 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.77 |
| **Debuff:** Hindered (times) | 0.00 | 2.55 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.69 |
| **Debuff:** Immobilized (times) | 0.00 | 0.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.71 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 63% · Downs a day 1.16 · Rally Points left at the end 29% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 8% | 2% |
| 2: 6 standard | 98% | 5.2 | 11% | 26% |
| 3: 2 elite | 100% | 3.5 | 8% | 13% |
| 4: 1 elite, 4 standard | 98% | 5.4 | 20% | 49% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 379.9 | 343.8 |
| Damage a turn (its own turns) | 23.9 | 23.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.4 | 24.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 16.0 | 14.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 145.8 | 78.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 13.7 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.8 | 0.0 |
| Damage taken | 85.6 | 78.2 |
| Damage taken a round of combat | 4.8 | 4.4 |
| Times Down | 0.09 | 0.49 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.60 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.46 | 5.38 |
| Rally Points used between fights | 0.44 | 1.26 |
| Rally Points left | 3.50 | 1.35 |
| **Buffs:** healed allies (Lay On Hands) | 70.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 29.8 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.9 | 0.0 |
| Guard given (damage it took instead of Health) | 46.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 25.1 | 0.0 |
| **Map:** AP spent moving | 6.8 | 6.3 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 11.1 | 6.4 |
| Shots ([Ranged] Actions) | 0.0 | 53.1 |
| ... into melee (1 Bane) | 0.0 | 37.1 |
| ... with Cover | 0.0 | 25.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 12.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.16 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.84 |
| **Debuff:** Hindered (times) | 0.00 | 3.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.67 |
| **Debuff:** Immobilized (times) | 0.00 | 0.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.72 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 50% · a PC Down during the day 98% · Downs a day 4.15 · Rally Points left at the end 34% · Health at the end 37%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 38% | 24% |
| 2: 6 standard | 73% | 5.9 | 63% | 83% |
| 3: 2 elite | 100% | 3.6 | 30% | 37% |
| 4: 1 elite, 4 standard | 69% | 6.1 | 65% | 86% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 317.9 | 263.2 |
| Damage a turn (its own turns) | 23.9 | 23.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.7 | 23.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.5 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.5 | 11.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 132.0 | 59.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.8 | 59.5 |
| Damage taken a round of combat | 5.5 | 3.8 |
| Times Down | 0.76 | 1.32 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.49 | 0.44 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.64 | 4.27 |
| Rally Points left | 2.87 | 2.29 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 47.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.1 | 0.0 |
| **Map:** AP spent moving | 5.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 9.7 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 43.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 10.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.66 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.67 |
| **Debuff:** Immobilized (times) | 0.00 | 3.01 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.98 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 54% · a PC Down during the day 98% · Downs a day 3.99 · Rally Points left at the end 33% · Health at the end 40%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 38% | 25% |
| 2: 6 standard | 77% | 6.1 | 61% | 81% |
| 3: 2 elite | 100% | 3.6 | 28% | 31% |
| 4: 1 elite, 4 standard | 70% | 6.3 | 62% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 332.4 | 284.0 |
| Damage a turn (its own turns) | 23.6 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.3 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 132.3 | 58.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.3 | 58.9 |
| Damage taken a round of combat | 5.1 | 3.5 |
| Times Down | 0.71 | 1.28 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.51 | 0.50 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.75 | 4.27 |
| Rally Points left | 2.73 | 2.24 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 23.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.3 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 10.2 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 34.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.99 |
| **Debuff:** Immobilized (times) | 0.00 | 3.20 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.21 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 97% · Downs a day 3.39 · Rally Points left at the end 34% · Health at the end 55%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 35% | 19% |
| 2: 6 standard | 82% | 5.9 | 57% | 74% |
| 3: 2 elite | 100% | 3.4 | 26% | 26% |
| 4: 1 elite, 4 standard | 82% | 6.1 | 57% | 78% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 338.4 | 294.9 |
| Damage a turn (its own turns) | 23.7 | 24.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.5 | 12.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 135.9 | 62.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 87.6 | 62.6 |
| Damage taken a round of combat | 5.3 | 3.8 |
| Times Down | 0.55 | 1.14 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.57 | 0.50 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.93 | 4.49 |
| Rally Points left | 3.49 | 2.02 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 26.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 10.3 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 45.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 1.3 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.01 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.11 |
| **Debuff:** Immobilized (times) | 0.00 | 2.62 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.29 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 95% · Downs a day 3.14 · Rally Points left at the end 34% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 35% | 18% |
| 2: 6 standard | 85% | 6.1 | 54% | 72% |
| 3: 2 elite | 100% | 3.5 | 26% | 24% |
| 4: 1 elite, 4 standard | 86% | 6.3 | 54% | 74% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 353.9 | 310.0 |
| Damage a turn (its own turns) | 23.6 | 24.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 15.2 | 12.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 134.8 | 61.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.4 | 61.7 |
| Damage taken a round of combat | 4.9 | 3.5 |
| Times Down | 0.47 | 1.10 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.58 | 0.52 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.98 | 4.55 |
| Rally Points left | 3.44 | 1.92 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 25.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 49.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.6 | 0.0 |
| **Map:** AP spent moving | 6.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 10.8 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 34.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.58 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.33 |
| **Debuff:** Immobilized (times) | 0.00 | 2.78 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.47 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 95% · a PC Down during the day 86% · Downs a day 1.91 · Rally Points left at the end 39% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 33% | 14% |
| 2: 6 standard | 98% | 5.1 | 37% | 55% |
| 3: 2 elite | 100% | 3.0 | 21% | 15% |
| 4: 1 elite, 4 standard | 98% | 5.2 | 41% | 56% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 387.8 | 339.2 |
| Damage a turn (its own turns) | 26.5 | 26.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 25.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.5 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.7 | 12.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 123.6 | 58.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 69.8 | 58.7 |
| Damage taken a round of combat | 4.2 | 3.5 |
| Times Down | 0.17 | 0.79 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.84 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.73 | 5.41 |
| Rally Points left | 4.43 | 2.19 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 27.4 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.6 | 0.0 |
| Guard given (damage it took instead of Health) | 41.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.9 | 0.0 |
| **Map:** AP spent moving | 6.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.2 | 0.0 |
| Turns that start Engaged | 10.0 | 5.0 |
| Shots ([Ranged] Actions) | 0.0 | 46.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 23.1 |
| ... while Engaged (2 Banes) | 0.0 | 1.5 |
| Flanking Boons on its melee Actions | 12.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 2.74 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.30 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 82% · Downs a day 1.68 · Rally Points left at the end 41% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 32% | 12% |
| 2: 6 standard | 99% | 5.1 | 35% | 53% |
| 3: 2 elite | 100% | 3.1 | 20% | 12% |
| 4: 1 elite, 4 standard | 98% | 5.1 | 38% | 52% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 391.4 | 360.0 |
| Damage a turn (its own turns) | 26.3 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 26.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 14.9 | 13.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.5 | 56.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.3 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.6 | 0.0 |
| Damage taken | 67.0 | 55.9 |
| Damage taken a round of combat | 4.0 | 3.3 |
| Times Down | 0.13 | 0.71 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.77 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.69 | 5.19 |
| Rally Points left | 4.54 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.6 |
| Divine Surge given (extra damage dealt by allies) | 27.0 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 41.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.7 | 0.0 |
| **Map:** AP spent moving | 6.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 10.0 | 5.0 |
| Shots ([Ranged] Actions) | 0.0 | 34.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.21 |
| **Debuff:** Immobilized (times) | 0.00 | 2.87 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.52 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

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

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 35% · a PC Down during the day 99% · Downs a day 4.27 · Rally Points left at the end 48% · Health at the end 29%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.8 | 38% | 35% |
| 2: 2 elite, 2 standard | 62% | 6.3 | 70% | 88% |
| 3: 6 standard | 57% | 5.9 | 70% | 86% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 244.0 | 183.2 |
| Damage a turn (its own turns) | 23.6 | 20.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 21.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 10.6 | 8.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 119.6 | 51.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.2 | 51.5 |
| Damage taken a round of combat | 6.2 | 3.9 |
| Times Down | 0.86 | 1.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.55 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.70 | 3.19 |
| Rally Points left | 3.75 | 3.47 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 16.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 39.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.0 | 0.0 |
| **Map:** AP spent moving | 4.0 | 3.3 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 7.6 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 31.0 |
| ... into melee (1 Bane) | 0.0 | 20.1 |
| ... with Cover | 0.0 | 14.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.54 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.82 |
| **Debuff:** Immobilized (times) | 0.00 | 1.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.55 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 41% · a PC Down during the day 99% · Downs a day 4.35 · Rally Points left at the end 42% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 4.0 | 41% | 39% |
| 2: 2 elite, 2 standard | 65% | 6.7 | 69% | 90% |
| 3: 6 standard | 64% | 6.5 | 70% | 89% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 261.9 | 185.5 |
| Damage a turn (its own turns) | 23.4 | 20.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.8 | 21.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 11.5 | 9.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 133.3 | 54.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 21.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 84.8 | 54.8 |
| Damage taken a round of combat | 6.0 | 3.9 |
| Times Down | 0.81 | 1.36 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.85 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.96 | 3.59 |
| Rally Points left | 3.19 | 3.05 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 6.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 27.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.7 | 0.0 |
| **Map:** AP spent moving | 3.9 | 3.5 |
| AP lost to moving (Actions dropped or made smaller) | 3.9 | 0.0 |
| Turns that start Engaged | 8.6 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 31.4 |
| ... into melee (1 Bane) | 0.0 | 20.1 |
| ... with Cover | 0.0 | 14.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.70 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.97 |
| **Debuff:** Immobilized (times) | 0.00 | 1.73 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 53% · a PC Down during the day 92% · Downs a day 3.32 · Rally Points left at the end 26% · Health at the end 35%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.8 | 14% | 17% |
| 2: 2 elite, 2 standard | 83% | 6.1 | 39% | 68% |
| 3: 6 standard | 63% | 5.8 | 52% | 80% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 264.2 | 224.4 |
| Damage a turn (its own turns) | 22.1 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 22.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.0 | 10.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 133.4 | 63.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 91.9 | 63.6 |
| Damage taken a round of combat | 6.4 | 4.4 |
| Times Down | 0.64 | 1.02 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.90 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.21 | 3.47 |
| Rally Points used between fights | 0.82 | 1.76 |
| Rally Points left | 2.08 | 1.75 |
| **Buffs:** healed allies (Lay On Hands) | 45.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 20.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.7 | 0.0 |
| **Map:** AP spent moving | 4.7 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 0.0 |
| Turns that start Engaged | 8.6 | 4.2 |
| Shots ([Ranged] Actions) | 0.0 | 37.7 |
| ... into melee (1 Bane) | 0.0 | 25.3 |
| ... with Cover | 0.0 | 16.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 9.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.70 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.37 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.56 |
| **Debuff:** Immobilized (times) | 0.00 | 2.13 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 45% · a PC Down during the day 97% · Downs a day 3.81 · Rally Points left at the end 34% · Health at the end 32%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.8 | 26% | 26% |
| 2: 2 elite, 2 standard | 75% | 6.2 | 54% | 77% |
| 3: 6 standard | 60% | 5.8 | 61% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 264.3 | 246.2 | 208.9 |
| Damage a turn (its own turns) | 23.4 | 22.0 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 18.9 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - | - |
| Share of the party's damage (%) | 28 | 26 | 23 |
| Turns taken | 11.4 | 11.3 | 9.8 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 131.1 | 125.0 | 58.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 88.6 | 86.1 | 58.5 |
| Damage taken a round of combat | 6.4 | 6.2 | 4.2 |
| Times Down | 0.75 | 0.78 | 1.14 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.97 | 3.45 | 0.10 |
| Rally Points used through an ally's Lay On Hands | 2.46 | 0.00 | 1.85 |
| Rally Points used between fights | 1.88 | 1.78 | 2.72 |
| Rally Points left | 2.70 | 2.78 | 2.33 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 50.2 | 0.0 |
| Defense given (damage it stopped) | 7.3 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 19.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 42.5 | 38.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.2 | 0.1 | 0.0 |
| **Map:** AP spent moving | 4.3 | 4.3 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 4.3 | 0.0 |
| Turns that start Engaged | 8.3 | 8.1 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 35.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 23.2 |
| ... with Cover | 0.0 | 0.0 | 16.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.0 | 8.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 5.33 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.37 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.96 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.55 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 54% · a PC Down during the day 97% · Downs a day 3.77 · Rally Points left at the end 45% · Health at the end 48%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.8 | 36% | 33% |
| 2: 2 elite, 2 standard | 74% | 6.4 | 63% | 84% |
| 3: 6 standard | 73% | 6.0 | 62% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 267.7 | 211.4 |
| Damage a turn (its own turns) | 23.3 | 22.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 23.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.7 | 9.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 126.7 | 56.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.5 | 56.1 |
| Damage taken a round of combat | 6.0 | 4.0 |
| Times Down | 0.68 | 1.21 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.69 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.06 | 3.66 |
| Rally Points left | 4.25 | 2.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 18.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 42.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.7 | 0.0 |
| **Map:** AP spent moving | 4.4 | 3.6 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 0.0 |
| Turns that start Engaged | 8.4 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 33.4 |
| ... into melee (1 Bane) | 0.0 | 22.1 |
| ... with Cover | 0.0 | 15.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.63 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.34 |
| **Debuff:** Hindered (times) | 0.00 | 1.82 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.51 |
| **Debuff:** Immobilized (times) | 0.00 | 0.29 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 77% · a PC Down during the day 82% · Downs a day 2.29 · Rally Points left at the end 27% · Health at the end 59%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.7 | 12% | 12% |
| 2: 2 elite, 2 standard | 91% | 5.8 | 29% | 56% |
| 3: 6 standard | 85% | 5.9 | 36% | 66% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 278.5 | 256.7 |
| Damage a turn (its own turns) | 22.1 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.2 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.7 | 11.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 132.4 | 66.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 91.1 | 66.7 |
| Damage taken a round of combat | 6.2 | 4.5 |
| Times Down | 0.35 | 0.79 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.95 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.45 | 3.87 |
| Rally Points used between fights | 0.75 | 1.66 |
| Rally Points left | 2.85 | 1.46 |
| **Buffs:** healed allies (Lay On Hands) | 57.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 22.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.1 | 0.0 |
| **Map:** AP spent moving | 5.1 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 9.0 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 40.3 |
| ... into melee (1 Bane) | 0.0 | 27.7 |
| ... with Cover | 0.0 | 18.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.12 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.41 |
| **Debuff:** Hindered (times) | 0.00 | 2.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.52 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 90% · a PC Down during the day 91% · Downs a day 2.37 · Rally Points left at the end 44% · Health at the end 84%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 33% | 24% |
| 2: 2 elite, 2 standard | 97% | 5.7 | 42% | 64% |
| 3: 6 standard | 93% | 5.6 | 49% | 66% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 324.2 | 240.8 |
| Damage a turn (its own turns) | 25.7 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 24.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.3 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 12.7 | 10.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 122.1 | 54.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.6 | 0.0 |
| Damage taken | 69.9 | 54.8 |
| Damage taken a round of combat | 4.8 | 3.7 |
| Times Down | 0.26 | 0.93 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.98 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.27 | 4.84 |
| Rally Points left | 4.75 | 2.81 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 20.7 | 0.0 |
| Banes given (damage its areas stopped) | 4.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.8 | 0.0 |
| Guard given (damage it took instead of Health) | 40.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.2 | 0.0 |
| **Map:** AP spent moving | 5.1 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 9.0 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 37.2 |
| ... into melee (1 Bane) | 0.0 | 25.8 |
| ... with Cover | 0.0 | 17.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 10.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.94 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.48 |
| **Debuff:** Hindered (times) | 0.00 | 2.03 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.56 |
| **Debuff:** Immobilized (times) | 0.00 | 0.35 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.63 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 54% · Downs a day 0.93 · Rally Points left at the end 39% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.7 | 10% | 7% |
| 2: 2 elite, 2 standard | 99% | 5.4 | 12% | 30% |
| 3: 6 standard | 98% | 5.1 | 17% | 35% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 296.0 | 279.4 |
| Damage a turn (its own turns) | 23.5 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.3 | 25.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.7 | 11.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 120.7 | 64.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.2 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.1 | 0.0 |
| Damage taken | 72.6 | 64.2 |
| Damage taken a round of combat | 5.1 | 4.5 |
| Times Down | 0.08 | 0.38 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.19 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.00 | 4.46 |
| Rally Points used between fights | 0.45 | 1.35 |
| Rally Points left | 4.37 | 2.18 |
| **Buffs:** healed allies (Lay On Hands) | 58.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 23.7 | 0.0 |
| Banes given (damage its areas stopped) | 4.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.7 | 0.0 |
| Guard given (damage it took instead of Health) | 36.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.7 | 0.0 |
| **Map:** AP spent moving | 5.4 | 4.7 |
| AP lost to moving (Actions dropped or made smaller) | 5.4 | 0.0 |
| Turns that start Engaged | 8.7 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 43.0 |
| ... into melee (1 Bane) | 0.0 | 30.4 |
| ... with Cover | 0.0 | 19.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 9.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.30 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.46 |
| **Debuff:** Hindered (times) | 0.00 | 2.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.57 |
| **Debuff:** Immobilized (times) | 0.00 | 0.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 52% · a PC Down during the day 98% · Downs a day 3.81 · Rally Points left at the end 43% · Health at the end 45%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 35% | 33% |
| 2: 2 elite, 2 standard | 73% | 6.2 | 64% | 82% |
| 3: 6 standard | 72% | 5.8 | 63% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 252.6 | 220.3 |
| Damage a turn (its own turns) | 23.5 | 23.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 23.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.9 | 9.3 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 114.8 | 50.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.3 | 50.6 |
| Damage taken a round of combat | 5.6 | 3.7 |
| Times Down | 0.75 | 1.15 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.46 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.08 | 3.60 |
| Rally Points left | 3.46 | 3.00 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.2 | 0.0 |
| Turns that start Engaged | 7.7 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 36.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.5 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 8.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.99 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.94 |
| **Debuff:** Immobilized (times) | 0.00 | 2.54 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.51 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 98% · Downs a day 3.67 · Rally Points left at the end 41% · Health at the end 50%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 34% | 28% |
| 2: 2 elite, 2 standard | 80% | 6.3 | 60% | 81% |
| 3: 6 standard | 72% | 6.1 | 63% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 268.0 | 235.6 |
| Damage a turn (its own turns) | 23.2 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.7 | 9.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 116.8 | 50.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.1 | 50.4 |
| Damage taken a round of combat | 5.3 | 3.5 |
| Times Down | 0.71 | 1.13 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.45 | 0.44 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.30 | 3.72 |
| Rally Points left | 3.25 | 2.84 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 18.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 8.1 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 28.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.56 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.18 |
| **Debuff:** Immobilized (times) | 0.00 | 2.67 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.70 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 70% · a PC Down during the day 96% · Downs a day 3.08 · Rally Points left at the end 43% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 32% | 24% |
| 2: 2 elite, 2 standard | 84% | 6.1 | 56% | 75% |
| 3: 6 standard | 83% | 5.9 | 56% | 75% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 275.4 | 239.2 |
| Damage a turn (its own turns) | 23.4 | 24.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.2 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.0 | 9.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 117.5 | 52.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.2 | 52.8 |
| Damage taken a round of combat | 5.5 | 3.7 |
| Times Down | 0.51 | 1.03 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.51 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.31 | 3.85 |
| Rally Points left | 4.19 | 2.69 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 20.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.1 | 0.0 |
| **Map:** AP spent moving | 4.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 0.0 |
| Turns that start Engaged | 8.3 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 36.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.6 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 10.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.33 |
| **Debuff:** Immobilized (times) | 0.00 | 2.07 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.68 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 95% · Downs a day 3.00 · Rally Points left at the end 43% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 30% | 23% |
| 2: 2 elite, 2 standard | 89% | 6.2 | 53% | 73% |
| 3: 6 standard | 82% | 6.1 | 56% | 75% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 286.1 | 252.1 |
| Damage a turn (its own turns) | 23.1 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.5 | 10.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.1 | 52.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.8 | 52.0 |
| Damage taken a round of combat | 5.2 | 3.5 |
| Times Down | 0.48 | 1.02 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.53 | 0.47 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.33 | 3.82 |
| Rally Points left | 4.14 | 2.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 19.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 5.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 8.7 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 27.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.48 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.51 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 82% · Downs a day 1.71 · Rally Points left at the end 49% · Health at the end 90%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 30% | 17% |
| 2: 2 elite, 2 standard | 99% | 5.0 | 36% | 50% |
| 3: 6 standard | 98% | 5.2 | 42% | 56% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 305.6 | 272.0 |
| Damage a turn (its own turns) | 25.8 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 25.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.1 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.9 | 10.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 102.4 | 48.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 58.9 | 48.7 |
| Damage taken a round of combat | 4.4 | 3.6 |
| Times Down | 0.15 | 0.70 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.76 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.96 | 4.55 |
| Rally Points left | 5.27 | 3.10 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 21.4 | 0.0 |
| Banes given (damage its areas stopped) | 3.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 33.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.3 | 0.0 |
| **Map:** AP spent moving | 5.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 7.9 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 36.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.6 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 10.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.77 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.31 |
| **Debuff:** Immobilized (times) | 0.00 | 2.21 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.26 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.74 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 77% · Downs a day 1.50 · Rally Points left at the end 51% · Health at the end 91%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 29% | 16% |
| 2: 2 elite, 2 standard | 99% | 5.0 | 34% | 46% |
| 3: 6 standard | 98% | 5.2 | 40% | 51% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 306.6 | 286.1 |
| Damage a turn (its own turns) | 25.7 | 27.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 26.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.1 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.0 | 10.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 98.6 | 46.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.7 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 56.0 | 46.6 |
| Damage taken a round of combat | 4.1 | 3.4 |
| Times Down | 0.13 | 0.61 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.66 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.92 | 4.37 |
| Rally Points left | 5.42 | 3.25 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 20.5 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.2 | 0.0 |
| Guard given (damage it took instead of Health) | 33.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.1 | 0.0 |
| **Map:** AP spent moving | 5.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.7 | 0.0 |
| Turns that start Engaged | 7.8 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 27.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 11.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.40 |
| **Debuff:** Immobilized (times) | 0.00 | 2.36 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.35 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.71 |
