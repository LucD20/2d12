# The famous picks: which feats, talents and edges players take first

**Date:** 2026-11-20. **Asked by Lucas,** after reviewing four test Talents: "Make a quick research of the most used feats, talents, etc used in other systems, like 4e, 2e, 3.5, pf1e, 13th, star wars etc. From there, we can build some of the most famous ones, the ones we can expect people to look at first."

**What was read, and how far to trust it.** One independent researcher; the full report (about 4,800 words, a source for each claim) is `raw/2026-11-20-famous-picks.md`. **This file is Claude's summary of it.** **Only two sources count what players actually take:** D&D Beyond's 5e figures of 2019 (read through EN World's article: War Caster, Tough, Lucky and Sharpshooter lead; Great Weapon Master was in the top four a year earlier); and a search summary of Pathbuilder's 20,391 Pathfinder 1e builds (Weapon Focus 27%, Power Attack 23%, Improved Initiative 21%, Dodge 18%: the page itself refused). Everything else is ratings and forum threads: **what players consider must-takes, not what they pick.** Paizo's forums, d20srd, the Star Wars wiki and Fantasy Grounds' forums refused, so most 3.5 and Fantasy Flight rules text is [memory]. No usage data exists for Pathfinder 2e, 4e, 13th Age, Savage Worlds or Star Wars. Lancer and Draw Steel entries are [memory]. **The family order from 9 down is the researcher's judgment.**

**Other games' picks, never 2d12's. Nothing here is decided.**

---

## The 20 families, and whether 2d12 can use their usual shape

T1: a Talent never gives a bare number. T11: more uses of a Frequency count as a number.

| # | Family | Famous picks | Usual shape | In 2d12 |
|---|---|---|---|---|
| 1 | **The damage trade** | Power Attack, Great Weapon Master, Sharpshooter (2014), Weapon Focus | A number | **Needs another shape.** On record: Pathfinder 2e's Power Attack (a separate two-action Strike); Great Weapon Master's Hew (an attack on a kill or a critical) |
| 2 | **Initiative** | Improved Initiative, Alert, Level Headed | A number | **Needs another shape.** On record: 2024's Alert (swap initiative with an ally) |
| 3 | **Hit points, staying up** | Toughness, Tough, Grit, Toughened, Nerves of Steel | A number | **Needs another shape.** On record: ignoring a wound penalty (Nerves of Steel); Second Wind (a verb) |
| 4 | **The attack of opportunity and its upgrades** | Combat Reflexes, Sentinel, Polearm Master, Reactive Strike | New triggers, rule changes | **Allowed,** except more Reactions a round |
| 5 | **Casting under fire** | War Caster, Combat Casting | A lifted limit (hands), a spell as the Reaction, a Boon on concentration | **Mostly allowed;** a lighter armor cost is out (`decided.md`) |
| 6 | **The ranged package** | Point-Blank, Precise, Rapid Shot, Sharpshooter, Crossbow Expert | Lifted limits (cover, melee, long range, loading) | **Allowed in that form,** which is 2024's Sharpshooter (it dropped the number) |
| 7 | **Luck and rerolls** | Lucky, Luck and Great Luck | A pool of rerolls | **A ruling needed:** a reroll is a rule, a count of them a number, a choice of dice close to a Boon |
| 8 | **Defense: dodge, parry, shield** | Dodge, Block, Parry, Reflect, Reactive Shield, Shield Master | Passive numbers, or a Reaction | **The Reaction form only** |
| 9 | **Extra attacks** | Cleave, Whirlwind, Frenzy, Sweep | Verbs | **Allowed;** Lucas's own warning ("Whirlwind", T6) is about this family |
| 10 | **Mobility and the charge** | Mobility, Spring Attack, Mobile, Fleet, Sudden Charge | Numbers and verbs | **The verb and rule forms** |
| 11 | **Magic from outside the class** | Magic Initiate, Fey Touched | New verbs | **Allowed;** a Magic Talent opens a Path (magic 27) |
| 12 | **Dual wielding** | Two-Weapon Fighting, Double Slice | Penalty removal; a two-weapon Action | **The Action is allowed;** "fewer Banes" needs a ruling |
| 13 | **Healing in a fight** | Battle Medicine, Healer | A verb with a per-target limit | **Allowed if it passes T2's bypass checklist** |
| 14 | **Skill reliability** | Assurance, Skill Focus | A fixed result, or a number | **Routine already does it in the base rules** |
| 15 | **Saves** | Iron Will, Superior Will | A number, sometimes a rule | **Only the rule part** |
| 16 | **Combat maneuvers** | Improved Trip, Improved Grapple, Shield Master's shove | Mixed | **The lifted-limit and verb parts** |
| 17 | **Metamagic** | Quicken, Empower, Dazing Spell | An effect added at a cost; numbers | **Adding an effect is allowed; making it cheaper is not** |
| 18 | **Social skills in a fight** | Intimidating Glare, Bon Mot | New actions | **As combat Talents only** (T2's wall) |
| 19 | **Leadership, followers** | Leadership, Command | A body, or a number to allies | **A body is a verb;** summons are one at a time |
| 20 | **More of a class resource** | Extra Rage, Extra Turning, Dedication | A number | **Out** (T1, T9) |

**What it shows:** the three families players reach for first (damage, initiative, hit points) are almost always bare numbers in their sources, so a 2d12 version needs a shape players won't recognise at once. **Families 4 to 6 are famous and already in shapes T1 allows.** D&D's 2024 revision moved the same way: it took the number out of Sharpshooter and kept the lifted limits.

## Counterparts already in 2d12 (observations)

- **Attack of opportunity:** the test Talent and its branches (Spellwatch and Spellbreaker are War Caster's magic side reversed; Hamstring is near Sentinel's "speed 0"). **A mismatch:** `cards/basic-actions.json` still carries Opportunity Attack as a Basic Action every creature has, while Lucas made it a Talent.
- **Ranged package:** the Archer's Clear Lines is Precise Shot and the 2024 Sharpshooter in a class Passive; a Talent here would sit close to the Archer's own cards.
- **Mobility and the charge:** Charge, Evade, the Archer's Footwork; Shoulder Through and Break the Line are the Spring Attack family.
- **Maneuvers:** Trip, Shove, Haul, Relocate exist; no grapple Talent.
- **Defense:** the Paladin's Shield of Faith is a parry-shaped Reaction; shields are "not written yet" in Chapter 15, with a Block Reaction planned.
- **Metamagic:** Overcast is the built-in form.
- **Skill reliability:** Routine is Assurance in the base rules.
- **Initiative, hit points, luck, dual wielding Talents, leadership:** nothing yet.
