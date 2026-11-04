# The playtest 2 rework: the numbers (pack R prep)

Written by `node book/ruler/rework.mjs` (the spec ruler with the map model; `spec.mjs RULES` moves the rules per run). Don't edit this file: edit the script and run it again. The proposal that reads it is `book/rework-r.md`.

Runs: 1000 fights a measurement, 300 a calibration step, 3000 pairs a price, 400 days. **The parties:** 2 P1 Smite Paladins + 2 A1 Archers (Double Shot; and Rolling Shot: each number is the mean of the two parties) at level 1, with the book's Health factor (Level + 17) / 16. **Today** = the book's rules (5 AP, Escalation spent, NPCs 5 AP) with the builds of `classes/`; **4 AP** = the rework (4 AP + 1 Reaction AP for PCs and NPCs, Escalation as a level) with the builds of `rework/` (the same cards, the turns cut to 4 AP, a Reaction each: the Paladin's Opportunity Attack, the Archer's Quick Draw as a stand-in for its Hallmark Reaction). Half the fights start with Momentum (1 Escalation); a Daily only in a hard fight. NPCs: the E3 Bestiary at level 1, Medium, exact averages; Elites have an Opportunity Attack.

## 1. The AP cut: a turn at 4 AP against 5

Damage a turn against one creature at Defense 13 (20,000 turns each; no map), with the Escalation the turn needs and at Escalation 3. **Today** spends Escalation (an Active turns the passive off); **level** keeps it (Escalation as a level: the passives stay on, an Active spends nothing). The plan's turn is in bold.

