# Monster design and encounter building in D&D 4e and 13th Age (1e and 2e)

Date: 2026-11-25. Raw research notes: other games' rules and other people's opinions. Nothing here is a 2d12 rule or a proposal for one.

## How far to trust it

Every statement carries one of four marks, with the URL beside it:

- **[read]** = rules text (or a designer's own published text of the rules' reasoning) on a page I opened and read myself. Note where the page is a reproduction: the 4e books are not legally online, so most 4e "rules text" below is a designer excerpt or an errata summary that a blog reproduced.
- **[checked]** = an opinion, a report or a designer's statement on a page I opened. It is what that person said, not a fact about the rules.
- **[lead]** = seen only in a search summary, or on a page that refused to open. Unverified: check before relying on it.
- **[memory]** = from my own knowledge, no page opened. The 4e Dungeon Master's Guide tables (XP budget, encounter templates, the role table) are mostly in this grade, because no legal copy opens.

Where I did arithmetic on someone's table, it says "my arithmetic". Two things to keep in mind: (1) the Wayback Machine did not open in this session, so none of Wizards' own Design & Development columns were read at the source; (2) the 13th Age 2e numbers come from the 2024 "Gamma" playtest packet plus Pelgrane's official "Changes from 1E" summary, not from the final Gamemaster's Guide. The list of what did not open is at the end.

---

## 1. D&D 4e: the structure (roles, ranks, budget, templates, level ranges)

### Takeaway
4e put monsters on the same 1 to 30 level scale as PCs, made "one standard monster per PC of the same level" the unit of an encounter, and bought everything else with one currency (XP): elite = 2, solo = 5, minion = 1/4. A role is a package of number shifts (HP per level, AC, accuracy, damage column) plus a job on the battlefield.

### Cited findings

