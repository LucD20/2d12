# Talents: the test batch (nine Talents and one Basic Action)

**2026-11-20.** One file for every test Talent still standing: the seven of the second pass (the famous families of `research/famous-picks.md`; Lucas: "A") and the two survivors of the first pass (Called Shot, Overwatch, now Covering Shot), redone with his answers; and the **basic grapple** he moved to the Basic Actions. It replaces `talents-first-pass.md` and `talents-second-pass.md` for review (both kept as history, with their audits). Nine Talents under T1 to T14 of `book/talents-design.md` and the lessons of his first review. **A test, not a Talent list. Nothing here is decided and nothing is in the book. Every number is a placeholder** [not priced]. Stage 2 is not written in the game: every Stage on a rank is a placeholder.

**Audit status:** the seven of the second pass were audited and corrected (section 10). **The whole batch was then audited again and corrected (section 11).**

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
| Arm's-Length Shot | The ranged package | I, II | 2 |
| Parry | Defense, as a Reaction | I, II | 2 |
| Break the Line | Mobility and the charge | I, II, III | 2 (one runs to Rank III) |
| Grab Hold | Combat maneuvers (after the basic Grab) | I, II, III (one branch each) | 3 |
| Reckless Blow | The damage trade, as an Action | I, II | 3 |
| Called Shot | (first pass) | I, II | 2 |
| Covering Shot | (first pass's Overwatch) | I, II | 3 |

---


## 0. Grab (a Basic Action, not a Talent)

**At a glance.** Lucas (2026-11-20, "A"): the plain grapple is something anyone can try, so it joins the Basic Actions, shaped like Trip. **Not in the book yet** (the backlog has it).

> **Grab** · Basic Action
> *You get a fistful of them and don't let go.*
> **Grab** · Round · [Body, Handle, Instinct, Strike]
> **Requirements:** The target's SR is at most 1 higher than yours.
> **Distance:** Reach · **Target:** One creature
> **Attack:** Body or Instinct vs. Body or Instinct (the one used to roll)
>
> | | Tier 1 | Tier 2 | Tier 3 |
> |---|---|---|---|
> | **1 AP** | No effect. | No effect. | Grabbed by you (1 round). |
> | **2 AP** | No effect. | Grabbed by you (1 round). | [V] 1d8 Bl; Grabbed by you (1 round). |

**Notes**
- **Trip's shape:** a Round Action with a 1 AP and a 2 AP Version, the 1 AP one landing only on a Tier 3. **The 2 AP Version's Tier 2 stays** (Lucas, 2026-11-20: "Tier 2").
- **The hold lasts 1 round** (Lucas, 2026-11-20), or less: Chapter 8's Grabbed already ends when it Breaks Free, when the holder lets go, when it leaves the holder's Reach, or when the holder goes Down. "(1 round)" is the only duration the card needs to write.
- **Break Free is always a Check** (Lucas, 2026-11-20: "It should be always a body/instinct vs Immobilized DC"; now Chapter 8 and the Break Free card): a Body or Instinct Check (the higher) against the holder's Immobilized DC, 11 + the Modifier the Grab used. So the 2 AP Version's Tier 3 no longer needs a Check of its own: it takes Trip's Tier 3 shape, damage and the condition (`[V] 1d8 Bl`, a placeholder). With a 1-round hold, a boss loses at most a round's worth of failed attempts, and it can still act where it stands.
- **Forced movement of a Grabbed creature** (Chapter 8, Grabbed and Immobilized): only the holder can Force Move or Reposition it, and the holder's own ignores Immobilized; a Push that takes it out of the holder's Reach ends Grabbed. Anyone else's Forced Movement or Reposition of it fails.
- **Lesson 1 (bosses):** Grabbed costs a held boss at least 1 AP (Break Free) and never lasts past 1 round.

---

## 1. Opportunity Attack (rebuilt from the review)

**At a glance.** A Reaction against an enemy that leaves you. Three ranks, three branches.

**Rank I**

> **Opportunity Attack** · Talent · Sentinel · Stage 0
> *You were waiting for them to look away.*
> **Opportunity Attack** · 1R · Round · [Melee, Strike, Weapon]
> **Interrupt:** An enemy you threaten would leave a square during a Move Action, or would use the Stand Action.
> **Target:** The triggering creature.
> **Effect:** You make a Weapon Attack (1A) against the target with a Melee weapon you threaten it with.

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
| **The mage-hunter** | **Spellwatch:** the Interrupt also happens when an enemy you threaten would use a [Spell] Action ([Subtle] castings escape). On a Critical of the Weapon Attack, that [Spell] Action is disrupted | **Spellbreaker:** on a Tier 3 of the Weapon Attack, a Minor enemy's [Spell] Action is disrupted; any other creature's [Spell] Action takes 2 Pressure Banes (on a Save spell they lower its Save DC: magic, 88) |
| **The line-holder** | **Hamstring:** on a Tier 2 or 3 of the Weapon Attack, the target is Hindered (EoT) | **Cripple:** on a Tier 3 of the Weapon Attack, a Minor enemy's triggering Action is disrupted (a Move Action leaves it in the square it was leaving; a Stand leaves it Prone); any other creature is Slowed 1 (1 round) |
| **The bodyguard** | **Bodyguard:** the Interrupt also happens when an enemy you threaten would make a [Strike] Action against one of your allies | **Interpose:** on a Tier 3 of the Weapon Attack, if that Strike has one target and isn't an [Area] Action, it targets you instead, when you are a target it could have chosen (within its Distance, with Line of Effect) |

**Notes**
- **The audit's fixes:** the Weapon Attack is the Linked Action (its own Tiers), so the ranks name "the Weapon Attack"; each stopping rank now does something against any enemy, and stops only a Minor one (a Minion often dies to the hit anyway: Grunts are where it bites). **The review's fixes:** threatened squares, so a Long weapon works; Spellbreaker's Critical folded into Spellwatch, with the disruption that matters kept for Minor enemies; Hamstring no longer stops movement, Cripple does only against Minor enemies; Bodyguard now answers an attack on an ally (Chapter 2 lists "a creature makes a [Strike] Action"), and Interpose redirects it.
- **Near** the Paladin's Shield of Faith (an ally's damage reduced), not the same: Bodyguard is a Weapon Attack, Shield of Faith a [Divine] reduction.
- **Near the Paladin's Rebuke** (1R: an enemy within 3 that moves away is Hindered (EoT), and on a failed Appeal Save its Move Action is disrupted), not the same: Hamstring and Cripple ride a Weapon Attack against an enemy you threaten, and Cripple stops only a Minor one; Rebuke is a [Divine] Save at range against anyone.
- **The name:** the Basic Action "Opportunity Attack" left the book on 2026-11-12 (Lucas: "Later as a talent"; rules-backlog.md). `cards/basic-actions.json` and Foundry still list it: the known mismatch, already in the backlog. This Talent is the one meant to replace it.
- **Slowed 1 lasts 1 round** (the audit: a condition with no duration lasts the whole encounter, Chapter 8): one lost AP on its next turn, not a lockdown.

