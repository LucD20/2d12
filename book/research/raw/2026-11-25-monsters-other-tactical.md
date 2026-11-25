# How other tactical RPGs build enemies and encounters (not PF2e, 4e, 13th Age, Draw Steel)

Date: 2026-11-25. Raw research notes for the bestiary rebuild. Other games' rules and other people's opinions only; nothing here is a 2d12 rule.

## How far to trust it

Every statement carries one of four marks:

- **[read]** = rules text on a page or file I opened in this session (the URL is beside it). Where I ran the numbers myself from an opened data file, it says "computed".
- **[checked]** = an opinion or a second-hand rules summary on a page I opened (a blog, a forum post, a GM essay). It is true that the person said it; it is not proof that it is so.
- **[lead]** = seen only in a search summary, or on a page that refused. Treat as a pointer, not a finding.
- **[memory]** = from my own knowledge, no page opened. Lancer's template numbers, Fabula Ultima's ranks, Savage Worlds' core rules, D&D 2014's DMG tables and the "other games" paragraphs lean on this mark: verify before building on them.

Pages were read through a fetch tool that summarises, or downloaded and searched as text. Numbers quoted from downloaded text (ICON, Nimble, Daggerheart, Lancer sitreps, A5E, the Weird Wizard update) are exact; numbers from summarised pages (Giffyglyph, Angry GM, Blog of Holding) are as the summary gave them.

Sources used most:
- Lancer sitreps: https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/sitreps.json ; data spec: https://github-wiki-see.page/m/massif-press/lancer-data/wiki/NPC-Classes-and-Templates
- ICON 1.5 full text inside a fan tool: https://raw.githubusercontent.com/zengulus/icon/main/src/content/generated/icon-1.5.json (book pages 288 to 299)
- Nimble GM guide text on a community site: https://nimblenomicon.pages.dev/game-masters-guide/ and https://nimblenomicon.pages.dev/creators-kit/
- Daggerheart SRD, community edition with stat-block data: https://callmepartario.github.io/og-dhsrd/ (data in its `scripts/og-dhsrd-features.js`)

---

## 1. Lancer (Massif Press)

### Takeaway
Lancer has no challenge rating. Enemies are a class (a role and a fixed kit) at one of three tiers, plus templates that change how many hits and turns the body has. The fight is balanced by counting turns and "structure" against the number of PCs, and by the objective and its round limit. GMs praise the kit and distrust the book's claim that one Ultra can hold a party.

### Findings
**(a) Ranks and exchange rate**
- The official counting rate, from the Gauntlet sitrep: "Ultras count as 4 characters, elites count as 2, and grunts count as 1/4." [read] sitreps.json
- Grunt: 1 HP, meant to be fielded in numbers; a community essay puts it as replacing "a single non-Grunt NPC with up to 4 bodies", and notes a Grunt still deals full damage. [checked] https://knowledgeandknicknacks.blogspot.com/2024/01/temple-of-templates-grunt.html
- Elite: "Double the Structure/Stress, double the Activations" (2 structure, 2 stress, two turns a round), one extra class feature; cannot combine with Ultra or Grunt. [checked] https://knowledgeandknicknacks.blogspot.com/2024/04/temple-of-templates-elite.html
- Ultra: "+3 structure" (4 in all), 1 to 2 extra turns (2 at five players), 1 to 3 Ultra-only features; Veteran: +1 structure and extra traits; Commander: +1 structure and features that boost allies. Templates stack except Elite with Ultra. [checked] https://owacsender.substack.com/p/the-gms-guide-to-building-lancer (the Ultra's 4 stress is [memory])
- A normal NPC has 1 structure and 1 stress; a PC mech has 4 and 4. So an Ultra has a PC's damage track and an Elite half of one. NPC attacks deal fixed damage and big abilities come back on a Recharge roll. The Ultra also carries traits that shrug off some conditions. [memory]
- A third-party rework says of the core Ultra that it wants to avoid "frustrating blanket immunities that can discourage players from attempting various tactics". [checked] https://kaitave.itch.io/lancer-npcs-rebaked

**(b) How numbers are set**
- Each NPC class has one role (artillery, controller, defender, striker, support) and every stat is either one number for all tiers or three numbers, one per tier; a class has base features plus optional ones; a template adds picks and forbids others (Grunt forbids Ultra, Veteran, Elite); "activations" is itself a stat. [read] github-wiki-see.page link above
- Tier 1 for License Level 0 to 4, Tier 2 for 5 to 8, Tier 3 for 9 to 12; mix tiers at the borders. [checked] owacsender
- Raising tier beyond the book's bounds "is almost always a mistake": the jump is steep and makes "rocket tag". [checked] https://gordianblade.substack.com/p/balancing-lancer-combat-for-one-shots
- The NPC class data itself is paid content and is not in the public repository (the files returned 404). [read]

