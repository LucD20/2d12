# Playtest 5 (Stage 0, level 1; Lucas, 2026-11-17)

Lucas's playtest of the Stage 0 build (Foundry v0.0.407 to v0.0.417), stopped in round 2 because the Rally Points couldn't be used.
**Nothing here is applied yet** (Lucas: "Don't apply or do anything yet, first organize it, then review it ... step by step"). The review goes
part by part: first the log (section 1), then each group of section 2. The screenshots he named came in a later message: `playtest-5/roll-dialog.png` (B1), `chat-crit.png` (C8), `chat-card.png`
(C7), `chat-save.png` (C10).

## 1. The log (as Lucas wrote it)

**The fight:** Aveline (Human Paladin, Smite), Durgan (Dwarf Paladin, Lay On Hands), Kaela (Human Archer, Strafe), Sylwen (Elf Archer, Quick
Shots), all level 1, against the Ogre Chieftain (Elite, CV 200), the Orc Warrior (Standard, 100), the Grave Wisp (Standard, 100) and three Goblin
Sneaks (Minions, 25 each): **CV 475, about 119 per PC** (100 is normal, 125 hard: between the two, nearer hard).

Abbreviations: OC Ogre Chieftain, OW Orc Warrior, GW Grave Wisp, GS1-3 Goblin Sneaks; BS Brutal Swing, WA Weapon Attack, OS Overhead Smash, DW
Dread Whisper, CT Chilling Touch, QS Quick Shots, SA Slip Away, SS Snap Shot, DT Dirty Trick, SoF Shield of Faith, BL Binding Light, RK Rusty
Knife, BF Break Free, SY Steel Yourself.

**Round 1**
- OW: Durgan Judge 0A vs OC; Aveline Judge 0A vs OC; Advance 2; BS vs Aveline T2; Cleaver vs Aveline T1.
- Kaela: Strafe vs OW T2, OC T2, GW T2; WA vs OW T2; WA vs OW T1.
- OC: Advance 4; OS vs Aveline T1; Club vs Durgan T2.
- Durgan: WA vs OC T2; Shove 2A vs OC T1; WA vs OC T1.
- GW: Advance 4; DW vs Durgan T2; CT vs Durgan T2.
- Sylwen: Advance 4; QS vs OC T2; WA vs OC T3.
- GS3: Advance 6; Kaela SA vs GS3; Sylwen SS vs GS3 T2; Advance 1; DT vs Sylwen T3; Durgan SoF vs Sylwen.
- Aveline: Stand; Commandment vs Sylwen; BL vs OC T3.
- GS1: Advance 5; RK vs Durgan T2; DT vs Durgan T2.
- GS2: Advance 6; DT vs Aveline T1; RK vs Aveline T2.

