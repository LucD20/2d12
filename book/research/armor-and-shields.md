# Armor and shields in tight-math systems: making them interesting, taxonomies, progression, and fit with 2d12

**Date:** 2026-11-24. **Asked by Lucas:** *"Armor shields first. How to make them interesting, how progression should work, how to make it fit 2d12 since we already have weapon mastery, magic 'mastery'... How to make armor interesting etc. what people like, dislike, how to balance light/medium/heavy armor, if that should be even used, metal armor, leather armor etc."*

**What was read, and how far to trust it.**
- `[read]` Primary rules text opened directly: **Pathfinder 2e** (*Armor*, *Armor Groups & Armor Specialization*, *Armor Property Runes*, *Shields*, *Shield Reinforcing Runes* — Archives of Nethys); **Draw Steel** (MCDM printing 1.01b, *Shining Armor* Kit and *Imbue Treasure / Imbue Armor* downtime project — Steel Compendium); **Daggerheart SRD 2.0** (*Armor*, *Armor Tables*, and *Secondary Weapon Tables* including Round Shield, Tower Shield, Buckler, Spiked Shield, Braveshield).
- `[lead]` Search extracts and forums blocking automated readers: Draw Steel's other Kits (`Mountain`, `Raider`, `Panther`, `Guisarmier`) and Leveled Armor/Shield Treasures (*Spiny Turtle*, *Kuran'zoi Prismscale*, *Shrouded Memory*, *Telekinetic Bulwark*) from `steelcompendium.io` extracts; Trollsmyth's *"Shields Shall Be Splintered"* (blog blocked direct fetch; verified across multiple OSR summaries); **Dragonbane** parrying/durability; **13th Age** class-tied armor/shield talents (`13thagesrd.com` extracts); player reception on `r/RPGdesign`, `r/Pathfinder2e`, `r/daggerheart`, `r/dndnext`, `r/onednd`, `r/osr`, `r/drawsteel`. Check any `[lead]` before quoting publicly.
- `[memory]` D&D 5e armor table and static `+2 AC` shields; Mythras/BRP hit-location DR; 13th Age class-fixed base AC.

**Already in the project:** `weapon-improvements.md` (tight-math gear levers, `+1` armor = ~14% Health-loss swing from `book/items-economy.md`), `frontline-protection.md` (tanking and protection), `gear-and-hands.md` (free hands and gripping).

**Other games' rules and opinions, never 2d12's. Nothing here is decided.**

---

## 1. What players actually like and dislike about armor and shields

### 1.1 The six recurring complaints about armor `[lead]` `[memory]`
1. **"The Level 1 Tax" (pick once, forget forever):** In D&D 5e and PF2e, most players calculate the highest AC their Dexterity and proficiency allow at Level 1, upgrade to Studded Leather / Half-Plate / Plate as soon as gold allows, and **never make another meaningful armor decision** for the rest of the campaign.
2. **Aesthetic lock-in beats penalty-only differentiation (`r/RPGdesign`):** Players usually choose their character's armor *for its fantasy/look before reading stats*. When the only difference between armor categories is a penalty (`-5 ft Speed`, Stealth disadvantage), heavy-armor players don't switch to light armor — they just feel taxed outside combat while gaining nothing interactive in combat.
3. **Dead / trap armor entries (`r/dndnext`, `r/Pathfinder2e`):** Classic tables pad 12 rows where 8 are strictly obsolete (Padded, Hide, Ring Mail) and only 3–4 are real choices (Studded Leather, Breastplate/Half-Plate, Full Plate). Players also notice historical absurdities — especially D&D's bad Padded/Gambeson and fictional "Studded Leather" (a Victorian misreading of **Brigandine**).
4. **The "Medium Armor Identity Crisis" (`r/RPGdesign`, `r/Pathfinder2e`):** Light armor has a clear fantasy (agile, silent, unencumbered). Heavy armor has a clear fantasy (unstoppable juggernaut). Medium armor is repeatedly called *"bland"*: *"its advantage is the lack of disadvantages, and its disadvantage is the lack of advantages."*
5. **Armor Specialization that is too small or too late (`r/Pathfinder2e`):** PF2e's Armor Groups (`[read]`: Plate = Slash resist, Composite = Pierce resist, Leather = Blunt resist, Chain = Crit reduction) are praised conceptually, **but** players criticize them as boring/weak because they arrive late (Level 7–11), apply only to Medium/Heavy, and scale slowly.
6. **Active armor bookkeeping:** When armor requires rolling soak dice on every hit or tracking per-piece durability/hit-location math, tactical combat slows down (`r/RPGdesign`). Players want armor to feel **distinct without adding math to every single incoming attack**.

