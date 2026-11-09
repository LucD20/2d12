# Weapon and Power Modifiers as class values: the draft for review (pack MOD)

**Status: APPLIED to rules-src on 2026-11-09 (Lucas: "All defaults": the 7 questions of section 12 as written; the ruler's builds too). Foundry: not yet** (foundry-backlog.md "MOD"; the list is section 11). This file is the record of what changed and why. The decisions are in `rules-backlog.md`, "MODIFIERS, FLAT BOONS, FAVORED'S DOUBLES" (decided 2026-11-08: track A2, Ward Defense stays 11 + Power Modifier, the Paladin +2 / +1 either way, the Archer Weapon +2 / Power +1). Answer by number ("all defaults except 3"; "5: change X"). The questions and their defaults are in section 12.
**Not in this draft:** the Attributes and Skills chapter (D3). This draft only takes the Modifiers off the Attributes; what the Attributes still do is said in one line (section 4) and written in full by that chapter. The Save DC of an Attribute (11 + ⌈Attribute ÷ 2⌉ + 1) is left as it is (section 12, question 7).

## What the draft does

1. **A class gives two Modifier values** (+2 and +1 at level 1). The Paladin chooses which is the Weapon Modifier and which the Power Modifier; the Archer's are fixed: Weapon +2, Power +1.
2. **Stages raise them:** Stage 2 (level 5) +1 to the one you choose; Stage 3 (level 8) +1 to both; never above +4. So at level 8: +4 / +2 or +3 / +3.
3. **The ÷ 2 + 1 formula goes**, and with it the Weapon, Power and Signature Attributes, the "both want the same Attribute" paragraph and the Modifier half of Distinct Choices.
4. **Ward Defense stays 11 + Power Modifier:** a weapon-first character has WD 12 at level 1, on purpose.
5. **The Signature Modifier** stays the higher of the two (you choose on a tie).
6. **"1 Boon on Body Rolls" no longer reaches Weapon, Power or Signature rolls** (they use no Attribute now): Chapter 1's table gets simpler.
7. **NPCs:** the Modifiers are role values (the numbers every example NPC has today), not from its Attributes.

### The track at a glance

| | Level 1 | Stage 2 (level 5) | Stage 3 (level 8) |
|---|---|---|---|
| Weapon-first | +2 / +1 | +3 / +1 or +2 / +2 | +4 / +2 or +3 / +3 |
| Power-first (the Paladin only, today) | +1 / +2 | +1 / +3 or +2 / +2 | +2 / +4 or +3 / +3 |
| Ward Defense (11 + Power) | 12 or 13 | 12 to 14 | 13 to 15 |

(Before: every R build started at +2 / +2, WD 13. The ruler's scratch run of 2026-11-08 is the cost, in the backlog: a weapon-first Lay On Hands Paladin is the build that loses; Lucas: fine as is.)

---

## 1. Chapter 5, Building a Character (`05-characters.md`)

**Now (step 3):** "...a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**."
**Draft:** no change to step 3 (the class still gives them). **Step 4** gains the Modifier choice:

> 4. **Choices.** When a species or class says "or", pick one. A class's choices between two Attributes must be different from each other (see [[Distinct Choices]]). If your class lets you, choose which of its two Modifier values is your Weapon Modifier and which your Power Modifier (see [[Weapon, Power and Signature Modifiers]]).

## 2. Chapter 5, Classes (the opening paragraph)

**Now:** "...a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**, an **[[Armor Training]]**, and a list of **Escalation** abilities. Round modifiers up. A class's Weapon Modifier and Power Modifier use the higher of the Attributes it lists for each, and can't use the same Attribute."

**Draft** (the last two sentences go; "Round modifiers up" only served the ÷ 2):

> Your class gives you Attribute increases, a **high** and a **low Health value** with their Stage steps (used for your Health Pool), a **Rally** value (used for Rally Points), a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**, an **[[Armor Training]]**, and a list of **Escalation** abilities.
>
> When you pick your class, you choose its Attribute increases when they say "or", and the order of its Modifiers if it lets you. These choices can't be changed later.

## 3. Chapter 5, Stages (the table's Modifiers row)

**Now:** Stage 2 empty; Stage 3 "+1 to your Weapon and Power Modifiers (never above +4)".

**Draft:**

> | **Modifiers** | your class's values | +1 to your Weapon or Power Modifier | +1 to your Weapon and Power Modifiers |

and one sentence under the table, after the Stage Talent's:

> A Modifier is never above +4. Your choice at Stage 2 can't be changed later.

## 4. Chapter 5, Distinct Choices

**Now:** two bullets (Attribute increases; Weapon and Power Modifiers) and "The two kinds don't limit each other: a Paladin who adds +1 to Body can still use Body for the Weapon Modifier."

**Draft** (the heading stays: step 4 and the glossary link to it):

> ### Distinct Choices
>
> When your class gives you a choice between two Attributes, you can't pick an Attribute you already picked from another of its choices: each Attribute increase goes to a different Attribute. If a class offers "Body or Appeal +1" and "Appeal or Instinct +1" and you pick Appeal for the first, you must pick Instinct for the second.

## 5. Chapter 5, Weapon, Power and Signature Modifiers (replaces the whole section)

**Now:** each Modifier is the higher of the class's two Attributes ÷ 2 + 1; the Weapon / Power Attribute; "+1 at Stage 3, and they also follow your Attributes"; the shared-Attribute paragraph; the Signature Attribute; the Body 1 / Mind 2 / Appeal 3 example.

**Draft:**

> ### Weapon, Power and Signature Modifiers
>
> Your class gives you two **Modifier values**: **+2 and +1** at level 1. One is your **Weapon Modifier**, which [[Weapon]] Actions roll; the other is your **Power Modifier**, which [[Power]] Actions roll and which sets your [[Defenses|Ward Defense]]. Your class says which is which, or lets you choose. They don't come from your Attributes, and your Attributes don't change them.
>
> They grow with your [[Stages|Stage]]: at **Stage 2** add +1 to the one you choose, at **Stage 3** +1 to both. A Modifier is never above +4.
>
> Your **Signature Modifier** is the higher of your Weapon Modifier and your Power Modifier (if they are equal, choose one). Actions with the [[Signature]] trait roll it.
>
> Your **Attributes** set your Checks (Initiative is one), your Saves, your Defenses against an Attribute, your rolls on the Dying and Shattered Tables and the Attribute Actions, such as Shove and Trip (see [[Rolls]]).
>
> > [!example]
> > Lonny's Paladin leads with the sword: Weapon Modifier +2, Power Modifier +1 (Ward Defense 12; his Signature Modifier is +2, from his Weapon Modifier). At level 5 he adds +1 to his Power Modifier: +2 / +2, Ward Defense 13. At level 8 both rise: +3 / +3.

(The Attributes line is the one place that says what Attributes still do, as the review asked; the Attributes and Skills chapter will replace it with a link.)

## 6. Chapter 1, Rolls (`01-roll.md`: the roll kinds, "An effect on Actions names their trait" and its table)

**Now:** the Weapon / Power / Signature roll rows link to Chapter 5's Modifiers (unchanged). The paragraph: "...and doesn't help a Body roll, even if your Weapon Modifier uses your Body Attribute in its calculation when you picked your class. ... An effect that names an Attribute and "Rolls" applies to every kind that uses that Attribute (for a Weapon, Power or Signature roll, the Attribute behind its Modifier)." Then "Like the previous example, if you actually got "1 Boon on Body Rolls", it would apply to your Weapon rolls, since they use your Body." The table has an "(Attribute\*)" column for Weapon, Power and Signature rolls, all ✔ on the "Rolls" row.

**Draft:**

> An effect on Actions names their **trait**: "1 Boon on [Weapon] Actions" helps every Action with the Weapon trait, whatever Modifier it rolls (a [Signature, Weapon] Action too). An effect that names a Check or a Save applies only to that kind. An effect that names an Attribute and "Rolls" applies to every kind that rolls that Attribute: its Checks, its Saves and its Attribute Actions. Weapon, Power and Signature rolls use no Attribute. "Your Rolls" means all of them.
>
> | The effect says | Attribute\* Check | Attribute\* Save | Attribute\* Action | Weapon roll | Power roll | Signature roll |
> |---|---|---|---|---|---|---|
> | 1 Boon on Attribute\* Checks | ✔ | — | — | — | — | — |
> | 1 Boon on Attribute\* Saves | — | ✔ | — | — | — | — |
> | 1 Boon on Attribute\* Rolls | ✔ | ✔ | ✔ | — | — | — |
> | 1 Boon on [Weapon] Actions | — | — | — | ✔ | — | ✔ if it has the Weapon trait |
> | 1 Boon on [Power] Actions | — | — | — | — | ✔ | ✔ if it has the Power trait |
>
> \*Body, Mind, Appeal or Instinct (the same one in each row and column).

(The "Like the previous example" sentence goes. "1 Boon on Your Rolls" is not a row: the sentence says it.)

## 7. Chapter 1, Saves and Save Actions

**No change.** "11 + the Weapon, Power or Signature Modifier that sets it" still reads right; the Attribute DC (11 + ⌈Attribute ÷ 2⌉ + 1) stays (question 7).

## 8. Glossary (`09-glossary.md`)

| Term | Now | Draft |
|---|---|---|
| **Distinct Choices** | "...can't repeat an Attribute: Attribute increases among themselves, Weapon and Power Modifiers between themselves." | "A class's Attribute increases go to different Attributes." |
| **Power Modifier** | "The higher of the class's two Power Attributes ÷ 2 + 1. Power Actions roll it." | "One of your class's two Modifier values (+2 or +1 at level 1; it grows by Stage). Power Actions roll it; Ward Defense adds it." |
| **Weapon Modifier** | "The higher of the class's two Weapon Attributes ÷ 2 + 1. Weapon Actions roll it." | "One of your class's two Modifier values (+2 or +1 at level 1; it grows by Stage). Weapon Actions roll it." |
| **Signature Modifier** | unchanged | unchanged |

## 9. The classes (`12-paladin.md`, `13-archer.md`: the stat box)

**Now:** two rows, "Weapon Modifier: Body or Appeal" and "Power Modifier: Mind or Appeal" (the Archer: "Instinct or Body", "Mind or Appeal").

**Draft** (one row in place of the two):

> Paladin: **Modifiers** · +2 and +1: you choose which is your Weapon Modifier
> Archer: **Modifiers** · Weapon +2, Power +1

No card changes. The cards that add the Power Modifier (Lay On Hands, Shield of Faith, Font of Mercy, Mending Light, Hallowed Stance, Hallowed Dawn) read the same; a sword-first Paladin's are 1 lower, as decided. One `_note` in `paladin.json` (Mending Light: "5 / 6 / 9 with a Power Modifier of 2 / 2 / 3") becomes "with a Power Modifier of 2 / 3 / 4 (a faith-first Paladin; 1 less sword-first)". The Archer's cards use the Weapon or the Signature Modifier only (+2, unchanged).
The classes' Attribute increases ("Body or Appeal +1, Mind or Instinct +1") stay as they are here; the Attributes and Skills chapter looks at them.

## 10. Gear (`15-gear.md`) and the Bestiary (`14-bestiary.md`)

**Gear, the example (line 9). Now:** "A Paladin whose Weapon Modifier uses Body deals 1d8 + Body slash damage on Tier 2 with a Greatsword Weapon Attack."
**Draft:** "A Paladin with a Weapon Modifier of +2 deals 1d8 + 2 Slashing damage on Tier 2 with a Greatsword Weapon Attack." ("Your class determines your Weapon Modifier." stays: it is truer now.)

**Bestiary, Attacking Ward Defense. Now:** "a PC's Ward Defense is 13 at Stage 1 (14 at Stages 2 and 3), close to its Armor Defense".
**Draft:** "a PC's Ward Defense is 12 or 13 at Stage 1 (up to 14 at Stage 2 and 15 at Stage 3), close to its Armor Defense".

**Bestiary, Attributes and Modifiers (replaces the paragraph). Now:** "Choose a **Weapon Attribute** and a **Power Attribute**: each Modifier is **⌈Attribute ÷ 2⌉ + 1**, as for a PC... An NPC's Modifiers don't grow with its Stage (its Health and damage tables do), and are never above +4."
**Draft:**

> ## Attributes and Modifiers
>
> Assign the Attributes to **Body, Mind, Appeal and Instinct**. Its Vs. Attributes are 13 + half, as for anyone.
>
> An NPC's **Modifiers** are its role's: choose which is its Weapon Modifier and which its Power Modifier (a creature that attacks Ward Defense usually leads with Power). They don't come from its Attributes and don't grow with its Stage (its Health and damage tables do).
>
> | Role | Modifiers |
> |---|---|
> | **Minion** | +2 and +1 |
> | **Grunt** | +2 and +1 |
> | **Standard** | +2 and +2 |
> | **Elite** | +3 and +2 |

These are exactly what a default NPC of each role has today (its High Attribute ÷ 2 + 1 and its Medium one), so **no example NPC changes a number**: the Goblin Sneak (Weapon +2, Power +1), the Orc Warrior (+2 / +2), the Grave Wisp (Power +2, Weapon +2), the Ogre Chieftain (Weapon +3, Power +2). Their lines lose the Attribute in parentheses: "Weapon Modifier +2 (Instinct)" becomes "Weapon Modifier +2".
What is lost: an NPC with an Extreme Attribute no longer hits harder for it (an Extreme +4 Elite gave +3, as its High does). Question 4.

## 11. Foundry and the ruler (after the book; the list for the version)

**Foundry** (one version, best with or right after the book change):
- **Class item:** `weaponAttrs` / `magicAttrs` (the Attribute lists) give way to the two values and an "either order" switch (Paladin +2 / +1, either; Archer Weapon +2, Power +1, fixed): `content.mjs`, the item sheet (`item-sheet.mjs` 250-271), the class summary (`grants.mjs` 35-42).
- **Actor:** new fields for the order chosen at level 1 and the Stage 2 pick; `data.mjs` derives `weaponMod` / `powerMod` / `signatureMod` from them and the Stage (cap +4). `modifiers.mjs` `classModifiers` is rewritten (pure, tested); `modOf` stays for the Attribute DC. `weaponAttribute` / `powerAttribute` / `signatureAttribute` go, with the old `magic*` aliases (check every reader: `rollsource.mjs`, `actions.mjs` 842-846's "No Weapon Attribute" warning, `pcsheet.mjs` 173-182 and 392, `actor-sheets.mjs` 522-646).
- **Choices in the system's style:** the order is a pick window in the class window at level 1 (`classwindow.mjs`, which today asks the shared-Attribute question), the Stage 2 pick at level 5; never a DialogV2.
- **Rolls:** a Weapon / Power / Signature roll has no `attrKey`, so "Boon on Body Rolls" notes (`notesFor`) stop reaching it (section 6).
- **Sheet tiles:** "Weapon +2 · class" instead of "from Body (half, rounded up, + 1)"; the tooltips.
- **NPCs:** `weaponMod` / `powerMod` as fields with the role's defaults (`data.mjs` 238-279, `npcbuilder.mjs` 43, 82, 91: the Attributes panel stops marking a Weapon / Power Attribute; a Modifiers row instead).
- **Migration:** each PC keeps its current order (the higher Modifier becomes the +2; a tie goes to Weapon), its numbers drop to the track; NPCs take their current Modifiers as values (unchanged numbers).
- **Tests:** the `classModifiers` tests, the WD tests (t129), the class window tests; new tests for the track and the migration.

**The ruler:**
- The build files' `weapon-mod` / `power-mod` lines (`rework/*.txt`, `classes/*.txt`): Smite Paladin 2 / 1, Lay On Hands Paladin 1 / 2, both Archers 2 / 1 (their WD follows).
- The Stage builds (`levels.mjs`, `progression.mjs`): the A2 track in place of the Attribute-driven one.
- Re-run `rclasses.mjs` and the rework sheet; the Paladin cards' worth lines that add [PMod] (`worth.json`) re-measured.

---

## 12. Questions (my default first; answer by exception)

1. **The stat box:** one "Modifiers" row in place of the two (section 9). Default: **yes**.
2. **The Stage 2 pick is open to every class, the Archer too** (it could go +2 / +2 for its Ward Defense). Default: **yes**; the alternative is a class that fixes it ("Stage 2: +1 Weapon").
3. **Permanent:** the level 1 order and the Stage 2 pick can't be changed later, as Attribute increases. Default: **yes**.
4. **NPC Modifiers by role** (section 10): +2 / +1, +2 / +1, +2 / +2, +3 / +2, keeping every number. Default: **yes**, and an NPC "built to hit hard" may take +1 on one (never above +4) as a rating, if you want the Extreme lever back (default: **no**, keep it simple).
5. **The ruler's Smite Paladin is weapon-first** (2 / 1), the Lay On Hands one faith-first (1 / 2). Default: **yes** (the pairing the 2026-11-08 run found costs about nothing).
6. **The Attributes line in section 5** stays until the Attributes and Skills chapter replaces it with a link. Default: **yes**.
7. **The Attribute Save DC** (11 + ⌈Attribute ÷ 2⌉ + 1) is left for the Attributes and Skills chapter. Default: **yes** (it is the last ÷ 2 + 1 in the book).

## Assumptions I made (revert any)

- (a) "Round modifiers up" in Chapter 5 only served the ÷ 2, so it goes.
- (b) The level 1 order is chosen in step 4 of Building a Character, with the other choices.
- (c) The Archer's +1 Power is a fixed class value, not "+1 or +0" (Lucas, 2026-11-08: +1).
- (d) The example's name is Lonny (every name has been used once; Lonny, Jacob and Chris the least).
- (e) No card text changes: the cards say "your Power Modifier", which still reads right.
