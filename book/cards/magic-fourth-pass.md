# Magic, the fourth pass: Surge, the eight summons, two-Path spells

**2026-11-18.** A small batch that puts the day's decisions on paper (`book/magic-design.md`, decisions 55 to 70): Surge as the price of an Overcast step and of a stronger spell, Overreach as a line on some spells, one Summon spell for each Path, spells written with two Paths, areas that don't grow, the sorting order.

**A test, not a spell list. Nothing here is in the book. Every number is a placeholder** [not priced: the SIM has no caster]. Read with the header of `magic-second-pass.md` (the bar, the riders in full) and `magic-third-pass.md`.

**Audited.** An independent reader checked the first version against the record and the rulebook; what changed is the last table.

---

## Surge, as these cards use it (a draft of the rule, Claude's wording)

> **Surge.** You start an encounter with Surge equal to your Escalation. You gain 1 Surge at the start of every round after the first, and 1 more when a Critical or your class's hook raises your Escalation (decision 73). Spending Surge doesn't lower your Escalation. Surge has no maximum of its own. When the encounter ends, you lose all your Surge. Surge does nothing unless one of your Actions spends it. Outside an encounter, you have Surge equal to your party's Momentum; what you spend comes back when your party wins an encounter that was normal or harder (decision 71).
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
> **Effect:** Your summon appears in an unoccupied square within the Distance that you have Line of Effect to. It takes its first turn right after your turn ends. If you had another summon, it leaves.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *[Path]:* its own step (the table).

> **[The creature]** · your summon ([Path])
> A Minion of your Stage, with Chapter 14's Medium ratings. 3 AP, no Reactions.
> **Basic attack:** as its rank's: 1 AP, At-will; what it rolls and its damage as the table says.
> **Build, chosen on a Rest:** its Path's own pick, and two picks from the menu.
> It takes its own turn right after each of yours (its own AP, its own start and end of turn), if you paid the Sustain at the start of that turn of yours. It can't Flank, summon, use Rally Points or be healed; it can be given Guard. It is a Minor enemy to its foes. It leaves when it goes Down, when you don't pay, and when the spell ends.