| Build | Turn | AP | Def 13 (its Esc) | Def 13, Esc 3 | Esc 3, Escalation as a level | Problems |
|---|---|---:|---:|---:|---:|---|
| Paladin (Smite) `classes/paladin-smite-1` | **Main** | 5 | 21.3 | 21.3 | 21.3 |  |
| Paladin (Smite) `classes/paladin-smite-1` | Main without Escalation | 5 | 21.3 | 21.3 | 21.3 |  |
| Paladin (Smite) `classes/paladin-smite-1` | Smite 2 and move | 5 | 21.3 | 21.3 | 21.3 |  |
| Paladin (Smite) `classes/paladin-smite-1` | **Nova** | 5 | 38.9 | 38.9 | 38.9 |  |
| Paladin (Smite) `classes/paladin-smite-1` | Three attacks | 3 | 14.4 | 14.4 | 14.4 |  |
| Paladin (Smite) `classes/paladin-smite-1` | **Steel** | 5 | 16.6 | 16.6 | 16.6 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | **Main** | 4 | 21.3 | 21.3 | 21.3 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | Smite 3 and one attack | 4 | 16.6 | 16.6 | 16.6 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | Main without Escalation | 4 | 21.3 | 21.3 | 21.3 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | **Nova** | 4 | 32.9 | 32.9 | 32.9 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | Nova with Smite | 4 | 29.5 | 29.5 | 29.5 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | Two attacks | 2 | 10.1 | 10.1 | 10.1 |  |
| Paladin (Smite) `rework/paladin-smite-r1` | **Steel** | 4 | 11.2 | 11.2 | 11.2 |  |
| Paladin (Lay On Hands) `classes/paladin-hands-1` | **Main** | 5 | 20.8 | 20.8 | 20.8 |  |
| Paladin (Lay On Hands) `classes/paladin-hands-1` | Main without Escalation | 5 | 20.8 | 20.8 | 20.8 |  |
| Paladin (Lay On Hands) `classes/paladin-hands-1` | Heal and move | 5 | 14.4 | 14.4 | 14.4 |  |
| Paladin (Lay On Hands) `classes/paladin-hands-1` | **Nova** | 5 | 36.7 | 36.7 | 36.7 |  |
| Paladin (Lay On Hands) `classes/paladin-hands-1` | Three attacks | 3 | 14.4 | 14.4 | 14.4 |  |
| Paladin (Lay On Hands) `rework/paladin-hands-r1` | **Main** | 4 | 16.7 | 16.7 | 16.7 |  |
| Paladin (Lay On Hands) `rework/paladin-hands-r1` | Main without Escalation | 4 | 16.7 | 16.7 | 16.7 |  |
| Paladin (Lay On Hands) `rework/paladin-hands-r1` | Heal 1 and three attacks | 4 | 14.4 | 14.4 | 14.4 |  |
| Paladin (Lay On Hands) `rework/paladin-hands-r1` | **Nova** | 4 | 27.2 | 27.2 | 27.2 |  |
| Paladin (Lay On Hands) `rework/paladin-hands-r1` | Two attacks | 2 | 10.1 | 10.1 | 10.1 |  |
| Archer (Double Shot) `classes/archer-double-1` | Main | 5 | 25.1 | 27.9 | 27.9 |  |
| Archer (Double Shot) `classes/archer-double-1` | **Pin** | 5 | 28.3 | 28.3 | 28.3 |  |
| Archer (Double Shot) `classes/archer-double-1` | **Kite** | 5 | 28.3 | 28.3 | 28.3 |  |
| Archer (Double Shot) `classes/archer-double-1` | **Steel** | 5 | 12.9 | 15.6 | 15.6 |  |
| Archer (Double Shot) `rework/archer-double-r1` | Main | 4 | 25.1 | 27.9 | 27.9 |  |
| Archer (Double Shot) `rework/archer-double-r1` | Main with the step | 4 | 19.2 | 21.8 | 21.8 |  |
| Archer (Double Shot) `rework/archer-double-r1` | **Pin** | 4 | 28.3 | 28.3 | 28.3 |  |
| Archer (Double Shot) `rework/archer-double-r1` | **Kite** | 4 | 19.2 | 21.8 | 21.8 |  |
| Archer (Double Shot) `rework/archer-double-r1` | **Steel** | 4 | 12.9 | 15.6 | 15.6 |  |
| Archer (Rolling Shot) `classes/archer-rolling-1` | Main | 5 | 24.6 | 27.2 | 27.2 |  |
| Archer (Rolling Shot) `classes/archer-rolling-1` | **Pin** | 5 | 27.2 | 27.2 | 27.2 |  |
| Archer (Rolling Shot) `classes/archer-rolling-1` | **Kite** | 5 | 27.2 | 27.2 | 27.2 |  |
| Archer (Rolling Shot) `classes/archer-rolling-1` | **Steel** | 5 | 11.9 | 14.6 | 14.6 |  |
| Archer (Rolling Shot) `rework/archer-rolling-r1` | Main | 4 | 21.8 | 24.6 | 24.6 |  |
| Archer (Rolling Shot) `rework/archer-rolling-r1` | Main with the long roll | 4 | 18.1 | 20.8 | 20.8 |  |
| Archer (Rolling Shot) `rework/archer-rolling-r1` | **Pin** | 4 | 24.6 | 24.6 | 24.6 |  |
| Archer (Rolling Shot) `rework/archer-rolling-r1` | **Kite** | 4 | 18.1 | 20.8 | 20.8 |  |
| Archer (Rolling Shot) `rework/archer-rolling-r1` | **Steel** | 4 | 9.1 | 11.9 | 11.9 |  |

**The cut** (the plan's main turn at its Escalation, Defense 13; the best 4 AP turn of the file against today's; a Nova = the turn with the Encounter Action):

| Class | Today's main turn | At 4 AP | 4 AP / today | Today's Nova | 4 AP Nova | Nova 4 AP / today |
|---|---|---|---:|---|---|---:|
| Paladin (Smite) | Main 21.3 | Main 21.3 | 100% | Nova 38.9 | Nova 32.9 | 85% |
| Paladin (Lay On Hands) | Main 20.8 | Main 16.7 | 80% | Nova 36.7 | Nova 27.2 | 74% |
| Archer (Double Shot) | Pin 28.3 | Pin 28.3 | 100% | - | - | - |
| Archer (Rolling Shot) | Pin 27.2 | Pin 24.6 | 90% | - | - | - |

The Bestiary's baseline PC turn is 23.3 at Defense 13 (5 AP: 1 AP = 4.66 DE, econ.mjs). At 4 AP the price of 1 AP is the 4 AP baseline turn / 4 (section 4).

## 2. The fights, rule by rule

The CV 4 encounters (4 PCs), rounds · the party's Health lost · a PC goes Down · the party wins. Each column adds one piece of the rework; the NPCs keep today's Health and damage until section 3.

