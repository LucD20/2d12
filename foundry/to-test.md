# To test in Foundry: the running list

The one list of what Lucas tries in Foundry (since v0.0.425; it replaced the per-version "TO TEST" sections of foundry-backlog.md, which stay as
history). **Foundry shows it:** turn on the world setting **Test checklist** (GM): a bar shows one test at a time (Shift+K shows or hides it),
Pass / Fail / Skip; a Fail asks what happened and keeps the console's errors; the bar's List has every test and **Copy report** (paste it to
Claude). The answers are saved in the world.

**How Claude keeps it** (`foundry/twod12/tools/build-checklist.mjs` builds `foundry/twod12/checklist.json` from this file; t268 fails when they
differ):
- `## Group` = where you meet it in play. `### id · vX · Title`, then `Do:` and `Expect:` (a field can go on over several lines), and `Rev: N`
  when a test's text is rewritten so that it must be tried again (its old answer no longer counts).
- A new version adds its tests here (in the group where they are met), rewrites a test it changes (Rev + 1) and deletes a test it replaces.
- A test Lucas reports as passed is deleted from here in the next version (the report's PASS line); a failed one stays until its fix (Rev + 1).
- Only what the automated tests can't see: how it looks, how it feels, Foundry itself. v0.0.387 to v0.0.406 are not here: Lucas tested them at
  the merge ("All works except momentum").
- **Each test's Do names the creature to test it with** (Lucas, 2026-11-18: "When asking for an action on the checklist, write which PC has it").
- The names: the compendium's PCs Aveline (Paladin, Smite), Durgan (Paladin, Lay On Hands), Sylwen (Archer, Quick Shots), Kaela (Archer,
  Strafe); the NPCs Goblin Sneak, Orc Warrior, Grave Wisp, Ogre Chieftain.

## Characters and sheets

## The HUD

## Starting a combat

## The roll dialog

## Chat cards

### chat-follow · v0.0.466 · The chat follows a card grown by its dice
Do: With the chat at its bottom, Sylwen makes a Weapon Attack on the Orc Warrior and clicks Damage; then Apply. Then scroll up a little and click Damage on another card.
Expect: After Damage (the dice landed) the card's last line is in sight; after Apply too. Scrolled up before clicking, it stays where you are.
Rev: 5

### empowered-one · v0.0.467 · Empowered on a Save Action: chosen before the Saves
Do: Give Durgan Empowered; on his turn he uses Word of Radiance on two enemies.
Expect: Before anyone rolls, the HUD asks which creature takes the 1d6! (gold rings on both, their pictures); a chat line says "Durgan's Empowered 1d6! goes to X (chosen before the Saves)". After the Saves, X's damage has the die on its own line; if X takes no damage, the die is lost. If nothing is asked, look in the console for "twod12 | Empowered on a Save Action".
Rev: 5

## Conditions and their Tiers

## Movement

### charge-new · v0.0.467 · Charge: above the tokens
Do: In a combat with no target, Durgan uses Charge; then click the Goblin Sneak.
Expect: The rings, numbers, line, dots and plates are drawn over the tokens (not under them), clearly visible. Say what still reads as faint or unclear.
Rev: 5

### rewind-refund · v0.0.462 · Move back gives back only the last movement
Do: In a combat, the Ogre Chieftain drags 1 square, then drags again toward Kaela (Slip Away triggers on the second drag); on the Reactions card click Move back all the way (Shift-click). Then once a drag that buys an Advance (1 AP) and Move back all the way.
Expect: The Ogre goes back to where the second drag started, and only the second drag's squares come back (the first square stays spent). A drag that bought its Advance: back where it started with its AP and squares as before that drag.
Rev: 2

