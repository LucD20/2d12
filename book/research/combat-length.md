# How many rounds a fight should last in a tactical game

**Date:** 2026-11-26. **Asked by Lucas,** after playtest 8: "after the playtests we will see but I am thinking of increasing the amount of rounds to around 4-5. Make a research about it, in tactical ttrpgs mainly, as I know in more open ended systems people like super fast combat."

**What was read, and how far to trust it.** One pass, one researcher. Pages opened are marked [checked] (the quote was found on the page, through a summarizing reader) or [read]; a search tool's summary of a page nobody opened is a [lead]; what Claude knows without a page is [memory]; Claude's own count is [mine]. Reddit, RPG.net and the Lancer core book (a pirated PDF host refused the reader, and nothing else held its text) could not be opened. **No designer of 4e, 5e, Pathfinder 2e, Draw Steel, Lancer or ICON was found stating a round target in print** (the same finding as `encounter-difficulty.md`); the targets below are analysts' readings and measured tables, except 13th Age's, which its designers did state.

**Other games' rules and opinions, and Claude's arithmetic on current playtest values, never 2d12's rules. Nothing here is decided.**

---

## 1. What our research already held on fight length

- **`encounter-difficulty.md`, section 5:** three rounds is the commonest stated target (5e's CR arithmetic, Draw Steel's timed objectives, Neal Zupancic); Draw Steel's tables report 2 to 4 rounds; 4e aimed at a monster "lifespan of five rounds", ran long and was fixed twice (hit points halved in an R&D house rule in 2008, damage raised in 2010); in Tom Dunn's example the likeliest end is the start of round 3; a longer fight feels harder. Zupancic's ladder of labels is there (flash, quick, standard, extended, long, slog).
- **`enemies-at-the-table.md`:** a fight that is decided and goes on (4e's grind) is the most repeated complaint about a system's monsters; Mike Shea: about three rounds expected, a boss in phases "might run six or nine".
- **`escalation-direction.md`:** the frozen SIM's normal fight was about 3.0 rounds, the old book's 3.4 to 3.5, playtest 7's 3.8; how often each Escalation gate opens at those lengths; 4e's encounter powers front-load a fight and "that's when the grinding starts".
- **`nova-burst.md`:** a resource built in the fight makes round 1 slow; Mearls on 5e's "about 20 rounds of combat between long rests".
- **`bestiary-design.md` (the record, not research):** decision 3, "decided in round 2, over in round 3"; Lucas refused the first draft ("decided in round 3, over in round 4", a Standard of 54 Health): "A standard has 54 HP is too much".

What was missing, and what this file adds: the designers' and analysts' reasons for a target, measured minutes, the two failure modes in players' words, the fixed-round wargames, and what a change from 2 to 3 rounds toward 4 to 5 does.

---

## 2. Takeaways

1. **"About three rounds" is the default most tables expect, and it is an expectation more than a law.** 5e's designers "have frequently mentioned three rounds as their target combat length", and published hit points are about 3 times damage (Paul Hughes, Blog of Holding) [checked]. Zupancic calls 3 rounds "the 'standard' combat", the one players measure others against [checked]. Mike Shea: "many DMs and players expect the answer of roughly 'three'", but "I don't think it's useful to worry about how many rounds combat takes" [checked].
2. **Four rounds feels harder, five nears a slog, in a one-action game.** Zupancic: 4 is "the 'extended' combat" that doesn't feel long but feels harder because enemies get more attacks in; 5 is "the 'long' combat", near a slog, often because something went wrong or enemies have too many hit points or too much AC; 6 or more is "the 'slog' combat, or the 'special' combat" (a planned epic) [checked].
3. **The designers who stated a length wanted shorter, not longer.** 13th Age's escalation die (0 in round 1, then +1 a round to a maximum of +6) "keeps combat moving, turning what might otherwise be a two-hour fight into a 30-minute fight" (Pelgrane's FAQ) [checked]. Rob Heinsoo on his own table: "Two rounds is fine. Three rounds is OK-ish. Four, not so much"; his fix was to cut monster hit points by a third and raise their damage [checked]. 4e's monster fixes went the same way (`encounter-difficulty.md`).
4. **But 4e's damage rise was about threat, not only length.** Greg Bilsland on Monster Manual 3: "PCs were, in many cases, killing monsters so fast that the monsters were not challenging the characters", so monster damage went up "about 30-40%" [checked]. A short fight's problem is that the enemy never gets to matter; a long fight's is that it goes on after it is decided.
5. **Tables measure 3 to 5 rounds in 5e and Pathfinder 2e, about 4 in Draw Steel.** EN World 5e polls: "3-5 rounds is pretty standard", "about a 5 round average", boss fights 5 to 6, "10 rounds seems like a grind" [checked, anecdotes]. Pathfinder 2e forum estimates 3 to 5 [lead]. Draw Steel: "typically 4 rounds give or take one" (SteveC, EN World, 2025) [checked]; a fan guide says 2 to 3 rounds [lead]. No designer figure found for either.
6. **Minutes per round are what the table feels, and they vary by a factor of ten.** Measured 5e on Roll20 (MerricB): 4 fights, 15 rounds, 62 minutes, about 4.1 minutes a round and 15½ a fight [checked]. Two PCs on a stream: 3.5 minutes a turn, 7 a round (GMMichael) [checked]. A level 15 fight of 6 PCs and 13 NPCs: 5 rounds in 180 minutes, 36 a round [checked]. Draw Steel at level 1: "about 5 minutes between rounds" (SteveC) [checked]; a fan guide's "45 minutes up to over 1 [hour]" a round [lead, high levels]. Rounds times minutes is the felt length: three 20-minute rounds feel longer than five 5-minute rounds.
7. **Longer fights are less swingy.** Tom Dunn: "increasing the encounter length decreases the effective variability", which scales as 1 / √(turns) [checked]. A fight of twice as many turns has about 70% of the spread. The same is said of the first turn: in a 3-round fight a 6.5% better chance to act first is worth about 2.2% damage a round, because it touches one round of three (EN World arithmetic) [lead]; a burst class gains more from going first [lead].
8. **Games that fix the round count do it to make a clock, and they build up power over it.** Kill Team: four Turning Points, games "under an hour" [checked, a review]. Marvel Crisis Protocol: ends at the end of round 6, at 16 points, or a wipe; Power tokens build each round to pay for the big attacks; a character knocked out flips to a second wind [checked, reviews]. Lancer's sitreps put a round limit on an objective (fan sitreps: hold a zone at the end of round 6; a Behemoth that dies at the end of round 8) [checked]; the core sitreps' own limits (6 rounds for several, from memory) [memory, not verified]. Reinforcements are Lancer's normal tool, "not too many at a time" [checked].
9. **What keeps a longer fight from a slog is something that changes each round.** Draw Steel's Director gains Malice each round "equal to the number of living heroes" plus "the number of the round", so a longer fight gets more dangerous; heroes gain their resource each turn (the Fury 1d3 ferocity a turn) [checked: a fan blog and the Steel Compendium]. 13th Age's die favours the PCs more each round and so ends the fight itself. Marvel's Power tokens and second winds; Lancer's reinforcements and objectives; Shea's bosses in phases.
10. **The tail is cut by morale or by the GM, not by the dice.** Pathfinder 2e's GM Core, Morale: most creatures "back down from a battle they're obviously losing", which normally "means foes fleeing at a certain point, potentially ending the encounter" [checked]; a forum GM: "the boring tag-end of fights where the winner is already obvious seldom [has] to be played out" [lead]. The "grind" is defined on EN World as the point where the party has effectively "won" but has not yet beaten the monsters (Stalker0's guide) [lead].
11. **The open games want speed for a different reason.** Lucas's premise holds where it was checked: 13th Age's designers cut length on purpose, and Heinsoo's reason is that "the game sings when we're roleplaying and drags if we have too many rounds of combat" [checked]. The tactical games that run longer (Draw Steel, Lancer, the skirmish wargames) make combat the main event and give it a clock or a rising resource.

