# Pack: Roll Dialog redesign (the window before an Action rolls)

You are working in the 2d12 repo. Read `CLAUDE.md`, then `HANDOFF.md`, then `MASTER-PLAN.md`, as usual. This is **one pack**: run it start to finish on a branch whose name starts with `pack-` (suggested: `pack-roll-dialog`). Don't stop for minor questions: choose, and list every choice under **"Assumptions I made"** in the final report. Ask only if something is truly blocked (one batch, at the end).

The design was settled with Lucas in the claude.ai design Project on 2026-11-07, over eleven rounds. The final mockup is the canvas **"2d12 Roll Dialog: redesign options"** (https://claude.ai/artifact/VjazW5umxQaGTkr57wwSus). The boards that matter are the three **C2** boards: **C2 · One target (Smite 2 AP)**, **C2 · Area, several targets (Word of Radiance 3 AP)** and **C2 · One target, Defenses hidden (player view)**. The other boards (A, B, C, D) are earlier options that were rejected. **You probably can't open that link; this prompt is the full spec.** Where they differ, this prompt wins.

First step: save this whole prompt as `foundry/mockups/roll-dialog-brief.md`, then add a one-line pointer to it in `foundry/foundry-backlog.md` and `MASTER-PLAN.md`.

---

## 1. Goal and scope

Replace the look and behavior of **the roll dialog**: the window that opens when a character uses an Action that rolls against a Defense, with one target or several (an Area, or a Strike on "all creatures").

**What was wrong with today's dialog** (the design started from a screenshot of v0.0.283):

- **One DC field for every target.** Ch. 1 makes the Defense, Boons, Banes, Favored and Doomed per creature.
- **Bare Boon and Bane counters.** The chat breakdown needs a source name per die ("Boon · Flanking").
- **Favored and Doomed as two independent toggles.** Both on is a normal roll, and the dialog didn't say so.
- **Empowered and Enfeebled both looked active.** They net (Ch. 8), and the dialog didn't show the net.
- **Two things called "Modifier".** The "Modifier 0" field sat next to the "Signature +2" line.
- **The Defense was printed twice**, and it ignored the "Hide enemy Defenses" setting.
- **The full card was repeated** with averages, odds and "force a Tier", which is designer data.
- **"Distance: 1"**, a "0 Greatsword" line, and weapon dice with no subtype.

The new dialog shows the **whole Action**, then **your roll**, with every Boon, Bane and bonus as a named, switchable chip. The player sees exactly what they are about to do before they do it.

**Out of scope:**

- Checks and Saves a creature rolls for itself, and Linked Actions (Double Shot, Charge). Keep their dialog working as today, restyled with the new tokens where it's free. Note them as known gaps.
- The chat cards (`chat-cards-brief.md`), except passing the named sources through (section 7).

**No rule changes.** The book (`book/rules-src/`) is the source of truth. The one book edit in this pack is the text fix in section 9. Log any other question in `rules-backlog.md`.

---

## 2. Before you write code

- Find the current dialog. Search `module/` for:
  - the Version tabs ("1AP / 2AP / 3AP")
  - the card preview with "Signature Modifier (Body): 2d12 +2 vs DC 11 T1 17% · T2 45% · T3 37%" and the "Avg … (with Radiant Zeal +1d6)" lines
  - the DC and Modifier fields
  - the "ROLL" row (Favored, Doomed, Boons N, Banes N), the "BONUS" row (Radiant Zeal, Heavy Blows chips) and the "DAMAGE" row (Empowered N, Enfeebled N, Nonlethal (1 Bane), added in v0.0.283)
  - "For testing: click a Tier in the preview to force that result"
  - the target tiles (right-click to remove, v0.0.217)
  - the Place Area flow (v0.0.249, v0.0.256)
- Find where the roll reads its Boons, Banes, Favored, Doomed and modifiers today, and which ones are **detected automatically** (Flanking, Cover, Frightened, range, Engaged, Prone, Vulnerable, Hidden, Exhausted…). Make a table of what is detected and what isn't; it goes in the report.
- Keep the data model and the flags the roll already stores. Prefer changing the template, CSS and render functions over the roll logic, except where section 8 requires a logic fix.
- CSS: add **one new version-tagged block** for the dialog. Don't regroup older CSS (CLAUDE.md gotcha). Colors come from CSS variables; reuse the chat cards' variables (`chat-cards-brief.md` section 3) when they hold the same value.
- Write down in the report which files you changed and why.

---

## 3. Design tokens

Use the chat cards' tokens (`foundry/mockups/chat-cards-brief.md` section 3). Lucas asked for **the same shapes as the chat cards: small radii, no pills, no circles.**

**Fonts.** The Action name, the dice line and the Defense badges use Cinzel (the sheet's title font). Body text uses Signika. Don't load new fonts.

**Surface.**
- Window body: parchment `#f4ede0`, border `#bfae8c`, text `#2a241d`, muted text `#5d5446`.
- Title bar: dark `#2a241d` with light text.
- The "your roll" panel: a tinted box `#e8dec8`, 5px radius.
- Creature boxes inside it: `#fbf7ef` with a `#d6c8a8` border, 4px radius.

**Corner radii.**
- Trait chips, the Frequency chip and Defense badges: **3px**.
- Modifier chips, quick buttons, the AP segmented control and the other buttons: **4px**.
- Ladder: 2px.
- No `border-radius` above 6px anywhere in the dialog.

**Chips.**
- **Trait chips:** 20px tall, 0 7px padding, 11.5px semibold, a 1px border one shade darker than the fill. Trait Group colors:
  - Roll: `#d5ebe6` / `#1d5a53`, border `#a9cfc7`
  - Requires: `#dbe5f2` / `#24467a`, border `#b3c5df`
  - Kind: `#f4ddd5` / `#8a3324`, border `#e2b8aa`
  - Keywords: `#e5e0d6` / `#4a443b`, border `#cfc6b5`
- **Group dividers:** a 1px `#b8a988` line, the chips' height (20px), aligned with the chips, not with the group labels under them.
- **Frequency colors** (the cost chip): Round `#1d5a9e`, Encounter `#9b2226`, Turn `#1e6f68`, At-will `#3f7a3a`, white text (keep the system's colors if they differ).

**Tier colors** (as on the chat cards):
- Tier 1: `#f2cdc7` / `#8a1c13`; solid `#a8261c`.
- Tier 2: `#cfe3c2` / `#234d27`.
- Tier 3: `#2b5a2f` / white.
- Critical: `#1d5a9e` / white.

**Modifier chip colors.**
- Buff outline: `#9cbf8c`. Debuff outline: `#d9a39c`. Chip fill: `#fbf7ef`.
- Boon pip: an up-pointing triangle `#1d5a9e`. Bane pip: a down-pointing triangle `#a8261c`.
- Other buffs: a 13px square `#2b5a2f` with a white "+". Other debuffs: a 13px square `#a8261c` with a white "−".

**Movement and condition tags** in the Tier text (Bright light, Pushed 1, Prone, Hide, 2 Emanation): dashed rectangles, 3px radius, as on the chat card.

**Dividers.** The Flavor sits under a gold `#b07a12` ◆ ◆ ◆ with a thin `#cdb88a` line on **both sides**.

**Buttons.**
- Real `<button>`s.
- Primary (Roll): dark `#3b3128` with light text, **text centered**.
- Secondary: outlined `#8c7d63`.
- Touch targets at least 26px tall; the **i** rule buttons at least 28px wide.

---

## 4. The dialog, top to bottom

The order is fixed. Board C2 · One target is the reference; C2 · Area adds only section 4.8.

### 4.1 Window

- **Title bar:** "Roll · <Action name>" ("Roll · Smite"), with a close button.
- **Width:** about 560–600px.
- **Height:** grows with the content up to 90% of the viewport. Past that, the middle scrolls and the header (name, AP buttons) and the bottom bar (Roll) stay fixed.
- **Keys:** Enter rolls, Esc closes.

### 4.2 Header line: name and Versions

- **The Action's name** on the left, Cinzel, about 23px. **No category line** under it ("Divine Power 1 · Hallmark Action" is gone).
- **The Version buttons** on the right, as one segmented control: one button per Version, labeled by its cost ("1 AP", "2 AP", "3 AP"); the selected one is dark `#3b3128` with light text.
  - A Version the character can't afford: disabled, label struck through, with the reason on hover ("You have 2 AP left").
  - An Action with one Version: no segmented control (the Frequency chip shows the cost).
- **Switching Version** updates everything below: traits, meta line, Tier table and Modifiers. A used Version shows only its own values ("3 Burst", never "2 / 3 Burst").

### 4.3 Traits line

- **Traits by Trait Group**, with the dividers from section 3.
- **Under each group**, a small italic centered label with the group's name: *Roll*, *Requires*, *Kind*, *Keywords*. Use the system's Trait Group names; 10px, `#7a6f5f`.
- **The Frequency chip** ("Round · 2 AP", "Encounter · 3 AP") at the **right end of the same line**, under the AP buttons. On a narrow window it wraps below them.
- **No "uses left" text** ("Not used this round" and "1 use left this encounter" are gone). A spent Frequency disables Roll instead (section 4.10).

### 4.4 Meta line

**One line**, in the book's order (Ch. 1, Reading an Action), with the **"Targets:"** label (Lucas, 2026-11-07: "Targets: …" is current):

- One target: **Targets: One creature ✦ Weapon ✦ Vs. AD** (Smite reads "Weapon", not "Weapon (1 sq.)").
- An Area: **Targets: All enemies ✦ [◇ 3 Burst] ✦ Distance: 10 sq. ✦ Vs. WD**. "All enemies" is the mockup's placeholder; use the card's own Targets text. The "◇ 3 Burst" chip is the **Place Area** button: placing the area fills the creature list (section 4.8).
- The ✦ are gold `#b07a12`. Distances use "sq.".
- If the Action has them, keep the book's other lines in book order (Escalation before the Targets line; Requirements, Setup, Trigger / Interrupt after it), one compact line each.

### 4.5 The Tier table ("what it does")

The whole outcome of the selected Version. It is a two-column table: a colored label cell (52px), then the content.

- **Rows, in this order:**
  - **T1, T2, T3**, colored by Tier.
  - **Crit**, blue, only if the Action has a Critical row.
  - **Effects**, only if the Action has an Effects row. Its label cell reads "Effects" with a small "(T2+)" under it, or the Tiers it applies on per the card data. The text itself has **no Tier prefix** (not "T2, T3: the target…").
- **Each Tier cell:**
  - the pool icon (heart for Vigor, brain for Resolve), the dice and the subtype abbreviation ("1d8 **Sl** · 2d6 **Ho**")
  - riders as "↳ " plus dashed tags ("↳ Pushed 1")
  - **No "0" pool lines**: a pool with no damage is left out.
  - **Weapon damage always carries its subtype** (Sl / Bl / Pi).
- **Damage added by Passives** shows **in the Tier it applies to**, as a small green tag after the base dice: Radiant Zeal "+1d6 Ho" on T1, T2 and T3; Heavy Blows "+2" on the Vigor line of T3 only.
  - Green tag: `#e3eedb` fill, `#9cbf8c` border, `#234d27` text, 3px radius.
  - A tag disappears when its chip in Modifiers is switched off.
- **Empowered / Enfeebled:** under the table, one line in `#7a5400`, **only when the net is not 0**: "Empowered 1 on every damage die", or "Enfeebled 1 on every damage die (at least 1 each)".
- **Not shown:**
  - averages
  - odds (those go to the Designer mode footer, section 5)
  - "AD (Character): 11 + 0 (Unarmored) = 11"

### 4.6 The dice line

At the top of the "your roll" panel (`#e8dec8`), one line:

**2d12** **+ 1** *Signature, Flat* ▲1 ▼1

- **The dice text:**
  - **"2d12"** for a normal roll.
  - **"3d12, best Tier"** for Favored (Ch. 1 keeps the highest Tier possible, which can be a pair for Doubles, not just the two highest).
  - **"3d12, lowest 2"** for Doomed.
  - **"2d12 (Favored and Doomed cancel)"** when both apply.
  - Several targets: **"3d12"** if any target is Favored or Doomed, plus the note "· 3d12: a target is Favored or Doomed".
- **The Modifier:** the roll's Modifier (Weapon, Power, Signature or Attribute) plus the Flat row (section 4.7), shown as one signed number, with the source names muted after it.
- **The counts:** the number of active Boons (▲) and Banes (▼).
- **No Defense on this line.** The Defense lives in the creature's box.

### 4.7 The Modifiers panel

This is the part Lucas called the most sensitive: **it must be intuitive and easy to manage, and it must not grow too big.**

**Header.** A small uppercase label with a rule line: **"Modifiers"** for one target, **"Modifiers · every target"** for several. It is not called "Effects": that word belongs to the card's Effects row.

**Quick buttons**, one row, right under the header. Each is a small outlined button with its pip:

- One target: **Boon, Bane, Favored, Doomed, +1, −1, Empowered, Enfeebled**.
- Several targets: **Boon, Bane, +1, −1, Empowered, Enfeebled**. They apply to every target; Favored and Doomed are added per creature (section 4.8).

What a click adds:

| Button | Adds | Repeat clicks |
|---|---|---|
| Boon / Bane | a chip "Situational" | "Situational ×2", "×3"… |
| +1 / −1 | a Flat chip "Situational +1" / "Situational −1" | "+2", "−2"… |
| Empowered / Enfeebled | a chip "Empowered 1" / "Enfeebled 1" | raises the value: "Empowered 2" |
| Favored / Doomed | a chip "Favored" / "Doomed" | once only |

The × on a manual chip removes one step.

**Rows**, in this order. A row is hidden when it has nothing. Each row has a 68px label column, then its chips.

| Row | What goes in it |
|---|---|
| **Passives** | Features and Talents that change this Action: Radiant Zeal, Heavy Blows, and later Searing Blows, Reckoning… |
| **Boons** | Every Boon that isn't a Passive, plus Favored |
| **Banes** | Every Bane that isn't a Passive, plus Doomed and Nonlethal |
| **Flat** | Flat bonuses and penalties: Exhausted N as "Exhausted N −N" (Ch. 8: a penalty equal to the value on all rolls), Situational ±N |
| **Damage** | Empowered N, Enfeebled N |

"Flat" is my name for the row; Lucas didn't object. Use it unless the system already has a term.

**Which scope each source belongs to.**
- **Shared** (the panel): what is about **you** or applies to every target. Frightened, Exhausted, Imperiled, Nonlethal, the Passives, Empowered and Enfeebled.
- **The creature's box** (one target too): what is about **that target**. Flanking, Cover, range, Prone, Vulnerable, Taunted, Hidden / Obscured, Ranged-while-Engaged against a target Engaged with someone else.

**Chip anatomy** (one chip = one source):

[pip] **Label** | × | i

- **The body** (pip + label) is a toggle button: on ↔ off.
  - Auto-detected chips toggle too (Flanking, Cover, Frightened…).
  - `aria-pressed`.
- **×** appears **only on chips the user added**; it removes one step.
- **i** opens the rule. It links to the book page in Foundry (a Journal page / anchor, e.g. "Flanking (Ch. 3)"). If the link can't resolve, hide the **i**.
- **Hover** on the chip shows a one-line summary ("Jared flanks it with you: 1 Boon on [Melee] Actions"; "+2 damage on a Tier 3 with a Two-handed weapon").
- **The label is the name only.** No description on the chip.
- Size: 26–28px tall, 4px radius, 1px outline.

**Chip states.**

| State | Look |
|---|---|
| **On** | `#fbf7ef` fill, 1px outline: green `#9cbf8c` for buffs (Passives, Boons, Favored, Empowered, +N), red `#d9a39c` for debuffs (Banes, Doomed, Enfeebled, −N, Nonlethal); full-color pip |
| **Off** | transparent, dashed `#bfae8c` outline, label struck through, muted text, faded pip |
| **Can't apply (n/a)** | dashed lighter outline, faded, **not clickable**; the hover gives the reason ("Not this time: Word of Radiance is not a Strike"; "Not this time: an Area ignores Senses") |

**Folding (to keep the panel small).**
- Each row shows only the chips that are **on**, plus any chip the **user switched off** during this dialog. Those stay visible, struck through, until the dialog closes, so they can be turned back on.
- Chips that **start off** (Nonlethal, for example) fold into one small dashed button at the row's end: **"+N off"**. Clicking it shows them in place; it then reads "hide off".
- Chips that **can't apply** fold into a separate dotted button: **"N n/a"** / "hide n/a".
- There is no legend line under the panel (Lucas removed it). The chips must be self-explaining through hover.

**The math.**
- Boons and Banes: count every active one (they don't cancel, Ch. 1); each adds or subtracts 1d3−1.
- Favored and Doomed: either one makes it 3d12; both together are a normal roll.
- Empowered and Enfeebled: the **highest** active value of each, then Empowered − Enfeebled, applied to every damage die. Enfeebled leaves each die at least 1.
- Flat: the sum of the +N and −N chips, added to the roll's Modifier on the dice line.

### 4.8 The creature boxes

**One target:**
- A box with the creature's name and its **Defense badge** ("AD 11"; Cinzel, 1.5px border, 3px radius), on the same line.
- **No retarget button in the dialog.** The dialog listens to Foundry's targeting (the `targetToken` hook) and updates the creature list live.
- Under the name: that creature's own rows (Boons, Banes), built like the panel's rows.
- At the bottom: **the ladder** (below).

**Several targets** (an Area, or "all creatures"):
- Each creature is **one line**, collapsed by default: chevron ▸, name (plus "Large" etc. if useful), dice label, its Modifier, ▲n ▼n, Defense badge.
  - **Dice label:** "first 2 d12" when other targets use 3d12; "3d12, best Tier"; "3d12, lowest 2"; "2d12, they cancel".
  - **Modifier:** the roll Modifier + shared Flat + its own Flat ("+3").
  - **▲n ▼n:** shared + its own.
- **Clicking the line expands it** (chevron ▾) to show its rows, an **"Add here:"** row with small dashed buttons (Boon, Bane, Favored, Doomed: per-creature manual chips), and its ladder.
- Removing a target: keep today's right-click (v0.0.217); a × on the line is fine too.

**The ladder**, one per creature:
- A strip of 3 segments, or 4 when the Action has a Critical row. Text centered, labels written out:
  - 3 segments: **Tier 1 · ≤10 | Tier 2 · 11–17 | Tier 3 · 18+**
  - 4 segments: **Tier 1 · ≤12 | Tier 2 · 13–19 | Tier 3 · 20–32 | Crit · 33+**. The Crit segment is narrower (3fr 3fr 3fr 2fr) and blue.
  - The ranges are **totals** against that creature's Defense: Tier 2 from the DC, Tier 3 from DC + 7, Crit from DC + 20.
- **Hover on the ladder:** "Doubles raise one Tier; Doubles on a Tier 3 are a Critical. A Doomed roll has no Doubles."
- 1px `#bfae8c` frame, thin dividers, 2px radius.

### 4.9 Flavor

At the bottom of the body: the ◆ ◆ ◆ divider with lines on both sides, then the Flavor in italic, centered, muted. This matches the chat card, which puts the Flavor last.

### 4.10 Bottom bar

Fixed at the bottom, left to right:

1. **A roll mode selector**: Public roll, Private GM roll, Blind GM roll, Self roll. It applies to **this roll only** and defaults to the chat's current roll mode. If Foundry makes a per-roll mode awkward, drop the selector and report it.
2. **"Card"** (secondary): opens the Action's full card as it is in the book or the sheet.
3. **"Roll"** (primary): fills the rest of the bar, text centered.

**Blocked states.** Roll is disabled, and a short reason shows next to it, when:
- the selected Version costs more AP than the character has (that Version's button is already disabled, so this only happens if AP drop while the dialog is open)
- the Frequency is spent (Round, Encounter…)
- there is no target (or no area placed)
- a target is out of range or has no Line of Effect

---

## 5. Settings (from the chat cards pack; reuse them)

1. **Designer mode** (client setting). When on, a dashed `#8c7d63` footer appears above the bottom bar with:
   - each creature's odds, "T1 17% · T2 45% · T3 31% · Crit 6%"
   - the **"force a Tier"** control, which replaces today's "For testing: click a Tier in the preview".
   
   When it's off, none of this appears.
2. **"Hide enemy Defenses from players"** (world setting). When on, for players (the GM always sees everything):
   - The Defense badges read only **"AD"** / **"WD"**, with no number.
   - **No ladder at all** (without numbers it says nothing).
   - A footer under the bottom bar: "Player view · enemy Defenses hidden by the GM".
   - The Tier table, the Modifiers, the Boon and Bane counts and the 3d12 note **stay visible**.

---

## 6. Removed from the dialog

- The DC field and the Modifier field.
- The full card preview, the averages, "AD (Character): … = 11" (twice), and the odds line. The odds move to Designer mode.
- The ROLL row (Favored / Doomed toggles, Boons / Banes counters), the BONUS row and the DAMAGE row. All of them are now Modifier chips.
- The testing note. "Force a Tier" moves to Designer mode.
- The category line, the uses-left text and the in-dialog retarget button.

---

## 7. What the roll must hand to the chat card

The chat breakdown (`chat-cards-brief.md` 4.4) prints a **name per Boon and Bane** ("Boon · Flanking", "Bane · Frightened"). The dialog now has those names, so pass them through in the message flags:

- **Per creature:** its Defense, its Boons and Banes (name and source scope), Favored or Doomed (with the source name), its Flat modifiers (name and value), and which kept dice it uses.
- **Shared:** the active Passives (name and what they add), the Empowered and Enfeebled values and the net, Lethal / Nonlethal, the roll mode.
- **Manual chips** are named "Situational".

Chips that were off or n/a are **not** sent. If the chat card already reads some of this from somewhere else, make the dialog the one source, and report what you changed.

---

## 8. Rules the dialog must respect (check each; fix any mismatch)

- **Several Targets (Ch. 1).** One roll after the targets are chosen (after the area is placed). Each creature has its own DC, Boons, Banes, Favored, Doomed, Tier, Doubles and Critical. If any target is Favored or Doomed, roll 3d12; a target without it uses the first two d12 rolled. Damage is rolled once per Tier.
- **Favored (Ch. 1)** keeps the highest Tier possible: the two highest, or a lower pair if Doubles give a higher Tier. **Doomed** keeps the two lowest and **can't produce Doubles**. Both together = a normal roll.
- **Doubles** raise one Tier. A Tier 2 raised to Tier 3 is not a Critical. Doubles on a Tier 3 are a Critical, and so is a total of DC + 20 or more. A Critical matters only for Actions with a Critical row (otherwise it is a Tier 3).
- **Boons and Banes** don't cancel; roll them all.
- **Exhausted N (Ch. 8):** a flat penalty of N on all rolls (the Flat row), not a Bane.
- **Frightened (Ch. 8):** 1 Bane on all your rolls, only while you perceive the source with Sight.
- **Empowered / Enfeebled (Ch. 8):** the highest value of each, then net; +N or −N on every damage die; Enfeebled leaves each die at least 1; flat damage doesn't change.
- **Flanking (Ch. 3):** 1 Boon per other flanker on **[Melee]** Actions, up to 3.
- **Cover (Ch. 3):** Low, Medium and High = 1, 2 and 3 Banes, the highest only; a creature in the way = Low. For an Area, Cover and Line of Effect are checked **from the Point of Origin**.
- **Areas ignore Senses (Ch. 7, Area).** Hidden and Obscured give no Doomed or Bane to an Area roll: show them as **n/a** with that reason.
- **Range (Ch. 3):** far 1 Bane, maximum 2 Banes. **Ranged while Engaged:** 2 Banes; against a creature Engaged with someone else, 1 Bane.
- **Nonlethal (Ch. 4):** switching a Lethal Action to Nonlethal costs 1 Bane. On an Action with the Nonlethal trait the chip reads **"Lethal"** and costs the Bane the other way, if Ch. 4 says so; check, and report.
- **Heavy Blows (Talents):** +2 damage on the Tier 3 of [Melee, Strike, Weapon] Actions with a Two-handed weapon. Otherwise n/a, with the reason.
- **Radiant Zeal:** use the card's current text (the first Strike each round that deals damage, at its Escalation rung). Not a Strike → n/a "not a Strike"; already used this round → off, with "already used this round" on hover.

---

## 9. Book fix and open questions

**Book fix (the only rules-src edit).** Lucas confirmed that **"Targets: …"** is the current label on card target lines. Ch. 1's "Reading an Action" Weapon Attack example still reads "**One creature ✦ Weapon ✦ Vs. AD**". Change it to "**Targets: One creature ✦ Weapon ✦ Vs. AD**", and check the meta-line list above it reads the same way. Report any other card or example without the label.

**Assume these defaults and list them in the report:**

- Word of Radiance's Targets text: use the card's own.
- "Flat" is the row name, unless the system already has a term.
- The roll mode selector defaults to the chat's current mode and applies to this roll only.
- What "Card" opens (the item sheet, or a card preview): your call; say which.
- Which sources you could detect automatically and which stay manual (the table from section 2).

---

## 10. Accessibility

- Every clickable thing is a real `<button>`: Version buttons, quick buttons, chip bodies, ×, i, "+N off", "N n/a", creature lines and Roll.
  - `aria-pressed` on toggles.
  - `aria-expanded` on "+N off", "N n/a" and the creature lines.
  - An `aria-label` where there is no text: "Open the rule: Flanking (Ch. 3)", "Remove Situational", "Remove Bandit Thug".
- Disabled controls say why (`title` / tooltip).
- Decorative pips and dividers get `aria-hidden="true"`.
- **Never color alone:**
  - Boon ▲ vs Bane ▼ are told apart by the triangle's direction.
  - Other buffs and debuffs by "+" vs "−".
  - Off chips by the strike-through and the dashed border.
  - Tiers by their written labels.
- Text contrast at least 4.5:1 (check `#7a6f5f` on `#f4ede0`, and any new shade).
- Keyboard: Tab order follows the visual order; Enter rolls; Esc closes.

---

## 11. Tests (`node tools/tests/run.mjs`; numbers have gaps, so check before adding)

Test the logic, not the CSS:

- **Per-target math:** Defense, Boons, Banes and Flat per creature; the shared ones add to every creature; the per-creature dice label (first 2 / best Tier / lowest 2 / cancel).
- **3d12 trigger:** any target Favored or Doomed → 3d12; Favored + Doomed on one target → a normal roll for it.
- **Empowered / Enfeebled:** the highest of each, then net; manual "Empowered 2" with an auto "Empowered 1" → 2; net 0 shows no line.
- **Flat:** Exhausted 1 + Situational +1 → 0; the dice line Modifier = roll Modifier + Flat.
- **Chip states:** auto chips toggle; a chip switched off stays visible; chips that start off fold into "+N off"; n/a chips fold into "N n/a" and can't be toggled.
- **n/a rules:** Hidden on an Area → n/a; Radiant Zeal on a non-Strike → n/a; Heavy Blows without a Two-handed weapon → n/a; Flanking on a non-[Melee] Action → n/a (or absent).
- **Tier tags:** switching off Radiant Zeal removes its "+1d6 Ho" tags; Heavy Blows only on T3.
- **Ladder:** the ranges for DC 11 (≤10 / 11–17 / 18+); for DC 13 with a Critical row (≤12 / 13–19 / 20–32 / 33+); no ladder for players with "Hide enemy Defenses" on.
- **Versions:** an unaffordable Version is disabled; switching Version updates the Tier table and the meta line.
- **Blocked Roll:** no target, Frequency spent, out of range.
- **Flags to chat:** the named sources reach the message flags; off and n/a chips are not sent.

Run the lint as CLAUDE.md says.

---

## 12. Deliverables and the report

1. The code, the new CSS block and the tests on the `pack-` branch. Commit with a clear message; no zips, no node_modules.
2. Bump `version` in `system.json` and add the changelog entry to `docs/reference.md` (copy to `foundry/reference.md`).
3. **A short test checklist for Lucas for this version**, based on what was added, changed and removed: one line per thing to click in Foundry. Cover:
   - Smite at 1, 2 and 3 AP (with only 2 AP left: 3 AP disabled)
   - one target with Flanking and Frightened auto-detected; switching each off and on
   - the quick buttons, repeat clicks and ×
   - Exhausted on the Flat row and the dice line's Modifier
   - Empowered + Enfeebled netting, and the line under the Tier table
   - Nonlethal from "+1 off"
   - Word of Radiance on three creatures: placing the area, expanding a creature, Favored on one and Doomed on another, Cover from the Point of Origin, Hidden shown as n/a
   - Radiant Zeal as n/a on a non-Strike
   - a ladder with and without a Critical row
   - "Hide enemy Defenses" on (player view) and Designer mode on (odds, force a Tier)
   - the roll mode selector
   - the blocked Roll states
   - that the chat card's breakdown shows the dialog's source names
4. Update `foundry/foundry-backlog.md` (what changed, known gaps: Checks / Saves dialogs, Linked Actions), `HANDOFF.md` and `MASTER-PLAN.md`.
5. The final report:
   - the files changed
   - the detected-sources table
   - **what could not be tried** (you can't run Foundry), plus any diagnostic
   - **Assumptions I made**
   - the answers to section 9
6. Run `python tools/knowledge.py` and tell Lucas to re-upload `knowledge/` to the Project (skip it in a cloud session).

---

## 13. Example values from the mockup (for tests and the checklist)

**Smite, 2 AP** (Round · 2 AP; Signature, Weapon | Melee | Strike | Divine; Targets: One creature ✦ Weapon ✦ Vs. AD).

- The character: Signature Modifier +2, Greatsword, 2 AP left, so 3 AP is disabled.
- **Tier table:**
  - T1: 🧠 1d6 Ho [+1d6 Ho]
  - T2: ♥ 1d8 Sl · 🧠 2d6 Ho [+1d6 Ho]
  - T3: ♥ 2d6 Sl [+2] · 🧠 2d10 Ho [+1d6 Ho]
  - Effects (T2+): "The target sheds Bright light in a 2 Emanation and takes 1 Bane when they try to Hide, for 1 round."
  - No Crit row.
- **Shared Modifiers:**
  - Passives: Radiant Zeal, Heavy Blows (both on)
  - Banes: Frightened (auto, "of the Ogre"), "+1 off" holding Nonlethal
  - Flat: Exhausted 1 −1 (auto)
  - Damage: Empowered 1, Enfeebled 1 (net 0, so no line under the table)
- **Bandit Thug** (AD 11): Boons: Flanking (auto, "with Jared"). Ladder: Tier 1 · ≤10 | Tier 2 · 11–17 | Tier 3 · 18+.
- **Dice line:** "2d12 + 1 Signature, Flat ▲1 ▼1".
- **Designer odds** (2d12 + 2, 1 Boon, 1 Bane vs 11, without Exhausted): T1 17% · T2 45% · T3 31% · Crit 6%.
- Flavor: "Your weapon blazes with holy light."

**Word of Radiance, 3 AP** (Encounter · 3 AP; Power | Area | Divine; Targets: All enemies ✦ 3 Burst ✦ Distance: 10 sq. ✦ Vs. WD; Power Modifier +2).

- **Tier table:**
  - T1: 🧠 2d6 Ho
  - T2: 🧠 2d10 Ho ↳ Pushed 1
  - T3: 🧠 3d8 Ho ↳ Pushed 2
  - Crit: "The target is also Prone."
- **Shared Modifiers:**
  - Passives: "1 n/a" (Radiant Zeal: not a Strike)
  - Banes: Frightened, "+1 off" (Nonlethal)
- **Creatures** (dice line "3d12 + 2 Power · 3d12: a target is Favored or Doomed"):
  - **Bandit Thug** (WD 13): "first 2 d12 +2 ▲0 ▼1".
  - **Grave Wisp** (WD 13): Boons: Vulnerable 1 (auto); add Favored by hand → "3d12, best Tier +2 ▲1 ▼1".
  - **Ogre Chieftain** (Large, WD 14): Banes: Cover (Low) (auto, from the Point of Origin), "1 n/a" (Hidden: an Area ignores Senses); add Doomed by hand → "3d12, lowest 2 +2 ▲0 ▼2". Ladder: Tier 1 · ≤13 | Tier 2 · 14–20 | Tier 3 · 21–33 | Crit · 34+.
- **Designer odds** (with the shared Frightened Bane):
  - Thug: 35 · 42 · 19 · 4%
  - Wisp (Favored, Vulnerable 1): 8 · 43 · 39 · 11%
  - Ogre (Doomed, Cover): 77 · 21 · 2 · 0%
- Flavor: "You speak a word, and light pours from your hands across everything that stands against you."

**Player view, "Hide enemy Defenses" on:** the Smite example with the badge reading "AD", no ladder, and the footer "Player view · enemy Defenses hidden by the GM".
