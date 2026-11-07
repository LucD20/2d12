# Pack R: the playtest 2 rework. Part 1: the numbers (2026-11-04)

**Status: DECIDED (Lucas, 2026-11-04: "all defaults except the ones we already fixed"): section 14 with its 14.3 revisions is pack R's spec. R-core is applied (2026-11-04, v0.0.233: the Core Rules, the species, the glossary, the pool rename; rules-backlog.md "PACK R-CORE APPLIED"); next: R-classes (the Paladin, then the Archer), R-bestiary, R-Foundry.** Part 1 (the numbers, sections 1-10), the core decisions (section 12) and the sheet (section 14; its numbers: `book/ruler/rework-sheet.md`, `node book/ruler/rework.mjs --sheet`). Nothing here is applied to rules-src or Foundry. The decisions this prepares were taken on 2026-11-02 (`book/playtest-2.md`, "Decisions"; rules-backlog.md "PLAYTEST 2: THE REWORK"); playtest 3 (`book/playtest-3.md`) is the baseline. Every table below is from **`book/ruler/rework.md`**, written by `node book/ruler/rework.mjs` (about 5 minutes; how it works: `book/ruler/README.md`, "The playtest 2 rework"). Short form: 4 AP = 4 AP + 1 Reaction AP; "the rework" = 4 AP for PCs and NPCs with Escalation as a level; "at its factors" = with the Health factors of section 3.

