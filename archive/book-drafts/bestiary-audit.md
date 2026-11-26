# The Bestiary audit (2026-11-18, v0.0.433)

Lucas: "After we are done with this step, we do a bestiary audit." Three independent readers went through `rules-src/14-bestiary.md`, its
cards (`cards/bestiary.json`), the ruler and Foundry, each with one lens: **the numbers** (every table, example and CV recomputed with the
system's own functions), **the rules text** (read cold as a GM: ambiguity, contradictions with this week's rule changes, gaps at the table) and
**Foundry against the book**. Claude checked the findings that were fixed against the files. 59 findings, with overlaps: below, what was
fixed, then the questions (each with Claude's recommendation; "all defaults" is an answer), then what is left.

## Fixed (v0.0.433)

**In Foundry (the book was right):**
- **Minions never shared a turn slot.** Foundry gave a squad one Initiative roll, but the turn order then put a PC between each Minion (three
  Minions at 15, PCs at 14 and 12, an Orc at 10 came out M1 P1 M2 P2 M3 Orc). A squad is now one turn of its side: M1 M2 M3, P1, Orc, P2
  (`combat.mjs zipper`).
- **A Minion's effects ended at the wrong turn.** A slot was found by its Initiative number, which the squad shares: Hindered (EoT) on the third
  Minion ended when the first one's turn ended, and a "1 round" effect ended a round early. EoT now ends at the creature's own turn in a shared
  slot, and rounds count down at the end of its last creature's turn (`effects.mjs durationStep`; it also fixes two creatures tied on
  Initiative).
- **An NPC Down on more Nonlethal damage stayed up** (still threatening, flanking and taking turns): it now falls Unconscious; on equal damage
  the GM picks Dead or Unconscious in a pick window (`twod12.mjs checkDead`).
- **Avenge Kin** is now offered by itself in the Reactions message (its card had no moment).
- **An Elite built by hand had no Escalation**: setting the rank to Elite turns it on (at 1), leaving Elite turns it off.
- **The ladder's words on the sheet and the effect settings**: Pressing, Relentless, Second Wind; "twice per turn-cycle".
- **The Builder at Stage 0**: the old notes from pack R (conditions "cost a column", Vs. WD "uses the Power Modifier"...) are hidden; the best
  turn says "damage only: riders and shares not counted". A Grunt's AP in the old role table is 3; stale comments in `config.mjs`.

**In the book (one right answer):**
- "Deals about" at Stage 0: a Standard 10 (was 9), an Elite 14 (13); a turn without moving deals about a third more (a quarter).
- A 2 AP Encounter Action against one PC "takes most of a PC's Health" (about 24 on a Tier 3 for a Standard), not "full to Down": that is an
  Elite's or a 3 AP one.
- The encounter table: an easy fight puts a PC Down about 1 fight in 25 (was "30 or more"); a deadly one costs 60 to 70% and is won 82 to 88%;
  Momentum 2's "a quarter less" holds at levels 2 and 3 (a tenth at level 1); a level 3 party at Momentum 4 wins the deadly fight 97%.
- "A turn of Basic attacks only is well under the budget" holds for a 4 AP rank only (a 3 AP rank reaches it in points).
- Defense: one rating up is 2 points, 1 from Terrible to Low.
- **Special Action** is defined (every Action but the Basic attack); the glossary points there.
- **Distance**: an NPC's melee Action has Distance Reach (X), a ranged one its squares (decision A4, written down).
- An NPC's Modifiers set its rolls **and its DCs**; an area Save Action uses the DC of its traits (Weapon DC, Power DC, an Attribute's DC).
- A rider in the price table with no duration is priced for EoT (write it: a condition with no duration lasts the encounter); a Lingering ends
  with Shake Off (1 AP and a Save) or the encounter.
