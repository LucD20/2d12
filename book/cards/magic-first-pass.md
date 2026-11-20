# Magic, the first pass: seventeen Dominions spells as 2d12 cards

> **Status (2026-11-20): PLACEHOLDER spell cards (Lucas, 2026-11-19: reference only, "they aren't set in any shape or form"). Never argue from one as settled.**

**2026-11-18, asked by Lucas:** "You can get spells from Dominions, simple ones and more complex ones, and see how they hold up." **A test of the basics, not a spell list: nothing here is decided, nothing is in the book.** The basics tested are section 5g of `book/magic-design.md` with decisions 32 to 34 (Overcast capped at one step a ladder; buffs mainly in rounds; a spell can carry its own rules).

**How to read a card here.** The bar: name, then what it needs (its Path and School minimums), its Frequency and cost. Then the Flavor, the traits, the grid (Distance, Area, Target), the body in the Structure's labels (Effect, Attack or Save, Tiers, Special), and the new line, **Overcast**: the form ladders it may climb (School levels) and its own step (Path levels). Merge and Overreach are on every spell and are not repeated.

**Every number is a placeholder** [not priced: the SIM has no caster]. The sizes are set by eye against the Stage 0 cards: a Longsword's 1[W] + [Mod] is about 10 on a Tier 2 and 14 on a Tier 3; Word of Radiance (Encounter, 2 AP, an area Save) deals 3d6 / 2d6 / 1d6. [Mod] on a spell is the Power Modifier. The Dominions line gives the original's requirement as Path level / School research, from `book/research/raw/2026-11-18-dominions-spells.tsv`.

---

## Simple spells

### 1. Fire Darts
*Dominions: Fire 1 / Evocation 1. Four darts of 10 armor-piercing fire, range 30; three more darts a level.*

> **Fire Darts** · Fire 1 • Evocation 1 · At-will · 1 AP
> *You flick your hand and a dart of flame leaps from your fingers.*
> [Power, Spell, Fire, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature
> **Attack:** Power vs. Armor Defense
> **Tier 2:** [V] 1d6 Fi + [Mod].
> **Tier 3:** [V] 1d8 Fi + [Mod].
> **Overcast:** *Reach.* *Fire:* a second dart: one more creature within 2 squares of the target.

**Held up.** Cleanly. It is the caster's Weapon Attack: At-will gives it the Bane on each repeat with no new rule, and the three-Strikes cap applies. "Three more darts a level" became one more target on the same roll, which is what `many-hits.md` found works ("one roll, several hits").

### 2. Shocking Grasp (and Lightning Bolt)
*Dominions: Air 1 / Evocation 1, a touch of 18 armor-negating shock for 3 fatigue, "the cheapest spell in the game". Lightning Bolt is Air 2 / Evocation 2: 14 shock at range 40.*

> **Shocking Grasp** · Air 1 • Evocation 1 · Round · 1 AP
> *Lightning crawls over your hand, and you lay it on your foe.*
> [Power, Spell, Air, Evocation, Strike]
> Distance: Reach · Target: One creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] [Mod] El.
> **Tier 2:** [V] 2d6 El + [Mod].
> **Tier 3:** [V] 2d6 El + [Mod]; Staggered (EoT).
> **Overcast:** *Reach.* *Air:* the lightning jumps: one creature adjacent to the target takes [V] [Mod] El.

**Held up.** Better than expected: **with one Reach step it is Lightning Bolt.** Two Dominions spells are one card, which is what the ladders are for. **A strain:** Dominions' lightning ignores armor, so the honest translation rolls against Ward Defense, against the proposed lean ("an Element attacks the body"). The lean is a habit, not a rule: Air's lightning breaks it on its first card.

### 3. Fireball
*Dominions: Fire 2 / Evocation 3. 16 fire in 8 squares, range 35; leaves heat clouds.*

> **Fireball** · Fire 2 • Evocation 1 · Round · 2 AP
> *A bead of fire streaks from your palm and bursts among your foes.*
> [Power, Spell, Fire, Evocation, Ranged, Area, Save]
> Distance: 10 sq. · Area: 1 Burst · Target: All creatures in the Area
> **Save:** Instinct
> **Tier 1:** [V] 2d6 Fi.
> **Tier 2:** [V] 1d6 Fi.
> **Overcast:** *Reach, Breadth.* *Fire:* the Area burns until the end of your next turn: Hazardous Terrain [HT: Entering, Turn]: [V] [Mod] Fi.

