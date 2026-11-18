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
| Weapon Attack | Gold | |
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
| Break Free | Gold | |
| Leaning | Gold | |
| Fists | Gold | |
| Relocate | Gold | |
| Trip | Gold | |
| Shake Off | Silver | "within your Reach" isn't checked (v0.0.414) |
| Shove | Gold | |
| Haul | Gold | |
| Hide | Bronze | not written in the book yet (a placeholder) |

## Weapon Techniques (4)
| Card | Rating | What is by hand |
|---|---|---|
| Wounding Shot | Gold | |
| Circling Shot | Silver | the Tier 3's square "no farther from the target" isn't checked |
| Seizing Cut | Silver | the hand that holds the Grabbed creature isn't marked busy (v0.0.440: the Reposition and the Tier 3 Slide run by themselves, then Grabbed) |
| Thwart Cut | Silver | Pressed doesn't end when you stop threatening the target |

## The Paladin (13 Actions, 6 Features)
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
| Commandment | Silver | Courage (an Aura 3: ignore Frightened) is only a reminder |
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

## Totals
| | Gold | Silver | Bronze |
|---|---|---|---|
| Basic Actions (20) | 14 | 4 | 2 |
| Weapon Techniques (4) | 1 | 3 | 0 |
| Paladin (19) | 12 | 6 | 1 |
| Archer (19) | 12 | 5 | 2 |
| **All (62)** | **39** | **18** | **5** |

**The Bronze ones, the first to raise:** Hit and Run (one roll applied to every creature passed), Opening Shot (the ally's 1R Weapon Attack as a
button on the line), Weight of Judgment (a Speed −2 effect on the Judged creature), Interact (the draw / stow / swap as its choices), Hide (waits
for the book).
