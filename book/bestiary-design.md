# The Bestiary: the design record

> **Status (2026-11-25): THE REDESIGN HAS BEGUN. Decisions 1 to 4 (the frame) and 12 to 15 are taken. The benchmark is the plain PC, never a class (Lucas: "we should compare to the core"). The Default Standard: Defenses 13 / 13, Modifiers +2 / +2, Health 36, a Basic attack of nothing / 3 / 6, a 2 AP Special of nothing / 7 / 11, about 8 damage to Health a turn at the table. Next: decision 16, to the table. Nothing is in the book yet: Chapter 14 stays as placeholders until the Default Standard has been played.** This file is the Bestiary's record, the way `magic-design.md` is magic's and `talents-design.md` the Talents': his words, what stays, what the core gives a monster to be measured against, the research, the problems, the order of the decisions, then each decision as it is taken. It is batches 6 and 7 of `core-rework.md` (section P).

---

## 1. Lucas's words

- **2026-11-25, opening this piece:** "We will need to work on the bestiary. Dont consider any number from the bestiary. Keep only the rules (like items are mainly only flavor, actions are their own action, not copying PCs, standard = 1 PC = 100 CV, minions have ticks, not hp, etc). Number will be from the ground up."
- **The research he asked for:** "Search how in ttrpgs people like about enemies, minions, enemies above and below level. Compare to the core 2d12, see monster building from PF2e, 4e, Draw Steel on their own rules. See other tactical systems that have good monster building, balance reputation."
- **How we build:** "Then we will build slowly, one by one, numbers. We need to decide what comes first in the design as well: Numbers, roles/ranks, what do we compare them to, what defines a difficulty of an encounter (here i am guessing is Rally points uses/hp lost)."
- **2026-11-25, after the research:** "Lets take what the research found is the best way forward and begin the redesign now." Read as: where the research gives an answer, that answer is the decision (his to revert, like any default); where it doesn't, the decision is still asked.
- **2026-11-25, on what a monster is compared to:** "I see you are mostly comparing to the two current classes, we should compare to the core. If a party has no paladin for example, there is no judge and shield of faith, less guard etc. We dont want people to be forced to play certain roles, maybe no one wants to play a front-line HP support like the Paladin." **A standing test from now on (P11): a monster's number never assumes a class.**
- **2026-11-25, on levels:** "NPcs will also have levels. These are Stage 0 Level 1 enemies. Level is mainly guidance, since PCs get stronger in the sense of more options (talents, magic, equipment, mastery...) NPCs need to get also horizontaly stronger." **A creature's level adds options (Actions, riders, Features), never a number on a roll or a Defense; the Orc Warrior, the Grave Wisp and the Goblin Sneak are level 1.**
- **2026-11-25, on a monster's Tier 1:** nothing by default, "but some creature can do something on a tier 1, we can get to that when designing the enemies."
- **2026-11-21, the core rework** (`core-rework.md`, G1): keep ranks, roles, sheets; rebuild the numbers; mechanics first, the tables later. I4: he distrusts the SIM's white-room numbers; measure at the table.
- **2026-11-21** (H9): classes have a better chance of "shutting down" than Talents, but never shut a boss down.
- **The system's standing tests (CLAUDE.md):** fun, engaging, tactical, **the least ambiguity possible**; growth is horizontal (a level gives options, never a number on a roll or a DC).

---

## 2. What stays (rules, no numbers)

From Chapter 14 as it stands and from `core-rework.md` section G. Everything here is a rule or a decided direction; every table, CV step, price and example number of Chapter 14 is set aside (they stay in the book until their replacements are written, as placeholders nobody argues from).

### The frame

- **An NPC's items are flavor and loot.** Its Health, Defenses and damage never come from its weapons or armor. A [Weapon] Action needs the weapon its entry describes; the weapon gives the Action its nature, not its numbers.
- **An NPC's Actions are its own**, written for it, never copies of PC cards. No set list: as many Actions and Reactions as the GM wants, of any AP cost and Frequency.
- **A Standard is one PC: CV 100.** An encounter is counted in CV against the number of PCs.
- **Ranks (G2, decided): Minion, Grunt, Standard, Elite, Boss.** Minion: fodder. Grunt: weaker than a PC. Standard: on level. Elite: above. Boss: for a single-boss or boss + 1 to 2 fight, with its own turn mechanic (open: Nimble's one turn per PC, or Draw Steel's two turns).
- **Roles** are ready sets of ratings to start from and a way to play the creature, with no rules of their own (Striker, Soldier, Skirmisher, Artillery, Controller, Leader today).
- **Ratings** (Terrible, Low, Medium, High, Extreme) are guidance, not a rule.
- **An NPC has a level**, and its level's Stage sets its tables; inside a Stage nothing changes but complexity.

### Minions (G3, decided)

- **Ticks, not Health.** A Tier removes that many ticks (1 / 2 / 3); most Minions have 2. One tick reduction per Action (its Forced Movement damage doesn't tick again; Lingering apart). **No overflow.**
- A Minion with 1 tick left counts as Bloodied or Strained, by the damage that caused it (K1).
- Minions share turns (squads of up to 3 in one slot). Minions flank (D2).
- **Open inside it (K2):** what a Save Action removes, a 0 after reductions, an area on a squad, a rider with no damage.

### An NPC's turn and Actions

- **Three choices on every attack:** the Defense it attacks (Armor or Ward), the Modifier it rolls (Weapon or Power), the pool it damages ([V] or [R]). Some creatures deal only [R].
- **The Basic attack:** every NPC has one (1 AP, At-will); it takes the place of the PCs' Basic Attack card wherever a rule calls for one. Every other Basic Action is theirs too, except Steel Yourself (no Rally Points).
- **No NPC has a Reaction by default; a Reaction is designed for each enemy** (G5). No generic Reaction-AP rule.
- **NPCs play by the PCs' rules; each NPC-only rule is kept or dropped case by case, with a reason** (G4, K7): Minions' and Grunts' 3 AP, no Guard from unspent AP, Minions' no Reactions.
- **Specials can hit up to two creatures, but not all of them do** (G6).
- **Every NPC has an answer to the back line** (D8).
- **NPCs going Down:** they die or fall Unconscious; none is Dying. Bloodied and Strained work as for anyone (Speed and Steadiness; no Reaction Point).
- **Speed, Size and Steadiness** are free, balanced inside the creature (a fast creature pays with a downside).
- Riders, Setup and Effect lines, Bloodied: and Strained: lines, Frequencies: the card Structure is the same as a PC card's.

### Kept aside for the rebuild (G10, G11)

Elite Escalation (Lucas, 2026-11-25: deprecated), the rider price list, Frequency pricing, the best-turn check, the turn budget in points. **Ranks must differ by more than Health.** A simpler pricing (ready lines per rank and AP) is preferred to the points engine (G11).

### Already decided as targets (to confirm or replace in section 6)

- **G9 (decided with C8):** an easy fight costs about 25% of the party's Health, a normal one 35 to 45%, a hard one 55 to 65%.
- **C8 (a rough guide):** between Rests about 2 easy, 2 moderate, 1 hard fight.
- **G8 (changed 2026-11-21):** for the playtest, one number for each stat: a "Default Standard" and a "Default Elite"; the roles' variations after.
- **Playtest 8** (section P): level 1 (Stage 0), playtest 7's line-up rebuilt plus two Grunts, measured by the Encounter Log.

---

## 3. What the core gives a monster to be measured against

These are the PC side's facts, from the rules as they stand on this branch (2026-11-25, v0.0.507: after batches 1 to 4 and batch 5's first step, no Arts and no Escalation Passives). They are exact dice math or a card's arithmetic, not the SIM.

