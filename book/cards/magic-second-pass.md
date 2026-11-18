# Magic, the second pass: twenty-four spells against the basics as they now stand

**2026-11-18, asked by Lucas:** "Do A. Do a double pass to make sure you haven't forgotten anything." A is: revise the seventeen cards of `magic-first-pass.md` with everything decided since (decisions 36 to 44 of `book/magic-design.md`) and add the ones the first pass couldn't draw: a charm, a forced Action, a confusion, a built summon, a spell that is stronger against Minor enemies, a counterspell, a teleport.

**A test of the basics, not a spell list. Nothing here is decided, nothing is in the book. Every number is a placeholder** [not priced: the SIM has no caster], set by eye against the Stage 0 cards (a Longsword's 1[W] + [Mod] is about 10 on a Tier 2 and 14 on a Tier 3).

**The double pass.** Pass one: Claude wrote the cards. Pass two: each card was checked line by line against all 44 decisions, the charter and the rules it uses, once by Claude and once by an independent reader who had not written them. What the checks changed is in "The double pass" at the end.

---

## What every card here assumes (from the record; drafts where marked)

- **A spell** is a Power Action with [Spell], one Path and one School. **[Spell] carries [Focus]** (decision 7: every spell needs concentration), so Focus is not printed on each card. [Mod] is the Power Modifier.
- **The bar:** name · the minimums · Frequency · cost.
- **Overcast** lists the form ladders the spell may climb, then its own substance step. A step needs a spare level in its axis; a casting holds as many steps as your Escalation minus 1 (decision 43). **Reach:** +2 squares a step. **Breadth:** +1 creature a step. **Hold:** +1 round a step. A substance step is taken once unless the spell says otherwise.
- **On every spell, not repeated:** **Merge** (a substance step: the rider of a second Path you have, in the rider slot; the spell gains that Path's trait) and **Overreach** (once a casting, one step you couldn't otherwise take, for 1d6! Nonlethal Resolve damage that nothing absorbs).
- **Held magic:** [Woven] (you hold one; casting another ends it) and [Sustained] ("Sustain: 1 AP" at the start of your turn, or it ends). Both end when you go Down, when you choose, when the encounter ends, and when you become Bloodied or Strained.

**Drafts this pass needed (each is a proposal):**

1. **The riders as full lines** (the review's B5), and where a Merged rider lands: on a Strike's **Tier 3**, on a Save's **Tier 1**, in the Effect of a spell with no roll.

| Path | Its rider, written in full |
|---|---|
| Fire | Lingering 1d4 Fi (Bo/In) |
| Air | Pushed 2 |
| Water | Hindered (1 round) |
| Earth | Prone |
| Astral | Dazed 1 |
| Death | Frightened of you (1 round) |
| Nature | Immobilized |
| Glamour | Pressed 1 (1 round) |

2. **Two new conditions** (decision 39's shapes):
   - **Charmed** is always **by** a creature (a condition with a source, as Taunted is). You can't target that creature with an Action that would damage it or give it a condition, and an Area you place can't include it.
   - **Confused:** your next [Strike] Action must target the creature nearest to you, friend or foe (you choose among the nearest). Then Confused ends.
3. **One sentence for a ladder that changes a trait** (the review's B4): a spell whose Distance becomes more than your Reach gains [Ranged] for that casting.
4. **The poison subtype** is written **Po**.

---

## The seventeen, revised

### 1. Fire Darts
> **Fire Darts** · Fire 1 • Evocation 1 · At-will · 1 AP
> *You flick your hand and a dart of flame leaps from your fingers.*
> [Power, Spell, Fire, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature
> **Attack:** Power vs. Armor Defense
> **Tier 2:** [V] 1d6 Fi + [Mod].
> **Tier 3:** [V] 1d8 Fi + [Mod].
> **Overcast:** *Reach, Breadth.* *Fire:* on a Tier 3, the target also takes Fire's rider.

**Changed:** "a second dart" is now simply Breadth (+1 creature), so the spell's own step is free for something else. **Holds.**

### 2. Shocking Grasp
> **Shocking Grasp** · Air 1 • Evocation 1 · Round · 1 AP
> *Lightning crawls over your hand, and you lay it on your foe.*
> [Power, Spell, Air, Evocation, Strike]
> Distance: Reach · Target: One creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] [Mod] El.
> **Tier 2:** [V] 2d6 El + [Mod].
> **Tier 3:** [V] 2d6 El + [Mod]; Staggered (EoT).
> **Overcast:** *Reach.* *Air:* the lightning jumps: one creature adjacent to the target takes [V] [Mod] El.

**Changed:** with a rung of +2 squares, one Reach step makes it a 3-square spark, not Lightning Bolt. **A first-pass claim falls:** the ladders no longer fold a touch spell and its ranged version into one card; Lightning Bolt would be its own spell (Air 2). That is Dominions' way too.

### 3. Fireball
> **Fireball** · Fire 2 • Evocation 1 · Round · 2 AP
> *A bead of fire streaks from your palm and bursts among your foes.*
> [Power, Spell, Fire, Evocation, Ranged, Area, Save]
> Distance: 10 sq. · Area: 1 Burst · Target: All creatures in the Area
> **Save:** Instinct
> **Tier 1:** [V] 2d6 Fi.
> **Tier 2:** [V] 1d6 Fi.
> **Overcast:** *Reach.* *Fire:* the Area burns until the end of your next turn: Hazardous Terrain for every creature [HT: Entering, Turn]: [V] [Mod] Fi.

**Changed, and a finding:** Breadth is gone. **2d12's areas have no small rung:** a 1 Burst is 4 squares, a 2 Burst is 12. "+1 to its Burst" (decision 43's line for area spells) triples the area, which is the big jump Lucas refused. So **an area spell doesn't climb Breadth**; a wider area is a different spell, as one creature to an area already is.

### 4. Stoneskin
> **Stoneskin** · Earth 1 • Alteration 1 · Round · 1 AP
> *You press your palm to skin, and it greys and hardens like rock.*
> [Power, Spell, Earth, Alteration]
> Distance: Reach · Target: You or one willing creature
> **Effect:** The target has Resist 2 Blunt, Pierce and Slash, and Weak 2 Cold (2 rounds).
> **Overcast:** *Breadth, Hold.* *Earth:* iron instead of stone: Resist 3, and the weakness is to Electricity.

**Changed:** the base is 2 rounds (a 1-round buff cast on your own turn is nearly spent before it is hit); Hold adds a round a step. **Holds:** this is decision 33's "rounds is the main way" for buffs, and the small Breadth rung (one more creature) fits a buff exactly.

### 5. Earth Grip
> **Earth Grip** · Earth 1 • Alteration 1 · Round · 1 AP
> *The ground opens under your foe's feet and closes around its ankles.*
> [Power, Spell, Earth, Alteration, Ranged, Save]
> Distance: 5 sq. · Target: One creature standing on the ground
> **Save:** Body
> **Tier 1:** Immobilized. Its Break Free needs a Body Check against your Power DC.
> **Tier 2:** Hindered (EoT).
> **Overcast:** *Reach, Breadth.* *Earth:* on a Tier 1, the target is also Prone.

**Holds,** unchanged but for the wording of its own step (Earth's rider, on the Tier a Save's rider lands).

### 6. Regrowth (was Healing Touch)
*Dominions: Healing Touch (heals 30) and Regeneration (10% of hit points a round).*

> **Regrowth** · Nature 1 • Alteration 1 · Round · 1 AP
> *You lay a hand on a wound, and new skin creeps over it like bark over a cut branch.*
> [Power, Spell, Nature, Alteration]
> Distance: Reach · Target: You or one willing creature
> **Effect:** For 2 rounds, when the target starts its turn, it gains Guard equal to 1 + [Mod].
> **Overcast:** *Breadth, Hold.* *Nature:* the growth draws poison out: when cast, the target also ends one Lingering on it.

**Rewritten for decision 36** (magic gives Guard, not Health). It became Dominions' Regeneration more than its Healing Touch: Guard that comes back each turn, in the words Consecrated Ground already uses. Guard doesn't stack, so it refills and never piles up. **A finding on Schools:** it is not held and it stops nothing at a moment, so the sorting puts it in Alteration, and Nature is "the healer of the grid" through Alteration and Guard.

### 7. Twist Fate
> **Twist Fate** · Astral 1 • Enchantment 1 · Round · 1 AP
> *You pluck a thread only you can see, and the blow that was coming goes astray.*
> [Power, Spell, Astral, Enchantment, Woven]
> Distance: 5 sq. · Target: You or one willing creature
> **Effect:** The next instance of damage the target takes is reduced by 2d6. Then this spell ends.
> **Overcast:** *Reach.* *Astral:* the thread holds twice: it ends after the second instance.

**Holds,** unchanged.

### 8. Sleep
> **Sleep** · Glamour 1 • Thaumaturgy 1 · Encounter · 2 AP
> *You murmur a word, and your foe's eyes grow heavy.*
> [Power, Spell, Glamour, Thaumaturgy, Ranged, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** Unconscious (1 round). It wakes when it takes damage, or when a creature adjacent to it spends 1 AP to wake it.
> **Tier 2:** Dazed 1. A Minor enemy takes the Tier 1 result instead.
> **Overcast:** *Reach, Breadth.* *Glamour:* a deep dream: damage of less than 5 doesn't wake it.

**Changed for decision 39:** the turn-taking result reaches further against Minor enemies. **Holds.** It is the one card here that takes a whole turn from a major enemy or a PC, at Encounter frequency and with two exits.

### 9. Fire Shield
> **Fire Shield** · Fire 1 • Enchantment 1 · Round · 1 AP
> *Flames wreathe you, close as a cloak; whoever strikes you reaches through them.*
> [Power, Spell, Fire, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, a creature that damages you with a [Melee] Action takes [V] 1d4 Fi.
> **Overcast:** *Fire:* the flames cling: it also takes Fire's rider.

**Changed:** Breadth removed ([Self] and "+1 creature" would need a sentence of its own). **Holds.**

### 10. Chain Lightning
> **Chain Lightning** · Air 2 • Evocation 2 · Round · 2 AP
> *A bolt cracks from your hand and leaps from one foe to the next.*
> [Power, Spell, Air, Evocation, Ranged, Strike]
> Distance: 10 sq. · Target: One creature, then one more adjacent to it
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [V] [Mod] El.
> **Tier 2:** [V] 1d8 El + [Mod].
> **Tier 3:** [V] 1d8 El + [Mod]; Staggered (EoT).
> **Overcast:** *Reach, Breadth.* *Air:* the last creature struck is Pushed 2.

**Changed, and better:** each leap is a Breadth step ("one more creature, adjacent to the one before"), so the chain grows by the shared ladder and the spell's own step is Air's rider. The small rung suits this spell more than the old ladder did.

### 11. Bonds of Fire
> **Bonds of Fire** · Fire 1 • Alteration 1 · Round · 1 AP
> *A ring of fire springs up around your foe, close enough to singe.*
> [Power, Spell, Fire, Alteration, Ranged]
> Distance: 10 sq. · Target: One creature
> **Effect:** If the target leaves its square, it takes [V] 2d6 Fi (1 round).
> **Overcast:** *Reach, Breadth, Hold.* *Fire:* the ring tightens: at the end of its turn, if it hasn't left, it takes [V] [Mod] Fi.

**Holds,** unchanged.

### 12. Mirror Image
> **Mirror Image** · Glamour 1 • Enchantment 1 · Round · 1 AP
> *You blur, and where one of you stood there are three.*
> [Power, Spell, Glamour, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, [Strike] Actions against you are Doomed. It ends after the second such Strike, whatever its result.
> **Overcast:** *Glamour:* a third image: it ends after the third.

**Holds,** unchanged.

### 13. Poison Cloud
> **Poison Cloud** · Nature 2 + Air 1 • Evocation 1 · Round · 2 AP
> *You breathe out, and a green fog rolls from your mouth and settles.*
> [Power, Spell, Nature, Air, Evocation, Ranged, Area]
> Distance: 10 sq. · Area: 1 Burst
> **Effect:** For 2 rounds, the Area is Hazardous Terrain for every creature [HT: Entering, Turn]: [V] 1d6 Po.
> **Overcast:** *Reach, Hold.* *Nature:* the venom bites: a creature that takes this damage is Sickened 1 (EoT).

**Changed:** the fading die is gone (a die that steps down each round is tracking the charter asks to avoid); 2 rounds, with Hold for more. Breadth removed (an area). The side is named ("for every creature"), as the charter asks of a lasting area.

### 14. Drain Life
> **Drain Life** · Death 2 • Evocation 1 · Round · 2 AP
> *You close your hand, and your foe's warmth runs out of it and into you.*
> [Power, Spell, Death, Evocation, Ranged, Strike]
> Distance: 5 sq. · Target: One living creature
> **Attack:** Power vs. Ward Defense
> **Tier 1:** [R] [Mod] Un.
> **Tier 2:** [R] 2d6 Un + [Mod]; you gain Guard equal to half the damage dealt.
> **Tier 3:** [R] 2d6 Un + [Mod]; you gain Guard equal to the damage dealt.
> **Overcast:** *Reach.* *Death:* on a Tier 3, the target also takes Death's rider.

**Holds.** It already followed decision 36 before it was made.

### 15. Raise Dead, with the summons rule
> **Raise Dead** · Death 1 • Conjuration 1 · Encounter · 2 AP
> *You call, and something that had stopped moving gets up.*
> [Power, Spell, Death, Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** Your summon appears in a free square within the Distance and acts at once.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *Death:* it rises angrier: it has 1 more build pick until it leaves.

**The summon it calls** (decision 44; built on a Rest, written once on the sheet):

> **Risen Corpse** · your summon (Death)
> A Minion of your Stage (Chapter 14's row: its Health, its Defenses, 3 AP, no Reactions).
> **Basic attack:** 1 AP, At-will; Weapon vs. Armor Defense; the Minion row's damage, as [V] Un.
> **Build (two picks):** *Grasping* (its Basic attack's Tier 3: Hindered (EoT)) · *Hard to put down* (Resist 2 Pierce).
> It acts on your turn, after you, if you paid the Sustain. It can't Flank, summon, use Rally Points or be healed. It is a Minor enemy to its foes. It leaves when it goes Down, when you don't pay, and when the spell ends.

**Now it can be finished.** The rule fits on the summon's block; the spell itself is five lines. **A finding for the sorting rule:** this spell is [Sustained], and the sorting's first question ("is it [Woven] or [Sustained]?") would call it an Enchantment. **Conjuration must be asked first:** a body is a Conjuration however it is held.

### 16. Air Shield
> **Air Shield** · Air 1 • Abjuration 1 · Turn · 1R
> *You sweep an arm, and a hard gust turns the shot aside.*
> [Power, Spell, Air, Abjuration]
> Distance: 5 sq. · Target: You or one ally
> **Interrupt:** A [Ranged, Strike] Action targets the target.
> **Effect:** That Action takes 2 Field Banes against the target.
> **Overcast:** *Reach.* *Air:* if that Action gets a Tier 1 against the target, its origin is Pushed 1.

**Holds,** unchanged.

### 17. Phoenix Pyre
> **Phoenix Pyre** · Fire 2 • Enchantment 2 · Encounter · 1 AP
> *You swallow a spark and keep it burning under your heart.*
> [Power, Spell, Fire, Enchantment, Woven, Self]
> **Effect:** While this spell is woven, when damage would take you Down, that damage is reduced until it leaves you 1 short of Down. Then each creature in a 1 Emanation around you makes an Instinct Save (**Tier 1:** [V] 3d6 Fi. **Tier 2:** [V] 1d6 Fi.), and this spell ends.
> **Overcast:** *Fire:* the pyre is wider: a 2 Emanation.

**Rewritten, and simpler.** The first version let you "use 1 Rally Point", which decision 36 leaves to the Paladin, and it needed a Special line because a Woven spell ends when you go Down. Now the spell **prevents** going Down, so it gives no Health and never meets the rule it collided with. It still goes out if you become Bloodied first.

---

## The seven the first pass couldn't draw

### 18. Beguile (a charm)
*Dominions: Charm (Glamour 3 / Thaumaturgy 7): the target changes sides.*

> **Beguile** · Glamour 1 • Thaumaturgy 1 · Round · 2 AP
> *You meet your foe's eyes, and for a moment it can't remember why it wanted to hurt you.*
> [Power, Spell, Glamour, Thaumaturgy, Ranged, Save]
> Distance: 5 sq. · Target: One creature
> **Save:** Appeal
> **Tier 1:** Charmed by you (2 rounds).
> **Tier 2:** Charmed by you (EoT).
> **Overcast:** *Reach, Breadth, Hold.* *Glamour:* it won't hear a word against you: while it is Charmed by you, it also can't target one ally you choose when you cast.

**Holds.** No turn is lost: the creature goes on fighting, only not against you. It reads as fair pointed at a PC, which is the test `charm-confusion-summons.md` asks for. It needs the new condition, which is Taunted's mirror and uses Chapter 8's rule for a condition with a source.

### 19. Compel (one forced Action)
*Dominions: Enslave Mind (Astral 4 / Thaumaturgy 6): the target is yours.*

> **Compel** · Astral 2 • Thaumaturgy 1 · Encounter · 2 AP
> *You speak one word in a voice that isn't yours, and your foe's body obeys before its mind can refuse.*
> [Power, Spell, Astral, Thaumaturgy, Ranged, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** The target at once does one of these, as you choose: it Advances where you direct, or it makes a Weapon Attack (1A) against a creature you choose within its reach or range.
> **Tier 2:** Dazed 1. A Minor enemy takes the Tier 1 result instead.
> **Overcast:** *Reach.* *Astral:* the word echoes: on a Tier 1 it does both, in the order you choose.

**Holds,** as a Linked Action the target makes (Chapter 2: it costs no AP and keeps its requirements). Control is one Action, the creature keeps its turn. **Two things to write when it becomes real:** a forced Advance should be safe from hazards the way Forced Movement is not ("it won't walk off a ledge": Compel is a move the creature makes, so Deadly Hazards need a line); and whether a Compelled attack counts toward the creature's three Strikes.

### 20. Bewilder (a confusion)
*Dominions: Confusion (Glamour 2 / Thaumaturgy 5): half its actions are random.*

> **Bewilder** · Glamour 1 • Thaumaturgy 1 · Round · 1 AP
> *You turn your hand, and the battlefield turns with it in your foe's eyes.*
> [Power, Spell, Glamour, Thaumaturgy, Ranged, Save]
> Distance: 10 sq. · Target: One creature
> **Save:** Mind
> **Tier 1:** Confused.
> **Tier 2:** Pressed 1 (EoT).
> **Overcast:** *Reach, Breadth.* *Glamour:* it doubts the next blow too: Confused ends after its second Strike.

**Holds.** No table and no lost turn: the creature chooses whether to Strike at all, and a clever one steps away from its friends first, which costs it movement. **Noted:** against a creature whose nearest creature is already an enemy of it, Confused does nothing; that is a positioning game, and the right kind.

### 21. Kindle Sprite (a second built summon, to test the menu)
> **Kindle Sprite** · Fire 1 • Conjuration 1 · Encounter · 2 AP
> *You strike a spark and it doesn't go out: it looks at you.*
> [Power, Spell, Fire, Conjuration, Sustained]
> Distance: 5 sq.
> **Effect:** Your summon appears in a free square within the Distance and acts at once.
> **Sustain:** 1 AP.
> **Overcast:** *Reach.* *Fire:* it flares: when it leaves, each creature adjacent to it takes [V] [Mod] Fi.

> **Ember Sprite** · your summon (Fire)
> A Minion of your Stage.
> **Basic attack:** 1 AP, At-will; Power vs. Armor Defense; the Minion row's damage, as [V] Fi.
> **Build (two picks):** *Flying* · *Spitting* (its Basic attack has Distance 5 sq.).
> It sheds Bright light 1. (The other lines as the Risen Corpse's.)

**Holds, and shows the question the summons rule left:** the two spells differ only in their Path, their own step and the theme. So either **each Path has its summon spell** (eight near-identical cards) or **there is one Summon spell and the build carries the Path**. The menu needs writing once: movement, Reach, a ranged attack, the Path's rider on a Tier 3, a Resist, a sense, light.

### 22. Terror (stronger against Minor enemies)
*Dominions: Terror (Death 3 / Thaumaturgy 4): fear in an area, which can rout a squad.*

> **Terror** · Death 2 • Thaumaturgy 1 · Encounter · 2 AP
> *You let them see, for a heartbeat, what waits for all of them.*
> [Power, Spell, Death, Thaumaturgy, Area, Save, Self]
> Area: 2 Emanation · Target: All enemies in the Area
> **Save:** Appeal
> **Tier 1:** Frightened of you (2 rounds). A Minor enemy also flees: on its next turn, its first Action must be an Advance that ends farther from you.
> **Tier 2:** Frightened of you (EoT).
> **Overcast:** *Hold.* *Death:* the fear is cold: on a Tier 1, [R] 1d6 Un.

**Holds.** This is decision 39 exactly: everyone is Frightened (a condition that leaves the turn whole), and only Minor enemies lose part of a turn to it, as Dominions' rank and file rout while its heroes stand. **Noted:** "a Minor enemy" is Chapter 14's own term (the Minion and Grunt ranks), so the clause needs no new word. Three cards use such a clause (8, 19, 22); if many spells do, one sentence form should be fixed.

### 23. Unravel (a counterspell)
*Not from Dominions, which has no battle counterspell; from Ars Magica (`research/ars-magica.md`, row 18). Astral is "magic itself" in Dominions.*

> **Unravel** · Astral 1 • Abjuration 1 · Round · 1R
> *You catch the loose end of another's spell as it leaves their hand, and pull.*
> [Power, Spell, Astral, Abjuration]
> Distance: 10 sq. · Target: One creature
> **Interrupt:** The target uses a [Spell] Action.
> **Attack:** Power vs. the target's Power DC
> **Tier 2:** That spell loses every Overcast step.
> **Tier 3:** That spell is disrupted.
> **Overcast:** *Reach.* *Astral:* the snapped thread whips back: on a Tier 3, the target also takes Astral's rider.

**Holds.** No levels are compared, so no level becomes a number on a roll (decision 18): it is a Power roll against a DC the book already defines, and "disrupted" is Chapter 2's word (the Action doesn't happen; its AP are spent). **It gives Abjuration its first real card**, and a second use for Overcast: something an enemy can strip.

### 24. Blink (a teleport)
*Dominions: Blink (Astral 1 / Thaumaturgy 1): a random teleport of up to 30 squares.*

> **Blink** · Astral 1 • Alteration 1 · Round · 1 AP
> *You step sideways out of the world and back into it somewhere near.*
> [Power, Spell, Astral, Alteration, Self]
> **Effect:** You teleport to a free square you can see within 3 squares. This isn't movement: nothing it would trigger or cross applies.
> **Overcast:** *Reach.* *Astral:* you take a willing creature adjacent to you along, to a free square adjacent to where you arrive.

**Holds, with a new word.** "Teleport" isn't defined in the book (Reposition, Forced Movement and Evade are): it needs its sentence. **Sorting:** the first pass had no School for it. By the rule's last line (anything else: a creature changed for a set time) it lands in Alteration, which is a stretch; a line "moving a creature through space is Alteration" would settle it. Reach reads oddly on a [Self] spell: here it lengthens the teleport, which the card should say.

---

## What the second pass showed

### Holds
1. **All 24 could be written,** and the seven that were impossible before (control, summons, a counter, a teleport) each came out as short as the others.
2. **The small rungs work on single-target spells and buffs:** one more dart, one more leap, one more ally under Stoneskin, one more round. Chain Lightning got better.
3. **Guard as magic's healing works** and gave Nature a different card from the Paladin's (Regrowth returns each turn; Lay On Hands is one bigger gift).
4. **The control shapes hold.** Three cards (Beguile, Compel, Bewilder) take no turn from anyone; Sleep and Terror take one only at Encounter frequency, with exits, and reach further against Minor enemies.
5. **The summons rule fits on a stat block** and the spell stays five lines.

### Found (to decide or write)
| # | Finding | Seen on | Needs |
|---|---|---|---|
| 1 | **Area spells have no small Breadth rung:** a 1 Burst is 4 squares and a 2 Burst 12 | Fireball, Poison Cloud | Area spells don't climb Breadth; a wider area is another spell. A change to decision 43's last line |
| 2 | **The sorting rule must ask "does it bring a body?" before "is it held?"** | Raise Dead, Kindle Sprite | Conjuration first, then Enchantment |
| 3 | **One Summon spell with the Path in the build, or a summon spell a Path?** | Raise Dead, Kindle Sprite | A decision; and the build menu written once |
| 4 | **Two new conditions** (Charmed by, Confused) and **one new word** (teleport) | Beguile, Bewilder, Blink | Their rules in Chapters 8 and 3 |
| 5 | **Where a rider lands and its full line** | every "takes the Path's rider" | The table and sentence drafted at the top |
| 6 | **The touch-to-range fold is gone** with small rungs | Shocking Grasp | Nothing; Lightning Bolt is its own card |
| 7 | **[Self] and Breadth, [Self] and Reach** don't read without a sentence each | Fire Shield, Blink | A line in the ladders' rule, or keep them off [Self] spells |
| 8 | **Guard-giving spells sort into Alteration; held wards into Enchantment; Abjuration is Reactions** | Regrowth, Twist Fate, Air Shield, Unravel | Accepted so far; Abjuration has two cards of 24 |
| 9 | **The "Minor enemy" clause** appears three ways | Sleep, Compel, Terror | One sentence form |
| 10 | **A forced Advance and hazards; a forced attack and the three Strikes** | Compel | Two sentences |
| 11 | **Teleport has no natural School** | Blink | A line in the sorting rule |
| 12 | **The Fire 1 • Evocation 1 cell holds one spell here** (Fire Darts); Fireball needs Fire 2 | the set | A level 1 caster's two spells need two cards in their cell: every opening cell needs at least three |
| 13 | **Frequencies fell into a pattern:** At-will for the dart; Round for most; Encounter for what takes a turn and for summons; Turn for the cheap Reaction | the set | Could be written as a guide |
| 14 | **Every number is unpriced** | all | A caster in the SIM |

### The double pass: what the checks changed
*(Filled in after the two checks; see the list below.)*
