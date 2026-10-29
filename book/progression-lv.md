# Progression prep (pack LV, 2026-10-29): DECIDED

> **Lucas decided (2026-10-29): all five defaults** (model A; hard CV 1¼ and deadly 1½ a PC; Spell Mastery at level 8 with 2[W], keep the best and the round-1 floor as Magic Talents; CV by level gap by tier ×1 / ×0.8 / ×0.65; Health factor (Level + 17) / 16). **Nothing is in `book/rules-src` yet.** Where each one lands: the CV scale, the level-gap rule and the NPC Health and damage by level go into the Bestiary with **E3** (the refit, measured with the real classes); the Health factor and the Modifier steps go into the Core Rules with the level 4-10 rows (with E3, so PCs and NPCs change together; Foundry follows); Mastery 2[W] and Spell Mastery with **D2**; keep the best, Wild Magic and the floor as Magic Talents with **D4**. **A1** is written to model A now: no sustained growth in levels 1-3.

The brainstorm of 2026-10-29 decided the shape of levels 1 to 10 (rules-backlog top: level cap 10 in tiers 1-4 / 5-7 / 8-10, fight
lengths by difficulty, no number bloat, CV by level gap, Health about ×1.5 at level 10, Mastery 2[W], spells with Overcast paid by
Escalation, keep the best, spells must not feel bad). This pack runs **three progression models** through the ruler at levels 1 to 10
and answers the questions the brainstorm left to the numbers. **Nothing here is in `book/rules-src`**: you pick a model and answer
section 5, then A1 (the Archer) is written to it and E3 (the Bestiary refit) uses it.

The numbers: `node book/ruler/progression.mjs` (about 3½ minutes; `--quick` for a draft) writes **`book/ruler/progression.md`** (all the
tables; this file quotes them). It uses the spec ruler (spec.mjs) with the map model (E2), so fights have positions, Momentum, Novas,
Dailies, Rally Points and Steel Yourself.

## 1. How it was measured

