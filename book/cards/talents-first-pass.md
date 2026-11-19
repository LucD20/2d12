# Talents, the first pass: the card template and four test Talents

**2026-11-19.** The shape of a Talent card under decisions T1 to T10 of `book/talents-design.md`, and four Talents written to test it, in two groups. **A test, not a Talent list. Nothing here is decided and nothing is in the book. Every number is a placeholder** [not priced]. Lucas's cards come a few at a time, with him (`book/cards/README.md`): these are drafts for him to correct, and each correction becomes a rule.

**Audited** by an independent reader against the records and the rulebook; this is the corrected version, and what changed is the last table. The first version is in the file's history.

---

## 1. The template

A Talent is written on the card Structure (`book/cards/card-structure.md`), with these differences.

- **The title bar:** **Talent · its group · Stage N** (or **Skill Talent**).
- **Prerequisite** (only when needed), its own line before anything else: what you must have **to take** the Talent: a trait one of your cards carries, or a Stage. Never another Talent (T5). It is not the Action's **Requirements** line (Chapter 2: checked each time you use it), nor the **Requires** trait group. A trait that already needs its kit (a [Projectile] Action needs a Projectile weapon: Chapter 7) is no prerequisite.
- **The body**, one of three:
  - **an Action or a Reaction card** inside the Talent, written whole by the Structure (its Attack line, Distance, Target, Modes as blocks);
  - **a rule** that adds to Actions by their traits, never naming a class card (T9);
  - **a lifted limit:** the base rule's sentence, and what this Talent lets you do instead.
- **Ranks**, after the body: **Rank II:** and **Rank III:**, up to two, each a new rule worth a pick on its own, never a bigger number (T1, T4). **A rank says what it adds to:** "the Interrupt also...", "a new Mode:", "a new line:". A rank may write its own minimum Stage. A sheet shows only the ranks taken.
- **Flavor** under the title, as on every card (Claude writes it). **`automation`** (Bronze, Silver, Gold) on the card, as every card has (CLAUDE.md).

```
> **Name** · Talent · Group · Stage 0
> *Flavor: one sentence of what is done and seen.*
> **Prerequisite:** a trait one of your cards carries (only if needed)
> (the body: an Action or Reaction card; a rule; or a lifted limit)
> **Rank II:** what it adds to, then the new rule.
> **Rank III (Stage 1):** what it adds to, then the new rule.
```

---

## 2. Group: Sentinel (holding ground in melee)

### Opportunity Attack

*Lucas's own example (T9). The card exists in `cards/basic-actions.json` but the book prints no Opportunity Attack, and Chapter 2 says no creature has a Reaction of its own.*

> **Opportunity Attack** · Talent · Sentinel · Stage 0
> *You were waiting for them to look away.*
> **Opportunity Attack** · 1R · At-will · [Melee, Strike, Weapon]
> **Interrupt:** An enemy adjacent to you would leave a square during a Move Action, or would use the Stand Action.
> **Target:** The triggering creature.
> **Attack:** Weapon vs. Armor Defense
> You make a Weapon Attack (1A) against the target.
> **Rank II:** The Interrupt also happens when an enemy adjacent to you would use a [Spell] Action. (A [Subtle] casting isn't noticed: magic record, 97.)
> **Rank III (Stage 1):** When the Weapon Attack of an Opportunity Attack triggered by a [Spell] Action gets a Critical, that [Spell] Action is disrupted (Chapter 2).

**No prerequisite:** every creature has Fists, a Melee weapon (Chapter 15). **Rank III** is a second way to stop a casting, beside the counterspell Talent decision 99 assigned (it acts before the casting begins, by an Interrupt: T9 names this specialty). **Answered (Lucas, 2026-11-19: "C for sure"): it stays a Talent, made weaker so it competes on equal terms** (to rewrite: Round, not At-will, as the starting point). The question was: the audit expects this to be the obvious Stage 0 pick of nearly every melee character (the only Reaction one can get without a class Reaction; At-will; its moment comes most rounds). The research's rule is "if everyone must take it, build it in" (`research/talents.md`, section 4).

### Shoulder Through

> **Shoulder Through** · Talent · Sentinel · Stage 0
> *You lower your shoulder and the line gives.*
> Once on your turn, during an Advance, you can move through one enemy's square as if it were an ordinary square (Chapter 7 makes it Difficult Terrain). You can't end your movement there; if your movement is disrupted while you are in that square, it ends in the last square you left.
> **Rank II:** A new line: the enemy you moved through is Staggered (EoT).
> **Rank III:** A new line: you can use it during a Charge, and the enemy's square doesn't break the Charge's line.

What it lifts: Chapter 7's "passing through the squares of an unwilling creature is Difficult Terrain". Anyone can push through; this makes it faster (T2's permission test: better, never "you can"). **Beside the Archer's Footwork (Weave mode)**, which already moves through unwilling creatures and ignores Difficult Terrain for 1 AP: this Talent is narrower (one enemy, once a turn) and free.

