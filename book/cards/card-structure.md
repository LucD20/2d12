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

**Lucas's answer:**
