# Talents, the second pass: seven famous families

**2026-11-20.** Lucas: "A" (the families of `research/famous-picks.md` that already fit, plus the damage trade as an Action). Seven Talents under T1 to T14 of `book/talents-design.md` and the lessons of his first review. **A test, not a Talent list. Nothing here is decided and nothing is in the book. Every number is a placeholder** [not priced]. Stage 2 is not written in the game: every Stage on a rank is a placeholder.

**Audit status:** see the last section.

---

## How to read this file

Each Talent: **at a glance** (its famous family, what it does, its size), **Rank I**, **the tree**, **the branches** (Rank II beside the Rank III that continues it), **notes** (what it borders, and how it keeps the lessons).

**The lessons every Talent here keeps** (Lucas's review, 2026-11-20):
1. **No shutting down a boss:** an effect that stops or disrupts an enemy hits a Minor enemy (Chapter 14: Minions and Grunts), or needs a Critical against anyone else (magic record, 39).
2. **No rank rests on a rare trigger alone.**
3. **The rules' own reach words:** "an enemy you threaten", not "adjacent".
4. **A penalty is lifted, or a cost lowered, by an Action you spend** (T14).
5. **Near a class card is fine, overlap is not** (T14).

**Sizes:**

| Talent | Famous family | Ranks | Branches |
|---|---|---|---|
| Opportunity Attack | The attack of opportunity | I, II, III | 3 |
| Steel and Spell | Casting under fire | I, II | 2 |
| Point Blank Shot | The ranged package | I, II | 2 |
| Parry | Defense, as a Reaction | I, II | 2 |
| Break the Line | Mobility and the charge | I, II, III | 2 |
| Grab Hold | Combat maneuvers | I, II | 3 |
| Reckless Blow | The damage trade, as an Action | I, II | 3 |

---

## 1. Opportunity Attack (rebuilt from the review)

**At a glance.** A Reaction against an enemy that leaves you. Three ranks, three branches.

**Rank I**

> **Opportunity Attack** · Talent · Sentinel · Stage 0
> *You were waiting for them to look away.*
> **Opportunity Attack** · 1R · Round · [Melee, Strike, Weapon]
> **Interrupt:** An enemy you threaten would leave a square during a Move Action, or would use the Stand Action.
> **Target:** The triggering creature.
> **Attack:** Weapon vs. Armor Defense
> You make a Weapon Attack (1A) against the target.

**The tree**

```
 Rank I              [ Opportunity Attack ]   1R · Round · an enemy you threaten
                                │
          ┌─────────────────────┼─────────────────────┐
 Rank II  ▼                     ▼                     ▼
    [ Spellwatch ]         [ Hamstring ]         [ Bodyguard ]
          │                     │                     │
 Rank III ▼                     ▼                     ▼
    [ Spellbreaker ]       [ Cripple ]           [ Interpose ]
```

**The branches**

| Branch | Rank II | Rank III |
|---|---|---|
| **The mage-hunter** | **Spellwatch:** the Interrupt also happens when an enemy you threaten would use a [Spell] Action ([Subtle] castings escape). On a Critical, that [Spell] Action is disrupted | **Spellbreaker:** a Tier 3 against a Minor enemy also disrupts it |
| **The line-holder** | **Hamstring:** on a Tier 2 or 3, the target is Hindered (EoT) | **Cripple:** on a Tier 3 against a Minor enemy, its Move Action is disrupted; it stays in the square it was leaving |
| **The bodyguard** | **Bodyguard:** the Interrupt also happens when an enemy you threaten would make a [Strike] Action against one of your allies | **Interpose:** on a Tier 3 against that enemy, its Strike targets you instead, if you are within its reach |

**Notes**
- **The review's fixes:** threatened squares, so a Long weapon works; Spellbreaker's Critical folded into Spellwatch, with the disruption that matters kept for Minor enemies; Hamstring no longer stops movement, Cripple does only against Minor enemies; Bodyguard now answers an attack on an ally (Chapter 2 lists "a creature makes a [Strike] Action"), and Interpose redirects it.
- **Near** the Paladin's Shield of Faith (an ally's damage reduced), not the same: Bodyguard is a Weapon Attack, Shield of Faith a [Divine] reduction.

---

## 2. Steel and Spell (casting under fire)

**At a glance.** Strike with a weapon and cast a small spell with the same hand, in one Action. Two ranks, two branches. **Prerequisite: a [Spell] Action** (a Magic Talent or a caster class opened one).

**Rank I**