**How it was measured.** The spec ruler with the map model (positions, Cover, Flanking, Opportunity Attacks), level 1: 2 P1 Smite Paladins + 2 A1 Archers (Double Shot, and the same with Rolling Shot: each number is the mean of the two parties), the book's Health factor (Level + 17) / 16, half the fights starting with Momentum (1 Escalation). The 4 AP builds are `book/ruler/rework/*.txt`: today's cards with the turns cut to 4 AP and a Reaction each (the Paladin's Opportunity Attack, the Archer's Quick Draw as a stand-in for its Hallmark Reaction). The NPCs are the E3 Bestiary at level 1 (Medium, exact averages; the model's NPCs make their 2 Basic attacks a turn and keep 1 AP for moving; Specials are not simulated). What the model leaves out stays out: Body and Mind are one Health Pool for Down (but their damage is now counted apart for Bloodied / Strained), no NPC Specials, no walls.

## 1. The playtests against the ruler

Playtest 3's fight (Ogre Chieftain Elite, Orc Warrior Standard, Bandit Thug Grunt, 2 Goblin Sneaks Minions: CV 400) run 1,000 times in the ruler with today's rules and the P1 / A1 builds:

| | Rounds | PCs dealt a round | NPCs dealt a round | Party Health lost | A PC Down |
|---|---:|---:|---:|---:|---:|
| Playtest 3 (Lucas's table) | 4 | 62 | 36 | 143 of about 123, with the heals (one Down) | 1 of 4 |
| Playtest 2 | 4 | 63 | 47 | 188 of about 123 (three Down, 8 Rally Points) | 3 of 4 |
| The ruler, 2 Smite + 2 Double Shot | 3.7 | 81 | 18 | 34% | 36% |
| The ruler, Smite + Lay On Hands + Double + Rolling | 3.7 | 82 | 18 | 20% | 25% |
| The ruler, the rework at its factors (section 3), 2 Smite + 2 Double | 3.6 | 79 | 18 | 31% | 35% |

- **The PCs dealt three quarters of the ruler's number** (62 against 81): the playtest's builds are not the ruler's (a Dwarf Paladin with Holy Wrath and Aura of Protection, a Human Paladin on Appeal and Mind, two Rally turns, a turn on Aura), and the ruler's plan never wastes an AP. Normal.
- **The NPCs dealt twice the ruler's number** (36 against 18 a round). The ruler's NPCs have no Special Actions and no Weapon Attack; the playtest's used Brutal Swing, Low Blow, Dirty Trick, Ground Slam and Rally the Tribe every round (the Bestiary's Specials are × 1.4 to × 3.5 of a Basic attack, section 10), and the Ogre Chieftain is High in Body. **So the playtests are harder than the book's "a third of the Health" because the Specials are not in the ruler's calibration**, not because of the AP economy. Pack E3's refit was calibrated without them too (bestiary.md said so: "the sim ignores NPC special Actions"). This is the number to remember when the sheet sets the Health cut: the ruler's "a third" is a floor; a GM who uses the Specials as written gets about half.
- The rework at its factors gives the same fight as today (3.6 rounds, 31%): the rework doesn't change the balance by itself; what changes it is what the sheet decides about Specials and Health.

## 2. The AP cut: a turn at 4 AP against 5

Damage a turn against one creature at Defense 13, the plan's main turn, today's build against its 4 AP version (rework.md section 1 has every turn):

| Class | Today (5 AP) | At 4 AP | 4 AP / today | Today's Nova | 4 AP Nova | Nova ratio |
|---|---|---|---:|---|---|---:|
| Paladin (Smite) | Divine Surge + Smite 3 + 2 Weapon Attacks 21.3 | Divine Surge + Smite 2 + 2 Weapon Attacks 21.3 | **100%** | Holy Wrath 3 + Smite 2: 38.9 | Holy Wrath 3 + Weapon Attack: 32.9 | 85% |
| Paladin (Lay On Hands) | Lay On Hands 2 + 3 Weapon Attacks 20.8 | Lay On Hands 2 + 2 Weapon Attacks 16.7 | **80%** | 36.7 | Lay On Hands 2 + Holy Wrath 2: 27.2 | 74% |
| Archer (Double Shot) | Double Shot 3 + Lock & Loose + Pinning Shot 28.3 | Double Shot 2 + Lock & Loose + Pinning Shot 28.3 | **100%** | - | - | - |
| Archer (Rolling Shot) | Rolling Shot 3 + Lock & Loose + Pinning Shot 27.2 | Rolling Shot 2 + Lock & Loose + Pinning Shot 24.6 | **90%** | - | - | - |

**The 5th AP of today's main turns buys no damage.** Smite 3 is Smite 2 plus Guard 1d8 + [Mod]; Double Shot 3 is Double Shot 2 plus an Evade 1. Only Lay On Hands (three Weapon Attacks) and Rolling Shot (the bigger roll) lose a fifth or a tenth, and the Novas lose 15 to 25% (a 3 AP Encounter Action leaves 1 AP). In the fights (section 3) the cut shows where a PC moves: an AP spent on an Advance now drops a Weapon Attack (5.4) that the 5 AP turn absorbed; the party's damage a PC turn goes from 24.5 to 24.0 (−2%). **So "Health about −20%" is not what the fights need** (section 3): the cut in damage is 2 to 10%, and it is the Reaction AP and Escalation as a level that change the fights.

The exchange rate at 4 AP: the baseline turn stays 23.3 (the Bestiary's PC baseline at Defense 13), so **1 AP = 5.8 DE** (was 4.66); a Weapon Attack is still 5.4 (0.93 AP: At-will at 4 AP is a little under its band). Every price in prices.md (DE per AP) moves by ×0.8 when read in AP.

## 3. The fights rule by rule, and the Health factors

The CV 4 encounters (rounds · the party's Health lost · a PC goes Down · won), one piece of the rework added per column; the NPCs keep today's Health and damage:

| Encounter | Today | PCs 4 + 1 AP | + NPCs 4 + 1 AP | + Escalation as a level |
|---|---|---|---|---|
| 4 Standards | 3.5 r · 32% · Down 28% | 3.5 r · 32% · Down 26% | 3.5 r · 30% · Down 22% | 3.5 r · 29% · Down 22% |
| Elite + 2 Standards | 3.6 r · 34% · Down 34% | 3.7 r · 33% · Down 31% | 3.7 r · 32% · Down 28% | 3.6 r · 29% · Down 24% |
| 2 Elites | 3.7 r · 35% · Down 39% | 3.8 r · 37% · Down 40% | 3.8 r · 35% · Down 35% | 3.7 r · 31% · Down 29% |
| 8 Grunts | 3.8 r · 37% · Down 27% | 3.6 r · 34% · Down 20% | 3.5 r · 32% · Down 16% | 3.5 r · 30% · Down 15% |
| 2 Standards + 8 Minions | 4.1 r · 33% · Down 31% | 3.5 r · 27% · Down 17% | 3.5 r · 25% · Down 15% | 3.5 r · 23% · Down 14% |

- **4 + 1 AP alone changes nothing in rounds** (the cut is 2%) and makes the fights a little safer: the Reaction AP gives the party 4 to 5 Reactions a fight (24 damage: Opportunity Attacks on NPCs that walk past, Quick Draws on NPCs closing in), and Grunts and Minions, which walk more, pay for it.
- **NPCs at 4 + 1 AP** take 1 to 2 points off the Health lost: a Standard still strikes twice when it stands next to its target (its 2 Basic attacks are 2 AP), and loses more of a Strike when it has to walk two Advances.
- **Escalation as a level** takes 1 to 4 points more off and cuts the Downs against Elites by a quarter: Hallowed Stance is on from Escalation 2 (today it never is: Divine Surge spends it every round), Divine Surge still fires every round, Killer's Focus is on from round 2 or 3. The PCs' damage doesn't move (24.2 a turn): today's Actives are cheap (Divine Surge 0 AP, Pinning Shot 1 AP), so a level gives defense, not damage.

**The factors.** NPC Health × h for 3.5 rounds, then PC Health × p for a third of the party's Health (bisection; NPC damage stays):

| NPCs | NPC Health × h | PC Health × p | A Standard · the Paladin · the Archer | 4 Standards at these factors |
|---|---:|---:|---|---|
| 4 + 1 AP (the rework) | **0.98** | **0.84** | 61 · 35 · 23 (today 63 · 40 · 27) | 3.5 r · 32% · Down 31% · won 99% |
| 5 AP | 0.98 | 0.89 | | 3.4 r · 32% · Down 30% |

The 20% comes off the PCs, not the NPCs: NPC Health stays (the PCs' damage didn't drop), and the PCs need less Health because they take less (Reactions, Hallowed Stance, Divine Surge's Guard every round). **Note the Down rate:** at p 0.84 a PC goes Down in 31% of the normal fights (today 28%) and 42% against 2 Elites (39%); PC Health is the lever that moves Downs, so the sheet may prefer p about 0.9 and accept 30% lost. Fights by CV at the rework's factors (today in brackets): easy 2.6 r · 21% (2.6 · 20%), normal 3.5-3.7 · 32-36% (the same), hard 4.7 · 49% (4.8 · 48%), deadly 5.6-5.9 · 66-69%, won 67-73% (6.0-6.2 · 70-72%, 69-72%): the Bestiary's targets hold.

## 4. Escalation as a level

**Timing** (4 Standards at the rework's factors, half the fights with Momentum):

| Per PC | all fights | with Momentum (starts at 1) | without |
|---|---:|---:|---:|
| Fights with a turn at Escalation 1 or more · such turns a fight | 96% · 2.4 | 100% · 2.9 | 93% · 2.0 |
| Fights with a turn at Escalation 2 or more · such turns a fight | 87% · 1.4 | 96% · 1.9 | 78% · 1.0 |
| Fights with a turn at Escalation 3 · such turns a fight | **49% · 0.6** | **75% · 0.9** | **22% · 0.2** |

A PC's turns a fight at Escalation 0 / 1 / 2 / 3: 0.5 / 1.0 / 0.9 / 0.6 (today: 0.5 / 2.0 / 0.5 / 0.0: spending keeps everyone at 1). **An Encounter ability that needs Escalation 3 is used in half the fights: three quarters with Momentum, one in five without** (a 3.5-round fight reaches Escalation 3 in its 4th round when it starts at 0). A Round ability from Escalation 2 fires 1.4 times a fight, from Escalation 1 2.4. Momentum is what makes an Escalation 3 ability exist at levels 1-2; the sheet should say so when it writes Momentum into the book.

**What each Passive is worth** (the 4 AP main turn at Escalation 3, Defense 13; the defensive ones per fight):

| Passive (its level today) | Build | Worth | Share of a turn |
|---|---|---:|---:|
| Killer's Focus (2+) | Archer | +2.7 damage a turn | 11% |
| Radiant Zeal (1+) | Paladin | +3.5 damage a turn | 16% |
| Marked Quarry (a Feature: the Boon and the Tier 1 floor) | Archer | +3.9 damage a turn | 16% |
| Divine Surge (an Active, 1, Round, 0 AP) | Paladin | 5.3 allies' damage + 6.2 Guard used a fight | about 4 DE a turn |
| Hallowed Stance (2+) | Paladin | 2.2 damage reduced a fight | 0.8 a turn |
| Font of Mercy (1+, a Feature) | Paladin | 1.1 Health a fight | |
| Elusive (1+) | Archer | 0.7 damage a fight (0.6 Strikes take its Bane) | |

The Archer's Actives as a level (its damage a fight, 4 Standards): Pinning Shot every round from Escalation 2 72.8 (0.8 Immobilized a fight) · Twin Shot every round from Escalation 3 72.6 · Twin Shot once a fight (Encounter) 72.3 · neither (a Weapon Attack) 71.9. **The Actives are worth 1 to 2 damage a fight each: at 1 AP they are Weapon Attacks with a rider**, so making Twin Shot an Encounter ability loses nothing; the Escalation 3 abilities the rework wants can be bigger than today's Actives by a lot (budget: an Encounter band of 1.4 to 2.0 DE per AP at 5.8 DE an AP = 8 to 12 DE per AP, used 0.6 times a fight: about 5 to 7 DE a fight per AP, or 2 to 3 damage a turn for a 2 AP one).

## 5. The Reaction AP

4 Standards at the rework's factors, per fight:

| Reactions | rounds · lost · Down | Paladin: Reactions (damage) | Archer: Reactions (damage) | Blocked (both Paladins) | Party dealt · taken | Worth against none (DE a fight · a PC turn) |
|---|---|---|---|---:|---|---:|
| None | 4.0 r · 37% · Down 42% | 0 | 0 | 0 | 281 · 52 | |
| Opportunity Attack + Quick Draw | 3.5 r · 32% · Down 31% | 0.86 (4.7) | 1.22 (6.9) | 0 | 280 · 46 | 5.7 · 0.5 |
| Shield of Faith as a 1R block + Quick Draw | 3.4 r · 21% · Down 17% | 2.3 blocks | 1.39 (8.0) | 25.5 | 281 · 28 | 24.2 · 2.0 |

- **A Reaction AP with Opportunity Attack or Quick Draw is worth about half an AP a turn** (2.9 DE of a 5.8 DE AP): it fires once every one to two rounds, because NPCs don't move much once the lines meet. That is the price of "one basic Reaction for everyone": modest, and it is what makes 4 + 1 feel like 5.
- **Shield of Faith as a 1R Reaction blocks about 25 damage a fight for two Paladins** (12 each: a block every round, 1d8 + 2 = 6.5 a block): the fight costs the party 21% instead of 32%, and Downs drop from 31% to 17%. That is 3 to 4 times an Opportunity Attack and **about a Weapon Attack's worth of Health every round for 1R**: as the Paladin's Hallmark Reaction at today's dice it is too strong, or it is the whole reason a Paladin exists; the sheet decides its size (1d6, once a round is already the Turn Frequency) and whether Bulwark of Faith (Encounter) is the other choice.
- The Archer's Quick Draw stand-in: 1.2 to 1.4 a fight, 7 to 8 damage: a fair basic Reaction; its Hallmark Reaction can be stronger.

## 6. Overcast as the caster's Passive ladder

Pack LV's stand-ins (progression.mjs: a weapon user and a caster of the same budget; model A) at 4 AP with Escalation as a level: the weapon user's Surge (+1d8 on its next Strike) works every round from Escalation 1 and Killer from 2 (the Paladin's shape); the caster's first Bolt each round is Overcast up to its Escalation level, capped by the tier's limit (1 / 2 / 3). Damage a round at Defense 13, fight = rounds 1-3 + half of round 4:

| Level | Build | r1 | r2 | r3 | r4 | fight | caster / weapon |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 35.3 | 27.7 | 29.4 | 29.5 | 107.1 | |
| 1 | caster, Overcast up to the tier's limit (1) | 33.1 | 25.9 | 25.9 | 25.9 | 97.9 | 94% · 91% |
| 1 | caster, Overcast up to 3 (no tier limit) | 33.1 | 28.2 | 32.8 | 35.0 | 111.6 | 94% · 104% |
| 1 | caster, no Overcast | 33.2 | 21.4 | 21.6 | 21.2 | 86.8 | 94% · 81% |
| 5 | weapon user | 40.7 | 31.8 | 33.6 | 33.5 | 122.9 | |
| 5 | caster, limit 2 | 36.7 | 32.2 | 34.4 | 34.5 | 120.6 | 90% · 98% |
| 5 | caster, up to 3 | 36.8 | 34.5 | 36.7 | 39.0 | 127.5 | 91% · 104% |
| 8 | weapon user (2[W]) | 53.7 | 49.6 | 51.4 | 51.4 | 180.4 | |
| 8 | caster, limit 3, keep the best | 44.3 | 43.0 | 45.4 | 47.9 | 156.7 | 82% · 87% |

**Overcast as a ladder works:** capped by tier the caster is 91% / 98% / 87% of the weapon user over a fight (LV's check with spent Overcast gave 104% / 104% / 87%); a +1 die at Escalation 1 is the caster's "Surge". Without the tier cap a level 1 caster is ahead from round 3 (104%); the cap stays. Level 8 is low in both checks (the weapon user's 2[W] outgrows keep the best): a question for D4, not pack R. A caster's Escalation 3 ability ("Overcast past your limit once") would be worth about +1 die on one spell: 4 to 5 damage, small; it needs something else.

## 7. Bloodied and Strained as hooks

**The thresholds** (level 1):

| Creature | Body threshold | Mind threshold | Health | Bloodied at | Strained at |
|---|---:|---:|---:|---:|---:|
| Human Paladin (Body 2, Mind 1) | 22 | 18 | 40 | 55% in Body damage | 45% in Mind |
| Dwarf Paladin (Body 2, Mind 2) | 24 | 22 | 46 | 52% | 48% |
| Elf Paladin (Body 1, Mind 2) | 15 | 24 | 39 | 38% | 62% |
| Human Archer (Body 1, Mind 1) | 14 | 13 | 27 | 52% | 48% |
| Dwarf Archer (Body 1, Mind 1) | 16 | 12 | 28 | 57% | 43% |
| Elf Archer (Body −1, Mind 2) | **5** | 17 | 22 | **23%** | 77% |
| Minion · Grunt · Standard · Elite (Medium, Body High) | 4 · 16 · 35 · 73 | 3 · 12 · 28 · 59 | 7 · 28 · 63 · 132 | 55-57% | 43-45% |

**In the fights** (the rework at its factors; arrows and [W] dice are Body, Holy dice are Mind; an NPC's Basic attack is Body):

| NPC | Bloodied before dying (mean round) | Strained before dying (mean round) | Both | Dies (mean round) |
|---|---|---|---:|---:|
| Standard (in 4 Standards) | 93% (2.2) | 21% (1.4) | 14% | 2.4 |
| Standard (with an Elite) | 91% (1.6) | 28% (1.2) | 20% | 1.8 |
| Elite | 98% (2.7-3.2) | 5-8% (1.9-2.4) | 3-5% | 3.1-3.6 |
| Grunt | 90% (2.1) | 30% (1.5) | 20% | 2.1 |

| PC (4 Standards) | Bloodied by the end of round 1 / 2 / 3 | Turns while Bloodied | Mind share of its damage |
|---|---|---:|---:|
| Paladin | 17% / 32% / 34% (2 Elites: 18 / 40 / 47%) | 15% (19%) | 45% |
| Archer | 12% / 25% / 28% | 14% | 7% (Divine Surge's Holy on its hits) |

- **An NPC is nearly always Bloodied, about one round before it dies** (round 2.2 of 2.4): the party focuses one enemy, its Body threshold is 56% of its Health, and three quarters of the party's damage is Body. A "while Bloodied" hook on an enemy has a window of about one round; "when it becomes Bloodied" fires once per enemy, reliably. **Strained is rare** (5 to 30%, early when it happens: a Smite's Holy half lands on a fresh target): the Paladins alone push it, and only when both work on the same creature. For the rework's aim (reward hitting the weak pool) the numbers say: Strained needs more Mind damage in the party (a caster, or the Paladin's Holy riders) before "against a Strained target" is worth a card; today it is a Paladin-only hook that fires on one Standard in five.
- **PCs:** a Paladin takes a fifth of its turns Bloodied in a normal fight (a third against Elites), an Archer a sixth; the Elf Archer (threshold 5) is Bloodied by the first hit and stays so. Today's Banes (a Bane on [Weapon] Actions while Bloodied) would have cost the party about 10% of its Weapon damage on those turns; without them, Bloodied on a PC is free to be a trigger ("when you become Bloodied, once an encounter").

## 8. Slowed, Minions and the Specials at 4 AP

**Slowed** (paired fights with the same dice, the condition put on one creature at the start of round 2, 2 rounds measured; DE = damage dealt more + taken less):

| Condition | Today (5 AP) | 4 + 1 AP | AP taken, as a share of the turn |
|---|---:|---:|---|
| Slowed 1 on a Standard | 2.9 | 1.6 | 20% → 25% |
| Slowed 2 on a Standard | 5.7 | 6.3 | 40% → 50% |
| Slowed 1 on a Paladin (what it costs the party) | 4.8 | 4.8 | 20% → 25% |
| Slowed 1 on an Archer | 5.7 | 6.0 | |

Slowed 1 takes a quarter of a 4 AP turn instead of a fifth, but a Standard that doesn't move loses nothing (its 2 Basic attacks fit in 3 AP), so its measured price even drops (a 3 AP turn next to its target is a full turn); Slowed 2 bites harder (half the turn: one Basic attack when it moves). On a PC it is still about an AP (4 to 6 DE). **Slowed lowers the 4, not the Reaction AP** in these runs (the default); a Slowed creature keeps its Reaction.

**Minions** (2 Standards + 8 Minions at the rework's factors): 3 AP (today's) 3.5 r · 26% · Down 22%; 2 AP + 1 Reaction AP 3.5 r · 22% · Down 18%. A Minion's turn is move and strike: at 3 AP it strikes after up to two Advances, at 2 AP after one. 3 AP is three quarters of a Standard's turn now (three fifths today).

**The Special multipliers** (× 1.4 / 2.2 / 3.5 of the Basic attack for 1 / 2 / 3 AP): a Standard's full turn today is Basic + Basic (1 Bane) + a 2 AP Special + move = 4.1 Basic attacks; at 4 AP with a move it is 3.2 (−22%), without a move 4.1; a 3 AP Special is now the whole turn (3.5 against 4.5). The ruler's NPCs don't use Specials, so section 3's factors carry none of this: **the sheet chooses whether the multipliers stay (an AP is worth the same; NPC turns get 22% shorter when they move, as the PCs' do) or scale × 1.25 (1.75 / 2.75 / 4.4: the turn keeps its damage, and the playtests' "twice the ruler" NPC damage stays)**. Section 1 says the playtests were already harder than the ruler by the Specials' worth.

## 9. The Standard day (the heal loop)

The Double Shot party, 4 fights with no Rest (easy, normal, normal, hard), today against the rework at its factors:

| Rules | Day cleared | A PC Down in the day | Downs a day | Rally Points left | Health at the end | Fight 4 won |
|---|---:|---:|---:|---:|---:|---:|
| Today | 59% | 95% | 3.4 | 34% | 49% | 60% |
| The rework at its factors | 64% | 92% | 3.1 | 39% | 56% | 66% |

The same day, a little easier (the Reactions and Hallowed Stance); Rally Points last 4 fights in both. The playtests' heal loop (a Paladin spending 3 AP a turn on Lay On Hands) is not in these plans (no Lay On Hands in this party; the Lay On Hands Paladin heals an ally below 50%): the 4 AP economy makes a 3 AP heal three quarters of a turn, which is the lever against the loop, and section 2 shows the Lay On Hands Paladin paying 20% of its damage for it.

## 10. What the numbers say, in short

1. **4 + 1 AP costs today's main turns nothing** (the 5th AP bought Guard and an Evade), 10 to 20% on the support turns and Novas, 2% in the fights. The economy change is real for cards built on 5 AP (three Weapon Attacks, 3 AP Encounter Actions + a Strike), not for the main builds.
2. **The Health cut the fights need is PC Health × 0.84 and NPC Health × 0.98**, not −20% on both; the PC cut raises Downs from 28% to 31% a normal fight (39% to 42% against 2 Elites), so × 0.9 is the safer default. Either way the Bestiary's rounds and shares hold at every CV.
3. **The Reaction AP is worth about half an AP with a basic Reaction** (an Opportunity Attack or a Quick Draw once every one or two rounds), and **a 1R Shield of Faith every round is worth about an AP and halves the Downs**: the Hallmark Reactions need a budget (about 6 DE a fight for a basic one; a Hallmark one 10 to 15).
4. **Escalation as a level:** a PC acts at Escalation 3 in half the fights (three quarters with Momentum, one in five without); today's Actives are worth 1 to 2 damage a fight (Weapon Attacks with riders), so the Escalation 3 abilities can be big (5 to 7 DE a fight per AP); the Passives are worth 11 to 16% of a turn each (Killer's Focus, Radiant Zeal, Marked Quarry) or 1 to 2 damage a fight (Hallowed Stance, Elusive, Font of Mercy): the defensive ones are cheap today and can grow on the ladder.
5. **Overcast as a tier-capped ladder keeps the caster at 91 to 98% of the weapon user** at levels 1 and 5 (LV's target); level 8 is 87% in both models.
6. **Bloodied on an enemy comes a round before it dies; Strained comes in one fight of five**, from the Paladins only. The hooks should be "when it becomes" (fires once) rather than "while"; "against a Strained target" needs more Mind damage in the party to be worth a card.
7. **Slowed 1 at 4 AP is a quarter of a turn** but prices lower on a Standard (its 2 attacks fit in 3 AP); Slowed 2 is half a turn. Minions at 2 or 3 AP are both fine (3 is the Bestiary's three-quarters turn).
8. **The playtests' NPCs dealt twice the ruler's damage**: the Specials, which no calibration includes. The sheet's Special multipliers choice decides whether the book's "a third" is honest.

**Not measured, for the sheet to assume:** the Reaction AP spent on NPC Reactions other than Opportunity Attack (Hold the Line); the Specials; Bloodied / Strained phases of Elites; Mending Light and Harrying Shots (no ruler model); the Techniques (14 cards, 1 AP Round: unchanged by 4 AP except as a share of the turn); level 2-3 builds (the ruler's rework builds are level 1).

## 11. The decision sheet: what it had to decide (written as section 14)

What it has to decide, each with a default and the number behind it (sections above): (a) 4 AP + 1 Reaction AP: the wording (Chapter 2), unspent AP for more Reactions, Slowed on the 4 (section 8), Minions' AP (8), the Special multipliers (8, 1), Quickened; (b) the Health cut: p and h (section 3) and whether the class multipliers or the species values carry it; (c) one basic Reaction for everyone (5) and the Hallmark Reactions' budget: the Paladin's Shield of Faith size and Bulwark of Faith, the Archer's two; (d) Escalation as a level: the ladder (one Passive per level, which of today's at which level), the Escalation 3 abilities' size and count (4), Momentum's text, what happens to Divine Surge, Pinning Shot, Twin Shot, Vanish, Aura of Protection, Hand of Mercy (an Encounter or a Passive); (e) Overcast as the ladder (6) and D4's share; (f) Bloodied / Strained without Banes: the hook wording (7), Elite phases, "players always see it", the Elf Archer's threshold; (g) NPCs have no Weapon Attack: the book line; (h) what the 14 Techniques and the Talents with 5 AP assumptions (Whirlwind, Cut Through) need; (i) the playtest 4 plan.

**Lucas's inputs for the sheet (2026-11-04, after reading the numbers):**
1. **A Reaction must be worth at least 1 AP, more rather than less**: keeping it risks wasting the AP when the trigger never comes. The ruler's rule for the sheet: a Reaction's worth = its effect when it fires × how often it fires (a basic one fires 0.5-0.6 times a round: section 5), so a Reaction that fires every other round must do about 2 AP of work when it does (Shield of Faith as a block does: 2 AP a turn). **And the unused AP itself must not be a loss** (a friend's point): the sheet proposes a consolation for AP that end a turn-cycle unspent (a Boon on your first roll, an Evade 1, Guard, +1 Escalation...), priced so that AP kept + consolation is about 1 AP's worth.
2. **A standard encounter must be at least 75% in the players' favor**: the playtests' "normal" felt hard. The ruler's normal fight is won 99% but costs a third of the party's Health with a PC Down in 3 of 10 fights, and the real NPCs deal twice the ruler's damage (the Specials, section 1): the book's targets (a third, 3.5 rounds) are the sheet's to lower (about a quarter of the Health and a Down in 1 fight of 10 for "normal"), with the Specials put into the calibration (model a Standard's 2 AP Special as a once-a-round × 2.2 attack) before the Health factors are set.
3. **Ward Defense:** only Word of Radiance rolls against WD today (the Archer's Volley and Rain of Arrows are Instinct Saves; every NPC attack is against AD); the ruler models `vs wd` (the Power Modifier against the target's WD) but never used it in a fight, and the Bestiary's AD and WD tables are the same numbers, so nothing was measured. For the Strained hook (section 7) it matters: Mind damage will mostly come from [Power] Actions against WD; a PC's WD (11 + Power Modifier + ward: 13 for both classes) is 1 under the Paladin's AD 14, so an NPC Power attack is about 8% stronger against it. Pack R's Bestiary pass should give some example NPCs a Vs. WD Basic attack, and the ruler a `ranged`-like `power` tag for NPCs.

## 12. Decided after the numbers (brainstorm of 2026-11-04; Lucas's calls; nothing applied)

These replace the defaults the sheet would have proposed for the same items. The sheet (part 2) proposes defaults only for section 13.

1. **4 AP + 1 Reaction AP** stands. **Unspent turn AP become Guard:** flat **2 / 3 / 4 by Stage** per AP, it **adds** to Guard you already have (an exception to Stacking), it lasts until the start of your next turn; the Reaction AP never converts.
2. **A Reaction is worth at least 1 AP** (its effect × how often it fires: section 5); a basic Reaction for everyone; each class's Hallmark Reactions get a budget from that.
3. **A normal fight is at least 75% in the players' favor**; the NPCs' Special Actions go into the ruler's calibration; PCs are designed first, NPCs re-fitted after.
4. **Health, Option 1:** the class gives a **high and a low value and the player assigns them** to Vigor and Resolve; the species adds a flat bonus on its natural side (Human: chooses); **Attributes no longer add to Health**; growth **by Stage**; about **30 at level 1 and 60-70 at level 10**; the **65 / 35** norm (a wider class gap keeps a choice against the species' side at 60 / 40 or wider); a threshold never under a third of the pool, as a safety. Supersedes pack LV's ×1.5 and the (Level + 17) / 16 factor. Proposed values (the sheet checks them): Paladin 20 / 10 (+12 / 6 at Stage 2, +14 / 7 at Stage 3), Archer 16 / 8 (+9 / 5, +11 / 6); Human +3 / +2 on its high / low, Dwarf +4 Vigor / +1 Resolve, Elf +4 Resolve / +1 Vigor.
5. **Names:** the thresholds are **Vigor** (was the Body Damage Threshold) and **Resolve** (the Mind Damage Threshold); the pools are **Vigor damage [V]** and **Resolve damage [R]** (were Body [B] and Mind [M]), so no one confuses them with the Body and Mind Attributes. Bloodied (Vigor damage at your Vigor), Strained, Dominant Damage, Dying and Shattered unchanged. The cards' [B] / [M] are renamed in R-core, with the book's and Foundry's parsers reading both spellings through the transition.
6. **Stage is the number clock: numbers change at Stages, levels give options.** One Attribute of your choice +1 at each Stage; Modifiers +1 at Stage 3; **never above +4**; Checks use the raw Attribute (Chapter 5's +1 at level 5 / +2 at level 8 step is superseded). Guard, the Overcast limit, Momentum's start and Weapon Mastery (D2's levels 8 and 15) sit on Stages.
7. **No bloat** is the standing rule: flat accuracy and DCs, Health ×2 at most, dice capped (the Encounter and Daily ceilings: the sheet proposes them, section 13).
8. **Escalation:** a level, nothing spent; **the whole ladder at level 1** (one Passive per Escalation level, picked from the class list); the **Apex** = the class's Escalation 3 ability (Encounter, requires Escalation 3, a pick at level 1); **every fight starts at Escalation 1** (Momentum: 2); hooks: **a Critical** (Doubles on a Tier 3, or 20 over the DC) gives +1 Escalation **once an encounter**, plus **one hook written on each class** (Paladin: an ally within 5 squares becomes Bloodied or goes Down; Archer: your Marked Quarry goes Down); **Elites gain 1 Escalation at the start of each round from round 2**; **no meta currency**: a GM sidebar ("+1 Escalation to the table after a bad turn of the dice") is the only valve.
9. **Class structure:** level 1 = a Hallmark Action (a choice of two), a Hallmark Reaction (a choice of two), an Encounter Pick, the three Escalation Passives, the Apex; **a Talent every level** (bigger Talents at Stages); the Pick lists need not match between classes; **the classes are restarted from the Paladin** under these rules.
10. **Rally Points = the class's Rally value + Stage** (no Attribute term); each still heals a quarter of the pool.
11. From the numbers: hooks on an *enemy's* Bloodied / Strained are "when it becomes" (the window of "while" is about a round); a rider on your own Action may say "while" ("if the target is Strained, heal 2 more"); Overcast is the caster's Passive ladder, capped by Stage; Slowed lowers the 4, not the Reaction AP; Minions keep 3 AP; some NPCs attack Ward Defense (the Bestiary pass gives example NPCs Vs. WD Basic attacks; the ruler gets an NPC tag for it).

## 13. What the sheet (part 2) still proposes, with the ruler behind it (done: section 14)
The dice cut (the Encounter and Daily ceilings, or ×0.75 on everything; the re-priced healing cards against the new pools); the Hallmark Reactions' budget and Shield of Faith's size; the Special multipliers (keep, or ×1.25) with the Specials modeled; the normal-fight targets (a quarter, 30% or a third of the party's Health; a Down in 1 fight of 10; "between a true fight and a filler fight"); the Health values of item 4 checked at levels 1 / 5 / 8; the Talent cadence and what Stage levels give; the fate of today's Actives (Divine Surge, Pinning Shot, Twin Shot, Vanish, Aura of Protection, Hand of Mercy: Apex candidates, Encounter Picks or Passives); Momentum's text; Armor Training untouched; the migration of existing Foundry characters.

**The order after the sheet (2026-11-04):** Lucas answers by exception → R-core (the book's rules spine: Chapters 1, 2, 4, 5, 8, Escalation, species, glossary, the pool rename with both-spelling parsers) → R-classes, the Paladin, then the Archer → R-bestiary (Specials, Stage rows, Ward Defense, Elite Escalation, the difficulty table) → R-Foundry in two versions (the core; the cards and NPCs) → playtest 4 → the weapon line with Mastery on Stages. Suggested models: the sheet, the classes and the Bestiary calibration on Fable; R-core and R-Foundry on Opus with the sheet as the spec.

## 14. The decision sheet (part 2, 2026-11-04): answer by exception

**Lucas answers by exception** ("all defaults except 7 and 15"); each item has a default and the number behind it. Nothing here is applied. The numbers: **`book/ruler/rework-sheet.md`**, written by `node book/ruler/rework.mjs --sheet` (about 6 minutes; `--sheet --quick` about 2). The ruler now models, opt-in (spec.mjs `RULES`; report.md and rework.md unchanged): **the NPC Specials** (an NPC spends every AP left after moving on attacks: its 3 AP Encounter Special once (Elites), its Round Special once a round (Minions and Grunts 1 AP × 1.4, Standards and Elites 2 AP × 2.2), then Basic attacks with the At-will Bane, 3 Strikes at most; a Special is a single-target Strike with the multiplied damage, its condition or area counted as its damage's worth, as the Bestiary prices them); **the Stage Health line** (section 12.4: Human, high on Vigor: the Paladin 23 / 12 = 35, the Archer 19 / 10 = 29; Rally Points = Rally + Stage); **Escalation from 1** (Momentum 2, half the fights) **with the hooks** (a Critical, about 1 Tier 3 in 12; the Paladin's ally Bloodied or Down within 5 squares; the Archer's Marked Quarry Down; each once an encounter); **Guard from unspent AP** (2 an AP); **the two dice-cut shapes**. Not modeled: Elite Escalation, the Apex abilities (not designed), fights above level 1 (Stages 2 and 3 by arithmetic only), the Stage Modifiers (nothing moves at level 1), Bulwark of Faith as a Round Reaction, the Archer's real Hallmark Reactions (Quick Draw stays the stand-in).

### 14.1 What the new numbers say
1. **The Specials double the NPCs' damage** (sheet section 1): a Standard's turn is × 2.16 the Strikes the Bestiary was calibrated on (a Minion × 3.3, a Grunt × 1.7, an Elite × 1.5). With every piece of the rework and the Bestiary's numbers as they are, a normal fight (4 Standards) costs **56% of the party's Health, a PC goes Down in 71% of the fights and the party wins 86%**: that is playtest 3 (143 of about 123 Health, a Down). Section 1's "the ruler's a third is a floor" is confirmed.
2. **Escalation from 1 is the biggest single piece** (section 2): 30% → 25% of the Health, Down 24% → 17% (Hallowed Stance and Divine Surge from round 1, Killer's Focus from round 2). The Health line alone changes nothing at level 1 (the party has 128 Health against 134). A PC has a turn at **Escalation 3 in 80% of the fights** (85% with Momentum, 74% without; part 1: 52%), 1.7 such turns a fight: **the Apex is usable in four fights of five.** The hooks raise the Escalation 0.05 (Paladin) to 0.09 (Archer) times a fight for the Critical (it is usually at 3 already), 0.34 for the Paladin's, 0.6 for the Archer's.
3. **Guard from unspent AP is a consolation, never a plan** (section 4): the builds leave no AP; a Paladin who holds its last AP for Guard 2 gains 1.8 Guard a fight, of which 0.8 absorbs damage, against the 4.5 damage of the Weapon Attack it gave up. Letting the kept AP still pay a Reaction makes no measurable difference (Down 67-68%).
4. **The fit** (section 5): NPC Health stays (h 0.99 to 1.04); **NPC damage drops: the Basic attack tables × 0.57 for a quarter of the Health, × 0.64 for 30%, × 0.69 for a third** (with the Specials × 1.25: about × 0.48 / 0.55 / 0.60: the same fights). A Down in 1 fight of 10 (4 Standards) needs × 0.48 and costs 21% of the Health.
5. **A Reaction's worth, measured directly** (what it dealt, blocked or its Guard absorbed, per turn of its owner; sections 6 and 9; corrected after the first draft, which priced it by the party's total damage, capped in a fight to the death by the NPCs' Health): the basic Opportunity Attack 0.29 AP (0.9 a fight); **Shield of Faith 1d8 + [PMod] 0.74 AP, 2d6 + [PMod] 0.88, 2d8 + [PMod] 0.93** (it fires 2.4 times a fight; at the quarter factors a Standard's Basic attack is 3.4 / 6.3, so bigger dice saturate); "the unused part becomes Guard on the target" adds 0.01 (Guard follows Stacking and the Paladin already holds Divine Surge's); the Archer's Quick Draw (a Weapon Attack when an enemy within 5 squares moves closer, 1.2 a fight) 0.43, with 2[W] 0.70, Empowered 2 0.53, 1 Boon 0.48; **Overwatch** (a Weapon Attack after an enemy within 10 squares makes a Strike, 2.7 a fight) **0.96**, with 2[W] 1.55. (Numbers after the audit of 14.4.)
6. **The ceilings cut only the Nova** (section 7): Holy Wrath 3's turn 32.9 → 24.1, the Nova turn's share of a Paladin's damage 40% → 33%, NPC Health × 1.01 to keep 3.5 rounds. **× 0.75 on everything** cuts every turn by a quarter and needs NPC Health × 0.79 for the same fight: at level 1 it only rescales.
7. **The Health line** (section 8): at level 1 it is today's Health, and the Paladin and the Archer go Down equally often (0.05 a fight each at the quarter factors). At levels 5 and 8 it grows × 1.5 and × 2.1 (the party 192, 268) while today's NPC rows grow × 1.23 and × 1.41: a Standard needs 3.7 → 4.5 → 5.5 turns to Down the Paladin and 2.7 → 3.2 → 4.0 the Archer, so R-bestiary's Stage 2 and 3 rows need NPC damage × 1.2 and × 1.5 over today's to keep level 1's pace.

### 14.2 The sheet

**A. The Bestiary**

1. **The normal-fight target. Default: a quarter of the party's Health in 3.5 rounds.** At it (sheet section 5): 4 Standards 25% · Down 18%; the other CV 400 fights about 21-23% · Down 6-14% (a Down in about 1 normal fight of 9 on average); easy (CV 300) about 15% · 6%; hard (CV 500) about 39% · Down 40% · won 98%; deadly (CV 600) 43-58% · won 84-96%. It is "between a true fight and a filler fight" and leaves room for a four-fight day. Alternatives: 30% (Down 25%), a third (today's: Down 33%), a Down in 1 fight of 10 (21% of the Health). The book's encounter table becomes: easy about 15%, normal a quarter, hard about 40%, deadly about half (the party wins 84-96%).
2. **The Special multipliers. Default: keep × 1.4 / 2.2 / 3.5**; the cut goes on the Basic attack tables. The fit is the same either way (× 1.25 just means Basic tables × 0.49 instead of × 0.58, and a swingier turn); one table to change, not two.
3. **The NPC damage factor. Default: the Basic attack tables × 0.6 at every Stage and rating; NPC Health unchanged** (the fit: d 0.57, h 1.04, within the noise of 0.6 and 1). A Stage 1 Standard's Medium Basic attack 6 / 11 → 3.5 / 6.5; its 2 AP Special 13 / 24 → 8 / 14. R-bestiary rewrites the tables with it and the Stage rows with item 17.
4. **Minions' Specials. Default: as written** (a Minion may spend its 3 AP on its Special and two Basic attacks): its turn is × 3.3 the old calibration, but the Minion fight still lands under the Standards' (2 Standards + 8 Minions: 21%, Down 10%) because Minions walk and die. Alternative: a Minion makes at most 2 Strikes a turn.
5. **Elites. Default: Elite Escalation (decided: +1 a round from round 2) closes the gap**: at the same CV an Elite fight costs less than 4 Standards (21% against 25%; its Specials add × 1.5 to its turn, a Standard's × 2.16). An Elite's ladder: Escalation 1, its first attack each round has 1 Boon; 2, its Round Special can be used twice a round; 3, its Encounter Special comes back once. R-bestiary measures it to the Standards' share (not modeled here).

**B. Reactions and AP**

6. **The basic Reaction for everyone. DECIDED (Lucas): Opportunity Attack, without the Critical disrupt** (a Weapon Attack; for NPCs the Basic attack; when an enemy leaves your reach; a Critical no longer stops the movement: that becomes a Talent later). Worth 0.29 AP a turn: the floor everyone has, not the budget; Lucas's "at least 1 AP" applies to the Hallmark Reactions. The sheet's runs use it.
7. **Shield of Faith (a Paladin Hallmark Reaction). Default (the numbers after the audit): 1R, Turn, no Escalation needed, Distance 5: the damage is reduced by 2d6 + [PMod].** 0.88 AP measured (2.4 uses a fight), the simplest card that reaches the budget. "What the hit doesn't use becomes Guard on the target" adds 0.01 (Stacking), so it is dropped. Alternatives: today's 1d8 + [PMod] (0.74) with a Holy rider (the attacker takes [M] 1d6 Ho: about + 0.4 by arithmetic, not simulated; it feeds the Strained hooks), about 1.1 together; 2d8 + [PMod] (0.93).
8. **Bulwark of Faith (the other Paladin pick). Default: 1R, Round (was Encounter): the ally gains Guard equal to what one of their Rally Points heals (8 or 9 at level 1) before the damage**; the 2R Slide version goes. Not measured (a block of 8-9 on the first hit each round is above Shield of Faith's 6.5 and saturates the same way); R-classes prices both picks in the ruler.
9. **The Archer's two Hallmark Reactions. Default (revised, Lucas's question answered in 14.3): one is a frequent-trigger attack, one a setup / compression Reaction, both at about 1 AP.** The measured shapes (sheet section 9): Quick Draw (an enemy within 5 squares moves closer, 1.2 a fight) 0.43 AP with a Weapon Attack, 0.70 with 2[W], 0.53 with Empowered 2, 0.48 with a Boon; **Overwatch (after an enemy within 10 squares makes a Strike, once per NPC turn: 2.7 a fight) 0.96 with a plain Weapon Attack**, 1.55 with 2[W] (too much). Proposed pair: **Covering Shot** (1R, Trigger: an enemy within 10 squares makes a Strike: a Weapon Attack against it; ≈ 1 AP) and a setup pick with a trigger that comes every round (e.g. **Spotter**, 1R, Trigger: an ally makes a Strike against your Marked Quarry: it gains 1 Boon, and your next Lock & Loose this round costs 0 AP), priced by R-classes in the ruler.
10. **Unspent turn AP. Default: they become Guard (2 / 3 / 4 by Stage), and until your next turn each one can still pay a Reaction, losing its Guard.** It keeps the 2026-11-02 rule (unspent AP pay more Reactions) and adds the consolation; measured as good or slightly better than "the AP are gone" (section 4). Foundry: one counter more.
11. **Quickened. Default: Quickened N adds N AP to the turn's 4, never to the Reaction AP**; the mirror of Slowed (decided). Unspent Quickened AP become Guard like the others.

**C. Escalation**

12. **Momentum's text. Default:** "**Momentum.** After an encounter harder than easy (more than CV 75 per PC), your party has Momentum until it Rests: each of you starts your next encounter at Escalation 2 instead of 1. Momentum doesn't stack." **2 at every Stage** (3 at Stage 3 would make the Apex free in round 1). With Momentum a PC reaches Escalation 3 in 85% of the fights, without it in 74%. Plus the GM sidebar (decided): "+1 Escalation to the table after a bad turn of the dice."
13. **The hooks' wording. Default:** "Once an encounter, when you score a Critical, your Escalation increases by 1." and the class hook in the same form; **a hook that comes while you're at Escalation 3 isn't used** (it can still fire later in the encounter). That is what was measured (raises a fight: Critical 0.05-0.09, the Paladin's 0.32, the Archer's 0.62).
14. **The Apex's size. Default: an Encounter Action of 2 or 3 AP at the Encounter band (1.4 to 2.0 × a Round Action's damage per AP) and within the ceilings (item 16); a choice of two per class, picked at level 1.** It is used in 80% of the fights (1.7 turns at Escalation 3 a fight), so its budget is about 0.8 uses a fight.
15. **Today's Actives** (as a level, a 0 AP Round Active used every round is a Passive). **Defaults (revised after Lucas's note, 14.3):** **a budget per rung**, because every fight starts at Escalation 1 and a rung 1 Passive is on from the first turn: rung 1 about 0.4-0.6 AP a turn (Radiant Zeal is 0.6), rung 2 about 0.6-0.8, rung 3 about 0.8-1 (on fewer turns: 2.4 and 1.7 a fight). **Divine Surge** (as it is: 0.90 AP a turn, 6.9 allies' damage + 8.7 Guard used a fight; without it the normal fight costs 36% instead of 25%) **→ the rung 1 Passive keeps only the ally's [M] 1d8 Ho (about 0.4 AP); the Guard 2d6 goes** (Guard now comes from unspent AP and Shield of Faith); **Vanish → a 0R Reaction the rung grants: "While your Escalation is 1 or more, you have Vanish (0R, Round). Interrupt: An enemy would enter a square adjacent to you during a Move Action. You can Evade 1."** (Written with the book's movement words, 14.3: "moves" alone is not a defined trigger; the Opportunity Attack Talent's form is "would leave a square during a Move Action", so this is its mirror; the Evade is a Linked Action, so it costs no AP and that isn't written; an Evade doesn't trigger Reactions, and the enemy's Advance goes on, so it is a step away, not an escape.) The +1 Defense and the free Evade 2 every turn go (the old Vanish measured only 0.02 AP in damage taken, but a free Evade 2 every turn is positional power the model barely sees); Pinning Shot and Twin Shot → Archer Encounter Picks (1 AP, no Escalation needed: as Round Actives they are Weapon Attacks with a rider worth 1 to 2 damage a fight, part 1 section 4); Aura of Protection → a Paladin Encounter Pick (0 AP, no Escalation; an Apex at Escalation 3 would come in round 2 or 3, too late for "until the end of the encounter"); Hand of Mercy → a Paladin Talent (utility, not the combat ladder).

**D. Health, dice and Stages**

16. **The dice cut. Default: A, the ceilings:** "An Encounter Action's dice, besides [W] and [Mod], are at most its AP on Tier 2 and its AP + 1 on Tier 3; a Daily's one more on each; the same at every Stage." Today only Holy Wrath is over (3 AP 3d8 / 5d8 / 7d8 → 2d8 / 3d8 / 4d8; 2 AP 2d6 / 3d8 / 4d8 → 1d8 / 2d8 / 3d8): the Nova −27%, the fight unchanged (h 0.99). B (× 0.75 on everything) rewrites every card and NPC Health to reach the same fight.
17. **The Health values. Default: keep Lucas's** (Paladin 20 / 10, +12 / 6 at Stage 2, +14 / 7 at Stage 3; Archer 16 / 8, +9 / 5, +11 / 6; Human +3 / +2, Dwarf +4 Vigor / +1 Resolve, Elf +4 Resolve / +1 Vigor). Checked: level 1 = today's Health; both classes Down equally often; 65 / 35 holds (both 66% on Vigor; an Elf Archer high on Vigor is 17 / 12, 59 / 41); levels 5 / 8: the Paladin 53 / 74, the Archer 43 / 60 (the Paladin's 74 is above "60-70", the party's mean 67 is in it). **R-bestiary raises the Stage 2 and 3 NPC damage rows × 1.2 and × 1.5 over today's** (on top of item 3's × 0.6) so a Standard Downs a PC in as many turns as at level 1.
18. **The healing cards. Default: no change at Stage 1; the flat amounts step by Stage.** At level 1 the pools hardly move (the Paladin 40 → 35, the Archer 27 → 29): a Rally Point is a quarter of the pool by definition (Lay On Hands follows it), Divine Surge's Guard 2d6 is 20% of the Paladin's pool (18% today), Shield of Faith's block 19% (16%), Mending Light 9% (8%). Mending Light, the Guard dice and the blocks grow with the line in R-classes (Stage 2 × 1.5, Stage 3 × 2, like Guard from AP 2 / 3 / 4).
19. **The Talent cadence and the Stage levels. Default: a Talent at every level 1-10; at levels 5 and 8 (Stages 2 and 3) a Stage Talent from a bigger list instead of a general one**, with the Stage numbers: +1 to an Attribute, the Health line's step, Guard per AP 3 / 4, the Overcast limit 2 / 3, +1 Rally Point, and at Stage 3 Modifiers +1 (never above +4). The other levels give options only (a Talent, the class's new choices).
20. **Armor Training. Default: untouched** (it isn't AP, Health or Escalation).
21. **The Techniques and the 5 AP Talents. Default:** the 14 Techniques stay 1 AP Round (a quarter of the turn now); Whirlwind and Cut Through are re-costed in R-classes at 1 AP = 5.8 DE.
22. **The pool rename in the cards. Default:** R-core renames [B] / [M] to [V] / [R] in book/cards and the book in one pass; the book's and Foundry's parsers and the ruler read both spellings until R-Foundry's second version, then the old one is a test failure.

**E. Foundry and the playtest**

23. **Existing Foundry characters. Default: R-Foundry's first version migrates on load:** Health recomputed from the line (the sheet asks which side is high; Vigor by default), [B] / [M] read as [V] / [R], Escalation reset to a level (1 at the start of combat, 2 with Momentum), the class cards replaced from the compendium with a button (as v0.0.228 does for the Basic Actions); nothing deleted; a backup reminder first.
24. **Playtest 4. Default:** playtest 3's encounter (Ogre Chieftain, Orc Warrior, Bandit Thug, 2 Goblin Sneaks; CV 400) restatted by R-bestiary, the four PCs rebuilt at level 1 by R-classes, the Encounter Log on. What it checks against this sheet: 3.5 rounds, about a quarter of the party's Health, at most one Down, Escalation 3 by round 3, the Hallmark Reactions used about once a round each, the Specials used every round.

### 14.3 Lucas's answers (2026-11-04, first and second batch)
- **6: yes**, Opportunity Attack as the basic Reaction, **without the Critical disrupt** (a Critical on it no longer stops the movement; that becomes a Talent later). In the sheet's runs (spec.mjs `RULES.oaDisrupt` off).
- **9, a question: "doesn't 2[W] help, or Empowered? Most Actions are damage + condition; we could have more Setups and action compressions."** Answer, measured (sheet section 9): 2[W] helps most of the damage riders (Quick Draw 0.44 → 0.71 AP; Empowered 2 only 0.53, a Boon 0.46: Empowered adds +2 a die and a crossbow rolls one die), but **how often the trigger comes matters more than what the Reaction does**: the same Weapon Attack on a trigger that comes every NPC turn (Overwatch) is 0.97 AP. A setup or an action compression has the same arithmetic (saving 1 AP next turn is 1 AP each time it fires, 0.43 AP a turn at Quick Draw's rate), so it also wants a trigger that comes every round. 2[W] at level 1 also runs ahead of the Mastery ladder (D2: one more [W] from level 8). Agreed on the variety: item 9 now proposes one attack and one setup / compression Reaction for the Archer, and R-classes should give each class at least one setup or compression card among its picks.
- **15, a note: "these Passives are too strong (Evade plus Defense, Guard 2d6), and a rung 1 Passive is on from the end of your first turn."** Confirmed for Divine Surge (0.88 AP a turn, the strongest Passive measured; sheet section 10); Vanish's numbers are small in the model (0.04 AP), but a free Evade 2 every turn is the kind of power it misses. Item 15 now sets a budget per rung and cuts both.

- **15, second note: "careful with the word *moves*: check what the rules say about move; no need for *(no AP)*: Linked Actions don't cost AP."** Chapter 3 (Moving and Leaving Your Square) has three questions: a **Move Action** (the trait), **you moved** (Advance, Charge, Crawl, Evade: your own movement), **you left your square** (any change of position); and Chapter 2 defines **moves closer** for Reactions. "Moves adjacent" is none of them, so item 15 now writes Vanish's trigger in the Opportunity Attack Talent's form ("would enter a square adjacent to you during a Move Action") and drops "(no AP)".
- **The ruler against the rules (Lucas: "make sure it does as intended"):** section 14.4.

- **The sheet, decided (Lucas, 2026-11-04): "all defaults except the ones we already fixed."** So: every item of 14.2 at its default, with 6 as decided (Opportunity Attack, no Critical disrupt), 7 at its revised default (2d6 + [PMod]), 9 and 15 as revised in 14.3 (one attack and one setup Reaction for the Archer; the rung budget; Divine Surge without its Guard; Vanish as the 0R Reaction), and Killer's Focus to say "that deals damage" (R-classes). R-core starts from this section.

### 14.4 The ruler audited against the book (2026-11-04)

Every rule the fight model touches, read against rules-src (Chapters 1-4, 6-8, the cards) and spec.mjs / map.mjs. **Fixed** (the numbers of this document and rework-sheet.md are from the fixed ruler; report.md and rework.md were rewritten, the deltas below):
1. **Hallowed Stance** says "if you haven't left your square since your last turn"; the ruler applied it whenever the Paladin had Escalation 2, moving or not. Now a Paladin that moves during its turn loses the Stance until its next turn. Effect: the Stance reduces about 20% less (3.2 → 2.1 a fight in report.md's 4 Standards; Downs +1 to 2 points in the party fights).
2. **Radiant Zeal** says "the first [Strike] Action you make each round *that deals damage*"; the ruler spent it on the first Strike even on a Tier 1. Fixed (the card's ruler line says `first-hit`). **Killer's Focus** says "your first [Shot, Strike, Weapon] Action each round deals an extra [B] 1d6" without that clause, so a Tier 1 first Shot wastes it: the ruler now matches each card's words. **A question for R-classes:** should Killer's Focus say "that deals damage" too (the Archer's Tier 1 rate is about 30%)? The ruler's reading of a Tier 1 is "no damage, so no extra", as the book's damage rules say.
3. **Double Shot** targets "Two creatures": with one enemy left it has no valid target and **can't be used** (an "up to two" would be usable; Lucas, 2026-11-04). The ruler hit the same creature twice with no penalty, an attack no card allows; a player would spend the 2 AP on two Weapon Attacks (1 Bane on the second), which is what the ruler does now. Effect: the single-target turn tables drop 0.4 (28.3 → 27.9 at Escalation 3). The same holds for Twin Shot ("Two creatures no more than 5 squares apart"): the ruler models it as one Weapon Attack + 1d6 on one target (it was measured once, in part 1 section 4), a simplification listed below.
4. **[Mod] on a card is the Action's Modifier:** Smite 3's Guard 1d8 + [Mod] is the Weapon Modifier (the ruler used the Power Modifier; equal at level 1, so no number moved).
5. **Guard follows Stacking** (the higher value, Chapter 4): the sheet's "the rest of the block becomes Guard" added it; now it is the higher value. Effect: that part of Shield of Faith is worth 0.01 AP (item 7 drops it). The same pass found the sheet's Reaction worth subtracting the Guard a block spared (a block on a hit that Guard would have taken left the Guard for later): corrected, Shield of Faith 1d8 + [PMod] is 0.74 AP and 2d6 + [PMod] 0.88.
6. **The Opportunity Attack Talent's second trigger** ("or uses the Stand Action") was missing: an NPC that stands up next to a PC with the Talent and a kept AP now takes it. Its other trigger ("would leave a square during a Move Action", with a weapon that can target it) matched already: adjacent for a Greatsword, and an Evade never triggers it (Chapter 3), as in the ruler.
7. **A Reaction fires once per triggering Action:** the Quick Draw stand-in fired once per enemy per round; now once per Advance.
8. **The Bloodied and Strained Banes** (today's rule: 1 Bane on [Strike] and [Weapon] Actions while Bloodied) were never in the ruler (part 1 said so). They are now a switch (`RULES.bloodiedBanes`), **off by default** because every calibration so far was made without them and pack R removes them. Measured on today's 4 Standards fight: 32% → 33% of the Health, Down 27% → 30%: the omission was small.
9. A comment said the 1 AP that ends Immobilized is an Interact; it is 1 AP [Move] (the cost was right).

**Checked and matching the book:** AP, Reactions paid from the AP kept after the turn, Interrupt before the move and Trigger after; the At-will Bane per use (Linked Actions excepted, a Charge's Weapon Attack included); 3 Strikes a turn (Reactions in another creature's turn apart); Escalation +1 at the start of each round after the first, capped at 3, passives "while at least N"; Guard before Health and after damage reduction, ending with the encounter; the Health thresholds (rounded up each, × (Level + 17) / 16) and Rally Points (Rally + ⌈(Body + Mind + level) / 2⌉, a quarter of the pool each); AD 11 + armor, WD 11 + Power Modifier; Weapon Attack 0 / 1[W] + [Mod] / 1[W] + [Mod]; the Greatsword and Crossbow dice; the Charge (3 to Speed squares in a line, the Weapon Attack with 1 Boon counting toward At-will); Marked Quarry's Boon and Tier 1 floor; Divine Surge's one ally hit before the Paladin's next turn; Smite 2's +1 Defense for a round; Elusive once a round; Flanking (1 Boon per other flanker up to 3, minus the target's allies that threaten you); 2 Banes for a [Ranged] Action while Engaged and 1 into another's melee (Sharpshooter waives the second); far range 1 Bane, maximum 2; Prone (melee +1 Boon, ranged 1 Bane), Hindered (Speed halved), Immobilized (no Move, 1 AP to end it); Slowed on the AP regained; the NPC Modifier (⌈Body / 2⌉ + 1) and the Bestiary's Health and damage rows; a Critical as Doubles on a Tier 3 (about 1 in 12 of them).

**Still simplified, on purpose (the model's assumptions, not rule errors):** the NPCs' Strikes stand for their Bestiary damage a turn (with the Specials modeled only under the sheet's switch); Cover is drawn at random (5% Medium, 15% Low) instead of from walls; Lay On Hands ignores Reach; Twin Shot hits one target (+ 1d6) instead of two; Smite's light, Hindered's Speed on the PCs' plans, Vulnerable's Save Banes and the Save Actions' Cover Boons are not used; Down PCs are out of the fight (no Dying rolls, no Rally Point by an ally in the fight unless Lay On Hands); a Daily only in hard fights.

**Assumptions in the model** (revert any): Human PCs, high on Vigor (NPC Basic attacks are Vigor damage); every fight starts at 1, Momentum (2) in half; a Special is used whenever its AP fit, the Encounter one first; the Paladin's hook needs the ally within 5 squares of the Paladin, not of the enemy; Shield of Faith blocks the first hit that lands each NPC turn (the Special, when the NPC has one left); the hold variants of section 4 are price checks, not plans the builds use.
