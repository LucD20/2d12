# The HUD remake: the draft (2026-11-17)

**Lucas (2026-11-17), after v0.0.389:** "I want to also remake the HUD. I will send one that i made in another module as a picture, and how it looks better, it doesnt clutter as much etc. Lets draft and project first, not make it right away, with new style and funcionalities. Review and read about the rules and what could be important in it." With it: "When triggering a reaction, it should make a small noise, maybe a subtle alert, something to get the attention, or a more visible overlay on the map, a scrolling text... because i feel it can pass unnoticed."

**His pictures** (a 4e module of his): with nothing selected, a strip of small PC cards along the bottom (portrait, name, class and level, AC / Fort / Ref / Will, Surges, AP, Speed, an HP bar); with a token selected, one bar: the portrait, HP, Surges with Second Wind, AP with Spend, Speed and Init, the defenses; tabs by action type with a count (Standard 6, Move 0, Minor 1, Free 1, Triggered 1); under them columns by frequency with colored headers (At-Will green, Encounter red, Daily grey, Basic tan), each power a button with "+6 vs AC"; at the right "Actions are tracked in combat." and the hotbar.

**Today's HUD** (v0.0.376 to v0.0.385, `module/hud.mjs`, `hudmodel.mjs`; the decisions: `npc-hud-brief.md`): one bar for the selected token; a PC's categories beside the name open panels, pinned Actions fill the Quick slots; an NPC's Actions on two lines; several tokens: a list of buttons; nothing: the player's character, or the GM's empty bar.

**What the rules put on the table each turn** (rules-src, chapters 1, 2, 4, 5): 4 AP and 1 Reaction AP a turn, kept AP becoming Guard at the next turn; Escalation 1 to 6 (Passives at 2, 4, 6; the Apex at 6); one Health Pool with two thresholds, Vigor and Resolve (Bloodied, Strained; Down states); Guard; Rally Points (Steel Yourself); AD and WD, a Save or Check as 12 + an Attribute (Body, Mind, Appeal, Instinct); Speed; Frequencies At-will (Banes on repeats), Turn, Round (turn-cycle), Encounter, Daily; Reactions with a Trigger or an Interrupt, paid with the Reaction AP or kept AP.

**The draft:** `foundry/mockups/hud2/index.html`, the artifact "Foundry HUD Remake": (1) the party strip, (2) a PC's bar with tabs by kind (Actions, Reactions, Basic, Escalation, a count each: usable now) and columns by Frequency, (3) a Reaction waiting, with the four signals, (4) an NPC's bar. **Nine decisions** at its end, Claude's pick first, to answer by exception:
1. The party strip when nothing is selected: for everyone (the PCs' cards) / GM only / off.
2. Grouping: tabs by kind and columns by Frequency / today's flat row with categories.
3. Health: two thin bars, Vigor over Resolve / one Health Pool bar with the thresholds marked.
4. The roll on each tile: the Modifier and the Defense ("Weapon +1 vs AD") / only the cost.
5. The Basic tab: all Basic Actions, the rare ones behind "+N more" / only the common five.
6. The pinned Actions (the Quick slots): gone / kept as a "Pinned" tab.
7. The hotbar in the HUD's right end: kept / Foundry's own place.
8. The Reaction alert: a chime (made by the browser, no sound file), a ring and floating text on the map, the HUD's tab pulsing and opening, each a setting, all on / fewer.
9. The side panel: the hovered tile's line, a waiting Reaction, the NPC's notes / none.

Kept from today: a click on a Version opens the roll dialog ("Skip roll dialog"), right-click the Action card, the pick bar's questions in the middle. Nothing built.

**Lucas's answer (2026-11-17): "Take a look again, compare to the current styles, compare with the research, foundry and style ones. See if there should be change or improvements. Then look through the rules, see if anything else is worth adding or remove, add it as a draft, and finally send the final result."**

**Draft 2 (2026-11-17), the same page:**
- **Against the style (STYLE-3):** the Actions were boxes with colored side stripes under filled colored bands (the "boxes inside boxes" and side stripes Lucas called an AI feel on 2026-11-12): now ruled lines (the name, the outlined cost stamps at the right, the roll under it); a column's head is the Frequency's word with its small square on a bronze rule (STYLE-3's way).
- **Against the HUD decisions of 2026-11-12:** "no Health, AP, Guard or uses" is reversed only if Lucas says so (decision 1; his module shows them); the height was 70 px: now 150 with a fold to a 40 px line; "no hover cards": the side panel shows nothing on hover; the lost categories are back (hands and conditions in the side panel, Checks and Saves as the Attributes row, Rest and Breather in the Basic tab out of combat).
- **Against the research:** sizes in rem (Foundry's font size slider); every state has a word; 3:1 edges on empty pips; resources adjustable by right-click (Daggerheart Sleek; decision 10).
- **Against Foundry:** the HUD follows the Interface color scheme; the hotbar one row of ten under the side panel; the players list above the left end; the Token HUD stays Foundry's.
- **From the rules, added:** Strikes 1/3 (Ch. 7); "next: +1 Bane" on a used At-will Action (Ch. 2); kept AP as Guard ("1 kept: Guard 2 at your turn") and Guard's AP part; Slowed as a struck AP square, Exhausted and other changes as a dotted-underlined number with its reason; the Nonlethal part of a bar hatched; Bloodied, Strained and the Down states as tags; a second Reaction AP; hands (Regrip, Release, Draw; Unloaded); conditions with values and rounds; Momentum at the strip's left; the Escalation tab's rungs ("working", "at 4"). **Removed:** Initiative.
- **Ten decisions** now (the first draft's nine, reworded, with "Health, AP, Guard and uses" first and "Height" added).

**Lucas's answer:**
