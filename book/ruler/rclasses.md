# Pack R-classes: the rebuilt Paladin and Archer under pack R's rules

Written by `node book/ruler/rclasses.mjs`; don't edit, run it again. Read by `book/rules-backlog.md` (pack R-classes) and the class documents' design notes.

Runs: 800 fights a measurement. **The party:** the R builds of `rework/` (a Smite Paladin, a Lay On Hands Paladin, a Double Shot Archer, a Rolling Shot Archer), level 1, Human, high on Vigor (the Paladin 23 / 12 = 35 Health, the Archer 19 / 10 = 29; Rally Points = Rally + 1). **The rules:** every piece of the rework as decided (rework-r.md section 14): 4 + 1 AP, Escalation as a level from 1 (Momentum 2 in half the fights) with the Critical hook and the class hooks (the Paladin's Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down), Guard 2 per unspent AP (it can still pay a Reaction), the NPC Specials (a Standard's 2 AP Special × 2.2 once a round), Opportunity Attack without the disrupt, and the Bestiary of pack R-bestiary (config.mjs's tables: today's × 0.7 at Stage 1, with Elite Escalation and the phases; rbestiary.md). **The fight:** 4 Standards (CV 4, the "normal" fight: about a fifth of the party's Health with the Rally Points it spends, a Down in about 1 fight of 5; before R-bestiary the pre-R tables × 0.6). 1 AP = 5.8 DE.

## 1. The Paladin's turns (damage at Defense 13; Monte Carlo)

| Build | Turn | Escalation 1 | Escalation 3 | AP | Steps |
|---|---|---:|---:|---:|---|
| Paladin (Smite) | Main | 26.0 | 30.8 | 4 | Smite 2, Weapon Attack, Weapon Attack |
| Paladin (Smite) | Smite 3 and one attack | 23.1 | 26.6 | 4 | Smite 3, Weapon Attack |
| Paladin (Smite) | Nova | 27.6 | 31.1 | 4 | Holy Wrath 3, Weapon Attack |
| Paladin (Smite) | Nova with Smite | 30.2 | 34.2 | 4 | Holy Wrath 2, Smite 2 |
| Paladin (Smite) | Apex | 15.9 | 34.2 | 4 | Final Verdict, Smite 2 |
| Paladin (Smite) | Two attacks | 13.3 | 16.1 | 2 | Weapon Attack, Weapon Attack |
| Paladin (Smite) | Steel | 15.9 | 17.9 | 4 | Steel Yourself 2, Smite 2 |
| Paladin (Lay On Hands) | Main | 10.1 | 10.1 | 4 | Lay On Hands 2, Weapon Attack, Weapon Attack |
| Paladin (Lay On Hands) | Heal 1 and three attacks | 14.4 | 14.4 | 4 | Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack |
| Paladin (Lay On Hands) | Nova | 14.2 | 14.2 | 4 | Lay On Hands 2, Holy Wrath 2 |
| Paladin (Lay On Hands) | Apex | 5.3 | 5.3 | 4 | Hallowed Dawn, Weapon Attack |
| Paladin (Lay On Hands) | Two attacks | 10.1 | 10.1 | 2 | Weapon Attack, Weapon Attack |

The Apex turn is taken at Escalation 3 while the Apex is unused (`when escalation 3`); the Nova (Holy Wrath 3 at the Encounter ceilings: 2d8 / 3d8 / 4d8) in round 1. Final Verdict hits every adjacent enemy (1.5 on average here).

## 2. The fights

| Fight | rounds · lost · Down · won | Party dealt · taken a fight | A Paladin's turns at Escalation 1 / 2 / 3 | Smite Paladin: dealt a fight · reactions · blocked · surge given · mend given | Lay On Hands Paladin: dealt · reactions · blocked · mend given · reduced |
|---|---|---|---|---|---|
| 4 Standards (normal) | 3.5 r · 10% · Down 18% · won 100% | 304.2 · 49.4 | 0.47 / 0.89 / 1.60 | 89.7 · 2.15 · 0.0 · 0.0 · 0.0 | 18.1 · 2.55 · 19.3 · 24.0 · 4.7 |
| 6 Standards (hard) | 5.5 r · 37% · Down 58% · won 80% | 415.7 · 128.3 | 0.45 / 0.77 / 2.95 | 118.1 · 3.18 · 0.0 · 0.0 · 0.0 | 35.5 · 4.39 · 32.8 · 45.8 · 22.9 |
| 2 Elites + 2 Standards (deadly) | 5.7 r · 30% · Down 52% · won 89% | 422.7 · 111.2 | 0.47 / 0.81 / 3.08 | 119.7 · 2.96 · 0.0 · 0.0 · 0.0 | 29.3 · 4.02 · 33.5 · 40.9 · 13.5 |

For scale, the decision sheet's row with the P1 builds at the same fit (rework-sheet.md section 5): 3.5 r · 25% · Down 18% · won 100%.

## 3. The Hallmark Reactions (both Paladins with the Reaction named; the Archers keep Quick Draw)

**Worth** = what the Reaction itself did a fight (its damage, what its block took off, the Guard its rest gave that was used) per Paladin turn, in DE and AP. A Turn Reaction fires once per NPC turn, a Round one once a round.

| Paladins' Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · Guard used · damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |
|---|---|---:|---|---|
| None | 3.7 r · 19% · Down 31% · won 99% | 0.00 | 0.0 · 0.0 · 0.0 | 0.00 · 0.00 |
| Opportunity Attack (the basic Reaction) | 3.5 r · 19% · Down 30% · won 100% | 0.86 | 0.0 · 0.0 · 5.9 | 2.12 · 0.37 |
| Shield of Faith (1R, Turn: 2d6 + [PMod]) | 3.5 r · 7% · Down 12% · won 100% | 2.34 | 16.6 · 0.0 · 0.0 | 5.49 · 0.95 |
| Rebuke (1R, Turn, Trigger: an enemy within 5 squares Strikes an ally: Appeal Save; 1d8 Ho, Pushed 2, Frightened / 1d6 Ho, Pushed 1 / nothing) | 3.5 r · 17% · Down 25% · won 100% | 2.08 | 0.0 · 0.0 · 6.3 | 2.18 · 0.38 |
| Rebuke's Push and Frightened, by arithmetic (0.9 DE a fire × 2.08 fires) | | | | 0.64 · 0.11 |
| Rebuke at Reach and Round (the first draft) | 3.7 r · 18% · Down 27% · won 99% | 0.67 | 0.0 · 0.0 · 2.1 | 0.69 · 0.12 |
| Bulwark of Faith as it was (1R, Round, ally only; an Encounter Pick since part 3) | 3.6 r · 10% · Down 17% · won 100% | 1.52 | 12.1 · 0.7 · 0.0 | 4.25 · 0.73 |

A block can't take more than the hit: at this fit a Standard's Basic attack averages 3.6 / 6.6 and its 2 AP Special 7.9 / 14.5. Bulwark's Guard is the ally's Rally Point (9 for a Paladin, 8 for an Archer here: 9 in the model), before the damage, so its rest stays as Guard (Stacking: the higher value).

## 4. The Escalation Passives

**The wrath Passives** (the Main turn at Defense 13 with and without the Passive, at its rung; Reckoning against a Bloodied target): the damage it adds a turn, in DE and AP. **The mercy Passives:** what each did a fight in the normal fight (4 Standards) and in a hard one (6 Standards, CV 6): the allies' extra damage (Divine Surge), the healing (Mending Light; the extra on the Rally Points used: Font of Mercy), the damage reduced (Hallowed Stance), per turn of its owner and per turn at its rung. The rung budgets (rework-r.md 14.2 item 15): rung 1 about 0.4-0.6 AP a turn, rung 2 0.6-0.8, rung 3 0.8-1; a rung 3 Passive is on for the last turn or two of a normal fight.

| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |
|---|---|---|---|
| Radiant Zeal (1) | smite | 26.0 · 22.6 | 3.45 · 0.60 |
| Searing Blows (2) | smite | 30.8 · 26.0 | 4.74 · 0.82 |
| Reckoning (against a Strained target) (3) | smite | 36.2 · 30.8 | 5.45 · 0.94 |

| Mercy Passive (rung) | Build | Fight | rounds · lost · Down · won | What it did a fight | Worth a turn (DE · AP) | Worth a turn at its rung (DE · AP) |
|---|---|---|---|---|---|---|
| Divine Surge (1) | smite | 4 Standards | 3.6 r · 10% · Down 16% · won 100% | 9.8 | 3.31 · 0.57 | 3.31 · 0.57 |
| Font of Mercy (1) | hands | 4 Standards | 3.5 r · 12% · Down 18% · won 100% | 3.9 | 1.36 · 0.23 | 1.36 · 0.23 |
| Mending Light (2) | hands | 4 Standards | 3.5 r · 12% · Down 18% · won 100% | 8.6 | 2.98 · 0.51 | 3.59 · 0.62 |
| Hallowed Stance (3) | hands | 4 Standards | 3.5 r · 12% · Down 18% · won 100% | 5.0 | 1.72 · 0.30 | 3.34 · 0.58 |
| Divine Surge (1) | smite | 6 Standards (hard) | 5.6 r · 38% · Down 60% · won 80% | 12.1 | 3.19 · 0.55 | 3.19 · 0.55 |
| Font of Mercy (1) | hands | 6 Standards (hard) | 5.3 r · 38% · Down 57% · won 81% | 9.3 | 2.14 · 0.37 | 2.14 · 0.37 |
| Mending Light (2) | hands | 6 Standards (hard) | 5.3 r · 38% · Down 57% · won 81% | 16.0 | 3.69 · 0.64 | 4.14 · 0.71 |
| Hallowed Stance (3) | hands | 6 Standards (hard) | 5.3 r · 38% · Down 57% · won 81% | 20.3 | 4.68 · 0.81 | 6.52 · 1.12 |

Font of Mercy adds to the Rally Points used in the fight: the ruler's Lay On Hands spends one only on an ally hurt at least three quarters of what it heals, so in a normal fight it hardly fires (the Standard day's between-fight Rally Points, where it also works, are not in these numbers).

