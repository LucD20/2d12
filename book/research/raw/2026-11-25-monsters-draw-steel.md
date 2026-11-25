# Draw Steel (MCDM): monster design, encounter building, reception; and the road from "Action Oriented Monsters" and "Flee, Mortals!"

Date: 2026-11-25. One pass, by one research agent; not re-checked by a second reader.

**How far to trust it.** Every statement carries one of four marks, and a URL.

- **[read]** = rules text I read on a page or file I opened (here mostly the Markdown of *Draw Steel: Monsters* and *Draw Steel: Heroes* in the Steel Compendium's GitHub repositories, cloned on 2026-11-25: `data-bestiary-md` at commit dc2d9ef, 2026-03-19; `data-rules-md` at 3b6c84b, 2026-03-26. This is the Creator License text of the published books, so it includes the errata up to those dates).
- **[checked]** = an opinion, a report of play, or a second-hand account of what a designer said, read on a page I opened. Where a rule of another game is known only as a forum poster's quotation, it is [checked] with "as quoted by".
- **[lead]** = seen only in a search summary, or on a page that refused: not verified.
- **[memory]** = from my own knowledge, no page opened. Treat as a pointer, not a fact.
- **[computed]** = my own arithmetic on [read] numbers. The inputs are the game's, the conclusion is mine.

What is weak in this file: **the designers' own words are almost all second-hand** (MCDM's Patreon, Backerkit and YouTube did not open; the fan podcast Goblin Points, which summarizes those posts month by month, did). **Reception is thin**: a handful of EN World posts, one review, one fan guide, two blogs; Reddit and Discord were not read. No statement here is about 2d12's rules, except the closing list of questions.

Sources used most:
- Monsters, "Monster Basics" chapter: https://github.com/SteelCompendium/data-bestiary-md/blob/main/Monsters/Chapters/Monster%20Basics.md (same text: https://steelcompendium.io/v2/Read/bestiary/monster-basics/). Called **MB** below.
- Monsters, stat blocks: https://github.com/SteelCompendium/data-bestiary-md/tree/main/Monsters/Monsters. Called **SB** below.
- Heroes, "Combat" chapter: https://github.com/SteelCompendium/data-rules-md/blob/main/Chapters/Combat.md. Called **HC** below. Heroes, "Classes": https://github.com/SteelCompendium/data-rules-md/blob/main/Chapters/Classes.md (**HCl**). Kits table: https://github.com/SteelCompendium/data-rules-md/blob/main/Kits/Kits%20Table.md (**HK**).
- Goblin Points (fan podcast with transcripts; Jon de Nor): https://goblinpoints.com/ (**GP** + episode number).

---

## 1. Organizations and roles: what each is worth

### Takeaway
Six organizations, each a fixed multiple of one "platoon" monster, and a platoon monster's Encounter Value equals one hero's Encounter Strength at the same level. Organization sets Stamina, EV and how concentrated the damage is; role only shifts Stamina by a flat amount and damage by +0 or +1. Swarm is a keyword and Mount is a role, not organizations.

