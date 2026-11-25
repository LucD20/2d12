# Monster building in other tactical games: ranks, numbers, bosses, fodder

**Date:** 2026-11-25. **Asked by Lucas,** opening the Bestiary's rebuild: "see monster building from PF2e, 4e, Draw Steel on their own rules. See other tactical systems that have good monster building, balance reputation."

**What was read, and how far to trust it.** Four independent researchers, one pass each, not re-checked by a second reader. **This file is Claude's summary of their reports** (about 28,000 words, every source and link):

- `raw/2026-11-25-monsters-pf2e.md` (the 2019 Building Creatures chapter read from Paizo's own free PDF, the Remaster's pages on Archives of Nethys; reception from EN World; **paizo.com refused**, so every Paizo designer's statement is a lead);
- `raw/2026-11-25-monsters-4e-13th-age.md` (Blog of Holding's card, Greg Bilsland's and Chris Sims's own posts, Stephen Schubert's minion excerpt, the 13th Age SRD and Pelgrane's 2e change list; the 2e battle table from a playtest packet, not the final book);
- `raw/2026-11-25-monsters-draw-steel.md` (the Monsters and Heroes books' text from the Steel Compendium's repositories, all 416 stat blocks tabulated; **the designers' words are second-hand**, through the fan podcast Goblin Points; reception thin);
- `raw/2026-11-25-monsters-other-tactical.md` (ICON 1.5, Nimble's GM guide, the Daggerheart SRD, Lancer's sitreps, A5E read; Lancer's templates, Fabula Ultima, Savage Worlds from memory).

Marks: [read] rules text on a page opened, [checked] an opinion on a page opened, [lead] a search summary or a page that refused, [memory] no page opened, [computed] a researcher's arithmetic on read numbers. Reddit and RPG.net were not read.

**Other games' rules and opinions, never 2d12's. Nothing here is decided.** What it means for 2d12 is in `book/bestiary-design.md`.

---

## 1. Two ways to make an enemy stronger or weaker

| | Level difference | Rank on a flat roll |
|---|---|---|
| Games | Pathfinder 2e, D&D 4e, 13th Age | Draw Steel, Lancer, ICON, Daggerheart, Nimble, Savage Worlds |
| A stronger enemy is | harder to hit, hits and crits more, has more hit points and damage | more hit points, more damage, more turns, more targets |
| A boss is | one creature 2 to 4 levels up | a rank with its own turn rule |
| Fodder is | a creature 3 to 4 levels down | a rank with its own death rule |
| The complaint | the PCs' abilities stop working | "a bag of hit points" when the rank adds only Health |

- **Pathfinder 2e:** attack and AC rise about 1.5 a level and a result 10 over the DC is a critical, so two levels is about double; the price list runs from 10 XP (level −4, "low-threat lackey") to 160 (level +4, "extreme-threat solo boss") [read]. Against a level +3 boss a martial hits on about a 13 and the boss crits on a 14 [read + memory].
- **4e:** +1 to hit and defenses a level, 5% on both sides; the budget was meant to hold from 4 levels below to 7 above and held within about 3 [checked; the limit is the community's].
- **Draw Steel:** nothing misses, so a level is Stamina (+10 for a platoon monster) and damage (+1 × the tier's factor); level is only a cap in encounter building, monsters at most 2 above the heroes, solos 1: out of range they "deal devastating damage before a hero gets to do anything" [read].
- **ICON 1.5** is the flattest: four stat blocks for the whole bestiary, the same in every chapter [read]. **Daggerheart** keeps an adversary's hit point marks nearly constant (about 4 at tier 1, 6 at tier 4) and raises the damage thresholds instead (5 to 30) [read, computed].

## 2. The standard monster against a PC

"One monster a PC" is the unit almost everywhere, and it never means equal numbers.

| Game | One standard a PC is | It dies to | Its hit takes |
|---|---|---|---|
| 4e | the standard fight, done several times a day | "four successful attacks" by intent (Player's Strategy Guide; Schubert: "four to six basic attacks"), 6 to 7 at high level because hit points grew 8 a level against the PCs' 4 to 6 | at level 1 about 30 to 40% of a PC, more than one healing surge [computed, PC side memory] |
| 13th Age | the fair fight at levels 1 to 4 | three to four hits [checked, a fan site] | fixed damage, no roll |
| Pathfinder 2e | the Extreme fight, "an even match"; Moderate is half of it | about 2 same-level hits at level 1, 4 to 5 at level 5, 7 at level 10 [computed, PC side memory] | a High Strike about 30% of a fighter at level 1, 19% at level 10 |
| Draw Steel | the standard fight (a platoon monster's Encounter Value is exactly one hero's strength: 4 + 2 a level) | about 3 hero signature turns (Stamina 20 to 40 at level 1) [computed] | 19% / 26% / 33% of a hero by tier for a platoon harrier, 22 / 33 / 44% for a brute [computed] |
| Daggerheart | 2 Battle Points of 3 a PC + 2 | about 4 marks | 1 to 3 marks by threshold |

- **Draw Steel prints its formulas** [read]: Stamina = (10 × level + a role modifier of +10 to +30) × the organization; damage = (4 + level + a damage modifier of 0 to 2) × 0.6 / 1.1 / 1.4 by tier, halved for hordes and minions; Encounter Value = (2 × level + 4) × the organization. With the middle role, Stamina ÷ EV is 5 at every level: **the budget prices Stamina, and damage rides on the same level** [computed].
- **4e after 2010 fits on a card** [read]: level 0 is AC 14, +5 to hit, 8 damage; +1 each a level; 24 + 8 hit points a level; role shifts of ±2 AC, ±25% damage, a few hit points a level.
- **13th Age has one stat line a level for every role**; a level is +1 attack and defenses and × 1.25 hit points and damage; roles are labels for building a team; special abilities are openly outside the battle math ("be aware of the increased threat") [read].
- **Pathfinder 2e reads each statistic off a table by rating.** The ratings aren't uniform (hit points have only High / Moderate / Low; Terrible exists only for Perception and saves); High hit points are about 1.25 × Moderate; AC spans 6 points; an Extreme is paid for with a Low "somewhere", in words only: "There's no perfect system" [read]. Critics call the result "colorless generic monsters" [checked].

## 3. Ranks as multiples

**The pattern in every game read: a rank multiplies staying power by its budget share and raises threat through actions or targets, not through damage a hit** [judgment of two researchers, from read text].

| Rank | 4e | 13th Age | Draw Steel | Lancer | ICON 1.5 | Daggerheart |
|---|---|---|---|---|---|---|
| Fodder | minion ¼: 1 hit point | mook ⅕ (⅓ at levels 1 and 2): shared pool | minion ⅛: squad pool | Grunt ¼: 1 hit point | mob: two "hits" | a party-size group = 1 point |
| Weak | (players invented one) | weakling ½ | horde ½ | | | |
| Standard | 1 | 1 | platoon 1 | 1 | 1 | 2 points |
| Above | elite 2: × 2 hit points, two attacks | elite 1.5, large 2, huge 3 | elite 2: × 2 Stamina, +1 damage, two targets | Elite 2: two turns | Elite 2: double hit points, two turns | Bruiser 4, Leader 3 |
| Alone | solo 5: × 4 hit points | none | solo 6: × 5 Stamina, two turns | Ultra 4 | Legend: the whole budget | Solo 5 |

- **4e's first role numbers were set by symmetry** (a brute's damage paid for with an accuracy penalty) and were undone in 2010. Bilsland: "monsters don't need an accuracy bonus unless their role calls for it, and they don't need an accuracy penalty at all"; roles should be enforced by effects that work even on a miss (a soldier marks, a controller controls), kept mild [checked]. In 2009 elites and solos lost their defense bonuses [checked].
- **Draw Steel's roles are a flat Stamina offset and +0 or +1 damage**; "Roles are descriptive, and most don't follow special rules"; all one role "typically leads to dull, grindy combat" [read].

## 4. Fodder

| | How it dies | Wasted damage | Damage with no roll | Its attack |
|---|---|---|---|---|
| 4e minion | 1 hit point; a miss never damages it | yes | kills it: the top complaint | flat, low |
| 13th Age mook | a shared pool, overflow to any mook | none | strong against them, by design | fixed; five mooks out-damage a standard |
| Draw Steel minion | a squad pool; overflow to the nearest; an area kills only who is in it | none | bounded | one roll a squad; one signature a target, a second and third minion add only a free strike |
| ICON mob | two hits, any damage removes one; immune to statuses | little | removes one hit | |
| Daggerheart minion | any damage; each further threshold of damage kills another | none | | a group attack |
| Lancer Grunt | 1 hit point | yes | | **full damage**: the main complaint [checked] |
| Nimble minion | any damage | yes | | rolled together; **outside the budget** [read] |
| Savage Worlds Extra | Shaken, then out | | | full |

- **Schubert on 4e's minion (2008):** it started from actions ("a typical monster might take four to six basic attacks to knock out", so four to six minions should cost the same actions); a few hit points were tried and dropped because a weak hit forced tracking [read]. **Chris Sims (2010):** minions are "spice"; by late playtesting the budget share was known to overstate them; they should not be the main challenge [checked].
- **Draw Steel capped a squad's focus** after a 2024 draft in which a squad on one hero "felt really bad for players. A single squad's attacks could almost take out a hero by itself"; minions went from eight to four a purchase in 2025 [checked, second-hand]. Its rule that minions are no secret: "shouldn't be kept from the players" [read].
- **13th Age 2e:** "Mook status is apparent"; "pound for pound, mooks are the scariest monsters"; no more than about half a team's firepower from mooks and wreckers [read, playtest].

## 5. The enemy that fights alone

| Game | Turns | Health | Against being shut down |
|---|---|---|---|
| 4e (2008) | one, with a +5 save | × 5, later × 4 with lower defenses | nothing: "dazing a solo is roughly five times more effective" (Mike Shea) |
| 4e Monster Vault (2010) | an instinctive action at a second initiative count | | Action Recovery ends dazed, stunned, dominated at the end of its turn |
| 13th Age | one; damage split over several attacks | double or triple | spells gated by the target's current hit points |
| Pathfinder 2e | one (a creature of level +2 to +4) | by level | Incapacitation: its save counts one degree better |
| Draw Steel | two turns a round, never consecutive; three villain actions (once each, one a round, at the end of another creature's turn: opener, crowd control, "ult") | × 5 | End Effect: at the end of its turn it takes unreducible damage to end one save-ends effect; a paid extra main action that works "even if they are dazed" |
| ICON 1.5 Legend | one turn a PC (defeated PCs counted) | 50 a PC, in phases | clears one status or mark a round |
| Nimble Legendary | acts after each hero's turn | by party level; about 15 hero turns to Last Stand, then 2 to 4 more | Bloodied adds an ability; Last Stand is a second pool |
| Giffyglyph (5e) | players − 1 paragon actions | × players | sheds all effects at 66% and 33% |
| The Angry GM's paragon (5e) | one turn a hit point pool | stacked pools | when a pool empties, conditions end and it loses a turn |
| Lancer Ultra | one or two extra activations | +3 structure | |
| Daggerheart Solo | 2 to 4 spotlights, paid in Fear | | |

- **"Every durable solo fix protects actions, not hit points"** [the 4e researcher's inference]. Draw Steel cut its solo to one main action a turn in early 2025: "They were simply too powerful" [checked, second-hand].
- **The bosses tied to the number of PCs get the good verdicts** (ICON, Nimble, Giffyglyph, the Angry GM); a fixed 2 or 3 turns, or turns bought with a resource, disappoint (Lancer's lone Ultra: "Spoiler: It won't"; Daggerheart's solos "are more like 4e elites"; A5E's own rules say a legendary monster "will probably be easy for 5 or more") [checked / read; the ranking is one researcher's reading].
- Draw Steel's solo is built for four to six heroes and "flees or surrenders when reduced to one-quarter or less of their Stamina and after using all their villain actions" [read].

## 6. The monsters' side rising with the fight

- **13th Age:** only the PCs get the escalation die; the math "expects" it, so battles "start out stacked against the heroes but tip in their favor" (Heinsoo) [checked]. A level 1 PC goes from about 40% to hit to about 70% [checked, a fan site]. It was first tried in a 4e campaign to speed play [checked].
- **Draw Steel's Malice** was added late because the heroes' power "is on a rising curve" and the monsters' was "a flat line": "the monsters being too weak at the tail end of combats". The Director gains the heroes' average Victories at the start, then heroes + the round number each round, and spends it on costed abilities [read; the reason checked, second-hand]. Not spending it is the Director's brake [checked].
- **A change at half health** (4e's bloodied powers, Nimble's Bloodied and Last Stand, ICON's phases) is the other way a monster rises, by damage and not by the clock.

## 7. How the encounter is counted

- **Two families** [the fourth researcher's reading]. **Bodies:** Lancer (about 1.5 enemy turns a PC by community practice), ICON (players + 1 bodies, an Elite 2, a Legend all of it), Giffyglyph, Savage Worlds ("two Extras per hero plus an enemy Wild Card"). **A scalar:** XP, CR, Encounter Value, Nimble's levels. A scalar needs a second rule against one big monster or a swarm: 5e 2014's multiplier, A5E's cap of 1.5 × the average level on any one monster, Draw Steel's caps (eight creatures a hero, a level limit), Nimble's "1-4 monsters per hero".
- **Party size isn't linear in 13th Age 2e:** four heroes face 5 monster-equivalents, five face 7, six face 9 [read, playtest].
- **Budgets that lied:** 5e 2014's DMG table doesn't match its own monsters [checked]; Shadow of the Weird Wizard's publisher raised the Difficulty of almost every enemy after release [read]; Pathfinder 2e's has the best reputation and its named weak spots are solo bosses, levels 1 to 4 and odd party sizes [checked].
- **What the budget doesn't see is said in the rules** by 13th Age (special abilities), ICON and A5E, and by Draw Steel's "It's Not Science" [read].

## 8. What was changed after play, every time

- **4e:** solos −20% hit points and −2 defenses (2009); monster damage +30 to 40% (2010; Bilsland: the test was "whether monsters were threatening PCs"); the commonest house rule left was fewer hit points [checked]. Mearls later: let a monster go berserk, trading hit points for damage [checked].
- **13th Age:** Heinsoo's own speed-up for a table that wants two-round fights: hit points down a third, damage up a third to a half [checked].
- **Draw Steel:** solos cut to one action a turn, minions in fours, the Victories' share of the budget recalculated because "the heroes are a bit too powerful when they have a lot of victories" [checked, second-hand].
- **Every retune on record went toward fewer hit points, more damage, and fewer or cheaper turns for the big monster.**

---

## Sources

The raw reports hold every link. The pages leaned on most: Paizo's Building Creatures PDF (https://downloads.paizo.com/PZOCUP024E_PathfinderGameMasteryGuide_MonsterHazardCreation_PF2E.pdf); Archives of Nethys, Encounter Design (https://2e.aonprd.com/Rules.aspx?ID=2716); Tom Dunn on XP in D&D and Pathfinder (https://tomedunn.github.io/the-finished-book/theory/xp-dnd-vs-pathfinder); Blog of Holding, "MM3 on a business card" (https://blogofholding.com/?p=512) and 4e hit points (http://blogofholding.com/?p=782); Greg Bilsland, "More on Monsters" (https://gregbilsland.wordpress.com/2010/06/16/more-on-monsters-2/); Chris Sims, "Minions Are Spice" (https://critical-hits.com/blog/2010/07/22/minions-are-spice); Schubert's minion excerpt (https://dndzero-reboot.blogspot.com/2008/05/excerpts-minions.html); the 13th Age SRD (https://www.13thagesrd.com/running-the-game/ and /monsters/monster-rules/); Pelgrane's 2e changes (https://pelgranepress.com/files/13th_Age/13A_2e/13A_Changes_from_1e.pdf); Draw Steel's Monster Basics (https://steelcompendium.io/v2/Read/bestiary/monster-basics/); Goblin Points 2407 and 2505 (https://goblinpoints.com/2407, https://goblinpoints.com/2505); The Angry GM on bosses (https://theangrygm.com/return-of-the-son-of-the-dd-boss-fight-now-in-5e/); Sly Flourish, "Solo Shakers" (https://slyflourish.com/solo_shakers.html).

**Not opened:** paizo.com (forums and blog), MCDM's Patreon, Backerkit and video transcripts, lancer.wiki.gg and Lancer's GM chapter, daggerheart.com/srd, the final 13th Age 2e Gamemaster's Guide table, ICON 2.0's foes, Wizards' own columns on Monster Manual 3, Reddit, RPG.net.
