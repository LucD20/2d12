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

## Decision 4: how the Recurve Bow's damage differs (DECIDED 2026-11-16: way 1)

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

**Lucas's answer (2026-11-16): "1 it is then." THE RECURVE BOW'S DAMAGE IS DECIDED: [V] 0 / 1 + 1d4! / 1 + 1d6!** (the rest of its row with its own decision). The Mastery numbers (14; Group Mastery 5) were not answered: kept as proposed, asked again with the Hunting Bow's ladder.

## Decision 5: the Hunting Bow's Weapon Technique, Wounding Shot (DECIDED 2026-11-16: way 1)

**The question under it** (decision 1, point 7): the old Wounding Shot was a Weapon Attack with more on it, so it was simply the first shot of every round. What a Technique should be, from him: "a Technique must feel good, almost unique" (2026-10-31, on Skirmish Shot: "a Weapon Attack with other dice" is lame). From the research (`weapons-bows-light.md`): a rider that happens by itself on every hit is one more thing to track; players wanted a choice made on the attack; a second roll is what slows the table. So: one roll, the bow's own thing visible on most uses, and a choice attached to using it.

### The three ways

**1, the patient shot (Claude's pick): it asks you to stand still.**

> **Wounding Shot** · Round · 1 AP
> *You hold your ground until your foe shows its flank, and put a broad-headed arrow where the wound will not close.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Requirement:** You haven't left your square this turn.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod]; Bleed 1 (Bo/In).
> **Tier 3:** [V] 1[W] + [Mod]; Bleed 2 (Bo/In).

**2, the upgrade: no Requirement, the Bleed only on a Tier 3** (the old card in today's words).

> **Wounding Shot** · Round · 1 AP
> **Tier 1:** [V] [Mod]. **Tier 2:** [V] 1[W] + [Mod]. **Tier 3:** [V] 1[W] + [Mod]; Bleed 2 (Bo/In).

**3, the trade: little damage now, a bigger Bleed.**

> **Wounding Shot** · Round · 1 AP
> **Tier 1:** nothing. **Tier 2:** [V] [Mod]; Bleed 2 (Bo/In). **Tier 3:** [V] [Mod]; Bleed 3 (Bo/In).

### Priced (way 1)

The unit: a Weapon Attack is 25 points (4.60 damage with the Hunting Bow at Stage 0; the Tiers 28% / 45% / 27%). A Round card's band is 25 to 33.

| Line | Points | Source |
|---|---:|---|
| Tier 2 and 3: 1[W] + [Mod] (a Weapon Attack) | 25 | [SIM] the yardstick |
| Tier 1: [Mod] | +3 | [judgment] 28% of 2 damage |
| Bleed 1 on a Tier 2, Bleed 2 on a Tier 3 | +1 to +8 | [SIM] `pc-budget.md` puts a Bleed 1d4 rider at about 1 point (its NPCs staunch or die soon); [judgment] left alone for 1.5 of its turns it is 1.5 damage a use: 8 |
| The AP an enemy spends to staunch (Interact, a Save) | | [not priced] |
| Requirement: you haven't left your square | -3 for an Archer | [judgment] that shot goes without Shifting Aim's Field Boon; for other classes it is a limit on where it can be used, [not priced] |
| **Total** | **about 26 to 33** | on the band; the top of it if nobody staunches |

Way 2: 25 + 3 + (27% of a Bleed 2: 1 to 4) = about 29 to 32, no Requirement. Way 3: 12 (the [Mod] on 72%) + (Bleed 2 / 3: 2 to 13) = 14 to 25: under a Weapon Attack unless the Bleed runs two turns or more.

### Analysis

- **The decision it gives (way 1).** For anyone: shoot from where the turn started, or move first and lose it this round. For the Archer it is a question of order, against his own Feature: Shifting Aim pays for moving before each shot, Wounding Shot is only there before the first step. A turn becomes "Wounding Shot from here, step, Quick Shots with the Boon" or "step first for cover and the Boon, and no Wounding Shot". Engaged at the start of the turn (the shot is Doomed), no line from the starting square, or a target at far range: all make it a real choice. And a second one every round: **Bleed doesn't add up** (the higher stays), so the shot goes to a foe that isn't bleeding yet.
- **Why not way 2.** It is the best first shot of every round with nothing to decide, and on 73% of its uses it is a Weapon Attack: the bow's own thing is seldom seen (his word for that was "lame").
- **Why not way 3.** A shot for [Mod] and a rider is Trick Shots' shape (Pin, Startle, Knock Back): the Archer who has that Art would hold a fourth Trick Shot.
- **The rules it touches.** Bleed (Chapter 8): at the end of each of its turns; ended by Interact (1 AP) and a Body or Instinct Save against DC 13 (Tier 2: half this turn, then it ends; Tier 3: it ends); healing doesn't end it. No duration to track, as the durations rule wants ("the creature pays to end it"). "Bleed 1 (Bo/In)" is the book's notation: [V] damage, flat. Flat on purpose (his direction for damage, and nothing to roll at the end of each turn). "Left your square this turn" is Shifting Aim's own phrase, so the two read as a pair. Line of Effect: on the Target line, as on every Strike. A Tier 3 adds something (Bleed 2 over Bleed 1).
- **Its siblings.** No Archer card bleeds or asks you to stand still. Trick Shots' Pin (Hindered) and Snap Shot (Hindered, Immobilized) stop a foe; this one costs it Health or an AP. The Paladin has no ranged Strike: with a Hunting Bow this is his one reason to shoot first and walk after.
- **Table feel.** One roll. The bow's thing happens on 72% of uses. One number to remember on a bleeding creature, said once at the end of its turn. The GM gets a decision too (staunch for an AP, or bleed).
- **The research.** D&D 2024's riders are liked for making same-die weapons differ and disliked where they are automatic or need a second roll: this one is neither (a card you choose to use; no Save unless the target pays to end it). Pathfinder 2e's own knife and bow tricks sit on a critical only, the "seldom seen" problem of way 2.
- **Not on the card, on purpose.** A second Version (the old 2 AP one was only bigger); a Critical line (the old "only a Tier 3 ends this Bleed" can come back as this card's own Critical if he wants one of the few).

### The rider: every candidate the rules offer

Bleed was kept for this bow in decision 1; the list is here so nothing is left out.

| Candidate | On an Archer card already | Verdict |
|---|---|---|
| **Bleed** | none | **kept:** the hunter's wound; damage over time is new to both classes |
| Hindered | Trick Shots (Pin), Snap Shot, Volley | no: three cards have it |
| Immobilized | Snap Shot's Tier 3 (and Binding Light) | no: the strongest stop, already a Tier 3 prize |
| Prone | Volley's Critical (Kneel, Paladin) | no: an arrow that knocks down is the Warbow's idea |
| Vulnerable | Trick Shots (Startle), Hit and Run | no: it feeds the next attack, the kind the research ranks too good on a weapon |
| Staggered | Darting Blade | no: the knife's |
| Dazed, Sickened, Slowed, Exhausted | none | no: an arrow wound that takes AP or Tiers away is a big effect for an everyday card |
| Frightened, Taunted | the Paladin's | no: not a weapon's |
| Blinded, Half-Blinded | Glare (Paladin) | no: Lucas cut "the eyes" from Pinpoint Shot for strength |
| Grabbed | none | no: a pinning arrow is Immobilized by another name |
| Empowered, Quickened, Guard (on you) | none | no: a bonus for shooting is a silent bonus |
| Pushed, Pulled, Slid | Strafe, Trick Shots (Knock Back) | no: twice already; the Warbow's |
| A Boon, or a Bane on the target's Strikes | Shifting Aim, Blade and Bow | no: the class's own currency |
| The target loses 1 AP | none | no: the same as Dazed, stronger |
| Ignoring Cover or range Banes | Spotter (Find the Gap) | no: paid for with 1 AP there |
| Light (the target sheds light, an arrow that marks) | Lantern of Faith (Paladin) | no for now: a good "quiet / tracking" unlock later, with the old Blood Trail's "never Unsensed by you" |

**For Lucas:** way 1, 2 or 3; in way 1, the Requirement, and Bleed 1 / Bleed 2.

**Lucas's answer (2026-11-16): "1 is good. RAW, it means you usually use it as the first action on your turn right?" WOUNDING SHOT IS DECIDED, way 1** (the card above: Round, 1 AP; Requirement: You haven't left your square this turn; [V] [Mod] / [V] 1[W] + [Mod]; Bleed 1 (Bo/In) / [V] 1[W] + [Mod]; Bleed 2 (Bo/In)).

**The answer to his question, by the rules as written:** usually, yes, but the card says "before your first step", not "first". Read exactly:
- **Anything that doesn't move you can come before it:** a Weapon Attack, Trick Shots, Spotter, Leaning (you lean from your square: with Lean and Loose it is "lean out, Wounding Shot, back" for 1 AP), Interact, Reload, Stand (getting up from Prone is not leaving your square), Judge or Lay On Hands' 1 AP without its Advance.
- **Quick Shots can come first only if you give up its Evade** (a number is a maximum, so Evade 0 is allowed; Chapter 1). Strafe's Setup is optional too.
- **Any square left counts,** by an Advance, an Evade, or being moved (Pushed, Slid, a Reposition) during your turn; coming back to the same square doesn't undo it. Shifting Aim reads the same way, so the two never disagree: the moment Shifting Aim switches on is the moment Wounding Shot switches off.
- **Only this turn counts:** moving on other creatures' turns (Slip Away) changes nothing.
One gap to close when it goes into the book: "left your square" for a creature bigger than one square (any of its squares, or all). Proposed with Shifting Aim, one sentence in Chapter 3: you leave your square when you stop occupying any square you occupied.

## Decision 6: the Hunting Bow's ladder (PROPOSED 2026-11-16, waiting for Lucas)

| Mastery | When | Unlock |
|---:|---|---|
| **3** | an Archer from the start; anyone else about the fourth fight | **Wounding Shot** (decided) |
| **14** | an Archer during level 3; anyone else first thing in Stage 1 | **the bow's second unlock** (below) |
| later | Stage 1 and after | written with Stage 1: about two a Stage, the last one in Stage 3 |

**What happens to the book's own ladder** (Chapter 15: the Technique at 3, 4 or 5; Expert at 8; Master at 15 from level 8):
- **The Technique at 3:** kept (both Basic bows; "4 for specialist, 5 for exotic" goes for the bows: a later rung's bow has its Technique from the day you can use it).
- **Expert at 8** (once a turn, draw, stow or regrip without Interact): **removed for the bows.** It is the Quick Nock dropped in decision 1; it falls in the middle of Stage 0, which he wants simple; and the research's "golf bag" comes from exactly this (a trick a weapon plus a free draw). Other groups keep it until their own pass.
- **Master** (from level 8, one more [W]): untouched now; read again with Stage 2 (it meets One More Arrow and the N[W] cards).

**The second unlock, at 14: three ways**

- **A, the bow's own (Claude's pick): Blood Trail.** "A creature that is bleeding from your Wounding Shot is never Unsensed by you: you perceive it as Hidden at least." The hunter follows the wounded prey: a rule-bender, no dice, nothing in most fights and exactly right when the thing runs into the dark or Hides. It makes the Technique's Bleed matter once more without making it bigger.
- **B, one unlock for every Basic bow:** Expert moved from 8 to 14. Nothing to design; but it is the free draw, and both bows get the same thing.
- **C, nothing written yet:** the ladder says "3: Wounding Shot; more from 14, with Stage 1". The simplest Stage 0; an Archer who reaches 14 in level 3 finds nothing there until Stage 1 is written.

**Other candidates for A, each with its reason:** a harder Save to staunch (DC 15: a silent number, and it only makes the Bleed bigger); Wounding Shot's own Critical ("only a Tier 3 on the Save ends this Bleed": 3% of rolls, better as a Critical line than as an unlock); Wounding Shot ignores the far range Bane (Find the Gap's job, paid with 1 AP); a shot that doesn't give you away after Hide (a good one, but it needs Hide's rules read against shooting: later); Steady Hands, "once a round ignore 1 Bane" (a silent bonus); a looser Requirement (it would erase the decision just made).

