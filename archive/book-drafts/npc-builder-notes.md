# NPC Builder tab: brainstorm notes (2026-10-22, with Lucas)

Status: BUILT in Foundry v0.0.163 (Lucas: "feel free to start the build"). Source of the numbers: the Bestiary (book/rules-src/14-bestiary.md; tables from book/ruler/ratings.py).

## Decided
- The tab replaces the archetype/weight model; archetypes and Weight are removed completely; old NPCs are not migrated (Lucas rebuilds them from the compendium).
- A character's WD is not editable (NPC AD and WD are).
- **A (Lucas): ratings drive everything.** The NPC stores its ratings; the numbers are derived; a row can be set to **Custom** and typed. Changing level or a rating recalculates.
- Mockup shown (claude.ai artifact "NPC Builder tab (mockup)", Orc Warrior): rows with rating chips that show each table value, a value column, a "how" column with the formula; role and level on top; Special Actions list with a Compose button; a Check strip at the bottom.

## Open (in the order we talk about them)
1. (DECIDED: A, see above.)
2. Level 2+ rows are empty in the Bestiary: what does the tab do above level 1?
3. Basic attack: average damage to dice (the tables give totals with [Mod] included).
4. Special Actions: numbers only, or a composer that fills Generate Action?
5. Balance feedback panel (Health, PC turns to kill, damage a turn, Worth, "averages to Medium").
6. Weapon Attribute and Power Attribute for an NPC (the Bestiary has both; the sheet has one).
7. Speed trade (fast: Low Health; slow: High Basic attack), Escalation and AP by role.
8. The compendium NPCs are built with the same code (tools/content.mjs).

## Decided after the mockup (Lucas)
- The Basic attack is not a rated row: it and the Special Actions are a **reference** (the damage per rating, shown like buttons, with dice); Lucas writes the Actions by hand.
- Built as: role buttons, Level, Weapon/Power Attribute, Speed, Escalation on top; rows for Attributes, Health and Defenses; Attacks (reference) with notes on Area Saves, conditions and Reactions; a Check strip.
- Above level 1 the tab uses the level 1 tables and says so (the mockup said "Custom"; changed so the numbers stay usable; ask Lucas if he prefers Custom).
