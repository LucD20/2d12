# The class Basic attacks: the record (the core rework, batch 3; started 2026-11-22)

Each class carries its own Weapon Basic attack and Power Basic attack; the shared Weapon Attack goes, and "Basic attack" is the word for PCs and NPCs alike (`book/core-rework.md` B4, K8). One decision at a time, with Lucas's words. Nothing is in the book until he says so.

## Decision 1: the shape: (b), each class writes its own two cards (Lucas, 2026-11-22)

Asked: (a) one template plus one class line, (b) each class writes its own two cards freely, (c) two shared cards plus a class Passive. **Lucas: "B, though riders and effects are going to be very similar."** His examples ("Examples only"):

- **Archer, Weapon:** [Mod] / 1[W] + [Mod] / 1[W] + [Mod]; Bloodied: Tier 3 deals 2[W]. **Power:** "need to think of a flavor".
- **Paladin, Weapon:** [Mod] / 1[W] + [Mod] / 1[W] + [Mod]; Strained: you can Pull it 2. **Power (Range 5):** 1d4 Holy / 1d8 Holy; Pulled 1 / 2d6 Holy; Pulled 2; Bloodied: you can Slide them instead.

What his examples settle (Claude's reading, to confirm): Tier 1 deals [Mod] (B1); **Tier 3 deals 1[W] + [Mod] with no extra die** (B2 dropped): the weapon's own Tier 3 value and the card's Bloodied / Strained lines make the Tier 3 more.

## Drafts 2 (Lucas, 2026-11-22: "again only examples, feel free to suggest changes")

- **Archer, Weapon:** *Bloodied (above the roll):* Tier 3 deals 1d4! more (the weapon's type) · [Mod] / 1[W] + [Mod] / 2[W] + [Mod].
- **Archer, Power (Range 10):** *Strained:* Tier 3, the target is Daunted of you (EoT) · [R] 1d4 / 1d6 / 1d10 Ps.
- **Paladin, Weapon:** [Mod] / 1[W] + [Mod] / 1[W] + [Mod] · *Strained:* you can Pull it 2.
- **Paladin, Power (Range 5):** [R] 1d4 Ho / 1d8 Ho, Pulled 1 / 2d6 Ho, Pulled 2 · *Bloodied:* you can Slide it instead.

His Archer draft puts the damage-changing Bloodied line above the roll: the rule of decision 2 (a line that changes this Action's own damage reads the target before the roll) in practice.

**Expected damage a use** (the system's odds, `calc.mjs tierProbs`; the Critical's 1d10! counted for the new cards; level 1 Modifiers; no Boons or Banes) [calc]:

| Card | vs 12 | vs 13 | vs 14 | Hits (T2+) vs 13 |
|---|---|---|---|---|
| Archer, old Weapon Attack (Hunting Bow, +2) | 5.2 | 4.8 | 4.4 | 72% |
| Archer, new Weapon (Hunting Bow) | 7.7 | 7.1 | 6.5 | 72% |
| ... the target already Bloodied | 8.8 | 8.0 | 7.3 | |
| Archer, new Weapon (Recurve Bow) | 7.6 | 7.0 | 6.4 | |
| Archer, new Power (+1 vs WD) | 4.0 | 3.8 | 3.6 | 65% |
| ... its dice exploding | 4.7 | 4.5 | 4.4 | |
| Paladin, old Weapon Attack (Longsword, +1) | 8.5 | 7.6 | 6.8 | 65% |
| Paladin, new Weapon (Longsword, +1) | 9.0 | 8.2 | 7.4 | 65% |
| ... Weapon first (+2, H1) | 10.8 | 10.0 | 9.2 | 72% |
| Paladin, new Weapon (Arming Sword, +1) | 6.3 | 5.8 | 5.2 | |
| Paladin, new Power (+2 vs WD) | 5.2 | 4.9 | 4.6 | 72% |

Riders: Daunted, the Pulls and the Slide [not priced].

## Draft 3 (Lucas, 2026-11-22: "give paladin t3 2[w]"; "I think we are commiting a mistake by making the V damage attack get more things. So if it is weapon dealing V, we make the extra on Strained."; "Increase archer's pow, not a lot damage"; "Yes, it is all exploding"; "Change paladin to sli 1")

**The principle (Lucas): a card's Bloodied / Strained line keys on the other pool.** A Weapon Basic attack (it deals [V], it makes targets Bloodied) has its extra on **Strained**; a Power Basic attack (it deals [R], it makes targets Strained) has its extra on **Bloodied**. So each attack rewards the other, and a mixed turn pays.

- **Archer, Weapon** (At-will, 1 AP, [Strike, Weapon], Distance: Weapon): *Strained (above the roll):* a Tier 3 deals 1d4! more (the weapon's type) · [V] [Mod] / 1[W] + [Mod] / 2[W] + [Mod].
- **Archer, Power** (At-will, 1 AP, [Power, Strike], Distance: 10 sq.): [R] 1d4! / 1d8! / 1d12! Ps · *Bloodied:* on a Tier 3, the target is Daunted of you (EoT). (Claude's step up: 1d6! to 1d8!, 1d10! to 1d12!.)
- **Paladin, Weapon** (At-will, 1 AP, [Strike, Weapon], Distance: Weapon): [V] [Mod] / 1[W] + [Mod] / 2[W] + [Mod] · *Strained:* you can Slide it 1.
- **Paladin, Power** (At-will, 1 AP, [Divine, Power, Strike], Distance: 5 sq.): [R] 1d4! Ho / 1d8! Ho; Pulled 1 / 2d6! Ho; Pulled 2 · *Bloodied:* you can Slide it instead.

**Expected damage a use, vs 12 / 13 / 14** [calc]: Archer Weapon (Hunting Bow) 7.7 / 7.1 / 6.5 (8.8 / 8.0 / 7.3 against a Strained target); Archer Power 5.4 / 5.2 / 4.9; Paladin Weapon (Longsword, +1) 12.6 / 11.3 / 9.9, (Arming Sword) 8.5 / 7.7 / 6.8; Paladin Power 6.1 / 5.8 / 5.5. Old Weapon Attack: Archer 4.8, Paladin (Longsword) 7.6, vs 13.

## Draft 3 settled (Lucas, 2026-11-22)

The four cards as drawn in the chat (names and Flavor Claude's): **Loose** and **Harrying Shot** (Archer), **Oathblade** and **Drawing Light** (Paladin). The Longsword's Tier 3 at 2[W] (about 27) accepted. **Traits (Lucas):** "Harrying Shot also gets the Weapon trait" (with [Ranged]: it is an arrow from her bow, Doomed while Engaged); "Loose has to be Ranged and Projectile" (fixed traits: it needs a bow; it no longer takes Melee from the weapon). Drawing Light has no [Ranged] (light, not a missile). Oathblade takes Melee or Ranged from the weapon, as the Weapon Attack did.

## The traits withdrawn (Lucas, 2026-11-22: "Lets remove the traits for now then, too many small problems")

Harrying Shot is [Power, Strike] again (no Weapon, no Ranged: no Weapon-and-Power roll question); Loose takes Melee or Ranged from the weapon, as Oathblade does (an Archer with a Dagger still has it). Drawing Light [Divine, Power, Strike].

## Asked next (Lucas): the Paladin's damage lower ("removing the [Mod]?"); if every class chooses its Modifier order, the two Basic attacks must be level

Numbers vs 13 at +2 (the Modifier first) and +1 (second) [calc]: Oathblade Longsword as drafted 13.6 / 11.3; without [Mod] on Tiers 2-3 12.1 / 10.6; with Tier 3 "1[W] + [Mod] + the weapon's die again" 11.2 / 9.2; Oathblade Arming Sword 9.5 / 7.7; Loose (Hunting Bow) 7.1 / 5.5. Power, as drafted: Harrying Shot 5.4 / 5.2, Drawing Light 5.8 / 5.5; "[Mod] / 1d8! + [Mod] / 2d8! + [Mod]" 7.4 / 5.8; with 1d6! 6.4 / 4.9; with 1d10! 8.3 / 6.6.

## Decided (Lucas, 2026-11-22: "Yes, and power should break the format, which is why I want no Mod on it")

1. **Back to one shared Weapon Basic attack** (it replaces the Weapon Attack): **[V] [Mod] / 1[W] + [Mod] / 1[W] + 1[D] + [Mod]**. **[D] is new: the weapon's damage die on that Tier** (a Longsword's Tier 3: 1d6!); written apart from [W], you roll that die once more. [W] keeps its meaning (the whole weapon damage). This revises decision 1 (b): the Weapon attack is shared, the Power attacks are each class's.
2. **Each class's line on it:** Paladin: "Your Basic Attack gains: **Strained:** you can Slide the target 1." Archer: "Your Basic Attack gains: **Strained** (above the roll): a Tier 3 deals 1[D] more."
3. **The Power attacks are each class's and break the format: no [Mod] in their damage** (dice only, their own riders): Harrying Shot [R] 1d4! / 1d8! / 1d12! Ps, Bloodied: on a Tier 3 Daunted of you (EoT); Drawing Light [R] 1d4! Ho / 1d8! Ho, Pulled 1 / 2d6! Ho, Pulled 2, Bloodied: Slide instead.
4. **Every class chooses its Modifier order** (H1; Chapter 5's "if your class lets you" goes).

Expected damage vs 13 (Modifier first / second) [calc]: Basic Attack: Hunting Bow 6.6 / 5.0, Recurve Bow 6.8 / 5.2, Arming Sword 8.5 / 6.8, Longsword 11.2 / 9.2 (its Tier 3 about 19); Harrying Shot 5.4 / 5.2; Drawing Light 5.8 / 5.5 (and its Pull).

## Open, next
- A rule the examples need: a Bloodied / Strained line that changes **this Action's own damage** can't wait for that damage (it would be circular): it reads the target as it was before the roll.
- The Archer's Power Basic attack: its flavor.
- Each card, one at a time, priced in the analysis format (`paladin-analyses.md`).

## Revised (Lucas, 2026-11-22)
- **Basic Attack Tier 1** changes from `[V] [Mod]` to **`[V] 1d4!`** (the weapon's damage type), matching the Power Basic attacks (`1d4!`) so every Basic attack rolls an exploding die on Tier 1 without needing a special Tier 1 `[D]` ruling (weapons stay `0` on Tier 1).
