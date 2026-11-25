# Automation ratings (Claude's own, v0.0.413, 2026-11-17; Shake Off added in v0.0.414)

Lucas asked (2026-11-17): "rate the automations yourself, from bronze to gold, of all the actions we created, including the basic actions. No
mithril nor diamond, only from bronze to gold." This is Claude's reading of what Foundry does for each card in the compendium, from each card's
automationNote and the code. Since v0.0.418 (Lucas, playtest 5: Mithril and Diamond retired) **this rating is the card's `automation` field** (the diamond
on the card shows it; editable on the item). Not checked in Foundry itself: Lucas's tests stay the source of truth.

**The scale**
- **Gold:** the whole card runs: its roll, damage, conditions, movement (a button counts), and every limit it states is checked.
- **Silver:** it runs, but one limit or a minor part is left to the player (named).
- **Bronze:** a main part of what the card does is by hand, or the card isn't written yet.

## Basic Actions (20)
| Card | Rating | What is by hand |
|---|---|---|
| Basic Attack | Gold | (the Weapon Attack until v0.0.480) |
| Advance | Gold | |
| Evade | Gold | |
| Charge | Gold | |
| Crawl | Silver | the 2 AP Version's "Your Speed is 5 or higher" isn't checked |
| Reload | Silver | the Tier 1 "next Reload attempt gains 2 Boons" isn't carried to the next roll |
| Interact | Bronze | drawing, stowing and swapping are done on the hands buttons, not by the card; only waking a creature is offered |
| Steel Yourself | Gold | |
| Regrip | Silver | the card is text; the regrip itself is on the hands buttons |
| Release | Gold | |
| Stand | Gold | |
| Break Free | Gold | (v0.0.477: its card rolls the Check against the Action DC of what holds you; Tier 2 or 3 frees) |
| Lean | Gold | (v0.0.477: Leaning ends when the creature leaves its square) |
| Fists | Gold | |
| Relocate | Gold | |
| Trip | Gold | |
| Shake Off | Silver | "within your Reach" isn't checked (v0.0.414) |
| Shove | Gold | |
| Haul | Gold | |
| Aid | Silver | Quickened 1 on the target (its next turn's AP); the Check against Daunted: by hand. |
| Demoralize | Gold |  |
| Feint | Gold |  |
| Heal | Silver | the Check against DC 13 and the Rally Point button on the card; standing from Prone on Tier 3 by hand. |
| Tumble | Silver | the movement (the Advance or the Evade) passes enemies' spaces and the diagonal between two of them (never ending in one); the Check: by hand. |
| Hide | Bronze | not written in the book yet (a placeholder) |

## Weapon Techniques (4)
| Card | Rating | What is by hand |
|---|---|---|
| Wounding Shot | Gold | |
| Circling Shot | Silver | the Tier 3's square "no farther from the target" isn't checked |
| Seizing Cut | Silver | the hand that holds the Grabbed creature isn't marked busy (v0.0.440: the Reposition and the Tier 3 Slide run by themselves, then Grabbed) |
| Thwart Cut | Silver | Pressed doesn't end when you stop threatening the target |

## The Paladin (13 Actions, 6 Features)
> **v0.0.507 (batch 5):** the Arts (Lantern of Faith, Hold the Line, Commandment, Footwork, Trick Shots, Spotter), the Escalation Passives and Reckoning left the classes: their rows below are history (the cards are in `foundry/deprecated/`).

| Card | Rating | What is by hand |
|---|---|---|
| Judge | Silver | the 0 AP use only at the start of an encounter or as a 0R |
| Smite | Gold | |
| Binding Light | Gold | |
| Lay On Hands | Silver | the Setup's Advance in a straight line toward the target |
| Shield of Faith | Gold | |
| Rebuke | Gold | |
| Lantern of Faith | Gold | |
| Hold the Line | Silver | Brace's squares stay where you used it if you move (Foundry's Aura follows you); Trade Places between different Sizes is refused (v0.0.431) |
| Commandment | Silver | Courage (an Aura 3: ignore Daunted) is only a reminder |
| Bulwark of Faith | Gold | |
| Consecrated Ground | Gold | |
| Word of Radiance | Gold | |
| Reckoning | Gold | |
| Armor of Faith (Feature) | Gold | |
| Roving Judgment (Feature) | Gold | |
| Kindled Wrath (Feature) | Gold | |
| Weight of Judgment (Feature) | Bronze | the Judged creature's Speed −2 is by hand (it is the whole Feature) |
| Tireless Vigil (Feature) | Silver | the second Reaction AP paying only for [Divine] Reactions |
| Hallowed Stance (Feature) | Silver | once on your turn |

