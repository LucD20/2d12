# Pack C2, Step 0: how class selection works today, and how the new model maps onto it (2026-10-30)

The brief (`class-selection-brief.md`, Step 0) asks for this report and Lucas's OK before building. Nothing is built yet.
Answer by exception ("OK, all defaults" or "all defaults except 3"); the next session builds from this file.

## 1. How it works today (v0.0.184)

**The data** (`module/data.mjs`, `ClassData`): `choiceA` / `choiceB` (two Attribute sets: the two +1s), `bodyMult`, `mindMult`, `rallyMod`,
`speedMod`, `weaponAttrs` / `magicAttrs` (the Modifiers' Attribute sets), `armorTraining`, `modPriority` (which Modifier keeps an Attribute
both would use), `features` (a list of `{ uuid, level }`; the `level` there is ignored: each Feature's own `system.level` decides), and on the
copy inside an actor `chosenA` / `chosenB` (the picked +1s; `chosenWeapon` / `chosenMagic` only for classes from before v0.0.117).
There is no Repertoire, no Escalation list and no notion of sections or levels on the class.

**The picks are Features.** C1 wrote the book's level lists as Features that carry a choice (`choiceOptions`, `choiceCount`, `level`):
"Hallmark Action" (Smite or Lay On Hands), "Encounter Pick", "Escalation Passive", "Escalation Active", "Daily Pick" (level 3),
"Escalation Passive (Level 3)", and the Archer's equivalents. Talents are "Talent (Level 1)" / "Talent (Level 2)" Features with `talents: 1`:
each makes an empty **Talent slot** on the character sheet that the player fills by dropping a Talent on it. The options of each pick are
fixed in its Feature (`tools/content.mjs` lines 379-394), not taken from a class list.

**Dropping a Class** (`module/grants.mjs`, `dropClass`): (1) one dialog (`classChoices`) for the two Attribute increases (they must differ) and,
when the Weapon and Power lists share an Attribute, `modPriority`; (2) the old class and every Feature granted by it are deleted;
(3) the class is copied with `chosenA` / `chosenB`; (4) `grantClassFeatures` grants every Feature whose level is at most the character's level,
and **each pick Feature opens its own small "Choose 1" dialog** (`grantChoices`), one after another. The chosen Action / Feature / Talent is
created with the flags `talentId` (the pick Feature's id) and `choice: true`. Cancel on a pick dialog only warns; the class is already applied.

**Levelling up**: the Level field on the sheet. The `updateActor` hook (`module/twod12.mjs` line 286) calls `grantClassFeatures` again, which
grants the Features of the new levels (the same dialogs). Levelling down removes nothing.

**The sheet**: the Class tab and the class cards read `class.system.features` (a locked card "Gained at level N" for what is not reached yet).
The Talent slots come from Features with `talents > 0`.

**The Class item sheet** (`templates/item-sheet.hbs` lines 37-63): still the old look (not the parchment style; foundry-backlog says
"Class and Species later, when they are redone"): Attribute Increase Choices (two rows of checkboxes), the four numbers, Weapon / Power
Modifier Attribute checkboxes, Armor Training, "If one Attribute is the higher for both Modifiers", a help paragraph, and a Features drop list.

## 2. What the current Details tab has that the new layout leaves out
1. **"If one Attribute is the higher for both Modifiers"** (`modPriority`). The brief's help text says "The two Modifiers can't use the same
   Attribute" but not who keeps it. With the Paladin (Weapon: Body or Appeal; Power: Mind or Appeal) a character with Appeal highest needs it.
   **Default: keep it**, as a small select under the two Modifier selects, shown only when the two Modifiers share an Attribute; in the class
   window it becomes a third toggle in the Attribute section only when it can matter (the dialog asks it today).
2. **The Features list** (the drop zone). Replaced by the sections; nothing else uses it once the sections exist (see 4).
3. **Weapon / Power Modifier as checkbox sets** (any number of Attributes). The new layout has two selects each ("uses X or Y"). Every class
   has exactly two today. **Default: two selects**, stored in the same `weaponAttrs` / `magicAttrs` fields (no migration).
Nothing else is lost. New fields: Category, "Shown as", Flavor, the Repertoire, the Escalation lists, the levels.

## 3. How the brief's model maps onto what exists
| Brief | Today | Plan |
|---|---|---|
| `system.levels = { "1": [section...] }` | the `features` list + each Feature's level | new field `levels` (an array of `{ level, sections }`, since Foundry's schema handles arrays better than keyed objects) |
| Section "Items I drop", Granted | Divine Power, Font of Mercy (level 1 Features) | the Core Features section |
| Section "Items I drop", Choice | the Hallmark Action pick Feature | the Hallmark section (Mode Choice, Pick 1) |
| Section "From the Repertoire" | the Encounter / Daily pick Features (fixed options) | sections with a Frequency; the options come from `system.repertoire` |
| Escalation Pick (choice, from all Passives / Actives) | the Escalation pick Features | "Items I drop", Choice, with the Escalation items dropped in (the brief's migration) |
| Section "Attribute increase" | `choiceA` / `choiceB` | a section with `pairs`; on save, level 1's pairs are written back to `choiceA` / `choiceB` so data.mjs, the Builder and old code keep working |
| Section "Talent" | "Talent (Level N)" Features and their sheet slots | the window picks a Talent; see decision 4 |
| `flags.twod12.classChoices` on the actor | `chosenA` / `chosenB` on the class copy + `choice` flags on the items | both: `chosenA` / `chosenB` stay the source of the Attribute +1s; a new flag on the class copy records `{ level: { sectionId: [uuid] } }`; every item the window adds carries `classSection` and `classLevel` flags, so it can be found and removed with the class |
| The window | `classChoices` + one `grantChoices` dialog per pick | one ApplicationV2 window per level (the picker mockup), replacing both for classes that have `levels`; a class without `levels` keeps today's flow |
| Level up | the hook grants Features up to the level | the hook opens the window for each new level in turn |

The availability rules (candidates − owned − granted at this level − chosen in other sections; need = min(pick, available)) go in a pure
module (`module/classlevels.mjs`) with no Foundry calls, so the tests can run them, the window and the Levels editor's "Player sees" lines
use the same functions.

## 4. Decisions (my default in bold)
1. **Cancel on a level-up**: the Level field has already changed when the window opens. **Default: Cancel puts the Level back** (the sheet is
   then untouched, as the brief wants). Alternative: keep the level and show a "Choose level N" button on the Class tab until it is done.
2. **Levelling down**: **Default: removes nothing (as today); the window's flags make it possible later.** Alternative: remove what the
   higher levels gave (asks first).
3. **The pick Features** ("Hallmark Action", "Encounter Pick", "Talent (Level 1)" and the Archer's): **Default: delete them from the
   compendium** once the Paladin and Archer have levels (they only existed to carry C1's level lists). Characters made before keep their
   copies; re-dropping the class replaces them.
4. **Talents chosen in the window**: **Default: they go into Talent slots as today** (the class's Talent sections make the slots, one per
   pick, and the chosen Talent fills it), so the sheet looks the same and an empty slot still accepts a dropped Talent. The candidates: every
   Talent in the world and the compendiums, plus the Actions that are Talents (Aim, Cut Through), whose Level is at most the character's;
   Prerequisites are shown as text, not checked.
5. **Repertoire Frequency "Passive"** = the Features in the Repertoire (Features have no Frequency); "Turn / Round / Encounter / Daily" = the
   Actions with that Frequency. **Default: yes.**
6. **The Class sheet gets the parchment look** of the other item sheets (the brief's Piece 1), so foundry-backlog's "Class and Species later"
   is done for Class; **Species stays as it is** (out of scope).
7. **The Stage line** (brief point 8) in the window's header on levels 5 and 8. **Default: yes** (levels 4 and up don't exist yet, so it is only
   reachable by a designer adding levels).
8. **The compendium PCs** (the four level 1 builds): **Default: rebuilt with the new flags** so dropping them, levelling them and re-dropping
   the class behave like a new character.

## 5. Size and order (one version, v0.0.185)
`classlevels.mjs` (the logic) and its tests first; then the data model and migration of the Paladin and Archer in content.mjs; the Details tab;
the Levels window; the class window and the drop / level-up hook; the Class tab of the actor sheet reading the sections; the test checklist.
