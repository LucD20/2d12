# Durations: when an effect ends (start of turn, end of turn, rounds)

## 2026-11-15: for the Paladin's Arts ("until your next turn starts")

**The question (Lucas):** he wants only two durations, EoT and rounds, and to stay away from "until the start of your turn". Should he give in and use it? And if so, should rounds count down at the start of the origin's turn instead of its end, so that "1 round" ends when the origin's next turn starts?

**How far to trust this file:** [read] = read on the page or in the rules text. [lead] = a search summary of a page not opened.

**Our rule today (Chapter 2):** EoT = the end of the affected creature's turn. "For N rounds" counts down at the end of the origin's turn, starting with its next turn: an effect made on your turn "for 1 round" ends at the end of your next turn. One made out of turn (a Reaction) counts in the slot where it was made: it ends at the end of that creature's next turn.

### Takeaways

1. **Draw Steel has no rounds at all, and uses "until the start of your next turn" more than any timed duration.** [read: its Classes chapter, counted] "until the start of your next turn" 47 times, "(save ends)" 28, "(EoT)" 11 ("an effect that lasts until the end of the affected creature's next turn"), "until the end of your next turn" 11, "until the end of the encounter" 78. The pattern: a condition on a target ends on the **target's** turn; something the hero holds up (a ward, a bane on attackers, a stance) ends when the **hero's** next turn starts.
2. **Pathfinder 2e counts rounds at the start of the creator's turn** [lead: Roll20's rules compendium], but harmful effects "until the end of the target's next turn" count at the end of the target's, and sustained effects at the end of the creator's next turn. A Foundry Pathfinder 2e issue asks the system to say on whose turn an expiry falls, listing four cases (start or end, the origin's turn or the target's): the confusion is the number of end points.
3. **4e's "until the end of your next turn" gives the origin a second bite, and players noticed.** [read, EN World] "a UENT attack will affect the target for one of his actions and then your next turn"; posters rated it better than "save ends". A house rule turned every such effect into "until the end of the target's next turn"; DMs praised fixed, simple durations for removing "whose turn the effect ends on, or whether it's at the start or the end". [lead for the last]
4. **5e mixes both with no stated rule.** [lead] Shield ends at the start of your next turn, Guiding Bolt at the end of it, and the book calls both "1 round".
5. **Counting at the start of the creator's turn breaks when the effect wasn't made on the creator's turn.** [lead, The Angry GM, on a different initiative system] an aura can end before anyone met it. [mine] The same in ours: a Reaction's effect made on an enemy's turn and ending when the Paladin's turn starts would last one creature's turn or a whole round, by Initiative order alone.

### How it applies to 2d12

