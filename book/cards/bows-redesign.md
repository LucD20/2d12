# The Bow remake: the record

**Started 2026-11-16 (Lucas: "Run the Bow remake"), on branch `pack-bows` from main.** The same way as the two classes (`book/class-charter.md`, "Rules learned in the two redesigns"): his brief, the rules and `book/research/` first, then one decision at a time, each waiting for him. **Nothing goes into the book, the card files or Foundry until he says so.** **The reading page:** `book/cards/bows-desk/index.html`, the artifact "Bow Remake Desk" (updated with every decision). What is being remade: the six bows of `book/weapon-trees.md` (2026-10-31, "to confirm"), which stays as it is, as the old design.

`notes.txt` was empty at the start (only its legend): nothing to merge.

## The brief (Lucas, 2026-11-16)

> The bows in weapon-trees.md were designed before the 4 + 1 AP round, Stage 0, the exploding weapon dice, the card Structure, the new Archer and the trait rename (Shot is now Projectile). Bring them up to today:
>
> 1. Start with a short list of what in weapon-trees.md no longer fits, and what you would keep. Wait for me.
> 2. Then one bow at a time, Basic first (Stage 0 needs only the two Basic bows and their first unlock): its table row, its Weapon Technique in the card Structure, its ladder. Check each against the new Archer: no multi-roll flurries, no unlock that copies a class card or its name, nothing that becomes the one best button.
> 3. Write the Light property in full (which weapons have it, what it does beyond the Archer's Darting Blade).

**The brief, line by line:**

| His words | What it asks |
|---|---|
| "before the 4 + 1 AP round" | every cost and every Reaction checked against 4 AP and 1 Reaction AP; no price read from the old 5 AP numbers |
| "Stage 0" | levels 1 to 3 first: two Basic bows, each with its first unlock; the later gates moved to today's Stages |
| "the exploding weapon dice" | each row a flat number plus one small die, written with "!"; a Technique writes 1[W], never its own dice |
| "the card Structure" | the bar, the Flavor, the traits, the grid, labeled lines in play order, one block a Version |
| "the new Archer" | no multi-roll flurries; no unlock that copies a class card or its name; nothing that becomes the one best button |
| "the trait rename" | Projectile where the old text says Shot; [V] where it says [B] |
| "its table row, its Weapon Technique, its ladder" | three things a bow, in that order |
| "Write the Light property in full" | which weapons have it; what it does beyond Darting Blade |

## Decision 1: what no longer fits, and what stays (DECIDED 2026-11-16)

### What no longer fits

**1. The prices.** Every number (4.51 DE, the efficiencies, `book/ruler/bows.mjs`'s turn table) is a 5 AP turn with a Weapon Modifier of +3 at level 5 and +4 at level 8. Today a turn is 4 AP and 1 Reaction AP, and the Modifier is +2 for all of Stage 0 (levels 1 to 3), +3 from level 4 if you choose it, +4 at level 12. None of the old numbers is carried over; the SIM gives rough anchors when a card needs one.

**2. The gates' dates.** "Basic in Stage 1, Advanced about level 5, Exotic about level 8, the last unlock after level 10" was a 10-level game with three Stages. Today: Stage 0 is levels 1 to 3, Stage 1 levels 4 to 7, Stage 2 levels 8 to 11, Stage 3 levels 12 to 15. At 0.9 Mastery a combat a Basic bow has about 13 Mastery when Stage 0 ends, so Stage 0 sees its unlocks at 3 and 8 and nothing else.

**3. The table rows.** They write the old dice ([B] 0 / 1d6 / 1d10; 1d4+1 / 1d8+1), the pool [B] and the trait Shot. Today a row is a flat number plus one exploding die, [V], and the property is Projectile. The two bows in Chapter 15 (Shortbow 0 / 1d6! / 1 + 1d6!; Longbow 0 / 1 + 1d4! / 2 + 1d4!) are the level to match.

**4. The cards' shape.** Columns with "As 1 AP", "Vs: AD", an Effects row, "you can Evade 1", their own dice in place of 1[W], Flavor that is a mood ("You waited. It stepped out. That was enough."). And three Techniques' second Version is only a bigger first one (Wounding Shot's bigger Bleed, Plunging Shot's + 1d8, Flurry's third arrow): a Version is a different thing, never a bigger one.

**5. The Reactions.** Five unlocks are "a Weapon Attack for AP you kept" (Patient Shot, Parthian Shot, Loose Together, Snap Release, Second Wind). Today there is one Reaction AP, the Archer's Hallmark Reaction wants it, a kept AP is Guard you give up, and a 2R card needs both. Patient Shot's trigger (an enemy stops in the open within range) and Loose Together's (an ally shoots) fire about every round: the extra roll outside the turn he ruled out with Overwatch.

**6. Against the new Archer:**

| In weapon-trees.md | The Archer card it runs into | Why |
|---|---|---|
| Flurry of Arrows (Composite) and its three steps | Quick Shots | a chain of two or three rolls; the class does many hits on one roll (2[W] / 3[W]). The multi-roll flurry he found boring |
| Parthian Shot, Turn and Loose (Recurve) | Slip Away, Snap Shot | "an enemy reaches you: step away and shoot" is both Hallmark Reactions in one card, for the same Reaction AP |
| Light Feet (Recurve 3): +1 Speed | the Archer's Speed +1; his "Light Feet" thrown out on 2026-11-16 | the name he rejected, and a silent bonus |
| Gone Before They Land (Recurve 28) | Fleet | the same sentence (each Evade 1 longer) |
| Close Quarters (Hunting 3): 1 Bane while Engaged | the Doomed shot while Engaged | the rule changed (Doomed, not 2 Banes), and a cost of range is never erased for free: Hit and Run itself stays Doomed |
| Pinpoint Shot (Flight): legs, arm or eyes | Trick Shots (Pin, Startle, Knock Back) | the same card: one shot, a rider you choose |
| Steady Draw (Longbow 20), the Flight Bow's "no range Bane" | Spotter's Find the Gap | he pays 1 AP for what the unlock gives always |
| Plunging Shot, Arrowfall (Longbow) | Spotter (Find the Gap, Call Out), Volley's high flight | cover lowered and a spotter's call exist on the class; the arc itself is still new |
| Heavy Shaft's Pushed 1 (Warbow) | Strafe's Tier 3, Trick Shots' Knock Back | the same rider a third time |
| Quick Nock (Hunting 14) | Darting Blade, Footwork's Hands Busy, Hit and Run | the Archer already swaps for free where it matters; and it is the book's Expert unlock under another name |
| Snap Release; the old name Hit and Run; the property Volley N | Snap Shot; Hit and Run; Volley | names |

**7. One best button.** Wounding Shot at 1 AP is a Weapon Attack that also deals [Mod] on a Tier 1 and bleeds on a Tier 3, once a round: there is no round in which a Weapon Attack is the better first shot. And the Archer's turn is already four AP of Round cards (a Hallmark Action 2, Darting Blade 1, an Art 1). So the first question of step 2 is what job a bow's Technique has in that turn.

**8. Rules decided with the bows and never put in the book:** Strung, the off-hand Bane, Group Mastery as the gate, Volley N, Arcs, "stops moving in a square". Each is checked again where a bow needs it (below: which I would keep). The book's own ladder (the Technique at 3, 4 or 5; Expert at 8; Master at 15 from level 8) and the trees' ladder (3, 8, 14, 20, 28, different for each bow) are two ladders: one has to go.

### What I would keep

1. **The two lines and the six bows:** Hunting Bow and Recurve Bow (Basic), Longbow and Composite Bow (Advanced), Warbow and Flight Bow (Exotic). History as flavor, the game decides the numbers; the line names never in the book. Only the two Basic bows are built now.
2. **The two Basic bows as two ways to play at the same damage:** the Hunting Bow stands and wounds, the Recurve Bow moves. They replace Chapter 15's Shortbow and Longbow rows.
3. **Strung.** A bow in one hand and the other free to draw fits the Archer better than Two-handed did: the hand that draws the string is the hand that draws the knife. (Darting Blade's "stow your bow" is read again in step 3, with Light.)
4. **Bleed as the Hunting Bow's own thing.** It is in the book (Chapter 8), it has no duration to track (the creature pays an Interact to end it, as the durations rule asks), and no Archer card bleeds.
5. **The ranges:** normal 8 and 6, far twice that, maximum three times, for maps of about 25 squares.
6. **What an unlock is:** the Technique, a utility, or a step of the Technique; never extra dice; a Technique writes 1[W]. And an Advanced or Exotic bow has its Technique from the day you can use it.
7. **For later bows, as ideas only:** the Arcs rule (a rule for "can I shoot over it?" is the kind the system wants), the Warbow's Line (one roll, several creatures: the new Archer's own shape), the Flight Bow's range that covers the map.

### What I would drop

Flurry of Arrows and its steps; Parthian Shot and its steps; Patient Shot; Loose Together; Light Feet; Close Quarters; Quick Nock; Pinpoint Shot as written; Volley N (it costs 2% and takes the name of an Archer card); every second Version that is only bigger.

**For Lucas:** yes or changes to the three lists. Then step 2 starts with the Hunting Bow: its table row first.

**Lucas's answer (2026-11-16): "Yes to all." THE THREE LISTS ARE DECIDED** (what no longer fits, what is kept, what is dropped). **And he asked: "Should we make one more ladder since stage 0 now exists?"** (decision 2).

## Decision 2: one more rung, now that Stage 0 exists? (DECIDED 2026-11-16: three rungs, more Mastery to reach the next thing)

Read as: the tree has three rungs (Basic, Advanced, Exotic) and the game now has four Stages; should the tree get a fourth? (If he meant a bow's own ladder of unlocks, the table answers that too.)

**Where the old tree lands on today's levels** (0.9 Mastery a combat, about 5 combats a level: 4.5 Mastery a level; Group Mastery is a third of your highest Mastery in the group):

| | Stage 0 (levels 1-3) | Stage 1 (4-7) | Stage 2 (8-11) | Stage 3 (12-15) |
|---|---|---|---|---|
| Your Mastery with the bow you always use | 0 to 13 | 13 to 31 | 31 to 49 | 49 to 67 |
| Your Group Mastery | 0 to 4 | 4 to 10 | 10 to 16 | 16 to 22 |
| The old gates | Basic (0) | Advanced (6: level 5) | Exotic (11: level 8) | nothing |
| A Basic bow's old unlocks | 3, 8 | 14, 20, 28 | nothing | nothing |
| What the Stage already gives | | +1 to one Modifier | Master (one more [W]) | +1 to both Modifiers |

So the tree built for ten levels is not short at the bottom: Stage 0 has its rung (Basic) and two unlocks. It is short **at the top**: Stage 3 gets no new bow, and a Basic bow's unlocks stop at level 7 of 15.

- **A, three rungs, one moved (Claude's pick):** Basic opens in Stage 0, Advanced with Stage 1 (Group Mastery 4, level 4, in place of 6), Exotic with Stage 2 (Group Mastery 10, level 8). Stage 3 brings no new bow: it has both Modifiers, and each bow's last unlock is placed there. Six bows, as decided. Each bow's own unlocks are spread over the Stages it lives in (a Basic bow: two in Stage 0, then about two a Stage) when that bow is built.
- **B, four rungs, one a Stage:** a fourth rung above Exotic for Stage 3 (Group Mastery 16, level 12). Every Stage has a bow to want. Eight bows a group in two lines, or one top bow a group; with eight groups, 8 to 16 more weapons, each with a Technique and unlocks, for levels nothing else is written for yet.
- **C, four rungs, a new one at the bottom:** a plain bow for Stage 0 with no unlocks of its own, and the Hunting and Recurve Bows open with Stage 1. Simplest level 1; but Stage 0 then has one bow and no choice, and the first playtests are Stage 0.

**Why A:** the rule that makes the tree work is "deeper is not stronger": a rung is a different way to play, paid by fewer unlocks. A fourth rung is paid by nothing unless it is designed, and it is 8 to 16 weapons for a Stage with no class levels yet. A keeps B open: a fourth rung can be added on top later without touching a bow below it. C takes away the one choice Stage 0 has.

**Nothing in Stage 0 depends on this:** the two Basic bows open at Group Mastery 0 in all three, and their first unlock is at 3. The gates' numbers are settled with the Advanced bows.

**For Lucas:** A, B or C (or: he meant a bow's own unlocks).

**Lucas's answer (2026-11-16): "I think would be best to make Stage 0 as simple as possible, so postponing it to trigger the 'rung' first thing in Stage 1 and keeping it at three."** DECIDED, as Claude reads it (to confirm): **three rungs; in Stage 0 a bow is its table row and its Technique (Mastery 3) and nothing else; the tree starts first thing in Stage 1** (level 4: the Advanced bows open, and the Basic bows' further unlocks begin there, none at Mastery 8); Exotic with Stage 2. The other reading, his to choose: the three rungs sit one a Stage from Stage 1 (Basic's ladder in Stage 1, Advanced in Stage 2, Exotic in Stage 3), which also gives Stage 3 its bow. Stage 0 is the same in both. Consequence for the book when applied: Chapter 15's Expert (Mastery 8) is not a Stage 0 unlock.

## Decision 3: the Hunting Bow's table row (2026-11-16)

| Name | Group | Properties | Type | Range | Damage | Mastery |
|---|---|---|---|---|---|---|
| **Hunting Bow** | Bows | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [V] 0 / 1d6! / 1d8! | 3 |

**The damage: three candidates, all at the book's level** (Chapter 15's Shortbow averages 4 on a Tier 2 and 5 on a Tier 3 with the exploding die: a d4! averages 3, a d6! 4, a d8! 5; no number of the ruler or the Bestiary moves).

| | Row | Tier 2 / Tier 3 | Shape | For / against |
|---|---|---|---|---|
| **1 (Claude's pick)** | 0 / 1d6! / 1d8! | 4 / 5 (1 to 5+, 1 to 7+) | all die, and the die grows | the old Hunting Bow's shape (1d6 / 1d10: the arrow that wounds more than it kills, sometimes badly); a Tier 3 is seen in the hand (a bigger die); it leaves "a flat number and a d4" to the Recurve Bow, so the two Basic bows differ at the same average. Against: the widest spread of the three |
| 2 | 0 / 1d6! / 1 + 1d6! | 4 / 5 (1 to 5+, 2 to 6+) | the middle | today's Shortbow row, unchanged: nothing new to learn. Against: a Tier 3 is the same die plus 1 |
| 3 | 0 / 1 + 1d4! / 2 + 1d4! | 4 / 5 (2 to 4+, 3 to 5+) | steady | today's Longbow row. Against: it is the shape I would give the Recurve Bow (light, quick, even arrows); a d4 explodes one roll in four, and Quick Shots rolls three of them |

**What the Archer's cards deal with row 1** (Weapon Modifier +2): a Weapon Attack 0 / 1d6! + 2 / 1d8! + 2 (average 6 / 7); Quick Shots 2 / 2d6! + 2 / 3d8! + 2 (10 / 17); the same averages as with today's Shortbow.

**The rest of the row:**
- **Range 8 / 16 / 24** (kept in decision 1: far twice the normal, maximum three times; the book's Shortbow is 8 / 16 / 32).
- **Strung in place of Two-handed** (kept in decision 1). Its text, in today's words, for the book when the bows go in: "You hold a **Strung** weapon in one hand and draw it with the other: [Strike, Weapon] Actions with it take 3 Banes while your other hand holds something." The off-hand question (decided 2026-10-31, never applied; the book says today that which hand holds a weapon changes nothing) waits for the Light step.
- **Mastery 3** for its Technique: the Archer starts with it.
- **The name** Hunting Bow; the Shortbow's row goes when it comes in.

**For Lucas:** the row; 1, 2 or 3 for the damage.

**Lucas's answer (2026-11-16), on the rungs:** "I was thinking more of just taking more Mastery Points so reaching it on Stage 0 is harder, but still possible." So Claude's reading above was wrong: **nothing is closed in Stage 0; the next unlock and the next rung cost more Mastery, so that most characters reach them first thing in Stage 1 and a dedicated one late in Stage 0.** Three rungs. **Numbers proposed (confirmed with the Hunting Bow's ladder):** what can be had in Stage 0: at most 1 Mastery an encounter, about 15 encounters, so 15 at the very most and about 13 on average; an Archer starts at 3 (18 at most, about 16). **The Technique stays at 3. A Basic bow's second unlock at 14** (it was 8): an Archer has it during level 3, anyone else in the first fights of level 4, or at the very end of level 3 with a Tier 3 every fight. **The Advanced rung at Group Mastery 5** (15 Mastery with one bow; it was 6 on the old pace): an Archer in the last fights of level 3, anyone else at level 4.

**Lucas's answer (2026-11-16), on the damage:** "We agreed on trying to make damage flat, but on lower damage weapons it is harder, but I think we still should try it. 3 might be best but we neeed to make it different from Recurve bow somehow." **THE HUNTING BOW'S ROW IS DECIDED with damage 3:**

| Name | Group | Properties | Type | Range | Damage | Mastery |
|---|---|---|---|---|---|---|
| **Hunting Bow** | Bows | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [V] 0 / 1 + 1d4! / 2 + 1d4! | 3 |

## Decision 4: how the Recurve Bow's damage differs (PROPOSED 2026-11-16, five ways, waiting for Lucas)

The Hunting Bow is 0 / 1 + 1d4! / 2 + 1d4! (average 4 / 5). The Tier chances at Stage 0 (Weapon Modifier +2 against Defense 13; `calc.mjs`): 28% / 45% / 27%. "A Weapon Attack" below is its average damage with those chances; the Hunting Bow's is 4.60, and Quick Shots with it 9.65. There are only four or five points to arrange, and nothing smaller than a d4, so the ways are few:

| | The Recurve Bow's row | Average | A Weapon Attack | What differs | Against |
|---|---|---|---|---|---|
| **1 (Claude's pick)** | 0 / 1 + 1d4! / 1 + 1d6! | 4 / 5 | 4.60 | the same Tier 2; on a Tier 3 the Hunting Bow adds a point (steady), the Recurve Bow takes a bigger die (it explodes less often and higher) | a small difference; one more die size at the table |
| 2 | 0 / 4 / 5, no die | 4 / 5 | 4.60 | fully flat: the quick bow rolls no damage at all | no die in the hand and nothing to explode; Empowered's 1d6! would be its only die. The furthest "flat" can go: worth one try, but on the bow whose player rolls most hits |
| 3 | the same row as the Hunting Bow | 4 / 5 | 4.60 | nothing in the row: range (6 against 8) and the Technique tell them apart | the research's warning: the bow with less range and the same damage reads as the worse bow unless its Technique carries it |
| 4 | 0 / 1d6! / 1 + 1d6! (today's Shortbow) | 4 / 5 | 4.60 | less flat, a d6 on both Tiers | it goes away from flat |
| 5 | 0 / 1d4! / 3 + 1d4! | 3 / 6 | 4.41 (4% less) | the swing is between the Tiers: a weak Tier 2, a strong Tier 3 | less damage on the bow with less range; a Tier 2 of 1d4! feels bad; with Quick Shots' 3[W] it turns the other way |

**Why 1:** both bows are a flat number and one die, as he asked; the averages are the same on every Tier, so neither is the better bow and no ruler number moves; and the difference is in the one place a player looks, the Tier 3 line (the Hunting Bow's "2 +" against the Recurve Bow's d6). The real difference between the two stays where the research says it is liked: the range and the Technique.

**For Lucas:** 1 to 5 for the Recurve Bow's damage; and yes or other numbers for the Mastery (14 for the second unlock, Group Mastery 5 for the Advanced rung).

**Lucas's answer:**

## Research

`book/research/` had nothing on weapons' own abilities or on a Light property (`archer.md`, `many-hits.md`, `versions-criticals.md` and `gear-and-hands.md` were read first). One pass was made on what it lacked: **`book/research/weapons-bows-light.md`** (2026-11-16; 23 takeaways; one pass by an agent, not re-checked; its [lead] lines are not to be quoted). What it found, for the decisions ahead:

- **A trick for each weapon is liked because weapons with the same die finally differ; the trick itself is called small.** (D&D 2024's masteries: the Shortbow has Vex, the Longbow Slow.)
- **What slows the table is a second roll, not a rider.** The riders that need a Save are the ones called slow.
- **A rider that happens by itself on every hit is called a stumbling block and one more thing to track;** several posters wanted a choice made on the attack.
- **One trick a weapon plus a free draw gives the "golf bag":** players swap weapons every attack to use each trick. Where drawing is cheap, it is cheap for every weapon; free draw is nobody's Light property.
- **A rider that feeds your next attack (Vex) is ranked too good; one that slows the target is called useless by some and right for shoot-and-retreat by others.**
- **Draw Steel gives the trick to the kit, not the weapon,** and has one "bow": short against long doesn't exist there.
- **"Light" is a pairing rule in five of the seven games read:** it says what a second weapon in the other hand does. The rapier and the club are the edge cases (light in one game, not in the next).
- **Short bow against long bow:** a bigger die and more range alone make the short bow a "dumbed down" long bow. Pathfinder 2e's Volley works as balance and is disliked as fiction. The other ways found: a different rider on each bow, or mobility (a long bow that costs movement or can't be used mounted).
