# Weapon improvements in tight-math systems: runes, enchantments, mods, oils, and heirlooms

**Date:** 2026-11-24. **Asked by Lucas:** *"Another extensive research is weapon improvements. Games use runes you attach on it, enchantments etc. I don't know where they fit in 2d12, specially with such a tight math. We need an extensive research about it."*

**What was read, and how far to trust it.**
- `[read]` Primary rules text opened directly: **Pathfinder 2e** (*Weapon & Armor Runes* and *Transferring Runes*, *Weapon Property Runes*, *Talismans*, *Spellhearts*, *Automatic Bonus Progression*, *Precious Materials* — Archives of Nethys); **Draw Steel** (MCDM printing 1.01b, *Leveled Treasures / Weapon Treasures*, *"Carry Three Safely"*, and *Imbue Treasure / Imbue Weapon* downtime project — Steel Compendium); **Daggerheart SRD** (*Weapons*).
- `[checked]` Essays read on their pages: **The Alexandrian** (*Putting the "Magic" in Magic Items*).
- `[lead]` / `[quoted]` / `[memory]` Search snippets, forums blocking automated readers (`r/Pathfinder2e`, `r/swrpg`, `r/LancerRPG`), and secondary summaries: **13th Age** (1e/2e Runes, Quirks, Oils cut in 2e via SRD & 2e changes PDF snippet), **D&D 3.5 *Magic Item Compendium* Augment Crystals** `[memory]`, **Genesys / Star Wars FFG Hard Points & Attachments** `[lead]`, **Lancer Weapon Mods** `[lead]`, **Fabula Ultima Rare/Custom Weapons** `[lead]`, **Worlds Without Number Mods** `[memory]`, **Earthdawn Thread Items / Exalted Evocations / 5e Vestiges / 4e Whetstones** `[memory]`. Check any `[lead]` or `[memory]` entry before quoting it publicly.

**Already in the project:** `weapons-bows-light.md` (weapon traits/masteries), `mastery-progression.md` (weapon mastery by use), `pillars-of-eternity.md` (weapon modals, Soulbound weapons), `progression-feel.md` (horizontal vs. vertical growth).

**Other games' rules and opinions, never 2d12's. Nothing here is decided.**

---

## 1. Why traditional weapon upgrades break tight-math games (and 2d12's exact numbers)

Traditional RPG weapon upgrades stack **vertical numbers** (`+1/+2/+3` to hit, `+1d6` elemental damage per swing, extra weapon dice). In a tight-math system, those numbers do not just add "a little spice" — they bend the core math curve:

- **2d12's own measured numbers (`book/items-economy.md`, 2,000 simulated fights):**
  - Giving every PC a **`+1` weapon** cuts party Health lost per fight by **~14%** (normal 50→43, hard 128→109, deadly 114→99).
  - `+1` weapon **and** `+1` armor together cut Health lost by **~25%** — roughly an entire encounter difficulty step.
  - `+2` weapon and `+2` armor cut Health lost nearly **in half** (50→27).
- **Why `+1` accuracy is doubly explosive on `2d12`:** A `+1` to hit does not just turn misses into Tier 2 hits; it simultaneously pushes Tier 2 hits into **Tier 3** (higher damage *plus* Tier 3 riders) and widens the `DC + 20` Critical band, on a system where a character's total Modifier only moves from `+2` at Level 1 to `+4` at Level 15.
- **Why flat `+damage` or `+1d6` per hit breaks weapon & class parity:**
  - Any per-hit bonus disproportionately rewards **1 AP / multi-hit builds** (fast light weapons, Archer flurries) over **2 AP single-strike builds** (two-handers, heavy hits).
  - In 2d12, base weapons intentionally use **flat damage + at most one small exploding die (`1d4!`–`1d8!`)** and scale via `2[W]` at high Mastery / Stage 2 (`book/rules-src/15-gear.md`). Adding extra dice per hit bloats dice math, muddies exploding-die expectations, and stacks awkwardly with `2[W]`.
