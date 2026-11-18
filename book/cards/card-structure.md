# The Action card's structure: the inventory

**2026-11-15, asked by Lucas** before the Paladin is applied: "Check all Action card elements we have done so far. Separate each element. Then look through the Core book and see which Action card elements are left. Organize them for me, then from there we can build the Structure." The look of the card (how it is drawn) comes later, after the Archer, bows and swords. **Nothing here is decided: it is the list to decide from.**

Sources: the 19 cards of the Paladin redesign (`paladin-redesign.md`, "The whole Paladin"); Chapter 1's "Reading an Action" and Chapter 2's "Actions"; the 114 cards in `book/cards/*.json` (their fields counted).

## A. Elements the redesign's cards use (in the order they appear on a card)

| # | Element | How the redesign writes it | In the book today | Seen on |
|---|---|---|---|---|
| 1 | **Name** | the title | the same | all 19 |
| 2 | **Category** | Paladin Feature · Hallmark Action · Hallmark Reaction · Art · Escalation Passive · Escalation Action · Encounter Action | the same place; today's words differ ("Paladin Escalation (Passive)", "Divine Power" for a granted Action) | all |
| 3 | **Level** | only "Level 2" on Kindled Wrath | "Category and level" on the title bar | 1 |
| 4 | **Frequency** | At-will, Turn, Round, Encounter; none on a Passive | the same (plus Daily) | 13 |
| 5 | **Cost** | 0 AP, 1 AP, 2 AP, 1R; a 0R inside a line (Judge) | on the title bar; several costs = Versions | 13 |
| 6 | **Flavor** | one sentence that describes what is done and seen | the same place | all |
| 7 | **Traits** | in brackets on the header | their own line, by group (Roll, Requires, Kind, Damage, Keywords) | 13 |
| 8 | **Escalation needed** | "Escalation 6" on the header (Reckoning) | Meta-line 1 | 1 |
| 9 | **Distance** | "Distance: 10 sq.", "Reach", "Weapon" | Meta-line 3 | 6 |
| 10 | **Area** | "Area: 2 Emanation" | Meta-line 2 | 3 |
| 11 | **Target** | "Target: One enemy you can see", "The triggering creature", "All enemies in the Area" | Meta-line 2 ("Targets:") | 10 |
| 12 | **The Save** | "Appeal Save" | Meta-line 3 (the Vs line) | 4 (+2 Modes) |
| 13 | **Setup** | "Setup: You Advance..." before everything else | exists (1 card uses it); the new rules are in the backlog | 2 (+1 granted by Hallowed Stance) |
| 14 | **Interrupt / Trigger** | one labeled line | the same | 3 |
| 15 | **Versions by cost** | each cost its own full line ("1 AP: ...", "2 AP: ...") | columns, one a Version, with "As 2 AP" references | 2 (Judge, Lay On Hands) |
| 16 | **Tier 1 / 2 / 3** | each Tier's line holds its whole result | Tiers hold damage; the Effects row holds the rest | 3 |
| 17 | **"Tier 1 or 2:" line** | a Save with one result for two Tiers | "(T2/T3)" in parentheses on the Effects row | 4 |
| 18 | **Text with no label** | what happens with no roll, or a standing rule | the Effects row, or the Feature's text | 12 |
| 19 | **Duration** | (EoT), (1 round), "for 3 rounds", "until the encounter ends" | the same, plus forms now retired | 12 |

### New in the redesign (the book has no place for them yet)