**The unit and the currency**
- The "platonic ideal" of a balanced encounter is a group of monsters of the same size and level as the party, and "balanced" means a fairly easy fight the party can do several times a day. [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html
- XP does not depend on role; an elite is worth twice a standard of its level, a solo five times, a minion a quarter. [checked, a 2008 pre-release analysis] https://www.enworld.org/threads/monster-xp-formula.220538/ (One fan summary says a solo is "worth four regulars": [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html. The two disagree; x5 XP is also what I remember [memory], and x4 is the later HP multiplier, which may be the source of the slip.)
- The budget: take the XP of one standard monster of the encounter's level, multiply by the number of PCs, then buy monsters, traps and hazards up to that total (DMG p. 56). Example given: a level 4 encounter for 3 PCs is 175 x 3 = 525 XP. [checked, a poster citing the page] https://www.enworld.org/threads/encounter-level-questions.291408/
- The XP of a standard monster doubles every 4 levels (100 at level 1, 200 at 5, 400 at 9, 800 at 13, 1,600 at 17), then steepens in the epic tier. So a monster 4 levels above the party costs two PCs' worth of budget. [checked] https://www.enworld.org/threads/monster-xp-formula.220538/ . The full table as I remember it: 100, 125, 150, 175, 200, 250, 300, 350, 400, 500, 600, 700, 800, 1,000, 1,200, 1,400, 1,600, 2,000, 2,400, 2,800, 3,200, 4,150, 5,100, 6,050, 7,000, 9,000, 11,000, 13,000, 15,000, 19,000. [memory]
- Minions: "Four minions are considered to be about the same as a standard monster of their level." [read, Stephen Schubert's "Excerpts: Minions", Wizards 2008, reproduced] https://dndzero-reboot.blogspot.com/2008/05/excerpts-minions.html . The DMG "gives you exact numbers of minions to use at different tiers". [checked, Chris Sims, a 4e designer] https://critical-hits.com/blog/2010/07/22/minions-are-spice . Those numbers are 4 per standard at heroic, 5 at paragon, 6 at epic. [memory]
- Elites: double HP, an action point, a save bonus; solos: 4x HP at heroic and 5x at paragon and epic in the first books, +5 to saves, two action points; both had bonus defenses in the first Monster Manual. [memory for the package; confirmed in part: "+5 to saves" [checked] https://theangrygm.com/the-dd-boss-fight-part-1/ ; solos used "different formulas for heroic and higher tiers" [checked] https://squarefireballs.blogspot.com/2009/02/monster-numbers.html ; "elites and solos got special defense bonuses" early on [checked] https://www.enworld.org/threads/the-revised-monster-math.332791/ ]

**Roles (what each changed in the numbers)**
- A monster's attack bonuses, defenses and HP depend on level and role, not on creature type. Skirmishers are the baseline with mobility; brutes have high HP, high damage, low AC; soldiers have high AC and "sticky" fighter-like powers; lurkers do big damage that needs a set-up turn; controllers have skirmisher-like numbers plus conditions and battlefield shaping; artillery are fragile, poor in melee, strong and accurate at range. Leader is a tag on top of a role. One creature (kobold, ogre) is printed in several roles so an all-kobold fight is still tactically varied. [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html
- DMG1's "Monster Statistics by Role" (p. 184), as formulas. HP: 8 + Con + 8 per level for skirmisher, soldier, controller; 10 + Con + 10 per level for brute; 6 + Con + 6 per level for lurker and artillery. AC: level + 14 (skirmisher, lurker, controller), level + 12 (brute, artillery), level + 16 (soldier). Other defenses: level + 12 for all. [lead: a search summary of a reproduction of the table; it matches my memory] Attack vs AC: level + 5 baseline, level + 3 brute, level + 7 soldier and artillery; vs other defenses 2 lower. [memory; the brute penalty and the soldier bonus are confirmed by the designer, see section 3]
- The DMG's HP figures hide a Constitution term; one analyst's averages assume Con 12 for most roles, 15 for brutes, 18 to 20 for solos. [checked] https://squarefireballs.blogspot.com/2009/02/monster-numbers.html
- Damage came from a "Damage by Level" table with low / medium / high columns for normal attacks and a "limited" set for encounter or recharge powers: medium for most at-wills; low for multi-target attacks, artillery's melee and controller attacks with strong control; high for low-accuracy attacks (brutes) and lurkers' big hits. [checked, a poster quoting DMG step 9] https://www.enworld.org/goto/post?id=4553688
- From Monster Manual 2 on, minions carry a role too ("Level 10 Minion Brute"): the role sets their defenses and damage, never their HP. [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html

**Easy / standard / hard, and level ranges**
- DMG p. 56 as quoted by a forum poster: easy = an encounter 1 to 2 levels below the party; standard = the party's level or 1 higher; hard = 2 to 4 levels higher. [lead: search summary of a forum quote] A second poster says the same: hard is "two to 4 levels higher", easy 2 or more lower. [checked] https://www.enworld.org/threads/encounter-level-questions.291408/
- What "standard" meant: "its outcome is not supposed to be in doubt"; the PCs win, spending encounter powers "and a surge or two" each, or a daily if it goes badly. An easy fight is not even a speed bump. [checked, a poster's reading] https://www.enworld.org/threads/encounter-level-questions.291408/
- The DMG's suggested mix across a level: about half the encounters above the party's level (mostly +1 or +2, about one per level at +3). [checked, a poster paraphrasing the DMG] https://www.enworld.org/threads/4e-needs-monsters-between-minion-and-normal.246197/
- In practice: level +1 or +2 is "challenging", +3 or +4 is "boss battle material", +5 or more is where the PCs might be better off running. [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html
- Individual monsters: the DMG lets threats run from about 4 levels below the party (easy) to 3 to 5 above (hard), and its templates go as far as n + 7. [memory] Table practice was narrower: "probably don't want" monsters more than 2 below or 3 above; "never" more than 5 above, because the party can hardly hit them and they hardly miss. [checked] https://www.enworld.org/threads/encounter-level-questions.291408/

**The five encounter templates (DMG pp. 58 to 59)**
- Their names and shapes: Battlefield Control (one controller plus skirmishers), Commander and Troops (one higher-level commander plus soldier or brute troops), Dragon's Den (a solo, plus an elite in hard versions), Double Line (brutes or soldiers in front; artillery or controllers behind), Wolf Pack (skirmishers only). [lead: search summaries of fan tools] Lurkers "only show up in the harder Double Line groups", and minions are handled by substitution (four for one monster of the same level). [checked] https://critical-hits.com/blog/2008/11/19/dd-4e-new-encounters . A tool author found Dragon's Den and Wolf Pack "weren't really worth doing" as templates, since each amounts to picking one kind of monster. [checked] https://www.enworld.org/threads/more-encounter-templates.244913/
- The compositions, with n = the party's level, as I remember them [memory, unverified]: Battlefield Control: easy = controller n - 2 + 6 skirmishers n - 4; standard = controller n + 1 + 6 skirmishers n - 2; hard = controller n + 5 + 5 skirmishers n + 1. Commander and Troops: easy = commander n + 4 troops n - 3; standard = commander n + 3 + 5 troops n - 2; hard = commander n + 6 + 3 troops n + 1 + 2 artillery n + 1. Dragon's Den: easy = solo n - 2; standard = solo n or n + 1; hard = solo n + 3, or solo n + 1 with an elite n. Double Line: easy = 3 front n - 4 + 2 rear n - 2; standard = 3 front n + 2 rear n (or 3 front n - 2 + 2 rear n + 3); hard = 3 front n + 2 + 1 controller n + 4 + 1 artillery or lurker n + 4. Wolf Pack: easy = 7 skirmishers n - 4; standard = 7 at n - 2 or 5 at n; hard = 3 at n + 7, 4 at n + 5 or 6 at n + 2.

### Inferences
- The templates show the designers expected the XP currency to hold across a 10-level spread (n - 4 to n + 7). The later community consensus (below) is that it only holds within about 3 levels, because accuracy moves 5% per level on both sides. [my inference]
- A role is a rating set and a job description at once; the numbers alone (soldier +2 AC, brute -2 AC and more HP) are small, which is why the designers later leaned on automatic role-enforcing effects instead (section 3).

### Gaps
- The DMG's own wording for easy / standard / hard and for monster level limits was not read; all of it is a forum quote, a lead or memory.
- The template compositions are memory only.

---

## 2. D&D 4e: the math as formulas

### Takeaway
After the 2010 revision everything fits on a card: per level, +1 to hit, +1 defenses, +1 damage, +8 HP. The design intent was a standard monster dying to about four hits (four to six basic attacks), and a monster "lifespan" of about five rounds; the HP term grows faster than PC damage, so that intent only holds at low level.

### Cited findings
- **"MM3 on a business card"** (read from the card image): "Level 0 monster: AC 14, Def 12, Hit +5, Avg Dmg 8"; +1 to each per level. Damage: +25 to 50% for an encounter power, +25% brute, -25% multi-target. Minion: half damage. Elite: x2 HP. Solo: x4 HP. HP by role: skirmisher, controller, soldier 24 + 8 per level; brute 26 + 10 per level; artillery and lurker 21 + 6 per level. AC by role: soldier +2, brute -2, artillery -2. [read] https://blogofholding.com/?p=512
- The author's summary of the change: damage rose by about half a point per level to "8-plus-monster-level", and "every role has a to-hit bonus of around 5 plus monster level". [checked] https://blogofholding.com/?p=512 . The same baseline elsewhere: core damage of a standard monster = level + 8; shift by 25% for brutes, limited or multi-target attacks; aim for half the damage from dice and half static. [checked] https://slyflourish.com/calculating_monster_damage.html . Minion damage about 4 + half level. [lead, search summary of the same page]
- This math was also published as an errata update to the DMG (July 2010). [checked] https://bira.github.io/octopus-carnival/2022/04/23/mm3-intro.html . The update's soldier attack row contained a typo, confirmed by Greg Bilsland answering Logan Bonner. [checked, quoted in thread] https://www.enworld.org/threads/mm3-damage-expression-table.281116/ . The exact corrected soldier values were not verified.
- **Hits to kill, the designers' number.** Schubert: "a typical monster might take four to six basic attacks to knock out", and four to six minions should take about the same number of actions. [read] https://dndzero-reboot.blogspot.com/2008/05/excerpts-minions.html . The Player's Strategy Guide: "Assume that your heroes can kill a typical monster with four successful attacks." [checked, quoted by Blog of Holding] http://blogofholding.com/?p=782
- **How it drifts.** Level 1: 32 HP against about 9 damage a hit = 4 hits. Level 10: 96 HP against about 18 = 6 hits. Level 30: 264 HP against about 38 = 7 hits. Monsters gain 8 HP a level; PCs gain 4 to 6. The author's fix: remove 3 to 4 HP per level from every monster. [checked] http://blogofholding.com/?p=782 . A second analysis on the same blog sets the target as "about 3-4 hits" at every level for PCs and monsters, 4 to 5 for brutes and defenders, 2 to 3 for lurkers and artillery, and reports fights going from 1 to 2 hours at low level to 3+ hours at high level. [checked] https://www.blogofholding.com/?p=3625
- **Rounds.** David Noonan (Design & Development): "A typical monster has a lifespan of five rounds." [checked, quoted by The Alexandrian] https://thealexandrian.net/wordpress/2008/roleplaying-games/playtesting-4th-edition . Chris Sims: minions that started the battle and are still standing at the start of round 3 "have probably done their job". [checked] https://critical-hits.com/blog/2010/07/22/minions-are-spice . Fan estimates: 2 to 3 rounds for an under-level fight, about 4 for a standard one, 5 to 8 for a boss. [lead]
- **PC hit chance.** One fan spreadsheet (average PC, proficient weapon, an expertise feat) finds the PC needs "a 9 or higher" against a same-level monster's AC at every level: 60%. [checked] http://rpg.brainclouds.net/2012/01/26/4th-edition-attack-math/ . A forum reading: about 50%, give or take 10. [lead] No designer statement of a target hit rate was found.
- **Level difference.** With +1 per level on attack and defenses, each level of difference is 5% on both sides: a level + 4 monster is hit 20 points less often and hits 20 points more often. [my arithmetic on the card]
- **Monster hit as a share of PC HP** (my arithmetic; PC HP figures from memory): MM3 damage is level + 8. At level 1, 9 damage is about 30 to 40% of a PC's HP (22 to 30 HP), more than one healing surge (a quarter of HP). At level 30, 38 damage is about 19 to 27% of HP. Before MM3 the high-level share was roughly a third lower.
- **Surges and the day.** No designer figure found. Fan figures: a standard encounter costs the party "a surge or two" each [checked] https://www.enworld.org/threads/encounter-level-questions.291408/ ; 3 to 6 surges per standard encounter, double digits for a boss, and a design assumption of 3 to 5 encounters a day [lead]; "slightly less than one-fifth of a party's resources" per encounter, so five fights a day but probably not six [checked] https://www.dmingwithcharisma.com/2016/09/changing-4e-monster-hit-points/ . Bilsland cut PCs to 1 or 2 surges in his own Dark Sun game to make it feel dangerous. [checked, quoted] https://www.enworld.org/posts/7016843/

### Inferences
- The stated target (4 hits, 5 rounds) and the published formula (8 HP a level) disagree above level 5 or so; the designers fixed the damage side in 2010 and never the HP side. The community's most common remaining house rule was HP down, not damage up.
- A 60% PC hit rate and "4 hits" means about 6 to 7 PC attack actions per standard monster, which matches Schubert's "four to six basic attacks" only if encounter and daily powers carry part of the load. [my arithmetic]

### Gaps
- No source opened for the DMG1 role table itself or the official July 2010 update PDF.
- No designer statement on intended hit chance, monster hit chance against PCs, or surges per encounter.

---

## 3. D&D 4e: what went wrong and what was fixed

### Takeaway
Four failures were named by players and then by the designers: fights that were decided long before they ended ("the grind"), solos that were both too tough and too easy to shut down, minions that auto-damage erased and that created a "which one is the minion" game, and monsters outside a narrow level band. The fixes came in three steps (MM2 2009, MM3 2010, Monster Vault late 2010) and were mostly: less defense and HP on solos, 30 to 40% more damage, flat accuracy across roles, role effects that work on a miss, and extra or protected actions for solos.

### Cited findings

**The grind**
- "Padded sumo": The Alexandrian's 2008 playtest report says HP went up and PC damage down, so fights became "I hit him", "I hit him again", and monsters with few options outlived the five rounds they were built for. [checked] https://thealexandrian.net/wordpress/2008/roleplaying-games/playtesting-4th-edition
- The grind defined: the point where the PCs know they will win and it still takes five more rounds. [checked] https://slyflourish.com/dungeons_and_dragons_4e_hard_mode.html . A five-year 4e GM: by halfway through, encounter powers are spent and the rest "feels rote"; a single combat "can literally take over two hours". [checked] https://ludusnovus.net/2015/04/30/how-to-fix-dd-4e-combat/
- The first Monster Manual's monsters "generally did too little damage"; elites and solos had defenses that were too high; high-level solos had "ridiculously large HP totals". [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html
- A contested origin story: at Ben Riggs's Gen Con 2023 seminar, an attendee reports Riggs saying that just before the Monster Manual went to print someone in management decided monster HP were too low "and raised them all", with no review or playtest. [checked, a second-hand report; Riggs called his research preliminary] https://www.enworld.org/posts/9089454/ . Other posters doubt it, noting MM1's HP match the DMG's own formulas. [checked] https://www.enworld.org/goto/post?id=9100786
- Brutes: low defenses, high HP and (before MM3) low accuracy made them the monster the party ignored and then spent "the most boring several rounds" finishing. [checked] https://www.enworld.org/goto/post?id=4553688 . Soldiers were probably the strongest role because of AC plus accuracy. [checked] https://www.enworld.org/goto/post?id=4808851

**The designers' corrections**
- MM2 (2009): elites and solos lost their defense bonuses; solos have about 20% less HP; brute and soldier accuracy tuned. [checked] https://bira.github.io/octopus-carnival/2021/03/25/wir-mm2-intro.html . The Wizards panel at Gen Con 2009, as reported: multiply an old solo's HP by 0.8, take 2 off AC and two other defenses, and give something back at bloodied (more damage, a burst); old solos "took far longer to kill than intended". [checked] https://slyflourish.com/running_solos_the_monster_manual_2_way.html . MM2 solos use x4 HP to level 30 and start getting several turns a round. [checked] https://www.enworld.org/goto/post?id=4808851
- MM3 (2010), Greg Bilsland: the team asked "whether monsters were threatening PCs", concluded PCs were killing monsters too fast to be challenged, and "increased monster damage output by about 30-40%" (at paragon and epic; a commenter measured 50 to 60% on previews). Brute accuracy went "back to baseline" so that brutes below the party's level stay usable. [checked] https://critical-hits.com/blog/2010/06/07/monster-manual-3-interview-with-greg-bilsland and https://gregbilsland.wordpress.com/2010/06/16/more-on-monsters-2/
- Bilsland on why the first math was wrong: early monsters "were designed with symmetry in mind" (a brute's damage bonus paid for with an accuracy penalty), which was unfair because nobody penalized controllers for control or artillery for range; "monsters don't need an accuracy bonus unless their role calls for it, and they don't need an accuracy penalty at all". Conversion: old brutes +2 to attack, old soldiers -2. [checked] https://gregbilsland.wordpress.com/2010/06/16/more-on-monsters-2/
- Bilsland on roles: more monsters should have automatic effects that enforce the role (a soldier marks on a miss, a controller controls on a miss); keep automatic effects mild (slow, forced movement, marks, penalties; not daze, and immobilize "can be a bit risky"). [checked] same page
- Bilsland's quick fix for old monsters: levels 1 to 10 are "performing just fine"; from paragon, double the flat damage bonus (triple for a brute). [checked] https://gregbilsland.wordpress.com/2010/06/08/more-on-monsters/ . The community shorthand: +half level damage, +2 attack for brutes, -2 defenses for elites and solos, and optionally -3 HP per level. [checked] https://bira.github.io/octopus-carnival/2019/01/03/wir-mm-4e-intro.html
- Mike Mearls (on the D&D podcast, as reported): give monsters the option to go berserk, trading HP for damage (+half level damage for half level HP). [checked] https://slyflourish.com/three_monster_powers_to_speed_up_combat.html
- HP was never officially reduced for standards. One long campaign cut 3 + 3 per level from every standard monster and found fights "more dynamic": more time on encounter powers, less on at-wills, elites and solos standing out more. [checked] https://www.dmingwithcharisma.com/2016/09/changing-4e-monster-hit-points/

**Solos**
- The best diagnosis found (The Angry GM, 2010) lists six problems: too few actions (a normal encounter gets five standard and five move actions a round); all its actions come in one lump; the fight goes static; conditions hit "the entire monster party" at once and end-of-next-turn effects ignore the +5 save; action denial (daze, stun, prone) is devastating; both sides spend their best powers at the start; and there are only two progress markers (bloodied, dead) against ten in a five-monster fight. He argues cutting HP treats the symptom. [checked] https://theangrygm.com/the-dd-boss-fight-part-1/ . His answer is a boss in stages, each stage a change in the fight. [checked] https://theangrygm.com/the-dd-boss-fight-part-2/
- "Dazing a solo is roughly five times more effective" than dazing a normal monster. House powers: a stun costs only the next standard action and a daze the next minor; or the monster pays HP (its level; 5 per level in a later version) for an immediate save against anything. [checked] https://slyflourish.com/solo_shakers.html and https://slyflourish.com/dungeons_and_dragons_4e_hard_mode.html
- Advice from the same period: never run a solo alone; use a solo of the party's level plus other monsters or hazards instead of a solo four levels up, which "extends combat without providing the challenge". [checked] https://slyflourish.com/four_tips_for_running_solo_creatures.html
- Bilsland on MM3 solos: the fight must be "climactic and transformative", not static; the monster changes the battlefield (often with auras) and changes at bloodied; a lurker solo got lurker-like powers, not a lurk mode, because being hard to attack half the time "makes for a long and frustrating fight". He does not accept "PCs have too many ways of shutting down monsters" as an excuse: let the monster save against effects a save does not normally end. [checked] https://critical-hits.com/blog/2010/06/07/monster-manual-3-interview-with-greg-bilsland and https://gregbilsland.wordpress.com/2010/06/16/more-on-monsters-2/
- Monster Vault dragons (late 2010): an Instinctive Action that happens automatically at an initiative count 10 above the dragon's own, and Action Recovery, which ends dazed, stunned and dominated at the end of its turn. [checked] https://bira.github.io/octopus-carnival/2020/01/12/dragons.html . Monster Vault solos "handle dazes and stuns well"; MM3 and Dark Sun solos "try a few different things". [checked] https://slyflourish.com/solo_shakers.html . A playtest of the redone young black dragon: the instinctive action plus a recharged breath killed a party at the last moment. [checked] https://www.enworld.org/goto/post?id=5288751

**Minions**
- The rule and its reasons, in the designer's words (Schubert): previous editions' mooks could be ignored; the minion must stay relevant. It dies to one hit ("the minion essentially does his job if it can keep a PC occupied for a turn"). They tried a few hit points, but then a weak hit forced the DM to track them, so it became 1 HP. Defenses and attack bonus on the normal scale for its level, so it is not hit on a 2 and does not need a 20. Damage flat. "A missed attack never damages a minion", but damage that needs no attack roll (Cleave, a wall of fire, the paladin's challenge) does kill it. Use minions of the encounter's level only. [read] https://dndzero-reboot.blogspot.com/2008/05/excerpts-minions.html
- Auto-damage: a player describes five minions dying to an aura at the start of his turn, before he acted, then two more to a burst: seven minions, "nearly as much XP in the budget as 2 standard creatures", in one round. [checked] https://www.enworld.org/goto/post?id=5361357 . By paragon, big bursts and auto-hit powers mean controllers "decide which minions live or die"; and minion damage grows about 50% over ten levels while PC HP triples. [checked] https://www.enworld.org/threads/solving-all-minion-issues-long.253492/ . The 2010 Magic Missile (no attack roll) is named by a designer as one more auto-kill. [checked] https://critical-hits.com//2010/08/19/minions-of-differing-flavors
- Fake or fun: The Alexandrian's players "were not impressed"; not rolling damage made it feel as if their blows never landed, and the miss clause meant choosing powers by whether a target was a minion, so the characters seemed to carry "some sort of minion-detector". [checked] https://thealexandrian.net/wordpress/2008/roleplaying-games/playtesting-4th-edition . The "paper tiger" objection (a high-level minion killed by a scratch) and the "wasted damage" objection (a big hit on 1 HP feels squandered). [checked] https://www.enworld.org/threads/rpg-evolution-the-mook-the-bad-and-the-ugly.718973/ . Against that: the appeal is the DM's side, 20 minions with no HP tracking. [checked] https://www.enworld.org/threads/4e-monster-design.329130/
- What a designer said later (Chris Sims, 2010): minions are "spice". They give two illusions (my character is awesome; the few against the horde) and change pacing. His playtest conclusion: minions should not be part of the encounter's main challenge unless the DM wants a fight easier than its budget, "neither obvious nor spelled out in any D&D rulebook". Add them in waves, spread out, on one initiative. [checked] https://critical-hits.com/blog/2010/07/22/minions-are-spice . His variants: a minion that "takes damage only when hit by an attack" (shuts off auras and auto-hits); immunity (never resistance, which is useless at 1 HP); a save against the first hit for a tough minion; zombies that stand up again; minions whose aura or death effect is the threat. Use sparingly: being repeatedly immune to a character's powers is frustrating. [checked] https://critical-hits.com//2010/08/19/minions-of-differing-flavors
- House rules seen: two-hit minions (the first hit bloodies, the second kills; a crit kills outright), which also makes "bloodied" powers work on them [checked] https://www.enworld.org/threads/minion-house-rules.249776/ and https://www.enworld.org/threads/13th-age-stealing-the-mook-rules-from-13a.358398/ ; a damage threshold (dies only to damage at or above it), preferred by some as cleaner than two hits [lead]; a middle rank between minion and standard, variously "troopers" or "adjuncts", or simply a standard with half HP and half XP [checked] https://www.enworld.org/threads/4e-needs-monsters-between-minion-and-normal.246197/ and https://www.enworld.org/threads/4e-monster-design.329130/ ; a shared pool carried from minion to minion [checked] https://www.enworld.org/threads/solving-all-minion-issues-long.253492/ . One blog's two-hit playtest reported more teamwork and unhappy strikers. [lead: the page did not open]

**Too high, too low**
- "Don't use monsters more than a level above the party. They're harder mostly because the player characters miss more often, and missing isn't fun": spend a higher budget on more monsters of the party's level instead. [checked] https://ludusnovus.net/2015/04/30/how-to-fix-dd-4e-combat/ . The opposite risk with optimizers: several near-level monsters get hit 80% of the time and vanish. [checked] https://www.enworld.org/threads/the-revised-monster-math.332791/
- Monsters that only attack AC must be near the party's level to be a threat; monsters attacking the other defenses stay effective several levels down, because PCs' weak defenses lag. [checked] https://www.enworld.org/goto/post?id=4645724 . By epic some non-AC defenses "just tank" and are hit almost automatically. [checked] https://www.enworld.org/threads/mm3-damage-expression-table.281116/

### Inferences
- The order of the official fixes (defenses down in 2009, damage up in 2010, action economy in late 2010) is the order in which the symptoms were loudest, not a redesign from a target; Bilsland's words show the 2010 pass began from one test ("are monsters threatening PCs?").
- Every durable solo fix protects actions, not hit points.
- Every minion complaint traces to one of three things: all-or-nothing damage (wasted overkill, auto-damage), a visible special case (the miss clause), or a budget share (a quarter of a standard) that the fiction cannot hold once area attacks arrive.

### Gaps
- Wizards' own columns on MM3 solos, the new stat block and Monster Vault (Mearls, Bonner, Thompson, Schubert) did not open. Wyatt and Collins: nothing found.

---

## 4. D&D 4e: the designers on how they built it

### Cited findings
- Schubert (minions, 2008) reasons from time first: how many PC actions a monster should absorb (four to six basic attacks), then makes four to six minions cost the same actions, then keeps hit and be-hit rates on the normal scale so neither side rolls for a 2 or a 20. [read] https://dndzero-reboot.blogspot.com/2008/05/excerpts-minions.html
- Noonan (monster presentation): a monster lives five rounds, so "it basically does five things, ever", and the stat block should hold only what it does in a fight. [checked, quoted by The Alexandrian, who rejects the reasoning] https://thealexandrian.net/wordpress/2008/roleplaying-games/playtesting-4th-edition
- Bilsland (2010): the first role numbers came from symmetry (a bonus paid by a penalty) and the revision from a threat test in development; he "almost never" runs a monster as written, and calls the stat block "a foundation". [checked] https://gregbilsland.wordpress.com/2010/06/16/more-on-monsters-2/
- Sims (2010): the minion's budget value was known in late playtesting to overstate its challenge. [checked] https://critical-hits.com/blog/2010/07/22/minions-are-spice
- Rob Heinsoo's recent comments on 4e (Mastering Dungeons podcast, episode 191), as summarized by a listener, are about the edition's reception (rules and setting changed together; powers used to sell supplements), not about monster math. [checked, a listener's summary; the audio was not heard] https://www.enworld.org/threads/new-interview-with-rob-heinsoo-about-4e.704373/

### Gaps
- No statement of the form "we started from fight length / hit rate / monsters per PC" by Heinsoo, Collins, Wyatt or Mearls was found on a page that opened. The closest primary evidence is Schubert's excerpt (actions per monster) and Noonan's five rounds.

---

## 5. 13th Age 1e (2013): monsters and building battles

### Takeaway
13th Age keeps 4e's level-and-role monsters and its "one monster per PC" unit but strips the GM's load: one stat line by level for every role, fixed damage, special attacks triggered by the natural d20, a ratio table in place of an XP budget, and mooks that share one damage pool so no damage is wasted.

### Cited findings

**Building battles (1e SRD text)**
- The fair fight: at levels 1 to 4, one monster of the party's level per PC; at levels 5 to 7, one per PC, each one level higher; at levels 8 to 10, two levels higher. [read] https://www.13thagesrd.com/running-the-game/
- Monster Equivalents, relative to that baseline (adventurer tier shown; shift one row per tier): 2 levels lower = 0.5 of a monster; 1 lower = 0.7; same = 1; 1 higher = 1.5; 2 higher = 2; 3 higher = 3; 4 higher = 4. A mook counts 0.1 / 0.15 / 0.2 / 0.3 / 0.4 / 0.6 / 0.8 on the same rows; a large (double-strength) monster 1 / 1.5 / 2 / 3 / 4 / 6 / 8; a huge (triple-strength) monster 1.5 / 2 / 3 / 4 / 6 / 8. [read] same page
- Mooks per standard: 5 at champion and epic tier; 3 at levels 1 and 2; 4 at levels 3 and 4. [read] same page
- Later supplements add "Weakling" (counts as half a monster) and "Elite" (counts as 1.5). [read] https://pelgranepress.com/wp-content/uploads/2013/10/13th-Age-Archmage-Engine-v4.0.pdf
- Special abilities are outside the math: "be aware of the increased threat". To make a fight "unfair" on purpose: potent powers, nastier specials, weight of numbers, reinforcements, terrain. [read] https://www.13thagesrd.com/running-the-game/

**The stat table and its dials**
- "Monsters with different roles still use the same stats." Roles (archer, blocker, caster, leader, mook, spoiler, troop, wrecker) are labels for team-building, not number sets. [read] https://www.13thagesrd.com/monsters/monster-rules/
- Baseline stats for a normal monster, level: attack / strike damage / HP / AC / better defense / lesser defense. L0: +5 / 4 / 20 / 16 / 14 / 10. L1: +6 / 5 / 27 / 17 / 15 / 11. L2: +7 / 7 / 36 / 18 / 16 / 12. L3: +8 / 10 / 45 / 19 / 17 / 13. L4: +9 / 14 / 54 / 20 / 18 / 14. L5: +10 / 18 / 72 / 21 / 19 / 15. L6: +11 / 21 / 90 / 22 / 20 / 16. L7: +12 / 28 / 108 / 23 / 21 / 17. L8: +13 / 38 / 144 / 24 / 22 / 18. L9: +14 / 50 / 180 / 25 / 23 / 19. L10: +15 / 58 / 216 / 26 / 24 / 20. Up to L14: +19 / 135 / 576 / 30 / 28 / 24. [read] https://www.13thagesrd.com/monsters/monster-creation/
- Mooks, level: strike damage / damage to kill one. L1: 4 / 7. L2: 5 / 9. L3: 6 / 11. L4: 7 / 14. L5: 9 / 18. L10: 37 / 54. Same attack and defenses as a normal monster. Large: double HP and double strike damage (L1: 10 / 54). Huge: triple (L1: 15 / 81). [read] same page
- Dials: "Add or subtract 1" to accuracy; treat the listed defenses "as the top-end rather than the baseline"; make one of PD and MD better than the other; a big monster's damage need not be one strike (split it or use follow-up attacks); ad hoc changes of 1 or 2, and "if you raise a couple scores, drop a couple others". Adding a level to everything: +1 attack, +1 defenses, x1.25 damage, x1.25 HP. As single-stat trades, a level is worth +6 attack, or +6 AC, or double HP. "Avoid defensive powers that make it harder for the monsters to be killed unless there's an offense to unlock the defense." [read] same page
- Ratios in the table (my arithmetic): HP x8 and damage x11.6 from level 1 to 10; a level is x1.25 on both, which gives 1.56 for one level and 2.4 for two, close to the table's 1.5 and 2. At level 1 five mooks have 35 HP against a standard's 27 and deal 20 a round against 5; the rule text calls a mook's HP "one-fifth that of a regular monster", the table gives about a quarter.

**Low GM load**
- Monster attacks deal a fixed amount of damage and do not add the escalation die; "only exceptional monsters" (dragons) do. [read] https://www.13thagesrd.com/monsters/monster-rules/
- Extra effects trigger on the attack's natural roll: even or odd, 16+, or a named number; some attacks exist only as a "[Special trigger]". [read] same page. Example (chimera): natural 14 to 15 dazes, 16 to 17 adds ongoing damage, 18 to 20 triggers its fiery breath. [read] https://www.13thagesrd.com/monsters/
- A reviewer's name for it: the "scriptable monster", whose roll decides its nasty abilities so the GM makes no tactical call; in practice uneven, because close-quarters ("C") attacks became the bucket for exceptions. [checked, Rob Donoghue] https://walkingmind.evilhat.com/2013/09/04/monsters-of-13th-age
- "Nastier specials" are optional extra abilities printed under a monster to raise its threat or keep it interesting later in a campaign. [read] https://www.13thagesrd.com/monsters/monster-rules/ . They are not reflected in the battle-building numbers. [checked] https://walkingmind.evilhat.com/2013/09/04/monsters-of-13th-age
- Jonathan Tweet on fixed damage: he first refused it (Arduin, 1980), adopted it in his own 3e game, and brought it to 13th Age; rolling damage "feels like a really big deal but it's not", since the attack roll decides more of the damage than the damage roll does. An earlier version rolled multiples (1d6 x 10) and was too swingy, and swing in monster damage hurts the PCs, the favorites in most fights. Players still roll, because it is fun and gives the GM time to think. [checked] https://pelgranepress.com/2012/10/10/monster-damage-in-13th-age/
- Tweet on defenses: do not hide a penalty in attacks against PD or MD; if the sheet shows AC 21 and PD 16, the 5 points must be real. Heinsoo: "we avoided making pretend differences". [checked] https://pelgranepress.com/2017/04/01/13th-sage-on-monster-attacks

**Mooks**
- Damage is tracked "against the entire mob"; when it exceeds one mook's HP "another mook takes the remainder", so one blow can kill several, even some out of reach. Mooks move and attack individually, deal fixed damage (double on a natural 20), cannot have group abilities, and a large mob can be split into several mobs with their own initiative and pools. [read] https://www.13thagesrd.com/monsters/monster-rules/
- Tweet's lineage for the idea: early RPGs (Empire of the Petal Throne) had high-level characters rolling extra dice against low-level foes and taking out groups in one attack; "that's like 13th Age and the mooks". [checked] https://gmshoe.wordpress.com/2014/02/28/qa-jonathan-tweet-rob-heinsoo-13th-age/ . The name comes from Feng Shui. [checked] https://walkingmind.evilhat.com/2013/09/04/monsters-of-13th-age
- Reception against 4e minions: mooks answer the "wasted damage" complaint, since overkill spills over. [checked] https://www.enworld.org/threads/rpg-evolution-the-mook-the-bad-and-the-ugly.718973/ . A GM who ported them into 4e: there are never four mooks each clinging to 1 HP, and a few fall every round, which "feels narratively right"; area attacks are very strong against them, and a 13th Age regular answers that this is intended. [checked] https://www.enworld.org/threads/13th-age-stealing-the-mook-rules-from-13a.358398/ . A Pelgrane guest column: 4e minions felt good but could take a while to chew through on a bad night; with mooks the bookkeeping is the cost (he still tracks which mini has partial damage), spillover kills need narration (his table: no description, no extra kill), and he sometimes hides that they are mooks for tension. [checked] https://pelgranepress.com/2016/07/11/13th-age-mooks-destined-to-die/

**Conditions and big monsters**
- Many spells are limited by the target's current HP, so a large monster must be worn down before it can be shut down; fear works the other way (a PC below the monster's fear threshold in HP is dazed and loses the escalation die). [read for fear: https://www.13thagesrd.com/monsters/monster-rules/ ; checked for the purpose: https://walkingmind.evilhat.com/2013/09/04/monsters-of-13th-age and https://critical-hits.com/blog/2013/09/23/a-review-of-13th-age/ ]

### Gaps
- The core book's designer sidebars on monsters were not available (the SRD strips them).

---

## 6. 13th Age: escalation, four battles, recoveries

### Cited findings
- The die: from round 2 the PCs add +1 to attacks, rising by 1 a round to +6. Monsters do not. It does not advance if the PCs avoid the fight. [read] https://www.13thagesrd.com/combat-rules/
- Heinsoo: the math "expects that only the PCs (and dragons!) get the escalation die"; giving it to all monsters would remove "our game's dramatic curve, in which battles start out stacked against the heroes but tip in their favor". [checked] https://pelgranepress.com/2014/08/07/13th-sage-escalation-for-everyone
- Origin: a 4e campaign (Mike Fehlauer's Savage Tide), as an idea "for speedy play": everyone, monsters included, gains +1 to attacks each round, "like how the blind keeps increasing in poker". Paul Hughes suggested tracking it with a die. Tweet and Heinsoo each then gave it to PCs only in their own games. [checked] https://pelgranepress.com/index.php/13th-sage-secret-origins-of-the-escalation-die
- What it does to the numbers: baseline monster AC is 16 + level, against a PC attack of ability modifier + level. A fan guideline computes a level 1 PC at about 40% to hit at escalation 0 and 70% at 6, and three to four hits to drop a 27-HP monster. [checked, a fan site] https://13thage.org/index.php/classes/646-13th-age-class-design-guidelines
- The tactical effect: a reason to hold the big power for a later round against the cost of taking more attacks meanwhile, where in 4e players spent their best powers first and then "settled in". [checked] https://tyler.provick.ca/blog/what-i-like-about-13th-age/
- Attrition: a PC has 8 or 9 recoveries; one heals level-many recovery dice + Con modifier; each PC can rally once a battle; out of recoveries, healing is halved and the PC takes a stacking -1 to attacks and defenses. [read] https://www.13thagesrd.com/combat-rules/
- The day: a full heal-up comes after "approximately 4 regular battles, 3 hard battles, or 2 regular battles and 1 very hard battle", not after a night's sleep. Resting early, or fleeing (a party decision that always succeeds and carries the fallen out), costs a "campaign loss": the story goes on and the situation gets noticeably worse. [read] https://www.13thagesrd.com/combat-rules/
- Tweet on why: daily powers recharge "once you've battled through four real fights", so they can be balanced against per-battle powers, and a wizard cannot spend everything, sleep and repeat. [checked] https://gmshoe.wordpress.com/2014/02/28/qa-jonathan-tweet-rob-heinsoo-13th-age/
- Heinsoo's own later speed-ups for a table that wants two-round fights: monster HP down a third, damage up a third to a half. [checked] https://pelgranepress.com/2018/07/02/13th-sage-speeding-combat/

### Inferences
- 13th Age moved 4e's flat 60% to a ramp from about 40% to about 70%; monsters are tuned ahead of round-1 PCs and behind round-4 PCs. The same lever makes long fights end.
- The four-battle heal-up turns "encounters per day", an assumption 4e left to the table, into a rule; the battle table can then assume a known attrition.

---

## 7. 13th Age 2e (2024 to 2025): what changed

### Cited findings
- Official summary: "Build battles using battle level, not player character level"; the table was simplified; "the math for how battles are built for bigger adventuring groups" changed; some arcs have four battles (easier, recommended for new groups), others three, built as if the heroes were one level higher. "Days" are now "arcs". [read] https://pelgranepress.com/files/13th_Age/13A_2e/13A_Changes_from_1e.pdf
- Playtest text (Gamma, 2024; may differ from the final book). Battle level = party level at levels 1 to 4, +1 at 5 to 7, +2 at 8 to 10; +1 more for a three-battle arc. Party size is not linear: 1 to 3 heroes face the same number of monster-equivalents; 4 heroes face 5; 5 face 7; 6 face 9; 7 face 11 ("Increasing party size is not a linear increase in power"). [read, playtest] https://www.talesfromthefireside.com/wp-content/uploads/2e-13th-Age-Playtest-Gamma.pdf
- The playtest's Monster Equivalents table is cut to five rows, with warnings. Standard (or 5 mooks) / elite (or 7 to 8 mooks) / double-strength (or 10 mooks) / triple-strength (or 15 mooks): 2 levels lower 0.5 / 0.7 / 1 / 1.5; 1 lower 0.7 / 1 / 1.5 / 2; same level 1 / 1.5 / 2 / 3; 1 higher 1.5 / 2* / 3* / 4*; 2 higher 2* / 3** / 4** / 6**. One star: may pack "an uncomfortable amount of damage into a single swing". Two stars: "probably a mistake" to build a battle around it. [read, playtest] same PDF
- Mooks in the playtest: five per standard at every tier; about a quarter of a standard's HP and two-thirds of its damage; "pound for pound, mooks are the scariest monsters"; no more than about half a team's firepower from mooks and wreckers together; "Mook status is apparent: Most of the time the PCs should know that mooks are mooks"; the GM should "take pains to allow you all the kills you get" and narrate them; a multi-target spell can hit the same mob several times ("fireball loves that rule"). [read, playtest] same PDF
- Monsters: weaklings and elites move into the core; every stat block prints the expected baseline defenses and HP in small grey digits beside the real ones; the DIY section gains sample powers by role; the random dragon ability table, which "frequently" produced abilities that barely mattered, is replaced by chosen dragon-tricks; initiative bonuses go up in steps of 3 by tier. [read] https://pelgranepress.com/files/13th_Age/13A_2e/13A_Changes_from_1e.pdf
- Conditions: "Stunned creatures now have a chance of taking one action on their turn." Vulnerability now adds flat damage (double the attacker's level), hit or miss. [read] same PDF
- "Campaign loss" was renamed, because "no one wanted to flee"; the words suggested losing the campaign. Retreat now gives a "narrative loss", with examples. [read] same PDF
- Tweet objected to the 1e dretch as a 3rd-level mook, since demons should be scary the first time they appear; it is a standard monster in 2e. [checked] https://robheinsoo.blogspot.com/2025
- 1e adventures' battle tables should be adjusted to the new guidelines (GMG p. 42). [read] https://pelgranepress.com/2025/11/24/13th-age-faq-2/ . A review confirms the final book has the adjusted values in a table and a worked example from level 1 to 10. [checked] http://rlyehreviews.blogspot.com/2026/08/tactics-tales-part-ii.html

### Gaps
- The final 2e Building Battles table was not read; the playtest numbers above may have changed.

---

## 8. What the 13th Age designers said about fixing 4e

### Cited findings
- Speed. The escalation mechanic was first tried inside a 4e campaign, to speed play. [checked] https://pelgranepress.com/index.php/13th-sage-secret-origins-of-the-escalation-die . A long EN World discussion reads it the same way, as the answer to 4e's "combat lasted too long". [checked, posters' reading] https://www.enworld.org/goto/post?id=9100743
- Tweet: "4E was really helpful to me because it shook up the implicit assumptions of 3E and helped me see how simple rules could be"; 13th Age classes are less tightly balanced than 4e's, and the heal-up rule does the balancing between daily and at-will classes. [checked] https://gmshoe.wordpress.com/2014/02/28/qa-jonathan-tweet-rob-heinsoo-13th-age/
- Reviewers' reading of the monsters: "the clean refinement of monsters we've seen in 4th Edition", easy to run with little preparation, with debilitating effects gated by HP so big monsters cannot be stun-locked early; and the game as a whole "addresses many of 4th edition's complaints", combat speed first. [checked] https://critical-hits.com/blog/2013/09/23/a-review-of-13th-age/
- No interview was found in which Heinsoo or Tweet lists 4e's monster or encounter faults and their fixes one by one. The evidence is the design itself plus the remarks above.

### Inferences (how each 4e failure maps to a 13th Age choice)
- Grind: the escalation die, and HP and damage that both grow by x1.25 a level (4e: +8 HP against +1 damage).
- Roles with number shifts that needed re-tuning: one stat line for all roles, and "add or subtract 1".
- Minions (wasted damage, auto-damage, minion detection): a pooled damage track; area attacks strong by design; in 2e, mooks are openly mooks.
- Solos: no solo rank; big monsters are double or triple strength with their damage split across attacks, conditions gated by HP, and in 2e stun softened for everyone.
- Out-of-band levels: the ratio table stops at 4 levels up (1e) and 2 levels up with warnings (2e playtest).
- An unstated adventuring day: the heal-up after about four battles.

---

## Questions this raises for 2d12

(Questions only. They follow from the findings above; none is a proposal.)

1. 4e's stated target was a standard monster dying to about four hits and living about five rounds, and its formula drifted off that target. What is 2d12's target in hits and in rounds for a Standard, and since levels add options and not numbers, does anything make it drift?
2. 4e's level band worked only within about 3 levels because each level moved the hit chance 5% on both sides. With a nearly flat Modifier and Defenses of 11 to 16, what does a monster's rank or level change, if not accuracy: Health, damage, number of Actions?
3. With three outcome tiers, what share of a PC's Health should a monster's Tier 2 and Tier 3 take, measured in Rally Points (a quarter of Health each)? In MM3 a level 1 monster's hit was a bit more than one surge.
4. How many Rally Points should a Standard encounter cost a party? 13th Age fixed its day at about four battles; 4e left it to the table, and fans measured about a fifth of resources per fight.
5. Escalation: 13th Age builds monsters slightly ahead of the PCs because the PCs' accuracy climbs. In 2d12 Escalation unlocks Actions, not accuracy. Does anything end a fight that is already decided?
6. Minions with ticks (1 / 2 / 3 by tier, most with 2, no overflow) sit between 4e's minion and 13th Age's mook. Which complaints remain: damage with no roll (areas, auras, zones), a Tier 3 "wasted" on the last tick, players knowing which enemy is a Minion? Is a Minion's status public?
7. What is a Minion's real exchange rate? 4e's designer said, late, that four minions were worth less than one standard; 13th Age says five mooks are, pound for pound, the scariest thing on the table. Which is true of a squad of three acting in one slot?
8. Is there a rank between Minion and Standard (the Grunt), and what is its job? 4e players kept inventing one.
9. Boss: every lasting 4e fix protected actions, not Health. With 4 AP and a Reaction per PC, how many actions does a Boss take per round against a party of four, at what points in the round, and what do stun-like conditions do to it?
10. Bloodied and Strained give a fight two progress markers per monster. Does a Boss change at them?
11. Do roles change ratings (4e), or only team jobs with one stat line (13th Age)? 4e's first role numbers were set by symmetry and had to be undone; its designers ended by wanting roles enforced through effects that work even on a miss. What does a Soldier do at Tier 1?
12. Does the Combat Value budget price special Actions and conditions, or only the ratings? 13th Age says openly that it does not.
13. Is party size linear in the budget? 13th Age 2e decided it is not (4 heroes face 5 monster-equivalents, 6 face 9).
14. Fixed monster damage and natural-roll triggers cut the GM's load in 13th Age. With damage by tier and a 2d12 roll, is there an equivalent of "the roll decides the special"?

---

## What did not open

- web.archive.org: refused every request. So not read at the source: Wizards' Design & Development columns (Noonan on monster lifespan, the MM3 stat block and solo articles, Mearls's columns), the original "Excerpts: Minions" page (read as a reproduction), and the official DMG update PDF of July 2010.
- forums.giantitp.com (403), forum.rpg.net (403), dnd4.fandom.com (403), dnd-wiki.org (403), rpgpub.com (403, a 13th Age 2e AMA), a GitHub issue page (403).
- scribd.com: returned an empty shell (the DMG pages "Building Encounters" and "Creating Monsters").
- dungeonsmaster.com (server error): "Two-Hit Minions" and its MM3 review. blmablog.com (no response): "Minions in 4e". asmor.com (server error): the 4e encounter planner with the DMG templates.
- Pelgrane's 13th Age 2E preview PDF (404).
- Audio, not transcribed: Mastering Dungeons episode 191 (Heinsoo on 4e); the 2018 Pelgrane "13th Age Monster Design Seminar"; the D&D podcast with Mearls's berserk rule.
- Not found at all: Heinsoo's 2018 text interview on monster design (High Level Games); any designer statement of 4e's intended hit rate or surges per encounter; the final 13th Age 2e Gamemaster's Guide table.
