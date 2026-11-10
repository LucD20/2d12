# PACK EFFECT-SHEET: the Effect window's Details tab, redesigned

Lucas's design (claude.ai Project "2d12 design", 2026-11-09). This brief is the whole spec: build from it, and use the two mockups for the look and the behavior.

- **Approved mockup (the target):** `foundry/mockups/effect-rules-mockups.html` ("Prototype C", round 13). Open it in a browser: every control is clickable, the hover card and the rule sentences rebuild live, the **?** on the tab bar shows the help texts, and the left list holds worked examples (Vow of Enmity, Radiant Zeal, Beacon, Covering Shot, Brawler, Bow Mastery, Burning aura...).
- **Earlier mockup (partly superseded):** `foundry/mockups/effect-details-prototype.html` ("redesign 1"). Only these parts of it still stand: the hover card preview with its "Write it yourself" override, and the **Automation** section at the bottom (section 3.8). Its "Who gets it" row (Effect / Aura / Zone), its "+ Add..." menu, its Rules checkboxes and its Ends row are **replaced** by this brief.

The mockups' colors, fonts and pixel sizes are approximations of the system's look. Use the system's own CSS variables, fonts and components (the v0.0.289 sheet and v0.0.292 roll dialog look), not the mockup's hex values.

---

## 1. Goal and scope

The Details tab of the Effect window grew one setting block per feature (Boons and Banes, Empowered and Enfeebled, Bonus damage, Defense, Speed, Aura, Zone, Note, Chat message, Grant action use...). It is cluttered and hard to read. This pack rebuilds it as **a list of rules on the left and the selected rule's settings on the right**, with fewer, merged rule kinds, a live sentence for each rule, and a hover card built from the settings.

**In scope**
- The Details tab of the Effect window (layout, controls, every rule kind, Ends, Automation).
- The data the tab writes: new or reshaped fields, with a **migration** of every existing effect (world items, actor-embedded effects, the Effects and Conditions compendiums, and the `foundry` blocks of `book/cards/*.json` that `tools/content.mjs` / `tools/cardgen.mjs` turn into effects).
- The code that reads those fields (rolls, damage, movement, Aura, Hazard, light, grants, Escalation, chat), so behavior stays the same after migration, plus the few new behaviors listed in this brief (each one is marked **NEW**).
- Two small book changes and their backlog entries (section 8).

**Out of scope (do not change)**
- The Description tab and the JSON tab.
- ~~**Zone** (an effect placed on the map). It gets its own design later.~~ **Designed and built (PACK ZONE, v0.0.327): section 5.10.** Was: Keep the existing Zone setting working exactly as it is; show it in the new list as a rule kind "Zone (old layout)" with its current controls inside the new pane, and keep it in the "+ Add rule" menu under Areas. Report it as the one rule left in the old layout.
- The **Advanced** section: keep it as it is, collapsed, at the bottom.
- Any rule of the game other than the two in section 8.

---

## 2. How to run this pack

Follow CLAUDE.md and HANDOFF.md as usual. In particular:

1. Merge `notes.txt` first and say what was merged.
2. **Read the current implementation before writing anything:** the Effect sheet and its Details tab (built from v0.0.112 on), every setting kind it offers today, the data model of an Effect and where each setting is read in `module/` (effects.mjs `resolveModifiers` and friends, damage.mjs, hazard.mjs, light*.mjs, grants.mjs, mark.mjs, states.mjs, escalation.mjs, move.mjs, the Aura / Zone code, the chat-message setting, the effect tooltip `fxTipHtml` and the "In short" summary). Make a table of every existing setting and its fields, and check it against the mapping in section 7. **If the code has a setting this brief doesn't mention, keep it working, put it in the closest new rule kind, and report it.**
3. Branch `pack-effect-sheet`. Bump the version, write the changelog entry in `docs/reference.md` (copy to `foundry/reference.md`), run every test, lint, build the packs, and give Lucas the per-version test checklist.
4. Split the work: a **pure model** module (sentences, summaries, the hover card text, migration functions, formula parsing, filter matching: no Foundry globals, so the tests can run it) and a **view / sheet** module (HTML and events). This is the pattern of `sheetmodel.mjs` / `pcsheet.mjs` and `rolldlg.mjs` / `rollwindow.mjs`.
5. Don't stop for small questions: choose, and list them under "Assumptions I made" in the final report. Ask only if something is truly blocked.
6. Report plainly what you couldn't try in Foundry (you can't run it), with a diagnostic command where possible, and add those items to `foundry/foundry-backlog.md`.

---

## 3. The window

Top to bottom (see the mockup):

### 3.1 Header
- Icon and name as today.
- Under the name, one muted line: **"On {creature} · from {origin}"** when the effect is applied. This replaces the old "Applied: On X. Its origin: Y (token ...) [Change: click a token]" block. Changing the effect's origin moves to the Ends row "Origin goes Down" and to each rule's own Origin chip (section 4.5). Keep the token-click picker you already have, behind each **⌖ Change** button.