### The games side by side

| Game | Length in rounds | How much one turn holds | What paces the fight | The known complaint |
|---|---|---|---|---|
| **D&D 5e** | 3, the designers' stated aim through the monster math [checked, Blog of Holding]; 3 to 5 at tables [checked, anecdotes] | 1 action, a bonus action, a move; extra attacks with level | Hit points ≈ 3 × damage; nothing rises | Rocket tag at low level and with save-or-die at high level; slog at high level [lead] |
| **D&D 4e** | A monster lifespan of 5 rounds [checked, `encounter-difficulty.md`]; ran longer | Standard, move, minor; encounter powers | Encounter powers front-load it; nothing rises | The grind: "won" but not over [lead]; solos "long and frustrating" (Bilsland) [checked]; fixed by more damage, fewer hit points |
| **13th Age** | Short on purpose: "a 30-minute fight"; the die tops at +6, so round 7 [checked] | 1 standard action, a move, a quick action | The escalation die: +1 a round to the PCs (and dragons), from round 2 | Heinsoo's own: "Four, not so much" [checked] |
| **Pathfinder 2e** | No designer number found; 3 to 5 in forums [lead] | 3 actions and a reaction | Morale (GM Core) ends fights early [checked] | Slow turns; healing between fights takes table time (`resources-and-recovery.md`) |
| **Draw Steel** | No designer number found; "typically 4 rounds give or take one" [checked]; 2 to 4 in our research | A move, a maneuver, a main action; many triggered actions | Malice rises with the round number; heroic resource each turn; Victories carried in | Rounds can be long at higher levels [lead] |
| **Lancer** | Sitreps with round limits (6 for several, from memory) [memory]; fan sitreps 6 and 8 [checked] | 2 quick actions or 1 full, a move, overcharge, reactions | The sitrep's objective and its round limit; reinforcements | Not searched |
| **Kill Team** | 4 Turning Points, fixed [checked] | Each operative 2 or more actions, alternating | Objectives scored each Turning Point | Not searched |
| **Marvel Crisis Protocol** | 6 rounds or 16 points [checked] | 2 actions a character | Power tokens built each round; a second wind | Not searched |
| **Gloomhaven** | No fixed count; the hand of cards is the clock (exhaustion) [memory, not verified] | Two cards a round | Lost cards and rests shrink the hand | Not searched |