- **The mandatory-treadmill trap:** The moment a game allows stackable vertical weapon bonuses, designers either (a) bake them into monster math (Pathfinder 2e's Fundamental Runes — creating a mandatory shopping tax), or (b) leave monster math without them (turning magic weapons into encounter-breakers that invalidate balance).

---

## 2. Survey of weapon improvement models across games

| Model | Games | How it works | Math impact | Strengths | Documented weaknesses / reception |
|---|---|---|---|---|---|
| **Fundamental + Property Runes** | **Pathfinder 2e** `[read]` | Potency (`+1/+2/+3` hit, also sets slot count) + Striking (extra dice) + up to 3 Property Runes; transferable in 1 day for 10% cost (free from runestones) | **Heavy vertical** (baked into monsters) + mixed horizontal | Solves heirloom abandonment via transfer; huge catalog (83 property runes) | Mandatory math tax; **damage runes (`Flaming`/`Frost`/`Shock` +1d6) crowd out utility runes** (`Returning`, `Shifting`, `Ghost Touch`, `Rooting`, `Extending`, `Crushing`), pushing tables to homebrew separate "damage vs. utility" slots `[lead, r/Pathfinder2e]` |
| **Automatic Bonus Progression (ABP)** | **Pathfinder 2e variant** `[read]` | Strips fundamental runes; bakes `+1/+2/+3` & dice into PC level so weapons only hold special abilities | Neutral (built into PCs) | Directly targets *"items give options, not numbers"* | **4 documented pitfalls `[lead, r/Pathfinder2e]`:** (1) "golf bag of weapons" (every weapon auto-scales free); (2) breaks item-bonus classes (Alchemist); (3) loot vacuum / favors martials; (4) Paizo notes removing *all* runes drops DPR because mid/high-level math partly assumes +1d6 damage runes |
| **Leveled Weapons & Trophy Imbuing** | **Draw Steel** `[read]` | **Zero accuracy bonuses ever.** Gentle flat damage (+1/+2/+3 at L1/L5/L9), real upgrade is **horizontal tactical powers** at L1/L5/L9. Can also *Imbue* a mundane weapon 3 times using downtime + monster trophies. Hard cap: *"Carry Three Safely"* | **Very tight** (no hit creep; tiny staged damage bump) | Keeps heirloom weapons via imbuing; monster loot directly fuels weapon upgrades; exciting horizontal tricks (*Hurling*, *Wingbane*, *Windcutting*, *Displacer*, *Metamorphic*, *Silencing*) | Needs clear cap so players don't stack 10 triggers; downtime crafting pace depends on campaign rhythm |
| **1-Slot Consumable Weapon Charms** | **PF2e Talismans** `[read]` | Single-use charm affixed ahead of time (1 per weapon; 10-min affix), triggered as **Free Action / Reaction** (*"martials' answer to scrolls"*) | **Zero permanent creep** | Great action economy; lets martials hold a situational trick without permanent power creep | **Chronic disuse `[lead, r/Pathfinder2e]`:** players dump them in the sell pile because 1-use items feel expensive vs. permanent gear, 10-min re-affix limits to 1/fight, and players hoard them for the "perfect moment" |
| **1-Slot Permanent Spell-Attachments** | **PF2e Spellhearts** `[read]` | Permanent charm in the talisman slot (1 per weapon); grants a cantrip/spell **plus a conditional weapon rider** after casting it | **Tight / conditional** | Much better received than Talismans `[lead]` — permanent so players actually use them; creates tactical cast→strike sequencing | Competes with Talismans (usually killing Talismans); narrows to gish/caster flavor unless generalized |
| **Swappable Situational Sockets** | **D&D 3.5 MIC Augment Crystals** `[memory]` | 1 swappable crystal per weapon (Least/Lesser/Greater), swapped out of combat; situational powers (*Truedeath* vs. undead + ghost touch, *Demolition* vs. constructs, *Return*) | **Tight / situational** | Widely praised for solving the "carry 5 backup weapons" problem and rewarding scouting without raising baseline DPR | Requires careful policing so no crystal becomes an unconditional "always-on best damage" pick |
| **1-Battle Consumable Runes + Quirks** | **13th Age** `[lead]` | True magic weapons have a **Quirk** + Chakra slot + Recharge/Escalation power; **Runes** are 1-battle consumables adding a temporary bonus + random magical trait. **13th Age 2e cut plain numeric Oils and kept Runes** `[quoted/lead]` | Moderate (13A assumes +1/+2/+3 by tier, but 1-battle Runes are temporary) | Quirks make weapons memorable; 1-battle Runes create fun single-fight spikes without permanent bloat; cutting plain numeric Oils shows players prefer *flavorful temporary powers* over "+1 for a fight" | Random rune properties can feel uneven in ultra-tactical play |
| **Hard Points & Attachments** | **Genesys / Star Wars FFG** `[lead]` | Each weapon has fixed Hard Points (e.g., 2–4 HP); attachments spend HP to add qualities (*Pierce*, *Vicious*, *Accurate*, *Concealed*) and can be modded further | Medium–High (can stack vertical qualities) | Great tinkerer/blacksmith fantasy; differentiates weapons by upgrade headroom | Known "trash vs. OP" balance spread and illogical stacking (*"two scopes"*) unless gated by named slots `[lead, r/swrpg]` |
| **Budgeted Trade-Off Mods** | **Lancer** `[lead]` | Weapon Mods cost **System Points (SP)** from the mech's shared loadout budget; many use **Limited** charges or explicit **trade-offs** (e.g. convert to Burn + gain Inaccurate; halve damage to inflict Impaired + Slowed) | **Very tight** | Zero free power — every mod competes with other gear and/or carries a mechanical trade-off | Higher cognitive load when tracking several Limited mod charges across multiple weapons |
| **Strict 1-Quality Cap** | **Fabula Ultima** `[lead]` | Rare / custom weapons carry **at most one Quality** (elemental conversion, status rider, multi-target, conditional effect) | **Tight** | Completely prevents "Build-a-Bear" trigger stacking; weapon stays readable in one line | Limits tinkerers who want layered upgrades on one signature blade |
| **Precious Materials** | **PF2e** `[read]`, D&D `[memory]` | Silver, Cold Iron, Adamantine, Dawnsilver, Duskwood — exploit monster Weaknesses/Resistances or alter bulk/durability | **Zero baseline creep** | Rewards preparation and monster lore without touching baseline hit/damage math | **PF2e cautionary flaw `[read]`:** gating materials behind Low/Standard/High grades artificially prices special materials out of mid/high play |
| **Maintenance-Capped Mods** | **Worlds Without Number** `[memory]` | Crafted weapon mods capped by crafter's Maintenance score and require ongoing upkeep | **Tight** | Directly prevents hoarding and pairs naturally with an Upkeep economy | Creates party tax if only one crafter holds the Maintenance budget |
| **Tiered Weapons + 1 Feature** | **Daggerheart** `[read]` | Damage scales by PC Proficiency (dice count) + Weapon Tier (1–4) + a single **Feature** (horizontal trait/rule); no +1/+2/+3 rune treadmill | **Tight** | Cleanest sheet readability; weapons feel distinct by Feature without math tax | Less modular customization once a weapon is picked |
| **Growing / Heirloom Weapons** | **Earthdawn Thread Items, Exalted Evocations, PoE Soulbound, 5e Vestiges** `[memory]` (PoE also in `pillars-of-eternity.md`) | Weapon starts simple and unlocks powers through character deeds, lore, mastery, or tier milestones | Tight if powers are horizontal | Solves heirloom attachment permanently; strong narrative identity (Alexandrian `[checked]`: names, history, diegetic quirks beat "Magic Sword #3419") | **Cautionary tale:** D&D 3.5 *Weapons of Legacy* `[checked, Alexandrian]` imposed permanent character penalties (HP/attack/save taxes) to unlock powers and was hated for it |

---

## 3. Eight tight-math-safe mechanical levers for weapon improvements

If `+1` to hit and unconditional `+1d6` damage are off the table (or strictly quarantined), **what can a weapon improvement actually *do* that feels exciting at the table?** Across the systems above, eight levers stay safe inside tight math:

### Lever 1: Damage subtype & material (Weakness / Resistance play)
- Converting damage to Fire/Frost/Lightning/Radiant/Necrotic, or forging with Silver/Cold Iron/Ghost-Touched steel.
- **Why it is tight-math safe:** Does `+0` against neutral foes, and shines against foes with specific Resistances, Immunities, or Weaknesses (exactly matching 2d12's existing Resist/Weak/Immune rule and `items-economy.md`'s low ~0.3–1.5 DE pricing).
- **Watch-out:** Never charge high-level "grade taxes" (PF2e's flaw) just to keep a silvered blade usable at higher Stages.

### Lever 2: Trigger-gated & conditional riders (not every swing)
- Upgrades that only fire on narrow, earned triggers — never as flat per-hit DPR:
  - **Escalation-gated** (e.g., *"At Escalation 4+ / 6+, ..."* — directly leveraging 2d12's combat clock, like 13th Age's Escalation triggers).
  - **Tier 3 / Critical-only riders** (e.g., Draw Steel's *Silencing* blocking magic on Tier 3; PF2e's *Crushing* / *Fearsome* on Crit). Note `versions-criticals.md`: Criticals alone are rare, so **Tier 3** is often a far more satisfying trigger than Critical-only.
  - **State-gated** (vs. Bloodied, Profane, Flying, Marked, Guarded, or Undead — e.g., Draw Steel's *Wingbane*, 3.5e's *Truedeath*).
  - **Frequency-capped** (*1/Round* or *1/Encounter*), which automatically neutralizes the 1 AP multi-hit vs. 2 AP single-hit skew!

### Lever 3: Granted Actions or Reactions (competing for the same 4 AP / 1R)
- An enchantment grants a new **1 AP / 2 AP Action, Encounter Action, or Reaction** usable while wielding the weapon (e.g., Draw Steel's *Chargebreaker* free triggered strike vs. a charging foe, or *Icemaker* creating an ice patch).
- **Why it is tight-math safe:** Because it spends the wielder's existing **4 AP** or **Reaction** (or an Encounter charge), it adds **tactical breadth** without multiplying base Strike output. And in 2d12 it can be priced directly against the `1 AP ≈ 5.8 DE` and `100 SC / 1 DE` anchors in `items-economy.md`.

### Lever 4: Modal / Trade-Off upgrades (Draw Steel & Lancer style)
- Lets the wielder **trade one thing for another** on demand:
  - **Draw Steel *Windcutting* `[read]`:** Take a Bane on the roll to turn a single-target weapon strike into a 3-cube AoE.
  - **Draw Steel *Metamorphic* `[read]`:** Switch the weapon between modes (Concealed / Large +reach / Vicious).
  - **Lancer mods `[lead]`:** Halve damage to inflict Slowed + Impaired; gain Inaccurate to convert to Burn.
- **Why players love them:** Zero power creep (net neutral or slight conditional edge), yet every turn gains a real tactical button.

### Lever 5: Property & rule-bending swaps
- Changing *how* the weapon interacts with the grid or defenses rather than raising its numbers:
  - **Thrown + Returning** (Draw Steel *Hurling*, PF2e *Returning*): lets a melee fighter engage flyers/kiting foes without swapping weapons.
  - **Reach / Extending** (1/Encounter long-range lunge, PF2e *Extending*).
  - **Rule bypasses:** Ignore half Cover, ignore Guard on a single blow, strike Ethereal/Incorporeal (*Ghost Touch*), or — **unique to 2d12** — **target Resolve `[R]` instead of Vigor `[V]`** (or deal Resolve damage / bypass Armor vs. Ward!).
  - **Utility shapes:** Concealable, hands-free tether (*Called*), counts as a light source or spellcasting focus.

### Lever 6: Consumable coatings, oils, whetstones, and 1-fight runes
- Short-duration upgrades (lasts **1 Encounter** or **next 1–3 hits**): monster oils, elemental resins, whetstones, 13th Age-style 1-battle runes.
- **Why it is tight-math safe:** Zero permanent power creep, great recurring **gold sink** (important for 2d12's economy), and makes **scouting / preparation** pay off.
- **How to avoid PF2e's Talisman "sell-pile / hoarding" failure `[lead]`:**
  1. **Price them cheap enough to burn freely** (2d12's draft `5 SC / 1 DE` consumable ratio is already 20× cheaper than permanent `100 SC / 1 DE` — much friendlier than PF2e's high-level Talisman prices!).
  2. **Make them last a full Encounter** (like 13th Age's 1-battle Runes) rather than 1 single swing, so players don't panic about "wasting it on a bad roll."
  3. **Give them fun tactical/elemental riders**, not boring `+1` math (the exact reason 13th Age 2e cut plain Oils and kept Runes `[lead]`).
  4. **Let them sit on the Belt or apply before a fight** (avoiding a clunky mid-fight 2 AP tax).

### Lever 7: Variance / die-shape shifts (same average, different feel)
- Shifting reliability vs. swinginess without raising average damage (e.g., *Keen/Balanced*: reroll a 1 on the weapon's damage die once/turn, or swap flat damage for a slightly bigger exploding die; *Reliable*: raise Tier 1 graze / floor).
- **Watch-out:** On 2d12's exploding dice, even small reroll rules raise EV measurably and must be checked against the simulator (`~0.5–1.5 DE`) rather than eyeballed.

### Lever 8: Diegetic identity, Quirks, and Non-Combat utility
- The Alexandrian `[checked]` stresses that what makes a weapon unforgettable is rarely its `+1` — it is **how it behaves in the world**: glowing near Profane creatures, whispering a warning (Senses/alertness), leaving frost trails, carrying a **13th Age-style Quirk**, or being **forged from a defeated boss's trophy** (Draw Steel's *Imbue Weapon* `[read]`: white dragon bones, giant hawk pinfeather, devil blood).
- Importantly, in 2d12, non-combat weapon traits (light, warning, cutting ropes/stone, intimidating presence) give cool flavor while respecting the "no combat numbers from out-of-combat utility" wall.

---

## 4. The structural problem: where do weapon improvements fit in 2d12?

In a game as layered as 2d12, **math safety is only half the problem.** The other half is **complexity and division of labor** — making sure weapon improvements don't step on Mastery, Techniques, Talents, or Bind slots, and don't turn every attack roll into a 5-trigger checklist.

### 4.1 Mapping 2d12's existing layers (avoiding overlap)
2d12 already has **five distinct places** where weapon-related power lives (from `book/rules-src/15-gear.md` and `book/items-economy.md`):

| Layer in 2d12 | Owned by | What it currently does | Risk if weapon improvements overlap it |
|---|---|---|---|
| **1. Base Weapon + Rung** (Basic / Advanced / Exotic) | The item | Base damage (`1[W]`), range, Weapon Group, Properties, and the **Weapon Technique** (unlocked at Mastery 10) | If runes copy weapon Properties/Techniques, choosing a Longsword vs. Arming Sword stops mattering |
| **2. Weapon Mastery** (10 / 20 / 30 / 45 / 60) | The **character** | Unlocks Technique, Advanced/Exotic gates, `2[W]`, and mastery tiers — stays with you even if you lose the sword | Weapon upgrades shouldn't replace Mastery's vertical/technique milestones — they should *complement* or *ride beside* them |
| **3. Talents & Class Actions** | The **character** | Build identity, AP rotation, main tactical engine (~+6 pts/turn per rank) | If a weapon rune equals a full Talent in power, gear replaces character build |
| **4. Bind Slots (`Stage + 1`: 2/3/4) & Upkeep (`5 CC/day per 100 SC`)** | Shared **item budget** | Caps total permanent magic items and gives permanent gear an ongoing gold cost | **Huge asset!** Bind already acts like Lancer's SP / Draw Steel's "Carry Three Safely" cap — preventing "golf-bag" magic weapon hoarding automatically |
| **5. Belt (`3` slots) & Consumables (`5 SC / 1 DE`)** | Shared **consumable budget** | Fast in-fight consumables (Usage AP -1, min 1) | Natural home for Oils, Coatings, Whetstones, and 1-Encounter Runes |

### 4.2 Three design traps to watch out for

1. **The "Build-a-Bear" Trigger-Bloat Trap (PF2e's 3-Rune stack):**
   - Stacking 3 permanent property runes on one sword + a Weapon Technique + Mastery perks + 2 Combat Talents creates **6 passive triggers to remember on every single swing**.
   - **Research lesson (Fabula Ultima, Draw Steel, PF2e Spellhearts, 3.5e Augment Crystals):** Capping a weapon at **1 permanent enchantment / rune slot** (plus at most **1 active temporary coating/oil**) keeps a weapon card readable in two lines while still allowing deep variety across a campaign.
2. **The Damage-vs-Utility Crowding Trap (PF2e's Property Rune failure):**
   - If a player has 1 (or 2) weapon rune slots and one rune gives *"conditional +3 damage"* while another gives *"Thrown + Returning"* or *"glows near undead + ignores Cover"*, **the damage rune wins 90% of the time** `[lead, r/Pathfinder2e]`.
   - **Two known fixes:** (a) keep *every* rune purely horizontal/tactical with roughly equal DE value (no pure DPR rune exists), OR (b) separate slots by role (e.g., **1 Permanent Enchantment/Rune** for horizontal identity + **1 Material** for Resist/Weak + **1 Consumable Oil/Coating** for fight-specific prep).
3. **The Heirloom vs. Golf-Bag Tension:**
   - Players hate discarding a named weapon they earned at Level 2 (Alexandrian `[checked]`), *and* tight-math games hate players carrying 5 fully enchanted weapons for every occasion (PF2e ABP's "golf bag" `[lead]`).
   - **2d12's existing drafts already solve this better than most games:**
     - **Bind slots (2/3/4)** + **Upkeep** kill the golf bag — you can't keep 5 Bound magic swords active without starving your armor/utility slots and paying steep Upkeep.
     - **Enchantment Transfer** (`items-economy.md`: 1 day at a crafter, 10% same Weapon Group / 25% different group) — or Draw Steel's **Imbue Weapon** — solves the heirloom problem cleanly when a player upgrades from Basic (Arming Sword) to Advanced/Exotic (Mastery 10/20).

---

## 5. Four candidate architectures for 2d12 (observations — Lucas decides)

These four models show where weapon improvements could live cleanly inside 2d12's existing architecture without breaking its tight math or overlapping Mastery/Talents:

### Option A: "1 Permanent Enchantment + 1 Temporary Coating" (Cleanest, lowest bloat)
- **Permanent slot (uses 1 Bind slot):** A weapon holds **one** Enchantment/Rune (horizontal lever: Granted Action/Reaction, Modal trade-off, Escalation/T3 rider, or Property swap). Transferable via 2d12's existing 10%/25% transfer rule (so upgrading from Basic → Advanced → Exotic keeps the enchantment).
- **Material (no Bind slot, no level-grade tax):** Optional Silver / Cold Iron / etc. for Resist/Weak play.
- **Temporary slot (Consumable, no Bind slot):** **Oils / Whetstones / 1-Fight Runes** (lasts 1 Encounter, costs ~5–25 SC, applied before a fight or from the Belt) — elemental conversion, monster-type rider, or a single-fight tactical trick.
- **Pros:** Zero trigger bloat; clean division between permanent identity (Bind + Upkeep) and tactical scouting prep (Consumables); fits `items-economy.md` almost as-is.
- **Cons:** Less "slotting and swapping runes every night" tinkerer feel.

### Option B: "Swappable Socket Runes (Augment Crystals) + Fixed Exalted Weapons"
- **Socketed Runes (1 slot per weapon, Bind applies to the Rune):** Inspired by 3.5e *Augment Crystals*. A masterwork/mundane weapon has **1 Rune socket**; you can slot or swap a Bound Rune on a Sleep (same cadence as Bind swaps).
- **Exalted Weapons (`items-economy.md`):** Unique named weapons that **cannot** take generic runes, and instead grow with the wielder's Mastery milestones (like Draw Steel's L1/L5/L9 leveled treasures or PoE's Soulbound).
- **Pros:** Solves both the heirloom problem AND Basic→Advanced→Exotic weapon transitions effortlessly (just pop your Rune into the new blade); lets loot drop as cool *Runes* rather than "another axe nobody uses"; clearly separates customizable gear (Runes) from mythic story gear (Exalted).
- **Cons:** Can feel slightly "video-gamey / gem-socketing" depending on 2d12's tone; needs strict non-stacking and no-pure-DPR rune discipline so players actually swap runes instead of gluing one "best" rune in forever.

### Option C: "Trophy Imbuing by Stage" (Draw Steel model, linked to 2d12 Loot Lots)
- Inspired directly by **Draw Steel's *Imbue Weapon*** `[read]` and 2d12's existing **Loot Lots** (`items-economy.md`: Arcana, Hides, Salvage, Trophies).
- A weapon can be **Imbued once per Stage** (Stage 1, Stage 2, Stage 3 — or capped at 2 total traits: 1 **Form/Property** + 1 **Trigger/Action**) using gold + a slain monster's trophy/Arcana lot during Downtime.
- **Pros:** Ties combat loot, crafting, and weapon growth into one loop; every weapon tells the story of the monsters the party defeated (Alexandrian's ideal); solves heirloom growth automatically; no "+1" math anywhere.
- **Cons:** Requires a short menu of Imbuements per Stage and Downtime access; 3 stacked imbuements on one weapon risks trigger bloat unless Stage 2/3 upgrades *evolve* the Stage 1 trait rather than stacking a brand-new passive.

### Option D: "Weapon Enhancements Only via Consumable Runes + Exalted Weapons" (Minimalist)
- Regular weapons stay **purely mundane + Material** (all permanent character power lives in Mastery, Techniques, Talents, and non-weapon Bound items).
- Temporary weapon magic exists **only** as **1-Encounter Runes / Oils** (13th Age 2e model).
- Permanent magic weapons exist **only** as rare, named **Exalted Weapons** (zero generic magic swords).
- **Pros:** Strongest anti-commodity magic feel (every magic blade is legendary); absolute tightest combat math; keeps Upkeep/Bind focused on wondrous gear.
- **Cons:** Players who *love* finding or customizing a cool enchanted sword at Stage 1 might feel weapons are too plain if Exalted weapons are very rare.

---

## 6. Quick comparison checklist against 2d12's principles

Whichever model Lucas chooses, the research points to **six guardrails** that protect tight-math games:
1. **No `+1/+2/+3` to hit on weapons** (2d12's own simulation already proved `+1` = ~14% Health-loss swing).
2. **No unconditional per-hit flat damage or extra dice** (protects 1 AP multi-hit vs. 2 AP heavy parity and `2[W]` scaling).
3. **Never put pure-DPR upgrades in the same slot as utility/tactical upgrades** (PF2e's property-rune trap).
4. **Cap active passive triggers per weapon at 1** (or 1 permanent + 1 temporary coating) so a Strike never becomes a 5-check flowchart.
5. **Solve heirloom progression upfront** (transfer ritual, swappable socket, or imbuing) so Mastery 10/20 rung upgrades (Basic → Advanced → Exotic) don't punish players for loving their weapon.
6. **If using consumable coatings/runes, make them cheap and 1-Encounter long** so they actually get used instead of sitting in the sell pile (PF2e Talisman lesson; 13th Age 2e Rune lesson).

---

## 7. Sources

- `[read]` Pathfinder 2e (Archives of Nethys), *Weapon & Armor Runes / Transferring Runes*: https://2e.aonprd.com/Rules.aspx?ID=733
- `[read]` Pathfinder 2e (Archives of Nethys), *Weapon Property Runes*: https://2e.aonprd.com/Equipment.aspx?Category=23&Subcategory=27
- `[read]` Pathfinder 2e (Archives of Nethys), *Talismans*: https://2e.aonprd.com/Rules.aspx?ID=725
- `[read]` Pathfinder 2e (Archives of Nethys), *Spellhearts*: https://2e.aonprd.com/Rules.aspx?ID=1510
- `[read]` Pathfinder 2e (Archives of Nethys), *Automatic Bonus Progression*: https://2e.aonprd.com/Rules.aspx?ID=2741
- `[read]` Pathfinder 2e (Archives of Nethys), *Precious Materials*: https://2e.aonprd.com/Equipment.aspx?Category=37&Subcategory=38
- `[read]` Draw Steel (MCDM, printing 1.01b), *Leveled Treasures* (Weapon Treasures & "Carry Three Safely"): https://steelcompendium.io/v2/Browse/rule/treasure/leveled-treasure/
- `[read]` Draw Steel (MCDM, printing 1.01b), *Imbue Treasure / Imbue Weapon*: https://steelcompendium.io/v2/Browse/project/imbue-treasure/
- `[read]` Daggerheart SRD, *Weapons*: https://daggerheartsrd.com/rules/weapons/
- `[checked]` The Alexandrian (Justin Alexander), *Putting the "Magic" in Magic Items*: https://thealexandrian.net/wordpress/2557/roleplaying-games/putting-the-magic-in-magic-items
- `[lead]` 13th Age SRD, *Magic Items* (True Magic Weapons, Quirks, Runes) & 13th Age 2e changes (cutting Oils, keeping Runes): https://www.13thagesrd.com/magic-items/ (search snippets)
- `[lead]` Community reception & secondary summaries (Reddit blocks automated readers): `r/Pathfinder2e` (ABP pitfalls, damage vs. utility property runes, Talisman disuse vs. Spellhearts), `r/swrpg` (Genesys Hard Points), `r/LancerRPG` (Lancer Weapon Mods), Fabula Ultima Rare/Custom Weapons.
- `[memory]` D&D 3.5 *Magic Item Compendium* Augment Crystals; Worlds Without Number weapon mods & Maintenance; Earthdawn Thread Items; Exalted 3e Evocations; D&D 5e Vestiges of Divergence; D&D 4e Whetstones; Witcher Oils / Monster Hunter Coatings.
