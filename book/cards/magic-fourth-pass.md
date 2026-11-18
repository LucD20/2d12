# Magic, the fourth pass: Surge, the eight summons, two-Path spells

**2026-11-18.** A small batch that puts the day's decisions on paper (`book/magic-design.md`, decisions 55 to 70): Surge as the price of an Overcast step and of a stronger spell, Overreach as a line on some spells, one Summon spell for each Path, spells written with two Paths, areas that don't grow, the sorting order.

**A test, not a spell list. Nothing here is in the book. Every number is a placeholder** [not priced: the SIM has no caster]. Read with the header of `magic-second-pass.md` (the bar, the riders in full) and `magic-third-pass.md`.

**Audited.** An independent reader checked the first version against the record and the rulebook; what changed is the last table.

---

## Surge, as these cards use it (a draft of the rule, Claude's wording)

> **Surge.** You start an encounter with Surge equal to your Escalation. Each time your Escalation increases, you gain 1 Surge. Spending Surge doesn't lower your Escalation. Surge has no maximum of its own. When the encounter ends, you lose all your Surge. Surge does nothing unless one of your Actions spends it.
>
> **On a spell:** a card can print a Surge cost beside its AP ("2 AP · 1 Surge"): you pay both to cast it. Each Overcast step costs 1 Surge, and a casting holds at most as many steps as your Escalation minus 1. A step still needs its spare level.

**A first fight (Momentum 0), one Critical in round 3:**

| Round | Escalation | Surge gained | Most Overcast steps on a casting |
|---|---|---|---|
| 1 | 1 | 1 (the start) | 0 |
| 2 | 2 | 1 | 1 |
| 3 | 3, then 4 | 2 | 2, then 3 |
| 4 | 5 | 1 | 4 |

Five Surge in the fight. It buys, for example, one Fireball (1) and four steps; or one Flame Storm (3) and two steps.

---

## The eight summons

Decision 62: one Summon spell for each Path, each "Path 1 • Conjuration 1". The frame is written once; a Path changes only what the table gives.