**The menu (every summon):** Reach 2 · a ranged Basic attack (Distance 5 sq.) · its Path's rider on its Basic attack's Tier 3 (Death's is Frightened of the summon) · Resist 2 to one subtype · it sheds Bright light 1 · a sense (it perceives Hidden creatures within 3 squares as Obscured).

| Path | The spell and its Flavor | The creature | Basic attack | The Path's own pick | The Path's Overcast step |
|---|---|---|---|---|---|
| **Fire** | **Kindle Sprite.** *You strike a spark and it doesn't go out: it looks at you.* | Ember Sprite | Power vs. Armor Defense, [V] Fi | It sheds Bright light 1 (the menu's pick, at no cost) | It flares: when it leaves, each creature adjacent to it takes [V] 1d6 Fi |
| **Air** | **Call the Gale.** *You whistle a note the wind remembers, and a piece of the storm comes down to you.* | Gale Wisp | Power vs. Armor Defense, [V] El | Difficult Terrain costs it no extra movement | It lands hard: when it appears, each creature adjacent to it is Pushed 1 from it |
| **Water** | **Shape the Tide.** *You pour out your waterskin, and what stands up from the puddle is taller than you.* | Tide Shape | Power vs. Armor Defense, [V] Co | The squares adjacent to it are Difficult Terrain for its enemies | It breaks like a wave: when it leaves, each creature adjacent to it is Hindered (1 round) |
| **Earth** | **Wake the Stone.** *You knock twice on the ground, and the ground gets up to answer.* | Stone Servant | Weapon vs. Armor Defense, [V] Bl | It can't be Pushed, Pulled, Slid or made Prone | It is quarried whole: it appears with Guard equal to your Power Modifier |
| **Astral** | **Call a Watcher.** *You name a star, and for a while it is closer than it should be.* | Star Watcher | Power vs. Ward Defense, [R] Fo | You perceive every creature it perceives, as it does | You speak through it: once on each of your turns, you can cast one [Spell] Action as if you stood in its square: its Distance, Line of Effect and Cover are measured from there. Whether you are Engaged is still yours. Not for a [Self] Action or a Reaction |
| **Death** | **Raise Dead.** *You call, and something that had stopped moving gets up.* | Risen Corpse | Weapon vs. Armor Defense, [R] Un | It can't be Frightened or Charmed | It rises from the fallen: it can appear in an unoccupied square adjacent to a creature that is Down and that you have Line of Effect to, whatever the Distance |
| **Nature** | **Call the Pack.** *You howl, badly, and something that does it better answers from the trees.* | Pack Beast | Weapon vs. Armor Defense, [V] Pi | Its Speed is 7 (an NPC's is 5) | It comes in at a run: when it appears, it can use its Basic attack once for 0 AP |
| **Glamour** | **Dream a Knight.** *You close your eyes and remember a hero from a story, and the story stands beside you.* | Dream Knight | Power vs. Ward Defense, [R] Ps | A creature more than 1 square from it perceives it as Obscured at best | It was never there: the first time it goes Down, it leaves and the spell doesn't end: at the start of your next turn, after you pay the Sustain, it appears with no damage in an unoccupied square within 3 squares of you |

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
> **Overcast:** *Reach, Breadth.* *Fire or Earth:* it pools where it lands: for 1 round, each square a target occupied when hit is Hazardous Terrain for every creature [HT: Turn]: [V] 1d4 Fi.

Fire's Lingering and Earth's Prone on one card, with Earth's damage subtype. No Surge cost: it is one creature, and the price of it is the second Path.

### 2. Mire
*Dominions: Water and Earth / Alteration. "Quagmire."*

> **Mire** · Earth 1 • Water 1 • Alteration 1 · Round · 2 AP
> *You press your palm to the ground and it forgets how to be solid.*
> [Power, Spell, Earth, Water, Alteration, Area]
> Distance: 5 sq. · Area: 1 Burst
> **Effect:** For 3 rounds, the Area is Difficult Terrain and Hazardous Terrain for every creature [HT: Turn]: Hindered (1 round).
> **Overcast:** *Reach, Hold (the Area).* *Earth or Water:* it swallows: the Area is also [HT: Entering].

The cheapest two-Path spell possible (1 • 1 • 1): what a caster gets on the day a second Path opens. By the sorting order it is an Alteration (it changes the ground; not held, no damage). An [Area], so no Breadth (decision 61).

### 3. Nightmare
*Dominions: Death and Glamour / Thaumaturgy. "Terror", "Nightmare".*

> **Nightmare** · Death 1 • Glamour 2 • Thaumaturgy 1 · Round · 2 AP · 1 Surge
> *You show your foe the thing it has never told anyone it fears, wearing your face.*
> [Power, Spell, Death, Glamour, Thaumaturgy, Fear, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** [R] 2d6 Ps; Frightened of you (2 rounds); Pressed 1 (2 rounds).
> **Tier 2:** Frightened of you (1 round).
> **Special:** On a Tier 1, a Minor enemy's first Action on its next turn must be an Advance that ends farther from you.
> **Overcast:** *Reach, Breadth, Hold (the Frightened).* *Death or Glamour:* it doesn't wake: on a Tier 2, the target is also Pressed 1 (1 round).

Both riders on its worst Tier, and damage: stronger than Terror or Beguile alone, so it carries a Surge cost. The Special is decision 39 (stronger against Minor enemies; part of a turn, never a whole one), in Terror's words.

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
> **Effect:** After the Save, for 2 rounds, the Area is Hazardous Terrain for every creature [HT: Turn]: [V] 1d6 Fi.
> **Overcast:** *Reach, Hold (the Hazardous Terrain).* *Fire:* the fire knows your friends: up to two creatures you choose in the Area aren't targets.
> **Overreach (3d6!):** This casting costs 1 Surge in place of 3. You can do this once an encounter.

Fireball one size up, with the ground left burning. **Three Surge is most of a first fight's budget** (the table above): at Momentum 0 its full price can't be paid before round 3, or round 2 after a Critical in round 1. With Momentum 2 it can open a fight, and its Overreach casts it in round 1 of any fight for 1 Surge and 3d6!. Its Overreach line passes one limit (its Surge cost), once, and says so (decision 59).

### 5. Iron Will (a 3 • 3 spell that costs no Surge)

> **Iron Will** · Astral 3 • Abjuration 3 · Turn · 1R
> *You say one word in your ally's mind, and it is their own name.*
> [Power, Spell, Astral, Abjuration]
> Distance: 10 sq. · Target: You or one ally
> **Interrupt:** An Action's result would make the target Frightened, Charmed, Confused or Dazed.
> **Effect:** The target gains none of those conditions from that Action.
> **Overcast:** *Reach.* *Astral:* the will turns: if that Action was an enemy's, that enemy is Dazed 1.

**It leans on two things not yet written:** an Interrupt on "would gain a condition" (decided on 2026-11-19, decision 81; Chapter 2 not changed yet), and Charmed and Confused, which are drafts in the second pass and not in Chapter 8. **Written to test decision 69's other half:** a high spell that is different, not stronger. It is Stone Ward's size (Earth 1 • Abjuration 1) and answers the mind where Stone Ward answers the body. **A question it raises:** does a 3 • 3 spell that is no stronger than a 1 • 1 feel like a reward for about forty won fights of Mastery (level 3 is 20 Mastery in each)?

---

## What the fourth pass showed

1. **Surge makes Overcast a choice.** Five Surge in a first fight against six or more free steps before: a caster now picks which casting to stretch.
2. **Momentum decides when big magic arrives.** At Momentum 0, a 3 Surge spell waits for round 3 unless a Critical or an Overreach line brings it forward; at Momentum 2, it opens the fight. This is "pay for pressing on" working, and it is also the one place a nova can come from.
3. **Surge replaced the Encounter Frequency on every card it touched** (the summons, Earthquake). Encounter is left for spells that must truly happen once (Sleep, Compel, Terror).
4. **A casting can cost three things at once:** AP, a printed Surge cost, and Surge for steps. With Overreach, four. It is the most a player has to add up on one card.
5. **Two-Path spells need no new rule beyond decision 63.** "Fire or Earth" on the Overcast line reads cleanly.
6. **A high spell that isn't stronger** (Iron Will) is easy to write and may be hard to want.
7. **Two gaps in the Surge rule, for Lucas.** Outside an encounter there is no Surge, so a spell with a Surge cost (every summon, Fireball) can't be cast before Initiative: no summon to scout with. And an NPC has no Escalation (Chapter 2), so an NPC caster can't pay Surge at all.

## The audit: what the independent reader changed

| Where | Finding | Now |
|---|---|---|
| Flame Storm, Magma Bolt | [HT: Entering] damages every creature in the area the moment it appears (Chapter 3), the spared friends included | [HT: Turn] |
| Magma Bolt | "Until the end of the target's next turn" isn't a duration Chapter 2 allows; "the square" was unclear for a Large target or a Breadth casting | "For 1 round"; "each square a target occupied" |
| Mire | Terrain that gives Hindered is Hazardous Terrain and had no [HT] mark; its step could never fire (nothing in Mire makes a creature Prone) | Marked [HT: Turn]; the step adds [HT: Entering] |
| Nightmare | Its step did nothing (a duration in rounds has no early end); "a Move Action" includes Stand and Crawl; Hold named no duration; [Fear] was missing | A new step; Terror's "an Advance"; Hold (the Frightened); [Fear] added |
| Iron Will | "That condition" was unclear when an Action gives two; its two unwritten rules went unsaid | "None of those conditions"; both named in its note |
| The summons | "Free square" isn't a rulebook word; Fire's own pick duplicated a menu pick; a rank has no Speed; the summon's turn inside yours broke per-turn limits; the Dream Knight's return and the Star Watcher's step left Sustain, Cover and Engaged open; "Frightened of you" on a summon's attack | "Unoccupied square"; the menu's light at no cost; "Speed 7"; its own turn after yours; each step now says |
| The notes | Three sentences on when Flame Storm can be cast ignored a Critical and its own Overreach | Rewritten |
| The Surge draft | Silent on Surge outside an encounter and on NPC casters | One sentence added; both raised as finding 7 |

## Assumptions I made (Lucas can revert any)

- A summon costs 1 Surge and is Round, not Encounter.
- A summon's Path gives one pick of its own, beside the two from the menu.
- "Surge has no maximum of its own" (it can't pass your Escalation anyway).
- Overreach lines on Flame Storm only; the six of `magic-overreach-lines.md` stand, except Earthquake's, which its new Surge cost replaces.
- The two-Path notation: both Paths, then the School, joined by "•".