| Encounter | Today | PCs 4 + 1 AP (NPCs 5 AP) | + NPCs 4 + 1 AP | + Escalation as a level | Escalation as a level, NPCs 5 AP |
|---|---|---|---|---|---|
| 4 Standards (4) | 3.5 r · 32% · Down 27% · won 100% | 3.5 r · 32% · Down 28% · won 99% | 3.5 r · 30% · Down 23% · won 100% | 3.5 r · 29% · Down 21% · won 100% | 3.5 r · 31% · Down 24% · won 100% |
| Elite + 2 Standards (4) | 3.6 r · 33% · Down 33% · won 100% | 3.7 r · 33% · Down 31% · won 100% | 3.7 r · 32% · Down 28% · won 100% | 3.6 r · 30% · Down 24% · won 100% | 3.7 r · 32% · Down 29% · won 100% |
| 2 Elites (4) | 3.7 r · 35% · Down 38% · won 100% | 3.8 r · 37% · Down 38% · won 99% | 3.8 r · 36% · Down 37% · won 100% | 3.7 r · 32% · Down 30% · won 100% | 3.7 r · 34% · Down 34% · won 100% |
| 8 Grunts (4) | 3.8 r · 36% · Down 26% · won 100% | 3.6 r · 34% · Down 20% · won 100% | 3.5 r · 32% · Down 14% · won 100% | 3.5 r · 30% · Down 14% · won 100% | 3.5 r · 32% · Down 18% · won 100% |
| 2 Standards + 8 Minions (4) | 4.1 r · 33% · Down 30% · won 100% | 3.5 r · 27% · Down 19% · won 100% | 3.5 r · 25% · Down 16% · won 100% | 3.5 r · 23% · Down 14% · won 100% | 3.5 r · 25% · Down 17% · won 100% |

What the party deals and takes in the 4 Standards fight (per fight, all 4 PCs; Reactions = the Reactions made, with the damage they dealt):

| | Today | PCs 4 + 1 AP (NPCs 5 AP) | + NPCs 4 + 1 AP | + Escalation as a level | Escalation as a level, NPCs 5 AP |
|---|---:|---:|---:|---:|---:|
| Damage dealt a fight (the party) | 294.0 | 288.1 | 288.3 | 289.7 | 289.1 |
| Damage dealt a PC turn | 24.5 | 24.0 | 24.1 | 24.2 | 24.3 |
| PC turns a fight | 12.0 | 12.0 | 12.0 | 12.0 | 11.9 |
| Reactions made a fight (damage) | 0.00 (0.0) | 4.52 (25.0) | 4.24 (23.7) | 4.07 (23.0) | 4.58 (25.8) |
| PC turns at Escalation 0 / 1 / 2 / 3 | 0.5 / 2.0 / 0.5 / 0.0 | 0.5 / 1.9 / 0.5 / 0.1 | 0.5 / 1.9 / 0.5 / 0.1 | 0.5 / 1.0 / 0.9 / 0.6 | 0.5 / 1.0 / 0.9 / 0.6 |
| Divine Surge: allies' extra damage a fight (Guard used) | 10.8 (11.9) | 10.9 (13.7) | 11.1 (13.4) | 11.2 (12.9) | 11.1 (12.4) |
| Hallowed Stance: damage reduced a fight | 0.0 | 0.0 | 0.0 | 4.5 | 4.2 |
| Font of Mercy: extra healing a fight | 1.7 | 2.1 | 1.9 | 1.9 | 2.1 |

## 3. Health about -20%: the factors

For 4 Standards against the 4 AP party (Escalation as a level): the NPC Health factor **h** for which the fight lasts 3.5 rounds, then the PC Health factor **p** for which it costs the party 33% of its Health (bisection, alternating twice; NPC damage stays). Once with NPCs at 4 + 1 AP (the rework) and once with NPCs at 5 AP.

| NPCs | NPC Health × h | PC Health × p | 4 Standards at these factors |
|---|---:|---:|---|
| 4 + 1 AP (the rework) | 0.99 | 0.81 | 3.6 r · 34% · Down 34% · won 99% |
| 5 AP | 0.98 | 0.89 | 3.5 r · 32% · Down 29% · won 100% |

A Standard today: 63 Health (Body 35 + Mind 28); the P1 Paladin 40, the A1 Archer 27. With the factors: a Standard 62, the Paladin 33, the Archer 22.

**Fights by CV at the rework's factors** (NPCs 4 + 1 AP, NPC Health × h, PC Health × p; the Bestiary's targets: easy 2.5 rounds / 20%, normal 3.5 / a third, hard 4.5-5 / half, deadly 6 / half to three quarters):