### large-difficult · v0.0.467 · A Large creature passing a creature: each step pays
Do: Make Durgan Large (2 × 2); in a combat, drag him straight past the Goblin Sneak so his space slides along its square for two steps; drop; read the HUD's squares left.
Expect: The move costs 2 more than its squares (each step alongside the Goblin pays 1 more): the squares left drop by the length + 2. (The ruler's own label shows only the length for a Large token.)
Rev: 3

### pushed-button · v0.0.467 · The Pushed button on Overhead Smash
Do: The Ogre Chieftain uses Overhead Smash on Durgan with a Tier 2; on the card, click "Pushed 2" (or apply the damage).
Expect: "Pushed 2" is a button; a click asks to push Durgan 2. Applying the damage also pushes him by itself (the button is for a push by hand).
Rev: 3

## Reactions and Judge

### judge-gm-dock · v0.0.463 · Judge's question for the GM, and Line of Effect
Do: As the GM with no token selected, the Judged Orc Warrior damages an ally near Durgan (Durgan an NPC-run Paladin, or the GM answering for him): click Durgan's token. Then a wall between Durgan and the ally.
Expect: The question moves into Durgan's HUD, Situational tab (not a small floating bar). With the wall (no Line of Effect from Durgan to the ally) no question and no reduction.

### sit-order · v0.0.463 · The Situational section's order and the area's question
Do: Sylwen is Prone; she uses an area Action (Volley) and places it.
Expect: The area's question ("Volley: apply the area shown on the map? …", capitalized) is above Prone's Stand / Crawl; no "Right-click pans the map" in any key line.


### armor-faith-source · v0.0.463 · Armor of Faith's names as text
Do: Durgan at Escalation 2 uses Shield of Faith on Aveline when the Orc Warrior's Strike would damage her.
Expect: The chat line reads "Armor of Faith (Durgan's Passive, for using Shield of Faith): Durgan gains Guard 3" with the two names in bold, a dotted underline, no box; a click opens each card.
Rev: 2

### two-judges · v0.0.463 · Two Paladins Judge the same Orc: the breakdown
Do: Aveline and Durgan both Judge one Orc; it damages an ally near both; both reduce; apply, then open the row's breakdown (the equals button).
Expect: Each Paladin is asked; the breakdown lists "Judge (Aveline) −N" and "Judge (Durgan) −N", then any Guard it took; no "Cannot read properties of null" in the console.
Rev: 2

### rescue-reach · v0.0.464 · Rescue stays within your Reach
Do: Durgan uses Hold the Line's Rescue on an adjacent ally (Aveline): try to move her 2 squares away from him, then to another square next to him.
Expect: Only the squares within Durgan's Reach are offered (the gold squares); a square farther away says "the target must remain within Durgan's Reach (1)"; a square next to him works.
Rev: 2

## Areas, light and Cover

### area-hover · v0.0.467 · The hover card: overlapping areas, in sections
Do: Aveline's Consecrated Ground overlapping Sylwen's Covering Fire; hover a square in both.
Expect: Both areas, each under its bold name, separated by a line; each one's lines in sections: "Enemies" (Difficult Terrain), "Allies and you" (Guard equal to your Power Modifier at the start of their turns), then its rounds.
Rev: 3

### covering-fire · v0.0.411 · Covering Fire, Volley, Spotter
Do: Sylwen places Covering Fire and the GM walks an enemy in; she uses Volley on a 3 Burst; she Calls Out (Spotter) a creature in Dim light.
Expect: The enemy takes [V] 2 + Weapon Modifier and pays double; Volley makes Prone on a Critical; your allies see the called-out creature Clear for 1 round.

### clear-lines · v0.0.411 · Clear Lines and Opening Shot
Do: Sylwen at Escalation 4 (Clear Lines) shoots past Aveline at an Orc Engaged with Durgan; then Kaela (Opening Shot) lands a Tier 3.
Expect: No Cover from your ally and no Field Bane; the Tier 3 line names your allies who threaten the target.

### ht-once · v0.0.431 · Hazardous Terrain once per turn-cycle
Do: Sylwen places Covering Fire; the GM moves an Orc into it (Advance), moves it again inside it in the same turn, and ends its turn there.
Expect: One hit only (on entering); none for the second move or the end of the turn; it can be hit again from its next turn.

## Ending an encounter and resting

### thrill-wrath · v0.0.411 · Thrill of the Kill and Kindled Wrath
Do: An enemy Sylwen damaged goes Down; Durgan, an ally of Aveline, becomes Bloodied.
Expect: The Archer's Escalation +1; the Paladin's Escalation +1 (once).

### thrill-kill · v0.0.426 · Thrill of the Kill on a first hit
Do: Sylwen's first damage on an Orc brings it Down; later, Aveline, whom Sylwen hit with a Volley, goes Down.
Expect: The kill raises her Escalation; the ally's Down doesn't.

## The Encounter Log

### log-allies · v0.0.421 · Damage to allies and numbered names
Do: In a fight with two Goblin Sneaks, Sylwen's Volley hits Aveline and the Goblins; open the Encounter Log.
Expect: The damage table has a "To allies" column (damage to itself counts there); the Goblins are "Goblin Sneak 1" and "Goblin Sneak 2" in the window and in the copied text.

## Windows