- "Hit" retired from the Reaction examples (Q21): "takes damage from a [Strike] Action", "deals damage to you".
- Minor enemies are the Minion and Grunt **ranks** (a Standard of an earlier Stage, CV 80, isn't one); their **damage** dice never explode; an
  NPC of an earlier Stage counts less by its Stage (v0.0.434: an NPC does have a level; see question 10).
- Ranged attacks: "with Medium damage, its ranged attack uses the Low points" (not "a Medium creature").
- The roles: a rating a role doesn't name keeps the rank's default (not always Medium: a Power Modifier is Low by default).
- The Minions' squad "takes one place in its side's turn order"; the Elite's "no Momentum and no Critical hook" spelled out; "the NPC sheet's
  switch" (a Foundry word) removed; the Grave Wisp's turn budget printed; "Healing an NPC is weak"; links (Collision, Save Actions, Elite
  Escalation, The Basic attack).

## Lucas's answers (2026-11-18), applied in v0.0.434
- **4:** "just write like any normal Action, adding the frequency. NPCs dont have 'set actions', they have numbers to help balance. They can have turn reactions, at-will reactions, encounter reactions etc": an NPC's Reaction is written with its Frequency and priced by it (a Turn or At-will one as a Round one: its AP is the limit; Claude's choice); "An NPC has no set list of Actions."
- **7:** "NPCs should have all basic actions too": every Basic Action is theirs, except Weapon Attack and Fists (the Basic attack takes their place: his playtest 2 decision, which Foundry follows) and Steel Yourself (no Rally Points).
- **10:** "Didnt we make NPCs have levels? ... how complex their actions are, they might have some more high numbers than normal, some more actions than normal etc. ... there is no limit on how many actions an npc should have": yes (Foundry's NPC sheet has a Level that sets its Stage); written in the Ratings section, and the line "it has no level" from v0.0.433 is undone.
- **12:** "Do [Strike]": Pressing is "1 Boon on its first [Strike] Action each turn-cycle"; "next attack" became "next [Strike] Action" (the help table, the help rider). Foundry follows.
- **7 (again, 2026-11-18):** "NPCs have Fist, in case they have Weapon attacks, they require the weapon still ... if the NPC loses their weapon, they make fists strikes. If they get another weapon that doesnt fit according to the GM, the GM can make necessary changes in middle of the combat ... if its the same kind (a sword, longsword or montante doesnt matter), no need to change": Chapter 14 "Losing its weapon"; an NPC's [Weapon] Actions need the weapon its entry describes (this replaces question 2's "it needs no weapon"); Fists only without a weapon that fits; Foundry gives NPCs Fists again.
- **"Rest default" (v0.0.435):** every other question at its default, written in Chapter 14 (and Chapter 3's Flying box, Chapter 6, the glossary): 1, 2 (with 7), 3, 5, 6, 8 (the Ogre is Large (4)), 9, 11, 13 to 29. **Not done:** 30 (moving the ruler's Stage 0 NPCs to the points table and re-running it: its own pack, the reports change). **One thing the defaults didn't settle:** with 18's line ("a fast creature's downside pays for its Speed"), the example NPCs still don't add up to their printed CV: the Goblin Sneak 22.5, the Orc Warrior 92.5 and the Ogre Chieftain 185 (each has a Low Ward Defense), the Grave Wisp 107.5 (its Terrible Vigor no longer counts, its High Resolve does). A question for Lucas: (a) an NPC within half a step of its rank's CV counts as its rank's (no stat changes; Foundry rounds too), or (b) change four example stats (the Sneak's, Orc's and Ogre's Ward Defense to Medium, the Wisp's Resolve to Medium).

## Questions for Lucas (each with Claude's recommendation)

**Running NPCs at the table**
1. **Do NPCs threaten and flank?** Threatening needs "a Melee weapon's normal range" and its Weapon Attack; an NPC's weapon is flavor and it
   has no Weapon Attack, so read literally no NPC threatens (goblins never flank). *Default:* "An NPC threatens every enemy within the Distance
   of its melee Basic attack (Reach (X)) while it could use it; one whose Basic attack is ranged threatens no one." (Foundry already reads it
   this way.)