| Encounter | Today (the book) | The rework at its factors |
|---|---|---|
| 3 Standards (CV 3, easy) | 2.6 r · 20% · Down 8% · won 100% | 2.7 r · 22% · Down 13% · won 100% |
| 4 Standards (4) | 3.5 r · 32% · Down 27% · won 100% | 3.6 r · 34% · Down 34% · won 99% |
| Elite + 2 Standards (4) | 3.6 r · 33% · Down 33% · won 100% | 3.7 r · 34% · Down 39% · won 100% |
| 2 Elites (4) | 3.7 r · 35% · Down 38% · won 100% | 3.9 r · 38% · Down 45% · won 98% |
| 8 Grunts (4) | 3.8 r · 36% · Down 26% · won 100% | 3.6 r · 35% · Down 27% · won 100% |
| 2 Standards + 8 Minions (4) | 4.1 r · 33% · Down 30% · won 100% | 3.5 r · 27% · Down 23% · won 100% |
| 5 Standards (5, hard) | 4.9 r · 48% · Down 56% · won 96% | 4.8 r · 52% · Down 63% · won 88% |
| 6 Standards (6, deadly) | 6.0 r · 70% · Down 81% · won 72% | 5.5 r · 72% · Down 84% · won 62% |
| 2 Elites + 2 Standards (6, deadly) | 6.3 r · 72% · Down 85% · won 69% | 5.9 r · 74% · Down 86% · won 58% |

## 4. Escalation as a level

