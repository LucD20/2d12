# A condition from a second source (Frightened of two, Taunted by two)

## 2026-11-18: after the audit's Stacking question

**The question (Lucas):** "Should we make Frightened and Taunt stack?" (after Judge became the card-level exception: "Multiple Paladins can Judge the same creature").

**How far to trust this file:** [read] = read on the page. [lead] = a forum's quote of a rulebook, not the book. [memory] = from what I know of the rules, not opened this session.

**Our rule today:** Chapter 8's intro: "Unless a card says otherwise, a creature can't have the same condition twice: if they would gain a condition they already have, keep the longer duration" (and the highest value). Frightened is "always **of** a source", Taunted "always **by** a creature", Grabbed has a holder. **The gap:** when the second one comes from another creature, the book doesn't say whose it is. Foundry (`effects.mjs createEffect`) takes the new source and keeps the longer of the two durations in rounds, a mix the book doesn't write.

### What other games do

- **Draw Steel** [read, Steel Compendium's conditions page, Heroes 1.01b]: Frightened: "If a creature gains the frightened condition from one source while already frightened by a different source, the new condition replaces the old one." Taunted: the same sentence. Its Taunted is a double bane on abilities "that doesn't target the creature who taunted them, as long as they have line of effect to that creature".
- **D&D 4e marks** [lead: Stephen Radley-Macfarland's rules column, quoted on EN World]: "a creature can be marked by only one opponent at a time and new marks supersedes old marks." Players at once saw a trick in it: "marking an ally to remove an opponent's (scarier) mark" [read, the same thread].
- **D&D 2024** [read, Rules Glossary]: "A condition doesn't stack with itself; a recipient either has a condition or doesn't." Frightened: Disadvantage "while the source of fear is within line of sight", "can't willingly move closer to the source of fear". The glossary doesn't say what a second source does.
- **D&D 2014** [memory]: "each instance of the condition has its own duration, but the condition's effects don't get worse": tables read it as Frightened of both creatures at once (you can't approach either).
- **Pathfinder 2e** [memory]: Frightened is a value with no source (take the higher value); there is no taunt condition.

### Takeaways

1. **The two games built for tactical play with soft taunts (4e, Draw Steel) both say "one source at a time, the new one replaces the old".** It is one sentence, it leaves nothing to the table, and taking the enemy over becomes a choice ("I Taunt it away from you").
2. **Stacking a taunt from two creatures breaks the soft taunt.** Taunted by A and by B: an Action against A takes a Bane (B's taunt) and one against C takes two. There is no choice left that escapes the penalty, which is what a soft taunt offers the GM (frontline-protection.md: the soft taunt is the kind that keeps the GM's choice).
3. **Stacking fear has a story (fear of both) but a cost:** two sources to track, two Saves, and a rule for the Bane (with Boons and Banes adding up, Frightened of two would mean 2 Banes unless written otherwise). 5e 2014 pays it; 5e 2024 dropped the sentence.
4. **Replacement has one odd case:** a short fear from one creature can replace a longer one from another. 4e's players found the trick (mark your ally to clear the enemy's mark). In 2d12 a creature only gets these from cards that target enemies, so the trick needs the enemy's own cooperation.

### How they apply (Claude's recommendation, for Lucas)

- **No stacking for Frightened or Taunted**, and Chapter 8 writes the missing sentence once, for every condition with a source (Frightened of, Taunted by, Grabbed by): "A condition with a source comes from one source at a time: if a different creature gives it to you, the new one replaces the old one, with its own duration." The same source again keeps today's rule (the longer duration, the higher value).
- Foundry would follow exactly (today it mixes the new source with the longer duration).
- A card that wants to stack says so, like Judge.

### Sources

- [Steel Compendium: conditions (Draw Steel)](https://steelcompendium.io/v2/Browse/rule/combat/condition/)
- [D&D Beyond: 2024 Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)
- [EN World: SRM Marking, Marked and Other 4Eisms](https://www.enworld.org/threads/srm-marking-marked-and-other-4eisms.220018)
