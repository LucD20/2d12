# The Bestiary: the design record

> **Status (2026-11-25, later): CHAPTER 14 IS IN THE BOOK AND THE FOUR PLAYTEST CREATURES ARE BUILT.** Chapter 14 was rewritten from zero as playtest rules (`rules-src/14-bestiary.md`; the old chapter: `archive/book-drafts/14-bestiary-to-2026-11-25.md`): the measure, the bands, the normal fight, the four ranks' defaults, the tick rules, squads of 2, the sheet rules and the four creatures as stat blocks; the Boss, the roles, the ratings, the pricing and the later Stages are open boxes. Foundry v0.0.519 follows (Minion ticks, the ranks' rules, the Goblin Sneak, the Grave Wisp, the Orc Warrior and the Ogre Chieftain; `foundry/foundry-backlog.md`). Not tested by Lucas. Next: his checklist, the Encounter Log, playtest 8 (decision 16). This file is the Bestiary's record, the way `magic-design.md` is magic's and `talents-design.md` the Talents': his words, what stays, what the core gives a monster to be measured against, the research, the problems, the order of the decisions, then each decision as it is taken. It is batches 6 and 7 of `core-rework.md` (section P).

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

> **The current measure (2026-11-26):** the cost and the difficulty table with their final edges are in "The designers' measure of a fight, out of the book (Lucas, 2026-11-26)" below; the table here is kept as it was.

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
- **Length (revised by Lucas the same day, with decision 13): decided in round 2, over in round 3.** *(Replaced 2026-11-26: "aiming for 3-4"; see "After playtests 8, 9 and 10" at the end.)* A Standard's Health is sized on **2 rounds** of the benchmark turn; dice and overkill carry the fight into round 3 (the count: it ends in round 2.8 on average). **Why two and not three:** a 2d12 turn has 4 AP and up to 3 Strikes, about two turns of the games whose target is "three rounds"; in landed hits it is the same fight. First taken as "decided in round 3, over in round 4": that gave the Standard 54 Health, which Lucas refused. **What it touches (flagged, batch 5):** Escalation reaches 2, or 3 when the fight runs on; the level 2 Escalation 3 ability and Smite's third die show mostly from Momentum 1 or in hard fights (F2 assumed 3 to 3½ rounds).
- **Built for a fresh party at Momentum 0:** full Health, Rally Points in hand. **Momentum doesn't change the budget:** it is the party's reward (one line of advice: late in a good expedition a party can take a band more). Draw Steel does the opposite and had to recalculate it in testing.
- **The enemies spread their attacks as far as their Actions make them** (G6: Specials that hit two creatures). All of them on one PC is the GM's dial, not the baseline (G7).

### Decision 4 (revised by Lucas, 2026-11-25): the benchmark is the plain PC

> **Corrected by Lucas, 2026-11-26 (OPEN):** the benchmark is not "no class at all"; a **margin** for the power a class adds is to be left. See "Lucas's review of the chapter's wording (2026-11-26)" below. The text of this decision is kept as it was.
>
> **The margin's size (Lucas, 2026-11-26): "Margin: I will roll two more playtests and then we adjust from there."** No value is set: two more playtests first, then the numbers are adjusted from there (with the retune, decision 16).

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

**13. Health 36: Vigor 18, Resolve 18.** *Decided (Lucas, 2026-11-25). Replaced 2026-11-26: Health 45, a quarter more ("After playtests 8, 9 and 10" at the end).*

- 2 rounds (decision 3) × the benchmark turn at the table (decision 4): 34 against the plain PC's 17, 36 against the pregens' 18; Lucas took 36. 1.1 times a PC's Health, as in 4e, 13th Age and Draw Steel; 3 to 4 landed Strikes (the pregens' landed Strike averages 10).
- Even thresholds: a Default Standard is Bloodied at about half its Health under weapon damage, as 4e's bloodied is. Strained stays rare until Resolve damage is common (K3, accepted).
- If the Encounter Log shows a plain turn worth more or less than 17 at the table, Health moves with it: 2 × the measured turn.

**14. Damage: about 8 to a PC's Health in each Standard turn at the table (a quarter of a PC, one Rally Point); on paper about 9 in a turn that has to move, 12 in one that doesn't.** *(Replaced 2026-11-26: about ×2.36, about 19 a turn; "After playtests 8, 9 and 10" at the end.) Decided as "the damage that gives the normal fight its cost"; the number corrected by Claude from 10 to 8; the paper numbers lowered when Lucas put the benchmark on the core (decision 4).*

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

### Lucas: a Rally Point of a third of Health? (2026-11-25; a review he asked for, NOT decided: "I will playtest as is")

"What you mean by 'A PC's turn takes about half of a Standard (17 of 36), against a third in Draw Steel.'? And if we did Rally = 1/3 HP instead? I will playtest as is, but I want to see your review on this first. The dice could go up right? I feel its too flat but I will still give it a shot."