---

## 2. Steel and Spell (casting under fire)

**At a glance.** Strike with a weapon and cast a small spell with the same hand, in one Action. Two ranks, two branches. **Prerequisite: a [Spell] Action** (a Magic Talent or a caster class opened one).

**Rank I**

> **Steel and Spell** · Talent · Battle Magic · Stage 0
> *The blade finishes its arc and your free fingers are already shaping the word.*
> **Prerequisite:** a [Spell] Action
> **Steel and Spell** · 2 AP · Round · [Strike, Weapon]
> **Target:** As the Weapon Attack, then as the spell.
> **Effect:** You make a Weapon Attack (1A), then use a 1 AP [Spell] Action. That spell can be a [Handle] one even with your weapon in the hand it needs. **The spell still counts toward its own Frequency** (it must be one you could use now) and pays its Surge cost (and Heavy armor's), unlike a Linked Action (Chapter 2). The Weapon Attack is a Linked Action: Steel and Spell, a [Strike] Action, counts once toward the 3 Strikes of the turn and toward At-will Banes.

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
| **The spellsword** | **Close Casting:** a second Version (below), and a [Ranged] spell cast with Steel and Spell isn't Doomed for being Engaged, nor are its targets' Saves Favored for it |
| **The battle-mage** | **Unbroken Focus:** a [Woven] or [Sustained] spell cast with Steel and Spell doesn't end the next time you become Bloodied or Strained after casting it |

**Close Casting's Versions** (Steel and Spell with this rank):

> **2 AP** · **Effect:** You make a Weapon Attack (1A), then use a 1 AP [Spell] Action.
> **3 AP** · **Effect:** You make a Weapon Attack (1A), then use a 1 or 2 AP [Spell] Action.
>
> Both: the spell can be a [Handle] one with your weapon in the hand it needs, counts toward its own Frequency and pays its Surge cost (and Heavy armor's).

**Notes**
- **D&D's War Caster in three parts,** each a lifted limit paid by this Action (T14): the free hand ([Handle]), the Engaged penalty, the held magic's break.
- **The audit's fixes:** a Linked Action doesn't count toward its own Frequency (Chapter 2), so the spell's Frequency and Surge are written to count; Close Casting widened (it only touched [Ranged] spells: magic 108); "the first time" made "the next time after casting it".
- **Unbroken Focus** lifts a limit the magic record left to Talents (5l: "a held spell that survives one break").

---

## 3. Arm's-Length Shot (the ranged package)

**At a glance.** Lucas's own draft ("Point Blank Shot", renamed: the Pistol's placeholder Technique is already called Point Blank): a shot while Engaged that isn't Doomed. Two ranks, two branches.

**Rank I**

> **Arm's-Length Shot** · Talent · Archery · Stage 0
> *They are close enough to touch, and you shoot anyway.*
> **Arm's-Length Shot** · 1 AP · Round · [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Special:** This roll isn't Doomed for your being Engaged.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod]. **Tier 3:** [V] 1[W] + [Mod].

