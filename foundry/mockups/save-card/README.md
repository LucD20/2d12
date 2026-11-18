# The Save card redesign (playtest 5, C10): the mockup

Lucas (playtest 5): "it likely needs a redesign to fit the new system's design": quiet Tier rows, only the rolled one colored, the Tiers merged
as the card writes them ("Tier 1 or 2"), the card's Effect line shown.

`index.html` (`save-card.mjs`) draws, with the system's own renderers and CSS (the gallery's stubs; open it through a local server from
`foundry/`: `?theme=dark|light`), the current Save card next to the proposal, for three cases: Rebuke before its Save, Rebuke after a Tier 2,
Reckoning on three creatures with two rolled. Shots: `save-card-dark.jpg`, `save-card-light.jpg`.

**The proposal uses only the attack card's parts (no new look):**
- **Before the roll:** the Tiers as the card writes them, quiet and inline ("Tier 1 or 2: Its Move Action is disrupted."), with the book's
  merging (an empty Tier 3 is not written), then the Effect line and the Roll button.
- **After one creature rolled:** the attack card's stamp ("TIER 2, vs DC 13") and ladder (≤12 / 13–19 / 20+, the total's marker, the rolled
  range filled), and only the rolled Tier's words.
- **Several creatures:** a row each (its Tier pill and total, or its Roll button), then the Tiers rolled as the attack card's groups (the Tier, the
  names, its words); while one still has to roll, the quiet lines stay under them.

**Status:** waiting for Lucas (mockups first). Built in Foundry: `chatcards.mjs saveCardHtml` would take `proposedSave`'s shape.
