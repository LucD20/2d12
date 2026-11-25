# What defines an encounter's difficulty, and in what order monster math is built

**Date:** 2026-11-25. **Asked by Lucas,** opening the Bestiary's rebuild: "We need to decide what comes first in the design as well: Numbers, roles/ranks, what do we compare them to, what defines a difficulty of an encounter (here i am guessing is Rally points uses/hp lost)."

**What was read, and how far to trust it.** One independent researcher, one pass; the full report (about 5,800 words, every source and link) is `raw/2026-11-25-encounter-difficulty-and-design-order.md`. **This file is Claude's summary of it.** Most pages were read through a summarizing tool: **check a quote on its page before repeating it** (the 13th Age SRD and Paizo's monster chapter were read as raw text). Marks: [read], [checked], [lead], [memory], and [judgment] for the researcher's own reconstruction. **Designers do not state their order of design in print: this held again** (it was also the finding of `skills-or-magic-first.md`). No statement of order or target was found from Heinsoo, Seifter, Colville, Introcaso or the Lancer, Nimble and Daggerheart designers. Part B is therefore mostly analysts' reconstruction.

**Other games' rules and opinions, never 2d12's. Nothing here is decided.**

---

## Part A. What defines difficulty

### 1. Every rulebook uses two yardsticks at once

**Resources spent at the easy end, a character dying at the hard end. None defines a band by a percentage of hit points.**