**(c) Budget and difficulty**
- Community rule: enemy turns on the field "around 1.5x your player count", not counting reinforcements; total enemy structure, with reinforcements, 1.5 to 2 times the player count. At most 4 different classes in a fight; strikers and artillery at most half the force; most enemies with one optional feature at most. [checked] owacsender
- The same author says the core book's own balance advice is "a little more swingy" than community practice. [checked] owacsender
- Sitreps set the win condition and a clock: Control (4 zones, 6 rounds, points each round), Escort (8 rounds), Extraction (10 rounds), Gauntlet (8 rounds), Holdout (6 rounds), Recon (6 rounds), plus plain combat. [read] sitreps.json
- Reinforcements are the dial: hold a reserve and add "1 or 2 rank and file enemies or 1 templated enemy at a time". [checked] owacsender
- The book expects 3 to 4 fights between Full Repairs. [checked] gordianblade (citing core p. 264)

**(d) Boss**: the Ultra (extra turns, a PC-sized damage track, special features). **(e) Fodder**: the Grunt (1 HP, full damage, a quarter of a body).

**(f) What tables say**
- On the Ultra alone: the book's advice doesn't "factor in action economy when they imply 1 Ultra alone will keep 4 players at bay ... Spoiler: It won't." [checked] owacsender
- On Elites: "a bit more than twice the lethality" because Recharge rolls happen on both turns; poor on reaction-based classes; "Elites can die quickly" when the first structure roll goes badly. [checked] knowledgeandknicknacks (Elite)
- On Grunts: full damage on a 1-HP body is dangerous when the party cannot reach it (Sniper Grunts are "a strong 'don't'"); many Grunts multiply Recharge abilities and the GM's bookkeeping. [checked] knowledgeandknicknacks (Grunt)
- Players of the official intro module: "the enemies have 10 activations over our 5 player activations", "way too hard for people who have never played before"; another group found a different module "a little too easy". [checked] https://itch.io/post/14230913
- The rework's complaints about core NPCs: multiattacks that scale with tier and too much accuracy, which makes cover and Evasion matter less. [checked] kaitave
- Pure deathmatches get "quickly" boring; use objectives. [checked] owacsender

### Gaps
- The core book's own template text and its balance paragraph (p. 281 to 283) were not opened; the template numbers above come from community pages and memory.
- "Each NPC is a puzzle piece" praise, Ultras dying to focus fire, and the Witch and Hive complaints: no page opened that says so in those words. [lead]

---

## 2. ICON (Massif Press, playtest 1.5; all [read] from the 1.5 text, pp. 289 to 299)

### Takeaway
ICON is the flattest game in this set: four stat blocks for the whole bestiary, the same numbers in every chapter, a budget of "players + 1" bodies, and a boss whose health and turns are both multiplied by the number of players.

### Findings
**(a) Ranks**: a regular foe is worth 1 point; a Mob is worth 1; an Elite 2; "1 Legend is worth the entire encounter budget". In scenario scoring, mobs and summons count as 0 characters, Elites as 2, Legends as the number of PCs.

**(b) Numbers**: "there are only four basic stat blocks in the game", one per class, close to the four PC classes:

| Class | Vitality | HP | Defense | Fray | Damage die | Trait |
|---|---|---|---|---|---|---|
| Heavy | 10 | 40 | 6 | 4 | 1d6 | Rampart: reduces damage to self and adjacent allies by 2 |
| Skirmisher | 7 | 28 | 10 | 2 | 1d10 | moves diagonally; no damage from misses, areas, passed saves |
| Leader | 10 | 40 | 8 | 3 | 1d6 | 1 action: cure an ally |
| Artillery | 8 | 32 | 7 | 3 | 1d8 | resists attacks from beyond range 2 |
| Legend | 10 | 50 per PC (min 100) | 8 | 3 | 1d8 | one turn per PC; Juggernaut |
| Mob | none | 2 hits per member, 2 members per player | 8 | 3 | d6 | no slay effects |

A foe's job (dozens of them) gives its abilities; a faction template can be laid over a basic job. Foes take 2 actions and a free move like PCs but only use what is in their profile; they do not critically hit unless stated. "Since statistics remain the same across chapters, all chapters of foes are still threatening"; chapters (I to III) only gate complexity. A foe from a higher chapter can be run as an Elite; one from a lower chapter at half HP or not fought at all.

**(c) Budget**: "Count the number of players, then add 1." Add or remove 1 or 2 points for difficulty. The stated principle: "The most important balancing factor is action economy". Reserves: add 2 to 3 points arriving at the end of round 2 or 3. The game expects two or three fights per camp; for a single fight use twice the players in points, half on the map, the rest arriving at the ends of rounds 2 and 3. Scenarios (Control, Recon, Brawl, Escort, Gauntlet, Holdout, Scavenge, VIP, Extraction, Hunt) all end at round 6; Gauntlet and Holdout use twice the budget, fed in waves.