**The tree**

```
 Rank I        [ Arm's-Length Shot ]   1 AP: a shot while Engaged, not Doomed
                        │
            ┌───────────┴───────────┐
 Rank II    ▼                       ▼
    [ Step and Loose ]        [ Shove Off ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The skirmisher** | **Step and Loose:** a new line: **Setup:** you can Evade 2 |
| **The brawling archer** | **Shove Off:** on the Tier 2 and Tier 3 lines: if the target is Engaged with you, it is also Pushed 1 (Tier 2) or Pushed 2 (Tier 3) |

**Notes**
- **Near the Archer, not overlapping:** Clear Lines removes Cover from allies and the Field Bane for a target Engaged with an ally; Snap Shot answers an enemy closing in; Footwork's Sidestep is Evade 3 for 1 AP. None makes a shot while you are Engaged.
- **Step and Loose borders Footwork** (an Evade before a shot) **and the Recurve Bow's Circling Shot** (Setup: Evade 1; a Technique of one bow at Mastery 10), not the same: any bow or crossbow, Evade 2, and the shot isn't Doomed while you are still Engaged.
- **Both riders raised** (the audit: Evade 1 and a Push 1 on a Tier 3 only were the "rider too small" lesson, worth less than a pick under T13). The numbers stay placeholders.

---

## 4. Parry (defense, as a Reaction)

**At a glance.** Turn a blow aside with your weapon. Two ranks, two branches.

**Rank I**

> **Parry** · Talent · Guard · Stage 0
> *Steel meets steel an inch from your face.*
> **Parry** · 1R · Round · [Weapon]
> **Requirements:** You hold a Melee weapon other than Fists.
> **Interrupt:** An enemy's [Melee, Strike] Action would damage you.
> **Target:** You.
> **Effect:** That damage is reduced by 1[W] + your Weapon Modifier, rolled with the weapon you parry with.

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
| **The duelist** | **Riposte:** a new line: if Parry alone reduces the damage to 0, you make a Weapon Attack (1A) against the attacker |
| **The bulwark** | **Deflect:** the Interrupt also happens against a [Ranged, Strike] Action |

**Notes**
- **Near the Paladin's Shield of Faith** (an ally's damage reduced by 1 + Power Modifier, and a Taunt): Parry guards only you and rolls your weapon.
- **The weapon is a Requirement, not a prerequisite** (the audit: an item can't be a prerequisite under T5; a Requirement is checked each time). Fists are left out on purpose.
- **Watch it as the obvious Stage 0 pick** (the audit, T6): it answers the most common event (a melee hit), and Deflect adds ranged hits. The playtest decides.

---

## 5. Break the Line (mobility and the charge)

**At a glance.** Lucas: "Break the Line should be the main Talent." A Charge that goes through the enemy's front. Three ranks, two branches.

**Rank I**

> **Break the Line** · Talent · Vanguard · Stage 0 · Passive
> *You don't go around them.*
> **Passive:** When you Charge, your straight line can pass through the squares of enemies, and diagonally between two of them (Chapter 3, Corners), as if they were ordinary squares. You can't end your movement in one: if the square where the Charge would stop holds an enemy, it stops in the last unoccupied square before it; if your movement is disrupted, it ends in the last unoccupied square you left.

**The tree**

```
 Rank I          [ Break the Line ]   a Charge through the enemy's squares
                         │
            ┌────────────┴────────────┐
 Rank II    ▼                         ▼
     [ Bull Rush ]                [ Overrun ]
            │
 Rank III   ▼
     [ Trample ]