### 1.2 The five recurring complaints (and loves) about shields `[read]` `[lead]`
- **Hate — Passive `+2 AC` glued to casters (D&D 5e `[memory]`):** Zero tactical decision-making, no difference between a buckler and a tower shield, and notoriously abused by armor-dipped spellcasters holding a shield passively while casting.
- **Mixed — PF2e's Raise a Shield + Shield Block (`[read]`, `r/Pathfinder2e`):**
  - *Loved:* Making a shield **active** (spending an action to raise it, using a Reaction to absorb damage with Hardness) makes sword-and-board feel genuinely tactical rather than a static number.
  - *Hated — The Sturdy Shield & Repair tax:* Because non-Sturdy shields shatter in 1–2 hits at mid/high levels, every shield-blocker felt forced to buy a **Sturdy Shield** (ignoring all cool magic shields!) and forced to invest in the Crafting skill just to repair their shield after every fight. Paizo had to patch this in the Remaster with **Reinforcing Runes** (`[read]`), which still act as a mandatory durability tax.
- **Loved — Active, readable defensive plays:**
  - **Reaction Blocks & Ally Protection** (stopping a big blow or shielding an adjacent teammate).
  - **Sacrificial drama ("Shields Shall Be Splintered")** `[lead]`: Trollsmyth's famous OSR rule — sacrifice your shield to negate all damage from one lethal blow. Simple, dramatic, zero per-hit HP math.
  - **Shields as distinct off-hand tools** (Daggerheart `[read]` puts Shields on the **Secondary Weapon** table alongside daggers and whips: *Buckler* deflects/parries, *Round Shield* adds Armor Score, *Tower Shield* adds bigger barrier at `-1 Evasion`, *Spiked Shield* adds offense + defense, *Braveshield* shelters adjacent allies).

---

## 2. The four mechanical paradigms for armor (and where 2d12 sits)

| Paradigm | Games | How it works | Strengths | Weaknesses / 2d12 fit |
|---|---|---|---|---|
| **1. Avoidance (AC / AD)** | D&D, PF2e `[read]`, 13th Age `[memory]`, **2d12** | Raises the target number to hit (`11 + Armor value`) | Fastest table resolution; on `2d12` tiered rolls, `+1 AD` shrinks *both* hit rate and Tier 3/Crit rate cleanly | Static by itself; `+1 AD` is huge (~14% less Health taken in 2d12), leaving almost zero room for vertical `+1/+2` gear creep |
| **2. Damage Reduction (DR)** | Mythras/BRP `[memory]`, Dragonbane `[lead]`, Forbidden Lands `[lead]` | Subtract Armor value from every incoming hit | High verisimilitude ("plate stops daggers, maces crush plate") | **Breaks multi-hit vs. big-hit parity:** flat DR crushes 1 AP multi-hit attacks (Archer/Daggers) while barely touching 2 AP heavy swings (Maul/Longsword). Also creates a DR-vs-damage arms race |
| **3. Extra Health / Stamina + Stability** | **Draw Steel Kits** `[read]` | Armor adds Stamina (+6/+9/+12 per echelon) and Stability (forced-movement resistance); no AC stat | Zero miss-fests; scales cleanly; pairs naturally with horizontal armor powers | Doesn't match 2d12's existing AD (11–14) architecture — **but** Draw Steel's **Stability** idea maps directly onto 2d12's existing **Steadiness** stat! |
| **4. Ablative Slots + Thresholds** | **Daggerheart** `[read]` | Armor sets Major/Severe damage thresholds + expendable **Armor Slots**; mark a slot to downgrade hit severity by 1 step; repaired on Rest | Every hit is an active resource choice (*"spend a slot now or save it?"*); allows rich features tied to spending/clearing slots | Extra resource track to manage and repair; some players report Evasion feels better than spending limited Armor Slots `[lead, r/daggerheart]` |
| **5. Hybrid (AD + Narrow Trait/Resist)** | **PF2e Armor Groups + Traits** `[read]`, **2d12 draft** | Base AD stays tight and fast, while each armor's **construction/material** grants 1 clean property (narrow Resist, Crit dampening, Steadiness, Mobility, Ward, or active Reaction) | Keeps fast single-roll combat while making Gambeson, Leather, Mail, and Plate feel tactically distinct | Requires keeping each armor to **1–2 crisp lines** so defenders don't have a 5-check defense sheet |

