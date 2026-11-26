# Is Health the right measure of a fight's difficulty, and what else do tactical games measure or tune with

**Date:** 2026-11-26. **Asked by Lucas,** after playtests 8 to 10, on how a fight's difficulty is measured and tuned: "What did the research brought about this? Is Health the correct way to balance difficulty? Take a look on 2d12, analyze to see if the Health calculation is right or if there is another mechanic useable. I think it is the only way to balance it around, but maybe research could help out."

**What was read, and how far to trust it.** One researcher, one pass. Every page was read through a summarizing reader: a quote marked [checked] was returned from its page by that reader, not read by eye, so **check a quote on its page before repeating it.** A search tool's summary of a page nobody opened is a [lead]; what Claude knows without a page is [memory]; Claude's own arithmetic is [mine]. Part A is Claude's own reasoning on 2d12's record and playtests; each point there is marked [arithmetic], [from the playtests] or [judgment]. Not opened: the 4e and 2024 Dungeon Master's Guides themselves, Lancer's core GM chapter, ICON, Strike!, Trespasser, Fabula Ultima's book, Reddit, RPG.net (section 6).

**Other games' rules and opinions, and Claude's arithmetic on playtest values, never 2d12's rules. Nothing here is decided.** Today's changes (PC Health up by half, enemy damage about × 2.36, enemy Health × 1.25, a 3 to 4 round fight, a Rally Point still a quarter of Health) are used as given; this file does not derive or judge them.

---

## 1. The question

Two parts. (A) Is "the share of the PCs' Health a fight costs", counted in Rally Points a PC with the PCs that went Down beside it (`book/bestiary-design.md`, decision 1), the right measure, and is its arithmetic sound. (B) What else do tactical RPGs measure a fight's difficulty by, and which levers do they tune it with.

## 2. What our research already held

- **`encounter-difficulty.md`** (2026-11-25) answered most of "what do games measure". Every rulebook read words its easy fights by resources spent and its hard fights by a character dropping; none prints a percentage. It lists eight yardsticks (share of hit points lost, daily resources, the chance a PC drops, the chance of defeat, rounds, how hard the players must think, variance, the ratio of turns) and concludes that one average plus one tail covers what the published games cover. A pooled total hides a drop (Teos Abadia). Tom Dunn's measure of 5e: with ordinary dice "only the Easy encounter is on target more than 50% of the time". Where a daily pool exists the target is three to five fights a rest. **Decision 1 was taken from this file.**
- **`monster-building.md`:** budgets count bodies (Lancer, ICON) or a scalar (XP, Encounter Value); a scalar needs a second rule against one big monster or a swarm; a rank raises threat through actions and targets, not damage a hit; the monsters' side rising (13th Age's die, Draw Steel's Malice); every retune on record went toward fewer hit points and more damage.
- **`enemies-at-the-table.md`:** what players feel: an enemy that makes them answer against one that only absorbs; a fight that is decided and goes on is the most repeated complaint.
- **`combat-length.md`:** rounds, minutes a round, rocket tag and the grind, longer fights swing less (1 / √turns), what keeps a longer fight alive (something that changes each round), morale cutting the tail.
- **`escalation-and-guard.md`, `resources-and-recovery.md`, `wounded-states.md`:** Guard against healing, a cost priced by its recovery clock, what being hurt does.

**What was missing, and what this file adds:** a check of decision 1's own arithmetic; the statistic (a mean of three fights); the levers set side by side with who uses each; the primary text of games not yet quoted (D&D 2024, Daggerheart's Fear, Draw Steel's objectives, Gloomhaven's clock); and Dunn's derivation, which defines difficulty the way Lucas does.

---

## 3. Part A: 2d12's own measure

### The verdict

**Health, counted as cost in Rally Points a PC with the Downs beside it, is the right primary measure for 2d12, and its arithmetic is sound. Lucas's instinct holds for the cost of a fight. It is a measure of what a fight cost, not of how dangerous or how tense it was: for those it needs one number about the worst-hit PC and one about the enemies' turns, and it needs more than three fights before a mean is believed.** [judgment, from the points below]

### Why Health is the right thing to count in this game