```

**The branches**

| Branch | Rank II | Rank III |
|---|---|---|
| **The battering ram** | **Bull Rush:** a new line: before you enter each enemy's square, it makes a Body Save against your Weapon DC. **Tier 1:** Pushed 1 by you, to a square off your line (you then go on through the square it left) | **Trample:** on Bull Rush's Tier 1, a Minor enemy is also Prone; any other creature is Pushed 2 instead of 1 |
| **The breakthrough** | **Overrun:** a new line: if the Charge's Weapon Attack gets a Tier 2 or 3, you can Advance 2 more along the same straight line, through the target's square too (the Charge's rules for the line apply; it can trigger Reactions like any Advance, and counts toward your Speed) | (none: nothing more worth a pick) |

**Notes**
- **Near the Archer's Footwork (Weave)**, which moves through unwilling creatures in an Advance: Break the Line is the Charge's version. **Shoulder Through is gone:** in an Advance it was a subset of Weave (overlap, T14) and the rank Lucas called too weak.
- **Trample knocks only a Minor enemy Prone** (lesson 1), and pushes anyone else farther (the audit: a rank must do something against any enemy); Trip stays the way to knock a major enemy Prone.
- **Bull Rush resolves before you enter the square** (the audit: while you share it, the Push's cone has no direction): it is in front of you on the line, so a Push 1 to a square off the line is always farther from you.

---

## 6. Grab Hold (combat maneuvers, after the basic Grab)

**At a glance.** What a wrestler does with a creature Grabbed by them. Up to three ranks, three branches: **each rank adds one branch** (Lucas: the branches "become its first rank"; T12: a rank is a pick). No prerequisite: anyone can Grab (section 0).

**Ranks I to III: each adds one branch**

> **Grab Hold** · Talent · Wrestling · Stage 0
> *Once you have them, you decide where they go.*
> **Rank I:** choose one branch. **Rank II, Rank III:** choose another.

**The tree**

```
 Ranks I-III   (each rank adds one)
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
 [ Throw ]     [ Human Shield ]     [ Choke ]
