# Dominions 6: the core mechanics its magic stands on

**Date:** 2026-11-18. **Asked by Lucas,** after Claude rewrote the Overcast ladders as one big jump each: "one big jump isn't good I think. To make this more in depth: if you haven't already, read on and research the core of Dominions 6 mechanics, that are important for its magical system. You will likely find where my exploding dice idea is from."

**What was read.**
- **[read]** The manual: "The Basics" (the Dominions Random Number and its table, printed page 13) and the combat chapter (printed pages 60 to 66: battlefield movement, protection, melee, armor-defeating hits, hit locations, weapon types, fatigue, repel, harassment, the order of an attack's resolution, missile combat, special damage). The wiki's pages (illwiki.com, as their own text) on hit points, protection, magic resistance, and the Dominions Random Number.
- **Computed by Claude:** the exact odds of the open-ended 2d6 against itself, and of 2d12's exploding 2d12 against DC 13. They match the manual's table to the percent.
- **Not read:** morale and rout in full, mounted combat, sieges.

**Dominions' rules, not 2d12's. Nothing here is decided.** Lines marked **For 2d12** are Claude's.

---

## 1. The die: where 2d12's exploding dice come from

**The Dominions Random Number (DRN):** "a roll of two six-sided dice (2d6) but with an additional bonus: if any individual die roll is '6', one is subtracted, and then that die is re-rolled and added to the result." A 6 counts as 5 and rolls again, without limit. "Open-ended."

**2d12's roll is the same construction at twice the size:** "When a d12 shows a 12, it explodes: count that die as 11, then roll it again and add the result" (Chapter 1), and a damage die written with ! does the same ("count that face as one less").

**Why the designers built it** [manual]: "Dominions has a lot of situations where something is very unlikely to happen, like a militia soldier hitting an ethereal monster. However, in the real world of Dominions, very few things are actually impossible. [...] With it, it is always possible for such an event to occur, which would not be the case if the roll was not open-ended."

**Almost every roll is one DRN against another**, each added to a stat, and ties have a named winner. The manual's table of "the chance of beating" the other side, by the difference between the two stats:

| Difference | -6 | -4 | -3 | -2 | -1 | 0 | +1 | +2 | +3 | +4 | +6 | +10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chance | 11% | 18% | 24% | 30% | 38% | 46% | 54% | 62% | 70% | 76% | 86% | 95% |

Three things follow, and Dominions' whole magic leans on them:
1. **One point is worth about 8 points of chance near even, and it never stops being worth something.** No stat is high enough to be safe and none low enough to be hopeless.
2. **Small whole numbers are the unit of everything.** A +1 or a +2 is a real change, so the game can hand them out one at a time.
3. **Nothing is certain.** A DRN averages 8, shows 13 or more one time in eight, and 16 or more one time in twenty.

**For 2d12.** 2d12's exploding 2d12 averages 14.0 against Dominions' 8.0; against DC 13 a Modifier of +1, +2, +3, +4 gives a Tier 2 or better 62%, 69%, 75%, 81% of the time, and a Tier 3 20%, 25%, 29%, 35% (Doubles not counted). So **in 2d12 one point is worth about 6 points of chance**: the same kind of die with a slightly gentler slope. Boons and Banes are 2d12's "+1 at a time".

---

## 2. A hit is two contests, and armor subtracts

- **To hit:** attack + DRN against defence + DRN (each lowered by fatigue). A shield turns some hits into "shield hits", which add its protection to the next roll.
- **To hurt:** **damage + DRN against protection + DRN**; the difference comes off the hit points; if protection wins, "there is no effect". So **damage is itself a contest with an exploding roll on both sides.**
- **Armor is subtraction, not avoidance.** Armor-piercing halves the protection used; armor-negating uses none.
- **"Armor defeating hits":** a protection roll of 2 (1 in 36) loses a quarter of the armor; the threshold rises to 3 at 50 fatigue and to 4 at 100 fatigue or when the target can't move (1 in 6). Dominions' critical hit is the defender's bad roll, and **tiredness and being held make it likelier.**
- **Where it lands:** 50% torso, 20% arms, 20% legs, 10% head; a blow that takes enough of a creature's hit points can leave a lasting injury (an affliction) on the part struck.
- **Being attacked wears you down:** each melee attack against a unit gives it 1 "harassment": -1 defence, fading quickly. Many weak attackers open a strong defender for each other.
- **Spells use the same machinery.** A spell's "16 AP Fire" is a damage number that goes into the damage contest (16 + DRN against half the armor + DRN), after the target's Fire Resistance takes its share. Area spells skip the to-hit contest: a Precision roll places them on a square, and everyone in the square is in the damage contest.

**The scale** [wiki]: an average human has **10** hit points, a knight 11, a giant 33, a hill giant 106, a god 80 to 150. Without the roll, a militia spear does 13, a broadsword 16, a greatsword 21; a Lightning Bolt (Air 3) 15, a Flare (Fire 3) 22, a Pillar of Fire 38, Bane Fire 55. **A battle spell and a sword blow are the same size**, and either one, landing clean, kills a man. Magic's edge is that it ignores what protects against swords (range, armor, the front rank), not that its numbers are bigger.

**For 2d12.** Armor Defense is avoidance, so "armor-piercing" has no direct translation; the first pass found the nearest thing (a roll against Ward Defense in place of Armor Defense). "Spell and sword are the same size" is the 2026-10-29 rule ("a caster's round 1 at least 90% of a weapon user's") seen from Dominions' side.

---

## 3. Three ways to be beaten

A Dominions unit leaves the fight in one of three ways, and each has its own number, its own defence, and its own spells:

| Track | Lost when | Defended by | Attacked by |
|---|---|---|---|
| **Hit points** | 0 | Defence, protection, elemental resistance | Fire, Air, Water, Earth; weapons |
| **Fatigue** | 100 (unconscious); it also lowers defence and attack on the way, and opens the armor | Encumbrance (light armor), reinvigoration | Cold and heat, Steal Breath, Stellar Cascades, Ghost Grip, Rigor Mortis; and one's own fighting and casting |
| **Morale** | A failed rout check (the squad flees) | Morale, leadership, numbers still standing | Fear and Fright (Death, Glamour, Nature, Blood); losses |

And a fourth defence that guards the mind and the soul: **Magic Resistance** (10 for a human, 13 to 18 for mages), against spells that go around all three tracks (sleep, paralysis, charm, soul-slaying).

**Fatigue is the same number for a soldier and a mage.** A soldier builds it by swinging in armor (his encumbrance each attack), a mage by casting (the spell's cost, plus an armor tax). That one shared track is why Dominions' mages don't wear plate, why a long fight tires both, and why a spell that adds fatigue hurts the fighter and the caster alike.

**For 2d12.** 2d12 also has three things to lose: **Vigor** (Bloodied), **Resolve** (Strained), both thresholds of one Health Pool, and **AP**. They line up with Dominions' three tracks closely: hit points with Vigor damage, morale with Resolve damage, fatigue with AP (Dazed, Slowed, Hindered are what "tired" does in 2d12). It gives each Path a home pool without a new rule: the Elements wound (Vigor); Death and Glamour break the spirit (Resolve); Water, Astral and Air's wind take tempo (AP and movement). The first pass's cards already fell this way.

---

## 4. How a spell grows, and what holds it back

Lucas's question. **Dominions puts no cap on growth inside a spell. It makes each step small, and it makes the levels that pay for steps scarce.**

**The steps** (from `raw/2026-11-18-dominions-spells.tsv`; one step for each level above the spell's minimum):

| What grows | The step | On a base of | So one level is about |
|---|---|---|---|
| Range | +5 squares | 30 to 50 | a tenth to a sixth more |
| Area | +1 square (a few: +2) | 3 to 20 | a twentieth to a third more |
| Damage | +1 or +2 (a few: +3, +5) | 10 to 25 | a tenth more |
| Number of projectiles or creatures | +1 to +3 | 4 to 10 | a quarter to three quarters more: **the steepest** |
| Penetration | +1 for every 2 levels | 11 | about 4 points of chance a level |
| Cost | divided by (1 + levels above) | | half, a third, a quarter: each step worth less |

- **Each spell grows only one or two of these**, and which ones is part of its character.
- **Only Evocation grows range and damage.** The other Schools grow an area or nothing: their growth is the next spell of the line.
- **The big jumps are separate spells.** One creature, a small group, twenty squares, the whole army: four or five spells, each with a higher minimum, more research and a gem cost (`dominions-paths.md` 1.4).
- **The die makes a small step felt** (section 1): +2 damage against armor, +1 penetration against a resistance, are each several points of chance on every target.

**What holds it back is how few spare levels anyone has:**
- Most mages have 1 to 3 levels in a Path; a nation's best recruit has 5 to 11 levels spread over all Paths.
- In battle a mage can add **+1 from a gem** (never +2), **+1 from the Path's own boosting spell** (a whole action, usually the first), **+1 from each booster item** (few and costly), and **+1 with two communion slaves, +2 with four**.
- So a spell is typically cast **0 to 3 levels over**, and reaching 3 takes preparation the enemy can see.

**For 2d12.**
- 2d12's version of "scarce levels" is already decided: one Mastery point a fight split between Paths and Schools (a spare level is rare before the middle levels), and the Escalation each step needs.
- So the missing piece is the other half: **small rungs.** Claude's ladders had rungs that tripled an area in one step (a 1 Burst is 4 squares, a 2 Burst is 12). Dominions' rungs add a tenth to a quarter.
- **Small rungs in 2d12's units:** Reach +2 squares a step (on 5 to 10); Breadth +1 creature a step; Hold +1 round a step. And, as in Dominions, **"one creature" to "an area" is not a step: it is a different spell**, with higher minimums.
- With rungs that size, several steps on one ladder are no longer the problem the cap was meant to stop: three Breadth steps are three more creatures, not thirty-six squares.

---

## 5. Smaller pieces that matter to magic

- **Squares hold a limited size** (10 size points: three humans, or one giant): an area's worth is how many bodies stand in it, so "area +1 square" is about three more soldiers.
- **Precision places area spells**, and they scatter: a spell can land on your own front rank. Dominions accepts friendly fire as part of magic.
- **Repel** (a longer weapon stops an attack before it lands) and the fixed order in which defensive effects resolve (awe, repel, strikeback, the two contests, then wards like Mirror Image and Luck, then damage shared by Blood Bond): Dominions writes the order down once so that no two effects argue. 2d12 will need the same sentence for wards, Reactions and Guard on a spell.
- **Interrupting a caster** uses the share of hit points taken (`dominions-rules.md` 9): the same "a blow's size against your total" that decides afflictions and stuns. One idea, reused three times.

---

## 6. Sources

- Dominions 6 manual (Illwinter), "The Basics" (printed page 13) and the combat chapter (pages 60 to 66) [read]: https://www.illwinter.com/dom6/dom6manual.pdf
- illwiki.com [read, raw pages]: /drn /hit-points /protection /magic-resistance
- The spell steps: `raw/2026-11-18-dominions-spells.tsv`; the counts by School: `dominions-paths.md` 1.6.