2. **An NPC Action's Melee / Ranged trait without a weapon** (the [Weapon] trait "requires a weapon"; is the Wisp's touch Melee?). *Default:*
   "A melee NPC Action has the Melee trait, a ranged one the Ranged trait; it needs no weapon: its Weapon or Power trait only names the
   Modifier it rolls."
3. **Do NPCs get Guard from unspent AP?** Chapter 2 gives it to "you"; the SIM that measured the CVs gives NPCs none; Foundry gives it to all.
   *Default:* "An NPC gains no Guard from unspent AP: an AP it keeps only pays a Reaction" (matches the measured CV; Foundry would follow).
4. **An NPC's Reaction has no Frequency** (an Orc that kept 1 AP could Avenge Kin twice). *Default:* "An NPC's Reaction is Round unless its
   entry says otherwise" (its price assumes it), and Watchful becomes "a second Reaction AP, and each of its Round Reactions twice per
   turn-cycle".
5. **Can a Minion have a Reaction?** "No Reaction AP" doesn't stop a 0R or a kept AP. *Default:* "Minions have no Reactions."
6. **A Minion going Down:** "a Minion has no Dying: at 0 it dies, or Unconscious if the GM prefers" contradicts Chapter 4 (no NPC is Dying;
   Lethal or Nonlethal decides). *Default:* drop the exception: Minions go Down as every NPC.
7. **Which Basic Actions does an NPC have?** Shove and Trip are Strikes outside its budget (a Prone for 1 AP); Fists, Steel Yourself.
   *Default:* "An NPC's Basic Actions are the ones that move it or handle things (Advance, Charge, Crawl, Evade, Stand, Break Free, Interact,
   Shake Off, Hide); what it does to a PC is on its own cards."
8. **Size and Steadiness** are never set or priced (is the Ogre Large? its Ground Slam's 2 Emanation would cover far more). *Default:* "An NPC
   is Medium unless its entry says otherwise; Size and Steadiness are free, like Speed (price an area around a larger creature as the area it
   really covers)"; the Ogre gets a Size.
9. **Flying** (the Wisp "flies") has no rules. *Default:* a to-be-decided box in Chapter 3, and "it hovers" on the Wisp for now.
10. **An NPC's level** where a rule uses one (Squeezing's "half their level"). *Default:* "an NPC's level is the first of its Stage".
11. **Dice that never explode on a Minor enemy**: an Empowered die too? (Foundry enforces neither.) *Default:* yes, the Empowered die included;
    Foundry follows.

**The Elite's steps (new this week)**
12. **Pressing:** "its first attack each round": "attack" isn't a rules word; a Save Action? a Reaction? *Default:* "its first Action each
    turn-cycle that rolls against a creature (not a Save Action) has 1 Boon" (Foundry's reading); "next attack" elsewhere becomes "next
    [Strike] Action".
13. **Relentless:** does it double a Round Reaction, and does a second Rally the Tribe add a second Boon? *Default:* "each of its Round Special
    Actions, not its Reactions; using the same Action again doesn't add to its effect on a creature that still has it."
14. **Second Wind** when the Encounter Action wasn't used yet. *Default:* "each Encounter Special Action can be used once more this encounter,
    used or not."
15. **Shrugs It Off:** before or after it regains AP; which conditions. *Default:* "at the start of each of its turns, before it regains AP, it
    ends one condition of Chapter 8 on itself (not Bloodied, Strained, Desperate, Dying, Shattered or Unconscious)."
16. **Swift:** "ignores Difficult Terrain" would let it walk through the PCs' squares and Frightened's squares. *Default:* "the ground's
    Difficult Terrain (rubble, snow, undergrowth) is normal terrain for it."