**Held up.** Yes, and every piece is an existing rule: a [Save] Action with reversed Tiers, an Area that catches allies, Hazardous Terrain for the lingering fire (Covering Fire writes it the same way). **Noted:** it needs Fire 2, so no one has it at level 1 (about 10 Mastery in Fire, around character level 3). That pacing matches Dominions, where Fireball is an "average" mage's spell.

### 4. Stoneskin
*Dominions: Earth 1 personal, Earth 2 on another, Earth 3 on a group, Earth 4 on the army. +10 natural armor (up to 15), -5 Cold Resistance, for the battle. Ironskin: +13, -5 Shock Resistance, and it replaces Stoneskin.*

> **Stoneskin** · Earth 1 • Alteration 1 · Round · 1 AP
> *You press your palm to skin, and it greys and hardens like rock.*
> [Power, Spell, Earth, Alteration]
> Distance: Reach · Target: You or one willing creature
> **Effect:** The target has Resist 2 Blunt, Pierce and Slash, and Weak 2 Cold (1 round).
> **Overcast:** *Breadth, Hold.* *Earth:* iron instead of stone: Resist 3, and the weakness is to Electricity.

**Held up.** Yes. Resist and Weak are Chapter 1's own words, so the buff with a price costs no new rule, and "Ironskin replaces Stoneskin" is the Stacking rule (the highest value counts). The five Dominions spells of the line are this card and its two ladders. **Strains:** (a) Breadth's Burst rungs would also harden enemies: a helpful spell needs "willing creatures in the Area". (b) With the cap of one step a ladder, the Hold ladder gives 1 round → 3 rounds in a single step, or the top rung is never reached: the rungs of a capped ladder need rewriting.

### 5. Earth Grip
*Dominions: Earth 1 / Alteration 1. One target pinned; Strength against 23 to break out; flyers and floaters immune.*

> **Earth Grip** · Earth 1 • Alteration 1 · Round · 1 AP
> *The ground opens under your foe's feet and closes around its ankles.*
> [Power, Spell, Earth, Alteration, Ranged, Save]
> Distance: 5 sq. · Target: One creature standing on the ground
> **Save:** Body
> **Tier 1:** Immobilized. Its Break Free needs a Body Check against your Power DC.
> **Tier 2:** Hindered (EoT).
> **Overcast:** *Reach, Breadth.* *Earth:* the earth swallows it to the knees: it is also Prone.

**Held up.** Yes, and it shows decision 24 working: Immobilized is Nature's rider, and here it is an Earth spell's main effect. Dominions' "each Path holds with its own way out" has a home already: Chapter 8 lets a card say Break Free needs a Check. Earth's is Body; a Glamour "false fetters" would ask a Mind Check; Fire's cage (card 11) asks nothing and burns. **Sorting:** no damage, a condition of the body, so Alteration, by the sharpening proposed in the review (5h, B9).

### 6. Healing Touch
*Dominions: Nature 1 / Enchantment 1. Heals 30, +10 a level, by touch.*

> **Healing Touch** · Nature 1 • Evocation 1 · Round · 2 AP
> *Green warmth flows from your hands, and torn flesh knits.*
> [Power, Spell, Nature, Evocation]
> Distance: Reach · Target: One willing creature
> **Effect:** The target can use 1 Rally Point, and heals [Mod] more.
> **Overcast:** *Reach, Breadth.* *Nature:* the growth takes hold: the target also ends one Lingering on it.

**Held up.** Only by leaning on the Paladin. **The strain is the biggest of the pass:** Lucas's Health is rare to recover (Rally Points, only a Rest restores them). A spell that heals dice outright, Round after Round, breaks that; a spell that spends the target's Rally Point is Lay On Hands' 2 AP version, almost word for word. **A decision is needed: what healing magic is allowed to do** (spend the target's Rally Points; give Guard; heal only [Mod]; or real healing at Encounter frequency).

### 7. Twist Fate
*Dominions: Astral 1, no research. "Negates the next wound."*

> **Twist Fate** · Astral 1 • Enchantment 1 · Round · 1 AP
> *You pluck a thread only you can see, and the blow that was coming goes astray.*
> [Power, Spell, Astral, Enchantment, Woven]
> Distance: 5 sq. · Target: You or one willing creature
> **Effect:** The next instance of damage the target takes is reduced by 2d6. Then this spell ends.
> **Overcast:** *Reach.* *Astral:* the thread holds twice: it ends after the second instance.