| # | Element | What it is | Seen on |
|---|---|---|---|
| 20 | **Modes** | an Art's three named choices, one used each time ("Kindle:", "Reveal:", "Glare:") | 3 Arts |
| 21 | **Traits on a Mode** | "Glare [Power, Save]": traits only that Mode has | Glare, Kneel |
| 22 | **A named value** | "Smite dice: ..." defined once, used on the Tiers | Smite |
| 23 | **A line that changes the dice** | "Against a Profane creature, the damage dice are d8s." | Smite, Word of Radiance |
| 24 | **An extra cost inside the card** | "you can spend your Reaction AP to roll 1 more Smite die" | Smite |
| 25 | **A use outside the turn inside an Action** | Judge's 0 AP line: "or as a 0R when the creature you Judged goes Down" | Judge |
| 26 | **A Passive's condition** | "While your Escalation is 2 or more, ..." in the sentence itself | 5 Passives |
| 27 | **A card that changes another card** | Roving Judgment (Judge's cost), Hallowed Stance (gives a Setup) | 2 |
| 28 | **A defined state** | "Judged by you" (bold where it is defined) | Judge |

## B. Elements the book has that the redesign has not used

| # | Element | In the book today | Used by (of 114 cards) | The question |
|---|---|---|---|---|
| 29 | **Vs. a Defense** | "Vs. AD", "Vs. WD", "DC 13", "Body or Instinct (the one used to roll)" | 48 | **Missing by my mistake** on Smite and Binding Light: a Strike needs it (AD) |
| 30 | **The Effects row** | everything that isn't damage; happened on Tier 2+ | 56 | decided: no more "Tier 2+"; does the row itself stay for cards with no roll? |
| 31 | **Critical** | a row under Tier 3 | 5 | keep, with no redesign card using it? |
| 32 | **Requirements** | under the Frequency ("You have at least Speed 3.") | 9 | keep |
| 33 | **Prerequisites** | a Talent's ("Heavy Blows.") | 6 | Talents are set aside |
| 34 | **Version columns and "As X AP"** | a table: one column a cost | 23 cards with 2 or 3 costs | columns, or the redesign's full lines? |
| 35 | **Values by Version** | "One / two creatures", "5 / 10 sq.", "2 / 3 Burst" | 4 | needed only if columns stay |
| 36 | **Linked Action** | "Weapon Attack (1A)", "(1A/2A)" | many (Double Shot, Charge...) | keep; the Archer will need it |
| 37 | **A rules line** | "This Action is Favored." | 4 | the same thing as #18? |
| 38 | **Notes under the card** | "You can't use this Action while Down..." | 1 | the same thing as #18 or #32? |
| 39 | **An Action granted inside a card** | Beacon's Step inside Beacon | 1 | decided: a class grants an Action directly |
| 40 | **A Feature's text** | prose with "Choose..." and links | 31 | Features that are not Actions: a card, or text in the chapter? |
| 41 | **Weapon** (a Technique's) | "Dagger" | 16 | for the weapons pack |
| 42 | **Aura** | "Aura 2" on the Area line | 1 | keep |
| 43 | **[HT: ...]** | inside the text of the effect | 2 | keep |
| 44 | **Daily** | a Frequency | 6 | the redesign has none at levels 1 to 3 |
| 45 | **Apex** | a Category (level 4) | 4 | not now |
| 46 | **The Split line** | a roll with two Modifiers | few | keep |
| 47 | **"(T2/T3)"** | on the Effects row | many | retired (decided) |

## C. What the Structure must settle (my list, in the order I would decide)

1. **The header:** what sits on the title bar (name, category, frequency, cost) and what on the lines under it; one order for Distance, Area, Target, Vs / Save. Whether "Vs. AD" is written on every Strike or only when it isn't Armor Defense.
2. **The body's order:** Requirements, Setup, Interrupt / Trigger, the lines before the roll (#22, #23), the Tiers, Critical, the lines after (#18, #24).
3. **Versions:** columns with "As X AP", or one full line a cost (Lucas asked for the full line on Lay On Hands).
4. **Modes** as an element of their own (label, traits of a Mode, its own Target and Distance inside the sentence).
5. **Text with no label (#18, #30, #37, #38):** one element with one name and one place, instead of four.
6. **The Target line when a card touches two creatures** (Bulwark of Faith): waits for the targeting research.
7. **Passives and Features:** a card like an Action's (title, flavor, one sentence), or lighter.
8. **Level and Escalation** on the title bar or not.
9. **Critical:** kept as an optional row.

## Part 1: the header (PROPOSED 2026-11-15, three structures; the reading page: `book/cards/structure/index.html`, the artifact "Card Structure Desk")

Lucas: "Start with 1, the header. It can be a new file so we dont crowd the Paladin. For each structure, offer three different ones, we will build one by one."

- **A, stacked lines** (Pathfinder 2e's block): the name and the cost on the bar; the category; the traits; the Flavor; then Frequency, Distance, Area, Target and Versus, one labeled line each. Clearest cold, tallest (8 lines on Word of Radiance).
- **B, the grid** (Draw Steel's block): the name and the category on the bar; the Flavor; four fixed slots (traits | frequency and cost; Distance and Area | Target); **what is rolled leaves the header and becomes the body's first line** ("Weapon roll vs. Armor Defense", "Each target makes an Appeal Save"). A fixed place for each fact; the most to build.
- **C, one line** (today's book, tightened): category, frequency and cost on the bar; the Flavor; the traits; one line with Distance, Area, Target, Vs in that order. Shortest and cheapest; the bar and the line wrap on a full card.

Claude's pick: B. Also asked: where the Flavor goes; whether a Strike always writes its Defense.

**Lucas's answer (2026-11-15): B is good.** In doubt about the roll line as a sentence ("Each target makes an Appeal Save"): maybe it is only his habit from games that print "X Save"; "maybe its worth a shot". He asked for a search about card layouts first: running (`book/research/` gets the note). Still open: where the Flavor goes; whether a Strike always writes its Defense.

### The roll line, after the layout research (PROPOSED 2026-11-16; `book/research/card-layout.md`)

No published game found opens an ability with "Each target makes an X Save": Lucas's doubt holds. The roll is written five ways elsewhere; three fit header B:

- **1, a labeled line that opens the body** (4e's "Attack: Strength vs. Will"; D&D 2024's monsters): **"Attack: Weapon vs. Armor Defense"** on a Strike, **"Save: Appeal"** on a Save. Right above the Tiers it decides. Claude's pick.
- **2, the sentence** ("Each target makes an Appeal Save."): reads well once, slower to re-check; nobody prints it.
- **3, a fifth fact in the grid** ("Vs. Armor Defense" / "Appeal Save" beside the Target): today's book; the header grows, and it sits away from the Tiers.

Also from the research: a grid with no labels is hard on a first reading (said of Draw Steel's), so **the grid keeps "Distance:", "Area:" and "Target:"**.

**Lucas (2026-11-16): "I think traits need a line of itself, imagine something with 6 traits?"** Agreed: Reckoning has five beside "Escalation 6 · Encounter · 0 AP". The traits take the full width under the Flavor. Proposed for the frequency and the cost, three places: **1** on the title bar at the right of the name, the category on a small line under it (Claude's pick: the cost is what is looked for first); **2** in the grid at the left of the Distance; **3** a line of their own under the traits. The roll line (1 / 2 / 3 above) is still open.

**Lucas's answer (2026-11-16): PART 1, THE HEADER, IS DECIDED.** 1 "for sure" (frequency and cost on the title bar); the roll as a labeled line; the Flavor right under the name; a Strike's Defense always written. The header, top to bottom:

1. **The bar:** the name at the left; Escalation needed · Frequency · Cost at the right.
2. **The Flavor.**
3. **The traits,** on their own line (by group, as today).
4. **The grid:** "Distance: ..." and "Area: ..." at the left, "Target: ..." at the right. Absent facts are not printed; a Passive has no grid.
5. **The roll line opens the body:** "Attack: Weapon vs. Armor Defense" / "Save: Appeal".

**He asked: "Should we remove 'Paladin Escalation Action'? Does it actually add anything?"** Claude's answer: remove it from the card's face. Everything in it is already on the card (the Escalation, the frequency, the cost) or in the chapter heading above it; no rule in the book reads a category (checked: Chapter 5 speaks of "your Hallmark Action" as a choice, never of the label). Keep it as data (the JSON's `category`) so the book and Foundry still group by it. Waiting for his yes.

## Part 2: the body (PROPOSED 2026-11-16, three structures; it also settles part 5, text with no label)

- **1, play order, plain sentences:** every line where it happens; labels only on the fixed parts (Requirement, Trigger / Interrupt, Setup, Attack / Save, Tiers, Critical).
- **2, play order, every line labeled:** the same, plus **Effect** (what happens with no roll) and **Special** (a rule about the card); a defined word is its own label ("Smite dice:", "Judged:"). 4e's two labels. Claude's pick.
- **3, two zones:** what happens on top; rules and definitions under a line, smaller.

**Lucas's answer (2026-11-16): the category is off the card's face (yes; it stays as data). PART 2 IS DECIDED "for now": 2,** play order with every line labeled. The body's order: Requirement · Interrupt / Trigger · Setup · a defined word ("Smite dice:") · Effect (before the roll) · Attack / Save · Tier 1 / 2 / 3 (or "Tier 1 or 2") · Critical · Effect (after) · Special. **Effect** = what happens when the card is used, with no roll. **Special** = a rule about the card itself. This also settles part 5 (text with no label: there is none left).

## Part 3: Versions (PROPOSED 2026-11-16, three structures)

- **1, columns** (today's book): one column a cost, slashes in the header ("2 / 3 Burst"), "As 1 AP".
- **2, one block a cost, written in full:** each cost a heading with its complete lines; a value that changes sits on that heading; what is shared (Setup, the Attack line) is written once above. Claude's pick (Lucas asked for the 2 AP line in full on Lay On Hands).
- **3, the base and what the higher cost changes:** written for the cheaper cost, one labeled line for the other ("2 AP: The target can also use 1 Rally Point.").

**Lucas's answer (2026-11-16): PART 3 IS DECIDED: 2,** one block a cost, written in full; what is shared sits once above the blocks; a value that changes with the cost sits on the block's heading; the bar says "1 or 2 AP". "As X AP" and the slashes are retired.

## Part 4: Modes (PROPOSED 2026-11-16, three structures)

- **1, one labeled line a Mode** (as drafted): shortest; Glare's Target, Distance, Save and Tier line all inside one sentence.
- **2, one block a Mode,** the shape of a Version: the Mode's name as a heading with the traits only it has; its own Distance and Target; its labeled lines. Claude's pick.
- **3, three small cards under the Art's name:** each complete; "Round" on each reads as once a round each.

**Lucas's answer (2026-11-16): PART 4 IS DECIDED: 2,** one block a Mode: the Mode's name as a heading with the traits only it has, its own Distance and Target, its labeled lines. Parts 5 (text with no label) and 6 (the Target line with two creatures) were settled by part 2 and by the targeting rule.

## Parts 7, 8 and 9 (PROPOSED 2026-11-16)

**Part 7, Passives and Features that are not Actions, three structures:**
- **1, a card, the sentence whole:** "Passive" on the bar where the cost would be; one line under the label Passive, its condition inside it.
- **2, text in the chapter, no card:** name, Flavor, sentence.
- **3, a card split into the card's parts:** the bar carries the Escalation needed, a frequency if any ("Encounter") and "Passive"; a Passive that waits for a moment is Trigger + Effect; a standing rule is one line under Passive. Claude's pick (risk: it looks like a Reaction; "When" instead of "Trigger" if so).

**Part 8, the level:** off the card, kept as data (Claude: yes). **Part 9, Critical:** an optional labeled line under Tier 3 (Claude: keep).

**Lucas's answer (2026-11-16): PARTS 7, 8 AND 9 ARE DECIDED.** Passives: 1 (a card, the sentence whole under the label Passive), "but without the 'While your Escalation is X or more,'" (the bar says it). The level stays off the card. Critical stays, an optional line under Tier 3.

## THE STRUCTURE, WHOLE (decided with Lucas, 2026-11-16; to be built into `build_rules.py` and "Reading an Action" when the Paladin is applied)

1. **The bar:** the name at the left; at the right, the Escalation it needs, its frequency, and its cost ("1 or 2 AP" with two Versions; "Passive" when it has none).
2. **The Flavor:** one sentence that describes what is done and seen.
3. **The traits:** on their own line, by group.
4. **The grid:** "Distance: ..." and "Area: ..." at the left, "Target: ..." at the right. A fact the card doesn't have is not printed.
5. **The body, in play order, every line labeled:** Requirement · Interrupt or Trigger · Setup · a defined word ("Smite dice", "Judged") · Effect · a Special that says how the roll is made · Attack or Save · Tier 1 / 2 / 3 (or "Tier 1 or 2") · Critical · Effect · Special.
   **A Special about the roll goes above the Attack or Save line (Lucas, 2026-11-17, playtest 5, A1):** what changes how the roll is made (which weapon makes it, a Doomed or Favored condition) is read before the roll; a Special about the damage, the Tiers or a duration stays at the end (Darting Blade's "You make this Strike with a Light weapon you hold" above; Hit and Run's "The bow's hit is Doomed if you are Engaged" above, its "[W] is the weapon that hit" below).
6. **Effect, Special, Passive:** Effect: what happens when the card is used, with no roll. Special: a rule about the card itself. Passive: what a card with no cost does.
7. **The roll line:** "Attack: Weapon vs. Armor Defense" or "Save: Appeal", right above the Tiers. A Strike always writes its Defense.
8. **Versions and Modes:** one block each, under a heading (the cost, or the Mode's name with the traits only it has), written in full; a Mode has its own Distance and Target. What every block shares is written once, above them.
9. **Not on the card:** the category ("Paladin Hallmark Action") and the level: they stay as data and as the chapter's headings.

**The data behind it** (the card files): `category` and `level` stay as fields; a Version or a Mode is an entry with its own lines; the labels are fields, never text typed into a sentence.

**Where the new shape moved words on the Paladin's cards (for Lucas to check):**

- **Judge:** I split it into the Structure: the "Judged" rules first, then a 0 AP block and a 1 AP block. The 0 AP block's limit ("only at the start of an encounter, or as a 0R when the creature you Judged goes Down") became a Special line. Same rules, new shape.
- **The Arts:** each Mode that affects a creature got its own Distance and Target, and its sentence now says "the target" (Trade Places: "You and the target swap squares.").
- **The Passives:** "While your Escalation is N or more" is gone from all six; the bar says it. Kindled Wrath keeps "Once an encounter" in its sentence, as you chose.
- **Word of Radiance and Smite:** the Profane rule and the extra die are Special lines, at the end. Word of Radiance's used to sit above its Tiers.
- **Smite's Attack line:** "Signature vs. Armor Defense": it has both the Signature and the Weapon traits, and I took Signature as the roll. Tell me if it should be Weapon.

## The 19 Paladin cards in the Structure

### Level 1: the two Features

> **Judge** · At-will · 0 or 1 AP
> *You pronounce a foe guilty before your god, and holy light dulls its blows against those who stand near you.*
> Divine
> Distance: 10 sq. | Target: One enemy you can see
> **Judged:** A creature stops being Judged when it goes Down. A creature Judged by you counts as Profane for you. Once each round, when it damages an ally within 5 squares of you, you can reduce that damage by your Power Modifier. Two Paladins can Judge the same creature: it is Judged by each of them.
> — **0 AP** —
> **Special:** You can use this only at the start of an encounter, or as a 0R when the creature you Judged goes Down.
> **Effect:** The target is Judged by you until the encounter ends.
> — **1 AP** —
> **Effect:** The target is Judged by you instead of the one you had.

> **Smite** · Encounter · 2 AP
> *Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.*
> Signature · Weapon · Strike · Divine
> Distance: Weapon | Target: One creature
> **Smite dice:** [R] 1d6! Ho for each Escalation you have, up to 4 dice. Against a Profane creature they are 1d8!s.
> **Attack:** Signature vs. Armor Defense
> **Tier 1:** Your Smite dice.
> **Tier 2:** [V] 1[W] + [Mod] + your Smite dice.
> **Tier 3:** [V] 1[W] + [Mod] + your Smite dice + 1 more Smite die.
> **Special:** When you use Smite, you can spend your Reaction AP to roll 1 more Smite die. Neither extra die counts toward the 4.

### Level 1: a Hallmark Action (1 of 2)

> **Binding Light** · Round · 2 AP
> *Your blow lands wreathed in light that roots your foe where it stands.*
> Weapon · Strike · Divine
> Distance: Weapon | Target: One creature
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** [R] 1d6 Ho.
> **Tier 2:** [V] 1[W] + [Mod] + [R] 1d6 Ho; Immobilized (1 round).
> **Tier 3:** [V] 1[W] + [Mod] + [R] 1d8 Ho; Immobilized (1 round).

> **Lay On Hands** · Round · 1 or 2 AP
> *You stride to an ally's side and lay a hand on them, and a skin of pale light settles over them.*
> Divine · Focus
> Distance: Reach | Target: One willing ally
> **Setup:** You Advance up to 5 squares in a straight line toward the target.
> — **1 AP** —
> **Effect:** The target gains Guard equal to 2 + your Power Modifier.
> — **2 AP** —
> **Effect:** The target gains Guard equal to 2 + your Power Modifier and can use 1 Rally Point.

### Level 1: a Hallmark Reaction (1 of 2)

> **Shield of Faith** · Turn · 1R
> *You raise a hand, and a pane of light turns part of the blow aside and pulls your foe's eye to you.*
> Divine · Focus
> Distance: 5 sq. | Target: One ally
> **Interrupt:** An enemy's [Strike] Action would damage the target.
> **Effect:** That damage is reduced by 1 + your Power Modifier, and the triggering creature is Taunted by you (1 round).

> **Rebuke** · Turn · 1R
> *You call out in your god's name, and your foe's stride falters and stops.*
> Power · Save · Divine
> Distance: 3 sq. | Target: One enemy
> **Trigger:** The target moves away from you.
> **Effect:** The target is Hindered (EoT).
> **Save:** Appeal
> **Tier 1 or 2:** Its Move Action is disrupted.

### Level 1: an Art (1 of 3; a second at level 3)

> **Lantern of Faith** · Round · 1 AP
> *You call your god's light: around you, onto a foe, or into a foe's eyes.*
> Divine
> — **Kindle** —
> **Effect:** You shed Bright light 3 until the encounter ends.
> — **Reveal** —
> Distance: 5 sq. | Target: One creature you perceive
> **Effect:** The target sheds Bright light 1 (1 round).
> — **Glare · Power · Save** —
> Distance: 5 sq. | Target: One enemy you can see
> **Save:** Instinct
> **Tier 1 or 2:** Half-Blinded (EoT).

> **Hold the Line** · Round · 1 AP
> *You plant yourself where the fight is worst: you crowd the ground at your feet, trade places with an ally, or carry one clear.*
> — **Brace** —
> **Effect:** Squares adjacent to you are Difficult Terrain for enemies (1 round).
> — **Trade Places** —
> Distance: Reach | Target: One willing ally
> **Effect:** You and the target swap squares. Each of you is moved by a Reposition.
> — **Rescue** —
> Distance: Reach | Target: One willing ally
> **Effect:** Reposition 2 the target.

> **Commandment** · Round · 1 AP
> *You speak with your god's authority: you call a foe to face you, steady the hearts around you, or order a foe to its knees.*
> Divine
> — **Challenge** —
> Distance: 5 sq. | Target: One enemy
> **Effect:** The target is Taunted by you (1 round).
> — **Courage** —
> **Effect:** You and allies within 3 squares of you ignore the Frightened condition (1 round).
> — **Kneel · Power · Save** —
> Distance: 5 sq. | Target: One enemy
> **Save:** Appeal
> **Tier 1 or 2:** Prone.

### Level 1: the Escalation 2 Passive (1 of 2)

> **Armor of Faith** · Escalation 2 · Passive
> *Each time you answer for an ally, your god's light settles on you like mail.*
> **Passive:** When you use a [Divine] Reaction, you gain Guard equal to 1 + your Power Modifier.

> **Roving Judgment** · Escalation 2 · Passive
> *Your eye passes from one guilty foe to the next, and your god's attention follows it.*
> **Passive:** The 1 AP use of Judge costs you 0 AP.

### Level 2: the hook

> **Kindled Wrath** · Passive
> *An ally's blood on the ground, and your god's anger is yours.*
> **Passive:** Once an encounter, when an ally becomes Bloodied or goes Down, your Escalation increases by 1.

### Level 2: an Encounter Pick (1 of 3)

> **Bulwark of Faith** · Encounter · 1R
> *You step into the blow meant for them, and your god holds the line with you.*
> Divine · Focus
> Distance: 5 sq. | Target: One ally
> **Interrupt:** An enemy's [Strike] Action would damage the target.
> **Effect:** The target gains Guard equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1.

> **Consecrated Ground** · Encounter · 2 AP
> *You drive your weapon into the earth and the ground around it shines: your foes wade through it, and your allies stand firmer on it.*
> Area · Divine
> Distance: 8 sq. · Area: 2 Emanation
> **Effect:** For 3 rounds, the Area is Difficult Terrain for enemies. Whenever you or an ally starts a turn in the Area, that creature gains Guard equal to your Power Modifier.

> **Word of Radiance** · Encounter · 2 AP
> *You speak a single word of your god, and light bursts from you: your foes burn in it and stagger back.*
> Power · Save · Area · Self · Divine
> Area: 2 Emanation | Target: All enemies in the Area
> **Save:** Appeal
> **Tier 1:** [R] 3d6 Ho; Pushed 3.
> **Tier 2:** [R] 2d6 Ho; Pushed 2.
> **Tier 3:** [R] 1d6 Ho; Pushed 1.
> **Special:** Against a Profane creature, the damage dice are d8s.

### Level 2: the Escalation 4 Passive (1 of 2)

> **Weight of Judgment** · Escalation 4 · Passive
> *Your judgment hangs on your foe like a chain, and its steps drag.*
> **Passive:** A creature Judged by you has its Speed reduced by 2 (to a minimum of 1).

> **Tireless Vigil** · Escalation 4 · Passive
> *The longer the fight lasts, the less escapes you: your guard is on two allies at once.*
> **Passive:** You gain 1 more Reaction AP when you regain AP. It pays only for [Divine] Reactions.

### Level 3: the Escalation 6 ability (1 of 2), and a second Art

> **Reckoning** · Escalation 6 · Encounter · 0 AP
> *You stride among your foes, and your god's light breaks from you and throws them back.*
> Power · Save · Area · Self · Divine
> Area: 2 Emanation | Target: All enemies in the Area
> **Setup:** You Advance.
> **Effect:** Each target is Pushed 2.
> **Save:** Appeal
> **Tier 1 or 2:** Frightened of you (1 round).

> **Hallowed Stance** · Escalation 6 · Passive
> *Your god's light carries you: wherever you are needed, you are already there.*
> **Passive:** Once on your turn, a [Divine] Action you use gains "Setup: You Advance 3."

**Lucas's answer:**
