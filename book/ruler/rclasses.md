# Pack R-classes: the rebuilt Paladin and Archer under pack R's rules

Written by `node book/ruler/rclasses.mjs`; don't edit, run it again. Read by `book/rules-backlog.md` (pack R-classes) and the class documents' design notes.

Runs: 800 fights a measurement. **The party:** the R builds of `rework/` (a Smite Paladin, a Lay On Hands Paladin, a Double Shot Archer, a Rolling Shot Archer), level 1, Human, high on Vigor (the Paladin 23 / 12 = 35 Health, the Archer 19 / 10 = 29; Rally Points = Rally + 1). **The rules:** every piece of the rework as decided (rework-r.md section 14): 4 + 1 AP, Escalation as a level from 1 (Momentum 2 in half the fights) with the Critical hook and the class hooks (the Paladin's Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down), Guard 2 per unspent AP (it can still pay a Reaction), the NPC Specials (a Standard's 2 AP Special × 2.2 once a round), Opportunity Attack without the disrupt, and the fit of item 3 (NPC Health × 1, the Basic attack tables × 0.6). **The fight:** 4 Standards (CV 4, the "normal" fight: the target is about a quarter of the party's Health in 3.5 rounds, a Down in about 1 fight of 9). 1 AP = 5.8 DE.

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
| 4 Standards (normal) | 3.7 r · 8% · Down 13% · won 100% | 309.6 · 47.6 | 0.49 / 0.90 / 1.75 | 91.7 · 0.71 · 0.0 · 0.0 · 0.0 | 19.2 · 2.81 · 20.2 · 25.5 · 5.1 |
| 6 Standards (hard) | 5.7 r · 25% · Down 44% · won 91% | 441.6 · 113.1 | 0.47 / 0.82 / 3.27 | 127.6 · 1.33 · 0.0 · 0.0 · 0.0 | 38.4 · 4.65 · 33.4 · 48.9 · 21.0 |
| 2 Elites + 2 Standards (deadly) | 5.6 r · 16% · Down 29% · won 96% | 438.9 · 81.8 | 0.48 / 0.85 / 3.29 | 125.8 · 1.29 · 0.0 · 0.0 · 0.0 | 31.0 · 4.18 · 32.5 · 39.4 · 14.4 |

For scale, the decision sheet's row with the P1 builds at the same fit (rework-sheet.md section 5): 3.5 r · 25% · Down 18% · won 100%.

## 3. The Hallmark Reactions (both Paladins with the Reaction named; the Archers keep Quick Draw)

**Worth** = what the Reaction itself did a fight (its damage, what its block took off, the Guard its rest gave that was used) per Paladin turn, in DE and AP. A Turn Reaction fires once per NPC turn, a Round one once a round.

| Paladins' Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · Guard used · damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |
|---|---|---:|---|---|
| None | 3.8 r · 15% · Down 22% · won 99% | 0.00 | 0.0 · 0.0 · 0.0 | 0.00 · 0.00 |
| Opportunity Attack (the basic Reaction) | 3.6 r · 15% · Down 20% · won 100% | 0.93 | 0.0 · 0.0 · 6.3 | 2.16 · 0.37 |
| Shield of Faith (1R, Turn: 2d6 + [PMod]) | 3.6 r · 5% · Down 8% · won 100% | 2.51 | 17.2 · 0.0 · 0.0 | 5.46 · 0.94 |
| Rebuke (1R, Round, Trigger: an enemy in your Reach Strikes an ally: Appeal Save; 1d8 Ho, Pushed 2, Frightened / 1d6 Ho, Pushed 1 / nothing) | 3.7 r · 14% · Down 20% · won 100% | 0.76 | 0.0 · 0.0 · 2.3 | 0.75 · 0.13 |
| Rebuke with the trigger within 5 squares (not the card) | 3.6 r · 14% · Down 17% · won 100% | 1.99 | 0.0 · 0.0 · 6.1 | 2.02 · 0.35 |
| Bulwark of Faith as it was (1R, Round, ally only; an Encounter Pick since part 3) | 3.7 r · 7% · Down 11% · won 100% | 1.68 | 12.5 · 1.2 · 0.0 | 4.36 · 0.75 |

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
| Divine Surge (1) | smite | 4 Standards | 3.7 r · 7% · Down 11% · won 100% | 10.8 | 3.37 · 0.58 | 3.37 · 0.58 |
| Font of Mercy (1) | hands | 4 Standards | 3.6 r · 9% · Down 13% · won 100% | 3.6 | 1.18 · 0.20 | 1.18 · 0.20 |
| Mending Light (2) | hands | 4 Standards | 3.6 r · 9% · Down 13% · won 100% | 9.8 | 3.18 · 0.55 | 3.78 · 0.65 |
| Hallowed Stance (3) | hands | 4 Standards | 3.6 r · 9% · Down 13% · won 100% | 5.5 | 1.79 · 0.31 | 3.31 · 0.57 |
| Divine Surge (1) | smite | 6 Standards (hard) | 5.7 r · 26% · Down 45% · won 89% | 13.7 | 3.21 · 0.55 | 3.21 · 0.55 |
| Font of Mercy (1) | hands | 6 Standards (hard) | 5.6 r · 31% · Down 49% · won 86% | 9.3 | 1.99 · 0.34 | 1.99 · 0.34 |
| Mending Light (2) | hands | 6 Standards (hard) | 5.6 r · 31% · Down 49% · won 86% | 17.3 | 3.70 · 0.64 | 4.12 · 0.71 |
| Hallowed Stance (3) | hands | 6 Standards (hard) | 5.6 r · 31% · Down 49% · won 86% | 21.8 | 4.67 · 0.80 | 6.44 · 1.11 |

Font of Mercy adds to the Rally Points used in the fight: the ruler's Lay On Hands spends one only on an ally hurt at least three quarters of what it heals, so in a normal fight it hardly fires (the Standard day's between-fight Rally Points, where it also works, are not in these numbers).

