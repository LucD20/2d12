# The playtest 2 rework, part 2: the decision sheet's numbers

Written by `node book/ruler/rework.mjs --sheet`; don't edit, run it again. Read by `archive/book-drafts/rework-r.md` section 14. Part 1's numbers: `rework.md`.

Runs: 1000 fights a measurement, 300 a calibration step. **The party:** the 4 AP builds of `rework/` (2 Smite Paladins + 2 Archers, Double Shot and Rolling Shot, each number the mean of the two parties), level 1, Human. **The rework as decided** (archive/book-drafts/rework-r.md section 12) = 4 + 1 AP for PCs and NPCs, Escalation as a level; **the Health line** (Paladin Vigor 23 / Resolve 12 = 35, Archer 19 / 10 = 29; Rally Points = Rally + Stage: 7 and 6; today's builds: 40 and 27); **Escalation from 1** (Momentum 2: half the fights) with **the hooks** (a Critical, about 1 in 12 Tier 3s: +1 once an encounter; the Paladin: an ally within 5 squares becomes Bloodied or goes Down; the Archer: its Marked Quarry goes Down; each once an encounter); **Guard from unspent AP** (2 per turn AP left at the end of the turn, until the start of the next; the Reaction AP never converts; the AP that become Guard no longer pay Reactions unless said); **the Specials** (each NPC spends every AP left after moving on attacks: the 3 AP Encounter Special once (Elites), the Round Special once a round (Minions and Grunts 1 AP × 1.4, Standards and Elites 2 AP × 2.2), then Basic attacks with the At-will Bane, 3 Strikes at most; a Special is modeled as a single-target Strike with the multiplied damage: its condition, area or Save are its damage's worth, as the Bestiary prices them).

## 1. An NPC's turn with its Specials (arithmetic, AD 13)

Damage a turn against one PC at AD 13: the Bestiary's Strikes (the calibration so far: 2 Basic attacks, 3 for an Elite, 1 for a Minion), and every AP on attacks with the Specials, standing next to its target or after 1 AP of movement. A Basic attack's 2nd and 3rd uses take the At-will Bane.

