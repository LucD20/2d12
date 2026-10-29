# The class charter (2026-10-29)

The classes were born from brainstorming to get the system going; from now on **classes are written after the system**. This charter is
what every class (and every Talent) is written against. The numbers come from the ruler: `book/ruler/prices.md` (the price list,
`node book/ruler/econ.mjs`) and `book/ruler/report.md` (builds, duels, fights and adventuring days, `node book/ruler/spec.mjs`).
Decisions are Lucas's (2026-10-29) unless marked **Proposed** or **Open**.

## 1. Class and Talent

The system is **Talent-based**: the class is the identity, the Talents are the build.

- **A class owns only what expresses its fantasy:** its two Features, its Signature Class Action, its role tools (the Paladin's healing
  and Defense, the Archer's shooting on the move), its Escalation list, and its Encounter and Daily lists.
- **Talents own everything generic:** weapon styles, mobility, tactics, magic, skills. The test: **if two different classes could want it,
  it is a Talent.**
- **No overlap:**
  - A Talent never copies a class Action. It can modify one ("your [Divine] Strikes...") or work with a trait any class can have.
  - Effects of the same kind don't stack: a shared keyword limits them (for example, one Stance at a time).
  - The class budget is fixed by the role (section 4). Talents add options (sidegrades of equal power) and the growth of section 3. They never add power on top of the role.
- **More class options come only through Talents** (there is no "pick any class Action" slot), for example *Class Expertise* (a level 5
  Talent): "you gain another Daily Action from your class". This keeps every class budget fixed and puts build freedom in the Talents.
- **Overlaps already in the book** (to fix in the rewrite):
  - The Talent **Aim** (1 AP, At-will: 1 Boon on your next [Ranged, Strike, Weapon] Action) is the Archer's **Precise Aim 1**
    (1 AP, Round: 1 Boon on your next [Ranged, Shot, Strike, Weapon] Action), only better: At-will instead of Round, and one trait fewer.
  - **Opportunity Attack** (a Weapon Attack when a creature within 3 leaves a square) and the Archer's **Quick Draw** (a Weapon Attack when
    an enemy within 5 moves closer) are the same kind of Reaction.

## 2. The Signature Class Action

At level 1 a character chooses **one Signature Class Action** from two that are the class's fantasy. For the Paladin: **Smite** or
**Lay On Hands**.

- **Each Signature covers the whole role by itself** (a small rider from the other side), so the choice changes the shape of the build, not
  the role. Example: Smite (damage) with a support rider ("an ally near the target heals 1d4" or "+1 Defense for a round"); Lay On Hands
  (support) with a damage rider ("your next Strike deals +1d6"). The two are priced to the same budget.
- The Archer's two Signatures come with its rewrite (after the Paladin; today's Class Actions are Double Shot and Precise Aim, and Precise Aim is priced at 0.11 of its band).

## 3. Levels 1 to 3

The playtest showed too many features at the start. The table is the **template**: a class can move a Pick to another level or trade one
kind for another (Lucas: classes can have different Picks at different levels, as they have more or fewer Features), as long as each
level keeps the same total budget. The Paladin, for example, can start with an Encounter Action at level 1 and have more Encounter Picks than Round ones.

**Classes needn't be symmetrical (Lucas, 2026-10-29):** one class can offer three Signature choices or start with two Signatures, another can have more Escalation features (the planned Gladiator: "gathering the crowd"), as long as the role budget holds. The Paladin and the Archer stay symmetrical.

| Level | What you gain |
|---|---|
| **1** | 2 class Features · 1 Signature Class Action (a choice) · **1 Talent** · 1 Passive Escalation · 1 Active Escalation |
| **2** | 1 Encounter Pick · 1 Talent |
| **3** | 1 Daily Pick · 1 Passive Escalation |

- **Replaced (brainstorm 2026-10-29; pack LV, decided by Lucas: model A, book/progression-lv.md: no sustained growth inside a tier, steps at levels 5 and 8).** **The growth curve (Proposed):** about **+10% sustained damage a level** (level 1: 100% of the baseline PC, level 2: 110%, level 3: 120%),
  from the Talents; the Encounter Pick (level 2) and the Daily Pick (level 3) grow the Nova. The Bestiary's levels follow the same curve (pack E3),
  which also fixes today's problem: the Bestiary grows NPC Health 14% at level 2 while the PCs' real damage grows 2 to 6%.
