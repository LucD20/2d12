# Heights for Line of Effect and cover: brainstorm notes (with Lucas, after v0.0.165)

Status: BUILT in Foundry v0.0.166 (heightcover.mjs; Lucas: for everyone, assumptions correct). To ship together with the Leaning cover fix (foundry-backlog "Next pass (v0.0.166)").
Reference: the Draw Steel app (Codex) shows "Target is 2 higher" and "No line of effect: blocked by the terrain".

## Design (Lucas's version; replaces my Regions idea, which was too complex)
- A **"Cover height calculation" button** (next to the Line of Effect one): select your token, target another, click it. A **side-view window** shows the two creatures at their horizontal distance apart, with their heights (the token on a platform "3 sq up", like the image Lucas sent: left = the map, right = the side view).
- **Blocks:** click a cell of the vertical grid: one click = a **half square** (yellow), two clicks = a **full square** (red), a third clears it.
- **Lines:** from the center of your space (the rule: "a line from the center of your square") to the **four corners of the target's space**; green clear, red blocked; the cover name and "N blocked" as in the Line of Effect button. Reuses cover.mjs (segmentHitsRect).
- **Origin:** click a corner of your own space to start the lines there (like Leaning) WITHOUT the Leaning status and without moving the token: it is a visual help.
- Fully **manual**: boons and banes are applied by hand (these cases are rare). Mostly for the GM.
- No Regions, no wall heights, no change to what players see, nothing stored in the scene.

## Assumptions to confirm
- A creature is 1 square tall per square of width (Movement rule); lines start at the middle of its space.
- Starting heights come from the token elevations (v0.0.162), adjustable in the window.
- Horizontal distance: the book's count (every second diagonal counts 2). Blocks: whole-square columns; half or full squares tall.
- The window starts empty per pair; blocks are kept only while it is open.

## Open
- GM only, or players too? (Lucas said "mostly for the GM"; proposal: everyone sees the button, it only draws.)