| Role (AP) | Basic attack | The Bestiary's Strikes | Specials × 1 (the book), no move · after a move | Specials × 1.25, no move · after a move | ratio to the Strikes (× 1, no move) |
|---|---:|---:|---|---|---:|
| Minion (3) | 2.8 | 2.8 | 9.3 · 6.8 | 10.3 · 7.8 | × 3.29 |
| Grunt (4) | 3.4 | 6.5 | 11.3 · 11.3 | 12.5 · 12.5 | × 1.74 |
| Standard (4) | 5.7 | 10.7 | 23.2 · 18.1 | 26.3 · 21.3 | × 2.16 |
| Elite (4) (the Encounter Special's turn · a later turn) | 6.7 | 18.3 | 30.3 / 27.7 · 23.6 / 21.5 | 36.2 / 31.4 · 29.5 / 25.2 | × 1.51 |

## 2. The fights, piece by piece

The CV 4 encounters (rounds · the party's Health lost · a PC goes Down · won), NPC Health and damage as the Bestiary has them (no factor); each column adds one piece to the one before. **Part 1** = the rework of part 1 (4 + 1 AP, Escalation as a level from 0, Momentum 1 in half the fights, today's Health).

| Encounter | Part 1 | + the Health line | + Escalation from 1, hooks | + Guard from unspent AP | + the Specials (× 1) | the Specials × 1.25 instead |
|---|---|---|---|---|---|---|
| 4 Standards (4) | 3.5 r · 29% · Down 21% · won 100% | 3.5 r · 30% · Down 24% · won 100% | 3.3 r · 25% · Down 17% · won 100% | 3.3 r · 25% · Down 17% · won 100% | 3.9 r · 56% · Down 71% · won 86% | 3.9 r · 69% · Down 85% · won 66% |
| Elite + 2 Standards (4) | 3.6 r · 30% · Down 24% · won 100% | 3.7 r · 31% · Down 31% · won 100% | 3.5 r · 26% · Down 21% · won 100% | 3.5 r · 26% · Down 21% · won 100% | 4.0 r · 48% · Down 69% · won 94% | 4.2 r · 59% · Down 82% · won 83% |
| 2 Elites (4) | 3.7 r · 32% · Down 30% · won 100% | 3.8 r · 34% · Down 36% · won 99% | 3.6 r · 27% · Down 23% · won 100% | 3.6 r · 27% · Down 23% · won 100% | 4.1 r · 46% · Down 68% · won 96% | 4.3 r · 58% · Down 84% · won 85% |
| 8 Grunts (4) | 3.5 r · 30% · Down 14% · won 100% | 3.5 r · 31% · Down 14% · won 100% | 3.4 r · 24% · Down 8% · won 100% | 3.4 r · 24% · Down 8% · won 100% | 3.9 r · 49% · Down 52% · won 95% | 4.0 r · 59% · Down 70% · won 86% |
| 2 Standards + 8 Minions (4) | 3.5 r · 23% · Down 14% · won 100% | 3.5 r · 24% · Down 12% · won 100% | 3.4 r · 20% · Down 10% · won 100% | 3.4 r · 20% · Down 10% · won 100% | 3.8 r · 47% · Down 61% · won 95% | 3.9 r · 58% · Down 75% · won 84% |

The 4 Standards fight, per fight (all 4 PCs):

| | Part 1 | + the Health line | + Escalation from 1, hooks | + Guard from unspent AP | + the Specials (× 1) | the Specials × 1.25 instead |
|---|---:|---:|---:|---:|---:|---:|
| Party damage dealt · a PC turn | 289.7 · 24.2 | 289.0 · 24.2 | 287.7 · 24.8 | 287.7 · 24.8 | 272.0 · 24.5 | 249.0 · 24.8 |
| Damage taken (after Guard and blocks) | 46.3 | 47.0 | 37.0 | 37.0 | 93.9 | 121.0 |
| PC turns at Escalation 0 / 1 / 2 / 3 | 0.5 / 1.0 / 0.9 / 0.6 | 0.5 / 1.0 / 0.9 / 0.6 | 0.0 / 0.5 / 0.8 / 1.7 | 0.0 / 0.5 / 0.8 / 1.7 | 0.0 / 0.4 / 0.7 / 1.7 | 0.0 / 0.4 / 0.6 / 1.5 |

Guard from unspent AP changes nothing here: the plans spend every AP (section 4 prices it with turns that hold one).

## 3. Escalation from 1, with the hooks

The 4 Standards fight with every piece (column 5 of section 2). An Apex (Encounter, needs Escalation 3) is usable in the fights where the PC has a turn at 3:

| Per PC | all fights | with Momentum (starts at 2) | without (starts at 1) | Part 1 (starts at 0, Momentum 1), all fights |
|---|---:|---:|---:|---:|
| A turn at Escalation 2 or more · such turns a fight | 91% · 2.33 | 97% · 2.79 | 84% · 1.88 | 90% · 1.52 |
| A turn at Escalation 3 or more · such turns a fight | 80% · 1.67 | 85% · 1.88 | 74% · 1.46 | 52% · 0.62 |

**The hooks, per PC a fight:** the Critical hook fires 0.05 times for a Paladin and 0.09 for an Archer (it can't fire twice); the Paladin's hook (an ally within 5 squares Bloodied or Down) 0.34; the Archer's (its Marked Quarry goes Down) 0.61. A hook is used only when it raises the Escalation (at 3 it waits), so these are raises.

## 4. Guard from unspent AP

The 4 Standards fight with every piece, NPCs as the Bestiary has them. The plans spend every AP, so an AP is left only when a step can't be made; to price the rule, a **hold** turn keeps one AP: the Paladins' main turn drops its second Weapon Attack (Divine Surge, Smite 2, Weapon Attack), the Archers' drops Pinning Shot (Double Shot 2, Lock & Loose). Per PC a fight; party = all 4 PCs.

| Rule and plan | rounds · lost · Down · won | AP left a turn (Paladin · Archer) | Guard gained · used a fight (Paladin / Archer) | Reactions a fight (Paladin · Archer) | Party dealt · taken |
|---|---|---|---|---|---|
| Guard 2 an AP, the plans (every AP spent) | 3.9 r · 56% · Down 71% · won 86% | 0.00 · 0.00 | 0.0 · 0.0 / 0.0 · 0.0 | 0.76 · 1.51 | 272.0 · 93.9 |
| Paladins hold an AP, no Guard (part 1's rule: the AP pays Reactions) | 4.0 r · 57% · Down 71% · won 84% | 0.00 · 0.00 | 0.0 · 0.0 / 0.0 · 0.0 | 0.80 · 1.55 | 268.8 · 95.2 |
| Paladins hold an AP, Guard 2 (the AP is gone) | 4.0 r · 55% · Down 69% · won 85% | 0.28 · 0.00 | 1.8 · 0.8 / 0.0 · 0.0 | 0.79 · 1.51 | 271.1 · 92.2 |
| Paladins hold, Guard 2, and the kept AP may still pay a Reaction (losing its Guard) | 4.0 r · 56% · Down 70% · won 85% | 0.27 · 0.00 | 1.8 · 0.7 / 0.0 · 0.0 | 0.82 · 1.54 | 269.6 · 92.9 |
| Paladins hold, Guard 3 (Stage 2's value) | 4.0 r · 56% · Down 72% · won 84% | 0.27 · 0.00 | 2.7 · 1.1 / 0.0 · 0.0 | 0.78 · 1.53 | 268.7 · 94.5 |
| Archers hold an AP, Guard 2 | 4.0 r · 59% · Down 73% · won 81% | 0.00 · 0.31 | 0.0 · 0.0 / 2.0 · 0.5 | 0.80 · 1.64 | 264.4 · 99.3 |

For scale: 1 AP is worth 5.8 DE at 4 AP (part 1, section 2), a Weapon Attack about 5.4, the second one in a turn (its At-will Bane) about 4.5.

## 5. The Bestiary's factors: a quarter, 30% or a third of the party's Health

Every piece on (the Health line is the PCs' and stays): the NPC Health factor **h** for which 4 Standards last 3.5 rounds, then the NPC damage factor **d** (on the Basic attack tables, so on the Specials too) for which the fight costs the party the target share of its Health (bisection, alternating twice). Once with the book's Special multipliers, once with them × 1.25.

| Specials | Target | NPC Health × h | NPC damage × d | 4 Standards at these factors | Party damage taken a fight | Downs a fight: a Paladin · an Archer |
|---|---|---:|---:|---|---:|---|
| × 1 (the book) | 25% | 1.04 | 0.57 | 3.5 r · 25% · Down 17% · won 100% | 39.0 | 0.05 · 0.04 |
| × 1 (the book) | 30% | 1.01 | 0.64 | 3.5 r · 29% · Down 25% · won 100% | 46.1 | 0.08 · 0.07 |
| × 1 (the book) | 33% | 0.99 | 0.69 | 3.5 r · 33% · Down 33% · won 99% | 51.9 | 0.12 · 0.09 |
| × 1.25 | 25% | 1.04 | 0.47 | 3.5 r · 25% · Down 16% · won 100% | 38.4 | 0.05 · 0.05 |
| × 1.25 | 30% | 0.99 | 0.55 | 3.5 r · 31% · Down 28% · won 100% | 47.9 | 0.10 · 0.08 |
| × 1.25 | 33% | 0.98 | 0.59 | 3.5 r · 33% · Down 33% · won 99% | 52.1 | 0.13 · 0.09 |
| × 1 (the book) | a Down in 1 fight of 10 | 1.04 | 0.48 | 3.4 r · 21% · Down 8% · won 100% | 30.5 | 0.02 · 0.02 |

With the factors, a Medium Standard has 63 × h Health and a Basic attack of 6 / 11 × d.

**Fights by CV at the book's Special multipliers** (the Bestiary's targets so far: easy 2.5 rounds / 20%, normal 3.5 / a third, hard 4.5-5 / half, deadly 6 / half to three quarters):

| Encounter | a quarter | 30% | a third |
|---|---|---|---|
| 3 Standards (CV 3, easy) | 2.7 r · 17% · Down 7% · won 100% | 2.6 r · 19% · Down 12% · won 100% | 2.6 r · 20% · Down 16% · won 100% |
| 4 Standards (4) | 3.5 r · 25% · Down 17% · won 100% | 3.5 r · 29% · Down 25% · won 100% | 3.5 r · 33% · Down 33% · won 99% |
| Elite + 2 Standards (4) | 3.6 r · 23% · Down 14% · won 100% | 3.6 r · 26% · Down 24% · won 100% | 3.5 r · 29% · Down 29% · won 100% |
| 2 Elites (4) | 3.6 r · 22% · Down 12% · won 100% | 3.6 r · 25% · Down 21% · won 100% | 3.6 r · 28% · Down 28% · won 100% |
| 8 Grunts (4) | 3.5 r · 24% · Down 6% · won 100% | 3.4 r · 27% · Down 12% · won 100% | 3.5 r · 30% · Down 16% · won 100% |
| 2 Standards + 8 Minions (4) | 3.4 r · 21% · Down 11% · won 100% | 3.4 r · 25% · Down 19% · won 100% | 3.4 r · 27% · Down 22% · won 100% |
| 5 Standards (5, hard) | 4.6 r · 41% · Down 41% · won 98% | 4.6 r · 48% · Down 55% · won 92% | 4.7 r · 53% · Down 61% · won 88% |
| 6 Standards (6, deadly) | 5.7 r · 57% · Down 65% · won 85% | 5.5 r · 67% · Down 76% · won 71% | 5.3 r · 74% · Down 83% · won 59% |
| 2 Elites + 2 Standards (6, deadly) | 5.7 r · 44% · Down 47% · won 97% | 5.8 r · 53% · Down 63% · won 90% | 5.9 r · 59% · Down 71% · won 84% |

## 6. The Hallmark Reaction: Shield of Faith's size

The 4 Standards fight at the default factors (a quarter of the Health: h 1.04, d 0.57), every piece on; both Paladins with the Reaction named (the Archers keep Quick Draw). A block takes its dice off one NPC hit on the Paladin or an ally within 5 squares, once per NPC turn. **Worth** = what the Reaction itself did (its damage, the damage its block took off, the damage its Guard absorbed) per Paladin turn, and in AP at 5.8 DE. (A fight to the death can't price it by the party's damage: the NPCs' Health caps it; a Reaction's damage ends the fight sooner.)

| Paladin's Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · its Guard used · its damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |
|---|---|---:|---|---|
| None | 3.6 r · 28% · Down 19% · won 100% | 0.00 | 0.0 · 0.0 · 0.0 | 0.00 · 0.00 |
| Opportunity Attack (the basic Reaction) | 3.5 r · 25% · Down 17% · won 100% | 0.87 | 0.0 · 0.4 · 4.7 | 1.69 · 0.29 |
| Shield of Faith 1d4 + [Mod] | 3.5 r · 19% · Down 11% · won 100% | 2.44 | 10.3 · 0.0 · 0.0 | 3.31 · 0.57 |
| Shield of Faith 1d6 + [Mod] | 3.5 r · 17% · Down 9% · won 100% | 2.42 | 12.0 · 0.0 · 0.0 | 3.88 · 0.67 |
| Shield of Faith 1d8 + [Mod] (today's) | 3.5 r · 17% · Down 8% · won 100% | 2.42 | 13.2 · 0.0 · 0.0 | 4.26 · 0.74 |
| Shield of Faith 2d6 + [Mod] | 3.5 r · 14% · Down 7% · won 100% | 2.42 | 15.8 · 0.0 · 0.0 | 5.10 · 0.88 |
| Shield of Faith 2d8 + [Mod] | 3.5 r · 14% · Down 7% · won 100% | 2.41 | 16.7 · 0.0 · 0.0 | 5.41 · 0.93 |
| Shield of Faith 1d8 + [Mod], the rest becomes Guard on the target | 3.5 r · 16% · Down 8% · won 100% | 2.41 | 13.1 · 0.0 · 0.0 | 4.26 · 0.74 |
| Shield of Faith 2d6 + [Mod], the rest becomes Guard | 3.5 r · 13% · Down 6% · won 100% | 2.44 | 16.0 · 0.0 · 0.0 | 5.16 · 0.89 |

The worth includes what the other PCs gain (a blocked hit on an ally); the Archers' Quick Draw is in every row. A block can't take more than the hit: at these factors a Standard's Basic attack averages 3.4 / 6.2 and its 2 AP Special 7.5 / 13.7, so bigger dice saturate.

## 7. The dice cut: the Encounter and Daily ceilings, or × 0.75 on everything

**A. Ceilings:** an Encounter Action's dice (besides [W] and [Mod]) at most its AP on Tier 2 and its AP + 1 on Tier 3 (a Daily: one more each); in these builds only Holy Wrath moves (3 AP: 3d8 / 5d8 / 7d8 → 2d8 / 3d8 / 4d8; 2 AP: 2d6 / 3d8 / 4d8 → 1d8 / 2d8 / 3d8). **B. × 0.75:** every damage the PCs deal × 0.75 (weapon, dice, Modifier). Both at the default factors (a quarter); then h re-fitted so the fight lasts 3.5 rounds again.

| Shape | Paladin main turn · Nova (Def 13, Esc 3) | Archer main turn | 4 Standards at the default factors | h for 3.5 rounds | 4 Standards at that h | The Nova's share of a Paladin's damage |
|---|---|---|---|---:|---|---:|
| None (today's dice) | 21.4 · 32.9 | 28.2 | 3.5 r · 25% · Down 17% · won 100% | 1.05 | 3.5 r · 25% · Down 17% · won 100% | 40% |
| A. Ceilings | 21.4 · 24.1 | 28.2 | 3.7 r · 28% · Down 20% · won 100% | 1.01 | 3.6 r · 27% · Down 19% · won 100% | 33% |
| B. × 0.75 | 16.0 · 24.7 | 21.2 | 4.5 r · 33% · Down 28% · won 100% | 0.79 | 3.4 r · 26% · Down 17% · won 100% | 41% |

## 8. The Health line at levels 1, 5 and 8 (arithmetic)

Human, high on Vigor. **Today** = the book's thresholds with today's Attributes (they don't grow) × (Level + 17) / 16. A Standard's turn = the Bestiary's 2 Basic attacks against the PC's AD (Paladin 14, Archer 13) with today's Stage rows, before any factor; **turns to Down** = Health ÷ that.

| Level | Paladin today · the line | Archer today · the line | Party (2 + 2) today · the line | A Standard's turn (vs AD 14 · 13) | Standard turns to Down the Paladin · the Archer (the line) | Rally Point heal (the line: Paladin · Archer) |
|---:|---|---|---|---|---|---|
| 1 | 40 · **35** (23 / 12) | 27 · **29** (19 / 10) | 134 · 128 | 9.6 · 10.7 | 3.7 · 2.7 (today 4.2 · 2.5) | 9 · 8 |
| 5 | 49 · **53** (35 / 18) | 33 · **43** (28 / 15) | 164 · 192 | 11.8 · 13.3 | 4.5 · 3.2 (today 4.1 · 2.5) | 14 · 11 |
| 8 | 55 · **74** (49 / 25) | 37 · **60** (39 / 21) | 184 · 268 | 13.5 · 15.2 | 5.5 · 4.0 (today 4.1 · 2.4) | 19 · 15 |

A Standard's Health by Stage (today's rows): 63 / 71 / 96; its Basic attack 6 / 11 → 7.5 / 13.5 → 8.5 / 15.5.

**Healing, Guard and blocks against the pools** (level 1; average amount and its share of the Paladin's · the Archer's Health, today → the line):

| Card | Average | Paladin 40 → 35 | Archer 27 → 29 |
|---|---:|---|---|
| A Rally Point (a quarter of the pool; Lay On Hands spends them) | 10 · 7 → 9 · 8 | 25% → 25% | 25% → 25% |
| Mending Light (start of turn, [PMod] + 1) | 3.0 | 8% → 9% | 11% → 10% |
| Divine Surge's Guard (2d6) | 7.0 | 18% → 20% | 26% → 24% |
| Smite 3's Guard (1d8 + [PMod]) | 6.5 | 16% → 19% | 24% → 22% |
| Shield of Faith (block 1d8 + [PMod]) | 6.5 | 16% → 19% | 24% → 22% |
| Bulwark of Faith (block 9) | 9.0 | 23% → 26% | 33% → 31% |
| Guard from 1 unspent AP (Stage 1) | 2.0 | 5% → 6% | 7% → 7% |

## 9. The Archer's Reaction: bigger hits or a trigger that comes more often

The 4 Standards fight at the default factors (h 1.04, d 0.57), every piece on; the Paladins keep Opportunity Attack; both Archers take the Reaction named. **Quick Draw** = a Trigger when an enemy within 5 squares moves closer (the stand-in); **Overwatch** = a Trigger after an enemy within 10 squares makes a Strike (once per NPC turn). **Worth** = the Reaction's own damage per Archer turn, and in AP (5.8 DE).

| The Archer's Reaction | rounds · lost · Down · won | Reactions a fight (an Archer) | Its damage a fight (an Archer) | Worth an Archer turn (DE · AP) |
|---|---|---:|---:|---|
| None | 3.7 r · 27% · Down 19% · won 100% | 0.00 | 0.0 | 0.00 · 0.00 |
| Quick Draw: a Weapon Attack (1[W]) | 3.5 r · 25% · Down 17% · won 100% | 1.19 | 7.6 | 2.48 · 0.43 |
| Quick Draw with 2[W] | 3.4 r · 25% · Down 16% · won 100% | 1.18 | 12.2 | 4.08 · 0.70 |
| Quick Draw, Empowered 2 (+2 a die) | 3.4 r · 25% · Down 15% · won 100% | 1.20 | 9.4 | 3.09 · 0.53 |
| Quick Draw with 1 Boon | 3.5 r · 26% · Down 17% · won 100% | 1.22 | 8.5 | 2.77 · 0.48 |
| Overwatch: a Weapon Attack | 3.3 r · 26% · Down 17% · won 100% | 2.70 | 16.1 | 5.57 · 0.96 |
| Overwatch with 2[W] | 3.1 r · 25% · Down 16% · won 100% | 2.55 | 24.6 | 9.00 · 1.55 |

**Action compression** (arithmetic): a Reaction that makes your next turn's first 1 AP Action cost 0 is worth 1 AP each time it fires; at Quick Draw's rate (about 1.5 fires in 3.5 turns) that is 0.43 AP a turn, a little over Quick Draw's Weapon Attack: the trigger's frequency, not the effect's kind, is what keeps a Reaction under 1 AP.

## 10. Divine Surge and Vanish as Escalation 1 Passives

The 4 Standards fight at the default factors, every piece on (every fight starts at Escalation 1, so an Escalation 1 Passive works from the first turn). Divine Surge is already in every Paladin turn (0 AP, every round): its worth is the allies' extra damage it gives plus the Guard it absorbs. Vanish (Evade 2 and +1 Defense for 1 round, 0 AP) is added at the end of each Archer turn: its worth is the damage the Archers take less (and they keep their AP). Per turn of its owner; for scale, part 1's Escalation Passives: Radiant Zeal +3.5 damage a turn, Killer's Focus +2.7, Marked Quarry +3.9, Hallowed Stance 0.8, Elusive 0.2, Font of Mercy 0.3.

| | rounds · lost · Down · won | Worth a turn of its owner (DE · AP) | How |
|---|---|---|---|
| Divine Surge (Paladin) | 3.5 r · 25% · Down 17% · won 100% | 5.20 · 0.90 | 6.9 allies' damage + 8.7 Guard used a fight |
| Without Divine Surge | 3.7 r · 36% · Down 30% · won 99% | | the same fight with no Divine Surge in the turns |
| Vanish at the end of each Archer turn | 3.5 r · 25% · Down 16% · won 100% | 0.14 · 0.02 | an Archer takes 6.7 a fight instead of 7.1 |

(6 minutes.)