**(d) Boss**: a Legend takes "one turn for every player character in combat. This includes defeated players"; health 50 per PC; interrupts recharge every round; phases change its actions; Juggernaut lets it "remove a status or mark at the start of each round". That is the whole anti-shutdown rule: one cleanse a round, not immunity.

**(e) Fodder**: a Mob is one enemy slot with one set of actions spread over many bodies. "Members don't have hp. Instead, each member has two 'hits'"; any damage removes one hit. "A mob and all its members are immune to statuses"; members do not cause engagement.

**(f) A rule worth noting, no reception found**: open information. Job, class, special class and traits are known on sight, the full stat block from the second meeting.

### Gaps
- The text's own example is inconsistent: with 3 players it offers "4 regular foes ... or 20 mobs, or 1 legend", while a mob is priced at 1.
- ICON 2.0's foe rules were not opened; I found no page describing how 2.0 changed Legends or the budget.
- No reception page on ICON's foe math opened.

---

## 3. Nimble (Nimble 2e, Evan Diaz; [read] from the community-hosted GM guide unless marked)

### Takeaway
One unit does everything: a monster's level is "how many hero levels it is worth", fractions for small things, and a hard fight is monster levels equal to hero levels. The boss acts after every hero's turn and its statistics do not change with party size.

### Findings
**(a) Ranks**: normal monsters; Flunkies ("like regular monsters ... they can't crit"); Minions; Legendary (solo). The goblin's level of 1/3 "means 3 goblins are about as strong as a level 1 hero".

**(b) Numbers**: a Monster Builder table by level gives HP for no armor / Medium / Heavy, damage per round, a sample attack, a save DC and a 5e CR equivalent. Samples: level 1 = 26 / 20 / 16 HP, 11 damage a round, DC 10; level 5 = 58 / 46 / 35, 19, DC 12; level 10 = 118 / 94 / 71, 30, DC 15; level 20 = 313 / 250 / 189, 54, DC 20. "For each special ability added ... lower the HP or damage 1 step or treat the monster as 1 step stronger"; a glass cannon takes damage from rows higher and HP from as many rows lower. Monster armor replaces a defense number: Medium ignores the attacker's flat modifiers (dice only), Heavy halves the dice; a hero's crit ignores armor. The die size carries the feel, because a 1 on the primary die misses and the maximum crits: d4 undead miss often, d12 giants rarely.

**(c) Budget**: "add up the total levels of the heroes ... Monsters with a total level equal to that will be a hard but fair fight". Easy: under half. Medium: about 75%. Hard: equal. Deadly: 100 to 125%. Very deadly: 150% and up. "Typical encounters should have 1-4 monsters per hero (excluding minions)", with the warning that outnumbering either way breaks the estimate. A session has 2 to 5 fights (1 to 2 easy, 1 to 2 medium, 1 hard). Armor mix: 60% unarmored, 30% Medium, 10% Heavy.

**(d) Boss**: "Legendary monsters act after EACH hero's turn", and only heroes' turns count. Bloodied: a new ability at half HP. Last Stand: at 0 HP it is "dying", gains "dangerous new capabilities", and dies after a fixed extra amount of damage. Legendary saves are rolled with advantage or disadvantage by stat (a declared weak save). The table is by party level and "stay[s] the same regardless of the number of heroes": level 1 = 50 HP (Medium armor), Last Stand 10, small attack 8, big attack 16; each level adds 25 HP, 10 Last Stand HP, 1 and 2 damage. The stated target: "roughly 15 hero turns to get to the Last Stand, and then 2-4 additional turns after that"; a boss has two actions to choose from, a small one that moves and a big one that pays if it is already in position. Optional actions (a roar, a shove, winding up a spent ability) let the GM soften a turn. A "solo" may be a pair that share the after-each-hero turns.
- The designer on 5e's version: "Legendary Resistances are an UNFUN, band-aid mechanic"; in Nimble they negate one attack or save "at a steep cost". [read] https://nimblerpg.com/blogs/news/legendary-monsters-in-5e-how-to-fix-them (the cost itself is not in the post)

**(e) Fodder**: "Any damage kills a minion." Each attacks with one damage die, cannot crit, misses on a 1; minions on the same hero move and roll together ("Roll and add up 5d6 (ignoring any 1s)") and count as one attack for the hero's Defend. They sit outside the level budget: 1 per hero is "slightly more difficult", 2 to 3 "noticeably", 4 "much more challenging". Optional overkill: the minion's die size is its durability (20 damage kills two d10 minions or five d4 minions). Die size by party level: d4 at 1 to 3 up to d20 at 17 to 20.

**(f) Reception**
- A GM: bosses "just go after every PC's turn" and are "by far the best battles I've run"; building is "adding up levels". [checked] https://khajeeting.neocities.org/blogposts/thoughts-on-nimble
- EN World: "We find nimble more deadly than 5e" and "My players drop like flies at level four" (Zaukrie); a first session was "fast and furious". [checked] https://www.enworld.org/posts/9883414