1. **Health is the only resource that outlasts a fight.** A Rally Point only removes damage; only a Rest gives Rally Points back; Encounter Actions, Guard and Escalation reset when the fight ends (Chapters 2 and 4). Games whose hit point measure fails (5e) fail because the day's real pool is somewhere else (spell slots). In 2d12 it is not. [judgment, from the rules]
2. **The other lasting costs all come through a Down.** A Wound roll, Momentum −1, turns lost: each starts when a PC goes Down, which the measure counts separately. [from the rules]
3. **The one analyst who derived 5e's budget from first principles defines difficulty the same way.** Tom Dunn: "for this derivation, lets use damage dealt to the PCs to define encounter difficulty"; the balance is d × the PCs' hit points × their damage = the enemies' hit points × their damage, with d the share of the party's effective hit points lost [checked]. So does 3e ("about 20% of their resources") and, by its Recoveries, Draw Steel.
4. **A different primary measure of the same family adds nothing.** Dunn's other form is the rounds the monsters need to empty the party over the rounds the party needs. On the three playtests: 128 Health ÷ 15 net damage a round = 8.4 rounds; 130 enemy Health ÷ 64 a round = 2.0 rounds; the ratio is 4.1, and its inverse is 0.24, the same number as the share of Health lost (35 of 128, 27%). It is the cost seen from the other side. [arithmetic]

### Is the arithmetic of decision 1 sound

The sum (all damage that reached Health, healed in the fight or not) over the sum of what one Rally Point of each PC removes.

| What could be counted wrong | What happens | Verdict |
|---|---|---|
| Damage healed and taken again | Both hits count. The Rally Point that healed the first is one of the Rally Points the cost says the party needs, so nothing is counted twice. | Right [arithmetic] |
| Overkill on a PC that went Down | "Damage keeps accumulating after you are Down" (Chapter 4), and it must be removed before the PC stands. It is a real cost here, unlike games where hit points stop at 0. | Right [from the rules] |
| A Rally Point spent mid-fight | Already inside the sum (first row). Its AP is not (see Guard). | Right [arithmetic] |
| A heal that costs no Rally Point | The damage counts but nothing was paid. Today's cards heal through Rally Points; a later free heal would make the cost read high. | A watch item [judgment] |
| **Nonlethal damage** | It reaches Health, so it counts. **Corrected by Lucas, 2026-11-26:** the book still prints "a Breather removes all of it", but he decided otherwise in the magic brainstorm (`magic-design.md`, decisions 55 and 56: Nonlethal leaves on a Sleep, the Breather is deleted; `decided.md`, "decided, not written"). With that rule Nonlethal costs a Rally Point or a heal like any damage, so the measure counts it correctly. | **No gap once Chapter 4 is updated** [from the rules] |
| A Rally Point that removes less than its full value | A PC with 1 damage (Kaela, playtest 8) either stays at 28 of 29 or wastes most of a Rally Point. Real Rally Points are whole and each PC's own, so the party spends a little more than the cost says, or stays a little hurt. | Small, always in the same direction [arithmetic] |
| "A quarter of Health" | A Rally Point is ⌈Health ÷ 4⌉: 34 of the pregens' 128 is 26.6%. The edges 1¼, 2 and 3 are 33%, 53% and 80% of Health, wider than the first targets (25%, 35 to 45%, 55 to 65%). | Sound; the edges are his [arithmetic] |
| Damage soaked by Guard or a reduction | Never reaches Health, by the rule. Its price was an AP or a Reaction, paid as party damage not dealt, so the fight runs longer and the enemies get more turns: it comes back as damage, partly. The Log already prints the raw ("attempted") damage and the plain-party cost beside the net. | Right as cost; read the raw number for the encounter and the net for the party [judgment] |
| A turn lost to a condition | Same route as Guard: a longer fight, more enemy turns. Invisible when the fight still ends on time. | Missed directly [judgment] |
| Wounds | Counted only as "a Down"; a severe Wound and a trivial one read the same. | Coarse, acceptable [judgment] |
| Momentum and Escalation carried out | A win gives Momentum +1, which makes the next fight cheaper; the cost credits nothing for it. A fight at Momentum 2 is a different fight from the same enemies at 0. | Compare fights only at the same Momentum and starting Health, or print both beside the cost [judgment] |
| Once-a-day resources | Daily Actions exist in the rules (a Sleep renews them); none is in the playtest party. When magic and Daily Actions arrive, a fight won by spending them will read cheap. | Not a problem today; the first thing to recheck when magic lands [judgment] |

