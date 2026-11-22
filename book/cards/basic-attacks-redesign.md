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

## Open, next
- A rule the examples need: a Bloodied / Strained line that changes **this Action's own damage** can't wait for that damage (it would be circular): it reads the target as it was before the roll.
- The Archer's Power Basic attack: its flavor.
- Each card, one at a time, priced in the analysis format (`paladin-analyses.md`).