**For Lucas:** the ladder (3 and 14); Expert out for the bows; A, B or C at 14; Group Mastery 5 for the Advanced rung.

**Lucas (2026-11-16), before answering:** "'Your Mastery with the bow you always use' is the average mastery gained? Because if it is, then I will increase the Mastery numbers. I want it to grow slower i think. Before I answer, show me in a table how it is looking like, intuitively."

**Answered: yes, the average.** The rule (Chapter 15): the first Tier 3 on a Weapon Action with a weapon of a group in an encounter gives 1 Mastery, at most 1 a group an encounter. A Tier 3 is 27% of rolls at Stage 0, so the point comes in 47% of fights with 2 weapon rolls, 72% with 4, 85% with 6, 92% with 8, 96% with 10. A character who fights with the bow makes about 8: **0.9 a fight, so Mastery is close to "the number of fights you have used it in"**. At his pace (about 5 fights a level): 4 or 5 after level 1, 9 after level 2, 13 or 14 after level 3 (Stage 0 ends), 18 after level 4, 31 or 32 after level 7 (Stage 1 ends), 49 or 50 after level 11, 67 or 68 after level 15. An Archer is 3 ahead.

| Mastery needed | Anyone: fight, level | An Archer (starts at 3): fight, level |
|---:|---|---|
| 3 | fight 4, level 1 | from the start |
| 8 | fight 9, level 2 | fight 6, level 2 |
| 14 | fight 16, the first of level 4 | fight 13, level 3 |
| 15 (Group Mastery 5) | fight 17, level 4 | fight 14, level 3 |
| 20 | fight 23, level 5 | fight 19, level 4 |
| 28 | fight 32, level 7 | fight 28, level 6 |

**Two ways to make it slower, his to choose:** bigger numbers on the ladders (the rule stays "a point a fight"; the numbers grow large over 15 levels: about 68 by the end), or a slower point (for instance at most 1 a group between two Rests in place of each encounter: about half the pace at his 1 to 2 fights a session, and every number above is reached twice as late). Waiting for his answer on the ladder.

**Lucas (2026-11-16):** "Should we change to: You gain one mastery when you win an encounter of X difficulty. Instead of 'when you first get a tier 3'? I dont know if any other systems does something like this, but still attempt a search on the topic."

## Decision 7: how Mastery is gained (DECIDED 2026-11-16: a won encounter, normal or harder)

**The search** (`book/research/mastery-progression.md`; six searches, summaries only, no page opened): no game found gives a weapon's own progress for winning a fight of a set difficulty. The two halves exist apart. "Only the hard ones count" exists for single rolls (Burning Wheel's routine, difficult and challenging tests; Blades in the Dark's xp for a desperate roll), and what goes wrong there is players chasing the roll that counts. Progress by use is known for grinding, and the fixes named are a cap and a challenge: today's rule has the cap, his proposal adds the challenge. Kingdom Death: Monster's weapon proficiency, the nearest match to today's rule, was not found.

**What today's rule costs:** a thing to remember in every fight (have I had a Tier 3 with this group yet?), luck (one PC in ten gets nothing from a fight), less for a PC who rolls few Weapon Actions (a Paladin on his Power cards), and a point a group, so two weapons can be trained in one fight.

**The book already has the word he needs** (Bestiary, Building an encounter): total CV for each PC: 75 easy, 100 normal, 125 hard, 150 deadly.