**Two things the Log does that the definition does not say** (read in `foundry/twod12/module/enclog.mjs`, not changed): its cost is every PC's net damage over the Rally Point sum, so damage from an ally or from itself counts (right: it reached Health); and it prints no count of Downs beside the cost, though it records each one. Decision 1 says "two things, always together"; the report's first line carries one.

### Is a mean the right statistic

1. **Three fights cannot place the mean in a band.** 1.3, 1.15 and 0.6 average 1.0 with a standard deviation of 0.37, so the mean is known to about ± 0.2 at best, and by the honest small-sample interval to about ± 0.9 (0.1 to 1.9). "Easy" and "Normal" are both inside it. About nine fights of the same encounter put the mean within ± ¼ Rally Point. Dunn's 5e number is worse (8.8 on 15.5, 57%). [arithmetic]
2. **A fight's cost is a result, not the encounter's difficulty.** The Log names one fight "Easy" from its own cost. Playtest 10's 0.6 was the goblins rolling four Tier 1s. The encounter's difficulty is the middle of many results plus how often a PC goes Down; one fight's label should read as "this fight cost Easy". [judgment]
3. **The worst-hit PC takes about twice the party's share.** Aveline 54% against the party's 35% (playtest 8), Durgan 74% against 30% (playtest 9: 30 of the 50 raw), Aveline 31% against 16% (playtest 10): 1.5, 2.4 and 1.9 times. A Down is one PC at 100%, so on this evidence Downs begin when the party's share is near 50%, a cost of about 1.9: the top of Normal, which is what the difficulty sentences say. **The mean predicts the Downs only through this ratio, and the ratio is the enemies' choice of targets.** [from the playtests, three fights, weak]
4. **The day ends at the worst-hit PC's pool, not at the party's average.** Rally Points are each PC's own. Playtest 9 cost 1.15 a PC; Durgan needs 2.9 of his 7, Kaela none. Two such "easy" fights and the Paladin is nearly out while the Archers are full. A party-wide mean overstates how many fights the party can take whenever the enemies keep striking the same PCs, which they did (the two Archers took 12 and 1, 6 and 0, 0 and 1 in the three fights, of 29 Health each). [arithmetic, from the playtests]
5. **So the numbers that carry what the mean hides are: the highest share of Health any PC was missing at any moment, and the Downs.** No source proposes a formal "PCs dropped" measure (`encounter-difficulty.md`); the rulebooks do it in words, as decision 2's sentences do. [judgment]

### What the measure does not see that the table feels

- **Tension.** Playtest 8 cost 1.3 (Normal) and Lucas wrote "It also felt easy until the ogre did his turn" and "almost brainless, doing attack after attack". The measure said Normal and the table said easy. [from the playtests]
- **How close it came.** A fight that costs 1.5 spread evenly never threatens anyone; the same 1.5 on one PC is a Down. Same cost, different fight (point 3).
- **Whether choices mattered.** Nobody kept an AP for Guard, nobody spent a Rally Point in a fight, the Basic Attack was the best button. A cost cannot show that; the AP spent by kind can (the Log records AP kept each turn).
- **Whether the enemies got to play.** Three of five enemies had one turn or less in every fight. The cost was low because of it, and the cost does not say why.
- **Time at the table.** The Log has rounds and turns; no clock (`combat-length.md` asked for minutes already).
- The research's line for all of this: The Angry GM, "fights become boring once it becomes obvious the heroes have won (or lost)"; Abadia, a challenging fight is one with "a character going down" (`encounter-difficulty.md`).

### Does it mean the same after today's changes

