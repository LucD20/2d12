# The Bestiary: the design record

> **Status (2026-11-25): OPENED, research done, nothing decided. No number in this file is a proposal for the Bestiary: the numbers come one at a time, with Lucas, from section 7 on.** This file is the Bestiary's record, the way `magic-design.md` is magic's and `talents-design.md` the Talents': his words, what stays, what the core gives a monster to be measured against, the research, the problems, the order of the decisions, then each decision as it is taken. It is batches 6 and 7 of `core-rework.md` (section P), opened ahead of them as research.

---

## 1. Lucas's words

- **2026-11-25, opening this piece:** "We will need to work on the bestiary. Dont consider any number from the bestiary. Keep only the rules (like items are mainly only flavor, actions are their own action, not copying PCs, standard = 1 PC = 100 CV, minions have ticks, not hp, etc). Number will be from the ground up."
- **The research he asked for:** "Search how in ttrpgs people like about enemies, minions, enemies above and below level. Compare to the core 2d12, see monster building from PF2e, 4e, Draw Steel on their own rules. See other tactical systems that have good monster building, balance reputation."
- **How we build:** "Then we will build slowly, one by one, numbers. We need to decide what comes first in the design as well: Numbers, roles/ranks, what do we compare them to, what defines a difficulty of an encounter (here i am guessing is Rally points uses/hp lost)."
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

These are the PC side's facts, from the rules as they stand on this branch (2026-11-25, after batches 1 to 4; the class change in progress, the Arts leaving and Steady Draw's dE, is not in them). They are exact dice math or a card's arithmetic, not the SIM.

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

- **A PC's turn on paper, standing still, against DC 13, by the cards of this branch** (a 2 AP Hallmark Action and two Basic Attacks, the second with its At-will Bane): a Longsword Paladin about 34 ([V] and a little [R]); a Hunting Bow Archer about 22. **At the table, playtest 7 measured 13 to 14 a PC turn** (57 a round for four PCs; before batch 3's stronger Basic Attack): about half of the paper number, lost to movement, Banes, Cover, range, overkill, turns spent on something else. **Which of the two a monster's Health is counted against is the first thing to settle** (section 6).
- **Stays to re-read when the class change lands:** the Arts leave, Steady Draw gains a dE once an encounter (1R), Escalation unlocks Actions (batch 5).

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
14. **The Default Standard's damage a turn:** the cost of decision 2, spread over the enemy turns the fight really has. **The identity:** the share of a PC's Health one Standard turn takes = the fight's cost (as a share of the party's Health) ÷ (rounds × the share of enemy turns that happen before their owner dies). *As an illustration of the method only, with G9's normal fight (40%), 3½ rounds and six enemy turns in ten happening: about a fifth of a PC's Health a Standard turn, after Guard and reductions. Not a proposal.*
15. **Its shape:** the Basic attack and a Special across 4 AP, the Tiers' ratio, how much of it is [R].
16. **To the table:** four Default Standards against the four pregens, measured by decision 1's two yardsticks. Expect to cut Health and raise damage (finding 7).
17. **The ranks as multiples,** in this order: Grunt, Elite, Minion (ticks, damage, the exchange rate derived from the PC turns a squad absorbs and the damage it deals before it dies), Boss (Health a PC, output a round).
18. **The roles as offsets** on the Standard's row.
19. **The budget:** bands in CV, the caps (Minions a PC, a Boss), party size, one sentence on what CV can't see (P8).
20. **Pricing Actions (G11):** ready lines for each rank and AP; riders.
21. **The examples rebuilt (G12)**, then playtest 8.

---

## 7. Decisions

None yet. **Decision 1 is asked (2026-11-25): what a fight's difficulty is measured by.**
