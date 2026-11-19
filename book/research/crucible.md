# Crucible: spells composed from parts, read from its source

**Date:** 2026-11-19. **Lucas's reference** (magic record, decision 34): spells "can have descriptions of their own and rules inside themselves", and of Crucible, "adding a word to the spell shapes it" (an arrow + cold makes a ranged cold attack). The record's section 5i had described it from memory only.

**What was read, and how far to trust it.** One independent researcher cloned the system's public repository and read its code and in-game rulebook: **Crucible 0.11.3, last commit 2026-11-18** (the Foundry VTT system by Foundry's lead developer). The parts, the arithmetic, the written spells, the talents and the out-of-fight rules are **[read] from source**. The full report with tables of every part is `raw/2026-11-19-crucible.md`; **this file is Claude's summary of it.** Where Crucible's rulebook and its code disagree, the report gives the code. **Not found:** any player or designer commentary on whether composed spells are interesting, dominant or samey (the developer's Patreon, Reddit and Discord could not be opened); every judgment of that kind is the researcher's own reading, marked [mine]. Crucible is in active development: this is a snapshot.

**Crucible's rules, never 2d12's. Nothing here is decided.**

---

## 1. The grammar

| Part | How many | What it fixes | In 2d12's words |
|---|---|---|---|
| **Rune** (the substance) | 12 | Damage type, the defense attacked, the pool hit (Health or Morale), one ability, and an **opposed Rune** | A Path, with no level |
| **Gesture** (the delivery) | 17 | Action and Focus cost, hands needed, range, shape, base damage, a second ability | No equivalent: nearest are Reach, Breadth and "an area is a different spell" |
| **Inflection** (a modifier) | 10 | One change of cost and one effect; one a spell | An Overcast step |

- **The spell is computed, never written:** cost, range, area and base damage from the Gesture; type, defense and pool from the Rune; its name is generated ("Arrow of Frost"). Lucas's example holds exactly: Arrow + Frost is a single-target Cold attack at range, and nobody wrote it.
- **Only knowledge limits it.** Each part is a Talent (3 Talent points a level). No spell levels, no minimum in a Rune: every Rune you know works with every Gesture you know. The rulebook's level 6 caster knows 3 Runes, 3 Gestures and 1 Inflection: "18 different combinations".
- **No Rune has a rider when composing.** A Rune's condition (Burning, Freezing and the like) comes from a separate, higher Talent, **and only on a Critical Hit**. The add-ons a caster chooses at the cast are about position or timing (Push, Pull, React, Reshape), never a condition.

## 2. Resources

- **Action:** 6 a round. **Focus:** a small pool that doesn't refill in a fight; a 10-minute Recover refills it, so it is a per-fight pool that starts full and drains. **Heroism:** a meter the whole table fills by acting for each other, which pays for the biggest actions.
- **Maintained spells** cost their Focus again at the start of each of your turns, one at a time by default.
- A caster out of Focus still casts a basic spell every turn.

## 3. Written spells exist beside the grammar

**Iconic Spells:** 14 written cards in Talent-granted slots, for effects the rulebook says are "not otherwise possible via the Composed Spell system". Each lists the parts you must know; **five require two Runes** (Invisibility, Revive, Telecognition among them), and that is the only place two substances meet.

## 4. Magic outside a fight is not composed

- Each Rune grants **one written "rote" action** with three small listed uses (Flame: light a candle; a moment's fire immunity; make flames dance) and the line "You may attempt other uses similar those above, the effectiveness of which is decided by the Gamemaster."
- One Gesture (Sense) is the only utility verb; the area Gesture that would stay up (Aura) "may only be cast during combat".
- Utility with teeth is written as Iconic Spells.

## 5. Defense

Counterspell reads the attacker's parts: more Boons against the **opposed Rune**, and for knowing the **same Gesture**.

## 6. How it applies to 2d12 (observations)

| Question open in 2d12 | What Crucible's evidence says |
|---|---|
| **Composing, or written cards?** | Composing gave breadth at almost no writing cost and no ambiguity, by making every part a number or a label. The moment an effect needed a sentence (darkness, invisibility, a curse, raising the dead), Crucible wrote a card. It supports Lucas's own point: spells with "rules inside themselves" need a description. Composing's cost is sameness [mine], and it leans on software to do the sums |
| **What stands where Merge stood (91)?** | Crucible never lets a caster staple a second substance's effect onto a spell. Two substances meet only in written spells that need both (2d12's decision 63). A substance's condition is a reward of the roll (a Critical), bought by a Talent, never a button always pressed: Lucas's objection to Merge, answered the same way. A second substance's other job: it is the best counter (opposition) |
| **Out-of-combat magic (87)?** | The grammar did not produce it. Utility hangs on the substance alone: one written entry a Rune, a few fixed uses, and an open "the GM decides" clause, which is exactly the ambiguity 2d12 wants to avoid. A data point for "written by Path, a few fixed uses each" over "derived from two words" |
| **Counters (99)?** | The counter keyed on the opposed substance and the same delivery is in print here: a model for the Talent tree |
| **Surge (66)?** | Crucible has both kinds: Focus starts full and drains; Heroism is built in the fight, by the table. 2d12's Surge is the second kind, held by each character |
| **A condition as a Path's signature (5b, now a guide)?** | "On a Critical, the spell's Path leaves its condition" is a shape Crucible uses and 2d12 doesn't have: a Talent seed |

## 7. Sources

`raw/2026-11-19-crucible.md` has the file paths and links. The repository: github.com/foundryvtt/crucible (version 0.11.3); its in-game rulebook; five issues read through a summarizing reader (their quotes need a second look).