**The sentence, as a table** (each side's turn as a share of the other side's Health; Draw Steel's from its level 1 numbers in `research/raw/2026-11-25-monsters-draw-steel.md`):

| | 2d12 | Draw Steel |
|---|---|---|
| A PC's turn against the one-a-PC monster | 17 of 36: **47%** | 9.5 of 30: **32%** |
| That monster's turn against a PC | 8 of 32: **25%** | 7 of 27: **26%** |

The monsters' side is the same; the PCs' side is half again as strong here. So an NPC's dice are not small for what they do to a PC; they look small beside a PC's own damage (a landed Strike of 10, up to 19).

**A Rally Point of a third** (Paladin 12 where it is 9, Archer 10 where it is 8; Draw Steel's Recovery is a third too):

- **About 30% more healing a day** (the four pregens: 288 where it is 222; the day goes from 2.7 to 3.25 times the party's Health).
- **It can be spent one way or the other, not both:** on harder hits (the bands stay 1, 1½ and 2½ Rally Points a PC, so a normal fight costs half the party's Health, where it costs three eighths), or on a longer day (the bands stay a share of Health, and a Rest holds one or two fights more).
- **Spent on hits, the dice go up about a third, one die size:** a Standard's turn about 10 to Health at the table (the number he first took), its Basic attack about 4 / 8 where it is 3 / 6, its Special 9 / 15; a Grunt's or a Minion's Basic attack 1d6 / 1d8.
- **What comes with it:** the in-fight buffer gets thinner (a Standard's turn is a third of a PC, so three Standards on an Archer take it Down in a round: 30 against 29); Steel Yourself and Lay On Hands heal a third at a time, so the swing up is as big as the swing down; flat protections (Judge 2, Shield of Faith 3, Guard 2 an AP) weigh less against bigger hits, which answers the worry about hits that vanish; anything measured in a Rally Point grows with it (Guard equal to a Rally Point's heal, an NPC's Rally Point of 9, the hourly healing while Unconscious).
- **What the playtest should tell before choosing:** how often a PC goes Down at today's cost (if often, a third makes it worse; if fights feel toothless, a third is the move), and whether hits of 3 or 4 vanish under Guard and reductions.
- **Cheaper texture, if only the look is the problem:** let Minor enemies' dice explode; fewer and bigger rolls on a creature.

### The fourth creature: the Ogre Chieftain, as an Elite (2026-11-25)

Lucas, on the Elite's open rule (K6): "Ok, lets settle it and start." **Proposed three ways** (`cards/ogre-chieftain-redesign.md`), with the count that sizes it: two Elites of 72 Health get about 3.9 turns where four Standards get 6.7, so an Elite must deal 13.1 a turn at the table (1.7 times a Standard), or get one extra turn in the fight and deal a Standard's 8.6. **Way 1, Claude's pick: Roused** (the first time an Elite becomes Bloodied or Strained in an encounter, it takes a turn when the current turn ends; once): a Standard's attacks and Defenses, twice its Health, one more turn, a visible change at half Health, and the second place in the turn order one body lacks. Way 2: every attack hits up to two creatures. Way 3: two Reaction Points and two Reactions with bigger hits. Rejected: twice the damage a hit, two turns every round (the Boss's), more AP, ending a condition each turn (for the Boss), a commander's orders as the rank's rule. **The Default Elite under way 1:** Health 72 (36 / 36), Defenses 13 / 13, Modifiers +2 / +2, 4 AP, a Standard's Basic attack and Special, Roused, CV 200. The ogre's ideas, three a slot, are in its record. Waiting for his review.

**Lucas on Roused (2026-11-25):** "the Risk is quite big. People will have to synergize dealing both kinds of damage to not trigger it earlier, and causing Roused while it is in melee with another PC, hurts that other PC. Should we do per elite? As features? Or its best to do one default elite feature?" **Claude's answer (proposed, not decided): the size is the rank's, the form is the creature's. One default slot: "an Elite has an Encounter Action of its own, worth about a turn"** (used on its own turn, at the GM's moment, on a card the players can read; about 9 or 10 more damage to Health in a fight, or the like in effect). Roused becomes a possible signature for a creature meant to enrage, not the rank's rule. His own set for the ogre (Crushing Grip, Roar, Great Sweep, Hurled Goblin as a second Special, a Ground Slam once an encounter that hits a Line 3 and leaves it Difficult Terrain, a no-roll Backhand as a Turn Reaction, its size) already carries an Elite's worth by the count, with no Roused. The review, one by one: `cards/ogre-chieftain-redesign.md`.

**DECIDED (Lucas, 2026-11-25: "1. Yes"): K6 is closed. An Elite has an Encounter Action of its own, worth about a turn** (the size is the rank's: one extra turn's worth in a fight, about 9 or 10 more damage to Health at the table or the like in effect; the form is the creature's). **The Default Elite:** a Standard with twice the Health (72), the same Defenses, Modifiers, AP and attacks, and that Encounter Action (by default one that hits several creatures for about twice a Round Special); CV 200. The Ogre Chieftain is decided but for the name of its Encounter Action (`cards/ogre-chieftain-redesign.md`, the last section); its Backhand does not disrupt the mover (his ruling: a Trigger, 2 squares of movement and 1 damage, not an Action).

**The Ogre Chieftain is decided** (Lucas: "Crack the Ground is good"; a Charge against the Backhand: "Its fine", with a Body or Instinct Save kept ready if the table finds it too strong).

### The Boss: its rule, proposed three ways (2026-11-25; decision 9 of section 6; nothing decided)

**What is fixed:** a Boss is "for a single-boss or boss + 1 to 2 fight, with its own turn mechanic" (G2: Nimble's one turn a PC, or Draw Steel's two turns); classes never shut it down (H9). **From the research:** one creature against a party loses on turns, is shut down by one condition, then dies in a round or grinds; the fixes tables accept are more turns and a protection the boss visibly pays for; a free negation is the most disliked rule found; the bosses tied to the number of PCs (Nimble, ICON) get the best verdicts.

**Its Health (all three ways): 36 for each PC it stands for** (four Standards' worth against four PCs: 144). A Boss alone is the whole budget, CV 100 a PC; with one or two others it stands for fewer PCs.

**The count** (a lone Boss, the PCs each dealing 17 a turn at the table; the fight ends in round 2.6 whatever the way; "needs" is damage to Health a Boss turn for a normal fight's 1½ Rally Points a PC):

| The Boss's turns | 3 PCs | 4 PCs | 5 PCs | 6 PCs |
|---|---|---|---|---|
| **1. A turn after each PC's turn** | 6.4 turns, needs 6.0 | 8.5, needs 6.0 | 10.6, needs 6.0 | 12.6, needs 6.1 |
| **2. Two turns a round** | 4.4, needs 8.6 | 4.2, needs 12.0 | 4.3, needs 14.8 | 4.2, needs 18.2 |
| **3. A turn for each Standard's worth of Health it has left** | 4.3, needs 8.9 | 5.4, needs 9.5 | 6.4, needs 9.9 | 7.5, needs 10.2 |

- **Way 1 (Claude's pick): a turn after each PC's turn, 3 AP each.** One stat block serves any party: the damage a turn it needs is 6.0 for 3, 4, 5 or 6 PCs, about three quarters of a Standard's turn, which is what 3 AP of a Standard's cards deal. It is the zipper as it is (sides alternate), with the Boss taking every enemy place. A condition costs it a quarter of its round, not its round: the dilution the research names as the fair protection. No number on its sheet is above a PC's but its Health.
- **Way 2: two full turns a round.** Lumpy (a third of a PC a turn or more), and what it must deal changes with the party's size (8.6 to 18.2): a table by party size, or a Boss that is wrong for three PCs and for six.
- **Way 3: the shrinking Boss** (the Angry GM's paragon): as many turns as it has Standards' worth of Health left; each time it loses 36 Health it loses a turn and its conditions end. It is exactly the Standards it replaces; it grows weaker as the fight goes, which some tables find an anticlimax; one more thing to track.

**What way 1 needs written (Claude's proposals):**

1. **Its turns:** a Boss built for N PCs takes N turns a round, one after each PC's turn (after each of its enemies' turns, up to N). Each turn it regains 3 AP.
2. **A Round is the round:** its Round Actions are once a round, not once a turn; it regains its one Reaction Point at the start of the round.
3. **AP taken from it** (Dazed, Slowed) come off one of its turns a round only.
4. **Its EoT conditions end at the end of its next turn,** as for anyone: on a Boss that is soon.
5. **Never shut down (H9): at the end of each of its turns, a Boss can take 1d6 damage that nothing reduces to end one condition on itself.** The players' card still did something, the Boss visibly pays, and the rule is printed: the three things the accepted protections share.
6. **Its Encounter Actions** are the creature's own (as an Elite's): its arc, and where the big dice are.

**Open with it:** which creature the first Boss is (there was none in the old Bestiary).

**The Boss is parked (Lucas, 2026-11-25): "Should we work on the boss now? I feel we need the playtest with normal enemies first."** Claude agrees: every number of the Boss is the Standard's estimates multiplied by the party's size (the benchmark turn of 17, 36 Health a PC, 6.0 damage a turn), so an error found at the table would be built into it four times over; its rule also leans on how conditions and the Rally Point's size play, which the playtest is there to show. The three ways above stay as proposed. **What playtest 8 should settle before the Boss:** the plain PC's real damage a turn; what four Standards really cost and how many Downs; whether hits of 3 or 4 vanish under Guard and reductions; whether a Rally Point stays a quarter.

### Lucas's answers to the cleanup audit's Bestiary questions (2026-11-26; applied to Chapter 14, Foundry v0.0.521)

- **The bands (B3-035): the table's holes closed.** Easy about 1 (up to 1¼); Normal about 1½ (above 1¼, up to 2); Hard about 2½ (above 2, up to 3); Deadly above 3.
- **Momentum (B3-037):** "Late in a good expedition, a party can take a band more." removed; "Momentum doesn't change the budget: it is the party's reward." stays.
- **No number assumes a class (B3-038):** one sentence: "with their class cards, the PCs find a fight cheaper or shorter than its band." (How the numbers were measured stays in this record, decision 4.)
- **A Minion's CV (B3-039):** "A Minion's CV of 30 is for Minions mixed with other enemies; about three of them count for one PC."
- **A rank never moves its Defenses or its Modifiers (B3-040):** the reason after it removed.
- **The unit (B3-053):** "A Standard is the unit: CV 100, one for each PC in a normal fight." The Elite: "two units: CV 200, the place of two Standards in a normal fight"; the Glossary's Standard row the same. (A Standard is not one PC's worth: one a PC is a fight the party wins.)
- **"Special Action" dropped (B3-070; "Yes"):** an NPC's **other Actions** (every one that is not a Basic attack) are 2 AP and Round by default; by default one hits one creature, or two for less damage each; its own card can do otherwise. The stat blocks write "(Round, 2 AP; ...)"; the cards' category is "Other Action".
- **Hurled Goblin (B3-074; "Good"):** "the ogre places the Minion in an empty square adjacent to the target (hit or miss); it takes no damage and triggers no Reactions." (no more "not a Reposition or a Forced Movement").
- **The Critical (B3-052, with B1-003; "Yes"):** each Basic attack card writes its own Critical row, by default 1d10! of its own pool and subtype (a Minor enemy's too: the only die of a Minor enemy that explodes). Nothing plays differently; each row can now be tuned on its own.
- **Still held:** an NPC's items and losing its weapon (B3-033, B3-065; B3-069's section stays under its open box): its own section below, "An NPC losing its weapon".

### An NPC losing its weapon (B3-033, B3-065, B3-069; 2026-11-26; OPEN, to work on with Lucas after the audit)

Lucas: "We need to work more on it. Save it for when we are done running the audit." Nothing is decided and nothing is in the book or in Foundry.

**Claude's proposal (proposed, not decided):** a stat block names a weapon only when the creature can lose it; only the cards that use it write "Requirement: its axe in hand", and the rest still work; it always has the Fists Basic Action; it takes the weapon back with Interact (1 AP) when it is within its Reach; another weapon of the same kind meets the Requirement, another kind doesn't; the GM adjusts nothing mid-fight.

**Lucas, later the same day (2026-11-26; a direction, not decided), after the research (`research/npc-items.md`):** on "the card names the weapon; without it that card is off": "My fear with it is that we will then either have a 'Unarmed Attack' for every NPC, which could cause disarm to be a meta way forward 'Lets disable the boss best abilities'. And if we make disarm too hard, then it is unusuable. Should we make for NPC as a condition like: 'While Disarmed, you take X penalty to damage until you pickup a weapon' or reduce die size or something like that? Or do per weapon group like mastery, so any Sword counts, but a Dagger would take this penalty." So his direction: a disarmed NPC keeps its Actions and deals less with them until it has a weapon of its group again. Open: the size and form of the penalty (a flat number, a die step, Banes), the cost to pick the weapon up, whether rank changes anything.

### Lucas's review of the chapter's wording (2026-11-26; applied to Chapter 14 and the Glossary, Foundry v0.0.523)

His words:

- On "An NPC's other Actions are 2 AP and Round by default": "Remove the 2ap and round by default. Again, we shouldn't be hard capping this too much."
- On the Critical and Minor enemies: "Remove the minor enemies part. People can see minions don't have !. And effects that allow crit, should allow minions to crit. Remove the goblin and wisp exception. Remove the default critical again."
- In general: "I feel you are doing too much 'by default', it really shouldn't have so many constraints. The limits is the overall power of the action, a 1ap can exist as an npc another action as long as it is balanced against its other counterparts"
- On "No number in this chapter assumes a class": "Wait, this means the game doesn't take classes into considerations at all? Because when I meant classes will be different and we were comparing to only paladin and archer, i meant to not specifically compare to those but use better judgement and create kind of a 'margin', since classes increase power, so we need a margin."
- On "The bands": "What does bands mean? And bands edge? I am not getting this part. Is this the encounter difficulty?"
- Good as they are: the Momentum sentence removed, the Minion's CV sentence, the Elite clause removed, the Standard and Elite "unit" sentences, Hurled Goblin.

**What changed (the book; `rules-backlog.md`, the top entry, has each sentence):**

- **An NPC's other Actions have no default shape:** any AP cost, any Frequency, any number of targets; **what limits one is its power**, balanced against the creature's other Actions. The numbers stay as **reference numbers**: a Grunt's 2 AP Round Action about 5½ / 8½ to one creature or 2½ / 4½ to each of two; a Standard's about 7 / 11 or 5 / 8 to each of up to two; an Elite's Encounter Action that hits several creatures about twice a Standard's 2 AP Round Action (the record, decision K6, says "about twice a Round Special" and no more: neither "each" nor "in total" is settled, so the book keeps the words as written). A Standard's "usual turn" is now "the turn its damage a turn counts" (decision 15's shape is how the damage a turn was counted, not a rule). Decision 15's "default Special" is read the same way from here.
- **A Minor enemy's dice follow the general rule:** a die explodes where its card writes ! (Chapter 1, Exploding Dice), an Empowered die included. Chapter 14's "their damage dice never explode" (K7's second Minor rule) and the goblin's and the wisp's "Its damage dice explode only in its Critical rows" are gone; the rank table still writes the Minion's and the Grunt's Basic attack dice with no !, which is what the players see.
- **No default Critical row:** the rule "Each Basic attack has a Critical row by default" is gone (and with it the Foundry hook of v0.0.521 that filled one); the eight creature cards keep their rows (Lucas approved a row on each Basic attack card: B3-052).
- **"No number in this chapter assumes a class" removed.** Nothing in its place until the margin is decided.
- **"Band" is "difficulty"** in the book (the section "Difficulty", the table's column, the open box). This record's older entries keep "band"; new entries say "difficulty".

**Decision 4, corrected (OPEN):** the benchmark is not "no class at all". Lucas meant: don't size a monster against the Paladin's and the Archer's cards specifically, but use judgment and leave a **margin** for the power a class adds, whichever class it is. **The size of the margin is not decided; it belongs with the retune (decision 16).** What the record and playtest 8 already hold (facts, not a proposal):

- The PC budget puts a class at about 130 points at level 1 against the plain PC's 100 (`cards/README.md`; 150 at level 3).
- At level 1 the pregens deal about what four plain PCs do on paper (22.6 against 22.9 a turn before Smite; decision 4's table).
- In playtest 8 (`playtest-8.md`) the party dealt 18.4 a turn against the table estimate of 17; class cards took 5 of the 50 raw damage the enemies dealt (all of it from the ogre's hits).
- The fight ended in round 2, against decision 3's "decided in round 2, over in round 3".

**Still open with it:** which cost separates Hard from Deadly (2¾ or 3 Rally Points a PC: the book says 3, the Encounter Log's line about 2.7, its 68%); the other "by default" sentences of Chapter 14, listed for Lucas (every NPC has two Basic attacks; no NPC has a Reaction; 2 ticks; the ranks' table of defaults; a creature changes its rank's default inside the totals; and the rest in the report of 2026-11-26). *Answered the same day: see the next entry.*

### The designers' measure of a fight, out of the book (Lucas, 2026-11-26; Chapter 14, Foundry v0.0.524)

His words:

- "Band: this shouldn't be in the book, the people reading the book don't need to know this part of the mechanics. It is a designers thing only. But for our notes, it should be 3 for deadly."
- "Margin: I will roll two more playtests and then we adjust from there."
- "All rest are good." (the seven other "by default" sentences of Chapter 14 listed for him.)

**What it decides:**

- **The measure of a fight is not in the rulebook, by Lucas's decision.** Chapter 14's section "Measuring a fight" ("The cost of a fight" and "Difficulty", with the table and the sentence "The difficulties are wide on purpose: dice swing, and a fight often costs more or less than its difficulty says.") left the book. It is a designers' tool: this record and the Encounter Log (Foundry v0.0.524 names a fight by it) keep it. "The normal fight" (CV 100 a PC) stays in the book, now under "Building an encounter", with the open box on the fights a day (its Rally Point clause dropped). The words easy, normal, hard and deadly stay in the book as plain words for a fight's CV. No rule of play changed.
- **Hard ends at 3; Deadly is above 3** (the question "2¾ or 3" is answered: 3).
- **The margin (decision 4's correction): no value.** Two more playtests, then the numbers are adjusted from there.
- **The seven "by default" sentences of Chapter 14 stay as they are**; the changes of v0.0.523 stand.

**The designers' measure, as it now stands** (decision 1's text as the chapter had it; the table with its final edges):

A fight is measured by two things, always together:

1. **Its cost, in Rally Points a PC.** Add all the damage that reached the PCs' Health during the fight, healed in it or not (what Guard or a reduction took never reached Health, so it doesn't count). Divide it by what one Rally Point of each PC removes, added together. A cost of 1 means: every PC spends one Rally Point and the party is whole again.
2. **Its Downs:** how many PCs went Down.

| Difficulty | Cost (Rally Points a PC) | What it promises |
|---|---|---|
| **Easy** | about 1 (up to 1¼) | The party spends a little and nobody should go Down. |
| **Normal** | about 1½ (above 1¼, up to 2) | A real fight: the party spends, a PC goes Down now and then, the party doesn't lose. |
| **Hard** | about 2½ (above 2, up to 3) | Expect a PC Down; the party wins if it plays well. |
| **Deadly** | above 3 | Several PCs Down; the party can lose. |

The difficulties are wide on purpose: dice swing, and a fight often costs more or less than its difficulty says.


### What comes next

- **Done (2026-11-25):** the four creatures of the playtest are designed and built (the Goblin Sneak, Minion; the Grave Wisp, Grunt; the Orc Warrior, Standard; the Ogre Chieftain, Elite); **Chapter 14's playtest text is in the book** (`rules-backlog.md`, the top entry); **the Foundry pass is done, v0.0.519** (`foundry/foundry-backlog.md`, "THE BESTIARY'S REBUILD IN FOUNDRY: BUILT IN v0.0.519"; by hand: Pass Through's line and targets, Hurled Goblin's landing, Crushing Grip's one at a time).
- **Hurled Goblin, closed (Lucas, 2026-11-25):** the goblin is thrown: placed in an empty square adjacent to the target; not a Reposition or a Forced Movement, no Reactions (Chapter 3 keeps a Reposition within the mover's Reach).
- **Lucas, 2026-11-25, after the pass: "Remove 'No NPC has Escalation'. They might have. Just leave it without mentions of escalation since it isnt in yet."** Applied: Chapter 14 and Chapter 2 say nothing about an NPC's Escalation (the old Elite Escalation rule stays out; whether NPCs get one is open, not refused). Foundry keeps its switch on the NPC (off by default).
- **Lucas, the same day: the Encounter Log is already done** (v0.0.488: section R's measures). Nothing is left to build before playtest 8.
- **The check of the other chapters against the new Chapter 14 (Claude, 2026-11-25).** Fixed: Chapter 2's Unspent AP now points to the NPC rule (no Guard from unspent AP), which only Chapter 14 said; **Lucas's answers (the same day):** Pass Through keeps no distance ("this is already in the rules": Chapter 3 caps a move at the mover's Speed); an NPC's Rally Point removes a quarter of its Health Pool, rounded up, as a PC's (Chapter 4's old "9 at Stage 0" is gone; a Minion restores 1 tick); Hurled Goblin's goblin is thrown (below). **Tags (Lucas):** his ideas (the wisp Profane and an Aberration, the goblin Goblin, the ogre Ogre) wait; Claude's note: Profane is the one Tag a card reads today (the Paladin's Smite, through Judge), so it is the first to settle. **Decided (Lucas, 2026-11-25: "Yes, lets leave it off"):** the Grave Wisp has no Profane Tag for playtest 8, so the fights measure the ranks' numbers without a class shortcut; it comes back with the Tag list. Nothing else outside Chapter 14 names a rank's number.
- **Next: Lucas's checklist on v0.0.519** (it reaches his Foundry with the other chat's update).
- **Playtest 8** (decision 16; the fights suggested in the same brief).
- **After it:** the retune, then the Boss, the roles as offsets, the budget's bands, the pricing.
- **What is left of the Bestiary, besides the Boss and the numbers (2026-11-25):** more creatures (four exist, one a rank); the budget (the CV of the easy, hard and deadly bands, the caps, the party's size, the fights a day); the roles; whether the ratings (Terrible to Extreme) come back at all; a simple pricing for an NPC's Actions (ready lines by rank and AP cost); how a level 2 or 3 creature is written (options, never numbers); the later Stages; the list of Tags (Chapter 7's open box; Goblin and Ogre are in use); in Foundry, the NPC Builder tab (still on the old tables) and the SIM (frozen on the old Bestiary).

## Playtest 8 against the decisions (2026-11-26; `book/playtest-8.md`; one fight: nothing here changes a number)

The first fight on the rebuilt numbers: the four pregens against the Ogre Chieftain, the Orc Warrior, the Grave Wisp and two Goblin Sneaks (CV 410, 102 a PC), measured by the Encounter Log.

- **Decisions 1 and 2 (the cost, the bands): on target.** 45 damage reached Health; one Rally Point of each PC removes 34 together: **1.3 Rally Points a PC, no Down** (normal: above 1¼, up to 2, the bands since the audit's B3-035; 1¼ to 1¾ before).
- **Decision 4 (the benchmark turn): close.** The party dealt 147 in two rounds, 18.4 a turn against the table estimate of 17. Its dice were a little above average (6 Tier 3s in 20 rolls, about 3½ expected).
- **Decision 14 (about 8 to Health a Standard's turn): close.** 45 over 6 enemy turns worth 6.1 Standard turns: about 7. But 25 of the 50 raw was one Action, Crack the Ground.
- **Decision 13 (decided in round 2, over in round 3): a round short.** Over at the end of round 2. The enemies had 130 Health in all and the party deals about 69 a round: the numbers themselves give 1.9 rounds when nothing is wasted, and almost nothing was. Three of the five enemies never had a second turn. Lucas: "It played much much much faster"; "easy until the ogre did his turn"; "almost brainless, doing attack after attack".
- **To watch in the next playtests (no decision):** whether fights keep ending in round 2. If they do, "over in round 3" needs either more Health than 36 a PC or fewer enemies dying before a second turn; and a two-round fight leaves no room for control (Trip, Demoralize), which is what his notes on the maneuvers describe.

## After playtests 8, 9 and 10: Lucas's decisions (2026-11-26; applied to the book and Foundry v0.0.527)

Read after playtest 10's section 1 (`playtest-10.md`: the three fights cost 1.0 Rally Point a PC on average, no Down, about 2.3 rounds, class cards took a fifth of the raw damage). Each decision in his words; the rule changes, sentence by sentence, are in `rules-backlog.md` (the top entry).

1. **The normal fight's length: "I think aiming for 3-4 might be best, so 3.5 aim."** The new aim replaces decision 3's "decided in round 2, over in round 3" (its text kept above). Chapter 14: "It lasts 3 to 4 rounds."
2. **Judge loses its flat damage reduction:** "I felt it was not only strong but disruptive. I think I will remove the flat judged reduction"; then "Yes". Judged keeps every other thing (Profane for you, its ends, several Paladins).
3. **Feint: "Likely make 2 Boons on Tier 3, not favored"; then "Yes".** Tier 2 gives 1 Boon, Tier 3 2 Boons. **The Tier 2's 1 Boon is Claude's assumption** (a Tier 3 must add something over a Tier 2).
4. **PC Health: "Health +½".** The classes' high and low values ×1.5 (Paladin 30 / 15, Archer 24 / 12); no Stage steps are written. **The species bonuses don't change** (Claude's assumption: he said nothing on them). **The Rally Point: "Lets keep as is for now"** (a quarter of the Health Pool; the Rally values). **"None yet, lets not scale guard or protective. I will rebalance the classes actions":** Guard, Shield of Faith, Resistance, Lay On Hands, Tend and every class card keep their numbers.
5. **Enemy damage: the Health factor and "a generous headroom": "Tier 2 avg at 5.8-6 is an interesting way forward".** Every damage number a creature deals about ×2.36 (5.9 ÷ 2.5), on each line's expected value (an exploding dN! averages (N + 1) ÷ 2 × N ÷ (N − 1)); "!" kept exactly where it was; the Critical rows stay 1d10!; each card's relations kept (its Tier 3 above its Tier 2 in about the same proportion). **Claude's choices:** a plain die, or a die and a flat number; the nearest average, the closer proportion on a tie. **A Minor enemy's Tier 2 is 1d10 (5.5), not 5.8 to 6:** no single die with a flat number averages 5.8 to 6 without "!" (every such line averages a whole number and a half); 1 + 1d10 (6.5) or 2d4 + 1 (6.0, two dice) are the other ways, his to choose. Crack the Ground keeps its two dice (20 + 2d12).
6. **Enemy staying power: "Ok, lets try":** a quarter more Health; a Minion keeps 2 ticks; CV unchanged.
7. **The NPC Rally Point: "Lets remove this rule, this is very specific and for now, not necessary".** Chapter 4 keeps one sentence: "NPCs have no Rally Points."

**The ranks (Chapter 14's table and sections):**

| | Old | New |
|---|---|---|
| Minion | 2 ticks; Basic attack 1d4 / 1d6; about 3½ to Health a turn | 2 ticks; 1d10 / 2 + 1d12; about 8 |
| Grunt | Health 18 (9 / 9); 1d4 / 1d6; about 4; a 2 AP Round Action about 5½ / 8½, or 2½ / 4½ to each of two | Health 22 (11 / 11); 1d10 / 2 + 1d12; about 9½; about 13 / 20, or 6 / 10½ |
| Standard | Health 36 (18 / 18); 1d4! / 2 + 1d6!; about 8 (a quarter of a PC, about one Rally Point); a 2 AP Round Action about 7 / 11, or 5 / 8 | Health 45 (23 / 22: Vigor takes the odd point, Claude's choice); 2 + 1d10! / 8 + 1d12!; about 19 (about two fifths of a PC's Health, about one and a half Rally Points); about 16½ / 26, or 12 / 19 |
| Elite | Health 72 (36 / 36); as a Standard; its Encounter Action about 8 more | Health 90 (45 / 45); as a Standard; about 19 more |

**The creatures' Health** (each one's own split kept as close as whole numbers allow, the floor of a third rounded up):

| Creature | Old | New |
|---|---|---|
| Goblin Sneak (Minion) | 2 ticks | 2 ticks |
| Grave Wisp (Grunt) | 18 (Vigor 6, Resolve 12) | 22 (Vigor 8, Resolve 14: 7.33 is under the floor of 8) |
| Orc Warrior (Standard) | 36 (22 / 14) | 45 (28 / 17: 27.5 / 17.5, Vigor takes the half) |
| Ogre Chieftain (Elite) | 72 (44 / 28) | 90 (55 / 35) |

**The PCs** (the pregens, level 1): Aveline 35 (23 / 12) becomes 50 (33 / 17), a Rally Point 9 becomes 13; Durgan 35 becomes 50 (33 / 17), 9 becomes 13; Sylwen 29 (17 / 12) becomes 41 (25 / 16), 8 becomes 11; Kaela 29 (19 / 10) becomes 41 (27 / 14), 8 becomes 11. The party: Health 128 becomes 182 (×1.42, not ×1.5: the species bonuses stay), one Rally Point each 34 becomes 48.

**Every creature damage line** (averages without the Critical row):

| Creature | Card | Line | Old | Old average | ×2.36 | New | New average | New ÷ old |
|---|---|---|---|---:|---:|---|---:|---:|
| Goblin Sneak | Shiv | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Goblin Sneak | Shiv | Tier 3 | 1d6 | 3.50 | 8.26 | 2 + 1d12 | 8.50 | 2.43 |
| Goblin Sneak | Jeer | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Goblin Sneak | Jeer | Tier 3 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Goblin Sneak | Knife in the Back | Tier 2 | 2 + 1d6 | 5.50 | 12.98 | 6 + 1d12 | 12.50 | 2.27 |
| Goblin Sneak | Knife in the Back | Tier 3 | 4 + 1d8 | 8.50 | 20.06 | 13 + 1d12 | 19.50 | 2.29 |
| Grave Wisp | Slipping Touch | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Grave Wisp | Slipping Touch | Tier 3 | 1d6 | 3.50 | 8.26 | 2 + 1d12 | 8.50 | 2.43 |
| Grave Wisp | Guttering Glance | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Grave Wisp | Guttering Glance | Tier 3 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Grave Wisp | Pass Through | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Grave Wisp | Pass Through | Tier 3 | 1 + 1d6 | 4.50 | 10.62 | 4 + 1d12 | 10.50 | 2.33 |
| Grave Wisp | Dying Flare | Tier 1 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Grave Wisp | Dying Flare | Tier 2 | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Orc Warrior | Hamstringing Axe | Tier 2 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Orc Warrior | Hamstringing Axe | Tier 3 | 2 + 1d6! | 6.20 | 14.63 | 8 + 1d12! | 15.09 | 2.43 |
| Orc Warrior | Barbed Javelin | Tier 2 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Orc Warrior | Barbed Javelin | Tier 3 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Orc Warrior | Barbed Javelin | its Lingering | 1d4 | 2.50 | 5.90 | 1d10 | 5.50 | 2.20 |
| Orc Warrior | War Howl | Tier 1 | 1 + 1d6! | 5.20 | 12.27 | 5 + 1d12! | 12.09 | 2.33 |
| Orc Warrior | War Howl | Tier 2 | 1 + 1d4! | 4.33 | 10.23 | 4 + 1d10! | 10.11 | 2.33 |
| Ogre Chieftain | Crushing Grip | Tier 2 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Ogre Chieftain | Crushing Grip | Tier 3 | 2 + 1d6! | 6.20 | 14.63 | 8 + 1d12! | 15.09 | 2.43 |
| Ogre Chieftain | Roar | Tier 2 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Ogre Chieftain | Roar | Tier 3 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Ogre Chieftain | Great Sweep | Tier 2 | 2 + 1d6 | 5.50 | 12.98 | 6 + 1d12 | 12.50 | 2.27 |
| Ogre Chieftain | Great Sweep | Tier 3 | 4 + 1d8 | 8.50 | 20.06 | 13 + 1d12 | 19.50 | 2.29 |
| Ogre Chieftain | Hurled Goblin | Tier 2 | 1d4! | 3.33 | 7.87 | 2 + 1d10! | 8.11 | 2.43 |
| Ogre Chieftain | Hurled Goblin | Tier 3 | 1 + 1d6! | 5.20 | 12.27 | 5 + 1d12! | 12.09 | 2.33 |
| Ogre Chieftain | Crack the Ground | Tier 1 | 5 + 2d8 | 14.00 | 33.04 | 20 + 2d12 | 33.00 | 2.36 |
| Ogre Chieftain | Crack the Ground | Tier 2 | 3 + 1d8 | 7.50 | 17.70 | 11 + 1d12 | 17.50 | 2.33 |
| Ogre Chieftain | Backhand | Effect | 1 | 1.00 | 2.36 | 2 | 2.00 | 2.00 |

**An estimate (Claude's arithmetic, not a decision; the next playtest checks it):** the three fights cost **1.0 Rally Point a PC** on average. Enemy damage ×2.36 against the pregens' Health ×1.42 (×1.5 for the class values, the species bonuses unchanged) is **×1.66 in share of Health** (×1.57 if Health had grown by the whole half); the lines as written land between ×2.2 (the Minor enemies' 1d10) and ×2.43 (the Standard's and the Elite's Basic attacks). **A quarter more enemy Health** gives the enemies about a quarter more turns (×1.25). **Judge's reduction took about a tenth to a fifth** of the raw damage; without it about ×1.1 to ×1.25 more lands. Multiplied: 1.0 × 1.66 × 1.25 ≈ 2.1 before Judge, **about 2.3 to 2.6 Rally Points a PC with it gone: the notes' Hard** (above 2, up to 3), not the Normal 1½ the plan was built on. A Down becomes likely where Crack the Ground lands (its Tier 1 averages 33 against an Archer's 41). If the playtest confirms it, the levers are the ones on the table: the class Actions' pass (his next), the dice back toward the 5.8 to 6 line, or fewer enemies.

**Noted for later, not now (his words):** the class Actions' rebalance is his next pass with Claude (Quick Shots, Strafe, then Demoralize; Hit and Run's automation with it; Smite after seeing Feint's change); the small creatures' attacks (seven of ten Shivs missed) "to do after the new numbers are in"; the disarmed NPC and the loot sentence together, "after I am happy with the current playtest".

**Next:** a playtest of the same fight on these numbers (the four pregens against the Ogre Chieftain, the Orc Warrior, the Grave Wisp and two Goblin Sneaks), then the class Actions' pass.

---

## The creatures' Reactions rebuilt (2026-11-27; the record: `reactions-design.md`, batch 3)

Decided with the action economy (a Reaction costs 1 AP of the creature's next turn; AP regained at the end of the turn; no Reaction Point); **built in the book (Chapter 14) and Foundry v0.0.535**:
- **Blood for Blood** (Orc Warrior): unchanged.
- **Backhand** (Ogre Chieftain): *Trigger:* an enemy ends its turn adjacent to the ogre. *Effect:* [V] 1d6 Bl and Pushed 2. It no longer throws a PC in the middle of its move.
- **Dying Flare** (Grave Wisp): 0R; *Trigger:* the wisp's damage reaches its Health Pool; the Special "then the wisp goes Down" goes.
- **Goblin Shriek** (Goblin Sneak; was Shriek and Scatter): *Trigger:* a Goblin ally goes Down; the goblin uses Jeer (1A) against the triggering creature; no Evade.
- **A rule for Chapter 14:** a creature, ally or enemy named by a Tag is one with that Tag ("a Goblin ally").
