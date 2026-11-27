# Saves, or one attack roll against a defense

**Date:** 2026-11-27. **Asked by Lucas:** "What if we remove multiple saving throws, and just make Attack vs Defense, single roll? So the Wisps explosion would simply be Power vs Instinct. Worth change for pace of the game, but less player rolling dice/agency, and more singular results?"

**What was read, and how far to trust it.** One pass, one researcher. Our rules, cards and playtest logs were read in the repository. Outside pages: [read] = the text itself was read (one PDF); [checked] = the page was opened through a summarizing reader and the quote found on it; [lead] = a search tool's summary of a page nobody opened, to check before it is quoted to anyone; [memory] = what Claude knows without a page. Giant in the Playground refused the reader; Reddit and RPG.net were not tried. **No designer of 4e was found saying in his own words why Saves became defenses** (section 6).

**Other games' rules and opinions, and Claude's arithmetic on today's cards, never 2d12's rules. Nothing here is decided.**

---

## 1. The question

Should an effect that hits several creatures (and Save Actions in general) be one roll by its user against each target's defense, where today each target rolls a Save? Lucas names the trade himself: pace, against players rolling less and results that are more all-or-nothing ("more singular").

## 2. What our research and the rules already held

- **`save-dcs.md` (2026-11-15):** named DCs are common practice; trouble comes from two DCs that overlap; things that raise a DC are few and strong. It did not ask who rolls. Its "not covered yet" (Draw Steel's potencies) is covered here in part.
- **`combat-length.md`:** 2d12's minutes a round are unknown; measured 5e is about 4 minutes a round; Hartlage's "20 seconds from each of a hundred attack rolls" is the only per-roll figure we hold.

**How 2d12 does it today, in five lines** [from the rules, Chapter 1]:

1. A [Save] Action "doesn't roll: each target rolls the Save the card names", 2d12 + its Attribute against the user's DC (11 + the Weapon, Power or Signature Modifier, or the Attribute).
2. "The tiers are the target's result: Tier 1 is the worst for them."
3. "A Save Action has no Critical. Your own Boons don't apply to it, but your own Banes do, turned around" (each Bane left gives every target 1 Boon); Vulnerable gives the target Banes on the Save, Cover gives it Field Boons, High cover makes its Save Favored, Senses change nothing.
4. Every other Action on several creatures already uses **one roll**: "you roll once [...] The dice are shared, but every target is calculated on its own", and the Tier, Doubles and Critical "are decided separately for each creature" (Several Targets). Great Sweep in playtest 10: "vs Aveline T2, Durgan T2 [1,11+2 = 14/14]".
5. Attribute DCs already exist: "A creature's Body DC is 11 + its Body, and so are its Mind DC, Appeal DC and Instinct DC." Shove is Body against Body DC; Seek rolls against each hidden creature's Instinct DC. So "Attack: Power vs. Instinct DC" can be written today with no new number.

**Magic (the record, `magic-design.md`):** decision 8 says a spell may be a Strike or a Save ("a Fireball is an Evocation and a Save"). Decisions 76, 88, 100 and 109 exist only because a Save Action has no roll of the user's: 88 makes the user's Boons and Banes change the Save DC; 100 gives Lucas's principle, "The only difference between a Save DC and rolling for an Action, is that Action you roll 2d12, Save DC is a set number", and lowers the DC for a hidden target; 76 makes the Saves Favored where the roll would be Doomed. Review point 5o A6 notes that an Interrupt on "the triggering Action's roll" has no single roll to answer on a Save Action. None of the four is in the book yet.

---

## 3. Part A: the analysis of 2d12

### 3.1 The Save Actions today [from the cards]

| Card | Whose | Targets | Who rolls today | Rolls today | With one roll | What the Tiers mean (the target's) |
|---|---|---|---|---:|---:|---|
| Rebuke (Reaction) | Paladin | one enemy | the GM | 1 | 1 | Tier 1 or 2: its Move is disrupted |
| Lantern of Faith, Glare | Paladin | one enemy | the GM | 1 | 1 | Tier 1 or 2: Half-Blinded (EoT) |
| Commandment, Kneel | Paladin | one enemy | the GM | 1 | 1 | Tier 1 Prone, Tier 2 Hindered (EoT) |
| Word of Radiance | Paladin | enemies in a 2 Emanation | the GM, one a monster | N | 1 | 3d6 and Pushed 3 / 2d6 and Pushed 2 / 1d6 and Pushed 1 |
| Reckoning | Paladin | enemies in a 2 Emanation | the GM, one a monster | N | 1 | Tier 1 or 2: Daunted (1 round) |
| War Howl | Orc Warrior | enemies in a 2 Emanation | each player | N | 1 | 5 + 1d12! and Vulnerable 1 / 4 + 1d10! / nothing |
| Dying Flare (Reaction) | Grave Wisp | all creatures in a 1 Emanation | each player, the GM for its allies | N | 1 | 1d10 and Hindered / 1d10 / nothing |
| Crack the Ground | Ogre Chieftain | all creatures in a Line 3 | each player, the GM for its allies | N | 1 | 20 + 2d12 / 11 + 1d12 / nothing |
| Shake Off (Basic Action) | anyone | one Lingering creature | that creature | 1 | 1 | no attacker: DC 13 or the Lingering's |

Also a Save with no attacker: the Mind Save at Resolve 0 (Chapter 8). Five of the eight Save cards are the Paladin's, and on those the player rolls nothing today.

### 3.2 Rolls at the table [from the playtests] [arithmetic]

| Fight | Save Actions used | Saves rolled | By PCs | By the GM | With one roll |
|---|---|---:|---:|---:|---:|
| Playtest 8 | Dying Flare (1 target), Rebuke, Crack the Ground (2) | 4 | 3 | 1 | 3 |
| Playtest 9 | Rebuke, Dying Flare (1) | 2 | 1 | 1 | 2 |
| Playtest 10 | Dying Flare (4: two PCs, the ogre, the orc), Crack the Ground (2) | 6 | 4 | 2 | 2 |
| **Three fights** | 7 | **12** | 8 | 4 | **7** |

- **The change saves 5 rolls in three fights, 1.7 a fight** [arithmetic]. The three logs show 117 rolls with dice (31, 52, 34); the Saves add 12, so Saves are 12 of 129 rolls (9%) and the change removes 5 of 129 (4%).
- **Time** [judgment; nobody timed these fights]. Assumed: a Save rolled by a player at a table 15 seconds (the GM names it and the DC, the player finds the Attribute, rolls, adds, says the Tier); one rolled by the GM 8 seconds; a roll by the user 12 seconds, plus 4 for each further target it is compared with. Today: 8 × 15 + 4 × 8 = 152 seconds in three fights, 51 a fight. With one roll: 7 × 12 + 5 × 4 = 104, 35 a fight. **About a quarter of a minute a fight.**
- **With casters** [judgment]. A fight with five areas on four targets each: 20 Saves (about 240 seconds) become 5 rolls and 15 comparisons (about 120). **About two minutes of a fight**, at the heavy end.
- **Two things shrink even that.** Players roll their Saves at the same time, so three PCs saving take the wall time of one; the serial cost is the GM rolling monsters' Saves (the outside figures agree: section 4.3). And in Foundry the card makes every Save itself (the automation notes of all eight cards: "each creature's Instinct Save against its Power DC and its damage"), so online the saving is close to nothing.
- **Who holds the dice changes more than how many** [arithmetic]. In the three fights players rolled 8 of the 12 Saves. With the user rolling, players roll 2 (the two Rebukes) and the GM 5. Today's monsters own the areas, so the worry "less player rolling" is right for today's cards. A PC caster with areas turns it around: its player rolls where the GM rolled.

### 3.3 The odds move when the roll changes hands [arithmetic]

Scratch script on the ruler's own dice (2d12, a 12 counts 11 and rolls again, Doubles raise the Tier; it reproduces `benchmark.mjs`: +2 against 13 is 27.8 / 45.5 / 26.7 with the Critical inside the last). User's Modifier M, target's Attribute A. Shown as: the worst for the target / the middle / nothing.

| M, A | Today: the target rolls +A against 11 + M | Flipped: the user rolls +M against 11 + A |
|---|---|---|
| +2, −1 | 48.7 / 34.6 / 16.7 | 43.4 / 44.1 / 12.5 |
| +2, 0 | 41.7 / 39.4 / 19.0 | 36.8 / 46.5 / 16.7 |
| +2, +1 | 34.7 / 42.0 / 23.3 | 32.2 / 45.6 / 22.2 |
| +2, +2 | 27.8 / 45.5 / 26.7 | 26.7 / 45.5 / 27.8 |
| +2, +3 | 22.2 / 45.6 / 32.2 | 23.3 / 42.0 / 34.7 |

- Not the same odds: Doubles help whoever rolls. Against a low Attribute the flip moves about 5 points from the worst result to the middle one; at equal numbers it is a mirror. Every Save card would be re-read at its new odds, and its Tier lines turned over (Tier 1 becomes the user's failure).
- A Critical appears: 4.5% at +2 against 13. On a card with no Critical row it "is simply a Tier 3", but it raises Escalation once an encounter.

### 3.4 Variance: "more singular results" [arithmetic]

**An area on 4 targets.** "Worst" is the worst result for the targets.

| How it is rolled | All four worst | All four middle | All four nothing | Mixed |
|---|---:|---:|---:|---:|
| (a) Today: 4 Saves, +2 against DC 13 | 0.6% | 4.3% | 0.5% | 94.6% |
| (a) Today: 4 Saves, +1 against DC 13 | 1.5% | 3.1% | 0.3% | 95.1% |
| (a) Today: 4 Saves, +0 against DC 13 | 3.0% | 2.4% | 0.1% | 94.5% |
| (b) One roll +2 against four DC 13 | 26.7% | 45.5% | 27.8% | 0% |
| (b) One roll +2 against four DC 12 | 32.2% | 45.6% | 22.2% | 0% |
| (b) One roll +2 against four DC 11 | 36.8% | 46.5% | 16.7% | 0% |
| (c) One roll +2 against Instinct DCs 11, 12, 12, 13 | 26.7% | 35.4% | 16.7% | 21.2% |
| (c) One roll +2 against DCs 10, 12, 12, 14 | 23.3% | 21.9% | 12.5% | 42.4% |
| (c) One roll, four DC 12, one target in Low cover | 26.7% | 40.0% | 22.2% | 11.0% |
| (c) One roll, four DC 12, one Vulnerable 1, one in Medium cover | 23.3% | 28.5% | 16.7% | 31.6% |
| (d) One attack roll a target (4e, 13th Age, Lancer), +2 against DC 12 | 1.1% | 4.3% | 0.2% | 94.4% |
| (e) One shared d12 and one d12 a target, +2 against DC 12 | 8.9% | 5.9% | 2.0% | 83.3% |

- **With equal numbers one roll is never mixed**: the four always land together. "Everyone takes the worst" goes from about 1% to about 30%, and "the area did nothing to anyone" from under 1% to 17 to 28%.
- **2d12's own Several Targets rule is mitigation (c)**: each target keeps its own DC, cover and Vulnerable. With the Attributes a party really has (a spread of 2), a fifth of the rolls split; with cover and conditions, a third. The two ends hardly move: all-worst stays near 25%.
- **(d) keeps today's spread** and saves no roll: it only changes who rolls. It is what the games that dropped Saves do (section 4.1). Rolling the damage once for all, as they do, removes damage dice, not the swing.
- **(e)** is Claude's own construction, untested [judgment]: the user throws one d12 for the Action and one more for each target (Doubles: the shared die and that target's die match). One hand, one throw, and most of the spread kept. It is a third procedure, so it costs what the question wanted to save.

**The same, as damage** (flat averages for the dice; M +2 against A +1):

| Action | Rolled | Mean | Standard deviation | Chance it deals nothing at all |
|---|---|---:|---:|---:|
| War Howl on 4 (12 / 10 / 0) | 4 Saves | 33.5 | 9.4 | 0.3% |
| | one roll | 33.7 | 18.3 | 22.2% |
| Crack the Ground on 2 (33 / 17.5 / 0) | 2 Saves | 37.6 | 17.5 | 5.4% |
| | one roll | 37.2 | 24.0 | 22.2% |
| Crack the Ground on 4 | 4 Saves | 75.2 | 24.7 | 0.3% |
| | one roll | 74.4 | 48.0 | 22.2% |
| Word of Radiance on 4 (10.5 / 7 / 3.5, M +2, A 0) | 4 Saves | 28.5 | 7.6 | never (its Tier 3 deals 1d6) |
| | one roll | 28.5 | 14.2 | never |

- **The mean doesn't move; the spread doubles on four targets** (and grows by about 40% on two). The cost is the Encounter Action that does nothing one time in five, and the ogre's line that puts 33 on each of four PCs one time in three (today: 1.5%).
- **A Tier 1 line that does something** (Word of Radiance's 1d6 and Pushed 1 today, the Basic Attack's 1d4!) removes the "nothing to anyone" end and leaves the other end as it is.
- **Playtest evidence** [from the playtests]: Crack the Ground dealt 25, 0 (not used) and 8. Three uses of two targets cannot show a spread; the table above is all we have.

### 3.5 Who rolls [judgment]

- **On the enemy's turn the PC stops rolling.** What it keeps is real: Reactions (Shield of Faith, Rebuke), Guard, and position before the turn. Nobody has kept an AP for Guard in three playtests, so today the Save is the only thing a player does on most enemy areas.
- **The GM's load falls when PCs hold areas** (no monster Saves to roll one by one) and stays the same when monsters hold them (one roll in place of asking each player).
- **The asymmetric way: players always roll.** A PC's Action is a roll against a number; a monster's Action is a number the player rolls a defense against. 2d12 could write it without new numbers: against an NPC's Action the player rolls 2d12 + what sets the Defense against 11 + the NPC's Modifier. The cost: every NPC card is read backwards (its Tier 3 is the player's Tier 1), Armor and Ward Defense need a rolled form, every Boon and Bane on an NPC's roll has to be turned into a Bane or Boon on the player's (the "turned around" sentence, for every Action), Doubles and Criticals change sides, and one enemy area on four PCs is four rolls again. Two procedures and more rolls: the opposite of the question.

### 3.6 What in the rules leans on a Save being its own roll [from the rules]

| Rule | With the user rolling against the target's Attribute DC |
|---|---|
| "A Save Action has no Critical" | Gone: it has one, like any roll (Tier 3 unless the card has a Critical row; Escalation once an encounter). |
| The user's Banes become the targets' Boons; the user's Boons do nothing | Gone: Boons and Banes sit on the roll. Decisions 76, 88 and 100 of magic become unnecessary: Lucas's principle in 100 becomes literally true. |
| Vulnerable gives Banes on the Save | Gone: Vulnerable already says "Actions against you gain a number of Boons". |
| Cover gives Field Boons on the Save, High cover Favored | Gone: Chapter 3's Cover already gives the roll Field Banes and Doomed, "to [Strike] and [Area] Actions". The point it is counted from (the area's Point of Origin) stays. |
| Senses don't change a Save Action | An [Area] still ignores Senses (Chapter 7; decision 109). A single-target one would take them like any Action, which is what decision 100 wanted. |
| At-will's Bane, the ranged penalty while Engaged, untrained armor | Apply by themselves (the hole the third review of magic found, 5o A2). |
| Empowered "for a Save Action before the Saves" (Chapters 1 and 8) | Gone: the general rule covers it. |
| Nonlethal "switches the other way" (Chapter 4) | Gone: the roll takes the Bane. |
| Immobilized: "A Save Action doesn't roll, but it always has a Modifier: the origin rolls" (Chapter 8) | Gone: the Action's own roll is compared with the Action DC. |
| Minions: "A Save Action removes ticks by the Minion's own Save, turned over" (Chapter 14) | Gone: the Tier of the roll, as for any Action. |
| A Reaction on "the triggering Action's roll" (magic 81, 5o A6) | One roll exists to answer. |
| Doubles raise the target's Tier | Doubles raise the user's Tier against every target at once (1 roll in 12). |
| Effects on a creature's Saves ("1 Boon on Instinct Saves", Sickened's Banes on Body and Instinct Saves) | They stop touching these Actions unless rewritten as a change to the Attribute DC, or they keep working only on the Saves that are left. To decide. |
| An object "gets Tier 1 on a Save" (the objects pass; the Ice Pillar) | Needs its mirror: an object has an Attribute DC, or the roll is a Tier 3 against it. |
| **Shake Off** (no attacker), the Mind Save at Resolve 0, hazards | Nobody to roll against them. They stay rolls of the creature against a DC: a Save, as today. So the word "Save" survives, meaning only "a roll you make against a DC to resist something with no roll of its own". 4e and 13th Age kept a "save" for exactly this (section 4.1). |
| Lingering's DC | Unchanged if Shake Off stays a Save. |
| "Save ends" | Not used: magic's record notes durations are EoT or rounds only. |

### 3.7 One procedure or two? [judgment]

Not quite one: the Save stays for effects with no attacker. But the **Save Action** goes, and with it the only Action whose Tiers are read from the other side.

- **Sentences that could be deleted:** Chapter 1, all of "Save Actions" (three paragraphs), "A [Save] Action doesn't roll: its targets roll Saves", the Empowered sentence in Several Targets, "A Save Action's Tier lines read the same way" (Riders), "A Save Action's own DC is written under Save Actions" (Action DC), the roll line "Save: Appeal" in the card anatomy; Chapter 4's Nonlethal sentence; Chapter 7's [Save] trait; Chapter 8's Empowered and Immobilized sentences; Chapter 14's Minion rule 2; the glossary's Save Action and "Weapon DC, Power DC" entries. In the magic record: decisions 76, 88, the Save half of 100, and the Save DC item of `decided.md`.
- **Sentences needed:** one in Attribute DCs or Versus ("an Action can roll Weapon, Power or Signature against an Attribute DC; its card says which"); one line in Saves ("a Save is rolled by the creature that resists, when nothing rolls against it"); the object mirror; what happens to "Boon on Saves" effects; and the eight cards rewritten with their Tiers turned over ("Attack: Power vs. Instinct DC").
- **Net:** about fifteen sentences and one trait out, about four in. The reading trap "Tier 1 is the worst for them" disappears from the cards.

---

## 4. Part B: other games

### 4.1 Who rolls, and how many rolls

| Game | An effect on several targets | One roll or one a target | What keeps it from all-or-nothing | The stated reason | The known complaint |
|---|---|---|---|---|---|
| **D&D 4e** | The attacker, against Fortitude, Reflex or Will | One attack roll a target, one damage roll: "you make a separate attack roll against each target in the area of effect, but you make a single damage roll" (PH p. 271) [lead: forum transcriptions] | Independent rolls; many powers "Miss: Half damage" [checked, a previewed power] | No designer's words found. Hartlage: the designers "eliminated a redundant mechanic", which "added consistency and elegance" [checked] | Slow: "the _roll for each target_ rule will be one of the first and most common house rules" (HeavenShallBurn, 2008) [checked]. And the lost roll: section 4.2. A "saving throw" stayed as a flat roll to end effects [lead] |
| **Star Wars Saga** (2007) | The attacker, against Reflex Defense | **One roll** compared with every target; half damage on a miss [lead: fan wiki] | Half on a miss; each target's own Defense | Not found | "it sped things up but made area effect attacks extremely swingy" (FadedC) [checked] |
| **13th Age** | The attacker, against Physical or Mental Defense | "you make a separate attack roll for each one, but only roll damage once" [checked, SRD] | Independent rolls; some attacks deal miss damage | Not found | None found. Saves stay as a flat d20 (11+) for ending effects, recharge, death [checked] |
| **Draw Steel** | The user; no defense number at all | One power roll, three tiers, for the ability; "If different tiered outcomes affect multiple targets, the creature using the ability picks" [checked]. That one roll covers every target is read from the ability blocks, not from a sentence found [lead] | No miss: "ability rolls always do something useful" [checked]. A condition lands on a target only if the potency beats that target's characteristic [lead] | Hartlage: it "tries to eliminate the down moments when a player misses an attack and wastes their turn" [checked]. MCDM's own words not found | "the lack of failure in attack rolls made combat feel less compelling" (Hartlage, from play) [checked] |
| **Lancer** | The attacker against Evasion or E-Defense; some effects a Save by the target against the attacker's Save stat | "roll an attack for each affected target, roll damage once" [checked, a fan quick-rules page] | Independent rolls | Not found; when a system or hazard forces an effect with no aimed attack it is a Save [memory] | Not found |
| **Pathfinder 2e** | The targets save | One Save a target, four degrees; damage rolled once [memory] | The "basic save": no damage / half / full / double "no matter what caused the saving throw" [checked, Player Core p. 404] | One word ("basic") in place of four lines on every spell [judgment] | Not searched |
| **D&D 5e (2014, 2024)** | The targets save; a spell attack for single-target spells | One Save a target | Half damage on a success | Mearls's test for which to use: "Would a suit of plate mail protect from this?"; Hartlage: saves came back for tradition and feel [checked] | Monster Saves one by one are slow (section 4.3); 2024 kept Saves [memory, not checked] |
| **Daggerheart** | Mixed: a Spellcast Roll against Difficulty, or each target makes a Reaction Roll | Both forms on cards [lead] | Reaction Rolls a target | Not found | Not found |
| **Shadow of the Demon Lord, Weird Wizard** | The attacker, "against a target's Defense or specified attribute score"; a challenge roll for a hazard [lead: the official GM screen] | Not verified for areas | Not verified | Schwalb: "your target number is the score of the attribute or characteristic used to resist the attack" [lead] | Not found |
| **Fabula Ultima** | The caster's Magic Check against Magic Defense | One check for all targets [memory, not verified] | Each target's own Defense | Not found | Not found |
| **Gloomhaven** | The attacker; nobody rolls to defend | One attack modifier card a target [lead: the rulebook through a search summary] | A separate draw a target | Not found | Not found |
| **Players roll everything** (Numenera, Symbaroum, Dungeon World; 5e's variant) | The player, always | One roll a PC | Independent rolls | 5e's Unearthed Arcana: "the more active you can keep the players in your game, the more engaged they'll be" and it "keeps things simpler for you as the DM" [read] | Section 4.4 |
| **Savage Worlds, Mythras** | Opposed or resisted rolls | Not checked | Not checked | Not checked | [memory only: listed as the contrast, both sides roll] |

**What the table says.** Moving the roll to the attacker is common and settled (4e, 13th Age, Lancer, Demon Lord). **Sharing one roll across an area is the rare part.** The games that flipped kept one roll a target and shared only the damage. The two that share the roll (Saga, Draw Steel) both make a miss deal something, and Saga's is the one called "extremely swingy". 2d12's Several Targets rule already puts it on that side for Strikes.

### 4.2 The arguments, in their strongest words

**For the attacker rolling**

- "When you attack with a sword, your attack roll must beat your foe's AC." (RangerWickett, EN World, 2006: why should a spell differ) [checked]
- "4th edition keeps the control with the player making the attack"; "Let THEIR dice decide if they are successful, not the DMs." 5e's way: "the player simply said what they were doing and the DM made the rolls." (OldeGreybeard, 2024) [checked]
- Under Saves, "Spellcasters generally feel more 'passive' than fighters on their turn." (Justin Alexander, 2012, who also calls the flip "completely irrelevant" to the math and 4e's sameness "blander and less varied") [checked]
- "picking up a die and rolling a save is a really low form of player involvement" (Will Doyle, EN World, 2012) [checked]
- It "made more spells and abilities feel like an attack and it was easier design space." (Eubani, 2021) [checked]
- Against mixing: "some cases where you roll during and action, some cases where they roll for your action" (OptionalRule); "I prefer methods that are either 'attacker rolls all the dice' or 'the player rolls all the dice'" (TwoSix) [checked]

**For the defender rolling**

- "It is about the feeling of having an impact on your character's survival." (Umbran, 2006); it "gives them a sense of responsibility over their fate" (Psion) [checked]
- "Players like to roll dice, especially when the roll decides their character's fate." Without Saves, "players flamed by dragon breath never get to take fate in their hands and roll a save"; they "just subtract damage." (David Hartlage, 2017) [checked]
- "players would rather roll their saves rather than the enemy wizard making an attack against them." (Stalker0, 2022); "It boils down to the DM not getting to say that a spell kills a PC without the PC getting to roll something." (GMMichael) [checked]
- The fiction: a trap "isn't acting with intent"; for a fireball "you're not targeting anyone in particular." (Composer99, 2021) [checked]

**On one roll for an area**

- For: "making a single roll in place of a lot massively speeds thing up." (HeavenShallBurn) [checked]
- Against: "IMO, the victims make the save because of area-of-effect attacks. [...] The evil wizard casts Wail of the Banshee. He rolls a natural 17. The whole party dies." ((Psi)SeveredHead, 2006); "With the single-caster-roll, it's all, or none." (Hypersmurf) [checked]
- Against, from the user's side: "It would be a real bummer for your fireball to have no impact at all just because you rolled low." (amnuxoll, 2010, proposing three dice sorted high to low in place of one) [checked]
- Against, between PCs: "The fact that my fighter will never make a save that the rogue fails sucks." (slwoyach, 2010) [checked]
- A warning: a rule moved to an attack roll picks up what attack rolls carry, criticals first [lead, D&D Beyond thread].

### 4.3 The time a defender's roll costs

Nobody measured it; these are tables' estimates.

- "another 20-40 seconds for DM to make saves and calculate results [...] That might add 2-3 minutes to each round." (Rhenny, 2016) [checked]
- "Takes maybe 30 seconds for 8 monsters" when all the dice are thrown at once and read by their place on the table (Tormyr) [checked]
- "its easier for all the players to roll once then for the DM to roll four times" (Meloncov, 2006): Saves are fast when players make them and slow when the GM does [checked]
- 4e's per-target attack rolls: "It takes IME several times longer than the GM rolling 16 saves while player only has to roll the damage dice." (simontmn, a comment on Hartlage) [checked]
- "cutting perhaps 20 seconds from each of a hundred attack rolls made during a session leads to a faster pace" (Hartlage, 2025, on Draw Steel dropping the damage roll) [checked]

### 4.4 "Players always roll" at tables

- 5e's own variant (Unearthed Arcana, 2015) [read]: "A defense roll has a bonus equal to the character's AC − 10. The DC for the roll equals the attacker's attack bonus + 11." For a PC's spell: "The bonus to the d20 roll for a saving throw check equals the effect's save DC − 8. The DC for this check equals 11 + the target's saving throw modifier." And the bookkeeping it needs: "the saving throw check has advantage if the target would have disadvantage on its saving throw, and vice versa."
- A poll (EN World, 2025, 72 votes, self-selected): "GM never rolls dice is" fun for both 40.3%, not fun at all 26.4%, fun as a player and not as a GM 13.9%, other 19.4% [checked].
- For: "Players making all the rolls means they feel empowered, and failure/success is entirely up to them." (Shawn Stroud, on Symbaroum); "That might make players more engaged when it's not their turn." (overgeeked) [checked]
- Against: "I feel captive, superfluous; like I could be replaced by a solo module." (Kyrinn S. Eis, a GM); "GMs like rolling dice as much as other players do." (billd91); "I don't see a need to shoehorn it into games that are not [designed for it]." (Morrus); it "probably suits less crunchy rules better" (rolemasterblog) [checked]

---

## 5. How it applies to 2d12

**What the numbers say first.** The pace gain is small: 1.7 rolls a fight today, seconds, and nothing in Foundry. The other two effects are large: players' resist rolls fall from 8 to 2 in the three playtests, and an area's spread doubles. So pace is the weakest reason to change. The strongest is the one Lucas did not name: **ambiguity**. The Save Action is the one Action read from the other side, and it has needed a patch each time a rule touched a roll (section 3.6 lists eleven). His own decision 100 already says a Save DC should behave exactly like a roll.

| Option | Rolls saved | The swing | Agency | Rules out, rules in |
|---|---|---|---|---|
| **1. Keep Saves** (and write decision 88's Save DC into Chapter 1) | 0 | Today's: mixed 95% of the time | Players roll on the enemy's area; the Paladin's player doesn't roll on his own five cards | Nothing out. In: the Save DC rule with its caps, Favored and Doomed and per-target cases (decisions 76, 88, 100) |
| **2. The user rolls once against each target's Attribute DC** (Lucas's idea), every Save Action. Shake Off, the Mind Save and hazards stay Saves; Lingering's DC unchanged | 1.7 a fight today; up to about 15 in a caster-heavy fight | All together with equal numbers; mixed 21 to 42% with real parties; "nothing to anyone" 17 to 28%; "everyone worst" 23 to 37% | Players roll 2 of today's 12; a PC with an area rolls where the GM did | About fifteen sentences and the [Save] trait out, about four in; eight cards turned over; the odds shift up to 5 points (3.3) |
| **3. The same, only for Actions on several targets**; Rebuke, Glare, Kneel stay Saves | The same as 2 (single-target Saves save nothing) | The same as 2, where it matters | Players keep the roll only against single-target effects | Nothing out: both procedures stay, plus a rule for which applies. The worst for ambiguity |
| **4. Option 2 with a floor** | The same as 2 | "Nothing to anyone" removed; "everyone worst" unchanged | The same as 2 | Option 2's, plus a card-writing rule (below) |
| **5. Players always roll** | Fewer than 0: an enemy area on four PCs is four rolls | Today's | The most for players; the GM rolls nothing | Two procedures for every Action, every NPC card read backwards, every Boon and Bane turned around (3.5) |

**Option 4's mitigation, exactly:** (i) the Several Targets rule as written (each target its own Attribute DC, cover, Vulnerable: no new text); (ii) a rule for writing cards, in `book/cards/card-structure.md`: **an [Area] Action's Tier 1 line is never "No effect"** (a small damage or a short rider, as Word of Radiance and the Basic Attack already do), and its heaviest rider sits on Tier 3 only. It is Draw Steel's and Saga's answer, in 2d12's existing words. It does not touch the top end: an ogre's line on four PCs lands its Tier 3 on all of them one roll in four to one in three. That end is a matter of each card's Tier 3 number, priced knowing it lands together.

**A suggestion, not a decision (Claude):** **option 4**, for least ambiguity and not for pace.

- It removes a whole procedure and its patches, and makes true what decision 100 asked for. Magic's Save spells then need no rules of their own.
- It adds no new number (Attribute DCs exist) and no new way of rolling (Several Targets exists, and Strikes on several creatures already share a roll).
- What it costs is real and should be accepted knowingly: players stop rolling against enemy areas (their say on an enemy's turn becomes Reactions and Guard only), and areas swing about twice as wide. If the resist roll matters more to Lucas's table than one procedure, the honest runner-up is **option 1** with decision 88 written down, not option 3 or 5.
- Before deciding, one cheap test: in the next playtest, roll Crack the Ground, Dying Flare and War Howl both ways (the Saves, then one roll against Instinct or Mind DC) and note which the table preferred. Three uses a fight is enough to feel it.

---

## 6. Not checked, unverified

- **Why 4e's designers did it, in their words.** Nothing by Heinsoo, Mearls or the "Wizards Presents" books was found; the 2012 "Rule of Three" article on saves returning was seen only through its forum thread. Hartlage's "redundant mechanic" is his reading.
- **4e's PH p. 271, Saga's area rule, Gloomhaven's card a target, Demon Lord's "roll against", Daggerheart's two forms, Draw Steel's potency:** search summaries or fan transcriptions [lead].
- **That Draw Steel makes one power roll for every target of an area:** read from ability blocks and the tier-picking rule; the general sentence was not found. MCDM's stated reasons ("no null results") were found only in others' words.
- **Fabula Ultima, ICON, Savage Worlds, Mythras, Dungeon World, D&D 2024, Pathfinder 2e's single damage roll, Lancer's reason for keeping Saves:** memory only, or not looked at.
- **Lancer's rules** come from a fan quick-rules page, not the book.
- **Giant in the Playground** ("Is there a compelling reason why attacks and saves use different mechanics?", "What breaks if you make saves the static number?") refused the reader. Reddit and RPG.net were not tried.
- **The seconds a roll takes at Lucas's table** are assumed. No 2d12 fight has been timed.
- **Foundry:** whether the system rolls every Save without a click was read from the cards' automation notes, not tried.
- **The variance tables** use flat averages for damage dice and identical or stated DCs; Favored and Doomed targets and named Boon caps are not modelled. The script was a scratch file and is not in the repository; it matched `benchmark.mjs` on the two Tier lines it prints.

## 7. Sources

- Unearthed Arcana: Variant Rules (Wizards of the Coast, 2015), "Players Make All Rolls": https://media.wizards.com/2015/downloads/dnd/UA5_VariantRules.pdf
- Justin Alexander, "Thought of the Day: The Design History of Saving Throws" (2012): https://thealexandrian.net/?p=10686
- David Hartlage, "Fourth Edition Proved D&D Works Without Saving Throws, So Why Did They Come Back?" (2017): https://dmdavid.com/tag/fourth-edition-proved-dd-works-without-saving-throws-so-why-did-they-come-back
- David Hartlage, posts tagged MCDM RPG ("Daggerheart vs. the MCDM RPG vs. D&D", 2024; "Checks Versus Attack Rolls", 2025): https://dmdavid.com/tag/tag/mcdm-rpg/
- OldeGreybeard, "D&D 4e: Where Are the Saving Throws?" (2024): https://oldegreybeard.substack.com/p/d-and-d-4e-where-are-the-saving-throws
- EN World, "Why saving throws? Why doesn't the attacker roll to beat your score?" (2006): https://www.enworld.org/threads/why-saving-throws-why-doesnt-the-attacker-roll-to-beat-your-score.167343/page-2
- EN World, "Attack rolls and area effect spells" (2008): https://www.enworld.org/threads/attack-rolls-and-area-effect-spells.224777
- EN World, "Enlightened Grognard: One attack roll for area of effect" (2010): https://www.enworld.org/threads/enlightened-grognard-one-attack-roll-for-area-of-effect.276685
- EN World, "Rule of Three: March 13" (2012): https://www.enworld.org/goto/post?id=5849317
- EN World, "Tips for Resolving Area Effects" (2016): https://www.enworld.org/threads/tips-for-resolving-area-effects.498099/
- EN World, "Saves as Target Numbers" (2021): https://www.enworld.org/goto/post?id=8326310
- EN World, "5e spell saves versus 4e spell attacks" (2022): https://www.enworld.org/goto/post?id=8765654
- EN World, "GM no-roll" (2025, the poll): https://www.enworld.org/threads/gm-no-roll.712201/
- EN World, "ATTACK! MCDM's new rpg and removing the to-hit roll" (2023; opened, nothing quoted): https://www.enworld.org/goto/post?id=9101166
- Stargazer's World, "Player-facing rolls" (2017) and its comments: https://stargazersworld.com/2017/08/24/player-facing-rolls/
- Draw Steel, ability roll (Steel Compendium): https://steelcompendium.io/v2/Browse/rule/dice/ability-roll/
- Draw Steel, potency (Steel Compendium; search summary only): https://steelcompendium.io/v2/Browse/rule/character/potency/
- 13th Age SRD, combat rules: https://www.13thagesrd.com/combat-rules/
- Pathfinder 2e, Basic Saving Throws (Archives of Nethys): https://2e.aonprd.com/Rules.aspx?ID=2297
- Lancer quick rules (fan page): https://lancer-rules.carrd.co/
- Star Wars Saga area attacks (fan wiki; search summary only): https://www.worldanvil.com/w/star-wars-steephendrew/a/area-attacks-article
- Gloomhaven rules, attack modifier cards (search summary only): https://rules.dized.com/gloomhaven/rule/attacking/attack-modifier-cards
- Shadow of the Demon Lord, GM screen (search summary only): https://schwalbentertainment.com/wp-content/uploads/2024/08/GM-Screen-Inside-v2.pdf
- Schwalb, "Dice and Accessibility" (2014; the page did not load, search summary only): https://schwalbentertainment.com/2014/11/04/dice-and-accessibility/
- Daggerheart SRD (search summary only): https://callmepartario.github.io/og-dhsrd
- D&D Beyond thread on saves turned into attack rolls and criticals (search summary only): https://www.dndbeyond.com/forums/rules-game-mechanics/86983-portable-hole-shield-and-colan-armor/previous
- Refused the reader: https://forums.giantitp.com/archive/index.php/t-646935.html
