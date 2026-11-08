# Pack: Chat Cards redesign (attack roll, Save, damage message)

You are working in the 2d12 repo. Read `CLAUDE.md`, then `HANDOFF.md`, then `MASTER-PLAN.md`, as usual. This is **one pack**: run it start to finish on a branch whose name starts with `pack-` (suggested: `pack-chat-cards`). Don't stop for minor questions: choose, and list every choice under **"Assumptions I made"** in the final report. Ask only if something is truly blocked (one batch, at the end).

The design was settled with Lucas in the claude.ai design Project on 2026-11-07. The final mockup is the canvas **"2d12 Chat Cards: final design"** (https://claude.ai/artifact/QtsUAZ61DTzVUE1wPRS5mS), with five boards: Attack · one target, Attack · several targets, Save, Damage · one target, Damage · several targets. **You probably can't open that link; this prompt is the full spec.** Where they differ, this prompt wins.

First step: save this whole prompt as `foundry/mockups/chat-cards-brief.md`, then add a one-line pointer to it in `foundry/foundry-backlog.md` and `MASTER-PLAN.md`.

---

## 1. Goal and scope

Replace the look and behavior of three chat messages in `foundry/twod12`:

1. **The Action roll card** for attacks (an Action that rolls vs a Defense), with one target or several.
2. **The Save card**: a Save Action, where the target rolls (for example Rebuke's Appeal Save).
3. **The damage message**: the card made by "Damage" / "Roll Damage".

The cards were too tall, put every Tier at the same weight, showed designer data to players, and had several rules mismatches (section 6). The new design puts the result first: a Tier stamp and a Tier ladder, only the result Tier's outcome, everything else one click away.

**Out of scope:** Linked Actions (Double Shot, Charge) and Area Saves (one Save row per creature) get no new layout yet. Keep them working as they do today, restyled with the new tokens where it's free. Note them as known gaps. Don't change the roll dialog, except for the Lethal/Nonlethal item in section 7.

**No rule changes.** The book (`book/rules-src/`) is the source of truth. Don't edit rules-src in this pack, except to log open questions in `rules-backlog.md`.

---

## 2. Before you write code

- Find the current implementations. Search `module/` for the chat card renderers and templates: the Action roll card (with the Tier rows, "Odds: T1…", the "Ruler:" footer and the "Roll Damage" button), the Save card, and the damage card (with "Avg …", "this total or more", and the Damage / Half / Double / Block buttons). Also find `damage.mjs` (Guard), `sysmsg.mjs` (sysCard / sysLine), and the retarget and "Place Area" buttons (HANDOFF v0.0.249 and v0.0.256).
- Write down in the report which files you changed and why.
- Keep the data model and the flags the cards already store. Prefer changing templates, CSS and the render functions over the roll and damage logic, except where section 6 requires a logic fix.
- CSS: add **one new version-tagged block** for the chat cards. Don't regroup older CSS (CLAUDE.md gotcha). Card colors come from CSS variables (section 3); reuse existing variables when they already hold the same value.

---

## 3. Design tokens

**Fonts.** Titles, the stamp numerals, the total and the Defense badge use the sheet's title font (Cinzel). Body text uses Foundry's sans (Signika). Don't load new fonts.

**Card surface.**
- Card background `#f4ede0`, border `1px #bfae8c`, radius 5px.
- Text `#2a241d`; muted text `#5d5446` (passes 4.5:1 on the card).
- Card width: whatever the chat column gives (about 300–340 px); everything must fit without horizontal scroll.

**Frequency colors** (the cost chip in the header): Round `#1d5a9e`, Encounter `#9b2226`, Turn `#1e6f68`, At-will `#3f7a3a` (keep any Frequency colors the system already defines if they differ; list them).

**Tier colors** (one color language on every card):

| Tier | Solid (stamp, the result row, pills) | Segment / unhit row |
|---|---|---|
| Tier 1 | `#a8261c`, white text | `#f2cdc7`, text `#8a1c13` |
| Tier 2 | `#cfe3c2`, text `#234d27` | `#cfe3c2`, text `#234d27` |
| Tier 3 | `#2b5a2f`, white text | `#2b5a2f`, white text |
| Critical | `#1d5a9e`, white text | pale `rgba(29,90,158,.35)`, text `#1d3f6b` |

The Tiers also differ in lightness, so they work for color-blind players. **The Critical is blue, never gold, and has no outline or ring.**

**Pools and subtypes.**
- Vigor uses the heart icon, `#9b2c2c`. Resolve uses the brain icon, `#2c4a9b`.
- Subtype codes are in their color: Slash, Blunt and Pierce `#4a443b`; Fire `#a0521a`; Holy `#7d5400`; Cold `#2c6f8f`. Other subtypes: reuse the system's subtype colors, or the neutral `#4a443b`.

**Modifier colors:**
- In breakdowns and target rows, a plus value is blue `#1d4f8f` and a minus value is red `#a8261c`.
- A Boon d3 is a blue triangle `#1d5a9e` with white text; a Bane d3 is a red triangle `#a8261c`.

**Trait chips** (by Trait Group, with a thin 1px `#b8a988` divider between groups, decision 1C):

| Group | Background | Text |
|---|---|---|
| Roll | `#d5ebe6` | `#1d5a53` |
| Requires | `#dbe5f2` | `#24467a` |
| Kind | `#f4ddd5` | `#8a3324` |
| Keywords | `#e5e0d6` | `#4a443b` |

**Dice:**
- A d12 face is a diamond: an 18 px square rotated 45°, a 1.3px `#2a241d` border, a white fill, and an 11px bold number.
- **An exploded 12** has a dark fill `#2a241d` with a light number, and sits next to its rerolls in one group.
- **No background behind the dice.**
- **A Doubles pair** gets a thin colored frame only: `1.5px` green `#2b5a2f` when it raises a Tier, blue `#1d5a9e` when it makes a Critical.

**Dividers.** Gold `#b07a12` line-and-diamond dividers, like today's ✦✦✦: a thin line `#cdb88a`, small diamonds in the middle. One diamond goes above the effect text and above the Trigger line; three diamonds go above the Flavor line.

**Buttons.** Real `<button>`s. Primary: dark `#3b3128` with light text. Secondary: outlined `#8c7d63`. Icon-only buttons (retarget) get an `aria-label` and a `title`. Touch targets are at least 26px tall in chat.

---

## 4. Components

### 4.1 Header (attack and Save cards)

The order, top to bottom:

1. **Name + "Frequency · cost" chip.**
   - The name is in the title font. The chip is in the Frequency color: "Round · 2 AP", "Encounter · 3 AP", "Turn · 1R".
   - This line never wraps (`white-space: nowrap`), so a long name like Word of Radiance must fit.
2. **Trait chips**, by group, with dividers.
3. **The target line:** `Targets ✦ Distance → target`, with the retarget button at the right.
   - One target: "One creature ✦ Weapon → Bandit Thug"; "The triggering creature ✦ 5 sq. → Ogre Chieftain". A distance in squares always has "sq.".
   - **Area Actions:** a button with the area's footprint icon and size (for example "3 Burst"; clicking it places the area again, the existing Place Area flow), then "✦ 10 sq. → 3 targets". A used Version shows **only its own value** ("3 Burst", never "2 / 3 Burst").
   - The ✦ is gold `#b07a12`. The text may wrap, but the retarget button stays at the right (grid: text `1fr`, button `auto`).

### 4.2 The retarget button

A crosshair icon button. It replaces the card's targets with the user's current Foundry targets.
- **It keeps the dice** and checks each target's Tier again against its own Defense, Boons, Banes, Favored and Doomed. Placing the area again does the same.
- Only the card's author and the GM see it.
- It is locked (hidden) once any damage from the card has been applied.

### 4.3 The attack card body

**Layout:** a Tier stamp on the left (60px column), the content on the right.

**The Tier stamp:**
- Fills the card's height. Its background is the result Tier's solid color.
- It shows a small "TIER" label, the Tier numeral (32px, title font) and a small line under it ("vs AD 11").
- On a Doubles raise, the small line reads "Doubles ↑".
- On a Critical, the label reads "CRIT", the background is Critical blue, and the small line reads "Critical". No ring.

**The Tier ladder (a button):**
- Three equal segments in the segment colors, labeled with their ranges as totals: "≤10 · 11–17 · 18+" for DC 11 (Tier 1 = below DC, Tier 2 = DC to DC+6, Tier 3 = DC+7 and up).
- The result segment is at full opacity with bold text; the other two are at 45%.
- **An arrow with the total** sits above the bar. Its position runs over a 21-step scale from DC−7 to DC+13: `left = (total − (DC − 7) + 0.5) / 21 × 100%`, clamped to 4%–95%.
- **On a Tier 3**, the last 30% of the Tier 3 segment is a "CRIT" zone: pale blue until a Critical, solid blue when it is one.
- **Doubles raise:** a **faded** arrow (opacity .35) on the real total, in its own Tier, and a **solid "↑" arrow** in the middle of the raised Tier's segment, which is lit. The segment labels stay plain ranges.
- **The whole ladder is the button** that opens and closes the roll breakdown (`aria-expanded`). There is no separate chevron, and nothing written over the bar.

**The outcome (only the result Tier):**
- **One line per pool**: the pool icon, the dice, the subtype ("♥ 1d8 Sl · 🧠 2d6 + 1d6 Ho"). Extra dice of the same pool join with "+", with no second icon.
  - Sources (Radiant Zeal, Heavy Blows) appear only in the breakdown.
  - A pool with 0 damage is left out (Smite's Tier 1 shows only "🧠 1d6 + 1d6 Ho").
  - **Weapon damage shows its subtype** (Sl), not only the weapon's name. Resist and Weak read the subtype.
  - Flat bonuses that change a line are on that line ("2d6 + 2 Sl" with Heavy Blows on a Tier 3).
- **Riders**: each on its own line under the damage they ride on, marked "↳" (for example "↳ Pushed 2"). Movement and conditions are small outlined chips.
- **The effect text**: in full, under the one-diamond divider, with **no "Effects:" label**. Shown only on the Tiers it applies to (Tier 2+ for "Effects (Tier 2+)"). Don't write "No Effects on a Tier 1".
- **The Critical row**: only for Actions that have one, and only on a Tier 3.
  - Not a Critical: a muted line in dark blue, "**Critical** (Doubles, or 33+): the target is Prone." The threshold is DC + 20.
  - A Critical: a pale-blue box with a blue border, "**Critical:** the target is Prone."
- **The Flavor line**: italic and muted, under the three-diamond divider.
- **Buttons**: "Damage" (primary) and "Card" (secondary; opens the full Action card as a pop-out).

**Removed from the attack card:** the odds after the roll, the Ruler footer, the Mithril mark, the source footnote ("✦ Smite (Bright light 2)"), and the full table of every Tier at full weight. The odds, the Ruler line and the Mithril mark move behind **Designer mode** (section 5).

### 4.4 The roll breakdown (opens under the ladder)

A tinted panel (`#e8dec8`, radius 4px) in a two-column grid (a 62px label column with small uppercase muted labels).

1. **2d12**: the dice as rolled.
   - An explosion chain is grouped: two dark 12s, then the reroll, with a muted "11 + 11 + 7 · 5" after the dice.
   - A Doubles pair has its frame, followed by a tag: green "**Doubles · +1 Tier**" or blue "**Doubles · Critical**" (white text on solid color).
2. **Boon · Bane**: **one line per die**: the d3 triangle with the face rolled, the value (+2 blue, −1 red, −0 allowed), then "Boon · Flanking" or "Bane · Frightened". Leave the row out when there are none.
3. **Modifiers**, in order, plus in blue and minus in red, each with its source: "+2 Signature", "−1 Situational".
4. **Total**: one row spanning the whole panel, with **one** border line above it. The label and the value must not draw separate half-lines at different heights.
   - The total is 18px in the title font, then a small "vs", then the Defense or DC in a **framed badge** ("AD 11", "WD 13", "DC 13"; 1.5px dark border, radius 4px).
   - Then the result as **chips** at the right:
     - A Tier pill in its solid color ("Tier 2").
     - **Doubles raise:** "Tier 2 → Tier 3 · Doubles". Don't write "not a Critical".
     - **Critical by Doubles:** "Tier 3 → Critical · Doubles" (a blue pill).
     - **Critical by total:** "Tier 3 → Critical · 33+".
     - **Save:** "Their Tier 1".
- Hovering a die group or a Boon/Bane line shows its source, but **the same sources are in the Card pop-out**: never hover-only.

### 4.5 Several targets (one roll)

- **One shared roll.** A row under the target line shows the 2d12, or **3d12** when any target has Favored or Doomed, and the Modifier.
- **One line per creature:**
  - A small Tier pill (22px, its solid color, the numeral) on the left.
  - The name, then its Defense at the right ("WD 13"; plus "· 1 Bane" or "· Favored" / "· Doomed").
  - A thin ladder (labels 10px, 2px padding) **filling the full width**. It is a button that opens that creature's own breakdown in place.
- **Favored / Doomed (Ch. 1):** each creature keeps its own two dice. A muted line under its ladder says which:
  - "Normal: the first two, 9 · 7".
  - "Favored: keeps 7 · 7 for Doubles, Tier 2 ↑ Tier 3" (the Favored creature may keep a pair if that is better).
  - "Doomed: the two lowest, 7 · 7, no Doubles" (a Doomed roll never has Doubles).
- **The outcome, grouped by Tier**: a "Tier 3" pill and the names of who got it, then that Tier's damage line, then its riders. The muted Critical row sits under the Tier 3 group only.
- Damage is rolled **once per Tier** (section 4.7).

### 4.6 The Save card (a Save Action: the target rolls)

- **Header** as in 4.1. Under it, a line: "**Appeal Save**" in the title font (14px), a thin rule that fills the space, then a framed "**DC 13**" badge. The DC is 11 + the user's Modifier (Ch. 1). No beige bar, and no "Ogre Chieftain rolls" (the target is already named).
- **All three Tiers are always visible**, as rows, with **Tier 3 on top**. A Save is something done to you, so every outcome must be readable.
  - Each row has a left cell (50px): "T3" and its range ("20+", "13–19", "≤12"). The rows use the Tier colors: Tier 1 red family, Tier 2 pale green, **Tier 3 solid dark green even unhit** (so Tier 2 and 3 never look alike).
  - The right side holds the full outcome: the damage line, then its riders under "↳"; "No effect." for Tier 3 when there is none.
- **Before the roll:** no row is highlighted.
  - **Only the saving creature's owner** sees the "Roll Appeal Save" button (the GM for an NPC, the player for their PC).
  - Everyone else sees a muted "Waiting for Ogre Chieftain's Appeal Save…".
- **After the roll:** the result row turns solid with a 2px dark frame, and its total (**18px**, title font, a dark pill, just the number) sits at the right. The other rows fade to 60% but stay readable.
  - **The result row is the button** that opens the Save breakdown (same panel as 4.4: dice, "Bane · Vulnerable 1", "+1 Appeal", Total "8 vs DC 13", then "Their Tier 1").
  - "Damage" appears at the bottom, the same place as on attack cards.
- **Reactions and Interrupts:** the card's **Trigger** (or Interrupt) text sits right **under the Tier rows**, under a one-diamond divider, in plain text ("**Trigger:** An enemy within 5 squares makes a [Strike] Action against an ally."). No background, and no "(X → Y)" context.
- Then the three-diamond divider and the Flavor.

### 4.7 The damage message

- **Layout:** a stamp on the left, the content on the right.
  - The stamp is a **button that opens or scrolls to its roll card**. It shows "DAMAGE", the total (30px, title font) and "Tier 3 ↗", in that Tier's solid color.
- **Header line:** the Action's name, a muted "Damage", and a tag at the right: "Lethal" or "**Nonlethal**". The tag is information only (section 7).
- **Pool lines** (a tinted block, the button that opens the breakdown): one line per pool, with its subtypes inline and the pool's total at the right.
  - "♥ Vigor · 6 Sl + 4 Fi" → 10; "🧠 Resolve · 10 Ho" → 10.
  - The same subtype from several sources is **one number** here (Smite's Holy + Radiant Zeal's Holy = "10 Ho"), because Resist and Weak apply **once per subtype per Action** (Ch. 1).
- **The breakdown as a list, one block per instance (per source):**
  - A title: the pool icon, "Vigor · **Slash** (Greatsword)", with the subtype name in its color.
  - Then rows: **Dice** (the dice as rolled), **Modifiers** in order ("+1 Empowered", "+2 Maul", "+2 Weapon"; plus blue, minus red), **Total**.
  - **The Weapon Modifier is a line here, never a chip above.** Today's card shows Slash 9 + Heavy Blows 2 next to a Vigor of 13, because the +2 Mod is hidden.
- **Several targets:** one group per Tier: a "Tier 3" pill, the pool icon, the dice ("3d8 Ho") and that Tier's total at the right.
  - **The rider is written once, under the group** ("↳ Pushed 2"), not under each creature.
  - Then the creature rows of that Tier.
- **Target rows** (one per creature):
  - **Before Apply:** the name, then **only what changes the damage for that creature**, colored like Modifiers ("+2 Weak Holy", "−5 Resist Fire", "−8 Guard", "Immunity Holy"), then **Apply**. Don't repeat the damage; it is on the pool or Tier line. A creature with nothing special shows only its name and Apply.
  - **After Apply:** "Took ♥ 5 · 🧠 3" (or "Took **No damage**"), the new state chip (**Bloodied** solid red, **Strained** solid blue), and "✓ Undo".
  - The adjust row (Full · Half · Double) shows on the applied row or on demand: three equal buttons that fill the width, 26px tall. **There is no "None".** It replaces today's Damage / Half / Double / Block.
- **Choices during Apply (Ch. 4 Guard, Ch. 1 Resist):**
  - **Guard** takes damage first. When the damage has both pools, the **creature taking the damage chooses** which pool the Guard takes from (prompt the target's owner on Apply).
  - **Resist on damage split across both pools:** the resisting creature chooses which part it reduces first.
  - The card shows no note about these choices; the "Took" line reports the outcome.
- **Apply all:** applies every row with no choice to make, **skips rows with a choice** (Guard over two pools, or a split Resist), and says so next to the button ("skips rows with a choice").
- **Order of the arithmetic per creature:** the damage per subtype, then Resist / Weak / Immunity (once per subtype per Action; Resist only removes what that subtype dealt, so 4 Fire with Resist 5 Fire is −4), then Guard, then Health.
- **Riders happen only if their damage lands**, meaning more than 0 after Resist and Guard (Ch. 1 Riders). There is no "done" mark and no text explaining a skipped rider.

**Removed from the damage card:** "Avg 14.5 · this total or more: 38% · exactly: 11.6%" (moves behind Designer mode), the Lethal selector, the "Block" button, and the old "Guard 8 = … (the Guard ends)" sentence.

---

## 5. Settings

1. **Designer mode** (client setting, off by default). When on, a dashed footer on cards shows the odds (T1/T2/T3 %), the Ruler line and the Mithril mark on Action cards, and the average and "this total or more" on damage cards. Off: none of these appear anywhere in chat.
2. **"Hide enemy Defenses from players"** (world setting, GM, off by default). When on, for players (the GM always sees everything):
   - The ladder labels read "Tier 1 · Tier 2 · Tier 3" (no ranges).
   - The arrow shows the roller's own total but sits in the **middle** of its Tier's segment.
   - The stamp shows only the Tier (no "vs AD 11").
   - The breakdown's badge reads only "AD" (no number), with no Critical threshold ("33+") anywhere. The muted Critical row drops its "(Doubles, or 33+)".
   - Several targets: no "WD 13" labels.
   - A footer: "Player view · enemy Defenses hidden by the GM".
3. **"Hide target details from players"** (world setting, GM, off by default, **separate** from 2). When on, players see on the damage message only each target's name, "Waiting for the GM", then "✓ Applied", and a footer "Player view · target details hidden by the GM". No Weak / Resist / Immunity / Guard and no "Took".
   - **Bloodied and Strained stay visible whatever the settings; they are public.**
   - The roller's own pools, Tier lines, riders and breakdown stay visible.

Keep the existing "Chat message settings" structure. Add these where the other chat settings live.

---

## 6. Rules mismatches found in the current cards (fix them)

- **Several targets (Ch. 1):** today one DC field and one highlighted Tier apply to every target. The Defense, Boons/Banes, Favored/Doomed, Doubles, Tier and Critical are **per creature**, and the dialog's single DC must not override each target's own Defense. Damage is rolled once per Tier.
- **Weapon damage must carry its subtype** (Sl, Bl, Pi) on every card.
- **A used Version shows only its own values** (Word of Radiance at 3 AP: "3 Burst"). This is a known HANDOFF gap.
- **Distances have "sq."** ("5 sq."; Smite reads "Weapon").
- **The Save Action card shows its DC** (11 + Modifier).
- **The damage card's Weapon Modifier** must be a visible line in the breakdown, so the shown numbers add up.
- **Enfeebled:** applied **per die, each die still deals at least 1** (Ch. 8). The breakdown shows it per die. Empowered is +N per die.
- **Resist / Weak once per subtype per Action**, across both pools.
- **Doomed never has Doubles.** A Favored roll on several targets: 3d12, each creature keeps its own two.

---

## 7. Open questions: assume these defaults, list them in the report

- **Lethal / Nonlethal** is chosen in the roll dialog (Ch. 4: switching a Lethal Action to Nonlethal costs a Bane on the roll). The damage card only shows the tag. If the dialog has no such choice yet, add a minimal toggle that applies the Bane, or keep today's behavior and report it. Your call; say which.
- **Ch. 1 "Reading an Action" lists the Trigger after the meta lines.** Foundry's cards follow README rule 22. On the Save card the Trigger goes under the Tiers (decided). Don't edit the book; log a [Q] in `rules-backlog.md`.
- **Smite's Tier 2/3 damage**: check whether the card JSON writes [Mod]; Foundry showed "1d8 + 2d6 Holy" with no +2. Report what the card says; don't change it.
- **Category labels** ("Divine Power 1" vs "Paladin Feature 1"): keep them; not part of this pack.
- **Stale knowledge** to report only: rules-README / CLAUDE.md still say [B]/[M] where Ch. 1 is [V]/[R]; Ch. 3's Emanation example mentions "a 3 AP Smite's Appeal Save".

---

## 8. Accessibility

- Every clickable thing is a real `<button>`: the ladder, the result row, the pool lines, the stamp, retarget, Place Area, the adjust buttons. Each has `aria-expanded` where it toggles, and an `aria-label` where it has no text.
- Decorative icons and dividers get `aria-hidden="true"`.
- Text contrast is at least 4.5:1 (the muted `#5d5446` passes on `#f4ede0`; check any new shade).
- Never color alone: Tiers also carry their number and differ in lightness; Boon/Bane carry +/− and the word.

---

## 9. Tests (`node tools/tests/run.mjs`; numbers have gaps, so check before adding)

Add tests for the logic (not the CSS):

- **Per-target Tier** on one roll: different Defenses and Boons/Banes per target. The dialog DC doesn't override a target's Defense.
- **Favored/Doomed on several targets:** 3d12; normal keeps the first two; Favored keeps the best (and may keep a pair for Doubles); Doomed keeps the two lowest and has no Doubles.
- **Doubles:** +1 Tier; a Tier 2 raised to Tier 3 is not a Critical; Doubles on a Tier 3 is a Critical; a total of DC+20 or more is a Critical.
- **Resist / Weak / Immunity once per subtype per Action,** summed across sources and pools. Resist is capped at that subtype's damage.
- **Enfeebled per die, minimum 1 per die;** Empowered +N per die.
- **Apply all skips** rows with Guard over two pools or a split Resist.
- **Riders** are skipped when their damage ends at 0.
- **Settings:** Designer mode off hides the odds, Ruler and average; "Hide enemy Defenses" removes the Defense numbers and the Critical threshold from the player render; "Hide target details" removes the modifiers and Took, but **keeps Bloodied and Strained**.
- **Retarget** keeps the dice and recomputes the Tiers; it is refused after damage has been applied.

Run the lint as CLAUDE.md says.

---

## 10. Deliverables and the report

1. The code, the new CSS block and the tests on the `pack-` branch. Commit with a clear message; no zips, no node_modules.
2. Bump `version` in `system.json` and add the changelog entry to `docs/reference.md` (copy to `foundry/reference.md`).
3. **A short test checklist for Lucas for this version**, based on what was added, changed and removed: one line per thing to click in Foundry. Cover:
   - one target; three targets in an area;
   - Favored and Doomed;
   - Doubles at Tier 2 and Tier 3;
   - an explosion chain;
   - a Save with the owner vs a non-owner view;
   - a Reaction's Trigger line;
   - damage with Guard over two pools; Weak, Resist and Immunity; two subtypes in one pool;
   - Apply all;
   - Undo;
   - each of the three settings on and off.
4. Update `foundry/foundry-backlog.md` (what changed, known gaps: Linked Actions, Area Saves), `HANDOFF.md` and `MASTER-PLAN.md`.
5. The final report:
   - files changed;
   - **what could not be tried** (you can't run Foundry), plus any diagnostic;
   - **Assumptions I made**;
   - the answers to section 7.
6. Run `python tools/knowledge.py` and tell Lucas to re-upload `knowledge/` to the Project (skip it in a cloud session).

---

## 11. Example values from the mockup (for your tests and the checklist)

- **Smite (Round · 2 AP; Signature, Weapon | Melee | Strike | Divine; One creature ✦ Weapon), Greatsword 0 / 1d8 / 2d6 Sl.**
  - Tier 1: 🧠 1d6 Ho. Tier 2: ♥ 1d8 Sl · 🧠 2d6 Ho. Tier 3: ♥ 2d6 Sl · 🧠 2d10 Ho. Effects on Tier 2+.
  - Radiant Zeal adds 🧠 1d6 Ho (Escalation 1, first Strike each round that deals damage); Heavy Blows adds +2 on a Tier 3.
  - Flavor: "Your weapon blazes with holy light."
  - Roll 3 + 6 + 2 = 11 vs AD 11 → Tier 2.
  - Roll 6 + 6 + 2 = 14 vs AD 11 → Tier 2 raised to Tier 3 by Doubles.
  - Roll 12 → 12 → 7, then 5: 11 + 11 + 7 + 5, Boon +2 (Flanking), Bane −1 (Frightened), Bane −0 (Dim light), +2 Signature, −1 Situational = 36 vs AD 13 → Critical (33+).
- **Word of Radiance (Encounter · 3 AP; Power | Area | Divine; 3 Burst ✦ 10 sq.; vs WD), Power Modifier +2.**
  - Tier 1: 🧠 2d6 Ho. Tier 2: 🧠 2d10 Ho; Pushed 1. Tier 3: 🧠 3d8 Ho; Pushed 2. Critical: the target is Prone.
  - Favored/Doomed example: 3d12 = 9, 7, 7.
    - Bandit Thug (WD 13): 9 + 7 + 2 = 18 → Tier 2.
    - Grave Wisp (WD 13, Favored): 7 + 7 + 2 = 16 → Tier 2 → Tier 3 by Doubles.
    - Ogre Chieftain (WD 14, Doomed): 16 → Tier 2, no Doubles.
- **Rebuke (Turn · 1R; Power, Save | Divine; The triggering creature ✦ 5 sq.; Appeal Save DC 13).**
  - Trigger: "An enemy within 5 squares makes a [Strike] Action against an ally."
  - Their Tier 1: 🧠 1d8 Ho; Pushed 2, and Frightened of you for 1 round. Tier 2: 🧠 1d6 Ho; Pushed 1. Tier 3: no effect.
  - Example: 4 + 5 + 1 (Appeal) − 2 (Bane, Vulnerable 1) = 8 → their Tier 1.
- **Damage examples.**
  - Weapon Attack Tier 3: ♥ 13 Sl (4 + 5, +2 Weapon, +2 Heavy Blows), 🧠 3 Ho (Radiant Zeal). Bandit Thug with Guard 8 over both pools: the owner chooses. After Apply: Took ♥ 5 · 🧠 3, Bloodied.
  - Fire Imp hit by ♥ 6 Sl + 4 Fi and 🧠 10 Ho, with Resist 5 Fire and Weak 2 Holy: −4 Fire, +2 Holy → Took ♥ 6 · 🧠 12.

---

*Addendum (decided 2026-11-08 in the design Project; applied in v0.0.294). Same tokens, dividers, buttons and rules as above.*

## 12. Trigger / Interrupt placement (all cards: Save cards and non-roll cards)
- A Reaction's Trigger or Interrupt line goes right UNDER THE META LINES and ABOVE everything else.
- Card order: 1) name + "Frequency · cost" chip; 2) trait chips; 3) the target line "Targets ✦ Distance → target" + retarget; 4) on a Save card only, the "<Attribute> Save ——— [DC N]" line; 5) "**Trigger:** …" or "**Interrupt:** …" in plain text, no background, no "(X → Y)" context; 6) a one-diamond divider; 7) the rest (Save: the Tier rows; non-roll: the effect text).
- This REPLACES section 4.6's "Trigger sits right under the Tier rows".
- *(v0.0.294, waiting for Lucas: item 3's target line at the top with the retarget conflicts with v0.0.285 / v0.0.287, where Lucas moved the target row to the bottom of the attack and Save cards. Foundry keeps "Targets ✦ Distance" at the top and the "→ target" row with the retarget at the bottom until Lucas decides.)*

## 13. Non-roll cards (an Action that makes no roll: Opportunity Attack, Bulwark of Faith, Aim, and every other)
Today they show a category line, a boxed "Effects" block with a left bar, a target tag and a crosshair icon at the bottom, and buttons like "After the damage: Apply Damage/Effects" or "Aim: Weapon Attack · 1 of 1 left · free". Replace with:

Layout: the same card as the roll cards but with NO stamp and NO ladder (full width, padding 8px 10px, gap 6px).
1. Name + "Frequency · cost" chip (e.g. "At-will · 1R", "Encounter · 1R", "Round · 1 AP"), never wrapping. No category line (no "Basic Action", "Paladin Feature 1", "Combat Talent 1").
2. Trait chips by group with dividers (skip the row if the Action has none).
3. Target line "Targets ✦ Distance → target" + retarget (author and GM only). "Opportunity Attack": "The triggering creature ✦ 1 sq."; "Aim": "One creature ✦ 10 / 20 / 40 sq.". Distances always with "sq.".
4. Trigger / Interrupt line (section 12), when the Action has one.
5. One-diamond divider, then the effect text in full, 12.5px, NO "Effects" label, no boxed block. Inline items keep their look: conditions and movement as small outlined chips (with their icon: "Guard 9" with the shield, "Slid 1"), a Boon count in blue bold ("1 Boon"), a rule term as a dotted link ("Low cover"), a trait as its trait chip ("[Ranged]", "[Strike]"). Keep the card's text as written (e.g. "(1A)").
6. The next step, one of:
   a) A GRANTED ACTION (Aim's Weapon Attack, Opportunity Attack's Weapon Attack, an NPC's Basic attack): one row on a tinted block (#efe7d6, radius 4px): left "Granted Action:" (muted) + the Action's name (bold); right a primary button with a bolt icon and the name ("⚡ Weapon Attack"). Clicking it starts that Action with what the card grants (free, the Boon, ignoring Low cover, the triggering creature as target). When used: the button becomes a green "✓ Used". No sublines (no weapon name, no "free · 1 Boon …", no "1 of 1 left"). An NPC's Opportunity Attack offers "Granted Action: Basic attack".
   b) NUMBERED STEPS when the order matters (Bulwark of Faith): one row per step, a thin top border #e0d4ba, a dark number circle (18px), the label in bold, the button at the right: "1 · Before the damage · [Give Guard 9]", "2 · After the damage · [Slide 1]". A step not possible yet has its button disabled (opacity .5, aria-disabled / disabled) until its moment comes (step 2 until the triggering damage has been applied). A finished step shows a green "✓ Done" instead of the button. No notes under the steps. This replaces "After the damage: Apply Damage/Effects".
   c) Nothing, if the Action has no follow-up.
7. Three-diamond divider and the Flavor line (italic, muted).
Removed: the boxed "Effects" block, the "✦ Aim (Weapon Attack, 1 Boon)" source footnote, the bottom target tag and crosshair icon (the target line and retarget replace them), the category line.

Behavior to check:
- Granted Actions are used from the card's button (also keep any existing way to use them from the sheet, if there is one).
- The Opportunity Attack's granted Weapon Attack uses the attacker's wielded weapon against the triggering creature; if the weapon can't target them, the button is disabled with a tooltip saying why.
- Bulwark of Faith: step 1 gives the Guard to the target before the damage; step 2 opens the Slide picker after the damage.
- Bulwark of Faith's card says "Targets: The triggering creature" (in an Interrupt, that reads as the attacker) while the effect gives "the target" Guard 9: the Guard should go to the ally the Strike would damage. Don't change the card text: log a [Q] in rules-backlog.md ("Bulwark of Faith Targets should read 'The ally'? default yes") and make Foundry give the Guard and the Slide to that ally.

Tests (logic only): a granted Action carries its grants (Boon count, ignore Low cover, free) and can be used once; step 2 of Bulwark of Faith is refused before the triggering damage is applied; the Trigger line renders above the Tier rows on a Save card.