Not found or not searched: ICON, Fabula Ultima, Trespasser, Strike!, Beacon, Warcry (section 7).

---

## 3. The two failure modes

**Too short (rocket tag, the alpha strike).**
- TV Tropes' "Rocket Tag Gameplay": both sides fragile and able to remove each other quickly, so the side that acts first wins; it names old D&D's uncapped spells, where "whichever side gained initiative would probably win" [lead, the search's summary of the page].
- Zupancic's 1-round "flash" fight: players may barely act and set-up features go to waste [checked, his sense, not his words].
- Mearls on 5e: "A party that unloads with their best powers simply breaks the system" (`nova-burst.md`) [checked].
- Bilsland: monsters dying "so fast that the monsters were not challenging the characters" [checked].
- Lucas, playtest 8: "It felt almost brainless, doing attack after attack most of the time"; "Demoralize didnt have a chance of shining"; "It also felt easy until the ogre did his turn" (`book/playtest-8.md`).

**Too long (the slog, the grind, padded sumo).**
- Zupancic: 5 rounds "the 'long' combat", 6 or more "the 'slog' combat" unless it is a planned special fight [checked].
- The grind: "the party has effectively 'won', but have not yet beaten the monsters" [lead]; "10 rounds seems like a grind" (happyhermit, EN World) [checked].
- Bilsland on a solo that is hard to hit: "That makes for a long and frustrating fight against a solo" [checked].
- TV Tropes' "Padded Sumo Gameplay": so much health or defense on both sides that damage only wears them down slowly [lead].
- Heinsoo: a game that "drags if we have too many rounds of combat" [checked].

**What the two share:** both are about decisions. In the short fight the decisions that need time (control, set-up, defense) never pay; in the long fight the decisions run out before the hit points do. A poster in the timing thread: the feeling and engagement in combat matter more to whether it feels like "a slog" than its actual length [lead].

---

## 4. What a designer must handle when fights go from 2 or 3 rounds to 4 or 5

1. **Enemy durability or party damage must change** (hit points ≈ rounds × the party's damage a round). Every class card and every monster is priced against it.
2. **Enemy damage a turn must fall if the fight's cost is to stay the same,** since the enemies get more turns. Small hits then meet flat reductions (Guard, Shield-like Reactions) and can vanish.
3. **Or the fight's cost rises,** and the day (fights between rests) shrinks with it.
4. **Once-a-fight abilities become a smaller share of a PC's turns,** so the at-will turn carries more of the fight and needs more choice in it; once-a-round abilities get more uses.
5. **Effects of one turn are worth less a round, and effects that pay over several turns are worth more:** a condition until the end of the target's next turn is a third of a 3-round fight and a fifth of a 5-round one; a debuff that pays over several hits finally has hits to pay over.
6. **The first side to act matters less** (its lead is one round in more), and the fight swings less (Dunn's 1 / √N).
7. **Anything that rises by the round reaches higher.** A ladder tuned for 3 rounds tops out sooner in a 5-round fight.
8. **Healing, defense and rescue get time to matter,** and so does the enemy's second and third turn: their Reactions, set-ups and specials are seen.
9. **Real time grows faster than the round count** if turns are long; the game must keep turns short or the rounds few.
10. **The fight needs a change of state each round or two** (reinforcements, objectives, phases, a rising enemy resource, terrain that changes), or rounds 4 and 5 repeat rounds 2 and 3.
11. **The decided tail needs a cut** (morale, surrender, a GM's "it is over"), or the extra rounds are the grind.

---

## 5. How it applies to 2d12 (Claude's reading; arithmetic on current playtest values, not a proposal)

### The facts from the record and playtest 8

- A 2d12 turn holds 4 AP and up to 3 Strikes (with At-will Banes of −1 and −2 on the second and third); the Reaction Point; unspent AP become Guard 2 each; Escalation 1 + Momentum at the start, +1 each round after the first, 6 at most; Encounter Actions once a fight, Round Actions once a round; EoT effects (Chapter 2, `rules-src/02-turns.md`).
- Decision 3: the normal fight "decided in round 2, over in round 3", because one 2d12 turn is about two turns of a game whose target is three rounds. The fight-identity count gives an average end in round 2.8 (decision 13). Decision 13: a Standard has 36 Health (2 rounds × the benchmark turn of 17 to 18). Decision 14: about 8 damage to Health a Standard's turn, for a normal fight of about 1½ Rally Points a PC (51 damage; one Rally Point of each pregen removes 34 together).
- Playtest 8: over at the end of round 2; 14 turns in all (8 of the party, 6 of the enemies); the party dealt 18.4 a turn (about 73 a round); 130 enemy Health; cost 1.3 to 1.4 Rally Points a PC; no Down; three of five enemies never had a second turn; no Rally Point spent, no AP kept as Guard; the Basic Attack was the best damage an AP outside Smite (6.3 against 2.8 for the other class cards); the two Smites dealt 40% of the damage.
- Earlier, with the old numbers: playtest 6 took 4 rounds (220 enemy Health), playtest 7 3.8, the old book 3.4 to 3.5 (`escalation-direction.md`, `playtest-8.md`). **2d12 has already played 4-round fights; what Lucas disliked then was NPCs with too much Health.**
- **Minutes at the table: unknown.** The playtest 8 record gives turns and rounds but no clock time.

### The count for longer fights [mine]

The record's own count, `book/ruler/fight-identity.mjs` (4 PCs each dealing the benchmark turn to one enemy at a time, 4 enemies of Health H, zipper order, no map and no cards), run for more Health (40,000 fights a row). "Damage for 1½" is the damage to Health a Standard's turn that keeps the normal fight at 51 (1½ Rally Points a PC); "cost at 8" is the cost if a Standard keeps dealing 8.

| Health a Standard | Ends in round (17 / 18 a PC turn) | Enemy turns | Damage a turn for 1½ | Cost at 8 a turn (Rally Points a PC) |
|---:|---:|---:|---:|---:|
| **36 (today)** | 2.9 / 2.8 | 6.4 to 6.7 | 7.6 to 8.0 | 1.5 to 1.6 |
| 45 | 3.4 / 3.3 | 7.6 to 8.0 | 6.4 to 6.7 | 1.8 to 1.9 |
| 54 (the refused draft) | 3.9 / 3.8 | 8.9 to 9.3 | 5.5 to 5.8 | 2.1 to 2.2 |
| 63 | 4.5 / 4.3 | 10.1 to 10.6 | 4.8 to 5.0 | 2.4 to 2.5 |
| 72 | 5.0 / 4.7 | 11.3 to 11.9 | 4.3 to 4.5 | 2.7 to 2.8 |

Six Standards of 36 instead of four (CV well above normal): over in round 3.9 to 4.1, 12.5 to 13.1 enemy turns, 3.9 to 4.1 a turn for 1½, or about 3 Rally Points a PC at 8 a turn.

What it says:
- **"Over in round 4 to 5" by Health alone is a Standard of about 54 to 72, 1½ to 2 times a PC's Health** (32 used), against Lucas's refusal of 54. Simple identity: Health a PC = rounds the fight is decided in × 17 to 18 (3 rounds: 51 to 54; 4 rounds: 68 to 72).
- **Keeping the cost at 1½ then means 4½ to 6 damage a Standard's turn,** about two thirds to half of today's 8. Guard 2 an AP, Shield of Faith 3 and Judge 2 would take a larger share of each hit: the worry already on watch ("whether hits of 3 or 4 disappear", `bestiary-design.md`).
- **Keeping 8 a turn makes the normal fight cost 2.1 to 2.8 Rally Points a PC, today's hard band.** With C8's day of five fights against 6 or 7 Rally Points, that spends the day in three fights.
- **The party's real minutes would roughly double:** playtest 8 had 14 turns; a fight over in round 4.5 has about 18 PC turns and 10 to 12 enemy turns, 28 to 30 turns.

### What else 4 or 5 rounds would touch

- **Escalation's pace.** At Momentum 0 a PC is at Escalation R in round R: today's fights reach 2, sometimes 3; a fight over in round 4 to 5 reaches 4 to 5, and 6 (the Apex's gate, from level 4) in round 6, or round 5 at Momentum 1. F2 in `core-rework.md` (Escalation 4 to 5 in fights of 3 to 3½ rounds) was written for longer fights than today's; level 2's Escalation 3 ability would be seen in nearly every fight. The ladder would need its rungs checked against the new length, and Momentum's +1 would matter less as a share.
- **Encounter Actions** would be one turn in four or five instead of one in two or three. Today two Smites dealt 40% of a fight; at 4½ rounds they would be nearer a quarter, and the at-will turn (where "attack after attack" lives) would be most of the fight unless it gains choices.
- **Round Actions** would be used 4 or 5 times instead of 2 or 3: a Round card that is worse than Basic Attacks for damage an AP (2.8 against 6.3 in playtest 8) would show its riders more often, which is the case for them; or its weakness more often.
- **EoT conditions and riders that pay over several hits** (Vulnerable 1 from Demoralize, Immobilized from Binding Light, Trip's Prone) would meet enemies alive long enough to matter: an enemy would have about 2½ to 3 turns on average instead of 1½ (11 enemy turns over 4 enemies against 6½).
- **The first side to act:** in playtest 8 the orc acted last and never had a second turn. At 4 to 5 rounds the lead is one round in more, and the zipper's first slot matters less; the enemies' Reactions and specials (Backhand, Hurled Goblin, the Grab, Cornered) would be seen.
- **Guard and Rally Points in the fight:** nobody kept AP or Steeled themselves in playtest 8; in a longer fight with real enemy turns, keeping AP for Guard and spending a Rally Point mid-fight become choices. This is the decision density Lucas missed.
- **Minions and Grunts** die in round 1 today; longer fights don't change that unless Health per rank changes too or they arrive later.

### Options for Lucas (each a different lever; the costs are the research's and the arithmetic's)

1. **More Health on the ranks (the plain lever).** A Standard of 54 to 72. Cost: what he refused ("too much HP"); damage a turn falls to 4½ to 6 or the fight costs a band more; the slog risk Zupancic and 4e name, unless something else changes each round.
2. **Less party damage a turn** (the same arithmetic from the other side: two thirds of today's turn gives the 54 fight with 36 Health). Ways: steeper At-will Banes, fewer Strikes in a turn, smaller weapon dice. Cost: PCs feel weaker; every card's price moves; the PC side is what the playtests have tuned.
3. **More turns spent not attacking:** make defense, control and positioning worth an AP against the Basic Attack (Guard that matters against bigger enemy hits; riders that pay at once). The fight lengthens because the party chooses other things, not because enemies are sponges. Cost: card work (the maneuvers, the Round cards); hard to make exact; it fights the Basic Attack's 6.3 an AP.
4. **Enemies that arrive or change over the fight:** reinforcements in round 2 or 3 (Lancer), phases for Elites and Bosses (Shea), a rising enemy resource (Draw Steel's Malice). Keeps 36 a Standard and short-looking stat blocks; the fight has a new state each round. Cost: the CV budget must count late arrivals; a GM procedure to write; more enemy turns of table time.
5. **Objectives and clocks:** some fights end on a goal held to the end of round 4 or 5 (Lancer's sitreps, Kill Team's Turning Points). The length is set by the scenario, not the numbers. Cost: map and scenario work for each fight; not every fight can be one.
6. **Leave the numbers and cut the tail instead:** keep the 2 to 3 round fight and add the decisions it lacks (option 3) or a morale rule (Pathfinder 2e). Cost: it doesn't give 4 to 5 rounds; the record's own reason for 2 rounds (one 2d12 turn is two turns elsewhere) stays.

The options combine: the commonest pattern in the games read is a moderate rise in durability plus something that changes each round (an escalation, waves, or an objective), and a rule that ends the fight once it is decided.

### What the two coming playtests can answer

- **Whether round 2 is the norm or the fast edge** (the playtest 8 report expects "end of round 2 to early round 3"): the round the last enemy falls, and how many enemies get a second turn.
- **The minutes:** time each round (start and end of each round in the log, or a clock beside it). Rounds times minutes is what decides whether 4 or 5 rounds is affordable; nothing in the record gives it today.
- **Whether "attack after attack" is the fight's length or the cards:** count the AP spent on Basic Attacks, Round cards, maneuvers, Guard and Rally Points.
- **Whether the cost holds:** Rally Points a PC and the Downs, as decision 1 measures.
- **One fight with the enemies acting first or met later** (the playtest 8 report's own suggestion) shows what more enemy turns do before any number changes.

---

## 6. Not checked or unverified

- **Lancer's core sitreps' round limits** (6 rounds, from memory) and why Massif chose them: the core book could not be read.
- **No designer statement of a round target** was found for 4e, 5e (the "frequently mentioned" three rounds is Hughes's report), Pathfinder 2e, Draw Steel, Lancer or ICON; Draw Steel's numbers are players' reports.
- **ICON, Fabula Ultima, Trespasser, Strike!, Beacon, Warcry:** nothing found or not searched.
- **Gloomhaven's** exhaustion clock and scenario lengths: from memory, not checked.
- **Why Kill Team uses 4 Turning Points and Marvel Crisis Protocol 6 rounds:** reviews state the counts, not the reasons.
- **The "rocket tag" and "padded sumo" definitions** and the 4e "grind" definition are search summaries of TV Tropes and EN World [lead].
- **The initiative-value arithmetic** (2.2% over 3 rounds) is a forum post's, seen only as a summary.
- **2d12's minutes per round:** unknown.
- **The count in section 5** is the record's no-map, no-card count: it ignores overkill beyond half a carry, conditions, healing and movement, and it puts the end of a fight like playtest 8's in round 2.8 where the table ended in round 2.

---

## 7. Sources

- Neal Zupancic, "Balancing Combat for Length in D&D 5e", Nine-Sided Dice: https://ninesides.substack.com/p/balancing-combat-for-length-in-d
- Mike Shea, "Rounds of Combat", Sly Flourish: https://slyflourish.com/rounds_of_combat.html (also https://www.goodreads.com/author_blog_posts/24116441-how-many-rounds-of-combat-are-ideal)
- Paul Hughes, "5e Monster Manual on a Business Card", Blog of Holding: https://www.blogofholding.com/?p=7338; "The 5e monster creation guidelines are wrong": https://www.blogofholding.com/?p=7283
- Pelgrane Press, 13th Age FAQ: https://pelgranepress.com/2013/08/11/13th-age-faq/
- Rob Heinsoo, "13th Sage: Speeding Combat": https://pelgranepress.com/2018/07/02/13th-sage-speeding-combat/
- Greg Bilsland, Monster Manual 3 interview, Critical Hits: https://critical-hits.com/blog/2010/06/07/monster-manual-3-interview-with-greg-bilsland
- Sly Flourish on MM3 damage: https://slyflourish.com/three_tips_to_prepare_for_the_monster_manual_3.html [lead]
- EN World, "Higher Damage in Monster Manual 3": https://www.enworld.org/goto/post?id=5213775
- EN World, Stalker0's Guide to Anti-grind: https://www.enworld.org/threads/stalker0s-guide-to-anti-grind.254630/ [lead]
- EN World, "Length of Combat" (5e rounds by table): https://www.enworld.org/goto/post?id=6930079
- EN World, "Length of Combat & Time Taken per Round" (MerricB's and others' timings): https://www.enworld.org/goto/post?id=9238505
- EN World, GMMichael, "Professional Spectator D&D: 3.5 Minutes per PC, per Round": https://www.enworld.org/goto/post?id=8635438
- EN World, "How much does initiative add to damage output?": https://www.enworld.org/goto/post?id=6808867 [lead]
- EN World, SteveC on Draw Steel's rounds: https://www.enworld.org/goto/post?id=9757852
- Draw Steel fan director's guide: https://docs.google.com/document/d/1EyPIj5rv-PVnNza736xVShZ9TgI_c3B-iaZEjcsCmeo/export?format=pdf [lead]
- "Malice: Draw Steel's villainous resource", Altoholism: https://altoholism.blogspot.com/2025/08/malice-draw-steels-villainous-resource.html
- Steel Compendium, the Fury's Ferocity: https://steelcompendium.io/v2/Browse/feature/fury/level-1/ferocity/ ; Victories: https://steelcompendium.io/v2/Browse/rule/resource/victories/ [lead]
- Archives of Nethys, Pathfinder 2e GM Core, Morale: https://2e.aonprd.com/Rules.aspx?ID=2727 ; Paizo forum, fleeing and morale: https://paizo.com/threads/rzs2pjpd&page=2 [lead]; Paizo forum, rounds a combat lasts: https://paizo.com/threads/rzs2kdkv [lead]
- Tom Dunn, "Variability of encounter difficulty", The Finished Book: https://tomedunn.github.io/the-finished-book/theory/variability-encounter-difficulty
- TV Tropes, Rocket Tag Gameplay: https://tvtropes.org/pmwiki/pmwiki.php/Main/RocketTag [lead]; Health-Damage Asymmetry (Padded Sumo): https://tvtropes.org/pmwiki/pmwiki.php/Main/HealthDamageAsymmetry [lead]
- Lancer fan sitreps: Delivery (round 6), https://professorcoldheart.itch.io/fly-from-montgomery-a-lancer-scenario/devlog/709218/map-3-introducing-the-delivery-sitrep ; Lancer: Enhanced Combat (round 8), https://interpoint-station.itch.io/lancer-enhanced-combat/devlog/648745/lancer-enhanced-combat-release ; "The GM's Guide To Building Lancer Encounters": https://owacsender.substack.com/p/the-gms-guide-to-building-lancer ; Holdout write-up: https://knowledgeandknicknacks.blogspot.com/2024/01/sitrep-showdown-outpost-assault.html
- Kill Team review, GamesRadar: https://gamesradar.com/warhammer-40000-kill-team-starter-set-review ; Goonhammer core rules review: https://goonhammer.com/kill-team-2024-review-the-core-rules
- Marvel Crisis Protocol review, Meeple Mountain: https://www.meeplemountain.com/reviews/marvel-crisis-protocol ; Green Stuff World guide: https://www.greenstuffworld.com/en/module-blog?id=151
- In the project: `book/bestiary-design.md` (decisions 3, 13, 14; playtest 8 against the decisions), `book/playtest-8.md`, `book/rules-src/02-turns.md`, `book/core-rework.md` (F2), `book/ruler/fight-identity.mjs` (the count in section 5), and the research files of section 1.
