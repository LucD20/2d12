# Pathfinder 2e: building monsters, building encounters, and how tables received them

Date: 2026-11-25. Raw research notes (other games' rules and other people's opinions; nothing here is a 2d12 rule).

**How far to trust it.** Every statement carries one of four marks, with its URL beside it:

- **[read]** = rules text on a page I opened. The 2019 Gamemastery Guide chapter (Logan Bonner and Mark Seifter) was read page by page as Paizo's own free PDF; the Remaster pages (GM Core, Monster Core, NPC Core) were read on Archives of Nethys through an automated reader, and every table row quoted from it was cross-checked against the PDF (the numbers are identical in both editions).
- **[checked]** = an opinion on a page I opened (mostly EN World threads; one math essay).
- **[lead]** = seen only in a search summary, or on a page that refused to open (all of paizo.com's forums and blog returned 403). Not verified; a pointer for someone who can open it.
- **[memory]** = from my own knowledge, no page opened. This includes every PC-side number (a PC's attack bonus, AC, Hit Points), so every "PC versus creature" ratio below is a creature number I read combined with a PC number I remember.

Source keys: **GMG-PDF** = https://downloads.paizo.com/PZOCUP024E_PathfinderGameMasteryGuide_MonsterHazardCreation_PF2E.pdf ; **AoN-BC** = https://2e.aonprd.com/Rules.aspx?ID=2874 (GM Core pg. 112, Building Creatures) ; **AoN-Enc** = https://2e.aonprd.com/Rules.aspx?ID=2716 and https://2e.aonprd.com/Rules.aspx?ID=2715 (GM Core pg. 75, Encounter Design).

---

## 1. How PF2e builds a creature

### Takeaway
A creature is built top-down: a concept, a level, a "road map" of which statistics are High or Low, then each number is read off a per-level table by its rating; abilities come last and carry the feel. The text repeatedly tells the designer to trade (an Extreme somewhere is paid for with Low or Terrible elsewhere) and to keep few, visible abilities.

### Cited findings

**The procedure, in order.**
- Four steps: (1) Concept and Roadmap, (2) Build the Stat Block (level; traits and size; ability modifiers; Perception; languages; skills; items; AC; saves; HP; immunities, weaknesses, resistances; Speed; Strikes and damage; spells), (3) Design Abilities, (4) Reality Check. [read] GMG-PDF p.4. The Remaster keeps the same four steps and renames the last "Review Holistically". [read] AoN-BC
- The opening statement of method: "Creatures aren't built the same way PCs are", their statistics being "based on benchmark final numbers rather than combining each individual modifier together". [read] GMG-PDF p.3
- Concept questions asked before any number: combatant, social creature or ally; alone or with allies; which kind of PC should be best or worst against it; how the encounter should feel. Complexity is tied to head count: five of a creature at once need fast turns; a creature that faces the party alone "can have more abilities". "Cut complexity as much as you can while retaining your desired theme." [read] GMG-PDF p.3-4
- On feel versus numbers: "much of this feel will come from your choice of the creature's special abilities or spells, rather than the creature's raw numbers." [read] GMG-PDF p.4

**The rating scale.**
- Extreme: "world class", can challenge almost any character; "Most creatures have no extreme statistics or one extreme statistic". High: "Extremely capable, but not world class"; nearly every creature has at least one. Moderate: anything unremarkable; "Use this one liberally!" Low: "The creature is actively bad at this", chosen on purpose as a weak point; most creatures should have at least one. Terrible: awful but "still isn't game-breakingly bad". [read] GMG-PDF p.4
- The default fighting profile: "Most combat-focused creatures have high AC and either high attack and high damage, or merely moderate attack but extreme damage." [read] GMG-PDF p.4
- Which statistic has which ratings [read] GMG-PDF p.6-15: ability modifiers Extreme / High / Moderate / Low (Terrible is a flat floor, down to -5, not scaled by level); Perception and saving throws have all five; skills and AC and attack bonus and Strike damage have four (no Terrible); **Hit Points have only High / Moderate / Low (no Extreme)**; spell DC has only Extreme / High / Moderate ("There is no low value": a creature that bad at spells should not have them); area damage has two columns (Unlimited Use, Limited Use); resistances and weaknesses have a Maximum and a Minimum.
- Extremes grow with level: one Extreme "becomes typical around level 11", two at 15+, three or four at 20+, because high-level PCs have more tools. A warning against stacking them on one roll: extreme attack and extreme damage together apply "both extreme statistics to each attack". [read] GMG-PDF p.5

**Trading ratings ("Push and Pull").**
- A creature "should be balanced overall"; an extreme AC is paid for with lower saves or low HP; a road map with four Highs and nothing Low gets "another look". "There's no perfect system for making these decisions." The reason given is play, not fairness: strengths and weaknesses "change the PCs' strategies". [read] GMG-PDF p.4
- AC: High and Moderate are one point apart and most creatures use them; "High is close to what a PC fighter would have"; Extreme is for champion-like or monk-like defenses; Low fits spellcasters. [read] GMG-PDF p.8-9
- "Almost no creature has great defenses in all areas; making such a creature will often result in frustrating fights." Extreme AC means dropping HP one category, or a smaller cut plus a cut elsewhere. [read] GMG-PDF p.9
- HP: Moderate "unless its theme strongly suggests" otherwise; casters Low; brutes High, paid for with lower AC, weaker saves or few tactical options. [read] GMG-PDF p.9
- Regeneration is sized in hits: it "should heal back one hit or a hit and a half" a round (read from the High Strike damage column), and total HP may drop by twice that. A weakness to something common adds HP (up to four times the weakness value for a tough creature); broad resistances mean fewer HP. Zombie versus skeleton is the worked contrast (more HP and a weakness versus normal HP and a resistance). [read] GMG-PDF p.9-11
- Saves: quickest is one High, one Moderate, one Low; almost never more than one Extreme. [read] GMG-PDF p.9
- Attack and damage trade against each other: High attack with High damage for "fighter types"; Moderate attack with Extreme damage for a barbarian-like creature; casters get poor attacks "in exchange for extreme spell DCs". [read] GMG-PDF p.11

**Strike damage, limited-use damage, area damage.**
- The damage table is per single Strike. High for a combat creature's melee; Moderate for agile or ranged Strikes; Extreme for a creature "meant to be highly damaging" (usually with only Moderate attack) or for attacks usable "only a limited number of times". A damage expression should be about half dice, half flat modifier. [read] GMG-PDF p.11-12
- Area damage numbers assume a 2-action activity; a single action "should do much less". An ability that also applies a condition uses the damage of "two or more levels lower". Limited Use means once, or (a breath weapon) once or twice and never on consecutive turns. [read] GMG-PDF p.15
- Reaction damage is "usually equivalent to a moderate Strike"; constant damage (an aura) is "just below low Strike damage"; automatic effects use Moderate Strike or unlimited area damage. [read] GMG-PDF p.16

**How many abilities, and which kind.**
- "Narrow your selections down to the smallest and most compelling set that makes sense", because of "how short the lifespan of a typical combat creature is". Diversity over count: one ability to get into position, one to focus a target, one defensive. [read] GMG-PDF p.14
- "Avoid abilities that do nothing but change the creature's math" ("invisible abilities"): a silent accuracy bonus versus arrows visibly set on fire, same goal, one memorable. [read] GMG-PDF p.15
- "Two-action activities pretty much define the creature's turn." Three-action activities are used "sparingly, as they become useless if the creature is slowed or stunned", and never as a balance point (strong because it rarely works "is a recipe for frustration"). [read] GMG-PDF p.15
- Bosses "need to have solid options they can take with 1 or 2 actions" because they will be the target of every debuff. The final check asks: "Does it still work decently if it gets slowed?" [read] GMG-PDF p.15-16
- Reactions: not for every creature; skip them in big groups to keep play fast; give one to a solo so it stays dangerous "amid an onslaught of attacks". Avoid "gotcha" reactions that punish reasonable choices; "The best reactions should be telegraphed". [read] GMG-PDF p.16
- Defensive abilities are riskier than offensive ones: pick one, since stacking them "can make for a frustrating fight"; a mode switch (better defense, weaker offense) is the recommended form. [read] GMG-PDF p.16
- Level-gating of abilities: flying with ranged attacks around level 7, at-will invisibility around level 6 to 8 (when PCs have answers). [read] GMG-PDF p.5
- Improvising: a sidebar tells the GM to read values off the table during play and note them as they come up ("Per +8, AC 18, HP 25"). [read] GMG-PDF p.8

**The road maps** (a statistic not listed is Moderate). [read] GMG-PDF p.6; the same seven are in GM Core, [read] AoN-BC
- Brute: low Perception; high or extreme Str; moderate or low AC; high Fortitude, low Reflex or Will or both; high HP; high attack and high damage, or moderate attack and extreme damage.
- Magical Striker: high attack and high damage; moderate to high spell DCs; a few spells.
- Skill Paragon: high or extreme best skill; high Reflex or Will, low Fortitude; a special ability that uses the skill in combat.
- Skirmisher: high Dex; low Fortitude, high Reflex; higher Speed.
- Sniper: high Perception and Dex; low Fortitude, high Reflex; moderate to low HP; ranged Strikes high / high, or moderate attack with extreme damage.
- Soldier: high Str; high to extreme AC; high Fortitude; high attack and high damage; Attack of Opportunity or other tactical abilities.
- Spellcaster: low Fortitude, high Will; low HP; low attack, moderate or low damage; high or extreme spell DCs.
- A second set, "Class Roadmaps", imitates each PC class (for example Fighter: high AC, low Will, high attack and high damage). A full PC-style build is allowed for recurring NPCs and "will likely have lower statistics in some areas" than the creature rules give. [read] GMG-PDF p.19-20

**Sample rows** (Extreme / High / Moderate / Low, plus Terrible where it exists). [read] GMG-PDF p.9-15, identical on AoN-BC

| Level | AC | HP (High / Mod / Low) | Attack | Strike damage (average) | Saves (E/H/M/L/T) | Spell DC (E/H/M) | Area: unlimited / limited |
|---|---|---|---|---|---|---|---|
| 1 | 19 / 16 / 15 / 13 | 26-24 / 21-19 / 16-14 | +11 / +9 / +7 / +5 | 8 / 6 / 5 / 4 | +11 / +10 / +7 / +4 / +2 | 20 / 17 / 14 | 5 / 7 |
| 5 | 25 / 22 / 21 / 19 | 97-91 / 78-72 / 59-53 | +17 / +15 / +13 / +11 | 20 / 16 / 13 / 11 | +17 / +15 / +12 / +9 / +7 | 26 / 22 / 19 | 12 / 21 |
| 10 | 33 / 30 / 29 / 27 | 223-215 / 179-171 / 135-127 | +25 / +23 / +21 / +17 | 33 / 26 / 22 / 17 | +24 / +22 / +19 / +16 / +14 | 33 / 29 / 26 | 20 / 39 |
| 15 | 40 / 37 / 36 / 34 | 348-340 / 279-271 / 210-202 | +32 / +30 / +28 / +24 | 45 / 36 / 30 / 24 | +32 / +29 / +26 / +23 / +20 | 40 / 36 / 33 | 27 / 56 |

### Inferences (my arithmetic on the rows above)
- The spread of a rating is small and constant on defenses, wide on Hit Points and damage: AC Extreme to Low is 6 points at every level (High to Moderate only 1); High HP is about 1.25 times Moderate and Low about 0.75; Extreme damage is about 1.5 times Moderate, High about 1.2, Low about 0.8; a limited-use area hit is about 1.75 to 2 times the at-will area value and roughly equals an Extreme Strike, but on everyone in the area.
- Per level, AC and attack both rise about 1.5 (Moderate AC 15 at level 1, 29 at level 10), HP by about 20 to 25, damage by about 2 a Strike. So a creature's durability in its own hits rises with level: Moderate HP divided by High Strike damage is about 3.3 at level 1, 4.7 at level 5, 6.7 at level 10, 7.6 at level 15.
- Against a same-level PC [memory for the PC side]: a non-fighter martial has about +7 / +14 / +21 / +28 to hit at levels 1 / 5 / 10 / 15, so it hits High AC on a 9, 8, 9, 9 (60 to 65%) and Moderate AC one better; a fighter is +2 on top (70 to 75%). A two-handed martial deals roughly 10 / 17 / 25 a hit at levels 1 / 5 / 10, so a Moderate-HP creature of its level takes about 2 / 4 to 5 / 7 hits before criticals. A fighter has roughly 20 / 68 / 138 HP at those levels, so a High Strike is about 30% / 24% / 19% of it, and a Moderate creature has about 1.0 / 1.1 / 1.3 times a fighter's HP.

### Gaps
- No Paizo text I opened states a target number of rounds, a target hit rate, or how the tables were derived (see section 5).

---

## 2. How PF2e builds an encounter

### Takeaway
One budget, five named threat levels, each defined in words by what the party risks and spends; a creature's price depends only on its level minus the party's (from -4 to +4), doubling every two levels. The text never states that the party is at full Hit Points and has no adventuring-day budget; tables treat full Hit Points as the unwritten assumption.

### Cited findings
- Budget for four PCs, with the Character Adjustment per PC more or fewer: Trivial 40 or less (10 or less); Low 60 (20); Moderate 80 (20); Severe 120 (30); Extreme 160 (40). [read] AoN-Enc
- Creature price by level relative to the party, with the role the table names: -4 = 10 (low-threat lackey); -3 = 15 (low- or moderate-threat lackey); -2 = 20 (any lackey or standard creature); -1 = 30 (any standard creature); same level = 40 (standard creature or low-threat boss); +1 = 60 (low- or moderate-threat boss); +2 = 80 (moderate- or severe-threat boss); +3 = 120 (severe- or extreme-threat boss); +4 = 160 (extreme-threat solo boss). Creatures outside -4 to +4 are not priced ("except in the most unusual circumstances"). [read] AoN-Enc
- **The words of each threat level** [read] AoN-Enc:
  - Trivial: "so easy that the characters have essentially no chance of losing"; rarely costs resources; a warm-up or a reminder of how capable the party is.
  - Low: "present a veneer of difficulty and typically use some of the party's resources"; a wipe would take very poor tactics.
  - Moderate: "a serious challenge to the characters, though unlikely to overpower them completely"; needs sound tactics and resource management to come out "ready to continue on and face a harder challenge without resting".
  - Severe: "the hardest encounters most groups of characters have a good chance to defeat"; for key moments; a character could die. From memory, not re-read: the same paragraph says bad luck, poor tactics "or a lack of resources due to prior encounters" can turn it, which would be the text's one admission that fights are not independent. [memory]
  - Extreme: "likely to be an even match for the characters"; too challenging for most uses; for a fully rested party going all-out or a campaign's finale.
- Party size: spend the adjustment on more creatures or hazards, not on a tougher single enemy, and keep the number of enemies near the number of PCs; XP awarded stays that of a group of four. [read] AoN-Enc
- Ready-made groups: Boss and Lackeys (120: one +2, four -4); Boss and Lieutenant (120: one +2, one same level); Elite Enemies (120: three same level); Lieutenant and Lackeys (80: one same level, four -4); Mated Pair (80: two same level); Troop (80: one same level, two -2); Mook Squad (60: six -4). [read] AoN-Enc
- Hazards are bought from the same budget. [read] AoN-Enc
- **Full Hit Points:** the Encounter Design text does not say PCs start at full HP; the only hints are the Moderate wording ("without resting") and Extreme's "fully rested". No encounters-per-day figure and no "adventuring day" appear there. [read] AoN-Enc
- Players confirm the silence. Retreater: "I don't recall ever having seen it spelled out in the rulebook"; kenada treats full HP as the assumption behind the guidelines; CapnZapp says a half-HP party shifts an encounter "from moderate to severe"; payn says the game "was designed to get out of resource attrition on the adventuring day". [checked] https://www.enworld.org/threads/pathfinder-2e-is-it-raw-or-rai-to-always-take-10-minutes-and-heal-between-encounters.682675/ (Sept 2021)
- One table's count: Celtavian's low-level groups managed 3 to 4 encounters a day at levels 1 to 4 before in-fight healing ran out. [checked] https://www.enworld.org/goto/post?id=8005657 (June 2020)
- Treat Wounds (the Medicine action: 10 minutes, a patient then immune for an hour unless a feat removes that) is what makes between-fight healing nearly free. [memory]; the one-hour immunity is confirmed by posters on the same page [checked] https://www.enworld.org/goto/post?id=8005657

### Inferences
- The threat words promise two different things: Trivial to Moderate are defined by resources spent, Severe and Extreme by the chance of death or defeat. Nothing in them covers a party that arrives hurt.

### Gaps
- Whether GM Core says anything on rest and pacing elsewhere (Running the Game) was not read.

---

## 3. What the math rests on

### Takeaway
Everything scales with level on both sides, and the +/-10 critical rule turns each point of difference into both more hits and more criticals. That is why a level difference is so steep (two levels is about double) and why one budget table can serve every level; it is also where the reception problems in section 4 come from.

### Cited findings
- Proficiency adds the character's level to every trained roll and DC; four degrees of success; beating the DC by 10 is a critical success, missing by 10 a critical failure; a critical Strike doubles damage. [memory]
- The creature tables show the result: AC and attack both rise about 1.5 a level. [read] GMG-PDF p.9, 11
- XP price doubles every two levels (10 at -4 up to 160 at +4), and the Gamemastery Guide's rule of thumb is that "two monsters of a certain level are roughly as challenging as a single monster 2 levels higher" (quoted in the essay). [checked] https://tomedunn.github.io/the-finished-book/theory/xp-dnd-vs-pathfinder
- Tom Dunn's essay rebuilds the budget from Moderate creature statistics: HP times damage times the hit-chance factors doubles every two levels from level 10 up, a little faster at levels 5 to 10, and much faster at level 4 and below (up to about three times the expected rate). Critical chance is about 15% against an equal-level foe and shifts 5% a level, which he counts as one more point of attack and AC per level of difference. He concludes that PF2e needs no encounter multiplier only because of that critical scaling and because the book steers toward about one monster per PC. [checked] same URL
- Worked from the rows in section 1 [read] with PC numbers from [memory]: a level 8 creature (party level 5, +3) has High AC 27 against a martial's +14, so the martial hits on a 13 (40%) and crits only on a 20; its High attack +20 against a plate fighter's AC of about 24 hits on a 4 and crits on a 14 (35% of rolls). Its High save +19 against a level 5 caster's DC 21 fails only on a 1; its Moderate save fails on 4 or less; its Low save on 7 or less. A level 3 creature's High Strike averages 12, so its critical (24) exceeds a level 1 fighter's Hit Points (about 20).
- **Elite and Weak** (Monster Core pg. 6-7): +2 or -2 to AC, attacks, DCs, saves, Perception and skills; +2 or -2 damage (4 for limited-use abilities); HP by starting level (Elite +10 / +15 / +20 / +30 at level 1 or lower / 2-4 / 5-19 / 20+; Weak -10 / -15 / -20 / -30 at 1-2 / 3-5 / 6-20 / 21+). The creature counts as one level higher or lower, two levels when Elite is applied at level -1 or 0 or Weak at level 1. [read] https://2e.aonprd.com/Rules.aspx?ID=3264 and https://2e.aonprd.com/Rules.aspx?ID=3265
- **Swarms** (the swarm trait's usual package): low HP, immune to precision, weak to area and splash damage, resistant to physical damage. [read] GMG-PDF p.18
- **Troops** (NPC Core pg. 7 and 231): one stat block for "multiple creatures working in tandem", shown as four 10-foot segments (16 miniatures). Two thresholds, usually at 2/3 and 1/3 of maximum HP: crossing one removes a segment. Normal AC and HP. Immune to non-damaging single-target effects, except that one which would take a member out of the fight removes a whole segment (the troop drops to its next threshold). Area effects hit segments (5 or more targets = one segment, 10 or more = two, 20 or more = all). No Strikes: an automatic attack in an emanation stands in for them. At 0 HP it disperses. The stated use: when individuals are "too weak to threaten the party but a group is dangerous". [read] https://2e.aonprd.com/Rules.aspx?ID=3363 and https://2e.aonprd.com/MonsterAbilities.aspx?ID=86
- Troops first appeared in Bestiary 3 (2021), before the Remaster. [memory] A Paizo thread asks whether the NPC Core version made them more complicated. [lead] https://paizo.com/threads/rzs5zzoc
- **Incapacitation** (Player Core pg. 457): an ability that can take a character out of the fight is "harder to use on a more powerful character": a creature of more than twice the spell's rank (or of higher level than the item or creature using it) treats its save as one degree better, or the attacker's roll as one degree worse. [read] https://2e.aonprd.com/Traits.aspx?ID=93
- The rule cuts both ways: it also protects PCs from a lower-level monster's "blockbuster power" (Justice and Rule). [checked] https://www.enworld.org/goto/post?id=8720475

### Inferences
- The lackey (-4) and the solo boss (+4) are the same statistics seen from different party levels; the game has no separate minion or solo stat block, only level difference, Elite / Weak, troops and swarms.

---

## 4. Reception

### Takeaway
The budget's reputation for accuracy is real and widely repeated, and the complaints are specific: single enemies two to four levels up (the party misses, spells fail, the boss crits), levels 1 to 4, parties of other sizes, combined encounters. Lower-level enemies divide tables: a welcome show of power for some, a time-waster for others. Building by table is praised as intended and fast in play, and criticized as thin on how to make a creature interesting.

### Cited findings

**Higher-level single enemies.**
- Nilbog (Oct 2019), using level +2 or +3 solos: "the monsters are critting easier and the group struggles to hit them." CapnZapp in reply: "Already L+2 is borderline", and he advises adding minions no higher than level -2. dave2008: "I don't think PF2e does solos very well." [checked] https://www.enworld.org/threads/creating-interesting-solo-monster-encounters.667807
- payn (Jan 2022) on Severe and Extreme fights: the enemy "gets to enjoy a full tool kit while you toss origami figures to papercut it to death". Staffan: "resourceless skill actions are generally doomed to fail against bosses." Thomas Shey answers that a Severe encounter is meant to be severe, and that Incapacitation is "an okay price to pay" for not having 3e's save-or-lose spells. The-Magic-Sword defends small per-action odds because they add up across a party. [checked] https://www.enworld.org/goto/post?id=8509033
- payn (2021): Severe encounters are boring because the enemy "can lay you to waste" while "you can deliver papercuts". Retreater: the +/-10 critical rule "seems to work against the party more often". The-Magic-Sword's group enjoys the "meaningful progression" of a monster going from hard to easy over levels. dave2008: the guidelines "never provide you with the explicit guidance to make a dangerous solo battle". [checked] https://www.enworld.org/goto/post?id=8394715
- Casters against a boss: Staffan, "direct damage is nearly useless in fights against single strong targets", and a caster "should absolutely never use a spell with an attack roll against a higher-level target"; The-Magic-Sword counters that a spell's success-on-a-save half effect lands more often than a martial hits. payn: it "sucks watching the enemy gleefully crit the PCs". [checked] https://www.enworld.org/goto/post?id=8720475 (Aug 2022)
- kenada's tactical reading: a third Strike is "basically fishing for crits"; buffs on top of debuffs move hit and crit rates by 15 to 30%; a party that charges a boss saves it the actions to close. Thomas Shey: a +/-2 is "lost in the noise" in 3e and PF1 and matters in PF2. [checked] https://www.enworld.org/goto/post?id=8113702
- Leads (Paizo forum, refused): a thread titled "It might as well be official: Party Level+2 monsters are Severe encounters at low level" https://paizo.com/threads/rzs43azj ; "Each encounter is its own creature", whose summary says a solo level +3 is balanced but not much fun and that many prefer a level +1 or +2 boss with minions or hazards https://paizo.com/threads/rzs43wrf ; a post that the guidelines are "most spot-on at mid-levels" https://paizo.com/threads/rzs43u6r ; a reported remark by James Jacobs that Paizo's adventures should be "a lot more sparse with severe or extreme encounters" (thread not identified). [lead]

**Low levels and the published adventures.**
- Retreater's Age of Ashes group: three party wipes in six sessions; a hazard killed a character before initiative. kenada and !DWolf blame the adventure's design more than the system. [checked] https://www.enworld.org/threads/another-deadly-session-and-its-getting-old.675197/ (Oct 2020)
- CapnZapp: "19 out of 20 fights in official PF2 APs are hard or harder"; Retreater: "every fight was a harrowing life or death struggle"; combining two encounters "is a quick way to a TPK". [checked] https://www.enworld.org/goto/post?id=8129745 (Nov 2020)
- dave2008: a PF2 Severe encounter is much tougher than a D&D 5e "deadly" one. Campbell: "There is no real way to balance encounters irrespective of player skill", the gap between good and poor play being large. [checked] https://www.enworld.org/goto/post?id=7821615 (Sept 2019)
- Tom Dunn's numbers match the complaint: below level 5 a level of difference is worth far more than the budget charges. [checked] https://tomedunn.github.io/the-finished-book/theory/xp-dnd-vs-pathfinder

**Lower-level enemies.**
- Lackofname asks why fights with weak monsters exist: "These aren't even a speed bump, they're going to last a round." billd91 answers that easy fights teach, and that Paizo wants players to feel their characters have grown; payn, that some build atmosphere. [checked] https://www.enworld.org/goto/post?id=8129745
- The-Magic-Sword reports a near wipe of seven PCs by many cheap monsters: area damage scales with the number of targets, so a big party facing several bought with its bigger budget is in danger. [checked] https://www.enworld.org/goto/post?id=8394715
- Leads: posters who say mobs of lower-level enemies are there to remind players how strong they are; others that level -2 or -3 groups become a real threat with buffs, that "random mooks" still crit high-AC characters at low levels, and that hordes are a burden to run. [lead] https://paizo.com/threads/rzs43i4e , https://paizo.com/threads/rzs4399c , https://paizo.com/threads/rzs436vy

**"It just works", and where it doesn't.**
- Justice and Rule: "the game is built to be accurate", so it asks for sharper play than looser challenge-rating systems. payn: it is "wound a little too tight". Campbell: knowing a monster's level can feel "deflating". [checked] https://www.enworld.org/goto/post?id=8720475
- Party size: JmanTheDM calls a fifth PC with unchanged encounters a big lever on difficulty; transmission89 recommends the Weak adjustment when Moderate feels too hard. [checked] https://www.enworld.org/goto/post?id=8237651

**Building by table versus building like a PC.**
- Paizo's announcement of the 2019 preview (quoted by Morrus): the system "uses a top down system with benchmarks". [checked] https://www.enworld.org/goto/post?id=7831021
- Critics there: dave2008 wanted "mathematical guidance, not just verbal"; CapnZapp, the document "lets me create colorless generic monsters"; kenada, the freedom "comes at the cost of essentially having to wear a game designer hat"; BryonD, "The math is preordained." Defender: Campbell, monsters are meant to vary more than PCs (high HP against a weakness, and so on). [checked] same URL (Oct 2019)
- CapnZapp on a side effect: caster monsters "don't feel right", their Strikes outclass their spells. [checked] https://www.enworld.org/goto/post?id=8237651

### Gaps
- Reddit was not opened; the largest body of PF2e opinion is unread.
- No opened page gave a first-hand comparison of build time with PF1 / 3.5.

---

## 5. What the designers said about how the numbers were set

### Takeaway
I found the method stated (benchmarks, top-down) and several anchors to PC numbers inside the rules text, but no opened page where a Paizo designer gives the order of design, a target hit rate or a target fight length. This is the report's main gap.

### Cited findings
- The chapter is credited to Logan Bonner and Mark Seifter. [read] GMG-PDF p.1
- Anchors to PCs written into it: High AC "is close to what a PC fighter would have", Extreme AC is a champion's or a monk's; High skills are "roughly on par with a specialized PC" of that level; regeneration and healing are sized in "hits". [read] GMG-PDF p.7-9
- Creatures carry less treasure than PCs, so the Strike damage table "abstracts the sources of damage" instead of adding weapon, runes and specialization. [read] GMG-PDF p.12
- Secondhand: Campbell, from designer interviews and streams he watched, says the designers "use these benchmarks, work up a test design, and work it through the paces making adjustments as they go". [checked] https://www.enworld.org/goto/post?id=7831021
- Leads: Mark Seifter's 2018 playtest blog "Building Monsters" (kept iconic and story abilities, cut redundant ones, added one that fits the creature) https://paizo.com/community/blog/v5748dyo5lks6 ; a forum post attributed to Seifter that the math can be tuned to any hit rate and what matters is that characters feel competent (which thread was not identified; candidates https://paizo.com/threads/rzs432bf and https://paizo.com/threads/rzs433hi); a Roll For Combat AMA and live monster-building stream with Seifter (2021); a thread relaying Michael Sayre's posts on casters and balance https://paizo.com/threads/rzs43vmk . [lead]
- From memory, unverified: the 2018 playtest's monster numbers were judged too high and were lowered for the final game; Sayre's 2023 posts argued casters are balanced on breadth and on targeting a weak save. [memory]

### Gaps
- Seifter's Arcane Mark streams, his Paizo forum posts and the Battlezoo material were not reached.

---

## Questions this raises for 2d12 (questions only)

- PF2e gets "lackey" and "boss" from level difference, which 2d12 does not have. Which of the things a level difference does there (hit chance, critical chance, Hit Points, damage) does each rank change, and by how much, when the roll stays nearly flat?
- PF2e's boss is hard to hit and resists spells, and that is the most repeated complaint. Does an Elite or a Boss get its worth from Defenses, or from Health, Actions and Reactions?
- With Tier 3 at DC + 7 on 2d12, how fast does the Tier 3 chance move per point of Defense, on each side, compared with PF2e's 5% a point?
- PF2e's creature takes about 2 same-level hits at level 1 and about 7 at level 10. How many hits should a Standard take, and should that be one number?
- PF2e gives Hit Points no Extreme column and AC a 6-point spread. Which ratings does each 2d12 statistic need, and which should have no Extreme or no Terrible?
- PF2e says how to pay for an Extreme only in words ("no perfect system"). Is the trade written as a rule in the roles, or left to judgment?
- PF2e defines each threat level in words and is silent about the party's Hit Points on arrival. What does each 2d12 difficulty promise in Rally Points spent, and at what Health is a fight assumed to start?
- A troop's thresholds (2/3 and 1/3) remove a segment; a Minion's ticks remove a member. What does a squad lose as it shrinks, and what does an area effect do to it?
- Incapacitation protects bosses by level. What protects a Boss from being shut down when there is no level to compare?
- PF2e sizes limited-use and area damage against the Strike (about 1.5 to 2 times). What is the ratio between a monster's at-will Action and its limited one, and how does Escalation enter it?
- PF2e budgets two actions for a creature's defining activity and tells bosses to keep 1- and 2-action options in case they are slowed. What is the equivalent with 4 Action Points?

## What did not open

- **paizo.com** (403 on every try): the blog "Building Monsters" (two URLs), the threads rzs43azj and rzs43wrf, and every other Paizo forum thread named above. All are [lead].
- **Paizo's PDF** opened only as a file (read page by page, pages 1 to 20; the hazard pages after 20 were not read).
- **Archives of Nethys** opened; the reader paraphrased instead of returning full text, so its quotations were kept short and its tables checked against the PDF. Traits.aspx?ID=576 was a wrong guess (Dinosaur); the Incapacitation text is ID=93.
- **majorspoilers.com** (interview with Mark Seifter, 2022): redirected to a Substack front page; not read.
- **Reddit and its mirrors, RPG.net**: not tried. The Roll For Combat AMA with Seifter is known only by its title.
- **EN World** opened, but several links landed mid-thread, so some opening posts were not seen (Second Attempt Post Mortem, Regarding Competence, How is PF2E prep and GMing?).