### The roll

2d12 + Modifier against a DC; a 12 counts 11 and rolls again; Doubles raise the Tier; Tier 3 is DC + 7. Exact odds (a Critical counted apart: Doubles on a Tier 3, or 20 above the DC):

| Modifier vs DC | Tier 1 | Tier 2 | Tier 3 | Critical |
|---|---:|---:|---:|---:|
| +2 vs 11 | 16.7% | 46.5% | 30.5% | 6.3% |
| +2 vs 12 | 22.2% | 45.6% | 27.2% | 5.0% |
| **+2 vs 13** | **27.8%** | **45.5%** | **22.3%** | **4.5%** |
| +2 vs 14 | 34.7% | 42.0% | 19.9% | 3.4% |
| +2 vs 15 | 41.7% | 39.4% | 15.9% | 3.0% |
| +2 vs 16 | 48.7% | 34.6% | 14.5% | 2.1% |
| +1 vs 13 | 34.7% | 42.0% | 19.9% | 3.4% |
| +3 vs 13 | 22.2% | 45.6% | 27.2% | 5.0% |

- **One point is about 6 to 7 points of Tier 1** around the middle (a +1, a Boon, a point of Defense, all the same step). From DC 11 to DC 16 a level 1 PC's Tier 1 goes from 17% to 49%: the whole range of a d20 game's "four levels above or below" fits in five points of Defense.
- **The Modifier is nearly flat** (+1 to +4 over the whole game; +2 and +1 at level 1). A monster "above the party" can't be made by its numbers running away from the PCs' roll, the way Pathfinder 2e and D&D 4e do it. What is left to make it stronger: Health, damage, AP and turns, its Actions, and a point or two of Defense.
- A die written dN! averages N ÷ 2 + 1 (1d4! 3, 1d6! 4, 1d8! 5, 1d10! 6).

### A level 1 PC

| | Paladin | Archer |
|---|---|---|
| Health Pool | about 35 (Vigor 23, Resolve 12, or the reverse) | about 29 |
| Rally Points a Rest | 7, each removing 9 | 6, each removing 8 |
| The day's total (Health + Rally Points) | about 98: 2.8 × Health | about 77: 2.7 × Health |
| Best Modifier | +2 (the other +1) | +2 (the other +1) |
| AP | 4 + the Reaction Point | 4 + the Reaction Point |

- **A PC's turn on paper and at the table:** decision 4 (section 7) has the numbers. On paper the four pregens average 24 a turn against Defense 13; playtest 7 measured about three quarters of its day's paper number.
- **Stays to re-read:** Steady Draw's dE line (once an encounter, to decide), the Escalation 3 abilities of level 2 (batch 5's next decisions).

### The fight's clocks

- **Escalation** rises 1 a round (1 to 6), from 1 + Momentum; it unlocks class Actions (batch 5): the PCs get stronger each round. Momentum (0 to 4) grows with each encounter won before a Rest, and drops by 1 each time a PC goes Down.
- **Rally Points** come back only at a Rest (a day in a safe place). Steel Yourself spends them in a fight for AP (1 AP for 1, 2 AP for 2). A Down PC rolls a Wound.
- **Zipper Initiative:** sides alternate, one creature at a time; a side with more creatures has its extra turns at the end of the round.
- **Focus is cheap:** nothing but position stops every enemy striking one PC; Guard, Judge and Shield of Faith are the PCs' answers.

---

## 4. The research (done, 2026-11-25)

Six independent researchers, one pass each, about 40,000 words in `research/raw/2026-11-25-*.md`; three notes sum them up. Other games' rules and other people's opinions, never 2d12's.

| Note | What it holds |
|---|---|
| `research/monster-building.md` | Pathfinder 2e, D&D 4e, 13th Age, Draw Steel, Lancer, ICON, Nimble, Daggerheart and the 5e fixes: how a stronger enemy is made (level or rank), the standard monster against a PC, ranks as multiples, fodder, the enemy that fights alone, the monsters' side rising, how the encounter is counted, what was retuned after play |
| `research/enemies-at-the-table.md` | What players and GMs like and dislike: enemies in general, minions (with the one real poll), solo bosses and each fix's verdict, enemies above and below level, elites, the rank under a Standard |
| `research/encounter-difficulty.md` | What defines difficulty (every rulebook: resources at the easy end, a PC dying at the hard end), the eight yardsticks, the day, length; the order monster math is built in, and the common skeleton |

**How far to trust it.** Rules text was read on its page for Pathfinder 2e, Draw Steel, 13th Age, ICON 1.5, Nimble and Daggerheart; 4e's numbers come from its analysts and its designers' blogs. **Designers almost never state their order of design or their targets:** part of the "order" is analysts' reconstruction. Opinions are EN World's regulars and a few well-known blogs; Reddit, RPG.net, paizo.com and MCDM's own posts did not open.

### The twelve findings that bear most on 2d12

