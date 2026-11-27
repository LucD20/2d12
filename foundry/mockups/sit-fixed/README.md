# The Situational tab: buttons that stay put (a mockup)

Lucas, after playtest 8: "When using the area, if I move it around, the 'Cancel' button on the hud also moves around [...] I try to hover over
Cancel and it moves since it is also moving on the map. Lets make all buttons of the situational tab be fixed. Lets do a mockup of each and make
sure it is always fixed."

**Built in v0.0.529 (rule A; Lucas, 2026-11-27: "use mockup A"; rule B not built):** `foundry/twod12/module/sitframe.mjs`, the modules below and the v0.0.529 block of `system.css`; the open questions at the end were chosen by Claude (the changelog lists each). The page itself is still the static mockup. `index.html` is the page (static; built by `node build.mjs` from `sit-fixed.css`); `check.mjs` renders it,
saves `sit-fixed-dark.png` / `sit-fixed-light.png` and measures every button (run it from `foundry/twod12`:
`node ../mockups/sit-fixed/check.mjs`).

## Why it moves today

A question in the tab is a `.twod12-linebar.in-hud` appended to `.hb-ask`; its CSS (`system.css`, `.h3-sit .twod12-linebar.in-hud`, lines
5169-5170 and 5553-5624) is a wrapping flex row: `.lb-text` takes the first line(s), the buttons flow after it. So a button moves when the
sentence wraps differently (the area's is rewritten on every mouse move, `template.mjs` showBar), when a control in front of it is shown or
hidden (the Line's Ties pair is `hidden` with no tie and sits before Cancel; Undo move; the Charge's pictures and Charge button), when a
second entry is drawn above it (`.hb-ask` comes after the Reactions in `.h3-sit-urg`), or when the tab's scrollbar appears.

## The rule (A, recommended)

1. **Every entry is a frame with fixed parts, in one order:** a title line (one line, cut with an ellipsis), a text box of a fixed number of
   lines, then one row of buttons that never wraps.
2. **In the row of buttons the main one starts at the left; the way out (Cancel, Pass, End movement, Give up, Don't move it, Cancel the Action,
   Later) is always at the right end.**
3. **What changes has its own lines,** kept free while empty and cut with an ellipsis if it runs over: the area's count or "Too far", the squares
   left, the Forced Movement's result under the mouse.
4. **A button that can only sometimes be used keeps its place and is shown off** (`disabled`), never hidden. Two wordings of one button share
   one slot of one width.
5. **A question asked on the map takes the tab's whole height and is the first thing in the tab.** Its bands, top to bottom: title 17 px, text,
   status, options (pictures 27 px, or one row of word buttons), the keys' line 15 px, the buttons 22 px. The buttons are the last row, so they
   are the HUD's bottom edge, and the way out is the HUD's bottom right corner in every question. The text takes what is left and is cut, never
   grown.
6. **The stack:** anything else (a Reaction, Granted, Hiding, Prone) is under the question and cannot push it; the count on the tab shows it and
   the wheel reaches it. The tab keeps its scrollbar's place (`scrollbar-gutter: stable`), so a bar that appears moves nothing.

**B (the other way, drawn for the Line and the Charge):** the buttons in a column of a fixed width at the right, one slot a line, the way out in
the last slot; the text has the left column and can be any length. It needs no reserved heights and has room to spare for the Charge, but the
sentence becomes a narrow column beside a mostly empty one, and stacked buttons look like nothing else in the HUD. Recommended: A.

## Each entry, and what changes for it

| Entry | Written by | What changes compared with today |
|---|---|---|
| Area: Emanation / Burst | `template.mjs` place(), showBar | The count / "Too far" get two lines of their own; the keys' line goes above Cancel; Cancel in the corner. |
| Area: Line | the same | The same, and **Ties Left / Right are shown off with no tie instead of hidden** (today `b.hidden = !tie`), at the left of the buttons' row. |
| Pick bar, words | `pickbar.mjs` pickBarHtml (some thirty callers: `actions.mjs`, `ccdamage.mjs`, `critical.mjs`, `template.mjs` 390, `rally.mjs`, `inline.mjs`, `moment.mjs`, `bounce.mjs`, `conditions.mjs`, `fxapplied.mjs`, `fxsheet.mjs`, `objects.mjs`, `move.mjs` 582) | The options have their own row above the last one; Done at the left of the last row, Cancel at its right; a bar with no Cancel keeps the row. |
| Pick bar, pictures | the same (`combat.mjs` 275 the squad, `inline.mjs` / `actions.mjs` Empowered, Judge's pick) | The pictures are 27 px (34 today), one row, from the left. |
| Pick bar, several creatures | `move.mjs` 1465 (a Push of an area; a new bar a creature) | **A creature already moved keeps its square, shown off** (today it leaves the row and the others slide left). Needs the caller to pass the moved ones as `off` options. |
| Forced Movement | `move.mjs` forcedBar (~936) | The title is "X is Pushed up to N squares", the text the rest; the result (`.lb-now`) has two lines of its own; **Take back a step is off until a step was clicked** (today always on); **the small reminder of the rule is left out in the HUD** (the Rules button opens it; with it the sentence is six lines and the buttons are out of sight today). |
| End movement (Evade / Advance) | `move.mjs` freeMoveBar (~655), called at 647 and 789 | "N squares left" has its own line; **Undo move is off before a move instead of hidden** (today `display: none`, and End movement shifts when it comes); Advance instead / Evade instead share one slot of 100 px. |
| A Setup's movement | `setup.mjs` setupBar (~44) | "N of M squares left" has its own line (it has, today, but inside the wrapping text). |
| Charge | `move.mjs` (~2345-2475) | **The enemies' pictures stay after a target is picked** (the one picked marked; today they are emptied and Ties / Charge take their place); Ties at the right end of the pictures' row (the code already keeps their place with `visibility`: shown off here); **Charge is off instead of hidden** with no target or too close; Charge / Charge anyway share one slot of 96 px; no line for the keys (no room). |
| Charge's Basic Attack (1A) | `hud.mjs` (~288), `hudview.mjs` sitItemHtml | Cancel at the right end. |
| A Reaction waiting | `hudview.mjs` rightHtml | Its sentence has two lines kept, cut after them; Pass at the right end. |
| Another creature's Reaction | `hudview.mjs` rightHtml (`.h3-rxjump`) | Nothing: already one line, Select at the right end. |
| Granted | `hudview.mjs` rightHtml (`.hb-gr`, `.hb-grh`, lineHtml) | The source's name cut with an ellipsis; **one line a source, each with its Cancel** (today one line "Granted by A, B" and then two Cancel buttons that do not say which). |
| Hiding | `hudview.mjs` hidingHtml | **The Add line goes above the list and is always two lines:** its sentence, then Unsensed / Hidden, **off while nothing new is targeted** (today the two buttons come and go under the list); the state's button is 78 px in both states. |
| Prone | `hud.mjs` (~262) | One row that does not wrap; Break Free is added at the end. |
| Break Free, Reload | `hud.mjs` (~266-281) | The title is cut with an ellipsis (several unloaded weapons). |

Not in the Situational tab, so not drawn: the same bars in the HUD's middle (`.hud-ask`, no creature selected), floating at the bottom of the
screen with no HUD, and the old floating Granted bar (`freeuse.mjs` 258, `.twod12-grantbar`). The frame would suit them, wider.
`linearea.mjs` has no bar of its own. Every `twod12-linebar` / `hudAskSlot` user in `foundry/twod12/module` is in the table.

## What the system would need

**Markup (each module that writes a bar):** split the one `.lb-text` into the frame's bands. Proposed classes (the mockup's `sf-*`):
`.lb-head` (the bold lead and its `.lb-tag`), `.lb-text` (the sentence), `.lb-stat` (what changes: today's `.lb-count`, `.lb-left`, `.lb-now`,
`.lb-warn`), `.lb-opts` (kept), `.lb-keys` (kept, moved before the buttons), `.lb-acts` (a new wrapper around the buttons: the left ones, a
flexible gap, then `.lb-give`). `pickBarHtml` can do it once for every pick (the lead is the text's first `<b>`).

- `template.mjs` showBar: write the count to `.lb-stat`; `disabled` on the two Ties buttons in the place of `b.hidden`.
- `move.mjs` freeMoveBar: `disabled` on `.lb-undo` in the place of `style.display`; the count to `.lb-stat`.
- `move.mjs` forcedBar: `.lb-back` disabled until a step; no `<small>` when in the HUD.
- `move.mjs` Charge: drawCands keeps the pictures (class `on` on the target's); `go.disabled` in the place of `go.hidden`; Ties `disabled` in
  the place of `visibility: hidden`.
- `hudview.mjs`: `.hb-ask` becomes the first child of `.h3-sit` (before `.h3-sit-urg`); a `.bs` gets its quiet button last with a gap before it;
  Granted grouped by effect; hidingHtml's Add block before the rows, its buttons always drawn.

**CSS (`system.css`, then `node tools/build-theme.mjs`):** the block "NEW: the fixed frame" of `sit-fixed.css`, under
`.twod12-hud .h3-sit .twod12-linebar.in-hud`. The lines that matter:

```css
.h3-sit { scrollbar-gutter: stable; container-type: size; }
.hb-ask > .twod12-linebar.in-hud { height: 100cqh; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 2px; }
.lb-head { flex: none; height: 17px; white-space: nowrap; overflow: hidden; }
.lb-text { flex: 0 1 auto; min-height: 0; overflow: hidden; -webkit-line-clamp: N; }
.lb-stat, .lb-opts, .lb-keys, .lb-acts { flex: none; height: (fixed); overflow: hidden; }
.lb-text + :is(.lb-opts, .lb-keys, .lb-acts), .lb-stat + :is(.lb-opts, .lb-keys, .lb-acts) { margin-top: auto; }
.lb-acts { display: flex; flex-wrap: nowrap; } .lb-acts .lb-give { margin-left: auto; }
```

The wrapping rules it replaces: `flex-wrap: wrap !important` (5571), `.lb-text { flex: 1 1 100% }` (5170, 5572), `.lb-opts { flex-wrap: wrap }`
(5603), `.h3-si .bs { flex-wrap: wrap }` (5166). Tests: t264 (hover texts) is not touched; a test could assert that no bar's HTML uses
`hidden` / `display: none` on a button.

## The check (`check.mjs`, Chromium, Source Sans 3 loaded)

For every kind, every button's x, y, width and height (relative to the HUD slice) is compared across its states; a row that overflows, a label
that is cut or a question that is not exactly the tab's height fails. Today's layout is measured too and is expected to move (Cancel: x 10 to
170.72, y 58.81 to 75). Result: all 22 groups (20 of A, 2 of B) the same in every state; the way out's right and bottom edge is the same (300, 146.67) in all 33
question pictures of A and all 7 of B.

## Unsure

- **The widths below 312 px.** The right column is 260 / 220 / 200 px in a narrower window (`@container`, system.css 5183-5185). The rows of
  three buttons (Advance instead + Undo move + End movement is 284 px; Rules + Take back a step + Don't move it; Prone with Break Free) do not
  fit there. The frame would then keep a second row of buttons, always (still fixed); not drawn.
- **The Charge fills the tab to the pixel** (118 px: 17 + 45 + 27 + 22 and the gaps). A fourth line of text (the list of enemies that are too
  close or too far, when long) is cut; it is on the map too. The keys' line is left out.
- **Two questions at once** (a Setup's movement and a pick bar can both wait): the second is under the first; when the first closes the second
  comes up into the same place, its way out in the same corner. A double click on Cancel could then cancel both; a short pause before the new
  one takes clicks would prevent it. Not drawn.
- **The list under a question keeps Lucas's order** (urgent first; "prone should be low priority", v0.0.463), so a Reaction that arrives still
  pushes Granted, Hiding and Prone down. Only a list in the order of arrival would stop that.
- **A word option that is long** (the versions: "2 AP: 2 Burst within 10") can need two rows of options; the band is sized when the bar opens
  and the options never change while it is up, so nothing moves, but the text then has fewer lines.
- The pictures are letters here (no art in a mockup). The pulse of an urgent entry is drawn as its two halves, not animated.
- The words are the system's, taken from the code; the examples' creatures and numbers are made up.