---

## 3. Group: Archery (the bow and the sling)

### Called Shot

> **Called Shot** · Talent · Archery · Stage 0
> *You stop aiming at the man and start aiming at his hand.*
> **Called Shot** · 2 AP · Round · [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod]. **Tier 3:** [V] 1[W] + [Mod], and the Mode you chose.
> **The hand:** the target drops one object it holds in one hand (its choice); an object held in two hands isn't dropped.
> **The arm:** Pressed 1 (1 round).
> **Rank II:** A new Mode. **The throat:** the target can't use [Incanted] Actions (EoT).
> **Rank III:** A new Mode. **The eye:** Half-Blinded (EoT).

Modes as blocks, as Trick Shots writes them. The leg (Hindered) is gone: it was Trick Shots' Pin.

### Overwatch

> **Overwatch** · Talent · Archery · Stage 0
> *You keep the arrow on the string and your eyes on the gap.*
> **Overwatch** · 1 AP · Round · [Projectile]
> You hold a shot: until the start of your next turn, you have the Reaction **Held Shot**.
> **Held Shot** · 0R · Round · [Projectile, Ranged, Strike, Weapon]
> **Interrupt:** An enemy within your weapon's normal range would enter a square adjacent to you or to an ally.
> **Target:** The triggering creature.
> **Attack:** Weapon vs. Armor Defense
> You make a Weapon Attack (1A) against the target.
> **Rank II:** A new line on Held Shot: on a Tier 3, the enemy's movement is disrupted; it stops in the square it would have left.

**Paid on your own turn (1 AP),** so it is a choice against a Strike, not an extra attack every round. Two ranks only. The moment is one Chapter 2 lists ("an enemy would enter a square adjacent to you or to an ally").

---

## 4. What the four test

| What the template must hold | Where |
|---|---|
| A Reaction inside a Talent, ranks that add a trigger and a specialty | Opportunity Attack |
| A rule on a Basic Action that lifts a base limit | Shoulder Through |
| An Action with Modes; ranks that add a Mode | Called Shot |
| An Action that grants a Reaction until your next turn (an inline Action) | Overwatch |
| A Talent that reaches magic (a second way to stop a casting; a Mode against [Incanted]) | Opportunity Attack, Called Shot |

---

## 5. The audit: what the independent reader changed

| Talent | Finding | Now |
|---|---|---|
| **Overwatch** | **Its trigger ("ends a Move Action") is the very moment Chapter 2 forbids** ("'ends a Move Action' is not one"); "used no Strike on your last turn" is undefined and tracked across turns; Rank II only widened the range (a bigger number); the base was a step to a must-have Rank III (a free attack nearly every round) | A 1 AP Action that holds a shot until your next turn, with a moment Chapter 2 lists; two ranks; the attack costs a turn's AP |
| **Shoulder Through** | Rank II had no origin for its Strike (unlimited melee reach); Rank III (Prone on a Save, every Advance, no AP) dominated Trip; overlap with Footwork's Weave; a disrupted movement could end in an enemy's square; "each of your Advances" unclear | Once a turn; the disrupted case written; Rank II Staggered; Rank III in a Charge |
| **Opportunity Attack** | "Requires: a [Melee] weapon" gated nothing (everyone has Fists) and wrote a property as a trait; Rank II should say "would use" (Chapter 2's wording); [Subtle] not addressed; Rank III's Critical belongs to the Weapon Attack; the note cited decision 85 where 99 is meant; likely the obvious pick | Prerequisite removed; wording fixed; the must-have question put to Lucas |
| **Called Shot** | No Attack or Distance line (the Structure: a Strike always writes its Defense); Modes not written as blocks; Rank III (the rider on Tier 2) was a better rate; the leg duplicated Trick Shots' Pin; "drops one object" unclear | Written whole; the leg replaced by the arm (Pressed); ranks add Modes (the throat, the eye) |
| **The template** | "Requires" meant three things (a trait group, a Requirements line, a prerequisite); no way to write Modes; ranks didn't say what they add to; no `automation` | "Prerequisite"; Modes by the Structure; "a rank says what it adds to"; `automation` named |

**Not yet checked:** the rulebook has no [Spell] trait in Chapter 7 yet (magic is not written), and [Incanted] is decided but not written.
