# The book audit (2026-11-18, v0.0.427)

Lucas: "I think the links in the book are broken. Audit the book you haven't." Three independent readers (Chapters 1-4 and the glossary;
Chapters 5-8, Species, Gear, the Bestiary and their cards; the Paladin and the Archer and their cards), 60 findings, each checked against the
text. Also a link check of the built documents.

## The links (fixed)

- **What was broken:** inside another page's frame (the Claude app's viewer, a published page), a `#...` link resolved against that page's
  address and reloaded the frame instead of scrolling. Opened directly from the folder, the links worked (676 links, all with a target).
- **The fix:** the book's script now handles every link to a place in the same document: it opens the chapter or card around the target and
  scrolls there itself (`build_rules.py`, the `js`). Checked in Chromium: all 670 document links land on their target, also inside a frame.
  Links to another document (`gear.html#...`) still need the six files side by side.
- **Links that landed on the wrong place:** the weapon property Light, Reload and the Fists weapon went to Chapter 3's Light, the Reload card
  and the Fists card (Gear's headings are now "Light (property)", "Reload (property)", "Fists (the weapon)"); the Bestiary's "see Steadiness in
  Chapter 3" and "see Reactions" went to its own sections ("An NPC's Steadiness", "NPC Reactions"); 11 links to a Basic Action went to the top of
  Chapter 6 instead of the card; the glossary's Encounter, Chapter 3's "What a Reaction Responds To".

## Fixed in the text (already decided, stale, or wrong references)

Chapter 1: Empowered's value on a Save (now: its 1d6! goes to one creature); two pools joined with ";" (a rider) now "+"; the Save notation
"[R] 1d6 / 1d4 / 0 Ho"; the notation table's "Escalation 3" (the rungs are 2, 4, 6). Chapter 2: the rounds countdown (line 301 now says what
Lucas decided on 2026-11-06 and line 312 already said: the slot in which it was applied); the Escalation abilities (an Action at a rung, as
Reckoning); "see Stages" → Leveling Up; the GM's valve "Nothing else raises it"; Rimebrand's example (One More Arrow); "an Advance can be split".
Chapter 3: "1d8 Body Fire" → "[V] 1d8 Fi"; the Whirlwind example (Ground Slam). Chapter 4: the Divine Surge and Hallowed Stance examples.
Chapter 5: an Art's definition (Trick Shots' Modifier damage). Chapter 6: "Every creature can use these Actions" (an NPC has no Weapon Attack).
Chapter 7: Signature "(Smite)". Chapter 8: the conditions in alphabetical order (Half-Blinded). Chapter 12: Kindled Wrath's summary (Bloodied or
Down). Chapter 13: One More Arrow's summary (each of your turns); Strafe's Flavor. Chapter 14: Rally the Tribe's "Support" Boon (two places).
Chapter 15: the Archer's armor (Light); "[Gun]" → Firearm; the thrown Dagger's dice. The glossary: Vs. (12 + the Attribute), Obscured and
Hidden (only when it perceives you better), Threatens (Chapter 3's words), Critical (the Favored three of a kind), Area, Crawl (two Versions),
"(Brawler)", the second Hazardous Terrain row. Quick Shots' Critical: "You gain 1 AP" (the rules' "regain AP" is the start of the turn).

## Questions for Lucas (each with Claude's recommendation; "all defaults" is an answer)

**Reactions and timing**
1. **A "would damage" Interrupt (Shield of Faith, Bulwark of Faith)** happens, by Chapter 2, before the Strike is rolled; the cards need the damage known. *Default:* "'Would damage' is checked after the triggering Strike's roll, once its damage is known and before it is applied; the Reaction can't change that roll." (Foundry already works this way.)
2. **"Once a round" / "once each round" (Judge, Opening Shot):** by round number or per turn-cycle? *Default:* the same as the Round Frequency (once per turn-cycle).
3. **"This turn" off your own turn** (Shifting Aim on a Snap Shot; Chapter 1 counts "this turn" from the start of your turn). You ruled Shake Off's "this turn" is the current turn. *Default:* make it general: "'This turn' is the turn in progress, whoever's it is."
4. **Rebuke's moment "moves away from you"** is not in Chapter 2's list of moments. *Default:* add "a creature moves away from you (a square of its movement is farther from you than the one before)".
5. **"Next roll" / "next Action" effects given to another creature** (Dirty Trick, Rally the Tribe, the Mild riders): when are they wasted? *Default:* "lasts until it makes one, and is wasted at the end of that creature's next turn."
6. **A movement a card makes you do but you can't** (Quick Shots' "You Evade 2" while Prone or Immobilized): no shot, or no Evade? *Default:* "you move 0 and the rest of the Action happens."