- **The unit holds.** The cost is a ratio. With Health up by half and a Rally Point still a quarter, one Rally Point a PC is still about 26% of the party's Health and the same share of the day. The edges keep their meaning. [arithmetic]
- **The same cost now arrives in bigger pieces.** A Standard's turn was about 8 of 32 (a quarter of a PC, four turns to a Down); at × 2.36 on Health × 1.5 it is about 19 of 48 (two fifths, two and a half turns to a Down). Three Standards on one PC in a round were 24 of 29; now 57 of 44. **At the same mean cost a Down is much nearer, and the spread from fight to fight is wider.** The Downs line stops being words. [arithmetic]
- **The playtests' cost would move from about 1.0 to about 1.6 to 1.9** if nothing else changed: damage against Health up by 1.57, and enemies with a quarter more Health take about a fifth more turns (`combat-length.md`'s count, 36 to 45 Health). That is Normal, at its top, and by point 3 it is where the worst-hit PC is near 100%. [arithmetic, rough; the first playtest on the new numbers replaces it]
- **Flat protections weigh less** unless they were scaled too (Guard 2 an AP, Judge 2, Shield of Faith 3 against hits twice as big): the gap between raw and net, a fifth today, should shrink. The measure is not affected; the class margin it reports is. [arithmetic]

---

## 4. Part B: what other games budget with, promise and tune

### The games side by side