**Timing** (the 4 Standards fight at the rework's factors; half the fights start with Momentum, 1 Escalation at level 1):

| | Escalation 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| PC turns a fight at this level | 0.50 | 0.96 | 0.86 | 0.63 |
| Share of the PC turns at this level or more | 100% | 83% | 51% | 22% |

| Per PC | all fights | with Momentum (starts at 1) | without |
|---|---:|---:|---:|
| Fights with a turn at Escalation 1 or more · such turns a fight | 96% · 2.45 | 99% · 2.92 | 92% · 1.99 |
| Fights with a turn at Escalation 2 or more · such turns a fight | 86% · 1.49 | 95% · 1.92 | 76% · 1.06 |
| Fights with a turn at Escalation 3 or more · such turns a fight | 51% · 0.63 | 77% · 0.97 | 25% · 0.30 |

So an **Encounter ability that needs Escalation 3** is used in about 51% of the fights (77% with Momentum, 25% without); a Round ability that needs Escalation 2 fires 1.49 times a fight, one that needs Escalation 1 2.45 times.

**What each Passive is worth** (the 4 AP main turn at Escalation 3, Defense 13: with and without the Passive; the defensive ones from the 4 Standards fight at the rework's factors, per fight for the PC that has it):

| Passive (today's level) | Build | Worth | How |
|---|---|---:|---|
| Killer's Focus (2+) | Archer | +2.7 a turn (11%) | +1d6 on the first [Shot] Strike a round |
| Marked Quarry (a Feature; both parts) | Archer | +4.0 a turn (17%) | 1 Boon on [Shot] Strikes against it and [Mod] on a Tier 1 |
| Radiant Zeal (1+) | Paladin | +3.5 a turn (16%) | +1d6 Holy on the first Strike a round |
| Hallowed Stance (2+) | Paladin | 2.3 damage a fight per Paladin (0.8 a turn) | Body damage reduced by [PMod] for it and adjacent allies, while it hasn't left its square |
| Font of Mercy (1+, a Feature) | Paladin | 1.2 Health a fight per Paladin | +[PMod] + 2 on every Rally Point used within 5 squares |
| Elusive (1+) | Archer | 0.7 damage a fight per Archer (0.61 Strikes a fight take its Bane) | 1 Bane on the first Strike against it each round (a run with Elusive added, the same dice) |
| Divine Surge (an Active, 1, Round, 0 AP) | Paladin | 5.4 allies' damage + 6.4 Guard used a fight per Paladin | as a level: used every round from Escalation 1 (today: spent, so it turns Hallowed Stance off) |

**The Archer's Actives when Escalation is a level** (the 4 Standards fight at the rework's factors; the Archer's damage a fight and the conditions it puts on):

| The Archer's plan | Damage a fight | Immobilized a fight | Notes |
|---|---:|---:|---|
| Pinning Shot from Escalation 2, every round (Round; today's card as a level) | 73.5 | 0.76 | 25.3 a turn |
| Twin Shot from Escalation 3, every round (Round; today's card as a level) | 73.7 | 0.00 | 25.6 a turn |
| Twin Shot at Escalation 3 once a fight (Encounter) | 73.3 | 0.00 | 25.5 a turn |
| Neither (a Weapon Attack instead) | 73.4 | 0.00 | 25.4 a turn |

## 5. The Reaction AP

The 4 Standards fight at the rework's factors, three ways: no Reactions; the Paladins with Opportunity Attack and the Archers with Quick Draw (a Weapon Attack when an enemy within 5 squares moves closer: a stand-in for the Archer's Hallmark Reaction); the Paladins with Shield of Faith as a 1R block (1d8 + [PMod] off one hit on them or an ally within 5 squares, once per NPC turn) and the Archers with Quick Draw. Per fight.

| Reactions | rounds · lost · Down · won | Paladin: Reactions a fight (damage) | Archer: Reactions a fight (damage) | Shield of Faith: damage blocked a fight (both Paladins) | Party damage a fight | Party damage taken a fight | Worth against none (DE a fight · a PC turn) |
|---|---|---|---|---:|---:|---:|---:|
| None | 4.1 r · 39% · Down 45% · won 98% | 0.00 (0.0) | 0.00 (0.0) | 0.0 | 283.2 | 53.5 | 0.0 · 0.00 |
| Opportunity Attack + Quick Draw | 3.6 r · 34% · Down 34% · won 99% | 0.90 (4.9) | 1.26 (7.3) | 0.0 | 284.1 | 47.1 | 7.4 · 0.63 |
| Shield of Faith (block) + Quick Draw | 3.5 r · 22% · Down 20% · won 100% | 2.33 (0.0) | 1.39 (8.1) | 25.6 | 285.2 | 28.4 | 27.1 · 2.24 |

For scale: 1 AP at 4 AP is worth 5.8 DE (the baseline turn 23.3 × the AP cut of section 1 / 4) and a Weapon Attack about 5.4; a Reaction AP is worth what its Reaction does times how often it fires.

## 6. Overcast as the caster's Passive ladder (LV's stand-ins)

Pack LV's weapon user and caster (progression.mjs: the same budget, [W] dice against Power dice; model A: Modifier +2 / +3 / +4 by tier, Mastery 2[W] and keep the best at level 8), with 4 AP turns and Escalation as a level: the weapon user's Surge (+1d8 on its next Strike) works every round from Escalation 1 and Killer (+1d6 on the first Strike) from 2; the caster's first Bolt each round is **Overcast up to its Escalation level**, capped by the tier's limit (1 / 2 / 3). Damage a round against one target at Defense 13, half the fights with Momentum (1 / 2 / 3 Escalation at levels 1-4 / 5-7 / 8-10); **fight** = rounds 1-3 + half of round 4. Today's check (Overcast paid with Escalation, the round-1 floor): progression.md section 5.

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user (Surge from 1, Killer from 2) | 35.3 | 27.7 | 29.4 | 29.5 | 107.1 | |
| 1 | caster, Overcast up to the tier's limit | 33.1 | 25.9 | 25.9 | 25.9 | 97.9 | 94% · 91% |
| 1 | caster, Overcast up to 3 (no tier limit) | 33.1 | 28.2 | 32.8 | 35.0 | 111.6 | 94% · 104% |
| 1 | caster, no Overcast | 33.2 | 21.4 | 21.6 | 21.2 | 86.8 | 94% · 81% |
| 5 | weapon user (Surge from 1, Killer from 2) | 40.7 | 31.8 | 33.6 | 33.5 | 122.9 | |
| 5 | caster, Overcast up to the tier's limit | 36.7 | 32.2 | 34.4 | 34.5 | 120.6 | 90% · 98% |
| 5 | caster, Overcast up to 3 (no tier limit) | 36.8 | 34.5 | 36.7 | 39.0 | 127.5 | 91% · 104% |
| 5 | caster, no Overcast | 36.5 | 25.4 | 25.5 | 25.5 | 100.2 | 90% · 82% |
| 8 | weapon user (Surge from 1, Killer from 2) | 53.7 | 49.6 | 51.4 | 51.4 | 180.4 | |
| 8 | caster, Overcast up to the tier's limit | 44.3 | 43.0 | 45.4 | 47.9 | 156.7 | 82% · 87% |
| 8 | caster, no Overcast | 44.4 | 33.7 | 33.7 | 33.7 | 128.7 | 83% · 71% |

The weapon user's Surge as a level (every round from Escalation 1) is the comparison the rework implies: the Paladin's Divine Surge works the same way. Overcast capped by tier keeps the caster within a few percent of the weapon user; a caster whose Overcast reaches 3 at level 1 is ahead (the tier cap stays).

## 7. Bloodied and Strained as hooks

**The thresholds** (level 1, the book's Health factor; the Bestiary's Medium NPCs with Body High; a PC's Body and Mind thresholds from its class multipliers and species):

| Creature | Body threshold (Bloodied) | Mind threshold (Strained) | Health Pool | Bloodied at | Strained at |
|---|---:|---:|---:|---:|---:|
| Human Paladin (Body 2, Mind 1) | 22 | 18 | 40 | 55% of its Health in Body damage | 45% in Mind damage |
| Dwarf Paladin (Body 2, Mind 2) | 24 | 22 | 46 | 52% of its Health in Body damage | 48% in Mind damage |
| Elf Paladin (Body 1, Mind 2) | 15 | 24 | 39 | 38% of its Health in Body damage | 62% in Mind damage |
| Human Archer (Body 1, Mind 1) | 14 | 13 | 27 | 52% of its Health in Body damage | 48% in Mind damage |
| Dwarf Archer (Body 1, Mind 1) | 16 | 12 | 28 | 57% of its Health in Body damage | 43% in Mind damage |
| Elf Archer (Body -1, Mind 2) | 5 | 17 | 22 | 23% of its Health in Body damage | 77% in Mind damage |
| Minion (Medium, Body High) | 4 | 3 | 7 | 57% | 43% |
| Grunt (Medium, Body High) | 16 | 12 | 28 | 57% | 43% |
| Standard (Medium, Body High) | 35 | 28 | 63 | 56% | 44% |
| Elite (Medium, Body High) | 73 | 59 | 132 | 55% | 45% |

**In the fights** (the rework at its factors; the party's damage by pool: arrows and [W] dice are Body, Holy dice are Mind; an NPC's Basic attack is Body): how often an NPC is Bloodied or Strained before it dies, and in which round; how often a PC is Bloodied by the end of round 1, 2 and 3, and the share of its turns taken while Bloodied.

| Encounter | NPC role | Bloodied before dying (mean round) | Strained before dying (mean round) | Both | Bloodied first, of those with both | Dies (mean round) |
|---|---|---|---|---:|---:|---:|
| 4 Standards (4) | standard | 93% (2.3) | 19% (1.4) | 12% | 3% | 2.5 |
| Elite + 2 Standards (4) | standard | 92% (1.7) | 25% (1.2) | 17% | 2% | 1.8 |
| Elite + 2 Standards (4) | elite | 99% (3.2) | 5% (2.5) | 3% | 3% | 3.7 |
| 2 Elites (4) | elite | 98% (2.8) | 7% (2.1) | 5% | 3% | 3.2 |
| 8 Grunts (4) | grunt | 91% (2.2) | 31% (1.6) | 22% | 3% | 2.2 |

| Encounter | PC | Bloodied by the end of round 1 / 2 / 3 | Turns taken while Bloodied (of its turns) | Down a fight | Mind share of its damage |
|---|---|---|---:|---:|---:|
| 4 Standards (4) | Paladin | 19% / 34% / 38% | 16% | 0.11 | 45% |
| 4 Standards (4) | Archer | 14% / 26% / 31% | 14% | 0.12 | 7% |
| Elite + 2 Standards (4) | Paladin | 20% / 35% / 43% | 17% | 0.13 | 46% |
| Elite + 2 Standards (4) | Archer | 12% / 22% / 26% | 11% | 0.11 | 8% |
| 2 Elites (4) | Paladin | 21% / 44% / 52% | 21% | 0.19 | 46% |
| 2 Elites (4) | Archer | 13% / 22% / 27% | 12% | 0.13 | 9% |

Today's rule (a Bane on every [Weapon] Action while Bloodied, on every [Power] Action while Strained) is not in the simulation. With the thresholds above, the Elf Archer is Bloodied by the first hit and the Paladin at about half its Health. NPCs: the Paladins' Holy dice are about half of a Smite's damage (their Mind share above), the Archers deal Body only, and the party focuses one enemy at a time, so an NPC is nearly always Bloodied (its Body threshold is 56% of its Health) about one round before it dies, and Strained only when both Paladins work on it.

## 8. Slowed and Minions at 4 AP

**Slowed** priced as pack E2 did (positions.mjs): the party against 4 Standards that don't die, a window of 2 rounds from round 2, each price a pair of fights with the same dice (the condition put on one creature at the start of round 2); value = damage the party deals more + takes less (DE). Under today's rules and under the rework's (PCs and NPCs 4 + 1 AP; Slowed lowers the turn's AP, not the Reaction AP). Not the same measurement as prices.md section 5 (positions.mjs averages rounds 1 to 3 with 6,000 pairs): compare the two columns with each other.

| Condition | Today (5 AP), DE | 4 + 1 AP, DE | AP it takes, as a share of the turn: today / 4 AP |
|---|---:|---:|---|
| Slowed 1 on a Standard | 2.9 | 1.9 | 20% / 25% |
| Slowed 2 on a Standard | 5.7 | 7.1 | 40% / 50% |
| Slowed 1 on a Paladin (what it costs the party) | 4.8 | 4.5 | 20% / 25% |
| Slowed 1 on an Archer | 5.7 | 6.1 | 20% / 25% |

**Minions:** today a Minion has 3 AP (its whole turn: move and strike). Under 4 + 1 AP the choices are 3 AP (three quarters of a Standard's turn instead of three fifths) or 2 AP + 1 Reaction AP. The 2 Standards + 8 Minions fight at the rework's factors:

| Minions' AP | rounds · lost · Down · won |
|---|---|
| 3 AP (today's) | 3.5 r · 27% · Down 23% · won 100% |
| 2 AP (+ 1 Reaction AP) | 3.5 r · 23% · Down 20% · won 100% |

In the model a Minion's one Strike costs its AP after 1 AP for moving: with 3 AP it strikes after up to two Advances, with 2 AP after one; a Minion that has to walk two Advances loses its Strike.

## 9. The Standard day (easy, normal, normal, hard)

400 days of the Double Shot party with no Rest (the day model of report.md: Rally Points between fights, Steel Yourself below 35%, Lay On Hands none in this party): today's rules against the rework at its factors.

| Rules | Day cleared | A PC Down during the day | Downs a day | Rally Points left | Health at the end | Fight 4 (2 Elites + 2 Standards) won |
|---|---:|---:|---:|---:|---:|---:|
| Today | 60% | 96% | 3.38 | 33% | 50% | 61% (reached in 98%) |
| The rework at its factors | 59% | 94% | 3.43 | 42% | 50% | 60% (reached in 97%) |

## 10. A Standard's turn and the Special multipliers (arithmetic)

A Medium Standard's Basic attack against AD 13 averages 5.7 (a second one in the turn, with its At-will Bane, about 5.1). The Bestiary's Special multipliers (1 AP Round × 1.4, 2 AP Round × 2.2, 3 AP Encounter × 3.5) are on the Basic attack's average damage. The turn as the Bestiary's tables see it:

| AP a turn | A full turn (Basic attacks and a 2 AP Special, 1 AP to move) | In Basic attacks | With a 3 AP Special |
|---|---|---:|---:|
| 5 (today) | Basic + Basic (1 Bane) + 2 AP Special + move | 1 + 0.9 + 2.2 = 4.1 | 3 AP Special + Basic + move: 3.5 + 1 = 4.5 |
| 4 (the rework) | Basic + 2 AP Special + move | 1 + 2.2 = 3.2 (−22%) | 3 AP Special + move: 3.5 (−22%) |
| 4, no move | Basic + Basic (1 Bane) + 2 AP Special | 4.1 (the same as today) | 3 AP Special + Basic: 4.5 |

The ruler's NPCs make their 2 Basic attacks a turn (the tables' 'deals about'; Specials are not simulated) with 1 AP for moving: at 4 AP a Standard still strikes twice when it doesn't move far, so the model's NPC damage a turn hardly changes (section 2: the NPC AP column), and the Health factor of section 3 carries the whole cut. For the sheet: keep the multipliers (an AP is worth the same, a 3 AP Special is now the whole turn) or scale them to the 4 AP turn (× 1.25: 1.75 / 2.75 / 4.4).