| | The rule | Pace | For / against |
|---|---|---|---|
| **A** | today's: the first Tier 3 a group an encounter; bigger numbers on the ladders | 0.9 a fight: 13 after level 3, 68 after level 15 | nothing changes; the costs above stay, and the numbers get large |
| **B (Claude's pick)** | **"When your side wins a hard or deadly encounter, you gain 1 Mastery with one weapon you made a [Strike] Action with in it."** | with 2 hard or deadly fights in 5 [judgment]: 2 a level; 6 after level 3, 14 after level 7, 30 after level 15 | his idea with X = hard; slower, small numbers, nothing to track in the fight, the same for every PC, and it says something ("you learn your weapon in the fights that test you"). Against: the pace is the GM's (a GM who builds only normal fights gives none: the rule must say so, or count CV 100 too); "wins" needs its sentence |
| C | the same with X = normal or harder | about 1 a fight: 15 after level 3, 75 after level 15 | no tracking and no luck, but not slower: the numbers still have to grow |

**What B needs written, so nothing is left to the table:**
- **"Wins":** the encounter ends with every enemy Down, fled or surrendered. A fight the party flees gives nothing.
- **The difficulty is the one the GM built** (CV for each PC, as the Bestiary counts it); the GM says it when the fight ends.
- **One point an encounter, one weapon:** you choose among the weapons you made a [Strike] Action with. (Today's "1 a group" let two groups grow in one fight.)
- **The Archer's Starting Mastery 3** is worth more than before (about a level and a half of hard fights): to read again with the ladder.

**The ladder's numbers under B** (to decide after this): the Technique at 3 is then the second level for anyone but an Archer (fight 8), which may be too late for a weapon's first trick: 2, or 1, would be the number. Proposed once he chooses.

**For Lucas:** A, B or C; in B, X (hard, or normal).

**Lucas's answer (2026-11-16): "Lets do B, with moderate+ encounters, so a higher ladder. Before I decide the numbers, show me the exact ladder for the bows currently, even the outdates ones." HOW MASTERY IS GAINED IS DECIDED:**

> **When your side wins an encounter that was normal or harder, you gain 1 Mastery with one weapon you made a [Strike] Action with in it.**

("Moderate" is the Bestiary's **normal**: total CV 100 for each PC; easy, 75, gives nothing.) With it, as proposed: "wins" = the encounter ends with every enemy Down, fled or surrendered; the difficulty is the one the GM built, said when the fight ends; one point an encounter, one weapon. It replaces "the first Tier 3 with a weapon of a group, at most 1 a group an encounter" (Chapter 15) when the bows are applied. **The pace: about 1 a fight** (5 a level if every fight is normal or harder: 15 after level 3, 35 after level 7, 55 after level 11, 75 after level 15), so the ladder's numbers go up.

## The ladders as they stand, all of them (shown to Lucas 2026-11-16, before the numbers)

"Reached" is at 1 Mastery a fight and 5 fights a level, for a character who starts at 0; an Archer is 3 fights ahead.

**1. The book today (Chapter 15), the same for every weapon:**

| Mastery | Reached | Unlock |
|---:|---|---|
| 3 (Shortbow) / 4 (Longbow) | fight 3 or 4, level 1 | the Weapon Technique: Skirmish Shot / Heartseeker |
| 8 | fight 8, level 2 | Expert: once a turn, draw, stow or regrip without Interact |
| 15, and level 8 | level 8 | Master: Actions that deal [W] deal one more [W] |

Another weapon of the group is at least at a third of your highest Mastery in the group.

**2. weapon-trees.md (2026-10-31, after its revisions R1 to R4): outdated.** An Advanced bow started at 6 Mastery and an Exotic one at 11 (your Group Mastery when the rung opened).

| Bow | Rung opens | Its unlocks | Today |
|---|---|---|---|
| Hunting Bow | Basic, 0 | 3 Close Quarters · 8 Wounding Shot · 14 Quick Nock · 20 Blood Trail · 28 Patient Shot | Wounding Shot redone and decided; Blood Trail a candidate; the rest dropped |
| Recurve Bow | Basic, 0 | 3 Light Feet · 8 Parthian Shot · 14 Turn and Loose · 20 Second Wind · 28 Gone Before They Land | all dropped |
| Longbow | Advanced, Group Mastery 6 (18 with one bow: level 4) | 6 Plunging Shot · 14 Loose Together · 20 Steady Draw · 28 Arrowfall | Loose Together dropped; the rest clash with Spotter; the arc kept as an idea |
| Composite Bow | Advanced, Group Mastery 6 | 6 Flurry of Arrows · 14 Rider's Stride · 20 Unbroken Rhythm · 28 Storm of the Steppe | all dropped |
| Warbow | Exotic, Group Mastery 11 (33 with one bow: level 7) | 11 Heavy Shaft · 16 Bodkin Point · 22 Clothyard Shaft | the Line kept as an idea |
| Flight Bow | Exotic, Group Mastery 11 | 11 Pinpoint Shot · 16 Snap Release · 22 Needle's Eye | Pinpoint Shot dropped as written; the range kept as an idea |

When each number comes: 3 fight 3 (level 1) · 8 fight 8 (level 2) · 14 fight 14 (level 3) · 20 fight 20 (level 4) · 28 fight 28 (level 6).

**3. This remake so far:**

| Bow | Decided | Proposed, not answered |
|---|---|---|
| Hunting Bow | 3: Wounding Shot | 14: Blood Trail (or Expert moved there, or nothing yet); Expert at 8 out for the bows |
| Recurve Bow | its damage | everything else |
| The rungs | three; the next one harder to reach in Stage 0 but possible | Advanced at Group Mastery 5 (15 with one bow: the last fight of level 3) |

**For Lucas:** the numbers (the Technique; the second unlock; the Advanced rung).

**Lucas (2026-11-16), after asking why there were "only three rungs"** (answered: the three are the tree's tiers, never reduced; a bow's own unlocks were only not written past Stage 0): "All good. So lets try to do some math: We have 15 levels. Mastery should like follow. Advanced at 5, Exotic at 10. Weapon unlucks as well: Basic 3 - 5 - 7 - 10 - 13. Advanced (starts with technique) 7 - 10 - 13. Exotic (starts with technique) 10 - 13. Does that make sense? Does it fit?"

## Decision 8: the ladders' numbers, from his levels (DECIDED 2026-11-16)

Read as levels. At 1 Mastery a fight and 5 fights a level, a level starts after 5 × (level - 1) fights, so **Mastery = 5 × (level - 1)**:

| | Level 3 | Level 5 | Level 7 | Level 10 | Level 13 |
|---|---|---|---|---|---|
| Fights fought with bows | 10 | 20 | 30 | 45 | 60 |
| **A Basic bow** (from 0): its Mastery | **10:** unlock 1 | **20:** unlock 2 | **30:** unlock 3 | **45:** unlock 4 | **60:** unlock 5 |
| **An Advanced bow** (opens at level 5: Group Mastery 7; it starts at 7 with its Technique) | | 7: the Technique | **17:** unlock | **32:** unlock | **47:** unlock |
| **An Exotic bow** (opens at level 10: Group Mastery 15; it starts at 15 with its Technique) | | | | 15: the Technique | **30:** unlock |

(The Advanced and Exotic rows are for a character who changes bow the day the rung opens and stays on it.)

**It makes sense, and it fits the levels well:**
- The weapon's levels (5, 7, 10, 13) are the quiet ones. Level 4 has the Apex and Stage 1's numbers, level 8 Master, level 12 both Modifiers: no level gets two big things.
- Stage 3 gets something from every bow (level 13), which the old tree lacked.
- Deeper keeps meaning fewer unlocks: five, then the Technique and three, then the Technique and one.
- Every bow has its unlocks on the same levels (7, 10, 13), whichever rung it is.

**Four things that need his word for it to fit:**
1. **The first number, 3.** As a level it puts a Basic bow's Technique (Wounding Shot, decided at Mastery 3) at level 3, Mastery 10: an Archer (Starting Mastery 3) would shoot without it until level 2, anyone else until level 3, and the two Basic bows would differ by one die for most of Stage 0. Claude's default: **the Technique stays at Mastery 3 (level 1), and the other four are at levels 5, 7, 10, 13 (20, 30, 45, 60)**: Stage 0 is then exactly "a bow is its row and its Technique". If he meant level 3: the Technique at 10, and the Archer's Starting Mastery read again.
2. **Group Mastery has to count every bow.** The book says "a third of your highest Mastery with a weapon of its group". With that, a character who moves to an Advanced bow at level 5 (it starts at 7) has 31 with it at level 10, a third is 10, and the Exotic rung (15) doesn't open until level 12. The tree's own definition (2026-10-31) fixes it: **Group Mastery = all the Mastery you have gained with weapons of the group, divided by 3.** Then it is "fights fought with bows / 3" whichever bows: 7 at level 5, 15 at level 10. Chapter 15's sentence changes when the bows go in.
3. **Nothing past the Technique can be reached in Stage 0** (the Advanced rung needs 21 fights; Stage 0 has 15, an Archer 18 with his 3). It replaces "harder but still possible in Stage 0": his newer numbers win unless he says otherwise.
4. **Master** (Mastery 15 and level 8) is now simply "level 8" (15 is reached in level 3): read with Stage 2.

**The numbers move with the table's pace:** they are right at 5 normal-or-harder fights a level. At 4 a level everything comes a level or two later (level 13's unlock at level 16: never); at 6, sooner. If that worries him, the alternative is smaller numbers set for 4 fights a level (Basic 8 / 16 / 24 / 36 / 48; Group Mastery 5 and 12).

**For Lucas:** the table; 1 (the Technique at Mastery 3, or at level 3); 2 (Group Mastery counts every bow); the pace the numbers are set for (5 fights a level, or 4).

**Lucas's answer (2026-11-16):** "1. Lets just grant archer a higher mastery headstart, keep as 10. 2. Good. 3. We can make a Rest mechanic later to help with that, I like the round numbers. Consequences: We can remove the Stage gating, what you say, so we dont have level 8 problem." **THE LADDERS' NUMBERS ARE DECIDED:**

| | Opens | Unlocks, by its own Mastery | About level |
|---|---|---|---|
| **A Basic bow** | Group Mastery 0 | **10** (its Technique) · **20** · **30** · **45** · **60** | 3 · 5 · 7 · 10 · 13 |
| **An Advanced bow** | **Group Mastery 7**; it starts at 7 with its Technique | **17** · **32** · **47** | 5 (opens) · 7 · 10 · 13 |
| **An Exotic bow** | **Group Mastery 15**; it starts at 15 with its Technique | **30** | 10 (opens) · 13 |

- **Group Mastery = all the Mastery you have gained with weapons of the group, divided by 3** (rounded down). It replaces Chapter 15's "a third of your highest" when the bows go in.
- **The numbers are set for 5 normal-or-harder fights a level;** a Rest mechanic later can help a slower table (his note; not designed).
- **The Archer's Starting Mastery is 10 with one Projectile weapon** (it was 3), so he has his bow's Technique at level 1. **Claude's reading, his to revert (assumptions):** the head start is not Mastery gained, so it doesn't count toward Group Mastery (an Archer reaches the Advanced rung at level 5 like anyone); it does count for his own bow's unlocks, so his come two levels early (20 at level 3, 30 at level 5, 45 at level 8, 60 at level 11). If he should not have a second unlock in Stage 0, the head start is written as "you have the Weapon Technique of one Projectile weapon" in its place.
- **Assumed with it (not answered, his to revert):** Chapter 15's Expert (Mastery 8) is out for the bows: it is not among his five unlocks. The Hunting Bow's unlocks at 20, 30, 45 and 60 are written with Stage 1 (Blood Trail is the candidate for 20).

**THE HUNTING BOW IS DONE FOR STAGE 0:** its row (Mastery 10 in the last column), Wounding Shot, its ladder's numbers.

### Master and "the level 8 problem" (his question: remove the gating?) PROPOSED, waiting for Lucas

Today (Chapter 15): "15: Master. From level 8, your Actions that deal [W] with the weapon deal one more [W]." Two gates; at a point a fight the Mastery one (15) is passed in level 3, so it does nothing. Claude's answer: yes, one gate, and there are two ways to drop one:

- **A, keep the level, drop the Mastery (Claude's pick):** Master leaves the weapon ladder and becomes a Stage 2 number in Chapter 5 ("From Stage 2, your Actions that deal [W] deal one more [W]", with any weapon). Why: one more [W] is the biggest damage step in the game, and the Bestiary's Stage 2 tables will be fitted to PCs who have it. If it hangs on Mastery, a character who changed weapon group, or a table with fewer fights, reaches Stage 2 without it and faces enemies built for it; and an Archer, 10 ahead, gets it two levels before anyone.
- **B, keep the Mastery, drop the level:** Master is an unlock at a number (35 would be level 8). It rewards staying with one weapon, and it is his sentence as written. Against: the above.

Not a Stage 0 matter either way: nothing is applied now, and it is read again with Stage 2 (One More Arrow, the N[W] cards).

## Decision 9: the Recurve Bow's table row (DECIDED 2026-11-16)

| Name | Group | Properties | Type | Range | Damage | Mastery |
|---|---|---|---|---|---|---|
| **Recurve Bow** | Bows | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [V] 0 / 1 + 1d4! / 1 + 1d6! | 10 |

- **The damage** was decided (decision 4). **The range** 6 / 12 / 18 was kept in decision 1: 2 squares less than the Hunting Bow on every band.
- **What the shorter range has to buy** (the research: less range at the same damage reads as the worse bow): its Technique, which is the next decision. The Hunting Bow's stands still; this one's has to move.
- **Range candidates, for completeness:** 6 / 12 / 18 (Claude's pick: a difference a player feels on a 25-square map; at 6 the Archer is one Advance from an enemy's reach, which is where a moving bow lives); 8 / 16 / 24, the same as the Hunting Bow (then only the Tier 3 die and the Technique differ); 5 / 10 / 15 (the Pistol's normal range: too close to melee for a bow that can't shoot Engaged without being Doomed).

**For Lucas:** the row; A or B for Master.

**Lucas (2026-11-16), before answering the row and Master:** "Cant we make the bows have all the same Mastery numbers? So when you unlock Advanced at 20 Mastery, the advanced weapons starts at 20 then we can keep the ladder equal?"

## Decision 10: one ladder for every bow (2026-11-16: WITHDRAWN as written; way A broke the progression. Replaced by decision 11)

**Yes.** His levels (5, 7, 10, 13) were already the same for every bow; only the Mastery numbers differed (17 / 32 / 47 against 30 / 45 / 60), because a new bow started at a third. If a new bow starts where its rung opens, every bow reads the same five numbers:

| Mastery | About level | A Basic bow | An Advanced bow | An Exotic bow |
|---:|---|---|---|---|
| **10** | 3 | its Technique | | |
| **20** | 5 | unlock 2 | **opens:** its Technique | |
| **30** | 7 | unlock 3 | unlock 2 | |
| **45** | 10 | unlock 4 | unlock 3 | **opens:** its Technique |
| **60** | 13 | unlock 5 | unlock 4 | unlock 2 |

**Two ways to write it:**

- **A, one Mastery number for the group (Claude's pick).** "You have a Mastery with each Weapon Group. When your side wins an encounter that was normal or harder, you gain 1 Mastery with one group whose weapon you made a [Strike] Action with in it." Your Bows Mastery is read by every bow. Group Mastery (the division by 3) is gone, the sheet has one number a group, and "the Advanced bow starts at 20" needs no sentence: it simply reads your 20.
  - **What it changes:** changing bow inside the group costs nothing. At 10 you know the Technique of both Basic bows; at 20 an Advanced bow is as far along as your old one. The choice is which bow is in your hand in this fight, not which one you invested in. (The cost that stays: a bow has fewer unlocks the deeper it is; a swap in a fight is an Interact; two bows are two things carried.)
- **B, a Mastery for each bow, and a new bow starts at the number that opens its rung** (Basic 0, Advanced 20, Exotic 45; a rung opens when one of your bows reaches the number). The ladders are equal and investment stays: a second Basic bow picked up late starts at 0, a second Advanced one at 20. Against: one number a weapon to track, a rule for where each starts, and the late Basic bow that starts from nothing is the case the old "a third" was written to soften.

**Why A:** it is his sentence with the fewest rules (the system's purpose: least ambiguity), and what it gives up, the price of changing bow, is the part of the old tree that needed the most arithmetic. It also answers the research's golf-bag worry no worse than B: in both, a second bow's Technique is one Interact away.

**The Archer's head start under A** ("Starting Mastery 10" would be with the Bows or the Crossbows group): he would be 10 ahead on everything: an Advanced bow at level 3, inside Stage 0, and an Exotic one at level 8. Two ways: **(i) Claude's pick: the head start is the Technique, not Mastery** ("You have the Weapon Technique of one Basic Projectile weapon"): he shoots Wounding Shot at level 1 and is on everyone's levels after; **(ii)** Starting Mastery 10 stays and the Archer is the weapon master, two levels ahead for good.

**Still open from before:** the Recurve Bow's row (its last column would say Basic in place of a number), and Master (A: a Stage 2 number; B: a Mastery unlock).

**For Lucas:** A or B; (i) or (ii) for the Archer; the Recurve Bow's row; Master.

**Lucas's answer (2026-11-16):** "Oh you are right, this breaks the progression idea. Hmmm... I need a mechanic that you get better at a single weapon and you get better at using that type of weapon. For example, at the start, you can use well two basic weapons. The one you use most you unlock features (the 'unlock' part), but using one group helps another, so it should all of that group slowly. After using a basic enough, you should then be allowed to use an Advanced without suffering Doomed. Advanced needs to on level with Basic at that point, so even though the Basic would have its technique plus an unlock etc."

## Decision 11: the Mastery mechanic (DECIDED 2026-11-16: way 1, the group follows at half)

**What he asked for, line by line:**

| His words | The rule it asks for |
|---|---|
| "you get better at a single weapon" · "the one you use most you unlock features" | a Mastery for each weapon; its unlocks read that number |
| "using one group helps another... all of that group slowly" | the other weapons of the group follow the one you use, at a slower pace |
| "at the start, you can use well two basic weapons" | a Basic weapon has no gate |
| "after using a basic enough... allowed to use an Advanced without suffering Doomed" | below its gate an Advanced weapon is Doomed; the gate is passed by using a Basic one |
| "Advanced needs to be on level with Basic at that point, even though the Basic would have its technique plus an unlock" | the day it opens, an Advanced weapon with only its Technique is worth a Basic one with its Technique and an unlock: its row and Technique are a little better, and it stays one unlock behind |
| (earlier) "keep the ladder equal", "I like the round numbers" | every weapon's unlocks on the same numbers: 10, 20, 30, 45, 60 |

**Way 1 (Claude's pick): the group follows at half.** Four sentences:

> **Mastery.** You have a Mastery with each weapon. When your side wins an encounter that was normal or harder, you gain 1 Mastery with one weapon you made a [Strike] Action with in it.
> **The group follows.** Your Mastery with a weapon is never lower than half your highest Mastery with a weapon of its group (rounded down).
> **The ladder.** Every weapon's unlocks are at the same Mastery: 10 (its Weapon Technique), 20, 30, 45, 60. A deeper weapon has fewer of them.
> **Advanced and Exotic weapons.** [Strike] Actions with an Advanced weapon are Doomed while your Mastery with it is below 10; with an Exotic weapon, below 20.

Nothing else: no Group Mastery, no division by 3, no "starts at". The gate is the weapon's own number, and the half-rule is what fills it. **How it plays** (5 fights a level; a character who uses one bow):

| Level (fights) | The bow you use | Every other bow of the group (half) | What that opens |
|---|---|---|---|
| 1 (0) | 0 | 0 | both Basic bows usable, no Technique yet |
| 3 (10) | **10: its Technique** | 5 | |
| 5 (20) | **20: unlock 2** | **10** | the other Basic bow's Technique; **the Advanced bows: no longer Doomed, with their Technique** |
| 7 (30) | **30: unlock 3** | 15 | |
| 9 (40) | 40 | **20** | every other bow's unlock 2; **the Exotic bows: no longer Doomed, with their Technique** |
| 10 (45) | **45: unlock 4** | 22 | |
| 13 (60) | **60: unlock 5** | **30** | every other bow's unlock 3 |

**And one who changes to an Advanced bow the day it opens (level 5) and stays on it:**

| Level (fights) | The Basic bow he left | The Advanced bow | Next to the one who stayed |
|---|---|---|---|
| 5 (20) | 20: Technique, unlock 2 | **10: its Technique** | one unlock behind; a better row and Technique pay for it |
| 7 (30) | 20 | **20: unlock 2** | stayed: unlock 3 |
| 9 (40) | 20 | **30: unlock 3** | stayed: Exotic opens for him now |
| 11 (50) | 20 | 40: the Exotic bows open (half of 40) | two levels after the one who stayed |
| 12 (55) | 20 | **45: unlock 4** (its last) | stayed: unlock 4 at level 10 |

So an Advanced bow has its Technique and three unlocks (10, 20, 30, 45), an Exotic one its Technique and two (20, 30, 45): five, four, three, as in the old tree. Changing bow costs about two levels of unlocks and never resets.

**Way 2: the group follows at a third** (the book's fraction today). The same four sentences. The second Basic bow's Technique and the Advanced bows then come when your bow has 30 (level 7), the Exotic ones at 60 (level 13). Slower than his level 5 and 10: too slow.

**Way 3: the group follows 10 behind** ("never lower than your highest in the group minus 10"). The Advanced bows at level 5 as in way 1; the Exotic gate would be 35 to land on level 10. Easier than halving, but not "slowly": at 60 every other bow is at 50, and nothing is paid for changing.

**Why way 1:** each of his sentences is one of the four; the only arithmetic is halving one number; the sheet holds one number for each weapon actually used. "Half" gives his level 5 for the Advanced bows without a second number, and it gives the Exotic bows at level 9 for the one who stayed (he said 10: one level early; the gate could be 22, but 20 is the round one).

**What it asks of the bows (his "on level"):** an Advanced bow at Mastery 10 = a Basic bow at 20. The Advanced row and Technique carry about one unlock's worth more than a Basic one's, kept small because unlocks are utility (the old tree: +10% on the row). Designed with the Advanced bows.

**Left to settle with it:**
- **The Archer's head start** (decided: Starting Mastery 10). With way 1 his bow is at 20 after 10 fights: the Advanced bows at level 3, inside Stage 0, and every unlock two levels early. Stays as decided unless he says otherwise; the alternative is "you have the Weapon Technique of one Basic Projectile weapon" and no Mastery.
- **Can you gain Mastery with a weapon while it is Doomed?** By the sentence, yes (you made a Strike with it and won). Proposed: leave it; it is a slow, costly way in, and forbidding it is one more sentence.
- Still open: the Recurve Bow's row; Master (A: a Stage 2 number; B: a Mastery unlock).

**For Lucas:** way 1, 2 or 3; the Archer's head start; then the Recurve Bow's row and Master.

**Lucas's answer (2026-11-16):** "1. Way 1. 2. Give 5 mastery to start. Wont give anything first but they will get it earlier. 3. Yes. 4. Didnt understand this one."

**DECIDED:**
- **The Mastery mechanic, way 1** (the four sentences above): a Mastery for each weapon, 1 for a won encounter that was normal or harder; never lower than half your highest in the group; every weapon's unlocks at 10 / 20 / 30 / 45 / 60; an Advanced weapon Doomed below 10 with it, an Exotic one below 20. It replaces decision 8's Advanced and Exotic numbers and Group Mastery. (Exotic at level 9 for the one who stayed, and Mastery gained while Doomed, were shown and not objected to: they stand.)
- **The Archer's Starting Mastery is 5 with one Projectile weapon** (it was 3 in the book, 10 in decision 8): nothing at level 1; his bow's Technique after 5 fights (level 2), its second unlock and the Advanced bows after 15 (the first thing of level 4), each later unlock a level before anyone.
- **The Recurve Bow's row:** Bows · Projectile, Ranged, Strung · Pierce · 6 / 12 / 18 · [V] 0 / 1 + 1d4! / 1 + 1d6!. (The table's Mastery column becomes the rung: Basic.)
- **Master: not understood; explained again in plain words** (the message of 2026-11-16 and the reading page), still open.

## Decision 12: the Recurve Bow's Weapon Technique, Circling Shot (DECIDED 2026-11-16: way 1, with his Tier 3)

**What it has to do.** Pay for 2 squares less range; be the Hunting Bow's opposite (that one asks you to stand, this one moves); be seen on every use; one roll; and copy no Archer card. The Archer's cards that already move: Quick Shots (Evade 2 after), Strafe (an Advance before, up to three creatures), Darting Blade (Evade 2 after the stab), Slip Away (a Reaction), Footwork (movement with no shot), Fleet. **None steps before a shot at one creature** (the old Rolling Shot did, and it is gone), and none moves in the middle of one.

**1, the step before (Claude's pick):**

> **Circling Shot** · Round · 1 AP
> *You circle your foe as you draw, and loose from the side it has left open.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Setup:** You Evade 1.
> **Attack:** Weapon vs. Armor Defense
> **Tier 2:** [V] 1[W].
> **Tier 3:** [V] 1[W] + [Mod]; you Evade 1.

**2, the shot inside the step:** the same bar and Tiers, no Setup, and "**Effect:** You Evade 2. At one point of this Evade, you make this Strike." Step out of cover, loose, step back. The most its own (nothing in the game acts in the middle of an Evade), and the most expensive; it needs its exception written (an Evade is not split).

**3, the close shot:** "**Requirement:** The target is within 3 squares. **Special:** This Action isn't Doomed for your being Engaged." Tier 3 adds Pushed 1. The short bow in a brawl.

### Priced (way 1)

A Weapon Attack is 25 points; an AP is about 12; a Round card's band is 25 to 33.

| Line | Points | Source |
|---|---:|---|
| Setup: Evade 1 | +12 | [Lucas's rate] a compression is the AP it saves; the Evade Basic Action is 1 AP for Evade 1 |
| Tier 2: 1[W], no [Mod] | 20 | [SIM] a Weapon Attack less 45% of 2 damage |
| Tier 3: 1[W] + [Mod] | (in the 20) | |
| Tier 3: you Evade 1 | +3 | [judgment] 27% of an AP |
| No Tier 1 | 0 | a Tier that isn't written does nothing |
| For an Archer: the Setup turns Shifting Aim on for this shot | +3 | [judgment] a Field Boon is about half a point of damage |
| **Total** | **about 35 (38 for an Archer)** | a little over the band, and over Wounding Shot (26 to 33): what the 2 squares of range buy. To bring it down: no Evade on the Tier 3 (32), with a bigger die there instead |

Way 2: 20 + an Evade 2 (about 18) = 38 or more. Way 3: 25 + 3 for the push + [not priced] the Doomed it lifts.

### Analysis

- **The decision it gives.** Where the one square goes: out of a foe's reach (an Evade triggers no Reactions, and a shot from a square where you aren't Engaged isn't Doomed), around a corner into a line, sideways for a foe's cover, or back behind cover on a Tier 3. And the price is on the card: the Tier 2 is the weapon's die alone. A round in which you don't need the step, a Weapon Attack hits harder (1[W] + [Mod]): it is not the button for every round.
- **Its pair.** Wounding Shot: stand, then wound over time. Circling Shot: step, then a light hit now. The same cost and frequency; a different shape. With the half rule a character ends up knowing both, and the bow in hand says how this fight is played.
- **Against the Archer's cards.** Quick Shots moves after and deals 2[W] or 3[W] for 2 AP; this moves before and deals one small hit for 1 AP. For him it also turns Shifting Aim on by itself: an Archer with a Recurve Bow has his Boon on this shot every round (counted above). Slip Away and this are the same idea on two turns (theirs and yours), which is why the Reaction version was dropped.
- **Why not 2.** It is the better picture, but it prices over the band at 1 AP and would be Quick Shots' rival at 2 AP; and it needs an exception to a movement rule on a level 1 weapon. Good material for the Recurve Bow's unlock at 20 ("Circling Shot's Setup becomes: you Evade 2, and you can make the Strike at any point of it").
- **Why not 3.** "Not Doomed while Engaged" is what the Pistol's Technique is set aside for (Chapter 15's note on Point Blank), it makes Darting Blade's job smaller, and it has no movement in it.
- **The rules it touches.** A Setup is optional and the Distance is measured after it (Chapter 2). Evade: no Reactions, 1 square. "A Tier that isn't written does nothing." A Tier 3 adds something (the Modifier and a step).
- **Table feel.** One roll; the bow's thing happens every time, before the dice; a Tier 3 is "step out, loose, step back".
- **The research.** The trick liked most on a weapon is the one that changes how it is played, not its number; a short bow with less range and nothing else is "a dumbed down longbow". This gives the short bow the turn's first move.

### Every candidate, with its reason

| Candidate | Verdict |
|---|---|
| **A step before the shot (Evade 1)** | **the pick** |
| A shot inside an Evade 2 | way 2: later, as an unlock |
| Not Doomed while Engaged, or a close-range Requirement | way 3: the Pistol's; Darting Blade's job |
| A step after the shot | no: Quick Shots' and Darting Blade's Effect |
| An Advance before the shot | no: Strafe's Setup |
| A Reaction that steps or shoots | no: dropped in decision 1; Slip Away and Snap Shot |
| Taunted ("moving side to side to distract") | no: with damage on it, it is the Paladin's Challenge and more, at range |
| Vulnerable ("distract") | no: Trick Shots' Startle, Hit and Run |
| Hindered, Immobilized, Prone, Staggered, Pushed, Slid | no: each is on an Archer card (decision 5's table) |
| Bleed | no: the Hunting Bow's |
| Dazed, Slowed, Sickened, Frightened, Blinded | no: too big for an everyday card, or not a weapon's |
| +1 Speed, a longer Evade, a Boon for moving | no: silent bonuses; Fleet; Shifting Aim |
| Ignoring Difficult Terrain or creatures while moving | no: Footwork's Weave |
| Cover: your Cover one level higher after the shot | no: Spotter's Keep Low |

**For Lucas:** way 1, 2 or 3; in way 1, the Tier 2 without [Mod], and the name.

**Lucas's answer (2026-11-16):** "1, but: Tier 3: [V] 1[W] + [Mod]; Evade 1 but you can't Evade away from the target. This fits the circling part. Setup you can, but the attack you cant." **CIRCLING SHOT IS DECIDED:**

> **Circling Shot** · Round · 1 AP
> *You circle your foe as you draw, and loose from the side it has left open.*
> Weapon · Ranged · Projectile · Strike
> Distance: Weapon | Target: One creature
> **Setup:** You Evade 1.
> **Attack:** Weapon vs. Armor Defense
> **Tier 2:** [V] 1[W].
> **Tier 3:** [V] 1[W] + [Mod]; you Evade 1 to a square that is no farther from the target.

**The wording of his limit (Claude's, for his check):** "to a square that is no farther from the target" and not "not away from the target", because the book's Moving Away (Chapter 2) is written for Reactions and says an Evade is never "moving away". "No farther" uses the same count (distance in squares, larger after than before), so a sideways or a closer square is allowed and a farther one is not. The Setup's Evade is free in any direction, as he said. A side effect worth knowing: the Tier 3's step takes you out of your square, so an Archer's next shot has Shifting Aim's Boon. Price: about 34 (the Tier 3 step is worth a little less than a free one).

**THE RECURVE BOW IS DONE FOR STAGE 0** (row, Circling Shot; its unlocks at 20, 30, 45 and 60 are written with Stage 1; the shot inside an Evade 2 is the candidate for 20).

## Decision 13: Master is dropped; Stage 2's hitting goes to the Modifiers (DECIDED 2026-11-16)

**Lucas (2026-11-16):** "Master: Hmm... What if we drop it, and instead either make the flat number of weapons raise, or double the exploding die only at Stage 2? At least players will feel some progression and fighting a lower Stage enemy will feel good, seeing the 'progression'."

**Agreed: Master goes** (one more [W] doubled a weapon's damage in one step, on a gate that no longer works). What each replacement does, average damage of 1[W] on a Tier 2 / Tier 3 (a d4! averages 3, a d6! 4, a d8! 5):

| Weapon | Today | Master (2[W]) | **A:** flat +2 | **B:** the die twice | **C:** the die one size bigger |
|---|---|---|---|---|---|
| Hunting Bow (1 + 1d4! / 2 + 1d4!) | 4 / 5 | 8 / 10 | 6 / 7 | 7 / 8 | 5 / 6 |
| Dagger (2 + 1d4! / 4 + 1d4!) | 5 / 7 | 10 / 14 | 7 / 9 | 8 / 10 | 6 / 8 |
| Longsword (2 + 1d6! / 4 + 1d6!) | 6 / 8 | 12 / 16 | 8 / 10 | 10 / 12 | 7 / 9 |
| Greatsword (5 + 1d6! / 8 + 1d8!) | 9 / 13 | 18 / 26 | 11 / 15 | 13 / 18 | 10 / 14 |
| Greataxe (4 + 1d6! / 10 + 1d8!) | 8 / 15 | 16 / 30 | 10 / 17 | 12 / 20 | 9 / 16 |

- **A, the flat number rises (Claude's pick).** No new die, nothing slower; it is his "try flat" direction; N[W] counts it N times, cleanly (Quick Shots' 3[W]: +6). The same amount on every weapon helps the small ones most (the bow +50%, the Greatsword +22%), so the amount is fitted by kind when Stage 2 is written (as the melee +4 / +2 was). Least ambiguity: **the weapon table prints a second damage column for Stage 2**, so nobody adds anything at the table.
- **B, the exploding die is rolled twice.** The most felt: twice the dice, twice the explosions. Against: it undoes "one die a hit" (the reason for the flat table), Quick Shots' Tier 3 becomes six exploding d4s, and die-heavy weapons (Axes, Firearms) pull ahead of flat-heavy ones (Hammers, Crossbows).
- **C, the die grows one size** (d4! to d6!, d6! to d8!, d8! to d10!). Seen in the hand, no extra die; only +1 a [W], so it would need a flat point with it.
- **A variant of A, his to weigh:** a smaller rise at every Stage (+1 at Stage 1, 2 and 3) in place of one step at Stage 2: progression felt three times, and a lower-Stage enemy always a little softer.

**Why A:** both his goals (progress the player sees on the sheet; a lower-Stage enemy that falls faster) with no extra rolling, and it keeps weapons as the decided table made them. **Nothing is applied or numbered now:** the size is fitted with Stage 2's Bestiary; the book's Master line stays until then, marked to go.

**For Lucas:** A, B or C (and one step at Stage 2, or a little each Stage).

**Lucas (2026-11-16):** "If its just a +2, is it actually worth it? Isnt it better to just focus in the modifiers then? Or maybe forget about it? I do want Stage 2 to feel strong against Stage 0, if the system currently already does it, then we drop it, otherwise it would be good to do so."

**Checked (Chapter 5's Stage table; `calc.mjs`, a Weapon Attack against Defense 13, which doesn't change with the Stage):**

| What a Stage 2 character has over a Stage 0 one | Today, without Master |
|---|---|
| Hitting | **only Stage 1's +1 Modifier**, if it went to the Weapon Modifier. Stage 2's own Modifier cell is empty |
| Health | the class's Stage 1 and Stage 2 steps (the Paladin's Stage 2 step alone is +12 / +6 on 20 / 10): about double |
| Guard for an unspent AP | 3 (2 before) |
| Rally Points | Rally + 3 (Rally + 1 at Stage 0) |

| A Weapon Attack, against Stage 0's | Hunting Bow | Greatsword | Tier 1 / 2 / 3 |
|---|---|---|---|
| Stage 0 (Modifier +2) | 4.6 | 9.0 | 28% / 45% / 27% |
| Stage 2 today, without Master (+3) | 5.8 (×1.25) | 10.6 (×1.18) | 22% / 46% / 32% |
| with flat +2 on the weapon | 7.3 (×1.59) | 12.2 (×1.35) | the same |
| with one more Modifier point (+4) | 7.0 (×1.53) | 12.3 (×1.37) | 17% / 47% / 37% |
| with Master (2[W]), as the book has it | 9.2 (×2.00) | 18.9 (×2.10) | 22% / 46% / 32% |

**The answer:** the system already makes a Stage 2 character much harder to kill than a Stage 0 one (about twice the Health), and **barely harder-hitting** (×1.2, all of it from Stage 1). So "strong against Stage 0" is half there: something for hitting is worth having at Stage 2. **And his instinct is the better tool: a Modifier point does what the flat +2 does** (×1.5 on a bow, ×1.4 on a Greatsword), and more: it also lifts Power Actions (a flat number on weapons leaves a class that fights with Power cards behind), it is seen on every roll (a Tier 1 falls from 28% to 17%: "I rarely miss these"), it needs no weapon rule, and the Stage table has the empty cell for it.

**PROPOSED:** **Master is dropped and weapons get nothing in its place.** Stage 2's hitting is a question for Chapter 5's Stage table, with Stage 1 and 2: logged in `rules-backlog.md` with this table. The one thing to solve there: "a Modifier is never above +4" and Stage 3's "+1 to both" (a Weapon Modifier of +2, +3 at Stage 1, +4 at Stage 2 would have nothing left at Stage 3); a candidate: +1 to one Modifier at each of Stages 1, 2 and 3, never above +4.

**For Lucas:** yes to that (Master out, nothing on the weapons, the Modifier question logged for the Stages)?

**Lucas's answer (2026-11-16):** "I think we should do: +1 to one at Stage 1; +1 to both at Stage 2. For Stage 3, we can plan something else. Log this because this is for the future, but lets drop Master for weapons. Lets do Light property." **DECIDED: Master is dropped for weapons; nothing on the weapons in its place.** For the future, logged in `rules-backlog.md` (the top entry): Stage 1 +1 to one Modifier, Stage 2 +1 to both, Stage 3 something else.

## Decision 14: the Light property in full (DECIDED 2026-11-16: way 2, the second weapon; the wording below waits for his check)

**What exists.** Chapter 15 (minimal, since the Archer): "A Light weapon is a small melee weapon held in one hand, quick to draw and to put away, such as a Dagger. Some Actions need one (the Archer's Darting Blade)." The Dagger has it. Cards that name it: Darting Blade, Hit and Run. Decided on 2026-10-31 and never applied: an off-hand Bane of 2 on Weapon Actions, 1 for light weapons; "Daggers (light)" as a group of their own. The book today: "Which hand holds a weapon changes nothing in the rules, unless a feature says so."

**The research** (`weapons-bows-light.md`, Q2): in five of the seven games read, "light" is a pairing rule: it says what a second weapon in the other hand does (an extra attack, a smaller penalty on later attacks, permission for powers). Free draw is nobody's Light property: where drawing is cheap it is cheap for every weapon. The rapier and the club are the edge cases of where light stops.

### Three ways

**1, the sidearm (Claude's pick): Light is the weapon that comes to hand.**

> #### Light
> A **Light** weapon is a small melee weapon you hold in one hand, such as a Dagger or a Handaxe. A Light weapon is never Two-handed or Long.
> **Quick to hand.** Once on each of your turns, you can draw or stow a Light weapon without using the Interact Action. You still need a free hand to draw it.
> Some Actions need a Light weapon, such as the Archer's Darting Blade.

**2, the second weapon: Light is the weapon for the other hand.** The 2026-10-31 decision brought in: Weapon Actions with the weapon in your off hand take 2 Banes, 1 with a Light weapon (a Strung weapon only when your main hand holds something). It is what "light" means in most games. Against: it adds a penalty the book doesn't have (today two weapons cost nothing), and with it main hand and off hand to every sheet, for a way of fighting no card pays for yet.

**3, a tag only:** today's text, with the list of weapons. Nothing to learn; Light then does nothing outside the Archer's two cards, which is what he asked to go beyond.

### Which weapons

| Weapon | Light? | Why |
|---|---|---|
| **Dagger** | yes (it has it) | the model |
| **Handaxe** | **yes** | one hand, small, thrown; light in every game read. It gives a second Light weapon with another shape (2 + 1d4! / 2 + 1d8!, a swingy Tier 3, against the Dagger's 2 + 1d4! / 4 + 1d4!), so Darting Blade has a choice |
| Mace, Longsword, Spear | no | one-handed, not small: the full-size weapons |
| Knuckle Dagger | no | Barehanded: it is never drawn or stowed, so "quick to hand" means nothing for it, and Darting Blade's "draw a Light weapon" couldn't use it |
| Fists | no | not drawn; Non-threatening |
| Hand Crossbow, Pistol | no | Light is a melee property (the Setup of Darting Blade relies on it) |
| Later (the Blades and other groups' passes) | | a short sword, a sickle, a club, a light hammer: yes; a rapier: no (the research's test case: quick, not small) |

### Analysis (way 1)

- **What it does beyond Darting Blade.** For every class, a Light weapon is the sidearm: the Paladin who drops to a knife in a doorway, the bow-user who isn't an Archer (turn one: draw free, stab; turn two: stow free, shoot; the Archer's card does both in one). It is the book's old Expert unlock (Mastery 8, removed from the bows) given to the weapons it suits, with no Mastery.
- **Priced.** An AP (about 12 points) on a turn you change weapon; nothing on the others. [judgment]; Lucas's rate for a compression.
- **The golf bag** (the research's warning: a trick a weapon plus free draws). Limited three ways: once a turn; only Light weapons; and a second weapon's Technique needs its own Mastery (half your best in the group, and nothing from another group). A character who throws a Dagger and draws the next for free each turn is making a thrown attack at 1 less damage and range 4: allowed, and not better than a bow.
- **With Strung.** A Light weapon in your other hand is "something held": the bow's Strikes take 3 Banes while it is out. No exception for Light: that cost is why Darting Blade puts the knife away again.
- **Darting Blade, read again with Strung** (a decided Archer card; his call). Its Setup says "You stow your bow and draw a Light weapon", written when a bow took two hands. A Strung bow stays in its hand. The card works as written (stowing the bow is allowed, only not needed); the shorter text would be "**Setup:** You draw a Light weapon." and "**Effect:** You Evade 2, then can stow that weapon." Flavor to match: "You shift the bow to one hand, open a foe with the knife, and are gone before it turns."
- **Why not 2 now.** The pairing rule is the right home for two-weapon fighting, and it belongs with the Blades pass and the cards that will pay for it (the set-aside Ambidextrous Talent). One note for then: "a Strike with the other weapon is cheaper after a Strike with the first" is already the Archer's Blade and Bow. The 2026-10-31 off-hand decision stays parked, not withdrawn.
- **Every other thing Light could do, with its reason:** a smaller At-will Bane (a silent bonus, and it makes the Dagger the weapon to spam); an extra Weapon Attack with the second weapon (a multi-roll flurry); hidden on your person (a good one, waits for the Skills design); usable while Grabbed (the rules don't stop any weapon there, so nothing to lift); no Banes on a Strung bow while you hold it (erases Strung's cost); a damage rule ("a Light weapon's die is a d4": true of both today, but the Handaxe's Tier 3 is a d8, and a table can say it better than a rule).

**For Lucas:** way 1, 2 or 3; the Handaxe as Light; Darting Blade's shorter text, or as it is.

**Lucas's answer (2026-11-16):** "1. Lets do 2. 2. Add but all weapons except the bows we just made are 'place holders', not even that technically. Those were made just to playtest and fill space. 3. Yes, but: 'You Evade 2, then can stow the Light weapon you've drawn.' Prevent as much ambiguity as possible."

**DECIDED:**
- **Light is the second weapon (way 2):** the off-hand Banes come into the book, and a Light weapon takes fewer. No free draw.
- **The Handaxe is Light,** with the Dagger. **Every weapon in Chapter 15 except the two bows made here is a placeholder** (his word: made to playtest and fill space): their rows, properties and Techniques are not design, and are not to be argued from. The book says so when the bows go in.
- **Darting Blade** loses "stow your bow", with his Effect line.

### The texts, written out (Claude's wording of his decisions, for his check)

> **Hands** (Chapter 15; it replaces "Which hand holds a weapon changes nothing in the rules, unless a feature says so.")
> You have two hands: your **main hand** and your **off hand**. You choose which is which when you make your character. [Strike, Weapon] Actions with a weapon you hold in your off hand take **2 Banes**. A weapon you hold with both hands doesn't take them.

> **Light**
> A **Light** weapon is a small melee weapon you hold in one hand, such as a Dagger or a Handaxe. A Light weapon is never Two-handed or Long. In your off hand, a Light weapon takes **1 Bane** instead of 2. Some Actions need a Light weapon, such as the Archer's Darting Blade.

> **Strung**
> You hold a **Strung** weapon in one hand and draw it with the other: [Strike, Weapon] Actions with it take **3 Banes** while your other hand holds something. A Strung weapon in your off hand takes the off-hand Banes only while your main hand holds something.

> **Darting Blade** · Round · 1 AP
> *You shift the bow to one hand, open a foe with the knife, and are gone before it turns.*
> Weapon · Melee · Strike
> Distance: Reach | Target: One creature
> **Setup:** You draw a Light weapon.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [V] [Mod].
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod]; Staggered (EoT).
> **Effect:** You Evade 2, then can stow the Light weapon you've drawn.
> **Special:** You make this Strike with a Light weapon you hold. *(Claude's addition, for his yes: the card never said which weapon strikes; without it the Fists or a Longsword in hand could.)*

**The cases, so none is left to the table:**

| You hold | The Strike | Banes |
|---|---|---|
| a bow in your off hand, main hand free | with the bow | 0 (how an archer stands) |
| a bow in your off hand, a Dagger in your main hand | with the Dagger | 0 |
| | with the bow | 3 (Strung) + 2 (off hand) = 5 |
| a bow in your main hand, a Dagger in your off hand | with the Dagger | 1 (Light, off hand) |
| | with the bow | 3 (Strung) |
| a Longsword in your main hand, a Dagger in your off hand | with the Dagger | 1 |
| a Dagger in your main hand, a Longsword in your off hand | with the Longsword | 2 |
| a Greatsword in both hands | with it | 0 |
| a Longsword in your main hand, your off hand free | with your Fists | 1 (below) |

**Small rulings that come with it (Claude's defaults; his to revert, listed as assumptions):**
1. **Fists:** they use a free hand; with only your off hand free they take 1 Bane, as a Light weapon does (his word of 2026-10-31: "the Fists are light: 1"). They don't get the Light property (nothing to draw; Darting Blade can't use them).
2. **Which hand is the main one** is chosen at character creation and doesn't change.
3. **Drawing** puts the object in a free hand you choose; **Regrip** (1 AP) already moves a weapon to the other hand or swaps the two.
4. **A thrown weapon** thrown from the off hand takes the off-hand Banes like any Strike with it.
5. **Hit and Run** needs no change: it draws and stows both weapons freely, so each hit can be made from the main hand, the bow's with the other hand empty.
6. **NPCs** have no hands rule (they have no Weapon Attack).
7. The Talent that removes the off-hand Banes (the set-aside Ambidextrous) and anything that pays for fighting with two weapons: the Blades pass.

**For Lucas:** the texts; Darting Blade's Special line; rulings 1 and 2. Then his word to put the bows and Light into the book.

**Lucas's answer:**

## The whole pack so far: what is decided (2026-11-16, before applying)

**Mastery** (replaces Chapter 15's): a Mastery for each weapon; when your side wins an encounter that was normal or harder, 1 Mastery with one weapon you made a [Strike] Action with in it; never lower than half your highest Mastery with a weapon of its group; every weapon's unlocks at 10 (its Technique), 20, 30, 45, 60, fewer on a deeper weapon; an Advanced weapon's Strikes Doomed below 10 with it, an Exotic one's below 20. Expert and Master are gone for the bows (Master for all weapons). The Archer's Starting Mastery: 5 with one Projectile weapon.

| Name | Group | Properties | Type | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| **Hunting Bow** | Bows | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [V] 0 / 1 + 1d4! / 2 + 1d4! | Basic |
| **Recurve Bow** | Bows | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [V] 0 / 1 + 1d4! / 1 + 1d6! | Basic |

**Wounding Shot** (Hunting Bow, Mastery 10) · Round · 1 AP · Weapon, Ranged, Projectile, Strike · Distance: Weapon | Target: One creature · Requirement: You haven't left your square this turn. · Attack: Weapon vs. Armor Defense · Tier 1: [V] [Mod]. · Tier 2: [V] 1[W] + [Mod]; Bleed 1 (Bo/In). · Tier 3: [V] 1[W] + [Mod]; Bleed 2 (Bo/In). · *You hold your ground until your foe shows its flank, and put a broad-headed arrow where the wound will not close.*

**Circling Shot** (Recurve Bow, Mastery 10) · Round · 1 AP · Weapon, Ranged, Projectile, Strike · Distance: Weapon | Target: One creature · Setup: You Evade 1. · Attack: Weapon vs. Armor Defense · Tier 2: [V] 1[W]. · Tier 3: [V] 1[W] + [Mod]; you Evade 1 to a square that is no farther from the target. · *You circle your foe as you draw, and loose from the side it has left open.*

**Hands, Light, Strung, Darting Blade:** the texts above. **Light weapons:** Dagger, Handaxe (placeholders, like every weapon but the two bows).

**Not written, on purpose:** the bows' unlocks at 20, 30, 45 and 60 (candidates: Blood Trail; the shot inside an Evade 2); the four later bows; the Stage Modifiers (rules-backlog). **To close when applied:** "left your square" for a creature bigger than one square (Chapter 3).

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