### 3.2 Tab bar
- Description · Details · **?** (a small button on the right, the gold underline style of the tabs).
- **?** toggles every help text in the tab (class on the window; off by default). It replaces the old "Show help" checkbox. All grey explanation lines in the mockup (`note2`, the filter's help, Tier 1 / Tier 3 notes, formula names, HT patterns, Aura notes, the named-bonus note...) are hidden until **?** is on.

### 3.3 Hover card preview
- At the top of the tab, a dark card in the look of the effect tooltip: the effect's name in gold, then the effect's text in plain words, built from all its rules and its Ends. This **is** what players see on hover, so build the real tooltip from the same function.
- It replaces the old "In short:" box and the "Hover text" field.
- **"Write it yourself"** (a link under the card, from redesign 1): opens a text field. When filled, the tooltip shows that text instead of the built one; when emptied, it goes back to the built text. Keep the existing hover-text field's data for this (migrate it as the override).
- The card is plain text (no colors, no chips). It omits nothing a player needs.
- **NEW: shared limits merge.** Rules of the same effect that share the same "While they see {origin}" limit and the same origin are written once: "While they see Ogre Chieftain: 1 Bane on their Rolls and they can't willingly move closer to it." Rules without a shared limit are written one sentence each.

### 3.4 "What it does": the rule list and the pane
- Section heading "WHAT IT DOES" in the system's section-heading style, with the rule count on the right ("3 rules").
- Two columns: **the rule list** (left, about 200 px) and **the selected rule's pane** (right). Under about 560 px the list goes above the pane.
- **Rule list rows:** a colored kind tile (one letter or symbol per kind, its own color), a short label (sections 5.x give each label), and on hover a **trash-bin button** at the row's right end that removes the rule (always faintly visible on touch screens; `@media (hover:none)`). Clicking a row selects it. The selected row has a gold left bar. No × in the pane.
- Under the list: **"+ Add rule"**, one `<select>` with grouped options (section 5). Choosing one adds that rule with its defaults and selects it.
- **The pane:** the rule kind's title, then **the rule's sentence** in a framed box (section 4.1), then the rule's form.
- Drag and drop: dropping an Effect or an Action **anywhere on the tab** with no Grants / Aura rule selected adds a new Grants rule holding it (a convenience; keep the current "drop a condition here" behavior working this way).

### 3.5 Ends
Section heading **"ENDS"** with a muted note on the same line: "at the first of these; none ticked: until removed". Below it, one stacked list of **part rows** (section 4.2), in this order:

1. **Time:** Lasts `EoT | Rounds | This encounter` (full-width equal buttons); with Rounds, a Rounds number field.
2. **A Save:**
   - Save: `<select>` Body, Mind, Appeal, Instinct, Better of Body / Instinct, Better of Mind / Appeal.
   - DC: `13 | The origin's | Set` (Set shows a number field).
   - Rolled: `End of their turn | With Interact (1 AP)`.
   - Tier 2: `Nothing | Ends at EoT | Ends`.
   - Help line: "Tier 1: nothing. Tier 3: it ends."
3. **Origin goes Down:** Origin chip with ⌖ Change (this is the effect's origin). Help line: "Unconscious or leaving the scene count too." These are **always included**, not options.
4. **They use an Action** (keep the existing "or until the creature uses an action with [any] of [traits]" setting; it isn't in the mockup but must not be lost): the Action filter of section 4.4 ("Has all of / Has one of / But not"). Summary: "a [Strike] Action".

Each row's summary: Time "1 round" / "EoT" / "This encounter"; Save "Appeal, DC 13, end of turn"; Down "Ogre Chieftain"; Action "a [Strike] Action". Any combination can be ticked; the effect ends at the first. **No row ticked = until removed** (the old "until removed" choice is this state).

The hover card writes Ends as one sentence: "Lasts 1 round, or until an Appeal Save (DC 13) at the end of their turn ends it, or until Ogre Chieftain goes Down." With nothing ticked: "Lasts until removed." ("an" before Appeal / Instinct.)

Map the old duration choices onto Time (EoT, N rounds, encounter) and keep any other duration the code has (report it).

### 3.6 Automation (from redesign 1)
At the bottom, **closed by default**: a `<details>` whose summary shows the automation diamond (the same diamond the Action cards show: filled = automated, half = partly) and its word. Inside: the old **Automation** select (relabel it "Script") and the old **By hand** field (label "Players do", a textarea). The diamond is "Automated" when no By hand text is set, "Partly automated" when there is By hand text. It opens itself if a script is set. These are the two old first fields of Identity, moved, with the same data.

### 3.7 Advanced
Unchanged, collapsed, last.

### 3.8 Things removed from the tab
- "In short", "Hover text" (now the preview and its override), "Show help" (now **?**).
- The Identity row "This is [an effect] placed on [the target]" and the four Rules checkboxes. They become:
  - "Only while it sees its origin" → each rule's own **While they see the origin** switch (section 4.5).
  - "No Reactions" → a **Grants** rule holding the **Staggered** condition.
  - "Loses its value in AP" → a **Grants** rule holding **Dazed** (if the AP are lost now) or **Slowed** (if lost at the next turn): read how the code applies it and pick the match; report each effect you converted.
  - "Ends when its origin goes Down" → the Ends row.
- "+ Add..." in the heading (now "+ Add rule").

---

## 4. Shared building blocks

### 4.1 The rule's sentence (pane only)
Each rule kind writes one sentence (templates in section 5). In the pane's sentence box it is **colored**; in the hover card it is plain:
- Boons and "Favored" in the Boon blue, Banes and "Doomed" in the Bane red, **with their number** ("1 Bane", "2 Support Boons", "+1 Support bonus").
- Empowered N in blue, Enfeebled N in red ("Empowered +1" for an increase).
- Traits as small chips in their Trait Group color; a "not" trait as an outlined chip in red (no strikethrough).
- Damage: the dice and pool (`1d6 [V]`) in the pool's color (Vigor red, Resolve blue: the system's existing pool colors); the **subtype written in full** ("Holy", never "Ho") in its damage-type color (take the colors from the book's `{{dt:...}}` palette and the system's existing damage-type CSS).
- The origin's name in bold; a dropped Effect or Action name in bold; `[HT: Entering, Turn]` in the Bane red.

### 4.2 Part rows (one pattern everywhere)
Every on/off group in the tab is the same row: **switch, name, a one-line summary on the right** (or "off" in muted italics), and **a two-column form below when on** (label column, then the controls; one setting per line). Rows stack in one bordered list (shared borders, 3–4 px outer corners). Used by: On matching Actions' "What it adds", the Aura's "What it does inside" and "On the map", and Ends.

### 4.3 Controls and style
- **Corners 3–4 px everywhere.** No pill shapes, no fully round chips or switches (Lucas's standing rule).
- **Segmented buttons** for choices with 2–4 options. When a choice is alone on its form line, it fills the width with equal buttons, so the edges of consecutive rows line up. A 4-option choice that would wrap is a 2 × 2 grid of equal buttons.
- **Steppers** (− value +) for small numbers. **Formula fields** where section 4.6 says so.
- One **label column width** in every pane (about 70 px for the pane's form, 80 px inside part rows), labels left-aligned and muted. Long labels are shortened, not wrapped.
- `<select>`s never overflow the pane (`max-width: 100%`).
- Remove buttons inside a rule (a damage entry, a tier row) are a small underlined text button at the end of that row ("Remove this damage", "Remove"), never a lone × on its own line.
- Square switches (a box with a check), as in the mockup.
- Light and dark themes as the rest of the system.

### 4.4 The Action filter
Used by On matching Actions ("With") and Ends ("They use an Action").
- A box with a read-back line on top in **the book's notation**: "Actions: **[Melee, Strike] Actions, not [Divine]**"; "Actions: **[Strike] Actions that are [Melee] or [Ranged], not [Fear]**"; "any Action" when empty.
- Three lines, each with chips (Trait Group color, a small × on each) and a "+ trait" `<select>` grouped by Trait Group (optgroups: Roll, Requires, Kind, Damage, Keywords; take the lists from the system's trait config, not from the mockup):
  - **Has all of** (and)
  - **Has one of** (or; one group only for now)
  - **But not**: chips outlined in red, **no strikethrough**
- A trait used in one line is not offered in the other two.
- **NEW: the Roll group also offers Save and Check** (the roll kinds of Chapter 1, "Rolls"). They match by roll kind, not by an item trait: a Save matches Saves, a Check matches Checks. Attributes in the Roll group match as Chapter 1 says ("1 Boon on Body Rolls": Body Checks, Body Saves, Body Actions). Follow Chapter 1's table exactly, and add a test for it.
- This replaces the old "with all of [every roll] [+]", "+ Any of...", "+ None of...", "+ Saves against..." and the four Body / Mind / Appeal / Instinct boxes. Migrate them: all-of → Has all of; any-of → Has one of; none-of → But not; "Saves against" → Save in Has all of; ticked Attribute boxes → those Attributes in Has one of (one box → Has all of).

### 4.5 Origins and "While they see the origin"
- An effect has its origin (the creature that applied it). **Each rule that uses an origin has its own Origin chip** ("Origin: **Ogre Chieftain** [⌖ Change]"), shown only when that rule uses it (Against: the origin; While they see the origin; a condition with a source; Movement limit). A rule's origin defaults to the effect's origin; ⌖ Change sets that rule's own.
- **While they see the origin** is a switch on each rule that can have it (On matching Actions, Changes a value, Movement limit). While the bearer can't see that rule's origin (use the system's existing sight check, `sightgate.mjs`), that rule does nothing; the effect's other rules still work.
- The Ends origin is the effect's origin.

### 4.6 Formulas (NEW)
Every amount marked "formula" below is a text field that takes a number or a formula; the stepper, where there is one, edits a plain number. A formula can use:
- Numbers, `+ − × ÷` (also `*` and `/`), parentheses, `floor()`, `ceil()`, and dice (`1d6`, `2d8`) where a damage roll is meant.
- **`@origin.<name>`** = the origin's value; **`@target.<name>`** = the affected creature's (the effect's bearer) value. Names: `pow` (Power Modifier), `wpn` (Weapon Modifier), `sig` (Signature Modifier), `body`, `mind`, `appeal`, `instinct`, `stage`.
- In sentences, `@origin.pow` reads "the origin's Power Modifier", `@target.body` "the target's Body".
- An invalid formula shows a red outline and a short message in the field; it counts as 0 and the sentence shows the raw text.
- If the system already has a formula parser (Rally's "power + 2" field had one), extend it; migrate the old names (`power`, `speed`...) to the new syntax.

### 4.7 Drop zones
A dashed box ("Drop an Effect or an Action here", small line "from the Effects and Conditions compendiums, Actions from any card"). Dropped, it becomes a framed row: a small "Effect" or "Action" tag, the name in bold, and an ×. An Action row also shows its cost tag (the sheet's AP / R style), its Frequency and its trigger or first line. **Drop only: no dropdown and no uuid text field** to choose an Action (they fill themselves from the drop).

---

## 5. The rule kinds ("+ Add rule")

The menu, grouped (8 kinds; the old "Zone (old layout)" is gone since PACK ZONE: a Zone is "Where it is: On the map", section 5.10, and an old Zone rule migrates there):

| Group | Kinds |
|---|---|
| Rolls and values | On matching Actions · Changes a value |
| Gives | Grants an Effect or Action · Weapons (properties, Mastery) · Escalation hook |
| Areas | Aura · Light |
| Limits | Movement limit |

### 5.1 On matching Actions (tile ±, Boon/Bane split color)
Merges the old **Boons and Banes**, **Empowered and Enfeebled**, **Bonus damage**, **Ignore a Bane**, **Ignores cover** and **Note** blocks.

**"Which Rolls"** (heading), in this order:
- **On Rolls:** `made by them | made against them`.
- **With:** the Action filter (4.4).
- **Against** (or **Made by** when the Rolls are made against them): `any creature | the origin | the marked one`. "The marked one" = the creature this bearer marked (mark.mjs). This replaces every old "Only against the creature it marked" switch.
- **Uses:** `Every time | First each round | Next one only`. "First each round" replaces the old "Only the first matching Action each round". **"Next one only"** replaces Bonus damage's "The next matching action": after one matching use, **that rule is spent** (it stays in the list, greyed, with "spent"); **NEW: the effect ends when all its rules are spent** (rules that can't be spent, like Movement limit, don't keep it alive alone: an effect whose every spendable rule is spent and whose other rules are only passive ends too; if that is ambiguous for an existing effect, report it).
- **Only:** While they see the origin. **Origin** chip when used.

**"What it adds"** (heading): part rows, any combination:
1. **Boons and Banes:** Boons stepper 0–5, Banes stepper 0–5, Named `n/a | Field | Pressure | Support` (full width; "n/a" = no name; write the existing `bbName` field). When Boons minus Banes ≥ 5 a blue "Favored" tag shows next to the steppers (red "Doomed" for Banes); the sentence adds "(Favored)". Follow Chapter 1 ("Five Boons or Banes"): 5 or more left after limits and cancelling make the roll Favored / Doomed. Summary: "1 Boon", "2 Pressure Banes".
2. **Empowered and Enfeebled:** Counts as `Set to | Increase by`; Empowered stepper; Enfeebled stepper. **NEW: "Increase by"** adds to the bearer's current value for those Rolls ("increase your Empowered value by 1 for that Strike", Vow of Enmity, Sacred Weapon), while "Set to" follows Stacking (the highest counts). Summary "Empowered +1".
3. **Extra damage:** a list of entries (**NEW: several per rule**), each a three-line form:
   - Damage: dice / formula field, `[V] | [R]`, subtype `<select>` (None, Acid, Blunt, Cold, Electricity, Fire, Force, Holy, Pierce, Psychic, Slash, Thunder, Unholy: take the list from the system's config, full names).
   - On: T1, T2, T3 switches (all on by default).
   - Then: a drop zone for an Effect the target gains on those tiers (the old "The card adds" text + drop zone; migrate the text into the rule's sentence override if it can't become an Effect, and report it), and "Remove this damage" when there are two or more.
   - "+ Another damage" under the entries. Summary "+1d6 Holy, +1d4 Psychic".
4. **Ignores** (only shown when On Rolls is "made by them"): Cover: Low, Medium, High switches; Range Banes `None | One | All`; Also: The Engaged Bane. Map the old "Ignore a Bane" dropdown options onto these (and keep any option the code has that doesn't fit: report it). Summary "Low cover and one range Bane".
5. **Shows a note:** Title (text), Text (textarea). Shown in the roll dialog of every matching Roll, as the old Note did. Summary: the title.

**Sentence:** "{Scope}: {payload}." Scope = "Their Rolls" / "Their next Roll" / "Rolls against them" / "The next Roll against them", then " with {filter}", then " against {origin / the creature it marked}" (or " made by ..."), then ", the first each round", then ", while they see {origin}". Payload = the parts joined with ", " and " and ": "1 Boon and Empowered +1", "ignore Low cover", "show the note **Brute Force**", "an extra 1d6 [V] Holy damage on T2/T3 and 1d4 [R] Psychic damage on T3". Then "; the target gains **Frightened** on T3" for each damage entry with an Effect. Tiers are omitted when all three are on. With no part on: "Does nothing yet: switch on a part below."

Examples (all in the mockup):
- Frightened: "Their Rolls, while they see **Ogre Chieftain**: 1 Bane."
- Vow of Enmity T2: "Their next Roll with [Strike] Actions against the creature it marked: 1 Boon and Empowered +1."
- Radiant Zeal: "Their Rolls with [Strike] Actions, the first each round: an extra 1d6 [V] Holy damage on T2/T3 and 1d4 [R] Psychic damage on T3; the target gains Frightened on T3."

List label: the payload short ("1 Bane", "1 Boon, Empowered +1", "+1d6 Holy, +1d4 Psychic", "Ignore Low cover and one range Bane", "Show the note Brute Force").

### 5.2 Changes a value (tile V)
Merges the old **Defense**, **Speed** and **Rally Points** blocks.
- **Changes:** `Defense | Speed | Rally Points`.
- **Amount:**
  - Defense: stepper −4…+4 (formula allowed behind it) + `<select>` every Defense, Armor (AD), Ward (WD), Vs. Body, Vs. Mind, Vs. Appeal, Vs. Instinct.
  - Speed: stepper −6…+6 (formula allowed) + `<select>` **every Speed**, Walk, and Fly / Climb / Swim shown disabled with "(later)" (the code only has Walk today; build the field so new Speeds are new options).
  - Rally Points: "Each heals [formula] more" (default `@origin.pow + 2`). **The old "for this creature and its allies within N squares" field is removed:** allies are reached by an Aura that carries this effect (5.6). Migrate existing ones: an effect with allies within N > 0 becomes an Aura N (allies and itself) carrying a new effect with the Rally rule; report each.
- **Counts as** (Defense and Speed): `A bonus | An increase | Set to`.
- **Named** (when a bonus): `n/a | Field | Pressure | Support`. **NEW rule (section 8):** named bonuses work as named Boons and Banes: different names add, the same name keeps the highest, an unnamed bonus never adds to another (Stacking).
- **Against** (Defense only): `any creature | the origin | the marked one`.
- **Only:** While they see the origin; Origin chip when used.
- Sentences: "+1 Support bonus to every Defense." / "Increase Ward Defense by 1." / "every Speed becomes 4." / "+2 bonus to every Speed." / "Each Rally Point heals the origin's Power Modifier + 2 more."

### 5.3 Grants an Effect or Action (tile G)
One rule, one drop zone. Merges the old **condition drop zone** ("Drop a condition here"), **Grants an Action while active**, **Grant action use**, **On damage**, **Effect each turn** and **Chat message**. The pane follows what was dropped.

**An Effect dropped** (any effect or condition):
- Directly under the drop: **Value** stepper if the effect is valued (Empowered, Enfeebled, Vulnerable, Dazed, Slowed, Sickened, Exhausted, Quickened... whatever the system marks as valued); **"{Effect} by / of"** with an Origin chip if the condition has a source (Taunted by, Frightened of, Grabbed by).
- **When:** 2 × 2 grid: `While this effect lasts | Start of each of its turns | Start of each encounter | When it deals damage`.
  - While this effect lasts: the bearer has it; it ends with this effect (the old condition list).
  - Start of each of its turns / Start of each encounter: the bearer gains it then, with its own duration (the old Effect each turn).
  - When it deals damage: **Damage** `any | [V] | [R]`, **Tag** `<select>` (the world's Tags setting); the creature it damages gains it, with its own duration (the old On Damage). Keep any other filter the old On Damage had.
- Sentences: "Is **Sickened 1**." / "At the start of each of its turns, it gains **Radiant Zeal**." / "When it deals [V] damage to a creature, that creature gains **Sickened 1**."

**An Action dropped:**
- **When:** `While this effect lasts | Start of each of its turns | Start of each encounter`.
- **Gives:** `The Action | Uses of it`.
  - The Action: the bearer has it (the sheet's Granted section), while this effect lasts (or until its next turn, when timed). Frequency comes from its card.
  - **Uses of it:** Uses stepper (N uses) + "uses for" AP stepper (0–4, its cost while granted); **Roll:** stepper 0–5 + `Boons | Banes` (one or the other, never both); **Damage:** stepper + `Empowered | Enfeebled` (one or the other); **Against:** `any creature | the targeted creature | the marked one` (**no origin here**: Lucas, these are beneficial and target enemies; "the targeted creature" = the creature the Action that applied this effect targeted); **"On its tiers"** (heading): rows of On (T1 T2 T3) / Then (a text, or a dropped Effect) with "Remove", and "+ On a tier". This is the old Grant Action Use ("Can use X N time for N AP with N Boons. The uses go to... On [never]... And on [never]..."); keep the granted-use buttons on the card (README rule 28) working.
- Sentences: "Has the Action **Beacon's Step** while this effect lasts." / "Can use **Weapon Attack** once for 0 AP; on T3, the target's next damage is halved." / "At the start of each encounter, it can use **Mark Quarry** once for 0 AP; ..."

**Message** (when **When** is not "While this effect lasts", for an Effect or an Action): a **Post to chat** switch, `Owners and GM | GM | Everyone`, and the message text. With an Action dropped, the Action comes as a button on the message (the old Chat message's "offer the Action as a button, for N AP"). Use `sysCard` from sysmsg.mjs (never a plain line). Sentence adds "; posts "{text}" to its owners and the GM."
- No message-only Grants (a reminder on Rolls is the Note part of 5.1).

List label: "Has Beacon's Step", "Use of Weapon Attack", "Taunted", "On damage: Sickened", "Each turn: Radiant Zeal", "Each encounter: use of Mark Quarry".

### 5.4 Weapons (properties, Mastery) (tile W)
Merges the old **Weapon property** and **Starting mastery** blocks.
- **Changes:** `A property | Starting Mastery`.
- A property: **Weapon** `<select>` Fists, The weapon in its main hand, All its weapons, **Its weapons with the property…** (then a second property `<select>`: the filter); **Property** `Gains | Loses` + property `<select>` (the system's weapon properties).
  Sentences: "Its Fists don't have the property **Non-threatening**." / "Its weapons with the property **Thrown** have the property **Long**."
- Starting Mastery: "the player chooses one with" + property `<select>`; **Starts at** stepper. Asked once, when this effect is added (as the old one did); the choice is kept on the effect. "Choose one weapon with the property **Projectile**: it starts at 3 Mastery."

### 5.5 Escalation hook (tile E)
The old Escalation hook, its own kind. **When:** `<select>` of the triggers the code supports today (the old block shows "An ally within N squares becomes Bloodied or goes Down"; list exactly the ones states.mjs / mark.mjs implement, no invented ones, and report the list); **Within** N squares stepper when the trigger has an N. Help line: "Once an encounter, +1 Escalation (the class hook in Chapter 2)." Sentence: "Once an encounter, when an ally within 5 squares becomes Bloodied or goes Down: its Escalation rises by 1."

### 5.6 Aura (tile A)
The old **Aura** block, reorganized; it is a rule (an effect can have Beacon's Step for its bearer **and** an Aura).
- **Size:** "Aura [formula] squares" (default 2; e.g. `@origin.pow`). Help: "Counted from every square it occupies (Chapter 3, Aura)."
- ~~**Affects:** `Allies | Enemies | Everyone`, and a switch **And this creature itself**.~~ **[CHG] PACK ZONE: each row of "What it does inside" has its own Who** (`Allies | Enemies | Everyone`, full width) and its own switch **And this creature itself**: Consecrated Ground needs Enemies for one row and Allies for another. An older Aura's one Affects goes to its Carries row.
- **"What it does inside"** (heading): the block of section 5.10 (shared word for word with the Zone): Carries an Effect, Heals, Hazard [HT], Difficult Terrain. Was: two part rows, both may be on:
  1. **Carries an Effect:** drop zone; whoever is inside gains it on entering and loses it on leaving. The carried effect keeps its own rules (the old "Drop the Effect that whoever is inside gains").
  2. **Hazard [HT]** (**NEW here**, it was only on regions / Zones): Triggers `Entering`, `Turn`, `Movement` switches (none ticked = Entering and Turn; Entering and Turn hit once per turn-cycle, Movement each Movement across it: Chapter 3, Hazardous Terrain; reuse hazard.mjs); **Damage**: a list of entries (dice / formula, `[V] | [R]`, subtype), "+ Another damage", "Remove" per entry when 2+; **Also:** Gives an Effect (switch) + its own drop zone. Who it hits: the Aura's Affects (and itself if ticked).
- **"On the map"** (heading): a part row **Shown on the map**: Outline color and Squares color, each a color picker (`<input type="color">`) plus presets (Gold, Holy, Ally, Enemy, Arcane, Nature), and a small preview (a dark square, the area's squares outlined around a Y token).
- Sentence: "Aura 2: Allies inside, and this creature, gain **Beacon's Ward**." / "Aura 1: [HT: Entering, Turn] Creatures take 1d6 [V] Fire and 1d4 [R] Psychic damage." / "Aura 3: Creatures inside gain ...; [HT: Entering, Turn] they also take ...". A formula size reads "Aura (equal to the origin's Power Modifier)".
- List label: "Aura 2: Beacon's Ward", "Aura 1: HT 1d6 Fire + 1d4 Psychic".

### 5.7 Light (tile L)
The old **Token light** block.
- **Bright** stepper "squares"; **Dim** stepper "squares beyond the Bright light".
- **Color:** a color picker (`<input type="color">`) plus presets Torch, Holy, Moon, Fire, Arcane, Fey (the old free-text hex field goes).
- **Intensity:** a slider 0–1 (step 0.05) with its value.
- **Animation:** `<select>` (the animations the code supports); its speed and strength steppers appear only when one is chosen.
- A small preview (the light's two rings around a Y token).
- Help: "The Bright and Dim light follow the book's Light rules (Obscured, the Hide penalty); color and animation are only the look." **Both** apply: the light is a rule (light*.mjs) and a look.
- Sentence: "Sheds Bright light in a 1 Emanation and Dim light 2 squares further."

### 5.8 Movement limit (tile M) (NEW)
- **Can't move:** `closer to | away from` the origin; **Only:** While they see the origin; **Origin** chip.
- It blocks a willing Move that ends nearer to (or farther from) the origin than it started (move.mjs; Forced Movement is not willing). Frightened uses "closer to" (Chapter 8).
- Sentence: "Can't willingly move closer to **Ogre Chieftain**, while they see **Ogre Chieftain**."

### 5.9 Not a rule any more
- **Each turn: damage / Bleed (damage each turn):** the old "Bleed (damage each turn)" block. **Bleed is a condition** (Chapter 8) and must keep working exactly as now. Remove this block from "+ Add rule" for new effects; keep its data and code for the Bleed condition. If the Bleed condition needs the setting to stay editable, show it inside the new pane as a legacy rule ("Bleed (condition)") with its old controls, and report it. Hazards are on the Aura (5.6) and, later, the Zone.
- **No Reactions / Loses AP:** conditions (3.8).

---


### 5.10 Zone (placed on the map) (PACK ZONE, Lucas's decisions 2026-11-10)
Reference for the layout and the wording: `foundry/mockups/zone-prototype.html`, **option A** (B and C are rejected alternatives). Press **?** in it for the help texts.

**Where it is** (the Details tab's first section, under the hover card): full-width segmented `On a creature | On the map (a Zone)`. "On a creature" shows the rule list (sections 3.4, 5.1 to 5.9). "On the map" hides it and shows The area, What it does inside and On the map; Ends stays below. Switching keeps both sides' settings. Help: "On a creature: the rules below need a bearer. On the map: the effect has no bearer; it is the area, and what it does to creatures inside."

**The hover card** of a Zone (the tip, the hover card on the map, the effect's chips): its area, its rows, its Ends. "2 / 3 Emanation. Enemies inside gain Consecrated Ground (1 Bane). Allies inside heal 1d4 at the start of each of their turns. Lasts 3 rounds."

**The area:** "Shape and size: `From the Action | Set here`".
- **From the Action** (default when an Action applies the effect): a read-only dropped-Action card: name, cost, Frequency, "Area: 2 / 3 Emanation · Distance: 10 sq.". Help: "The card's Area line is the only place the shape is written: change the card, and every Zone it places changes with it."
- **Set here** (default with no Action; a GM's trap): Shape `Emanation | Burst | Line`; Size, a formula field ("squares", "squares long" for a Line); a square preview with the book's footprints (Emanation N = (2N+1)², Burst N = the squares whose center is within N of a corner: 1 → 4, 2 → 12; Line N from the origin); **Place on the map** (the existing placement, kept as this Zone). Help: "Placed by hand: you draw it where you want. An Emanation stays where it is placed; for an area that follows a creature, use an Aura rule instead." No Aura shape here (an Aura is a rule, with a bearer).
- Placing from an Action: no new Action setting. An applied Effect whose Where is "On the map" makes the card's Place Area button keep the area as that Zone, with the card's shape, size and Distance; (T2/T3) as for other effects; the Version's own rounds win.

**What it does inside** (the Aura's block too, word for word), four part rows, each with its Who (`Allies | Enemies | Everyone`, judged from the origin's side: a neutral counts as an enemy) and **And the origin (name)** (on an Aura: **And this creature itself**; the origin is never its own ally: Chapter 1):
1. **Carries an Effect:** a drop zone "Drop the Effect they have while inside". Summary "Enemies · Consecrated". Help: "Gained on entering, lost on leaving or when the Zone ends. While carried, its own Ends are not used: to give something that lasts after leaving, use Hazard → Gives an Effect."
2. **Heals** [ADD]: "Heal [1d4] at the start of each of their turns inside", a formula (1d4 + @origin.pow). Summary "Allies · 1d4 (avg 2.5) a turn" (the average for plain dice only). "And the origin" on by default. Rolled for each creature at the start of its own turn, once per area, through the Heal window (Chapter 4: it chooses which damage); not on entering. Help: "A heal, as Heal in Chapter 4 (they choose which damage), rolled for each creature at the start of its own turn. Formulas work: 1d4 + @origin.pow."
3. **Hazard [HT]:** Triggers Entering / Turn / Movement (none: Entering and Turn; Entering and Turn share one hit per turn-cycle, Movement once per Movement; a creature inside when the Zone appears counts as entering: Chapter 3), damage entries (dice or formula, [V] / [R], subtype; + Another damage; Remove), Also: Gives an Effect (its own Ends).
4. **Difficult Terrain** [ADD]: Who (default Everyone). Summary: the Who. Sentence "Its squares are Difficult Terrain for enemies." / "...for every creature but Nari." Its squares cost double for the creatures it reaches only (the movement cost, the Charge's check); Forced Movement ignores it. Help: "Its squares count double for movement, for the creatures it affects (a persistent effect can hinder one side only). Forced Movement ignores it."

**On the map:** the Aura's "Shown on the map" row (outline and squares, the six presets, a preview). Off: the area still works, only the Regions layer shows it.

**Ends** (the same list as on a creature): **Time** `Rounds | This encounter` (no EoT; it counts down at the end of the slot in which it was placed, Chapter 2); **A Save** greyed, "not for a Zone"; **Origin goes Down** as on a creature; **They use an Action** greyed (no bearer); **Someone uses an Action** [ADD]: Who `The origin | Anyone within Reach of it`, a cost stepper (default 1 AP, 0 to 3) "AP, an Interact"; summary "Nari · 1 AP". The Zone's card in the chat (posted when it is placed) has the "End it" button.

**The old Zone block** [DEL] ("The placed area affects [allies] inside it. At the start of each of their turns inside, they heal [1d4]. Drop the Effect they carry while inside."): **migrated**, on load: Where = On the map; the dropped Effect → Carries an Effect (its Who = the old "affects"); the heal → Heals (its Who = the old "affects", "And the origin" off: the book's "You are never your own ally"); From the Action. A Zone already on a map reads its old rules as rows.

**Not built:** a Darkness or Obscured Zone ([IDEA], rules-backlog.md: the book first).

## 6. The data

- One **rules array** on the effect, each rule `{ id, kind, ...its fields }`, in list order; Ends and Automation as their own objects. Keep field names you already have where they mean the same (e.g. `bbName`); add the rest.
- Every rule kind needs: a default, a validator (clamp numbers, drop unknown traits), the pure `sentence(rule, effect)` and `summary(rule)` / `label(rule)` functions, and the reading code in the module that applies it.
- **Migration:** on load (with the system's existing "once per world, after a backup reminder" migration pattern, like `migrateR()`), convert every old setting to the new rules (section 7), for world items, embedded effects on actors, and the compendium packs (rebuild them from `tools/content.mjs`; update the `foundry` blocks in `book/cards/*.json` and the cards README's format section to the new shape). Expose `game.twod12.migrateEffects()` for a manual run. An effect that can't be converted cleanly keeps working on its old fields and is listed in a console report ("twod12 | effects not migrated: ...").
- Applied copies of an effect (on actors) follow the same migration.

### 6.1 Content to update (not only migrate)
- **Frightened** (Conditions compendium, Chapter 8): two rules. (1) On matching Actions: Rolls made by them, any Action, against any creature, Every time, **While they see the origin**, Boons and Banes: 1 Bane, n/a (it applies to all their Rolls, the Save that ends it included). (2) Movement limit: can't move **closer to** the origin, **While they see the origin**. Its hover card must read like the mockup's. Its old hover text ("1 Bane on all your Rolls while you see its source; you can't willingly move closer to it.") becomes the built text: clear the override.
- Any other compendium effect whose hover text describes something its settings now can express (a movement limit, a named bonus): leave it as it is and list it in the report for Lucas.

---

## 7. Old setting → new rule (the map)

| Old block (today's Details tab) | New place |
|---|---|
| In short / Hover text / Show help | Hover card preview + "Write it yourself" override / **?** |
| Automation select, By hand | Automation section (bottom): Script, Players do |
| This is [an effect] placed on [the target] | Removed (an effect's bearer is where it is; Aura is a rule; Zone later) |
| Rules: Only while it sees its origin | Per rule "While they see the origin" |
| Rules: No Reactions | Grants: Staggered |
| Rules: Loses its value in AP | Grants: Dazed or Slowed (match the current behavior) |
| Rules: Ends when its origin goes Down | Ends: Origin goes Down |
| Applied: On X, Its origin Y, Change | Header line; Ends origin; per-rule Origin chips |
| Boons and Banes (Give N Boons and N Bane (name) to rolls made by / against; with all of / any of / none of / saves against; only the first matching Action each round; only against the creature it marked; it counts against any creature; only on rolls with Body/Mind/Appeal/Instinct) | On matching Actions + part Boons and Banes (filter 4.4, Against, Uses) |
| Empowered and Enfeebled (+ its filter, only against the marked one) | On matching Actions + part Empowered and Enfeebled (Set to) |
| Bonus damage (the next matching action deals [dice] extra [type] damage to [pool] on T1 T2 T3; with all of...; the card adds [text]; drop an Effect; only the first each round; only against the marked one) | On matching Actions + part Extra damage (one entry; "next" → Uses: Next one only) |
| Ignore a Bane (matching Actions don't take [one of their range Banes ...]) | On matching Actions + part Ignores |
| Ignores cover (Low / Medium / High) | On matching Actions + part Ignores (Cover) |
| Note (title, in rolls with Body/Mind/Appeal/Instinct, text) | On matching Actions + part Shows a note (attributes → filter) |
| Defense (Give N to [every Defense]) | Changes a value: Defense, a bonus, n/a |
| Speed (Add to the creature's Speed: formula) | Changes a value: Speed, every Speed (formula kept) |
| Rally Points (each heals [formula] more, for this creature and allies within N) | Changes a value: Rally Points; allies within N → an Aura carrying it |
| Drop a condition here (conditions with values) | Grants: Effect, While this effect lasts (one rule per condition) |
| Grants an action while active (Action / uuid) | Grants: Action, The Action, While this effect lasts |
| Grant action use (N times for N AP with N Boons; uses go to; on [tier] [what] [text], and on ...) | Grants: Action, Uses of it (Boons → Roll Boons; uses go to → Against; the tier lines → On its tiers rows) |
| On damage (deals [type] damage to a creature with the Tag [..]: drop the Effect) | Grants: Effect, When it deals damage (pool, Tag) |
| Effect each turn (drop the Effect gained at the start of each turn) | Grants: Effect, Start of each of its turns |
| Chat message (at the start of an encounter, post to [..]: text, and offer the Action [..] as a button, for N AP) | Grants: Action (or the Effect), Start of each encounter, Uses (AP), Message on |
| Weapon property / Starting mastery | Weapons |
| Escalation hook | Escalation hook |
| Aura (Aura N around the creature, affects [..] and itself, outline / squares colors, drop the Effect) | Aura (Size, Affects, Carries an Effect, On the map) |
| Token light (bright, dim, color hex, intensity, animation, speed, intensity) | Light |
| Zone (the placed area) | ~~Unchanged: "Zone (old layout)"~~ PACK ZONE: Where it is: On the map (section 5.10) |
| Bleed (damage each turn) | Kept for the Bleed condition only (5.9) |
| Lasts [..], or until the creature uses an action with [any] of [+] | Ends: Time / They use an Action |

Anything else the code has: keep it, place it, report it.

---

## 8. Book and backlog

Rules go into the book first (rules-src), then Foundry; log both in `book/rules-backlog.md`.

1. **[ADD] Named bonuses (Chapter 2, Stacking; Glossary "Stacking"):** a bonus to a value such as a Defense can have a name, as Boons and Banes do (Field, Pressure, Support). Bonuses with different names add up; bonuses with the same name keep the highest; an unnamed bonus never adds to another bonus (only the highest counts, as now). Write it in Lucas's style (rules-src README), one short paragraph and one example with the names list.
2. **[Q] Effect Timing, "until a Save":** Chapter 8's [[Effect Timing]] section (linked from "until a Save") should state the default (when the Save is rolled, its DC, what Tier 2 does). The Foundry Ends row follows Bleed's pattern (end of turn or Interact, DC 13, Tier 2 ends at EoT). Log it as a [Q] for Lucas; don't write the rule.
3. Book: nothing else changes. Chapter 1's roll-kind table already covers Save and Check in the filter.

Also: `foundry/foundry-backlog.md` (the v0.0.112 "Effect Details tab" known limits are replaced by this pack's), `book/cards/README.md` (the `foundry` block's effect format), HANDOFF.md, MASTER-PLAN.md.

---

## 9. Tests

Next free test number: check `tools/tests` (gaps exist). Add at least:
- **Sentences:** every example in sections 5.1 to 5.8, word for word, plus the merged hover-card limit and the Ends sentence (each Ends combination, "an Appeal").
- **Migration:** one fixture per old block in section 7 (old data → new rules → same behavior where the code can be run without Foundry: modifiers resolved for a sample roll, Defense / Speed values, the damage entries).
- **Filter matching:** Has all / one / not, and Chapter 1's table (Body Rolls vs Body Checks vs [Weapon]; Save and Check).
- **Formulas:** `@origin.pow + 2`, `floor(@target.body / 2)`, dice in damage, invalid input → 0.
- **Spent rules:** Next one only spends the rule; the effect ends when all spendable rules are spent.
- **Named bonuses:** different names add, same name highest, unnamed doesn't add.
- **Increase by** for Empowered / Enfeebled.
- Keep every existing test passing; update expected outputs only where the meaning is the same and the text moved (list each in the report).

---

## 10. Allowed choices (decide, then list under "Assumptions I made")
- Exact kind-tile colors and letters; preset color values; the stepper ranges where the brief gives none.
- Which old Ignore-a-Bane options map to which Ignores controls.
- How a granted Action shows "spent" uses on its card.
- How "Loses its value in AP" maps to Dazed or Slowed per effect.
- The Escalation hook trigger list (only what the code supports).
- Where the old Zone controls sit inside the new pane.

## 11. The report
- What was built, the files touched, the migration's console report for the shipped compendiums (how many effects, any not migrated).
- Assumptions I made.
- Not tried in Foundry (and how to check each).
- **Test checklist for Lucas** (per version), at least: open Frightened from the Conditions compendium (2 rules, merged hover card, Ends rows); add each of the 8 kinds; drop an Effect and an Action on Grants; Aura with Carries + Hazard on a token (enter, end a turn, leave); Light color picker on a token; the **?** button; the trash bin; an old world effect migrated (Beacon, Covering Shot, Radiant Zeal, Rally Points, Brawler, Bow Mastery); a roll with Boons from an effect with "While they see the origin" (break line of sight: the Boon goes).