1. **A stronger enemy is made in one of two ways: by level (it is harder to hit and hits more) or by rank on a flat roll (Health, damage, turns, targets).** 2d12's roll is flat, so it is in the second family with Draw Steel, Lancer, ICON and Daggerheart. The first family's most repeated complaint, the PCs' abilities stopping working against a boss, can't happen here unless rank raises Defense.
2. **"One monster a PC" is the unit almost everywhere, and it is the fight the party is meant to win** (4e, 13th Age, Draw Steel), never an even match and never equal numbers: the gap between the two sides is the difficulty.
3. **Every rulebook defines difficulty with two yardsticks: resources spent at the easy end, a character dropping at the hard end.** None uses a percentage of hit points; analysts do, and it is the only one that can be calibrated from play. A pooled total hides a drop.
4. **Where a healing pool exists, the day is three to five fights.**
5. **A standard monster is built from the fight:** its hit points are the rounds wanted times the damage the party lands; its damage is the share of the party's hit points the fight should cost, spread over those rounds. The commonest target is three rounds, and a standard dies to about three or four hits.
6. **Ranks multiply staying power by their budget share and raise threat through actions or targets, not damage a hit.** Roles are small offsets on the standard's row; 4e's first role numbers, set by symmetry, were undone.
7. **Every retune on record went the same way: fewer hit points, more damage, fewer or cheaper turns for the big monster** (4e in 2009 and 2010, 13th Age's speed-up, Draw Steel's solos).
8. **Minions: the idea is loved more than any rule for it.** The top complaint is damage that needs no roll killing them for free (37% in the one poll), then the wasted big hit. The house rule tables converged on is Lucas's ticks: a weak hit wounds, a strong hit kills, a second hit always kills. ICON's mobs take "two hits". The exchange rate is what every game changed (4e's four to a standard was overstated by its own designer's account; 13th Age three to five; Draw Steel eight to a hero; Nimble leaves them out of the budget).
9. **Draw Steel capped a squad's focus on one hero** after a draft where one squad's turn nearly dropped a hero.
10. **The enemy that fights alone: more turns, and a protection the boss visibly pays for, are accepted; a free negation is the most disliked rule in the sample.** The bosses tied to the number of PCs (ICON, Nimble, the Angry GM, Giffyglyph) get better verdicts than a fixed two or three turns.
11. **Elites are noticed only when they have a job.** Otherwise: "longer, not different".
12. **The heroes' side rising in a fight is either the design (13th Age: monsters built ahead of round 1 and behind round 4, so fights tip and end) or a gap to fill (Draw Steel added Malice late because monsters were "too weak at the tail end").**

---

## 5. 2d12 beside them

### Piece by piece

| 2d12 has | Closest relatives | What the record says | What it leaves open |
|---|---|---|---|
| **A nearly flat roll; ranks, not levels** | Draw Steel, Lancer, ICON | No "whiff" boss by construction. The price: "more hit points alone is boring" | Whether a rank touches Defense or Modifier at all (4e took the defense bonuses off elites and solos in 2009) |
| **Three Tiers, a real Tier 1** (a level 1 PC: 28 to 35% against DC 13) | Between Draw Steel (nothing misses) and the d20 games | A wasted turn hurts in proportion to the wait for the next one | What a monster's Tier 1 does (Bilsland: a role's effect should work even on a miss); how long the GM's side takes between two PC turns |
| **Rally Points** (a quarter of Health each, 6 or 7 a Rest) | 4e's healing surges, Draw Steel's Recoveries | The day is the budget; 3 to 5 fights a rest elsewhere | C8's five fights are at the top of that range |
| **A Standard = one PC = CV 100; CV 100 a PC is a normal fight** | 4e, 13th Age, Draw Steel | Holds: it is the unit and the fight the party wins | |
| **CV as one number, with zipper Initiative** | Scalar budgets (XP, Encounter Value) | A scalar needs a second rule for one big enemy and for a swarm; games that count bodies (Lancer, ICON) balance turns | With the zipper, a side with fewer bodies watches the other side take its spare turns in a row. Does CV count Health and damage only, or turns too? |
| **Minions with ticks, no overflow** | The two-hit house rule; ICON's mobs | Holds up well: it answers "a low roll kills" and "the big hit is wasted" at once. Nobody complained of a missing overflow as such; on a grid overflow is refused or bounded | K2 (damage with no roll, areas, Saves: the top complaint lives there); a squad's focus on one PC; a Minion's damage for its price; the exchange rate; saying openly which enemies are Minions |
| **The Grunt** | Draw Steel's horde, 13th Age's weakling | The rank tables asked for before games printed it | What tells a Grunt from a 3-tick Minion at the table |
| **The Elite** | 4e's elite, Draw Steel's elite, ICON's Elite | Everywhere: twice the staying power, and two attacks, two targets or two turns | K6: its "something beyond Health" (the two turns went to the Boss) |
| **The Boss, its turn rule open** | Draw Steel's solo, Nimble's Legendary, ICON's Legend | Turns tied to the number of PCs are the best received; the zipper already alternates sides, so "a turn after each PC" is what a Boss worth four PCs would get anyway | Turns a round and AP a turn; Health a PC; the rule against shutdown (H9); what it does at Bloodied and at Strained |
| **Bloodied and Strained on every creature** | 4e's bloodied; Nimble's Bloodied and Last Stand; the Angry GM's stacked pools | A visible change in the fight is among the most praised features; a boss shedding conditions when a pool empties is an accepted protection | Whether a creature changes at either line (the Elite, the Boss) |
| **Escalation for PCs only** (Elite Escalation deprecated) | 13th Age's escalation die | A fight that tips toward the PCs ends itself | Whether the monsters' side rises too, and from what (the round, damage taken, Momentum) |
| **Momentum** | Draw Steel's Victories | Draw Steel raises the budget by one hero for every 2 Victories; 13th Age only counts fights | Whether the budget follows Momentum or ignores it |
| **Roles as ready ratings** | Pathfinder 2e's road maps | Criticised as "colorless" when ratings are all a role is; 13th Age uses one stat line and makes roles a job | G8 already puts roles after the Default Standard |
| **G9's targets** (25% / 35 to 45% / 55 to 65%) | Tom Dunn's reading of 5e (15 / 30 / 45 / 70%); 3e's 20% | Higher than both, as fits a game with a healing pool; the spread around an average is wide | The same targets in Rally Points, and the Down line beside them |
| **The points engine** | Nothing like it elsewhere | 13th Age says in its rules that special abilities are outside the math | G11 (ready lines) agrees with the record |

### The traps, as tests for every number

