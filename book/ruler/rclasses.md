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
| 4 Standards (normal) | 3.5 r · 7% · Down 10% · won 100% | 304.6 · 42.9 | 0.48 / 0.94 / 1.58 | 92.4 · 2.22 · 0.0 · 0.0 · 0.0 | 17.2 · 2.52 · 17.8 · 24.0 · 4.0 |
| 6 Standards (hard) | 5.4 r · 25% · Down 43% · won 91% | 437.5 · 108.1 | 0.47 / 0.81 / 3.04 | 126.7 · 3.27 · 0.0 · 0.0 · 0.0 | 35.4 · 4.36 · 31.2 · 46.6 · 18.0 |
| 2 Elites + 2 Standards (deadly) | 5.4 r · 14% · Down 28% · won 96% | 435.3 · 79.6 | 0.48 / 0.87 / 3.19 | 130.7 · 3.19 · 0.0 · 0.0 · 0.0 | 28.3 · 4.09 · 30.9 · 39.3 · 13.5 |

For scale, the decision sheet's row with the P1 builds at the same fit (rework-sheet.md section 5): 3.5 r · 25% · Down 18% · won 100%.

## 3. The Hallmark Reactions (both Paladins with the Reaction named; the Archers keep Quick Draw)

**Worth** = what the Reaction itself did a fight (its damage, what its block took off, the Guard its rest gave that was used) per Paladin turn, in DE and AP. A Turn Reaction fires once per NPC turn, a Round one once a round.

| Paladins' Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · Guard used · damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |
|---|---|---:|---|---|
| None | 3.6 r · 14% · Down 17% · won 100% | 0.00 | 0.0 · 0.0 · 0.0 | 0.00 · 0.00 |
| Opportunity Attack (the basic Reaction) | 3.4 r · 14% · Down 20% · won 100% | 0.91 | 0.0 · 0.0 · 6.3 | 2.24 · 0.39 |
| Shield of Faith (1R, Turn: 2d6 + [PMod]) | 3.5 r · 4% · Down 6% · won 100% | 2.30 | 15.4 · 0.0 · 0.0 | 5.05 · 0.87 |
| Rebuke (1R, Turn, Trigger: an enemy within 5 squares Strikes an ally: Appeal Save; 1d8 Ho, Pushed 2, Frightened / 1d6 Ho, Pushed 1 / nothing) | 3.5 r · 12% · Down 17% · won 100% | 2.12 | 0.0 · 0.0 · 6.4 | 2.20 · 0.38 |
| Rebuke at Reach and Round (the first draft) | 3.5 r · 12% · Down 16% · won 99% | 0.70 | 0.0 · 0.0 · 2.1 | 0.70 · 0.12 |
| Bulwark of Faith as it was (1R, Round, ally only; an Encounter Pick since part 3) | 3.5 r · 7% · Down 10% · won 100% | 1.51 | 11.1 · 1.0 · 0.0 | 4.01 · 0.69 |

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
| Divine Surge (1) | smite | 4 Standards | 3.5 r · 7% · Down 11% · won 100% | 10.2 | 3.31 · 0.57 | 3.31 · 0.57 |
| Font of Mercy (1) | hands | 4 Standards | 3.4 r · 8% · Down 12% · won 100% | 3.4 | 1.18 · 0.20 | 1.18 · 0.20 |
| Mending Light (2) | hands | 4 Standards | 3.4 r · 8% · Down 12% · won 100% | 8.3 | 2.88 · 0.50 | 3.46 · 0.60 |
| Hallowed Stance (3) | hands | 4 Standards | 3.4 r · 8% · Down 12% · won 100% | 4.1 | 1.40 · 0.24 | 2.74 · 0.47 |
| Divine Surge (1) | smite | 6 Standards (hard) | 5.5 r · 26% · Down 47% · won 90% | 13.2 | 3.19 · 0.55 | 3.19 · 0.55 |
| Font of Mercy (1) | hands | 6 Standards (hard) | 5.4 r · 28% · Down 46% · won 90% | 8.9 | 1.96 · 0.34 | 1.96 · 0.34 |
| Mending Light (2) | hands | 6 Standards (hard) | 5.4 r · 28% · Down 46% · won 90% | 16.2 | 3.57 · 0.62 | 3.99 · 0.69 |
| Hallowed Stance (3) | hands | 6 Standards (hard) | 5.4 r · 28% · Down 46% · won 90% | 18.9 | 4.19 · 0.72 | 5.84 · 1.01 |

Font of Mercy adds to the Rally Points used in the fight: the ruler's Lay On Hands spends one only on an ally hurt at least three quarters of what it heals, so in a normal fight it hardly fires (the Standard day's between-fight Rally Points, where it also works, are not in these numbers).