### Cited findings
- **The six organizations and the book's own sentence for each** [read, MB]: Minion ("made to die fast and threaten heroes en masse"; bought four at a time); Horde ("it still takes more than one of these creatures to effectively threaten a single hero of the same level"; a pure horde fight outnumbers the heroes "about two to one"); Platoon ("A single platoon creature is a decent threat to a hero of the same level", one per hero); Elite ("can usually stand up to two heroes of the same level"); Leader (buffs allies, has villain actions, stands against "two or more heroes"; normally one per battle, with other monsters; no role); Solo ("can typically stand toe-to-toe with six heroes of the same level"; no role).
- **The quick-build equivalences** [read, MB "Quick Encounter Building"]: one hero slot = eight minions = two horde = one platoon; one elite or one leader = two slots; one solo = six slots, plus one per level it is above the heroes.
- **EV formula** [read, MB "Adjusting Monster Levels"]: EV = ((2 x Level) + 4) x organization modifier. Modifiers: minion x0.5 (that EV buys four minions), horde x0.5, platoon x1, elite x2, leader x2, solo x6. A hero's Encounter Strength is 4 + 2 per level [read, MB Step 3], the same expression: **a platoon monster costs exactly one hero of its level**.
- **Published EV by level, checked against all 416 stat blocks** [read, SB front matter; my tabulation]: level 1: minions 3 (per four), horde 3, platoon 6, elite 12, leader 12, solo 36. Level 5: 7 / 7 / 14 / 28 / (no leader) / 84. Level 10: 12 / 12 / (no platoon) / 48 / 48 / 144. The formula holds for almost every block (a few outliers, e.g. a level 1 platoon at EV 8, look like data-entry slips).
- **Stamina formula** [read, MB]: ((10 x Level) + role modifier) x organization modifier, where the Stamina-only modifiers are minion x0.125 and solo x5 (others as for EV). An optional extra for a tougher non-minion: + (3 x Level) + 3.
- **Role modifiers** [read, MB "Role and Damage Modifier Table"]: Stamina: Brute +30, Defender +30, Leader +30, Solo +30; Ambusher +20, Harrier +20, Mount +20, Support +20; Artillery +10, Controller +10, Hexer +10; Elite +0. Damage modifier: Ambusher +1, Artillery +1, Brute +1, Elite +1 (stacks with a role's +1), Leader +1, Solo +2; all others +0.
- **Published level 1 Stamina** [read, SB]: minions 3 to 7 each (artillery / controller / hexer 3; harrier / ambusher 4; brute / defender 5; dwarves higher); horde 10 / 15 / 20; platoon 20 / 30 / 40; elite 40 / 60 / 80; every leader 80; both solos 200. Solos by level: 200, 250, 300, 350, 400 to 420, 450, 420 (level 7), 550, 650 (level 10), 700 (level 11).
- **What the roles are, in the book's words** [read, MB]: Ambusher (slips past to the back line, hides); Artillery (best from afar, weak in melee); Brute ("lots of Stamina and deal lots of damage", hard to get away from, pushes); Controller (repositions foes, alters terrain; "on the squishier side"); Defender (tough, "can force enemies to attack them"); Harrier (hit and run); Hexer (conditions and debuffs; "generally squishy"); Mount (ridden; without a rider acts like a harrier); Support (buffs, healing, extra movement or actions; "function much like leaders, but they lack villain actions"). "Roles are descriptive, and most don't follow special rules."
- **Swarm** is a general keyword ("more than one creature... move and act together as if they were one creature") [read, MB "General Keywords"].
- **Mixing advice** [read, MB "Using Creature Roles and Organization"]: all one role "typically leads to dull, grindy combat"; no more than two controllers; one or two hexers; no more than one leader or support ("overlapping enhancements can turn a seemingly routine combat into a fatal one").

### Inferences
- [computed] With the middle role modifier (+20), Stamina / EV = (10L + 20) / (2L + 4) = **exactly 5 at every level**. EV is, in effect, "Stamina divided by five"; a brute or defender is a little cheap for its Stamina, an artillery or hexer a little dear, and the game does not price that difference.
- [computed] Damage per EV is also roughly constant across organizations (section 2): organization changes how many bodies and turns the same budget is spread over, not the total.

### Gaps
- The book says its stat blocks were made with "handcrafted tables of numbers and the extensive monster-making rules developed for Draw Steel" and that "more robust guidance for making new monsters and abilities will appear in the future" [read, MB]. Whether that guidance has since been published (a third core book, "Encounters", was announced: [checked] GP 2517 https://goblinpoints.com/2517; [lead] "Draw Steel Book 3 is Out", GP home page, 2026-10-05) I did not verify.

---

## 2. The monster math, with level 1 proportions

### Takeaway
Damage is (4 + Level + damage modifier) x 0.6 / 1.1 / 1.4 by tier, halved for hordes and minions, plus the highest characteristic for a strike; the free strike is the tier 1 number. At level 1 a platoon monster has about three hero signature-hits of Stamina and its own signature removes about a fifth, a third or two fifths of a hero's Stamina by tier.

### Cited findings
- **Damage formula** [read, MB "Damage and Power Roll Tiers"]: (4 + Level + Damage Modifier) x Tier Modifier; tier 1 = 0.6, tier 2 = 1.1, tier 3 = 1.4; "For horde and minion monsters, divide this result by 2"; a strike adds the monster's highest characteristic; round up. "At higher levels, these values can lead to damage numbers a few points higher than those seen in this book."
- **Characteristics and potency** [read, MB]: highest characteristic and power roll bonus = 1 + echelon (level 1 to 3: +2; 4 to 6: +3; 7 to 9: +4; 10: +5); leaders and solos +1 more (cap +5). Potency = highest characteristic, minus 1 per tier below 3; leaders and solos +1 at every tier.
- **Free strike** = the tier 1 damage [read, MB]. Monsters' free strikes are never rolled, "for two reasons": speed (no roll, no critical off-turn) and "by keeping these static values relatively low, heroes are encouraged to take more risks" [read, MB "Creature Free Strikes"]. Published level 1 free strikes: minion 1 to 2, horde 1 to 2, platoon 3 to 4, elite 4 to 5, leader 4, solo 5 [read, SB].
- **Targets** [read, MB]: abilities normally hit one target; elite, leader and solo abilities "typically target two". One more target than expected: damage x0.8; two or more extra: x0.5; one fewer: x1.2.
- **Level 1 signature abilities as published** (tier 1 / 2 / 3) [read, SB]: Goblin Runner, minion harrier: 1 / 2 / 3. Goblin Spinecleaver, minion brute: 2 / 4 / 5 with push. Goblin Warrior, horde harrier: 3 / 4 / 5. High Elf Zephyr, platoon harrier: 5 / 7 / 9. Human Brawler, platoon brute: 6 / 9 / 12. Basilisk, elite brute: 7 / 10 / 13 to two targets. Goblin Monarch, leader: 7 / 10 / 13 to two targets (roll +3). Werewolf, solo: 9 / 13 / 16 to one target, or 8 / 11 / 14 to two (roll +3).
- **The level 1 hero beside them** [read, HCl, HK, HC]: starting Stamina 18 (Conduit, Elementalist, Shadow, Talent, Troubadour) or 21 (Censor, Fury, Null, Tactician), plus a kit's +0 to +12; +6 or +9 per level after. Recoveries 8, 10 or 12 a respite; each restores one third of maximum Stamina. Winded at half; dying at 0 (still acting, bleeding); dead at minus the winded value. A hero's signature costs nothing: the Fury's Brutal Slam is 3 / 6 / 9 + Might (the book's worked example: 5 / 8 / 11 at Might 2), and most martial kits add +1 or +2 at each tier (or +0 / +0 / +4). The hero's own free strike is 2 / 5 / 7 + characteristic, rolled.
- **Tier odds on 2d10** [checked, a fan guide's table, which matches my own count]: at +2: 36% / 43% / 21%; at +3: 28% / 44% / 28%; with one edge (+2) on top of +2: 21% / 43% / 36%. https://docs.google.com/document/d/1EyPIj5rv-PVnNza736xVShZ9TgI_c3B-iaZEjcsCmeo/

### Inferences (all [computed]; reference hero: Stamina 27 = 21 + a +6 kit; signature 7 / 10 / 13, average 9.5 a turn at +2; heroic abilities, surges and edges not counted, so real kills are faster)
- **Hero turns to kill, signature only:** a minion: one per hit at tier 1, two at tier 2, two or three at tier 3. Horde (15): 1.6 turns. Platoon (30): 3.1 (20 to 40: 2.1 to 4.2). Elite (60): 6.3. Leader (80): 8.4. Solo (200): 21 hero turns, about 4 rounds for five heroes, 5 for four.
- **A whole standard encounter:** the budget is one platoon-equivalent per hero, up to one extra; that is about 30 to 38 monster Stamina per hero at level 1, or **3 to 4 signature turns per hero**. This squares with the reports of 2 to 4 rounds (section 9).
- **Share of the reference hero's Stamina (27) per monster signature, tier 1 / 2 / 3:** horde 11% / 15% / 19%; platoon harrier 19% / 26% / 33%; platoon brute 22% / 33% / 44%; elite brute 26% / 37% / 48% on each of two heroes; solo 33% / 48% / 59% (and it acts twice a round). A minion harrier 4% / 7% / 11%, a minion brute 7% / 15% / 19%.
- **Expected damage per round against the party, per hero slot (6 EV), at tier 2:** one platoon harrier 7; two horde harriers 8; eight minion harriers each on a different hero 16 (but they die fastest); half an elite brute 10. Damage per EV is flat to within the role modifier; minions are the exception while they live.
- **Monster damage as a share of hero Stamina falls with level** for the 9-per-level classes: a platoon's tier 2 strike is (4+L) x 1.1 + characteristic = about 8 at level 1, 13 at level 5, 21 at level 10, against roughly 27, 69 and 126 Stamina: 30%, 19%, 17%. Heroes also gain mitigation with level ([checked] "Heroes do also get more ways to mitigate damage as the level up", GP 2407 https://goblinpoints.com/2407).

### Gaps
- No published table of expected hero damage per level; the book never states what a monster's Stamina is measured against. The proportions above are mine.

---

## 3. Minions

### Takeaway
A squad of up to eight identical minions has one Stamina pool and one turn; a strike's overflow kills more minions, an area cannot kill more than it covers; the squad makes one roll, each target takes the signature once, and a second and third minion on the same target add only their free strike. MCDM got here in steps: 4e's 1 hit point, Flee, Mortals!'s overkill and group attack, then the pool.

### Cited findings
- **Squads** [read, MB "Using Minions"]: same-name minions in squads "of up to eight"; one initiative; bought four at a time, "at least two sets" recommended, since "they won't be effective in smaller numbers"; the rules "shouldn't be kept from the players".
- **Shared pool** [read, MB]: pool = one minion's Stamina x the number in the squad. Each time the pool drops by one minion's worth, "the minion who took the damage" dies. Minions "can't be winded, can't regain Stamina, and can't gain temporary Stamina".
- **Overflow** [read, MB "Dropping Multiple Minions"]: damage "from any source except an area effect" worth two or more minions takes that many; after the ones hit, "the minions nearest to those taken out". The player narrates how.
- **Areas** [read, MB]: the pool takes each minion's damage, but areas "can kill only those minions who are in the area" (the book's example: three 5-Stamina minions in a 6-damage area: the pool loses 15, not 18).
- **Immunity and weakness** apply "to the minion's squad once", last [read, MB].
- **Turn** [read, MB "Minion Action Economy"]: each minion gets a move and a main action, or a move and a maneuver, or two moves. Individual minions can make opportunity attacks; they "usually don't have bespoke triggered actions".
- **Squad action** [read, MB]: "you make one roll for the whole squad". "Each target... is affected by only one instance of the ability"; when "two or three (at maximum)" attack the same target, "each additional minion" adds damage equal to its free strike. Because that is less than the signature, "it's usually more effective to have each minion target a different hero". A squad critical lets every participant act again. Free strikes made together are summed into one strike.
- **Captain** [read, MB "Attached Squad Captain"]: any non-minion, non-mount creature sharing a language can be attached; one captain per squad, one squad per captain; the captain acts on the squad's turn with a full turn and its own Stamina; minions get their "With Captain" line (a damage bonus, speed, or Stamina; e.g. the Spinecleaver's "+1 damage bonus to strikes" [read, SB]). A dead captain can be replaced at the start of the next round.
- **Pacing sidebar** [read, MB]: if the heroes go first with area abilities, minions may die "before they even have a chance to do anything"; spread them out; "reinforcements" are always available. Bookkeeping advice: write the kill thresholds (5, 10, 15...) beforehand.
- **Limits in encounter building** [read, MB]: at most eight creatures per hero; above three per hero, at least half must be minions; keep minions within two levels of the heroes so they stay "dangerous and relevant".
- **How MCDM got there** [checked, second-hand, GP 2407, June 2024 roundup, https://goblinpoints.com/2407]: the team first tried "phases" on the Director's turn (categories of monsters acting in a set order); testers found it "limiting"; squads with a shared pool and a captain replaced it. Lead designer James Introcaso is reported describing overflow as "cinematic narrative" (a skeleton's head thrown at the next skeleton). In that 2024 version "each minion in a squad has to attack a different enemy", because a squad focusing one hero "felt really good to the director" but "felt really bad for players. A single squad's attacks could almost take out a hero by itself". The published rule (free strike for the second and third) is the softened form.
- **Later change** [checked, GP 2505, February 2025, https://goblinpoints.com/2505]: "Minions now come in groups of four, instead of eight."
- **Flee, Mortals! (5e, 2023) minions**, as quoted by EN World poster Quickleaf, 2023-11-28 [checked]: "If the minion takes damage from an attack or as the result of a failed saving throw, their hit points are reduced to 0. If the minion takes damage from another effect, they die if the damage equals or exceeds their hit point maximum, otherwise they take no damage." Group attack, as paraphrased by poster Dausuul [checked]: two to five minions of one type acting together make one attack at +1 per minion, dealing normal damage times the number attacking. Overkill: excess weapon damage beyond a minion's hit point maximum carries to another [checked, same thread; lead for the exact wording]. https://www.enworld.org/threads/minions-with-damage-thresholds.701247/page-4
- **4e's minion** [checked, D&D Beyond staff article]: 1 hit point, no damage from a miss or a successful save. https://www.dndbeyond.com/posts/1728-running-hordes-of-monsters-without-lots-of-fuss
- **Reception of the Flee, Mortals! version** [checked, EN World, same thread]: Shardstone: "MCDM has solved minions"; and that overkill "makes martials especially feel very badass". A doubt from the thread: a minion that saves against a fireball is untouched while its leader beside it burns. Another poster prefers 13th Age's mooks, a group with one pool (which is what Draw Steel then did).
- **Reception of the Draw Steel version** [checked]: Gaming Trend's review (2026-02-09): their turns are "lightning fast", yet they "can deal a lot of damage if they gang up on one hero, and can jam up the battlefield". https://gamingtrend.com/reviews/draw-steel-monsters-review/ . The fan "Newbie Director's Helper": "Prefer Horde Enemies over Minions"; minions "should be considered a time sink for the director"; with 20 to 30 on a big map, "Getting all of them from A to B took forever". (Google Doc above.) EN World [lead, search summary]: "one chunky attack will sometimes take out 3-4 minions".

### Inferences
- The complaint found is about **moving** many tokens, not about tracking the pool. The pool's bookkeeping (one number, thresholds) drew no complaint in what I read.
- The game deliberately caps focus fire from minions (one signature instance per target, at most three minions per target) after a playtest where it nearly dropped a hero in one squad turn.

### Gaps
- No table opinions found on "too trivial" versus "too dangerous" beyond the above. Reddit not read.

---

## 4. Solos and Leaders

### Takeaway
A solo is six heroes' worth of budget in one body, with two non-consecutive turns a round, three villain actions, a pay-Stamina-to-end-an-effect rule, and a Malice purchase of one more main action that works "even if they are dazed". A leader has the villain actions and End Effect but one turn, and fights among other monsters.

### Cited findings
- **Solo Turns**, the wording on every solo [read, SB]: "The [creature] can take two turns each round. They can't take turns consecutively."
- **End Effect** [read, MB and SB]: "At the end of each of their turns, the [creature] can take 5 damage to end one effect on them that can be ended by a saving throw. This damage can't be reduced in any way." The cost rises with level (5, 10, 15, 20 across the book; a few end "up to two effects" for 20). Leaders have it too (Goblin Monarch: 5). It touches only "save ends" effects; end-of-turn effects simply expire.
- **Solo Action** [read, MB "Instant Solo Creature"; SB Werewolf Malice]: "(5 Malice) The creature takes an additional main action on their turn. They can use this feature even if they are dazed."
- **Villain actions** [read, MB]: always three; each "once per encounter", "no more than one... per round", even with two such creatures; used "at the end of any other creature's turn". Numbered for "a logical encounter flow and cinematic arc" but usable in any order. First: an "opener" (some damage, summons, a buff, a debuff, or a move); second: "crowd control", after the heroes have closed in, to regain "the upper hand"; third: an "ult", "a showstopper".
- **Examples** [read, SB]: Werewolf (level 1 solo, 200 Stamina, speed 7): Howl (5 burst; frightened on an Intuition test), Full Wolf (size 3, speed 10, +2 damage for the rest of the fight), Rampage (2 burst, 5 / 8 / 11, shift before and after). Goblin Monarch (level 1 leader, 80 Stamina): each ally in 10 moves or free-strikes; each ally near one enemy moves toward it; every enemy takes 2 damage per adjacent goblin. Its signature also grants an ally a free strike; a triggered action makes an adjacent ally the target of a strike aimed at the monarch.
- **Instant solo** [read, MB]: turn a leader or elite into a solo by EV x3, Stamina x2.5, Solo Turns, End Effect (10), Solo Action.
- **Budget rules for solos** [read, MB]: at most 1 level above the heroes ("a solo creature's abilities dish out a lot of damage for their level"); built for "four to six heroes"; with seven or more, "solo creatures don't quite live up to their name", so add lackeys or terrain; with three or fewer, heroes "can struggle against solo creatures". To make any leader or solo "the star of the show", use a hard encounter with that creature at one third or more of the budget.
- **Solo's default exit** [read, MB "Diminish Numbers"]: the solo "flees or surrenders when reduced to one-quarter or less of their Stamina and after using all their villain actions".
- **Director's restraint** [read, MB "Play Nice"]: don't fire the third villain action at the start of the fight; "challenges can always be overcome".
- **What changed in testing** [checked, GP 2505, February 2025]: "Solo monsters now only have one action per turn. They were simply too powerful. It's possible to purchase extra actions using Malice." [checked, GP 2407, June 2024]: heroes can deal end-of-encounter conditions; "Regular monsters can't remove those, but boss monsters can."
- **Reception** [checked]: EN World, a Director running a campaign: players enjoy combat "especially with some of the solo monsters they've fought" https://www.enworld.org/threads/looking-for-draw-steel-extended-play-review.716771/ . Gaming Trend: a level 1 solo fight (the Arixx) was the reviewer's showcase; "Nothing feels more unique than the solo monsters". The fan guide: solos are high-stakes and tiring back to back, "1 Solo per level, maybe 2"; and "Keep solos to the same level as the heroes regardless of victories", because Victories make heroes hit harder at once, not tougher.

### Inferences
- [computed] A level 1 solo's 36 EV is a **standard** encounter for five or six fresh heroes and a **hard** one for four (bands in section 6); with 2 Victories each, it is standard for four.
- [computed] Damage budget: two turns at tier 2 on two targets each is about 44 a round, close to six platoons' 48; villain actions and Malice sit on top. Stamina 200 is 5.6 per EV, a little above the norm.
- The anti-shutdown kit is four separate layers: two turns (losing one turn is half a round), paying Stamina to drop a save-ends effect each turn, an extra main action that ignores dazed, and villain actions that happen on other creatures' turns. None of them makes the solo immune; each converts a lockdown into something smaller (damage taken, Malice spent).

### Gaps
- I found **no** opened page where tables say solos are too easy, too long, or get locked down; the one search summary on the subject returned nothing for Draw Steel. [memory] I recall community talk of solos falling fast to parties with many Victories; unverified.
- Whether a dazed solo may still use villain actions is not stated in the text I read.

---

## 5. Malice

### Takeaway
Malice is the Director's Heroic Resource: a start-of-fight amount equal to the heroes' average Victories, then heroes + round number each round, spent on costed abilities in stat blocks and on one group feature per monster turn. It was added late, because the heroes' power rose inside a fight and across the day while the monsters' stayed flat.

### Cited findings
- **Earning** [read, MB]: "At the start of combat, you gain Malice equal to the average number of Victories per hero. Then at the start of each combat round, you gain Malice equal to the number of heroes in the battle, plus the combat round number." The book's example: five heroes with three Victories: 9 in round 1, then 7, 8, 9. A dead hero stops generating it; unused Malice is lost at the end.
- **Spending** [read, MB]: abilities with a Malice cost in the stat block (Goblin Warrior's stronger strike: 2; the Brawler's Throw: 1; the Monarch's summon two runners: 1); and "[Creature] Malice" features, one per turn at the start of a monster's turn (Goblin: +2 speed to all goblins for 3; 1 damage per adjacent goblin to every enemy for 5; a map-wide weakening mist for 7. Werewolf: 10 temporary Stamina for 3; Solo Action for 5; a fight-long extra move or maneuver for 10) [read, SB].
- **Basic Malice, for any monster** [read, MB]: 3 Malice: +1 potency on its next ability. 5+ Malice: Malicious Strike, extra damage equal to its highest characteristic, +1 per extra Malice, up to three times the characteristic; "can't be used two rounds in a row, even by different monsters".
- **Preparation rule** [read, MB]: pick one feature at 2 to 3, one at 5, one at 7 to 10.
- **Showing the pool** to players is the Director's choice [read, MB].
- **Why it exists** [checked, GP 2407, June 2024]: "the monsters being too weak at the tail end of combats"; heroes' power "is on a rising curve", monsters' was "a flat line"; the two curves "should be really close", so that poor play lets the monsters "get the upper hand". It revived an idea Colville had called "Goblin Points" a year earlier; the 2024 name was "villain power". In that draft the Director also gained it when monsters "act in character" (goblins flanking); the published rule dropped that.
- **Introcaso** [checked, interview, GP 2516, 2025-08-20, https://goblinpoints.com/2516]: "Landing on how Malice worked, the Heroic Resource for Directors" was one of the most satisfying problems solved.
- **As a dial** [checked, EN World poster]: "directors are not mandated to spend their malice points. One way to let up on the gas of an encounter is just let malice go unspent". https://www.enworld.org/threads/looking-for-draw-steel-extended-play-review.716771/page-3 . The same thread: a Director "love[s] using malice". Gaming Trend: "you can start a combat with upwards of 7-10 malice"; big features compete with small ones for the pool. The fan guide: prefer the monster's own Malice abilities to the group features, which are one more thing "not explicitly on the stat blocks".

### Inferences
- [computed] Four heroes, no Victories: 5, 6, 7, 8 = 26 Malice over four rounds; five heroes with three Victories: 33. A 5-cost feature every round is affordable from round 1; a 10-cost one needs saving or a long fight.
- Malice rises by one a round regardless of how the fight is going, so the monsters' side escalates on a clock, as the heroes' resources do.

---

## 6. Encounter building

### Takeaway
Budget = 4 + 2 per level for each hero, plus one hero for every 2 average Victories; five bands defined in whole heroes; level matters only as a cap (monsters at most 2 above, solos 1). The words for "standard" promise some Stamina and Recoveries lost and that death is "uncommon" but possible.

### Cited findings
- **Encounter Strength** [read, MB Step 3]: per hero 4 + 2 x level (6 at level 1, 14 at 5, 24 at 10); retainers count as heroes. "Add one Hero for every 2 Victories the heroes have earned on average"; prefer "higher-cost creatures" to more creatures when Victories raise the budget.
- **Budget bands** [read, MB Step 4]: Trivial: less than ES minus one hero. Easy: up to ES. Standard: ES to ES plus one hero. Hard: above that, up to ES plus three heroes. Extreme: more.
- **The words for each band** [read, MB Step 2]: Trivial: "no challenge at all"; Stamina "mostly, if not entirely, untouched"; no Victory. Easy: "won't threaten their lives" unless the heroes are already depleted; 1 Victory. Standard: "the most common"; they "deplete some of the heroes' Stamina and Recoveries, especially for melee-focused heroes. Although character death is uncommon in a standard encounter, it isn't impossible"; 1 Victory. Hard: "typically climactic encounters with leaders"; "winnable, but the heroes need to play smart to survive"; 2 Victories. Extreme: heroes "aren't likely to survive if they try to fight to the bitter end"; 2 or more.
- **Between respites** [read, MB sidebar]: "from 4 to 6 Victories' worth of combat encounters before needing to stop for a respite"; "not an exact science"; players pushing on because they hold many Victories is "the game working as intended".
- **Not attrition** [read, MB sidebar, and Heroes "For the Director"]: "Draw Steel isn't a game of attrition"; two guards at a gate are "probably better handled with a test" and earn no Victory. https://github.com/SteelCompendium/data-rules-md/blob/main/Chapters/For%20the%20Director.md
- **Level difference** [read, MB "Consider Creature Level"]: monsters "no more than 2 greater than the heroes' level" (3 with 6 or more Victories); solos no more than 1. Out-of-range creatures can "deal devastating damage before a hero gets to do anything", and their potencies "might be nearly impossible to resist". "This comparison is the only indicator that level serves in encounter building." No floor is given for monsters below the heroes.
- **Counts** [read, MB]: at most eight creatures per hero; at most about six kinds of stat block, or the fight risks "a slog".
- **Initiative groups** [read, MB Step 6; HC]: monsters are put in groups acting on one Director turn; aim for each group's EV "between the encounter strength of one to two heroes"; "about as many initiative groups as the number of heroes, plus or minus one or two". Sides alternate turns; when one side runs out, the other takes the rest in a row. Who goes first: a d10, on 6+ the players choose.
- **"It's Not Science"** [read, MB sidebar]: party build shifts the result (area-heavy parties handle minions, single-target parties "might be able to quickly destroy a solo").
- **Objectives** [read, MB "Encounter Objectives"; HC "End of Combat"]: ten named objectives (Diminish Numbers, Defeat a Specific Foe, Get the Thing, Destroy the Thing, Save Another, Escort, Hold Them Off, Assault the Defenses, Stop the Action, Complete the Action), each with roles, map advice, a difficulty modifier, success and failure conditions. Diminish Numbers ends when: only minions remain; or heroes outnumber a mostly-horde force; or outnumber a mostly-platoon force two to one; or foes are at half their starting number. Defeat a Specific Foe lowers the difficulty one band if the target is a third or less of the EV.
- **Ending early** [read, HC]: fights "can become a tedious slog" if fought to the last point; the Director may end one when objectives are met "or if it becomes clear that they can win the fight with minimal effort", by calling "Cut!"; then a **dramatic finish** (each player narrates how their hero deals with an assigned remaining enemy) or an **event ending**. Fleeing foes must not come back as a "Gotcha!", or players learn to "make every combat a slog to the bitter end".
- **Optional: Last-Stand Stamina** [read, MB]: once the win is clear, every enemy drops to 1 Stamina and each squad's pool to one per minion.
- **Running advice** [read, MB "Running Encounters"]: "Of all the numbers in a monster's stat block, Stamina is the one you can freely adjust"; spread damage around so heroes get to use their triggered actions; reinforcements both ways.

### Inferences
- [computed] Four level 1 heroes (ES 24): trivial under 18, easy 18 to 24, standard 24 to 30, hard 30 to 42, extreme above 42. The same party at 4 Victories counts as six heroes: standard 36 to 42.
- [computed] One level up costs +2 EV: +33% at level 1, +14% at level 5. Level difference is Stamina (+10 a level for a platoon) and damage (+1 x tier a level), with the roll bonus and potency stepping only at levels 4, 7 and 10. With no miss chance, that is all a level is, hence the hard cap instead of a scaling formula.

### Reception
- [checked] The fan guide: "The book recommends 1 Respite per combat worth a total of ~6 Victory Points. In my experience that is very accurate"; at 8 or more "it becomes more and more likely one or more heroes might die"; new groups should run only standard fights at first.
- [checked] EN World: a player found every recent fight from their Director measured "hard or well into extreme" in a builder tool; a reply guesses a 5e habit, "that you have to go Hard or Deadly to make it worth the time". Another poster: some optimizers "dislike Draw Steel because they think it's too easy". https://www.enworld.org/posts/9837822
- [checked] Altoholism (has not played): EV scales linearly, so a level 7 leader and a level 1 solo both cost 36; EV alone would allow a mismatch and "by giving the creature its rank and level" the game blocks it. https://altoholism.blogspot.com/2025/09/draw-steel-encounter-balancing-and.html
- [checked] Split Party: "the best part of this game is encounter design and playing from the Game Master side"; but there is no formal cost for resting. https://splitparty.substack.com/p/draw-steel-part-2
- [checked, GP 2414, September 2024]: during testing "the heroes are a bit too powerful when they have a lot of victories", so the way Victories feed the budget was being recalculated.

---

## 7. The designers' account of process and order

### Takeaway
Second-hand but consistent: the resource loop (Heroic Resources, Victories, respites) was designed first and the core roll later; the Director's side came after the heroes' side; monsters were rebuilt around the Director choosing who acts; Malice was the last rule locked; solos and minion counts were still being cut in early 2025.

### Cited findings
- **The four words** [read, Heroes Introduction headings: Tactical, Heroic, Cinematic, Fantasy] https://github.com/SteelCompendium/data-rules-md/blob/main/Chapters/Introduction.md ; [checked, Rascal, 2025]: the playtest was "volatile... Everything was on the table"; what stayed was the identity "tactical, heroic, cinematic, and fantasy". https://www.rascal.news/how-mcdm-designed-draw-steel-alongside-their-fans/
- **No wasted turn, in the rules' words** [read, HCl]: "ability rolls always do something useful."
- **Order** [checked, Introcaso, GP 2516]: Heroic Resources and Victories "are the things... we really came up with first, because... that gameplay loop is more important than your core mechanic"; the power roll "took us a while to land on". On not missing: "not unique to Draw Steel" (he cites Into the Odd).
- **A design test he states** [checked, same]: when something "becomes an inevitability... you should always go first, you should always use XYZ", either build it in or raise the alternatives.
- **Heroes first, then the Director** [checked, GP 2407]: until mid-2024 "the main focus... has been on the player side"; then "making monsters fun to run".
- **Encounters, not monsters** [checked, GP 2404 https://goblinpoints.com/2404 and GP 2405 https://goblinpoints.com/2405]: Colville's reported point: a GM runs an encounter, not individual monsters; when the Director picks which monster acts, each monster can do "fewer things, but they do those few things very well", and the question becomes "I need an area of effect attack", not "which monster goes now". The Monsters book was first meant as a port of Flee, Mortals!; its roles were reworked on a Patreon stream starting from Flee, Mortals!'s list.
- **Encounter values, first draft** [checked, GP 2407]: each hero worth 15, a goblin 3 ("five goblins for every hero"), level as a separate tag so that same-EV monsters of different levels differ in strength. The published 4 + 2 per level replaced the flat 15.
- **Late cuts** [checked, GP 2505, February 2025]: solos to one action a turn; minions bought in fours; "band" renamed horde, "troop" renamed elite; the winner of the d10 chooses who goes first.
- **Complexity ceiling** [checked, GP 2414]: "Higher level monsters should be more powerful, but not more complex to run."
- **Monster-making rules** [checked, GP 2407]: Introcaso hoped to print them: "no point in hiding the way MCDM makes monsters". The book prints the short formulas and promises more [read, MB].
- **Who** [checked, GP 2516]: Introcaso names Willy Abel as "the lead designer of the monster book". (Spelling of the surname from memory.)

### Gaps
- **A stated target for rounds per fight, and how far Stamina and damage were retuned, were not found** in anything that opened. [memory] Colville has said in videos that fights should be over in a few rounds and that long late-fight cleanup is the thing to cut; unverified here.
- Monsters' static free strikes are explained in the book (section 2); a designer statement on removing to-hit rolls for monsters specifically was not found beyond the general "no null result" stance [memory for that phrase].

---

## 8. "Action Oriented Monsters" and "Flee, Mortals!"

### Takeaway
The 2019 video's claim: a lone boss lacks the actions to face a party, so give it extra actions tied to the rounds of the fight so the fight has an arc. Flee, Mortals! (2023) turned that into villain actions, costed replacements for legendary resistance, roles, minions, and a CR budget per character. Draw Steel keeps all five ideas and changes the numbers under them.

### Cited findings
- **The video, as summarized by Sly Flourish** [checked] https://slyflourish.com/action_oriented_monsters.html : posted 2019; "boss monsters typically don't have the tools or action economy to deal with a full party"; villain actions "keyed to the rounds of a battle which often mirror the dramatic arc of a story"; round 2: "get out of a bad position and avoid being ganged up on"; round 3: "the boss is about to die so make the characters regret ever tangling with the boss"; often boosted hit points. Colville's goblin boss: summons goblins, lets them move without provoking, then a burst of attacks.
- [memory] The video's fuller recipe: a bonus action, a reaction and three villain actions, each ability with a name that tells the DM what to do.
- **Flee, Mortals! villain actions** [checked, Altoholism, 2023] https://altoholism.blogspot.com/2023/08/the-ideas-presented-in-flee-mortals.html : each "once per encounter, and only once per round", at the end of a player's turn, in a recommended order; the last "an 'ult'". Villains replace legendary resistance with a version that "impose[s] a penalty upon them" (a hag who succeeds but turns into a cat for a turn), so "you're still hampering the boss". Draw Steel's End Effect (pay Stamina) is the same idea in a flat form [read, MB].
- **Flee, Mortals! roles** [checked, D&D Beyond staff article] https://www.dndbeyond.com/posts/1729-creature-roles-how-flee-mortals-helps-you : Ambusher, Artillery, Brute, Controller, Leader, Minion, Skirmisher, Soldier, Solo, Support; "Leader and support types share the same combat style, the difference being one of complexity". Draw Steel renamed Soldier to Defender and Skirmisher to Harrier, added Hexer and Mount, and moved Minion, Leader and Solo to a separate axis (organization) [read, MB].
- **Flee, Mortals! encounter building** [checked, Altoholism, two posts] same URL and https://altoholism.blogspot.com/2023/08/solo-monsters-that-arent-solo-monsters.html : each character contributes a CR amount by level and difficulty (level 16: 6.5 easy, 7 standard, 8 hard; level 10: 3.5 standard); a CR cap no creature should exceed; a separate method for solos. Feedback reported there: "hard truly means hard".
- **Minions**: section 3.
- **Reception** [checked]: EN World posters call it "heavily playtested" and the best 5e minions; Gaming Trend describes its legacy in Draw Steel as monsters "more defined by what they do than what they are".

---

## 9. How fights run at the table (reception, pacing)

- [checked] EN World player: "The Draw Steel fights we had were typically 4 rounds give or take one"; "about 5 minutes between rounds" at level 1; "I never felt like things were dragging". https://www.enworld.org/threads/what-gets-me-playing-draw-steel-and-not-pathfinder-2e.714673/ (post 9757852)
- [checked] The fan guide: "Combat in Draw Steel is quick, but takes a long time. The average Combat encounter will take 2 to 3 rounds of combat, but a single combat round can take 45 minutes up to over 1 hour."
- [checked] EN World Director: "'Standard' to 'Hard' fights do take a while for my group"; triggered actions cause "oh crap, wait" moments.
- [checked] Gaming Trend: initiative groups stop the Director "play[ing] solitaire with his monsters at the end of each round"; the objectives advice is "perhaps the best piece of advice in the book"; score 95.
- [checked] Same thread: with more Victories "the GM has more and more Malice... at the start of combat, and can also do bigger and bigger effects earlier".

---

## What did not open, and what was not tried

- backerkit.com (MCDM's updates): 403. patreon.com (MCDM's post "Monsters"): 403. mcdm.fandom.com (video transcripts, including "Action Oriented Monsters"): 403. YouTube transcripts: not attempted (no reader).
- steelcompendium.io's 2024 backer-packet bestiary page: 404 (only a search summary: the shared pool was already there). mcdmproductions.com blog and shop pages: 404.
- Reddit and the MCDM Discord: not read; two searches aimed at Reddit returned nothing usable.
- EN World thread pages came through, but some pages show fewer posts to a reader that is not logged in.
- Not read: the Monsters book's "Retainers" and "Dynamic Terrain" chapters; the Encounters book; the errata document.

## Questions this raises for 2d12 (questions only)

1. Draw Steel's EV is Stamina / 5 and nothing else; damage is tied to the same level and organization. Is Combat Value meant to price Health alone, or Health and damage separately, and what happens to a role that trades one for the other?
2. A platoon monster costs exactly one hero but has about three signature-hits of Stamina and removes a quarter to a third of a hero per turn. With a Tier 1 that can deal nothing and Defenses of 11 to 16, how many PC Actions is "one Standard" supposed to absorb, and is that measured in Actions or in AP?
3. Draw Steel caps a squad's focus fire (one full hit, then two small adds) after a test where a squad nearly dropped a hero in one turn. A squad of three Minions in one slot: can all three use a full Action on one PC?
4. Its minions overflow and die in a pool; 2d12's ticks have no overflow. Is "a Tier 3 kills one Minion and wastes the rest" intended against a game whose fans praise overflow above all?
5. Draw Steel stops shutdown with four partial layers, each with a price (Stamina, Malice) rather than immunity. Which layers does "classes must never fully shut a boss down" need: a second turn, a paid escape, an action that ignores a condition, actions outside its turn?
6. Its solo got two turns but lost its second action per turn in testing ("simply too powerful"). Whichever Boss turn model is chosen, what is the Boss's total output per round against a party's total Health?
7. Malice rises by the round and by Victories, mirroring the heroes. 2d12 has Escalation for PCs: does the monsters' side rise with it, and from what (rounds, Momentum, both)?
8. Victories raise the budget by one hero per two. Does Momentum change Combat Value budgets, or only starting Escalation?
9. Draw Steel defines "standard" in words about Stamina, Recoveries and death risk, and "4 to 6 Victories" per respite. What sentence defines a 2d12 standard fight in Rally Points spent, and how many such fights fit in 6 to 7 Rally Points?
10. Level there is only a cap (+2, solos +1) because nothing misses. Here Modifiers are nearly flat but Defenses exist: is a monster's level difference Health and damage only, or also Defense, and is a cap needed?
11. The book tells the Director that Stamina is the one number to change freely, offers "Last-Stand Stamina", and ends fights at stated conditions (half the foes down; a solo at a quarter). Which of these belongs in 2d12's rules as a rule, given the aim of least ambiguity, rather than as advice?