### Gaps
- nimblenomicon is a community site; I did not compare it with the printed book. No critical page on the after-each-hero boss opened (large parties, conditions on the boss).

---

## 4. Daggerheart (Darrington Press, 2025; [read] from the SRD pages named above)

### Takeaway
Hit counts are small and almost flat across tiers; what scales is the threshold a damage roll must beat to mark 2 or 3. The budget is points per PC with a price per adversary type. The "Solo" is priced at about a third of a party's budget, and GMs say it plays like an elite.

### Findings
**(a) Types and prices**: "Start with 3 x the number of PCs + 2 Battle Points." Costs: Minions (a group equal to the number of PCs) 1; Social or Support 1; Horde, Ranged, Skulk or Standard 2; Leader 3; Bruiser 4; Solo 5. Modifiers: easier or shorter fight -1; 2 or more Solos -2; +1d4 (or +2) to all adversary damage -2; an adversary from a lower tier +1; no Bruisers, Hordes, Leaders or Solos +1; harder or longer fight +2. Summoned adversaries and the environment are free. With 4 PCs the budget is 14: a Standard is one seventh of the fight, a Solo a little over a third.

**(b) Numbers**: four tiers. Damage works the same for adversaries and PCs: at or above the Severe threshold mark 3 Hit Points, at or above Major mark 2, below Major mark 1; an optional rule marks 4 at twice Severe. A PC's thresholds come from armor plus level; a PC's Hit Points cap at 12. Medians I computed from the site's 261 stat blocks:

| Type | Tier | Difficulty | Major / Severe | HP | Attack |
|---|---|---|---|---|---|
| Standard | 1 | 12 | 5 / 10 | 4 | +1 |
| Standard | 2 | 14.5 | 9 / 18 | 4 | +1 |
| Standard | 3 | 16 | 18 / 35 | 7 | +3 |
| Standard | 4 | 18.5 | 30 / 47.5 | 6 | +5 |
| Bruiser | 1 | 13 | 8 / 15 | 6 | +1 |
| Bruiser | 4 | 20 | 40 / 70 | 9 | +4 |
| Solo | 1 | 13 | 8 / 15 | 8 | +3 |
| Solo | 2 | 15 | 13 / 26 | 8.5 | +3 |
| Solo | 3 | 18 | 20 / 35 | 10 | +5 |
| Solo | 4 | 20 | 35 / 68 | 11 | +8 |
| Horde | 1 | 10 | 5 / 10.5 | 5.5 | -1 |
| Minion | 1 to 4 | 10 / 13 / 14.5 / 18 | none | 1 | -1.5 to +3 |

So from tier 1 to tier 4 a Standard's Hit Points go from 4 to about 6 while its Major threshold goes from 5 to 30. Standard damage by tier: 1d6+2 to 1d10+1, then 2d6+4 to 2d10+2, 3d6 to 3d10+3, 4d8+8. The core book also has a one-table "improvised statistics by tier" (attack +1 to +4, Difficulty about 11 / 14 / 17 / 20, thresholds about 7/12, 10/20, 20/32, 25/45). [memory]

**(c) What sets difficulty**: the points, then Fear. The GM gains Fear when a PC rolls with Fear; on the GM's turn one adversary is spotlighted and "they can spend additional Fear to spotlight additional adversaries". An adversary acts once per GM turn unless a feature says otherwise. So enemy turns are bought from a pool the dice fill, not fixed per round.

