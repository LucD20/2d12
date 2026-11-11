# Decision sheet S1: the structural candidates (answered by Lucas, 2026-11-11; nothing applied)

MASTER-PLAN step 1. Lucas answered the 32 items Claude proposed (with defaults) on 2026-11-11. **Log only: no change to rules-src, the ruler or Foundry yet.** Lucas is already doing the Boons and Modifiers part (items 16-19 and 21-28) in another branch. When that pack is done he updates the knowledge, and then this sheet is compared with what he did before step 2 (the ruler) starts.

## A. Stage 0 and the level cap
1. **Stage 0 (levels 1-3): yes.**
2. **The cap is 15. Only Stage 0 (levels 1-3) gets written for now** (Lucas, 2026-11-11, correcting his first answer, which was Stages 0 and 1: "let's focus on making Stage 0 (1-3) fun before the rest"; earlier: "we need to make the combat loop fun first"). Level 4 (the Apex, the Stage Talent, the Stage increase) stays in the table below as the target, and Stages 1 to 3 come later.
3. **Stages:** Stage 0 levels 1-3, Stage 1 4-7, Stage 2 8-11, Stage 3 12-15: **yes.**
4. **Option A: Stage 0 has its own numbers and its own Bestiary row.**
5. **Lucas's level lists** (these replace the template Claude proposed):

   | Level | Paladin | Archer |
   |---|---|---|
   | 1 | Divine Power; Smite or Lay On Hands; Shield of Faith or Rebuke; Escalation 2; 1 Skill Talent | Sharpshooter; Marked Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; Escalation 2; 1 Skill Talent |
   | 2 | Kindled Wrath; 1 Encounter Pick; Escalation 1; 1 Talent | Thrill of the Kill; 1 Encounter Pick; Escalation 1; 1 Talent |
   | 3 | Escalation 3; 1 Skill Talent | Escalation 3; 1 Skill Talent |
   | 4 (Stage 1) | 1 Apex; Stage Talent; the Stage increase: Health and Rally Points | the same |

   **The Escalation rungs (Lucas's answer to question 1):** the Passives' Escalation levels on the 1-to-6 ladder. **Level 1 gets the Escalation 4 Passive, level 2 the Escalation 2 Passive, level 3 the Escalation 6 Passive**, and the Apex comes at level 4. "Escalation 2 / 1 / 3" in the table are today's rung names: rung 2 = 4, rung 1 = 2, rung 3 = 6.

   What follows from it:
   - **The Escalation hook Features** (Kindled Wrath, Thrill of the Kill) move to level 2, so neither class gets its hook's +1 Escalation at level 1.
   - **Talents alternate:** a Skill Talent at levels 1 and 3, a regular Talent at level 2. This is the start of the "two tracks" proposal (TALENT STRUCTURE in rules-backlog.md; roleplay-skills.md proposal 3).
   - **The Apex moves to level 4,** as the start of Stage 1.
   - **The Daily Pick isn't in Stage 0** (today it comes at level 3). **It comes later** (Lucas's answer to question 2), in a Stage written after Stage 0.
   - **Level 1 has no Passive until Escalation 4** (round 4 at Momentum 0, round 1 at Momentum 3 or more). Levels 2 and 3 fill in Escalation 2 and 6. The ruler checks how a level 1 PC's first fights feel.
   - **Skill Talent slots stay empty for now** (Lucas's answer to question 4), until the Skills design (D3).
6. **The numbers by Stage:**
   - **No Attribute increases at the Stages** (Lucas: "no need to change attributes").
   - Guard per unspent AP stays 2 / 2 / 3 / 4 (Stages 0 / 1 / 2 / 3).
   - Rally Points stay Rally + 1 / 2 / 3 / 4.
   - The Health steps come at Stages 1, 2 and 3 (each class needs three steps; the ruler sets them).
7. **Stage Talents at levels 4, 8 and 12: yes.**
8. **Retraining: on a Rest, you can swap all of your choices**, the Hallmark Action and the Hallmark Reaction included (Lucas's answer to question 3). This replaces "one swap a level-up" and the free swaps in Stage 0.
9. **No pacing line for now.** An XP ladder comes later; Stage 0 should be fast.

## B. Escalation 1 to 6 and Momentum (book/expedition-loop.md, part 1)
10. **Escalation runs 1 to 6.**
11. **You start at Escalation 1 + Momentum, and gain +1 at the start of each round after the first: yes.**
12. **The Critical and the class hook each give +1, once an encounter: yes.**
13. **(a): Momentum +1 after each encounter overcome** (a fight, a negotiation, a sneak, a Challenge).
14. **Momentum is capped at 4, not 3** (so you start at Escalation 5 at most).
15. **Losing Momentum:** -1 at each Sleep, -1 when a PC goes Down, all of it on a Retreat, cleared at a Rest: **yes.**

## C. Boons and Banes
16-19, 21, 22. **Lucas is already doing these in his other branch** (flat Boons, the Favored simplification, the Circumstance limit and its lists, the Flanking cap, an overall cap). Compare with his branch once the knowledge is updated.
20. **The rule for unnamed sources** (+1, rarely +2, never "+1 per X"): **yes, but allow "+1 per Stage" or similar** as the exception, so a source can grow with the Stage.

## D. Weapon and Power Modifiers as class values
23, 24. **Also in Lucas's other branch** (class values; the level 1 values).
25. **The raises: yes.** Never above +4. On four Stages: +1 to either at Stage 1, nothing at Stage 2, +1 to both at Stage 3.
26. **The Signature Modifier is the higher of the two: yes** (check it against his branch).
27. **One paragraph on what Attributes still do: yes.**
28. **The +1 secondary Modifier (1 less Ward Defense and weaker Power Actions for a weapon-first PC): accepted** (check it against his branch).

## E. Quick Build
29, 30. **Not yet: much later** (the marked defaults and the pregenerated characters).

## F. How to proceed
31. **Answer now, and let the ruler confirm the numbers after: yes.**
32. **The branch name:** not answered. Default: `pack-s1-core` when steps 2 and 3 start.

## G. Talents (Lucas, 2026-11-11)
33. **Remove all the current Talents** (the 18 cards of `book/rules-src/16-talents.md` and `book/cards/talents.json`). Lucas hasn't reviewed any of them, and he wants to focus on the classes. **Logged, not done:** this happens with steps 3 and 4. The Talent slots (Talent and Skill Talent) stay in the level lists as empty slots. What to check when it's done:
    - the ruler's `catalogue/talents.txt` and `talents-ranged.txt`, and the class builds and Talent options that use them (the R builds leave Talents out already);
    - Foundry's compendium and the Talent picker (v0.0.186 / v0.0.195), and any tests that use a Talent;
    - every reference in the book (Opportunity Attack is a Talent today; Class Expertise; Brawler, then Kickboxer).

    The TALENT STRUCTURE proposal in rules-backlog.md stays, for when Talents are rewritten.

## For the ruler (step 2) to check
- **Stage 0 power:** level 1 now has one Passive (at Escalation 4), no Escalation hook and no Talent in play. Fit the Bestiary's Stage 0 row to levels 1, 2 and 3.
- **Momentum 4:** you start at Escalation 5 at most. With a Critical or the hook in round 1, you can reach rung 6 (the Apex) in round 1, which the expedition loop wanted to avoid. The Apex only arrives at level 4, so this is a Stage 1 question: check how often it happens and what it does to the last fight of an expedition.
- **Health steps for three Stages, and the Bestiary rows for Stages 0 and 1.**

## Questions for Lucas: answered 2026-11-11
1. **The rungs:** Escalation 4 at level 1, Escalation 2 at level 2, Escalation 6 at level 3 (item 5).
2. **The Daily Pick:** later (item 5). With it, Lucas narrowed the scope: Stage 0 first (item 2).
3. **Swapping on a Rest:** all of it, the Hallmarks included (item 8).
4. **Skill Talents:** an empty slot for now. With it, Lucas asked to remove all the current Talents (item 33).

**Status:** Lucas's other pack (Boons and Modifiers) isn't done yet. Compare it with items 16-28 once he has updated the knowledge, before step 2.