17. **Should other ranks have Escalation?** The book says only Elites; Foundry offers the switch to every rank. *Default:* Elites only (the
    switch stays for the GM's own monsters).

**The prices and the CV**
18. **The example NPCs' CV (Q35) and the Soldier and Skirmisher roles** count −½ step by the CV rule (a Standard at 92.5), though the book
    says they are balanced (the SIM measured them balanced with their Reaction or their Speed). *Default:* one line: "a Soldier's or a
    Skirmisher's Low Health pays for its Reaction or its Speed, and a fast creature's downside for its Speed: they count at the rank's CV";
    the examples keep their printed CV.
19. **An Elite's Extreme Modifier** is +4, as its High (the cap), yet counts half a step more. *Default:* "+4 (the cap: counts as High)".
20. **"Check its best turn": before or after the shares?** The Orc counts 55 + 25 + 25 = 105 before Avenge Kin's share; counted so, the Ogre is
    153 against a cap of 151.8 (1 point over); after Ground Slam's pay-back, about 115. *Default:* "count each Action at its full price, before
    riders, the Reaction's share and any pay-back", and "up to 15% over, rounded" (the Ogre's 153 is at its limit).
21. **The order of a share and the riders** (the ruler takes the share off what the riders leave). *Default:* write the ruler's order.
22. **Rounding:** printed prices and budgets are rounded from unrounded products (a 3 AP Encounter is 173, not 2 × 86; Avenge Kin's third is
    9 for 28 ÷ 3 = 9.3). *Default:* one sentence: "prices are worked out before rounding, and round to the nearest".
23. **The CV step for an NPC of an earlier Stage** (80 + 2 × 15, or scaled?). *Default:* the step doesn't change with the Stage (Foundry's way).
24. **An Effect line is priced like a hit rider**, though it always happens (the Setup costs one size more for that reason). *Default:* the
    Effect line costs one size more, like the Setup.
25. **"A condition that a Save can't shake off is one size more"** points to a rule that doesn't exist. *Default:* drop "or that a Save can't
    shake off".
26. **Ranged attacks of a Terrible damage rating** have no lower rating, and the best turn's budget for an all-ranged creature. *Default:* a
    Terrible ranged attack uses 0.5 of the points; its best turn is checked against its ranged rating's budget.
27. **Walls, lasting areas and Hazardous Terrain** aren't priced. *Default:* a to-be-decided box.
28. **Rally the Tribe has no price**, and Escalation-line Actions' cost is unclear ("they spend nothing"). *Default:* "Escalation-line Actions
    come with the Escalation, like the steps: they spend no Escalation and cost their AP."

**Data**
29. **Rally the Tribe's [Focus] trait** is on its card only. *Default:* drop it (the book's entry has none).
30. **The ruler's Stage 0 NPCs** still use the old damage-only rows (`config.mjs npcStage0`), and its Grunt Reaction measurement uses a Grunt
    that no longer exists (17 / 24 points; the chosen Grunt has 25). *Default:* move the ruler to the points table and re-run (its reports
    change on purpose); until then they stand as the old yardstick.

## Left (no question; later work)
- Foundry: the Builder's best turn counts damage only (riders, shares and pay-back not counted); its price table has four rows (no 2 AP
  Encounter, no 3 AP for Minions, no several-creatures or pay-back switch, no price for "!"); Dirty Trick's and Rally the Tribe's Boons are
  words, not buttons; the Grave Wisp's flying isn't on its token; Relentless also doubles Round Reactions (waits for question 13).
- The book: each example NPC's bullet doesn't list its traits ([Melee, Strike, Weapon]) nor Avenge Kin's Frequency and Target (waits for
  questions 2 and 4); "Vs. AD / Vs. WD" against the glossary's "Vs." (names an Attribute); `bestiary.json` still carries the deprecated Bandit
  Thug's two cards.

## The example NPCs' CV: decided (v0.0.436)

Lucas: "(a), round within half a step." Chapter 14: half a step or less, either way, counts as none; Foundry follows. The four examples, the Soldier and the Skirmisher are worth their rank's CV with no stat changed.
