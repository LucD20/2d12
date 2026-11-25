# What defines an encounter's difficulty, and in what order monster math is built (raw report)

**Date:** 2026-11-25

**The question:** before any number of the new bestiary, what comes first: the numbers, the roles and ranks, what a monster is compared to, and what defines an encounter's difficulty (the designer's guess: "Rally Points used / Health lost"). Part A: every definition of difficulty found. Part B: the order of the design decisions in the games that documented it.

**How far to trust it.** Other games' rules and other people's opinions only, never 2d12's.

- **[read]** rules text on a page that opened. **[checked]** an opinion or an account on a page that opened (author and site named). **[lead]** seen only in a search summary, or on a page that refused. **[memory]** Claude's own knowledge, no page opened. **[judgment]** an inference drawn here from the marked findings (not a source).
- Almost every page was read through a summarizing tool, not seen raw: check a quote on its page before repeating it. Two exceptions were read as raw text: the 13th Age SRD ("Running the Game" PDF) and Paizo's free monster-creation chapter (PDF).
- **Designers almost never state the order in print.** That finding of an earlier pass holds here. Section B0 separates the few things a designer said from what analysts reconstructed. Most of Part B's "order" is reconstruction.
- What did not open is listed at the end. ICON, Nimble and Fabula Ultima are [memory] only, and weak.

---

# Part A. What defines difficulty

## A1. The published definitions, in the games' own words

### Takeaway
Every game that defines difficulty in words uses two yardsticks at once: **resources spent** at the low end and **the chance that a character (then the party) dies** at the high end. None defines a band by a percentage of hit points lost. The games differ on whether a fight is judged alone (Pathfinder 2e) or as a slice of a day (3e, 4e, 13th Age, 5e 2014, Draw Steel, Lancer).

