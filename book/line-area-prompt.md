# Pack prompt: the Line area (book + Foundry). Reviewed with Lucas 2026-10-31; nothing applied yet.

Run as its own pack: "Read HANDOFF.md and MASTER-PLAN.md and run the Line pack (book/line-area-prompt.md)".
**Start from the branch `claude/pack-d2-w`** (it has v0.0.208 and D2, not yet on main) unless it has been merged; the version is **v0.0.212**, the next new test **t170**. Don't edit book/weapon-trees.md (another session is designing there).
The original prompt and diagrams came from the design chat (Line_Area_Diagrams.html); this file is that prompt with the review's decisions.

## The rule (decided)
- **Written "Line 10"** (value after the word, like Aura). A Line **always starts from you**: the center of your square, like an Aura
  (other origins later, if a card says so). It has no Distance.
- **Aim** at any square. Draw a segment from the center of your square through the center of that square. **One square per step along the
  segment's longer direction: at each step, the square whose center is nearest to the segment.** The first square is the one next to you. It
  continues past the aimed square until the distance (the book's count: a square at (major, minor) costs major + floor(minor / 2)) would pass
  the value. Line 10 = 10 squares straight, 8 at 2:1 or 5:2, 7 at 45 degrees. Never count every square the segment touches.
- **Ties** (the segment passes exactly between two squares): choose left or right once, seen from above looking from you toward the target,
  before rolling; every tie in that Line takes that side. No tie: no choice. Both sides give the same length (not always the same shape: 4:1).
- **A larger creature** starts the Line from a square of its space on the side it aims toward.
- **Cover:** checked from your square (the Point of Origin) as for any area, but **creatures in a Line don't give cover to other creatures
  in it** (walls still do). Line of Effect as for other areas; rolled once for all targets; creatures don't block it.
- **No range Banes inside a Line** (its value is its reach); other Banes (Engaged for a [Ranged] Action, Cover from walls) apply.
- **Walls:** a Line stops at the first square it can't enter (a wall or a solid obstacle): squares behind it are not part of it (this matters
  for kept and [HT] Lines).
- **Height:** unless the card says otherwise, a Line is **1 square high** (it doesn't reach a creature flying above its squares).
- **Straight Line movement (Chapter 3; Charge, Forced Movement) uses the same squares**: lineSquares from your square to the destination,
  ending there, with one tie side for the whole movement (your own movement: you choose; Forced Movement: the origin chooses). Update the
  Straight Line text, its figures and Foundry's Charge / Forced Movement path to match.
- Width-2 Lines and Cones: later.

## Book work
1. 03-movement.md > Areas > Other areas: the Line text (short and plain), a smaller [!tbd] for Cones. 03-movement.md > Straight Line: the same
   squares and the one-side tie rule.
2. Diagrams (diagrams.py, as burst / straight are built; "you" is Y): straight Line 10 (10 squares), diagonal (7), 5:2 (8, no ties), steep,
   2:1 ties left and ties right (tie squares marked, the passed-over ones dashed), a Large creature from two squares of its space, a Line
   stopped by a wall; the distance count in the squares where it helps. Redraw the Straight Line figures if they change.
3. 07-traits.md (Area), 09-glossary.md (Line), any card that says "line", rules-backlog.md (the Line item: applied).

## Foundry work
- `lineSquares(origin, target, value, side)` (integer math; x column, y row down; LEFT when dx*p.y - dy*p.x < 0; a tie when 2*rem === maj),
  then cut at the first square a wall blocks. Store {origin, target, value, side} on the region's flags and rebuild the squares from them.
- Use the existing square-area pipeline (template.mjs emanationCells / burstCells, areaReach for Line of Effect and cover, regionshape.mjs
  cellsOutline / shapesForCells). **A diagonal Line's squares touch only at corners:** cellsOutline expects one piece; use one rectangle per
  straight run, or teach cellsOutline corner-only contacts. Check it in Foundry.
- Placement: aim with the mouse, a Left/Right toggle only when the Line has a tie, the passed-over tie squares dashed in the preview, the side
  locked when placed; a larger creature's start square on the aimed side.
- No range Banes for creatures in a Line; creatures in it give no cover to each other; height 1.
- Charge and Forced Movement paths use lineSquares (one tie side).

## Tests
Line 10 from (0,0): aim (1,0) → (1,0)..(10,0); (1,1) → (1,1)..(7,7); (2,1) left → (1,0) (2,1) (3,1) (4,2) (5,2) (6,3) (7,3) (8,4); (2,1) right
→ (1,1) (2,1) (3,2) (4,2) (5,3) (6,3) (7,4) (8,4); (5,2) → (1,0) (2,1) (3,1) (4,2) (5,2) (6,2) (7,3) (8,3); (-2,-5) → (0,-1) (-1,-2) (-1,-3)
(-2,-4) (-2,-5) (-2,-6) (-3,-7) (-3,-8). Aiming at the origin: nothing. Mirrored and rotated Lines consistent; (4,2) = (2,1); a tie-free angle the
same both sides; a wall cuts it; a Large creature from two squares; the Charge path. (All but the wall, Large and Charge cases checked
against the prompt's function on 2026-10-31.) Then a manual checklist for Lucas.
