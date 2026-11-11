# The Effects audit, before the Action sheet's redesign (PACK ACTION-SHEET, part 1)

2026-11-11, on v0.0.354 (238 tests pass). Nothing here is applied: `module/`, `templates/` and the compendium are untouched. Each finding has a recommendation and a **default**; the defaults are numbered **D1 to D55** (D41 to D55: the buttons, added the same day), so you can answer "all defaults except 7 and 22". The three mockups (`action-sheet-A.html`, `-B.html`, `-C.html`) are built on these defaults.

## Summary

The rules side is in good shape: EFFECT-SHEET already folded the 25 setting types into 9 rule kinds, and the pure code is cheap (a real PC's effects are read in about 10 microseconds). What is left is on the Action: one Version can say "this happens" in four places, and half of the options in those places have no card. The cost that players can feel is elsewhere: the sheets, the combat strip and the logs are redrawn many times for one event.

**The five changes worth the most:**

1. **One "After the damage" list of steps (D9 to D13).** Today a Tier's effect can be a button in the Tier text, a chip typed in the `after` field, or an Effect dropped on a Tier with a mode. 14 Versions use `after`; the per-Tier Effect slots have 1 card (Lock & Loose) and the modes 1 (Deathmark). Steps with a "which result" and a "who" replace the typed chips, the per-Tier slots and both modes.
2. **One redraw per sheet per event (D27).** At a turn change an open actor sheet is redrawn 6 to 8 times (two hooks do the same job, and `startTurn` writes four times). Read from the code, not timed; it is the likeliest cause of a sluggish turn change.
3. **The logs and the snapshot off the Combat's flags (D28, D29).** Every logged line rewrites the whole encounter log and sends it to every client: 42 KB a line at 200 lines, 126 KB at 600 (measured), and each write redraws every combatant's sheet and the strip twice. The undo snapshot does the same once a turn with every token and Region in it.
4. **Rules on the Action, and the Feature that only held them gone (D17).** Mark Quarry holds its Boon, its Tier 1 damage and its two reminders; the Foundry-only Marked Quarry Feature goes. The Action sheet gets the same rules list as an Effect.
5. **Stage 0 in the editor (D21 to D24).** Three places still say "1 to 3": the Escalation cost (`max="3"`), each rule's "Works: Escalation 1+ / 2+ / 3+", and `stageOf()` with its fixed tables. The sheet must read the Stage list and the Escalation maximum from the config.

**What I measured, and what I only read.** Measured with node: every use count below (the 212 compendium documents and the 417 items on the 13 packed actors, imported from `tools/content.mjs`; `book/cards/*.json` counted separately), the pure functions' timings in section 6, the log payload sizes, and the test suite (238 ok after building the packs). Read from the code only, because I can't run Foundry: every re-render count, every "N hooks fire" claim, and anything about `enrichHTML`, the DOM, the database or PIXI. Each performance finding says which.

---

## 1. The 25 rule types (`TWOD12.effectSettings`)

Uses: the compendium source (Effects / Features / Talents), then `book/cards/*.json` (only the settings a card writes itself; Effects are mostly built in `content.mjs`). "Kind" is the EFFECT-SHEET rule that writes the type today.

| Type | Compendium uses | book/cards | Kind (rule) | Verdict |
|---|---|---|---|---|
| boonbane | 17 (14 Effects, Marked Quarry) | 1 | On matching Actions | keep |
| bonusdamage | 12 | 2 | On matching Actions | keep |
| damagestep | 3 | 0 | On matching Actions | keep |
| ignore | 3 (Sharpshooter, Long Draw, Steady Nerves) | 3 | On matching Actions | merge with cover (D1) |
| cover | 1 (Aim) | 0 | On matching Actions | merge with ignore (D1) |
| note | 2 (Smite's two lights) | 0 | On matching Actions | keep |
| defense | 3 | 0 | Changes a value | keep |
| speed | 3 | 0 | Changes a value | keep |
| rally | 1 (Font of Mercy) | 1 | Changes a value | keep |
| resist | 0 on cards; the Elite ladder (code) | 0 | Changes a value | keep |
| grant | 11 | 0 | Grants | keep |
| inline | 1 (Beacon) | 0 | Grants | merge into grant (D2) |
| message | 2 (Marked Quarry) | 2 | Grants | keep |
| turnstart | 2 (Killer's Focus, Radiant Zeal) | 2 | Grants | merge: one "gains an Effect when" (D3) |
| encstart | 0 | 0 | Grants | merge (D3) |
| ondamage | 1 (Divine Power) | 1 | Grants | merge (D3) |
| weaponprop | 1 (Brawler, a Talent) | 1 | Weapons | 0 uses once the Talents go; keep, hidden (D5) |
| mastery | 2 (Sharpshooter, Bow Mastery) | 1 | Weapons | keep |
| eschook | 2 | 2 | Escalation hook | keep |
| freqmore | 0 on cards; the Elite ladder | 0 | More uses | keep |
| aura | 2 (Beacon, Divine Vigil) | 0 | Aura | keep |
| light | 3 | 0 | Light | keep |
| move | 1 (Frightened) | 0 | Movement limit | keep |
| zone | 4 on 2 Effects, written by "On the map" | 0 | (legacy kind) | the legacy kind goes (D4) |
| bleed | 1 (Bleed) | 0 | (legacy kind) | a real kind, later (D6) |

### Merge, or keep split

- **D1. `ignore` and `cover` are one job** ("these Actions ignore a Bane's source"): one writes the range and Engaged Banes, the other the cover levels, and the rule already shows them as one part ("Ignores"). **Default: one type, `ignore`, with the list (cover low / medium / high, one or all range Banes, Engaged, Engaged target); `cover` is read on load and written no more.** 4 cards.
- **D2. `inline` is a grant** ("has the Action while it lasts" against "can use it N times"): the rule kind is already one, with a switch. **Default: one type, `grant`, with the mode; `inline` read on load.** 1 card (Beacon).
- **D3. `turnstart`, `encstart` and `ondamage` are one job** ("it gains / gives an Effect when ..."): the rule already has one "When" for them. **Default: one type with `when` (each turn, each encounter, on its damage); the three read on load.** 3 cards, `encstart` none.
- **D4. The legacy `zone` rule kind** ("Zone (old layout)" on a Feature) has no card: an Effect's Zone is "Where it is: On the map" since v0.0.327. The `zone` *setting* stays for now (it is what "On the map" compiles to, 4 uses). **Default: remove the kind from the rules list; keep the compiled setting until the readers move to the rules.**
- **D5. `weaponprop`** has one card, Brawler, and the Talents are being removed (decisions-s1 item 33). **Default: keep the type and the "Weapons" kind (Mastery uses it), no change now; if no card uses "loses a property" after the Talents go, hide that mode.**
- **D6. `bleed` is a hard-coded condition** (damage at the end of each turn, a Save or Interact ends it), kept as a legacy kind you can't add. Since v0.0.323, Ends has "A Save" with Interact, so Bleed is "damage each turn" plus that Ends row. **Default: not in the ACTION-SHEET build; log it: when a second card deals damage over time, "Damage each turn" becomes a rule kind and Bleed uses it.**
- **Keep split, though they look alike:**
  - **Aura and Zone.** Both are an area with the same four "What it does inside" rows. An Aura has a bearer and follows it, its origin is the bearer, and it ends with the Effect that holds it. A Zone has no bearer, its own Ends (rounds, Someone uses an Action) and comes from an Action's area. They share the rows (one piece of code) and must stay two things. **D7 (default: keep split).**
  - **`defense`, `speed`, `rally`, `resist`.** One rule kind ("Changes a value") and four types, because four different modules read them (`defense.mjs`, `speedmods.mjs`, `rally.mjs`, `ccdamage.mjs`) and the stacking rules differ (named bonuses for Defense and Speed, the highest Resist). **D8 (default: keep the four types under the one kind).**
  - **`boonbane`, `damagestep`, `bonusdamage`, `note`.** Already one rule with parts; four types because one rule can switch on several. Nothing to do.
  - **`grant` and `message`.** A message can carry a free-use button, which looks like a grant; but a grant is spent from a list and a message is a reminder at a moment. Keep.
  - **`light` and an Aura's "Shown on the map".** One is light for Vision, the other a drawing. Keep.

---

## 2. A Version's Effects by Tier (`fx.all`, `fx.t1` to `t3`, and the modes)

| Slot / mode | Compendium uses | What it really does (`actions.mjs:1144`, `1190`, `1307`) |
|---|---|---|
| `fx.all`, Automatic | 24 on 17 Actions | A Version **without** Tiers: applied on use. A Version **with** Tiers: applied on a **Tier 2 or 3** (the card's "Effects (Tier 2+)" line), with the roll, before the damage. |
| `fx.t1` | 0 | |
| `fx.t2`, Automatic | 1 (Lock & Loose) | A rider: applied when that Tier's damage lands. |
| `fx.t3` | 0 | |
| Conditional | 0 | Stays behind the damage card's "Effects" button. |
| After the damage, when the target is Down | 1 (Deathmark) | Applied when the damage puts the target Down. |

- **D9. `fx.all` keeps its job and gets its name.** The sheet calls it "Whole Version (applies on any tier)", which is wrong for a Version with Tiers: it is the Effects line, Tier 2+. **Default: one list per Version, named by what it does: "On use" on a Version without Tiers, "On a Tier 2 or 3" on one with Tiers (the mockups show both).** No data change.
- **D10. The per-Tier slots become steps.** `fx.t1` and `fx.t3` have no card and `fx.t2` one. An Effect on one result is a step of "After the damage" (D12): "An Effect, on a Tier 2 or better". **Default: `fx.t1` to `t3` leave the sheet; Lock & Loose's Effect becomes a step; the fields are read on load and migrated.**
- **D11. The modes go.** Conditional has no card. "When the target is Down" has one and is a gate, not a mode. **Default: no mode select; "only when the target goes Down" is a switch on a step (Deathmark); Conditional is dropped (an Effect you want by hand stays a chip in the text).**

---

## 3. The "After the damage" chain (`after`)

14 Versions on 12 Actions. Chips: `@Condition` 8, `@Move` 7, `@Guard` 3, `@Heal` 3, `@EndEffect` 3, `@Effect` 2, `@Reduce` 1, `@Pause` 1. Gates: `tier:N` 4, `crit:yes` 3, `t1:2` / `t3:2` (a distance by Tier) 3, `who:pick` 3, `who:targets` 1, `pick:yes` 4, `area:N` 2, `from:target` 1, `from:area` 2.

- **D12. Steps, not typed chips.** The chain is a text field today (`@Guard[1d8+mod|who:pick|area:2] @Move[pushed|distance:1|pick:yes|area:2|from:target]`): only someone who knows the grammar can write it, and a typo fails silently. **Default: a list of steps. Each step: what (Forced Movement, a condition with value and duration, an Effect, Guard, Heal, Reduce, End an Effect, a pause), on which result (Tier 1 / 2 / 3 / Critical as four switches), who (the target, you, a creature you pick, the others in an area around the target, everyone in the Action's area), and its amount. The field stays in the data as it is (the steps read and write the same chips), so no migration and the runtime doesn't change.**
- **D13. "On which result" reads the same on a Strike and on a Save.** Today `tier:1` means "Tier 1 or better" on a Strike and "Tier 1 or worse" on a Save (`inline.mjs:649`), which nobody can guess from the chip. **Default: the four switches show the Tiers the step runs on (Rebuke's Frightened: Tier 1 only; Heartseeker's Vulnerable: Tier 3 only), and the chip is written from them.**
- **D14. "Fill from the Tier text."** The converter that turns "Pushed 2" or "Vulnerable 2 (EoT)" into buttons already exists. **Default: a button that proposes the steps from the Tier text and the Critical line; you confirm. The Tier text stays the book's words, never buttons, on a Version that has steps (v0.0.339's rule, kept).**
- **D15. A value by Stage is a row of the step, not prose.** Smite's Guard is "1d8 + [Mod] (2d6 at Stage 2, 2d8 at Stage 3)" and the chip only knows the Stage dice by its own code path. **Default: an amount has a "By Stage" switch: one field per Stage of the config's list (Stages 0 to 3 once Stage 0 is in), an empty Stage uses the one before it.** See D23.
- **Text chips that stay.** In the Tier and Effects text there are 58 `@Move`, 35 `@Condition`, 7 `@Rally`, 5 `@Heal` and others on 50 Actions that have no chain: those are the cards not yet written with you, and their buttons are how they work. Nothing to change until each card's session. **D16 (default: leave them).**

---

## 4. The Action's own fields

| Field | Uses | Finding | Default |
|---|---|---|---|
| Rules on an Action | 0 (the model has none) | Marked Quarry's 4 settings sit on a Foundry-only Feature because an Action can't hold rules (action-props-review section 5). | **D17: the Action gets `rules` / `settings` (the same fields and list as a Feature); Mark Quarry takes them; the Feature goes; Deathmark's and Open Season's links point to Mark Quarry.** |
| `momentRange` | 7 Reactions | Written twice: the moment's range and the Action's Distance ("5 sq."). Beacon's Step repeats its Aura's size. | **D18: a Reaction's range is its Distance (a number, or "the Aura of an Effect"); `momentRange` leaves the sheet, read on load and written from the Distance.** |
| `momentThreat` | 0 | Obsolete since v0.0.335 (Opportunity Attack is Adjacent). Already hidden unless on. | **D19: off the sheet and out of `moment.mjs`'s checks; the field stays in the model one more version, then goes.** |
| `areaCfg.size` / `rounds` and the Version's `areaSize` / `areaRounds` | 10 areas; 2 Actions with a size per Version, 1 with rounds | The same value in two places (three with the Zone's Ends: Time). The Version wins. | **D20: size and rounds only on the Version (the Action's become the first Version's on load); shape, where it is placed and "it stays" on the Action; on a Zone, Targets and the Zone's own Time are hidden ("set by the Zone" / "set by the Version").** |
| `areaCfg.ht` (Hazardous Terrain patterns) | 0 | The old Hazard (a flag on the Region, `hazard.mjs`); a Zone's Hazard row replaced it in v0.0.327. Two Hazard systems run side by side. | **D20b (with D20): off the sheet; `hazard.mjs` stays only for the `@Template[...|ht:...]` chip until no text uses it.** |
| `modifiers` on an Action | 0 | "Modifies other Actions" is a Talent's piece shown on every Action (it is the first thing on the sheet in your screenshot). | **D25: off the Action sheet (Talents are going; no Action uses it).** |
| `prerequisites` | 3 (Whirlwind, Sacred Weapon, Hand of Mercy) | "Only for Talents" by its own placeholder. | **D25: off the Action sheet; the three texts move to Requirements or go with their cards' sessions.** |
| `setup` | 1 (Cut Through) | Rare. | **D26: behind "+ Setup" (shown when filled).** |
| `mode` (a Split Action's Weapon / Power Version) | 1 Action (Divine Retribution, an old card) | Rare. | **D26: under Advanced, shown when a Version has it.** |
| `basicAttack`, `basicRating`, `weaponUse` | 2 to 3 | Fine; `weaponUse` only matters with the Weapon trait. | **D26: `weaponUse` shown only with the Weapon trait; the Basic attack's rating only when ticked (as today).** |
| The Versions window and its Damage Instance dialog | every Action | A second window, and a `DialogV2` (the standing rule: no Foundry default windows). | **D26b: the Versions are edited on the sheet; a Tier's damage is one field written like the card (`[V] 1[W] + [Mod] + [R] 1d6 Ho`, the Generate Action grammar), with chips under it showing what was understood. `VersionsEditor` and `instanceDialog` go.** |
| Fields no card uses | `halfT3`, `halfOn`, `predicate`, `grantAp`, `msgAp`: 0 | Older spellings kept next to their replacements (`grantOn`, `all`). | **D26c: read on load (as now), never written; removed from the model when the readers move to the rules.** |

---

## 5. Ready for Stage 0 (book/decisions-s1.md)

- **D21. The Escalation cost takes 0 to 3** (`item-sheet.hbs:237`, `max="3"`). **Default: the maximum comes from the config (a new `TWOD12.escalationMax`: 3 today, 6 once Stage 0 is applied), and the field has two meanings chosen by a switch: "Costs N" (an Escalation Action) or "Needs N" (an Apex).** The data has one number today; "Needs" is a new field (`escalationNeeds`), a question below.
- **D22. A rule's "Works" is a fixed list** (`fxsheet.mjs:302`: Always, Escalation 1+, 2+, 3+; also `item-sheet.mjs:234` `escChoices`). The Passives move to Escalation 2, 4 and 6. **Default: "Always" or "From Escalation N", N from 1 to the config's maximum.** The old values need a map when Stage 0 is applied (1 -> 2, 2 -> 4, 3 -> 6), which is that pack's migration, not this one's.
- **D23. Stages are fixed at 1 / 2 / 3** in `stageOf()` (`config.mjs:269`: levels 8+ are Stage 3, 5+ Stage 2), in `stageModStep`, `npcRallyHeal`, the Bestiary's tables, and in the Guard chip's Stage dice. **Default: the sheet reads `TWOD12.stages` for every by-Stage value (the list's length and each Stage's number and levels), and `stageOf()` reads the same list. The list itself changes in the Stage 0 pack.** The mockups show Stages 0 to 3 with decisions-s1's levels.
- **D24. No Talent-only pieces** (item 33): "Modifies other Actions" and Prerequisites leave the Action sheet (D25); the Talent's own sheet, the picker and the 16 Talents are the Stage 0 pack's.

---

## 6. Performance

The pure code is cheap; the cost is in how many times the same thing is redrawn or resent. **Measured** = timed under node with Foundry stubbed (a lower bound: the real `getFlag` and settings reads are slower). **Read** = from the code only.

| # | What | Where | Trigger | Rough cost | Fix (default) |
|---|---|---|---|---|---|
| **D27** | An open actor sheet is redrawn 6 to 8 times at a turn change. Two hooks do the same job, and `startTurn` writes four times (the combatant's update, the AP flag, the turn log, the Guard), then the snapshot. `render()` calls queue, they don't merge. Each redraw rebuilds everything (the class tab's enriched Features, the conditions, every Action row about three times). | `actor-sheets.mjs:1511`, `usage.mjs:205`, `combat.mjs:213-258` | every turn change, every client with a sheet open | **Read.** 6 to 8 full sheet builds a turn instead of 1 | One debounced redraw per sheet (about 50 ms); delete `usage.mjs`'s copy; `actor-sheets.mjs:1511` ignores flag changes that are only a log or the snapshot; `startTurn` writes the combatant once. |
| **D28** | The encounter log and the damage log are whole arrays on a Combat flag: each new line clones and resends the whole log to every client, and that write redraws every combatant's sheet (D27), the strip twice (D30) and the open log windows. | `enclog.mjs:112-118`, `damagelog.mjs:14-16` | every logged event | **Measured:** 10.7 KB a line at 50 lines, 42 KB at 200, 126 KB at 600 (38.8 MB sent to each client over those 600). **Read:** the redraws. | One flag key per line (`flags.twod12.enclog.<id>`), so only the new line travels; the hot `updateCombat` handlers skip log keys. |
| **D29** | The undo snapshot: every combatant's flags, every actor's effects, every token and every Region (a Zone's squares included) written into one Combat flag at each turn start, sent to everyone. | `combat.mjs:247-258` | every turn start | **Read.** A large write and the full `updateCombat` fan-out again | Keep it in memory on the GM's client (or a GM-only client setting). Lost on a reload: a question below. |
| **D30** | The combat strip is rebuilt twice for every combat or combatant update (`renderCarousel(); setTimeout(renderCarousel, 50)`), and it measures the layout each time. | `carousel.mjs:204` | every AP change, every log line (D28), every client | **Read.** | One redraw per animation frame; skip log-only changes. |
| **D31** | A ticking duration writes twice per effect (`remaining`, then `lastTick`), each a round trip that fires the 10 `updateActiveEffect` handlers and a sheet redraw. | `effects.mjs:464` | every turn change, the GM, per timed effect | **Read.** 2 writes instead of 1 per effect | One `update` with both flags. |
| **D32** | The "On you" effects panel is rebuilt on any effect change of any actor, with no check that it is the shown one. 16 to 18 handlers hang on the effect hooks in all. | `effects.mjs:503-547` | every effect created, changed or removed | **Read.** | Return unless the effect's actor is the one shown; one redraw per frame. |
| **D33** | `allEffects` / `passiveSources` recompute a creature's passives on every call (about 27 passes per Feature with settings); 30+ call sites, about 14 calls a roll. | `passives.mjs:9-51` | every roll, every sheet row, every measured movement step | **Measured:** 10.2 µs a call on Sylwen, 66 µs on a 30-item actor; 0.3 and 0.8 µs with a per-item cache (x30, x79). Small alone; it is the multiplier in D27 and D34. | A `WeakMap` keyed on the item's settings array (a new array after every update, so it can't go stale). |
| **D34** | Movement cost: each measured grid step reads the mover's Movement limits through `allEffects`, and filters every token. | `move.mjs:321-341` | every step of every path measured while dragging | **Measured (a replica):** 8.4 µs a step, 8.2 of them `allEffects`. Whether Foundry asks per explored edge wasn't verified. | Resolve the mover's limits once per drag (D33 covers most of it). |
| **D35** | The quarry marks: every token refresh walks every world actor to find who marks whom. | `mark.mjs:62`, `19-28` | every frame a token moves, hovers or is selected, every client | **Measured (a replica):** 14 µs per refresh with 50 world actors, 75 µs with 300 | Cache the marks; clear on the existing quarry hook, `canvasReady` and token create / delete. |
| **D36** | Four chat handlers are registered on both the new and the old render hook; if V14 still fires the old one they run twice per message, and the Reactions card binds its listeners twice. | `twod12.mjs:328-331` | every chat message drawn | **Read** (whether V14 fires the old hook: not verified) | Drop the four old registrations (the system is V14 only). |
| **D37** | Three passes over the whole world on every load: `refreshWorth` (two compendium indexes, every item, actor and unlinked token; its comment says "always"), `fixReleaseCost`, and the effects migration's dry run until it is accepted. | `refresh.mjs:124-128`, `basic.mjs:76`, `fxmigrate.mjs:50` | every load, the GM | **Read.** Grows with the world | A "done for version X" setting for each. The other ten ready passes are already guarded. |
| **D38** | The item sheet builds the old settings rows (`settingsList`: sentences, predicate rows, the light animations) for every Effect, Feature and Talent on every render; no template uses them since v0.0.323. | `item-sheet.mjs:132-224` | every render of those sheets | **Read** (the grep finds no `settingsList` in `templates/`). Small, but 90 dead lines and `fxdetails.mjs` imports kept alive | Delete with the redesign. |
| **D39** | The Action sheet rebuilds the whole sheet and the card (`buildSoloCard`, an `enrichHTML` per text) on each change, and so does the Versions window (each change: one update, then a full render with a `fromUuid` per Effect). | `item-sheet.mjs:71`, `versions.mjs:142-146` | each field changed | **Read.** Fine for one sheet; the new sheet has more controls | In the new sheet: a click updates the item and redraws only its part and the card (as `fxsheet.mjs` does); the names of dropped Effects cached. |
| **D40** | Smaller ones: hovering a token redraws every Aura at once (`aura.mjs:162`); a Zone refresh is scheduled on any token update, with no x / y check, and on every log line (`zone.mjs:158-162`); the sight gate reads two world settings per test (`light.mjs:21-26`); `createCombat` builds a sheet object for every world actor to ask if it is open (`actor-sheets.mjs:1512`). | as listed | hover; any token update; every visibility test; each new combat | **Measured where pure:** the Aura scan 68 µs for 20 tokens, `tokenLight` 1.7 µs. The rest **read**. | Schedule instead of redraw; filter on x / y / round / turn; read the settings once; look at the open windows instead of every actor. |

**Looked at and fine:** `prepareDerivedData` (no parsing; the Speed pass 15 µs); `migrateData` on load (0.4 µs an item once the rules are stored, 8 µs for an old copy); the Details tab's `compile` (8 µs) and hover text (26 µs); the flanking, Line of Effect, light and Reaction overlays (off by default, one draw per frame); the movement, Hazard and area hooks (they exit early on x / y); the area cache (400 ms).

**Scope.** D27 to D37 and D40 are not the Action sheet's: they are a small pack of their own (about M), best before the next playtest. D38 and D39 belong to the ACTION-SHEET build.

---

## 7. The buttons (the chips, and the Create Button window), added 2026-11-11

Lucas: "check the Buttons for errors, obsolete options, improvements". Read: `builder.mjs` (the window, 119 lines), `inline.mjs` `parseInline` (what a chip understands), `gen.mjs` `convertEffects` (words to chips). **Measured:** I ran the window's `buildCommand` with twelve inputs and read each result back with `parseInline` (node, Foundry stubbed); the chip counts are section 3's. Not tried: any click in Foundry.

**The system has 20 kinds of chip; the window makes 6.** Check, Damage, Save, Template, Move, Rally are in it. Missing: Condition (the most used chip on the cards: 35 in text, 8 in chains), Guard, Heal, Reduce, Effect, EndEffect, Use, Boon, Cleave, Pause, Reload, Release, Regrip, Book.

### Errors

| # | What | Where | Seen in the round trip | Default |
|---|---|---|---|---|
| **D41** | A label with `|` is cut at it, and one with `]` breaks the button: neither is escaped. | `builder.mjs:17` | `label:Climb | the wall]` came back as "Climb", with a stray `]` after the button | Refuse or strip `|`, `[`, `]` in the label, and say so. |
| **D42** | A Save's Tier written like the card (`[R] 1d8 Ho; Pushed 2`) is read as one broken formula ("1d8 Ho; Pushed 2"): a Tier only splits at commas, and its own format (`1d6[mind,holy], "text", Item.id`) is nothing a card uses. | `inline.mjs:54-78`, the window's placeholder | yes | The Tier fields take the card's notation (the Generate Action reader), and the window writes the chip's format from it. |
| **D43** | Empty or zero inputs make a button anyway, silently changed: no damage row gives `@Damage[]` (a button that does nothing); Rally 0 becomes 1; an area of 0 becomes 1; an empty Move distance becomes 1. | `builder.mjs:25-36` | yes | No Send or Copy until the kind's needed fields are filled; the missing field is marked. |
| **D44** | Options that contradict each other are all written or one is dropped without a word: "Target self" on a Line; "Expires: end of turn" drops the Rounds typed; Difficult terrain with no movement ticked becomes Walk. | `builder.mjs:37-45` | yes | Fields that don't apply are hidden (a Line has no "self"; EoT hides Rounds). |
| **D45** | The DC can't be "the user's": a chip reads `dc:@power`, `@weapon`, `@signature` or an Attribute (`inline.mjs:128`), the window only a number. And 13 is never written, so on a card "13" silently means "the card's DC" (`saveDcFor`). | `builder.mjs:10` | `dc:13` is left out | DC as a choice: the card's, 13, the user's Power / Weapon DC, a number. |
| **D46** | The pools are still named for the old system inside the chip (`body`, `mind`), and `vigor` / `resolve` are not understood: `1d6[resolve,holy]` falls back to Vigor without a warning. The window's labels say Vigor and Resolve. | `inline.mjs:43-50` | yes | The tags also read `vigor`, `resolve`, `V`, `R`; the window writes the new names; the old stay read. |
| **D47** | It is a Foundry default window (`DialogV2`), against the standing rule; and it closes after one button. | `builder.mjs:95` | | The system's window (the mockups), kept open for the next button. |
| **D48** | One way out, doing two things: it copies to the clipboard and fills the chat box, without sending. A failed copy says nothing. | `builder.mjs:112-118` | | **Lucas, 2026-11-11: two buttons, "Copy the text" and "Send to chat" (sent at once).** A failed copy shows the text selected. |

### Obsolete, or doing another option's job

- **D49. The Template's "Keep the area", Expires, Difficult terrain, Difficult for and Movement** are the old kept area. Since v0.0.327 an area that stays is a Zone (an Effect on the map, with its own rows and Ends). The compendium has 5 `@Template` chips, all `emanation|distance:N|rounds:1` (Smite's and two other cards' light): none uses keep, expire, difficult, difficultFor or `ht:` (the old Hazard: D20b). **Default: the Area button keeps Shape, Size, Targets, "and the creature it is around" and Rounds; an area that stays or does something inside is made by dropping its Zone Effect (the Effect button). The old options stay read.**
- **D50. The Traits grid on a Check and a Save** shows all 22 traits. The four Attributes repeat the row above; Signature, Split, Weapon, Power and the whole Requires group mean nothing on a loose Check. They only exist so Effects can match ("a Boon on [Fear] Saves"). **Default: a "+ trait" picker (as on the sheet) labelled "Matches", empty by default.**
- **D51. `s2:` / `s3:` (a formula at Stage 2 / 3)** are fixed names in the chip (`inline.mjs:170`, `stagedFormula` line 262), for Guard, Heal and Reduce. With Stage 0 they need `s0:` and `s1:` too. **Default: `sN:` for any Stage of `TWOD12.stages`; an empty Stage uses the one before it (D15, D23).**
- Already found: `tier:N` flips its meaning on a Save (D13).

### Improvements

- **D52. The missing kinds**, in this order of use: Condition (value, duration), Effect (a drop zone; a Zone too), Guard, Heal and Reduce (a formula, by Stage, who), Use an Action. Boon, Cleave, Pause and the hands chips stay text-only (written by cards, never by hand).
- **D53. Write it.** `convertEffects` already turns "Pushed 2", "Vulnerable 2 (EoT)", "Appeal Save", "Evade 1", "Body Check", "2Emanation 1/round" into chips (checked: ten phrases, all read). A text box that shows each piece as its button is the fastest builder and needs little new code (mockup B3).
- **D54. A live look at the button and its text** before it leaves; **Recent** (the last buttons, to send again); opened from a card's text field too (insert at the cursor), not only from the scene controls.
- **D55. Move's options that exist and can't be picked:** "away from" (you, the target, the area's center), "the others in an area" with a pick, a minimum, through creatures (`terrain:ignore`). **Default: in the Move kind, behind "More".**

## The defaults, in one list

| # | Default |
|---|---|
| D1 | `ignore` and `cover`: one type |
| D2 | `inline` into `grant` |
| D3 | `turnstart`, `encstart`, `ondamage`: one type with a When |
| D4 | The legacy `zone` rule kind removed |
| D5 | `weaponprop` kept; "loses a property" hidden if no card is left after the Talents go |
| D6 | Bleed as a "Damage each turn" kind: later, logged |
| D7 | Aura and Zone stay two things (shared rows) |
| D8 | Defense, Speed, Rally, Resist: four types under one kind |
| D9 | `fx.all` named by what it does: "On use" or "On a Tier 2 or 3" |
| D10 | `fx.t1` to `t3` off the sheet; an Effect on one result is a step |
| D11 | No modes: "when the target goes Down" a switch on a step; Conditional dropped |
| D12 | "After the damage" as steps (the same chips underneath) |
| D13 | "On which result": four switches, the same on a Strike and on a Save |
| D14 | "Fill from the Tier text" |
| D15 | An amount can be "By Stage" |
| D16 | The text chips of the cards not yet written with you stay |
| D17 | Rules on the Action; Mark Quarry holds its own; the Feature goes |
| D18 | A Reaction's range is its Distance |
| D19 | `momentThreat` off the sheet and the checks |
| D20 | The area's size and rounds per Version only; `areaCfg.ht` off the sheet |
| D21 | Escalation: Costs N or Needs N, N up to the config's maximum |
| D22 | "Works": Always, or From Escalation N |
| D23 | By-Stage values and `stageOf()` read `TWOD12.stages` |
| D24 | No Talent-only pieces on the Action sheet |
| D25 | "Modifies other Actions" and Prerequisites off the Action sheet |
| D26 | Setup, a Split Action's mode, Weapon used: shown only when they matter; Versions edited on the sheet, the damage written like the card; the old spellings never written |
| D27 | One debounced redraw per actor sheet |
| D28 | The logs: one flag key per line |
| D29 | The undo snapshot in memory on the GM's client |
| D30 | The strip: one redraw per frame |
| D31 | A duration tick: one write |
| D32 | The effects panel: only for its own actor |
| D33 | A cache for a creature's passives |
| D34 | Movement limits once per drag |
| D35 | The quarry marks cached |
| D36 | The four old chat hooks dropped |
| D37 | The three load passes behind a "done" setting |
| D38 | The dead `settingsList` deleted |
| D39 | The new Action sheet redraws only what changed |
| D40 | The smaller ones (Aura hover, Zone refresh, sight gate, createCombat) |
| D41 | A button's label can't hold `|`, `[`, `]` |
| D42 | A Save button's Tiers written like the card |
| D43 | No button from empty fields |
| D44 | Fields that don't apply are hidden |
| D45 | DC: the card's, 13, the user's Power / Weapon DC, a number |
| D46 | Pool tags read `vigor` / `resolve`; the window writes them |
| D47 | The system's window, kept open |
| D48 | Two buttons: Copy the text, Send to chat (Lucas) |
| D49 | The Area button without the old kept-area options |
| D50 | "Matches": a + trait picker instead of the grid |
| D51 | `sN:` for every Stage of the config |
| D52 | The missing kinds: Condition, Effect, Guard, Heal, Reduce, Use an Action |
| D53 | Write it: words to buttons |
| D54 | A live look, Recent, opened from a card's text field |
| D55 | Move's hidden options behind "More" |
