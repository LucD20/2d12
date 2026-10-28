> APPLIED to the book in Round 7 (Senses, Hearing; Charge; Playing on the Grid). This file is kept for the history and for the Foundry plan below.

# Draft: Hearing (range, combat) and Charge (NOT in the book or in Foundry)

## What the book and the module say today
- **Book, Senses:** "Every creature has Sight and Hearing." Sight: Bright is Clear, Dim is Obscured, and you can't see creatures in Darkness or with no Line of Effect (one open corner is enough). Hearing: "You perceive creatures that make noise as Hidden. Creatures in combat make noise, even standing in the same square on their turn. A creature can Hide to stop making noise." No range.
- **Foundry, the rolls (`perceive`):** matches the book for Sight (High cover with one open corner is Clear if lit). Hearing, though, counts every creature that isn't Hiding, in combat or not and at any distance.
- **Foundry, the canvas (the Hearing detection mode, a ripple like PF2e's):** it ignores walls and has no range, but it only detects a token when the GM has put the Hidden status on it. So a creature that is only in combat is not shown at all.
- **What your screenshots show:** Foundry's own vision hides a token whose only exposed spot is a corner (High cover), although by the rules it is seen. The player can't see it or target it on the canvas.

## Hearing: proposal
**Book wording**
> **Hearing:** You perceive creatures that make noise within **10 squares** as Hidden, even through walls. Creatures in combat make noise, even standing in the same square on their turn. A creature can Hide to stop making noise.

(The 10 is a suggestion. Hide stays "rules to be written".)

**Foundry (later)**
1. The detection mode also detects a token that is a combatant of the active combat and is within the range, even through walls, unless it is Hiding or Unsensed. The GM's Hidden status keeps working for anything else. Out of combat nothing new is revealed, and nothing farther than the range.
2. `perceive` follows the same rule: heard only if in combat and within the range (or the GM's Hidden status), and not Hiding.
3. First fix `tokenDistance` (it counts every diagonal as 1; the range needs the 1-2-1-2 count).
4. The roll still uses the rules' result: a High cover target that is lit is Clear, even if the canvas shows it as a ripple.
5. Cost: a creature that fights but was never added to the combat tracker is not heard (the GM can put Hidden on it).

## Charge: proposal
Now: "Advance at least 3 squares and up to your Speed in a straight line. You can't Charge through Difficult Terrain. At the end of your movement, make a Weapon Attack (1A) with 1 boon against a creature of your choice."

> Advance at least 3 squares and up to your Speed in a straight line. You can't Charge through or past a creature, or through Difficult Terrain, even if you have movement left: the Charge ends in the last square where the line is legal. At the end of your movement, make a Weapon Attack (1A) with 1 boon against a creature of your choice.

And the "Straight lines" bullet of Playing on the Grid: "...(for Charge, it can't cross Difficult Terrain or a creature's space, and it ends in the last legal square)".

The diagram is redrawn in `diagrams/diagrams-draft.html`: a line and the last legal square, no shaded squares.

## Decisions (your answers)
1. **Hearing range:** 10 squares, the same for every creature at first, with an option to change it (a setting per creature, later).
2. **Who makes noise:** only creatures in combat that are not Hiding.
3. **Charge:** only creatures stop it, and the Charge ends in the last **empty** legal square. (My reading: an unwilling creature's space is already Difficult Terrain in the book, so the rule "can't Charge through Difficult Terrain" already covers it; allies can be passed but not ended in. Please confirm.)

## Wording for your approval (not in the book yet)

**Senses, Hearing**
> **Hearing:** You perceive creatures that make noise within **10 squares** as Hidden, even through walls. Creatures in combat make noise, even standing in the same square on their turn. A creature can **Hide** to stop making noise.

**Charge (the card)**
> Advance at least 3 squares and up to your Speed in a straight line. You can't Charge through Difficult Terrain (an unwilling creature's space is Difficult Terrain), even if you have movement left: the Charge ends in the last **empty** square where the line is legal. At the end of your movement, make a Weapon Attack (1A) with 1 boon against a creature of your choice.

**Playing on the Grid, Straight lines (one sentence added)**
> ...A Charge that can't go all the way ends in the last empty square where the line is legal.

## Foundry (later)
- **Hearing:** the detection mode also detects a combatant of the active combat within the range (default 10 squares, a setting per creature) through walls, unless it is Hiding; `perceive` follows the same rule; the GM's Hidden status keeps working. `tokenDistance` is fixed first. This also makes a High cover target visible on the canvas.
- **Charge:** Foundry already stops the token in the last legal square (your screenshots). To check: that it is the last **empty** square, and that an ally on the line does not stop it.