## The Archer (11 Actions, 8 Features)
| Card | Rating | What is by hand |
|---|---|---|
| Darting Blade | Silver | drawing and stowing the Light weapon |
| Quick Shots | Silver | a Critical's 1 AP back |
| Strafe | Gold | |
| Slip Away | Gold | |
| Snap Shot | Gold | |
| Footwork | Silver | Hands Busy's Interact or Reload; Weave through unwilling creatures |
| Trick Shots | Gold | |
| Spotter | Silver | Keep Low is only a reminder; Find the Gap's Cover one level lower |
| Volley | Gold | |
| Hit and Run | Bronze | one roll for many targets (the other targets by hand), the free draws and the bow shot |
| Covering Fire | Gold | |
| Shifting Aim (Feature) | Gold | |
| Lean and Loose (Feature) | Gold | |
| Blade and Bow (Feature) | Gold | |
| Thrill of the Kill (Feature) | Gold | |
| Clear Lines (Feature) | Gold | |
| Opening Shot (Feature) | Bronze | the ally's Weapon Attack (1R), its payoff, is by hand (only a line names the allies) |
| One More Arrow (Feature) | Gold | |
| Fleet (Feature) | Silver | an Evade entering Difficult Terrain |

## The playtest Talents (7 cards; v0.0.475, pack TALENTS-PT; `book/cards/stage0/talents-pt.json`)
| Card | Rating | What is by hand |
|---|---|---|
| Take Aim (Talent and Action) | Gold | |
| Cold Domain (Talent) | Gold | (it gives Rime Strike) |
| Rime Strike | Silver | the Ice Pillar's Tier 1 against a Save (the GM picks it), the damage a Collision deals it, an object other than the Ice Pillar as the target |
| Shared Burden (Talent) | Gold | (it gives Oath of Burden and Bear the Blow) |
| Oath of Burden | Gold | |
| Bear the Blow | Gold | (a damage with no damage types, an old card's Apply, is split after the ally's Resistance) |
| Ricochet (Talent and Action) | Gold | (the Setup's "a new square each step" is the player's drag) |

## Totals
| | Gold | Silver | Bronze |
|---|---|---|---|
| Basic Actions (20) | 14 | 4 | 2 |
| Weapon Techniques (4) | 1 | 3 | 0 |
| Paladin (19) | 12 | 6 | 1 |
| Archer (19) | 12 | 5 | 2 |
| Playtest Talents (7) | 6 | 1 | 0 |
| **All (69)** | **45** | **19** | **5** |

**The Bronze ones, the first to raise:** Hit and Run (one roll applied to every creature passed), Opening Shot (the ally's 1R Weapon Attack as a
button on the line), Weight of Judgment (a Speed −2 effect on the Judged creature), Interact (the draw / stow / swap as its choices), Hide (waits
for the book).

## The Bestiary's rebuilt creatures (v0.0.519, 2026-11-25; `book/cards/stage0/bestiary.json`; Chapter 14's stat blocks)

### Goblin Sneak (Minion; the record: `book/cards/goblin-sneak-redesign.md`)
| Card | Rating | What is by hand |
|---|---|---|
| Shiv | Gold | |
| Jeer | Gold | |
| Knife in the Back | Gold | (its Requirement, the flank, warns as every Requirement does) |
| Shriek and Scatter | Gold | (offered by itself: the moment allyDown with the Goblin Tag; Jeer's target is the GM's pick) |

### Grave Wisp (Grunt; `book/cards/grave-wisp-redesign.md`)
| Card | Rating | What is by hand |
|---|---|---|
| Drifting | Gold | (the hook drift: movement through creatures, no Difficult Terrain from them) |
| Slipping Touch | Gold | (the Tier 1's Evade 1 is a button) |
| Guttering Glance | Gold | |
| Pass Through | Silver | the Setup's straight line and the targets (up to two enemies whose space it passed): the GM's |
| Dying Flare | Gold | (offered by itself: the moment selfDown) |

### Orc Warrior (Standard; `book/cards/orc-warrior-redesign.md`)
| Card | Rating | What is by hand |
|---|---|---|
| Hamstringing Axe | Gold | |
| Barbed Javelin | Gold | (the Setup's draw is text: an NPC's items are flavor) |
| War Howl | Gold | |
| Blood for Blood | Gold | (v0.0.519: offered by itself, the moment selfDamage with Vigor and Bloodied; its Basic attack button takes the one that reaches) |
| Cornered | Gold | (v0.0.519: the hook stateBoon) |

### Ogre Chieftain (Elite; `book/cards/ogre-chieftain-redesign.md`)
| Card | Rating | What is by hand |
|---|---|---|
| Crushing Grip | Silver | one creature held at a time (a second Grab: the GM ends the first) |
| Roar | Gold | |
| Great Sweep | Gold | |
| Hurled Goblin | Silver | its Requirement (a willing Minion ally within its Reach) and the landing (the GM moves the Minion to an empty square adjacent to the target) |
| Crack the Ground | Gold | (the Line 3 and its Zone, Difficult Terrain for every creature until the encounter ends) |
| Backhand | Gold | (offered by itself: the moment enemyEnters, no Move back; the 1 damage and the Push 2 are buttons) |

**The four creatures (24 cards): 20 Gold, 4 Silver, 0 Bronze.**