| # | The trap | From | The test |
|---|---|---|---|
| P1 | **The grind** | 4e 2008; every retune | Would this fight still be going after it is decided? When in doubt: less Health, more damage |
| P2 | **A rank that is only Health** | elites everywhere; G10 | What does this rank do that the one below can't? |
| P3 | **The whiff boss** | Pathfinder 2e, 4e | Does a higher rank make the PCs' own cards work less often? |
| P4 | **The shutdown and the free negation** | 4e solos; 5e's legendary resistance | When a PC's control lands on the Boss: does it still do something, does the Boss visibly pay, did the players know before? |
| P5 | **Fodder that is free, wasted, or deadly in a pack** | 4e, Lancer, Draw Steel's draft | What does damage with no roll do to ticks? What can one squad do to one PC in one slot? |
| P6 | **The average that hides a drop** | Abadia | Is the Down counted beside the average? |
| P7 | **A benchmark that drifts** | Mearls on 4e and 5e | Which PC, which Actions, paper or table, and re-read when the classes change |
| P8 | **A budget that lies** | 5e 2014, Weird Wizard | Does CV see turns? Is what it can't see said in the rule? |
| P9 | **The GM's load** | "about three stat blocks" a fight | How many different blocks and Actions does one fight put before the GM (here Lucas alone, on every side)? |
| P10 | **A party state the budget assumes** | the fifteen-minute day; fresh parties | Is the fight built for a fresh party or a fifth fight, and does Momentum enter? |
| P11 | **A number that assumes a class** | Lucas, 2026-11-25 | Is this number still right for a party with no Paladin (no Judge, no Shield of Faith, no Lay On Hands)? What a class adds must show as a fight cheaper or shorter than its band, never be priced into the monster |

### Two arithmetic notes on what is already decided

- **G9 and C8 in Rally Points.** A Rally Point removes a quarter of a PC's Health, so a fight's cost reads directly as Rally Points a PC: easy about 1, normal about 1½ (1.4 to 1.8), hard about 2½ (2.2 to 2.6). C8's five fights (2 easy, 2 normal, 1 hard) cost 7.0 to 8.2 Rally Points a PC, against 6 or 7 a Rest: **the guide spends the whole pool, and the fifth fight ends with none left and the party below full Health.** That may be what is wanted (Momentum makes the late fights easier); it is the first thing to confirm.
- **Ticks against the roll.** A level 1 PC's Basic Attack (+2, against DC 13, Tier 1 dealing damage) kills a 2-tick Minion in about 1.3 attacks and a 3-tick one in about 1.8. Against a 2-tick Minion Tier 2 and Tier 3 are the same result: the Tier only matters at 3 ticks.

---

## 6. The order (Claude's proposal; one decision at a time)

Lucas's question: what comes first, numbers, roles and ranks, what we compare them to, or what defines difficulty. **The record's answer, and mine: the measure first, then the fight, then the PC it is measured against, then one monster's numbers, then the ranks as multiples of it, then the roles around it, then the budget's bands, then the pricing of Actions.** Roles come late (G8 already says so); ranks' mechanics need no number and can be settled before the Standard's numbers (G1: mechanics first), but their numbers hang on the Standard.

### A. The frame (words, no monster number)

| # | Decision | Why first | Claude's default |
|---|---|---|---|
| **1** | **What a fight's difficulty is measured by** | Every later number is checked against it, and playtest 8's log must record it | **Two things together: the cost in Rally Points a PC** (all damage that reached Health in the fight, healed or not, divided by what a Rally Point removes), **and whether a PC went Down.** Lucas's guess is the first half; the Down is the half a total hides (P6), and in 2d12 it already costs a Wound roll and a Momentum |
| 2 | **Each band in a sentence** (easy, normal, hard, deadly), and the day | A band must promise something a table can see | G9 restated in Rally Points, a Down line for each band, and C8 confirmed against 6 or 7 Rally Points |
| 3 | **The normal fight's shape:** one Standard a PC that the party wins; how many rounds; fresh party or mid-day; does Momentum change the budget | Health and damage are both read off the rounds | Three to four rounds (Escalation's ladder needs the fight to reach round 3); built for a fresh party at Momentum 0; Momentum is the party's reward and the budget ignores it, with one line of advice |
| 4 | **The benchmark PC:** which PCs, which turn, paper or table | It is what "a Standard takes N PC turns" means (P7) | The four playtest pregens at level 1; their turn as measured at the table (the Encounter Log), with the paper number beside it; frozen under a name, re-read when the classes change. **Waits for the class change to land** |

### B. The ranks' mechanics (batch 6 of `core-rework.md`; no numbers)

5. **Parity, case by case (K7):** the 3 AP of Minions and Grunts, no Guard from unspent AP, Minions' Reactions.
6. **Minions (G3, K2):** what removes a tick (Saves, areas, damage with no roll, a 0 after reductions, a rider alone); what one squad may do to one PC in a slot; whether Minions are announced.
7. **The Grunt:** what it is for, beside a 3-tick Minion.
8. **The Elite (K6):** its something beyond Health (two targets, a Reaction made for it, a change at Bloodied or Strained, a job).
9. **The Boss (G2, H9):** turns tied to the number of PCs or a fixed two; AP a turn; the rule against shutdown; what happens at Bloodied and at Strained.
10. **Does the monsters' side rise** during a fight, and does a fight end before the last enemy (morale, a rout).
11. **What a monster's Tier 1 does**, and whether a monster's damage is rolled or fixed.

### C. The numbers (batch 7), one at a time

12. **The two hit rates:** the Default Standard's Defenses (how often the benchmark PC gets a Tier 1 against it) and its Modifiers (how often it gets one against a PC). Whether rank moves either (P3).
13. **The Default Standard's Health:** the rounds of decision 3 times the benchmark turn. **The identity:** with one Standard a PC, a Standard takes as many benchmark PC turns as the fight has rounds.
14. **The Default Standard's damage a turn:** the cost of decision 2, divided by the enemy turns the fight really has (counted turn by turn: `node book/ruler/fight-identity.mjs`).
15. **Its shape:** the Basic attack and a Special across 4 AP, the Tiers' ratio, how much of it is [R].
16. **To the table:** four Default Standards against the four pregens, measured by decision 1's two yardsticks. Expect to cut Health and raise damage (finding 7).
17. **The ranks as multiples,** in this order: Grunt, Elite, Minion (ticks, damage, the exchange rate derived from the PC turns a squad absorbs and the damage it deals before it dies), Boss (Health a PC, output a round).
18. **The roles as offsets** on the Standard's row.
19. **The budget:** bands in CV, the caps (Minions a PC, a Boss), party size, one sentence on what CV can't see (P8).
20. **Pricing Actions (G11):** ready lines for each rank and AP; riders.
21. **The examples rebuilt (G12)**, then playtest 8.

---

## 7. Decisions

**How they were taken.** Lucas, 2026-11-25: "Lets take what the research found is the best way forward and begin the redesign now." Decisions 1 to 4 are the research's answers, taken on that word; each is his to revert. Decisions 12 to 14 are numbers, so they are proposed and wait for him. **They are taken ahead of block B** (the ranks' mechanics): the Default Standard depends on none of it, and it is the thing to get to the table first.

