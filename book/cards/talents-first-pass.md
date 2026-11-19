# Talents, the first pass: the card template and four test Talents

**2026-11-19.** The shape of a Talent card under decisions T1 to T10 of `book/talents-design.md`, and four Talents written to test it, in two groups. **A test, not a Talent list. Nothing here is decided and nothing is in the book. Every number is a placeholder** [not priced]. Lucas's cards come a few at a time, with him (`book/cards/README.md`): these are drafts for him to correct, and each correction becomes a rule.

**Audited** by an independent reader against the records and the rulebook before being shown; what changed is the last table.

---

## 1. The template

A Talent is written on the card Structure (`book/cards/card-structure.md`), with three differences.

**Its title bar** says what it is and where it sits: **Talent · its group · Stage N**. A Skill Talent says **Skill Talent**.

**Requires** (only when needed), on its own line before anything else: the trait the Talent works on ("Requires: a [Projectile] weapon"). Never another Talent (T5).

**Its body** is one of three things:
- **an Action or a Reaction card** inside the Talent (cost, Frequency, traits, Interrupt or Trigger, Tiers), written as any card is;
- **a rule** that adds to Actions by their traits ("Your [Projectile, Weapon] Actions..."), never naming a class card (T9);
- **a lifted limit**: the base rule's sentence, and what this Talent lets you do instead.

**Its ranks**, after the body, each on its own labeled line: **Rank II:** and **Rank III:**, each a new rule worth a pick on its own, never a bigger number (T1, T4). A rank may write its own minimum Stage.

A **Flavor** line under the title, as on every card. Claude writes it.

```
> **Name** · Talent · Group · Stage 0
> *Flavor: one sentence of what is done and seen.*
> **Requires:** a trait you have (only if needed)
> (the body: an Action or Reaction card, a rule, or a lifted limit)
> **Rank II:** a new rule.
> **Rank III (Stage 1):** a new rule.
```

---

## 2. Group: Sentinel (holding ground in melee)

### Opportunity Attack

*Lucas's own example (T9), written out. The card exists in `cards/basic-actions.json` but the book prints no Opportunity Attack, and Chapter 2 says no creature has a Reaction of its own: so as a Talent it gives what no one has.*

> **Opportunity Attack** · Talent · Sentinel · Stage 0
> *You were waiting for them to look away.*
> **Requires:** a [Melee] weapon
> **Opportunity Attack** · 1R · At-will · [Strike]
> **Interrupt:** An enemy adjacent to you would leave a square during a Move Action, or uses the Stand Action.
> **Target:** The triggering creature.
> You make a Weapon Attack (1A) against the target with a [Melee] weapon.
> **Rank II:** The Interrupt also happens when an enemy adjacent to you uses a [Spell] Action.
> **Rank III (Stage 1):** When your Opportunity Attack against a [Spell] Action gets a Critical, that Action is disrupted (Chapter 2).

The base rule it lifts: no creature has a Reaction unless something gives it one (Chapter 2). Rank II is a new trigger, Rank III a new specialty: the three of Lucas's examples. **Rank III lifts a magic limit:** nothing spoils an ordinary casting (magic record, 85); a Talent may break that on purpose.

### Shoulder Through

> **Shoulder Through** · Talent · Sentinel · Stage 0
> *You lower your shoulder and the line gives.*
> Once during each of your Advances, you can move through one enemy's square as if it were an ordinary square. You can't end your movement there.
> **Rank II:** If you moved through an enemy's square this way, the next [Melee, Strike] Action you make this turn can target that enemy from any square adjacent to it, even if you have moved away from it since.
> **Rank III:** An enemy you move through this way makes a Body Save against your Weapon DC. **Tier 1:** Prone. **Tier 2 or 3:** no effect.

The base rule it lifts: passing through an unwilling creature's squares is Difficult Terrain (Chapter 7, [Move]). Anyone can already push through; Rank I makes it faster (T2's permission test: better, never "you can").

---

## 3. Group: Archery (the bow and the sling)

### Called Shot

> **Called Shot** · Talent · Archery · Stage 0
> *You stop aiming at the man and start aiming at his hand.*
> **Requires:** a [Projectile] weapon
> **Called Shot** · 2 AP · Round · [Projectile, Strike, Weapon]
> **Target:** One creature.
> Before the roll, choose **the hand** or **the leg**.
> **Tier 1:** 0.
> **Tier 2:** [V] 1[W] + [Mod].
> **Tier 3:** [V] 1[W] + [Mod]. **The hand:** the target drops one object it holds in one hand. **The leg:** Hindered (1 round).
> **Rank II:** You can also choose **the eye:** on a Tier 3, the target is Half-Blinded (EoT).
> **Rank III:** On a Tier 2, your choice also happens.

### Overwatch

> **Overwatch** · Talent · Archery · Stage 0
> *You keep the arrow on the string and your eyes on the gap.*
> **Requires:** a [Projectile] weapon
> **Overwatch** · 1R · Round · [Projectile, Strike, Weapon]
> **Trigger:** An enemy you can see ends a Move Action within your weapon's normal range, and you used no [Strike] Action on your last turn.
> **Target:** The triggering creature.
> You make a Weapon Attack (1A) against the target with your [Projectile] weapon.
> **Rank II:** The trigger also happens when the enemy ends the Move Action in a square where it has no Cover from you.
> **Rank III:** The Trigger no longer needs you to have used no [Strike] Action on your last turn.

---

## 4. What the four test

| What the template must hold | Where |
|---|---|
| A Reaction inside a Talent, with ranks that add a trigger and a specialty | Opportunity Attack (Lucas's example) |
| A rule on a Basic Action, keyed on what you do, not on a trait | Shoulder Through |
| A new Action with a choice inside it, and a rank that widens it | Called Shot |
| A Reaction whose ranks lift its own condition | Overwatch |
| A Talent that lifts a magic limit | Opportunity Attack, Rank III |

## 5. The audit

(filled after the audit)
