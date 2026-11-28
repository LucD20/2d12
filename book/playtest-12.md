# Playtest 12 (2026-11-28): the same fight on the new economy

Lucas ran the fight of playtests 8 to 11 again, solo, on v0.0.539 or v0.0.540: the four level 1 pregens against the Ogre Chieftain, the Orc Warrior, the Grave Wisp and two Goblin Sneaks (CV 410). **The first fight on the action economy and the rebuilt Reactions** (AP regained at the end of the turn, no Reaction Point, a repeated At-will [Strike] Doomed, Favored and Doomed not Boons or Banes; v0.0.535 to v0.0.540). **Lucas, on sending it: "Dont apply any changes except about the playtest notes. review the playtest notes carefully."** Nothing in the book, the cards or Foundry was changed for it; this file is the record and Claude's review. The screenshots: `playtest-12/`.

## 1. Lucas's notes, word for word

**The verdict:** "Much much more interesting. There was weight to reactions, decisions, worked much better I'd say. Most of my complaints are foundry stuff but I rather keep as is and when we are actually done with Stage 0, we do a comeplete redesign. I did have to do some 'targeting other PCs' but this can be the circumstances more than anything."

**What he found:**
1. "First persons turn, on the first round, didnt get their APs"
2. "Basic attack from Charge caused Doomed on Drawing Light; Intended? I turned off manually in playtest."
3. "Rebuke/ targeted Aveline instead of the triggering creature."
4. "Grave Wisp's death didnt trigger its reactions"
5. "Advance calculation isnt taking into account difficult terrain I think (image 1 and 2)"
6. "2d12 Might need its own pathfinding because in image 3, you see that I can get "behind" Aveline, but if I try to move there, it says I cant since she is on the way, so I have to move to another square then to the one behind her. My module lucd20-automations has a pathfinding tool."
7. "Hurled goblin needs to have the weapon trait removed (Round 1, ogre). I made it instinct."
8. "Snap Shot effect should be a Setup"
9. "Prevent adding the extra die on smite/quick shots if you dont have enough actions."
10. "At round 2, for some reason the ogre chieftain didnt have actions"
11. "Push need a "tab to change sizes" like lines (image 4), so you can push for example, straigh back then diagonally down"

## 2. Claude's reading of the fight

| | Playtest 11 | Playtest 12 | The aim |
|---|---:|---:|---|
| The last enemy fell | round 3, the second PC (2.5) | **round 3, the second PC** (about 2.5) | 3 to 4 rounds |
| PC turns / enemy turns | 10 / 5 | **10 / 7** (the goblins acted, the wisp died in its own turn) | |
| The party's damage | 16.3 a turn | **15.9 a turn** (159 in 10 turns) | |
| Raw enemy damage | 92 | **91** (82 landed: Shield of Faith took 9) | |
| Cost, Rally Points a PC | 1.8 | **1.8** (Normal) | 1½ |
| The worst-hit PC | Aveline 122% | **Durgan 94%** (47 of 50), Aveline 78% | |
| Downs | 0 | 0 | |
| Reactions used / offered | | **5 used** (Rebuke, Shield of Faith, Snap Shot, Blood for Blood, Goblin Shriek); Rebuke passed 4 times; Dying Flare missed (a bug) | |
| AP kept at a turn's end | 1 | the wisp 1 | |

