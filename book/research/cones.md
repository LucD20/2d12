# Cones on a square grid

**Date:** 2026-11-18. **Asked by Lucas** (with a picture of four cones in Foundry, saved as `raw/2026-11-18-cones-lucas.png`): "We haven't done Cones yet. Cone is simple, see image for how cones should be. [...] No need to write it fully with all the caveats right now, but for reference, these are the only valid placements: in front of you or on a corner. You can't place them in an intersection and straight forward to 'occupy more squares'. Make a quick research about cone areas."

**What was read.** Quick, as asked. **[checked, through a summarizing reader]** Pathfinder 2e's Area rules (Roll20's copy of Player Core). **[lead]** search summaries of forum threads on D&D 5e's and Pathfinder's cones (EN World, D&D Beyond, Paizo), RPGBot's guide to 5e's areas, a MapTool pull request. **Computed by Claude:** a rule that reproduces Lucas's four shapes square for square.

**Other games' rules, never 2d12's. Lucas's picture is his decision on the shape; the wording is not written.**

---

## 1. Lucas's four cones (read off the picture; rows counted from the caster outward)

| Cone | Placement | Squares in each row | Total |
|---|---|---|---|
| Cone 5 | in front of you | 1, 3, 5, 7, 3 | 19 |
| Cone 5 | on a corner | 5, 4, 4, 3, 1 | 17 |
| Cone 3 | in front of you | 1, 3, 3 | 7 |
| Cone 3 | on a corner | 3, 2, 1 | 6 |

- **In front of you:** the cone starts with the one square that shares an edge with yours and widens by one square on each side every row, until the far rows are cut by the distance.
- **On a corner:** the cone starts with the square that touches your corner and fills that diagonal quarter, a staircase.
- **Only these two.** No cone starting from a grid intersection and aimed straight, which would cover more squares.

## 2. One rule gives all four shapes

**A Cone N is every square within N squares of you, counted the way the book counts distance (every second diagonal counts 2), that lies in one quarter around you:**
- **in front:** the squares that are further forward than they are to the side;
- **on a corner:** the squares that are both forward and to one side (strictly inside one diagonal quarter).

Checked by computation against the picture: in front gives rows 1, 3, 5, 7, 3 for a Cone 5 and 1, 3, 3 for a Cone 3; on a corner gives 5, 4, 4, 3, 1 and 3, 2, 1. **All four match exactly.** So a cone needs no template of its own: it is "an Emanation's reach, one quarter of it", and its far edge is rounded for the same reason an Emanation's is.

There are eight cones around a creature: four in front (one for each side of its square) and four on the corners.

## 3. Takeaways from other games

1. **Pathfinder 2e has the same idea in one paragraph** [checked]: "A cone shoots out from you in a quarter circle on the grid"; "the first square of that cone must share an edge with your space if you're aiming orthogonally, or it must touch a corner of your space if you're aiming diagonally"; "You can't aim a cone so that it overlaps your space"; for a Large creature "the first square can run along the edge of any square of your space". Lucas's two placements are these two.
2. **Even so, players argue about it** [lead]: Paizo forum threads call the orthogonal cone "very sloppily explained", and report printed templates and virtual tabletops disagreeing on a 15-foot cone. Pathfinder shows the shapes in diagrams; the text alone wasn't enough.
3. **D&D 5e's cone is the cautionary tale** [lead]: its width equals its length (a triangle, not a quarter circle), its rules for a grid cover circles and "remain silent for cones", and tables argue whether a square the cone only clips is hit. Tools settle it by computing whether more than half a square is covered.
4. **The two inclusion tests** found: "more than half the square" (5e's circle rule, the tools) and "the square's center is inside" (a Pathfinder argument). Lucas's shapes need neither: counting distance in squares decides every square with no geometry.

## 4. How it applies to 2d12

- Chapter 3 says "Cones are not written yet"; its Push and Pull already use a 45° cone of directions, so the word needs care: a **Cone** (an Area) and "the cone" of a Push are two things.
- The rule in section 2 uses only the book's own distance count, so it can't produce a clipped-square argument.
- **Diagrams will matter more than the sentence** (takeaway 2): the four shapes of the picture, as `diagrams.py` figures.
- **Still to write when it is done fully** (Lucas: not now): the Point of Origin (the caster's square, as for a Line); larger creatures (Pathfinder: any edge square of the space); Line of Effect and Cover from the caster's square; that the caster is not in it; whether a Cone can be placed at a Distance or always starts from you.
- For magic: a Cone is the natural Area of a [Melee, Spell] such as Burning Hands, and its small sizes (6 or 7 squares at Cone 3) sit between "two creatures" and a Burst.

## 5. Sources

- Lucas's picture: `raw/2026-11-18-cones-lucas.png`.
- Pathfinder 2e, Areas (Roll20's compendium copy of Player Core) [checked, summarized]: https://roll20.net/compendium/pf2/Rules:Area
- [lead] Paizo forums: https://paizo.com/threads/rzs435tr , https://paizo.com/threads/rzs2p5kv , https://paizo.com/threads/rzs2r4uc
- [lead] D&D 5e: https://rpgbot.net/new-guide-to-dnd-5es-area-of-effect-rules/ , https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/43382-cone-spells-area-of-effect , https://www.enworld.org/threads/5e-cone-radius-question.474631
