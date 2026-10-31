# D2: Weapon Mastery, Weapon Groups and Gear (prep document, 2026-10-31)

> **Status: the defaults of section 7 are written into the book** (15-gear.md, 07-traits.md, 09-glossary.md), as Lucas asked ("run D2, prep
> document first"); answer by exception ("all defaults except 3") and I revert or change only those. The numbers: `book/ruler/catalogue/gear-d2.txt`
> priced by `node book/ruler/econ.mjs` (section "The weapons and Weapon Techniques of D2" of `book/ruler/prices.md`). Foundry follows in **X**
> (the new weapons, groups and the Mastery ladder); the hand names (question 5) are used now by **W** (v0.0.208).

What D2 had to decide (MASTER-PLAN, the Mastery note in rules-backlog.md, archer-a1.md section 8, progression-lv.md):
per-weapon Mastery (Lucas: "Dagger 3, Knuckle Dagger 5"), Weapon Groups with a 1/3 head start, 1 Mastery per group per combat, what 8 and
15 Mastery unlock, where LV's "Mastery 2[W] at level 8" lives, firearms as their own property (Firearm, trait [Gun]; decided 2026-10-29),
and the weapon list itself (the book had only the Greatsword, the Crossbow and Fists).

## 1. How fast Mastery comes (the dice math, calc.mjs)

A level 1 PC (Weapon Modifier +2) against Defense 13: Tier 1 28%, Tier 2 45%, **Tier 3 27%** (23% with 1 Bane, 20% with 2). A weapon user
makes about 3 weapon rolls a turn (a Technique or Smite and two Weapon Attacks, the At-will Banes on the later ones), 8 to 11 a fight
(3.5 to 4.2 rounds, fewer when it moves).

| | Tier 3s a fight | Mastery a fight |
|---|---:|---:|
| No cap (every Tier 3) | 2.0 to 2.7 | 2.0 to 2.7 |
| **1 per weapon group per combat** (Lucas) | 2.0 to 2.7 | **0.90 to 0.95** (the chance of at least one Tier 3) |

Fights to reach a step with your main weapon (a Standard day is 4 fights):

| Step | With the cap | Without |
|---|---:|---:|
| 3 (a common weapon's Technique) | 3 to 4 (day 1) | 1 to 2 |
| 4 | 4 to 5 | 2 |
| 5 (an exotic weapon's Technique) | 5 to 6 (day 2) | 2 to 3 |
| 8 | 8 to 9 (day 2 to 3) | 3 to 4 |
| 15 | 16 to 17 (day 4 to 5) | 6 to 7 (day 2) |

**What it means:** with the cap, Mastery counts the fights you fought with a weapon, almost exactly (a fight without a Tier 3 is rare). The cap
is what makes 15 a real milestone (about four days of adventuring) instead of something every PC has by day 2. It also stops a [Strike]-heavy
turn (Double Shot, three Weapon Attacks) from leveling faster than a slower weapon user: the Archer and the Paladin gain at the same pace.
Levels take a GM-chosen number of days, so a level 3 or 4 PC normally has 15 with the weapon it uses most; **Mastery doesn't track level**,
which is why the step that adds damage (15) waits for level 8 (section 3).

## 2. Per-weapon Mastery and Weapon Groups

**Each weapon says the Mastery its Weapon Technique needs** (a new column, "Mastery", in the weapon tables): **3** for common weapons,
**4** for specialist ones (they do something the common ones don't: reach, range, a hand crossbow), **5** for exotic ones (Musket,
Knuckle Dagger). Fists have no Technique (Unarmed Talents give their Actions). With the cap that is 3 to 6 fights.

**Weapon Groups** (8): Blades, Axes, Hammers, Polearms, Bows, Crossbows, Firearms, Unarmed. Each weapon is in one group.
**Your Mastery with a weapon is at least a third of your highest Mastery with a weapon of its group** (rounded down): with a Greatsword at 15, a
Dagger and a Longsword (Blades) count 5. Gaining Mastery with the
weapon adds to that third (the Longsword at 5 gains its first point and is at 6). Written as a floor, not "starts with": nothing to note when
you pick a weapon up, and a group weapon follows your best one as it grows.

| Best in the group | The others count | So |
|---:|---:|---|
| 3 to 8 | 1 to 2 | no head start worth a Technique yet |
| 9 to 11 | 3 | the common weapons of the group have their Technique |
| 12 to 14 | 4 | the specialist ones too |
| 15 and up | 5 | every Technique of the group |

**1 Mastery per weapon group per combat:** the first Tier 3 in an encounter with a weapon of a group gives it 1 Mastery; nothing else in that
group gains in that encounter (a Dagger and a Longsword used in the same fight: only the first one that gets a Tier 3). Another group can
still gain (a Longsword and a Crossbow: 1 each). Only in an encounter (Foundry already does it since v0.0.189).

## 3. What 8 and 15 unlock

LV decided "Mastery 2[W] at level 8 (+1 die on the Actions that deal [W]), a Talent or a class Feature, D2 decides which", and "no sustained growth
inside a Stage". With the cap 8 Mastery comes at day 2 or 3 (inside Stage 1), so **8 can't add damage**; 15 comes before level 8 for a
weapon you use, so it can be the gate of the level 8 step.

| Mastery | Name | You unlock | Worth |
|---|---|---|---|
| The weapon's (3 / 4 / 5) | | Its **Weapon Technique** | 1.0 to 1.4 of a 1 AP Round Action (section 5) |
| **8** | **Expert** | **Once each turn, you draw, stow or change the grip of the weapon without the Interact Action.** | 1 AP saved in the turns you switch weapons or regrip (a Two-handed weapon after a Handle Action, a thrown Dagger and a drawn Longsword): no damage on a normal turn |
| **15** | **Master** | **From level 8, your Actions that deal [W] with it deal one more [W]** (1[W] becomes 2[W]). | LV's 2[W]: +31% of a weapon user's fight, measured in pack LV; the casters' match is Spell Mastery (D4) |

**Why a Gear rule and not a class Feature:** every class that uses weapons gets it at the same level (LV's model A has it for every weapon
user), it ties the level 8 step to the weapon you have used (a PC who switches weapons at level 8 has to earn it again, or has a third of it in
the group), and no class level list needs a line for it. A caster with a weapon at 15 gets it too: rare (casters spend their turns on spells),
and their [W] is a small part of their damage.

**Alternatives I didn't take:** an Advanced Technique per weapon at 8 (a second card for 17 weapons, and damage inside Stage 1); a reroll of a
Tier 1 once an encounter at 8 (+5% damage inside Stage 1, against LV); 2[W] as a class Feature at level 8 (it would ignore Mastery entirely).

## 4. The weapon list (damage by hands; the dice math at Defense 13, Modifier +2)

A Weapon Attack's worth by how many hands the weapon takes, so a weapon is a sidegrade of the others of its size:

| Size | Weapon Attack (DE) | Examples | What pays for the difference |
|---|---:|---|---|
| Two-handed | 5.4 to 5.5 | Greatsword 1d8 / 2d6, Greataxe 1d6 / 2d8, Maul 1d4+2 / 1d10+2, Crossbow 1d4+2 / 1d10+2 | both hands: no Handle Action without Release, no second weapon |
| One-handed | 4.5 | Longsword 1d6 / 1d10, Mace 1d4+1 / 1d8+1, Pistol 1d4 / 2d6 | a free hand (Handle, a second weapon, a shield later) |
| Light or Thrown | 3.8 | Dagger, Handaxe, Spear 1d4 / 1d8 | Thrown (a melee and a ranged weapon in one hand) |
| Reach or Range | 4.5 | Pike (Range 3, Long), Shortbow, Longbow | where you can hit from |
| Barehanded | 3.5 | Knuckle Dagger 1d4 / 1d6 | it uses no hand and can't be disarmed |

The full list (Tier 1 is 0 for every weapon, as today):

| Group | Weapon | Properties | Type | Range | Damage T2 / T3 | Mastery | Technique |
|---|---|---|---|---|---|---:|---|
| Blades | Dagger | Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | 1d4 / 1d8 | 3 | Stick and Slip |
| Blades | Longsword | Melee | Slash | 1 | 1d6 / 1d10 | 3 | Guarded Cut |
| Blades | Greatsword | Melee, Two-handed | Slash | 1 | 1d8 / 2d6 | 3 | Reaping Sweep (kept) |
| Axes | Handaxe | Melee, Thrown | Slash | 1, Thrown 4 / 8 / 12 | 1d4 / 1d8 | 3 | Hooking Chop |
| Axes | Greataxe | Melee, Two-handed | Slash | 1 | 1d6 / 2d8 | 4 | Rending Chop |
| Hammers | Mace | Melee | Blunt | 1 | 1d4+1 / 1d8+1 | 3 | Ringing Blow |
| Hammers | Maul | Melee, Two-handed | Blunt | 1 | 1d4+2 / 1d10+2 | 4 | Bowl Over |
| Polearms | Spear | Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | 1d4 / 1d8 | 3 | Lunge |
| Polearms | Pike | Long, Melee, Two-handed | Pierce | 3 | 1d6 / 1d10 | 4 | Keep Them Off |
| Bows | Shortbow | Projectile, Ranged, Two-handed | Pierce | 8 / 16 / 32 | 1d6 / 1d10 | 3 | Skirmish Shot |
| Bows | Longbow | Projectile, Ranged, Two-handed | Pierce | 15 / 30 / 60 | 1d4+1 / 1d8+1 | 4 | Heartseeker |
| Crossbows | Hand Crossbow | Projectile, Ranged, Reload | Pierce | 6 / 12 / 24 | 1d4 / 1d8 | 4 | Sting |
| Crossbows | Crossbow | Projectile, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | 1d4+2 / 1d10+2 | 3 | Lock & Loose (kept) |
| Firearms | Pistol | Firearm, Ranged, Reload | Pierce | 5 / 10 / 20 | 1d4 / 2d6 | 4 | Point Blank |
| Firearms | Musket | Firearm, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | 1d4 / 2d8 | 5 | Thunderclap |
| Unarmed | Fists | Barehanded, Melee, Non-threatening | Blunt | 1 | 1 / 1d4 | - | none |
| Unarmed | Knuckle Dagger | Barehanded, Melee | Pierce | 1 | 1d4 / 1d6 | 5 | Gut Punch |

- **Firearms** (decided 2026-10-29): the property **Firearm** ("it shoots with powder: a pistol, a musket"), **not Projectile**, so [Shot] Actions
  and every Archer card can't use them; the trait **[Gun]** is for Actions that need a Firearm, and a Weapon Action with a Firearm is a [Gun]
  Action (as Shot is with a Projectile weapon). Guns are swingy (small Tier 2, big Tier 3) and Reload; the Musket is exotic (5).
- **The Knuckle Dagger** is Lucas's example of a weapon with a higher Mastery (5): Barehanded like Fists, so it costs damage.
- **Unarmed:** the Fists count for the group (a Tier 3 with them gives Unarmed Mastery), so a brawler's Knuckle Dagger comes with a head start.

## 5. The Weapon Techniques (priced: prices.md, "The weapons and Weapon Techniques of D2")

All are 1 AP, Round, Tier 1 [B] [Mod] (as Reaping Sweep and Lock & Loose), the weapon's dice on Tier 2 and 3, and one effect. The band for a
Round Action is an efficiency of 1.0 to 1.3 (1 AP = 4.66 DE).

| Technique | Weapon | Effect | DE | Efficiency |
|---|---|---|---:|---:|
| Reaping Sweep | Greatsword | Cleave 1 / 2 (kept) | 6.4 | 1.37 |
| Stick and Slip | Dagger | Tier 2 and 3: you can Evade 1 after the attack | 5.9 | 1.27 |
| Guarded Cut | Longsword | Tier 3: +1 Armor Defense for 1 round | 5.4 | 1.15 |
| Hooking Chop | Handaxe | Tier 2 and 3: Pulled 1 | 5.2 | 1.11 |
| Rending Chop | Greataxe | Tier 3: Vulnerable 1 (EoT) | 6.3 | 1.36 |
| Ringing Blow | Mace | Tier 3: its next [Strike] Action before the end of its next turn takes 1 Bane | 5.3 | 1.13 |
| Bowl Over | Maul | Tier 3: Prone | 6.4 | 1.37 |
| Lunge | Spear | +1 Range for this attack; Tier 3: Hindered (EoT) | 4.7 + reach | 1.02 + |
| Keep Them Off | Pike | Tier 2: Pushed 1; Tier 3: Pushed 2 | 5.7 | 1.23 |
| Gut Punch | Knuckle Dagger | Tier 2 and 3: Hindered (EoT) | 5.1 | 1.10 |
| Skirmish Shot | Shortbow | Tier 3: you can Evade 1 after the attack | 5.6 | 1.21 |
| Heartseeker | Longbow | Tier 3: Vulnerable 1 (EoT) | 5.4 | 1.16 |
| Sting | Hand Crossbow | Tier 3: Hindered (EoT) | 4.7 | 1.02 |
| Lock & Loose | Crossbow | Hindered / Immobilized (kept) | 6.2 | 1.34 |
| Point Blank | Pistol | No Bane for being Engaged; Tier 3: Pushed 1 | 5.3 + | 1.13 + |
| Thunderclap | Musket | Tier 3: Prone | 5.9 | 1.26 |

The two-handed ones sit at the top of the band, like the two kept ones (a Two-handed weapon pays with both hands). Lunge's extra Range and
Point Blank's missing Engaged Bane are not priced (positions): both are a little better than the number says.

## 6. Hands: main hand and off hand (for W)

The fewer-clicks pack (W) wants a Main-hand and an Off-hand button. **Default: the book names the hands and gives them no rule:** "Your two
hands are your main hand and your off hand. Which hand holds a weapon changes nothing, unless a feature says so." A future dual-wielding
Talent can say "a Weapon Attack with your off-hand weapon" without a new rule, and Foundry remembers which hand holds what (W). The other
option, an off-hand Bane on [Strike] Actions unless the weapon is light, adds a rule and a property for something the 3 Strikes a turn already
limits; I'd keep it for a Talent tree.

## 7. Decision sheet (my defaults are written into the book)

1. **The Mastery ladder:** each weapon's Technique at its own Mastery (3 common, 4 specialist, 5 exotic), **Expert at 8, Master at 15**? **[yes]**
2. **Expert (8)** draws, stows or regrips the weapon once a turn without Interact (no damage, so Stage 1 stays flat), and **Master (15)** is LV's
   2[W] from level 8, as a Gear rule (not a class Feature)? **[yes]**
3. **Weapon Groups:** the 8 groups of section 4; your Mastery with a weapon is at least a third of your best in its group (rounded down);
   **1 Mastery per group per encounter**? **[yes]**
4. **The weapon list:** the 17 weapons and 14 new Techniques of sections 4 and 5, damage by hands, firearms with the Firearm property and the
   [Gun] trait? **[yes]**
5. **Main hand and off hand:** names only, no rule (W uses them in Foundry)? **[yes]**
6. **Armor stays to be decided** (shields, armor properties, named armors: its box in Gear stays; a shield needs the off hand, so it fits after W)? **[yes]**

## 8. Assumptions I made

- The Mastery a fight assumes 8 to 11 weapon rolls (the spec's typical turns); a support turn with Lay On Hands makes fewer, and gains Mastery a
  little slower (still about 0.85 a fight).
- Expert's "draw or stow" relies on Interact ("swap, grab, grip"): the book has no separate draw rule, so Expert is written on Interact.
- "Rounded down" for the third; and the third is a floor, gained Mastery adds on top of it.
- Weapon Technique names and Flavor lines are mine (Lucas doesn't write Flavor).
- Range of the thrown weapons 4 / 8 / 12 (as the Thrown property's example); the Shortbow 8 / 16 / 32, the Longbow 15 / 30 / 60, the
  Hand Crossbow 6 / 12 / 24, the Pistol 5 / 10 / 20, the Musket as the Crossbow.
- The Greatsword and the Crossbow keep Mastery 3 (Foundry's Starting Mastery of Sharpshooter, 3, still unlocks Lock & Loose).
- Nothing changes in Foundry for Mastery until X: today it still keys Mastery by the weapon's "Mastery group" field (the kind of weapon) and has the
  3 / 8 / 15 steps; X adds the group, the per-weapon threshold, the cap per group and the 17 weapons.

## 9. Not measured

Expert's AP saving (it depends on how often a PC switches weapons); the reach of Lunge and the Pike and Point Blank's Engaged Bane; Firearms
against an NPC's Cover; how many days a level takes (the GM's), so the level at which a PC reaches 15 is an estimate.