| Game | The budget counts | The promise, in its words | The main lever |
|---|---|---|---|
| **D&D 4e** | XP: one standard monster of the party's level a PC; easy 1 to 2 levels under, hard 2 to 4 over [lead, a forum quoting the book] | Not found in its own words. Fans measured about a fifth of resources a fight (`encounter-difficulty.md`) | Monster level (+1 to hit and defenses) and role; healing surges as the day's pool [memory] |
| **D&D 5e (2014)** | XP thresholds a PC, times a multiplier for the number of monsters (× 1 for one, × 2 for three to six, × 4 for fifteen) | Medium: "usually has one or two scary moments", "no casualties". Hard: "could go badly", "a slim chance that one or more characters might die". Deadly: "could be lethal for one or more player characters". The day: "about six to eight medium or hard encounters" [checked] | Challenge rating; the multiplier: "The more monsters there are, the more attack rolls you're making" [checked] |
| **D&D 5e (2024)** | An XP budget a PC, spent as a plain sum ("two skeletons would count as 100 XP"); the multiplier is not in the method described [checked, D&D Beyond's article]. The adventuring day is gone [lead] | Low: "might have a dangerous moment or two", "no casualties". Moderate: stripped of resources "it has the potential to be lethal for one or more characters". High: "could be lethal for one or more characters", needing "cunning tactics and quick thinking" [checked] | Challenge rating alone |
| **Pathfinder 2e** | XP by level difference: 10 (level −4) to 160 (level +4); 80 is Moderate for four | Low: "a veneer of difficulty and typically use some of the party's resources". Moderate: "a serious challenge", "unlikely to overpower them". Severe: "the hardest encounters most groups of characters have a good chance to defeat". Extreme: "an even match"; use it "only if you're willing to take the chance the entire party will die" [checked] | Level: accuracy and criticals on both sides. A boss is a creature 2 to 4 levels up |
| **13th Age** | One monster of the party's level a PC; lower levels count as fractions, higher as multiples [checked] | A day by rule: "After approximately four battles, characters earn a full heal-up"; stopping early or fleeing "entails a campaign loss" [checked] | Level; the escalation die (+1 a round to the PCs, to +6) |
| **Draw Steel** | Encounter Value against the party's encounter strength (4 + 2 a level a hero); "For every 2 Victories the heroes have earned on average, increase the party's encounter strength" | Easy: "won't threaten their lives" unless Stamina and Recoveries are already low. Hard: "winnable, but the heroes need to play smart to survive". Extreme: "the heroes aren't likely to survive". The day: "from 4 to 6 Victories' worth of combat encounters" [checked] | Stamina and damage by level; **Malice**: the Director gains "the number of heroes in the battle, plus the combat round number" each round; objectives with "A typical encounter duration is 3 rounds" [checked] |
| **Lancer** | Bodies and turns. Community practice: enemy turns "around 1.5x your player count", enemy structure "between 1.5-2x your player count"; "throw the core book balancing rules out the window for the most part" [checked, a GM's guide] | None found (core book not read) | Activations; the sitrep (Escort is lost if the objective "hasn't been extracted at the end of the eighth round" [checked, Massif's data]); reinforcements, "not too many at a time" |
| **ICON 1.5** | Bodies: players + 1, an Elite 2, a Legend the whole budget (`monster-building.md`) | Not found | Turns (a Legend acts once a PC) |
| **Daggerheart** | Battle Points: 3 a PC + 2; −1 for "easier or shorter", +2 for "harder or longer" [lead here; read in `encounter-difficulty.md`] | None by band. **The scene's weight is stated in Fear to spend:** incidental "0-1 Fear", standard "2-4 Fear", major "4-8 Fear", climactic "6-12 Fear" [checked, an SRD mirror] | Fear: gained "whenever a PC rolls with Fear", at most 12, spent to "Interrupt the players to steal the spotlight", for an adversary's Fear Feature [checked] |
| **Gloomhaven** | Scenario level: the party's average level ÷ 2, rounded up; −1 easy, +1 hard, +2 very hard; the monsters take that level [lead] | Win before the cards run out: a character who cannot play two cards or rest is exhausted; "If all characters become exhausted during a scenario, the scenario is lost" [lead, rules pages seen as a summary] | **The hand as a clock:** time is the resource, and a card can be lost to cancel damage [memory], so damage converts into time |
| **Fabula Ultima** | Soldiers tied to the number of PCs; an elite or a champion stands for several [lead] | Not found | Ultima Points for a villain [lead] |
| **Sly Flourish's benchmark (5e)** | The sum of challenge ratings against a quarter of the PCs' levels | Only the ceiling: "An encounter may be deadly if..."; "a loose gauge, not a hard rule" [checked] | The GM's dials in play (below) |

**What the table shows.** The budget is a count of bodies or a scalar in every game. **The promise is never the budget's own unit:** it is resources at the easy end, a character dropping in the middle, the party dying at the top, as `encounter-difficulty.md` found; the three new texts (D&D 2024, Daggerheart, Draw Steel's objectives) fit. D&D 2024 dropped both the day and the multiplier and kept only the tail ("lethal for one or more"). **2d12 is the only one here whose designers' measure is a number that play can check after each fight**; the nearest is Dunn's, a fan's.

### The levers, one by one

| Lever | Who uses it | Its strength | Its known complaint |
|---|---|---|---|
| **Enemy hit points** | All | Sets the fight's length, and through length the number of enemy turns | Alone it is "a bag of hit points"; every retune on record cut it (`monster-building.md`) |
| **Enemy damage** | All; Shea: raising it by about half goes unnoticed [checked] | Sets the cost directly; the lever every retune raised | In big pieces it makes Downs and swing; in small pieces flat reductions erase it |
| **Accuracy and defenses** | Pathfinder 2e, 4e, 13th Age (level) | One number moves hits, criticals and conditions together: the "level + 2 boss" feels dangerous | The PCs' own abilities stop working (`enemies-at-the-table.md`); Lucas already refused it (no Defense or Modifier from rank) |
| **Action economy: the number of enemy turns** | Lancer and ICON budget in it; 5e 2014's multiplier; legendary and villain actions; Draw Steel's solo with two turns | The best predictor analysts name. Dunn: the multiplier "represents the extra damage some creatures are able to do while their enemies are busy dealing with their allies", and it depends on the order the enemies fall [checked] | Disputed cause: a forum reading that groups hurt more because they survive longer, not because they act more [lead]. A lone monster starves; many small ones die before acting |
| **Swing: damage a hit against its spread** | Dunn's variability; 13th Age's fixed monster damage; Hughes on 2024: at level 1 one big hit can drop a PC, and who acts first can decide it [checked] | Sets how often the tail (a Down) happens at the same mean | Rocket tag when high; flat and lifeless when low (Lucas on NPC dice: "barely any variation") |
| **Control and denial** | 4e, Pathfinder 2e, Draw Steel | Removes turns, which is action economy from the other side | Against one big enemy it is "roughly five times more effective" (Shea, `monster-building.md`); the counters (legendary resistance) are the most disliked rule |
| **Focus and target rules** | 4e marks, Draw Steel taunts, Pathfinder's Champion; Draw Steel capped how much one squad can put on one hero | Decides whether a given cost is a scare or a Down | Left to the GM it is the hidden dial of every budget: "PCs are smart. They will focus fire", and so do monsters (Abadia) |
| **Reinforcements and waves** | Lancer (standard); Shea's dial "during combat if the in-world circumstances make sense" [checked] | Keeps enemy turns coming without one fat stat block; gives each round a new state | Players notice a forced wave; the budget must count late arrivals |
| **Objectives and round clocks** | Lancer's sitreps; Draw Steel's ten objectives, harder "if the duration is 2 rounds or less", easier or harder by 5 rounds [checked]; Kill Team (`combat-length.md`) | Difficulty no longer needs lethality: the party can lose without anyone dropping | Scenario work for every fight; not every fight is one |
| **Terrain and hazards** | Lancer, Draw Steel, Gloomhaven (trap damage by scenario level [lead]) | Changes the fight without touching a stat block | Rarely inside the budget ("skip this step" the first time, the Lancer guide says) |
| **Attrition across fights** | 13th Age (four battles), 5e 2014 (six to eight), Draw Steel (Recoveries), 4e (surges) | Makes an easy fight matter | Breaks when players set the pace; D&D 2024 gave it up |
| **Per-fight reset** | Pathfinder 2e in practice | Each fight can be tuned alone | "Every Encounter should be some flavor of very deadly" (`encounter-difficulty.md`) |
| **A GM resource that rises** | Draw Steel's Malice (round number + heroes), Daggerheart's Fear (a stated spend by scene) | Pressure grows as the fight goes on, and the GM holds a visible, bounded dial; Daggerheart states a scene's weight in it | Draw Steel had to recalculate it; Daggerheart tables report hitting the cap of 12 when the guidance is followed [lead] |
| **A players' resource that rises** | 13th Age's die, Draw Steel's Victories and heroic resources | Ends fights and rewards pressing on | The budget must know it: Draw Steel feeds Victories into the budget, 13th Age's math "expects" the die |
| **Morale and retreat** | Draw Steel: at a success condition "the heroes' enemies flee or surrender"; a solo at a quarter of its Stamina; Pathfinder's Morale; 13th Age's flee at a campaign loss [checked] | Cuts the decided tail; lets a hard fight be lost without a wipe | "No one wanted to flee" (13th Age renamed it) |
| **Information** | The OSR (difficulty told before the fight); telegraphed boss actions (Draw Steel's villain actions) | The players choose their risk | Not a number; nothing to budget |
| **Time itself** | Gloomhaven's hand | One currency for damage, power and length | A board game's: the scenario is the unit, not the day |

**What analysts say a designer should measure.** Dunn: the damage dealt to the PCs against their effective hit points, with the enemies' count and the order they fall as the correction [checked]. Zupancic: the party's real damage a round, recorded at the table, before any enemy number is set (`encounter-difficulty.md`). Hughes judges a table by whether its top band gives "a meaningful chance of death for one of more characters" [checked]. Abadia: whether a character went down. None measures tension directly; no academic work on felt difficulty was found, now or in the earlier pass.

---

## 5. How it applies to 2d12

### The levers 2d12 has

| Lever | In 2d12 | Used today? |
|---|---|---|
| Enemy Health and damage | The Default Standard, the ranks, CV | Yes: the whole of today's retune |
| Targets a turn | Specials that hit two creatures (G6) | Yes |
| Accuracy by rank | Refused on purpose (decision 12) | No, by design |
| The number of enemy turns | Zipper order; an Elite's AP; Minions in squads | **Leaking:** three of five enemies get one turn or less; the plan's 6½ full turns do not all happen [from the playtests] |
| Focus and spread | Judge, Taunted, Shield of Faith on the PCs' side; "the enemies spread their attacks" as the baseline (decision 3) | **One-sided:** the enemies struck the two Paladins almost only, so the cost is real and the Archers' pools are untouched |
| Guard from unspent AP | Chapter 2 | **Never:** no AP kept in three fights |
| A Rally Point mid-fight | Steel Yourself | **Never** |
| Control | Immobilized, Hindered, Grabbed, Prone, Feint | A little; a two-round fight leaves it no time (`combat-length.md`) |
| A players' resource that rises | Escalation, Momentum | Reaches 2 or 3; decision 3 keeps Momentum out of the budget (Draw Steel puts Victories in) |
| Attrition across fights | Rally Points, Rests, Wounds | Yes: it is what the measure counts |
| A stake on the budget being right | Weapon Mastery: 1 Mastery for winning "an encounter that was normal or harder", by the difficulty "the encounter was built with" (Chapter 15) | Yes: an encounter whose built difficulty overstates its cost hands out Mastery cheaply |

**What it lacks** (nothing in rules-src today): a GM resource that rises (an NPC's Escalation is open, not refused); reinforcements counted in the CV; objectives or round clocks; a morale or surrender rule (Chapter 15 names "fled or surrendered" as a win, and no rule produces either); telegraphed enemy actions.

### Options for Lucas

**1. Keep the measure as it is.** Cost in Rally Points a PC, and the Downs. It is right for cost, checkable after every fight, and in the unit the players count their day in. What stays unseen: who paid, and why a fight was cheap.

**2. Keep it, and have the Encounter Log print companion numbers** (each from what the Log already records; `enclog.mjs` read only):

- **Worst-hit PC.** For each PC, the highest share of its Health Pool it was missing at any moment of the fight; print the highest of them and whose it was. Computed by walking the log in order: start at the Health Pool minus the starting Health the Log snapshots, add each damage entry's Vigor and Resolve, subtract each heal entry, keep the peak, divide by the Health Pool. With no healing in the fight it equals the "Taken %" the Log already prints for each PC (54%, 74%, 31% in the three playtests). 100% or more is a Down.
- **Enemy turns.** The turns the enemies took over the turns they would have had if all had lived to the last round (the NPCs' logged turns ÷ the number of NPCs × the rounds), and how many enemies had one turn or less. Playtest 10: 6 turns of a possible 15; three of five with one or less.
- **The Downs beside the cost,** on the report's first line (the Log records each Down and does not count them there), so decision 1's "always together" is what the line shows.
- Already printed, to keep reading: the raw ("attempted") damage and the plain-party cost, which rate the encounter where the net rates the party; the AP kept and the Rally Points spent in the fight, which are the record of "did a choice exist".

**3. A different primary measure.** The chance a PC goes Down (what the hard bands of every rulebook mean): it needs dozens of fights or a simulator, so it cannot be read off one playtest. The rounds ratio (Dunn): the same number as the cost (section 3). Turns or bodies (Lancer, ICON): a way to build a fight, not to measure what it did. None replaces the cost.

**Suggestion (Claude's, for Lucas to take or leave): option 2, with the first two numbers.** Reasons: (a) the cost is right and the research found nothing better as a primary measure, so nothing should be replaced; (b) after today's changes a Standard's turn is two fifths of a PC, so the same mean cost sits much nearer a Down, and the worst-hit PC's share is the number that shows it before a Down happens; (c) the playtests' low cost came from enemies not getting their turns, which is the lever every analyst names first, and no line of the report shows it today; (d) both come from what the Log already has. Two habits to go with it: call one fight's label "this fight cost Easy", and judge an encounter's difficulty from several fights (about nine to pin the mean, fewer to see the shape); and compare fights only at the same Momentum and starting Health.

**Levers worth a look when tuning, apart from Health and damage** (other games' experience, not a proposal): the enemies' turns (who dies before acting, who arrives later) and where the enemies aim (spread or focus), because those two move the cost and the Downs without touching a number on a stat block.

---

## 6. Not checked or unverified

- **Every quote came through a summarizing reader**; none was read by eye on its page.
- **D&D 4e's own wording** of its difficulty bands and any promise in resources: a forum's quote only. **The 2024 Dungeon Master's Guide:** quoted through D&D Beyond's article, not the book; that the multiplier and the adventuring day were removed rests on the article's example and on forum thread titles.
- **Lancer's core GM chapter** (its own balancing rule, the structure rules, the core sitreps' round limits): not read. The 1.5 figures are one community guide's. Only the Escort sitrep's limit was seen.
- **Daggerheart's Battle Points adjustments:** two SRD mirrors returned 404; the formula is a search summary plus the earlier file's reading. The Fear table is from one mirror.
- **Gloomhaven:** all from search summaries of rules pages; the lost card to cancel damage is from memory.
- **Fabula Ultima, ICON, Strike!, Trespasser:** nothing new found; the searches returned other games.
- **The Angry GM and the Alexandrian on action economy:** no page opened in this pass; what is cited is what `encounter-difficulty.md` already held. The claim that group danger is caused by survival, not by actions, is one forum post seen as a summary.
- **No work on perceived difficulty or tension in turn-based tactics** was found (the same gap as on 2026-11-25).
- **Part A's ratios** (the worst-hit PC at about twice the party's share; Downs starting near a cost of 1.9) rest on three runs of one encounter with one party.
- **Part A's arithmetic on today's changes** assumes the multipliers as given and nothing else changed; whether Guard, Judge and Shield of Faith were scaled was not known.
- **In the Log:** whether a damage entry keeps Lethal apart from Nonlethal was not confirmed (the sums read are Vigor and Resolve); two Downs of one PC in the same round would be recorded as one state.

## 7. Sources

- Tom Dunn, The Finished Book, "XP and encounter balancing": https://tomedunn.github.io/the-finished-book/theory/xp-and-encounter-balancing/ ; "Variability of encounter difficulty": https://tomedunn.github.io/the-finished-book/theory/variability-encounter-difficulty
- D&D 5e (2014) Basic Rules, Building Combat Encounters: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/building-combat-encounters
- D&D Beyond, "Creating combat encounters using the new Dungeon Master's Guide" (2024): https://www.dndbeyond.com/posts/1901-creating-combat-encounters-using-the-new-dungeon
- EN World, "Dungeons & Dragons Has Done Away With the Adventuring Day": https://www.enworld.org/goto/post?id=9483813 [lead]
- Paul Hughes, Blog of Holding, "Do the 2024 5e Dungeon Master's Guide XP Tables Work?": https://www.blogofholding.com/?p=8402
- Pathfinder 2e GM Core, Encounter Design, Archives of Nethys: https://2e.aonprd.com/Rules.aspx?ID=2716
- 13th Age SRD, Combat Rules: https://www.13thagesrd.com/combat-rules/ ; Running the Game: https://www.13thagesrd.com/running-the-game/
- Draw Steel, Monster Basics (difficulty, encounter strength, Malice, objectives), Steel Compendium: https://steelcompendium.io/v2/Read/bestiary/monster-basics/
- "LANCER: The GM's Guide To Building Encounters": https://owacsender.substack.com/p/the-gms-guide-to-building-lancer ; Massif Press's lancer-data, Sitreps: https://github-wiki-see.page/m/massif-press/lancer-data/wiki/Sitreps
- Daggerheart SRD 1.0, GM guide (a mirror): https://rules.omnisgm.com/en/daggerheart/srd-1.0/gmguide/ ; EN World, Daggerheart discussion on Fear spent a scene: https://www.enworld.org/threads/daggerheart-discussion.718730/post-9916400 [lead]
- Gloomhaven rules pages (Dized), scenario level: https://rules.dized.com/gloomhaven/rule/scenario-setup/scenario-level ; exhaustion: https://rules.dized.com/gloomhaven/rule/player-turns/exhaustion [leads]
- Fabula Ultima, a scan seen only as a search summary: https://anyflip.com/rrgzl/rtkq/basic/301-350 [lead]
- Mike Shea, Sly Flourish, "2024 DMG Encounter Building Versus the Lazy Benchmark": https://slyflourish.com/2024_dmg_encounter_building_versus_the_lazy_benchmark.html ; "Dials of Monster Difficulty": https://slyflourish.com/dials_of_monster_difficulty.html
- EN World, on 4e's bands (a forum quoting the book): https://www.enworld.org/threads/unearthed-arcana-presents-alternative-encounter-building-guidelines.663840/page-12 [lead]; on the cause of group danger: https://www.enworld.org/goto/post?id=8917406 [lead]
- In the project: `book/bestiary-design.md` (decisions 1 to 4, 13, 14, "The designers' measure of a fight, out of the book"), `book/playtest-8.md`, `book/playtest-9.md`, `book/playtest-10.md`, `book/rules-src/04-health.md`, `02-turns.md`, `15-gear.md` (Weapon Mastery), `book/ruler/fight-identity.mjs`, `foundry/twod12/module/enclog.mjs` (read only), and the research files of section 2.
