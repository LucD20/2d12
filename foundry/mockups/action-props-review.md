# The Action's options: a review of the Mithril cards before ACTION-SHEET

2026-11-10, after v0.0.338. Lucas: "Check the details of all Mithril, see if any can be merged or if any option makes another obsolete; I will start the redesign after we make sure the props are OK."

Read: every Mithril card's Foundry data (28 items: 22 Actions, 3 Effects, 2 Talents, plus Heartseeker and Marksman's Shot, Mithril since v0.0.338). Each finding: what overlaps, the cards it touches, and a recommendation for the Action sheet. **Nothing here is applied yet**, apart from Heartseeker and Marksman's Shot becoming Mithril.

## 1. The big one: three ways to say "this happens after the damage"

A Tier's effect (Pushed 2, Vulnerable 2 (EoT), Frightened, Evade 1) can live in three places today:

| Where | What it does | Cards |
|---|---|---|
| **The Tier text** (`x1`–`x3`, `critical`), converted to buttons (`@Move`, `@Condition`) | A button to click by hand | Word of Radiance (Pushed, Prone), Bulwark of Faith (Slid), Shield of Faith (Reduce), Miraculous Recovery, Hallowed Dawn (Heal) |
| **"After the damage"** (`after`: a chain of chips, gated by `tier:N` / `crit:yes` / `t3:2`) | Runs by itself when the damage is applied and lands | Rebuke, Skirmish Shot, Heartseeker, Marksman's Shot, Word of Radiance, Smite 3 AP, Bulwark, Shield of Faith, Miraculous Recovery, Divine Intervention, Hallowed Dawn |
| **The Version's Effects by Tier** (`fx.all` / `fx.t1`–`t3`, modes Automatic / Conditional / After the damage when Down) | Applies an Effect item: on use, or as a rider when the damage lands | Rolling Shot, Overwatch, Covering Shot, Covering Fire, Open Season, Aim, Beacon, Consecrated Ground, Smite (light), Deathmark ("Down" mode) |