**Movement and conditions**
7. **Immobilized while moving** (Snap Shot's Tier 3 lands mid-move). *Default:* "If you become Immobilized while you are moving, your movement ends."
8. **The Evade Action used as an Advance** gets around Immobilized and Prone. *Default:* "A creature that can't use Move Actions, or is Prone, can't use the movement as an Advance."
9. **Prone and Immobilized together** leave no way out (Stand is a Move Action; Break Free is the only one Immobilized allows, Prone allows only Crawl and Stand), and Break Free has no card in Chapter 6. *Default:* Prone allows "Crawl, Stand and Break Free", and Break Free's card goes in Chapter 6.
10. **Grabbed:** it says the holder's Reach, then *your* Reach; it doesn't say what Break Free rolls; can the holder Force Move you while you're Immobilized? *Default:* "ends when you are no longer within the holder's Reach"; "Break Free is a Body or Instinct Check (the higher) against the holder's Immobilized DC"; the holder's own movement of you ignores your Immobilized.
11. **Ending a movement in another creature's square** is forbidden only under the Move trait (an Evade isn't a Move Action). *Default:* move it to Chapter 3: "No movement can end in another creature's square."
12. **The order of Speed changes** (Weight of Judgment −2, then Hindered halves, or the reverse). *Default:* "Halve your Speed after every other change to it."
13. **Courage's "ignore the Frightened condition"** isn't defined, and is it a snapshot or does it follow the Paladin? Brace's squares: do they move with him? *Default:* Chapter 8: "A creature that ignores a condition keeps it, and it does nothing; its duration still runs"; Courage "while within 3 squares of you"; Brace "the squares adjacent to you now".
14. **Frightened and Darkness:** "Put Darkness between you" vs Chapter 3 (the light where the creature is decides). *Default:* "let the source stand in Darkness".
15. **Blinded and Darkness:** is every square Difficult Terrain for a Blinded creature (Darkness is Difficult Terrain for those who can't see in it)? *Default:* yes, it is (it moves by feel).
16. **Hazardous Terrain with Entering and Movement** (Covering Fire): does a creature that Advances into it take both? *Default:* one of them: a Movement that enters it triggers Entering only.

**Rolls and damage**
17. **Damage reductions together** (Judge's and Shield of Faith's): do they add up? Once per Action or per instance? Reduced to 0: does the rider happen? *Default:* "Reductions from different effects add up; each applies once to the Action's damage to that creature, after Resist; damage reduced to 0 is not dealt, so its rider doesn't happen."
18. **A [Mod] on a Tier with no [W]** (Trick Shots): its type? *Default:* the weapon's type and subtype (Foundry already does this).
19. **One roll for several targets** (Strafe's "up to three creatures"): one roll, or one each? *Default:* any Action with more than one target rolls once (Foundry already does this; Hit and Run's "Roll once" becomes a reminder).
20. **Hit and Run's single roll and a Doomed hit** (the bow shot while Engaged, after the first hit was rolled on 2d12). *Default:* "Roll 3d12 once; a hit that is neither Favored nor Doomed uses two of them."
21. **"Hit" is not a rules word** but triggers use it (Avenge Kin: "is hit by a [Strike] Action"). *Default:* "takes damage from a [Strike] Action" on the cards (no new word).
22. **Flanking's order** (Chapter 3 subtracts after the limit, Chapter 1 limits first). *Default:* count the flankers, subtract the enemy's allies that threaten you, then the limit of 2 (Chapter 3's example stays true).
23. **5 Boons on a Doomed roll:** Favored and Doomed make a normal roll; do the 5 Boons then add? *Default:* no: the roll is normal.
24. **Save Actions and Senses** (Rebuke on an enemy in Dim light). *Default:* Senses don't change a Save (the target rolls); Cover counts from the Point of Origin for an area, from you otherwise.
25. **Nonlethal on a Save Action** (the Bane can't apply) and **Desperate** (does the Lethal blow that took you Down count?). *Default:* a Save Action can't switch to Nonlethal; Desperate's step applies only when the damage that took you Down was Nonlethal.
26. **The Rolls table:** Smite [Signature, Weapon] fits two rows; is the Dying Table a Roll (Unconscious makes Rolls Doomed)? *Default:* the Weapon and Power rows say "and not Signature or Save"; "damage dice and the Dying and Shattered Tables are not Rolls".
27. **Forced Movement and Line of Effect / Reactions:** Chapter 2 needs Line of Effect to move a creature, Chapter 3's table says only some do; Forced Movement "doesn't trigger Reactions" but a moment names it. *Default:* the table rules ("...at every square of the path"); "Forced Movement doesn't trigger Reactions to movement; a Reaction whose moment names Forced Movement still answers it."
28. **Durations:** Chapter 2 says "only rounds or EoT", but cards use "until the encounter ends" and "until a Save". *Default:* list them all: EoT, N rounds, until the encounter ends, until a Save, a condition's own end.

**The cards**
29. **Judge:** the 1 AP has no duration and nothing for a Paladin with no Judged creature; is its 0R a Reaction for Armor of Faith? *Default:* 1 AP "Judged by you until the encounter ends; the one you had, if any, stops being Judged by you"; the 0R is not a [Divine] Reaction for Armor of Faith.
30. **One More Arrow:** which Strike, and on Strafe each target? *Default:* "Once on each of your turns, when a [Strike] Action of yours deals [W] on a Tier, it deals 1[W] more to each creature on that Tier" (Foundry uses the first such Tier).
31. **Blade and Bow's "after"** (a Snap Shot on the enemy's turn, then Darting Blade on yours). *Default:* "after a [Ranged, Strike] Action this turn".
32. **Spotter:** Find the Gap and Total cover; Call Out and an Unsensed creature. *Default:* "(Total Cover stays Total)"; "Unsensed stays Unsensed".
33. **Trade Places:** the Size half is decided (different Sizes can't swap) but not written; does Steadiness stop a swap? *Default:* write the Size rule; Steadiness doesn't stop a swap (it's willing).
34. **Trick Shots' Pin and Startle:** Tier 3 does what Tier 2 does (the charter's rule 7). *Default:* keep them, noted as the exception (an Art's Mode is a small effect).

**The Bestiary and Gear**
35. **CV and the example NPCs:** by the Bestiary's own steps, the Goblin Sneak is CV 17.5, the Orc Warrior and the Grave Wisp 92.5, the Ogre 185 (the book prints 25 / 100 / 100 / 200), because Speed is free and the downside lowers the CV. *Default:* give Speed a step ("Speed 6 or more, or flying, half a step up; 4 or less half a step down").
36. **The NPC damage examples** follow a formula the book doesn't print (Tier 2 = points × 0.14, Tier 3 × 0.22), not its "Points into damage" table. *Default:* print the formula under the table.
37. **The Reload Shot's "Empowered":** the shooter becomes Empowered for the fight? *Default:* "its damage adds 1d6! (as Empowered, even if you already dealt damage this turn; you don't become Empowered)."
38. **An Elite's Escalation 4 "Round Special twice a round"** (the Ogre has two). *Default:* "each of its Round Special Actions twice per turn-cycle".
39. **An Exotic weapon's Technique at 20** vs "every weapon's unlocks are at the same Mastery". *Default:* keep the exception and say it in that sentence.
40. **A Minion's EoT in a shared slot.** *Default:* "A Minion's EoT effects end at the end of its own turn; rounds count down at the end of the slot."

**Housekeeping (no decision, a later pass):** the example names reused before all twenty were used (Krysta, Nari, Jacob, Wes, Zack in
Chapters 2 to 4); glossary entries missing (Prone, Desperate, Dying, Shattered, Unconscious, Emanation, Burst, turn-cycle, Charge, Buff,
Escalation hook) and its order; the Bestiary's and Gear's damage examples without their pool ([V]); three Bestiary numbers rounded down (79 → 87
and 173 → 174, 145 → 146; the Lingering 2d6 price off the ladder); the "As X AP" notation no card uses.
