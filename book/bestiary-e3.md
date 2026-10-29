# Bestiary refit (pack E3, 2026-10-29): PROPOSED

> **Nothing here is in `book/rules-src` yet.** This is the proposal with its numbers and a decision sheet (section 6). Once Lucas answers, the
> Bestiary, the Core Rules (Health factor, Modifier steps) and the glossary change together, and Foundry follows (foundry-backlog.md).

It applies LV's decisions (`book/progression-lv.md`: model A; 3.5-round standard fights; difficulty by CV a PC easy ¾, standard 1,
hard 1¼, deadly 1½; CV by tier gap ×1 / ×0.8 / ×0.65; the Health factor (Level + 17) / 16 with the Modifier steps at levels 5 and 8), measured
with **the real classes**: the P1 Paladin and the A1 Archer.

The numbers: `node book/ruler/bestiary.mjs` (about 23 minutes; `--quick` about 7) writes **`book/ruler/bestiary.md`** (all the tables; this
file quotes them).

## 1. How it was measured

- **Two parties a level (1-3):** 2 P1 Paladins (Smite) + 2 A1 Archers with **Double Shot**, and the same with **Rolling Shot**
  (`classes/paladin-smite-N`, `archer-double-N`, `archer-rolling-N`). Each number is the mean of the two. A mixed party (Smite, Lay On Hands,
  Double Shot, Rolling Shot) is a check.
- **On the map** (E2): positions, closing in, kiting, Cover, the [Ranged] Banes, Momentum in half the fights, a Daily only in a hard fight
  (CV 1¼ a PC or more). The PCs' Health uses the decided factor **(Level + 17) / 16**.
- **NPCs:** the level 1 Bestiary (Medium, Foundry's default ratings) with Health and damage × the factors. Defense and Modifier never change
  (decided: flat accuracy). The simulator now rolls an NPC's **exact table average** (spec.mjs `exact`, opt-in: the nearest dice moved by a flat
  amount), so the tables of section 5 are what was simulated (with the nearest dice, ×1.33 on the table was ×1.45 in play).
- NPC special Actions, Reactions and Escalation are not simulated (only Basic attacks), as in every earlier pack.

## 2. Today: the real classes walk through the Bestiary