- **The trouble in every game is four possible end points. We have two** (EoT: the target's turn ends; rounds: the origin's slot ends). That is already the lean end of the field; "until your next turn starts" would be a third.
- **Don't move the count to the start of the turn.** Counting at the end guarantees one thing the start can't: every creature, the one whose turn it was made in included, takes one full turn under the effect. A Taunt from a Reaction on the enemy's turn must cover that enemy's next turn; counted at a start it would cover only the rest of this one.
- **What counting at the end costs:** an effect made on your own turn also covers your own next turn (4e's second bite). For a defensive effect that is harmless: Brace and Courage written "(1 round)" just stay up through his next turn.
- **So: write "(1 round)" on the things he holds up.** Two durations, no rule change.
- **One place in the book already means start-to-start:** the unused AP's Guard ("for 1 round ... ends 1 round later, when you regain AP again"). It is defined there in full, so it isn't ambiguous, but it is the one "round" that isn't the rule's round.

## 2026-11-15 (the same day): would 2d12 benefit from "save ends"?

**The question (Lucas):** a duration that lasts until the affected creature makes a Save.

**Our rules first.** Chapter 8's opening line lists "until a Save: see Effect Timing" among the durations, but Effect Timing has no such rule: a dangling reference. What we do have is three ways for a condition to end by the creature's own effort: **Break Free** (Immobilized: 1 AP), **Stand** (Prone: 1 AP), and **Shake Off** (Lingering: 1 AP and a Save). No condition ends by a roll at the end of the turn.

1. **What "save ends" is in the games that have it.** A roll at the end of the affected creature's turn; on a success the condition ends. 4e: a flat roll, 10 or more on a d20 (55%) [memory, unverified]. Draw Steel keeps it: "(save ends)" 28 times in its classes [read, counted], a flat d10 roll [memory, unverified]. It ends at the same moment as an EoT effect (the target's turn ends), so it adds no new end point.
2. **What it is praised for** [lead, a Giant in the Playground thread "Why the hate for Save Ends?"; lead, EN World]: a single ability can't shut down a whole fight; strong conditions can exist without a fixed long lock; the afflicted player gets a roll.
3. **What it is blamed for:** you "can't plan around it" [lead, the same thread]. It is weaker than it looks: "(save ends) have a 50/50 chance of ending sooner than that anyway and very little chance of lasting more than 2 or 3 rounds" [read, EN World]. In players' hands it produced the "Stun-Lock Wizard" and the "perma-Dom Bard" when saves kept failing [lead, Dungeon's Master, which proposes removing it]. And it is a roll every turn for every condition.
   - *For 2d12:* **the odds don't suit our roll.** A creature with +2 against DC 13 gets a Tier 2 or better 72% of the time [computed]: a save-ends condition would last 1.4 turns on average, barely more than EoT, for an extra 2d12 roll each turn. Make it "Tier 3 ends" and it is 22%: 4.5 turns, longer than our fights (3.5 rounds). A flat die that isn't 2d12 would be a second resolution mechanic.
   - **We already have the better version: the creature pays to end it.** Break Free, Stand and Shake Off give the afflicted creature a choice, not a roll, and the price is AP, the game's own currency. "Immobilized: it pays 1 AP to leave" is a decision every time; "save ends" is a die.
   - **Our fights are short.** Save ends earns its place in fights of 6 to 8 rounds (4e); in 3.5 rounds, EoT and "(2 rounds)" cover the range.
   - *So:* no general save ends. Where a condition should outlast a turn without a fixed count, write "until it pays" (an AP, or an Action as Shake Off). And fix Chapter 8's dangling "until a Save".

### Sources
- [Draw Steel: Classes chapter (Steel Compendium rules text)](https://github.com/SteelCompendium/data-rules-md)
- [EN World: Powers that last until the end of your next turn](https://www.enworld.org/threads/powers-that-last-until-the-end-of-your-next-turn.253448/)
- [Paizo: "for the next round", what does that exactly entail?](https://paizo.com/threads/rzs2phob)
- [Roll20 compendium: Pathfinder 2e, Durations](https://roll20.net/compendium/pf2/Rules:Durations)
- [Foundry pf2e issue 18990: say on whose turn an expiry is triggered](https://github.com/foundryvtt/pf2e/issues/18990)
- [EN World: I cast Shield! For one turn?](https://www.enworld.org/goto/post?id=6906922)
- [EN World: "Fixed duration" to "save ends"](https://www.enworld.org/threads/fixed-duration-to-save-ends.297068/)
- [Dungeon's Master: remove save ends](https://dungeonsmaster.com/2011/09/remove-save-ends/amp)
- [The Angry GM: Popcorn Initiative](https://theangrygm.com/popcorn-initiative-a-great-way-to-adjust-dd-and-pathfinder-initiative-with-a-stupid-name/)
- [Giant in the Playground: Why the hate for Save Ends?](https://giantitp.com/forums/archive/index.php/t-396305.html) (not opened)
- [EN World: Stun, the Fun-Killer](https://www.enworld.org/threads/stun-the-fun-killer.703292/)
- [EN World: Status effects / conditions](https://www.enworld.org/threads/status-effects-conditions.469868/)

### Not covered yet
- Pathfinder 2e's own Durations text (the rules site is drawn by script); Lancer's and 13th Age's durations; a designer's statement on why Draw Steel dropped rounds.
