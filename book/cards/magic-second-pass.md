# Magic, the second pass: twenty-six spells against the basics as they now stand

**2026-11-18, asked by Lucas:** "Do A. Do a double pass to make sure you haven't forgotten anything." A is: revise the seventeen cards of `magic-first-pass.md` with everything decided since (decisions 36 to 44 of `book/magic-design.md`) and add the ones the first pass couldn't draw.

**A test of the basics, not a spell list. Nothing here is decided, nothing is in the book. Every number is a placeholder** [not priced: the SIM has no caster], set by eye against the Stage 0 cards (a Longsword's 1[W] + [Mod] is about 10 on a Tier 2 and 14 on a Tier 3).

**The double pass.** Pass one: Claude wrote 24 cards. Pass two: Claude checked them against the 44 decisions, and an independent reader who had not written them audited the file against the record, the charter and the rulebook. The reader reported 36 findings; Claude verified the main ones in the rules and rewrote the file. **This is the corrected version.** What the checks found is the last section; it is the most useful part of the pass.

---

## What every card here assumes (from the record; drafts where marked)

- **A spell** is a Power Action with [Spell], one Path and one School. Every spell also has [Focus] (decision 7); it is left off the trait lines here to keep them short, and a real card would print it, as the Stage 0 cards do.
- **Power Actions don't add their Modifier to damage** (Chapter 1: "their damage is the dice on the card"). No Tier here writes [Mod]. A card with no roll writes "your Power Modifier".
- **The bar:** name · the minimums · Frequency · cost.
- **Overcast** lists the form ladders the spell may climb, then its own substance step. A step needs a spare level in its axis; a casting holds as many steps as your Escalation minus 1 (decision 43). **Reach:** +2 squares a step. **Breadth:** +1 creature a step. **Hold:** +1 round a step, on a duration written in rounds (never on EoT). A substance step is taken once.
- **On every spell, not repeated:** **Merge** (a substance step: the rider of a second Path you have, in the rider slot; the spell gains that Path's trait) and **Overreach** (once a casting, one step you couldn't otherwise take, for 1d6! Nonlethal Resolve damage that nothing absorbs).
- **Held magic:** [Woven] (you hold one; casting another ends it) and [Sustained] ("Sustain: 1 AP" at the start of your turn, or it ends). Both end when you go Down, when you choose, when the encounter ends, and when you become Bloodied or Strained.

**Drafts this pass needed (each is a proposal):**

1. **The riders as full lines.** A rider is put on **an enemy**: a spell that targets no enemy can't take one. A rider added by a step or a Merge lands on a Strike's **Tier 3** and on a Save's **Tier 1**.

| Path | Its rider, in full | Path | Its rider, in full |
|---|---|---|---|
| Fire | Lingering 1d4 Fi (Bo/In) | Astral | Dazed 1 |
| Air | Pushed 2 | Death | Frightened of you (1 round) |
| Water | Hindered (1 round) | Nature | Immobilized |
| Earth | Prone | Glamour | Pressed 1 (1 round) |

2. **Two new conditions** (decision 39's shapes), reworded after the audit:
   - **Charmed** is always **by** a creature (a condition with a source). You can't target that creature with an Action unless it is willing, and your Areas don't affect it. It ends when that creature or one of its allies damages you.
   - **Confused (1 round):** the next [Strike] Action you use must target the creature nearest to you that it could target, friend or foe (you choose among the nearest). Then Confused ends.
3. **[Ranged].** A spell is [Ranged] when it is a [Strike] with a Distance beyond Reach, so it is Doomed while Engaged like any shot. A [Save] spell and a spell with no roll are not: the caster rolls nothing that could be Doomed. (The Stage 0 cards do the same: Rebuke and Shield of Faith have a Distance and no [Ranged].) **This leaves the review's B3 open:** a Save spell cast while Engaged pays nothing for it.
4. **The poison subtype** is written **Po**.

---

## The cards

### 1. Fire Darts
> **Fire Darts** · Fire 1 • Evocation 1 · At-will · 1 AP
> *You flick your hand and a dart of flame leaps from your fingers.*
> [Power, Spell, Fire, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature
> **Attack:** Power vs. Armor Defense
> **Tier 2:** [V] 1d8 Fi.
> **Tier 3:** [V] 2d6 Fi.
> **Overcast:** *Reach, Breadth.* *Fire:* on a Tier 3, the target also takes Fire's rider.

"A second dart" is Breadth (+1 creature). Its own step is the rider.

### 2. Shocking Grasp
> **Shocking Grasp** · Air 1 • Evocation 1 · Round · 1 AP
> *Lightning crawls over your hand, and you lay it on your foe.*
> [Power, Spell, Air, Evocation, Strike]
> Distance: Reach · Target: One creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] 1d4 El.
> **Tier 2:** [V] 2d8 El.
> **Tier 3:** [V] 2d8 El; Staggered (EoT).
> **Overcast:** *Reach.* *Air:* on a Tier 3, the lightning jumps: one creature adjacent to the target takes [V] 1d8 El.

With a rung of +2 squares, one Reach step makes it a 3-square spark, not Lightning Bolt: the touch-to-range fold of the first pass is gone, and Lightning Bolt would be its own card. Its Tier 3 uses Staggered, Air's runner-up, as its own rider (decision 24).

### 3. Fireball
> **Fireball** · Fire 2 • Evocation 1 · Round · 2 AP
> *A bead of fire streaks from your palm and bursts among your foes.*
> [Power, Spell, Fire, Evocation, Area, Save]
> Distance: 10 sq. · Area: 1 Burst · Target: All creatures in the Area
> **Save:** Instinct
> **Tier 1:** [V] 2d6 Fi.
> **Tier 2:** [V] 1d6 Fi.
> **Overcast:** *Reach.* *Fire:* the Area burns for 1 round: Hazardous Terrain for every creature [HT: Turn]: [V] 1d4 Fi.

No Breadth: **2d12's areas have no small rung** (a 1 Burst is 4 squares, a 2 Burst 12). The lingering fire is [HT: Turn] only, because a creature in an area when it appears "is treated as entering it" and would be burned twice at once.

### 4. Stoneskin
> **Stoneskin** · Earth 1 • Alteration 1 · Round · 1 AP
> *You press your palm to skin, and it greys and hardens like rock.*
> [Power, Spell, Earth, Alteration]
> Distance: Reach · Target: You or one willing creature
> **Effect:** The target has Resist 2 Blunt, Pierce and Slash, and Weak 2 Cold (2 rounds).
> **Overcast:** *Breadth, Hold.* *Earth:* rooted like rock: the target also ignores the Prone condition.

Decision 33's "rounds is the main way" for a buff. Its own step is a new thing, not a bigger number.

### 5. Earth Grip
> **Earth Grip** · Earth 1 • Alteration 1 · Round · 1 AP
> *The ground opens under your foe's feet and closes around its ankles.*
> [Power, Spell, Earth, Alteration, Save]
> Distance: 5 sq. · Target: One creature
> **Save:** Body
> **Tier 1:** Immobilized. Its Break Free needs a Body Check against your Power DC.
> **Tier 2:** Immobilized.
> **Overcast:** *Reach, Breadth.* *Earth:* the ground stays broken: the target's square and those adjacent to it are Difficult Terrain (1 round).

One condition now (the first version had three). **An open point:** its main effect is Nature's rider. Decision 24 says a spell has no fixed shape, but nobody has decided whether one Path's main effect may be another Path's rider.

### 6. Regrowth (was Healing Touch)
> **Regrowth** · Nature 1 • Alteration 1 · Round · 1 AP
> *You lay a hand on a wound, and new skin creeps over it like bark over a cut branch.*
> [Power, Spell, Nature, Alteration]
> Distance: Reach · Target: You or one willing creature
> **Effect:** For 2 rounds, when the target starts its turn, it gains Guard equal to 1 + your Power Modifier.
> **Overcast:** *Breadth, Hold.* *Nature:* the growth draws poison out: when cast, the target also ends one Lingering on it.

Decision 36: Guard, not Health. **Its School is arguable:** the sorting sends "the Path released on a target, to harm or to heal" to Evocation before it reaches Alteration, and Guard is neither harm nor healing.

### 7. Twist Fate
> **Twist Fate** · Astral 1 • Enchantment 1 · Round · 1 AP
> *You pluck a thread only you can see, and the blow that was coming goes astray.*
> [Power, Spell, Astral, Enchantment, Woven]
> Distance: 5 sq. · Target: You or one willing creature
> **Effect:** The next instance of damage the target takes is reduced by 2d6. Then this spell ends.
> **Overcast:** *Reach.* *Astral:* the thread holds twice: it ends after the second instance.

### 8. Sleep
> **Sleep** · Glamour 1 • Thaumaturgy 1 · Encounter · 2 AP
> *You murmur a word, and your foe's eyes grow heavy.*
> [Power, Spell, Glamour, Thaumaturgy, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** Dazed 2. A Minor enemy is Unconscious (1 round) instead; it also wakes when it takes damage.
> **Tier 2:** A Minor enemy takes the Tier 1 result.
> **Overcast:** *Reach, Breadth.* *Glamour:* it wakes muddled: when its Unconscious or Dazed ends, it takes Glamour's rider.

**Changed after the audit:** the first version put a PC or a major enemy Unconscious for a round, which is the lost turn decision 39 objects to. Now only a Minor enemy sleeps; anyone else loses 2 AP. It names two conditions where the charter allows one: the Minor-enemy clause would need to be an accepted exception. Waking uses Chapter 4's own rule (the Interact Action), with damage added.

### 9. Fire Shield
> **Fire Shield** · Fire 1 • Enchantment 1 · Round · 1 AP
> *Flames wreathe you, close as a cloak; whoever strikes you reaches through them.*
> [Power, Spell, Fire, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, a creature that damages you with a [Melee] Action takes [V] 1d4 Fi.
> **Overcast:** *Fire:* the flames cling: it also takes Fire's rider.

### 10. Chain Lightning
> **Chain Lightning** · Air 2 • Evocation 2 · Round · 2 AP
> *A bolt cracks from your hand and leaps from one foe to the next.*
> [Power, Spell, Air, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature, then one more adjacent to it
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] 1d4 El.
> **Tier 2:** [V] 1d10 El.
> **Tier 3:** [V] 2d8 El.
> **Overcast:** *Reach, Breadth.* *Air:* on a Tier 3, each target is also Pushed 2 away from the target before it (the first, away from you).

Each leap is a Breadth step ("one more creature, adjacent to the last target"). One rider only: the Staggered of the first version is gone.

### 11. Bonds of Fire
> **Bonds of Fire** · Fire 1 • Alteration 1 · Round · 1 AP
> *A ring of fire springs up around your foe, close enough to singe.*
> [Power, Spell, Fire, Alteration]
> Distance: 10 sq. · Target: One creature
> **Effect:** For 1 round, the first time the target leaves its square with a Move Action, it takes [V] 2d6 Fi.
> **Overcast:** *Reach, Breadth, Hold.* *Fire:* the ring tightens: at the end of its turn, if it hasn't left, it takes [V] 1d4 Fi.

**Tightened after the audit:** "the first time" and "with a Move Action", so allies can't Push it out for automatic damage. Its School is as arguable as Regrowth's (its only effect is damage: an Evocation by the sorting's fourth line).

### 12. Mirror Image
> **Mirror Image** · Glamour 1 • Enchantment 1 · Round · 1 AP
> *You blur, and where one of you stood there are three.*
> [Power, Spell, Glamour, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, [Strike] Actions against you are Doomed. It ends after the second such Strike, whatever its result.
> **Overcast:** *Glamour:* the last image covers your step: when this spell ends, you Evade 2.

### 13. Poison Cloud
> **Poison Cloud** · Nature 2 + Air 1 • Evocation 1 · Round · 2 AP
> *You breathe out, and a green fog rolls from your mouth and settles.*
> [Power, Spell, Nature, Air, Evocation, Area]
> Distance: 10 sq. · Area: 1 Burst
> **Effect:** For 2 rounds, the Area is Hazardous Terrain for every creature [HT: Entering, Turn]: [V] 1d6 Po.
> **Overcast:** *Reach, Hold.* *Nature:* the venom stays in the blood: a creature that takes this damage also takes Lingering 1d4 Po (Bo/In).

**Not covered by any decision:** a spell written with two Paths. The record says a spell has one Path, and a second enters only by Merge. Dominions has 188 such spells; whether 2d12 has any is a question for Lucas.

### 14. Drain Life
> **Drain Life** · Death 2 • Evocation 1 · Round · 2 AP
> *You close your hand, and your foe's warmth runs out of it and into you.*
> [Power, Spell, Death, Evocation, Ranged, Strike]
> Distance: 5 sq. · Target: One creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [R] 1d4 Un.
> **Tier 2:** [R] 2d6 Un; you gain Guard equal to half the damage dealt.
> **Tier 3:** [R] 2d6 Un; you gain Guard equal to the damage dealt.
> **Overcast:** *Reach.* *Death:* on a Tier 3, the target also takes Death's rider.

"One living creature" is now "One creature": "living" needs the Tags, which aren't written.

### 15. Raise Dead, with the summons rule
> **Raise Dead** · Death 1 • Conjuration 1 · Encounter · 2 AP
> *You call, and something that had stopped moving gets up.*
> [Power, Spell, Death, Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** Your summon appears in a free square within the Distance and acts at once. If you had another summon, it leaves.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *Death:* it rises from the fallen: it can appear in the square of any creature that went Down this encounter, whatever the Distance.

**The summon it calls** (decision 44; built on a Rest, written once on the sheet):

> **Risen Corpse** · your summon (Death)
> A Minion of your Stage, with Chapter 14's Medium ratings. 3 AP, no Reactions.
> **Basic attack:** as its rank's: 1 AP, At-will, Weapon vs. Armor Defense; its damage is [R] Un.
> **Build: two picks from the menu.** Chosen here: *Reach 2* · *the Path's rider on its Basic attack's Tier 3* (Frightened of it (1 round)).
> It acts on your turn, after you, if you paid the Sustain. It can't Flank, summon, use Rally Points or be healed; it can be given Guard. It is a Minor enemy to its foes. It leaves when it goes Down, when you don't pay, and when the spell ends.

**The menu** (a draft; written once for every summon): Reach 2 · a ranged Basic attack (Distance 5 sq.) · the Path's rider on its Basic attack's Tier 3 · Resist 2 to one subtype · it sheds Bright light 1 · a sense (it perceives Hidden creatures within 3 squares as Obscured) · a movement (when Flying and Climbing are written: both are still to be written in Chapter 3).

### 16. Air Shield
> **Air Shield** · Air 1 • Abjuration 1 · Turn · 1R
> *You sweep an arm, and a hard gust turns the shot aside.*
> [Power, Spell, Air, Abjuration]
> Distance: 5 sq. · Target: You or one ally
> **Interrupt:** A [Ranged, Strike] Action would target the target.
> **Effect:** That Action takes 2 Pressure Banes against the target.
> **Overcast:** *Reach.* *Air:* if that Action gets a Tier 1 against the target, its origin is Pushed 1.

**Corrected:** Pressure Banes, not Field. Field is Cover, Prone and shooting into a melee, and same-name Banes add up to 2 only, so Field Banes would have done nothing exactly when the target was already hard to hit.

### 17. Phoenix Pyre
> **Phoenix Pyre** · Fire 2 • Enchantment 2 · Encounter · 1 AP
> *You swallow a spark and keep it burning under your heart.*
> [Power, Spell, Fire, Enchantment, Woven, Area, Save, Self]
> Area: 1 Emanation · Target: All creatures in the Area but you
> **Effect:** While this spell is woven, when damage would take you Down, it is reduced until it leaves you 1 short of Down. Then the Area's creatures make the Save, and this spell ends.
> **Save:** Instinct
> **Tier 1:** [V] 3d6 Fi.
> **Tier 2:** [V] 1d6 Fi.
> **Special:** Becoming Bloodied or Strained doesn't end this spell.
> **Overcast:** *Fire:* you rise out of it: after the Save, you Stand and Evade 3.

**The audit caught a real break in the first rewrite.** The Health Pool is Vigor plus Resolve, so nobody gets within 1 of Down without first becoming Bloodied or Strained, and a Woven spell ends on either: the spell could never fire. It needs its own rule (the Special line), which is decision 34 doing its job. It no longer touches Rally Points (decision 36).

### 18. Beguile (a charm)
> **Beguile** · Glamour 1 • Thaumaturgy 1 · Round · 2 AP
> *You meet your foe's eyes, and for a moment it can't remember why it wanted to hurt you.*
> [Power, Spell, Glamour, Thaumaturgy, Save]
> Distance: 5 sq. · Target: One creature
> **Save:** Appeal
> **Tier 1:** Charmed by you (2 rounds).
> **Tier 2:** Charmed by you (1 round).
> **Overcast:** *Reach, Breadth, Hold.* *Glamour:* your friends seem its friends: while it is Charmed by you, one ally you choose when you cast also counts as you for it.

No turn is lost: the creature goes on fighting, only not against you.

### 19. Compel (one forced Action)
> **Compel** · Astral 2 • Thaumaturgy 1 · Encounter · 2 AP
> *You speak one word in a voice that isn't yours, and your foe's body obeys before its mind can refuse.*
> [Power, Spell, Astral, Thaumaturgy, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** The target at once does one of these, as you choose: it Advances where you direct, or it makes a Weapon Attack (1A) against a creature you choose.
> **Tier 2:** A Minor enemy takes the Tier 1 result.
> **Overcast:** *Reach.* *Astral:* the word echoes: on a Tier 1 it does both, in the order you choose.

The first version's Tier 2 (Dazed 1) is gone: one thing a card. **Two points for when it becomes real:** an Action used outside one's turn must be a Reaction (Chapter 2), so this is the spell making a creature act, which needs its sentence; and a forced Advance can walk a creature into Hazardous Terrain or a Deadly Hazard, where "by its own movement" lets it choose to be killed. (The three Strikes are not a problem: a Linked Action doesn't count toward them.)

### 20. Bewilder (a confusion)
> **Bewilder** · Glamour 1 • Thaumaturgy 1 · Round · 1 AP
> *You turn your hand, and the battlefield turns with it in your foe's eyes.*
> [Power, Spell, Glamour, Thaumaturgy, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** Confused (1 round).
> **Overcast:** *Reach, Breadth.* *Glamour:* it doubts the next blow too: Confused ends after its second Strike.

One condition, and nothing on a Tier 2. The creature keeps its turn and its choices: it can decline to Strike, or step away from its friends first.

### 21. Kindle Sprite (a second summon, to test the menu)
> **Kindle Sprite** · Fire 1 • Conjuration 1 · Encounter · 2 AP
> *You strike a spark and it doesn't go out: it looks at you.*
> [Power, Spell, Fire, Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** Your summon appears in a free square within the Distance and acts at once. If you had another summon, it leaves.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *Fire:* it flares: when it leaves, each creature adjacent to it takes [V] 1d6 Fi.

> **Ember Sprite** · your summon (Fire)
> A Minion of your Stage, with Chapter 14's Medium ratings. Basic attack as its rank's, Power vs. Armor Defense, [V] Fi.
> **Build:** *a ranged Basic attack* · *it sheds Bright light 1*. The other lines as the Risen Corpse's.

The two summon spells differ only in their Path, their own step and the build. **A question:** one Summon spell with the Path carried by the build, or a summon spell for each Path?

### 22. Terror (stronger against Minor enemies)
> **Terror** · Death 2 • Thaumaturgy 1 · Encounter · 2 AP
> *You let them see, for a heartbeat, what waits for all of them.*
> [Power, Spell, Death, Thaumaturgy, Fear, Area, Save, Self]
> Area: 2 Emanation · Target: All enemies in the Area
> **Save:** Appeal
> **Tier 1:** Frightened of you (2 rounds). A Minor enemy's first Action on its next turn must be an Advance that ends farther from you.
> **Tier 2:** Frightened of you (1 round).
> **Overcast:** *Hold.* *Death:* the fear is cold: on a Tier 1, [R] 1d6 Un.

Everyone is Frightened, which leaves a turn whole; only Minor enemies lose part of one. "A Minor enemy" is Chapter 14's own term. It has the [Fear] trait, which Chapter 7 keeps for other rules to read.

### 23. Unravel (a counterspell)
*Not from Dominions, which has no battle counterspell; the idea is Ars Magica's.*

> **Unravel** · Astral 1 • Abjuration 2 · Encounter · 1R
> *You catch the loose end of another's spell as it leaves their hand, and pull.*
> [Power, Spell, Astral, Abjuration]
> Distance: 10 sq. · Target: One creature
> **Interrupt:** The target would use a [Spell] Action.
> **Attack:** Power vs. the target's Power DC
> **Tier 2:** The target chooses: its spell is disrupted, or it takes 1d6! Nonlethal Resolve damage and the spell goes on.
> **Tier 3:** That spell is disrupted.
> **Overcast:** *Reach.* *Astral:* the snapped thread whips back: on a Tier 3, the target also takes Astral's rider.

**Changed after the audit:** Encounter (a trigger that fires every round against a caster is what the charter calls disruptive); and the Tier 2 no longer strips Overcast steps, which did nothing against NPCs (they have no Escalation). It now hands the caster a choice in Overreach's own coin. **It is the one card here that asks more of the School than of the Path** (Abjuration 2): a technique, not raw power.

### 24. Blink (a teleport)
> **Blink** · Astral 1 • Alteration 1 · Round · 1 AP
> *You step sideways out of the world and back into it somewhere near.*
> [Power, Spell, Astral, Alteration, Self]
> **Effect:** You teleport to a free square you can see within 3 squares.
> **Overcast:** *Reach (the 3 squares become 5).* *Astral:* you take one willing creature adjacent to you along, to a free square adjacent to where you arrive.

**"Teleport" is a new word** and needs its rule: it isn't movement (nothing it would trigger or cross applies), and the rule must say whether it is "leaving your square" (Bonds of Fire, Grabbed) and whether it works while Immobilized or Prone (it isn't a Move Action, so as written it does).

### 25. Quicken (Water; a buff you sustain)
*Dominions: Quickness (Water 1 personal, Water 2 on another): twice as many actions. Added after the checks: the first 24 cards had no Water spell.*

> **Quicken** · Water 1 • Enchantment 1 · Round · 1 AP
> *You touch your ally's brow, and the world slows around them like a river in winter.*
> [Power, Spell, Water, Enchantment, Sustained]
> Distance: Reach · Target: One willing creature other than you
> **Effect:** While you sustain this spell, the target is Quickened 1.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *Water:* the current carries them: the target also ignores Difficult Terrain.

It tests the third way for a buff (decision 33): you give one of your AP every turn so an ally has one more. Quickened is Chapter 8's own condition and gives its AP when the target next regains AP, so the first turn you pay for nothing. Whether that trade is ever worth it is a pricing question.

### 26. Sunder Weave (a dispel)
*Added after the checks: the record says a dispel is the answer to an enemy's held magic, and no card tested it.*

> **Sunder Weave** · Astral 1 • Abjuration 1 · Round · 2 AP
> *You find the knot that holds another's magic together and cut it.*
> [Power, Spell, Astral, Abjuration, Ranged, Strike]
> Distance: 10 sq. · Target: One creature that holds a [Woven] or [Sustained] spell
> **Attack:** Power vs. the target's Power DC
> **Tier 2:** One [Woven] spell the target holds ends (your choice).
> **Tier 3:** One [Woven] or [Sustained] spell the target holds ends (your choice); a summon leaves.
> **Overcast:** *Reach.* *Astral:* the cut spell snaps back: on a Tier 3, the target also takes Astral's rider.

By the [Ranged] draft it is a ranged Strike, so it is Doomed while Engaged: a dispeller has to keep their distance, which is a real cost. Whether "a [Strike]" should cover an attack on a spell and not on a creature is worth a look.

---

## Three castings worked through

*No card above shows the growth rules in use; the checks asked for it.*

**A. Round 1, no Momentum, an opener.** Nari has Fire 1, Evocation 1 and Escalation 1. He casts Fire Darts. He has no spare level and no Escalation to spend, so no step is his by right. He **Overreaches** for the Breadth step: he takes 1d6! Nonlethal Resolve damage (he rolls 3) and the dart strikes two creatures on one roll. Cost: 1 AP and 3 of his Health.

**B. Round 3, spare levels.** Later Nari has Fire 2, Evocation 3 and Escalation 3. Fire Darts needs 1 and 1, so he has 1 spare Fire level and 2 spare Evocation levels; Escalation 3 allows two steps. He takes one Breadth step (two creatures) and one Reach step (12 squares). He could have taken Breadth twice (three creatures), since he has two spare Evocation levels and the ladders have no cap of their own. He can't take a third step this round without Overreach.

**C. A Merge.** Same round, Nari also has Air 1. He casts Fireball (Fire 2 • Evocation 1): no spare Fire level, so the Merge, which is a substance step, is not his by right. He Overreaches for it (he rolls 6, which explodes: 5, then 2: 7 Nonlethal Resolve damage) and adds Air's rider: every creature that gets a Tier 1 on its Save is also Pushed 2, and this Fireball is a [Fire, Air] spell. His two free steps are still unused: with 2 spare Evocation levels he adds Reach twice (14 squares).

**What the three showed:** (1) the rules resolve without a judgment call; (2) **Overreach is cheap for what it buys in B and C and dear in A**, because its price is flat and a step's worth isn't; (3) a 7 on one Overreach is a quarter of a level 1 caster's Health; (4) **a Merge that Pushes from an area needs "away from the Point of Origin"**, one more line for the rider table.

---

## What the second pass showed

### Holds
1. **All 26 could be written,** and the ones that were impossible before (control, summons, a counter, a dispel, a teleport) are as short as the others.
2. **The small rungs work on single-target spells and buffs:** one more dart, one more leap, one more ally, one more round.
3. **Guard as magic's healing works** and gave Nature a different card from the Paladin's.
4. **The control shapes hold, after one correction:** Beguile, Compel and Bewilder take no turn from anyone. Sleep and Terror take part of a turn only from Minor enemies.
5. **The summons rule fits on a stat block.**

### Found (to decide or write)
| # | Finding | Seen on | Needs |
|---|---|---|---|
| 1 | **Area spells have no small Breadth rung** | Fireball, Poison Cloud | Area spells don't climb Breadth; a change to decision 43's last line |
| 2 | **The sorting rule must ask "does it bring a body?" before "is it held?"** | Raise Dead, Kindle Sprite | Conjuration first |
| 3 | **The sorting's "to harm or to heal" line catches spells that only damage or only give Guard** | Regrowth, Bonds of Fire, Poison Cloud | The Evocation line sharpened, or these moved |
| 4 | **One Summon spell with the Path in the build, or one a Path?** and the menu written once | 15, 21 | A decision |
| 5 | **Two new conditions (Charmed by, Confused) and one new word (teleport)** | 18, 20, 24 | Their rules; the audit found five holes in the first drafts |
| 6 | **A spell with two Paths written on it** | Poison Cloud | Decided nowhere |
| 7 | **May a spell's main effect be another Path's rider?** | Earth Grip, Sleep | A ruling under decision 24 |
| 8 | **The one-condition rule against the Minor-enemy clause** | Sleep | An exception, or one result only |
| 9 | **[Ranged] on spells, and the Save spell that pays nothing while Engaged** (the review's B3) | header draft 3 | A rule; six Save spells here dodge it |
| 10 | **A forced Action outside the target's turn; a forced Advance and hazards** | Compel | Two sentences |
| 11 | **A summon's stats:** Chapter 14 gives ratings and points an AP, not a ready block | 15, 21 | Which ratings a summon has |
| 12 | **Hold doesn't apply to EoT** | 18, 22 | Durations in rounds on any Tier that Hold should lengthen |
| 13 | **The riders are still unequal** (Dazed 1 takes an AP; Immobilized has no duration; Pressed 1 is small) | the rider table | Lucas: "riders aren't ever going to be rated perfectly"; noted, not fixed |
| 14 | **Overreach's flat price** against steps of very different worth | the worked castings | Pricing, or a price that follows the step |
| 15 | **Not exercised by any card:** one [Woven] spell over several allies; a spell that needs no enemy and takes a Merge | | Later cards |
| 16 | **Every number is unpriced** | all | A caster in the SIM |

### The double pass: what the checks changed

**The independent reader's findings that were right and changed a card** (36 reported; the main ones verified in the rulebook):

| What was wrong | Where | The rule it broke |
|---|---|---|
| [Mod] added to spell damage on ten cards | 1, 2, 10, 14 and several steps | Chapter 1: "Power Actions don't add their Modifier to damage on any Tier" |
| Phoenix Pyre could never fire | 17 | Chapter 4: the pool is Vigor + Resolve, so Bloodied or Strained always comes first and ends a Woven spell |
| Sleep took a whole turn from a PC or a major enemy | 8 | Decision 39 |
| Two or three conditions on a Round card | 5, 8, 20, 13's step | The charter's rule 3 |
| "Until the end of your next turn" | 3's step | The charter: EoT or rounds only |
| Fireball's fire burned everyone twice at once | 3's step | Chapter 3: a creature in an area when it appears "is treated as entering it" |
| Field Banes that did nothing when it mattered | 16 | Chapter 1: Banes of one name add up to 2 |
| Sickened (EoT) that ended as it was given | 13's step | EoT is the end of the affected creature's turn |
| Bonds of Fire could be set off by an ally's Push | 11 | Chapter 3: Forced Movement is leaving a square |
| Unravel's Tier 2 did nothing against NPCs, and fired every round | 23 | The review's own note that NPCs have no Escalation; the charter's rule 16 |
| The summons' "two picks" had a two-item menu; "the Minion row's damage" doesn't exist; "one summon at a time" was written nowhere; Flying isn't written | 15, 21 | Decision 44; Chapters 14 and 3 |
| Own steps that were only a bigger number | 4, 12, 17 | The record's own reading of "substance" as options |
| Own steps that added a second rider | 5, 10 | Decision 26: a spell never carries two |
| [Ranged] put on some distance spells and not others | many | No rule at all: a draft was written |
| Undefined words: "living", "standing on the ground", "the last creature struck", "flees" | 14, 5, 10, 22 | The least ambiguity |
| Charmed: no end when the charmer attacks; a [Self] Area isn't "placed"; a Shove wasn't covered | the header | Reworded |
| Confused: no valid target meant it never ended | the header | Reworded, with a duration |
| Three claims in this file's own summary that the cards didn't support | the first version's tables | Corrected |

**What Claude's own check found:** no Water spell in 24 cards (Quicken added); no card that asks more of the School than of the Path (Unravel now does); no dispel (Sunder Weave added); no casting worked through (three added).

**The lesson for the cards to come:** the first version read well and had one card that could never work, ten that broke a core damage rule, and one that did the thing Lucas had just ruled against. A second reader with the rulebook open is worth its cost on every batch.