### Decision 1 (taken): what a fight's difficulty is measured by

**Two things, always together:**

1. **Its cost, in Rally Points a PC.** Add all the damage that reached the PCs' Health during the fight, healed in it or not (what Guard or a reduction took never reached Health, so it doesn't count). Divide by what one Rally Point of each PC removes, added together (for the four pregens: 9 + 9 + 8 + 8 = 34). A cost of 1 means: every PC spends one Rally Point and the party is whole again.
2. **Its Downs:** how many PCs went Down.

- **Why both:** every rulebook read defines its easy bands by resources and its hard bands by a character dropping; a pooled total hides a drop (P6); in 2d12 a Down already costs a Wound roll and a Momentum. Lucas's guess ("Rally points uses/hp lost") is the first half.
- **Why Rally Points and not a percentage:** it is the unit the players count their day in, and a Rally Point is a quarter of a PC's Health, so the two convert at sight (a cost of 1.6 is 40% of the party's Health).
- **The Encounter Log records, for each fight** (added to `core-rework.md`, section R): the damage to Health of each PC, the Rally Points spent in the fight, the Downs, the rounds, and the party's damage a round.

### Decision 2 (taken): each band in a sentence, and the day

G9's targets (decided 2026-11-21) restated in decision 1's unit, each with its Down line. The Down lines are words until play gives their rates.

| Band | Cost (Rally Points a PC) | G9 | Its sentence |
|---|---|---|---|
| **Easy** | about 1 (¾ to 1¼) | about 25% | The party spends a little and nobody should go Down. |
| **Normal** | about 1½ (1¼ to 1¾) | 35 to 45% | A real fight: the party spends, a PC goes Down now and then, the party doesn't lose. |
| **Hard** | about 2½ (2 to 3) | 55 to 65% | Expect a PC Down; the party wins if it plays well. |
| **Deadly** | more | not set | Several PCs Down; the party can lose. |

- **The day (C8, a rough guide, stands):** 2 easy, 2 normal and 1 hard fight between Rests cost 7 to 8 Rally Points a PC, against 6 or 7: the guide spends the whole pool and the party ends below full Health. **Flagged for Lucas, not changed.**
- **The bands are wide on purpose:** with ordinary dice only an easy fight lands in its band more than half the time (Tom Dunn's measure of 5e).
- **The CV of each band** (75, 100, 125, 150 a PC today) is a placeholder until decision 19.

### Decision 3 (taken): the normal fight's shape

- **CV 100 a PC, one Standard a PC, is the normal fight, and the party wins it.** It is not an even match: the two sides' numbers are never equal (finding 2).
- **Length (revised by Lucas the same day, with decision 13): decided in round 2, over in round 3.** A Standard's Health is sized on **2 rounds** of the benchmark turn; dice and overkill carry the fight into round 3 (the count: it ends in round 2.8 on average). **Why two and not three:** a 2d12 turn has 4 AP and up to 3 Strikes, about two turns of the games whose target is "three rounds"; in landed hits it is the same fight. First taken as "decided in round 3, over in round 4": that gave the Standard 54 Health, which Lucas refused. **What it touches (flagged, batch 5):** Escalation reaches 2, or 3 when the fight runs on; the level 2 Escalation 3 ability and Smite's third die show mostly from Momentum 1 or in hard fights (F2 assumed 3 to 3½ rounds).
- **Built for a fresh party at Momentum 0:** full Health, Rally Points in hand. **Momentum doesn't change the budget:** it is the party's reward (one line of advice: late in a good expedition a party can take a band more). Draw Steel does the opposite and had to recalculate it in testing.
- **The enemies spread their attacks as far as their Actions make them** (G6: Specials that hit two creatures). All of them on one PC is the GM's dial, not the baseline (G7).

### Decision 4 (revised by Lucas, 2026-11-25): the benchmark is the plain PC

**Lucas:** "we should compare to the core [...] We dont want people to be forced to play certain roles." The first version of this decision used the four pregens (two Paladins, two Archers) and let their cards into the monster's numbers (Judge, Shield of Faith, Lay On Hands' Guard). **A monster is built against the core alone.**

