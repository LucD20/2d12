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

