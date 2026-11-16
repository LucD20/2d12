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