**Overlaps found:**
- **Word of Radiance** has both: `x2` / `x3` are Push buttons *and* `after` pushes by itself; its Critical is a Prone button *and* `@Condition[prone|crit:yes]` in the chain. Clicking the button applies it twice. (Rebuke, Skirmish Shot, Heartseeker and Marksman's Shot were already moved to the new way: plain text plus the chain.)
- **Bulwark of Faith, Shield of Faith, Miraculous Recovery, Hallowed Dawn**: the text has the chip *and* the chain has the same chip. On these non-roll cards the chain is the card's Apply steps, so the text chip is a second way to do the same thing.
- **A condition after the damage** can be `fx.t3` (the condition item, mode Automatic, as a rider) or `@Condition[...|tier:3]` in the chain. Same result; the chain one can carry a value and a duration (Vulnerable **2**, **EoT**), the `fx` one can't.
- **To write it, a card needs two edits in `book/cards`:** a plain `foundry.x3` override (so the book's words don't become a button) *and* the chain chip. That doubles every card that goes automatic.

**Recommendation (merge):** one place, **"After the damage"**, as rows in the Action sheet:
- each row: what (Push / Pull / Slide / Evade / Condition with value and duration / Effect item / Heal / Guard / Reduce / End an effect), on which result (Tier 1, 2, 3, Critical, "this Tier or better", or for a Save "this Tier or worse"), how far or how long, and who (the target, you, a creature you pick, the allies in the area);
- the Tier text stays the book's words, always plain (no buttons made from it);
- `fx` keeps only what happens **on use** (an Effect on you or on the target when the Action is used: Rolling Shot's granted attack, Beacon, Aim) and loses its rider role;
- a **"Fill from the Tier text"** button: the converter already reads "Pushed 2", "Vulnerable 2 (EoT)", "Frightened of you for 1 round"; it proposes the rows, the GM confirms. Then no per-card `foundry.x*` overrides are needed.

**Makes obsolete:** the `foundry.x1`–`x3` and `foundry.critical` overrides (v0.0.334 to v0.0.338), the rider role of `fx.tN`, the Conditional and "Down" modes (they become gates on a row: "only when the target goes Down", Deathmark), the card-level switches `fxOnUse` / `ridersOnDamage` (the order is fixed: on use, then after the damage).

## 2. A Reaction's range is written twice

- `momentRange` (the moment's range) and the Action's **Distance** ("5 sq.") both limit who can be reacted to. Rebuke uses its Distance with `momentRange` 0; Shield of Faith, Bulwark and Divine Intervention use `momentRange` 5 *and* say "within 5 squares" in the Trigger text; Overwatch and Covering Shot `momentRange` 10.
- **Beacon's Step** has `momentRange` 2 because the Aura is 2: if the Aura changes, the Step won't follow.

**Recommendation (merge):** the Reaction's range is its Distance (a number, or "the Aura of <Effect>"); `momentRange` goes away from the sheet (kept on load, migrated into the Distance).

**Obsolete now:** `momentThreat` ("only a creature you threaten"): since v0.0.335 Opportunity Attack uses Adjacent (`momentRange` 1) and no card uses it. Keep it in the data for a future Talent ("Polearm reach: your Opportunity Attack covers the squares you threaten"), but as a Talent's rule, not an Action field.

## 3. An area's duration is written up to three times

- `areaCfg.rounds` (the Action), the Version's `areaRounds` (3 AP: 5 rounds) and the Zone effect's **Ends: Time** (3 rounds). Covering Fire and Consecrated Ground carry all three. The Version wins (v0.0.327), so the Zone's Time only matters when the Zone is placed by hand.
- `areaCfg.size` and the Version's `areaSize` the same way (Word of Radiance 2 / 3, Consecrated Ground 2 / 3).
- `areaCfg.targets` (All / Allies / Enemies) and the Zone's per-row **Who**: on a Zone the rows decide; `targets` only matters for an area that is not a Zone.

**Recommendation:** the Area block on each Version (size, rounds), the Action level only for what never changes (shape, Distance, "around you"); on a Zone, `targets` and the rounds hidden ("set by the Zone").

## 4. Effects: the old fields stored next to the new

- The three Mithril Effects (Covering Fire, Consecrated Ground, Beacon) still carry the old `settings` list in the compendium **and** the new `rules` / `zone` (the settings are compiled from the rules when read; the stored copy is never read for them).
- **Beacon** has the old `duration` (3 rounds) **and** the new **Ends: Time** (3 rounds).

**Recommendation:** the compendium writes only `rules`, `zone` and `ends`; a one-time cleanup of the world copies (or leave them: harmless). Not a sheet question.

## 5. Marked Quarry (v0.0.335)

- The mark's rules (1 Boon, [V] [Mod] on a Tier 1, the reminders) live on a **Foundry-only Feature**, because an Action can't hold rules yet. Deathmark's and Open Season's text link to that Feature.
- **Recommendation for ACTION-SHEET:** the Action sheet gets the same rules list as Effects, Features and Talents (a "While you have this Action" section); Marked Quarry's rules move onto Mark Quarry, the Feature goes, the two links point to Mark Quarry.

## 6. Small things seen on the way

- **Open Season** (Mithril): "Vulnerable 2 on the Quarry (drop the condition by hand)". With section 1's rows it can be automatic ("after the damage: the target: Vulnerable 2, 1 round").
- **Aim**: the Talent and its Action are both Mithril with the same automation note; the Talent's card already shows the Action's card (`actionOnlyTalent`). Nothing to merge, just one note to keep.
- **Holy Wrath**: nothing beyond its Tiers (Mithril as written).
- **Lay On Hands**: only `@Rally` chips (by hand, on purpose: the target chooses).

## Summary for the redesign

| Keep as it is | Merge | Obsolete |
|---|---|---|
| Tier damage, Effects on use (`fx` on use), Reactions' moment / Self / Target, the Area shape and "around you", the Zone link | "After the damage" rows (Tier-text buttons + `after` + `fx` riders + `foundry.x*` overrides); a Reaction's range (= its Distance); the area size and rounds per Version | `momentThreat` on Actions, the `fx` modes Conditional / Down (gates on a row instead), `fxOnUse` / `ridersOnDamage`, stored `settings` / `duration` on Effects |
