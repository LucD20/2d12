# The card gallery (pack CARD-ONE)

Every Action and Feature card of the compendium, drawn by the system's own modules in each face and surface where Foundry shows a card, next to
the book's card, in dark and light. Its screenshots are the reference: a change to a card's code or CSS that shows anywhere is caught here,
named card by card, before anyone opens Foundry.

- `gallery.html` + `gallery.mjs`: the page. It runs the real modules in the browser (`module/actioncard.mjs` from the card model,
  `module/cardmodel.mjs`; the real inline buttons) on `data.json` and wraps each card in the surface's real markup: the sheet's open row, a chat
  message, the hover tooltip, the HUD's card. `?theme=dark|light&wrap=sheet|chat|tooltip|hud|dialog&face=full|solo|roll|result&from=0&to=16` (`solo` in `chat` is "Send to chat" and a chat card's Card button, `preview.mjs sendItemToChat` / `ccdamage.mjs`, both `buildSoloCard`; step 3: `roll` the roll dialog's card, `result` the chat card of a Tier 2 result, a Save card before its roll, or a no-roll card). Each card is padded to a multiple of 16 px (the JPEG blocks) and animations are off, so only the card that changed is named.
- `data.json`: written by `node twod12/tools/gallery/data.mjs` (not committed).
- `shots/`: the reference screenshots (JPEG) and each one's card boxes (JSON).
- The book's side: `book/card-gallery.html` and `book/cards/structure.json`, written by `python3 build_rules.py`.

**Run it** (from `foundry/twod12`): `node tools/gallery/shoot.mjs` compares and names the cards that changed (the new shots go to
`shots/new/`); `node tools/gallery/shoot.mjs --update` saves the new shots as the reference after a change that is meant to show. Needs
Playwright and its Chromium (this cloud environment has both).

**The rule** (CLAUDE.md): a card change goes into the card model or a face, then the gallery is run; never restyle one surface's markup alone.
Test t260 checks that every face that shows the whole card has every line of the model, and the model against the book's.