| Game | Its words | Judged |
|---|---|---|
| D&D 3e | an encounter of the party's level "should expend about 20% of their resources"; a fifth "would probably wipe them out" [checked] | as a slice of a day |
| 13th Age | "a full heal-up after approximately 4 regular battles, 3 hard battles, or 2 regular battles and 1 very hard battle" [read] | a day, by rule |
| D&D 5e (2014) | Medium "usually has one or two scary moments"; Deadly "could be lethal for one or more player characters" [read] | a day (six to eight fights, which tables didn't run) |
| Pathfinder 2e | Moderate "a serious challenge", the party "ready to continue on"; Severe "a good chance a character could die"; Extreme "an even match" [read] | alone; full hit points assumed by tables, never stated |
| Draw Steel | Standard battles "deplete some of the heroes' Stamina and Recoveries", death "uncommon"; Hard "winnable, but the heroes need to play smart to survive" [read] | a day, and the day's state changes the budget |
| Daggerheart | −1 point for "easier or shorter", +2 for "harder or longer": one dial [read] | alone |

### 2. The yardsticks, and what each is good and bad at

1. **Share of the party's hit points lost.** What analysts measure, and the only one with a published way to calibrate from play (Tom Dunn: per fight, the levels, the monsters, the damage dealt). He reads 5e's bands as 0.15 / 0.30 / 0.45 / 0.70 of the party's hit points. **Its weakness is spread:** with ordinary variance "only the Easy encounter is on target more than 50% of the time"; a fight that averages 15.5 of 30 hit points lost has a standard deviation of 8.8; longer fights have less spread [checked].
2. **Daily resources spent.** The same quantity at the scale of a day. The Angry GM: attrition makes the game "less about whether encounters kill you and more about how well you handle each encounter", and is unfinished until stopping costs something [checked].
3. **The chance a PC drops.** How the dangerous bands are worded everywhere. Teos Abadia: a challenging fight is one with "a character going down"; five or six rounds with no one down is only Medium [checked].
4. **The chance of defeat.** The ceiling (Pathfinder's Extreme). In Dunn's model the party still wins about 89% at the top of Hard: too flat to separate the lower bands [checked].
5. **Rounds.** Neal Zupancic: one round a "flash", two "quick", three "standard", four "extended" (feels harder: "enemies get more attacks"), five "long", six or more a "slog" [checked]. An input more than a measure.
6. **How hard the players must think.** Draw Steel's Hard, Pathfinder's Low ("very poor tactics"). The Angry GM: "fights become boring once it becomes obvious the heroes have won (or lost)" [checked].
7. **Variance.** A different fight at the same average.
8. **The ratio of turns.** Lancer's community rule; Crawford: one non-legendary monster of the party's level "will be overwhelmed" [checked].

**The eight are not rivals** [judgment]: 1 and 2 are one quantity at two scales; 3 and 4 are the tail of its spread; 5 and 8 are inputs that move it; 6 is what the table feels. **A definition that names one average (1 or 2) and one tail (3) covers what the published games cover.**

### 3. A pooled total hides a drop

Abadia's arithmetic: three monsters need about 5.5 rounds to empty five PCs' pooled hit points, and one PC drops in three: "PCs are smart. They will focus fire", and so do monsters [checked]. **No source proposes "PCs dropped" as a formal measure;** the rulebooks do it in words. Zupancic: cut enemy hit points by 20 to 40% in a fight where PCs will go down, because their lost turns lengthen it [checked].

### 4. The day

- **Where a pool exists, the target is three to five fights a rest:** 3e four at 20%; 13th Age four; Draw Steel "4 to 6 Victories' worth"; Lancer "3-4 combats"; 5e, by Mearls's account, "about 20 rounds of combat between long rests"; 4e's book gave no number, and fans measured about a fifth of resources a fight [read / checked].
- **The seam where both models fail is the same: the budget assumes a state of the party the GM doesn't control.** Attrition breaks when players set the pace (the fifteen-minute day); per-fight balance makes weaker fights worthless (they "can never contribute to the challenge", Alexander) and, with resources always full, "every Encounter should be some flavor of very deadly" (The Angry GM's observation) [checked].
- **Only Draw Steel feeds the day's state into the budget:** every 2 Victories count as one more hero. 13th Age does the opposite: a fixed count and a loss in the story for stopping early (renamed in 2e because "no one wanted to flee") [read].
- **A fresh party in a one-fight day is above the norm** (Lancer one-shots: players spend everything): the fix found is to start worn, not to add enemies, which only lengthens the fight [checked].

### 5. Length

**Three rounds is the commonest stated target** (5e's CR arithmetic, Draw Steel's timed objectives, Zupancic) [checked / read]. Draw Steel's tables report 2 to 4 rounds; 4e aimed at a monster "lifespan of five rounds" and ran long, fixed twice (an R&D house rule halving hit points in 2008; damage raised in 2010) [checked]. In Dunn's worked example the likeliest finish is the start of round 3 [checked]. Length and difficulty are tied: a longer fight feels harder.

---

## Part B. The order of design

### 1. What designers said

- **5e (Crawford, through Mike Shea's notes):** a target rating or a concept, abilities, an internal spreadsheet, a check against published monsters; the DMG's table was reverse-engineered afterwards and isn't used [checked].
- **4e and 5e's baseline (Mearls):** expected party damage was encounter powers, then at-wills, with dailies averaged over the day; it "does not work for boss monsters" [checked].
- **Pathfinder 2e:** "top-down", from "benchmark final numbers"; concept and road map, stat block, abilities, a reality check; anchors to PCs are written in (High AC "is close to what a PC fighter would have") [read].
- **4e's minion (Schubert):** reasons from the PC actions a monster should absorb, then keeps both hit rates on the normal scale [read]. **4e's 2010 revision (Bilsland):** began from one test, whether monsters threatened PCs [checked].
- **Draw Steel (Introcaso, second-hand):** the resource loop (Heroic Resources, Victories) came first, "because... that gameplay loop is more important than your core mechanic"; heroes before the Director's side; Malice last. "Nothing is a better test of your design work than actually seeing it in action" [checked].

### 2. What analysts reconstructed

- **5e:** armor class is the value a baseline PC of that level hits 65% of the time; hit points are that party's expected damage over three rounds; published monsters have hit points about 3 × their damage a round [checked: Blog of Holding, EN World].
- **The identity** (Zupancic; a homebrew guide, "Combat Math"): **enemy hit points = the rounds wanted × the party's damage that lands in a round; enemy damage = the party's hit points ÷ the rounds ÷ a difficulty factor** [checked].
- **Dunn: difficulty is the rounds the party needs divided by the rounds the monsters need.** At his reading of 5e's bands the monsters need about 6.7, 3.3 and 2.2 times as many rounds as the party (Easy, Medium, Hard) [checked; the inversion is the researcher's]. **So "one monster = one PC" never means equal statistics: the asymmetry is the difficulty, and the healing pool carries the difference.**
- **What a monster is compared to:** a baseline PC of its level (5e, Pathfinder), a party of four (3e), and, as the last check everywhere, the published monsters. **The benchmark drifts when it is at-will damage** (Mearls's account); Dunn averages over classes and shifts the thresholds for strong or weak groups [checked].

### 3. The common skeleton

[judgment, from the formulas of 4e, 13th Age and Draw Steel and the accounts above]

1. **The day:** fights a rest (three to five), where a pool exists.
2. **The standard fight:** one standard monster a PC, about three rounds, the party expected to win.
3. **The baseline PC:** chance to hit, damage that lands in a round, hit points.
4. **The standard monster's row:** hit points from the rounds × the damage that lands; damage from the share of a PC's hit points the fight should cost.
5. **Roles as offsets** on that row; **ranks as multiples** of it in budget and staying power, with threat scaled by actions or targets.
6. **Difficulty bands** as the budget plus or minus PCs' worth.
7. **Play, then a retune,** in every documented case toward fewer hit points and more damage.

The other two skeletons found: **the rating calculator** (3e, 5e: concept, abilities, a calculator against a baseline party, a summed budget with a multiplier for numbers; its documented failure is the baseline) and **no arithmetic** (the OSR: difficulty is information given before the fight).

### 4. Checking the numbers

- **Spreadsheet, then play; the retunes on record are large and late** (4e two years after release; 5e's budget contradicted its own example day) [checked].
- **What simulations miss:** positioning and layout, monster synergies, party composition, focus fire as a decision (a 2026 paper presenting a Foundry-based simulator, abstract only; Crawford's "white room" remark) [checked].
- **Measured at the table:** Dunn's calibration; Zupancic: record the party's real damage each full round before setting enemy hit points [checked].

---

## Sources

The raw report holds every link. Most used: Tom Dunn, The Finished Book (https://tomedunn.github.io/the-finished-book/theory/variability-encounter-difficulty, https://tomedunn.github.io/the-finished-book/theory/adventuring-day-history/); Neal Zupancic, Nine Sides (https://ninesides.substack.com/p/balancing-combat-for-length-in-d); Teos Abadia, Alphastream (https://alphastream.org/index.php/2021/06/04/why-so-many-dms-have-trouble-challenging-players/); the Alexandrian (https://thealexandrian.net/wordpress/1669/roleplaying-games/revisiting-encounter-design, https://thealexandrian.net/?p=50454); The Angry GM (https://theangrygm.com/the-lost-adventuring-day-part-i-merely-building-an-a); Blog of Holding (https://www.blogofholding.com/?p=7338); Sly Flourish's notes on Crawford (https://slyflourish.com/deep_dive_with_crawford.html); Combat Math (https://www.combatmath.com/games/5e/how-much-damage-should-monsters-do/); the 13th Age SRD (https://www.13thagesrd.com/combat-rules/); Draw Steel's Monster Basics (https://steelcompendium.io/v2/Read/bestiary/monster-basics/); Hardcastle and Guzdial's simulator paper (https://arxiv.org/abs/2610.38975, abstract only).

**Not found or not opened:** the 4e and 2024 DMGs' own wording; DM David; Tales of the Valiant; Wizards' Design & Development columns; academic work on perceived difficulty in turn-based tactics; any formal "PCs dropped" measure; Reddit, RPG.net.