- **The Nova at level 1:** a class whose role has Nova (the Paladin) takes its Encounter Pick at level 1 (the template's level 2 Pick moves).
- The Health level factor (Level / 10 + 1) stays.

## 4. The role budgets (confirmed)

As shares of the **baseline PC** (the Bestiary's: 23.3 damage a turn at Defense 13 at level 1; its Health: the average Health Pool of the
classes at the level).

| Role | Sustained damage | Nova (its best turn) | Health | Its identity |
|---|---|---|---|---|
| **Paladin** | 85-90% | 150-180% | 120-130% | tank and support: heals and Defense for allies, Nova damage |
| **Archer** | 100-105%, low variance | 110-130% | 80-85% | very mobile, fragile, constant ranged damage, Actions that move and shoot from afar |
| Future melee striker | about 115% | | about 100% | the top damage |

Healing is worth **a little more than damage**: 1 Health healed = 1.1 damage-equivalents (DE).

**Where the current classes are** (the ruler, 2026-10-29, Escalation spent as the book says, Momentum on):

| Build | Real damage a turn (the Standard day) | Nova | Health |
|---|---:|---:|---:|
| Paladin L1 | 117% (budget 85-90%) | 104% (budget 150-180%) | 114% (budget 120-130%) |
| Archer L1 | 107% (budget 100-105%) | 82% (budget 110-130%) | 86% (budget 80-85%) |

The Paladin deals too much sustained damage and has no Nova; neither class has a Nova; the support Actions are priced far under
damage (Shield of Faith 0.19 of its band, Aura of Protection 0.4-0.6, Champion's Challenge 0.14), so the Paladin can't support yet.

## 5. The price list (the unit every card is written in)

From `prices.md` (level 1): **1 AP = 4.66 DE**; +1 Boon = +9% of the roll (0.5 DE on a Weapon Attack), the same as +1 Modifier or -1 Defense;
Favored +35%, Doomed -44%; Empowered 1 = +1 a die that lands; Vulnerable 1 until its turn ends 1.2 DE; +1 Defense for a round on an ally 0.87 DE;
1 Bane on an enemy's Strikes for its turn 0.87 DE; a Rally Point 8.8 DE; a Down prevented 35 DE. **Frequency bands** (DE per AP / 4.66):
At-will 0.9-1.1, Round 1.0-1.3, Encounter 1.4-2.0, Daily 2.0-3.0 (Proposed). A card is written to its band; pack E2 prices what needs
positions (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone): **done** (prices.md section 5). On one Standard: Immobilized (EoT) 4.7 DE (an AP),
Slowed 2 3.6, Hindered (EoT) 1.5, Slowed 1 1.4, Prone 1.2, a Push of any length about 1, Vulnerable 1 0.6; an Evade is worth the AP of the step away on the 47% of
an Archer's turns that start Engaged; ±1 Speed nothing on an open field.

**Design consequence:** a point of Defense or a Bane for one round is worth a fifth of an AP. Support Actions need to reach several allies,
last several rounds, or carry a damage rider to be worth their AP.

## 6. Escalation and Momentum

- **Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so
  spending turns it off. At level 1 a PC has exactly one Active and one passive, and they compete: spending 1 every round keeps you at 0 or 1,
  so a "2 or more" passive never turns on. **Proposed:** write each class's level 1 pair so the choice is real (spend now, or hold for the passive).
- **Momentum (decided):** +1 after each fight **harder than easy** (more than CV 3/4 per PC). While you have Momentum (1 is enough), you start
  a fight with **half your level in Escalation, rounded up (by default), up to 2**: levels 1 and 2 start at 1, level 3 and up at 2. A Rest resets Momentum.
- **What it does** (the Standard day: easy, normal, normal, hard; 3.3 rounds a fight; half of the fights start with Momentum):

| | Escalation 1 or more | 2 or more | 3 or more |
|---|---:|---:|---:|
| Share of the rounds (nothing spent), with Momentum | 85% | 55% | 29% |
| Without Momentum | 70% | 40% | 14% |
| Uses a fight of an Active that costs 1 / 2 / 3, with Momentum | 2.8 | 1.2 | 0.55 |
| Without Momentum | 2.3 | 1.0 | 0.28 |

  A cost-3 Active (Twin Shot, Perfect Shot) comes about once every two fights with Momentum, once every four without.
- **Momentum does only that (decided).** Abilities can read the Escalation you start with instead ("When you start combat with 2 Escalation,
  you can Advance 5"). With the rule above, starting with 2 needs level 3 or more, so such an ability is a level 3+ one (or comes with a
  feature that raises the starting Escalation). Pack E2 prices the Advance.

**P1 done (2026-10-29):** the Paladin main build is in the book (book/paladin-p1.md has the cards' prices and the budget table): sustained 86% of the baseline, Nova 157-166%, Health 124% at level 1, +10% a level.

## 7. The order of work

1. **This charter** (done; Lucas answered its open points on 2026-10-29).
2. **P1: the Paladin main build**: 2 Features, both Signatures (Smite and Lay On Hands, already strong identities), one default for every
   Pick, written to section 4 and checked in the simulated days. It goes first: it relies less on positions.
3. **E2: positions in the ruler** (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone): the Archer's identity needs it. **Done 2026-10-29** (book/ruler/map.mjs, positions.mjs; prices.md section 5): on the map the Archer's real sustained damage is 96% of the baseline (121% without positions), the Paladin's 81%; the conditions have prices.
4. **A1: the Archer rewrite and main build**, with E2's prices. **Proposed 2026-10-29** (book/archer-a1.md): Signatures Double Shot or Rolling Shot; sustained 102-104% at levels 1-2, Health 86%.
5. **E3: the Bestiary refit** to the new baseline and the growth curve of section 3.
6. **Options**: every other Pick as a sidegrade priced against the default; then the Talents (Class Expertise included), checked for overlap.
7. **The book** (the class documents, the Characters chapter's steps 7 and 8, the level lists), then Foundry.