> **[The spell's name]** · [Path] 1 • Conjuration 1 · Round · 2 AP · 1 Surge
> *[its Flavor]*
> [Power, Spell, (Path), Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** Your summon appears in a free square within the Distance that you have Line of Effect to, and takes its turn right after this Action. If you had another summon, it leaves.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *[Path]:* its own step (the table).

> **[The creature]** · your summon ([Path])
> A Minion of your Stage, with Chapter 14's Medium ratings. 3 AP, no Reactions.
> **Basic attack:** as its rank's: 1 AP, At-will; what it rolls and its damage as the table says.
> **Build, chosen on a Rest:** its Path's own pick, and two picks from the menu.
> It takes its turn right after yours, if you paid the Sustain at the start of your turn. It can't Flank, summon, use Rally Points or be healed; it can be given Guard. It is a Minor enemy to its foes. It leaves when it goes Down, when you don't pay, and when the spell ends.

**The menu (every summon):** Reach 2 · a ranged Basic attack (Distance 5 sq.) · its Path's rider on its Basic attack's Tier 3 · Resist 2 to one subtype · it sheds Bright light 1 · a sense (it perceives Hidden creatures within 3 squares as Obscured).

| Path | The spell and its Flavor | The creature | Basic attack | The Path's own pick | The Path's Overcast step |
|---|---|---|---|---|---|
| **Fire** | **Kindle Sprite.** *You strike a spark and it doesn't go out: it looks at you.* | Ember Sprite | Power vs. Armor Defense, [V] Fi | Its squares and the squares adjacent to it are in Bright light | It flares: when it leaves, each creature adjacent to it takes [V] 1d6 Fi |
| **Air** | **Call the Gale.** *You whistle a note the wind remembers, and a piece of the storm comes down to you.* | Gale Wisp | Power vs. Armor Defense, [V] El | Difficult Terrain costs it no extra movement | It lands hard: when it appears, each creature adjacent to it is Pushed 1 from it |
| **Water** | **Shape the Tide.** *You pour out your waterskin, and what stands up from the puddle is taller than you.* | Tide Shape | Power vs. Armor Defense, [V] Co | The squares adjacent to it are Difficult Terrain for its enemies | It breaks like a wave: when it leaves, each creature adjacent to it is Hindered (1 round) |
| **Earth** | **Wake the Stone.** *You knock twice on the ground, and the ground gets up to answer.* | Stone Servant | Weapon vs. Armor Defense, [V] Bl | It can't be Pushed, Pulled, Slid or made Prone | It is quarried whole: it appears with Guard equal to your Power Modifier |
| **Astral** | **Call a Watcher.** *You name a star, and for a while it is closer than it should be.* | Star Watcher | Power vs. Ward Defense, [R] Fo | You perceive every creature it perceives, as it does | You speak through it: once on each of your turns, you can measure one [Spell] Action's Distance and Line of Effect from its square instead of yours |
| **Death** | **Raise Dead.** *You call, and something that had stopped moving gets up.* | Risen Corpse | Weapon vs. Armor Defense, [R] Un | It can't be Frightened or Charmed | It rises from the fallen: it can appear in the square of a creature that went Down this encounter and that you have Line of Effect to, whatever the Distance |
| **Nature** | **Call the Pack.** *You howl, badly, and something that does it better answers from the trees.* | Pack Beast | Weapon vs. Armor Defense, [V] Pi | Its Speed is 2 higher than its rank's | It comes in at a run: when it appears, it can use its Basic attack once for 0 AP |
| **Glamour** | **Dream a Knight.** *You close your eyes and remember a hero from a story, and the story stands beside you.* | Dream Knight | Power vs. Ward Defense, [R] Ps | A creature more than 1 square from it perceives it as Obscured at best | It was never there: the first time it goes Down, it doesn't leave: it appears with no damage in a free square within 3 squares of you at the start of your next turn |

**What the eight show.**
- **"Round · 2 AP · 1 Surge" replaces the Encounter Frequency** the two earlier summons had (decision 69). A caster can call a second summon in a fight when the first goes Down, for 2 AP and 1 Surge, in place of never.
- **A summon can be cast in round 1** (you start with 1 Surge), and then nothing is left for an Overcast step until round 2.
- **Each turn a summon costs its Sustain (1 AP) and nothing in Surge.**
- **The Astral step is the bold one:** a spell cast from the summon's square. It is the only step here that changes where the caster's magic comes from.

---

## Three spells written with two Paths (decision 63)

Notation: both Paths, then the School ("Fire 2 • Earth 1 • Evocation 1"). You need all three minimums; spare level in either Path pays the substance step; no Merge. `magic-second-pass.md`'s Poison Cloud ("Nature 2 + Air 1") is the fourth, to be rewritten to this notation.

### 1. Magma Bolt
*Dominions: Fire 3, Earth 1 / Evocation. "Magma Bolts."*

> **Magma Bolt** · Fire 2 • Earth 1 • Evocation 1 · Round · 2 AP
> *You tear a fistful of the ground loose, and it is glowing before it leaves your hand.*
> [Power, Spell, Fire, Earth, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature
> **Attack:** Power vs. Armor Defense
> **Tier 2:** [V] 1d10 Bl; Lingering 1d4 Fi (Bo/In).
> **Tier 3:** [V] 2d10 Bl; Lingering 1d6 Fi (Bo/In); Prone.
> **Overcast:** *Reach, Breadth.* *Fire or Earth:* it pools where it lands: until the end of the target's next turn, the square it occupied when hit is Hazardous Terrain [HT: Entering, Turn]: [V] 1d4 Fi.

Fire's Lingering and Earth's Prone on one card, with Earth's damage subtype. No Surge cost: it is one creature, and the price of it is the second Path.

### 2. Mire
*Dominions: Water and Earth / Alteration. "Quagmire."*

> **Mire** · Earth 1 • Water 1 • Alteration 1 · Round · 2 AP
> *You press your palm to the ground and it forgets how to be solid.*
> [Power, Spell, Earth, Water, Alteration, Area]
> Distance: 5 sq. · Area: 1 Burst
> **Effect:** For 3 rounds, the Area is Difficult Terrain for every creature, and a creature that ends its turn in the Area is Hindered (1 round).
> **Overcast:** *Reach, Hold.* *Earth or Water:* it swallows: a creature that becomes Prone in the Area is also Immobilized (EoT).

The cheapest two-Path spell possible (1 • 1 • 1): what a caster gets on the day a second Path opens. By the sorting order it is an Alteration (it changes the ground; not held, no damage). An [Area], so no Breadth (decision 61).

### 3. Nightmare
*Dominions: Death and Glamour / Thaumaturgy. "Terror", "Nightmare".*

> **Nightmare** · Death 1 • Glamour 2 • Thaumaturgy 1 · Round · 2 AP · 1 Surge
> *You show your foe the thing it has never told anyone it fears, wearing your face.*
> [Power, Spell, Death, Glamour, Thaumaturgy, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** [R] 2d6 Ps; Frightened of you (2 rounds); Pressed 1 (2 rounds).
> **Tier 2:** Frightened of you (1 round).
> **Special:** A Minor enemy on a Tier 1 must also spend the first AP of its next turn on a Move Action that ends farther from you, if it can.
> **Overcast:** *Reach, Breadth, Hold.* *Death or Glamour:* it doesn't wake: the target can't end this spell's Frightened early.

Both riders on its worst Tier, and damage: stronger than Terror or Beguile alone, so it carries a Surge cost. The Special is decision 39 (stronger against Minor enemies) and decision 38 (one forced Action, never a turn).

---

## Surge as the gate (decision 69)

### Earlier spells that take a Surge cost

| Spell | Was | Now | Why |
|---|---|---|---|
| **Fireball** (Fire 2 • Evocation 1) | Round · 2 AP | Round · 2 AP · 1 Surge | Fire Darts as an area |
| **Chain Lightning** (Air 2 • Evocation 2) | Round · 2 AP | Round · 2 AP · 1 Surge | Several creatures in one casting |
| **Earthquake** (Earth 2 • Evocation 2) | Encounter · 3 AP | Round · 3 AP · 2 Surge | Surge replaces its Encounter Frequency; its Overreach line ("a second time") goes with it |

### 4. Flame Storm (the first 3 • 3 spell)
*Dominions: Fire 5 / Evocation. "Flame Storm."*

> **Flame Storm** · Fire 3 • Evocation 3 · Round · 3 AP · 3 Surge
> *You lift your hands and the air above your foes catches, and then it rains.*
> [Power, Spell, Fire, Evocation, Area, Save]
> Distance: 10 sq. · Area: 2 Burst · Target: All creatures in the Area
> **Save:** Instinct
> **Tier 1:** [V] 4d6 Fi; Lingering 1d6 Fi (Bo/In).
> **Tier 2:** [V] 2d6 Fi.
> **Effect:** After the Save, for 2 rounds, the Area is Hazardous Terrain for every creature [HT: Entering, Turn]: [V] 1d6 Fi.
> **Overcast:** *Reach, Hold (the Hazardous Terrain).* *Fire:* the fire knows your friends: up to two creatures you choose in the Area aren't targets.
> **Overreach (3d6!):** This casting costs 1 Surge in place of 3. You can do this once an encounter.

Fireball one size up, with the ground left burning. **Three Surge is most of a first fight's budget** (the table above): it can't be cast before round 3 there, and an Overcast step on it not before round 4. With Momentum 2 it can open a fight. Its Overreach line passes one limit (its Surge cost), once, and says so (decision 59).

### 5. Iron Will (a 3 • 3 spell that costs no Surge)

> **Iron Will** · Astral 3 • Abjuration 3 · Turn · 1R
> *You say one word in your ally's mind, and it is their own name.*
> [Power, Spell, Astral, Abjuration]
> Distance: 10 sq. · Target: You or one ally
> **Interrupt:** An Action's result would make the target Frightened, Charmed, Confused or Dazed.
> **Effect:** The target doesn't gain that condition from that Action.
> **Overcast:** *Reach.* *Astral:* the will turns: if that Action was an enemy's, that enemy is Dazed 1.

**Written to test decision 69's other half:** a high spell that is different, not stronger. It is Stone Ward's size (Earth 1 • Abjuration 1) and answers the mind where Stone Ward answers the body. **A question it raises:** does a 3 • 3 spell that is no stronger than a 1 • 1 feel like a reward for sixty fights of Mastery?

---

## What the fourth pass showed

1. **Surge makes Overcast a choice.** Five Surge in a first fight against six or more free steps before: a caster now picks which casting to stretch.
2. **Momentum decides when big magic arrives.** At Momentum 0, a 3 Surge spell waits for round 3; at Momentum 2, it opens the fight. This is "pay for pressing on" working, and it is also the one place a nova can come from.
3. **Surge replaced the Encounter Frequency on every card it touched** (the summons, Earthquake). Encounter is left for spells that must truly happen once (Sleep, Compel, Terror).
4. **A casting can cost three things at once:** AP, a printed Surge cost, and Surge for steps. With Overreach, four. It is the most a player has to add up on one card.
5. **Two-Path spells need no new rule beyond decision 63.** "Fire or Earth" on the Overcast line reads cleanly.
6. **A high spell that isn't stronger** (Iron Will) is easy to write and may be hard to want.

## The audit: what the independent reader changed

(filled after the audit)

## Assumptions I made (Lucas can revert any)

- A summon costs 1 Surge and is Round, not Encounter.
- A summon's Path gives one pick of its own, beside the two from the menu.
- "Surge has no maximum of its own" (it can't pass your Escalation anyway).
- Overreach lines on Flame Storm only; the six of `magic-overreach-lines.md` stand, except Earthquake's, which its new Surge cost replaces.
- The two-Path notation: both Paths, then the School, joined by "•".