| Real classes, today's Bestiary and Health factor | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 4 Standards (the normal fight) | 3.1 r · 22% · Down 8% | 3.4 r · 24% · Down 12% | 3.2 r · 23% · Down 10% |
| 2 Elites + 2 Standards (today's hard) | 5.8 r · 62% · won 85% | 6.4 r · 68% · won 76% | 5.7 r · 56% · won 85% |
| The Standard day (today's scale): cleared | 82% | **71%** | 94% |

(r = rounds; % = the party's Health lost in the fight.) A normal fight costs **22%** of the party's Health (the book says about 40%): the P1
Paladin reduces and guards (Hallowed Stance, Smite 3's Guard, Divine Surge's Guard, Font of Mercy), the A1 Archer kites and has Elusive. Today's
hard fight is a near-wipe, and **level 2 is harder than level 1** (the Bestiary's level 2 rows add 14% Health; the classes don't grow at level 2).

## 3. What the ruler found

**1. The tier 1 refit: NPC Health ×1.10, NPC damage ×1.38** (on today's level 1 tables) make 4 Standards last **3.5 rounds** and cost **33%**
of the party's Health (LV's stand-ins lost 33% too). For the book's 40% NPC damage must go ×1.73: then a normal fight puts a PC Down in 45%
of the fights and the Standard day is cleared 72% of the time (section 4 of bestiary.md). **Proposed: 33%, "about a third"** (question 1).

**2. An Elite counts as about 2.6 Standards, not 2** (2.5 to 2.9, at levels 1 and 3, at both targets: bestiary.md section 4). The reason: a
Standard loses its Strikes when it dies, one by one as the party focuses it; an Elite keeps all 3 Strikes until it dies. **The fix that keeps
the fight's length: Elite damage ×0.75 on top of the refit, which is today's Elite damage (×1.38 × 0.75 = ×1.04)**, Elite Health refitted like
everyone's (Medium 118, was 108). Then Elite + 2 Standards costs 34% (4 Standards: 32%) in 3.6 rounds, 2 Elites 36% in 3.7. Cutting Health
instead shortens the fight to 2.2-3.0 rounds. The other way: keep the numbers and write CV 2½ (question 2).

**3. A Grunt counts as about 0.57 Standards, not ½, and 8 Grunts last 4.5 rounds.** Fix: **Grunt Health ×0.69** (Medium 22 Health, was 26: it
"takes 1 PC turn" again, the role's own line), damage refitted like everyone's: 8 Grunts then last 3.3 rounds and cost 33%. **Minions are fine
at ¼** in a mixed fight (0.24-0.27); 16 Minions alone are worth 0.19 each (they die to any hit; the cap of 4 a PC already limits them). Question 3.

**4. The new CV scale works with the real classes** (the proposal: refit + Elite and Grunt fixes; bestiary.md section 5b):

| Fight (CV) | target | Level 1 | Level 2 | Level 3 |
|---|---:|---|---|---|
| easy: 3 Standards (3) | 2.5 r | 2.6 r · 20% · won 100% | 2.5 r · 19% | 2.4 r · 17% |
| standard: 4 Standards (4) | 3.5 r | 3.5 r · 32% · Down 27% | 3.4 r · 31% | 3.3 r · 27% |
| standard: Elite + 2 Standards (4) | 3.5 r | 3.6 r · 34% · Down 35% | 3.5 r · 32% | 3.3 r · 28% |
| standard: 8 Grunts (4) | 3.5 r | 3.3 r · 33% · Down 20% | 3.3 r · 32% | 3.1 r · 27% |
| standard: 2 Standards + 8 Minions (4) | 3.5 r | 4.1 r · 33% · Down 30% | 4.1 r · 31% | 4.0 r · 28% |
| hard: 5 Standards (5) | 4-4.5 r | 4.8 r · 49% · won 95% | 4.7 r · 46% · won 97% | 4.3 r · 36% · won 99% |
| hard: Elite + 3 Standards (5) | 4-4.5 r | 5.0 r · 50% · won 95% | 4.8 r · 47% · won 98% | 4.3 r · 35% · won 99% |
| deadly: 6 Standards (6) | 5 r | 6.0 r · 70% · won 71% | 6.0 r · 65% · won 79% | 5.5 r · 51% · won 91% |
| deadly: 2 Elites + 2 Standards (6) | 5 r | 6.2 r · 74% · won 66% | 6.3 r · 67% · won 78% | 5.6 r · 51% · won 92% |
| beyond: 8 Standards (today's deadly) | | 4.4 r · 98% · won 7% | 4.9 r · 96% · won 11% | 6.0 r · 87% · won 34% |

  Hard is half a round long at levels 1-2 (no Daily yet: LV found the same) and on target at level 3; deadly lasts about 6 rounds, costs 51-74%
  and is won 66-92% of the time; CV 2 a PC is a wipe. The scale holds.

**5. The Standard day** (easy, standard, standard, hard; Elite + 3 Standards as the hard fight) is cleared **93% / 95% / 100%** at levels
1 / 2 / 3, 1.0-2.0 Downs a day, a third to a half of the Rally Points left (today: 82% / 71% / 94%). **The level 2 problem is gone**: the NPCs don't
grow inside a tier, and the new Health factor takes the PCs' Health from 39 → 40 (L1), 43 → 42 (L2), 46 → 44 (L3) for the Paladin.

**6. A flat tier 1 holds.** The level 3 party against the level 1 numbers: 3.3 rounds, 27% (level 1: 3.5, 32%). Level 3 is a little stronger
(Momentum 2, the Daily Picks, Radiant Zeal): the tier's own growth, accepted in A1. Level 4 can't be measured (no class has it).

**7. Tiers 2 and 3 come from LV** (no class has levels 5+): NPC Health ×1.17 at tier 2 and ×1.61 at tier 3 (of tier 1), damage ×1.22 and ×1.39
(the PCs' Health factor at levels 5 and 8). The √ rule gives an NPC one tier below **×0.84** (from tier 2) or **×0.80** (from tier 3), two tiers
below **×0.67**: the decided ×0.8 / ×0.65.

**8. The mixed party with Lay On Hands loses 20% a normal fight, not 32%** (Health lost is counted after in-fight heals, which spend Rally
Points; its day: 94% / 97% / 100%). The Bestiary is tuned to the damage parties; a healer party has an easier day, as it should.

## 4. Everything that changes, in one place

| What | Today | Proposed |
|---|---|---|
| A normal fight | about 3 rounds, about 40% of the party's Health | **about 3½ rounds, about a third** of the party's Health |
| Difficulty (CV a PC) | ¾ easy, 1 normal, 1½ hard, 2 deadly | ¾ easy, 1 normal, **1¼ hard, 1½ deadly** |
| NPC Health (tier 1) | the tables | **×1.10** (Grunts ×0.75 overall: ×1.10 × 0.69) |
| NPC damage (tier 1) | the tables | **×1.38** (Elites ×1.04 overall: about today's) |
| Medium NPC (all Medium): Health · damage a turn vs AD 13 | Minion 6 · 2.0, Grunt 26 · 4.9, Standard 50 · 8.0, Elite 108 · 17.9 | Minion 6 · 2.7, Grunt 22 · 6.7, Standard 56 · 11.0, Elite 118 · 18.5 |
| Table rows | Levels 1, 2, 3 (each its own numbers; the ratings drift apart a little each level), Level 4 empty | **Tier 1 (levels 1-4), Tier 2 (5-7), Tier 3 (8-10)**; the ratings keep the same steps at every tier |
| A lower-level NPC | not written | **its CV × 0.8 one tier below the party, × 0.65 two tiers below** |
| PC Health factor (Chapter 4) | × (Level ÷ 10 + 1) | **× (Level + 17) ÷ 16** |
| PC Modifiers (Chapter 5) | Attribute ÷ 2 + 1 | **+1 at level 5, +1 more at level 8** (question 5) |
| An NPC's Modifiers | as a PC's | **no level steps** (its tables carry its growth; decided flat accuracy) |

## 5. The book text, as it would read (Bestiary; Core Rules)

### Bestiary, "The targets" (replaces its first paragraph and the table)

Each role has a **CV Multiplier**: an NPC's **Combat Value (CV)** is its role's CV Multiplier, lowered when it is from a lower tier than the
party (see Building an encounter). A typical fight is **4 PCs against enemies with a total CV of 4** (CV 1 per PC). It lasts about **3½ rounds**
and costs the party about **a third of its Health**. A level 1 PC deals about 20 to 25 damage a turn to one creature, and has 27 to 40 Health.

| Role | CV Multiplier | AP a turn | Takes about | Deals about (per turn, to an average PC) |
|---|---|---|---|---|
| **Minion** | ¼ | **3** | one PC hit | 3 |
| **Grunt** | ½ | 5 | 1 PC turn | 6 to 7 |
| **Standard** | 1 | 5 | 2 to 3 PC turns | 10 to 11 |
| **Elite** | 2 | 5 | 5 PC turns | 17 to 18 |

### Bestiary, "Ratings" (the paragraph on levels)

The rows of a table are **tiers**: **Tier 1 (levels 1 to 4), Tier 2 (levels 5 to 7), Tier 3 (levels 8 to 10)**. An NPC uses the row of its own
level's tier, and nothing changes inside a tier. The ratings keep their steps at every tier. Attributes, Defenses and Modifiers don't change.
*(The box "Level 4 and up are empty" and the paragraph on ratings drifting apart each level are removed.)*

### Bestiary, the role tables (Health Multiplier and Basic attack; Attributes and Defense unchanged, their rows become the three tiers)

| Standards | Terrible | Low | Medium | High | Extreme |
|---|---|---|---|---|---|
| Health Multiplier, Tier 1 / 2 / 3 | ×3.75 / ×4.5 / ×6.25 | ×5.75 / ×6.75 / ×9.25 | ×7.75 / ×9 / ×12.5 | ×9.5 / ×11.25 / ×15.5 | ×11.5 / ×13.5 / ×18.5 |
| Basic attack, Tier 1 | 4 / 6 | 5 / 8.5 | 6 / 11 | 7.5 / 13 | 9.5 / 16 |
| Basic attack, Tier 2 | 5 / 7.5 | 6 / 10 | 7.5 / 13.5 | 9.5 / 16 | 12 / 19.5 |
| Basic attack, Tier 3 | 5.5 / 8.5 | 6.5 / 11.5 | 8.5 / 15.5 | 10.5 / 18 | 13.5 / 22 |

With every rating Medium, a Tier 1 standard has **56 Health** (Tier 2: 62, Tier 3: 84). The Minion, Grunt and Elite tables: bestiary.md
section 7 (Tier 1 Medium: Minion ×1, 3 / 5.5, 6 Health; Grunt ×3.75, 4 / 6, 22 Health; Elite ×13.25, 7 / 11, 118 Health).

### Bestiary, "Building an encounter"

Add up the CV of the enemies. **CV 1 per PC is a normal fight**: ¾ is easy, **1¼ is hard, 1½ is deadly**. Many Minions are cheap but act
often: no more than 4 Minions per PC.

**A lower-level NPC counts for less:** the NPCs of a tier are the same at every level of it, so only the tier gap matters.

| The NPC's tier is | Its CV |
|---|---|
| the party's tier | × 1 |
| one tier below | × 0.8 |
| two tiers below | × 0.65 |

An NPC of a higher tier than the party is not a fair fight; if you use one, count it at × 1.25 for one tier above. *(Assumption: √ rule from
the other side; not measured.)*

What the fight model gives for 4 PCs (all ratings Medium, levels 1 to 3):

| Enemies | Rounds | Party Health lost |
|---|---|---|
| 3 Standards (easy) | 2½ | about 20% |
| 4 Standards, or 1 Elite and 2 Standards, or 8 Grunts | 3½ | about a third |
| 5 Standards, or 1 Elite and 3 Standards (hard) | 4½ to 5 | about half |
| 6 Standards, or 2 Elites and 2 Standards (deadly) | 6 | half to three quarters (the party wins about 3 times in 4) |

### Bestiary, example NPCs (Tier 1)

- **Goblin Sneak** (Minion): Health 6 (unchanged). *Rusty Knife* (Medium): about 3 / 5.5 ([Mod] + 1 / 1d6 + [Mod] Pi). *Dirty Trick*: about 3 / 5.5, and Hindered (EoT).
- **Orc Warrior** (Standard): Body Health High (×9.5), Mind Health Low (×5.75): **Health 64** (Body 42, Mind 22). *Cleaver* (Medium): about 6 / 11
  (1d8 + [Mod] / 2d8 + [Mod] Sl). *Brutal Swing* (Low + Moderate = High, 2 AP): about 11 / 18.5, and Prone. *Hold the Line*: about 10.5 / 18 Sl.
- **Ogre Chieftain** (Elite): Health Medium (×13.25): **Health 132** (Body 73, Mind 59). *Club* (High): about 9 / 13.5 (1d10 + [Mod] / 2d10 + [Mod] Bl).
  *Ground Slam* (half of a Medium 3 AP): about 19.5 / 12 / 0, and Prone on Tier 1.

### Core Rules, Chapter 4 (Health Pool)

- **Body Damage Threshold (BDT)** = ((Body + 2) × Body Health Multiplier + Species Body Health) × (Level + 17) ÷ 16
- **Mind Damage Threshold (MDT)** = ((Mind + 2) × Mind Health Multiplier + Species Mind Health) × (Level + 17) ÷ 16

*Example:* a level 4 Human Paladin has Body +2 and Mind +1. BDT = ((2 + 2) × 4 + 3) × 21 ÷ 16 = 24.9, rounded up to **25**. MDT = ((1 + 2) × 4 + 4)
× 21 ÷ 16 = 21, so **21**. Health Pool = **46**.

### Core Rules, Chapter 5 (Weapon, Power and Signature Modifiers)

- **Weapon Modifier** = the higher of the class's two Weapon Attributes ÷ 2 + 1
- **Power Modifier** = the higher of the class's two Power Attributes ÷ 2 + 1

**Your Modifiers grow with your tier:** +1 at level 5 and +1 more at level 8, to at most +4 (the Signature Modifier follows them).
*(With question 5's default: a +3 Modifier at level 1 reaches +4 at level 5 and stops.)*

### Glossary

Combat Value (CV): "its role's CV Multiplier, × 0.8 one tier below the party, × 0.65 two tiers below". Elite "about 118 Health at Tier 1",
Grunt "about 22", Standard "about 56". New entry **Tier (levels)**: levels 1-4, 5-7, 8-10; the Bestiary's rows, the Modifier steps.

## 6. Decision sheet (defaults in brackets)

1. **A normal fight costs about a third of the party's Health** (NPC Health ×1.10, damage ×1.38), not the book's 40% (damage ×1.73: a PC Down in
   45% of normal fights, the Standard day cleared 72%)? **[a third]**
2. **Elites:** keep CV 2 and give them **today's damage** (the refit's ×0.75), or keep the refit's numbers and write **CV 2½**? **[today's damage, CV 2]**
3. **Grunts:** Health ×0.69 (Medium 22, "1 PC turn") so they are CV ½ again; Minions stay ¼? **[yes]**
4. **The tables by tier** (Tier 1 levels 1-4, Tier 2 5-7, Tier 3 8-10; same rating steps at every tier; tiers 2-3 from LV until those
   levels exist), and **CV × 0.8 / × 0.65** for an NPC one or two tiers below? **[yes]**
5. **The Modifier steps:** +1 at level 5 and +1 at level 8, **never above +4** (the brainstorm's "at most +4": a PC who starts at +3 gains
   only +1), or no cap (a +3 start reaches +5)? NPCs get no step either way. **[never above +4]**
6. **Also from E2 (optional): the condition steps measured on the PCs**: Prone and Slowed 1 become **Severe** (they cost an AP: about
   3 steps), Slowed 2 Severe + 1 step, Pushed 3 or more **Mild**, Immobilized until it escapes **Moderate**? Or leave the condition table for
   later (Options step)? **[apply them now]**

## 7. Assumptions I made

- The measurement parties are 2 Smite Paladins + 2 Archers (Double Shot, Rolling Shot), as Lucas named; the Lay On Hands party is only a check.
- The Elite fix is on damage (it keeps the fight's length); the Grunt fix is on Health (it keeps the role's "1 PC turn" and the fight's length).
- NPC damage is flat inside a tier, though the PCs' Health grows about 5% a level: a level 4 fight costs a little less than a level 1 fight.
- An NPC of a higher tier than the party: × 1.25 (the √ rule the other way); not measured.
- The "Deals about" column is the Medium NPC's Basic attacks a turn against AD 13 (Body High, Foundry's default), rounded.
- spec.mjs learned one opt-in NPC flag (`exact`: the table's average, not the nearest dice); report.md, prices.md and progression.md don't
  use it, so they don't change.

## 8. Not measured

Levels 4-10 with real classes (none exist); NPC special Actions, Reactions and Escalation; Large NPCs, walls and terrain; ranged NPCs;
ratings other than Medium (the steps are today's); a party of other classes.

## 9. Then

Once answered: the Bestiary (14-bestiary.md), Chapter 4 (Health), Chapter 5 (Modifiers), the glossary; `build_rules.py` (0 unresolved refs);
rules-backlog. **Foundry** (a version of its own, or with pack C): config.mjs `npcRoles` / `npcRatings` / the tier factors (no more
`npcBump` / `npcMeasured`; `npcTableLevel` becomes the tier), the Builder's level → tier, the PC Health factor (actor.mjs) and the Modifier
steps; tests for the tables.
