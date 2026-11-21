# Wounded states: what being hurt does by itself

**Asked (Lucas, 2026-11-21, the core review's second round):** Strained is to lose the free Reaction AP; what should Bloodied do, of equal weight but different? "The Guard is just a consolation prize and it can be worked around (using all actions on your turn, you lose nothing)." A small research on what other games give a "hurt" state.

**What was read:** Draw Steel's rules (winded, the Talent's strained) [read], Crucible 0.11.3's source (Weakened, Broken) [read], the Daggerheart SRD (Vulnerable at the last Stress) [read], the 13th Age SRD (staggered) [read], all from the core review's downloads. Cypher System (Impaired, Debilitated), Fabula Ultima (Crisis), Zweihänder (the Damage Condition Track) and an EN World thread on death spirals: [lead] (search summaries and fan cheat sheets, not the books). D&D 4e (Bloodied), Savage Worlds (Wounds), Blades in the Dark (Harm), The One Ring 2e (Weary), Mutants & Masterminds (the Toughness track): from memory, not checked this time.

## Takeaways

1. **Three families.** A hurt state either (a) **does nothing by itself and is a hook** (4e's Bloodied, 13th Age's staggered, Draw Steel's winded, Fabula Ultima's Crisis: all at half Health), (b) **makes you easier to hurt** (Daggerheart: the last Stress makes you Vulnerable, rolls against you gain advantage; Draw Steel's Brutal monsters: while winded, an edge on their strikes and on strikes against them), or (c) **makes you do less** (Savage Worlds: −1 per Wound to every roll and to Pace; Blades: less effect, then −1d, then you need help; Cypher: Impaired costs more Effort and loses the extra effects of a special roll, Debilitated can only move; The One Ring: Weary makes success dice of 1 to 3 count as 0; Crucible: Weakened at 0 Health loses Action and its free move, Broken at 0 Morale takes Banes, can't flank, and an NPC flees).
2. **The tactical games of the last fifteen years chose (a), on purpose:** a built-in penalty at half Health is a death spiral (the side that gets hurt first loses faster; "the spiral winds too quickly to a point where a character is negligibly effective", the forum's main complaint). They put the weight on the hooks instead.
3. **The games with a built-in effect put it at the bottom of the pool, not the middle** (Crucible at 0 Health or 0 Morale, Daggerheart at the last Stress, Cypher when a whole pool is empty), or they are gritty on purpose (Savage Worlds, Blades, Harn, Zweihänder).
4. **(b) feeds focus fire, (c) spreads it.** If a hurt creature is easier to finish, everyone finishes it. If a hurt creature does less, hurting a second creature is worth more than finishing the first. 2d12's playtest 7 problem was focus fire and binary lethality: family (b) makes it worse.
5. **Lucas's test, "can it be worked around", splits family (c) in two.** What hits a resource a creature might not use (Guard from unspent AP, a Reaction it doesn't have, Steadiness against a push that never comes) is dodged by playing as usual. What hits **an option used almost every turn** (moving, the full AP, the roll's extras) can't be, but costs more.
6. **Option losses, not numbers, are the modern form of (c)** (Crucible's lost free move, Blades' "you need help", Cypher's lost special-roll effects): they change the decision without a −1 on every roll.

## How it applies to 2d12

- **Today** Bloodied and Strained are family (a) (Chapter 4: "no effect by itself"). Strained losing the free Reaction AP (Lucas's direction) moves Strained into (c), option-loss form.
- **Candidates for Bloodied, by family**, with Lucas's test (worked around?) and the focus-fire test (feeds it?):

| Candidate | Family | Worked around? | Feeds focus? | Note |
|---|---|---|---|---|
| Loses the Guard from unspent AP | (c) | Yes: spend all AP | No | Lucas: a consolation prize. Rejected |
| Steadiness −1 / Forced Movement +1 against it | (c) | Yes, unless the enemy pushes | Slightly | Narrow: only against push cards |
| **Its Speed is halved (rounded up)** | (c), option | Only by standing still, which is the cost | No | Body-themed; bites most turns; a hurt brute can be kited (a decision for the other side); hits NPCs today, unlike Strained until NPCs have Reactions |
| Slowed 1 (regains 3 AP) | (c) | No | No | The old rule, removed in Round 3; a quarter of the output: much heavier than the Reaction AP |
| Its Doubles don't raise its Tier (Cypher's lost extras) | (c), option | No | No | Can't be dodged but rare (1 roll in 12) and invisible |
| Actions of 3 AP or more cost 1 AP more | (c), option | Partly: use smaller Actions | No | Hits the big turn; an extra rule to remember |
| Strikes against it raise a Tier on Doubles / gain a Boon | (b) | No | **Yes** | Draw Steel's Brutal, Daggerheart's Vulnerable: against the focus-fire finding |
| A Wound if the encounter ends while Bloodied | delayed | n/a | No | Level Up (A5E): "the next fight is harder"; a PC-only lasting cost; fits the Wounds placeholder, not the fight |

- **Evenness with Strained:** the Reaction AP is a reserve used on others' turns; a halved Speed is the freedom used on your own. Both are options, not numbers on a roll; both can be planned around, and planning around them is the cost (keep AP for Reactions; stand and fight).
- Whatever Bloodied does, the **Bloodied: / Strained: lines on Actions** (decided in this round) are where most of the weight goes, as in families (a) everywhere.

## Sources

- Draw Steel rules (winded, Brutal, the Talent's strained): the core review's download (`raw/` not kept; the files in the review's scratch). [read]
- Crucible 0.11.3, `module/models/actor-base.mjs` (`isWeakened`, `isBroken`) and its talents. [read]
- Daggerheart SRD: "When a character marks their last Stress, they become Vulnerable until they clear at least 1 Stress." [read]
- 13th Age SRD, combat rules: "When you are reduced to half your hit points or fewer, you're staggered." [read]
- Cypher: [Alexandrian's Numenera cheat sheet](https://www.thealexandrian.net/creations/numenera/strange-cheat-sheet.pdf), [Monte Cook, "Injurious Rules"](https://montecook.substack.com/p/injurious-rules). [lead]
- Fabula Ultima's Crisis: [Cheatography reference](https://cheatography.com/tangobreaker/cheat-sheets/fabula-ultima-reference). [lead]
- Zweihänder: [concise rules sheet (Scribd)](https://www.scribd.com/document/589646040/Zweihander-Concise-Rules). [lead]
- Death spirals: [EN World, "Tink-Tink-Boom vs. the Death Spiral"](https://www.enworld.org/threads/tink-tink-boom-vs-the-death-spiral-the-damage-mechanic-in-rpgs.665644/), [Gnome Stew, "Poking at lingering wounds"](https://gnomestew.com/poking-at-lingering-wounds/). [lead]
