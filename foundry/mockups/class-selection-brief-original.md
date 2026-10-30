TASK: Class selection rework for the twod12 Foundry V14 system. Three connected pieces, designed with Lucas and checked against each other in mockups. Nothing is built yet.

MOCKUPS (open them from the repo; they are the visual and behavioral spec. Fonts and exact colors are indicative: reuse the existing item-sheet CSS and the system.css variables)
- foundry/mockups/class-details.html  : the Class sheet, Details tab
- foundry/mockups/class-levels.html   : the Levels window (designer side)
- foundry/mockups/class-picker.html   : the class window the player sees (has a "Preview level 1 / 2 / 3" control that is NOT part of the real window)

STEP 0, BEFORE BUILDING
Read the current Class item data model, the Class item sheet, and the handler that runs when a Class is dropped on a character sheet (and any level-up code). Report back how class selection works today, what in the current Class Details tab is not in the new layout, and how the model below maps onto what exists. Wait for Lucas's OK before building. The design session could not read the Foundry code.

THE FEATURE IN ONE PARAGRAPH
A Class item defines, per level, a list of SECTIONS. When a Class is dropped on a character, or the character levels up, one window opens for that level and shows those sections. Each option in a section is a button: click the name to read the card, and a separate Choose button takes it. Nothing is applied to the sheet until the player confirms. The designer builds the sections in a separate wider "Levels" window, opened from a button on the Class's Details tab.

========================================
PIECE 1: CLASS SHEET, DETAILS TAB
Same look as the Talent and Feature Details tabs (navy header with icon and name, Description / Details tabs, parchment body, gold section bands with dark-red small caps, white fields, "Show help" checkbox with help lines under fields, drop zones with dashed borders).
Fields:
- Category (text, default "Class"), Armor Training (Light / Medium / Heavy), "Shown as" (the class name), Flavor.
- Body Health Multiplier, Mind Health Multiplier, Rally, Speed Modifier (numbers).
- Weapon Modifier: two Attribute selects ("uses X or Y"); Power Modifier: two Attribute selects. Help text: "Each Modifier uses the higher of its two Attributes. The two Modifiers can't use the same Attribute." (rules 05-characters.md, Weapon, Power and Signature Modifiers).
- "Attribute increases": READ-ONLY line (for example "Body or Appeal +1, Mind or Instinct +1") taken from the Attribute section of level 1 in the Levels window. Help text says they are set on level 1.
Sections (gold bands):
- LEVELS: one summary row per level, "Level N · X sections · Y choices to make" (choices to make = Attribute pairs + the effective Pick counts of Choice and Repertoire sections, as in the picker), and a button "Edit levels…" that opens the Levels window.
- REPERTOIRE: everything else the class offers, grouped by Frequency (Passive, Turn, Round, Encounter, Daily). Chips with an x to remove; drop zone "Drop Actions and Features here" (Features here are the passive Features).
- ESCALATION: Passives and Actives, same chips and a drop zone. Active chips show their Escalation cost ("Esc 1", "Esc 2").
Keep anything the current Class Details tab already has that this list leaves out; tell Lucas what it is before removing it.

========================================
PIECE 2: THE LEVELS WINDOW (designer)
A separate, wider Application window (NOT a tab), titled "Class: <name>" with header "<Class> Levels", opened by "Edit levels…". Layout: level buttons (1, 2, 3, + to add a level), then two columns: left = the sections of the chosen level, right = "Class items".
Section = a card with a gold band header containing: drag handle (reorder), editable Title, Type select, Mode (Granted / Choice, only for type "Items I drop"), Pick count (for Choice and for Repertoire), remove x. Body depends on the type. Footer line "Player sees: ...".
Types:
1. "Items I drop": rows of dropped items (name, type, Frequency, x to remove, and "also in: <other section title>" in a warning color when the same item is in another section of this level), a dashed drop zone "Drop an Action, Feature or Talent here" and an "or add from a list…" select as keyboard fallback.
2. "Attribute increase": one or more pairs of Attribute selects ("Pair 1: Body or Appeal +1"). Intended for level 1.
3. "From the Repertoire": a Frequency select (Any, Passive, Turn, Round, Encounter, Daily) and a Pick count. Nothing to drop: the player picks from the class Repertoire (Details tab).
"Player sees" lines: Granted: "Granted: A, B". Choice: "Choose N of M". Repertoire: "Choose N from the Repertoire (<Frequency>, K available)". Attribute: "Body or Appeal +1 · Mind or Instinct +1". Warnings: "Empty: drop at least one item." and "Choose N but only M items to pick from."
Right column "Class items": the Repertoire (by Frequency) and the Escalation Passives and Actives from the Details tab, draggable into any section. Features and Actions that only one section uses (Core Features, Class Actions like Smite and Lay On Hands) are dragged from the sidebar or compendium, as usual. The list does NOT dim used items.