---

## 3. Should 2d12 even use "Light / Medium / Heavy" — or switch to Material / Construction?

This is one of the sharpest insights for 2d12 specifically.

### Why "Light / Medium / Heavy" exists in D&D / PF2e — and why it behaves differently in 2d12
In D&D 5e and Pathfinder 2e, Light, Medium, and Heavy armor exist primarily to sort characters by **Dexterity cap** (`Light = unlimited Dex`, `Medium = max +2 Dex`, `Heavy = 0 Dex`). Because Dexterity contributes to AC, a high-Dex Rogue in Light armor reaches roughly the same AC as a Fighter in Medium armor.

**In 2d12 (`book/rules-src/15-gear.md`, `02-turns.md`), Attributes do NOT add to Armor Defense:**
- `AD = 11 + Armor value` (Unarmored `11`, Light `12`, Medium `13`, Heavy `14`).
- Therefore, **Light / Medium / Heavy in 2d12 is NOT a Dex-cap tradeoff — it is a straight vertical staircase (`12 → 13 → 14`) gated by class Armor Training** (plus the Surge casting tax in `book/decided.md`: Medium = `-1` starting Surge; Heavy = `-1` starting Surge and `+1` Surge on first spell each turn).

**Consequence:** If 2d12 keeps Light / Medium / Heavy as pure `12 / 13 / 14`:
- Any non-caster with Heavy Training will *always* wear Heavy unless Heavy carries a real physical trade-off (Speed, Stealth, Load) **or** lighter armors offer **positive capabilities** Heavy cannot (mobility, Ward Defense, Dodge/Stealth, cheaper magic).
- And **Medium armor (`AD 13`)** immediately hits the classic "ugly middle child" problem unless it owns a clear niche (e.g., *full mobility with real metal protection*, *battle-mage sweet spot* with no per-turn Surge tax, or *most adaptable/customizable*).

### Three taxonomy options compared

| Taxonomy | Examples | How it works | Pros | Cons |
|---|---|---|---|---|
| **A. Keep Light / Medium / Heavy as *Training & AD bands*, differentiate inside by Construction/Material** | PF2e `[read]` (Light/Med/Heavy + Armor Groups: Cloth, Leather, Chain, Composite, Plate) | Training (`Light 12 / Med 13 / Heavy 14`) stays clean for classes and Surge rules; inside each band, **2–3 named armors** differ by construction (e.g. Light = *Gambeson* vs *Leather*; Medium = *Mail Hauberk* vs *Brigandine/Scale* vs *Monster Hide*; Heavy = *Half-Plate* vs *Full Plate*) | Keeps 2d12's clean `11/12/13/14` class Training math & Surge rules intact; gives *within-category choice* (which players prefer over category-switching!) | Still needs clear identities for why a Heavy-trained PC might wear Medium (e.g., stealth mission, Speed, Surge casting) |
| **B. Drop Light / Medium / Heavy entirely; use Named Constructions on a clean trade-off curve** | **Daggerheart** `[read]` (*Robes, Gambeson, Brigandine, Leather, Scale, Chainmail, Banded, Full Plate* — zero Light/Med/Heavy labels!) | No abstract weight buckets; every armor simply lists its `AD`, `Material/Tags` (e.g. *Metal*, *Noisy*, *Bulky*), and `Trait`. Class training gates either max `AD` (up to 12/13/14) or tags (*Soft / Linked / Plate*) | Eliminates the artificial "Medium armor" box completely; feels grounded and historical; no filler rows | Class rules and Surge rules still need a clean shorthand (e.g., *Metal* vs *Heavy/Bulky* tag) so every spell/talent doesn't list 6 armor names |
| **C. Material Families as the core axis (Cloth / Hide / Mail / Plate)** | Historical / HEMA-inspired `[lead]` | Four intuitive material families with distinct mechanical signatures rather than generic weight labels: **Cloth/Gambeson** (Unarmored/AD 12, quiet, cushions Blunt, caster-friendly), **Hide/Leather** (AD 12–13, agile/weatherproof, crafts from **Hides** loot lots!), **Mail/Scale** (AD 13, flexible, guards against Slash/Crits, Noisy/Metal), **Plate** (AD 14, peak AD + Steadiness, Bulky/Noisy/Metal) | Immediately evocative; ties straight into 2d12's **Hides / Salvage / Arcana** crafting loop; zero fake "studded leather" | Only 4 families unless split into light/heavy variants (e.g. Mail Shirt vs Hauberk, Breastplate vs Full Plate) |