**Round 2**
- OW: Advance 3; Aveline Rebuke vs OW (Appeal Save); Advance 4; BS vs Sylwen T2.
- Kaela: WA vs GS3 T2; Advance 2; Strafe vs OW T2; WA vs OW T1. GS3 goes Down.
- OC: BF; Advance 2; Ground Slam vs Aveline, Durgan, Sylwen, GW, GS2, GS1, GS3 (Body Save). GS2 goes Down.
- Durgan: SY 3A. (The playtest stops: the Rally Points couldn't be used.)

**Damage dealt (total / per round), from the Encounter Log:** Ogre Chieftain 71 / 35.5; Kaela 29 / 14.5; Aveline 20 / 10; Sylwen 17 / 8.5; Orc
Warrior 10 / 5; Grave Wisp 9 / 4.5; Goblin Sneak 8 / 4; Durgan 5 / 2.5; Goblin Sneak 3 / 1.5.

## 1b. The log's review: Lucas's answers (2026-11-17)
1. **Ground Slam hits the Ogre's own allies:** yes, it should (the card stays). Foundry: the Encounter Log's damage table splits damage to
   enemies from damage to allies (the Ogre's 71 was mostly its own Goblins and the Wisp).
2. **The Orc moved 4 while Hindered (Rebuke):** the Hindered wasn't applied, so Lucas didn't track it: Foundry, with G3 (a Reaction's
   condition not applied). Added as **G8**: Rebuke's Hindered (EoT) didn't apply.
3. **Two Paladins Judge the same creature:** they stack: "technically different effects, since each applies to a single creature using it; the
   same name but different" (Judged by Aveline and Judged by Durgan). The book says it (Stacking today: "the same effect never stacks with
   itself"); **the reduction becomes the Paladin's choice** (Lucas: "Judge should then allow the Paladins to decide if the attack is reduced or not, that way, they get more autonomy"): once each round, when the Judged creature damages an ally within 5 squares of you, you can reduce that damage by your Power Modifier; two Paladins each decide (both can).
4. **Minions sharing a slot:** each Minion still has its own 3 AP (Claude didn't mean otherwise: the point was the turn order, 6 enemy slots
   against 4 instead of 4 against 4); Foundry gave no choice; the shared slot is optional (Lucas forgot it): Foundry could offer it in the Initiative window, off by default (low priority).
5. **Kaela's "Advance 2":** Strafe's Setup. Foundry: the Encounter Log writes a Setup's movement as part of its Action ("Strafe (Setup: Advance
   2)"), and numbers creatures of the same name (GS1, GS2...); an area skips a creature that is out of the fight.

## 1c. Group A's review: Lucas's answers (2026-11-17)
- **Judge's wording** approved: "Once each round, when it damages an ally within 5 squares of you, you can reduce that damage by your Power Modifier."
- **A1** a general Structure rule: a Special that says how the roll is made goes above the Attack line (Darting Blade first; every card checked).
- **A2** "2x At-will use" (the roll dialog's label).
- **A3** every NPC card with a "Tier 2 or 3" line: the rider goes into Tiers 2 and 3, written "Pushed N" (Overhead Smash, Club, Cleaver, Dirty Trick...).
- **A4** NPC melee attacks: **"Distance: Reach (X)"**, X the creature's Reach (Lucas: "Reach" alone sends you to the sheet); a ranged one its squares.
- **A5** **Mithril and Diamond retired:** the cards show Claude's Bronze / Silver / Gold rating (foundry/automation-ratings.md) in their place (Lucas: "Mithril means I have done my own automation, checking step by step, and all actions changed, so none are Mithril anymore. Diamond is only after they are Mithril"); the CLAUDE.md rule goes; with-lucas.txt stays as history.

## 1d. Group B's review (Claude, 2026-11-17; questions asked)
- **B1** fixed in v0.0.417 (the dialog draws Judged, Special and Effect from the card model). New: the dialog writes "Attack: Weapon +2 vs.
  DC 13" for a Version with no roll (Judge): the roll line only where the card has one.
- **B2** fixed in v0.0.417 (the card's own label: Effect, Tier 2 or 3, Tier 1 or 2).
- **B3** not intended: a dark-mode rule paints every subtype gold in the roll dialog, over v0.0.369's tones. Proposed: one color per subtype
  everywhere with a dark variant (with E6), in CARD-ONE step 5.
- **B4** confirmed: the calculated chips' blue (#1a3fb0, v0.0.354) has no dark variant. Proposed: the Boon light blue (#8db8f0) in dark mode.
- **Lucas (2026-11-17): B3 yes, B4 yes.** B3 goes into CARD-ONE step 5 (one color per subtype everywhere, a dark variant; E6 with it).

## 1e. Group C re-read with the screenshots (Claude, 2026-11-17)
- **B1** (roll-dialog.png, before v0.0.417): Judge showed only "Attack: Modifier + 0 vs. DC 13" and "Effects": v0.0.417 adds Judged, Special and
  Effect; the Attack line on a no-roll Version is the bug already logged.
- **C7** (chat-card.png, the Club): the stamp "TIER 2 vs AD 14" keeps its own height while the Damage block grows beside it: stretch it to the
  row's full height. Also seen: "It can Push the target 1." (A3), Bl in gold (B3).
- **C8** (chat-crit.png): 21 vs AD 14 with doubles: the stamp says CRIT, the ladder's CRIT zone is lit, but the arrow stays at 21 at the start
  of the Tier 3 segment (no "↑" over CRIT): as diagnosed.
- **C10** (chat-save.png, Rebuke): every Tier row in a full color band; Tiers 1 and 2 the same text twice ("Its Move Action is disrupted.").
  **And a gap the screenshot shows:** the Save card doesn't show the card's Effect, "The target is Hindered (EoT)", the part that happens
  whatever the Save (v0.0.417 draws it neither: the Save card skips the lines after the Tiers; test t261 skipped them for the chat too). Very
  likely tied to G8 (Rebuke's Hindered not applied).

## 1f. Group C decided (Lucas, 2026-11-17)
- **C1** the chat follows a card that grows (only when you were at the bottom). **C2** the Steadiness line in the card that caused it, the
  system's line style (the Push remembers its card). **C3-C6** removed: Bloodied / Strained, the Reactions' "uses ... →" and "next damage
  reduced" lines, **"is Down" for every creature (PCs too: yes)**, the movement lines (End movement goes to the movement bar / the HUD).
- **C7** the stamp stretches to its row. **C8** a Critical from doubles: the "↑" over CRIT. **C9 yes:** the CRIT zone only on an actual
  Critical. **C11** Bloodied in the Vigor red (#d0564f) on the dark card.
- **C10 yes, but "it likely needs a redesign to fit the new system's design":** the Save card redesigned (a mockup first): quiet Tier rows, only
  the rolled one colored, the Tiers merged as the card writes them ("Tier 1 or 2"), the card's Effect line shown (the Hindered of Rebuke).
- **C12 yes:** a click anywhere on an action button uses it; a right-click opens its rule or item (a button that names an item keeps opening it
  on its name). Fixes the Rally Points (the playtest's stop) and G5.

## 1g. Group D decided (Lucas, 2026-11-17)
- **One HUD mockup first** (D1 the Basic tab, D3 the layout, D4 conditions as icons under AP / Esc, D7): the macro bar at the bottom, the Hands
  above it, the **Situational section** holding every "act now" control: Linked Actions, Forced Movements, Stand and Crawl while Prone, a
  Setup's movement (no more floating bar), End movement, Judge's "reduce this damage?" **and the triggers** (Lucas's idea: a Reaction you can
  use shows there the moment it triggers, so the player sees it at once).
- **D2 yes:** both Modifiers ("Weapon +2 · Power +1"), no Vigor / Resolve words, a readable weight; "this small area needs some rebuild for
  formatting; it is mostly good so it's small" (in the mockup).
- **Bugs:** D5 the HUD keeps its height while it redraws; D6 the HUD hides Techniques not unlocked (as the sheet does); D8 icons centered.

## 1h. Group E reviewed (Claude, 2026-11-17; two questions asked)
- **E1, E3** to the sheet mockups (the sizes decided). **E2** the sheet card has no head bar: the short card gets "Frequency · cost"; until
  then the row's pill writes the Frequency word ("Turn · 1R") (asked). **E4** the item sheet's trait chips become the card's plain words.
  **E5** a sheet's own light theme loses to Foundry's dark scheme: a bug to trace with a render. **E6** with B3. **E7** Rally Points a number
  on the sheet (who edits it: asked). **E8** the NPC sheet's Level input (actor-sheet-pc.hbs line 382) reads `{{level}}`, empty in its context:
  the image picker submits the form and the empty Level fails ("must be a number"); read the real level, an empty Level is "unchanged".

## 1i. Group E decided, and the tooltips (Lucas, 2026-11-17)
- **E2 yes:** until the sheet redesign, the row's pill writes the Frequency word ("Turn · 1R").
- **E7:** the player edits the Rally Points too (not only the GM), **with a chat message** (a sysLine: "Durgan sets his Rally Points to 2").
- **New (Lucas): "tooltips are too much. Only ones that are necessary so far are the ones in the HP bars. Remove all for now."** Every
  tooltip of the system goes for now except the HP bars'. Open: whether the hover cards count (asked).

## 1j. Group F, and the tooltips' stage (Lucas, 2026-11-17)
- **Tooltips:** when the work reaches the tooltip stage, Claude writes every tooltip down, categorized, and Lucas reviews the list (nothing
  removed before that).
- **F1** (Claude decides): a full AP pip a solid square in the AP color (center and border the same), an empty one the outline only with a dark
  center; checked in a render. **F2** Bloodied and Strained off the strip.

## 1k. Groups G and H reviewed (Claude, 2026-11-17; two questions asked)
- **G1-G3, one cause:** a Tier's condition is a button in the Tier's text (Brutal Swing `@Condition[prone]`, Dread Whisper `@Condition[dazed|
  value:1]`, Snap Shot `@Condition[hindered|eot]`): only an "after the damage" chain applies by itself (Binding Light). Proposed: a Tier's
  condition applies when its Tier lands, every card; and a condition / effect chip dragged from the chat onto a token (asked).
- **G8** Rebuke's Hindered is in its "after" chain and still didn't apply: to trace (the Save card's path; its missing Effect line, C10).
- **G4** as written (Judge asks for a target; with none, an "Apply Effect" button). **G5** = C12. **G6** a Reaction's movement off its turn
  (Evade 1 + Advance 2): to trace.
- **G7, a rule:** the book says creatures in a Line give no Cover to each other; other areas only "Cover from the Point of Origin". Proposed:
  creatures inside an area never give Cover against it (walls and objects do), for every area (asked).
- **H1** as written: Steadiness applies without asking; asked only for a Forced Movement on an ally.
- **Lucas: G1-G3 yes, G7 yes.**

## 2. The notes, organized (IDs for the review; Lucas's words kept)

### A. Cards (what a card says)
- **A1** Darting Blade: its Special (the Light weapon) should be above the Attack line: people read the whole card before learning the Strike is
  made with the Light weapon.
- **A2** "At-will use 2" is confusing: write "2x At-will use".
- **A3** Ogre Chieftain's Overhead Smash: drop the "Tier 2 or 3" line, add "; Push 2" to Tiers 2 and 3. The same for its Club.
- **A4** NPCs: the Orc Warrior's Actions say "Distance: Weapon". NPCs don't use weapons.
- **A5** Lots of Actions still show Mithril / Diamond: none are Mithril or Diamond any more.

### B. The roll dialog
- **B1** Judge: it doesn't show what the Action does, nor its Special (Roll dialog.png).
- **B2** It still shows "Effects (T2+)": changed already?
- **B3** The subtypes (Pi, Bl...) are gold: intended?
- **B4** The calculated AP in the item sheet's roll is hard to read in dark mode (the blue numbers too dark).

### C. The chat
- **C1** After clicking Damage the card grows and the chat doesn't follow: scroll by the height it grew, so it stays in place.
- **C2** "Durgan was not Pushed (Steadiness 1)." is nicely subtle but not the system's style: the chat card style, one line, attached to the
  message that caused it (the Club).
- **C3** Remove "Goblin is Bloodied. (No effect by itself: a hook for cards.)", and the same for Strained.
- **C4** Remove "Reactions: Durgan uses Shield of Faith → Sylwen", and "The next damage Sylwen takes is reduced by 3 (1+2 = 3)."
- **C5** Remove the "Goblin is Down." messages.
- **C6** Remove "Kaela: Advance 2 sq. 4 sq left End movement" and "Kaela ends the movement. 4 free squares unused."
- **C7** The "Tier X vs Defense Y" box doesn't grow with the card when damage is rolled (Chat Card.png).
- **C8** A Crit after a Tier 3 with doubles: the arrow stays on Tier 3, not on Crit (Chat crit.png).
- **C9** A 26 vs AD 14 (no doubles) put the arrow on the Crit section, though the Action has no Critical.
- **C10** The Save card's Tiers are still very colored (Chat save.png).
- **C11** Bloodied on the dark chat card is too bright (the red almost pink).
- **C12** Clicking Heal in the chat opens the Rally Points book entry (it should heal).

### D. The token HUD
- **D1** The Basic tab needs refitting.
- **D2** Remove the Vigor and Resolve words; Guard, Rally, AP, Esc, the Defenses and the Attributes in a type too thin to read; it shows only
  the Weapon Modifier: show the Power Modifier too.
- **D3** Idea: the macro bar stays at the bottom of the HUD, the Hands above it; the empty space (Hands and conditions today) becomes the
  "Situational" section (Linked Actions, Forced Movements...), which also gets Stand and Crawl while Prone.
- **D4** A condition shows under the Hands and makes the whole HUD grow: show it as a condition icon in the free space under AP / Esc.
- **D5** Accepting a Reaction makes the HUD jump.
- **D6** Seizing Cut shows in the HUD though Durgan doesn't have the Mastery.
- **D7** Strafe still opens the old floating bar for its Advance, not the HUD's place (where the Linked Actions are).
- **D8** The buttons' icons are a little off-center.

### E. The sheets
- **E1** Both sheets and the one-page NPC sheet need a redesign (with the sizes decided: PC and NPC sheets small, the one-page long).
- **E2** Previewing a Reaction on the sheet doesn't show its Frequency.
- **E3** Hands on the sheet: the right size but it doesn't fit: drop the word "Hands" and put one hand above the other.
- **E4** The traits are still colored in the item sheet.
- **E5** The PC sheet in the light mode still shows dark in Foundry's dark mode.
- **E6** Blunt in the dark NPC sheet is too close to the background.
- **E7** Rally Points editable by hand.
- **E8** Bug: changing a sheet's image fails ("system.level: must be a number", NpcSheet._prepareSubmitData, from the FilePicker).

### F. The combat strip
- **F1** The AP pips: empty and full too alike; maybe the center the color of the border (Claude decides).
- **F2** Remove Bloodied (and Strained) from the strip.

### G. Automation that didn't happen
- **G1** Brutal Swing (Orc Warrior) didn't apply its condition, and it couldn't be dragged from the chat to the token: an effect or condition in
  the chat should drag onto a token.
- **G2** Dread Whisper didn't apply Dazed.
- **G3** Snap Shot didn't apply Hindered.
- **G4** Judge: using it should ask for a target; with none, the chat card shows an "Apply Effect" button.
- **G5** Slip Away: its Advance button opens the book's rule instead of giving the movement.
- **G6** Slip Away: an Evade 1 wasn't counted ("Kaela ends the movement. 1 free square unused." after moving 1).
- **G7** Ground Slam gives every creature Cover on its Body Save.
- **G8** (from the log) Rebuke's Hindered (EoT) didn't apply, so the Orc moved 4 more squares in round 2.

### H. Rules and settings
- **H1** Apply Steadiness without asking; ask only when the Forced Movement is on an ally.

## 3. The plan (Claude, 2026-11-17, after the review; version 1 built in v0.0.418, version 2 in v0.0.419)

**Lucas's standing rule, repeated for this work (2026-11-17): "all effects need to be able to be recreated in Foundry, for homebrew purposes, no
hard coding unless it's conditions and rules."** Every item below is either a general rule of the system or a setting / data on the card that a
GM can set on his own item; nothing looks for a card's name.

**Version 1, the fixes (Foundry; no design needed; unblocks the next playtest):**
1. **The blocker:** a click anywhere on an action button uses it, a right-click opens its rule or item (C12: Heal / Rally Points; G5: Slip
   Away's Advance).
2. **Automation:** a condition written in a Tier applies when its Tier lands, for every card (G1-G3; a rule of the system, read from the
   card's text, so a homebrew card gets it too); a condition or effect chip dragged from the chat onto a token applies it (G1); Rebuke's Hindered
   (G8) and Slip Away's movement (G6) traced with a test first, then fixed; Judge asks for a target, with none an "Apply Effect" button (G4);
   Steadiness without asking, asked only on an ally (H1); the HUD hides Techniques not unlocked (D6).
3. **The chat:** follow a growing card (C1); the Steadiness line in its card (C2); remove Bloodied / Strained, the Reactions' use and "next
   damage reduced" lines, "is Down", the movement lines (C3-C6); the stamp stretched (C7); the doubles Critical's arrow over CRIT, the CRIT zone
   only on a Critical (C8, C9); Bloodied in the Vigor red (C11); the Save card shows the card's Effect line (a stopgap until its redesign).
4. **The roll dialog:** the roll line only where the card has one (B1); the calculated blue readable in dark (B4); "2x At-will use" (A2).
5. **Sheets, HUD, strip:** the row's pill "Turn · 1R" (E2); the item sheet's traits as plain words (E4); a sheet's own light theme (E5, traced);
   Rally Points editable by the player with a chat line (E7); the NPC sheet's image fix (E8); the HUD's both Modifiers and no Vigor / Resolve
   words (D2's content), no jump (D5), centered icons (D8); the AP pips (F1); Bloodied / Strained off the strip (F2).
6. **The Encounter Log:** damage to allies apart from damage to enemies, creatures of the same name numbered, a Setup's movement inside its
   Action, an area skipping creatures out of the fight.
7. **Mithril and Diamond retired:** each card's automation field carries Claude's Bronze / Silver / Gold rating (data on the card, editable);
   CLAUDE.md's Mithril rule goes, with-lucas.txt stays as history (A5).

**Version 2, the rules (the book first, then Foundry):**
1. **Chapter 2, Stacking:** an effect tied to the creature that gave it ("Judged by you") is a different effect for each creature (two Judges
   stack). **Judge:** "Once each round, when it damages an ally within 5 squares of you, you can reduce that damage by your Power Modifier"
   (Foundry: a general "can reduce once a round" option of a damage-reduction rule, offered in the Reactions message; not code for Judge).
2. **Areas (Chapter 3):** creatures inside an area never give Cover against it; walls and objects do (G7; Foundry's Cover follows).
3. **The card Structure:** a Special that says how the roll is made goes above the Attack line (A1: Darting Blade, every card checked).
4. **NPC cards (the Bestiary):** a "Tier 2 or 3" rider goes into Tiers 2 and 3 as "Pushed N" (A3); "Distance: Reach (X)" for melee attacks
   (A4; in Foundry X is the creature's Reach, read from the sheet).

**Then, design (mockups first, the standing rule):** the HUD (D1, D3, D4, D7: the Situational section with Linked Actions, Forced Movements,
Stand / Crawl while Prone, a Setup's movement, End movement, Judge's choice and the triggers; D2's small rebuild); the Save card (C10); the
sheets (E1, E3: the PC and NPC sheets small, the one-page long, the short card); then CARD-ONE step 4 (the one-page on the model).

**Also:** the tooltip stage (an inventory of every tooltip, categorized, for Lucas's review before anything is removed); CARD-ONE step 5 (one
card stylesheet; B3 and E6: one color per subtype with a dark variant), steps 6 and 7; the Minions' shared slot as an option (low priority).