> **Steel and Spell** · Talent · Battle Magic · Stage 0
> *The blade finishes its arc and your free fingers are already shaping the word.*
> **Prerequisite:** a [Spell] Action
> **Steel and Spell** · 2 AP · Round · [Strike, Weapon]
> You make a Weapon Attack (1A), then use a 1 AP [Spell] Action. That spell can be a [Handle] one even with your weapon in the hand it needs.

**The tree**

```
 Rank I       [ Steel and Spell ]   2 AP: a Weapon Attack, then a 1 AP spell
                       │
           ┌───────────┴───────────┐
 Rank II   ▼                       ▼
    [ Close Casting ]       [ Unbroken Focus ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The spellsword** | **Close Casting:** the spell of Steel and Spell isn't Doomed for being Engaged, and its targets' Saves aren't Favored for it |
| **The battle-mage** | **Unbroken Focus:** a [Woven] or [Sustained] spell cast with Steel and Spell doesn't end the first time you become Bloodied or Strained this encounter |

**Notes**
- **D&D's War Caster in three parts,** each a lifted limit paid by this Action (T14): the free hand ([Handle]), the Engaged penalty, the held magic's break.
- **Unbroken Focus** lifts a limit the magic record left to Talents (5l: "a held spell that survives one break").

---

## 3. Point Blank Shot (the ranged package)

**At a glance.** Lucas's own draft: a shot while Engaged that isn't Doomed. Two ranks, two branches.

**Rank I**

> **Point Blank Shot** · Talent · Archery · Stage 0
> *They are close enough to touch, and you shoot anyway.*
> **Point Blank Shot** · 1 AP · Round · [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Attack:** Weapon vs. Armor Defense
> This roll isn't Doomed for your being Engaged.
> **Tier 1:** 0. **Tier 2 or 3:** [V] 1[W] + [Mod].

**The tree**

```
 Rank I        [ Point Blank Shot ]   1 AP: a shot while Engaged, not Doomed
                        │
            ┌───────────┴───────────┐
 Rank II    ▼                       ▼
    [ Step and Loose ]        [ Shove Off ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The skirmisher** | **Step and Loose:** a new line: **Setup:** you Evade 1 |
| **The brawling archer** | **Shove Off:** a new line: on a Tier 3, if the target is Engaged with you, it is Pushed 1 |

**Notes**
- **Near the Archer, not overlapping:** Clear Lines removes Cover from allies and the Field Bane for a target Engaged with an ally; Snap Shot answers an enemy closing in; Footwork's Sidestep is Evade 3 for 1 AP. None makes a shot while you are Engaged.
- **Step and Loose borders Footwork** (an Evade before a shot); kept small (Evade 1).

---

## 4. Parry (defense, as a Reaction)

**At a glance.** Turn a blow aside with your weapon. Two ranks, two branches. **Prerequisite: a [Melee] weapon other than Fists.**

**Rank I**

> **Parry** · Talent · Guard · Stage 0
> *Steel meets steel an inch from your face.*
> **Prerequisite:** a Melee weapon other than Fists
> **Parry** · 1R · Round · [Weapon]
> **Interrupt:** An enemy's [Melee, Strike] Action would damage you.
> That damage is reduced by 1[W] + your Weapon Modifier, rolled with the weapon you parry with.

**The tree**

```
 Rank I            [ Parry ]   1R: reduce a melee blow by your weapon
                       │
           ┌───────────┴───────────┐
 Rank II   ▼                       ▼
     [ Riposte ]            [ Deflect ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The duelist** | **Riposte:** a new line: if the damage is reduced to 0, you make a Weapon Attack (1A) against the attacker |
| **The bulwark** | **Deflect:** the Interrupt also happens against a [Ranged, Strike] Action |

**Notes**
- **Near the Paladin's Shield of Faith** (an ally's damage reduced by 1 + Power Modifier, and a Taunt): Parry guards only you and rolls your weapon.
- **The prerequisite is a property, not a trait** (the audit's lesson: weapons have properties). Fists are left out on purpose.

---

## 5. Break the Line (mobility and the charge)

**At a glance.** Lucas: "Break the Line should be the main Talent." A Charge that goes through the enemy's front. Three ranks, two branches.

**Rank I**

> **Break the Line** · Talent · Vanguard · Stage 0
> *You don't go around them.*
> When you Charge, your straight line can pass through the squares of enemies as if they were ordinary squares. You can't end your movement in one; if your movement is disrupted while you are in one, it ends in the last square you left.

**The tree**

```
 Rank I          [ Break the Line ]   a Charge through the enemy's squares
                         │
            ┌────────────┴────────────┐
 Rank II    ▼                         ▼
     [ Bull Rush ]             [ Shoulder Through ]
            │                         │
 Rank III   ▼                         ▼
     [ Trample ]               [ Through and Past ]
```

**The branches**

| Branch | Rank II | Rank III |
|---|---|---|
| **The battering ram** | **Bull Rush:** a new line: each enemy whose square you pass through makes a Body Save against your Weapon DC. **Tier 1:** Pushed 1, away from your line | **Trample:** a Minor enemy that gets a Tier 1 is also Prone |
| **The skirmisher** | **Shoulder Through:** you can also do it once on your turn during an Advance, through one enemy | **Through and Past:** a new line: after a Charge that passed through an enemy, you can Evade 1 |

**Notes**
- **Near the Archer's Footwork (Weave)**, which moves through unwilling creatures in an Advance: Break the Line is the Charge's version, and Shoulder Through is narrower (one enemy, once a turn).
- **Trample against a Minor enemy only** (lesson 1); Trip stays the way to knock a major enemy Prone.

---

## 6. Grab Hold (combat maneuvers)

**At a glance.** A grapple: take hold of a creature, then do something with it. Two ranks, three branches.

**Rank I**

> **Grab Hold** · Talent · Wrestling · Stage 0
> *You stop trying to hit them and simply take hold.*
> **Grab Hold** · 1 AP · Round · [Body, Handle, Strike]
> **Distance:** Reach · **Target:** One creature whose SR is at most 1 higher than yours
> **Attack:** Body vs. Body
> **Tier 1:** No effect. **Tier 2:** Grabbed. **Tier 3:** Grabbed, and Staggered (EoT).

**The tree**

```
 Rank I              [ Grab Hold ]   1 AP: Body vs Body, Grabbed
                           │
          ┌────────────────┼────────────────┐
 Rank II  ▼                ▼                ▼
     [ Throw ]       [ Human Shield ]   [ Choke ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The thrower** | **Throw:** a new Action, **Throw** · 1 AP · Round · [Body, Strike], against a creature you hold: it is Pushed 2 and no longer Grabbed; on a Tier 3 against a Minor enemy, also Prone |
| **The bodyguard of one** | **Human Shield:** while you hold a creature, it gives you Low cover against [Ranged] Actions whose line passes through its square |
| **The silencer** | **Choke:** while you hold a creature, it can't use [Incanted] Actions |

**Notes**
- **Grabbed is already in the rules** (Chapter 8), and the Arming Sword's Technique grabs after a Slid: Grab Hold is the plain grapple the base rules don't have (near a weapon card, not a class card).
- **A boss held is a boss Immobilized** (Grabbed makes it Immobilized). Break Free ends it, and Grab Hold is a Round Action; a question for the audit (lesson 1).

---

## 7. Reckless Blow (the damage trade, as an Action)

**At a glance.** Power Attack as a separate Strike: worse odds, bigger hit. Two ranks, three branches.

**Rank I**

> **Reckless Blow** · Talent · Heavy Weapons · Stage 0
> *You stop guarding and swing to end it.*
> **Reckless Blow** · 2 AP · Round · [Melee, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Attack:** Weapon vs. Armor Defense, with 2 Banes
> **Tier 1:** 0. **Tier 2:** [V] 2[W] + [Mod]. **Tier 3:** [V] 3[W] + [Mod].

**The tree**

```
 Rank I            [ Reckless Blow ]   2 AP: 2 Banes, more [W]
                           │
          ┌────────────────┼────────────────┐
 Rank II  ▼                ▼                ▼
      [ Cleave ]      [ Sunder ]      [ Finishing Blow ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The reaper** | **Cleave:** a new line: on a Tier 3, one other enemy you threaten takes [V] 1[W] |
| **The breaker** | **Sunder:** a new line: on a Tier 3, the target's Armor Defense is 1 lower (1 round) |
| **The executioner** | **Finishing Blow:** a new line: against a Bloodied target, the roll takes no Banes |

**Notes**
- **The trade is inside the Action** (2 Banes for more dice), so it is a choice each turn, never a passive (T1, T14). Pathfinder 2e's Power Attack is the model (`research/famous-picks.md`).
- **Near the Archer's Quick Shots** (2 AP, more [W] for a bow): Reckless Blow is melee and pays with Banes.

---

## 8. The audit

(filled after the audit)