## 5. The Apex (the fight with and without the Apex turn)

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Party taken with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Final Verdict (2 AP) | smite | 4 Standards | 3.7 r · 8% · Down 13% · won 100% · 3.7 r · 7% · Down 10% · won 100% | 91.7 · 89.1 | 47.6 · 47.8 | 0.95 | 2.9 · 1.5 |
| Hallowed Dawn (3 AP) | hands | 4 Standards | 3.7 r · 8% · Down 13% · won 100% · 3.6 r · 9% · Down 13% · won 100% | 19.2 · 26.1 | 47.6 · 45.5 | 0.89 | -4.1 · -1.4 |
| Final Verdict (2 AP) | smite | 6 Standards (hard) | 5.7 r · 25% · Down 44% · won 91% · 5.8 r · 28% · Down 49% · won 88% | 127.6 · 119.6 | 113.1 · 120.1 | 0.90 | 16.6 · 8.3 |
| Hallowed Dawn (3 AP) | hands | 6 Standards (hard) | 5.7 r · 25% · Down 44% · won 91% · 5.6 r · 31% · Down 49% · won 86% | 38.4 · 43.1 | 113.1 · 115.9 | 0.90 | 10.4 · 3.5 |

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
| None | 4.0 r · 8% · Down 14% · won 100% | 0.00 | 0.0 · 1.9 · 93.3 | 0.52 · 0.09 |
| Opportunity Attack (the basic Reaction) | 4.0 r · 8% · Down 14% · won 100% | 0.00 | 0.0 · 1.9 · 93.3 | 0.52 · 0.09 |
| Quick Draw (the sheet's stand-in: an enemy within 5 squares moves closer) | 3.7 r · 7% · Down 11% · won 100% | 1.54 | 10.7 · 1.7 · 95.3 | 3.76 · 0.65 |
| Overwatch (1R, Turn: an enemy within 10 squares makes a Strike) | 3.5 r · 9% · Down 12% · won 100% | 3.05 | 20.6 · 1.6 · 99.0 | 7.19 · 1.24 |
| Ready Shot (1R, Round: an enemy within 10 squares makes a Strike: 1 AP less on your next turn's first Shot) | 3.9 r · 8% · Down 13% · won 100% | 3.01 | 0.0 · 1.8 · 97.0 | 1.57 · 0.27 |
| Call the Shot (considered: an ally damages your Quarry: Vulnerable 1 until your next turn) | 4.0 r · 8% · Down 13% · won 100% | 1.96 | 0.0 · 2.9 · 91.8 | 0.82 · 0.14 |
| Ready Shot by the turn tables (the 5 AP turn over the 4 AP turn at Escalation 3: 30.5 − 27.8, × 0.76 fires an Archer turn) | | | | 2.04 · 0.35 |

Ready Shot's AP is spent on a 5 AP turn (Double Shot 3 or Rolling Shot 3, Lock & Loose, a Weapon Attack); its worth is the Archer's damage over the row with no Reaction (a fight to the death caps it: the NPCs' Health). Open Season's Vulnerable lasts until the end of the Archer's next turn, as the card says.

| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |
|---|---|---|---|
| Killer's Focus (1) | double | 28.6 · 25.1 | 3.47 · 0.60 |
| Hunter's Edge (2) | double | 31.2 · 28.6 | 2.57 · 0.44 |
| Finisher (3) | double | 35.7 · 31.2 | 4.51 · 0.78 |

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Its Vulnerable's extra with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Deathmark (2 AP) | double | 4 Standards | 3.7 r · 8% · Down 13% · won 100% · 3.7 r · 7% · Down 10% · won 100% | 110.8 · 105.4 | 0.0 · 0.0 | 0.98 | 3.8 · 1.9 |
| Open Season (2 AP) | rolling | 4 Standards | 3.7 r · 8% · Down 13% · won 100% · 3.7 r · 8% · Down 12% · won 100% | 88.0 · 90.3 | 3.7 · 0.0 | 0.99 | -1.3 · -0.7 |
| Deathmark (2 AP) | double | 6 Standards (hard) | 5.7 r · 25% · Down 44% · won 91% · 5.8 r · 26% · Down 46% · won 89% | 150.0 · 145.9 | 0.0 · 0.0 | 0.96 | 6.4 · 3.2 |
| Open Season (2 AP) | rolling | 6 Standards (hard) | 5.7 r · 25% · Down 44% · won 91% · 5.8 r · 29% · Down 48% · won 87% | 125.6 · 128.9 | 3.3 · 0.0 | 0.96 | 4.3 · 2.1 |

Deathmark's Boon against the Quarry and its chain shot on a kill are not modeled (a floor); Open Season's allies' extra [V] 1d6 Pi is not modeled either, (a floor). Hunter's Edge's Cover part (about 1.5 DE a turn: positions) is not in the turn table.

(1.3 minutes.)