1. **The fight's size didn't move: 2.5 rounds, 1.8 Rally Points a PC, about 16 damage a PC turn, for the fifth time.** The economy changed how the turns feel, not the numbers. The aim of 3 to 4 rounds is still about a round away.
2. **Reactions now cost something and were chosen.** Aveline was offered Rebuke 5 times and used it once (on the wisp, which it killed); Durgan used Shield of Faith on the hit that mattered (the ogre's Tier 3 Crushing Grip for 18, halved to 9). That is the "weight" Lucas names: the trade of a blow on the next turn was weighed each time.
3. **The Doomed repeat works as meant** in the log: every second At-will Strike in a turn rolled Doomed (Sylwen, Kaela, the goblins' Jeer); the Round cards (Strafe, Darting Blade, Quick Shots, Smite) filled the first AP. A turn of two Basic Attacks is now rarer than a Round card and a Basic Attack.
4. **The Engaged [Ranged] Doomed showed up three times** (the ogre's Hurled Goblin next to Aveline, a goblin's Jeer, Shriek's Jeer): the creatures with ranged Basic attacks stood next to a PC. Note 7 is partly this (below).
5. **The Grave Wisp killed itself** walking into Rebuke (4 Holy on its last 4), and its Dying Flare never came (note 4: a bug).
6. **"Targeting other PCs"** (his verdict): the log shows one, Rebuke's damage landing on Aveline (note 3: a bug, not the circumstances). If there were others, they are not in the log.

## 3. Claude's review of the notes (no change made; each with what the code shows)

**Bugs (Foundry), most important first:**

| # | Note | What the code shows | The fix to make later |
|---|---|---|---|
| 3 | Rebuke hit Aveline | Confirmed. Rebuke's damage is the chip `@Damage[...]` run when the Reaction is used; `inline.mjs doDamage` ignores the Reaction's target and takes the **selected tokens first** (`handTargetTokens`), so the Paladin's own token got the damage card. The Pressure Bane went to the right creature (another chip, which reads the target). | `doDamage` takes the chain's targets when it has them (`ctx.targets`), as the other chips do. |
| 4 | Dying Flare didn't fire | Not reproduced in the code. The new "reaches its Health Pool" moment (`moment.mjs` `selfDowned`) is opened by `landedMoment` when damage takes a creature Down, and a Down creature is offered only that moment. Two candidates: (a) **the wisp in the world was not imported again after v0.0.535**, so its card still had the old Interrupt; (b) its death came from Rebuke's damage card, applied by hand from a card with no origin (bug 3), on a path that may not reach the moment. | Check (a) first: the wisp's Dying Flare should read "Trigger: The wisp's damage reaches its Health Pool" and cost 0R. Then retest with a Strike. |
| 1 | The first creature had no AP in round 1 | A likely race. At the encounter's start two things run at once: `combatStart` gives every creature its 4 AP (`combat.mjs encounterAP`), and Foundry's own turn change starts the first turn (`startTurn`), which reads the creature's AP and writes it back. If `startTurn` reads before `encounterAP` has written, it writes back 0. The others were not affected because their turns came later. | Give the first AP inside `startCombat` before Foundry starts the round (the Combat class already overrides it), or in `startTurn` when the creature has no AP yet. |
| 10 | The ogre had no AP in round 2 | Not explained by the code read. The ogre was last in round 1; its AP are regained when its turn ends (the turn change to Durgan, round 2), once, guarded by its turn key. The log shows its round 2 turn spending 4. | To reproduce: does the ogre's Turn Log show "AP regained" at the end of round 1? Which number did the combat strip show at its round 2 start? |
| 5 | The Advance doesn't count Difficult Terrain | The two counts disagree (screenshots 1 and 2): the drag's ruler said **11 squares (+6)** for Kaela's path through Aveline's square and the dark squares, while the Advance's counter left **1 of 6** (it charged 5). One of them is wrong. Darkness she can't see in and an ally's square are each Difficult Terrain in Foundry; v0.0.533 changed how Difficult Terrain is priced ("1 more", not "double"). | Compare the ruler's price and the counter's charge on the same path (`move.mjs hardStepCost`, the move hook's charge); a test on a path through an ally and Darkness. |
| 9 | The extra die with too few AP | Confirmed: the chips "1 AP: 1 more Smite die" and Steady Draw's "1 AP: 2dE more" can be ticked with no AP left; only a warning comes at the roll, and the die is not added. (Quick Shots has no such chip of its own; Steady Draw's shows on the Basic Attack.) | The chip is shown off, with its reason, when the AP left after the Action's cost is 0 (the CLAUDE.md rule: a button that can't be used is off, never hidden). |
| 6 | A path behind Aveline | The drag moves in a straight line from where it starts; a line that crosses a creature it can't pass through, or a blocked corner, is refused, even when a path around exists. Foundry has no path search of its own for this system. Lucas's module `lucd20-automations` has one (not in this session; not read). | A path search for the Advance (the shortest legal path under 2d12's rules), with his module as a model. Lucas: after Stage 0, with the Foundry redesign. |
| 11 | Push: straight then diagonal | Today a Push takes one direction for the whole distance. The Line has "Tab to change" between its two ties. | A Push bar with the same Tab, offering each legal path of that length away from the origin (the book's Forced Movement: each square farther away). |

**Card and rule questions (the book; for Lucas):**

| # | Note | What the rules say | The question |
|---|---|---|---|
| 2 | Charge's Basic Attack, then Drawing Light Doomed | **Intended by the book.** Chapter 2 says a Charge's Basic Attack counts toward the At-will count, so the next At-will [Strike] (Drawing Light, At-will) is a repeat: Doomed. (Drawing Light is also [Ranged], Doomed while Engaged; the log shows Durgan Advanced 4 after the Charge, so that one likely didn't apply.) The Charge card still writes "counts toward At-will Banes", the old word: to fix with the next card change. | Should a Charge's Basic Attack still count toward the repeat, now that a repeat is Doomed and not 1 Bane? Removing "that Basic Attack counts" makes Charge + an At-will Strike a normal pair (a Charge is a Round Action of 2 AP, like the class cards that don't count). |
| 7 | Hurled Goblin without the Weapon trait; "I made it instinct" | The card is [Weapon, Ranged, Strike], Weapon vs. Armor Defense. Its Doomed in round 1 came from **[Ranged] while Engaged** (the ogre stood next to Aveline), which removing [Weapon] doesn't change. An NPC's attack rolls its Weapon or Power Modifier (Chapter 14); a roll with an Attribute is a Check's, so "Instinct" needs a rule or a choice. | Which roll: Power vs. Armor Defense (a creature's strength, not a weapon), or an Instinct roll? And should it stay [Ranged] (Doomed while the ogre is Engaged), or be [Melee]-free with no Engaged penalty, a throw being its own thing? |
| 8 | Snap Shot's Evade as a Setup | The card writes "Effect: You Evade 1, then make this attack." A Setup (Chapter 2) is what happens before the rest of the Action: optional, the Distance checked after it. So the Evade would be optional, and the target's distance checked after it. | Setup: "You Evade 1." (the Effect line goes). That is a wording change Lucas asked for; written at the next card change. |

**Not bugs:** the Doomed repeats in the log, Shield of Faith's half (18 to 9), Goblin Shriek and Blood for Blood firing, Judge moved to the ogre after the wisp fell.

## 4. What it means for the plan (Claude's reading, not decided)

- **The economy and the rebuilt Reactions are a keep:** Lucas's verdict, and the log shows Reactions chosen, not reflexive.
- **The fight is still short** (2.5 rounds against 3 to 4), the fifth time at about 16 damage a PC turn. The next lever is the Bestiary's numbers or the PCs' damage, not the economy.
- **The Foundry bugs above (3, 4, 1, 10, 5, 9) block a clean next playtest**; 6 and 11 are the redesign Lucas places after Stage 0.