## 5. The Apex (the fight with and without the Apex turn)

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Party taken with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Final Verdict (2 AP) | smite | 4 Standards | 3.5 r · 10% · Down 18% · won 100% · 3.6 r · 11% · Down 18% · won 99% | 89.7 · 85.9 | 49.4 · 51.4 | 0.90 | 6.4 · 3.2 |
| Hallowed Dawn (3 AP) | hands | 4 Standards | 3.5 r · 10% · Down 18% · won 100% · 3.5 r · 12% · Down 18% · won 100% | 18.1 · 23.4 | 49.4 · 48.7 | 0.86 | -0.5 · -0.2 |
| Final Verdict (2 AP) | smite | 6 Standards (hard) | 5.5 r · 37% · Down 58% · won 80% · 5.6 r · 35% · Down 57% · won 83% | 118.1 · 118.5 | 128.3 · 125.9 | 0.83 | -3.3 · -1.6 |
| Hallowed Dawn (3 AP) | hands | 6 Standards (hard) | 5.5 r · 37% · Down 58% · won 80% · 5.3 r · 38% · Down 57% · won 81% | 35.5 · 39.7 | 128.3 · 123.4 | 0.85 | 2.6 · 0.9 |

The Encounter band is 1.4 to 2 × 5.8 = 8.1 to 11.6 DE per AP (prices.md). Hallowed Dawn's worth is its healing (new Health to the three most hurt of you and your allies, 3d6 + [PMod] each); its Enfeebled 1 on the enemies and the cleansing are not modeled.