**(d) Solo**: "Relentless (X): This adversary can be spotlighted up to X times per GM turn. Spend Fear as usual" (X is 2 to 4 on the site's stat blocks, most often 3); "Momentum: When the adversary makes a successful attack against a PC, you gain a Fear." Phased battles replace the stat block at a trigger (Fallen Warlord, Volcanic Dragon); a Colossus is several stat blocks as body segments. The site's note on the type: "Despite their name, encounters featuring a Solo should include a group of accompanying Minions, Standards, and Supports" (the site author's editorial text, not the SRD's).

**(e) Fodder**: "Minion (X): The Minion is defeated when they take any damage. For every X damage a PC deals to the Minion, defeat an additional Minion within range the attack would succeed against" (X runs from 2 to 13 on the site's stat blocks). Minions deal flat damage; "Group Attack: Spend a Fear to choose a target and spotlight all" same-named minions in Close range, one shared attack roll, damage added. "Horde (X): When the Horde has marked half or more of their Hit Points, their standard attack deals X damage instead" (about half).

**(f) Reception** (EN World, [checked] https://www.enworld.org/threads/daggerheart-general-thread.713596/page-73 and https://www.enworld.org/goto/post?id=9699995)
- Solos: normal solos "are more like 4e elites" (Vael); "the solos not being solos still bugs me" and alone they are "too easily overwhelmed by groups" (overgeeked). Fixes in use: phases, two solos, minions around it.
- Budget: a challenging fight needs most or all of it and the game favors the PCs; paying 2 points for +2 damage is used to spend the budget "without crowding the map" (overgeeked). The math "should probably have been a little better explained" (zakael19). One GM reported the math accurate and another the opposite because of how much Fear the dice gave. [lead]
- Thresholds, against: "they mostly shifted that bloat from HP to thresholds" (overgeeked); one player dislikes making a big number only to turn it into a small one (Rainbow Scissors); a damage roll that sometimes changes nothing was called a pointless extra step. [lead for the last]
- Thresholds, for: no "0 damage" outcome and toughness "without having to dial up HP bloat" (zakael19); extra damage is "strong but not obviously optimal" once you reach 2 or 3 marks (TwoSix).
- Minions were found hard to run; hordes preferred (overgeeked).

### Gaps
- The official daggerheart.com SRD refused (403); the community edition marks its own additions as "Editorial Addition". No formal review of the Battle Points opened.

---

## 5. Fabula Ultima (mostly [memory]; nothing with the rules text opened)

- Ranks: soldier; elite (counts as 2 soldiers, double HP, two turns a round); champion (declared as replacing N soldiers: HP multiplied by N, N turns a round, more skills). NPCs are built from level: a soldier's HP is twice level plus five times its Might die size, Crisis at half; skills by level; species give fixed rules. [memory; the HP formula also appeared in a search summary: lead]
- Budget: bodies. A search summary of the rulebook's advice: most boss battles should be hard, which means "soldiers equal to the number of Player characters, or a single champion". [lead]
- Boss tools: a Villain has Ultima Points (5 minor, 10 major, 15 supreme [memory]) spent to escape a scene or reroll, never regained; a multi-part boss is an elite or champion body with soldier "limbs" regrown for an Ultima Point. [lead]
- The Bestiary adds routines, a script the NPC follows that players can learn. A GM: "I find the prep required a bit off-putting, but the combat is really fun." [checked] https://www.enworld.org/goto/post?id=9839069
- Not a grid game.

## 6. Shadow of the Weird Wizard / Shadow of the Demon Lord

- Every enemy has a Difficulty; a scene's total is budgeted per character by tier. Easy / Average / Hard per character: Novice 1 / 2 / 4, Expert 2 / 4 / 8, Master 4 / 8 / 16. "If you build a combat scene for four novice characters, the total Difficulty ... would be 4 or less for an easy scene, around between 5 and 15 for an average scene, and 16 or more for a hard one." [read] https://schwalbentertainment.com/wp-content/uploads/2025/12/SWW_SecretsBestiary_Update_v1.1.pdf
- The scale is geometric. At Novice tier a Difficulty 1 enemy is used 2 per character, Difficulty 2 one per character, 4 one per 1.5, 8 one per 2, 16 one per 4, 24 one per 6. [read] same
- The publisher's own correction: "Almost all recommended revisions see a change in Difficulty and almost all of those changes see an increase in one step"; enemies "tend to be a bit more powerful than their original presentation suggests"; Health cut on Difficulty 1 to about 5 creatures "reinforces these creatures' role as being fodder" (many go to 5 or 10 Health). [read] same
- No separate rank system: fodder is a low Difficulty with low Health, a boss a high Difficulty. Demon Lord uses the same idea with totals by tier and has a reputation for fast, swingy fights. [memory]

## 7. Savage Worlds

- Extras are Up, Shaken or out: one Wound removes them. Wild Cards take three Wounds and add a Wild Die to trait rolls. Damage is compared with Toughness: meet it for Shaken, each 4 over is a Wound; damage dice explode; Bennies let a Wild Card Soak. [memory]
- The one rule of thumb in the core book: "A good fight for a party of heroes is two Extras per hero plus an enemy Wild Card leader" with about as many combat Edges as the heroes. [checked] https://www.enworld.org/goto/post?id=9765362 (dbm quoting the book)
- Extras are called "one of the strengths of the system" (Reef); combat "can be a slog if the players treat it like D&D combat" and runs well when players set up big hits together (BrokenTwin). [checked] same
- No challenge rating; GMs balance by comparing a Wild Card's Toughness with the party's usual damage, and it takes "2-5 combats" to get the feel. [lead]
- Exploding damage dropping a boss in one hit is widely reported. [memory]

## 8. D&D 5e 2014 (the cautionary case) and its corrections

**2014** [memory unless marked]
- Budget: an XP threshold per character by level (easy, medium, hard, deadly); the monsters' XP is multiplied by a group-size multiplier (x1 for one, x1.5 for two, x2 for 3 to 6, x2.5 for 7 to 10, x3 for 11 to 14, x4 for 15 or more) to judge difficulty, a step many GMs skipped or got wrong. The "adventuring day" assumed 6 to 8 medium or hard fights; few tables play that way, so single fights against rested parties are easy.
- The solo problem: one monster gets one turn against four or five. Legendary actions (usually 3 a round) and Legendary Resistance (3 automatic saves a day) are the patches; the second is the "band-aid" Nimble's designer complains of.
- The DMG's monster-statistics-by-CR table does not match the Monster Manual: real monsters "have fewer hit points and deal less damage" than it predicts, its attack / DC / AC columns are "arbitrary and inaccurate", and its trait modifiers are "illusory precision". The same author's fitted formulas: attack 4 + half CR; DC 11 + half CR; AC 13 + a third of CR; damage 5 + 5 x CR up to CR 7 (5 x CR above); HP three times that damage. [checked] https://www.blogofholding.com/?p=7338

**D&D 2024**
- Three difficulties (low, moderate, high), an XP budget per character by level, multiplied by the number of characters; spend it on monsters' XP; no group multiplier. A level 5 moderate budget is 750 a character. [checked] https://www.dndbeyond.com/posts/1901-creating-combat-encounters-using-the-new-dungeon
- The first rows are 50 / 75 / 100 at level 1 and 500 / 750 / 1,100 at level 5, about the 2014 medium / hard / deadly numbers, so with no multiplier the same label buys more monsters. [memory]
- Sly Flourish: the 2024 rules are "far improved" and match his benchmark closely; because XP rises steeply with CR they allow more low-CR monsters and fewer high-CR ones; they cannot be done in the head at the table. [checked] https://slyflourish.com/2024_dmg_encounter_building_versus_the_lazy_benchmark.html

**Lazy Encounter Benchmark (Forge of Foes; Shea, Abadia, Gray)**
- A check, not a budget: build from the story, then "an encounter may be deadly if the total of monster challenge ratings is greater than one quarter of total character levels, or half of character levels if they're above 4th level"; a single monster may be deadly above the average level (1.5 times it from level 5). Optional: three quarters from level 11, equal from 17. [read] https://slyflourish.com/the_lazy_encounter_benchmark.html
- Forge of Foes also gives one line of quick statistics per CR. [memory]

**Level Up A5e** ([read] https://a5e.tools/rules/designing-encounters)
- Unit: total CR against total character level. Easy = 1/6, medium = 1/3, hard = 1/2, deadly = 2/3, impossible = equal or more.
- A cap on one monster: "it is an impossible matchup if the maximum monster CR is higher than 1.5 x the average character level", whatever the totals say.
- Elite monsters: "approximately twice the hit points and deals around 50% more damage", count as two monsters of their CR for the total but keep their real CR for the cap.
- Honest about legendary monsters: one at the cap "is a hard matchup for 3 adventurers, a medium matchup for 4 ... and will probably be easy for 5 or more"; give it allies against 4 or more.
- Low levels: monsters under CR 1 count one step higher. A day's budget in encounter points: 1 at levels 1 to 2 up to 8 at 17 to 20; medium costs 1, easy half, hard 2, deadly 4.

**Tales of the Valiant**: its encounter-building section was written by Mike Shea and is a variant of the benchmark; the GM guide adds minions and hordes, multi-phase battles and expanded Doom rules. [lead] https://slyflourish.com/notable_sections_of_the_tov_gmg.html (seen in a search summary only). What Doom does was not opened.

**Giffyglyph's Monster Maker** (ranks and roles grafted onto 5e; [read as summarised] https://giffyglyph.com/monstermaker/grimoire/2.1.2/en/minions_elites_solos.html)
- Minion: HP x0.2, damage x0.75, -2 to AC, attack, saves and DC, XP x0.25; "four minions are the equal of one standard" monster.
- Elite: HP x2, damage x1.1, +2 to AC, attack, saves and DC, XP x2; "one elite is the equal of two standard monsters"; one Paragon Action a round (a move or an action).
- Solo: HP x the number of players, damage x1.2, +2 defenses, +4 initiative, XP x players; Paragon Actions = players minus 1, each a move or an act taken after a player's turn; at 66% and 33% HP it removes all ongoing effects on itself and changes phase.

**The Angry GM's paragon monsters** ([read as summarised] https://theangrygm.com/return-of-the-son-of-the-dd-boss-fight-now-in-5e/)
- A boss is one creature with several full hit point pools, each the base creature's HP. Damage applies to one pool and overflow is lost; when a pool empties, "all ongoing conditions and effects affecting the creature end immediately" and that pool cannot be healed.
- It gets one full turn a round per pool still standing (ideally on separate initiative counts, one after each PC) and loses a turn when a pool empties. In his playtests players preferred losing actions as pools fall over keeping or gaining them.
- It is priced as that many creatures: XP times the pools, each pool counted for the group multiplier.

**MCDM's action-oriented monsters**: covered by another researcher.

## 9. Others (all [memory] unless marked; none opened)

- **Strike!** (4e-descended): tiny numbers (PCs about 10 HP, attacks deal 1 to 3), monsters by role and by rank (Stooge that falls to any hit, Goon, Standard, Elite, Champion), a budget in "one Standard per PC" terms. Often praised for how fast a monster is to write.
- **Beacon** (fantasy, built on Lancer's frame): NPC classes with roles and templates much as Lancer, turns in phases. Its reputation follows Lancer's.
- **Panic at the Dojo**: enemies in ranks (Stooges in groups, Warriors, Bosses whose health and action count scale with the number of heroes); budget by bodies per hero.
- **Trespasser**, **Gubat Banwa**, **DC20**, **Tactiquest**, **Valor**, **Fragged Empire**: I found no page I could open on their enemy math and cannot state their rules reliably. DC20's monster rules were still in development the last I knew.
- **Bludgeon** (in development): one formula gives an enemy's HP from player level, party size, monster type and "expected rounds of survival". [lead] https://tacticsnchai.itch.io/bludgeon-the-ttrpg/devlog/610674/devlog-05-monsters-enemies

---

## 10. Comparison

### The unit of balance
| Game | Unit | A normal fight | Mark |
|---|---|---|---|
| Lancer | enemy turns and structure per PC | about 1.5 turns per PC; structure 1.5 to 2 per PC | [checked] |
| ICON 1.5 | bodies | players + 1 points (twice that for a single-fight day) | [read] |
| Nimble | levels, 1 monster level = 1 hero level | hard = equal levels; medium = 75% | [read] |
| Daggerheart | Battle Points by type | 3 per PC + 2; a Standard costs 2 | [read] |
| Fabula Ultima | soldiers | a hard boss battle = one soldier per PC, or one champion | [lead] |
| Weird Wizard | Difficulty, doubling per step | 2 per Novice character (average) | [read] |
| Savage Worlds | none (a rule of thumb) | 2 Extras per hero + a Wild Card | [checked] |
| 5e 2014 | XP with a group multiplier | by table | [memory] |
| 5e 2024 | XP, no multiplier | by table | [checked] |
| A5E | total CR over total level, plus a cap per monster | hard = half | [read] |
| Giffyglyph | "one standard monster per PC" with rank multipliers | 4 minions = 1 standard = half an elite | [read] |

Two families: body-count units (Lancer, ICON, Fabula Ultima, Giffyglyph, Savage Worlds), where the count of turns is the thing being balanced, and scalar units (XP, CR, Difficulty, monster levels), which need a second rule to stop one big monster or a swarm from breaking the sum (2014's multiplier, A5E's cap, Nimble's "1-4 monsters per hero" warning).

### Flat numbers or numbers by level
- Flat, scaled by rank or template: ICON (identical statistics in every chapter), Lancer (three tiers, steep steps between them), Savage Worlds, Fabula Ultima in part.
- Flat hit count, scaling gate: Daggerheart (4 to 6 marks on a Standard at every tier; thresholds grow sixfold).
- By level: Nimble (HP 26 to 313), 5e and its family, Weird Wizard (Difficulty 1 to 96).
- In the flat games, what a higher tier or chapter adds is mostly complexity and options. ICON says so outright; Lancer's community warns that its tier steps are the one place the numbers jump.

### How a boss stands alone
| Game | Turns | Health | Against shutdown | Verdict found |
|---|---|---|---|---|
| ICON Legend | one per PC, defeated PCs included | 50 per PC | clears one status or mark each round; phases | none opened |
| Nimble Legendary | after each hero's turn | by party level, not party size | saves with advantage; costly resistances; Bloodied and Last Stand | "best battles I've run" [checked] |
| Lancer Ultra | 2 to 3 | a PC's 4 structure | immunity traits | "it won't" hold four alone [checked] |
| Daggerheart Solo | up to 2 to 4 spotlights, each paid in Fear | 8 to 11 marks | none general; phases on some | "more like 4e elites" [checked] |
| Fabula Ultima champion | N | x N | Ultima Points | not found |
| Giffyglyph solo | 1 + (players - 1) Paragon Actions | x players | sheds all effects at 66% and 33% | not found |
| Angry GM paragon | one per pool | one pool per stacked creature | conditions end when a pool empties; loses a turn too | players preferred the shrinking boss [checked] |
| A5E legendary / elite | legendary actions; elite = 2 monsters | elite x2 | legendary resistance | the book says it fails against 5 or more [read] |

The bosses with a good verdict tie turns to the number of PCs (ICON, Nimble, Giffyglyph, Angry). The ones called disappointing give a fixed 2 or 3 turns or make turns cost a resource (Lancer, Daggerheart, 5e). Health splits two ways: per PC (ICON, Giffyglyph, Fabula Ultima), or fixed with a count of hero turns as the target (Nimble's 15). Three different answers to conditions: a cleanse per round (ICON), a cleanse at health marks (Giffyglyph, Angry), or a price paid to ignore one (Nimble).

### Fodder
| Game | Dies to | Attacks | Counts as |
|---|---|---|---|
| ICON Mob | 2 hits a member, any damage is a hit; immune to statuses | one set of actions for the whole mob | 1 point; 0 for scoring |
| Nimble Minion | any damage; optional overkill by die size | one die each, rolled together, no crit | outside the budget (a per-hero dial) |
| Daggerheart Minion | any damage; every X more kills another | flat damage; group attack on one roll for a Fear | a group of PC-count for 1 point |
| Lancer Grunt | 1 HP | full damage | 1/4 |
| Giffyglyph Minion | HP x0.2 | damage x0.75, -2 to hit | 1/4 |
| Savage Worlds Extra | one Wound (Shaken first) | normal | 2 per hero |
| Weird Wizard | Health 5 to 10 | normal | Difficulty 1 |

Only ICON uses a hit count on fodder, and it makes any damage one hit. Daggerheart's thresholds are the nearest thing to hits by tier, and it uses them on everything except its minions. Complaints cluster on fodder that keeps full damage (Lancer) and on fodder that is fiddly to move one by one (Daggerheart); the praised versions act and roll as a group (Nimble, ICON).

### "The budget works" or "the budget lies"
- Reported as working: Nimble (hard = equal levels; little dissent found, but it is called deadlier than 5e) [checked]; 5e 2024 against 2014 [checked].
- Admits its limits in the rules: ICON ("the final point of balance is the game master", reserves as the dial); A5E (the cap and the legendary warning); the Lazy Benchmark (a deadliness check only). [read]
- Reported as off: 5e 2014 (the multiplier, the adventuring day, a table that does not match its own monsters) [memory, checked]; Lancer's core advice on the lone Ultra and its hard intro module [checked]; Weird Wizard's first Difficulty numbers, raised a step almost everywhere by the publisher [read]; Daggerheart's Solo price and a budget that leans to the PCs, with table results depending on Fear [checked, lead].
- No budget at all and little complaint about it: Savage Worlds [checked].

## Questions this raises for 2d12 (questions only)

1. Is 100 Combat Value a measure of a body (a turn on the zipper) or of power? The body-count games price a boss as "the whole budget"; the scalar games need a cap or a multiplier.
2. With zipper initiative, how many enemy turns per PC turn does a normal fight have, and does a Minion squad count as one turn or three? Lancer and ICON treat that count as the thing being balanced.
3. Should a Boss's health be per PC (ICON, Giffyglyph), or fixed with a target number of PC turns (Nimble's 15)?
4. Which answer to conditions on a Boss fits "least ambiguity": one cleanse a round, a cleanse at Bloodied, or a paid resistance?
5. Does a Boss lose something when it is Bloodied or Strained (Angry GM's shrinking boss), gain something (Nimble's Bloodied and Last Stand), or both?
6. Daggerheart's adversaries keep about the same number of marks at every tier and move the thresholds. 2d12's rolls are flat: what, if anything, should differ between a low and a high creature besides options?
7. Do Minions sit inside the Combat Value budget (ICON, Daggerheart, Lancer's quarter) or beside it as a dial (Nimble)?
8. ICON's mob is immune to statuses and causes no engagement. What do conditions and Reactions do against a squad of ticks?
9. Does a Minion keep a full-strength attack (Lancer's complaint) or a reduced, pooled one (Nimble, Daggerheart, Giffyglyph)?
10. Is there one honest sentence about what the budget cannot see (objectives, reinforcements, terrain, Escalation's round number), as ICON and A5E write into their rules?
11. Rally Points make a day's attrition; ICON and A5E give a second budget for "one fight today". Is one needed?
12. Do objectives with a round limit (Lancer's sitreps, ICON's round 6) belong in the bestiary's encounter rules, given that Escalation already counts rounds to 6?

## What did not open
- lancer.wiki.gg (404 or 403 on every page tried); the Lancer NPC data files (paid content, not in the public repository); the Lancer core book's GM chapter.
- daggerheart.com/srd (403). The community SRD was used instead.
- giffyglyph.com/monstermaker (403 on the landing page; the grimoire page opened).
- schwalbentertainment.com's "Enemies and Combat" post (aborted); the Secrets of the Weird Wizard encounter chapter itself.
- anyflip's Fabula Ultima scan (403): no Fabula Ultima rules text read.
- nimble-co.pages.dev (no response). theangrygm.com and blogofholding.com refused a plain download but opened through the fetch tool.
- EN World's "New DMG Encounter Building Math vs 2014" thread (my link led to another thread). Reddit and RPG.net were not tried.
- ICON 2.0's foe rules; Tales of the Valiant's Doom and encounter text; Savage Worlds' rules text; Strike!, Trespasser, Gubat Banwa, DC20, Beacon, Tactiquest, Valor, Fragged Empire, Panic at the Dojo.