**The plain PC** (the PC budget's own word since 2026-11-13, `cards/README.md`: "its class's Health, armor, weapon and Modifiers and nothing else; its turn is three Weapon Attacks", 100 points, a class about 130 at level 1):

- **What every PC has, whatever its class:** Modifiers +2 and +1; 4 AP and the Reaction Point; the Basic Attack with a weapon; the Basic Actions; Guard 2 for each AP it keeps; Rally Points, each a quarter of its Health; Cover, range and position.
- **What a class sets today** (so a range, not a core number): Health 29 to 35 (32 used), 6 or 7 Rally Points, Armor Defense 12 to 14 and Ward Defense 12 to 13 (13 used).
- **Its turn on paper: three Basic Attacks at +2 against Defense 13** (`node book/ruler/benchmark.mjs`, exact dice math):

| Weapon | Its turn | Its first Basic Attack |
|---|---:|---:|
| Longsword | 30.8 | 11.2 |
| Arming Sword | 23.6 | 8.5 |
| Hunting Bow | 18.3 | 6.5 |
| Recurve Bow | 19.0 | 6.8 |
| **The four designed weapons** | **22.9** | **92 a round of four** |

- **The benchmark turn: 23 on paper, about 17 at the table (69 a round).** The table number is an estimate: playtest 7's party dealt about three quarters of its day's paper number (57 a round, 64 at expected dice, against about 85). One point of Defense is about 6.6% of it.
- **What a class adds is not in the monster.** A class's 30 points are damage (the fight is shorter), protection or healing (the fight is cheaper), control (enemy turns lost). **A real party should find a normal fight cheaper or shorter than a plain one would, by about the same margin whatever its classes:** keeping that margin equal is the class charter's work, not the Bestiary's. Whether a band's cost is the plain party's or a real party's is asked once the table gives the margin (decision 16).

**The test party** is the four level 1 pregens on the cards of v0.0.507 (the same script; a 3½-round fight was assumed for the Encounter Action):

| PC | Paper turn | With its Encounter Action | The turn |
|---|---:|---:|---|
| Aveline (Longsword, Weapon +1 / Power +2) | 31.2 | 33.2 | Binding Light, a Basic Attack, a second Basic attack; Smite once, in round 3, on the Judged creature |
| Durgan (Arming Sword, Weapon +1 / Power +2) | 12.4 | 17.4 | A Basic Attack and Drawing Light, 2 AP on Lay On Hands; Smite once |
| Sylwen (Hunting Bow, Weapon +2) | 22.7 | 22.7 | Quick Shots and 2 Basic Attacks, the first with Shifting Aim's Boon |
| Kaela (Recurve Bow, Weapon +2) | 24.0 | 24.0 | Strafe on 2 creatures and 2 Basic Attacks |
| **The four** | **22.6** | **24.3** | **97 a round** |

- **At level 1 the pregens deal what four plain PCs do** (22.6 against 22.9 before Smite): their classes' worth is in protection, control and movement, which is why it must be read apart.
- Health 128 (35, 35, 29, 29), 26 Rally Points, 34 removed by one Rally Point each. Armor Defense 14, 14, 12, 12; Ward Defense 13, 13, 12, 12.
- **When they test a monster, the Encounter Log keeps apart what their class cards took** (Judge, Shield of Faith, Lay On Hands' Guard, turns an enemy lost to Binding Light or Snap Shot): the monster is checked on what would have reached a plain PC.

### Decisions 12 to 14: the Default Standard's first numbers

G8 (2026-11-21): one number for each stat, a "Default Standard"; the roles' variations after. First proposed with Health 54 and a three-round fight; Lucas refused the Health (the next section has his words and what the research said) and chose: **"Take the 2-round Standard: 36 Health, about 10 a turn."**

**12. Armor Defense 13, Ward Defense 13; Weapon Modifier +2, Power Modifier +2. A rank moves none of them.** *Stands: proposed with 13 and 14, not objected to.*

- "One Standard is one PC": a level 1 PC rolls +2 and +1 and has Defenses of 12 to 14.
- Against 13 the benchmark PC gets a Tier 1 28% of the time on its +2 and 35% on its +1: close to Draw Steel's 36% at +2 and to the 60 to 65% chance to hit the d20 games build on.
- A Standard with +2 gets a Tier 1 against these PCs' Armor Defense 28.5% of the time: the same roll on both sides.
- It leaves a role two points each way (11 to 15) inside a Tier 1 of 17 to 42%.
- **No Defense or Modifier from rank** (P3): what makes an Elite or a Boss stronger is never the PCs' cards working less often. 4e took those bonuses off its elites and solos a year after release.

**13. Health 36: Vigor 18, Resolve 18.** *Decided (Lucas, 2026-11-25).*

- 2 rounds (decision 3) × the benchmark turn at the table (decision 4): 34 against the plain PC's 17, 36 against the pregens' 18; Lucas took 36. 1.1 times a PC's Health, as in 4e, 13th Age and Draw Steel; 3 to 4 landed Strikes (the pregens' landed Strike averages 10).
- Even thresholds: a Default Standard is Bloodied at about half its Health under weapon damage, as 4e's bloodied is. Strained stays rare until Resolve damage is common (K3, accepted).
- If the Encounter Log shows a plain turn worth more or less than 17 at the table, Health moves with it: 2 × the measured turn.

**14. Damage: about 8 to a PC's Health in each Standard turn at the table (a quarter of a PC, one Rally Point); on paper about 9 in a turn that has to move, 12 in one that doesn't.** *Decided as "the damage that gives the normal fight its cost"; the number corrected by Claude from 10 to 8; the paper numbers lowered when Lucas put the benchmark on the core (decision 4).*

- **The identity:** the normal fight costs 1½ Rally Points a PC, about 51 damage to four PCs' Health. Counted turn by turn in zipper order (`node book/ruler/fight-identity.mjs`: the PCs each dealing the benchmark turn to one enemy at a time, no map and no cards), four Standards of 36 Health get **about 6½ turns** before the last one falls (6.4 at 18 a PC turn, 6.7 at 17). 51 ÷ 6½ = 8.
- **A correction (Claude, 2026-11-25).** The "about 10 a turn" Lucas was shown, and the 7 for the 54-Health draft, came from counting 5 and 7½ enemy turns: an enemy that falls after t rounds was given t turns, when in zipper order it has usually acted once more before it falls. **At 10 a turn the normal fight would cost about 1.9 Rally Points a PC,** between normal and hard. The decided thing is the cost (decision 2, his G9), so the number is 8; 10 is his to take back, with the cost it brings.
- **The paper number assumes no class** (P11): only what the table takes from anyone, a turn or an AP spent reaching a target, Cover, a condition. The first version added a fifth for Judge, Shield of Faith and Guard: removed. With a Paladin in the party a Standard's 8 becomes less, and that is the Paladin's worth showing.
- **Both are estimates; the table number is the target the log checks.**
- **Focus:** three Standards on one PC in a round take about 24 of its 29 to 35 Health at the table. An Archer stands, barely; a fourth takes it Down. The lever already decided is G6: a Special that hits two creatures.

**The Default Standard so far:** Defenses 13 / 13, Modifiers +2 / +2, Health 36 (18 / 18), 4 AP; a Basic attack of nothing / 3 / 6 and a 2 AP Round Special of nothing / 7 / 11 on one creature or 5 / 8 on each of two (decision 15); about 8 damage to Health a turn at the table. Not yet: Attributes, Speed, a Reaction, riders.

### Lucas on decision 13 (2026-11-25): "A standard has 54 HP is too much"

His words: "I think this is the same problem we were having, but lessened: NPCs having too much HP. [...] This might be an underlying core problem that has being tackled some other way. Likely making Standard below PCs level and Elite becomes the PCs on level enemy. Or reduce HP in favor of damage, but I know players squint at seeing enemies with much higher damage modifiers like in PF2e. What does the reesarch say?" **Decisions 13 and 14 were reopened, decision 3's length with them; his choice is recorded above: the 2-round Standard.**

**What the research says (Claude's reading, from the three notes):**

- **He is right by every comparison.** The one-a-PC monster elsewhere has about a PC's hit points and dies to 3 or 4 landed hits; the monsters of a standard fight together have 1.0 to 1.4 times the party's hit points.

| | One-a-PC monster's hit points ÷ a PC's, at level 1 | Landed hits to kill it |
|---|---|---|
| 4e | 32 against 22 to 33: about 1.2 [PC side memory] | 4 by intent |
| 13th Age | 27 against 18 to 30: about 1.1 [PC side memory] | 3 to 4 |
| Draw Steel | 30 against 27: 1.1 (roles 0.75 to 1.5) [computed from read text] | about 3 |
| Pathfinder 2e | 20 against 15 to 25: about 1.0 [PC side memory] | about 2 |
| **The draft (54)** | **54 against 32: 1.7** | **5 to 6** (a landed Strike of the four pregens averages 10) |

- **Where the 54 came from: rounds were the wrong unit.** "Three rounds" elsewhere means about three attacks a PC. A 2d12 turn has 4 AP and up to 3 Strikes: the pregens deal 18 a turn at the table against 32 Health, **56% of their own Health a turn** (75% on paper); a Draw Steel hero's signature is about 35% of its Stamina, a 4e PC's turn about a quarter. Sized on three 2d12 rounds, a Standard absorbs twice the hits those games give theirs. **This is the underlying core fact:** a 2d12 round is about two of their rounds.
- **The total is fixed by the party's damage and the rounds, whoever carries it.** A fight of R rounds needs about R × 73 enemy Health in all. Making the Standard "below level" (his first idea: Pathfinder 2e's Moderate fight is built that way, and Draw Steel's hordes are two a hero) splits the same total over more bodies; it doesn't lower it, and the on-level Elite would be the 54 again.
- **Every retune on record is his second idea:** fewer hit points, more damage (4e in 2010; 4e's R&D house rule halving hit points; Heinsoo's own speed-up for 13th Age: hit points down a third, damage up a third to a half). A third off 54 is 36.
- **On the squint:** what Pathfinder 2e's players object to is the creature's higher attack modifier and its criticals, the PCs' own cards working less. Nothing found objects to a monster's damage as such, except at level 1, where Pathfinder is called lethal.

**The variants** (the normal fight's cost held at 1½ Rally Points a PC; the party at 73 a round at the table; a PC: Health 32, 18 a turn). **The damage columns were corrected after Lucas chose** (decision 14: the enemy turns were undercounted; he was shown 7, 8, 10, 5 and 4 a turn, and 20, 24, 31, 15 and 11 for three on one PC):

| The fight | Bodies | Health each | Against a PC's | It ends in round | Enemy turns | Damage a turn at the table | Against a PC's | Three on one PC |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 rounds (the draft) | 4 | 54 | 1.7 | 3.8 | 8.9 | 6 | 0.3 | 17 |
| 2½ rounds | 4 | 46 | 1.4 | 3.3 | 7.8 | 7 | 0.4 | 20 |
| **2 rounds (chosen)** | **4** | **36** | **1.1** | **2.8** | **6.4** | **8** | **0.45** | **24** |
| 3 rounds, more bodies | 6 | 36 | 1.1 | 3.9 | 12.5 | 4 | 0.2 | 12 |
| 3 rounds, two a PC | 8 | 27 | 0.85 | 4.1 | 16.1 | 3 | 0.2 | 10 |

- **The 2-round row is the one with the other games' proportions:** about a PC's Health, 3 to 4 landed hits, the same roll and Defenses, damage a little under half a PC's. Nothing on its sheet is above a PC's.
- **What it costs:** the fight is decided in round 2 and over in round 3. Escalation reaches 2, or 3 if the fight runs on: the level 2 Escalation 3 ability and Smite's third die show mostly from Momentum 1 or in hard fights (F2 assumed 3 to 3½ rounds). The same cost lands in fewer, bigger turns: three Standards on one Archer nearly take it Down in a round at the table (24 of 29). Shorter fights swing more (Dunn).
- **What more bodies cost:** 6 to 8 enemy turns a round with one GM; under the zipper the spare enemy turns come in a row; hits of 3 to 4 against Judge's 2, Shield of Faith's 3 and Guard (the small hits that vanish: C6's worry).

### Decision 15 (taken as the default, 2026-11-25): the shape of its turn

**Lucas: "As a default, yes, but some creature can do something on a tier 1, we can get to that when designing the enemies."** The numbers below are the ones he was shown, rebased on the core the same day (decision 4): the Basic attack went from nothing / 4 / 8 to nothing / 3 / 6; the Special didn't move.

**Few, bigger hits.** 8 to Health a turn spread over three attacks would be three hits of 2 or 3, which Guard from one kept AP nearly erases, and three rolls for the GM where two will do.

1. **A Standard's usual turn: 1 AP to move, a 2 AP Special and 1 Basic attack.** A turn that doesn't need to move gets a second Basic attack, with its At-will Bane.
2. **An NPC's Tier 1 deals nothing unless its card says so.** The default; a creature can have a Tier 1 that does something, decided when that creature is designed. (The PCs' Basic Attack deals a little on a Tier 1 because a wasted turn hurts whoever waits for the next one, and it is the players who wait.)
3. **The Basic attack: [V] nothing / 3 / 6, and the Critical's 1d10!.** 3.2 a use against Defense 13. On a card, with the kept rule's exploding die: 1d4! / 2 + 1d6!. Below every plain PC's Basic Attack (the bows' 6 / 10, the swords' 8 to 11 / 14 to 19 at +2).
4. **The default Special (2 AP, Round): [V] nothing / 7 / 11 to one creature, or nothing / 5 / 8 to each of up to two** (G6). 6.1 a use on one; 8.8 when it catches two.
5. **Its turn on paper:** moving, 9.4 (the Special on one and a Basic attack); standing, 12.2; three Basic attacks and a move, 8.6. Decision 14 asked for about 9 and 12. **The Special is the turn's main hit:** it is worth a little more than the two Basic attacks it replaces (6.1 against 5.4). (With the first Basic attack, nothing / 4 / 8, three Basic attacks beat the Special and a Basic attack: Claude's slip, gone with the rebase.)
6. **How the numbers are written:** as averages here. On a card, a flat number and at most one small die; the Basic attack's die explodes (his 2026-11-13 decision); a Special's numbers are fixed unless the creature's design says otherwise (less swing in a two-round fight).

**Not in it yet:** how much of a Standard's damage is [R] (the Default Standard deals [V] against Armor Defense; its twin deals [R] against Ward Defense with the same numbers), riders, a Reaction, Attributes, Speed.

### The first creature: the Orc Warrior (Lucas, 2026-11-25)

"Lets do one default standard first. It will be the Orc Warrior as the Standard. dont copy anything from the old sheet. The NPC has to have: One melee basic, one ranged basic (both share at-will, like PCs), one special, one reaction. They can also have features." **A Standard's sheet, from now on: a melee Basic attack, a ranged Basic attack (one At-will count), one Special, one Reaction, Features if wanted.** Its record, with the ideas shown (three for each slot): `cards/orc-warrior-redesign.md`. **He chose a set the same day** (Hamstringing Axe, Barbed Javelin, War Howl with Vulnerable 1 in place of Daunted, Blood for Blood, a Boon to Shove while Bloodied), **under review, not built. Two rules of his from it:** don't lean on Daunted; no damage line that is only a flat number (so decision 15's fixed Specials are gone: every damage line has a die). **Built the same day** (the card source and Foundry's compendium build, no Foundry version: "only push it all when we have all NPCs done"), with Vigor 22, Resolve 14 and Mind -1 (his: "the orcs should actually have -1 mind, 14 resolve and 22 vigor"; a creature moves Health between its two thresholds, the total held). **Waiting for his review of the build before the next creature.**

### The second creature: the Grave Wisp, as a Grunt (2026-11-25)

Lucas: "Push it to the work branch, then lets do the next NPC. Also, I think its best we do the foundry pass when all NPCs are done." **From here each creature is designed and recorded; the card source and Foundry come in one pass at the end.** Claude chose the Grave Wisp (the creature that deals only [R] against Ward Defense) as a second Standard; **Lucas: "Wait, lets do the grave wisp as a grunt."**

**So decision 17's first rank is opened: the Default Grunt (proposed, Claude's derivation):** half a Standard. Health 18 (9 / 9); Defenses 13 / 13 and Modifiers +2 / +2 (a rank moves none); about 4 damage to Health a turn at the table (eight Grunts get about 12.4 turns in a normal fight: 51 ÷ 12.4), about 4½ on paper moving and 6 standing; 3 AP and dice that never explode (Chapter 14's two rules for Minor enemies, kept: K7); a Basic attack of 1d4 / 1d6; a 2 AP Special of about 5½ / 8½ on one creature or 2½ / 4½ on each of two. **Open with it: how many cards a Grunt's sheet has** (the Standard's four, or its Basic attacks and one more: Claude's pick). The wisp's record, with the ideas at Grunt size: `cards/grave-wisp-redesign.md`. Waiting for his review.

**Lucas's answers (2026-11-25):** the Default Grunt stands. **Every enemy has two Basic attacks by default, whatever its rank** ("normally one melee and one range, is possible one vs AD another vs WD [...] no hard limits here: A npc can have 2 basic melee attacks, each targeting a different defense for example"); so a sheet has no fixed number of cards. The Grave Wisp's set is chosen (Slipping Touch, Guttering Glance, Pass Through, Dying Flare, Drifting; Resistance Psychic 3, Weakness Holy 3, Immunity Cold; Mind +2; Armor Defense 12, Ward Defense 14: a point moved between its Defenses, the total held). **Resistance, Weakness and Immunity are written the word first** (his 2026-11-19 decision, `decided.md`; Chapter 1 and Foundry still print "Resist 2 Fire").

### The third creature: the Goblin Sneak, as a Minion (2026-11-25)

Lucas: "Wisp is good, next is the Goblin Sneak as a Minion." **The Grave Wisp is decided.** The Minion rank is opened with the goblin (`cards/goblin-sneak-redesign.md`): **the Default Minion, proposed:** 2 ticks; Defenses 13 / 13 and Modifiers +2 / +2; 3 AP and no Reaction Point (Chapter 14's rules, kept); a Basic attack of 1d4 / 1d6, a Grunt's (a Minion hits like a Grunt and dies like a Minion); about 3½ damage to Health a turn at the table; **CV 30** (the count: about 13 such Minions are a normal fight for four PCs; 8 cost 0.7 Rally Points a PC, 12 cost 1.2, 16 cost 2.0: not a straight line, so the rule keeps a cap). **K2 proposed with it, seven sentences:** an Action removes its Tier's ticks once, only if that Tier damages the Minion; a Save Action by the Minion's Save turned over; an Area by each Minion's own Tier; damage with no Tier (Collision, Lingering, a hazard, a zone) removes 1; a rider with no damage removes none; a heal restores 1; Minions and their ticks are announced. Waiting for his review.

**Lucas's answers on the goblin (2026-11-25):** the Default Minion and the tick rules stand, with **one tick reduction an Action, whatever it does** (a Tier 2 with a Forced Movement that collides removes 2, not 3); **squads of 2** (Chapter 14: up to 3); **a Minion can have a Reaction, paid with an AP it kept** (no Reaction Point: "This requires goblin to save a whole action for a potential trigger"). The Goblin Sneak's set: Shiv, Jeer (against Ward Defense), Knife in the Back (it must flank), and an Encounter Reaction when another goblin goes Down (an Evade 1, then a Jeer).

### Lucas on the size of NPC damage (2026-11-25; on watch, nothing changed)

"I am noting the damage from NPCs are just flat dice, barely any variation. Is this caused by PCs health being low? Because there is a clear disparity here that could be hurtful for the game. But at the same time, HP is the daily resource, so even 1 damage is still something, unlike most games. Could be my mind with PF2e and similar systems where healing is trivial."

**Claude's reading:**

- **It is not the PCs' Health.** A Standard's turn takes about a quarter of a PC (8 of 32), the same share as a Draw Steel monster's signature takes of a hero (about 26%). What differs is how it arrives: there in one number, here in two or three rolls of 3 to 6.
- **Three things make the dice look small and alike:** a turn of several attacks splits the quarter; the two Specials chosen so far hit areas or two creatures, so they are small dice too; and the last two creatures are half-size ranks whose dice never explode (Chapter 14's rule for Minor enemies).
- **What sets the quarter is the day, not Health:** 6 or 7 Rally Points of a quarter each make a day of about 2.75 times a PC's Health for five fights, so a normal fight can cost about 37% of it. Draw Steel's heroes have 8 to 12 Recoveries of a third each, about twice the healing, and its monsters can take more of a hero in a fight.
- **The real disparity is on the PCs' side:** a PC's turn takes about half of a Standard (17 of 36), against a third in Draw Steel. That is the two-round fight (decision 3), chosen so that a Standard has a PC's Health.
- **His own answer holds:** where healing is a daily budget, a point of damage is a point of the day (one eighth of a Rally Point); where healing is free between fights, only big hits register. The research says the same of attrition games.
- **What to watch at the table:** whether hits of 3 or 4 disappear under Guard and reductions; whether Grunts and Minions feel like nothing. **Levers, smallest first:** fewer and bigger rolls on a creature (decision 15's shape); letting Minor enemies' dice explode (dropping that Chapter 14 rule); fewer fights between Rests or more Rally Points (the bands' cost, G9 and C8); doubling the PC side's grain (Health, a Rally Point's heal, Guard and reductions all twice as large, NPC damage with them), which changes no proportion and is a core change.

### What comes next

- **Lucas's word on the Goblin Sneak's sheet** (`cards/goblin-sneak-redesign.md`, the last section), then the next creature.
- The creatures that need block B: an Elite (K6), a Boss (its turns).
- **The Foundry pass for every creature at once** (`foundry/foundry-backlog.md`), then **decision 16, to the table**, and one Foundry version.