## 6. The Archer

The R builds of the Archer: Double Shot with Overwatch and Deathmark, Rolling Shot with Ready Shot and Open Season; both with Killer's Focus (1), Hunter's Edge (2) and Finisher (3). Vanish (a free Evade 1 when an enemy comes adjacent), Sure Step (a free Evade 1 after a Shot on the Quarry), Harrying Shots (a Bane on the Quarry's Strikes) and Pinned Down (Immobilized (EoT) on the Quarry each round) are positional: not modeled (positions priced Immobilized (EoT) on a Standard at 4.7 DE, prices.md section 5).

| Build | Turn | Escalation 1 | Escalation 3 | AP | Steps |
|---|---|---:|---:|---:|---|
| Archer (Double Shot) | Main | 28.6 | 31.2 | 4 | Double Shot 2, Lock & Loose, Weapon Attack |
| Archer (Double Shot) | Big | 28.6 | 31.2 | 5 | Double Shot 3, Lock & Loose, Weapon Attack |
| Archer (Double Shot) | Main with the step | 22.6 | 25.1 | 4 | Double Shot 3, Lock & Loose |
| Archer (Double Shot) | Pin | 29.0 | 31.5 | 4 | Double Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |
| Archer (Double Shot) | Apex | 16.2 | 34.7 | 4 | Deathmark, Double Shot 2 |
| Archer (Double Shot) | Kite | 22.6 | 25.1 | 4 | Double Shot 3, Lock & Loose |
| Archer (Double Shot) | Steel | 16.2 | 18.5 | 4 | Steel Yourself 2, Double Shot 2 |
| Archer (Rolling Shot) | Main | 25.3 | 27.8 | 4 | Rolling Shot 2, Lock & Loose, Weapon Attack |
| Archer (Rolling Shot) | Big | 27.9 | 30.5 | 5 | Rolling Shot 3, Lock & Loose, Weapon Attack |
| Archer (Rolling Shot) | Main with the long roll | 21.6 | 24.0 | 4 | Rolling Shot 3, Lock & Loose |
| Archer (Rolling Shot) | Pin | 25.3 | 27.8 | 4 | Rolling Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |
| Archer (Rolling Shot) | Apex | 11.9 | 22.5 | 4 | Open Season, Rolling Shot 2 |
| Archer (Rolling Shot) | Kite | 21.6 | 24.0 | 4 | Rolling Shot 3, Lock & Loose |
| Archer (Rolling Shot) | Steel | 11.9 | 13.7 | 4 | Steel Yourself 2, Rolling Shot 2 |

**The Hallmark Reactions** (both Archers with the Reaction named; the Paladins keep Shield of Faith): worth = the Reaction's own damage, the extra damage its AP bought (the 5 AP turn's damage over the 4 AP turn's, for Ready Shot) or the extra damage its Vulnerable gave the party (the same roll with and without the Boon), per Archer turn.

| Archers' Reaction | rounds · lost · Down · won | Reactions a fight (an Archer) | Its damage · its Vulnerable's extra · an Archer's damage a fight | Worth an Archer turn (DE · AP) |
|---|---|---:|---|---|
| None | 4.1 r · 13% · Down 25% · won 99% | 0.00 | 0.0 · 1.6 · 91.7 | 0.46 · 0.08 |
| Opportunity Attack (the basic Reaction) | 4.1 r · 13% · Down 25% · won 99% | 0.00 | 0.0 · 1.6 · 91.7 | 0.46 · 0.08 |
| Quick Draw (the sheet's stand-in: an enemy within 5 squares moves closer) | 3.7 r · 11% · Down 19% · won 99% | 1.69 | 12.4 · 1.6 · 95.4 | 4.29 · 0.74 |
| Overwatch (1R, Turn: an enemy within 10 squares moves closer to you; its Hindered and Critical Push not modeled) | 3.5 r · 11% · Down 20% · won 100% | 2.56 | 17.5 · 1.8 · 96.4 | 6.18 · 1.07 |
| Overwatch on a Strike trigger (the first draft) | 3.5 r · 12% · Down 20% · won 100% | 3.13 | 20.9 · 1.6 · 98.6 | 7.33 · 1.26 |
| Covering Shot (1R, Turn, Interrupt: a Strike would damage an ally within 10 squares: a Weapon Attack with 1 Boon; Tier 3 halves the ally's damage) | 3.5 r · 11% · Down 18% · won 100% | 2.80 | 20.4 · 1.6 · 98.0 | 7.95 · 1.37 |
| Ready Shot (dropped: 1 AP less on your next turn's first Shot) | 3.9 r · 11% · Down 21% · won 100% | 3.00 | 0.0 · 1.6 · 95.6 | 1.59 · 0.27 |
| Call the Shot (considered: an ally damages your Quarry: Vulnerable 1 until your next turn) | 4.1 r · 12% · Down 23% · won 99% | 1.96 | 0.0 · 2.9 · 91.9 | 0.83 · 0.14 |
| Ready Shot by the turn tables (the 5 AP turn over the 4 AP turn at Escalation 3: 30.5 − 27.8, × 0.76 fires an Archer turn) | | | | 2.04 · 0.35 |

Ready Shot's AP is spent on a 5 AP turn (Double Shot 3 or Rolling Shot 3, Lock & Loose, a Weapon Attack); its worth is the Archer's damage over the row with no Reaction (a fight to the death caps it: the NPCs' Health). Open Season's Vulnerable lasts until the end of the Archer's next turn, as the card says.

| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |
|---|---|---|---|
| Killer's Focus (1) | double | 28.6 · 25.1 | 3.47 · 0.60 |
| Hunter's Edge (2) | double | 31.2 · 28.6 | 2.57 · 0.44 |
| Finisher (3) | double | 35.7 · 31.2 | 4.51 · 0.78 |

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Its Vulnerable's extra with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Deathmark (2 AP) | double | 4 Standards | 3.5 r · 10% · Down 18% · won 100% · 3.5 r · 10% · Down 16% · won 100% | 104.7 · 100.1 | 0.0 · 0.0 | 0.98 | 6.1 · 3.1 |
| Open Season (2 AP) | rolling | 4 Standards | 3.5 r · 10% · Down 18% · won 100% · 3.5 r · 11% · Down 19% · won 100% | 91.6 · 95.3 | 3.7 · 0.0 | 0.97 | 0.5 · 0.3 |
| Deathmark (2 AP) | double | 6 Standards (hard) | 5.5 r · 37% · Down 58% · won 80% · 5.6 r · 39% · Down 59% · won 78% | 135.9 · 133.7 | 0.0 · 0.0 | 0.92 | 3.5 · 1.7 |
| Open Season (2 AP) | rolling | 6 Standards (hard) | 5.5 r · 37% · Down 58% · won 80% · 5.6 r · 39% · Down 62% · won 80% | 126.1 · 127.5 | 3.2 · 0.0 | 0.93 | 4.5 · 2.2 |

Deathmark's Boon against the Quarry and its chain shot on a kill are not modeled (a floor); Open Season's allies' extra [V] 1d6 Pi is not modeled either, (a floor). Hunter's Edge's Cover part (about 1.5 DE a turn: positions) is not in the turn table.

## 7. The ledger: every class card's worth under pack R

Each Action priced as econ.mjs prices the price list (the damage and the effects it can price, against the level 1 Standard, Defense 13), at pack R's exchange rate: 1 AP = 5.8 DE (the baseline turn / 4). **Efficiency** = DE per AP ÷ 5.8; the bands (prices.md): At-will 0.9-1.1, Round and Turn 1-1.3, Encounter 1.4-2, Daily 2-3; a Reaction's worth is per use against 1 AP; a Passive's is the fight measure above against its rung budget (rung 1 0.4-0.6 AP a turn, 2 0.6-0.8, 3 0.8-1). What the ruler can't price is named (Pushes, conditions and Bleed carry the positions prices; "not modeled" otherwise). The same numbers go to `book/ruler/worth.json`, which Foundry prints as a tiny line on each card (tools/cardgen.mjs), for the playtests.

| Card | Version | Frequency | DE a use | DE per AP | Efficiency | Verdict | Notes |
|---|---|---|---:|---:|---:|---|---|
| **Paladin** | | | | | | | |
| Smite | 1 AP | round | 8.2 | 8.2 | 1.40 | a little over |  |
| Smite | 2 AP | round | 12.5 | 6.2 | 1.07 | on target |  |
| Smite | 3 AP | round | 15.9 | 5.3 | 0.91 | a little under | Guard: only what a later hit uses (30%) |
| Lay On Hands | 1 AP | round | 8.8 | 8.8 | 1.51 | over | uses the target's own Rally Points |
| Lay On Hands | 2 AP | round | 14.9 | 7.4 | 1.27 | on target | uses the target's own Rally Points; new Health (no Rally Point) |
| Lay On Hands | 3 AP | round | 23.7 | 7.9 | 1.35 | a little over | uses the target's own Rally Points; new Health (no Rally Point) |
| Shield of Faith | 1R | turn | 5.5 | 5.5 | 0.95 | a little under | damage an ally doesn't take (one hit); worth: the fight measure (section 3 or 6) |
| Rebuke | 1R | turn | 4.2 | 4.2 | 0.49 | under | not modeled: Frightened (EoT); Pushed 2: 1.51 (positions); Pushed 1: 1.51 (positions); worth: the fight measure (section 3 or 6) |
| Holy Wrath | 2 AP | encounter | 14.3 | 7.2 | 1.23 | under |  |
| Holy Wrath | 3 AP | encounter | 18.8 | 6.3 | 1.08 | under |  |
| Word of Radiance | 2 AP | encounter | 16.3 | 8.1 | 1.40 | a little under | Pushed 1: 1.51 (positions); Pushed 2: 1.51 (positions) |
| Word of Radiance | 3 AP | encounter | 25.4 | 8.5 | 1.45 | on target | Pushed 1: 1.51 (positions); Pushed 2: 1.51 (positions) |
| Bulwark of Faith | 1R | encounter | 7.0 | 7.0 | 1.19 | under | damage an ally doesn't take (one hit); Slid 1: 1.49 (positions) |
| Beacon | 1 AP | encounter | 6.0 | 6.0 | 1.03 | under |  |
| Consecrated Ground | 2 AP | daily | 21.3 | 10.6 | 1.83 | a little under |  |
| Consecrated Ground | 3 AP | daily | 44.4 | 14.8 | 2.54 | on target |  |
| Miraculous Recovery | 2 AP | daily | 24.7 | 12.4 | 2.12 | on target | ends an effect: 7.14 (the average Moderate condition on a PC, positions) |
| Miraculous Recovery | 3 AP | daily | 33.5 | 11.2 | 1.92 | a little under | ends an effect: 7.14 (the average Moderate condition on a PC, positions) |
| Divine Intervention | 2R | daily | 36.7 | 18.4 | 6.31 | over | a Down undone or prevented: 35 DE a use, x 97% (how often an ally goes Down in a day); Guard: only what a later hit uses (30%) |
| Radiant Zeal | Passive | rung 1 | | | 0.60 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.4-0.6 |
| Divine Surge | Passive | rung 1 | | | 0.57 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.4-0.6 |
| Font of Mercy | Passive | rung 1 | | | 0.23 AP a turn | under | the fight measure (section 4 or 6) against the rung's 0.4-0.6 |
| Searing Blows | Passive | rung 2 | | | 0.82 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.6-0.8 |
| Mending Light | Passive | rung 2 | | | 0.62 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.6-0.8 |
| Reckoning | Passive | rung 3 | | | 0.94 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.8-1 |
| Hallowed Stance | Passive | rung 3 | | | 0.58 AP a turn | under | the fight measure (section 4 or 6) against the rung's 0.8-1 |
| Final Verdict | 2 AP | encounter, Escalation 3 | 21.5 | 10.7 | 1.84 | on target |  |
| Hallowed Dawn | 3 AP | encounter, Escalation 3 | 22.4 | 7.5 | 1.28 | a little under | new Health (no Rally Point); Pushed 2: 1.51 (positions); ends an effect: 7.14 (the average Moderate condition on a PC, positions) |
| **Archer** | | | | | | | |
| Double Shot | 2 AP | round | 11.0 | 5.5 | 0.94 | a little under |  |
| Double Shot | 3 AP | round | 13.7 | 4.6 | 0.78 | under | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Rolling Shot | 1 AP | round | 8.2 | 8.2 | 1.40 | a little over | Evade 1: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Rolling Shot | 2 AP | round | 10.7 | 5.3 | 0.92 | a little under | Evade 2: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Rolling Shot | 3 AP | round | 13.2 | 4.4 | 0.76 | under | Evade 3: saves the step away (1 AP) on the 46% of the turns it starts Engaged |
| Overwatch | 1R | turn | 5.5 | 5.5 | 1.07 | on target | worth: the fight measure (section 3 or 6) |
| Covering Shot | 1R | turn | 6.0 | 6.0 | 1.37 | on target | worth: the fight measure (section 3 or 6) |
| Marksman's Shot | 2 AP | encounter | 13.4 | 6.7 | 1.15 | under |  |
| Volley | 2 AP | encounter | 16.9 | 8.5 | 1.45 | on target | Hindered (EoT): 2.65 (positions) |
| Covering Fire | 2 AP | encounter | 9.6 | 4.8 | 0.82 | under |  |
| Pinning Shot | 1 AP | encounter | 12.2 | 12.2 | 2.10 | a little over | Immobilized (EoT): 9.33 (positions) |
| Twin Shot | 1 AP | encounter | 16.0 | 16.0 | 2.76 | over |  |
| Hunter's Focus | 1 AP | daily | 1.2 | 1.2 | 0.21 | under |  |
| Deadeye | 1 AP | daily | 13.2 | 13.2 | 2.27 | on target | Prone: 2.82 (positions) |
| Rain of Arrows | 2 AP | daily | 23.5 | 11.7 | 2.02 | on target | Prone: 2.82 (positions) |
| Killer's Focus | Passive | rung 1 | | | 0.60 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.4-0.6 |
| Harrying Shots | Passive | | | | | not modeled | positional or conditional (Vanish, Sure Step, Harrying Shots, Staggering Shot: see the Bestiary's steps) |
| Vanish | Passive | | | | | not modeled | positional or conditional (Vanish, Sure Step, Harrying Shots, Staggering Shot: see the Bestiary's steps) |
| Hunter's Edge | Passive | rung 2 | | | 0.44 AP a turn | under | the fight measure (section 4 or 6) against the rung's 0.6-0.8 |
| Sure Step | Passive | | | | | not modeled | positional or conditional (Vanish, Sure Step, Harrying Shots, Staggering Shot: see the Bestiary's steps) |
| Finisher | Passive | rung 3 | | | 0.78 AP a turn | on target | the fight measure (section 4 or 6) against the rung's 0.8-1 |
| Staggering Shot | Passive | | | | | not modeled | positional or conditional (Vanish, Sure Step, Harrying Shots, Staggering Shot: see the Bestiary's steps) |
| Deathmark | 2 AP | encounter, Escalation 3 | 14.4 | 7.2 | 1.24 | under |  |
| Open Season | 2 AP | encounter, Escalation 3 | 8.1 | 4.0 | 0.69 | under |  |

Hunter's Focus, Deathmark's Boon and chain shot, Open Season's allies' dice and Beacon's step are priced by the static list only once or not at all: read their rows as floors.
The ledger is a price check, not the design: a card the ruler calls under may be carrying a Push, a condition or a trigger the open field doesn't see (Rebuke, Beacon, Sure Step).

(1.4 minutes.)