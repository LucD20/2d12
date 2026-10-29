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
- **Open:** the Archer's two Signatures (the current Class Actions are Double Shot and Precise Aim; Precise Aim is priced at 0.11 of its band).

## 3. Levels 1 to 3

The playtest showed too many features at the start. Level 1 has three class buttons on the bar (the Signature, the Active Escalation and
the Basic Actions); the rest works on its own.

| Level | What you gain |
|---|---|
| **1** | 2 class Features · 1 Signature Class Action (a choice) · **1 Talent** · 1 Passive Escalation · 1 Active Escalation |
| **2** | 1 Encounter Pick · 1 Talent |
| **3** | 1 Daily Pick · 1 Escalation Pick (**Open:** Passive, Active, or either) |

- **The growth curve (Proposed):** about **+10% sustained damage a level** (level 1: 100% of the baseline PC, level 2: 110%, level 3: 120%),
  from the Talents; the Encounter Pick (level 2) and the Daily Pick (level 3) grow the Nova. The Bestiary's levels follow the same curve (pack E3),
  which also fixes today's problem: the Bestiary grows NPC Health 14% at level 2 while the PCs' real damage grows 2 to 6%.
- **Open:** with the Encounter Pick at level 2, a level 1 Paladin has no Encounter Action. Either its Nova budget starts at level 2, or its
  level 1 Nova comes from the Signature (Smite at 3 AP) or its Active Escalation.
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
positions (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone).

**Design consequence:** a point of Defense or a Bane for one round is worth a fifth of an AP. Support Actions need to reach several allies,
last several rounds, or carry a damage rider to be worth their AP.

## 6. Escalation and Momentum

- **Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so
  spending turns it off. At level 1 a PC has exactly one Active and one passive, and they compete: spending 1 every round keeps you at 0 or 1,
  so a "2 or more" passive never turns on. **Proposed:** write each class's level 1 pair so the choice is real (spend now, or hold for the passive).
- **Momentum (decided):** +1 after each fight harder than easy (**more than CV 3/4 per PC**: Lucas's "higher than CV 1/3 per PC" read as
  "harder than the Bestiary's easy fight"; **Open:** confirm). While you have Momentum, you start a fight with **half your level in Escalation,
  rounded up (by default), up to 2**: levels 1 and 2 start at 1, level 3 and up at 2. A Rest resets Momentum.
- **What it does** (the Standard day: easy, normal, normal, hard; 3.3 rounds a fight; half of the fights start with Momentum):

| | Escalation 1 or more | 2 or more | 3 or more |
|---|---:|---:|---:|
| Share of the rounds (nothing spent), with Momentum | 85% | 55% | 29% |
| Without Momentum | 70% | 40% | 14% |
| Uses a fight of an Active that costs 1 / 2 / 3, with Momentum | 2.8 | 1.2 | 0.55 |
| Without Momentum | 2.3 | 1.0 | 0.28 |

  A cost-3 Active (Twin Shot, Perfect Shot) comes about once every two fights with Momentum, once every four without.
- **A bigger Momentum (Proposed):** keep it to effects read **once, at the start of a fight**, so there is nothing to track during it. With a
  reset at every Rest and 3 to 4 fights a day, Momentum reaches 2 or 3 at most, so a milestone at 5 would almost never happen. If you want
  one more milestone, put it at **3** (for example "at 3 Momentum, before initiative, each PC can Advance or Evade 2"; pack E2 prices it).
  More milestones than that is the granularity you're worried about.

## 7. The order of work

1. **This charter** (done; the Open points above are answered in one batch).
2. **E2: positions in the ruler** (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone): the Archer's identity needs it.
3. **The Paladin main build**: 2 Features, both Signatures, one default for every Pick, written to section 4 and checked in the simulated
   days. The Paladin goes first because it relies less on positions.
4. **The Archer main build**, the same way, with E2's prices.
5. **E3: the Bestiary refit** to the new baseline and the growth curve of section 3.
6. **Options**: every other Pick as a sidegrade priced against the default; then the Talents (Class Expertise included), checked for overlap.
7. **The book** (the class documents, the Characters chapter's steps 7 and 8, the level lists), then Foundry.
