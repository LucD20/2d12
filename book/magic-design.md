# Magic: the design record

**Started 2026-11-18** (the Magic brainstorm; MASTER-PLAN's D4, taken before D3 Skills). **Status: brainstorm. Nothing here is in the book.** This file is the record of the magic design, the way `book/cards/paladin-redesign.md` is the Paladin's: Lucas's words, every decision in order, what the rules already fix, and what is open. **Read it before any work on magic, and update it with every decision.** The day-by-day log stays in `rules-backlog.md`; the research is in `book/research/` (`dominions-magic.md`, `dominions-paths.md`, `dominions-rules.md`, `ars-magica.md`, `magic-schools.md`, `caster-class-shape.md`).

---

## 1. Lucas's brief, in his words

- "I want to start to brainstorm magic. Magic in my system will be quite the work. And I want to try something bold before simplifying. Dominions 6 has many interesting magical mechanics [...] it is a video game so it won't work like it, but we can likely steal mechanics from here."
- "The Path is the cool part and how they can merge and create new spells." "I think this is the real deal: Paths + School, lots of possibilities."
- "I prefer of course Dominions' theme and how it is."
- On names and traditions: "I am not trying to stick with sacred cows. As long as it works in game. And we can also change names later on (not yet to not be confusing, since we are using Dominions as a base)."
- **The standing requirements (2026-11-18): "my system grows horizontally, and these have to fit Talents and Classes. Make sure to add this as we build. And it can be complex, as this is not a beginners system, but it needs to be intuitive."**

And the system's purpose (CLAUDE.md, 2026-11-15): fun, engaging, tactical, **with the least ambiguity possible**: when a card needs a word the rules don't define, the rule gets written.

### The four tests every magic decision is checked against

| Test | What it asks | How to check it |
|---|---|---|
| **Horizontal** | Does this make a character wider (more options, more shapes, more combinations), not taller (a bigger roll, a bigger DC, more Health)? | It adds no number to a roll or a DC. Dice grow only where the whole system's do (the Stages). |
| **Fits Talents and Classes** | Can a Talent grant it, change it or key on it by a trait? Can a class be built around it in the class shape (Features, Hallmark cards, Arts, Escalation abilities, Picks)? Can a non-caster take a little of it? | Name the Talent and the class Feature that would use it. |
| **Complex but intuitive** | Can a player who knows the two words on a spell (its Path, its School) say roughly what it does and what its limits are before reading it? | Each word carries one meaning everywhere; one rule learned once, not a rule a spell. |
| **Least ambiguity** | Is every word on the card defined in the book? | A new word gets its rule written before the first card uses it. |

---

## 2. Decisions so far (all discussion only: none applied)

| # | Decided | Lucas's words | Date |
|---|---|---|---|
| 1 | **Health is not the main cost of spells.** It is right for a living-fuel class (Blood). | "I dont think the main cost being HP is worth it here, since recovering HP is rare; for a living fuel class yes, makes lots of sense." | 2026-11-18 |
| 2 | **Nonlethal damage as extra fuel is kept as an option** (a push beyond the normal limit). | "An extra option to use nonlethal as mana is good though." | 2026-11-18 |
| 3 | **Paths + Schools, two axes.** | "I think this is the real deal." | 2026-11-18 |
| 4 | **A School is the spell's form, with rules attached.** | "The form with rules attached." | 2026-11-18 |
| 5 | **The gate: a spell writes a minimum in its Path and in its School; you need both** ("Fire 2 • Evocation 1"). | "A sounds best." | 2026-11-18 |
| 6 | **Overcast reads both, each for its own job:** excess Path level grows the substance (damage, the rider, a merge), excess School level grows the form (Distance, Area, Duration). | "Second yeah." | 2026-11-18 |
| 7 | **[Focus] is concentration and applies to all spells;** it defines no School. Magic will mostly get new traits. | "[Focus] is concentrating, so it applies to all spells. I dont think we will reuse many traits here, likely we will create more." | 2026-11-18 |
| 8 | **A School doesn't say Strike or Save** (a Fireball is an Evocation and a Save). The roll is the card's business. | "A fire ball would be evocation, and it would be a save." | 2026-11-18 |
| 9 | **Six Schools:** Evocation (release), Alteration (change), Enchantment (lay), Conjuration (bring), Thaumaturgy (command), and a protection School (stop; no name yet, "Warding" as a working name). Dominions' names for now. | "Yes, sixth." | 2026-11-18 |
| 10 | **Lasting wins the sorting:** a spell whose magic stands is an Enchantment, whatever it does; otherwise it is sorted by its verb. | "A." | 2026-11-18 |
| 11 | **Eight Paths in the grid:** Fire, Air, Water, Earth, Astral, Death, Nature, Glamour. The rules and definitions for all eight; spell cards for three or four Paths first. Blood (the living-fuel class) apart. | "A, all eight, then cards for a few first." | 2026-11-18 |
| 12 | **The Paladin is not magic.** Divine stays outside the grid; it can heal though Dominions' Holy doesn't. | "Paladins isn't technically magic so should be fine." | 2026-11-18 |
| 13 | **A poison subtype is added** to the damage subtypes (Nature's). | "We can add a poison subtype." | 2026-11-18 |
| 14 | **No cap on Path and School levels for now.** | "We can remove the cap of 3, leave without cap just in case, later we can add cap if necessary." | 2026-11-18 |
| 15 | **The borders between the Paths are Dominions'** (the table in `dominions-paths.md` 3.1), with 12 and 13 as the two changes. Not objected to; **to confirm.** | (answered only on healing and poison) | 2026-11-18 |
| 16 | **The marker of magic:** a spell is a Power Action with three new traits: [Spell], its Path, its School. Divine cards have none. | "All defaults except 4." | 2026-11-18 |
| 17 | **Levels grow with use, the weapons' way.** A Talent or a class opens a Path or a School at level 1; the level then rises by use, as Mastery does. Talents add tricks keyed on the trait, never levels. | "I like the idea of growing with use." | 2026-11-18 |
| 18 | **A level is never a number on a roll or a DC.** It unlocks what asks for it and gives Overcast steps on the spells below it; dice grow with the Stage only. | (default) | 2026-11-18 |
| 19 | **You don't know every spell.** Mastery unlocks **choices** (a spell picked at a threshold), and **Talents can grant more spells**. | "I think knowing every spell is too much. Mastery should unlock choices and talents can grant more spells etc." | 2026-11-18 |
| 20 | **An Overcast step is paid by the fight's clock:** it needs Escalation (the first at 2, the next at 3...); the Nonlethal push takes one step early. | (default) | 2026-11-18 |
| 21 | **Spells belong to the grid; a caster class owns how you cast** (readying, pushing, holding, merging, linking) and starts with a Path and a School open. Any class can take a little magic through Talents. | (default) | 2026-11-18 |
| 22 | **The Health question is parked** in rules-backlog.md ("[Q] IS THE NEARLY FLAT HEALTH HURTING THE FEELING OF PROGRESSION?"); magic goes on. | "Keep in the backlog, proceed with magic." | 2026-11-18 |
| 23 | **The eight Paths' definitions, subtypes and riders are decided** (the table in 5b): Fire Lingering, Air Pushed, Water Hindered, Earth Prone, Astral Dazed 1, Death Frightened, Nature Immobilized, Glamour Pressed 1. | "Looks good." | 2026-11-18 |
| 24 | **A spell has no fixed shape.** Not every spell is damage and a rider; some are only damage, some only a rider, and "they can be innovative or special in their own way". The rider is what a Path adds *when* a spell has one, and what it lends in a merge. | "Keep note, not every spells needs to have damage + rider, or just damage or just rider; they can be innovative or special in their own way." | 2026-11-18 |
| 25 | **After the basics, Dominions' own spells are pulled and shown as 2d12 cards** (from `research/raw/2026-11-18-dominions-spells.tsv`), as the grid's test. It takes the place of the classic-spell pass in the order of work. | "You could pull some spells from there and see how they would look in 2d12 after we are done with the basics." | 2026-11-18 |
| 26 | **Overcast's shape:** its own line on the card after the Tiers; three shared form ladders (Reach, Breadth, Hold) paid by excess School level, the card listing which it may climb; one substance step written on each spell, paid by excess Path level; **Merge** on every spell (a second Path's rider, in the rider slot; the spell gains that Path's trait for the casting). | "Yes." | 2026-11-18 |
| 27 | **Mastery for magic** (5d), with one change: **one point a fight, placed in a Path or a School you cast in it** (the weapon rule exactly), not one in each. Opening gives a Path and a School together and two spells; levels at 10, 20, 30, 45, 60; a spell chosen at each new level; spells swap on a Rest; "the group follows" left out. | "Works, but school and path at 2 by level 3, isn't that too soon?" then "Yes." | 2026-11-18 |
| 28 | **A magic that stands: A, one at a time** (it lasts until the encounter ends, you go Down, or you end it; casting another ends the first), **with room left for B as a second kind**: some spells that you "maintain by spending AP". **Both break when you become Bloodied or Strained.** The name "Standing" is refused ("doesn't sound magic"; his examples: sustaining, concentrating): names to choose. | "A is good but nothing stops B from existing as well. We focus on A with gap for B, some spells that you can 'maintain by spending AP'. Break on bloodied and strained is good." | 2026-11-18 |
| 29 | **The names: [Woven]** for the one-at-a-time kind ("you can hold one Woven spell; casting another ends it") **and [Sustained]** for the paid kind ("Sustain: 1 AP" at the start of your turn, or it ends). | "Sustained and Woven." | 2026-11-18 |
| 30 | **The push is C and is named Overreach:** once a casting, one Overcast step you couldn't otherwise take (the Escalation or the level it lacks), for **1d6! Nonlethal Resolve damage** to you; a cost, so Guard doesn't take it and nothing reduces it. The name was Claude's to pick between Overreach and Strain: Overreach, because **Strained** is already a defined state and "Strain" beside it would be two near-identical words with different rules. | "C; exploding d6 is good; overreach or strain [...] your pick." | 2026-11-18 |

**Superseded:** point 7 of "PROGRESSION AND MAGIC" (2026-10-29: "no new casting mechanic"; reopened by "something bold"). Still standing from that entry unless changed: spells are open to anyone through Talents; classes differ by repertoire; theme chains keyed on traits; "spells must not feel bad"; a caster's round 1 at least 90% of a weapon user's.

---

## 3. What 2d12's rules already fix for magic

Read for this record on 2026-11-18: the class charter (all of it), the set-aside Talents chapter and its cards, the Talent structure proposal, the card Structure, Chapters 1, 2, 4, 5, 7, 8 and the Mastery rules of Chapter 15, the Paladin's chapter and its Stage 0 cards.

### 3.1 Numbers don't grow, so a level can't be a number

- Modifiers are +1 and +2 at level 1 and **never above +4**; accuracy and DCs are flat; Health at most doubles over fifteen levels; "**Levels give options; Stages change the numbers**" (Chapter 5).
- A fight lasts about 3.5 rounds at every Stage. Damage and Health step up together at the Stage boundaries (levels 4, 8, 12), with "a few big visible steps" (the weapon's 1[W] becoming 2[W] at high Mastery).
- **So:** a Path or School level never adds to a roll or a DC. A spell's dice are set by its card and grow with the Stage, as everything does. What a level gives must be **an option**: a spell it unlocks, a wider form, a rider, a merge. With no cap on levels (decision 14) this matters more: an uncapped number that added damage would be exactly the bloat the system refuses.

### 3.2 The build is "more Talents than class"

- A Talent every level; a Stage Talent at levels 4, 8, 12. Categories: Combat, Mobility, **Magic**, Skill. A Talent has a level and Prerequisites: another Talent, a level, **"an Action with a trait you have"**, an Attribute. Chains exist (Brawler, then Kickboxer).
- **"Talents That Modify Actions"**: a Talent names the Actions it changes **by their traits** (Heavy Blows: "[Melee, Strike, Weapon] Actions with a Two-handed weapon").
- The charter's rule 11: **a card that counts "your Actions" names a trait, never all of them**, because the build is more Talents than class. The Paladin's glue is [Divine].
- The four old Magic Talents were Divine only (Lesser Blessing, Rimebrand, Sacred Weapon, Hand of Mercy).
- The Talent structure proposal (2026-11-09, not applied): Minor and Major Talents, **ranks I to III**, two tracks (a Talent and a Skill pick), a fear of hoarding.
- **So:** a Path and a School are **traits on a spell** ([Fire], [Evocation]), and that alone makes them fit: a Talent can require one ("a [Fire] Action"), and a Talent or a Feature can change every spell of one ("your [Evocation] spells..."). **Two axes give Talents two things to key on**, which is where the horizontal growth can live. Open: where the levels themselves come from (section 5, question 2).

### 3.3 A class has a fixed shape

- Stage 0 is 18 cards: 2 Features (the identity mechanic and a Rule-bender; every character of the class has them), a Hallmark Action and a Hallmark Reaction (a choice of two each), Arts (three Modes each, no damage: "the card you look at when attacking isn't the answer"), an Escalation ability at 2, 4 and 6, an Encounter Pick, the Apex at level 4. Every choice can be swapped on a Rest.
- The kinds a class must cover: Strike, Help, Compression, Rule-bender, Art, Ribbon.
- **So:** a caster class is not "a list of spells". Either its cards **are** spells (its Hallmark Action a spell of its Path), or its cards are **about casting** (how it readies, pushes, holds, merges) and the spells come from the grid. And **"swapped on a Rest" already is spell preparation**: every character in 2d12 re-chooses on a Rest, so a caster who readies spells needs no new rule, only a number.

### 3.4 The card rules a spell must obey, and where the grid strains them

| The rule (charter, Structure) | What it means for a spell | Strain |
|---|---|---|
| A Round Action does one main thing and at most one rider; 35 words a Version | A spell is one effect and one rider | **A merge adds a second Path's rider:** it must take the rider slot, not add a second rider |
| At most two Versions, and "two Versions are two uses, not two sizes" | A spell can't list "1 AP: one creature / 2 AP: a group" as Versions | **The scope ladder is sizes.** Overcast must be its own card element, not a Version |
| A card names at most one condition | One condition a spell | A merged rider is the second condition: allowed only through Overcast |
| "A number on a card is a die or a Modifier already on the sheet, never a new counter" | Path and School levels must be **on the sheet**, like Mastery | Fine if they are; Strain and gems would be new counters |
| No tracking across turns where "this turn" or "once a round" will do | Fading zones, held enchantments, linked casters all track something | Zones with rounds exist already; anything else needs a visible marker |
| Durations are EoT or rounds only ("until the encounter ends" is also used); no "save ends" | A held enchantment is "until the encounter ends" plus a way to break it | Needs the new trait ([Standing]) |
| A Tier 3 visibly beats a Tier 2; each Tier's line holds its whole result | As for every card | None |
| Line of Effect for everything a card does to a creature | As for every card | None |
| No one best button: "the turn is built from several Round cards" | With 4 AP a caster needs **two or three different Round spells** and something At-will from level 1 | It sets how many spells a level 1 caster must hold: about four |
| Flavor describes what is done and seen | Claude writes every spell's Flavor | None |

### 3.5 What already exists and can carry magic with no new rule

- **Frequencies:** At-will (a Bane on each repeat in a turn), Turn, Round, Encounter, Daily. Class cards already limit themselves this way.
- **Escalation** (1 to 6, rising each round, never spent) and the "Escalation needed" slot on a card's bar. Smite's dice already read it ("for each Escalation you have, up to 4").
- **An optional extra cost inside a card** (Smite: "you can spend your Reaction AP to roll 1 more Smite die"), drawn in Foundry as a chip in the roll window.
- **Power rolls, the Power DC (11 + Power Modifier), Ward Defense, Saves against an Attribute, [Save] Actions** with reversed Tiers and Cover.
- **Areas** (Burst, Emanation, Line), lasting areas with rounds and a side named in the sentence (Consecrated Ground).
- **Conditions:** Slowed and Quickened, Hindered, Immobilized (with Break Free and a DC from the origin's Modifier), Dazed, Staggered, Frightened, Taunted, Pressed, Vulnerable, Blinded and Half-Blinded, Lingering (damage each turn, ended by Shake Off), Empowered, Guard.
- **Stacking:** the same effect never stacks; the highest value counts; named bonuses (Field, Pressure, Support).
- **Nonlethal damage** and what happens when it dominates (Unconscious, not Dying).
- **Mastery by use** (Chapter 15): you gain 1 with a weapon when your side wins a normal or harder fight in which you struck with it; unlocks at set thresholds (the table in Chapter 15); "the group follows" at half. A whole growth system that is horizontal, already written, and already on the sheet.
- **[Split]** (an Action that is Weapon or Power by choice) and **[Signature]**, for a character who fights and casts.
- **Linked Actions, Setup, Interrupt and Trigger, Disrupted.**

### 3.6 What is missing and magic will need

- **A marker for "this is magic".** The Paladin's cards have [Power] and [Divine] and are not magic (decision 12), so [Power] can't be the marker. The 2026-10-29 entry named a **[Spell]** trait.
- **The word clash between a Path and a damage subtype.** "Fire" is already a subtype (Fi). A Paladin's Rimebrand deals Cold damage and is not a Water spell. The trait [Fire] (a spell of the Fire Path) and Fire damage must be two things in the text.
- **The poison subtype** (decision 13) and its two letters.
- **Tags** (Chapter 7: "the list is not written yet"): `dominions-rules.md` 5 has a worked list.
- **Summons:** no rules. Conjuration waits for them.
- **A light "tired" condition:** Exhausted is far too heavy for a spell's cost.
- **Skills and rituals:** D3 was planned before D4 ("spells may use skills"). Battle magic is being designed first; everything out of combat is parked.
- **The Talents themselves** are set aside; magic can't be finished before their structure is decided.
- **The SIM has no caster,** so nothing here is priced yet.

---

## 4. Tensions found (to settle, not yet asked one by one)

1. **Dominions' two numbers rise together** (17 off-diagonal battle spells in 442). 2d12 wants them independent (decision 6). The off-diagonal spells must be written on purpose, or the two levels will in practice be one.
2. **"Excess Path level grows the damage"** (decision 6, as first worded) against **horizontal growth** and **no cap** (decision 14). Proposed reading: excess Path level grows the *substance* only as options (the rider, a merge, a second target), and damage dice belong to the Stage.
3. **The scope ladder is "sizes"**, which the charter forbids as Versions. It needs its own element on the card.
4. **Six Talents for one cell.** If every level of a Path and of a School is a Talent pick, a character with one Talent a level reaches "Fire 3 • Evocation 3" at level 6 with nothing else. Levels need a cheaper source than one Talent each.
5. **How many spells a caster holds.** One Pick a level (the class shape) gives a caster too few buttons for "no one best button"; a whole Path list at once gives too many to read.

---

## 5. The six questions of 2026-11-18 (ANSWERED: decisions 16 to 21; kept for the alternatives)

1. **The marker of magic.** A spell is a Power Action with three new traits: **[Spell]**, its Path ([Fire]) and its School ([Evocation]). Divine cards have none of them.
2. **Where Path and School levels come from.** Default: **the weapons' way.** A Talent (or a class) *opens* a Path or a School at level 1; after that the level **rises by use**, as Mastery does, at set thresholds. Talents then add tricks keyed on the trait, never levels. Alternatives: every level a Talent pick; or levels only from a class's level list.
3. **What a level gives.** Default: never a number on a roll or a DC. A level unlocks the spells that ask for it and gives Overcast steps on the spells below it; damage dice grow with the Stage only.
4. **How a character holds spells.** Default: **you know every spell whose two minimums you meet, and you ready a set number of them on a Rest** (the Rest swap that every class already has). Wide knowledge, a narrow hand. Alternative: each spell is its own pick.
5. **What pays for an Overcast step.** Default: **the fight's own clock.** A step needs Escalation (the first at 2, the second at 3...), so spells grow as the fight does, like Smite's dice; and the Nonlethal push (decision 2) lets you take one step early. Alternatives: nothing (the level is enough); 1 more AP a step; always the push.
6. **Classes.** Default: **spells belong to the grid, classes own how you cast.** A caster class's Features and Hallmark cards are about readying, pushing, holding, merging or linking (and it starts with a Path and a School open); any class can take a little magic through Talents. Alternative: each caster class has its own spells as its cards.

---

## 5b. The Paths: definitions, subtypes and riders (DECIDED 2026-11-18: decision 23)

From `dominions-paths.md` (section 2 and 3.5), with the borders of decision 15. **The rider is the one condition a Path adds** when a spell has a rider, and what a second Path lends in a merge. Each is a word Chapter 8 or Chapter 3 already defines, and no two Paths share one.

| Path | It is | Damage subtype | Rider on an enemy | Why this one | The runner-up |
|---|---|---|---|---|---|
| **Fire** | Flame, heat, rage | Fire | **Lingering Fi** | It keeps burning (Dominions' Burn and heat clouds) | none |
| **Air** | Wind, storm, lightning | Electricity, Thunder | **Pushed** | The wind moves you; a positional rider for a tactical game | Staggered (the shock's stun, softened) |
| **Water** | Water, ice, cold; tempo | Cold (Acid with Fire) | **Hindered** | Cold and slime slow; rider-sized (Slowed takes AP, so it is a main effect) | Slowed 1 |
| **Earth** | Stone, metal, weight | Blunt, Slash, Pierce | **Prone** | The ground itself throws you down; leaves Immobilized to Nature | Immobilized (its grip) |
| **Astral** | Magic itself, the stars, the will, fate | Force | **Dazed 1** | Paralysis, softened to 1 AP lost | Staggered |
| **Death** | Death, decay, darkness, the dead | Unholy | **Frightened** (of you) | Its real fear; Dominions' only Fear bless | Sickened |
| **Nature** | Life, growth, beasts, poison | Poison (new), Pierce | **Immobilized** | Vines and webs; Break Free already exists | Lingering Po |
| **Glamour** | Illusion, dreams, emotion, luck | Psychic | **Pressed 1** | It can't see you truly: Banes on its Strikes (Dominions' Blur) | Half-Blinded |

**The lean of the roll** (from `dominions-paths.md` 1.7; proposed, not a rule): an Element's spell attacks the body (a roll against Armor Defense, or a Body or Instinct Save); a Sorcery's attacks the mind (Ward Defense, or a Mind or Appeal Save). The card always writes its own.

**What each Path gives an ally** (for helpful spells; a first list, not asked yet): Fire: Empowered. Air: a free step. Water: Quickened. Earth: Guard. Astral: the next instance of damage cancelled. Death: healing from damage dealt. Nature: healing. Glamour: attackers Pressed.

## 5c. Overcast: how a spell grows (DECIDED 2026-11-18: decision 26)

Decided already: Overcast reads both levels (6); a level is never a number on a roll (18); a step needs Escalation, the first at 2, the next at 3 (20); the push takes one step early (2, 20). The charter forbids sizes as Versions, so **Overcast is its own line on the card**, after the Tiers.

**A step.** When you cast a spell, you can add Overcast steps to it. Each step needs **one level above the spell's minimum** in the axis it belongs to, and the fight's clock: your first step needs Escalation 2, your second Escalation 3, and so on.

**Form steps (paid by excess School level): three ladders, the same in every spell.** The card lists which it may climb ("Overcast: Reach, Breadth").

| Ladder | Its rungs | From |
|---|---|---|
| **Reach** | Reach → 5 sq. → 10 sq. → 15 sq. (+5 a step) | Dominions' "+5 squares a level" on Evocations |
| **Breadth** | yourself → one creature → two creatures → 1 Burst → 2 Burst | Dominions' scope ladder (personal, one, group, area) |
| **Hold** | EoT → 1 round → 3 rounds | the charter's two durations; a magic that stands is an Enchantment and isn't on this ladder |

Each School's usual pair: Evocation: Reach and Breadth. Alteration: Breadth and Hold. Thaumaturgy: Reach and Breadth. Warding: Breadth (who is protected). Enchantment: Breadth (its area) and how hard it is to break. Conjuration: waits for the summons rules.

**Substance steps (paid by excess Path level): written on each spell, plus one universal.**
- **The spell's own step:** one line a spell, the thing that makes it itself (Dominions: "each spell grows a different number": one more dart, a chain to an adjacent creature, the flames stay on the ground).
- **Merge (universal):** add the rider of a second Path you have. The spell also gains that Path's trait for this casting. It takes the spell's rider slot: a spell that already has a rider swaps it, never carries two.

**Why split it this way.** The form ladders are one rule learned once (the "intuitive" test); the substance step is where each spell stays special (decision 24).

## 5d. Mastery for magic: how levels rise and spells are gained (DECIDED 2026-11-18: decision 27; point 2 changed to ONE point a fight, in a Path or a School)

Decided already: levels grow with use, the weapons' way, opened by a Talent or a class (17); Mastery unlocks choices of spells and Talents can grant more (19); no cap (14). Chapter 15's weapon rule is the model: 1 Mastery with a weapon you struck with when your side wins a normal or harder encounter; unlocks at 10, 20, 30, 45, 60; Mastery is yours, not the weapon's.

1. **Opening.** A Magic Talent (or a class) **opens one Path and one School together**, each at level 1, and you choose **two spells** you meet the minimums for. A later Talent opens one more Path or one more School (one spell chosen). Opening alone never needs a second Talent before you can cast.
2. **Gaining.** You have a Mastery with each Path and each School you have opened. When your side wins a normal or harder encounter in which you cast a spell, you gain **1 Mastery with one Path and 1 with one School** you cast in it. This is beside the weapon's point, not instead of it.
3. **Levels.** Level 2 at 10 Mastery, 3 at 20, 4 at 30, 5 at 45, 6 at 60: the weapons' own numbers. At about five fights a character level that is a level of a Path every two or three character levels.
4. **Spells.** Each time a Path or a School reaches a new level, **you choose one spell** you meet both minimums for. Spells are choices of your build, so they can be swapped on a Rest like every other choice (each new one must be a spell you could have chosen).
5. **Not taken from the weapons:** "the group follows" (half your best Mastery for every weapon of the group). Paths have two families (the Elements, the Sorceries) and it could apply to them, but an unopened Path can't be cast at all, so it would only matter after a second opening. Left out unless Lucas wants it.

**Why one point (Lucas's question).** A point in each axis made both level 2 by character level 3 and 4 / 4 by level 7, and kept the two axes always equal, which removes the choice between depth in a Path and depth in a School. With one point: 2 / 1 around level 3, 3 / 1 or 2 / 2 around level 5, 4 / 2 or 3 / 3 around level 9, 6 / 2 or 4 / 4 at level 15; the first level 2 comes when a weapon user unlocks their Weapon Technique. Mastery then gives few spells (2, then 3 around level 3, 4 around level 5): Talents and the class give the rest.

**What it gave before the change (kept for the record).** A character who opens Fire and Evocation at level 1 holds 2 spells; around level 3 both are level 2 and they hold 4; a second Path opened by a Talent adds a spell at once and its own track. Talents never add levels: they open, grant extra spells, or change spells by trait.

## 5e. A magic that stands: the Enchantment's rule (DECIDED 2026-11-18: decision 28: A, with room for B; the names open)

Decided already: anything that stands is an Enchantment (10); [Focus] is not its marker (7); durations are EoT, rounds or the encounter (the charter). Sources: Dominions (a battlefield enchantment lasts while its caster is on the field), Draw Steel (a persistent ability taxes each turn's income and all end on one turn of heavy damage: `research/caster-class-shape.md`).

A new trait, working name **[Standing]**. Common to the three: it lasts until the encounter ends, until you go Down, or until you end it (no Action).

- **A, one at a time.** You hold one [Standing] spell; casting another ends the first. Nothing to pay, nothing to count. Dominions' feel, the least text.
- **B, as many as you pay for.** Each one you hold makes you Slowed 1 (increasing): a held spell costs 1 AP every turn. Draw Steel's idea in 2d12's words; a real choice each fight, more to track.
- **C, one free, a second for a price.** One as in A; a second makes you Slowed 1.

**How an enemy breaks it** (with any of the three): it ends **when you become Bloodied or Strained**. Both are moments the whole table already sees (the GM announces them), so no threshold is added to the sheet; you can cast it again afterwards. The protection School's dispel is the other way.

Claude's pick: A, with the break on Bloodied or Strained.

**The two kinds after decision 28, and their names (DECIDED 2026-11-18, decision 29: [Woven] and [Sustained]; the candidates below kept for the record).** [Focus] can't be used (it is concentration, on every spell: decision 7).
- **The one-at-a-time kind (A):** Claude's pick **[Bound]** ("you can have one Bound spell; casting another ends it"). Others: Anchored, Woven, Attuned, Enduring.
- **The paid kind (B):** Claude's pick **[Sustained]**, with a cost on the card ("Sustain: 1 AP"): at the start of your turn you pay it or the spell ends; you can sustain as many as you can pay for. "Sustain" already means exactly this to players of Pathfinder 2e. Others: Maintained, Channeled.
- Both end when you go Down, when you choose, at the end of the encounter, and when you become Bloodied or Strained.

## 5f. The push: Overreach (DECIDED 2026-11-18, decision 30: C, 1d6!, named Overreach)

Decided already: Nonlethal damage as extra fuel is an option, never the main cost (1, 2); an Overcast step needs a level above the minimum and Escalation (20, 26); the push takes one step early (20). Sources: Dominions' gem (+1 level for one spell, never +2), Ars Magica (a casting that falls a little short still works, and tires you).

**What a push buys: one Overcast step you couldn't otherwise take, once a casting.**
- **A, the clock only.** It ignores the Escalation the step needs; you still need the level. A round-1 tool for those who have the levels.
- **B, the level only.** It counts you as one level higher in the spell's Path or School; the Escalation is still needed.
- **C, either.** One step that ignores what it needs, whichever is missing. A level 1 caster in round 1 can already stretch a spell, at a price.

**What it costs:** Nonlethal Resolve damage to you, **1d6!** (a die, as the charter asks of a number on a card; exploding, so pushing is never quite safe). It is a cost: Guard doesn't take it and nothing reduces it. Against a Health Pool of about 30 it is a real price, and Chapter 4 already says what happens if it adds up (Down with half the pool in Nonlethal damage is Unconscious, not Dying).

Its name is open ("push" is a working word): Strain, Overreach, Surge.

Claude's pick: C, 1d6!, once a casting.

## 5g. The basics on one page (as decided up to decision 30; the wording is Claude's draft, not rules text)

**A spell** is a Power Action with the traits **[Spell]**, one **Path** and one **School**, and it writes a minimum level in each ("Fire 2 • Evocation 1"). You can cast it if you have chosen it and meet both. Every spell needs concentration ([Focus]).

**The eight Paths** (what the magic is made of), each with its damage subtype and its rider: Fire (Fire; Lingering), Air (Electricity, Thunder; Pushed), Water (Cold; Hindered), Earth (Blunt, Slash, Pierce; Prone), Astral (Force; Dazed 1), Death (Unholy; Frightened), Nature (Poison, Pierce; Immobilized), Glamour (Psychic; Pressed 1). Blood and the Divine are outside the grid.

**The six Schools** (what the spell does), sorted by the main effect; a rider never changes the School:
1. It leaves a magic that you hold → **Enchantment** (lay). Its spells are [Woven] or [Sustained].
2. It brings a creature or an object → **Conjuration** (bring).
3. It stops or undoes something: a blow, a spell, a presence → the protection School (stop; name open).
4. It releases the Path on a target, to harm or to heal → **Evocation** (release).
5. It works on a mind or on the senses → **Thaumaturgy** (command).
6. Anything else: a creature or the ground changed for a set time → **Alteration** (change).

**Held magic.** **[Woven]:** you hold one Woven spell; casting another ends it. **[Sustained]:** "Sustain: 1 AP" at the start of your turn, or it ends; as many as you pay for. Both end when you go Down, when you choose, at the end of the encounter, and when you become Bloodied or Strained.

**Getting magic.** A Magic Talent or a class **opens** a Path and a School together at level 1, with two spells of your choice. A later Talent opens one more Path or School (one spell). When your side wins a normal or harder encounter in which you cast a spell, you gain **1 Mastery in a Path or a School** you cast in it. Level 2 at 10 Mastery, 3 at 20, 4 at 30, 5 at 45, 6 at 60; no cap. At each new level you choose one spell. Spells swap on a Rest. Talents grant more spells and change spells by trait; they never give levels.

**A level** is never a number on a roll or a DC. Dice grow with the Stage.

**Overcast** (its own line on a card). A step needs one level above the spell's minimum in its axis, and the fight's clock: your first step needs Escalation 2, your second Escalation 3. **School levels** climb the form ladders the card lists: **Reach** (Reach → 5 → 10 → 15 sq.), **Breadth** (yourself → one creature → two → 1 Burst → 2 Burst), **Hold** (EoT → 1 round → 3 rounds). **Path levels** pay the spell's own step (written on it) or a **Merge**: the rider of a second Path you have, in the rider slot; the spell gains that Path's trait for the casting.

**Overreach.** Once a casting, take one Overcast step you couldn't otherwise take, for 1d6! Nonlethal Resolve damage that nothing absorbs or reduces.

**Still open in the basics:** the protection School's name; healing's School (Evocation as "the Path released", proposed); summons (so Conjuration); how much AP and which Frequency a spell of each size has; the Tags; Talents' structure.

## 6. The order of work from here (proposed)

1. Lucas's answers to section 5.
2. The Paths' one-line definitions, subtypes and riders, from `dominions-paths.md` (borders decided).
3. The Schools' definitions and what each one's Overcast ladder is.
4. The new traits and words, each with its rule ([Spell], the Path and School traits, [Standing], Overcast, the push).
5. Dominions' own spells pulled and shown as 2d12 cards (decision 25), as the grid's test.
6. The first cards, for three or four Paths, in the analysis format of `paladin-analyses.md`.
7. A first class, by the charter (a record and a reading page).
