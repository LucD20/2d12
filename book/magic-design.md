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
| 31 | **The sixth School is Abjuration, for now** ("Warding" clashed with Ward Defense and the Ward value). | "Abjuration for now." | 2026-11-18 |
| 32 | **Overcast is capped:** at most one step on each ladder a casting. | "1. Cap." | 2026-11-18 |
| 33 | **Buffs: rounds is the main way, and all three work together** (a count of rounds; one [Woven] spell over several allies; [Sustained]). | "Well, rounds is usually the main way, but I can see all working together." | 2026-11-18 |
| 34 | **Riders will never be rated perfectly, so spells follow more open rules:** a spell can have "descriptions of their own and rules inside themselves". Reference: **Crucible**, the Foundry system, where "adding a word to the spell shapes it" (an arrow + cold makes a ranged cold attack). | "Yes riders aren't ever going to be rated perfectly, which is why spells can follow more open rules. They can have descriptions of their own and rules inside themselves." | 2026-11-18 |
| 35 | **The first pass is done:** seventeen Dominions spells as 2d12 cards, with what held and what strained: `book/cards/magic-first-pass.md`. A test, not a spell list. | "You can get spells from dominions, simple ones and more complex ones, and see how they hold up." | 2026-11-18 |
| 36 | **Healing magic gives Guard, not Health (A).** No real healing from spells, "not yet". The Paladin stays the one who unlocks Rally Points. | "A, we shouldn't go with C, not yet." | 2026-11-18 |
| 37 | **Summons, the direction:** a summon is **a creature of about your level with stats like a Minion's, growing as your level does**; **"build your summon"** from a menu, as Savage Worlds does, but **at preparation, not at each casting**; **limited on purpose**, because "summons are famous for being fun killers". | "Idea is to summon a similarly leveled creature, with a stats similar to minion and it can grow as level goes up. Similar to swade, summoning can have its own 'build your summon', which we can make per preparation instead of per casting. Keeping in mind to limit summons." | 2026-11-18 |
| 38 | **Charm and confusion are "weirdly placed"** (researched: `research/charm-confusion-summons.md` part 1): in D&D they are Enchantment spells, where 2d12's Enchantment is held magic; "charm" covers two different effects (can't harm the charmer; outright control); they are trouble when used on players. Not yet decided how 2d12 does them. | "Confusion and charm is... weirdly placed. Make a search about those topics and you will know why." | 2026-11-18 |
| 39 | **Charm, control and confusion: Claude's three shapes are accepted** (Charmed by a creature = you can't target it with a harmful Action; control = one Action of the caster's choice, never a turn; confusion = "its next Strike must target the creature nearest to it"). **His point is losing a turn:** confusion and fleeing "feels bad even for GMs"; "one thing is minor enemies losing turn, other is major or PCs". **So some spells can be stronger against Minor enemies.** | "My point is exactly losing a turn. [...] So we can make some spells be stronger against minor enemies for instance. [...] Your ideas are really good, for charmed control and confusion." | 2026-11-18 |
| 40 | **An idea, not decided: an enemy of a lower level or Stage can count as a Minor enemy,** "to give the feeling of progression". (It meets Claude's suggestion in the parked Health question: an enemy two Stages below is a Minion to you.) | "Which could also help with progression: just an idea: lower level/stage can count as minor enemies, to give the feeling of progression." | 2026-11-18 |
| 41 | **A summon is paid by Sustain: 1 AP, and has a Minion's 3 AP (A).** | "Summon: A." | 2026-11-18 |
| 42 | **One big jump a ladder is not good** (against Claude's rewrite of the rungs after the cap). To go deeper, the core of Dominions' mechanics is to be read first. | "Cap: I see, one big jump isn't good I think. To make this more in depth: if you haven't already, read on and research the core of Dominions 6 mechanics, that are important for its magical system. You will likely find where my exploding dice idea is from." | 2026-11-18 |
| 43 | **Overcast has no cap of its own (A), with small rungs.** A step needs a spare level in its axis, and a casting holds as many steps as your Escalation minus 1; nothing else limits it. The rungs: **Reach +2 squares, Breadth +1 creature, Hold +1 round** a step; **"one creature" to "an area" is a different spell**, and an area spell's own Breadth step is +1 to its Burst or Emanation. **This replaces decision 32** (one step a ladder), which was made for rungs that tripled an area. | "Let's do a for cap decision." | 2026-11-18 |
| 44 | **The summons rule is decided as proposed (5k, points 1 to 7).** Point 5 stays: a summon leaves when its caster becomes Bloodied or Strained, like every [Sustained] spell; **a Talent tree will later lift it** ("I think this is the best way"). The general lesson, his: **"Remember, progression is horizontal"**: the base rule carries the limit, and Talents are where a character grows past it. | "Let's remove number 5, strained and bloodied don't remove it immediately. Or we keep it and later make a talent tree for it (I think this is the best way). Remember, progression is horizontal." | 2026-11-18 |
| 45 | **The second pass is done, with a double check:** 26 spells against the basics, audited by an independent reader (36 findings) and corrected: `book/cards/magic-second-pass.md`. Its "Found" table lists 16 points to decide or write; its last section lists what the checks changed. | "Do A. Do a double pass to make sure you haven't forgotten anything." | 2026-11-18 |
| 46 | **[Spell] does what [Ranged] does while Engaged, except a [Melee, Spell].** A spell cast while you are Engaged takes the ranged penalty whether or not it has [Ranged]; a spell with [Melee] doesn't. This closes the review's B3 for spells that roll. **Still to write:** what it means for a [Save] spell (the caster rolls nothing: Claude's draft is that the targets' Saves are Favored, as High cover already makes them), and the [Melee] trait's text, which today says "these Actions need a melee weapon used in hand". | "Ranged while engaged: we can simply say Spell trait makes the same thing, except for [Melee, Spell]." | 2026-11-18 |
| 47 | **The class charter is not magic's charter.** Magic is balanced differently from class cards; "none is supposed to be stronger than the other, what makes something strong is the situation it is used in and how it is used". **The limits decided in this record (5m) are magic's only limiters and charter for now: nothing from the class.** This withdraws what the first two passes took from `class-charter.md`: one condition a card, the word budget, one main thing and one rider, "never only bigger", no tracking across turns, no silent bonus. Still binding: the book's own rules and the card Structure. | "Yeah class charter isn't the magic charter, they are different so they are balanced differently; none is supposed to be stronger than the other, what makes something strong is the situation it is used in and how it is used. The limits we have been putting should be the only limiters/charter for now, nothing from the class." | 2026-11-18 |
| 48 | **The third pass:** nineteen new spells written under magic's own charter: `book/cards/magic-third-pass.md`. | "Read the research and give me the summary, plus new cards if you don't have questions." | 2026-11-18 |
| 49 | **This is what spells should be:** "unique, cool sounding, you can make arguments for out of combat uses". The classes got hard limits because they are beginner classes, "to start out"; **Talents and such will likely be rules-altering like spells in the long run, and later classes, Talents and the Paladin's and Archer's features would get the same treatment.** | "But yes, this is exactly what I want for spells. Unique, cool sounding, you can make arguments for out of combat uses. For classes, I wanted hard limits because they are more beginner classes [...]. But talents and such, will likely be 'rules altering' like spells as well in the long run." | 2026-11-18 |
| 50 | **Circle's length is fine** ("spells are ok to feel different"); **Darkness as a refuge is fine for now; Mind Burn is fine, with Psychic damage** in place of Force. So: **a Path's damage subtype is its usual one, not its only one;** the subtype follows what the spell does. | "Circle length is fine [...]; Darkness is fine for now; Fine as well, but wouldn't psychic damage fit best in such a spell?" | 2026-11-18 |
| 51 | **Cones: the shape is Lucas's picture** (`research/raw/2026-11-18-cones-lucas.png`; `research/cones.md`). Two valid placements only: in front of you, or on a corner; never from an intersection aimed straight. Not to be written in full yet. A rule that gives his four shapes exactly: every square within N of you (the book's distance) in one quarter around you. | "Cone is simple, see image for how cones should be. [...] these are the only valid placements: in front of you or on a corner." | 2026-11-18 |
| 52 | **A correction to 49:** a spell doesn't NEED to be unique, cool-sounding and arguable out of combat, **but should aim to be.** | "What spells should be: Doesn't NEED to be, but should aim to be." | 2026-11-18 |
| 53 | **The limiters are reopened, and two things are to be researched before any decision.** (a) **Nonlethal damage:** today a 10-minute Breather removes all of it (Chapter 4), which Lucas "already wasn't happy with", and which makes Overreach nearly free between fights (**Claude had missed this rule and called Overreach "a real price"**). His alternative: Nonlethal is removed like normal damage and completely after a Sleep; its problem, in his words: "Martials don't need rest, casters do. Even if Overreaching is optional, I feel players might spam it." (b) **A resource for both:** "A 'Stamina' mechanic that expands to Martials, differently named. Casters use Mana, Martials use 'Stamina'. This is an extra layer yes, but I have heard good things about Battlemaster and martial abilities that are similar to casting in the sense of they use a certain resource." | "These two above could make use of an extensive search." | 2026-11-18 |

| 54 | **The research for decision 53 is in: `book/research/resources-and-recovery.md`** (three raw reports in `research/raw/`). Nothing decided. Its findings: a cost is priced by its recovery clock (a 10-minute cost is free unless the breather spends something slow); Nonlethal on the Sleep clock is a daily resource (the Pathfinder 1e kineticist's burn: avoided, dropped in its remake), softened in 2d12 because Health is already everyone's slow clock; a pool for martials is liked when it is small, refreshed every fight or built in it, spent for a rider at the moment of the hit and shaped differently from the caster's, and disliked when daily or identical for every class (4e); every pool needs a nova rule; tracking is the standing objection (Lucas's own 2026-11-14 "nothing new to track"). Claude's opinion, given to Lucas: fix the Breather first (it is a Chapter 4 question that magic only exposed), and try a pool only after. | Lucas to decide, one at a time |
| 55 | **Nonlethal damage leaves on a Sleep, not on a Breather (Lucas: "A then").** Nonlethal damage is removed like any other damage (a Rally Point, a heal, a Rest), and completing a Sleep removes all of it. The Breather no longer removes it. **So Overreach's 1d6! is a real price:** it stays until a Sleep unless a Rally Point or a heal is spent on it, the same slow clock everyone's Health is on. What follows, not decided: the Breather has no effect left in Chapter 4 (removing Nonlethal damage was its only one); Nonlethal's differences from Lethal are now two (it doesn't kill; a Sleep clears it, where Lethal waits for a Rest). A Chapter 4 change: logged in `rules-backlog.md`, not written into rules-src yet. | Decided; the book not changed |
| 56 | **The Breather is deleted (Lucas: "A, delete it").** Recovery is a Sleep and a Rest. Kept in the backlog; Chapter 4 not changed while the brainstorm runs. **A Stamina pool for martials beside a Mana pool for casters is parked as a candidate** (Claude's opinion "not yet", decision 54; Lucas moved on without taking it up; it is his to reopen). | Decided; the book not changed |
| 57 | **Overreach is a line on some spells, not a rule of magic (Lucas: "C for sure"; it replaces decision 30's general rule).** Only a spell that prints an **Overreach** line can be Overreached; the line says what it buys and what it costs, for that spell. So the price follows the spell (a bigger spell prints a bigger price, or a price of its own), and there is no general "one step you couldn't take". What decision 30 leaves standing until said otherwise: once a casting; the usual price is Nonlethal Resolve damage that Guard doesn't take and nothing reduces; exploding dice. Open: whether the die is sized by Stage; which spells get a line (no card in the three passes prints one yet, so none can be Overreached today). | Decided |
| 58 | **What every Overreach line shares (Lucas: "B").** (1) Once a casting; you decide when you cast, before any roll. (2) The price is paid even if the spell misses or is resisted. (3) The usual price is Nonlethal Resolve damage that Guard doesn't take and nothing reduces, with exploding dice; a card may print another price. (4) **The card prints the whole price ("2d6!") and it never changes with Stage** (the die sized by Stage was refused). (5) What it buys is free-form: a step taken early, an effect the spell can't otherwise reach, a stronger version. First drafts of lines: `book/cards/magic-overreach-lines.md`. | Decided |
| 59 | **An Overreach line may get past one of magic's limits, but only once, and the line says so (Lucas: "A").** "A second time in this encounter", "one casting of this kind": the limit still holds and Overreach buys one exception at its price. A line that lifts a limit without a count is not allowed. First cases: Earthquake (its Encounter Frequency) and Darkness (the one-[Woven] limit), `book/cards/magic-overreach-lines.md`. | Decided |
| 60 | **No limit across the fight, for now, and watched closely (Lucas: "Try A for now, but keeping a close watch").** In play a caster is held by AP, Frequency and Escalation, as a martial is; nothing runs down but Overreach's damage and Health. A cost for repeating a spell and a fatigue counter (Dominions' way) stay as the two fallbacks. **What to watch in playtests:** one Round spell cast every round of every fight (a best button); whether a caster's long day differs from a short one; whether casters ask for a Sleep sooner than martials. | Decided for now; on watch |
| 61 | **An area spell doesn't grow in size (Lucas: "C, we can likely make it a Talent later").** An [Area] spell has no Breadth: its Overcast climbs Reach and Hold only, and a bigger area is the next spell of the line (decision 43). **A Talent may open area growth later** (seed added to 5l). | Decided |
| 62 | **One Summon spell for each Path (Lucas: "Yea, A").** Eight cards, each "Path 1 • Conjuration 1", each with its Path's theme and its own menu; every spell keeps exactly one Path, so Mastery and Talents key on it with no exception. Stronger summons at higher minimums can come later as further spells; nothing blocks them. The summons rule itself is 5k. | Decided |
| 63 | **A spell may be written with two Paths, as a rare spell (Lucas: "A is good").** A card may print two Paths and one School ("Fire 2 • Earth 1 • Evocation 1"). You need all three minimums. It counts as a spell of both Paths for Talents and for Mastery. Spare level in either Path pays its Overcast substance step. It can't take a Merge: it already is one. Since a caster opens one Path at level 1, these are spells of the middle levels. It amends decision 5's "one Path": one Path is the rule, two the rare exception; never three (Claude's assumption, to confirm). | Decided |
| 64 | **A spell may use another Path's rider as its own effect, freely (Lucas: "A").** A rider is only what a Path gives through a Merge; the conditions belong to Chapter 8, and any spell may use one when its fiction calls for it (Gust's Prone, Tangle Vines' Hindered). The same reasoning as a Path's damage subtype: its usual one, not its only one. | Decided |
| 65 | **The order for sorting a spell into a School (Lucas: "A"; the writer's rule, kept here and not in the rulebook, since a card prints its School). The first yes decides:** (1) it brings a creature or a thing that wasn't there: **Conjuration**; (2) it answers or stops something (an Interrupt, undoing an effect, Guard against harm): **Abjuration**; (3) it is held ([Woven] or [Sustained]): **Enchantment**; (4) its main effect is damage: **Evocation**; (5) otherwise, by what it changes: the body or the ground, **Alteration**; the mind or the senses, **Thaumaturgy**. It sharpens decision 10 ("lasting wins" now comes after a body and after a stop). Moved by it: the summons to Conjuration, Regrowth to Abjuration. | Decided |
| 66 | **An idea of Lucas's, not decided: Escalation as a currency beside the level.** The level that rises in a fight (today's Escalation, never spent) would be called Momentum; Escalation would be points gained whenever the level rises, spent without lowering it, gone at the end of the encounter. For magic it would turn Overcast's "steps up to Escalation minus 1" (20, 43) into a price in points. Logged with Claude's opinion in `rules-backlog.md`. | Open: an idea |
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

### 3.4 The card rules a spell must obey, and where the grid strains them (WITHDRAWN for magic by decision 47: these are the class charter's rules; kept here as the record of what was assumed until then)

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

**Replaced in part by decision 57 (2026-11-18): Overreach is no longer a general rule. Only a spell that prints an Overreach line has it, and the line gives what it buys and its price. What follows is the earlier general rule, kept as history.**

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
3. It stops or undoes something: a blow, a spell, a presence → **Abjuration** (stop).
4. It releases the Path on a target, to harm or to heal → **Evocation** (release).
5. It works on a mind or on the senses → **Thaumaturgy** (command).
6. Anything else: a creature or the ground changed for a set time → **Alteration** (change).

**Held magic.** **[Woven]:** you hold one Woven spell; casting another ends it. **[Sustained]:** "Sustain: 1 AP" at the start of your turn, or it ends; as many as you pay for. Both end when you go Down, when you choose, at the end of the encounter, and when you become Bloodied or Strained.

**Getting magic.** A Magic Talent or a class **opens** a Path and a School together at level 1, with two spells of your choice. A later Talent opens one more Path or School (one spell). When your side wins a normal or harder encounter in which you cast a spell, you gain **1 Mastery in a Path or a School** you cast in it. Level 2 at 10 Mastery, 3 at 20, 4 at 30, 5 at 45, 6 at 60; no cap. At each new level you choose one spell. Spells swap on a Rest. Talents grant more spells and change spells by trait; they never give levels.

**A level** is never a number on a roll or a DC. Dice grow with the Stage.

**Overcast** (its own line on a card). A step needs one level above the spell's minimum in its axis, and the fight's clock: your first step needs Escalation 2, your second Escalation 3. **School levels** climb the form ladders the card lists, in small rungs (decision 43): **Reach** +2 squares a step, **Breadth** +1 creature a step (an area spell: +1 to its Burst or Emanation), **Hold** +1 round a step. One creature to an area is a different spell. A casting holds as many steps as your Escalation minus 1. **Path levels** pay the spell's own step (written on it) or a **Merge**: the rider of a second Path you have, in the rider slot; the spell gains that Path's trait for the casting.

**Overreach.** Once a casting, take one Overcast step you couldn't otherwise take, for 1d6! Nonlethal Resolve damage that nothing absorbs or reduces.

**Still open in the basics:** healing's School (Evocation as "the Path released", proposed); summons (so Conjuration); how much AP and which Frequency a spell of each size has; the Tags; Talents' structure.

## 5h. The review before the first cards (2026-11-18; Lucas: "take a closer look on what we have so far, compare with the research, then compare with 2d12 rules. See if anything worth noting pops up")

Claude read section 5g against the six research notes and against Chapters 1 to 5, 7 and 8, the charter and Chapter 15's Mastery. **Nothing below is decided.**

### A. What holds up

- **The second Path as a dab.** In Dominions 118 of 188 two-Path spells ask level 1 of the second Path; Merge asks only that you have it.
- **Overcast on the fight's clock** replaces Dominions' "raise your own level" spell that every Path casts first, with no card and no action.
- **Breadth is Dominions' scope ladder** (yourself, one, a group, an area), and its bottom rungs match what the wiki calls a dabbler (itself, a touch) and an average mage (another creature).
- **Ward Defense already makes casters resist magic better** (11 + the target's Power Modifier): Dominions and Ars Magica both give a mage resistance from their own skill, and 2d12 has it without a rule.
- **A dabbler works.** A weapon class has Power Modifier +1 against a caster's +2: one point on the roll and the DC. A Magic Talent is worth taking with no other investment, which is what horizontal growth needs.
- **Held magic breaking on Bloodied or Strained** uses the system's own convention for hooks ("when it becomes", pack R's decision 11) and adds nothing to the sheet.
- **Mastery by use** is the weapons' rule with the weapons' numbers: one table, one sentence to learn.

### B. Problems found (each needs a decision or a rule)

1. **Overcast is free power that grows every round, and nothing prices it.** A step costs no AP: a spare level and the clock. By round 3 a Round spell can hold two steps (two creatures become a 2 Burst), where a martial's growth over the same rounds is three Passives and an Encounter card (Smite: +1d6 a point of Escalation, once a fight). With Momentum 4 a party starts at Escalation 5: four steps in round 1. **The SIM has no caster, so this is unmeasured.** A cheap guard to consider: at most one step on each ladder a casting, so a spell that lists two ladders tops out at two form steps and one substance step.
2. **"Lasting wins" plus "one Woven spell" removes the buffer.** Almost every Dominions buff lasts the battle and a mage stacks them (Stoneskin on each fighter, the scope ladder up to the whole army). In 2d12 a buff that lasts the encounter is an Enchantment, so [Woven], so **one at a time**. The Earth "armorer" and the Nature healer-buffer can keep one buff up. The ways out: such buffs are Alterations with a count of rounds (3 rounds is nearly a 3.5-round fight, so the Hold ladder's top quietly replaces Woven); or a Woven spell covers several creatures through Breadth; or buffs are what [Sustained] is for.
3. **A Save spell escapes the cost of range.** "Using a [Ranged] Action while you are Engaged is very hard: the roll is Doomed" (Chapter 3), but on a [Save] Action the caster doesn't roll, so nothing is Doomed. The charter's rule 22 says a cost of a class's range "is never erased for free". Chapter 1's Save Actions cover Cover and Senses, not Engaged. A rule is missing ("the targets' Saves are Favored", or a Boon on them).
4. **A ladder step can change a spell's traits, and no sentence says so.** Reach turns a touch spell into a [Ranged] one (Engaged, range Banes); Breadth's Burst turns it into an [Area] one (it ignores Senses, Line of Effect from the Point of Origin, and **it affects every creature in it, allies included**). Needed: "the spell gains the trait", and whether a Burst from Breadth spares allies.
5. **A Merge has no Tier and no numbers.** "Add the second Path's rider" doesn't say on which Tiers, for how long, or how much (Lingering needs a value, Pushed a distance, Frightened and Hindered a duration). Each Path needs **its rider written once as a full line** (for example "Lingering [V] 1d4 Fi", "Pushed 2", "Hindered (EoT)") and one sentence for where it lands (on a Strike, Tier 2 and 3; on a Save, Tier 1 and 2).
6. **The eight riders are not the same size.** Dazed 1 takes an AP now (the charter prices an unused AP at 12 points), and two Dazed 1 from two spells take two; Immobilized costs an AP to leave; Hindered (EoT) and Pressed 1 are small. If every spell can Merge, the best rider is the best button. They need pricing, or durations and values that level them.
7. **Two spells from Mastery against "no one best button".** A Round frequency and 4 AP mean a caster with two 2-AP spells casts the same two every round: the turn Lucas found "quite boring" on Double Shot. A caster class must bring the variety in its own cards, or opening gives three spells and one of them is At-will.
8. **The grid needs off-diagonal spells, and many cells.** With one point a fight the axes part (Fire 3 / Evocation 1), but Dominions has 17 such spells in 442. Suggested rule of thumb for writing: **most spells ask for 1 or 2 in each axis, and mastery shows through Overcast**; a spell with a high minimum is a rare signature. Even so, three Paths by four Schools by three spells is 36 cards for the first test.
9. **The School sorting has one soft edge left.** A spell that only Immobilizes, or only frightens: Dominions files its five "hold" spells in five different Schools. Proposed sharpening: **Evocation's main effect is a number on Health** (damage or healing); a condition of the body or a change to the ground is **Alteration**; a condition of the mind or the senses (Frightened, Dazed, Pressed, Half-Blinded) is **Thaumaturgy**.
10. **A gish's Mastery is undefined.** Decision 27 says one point a fight in a Path or a School, "the weapon rule exactly"; 5d's first draft said it sits beside the weapon's point. Does someone who strikes and casts in a fight gain one point in all, or one for the weapon and one for the magic?
11. **Mastery depends on how often the table fights.** Chapter 15 notes that "a rule to help a table that fights less than about five times a level" is not written. Magic leans on that pace twice (levels and spells).
12. **A pure caster has no step like the weapons' 2[W].** The 2026-10-29 entry wanted "free growth matched". With dice growing only by Stage, the spells' Stage step must be visible on the cards.

### C. Interactions worth knowing (no change proposed)

- **Overreach can break your own held spell.** Its damage is Resolve damage; when it makes you Strained, your [Woven] and [Sustained] spells end. A caster with a low Resolve (10 to 12) is there after about three Overreaches. The class's high-or-low choice becomes: high Resolve (Overreach freely, but physical hits make you Bloodied and break your spells) or high Vigor (the reverse).
- **A held spell breaks at most twice a fight** (once on Bloodied, once on Strained), unless healing takes you back under a threshold. After both, only going Down or a dispel ends it.
- **Half a pool of Nonlethal damage means never rolling on the Dying or Shattered Table** (Chapter 4: Down with Nonlethal damage at half the pool or more is Unconscious). A caster who Overreaches that far has paid half their Health for it; it is in the rules as written, not an exploit to close.
- **Overcast is a round-2 thing by default.** At Momentum 0 nobody has a step in round 1 but through Overreach, so **Overreach is the caster's round-1 choice every fight**, at about 4 damage of 30. That is "an option", as Lucas asked, but it will be used often.
- **Momentum now matters more to casters than to anyone.**
- **An NPC is Bloodied about a round before it dies** (the ruler: round 2.2 of 2.4), so breaking an enemy caster's held spell by damage rarely beats killing it. The break rule is counterplay against PCs; against NPCs, Abjuration is.
- **NPCs have no Escalation** (Elites aside): an NPC caster's stat block writes its spells already Overcast, or not.
- **Area spells that roll** follow Chapter 1's Several Targets (one roll, a Tier for each creature, damage rolled once a Tier) and count as one of the three Strikes of a turn.

### D. In the research and not yet used (kept as options)

- **Air as a second Path means "as a cloud"** (Dominions): a Merge with Air could turn a spell into a lingering zone instead of adding Pushed. A zone whose level drops by 1 a round is in `dominions-rules.md` 3.
- **Each Path protects, holds and retaliates in its own way** (`dominions-paths.md` 3.2): the content for Abjuration's and Alteration's cells.
- **A counterspell that needs the spell's Path** (Ars Magica): Abjuration's first card.
- **The Limits of Magic** (Ars Magica): a list of what no spell does, written before the first spell.
- **Linked casters** (the communion), **spells that take time and can be broken** (and so a rule for [Focus]), **gems as loot**, **the Tags**, **rituals**, **Blood**: all parked.
- **Protections of one family replace each other; a ward as a count; a buff with a price** (`dominions-rules.md` 7).

## 5i. Crucible (a lead, not researched)

Lucas's reference (decision 34). **[memory]: from Claude's training, no page opened.** Crucible is the Foundry VTT system by Foundry's own lead developer. Its spells are composed at casting time from parts: a **Rune** (the substance: flame, frost, lightning, earth, life, death, mind and others), a **Gesture** (the delivery: touch, arrow, ray, fan, aura, ward, and others, each with its own cost, range and shape) and an optional **Inflection** (a modifier: extend, push, pull, and others). The pieces map closely onto what is decided here: Rune = Path, Gesture = a finer cut than School (a delivery shape, nearer to the Breadth and Reach ladders), Inflection = an Overcast step. Two differences to keep in mind: Crucible composes every spell on the fly, where 2d12 writes cards (Lucas's "least ambiguity"); and its Gestures are shapes, where 2d12's Schools are verbs. **To research before leaning on it** (its rules are public on Foundry's site and wiki): what a Gesture fixes, how its composed spells are priced, and what its players say.

## 5j. Overcast's rungs, after the core research (DECIDED 2026-11-18, decision 43: small rungs, no cap of its own; the pool habit below still only proposed)

Lucas refused one big jump a ladder (decision 42). `research/dominions-core.md` 4: Dominions doesn't cap growth inside a spell; **each step is small** (a tenth to a quarter of one number) and **spare levels are scarce**; the jump from one creature to an area is a different spell.

- **Small rungs:** Reach **+2 squares** a step; Breadth **+1 creature** a step; Hold **+1 round** a step. A spell's own substance step stays as written on it (and can be taken more than once only if the spell says so).
- **"One creature" to "an area" is a different spell** with higher minimums (Fire Darts and Fireball are two cards), never a Breadth step. An area spell's Breadth step, when it has one, is +1 to its Burst or Emanation.
- **The cap of decision 32** (one step a ladder) was meant for rungs that tripled an area. With rungs this size, the limits already decided may be enough: a step needs a spare level in its axis, and a casting can hold as many steps as your Escalation minus 1. To choose: keep one step a ladder; allow two; or no cap beyond those two limits.
- **Which pool a Path damages** (from the three tracks, `dominions-core.md` 3; proposed): the Elements wound (Vigor); Death and Glamour break the spirit (Resolve); Astral's Force is Resolve; Nature's poison is Vigor. A habit like the lean of the roll, never a rule.

## 5k. The summons rule (DECIDED 2026-11-18, decision 44: all seven points; point 5 to be lifted by a Talent tree)

Decided: a creature of about your level with a Minion's stats, growing with you; built from a menu at preparation; limited on purpose (37); Sustain: 1 AP for its 3 AP (41). Research: `research/charm-confusion-summons.md` part 2. Claude's defaults for the rest:

1. **One summon at a time.** Casting a second summon ends the first, whatever you could pay.
2. **Its stats are the Minion row of your Stage** in Chapter 14 (Health for one or two hits, 3 AP, no Reactions), so it grows when you reach a Stage, with no table of its own.
3. **It acts on your turn, after you,** and only if you paid the Sustain this turn. The turn you cast it, it acts at once (the casting pays that turn's Sustain).
4. **What it can't do:** Reactions (a Minion has none); Flank; summon; use Rally Points or be healed. It can be given Guard.
5. **It leaves** when it goes Down, when you don't pay, and when a [Sustained] spell ends (you go Down, or become Bloodied or Strained).
6. **The build, chosen on a Rest:** the Path gives its theme and its Basic attack's subtype; then **two picks from a short menu** (for example: a movement such as flying or climbing; Reach 2; a ranged Basic attack; its Path's rider on a Tier 3; Resist to one subtype; a sense). A Talent or a level in Conjuration adds a pick.
7. **A Minor enemy to its foes:** spells and effects that are stronger against Minor enemies (decision 39) are stronger against a summon.

## 5l. Talent seeds (limits in the base rules that a Talent could lift; a running list, nothing designed)

Lucas's principle (decision 44): the base rule carries the limit; Talents are how a character grows past it, sideways. Each seed names the limit and where it was set.

| Seed | The limit it lifts | Set in |
|---|---|---|
| **A summoner's chain** | A summon leaves when you become Bloodied or Strained | 44 (Lucas named this one) |
| A second summon, or a third build pick | One summon at a time; two picks | 44 |
| A summon that Flanks, or has a Reaction | It can't Flank; a Minion has no Reactions | 44 |
| Holding two [Woven] spells | One at a time | 28 |
| A held spell that survives one break | Held magic ends when you become Bloodied or Strained | 28 |
| A cheaper Sustain for one School or Path | Sustain: 1 AP | 29 |
| An Overcast step in round 1 for one Path | A step needs Escalation | 20 |
| A safer Overreach (a smaller die, or once a fight for free) | 1d6! Nonlethal Resolve damage | 30 |
| A second Overreach step | Once a casting | 30 |
| Opening a Path or a School; extra spells | Mastery gives few spells | 19, 27 |
| A Merge that keeps the spell's own rider | The rider slot holds one | 26 |
| Real healing from one Path | Healing magic gives Guard only | 36 |
| Ranged spells while Engaged | Doomed (and the gap for Save spells, 5h B3) | Chapter 3 |
| Changing a spell by its trait ("your [Evocation] spells...") | none: this is what Talents already do | the Talents chapter |
- **Area growth (decision 61):** a Talent that lets an [Area] spell grow (one creature within 1 square of the Area is also a target; or one more square touching the Area). The plain rule gives areas no Breadth.

## 5m. The limiters, as they stand (2026-11-18; Lucas: "What are the current limiters? Because I might change them for spells")

**From the core rules, on every Action:** AP (4 and 1 Reaction AP); Frequency (At-will with a Bane a repeat, Turn, Round, Encounter, Daily); three Strikes a turn; Doomed for a [Ranged] Action while Engaged (a Save spell escapes it: 5h B3); Line of Effect; the Modifier never above +4.

**Decided for magic:** the two minimums (5); few spells known (19, 27); one Mastery point a fight (27); a level never a number (18); an Overcast step needs a spare level (26) and Escalation, a casting holding Escalation minus 1 steps (20, 43); small rungs (43); Overreach only on a spell that prints the line (57), once a casting, its usual price Nonlethal Resolve damage (30); a line may get past one limit once, and says so (59), which now stays until a Sleep unless a Rally Point or a heal removes it (55); one [Woven] spell (28); Sustain: 1 AP (29); held magic breaks on Down, Bloodied, Strained (28); one rider (26); the summons limits (41, 44); magic gives Guard, not Health (36).

**Not limiters (dropped or never added):** mana, slots or points; a Health cost but Overreach; gems; casting time or interruption ([Focus] has no rule); a cap on levels; a cap on steps a ladder.

**How it adds up:** in play a caster is held by AP, Frequency and (for Overcast) Escalation; everything else limits the build. A Round spell can be cast every round of every fight at no cost. Unmeasured.

## 6. The order of work from here (proposed)

1. Lucas's answers to section 5.
2. The Paths' one-line definitions, subtypes and riders, from `dominions-paths.md` (borders decided).
3. The Schools' definitions and what each one's Overcast ladder is.
4. The new traits and words, each with its rule ([Spell], the Path and School traits, [Standing], Overcast, the push).
5. Dominions' own spells pulled and shown as 2d12 cards (decision 25), as the grid's test.
6. The first cards, for three or four Paths, in the analysis format of `paladin-analyses.md`.
7. A first class, by the charter (a record and a reading page).