- **Two stand-in PCs a level, not classes** (the classes are compared with classes; these compare growth): a **weapon user** (Greatsword,
  AD 14: a 2 AP Round Strike + two Weapon Attacks; an Encounter Nova; a Daily from level 3; Escalation: Surge, 1 Escalation for +1 die on
  the next Strike, and Killer, while Escalation 2+: +1d6 on the first Strike a round) and a **caster** (AD 13, [Spell] Power Actions vs WD:
  each spell is the weapon user's Action with the Greatsword's [W] written as Power dice, so the two have the **same budget at level 1**;
  Overcast: +1 die for each Escalation spent, up to the tier's limit; the round-1 floor). Party: 2 + 2. At level 1 they deal 21.2 a turn
  (Escalation 0, Defense 13; the Bestiary's baseline PC is 23.3).
- **NPCs:** the level 1 Bestiary (Medium) with Health × a factor found by bisection so that **a standard fight (4 Standards) lasts 3.5 rounds**
  at each level, and damage × the PCs' Health growth. Defense and Modifier never change (decided: flat accuracy).
- **Decided, in every model:** Escalation cap 3; Momentum starts a fight at 1 (levels 1-2), 2 (3-7), 3 (8-10); Overcast limit 1 / 2 / 3 by tier.

## 2. The three models

| Model | Where the growth comes from | Damage of a 3.5-round fight (level 1 = 100%) L5 / L8 / L10 | Health L5 / L10 | NPC Health needed L5 / L10 |
|---|---|---:|---:|---:|
| **A. Bounded** | Only the decided numbers: **Modifier +3 at level 5, +4 at level 8**; **Mastery 2[W] (weapon) and keep the best (Power) at level 8**; Overcast limit and Momentum by tier. Picks after level 3 are options, not power. | 117% / 161% / 161% | 122% / 148% | 117% / 163% |
| **B. Escalation-heavy** | The Modifier steps; no 2[W] or keep the best before level 10; each Escalation spent adds 1d8 / 2d6 / 2d8 by tier; the weapon user gains a hold passive at level 5 (Escalation 2+: Empowered 1). | 133% / 158% / 190% | 122% / 148% | 133% / 191% |
| **C. +10% a level** (the charter today, to compare) | +10% damage a level (from Talents), Modifiers stay +2, Health (level + 10) / 10. | 146% / 181% / 202% | 135% / 176% | 143% / 199% |

Health in A and B: the level factor **×1.1 at level 1 growing to ×1.65 at level 10** (×1.5 of level 1, decided (5)); as a book formula,
**(Level + 17) / 16**, rounded up as today (×1.125 at level 1, ×1.69 at level 10; within 2% of what was run).

**A grows in steps**: nothing between the steps but Health (+5% a level) and options; +17% at level 5, +38% at level 8. B grows more and
later in the fight (rounds 3-4). C is smooth, and doubles everything by level 10 (the number growth the brainstorm wanted to avoid).

## 3. What the ruler found

**1. Fight length holds in every model**, because NPC Health follows the PCs' damage: easy 2.5-2.6 rounds (19% of the party's Health),
standard 3.5 (33%), at levels 1, 5 and 10 alike. The growth model doesn't change how fights feel; it changes how much NPC Health grows
(A ×1.63 at level 10, B ×1.91, C ×1.99) and how lower-level NPCs count (finding 3).

**2. Hard and deadly fights miss their lengths on today's CV scale** (CV 1.5 and 2 a PC). Fight length grows with the NPCs' Health about
linearly, and the damage taken grows faster (Lanchester), so with 3.5-round standard fights:

| Model A (levels 1 / 5 / 10) | rounds | Health lost | the party wins |
|---|---:|---:|---:|
| CV 5 (1.25 a PC) | 4.8 / 4.0 / 4.2 | 51% / 41% / 43% | 96% / 100% / 100% |
| CV 6 (today's hard) | 6.0 / 5.4 / 5.5 | 74% / 61% / 64% | 70% / 88% / 85% |
| 2 Elites + 2 Standards (CV 6) | 5.8 / 5.5 / 5.5 | 93% / 83% / 87% | 26% / 48% / 38% |
| CV 8 (today's deadly) | 4.5 / 5.1 / 4.9 | 99% / 96% / 97% | 3% / 12% / 9% |

  **CV 1.25 a PC is the hard fight of the target (4-4.5 rounds)** once the party has a Daily (level 3+; at level 1, with no Daily, it lasts
  4.8); **CV 1.5 is the deadly one** (5.4-6 rounds, 61-74% Health, the party wins 70-88%); CV 2 a PC is a wipe. The Standard day shows the
  same: with today's hard fight (2 Elites + 2 Standards) the stand-in party clears 22% of the days at level 1 (37-52% at levels 5 and 10);
  with a CV 5 hard fight (Elite + 3 Standards) 77% (90-96% at levels 5 and 10). **Elites count for more than CV 2**: the same CV with Elites
  takes 8-23 points more of the party's Health (at CV 4, a PC goes Down in 47% of the fights instead of 17%) (for E3).

**3. The level gap: about ×0.9 a level, not ×0.8, and it follows a formula.** How many Standards of a lower level make the same fight as 4 of the
party's level (CV each):

| Party level → NPC level | 1 below | 2 below | 3 below | 4 below |
|---|---:|---:|---:|---:|
| A, party level 5 | 0.85 | 0.79 | 0.78 | 0.76 |
| A, party level 10 | 1.00 | 0.98 | 0.77 | 0.77 |
| B, party level 10 | 0.90 | 0.90 | 0.76 | 0.75 |
| C, party level 5 | 0.85 | 0.78 | 0.68 | 0.64 |

  The CV of an NPC is **√(its Health × its damage ÷ those of an NPC of the party's level)** (Lanchester's square law: a side's strength grows
  with its numbers squared); the prediction is within about 0.05 of every measured value (progression.md section 4). In model A the NPCs
  change only at the tier steps, so **the gap is a tier gap**: same tier ×1, one tier below ×0.8, two tiers below about ×0.65. The ×0.8 a
  level of the brainstorm needs NPCs that grow about 25% a level in both Health and damage (number bloat).

**4. Weapon user and caster (same level 1 budget).** Damage a round against one target; "fight" = rounds 1-3 + half of round 4; caster / weapon user:

| | round 1 | the fight |
|---|---:|---:|
| A, level 1 (floor / no floor) | 111% / 105% | 104% / 102% |
| A, level 5 | 111% / 106% | 104% / 100% |
| A, level 10 (2[W] against keep the best) | 101% / 98% | **87% / 85%** |
| B, level 5 (the weapon user's hold passive) | 108% / 101% | **96% / 91%** |
| B, level 10 | 100% / 94% | **83% / 78%** |
| C, level 10 | 112% / 107% | 104% / 100% |

  - **Round 1 is never the caster's problem** when a spell with 0 Overcast is on its band: the weapon user holds its Escalation for its
    passive and grows over the fight (23.1 → 29.5 in rounds 2-4 at level 1), the caster spends it as it comes and stays
    flat (about 26). The caster's round 1 is 94-112% of the weapon user's in every case; the brainstorm's check (at least 90%) holds **without**
    the floor.
  - **The floor** (once a fight, Overcast 1 without Escalation) adds 2-5 to round 1 and 2-5% to the fight: with equal budgets it puts the
    caster a little ahead.
  - **The Overcast limit** only matters for the Escalation a caster starts with (Momentum): after round 1 it gains 1 a round and spends 1.
    Limit 3 instead of 1 at level 1: round 1 117% instead of 111%, the fight 106% instead of 104%. The tier limits (1 / 2 / 3) are fine.
  - **Free growth doesn't match: Mastery 2[W] is worth +31% of the weapon user's fight, keep the best +10% of the caster's.** At level 8
    (progression.md section 6), against the weapon user with 2[W]: the caster with nothing 79%, keep the best 1 extra die 87%, 2 dice 92%,
    3 dice 96%, **"Spell Mastery" (+1 Power die where a weapon gets its second [W]: +1d8 at Tier 2, +2d6 at Tier 3) 103%**.
  - **B's hold passive** for weapon users (Empowered 1 while Escalation 2+) has no caster counterpart (the brainstorm: few hold passives for
    casters), so B leaves casters behind from level 5.

**5. Rally Points grow with level** (the book's formula: +1 every 2 levels, each heals a quarter of the Pool): 30 for the party at level 1,
38 at level 5, 48 at level 10. Days get easier with level in every model (77% → 90-96% cleared on the proposed scale). Not a problem to fix now (E3 can
weigh it).

## 4. Recommendation (the defaults of section 5)

**Model A, Bounded**, with three fixes from the numbers:

1. **Steps at the tier starts:** Modifier +3 at level 5, +4 at level 8; **Mastery 2[W] and Spell Mastery at level 8** (both: +1 die on the
   Actions that deal [W] or Power dice; a Talent or a class Feature, D2 decides which). Health factor (Level + 17) / 16. Between the steps,
   levels add options (Picks and Talents are sidegrades), Health and the tier's Escalation (Momentum 2 at level 3, 3 at level 8; Overcast 2 at
   level 5, 3 at level 8).
2. **Keep the best is a Magic Talent** (with Wild Magic's exploding dice), not the free growth: at +10% it can't match 2[W].
3. **The round-1 floor is a Magic Talent**, not a class rule: casters don't need it when a 0-Overcast spell is on its band.

And two rules that follow in any model:

4. **Difficulty by CV a PC: easy 3/4, standard 1, hard 1 1/4, deadly 1 1/2** (today: hard 1 1/2, deadly 2). Elites get a look in E3.
5. **CV by level gap:** an NPC's CV × √(its level's Health and damage factors ÷ the party level's). In model A that is **by tier: same
   tier ×1, one tier below ×0.8, two tiers below ×0.65** (the Bestiary can print it as a small table).

**What it sets for A1 (the Archer):** levels 1 to 3 are one tier: **no sustained growth from level 1 to 3** (the charter's +10% a level is
replaced, decided; this answers E2's open question: neither the class nor its Talents add sustained damage inside a tier). The Archer's
budgets are the charter's at every level of tier 1 (sustained 100-105% of the baseline, Nova 110-130%, Health 80-85%); level 2 and 3 add the
Encounter / Daily Picks (the Nova) and options. **For E3:** NPC Health ×1.22 at levels 1-4 for 3.5-round standard fights (against these
stand-ins; E3 measures it with the real classes), ×1.17 more at level 5, ×1.38 more at level 8; NPC damage × the PCs' Health factor; the
CV scale of 4; Elites.

## 5. Decision sheet (Lucas 2026-10-29: all defaults)

1. **The model:** A (Bounded, steps at levels 5 and 8), B (Escalation-heavy) or C (+10% a level)? **[A]**
2. **Difficulty by CV a PC:** easy 3/4, standard 1, **hard 1 1/4, deadly 1 1/2** (instead of 1 1/2 and 2)? **[yes]**
3. **Casters' free growth:** Spell Mastery (+1 Power die) at the same level as Mastery 2[W], and keep the best becomes a Magic Talent? **[yes]**
4. **The round-1 floor:** a Magic Talent only (not every magic-first class)? **[yes]**
5. **CV by level gap:** by tier in model A (×1 / ×0.8 / ×0.65), from the √ formula? **[yes]**

## 6. Assumptions I made

- The Modifier steps are at the tier starts (levels 5 and 8), and 2[W] / keep the best at level 8 (the brainstorm said "a high step").
- Health ×1.5 at level 10 means ×1.5 of level 1 (level 1 keeps ×1.1): the factor goes 1.1 → 1.65.
- The stand-ins: a Greatsword weapon user and a caster with the same dice, Overcast +1 die (d8) per Escalation, Killer and Surge as the weapon
  user's Escalation pair; an Encounter Nova (Wrath / Blast, like Holy Wrath) from level 1 and a Daily (Ruin / Cataclysm, 4d8-10d8) from level 3,
  the Daily only in a hard fight (CV 1.25 a PC or more). No support (no heals for allies, no Hallowed Stance).
- B's numbers (1d8 / 2d6 / 2d8 a point of Escalation; Empowered 1 at level 5) and C's flat damage factor are my choices to represent those ideas.
- NPC damage grows with the PCs' Health (so a hit takes the same share at every level). Standard fights lose 33% of the party's Health (the
  book's target is about 40%: E3 can raise NPC damage a little).
- Half the fights start with Momentum (the charter's Standard day).
- `spec.mjs` learned four opt-in lines for this (`health-factor`, `damage-scale`, `keep-best N <traits>`, `overcast-floor N`) and one rule:
  an Action whose Escalation you don't have falls back to a cheaper Version of it (Bolt 3 → Bolt 2...). The class files and report.md don't change.

## 7. Not measured

Levels above 10; Talents (priced on their own); support classes' growth (heals and Defense grow with Health and Rally Points, not modeled);
spells' areas and effects (only damage); Wild Magic; a magic-first class's Magic Talents; Large NPCs, walls and terrain (E2's open field).