**Held up.** Yes: "an instance of damage" is defined in Chapter 4, so a ward that is a count needs no new word. **Noted:** by "lasting wins" this protection is an Enchantment and takes the caster's one Woven spell. Nearly every Dominions ward lands there, so **Abjuration is left with the instant things**: Reactions (card 16), counters, dispels. That is what Lucas chose (decision 10: "A"), and it does give the two Schools different jobs; Abjuration will simply be the smallest cell.

### 8. Sleep
*Dominions: Glamour 2 / Thaumaturgy 2. One target at range 35, can't miss, resisted: "asleep (useless until harmed)".*

> **Sleep** · Glamour 1 • Thaumaturgy 1 · Encounter · 2 AP
> *You murmur a word, and your foe's eyes grow heavy.*
> [Power, Spell, Glamour, Thaumaturgy, Ranged, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** Unconscious (1 round). It wakes when it takes damage, or when a creature adjacent to it spends 1 AP to wake it.
> **Tier 2:** Dazed 1.
> **Overcast:** *Reach, Breadth.* *Glamour:* a deep dream: on a Tier 1, damage doesn't wake it unless it is 5 or more.

**Held up.** With effort. **2d12 has no word for Dominions' largest family of control** (asleep, confused, charmed, stunned: 20 Glamour Thaumaturgies). Sleep works because Unconscious exists, with its own way out written on the card and an Encounter frequency. Confusion and Charm have nothing to stand on: each needs a condition written, and `conditions-and-senses.md` argues against any that takes a whole turn.

---

## More complex spells

### 9. Fire Shield
*Dominions: Fire 1 / Enchantment 3. Melee attackers who hit you take fire damage, for the battle.*

> **Fire Shield** · Fire 1 • Enchantment 1 · Round · 1 AP
> *Flames wreathe you, close as a cloak; whoever strikes you reaches through them.*
> [Power, Spell, Fire, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, a creature that damages you with a [Melee] Action takes [V] 1d4 Fi.
> **Overcast:** *Breadth.* *Fire:* the flames cling: it also takes your Path's rider (Lingering).

**Held up.** Yes, and the break rule makes it a small story: the shield burns those who hit you until they have hit you enough to make you Bloodied, and then it goes out. **A gap:** "it takes your Path's rider" needs the rider written as a full line with its numbers (5h, B5).

### 10. Chain Lightning
*Dominions: Air 2 / Evocation 5 (Orb Lightning) and Air 3 / Evocation 8 (Chain Lightning). One target, then it bounces 7 or 20 times to adjacent creatures.*

> **Chain Lightning** · Air 2 • Evocation 2 · Round · 2 AP
> *A bolt cracks from your hand and leaps from one foe to the next.*
> [Power, Spell, Air, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature, then up to two more, each adjacent to the one before
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] [Mod] El.
> **Tier 2:** [V] 1d8 El + [Mod].
> **Tier 3:** [V] 1d8 El + [Mod]; Staggered (EoT).
> **Overcast:** *Reach.* *Air:* two more leaps.

**Held up.** Yes. The chain is a shape that none of the three ladders describes, and it didn't need one: it is the Target line, and its growth is the spell's own step. Chapter 1's Several Targets already says how one roll lands on each creature. This is "special in its own way" with no rule added.

### 11. Bonds of Fire
*Dominions: Fire 1 / Thaumaturgy 2. A cage of flame: a morale check (against 21) to leave it, and leaving burns for 3.*

> **Bonds of Fire** · Fire 1 • Alteration 1 · Round · 1 AP
> *A ring of fire springs up around your foe, close enough to singe.*
> [Power, Spell, Fire, Alteration, Ranged]
> Distance: 10 sq. · Target: One creature
> **Effect:** If the target leaves its square, it takes [V] 2d6 Fi (1 round).
> **Overcast:** *Breadth, Hold.* *Fire:* the ring tightens: at the end of its turn, if it hasn't left, it takes [V] [Mod] Fi.

**Held up.** The best card of the pass. No roll, no condition, no rider: a choice handed to the enemy, which the charter asks of a good Passive ("it changes a decision"). Dominions' morale check became the creature's own decision. It also holds an archer who has no reason to move, which Immobilized doesn't.

### 12. Mirror Image
*Dominions: Glamour 1 / Alteration 2. Two images a level; with n images, n in n + 1 hits are lost and pop one.*

> **Mirror Image** · Glamour 1 • Enchantment 1 · Round · 1 AP
> *You blur, and where one of you stood there are three.*
> [Power, Spell, Glamour, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, [Strike] Actions against you are Doomed. It ends after the second such Strike, whatever its result.
> **Overcast:** *Glamour:* a third image: it ends after the third.

**Held up.** Yes, by turning the odds table into a count and a word the book has (Doomed). **A cost:** a count of two is a small thing to track across turns; a token on the sheet does it.

### 13. Poison Cloud
*Dominions: Nature 3 + Air 1 / Evocation 5. A poison cloud of level 3 in 6 squares; clouds fade a level a round.*

> **Poison Cloud** · Nature 2 + Air 1 • Evocation 1 · Round · 2 AP
> *You breathe out, and a green fog rolls from your mouth and settles.*
> [Power, Spell, Nature, Air, Evocation, Ranged, Area]
> Distance: 10 sq. · Area: 1 Burst
> **Effect:** For 3 rounds, the Area is Hazardous Terrain [HT: Entering, Turn]: [V] 1d6 Po. At the end of each round the die steps down (1d6, 1d4, then [Mod]).
> **Overcast:** *Reach, Breadth.* *Nature:* the venom bites: a creature that takes this damage is Sickened 1 (EoT).

**Held up.** Yes. A written two-Path spell reads fine ("Nature 2 + Air 1"), and Dominions' "Air as the second Path means a cloud" came through. **A point for the sorting:** it lasts three rounds and is not an Enchantment, because it has a count and nobody holds it. So the first sorting question should read **"is it [Woven] or [Sustained]?"**, not "does it last?". The fading die is Dominions' fading level in 2d12's dice.

### 14. Drain Life
*Dominions: Death 4 / Alteration 5. 14 armor-negating drain at range 30: the caster heals half and loses fatigue.*

> **Drain Life** · Death 2 • Evocation 1 · Round · 2 AP
> *You close your hand, and your foe's warmth runs out of it and into you.*
> [Power, Spell, Death, Evocation, Ranged, Strike]
> Distance: 5 sq. · Target: One living creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [R] [Mod] Un.
> **Tier 2:** [R] 2d6 Un + [Mod]; you gain Guard equal to half the damage dealt.
> **Tier 3:** [R] 2d6 Un + [Mod]; you gain Guard equal to the damage dealt.
> **Overcast:** *Reach.* *Death:* the cold stays in it: the target is also Frightened of you (EoT).

**Held up.** Yes, with one translation that answers card 6's problem: **drain gives Guard, not healing.** Guard can't be healed back and ends with the encounter, so the necromancer gets tougher in the fight without the day's Health growing. "One living creature" uses a kind as a limit: it needs the Tags.

### 15. Raise Dead
*Dominions: Death 2 / Enchantment 4. Ten zombies, two more a level, for 40 fatigue.*

> **Raise Dead** · Death 1 • Conjuration 1 · Encounter · 2 AP
> *You call, and something that had stopped moving gets up.*
> [Power, Spell, Death, Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** A Risen Corpse appears in a free square within the Distance and acts on your turn, after you.
> **Sustain:** 1 AP.
> **Overcast:** *Death:* a second corpse.

**Held up.** It can't be finished: **2d12 has no summons rules** (who commands it, how many AP it has, its stat block, whether it counts for Flanking). But the pass found its shape: **a summon is what [Sustained] is for.** Paying 1 AP every turn for a body that acts is a trade a table can weigh, and "it ends when you go Down, or become Bloodied or Strained" is Dominions' "the mindless dissolve without their leader". Ten zombies became one, then two.

### 16. Air Shield
*Dominions: Air 1, no research. 80% of missiles miss you, for the battle.*

> **Air Shield** · Air 1 • Abjuration 1 · Turn · 1R
> *You sweep an arm, and a hard gust turns the shot aside.*
> [Power, Spell, Air, Abjuration]
> Distance: 5 sq. · Target: You or one ally
> **Interrupt:** A [Ranged, Strike] Action targets the target.
> **Effect:** That Action takes 2 Field Banes against the target.
> **Overcast:** *Reach.* *Air:* the gust carries on: if the Action gets a Tier 1 against the target, its origin is Pushed 1.

**Held up.** Yes, as a Reaction, which is where Abjuration lives after card 7. A battle-long 80% became one moment a round, paid with the Reaction AP. It follows the charter's rule for Reactions (a Target line, the trigger written about the target).

### 17. Phoenix Pyre
*Dominions: Fire 2 / Alteration 7. When you die you explode (10 fire around you) and come back, exhausted; it can happen several times.*

> **Phoenix Pyre** · Fire 2 • Enchantment 2 · Encounter · 1 AP
> *You swallow a spark and keep it burning under your heart.*
> [Power, Spell, Fire, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, when you go Down, each creature in a 1 Emanation around you makes an Instinct Save (Tier 1: [V] 3d6 Fi; Tier 2: [V] 1d6 Fi). Then you can use 1 Rally Point.
> **Special:** Going Down doesn't end this spell before its Effect happens; the Effect ends it.
> **Overcast:** *Fire:* the pyre is wider: a 2 Emanation.

**Held up.** Only with its own rule, which is the point of the card. **A [Woven] spell ends when you go Down, and this spell's whole purpose is to answer going Down**: the general rule and the spell collide, and the Special line settles it on the card. This is Lucas's "rules inside themselves" doing real work. Also noted: becoming Bloodied ends it before you go Down, so in practice it protects against one big blow, not a slow defeat. That may be exactly right, or may make the card feel like a trap.

---

## What the pass showed

### The basics hold
1. **The grid reads.** Seventeen cards, and each one says what it is from its two words before the text is read. The Paths came out different in play, not only in damage type: Fire punishes, Air redirects, Earth hardens and holds, Astral cancels, Death takes, Nature mends and poisons, Glamour misleads.
2. **The ladders compress Dominions' lists.** Shocking Grasp with Reach is Lightning Bolt; Stoneskin with Breadth and its Earth step is five spells and Ironskin. Seventeen cards cover about forty Dominions spells.
3. **Most of the machinery was already in the book:** Resist and Weak, an instance of damage, Hazardous Terrain with rounds, Several Targets, Break Free with a Check, Guard, Unconscious, Doomed, Reactions with an Interrupt. Almost nothing needed a new condition.
4. **Decision 24 was right.** The three best cards (Bonds of Fire, Chain Lightning, Twist Fate) are not "damage and a rider". The spell's own Overcast step is where each stays itself.

### What strained (to decide or write)
| # | Finding | Seen on | Needs |
|---|---|---|---|
| 1 | **Healing against the rarity of Health.** Free healing breaks the Rally economy; "use a Rally Point" copies Lay On Hands | Healing Touch | A decision: what healing magic may do. Drain Life suggests Guard as magic's usual answer |
| 2 | **No words for sleep, confusion, charm, stun** | Sleep | New conditions written, or these effects rebuilt each time from Unconscious, Dazed, Taunted |
| 3 | **No summons rules;** a summon is [Sustained] | Raise Dead | The summons rule (and with it, Conjuration) |
| 4 | **The card Structure needs three new places:** the minimums ("Fire 2 • Evocation 1"), the Overcast line, the Sustain cost | all | Structure decisions (and Foundry's card model after) |
| 5 | **A capped ladder needs different rungs.** With one step a ladder (decision 32) a five-rung Breadth is never climbed past its second rung | Stoneskin, Fireball | Rungs rewritten for one step ("one creature → an area"; "1 round → 3 rounds"), or the cap counted differently |
| 6 | **A helpful spell's Burst reaches enemies** | Stoneskin, Healing Touch | "Willing creatures in the Area" in Breadth's rule |
| 7 | **The lean of the roll is not a rule.** Lightning rolls against Ward Defense | Shocking Grasp | Keep it as a habit only |
| 8 | **The first sorting question should be "is it [Woven] or [Sustained]?"**, not "does it last?" | Poison Cloud | One sentence in the sorting rule |
| 9 | **Abjuration is the smallest School:** the held wards are Enchantments | Twist Fate, Air Shield | Nothing, if that is accepted; it is what decision 10 chose |
| 10 | **[Woven]'s ends can collide with a spell's purpose** | Phoenix Pyre | Nothing general: the card's Special line |
| 11 | **Teleport and movement have no School** | (Blink, not drawn) | A line in the sorting rule |
| 12 | **Kinds as limits** ("one living creature") | Drain Life | The Tags |
| 13 | **Fire 2 and Air 2 spells arrive around character level 3** | Fireball, Chain Lightning | Nothing; noted as the pacing |
| 14 | **Every number is unpriced** | all | A caster in the SIM |

### The level 1 caster this implies
Opening Fire and Evocation gives two spells from the Fire 1 • Evocation 1 cell: here Fire Darts (At-will, 1 AP) and one Round spell. With 4 AP that is the Round spell and two or three darts every turn. It confirms the review's point (5h, B7): **a caster class has to bring the rest of the turn**, or opening should give three spells.