### Findings
- **D&D 3e.** An encounter of the party's level "should expend about 20% of their resources"; four such use the party up and "A fifth encounter would probably wipe them out". The DMG's own mix: about 30% of encounters below the party's level, 50% at it, 15% one to four levels above, 5% five or more above. [checked: Justin Alexander quoting the 3e DMG, The Alexandrian] https://thealexandrian.net/wordpress/1669/roleplaying-games/revisiting-encounter-design . Jonathan Tweet confirms 3e was "balanced for four average battles between heal-ups". [checked: Tweet's column reprinted on EN World] https://www.enworld.org/threads/jonathan-tweet-third-edition-and-per-day-spells.670507/
- **D&D 4e.** "A standard encounter is of the party's level, or one level higher"; hard encounters "really test the characters' resources, and might force them to take an extended rest at the end". [checked: the DMG as quoted by posters pemerton and Illithidbix, EN World] https://www.enworld.org/threads/unearthed-arcana-presents-alternative-encounter-building-guidelines.663840/page-12 and https://www.enworld.org/threads/how-many-encounters-between-each-extended-rest-and-does-it-change-with-tier.567646/ . **The book gives no number of fights a day**: heroic characters rest "when surges get dangerously low"; posters estimate four or five (two milestones), and one recalls the early intent as "upwards of 8". [checked: same threads] The designers' first advice to DMs coming from 3e: "start thinking about 1 monster per PC". [checked: Critical Hits' report of the Gen Con 2008 adventure-design seminar, unattributed panel] https://critical-hits.com//2008/08/25/adventure-design-seminar-gencon-2008 . Surges: a quarter of maximum hit points each, about 6 to 9 plus Constitution modifier a day [memory]; one group reported 1.5 to 2 surges a PC a fight, and a commenter put the daily total at 3 to 4 times hit points [lead: EN World search summary].
- **13th Age.** A fair fight at levels 1 to 4 is "one enemy creature of the party's level per PC" (one level higher at levels 5 to 7, two higher at 8 to 10: the fair fight's definition moves, the monster table does not). "A party should get a full heal-up after approximately 4 regular battles, 3 hard battles, or 2 regular battles and 1 very hard battle." Resting early: "they suffer a campaign loss". A level comes after three or four heal-ups. Harder fights are made with a list of "unfair" features (numbers, reinforcements, terrain, nastier specials), not a bigger formula. [read: raw SRD text] https://pelgranepress.com/media/SRD/RunningtheGame.pdf . Tweet: the rule makes "the last fight before a heal-up" the toughest. [checked: EN World reprint, above] Recoveries: usually 8 a character [memory].
- **D&D 5e (2014).** Easy "doesn't tax the characters' resources or put them in serious peril"; Medium "usually has one or two scary moments"; Hard "could go badly for the adventurers"; Deadly "could be lethal for one or more player characters". The day: "about six to eight medium or hard encounters", with two short rests. [read] https://www.dndbeyond.com/sources/dnd/basic-rules-2014/building-combat-encounters
- **D&D 2024.** Low / Moderate / High; the definitions were seen only in a summary: Moderate "could go badly for the adventurers without healing and other resources", High "could be lethal for one or more characters". [lead: Roll20's page refused] The adventuring day is gone from the text; the DMG's own example adventures still have about four to six dangerous encounters a day. [checked: The Angry GM] https://theangrygm.com/the-lost-adventuring-day-part-i-merely-building-an-adventure-day/
- **Pathfinder 2e (GM Core).** Trivial: "essentially no chance of losing". Low: "typically use some of the party's resources". Moderate: "a serious challenge", with resources managed to be "ready to continue on". Severe: "the hardest encounters most groups of characters have a good chance to defeat", where "there's a good chance a character could die, and a small chance the whole group could" and "a lack of resources can easily turn" it. Extreme: "likely to be an even match", for "a fully rested group", only "if you're willing to take the chance the entire party will die". Budgets for four: 40 / 60 / 80 / 120 / 160 XP. No number of fights a day. [read] https://2e.aonprd.com/Rules.aspx?ID=2715 . A creature of the party's level costs 40 XP [checked: Tom Dunn, The Finished Book] https://tomedunn.github.io/the-finished-book/theory/xp-dnd-vs-pathfinder , so four of them (one a PC) is the Extreme budget, the "even match". [judgment from the two]
- **Draw Steel.** A hero's encounter strength is 4 + 2 a level; the party's is the sum. Standard is between that and that plus one hero; Hard up to plus three heroes. Easy "won't threaten their lives"; Standard battles "deplete some of the heroes' Stamina and Recoveries"; Hard are "winnable, but the heroes need to play smart to survive"; Extreme are threats "the heroes aren't likely to survive". "For every 2 Victories the heroes have earned on average, increase the party's encounter strength as if there were another hero". Heroes handle "from 4 to 6 Victories' worth of combat encounters" before a respite; a Hard fight is worth 2 Victories. [read on a community mirror of the rules, Steel Compendium] https://steelcompendium.io/v2/Read/bestiary/monster-basics/ . Recoveries: 8 to 12 a hero, a third of Stamina each [memory].
- **Lancer.** The core book (p. 264) expects "3-4 combats between each Full Repair", a rest every one or two. [checked: Ben Torell quoting it, Gordian Blade] https://gordianblade.substack.com/p/balancing-lancer-combat-for-one-shots . Community practice sizes a fight by **activations and structure, not points**: enemy activations about 1.5 times the players, total enemy structure 1.5 to 2 times; the objective "largely determines the rest"; "minimize the amount of pure deathmatches". The same author calls the core book's own balancing "swingier" and blind to action economy. [checked: Robert Babaev, OWACS Ender] https://owacsender.substack.com/p/the-gms-guide-to-building-lancer . Several sitreps end on a fixed round [memory].
- **Daggerheart.** A budget with no defined bands: (3 × PCs) + 2 Battle Points; −1 for "easier or shorter", +2 for "harder or longer"; Minions (a group the size of the party) 1, Standard 2, Leader 3, Bruiser 4, Solo 5. Difficulty and length are one dial. An adversary's Hit Points "determine the number of successful attack rolls the PCs must make". [read on a community SRD] https://callmepartario.github.io/og-dhsrd
- **OSR / Shadowdark.** No budget. "Combat is not a test you can assume you have a good chance of winning, nor a good chance of losing"; balancing "restricts the probability space"; danger is telegraphed and retreat is a real choice. [checked: Murkdice] https://murkdice.substack.com/p/unbalanced-combat-is-cool . Shadowdark "doesn't do balance in a granular CR kind of way" [lead: a forum post].
- **ICON, Nimble, Fabula Ultima.** Not opened. ICON budgets by foes per player, with Elites counting double and a Legend replacing a whole side; Fabula Ultima counts an elite as two soldiers with two turns and a champion as several; Nimble compares summed monster levels to summed hero levels. [memory, weak]
- **Mike Mearls's new game (2025-26).** Monsters are "ideal opponents for characters of equal level"; ranks set how many per PC (minions four, troopers two; solos). [lead: search summary of his Patreon post "Refining Monsters"; the page refused]

### Gaps
- The 4e DMG's and the 2024 DMG's exact wording were not read on their own pages. No Paizo designer statement on "each fight assumed at full health" was found; forum posters say so [lead], and the rules text above only implies it.

## A2. The eight yardsticks: what each is good and bad at

### Takeaway
Hit points lost as a share of the party's total is the yardstick analysts actually measure, and the only one with a published calibration method. Its documented weakness is spread: at ordinary variance a fight lands in its intended band less than half the time. Words about a character dropping are the yardstick the rulebooks reach for when a fight is meant to be dangerous.

### Findings
1. **Share of the party's hit points lost.** Tom Dunn defines difficulty as the damage the PCs take "relative to their maximum hit points", equal (at constant damage) to the ratio of the rounds each side needs to win; he reads 5e's bands as 0.15 Easy, 0.30 Medium, 0.45 Hard, 0.70 Deadly. [checked: Tom Dunn, The Finished Book] https://tomedunn.github.io/the-finished-book/theory/variability-encounter-difficulty . Strength: it can be measured at a table. His calibration method needs only each PC's level, each monster, and the damage the monsters dealt, compared with the budget's prediction. [checked] https://tomedunn.github.io/the-finished-book/theory/calibrating-encounter-math/ . Weakness: see 7; and by his own account the model leaves out early defeats and healing.
2. **Daily resources spent (attrition).** 3e's 20%; the surge / recovery / Recoveries budgets. The Angry GM: attrition means "the game's less about whether encounters kill you and more about how well you handle each encounter"; without it "there's never a downside to exploring literally every side path"; but alone it leads only to a generic game over, "an unfinished Inertia mechanic" until something makes time or resting cost. [checked] https://theangrygm.com/office-hours-is-attrition-inertia/ . Weakness: the GM building fight four does not know what is left, and the measure only works if the day's length is fixed (A3).
3. **The chance a PC drops.** 5e's Deadly, Pathfinder's Severe and the 2024 High are defined this way (A1). Teos Abadia (Alphastream): a challenging fight is one with "a character going down" and a "slim chance someone might die"; five or six rounds with no one down is only Medium. [checked: Alphastream, post and comments] https://alphastream.org/index.php/2021/06/04/why-so-many-dms-have-trouble-challenging-players/ . Sly Flourish defines deadly as "characters may die", and his benchmark as "a loose gauge, not a hard rule". [checked] https://slyflourish.com/the_lazy_encounter_benchmark.html
4. **The chance of defeat.** Pathfinder's Extreme. In Dunn's model (four PCs against one monster, three rounds, ordinary variance) the party still wins about 89% of the time at the top of Hard, falling to 50% where expected damage equals the party's hit points. [checked: variability article, above] Useful as the ceiling; too flat to tell Easy from Medium.
5. **Rounds.** Neal Zupancic: one round is a "flash", two "quick" (read by players as easy), three "standard", four "extended" (feels harder: "enemies get more attacks"), five "long", six or more a "slog". [checked: Nine Sides] https://ninesides.substack.com/p/balancing-combat-for-length-in-d . Dunn: "increasing the encounter length decreases the effective variability", in the party's favor. [checked] Rounds measure length and feel; they are a design input more than a difficulty.
6. **How hard the players must think.** Draw Steel's Hard ("need to play smart to survive") and Pathfinder's Low (danger only from "very poor tactics") define a band by play quality. The Angry GM locates an encounter's life in decision points: a player with no useful options "is about three die rolls from losing interest", and "fights become boring once it becomes obvious the heroes have won (or lost)". [checked] https://theangrygm.com/four-things-youve-never-heard-of-that-make-encounters-not-suck/ . Not measurable in numbers; no source tried.
7. **Variance.** Dunn: "increasing the overall damage variability makes unlikely outcomes more likely to occur"; with realistic spread "only the Easy encounter is on target more than 50% of the time", the others as likely to feel a band higher or lower; low-level 5e is deadlier than its labels because monster damage is more variable there. In a small example a fight that averages 15.5 of 30 hit points lost has a standard deviation of 8.8. [checked: both variability articles] https://tomedunn.github.io/the-finished-book/theory/variability-combat . A day of one or two deadly fights instead of many medium ones is a higher-variance day in which the party is "far more likely to lose outright" [lead: summary of a Substack essay that redirected].
8. **Action-economy ratio.** Lancer's community rule is a ratio of activations (A1). Jeremy Crawford: a single non-legendary monster of the party's level "will be overwhelmed". [checked: Mike Shea's notes of his interview, Sly Flourish] https://slyflourish.com/deep_dive_with_crawford.html . Draw Steel caps creatures at eight a hero and keeps initiative groups about equal to the heroes. [read] Pathfinder 2e has no multiplier for numbers because its budget is centered on about one creature a PC. [checked: Dunn, xp article] One guide claims one enemy turn a round plays a band easier [lead].

### Inferences
- [judgment] The eight are not rivals. 1 and 2 are the same quantity at two scales (a fight, a day); 3 and 4 are the tail of 1's distribution; 5 and 8 are inputs that move 1 and its spread; 6 is what the table feels. A definition that names one average (1 or 2) and one tail (3) covers what the published games cover.

## A3. Attrition against per-encounter balance

### Takeaway
Both fail in documented ways, and the failure is always the same seam: the fight's budget assumes a state of the party that the GM does not control. Games with a surge-like pool aim at **three to five fights a rest**; the two that add a pressure to continue handle it oppositely (13th Age punishes stopping; Draw Steel raises the next fight).

### Findings
- **What breaks attrition.** Tweet: "Whatever per-day powers are balanced at one rate of fights per day are necessarily unbalanced at faster or slower rates"; players talk the DM into resting; the "alpha strike". [checked: EN World reprint] Justin Alexander: the fifteen-minute day comes from players controlling the pace, and "the death of the wandering monster tables" removed the check. [checked] https://thealexandrian.net/wordpress/1911/roleplaying-games/the-death-of-the-wandering-monster . Mearls (October 2025): 5e "was built around the assumption that characters would engage in about 20 rounds of combat between long rests", with limited-use damage averaged over the day as 4e had done; "A party that unloads with their best powers simply breaks the system" and can "vaporize boss monsters in a round or even less". [checked: Wargamer quoting his Bluesky posts] https://www.wargamer.com/dnd/mike-mearls-boss-fight
- **Why 5e's six to eight failed.** The DMG's thresholds became minimums where the earlier Basic Rules had them as maximums, so its own example day is about 68% over its own daily budget; an even Medium / Hard mix fits about 4.2 fights. Dunn calls it probably an error. [checked] https://tomedunn.github.io/the-finished-book/theory/adventuring-day-history/ . The labels did not match what DMs meant by the words, so tables ran fewer, harder fights. [checked: EN World posters] https://www.enworld.org/threads/mike-mearls-explains-why-your-boss-monsters-die-too-easily.715658/page-7 . The Angry GM's reading of how it feels: players "start to sweat in the third encounter", four or five feel like a good challenge, six is the limit. [checked: Lost Adventuring Day]
- **What breaks per-encounter balance.** Alexander: when resources reset, weaker encounters "can never contribute to the challenge of the game"; every fight must sit in a narrow band, and a precisely balanced fight cannot take reinforcements. [checked] https://thealexandrian.net/?p=50454 . The Angry GM draws the consequence: with near-full resources, "every Encounter should be some flavor of very deadly" (an observation, he says, not advice). [checked] Alexander on 3e: making every fight level-appropriate made combat longer and bred the fifteen-minute day; most classic modules' encounters were two to five levels below the party. [checked: Revisiting Encounter Design]
- **A fresh party against the norm.** Torell on Lancer one-shots: with one fight expected, players spend Core Power and Overcharge freely, "greatly boosting PC power level above the general norms"; adding NPCs only lengthens the fight; his fix is to start damaged or to spend the resources in the narrative first. [checked]
- **The party's state unknown to the GM.** Draw Steel's answer is the only one found that feeds the day's state into the budget (Victories). Community tools recompute the budget from current Victories; solos are a known weak point at high Victories [lead]. Alexander's answer is procedural: "aiming low and then adjusting up", re-judging after each scenario. [checked] https://thealexandrian.net/?p=49967
- **Counter-pressures.** 13th Age: a fixed count plus the campaign loss (a stick) [read]. Draw Steel: Victories give the heroes more starting resource each fight and the Director more Malice and a bigger budget; Recoveries fall meanwhile; the choice to push on or rest is the players'. [read for the budget; lead for Malice and the players' choice, EN World posters] https://www.enworld.org/goto/post?id=9824702

### Gaps
- No statement by Heinsoo, Colville or Introcaso on why they chose their numbers of fights was found. How many surges a standard 4e fight was designed to cost is not stated anywhere found.

## A4. How long a fight should last

### Findings
- **Three rounds is the commonest stated target.** 5e's CR arithmetic counts a monster's damage over "the first three rounds of combat", and Paul Hughes cites the designers' stated target of three rounds. [checked: Blog of Holding] https://www.blogofholding.com/?p=7338 . Draw Steel gives three rounds as the typical length of its timed objectives. [read] Zupancic: design almost every fight for three. [checked]
- **4e ran long, and the fix came twice.** At Gen Con 2008 the panel mentioned an unofficial R&D house rule, "halving the HP of all monsters to speed up combat". [checked: Critical Hits] Monster Manual 3 (2010) raised damage to about 8 + level; before it, groups cut hit points by a third and raised damage by a quarter. [checked: Blog of Holding https://blogofholding.com/?p=512 ; EN World posters https://www.enworld.org/goto/post?id=5454137 ] A poster's warning: large cuts "devalue conditions" and make the game less tactical. [checked: same thread] A four-round target for 4e was seen only in a forum summary [lead].
- **The early rounds decide.** In Dunn's worked example the likeliest finish is the start of round 3 and the fight reaches round 4 only 31% of the time. [checked] The Angry GM: "always better to end an encounter early than it is to let the encounter turn boring". [checked]
- **Length and difficulty are tied.** Zupancic: a longer fight feels harder because enemies attack more; Daggerheart prices "harder or longer" as one thing. [checked; read]

## A5. Is the party's total the right measure when damage is not spread evenly?

### Findings
- Abadia's arithmetic: three CR 3 monsters need about 5.5 rounds to empty five level-5 PCs' pooled 165 hit points, yet one of them drops in three; "PCs are smart. They will focus fire", and so do monsters. A pooled total hides the drop. [checked: Alphastream]
- Zupancic advises spreading attacks, avoiding one-shots, and cutting enemy hit points by 20 to 40% in a fight where PCs will go down (their lost turns lengthen it). [checked]
- **No source was found that proposes "PCs dropped" or "the closest PC to dropping" as the formal measure.** The rulebooks do it in words at the dangerous end (A1); Dunn's model names early defeats as its missing piece.

---

# Part B. The order of design

## B0. What designers said, apart from what analysts reconstructed

**Said by designers (all short, none a full account):**
- **5e.** For an adventure the team starts from a target challenge rating; for a monster book, concept, then abilities, then the internal CR calculator, then a check against existing monsters. The DMG's table is a looser extrapolation of that calculator and tends to give higher numbers. [checked: Mike Shea's notes on Jeremy Crawford] The DMG chart was made afterwards to "reverse-engineer and simplify" the spreadsheet and is "not used as part of the process". [checked: Paul Hughes's account of the same interview] https://www.blogofholding.com/?p=7357 . James Introcaso (2018): "Choose the challenge rating you want for your monster first and then design to that challenge rating"; the table is "a solid guideline, but not gospel"; compare with published monsters; playtest. [checked: D&D Beyond] https://www.dndbeyond.com/posts/181-design-workshop-monsters
- **4e and 5e's baseline.** Mearls: expected party damage was encounter powers, then at-wills, with daily damage spread over the day; 5e copied the method. [checked: Wargamer]
- **Pathfinder 2e.** Creature statistics are "based on benchmark final numbers" ("top-down design"). The printed order: concept and road map; the stat block (level first, then abilities, defenses, hit points, Strikes and their damage); special abilities; a reality check. "Give a creature HP in the moderate range unless its theme strongly suggests" otherwise; an extreme statistic is paid for with a low one. [read: raw text of the Gamemastery Guide chapter by Logan Bonner and Mark Seifter] https://downloads.paizo.com/PZOCUP024E_PathfinderGameMasteryGuide_MonsterHazardCreation_PF2E.pdf . That these are the designers' own internal guidelines is a forum claim [lead].
- **13th Age.** Tweet: the four-battle rule turns 3e's guideline into a hard rule. [checked]
- **Draw Steel.** The book prints the finished formulas (B2), not how they were reached [read]; the store page says only "many rounds of rigorous testing" [lead].

**Reconstructed by analysts:** everything in B1 on 5e's and 4e's formulas.

## B1. What was fixed first, game by game

### Takeaway
Where the trail can be followed, the first fixed things are **the day (fights per rest), the fight (one monster per PC, about three rounds) and a baseline PC**; monster hit points and damage are derived from those; ranks are multiples and roles are offsets of one row; the bands come last; and play then forces a retune.

### Findings
- **5e, reconstructed.** The DMG's armor class column is the value a PC of level equal to the CR, built a set way, hits 65% of the time; hit points divided by 0.65 is that PC side's expected damage over three rounds. [checked: poster Sword of Spirit, EN World] https://www.enworld.org/threads/tidbit-for-monster-design.713234/ . Published monsters follow tighter lines than the DMG: attack 4 + half CR, armor class 13 + a third of CR, damage about 5 × CR (+5 below CR 8), **hit points 3 × that damage**: a monster built to last "exactly three rounds of hits" from its like. Hughes calls the fit "very carefully put together" and the DMG's trait adjustments "illusory precision". [checked: Blog of Holding] Dunn: XP is proportional to hit points × damage × 1.077^(armor class + attack bonus); the budget is the product of staying power and damage. [checked]
- **4e, reconstructed.** One row a level, shifted by role: hit points a level 8 (brute 10, artillery and lurker 6); an elite "takes double the XP budget, so they get roughly double HP and two attacks a round"; a solo four or five times the hit points; damage 8 + level after MM3, brutes 1.25 times. [lead for the hit-point formula (search summary of fan threads, which disagree on the solo); checked for elite and damage, EN World posters] Designers stated they "are no longer slaves to formulas" [lead].
- **13th Age.** The budget is the first thing on the page: one monster a PC, with a chart that makes a mook 0.2, a large monster 2 and a huge one 3 standard monsters at equal level. [read]
- **Pathfinder 2e.** A table of benchmark values by level and rating; a road map (brute, skirmisher, sniper) is a list of which rating to pick for which statistic; rank is level difference, priced by XP that doubles every two levels. [read; checked: Dunn]
- **Draw Steel.** Encounter value = (2 × level + 4) × organization; Stamina = (10 × level + role modifier) × organization; damage = (4 + level + damage modifier) × the tier's factor (0.6 / 1.1 / 1.4). Role modifiers are additive (+10 to +30 Stamina, +0 or +1 damage); organizations multiply (horde 0.5, platoon 1, elite and leader 2, solo 6, with solo Stamina 5; minions 0.5 for four). [read] A hero's strength is also 4 + 2 a level, so **a platoon monster's value equals one hero's**. [judgment from the two formulas]
- **Lancer.** NPC classes by tier (three tiers over twelve license levels), with templates that add structure and activations: Elite +1 and +1, Veteran +1 structure, Ultra +3 structure and one or two activations. [checked: Babaev] No designer account found.
- **Daggerheart.** Types priced separately (1 to 5 points), benchmark statistics by tier and type [read for costs; the benchmark tables were not reached].
- **Nimble, ICON.** Nothing found.
- **A homebrew guide that prescribes an order.** Combat Math (author unnamed): fix a baseline party (five Thief rogues, standard array); fix the fight (one monster is a medium encounter); fix the rounds (the proficiency bonus); hit points = what the party deals in those rounds at 60% to hit; damage = enough to kill the party one round after that. [checked] https://www.combatmath.com/games/5e/how-much-damage-should-monsters-do/ . Zupancic gives the same order from the GM's side, and says to measure the party's damage a round at the table first. [checked]

## B2. Time to kill, and why a monster "equal" to a PC has different numbers

### Findings
- **Hit points = rounds × the damage that lands.** Zupancic's example: 100 a round and three rounds wanted gives 300 enemy hit points. Monster damage then = party hit points ÷ target rounds ÷ a difficulty factor (3 deadly, 4 tough, 6 medium, 12 easy). [checked]
- **The asymmetry is the difficulty.** Dunn: difficulty equals the rounds the party needs divided by the rounds the monsters need (two against ten is 0.2). [checked] So his bands mean the monsters need about 6.7, 3.3 and 2.2 times as many rounds as the party at Easy, Medium and Hard. [judgment: the inverse of 0.15, 0.30, 0.45] Abadia's count gives the same picture: the monsters need 5.5 rounds, the fight lasts three. [checked]
- **So "one monster = one PC" in the budget never means equal statistics.** In Pathfinder 2e one same-level creature a PC is the even match and the Moderate fight is half of it; in 13th Age and Draw Steel one a hero is the fair or standard fight the heroes are meant to win, and the heroes' healing pool carries the difference. [judgment from A1 and B1]
- **Ranks scale staying power by the multiple and threat by actions.** 4e's elite (double hit points, two attacks), Lancer's templates (structure and activations), Draw Steel's elite (twice the Stamina, +1 damage, abilities that "typically target two creatures"). None multiplies damage a hit by the rank. [checked / read; the pattern is judgment] Mearls's proposed fix for 5e's bosses is a separate hit-point scale that assumes the alpha strike. [checked: Wargamer]
- **Other hits-to-kill rules** (a solo dying to "2 to 4 solid hits"; Cairn's split of toughness from hit points) were seen in summaries only [lead]. Healing during a fight is in none of the models found.

## B3. What a monster is compared to, and keeping the benchmark stable

### Findings
- **A baseline PC of its level** (5e's DMG, reconstructed; Pathfinder's high skill "on par with a specialized PC of the creature's level" [read]); **a party of four** (3e: a CR 5 monster suits "four 5th-level characters" [checked: Alexander]); **published monsters** (Crawford's last step; Introcaso; Pathfinder's reality check against "other creatures of the same level" [read]).
- **The benchmark drifts when the baseline is at-will damage.** Mearls's account is the clearest statement found. [checked] Dunn: the thresholds assume baseline PC power and should be shifted for stronger or weaker groups; his calibration averages over classes because builds are unknown. [checked] Sly Flourish adds "virtual" characters for strong parties. [checked] An EN World proposal computes an "Effective Character Level" per party and a threshold per pace (standard, nova, supernova). [checked: poster Stalker0] https://www.enworld.org/threads/encounter-building-building-a-better-model.683286/
- Pathfinder 2e's narrow spread is praised by forum posters as what lets its bands hold; no designer statement found [lead].

## B4. Roles and ranks: before or after the numbers

### Findings
- **Offsets and multiples of one row:** 4e, Draw Steel, 13th Age, Giffyglyph's Monster Maker (seven roles and four ranks over one level table, encounters in "monster points"; the chapters with the math were not reached [read for the outline only] https://giffyglyph.com/monstermaker/grimoire/2.1.2/en/introduction.html ). **Picks from one table:** Pathfinder 2e. **Templates on a class:** Lancer. **Types priced apart:** Daggerheart. **No ranks:** 5e, with legendary actions added beside the CR arithmetic.
- **No designer was found saying "get the standard monster right first".** The published formulas of Draw Steel, 13th Age and 4e show a standard row with everything else derived from it. [judgment]

## B5. How they validated, and what simulation missed

### Findings
- **Spreadsheet, then play.** 5e's internal spreadsheet [checked]; Hughes's "best guess" is that playtests then moved monsters "until they felt right". [checked] Introcaso: "Nothing is a better test of your design work than actually seeing it in action." [checked]
- **The retunes on record are large and late.** 4e's monster math was rewritten two years after release (A4). 5e's 2014 budget contradicted its own example day (A3). Mearls concedes the at-will baseline "does not work for boss monsters". [checked]
- **Measured at the table.** Dunn's method (A2, item 1) is the only table-calibration procedure found. Zupancic: track the party's real damage each full round before setting enemy hit points. [checked]
- **What simulations miss.** A 2026 paper presenting a Foundry-based fight simulator says the standard metrics "do not account for positioning and dungeon layout", monster synergies or party composition; its win rates correlate with the published metrics and match "some players' reported experiences" better. [checked: abstract only, Hardcastle and Guzdial] https://arxiv.org/abs/2610.38975 . Crawford: a boss should not be judged in a "white room"; the order of fights, the setting and the guards are the three levers. [checked: Shea's notes] 4e-era posters: terrain, movement and conditions "swamp" a duel model, and focus fire is modeled as a modifier, not a decision. [lead: search summary of an EN World thread] Dunn names his own model's limits: one monster, no early defeats, no healing. [checked]
- **Perceived against measured difficulty (XCOM-style).** No academic work found; only fan tests of XCOM's displayed hit chances [lead].

## B6. The common skeletons

[judgment, from B0 to B5]

**Skeleton 1, the budget identity (4e, 13th Age, Draw Steel; Pathfinder 2e without the day):**
1. The day: fights per rest (three to five), where a pool exists.
2. The standard fight: one standard monster a PC, about three rounds, the party expected to win.
3. The baseline PC at each level: chance to hit, damage that lands a round, hit points.
4. The standard monster's row: hit points from rounds × the damage that lands; damage from the share of a PC's hit points the fight should cost.
5. Roles as offsets on that row; ranks as multiples of it in budget and staying power, with threat scaled by actions or targets.
6. Difficulty bands as the budget plus or minus PCs' worth (Draw Steel: one hero; Pathfinder: steps of 20 to 40 XP of a 40 XP creature).
7. Play, then a retune (in every documented case toward fewer hit points and more damage).

**Skeleton 2, the rating calculator (3e, 5e):** concept, abilities, a calculator that rates the result against a baseline party over three rounds, a check against published monsters, then a summed budget with a multiplier for numbers. Its documented failure is the baseline (at-will damage; one day length).

**Skeleton 3, no arithmetic (OSR):** difficulty is information given to the players before the fight.

---

## Questions this raises for 2d12

Questions only.
- Is difficulty to be one number, or an average (Health lost, Rally Points spent) and a tail (a PC Down) stated together, as every rulebook above does in words?
- Rally Points spent in a fight and Health lost in it are one quantity seen twice only if Rally Points are spent to refill Health afterwards: which is measured, the Health lost or the state at the next fight's start?
- With a Wound table and Momentum lost on a Down, is "a PC Down" already the band line between a normal and a hard fight, more than a percentage?
- The pacing guide is five fights a Rest against 6 or 7 Rally Points: what does a standard fight cost in Rally Points a PC, and is that number fixed before the monsters'?
- Momentum grows as Rally Points fall: is the next fight's budget meant to follow it (Draw Steel), or is Momentum the reward the budget ignores?
- "One Standard = one PC = 100": is that the even match (Pathfinder) or the fight the party is meant to win (13th Age, Draw Steel)?
- How many rounds is a normal fight meant to last, given that Escalation rises each round?
- Which PC is the baseline, at which Modifier, using which Actions, and at Tier 2 or the average over the three Tiers?
- Do ranks multiply Health and add Actions, or multiply damage?
- What is recorded at the table in playtest 6 (per fight: Health lost by each PC, Rally Points spent, PCs Down, rounds) so the bands can be calibrated from play?

## What did not open, and what was not found

- **Refused or empty:** Roll20's 2024 "Plan Encounters" (403); Paizo's forum thread "Encounter Balance: The Math and the Monsters" and blog "Building Monsters for Fun and Profit" (403); Mearls's Patreon "Refining Monsters" (403); a Notion page on Draw Steel monster design (empty); a Daggerheart SRD mirror (404); the Substack "A Unified Theory of 5e Combat Design" (redirect); the 4e fan thread's attached formula PDF; Giffyglyph's math chapters (only the introduction opened); Mearls's Bluesky posts themselves (read through Wargamer).
- **Searched, nothing usable found:** DM David on encounter budgets; Kobold Press on Tales of the Valiant's monster math (only Steve Winter's 5e series, first part); Level Up A5e; Rob Heinsoo, Mark Seifter, Matt Colville or James Introcaso (on Draw Steel) stating an order or a target; Massif Press's designers; Evan Diaz; Spenser Starke; the Wizards "Design & Development" columns; academic work on perceived difficulty in turn-based tactics; any formal "PCs dropped" metric.
- **Not searched:** "The Monsters Know", "Dungeon Dad", r/RPGdesign, RPG.net, Giant in the Playground.
- **[memory] only:** 4e's surge counts and role table; 13th Age's and Draw Steel's recovery counts; Lancer's sitrep round limits; ICON, Nimble, Fabula Ultima.