========================================
PIECE 3: THE CLASS WINDOW (player)
Opens when a Class is dropped on a character sheet (level 1) and when the character levels up (level N, only that level's sections). Title bar "Class: <name>"; navy header with icon, class name, "Level N", progress dots and "X of Y choices made", and the stat line (Body Health, Mind Health, Rally, Speed, Armor Training from the Details tab). Two columns:
- Left: the sections in order. Each has a gold band title, a pill, a one-line subtitle and tiles.
  - Pill: "Granted" (Granted sections), "n / need" while choosing, "Chosen" when full, "Complete" when need is 0.
  - Subtitle: attribute "One from each pair. These can't be changed later."; Repertoire "Choose N from the Repertoire (<Frequency>)."; Choice "Choose N."; Granted "Yours at this level."
  - Tile: name + meta line (cost · Frequency, "Passive", "Feature", "Esc N"). Clicking the name only VIEWS it. A separate Choose / Chosen button takes it or puts it back. Granted tiles show "Granted" and no button. Chosen tile: tinted background and accent border. Viewed tile: neutral outline.
  - Pick 1: choosing another replaces the current one. Pick N: at most N, choosing past N drops the oldest.
  - Attribute section: one two-button toggle per pair (Attribute names colored with the attribute colors). Keep the Distinct Choices rule from Chapter 5. Locked after confirm.
  - A Choice or Repertoire section with need 0 shows "Everything here is already yours."
- Right: the viewed ability as a card: name, cost, category line, Flavor, trait chips grouped Roll / Requires / Kind / Damage / Keywords (group label over the chips, 1px line between groups, colors from the FORMAT pack), facts (Frequency, Target, Area, Distance, Vs, Trigger, Interrupt, Split, Escalation), the tier table, effect text, and at the bottom a Choose button (or "Granted. You don't need to choose this."). Use the existing card renderer and text colors where they exist.
- Footer: message ("N left to choose." / "Everything is chosen. Attribute choices can't be changed later."), Cancel, and the primary button: "Add <Class> to sheet" at level 1, "Level up to N" otherwise. Disabled until every choice is made. Cancel leaves the sheet untouched. Nothing applies before confirm.
- Narrow widths: columns stack; the detail card goes under the list.
- Keyboard: tile name and Choose are separate real buttons; keep focus on the same button after a re-render.

========================================
RULES DECIDED BY LUCAS (all confirmed)
1. A section is either Granted or Choice. MIXED SECTIONS ARE NOT ALLOWED.
2. Granted: the player has every item automatically. Smite and Lay On Hands are only sample content; Class Actions is a normal section Lucas will change. Do not hard-code them.
3. Repertoire pick: excludes items already granted at level 1 (and everything the character already owns).
4. The same item may appear in two sections of one level. Once the character has it (granted, chosen in another section, or owned from an earlier level) it disappears from every other section's choices, so it can't be taken twice. A section whose items are all taken shows the "Complete" pill and the "already yours" line. Algorithm (matches the picker mockup):
   - candidates(section) = its items; for a Repertoire section, every Repertoire item whose Frequency matches (Any = all, including passive Features).
   - available(section) = candidates minus items owned from earlier levels (granted and chosen), minus items granted at this level, minus items chosen in another section of this level. Items chosen in the section itself stay visible.
   - need(section) = min(pick, available(section).length). Choices to make at a level = Attribute pairs + sum of need over Choice and Repertoire sections. Level 1 of the Paladin = 2 Attribute pairs + 3 picks = 5.
5. The Levels editor is its own window opened from Details, not a tab. Attribute pairs live in the Levels window (level 1), shown read-only on Details.
6. Nothing is applied until confirm.

SUGGESTED DATA (adapt to the real model)
class.system.levels = { "1": [section, ...], "2": [...], "3": [...] }
section = { id, title, kind: "items" | "attr" | "repertoire",
            mode: "granted" | "choice",        // items only
            pick: number,                       // choice items, repertoire
            items: [uuid, ...],                 // items only
            pairs: [[attrA, attrB], ...],       // attr only
            freq: "Any" | "Passive" | "Turn" | "Round" | "Encounter" | "Daily" }   // repertoire only
class.system.repertoire = [uuid, ...]; class.system.escalation = { passives: [uuid], actives: [uuid] }
Character side, for example flags.twod12.classChoices = { classUuid, level, attrs: { pairId: attr }, sections: { sectionId: [uuid] } }, plus whatever the existing model needs to grant items to the actor.

MIGRATION (Paladin and Archer, per the book's level list; today their class items have 4 Picks and 1 Passive + 3 Actives at level 1)
Level 1: Attributes (Paladin: Body or Appeal, Mind or Instinct; Archer: Body or Instinct, Mind or Appeal); Core Features (granted); Class Actions (granted: Paladin Smite + Lay On Hands; Archer Double Shot + Precise Aim); Encounter Pick (choice, pick 1, the Encounter items of the Repertoire); Passive Escalation Pick (choice, 1, all Passive Escalations); Active Escalation Pick (choice, 1, all Active Escalations).
Level 2: Pick from any list (Repertoire, Any, 1); Passive Escalation Pick (choice, 1, all Passive Escalations).
Level 3: Pick from any list (Repertoire, Any, 1); Daily Pick (Repertoire, Daily, 1); Passive Escalation Pick (choice, 1).
The Repertoire and Escalation lists on Details are the Paladin's and Archer's current Repertoire and Escalation items. The book says "Further levels will be added here" (the number of levels is not decided).

OUT OF SCOPE
Species sheet, weapon Mastery, Weapon/Power Modifier "or" choice automation (it follows from the Attributes), the book's class page look, Rally formula changes.

DOCS TO UPDATE (do not edit the book's rules)
- rules: 05-characters.md "Class Actions, Picks and the Repertoire" still says "A class's Class Actions are the Actions every character of that class has from level 1." Lucas is redesigning the Paladin's Class Actions: add a note to HANDOFF, do not change the book text.
- foundry-backlog.md: replace "the class items still have 4 Picks and 1 Passive + 3 Actives at level 1" and "the level-up flow doesn't exist" with this feature, and remove "(Class and Species later, when they are redone)" for Class.

DELIVERY
New Foundry version number; tests for the section logic (pick replace, pick N cap, duplicate-item removal across sections, Repertoire filter and exclusion of granted and owned items, "Complete" when need is 0, attribute Distinct Choices, confirm disabled until complete, level-up shows only that level's sections, Cancel changes nothing); and a short per-version test checklist for Lucas to run in Foundry, based on what was added, changed and removed.