## 5. The Apex (the fight with and without the Apex turn)

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Party taken with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Final Verdict (2 AP) | smite | 4 Standards | 3.5 r · 7% · Down 10% · won 100% · 3.5 r · 7% · Down 11% · won 100% | 92.4 · 89.2 | 42.9 · 43.0 | 0.93 | 3.6 · 1.8 |
| Hallowed Dawn (3 AP) | hands | 4 Standards | 3.5 r · 7% · Down 10% · won 100% · 3.4 r · 8% · Down 12% · won 100% | 17.2 · 23.3 | 42.9 · 42.5 | 0.86 | -1.2 · -0.4 |
| Final Verdict (2 AP) | smite | 6 Standards (hard) | 5.4 r · 25% · Down 43% · won 91% · 5.4 r · 26% · Down 44% · won 88% | 126.7 · 125.5 | 108.1 · 109.1 | 0.88 | 2.5 · 1.2 |
| Hallowed Dawn (3 AP) | hands | 6 Standards (hard) | 5.4 r · 25% · Down 43% · won 91% · 5.4 r · 28% · Down 46% · won 90% | 35.4 · 40.9 | 108.1 · 107.7 | 0.90 | 5.3 · 1.8 |

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
| None | 3.9 r · 7% · Down 14% · won 100% | 0.00 | 0.0 · 1.8 · 90.6 | 0.52 · 0.09 |
| Opportunity Attack (the basic Reaction) | 3.9 r · 7% · Down 14% · won 100% | 0.00 | 0.0 · 1.8 · 90.6 | 0.52 · 0.09 |
| Quick Draw (the sheet's stand-in: an enemy within 5 squares moves closer) | 3.7 r · 8% · Down 14% · won 100% | 1.62 | 11.4 · 1.8 · 95.8 | 3.99 · 0.69 |
| Overwatch (1R, Turn: an enemy within 10 squares moves closer to you; its Hindered and Critical Push not modeled) | 3.5 r · 7% · Down 10% · won 100% | 2.54 | 17.4 · 1.7 · 97.6 | 6.06 · 1.04 |
| Overwatch on a Strike trigger (the first draft) | 3.4 r · 8% · Down 10% · won 100% | 3.09 | 20.3 · 1.8 · 97.4 | 7.26 · 1.25 |
| Covering Shot (1R, Turn, Interrupt: a Strike would damage an ally within 10 squares: a Weapon Attack with 1 Boon; Tier 3 halves the ally's damage) | 3.4 r · 8% · Down 10% · won 100% | 2.80 | 20.2 · 1.9 · 98.0 | 7.85 · 1.35 |
| Ready Shot (dropped: 1 AP less on your next turn's first Shot) | 3.9 r · 7% · Down 12% · won 100% | 2.97 | 0.0 · 1.8 · 95.9 | 2.08 · 0.36 |
| Call the Shot (considered: an ally damages your Quarry: Vulnerable 1 until your next turn) | 4.0 r · 9% · Down 16% · won 100% | 1.94 | 0.0 · 3.0 · 92.0 | 0.84 · 0.15 |
| Ready Shot by the turn tables (the 5 AP turn over the 4 AP turn at Escalation 3: 30.5 − 27.8, × 0.76 fires an Archer turn) | | | | 2.04 · 0.35 |

Ready Shot's AP is spent on a 5 AP turn (Double Shot 3 or Rolling Shot 3, Lock & Loose, a Weapon Attack); its worth is the Archer's damage over the row with no Reaction (a fight to the death caps it: the NPCs' Health). Open Season's Vulnerable lasts until the end of the Archer's next turn, as the card says.

| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |
|---|---|---|---|
| Killer's Focus (1) | double | 28.6 · 25.1 | 3.47 · 0.60 |
| Hunter's Edge (2) | double | 31.2 · 28.6 | 2.57 · 0.44 |
| Finisher (3) | double | 35.7 · 31.2 | 4.51 · 0.78 |

| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Its Vulnerable's extra with · without | Apex turns a fight | Worth a use (DE) · per AP |
|---|---|---|---|---|---|---:|---|
| Deathmark (2 AP) | double | 4 Standards | 3.5 r · 7% · Down 10% · won 100% · 3.5 r · 7% · Down 10% · won 100% | 102.6 · 96.9 | 0.0 · 0.0 | 0.99 | 5.2 · 2.6 |
| Open Season (2 AP) | rolling | 4 Standards | 3.5 r · 7% · Down 10% · won 100% · 3.4 r · 8% · Down 11% · won 100% | 92.4 · 94.1 | 3.3 · 0.0 | 0.98 | 1.7 · 0.9 |
| Deathmark (2 AP) | double | 6 Standards (hard) | 5.4 r · 25% · Down 43% · won 91% · 5.4 r · 24% · Down 42% · won 91% | 142.0 · 141.8 | 0.0 · 0.0 | 0.96 | -0.0 · -0.0 |
| Open Season (2 AP) | rolling | 6 Standards (hard) | 5.4 r · 25% · Down 43% · won 91% · 5.5 r · 25% · Down 43% · won 91% | 133.4 · 137.3 | 3.4 · 0.0 | 0.96 | -2.4 · -1.2 |

Deathmark's Boon against the Quarry and its chain shot on a kill are not modeled (a floor); Open Season's allies' extra [V] 1d6 Pi is not modeled either, (a floor). Hunter's Edge's Cover part (about 1.5 DE a turn: positions) is not in the turn table.

(1.4 minutes.)