### What makes Light / Medium / Heavy (or Material families) feel genuinely distinct — without breaking tight math
Notice how **Daggerheart** `[read]`, **Draw Steel** `[read]`, and **PF2e** `[read]` give lighter armors **positive identities**, not just *"less AC, fewer penalties"*:
- **Unarmored / Robes (`AD 11`):** Zero Surge penalty, zero Load, full Speed & Stealth; natural home for **Ward Defense** charms/robes (like Daggerheart's *Mage Robes* or Draw Steel's *"Clothing as Armor Treasures"* `[read]`, ensuring unarmored monks/mages aren't locked out of armor enchantments!).
- **Light — Gambeson / Leather (`AD 12`):** Positive mobility/utility traits rather than "just worse armor" — e.g., Daggerheart's *Gambeson* gives **Flexible (`+1 Evasion`)**; *Leather/Hide* pairs with stealth, weather/wilderness, or **Blunt cushioning** (Gambeson historically excels against blunt/concussive blows, not leather!).
- **Medium — Mail / Scale / Brigandine (`AD 13`):** The **all-rounder / skirmisher / battle-mage** band: real metal protection with **no Speed penalty** and **no per-turn Surge casting tax** (`decided.md` already does this!). Construction choice inside Medium: *Chain/Mail* (Flexible, Crit-dampening, Noisy) vs. *Brigandine / Breastplate* (quiet/balanced, Pierce/Slash protection) vs. *Monster Hide* (elemental/natural Resist!).
- **Heavy — Half-Plate / Full Plate (`AD 14`):** Peak AD (`14`) + **Steadiness / anti-forced-movement** (mirroring Draw Steel's Heavy Kit Stability `[read]` and PF2e's *Bulwark* `[read]`) + Slash/Pierce deflection — balanced by **Load, Noisy, Bulky (`-1 Speed` unless mitigated), and Heavy Surge tax**.

---

## 4. How armor progression should work — and why 2d12 probably does NOT want a parallel "Armor Mastery" track

Lucas asked specifically: *"how progression should work, how to make it fit 2d12 since we already have weapon mastery, magic 'mastery'..."*

### 4.1 Why almost no tactical RPG gives Armor a parallel Mastery ladder
Research across PF2e, Draw Steel, Daggerheart, 13th Age, 4e, and community attempts at "5e Armor Masteries" (`r/onednd` `[lead]`) reveals three structural reasons:
1. **Weapons are active choices; armor is a static wearing state.** In 2d12, Weapon Mastery works because you actively choose *which weapon* to make `[Strike]` Actions with in combat, unlocking distinct **Weapon Techniques** (Arming Sword *Seizing Cut* vs. Longsword *Thwart Cut*) and graduating from Basic → Advanced → Exotic. Almost nobody switches suits of armor mid-fight. Tracking a separate `0–60` "Plate Mastery" XP counter just becomes a passive fights-fought clock with extra bookkeeping and zero tactical choice.
2. **Tight-math ceiling.** Weapons can scale vertically at Stage 2 (`2[W]`) and horizontally via new active Techniques. Armor sits directly on `AD`, where even `+1` cuts party damage taken by **~14%**. As one `r/onednd` designer who tried building Armor Masteries admitted `[lead]`: *"there's not a whole lot to work with. Increasing AC is the obvious answer but that's awfully powerful under bounded accuracy."*
3. **Progression-budget saturation.** 2d12 already tracks **Class Levels + Stages + Weapon Mastery (10/20/30/45/60) + Spell Mastery + Combat/Skill/Stage Talents + Bind items**. Adding a fourth separate mastery track for Armor risks overloading the character sheet for low payoff.

### 4.2 Where Armor Progression *does* fit cleanly (four proven layers)

Instead of an "Armor Mastery" counter, published tight-math games progress armor across **four channels that 2d12 already has**:

| Progression channel | How other games do it | How it fits 2d12 (zero new subsystems) |
|---|---|---|
| **1. Talents (Character-owned mastery)** | 13th Age Fighter's *Heavy Warrior* (1/battle halve a hit) `[lead]`; PF2e *Armor Specialist* feat `[read]`; Daggerheart *Bare Bones* / *Unyielding Armor* `[read]` | **Talents** (Heavy Armor, Light/Skirmisher, Unarmored Defense, Shield Master) are where a character *trains* to do active things with their armor: e.g., negate Bulky `-1 Speed`, unlock an armor's **Specialization** (Resist / Crit-dampening), Brace to halve a Critical 1/Encounter, or gain an Unarmored AD path. |
| **2. Special Materials & Monster Hides (Mundane → Masterwork by Stage)** | PF2e Precious Materials `[read]`; Daggerheart Tier 2–4 named armors (*Dragonscale, Spidersilk, Trollhide, Irontree*) `[read]` | Mundane armor stays in one price band (`10/25/40 SC`) with fixed `AD 12/13/14`. At Stage 1–2, crafting with **Loot Lots (`Hides`, `Salvage`, `Arcana`)** upgrades *what your armor is made of* — e.g. **Drake-Hide** (Resist Fire), **Mithral/Dawnsilver Mail** (drops Noisy/Bulky), **Cold-Iron Plate** (anti-Fey/Profane), **Spidersilk Gambeson** (ignores Grab/Web). Zero AD creep, huge progression feel! |
| **3. Armor Enchantments / Trophy Imbuing (Bind slot)** | **Draw Steel *Imbue Armor* & Leveled Armor Treasures** `[read]` (*Disguise, Nettlebloom, Phasing, Tempest, Iridescent, Spiny Turtle, Shrouded Memory, Dragon Soul*); **PF2e Armor Property Runes** `[read]` (*Slick, Shadow, Raiment, Ready, Swallow-Spike, Gliding, Advancing, Magnetizing, Fortification*) | **1 permanent Enchantment per suit** (uses 1 Bind slot + Upkeep, transferable via `items-economy.md`'s 10%/25% transfer rule). Because it grants **horizontal options/Reactions/utility** rather than `+1 AD`, armor gets cooler every Stage without touching Bestiary math! (Also allow **Clothing / Robes** to hold Armor Enchantments, as Draw Steel `[read]` and PF2e *Explorer's Clothing* `[read]` do, so unarmored PCs aren't left out.) |
| **4. Shields Inside Weapon Mastery!** | **Daggerheart** puts Shields on the **Secondary Weapon** table `[read]`; `r/onednd` top take: *"shields should be on the weapon table, not the armor table"* `[lead]` | **Because shields occupy an off-hand and are used actively**, a Shield can be its own **Weapon Group** (or have a **Shield Technique** unlocked via Mastery 10, just like weapons!). You earn Mastery with your Buckler, Round Shield, or Tower Shield by fighting with it — unlocking active moves (Shield Bash, Bulwark Cover, Riposte Deflect) using the **exact Mastery engine 2d12 already built**! |

---

## 5. Deep dive on Shields: five ways to make shields feel tactical (not a passive AC tax)

In 2d12, holding a shield carries a **real, built-in opportunity cost**:
- It takes your **off-hand**, so you give up **Two-Handed damage** (Longsword hits ~50% harder than Arming Sword), **Strung weapons** (bows), **dual-wielding**, and a **free hand** (needed for Handle Actions and Arming Sword's *Seizing Cut*!).
- Because that hand cost is real, a shield needs to feel genuinely rewarding — *without* handing out passive `+2 AD` (which would break 2d12's tight math by ~25%!).

### Five published shield models compared

| Shield model | Games | Mechanic | Pros | Risks / Watch-outs |
|---|---|---|---|---|
| **1. Passive AC Bonus** | D&D 5e `[memory]` (`+2 AC`) | Always-on defense bonus while held | Zero bookkeeping | **Math-breaker in 2d12** (`+1 AD` = ~14% Health-loss swing; `+2 AD` = ~25%). Zero tactical play; encourages casters to strap on shields passively |
| **2. Action to Raise + Reaction Block + Shield HP** | **PF2e** `[read]` (`1 Action Raise` → `+2 AC`; `Reaction Block` → reduce by Hardness, shield takes overflow HP) | Active on-turn choice + reactive damage soak + shield breakage | Very tactical; distinct shield types (Buckler +1, Steel +2, Tower +2/+4 Take Cover) | **Two PF2e pain points `[lead]`:** (a) spending 1/3 of every turn Raising can feel rote; (b) Shield HP/Hardness created the mandatory **Sturdy Shield / Reinforcing Rune** + Crafting-repair tax |
| **3. Reaction Block (no Shield HP spreadsheet)** | **2d12's own *Bulwark Shield* draft** (`items-economy.md` L87) | `1R, Round`: when a Strike hits you (or adjacent ally), reduce damage (or gain Guard / downgrade Tier 3 → Tier 2) | **Best fit for tight math:** zero passive AD creep; competes fairly for your **1 Reaction** and **off-hand**; zero durability bookkeeping | If a class already has a strong Hallmark Reaction (like Paladin), shield-block needs either a clean synergy (e.g., *also* works on an ally, or passive small perk + active Reaction) so it doesn't feel wasted |
| **4. Sacrificial "Shields Shall Be Splintered"** | **OSR / Trollsmyth** `[lead]` | When hit by a devastating Strike (or Critical), **break/Dull your shield** to negate all damage (or halve it + negate Critical/riders) | Dramatic, cinematic, zero HP math, makes carrying a spare or paying for **Repair** meaningful — pairs naturally with 2d12's **Dulled / Repair** rule! | Needs careful balance with magic/Bound shields (a magic shield shouldn't be *destroyed* permanently — becoming **Dulled until Repaired** solves that cleanly!) |
| **5. Shield as Off-Hand Weapon / Cover / Stance** | **Daggerheart** `[read]` (*Secondary Weapons*), **Draw Steel** `[read]` (*Sword and Board*, *Telekinetic Bulwark*) | Shield has its own active maneuver/Technique: *Buckler* deflects/parries, *Round/Kite* blocks & bashes/shoves, *Tower/Pavise* grants mobile Cover & holds ground | Differentiates shield types cleanly; rewards fighters who want to *do* things with their shield, not just hold it | Keep each shield to **1 clear job** so holding a shield doesn't add three new subsystems |

### Differentiating three classic shield types (without breaking AD)
Notice how cleanly **Buckler / Round (Heater) / Tower (Pavise)** map onto distinct tactical niches without handing out passive `+2 AD`:
- **Buckler (Light / Center-grip):** Leaves your hand usable for light Handle Actions (or quick Release/Regrip, like PF2e Buckler `[read]`). Active niche: **Deflect / Parry** against a single Melee Strike (e.g., `1R`: impose a Bane, or downgrade a Melee Tier 3 → Tier 2 / reduce melee damage). Appeals to duelists and skirmishers.
- **Heater / Round / Kite Shield (Standard):** Takes the off-hand. Active niche: **Block Reaction** (`1R`: reduce Strike damage by a flat/Stage value, or grant Guard before damage) + **Shield Bash / Shove** offense (fits Weapon Mastery!). Optionally allows **Splinter / Dull the Shield** once to eat a Critical or lethal blow.
- **Tower Shield / Pavise (Heavy / Bulky):** Takes the off-hand + `-1 Speed` (Bulky). Active niche: **Mobile Cover** — counts as **Cover** (for you vs. Ranged/Area, or for an adjacent ally behind you, like PF2e's Tower Shield `[read]`), plus strong **Steadiness** / anti-Push, or a `1 AP` **Brace / Plant** stance.

---

## 6. Tight-math-safe Armor Enchantment levers (quick catalog from `[read]` sources)

Just like weapons (`weapon-improvements.md`), the best armor enchantments in **Draw Steel** `[read]`, **PF2e** `[read]`, and **Daggerheart** `[read]` almost never touch AC/AD. They pull **seven safe levers**:

1. **Resist / Immunity by damage subtype or Ward Defense (`+1 WD`):** PF2e *Energy-Resistant*, *Quenching* (fire/acid); Draw Steel *Damage Immunity*, *Magic Resistance*; Daggerheart *Warded*; 2d12's existing *Warded Mantle* (`+1 WD`, ~0.4 DE/fight).
2. **Condition / Crit / Grab Defense:** PF2e *Slick* (escape Grab), *Stanching* (Bleed), *Fortification* (flat check to negate Crits), *Immovable* (anti-forced movement); Draw Steel *Nettlebloom* (grabbers become Weakened), *Unbending* (immune to forced movement); Daggerheart *Quick-Striding* (immune to Restrained).
3. **Reactive Counterplay (spends your `1R` Reaction):** Draw Steel *Kuran'zoi Prismscale* (Reaction: Slow attacker), *Shrouded Memory* (Reaction on hit: teleport + leave dying illusion), *Tempest* (lightning push back when hit); PF2e *Swallow-Spike* (thorns vs. grab/swallow); Daggerheart *Burning* / *Shifting*.
4. **Mobility & Positioning:** PF2e *Gliding*, *Advancing* (step after killing a foe), *Winged*; Draw Steel *Phasing* (move through 1 square of solid matter), *Swift* (`+1 Speed`), *Levitating*; Daggerheart *Wall-Crawling*, *Ghostwalker*.
5. **Defensive Utility / Action Economy:** PF2e *Ready* (instant donning!), *Portable* (shrink armor into a token), *Aim-Aiding* (allies shoot past you without cover); Draw Steel *Spiny Turtle* (Action: expand metal wall behind you for Cover!).
6. **Stealth, Social & Disguise (Zero combat-math creep!):** PF2e *Shadow* (stealth), *Raiment* (look like fine clothes), *Convincing*; Draw Steel *Disguise* (shift armor into any outfit while keeping protection), *Awe* (Charming or Threatening); Daggerheart *Quiet*, *Truthseeking* (glows when someone lies nearby), *Gilded*.
7. **Emergency Survival (1/Encounter or 1/Day):** Draw Steel *Iridescent* (1/Victory Reaction: force an attack roll down to Tier 2), *Second Wind* (Reaction when Bloodied: spend a Recovery/Rally Point); Daggerheart *Impenetrable* (1/Rest survive a Down blow).

---

## 7. How it applies to 2d12 (observations — Lucas decides)

### 7.1 The three big structural takeaways for 2d12
1. **Your no-Dex-to-AD rule changes the whole armor game — in a *good* way.** Because 2d12 doesn't tie AD to an Attribute, you aren't trapped in D&D's Dex-cap spreadsheet. You can either keep `Light (12) / Medium (13) / Heavy (14)` as **class Training + Surge bands** with **2–3 distinct constructions inside each**, OR drop the Light/Medium/Heavy labels entirely and define **5–6 iconic armors** (*Robes/Unarmored, Gambeson, Hide/Leather, Mail, Brigandine/Half-Plate, Full Plate*) directly by their `AD`, `Material`, `Trait`, and `Drawback`.
2. **Don't add a separate "Armor Mastery" XP track — put armor growth in three places you already built:**
   - **Talents** for character mastery of armor (Unarmored tree, Heavy Juggernaut ignoring Bulky, Armor Specialization unlock, Shield Master).
   - **Special Materials / Monster Hides** for Stage 1–2 mundane crafting upgrades (`Hides` / `Salvage` Loot Lots).
   - **1 Enchantment per suit (Bind slot + Upkeep + 10%/25% transfer)** for cool horizontal/reactive/utility powers — explicitly allowing **Unarmored clothing/robes** to hold an Armor Enchantment so non-armored characters share the same magic-gear space.
3. **Shields fit 2d12 best as *active off-hand gear* (Reaction Block + Cover + optional Weapon/Shield Mastery), NOT passive `+AD`:**
   - Passive `+1/+2 AD` on a shield breaks 2d12's tight math (~14%–25% damage-taken swing) and invites casters to strap shields on.
   - An **active Reaction Block** (like your existing *Bulwark Shield* draft in `items-economy.md`) + **distinct shield roles** (Buckler = Melee Parry/Free-hand friendly; Round/Heater = Block + Bash; Tower = Mobile Cover + Steadiness) + optional **"Splinter / Dull the Shield"** emergency block (reusing your `Dulled / Repair` rule!) makes shields thrilling with **zero AD creep** and **zero PF2e Shield-HP bookkeeping**.
   - **Important interaction to watch in 2d12:** Check how a Shield's Block Reaction interacts with **Paladin's Hallmark Reaction** (which already wants the `1R` every round) and **Arming Sword's *Seizing Cut*** (which explicitly uses the free off-hand!). If a Paladin uses a shield *and* has a Hallmark Reaction, either (a) shields also provide a non-Reaction benefit (e.g. Cover vs. Ranged, +1 Steadiness, a 1 AP *Raise/Brace* Guard action, or a Shield Technique like *Shield Bash*), or (b) Shield Block is a *situational alternative* Reaction (e.g. works against Strikes hitting *you*, while Paladin's Hallmark protects *allies*).

### 7.2 Quick design check on `book/rules-src/15-gear.md`'s Armor TBD box
Your existing TBD note in `15-gear.md` L222 already lists *"Resist by damage subtype (padded, mail, plate), drawbacks (Bulky -1 Speed, Noisy for stealth), Warded (+1 WD), shields (a Block Reaction), and an unarmored Talent tree."* Based on the research, two small cautions on that draft:
- **Caution 1 — Avoid flat universal DR on armor:** Keep damage-subtype **Resist** narrow and calibrated (remembering that flat Resist hits 1 AP multi-hitters like Archers much harder than 2 AP heavy hitters — or consider **Crit/Tier 3 dampening**, like PF2e's Chain group, which hurts heavy spikes without shutting down multi-hitters!).
- **Caution 2 — Give Light and Medium positive traits, not just "no penalties":** Since Heavy already gets `AD 14`, giving Light/Medium something *proactive* (e.g. Gambeson = Quiet + cushions Blunt/Crits; Mail = Flexible + Slash/Crit dampening + no per-turn Surge tax; Brigandine = balanced AD 13 with no Noisy/Bulky) ensures they feel like **real choices**, not stepping stones to Plate.

---

## 8. Sources

- `[read]` Pathfinder 2e (Archives of Nethys), *Armor*: https://2e.aonprd.com/Rules.aspx?ID=2166
- `[read]` Pathfinder 2e (Archives of Nethys), *Armor Groups & Armor Specialization Effects*: https://2e.aonprd.com/ArmorGroups.aspx
- `[read]` Pathfinder 2e (Archives of Nethys), *Armor Property Runes*: https://2e.aonprd.com/Equipment.aspx?Category=23&Subcategory=26
- `[read]` Pathfinder 2e (Archives of Nethys), *Shields*: https://2e.aonprd.com/Rules.aspx?ID=2180
- `[read]` Pathfinder 2e (Archives of Nethys), *Shield Rune (Reinforcing Runes)*: https://2e.aonprd.com/Rules.aspx?ID=3173
- `[read]` Draw Steel (MCDM, printing 1.01b), *Shining Armor* Kit: https://steelcompendium.io/v2/Browse/kit/shining-armor/
- `[read]` Draw Steel (MCDM, printing 1.01b), *Imbue Treasure / Imbue Armor*: https://steelcompendium.io/v2/Browse/project/imbue-treasure/
- `[lead]` Draw Steel (MCDM, printing 1.01b), *Leveled Armor & Shield Treasures* and *Kits* overview (search extracts): https://steelcompendium.io/v2/Browse/rule/treasure/leveled-treasure/ and https://steelcompendium.io/v2/Browse/kit/
- `[read]` Daggerheart SRD 2.0, *Armor*: https://daggerheartsrd.com/rules/armor/
- `[read]` Daggerheart SRD 2.0, *Armor Tables*: https://daggerheartsrd.com/rules/armor-tables/
- `[read]` Daggerheart SRD 2.0, *Secondary Weapon Tables* (Shields): https://daggerheartsrd.com/rules/secondary-weapon-tables/
- `[lead]` Trollsmyth, *Shields Shall Be Splintered!* (2008-05-06 — blog blocked automated fetch; rule verified via OSR blog summaries including THAC0 Blog): http://trollsmyth.blogspot.com/2008/05/shields-shall-be-splintered.html
- `[lead]` 13th Age SRD, Fighter / Commander armor and shield features (search extracts): https://www.13thagesrd.com/classes/fighter/
- `[lead]` Community design & reception threads (Reddit blocks automated readers): `r/RPGdesign` ("Designing 'Interesting' Armor", "Looking for advantage for medium armor", "What are your favorite shield mechanics?", "Should armor reduce damage or reduce hit-chance?"), `r/Pathfinder2e` (Sturdy Shield vs. Reinforcing Rune, Armor Specialization reception), `r/daggerheart` (Armor Slots vs. Evasion feedback), `r/onednd` (Armor/Shield Masteries), `r/dndnext` (historical Padded/Gambeson/Brigandine critiques).
- `[memory]` D&D 5e armor table & static `+2 AC` shield rules; Mythras/BRP hit-location DR; 13th Age class-fixed base AC.