```

**The branches**

| Branch | The rank it adds |
|---|---|
| **The thrower** | **Throw:** a new Action (below) |
| **The hostage-taker** | **Human Shield:** a new Reaction (below) |
| **The strangler** | **Choke:** **Passive:** while a Minor enemy is Grabbed by you, it can't use [Incanted] Actions; any other creature Grabbed by you takes 2 Pressure Banes on its [Incanted] Actions |

> **Human Shield** · 1R · Round
> *You haul them into the blow's path.*
> **Requirements:** A creature is Grabbed by you, and it isn't a target of the triggering Action.
> **Interrupt:** A creature would damage you with Blunt, Pierce or Slash damage.
> **Target:** The creature Grabbed by you.
> **Effect:** You put it in front of the attack: you and it each take half of that damage (rounded up). Only you suffer the triggering Action's other effects.

> **Throw** · 1 AP · Round · [Body, Strike]
> *You turn their weight against them and let go at the top of the swing.*
> **Distance:** Reach · **Target:** One creature Grabbed by you
> **Attack:** Body vs. Body
> **Tier 1:** It is no longer Grabbed. **Tier 2:** Pushed 2; it is no longer Grabbed. **Tier 3:** Pushed 3; it is no longer Grabbed; a Minor enemy is also Prone.

**Notes**
- **Each rank a branch** (the audit: one rank with a choice was three Talents under one name, and nothing said whether it could be taken again). A rank is a pick (T12), so the three can be had in any order; Stage gates are placeholders.
- **Human Shield is a Reaction** (Lucas, 2026-11-20: the passive was "too strong, and weirdly worded"): it halves a Blunt, Pierce or Slash hit, melee or ranged, and the held creature takes the other half. Each applies its own Resistance and Weakness to its half; a hit of another subtype (Fire, Psychic) stays whole on you. That also answers the audit's worry that Throw, the only Action, was the obvious first pick.
- Human Shield was first Low cover from the held creature, which Chapter 3 already gives. Choke stops [Incanted] Actions only on a Minor enemy (lesson 1); against anyone else it is 2 Pressure Banes while the hold lasts (the audit: a rank must do something against any enemy).

---

## 7. Reckless Blow (the damage trade, as an Action)

**At a glance.** Power Attack as a separate Strike: worse odds, bigger hit. Two ranks, three branches.

**Rank I**

> **Reckless Blow** · Talent · Heavy Weapons · Stage 0
> *You stop guarding and swing to end it.*
> **Reckless Blow** · 2 AP · Round · [Melee, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Special:** This roll takes 2 Banes.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 2[W] + [Mod]. **Tier 3:** [V] 3[W] + [Mod].

**The tree**

```
 Rank I            [ Reckless Blow ]   2 AP: 2 Banes, more [W]
                           │
          ┌────────────────┼────────────────┐
 Rank II  ▼                ▼                ▼
   [ Sweeping Blow ]   [ Sunder ]      [ Finishing Blow ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The reaper** | **Sweeping Blow:** on the Tier 3 line: you Cleave 1 (Chapter 1) |
| **The breaker** | **Sunder:** on the Tier 3 line: the target's Armor Defense is 1 lower (1 round) |
| **The executioner** | **Finishing Blow:** on the Special line: against a Bloodied target, the roll takes 1 Bane instead of 2 (its other Banes stay) |

**Notes**
- **The trade is inside the Action** (2 Banes for more dice), so it is a choice each turn, never a passive (T1, T14). Pathfinder 2e's Power Attack is the model (`research/famous-picks.md`).
- **Finishing Blow weakened (Lucas, 2026-11-20: "A"):** against a Bloodied target the roll takes 1 of the card's 2 Banes, not none. The audit's reason: removing both improved every Tier against half a fight's targets, while the other branches ride a rare Tier 3.
- **Cleave is already a rules term** (Chapter 1, Cleave N): the branch now uses it.
- **Near the Archer's Quick Shots** (2 AP, more [W] for a bow): Reckless Blow is melee and pays with Banes.

---

## 8. Called Shot (first pass, redone)

**At a glance.** A slower shot at a part of the body. Two ranks; Rank II adds one of two new targets. **Redone with Lucas's review:** "Disarm on a T3 early on is too strong": the hand moves to a Rank II branch, and lands fully only on a Minor enemy.

**Rank I**

> **Called Shot** · Talent · Archery · Stage 0
> *You stop aiming at the man and start aiming at his arm.*
> **Called Shot** · 2 AP · Round · [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Special:** Before the roll, choose a Mode.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod]. **Tier 3:** [V] 1[W] + [Mod]; the Mode's effect.
>
> **The arm**
> **Tier 3 rider:** Pressed 1 (1 round).
>
> **The eye**
> **Tier 3 rider:** Half-Blinded (EoT).

**The tree**

```
 Rank I        [ Called Shot ]   the arm · the eye
                       │
           ┌───────────┴───────────┐
 Rank II   ▼                       ▼
     [ The Hand ]            [ The Throat ]
```

**The branches** (each adds a Mode)

| Branch | Rank II: a new Mode |
|---|---|
| **The disarmer** | **The hand** · **Tier 3 rider:** a Minor enemy drops one object it holds in one hand (its choice; not one held in two hands); any other creature is Pressed 2 (EoT) |
| **The silencer** | **The throat** · **Tier 3 rider:** a Minor enemy can't use [Incanted] Actions (EoT); any other creature's [Incanted] Actions take 2 Pressure Banes (EoT) |

**Notes**
- **Each Mode a block** under its name (card Structure, part 4: the audit); the riders follow a semicolon.
- **The hand no longer rests on a Critical** (lesson 2: about 4%): against any creature but a Minor enemy it is Pressed 2 for its next turn, the arm's harder but shorter cousin.
- The eye moved to Rank I; the heart (a bare number) is gone; the leg was the Archer's Trick Shots' Pin.
- **Near Trick Shots** (Pin, Startle, Knock Back: 1 AP, Round), not the same: Called Shot costs 2 AP and deals [W].

---

## 9. Covering Shot (first pass's Overwatch, redone)

**At a glance.** Spend 1 AP on your turn to hold a shot for an enemy who comes too close. Two ranks; Rank II widens what you watch for. **Redone with Lucas's review:** Pin Down under the boss rule.

**Rank I**

> **Covering Shot** · Talent · Archery · Stage 0
> *You keep the arrow on the string and your eyes on the gap.*
> **Covering Shot** · 1 AP · Round · [Projectile]
> **Effect:** You hold a shot: you have the Reaction **Held Shot** (1 round).
> **Held Shot** · 0R · Round · [Projectile, Ranged, Strike, Weapon]
> **Interrupt:** An enemy within your weapon's normal range would enter a square adjacent to you or to an ally.
> **Target:** The triggering creature.
> **Effect:** You make a Weapon Attack (1A) against the target.

**The tree**

```
 Rank I          [ Covering Shot ]   1 AP: hold a shot for 1 round
                         │
         ┌───────────────┼───────────────┐
 Rank II ▼               ▼               ▼
   [ Pin Down ]   [ Return Fire ]  [ Silencing Shot ]
```

**The branches**

| Branch | Rank II |
|---|---|
| **The warden** | **Pin Down:** on a Tier 3 of the Weapon Attack, a Minor enemy's Move Action is disrupted (it stays in the square it was leaving); any other creature is Hindered (EoT) |
| **The counter-sniper** | **Return Fire:** Held Shot's Interrupt also happens when an enemy within your weapon's normal range would make a [Ranged, Strike] Action against you or an ally |
| **The spell-watcher** | **Silencing Shot:** Held Shot's Interrupt also happens when an enemy within your weapon's normal range would use a [Spell] Action ([Subtle] castings escape) |

**Notes**
- **Renamed from Overwatch** (the audit: the old Archer's Overwatch is still in `cards/archer.json` and Foundry, a near twin of Held Shot with Pin Down). **The hold lasts 1 round** (Chapter 2: nothing lasts "until the start of your next turn").
- **Paid on your own turn (1 AP):** a choice against a Strike, never a free attack every round.
- **Near the Archer's Snap Shot** (a Reaction when the target enters a square adjacent to you): Held Shot guards your allies' squares too and is bought with 1 AP on your turn.

---

## 10. The second pass's audit: what the independent reader changed

| Talent | Finding | Now |
|---|---|---|
| **Grab Hold** | **Broke the draft's own boss rule:** Grabbed (Immobilized, no duration) on any success against any creature up to SR + 1; Choke made it a lockdown for casters; Human Shield gave what Chapter 3 already gives (Low cover from a creature in the way); Throw had no Attack or Tiers; the SR limit belongs under Requirements; the plain grapple may be a permission trap | Grabbed on a Tier 3 only; Choke against Minor enemies; Human Shield redirects a miss; Throw written whole; **the permission question put to Lucas** |
| **Steel and Spell** | **A Frequency bypass:** a Linked Action doesn't count toward its own Frequency (Chapter 2), so an Encounter spell could be cast every round; Surge and armor not addressed; Close Casting worth little (only [Ranged] spells); "the first time" unclear; no Target or Effect line | The spell's Frequency and Surge written to count; Close Casting widened; wording fixed |
| **Break the Line** | Shoulder Through repeated a rank Lucas called too weak and was a subset of the Archer's Weave (overlap); the Charge's stop square could be an enemy's; the disrupted case could land in an enemy's square; Bull Rush's push had no origin and no timing; Through and Past too situational; no Passive label | Shoulder Through and Through and Past gone; Overrun added; the stop and disrupted cases written; Bull Rush timed and given an origin |
| **Reckless Blow** | "Cleave" already a rules term; Finishing Blow removed every Bane and is likely the obvious branch; the Banes belong in a Special | Sweeping Blow uses Cleave 1; Finishing Blow limited to this card's Banes; **the dominance question put to Lucas** |
| **Opportunity Attack** | Spellbreaker and Cripple rest on a rare trigger (a Tier 3 against a Minor enemy, who often dies to the hit anyway); "within its reach" the wrong word; no Effect label; ranks pointed at Tiers the card doesn't show | Each stopping rank now does something against any enemy too; Interpose uses Distance and Line of Effect; the Weapon Attack named as the Linked Action |
| **Parry** | No Target line; a weapon can't be a prerequisite (T5); "reduced to 0" unclear beside other reductions (Chapter 4) | Target and Requirements lines; Riposte counts Parry alone |
| **Point Blank Shot** | The Engaged rule must be a Special; Shove Off belongs on the Tier 3 line; the name clashes with the Pistol's placeholder Technique | Renamed Arm's-Length Shot; restructured |

**No finding** on bare numbers (T1), the Skill wall (T2) or class cards (T9, T10). **Not re-audited after these fixes.**


---

## 11. The audit of the whole batch (2026-11-20, an independent reader; Opus)

The whole file, against T1 to T14, the lessons, the rulebook and the class and gear cards. **Every finding was fixed** except the two marked "for Lucas".

| Card | Finding | Now |
|---|---|---|
| **Overwatch** | "Until the start of your next turn" is forbidden (Chapter 2); the name clashes with the old Archer's Overwatch (still in `archer.json` and Foundry, a near twin); Pin Down said "movement is disrupted" (only an Action can be); Silencing Shot lacked the [Subtle] note | **Renamed Covering Shot**; Held Shot lasts 1 round; Pin Down disrupts the Move Action; the [Subtle] note added |
| **Opportunity Attack** | Cripple's Slowed 1 had no duration, so it lasted the encounter (a boss lockdown on a Tier 3); the Stand trigger didn't fit "stays in the square"; Interpose undefined for an [Area] or many-target Strike; the Paladin's Rebuke not named as a neighbour; the name clashes with the Basic Action still in `basic-actions.json` | Slowed 1 (1 round); the triggering Action disrupted (Move or Stand); Interpose only for a single-target, non-[Area] Strike; Rebuke noted (near, not the same); the name is the known mismatch (the Basic Action left the book on 2026-11-12) |
| **Grab** | A section 10 fix came back: the 2 AP Version grants Grabbed on a Tier 2; Break Free is At-will, so a Check on each attempt could eat a boss's turn; the Attack line put "the one used to roll" on the wrong side | The Attack line is Trip's; **Lucas (2026-11-20): Tier 2 kept; the hold lasts 1 round, which replaced the "next Break Free" limit** |
| **Grab Hold** | One rank with a choice was three Talents under one name, with no word on taking it again; "Prerequisite: none" against the template; Human Shield and Choke had no Passive label; Choke did nothing against a non-Minor enemy; Throw had no Flavor or Distance | Each rank adds one branch (three ranks); the line gone; Passive labels; Choke gives 2 Pressure Banes to anyone else; Throw written as its own card; **Lucas (2026-11-20): Human Shield redone as a 1R Reaction (half the damage each)** |
| **Called Shot** | The hand rested on a Critical (about 4%) against non-Minor enemies; the Modes were lines, not blocks (Structure part 4); the rider didn't follow a semicolon | The hand: Pressed 2 (EoT) against anyone else; each Mode a block; semicolon |
| **The boss rule's wording** | Spellbreaker's "or its targets' Save DC is 2 lower" repeated magic decision 88 and read as a choice; Banes put on an enemy are Pressure Banes (README); "any other enemy" left out a non-enemy target | "2 Pressure Banes" everywhere; the Save DC clause made a reminder; "any other creature" |
| **Break the Line** | Overrun's 2 squares were a movement of no kind; Bull Rush's Push from a shared square has no cone; Trample rested on a rare trigger and did nothing to others; passing diagonally between two enemies (Corners) not covered | Overrun is an Advance 2 on the same line; Bull Rush resolves before you enter the square; Trample also pushes anyone else 2; Corners covered |
| **Reckless Blow** | Section 10 findings came back: Sunder was a new line, not on the Tier 3 line; Finishing Blow is about the roll, so a Special | Both moved |
| **Steel and Spell** | Close Casting added a 3 AP cost without a Version block; the inner Weapon Attack's 3 Strikes and At-will Banes unwritten | A Version block; the card says Steel and Spell counts once |
| **Arm's-Length Shot** | Step and Loose is the Recurve Bow's Circling Shot Setup; both riders too small (T13) | Noted as near; Evade 2; Shove Off pushes on Tier 2 and 3 |
| **Parry** | No rules finding; the strongest candidate for the obvious Stage 0 pick (T6) | A watch note for the playtest |
| **Across the batch** | Branch labels repeated (mage-hunter, silencer, skirmisher, duelist, bodyguard) | Renamed: the breakthrough, the hostage-taker, the strangler, the counter-sniper, the spell-watcher |

**No finding** on bare numbers (T1), lifted penalties (T14) or the Skill wall. **Fable re-audits the whole batch with fresh eyes at step 12.**
